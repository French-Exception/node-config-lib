"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var events_1 = require("events");
var path = require('path');
var ConfigurationLoader = /** @class */ (function (_super) {
    __extends(ConfigurationLoader, _super);
    function ConfigurationLoader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ConfigurationLoader.prototype.fromDeclaration = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var c;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        c = args.configuration = args.configuration || new Configuration_1.Configuration({ $: args.$, env: args.env });
                        this.emit('fromDeclaration.start', args);
                        return [4 /*yield*/, this.imports(args.declaration.imports, args.configuration, args.root)];
                    case 1:
                        _a.sent();
                        this.emit('fromDeclaration.stop', args);
                        return [2 /*return*/, c];
                }
            });
        });
    };
    ConfigurationLoader.prototype.fromFile = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var d;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!args.env)
                            args.env = {};
                        if (!args.file && !args.declaration)
                            throw new Error('missing file and no declaration');
                        if (!args.root)
                            args.root = path.dirname(args.file);
                        if (!path.isAbsolute(args.file) && !args.root)
                            throw new Error('missing absolute file or root');
                        args.configuration = args.configuration || new Configuration_1.Configuration({ env: args.env, $: args.$ });
                        return [4 /*yield*/, this.loadJsonDeclaration(args.file)];
                    case 1:
                        d = _a.sent();
                        return [4 /*yield*/, this.fromDeclaration({
                                declaration: d,
                                $: args.$,
                                configuration: args.configuration,
                                env: args.env,
                                root: args.root
                            })];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ConfigurationLoader.prototype.imports = function (imports, configuration, root) {
        return __awaiter(this, void 0, void 0, function () {
            var _loop_1, this_1, _a, _b, _i, key;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(imports && imports.length && imports.length > 0)) return [3 /*break*/, 4];
                        _loop_1 = function (key) {
                            var givenFile, interpolatedGivenFile, normalizedFile, importedDeclaration, _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        givenFile = (function () {
                                            if (path.isAbsolute(imports[key]))
                                                return imports[key];
                                            return path.normalize(path.join(root, imports[key]));
                                        })();
                                        return [4 /*yield*/, configuration.interpolateString(givenFile)];
                                    case 1:
                                        interpolatedGivenFile = _c.sent();
                                        normalizedFile = path.normalize(interpolatedGivenFile);
                                        _b = (_a = this_1).reshapeDeclaration;
                                        return [4 /*yield*/, this_1.loadJsonDeclaration(normalizedFile)];
                                    case 2:
                                        importedDeclaration = _b.apply(_a, [_c.sent()]);
                                        this_1.emit('fromDeclaration.import', {
                                            given: givenFile,
                                            interpolated: interpolatedGivenFile,
                                            normal: normalizedFile,
                                            importedDeclaration: importedDeclaration
                                        });
                                        return [4 /*yield*/, configuration.merge(importedDeclaration.$)];
                                    case 3:
                                        _c.sent();
                                        if (!importedDeclaration.imports) return [3 /*break*/, 5];
                                        return [4 /*yield*/, this_1.imports(importedDeclaration.imports, configuration, root)];
                                    case 4:
                                        _c.sent();
                                        _c.label = 5;
                                    case 5: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _a = [];
                        for (_b in imports)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        key = _a[_i];
                        return [5 /*yield**/, _loop_1(key)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, configuration];
                }
            });
        });
    };
    ConfigurationLoader.prototype.reshapeDeclaration = function (declaration) {
        declaration.imports = declaration.imports || [];
        declaration.ns = declaration.ns || null;
        declaration.$ = declaration.$ || {};
        declaration.version = declaration.version || Configuration_1.VERSION;
        return;
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
}(events_1.EventEmitter));
exports.ConfigurationLoader = ConfigurationLoader;
//# sourceMappingURL=ConfigurationLoader.js.map