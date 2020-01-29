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
        this._keyParamsCache = {};
        this._changes = [];
        this._deletions = [];
    }
    async merge(source) {
        await this.args.backend.merge(source);
        return this;
    }
    async get(interpolableKey, defaultIfUndef) {
        const _interpolatedKey = await this.interpolateString(interpolableKey);
        const _rawValue = await this._get(_interpolatedKey);
        const _interpolatedValue = await this.interpolateValue(_rawValue);
        return Maybe.or(_interpolatedValue, defaultIfUndef);
    }
    /**
     * Returs raw, not interpolated values
     * Can include %% parameters to be resolved
     *
     * @param interpolatedKey
     * @private
     */
    async _get(interpolatedKey) {
        const _key = interpolatedKey.split('.');
        return (await this.args.backend.get(_key));
    }
    /**
     * Retains changes made to object, to be used on save()
     * @return changes
     */
    async changes() {
        return this._changes;
    }
    /**
     * Reset changes made to object.
     */
    async resetChanges() {
        this._changes = [];
        return this;
    }
    /**
     * Retains deletions made to object, to be used on save()
     */
    async deletions() {
        return this._deletions;
    }
    /**
     * Reset deletions made to object, to be used on save()
     */
    async resetDeletions() {
        this._deletions = [];
    }
    /**
     * caches parameters extraction
     */
    async keyParams() {
        return this._keyParamsCache;
    }
    async resetKeyParams() {
        this._keyParamsCache = {};
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
    /**
     *
     * @param interpolableKey
     * @param value
     */
    async set(interpolableKey, value) {
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
    /**
     *
     * @param _rawValue
     */
    async interpolateValue(_rawValue) {
        if ("string" === typeof _rawValue) {
            const _interpolatedValue = await this.interpolateString(_rawValue);
            return _interpolatedValue;
        }
        else if (Array.isArray(_rawValue) || (typeof _rawValue === 'object')) {
            const _interpolatedValue = await this.interpolateObject(_rawValue);
            return _interpolatedValue;
        }
        else {
            throw new Error('lol');
        }
    }
    /**
     *
     * @param interpolableString
     */
    async interpolateString(interpolableString) {
        const extractedParameters = await this.getStringExtractedParametersIfAnyOrFalse(interpolableString);
        if (false === extractedParameters) {
            return interpolableString;
        }
        if (extractedParameters && extractedParameters['params'].length > 0) {
            const _firstDerivative = await this._interpolateString(interpolableString);
            // check for interpolated keys returning interpolable keys like %%my.value%%
            // and again for %%%my.value%%% returning %%my.value1%% and again for %my.value2%
            if ('string' === typeof _firstDerivative) {
                const parameters = await this.getStringExtractedParametersIfAnyOrFalse(_firstDerivative);
                if (parameters) {
                    return await this.interpolateString(_firstDerivative);
                }
            }
            else if ('object' === typeof _firstDerivative || Array.isArray(_firstDerivative)) {
                return await this.interpolateObject(_firstDerivative);
            }
            return Maybe.just(_firstDerivative);
        }
        return interpolableString;
    }
    /**
     *
     * @param string
     */
    async getStringExtractedParametersIfAnyOrFalse(string) {
        const _parameters = this.extractParameters(string);
        if (_parameters.length > 0)
            return { key: string, params: _parameters };
        return false;
    }
    /**
     *
     * @param _rawValue
     */
    async interpolateObject(_rawValue) {
        const _c = new ConfigurationBackend_1.ConfigurationBackend();
        const _collector = [];
        object_walker
            .walkObject(_rawValue, (keys, value) => {
            _collector.push([keys, value]);
        });
        for (const collectedItem of _collector) {
            const _key = collectedItem[0];
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
    /**
     *
     * @param interpolableKey
     * @private
     */
    async _interpolateString(interpolableKey) {
        const _result = await (async () => {
            let k = interpolableKey;
            const _parameters = this.extractParameters(k);
            for (const parameterInfo of _parameters) {
                // remove %%
                const _key = parameterInfo[0].substr(1, parameterInfo[0].length - 2);
                // fetch Maybe value from backend;
                const _value = await this._get(_key);
                // test Maybe value, throwing if necessary
                if (undefined === _value)
                    throw new Error(`'${_key}' does not exist`);
                // if string : replace ; elseif object return object
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
    /**
     *
     * @param key
     */
    extractParameters(key) {
        if (this._keyParamsCache[key]) {
            return this._keyParamsCache[key];
        }
        const regex = this.args.keyRegex;
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
        this._keyParamsCache[key] = r;
        return r;
    }
}
exports.Configuration = Configuration;
//# sourceMappingURL=Configuration.js.map