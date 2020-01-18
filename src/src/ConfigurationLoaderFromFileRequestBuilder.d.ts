import { ConfigurationLoaderFromDeclarationRequestBuilder } from "./ConfigurationLoaderFromDeclarationRequestBuilder";
import { ConfigurationLoaderFromFileRequestInterface } from "./ConfigurationLoaderFromFileRequestInterface";
export declare class ConfigurationLoaderFromFileRequestBuilder extends ConfigurationLoaderFromDeclarationRequestBuilder implements ConfigurationLoaderFromFileRequestInterface {
    file: string;
    withFile(file: string): ConfigurationLoaderFromFileRequestBuilder;
    build(): Promise<ConfigurationLoaderFromFileRequestInterface>;
}
