[![npm version](https://badge.fury.io/js/%40frenchex%2Fconfig-lib.svg)](https://badge.fury.io/js/%40frenchex%2Fconfig-lib)

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
const loader = new ConfigurationLoader();
const request = (() => {
    const requestBuilder = new ConfigurationLoaderFromFileRequestBuilder();

    requestBuilder
        .withFile(path.normalize(path.join(__dirname, '..', '..', 'test-res', 'js.js')))
        .withRoot(path.normalize(path.join(__dirname, '..', '..', 'test-res')))
        .withEnv({env: 'dev'})

    return requestBuilder.build();
})();

const config: ConfigurationInterface = await loader.fromFile(request);
const foobar : string = await config.get<string>('foo.bar'); // return Maybe.just('foobar');
```


# Usages examples (from tests)

## Usage 1
```typescript
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
```

## Usage 2

```typescript
 const loader = new ConfigurationLoader();

const request = await (async () => {
    const requestBuilder = new ConfigurationLoaderFromFileRequestBuilder();

    requestBuilder
        .withFile(path.normalize(path.join(__dirname, '..', '..', 'test-res', 'js.js')))
        .withRoot(path.normalize(path.join(__dirname, '..', '..', 'test-res')))
        .withEnv({env: 'dev'})

    const request = await requestBuilder.build();

    return request;
})();

const config: ConfigurationInterface = await loader.fromFile(request);

const foobar = await config.get<string>('foo.bar');
const foobar2 = await config.get<string>('foo.foobar');
const foo = await config.get<object>('foo');
const promise = await config.get<object>('promise');

expect(foobar).to.be.equal('foobar');
expect(foobar2).to.be.equal('foobarfoobar');
expect(foo).to.be.deep.equal({bar: 'foobar', foobar: 'foobarfoobar'});
expect(promise).to.be.deep.equal('resolved');
```
