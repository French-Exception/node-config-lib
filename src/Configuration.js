"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigurationBackend_1 = require("./ConfigurationBackend");
const merge = require("deepmerge");
const Maybe = require("maybe.ts");
const fs = require("fs-extra");
exports.VERSION = '1.0';
const object_walker = require('object-walker');
class Configuration {
    constructor(args) {
        this.args = args || {};
        this.args.keyRegex = (!args || !args.keyRegex) ? new RegExp('%[^%]+?%', 'g') : args.keyRegex;
        this.args.env = (!args || !args.env) ? {} : args.env;
        this.args.$ = (!args || !args.$) ? this.args.env : merge(this.args.$, this.args.env);
        this.args.backend = (!args || !args.backend) ? new ConfigurationBackend_1.ConfigurationBackend(this.args.$) : args.backend;
        this._changes = [];
    }
    async merge(source) {
        await this.args.backend.merge(source);
        return this;
    }
    async get(interpolableKey, defaultIfUndef) {
        if ('string' != typeof interpolableKey || 0 === interpolableKey.length)
            throw new Error('Key must be a string and cannot be empty');
        const _interpolatedKey = await this.interpolateString(interpolableKey);
        const _rawValue = await this._get(_interpolatedKey);
        const _interpolatedValue = await this.interpolateValue(_rawValue);
        const _return = Maybe.or(_interpolatedValue, defaultIfUndef);
        return _return;
    }
    async getRaw(interpolatedKey) {
        if (undefined === interpolatedKey || null === interpolatedKey)
            throw new Error('Key cannot be empty');
        const _value = await this.args.backend.get(interpolatedKey);
        return _value;
    }
    async _get(interpolatedKey) {
        if (undefined === interpolatedKey || null === interpolatedKey || "" === interpolatedKey)
            throw new Error('Key cannot be empty');
        const _key = Array.isArray(interpolatedKey) ? interpolatedKey : interpolatedKey.split('.');
        const _value = await this.args.backend.get(_key);
        return _value;
    }
    async changes() {
        return this._changes;
    }
    resetChanges() {
        this._changes = [];
    }
    async save(toFile) {
        const changes = await (async () => {
            const _changes = await this.changes();
            const configToSave = new Configuration();
            await Promise.all(_changes
                .map(async (change) => {
                return await configToSave.set(change.interpolatedKey, change.value);
            }));
            return configToSave.getObject();
        })();
        const interpolatedSaveToFile = await this.interpolateString(toFile);
        const jsonFileStr = await (async () => {
            try {
                const s = await fs.readFile(interpolatedSaveToFile);
                return s.toString();
            }
            catch (e) {
                if ('ENOENT' === e.code)
                    return JSON.stringify({ imports: [], ns: '', $: {} });
                throw e;
            }
        })();
        const json = (() => {
            try {
                return JSON.parse(jsonFileStr);
            }
            catch (e) {
                throw e;
            }
        })();
        if (!json.$)
            json.$ = {};
        json.$ = merge(json.$, changes);
        await fs.writeFile(interpolatedSaveToFile, JSON.stringify({
            imports: json.imports ? json.imports : [],
            ns: json.ns ? json.ns : '',
            $: json.$
        }, null, 2));
        return interpolatedSaveToFile;
    }
    async getObject() {
        return this.args.backend.getObject();
    }
    async dump(raw) {
        const object = {};
        await (async () => {
            const firstLevelObjects = await this.getObject();
            const p = Object.keys(firstLevelObjects).map(async (key) => {
                const interpolatedKey = await this.interpolateString(key);
                const value = await this._get(interpolatedKey);
                if (raw)
                    object[interpolatedKey] = value;
                else
                    object[interpolatedKey] = await this.interpolateValue(value);
            });
            await Promise.all(p);
        })();
        return object;
    }
    async set(interpolableKey, value) {
        if (undefined === interpolableKey || null === interpolableKey || "" === interpolableKey)
            throw new Error('Key cannot be empty');
        const _interpolatedKey = await this.interpolateString(interpolableKey);
        const _key = _interpolatedKey.split('.');
        await this.args.backend.set(_key, value);
        this._changes.push({
            interpolableKey: interpolableKey,
            interpolatedKey: _interpolatedKey,
            value: value
        });
        return this;
    }
    async interpolateValue(_rawValue) {
        if ("string" === typeof _rawValue) {
            const _interpolatedValue = await this.interpolateString(_rawValue);
            return _interpolatedValue;
        }
        else if (Array.isArray(_rawValue) || (typeof _rawValue === 'function') || (typeof _rawValue === 'object')) {
            const _interpolatedValue = await this.interpolateObject(_rawValue);
            return _interpolatedValue;
        }
    }
    async interpolateString(interpolableString) {
        if (undefined === interpolableString || null === interpolableString)
            throw new Error('Key cannot be empty');
        const isStringInterpolable = await this.isStringInterpolable(interpolableString);
        if (true === isStringInterpolable) {
            const _first = await this._interpolateString(interpolableString);
            // check for interpolated keys returning interpolable keys like %%my.value%%
            // and again for %%%my.value%%% returning %%my.value1%% and again for %my.value2%
            if ('string' === typeof _first && this.isStringInterpolable(_first)) {
                return await this.interpolateString(_first);
            }
            else if ('object' === typeof _first || 'function' === typeof _first) {
                return await this.interpolateObject(_first);
            }
            return Maybe.just(_first);
        }
        return interpolableString;
    }
    async isStringInterpolable(string) {
        if (undefined === string || null === string)
            throw new Error('Key cannot be empty');
        const _parameters = this.extractParameters(string, this.args.keyRegex);
        return _parameters.length > 0;
    }
    async interpolateObject(_rawValue) {
        const _c = new ConfigurationBackend_1.ConfigurationBackend();
        const _collector = [];
        object_walker.walkObject(_rawValue, async (keys, value) => {
            _collector.push([keys, value]);
        });
        for (const collectedItem of _collector) {
            const _key = collectedItem[0].join('.');
            const _value = collectedItem[1];
            if ('string' === typeof (_value)) {
                const _interpolatedValue = await this.interpolateString(_value);
                await _c.set(_key, _interpolatedValue);
            }
            else if ('object' === typeof _value || Array.isArray(_value)) {
                const _interpolatedValue = await this.interpolateObject(_value);
                await _c.set(_key, _interpolatedValue);
            }
        }
        return await _c.getObject();
    }
    async _interpolateString(interpolableKey) {
        if (undefined === interpolableKey || null === interpolableKey)
            throw new Error('Key cannot be empty');
        let m;
        const _result = await (async () => {
            let k = interpolableKey;
            const _parameters = this.extractParameters(k, this.args.keyRegex);
            for (const parameterInfo of _parameters) {
                const _key = parameterInfo[0].substr(1, parameterInfo[0].length - 2);
                const _value = await this.getRaw(_key);
                if (undefined === _value)
                    throw new Error(`'${_key}' does not exist`);
                if ('string' === typeof _value) {
                    k = k.replace(parameterInfo[1], _value);
                }
                else if ('object' === typeof _value && 1 == _parameters.length) {
                    k = _value;
                }
            }
            return k;
        })();
        // can be string or object, so don't bother with it here, will be typed upper
        return _result;
    }
    extractParameters(key, regex) {
        if (undefined === key || null === key)
            throw new Error('Key cannot be empty');
        regex = regex || this.args.keyRegex;
        const r = [];
        let m;
        while ((m = regex.exec(key)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            m.forEach((match) => {
                r.push([match, new RegExp(match, 'g')]);
            });
        }
        return r;
    }
}
exports.Configuration = Configuration;
//# sourceMappingURL=Configuration.js.map