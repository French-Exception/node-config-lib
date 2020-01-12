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
exports.__esModule = true;
var fs = require("fs-extra");
var Configuration_1 = require("./Configuration");
var path = require('path');
var ConfigurationLoader = /** @class */ (function () {
    function ConfigurationLoader(args) {
        this.$ = args && args.$ || {};
        this.configuration = args && args.configuration || new Configuration_1.Configuration({});
    }
    ConfigurationLoader.prototype.fromFile = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var d, c, _loop_1, this_1, _a, _b, _i, key;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!args.env)
                            args.env = {};
                        if (!args.file)
                            throw new Error('missing file');
                        if (!path.isAbsolute(args.file) && !args.root)
                            throw new Error('missing absolute file or root');
                        return [4 /*yield*/, this.loadJsonDeclaration(args.file)];
                    case 1:
                        d = _c.sent();
                        c = args.configuration || new Configuration_1.Configuration(args.$ || {});
                        return [4 /*yield*/, c.merge(args.env)];
                    case 2:
                        _c.sent();
                        if (!(d.imports && d.imports.length && d.imports.length > 0)) return [3 /*break*/, 6];
                        _loop_1 = function (key) {
                            var givenFile, interpolatedGivenFile, normalizedFile, importedDeclaration;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        givenFile = (function () {
                                            if (path.isAbsolute(d.imports[key]))
                                                return d.imports[key];
                                            return path.normalize(path.join(args.root, d.imports[key]));
                                        })();
                                        return [4 /*yield*/, c.interpolateString(givenFile)];
                                    case 1:
                                        interpolatedGivenFile = _a.sent();
                                        normalizedFile = path.normalize(interpolatedGivenFile);
                                        return [4 /*yield*/, this_1.loadJsonDeclaration(normalizedFile)];
                                    case 2:
                                        importedDeclaration = _a.sent();
                                        return [4 /*yield*/, c.merge(importedDeclaration.$)];
                                    case 3:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _a = [];
                        for (_b in d.imports)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        key = _a[_i];
                        return [5 /*yield**/, _loop_1(key)];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: return [2 /*return*/, c];
                }
            });
        });
    };
    ConfigurationLoader.prototype.loadJsonDeclarationFromFilesystem = function (absoluteFilepath) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, fs.readFile(absoluteFilepath).toString()];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    ConfigurationLoader.prototype.loadJsonDeclaration = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var fileExtension, payload;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fileExtension = path.extname(file);
                        return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                                var _a, jsonRaw, jsonStr, json, loaded, result;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _a = fileExtension;
                                            switch (_a) {
                                                case '.json': return [3 /*break*/, 1];
                                                case '.js': return [3 /*break*/, 3];
                                            }
                                            return [3 /*break*/, 7];
                                        case 1: return [4 /*yield*/, fs.readFile(file)];
                                        case 2:
                                            jsonRaw = _b.sent();
                                            jsonStr = jsonRaw.toString();
                                            json = JSON.parse(jsonStr);
                                            return [2 /*return*/, json];
                                        case 3:
                                            loaded = require(file);
                                            if (!('function' === typeof loaded)) return [3 /*break*/, 6];
                                            result = loaded();
                                            if (!(result instanceof Promise)) return [3 /*break*/, 5];
                                            return [4 /*yield*/, result];
                                        case 4: //promise
                                        return [2 /*return*/, _b.sent()];
                                        case 5: return [2 /*return*/, result];
                                        case 6: return [2 /*return*/, loaded];
                                        case 7: throw new Error('invalid extension ' + fileExtension);
                                    }
                                });
                            }); })()];
                    case 1:
                        payload = _a.sent();
                        return [2 /*return*/, payload];
                }
            });
        });
    };
    return ConfigurationLoader;
}());
exports.ConfigurationLoader = ConfigurationLoader;
//# sourceMappingURL=ConfigurationLoader.js.map