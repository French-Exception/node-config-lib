import * as merge from "deepmerge"

import {ConfigurationLoaderFromDeclarationRequestBuilder} from "./ConfigurationLoaderFromDeclarationRequestBuilder"
import {ConfigurationLoaderFromFileRequestInterface} from "./../api/ConfigurationLoaderFromFileRequestInterface"

export class ConfigurationLoaderFromFileRequestBuilder extends ConfigurationLoaderFromDeclarationRequestBuilder implements ConfigurationLoaderFromFileRequestInterface {
    file: string

    withFile(file: string): ConfigurationLoaderFromFileRequestBuilder {
        this.file = file
        return this
    }

    async build(): Promise<ConfigurationLoaderFromFileRequestInterface> {
        return merge<ConfigurationLoaderFromFileRequestInterface>(await <any>super.build(), {file: this.file})
    }
}
