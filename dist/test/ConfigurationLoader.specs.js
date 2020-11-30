"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const __1 = require("../");
const path = require("path");
describe('ConfigurationLoader', function () {
    it('can be loaded', async function (done) {
        const config = await (async () => {
            const loader = new __1.ConfigurationLoader();
            const requestBuilder = new __1.ConfigurationLoaderFromFileRequestBuilder();
            requestBuilder
                .withFile(path.normalize(path.join(__dirname, '../..', 'test-res', 'js.js')))
                .withRoot(path.normalize(path.join(__dirname, '../..', 'test-res')))
                .withEnv({ env: 'dev' });
            const request = await requestBuilder.build();
            return await loader.fromFile(request);
        })();
        const foobar = await config.get('foo.bar');
        const foobar2 = await config.get('foo.foobar');
        const foo = await config.get('foo');
        const promise = await config.get('promise');
        chai_1.expect(foobar).to.be.equal('foobar');
        chai_1.expect(foobar2).to.be.equal('foobarfoobar');
        chai_1.expect(foo).to.be.deep.equal({ bar: 'foobar', foobar: 'foobarfoobar' });
        chai_1.expect(promise).to.be.deep.equal('resolved');
        this.test.callback();
    });
});
//# sourceMappingURL=ConfigurationLoader.specs.js.map