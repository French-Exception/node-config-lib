/// <reference types="node" />
import { ConfigurationInterface } from "./ConfigurationInterface";
import { ConfigurationDeclarationInterface } from "./ConfigurationDeclarationInterface";
import { EventEmitter } from "events";
import { ConfigurationLoaderFromDeclarationRequestInterface } from "./ConfigurationLoaderFromDeclarationRequestInterface";
import { ConfigurationLoaderFromFileRequestInterface } from "./ConfigurationLoaderFromFileRequestInterface";
export declare class ConfigurationLoader extends EventEmitter {
    fromDeclaration(args: ConfigurationLoaderFromDeclarationRequestInterface): Promise<ConfigurationInterface>;
    fromFile(args: ConfigurationLoaderFromFileRequestInterface): Promise<ConfigurationInterface>;
    protected imports(imports: Array<string>, configuration: ConfigurationInterface, root: string): Promise<ConfigurationInterface>;
    protected loadJsonDeclaration(file: string): Promise<ConfigurationDeclarationInterface>;
}
