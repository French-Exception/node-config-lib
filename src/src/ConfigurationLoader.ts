import {ConfigurationInterface} from "./ConfigurationInterface";
import * as fs from "fs-extra";
import {ConfigurationDeclarationInterface} from "./ConfigurationDeclarationInterface";
import {Configuration} from "./Configuration";

const path = require('path');

export interface ConfigurationLoaderConstructorArguments {
    $?: object
    configuration?: ConfigurationInterface
}

export interface ConfigurationLoaderFromFileRequest {
    file: string
    root: string
    $?: object;
    configuration?: ConfigurationInterface;
    env?: object;
}

export class ConfigurationLoader {
    readonly $: object;
    readonly configuration: ConfigurationInterface;

    constructor(args?: ConfigurationLoaderConstructorArguments) {
        this.$ = args.$ || {};
        this.configuration = args.configuration || new Configuration({});
    }

    public async fromFile(args: ConfigurationLoaderFromFileRequest): Promise<ConfigurationInterface> {
        if (!args.env) args.env = {};
        if (!args.file) throw new Error('missing file');
        if (!path.isAbsolute(args.file) && !args.root) throw new Error('missing absolute file or root');

        const d = await this.loadJsonDeclaration(args.file);

        const c = args.configuration || new Configuration(args.$ || {});

        await c.merge(args.env);

        if (d.imports && d.imports.length && d.imports.length > 0) {

            for (let key in d.imports) {
                const givenFile = (() => {
                    if (path.isAbsolute(d.imports[key]))
                        return d.imports[key];
                    return path.normalize(path.join(args.root, d.imports[key]));
                })();

                const interpolatedGivenFile = await c.interpolateString<string>(givenFile);
                const normalizedFile = path.normalize(interpolatedGivenFile);

                const importedDeclaration: ConfigurationDeclarationInterface =
                    await this.loadJsonDeclaration(normalizedFile);

                await c.merge(importedDeclaration.$);
            }
        }

        return c;
    }

    protected async loadJsonDeclarationFromFilesystem(absoluteFilepath: string) {
        return JSON.parse(await fs.readFile(absoluteFilepath).toString());
    }

    protected async loadJsonDeclaration(file: string): Promise<ConfigurationDeclarationInterface> {
        const fileExtension = path.extname(file);
        const payload = await (async () => {
            switch (fileExtension) {
                case '.json':
                    const jsonRaw = await fs.readFile(file);
                    const jsonStr = jsonRaw.toString();
                    const json = JSON.parse(jsonStr);
                    return json;
                    break;
                case '.js':
                    // can be a simple JS object or a function returning a Promise
                    const loaded = require(file);
                    if ('function' === typeof loaded) {
                        const result = loaded();
                        if (result instanceof Promise) { //promise
                            return await <Promise<any>>result;
                        }
                        return result;
                    }
                    return loaded;
                    break;
                default:
                    throw new Error('invalid extension ' + fileExtension);
            }
        })();

        return <any>payload;
    }
}

