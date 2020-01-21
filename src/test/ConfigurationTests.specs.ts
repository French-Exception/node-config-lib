import "mocha";
import {Configuration} from "../src/Configuration";
import {expect} from 'chai';
import * as path from "path";
import * as fs from "fs-extra"

describe('Configuration', function () {
    it('can be instantiated', async function (done) {
        const c = new Configuration({
            $: {
                foo: {
                    bar: 'foobar',
                    foobar: '%foo.bar%%foo.bar%'
                }
            }
        });

        const foobar = await c.get<string>('foo.bar');
        const foobar2 = await c.get<string>('foo.foobar');
        const foo = await c.get<object>('foo');

        expect(foobar).to.be.equal('foobar');
        expect(foobar2).to.be.equal('foobarfoobar');
        expect(foo).to.be.deep.equal({bar: 'foobar', foobar: 'foobarfoobar'});


        this.test.callback();
    })

    it('can set and get', async function () {
        const c = new Configuration();
        await c.set('foo.foo.bar', {foo: 'bar'});

        const foofoobar = await c.get<object>('foo.foo.bar', 'not found');

        expect(foofoobar).to.be.deep.equal({foo: 'bar'})
    })

    it('can save changes', async function () {
        const c = new Configuration({env: {env: 'dev'}});

        await c.set('foo', {bar: 'foobar'})

        const saveTo = path.join(path.dirname(__dirname), '..', 'test-res', '__test_%env%.json');

        const savedTo = await c.save(saveTo);

        const jsonSaved = await fs.readFile(savedTo)

        const loaded = JSON.parse(jsonSaved.toString());

        expect(loaded).to.be.deep.equal({$: {foo: {bar: 'foobar'}}, ns: '', imports: []});

        await fs.remove(savedTo);
    })
})
