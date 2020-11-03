import { ConfigurationBackendInterface } from "./ConfigurationBackendInterface";
export interface ConfigurationConstructionArgumentsInterface {
    env?: object;
    backend?: ConfigurationBackendInterface;
    keyRegex?: RegExp;
    $?: object;
}
