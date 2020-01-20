import * as Maybe from "maybe.ts"

export interface ConfigurationInterface {

    get<T>(interpolableKey: string, defaultIfUndef?: any): Promise<Maybe.Maybe<T>>

    set(interpolableKey: string, value: any): Promise<ConfigurationInterface>

    merge(source: object): Promise<ConfigurationInterface>;

    interpolateString<T>(str: string): Promise<Maybe.Maybe<T>>

    interpolateValue<T>(interpolable: string | Array<any> | object): Promise<Maybe.Maybe<T>>;

    save(toFile: string): Promise<string>

    changes(): Promise<object>

    getObject<T>(): Promise<T>
}
