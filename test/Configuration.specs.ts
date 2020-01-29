import {Configuration} from './../src/impl/';
import {expect} from 'chai';
import * as path from 'path';
import * as fs from 'fs-extra';
import {FunctionLoadTester} from '@frenchex/function-load-perf-tester-lib'

describe('Configuration', function () {
    it('can be instantiated', async function (done) {
        new Configuration();

        this.test.callback();
    })

    it('can set and get', async function () {
        const c = new Configuration();
        await c.set('foo.foo.bar', {foo: 'bar'});

        const foofoobar = await c.get<object>('foo.foo.bar', 'not found');

        expect(foofoobar).to.be.deep.equal({foo: 'bar'});

    })

    it('can save changes', async function () {
        const c = new Configuration({env: {env: 'dev'}});

        await c.set('foo', {bar: 'foobar'});

        const to = path.join(path.dirname(__dirname), 'test-res', '__test_%env%.json');

        const savedTo = await c.save(to);

        const jsonSaved = await fs.readFile(savedTo);

        const loaded = JSON.parse(jsonSaved.toString());

        expect(loaded).to.be.deep.equal({$: {foo: {bar: 'foobar'}}, ns: '', imports: []});

        await fs.remove(savedTo);

    });

    it('is performant construction with $', async function () {
        const tester = new FunctionLoadTester();

        (await tester
            .measureAverage(async () => {
                    const c = new Configuration({
                        $: {
                            foo: {
                                bar: 'foobar',
                                foobar: '%foo.bar%%foo.bar%'
                            }
                        }
                    });
                },
                100,
                expect
            ))
            .to.be.lte(1000 /** make it high for loaded CI services **/, 'Configuration get takes avg less than');
    });

    it('is performant construction with $ and get simple and interpolated ones', async function () {
        const tester = new FunctionLoadTester();

        const c = new Configuration({
            $: {
                foo: {
                    bar: 'foobar',
                    foobar: '%foo.bar%%foo.bar%'
                }
            }
        });

        (await tester
            .measureAverage(async () => {
                    const foobar = await c.get<string>('foo.bar');
                    expect(foobar).to.be.equal('foobar');

                    const foobar2 = await c.get<string>('foo.foobar');
                    expect(foobar2).to.be.equal('foobarfoobar');

                    const foo = await c.get<object>('foo');
                    expect(foo).to.be.deep.equal({bar: 'foobar', foobar: 'foobarfoobar'});
                },
                100,
                expect
            ))
            .to.be.lte(1000 /** make it high for loaded CI services **/,
            'Configuration get takes avg lte');
    });

    function produceValueAndDerivatedMessage(value: number, msg: string) {
        return {value: value, msg: msg}
    }

    it('is performant construction', async function () {
        const tester = new FunctionLoadTester();

        (await tester
            .measureAverage(async () => {
                    new Configuration();
                },
                100,
                expect
            ))
            .to.be.lte(1000 /** make it high for loaded CI services **/, `Construction must be lte`);

    });

    it('is performant set foo=bar', async function () {

        const tester = new FunctionLoadTester();
        const configUnderTest = new Configuration();

        (await tester
            .measureAverage(async () => {
                    await configUnderTest.set('foo', 'bar');
                },
                100,
                expect
            ))
            .to.be.lessThan(1000 /** make it high for loaded CI services **/,
            'Configuration.set foo bar lte')

    });
})
