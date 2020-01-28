import { ConfigurationInterface } from "./ConfigurationInterface";
import { ConfigurationDeclarationInterface } from "./ConfigurationDeclarationInterface";
export interface ConfigurationLoaderFromDeclarationRequestInterface {
    root?: string;
    env?: object;
    $?: object;
    configuration?: ConfigurationInterface;
    declaration?: ConfigurationDeclarationInterface;
}
