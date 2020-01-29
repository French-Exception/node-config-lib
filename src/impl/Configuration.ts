import {ConfigurationInterface} from "./../api/ConfigurationInterface";
import {ConfigurationBackendInterface} from "./../api/ConfigurationBackendInterface";
import {ConfigurationDeletionInterface} from "./../api/ConfigurationDeletionInterface"
import {ConfigurationChangeInterface} from "./../api/ConfigurationChangeInterface"
import {ConfigurationConstructionArgumentsInterface} from "./../api/ConfigurationConstructionArgumentsInterface"
import {ConfigurationBackend} from "./ConfigurationBackend";
import {DictionaryInterface} from "./../api/DictionaryInterface";
import * as merge from "deepmerge";
import * as Maybe from "maybe.ts";
import * as fs from "fs-extra";

export const VERSION: string = '1.0';

const object_walker = require('object-walker');

export class Configuration implements ConfigurationInterface {

    /**
     * Construction arguments
     */
    private readonly args: ConfigurationConstructionArgumentsInterface;


    /**
     * Changes made using set() to be persisted on save()
     * @see Configuration.
     */
    private _changes: Array<ConfigurationChangeInterface<any>>;

    /**
     * Deletions requested to be persisted on save()
     */
    private _deletions: Array<ConfigurationDeletionInterface<any>>;

    private _keyParamsCache: DictionaryInterface<Array<[string, RegExp]>>;

    constructor(args?: ConfigurationConstructionArgumentsInterface) {
        this.args = args || {};
        this.args.keyRegex = (!args || !args.keyRegex) ? new RegExp('%[^%]+?%', 'g') : args.keyRegex;
        this.args.env = (!args || !args.env) ? {} : args.env;
        this.args.$ = (!args || !args.$) ? this.args.env : merge(this.args.$, this.args.env);
        this.args.backend = (!args || !args.backend) ? new ConfigurationBackend(this.args.$) : args.backend;

        this._keyParamsCache = {};
        this._changes = [];
        this._deletions = [];
    }


    public async merge(source: object): Promise<ConfigurationInterface> {
        await this.args.backend.merge(source);
        return this;
    }

    public async get<T>(interpolableKey: string, defaultIfUndef?: any): Promise<Maybe.Maybe<T>> {
        const _interpolatedKey = await this.interpolateString<string>(interpolableKey);
        const _rawValue: Maybe.Maybe<T> = await this._get<T>(<string>_interpolatedKey);
        const _interpolatedValue: T = await this.interpolateValue<T>((<any>_rawValue));

        return Maybe.or<T>(_interpolatedValue, defaultIfUndef);
    }

    /**
     * Returs raw, not interpolated values
     * Can include %% parameters to be resolved
     *
     * @param interpolatedKey
     * @private
     */
    public async _get<T>(interpolatedKey: string): Promise<Maybe.Maybe<T>> {
        const _key = interpolatedKey.split('.');
        return <Maybe.Maybe<T>>(await this.args.backend.get<T>(_key));
    }

    /**
     * Retains changes made to object, to be used on save()
     * @return changes
     */
    public async changes<T>(): Promise<Array<ConfigurationChangeInterface<T>>> {
        return this._changes;
    }

    /**
     * Reset changes made to object.
     */
    public async resetChanges() {
        this._changes = [];

        return this;
    }

    /**
     * Retains deletions made to object, to be used on save()
     */
    public async deletions() {
        return this._deletions;
    }

    /**
     * Reset deletions made to object, to be used on save()
     */
    public async resetDeletions() {
        this._deletions = [];
    }

    /**
     * caches parameters extraction
     */
    public async keyParams(): Promise<DictionaryInterface<Array<[string, RegExp]>>> {
        return this._keyParamsCache;
    }

    public async resetKeyParams() {
        this._keyParamsCache = {};
    }

