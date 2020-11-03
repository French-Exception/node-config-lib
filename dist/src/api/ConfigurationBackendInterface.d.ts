import { Maybe } from "maybe.ts";
export interface ConfigurationBackendInterface {
    set<T>(key: Array<string>, value: T): Promise<ConfigurationBackendInterface>;
    get<T>(key: Array<string>): Promise<Maybe<T> | undefined>;
    getObject<T>(): Promise<T>;
    merge(source: object, clone?: boolean): Promise<ConfigurationBackendInterface>;
}
