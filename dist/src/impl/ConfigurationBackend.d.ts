import { ConfigurationBackendInterface } from "./../api/ConfigurationBackendInterface";
import { Maybe } from "maybe.ts";
export declare class ConfigurationBackend implements ConfigurationBackendInterface {
    /**
     * The real object being used to contain the data
     */
    private real_object;
    /**
     *
     * @param baseObject Base object to use instead of empty object
     */
    constructor(baseObject?: object);
    /**
     * Merges object onto real_object
     * @param obj
     * @param clone
     */
    merge(obj: object, clone?: boolean): Promise<ConfigurationBackendInterface>;
    /**
     * Returns the real object backing data
     */
    getObject<T>(): Promise<T>;
    /**
     *
     * @param key
     */
    get<T>(key: Array<string>, target?: object): Promise<Maybe<T>>;
    /**
     *
     * @param key
     * @param value
     */
    set<T>(key: Array<string>, value: T, target?: object): Promise<ConfigurationBackendInterface | any>;
}
/** @todo from binder.js add licence & link **/
export declare const ARRAY_MATCH: RegExp;
export declare function _getProperty(target: object, path: Array<any>): any;
