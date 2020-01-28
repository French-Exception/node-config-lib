import {ConfigurationBackendInterface} from "./../api/ConfigurationBackendInterface"
import * as merge from "deepmerge"

export class ConfigurationBackend implements ConfigurationBackendInterface {

    private real_object: object

    constructor(baseObject?: object) {
        this.real_object = baseObject || {}
    }

    public async merge(obj: object): Promise<ConfigurationBackendInterface> {

        const merged = merge(this.real_object, obj, {clone: true})

        this.real_object = <any>merged

        return this
    }

    public async getObject<T>(): Promise<T> {
        return <any>this.real_object
    }

    async get<T>(key: string | Array<string>): Promise<T | undefined> {
        if (null == key || undefined === key) throw new Error('Key cannot be empty')

        const _key: Array<string> = Array.isArray(key) ? <Array<string>>key : (<string>key).split('.')
        const _value: T = _getProperty(this.real_object, _key)
        return _value
    }

    async set<T>(key: string | Array<string>, value: T): Promise<ConfigurationBackendInterface> {
        if (null === key || undefined === key) throw new Error('Key cannot be empty')

        _setProperty(this.real_object, Array.isArray(key) ? <Array<string>>key : (<string>key).split('.'), value)

        return this
    }


}


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
