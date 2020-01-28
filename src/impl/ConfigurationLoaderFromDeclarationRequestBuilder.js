"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConfigurationLoaderFromDeclarationRequestBuilder {
    withRoot(root) {
        this.root = root;
        return this;
    }
    withEnv(env) {
        this.env = env;
        return this;
    }
    with$($) {
        this.$ = $;
        return this;
    }
    withConfiguration(c) {
        this.configuration = c;
        return this;
    }
    withDeclaration(d) {
        this.declaration = d;
        return this;
    }
    async build() {
        return {
            root: this.root,
            env: this.env,
            declaration: this.declaration,
            $: this.$,
            configuration: this.configuration,
        };
    }
}
exports.ConfigurationLoaderFromDeclarationRequestBuilder = ConfigurationLoaderFromDeclarationRequestBuilder;
//# sourceMappingURL=ConfigurationLoaderFromDeclarationRequestBuilder.js.map