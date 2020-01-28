"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const merge = require("deepmerge");
class ConfigurationBackend {
    constructor(baseObject) {
        this.real_object = baseObject || {};
    }
    async merge(obj) {
        const merged = merge(this.real_object, obj, { clone: true });
        this.real_object = merged;
        return this;
    }
    async getObject() {
        return this.real_object;
    }
    async get(key) {
        if (null == key || undefined === key)
            throw new Error('Key cannot be empty');
        const _key = Array.isArray(key) ? key : key.split('.');
        const _value = _getProperty(this.real_object, _key);
        return _value;
    }
    async set(key, value) {
        if (null === key || undefined === key)
            throw new Error('Key cannot be empty');
        _setProperty(this.real_object, Array.isArray(key) ? key : key.split('.'), value);
        return this;
    }
}
exports.ConfigurationBackend = ConfigurationBackend;
exports.ARRAY_MATCH = /(.*)\[(\d*)\]/;
function _getProperty(target, path) {
    if (path.length == 0 || target == undefined) {
        return target;
    }
    let current = path.shift();
    if (current.indexOf("[") >= 0) {
        let match = current.match(exports.ARRAY_MATCH);
        current = match[1];
        if (match[2]) {
            const index = Number(match[2]);
            return _getProperty(target[current][index], path);
        }
        else {
            return target[current];
        }
    }
    else {
        return _getProperty(target[current], path);
    }
}
exports._getProperty = _getProperty;
function _setProperty(target, path, value) {
    if (path.length == 0) {
        return value;
    }
    if (!path.shift) {
        throw new Error('Not an array');
    }
    let current = path.shift();
    if (current.indexOf("[") >= 0) {
        var match = current.match(exports.ARRAY_MATCH);
        current = match[1];
        target[current] = target[current] || [];
        if (match[2]) {
            var index = Number(match[2]);
            target[current][index] = _setProperty(target[current][index] || {}, path, value);
        }
        else {
            target[current].push(_setProperty({}, path, value));
        }
        return target;
    }
    else {
        target[current] = _setProperty(target[current] || {}, path, value);
        return target;
    }
}
function _isBuiltinType(target) {
    const t = typeof (target);
    return t == "string" || t == "number" || t == "date" || t == "boolean";
}
function _enumerate(collection, target, path) {
    if (target instanceof Array) {
        for (var i = 0; i < target.length; i++) {
            _enumerate(collection, target[i], path + "[" + i + "]");
        }
    }
    else if (_isBuiltinType(target)) {
        collection.push(path);
    }
    else {
        for (let property in target) {
            if (typeof (property) != "function") {
                _enumerate(collection, target[property], path == "" ? property : path + "." + property);
            }
        }
    }
}
//# sourceMappingURL=ConfigurationBackend.js.map