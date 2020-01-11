import { ConfigurationInterface } from "./ConfigurationInterface";
import { ConfigurationDeclarationInterface } from "./ConfigurationDeclarationInterface";
export interface ConfigurationLoaderConstructorArguments {
    $?: object;
    configuration?: ConfigurationInterface;
}
export interface ConfigurationLoaderFromFileRequest {
    file: string;
    root: string;
    $?: object;
    configuration?: ConfigurationInterface;
    env?: object;
}
export declare class ConfigurationLoader {
    readonly $: object;
    readonly configuration: ConfigurationInterface;
    constructor(args?: ConfigurationLoaderConstructorArguments);
    fromFile(args: ConfigurationLoaderFromFileRequest): Promise<ConfigurationInterface>;
    protected loadJsonDeclarationFromFilesystem(absoluteFilepath: string): Promise<any>;
    protected loadJsonDeclaration(file: string): Promise<ConfigurationDeclarationInterface>;
}