    public async save(toFile: string): Promise<string> {
        const changes = await (async () => {
            const _changes = await this.changes();
            const configToSave = new Configuration();
            await Promise.all(
                _changes
                    .map(async (change: ConfigurationChangeInterface<any>) => {
                        return await configToSave.set(change.interpolatedKey, change.value);
                    })
            )
            return configToSave.getObject();
        })()

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
        })()

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
            });

            await Promise.all(p);
        })();

        return <any>object;
    }

    /**
     *
     * @param interpolableKey
     * @param value
     */
    public async set(interpolableKey: string, value: any): Promise<ConfigurationInterface> {
        const _interpolatedKey: Maybe.Maybe<string> = await this.interpolateString<string>(interpolableKey);
        const _key = (<string>_interpolatedKey).split('.');
        await this.args.backend.set(_key, value);

        this._changes.push({
            interpolableKey: interpolableKey,
            interpolatedKey: <string>_interpolatedKey,
            value: value
        });

        return this;
    }

    /**
     *
     * @param _rawValue
     */
    public async interpolateValue<T>(_rawValue: string | Array<any> | object): Promise<T> {
        if ("string" === typeof _rawValue) {
            const _interpolatedValue = await this.interpolateString(<string>_rawValue);
            return <any>_interpolatedValue;
        } else if (Array.isArray(_rawValue) || (typeof _rawValue === 'object')) {
            const _interpolatedValue: T = await this.interpolateObject<T>((<any>_rawValue));
            return _interpolatedValue;
        } else {
            throw new Error('lol');
        }
    }

    /**
     *
     * @param interpolableString
     */
    public async interpolateString<T>(interpolableString: string): Promise<Maybe.Maybe<T>> {
        const extractedParameters: { key: string, params: Array<[string, RegExp]> } | boolean
            = await this.getStringExtractedParametersIfAnyOrFalse(interpolableString);

        if (false === extractedParameters) {
            return <T><any>interpolableString;
        }

        if (extractedParameters && extractedParameters['params'].length > 0) {
            const _firstDerivative = await this._interpolateString<string | object>(interpolableString);
            // check for interpolated keys returning interpolable keys like %%my.value%%
            // and again for %%%my.value%%% returning %%my.value1%% and again for %my.value2%
            if ('string' === typeof _firstDerivative) {
                const parameters = await this.getStringExtractedParametersIfAnyOrFalse(_firstDerivative);
                if (parameters) {
                    return await this.interpolateString(_firstDerivative);
                }
            } else if ('object' === typeof _firstDerivative || Array.isArray(_firstDerivative)) {
                return await this.interpolateObject<any>((<any>_firstDerivative));
            }
            return Maybe.just<T>(<any>_firstDerivative);
        }
        return <T>(<any>interpolableString);
    }

    /**
     * @deprecated
     * @param string
     */
    public async isStringInterpolable(string: string): Promise<boolean> {
        const _parameters = this.extractParameters(string);

        return _parameters.length > 0;
    }

    /**
     *
     * @param string
     */
    public async getStringExtractedParametersIfAnyOrFalse(string: string): Promise<{ key: string, params: Array<[string, RegExp]> } | boolean> {
        const _parameters = this.extractParameters(string);

        if (_parameters.length > 0)
            return {key: string, params: _parameters};

        return false;
    }

    /**
     *
     * @param _rawValue
     */
    public async interpolateObject<T>(_rawValue: object): Promise<T> {
        const _c = new ConfigurationBackend();
        const _collector = [];

        object_walker
            .walkObject(_rawValue,
                (keys: Array<string>, value: any) => {
                    _collector.push([keys, value]);
                });

        for (const collectedItem of _collector) {
            const _key = collectedItem[0];
            const _value = collectedItem[1];
            if ('string' === typeof (_value)) {
                const _interpolatedValue = await this.interpolateString<string>(_value);
                await _c.set(_key, _interpolatedValue);
            } else if ('object' === typeof _value || Array.isArray(_value)) {
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
    protected async _interpolateString<T>(interpolableKey: string): Promise<T> {
        const _result = await (async () => {
            let k = interpolableKey;

            const _parameters = this.extractParameters(k);

            for (const parameterInfo of _parameters) {
                // remove %%
                const _key = parameterInfo[0].substr(1, parameterInfo[0].length - 2);

                // fetch Maybe value from backend;
                const _value = await this._get<string>(_key);

                // test Maybe value, throwing if necessary
                if (undefined === _value)
                    throw new Error(`'${_key}' does not exist`);

                // if string : replace ; elseif object return object
                if ('string' === typeof _value) {
                    k = k.replace(parameterInfo[1], _value);
                } else if ('object' === typeof _value && 1 == _parameters.length) {
                    k = _value;
                }
            }

            return k;
        })();

        // can be string or object, so don't bother with it here, will be typed upper
        return <T><any>_result;
    }

    /**
     *
     * @param key
     */
    public extractParameters(key: string): Array<[string, RegExp]> {
        if (this._keyParamsCache[key])
            return this._keyParamsCache[key];

        const regex = this.args.keyRegex
        const r = [];
        let m;
        while ((m = regex.exec(key)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++
            }

            m.forEach((match) => {
                r.push([match, new RegExp(match, 'g')]);
            })
        }

        this._keyParamsCache[key] = r;

        return r;
    }
}


