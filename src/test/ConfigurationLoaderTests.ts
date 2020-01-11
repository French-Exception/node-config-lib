import "mocha";

import {expect} from "chai"
import {ConfigurationLoader} from "../src";
import * as path from "path";
import {ConfigurationInterface} from "../src/ConfigurationInterface";

suite('ConfigurationLoader', function () {
    describe('ConfigurationLoader', function () {
        it('can be loaded', async function (done) {
            const loader = new ConfigurationLoader({});

            const config: ConfigurationInterface = await loader.fromFile({
                file: path.normalize(path.join(__dirname, '..', '..', 'test-res', 'js.js')),
                root: path.normalize(path.join(__dirname, '..', '..', 'test-res')),
                env: {env: 'dev'}
            });

            const foobar = await config.get<string>('foo.bar');
            const foobar2 = await config.get<string>('foo.foobar');
            const foo = await config.get<object>('foo');
            const promise = await config.get<object>('promise');

            expect(foobar).to.be.equal('foobar');
            expect(foobar2).to.be.equal('foobarfoobar');
            expect(foo).to.be.deep.equal({bar: 'foobar', foobar: 'foobarfoobar'});
            expect(promise).to.be.deep.equal('resolved');

            this.test.callback();
        })
    })
})

