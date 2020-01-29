import {Configuration} from "./../src/impl/"
import {expect} from 'chai'
import * as path from "path"
import * as fs from "fs-extra"
import {performance, PerformanceObserver} from 'perf_hooks';

const performanceObserver = new PerformanceObserver((items, observer) => {
    for (const item of items.getEntries()) {
        console.log(`${item.entryType}: ${item.name}: ${item.duration}ms`);
    }
    observer.disconnect();
});
performanceObserver.observe({entryTypes: ['measure']});

const unit_call = async (expect) => {
    const c = new Configuration({
        $: {
            foo: {
                bar: 'foobar',
                foobar: '%foo.bar%%foo.bar%'
            }
        }
    });

    const foobar = await c.get<string>('foo.bar');
    expect(foobar).to.be.equal('foobar');

    const foobar2 = await c.get<string>('foo.foobar');
    expect(foobar2).to.be.equal('foobarfoobar');

    const foo = await c.get<object>('foo');
    expect(foo).to.be.deep.equal({bar: 'foobar', foobar: 'foobarfoobar'});
}


describe('Configuration', function () {
    it('can be instantiated', async function (done) {

        await unit_call(expect)

        this.test.callback();

    })

    it('can set and get', async function () {
        const c = new Configuration()
        await c.set('foo.foo.bar', {foo: 'bar'})

        const foofoobar = await c.get<object>('foo.foo.bar', 'not found')

        expect(foofoobar).to.be.deep.equal({foo: 'bar'})

    })

    it('can save changes', async function () {
        const c = new Configuration({env: {env: 'dev'}})

        await c.set('foo', {bar: 'foobar'})

        const to = path.join(path.dirname(__dirname), 'test-res', '__test_%env%.json')

        const savedTo = await c.save(to)

        const jsonSaved = await fs.readFile(savedTo)

        const loaded = JSON.parse(jsonSaved.toString())

        expect(loaded).to.be.deep.equal({$: {foo: {bar: 'foobar'}}, ns: '', imports: []})

        await fs.remove(savedTo)

    })

    it('is performant', async function () {

        performance.mark('start');

        for (let i = 0, j = 100; i < j; i++)
            await unit_call(expect);

        performance.mark('end');

        performance.measure('start to end', 'start', 'end')
    })
})
