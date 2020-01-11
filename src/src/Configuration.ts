import {ConfigurationInterface} from "./ConfigurationInterface";
import * as _ from "underscore";
import {ConfigurationBackendInterface} from "./ConfigurationBackendInterface";
import {ConfigurationBackend} from "./ConfigurationBackend";

const object_walker = require('object-walker');

export interface ConfigurationConstructionArguments {
    env?: object;
    backend?: ConfigurationBackendInterface
    keyRegex?: RegExp
    $?: object
}

export class Configuration implements ConfigurationInterface {

    private readonly args: ConfigurationConstructionArguments;

    constructor(args?: ConfigurationConstructionArguments) {
        this.args = args || {};

        if (!args || !args.keyRegex)
            this.args.keyRegex = new RegExp('%[^%]+?%', 'g');

        if (!args || !args.env)
            this.args.env = {};

        if (!args || !args.$)
            this.args.$ = {};

        if (!args || !args.backend)
            this.args.backend = new ConfigurationBackend(this.args.$);
    }

    public async merge(source: object): Promise<ConfigurationInterface> {

        await this.args.backend.merge(source);

        return <ConfigurationInterface>this;
    }

    public async get<T>(interpolableKey: string, defaultIfUndef?: any): Promise<T> {
        if (undefined === interpolableKey || null === interpolableKey) throw new Error('Key cannot be empty');

        const _interpolatedKey = await this.interpolateString<string>(interpolableKey);
        const _rawValue: T = await this._get<T>(_interpolatedKey);
        const _interpolatedValue: T = await this.interpolateValue<T>((<any>_rawValue));
        return _interpolatedValue ? _interpolatedValue : defaultIfUndef;
    }

    public async getRaw<T>(interpolatedKey: string): Promise<T> {
        if (undefined === interpolatedKey || null === interpolatedKey) throw new Error('Key cannot be empty');

        const _value: T = await this.args.backend.get<T>(interpolatedKey);

        return _value;
    }

    public async _get<T>(interpolatedKey: string | Array<string>): Promise<T> {
        if (undefined === interpolatedKey || null === interpolatedKey || "" === interpolatedKey)
            throw new Error('Key cannot be empty');

        const _key: Array<string> = _.isArray(interpolatedKey) ? <Array<string>>interpolatedKey : <Array<string>>(<string>interpolatedKey).split('.');
        const _value: T = await this.args.backend.get<T>(_key);
        return _value;
    }

    public async set(interpolableKey: string, value: any): Promise<ConfigurationInterface> {
        if (undefined === interpolableKey || null === interpolableKey || "" === interpolableKey)
            throw new Error('Key cannot be empty');

        const _interpolatedKey = await this.interpolateString<string>(interpolableKey);
        await this.args.backend.set(_interpolatedKey.split('.'), value);

        return <ConfigurationInterface>this;
    }

    public async interpolateValue<T>(_rawValue: string | Array<any> | object): Promise<T> {
        if (_.isString(_rawValue)) {
            const _interpolatedValue = await this.interpolateString(<string><unknown>_rawValue)
            return <any>_interpolatedValue;
        } else if (_.isArray(_rawValue) || _.isObject(_rawValue)) {
            const _interpolatedValue: T = await this.interpolateObject<T>((<any>_rawValue));
            return _interpolatedValue;
        }
    }

    public async interpolateString<T>(interpolableString: string): Promise<T> {
        if (undefined === interpolableString || null === interpolableString) throw new Error('Key cannot be empty');

        const isStringInterpolable = await this.isStringInterpolable(interpolableString);
        if (true === isStringInterpolable) {
            const _first = await this._interpolateString<string>(interpolableString);
            // check for interpolated keys returning interpolable keys like %%my.value%%
            // and again for %%%my.value%%% returning %%my.value1%% and again for %my.value2%
            if (_.isString(_first) && this.isStringInterpolable(_first)) {
                return this.interpolateString(_first);
            } else if (_.isObject(_first)) {
                return this.interpolateObject<any>((<any>_first));
            }
            return <any>_first;
        }
        return <any>interpolableString;
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
            if (_.isString(_value)) {
                const _interpolatedValue = await this.interpolateString(_value);
                await _c.set(_key, _interpolatedValue);
            } else if (_.isObject(_value)) {
                const _interpolatedValue = await this.interpolateObject(_value);
                await _c.set(_key, _interpolatedValue);
            }
        }

        return <any>_c.getObject();
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
                if (_.isString(_value)) {
                    k = k.replace(parameterInfo[1], _value);
                } else if (_.isObject(_value) && 1 == _parameters.length) {
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


