"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const impl_1 = require("./../src/impl/");
const chai_1 = require("chai");
const path = require("path");
const fs = require("fs-extra");
describe('Configuration', function () {
    it('can be instantiated', async function (done) {
        const c = new impl_1.Configuration({
            $: {
                foo: {
                    bar: 'foobar',
                    foobar: '%foo.bar%%foo.bar%'
                }
            }
        });
        const foobar = await c.get('foo.bar');
        const foobar2 = await c.get('foo.foobar');
        const foo = await c.get('foo');
        chai_1.expect(foobar).to.be.equal('foobar');
        chai_1.expect(foobar2).to.be.equal('foobarfoobar');
        chai_1.expect(foo).to.be.deep.equal({ bar: 'foobar', foobar: 'foobarfoobar' });
        this.test.callback();
    });
    it('can set and get', async function () {
        const c = new impl_1.Configuration();
        await c.set('foo.foo.bar', { foo: 'bar' });
        const foofoobar = await c.get('foo.foo.bar', 'not found');
        chai_1.expect(foofoobar).to.be.deep.equal({ foo: 'bar' });
    });
    it('can save changes', async function () {
        const c = new impl_1.Configuration({ env: { env: 'dev' } });
        await c.set('foo', { bar: 'foobar' });
        const to = path.join(path.dirname(__dirname), 'test-res', '__test_%env%.json');
        const savedTo = await c.save(to);
        const jsonSaved = await fs.readFile(savedTo);
        const loaded = JSON.parse(jsonSaved.toString());
        chai_1.expect(loaded).to.be.deep.equal({ $: { foo: { bar: 'foobar' } }, ns: '', imports: [] });
        await fs.remove(savedTo);
    });
});
//# sourceMappingURL=Configuration.specs.js.map