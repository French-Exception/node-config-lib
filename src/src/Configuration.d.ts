import { ConfigurationInterface } from "./ConfigurationInterface";
import { ConfigurationBackendInterface } from "./ConfigurationBackendInterface";
import * as Maybe from "maybe.ts";
export declare const VERSION: string;
export interface ConfigurationConstructionArguments {
    env?: object;
    backend?: ConfigurationBackendInterface;
    keyRegex?: RegExp;
    $?: object;
}
export declare class Configuration implements ConfigurationInterface {
    private readonly args;
    private _changes;
    constructor(args?: ConfigurationConstructionArguments);
    merge(source: object): Promise<ConfigurationInterface>;
    get<T>(interpolableKey: string, defaultIfUndef?: any): Promise<Maybe.Maybe<T>>;
    getRaw<T>(interpolatedKey: string): Promise<T>;
    _get<T>(interpolatedKey: string | Array<string>): Promise<T>;
    changes(): Promise<Array<{}>>;
    resetChanges(): void;
    save(toFile: string): Promise<void>;
    getObject<T>(): Promise<T>;
    set(interpolableKey: string, value: any): Promise<ConfigurationInterface>;
    interpolateValue<T>(_rawValue: string | Array<any> | object): Promise<T>;
    interpolateString<T>(interpolableString: string): Promise<Maybe.Maybe<T>>;
    isStringInterpolable(string: string): Promise<boolean>;
    interpolateObject<T>(_rawValue: object): Promise<T>;
    protected _interpolateString<T>(interpolableKey: string): Promise<T>;
    protected extractParameters(key: string, regex?: RegExp): Array<[string, RegExp]>;
}
