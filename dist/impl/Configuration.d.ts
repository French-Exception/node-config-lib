import { ConfigurationInterface } from "./../api/ConfigurationInterface";
import { ConfigurationDeletionInterface } from "./../api/ConfigurationDeletionInterface";
import { ConfigurationChangeInterface } from "./../api/ConfigurationChangeInterface";
import { ConfigurationConstructionArgumentsInterface } from "./../api/ConfigurationConstructionArgumentsInterface";
import { DictionaryInterface } from "./../api/DictionaryInterface";
import * as Maybe from "maybe.ts";
export declare const VERSION: string;
export declare class Configuration implements ConfigurationInterface {
    /**
     * Construction arguments
     */
    private readonly args;
    /**
     * Changes made using set() to be persisted on save()
     * @see Configuration.
     */
    private _changes;
    /**
     * Deletions requested to be persisted on save()
     */
    private _deletions;
    private _keyParamsCache;
    constructor(args?: ConfigurationConstructionArgumentsInterface);
    merge(source: object): Promise<ConfigurationInterface>;
    get<T>(interpolableKey: string, defaultIfUndef?: any): Promise<Maybe.Maybe<T>>;
    /**
     * Returs raw, not interpolated values
     * Can include %% parameters to be resolved
     *
     * @param interpolatedKey
     * @private
     */
    _get<T>(interpolatedKey: string): Promise<Maybe.Maybe<T>>;
    /**
     * Retains changes made to object, to be used on save()
     * @return changes
     */
    changes<T>(): Promise<Array<ConfigurationChangeInterface<T>>>;
    /**
     * Reset changes made to object.
     */
    resetChanges(): Promise<this>;
    /**
     * Retains deletions made to object, to be used on save()
     */
    deletions(): Promise<ConfigurationDeletionInterface<any>[]>;
    /**
     * Reset deletions made to object, to be used on save()
     */
    resetDeletions(): Promise<void>;
    /**
     * caches parameters extraction
     */
    keyParams(): Promise<DictionaryInterface<Array<[string, RegExp]>>>;
    resetKeyParams(): Promise<void>;
    save(toFile: string): Promise<string>;
    getObject<T>(): Promise<T>;
    dump<T>(raw?: boolean): Promise<T>;
    /**
     *
     * @param interpolableKey
     * @param value
     */
    set(interpolableKey: string, value: any): Promise<ConfigurationInterface>;
    /**
     *
     * @param _rawValue
     */
    interpolateValue<T>(_rawValue: string | Array<any> | object): Promise<T>;
    /**
     *
     * @param interpolableString
     */
    interpolateString<T>(interpolableString: string): Promise<Maybe.Maybe<T>>;
    /**
     *
     * @param string
     */
    getStringExtractedParametersIfAnyOrFalse(string: string): Promise<{
        key: string;
        params: Array<[string, RegExp]>;
    } | boolean>;
    /**
     *
     * @param _rawValue
     */
    interpolateObject<T>(_rawValue: object): Promise<T>;
    /**
     *
     * @param interpolableKey
     * @private
     */
    protected _interpolateString<T>(interpolableKey: string): Promise<T>;
    /**
     *
     * @param key
     */
    extractParameters(key: string): Array<[string, RegExp]>;
}
