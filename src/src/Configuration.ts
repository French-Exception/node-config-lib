import {ConfigurationInterface} from "./ConfigurationInterface";
import {ConfigurationBackendInterface} from "./ConfigurationBackendInterface";
import {ConfigurationBackend} from "./ConfigurationBackend";
import * as merge from "deepmerge";
import * as Maybe from "maybe.ts"
import * as fs from "fs-extra"

export const VERSION: string = '1.0'

const object_walker = require('object-walker');

export interface ConfigurationConstructionArguments {
    env?: object;
    backend?: ConfigurationBackendInterface
    keyRegex?: RegExp
    $?: object
}

interface ConfigurationChange<T> {
    interpolatedKey: string
    interpolableKey: string
    value: T
}

export class Configuration implements ConfigurationInterface {

    private readonly args: ConfigurationConstructionArguments;

    private _changes: Array<ConfigurationChange<any>>;

    constructor(args?: ConfigurationConstructionArguments) {
        this.args = args || {};
        this.args.keyRegex = (!args || !args.keyRegex) ? new RegExp('%[^%]+?%', 'g') : args.keyRegex;
        this.args.env = (!args || !args.env) ? {} : args.env;
        this.args.$ = (!args || !args.$) ? this.args.env : merge(this.args.$, this.args.env);
        this.args.backend = (!args || !args.backend) ? new ConfigurationBackend(this.args.$) : args.backend;

        this._changes = [];
    }


    public async merge(source: object): Promise<ConfigurationInterface> {
        await this.args.backend.merge(source);
        return <ConfigurationInterface>this;
    }

    public async get<T>(interpolableKey: string, defaultIfUndef?: any): Promise<Maybe.Maybe<T>> {
        if (undefined === interpolableKey || null === interpolableKey) throw new Error('Key cannot be empty');

        const _interpolatedKey = await this.interpolateString<string>(interpolableKey);
        const _rawValue: T = await this._get<T>(<string>_interpolatedKey);
        const _interpolatedValue: T = await this.interpolateValue<T>((<any>_rawValue));

        const _return = Maybe.or<T>(_interpolatedValue, defaultIfUndef);

        return _return;
    }

    public async getRaw<T>(interpolatedKey: string): Promise<Maybe.Maybe<T>> {
        if (undefined === interpolatedKey || null === interpolatedKey) throw new Error('Key cannot be empty');
        const _value: T = await this.args.backend.get<T>(interpolatedKey);
        return _value;
    }

    public async _get<T>(interpolatedKey: string | Array<string>): Promise<T> {
        if (undefined === interpolatedKey || null === interpolatedKey || "" === interpolatedKey)
            throw new Error('Key cannot be empty');

        const _key: Array<string> = Array.isArray(interpolatedKey) ? <Array<string>>interpolatedKey : <Array<string>>(<string>interpolatedKey).split('.');
        const _value: T = await this.args.backend.get<T>(_key);
        return _value;
    }

    public async changes(): Promise<Array<{}>> {
        return this._changes;
    }

    public resetChanges() {
        this._changes = [];
    }

