import { ConfigurationBackendInterface } from "./../api/ConfigurationBackendInterface";
export declare class ConfigurationBackend implements ConfigurationBackendInterface {
    private real_object;
    constructor(baseObject?: object);
    merge(obj: object): Promise<ConfigurationBackendInterface>;
    getObject<T>(): Promise<T>;
    get<T>(key: string | Array<string>): Promise<T | undefined>;
    set<T>(key: string | Array<string>, value: T): Promise<ConfigurationBackendInterface>;
}
export declare const ARRAY_MATCH: RegExp;
export declare function _getProperty(target: object, path: Array<any>): any;
