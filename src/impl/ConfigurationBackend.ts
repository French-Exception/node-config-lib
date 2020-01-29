import {ConfigurationBackendInterface} from "./../api/ConfigurationBackendInterface"
import * as merge from "deepmerge"
import {Maybe} from "maybe.ts";

export class ConfigurationBackend implements ConfigurationBackendInterface {

    /**
     * The real object being used to contain the data
     */
    private real_object: object;

    /**
     *
     * @param baseObject Base object to use instead of empty object
     */
    constructor(baseObject?: object) {
        this.real_object = baseObject || {};
    }

    /**
     * Merges object onto real_object
     * @param obj
     * @param clone
     */
    public async merge(obj: object, clone?: boolean): Promise<ConfigurationBackendInterface> {
        clone = !!clone;

        const merged = merge(this.real_object, obj, {clone: clone});

        this.real_object = <any>merged;

        return this;
    }

    /**
     * Returns the real object backing data
     */
    public async getObject<T>(): Promise<T> {
        return <T><any>this.real_object
    }

    /**
     *
     * @param key
     */
    async get<T>(key: Array<string>, target?: object): Promise<Maybe<T>> {
        target = target || this.real_object;

        if (key.length == 0 || target == undefined) {
            return (<Maybe<T>><any>target);
        }
        let current = key.shift();
        if (current.indexOf("[") >= 0) {
            let match = current.match(ARRAY_MATCH);
            current = match[1];
            if (match[2]) {
                const index = Number(match[2]);
                return this.get(target[current][index], key);
            } else {
                return target[current];
            }
        } else {
            return await this.get(key, target[current]);
        }
    }

    /**
     *
     * @param key
     * @param value
     */
    async set<T>(key: Array<string>, value: T, target?: object): Promise<ConfigurationBackendInterface | any> {
        target = target || this.real_object;

        if (0 === key.length)
            return value;

        let current = key.shift();
        if (current.indexOf("[") >= 0) {
            var match = current.match(ARRAY_MATCH);
            current = match[1];
            target[current] = target[current] || [];
            if (match[2]) {
                const index = Number(match[2]);
                target[current][index] = await this.set(key, value, target[current][index] || {});
            } else {
                target[current].push(this.set(key, value, {}));
            }
            return target;
        } else {
            target[current] = await this.set(key, value, target[current] || {});
            return target;
        }

        return this;
    }


}

/** @todo from binder.js add licence & link **/
export const ARRAY_MATCH = /(.*)\[(\d*)\]/

export function _getProperty(target: object, path: Array<any>) {
    if (path.length == 0 || target == undefined) {
        return target
    }
    let current = path.shift()
    if (current.indexOf("[") >= 0) {
        let match = current.match(ARRAY_MATCH)
        current = match[1]
        if (match[2]) {
            const index = Number(match[2])
            return _getProperty(target[current][index], path)
        } else {
            return target[current]
        }
    } else {
        return _getProperty(target[current], path)
    }
}

function _setProperty<T>(target: object, path: Array<any>, value: T) {
    if (path.length == 0) {
        return value
    }

    if (!path.shift) {
        throw new Error('Not an array')
    }
    let current = path.shift()
    if (current.indexOf("[") >= 0) {
        var match = current.match(ARRAY_MATCH)
        current = match[1]
        target[current] = target[current] || []
        if (match[2]) {
            var index = Number(match[2])
            target[current][index] = _setProperty(target[current][index] || {}, path, value)
        } else {
            target[current].push(_setProperty({}, path, value))
        }
        return target
    } else {
        target[current] = _setProperty(target[current] || {}, path, value)
        return target
    }
}

function _isBuiltinType(target: any) {
    const t: string = typeof (target)
    return t == "string" || t == "number" || t == "date" || t == "boolean"
}

function _enumerate(collection, target, path) {
    if (target instanceof Array) {
        for (var i = 0; i < target.length; i++) {
            _enumerate(collection, target[i], path + "[" + i + "]")
        }
    } else if (_isBuiltinType(target)) {
        collection.push(path)
    } else {
        for (let property in target) {
            if (typeof (property) != "function") {
                _enumerate(collection, target[property], path == "" ? property : path + "." + property)
            }
        }
    }
}
