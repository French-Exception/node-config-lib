export interface ConfigurationBackendInterface {
    set<T>(key: string | Array<string>, value: T): Promise<ConfigurationBackendInterface>

    get<T>(key: string | Array<string>): Promise<T | undefined>

    getObject<T>(): Promise<T>

    merge(source: object): Promise<ConfigurationBackendInterface>
}
