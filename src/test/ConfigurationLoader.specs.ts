import "mocha"
import {expect} from "chai"
import {ConfigurationLoader, ConfigurationLoaderFromFileRequestBuilder} from "../"
import * as path from "path"
import * as Maybe from "maybe.ts"

describe('ConfigurationLoader', function () {
    it('can be loaded', async function (done) {

        const config = await (async () => {
            const loader = new ConfigurationLoader()
            const requestBuilder = new ConfigurationLoaderFromFileRequestBuilder()

            requestBuilder
                .withFile(path.normalize(path.join(__dirname, '../..', 'test-res', 'js.js')))
                .withRoot(path.normalize(path.join(__dirname, '../..', 'test-res')))
                .withEnv({env: 'dev'})

            const request = await requestBuilder.build()

            return await loader.fromFile(request)
        })()

        const foobar: Maybe.Maybe<string> = await config.get<string>('foo.bar')
        const foobar2: Maybe.Maybe<string> = await config.get<string>('foo.foobar')
        const foo: Maybe.Maybe<{ bar: string, foobar: string }> = await config.get<{ bar: string, foobar: string }>('foo')
        const promise: Maybe.Maybe<string> = await config.get<string>('promise')

        expect(foobar).to.be.equal('foobar')
        expect(foobar2).to.be.equal('foobarfoobar')
        expect(foo).to.be.deep.equal({bar: 'foobar', foobar: 'foobarfoobar'})
        expect(promise).to.be.deep.equal('resolved')

        this.test.callback()
    })
})
