/// <reference types="node" />
import { ConfigurationInterface } from "./../api/ConfigurationInterface";
import { ConfigurationDeclarationInterface } from "./../api/ConfigurationDeclarationInterface";
import { EventEmitter } from "events";
import { ConfigurationLoaderFromDeclarationRequestInterface } from "./../api/ConfigurationLoaderFromDeclarationRequestInterface";
import { ConfigurationLoaderFromFileRequestInterface } from "./../api/ConfigurationLoaderFromFileRequestInterface";
export declare class ConfigurationLoader extends EventEmitter {
    fromDeclaration(args: ConfigurationLoaderFromDeclarationRequestInterface): Promise<ConfigurationInterface>;
    fromFile(args: ConfigurationLoaderFromFileRequestInterface): Promise<ConfigurationInterface>;
    protected imports(imports: Array<string>, configuration: ConfigurationInterface, root: string): Promise<ConfigurationInterface>;
    protected reshapeDeclaration(declaration: ConfigurationDeclarationInterface): Promise<ConfigurationDeclarationInterface>;
    protected loadJsonDeclaration(file: string, configuration: ConfigurationInterface): Promise<ConfigurationDeclarationInterface>;
}
