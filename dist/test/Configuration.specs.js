"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const impl_1 = require("./../src/impl/");
const chai_1 = require("chai");
const path = require("path");
const fs = require("fs-extra");
const function_load_perf_tester_lib_1 = require("@frenchex/function-load-perf-tester-lib");
describe('Configuration', function () {
    it('can be instantiated', async function (done) {
        new impl_1.Configuration();
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
    it('is performant construction with $', async function () {
        const tester = new function_load_perf_tester_lib_1.FunctionLoadTester();
        (await tester
            .measureAverage(async () => {
            const c = new impl_1.Configuration({
                $: {
                    foo: {
                        bar: 'foobar',
                        foobar: '%foo.bar%%foo.bar%'
                    }
                }
            });
        }, 100, chai_1.expect))
            .to.be.lte(1000 /** make it high for loaded CI services **/, 'Configuration get takes avg less than');
    });
    it('is performant construction with $ and get simple and interpolated ones', async function () {
        const tester = new function_load_perf_tester_lib_1.FunctionLoadTester();
        const c = new impl_1.Configuration({
            $: {
                foo: {
                    bar: 'foobar',
                    foobar: '%foo.bar%%foo.bar%'
                }
            }
        });
        (await tester
            .measureAverage(async () => {
            const foobar = await c.get('foo.bar');
            chai_1.expect(foobar).to.be.equal('foobar');
            const foobar2 = await c.get('foo.foobar');
            chai_1.expect(foobar2).to.be.equal('foobarfoobar');
            const foo = await c.get('foo');
            chai_1.expect(foo).to.be.deep.equal({ bar: 'foobar', foobar: 'foobarfoobar' });
        }, 100, chai_1.expect))
            .to.be.lte(1000 /** make it high for loaded CI services **/, 'Configuration get takes avg lte');
    });
    function produceValueAndDerivatedMessage(value, msg) {
        return { value: value, msg: msg };
    }
    it('is performant construction', async function () {
        const tester = new function_load_perf_tester_lib_1.FunctionLoadTester();
        (await tester
            .measureAverage(async () => {
            new impl_1.Configuration();
        }, 100, chai_1.expect))
            .to.be.lte(1000 /** make it high for loaded CI services **/, `Construction must be lte`);
    });
    it('is performant set foo=bar', async function () {
        const tester = new function_load_perf_tester_lib_1.FunctionLoadTester();
        const configUnderTest = new impl_1.Configuration();
        (await tester
            .measureAverage(async () => {
            await configUnderTest.set('foo', 'bar');
        }, 100, chai_1.expect))
            .to.be.lessThan(1000 /** make it high for loaded CI services **/, 'Configuration.set foo bar lte');
    });
});
//# sourceMappingURL=Configuration.specs.js.map