# About

Configuration Library is inspired by ```service-container2``` and ```Symfony Dependency Injection Container```

Purpose here is not to provide a full feature mapping from both libs.

# Installation

```bash
npm i --save @frenchex/config-lib
```

# Usage

## Basic JSON file structure 

```typescript
export interface ConfigurationDeclarationInterface {
    imports?: Array<string>
    ns?: string
    $: object
}
```

Example :
```
{
  "imports": ["config_%env%.json"],
  "ns": "example",
  "$": {
    "foo": {
      "bar": "foobar",
      "foobar": "%foo.bar%%foo.bar%"
    }
  }
}

```

## Loading from File

```typescript
const loader = new ConfigurationLoader({});

const config: ConfigurationInterface = await loader.fromFile({
    file: path.normalize(path.join(__dirname, '..', '..', 'test-res', 'js.js')),
    root: path.normalize(path.join(__dirname, '..', '..', 'test-res')),
    env: {env: 'dev'}
});

const foobar : string = await config.get<string>('foo.bar');
```


# Usages examples (from tests)

## Usage 1
```typescript
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

        this.test.callback();
    })
})


```

## Usage 2

```typescript

import "mocha";
import {expect} from "chai"
import {ConfigurationLoader} from "../src";
import {ConfigurationInterface} from "../src/ConfigurationInterface";
import * as path from "path";

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
```
