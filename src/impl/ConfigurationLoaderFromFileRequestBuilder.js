"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const merge = require("deepmerge");
const ConfigurationLoaderFromDeclarationRequestBuilder_1 = require("./ConfigurationLoaderFromDeclarationRequestBuilder");
class ConfigurationLoaderFromFileRequestBuilder extends ConfigurationLoaderFromDeclarationRequestBuilder_1.ConfigurationLoaderFromDeclarationRequestBuilder {
    withFile(file) {
        this.file = file;
        return this;
    }
    async build() {
        return merge(await super.build(), { file: this.file });
    }
}
exports.ConfigurationLoaderFromFileRequestBuilder = ConfigurationLoaderFromFileRequestBuilder;
//# sourceMappingURL=ConfigurationLoaderFromFileRequestBuilder.js.map