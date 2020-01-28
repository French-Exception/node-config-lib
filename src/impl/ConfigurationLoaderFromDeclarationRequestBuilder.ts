import {ConfigurationInterface} from "./../api/ConfigurationInterface"
import {ConfigurationDeclarationInterface} from "./../api/ConfigurationDeclarationInterface"
import {ConfigurationLoaderFromDeclarationRequestInterface} from "./../api/ConfigurationLoaderFromDeclarationRequestInterface"

export class ConfigurationLoaderFromDeclarationRequestBuilder implements ConfigurationLoaderFromDeclarationRequestInterface {
    root?: string
    env?: object
    $?: object
    configuration?: ConfigurationInterface
    declaration?: ConfigurationDeclarationInterface

    withRoot(root: string): ConfigurationLoaderFromDeclarationRequestBuilder {
        this.root = root
        return this
    }

    withEnv(env: object): ConfigurationLoaderFromDeclarationRequestBuilder {
        this.env = env
        return this
    }

    with$($: object): ConfigurationLoaderFromDeclarationRequestBuilder {
        this.$ = $

        return this
    }

    withConfiguration(c: ConfigurationInterface): ConfigurationLoaderFromDeclarationRequestBuilder {
        this.configuration = c

        return this
    }

    withDeclaration(d: ConfigurationDeclarationInterface): ConfigurationLoaderFromDeclarationRequestBuilder {
        this.declaration = d

        return this
    }

    async build(): Promise<ConfigurationLoaderFromDeclarationRequestInterface> {
        return {
            root: this.root,
            env: this.env,
            declaration: this.declaration,
            $: this.$,
            configuration: this.configuration,
        }
    }
}
