import {ConfigurationInterface} from "./ConfigurationInterface"

export interface ConfigurationSaveRequestInterface {
    configuration: ConfigurationInterface
    toFile: string
}