    public async save(toFile: string): Promise<string> {
        const changes = await (async () => {
            const _changes = await this.changes();
            const configToSave = new Configuration();
            await Promise.all(
                _changes
                    .map(async (change: ConfigurationChange<any>) => {
                        return await configToSave.set(change.interpolatedKey, change.value);
                    })
            );
            return configToSave.getObject();
        })();

        const interpolatedSaveToFile: string = <string>await this.interpolateString(toFile);

        const jsonFileStr: string = await (async () => {
            try {
                const s = await fs.readFile(interpolatedSaveToFile);
                return s.toString();
            } catch (e) {
                if ('ENOENT' === e.code)
                    return JSON.stringify({imports: [], ns: '', $: {}});
                throw e;
            }
        })();

        const json = (() => {
            try {
                return JSON.parse(jsonFileStr);
            } catch (e) {
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

    public async getObject<T>(): Promise<T> {
        return this.args.backend.getObject();
    }

    public async dump<T>(raw?: boolean): Promise<T> {
        const object = {};

        await (async () => {
            const firstLevelObjects = await this.getObject();

            const p = Object.keys(firstLevelObjects).map(async (key: string) => {
                const interpolatedKey = <string>await this.interpolateString(key);
                const value = await this._get(interpolatedKey);
                if (raw)
                    object[interpolatedKey] = value;
                else
                    object[interpolatedKey] = await this.interpolateValue(<any>value);
            })

            await Promise.all(p);
        })();

        return <any>object;
    }

    public async set(interpolableKey: string, value: any): Promise<ConfigurationInterface> {
        if (undefined === interpolableKey || null === interpolableKey || "" === interpolableKey)
            throw new Error('Key cannot be empty');

        const _interpolatedKey: Maybe.Maybe<string> = await this.interpolateString<string>(interpolableKey);
        const _key = (<string>_interpolatedKey).split('.')
        await this.args.backend.set(_key, value);

        this._changes.push({
            interpolableKey: interpolableKey,
            interpolatedKey: <string>_interpolatedKey,
            value: value
        });

        return <ConfigurationInterface>this;
    }

    public async interpolateValue<T>(_rawValue: string | Array<any> | object): Promise<T> {
        if ("string" === typeof _rawValue) {
            const _interpolatedValue = await this.interpolateString(<string><unknown>_rawValue);
            return <any>_interpolatedValue;
        } else if (Array.isArray(_rawValue) || (typeof _rawValue === 'function') || (typeof _rawValue === 'object')) {
            const _interpolatedValue: T = await this.interpolateObject<T>((<any>_rawValue));
            return _interpolatedValue;
        }
    }

    public async interpolateString<T>(interpolableString: string): Promise<Maybe.Maybe<T>> {
        if (undefined === interpolableString || null === interpolableString) throw new Error('Key cannot be empty');

        const isStringInterpolable = await this.isStringInterpolable(interpolableString);
        if (true === isStringInterpolable) {
            const _first: string | object = await this._interpolateString<string>(interpolableString);
            // check for interpolated keys returning interpolable keys like %%my.value%%
            // and again for %%%my.value%%% returning %%my.value1%% and again for %my.value2%
            if ('string' === typeof _first && this.isStringInterpolable(_first)) {
                return await this.interpolateString(_first);
            } else if ('object' === typeof _first || 'function' === typeof _first) {
                return await this.interpolateObject<any>((<any>_first));
            }
            return Maybe.just<T>(<any>_first);
        }
        return (<any>interpolableString);
    }

    public async isStringInterpolable(string: string): Promise<boolean> {
        if (undefined === string || null === string) throw new Error('Key cannot be empty');
        const _parameters = this.extractParameters(string, this.args.keyRegex);
        return _parameters.length > 0;
    }

    public async interpolateObject<T>(_rawValue: object): Promise<T> {
        const _c = new ConfigurationBackend();
        const _collector = [];
        object_walker.walkObject(_rawValue, async (keys: Array<string>, value: any) => {
            _collector.push([keys, value]);
        });

        for (const collectedItem of _collector) {
            const _key = collectedItem[0].join('.');
            const _value = collectedItem[1];
            if ('string' === typeof (_value)) {
                const _interpolatedValue = await this.interpolateString(_value);
                await _c.set(_key, _interpolatedValue);
            } else if ('object' === typeof _value || Array.isArray(_value)) {
                const _interpolatedValue = await this.interpolateObject(_value);
                await _c.set(_key, _interpolatedValue);
            }
        }

        return await _c.getObject();
    }


    protected async _interpolateString<T>(interpolableKey: string): Promise<T> {
        if (undefined === interpolableKey || null === interpolableKey) throw new Error('Key cannot be empty');

        let m;

        const _result = await (async () => {
            let k = interpolableKey;

            const _parameters = this.extractParameters(k, this.args.keyRegex);

            for (const parameterInfo of _parameters) {
                const _key = parameterInfo[0].substr(1, parameterInfo[0].length - 2);
                const _value = await this.getRaw<string>(_key);
                if (undefined === _value)
                    throw new Error(`'${_key}' does not exist`)
                if ('string' === typeof _value) {
                    k = k.replace(parameterInfo[1], _value);
                } else if ('object' === typeof _value && 1 == _parameters.length) {
                    k = _value;
                }
            }

            return k;
        })();

        // can be string or object, so don't bother with it here, will be typed upper
        return <any>_result;
    }


    protected extractParameters(key: string, regex?: RegExp): Array<[string, RegExp]> {
        if (undefined === key || null === key) throw new Error('Key cannot be empty');

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


