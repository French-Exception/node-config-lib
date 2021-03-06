import { ConfigurationInterface } from "./../api/ConfigurationInterface";
import { ConfigurationDeclarationInterface } from "./../api/ConfigurationDeclarationInterface";
import { ConfigurationLoaderFromDeclarationRequestInterface } from "./../api/ConfigurationLoaderFromDeclarationRequestInterface";
export declare class ConfigurationLoaderFromDeclarationRequestBuilder implements ConfigurationLoaderFromDeclarationRequestInterface {
    root?: string;
    env?: object;
    $?: object;
    configuration?: ConfigurationInterface;
    declaration?: ConfigurationDeclarationInterface;
    withRoot(root: string): ConfigurationLoaderFromDeclarationRequestBuilder;
    withEnv(env: object): ConfigurationLoaderFromDeclarationRequestBuilder;
    with$($: object): ConfigurationLoaderFromDeclarationRequestBuilder;
    withConfiguration(c: ConfigurationInterface): ConfigurationLoaderFromDeclarationRequestBuilder;
    withDeclaration(d: ConfigurationDeclarationInterface): ConfigurationLoaderFromDeclarationRequestBuilder;
    build(): Promise<ConfigurationLoaderFromDeclarationRequestInterface>;
}
