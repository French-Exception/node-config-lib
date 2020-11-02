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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Configuration = exports.VERSION = void 0;
var ConfigurationBackend_1 = require("./ConfigurationBackend");
var merge = require("deepmerge");
var Maybe = require("maybe.ts");
var fs = require("fs-extra");
exports.VERSION = '1.0';
var object_walker = require('object-walker');
var Configuration = /** @class */ (function () {
    function Configuration(args) {
        this.args = args || {};
        this.args.keyRegex = (!args || !args.keyRegex) ? new RegExp('%[^%]+?%', 'g') : args.keyRegex;
        this.args.env = (!args || !args.env) ? {} : args.env;
        this.args.$ = (!args || !args.$) ? this.args.env : merge(this.args.$, this.args.env);
        this.args.backend = (!args || !args.backend) ? new ConfigurationBackend_1.ConfigurationBackend(this.args.$) : args.backend;
        this._keyParamsCache = {};
        this._changes = [];
        this._deletions = [];
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
            var _interpolatedKey, _rawValue, _interpolatedValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.interpolateString(interpolableKey)];
                    case 1:
                        _interpolatedKey = _a.sent();
                        return [4 /*yield*/, this._get(_interpolatedKey)];
                    case 2:
                        _rawValue = _a.sent();
                        return [4 /*yield*/, this.interpolateValue(_rawValue)];
                    case 3:
                        _interpolatedValue = _a.sent();
                        return [2 /*return*/, Maybe.or(_interpolatedValue, defaultIfUndef)];
                }
            });
        });
    };
    Configuration.prototype.getRaw = function (interpolableKey) {
        return __awaiter(this, void 0, void 0, function () {
            var _interpolatedKey, _raw;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.interpolateString(interpolableKey)];
                    case 1:
                        _interpolatedKey = _a.sent();
                        return [4 /*yield*/, this._get(_interpolatedKey)];
                    case 2:
                        _raw = _a.sent();
                        return [2 /*return*/, _raw];
                }
            });
        });
    };
    /**
     * Returs raw, not interpolated values
     * Can include %% parameters to be resolved
     *
     * @param interpolatedKey
     * @private
     */
    Configuration.prototype._get = function (interpolatedKey) {
        return __awaiter(this, void 0, void 0, function () {
            var _key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _key = interpolatedKey.split('.');
                        return [4 /*yield*/, this.args.backend.get(_key)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    /**
     * Retains changes made to object, to be used on save()
     * @return changes
     */
    Configuration.prototype.changes = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._changes];
            });
        });
    };
    /**
     * Reset changes made to object.
     */
    Configuration.prototype.resetChanges = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this._changes = [];
                return [2 /*return*/, this];
            });
        });
    };
    /**
     * Retains deletions made to object, to be used on save()
     */
    Configuration.prototype.deletions = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._deletions];
            });
        });
    };
    /**
     * Reset deletions made to object, to be used on save()
     */
    Configuration.prototype.resetDeletions = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this._deletions = [];
                return [2 /*return*/];
            });
        });
    };
    /**
     * caches parameters extraction
     */
    Configuration.prototype.keyParams = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._keyParamsCache];
            });
        });
    };
    Configuration.prototype.resetKeyParams = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this._keyParamsCache = {};
                return [2 /*return*/];
            });
        });
    };
    Configuration.prototype.save = function (toFile) {
        return __awaiter(this, void 0, void 0, function () {
            var changes, interpolatedSaveToFile, jsonFileStr, json;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                            var _changes, configToSave;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.changes()];
                                    case 1:
                                        _changes = _a.sent();
                                        configToSave = new Configuration();
                                        return [4 /*yield*/, Promise.all(_changes
                                                .map(function (change) { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, configToSave.set(change.interpolatedKey, change.value)];
                                                        case 1: return [2 /*return*/, _a.sent()];
                                                    }
                                                });
                                            }); }))];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/, configToSave.getObject()];
                                }
                            });
                        }); })()];
                    case 1:
                        changes = _a.sent();
                        return [4 /*yield*/, this.interpolateString(toFile)];
                    case 2:
                        interpolatedSaveToFile = _a.sent();
                        return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                                var s, e_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, fs.readFile(interpolatedSaveToFile)];
                                        case 1:
                                            s = _a.sent();
                                            return [2 /*return*/, s.toString()];
                                        case 2:
                                            e_1 = _a.sent();
                                            if ('ENOENT' === e_1.code)
                                                return [2 /*return*/, JSON.stringify({ imports: [], ns: '', $: {} })];
                                            throw e_1;
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); })()];
                    case 3:
                        jsonFileStr = _a.sent();
                        json = (function () {
                            try {
                                return JSON.parse(jsonFileStr);
                            }
                            catch (e) {
                                throw e;
                            }
                        })();
                        if (!json.$)
                            json.$ = {};
                        json.$ = merge(json.$, changes);
                        return [4 /*yield*/, fs.writeFile(interpolatedSaveToFile, JSON.stringify({
                                imports: json.imports ? json.imports : [],
                                ns: json.ns ? json.ns : '',
                                $: json.$
                            }, null, 2))];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, interpolatedSaveToFile];
                }
            });
        });
    };
    Configuration.prototype.getObject = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.args.backend.getObject()];
            });
        });
    };
    Configuration.prototype.dump = function (raw) {
        return __awaiter(this, void 0, void 0, function () {
            var object;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        object = {};
                        return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                                var firstLevelObjects, p;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.getObject()];
                                        case 1:
                                            firstLevelObjects = _a.sent();
                                            p = Object.keys(firstLevelObjects).map(function (key) { return __awaiter(_this, void 0, void 0, function () {
                                                var interpolatedKey, value, _a, _b;
                                                return __generator(this, function (_c) {
                                                    switch (_c.label) {
                                                        case 0: return [4 /*yield*/, this.interpolateString(key)];
                                                        case 1:
                                                            interpolatedKey = _c.sent();
                                                            return [4 /*yield*/, this._get(interpolatedKey)];
                                                        case 2:
                                                            value = _c.sent();
                                                            if (!raw) return [3 /*break*/, 3];
                                                            object[interpolatedKey] = value;
                                                            return [3 /*break*/, 5];
                                                        case 3:
                                                            _a = object;
                                                            _b = interpolatedKey;
                                                            return [4 /*yield*/, this.interpolateValue(value)];
                                                        case 4:
                                                            _a[_b] = _c.sent();
                                                            _c.label = 5;
                                                        case 5: return [2 /*return*/];
                                                    }
                                                });
                                            }); });
                                            return [4 /*yield*/, Promise.all(p)];
                                        case 2:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, object];
                }
            });
        });
    };
    /**
     *
     * @param interpolableKey
     * @param value
     */
    Configuration.prototype.set = function (interpolableKey, value) {
        return __awaiter(this, void 0, void 0, function () {
            var _interpolatedKey, _key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.interpolateString(interpolableKey)];
                    case 1:
                        _interpolatedKey = _a.sent();
                        _key = _interpolatedKey.split('.');
                        return [4 /*yield*/, this.args.backend.set(_key, value)];
                    case 2:
                        _a.sent();
                        this._changes.push({
                            interpolableKey: interpolableKey,
                            interpolatedKey: _interpolatedKey,
                            value: value
                        });
                        return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     *
     * @param _rawValue
     */
    Configuration.prototype.interpolateValue = function (_rawValue) {
        return __awaiter(this, void 0, void 0, function () {
            var _interpolatedValue, _interpolatedValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!("string" === typeof _rawValue)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.interpolateString(_rawValue)];
                    case 1:
                        _interpolatedValue = _a.sent();
                        return [2 /*return*/, _interpolatedValue];
                    case 2:
                        if (!(Array.isArray(_rawValue) || (typeof _rawValue === 'object'))) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.interpolateObject(_rawValue)];
                    case 3:
                        _interpolatedValue = _a.sent();
                        return [2 /*return*/, _interpolatedValue];
                    case 4: throw new Error('lol');
                }
            });
        });
    };
    /**
     *
     * @param interpolableString
     */
    Configuration.prototype.interpolateString = function (interpolableString) {
        return __awaiter(this, void 0, void 0, function () {
            var extractedParameters, _firstDerivative, parameters;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getStringExtractedParametersIfAnyOrFalse(interpolableString)];
                    case 1:
                        extractedParameters = _a.sent();
                        if (false === extractedParameters) {
                            return [2 /*return*/, interpolableString];
                        }
                        if (!(extractedParameters && extractedParameters['params'].length > 0)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this._interpolateString(interpolableString)];
                    case 2:
                        _firstDerivative = _a.sent();
                        if (!('string' === typeof _firstDerivative)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.getStringExtractedParametersIfAnyOrFalse(_firstDerivative)];
                    case 3:
                        parameters = _a.sent();
                        if (!parameters) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.interpolateString(_firstDerivative)];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        if (!('object' === typeof _firstDerivative || Array.isArray(_firstDerivative))) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.interpolateObject(_firstDerivative)];
                    case 7: return [2 /*return*/, _a.sent()];
                    case 8: return [2 /*return*/, Maybe.just(_firstDerivative)];
                    case 9: return [2 /*return*/, interpolableString];
                }
            });
        });
    };
    /**
     *
     * @param string
     */
    Configuration.prototype.getStringExtractedParametersIfAnyOrFalse = function (string) {
        return __awaiter(this, void 0, void 0, function () {
            var _parameters;
            return __generator(this, function (_a) {
                _parameters = this.extractParameters(string);
                if (_parameters.length > 0)
                    return [2 /*return*/, { key: string, params: _parameters }];
                return [2 /*return*/, false];
            });
        });
    };
    /**
     *
     * @param _rawValue
     */
    Configuration.prototype.interpolateObject = function (_rawValue) {
        return __awaiter(this, void 0, void 0, function () {
            var _c, _collector, _i, _collector_1, collectedItem, _key, _value, _interpolatedValue, _interpolatedValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _c = new ConfigurationBackend_1.ConfigurationBackend();
                        _collector = [];
                        object_walker
                            .walkObject(_rawValue, function (keys, value) {
                            _collector.push([keys, value]);
                        });
                        _i = 0, _collector_1 = _collector;
                        _a.label = 1;
                    case 1:
                        if (!(_i < _collector_1.length)) return [3 /*break*/, 8];
                        collectedItem = _collector_1[_i];
                        _key = collectedItem[0];
                        _value = collectedItem[1];
                        if (!('string' === typeof (_value))) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.interpolateString(_value)];
                    case 2:
                        _interpolatedValue = _a.sent();
                        return [4 /*yield*/, _c.set(_key, _interpolatedValue)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 4:
                        if (!('object' === typeof _value || Array.isArray(_value))) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.interpolateObject(_value)];
                    case 5:
                        _interpolatedValue = _a.sent();
                        return [4 /*yield*/, _c.set(_key, _interpolatedValue)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 1];
                    case 8: return [4 /*yield*/, _c.getObject()];
                    case 9: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     *
     * @param interpolableKey
     * @private
     */
    Configuration.prototype._interpolateString = function (interpolableKey) {
        return __awaiter(this, void 0, void 0, function () {
            var _result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                            var k, _parameters, _i, _parameters_1, parameterInfo, _key, _value;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        k = interpolableKey;
                                        _parameters = this.extractParameters(k);
                                        _i = 0, _parameters_1 = _parameters;
                                        _a.label = 1;
                                    case 1:
                                        if (!(_i < _parameters_1.length)) return [3 /*break*/, 4];
                                        parameterInfo = _parameters_1[_i];
                                        _key = parameterInfo[0].substr(1, parameterInfo[0].length - 2);
                                        return [4 /*yield*/, this._get(_key)];
                                    case 2:
                                        _value = _a.sent();
                                        // test Maybe value, throwing if necessary
                                        if (undefined === _value)
                                            throw new Error("'" + _key + "' does not exist");
                                        // if string : replace ; elseif object return object
                                        if ('string' === typeof _value) {
                                            k = k.replace(parameterInfo[1], _value);
                                        }
                                        else if ('object' === typeof _value && 1 == _parameters.length) {
                                            k = _value;
                                        }
                                        _a.label = 3;
                                    case 3:
                                        _i++;
                                        return [3 /*break*/, 1];
                                    case 4: return [2 /*return*/, k];
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
    /**
     *
     * @param key
     */
    Configuration.prototype.extractParameters = function (key) {
        if (this._keyParamsCache[key]) {
            return this._keyParamsCache[key];
        }
        var regex = this.args.keyRegex;
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
        this._keyParamsCache[key] = r;
        return r;
    };
    return Configuration;
}());
exports.Configuration = Configuration;
//# sourceMappingURL=Configuration.js.map