import "mocha";
import {Configuration} from "../src/Configuration";
import {expect} from 'chai';

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

        await c.set('foo.foo.bar', {foo: 'bar'});

        const foofoobar = await c.get<object>('foo.foo.bar', 'not found');

        expect(foofoobar).to.be.deep.equal({foo: 'bar'})

        this.test.callback();
    })
})
