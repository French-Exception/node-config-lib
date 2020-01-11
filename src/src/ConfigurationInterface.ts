export interface ConfigurationInterface {
    get<T>(interpolableKey: string, defaultIfUndef?: any): Promise<T>

    set(interpolableKey: string, value: any): Promise<ConfigurationInterface>

    merge(source: object): Promise<ConfigurationInterface>;

    interpolateString<T>(str: string): Promise<T>

    interpolateValue<T>(interpolable: string | Array<any> | object): Promise<T>;
}
