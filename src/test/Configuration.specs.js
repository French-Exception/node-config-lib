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
var impl_1 = require("./../src/impl/");
var chai_1 = require("chai");
var path = require("path");
var fs = require("fs-extra");
var function_load_perf_tester_lib_1 = require("@frenchex/function-load-perf-tester-lib");
describe('Configuration', function () {
    it('can be instantiated', function (done) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                new impl_1.Configuration();
                this.test.callback();
                return [2 /*return*/];
            });
        });
    });
    it('can set and get', function () {
        return __awaiter(this, void 0, void 0, function () {
            var c, foofoobar;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        c = new impl_1.Configuration();
                        return [4 /*yield*/, c.set('foo.foo.bar', { foo: 'bar' })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, c.get('foo.foo.bar', 'not found')];
                    case 2:
                        foofoobar = _a.sent();
                        chai_1.expect(foofoobar).to.be.deep.equal({ foo: 'bar' });
                        return [2 /*return*/];
                }
            });
        });
    });
    it('can save changes', function () {
        return __awaiter(this, void 0, void 0, function () {
            var c, to, savedTo, jsonSaved, loaded;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        c = new impl_1.Configuration({ env: { env: 'dev' } });
                        return [4 /*yield*/, c.set('foo', { bar: 'foobar' })];
                    case 1:
                        _a.sent();
                        to = path.join(path.dirname(__dirname), 'test-res', '__test_%env%.json');
                        return [4 /*yield*/, c.save(to)];
                    case 2:
                        savedTo = _a.sent();
                        return [4 /*yield*/, fs.readFile(savedTo)];
                    case 3:
                        jsonSaved = _a.sent();
                        loaded = JSON.parse(jsonSaved.toString());
                        chai_1.expect(loaded).to.be.deep.equal({ $: { foo: { bar: 'foobar' } }, ns: '', imports: [] });
                        return [4 /*yield*/, fs.remove(savedTo)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    it('is performant construction with $', function () {
        return __awaiter(this, void 0, void 0, function () {
            var tester;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tester = new function_load_perf_tester_lib_1.FunctionLoadTester();
                        return [4 /*yield*/, tester
                                .measureAverage(function () { return __awaiter(_this, void 0, void 0, function () {
                                var c;
                                return __generator(this, function (_a) {
                                    c = new impl_1.Configuration({
                                        $: {
                                            foo: {
                                                bar: 'foobar',
                                                foobar: '%foo.bar%%foo.bar%'
                                            }
                                        }
                                    });
                                    return [2 /*return*/];
                                });
                            }); }, 100, chai_1.expect)];
                    case 1:
                        (_a.sent())
                            .to.be.lte(1000 /** make it high for loaded CI services **/, 'Configuration get takes avg less than');
                        return [2 /*return*/];
                }
            });
        });
    });
    it('is performant construction with $ and get simple and interpolated ones', function () {
        return __awaiter(this, void 0, void 0, function () {
            var tester, c;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tester = new function_load_perf_tester_lib_1.FunctionLoadTester();
                        c = new impl_1.Configuration({
                            $: {
                                foo: {
                                    bar: 'foobar',
                                    foobar: '%foo.bar%%foo.bar%'
                                }
                            }
                        });
                        return [4 /*yield*/, tester
                                .measureAverage(function () { return __awaiter(_this, void 0, void 0, function () {
                                var foobar, foobar2, foo;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, c.get('foo.bar')];
                                        case 1:
                                            foobar = _a.sent();
                                            chai_1.expect(foobar).to.be.equal('foobar');
                                            return [4 /*yield*/, c.get('foo.foobar')];
                                        case 2:
                                            foobar2 = _a.sent();
                                            chai_1.expect(foobar2).to.be.equal('foobarfoobar');
                                            return [4 /*yield*/, c.get('foo')];
                                        case 3:
                                            foo = _a.sent();
                                            chai_1.expect(foo).to.be.deep.equal({ bar: 'foobar', foobar: 'foobarfoobar' });
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, 100, chai_1.expect)];
                    case 1:
                        (_a.sent())
                            .to.be.lte(1000 /** make it high for loaded CI services **/, 'Configuration get takes avg lte');
                        return [2 /*return*/];
                }
            });
        });
    });
    function produceValueAndDerivatedMessage(value, msg) {
        return { value: value, msg: msg };
    }
    it('is performant construction', function () {
        return __awaiter(this, void 0, void 0, function () {
            var tester;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tester = new function_load_perf_tester_lib_1.FunctionLoadTester();
                        return [4 /*yield*/, tester
                                .measureAverage(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    new impl_1.Configuration();
                                    return [2 /*return*/];
                                });
                            }); }, 100, chai_1.expect)];
                    case 1:
                        (_a.sent())
                            .to.be.lte(1000 /** make it high for loaded CI services **/, "Construction must be lte");
                        return [2 /*return*/];
                }
            });
        });
    });
    it('is performant set foo=bar', function () {
        return __awaiter(this, void 0, void 0, function () {
            var tester, configUnderTest;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tester = new function_load_perf_tester_lib_1.FunctionLoadTester();
                        configUnderTest = new impl_1.Configuration();
                        return [4 /*yield*/, tester
                                .measureAverage(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, configUnderTest.set('foo', 'bar')];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, 100, chai_1.expect)];
                    case 1:
                        (_a.sent())
                            .to.be.lessThan(1000 /** make it high for loaded CI services **/, 'Configuration.set foo bar lte');
                        return [2 /*return*/];
                }
            });
        });
    });
});
//# sourceMappingURL=Configuration.specs.js.map