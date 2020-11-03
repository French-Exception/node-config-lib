"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const merge = require("deepmerge");
class ConfigurationBackend {
    /**
     *
     * @param baseObject Base object to use instead of empty object
     */
    constructor(baseObject) {
        this.real_object = baseObject || {};
    }
    /**
     * Merges object onto real_object
     * @param obj
     * @param clone
     */
    async merge(obj, clone) {
        clone = !!clone;
        const merged = merge(this.real_object, obj, { clone: clone });
        this.real_object = merged;
        return this;
    }
    /**
     * Returns the real object backing data
     */
    async getObject() {
        return this.real_object;
    }
    /**
     *
     * @param key
     */
    async get(key, target) {
        target = target || this.real_object;
        if (key.length == 0 || target == undefined) {
            return target;
        }
        let current = key.shift();
        if (current.indexOf("[") >= 0) {
            let match = current.match(exports.ARRAY_MATCH);
            current = match[1];
            if (match[2]) {
                const index = Number(match[2]);
                return this.get(target[current][index], key);
            }
            else {
                return target[current];
            }
        }
        else {
            return await this.get(key, target[current]);
        }
    }
    /**
     *
     * @param key
     * @param value
     */
    async set(key, value, target) {
        target = target || this.real_object;
        if (0 === key.length)
            return value;
        let current = key.shift();
        if (current.indexOf("[") >= 0) {
            var match = current.match(exports.ARRAY_MATCH);
            current = match[1];
            target[current] = target[current] || [];
            if (match[2]) {
                const index = Number(match[2]);
                target[current][index] = await this.set(key, value, target[current][index] || {});
            }
            else {
                target[current].push(this.set(key, value, {}));
            }
            return target;
        }
        else {
            target[current] = await this.set(key, value, target[current] || {});
            return target;
        }
        return this;
    }
}
exports.ConfigurationBackend = ConfigurationBackend;
/** @todo from binder.js add licence & link **/
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