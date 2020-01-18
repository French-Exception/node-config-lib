"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
exports.__esModule = true;
var _ = require("underscore");
var ConfigurationBackend_1 = require("./ConfigurationBackend");
var merge = require("deepmerge");
var Maybe = require("maybe.ts");
var object_walker = require('object-walker');
var Configuration = /** @class */ (function () {
    function Configuration(args) {
        this.args = args || {};
        this.args.keyRegex = (!args || !args.keyRegex) ? new RegExp('%[^%]+?%', 'g') : args.keyRegex;
        this.args.env = (!args || !args.env) ? {} : args.env;
        this.args.$ = (!args || !args.$) ? this.args.env : merge(this.args.$, this.args.env);
        this.args.backend = (!args || !args.backend) ? new ConfigurationBackend_1.ConfigurationBackend(this.args.$) : args.backend;
    }
    Configuration.prototype.merge = function (source) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.args.backend.merge(source)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    Configuration.prototype.get = function (interpolableKey, defaultIfUndef) {
        return __awaiter(this, void 0, void 0, function () {
            var _interpolatedKey, _rawValue, _interpolatedValue, _return;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (undefined === interpolableKey || null === interpolableKey)
                            throw new Error('Key cannot be empty');
                        return [4 /*yield*/, this.interpolateString(interpolableKey)];
                    case 1:
                        _interpolatedKey = _a.sent();
                        return [4 /*yield*/, this._get(_interpolatedKey)];
                    case 2:
                        _rawValue = _a.sent();
                        return [4 /*yield*/, this.interpolateValue(_rawValue)];
                    case 3:
                        _interpolatedValue = _a.sent();
                        _return = Maybe.or(_interpolatedValue, defaultIfUndef);
                        return [2 /*return*/, _return];
                }
            });
        });
    };
    Configuration.prototype.getRaw = function (interpolatedKey) {
        return __awaiter(this, void 0, void 0, function () {
            var _value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (undefined === interpolatedKey || null === interpolatedKey)
                            throw new Error('Key cannot be empty');
                        return [4 /*yield*/, this.args.backend.get(interpolatedKey)];
                    case 1:
                        _value = _a.sent();
                        return [2 /*return*/, _value];
                }
            });
        });
    };
    Configuration.prototype._get = function (interpolatedKey) {
        return __awaiter(this, void 0, void 0, function () {
            var _key, _value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (undefined === interpolatedKey || null === interpolatedKey || "" === interpolatedKey)
                            throw new Error('Key cannot be empty');
                        _key = _.isArray(interpolatedKey) ? interpolatedKey : interpolatedKey.split('.');
                        return [4 /*yield*/, this.args.backend.get(_key)];
                    case 1:
                        _value = _a.sent();
                        return [2 /*return*/, _value];
                }
            });
        });
    };
    Configuration.prototype.set = function (interpolableKey, value) {
        return __awaiter(this, void 0, void 0, function () {
            var _interpolatedKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (undefined === interpolableKey || null === interpolableKey || "" === interpolableKey)
                            throw new Error('Key cannot be empty');
                        return [4 /*yield*/, this.interpolateString(interpolableKey)];
                    case 1:
                        _interpolatedKey = _a.sent();
                        return [4 /*yield*/, this.args.backend.set(_interpolatedKey.split('.'), value)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    Configuration.prototype.interpolateValue = function (_rawValue) {
        return __awaiter(this, void 0, void 0, function () {
            var _interpolatedValue, _interpolatedValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!_.isString(_rawValue)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.interpolateString(_rawValue)];
                    case 1:
                        _interpolatedValue = _a.sent();
                        return [2 /*return*/, _interpolatedValue];
                    case 2:
                        if (!(_.isArray(_rawValue) || _.isObject(_rawValue))) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.interpolateObject(_rawValue)];
                    case 3:
                        _interpolatedValue = _a.sent();
                        return [2 /*return*/, _interpolatedValue];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Configuration.prototype.interpolateString = function (interpolableString) {
        return __awaiter(this, void 0, void 0, function () {
            var isStringInterpolable, _first;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (undefined === interpolableString || null === interpolableString)
                            throw new Error('Key cannot be empty');
                        return [4 /*yield*/, this.isStringInterpolable(interpolableString)];
                    case 1:
                        isStringInterpolable = _a.sent();
                        if (!(true === isStringInterpolable)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this._interpolateString(interpolableString)];
                    case 2:
                        _first = _a.sent();
                        if (!(_.isString(_first) && this.isStringInterpolable(_first))) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.interpolateString(_first)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        if (!_.isObject(_first)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.interpolateObject(_first)];
                    case 5: return [2 /*return*/, _a.sent()];
                    case 6: return [2 /*return*/, Maybe.just(_first)];
                    case 7: return [2 /*return*/, interpolableString];
                }
            });
        });
    };
    Configuration.prototype.isStringInterpolable = function (string) {
        return __awaiter(this, void 0, void 0, function () {
            var _parameters;
            return __generator(this, function (_a) {
                if (undefined === string || null === string)
                    throw new Error('Key cannot be empty');
                _parameters = this.extractParameters(string, this.args.keyRegex);
                return [2 /*return*/, _parameters.length > 0];
            });
        });
    };
    Configuration.prototype.interpolateObject = function (_rawValue) {
        return __awaiter(this, void 0, void 0, function () {
            var _c, _collector, _collector_1, _collector_1_1, collectedItem, _key, _value, _interpolatedValue, _interpolatedValue, e_1_1;
            var e_1, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _c = new ConfigurationBackend_1.ConfigurationBackend();
                        _collector = [];
                        object_walker.walkObject(_rawValue, function (keys, value) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                _collector.push([keys, value]);
                                return [2 /*return*/];
                            });
                        }); });
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 10, 11, 12]);
                        _collector_1 = __values(_collector), _collector_1_1 = _collector_1.next();
                        _b.label = 2;
                    case 2:
                        if (!!_collector_1_1.done) return [3 /*break*/, 9];
                        collectedItem = _collector_1_1.value;
                        _key = collectedItem[0].join('.');
                        _value = collectedItem[1];
                        if (!_.isString(_value)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.interpolateString(_value)];
                    case 3:
                        _interpolatedValue = _b.sent();
                        return [4 /*yield*/, _c.set(_key, _interpolatedValue)];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 5:
                        if (!_.isObject(_value)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.interpolateObject(_value)];
                    case 6:
                        _interpolatedValue = _b.sent();
                        return [4 /*yield*/, _c.set(_key, _interpolatedValue)];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8:
                        _collector_1_1 = _collector_1.next();
                        return [3 /*break*/, 2];
                    case 9: return [3 /*break*/, 12];
                    case 10:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 12];
                    case 11:
                        try {
                            if (_collector_1_1 && !_collector_1_1.done && (_a = _collector_1["return"])) _a.call(_collector_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 12: return [2 /*return*/, _c.getObject()];
                }
            });
        });
    };
    Configuration.prototype._interpolateString = function (interpolableKey) {
        return __awaiter(this, void 0, void 0, function () {
            var m, _result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (undefined === interpolableKey || null === interpolableKey)
                            throw new Error('Key cannot be empty');
                        return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                                var k, _parameters, _parameters_1, _parameters_1_1, parameterInfo, _key, _value, e_2_1;
                                var e_2, _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            k = interpolableKey;
                                            _parameters = this.extractParameters(k, this.args.keyRegex);
                                            _b.label = 1;
                                        case 1:
                                            _b.trys.push([1, 6, 7, 8]);
                                            _parameters_1 = __values(_parameters), _parameters_1_1 = _parameters_1.next();
                                            _b.label = 2;
                                        case 2:
                                            if (!!_parameters_1_1.done) return [3 /*break*/, 5];
                                            parameterInfo = _parameters_1_1.value;
                                            _key = parameterInfo[0].substr(1, parameterInfo[0].length - 2);
                                            return [4 /*yield*/, this.getRaw(_key)];
                                        case 3:
                                            _value = _b.sent();
                                            if (_.isString(_value)) {
                                                k = k.replace(parameterInfo[1], _value);
                                            }
                                            else if (_.isObject(_value) && 1 == _parameters.length) {
                                                k = _value;
                                            }
                                            _b.label = 4;
                                        case 4:
                                            _parameters_1_1 = _parameters_1.next();
                                            return [3 /*break*/, 2];
                                        case 5: return [3 /*break*/, 8];
                                        case 6:
                                            e_2_1 = _b.sent();
                                            e_2 = { error: e_2_1 };
                                            return [3 /*break*/, 8];
                                        case 7:
                                            try {
                                                if (_parameters_1_1 && !_parameters_1_1.done && (_a = _parameters_1["return"])) _a.call(_parameters_1);
                                            }
                                            finally { if (e_2) throw e_2.error; }
                                            return [7 /*endfinally*/];
                                        case 8: return [2 /*return*/, k];
                                    }
                                });
                            }); })()];
                    case 1:
                        _result = _a.sent();
                        // can be string or object, so don't bother with it here, will be typed upper
                        return [2 /*return*/, _result];
                }
            });
        });
    };
    Configuration.prototype.extractParameters = function (key, regex) {
        if (undefined === key || null === key)
            throw new Error('Key cannot be empty');
        regex = regex || this.args.keyRegex;
        var r = [];
        var m;
        while ((m = regex.exec(key)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            m.forEach(function (match) {
                r.push([match, new RegExp(match, 'g')]);
            });
        }
        return r;
    };
    return Configuration;
}());
exports.Configuration = Configuration;
//# sourceMappingURL=Configuration.js.map