"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e13) {
      throw mod = 0, e13;
    }
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __decorateClass = (decorators, target, key, kind) => {
    var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
    for (var i10 = decorators.length - 1, decorator; i10 >= 0; i10--)
      if (decorator = decorators[i10])
        result = (kind ? decorator(target, key, result) : decorator(result)) || result;
    if (kind && result) __defProp(target, key, result);
    return result;
  };

  // ../node_modules/tslib/tslib.js
  var require_tslib = __commonJS({
    "../node_modules/tslib/tslib.js"(exports, module) {
      var __extends2;
      var __assign2;
      var __rest2;
      var __decorate2;
      var __param2;
      var __esDecorate2;
      var __runInitializers2;
      var __propKey2;
      var __setFunctionName2;
      var __metadata2;
      var __awaiter2;
      var __generator2;
      var __exportStar2;
      var __values2;
      var __read2;
      var __spread2;
      var __spreadArrays2;
      var __spreadArray2;
      var __await2;
      var __asyncGenerator2;
      var __asyncDelegator2;
      var __asyncValues2;
      var __makeTemplateObject2;
      var __importStar2;
      var __importDefault2;
      var __classPrivateFieldGet2;
      var __classPrivateFieldSet2;
      var __classPrivateFieldIn2;
      var __createBinding2;
      (function(factory) {
        var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
        if (typeof define === "function" && define.amd) {
          define("tslib", ["exports"], function(exports2) {
            factory(createExporter(root, createExporter(exports2)));
          });
        } else if (typeof module === "object" && typeof module.exports === "object") {
          factory(createExporter(root, createExporter(module.exports)));
        } else {
          factory(createExporter(root));
        }
        function createExporter(exports2, previous) {
          if (exports2 !== root) {
            if (typeof Object.create === "function") {
              Object.defineProperty(exports2, "__esModule", { value: true });
            } else {
              exports2.__esModule = true;
            }
          }
          return function(id, v5) {
            return exports2[id] = previous ? previous(id, v5) : v5;
          };
        }
      })(function(exporter) {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d5, b4) {
          d5.__proto__ = b4;
        } || function(d5, b4) {
          for (var p5 in b4) if (Object.prototype.hasOwnProperty.call(b4, p5)) d5[p5] = b4[p5];
        };
        __extends2 = function(d5, b4) {
          if (typeof b4 !== "function" && b4 !== null)
            throw new TypeError("Class extends value " + String(b4) + " is not a constructor or null");
          extendStatics(d5, b4);
          function __() {
            this.constructor = d5;
          }
          d5.prototype = b4 === null ? Object.create(b4) : (__.prototype = b4.prototype, new __());
        };
        __assign2 = Object.assign || function(t7) {
          for (var s8, i10 = 1, n13 = arguments.length; i10 < n13; i10++) {
            s8 = arguments[i10];
            for (var p5 in s8) if (Object.prototype.hasOwnProperty.call(s8, p5)) t7[p5] = s8[p5];
          }
          return t7;
        };
        __rest2 = function(s8, e13) {
          var t7 = {};
          for (var p5 in s8) if (Object.prototype.hasOwnProperty.call(s8, p5) && e13.indexOf(p5) < 0)
            t7[p5] = s8[p5];
          if (s8 != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i10 = 0, p5 = Object.getOwnPropertySymbols(s8); i10 < p5.length; i10++) {
              if (e13.indexOf(p5[i10]) < 0 && Object.prototype.propertyIsEnumerable.call(s8, p5[i10]))
                t7[p5[i10]] = s8[p5[i10]];
            }
          return t7;
        };
        __decorate2 = function(decorators, target, key, desc) {
          var c7 = arguments.length, r8 = c7 < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d5;
          if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r8 = Reflect.decorate(decorators, target, key, desc);
          else for (var i10 = decorators.length - 1; i10 >= 0; i10--) if (d5 = decorators[i10]) r8 = (c7 < 3 ? d5(r8) : c7 > 3 ? d5(target, key, r8) : d5(target, key)) || r8;
          return c7 > 3 && r8 && Object.defineProperty(target, key, r8), r8;
        };
        __param2 = function(paramIndex, decorator) {
          return function(target, key) {
            decorator(target, key, paramIndex);
          };
        };
        __esDecorate2 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
          function accept(f4) {
            if (f4 !== void 0 && typeof f4 !== "function") throw new TypeError("Function expected");
            return f4;
          }
          var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
          var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
          var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
          var _3, done = false;
          for (var i10 = decorators.length - 1; i10 >= 0; i10--) {
            var context = {};
            for (var p5 in contextIn) context[p5] = p5 === "access" ? {} : contextIn[p5];
            for (var p5 in contextIn.access) context.access[p5] = contextIn.access[p5];
            context.addInitializer = function(f4) {
              if (done) throw new TypeError("Cannot add initializers after decoration has completed");
              extraInitializers.push(accept(f4 || null));
            };
            var result = (0, decorators[i10])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
            if (kind === "accessor") {
              if (result === void 0) continue;
              if (result === null || typeof result !== "object") throw new TypeError("Object expected");
              if (_3 = accept(result.get)) descriptor.get = _3;
              if (_3 = accept(result.set)) descriptor.set = _3;
              if (_3 = accept(result.init)) initializers.unshift(_3);
            } else if (_3 = accept(result)) {
              if (kind === "field") initializers.unshift(_3);
              else descriptor[key] = _3;
            }
          }
          if (target) Object.defineProperty(target, contextIn.name, descriptor);
          done = true;
        };
        __runInitializers2 = function(thisArg, initializers, value) {
          var useValue = arguments.length > 2;
          for (var i10 = 0; i10 < initializers.length; i10++) {
            value = useValue ? initializers[i10].call(thisArg, value) : initializers[i10].call(thisArg);
          }
          return useValue ? value : void 0;
        };
        __propKey2 = function(x3) {
          return typeof x3 === "symbol" ? x3 : "".concat(x3);
        };
        __setFunctionName2 = function(f4, name, prefix) {
          if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
          return Object.defineProperty(f4, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
        };
        __metadata2 = function(metadataKey, metadataValue) {
          if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
        };
        __awaiter2 = function(thisArg, _arguments, P2, generator) {
          function adopt(value) {
            return value instanceof P2 ? value : new P2(function(resolve) {
              resolve(value);
            });
          }
          return new (P2 || (P2 = Promise))(function(resolve, reject) {
            function fulfilled(value) {
              try {
                step(generator.next(value));
              } catch (e13) {
                reject(e13);
              }
            }
            function rejected(value) {
              try {
                step(generator["throw"](value));
              } catch (e13) {
                reject(e13);
              }
            }
            function step(result) {
              result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
          });
        };
        __generator2 = function(thisArg, body) {
          var _3 = { label: 0, sent: function() {
            if (t7[0] & 1) throw t7[1];
            return t7[1];
          }, trys: [], ops: [] }, f4, y4, t7, g4;
          return g4 = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g4[Symbol.iterator] = function() {
            return this;
          }), g4;
          function verb(n13) {
            return function(v5) {
              return step([n13, v5]);
            };
          }
          function step(op) {
            if (f4) throw new TypeError("Generator is already executing.");
            while (g4 && (g4 = 0, op[0] && (_3 = 0)), _3) try {
              if (f4 = 1, y4 && (t7 = op[0] & 2 ? y4["return"] : op[0] ? y4["throw"] || ((t7 = y4["return"]) && t7.call(y4), 0) : y4.next) && !(t7 = t7.call(y4, op[1])).done) return t7;
              if (y4 = 0, t7) op = [op[0] & 2, t7.value];
              switch (op[0]) {
                case 0:
                case 1:
                  t7 = op;
                  break;
                case 4:
                  _3.label++;
                  return { value: op[1], done: false };
                case 5:
                  _3.label++;
                  y4 = op[1];
                  op = [0];
                  continue;
                case 7:
                  op = _3.ops.pop();
                  _3.trys.pop();
                  continue;
                default:
                  if (!(t7 = _3.trys, t7 = t7.length > 0 && t7[t7.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                    _3 = 0;
                    continue;
                  }
                  if (op[0] === 3 && (!t7 || op[1] > t7[0] && op[1] < t7[3])) {
                    _3.label = op[1];
                    break;
                  }
                  if (op[0] === 6 && _3.label < t7[1]) {
                    _3.label = t7[1];
                    t7 = op;
                    break;
                  }
                  if (t7 && _3.label < t7[2]) {
                    _3.label = t7[2];
                    _3.ops.push(op);
                    break;
                  }
                  if (t7[2]) _3.ops.pop();
                  _3.trys.pop();
                  continue;
              }
              op = body.call(thisArg, _3);
            } catch (e13) {
              op = [6, e13];
              y4 = 0;
            } finally {
              f4 = t7 = 0;
            }
            if (op[0] & 5) throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
          }
        };
        __exportStar2 = function(m3, o11) {
          for (var p5 in m3) if (p5 !== "default" && !Object.prototype.hasOwnProperty.call(o11, p5)) __createBinding2(o11, m3, p5);
        };
        __createBinding2 = Object.create ? (function(o11, m3, k2, k22) {
          if (k22 === void 0) k22 = k2;
          var desc = Object.getOwnPropertyDescriptor(m3, k2);
          if (!desc || ("get" in desc ? !m3.__esModule : desc.writable || desc.configurable)) {
            desc = { enumerable: true, get: function() {
              return m3[k2];
            } };
          }
          Object.defineProperty(o11, k22, desc);
        }) : (function(o11, m3, k2, k22) {
          if (k22 === void 0) k22 = k2;
          o11[k22] = m3[k2];
        });
        __values2 = function(o11) {
          var s8 = typeof Symbol === "function" && Symbol.iterator, m3 = s8 && o11[s8], i10 = 0;
          if (m3) return m3.call(o11);
          if (o11 && typeof o11.length === "number") return {
            next: function() {
              if (o11 && i10 >= o11.length) o11 = void 0;
              return { value: o11 && o11[i10++], done: !o11 };
            }
          };
          throw new TypeError(s8 ? "Object is not iterable." : "Symbol.iterator is not defined.");
        };
        __read2 = function(o11, n13) {
          var m3 = typeof Symbol === "function" && o11[Symbol.iterator];
          if (!m3) return o11;
          var i10 = m3.call(o11), r8, ar = [], e13;
          try {
            while ((n13 === void 0 || n13-- > 0) && !(r8 = i10.next()).done) ar.push(r8.value);
          } catch (error) {
            e13 = { error };
          } finally {
            try {
              if (r8 && !r8.done && (m3 = i10["return"])) m3.call(i10);
            } finally {
              if (e13) throw e13.error;
            }
          }
          return ar;
        };
        __spread2 = function() {
          for (var ar = [], i10 = 0; i10 < arguments.length; i10++)
            ar = ar.concat(__read2(arguments[i10]));
          return ar;
        };
        __spreadArrays2 = function() {
          for (var s8 = 0, i10 = 0, il = arguments.length; i10 < il; i10++) s8 += arguments[i10].length;
          for (var r8 = Array(s8), k2 = 0, i10 = 0; i10 < il; i10++)
            for (var a7 = arguments[i10], j3 = 0, jl = a7.length; j3 < jl; j3++, k2++)
              r8[k2] = a7[j3];
          return r8;
        };
        __spreadArray2 = function(to, from, pack) {
          if (pack || arguments.length === 2) for (var i10 = 0, l11 = from.length, ar; i10 < l11; i10++) {
            if (ar || !(i10 in from)) {
              if (!ar) ar = Array.prototype.slice.call(from, 0, i10);
              ar[i10] = from[i10];
            }
          }
          return to.concat(ar || Array.prototype.slice.call(from));
        };
        __await2 = function(v5) {
          return this instanceof __await2 ? (this.v = v5, this) : new __await2(v5);
        };
        __asyncGenerator2 = function(thisArg, _arguments, generator) {
          if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
          var g4 = generator.apply(thisArg, _arguments || []), i10, q = [];
          return i10 = {}, verb("next"), verb("throw"), verb("return"), i10[Symbol.asyncIterator] = function() {
            return this;
          }, i10;
          function verb(n13) {
            if (g4[n13]) i10[n13] = function(v5) {
              return new Promise(function(a7, b4) {
                q.push([n13, v5, a7, b4]) > 1 || resume(n13, v5);
              });
            };
          }
          function resume(n13, v5) {
            try {
              step(g4[n13](v5));
            } catch (e13) {
              settle(q[0][3], e13);
            }
          }
          function step(r8) {
            r8.value instanceof __await2 ? Promise.resolve(r8.value.v).then(fulfill, reject) : settle(q[0][2], r8);
          }
          function fulfill(value) {
            resume("next", value);
          }
          function reject(value) {
            resume("throw", value);
          }
          function settle(f4, v5) {
            if (f4(v5), q.shift(), q.length) resume(q[0][0], q[0][1]);
          }
        };
        __asyncDelegator2 = function(o11) {
          var i10, p5;
          return i10 = {}, verb("next"), verb("throw", function(e13) {
            throw e13;
          }), verb("return"), i10[Symbol.iterator] = function() {
            return this;
          }, i10;
          function verb(n13, f4) {
            i10[n13] = o11[n13] ? function(v5) {
              return (p5 = !p5) ? { value: __await2(o11[n13](v5)), done: false } : f4 ? f4(v5) : v5;
            } : f4;
          }
        };
        __asyncValues2 = function(o11) {
          if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
          var m3 = o11[Symbol.asyncIterator], i10;
          return m3 ? m3.call(o11) : (o11 = typeof __values2 === "function" ? __values2(o11) : o11[Symbol.iterator](), i10 = {}, verb("next"), verb("throw"), verb("return"), i10[Symbol.asyncIterator] = function() {
            return this;
          }, i10);
          function verb(n13) {
            i10[n13] = o11[n13] && function(v5) {
              return new Promise(function(resolve, reject) {
                v5 = o11[n13](v5), settle(resolve, reject, v5.done, v5.value);
              });
            };
          }
          function settle(resolve, reject, d5, v5) {
            Promise.resolve(v5).then(function(v6) {
              resolve({ value: v6, done: d5 });
            }, reject);
          }
        };
        __makeTemplateObject2 = function(cooked, raw) {
          if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
          } else {
            cooked.raw = raw;
          }
          return cooked;
        };
        var __setModuleDefault = Object.create ? (function(o11, v5) {
          Object.defineProperty(o11, "default", { enumerable: true, value: v5 });
        }) : function(o11, v5) {
          o11["default"] = v5;
        };
        __importStar2 = function(mod) {
          if (mod && mod.__esModule) return mod;
          var result = {};
          if (mod != null) {
            for (var k2 in mod) if (k2 !== "default" && Object.prototype.hasOwnProperty.call(mod, k2)) __createBinding2(result, mod, k2);
          }
          __setModuleDefault(result, mod);
          return result;
        };
        __importDefault2 = function(mod) {
          return mod && mod.__esModule ? mod : { "default": mod };
        };
        __classPrivateFieldGet2 = function(receiver, state, kind, f4) {
          if (kind === "a" && !f4) throw new TypeError("Private accessor was defined without a getter");
          if (typeof state === "function" ? receiver !== state || !f4 : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
          return kind === "m" ? f4 : kind === "a" ? f4.call(receiver) : f4 ? f4.value : state.get(receiver);
        };
        __classPrivateFieldSet2 = function(receiver, state, value, kind, f4) {
          if (kind === "m") throw new TypeError("Private method is not writable");
          if (kind === "a" && !f4) throw new TypeError("Private accessor was defined without a setter");
          if (typeof state === "function" ? receiver !== state || !f4 : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
          return kind === "a" ? f4.call(receiver, value) : f4 ? f4.value = value : state.set(receiver, value), value;
        };
        __classPrivateFieldIn2 = function(state, receiver) {
          if (receiver === null || typeof receiver !== "object" && typeof receiver !== "function") throw new TypeError("Cannot use 'in' operator on non-object");
          return typeof state === "function" ? receiver === state : state.has(receiver);
        };
        exporter("__extends", __extends2);
        exporter("__assign", __assign2);
        exporter("__rest", __rest2);
        exporter("__decorate", __decorate2);
        exporter("__param", __param2);
        exporter("__esDecorate", __esDecorate2);
        exporter("__runInitializers", __runInitializers2);
        exporter("__propKey", __propKey2);
        exporter("__setFunctionName", __setFunctionName2);
        exporter("__metadata", __metadata2);
        exporter("__awaiter", __awaiter2);
        exporter("__generator", __generator2);
        exporter("__exportStar", __exportStar2);
        exporter("__createBinding", __createBinding2);
        exporter("__values", __values2);
        exporter("__read", __read2);
        exporter("__spread", __spread2);
        exporter("__spreadArrays", __spreadArrays2);
        exporter("__spreadArray", __spreadArray2);
        exporter("__await", __await2);
        exporter("__asyncGenerator", __asyncGenerator2);
        exporter("__asyncDelegator", __asyncDelegator2);
        exporter("__asyncValues", __asyncValues2);
        exporter("__makeTemplateObject", __makeTemplateObject2);
        exporter("__importStar", __importStar2);
        exporter("__importDefault", __importDefault2);
        exporter("__classPrivateFieldGet", __classPrivateFieldGet2);
        exporter("__classPrivateFieldSet", __classPrivateFieldSet2);
        exporter("__classPrivateFieldIn", __classPrivateFieldIn2);
      });
    }
  });

  // ../node_modules/tslib/modules/index.js
  var import_tslib = __toESM(require_tslib(), 1);
  var {
    __extends,
    __assign,
    __rest,
    __decorate,
    __param,
    __esDecorate,
    __runInitializers,
    __propKey,
    __setFunctionName,
    __metadata,
    __awaiter,
    __generator,
    __exportStar,
    __createBinding,
    __values,
    __read,
    __spread,
    __spreadArrays,
    __spreadArray,
    __await,
    __asyncGenerator,
    __asyncDelegator,
    __asyncValues,
    __makeTemplateObject,
    __importStar,
    __importDefault,
    __classPrivateFieldGet,
    __classPrivateFieldSet,
    __classPrivateFieldIn
  } = import_tslib.default;

  // ../node_modules/@lit/reactive-element/node/decorators/custom-element.js
  var e = (e13) => (n13) => "function" == typeof n13 ? ((e14, n14) => (customElements.define(e14, n14), n14))(e13, n13) : ((e14, n14) => {
    const { kind: t7, elements: s8 } = n14;
    return { kind: t7, elements: s8, finisher(n15) {
      customElements.define(e14, n15);
    } };
  })(e13, n13);

  // ../node_modules/@lit/reactive-element/node/decorators/property.js
  var i = (i10, e13) => "method" === e13.kind && e13.descriptor && !("value" in e13.descriptor) ? { ...e13, finisher(n13) {
    n13.createProperty(e13.key, i10);
  } } : { kind: "field", key: /* @__PURE__ */ Symbol(), placement: "own", descriptor: {}, originalKey: e13.key, initializer() {
    "function" == typeof e13.initializer && (this[e13.key] = e13.initializer.call(this));
  }, finisher(n13) {
    n13.createProperty(e13.key, i10);
  } };
  var e2 = (i10, e13, n13) => {
    e13.constructor.createProperty(n13, i10);
  };
  function n(n13) {
    return (t7, o11) => void 0 !== o11 ? e2(n13, t7, o11) : i(n13, t7);
  }

  // ../node_modules/@lit/reactive-element/node/decorators/state.js
  function t(t7) {
    return n({ ...t7, state: true });
  }

  // ../node_modules/@lit/reactive-element/node/decorators/base.js
  var o = ({ finisher: e13, descriptor: t7 }) => (o11, n13) => {
    var r8;
    if (void 0 === n13) {
      const n14 = null !== (r8 = o11.originalKey) && void 0 !== r8 ? r8 : o11.key, i10 = null != t7 ? { kind: "method", placement: "prototype", key: n14, descriptor: t7(o11.key) } : { ...o11, key: n14 };
      return null != e13 && (i10.finisher = function(t8) {
        e13(t8, n14);
      }), i10;
    }
    {
      const r9 = o11.constructor;
      void 0 !== t7 && Object.defineProperty(o11, n13, t7(n13)), null == e13 || e13(r9, n13);
    }
  };

  // ../node_modules/@lit/reactive-element/node/decorators/query.js
  function i2(i10, n13) {
    return o({ descriptor: (o11) => {
      const t7 = { get() {
        var o12, n14;
        return null !== (n14 = null === (o12 = this.renderRoot) || void 0 === o12 ? void 0 : o12.querySelector(i10)) && void 0 !== n14 ? n14 : null;
      }, enumerable: true, configurable: true };
      if (n13) {
        const n14 = "symbol" == typeof o11 ? /* @__PURE__ */ Symbol() : "__" + o11;
        t7.get = function() {
          var o12, t8;
          return void 0 === this[n14] && (this[n14] = null !== (t8 = null === (o12 = this.renderRoot) || void 0 === o12 ? void 0 : o12.querySelector(i10)) && void 0 !== t8 ? t8 : null), this[n14];
        };
      }
      return t7;
    } });
  }

  // ../node_modules/@lit/reactive-element/node/decorators/query-all.js
  function e3(e13) {
    return o({ descriptor: (r8) => ({ get() {
      var r9, o11;
      return null !== (o11 = null === (r9 = this.renderRoot) || void 0 === r9 ? void 0 : r9.querySelectorAll(e13)) && void 0 !== o11 ? o11 : [];
    }, enumerable: true, configurable: true }) });
  }

  // ../node_modules/@lit/reactive-element/node/decorators/query-async.js
  function e4(e13) {
    return o({ descriptor: (r8) => ({ async get() {
      var r9;
      return await this.updateComplete, null === (r9 = this.renderRoot) || void 0 === r9 ? void 0 : r9.querySelector(e13);
    }, enumerable: true, configurable: true }) });
  }

  // ../node_modules/@lit/reactive-element/node/decorators/query-assigned-elements.js
  var l;
  var n2 = null != (null === (l = globalThis.HTMLSlotElement) || void 0 === l ? void 0 : l.prototype.assignedElements) ? (o11, l11) => o11.assignedElements(l11) : (o11, l11) => o11.assignedNodes(l11).filter(((o12) => o12.nodeType === Node.ELEMENT_NODE));
  function e5(l11) {
    const { slot: e13, selector: t7 } = null != l11 ? l11 : {};
    return o({ descriptor: (o11) => ({ get() {
      var o12;
      const r8 = "slot" + (e13 ? `[name=${e13}]` : ":not([name])"), s8 = null === (o12 = this.renderRoot) || void 0 === o12 ? void 0 : o12.querySelector(r8), i10 = null != s8 ? n2(s8, l11) : [];
      return t7 ? i10.filter(((o13) => o13.matches(t7))) : i10;
    }, enumerable: true, configurable: true }) });
  }

  // ../node_modules/@lit/reactive-element/node/decorators/query-assigned-nodes.js
  function o2(o11, n13, r8) {
    let l11, s8 = o11;
    return "object" == typeof o11 ? (s8 = o11.slot, l11 = o11) : l11 = { flatten: n13 }, r8 ? e5({ slot: s8, flatten: n13, selector: r8 }) : o({ descriptor: (e13) => ({ get() {
      var e14, t7;
      const o12 = "slot" + (s8 ? `[name=${s8}]` : ":not([name])"), n14 = null === (e14 = this.renderRoot) || void 0 === e14 ? void 0 : e14.querySelector(o12);
      return null !== (t7 = null == n14 ? void 0 : n14.assignedNodes(l11)) && void 0 !== t7 ? t7 : [];
    }, enumerable: true, configurable: true }) });
  }

  // ../node_modules/@lit-labs/ssr-dom-shim/lib/element-internals.js
  var ElementInternalsShim = class ElementInternals {
    get shadowRoot() {
      return this.__host.__shadowRoot;
    }
    constructor(_host) {
      this.ariaAtomic = "";
      this.ariaAutoComplete = "";
      this.ariaBrailleLabel = "";
      this.ariaBrailleRoleDescription = "";
      this.ariaBusy = "";
      this.ariaChecked = "";
      this.ariaColCount = "";
      this.ariaColIndex = "";
      this.ariaColSpan = "";
      this.ariaCurrent = "";
      this.ariaDescription = "";
      this.ariaDisabled = "";
      this.ariaExpanded = "";
      this.ariaHasPopup = "";
      this.ariaHidden = "";
      this.ariaInvalid = "";
      this.ariaKeyShortcuts = "";
      this.ariaLabel = "";
      this.ariaLevel = "";
      this.ariaLive = "";
      this.ariaModal = "";
      this.ariaMultiLine = "";
      this.ariaMultiSelectable = "";
      this.ariaOrientation = "";
      this.ariaPlaceholder = "";
      this.ariaPosInSet = "";
      this.ariaPressed = "";
      this.ariaReadOnly = "";
      this.ariaRequired = "";
      this.ariaRoleDescription = "";
      this.ariaRowCount = "";
      this.ariaRowIndex = "";
      this.ariaRowSpan = "";
      this.ariaSelected = "";
      this.ariaSetSize = "";
      this.ariaSort = "";
      this.ariaValueMax = "";
      this.ariaValueMin = "";
      this.ariaValueNow = "";
      this.ariaValueText = "";
      this.role = "";
      this.form = null;
      this.labels = [];
      this.states = /* @__PURE__ */ new Set();
      this.validationMessage = "";
      this.validity = {};
      this.willValidate = true;
      this.__host = _host;
    }
    checkValidity() {
      console.warn("`ElementInternals.checkValidity()` was called on the server.This method always returns true.");
      return true;
    }
    reportValidity() {
      return true;
    }
    setFormValue() {
    }
    setValidity() {
    }
  };

  // ../node_modules/@lit-labs/ssr-dom-shim/index.js
  var attributes = /* @__PURE__ */ new WeakMap();
  var attributesForElement = (element) => {
    let attrs = attributes.get(element);
    if (attrs === void 0) {
      attributes.set(element, attrs = /* @__PURE__ */ new Map());
    }
    return attrs;
  };
  var ElementShim = class Element {
    constructor() {
      this.__shadowRootMode = null;
      this.__shadowRoot = null;
      this.__internals = null;
    }
    get attributes() {
      return Array.from(attributesForElement(this)).map(([name, value]) => ({
        name,
        value
      }));
    }
    get shadowRoot() {
      if (this.__shadowRootMode === "closed") {
        return null;
      }
      return this.__shadowRoot;
    }
    get localName() {
      return this.constructor.__localName;
    }
    get tagName() {
      return this.localName?.toUpperCase();
    }
    setAttribute(name, value) {
      attributesForElement(this).set(name, String(value));
    }
    removeAttribute(name) {
      attributesForElement(this).delete(name);
    }
    toggleAttribute(name, force) {
      if (this.hasAttribute(name)) {
        if (force === void 0 || !force) {
          this.removeAttribute(name);
          return false;
        }
      } else {
        if (force === void 0 || force) {
          this.setAttribute(name, "");
          return true;
        } else {
          return false;
        }
      }
      return true;
    }
    hasAttribute(name) {
      return attributesForElement(this).has(name);
    }
    attachShadow(init) {
      const shadowRoot = { host: this };
      this.__shadowRootMode = init.mode;
      if (init && init.mode === "open") {
        this.__shadowRoot = shadowRoot;
      }
      return shadowRoot;
    }
    attachInternals() {
      if (this.__internals !== null) {
        throw new Error(`Failed to execute 'attachInternals' on 'HTMLElement': ElementInternals for the specified element was already attached.`);
      }
      const internals2 = new ElementInternalsShim(this);
      this.__internals = internals2;
      return internals2;
    }
    getAttribute(name) {
      const value = attributesForElement(this).get(name);
      return value ?? null;
    }
  };
  var HTMLElementShim = class HTMLElement2 extends ElementShim {
  };
  var HTMLElementShimWithRealType = HTMLElementShim;
  var CustomElementRegistryShim = class CustomElementRegistry {
    constructor() {
      this.__definitions = /* @__PURE__ */ new Map();
    }
    define(name, ctor) {
      if (this.__definitions.has(name)) {
        if (true) {
          console.warn(`'CustomElementRegistry' already has "${name}" defined. This may have been caused by live reload or hot module replacement in which case it can be safely ignored.
Make sure to test your application with a production build as repeat registrations will throw in production.`);
        } else {
          throw new Error(`Failed to execute 'define' on 'CustomElementRegistry': the name "${name}" has already been used with this registry`);
        }
      }
      ctor.__localName = name;
      this.__definitions.set(name, {
        ctor,
        // Note it's important we read `observedAttributes` in case it is a getter
        // with side-effects, as is the case in Lit, where it triggers class
        // finalization.
        //
        // TODO(aomarks) To be spec compliant, we should also capture the
        // registration-time lifecycle methods like `connectedCallback`. For them
        // to be actually accessible to e.g. the Lit SSR element renderer, though,
        // we'd need to introduce a new API for accessing them (since `get` only
        // returns the constructor).
        observedAttributes: ctor.observedAttributes ?? []
      });
    }
    get(name) {
      const definition = this.__definitions.get(name);
      return definition?.ctor;
    }
  };
  var CustomElementRegistryShimWithRealType = CustomElementRegistryShim;
  var customElements2 = new CustomElementRegistryShimWithRealType();

  // ../node_modules/@lit/reactive-element/node/css-tag.js
  var t2 = globalThis;
  var e6 = t2.ShadowRoot && (void 0 === t2.ShadyCSS || t2.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
  var s = /* @__PURE__ */ Symbol();
  var n3 = /* @__PURE__ */ new WeakMap();
  var o3 = class {
    constructor(t7, e13, n13) {
      if (this._$cssResult$ = true, n13 !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
      this.cssText = t7, this.t = e13;
    }
    get styleSheet() {
      let t7 = this.o;
      const s8 = this.t;
      if (e6 && void 0 === t7) {
        const e13 = void 0 !== s8 && 1 === s8.length;
        e13 && (t7 = n3.get(s8)), void 0 === t7 && ((this.o = t7 = new CSSStyleSheet()).replaceSync(this.cssText), e13 && n3.set(s8, t7));
      }
      return t7;
    }
    toString() {
      return this.cssText;
    }
  };
  var r = (t7) => new o3("string" == typeof t7 ? t7 : t7 + "", void 0, s);
  var i3 = (t7, ...e13) => {
    const n13 = 1 === t7.length ? t7[0] : e13.reduce(((e14, s8, n14) => e14 + ((t8) => {
      if (true === t8._$cssResult$) return t8.cssText;
      if ("number" == typeof t8) return t8;
      throw Error("Value passed to 'css' function must be a 'css' function result: " + t8 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
    })(s8) + t7[n14 + 1]), t7[0]);
    return new o3(n13, t7, s);
  };
  var S = (s8, n13) => {
    e6 ? s8.adoptedStyleSheets = n13.map(((t7) => t7 instanceof CSSStyleSheet ? t7 : t7.styleSheet)) : n13.forEach(((e13) => {
      const n14 = document.createElement("style"), o11 = t2.litNonce;
      void 0 !== o11 && n14.setAttribute("nonce", o11), n14.textContent = e13.cssText, s8.appendChild(n14);
    }));
  };
  var c = e6 || void 0 === t2.CSSStyleSheet ? (t7) => t7 : (t7) => t7 instanceof CSSStyleSheet ? ((t8) => {
    let e13 = "";
    for (const s8 of t8.cssRules) e13 += s8.cssText;
    return r(e13);
  })(t7) : t7;

  // ../node_modules/@lit/reactive-element/node/reactive-element.js
  var r2;
  var h;
  var o4 = globalThis;
  null !== (r2 = o4.customElements) && void 0 !== r2 || (o4.customElements = customElements2);
  var n4 = o4.trustedTypes;
  var l2 = n4 ? n4.emptyScript : "";
  var a = o4.reactiveElementPolyfillSupport;
  var d = { toAttribute(t7, i10) {
    switch (i10) {
      case Boolean:
        t7 = t7 ? l2 : null;
        break;
      case Object:
      case Array:
        t7 = null == t7 ? t7 : JSON.stringify(t7);
    }
    return t7;
  }, fromAttribute(t7, i10) {
    let s8 = t7;
    switch (i10) {
      case Boolean:
        s8 = null !== t7;
        break;
      case Number:
        s8 = null === t7 ? null : Number(t7);
        break;
      case Object:
      case Array:
        try {
          s8 = JSON.parse(t7);
        } catch (t8) {
          s8 = null;
        }
    }
    return s8;
  } };
  var u = (t7, i10) => i10 !== t7 && (i10 == i10 || t7 == t7);
  var c2 = { attribute: true, type: String, converter: d, reflect: false, hasChanged: u };
  var v = "finalized";
  var p = class extends (globalThis.HTMLElement ?? HTMLElementShimWithRealType) {
    constructor() {
      super(), this._$Ei = /* @__PURE__ */ new Map(), this.isUpdatePending = false, this.hasUpdated = false, this._$El = null, this.u();
    }
    static addInitializer(t7) {
      var i10;
      this.finalize(), (null !== (i10 = this.h) && void 0 !== i10 ? i10 : this.h = []).push(t7);
    }
    static get observedAttributes() {
      this.finalize();
      const t7 = [];
      return this.elementProperties.forEach(((i10, s8) => {
        const e13 = this._$Ep(s8, i10);
        void 0 !== e13 && (this._$Ev.set(e13, s8), t7.push(e13));
      })), t7;
    }
    static createProperty(t7, i10 = c2) {
      if (i10.state && (i10.attribute = false), this.finalize(), this.elementProperties.set(t7, i10), !i10.noAccessor && !this.prototype.hasOwnProperty(t7)) {
        const s8 = "symbol" == typeof t7 ? /* @__PURE__ */ Symbol() : "__" + t7, e13 = this.getPropertyDescriptor(t7, s8, i10);
        void 0 !== e13 && Object.defineProperty(this.prototype, t7, e13);
      }
    }
    static getPropertyDescriptor(t7, i10, s8) {
      return { get() {
        return this[i10];
      }, set(e13) {
        const r8 = this[t7];
        this[i10] = e13, this.requestUpdate(t7, r8, s8);
      }, configurable: true, enumerable: true };
    }
    static getPropertyOptions(t7) {
      return this.elementProperties.get(t7) || c2;
    }
    static finalize() {
      if (this.hasOwnProperty(v)) return false;
      this[v] = true;
      const t7 = Object.getPrototypeOf(this);
      if (t7.finalize(), void 0 !== t7.h && (this.h = [...t7.h]), this.elementProperties = new Map(t7.elementProperties), this._$Ev = /* @__PURE__ */ new Map(), this.hasOwnProperty("properties")) {
        const t8 = this.properties, i10 = [...Object.getOwnPropertyNames(t8), ...Object.getOwnPropertySymbols(t8)];
        for (const s8 of i10) this.createProperty(s8, t8[s8]);
      }
      return this.elementStyles = this.finalizeStyles(this.styles), true;
    }
    static finalizeStyles(t7) {
      const i10 = [];
      if (Array.isArray(t7)) {
        const e13 = new Set(t7.flat(1 / 0).reverse());
        for (const t8 of e13) i10.unshift(c(t8));
      } else void 0 !== t7 && i10.push(c(t7));
      return i10;
    }
    static _$Ep(t7, i10) {
      const s8 = i10.attribute;
      return false === s8 ? void 0 : "string" == typeof s8 ? s8 : "string" == typeof t7 ? t7.toLowerCase() : void 0;
    }
    u() {
      var t7;
      this._$E_ = new Promise(((t8) => this.enableUpdating = t8)), this._$AL = /* @__PURE__ */ new Map(), this._$Eg(), this.requestUpdate(), null === (t7 = this.constructor.h) || void 0 === t7 || t7.forEach(((t8) => t8(this)));
    }
    addController(t7) {
      var i10, s8;
      (null !== (i10 = this._$ES) && void 0 !== i10 ? i10 : this._$ES = []).push(t7), void 0 !== this.renderRoot && this.isConnected && (null === (s8 = t7.hostConnected) || void 0 === s8 || s8.call(t7));
    }
    removeController(t7) {
      var i10;
      null === (i10 = this._$ES) || void 0 === i10 || i10.splice(this._$ES.indexOf(t7) >>> 0, 1);
    }
    _$Eg() {
      this.constructor.elementProperties.forEach(((t7, i10) => {
        this.hasOwnProperty(i10) && (this._$Ei.set(i10, this[i10]), delete this[i10]);
      }));
    }
    createRenderRoot() {
      var t7;
      const i10 = null !== (t7 = this.shadowRoot) && void 0 !== t7 ? t7 : this.attachShadow(this.constructor.shadowRootOptions);
      return S(i10, this.constructor.elementStyles), i10;
    }
    connectedCallback() {
      var t7;
      void 0 === this.renderRoot && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), null === (t7 = this._$ES) || void 0 === t7 || t7.forEach(((t8) => {
        var i10;
        return null === (i10 = t8.hostConnected) || void 0 === i10 ? void 0 : i10.call(t8);
      }));
    }
    enableUpdating(t7) {
    }
    disconnectedCallback() {
      var t7;
      null === (t7 = this._$ES) || void 0 === t7 || t7.forEach(((t8) => {
        var i10;
        return null === (i10 = t8.hostDisconnected) || void 0 === i10 ? void 0 : i10.call(t8);
      }));
    }
    attributeChangedCallback(t7, i10, s8) {
      this._$AK(t7, s8);
    }
    _$EO(t7, i10, s8 = c2) {
      var e13;
      const r8 = this.constructor._$Ep(t7, s8);
      if (void 0 !== r8 && true === s8.reflect) {
        const h7 = (void 0 !== (null === (e13 = s8.converter) || void 0 === e13 ? void 0 : e13.toAttribute) ? s8.converter : d).toAttribute(i10, s8.type);
        this._$El = t7, null == h7 ? this.removeAttribute(r8) : this.setAttribute(r8, h7), this._$El = null;
      }
    }
    _$AK(t7, i10) {
      var s8;
      const e13 = this.constructor, r8 = e13._$Ev.get(t7);
      if (void 0 !== r8 && this._$El !== r8) {
        const t8 = e13.getPropertyOptions(r8), h7 = "function" == typeof t8.converter ? { fromAttribute: t8.converter } : void 0 !== (null === (s8 = t8.converter) || void 0 === s8 ? void 0 : s8.fromAttribute) ? t8.converter : d;
        this._$El = r8, this[r8] = h7.fromAttribute(i10, t8.type), this._$El = null;
      }
    }
    requestUpdate(t7, i10, s8) {
      let e13 = true;
      void 0 !== t7 && (((s8 = s8 || this.constructor.getPropertyOptions(t7)).hasChanged || u)(this[t7], i10) ? (this._$AL.has(t7) || this._$AL.set(t7, i10), true === s8.reflect && this._$El !== t7 && (void 0 === this._$EC && (this._$EC = /* @__PURE__ */ new Map()), this._$EC.set(t7, s8))) : e13 = false), !this.isUpdatePending && e13 && (this._$E_ = this._$Ej());
    }
    async _$Ej() {
      this.isUpdatePending = true;
      try {
        await this._$E_;
      } catch (t8) {
        Promise.reject(t8);
      }
      const t7 = this.scheduleUpdate();
      return null != t7 && await t7, !this.isUpdatePending;
    }
    scheduleUpdate() {
      return this.performUpdate();
    }
    performUpdate() {
      var t7;
      if (!this.isUpdatePending) return;
      this.hasUpdated, this._$Ei && (this._$Ei.forEach(((t8, i11) => this[i11] = t8)), this._$Ei = void 0);
      let i10 = false;
      const s8 = this._$AL;
      try {
        i10 = this.shouldUpdate(s8), i10 ? (this.willUpdate(s8), null === (t7 = this._$ES) || void 0 === t7 || t7.forEach(((t8) => {
          var i11;
          return null === (i11 = t8.hostUpdate) || void 0 === i11 ? void 0 : i11.call(t8);
        })), this.update(s8)) : this._$Ek();
      } catch (t8) {
        throw i10 = false, this._$Ek(), t8;
      }
      i10 && this._$AE(s8);
    }
    willUpdate(t7) {
    }
    _$AE(t7) {
      var i10;
      null === (i10 = this._$ES) || void 0 === i10 || i10.forEach(((t8) => {
        var i11;
        return null === (i11 = t8.hostUpdated) || void 0 === i11 ? void 0 : i11.call(t8);
      })), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t7)), this.updated(t7);
    }
    _$Ek() {
      this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
    }
    get updateComplete() {
      return this.getUpdateComplete();
    }
    getUpdateComplete() {
      return this._$E_;
    }
    shouldUpdate(t7) {
      return true;
    }
    update(t7) {
      void 0 !== this._$EC && (this._$EC.forEach(((t8, i10) => this._$EO(i10, this[i10], t8))), this._$EC = void 0), this._$Ek();
    }
    updated(t7) {
    }
    firstUpdated(t7) {
    }
  };
  p[v] = true, p.elementProperties = /* @__PURE__ */ new Map(), p.elementStyles = [], p.shadowRootOptions = { mode: "open" }, null == a || a({ ReactiveElement: p }), (null !== (h = o4.reactiveElementVersions) && void 0 !== h ? h : o4.reactiveElementVersions = []).push("1.6.2");

  // ../node_modules/lit-html/node/lit-html.js
  var t3;
  var i4 = globalThis;
  var s2 = i4.trustedTypes;
  var e7 = s2 ? s2.createPolicy("lit-html", { createHTML: (t7) => t7 }) : void 0;
  var o5 = "$lit$";
  var n5 = `lit$${(Math.random() + "").slice(9)}$`;
  var l3 = "?" + n5;
  var h2 = `<${l3}>`;
  var r3 = void 0 === i4.document ? { createTreeWalker: () => ({}) } : document;
  var u2 = () => r3.createComment("");
  var d2 = (t7) => null === t7 || "object" != typeof t7 && "function" != typeof t7;
  var c3 = Array.isArray;
  var v2 = (t7) => c3(t7) || "function" == typeof (null == t7 ? void 0 : t7[Symbol.iterator]);
  var a2 = "[ 	\n\f\r]";
  var f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
  var _ = /-->/g;
  var m = />/g;
  var p2 = RegExp(`>|${a2}(?:([^\\s"'>=/]+)(${a2}*=${a2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
  var g = /'/g;
  var $ = /"/g;
  var y = /^(?:script|style|textarea|title)$/i;
  var x = (t7) => (i10, ...s8) => ({ _$litType$: t7, strings: i10, values: s8 });
  var T = x(1);
  var b = x(2);
  var w = /* @__PURE__ */ Symbol.for("lit-noChange");
  var A = /* @__PURE__ */ Symbol.for("lit-nothing");
  var E = /* @__PURE__ */ new WeakMap();
  var C = r3.createTreeWalker(r3, 129, null, false);
  function P(t7, i10) {
    if (!Array.isArray(t7) || !t7.hasOwnProperty("raw")) throw Error("invalid template strings array");
    return void 0 !== e7 ? e7.createHTML(i10) : i10;
  }
  var V = (t7, i10) => {
    const s8 = t7.length - 1, e13 = [];
    let l11, r8 = 2 === i10 ? "<svg>" : "", u6 = f;
    for (let i11 = 0; i11 < s8; i11++) {
      const s9 = t7[i11];
      let d5, c7, v5 = -1, a7 = 0;
      for (; a7 < s9.length && (u6.lastIndex = a7, c7 = u6.exec(s9), null !== c7); ) a7 = u6.lastIndex, u6 === f ? "!--" === c7[1] ? u6 = _ : void 0 !== c7[1] ? u6 = m : void 0 !== c7[2] ? (y.test(c7[2]) && (l11 = RegExp("</" + c7[2], "g")), u6 = p2) : void 0 !== c7[3] && (u6 = p2) : u6 === p2 ? ">" === c7[0] ? (u6 = null != l11 ? l11 : f, v5 = -1) : void 0 === c7[1] ? v5 = -2 : (v5 = u6.lastIndex - c7[2].length, d5 = c7[1], u6 = void 0 === c7[3] ? p2 : '"' === c7[3] ? $ : g) : u6 === $ || u6 === g ? u6 = p2 : u6 === _ || u6 === m ? u6 = f : (u6 = p2, l11 = void 0);
      const x3 = u6 === p2 && t7[i11 + 1].startsWith("/>") ? " " : "";
      r8 += u6 === f ? s9 + h2 : v5 >= 0 ? (e13.push(d5), s9.slice(0, v5) + o5 + s9.slice(v5) + n5 + x3) : s9 + n5 + (-2 === v5 ? (e13.push(void 0), i11) : x3);
    }
    return [P(t7, r8 + (t7[s8] || "<?>") + (2 === i10 ? "</svg>" : "")), e13];
  };
  var N = class _N {
    constructor({ strings: t7, _$litType$: i10 }, e13) {
      let h7;
      this.parts = [];
      let r8 = 0, d5 = 0;
      const c7 = t7.length - 1, v5 = this.parts, [a7, f4] = V(t7, i10);
      if (this.el = _N.createElement(a7, e13), C.currentNode = this.el.content, 2 === i10) {
        const t8 = this.el.content, i11 = t8.firstChild;
        i11.remove(), t8.append(...i11.childNodes);
      }
      for (; null !== (h7 = C.nextNode()) && v5.length < c7; ) {
        if (1 === h7.nodeType) {
          if (h7.hasAttributes()) {
            const t8 = [];
            for (const i11 of h7.getAttributeNames()) if (i11.endsWith(o5) || i11.startsWith(n5)) {
              const s8 = f4[d5++];
              if (t8.push(i11), void 0 !== s8) {
                const t9 = h7.getAttribute(s8.toLowerCase() + o5).split(n5), i12 = /([.?@])?(.*)/.exec(s8);
                v5.push({ type: 1, index: r8, name: i12[2], strings: t9, ctor: "." === i12[1] ? H : "?" === i12[1] ? L : "@" === i12[1] ? z : R });
              } else v5.push({ type: 6, index: r8 });
            }
            for (const i11 of t8) h7.removeAttribute(i11);
          }
          if (y.test(h7.tagName)) {
            const t8 = h7.textContent.split(n5), i11 = t8.length - 1;
            if (i11 > 0) {
              h7.textContent = s2 ? s2.emptyScript : "";
              for (let s8 = 0; s8 < i11; s8++) h7.append(t8[s8], u2()), C.nextNode(), v5.push({ type: 2, index: ++r8 });
              h7.append(t8[i11], u2());
            }
          }
        } else if (8 === h7.nodeType) if (h7.data === l3) v5.push({ type: 2, index: r8 });
        else {
          let t8 = -1;
          for (; -1 !== (t8 = h7.data.indexOf(n5, t8 + 1)); ) v5.push({ type: 7, index: r8 }), t8 += n5.length - 1;
        }
        r8++;
      }
    }
    static createElement(t7, i10) {
      const s8 = r3.createElement("template");
      return s8.innerHTML = t7, s8;
    }
  };
  function S2(t7, i10, s8 = t7, e13) {
    var o11, n13, l11, h7;
    if (i10 === w) return i10;
    let r8 = void 0 !== e13 ? null === (o11 = s8._$Co) || void 0 === o11 ? void 0 : o11[e13] : s8._$Cl;
    const u6 = d2(i10) ? void 0 : i10._$litDirective$;
    return (null == r8 ? void 0 : r8.constructor) !== u6 && (null === (n13 = null == r8 ? void 0 : r8._$AO) || void 0 === n13 || n13.call(r8, false), void 0 === u6 ? r8 = void 0 : (r8 = new u6(t7), r8._$AT(t7, s8, e13)), void 0 !== e13 ? (null !== (l11 = (h7 = s8)._$Co) && void 0 !== l11 ? l11 : h7._$Co = [])[e13] = r8 : s8._$Cl = r8), void 0 !== r8 && (i10 = S2(t7, r8._$AS(t7, i10.values), r8, e13)), i10;
  }
  var M = class {
    constructor(t7, i10) {
      this._$AV = [], this._$AN = void 0, this._$AD = t7, this._$AM = i10;
    }
    get parentNode() {
      return this._$AM.parentNode;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    u(t7) {
      var i10;
      const { el: { content: s8 }, parts: e13 } = this._$AD, o11 = (null !== (i10 = null == t7 ? void 0 : t7.creationScope) && void 0 !== i10 ? i10 : r3).importNode(s8, true);
      C.currentNode = o11;
      let n13 = C.nextNode(), l11 = 0, h7 = 0, u6 = e13[0];
      for (; void 0 !== u6; ) {
        if (l11 === u6.index) {
          let i11;
          2 === u6.type ? i11 = new k(n13, n13.nextSibling, this, t7) : 1 === u6.type ? i11 = new u6.ctor(n13, u6.name, u6.strings, this, t7) : 6 === u6.type && (i11 = new W(n13, this, t7)), this._$AV.push(i11), u6 = e13[++h7];
        }
        l11 !== (null == u6 ? void 0 : u6.index) && (n13 = C.nextNode(), l11++);
      }
      return C.currentNode = r3, o11;
    }
    v(t7) {
      let i10 = 0;
      for (const s8 of this._$AV) void 0 !== s8 && (void 0 !== s8.strings ? (s8._$AI(t7, s8, i10), i10 += s8.strings.length - 2) : s8._$AI(t7[i10])), i10++;
    }
  };
  var k = class _k {
    constructor(t7, i10, s8, e13) {
      var o11;
      this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t7, this._$AB = i10, this._$AM = s8, this.options = e13, this._$Cp = null === (o11 = null == e13 ? void 0 : e13.isConnected) || void 0 === o11 || o11;
    }
    get _$AU() {
      var t7, i10;
      return null !== (i10 = null === (t7 = this._$AM) || void 0 === t7 ? void 0 : t7._$AU) && void 0 !== i10 ? i10 : this._$Cp;
    }
    get parentNode() {
      let t7 = this._$AA.parentNode;
      const i10 = this._$AM;
      return void 0 !== i10 && 11 === (null == t7 ? void 0 : t7.nodeType) && (t7 = i10.parentNode), t7;
    }
    get startNode() {
      return this._$AA;
    }
    get endNode() {
      return this._$AB;
    }
    _$AI(t7, i10 = this) {
      t7 = S2(this, t7, i10), d2(t7) ? t7 === A || null == t7 || "" === t7 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t7 !== this._$AH && t7 !== w && this._(t7) : void 0 !== t7._$litType$ ? this.g(t7) : void 0 !== t7.nodeType ? this.$(t7) : v2(t7) ? this.T(t7) : this._(t7);
    }
    k(t7) {
      return this._$AA.parentNode.insertBefore(t7, this._$AB);
    }
    $(t7) {
      this._$AH !== t7 && (this._$AR(), this._$AH = this.k(t7));
    }
    _(t7) {
      this._$AH !== A && d2(this._$AH) ? this._$AA.nextSibling.data = t7 : this.$(r3.createTextNode(t7)), this._$AH = t7;
    }
    g(t7) {
      var i10;
      const { values: s8, _$litType$: e13 } = t7, o11 = "number" == typeof e13 ? this._$AC(t7) : (void 0 === e13.el && (e13.el = N.createElement(P(e13.h, e13.h[0]), this.options)), e13);
      if ((null === (i10 = this._$AH) || void 0 === i10 ? void 0 : i10._$AD) === o11) this._$AH.v(s8);
      else {
        const t8 = new M(o11, this), i11 = t8.u(this.options);
        t8.v(s8), this.$(i11), this._$AH = t8;
      }
    }
    _$AC(t7) {
      let i10 = E.get(t7.strings);
      return void 0 === i10 && E.set(t7.strings, i10 = new N(t7)), i10;
    }
    T(t7) {
      c3(this._$AH) || (this._$AH = [], this._$AR());
      const i10 = this._$AH;
      let s8, e13 = 0;
      for (const o11 of t7) e13 === i10.length ? i10.push(s8 = new _k(this.k(u2()), this.k(u2()), this, this.options)) : s8 = i10[e13], s8._$AI(o11), e13++;
      e13 < i10.length && (this._$AR(s8 && s8._$AB.nextSibling, e13), i10.length = e13);
    }
    _$AR(t7 = this._$AA.nextSibling, i10) {
      var s8;
      for (null === (s8 = this._$AP) || void 0 === s8 || s8.call(this, false, true, i10); t7 && t7 !== this._$AB; ) {
        const i11 = t7.nextSibling;
        t7.remove(), t7 = i11;
      }
    }
    setConnected(t7) {
      var i10;
      void 0 === this._$AM && (this._$Cp = t7, null === (i10 = this._$AP) || void 0 === i10 || i10.call(this, t7));
    }
  };
  var R = class {
    constructor(t7, i10, s8, e13, o11) {
      this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t7, this.name = i10, this._$AM = e13, this.options = o11, s8.length > 2 || "" !== s8[0] || "" !== s8[1] ? (this._$AH = Array(s8.length - 1).fill(new String()), this.strings = s8) : this._$AH = A;
    }
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t7, i10 = this, s8, e13) {
      const o11 = this.strings;
      let n13 = false;
      if (void 0 === o11) t7 = S2(this, t7, i10, 0), n13 = !d2(t7) || t7 !== this._$AH && t7 !== w, n13 && (this._$AH = t7);
      else {
        const e14 = t7;
        let l11, h7;
        for (t7 = o11[0], l11 = 0; l11 < o11.length - 1; l11++) h7 = S2(this, e14[s8 + l11], i10, l11), h7 === w && (h7 = this._$AH[l11]), n13 || (n13 = !d2(h7) || h7 !== this._$AH[l11]), h7 === A ? t7 = A : t7 !== A && (t7 += (null != h7 ? h7 : "") + o11[l11 + 1]), this._$AH[l11] = h7;
      }
      n13 && !e13 && this.j(t7);
    }
    j(t7) {
      t7 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, null != t7 ? t7 : "");
    }
  };
  var H = class extends R {
    constructor() {
      super(...arguments), this.type = 3;
    }
    j(t7) {
      this.element[this.name] = t7 === A ? void 0 : t7;
    }
  };
  var I = s2 ? s2.emptyScript : "";
  var L = class extends R {
    constructor() {
      super(...arguments), this.type = 4;
    }
    j(t7) {
      t7 && t7 !== A ? this.element.setAttribute(this.name, I) : this.element.removeAttribute(this.name);
    }
  };
  var z = class extends R {
    constructor(t7, i10, s8, e13, o11) {
      super(t7, i10, s8, e13, o11), this.type = 5;
    }
    _$AI(t7, i10 = this) {
      var s8;
      if ((t7 = null !== (s8 = S2(this, t7, i10, 0)) && void 0 !== s8 ? s8 : A) === w) return;
      const e13 = this._$AH, o11 = t7 === A && e13 !== A || t7.capture !== e13.capture || t7.once !== e13.once || t7.passive !== e13.passive, n13 = t7 !== A && (e13 === A || o11);
      o11 && this.element.removeEventListener(this.name, this, e13), n13 && this.element.addEventListener(this.name, this, t7), this._$AH = t7;
    }
    handleEvent(t7) {
      var i10, s8;
      "function" == typeof this._$AH ? this._$AH.call(null !== (s8 = null === (i10 = this.options) || void 0 === i10 ? void 0 : i10.host) && void 0 !== s8 ? s8 : this.element, t7) : this._$AH.handleEvent(t7);
    }
  };
  var W = class {
    constructor(t7, i10, s8) {
      this.element = t7, this.type = 6, this._$AN = void 0, this._$AM = i10, this.options = s8;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t7) {
      S2(this, t7);
    }
  };
  var Z = { O: o5, P: n5, A: l3, C: 1, M: V, L: M, R: v2, D: S2, I: k, V: R, H: L, N: z, U: H, F: W };
  var j = i4.litHtmlPolyfillSupport;
  null == j || j(N, k), (null !== (t3 = i4.litHtmlVersions) && void 0 !== t3 ? t3 : i4.litHtmlVersions = []).push("2.8.0");
  var B = (t7, i10, s8) => {
    var e13, o11;
    const n13 = null !== (e13 = null == s8 ? void 0 : s8.renderBefore) && void 0 !== e13 ? e13 : i10;
    let l11 = n13._$litPart$;
    if (void 0 === l11) {
      const t8 = null !== (o11 = null == s8 ? void 0 : s8.renderBefore) && void 0 !== o11 ? o11 : null;
      n13._$litPart$ = l11 = new k(i10.insertBefore(u2(), t8), t8, void 0, null != s8 ? s8 : {});
    }
    return l11._$AI(t7), l11;
  };

  // ../node_modules/lit-element/lit-element.js
  var l4;
  var o6;
  var s3 = class extends p {
    constructor() {
      super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
    }
    createRenderRoot() {
      var t7, e13;
      const i10 = super.createRenderRoot();
      return null !== (t7 = (e13 = this.renderOptions).renderBefore) && void 0 !== t7 || (e13.renderBefore = i10.firstChild), i10;
    }
    update(t7) {
      const i10 = this.render();
      this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t7), this._$Do = B(i10, this.renderRoot, this.renderOptions);
    }
    connectedCallback() {
      var t7;
      super.connectedCallback(), null === (t7 = this._$Do) || void 0 === t7 || t7.setConnected(true);
    }
    disconnectedCallback() {
      var t7;
      super.disconnectedCallback(), null === (t7 = this._$Do) || void 0 === t7 || t7.setConnected(false);
    }
    render() {
      return w;
    }
  };
  s3.finalized = true, s3._$litElement$ = true, null === (l4 = globalThis.litElementHydrateSupport) || void 0 === l4 || l4.call(globalThis, { LitElement: s3 });
  var n6 = globalThis.litElementPolyfillSupport;
  null == n6 || n6({ LitElement: s3 });
  (null !== (o6 = globalThis.litElementVersions) && void 0 !== o6 ? o6 : globalThis.litElementVersions = []).push("3.3.2");

  // ../node_modules/lit-html/node/is-server.js
  var o7 = true;

  // ../elevation/internal/elevation.js
  var Elevation = class extends s3 {
    connectedCallback() {
      super.connectedCallback();
      this.setAttribute("aria-hidden", "true");
    }
    render() {
      return T`<span class="shadow"></span>`;
    }
  };

  // ../elevation/internal/elevation-styles.cssresult.js
  var styles = i3`:host,.shadow,.shadow::before,.shadow::after{border-radius:inherit;inset:0;position:absolute;transition-duration:inherit;transition-property:inherit;transition-timing-function:inherit}:host{display:flex;pointer-events:none;transition-property:box-shadow,opacity}.shadow::before,.shadow::after{content:"";transition-property:box-shadow,opacity;--_level: var(--md-elevation-level, 0);--_shadow-color: var(--md-elevation-shadow-color, var(--md-sys-color-shadow, #000))}.shadow::before{box-shadow:0px calc(1px*(clamp(0,var(--_level),1) + clamp(0,var(--_level) - 3,1) + 2*clamp(0,var(--_level) - 4,1))) calc(1px*(2*clamp(0,var(--_level),1) + clamp(0,var(--_level) - 2,1) + clamp(0,var(--_level) - 4,1))) 0px var(--_shadow-color);opacity:.3}.shadow::after{box-shadow:0px calc(1px*(clamp(0,var(--_level),1) + clamp(0,var(--_level) - 1,1) + 2*clamp(0,var(--_level) - 2,3))) calc(1px*(3*clamp(0,var(--_level),2) + 2*clamp(0,var(--_level) - 2,3))) calc(1px*(clamp(0,var(--_level),4) + 2*clamp(0,var(--_level) - 4,1))) var(--_shadow-color);opacity:.15}
`;
  var elevation_styles_cssresult_default = styles.styleSheet;

  // ../elevation/elevation.js
  var MdElevation = class MdElevation2 extends Elevation {
  };
  MdElevation.styles = [styles];
  MdElevation = __decorate([
    e("md-elevation")
  ], MdElevation);

  // ../internal/controller/attachable-controller.js
  var ATTACHABLE_CONTROLLER = /* @__PURE__ */ Symbol("attachableController");
  var FOR_ATTRIBUTE_OBSERVER;
  if (!o7) {
    FOR_ATTRIBUTE_OBSERVER = new MutationObserver((records) => {
      for (const record of records) {
        record.target[ATTACHABLE_CONTROLLER]?.hostConnected();
      }
    });
  }
  var AttachableController = class {
    get htmlFor() {
      return this.host.getAttribute("for");
    }
    set htmlFor(htmlFor) {
      if (htmlFor === null) {
        this.host.removeAttribute("for");
      } else {
        this.host.setAttribute("for", htmlFor);
      }
    }
    get control() {
      if (this.host.hasAttribute("for")) {
        if (!this.htmlFor || !this.host.isConnected) {
          return null;
        }
        return this.host.getRootNode().querySelector(`#${this.htmlFor}`);
      }
      return this.currentControl || this.host.parentElement;
    }
    set control(control) {
      if (control) {
        this.attach(control);
      } else {
        this.detach();
      }
    }
    /**
     * Creates a new controller for an `Attachable` element.
     *
     * @param host The `Attachable` element.
     * @param onControlChange A callback with two parameters for the previous and
     *     next control. An `Attachable` element may perform setup or teardown
     *     logic whenever the control changes.
     */
    constructor(host, onControlChange) {
      this.host = host;
      this.onControlChange = onControlChange;
      this.currentControl = null;
      host.addController(this);
      host[ATTACHABLE_CONTROLLER] = this;
      FOR_ATTRIBUTE_OBSERVER?.observe(host, { attributeFilter: ["for"] });
    }
    attach(control) {
      if (control === this.currentControl) {
        return;
      }
      this.setCurrentControl(control);
      this.host.removeAttribute("for");
    }
    detach() {
      this.setCurrentControl(null);
      this.host.setAttribute("for", "");
    }
    /** @private */
    hostConnected() {
      this.setCurrentControl(this.control);
    }
    /** @private */
    hostDisconnected() {
      this.setCurrentControl(null);
    }
    setCurrentControl(control) {
      this.onControlChange(this.currentControl, control);
      this.currentControl = control;
    }
  };

  // ../focus/internal/focus-ring.js
  var EVENTS = ["focusin", "focusout", "pointerdown"];
  var FocusRing = class extends s3 {
    constructor() {
      super(...arguments);
      this.visible = false;
      this.inward = false;
      this.attachableController = new AttachableController(this, this.onControlChange.bind(this));
    }
    get htmlFor() {
      return this.attachableController.htmlFor;
    }
    set htmlFor(htmlFor) {
      this.attachableController.htmlFor = htmlFor;
    }
    get control() {
      return this.attachableController.control;
    }
    set control(control) {
      this.attachableController.control = control;
    }
    attach(control) {
      this.attachableController.attach(control);
    }
    detach() {
      this.attachableController.detach();
    }
    connectedCallback() {
      super.connectedCallback();
      this.setAttribute("aria-hidden", "true");
    }
    /** @private */
    handleEvent(event) {
      if (event[HANDLED_BY_FOCUS_RING]) {
        return;
      }
      switch (event.type) {
        default:
          return;
        case "focusin":
          this.visible = this.control?.matches(":focus-visible") ?? false;
          break;
        case "focusout":
        case "pointerdown":
          this.visible = false;
          break;
      }
      event[HANDLED_BY_FOCUS_RING] = true;
    }
    onControlChange(prev, next) {
      if (o7)
        return;
      for (const event of EVENTS) {
        prev?.removeEventListener(event, this);
        next?.addEventListener(event, this);
      }
    }
    update(changed) {
      if (changed.has("visible")) {
        this.dispatchEvent(new Event("visibility-changed"));
      }
      super.update(changed);
    }
  };
  __decorate([
    n({ type: Boolean, reflect: true })
  ], FocusRing.prototype, "visible", void 0);
  __decorate([
    n({ type: Boolean, reflect: true })
  ], FocusRing.prototype, "inward", void 0);
  var HANDLED_BY_FOCUS_RING = /* @__PURE__ */ Symbol("handledByFocusRing");

  // ../focus/internal/focus-ring-styles.cssresult.js
  var styles2 = i3`:host{animation-delay:0s,calc(var(--md-focus-ring-duration, 600ms)*.25);animation-duration:calc(var(--md-focus-ring-duration, 600ms)*.25),calc(var(--md-focus-ring-duration, 600ms)*.75);animation-timing-function:cubic-bezier(0.2, 0, 0, 1);box-sizing:border-box;color:var(--md-focus-ring-color, var(--md-sys-color-secondary, #625b71));display:none;pointer-events:none;position:absolute}:host([visible]){display:flex}:host(:not([inward])){animation-name:outward-grow,outward-shrink;border-end-end-radius:calc(var(--md-focus-ring-shape-end-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-end-start-radius:calc(var(--md-focus-ring-shape-end-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-start-end-radius:calc(var(--md-focus-ring-shape-start-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-start-start-radius:calc(var(--md-focus-ring-shape-start-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));inset:calc(-1*var(--md-focus-ring-outward-offset, 2px));outline:var(--md-focus-ring-width, 3px) solid currentColor}:host([inward]){animation-name:inward-grow,inward-shrink;border-end-end-radius:calc(var(--md-focus-ring-shape-end-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-end-start-radius:calc(var(--md-focus-ring-shape-end-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-start-end-radius:calc(var(--md-focus-ring-shape-start-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-start-start-radius:calc(var(--md-focus-ring-shape-start-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border:var(--md-focus-ring-width, 3px) solid currentColor;inset:var(--md-focus-ring-inward-offset, 0px)}@keyframes outward-grow{from{outline-width:0}to{outline-width:var(--md-focus-ring-active-width, 8px)}}@keyframes outward-shrink{from{outline-width:var(--md-focus-ring-active-width, 8px)}}@keyframes inward-grow{from{border-width:0}to{border-width:var(--md-focus-ring-active-width, 8px)}}@keyframes inward-shrink{from{border-width:var(--md-focus-ring-active-width, 8px)}}@media(prefers-reduced-motion){:host{animation:none}}
`;
  var focus_ring_styles_cssresult_default = styles2.styleSheet;

  // ../focus/md-focus-ring.js
  var MdFocusRing = class MdFocusRing2 extends FocusRing {
  };
  MdFocusRing.styles = [styles2];
  MdFocusRing = __decorate([
    e("md-focus-ring")
  ], MdFocusRing);

  // ../node_modules/lit-html/node/directive.js
  var t4 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
  var e8 = (t7) => (...e13) => ({ _$litDirective$: t7, values: e13 });
  var i5 = class {
    constructor(t7) {
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AT(t7, e13, i10) {
      this._$Ct = t7, this._$AM = e13, this._$Ci = i10;
    }
    _$AS(t7, e13) {
      return this.update(t7, e13);
    }
    update(t7, e13) {
      return this.render(...e13);
    }
  };

  // ../node_modules/lit-html/node/directives/class-map.js
  var o8 = e8(class extends i5 {
    constructor(t7) {
      var i10;
      if (super(t7), t7.type !== t4.ATTRIBUTE || "class" !== t7.name || (null === (i10 = t7.strings) || void 0 === i10 ? void 0 : i10.length) > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
    }
    render(t7) {
      return " " + Object.keys(t7).filter(((i10) => t7[i10])).join(" ") + " ";
    }
    update(i10, [s8]) {
      var r8, o11;
      if (void 0 === this.it) {
        this.it = /* @__PURE__ */ new Set(), void 0 !== i10.strings && (this.nt = new Set(i10.strings.join(" ").split(/\s/).filter(((t7) => "" !== t7))));
        for (const t7 in s8) s8[t7] && !(null === (r8 = this.nt) || void 0 === r8 ? void 0 : r8.has(t7)) && this.it.add(t7);
        return this.render(s8);
      }
      const e13 = i10.element.classList;
      this.it.forEach(((t7) => {
        t7 in s8 || (e13.remove(t7), this.it.delete(t7));
      }));
      for (const t7 in s8) {
        const i11 = !!s8[t7];
        i11 === this.it.has(t7) || (null === (o11 = this.nt) || void 0 === o11 ? void 0 : o11.has(t7)) || (i11 ? (e13.add(t7), this.it.add(t7)) : (e13.remove(t7), this.it.delete(t7)));
      }
      return w;
    }
  });

  // ../internal/motion/animation.js
  var EASING = {
    STANDARD: "cubic-bezier(0.2, 0, 0, 1)",
    STANDARD_ACCELERATE: "cubic-bezier(.3,0,1,1)",
    STANDARD_DECELERATE: "cubic-bezier(0,0,0,1)",
    EMPHASIZED: "cubic-bezier(.3,0,0,1)",
    EMPHASIZED_ACCELERATE: "cubic-bezier(.3,0,.8,.15)",
    EMPHASIZED_DECELERATE: "cubic-bezier(.05,.7,.1,1)"
  };
  function createAnimationSignal() {
    let animationAbortController = null;
    return {
      start() {
        animationAbortController?.abort();
        animationAbortController = new AbortController();
        return animationAbortController.signal;
      },
      finish() {
        animationAbortController = null;
      }
    };
  }

  // ../ripple/internal/ripple.js
  var PRESS_GROW_MS = 450;
  var MINIMUM_PRESS_MS = 225;
  var INITIAL_ORIGIN_SCALE = 0.2;
  var PADDING = 10;
  var SOFT_EDGE_MINIMUM_SIZE = 75;
  var SOFT_EDGE_CONTAINER_RATIO = 0.35;
  var PRESS_PSEUDO = "::after";
  var ANIMATION_FILL = "forwards";
  var State;
  (function(State2) {
    State2[State2["INACTIVE"] = 0] = "INACTIVE";
    State2[State2["TOUCH_DELAY"] = 1] = "TOUCH_DELAY";
    State2[State2["HOLDING"] = 2] = "HOLDING";
    State2[State2["WAITING_FOR_CLICK"] = 3] = "WAITING_FOR_CLICK";
  })(State || (State = {}));
  var EVENTS2 = [
    "click",
    "contextmenu",
    "pointercancel",
    "pointerdown",
    "pointerenter",
    "pointerleave",
    "pointerup"
  ];
  var TOUCH_DELAY_MS = 150;
  var FORCED_COLORS = o7 ? null : window.matchMedia("(forced-colors: active)");
  var Ripple = class extends s3 {
    constructor() {
      super(...arguments);
      this.disabled = false;
      this.hovered = false;
      this.pressed = false;
      this.rippleSize = "";
      this.rippleScale = "";
      this.initialSize = 0;
      this.state = State.INACTIVE;
      this.attachableController = new AttachableController(this, this.onControlChange.bind(this));
    }
    get htmlFor() {
      return this.attachableController.htmlFor;
    }
    set htmlFor(htmlFor) {
      this.attachableController.htmlFor = htmlFor;
    }
    get control() {
      return this.attachableController.control;
    }
    set control(control) {
      this.attachableController.control = control;
    }
    attach(control) {
      this.attachableController.attach(control);
    }
    detach() {
      this.attachableController.detach();
    }
    connectedCallback() {
      super.connectedCallback();
      this.setAttribute("aria-hidden", "true");
    }
    render() {
      const classes = {
        "hovered": this.hovered,
        "pressed": this.pressed
      };
      return T`<div class="surface ${o8(classes)}"></div>`;
    }
    update(changedProps) {
      if (changedProps.has("disabled") && this.disabled) {
        this.hovered = false;
        this.pressed = false;
      }
      super.update(changedProps);
    }
    /**
     * TODO(b/269799771): make private
     * @private only public for slider
     */
    handlePointerenter(event) {
      if (!this.shouldReactToEvent(event)) {
        return;
      }
      this.hovered = true;
    }
    /**
     * TODO(b/269799771): make private
     * @private only public for slider
     */
    handlePointerleave(event) {
      if (!this.shouldReactToEvent(event)) {
        return;
      }
      this.hovered = false;
      if (this.state !== State.INACTIVE) {
        this.endPressAnimation();
      }
    }
    handlePointerup(event) {
      if (!this.shouldReactToEvent(event)) {
        return;
      }
      if (this.state === State.HOLDING) {
        this.state = State.WAITING_FOR_CLICK;
        return;
      }
      if (this.state === State.TOUCH_DELAY) {
        this.state = State.WAITING_FOR_CLICK;
        this.startPressAnimation(this.rippleStartEvent);
        return;
      }
    }
    async handlePointerdown(event) {
      if (!this.shouldReactToEvent(event)) {
        return;
      }
      this.rippleStartEvent = event;
      if (!this.isTouch(event)) {
        this.state = State.WAITING_FOR_CLICK;
        this.startPressAnimation(event);
        return;
      }
      this.state = State.TOUCH_DELAY;
      await new Promise((resolve) => {
        setTimeout(resolve, TOUCH_DELAY_MS);
      });
      if (this.state !== State.TOUCH_DELAY) {
        return;
      }
      this.state = State.HOLDING;
      this.startPressAnimation(event);
    }
    handleClick() {
      if (this.disabled) {
        return;
      }
      if (this.state === State.WAITING_FOR_CLICK) {
        this.endPressAnimation();
        return;
      }
      if (this.state === State.INACTIVE) {
        this.startPressAnimation();
        this.endPressAnimation();
      }
    }
    handlePointercancel(event) {
      if (!this.shouldReactToEvent(event)) {
        return;
      }
      this.endPressAnimation();
    }
    handleContextmenu() {
      if (this.disabled) {
        return;
      }
      this.endPressAnimation();
    }
    determineRippleSize() {
      const { height, width } = this.getBoundingClientRect();
      const maxDim = Math.max(height, width);
      const softEdgeSize = Math.max(SOFT_EDGE_CONTAINER_RATIO * maxDim, SOFT_EDGE_MINIMUM_SIZE);
      const zoom = this.currentCSSZoom ?? 1;
      const initialSize = Math.floor(maxDim * INITIAL_ORIGIN_SCALE / zoom);
      const hypotenuse = Math.sqrt(width ** 2 + height ** 2);
      const maxRadius = hypotenuse + PADDING;
      this.initialSize = initialSize;
      const maybeZoomedScale = (maxRadius + softEdgeSize) / initialSize;
      this.rippleScale = `${maybeZoomedScale / zoom}`;
      this.rippleSize = `${initialSize}px`;
    }
    getNormalizedPointerEventCoords(pointerEvent) {
      const { scrollX, scrollY } = window;
      const { left, top } = this.getBoundingClientRect();
      const documentX = scrollX + left;
      const documentY = scrollY + top;
      const { pageX, pageY } = pointerEvent;
      const zoom = this.currentCSSZoom ?? 1;
      return {
        x: (pageX - documentX) / zoom,
        y: (pageY - documentY) / zoom
      };
    }
    getTranslationCoordinates(positionEvent) {
      const { height, width } = this.getBoundingClientRect();
      const zoom = this.currentCSSZoom ?? 1;
      const endPoint = {
        x: (width / zoom - this.initialSize) / 2,
        y: (height / zoom - this.initialSize) / 2
      };
      let startPoint;
      if (positionEvent instanceof PointerEvent) {
        startPoint = this.getNormalizedPointerEventCoords(positionEvent);
      } else {
        startPoint = {
          x: width / zoom / 2,
          y: height / zoom / 2
        };
      }
      startPoint = {
        x: startPoint.x - this.initialSize / 2,
        y: startPoint.y - this.initialSize / 2
      };
      return { startPoint, endPoint };
    }
    startPressAnimation(positionEvent) {
      if (!this.mdRoot) {
        return;
      }
      this.pressed = true;
      this.growAnimation?.cancel();
      this.determineRippleSize();
      const { startPoint, endPoint } = this.getTranslationCoordinates(positionEvent);
      const translateStart = `${startPoint.x}px, ${startPoint.y}px`;
      const translateEnd = `${endPoint.x}px, ${endPoint.y}px`;
      this.growAnimation = this.mdRoot.animate({
        top: [0, 0],
        left: [0, 0],
        height: [this.rippleSize, this.rippleSize],
        width: [this.rippleSize, this.rippleSize],
        transform: [
          `translate(${translateStart}) scale(1)`,
          `translate(${translateEnd}) scale(${this.rippleScale})`
        ]
      }, {
        pseudoElement: PRESS_PSEUDO,
        duration: PRESS_GROW_MS,
        easing: EASING.STANDARD,
        fill: ANIMATION_FILL
      });
    }
    async endPressAnimation() {
      this.rippleStartEvent = void 0;
      this.state = State.INACTIVE;
      const animation = this.growAnimation;
      let pressAnimationPlayState = Infinity;
      if (typeof animation?.currentTime === "number") {
        pressAnimationPlayState = animation.currentTime;
      } else if (animation?.currentTime) {
        pressAnimationPlayState = animation.currentTime.to("ms").value;
      }
      if (pressAnimationPlayState >= MINIMUM_PRESS_MS) {
        this.pressed = false;
        return;
      }
      await new Promise((resolve) => {
        setTimeout(resolve, MINIMUM_PRESS_MS - pressAnimationPlayState);
      });
      if (this.growAnimation !== animation) {
        return;
      }
      this.pressed = false;
    }
    /**
     * Returns `true` if
     *  - the ripple element is enabled
     *  - the pointer is primary for the input type
     *  - the pointer is the pointer that started the interaction, or will start
     * the interaction
     *  - the pointer is a touch, or the pointer state has the primary button
     * held, or the pointer is hovering
     */
    shouldReactToEvent(event) {
      if (this.disabled || !event.isPrimary) {
        return false;
      }
      if (this.rippleStartEvent && this.rippleStartEvent.pointerId !== event.pointerId) {
        return false;
      }
      if (event.type === "pointerenter" || event.type === "pointerleave") {
        return !this.isTouch(event);
      }
      const isPrimaryButton = event.buttons === 1;
      return this.isTouch(event) || isPrimaryButton;
    }
    isTouch({ pointerType }) {
      return pointerType === "touch";
    }
    /** @private */
    async handleEvent(event) {
      if (FORCED_COLORS?.matches) {
        return;
      }
      switch (event.type) {
        case "click":
          this.handleClick();
          break;
        case "contextmenu":
          this.handleContextmenu();
          break;
        case "pointercancel":
          this.handlePointercancel(event);
          break;
        case "pointerdown":
          await this.handlePointerdown(event);
          break;
        case "pointerenter":
          this.handlePointerenter(event);
          break;
        case "pointerleave":
          this.handlePointerleave(event);
          break;
        case "pointerup":
          this.handlePointerup(event);
          break;
        default:
          break;
      }
    }
    onControlChange(prev, next) {
      if (o7)
        return;
      for (const event of EVENTS2) {
        prev?.removeEventListener(event, this);
        next?.addEventListener(event, this);
      }
    }
  };
  __decorate([
    n({ type: Boolean, reflect: true })
  ], Ripple.prototype, "disabled", void 0);
  __decorate([
    t()
  ], Ripple.prototype, "hovered", void 0);
  __decorate([
    t()
  ], Ripple.prototype, "pressed", void 0);
  __decorate([
    i2(".surface")
  ], Ripple.prototype, "mdRoot", void 0);

  // ../ripple/internal/ripple-styles.cssresult.js
  var styles3 = i3`:host{display:flex;margin:auto;pointer-events:none}:host([disabled]){display:none}@media(forced-colors: active){:host{display:none}}:host,.surface{border-radius:inherit;position:absolute;inset:0;overflow:hidden}.surface{-webkit-tap-highlight-color:rgba(0,0,0,0)}.surface::before,.surface::after{content:"";opacity:0;position:absolute}.surface::before{background-color:var(--md-ripple-hover-color, var(--md-sys-color-on-surface, #1d1b20));inset:0;transition:opacity 15ms linear,background-color 15ms linear}.surface::after{background:radial-gradient(closest-side, var(--md-ripple-pressed-color, var(--md-sys-color-on-surface, #1d1b20)) max(100% - 70px, 65%), transparent 100%);transform-origin:center center;transition:opacity 375ms linear}.hovered::before{background-color:var(--md-ripple-hover-color, var(--md-sys-color-on-surface, #1d1b20));opacity:var(--md-ripple-hover-opacity, 0.08)}.pressed::after{opacity:var(--md-ripple-pressed-opacity, 0.12);transition-duration:105ms}
`;
  var ripple_styles_cssresult_default = styles3.styleSheet;

  // ../ripple/ripple.js
  var MdRipple = class MdRipple2 extends Ripple {
  };
  MdRipple.styles = [styles3];
  MdRipple = __decorate([
    e("md-ripple")
  ], MdRipple);

  // ../internal/aria/aria.js
  var ARIA_PROPERTIES = [
    "role",
    "ariaAtomic",
    "ariaAutoComplete",
    "ariaBusy",
    "ariaChecked",
    "ariaColCount",
    "ariaColIndex",
    "ariaColSpan",
    "ariaCurrent",
    "ariaDisabled",
    "ariaExpanded",
    "ariaHasPopup",
    "ariaHidden",
    "ariaInvalid",
    "ariaKeyShortcuts",
    "ariaLabel",
    "ariaLevel",
    "ariaLive",
    "ariaModal",
    "ariaMultiLine",
    "ariaMultiSelectable",
    "ariaOrientation",
    "ariaPlaceholder",
    "ariaPosInSet",
    "ariaPressed",
    "ariaReadOnly",
    "ariaRequired",
    "ariaRoleDescription",
    "ariaRowCount",
    "ariaRowIndex",
    "ariaRowSpan",
    "ariaSelected",
    "ariaSetSize",
    "ariaSort",
    "ariaValueMax",
    "ariaValueMin",
    "ariaValueNow",
    "ariaValueText"
  ];
  var ARIA_ATTRIBUTES = ARIA_PROPERTIES.map(ariaPropertyToAttribute);
  function isAriaAttribute(attribute) {
    return ARIA_ATTRIBUTES.includes(attribute);
  }
  function ariaPropertyToAttribute(property) {
    return property.replace("aria", "aria-").replace(/Elements?/g, "").toLowerCase();
  }

  // ../internal/aria/delegate.js
  var privateIgnoreAttributeChangesFor = /* @__PURE__ */ Symbol("privateIgnoreAttributeChangesFor");
  function mixinDelegatesAria(base) {
    var _a3;
    if (o7) {
      return base;
    }
    class WithDelegatesAriaElement extends base {
      constructor() {
        super(...arguments);
        this[_a3] = /* @__PURE__ */ new Set();
      }
      attributeChangedCallback(name, oldValue, newValue) {
        if (!isAriaAttribute(name)) {
          super.attributeChangedCallback(name, oldValue, newValue);
          return;
        }
        if (this[privateIgnoreAttributeChangesFor].has(name)) {
          return;
        }
        this[privateIgnoreAttributeChangesFor].add(name);
        this.removeAttribute(name);
        this[privateIgnoreAttributeChangesFor].delete(name);
        const dataProperty = ariaAttributeToDataProperty(name);
        if (newValue === null) {
          delete this.dataset[dataProperty];
        } else {
          this.dataset[dataProperty] = newValue;
        }
        this.requestUpdate(ariaAttributeToDataProperty(name), oldValue);
      }
      getAttribute(name) {
        if (isAriaAttribute(name)) {
          return super.getAttribute(ariaAttributeToDataAttribute(name));
        }
        return super.getAttribute(name);
      }
      removeAttribute(name) {
        super.removeAttribute(name);
        if (isAriaAttribute(name)) {
          super.removeAttribute(ariaAttributeToDataAttribute(name));
          this.requestUpdate();
        }
      }
    }
    _a3 = privateIgnoreAttributeChangesFor;
    setupDelegatesAriaProperties(WithDelegatesAriaElement);
    return WithDelegatesAriaElement;
  }
  function setupDelegatesAriaProperties(ctor) {
    for (const ariaProperty of ARIA_PROPERTIES) {
      const ariaAttribute = ariaPropertyToAttribute(ariaProperty);
      const dataAttribute = ariaAttributeToDataAttribute(ariaAttribute);
      const dataProperty = ariaAttributeToDataProperty(ariaAttribute);
      ctor.createProperty(ariaProperty, {
        attribute: ariaAttribute,
        noAccessor: true
      });
      ctor.createProperty(Symbol(dataAttribute), {
        attribute: dataAttribute,
        noAccessor: true
      });
      Object.defineProperty(ctor.prototype, ariaProperty, {
        configurable: true,
        enumerable: true,
        get() {
          return this.dataset[dataProperty] ?? null;
        },
        set(value) {
          const prevValue = this.dataset[dataProperty] ?? null;
          if (value === prevValue) {
            return;
          }
          if (value === null) {
            delete this.dataset[dataProperty];
          } else {
            this.dataset[dataProperty] = value;
          }
          this.requestUpdate(ariaProperty, prevValue);
        }
      });
    }
  }
  function ariaAttributeToDataAttribute(ariaAttribute) {
    return `data-${ariaAttribute}`;
  }
  function ariaAttributeToDataProperty(ariaAttribute) {
    return ariaAttribute.replace(/-\w/, (dashLetter) => dashLetter[1].toUpperCase());
  }

  // ../node_modules/safevalues/dist/mjs/builders/url_builders.js
  var IS_NOT_JAVASCRIPT_URL_PATTERN = /^\s*(?!javascript:)(?:[\w+.-]+:|[^:/?#]*(?:[/?#]|$))/i;
  function reportJavaScriptUrl(url) {
    const hasJavascriptUrlScheme = !IS_NOT_JAVASCRIPT_URL_PATTERN.test(url);
    if (hasJavascriptUrlScheme) {
      if (true) {
        console.error(`A URL with content '${url}' was sanitized away.`);
      }
    }
    return hasJavascriptUrlScheme;
  }
  function sanitizeJavaScriptUrl(url) {
    if (reportJavaScriptUrl(url)) {
      return void 0;
    }
    return url;
  }
  function unwrapUrlOrSanitize(url) {
    return sanitizeJavaScriptUrl(url);
  }

  // ../node_modules/safevalues/dist/mjs/dom/elements/anchor.js
  function setAnchorHref(anchor, url) {
    const sanitizedUrl = unwrapUrlOrSanitize(url);
    if (sanitizedUrl !== void 0) {
      anchor.href = sanitizedUrl;
    }
  }

  // ../node_modules/safevalues/dist/mjs/internals/trusted_types.js
  var trustedTypes = globalThis.trustedTypes;

  // ../internal/directives/safe-href.js
  var SafeHrefDirective = class extends i5 {
    constructor(partInfo) {
      super(partInfo);
      if (partInfo.type !== t4.ATTRIBUTE && partInfo.type !== t4.PROPERTY) {
        throw new Error("safeHref can only be used on attribute or property bindings");
      }
      if (partInfo.name !== "href") {
        throw new Error('safeHref() directive can only be used on "href" attribute or property bindings.');
      }
    }
    render(value) {
      return value || A;
    }
    update(part, [value]) {
      const element = part.element;
      element.removeAttribute("href");
      if (!value || value === A) {
        return A;
      }
      setAnchorHref(element, value);
      return w;
    }
  };
  var safeHref = e8(SafeHrefDirective);

  // ../internal/events/form-label-activation.js
  function dispatchActivationClick(element) {
    const event = new MouseEvent("click", { bubbles: true });
    element.dispatchEvent(event);
    return event;
  }
  function isActivationClick(event) {
    if (event.currentTarget !== event.target) {
      return false;
    }
    if (event.composedPath()[0] !== event.target) {
      return false;
    }
    if (event.target.disabled) {
      return false;
    }
    return !squelchEvent(event);
  }
  function squelchEvent(event) {
    const squelched = isSquelchingEvents;
    if (squelched) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    squelchEventsForMicrotask();
    return squelched;
  }
  var isSquelchingEvents = false;
  async function squelchEventsForMicrotask() {
    isSquelchingEvents = true;
    await null;
    isSquelchingEvents = false;
  }

  // ../labs/behaviors/element-internals.js
  var internals = /* @__PURE__ */ Symbol("internals");
  var privateInternals = /* @__PURE__ */ Symbol("privateInternals");
  function mixinElementInternals(base) {
    class WithElementInternalsElement extends base {
      get [internals]() {
        if (!this[privateInternals]) {
          this[privateInternals] = this.attachInternals();
        }
        return this[privateInternals];
      }
    }
    return WithElementInternalsElement;
  }

  // ../labs/behaviors/form-associated.js
  var getFormValue = /* @__PURE__ */ Symbol("getFormValue");
  var getFormState = /* @__PURE__ */ Symbol("getFormState");
  function mixinFormAssociated(base) {
    class FormAssociatedElement extends base {
      get form() {
        return this[internals].form;
      }
      get labels() {
        return this[internals].labels;
      }
      // Use @property for the `name` and `disabled` properties to add them to the
      // `observedAttributes` array and trigger `attributeChangedCallback()`.
      //
      // We don't use Lit's default getter/setter (`noAccessor: true`) because
      // the attributes need to be updated synchronously to work with synchronous
      // form APIs, and Lit updates attributes async by default.
      get name() {
        return this.getAttribute("name") ?? "";
      }
      set name(name) {
        this.setAttribute("name", name);
      }
      get disabled() {
        return this.hasAttribute("disabled");
      }
      set disabled(disabled) {
        this.toggleAttribute("disabled", Boolean(disabled));
      }
      attributeChangedCallback(name, old, value) {
        if (name === "name" || name === "disabled") {
          const oldValue = name === "disabled" ? old !== null : old;
          this.requestUpdate(name, oldValue);
          return;
        }
        super.attributeChangedCallback(name, old, value);
      }
      requestUpdate(name, oldValue, options) {
        super.requestUpdate(name, oldValue, options);
        this[internals].setFormValue(this[getFormValue](), this[getFormState]());
      }
      [getFormValue]() {
        return this.getAttribute("value");
      }
      [getFormState]() {
        return this[getFormValue]();
      }
      formDisabledCallback(disabled) {
        this.disabled = disabled;
      }
    }
    FormAssociatedElement.formAssociated = true;
    __decorate([
      n({ noAccessor: true })
    ], FormAssociatedElement.prototype, "name", null);
    __decorate([
      n({ type: Boolean, noAccessor: true })
    ], FormAssociatedElement.prototype, "disabled", null);
    return FormAssociatedElement;
  }

  // ../internal/events/dispatch-hooks.js
  var dispatchHooks = /* @__PURE__ */ Symbol("dispatchHooks");
  function afterDispatch(event, callback) {
    const hooks = event[dispatchHooks];
    if (!hooks) {
      throw new Error(`'${event.type}' event needs setupDispatchHooks().`);
    }
    hooks.addEventListener("after", callback, { once: true });
  }
  var ELEMENT_DISPATCH_HOOK_TYPES = /* @__PURE__ */ new WeakMap();
  function setupDispatchHooks(element, ...eventTypes) {
    let typesAlreadySetUp = ELEMENT_DISPATCH_HOOK_TYPES.get(element);
    if (!typesAlreadySetUp) {
      typesAlreadySetUp = /* @__PURE__ */ new Set();
      ELEMENT_DISPATCH_HOOK_TYPES.set(element, typesAlreadySetUp);
    }
    for (const eventType of eventTypes) {
      if (typesAlreadySetUp.has(eventType)) {
        continue;
      }
      element.addEventListener(eventType, (event) => {
        const hooks = new EventTarget();
        event[dispatchHooks] = hooks;
        const cleanupLastNodeListener = new AbortController();
        const callAfterDispatch = () => {
          cleanupLastNodeListener.abort();
          hooks.dispatchEvent(new Event("after"));
        };
        const patchStopPropagation = (superMethod) => {
          return function() {
            superMethod.call(this);
            callAfterDispatch();
          };
        };
        event.stopPropagation = patchStopPropagation(event.stopPropagation);
        event.stopImmediatePropagation = patchStopPropagation(event.stopImmediatePropagation);
        const composedPath = event.composedPath();
        let lastNodeForEvent;
        if (event.composed && event.bubbles) {
          lastNodeForEvent = composedPath[composedPath.length - 1];
        } else if (!event.bubbles) {
          lastNodeForEvent = composedPath[0];
        } else {
          lastNodeForEvent = composedPath[0].getRootNode();
        }
        lastNodeForEvent.addEventListener(eventType, () => {
          callAfterDispatch();
        }, { once: true, signal: cleanupLastNodeListener.signal });
      }, {
        // Ensure this listener runs before other listeners.
        // `setupDispatchHooks()` should be called in constructors to also
        // ensure they run before any other externally-added capture listeners.
        capture: true
      });
      typesAlreadySetUp.add(eventType);
    }
  }

  // ../labs/behaviors/form-submitter.js
  function mixinFormSubmitter(base) {
    class FormSubmitterElement extends base {
      // Name attribute must reflect synchronously for form integration.
      get name() {
        return this.getAttribute("name") ?? "";
      }
      set name(name) {
        this.setAttribute("name", name);
      }
      // Mixins must have a constructor with `...args: any[]`
      // tslint:disable-next-line:no-any
      constructor(...args) {
        super(...args);
        this.type = "submit";
        this.value = "";
        if (o7)
          return;
        setupDispatchHooks(this, "click");
        this.addEventListener("click", async (event) => {
          const isReset = this.type === "reset";
          const isSubmit = this.type === "submit";
          const elementInternals = this[internals];
          const { form } = elementInternals;
          if (!form || !(isSubmit || isReset)) {
            return;
          }
          afterDispatch(event, () => {
            if (event.defaultPrevented) {
              return;
            }
            if (isReset) {
              form.reset();
              return;
            }
            form.addEventListener("submit", (submitEvent) => {
              Object.defineProperty(submitEvent, "submitter", {
                configurable: true,
                enumerable: true,
                get: () => this
              });
            }, { capture: true, once: true });
            elementInternals.setFormValue(this.value);
            form.requestSubmit();
          });
        });
      }
    }
    __decorate([
      n()
    ], FormSubmitterElement.prototype, "type", void 0);
    __decorate([
      n({ reflect: true })
    ], FormSubmitterElement.prototype, "value", void 0);
    return FormSubmitterElement;
  }

  // ../button/internal/button.js
  var buttonBaseClass = mixinDelegatesAria(mixinFormSubmitter(mixinFormAssociated(mixinElementInternals(s3))));
  var Button = class extends buttonBaseClass {
    constructor() {
      super();
      this.softDisabled = false;
      this.href = "";
      this.download = "";
      this.target = "";
      this.rel = "";
      this.referrerPolicy = "";
      this.trailingIcon = false;
      this.hasIcon = false;
      if (!o7) {
        this.addEventListener("click", this.handleClick.bind(this), {
          capture: true
        });
      }
    }
    focus() {
      this.buttonElement?.focus();
    }
    blur() {
      this.buttonElement?.blur();
    }
    render() {
      const isRippleDisabled = this.disabled || this.softDisabled;
      const buttonOrLink = this.href ? this.renderLink() : this.renderButton();
      const buttonId = this.href ? "link" : "button";
      return T`
      ${this.renderElevationOrOutline?.()}
      <div class="background"></div>
      <md-focus-ring part="focus-ring" for=${buttonId}></md-focus-ring>
      <md-ripple
        part="ripple"
        for=${buttonId}
        ?disabled="${isRippleDisabled}"></md-ripple>
      ${buttonOrLink}
    `;
    }
    renderButton() {
      const { ariaLabel, ariaHasPopup, ariaExpanded } = this;
      return T`<button
      id="button"
      class="button"
      ?disabled=${this.disabled}
      aria-disabled=${this.softDisabled || A}
      aria-label="${ariaLabel || A}"
      aria-haspopup="${ariaHasPopup || A}"
      aria-expanded="${ariaExpanded || A}">
      ${this.renderContent()}
    </button>`;
    }
    renderLink() {
      const { ariaLabel, ariaHasPopup, ariaExpanded } = this;
      return T`<a
      id="link"
      class="button"
      aria-label="${ariaLabel || A}"
      aria-haspopup="${ariaHasPopup || A}"
      aria-expanded="${ariaExpanded || A}"
      aria-disabled=${this.disabled || this.softDisabled || A}
      tabindex="${this.disabled && !this.softDisabled ? -1 : A}"
      href=${safeHref(this.href)}
      download=${this.download || A}
      target=${this.target || A}
      rel=${this.rel || A}
      referrerpolicy=${this.referrerPolicy || A}
      >${this.renderContent()}
    </a>`;
    }
    renderContent() {
      const icon = T`<slot
      name="icon"
      @slotchange="${this.handleSlotChange}"></slot>`;
      return T`
      <span class="touch"></span>
      ${this.trailingIcon ? A : icon}
      <span class="label"><slot></slot></span>
      ${this.trailingIcon ? icon : A}
    `;
    }
    handleClick(event) {
      if (this.softDisabled || this.disabled && this.href) {
        event.stopImmediatePropagation();
        event.preventDefault();
        return;
      }
      if (!isActivationClick(event) || !this.buttonElement) {
        return;
      }
      this.focus();
      dispatchActivationClick(this.buttonElement);
    }
    handleSlotChange() {
      this.hasIcon = this.assignedIcons.length > 0;
    }
  };
  Button.shadowRootOptions = {
    mode: "open",
    delegatesFocus: true
  };
  __decorate([
    n({ type: Boolean, attribute: "soft-disabled", reflect: true })
  ], Button.prototype, "softDisabled", void 0);
  __decorate([
    n()
  ], Button.prototype, "href", void 0);
  __decorate([
    n()
  ], Button.prototype, "download", void 0);
  __decorate([
    n()
  ], Button.prototype, "target", void 0);
  __decorate([
    n()
  ], Button.prototype, "rel", void 0);
  __decorate([
    n()
  ], Button.prototype, "referrerPolicy", void 0);
  __decorate([
    n({ type: Boolean, attribute: "trailing-icon", reflect: true })
  ], Button.prototype, "trailingIcon", void 0);
  __decorate([
    n({ type: Boolean, attribute: "has-icon", reflect: true })
  ], Button.prototype, "hasIcon", void 0);
  __decorate([
    i2(".button")
  ], Button.prototype, "buttonElement", void 0);
  __decorate([
    e5({ slot: "icon", flatten: true })
  ], Button.prototype, "assignedIcons", void 0);

  // ../button/internal/elevated-button.js
  var ElevatedButton = class extends Button {
    renderElevationOrOutline() {
      return T`<md-elevation part="elevation"></md-elevation>`;
    }
  };

  // ../button/internal/elevated-styles.cssresult.js
  var styles4 = i3`:host{--_container-color: var(--md-elevated-button-container-color, var(--md-sys-color-surface-container-low, #f7f2fa));--_container-elevation: var(--md-elevated-button-container-elevation, 1);--_container-height: var(--md-elevated-button-container-height, 40px);--_container-shadow-color: var(--md-elevated-button-container-shadow-color, var(--md-sys-color-shadow, #000));--_disabled-container-color: var(--md-elevated-button-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-container-elevation: var(--md-elevated-button-disabled-container-elevation, 0);--_disabled-container-opacity: var(--md-elevated-button-disabled-container-opacity, 0.12);--_disabled-label-text-color: var(--md-elevated-button-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-elevated-button-disabled-label-text-opacity, 0.38);--_focus-container-elevation: var(--md-elevated-button-focus-container-elevation, 1);--_focus-label-text-color: var(--md-elevated-button-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-container-elevation: var(--md-elevated-button-hover-container-elevation, 2);--_hover-label-text-color: var(--md-elevated-button-hover-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-color: var(--md-elevated-button-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-opacity: var(--md-elevated-button-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-elevated-button-label-text-color, var(--md-sys-color-primary, #6750a4));--_label-text-font: var(--md-elevated-button-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-elevated-button-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-elevated-button-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-elevated-button-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_pressed-container-elevation: var(--md-elevated-button-pressed-container-elevation, 1);--_pressed-label-text-color: var(--md-elevated-button-pressed-label-text-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-color: var(--md-elevated-button-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-opacity: var(--md-elevated-button-pressed-state-layer-opacity, 0.12);--_disabled-icon-color: var(--md-elevated-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-elevated-button-disabled-icon-opacity, 0.38);--_focus-icon-color: var(--md-elevated-button-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-icon-color: var(--md-elevated-button-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-color: var(--md-elevated-button-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-size: var(--md-elevated-button-icon-size, 18px);--_pressed-icon-color: var(--md-elevated-button-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_container-shape-start-start: var(--md-elevated-button-container-shape-start-start, var(--md-elevated-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-elevated-button-container-shape-start-end, var(--md-elevated-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-elevated-button-container-shape-end-end, var(--md-elevated-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-elevated-button-container-shape-end-start, var(--md-elevated-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_leading-space: var(--md-elevated-button-leading-space, 24px);--_trailing-space: var(--md-elevated-button-trailing-space, 24px);--_with-leading-icon-leading-space: var(--md-elevated-button-with-leading-icon-leading-space, 16px);--_with-leading-icon-trailing-space: var(--md-elevated-button-with-leading-icon-trailing-space, 24px);--_with-trailing-icon-leading-space: var(--md-elevated-button-with-trailing-icon-leading-space, 24px);--_with-trailing-icon-trailing-space: var(--md-elevated-button-with-trailing-icon-trailing-space, 16px)}
`;
  var elevated_styles_cssresult_default = styles4.styleSheet;

  // ../button/internal/shared-elevation-styles.cssresult.js
  var styles5 = i3`md-elevation{transition-duration:280ms}:host(:is([disabled],[soft-disabled])) md-elevation{transition:none}md-elevation{--md-elevation-level: var(--_container-elevation);--md-elevation-shadow-color: var(--_container-shadow-color)}:host(:focus-within) md-elevation{--md-elevation-level: var(--_focus-container-elevation)}:host(:hover) md-elevation{--md-elevation-level: var(--_hover-container-elevation)}:host(:active) md-elevation{--md-elevation-level: var(--_pressed-container-elevation)}:host(:is([disabled],[soft-disabled])) md-elevation{--md-elevation-level: var(--_disabled-container-elevation)}
`;
  var shared_elevation_styles_cssresult_default = styles5.styleSheet;

  // ../button/internal/shared-styles.cssresult.js
  var styles6 = i3`:host{border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end);box-sizing:border-box;cursor:pointer;display:inline-flex;gap:8px;min-height:var(--_container-height);outline:none;padding-block:calc((var(--_container-height) - max(var(--_label-text-line-height),var(--_icon-size)))/2);padding-inline-start:var(--_leading-space);padding-inline-end:var(--_trailing-space);place-content:center;place-items:center;position:relative;font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight);text-overflow:ellipsis;text-wrap:nowrap;user-select:none;-webkit-tap-highlight-color:rgba(0,0,0,0);vertical-align:top;--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}md-focus-ring{--md-focus-ring-shape-start-start: var(--_container-shape-start-start);--md-focus-ring-shape-start-end: var(--_container-shape-start-end);--md-focus-ring-shape-end-end: var(--_container-shape-end-end);--md-focus-ring-shape-end-start: var(--_container-shape-end-start)}:host(:is([disabled],[soft-disabled])){cursor:default;pointer-events:none}.button{border-radius:inherit;cursor:inherit;display:inline-flex;align-items:center;justify-content:center;border:none;outline:none;-webkit-appearance:none;vertical-align:middle;background:rgba(0,0,0,0);text-decoration:none;min-width:calc(64px - var(--_leading-space) - var(--_trailing-space));width:100%;z-index:0;height:100%;font:inherit;color:var(--_label-text-color);padding:0;gap:inherit;text-transform:inherit}.button::-moz-focus-inner{padding:0;border:0}:host(:hover) .button{color:var(--_hover-label-text-color)}:host(:focus-within) .button{color:var(--_focus-label-text-color)}:host(:active) .button{color:var(--_pressed-label-text-color)}.background{background:var(--_container-color);border-radius:inherit;inset:0;position:absolute}.label{overflow:hidden}:is(.button,.label,.label slot),.label ::slotted(*){text-overflow:inherit}:host(:is([disabled],[soft-disabled])) .label{color:var(--_disabled-label-text-color);opacity:var(--_disabled-label-text-opacity)}:host(:is([disabled],[soft-disabled])) .background{background:var(--_disabled-container-color);opacity:var(--_disabled-container-opacity)}@media(forced-colors: active){.background{border:1px solid CanvasText}:host(:is([disabled],[soft-disabled])){--_disabled-icon-color: GrayText;--_disabled-icon-opacity: 1;--_disabled-container-opacity: 1;--_disabled-label-text-color: GrayText;--_disabled-label-text-opacity: 1}}:host([has-icon]:not([trailing-icon])){padding-inline-start:var(--_with-leading-icon-leading-space);padding-inline-end:var(--_with-leading-icon-trailing-space)}:host([has-icon][trailing-icon]){padding-inline-start:var(--_with-trailing-icon-leading-space);padding-inline-end:var(--_with-trailing-icon-trailing-space)}::slotted([slot=icon]){display:inline-flex;position:relative;writing-mode:horizontal-tb;fill:currentColor;flex-shrink:0;color:var(--_icon-color);font-size:var(--_icon-size);inline-size:var(--_icon-size);block-size:var(--_icon-size)}:host(:hover) ::slotted([slot=icon]){color:var(--_hover-icon-color)}:host(:focus-within) ::slotted([slot=icon]){color:var(--_focus-icon-color)}:host(:active) ::slotted([slot=icon]){color:var(--_pressed-icon-color)}:host(:is([disabled],[soft-disabled])) ::slotted([slot=icon]){color:var(--_disabled-icon-color);opacity:var(--_disabled-icon-opacity)}.touch{position:absolute;top:50%;height:max(48px,100%);left:0;right:0;transform:translateY(-50%)}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_container-height))/2) 0}:host([touch-target=none]) .touch{display:none}
`;
  var shared_styles_cssresult_default = styles6.styleSheet;

  // ../button/elevated-button.js
  var MdElevatedButton = class MdElevatedButton2 extends ElevatedButton {
  };
  MdElevatedButton.styles = [
    styles6,
    styles5,
    styles4
  ];
  MdElevatedButton = __decorate([
    e("md-elevated-button")
  ], MdElevatedButton);

  // ../button/internal/filled-button.js
  var FilledButton = class extends Button {
    renderElevationOrOutline() {
      return T`<md-elevation part="elevation"></md-elevation>`;
    }
  };

  // ../button/internal/filled-styles.cssresult.js
  var styles7 = i3`:host{--_container-color: var(--md-filled-button-container-color, var(--md-sys-color-primary, #6750a4));--_container-elevation: var(--md-filled-button-container-elevation, 0);--_container-height: var(--md-filled-button-container-height, 40px);--_container-shadow-color: var(--md-filled-button-container-shadow-color, var(--md-sys-color-shadow, #000));--_disabled-container-color: var(--md-filled-button-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-container-elevation: var(--md-filled-button-disabled-container-elevation, 0);--_disabled-container-opacity: var(--md-filled-button-disabled-container-opacity, 0.12);--_disabled-label-text-color: var(--md-filled-button-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-filled-button-disabled-label-text-opacity, 0.38);--_focus-container-elevation: var(--md-filled-button-focus-container-elevation, 0);--_focus-label-text-color: var(--md-filled-button-focus-label-text-color, var(--md-sys-color-on-primary, #fff));--_hover-container-elevation: var(--md-filled-button-hover-container-elevation, 1);--_hover-label-text-color: var(--md-filled-button-hover-label-text-color, var(--md-sys-color-on-primary, #fff));--_hover-state-layer-color: var(--md-filled-button-hover-state-layer-color, var(--md-sys-color-on-primary, #fff));--_hover-state-layer-opacity: var(--md-filled-button-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-filled-button-label-text-color, var(--md-sys-color-on-primary, #fff));--_label-text-font: var(--md-filled-button-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-filled-button-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-filled-button-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-filled-button-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_pressed-container-elevation: var(--md-filled-button-pressed-container-elevation, 0);--_pressed-label-text-color: var(--md-filled-button-pressed-label-text-color, var(--md-sys-color-on-primary, #fff));--_pressed-state-layer-color: var(--md-filled-button-pressed-state-layer-color, var(--md-sys-color-on-primary, #fff));--_pressed-state-layer-opacity: var(--md-filled-button-pressed-state-layer-opacity, 0.12);--_disabled-icon-color: var(--md-filled-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-filled-button-disabled-icon-opacity, 0.38);--_focus-icon-color: var(--md-filled-button-focus-icon-color, var(--md-sys-color-on-primary, #fff));--_hover-icon-color: var(--md-filled-button-hover-icon-color, var(--md-sys-color-on-primary, #fff));--_icon-color: var(--md-filled-button-icon-color, var(--md-sys-color-on-primary, #fff));--_icon-size: var(--md-filled-button-icon-size, 18px);--_pressed-icon-color: var(--md-filled-button-pressed-icon-color, var(--md-sys-color-on-primary, #fff));--_container-shape-start-start: var(--md-filled-button-container-shape-start-start, var(--md-filled-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-filled-button-container-shape-start-end, var(--md-filled-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-filled-button-container-shape-end-end, var(--md-filled-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-filled-button-container-shape-end-start, var(--md-filled-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_leading-space: var(--md-filled-button-leading-space, 24px);--_trailing-space: var(--md-filled-button-trailing-space, 24px);--_with-leading-icon-leading-space: var(--md-filled-button-with-leading-icon-leading-space, 16px);--_with-leading-icon-trailing-space: var(--md-filled-button-with-leading-icon-trailing-space, 24px);--_with-trailing-icon-leading-space: var(--md-filled-button-with-trailing-icon-leading-space, 24px);--_with-trailing-icon-trailing-space: var(--md-filled-button-with-trailing-icon-trailing-space, 16px)}
`;
  var filled_styles_cssresult_default = styles7.styleSheet;

  // ../button/filled-button.js
  var MdFilledButton = class MdFilledButton2 extends FilledButton {
  };
  MdFilledButton.styles = [
    styles6,
    styles5,
    styles7
  ];
  MdFilledButton = __decorate([
    e("md-filled-button")
  ], MdFilledButton);

  // ../button/internal/filled-tonal-button.js
  var FilledTonalButton = class extends Button {
    renderElevationOrOutline() {
      return T`<md-elevation part="elevation"></md-elevation>`;
    }
  };

  // ../button/internal/filled-tonal-styles.cssresult.js
  var styles8 = i3`:host{--_container-color: var(--md-filled-tonal-button-container-color, var(--md-sys-color-secondary-container, #e8def8));--_container-elevation: var(--md-filled-tonal-button-container-elevation, 0);--_container-height: var(--md-filled-tonal-button-container-height, 40px);--_container-shadow-color: var(--md-filled-tonal-button-container-shadow-color, var(--md-sys-color-shadow, #000));--_disabled-container-color: var(--md-filled-tonal-button-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-container-elevation: var(--md-filled-tonal-button-disabled-container-elevation, 0);--_disabled-container-opacity: var(--md-filled-tonal-button-disabled-container-opacity, 0.12);--_disabled-label-text-color: var(--md-filled-tonal-button-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-filled-tonal-button-disabled-label-text-opacity, 0.38);--_focus-container-elevation: var(--md-filled-tonal-button-focus-container-elevation, 0);--_focus-label-text-color: var(--md-filled-tonal-button-focus-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_hover-container-elevation: var(--md-filled-tonal-button-hover-container-elevation, 1);--_hover-label-text-color: var(--md-filled-tonal-button-hover-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_hover-state-layer-color: var(--md-filled-tonal-button-hover-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_hover-state-layer-opacity: var(--md-filled-tonal-button-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-filled-tonal-button-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_label-text-font: var(--md-filled-tonal-button-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-filled-tonal-button-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-filled-tonal-button-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-filled-tonal-button-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_pressed-container-elevation: var(--md-filled-tonal-button-pressed-container-elevation, 0);--_pressed-label-text-color: var(--md-filled-tonal-button-pressed-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_pressed-state-layer-color: var(--md-filled-tonal-button-pressed-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_pressed-state-layer-opacity: var(--md-filled-tonal-button-pressed-state-layer-opacity, 0.12);--_disabled-icon-color: var(--md-filled-tonal-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-filled-tonal-button-disabled-icon-opacity, 0.38);--_focus-icon-color: var(--md-filled-tonal-button-focus-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_hover-icon-color: var(--md-filled-tonal-button-hover-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_icon-color: var(--md-filled-tonal-button-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_icon-size: var(--md-filled-tonal-button-icon-size, 18px);--_pressed-icon-color: var(--md-filled-tonal-button-pressed-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_container-shape-start-start: var(--md-filled-tonal-button-container-shape-start-start, var(--md-filled-tonal-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-filled-tonal-button-container-shape-start-end, var(--md-filled-tonal-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-filled-tonal-button-container-shape-end-end, var(--md-filled-tonal-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-filled-tonal-button-container-shape-end-start, var(--md-filled-tonal-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_leading-space: var(--md-filled-tonal-button-leading-space, 24px);--_trailing-space: var(--md-filled-tonal-button-trailing-space, 24px);--_with-leading-icon-leading-space: var(--md-filled-tonal-button-with-leading-icon-leading-space, 16px);--_with-leading-icon-trailing-space: var(--md-filled-tonal-button-with-leading-icon-trailing-space, 24px);--_with-trailing-icon-leading-space: var(--md-filled-tonal-button-with-trailing-icon-leading-space, 24px);--_with-trailing-icon-trailing-space: var(--md-filled-tonal-button-with-trailing-icon-trailing-space, 16px)}
`;
  var filled_tonal_styles_cssresult_default = styles8.styleSheet;

  // ../button/filled-tonal-button.js
  var MdFilledTonalButton = class MdFilledTonalButton2 extends FilledTonalButton {
  };
  MdFilledTonalButton.styles = [
    styles6,
    styles5,
    styles8
  ];
  MdFilledTonalButton = __decorate([
    e("md-filled-tonal-button")
  ], MdFilledTonalButton);

  // ../button/internal/outlined-button.js
  var OutlinedButton = class extends Button {
    renderElevationOrOutline() {
      return T`<div class="outline"></div>`;
    }
  };

  // ../button/internal/outlined-styles.cssresult.js
  var styles9 = i3`:host{--_container-height: var(--md-outlined-button-container-height, 40px);--_disabled-label-text-color: var(--md-outlined-button-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-outlined-button-disabled-label-text-opacity, 0.38);--_disabled-outline-color: var(--md-outlined-button-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-opacity: var(--md-outlined-button-disabled-outline-opacity, 0.12);--_focus-label-text-color: var(--md-outlined-button-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-label-text-color: var(--md-outlined-button-hover-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-color: var(--md-outlined-button-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-opacity: var(--md-outlined-button-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-outlined-button-label-text-color, var(--md-sys-color-primary, #6750a4));--_label-text-font: var(--md-outlined-button-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-outlined-button-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-outlined-button-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-outlined-button-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_outline-color: var(--md-outlined-button-outline-color, var(--md-sys-color-outline, #79747e));--_outline-width: var(--md-outlined-button-outline-width, 1px);--_pressed-label-text-color: var(--md-outlined-button-pressed-label-text-color, var(--md-sys-color-primary, #6750a4));--_pressed-outline-color: var(--md-outlined-button-pressed-outline-color, var(--md-sys-color-outline, #79747e));--_pressed-state-layer-color: var(--md-outlined-button-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-opacity: var(--md-outlined-button-pressed-state-layer-opacity, 0.12);--_disabled-icon-color: var(--md-outlined-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-outlined-button-disabled-icon-opacity, 0.38);--_focus-icon-color: var(--md-outlined-button-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-icon-color: var(--md-outlined-button-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-color: var(--md-outlined-button-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-size: var(--md-outlined-button-icon-size, 18px);--_pressed-icon-color: var(--md-outlined-button-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_container-shape-start-start: var(--md-outlined-button-container-shape-start-start, var(--md-outlined-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-outlined-button-container-shape-start-end, var(--md-outlined-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-outlined-button-container-shape-end-end, var(--md-outlined-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-outlined-button-container-shape-end-start, var(--md-outlined-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_leading-space: var(--md-outlined-button-leading-space, 24px);--_trailing-space: var(--md-outlined-button-trailing-space, 24px);--_with-leading-icon-leading-space: var(--md-outlined-button-with-leading-icon-leading-space, 16px);--_with-leading-icon-trailing-space: var(--md-outlined-button-with-leading-icon-trailing-space, 24px);--_with-trailing-icon-leading-space: var(--md-outlined-button-with-trailing-icon-leading-space, 24px);--_with-trailing-icon-trailing-space: var(--md-outlined-button-with-trailing-icon-trailing-space, 16px);--_container-color: none;--_disabled-container-color: none;--_disabled-container-opacity: 0}.outline{inset:0;border-style:solid;position:absolute;box-sizing:border-box;border-color:var(--_outline-color);border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end)}:host(:active) .outline{border-color:var(--_pressed-outline-color)}:host(:is([disabled],[soft-disabled])) .outline{border-color:var(--_disabled-outline-color);opacity:var(--_disabled-outline-opacity)}@media(forced-colors: active){:host(:is([disabled],[soft-disabled])) .background{border-color:GrayText}:host(:is([disabled],[soft-disabled])) .outline{opacity:1}}.outline,md-ripple{border-width:var(--_outline-width)}md-ripple{inline-size:calc(100% - 2*var(--_outline-width));block-size:calc(100% - 2*var(--_outline-width));border-style:solid;border-color:rgba(0,0,0,0)}
`;
  var outlined_styles_cssresult_default = styles9.styleSheet;

  // ../button/outlined-button.js
  var MdOutlinedButton = class MdOutlinedButton2 extends OutlinedButton {
  };
  MdOutlinedButton.styles = [styles6, styles9];
  MdOutlinedButton = __decorate([
    e("md-outlined-button")
  ], MdOutlinedButton);

  // ../button/internal/text-button.js
  var TextButton = class extends Button {
  };

  // ../button/internal/text-styles.cssresult.js
  var styles10 = i3`:host{--_container-height: var(--md-text-button-container-height, 40px);--_disabled-label-text-color: var(--md-text-button-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-text-button-disabled-label-text-opacity, 0.38);--_focus-label-text-color: var(--md-text-button-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-label-text-color: var(--md-text-button-hover-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-color: var(--md-text-button-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-opacity: var(--md-text-button-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-text-button-label-text-color, var(--md-sys-color-primary, #6750a4));--_label-text-font: var(--md-text-button-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-text-button-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-text-button-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-text-button-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_pressed-label-text-color: var(--md-text-button-pressed-label-text-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-color: var(--md-text-button-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-opacity: var(--md-text-button-pressed-state-layer-opacity, 0.12);--_disabled-icon-color: var(--md-text-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-text-button-disabled-icon-opacity, 0.38);--_focus-icon-color: var(--md-text-button-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-icon-color: var(--md-text-button-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-color: var(--md-text-button-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-size: var(--md-text-button-icon-size, 18px);--_pressed-icon-color: var(--md-text-button-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_container-shape-start-start: var(--md-text-button-container-shape-start-start, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-text-button-container-shape-start-end, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-text-button-container-shape-end-end, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-text-button-container-shape-end-start, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_leading-space: var(--md-text-button-leading-space, 12px);--_trailing-space: var(--md-text-button-trailing-space, 12px);--_with-leading-icon-leading-space: var(--md-text-button-with-leading-icon-leading-space, 12px);--_with-leading-icon-trailing-space: var(--md-text-button-with-leading-icon-trailing-space, 16px);--_with-trailing-icon-leading-space: var(--md-text-button-with-trailing-icon-leading-space, 16px);--_with-trailing-icon-trailing-space: var(--md-text-button-with-trailing-icon-trailing-space, 12px);--_container-color: none;--_disabled-container-color: none;--_disabled-container-opacity: 0}
`;
  var text_styles_cssresult_default = styles10.styleSheet;

  // ../button/text-button.js
  var MdTextButton = class MdTextButton2 extends TextButton {
  };
  MdTextButton.styles = [styles6, styles10];
  MdTextButton = __decorate([
    e("md-text-button")
  ], MdTextButton);

  // ../internal/events/redispatch-event.js
  function redispatchEvent(element, event) {
    if (event.bubbles && (!element.shadowRoot || event.composed)) {
      event.stopPropagation();
    }
    const copy = Reflect.construct(event.constructor, [event.type, event]);
    const dispatched = element.dispatchEvent(copy);
    if (!dispatched) {
      event.preventDefault();
    }
    return dispatched;
  }

  // ../labs/behaviors/constraint-validation.js
  var createValidator = /* @__PURE__ */ Symbol("createValidator");
  var getValidityAnchor = /* @__PURE__ */ Symbol("getValidityAnchor");
  var privateValidator = /* @__PURE__ */ Symbol("privateValidator");
  var privateSyncValidity = /* @__PURE__ */ Symbol("privateSyncValidity");
  var privateCustomValidationMessage = /* @__PURE__ */ Symbol("privateCustomValidationMessage");
  function mixinConstraintValidation(base) {
    var _a3;
    class ConstraintValidationElement extends base {
      constructor() {
        super(...arguments);
        this[_a3] = "";
      }
      get validity() {
        this[privateSyncValidity]();
        return this[internals].validity;
      }
      get validationMessage() {
        this[privateSyncValidity]();
        return this[internals].validationMessage;
      }
      get willValidate() {
        this[privateSyncValidity]();
        return this[internals].willValidate;
      }
      checkValidity() {
        this[privateSyncValidity]();
        return this[internals].checkValidity();
      }
      reportValidity() {
        this[privateSyncValidity]();
        return this[internals].reportValidity();
      }
      setCustomValidity(error) {
        this[privateCustomValidationMessage] = error;
        this[privateSyncValidity]();
      }
      requestUpdate(name, oldValue, options) {
        super.requestUpdate(name, oldValue, options);
        this[privateSyncValidity]();
      }
      firstUpdated(changed) {
        super.firstUpdated(changed);
        this[privateSyncValidity]();
      }
      [(_a3 = privateCustomValidationMessage, privateSyncValidity)]() {
        if (o7) {
          return;
        }
        if (!this[privateValidator]) {
          this[privateValidator] = this[createValidator]();
        }
        const { validity, validationMessage: nonCustomValidationMessage } = this[privateValidator].getValidity();
        const customError = !!this[privateCustomValidationMessage];
        const validationMessage = this[privateCustomValidationMessage] || nonCustomValidationMessage;
        this[internals].setValidity({ ...validity, customError }, validationMessage, this[getValidityAnchor]() ?? void 0);
      }
      [createValidator]() {
        throw new Error("Implement [createValidator]");
      }
      [getValidityAnchor]() {
        throw new Error("Implement [getValidityAnchor]");
      }
    }
    return ConstraintValidationElement;
  }

  // ../labs/behaviors/validators/validator.js
  var Validator = class {
    /**
     * Creates a new validator.
     *
     * @param getCurrentState A callback that returns the current state of
     *     constraint validation-related properties.
     */
    constructor(getCurrentState) {
      this.getCurrentState = getCurrentState;
      this.currentValidity = {
        validity: {},
        validationMessage: ""
      };
    }
    /**
     * Returns the current `ValidityStateFlags` and validation message for the
     * validator.
     *
     * If the constraint validation state has not changed, this will return a
     * cached result. This is important since `getValidity()` can be called
     * frequently in response to synchronous property changes.
     *
     * @return The current validity and validation message.
     */
    getValidity() {
      const state = this.getCurrentState();
      const hasStateChanged = !this.prevState || !this.equals(this.prevState, state);
      if (!hasStateChanged) {
        return this.currentValidity;
      }
      const { validity, validationMessage } = this.computeValidity(state);
      this.prevState = this.copy(state);
      this.currentValidity = {
        validationMessage,
        validity: {
          // Change any `ValidityState` instances into `ValidityStateFlags` since
          // `ValidityState` cannot be easily `{...spread}`.
          badInput: validity.badInput,
          customError: validity.customError,
          patternMismatch: validity.patternMismatch,
          rangeOverflow: validity.rangeOverflow,
          rangeUnderflow: validity.rangeUnderflow,
          stepMismatch: validity.stepMismatch,
          tooLong: validity.tooLong,
          tooShort: validity.tooShort,
          typeMismatch: validity.typeMismatch,
          valueMissing: validity.valueMissing
        }
      };
      return this.currentValidity;
    }
  };

  // ../labs/behaviors/validators/checkbox-validator.js
  var CheckboxValidator = class extends Validator {
    computeValidity(state) {
      if (!this.checkboxControl) {
        this.checkboxControl = document.createElement("input");
        this.checkboxControl.type = "checkbox";
      }
      this.checkboxControl.checked = state.checked;
      this.checkboxControl.required = state.required;
      return {
        validity: this.checkboxControl.validity,
        validationMessage: this.checkboxControl.validationMessage
      };
    }
    equals(prev, next) {
      return prev.checked === next.checked && prev.required === next.required;
    }
    copy({ checked, required }) {
      return { checked, required };
    }
  };

  // ../checkbox/internal/checkbox.js
  var checkboxBaseClass = mixinDelegatesAria(mixinConstraintValidation(mixinFormAssociated(mixinElementInternals(s3))));
  var Checkbox = class extends checkboxBaseClass {
    constructor() {
      super();
      this.checked = false;
      this.indeterminate = false;
      this.required = false;
      this.value = "on";
      this.prevChecked = false;
      this.prevDisabled = false;
      this.prevIndeterminate = false;
      if (!o7) {
        this.addEventListener("click", (event) => {
          if (!isActivationClick(event) || !this.input) {
            return;
          }
          this.focus();
          dispatchActivationClick(this.input);
        });
      }
    }
    update(changed) {
      if (changed.has("checked") || changed.has("disabled") || changed.has("indeterminate")) {
        this.prevChecked = changed.get("checked") ?? this.checked;
        this.prevDisabled = changed.get("disabled") ?? this.disabled;
        this.prevIndeterminate = changed.get("indeterminate") ?? this.indeterminate;
      }
      super.update(changed);
    }
    render() {
      const prevNone = !this.prevChecked && !this.prevIndeterminate;
      const prevChecked = this.prevChecked && !this.prevIndeterminate;
      const prevIndeterminate = this.prevIndeterminate;
      const isChecked = this.checked && !this.indeterminate;
      const isIndeterminate = this.indeterminate;
      const containerClasses = o8({
        "disabled": this.disabled,
        "selected": isChecked || isIndeterminate,
        "unselected": !isChecked && !isIndeterminate,
        "checked": isChecked,
        "indeterminate": isIndeterminate,
        "prev-unselected": prevNone,
        "prev-checked": prevChecked,
        "prev-indeterminate": prevIndeterminate,
        "prev-disabled": this.prevDisabled
      });
      const { ariaLabel, ariaInvalid } = this;
      return T`
      <div class="container ${containerClasses}">
        <input
          type="checkbox"
          id="input"
          aria-checked=${isIndeterminate ? "mixed" : A}
          aria-label=${ariaLabel || A}
          aria-invalid=${ariaInvalid || A}
          ?disabled=${this.disabled}
          ?required=${this.required}
          .indeterminate=${this.indeterminate}
          .checked=${this.checked}
          @input=${this.handleInput}
          @change=${this.handleChange} />

        <div class="outline"></div>
        <div class="background"></div>
        <md-focus-ring part="focus-ring" for="input"></md-focus-ring>
        <md-ripple for="input" ?disabled=${this.disabled}></md-ripple>
        <svg class="icon" viewBox="0 0 18 18" aria-hidden="true">
          <rect class="mark short" />
          <rect class="mark long" />
        </svg>
      </div>
    `;
    }
    handleInput(event) {
      const target = event.target;
      this.checked = target.checked;
      this.indeterminate = target.indeterminate;
    }
    handleChange(event) {
      redispatchEvent(this, event);
    }
    [getFormValue]() {
      if (!this.checked || this.indeterminate) {
        return null;
      }
      return this.value;
    }
    [getFormState]() {
      return String(this.checked);
    }
    formResetCallback() {
      this.checked = this.hasAttribute("checked");
    }
    formStateRestoreCallback(state) {
      this.checked = state === "true";
    }
    [createValidator]() {
      return new CheckboxValidator(() => this);
    }
    [getValidityAnchor]() {
      return this.input;
    }
  };
  Checkbox.shadowRootOptions = {
    ...s3.shadowRootOptions,
    delegatesFocus: true
  };
  __decorate([
    n({ type: Boolean })
  ], Checkbox.prototype, "checked", void 0);
  __decorate([
    n({ type: Boolean })
  ], Checkbox.prototype, "indeterminate", void 0);
  __decorate([
    n({ type: Boolean })
  ], Checkbox.prototype, "required", void 0);
  __decorate([
    n()
  ], Checkbox.prototype, "value", void 0);
  __decorate([
    t()
  ], Checkbox.prototype, "prevChecked", void 0);
  __decorate([
    t()
  ], Checkbox.prototype, "prevDisabled", void 0);
  __decorate([
    t()
  ], Checkbox.prototype, "prevIndeterminate", void 0);
  __decorate([
    i2("input")
  ], Checkbox.prototype, "input", void 0);

  // ../checkbox/internal/checkbox-styles.cssresult.js
  var styles11 = i3`:host{border-start-start-radius:var(--md-checkbox-container-shape-start-start, var(--md-checkbox-container-shape, 2px));border-start-end-radius:var(--md-checkbox-container-shape-start-end, var(--md-checkbox-container-shape, 2px));border-end-end-radius:var(--md-checkbox-container-shape-end-end, var(--md-checkbox-container-shape, 2px));border-end-start-radius:var(--md-checkbox-container-shape-end-start, var(--md-checkbox-container-shape, 2px));display:inline-flex;height:var(--md-checkbox-container-size, 18px);position:relative;vertical-align:top;width:var(--md-checkbox-container-size, 18px);-webkit-tap-highlight-color:rgba(0,0,0,0);cursor:pointer}:host([disabled]){cursor:default}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--md-checkbox-container-size, 18px))/2)}md-focus-ring{height:44px;inset:unset;width:44px}input{appearance:none;height:48px;margin:0;opacity:0;outline:none;position:absolute;width:48px;z-index:1;cursor:inherit}:host([touch-target=none]) input{height:100%;width:100%}.container{border-radius:inherit;display:flex;height:100%;place-content:center;place-items:center;position:relative;width:100%}.outline,.background,.icon{inset:0;position:absolute}.outline,.background{border-radius:inherit}.outline{border-color:var(--md-checkbox-outline-color, var(--md-sys-color-on-surface-variant, #49454f));border-style:solid;border-width:var(--md-checkbox-outline-width, 2px);box-sizing:border-box}.background{background-color:var(--md-checkbox-selected-container-color, var(--md-sys-color-primary, #6750a4))}.background,.icon{opacity:0;transition-duration:150ms,50ms;transition-property:transform,opacity;transition-timing-function:cubic-bezier(0.3, 0, 0.8, 0.15),linear;transform:scale(0.6)}:where(.selected) :is(.background,.icon){opacity:1;transition-duration:350ms,50ms;transition-timing-function:cubic-bezier(0.05, 0.7, 0.1, 1),linear;transform:scale(1)}md-ripple{border-radius:var(--md-checkbox-state-layer-shape, var(--md-sys-shape-corner-full, 9999px));height:var(--md-checkbox-state-layer-size, 40px);inset:unset;width:var(--md-checkbox-state-layer-size, 40px);--md-ripple-hover-color: var(--md-checkbox-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-hover-opacity: var(--md-checkbox-hover-state-layer-opacity, 0.08);--md-ripple-pressed-color: var(--md-checkbox-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--md-ripple-pressed-opacity: var(--md-checkbox-pressed-state-layer-opacity, 0.12)}.selected md-ripple{--md-ripple-hover-color: var(--md-checkbox-selected-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--md-ripple-hover-opacity: var(--md-checkbox-selected-hover-state-layer-opacity, 0.08);--md-ripple-pressed-color: var(--md-checkbox-selected-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-pressed-opacity: var(--md-checkbox-selected-pressed-state-layer-opacity, 0.12)}.icon{fill:var(--md-checkbox-selected-icon-color, var(--md-sys-color-on-primary, #fff));height:var(--md-checkbox-icon-size, 18px);width:var(--md-checkbox-icon-size, 18px)}.mark.short{height:2px;transition-property:transform,height;width:2px}.mark.long{height:2px;transition-property:transform,width;width:10px}.mark{animation-duration:150ms;animation-timing-function:cubic-bezier(0.3, 0, 0.8, 0.15);transition-duration:150ms;transition-timing-function:cubic-bezier(0.3, 0, 0.8, 0.15)}.selected .mark{animation-duration:350ms;animation-timing-function:cubic-bezier(0.05, 0.7, 0.1, 1);transition-duration:350ms;transition-timing-function:cubic-bezier(0.05, 0.7, 0.1, 1)}.checked .mark,.prev-checked.unselected .mark{transform:scaleY(-1) translate(7px, -14px) rotate(45deg)}.checked .mark.short,.prev-checked.unselected .mark.short{height:5.6568542495px}.checked .mark.long,.prev-checked.unselected .mark.long{width:11.313708499px}.indeterminate .mark,.prev-indeterminate.unselected .mark{transform:scaleY(-1) translate(4px, -10px) rotate(0deg)}.prev-unselected .mark{transition-property:none}.prev-unselected.checked .mark.long{animation-name:prev-unselected-to-checked}@keyframes prev-unselected-to-checked{from{width:0}}:where(:hover) .outline{border-color:var(--md-checkbox-hover-outline-color, var(--md-sys-color-on-surface, #1d1b20));border-width:var(--md-checkbox-hover-outline-width, 2px)}:where(:hover) .background{background:var(--md-checkbox-selected-hover-container-color, var(--md-sys-color-primary, #6750a4))}:where(:hover) .icon{fill:var(--md-checkbox-selected-hover-icon-color, var(--md-sys-color-on-primary, #fff))}:where(:focus-within) .outline{border-color:var(--md-checkbox-focus-outline-color, var(--md-sys-color-on-surface, #1d1b20));border-width:var(--md-checkbox-focus-outline-width, 2px)}:where(:focus-within) .background{background:var(--md-checkbox-selected-focus-container-color, var(--md-sys-color-primary, #6750a4))}:where(:focus-within) .icon{fill:var(--md-checkbox-selected-focus-icon-color, var(--md-sys-color-on-primary, #fff))}:where(:active) .outline{border-color:var(--md-checkbox-pressed-outline-color, var(--md-sys-color-on-surface, #1d1b20));border-width:var(--md-checkbox-pressed-outline-width, 2px)}:where(:active) .background{background:var(--md-checkbox-selected-pressed-container-color, var(--md-sys-color-primary, #6750a4))}:where(:active) .icon{fill:var(--md-checkbox-selected-pressed-icon-color, var(--md-sys-color-on-primary, #fff))}:where(.disabled,.prev-disabled) :is(.background,.icon,.mark){animation-duration:0s;transition-duration:0s}:where(.disabled) .outline{border-color:var(--md-checkbox-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));border-width:var(--md-checkbox-disabled-outline-width, 2px);opacity:var(--md-checkbox-disabled-container-opacity, 0.38)}:where(.selected.disabled) .outline{visibility:hidden}:where(.selected.disabled) .background{background:var(--md-checkbox-selected-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));opacity:var(--md-checkbox-selected-disabled-container-opacity, 0.38)}:where(.disabled) .icon{fill:var(--md-checkbox-selected-disabled-icon-color, var(--md-sys-color-surface, #fef7ff))}@media(forced-colors: active){.background{background-color:CanvasText}.selected.disabled .background{background-color:GrayText;opacity:1}.outline{border-color:CanvasText}.disabled .outline{border-color:GrayText;opacity:1}.icon{fill:Canvas}}
`;
  var checkbox_styles_cssresult_default = styles11.styleSheet;

  // ../checkbox/checkbox.js
  var MdCheckbox = class MdCheckbox2 extends Checkbox {
  };
  MdCheckbox.styles = [styles11];
  MdCheckbox = __decorate([
    e("md-checkbox")
  ], MdCheckbox);

  // ../chips/internal/chip.js
  var chipBaseClass = mixinDelegatesAria(s3);
  var Chip = class extends chipBaseClass {
    /**
     * Whether or not the primary ripple is disabled (defaults to `disabled`).
     * Some chip actions such as links cannot be disabled.
     */
    get rippleDisabled() {
      return this.disabled || this.softDisabled;
    }
    constructor() {
      super();
      this.disabled = false;
      this.softDisabled = false;
      this.alwaysFocusable = false;
      this.label = "";
      this.hasIcon = false;
      if (!o7) {
        this.addEventListener("click", this.handleClick.bind(this), {
          capture: true
        });
      }
    }
    focus(options) {
      if (this.disabled && !this.alwaysFocusable) {
        return;
      }
      super.focus(options);
    }
    render() {
      return T`
      <div class="container ${o8(this.getContainerClasses())}">
        ${this.renderContainerContent()}
      </div>
    `;
    }
    updated(changed) {
      if (changed.has("disabled") && changed.get("disabled") !== void 0) {
        this.dispatchEvent(new Event("update-focus", { bubbles: true }));
      }
    }
    getContainerClasses() {
      return {
        "disabled": this.disabled || this.softDisabled,
        "has-icon": this.hasIcon
      };
    }
    renderContainerContent() {
      return T`
      ${this.renderOutline()}
      <md-focus-ring part="focus-ring" for=${this.primaryId}></md-focus-ring>
      <md-ripple
        for=${this.primaryId}
        ?disabled=${this.rippleDisabled}></md-ripple>
      ${this.renderPrimaryAction(this.renderPrimaryContent())}
    `;
    }
    renderOutline() {
      return T`<span class="outline"></span>`;
    }
    renderLeadingIcon() {
      return T`<slot name="icon" @slotchange=${this.handleIconChange}></slot>`;
    }
    renderPrimaryContent() {
      return T`
      <span class="leading icon" aria-hidden="true">
        ${this.renderLeadingIcon()}
      </span>
      <span class="label">
        <span class="label-text" id="label">
          ${this.label ? this.label : T`<slot></slot>`}
        </span>
      </span>
      <span class="touch"></span>
    `;
    }
    handleIconChange(event) {
      const slot = event.target;
      this.hasIcon = slot.assignedElements({ flatten: true }).length > 0;
    }
    handleClick(event) {
      if (this.softDisabled || this.disabled && this.alwaysFocusable) {
        event.stopImmediatePropagation();
        event.preventDefault();
        return;
      }
    }
  };
  Chip.shadowRootOptions = {
    ...s3.shadowRootOptions,
    delegatesFocus: true
  };
  __decorate([
    n({ type: Boolean, reflect: true })
  ], Chip.prototype, "disabled", void 0);
  __decorate([
    n({ type: Boolean, attribute: "soft-disabled", reflect: true })
  ], Chip.prototype, "softDisabled", void 0);
  __decorate([
    n({ type: Boolean, attribute: "always-focusable" })
  ], Chip.prototype, "alwaysFocusable", void 0);
  __decorate([
    n()
  ], Chip.prototype, "label", void 0);
  __decorate([
    n({ type: Boolean, reflect: true, attribute: "has-icon" })
  ], Chip.prototype, "hasIcon", void 0);

  // ../chips/internal/assist-chip.js
  var AssistChip = class extends Chip {
    constructor() {
      super(...arguments);
      this.elevated = false;
      this.href = "";
      this.download = "";
      this.target = "";
      this.rel = "";
      this.referrerPolicy = "";
    }
    get primaryId() {
      return this.href ? "link" : "button";
    }
    get rippleDisabled() {
      return !this.href && (this.disabled || this.softDisabled);
    }
    getContainerClasses() {
      return {
        ...super.getContainerClasses(),
        // Link chips cannot be disabled
        disabled: !this.href && (this.disabled || this.softDisabled),
        elevated: this.elevated,
        link: !!this.href
      };
    }
    renderPrimaryAction(content) {
      const { ariaLabel } = this;
      if (this.href) {
        return T`
        <a
          class="primary action"
          id="link"
          aria-label=${ariaLabel || A}
          href=${safeHref(this.href)}
          download=${this.download || A}
          target=${this.target || A}
          rel=${this.rel || A}
          referrerpolicy=${this.referrerPolicy || A}
          >${content}</a
        >
      `;
      }
      return T`
      <button
        class="primary action"
        id="button"
        aria-label=${ariaLabel || A}
        aria-disabled=${this.softDisabled || A}
        ?disabled=${this.disabled && !this.alwaysFocusable}
        type="button"
        >${content}</button
      >
    `;
    }
    renderOutline() {
      if (this.elevated) {
        return T`<md-elevation part="elevation"></md-elevation>`;
      }
      return super.renderOutline();
    }
  };
  __decorate([
    n({ type: Boolean })
  ], AssistChip.prototype, "elevated", void 0);
  __decorate([
    n()
  ], AssistChip.prototype, "href", void 0);
  __decorate([
    n()
  ], AssistChip.prototype, "download", void 0);
  __decorate([
    n()
  ], AssistChip.prototype, "target", void 0);
  __decorate([
    n()
  ], AssistChip.prototype, "rel", void 0);
  __decorate([
    n()
  ], AssistChip.prototype, "referrerPolicy", void 0);

  // ../chips/internal/assist-styles.cssresult.js
  var styles12 = i3`:host{--_container-height: var(--md-assist-chip-container-height, 32px);--_disabled-label-text-color: var(--md-assist-chip-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-assist-chip-disabled-label-text-opacity, 0.38);--_elevated-container-color: var(--md-assist-chip-elevated-container-color, var(--md-sys-color-surface-container-low, #f7f2fa));--_elevated-container-elevation: var(--md-assist-chip-elevated-container-elevation, 1);--_elevated-container-shadow-color: var(--md-assist-chip-elevated-container-shadow-color, var(--md-sys-color-shadow, #000));--_elevated-disabled-container-color: var(--md-assist-chip-elevated-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_elevated-disabled-container-elevation: var(--md-assist-chip-elevated-disabled-container-elevation, 0);--_elevated-disabled-container-opacity: var(--md-assist-chip-elevated-disabled-container-opacity, 0.12);--_elevated-focus-container-elevation: var(--md-assist-chip-elevated-focus-container-elevation, 1);--_elevated-hover-container-elevation: var(--md-assist-chip-elevated-hover-container-elevation, 2);--_elevated-pressed-container-elevation: var(--md-assist-chip-elevated-pressed-container-elevation, 1);--_focus-label-text-color: var(--md-assist-chip-focus-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-label-text-color: var(--md-assist-chip-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-state-layer-color: var(--md-assist-chip-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-state-layer-opacity: var(--md-assist-chip-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-assist-chip-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_label-text-font: var(--md-assist-chip-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-assist-chip-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-assist-chip-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-assist-chip-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_pressed-label-text-color: var(--md-assist-chip-pressed-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_pressed-state-layer-color: var(--md-assist-chip-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_pressed-state-layer-opacity: var(--md-assist-chip-pressed-state-layer-opacity, 0.12);--_disabled-outline-color: var(--md-assist-chip-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-opacity: var(--md-assist-chip-disabled-outline-opacity, 0.12);--_focus-outline-color: var(--md-assist-chip-focus-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_outline-color: var(--md-assist-chip-outline-color, var(--md-sys-color-outline, #79747e));--_outline-width: var(--md-assist-chip-outline-width, 1px);--_disabled-leading-icon-color: var(--md-assist-chip-disabled-leading-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-leading-icon-opacity: var(--md-assist-chip-disabled-leading-icon-opacity, 0.38);--_focus-leading-icon-color: var(--md-assist-chip-focus-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-leading-icon-color: var(--md-assist-chip-hover-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_leading-icon-color: var(--md-assist-chip-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-size: var(--md-assist-chip-icon-size, 18px);--_pressed-leading-icon-color: var(--md-assist-chip-pressed-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_container-shape-start-start: var(--md-assist-chip-container-shape-start-start, var(--md-assist-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-start-end: var(--md-assist-chip-container-shape-start-end, var(--md-assist-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-end-end: var(--md-assist-chip-container-shape-end-end, var(--md-assist-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-end-start: var(--md-assist-chip-container-shape-end-start, var(--md-assist-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_leading-space: var(--md-assist-chip-leading-space, 16px);--_trailing-space: var(--md-assist-chip-trailing-space, 16px);--_icon-label-space: var(--md-assist-chip-icon-label-space, 8px);--_with-leading-icon-leading-space: var(--md-assist-chip-with-leading-icon-leading-space, 8px)}@media(forced-colors: active){.link .outline{border-color:ActiveText}}
`;
  var assist_styles_cssresult_default = styles12.styleSheet;

  // ../chips/internal/elevated-styles.cssresult.js
  var styles13 = i3`.elevated{--md-elevation-level: var(--_elevated-container-elevation);--md-elevation-shadow-color: var(--_elevated-container-shadow-color)}.elevated::before{background:var(--_elevated-container-color)}.elevated:hover{--md-elevation-level: var(--_elevated-hover-container-elevation)}.elevated:focus-within{--md-elevation-level: var(--_elevated-focus-container-elevation)}.elevated:active{--md-elevation-level: var(--_elevated-pressed-container-elevation)}.elevated.disabled{--md-elevation-level: var(--_elevated-disabled-container-elevation)}.elevated.disabled::before{background:var(--_elevated-disabled-container-color);opacity:var(--_elevated-disabled-container-opacity)}@media(forced-colors: active){.elevated md-elevation{border:1px solid CanvasText}.elevated.disabled md-elevation{border-color:GrayText}}
`;
  var elevated_styles_cssresult_default2 = styles13.styleSheet;

  // ../chips/internal/shared-styles.cssresult.js
  var styles14 = i3`:host{border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end);display:inline-flex;height:var(--_container-height);cursor:pointer;-webkit-tap-highlight-color:rgba(0,0,0,0);--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}:host(:is([disabled],[soft-disabled])){pointer-events:none}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_container-height))/2) 0}md-focus-ring{--md-focus-ring-shape-start-start: var(--_container-shape-start-start);--md-focus-ring-shape-start-end: var(--_container-shape-start-end);--md-focus-ring-shape-end-end: var(--_container-shape-end-end);--md-focus-ring-shape-end-start: var(--_container-shape-end-start)}.container{border-radius:inherit;box-sizing:border-box;display:flex;height:100%;position:relative;width:100%}.container::before{border-radius:inherit;content:"";inset:0;pointer-events:none;position:absolute}.container:not(.disabled){cursor:pointer}.container.disabled{pointer-events:none}.cell{display:flex}.action{align-items:baseline;appearance:none;background:none;border:none;border-radius:inherit;display:flex;outline:none;padding:0;position:relative;text-decoration:none}.primary.action{min-width:0;padding-inline-start:var(--_leading-space);padding-inline-end:var(--_trailing-space)}.has-icon .primary.action{padding-inline-start:var(--_with-leading-icon-leading-space)}.touch{height:48px;inset:50% 0 0;position:absolute;transform:translateY(-50%);width:100%}:host([touch-target=none]) .touch{display:none}.outline{border:var(--_outline-width) solid var(--_outline-color);border-radius:inherit;inset:0;pointer-events:none;position:absolute}:where(:focus) .outline{border-color:var(--_focus-outline-color)}:where(.disabled) .outline{border-color:var(--_disabled-outline-color);opacity:var(--_disabled-outline-opacity)}md-ripple{border-radius:inherit}.label,.icon,.touch{z-index:1}.label{align-items:center;color:var(--_label-text-color);display:flex;font-family:var(--_label-text-font);font-size:var(--_label-text-size);font-weight:var(--_label-text-weight);height:100%;line-height:var(--_label-text-line-height);overflow:hidden;user-select:none}.label-text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}:where(:hover) .label{color:var(--_hover-label-text-color)}:where(:focus) .label{color:var(--_focus-label-text-color)}:where(:active) .label{color:var(--_pressed-label-text-color)}:where(.disabled) .label{color:var(--_disabled-label-text-color);opacity:var(--_disabled-label-text-opacity)}.icon{align-self:center;display:flex;fill:currentColor;position:relative}.icon ::slotted(:first-child){font-size:var(--_icon-size);height:var(--_icon-size);width:var(--_icon-size)}.leading.icon{color:var(--_leading-icon-color)}.leading.icon ::slotted(*),.leading.icon svg{margin-inline-end:var(--_icon-label-space)}:where(:hover) .leading.icon{color:var(--_hover-leading-icon-color)}:where(:focus) .leading.icon{color:var(--_focus-leading-icon-color)}:where(:active) .leading.icon{color:var(--_pressed-leading-icon-color)}:where(.disabled) .leading.icon{color:var(--_disabled-leading-icon-color);opacity:var(--_disabled-leading-icon-opacity)}@media(forced-colors: active){:where(.disabled) :is(.label,.outline,.leading.icon){color:GrayText;opacity:1}}a,button{text-transform:inherit}a,button:not(:disabled,[aria-disabled=true]){cursor:inherit}
`;
  var shared_styles_cssresult_default2 = styles14.styleSheet;

  // ../chips/assist-chip.js
  var MdAssistChip = class MdAssistChip2 extends AssistChip {
  };
  MdAssistChip.styles = [
    styles14,
    styles13,
    styles12
  ];
  MdAssistChip = __decorate([
    e("md-assist-chip")
  ], MdAssistChip);

  // ../chips/internal/chip-set.js
  var ChipSet = class extends s3 {
    get chips() {
      return this.childElements.filter((child) => child instanceof Chip);
    }
    constructor() {
      super();
      this.internals = // Cast needed for closure
      this.attachInternals();
      if (!o7) {
        this.addEventListener("focusin", this.updateTabIndices.bind(this));
        this.addEventListener("update-focus", this.updateTabIndices.bind(this));
        this.addEventListener("keydown", this.handleKeyDown.bind(this));
        this.internals.role = "toolbar";
      }
    }
    render() {
      return T`<slot @slotchange=${this.updateTabIndices}></slot>`;
    }
    handleKeyDown(event) {
      const isLeft = event.key === "ArrowLeft";
      const isRight = event.key === "ArrowRight";
      const isHome = event.key === "Home";
      const isEnd = event.key === "End";
      if (!isLeft && !isRight && !isHome && !isEnd) {
        return;
      }
      const { chips } = this;
      if (chips.length < 2) {
        return;
      }
      event.preventDefault();
      if (isHome || isEnd) {
        const index = isHome ? 0 : chips.length - 1;
        chips[index].focus({ trailing: isEnd });
        this.updateTabIndices();
        return;
      }
      const isRtl2 = getComputedStyle(this).direction === "rtl";
      const forwards = isRtl2 ? isLeft : isRight;
      const focusedChip = chips.find((chip) => chip.matches(":focus-within"));
      if (!focusedChip) {
        const nextChip = forwards ? chips[0] : chips[chips.length - 1];
        nextChip.focus({ trailing: !forwards });
        this.updateTabIndices();
        return;
      }
      const currentIndex = chips.indexOf(focusedChip);
      let nextIndex = forwards ? currentIndex + 1 : currentIndex - 1;
      while (nextIndex !== currentIndex) {
        if (nextIndex >= chips.length) {
          nextIndex = 0;
        } else if (nextIndex < 0) {
          nextIndex = chips.length - 1;
        }
        const nextChip = chips[nextIndex];
        if (nextChip.disabled && !nextChip.alwaysFocusable) {
          if (forwards) {
            nextIndex++;
          } else {
            nextIndex--;
          }
          continue;
        }
        nextChip.focus({ trailing: !forwards });
        this.updateTabIndices();
        break;
      }
    }
    updateTabIndices() {
      const { chips } = this;
      let chipToFocus;
      for (const chip of chips) {
        const isChipFocusable = chip.alwaysFocusable || !chip.disabled;
        const chipIsFocused = chip.matches(":focus-within");
        if (chipIsFocused && isChipFocusable) {
          chipToFocus = chip;
          continue;
        }
        if (isChipFocusable && !chipToFocus) {
          chipToFocus = chip;
        }
        chip.tabIndex = -1;
      }
      if (chipToFocus) {
        chipToFocus.tabIndex = 0;
      }
    }
  };
  __decorate([
    e5()
  ], ChipSet.prototype, "childElements", void 0);

  // ../chips/internal/chip-set-styles.cssresult.js
  var styles15 = i3`:host{display:flex;flex-wrap:wrap;gap:8px}
`;
  var chip_set_styles_cssresult_default = styles15.styleSheet;

  // ../chips/chip-set.js
  var MdChipSet = class MdChipSet2 extends ChipSet {
  };
  MdChipSet.styles = [styles15];
  MdChipSet = __decorate([
    e("md-chip-set")
  ], MdChipSet);

  // ../chips/internal/multi-action-chip.js
  var ARIA_LABEL_REMOVE = "aria-label-remove";
  var MultiActionChip = class extends Chip {
    get ariaLabelRemove() {
      if (this.hasAttribute(ARIA_LABEL_REMOVE)) {
        return this.getAttribute(ARIA_LABEL_REMOVE);
      }
      const { ariaLabel } = this;
      if (ariaLabel || this.label) {
        return `Remove ${ariaLabel || this.label}`;
      }
      return null;
    }
    set ariaLabelRemove(ariaLabel) {
      const prev = this.ariaLabelRemove;
      if (ariaLabel === prev) {
        return;
      }
      if (ariaLabel === null) {
        this.removeAttribute(ARIA_LABEL_REMOVE);
      } else {
        this.setAttribute(ARIA_LABEL_REMOVE, ariaLabel);
      }
      this.requestUpdate();
    }
    constructor() {
      super();
      this.handleTrailingActionFocus = this.handleTrailingActionFocus.bind(this);
      if (!o7) {
        this.addEventListener("keydown", this.handleKeyDown.bind(this));
      }
    }
    focus(options) {
      const isFocusable3 = this.alwaysFocusable || !this.disabled;
      if (isFocusable3 && options?.trailing && this.trailingAction) {
        this.trailingAction.focus(options);
        return;
      }
      super.focus(options);
    }
    renderContainerContent() {
      return T`
      ${super.renderContainerContent()}
      ${this.renderTrailingAction(this.handleTrailingActionFocus)}
    `;
    }
    handleKeyDown(event) {
      const isLeft = event.key === "ArrowLeft";
      const isRight = event.key === "ArrowRight";
      if (!isLeft && !isRight) {
        return;
      }
      if (!this.primaryAction || !this.trailingAction) {
        return;
      }
      const isRtl2 = getComputedStyle(this).direction === "rtl";
      const forwards = isRtl2 ? isLeft : isRight;
      const isPrimaryFocused = this.primaryAction?.matches(":focus-within");
      const isTrailingFocused = this.trailingAction?.matches(":focus-within");
      if (forwards && isTrailingFocused || !forwards && isPrimaryFocused) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      const actionToFocus = forwards ? this.trailingAction : this.primaryAction;
      actionToFocus.focus();
    }
    handleTrailingActionFocus() {
      const { primaryAction, trailingAction } = this;
      if (!primaryAction || !trailingAction) {
        return;
      }
      primaryAction.tabIndex = -1;
      trailingAction.addEventListener("focusout", () => {
        primaryAction.tabIndex = 0;
      }, { once: true });
    }
  };

  // ../chips/internal/trailing-icons.js
  function renderRemoveButton({ ariaLabel, disabled, focusListener, tabbable = false }) {
    return T`
    <span id="remove-label" hidden aria-hidden="true">Remove</span>
    <button
      class="trailing action"
      aria-label=${ariaLabel || A}
      aria-labelledby=${!ariaLabel ? "remove-label label" : A}
      tabindex=${!tabbable ? -1 : A}
      @click=${handleRemoveClick}
      @focus=${focusListener}>
      <md-focus-ring part="trailing-focus-ring"></md-focus-ring>
      <md-ripple ?disabled=${disabled}></md-ripple>
      <span class="trailing icon" aria-hidden="true">
        <slot name="remove-trailing-icon">
          <svg viewBox="0 96 960 960">
            <path
              d="m249 849-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
          </svg>
        </slot>
      </span>
      <span class="touch"></span>
    </button>
  `;
  }
  function handleRemoveClick(event) {
    if (this.disabled || this.softDisabled) {
      return;
    }
    event.stopPropagation();
    const preventDefault = !this.dispatchEvent(new Event("remove", { cancelable: true }));
    if (preventDefault) {
      return;
    }
    this.remove();
  }

  // ../chips/internal/filter-chip.js
  var FilterChip = class extends MultiActionChip {
    constructor() {
      super(...arguments);
      this.elevated = false;
      this.removable = false;
      this.selected = false;
      this.hasSelectedIcon = false;
    }
    get primaryId() {
      return "button";
    }
    getContainerClasses() {
      return {
        ...super.getContainerClasses(),
        elevated: this.elevated,
        selected: this.selected,
        "has-trailing": this.removable,
        "has-icon": this.hasIcon || this.selected
      };
    }
    renderPrimaryAction(content) {
      const { ariaLabel } = this;
      return T`
      <button
        class="primary action"
        id="button"
        aria-label=${ariaLabel || A}
        aria-pressed=${this.selected}
        aria-disabled=${this.softDisabled || A}
        ?disabled=${this.disabled && !this.alwaysFocusable}
        @click=${this.handleClickOnChild}
        >${content}</button
      >
    `;
    }
    renderLeadingIcon() {
      if (!this.selected) {
        return super.renderLeadingIcon();
      }
      return T`
      <slot name="selected-icon">
        <svg class="checkmark" viewBox="0 0 18 18" aria-hidden="true">
          <path
            d="M6.75012 12.1274L3.62262 8.99988L2.55762 10.0574L6.75012 14.2499L15.7501 5.24988L14.6926 4.19238L6.75012 12.1274Z" />
        </svg>
      </slot>
    `;
    }
    renderTrailingAction(focusListener) {
      if (this.removable) {
        return renderRemoveButton({
          focusListener,
          ariaLabel: this.ariaLabelRemove,
          disabled: this.disabled || this.softDisabled
        });
      }
      return A;
    }
    renderOutline() {
      if (this.elevated) {
        return T`<md-elevation part="elevation"></md-elevation>`;
      }
      return super.renderOutline();
    }
    handleClickOnChild(event) {
      if (this.disabled || this.softDisabled) {
        return;
      }
      const prevValue = this.selected;
      this.selected = !this.selected;
      const preventDefault = !redispatchEvent(this, event);
      if (preventDefault) {
        this.selected = prevValue;
        return;
      }
    }
  };
  __decorate([
    n({ type: Boolean })
  ], FilterChip.prototype, "elevated", void 0);
  __decorate([
    n({ type: Boolean })
  ], FilterChip.prototype, "removable", void 0);
  __decorate([
    n({ type: Boolean, reflect: true })
  ], FilterChip.prototype, "selected", void 0);
  __decorate([
    n({ type: Boolean, reflect: true, attribute: "has-selected-icon" })
  ], FilterChip.prototype, "hasSelectedIcon", void 0);
  __decorate([
    i2(".primary.action")
  ], FilterChip.prototype, "primaryAction", void 0);
  __decorate([
    i2(".trailing.action")
  ], FilterChip.prototype, "trailingAction", void 0);

  // ../chips/internal/filter-styles.cssresult.js
  var styles16 = i3`:host{--_container-height: var(--md-filter-chip-container-height, 32px);--_disabled-label-text-color: var(--md-filter-chip-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-filter-chip-disabled-label-text-opacity, 0.38);--_elevated-container-elevation: var(--md-filter-chip-elevated-container-elevation, 1);--_elevated-container-shadow-color: var(--md-filter-chip-elevated-container-shadow-color, var(--md-sys-color-shadow, #000));--_elevated-disabled-container-color: var(--md-filter-chip-elevated-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_elevated-disabled-container-elevation: var(--md-filter-chip-elevated-disabled-container-elevation, 0);--_elevated-disabled-container-opacity: var(--md-filter-chip-elevated-disabled-container-opacity, 0.12);--_elevated-focus-container-elevation: var(--md-filter-chip-elevated-focus-container-elevation, 1);--_elevated-hover-container-elevation: var(--md-filter-chip-elevated-hover-container-elevation, 2);--_elevated-pressed-container-elevation: var(--md-filter-chip-elevated-pressed-container-elevation, 1);--_elevated-selected-container-color: var(--md-filter-chip-elevated-selected-container-color, var(--md-sys-color-secondary-container, #e8def8));--_label-text-font: var(--md-filter-chip-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-filter-chip-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-filter-chip-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-filter-chip-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_selected-focus-label-text-color: var(--md-filter-chip-selected-focus-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-label-text-color: var(--md-filter-chip-selected-hover-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-state-layer-color: var(--md-filter-chip-selected-hover-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-state-layer-opacity: var(--md-filter-chip-selected-hover-state-layer-opacity, 0.08);--_selected-label-text-color: var(--md-filter-chip-selected-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-label-text-color: var(--md-filter-chip-selected-pressed-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-state-layer-color: var(--md-filter-chip-selected-pressed-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_selected-pressed-state-layer-opacity: var(--md-filter-chip-selected-pressed-state-layer-opacity, 0.12);--_elevated-container-color: var(--md-filter-chip-elevated-container-color, var(--md-sys-color-surface-container-low, #f7f2fa));--_disabled-outline-color: var(--md-filter-chip-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-opacity: var(--md-filter-chip-disabled-outline-opacity, 0.12);--_disabled-selected-container-color: var(--md-filter-chip-disabled-selected-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-selected-container-opacity: var(--md-filter-chip-disabled-selected-container-opacity, 0.12);--_focus-outline-color: var(--md-filter-chip-focus-outline-color, var(--md-sys-color-on-surface-variant, #49454f));--_outline-color: var(--md-filter-chip-outline-color, var(--md-sys-color-outline, #79747e));--_outline-width: var(--md-filter-chip-outline-width, 1px);--_selected-container-color: var(--md-filter-chip-selected-container-color, var(--md-sys-color-secondary-container, #e8def8));--_selected-outline-width: var(--md-filter-chip-selected-outline-width, 0px);--_focus-label-text-color: var(--md-filter-chip-focus-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-label-text-color: var(--md-filter-chip-hover-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-color: var(--md-filter-chip-hover-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-opacity: var(--md-filter-chip-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-filter-chip-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-label-text-color: var(--md-filter-chip-pressed-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-state-layer-color: var(--md-filter-chip-pressed-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_pressed-state-layer-opacity: var(--md-filter-chip-pressed-state-layer-opacity, 0.12);--_icon-size: var(--md-filter-chip-icon-size, 18px);--_disabled-leading-icon-color: var(--md-filter-chip-disabled-leading-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-leading-icon-opacity: var(--md-filter-chip-disabled-leading-icon-opacity, 0.38);--_selected-focus-leading-icon-color: var(--md-filter-chip-selected-focus-leading-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-leading-icon-color: var(--md-filter-chip-selected-hover-leading-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-leading-icon-color: var(--md-filter-chip-selected-leading-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-leading-icon-color: var(--md-filter-chip-selected-pressed-leading-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_focus-leading-icon-color: var(--md-filter-chip-focus-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-leading-icon-color: var(--md-filter-chip-hover-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_leading-icon-color: var(--md-filter-chip-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_pressed-leading-icon-color: var(--md-filter-chip-pressed-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_disabled-trailing-icon-color: var(--md-filter-chip-disabled-trailing-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-trailing-icon-opacity: var(--md-filter-chip-disabled-trailing-icon-opacity, 0.38);--_selected-focus-trailing-icon-color: var(--md-filter-chip-selected-focus-trailing-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-trailing-icon-color: var(--md-filter-chip-selected-hover-trailing-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-trailing-icon-color: var(--md-filter-chip-selected-pressed-trailing-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-trailing-icon-color: var(--md-filter-chip-selected-trailing-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_focus-trailing-icon-color: var(--md-filter-chip-focus-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-trailing-icon-color: var(--md-filter-chip-hover-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-trailing-icon-color: var(--md-filter-chip-pressed-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_trailing-icon-color: var(--md-filter-chip-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_container-shape-start-start: var(--md-filter-chip-container-shape-start-start, var(--md-filter-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-start-end: var(--md-filter-chip-container-shape-start-end, var(--md-filter-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-end-end: var(--md-filter-chip-container-shape-end-end, var(--md-filter-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-end-start: var(--md-filter-chip-container-shape-end-start, var(--md-filter-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_leading-space: var(--md-filter-chip-leading-space, 16px);--_trailing-space: var(--md-filter-chip-trailing-space, 16px);--_icon-label-space: var(--md-filter-chip-icon-label-space, 8px);--_with-leading-icon-leading-space: var(--md-filter-chip-with-leading-icon-leading-space, 8px);--_with-trailing-icon-trailing-space: var(--md-filter-chip-with-trailing-icon-trailing-space, 8px)}.selected.elevated::before{background:var(--_elevated-selected-container-color)}.checkmark{height:var(--_icon-size);width:var(--_icon-size)}.disabled .checkmark{opacity:var(--_disabled-leading-icon-opacity)}@media(forced-colors: active){.disabled .checkmark{opacity:1}}
`;
  var filter_styles_cssresult_default = styles16.styleSheet;

  // ../chips/internal/selectable-styles.cssresult.js
  var styles17 = i3`.selected{--md-ripple-hover-color: var(--_selected-hover-state-layer-color);--md-ripple-hover-opacity: var(--_selected-hover-state-layer-opacity);--md-ripple-pressed-color: var(--_selected-pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_selected-pressed-state-layer-opacity)}:where(.selected)::before{background:var(--_selected-container-color)}:where(.selected) .outline{border-width:var(--_selected-outline-width)}:where(.selected.disabled)::before{background:var(--_disabled-selected-container-color);opacity:var(--_disabled-selected-container-opacity)}:where(.selected) .label{color:var(--_selected-label-text-color)}:where(.selected:hover) .label{color:var(--_selected-hover-label-text-color)}:where(.selected:focus) .label{color:var(--_selected-focus-label-text-color)}:where(.selected:active) .label{color:var(--_selected-pressed-label-text-color)}:where(.selected) .leading.icon{color:var(--_selected-leading-icon-color)}:where(.selected:hover) .leading.icon{color:var(--_selected-hover-leading-icon-color)}:where(.selected:focus) .leading.icon{color:var(--_selected-focus-leading-icon-color)}:where(.selected:active) .leading.icon{color:var(--_selected-pressed-leading-icon-color)}@media(forced-colors: active){:where(.selected:not(.elevated))::before{border:1px solid CanvasText}:where(.selected) .outline{border-width:1px}}
`;
  var selectable_styles_cssresult_default = styles17.styleSheet;

  // ../chips/internal/trailing-icon-styles.cssresult.js
  var styles18 = i3`.trailing.action{align-items:center;justify-content:center;padding-inline-start:var(--_icon-label-space);padding-inline-end:var(--_with-trailing-icon-trailing-space)}.trailing.action :is(md-ripple,md-focus-ring){border-radius:50%;height:calc(1.3333333333*var(--_icon-size));width:calc(1.3333333333*var(--_icon-size))}.trailing.action md-focus-ring{inset:unset}.has-trailing .primary.action{padding-inline-end:0}.trailing.icon{color:var(--_trailing-icon-color);height:var(--_icon-size);width:var(--_icon-size)}:where(:hover) .trailing.icon{color:var(--_hover-trailing-icon-color)}:where(:focus) .trailing.icon{color:var(--_focus-trailing-icon-color)}:where(:active) .trailing.icon{color:var(--_pressed-trailing-icon-color)}:where(.disabled) .trailing.icon{color:var(--_disabled-trailing-icon-color);opacity:var(--_disabled-trailing-icon-opacity)}:where(.selected) .trailing.icon{color:var(--_selected-trailing-icon-color)}:where(.selected:hover) .trailing.icon{color:var(--_selected-hover-trailing-icon-color)}:where(.selected:focus) .trailing.icon{color:var(--_selected-focus-trailing-icon-color)}:where(.selected:active) .trailing.icon{color:var(--_selected-pressed-trailing-icon-color)}@media(forced-colors: active){.trailing.icon{color:ButtonText}:where(.disabled) .trailing.icon{color:GrayText;opacity:1}}
`;
  var trailing_icon_styles_cssresult_default = styles18.styleSheet;

  // ../chips/filter-chip.js
  var MdFilterChip = class MdFilterChip2 extends FilterChip {
  };
  MdFilterChip.styles = [
    styles14,
    styles13,
    styles18,
    styles17,
    styles16
  ];
  MdFilterChip = __decorate([
    e("md-filter-chip")
  ], MdFilterChip);

  // ../chips/internal/input-chip.js
  var InputChip = class extends MultiActionChip {
    constructor() {
      super(...arguments);
      this.avatar = false;
      this.href = "";
      this.target = "";
      this.rel = "";
      this.referrerPolicy = "";
      this.removeOnly = false;
      this.selected = false;
    }
    get primaryId() {
      if (this.href) {
        return "link";
      }
      if (this.removeOnly) {
        return "";
      }
      return "button";
    }
    get rippleDisabled() {
      return !this.href && (this.disabled || this.softDisabled);
    }
    get primaryAction() {
      if (this.removeOnly) {
        return null;
      }
      return this.renderRoot.querySelector(".primary.action");
    }
    getContainerClasses() {
      return {
        ...super.getContainerClasses(),
        avatar: this.avatar,
        // Link chips cannot be disabled
        disabled: !this.href && (this.disabled || this.softDisabled),
        link: !!this.href,
        selected: this.selected,
        "has-trailing": true
      };
    }
    renderPrimaryAction(content) {
      const { ariaLabel } = this;
      if (this.href) {
        return T`
        <a
          class="primary action"
          id="link"
          aria-label=${ariaLabel || A}
          href=${safeHref(this.href)}
          target=${this.target || A}
          rel=${this.rel || A}
          referrerpolicy=${this.referrerPolicy || A}
          >${content}</a
        >
      `;
      }
      if (this.removeOnly) {
        return T`
        <span class="primary action" aria-label=${ariaLabel || A}>
          ${content}
        </span>
      `;
      }
      return T`
      <button
        class="primary action"
        id="button"
        aria-label=${ariaLabel || A}
        aria-disabled=${this.softDisabled || A}
        ?disabled=${this.disabled && !this.alwaysFocusable}
        type="button"
        >${content}</button
      >
    `;
    }
    renderTrailingAction(focusListener) {
      return renderRemoveButton({
        focusListener,
        ariaLabel: this.ariaLabelRemove,
        disabled: !this.href && (this.disabled || this.softDisabled),
        tabbable: this.removeOnly
      });
    }
  };
  __decorate([
    n({ type: Boolean })
  ], InputChip.prototype, "avatar", void 0);
  __decorate([
    n()
  ], InputChip.prototype, "href", void 0);
  __decorate([
    n()
  ], InputChip.prototype, "target", void 0);
  __decorate([
    n()
  ], InputChip.prototype, "rel", void 0);
  __decorate([
    n()
  ], InputChip.prototype, "referrerPolicy", void 0);
  __decorate([
    n({ type: Boolean, attribute: "remove-only" })
  ], InputChip.prototype, "removeOnly", void 0);
  __decorate([
    n({ type: Boolean, reflect: true })
  ], InputChip.prototype, "selected", void 0);
  __decorate([
    i2(".trailing.action")
  ], InputChip.prototype, "trailingAction", void 0);

  // ../chips/internal/input-styles.cssresult.js
  var styles19 = i3`:host{--_container-height: var(--md-input-chip-container-height, 32px);--_disabled-label-text-color: var(--md-input-chip-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-input-chip-disabled-label-text-opacity, 0.38);--_disabled-selected-container-color: var(--md-input-chip-disabled-selected-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-selected-container-opacity: var(--md-input-chip-disabled-selected-container-opacity, 0.12);--_label-text-font: var(--md-input-chip-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-input-chip-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-input-chip-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-input-chip-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_selected-container-color: var(--md-input-chip-selected-container-color, var(--md-sys-color-secondary-container, #e8def8));--_selected-focus-label-text-color: var(--md-input-chip-selected-focus-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-label-text-color: var(--md-input-chip-selected-hover-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-state-layer-color: var(--md-input-chip-selected-hover-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-state-layer-opacity: var(--md-input-chip-selected-hover-state-layer-opacity, 0.08);--_selected-label-text-color: var(--md-input-chip-selected-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-outline-width: var(--md-input-chip-selected-outline-width, 0px);--_selected-pressed-label-text-color: var(--md-input-chip-selected-pressed-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-state-layer-color: var(--md-input-chip-selected-pressed-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-state-layer-opacity: var(--md-input-chip-selected-pressed-state-layer-opacity, 0.12);--_disabled-outline-color: var(--md-input-chip-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-opacity: var(--md-input-chip-disabled-outline-opacity, 0.12);--_focus-label-text-color: var(--md-input-chip-focus-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-outline-color: var(--md-input-chip-focus-outline-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-label-text-color: var(--md-input-chip-hover-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-color: var(--md-input-chip-hover-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-opacity: var(--md-input-chip-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-input-chip-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_outline-color: var(--md-input-chip-outline-color, var(--md-sys-color-outline, #79747e));--_outline-width: var(--md-input-chip-outline-width, 1px);--_pressed-label-text-color: var(--md-input-chip-pressed-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-state-layer-color: var(--md-input-chip-pressed-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-state-layer-opacity: var(--md-input-chip-pressed-state-layer-opacity, 0.12);--_avatar-shape: var(--md-input-chip-avatar-shape, var(--md-sys-shape-corner-full, 9999px));--_avatar-size: var(--md-input-chip-avatar-size, 24px);--_disabled-avatar-opacity: var(--md-input-chip-disabled-avatar-opacity, 0.38);--_disabled-leading-icon-color: var(--md-input-chip-disabled-leading-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-leading-icon-opacity: var(--md-input-chip-disabled-leading-icon-opacity, 0.38);--_icon-size: var(--md-input-chip-icon-size, 18px);--_selected-focus-leading-icon-color: var(--md-input-chip-selected-focus-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-hover-leading-icon-color: var(--md-input-chip-selected-hover-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-leading-icon-color: var(--md-input-chip-selected-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-pressed-leading-icon-color: var(--md-input-chip-selected-pressed-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_focus-leading-icon-color: var(--md-input-chip-focus-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-leading-icon-color: var(--md-input-chip-hover-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_leading-icon-color: var(--md-input-chip-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_pressed-leading-icon-color: var(--md-input-chip-pressed-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_disabled-trailing-icon-color: var(--md-input-chip-disabled-trailing-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-trailing-icon-opacity: var(--md-input-chip-disabled-trailing-icon-opacity, 0.38);--_selected-focus-trailing-icon-color: var(--md-input-chip-selected-focus-trailing-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-trailing-icon-color: var(--md-input-chip-selected-hover-trailing-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-trailing-icon-color: var(--md-input-chip-selected-pressed-trailing-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-trailing-icon-color: var(--md-input-chip-selected-trailing-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_focus-trailing-icon-color: var(--md-input-chip-focus-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-trailing-icon-color: var(--md-input-chip-hover-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-trailing-icon-color: var(--md-input-chip-pressed-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_trailing-icon-color: var(--md-input-chip-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_container-shape-start-start: var(--md-input-chip-container-shape-start-start, var(--md-input-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-start-end: var(--md-input-chip-container-shape-start-end, var(--md-input-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-end-end: var(--md-input-chip-container-shape-end-end, var(--md-input-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-end-start: var(--md-input-chip-container-shape-end-start, var(--md-input-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_leading-space: var(--md-input-chip-leading-space, 16px);--_trailing-space: var(--md-input-chip-trailing-space, 16px);--_icon-label-space: var(--md-input-chip-icon-label-space, 8px);--_with-leading-icon-leading-space: var(--md-input-chip-with-leading-icon-leading-space, 8px);--_with-trailing-icon-trailing-space: var(--md-input-chip-with-trailing-icon-trailing-space, 8px)}:host([avatar]){--_container-shape-start-start: var( --md-input-chip-container-shape-start-start, var(--md-input-chip-container-shape, calc(var(--_container-height) / 2)) );--_container-shape-start-end: var( --md-input-chip-container-shape-start-end, var(--md-input-chip-container-shape, calc(var(--_container-height) / 2)) );--_container-shape-end-end: var( --md-input-chip-container-shape-end-end, var(--md-input-chip-container-shape, calc(var(--_container-height) / 2)) );--_container-shape-end-start: var( --md-input-chip-container-shape-end-start, var(--md-input-chip-container-shape, calc(var(--_container-height) / 2)) )}.avatar .primary.action{padding-inline-start:4px}.avatar .leading.icon ::slotted(:first-child){border-radius:var(--_avatar-shape);height:var(--_avatar-size);width:var(--_avatar-size)}.disabled.avatar .leading.icon{opacity:var(--_disabled-avatar-opacity)}@media(forced-colors: active){.link .outline{border-color:ActiveText}.disabled.avatar .leading.icon{opacity:1}}
`;
  var input_styles_cssresult_default = styles19.styleSheet;

  // ../chips/input-chip.js
  var MdInputChip = class MdInputChip2 extends InputChip {
  };
  MdInputChip.styles = [
    styles14,
    styles18,
    styles17,
    styles19
  ];
  MdInputChip = __decorate([
    e("md-input-chip")
  ], MdInputChip);

  // ../chips/internal/suggestion-chip.js
  var SuggestionChip = class extends AssistChip {
  };

  // ../chips/internal/suggestion-styles.cssresult.js
  var styles20 = i3`:host{--_container-height: var(--md-suggestion-chip-container-height, 32px);--_disabled-label-text-color: var(--md-suggestion-chip-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-suggestion-chip-disabled-label-text-opacity, 0.38);--_elevated-container-color: var(--md-suggestion-chip-elevated-container-color, var(--md-sys-color-surface-container-low, #f7f2fa));--_elevated-container-elevation: var(--md-suggestion-chip-elevated-container-elevation, 1);--_elevated-container-shadow-color: var(--md-suggestion-chip-elevated-container-shadow-color, var(--md-sys-color-shadow, #000));--_elevated-disabled-container-color: var(--md-suggestion-chip-elevated-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_elevated-disabled-container-elevation: var(--md-suggestion-chip-elevated-disabled-container-elevation, 0);--_elevated-disabled-container-opacity: var(--md-suggestion-chip-elevated-disabled-container-opacity, 0.12);--_elevated-focus-container-elevation: var(--md-suggestion-chip-elevated-focus-container-elevation, 1);--_elevated-hover-container-elevation: var(--md-suggestion-chip-elevated-hover-container-elevation, 2);--_elevated-pressed-container-elevation: var(--md-suggestion-chip-elevated-pressed-container-elevation, 1);--_focus-label-text-color: var(--md-suggestion-chip-focus-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-label-text-color: var(--md-suggestion-chip-hover-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-color: var(--md-suggestion-chip-hover-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-opacity: var(--md-suggestion-chip-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-suggestion-chip-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-font: var(--md-suggestion-chip-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-suggestion-chip-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-suggestion-chip-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-suggestion-chip-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_pressed-label-text-color: var(--md-suggestion-chip-pressed-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-state-layer-color: var(--md-suggestion-chip-pressed-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-state-layer-opacity: var(--md-suggestion-chip-pressed-state-layer-opacity, 0.12);--_disabled-outline-color: var(--md-suggestion-chip-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-opacity: var(--md-suggestion-chip-disabled-outline-opacity, 0.12);--_focus-outline-color: var(--md-suggestion-chip-focus-outline-color, var(--md-sys-color-on-surface-variant, #49454f));--_outline-color: var(--md-suggestion-chip-outline-color, var(--md-sys-color-outline, #79747e));--_outline-width: var(--md-suggestion-chip-outline-width, 1px);--_disabled-leading-icon-color: var(--md-suggestion-chip-disabled-leading-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-leading-icon-opacity: var(--md-suggestion-chip-disabled-leading-icon-opacity, 0.38);--_focus-leading-icon-color: var(--md-suggestion-chip-focus-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-leading-icon-color: var(--md-suggestion-chip-hover-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_leading-icon-color: var(--md-suggestion-chip-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_pressed-leading-icon-color: var(--md-suggestion-chip-pressed-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-size: var(--md-suggestion-chip-icon-size, 18px);--_container-shape-start-start: var(--md-suggestion-chip-container-shape-start-start, var(--md-suggestion-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-start-end: var(--md-suggestion-chip-container-shape-start-end, var(--md-suggestion-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-end-end: var(--md-suggestion-chip-container-shape-end-end, var(--md-suggestion-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-end-start: var(--md-suggestion-chip-container-shape-end-start, var(--md-suggestion-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_leading-space: var(--md-suggestion-chip-leading-space, 16px);--_trailing-space: var(--md-suggestion-chip-trailing-space, 16px);--_icon-label-space: var(--md-suggestion-chip-icon-label-space, 8px);--_with-leading-icon-leading-space: var(--md-suggestion-chip-with-leading-icon-leading-space, 8px)}@media(forced-colors: active){.link .outline{border-color:ActiveText}}
`;
  var suggestion_styles_cssresult_default = styles20.styleSheet;

  // ../chips/suggestion-chip.js
  var MdSuggestionChip = class MdSuggestionChip2 extends SuggestionChip {
  };
  MdSuggestionChip.styles = [
    styles14,
    styles13,
    styles20
  ];
  MdSuggestionChip = __decorate([
    e("md-suggestion-chip")
  ], MdSuggestionChip);

  // ../divider/internal/divider.js
  var Divider = class extends s3 {
    constructor() {
      super(...arguments);
      this.inset = false;
      this.insetStart = false;
      this.insetEnd = false;
    }
  };
  __decorate([
    n({ type: Boolean, reflect: true })
  ], Divider.prototype, "inset", void 0);
  __decorate([
    n({ type: Boolean, reflect: true, attribute: "inset-start" })
  ], Divider.prototype, "insetStart", void 0);
  __decorate([
    n({ type: Boolean, reflect: true, attribute: "inset-end" })
  ], Divider.prototype, "insetEnd", void 0);

  // ../divider/internal/divider-styles.cssresult.js
  var styles21 = i3`:host{box-sizing:border-box;color:var(--md-divider-color, var(--md-sys-color-outline-variant, #cac4d0));display:flex;height:var(--md-divider-thickness, 1px);width:100%}:host([inset]),:host([inset-start]){padding-inline-start:16px}:host([inset]),:host([inset-end]){padding-inline-end:16px}:host::before{background:currentColor;content:"";height:100%;width:100%}@media(forced-colors: active){:host::before{background:CanvasText}}
`;
  var divider_styles_cssresult_default = styles21.styleSheet;

  // ../divider/divider.js
  var MdDivider = class MdDivider2 extends Divider {
  };
  MdDivider.styles = [styles21];
  MdDivider = __decorate([
    e("md-divider")
  ], MdDivider);

  // ../dialog/internal/animations.js
  var DIALOG_DEFAULT_OPEN_ANIMATION = {
    dialog: [
      [
        // Dialog slide down
        [{ "transform": "translateY(-50px)" }, { "transform": "translateY(0)" }],
        { duration: 500, easing: EASING.EMPHASIZED }
      ]
    ],
    scrim: [
      [
        // Scrim fade in
        [{ "opacity": 0 }, { "opacity": 0.32 }],
        { duration: 500, easing: "linear" }
      ]
    ],
    container: [
      [
        // Container fade in
        [{ "opacity": 0 }, { "opacity": 1 }],
        { duration: 50, easing: "linear", pseudoElement: "::before" }
      ],
      [
        // Container grow
        // Note: current spec says to grow from 0dp->100% and shrink from
        // 100%->35%. We change this to 35%->100% to simplify the animation that
        // is supposed to clip content as it grows. From 0dp it's possible to see
        // text/actions appear before the container has fully grown.
        [{ "height": "35%" }, { "height": "100%" }],
        { duration: 500, easing: EASING.EMPHASIZED, pseudoElement: "::before" }
      ]
    ],
    headline: [
      [
        // Headline fade in
        [{ "opacity": 0 }, { "opacity": 0, offset: 0.2 }, { "opacity": 1 }],
        { duration: 250, easing: "linear", fill: "forwards" }
      ]
    ],
    content: [
      [
        // Content fade in
        [{ "opacity": 0 }, { "opacity": 0, offset: 0.2 }, { "opacity": 1 }],
        { duration: 250, easing: "linear", fill: "forwards" }
      ]
    ],
    actions: [
      [
        // Actions fade in
        [{ "opacity": 0 }, { "opacity": 0, offset: 0.5 }, { "opacity": 1 }],
        { duration: 300, easing: "linear", fill: "forwards" }
      ]
    ]
  };
  var DIALOG_DEFAULT_CLOSE_ANIMATION = {
    dialog: [
      [
        // Dialog slide up
        [{ "transform": "translateY(0)" }, { "transform": "translateY(-50px)" }],
        { duration: 150, easing: EASING.EMPHASIZED_ACCELERATE }
      ]
    ],
    scrim: [
      [
        // Scrim fade out
        [{ "opacity": 0.32 }, { "opacity": 0 }],
        { duration: 150, easing: "linear" }
      ]
    ],
    container: [
      [
        // Container shrink
        [{ "height": "100%" }, { "height": "35%" }],
        {
          duration: 150,
          easing: EASING.EMPHASIZED_ACCELERATE,
          pseudoElement: "::before"
        }
      ],
      [
        // Container fade out
        [{ "opacity": "1" }, { "opacity": "0" }],
        { delay: 100, duration: 50, easing: "linear", pseudoElement: "::before" }
      ]
    ],
    headline: [
      [
        // Headline fade out
        [{ "opacity": 1 }, { "opacity": 0 }],
        { duration: 100, easing: "linear", fill: "forwards" }
      ]
    ],
    content: [
      [
        // Content fade out
        [{ "opacity": 1 }, { "opacity": 0 }],
        { duration: 100, easing: "linear", fill: "forwards" }
      ]
    ],
    actions: [
      [
        // Actions fade out
        [{ "opacity": 1 }, { "opacity": 0 }],
        { duration: 100, easing: "linear", fill: "forwards" }
      ]
    ]
  };

  // ../dialog/internal/dialog.js
  var dialogBaseClass = mixinDelegatesAria(s3);
  var Dialog = class extends dialogBaseClass {
    // We do not use `delegatesFocus: true` due to a Chromium bug with
    // selecting text.
    // See https://bugs.chromium.org/p/chromium/issues/detail?id=950357
    /**
     * Opens the dialog when set to `true` and closes it when set to `false`.
     */
    get open() {
      return this.isOpen;
    }
    set open(open) {
      if (open === this.isOpen) {
        return;
      }
      this.isOpen = open;
      if (open) {
        this.setAttribute("open", "");
        this.show();
      } else {
        this.removeAttribute("open");
        this.close();
      }
    }
    constructor() {
      super();
      this.quick = false;
      this.returnValue = "";
      this.noFocusTrap = false;
      this.getOpenAnimation = () => DIALOG_DEFAULT_OPEN_ANIMATION;
      this.getCloseAnimation = () => DIALOG_DEFAULT_CLOSE_ANIMATION;
      this.isOpen = false;
      this.isOpening = false;
      this.isConnectedPromise = this.getIsConnectedPromise();
      this.isAtScrollTop = false;
      this.isAtScrollBottom = false;
      this.nextClickIsFromContent = false;
      this.hasHeadline = false;
      this.hasActions = false;
      this.hasIcon = false;
      this.escapePressedWithoutCancel = false;
      this.treewalker = o7 ? null : document.createTreeWalker(this, NodeFilter.SHOW_ELEMENT);
      if (!o7) {
        this.addEventListener("submit", this.handleSubmit);
      }
    }
    /**
     * Opens the dialog and fires a cancelable `open` event. After a dialog's
     * animation, an `opened` event is fired.
     *
     * Add an `autofocus` attribute to a child of the dialog that should
     * receive focus after opening.
     *
     * @return A Promise that resolves after the animation is finished and the
     *     `opened` event was fired.
     */
    async show() {
      this.isOpening = true;
      await this.isConnectedPromise;
      await this.updateComplete;
      const dialog = this.dialog;
      if (dialog.open || !this.isOpening) {
        this.isOpening = false;
        return;
      }
      const preventOpen = !this.dispatchEvent(new Event("open", { cancelable: true }));
      if (preventOpen) {
        this.open = false;
        this.isOpening = false;
        return;
      }
      dialog.showModal();
      this.open = true;
      if (this.scroller) {
        this.scroller.scrollTop = 0;
      }
      this.querySelector("[autofocus]")?.focus();
      await this.animateDialog(this.getOpenAnimation());
      this.dispatchEvent(new Event("opened"));
      this.isOpening = false;
    }
    /**
     * Closes the dialog and fires a cancelable `close` event. After a dialog's
     * animation, a `closed` event is fired.
     *
     * @param returnValue A return value usually indicating which button was used
     *     to close a dialog. If a dialog is canceled by clicking the scrim or
     *     pressing Escape, it will not change the return value after closing.
     * @return A Promise that resolves after the animation is finished and the
     *     `closed` event was fired.
     */
    async close(returnValue = this.returnValue) {
      this.isOpening = false;
      if (!this.isConnected) {
        this.open = false;
        return;
      }
      await this.updateComplete;
      const dialog = this.dialog;
      if (!dialog.open || this.isOpening) {
        this.open = false;
        return;
      }
      const prevReturnValue = this.returnValue;
      this.returnValue = returnValue;
      const preventClose = !this.dispatchEvent(new Event("close", { cancelable: true }));
      if (preventClose) {
        this.returnValue = prevReturnValue;
        return;
      }
      await this.animateDialog(this.getCloseAnimation());
      dialog.close(returnValue);
      this.open = false;
      this.dispatchEvent(new Event("closed"));
    }
    connectedCallback() {
      super.connectedCallback();
      this.isConnectedPromiseResolve();
    }
    disconnectedCallback() {
      super.disconnectedCallback();
      this.isConnectedPromise = this.getIsConnectedPromise();
    }
    render() {
      const scrollable = this.open && !(this.isAtScrollTop && this.isAtScrollBottom);
      const classes = {
        "has-headline": this.hasHeadline,
        "has-actions": this.hasActions,
        "has-icon": this.hasIcon,
        "scrollable": scrollable,
        "show-top-divider": scrollable && !this.isAtScrollTop,
        "show-bottom-divider": scrollable && !this.isAtScrollBottom
      };
      const showFocusTrap = this.open && !this.noFocusTrap;
      const focusTrap = T`
      <div
        class="focus-trap"
        tabindex="0"
        aria-hidden="true"
        @focus=${this.handleFocusTrapFocus}></div>
    `;
      const { ariaLabel } = this;
      return T`
      <div class="scrim"></div>
      <dialog
        class=${o8(classes)}
        aria-label=${ariaLabel || A}
        aria-labelledby=${this.hasHeadline ? "headline" : A}
        role=${this.type === "alert" ? "alertdialog" : A}
        @cancel=${this.handleCancel}
        @click=${this.handleDialogClick}
        @close=${this.handleClose}
        @keydown=${this.handleKeydown}
        .returnValue=${this.returnValue || A}>
        ${showFocusTrap ? focusTrap : A}
        <div class="container" @click=${this.handleContentClick}>
          <div class="headline">
            <div class="icon" aria-hidden="true">
              <slot name="icon" @slotchange=${this.handleIconChange}></slot>
            </div>
            <h2 id="headline" aria-hidden=${!this.hasHeadline || A}>
              <slot
                name="headline"
                @slotchange=${this.handleHeadlineChange}></slot>
            </h2>
            <md-divider></md-divider>
          </div>
          <div class="scroller">
            <div class="content">
              <div class="top anchor"></div>
              <slot name="content"></slot>
              <div class="bottom anchor"></div>
            </div>
          </div>
          <div class="actions">
            <md-divider></md-divider>
            <slot name="actions" @slotchange=${this.handleActionsChange}></slot>
          </div>
        </div>
        ${showFocusTrap ? focusTrap : A}
      </dialog>
    `;
    }
    firstUpdated() {
      this.intersectionObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          this.handleAnchorIntersection(entry);
        }
      }, { root: this.scroller });
      this.intersectionObserver.observe(this.topAnchor);
      this.intersectionObserver.observe(this.bottomAnchor);
    }
    handleDialogClick() {
      if (this.nextClickIsFromContent) {
        this.nextClickIsFromContent = false;
        return;
      }
      const preventDefault = !this.dispatchEvent(new Event("cancel", { cancelable: true }));
      if (preventDefault) {
        return;
      }
      this.close();
    }
    handleContentClick() {
      this.nextClickIsFromContent = true;
    }
    handleSubmit(event) {
      const form = event.target;
      const { submitter } = event;
      if (form.getAttribute("method") !== "dialog" || !submitter) {
        return;
      }
      this.close(submitter.getAttribute("value") ?? this.returnValue);
    }
    handleCancel(event) {
      if (event.target !== this.dialog) {
        return;
      }
      this.escapePressedWithoutCancel = false;
      const preventDefault = !redispatchEvent(this, event);
      event.preventDefault();
      if (preventDefault) {
        return;
      }
      this.close();
    }
    handleClose() {
      if (!this.escapePressedWithoutCancel) {
        return;
      }
      this.escapePressedWithoutCancel = false;
      this.dialog?.dispatchEvent(new Event("cancel", { cancelable: true }));
    }
    handleKeydown(event) {
      if (event.key !== "Escape") {
        return;
      }
      this.escapePressedWithoutCancel = true;
      setTimeout(() => {
        this.escapePressedWithoutCancel = false;
      });
    }
    async animateDialog(animation) {
      this.cancelAnimations?.abort();
      this.cancelAnimations = new AbortController();
      if (this.quick) {
        return;
      }
      const { dialog, scrim, container, headline, content, actions } = this;
      if (!dialog || !scrim || !container || !headline || !content || !actions) {
        return;
      }
      const { container: containerAnimate, dialog: dialogAnimate, scrim: scrimAnimate, headline: headlineAnimate, content: contentAnimate, actions: actionsAnimate } = animation;
      const elementAndAnimation = [
        [dialog, dialogAnimate ?? []],
        [scrim, scrimAnimate ?? []],
        [container, containerAnimate ?? []],
        [headline, headlineAnimate ?? []],
        [content, contentAnimate ?? []],
        [actions, actionsAnimate ?? []]
      ];
      const animations = [];
      for (const [element, animation2] of elementAndAnimation) {
        for (const animateArgs of animation2) {
          const animation3 = element.animate(...animateArgs);
          this.cancelAnimations.signal.addEventListener("abort", () => {
            animation3.cancel();
          });
          animations.push(animation3);
        }
      }
      await Promise.all(animations.map((animation2) => animation2.finished.catch(() => {
      })));
    }
    handleHeadlineChange(event) {
      const slot = event.target;
      this.hasHeadline = slot.assignedElements().length > 0;
    }
    handleActionsChange(event) {
      const slot = event.target;
      this.hasActions = slot.assignedElements().length > 0;
    }
    handleIconChange(event) {
      const slot = event.target;
      this.hasIcon = slot.assignedElements().length > 0;
    }
    handleAnchorIntersection(entry) {
      const { target, isIntersecting } = entry;
      if (target === this.topAnchor) {
        this.isAtScrollTop = isIntersecting;
      }
      if (target === this.bottomAnchor) {
        this.isAtScrollBottom = isIntersecting;
      }
    }
    getIsConnectedPromise() {
      return new Promise((resolve) => {
        this.isConnectedPromiseResolve = resolve;
      });
    }
    handleFocusTrapFocus(event) {
      const [firstFocusableChild, lastFocusableChild] = this.getFirstAndLastFocusableChildren();
      if (!firstFocusableChild || !lastFocusableChild) {
        this.dialog?.focus();
        return;
      }
      const isFirstFocusTrap = event.target === this.firstFocusTrap;
      const isLastFocusTrap = !isFirstFocusTrap;
      const focusCameFromFirstChild = event.relatedTarget === firstFocusableChild;
      const focusCameFromLastChild = event.relatedTarget === lastFocusableChild;
      const focusCameFromOutsideDialog = !focusCameFromFirstChild && !focusCameFromLastChild;
      const shouldFocusFirstChild = isLastFocusTrap && focusCameFromLastChild || isFirstFocusTrap && focusCameFromOutsideDialog;
      if (shouldFocusFirstChild) {
        firstFocusableChild.focus();
        return;
      }
      const shouldFocusLastChild = isFirstFocusTrap && focusCameFromFirstChild || isLastFocusTrap && focusCameFromOutsideDialog;
      if (shouldFocusLastChild) {
        lastFocusableChild.focus();
        return;
      }
    }
    getFirstAndLastFocusableChildren() {
      if (!this.treewalker) {
        return [null, null];
      }
      let firstFocusableChild = null;
      let lastFocusableChild = null;
      this.treewalker.currentNode = this.treewalker.root;
      while (this.treewalker.nextNode()) {
        const nextChild = this.treewalker.currentNode;
        if (!isFocusable(nextChild)) {
          continue;
        }
        if (!firstFocusableChild) {
          firstFocusableChild = nextChild;
        }
        lastFocusableChild = nextChild;
      }
      return [firstFocusableChild, lastFocusableChild];
    }
  };
  __decorate([
    n({ type: Boolean })
  ], Dialog.prototype, "open", null);
  __decorate([
    n({ type: Boolean })
  ], Dialog.prototype, "quick", void 0);
  __decorate([
    n({ attribute: false })
  ], Dialog.prototype, "returnValue", void 0);
  __decorate([
    n()
  ], Dialog.prototype, "type", void 0);
  __decorate([
    n({ type: Boolean, attribute: "no-focus-trap" })
  ], Dialog.prototype, "noFocusTrap", void 0);
  __decorate([
    i2("dialog")
  ], Dialog.prototype, "dialog", void 0);
  __decorate([
    i2(".scrim")
  ], Dialog.prototype, "scrim", void 0);
  __decorate([
    i2(".container")
  ], Dialog.prototype, "container", void 0);
  __decorate([
    i2(".headline")
  ], Dialog.prototype, "headline", void 0);
  __decorate([
    i2(".content")
  ], Dialog.prototype, "content", void 0);
  __decorate([
    i2(".actions")
  ], Dialog.prototype, "actions", void 0);
  __decorate([
    t()
  ], Dialog.prototype, "isAtScrollTop", void 0);
  __decorate([
    t()
  ], Dialog.prototype, "isAtScrollBottom", void 0);
  __decorate([
    i2(".scroller")
  ], Dialog.prototype, "scroller", void 0);
  __decorate([
    i2(".top.anchor")
  ], Dialog.prototype, "topAnchor", void 0);
  __decorate([
    i2(".bottom.anchor")
  ], Dialog.prototype, "bottomAnchor", void 0);
  __decorate([
    i2(".focus-trap")
  ], Dialog.prototype, "firstFocusTrap", void 0);
  __decorate([
    t()
  ], Dialog.prototype, "hasHeadline", void 0);
  __decorate([
    t()
  ], Dialog.prototype, "hasActions", void 0);
  __decorate([
    t()
  ], Dialog.prototype, "hasIcon", void 0);
  function isFocusable(element) {
    const knownFocusableElements = ":is(button,input,select,textarea,object,:is(a,area)[href],[tabindex],[contenteditable=true])";
    const notDisabled = ":not(:disabled,[disabled])";
    const notNegativeTabIndex = ':not([tabindex^="-"])';
    if (element.matches(knownFocusableElements + notDisabled + notNegativeTabIndex)) {
      return true;
    }
    const isCustomElement = element.localName.includes("-");
    if (!isCustomElement) {
      return false;
    }
    if (!element.matches(notDisabled)) {
      return false;
    }
    return element.shadowRoot?.delegatesFocus ?? false;
  }

  // ../dialog/internal/dialog-styles.cssresult.js
  var styles22 = i3`:host{border-start-start-radius:var(--md-dialog-container-shape-start-start, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));border-start-end-radius:var(--md-dialog-container-shape-start-end, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));border-end-end-radius:var(--md-dialog-container-shape-end-end, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));border-end-start-radius:var(--md-dialog-container-shape-end-start, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));display:contents;margin:auto;max-height:min(560px,100% - 48px);max-width:min(560px,100% - 48px);min-height:140px;min-width:280px;position:fixed;height:fit-content;width:fit-content}dialog{background:rgba(0,0,0,0);border:none;border-radius:inherit;flex-direction:column;height:inherit;margin:inherit;max-height:inherit;max-width:inherit;min-height:inherit;min-width:inherit;outline:none;overflow:visible;padding:0;width:inherit}dialog[open]{display:flex}::backdrop{background:none}.scrim{background:var(--md-sys-color-scrim, #000);display:none;inset:0;opacity:32%;pointer-events:none;position:fixed;z-index:1}:host([open]) .scrim{display:flex}h2{all:unset;align-self:stretch}.headline{align-items:center;color:var(--md-dialog-headline-color, var(--md-sys-color-on-surface, #1d1b20));display:flex;flex-direction:column;font-family:var(--md-dialog-headline-font, var(--md-sys-typescale-headline-small-font, var(--md-ref-typeface-brand, Roboto)));font-size:var(--md-dialog-headline-size, var(--md-sys-typescale-headline-small-size, 1.5rem));line-height:var(--md-dialog-headline-line-height, var(--md-sys-typescale-headline-small-line-height, 2rem));font-weight:var(--md-dialog-headline-weight, var(--md-sys-typescale-headline-small-weight, var(--md-ref-typeface-weight-regular, 400)));position:relative}slot[name=headline]::slotted(*){align-items:center;align-self:stretch;box-sizing:border-box;display:flex;gap:8px;padding:24px 24px 0}.icon{display:flex}slot[name=icon]::slotted(*){color:var(--md-dialog-icon-color, var(--md-sys-color-secondary, #625b71));fill:currentColor;font-size:var(--md-dialog-icon-size, 24px);margin-top:24px;height:var(--md-dialog-icon-size, 24px);width:var(--md-dialog-icon-size, 24px)}.has-icon slot[name=headline]::slotted(*){justify-content:center;padding-top:16px}.scrollable slot[name=headline]::slotted(*){padding-bottom:16px}.scrollable.has-headline slot[name=content]::slotted(*){padding-top:8px}.container{border-radius:inherit;display:flex;flex-direction:column;flex-grow:1;overflow:hidden;position:relative;transform-origin:top}.container::before{background:var(--md-dialog-container-color, var(--md-sys-color-surface-container-high, #ece6f0));border-radius:inherit;content:"";inset:0;position:absolute}.scroller{display:flex;flex:1;flex-direction:column;overflow:hidden;z-index:1}.scrollable .scroller{overflow-y:scroll}.content{color:var(--md-dialog-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-dialog-supporting-text-font, var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-dialog-supporting-text-size, var(--md-sys-typescale-body-medium-size, 0.875rem));line-height:var(--md-dialog-supporting-text-line-height, var(--md-sys-typescale-body-medium-line-height, 1.25rem));flex:1;font-weight:var(--md-dialog-supporting-text-weight, var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400)));height:min-content;position:relative}slot[name=content]::slotted(*){box-sizing:border-box;padding:24px}.anchor{position:absolute}.top.anchor{top:0}.bottom.anchor{bottom:0}.actions{position:relative}slot[name=actions]::slotted(*){box-sizing:border-box;display:flex;gap:8px;justify-content:flex-end;padding:16px 24px 24px}.has-actions slot[name=content]::slotted(*){padding-bottom:8px}md-divider{display:none;position:absolute}.has-headline.show-top-divider .headline md-divider,.has-actions.show-bottom-divider .actions md-divider{display:flex}.headline md-divider{bottom:0}.actions md-divider{top:0}@media(forced-colors: active){dialog{outline:2px solid WindowText}}
`;
  var dialog_styles_cssresult_default = styles22.styleSheet;

  // ../dialog/dialog.js
  var MdDialog = class MdDialog2 extends Dialog {
  };
  MdDialog.styles = [styles22];
  MdDialog = __decorate([
    e("md-dialog")
  ], MdDialog);

  // ../fab/internal/shared.js
  var fabBaseClass = mixinDelegatesAria(s3);
  var SharedFab = class extends fabBaseClass {
    constructor() {
      super(...arguments);
      this.size = "medium";
      this.label = "";
      this.lowered = false;
    }
    render() {
      const { ariaLabel } = this;
      return T`
      <button
        class="fab ${o8(this.getRenderClasses())}"
        aria-label=${ariaLabel || A}>
        <md-elevation part="elevation"></md-elevation>
        <md-focus-ring part="focus-ring"></md-focus-ring>
        <md-ripple class="ripple"></md-ripple>
        ${this.renderTouchTarget()} ${this.renderIcon()} ${this.renderLabel()}
      </button>
    `;
    }
    getRenderClasses() {
      const isExtended = !!this.label;
      return {
        "lowered": this.lowered,
        "small": this.size === "small" && !isExtended,
        "large": this.size === "large" && !isExtended,
        "extended": isExtended
      };
    }
    renderTouchTarget() {
      return T`<div class="touch-target"></div>`;
    }
    renderLabel() {
      return this.label ? T`<span class="label">${this.label}</span>` : "";
    }
    renderIcon() {
      const { ariaLabel } = this;
      return T`<span class="icon">
      <slot
        name="icon"
        aria-hidden=${ariaLabel || this.label ? "true" : A}>
        <span></span>
      </slot>
    </span>`;
    }
  };
  SharedFab.shadowRootOptions = {
    mode: "open",
    delegatesFocus: true
  };
  __decorate([
    n({ reflect: true })
  ], SharedFab.prototype, "size", void 0);
  __decorate([
    n()
  ], SharedFab.prototype, "label", void 0);
  __decorate([
    n({ type: Boolean })
  ], SharedFab.prototype, "lowered", void 0);

  // ../fab/internal/fab.js
  var Fab = class extends SharedFab {
    constructor() {
      super(...arguments);
      this.variant = "surface";
    }
    getRenderClasses() {
      return {
        ...super.getRenderClasses(),
        "primary": this.variant === "primary",
        "secondary": this.variant === "secondary",
        "tertiary": this.variant === "tertiary"
      };
    }
  };
  __decorate([
    n()
  ], Fab.prototype, "variant", void 0);

  // ../fab/internal/fab-branded-styles.cssresult.js
  var styles23 = i3`:host{--_container-color: var(--md-fab-branded-container-color, var(--md-sys-color-surface-container-high, #ece6f0));--_container-elevation: var(--md-fab-branded-container-elevation, 3);--_container-height: var(--md-fab-branded-container-height, 56px);--_container-shadow-color: var(--md-fab-branded-container-shadow-color, var(--md-sys-color-shadow, #000));--_container-width: var(--md-fab-branded-container-width, 56px);--_focus-container-elevation: var(--md-fab-branded-focus-container-elevation, 3);--_hover-container-elevation: var(--md-fab-branded-hover-container-elevation, 4);--_hover-state-layer-color: var(--md-fab-branded-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-opacity: var(--md-fab-branded-hover-state-layer-opacity, 0.08);--_icon-size: var(--md-fab-branded-icon-size, 36px);--_lowered-container-color: var(--md-fab-branded-lowered-container-color, var(--md-sys-color-surface-container-low, #f7f2fa));--_lowered-container-elevation: var(--md-fab-branded-lowered-container-elevation, 1);--_lowered-focus-container-elevation: var(--md-fab-branded-lowered-focus-container-elevation, 1);--_lowered-hover-container-elevation: var(--md-fab-branded-lowered-hover-container-elevation, 2);--_lowered-pressed-container-elevation: var(--md-fab-branded-lowered-pressed-container-elevation, 1);--_pressed-container-elevation: var(--md-fab-branded-pressed-container-elevation, 3);--_pressed-state-layer-color: var(--md-fab-branded-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-opacity: var(--md-fab-branded-pressed-state-layer-opacity, 0.12);--_focus-label-text-color: var(--md-fab-branded-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-label-text-color: var(--md-fab-branded-hover-label-text-color, var(--md-sys-color-primary, #6750a4));--_label-text-color: var(--md-fab-branded-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_label-text-font: var(--md-fab-branded-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-size: var(--md-fab-branded-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-line-height: var(--md-fab-branded-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-weight: var(--md-fab-branded-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_large-container-height: var(--md-fab-branded-large-container-height, 96px);--_large-container-width: var(--md-fab-branded-large-container-width, 96px);--_large-icon-size: var(--md-fab-branded-large-icon-size, 48px);--_pressed-label-text-color: var(--md-fab-branded-pressed-label-text-color, var(--md-sys-color-primary, #6750a4));--_container-shape-start-start: var(--md-fab-branded-container-shape-start-start, var(--md-fab-branded-container-shape, var(--md-sys-shape-corner-large, 16px)));--_container-shape-start-end: var(--md-fab-branded-container-shape-start-end, var(--md-fab-branded-container-shape, var(--md-sys-shape-corner-large, 16px)));--_container-shape-end-end: var(--md-fab-branded-container-shape-end-end, var(--md-fab-branded-container-shape, var(--md-sys-shape-corner-large, 16px)));--_container-shape-end-start: var(--md-fab-branded-container-shape-end-start, var(--md-fab-branded-container-shape, var(--md-sys-shape-corner-large, 16px)));--_large-container-shape-start-start: var(--md-fab-branded-large-container-shape-start-start, var(--md-fab-branded-large-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));--_large-container-shape-start-end: var(--md-fab-branded-large-container-shape-start-end, var(--md-fab-branded-large-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));--_large-container-shape-end-end: var(--md-fab-branded-large-container-shape-end-end, var(--md-fab-branded-large-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));--_large-container-shape-end-start: var(--md-fab-branded-large-container-shape-end-start, var(--md-fab-branded-large-container-shape, var(--md-sys-shape-corner-extra-large, 28px)))}
`;
  var fab_branded_styles_cssresult_default = styles23.styleSheet;

  // ../fab/internal/forced-colors-styles.cssresult.js
  var styles24 = i3`@media(forced-colors: active){.fab{border:1px solid ButtonText}.fab.extended{padding-inline-start:15px;padding-inline-end:19px}md-focus-ring{--md-focus-ring-outward-offset: 3px}}
`;
  var forced_colors_styles_cssresult_default = styles24.styleSheet;

  // ../fab/internal/shared-styles.cssresult.js
  var styles25 = i3`:host{--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity);display:inline-flex;-webkit-tap-highlight-color:rgba(0,0,0,0)}:host([size=medium][touch-target=wrapper]){margin:max(0px,48px - var(--_container-height))}:host([size=large][touch-target=wrapper]){margin:max(0px,48px - var(--_large-container-height))}.fab,.icon,.icon ::slotted(*){display:flex}.fab{align-items:center;justify-content:center;vertical-align:middle;padding:0;position:relative;height:var(--_container-height);transition-property:background-color;border-width:0px;outline:none;z-index:0;text-transform:inherit}.fab.extended{width:inherit;box-sizing:border-box;padding-inline-start:16px;padding-inline-end:20px}.fab:not(.extended){width:var(--_container-width)}.fab.large{width:var(--_large-container-width);height:var(--_large-container-height)}.fab.large .icon ::slotted(*){width:var(--_large-icon-size);height:var(--_large-icon-size);font-size:var(--_large-icon-size)}.fab.large,.fab.large .ripple{border-start-start-radius:var(--_large-container-shape-start-start);border-start-end-radius:var(--_large-container-shape-start-end);border-end-start-radius:var(--_large-container-shape-end-start);border-end-end-radius:var(--_large-container-shape-end-end)}.fab.large md-focus-ring{--md-focus-ring-shape-start-start: var(--_large-container-shape-start-start);--md-focus-ring-shape-start-end: var(--_large-container-shape-start-end);--md-focus-ring-shape-end-end: var(--_large-container-shape-end-end);--md-focus-ring-shape-end-start: var(--_large-container-shape-end-start)}.fab{--md-elevation-level: var(--_container-elevation);--md-elevation-shadow-color: var(--_container-shadow-color)}.fab:focus{--md-elevation-level: var(--_focus-container-elevation)}.fab:hover{--md-elevation-level: var(--_hover-container-elevation)}.fab:active{--md-elevation-level: var(--_pressed-container-elevation)}.fab.lowered{background-color:var(--_lowered-container-color);--md-elevation-level: var(--_lowered-container-elevation)}.fab.lowered:focus{--md-elevation-level: var(--_lowered-focus-container-elevation)}.fab.lowered:hover{--md-elevation-level: var(--_lowered-hover-container-elevation)}.fab.lowered:active{--md-elevation-level: var(--_lowered-pressed-container-elevation)}.fab{background-color:var(--_container-color);--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-pressed-color: var(--_pressed-state-layer-color)}.fab .label{color:var(--_label-text-color)}.fab:hover .fab .label{color:var(--_hover-label-text-color)}.fab:focus .fab .label{color:var(--_focus-label-text-color)}.fab:active .fab .label{color:var(--_pressed-label-text-color)}.label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight)}.fab.extended .icon ::slotted(*){margin-inline-end:12px}.ripple{overflow:hidden}.ripple,md-elevation{z-index:-1}.touch-target{position:absolute;top:50%;height:48px;left:50%;width:48px;transform:translate(-50%, -50%)}:host([touch-target=none]) .touch-target{display:none}md-elevation,.fab{transition-duration:280ms;transition-timing-function:cubic-bezier(0.2, 0, 0, 1)}.fab,.ripple{border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end)}md-focus-ring{--md-focus-ring-shape-start-start: var(--_container-shape-start-start);--md-focus-ring-shape-start-end: var(--_container-shape-start-end);--md-focus-ring-shape-end-end: var(--_container-shape-end-end);--md-focus-ring-shape-end-start: var(--_container-shape-end-start)}.icon ::slotted(*){width:var(--_icon-size);height:var(--_icon-size);font-size:var(--_icon-size)}
`;
  var shared_styles_cssresult_default3 = styles25.styleSheet;

  // ../fab/branded-fab.js
  var MdBrandedFab = class MdBrandedFab2 extends Fab {
    getRenderClasses() {
      return {
        ...super.getRenderClasses(),
        "primary": false,
        "secondary": false,
        "tertiary": false,
        "small": false
      };
    }
  };
  MdBrandedFab.styles = [
    styles25,
    styles23,
    styles24
  ];
  MdBrandedFab = __decorate([
    e("md-branded-fab")
  ], MdBrandedFab);

  // ../fab/internal/fab-styles.cssresult.js
  var styles26 = i3`:host{--_container-color: var(--md-fab-container-color, var(--md-sys-color-surface-container-high, #ece6f0));--_container-elevation: var(--md-fab-container-elevation, 3);--_container-height: var(--md-fab-container-height, 56px);--_container-shadow-color: var(--md-fab-container-shadow-color, var(--md-sys-color-shadow, #000));--_container-width: var(--md-fab-container-width, 56px);--_focus-container-elevation: var(--md-fab-focus-container-elevation, 3);--_focus-icon-color: var(--md-fab-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-container-elevation: var(--md-fab-hover-container-elevation, 4);--_hover-icon-color: var(--md-fab-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-color: var(--md-fab-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-opacity: var(--md-fab-hover-state-layer-opacity, 0.08);--_icon-color: var(--md-fab-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-size: var(--md-fab-icon-size, 24px);--_lowered-container-color: var(--md-fab-lowered-container-color, var(--md-sys-color-surface-container-low, #f7f2fa));--_lowered-container-elevation: var(--md-fab-lowered-container-elevation, 1);--_lowered-focus-container-elevation: var(--md-fab-lowered-focus-container-elevation, 1);--_lowered-hover-container-elevation: var(--md-fab-lowered-hover-container-elevation, 2);--_lowered-pressed-container-elevation: var(--md-fab-lowered-pressed-container-elevation, 1);--_pressed-container-elevation: var(--md-fab-pressed-container-elevation, 3);--_pressed-icon-color: var(--md-fab-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-color: var(--md-fab-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-opacity: var(--md-fab-pressed-state-layer-opacity, 0.12);--_focus-label-text-color: var(--md-fab-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-label-text-color: var(--md-fab-hover-label-text-color, var(--md-sys-color-primary, #6750a4));--_label-text-color: var(--md-fab-label-text-color, var(--md-sys-color-primary, #6750a4));--_label-text-font: var(--md-fab-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-fab-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-fab-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-fab-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_large-container-height: var(--md-fab-large-container-height, 96px);--_large-container-width: var(--md-fab-large-container-width, 96px);--_large-icon-size: var(--md-fab-large-icon-size, 36px);--_pressed-label-text-color: var(--md-fab-pressed-label-text-color, var(--md-sys-color-primary, #6750a4));--_primary-container-color: var(--md-fab-primary-container-color, var(--md-sys-color-primary-container, #eaddff));--_primary-focus-icon-color: var(--md-fab-primary-focus-icon-color, var(--md-sys-color-on-primary-container, #21005d));--_primary-focus-label-text-color: var(--md-fab-primary-focus-label-text-color, var(--md-sys-color-on-primary-container, #21005d));--_primary-hover-icon-color: var(--md-fab-primary-hover-icon-color, var(--md-sys-color-on-primary-container, #21005d));--_primary-hover-label-text-color: var(--md-fab-primary-hover-label-text-color, var(--md-sys-color-on-primary-container, #21005d));--_primary-hover-state-layer-color: var(--md-fab-primary-hover-state-layer-color, var(--md-sys-color-on-primary-container, #21005d));--_primary-icon-color: var(--md-fab-primary-icon-color, var(--md-sys-color-on-primary-container, #21005d));--_primary-label-text-color: var(--md-fab-primary-label-text-color, var(--md-sys-color-on-primary-container, #21005d));--_primary-pressed-icon-color: var(--md-fab-primary-pressed-icon-color, var(--md-sys-color-on-primary-container, #21005d));--_primary-pressed-label-text-color: var(--md-fab-primary-pressed-label-text-color, var(--md-sys-color-on-primary-container, #21005d));--_primary-pressed-state-layer-color: var(--md-fab-primary-pressed-state-layer-color, var(--md-sys-color-on-primary-container, #21005d));--_secondary-container-color: var(--md-fab-secondary-container-color, var(--md-sys-color-secondary-container, #e8def8));--_secondary-focus-icon-color: var(--md-fab-secondary-focus-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_secondary-focus-label-text-color: var(--md-fab-secondary-focus-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_secondary-hover-icon-color: var(--md-fab-secondary-hover-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_secondary-hover-label-text-color: var(--md-fab-secondary-hover-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_secondary-hover-state-layer-color: var(--md-fab-secondary-hover-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_secondary-icon-color: var(--md-fab-secondary-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_secondary-label-text-color: var(--md-fab-secondary-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_secondary-pressed-icon-color: var(--md-fab-secondary-pressed-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_secondary-pressed-label-text-color: var(--md-fab-secondary-pressed-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_secondary-pressed-state-layer-color: var(--md-fab-secondary-pressed-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_small-container-height: var(--md-fab-small-container-height, 40px);--_small-container-width: var(--md-fab-small-container-width, 40px);--_small-icon-size: var(--md-fab-small-icon-size, 24px);--_tertiary-container-color: var(--md-fab-tertiary-container-color, var(--md-sys-color-tertiary-container, #ffd8e4));--_tertiary-focus-icon-color: var(--md-fab-tertiary-focus-icon-color, var(--md-sys-color-on-tertiary-container, #31111d));--_tertiary-focus-label-text-color: var(--md-fab-tertiary-focus-label-text-color, var(--md-sys-color-on-tertiary-container, #31111d));--_tertiary-hover-icon-color: var(--md-fab-tertiary-hover-icon-color, var(--md-sys-color-on-tertiary-container, #31111d));--_tertiary-hover-label-text-color: var(--md-fab-tertiary-hover-label-text-color, var(--md-sys-color-on-tertiary-container, #31111d));--_tertiary-hover-state-layer-color: var(--md-fab-tertiary-hover-state-layer-color, var(--md-sys-color-on-tertiary-container, #31111d));--_tertiary-icon-color: var(--md-fab-tertiary-icon-color, var(--md-sys-color-on-tertiary-container, #31111d));--_tertiary-label-text-color: var(--md-fab-tertiary-label-text-color, var(--md-sys-color-on-tertiary-container, #31111d));--_tertiary-pressed-icon-color: var(--md-fab-tertiary-pressed-icon-color, var(--md-sys-color-on-tertiary-container, #31111d));--_tertiary-pressed-label-text-color: var(--md-fab-tertiary-pressed-label-text-color, var(--md-sys-color-on-tertiary-container, #31111d));--_tertiary-pressed-state-layer-color: var(--md-fab-tertiary-pressed-state-layer-color, var(--md-sys-color-on-tertiary-container, #31111d));--_container-shape-start-start: var(--md-fab-container-shape-start-start, var(--md-fab-container-shape, var(--md-sys-shape-corner-large, 16px)));--_container-shape-start-end: var(--md-fab-container-shape-start-end, var(--md-fab-container-shape, var(--md-sys-shape-corner-large, 16px)));--_container-shape-end-end: var(--md-fab-container-shape-end-end, var(--md-fab-container-shape, var(--md-sys-shape-corner-large, 16px)));--_container-shape-end-start: var(--md-fab-container-shape-end-start, var(--md-fab-container-shape, var(--md-sys-shape-corner-large, 16px)));--_large-container-shape-start-start: var(--md-fab-large-container-shape-start-start, var(--md-fab-large-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));--_large-container-shape-start-end: var(--md-fab-large-container-shape-start-end, var(--md-fab-large-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));--_large-container-shape-end-end: var(--md-fab-large-container-shape-end-end, var(--md-fab-large-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));--_large-container-shape-end-start: var(--md-fab-large-container-shape-end-start, var(--md-fab-large-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));--_small-container-shape-start-start: var(--md-fab-small-container-shape-start-start, var(--md-fab-small-container-shape, var(--md-sys-shape-corner-medium, 12px)));--_small-container-shape-start-end: var(--md-fab-small-container-shape-start-end, var(--md-fab-small-container-shape, var(--md-sys-shape-corner-medium, 12px)));--_small-container-shape-end-end: var(--md-fab-small-container-shape-end-end, var(--md-fab-small-container-shape, var(--md-sys-shape-corner-medium, 12px)));--_small-container-shape-end-start: var(--md-fab-small-container-shape-end-start, var(--md-fab-small-container-shape, var(--md-sys-shape-corner-medium, 12px)));cursor:pointer}:host([size=small][touch-target=wrapper]){margin:max(0px,48px - var(--_small-container-height))}.fab .icon ::slotted(*){color:var(--_icon-color)}.fab:focus{color:var(--_focus-icon-color)}.fab:hover{color:var(--_hover-icon-color)}.fab:active{color:var(--_pressed-icon-color)}.fab{cursor:inherit}.fab.primary{background-color:var(--_primary-container-color);--md-ripple-hover-color: var(--_primary-hover-state-layer-color);--md-ripple-pressed-color: var(--_primary-pressed-state-layer-color)}.fab.primary .icon ::slotted(*){color:var(--_primary-icon-color)}.fab.primary:focus{color:var(--_primary-focus-icon-color)}.fab.primary:hover{color:var(--_primary-hover-icon-color)}.fab.primary:active{color:var(--_primary-pressed-icon-color)}.fab.primary .label{color:var(--_primary-label-text-color)}.fab:hover .fab.primary .label{color:var(--_primary-hover-label-text-color)}.fab:focus .fab.primary .label{color:var(--_primary-focus-label-text-color)}.fab:active .fab.primary .label{color:var(--_primary-pressed-label-text-color)}.fab.secondary{background-color:var(--_secondary-container-color);--md-ripple-hover-color: var(--_secondary-hover-state-layer-color);--md-ripple-pressed-color: var(--_secondary-pressed-state-layer-color)}.fab.secondary .icon ::slotted(*){color:var(--_secondary-icon-color)}.fab.secondary:focus{color:var(--_secondary-focus-icon-color)}.fab.secondary:hover{color:var(--_secondary-hover-icon-color)}.fab.secondary:active{color:var(--_secondary-pressed-icon-color)}.fab.secondary .label{color:var(--_secondary-label-text-color)}.fab:hover .fab.secondary .label{color:var(--_secondary-hover-label-text-color)}.fab:focus .fab.secondary .label{color:var(--_secondary-focus-label-text-color)}.fab:active .fab.secondary .label{color:var(--_secondary-pressed-label-text-color)}.fab.tertiary{background-color:var(--_tertiary-container-color);--md-ripple-hover-color: var(--_tertiary-hover-state-layer-color);--md-ripple-pressed-color: var(--_tertiary-pressed-state-layer-color)}.fab.tertiary .icon ::slotted(*){color:var(--_tertiary-icon-color)}.fab.tertiary:focus{color:var(--_tertiary-focus-icon-color)}.fab.tertiary:hover{color:var(--_tertiary-hover-icon-color)}.fab.tertiary:active{color:var(--_tertiary-pressed-icon-color)}.fab.tertiary .label{color:var(--_tertiary-label-text-color)}.fab:hover .fab.tertiary .label{color:var(--_tertiary-hover-label-text-color)}.fab:focus .fab.tertiary .label{color:var(--_tertiary-focus-label-text-color)}.fab:active .fab.tertiary .label{color:var(--_tertiary-pressed-label-text-color)}.fab.extended slot span{padding-inline-start:4px}.fab.small{width:var(--_small-container-width);height:var(--_small-container-height)}.fab.small .icon ::slotted(*){width:var(--_small-icon-size);height:var(--_small-icon-size);font-size:var(--_small-icon-size)}.fab.small,.fab.small .ripple{border-start-start-radius:var(--_small-container-shape-start-start);border-start-end-radius:var(--_small-container-shape-start-end);border-end-start-radius:var(--_small-container-shape-end-start);border-end-end-radius:var(--_small-container-shape-end-end)}.fab.small md-focus-ring{--md-focus-ring-shape-start-start: var(--_small-container-shape-start-start);--md-focus-ring-shape-start-end: var(--_small-container-shape-start-end);--md-focus-ring-shape-end-end: var(--_small-container-shape-end-end);--md-focus-ring-shape-end-start: var(--_small-container-shape-end-start)}
`;
  var fab_styles_cssresult_default = styles26.styleSheet;

  // ../fab/fab.js
  var MdFab = class MdFab2 extends Fab {
  };
  MdFab.styles = [
    styles25,
    styles26,
    styles24
  ];
  MdFab = __decorate([
    e("md-fab")
  ], MdFab);

  // ../field/internal/field.js
  var Field = class extends s3 {
    constructor() {
      super(...arguments);
      this.disabled = false;
      this.error = false;
      this.focused = false;
      this.label = "";
      this.noAsterisk = false;
      this.populated = false;
      this.required = false;
      this.resizable = false;
      this.supportingText = "";
      this.errorText = "";
      this.count = -1;
      this.max = -1;
      this.hasStart = false;
      this.hasEnd = false;
      this.isAnimating = false;
      this.refreshErrorAlert = false;
      this.disableTransitions = false;
    }
    get counterText() {
      const countAsNumber = this.count ?? -1;
      const maxAsNumber = this.max ?? -1;
      if (countAsNumber < 0 || maxAsNumber <= 0) {
        return "";
      }
      return `${countAsNumber} / ${maxAsNumber}`;
    }
    get supportingOrErrorText() {
      return this.error && this.errorText ? this.errorText : this.supportingText;
    }
    /**
     * Re-announces the field's error supporting text to screen readers.
     *
     * Error text announces to screen readers anytime it is visible and changes.
     * Use the method to re-announce the message when the text has not changed,
     * but announcement is still needed (such as for `reportValidity()`).
     */
    reannounceError() {
      this.refreshErrorAlert = true;
    }
    update(props) {
      const isDisabledChanging = props.has("disabled") && props.get("disabled") !== void 0;
      if (isDisabledChanging) {
        this.disableTransitions = true;
      }
      if (this.disabled && this.focused) {
        props.set("focused", true);
        this.focused = false;
      }
      this.animateLabelIfNeeded({
        wasFocused: props.get("focused"),
        wasPopulated: props.get("populated")
      });
      super.update(props);
    }
    render() {
      const floatingLabel = this.renderLabel(
        /*isFloating*/
        true
      );
      const restingLabel = this.renderLabel(
        /*isFloating*/
        false
      );
      const outline = this.renderOutline?.(floatingLabel);
      const classes = {
        "disabled": this.disabled,
        "disable-transitions": this.disableTransitions,
        "error": this.error && !this.disabled,
        "focused": this.focused,
        "with-start": this.hasStart,
        "with-end": this.hasEnd,
        "populated": this.populated,
        "resizable": this.resizable,
        "required": this.required,
        "no-label": !this.label
      };
      return T`
      <div class="field ${o8(classes)}">
        <div class="container-overflow">
          ${this.renderBackground?.()}
          <slot name="container"></slot>
          ${this.renderStateLayer?.()} ${this.renderIndicator?.()} ${outline}
          <div class="container">
            <div class="start">
              <slot name="start"></slot>
            </div>
            <div class="middle">
              <div class="label-wrapper">
                ${restingLabel} ${outline ? A : floatingLabel}
              </div>
              <div class="content">
                <slot></slot>
              </div>
            </div>
            <div class="end">
              <slot name="end"></slot>
            </div>
          </div>
        </div>
        ${this.renderSupportingText()}
      </div>
    `;
    }
    updated(changed) {
      if (changed.has("supportingText") || changed.has("errorText") || changed.has("count") || changed.has("max")) {
        this.updateSlottedAriaDescribedBy();
      }
      if (this.refreshErrorAlert) {
        requestAnimationFrame(() => {
          this.refreshErrorAlert = false;
        });
      }
      if (this.disableTransitions) {
        requestAnimationFrame(() => {
          this.disableTransitions = false;
        });
      }
    }
    renderSupportingText() {
      const { supportingOrErrorText, counterText } = this;
      if (!supportingOrErrorText && !counterText) {
        return A;
      }
      const start = T`<span>${supportingOrErrorText}</span>`;
      const end = counterText ? T`<span class="counter">${counterText}</span>` : A;
      const shouldErrorAnnounce = this.error && this.errorText && !this.refreshErrorAlert;
      const role = shouldErrorAnnounce ? "alert" : A;
      return T`
      <div class="supporting-text" role=${role}>${start}${end}</div>
      <slot
        name="aria-describedby"
        @slotchange=${this.updateSlottedAriaDescribedBy}></slot>
    `;
    }
    updateSlottedAriaDescribedBy() {
      for (const element of this.slottedAriaDescribedBy) {
        B(T`${this.supportingOrErrorText} ${this.counterText}`, element);
        element.setAttribute("hidden", "");
      }
    }
    renderLabel(isFloating) {
      if (!this.label) {
        return A;
      }
      let visible;
      if (isFloating) {
        visible = this.focused || this.populated || this.isAnimating;
      } else {
        visible = !this.focused && !this.populated && !this.isAnimating;
      }
      const classes = {
        "hidden": !visible,
        "floating": isFloating,
        "resting": !isFloating
      };
      const labelText = `${this.label}${this.required && !this.noAsterisk ? "*" : ""}`;
      return T`
      <span class="label ${o8(classes)}" aria-hidden=${!visible}
        >${labelText}</span
      >
    `;
    }
    animateLabelIfNeeded({ wasFocused, wasPopulated }) {
      if (!this.label) {
        return;
      }
      wasFocused ??= this.focused;
      wasPopulated ??= this.populated;
      const wasFloating = wasFocused || wasPopulated;
      const shouldBeFloating = this.focused || this.populated;
      if (wasFloating === shouldBeFloating) {
        return;
      }
      const keyframes = this.getLabelKeyframes();
      if (!keyframes.length) {
        return;
      }
      this.isAnimating = true;
      this.labelAnimation?.cancel();
      this.labelAnimation = this.floatingLabelEl?.animate(keyframes, {
        duration: 150,
        easing: EASING.STANDARD
      });
      this.labelAnimation?.addEventListener("finish", () => {
        this.isAnimating = false;
      });
    }
    getLabelKeyframes() {
      const { floatingLabelEl, restingLabelEl } = this;
      if (!floatingLabelEl || !restingLabelEl) {
        return [];
      }
      const { x: floatingX, y: floatingY, height: floatingHeight } = floatingLabelEl.getBoundingClientRect();
      const { x: restingX, y: restingY, height: restingHeight } = restingLabelEl.getBoundingClientRect();
      const floatingScrollWidth = floatingLabelEl.scrollWidth;
      const restingScrollWidth = restingLabelEl.scrollWidth;
      if (floatingScrollWidth === 0 || restingScrollWidth === 0) {
        return [];
      }
      const scale = restingScrollWidth / floatingScrollWidth;
      const xDelta = restingX - floatingX;
      const yDelta = restingY - floatingY + Math.round((restingHeight - floatingHeight * scale) / 2);
      const restTransform = `translateX(${xDelta}px) translateY(${yDelta}px) scale(${scale})`;
      const floatTransform = `translateX(0) translateY(0) scale(1)`;
      const restingClientWidth = restingLabelEl.clientWidth;
      const isRestingClipped = restingScrollWidth > restingClientWidth;
      const width = isRestingClipped ? `${restingClientWidth / scale}px` : "";
      if (this.focused || this.populated) {
        return [
          { transform: restTransform, width },
          { transform: floatTransform, width }
        ];
      }
      return [
        { transform: floatTransform, width },
        { transform: restTransform, width }
      ];
    }
    getSurfacePositionClientRect() {
      return this.containerEl.getBoundingClientRect();
    }
  };
  __decorate([
    n({ type: Boolean })
  ], Field.prototype, "disabled", void 0);
  __decorate([
    n({ type: Boolean })
  ], Field.prototype, "error", void 0);
  __decorate([
    n({ type: Boolean })
  ], Field.prototype, "focused", void 0);
  __decorate([
    n()
  ], Field.prototype, "label", void 0);
  __decorate([
    n({ type: Boolean, attribute: "no-asterisk" })
  ], Field.prototype, "noAsterisk", void 0);
  __decorate([
    n({ type: Boolean })
  ], Field.prototype, "populated", void 0);
  __decorate([
    n({ type: Boolean })
  ], Field.prototype, "required", void 0);
  __decorate([
    n({ type: Boolean })
  ], Field.prototype, "resizable", void 0);
  __decorate([
    n({ attribute: "supporting-text" })
  ], Field.prototype, "supportingText", void 0);
  __decorate([
    n({ attribute: "error-text" })
  ], Field.prototype, "errorText", void 0);
  __decorate([
    n({ type: Number })
  ], Field.prototype, "count", void 0);
  __decorate([
    n({ type: Number })
  ], Field.prototype, "max", void 0);
  __decorate([
    n({ type: Boolean, attribute: "has-start" })
  ], Field.prototype, "hasStart", void 0);
  __decorate([
    n({ type: Boolean, attribute: "has-end" })
  ], Field.prototype, "hasEnd", void 0);
  __decorate([
    e5({ slot: "aria-describedby" })
  ], Field.prototype, "slottedAriaDescribedBy", void 0);
  __decorate([
    t()
  ], Field.prototype, "isAnimating", void 0);
  __decorate([
    t()
  ], Field.prototype, "refreshErrorAlert", void 0);
  __decorate([
    t()
  ], Field.prototype, "disableTransitions", void 0);
  __decorate([
    i2(".label.floating")
  ], Field.prototype, "floatingLabelEl", void 0);
  __decorate([
    i2(".label.resting")
  ], Field.prototype, "restingLabelEl", void 0);
  __decorate([
    i2(".container")
  ], Field.prototype, "containerEl", void 0);

  // ../field/internal/filled-field.js
  var FilledField = class extends Field {
    renderBackground() {
      return T` <div class="background"></div> `;
    }
    renderStateLayer() {
      return T` <div class="state-layer"></div> `;
    }
    renderIndicator() {
      return T`<div class="active-indicator"></div>`;
    }
  };

  // ../field/internal/filled-styles.cssresult.js
  var styles27 = i3`@layer styles{:host{--_active-indicator-color: var(--md-filled-field-active-indicator-color, var(--md-sys-color-on-surface-variant, #49454f));--_active-indicator-height: var(--md-filled-field-active-indicator-height, 1px);--_bottom-space: var(--md-filled-field-bottom-space, 16px);--_container-color: var(--md-filled-field-container-color, var(--md-sys-color-surface-container-highest, #e6e0e9));--_content-color: var(--md-filled-field-content-color, var(--md-sys-color-on-surface, #1d1b20));--_content-font: var(--md-filled-field-content-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_content-line-height: var(--md-filled-field-content-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_content-size: var(--md-filled-field-content-size, var(--md-sys-typescale-body-large-size, 1rem));--_content-space: var(--md-filled-field-content-space, 16px);--_content-weight: var(--md-filled-field-content-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_disabled-active-indicator-color: var(--md-filled-field-disabled-active-indicator-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-active-indicator-height: var(--md-filled-field-disabled-active-indicator-height, 1px);--_disabled-active-indicator-opacity: var(--md-filled-field-disabled-active-indicator-opacity, 0.38);--_disabled-container-color: var(--md-filled-field-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-container-opacity: var(--md-filled-field-disabled-container-opacity, 0.04);--_disabled-content-color: var(--md-filled-field-disabled-content-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-content-opacity: var(--md-filled-field-disabled-content-opacity, 0.38);--_disabled-label-text-color: var(--md-filled-field-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-filled-field-disabled-label-text-opacity, 0.38);--_disabled-leading-content-color: var(--md-filled-field-disabled-leading-content-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-leading-content-opacity: var(--md-filled-field-disabled-leading-content-opacity, 0.38);--_disabled-supporting-text-color: var(--md-filled-field-disabled-supporting-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-supporting-text-opacity: var(--md-filled-field-disabled-supporting-text-opacity, 0.38);--_disabled-trailing-content-color: var(--md-filled-field-disabled-trailing-content-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-trailing-content-opacity: var(--md-filled-field-disabled-trailing-content-opacity, 0.38);--_error-active-indicator-color: var(--md-filled-field-error-active-indicator-color, var(--md-sys-color-error, #b3261e));--_error-content-color: var(--md-filled-field-error-content-color, var(--md-sys-color-on-surface, #1d1b20));--_error-focus-active-indicator-color: var(--md-filled-field-error-focus-active-indicator-color, var(--md-sys-color-error, #b3261e));--_error-focus-content-color: var(--md-filled-field-error-focus-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-focus-label-text-color: var(--md-filled-field-error-focus-label-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-leading-content-color: var(--md-filled-field-error-focus-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-focus-supporting-text-color: var(--md-filled-field-error-focus-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-trailing-content-color: var(--md-filled-field-error-focus-trailing-content-color, var(--md-sys-color-error, #b3261e));--_error-hover-active-indicator-color: var(--md-filled-field-error-hover-active-indicator-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-content-color: var(--md-filled-field-error-hover-content-color, var(--md-sys-color-on-surface, #1d1b20));--_error-hover-label-text-color: var(--md-filled-field-error-hover-label-text-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-leading-content-color: var(--md-filled-field-error-hover-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-hover-state-layer-color: var(--md-filled-field-error-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_error-hover-state-layer-opacity: var(--md-filled-field-error-hover-state-layer-opacity, 0.08);--_error-hover-supporting-text-color: var(--md-filled-field-error-hover-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-hover-trailing-content-color: var(--md-filled-field-error-hover-trailing-content-color, var(--md-sys-color-on-error-container, #410e0b));--_error-label-text-color: var(--md-filled-field-error-label-text-color, var(--md-sys-color-error, #b3261e));--_error-leading-content-color: var(--md-filled-field-error-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-supporting-text-color: var(--md-filled-field-error-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-trailing-content-color: var(--md-filled-field-error-trailing-content-color, var(--md-sys-color-error, #b3261e));--_focus-active-indicator-color: var(--md-filled-field-focus-active-indicator-color, var(--md-sys-color-primary, #6750a4));--_focus-active-indicator-height: var(--md-filled-field-focus-active-indicator-height, 3px);--_focus-content-color: var(--md-filled-field-focus-content-color, var(--md-sys-color-on-surface, #1d1b20));--_focus-label-text-color: var(--md-filled-field-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_focus-leading-content-color: var(--md-filled-field-focus-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-supporting-text-color: var(--md-filled-field-focus-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-trailing-content-color: var(--md-filled-field-focus-trailing-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-active-indicator-color: var(--md-filled-field-hover-active-indicator-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-active-indicator-height: var(--md-filled-field-hover-active-indicator-height, 1px);--_hover-content-color: var(--md-filled-field-hover-content-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-label-text-color: var(--md-filled-field-hover-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-leading-content-color: var(--md-filled-field-hover-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-color: var(--md-filled-field-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-state-layer-opacity: var(--md-filled-field-hover-state-layer-opacity, 0.08);--_hover-supporting-text-color: var(--md-filled-field-hover-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-trailing-content-color: var(--md-filled-field-hover-trailing-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-color: var(--md-filled-field-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-font: var(--md-filled-field-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-filled-field-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_label-text-populated-line-height: var(--md-filled-field-label-text-populated-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_label-text-populated-size: var(--md-filled-field-label-text-populated-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_label-text-size: var(--md-filled-field-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_label-text-weight: var(--md-filled-field-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_leading-content-color: var(--md-filled-field-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_leading-space: var(--md-filled-field-leading-space, 16px);--_supporting-text-color: var(--md-filled-field-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_supporting-text-font: var(--md-filled-field-supporting-text-font, var(--md-sys-typescale-body-small-font, var(--md-ref-typeface-plain, Roboto)));--_supporting-text-leading-space: var(--md-filled-field-supporting-text-leading-space, 16px);--_supporting-text-line-height: var(--md-filled-field-supporting-text-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_supporting-text-size: var(--md-filled-field-supporting-text-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_supporting-text-top-space: var(--md-filled-field-supporting-text-top-space, 4px);--_supporting-text-trailing-space: var(--md-filled-field-supporting-text-trailing-space, 16px);--_supporting-text-weight: var(--md-filled-field-supporting-text-weight, var(--md-sys-typescale-body-small-weight, var(--md-ref-typeface-weight-regular, 400)));--_top-space: var(--md-filled-field-top-space, 16px);--_trailing-content-color: var(--md-filled-field-trailing-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_trailing-space: var(--md-filled-field-trailing-space, 16px);--_with-label-bottom-space: var(--md-filled-field-with-label-bottom-space, 8px);--_with-label-top-space: var(--md-filled-field-with-label-top-space, 8px);--_with-leading-content-leading-space: var(--md-filled-field-with-leading-content-leading-space, 12px);--_with-trailing-content-trailing-space: var(--md-filled-field-with-trailing-content-trailing-space, 12px);--_container-shape-start-start: var(--md-filled-field-container-shape-start-start, var(--md-filled-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-start-end: var(--md-filled-field-container-shape-start-end, var(--md-filled-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-end-end: var(--md-filled-field-container-shape-end-end, var(--md-filled-field-container-shape, var(--md-sys-shape-corner-none, 0px)));--_container-shape-end-start: var(--md-filled-field-container-shape-end-start, var(--md-filled-field-container-shape, var(--md-sys-shape-corner-none, 0px)))}.background,.state-layer{border-radius:inherit;inset:0;pointer-events:none;position:absolute}.background{background:var(--_container-color)}.state-layer{visibility:hidden}.field:not(.disabled):hover .state-layer{visibility:visible}.label.floating{position:absolute;top:var(--_with-label-top-space)}.field:not(.with-start) .label-wrapper{margin-inline-start:var(--_leading-space)}.field:not(.with-end) .label-wrapper{margin-inline-end:var(--_trailing-space)}.active-indicator{inset:auto 0 0 0;pointer-events:none;position:absolute;width:100%;z-index:1}.active-indicator::before,.active-indicator::after{border-bottom:var(--_active-indicator-height) solid var(--_active-indicator-color);inset:auto 0 0 0;content:"";position:absolute;width:100%}.active-indicator::after{opacity:0;transition:opacity 150ms cubic-bezier(0.2, 0, 0, 1)}.focused .active-indicator::after{opacity:1}.field:not(.with-start) .content ::slotted(*){padding-inline-start:var(--_leading-space)}.field:not(.with-end) .content ::slotted(*){padding-inline-end:var(--_trailing-space)}.field:not(.no-label) .content ::slotted(:not(textarea)){padding-bottom:var(--_with-label-bottom-space);padding-top:calc(var(--_with-label-top-space) + var(--_label-text-populated-line-height))}.field:not(.no-label) .content ::slotted(textarea){margin-bottom:var(--_with-label-bottom-space);margin-top:calc(var(--_with-label-top-space) + var(--_label-text-populated-line-height))}:hover .active-indicator::before{border-bottom-color:var(--_hover-active-indicator-color);border-bottom-width:var(--_hover-active-indicator-height)}.active-indicator::after{border-bottom-color:var(--_focus-active-indicator-color);border-bottom-width:var(--_focus-active-indicator-height)}:hover .state-layer{background:var(--_hover-state-layer-color);opacity:var(--_hover-state-layer-opacity)}.disabled .active-indicator::before{border-bottom-color:var(--_disabled-active-indicator-color);border-bottom-width:var(--_disabled-active-indicator-height);opacity:var(--_disabled-active-indicator-opacity)}.disabled .background{background:var(--_disabled-container-color);opacity:var(--_disabled-container-opacity)}.error .active-indicator::before{border-bottom-color:var(--_error-active-indicator-color)}.error:hover .active-indicator::before{border-bottom-color:var(--_error-hover-active-indicator-color)}.error:hover .state-layer{background:var(--_error-hover-state-layer-color);opacity:var(--_error-hover-state-layer-opacity)}.error .active-indicator::after{border-bottom-color:var(--_error-focus-active-indicator-color)}.resizable .container{bottom:var(--_focus-active-indicator-height);clip-path:inset(var(--_focus-active-indicator-height) 0 0 0)}.resizable .container>*{top:var(--_focus-active-indicator-height)}}@layer hcm{@media(forced-colors: active){.disabled .active-indicator::before{border-color:GrayText;opacity:1}}}
`;
  var filled_styles_cssresult_default2 = styles27.styleSheet;

  // ../field/internal/shared-styles.cssresult.js
  var styles28 = i3`:host{display:inline-flex;resize:both}.field{display:flex;flex:1;flex-direction:column;writing-mode:horizontal-tb;max-width:100%}.container-overflow{border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-end-radius:var(--_container-shape-end-end);border-end-start-radius:var(--_container-shape-end-start);display:flex;height:100%;position:relative}.container{align-items:center;border-radius:inherit;display:flex;flex:1;max-height:100%;min-height:100%;min-width:min-content;position:relative}.field,.container-overflow{resize:inherit}.resizable:not(.disabled) .container{resize:inherit;overflow:hidden}.disabled{pointer-events:none}slot[name=container]{border-radius:inherit}slot[name=container]::slotted(*){border-radius:inherit;inset:0;pointer-events:none;position:absolute}@layer styles{.start,.middle,.end{display:flex;box-sizing:border-box;height:100%;position:relative}.start{color:var(--_leading-content-color)}.end{color:var(--_trailing-content-color)}.start,.end{align-items:center;justify-content:center}.with-start .start{margin-inline:var(--_with-leading-content-leading-space) var(--_content-space)}.with-end .end{margin-inline:var(--_content-space) var(--_with-trailing-content-trailing-space)}.middle{align-items:stretch;align-self:baseline;flex:1}.content{color:var(--_content-color);display:flex;flex:1;opacity:0;transition:opacity 83ms cubic-bezier(0.2, 0, 0, 1)}.no-label .content,.focused .content,.populated .content{opacity:1;transition-delay:67ms}:is(.disabled,.disable-transitions) .content{transition:none}.content ::slotted(*){all:unset;color:currentColor;font-family:var(--_content-font);font-size:var(--_content-size);line-height:var(--_content-line-height);font-weight:var(--_content-weight);width:100%;overflow-wrap:revert;white-space:revert}.content ::slotted(:not(textarea)){padding-top:var(--_top-space);padding-bottom:var(--_bottom-space)}.content ::slotted(textarea){margin-top:var(--_top-space);margin-bottom:var(--_bottom-space)}:hover .content{color:var(--_hover-content-color)}:hover .start{color:var(--_hover-leading-content-color)}:hover .end{color:var(--_hover-trailing-content-color)}.focused .content{color:var(--_focus-content-color)}.focused .start{color:var(--_focus-leading-content-color)}.focused .end{color:var(--_focus-trailing-content-color)}.disabled .content{color:var(--_disabled-content-color)}.disabled.no-label .content,.disabled.focused .content,.disabled.populated .content{opacity:var(--_disabled-content-opacity)}.disabled .start{color:var(--_disabled-leading-content-color);opacity:var(--_disabled-leading-content-opacity)}.disabled .end{color:var(--_disabled-trailing-content-color);opacity:var(--_disabled-trailing-content-opacity)}.error .content{color:var(--_error-content-color)}.error .start{color:var(--_error-leading-content-color)}.error .end{color:var(--_error-trailing-content-color)}.error:hover .content{color:var(--_error-hover-content-color)}.error:hover .start{color:var(--_error-hover-leading-content-color)}.error:hover .end{color:var(--_error-hover-trailing-content-color)}.error.focused .content{color:var(--_error-focus-content-color)}.error.focused .start{color:var(--_error-focus-leading-content-color)}.error.focused .end{color:var(--_error-focus-trailing-content-color)}}@layer hcm{@media(forced-colors: active){.disabled :is(.start,.content,.end){color:GrayText;opacity:1}}}@layer styles{.label{box-sizing:border-box;color:var(--_label-text-color);overflow:hidden;max-width:100%;text-overflow:ellipsis;white-space:nowrap;z-index:1;font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight);width:min-content}.label-wrapper{inset:0;pointer-events:none;position:absolute}.label.resting{position:absolute;top:var(--_top-space)}.label.floating{font-size:var(--_label-text-populated-size);line-height:var(--_label-text-populated-line-height);transform-origin:top left}.label.hidden{opacity:0}.no-label .label{display:none}.label-wrapper{inset:0;position:absolute;text-align:initial}:hover .label{color:var(--_hover-label-text-color)}.focused .label{color:var(--_focus-label-text-color)}.disabled .label{color:var(--_disabled-label-text-color)}.disabled .label:not(.hidden){opacity:var(--_disabled-label-text-opacity)}.error .label{color:var(--_error-label-text-color)}.error:hover .label{color:var(--_error-hover-label-text-color)}.error.focused .label{color:var(--_error-focus-label-text-color)}}@layer hcm{@media(forced-colors: active){.disabled .label:not(.hidden){color:GrayText;opacity:1}}}@layer styles{.supporting-text{color:var(--_supporting-text-color);display:flex;font-family:var(--_supporting-text-font);font-size:var(--_supporting-text-size);line-height:var(--_supporting-text-line-height);font-weight:var(--_supporting-text-weight);gap:16px;justify-content:space-between;padding-inline-start:var(--_supporting-text-leading-space);padding-inline-end:var(--_supporting-text-trailing-space);padding-top:var(--_supporting-text-top-space)}.supporting-text :nth-child(2){flex-shrink:0}:hover .supporting-text{color:var(--_hover-supporting-text-color)}.focus .supporting-text{color:var(--_focus-supporting-text-color)}.disabled .supporting-text{color:var(--_disabled-supporting-text-color);opacity:var(--_disabled-supporting-text-opacity)}.error .supporting-text{color:var(--_error-supporting-text-color)}.error:hover .supporting-text{color:var(--_error-hover-supporting-text-color)}.error.focus .supporting-text{color:var(--_error-focus-supporting-text-color)}}@layer hcm{@media(forced-colors: active){.disabled .supporting-text{color:GrayText;opacity:1}}}
`;
  var shared_styles_cssresult_default4 = styles28.styleSheet;

  // ../field/filled-field.js
  var MdFilledField = class MdFilledField2 extends FilledField {
  };
  MdFilledField.styles = [styles28, styles27];
  MdFilledField = __decorate([
    e("md-filled-field")
  ], MdFilledField);

  // ../field/internal/outlined-field.js
  var OutlinedField = class extends Field {
    renderOutline(floatingLabel) {
      return T`
      <div class="outline">
        <div class="outline-start"></div>
        <div class="outline-notch">
          <div class="outline-panel-inactive"></div>
          <div class="outline-panel-active"></div>
          <div class="outline-label">${floatingLabel}</div>
        </div>
        <div class="outline-end"></div>
      </div>
    `;
    }
  };

  // ../field/internal/outlined-styles.cssresult.js
  var styles29 = i3`@layer styles{:host{--_bottom-space: var(--md-outlined-field-bottom-space, 16px);--_content-color: var(--md-outlined-field-content-color, var(--md-sys-color-on-surface, #1d1b20));--_content-font: var(--md-outlined-field-content-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_content-line-height: var(--md-outlined-field-content-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_content-size: var(--md-outlined-field-content-size, var(--md-sys-typescale-body-large-size, 1rem));--_content-space: var(--md-outlined-field-content-space, 16px);--_content-weight: var(--md-outlined-field-content-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_disabled-content-color: var(--md-outlined-field-disabled-content-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-content-opacity: var(--md-outlined-field-disabled-content-opacity, 0.38);--_disabled-label-text-color: var(--md-outlined-field-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-outlined-field-disabled-label-text-opacity, 0.38);--_disabled-leading-content-color: var(--md-outlined-field-disabled-leading-content-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-leading-content-opacity: var(--md-outlined-field-disabled-leading-content-opacity, 0.38);--_disabled-outline-color: var(--md-outlined-field-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-opacity: var(--md-outlined-field-disabled-outline-opacity, 0.12);--_disabled-outline-width: var(--md-outlined-field-disabled-outline-width, 1px);--_disabled-supporting-text-color: var(--md-outlined-field-disabled-supporting-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-supporting-text-opacity: var(--md-outlined-field-disabled-supporting-text-opacity, 0.38);--_disabled-trailing-content-color: var(--md-outlined-field-disabled-trailing-content-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-trailing-content-opacity: var(--md-outlined-field-disabled-trailing-content-opacity, 0.38);--_error-content-color: var(--md-outlined-field-error-content-color, var(--md-sys-color-on-surface, #1d1b20));--_error-focus-content-color: var(--md-outlined-field-error-focus-content-color, var(--md-sys-color-on-surface, #1d1b20));--_error-focus-label-text-color: var(--md-outlined-field-error-focus-label-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-leading-content-color: var(--md-outlined-field-error-focus-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-focus-outline-color: var(--md-outlined-field-error-focus-outline-color, var(--md-sys-color-error, #b3261e));--_error-focus-supporting-text-color: var(--md-outlined-field-error-focus-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-trailing-content-color: var(--md-outlined-field-error-focus-trailing-content-color, var(--md-sys-color-error, #b3261e));--_error-hover-content-color: var(--md-outlined-field-error-hover-content-color, var(--md-sys-color-on-surface, #1d1b20));--_error-hover-label-text-color: var(--md-outlined-field-error-hover-label-text-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-leading-content-color: var(--md-outlined-field-error-hover-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-hover-outline-color: var(--md-outlined-field-error-hover-outline-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-supporting-text-color: var(--md-outlined-field-error-hover-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-hover-trailing-content-color: var(--md-outlined-field-error-hover-trailing-content-color, var(--md-sys-color-on-error-container, #410e0b));--_error-label-text-color: var(--md-outlined-field-error-label-text-color, var(--md-sys-color-error, #b3261e));--_error-leading-content-color: var(--md-outlined-field-error-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-outline-color: var(--md-outlined-field-error-outline-color, var(--md-sys-color-error, #b3261e));--_error-supporting-text-color: var(--md-outlined-field-error-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-trailing-content-color: var(--md-outlined-field-error-trailing-content-color, var(--md-sys-color-error, #b3261e));--_focus-content-color: var(--md-outlined-field-focus-content-color, var(--md-sys-color-on-surface, #1d1b20));--_focus-label-text-color: var(--md-outlined-field-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_focus-leading-content-color: var(--md-outlined-field-focus-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-outline-color: var(--md-outlined-field-focus-outline-color, var(--md-sys-color-primary, #6750a4));--_focus-outline-width: var(--md-outlined-field-focus-outline-width, 3px);--_focus-supporting-text-color: var(--md-outlined-field-focus-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-trailing-content-color: var(--md-outlined-field-focus-trailing-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-content-color: var(--md-outlined-field-hover-content-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-label-text-color: var(--md-outlined-field-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-leading-content-color: var(--md-outlined-field-hover-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-outline-color: var(--md-outlined-field-hover-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-outline-width: var(--md-outlined-field-hover-outline-width, 1px);--_hover-supporting-text-color: var(--md-outlined-field-hover-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-trailing-content-color: var(--md-outlined-field-hover-trailing-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-color: var(--md-outlined-field-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-font: var(--md-outlined-field-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-outlined-field-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_label-text-padding-bottom: var(--md-outlined-field-label-text-padding-bottom, 8px);--_label-text-populated-line-height: var(--md-outlined-field-label-text-populated-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_label-text-populated-size: var(--md-outlined-field-label-text-populated-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_label-text-size: var(--md-outlined-field-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_label-text-weight: var(--md-outlined-field-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_leading-content-color: var(--md-outlined-field-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_leading-space: var(--md-outlined-field-leading-space, 16px);--_outline-color: var(--md-outlined-field-outline-color, var(--md-sys-color-outline, #79747e));--_outline-label-padding: var(--md-outlined-field-outline-label-padding, 4px);--_outline-width: var(--md-outlined-field-outline-width, 1px);--_supporting-text-color: var(--md-outlined-field-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_supporting-text-font: var(--md-outlined-field-supporting-text-font, var(--md-sys-typescale-body-small-font, var(--md-ref-typeface-plain, Roboto)));--_supporting-text-leading-space: var(--md-outlined-field-supporting-text-leading-space, 16px);--_supporting-text-line-height: var(--md-outlined-field-supporting-text-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_supporting-text-size: var(--md-outlined-field-supporting-text-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_supporting-text-top-space: var(--md-outlined-field-supporting-text-top-space, 4px);--_supporting-text-trailing-space: var(--md-outlined-field-supporting-text-trailing-space, 16px);--_supporting-text-weight: var(--md-outlined-field-supporting-text-weight, var(--md-sys-typescale-body-small-weight, var(--md-ref-typeface-weight-regular, 400)));--_top-space: var(--md-outlined-field-top-space, 16px);--_trailing-content-color: var(--md-outlined-field-trailing-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_trailing-space: var(--md-outlined-field-trailing-space, 16px);--_with-leading-content-leading-space: var(--md-outlined-field-with-leading-content-leading-space, 12px);--_with-trailing-content-trailing-space: var(--md-outlined-field-with-trailing-content-trailing-space, 12px);--_container-shape-start-start: var(--md-outlined-field-container-shape-start-start, var(--md-outlined-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-start-end: var(--md-outlined-field-container-shape-start-end, var(--md-outlined-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-end-end: var(--md-outlined-field-container-shape-end-end, var(--md-outlined-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-end-start: var(--md-outlined-field-container-shape-end-start, var(--md-outlined-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)))}.outline{border-color:var(--_outline-color);border-radius:inherit;display:flex;pointer-events:none;height:100%;position:absolute;width:100%;z-index:1}.outline-start::before,.outline-start::after,.outline-panel-inactive::before,.outline-panel-inactive::after,.outline-panel-active::before,.outline-panel-active::after,.outline-end::before,.outline-end::after{border:inherit;content:"";inset:0;position:absolute}.outline-start,.outline-end{border:inherit;border-radius:inherit;box-sizing:border-box;position:relative}.outline-start::before,.outline-start::after,.outline-end::before,.outline-end::after{border-bottom-style:solid;border-top-style:solid}.outline-start::after,.outline-end::after{opacity:0;transition:opacity 150ms cubic-bezier(0.2, 0, 0, 1)}.focused .outline-start::after,.focused .outline-end::after{opacity:1}.outline-start::before,.outline-start::after{border-inline-start-style:solid;border-inline-end-style:none;border-start-start-radius:inherit;border-start-end-radius:0;border-end-start-radius:inherit;border-end-end-radius:0;margin-inline-end:var(--_outline-label-padding)}.outline-end{flex-grow:1;margin-inline-start:calc(-1*var(--_outline-label-padding))}.outline-end::before,.outline-end::after{border-inline-start-style:none;border-inline-end-style:solid;border-start-start-radius:0;border-start-end-radius:inherit;border-end-start-radius:0;border-end-end-radius:inherit}.outline-notch{align-items:flex-start;border:inherit;display:flex;margin-inline-start:calc(-1*var(--_outline-label-padding));margin-inline-end:var(--_outline-label-padding);max-width:calc(100% - var(--_leading-space) - var(--_trailing-space));padding:0 var(--_outline-label-padding);position:relative}.no-label .outline-notch{display:none}.outline-panel-inactive,.outline-panel-active{border:inherit;border-bottom-style:solid;inset:0;position:absolute}.outline-panel-inactive::before,.outline-panel-inactive::after,.outline-panel-active::before,.outline-panel-active::after{border-top-style:solid;border-bottom:none;bottom:auto;transform:scaleX(1);transition:transform 150ms cubic-bezier(0.2, 0, 0, 1)}.outline-panel-inactive::before,.outline-panel-active::before{right:50%;transform-origin:top left}.outline-panel-inactive::after,.outline-panel-active::after{left:50%;transform-origin:top right}.populated .outline-panel-inactive::before,.populated .outline-panel-inactive::after,.populated .outline-panel-active::before,.populated .outline-panel-active::after,.focused .outline-panel-inactive::before,.focused .outline-panel-inactive::after,.focused .outline-panel-active::before,.focused .outline-panel-active::after{transform:scaleX(0)}.outline-panel-active{opacity:0;transition:opacity 150ms cubic-bezier(0.2, 0, 0, 1)}.focused .outline-panel-active{opacity:1}.outline-label{display:flex;max-width:100%;transform:translateY(calc(-100% + var(--_label-text-padding-bottom)))}.outline-start,.field:not(.with-start) .content ::slotted(*){padding-inline-start:max(var(--_leading-space),max(var(--_container-shape-start-start),var(--_container-shape-end-start)) + var(--_outline-label-padding))}.field:not(.with-start) .label-wrapper{margin-inline-start:max(var(--_leading-space),max(var(--_container-shape-start-start),var(--_container-shape-end-start)) + var(--_outline-label-padding))}.field:not(.with-end) .content ::slotted(*){padding-inline-end:max(var(--_trailing-space),max(var(--_container-shape-start-end),var(--_container-shape-end-end)))}.field:not(.with-end) .label-wrapper{margin-inline-end:max(var(--_trailing-space),max(var(--_container-shape-start-end),var(--_container-shape-end-end)))}.outline-start::before,.outline-end::before,.outline-panel-inactive,.outline-panel-inactive::before,.outline-panel-inactive::after{border-width:var(--_outline-width)}:hover .outline{border-color:var(--_hover-outline-color);color:var(--_hover-outline-color)}:hover .outline-start::before,:hover .outline-end::before,:hover .outline-panel-inactive,:hover .outline-panel-inactive::before,:hover .outline-panel-inactive::after{border-width:var(--_hover-outline-width)}.focused .outline{border-color:var(--_focus-outline-color);color:var(--_focus-outline-color)}.outline-start::after,.outline-end::after,.outline-panel-active,.outline-panel-active::before,.outline-panel-active::after{border-width:var(--_focus-outline-width)}.disabled .outline{border-color:var(--_disabled-outline-color);color:var(--_disabled-outline-color)}.disabled .outline-start,.disabled .outline-end,.disabled .outline-panel-inactive{opacity:var(--_disabled-outline-opacity)}.disabled .outline-start::before,.disabled .outline-end::before,.disabled .outline-panel-inactive,.disabled .outline-panel-inactive::before,.disabled .outline-panel-inactive::after{border-width:var(--_disabled-outline-width)}.error .outline{border-color:var(--_error-outline-color);color:var(--_error-outline-color)}.error:hover .outline{border-color:var(--_error-hover-outline-color);color:var(--_error-hover-outline-color)}.error.focused .outline{border-color:var(--_error-focus-outline-color);color:var(--_error-focus-outline-color)}.resizable .container{bottom:var(--_focus-outline-width);inset-inline-end:var(--_focus-outline-width);clip-path:inset(var(--_focus-outline-width) 0 0 var(--_focus-outline-width))}.resizable .container>*{top:var(--_focus-outline-width);inset-inline-start:var(--_focus-outline-width)}.resizable .container:dir(rtl){clip-path:inset(var(--_focus-outline-width) var(--_focus-outline-width) 0 0)}}@layer hcm{@media(forced-colors: active){.disabled .outline{border-color:GrayText;color:GrayText}.disabled :is(.outline-start,.outline-end,.outline-panel-inactive){opacity:1}}}
`;
  var outlined_styles_cssresult_default2 = styles29.styleSheet;

  // ../field/outlined-field.js
  var MdOutlinedField = class MdOutlinedField2 extends OutlinedField {
  };
  MdOutlinedField.styles = [styles28, styles29];
  MdOutlinedField = __decorate([
    e("md-outlined-field")
  ], MdOutlinedField);

  // ../icon/internal/icon.js
  var Icon = class extends s3 {
    render() {
      return T`<slot></slot>`;
    }
    connectedCallback() {
      super.connectedCallback();
      const ariaHidden = this.getAttribute("aria-hidden");
      if (ariaHidden === "false") {
        this.removeAttribute("aria-hidden");
        return;
      }
      this.setAttribute("aria-hidden", "true");
    }
  };

  // ../icon/internal/icon-styles.cssresult.js
  var styles30 = i3`:host{font-size:var(--md-icon-size, 24px);width:var(--md-icon-size, 24px);height:var(--md-icon-size, 24px);color:inherit;font-variation-settings:inherit;font-weight:400;font-family:var(--md-icon-font, Material Symbols Outlined);display:inline-flex;font-style:normal;place-items:center;place-content:center;line-height:1;overflow:hidden;letter-spacing:normal;text-transform:none;user-select:none;white-space:nowrap;word-wrap:normal;flex-shrink:0;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-moz-osx-font-smoothing:grayscale}::slotted(svg){fill:currentColor}::slotted(*){height:100%;width:100%}
`;
  var icon_styles_cssresult_default = styles30.styleSheet;

  // ../icon/icon.js
  var MdIcon = class MdIcon2 extends Icon {
  };
  MdIcon.styles = [styles30];
  MdIcon = __decorate([
    e("md-icon")
  ], MdIcon);

  // ../iconbutton/internal/filled-styles.cssresult.js
  var styles31 = i3`:host{--_container-color: var(--md-filled-icon-button-container-color, var(--md-sys-color-primary, #6750a4));--_container-height: var(--md-filled-icon-button-container-height, 40px);--_container-width: var(--md-filled-icon-button-container-width, 40px);--_disabled-container-color: var(--md-filled-icon-button-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-container-opacity: var(--md-filled-icon-button-disabled-container-opacity, 0.12);--_disabled-icon-color: var(--md-filled-icon-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-filled-icon-button-disabled-icon-opacity, 0.38);--_focus-icon-color: var(--md-filled-icon-button-focus-icon-color, var(--md-sys-color-on-primary, #fff));--_hover-icon-color: var(--md-filled-icon-button-hover-icon-color, var(--md-sys-color-on-primary, #fff));--_hover-state-layer-color: var(--md-filled-icon-button-hover-state-layer-color, var(--md-sys-color-on-primary, #fff));--_hover-state-layer-opacity: var(--md-filled-icon-button-hover-state-layer-opacity, 0.08);--_icon-color: var(--md-filled-icon-button-icon-color, var(--md-sys-color-on-primary, #fff));--_icon-size: var(--md-filled-icon-button-icon-size, 24px);--_pressed-icon-color: var(--md-filled-icon-button-pressed-icon-color, var(--md-sys-color-on-primary, #fff));--_pressed-state-layer-color: var(--md-filled-icon-button-pressed-state-layer-color, var(--md-sys-color-on-primary, #fff));--_pressed-state-layer-opacity: var(--md-filled-icon-button-pressed-state-layer-opacity, 0.12);--_selected-container-color: var(--md-filled-icon-button-selected-container-color, var(--md-sys-color-primary, #6750a4));--_toggle-selected-focus-icon-color: var(--md-filled-icon-button-toggle-selected-focus-icon-color, var(--md-sys-color-on-primary, #fff));--_toggle-selected-hover-icon-color: var(--md-filled-icon-button-toggle-selected-hover-icon-color, var(--md-sys-color-on-primary, #fff));--_toggle-selected-hover-state-layer-color: var(--md-filled-icon-button-toggle-selected-hover-state-layer-color, var(--md-sys-color-on-primary, #fff));--_toggle-selected-icon-color: var(--md-filled-icon-button-toggle-selected-icon-color, var(--md-sys-color-on-primary, #fff));--_toggle-selected-pressed-icon-color: var(--md-filled-icon-button-toggle-selected-pressed-icon-color, var(--md-sys-color-on-primary, #fff));--_toggle-selected-pressed-state-layer-color: var(--md-filled-icon-button-toggle-selected-pressed-state-layer-color, var(--md-sys-color-on-primary, #fff));--_unselected-container-color: var(--md-filled-icon-button-unselected-container-color, var(--md-sys-color-surface-container-highest, #e6e0e9));--_toggle-focus-icon-color: var(--md-filled-icon-button-toggle-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_toggle-hover-icon-color: var(--md-filled-icon-button-toggle-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_toggle-hover-state-layer-color: var(--md-filled-icon-button-toggle-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_toggle-icon-color: var(--md-filled-icon-button-toggle-icon-color, var(--md-sys-color-primary, #6750a4));--_toggle-pressed-icon-color: var(--md-filled-icon-button-toggle-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_toggle-pressed-state-layer-color: var(--md-filled-icon-button-toggle-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_container-shape-start-start: var(--md-filled-icon-button-container-shape-start-start, var(--md-filled-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-filled-icon-button-container-shape-start-end, var(--md-filled-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-filled-icon-button-container-shape-end-end, var(--md-filled-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-filled-icon-button-container-shape-end-start, var(--md-filled-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)))}.icon-button{color:var(--_icon-color)}.icon-button:hover{color:var(--_hover-icon-color)}.icon-button:focus{color:var(--_focus-icon-color)}.icon-button:active{color:var(--_pressed-icon-color)}.icon-button:is(:disabled,[aria-disabled=true]){color:var(--_disabled-icon-color)}.icon-button{--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}.icon-button::before{background-color:var(--_container-color);border-radius:inherit;content:"";inset:0;position:absolute;z-index:-1}.icon-button:is(:disabled,[aria-disabled=true])::before{background-color:var(--_disabled-container-color);opacity:var(--_disabled-container-opacity)}.icon-button:is(:disabled,[aria-disabled=true]) .icon{opacity:var(--_disabled-icon-opacity)}.toggle-filled:not(:disabled,[aria-disabled=true]){color:var(--_toggle-icon-color)}.toggle-filled:not(:disabled,[aria-disabled=true]):hover{color:var(--_toggle-hover-icon-color)}.toggle-filled:not(:disabled,[aria-disabled=true]):focus{color:var(--_toggle-focus-icon-color)}.toggle-filled:not(:disabled,[aria-disabled=true]):active{color:var(--_toggle-pressed-icon-color)}.toggle-filled{--md-ripple-hover-color: var(--_toggle-hover-state-layer-color);--md-ripple-pressed-color: var(--_toggle-pressed-state-layer-color)}.toggle-filled:not(:disabled,[aria-disabled=true])::before{background-color:var(--_unselected-container-color)}.selected:not(:disabled,[aria-disabled=true]){color:var(--_toggle-selected-icon-color)}.selected:not(:disabled,[aria-disabled=true]):hover{color:var(--_toggle-selected-hover-icon-color)}.selected:not(:disabled,[aria-disabled=true]):focus{color:var(--_toggle-selected-focus-icon-color)}.selected:not(:disabled,[aria-disabled=true]):active{color:var(--_toggle-selected-pressed-icon-color)}.selected{--md-ripple-hover-color: var(--_toggle-selected-hover-state-layer-color);--md-ripple-pressed-color: var(--_toggle-selected-pressed-state-layer-color)}.selected:not(:disabled,[aria-disabled=true])::before{background-color:var(--_selected-container-color)}
`;
  var filled_styles_cssresult_default3 = styles31.styleSheet;

  // ../node_modules/lit-html/node/static.js
  var e9 = /* @__PURE__ */ Symbol.for("");
  var l5 = (t7) => {
    if ((null == t7 ? void 0 : t7.r) === e9) return null == t7 ? void 0 : t7._$litStatic$;
  };
  var i6 = (t7, ...r8) => ({ _$litStatic$: r8.reduce(((r9, e13, l11) => r9 + ((t8) => {
    if (void 0 !== t8._$litStatic$) return t8._$litStatic$;
    throw Error(`Value passed to 'literal' function must be a 'literal' result: ${t8}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`);
  })(e13) + t7[l11 + 1]), t7[0]), r: e9 });
  var s4 = /* @__PURE__ */ new Map();
  var a3 = (t7) => (r8, ...e13) => {
    const o11 = e13.length;
    let i10, a7;
    const n13 = [], u6 = [];
    let c7, $3 = 0, f4 = false;
    for (; $3 < o11; ) {
      for (c7 = r8[$3]; $3 < o11 && void 0 !== (a7 = e13[$3], i10 = l5(a7)); ) c7 += i10 + r8[++$3], f4 = true;
      $3 !== o11 && u6.push(a7), n13.push(c7), $3++;
    }
    if ($3 === o11 && n13.push(r8[o11]), f4) {
      const t8 = n13.join("$$lit$$");
      void 0 === (r8 = s4.get(t8)) && (n13.raw = n13, s4.set(t8, r8 = n13)), e13 = u6;
    }
    return t7(r8, ...e13);
  };
  var n7 = a3(T);
  var u3 = a3(b);

  // ../internal/controller/is-rtl.js
  function isRtl(el, shouldCheck = true) {
    return shouldCheck && getComputedStyle(el).getPropertyValue("direction").trim() === "rtl";
  }

  // ../iconbutton/internal/icon-button.js
  var iconButtonBaseClass = mixinDelegatesAria(mixinFormSubmitter(mixinFormAssociated(mixinElementInternals(s3))));
  var IconButton = class extends iconButtonBaseClass {
    constructor() {
      super();
      this.softDisabled = false;
      this.flipIconInRtl = false;
      this.href = "";
      this.download = "";
      this.target = "";
      this.rel = "";
      this.referrerPolicy = "";
      this.ariaLabelSelected = "";
      this.toggle = false;
      this.selected = false;
      this.flipIcon = isRtl(this, this.flipIconInRtl);
      if (o7)
        return;
      setupDispatchHooks(this, "click");
      this.addEventListener("click", (event) => {
        if (this.softDisabled || this.disabled && this.href) {
          event.stopImmediatePropagation();
          event.preventDefault();
          return;
        }
        const wasSelected = this.selected;
        afterDispatch(event, () => {
          if (!this.toggle || this.disabled || event.defaultPrevented) {
            return;
          }
          this.selected = !wasSelected;
          this.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true }));
          this.dispatchEvent(new Event("change", { bubbles: true }));
        });
      }, { capture: true });
    }
    willUpdate() {
      if (this.href) {
        this.disabled = false;
        this.softDisabled = false;
      }
    }
    render() {
      const tag = this.href ? i6`div` : i6`button`;
      const { ariaLabel, ariaHasPopup, ariaExpanded } = this;
      const hasToggledAriaLabel = ariaLabel && this.ariaLabelSelected;
      const ariaPressedValue = !this.toggle ? A : this.selected;
      let ariaLabelValue = A;
      if (!this.href) {
        ariaLabelValue = hasToggledAriaLabel && this.selected ? this.ariaLabelSelected : ariaLabel;
      }
      return n7`<${tag}
        class="icon-button ${o8(this.getRenderClasses())}"
        id="button"
        aria-label="${ariaLabelValue || A}"
        aria-haspopup="${!this.href && ariaHasPopup || A}"
        aria-expanded="${!this.href && ariaExpanded || A}"
        aria-pressed="${ariaPressedValue}"
        aria-disabled=${!this.href && this.softDisabled || A}
        ?disabled="${!this.href && this.disabled}">
        ${this.renderFocusRing()}
        ${this.renderRipple()}
        ${!this.selected ? this.renderIcon() : A}
        ${this.selected ? this.renderSelectedIcon() : A}
        ${this.href ? this.renderLink() : this.renderTouchTarget()}
  </${tag}>`;
    }
    renderLink() {
      const { ariaLabel } = this;
      return T`
      <a
        class="link"
        id="link"
        href=${safeHref(this.href)}
        download="${this.download || A}"
        target="${this.target || A}"
        rel=${this.rel || A}
        referrerpolicy=${this.referrerPolicy || A}
        aria-label="${ariaLabel || A}">
        ${this.renderTouchTarget()}
      </a>
    `;
    }
    getRenderClasses() {
      return {
        "flip-icon": this.flipIcon,
        "selected": this.toggle && this.selected
      };
    }
    renderIcon() {
      return T`<span class="icon"><slot></slot></span>`;
    }
    renderSelectedIcon() {
      return T`<span class="icon icon--selected"
      ><slot name="selected"><slot></slot></slot
    ></span>`;
    }
    renderTouchTarget() {
      return T`<span class="touch"></span>`;
    }
    renderFocusRing() {
      return T`<md-focus-ring
      part="focus-ring"
      for=${this.href ? "link" : "button"}></md-focus-ring>`;
    }
    renderRipple() {
      const isRippleDisabled = !this.href && (this.disabled || this.softDisabled);
      return T`<md-ripple
      for=${this.href ? "link" : A}
      ?disabled="${isRippleDisabled}"></md-ripple>`;
    }
    connectedCallback() {
      this.flipIcon = isRtl(this, this.flipIconInRtl);
      super.connectedCallback();
    }
  };
  IconButton.shadowRootOptions = {
    mode: "open",
    delegatesFocus: true
  };
  __decorate([
    n({ type: Boolean, attribute: "soft-disabled", reflect: true })
  ], IconButton.prototype, "softDisabled", void 0);
  __decorate([
    n({ type: Boolean, attribute: "flip-icon-in-rtl" })
  ], IconButton.prototype, "flipIconInRtl", void 0);
  __decorate([
    n()
  ], IconButton.prototype, "href", void 0);
  __decorate([
    n()
  ], IconButton.prototype, "download", void 0);
  __decorate([
    n()
  ], IconButton.prototype, "target", void 0);
  __decorate([
    n()
  ], IconButton.prototype, "rel", void 0);
  __decorate([
    n()
  ], IconButton.prototype, "referrerPolicy", void 0);
  __decorate([
    n({ attribute: "aria-label-selected" })
  ], IconButton.prototype, "ariaLabelSelected", void 0);
  __decorate([
    n({ type: Boolean })
  ], IconButton.prototype, "toggle", void 0);
  __decorate([
    n({ type: Boolean, reflect: true })
  ], IconButton.prototype, "selected", void 0);
  __decorate([
    t()
  ], IconButton.prototype, "flipIcon", void 0);

  // ../iconbutton/internal/shared-styles.cssresult.js
  var styles32 = i3`:host{display:inline-flex;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0);height:var(--_container-height);width:var(--_container-width);justify-content:center}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_container-height))/2) max(0px,(48px - var(--_container-width))/2)}md-focus-ring{--md-focus-ring-shape-start-start: var(--_container-shape-start-start);--md-focus-ring-shape-start-end: var(--_container-shape-start-end);--md-focus-ring-shape-end-end: var(--_container-shape-end-end);--md-focus-ring-shape-end-start: var(--_container-shape-end-start)}:host(:is([disabled],[soft-disabled])){pointer-events:none}.icon-button{place-items:center;background:none;border:none;box-sizing:border-box;cursor:pointer;display:flex;place-content:center;outline:none;padding:0;position:relative;text-decoration:none;user-select:none;z-index:0;flex:1;border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end)}.icon ::slotted(*){font-size:var(--_icon-size);height:var(--_icon-size);width:var(--_icon-size);font-weight:inherit}md-ripple{z-index:-1;border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end)}.flip-icon .icon{transform:scaleX(-1)}.icon{display:inline-flex}.link{display:grid;height:100%;outline:none;place-items:center;position:absolute;width:100%}.touch{position:absolute;height:max(48px,100%);width:max(48px,100%)}:host([touch-target=none]) .touch{display:none}@media(forced-colors: active){:host(:is([disabled],[soft-disabled])){--_disabled-icon-color: GrayText;--_disabled-icon-opacity: 1}}
`;
  var shared_styles_cssresult_default5 = styles32.styleSheet;

  // ../iconbutton/filled-icon-button.js
  var MdFilledIconButton = class MdFilledIconButton2 extends IconButton {
    getRenderClasses() {
      return {
        ...super.getRenderClasses(),
        "filled": true,
        "toggle-filled": this.toggle
      };
    }
  };
  MdFilledIconButton.styles = [styles32, styles31];
  MdFilledIconButton = __decorate([
    e("md-filled-icon-button")
  ], MdFilledIconButton);

  // ../iconbutton/internal/filled-tonal-styles.cssresult.js
  var styles33 = i3`:host{--_container-color: var(--md-filled-tonal-icon-button-container-color, var(--md-sys-color-secondary-container, #e8def8));--_container-height: var(--md-filled-tonal-icon-button-container-height, 40px);--_container-width: var(--md-filled-tonal-icon-button-container-width, 40px);--_disabled-container-color: var(--md-filled-tonal-icon-button-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-container-opacity: var(--md-filled-tonal-icon-button-disabled-container-opacity, 0.12);--_disabled-icon-color: var(--md-filled-tonal-icon-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-filled-tonal-icon-button-disabled-icon-opacity, 0.38);--_focus-icon-color: var(--md-filled-tonal-icon-button-focus-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_hover-icon-color: var(--md-filled-tonal-icon-button-hover-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_hover-state-layer-color: var(--md-filled-tonal-icon-button-hover-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_hover-state-layer-opacity: var(--md-filled-tonal-icon-button-hover-state-layer-opacity, 0.08);--_icon-color: var(--md-filled-tonal-icon-button-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_icon-size: var(--md-filled-tonal-icon-button-icon-size, 24px);--_pressed-icon-color: var(--md-filled-tonal-icon-button-pressed-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_pressed-state-layer-color: var(--md-filled-tonal-icon-button-pressed-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_pressed-state-layer-opacity: var(--md-filled-tonal-icon-button-pressed-state-layer-opacity, 0.12);--_selected-container-color: var(--md-filled-tonal-icon-button-selected-container-color, var(--md-sys-color-secondary-container, #e8def8));--_toggle-selected-focus-icon-color: var(--md-filled-tonal-icon-button-toggle-selected-focus-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_toggle-selected-hover-icon-color: var(--md-filled-tonal-icon-button-toggle-selected-hover-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_toggle-selected-hover-state-layer-color: var(--md-filled-tonal-icon-button-toggle-selected-hover-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_toggle-selected-icon-color: var(--md-filled-tonal-icon-button-toggle-selected-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_toggle-selected-pressed-icon-color: var(--md-filled-tonal-icon-button-toggle-selected-pressed-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_toggle-selected-pressed-state-layer-color: var(--md-filled-tonal-icon-button-toggle-selected-pressed-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_unselected-container-color: var(--md-filled-tonal-icon-button-unselected-container-color, var(--md-sys-color-surface-container-highest, #e6e0e9));--_toggle-focus-icon-color: var(--md-filled-tonal-icon-button-toggle-focus-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_toggle-hover-icon-color: var(--md-filled-tonal-icon-button-toggle-hover-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_toggle-hover-state-layer-color: var(--md-filled-tonal-icon-button-toggle-hover-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_toggle-icon-color: var(--md-filled-tonal-icon-button-toggle-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_toggle-pressed-icon-color: var(--md-filled-tonal-icon-button-toggle-pressed-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_toggle-pressed-state-layer-color: var(--md-filled-tonal-icon-button-toggle-pressed-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_container-shape-start-start: var(--md-filled-tonal-icon-button-container-shape-start-start, var(--md-filled-tonal-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-filled-tonal-icon-button-container-shape-start-end, var(--md-filled-tonal-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-filled-tonal-icon-button-container-shape-end-end, var(--md-filled-tonal-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-filled-tonal-icon-button-container-shape-end-start, var(--md-filled-tonal-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)))}.icon-button{color:var(--_icon-color)}.icon-button:hover{color:var(--_hover-icon-color)}.icon-button:focus{color:var(--_focus-icon-color)}.icon-button:active{color:var(--_pressed-icon-color)}.icon-button:is(:disabled,[aria-disabled=true]){color:var(--_disabled-icon-color)}.icon-button{--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}.icon-button::before{background-color:var(--_container-color);border-radius:inherit;content:"";inset:0;position:absolute;z-index:-1}.icon-button:is(:disabled,[aria-disabled=true])::before{background-color:var(--_disabled-container-color);opacity:var(--_disabled-container-opacity)}.icon-button:is(:disabled,[aria-disabled=true]) .icon{opacity:var(--_disabled-icon-opacity)}.toggle-filled-tonal:not(:disabled,[aria-disabled=true]){color:var(--_toggle-icon-color)}.toggle-filled-tonal:not(:disabled,[aria-disabled=true]):hover{color:var(--_toggle-hover-icon-color)}.toggle-filled-tonal:not(:disabled,[aria-disabled=true]):focus{color:var(--_toggle-focus-icon-color)}.toggle-filled-tonal:not(:disabled,[aria-disabled=true]):active{color:var(--_toggle-pressed-icon-color)}.toggle-filled-tonal{--md-ripple-hover-color: var(--_toggle-hover-state-layer-color);--md-ripple-pressed-color: var(--_toggle-pressed-state-layer-color)}.toggle-filled-tonal:not(:disabled,[aria-disabled=true])::before{background-color:var(--_unselected-container-color)}.selected:not(:disabled,[aria-disabled=true]){color:var(--_toggle-selected-icon-color)}.selected:not(:disabled,[aria-disabled=true]):hover{color:var(--_toggle-selected-hover-icon-color)}.selected:not(:disabled,[aria-disabled=true]):focus{color:var(--_toggle-selected-focus-icon-color)}.selected:not(:disabled,[aria-disabled=true]):active{color:var(--_toggle-selected-pressed-icon-color)}.selected{--md-ripple-hover-color: var(--_toggle-selected-hover-state-layer-color);--md-ripple-pressed-color: var(--_toggle-selected-pressed-state-layer-color)}.selected:not(:disabled,[aria-disabled=true])::before{background-color:var(--_selected-container-color)}
`;
  var filled_tonal_styles_cssresult_default2 = styles33.styleSheet;

  // ../iconbutton/filled-tonal-icon-button.js
  var MdFilledTonalIconButton = class MdFilledTonalIconButton2 extends IconButton {
    getRenderClasses() {
      return {
        ...super.getRenderClasses(),
        "filled-tonal": true,
        "toggle-filled-tonal": this.toggle
      };
    }
  };
  MdFilledTonalIconButton.styles = [styles32, styles33];
  MdFilledTonalIconButton = __decorate([
    e("md-filled-tonal-icon-button")
  ], MdFilledTonalIconButton);

  // ../iconbutton/internal/standard-styles.cssresult.js
  var styles34 = i3`:host{--_disabled-icon-color: var(--md-icon-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-icon-button-disabled-icon-opacity, 0.38);--_icon-size: var(--md-icon-button-icon-size, 24px);--_selected-focus-icon-color: var(--md-icon-button-selected-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-hover-icon-color: var(--md-icon-button-selected-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-hover-state-layer-color: var(--md-icon-button-selected-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_selected-hover-state-layer-opacity: var(--md-icon-button-selected-hover-state-layer-opacity, 0.08);--_selected-icon-color: var(--md-icon-button-selected-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-pressed-icon-color: var(--md-icon-button-selected-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-pressed-state-layer-color: var(--md-icon-button-selected-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_selected-pressed-state-layer-opacity: var(--md-icon-button-selected-pressed-state-layer-opacity, 0.12);--_state-layer-height: var(--md-icon-button-state-layer-height, 40px);--_state-layer-shape: var(--md-icon-button-state-layer-shape, var(--md-sys-shape-corner-full, 9999px));--_state-layer-width: var(--md-icon-button-state-layer-width, 40px);--_focus-icon-color: var(--md-icon-button-focus-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-icon-color: var(--md-icon-button-hover-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-color: var(--md-icon-button-hover-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-opacity: var(--md-icon-button-hover-state-layer-opacity, 0.08);--_icon-color: var(--md-icon-button-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-icon-color: var(--md-icon-button-pressed-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-state-layer-color: var(--md-icon-button-pressed-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-state-layer-opacity: var(--md-icon-button-pressed-state-layer-opacity, 0.12);--_container-shape-start-start: 0;--_container-shape-start-end: 0;--_container-shape-end-end: 0;--_container-shape-end-start: 0;--_container-height: 0;--_container-width: 0;height:var(--_state-layer-height);width:var(--_state-layer-width)}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_state-layer-height))/2) max(0px,(48px - var(--_state-layer-width))/2)}md-focus-ring{--md-focus-ring-shape-start-start: var(--_state-layer-shape);--md-focus-ring-shape-start-end: var(--_state-layer-shape);--md-focus-ring-shape-end-end: var(--_state-layer-shape);--md-focus-ring-shape-end-start: var(--_state-layer-shape)}.standard{background-color:rgba(0,0,0,0);color:var(--_icon-color);--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}.standard:hover{color:var(--_hover-icon-color)}.standard:focus{color:var(--_focus-icon-color)}.standard:active{color:var(--_pressed-icon-color)}.standard:is(:disabled,[aria-disabled=true]){color:var(--_disabled-icon-color)}md-ripple{border-radius:var(--_state-layer-shape)}.standard:is(:disabled,[aria-disabled=true]){opacity:var(--_disabled-icon-opacity)}.selected:not(:disabled,[aria-disabled=true]){color:var(--_selected-icon-color)}.selected:not(:disabled,[aria-disabled=true]):hover{color:var(--_selected-hover-icon-color)}.selected:not(:disabled,[aria-disabled=true]):focus{color:var(--_selected-focus-icon-color)}.selected:not(:disabled,[aria-disabled=true]):active{color:var(--_selected-pressed-icon-color)}.selected{--md-ripple-hover-color: var(--_selected-hover-state-layer-color);--md-ripple-hover-opacity: var(--_selected-hover-state-layer-opacity);--md-ripple-pressed-color: var(--_selected-pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_selected-pressed-state-layer-opacity)}
`;
  var standard_styles_cssresult_default = styles34.styleSheet;

  // ../iconbutton/icon-button.js
  var MdIconButton = class MdIconButton2 extends IconButton {
    getRenderClasses() {
      return {
        ...super.getRenderClasses(),
        "standard": true
      };
    }
  };
  MdIconButton.styles = [styles32, styles34];
  MdIconButton = __decorate([
    e("md-icon-button")
  ], MdIconButton);

  // ../iconbutton/internal/outlined-styles.cssresult.js
  var styles35 = i3`:host{--_container-height: var(--md-outlined-icon-button-container-height, 40px);--_container-width: var(--md-outlined-icon-button-container-width, 40px);--_disabled-icon-color: var(--md-outlined-icon-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-outlined-icon-button-disabled-icon-opacity, 0.38);--_disabled-selected-container-color: var(--md-outlined-icon-button-disabled-selected-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-selected-container-opacity: var(--md-outlined-icon-button-disabled-selected-container-opacity, 0.12);--_hover-state-layer-opacity: var(--md-outlined-icon-button-hover-state-layer-opacity, 0.08);--_icon-size: var(--md-outlined-icon-button-icon-size, 24px);--_pressed-state-layer-opacity: var(--md-outlined-icon-button-pressed-state-layer-opacity, 0.12);--_selected-container-color: var(--md-outlined-icon-button-selected-container-color, var(--md-sys-color-inverse-surface, #322f35));--_selected-focus-icon-color: var(--md-outlined-icon-button-selected-focus-icon-color, var(--md-sys-color-inverse-on-surface, #f5eff7));--_selected-hover-icon-color: var(--md-outlined-icon-button-selected-hover-icon-color, var(--md-sys-color-inverse-on-surface, #f5eff7));--_selected-hover-state-layer-color: var(--md-outlined-icon-button-selected-hover-state-layer-color, var(--md-sys-color-inverse-on-surface, #f5eff7));--_selected-icon-color: var(--md-outlined-icon-button-selected-icon-color, var(--md-sys-color-inverse-on-surface, #f5eff7));--_selected-pressed-icon-color: var(--md-outlined-icon-button-selected-pressed-icon-color, var(--md-sys-color-inverse-on-surface, #f5eff7));--_selected-pressed-state-layer-color: var(--md-outlined-icon-button-selected-pressed-state-layer-color, var(--md-sys-color-inverse-on-surface, #f5eff7));--_disabled-outline-color: var(--md-outlined-icon-button-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-opacity: var(--md-outlined-icon-button-disabled-outline-opacity, 0.12);--_focus-icon-color: var(--md-outlined-icon-button-focus-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-icon-color: var(--md-outlined-icon-button-hover-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-color: var(--md-outlined-icon-button-hover-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_icon-color: var(--md-outlined-icon-button-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_outline-color: var(--md-outlined-icon-button-outline-color, var(--md-sys-color-outline, #79747e));--_outline-width: var(--md-outlined-icon-button-outline-width, 1px);--_pressed-icon-color: var(--md-outlined-icon-button-pressed-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_pressed-state-layer-color: var(--md-outlined-icon-button-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_container-shape-start-start: var(--md-outlined-icon-button-container-shape-start-start, var(--md-outlined-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-outlined-icon-button-container-shape-start-end, var(--md-outlined-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-outlined-icon-button-container-shape-end-end, var(--md-outlined-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-outlined-icon-button-container-shape-end-start, var(--md-outlined-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)))}.outlined{background-color:rgba(0,0,0,0);color:var(--_icon-color);--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}.outlined::before{border-color:var(--_outline-color);border-width:var(--_outline-width)}.outlined:hover{color:var(--_hover-icon-color)}.outlined:focus{color:var(--_focus-icon-color)}.outlined:active{color:var(--_pressed-icon-color)}.outlined:is(:disabled,[aria-disabled=true]){color:var(--_disabled-icon-color)}.outlined:is(:disabled,[aria-disabled=true])::before{border-color:var(--_disabled-outline-color);opacity:var(--_disabled-outline-opacity)}.outlined:is(:disabled,[aria-disabled=true]) .icon{opacity:var(--_disabled-icon-opacity)}.outlined::before{block-size:100%;border-style:solid;border-radius:inherit;box-sizing:border-box;content:"";inline-size:100%;inset:0;pointer-events:none;position:absolute;z-index:-1}.outlined.selected::before{border-width:0}.selected:not(:disabled,[aria-disabled=true]){color:var(--_selected-icon-color)}.selected:not(:disabled,[aria-disabled=true]):hover{color:var(--_selected-hover-icon-color)}.selected:not(:disabled,[aria-disabled=true]):focus{color:var(--_selected-focus-icon-color)}.selected:not(:disabled,[aria-disabled=true]):active{color:var(--_selected-pressed-icon-color)}.selected{--md-ripple-hover-color: var(--_selected-hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_selected-pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}.selected:not(:disabled,[aria-disabled=true])::before{background-color:var(--_selected-container-color)}.selected:is(:disabled,[aria-disabled=true])::before{background-color:var(--_disabled-selected-container-color);opacity:var(--_disabled-selected-container-opacity)}@media(forced-colors: active){:host(:is([disabled],[soft-disabled])){--_disabled-outline-opacity: 1}.selected::before{border-color:CanvasText;border-width:var(--_outline-width)}.selected:is(:disabled,[aria-disabled=true])::before{border-color:GrayText;opacity:1}}
`;
  var outlined_styles_cssresult_default3 = styles35.styleSheet;

  // ../iconbutton/outlined-icon-button.js
  var MdOutlinedIconButton = class MdOutlinedIconButton2 extends IconButton {
    getRenderClasses() {
      return {
        ...super.getRenderClasses(),
        "outlined": true
      };
    }
  };
  MdOutlinedIconButton.styles = [styles32, styles35];
  MdOutlinedIconButton = __decorate([
    e("md-outlined-icon-button")
  ], MdOutlinedIconButton);

  // ../list/internal/list-navigation-helpers.js
  function activateFirstItem(items, isActivatable = isItemNotDisabled) {
    const firstItem = getFirstActivatableItem(items, isActivatable);
    if (firstItem) {
      firstItem.tabIndex = 0;
      firstItem.focus();
    }
    return firstItem;
  }
  function activateLastItem(items, isActivatable = isItemNotDisabled) {
    const lastItem = getLastActivatableItem(items, isActivatable);
    if (lastItem) {
      lastItem.tabIndex = 0;
      lastItem.focus();
    }
    return lastItem;
  }
  function deactivateActiveItem(items, isActivatable = isItemNotDisabled) {
    const activeItem = getActiveItem(items, isActivatable);
    if (activeItem) {
      activeItem.item.tabIndex = -1;
    }
    return activeItem;
  }
  function getActiveItem(items, isActivatable = isItemNotDisabled) {
    for (let i10 = 0; i10 < items.length; i10++) {
      const item = items[i10];
      if (item.tabIndex === 0 && isActivatable(item)) {
        return {
          item,
          index: i10
        };
      }
    }
    return null;
  }
  function getFirstActivatableItem(items, isActivatable = isItemNotDisabled) {
    for (const item of items) {
      if (isActivatable(item)) {
        return item;
      }
    }
    return null;
  }
  function getLastActivatableItem(items, isActivatable = isItemNotDisabled) {
    for (let i10 = items.length - 1; i10 >= 0; i10--) {
      const item = items[i10];
      if (isActivatable(item)) {
        return item;
      }
    }
    return null;
  }
  function getNextItem(items, index, isActivatable = isItemNotDisabled, wrap = true) {
    for (let i10 = 1; i10 < items.length; i10++) {
      const nextIndex = (i10 + index) % items.length;
      if (nextIndex < index && !wrap) {
        return null;
      }
      const item = items[nextIndex];
      if (isActivatable(item)) {
        return item;
      }
    }
    return items[index] ? items[index] : null;
  }
  function getPrevItem(items, index, isActivatable = isItemNotDisabled, wrap = true) {
    for (let i10 = 1; i10 < items.length; i10++) {
      const prevIndex = (index - i10 + items.length) % items.length;
      if (prevIndex > index && !wrap) {
        return null;
      }
      const item = items[prevIndex];
      if (isActivatable(item)) {
        return item;
      }
    }
    return items[index] ? items[index] : null;
  }
  function activateNextItem(items, activeItemRecord, isActivatable = isItemNotDisabled, wrap = true) {
    if (activeItemRecord) {
      const next = getNextItem(items, activeItemRecord.index, isActivatable, wrap);
      if (next) {
        next.tabIndex = 0;
        next.focus();
      }
      return next;
    } else {
      return activateFirstItem(items, isActivatable);
    }
  }
  function activatePreviousItem(items, activeItemRecord, isActivatable = isItemNotDisabled, wrap = true) {
    if (activeItemRecord) {
      const prev = getPrevItem(items, activeItemRecord.index, isActivatable, wrap);
      if (prev) {
        prev.tabIndex = 0;
        prev.focus();
      }
      return prev;
    } else {
      return activateLastItem(items, isActivatable);
    }
  }
  function createDeactivateItemsEvent() {
    return new Event("deactivate-items", { bubbles: true, composed: true });
  }
  function createRequestActivationEvent() {
    return new Event("request-activation", { bubbles: true, composed: true });
  }
  function isItemNotDisabled(item) {
    return !item.disabled;
  }

  // ../list/internal/list-controller.js
  var NavigableKeys = {
    ArrowDown: "ArrowDown",
    ArrowLeft: "ArrowLeft",
    ArrowUp: "ArrowUp",
    ArrowRight: "ArrowRight",
    Home: "Home",
    End: "End"
  };
  var ListController = class {
    constructor(config) {
      this.handleKeydown = (event) => {
        const key = event.key;
        if (event.defaultPrevented || !this.isNavigableKey(key)) {
          return;
        }
        const items = this.items;
        if (!items.length) {
          return;
        }
        const activeItemRecord = getActiveItem(items, this.isActivatable);
        event.preventDefault();
        const isRtl3 = this.isRtl();
        const inlinePrevious = isRtl3 ? NavigableKeys.ArrowRight : NavigableKeys.ArrowLeft;
        const inlineNext = isRtl3 ? NavigableKeys.ArrowLeft : NavigableKeys.ArrowRight;
        let nextActiveItem = null;
        switch (key) {
          // Activate the next item
          case NavigableKeys.ArrowDown:
          case inlineNext:
            nextActiveItem = activateNextItem(items, activeItemRecord, this.isActivatable, this.wrapNavigation());
            break;
          // Activate the previous item
          case NavigableKeys.ArrowUp:
          case inlinePrevious:
            nextActiveItem = activatePreviousItem(items, activeItemRecord, this.isActivatable, this.wrapNavigation());
            break;
          // Activate the first item
          case NavigableKeys.Home:
            nextActiveItem = activateFirstItem(items, this.isActivatable);
            break;
          // Activate the last item
          case NavigableKeys.End:
            nextActiveItem = activateLastItem(items, this.isActivatable);
            break;
          default:
            break;
        }
        if (nextActiveItem && activeItemRecord && activeItemRecord.item !== nextActiveItem) {
          activeItemRecord.item.tabIndex = -1;
        }
      };
      this.onDeactivateItems = () => {
        const items = this.items;
        for (const item of items) {
          this.deactivateItem(item);
        }
      };
      this.onRequestActivation = (event) => {
        this.onDeactivateItems();
        const target = event.target;
        this.activateItem(target);
        target.focus();
      };
      this.onSlotchange = () => {
        const items = this.items;
        let encounteredActivated = false;
        for (const item of items) {
          const isActivated = !item.disabled && item.tabIndex > -1;
          if (isActivated && !encounteredActivated) {
            encounteredActivated = true;
            item.tabIndex = 0;
            continue;
          }
          item.tabIndex = -1;
        }
        if (encounteredActivated) {
          return;
        }
        const firstActivatableItem = getFirstActivatableItem(items, this.isActivatable);
        if (!firstActivatableItem) {
          return;
        }
        firstActivatableItem.tabIndex = 0;
      };
      const { isItem, getPossibleItems, isRtl: isRtl2, deactivateItem, activateItem, isNavigableKey, isActivatable, wrapNavigation } = config;
      this.isItem = isItem;
      this.getPossibleItems = getPossibleItems;
      this.isRtl = isRtl2;
      this.deactivateItem = deactivateItem;
      this.activateItem = activateItem;
      this.isNavigableKey = isNavigableKey;
      this.isActivatable = isActivatable;
      this.wrapNavigation = wrapNavigation ?? (() => true);
    }
    /**
     * The items being managed by the list. Additionally, attempts to see if the
     * object has a sub-item in the `.item` property.
     */
    get items() {
      const maybeItems = this.getPossibleItems();
      const items = [];
      for (const itemOrParent of maybeItems) {
        const isItem = this.isItem(itemOrParent);
        if (isItem) {
          items.push(itemOrParent);
          continue;
        }
        const subItem = itemOrParent.item;
        if (subItem && this.isItem(subItem)) {
          items.push(subItem);
        }
      }
      return items;
    }
    /**
     * Activates the next item in the list. If at the end of the list, the first
     * item will be activated.
     *
     * @return The activated list item or `null` if there are no items.
     */
    activateNextItem() {
      const items = this.items;
      const activeItemRecord = getActiveItem(items, this.isActivatable);
      if (activeItemRecord) {
        activeItemRecord.item.tabIndex = -1;
      }
      return activateNextItem(items, activeItemRecord, this.isActivatable, this.wrapNavigation());
    }
    /**
     * Activates the previous item in the list. If at the start of the list, the
     * last item will be activated.
     *
     * @return The activated list item or `null` if there are no items.
     */
    activatePreviousItem() {
      const items = this.items;
      const activeItemRecord = getActiveItem(items, this.isActivatable);
      if (activeItemRecord) {
        activeItemRecord.item.tabIndex = -1;
      }
      return activatePreviousItem(items, activeItemRecord, this.isActivatable, this.wrapNavigation());
    }
  };

  // ../list/internal/list.js
  var NAVIGABLE_KEY_SET = new Set(Object.values(NavigableKeys));
  var List = class extends s3 {
    /** @export */
    get items() {
      return this.listController.items;
    }
    constructor() {
      super();
      this.listController = new ListController({
        isItem: (item) => item.hasAttribute("md-list-item"),
        getPossibleItems: () => this.slotItems,
        isRtl: () => getComputedStyle(this).direction === "rtl",
        deactivateItem: (item) => {
          item.tabIndex = -1;
        },
        activateItem: (item) => {
          item.tabIndex = 0;
        },
        isNavigableKey: (key) => NAVIGABLE_KEY_SET.has(key),
        isActivatable: (item) => !item.disabled && item.type !== "text"
      });
      this.internals = // Cast needed for closure
      this.attachInternals();
      if (!o7) {
        this.internals.role = "list";
        this.addEventListener("keydown", this.listController.handleKeydown);
      }
    }
    render() {
      return T`
      <slot
        @deactivate-items=${this.listController.onDeactivateItems}
        @request-activation=${this.listController.onRequestActivation}
        @slotchange=${this.listController.onSlotchange}>
      </slot>
    `;
    }
    /**
     * Activates the next item in the list. If at the end of the list, the first
     * item will be activated.
     *
     * @return The activated list item or `null` if there are no items.
     */
    activateNextItem() {
      return this.listController.activateNextItem();
    }
    /**
     * Activates the previous item in the list. If at the start of the list, the
     * last item will be activated.
     *
     * @return The activated list item or `null` if there are no items.
     */
    activatePreviousItem() {
      return this.listController.activatePreviousItem();
    }
  };
  __decorate([
    e5({ flatten: true })
  ], List.prototype, "slotItems", void 0);

  // ../list/internal/list-styles.cssresult.js
  var styles36 = i3`:host{background:var(--md-list-container-color, var(--md-sys-color-surface, #fef7ff));color:unset;display:flex;flex-direction:column;outline:none;padding:8px 0;position:relative}
`;
  var list_styles_cssresult_default = styles36.styleSheet;

  // ../list/list.js
  var MdList = class MdList2 extends List {
  };
  MdList.styles = [styles36];
  MdList = __decorate([
    e("md-list")
  ], MdList);

  // ../labs/item/internal/item.js
  var Item = class extends s3 {
    constructor() {
      super(...arguments);
      this.multiline = false;
    }
    render() {
      return T`
      <slot name="container"></slot>
      <slot class="non-text" name="start"></slot>
      <div class="text">
        <slot name="overline" @slotchange=${this.handleTextSlotChange}></slot>
        <slot
          class="default-slot"
          @slotchange=${this.handleTextSlotChange}></slot>
        <slot name="headline" @slotchange=${this.handleTextSlotChange}></slot>
        <slot
          name="supporting-text"
          @slotchange=${this.handleTextSlotChange}></slot>
      </div>
      <slot class="non-text" name="trailing-supporting-text"></slot>
      <slot class="non-text" name="end"></slot>
    `;
    }
    handleTextSlotChange() {
      let isMultiline = false;
      let slotsWithContent = 0;
      for (const slot of this.textSlots) {
        if (slotHasContent(slot)) {
          slotsWithContent += 1;
        }
        if (slotsWithContent > 1) {
          isMultiline = true;
          break;
        }
      }
      this.multiline = isMultiline;
    }
  };
  __decorate([
    n({ type: Boolean, reflect: true })
  ], Item.prototype, "multiline", void 0);
  __decorate([
    e3(".text slot")
  ], Item.prototype, "textSlots", void 0);
  function slotHasContent(slot) {
    for (const node of slot.assignedNodes({ flatten: true })) {
      const isElement = node.nodeType === Node.ELEMENT_NODE;
      const isTextWithContent = node.nodeType === Node.TEXT_NODE && node.textContent?.match(/\S/);
      if (isElement || isTextWithContent) {
        return true;
      }
    }
    return false;
  }

  // ../labs/item/internal/item-styles.cssresult.js
  var styles37 = i3`:host{color:var(--md-sys-color-on-surface, #1d1b20);font-family:var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto));font-size:var(--md-sys-typescale-body-large-size, 1rem);font-weight:var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400));line-height:var(--md-sys-typescale-body-large-line-height, 1.5rem);align-items:center;box-sizing:border-box;display:flex;gap:16px;min-height:56px;overflow:hidden;padding:12px 16px;position:relative;text-overflow:ellipsis}:host([multiline]){min-height:72px}[name=overline]{color:var(--md-sys-color-on-surface-variant, #49454f);font-family:var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto));font-size:var(--md-sys-typescale-label-small-size, 0.6875rem);font-weight:var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500));line-height:var(--md-sys-typescale-label-small-line-height, 1rem)}[name=supporting-text]{color:var(--md-sys-color-on-surface-variant, #49454f);font-family:var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto));font-size:var(--md-sys-typescale-body-medium-size, 0.875rem);font-weight:var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400));line-height:var(--md-sys-typescale-body-medium-line-height, 1.25rem)}[name=trailing-supporting-text]{color:var(--md-sys-color-on-surface-variant, #49454f);font-family:var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto));font-size:var(--md-sys-typescale-label-small-size, 0.6875rem);font-weight:var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500));line-height:var(--md-sys-typescale-label-small-line-height, 1rem)}[name=container]::slotted(*){inset:0;position:absolute}.default-slot{display:inline}.default-slot,.text ::slotted(*){overflow:hidden;text-overflow:ellipsis}.text{display:flex;flex:1;flex-direction:column;overflow:hidden}
`;
  var item_styles_cssresult_default = styles37.styleSheet;

  // ../labs/item/item.js
  var MdItem = class MdItem2 extends Item {
  };
  MdItem.styles = [styles37];
  MdItem = __decorate([
    e("md-item")
  ], MdItem);

  // ../list/internal/listitem/list-item.js
  var listItemBaseClass = mixinDelegatesAria(s3);
  var ListItemEl = class extends listItemBaseClass {
    constructor() {
      super(...arguments);
      this.disabled = false;
      this.type = "text";
      this.isListItem = true;
      this.href = "";
      this.target = "";
      this.rel = "";
      this.referrerPolicy = "";
    }
    get isDisabled() {
      return this.disabled && this.type !== "link";
    }
    willUpdate(changed) {
      if (this.href) {
        this.type = "link";
      }
      super.willUpdate(changed);
    }
    render() {
      return this.renderListItem(T`
      <md-item>
        <div slot="container">
          ${this.renderRipple()} ${this.renderFocusRing()}
        </div>
        <slot name="start" slot="start"></slot>
        <slot name="end" slot="end"></slot>
        ${this.renderBody()}
      </md-item>
    `);
    }
    /**
     * Renders the root list item.
     *
     * @param content the child content of the list item.
     */
    renderListItem(content) {
      const isAnchor = this.type === "link";
      let tag;
      switch (this.type) {
        case "link":
          tag = i6`a`;
          break;
        case "button":
          tag = i6`button`;
          break;
        default:
        case "text":
          tag = i6`li`;
          break;
      }
      const isInteractive = this.type !== "text";
      const target = isAnchor && !!this.target ? this.target : A;
      return n7`
      <${tag}
        id="item"
        tabindex="${this.isDisabled || !isInteractive ? -1 : 0}"
        ?disabled=${this.isDisabled}
        role="listitem"
        aria-selected=${this.ariaSelected || A}
        aria-checked=${this.ariaChecked || A}
        aria-expanded=${this.ariaExpanded || A}
        aria-haspopup=${this.ariaHasPopup || A}
        class="list-item ${o8(this.getRenderClasses())}"
        href=${safeHref(this.href)}
        target=${target}
        rel=${isAnchor && this.rel || A}
        referrerpolicy=${isAnchor && this.referrerPolicy || A}
        @focus=${this.onFocus}
      >${content}</${tag}>
    `;
    }
    /**
     * Handles rendering of the ripple element.
     */
    renderRipple() {
      if (this.type === "text") {
        return A;
      }
      return T` <md-ripple
      part="ripple"
      for="item"
      ?disabled=${this.isDisabled}></md-ripple>`;
    }
    /**
     * Handles rendering of the focus ring.
     */
    renderFocusRing() {
      if (this.type === "text") {
        return A;
      }
      return T` <md-focus-ring
      @visibility-changed=${this.onFocusRingVisibilityChanged}
      part="focus-ring"
      for="item"
      inward></md-focus-ring>`;
    }
    onFocusRingVisibilityChanged(e13) {
    }
    /**
     * Classes applied to the list item root.
     */
    getRenderClasses() {
      return { "disabled": this.isDisabled };
    }
    /**
     * Handles rendering the headline and supporting text.
     */
    renderBody() {
      return T`
      <slot></slot>
      <slot name="overline" slot="overline"></slot>
      <slot name="headline" slot="headline"></slot>
      <slot name="supporting-text" slot="supporting-text"></slot>
      <slot
        name="trailing-supporting-text"
        slot="trailing-supporting-text"></slot>
    `;
    }
    onFocus() {
      if (this.tabIndex !== -1) {
        return;
      }
      this.dispatchEvent(createRequestActivationEvent());
    }
    focus() {
      this.listItemRoot?.focus();
    }
    click() {
      if (!this.listItemRoot) {
        super.click();
        return;
      }
      this.listItemRoot.click();
    }
  };
  ListItemEl.shadowRootOptions = {
    ...s3.shadowRootOptions,
    delegatesFocus: true
  };
  __decorate([
    n({ type: Boolean, reflect: true })
  ], ListItemEl.prototype, "disabled", void 0);
  __decorate([
    n({ reflect: true })
  ], ListItemEl.prototype, "type", void 0);
  __decorate([
    n({ type: Boolean, attribute: "md-list-item", reflect: true })
  ], ListItemEl.prototype, "isListItem", void 0);
  __decorate([
    n()
  ], ListItemEl.prototype, "href", void 0);
  __decorate([
    n()
  ], ListItemEl.prototype, "target", void 0);
  __decorate([
    n()
  ], ListItemEl.prototype, "rel", void 0);
  __decorate([
    n()
  ], ListItemEl.prototype, "referrerPolicy", void 0);
  __decorate([
    i2(".list-item")
  ], ListItemEl.prototype, "listItemRoot", void 0);

  // ../list/internal/listitem/list-item-styles.cssresult.js
  var styles38 = i3`:host{display:flex;gap:16px;-webkit-tap-highlight-color:rgba(0,0,0,0);--md-ripple-hover-color: var(--md-list-item-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-hover-opacity: var(--md-list-item-hover-state-layer-opacity, 0.08);--md-ripple-pressed-color: var(--md-list-item-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-pressed-opacity: var(--md-list-item-pressed-state-layer-opacity, 0.12)}:host(:is([type=button]:not([disabled]),[type=link])){cursor:pointer}md-focus-ring{z-index:1;--md-focus-ring-shape: 8px}a,button,li{background:none;border:none;cursor:inherit;padding:0;margin:0;text-align:unset;text-decoration:none}.list-item{border-radius:inherit;display:flex;flex:1;gap:inherit;max-width:inherit;min-width:inherit;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0);width:100%}.list-item.interactive{cursor:pointer}.list-item.disabled{opacity:var(--md-list-item-disabled-opacity, 0.3);pointer-events:none}[slot=container]{pointer-events:none}md-ripple{border-radius:inherit}md-item{border-radius:inherit;flex:1;height:100%;color:var(--md-list-item-label-text-color, var(--md-sys-color-on-surface, #1d1b20));font-family:var(--md-list-item-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-list-item-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));line-height:var(--md-list-item-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));font-weight:var(--md-list-item-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));min-height:var(--md-list-item-one-line-container-height, 56px);padding-top:var(--md-list-item-top-space, 12px);padding-bottom:var(--md-list-item-bottom-space, 12px);padding-inline-start:var(--md-list-item-leading-space, 16px);padding-inline-end:var(--md-list-item-trailing-space, 16px);gap:inherit}md-item[multiline]{min-height:var(--md-list-item-two-line-container-height, 72px)}[slot=supporting-text]{color:var(--md-list-item-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-list-item-supporting-text-font, var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-list-item-supporting-text-size, var(--md-sys-typescale-body-medium-size, 0.875rem));line-height:var(--md-list-item-supporting-text-line-height, var(--md-sys-typescale-body-medium-line-height, 1.25rem));font-weight:var(--md-list-item-supporting-text-weight, var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400)))}[slot=trailing-supporting-text]{color:var(--md-list-item-trailing-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-list-item-trailing-supporting-text-font, var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-list-item-trailing-supporting-text-size, var(--md-sys-typescale-label-small-size, 0.6875rem));line-height:var(--md-list-item-trailing-supporting-text-line-height, var(--md-sys-typescale-label-small-line-height, 1rem));font-weight:var(--md-list-item-trailing-supporting-text-weight, var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500)))}:is([slot=start],[slot=end])::slotted(*){fill:currentColor}[slot=start]{color:var(--md-list-item-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f))}[slot=end]{color:var(--md-list-item-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f))}@media(forced-colors: active){.disabled slot{color:GrayText}.list-item.disabled{color:GrayText;opacity:1}}
`;
  var list_item_styles_cssresult_default = styles38.styleSheet;

  // ../list/list-item.js
  var MdListItem = class MdListItem2 extends ListItemEl {
  };
  MdListItem.styles = [styles38];
  MdListItem = __decorate([
    e("md-list-item")
  ], MdListItem);

  // ../node_modules/lit-html/node/directives/style-map.js
  var i7 = "important";
  var n8 = " !" + i7;
  var o9 = e8(class extends i5 {
    constructor(t7) {
      var e13;
      if (super(t7), t7.type !== t4.ATTRIBUTE || "style" !== t7.name || (null === (e13 = t7.strings) || void 0 === e13 ? void 0 : e13.length) > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
    }
    render(t7) {
      return Object.keys(t7).reduce(((e13, r8) => {
        const s8 = t7[r8];
        return null == s8 ? e13 : e13 + `${r8 = r8.includes("-") ? r8 : r8.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${s8};`;
      }), "");
    }
    update(e13, [r8]) {
      const { style: s8 } = e13.element;
      if (void 0 === this.ht) {
        this.ht = /* @__PURE__ */ new Set();
        for (const t7 in r8) this.ht.add(t7);
        return this.render(r8);
      }
      this.ht.forEach(((t7) => {
        null == r8[t7] && (this.ht.delete(t7), t7.includes("-") ? s8.removeProperty(t7) : s8[t7] = "");
      }));
      for (const t7 in r8) {
        const e14 = r8[t7];
        if (null != e14) {
          this.ht.add(t7);
          const r9 = "string" == typeof e14 && e14.endsWith(n8);
          t7.includes("-") || r9 ? s8.setProperty(t7, r9 ? e14.slice(0, -11) : e14, r9 ? i7 : "") : s8[t7] = e14;
        }
      }
      return w;
    }
  });

  // ../menu/internal/controllers/shared.js
  function createCloseMenuEvent(initiator, reason) {
    return new CustomEvent("close-menu", {
      bubbles: true,
      composed: true,
      detail: { initiator, reason, itemPath: [initiator] }
    });
  }
  var createDefaultCloseMenuEvent = createCloseMenuEvent;
  function createDeactivateTypeaheadEvent() {
    return new Event("deactivate-typeahead", { bubbles: true, composed: true });
  }
  function createActivateTypeaheadEvent() {
    return new Event("activate-typeahead", { bubbles: true, composed: true });
  }
  var NavigableKey = {
    UP: "ArrowUp",
    DOWN: "ArrowDown",
    RIGHT: "ArrowRight",
    LEFT: "ArrowLeft"
  };
  var SelectionKey = {
    SPACE: "Space",
    ENTER: "Enter"
  };
  var CloseReason = {
    CLICK_SELECTION: "click-selection",
    KEYDOWN: "keydown"
  };
  var KeydownCloseKey = {
    ESCAPE: "Escape",
    SPACE: SelectionKey.SPACE,
    ENTER: SelectionKey.ENTER
  };
  function isClosableKey(code) {
    return Object.values(KeydownCloseKey).some((value) => value === code);
  }
  function isSelectableKey(code) {
    return Object.values(SelectionKey).some((value) => value === code);
  }
  function isElementInSubtree(target, container) {
    const focusEv = new Event("md-contains", { bubbles: true, composed: true });
    let composedPath = [];
    const listener = (ev) => {
      composedPath = ev.composedPath();
    };
    container.addEventListener("md-contains", listener);
    target.dispatchEvent(focusEv);
    container.removeEventListener("md-contains", listener);
    const isContained = composedPath.length > 0;
    return isContained;
  }
  var FocusState = {
    NONE: "none",
    LIST_ROOT: "list-root",
    FIRST_ITEM: "first-item",
    LAST_ITEM: "last-item"
  };

  // ../menu/internal/controllers/surfacePositionController.js
  var Corner = {
    END_START: "end-start",
    END_END: "end-end",
    START_START: "start-start",
    START_END: "start-end"
  };
  var SurfacePositionController = class {
    /**
     * @param host The host to connect the controller to.
     * @param getProperties A function that returns the properties for the
     * controller.
     */
    constructor(host, getProperties) {
      this.host = host;
      this.getProperties = getProperties;
      this.surfaceStylesInternal = {
        "display": "none"
      };
      this.lastValues = {
        isOpen: false
      };
      this.host.addController(this);
    }
    /**
     * The StyleInfo map to apply to the surface via Lit's stylemap
     */
    get surfaceStyles() {
      return this.surfaceStylesInternal;
    }
    /**
     * Calculates the surface's new position required so that the surface's
     * `surfaceCorner` aligns to the anchor's `anchorCorner` while keeping the
     * surface inside the window viewport. This positioning also respects RTL by
     * checking `getComputedStyle()` on the surface element.
     */
    async position() {
      const { surfaceEl, anchorEl, anchorCorner: anchorCornerRaw, surfaceCorner: surfaceCornerRaw, positioning, xOffset, yOffset, disableBlockFlip, disableInlineFlip, repositionStrategy } = this.getProperties();
      const anchorCorner = anchorCornerRaw.toLowerCase().trim();
      const surfaceCorner = surfaceCornerRaw.toLowerCase().trim();
      if (!surfaceEl || !anchorEl) {
        return;
      }
      const windowInnerWidth = window.innerWidth;
      const windowInnerHeight = window.innerHeight;
      const div = document.createElement("div");
      div.style.opacity = "0";
      div.style.position = "fixed";
      div.style.display = "block";
      div.style.inset = "0";
      document.body.appendChild(div);
      const scrollbarTestRect = div.getBoundingClientRect();
      div.remove();
      const blockScrollbarHeight = window.innerHeight - scrollbarTestRect.bottom;
      const inlineScrollbarWidth = window.innerWidth - scrollbarTestRect.right;
      this.surfaceStylesInternal = {
        "display": "block",
        "opacity": "0"
      };
      this.host.requestUpdate();
      await this.host.updateComplete;
      if (surfaceEl.popover && surfaceEl.isConnected) {
        surfaceEl.showPopover();
      }
      const surfaceRect = surfaceEl.getSurfacePositionClientRect ? surfaceEl.getSurfacePositionClientRect() : surfaceEl.getBoundingClientRect();
      const anchorRect = anchorEl.getSurfacePositionClientRect ? anchorEl.getSurfacePositionClientRect() : anchorEl.getBoundingClientRect();
      const [surfaceBlock, surfaceInline] = surfaceCorner.split("-");
      const [anchorBlock, anchorInline] = anchorCorner.split("-");
      const isLTR = getComputedStyle(surfaceEl).direction === "ltr";
      let { blockInset, blockOutOfBoundsCorrection, surfaceBlockProperty } = this.calculateBlock({
        surfaceRect,
        anchorRect,
        anchorBlock,
        surfaceBlock,
        yOffset,
        positioning,
        windowInnerHeight,
        blockScrollbarHeight
      });
      if (blockOutOfBoundsCorrection && !disableBlockFlip) {
        const flippedSurfaceBlock = surfaceBlock === "start" ? "end" : "start";
        const flippedAnchorBlock = anchorBlock === "start" ? "end" : "start";
        const flippedBlock = this.calculateBlock({
          surfaceRect,
          anchorRect,
          anchorBlock: flippedAnchorBlock,
          surfaceBlock: flippedSurfaceBlock,
          yOffset,
          positioning,
          windowInnerHeight,
          blockScrollbarHeight
        });
        if (blockOutOfBoundsCorrection > flippedBlock.blockOutOfBoundsCorrection) {
          blockInset = flippedBlock.blockInset;
          blockOutOfBoundsCorrection = flippedBlock.blockOutOfBoundsCorrection;
          surfaceBlockProperty = flippedBlock.surfaceBlockProperty;
        }
      }
      let { inlineInset, inlineOutOfBoundsCorrection, surfaceInlineProperty } = this.calculateInline({
        surfaceRect,
        anchorRect,
        anchorInline,
        surfaceInline,
        xOffset,
        positioning,
        isLTR,
        windowInnerWidth,
        inlineScrollbarWidth
      });
      if (inlineOutOfBoundsCorrection && !disableInlineFlip) {
        const flippedSurfaceInline = surfaceInline === "start" ? "end" : "start";
        const flippedAnchorInline = anchorInline === "start" ? "end" : "start";
        const flippedInline = this.calculateInline({
          surfaceRect,
          anchorRect,
          anchorInline: flippedAnchorInline,
          surfaceInline: flippedSurfaceInline,
          xOffset,
          positioning,
          isLTR,
          windowInnerWidth,
          inlineScrollbarWidth
        });
        if (Math.abs(inlineOutOfBoundsCorrection) > Math.abs(flippedInline.inlineOutOfBoundsCorrection)) {
          inlineInset = flippedInline.inlineInset;
          inlineOutOfBoundsCorrection = flippedInline.inlineOutOfBoundsCorrection;
          surfaceInlineProperty = flippedInline.surfaceInlineProperty;
        }
      }
      if (repositionStrategy === "move") {
        blockInset = blockInset - blockOutOfBoundsCorrection;
        inlineInset = inlineInset - inlineOutOfBoundsCorrection;
      }
      this.surfaceStylesInternal = {
        "display": "block",
        "opacity": "1",
        [surfaceBlockProperty]: `${blockInset}px`,
        [surfaceInlineProperty]: `${inlineInset}px`
      };
      if (repositionStrategy === "resize") {
        if (blockOutOfBoundsCorrection) {
          this.surfaceStylesInternal["height"] = `${surfaceRect.height - blockOutOfBoundsCorrection}px`;
        }
        if (inlineOutOfBoundsCorrection) {
          this.surfaceStylesInternal["width"] = `${surfaceRect.width - inlineOutOfBoundsCorrection}px`;
        }
      }
      this.host.requestUpdate();
    }
    /**
     * Calculates the css property, the inset, and the out of bounds correction
     * for the surface in the block direction.
     */
    calculateBlock(config) {
      const { surfaceRect, anchorRect, anchorBlock, surfaceBlock, yOffset, positioning, windowInnerHeight, blockScrollbarHeight } = config;
      const relativeToWindow = positioning === "fixed" || positioning === "document" ? 1 : 0;
      const relativeToDocument = positioning === "document" ? 1 : 0;
      const isSurfaceBlockStart = surfaceBlock === "start" ? 1 : 0;
      const isSurfaceBlockEnd = surfaceBlock === "end" ? 1 : 0;
      const isOneBlockEnd = anchorBlock !== surfaceBlock ? 1 : 0;
      const blockAnchorOffset = isOneBlockEnd * anchorRect.height + yOffset;
      const blockTopLayerOffset = isSurfaceBlockStart * anchorRect.top + isSurfaceBlockEnd * (windowInnerHeight - anchorRect.bottom - blockScrollbarHeight);
      const blockDocumentOffset = isSurfaceBlockStart * window.scrollY - isSurfaceBlockEnd * window.scrollY;
      const blockOutOfBoundsCorrection = Math.abs(Math.min(0, windowInnerHeight - blockTopLayerOffset - blockAnchorOffset - surfaceRect.height));
      const blockInset = relativeToWindow * blockTopLayerOffset + relativeToDocument * blockDocumentOffset + blockAnchorOffset;
      const surfaceBlockProperty = surfaceBlock === "start" ? "inset-block-start" : "inset-block-end";
      return { blockInset, blockOutOfBoundsCorrection, surfaceBlockProperty };
    }
    /**
     * Calculates the css property, the inset, and the out of bounds correction
     * for the surface in the inline direction.
     */
    calculateInline(config) {
      const { isLTR: isLTRBool, surfaceInline, anchorInline, anchorRect, surfaceRect, xOffset, positioning, windowInnerWidth, inlineScrollbarWidth } = config;
      const relativeToWindow = positioning === "fixed" || positioning === "document" ? 1 : 0;
      const relativeToDocument = positioning === "document" ? 1 : 0;
      const isLTR = isLTRBool ? 1 : 0;
      const isRTL = isLTRBool ? 0 : 1;
      const isSurfaceInlineStart = surfaceInline === "start" ? 1 : 0;
      const isSurfaceInlineEnd = surfaceInline === "end" ? 1 : 0;
      const isOneInlineEnd = anchorInline !== surfaceInline ? 1 : 0;
      const inlineAnchorOffset = isOneInlineEnd * anchorRect.width + xOffset;
      const inlineTopLayerOffsetLTR = isSurfaceInlineStart * anchorRect.left + isSurfaceInlineEnd * (windowInnerWidth - anchorRect.right - inlineScrollbarWidth);
      const inlineTopLayerOffsetRTL = isSurfaceInlineStart * (windowInnerWidth - anchorRect.right - inlineScrollbarWidth) + isSurfaceInlineEnd * anchorRect.left;
      const inlineTopLayerOffset = isLTR * inlineTopLayerOffsetLTR + isRTL * inlineTopLayerOffsetRTL;
      const inlineDocumentOffsetLTR = isSurfaceInlineStart * window.scrollX - isSurfaceInlineEnd * window.scrollX;
      const inlineDocumentOffsetRTL = isSurfaceInlineEnd * window.scrollX - isSurfaceInlineStart * window.scrollX;
      const inlineDocumentOffset = isLTR * inlineDocumentOffsetLTR + isRTL * inlineDocumentOffsetRTL;
      const inlineOutOfBoundsCorrection = Math.abs(Math.min(0, windowInnerWidth - inlineTopLayerOffset - inlineAnchorOffset - surfaceRect.width));
      const inlineInset = relativeToWindow * inlineTopLayerOffset + inlineAnchorOffset + relativeToDocument * inlineDocumentOffset;
      let surfaceInlineProperty = surfaceInline === "start" ? "inset-inline-start" : "inset-inline-end";
      if (positioning === "document" || positioning === "fixed") {
        if (surfaceInline === "start" && isLTRBool || surfaceInline === "end" && !isLTRBool) {
          surfaceInlineProperty = "left";
        } else {
          surfaceInlineProperty = "right";
        }
      }
      return {
        inlineInset,
        inlineOutOfBoundsCorrection,
        surfaceInlineProperty
      };
    }
    hostUpdate() {
      this.onUpdate();
    }
    hostUpdated() {
      this.onUpdate();
    }
    /**
     * Checks whether the properties passed into the controller have changed since
     * the last positioning. If so, it will reposition if the surface is open or
     * close it if the surface should close.
     */
    async onUpdate() {
      const props = this.getProperties();
      let hasChanged = false;
      for (const [key, value] of Object.entries(props)) {
        hasChanged = hasChanged || value !== this.lastValues[key];
        if (hasChanged)
          break;
      }
      const openChanged = this.lastValues.isOpen !== props.isOpen;
      const hasAnchor = !!props.anchorEl;
      const hasSurface = !!props.surfaceEl;
      if (hasChanged && hasAnchor && hasSurface) {
        this.lastValues.isOpen = props.isOpen;
        if (props.isOpen) {
          this.lastValues = props;
          await this.position();
          props.onOpen();
        } else if (openChanged) {
          await props.beforeClose();
          this.close();
          props.onClose();
        }
      }
    }
    /**
     * Hides the surface.
     */
    close() {
      this.surfaceStylesInternal = {
        "display": "none"
      };
      this.host.requestUpdate();
      const surfaceEl = this.getProperties().surfaceEl;
      if (surfaceEl?.popover && surfaceEl?.isConnected) {
        surfaceEl.hidePopover();
      }
    }
  };

  // ../menu/internal/controllers/typeaheadController.js
  var TYPEAHEAD_RECORD = {
    INDEX: 0,
    ITEM: 1,
    TEXT: 2
  };
  var TypeaheadController = class {
    /**
     * @param getProperties A function that returns the options of the typeahead
     * controller:
     *
     * {
     *   getItems: A function that returns an array of menu items to be searched.
     *   typeaheadBufferTime: The maximum time between each keystroke to keep the
     *       current type buffer alive.
     * }
     */
    constructor(getProperties) {
      this.getProperties = getProperties;
      this.typeaheadRecords = [];
      this.typaheadBuffer = "";
      this.cancelTypeaheadTimeout = 0;
      this.isTypingAhead = false;
      this.lastActiveRecord = null;
      this.onKeydown = (event) => {
        if (this.isTypingAhead) {
          this.typeahead(event);
        } else {
          this.beginTypeahead(event);
        }
      };
      this.endTypeahead = () => {
        this.isTypingAhead = false;
        this.typaheadBuffer = "";
        this.typeaheadRecords = [];
      };
    }
    get items() {
      return this.getProperties().getItems();
    }
    get active() {
      return this.getProperties().active;
    }
    /**
     * Sets up typingahead
     */
    beginTypeahead(event) {
      if (!this.active) {
        return;
      }
      if (event.code === "Space" || event.code === "Enter" || event.code.startsWith("Arrow") || event.code === "Escape") {
        return;
      }
      this.isTypingAhead = true;
      this.typeaheadRecords = this.items.map((el, index) => [
        index,
        el,
        el.typeaheadText.trim().toLowerCase()
      ]);
      this.lastActiveRecord = this.typeaheadRecords.find((record) => record[TYPEAHEAD_RECORD.ITEM].tabIndex === 0) ?? null;
      if (this.lastActiveRecord) {
        this.lastActiveRecord[TYPEAHEAD_RECORD.ITEM].tabIndex = -1;
      }
      this.typeahead(event);
    }
    /**
     * Performs the typeahead. Based on the normalized items and the current text
     * buffer, finds the _next_ item with matching text and activates it.
     *
     * @example
     *
     * items: Apple, Banana, Olive, Orange, Cucumber
     * buffer: ''
     * user types: o
     *
     * activates Olive
     *
     * @example
     *
     * items: Apple, Banana, Olive (active), Orange, Cucumber
     * buffer: 'o'
     * user types: l
     *
     * activates Olive
     *
     * @example
     *
     * items: Apple, Banana, Olive (active), Orange, Cucumber
     * buffer: ''
     * user types: o
     *
     * activates Orange
     *
     * @example
     *
     * items: Apple, Banana, Olive, Orange (active), Cucumber
     * buffer: ''
     * user types: o
     *
     * activates Olive
     */
    typeahead(event) {
      if (event.defaultPrevented)
        return;
      clearTimeout(this.cancelTypeaheadTimeout);
      if (event.code === "Enter" || event.code.startsWith("Arrow") || event.code === "Escape") {
        this.endTypeahead();
        if (this.lastActiveRecord) {
          this.lastActiveRecord[TYPEAHEAD_RECORD.ITEM].tabIndex = -1;
        }
        return;
      }
      if (event.code === "Space") {
        event.preventDefault();
      }
      this.cancelTypeaheadTimeout = setTimeout(this.endTypeahead, this.getProperties().typeaheadBufferTime);
      this.typaheadBuffer += event.key.toLowerCase();
      const lastActiveIndex = this.lastActiveRecord ? this.lastActiveRecord[TYPEAHEAD_RECORD.INDEX] : -1;
      const numRecords = this.typeaheadRecords.length;
      const rebaseIndexOnActive = (record) => {
        return (record[TYPEAHEAD_RECORD.INDEX] + numRecords - lastActiveIndex) % numRecords;
      };
      const matchingRecords = this.typeaheadRecords.filter((record) => !record[TYPEAHEAD_RECORD.ITEM].disabled && record[TYPEAHEAD_RECORD.TEXT].startsWith(this.typaheadBuffer)).sort((a7, b4) => rebaseIndexOnActive(a7) - rebaseIndexOnActive(b4));
      if (matchingRecords.length === 0) {
        clearTimeout(this.cancelTypeaheadTimeout);
        if (this.lastActiveRecord) {
          this.lastActiveRecord[TYPEAHEAD_RECORD.ITEM].tabIndex = -1;
        }
        this.endTypeahead();
        return;
      }
      const isNewQuery = this.typaheadBuffer.length === 1;
      let nextRecord;
      if (this.lastActiveRecord === matchingRecords[0] && isNewQuery) {
        nextRecord = matchingRecords[1] ?? matchingRecords[0];
      } else {
        nextRecord = matchingRecords[0];
      }
      if (this.lastActiveRecord) {
        this.lastActiveRecord[TYPEAHEAD_RECORD.ITEM].tabIndex = -1;
      }
      this.lastActiveRecord = nextRecord;
      nextRecord[TYPEAHEAD_RECORD.ITEM].tabIndex = 0;
      nextRecord[TYPEAHEAD_RECORD.ITEM].focus();
      return;
    }
  };

  // ../menu/internal/menu.js
  var DEFAULT_TYPEAHEAD_BUFFER_TIME = 200;
  var submenuNavKeys = /* @__PURE__ */ new Set([
    NavigableKeys.ArrowDown,
    NavigableKeys.ArrowUp,
    NavigableKeys.Home,
    NavigableKeys.End
  ]);
  var menuNavKeys = /* @__PURE__ */ new Set([
    NavigableKeys.ArrowLeft,
    NavigableKeys.ArrowRight,
    ...submenuNavKeys
  ]);
  function getFocusedElement(activeDoc = document) {
    let activeEl = activeDoc.activeElement;
    while (activeEl && activeEl?.shadowRoot?.activeElement) {
      activeEl = activeEl.shadowRoot.activeElement;
    }
    return activeEl;
  }
  var Menu = class extends s3 {
    /**
     * Whether the menu is animating upwards or downwards when opening. This is
     * helpful for calculating some animation calculations.
     */
    get openDirection() {
      const menuCornerBlock = this.menuCorner.split("-")[0];
      return menuCornerBlock === "start" ? "DOWN" : "UP";
    }
    /**
     * The element which the menu should align to. If `anchor` is set to a
     * non-empty idref string, then `anchorEl` will resolve to the element with
     * the given id in the same root node. Otherwise, `null`.
     */
    get anchorElement() {
      if (this.anchor) {
        return this.getRootNode().querySelector(`#${this.anchor}`);
      }
      return this.currentAnchorElement;
    }
    set anchorElement(element) {
      this.currentAnchorElement = element;
      this.requestUpdate("anchorElement");
    }
    constructor() {
      super();
      this.anchor = "";
      this.positioning = "absolute";
      this.quick = false;
      this.hasOverflow = false;
      this.open = false;
      this.xOffset = 0;
      this.yOffset = 0;
      this.noHorizontalFlip = false;
      this.noVerticalFlip = false;
      this.typeaheadDelay = DEFAULT_TYPEAHEAD_BUFFER_TIME;
      this.anchorCorner = Corner.END_START;
      this.menuCorner = Corner.START_START;
      this.stayOpenOnOutsideClick = false;
      this.stayOpenOnFocusout = false;
      this.skipRestoreFocus = false;
      this.defaultFocus = FocusState.FIRST_ITEM;
      this.noNavigationWrap = false;
      this.typeaheadActive = true;
      this.isSubmenu = false;
      this.pointerPath = [];
      this.isRepositioning = false;
      this.openCloseAnimationSignal = createAnimationSignal();
      this.listController = new ListController({
        isItem: (maybeItem) => {
          return maybeItem.hasAttribute("md-menu-item");
        },
        getPossibleItems: () => this.slotItems,
        isRtl: () => getComputedStyle(this).direction === "rtl",
        deactivateItem: (item) => {
          item.selected = false;
          item.tabIndex = -1;
        },
        activateItem: (item) => {
          item.selected = true;
          item.tabIndex = 0;
        },
        isNavigableKey: (key) => {
          if (!this.isSubmenu) {
            return menuNavKeys.has(key);
          }
          const isRtl2 = getComputedStyle(this).direction === "rtl";
          const arrowOpen = isRtl2 ? NavigableKeys.ArrowLeft : NavigableKeys.ArrowRight;
          if (key === arrowOpen) {
            return true;
          }
          return submenuNavKeys.has(key);
        },
        wrapNavigation: () => !this.noNavigationWrap
      });
      this.lastFocusedElement = null;
      this.typeaheadController = new TypeaheadController(() => {
        return {
          getItems: () => this.items,
          typeaheadBufferTime: this.typeaheadDelay,
          active: this.typeaheadActive
        };
      });
      this.currentAnchorElement = null;
      this.internals = // Cast needed for closure
      this.attachInternals();
      this.menuPositionController = new SurfacePositionController(this, () => {
        return {
          anchorCorner: this.anchorCorner,
          surfaceCorner: this.menuCorner,
          surfaceEl: this.surfaceEl,
          anchorEl: this.anchorElement,
          positioning: this.positioning === "popover" ? "document" : this.positioning,
          isOpen: this.open,
          xOffset: this.xOffset,
          yOffset: this.yOffset,
          disableBlockFlip: this.noVerticalFlip,
          disableInlineFlip: this.noHorizontalFlip,
          onOpen: this.onOpened,
          beforeClose: this.beforeClose,
          onClose: this.onClosed,
          // We can't resize components that have overflow like menus with
          // submenus because the overflow-y will show menu items / content
          // outside the bounds of the menu. Popover API fixes this because each
          // submenu is hoisted to the top-layer and are not considered overflow
          // content.
          repositionStrategy: this.hasOverflow && this.positioning !== "popover" ? "move" : "resize"
        };
      });
      this.onWindowResize = () => {
        if (this.isRepositioning || this.positioning !== "document" && this.positioning !== "fixed" && this.positioning !== "popover") {
          return;
        }
        this.isRepositioning = true;
        this.reposition();
        this.isRepositioning = false;
      };
      this.handleFocusout = async (event) => {
        const anchorEl = this.anchorElement;
        if (this.stayOpenOnFocusout || !this.open || this.pointerPath.includes(anchorEl)) {
          return;
        }
        if (event.relatedTarget) {
          if (isElementInSubtree(event.relatedTarget, this) || this.pointerPath.length !== 0 && isElementInSubtree(event.relatedTarget, anchorEl)) {
            return;
          }
        } else if (this.pointerPath.includes(this)) {
          return;
        }
        const oldRestoreFocus = this.skipRestoreFocus;
        this.skipRestoreFocus = true;
        this.close();
        await this.updateComplete;
        this.skipRestoreFocus = oldRestoreFocus;
      };
      this.onOpened = async () => {
        this.lastFocusedElement = getFocusedElement();
        const items = this.items;
        const activeItemRecord = getActiveItem(items);
        if (activeItemRecord && this.defaultFocus !== FocusState.NONE) {
          activeItemRecord.item.tabIndex = -1;
        }
        let animationAborted = !this.quick;
        if (this.quick) {
          this.dispatchEvent(new Event("opening"));
        } else {
          animationAborted = !!await this.animateOpen();
        }
        switch (this.defaultFocus) {
          case FocusState.FIRST_ITEM:
            const first = getFirstActivatableItem(items);
            if (first) {
              first.tabIndex = 0;
              first.focus();
              await first.updateComplete;
            }
            break;
          case FocusState.LAST_ITEM:
            const last = getLastActivatableItem(items);
            if (last) {
              last.tabIndex = 0;
              last.focus();
              await last.updateComplete;
            }
            break;
          case FocusState.LIST_ROOT:
            this.focus();
            break;
          default:
          case FocusState.NONE:
            break;
        }
        if (!animationAborted) {
          this.dispatchEvent(new Event("opened"));
        }
      };
      this.beforeClose = async () => {
        this.open = false;
        if (!this.skipRestoreFocus) {
          this.lastFocusedElement?.focus?.();
        }
        if (!this.quick) {
          await this.animateClose();
        }
      };
      this.onClosed = () => {
        if (this.quick) {
          this.dispatchEvent(new Event("closing"));
          this.dispatchEvent(new Event("closed"));
        }
      };
      this.onWindowPointerdown = (event) => {
        this.pointerPath = event.composedPath();
      };
      this.onDocumentClick = (event) => {
        if (!this.open) {
          return;
        }
        const path = event.composedPath();
        if (!this.stayOpenOnOutsideClick && !path.includes(this) && !path.includes(this.anchorElement)) {
          this.open = false;
        }
      };
      if (!o7) {
        this.internals.role = "menu";
        this.addEventListener("keydown", this.handleKeydown);
        this.addEventListener("keydown", this.captureKeydown, { capture: true });
        this.addEventListener("focusout", this.handleFocusout);
      }
    }
    /**
     * The menu items associated with this menu. The items must be `MenuItem`s and
     * have both the `md-menu-item` and `md-list-item` attributes.
     */
    get items() {
      return this.listController.items;
    }
    willUpdate(changed) {
      if (!changed.has("open")) {
        return;
      }
      if (this.open) {
        this.removeAttribute("aria-hidden");
        return;
      }
      this.setAttribute("aria-hidden", "true");
    }
    update(changed) {
      if (changed.has("open")) {
        if (this.open) {
          this.setUpGlobalEventListeners();
        } else {
          this.cleanUpGlobalEventListeners();
        }
      }
      if (changed.has("positioning") && this.positioning === "popover" && // type required for Google JS conformance
      !this.showPopover) {
        this.positioning = "fixed";
      }
      super.update(changed);
    }
    connectedCallback() {
      super.connectedCallback();
      if (this.open) {
        this.setUpGlobalEventListeners();
      }
    }
    disconnectedCallback() {
      super.disconnectedCallback();
      this.cleanUpGlobalEventListeners();
    }
    getBoundingClientRect() {
      if (!this.surfaceEl) {
        return super.getBoundingClientRect();
      }
      return this.surfaceEl.getBoundingClientRect();
    }
    getClientRects() {
      if (!this.surfaceEl) {
        return super.getClientRects();
      }
      return this.surfaceEl.getClientRects();
    }
    render() {
      return this.renderSurface();
    }
    /**
     * Renders the positionable surface element and its contents.
     */
    renderSurface() {
      return T`
      <div
        class="menu ${o8(this.getSurfaceClasses())}"
        style=${o9(this.menuPositionController.surfaceStyles)}
        popover=${this.positioning === "popover" ? "manual" : A}>
        ${this.renderElevation()}
        <div class="items">
          <div class="item-padding"> ${this.renderMenuItems()} </div>
        </div>
      </div>
    `;
    }
    /**
     * Renders the menu items' slot
     */
    renderMenuItems() {
      return T`<slot
      @close-menu=${this.onCloseMenu}
      @deactivate-items=${this.onDeactivateItems}
      @request-activation=${this.onRequestActivation}
      @deactivate-typeahead=${this.handleDeactivateTypeahead}
      @activate-typeahead=${this.handleActivateTypeahead}
      @stay-open-on-focusout=${this.handleStayOpenOnFocusout}
      @close-on-focusout=${this.handleCloseOnFocusout}
      @slotchange=${this.listController.onSlotchange}></slot>`;
    }
    /**
     * Renders the elevation component.
     */
    renderElevation() {
      return T`<md-elevation part="elevation"></md-elevation>`;
    }
    getSurfaceClasses() {
      return {
        open: this.open,
        fixed: this.positioning === "fixed",
        "has-overflow": this.hasOverflow
      };
    }
    captureKeydown(event) {
      if (event.target === this && !event.defaultPrevented && isClosableKey(event.code)) {
        event.preventDefault();
        this.close();
      }
      this.typeaheadController.onKeydown(event);
    }
    /**
     * Performs the opening animation:
     *
     * https://direct.googleplex.com/#/spec/295000003+271060003
     *
     * @return A promise that resolve to `true` if the animation was aborted,
     *     `false` if it was not aborted.
     */
    async animateOpen() {
      const surfaceEl = this.surfaceEl;
      const slotEl = this.slotEl;
      if (!surfaceEl || !slotEl)
        return true;
      const openDirection = this.openDirection;
      this.dispatchEvent(new Event("opening"));
      surfaceEl.classList.toggle("animating", true);
      const signal = this.openCloseAnimationSignal.start();
      const height = surfaceEl.offsetHeight;
      const openingUpwards = openDirection === "UP";
      const children = this.items;
      const FULL_DURATION = 500;
      const SURFACE_OPACITY_DURATION = 50;
      const ITEM_OPACITY_DURATION = 250;
      const DELAY_BETWEEN_ITEMS = (FULL_DURATION - ITEM_OPACITY_DURATION) / children.length;
      const surfaceHeightAnimation = surfaceEl.animate([{ height: "0px" }, { height: `${height}px` }], {
        duration: FULL_DURATION,
        easing: EASING.EMPHASIZED
      });
      const upPositionCorrectionAnimation = slotEl.animate([
        { transform: openingUpwards ? `translateY(-${height}px)` : "" },
        { transform: "" }
      ], { duration: FULL_DURATION, easing: EASING.EMPHASIZED });
      const surfaceOpacityAnimation = surfaceEl.animate([{ opacity: 0 }, { opacity: 1 }], SURFACE_OPACITY_DURATION);
      const childrenAnimations = [];
      for (let i10 = 0; i10 < children.length; i10++) {
        const directionalIndex = openingUpwards ? children.length - 1 - i10 : i10;
        const child = children[directionalIndex];
        const animation = child.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: ITEM_OPACITY_DURATION,
          delay: DELAY_BETWEEN_ITEMS * i10
        });
        child.classList.toggle("md-menu-hidden", true);
        animation.addEventListener("finish", () => {
          child.classList.toggle("md-menu-hidden", false);
        });
        childrenAnimations.push([child, animation]);
      }
      let resolveAnimation = (value) => {
      };
      const animationFinished = new Promise((resolve) => {
        resolveAnimation = resolve;
      });
      signal.addEventListener("abort", () => {
        surfaceHeightAnimation.cancel();
        upPositionCorrectionAnimation.cancel();
        surfaceOpacityAnimation.cancel();
        childrenAnimations.forEach(([child, animation]) => {
          child.classList.toggle("md-menu-hidden", false);
          animation.cancel();
        });
        resolveAnimation(true);
      });
      surfaceHeightAnimation.addEventListener("finish", () => {
        surfaceEl.classList.toggle("animating", false);
        this.openCloseAnimationSignal.finish();
        resolveAnimation(false);
      });
      return await animationFinished;
    }
    /**
     * Performs the closing animation:
     *
     * https://direct.googleplex.com/#/spec/295000003+271060003
     */
    animateClose() {
      let resolve;
      const animationEnded = new Promise((res) => {
        resolve = res;
      });
      const surfaceEl = this.surfaceEl;
      const slotEl = this.slotEl;
      if (!surfaceEl || !slotEl) {
        resolve(false);
        return animationEnded;
      }
      const openDirection = this.openDirection;
      const closingDownwards = openDirection === "UP";
      this.dispatchEvent(new Event("closing"));
      surfaceEl.classList.toggle("animating", true);
      const signal = this.openCloseAnimationSignal.start();
      const height = surfaceEl.offsetHeight;
      const children = this.items;
      const FULL_DURATION = 150;
      const SURFACE_OPACITY_DURATION = 50;
      const SURFACE_OPACITY_DELAY = FULL_DURATION - SURFACE_OPACITY_DURATION;
      const ITEM_OPACITY_DURATION = 50;
      const ITEM_OPACITY_INITIAL_DELAY = 50;
      const END_HEIGHT_PERCENTAGE = 0.35;
      const DELAY_BETWEEN_ITEMS = (FULL_DURATION - ITEM_OPACITY_INITIAL_DELAY - ITEM_OPACITY_DURATION) / children.length;
      const surfaceHeightAnimation = surfaceEl.animate([
        { height: `${height}px` },
        { height: `${height * END_HEIGHT_PERCENTAGE}px` }
      ], {
        duration: FULL_DURATION,
        easing: EASING.EMPHASIZED_ACCELERATE
      });
      const downPositionCorrectionAnimation = slotEl.animate([
        { transform: "" },
        {
          transform: closingDownwards ? `translateY(-${height * (1 - END_HEIGHT_PERCENTAGE)}px)` : ""
        }
      ], { duration: FULL_DURATION, easing: EASING.EMPHASIZED_ACCELERATE });
      const surfaceOpacityAnimation = surfaceEl.animate([{ opacity: 1 }, { opacity: 0 }], { duration: SURFACE_OPACITY_DURATION, delay: SURFACE_OPACITY_DELAY });
      const childrenAnimations = [];
      for (let i10 = 0; i10 < children.length; i10++) {
        const directionalIndex = closingDownwards ? i10 : children.length - 1 - i10;
        const child = children[directionalIndex];
        const animation = child.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: ITEM_OPACITY_DURATION,
          delay: ITEM_OPACITY_INITIAL_DELAY + DELAY_BETWEEN_ITEMS * i10
        });
        animation.addEventListener("finish", () => {
          child.classList.toggle("md-menu-hidden", true);
        });
        childrenAnimations.push([child, animation]);
      }
      signal.addEventListener("abort", () => {
        surfaceHeightAnimation.cancel();
        downPositionCorrectionAnimation.cancel();
        surfaceOpacityAnimation.cancel();
        childrenAnimations.forEach(([child, animation]) => {
          animation.cancel();
          child.classList.toggle("md-menu-hidden", false);
        });
        resolve(false);
      });
      surfaceHeightAnimation.addEventListener("finish", () => {
        surfaceEl.classList.toggle("animating", false);
        childrenAnimations.forEach(([child]) => {
          child.classList.toggle("md-menu-hidden", false);
        });
        this.openCloseAnimationSignal.finish();
        this.dispatchEvent(new Event("closed"));
        resolve(true);
      });
      return animationEnded;
    }
    handleKeydown(event) {
      this.pointerPath = [];
      this.listController.handleKeydown(event);
    }
    setUpGlobalEventListeners() {
      document.addEventListener("click", this.onDocumentClick, { capture: true });
      window.addEventListener("pointerdown", this.onWindowPointerdown);
      document.addEventListener("resize", this.onWindowResize, { passive: true });
      window.addEventListener("resize", this.onWindowResize, { passive: true });
    }
    cleanUpGlobalEventListeners() {
      document.removeEventListener("click", this.onDocumentClick, {
        capture: true
      });
      window.removeEventListener("pointerdown", this.onWindowPointerdown);
      document.removeEventListener("resize", this.onWindowResize);
      window.removeEventListener("resize", this.onWindowResize);
    }
    onCloseMenu() {
      this.close();
    }
    onDeactivateItems(event) {
      event.stopPropagation();
      this.listController.onDeactivateItems();
    }
    onRequestActivation(event) {
      event.stopPropagation();
      this.listController.onRequestActivation(event);
    }
    handleDeactivateTypeahead(event) {
      event.stopPropagation();
      this.typeaheadActive = false;
    }
    handleActivateTypeahead(event) {
      event.stopPropagation();
      this.typeaheadActive = true;
    }
    handleStayOpenOnFocusout(event) {
      event.stopPropagation();
      this.stayOpenOnFocusout = true;
    }
    handleCloseOnFocusout(event) {
      event.stopPropagation();
      this.stayOpenOnFocusout = false;
    }
    close() {
      this.open = false;
      const maybeSubmenu = this.slotItems;
      maybeSubmenu.forEach((item) => {
        item.close?.();
      });
    }
    show() {
      this.open = true;
    }
    /**
     * Activates the next item in the menu. If at the end of the menu, the first
     * item will be activated.
     *
     * @return The activated menu item or `null` if there are no items.
     */
    activateNextItem() {
      return this.listController.activateNextItem() ?? null;
    }
    /**
     * Activates the previous item in the menu. If at the start of the menu, the
     * last item will be activated.
     *
     * @return The activated menu item or `null` if there are no items.
     */
    activatePreviousItem() {
      return this.listController.activatePreviousItem() ?? null;
    }
    /**
     * Repositions the menu if it is open.
     *
     * Useful for the case where document or window-positioned menus have their
     * anchors moved while open.
     */
    reposition() {
      if (this.open) {
        this.menuPositionController.position();
      }
    }
  };
  __decorate([
    i2(".menu")
  ], Menu.prototype, "surfaceEl", void 0);
  __decorate([
    i2("slot")
  ], Menu.prototype, "slotEl", void 0);
  __decorate([
    n()
  ], Menu.prototype, "anchor", void 0);
  __decorate([
    n()
  ], Menu.prototype, "positioning", void 0);
  __decorate([
    n({ type: Boolean })
  ], Menu.prototype, "quick", void 0);
  __decorate([
    n({ type: Boolean, attribute: "has-overflow" })
  ], Menu.prototype, "hasOverflow", void 0);
  __decorate([
    n({ type: Boolean, reflect: true })
  ], Menu.prototype, "open", void 0);
  __decorate([
    n({ type: Number, attribute: "x-offset" })
  ], Menu.prototype, "xOffset", void 0);
  __decorate([
    n({ type: Number, attribute: "y-offset" })
  ], Menu.prototype, "yOffset", void 0);
  __decorate([
    n({ type: Boolean, attribute: "no-horizontal-flip" })
  ], Menu.prototype, "noHorizontalFlip", void 0);
  __decorate([
    n({ type: Boolean, attribute: "no-vertical-flip" })
  ], Menu.prototype, "noVerticalFlip", void 0);
  __decorate([
    n({ type: Number, attribute: "typeahead-delay" })
  ], Menu.prototype, "typeaheadDelay", void 0);
  __decorate([
    n({ attribute: "anchor-corner" })
  ], Menu.prototype, "anchorCorner", void 0);
  __decorate([
    n({ attribute: "menu-corner" })
  ], Menu.prototype, "menuCorner", void 0);
  __decorate([
    n({ type: Boolean, attribute: "stay-open-on-outside-click" })
  ], Menu.prototype, "stayOpenOnOutsideClick", void 0);
  __decorate([
    n({ type: Boolean, attribute: "stay-open-on-focusout" })
  ], Menu.prototype, "stayOpenOnFocusout", void 0);
  __decorate([
    n({ type: Boolean, attribute: "skip-restore-focus" })
  ], Menu.prototype, "skipRestoreFocus", void 0);
  __decorate([
    n({ attribute: "default-focus" })
  ], Menu.prototype, "defaultFocus", void 0);
  __decorate([
    n({ type: Boolean, attribute: "no-navigation-wrap" })
  ], Menu.prototype, "noNavigationWrap", void 0);
  __decorate([
    e5({ flatten: true })
  ], Menu.prototype, "slotItems", void 0);
  __decorate([
    t()
  ], Menu.prototype, "typeaheadActive", void 0);

  // ../menu/internal/menu-styles.cssresult.js
  var styles39 = i3`:host{--md-elevation-level: var(--md-menu-container-elevation, 2);--md-elevation-shadow-color: var(--md-menu-container-shadow-color, var(--md-sys-color-shadow, #000));min-width:112px;color:unset;display:contents}md-focus-ring{--md-focus-ring-shape: var(--md-menu-container-shape, var(--md-sys-shape-corner-extra-small, 4px))}.menu{border-radius:var(--md-menu-container-shape, var(--md-sys-shape-corner-extra-small, 4px));display:none;inset:auto;border:none;padding:0px;overflow:visible;background-color:rgba(0,0,0,0);color:inherit;opacity:0;z-index:20;position:absolute;user-select:none;max-height:inherit;height:inherit;min-width:inherit;max-width:inherit;scrollbar-width:inherit}.menu::backdrop{display:none}.fixed{position:fixed}.items{display:block;list-style-type:none;margin:0;outline:none;box-sizing:border-box;background-color:var(--md-menu-container-color, var(--md-sys-color-surface-container, #f3edf7));height:inherit;max-height:inherit;overflow:auto;min-width:inherit;max-width:inherit;border-radius:inherit;scrollbar-width:inherit}.item-padding{padding-block:var(--md-menu-top-space, 8px) var(--md-menu-bottom-space, 8px)}.has-overflow:not([popover]) .items{overflow:visible}.has-overflow.animating .items,.animating .items{overflow:hidden}.has-overflow.animating .items{pointer-events:none}.animating ::slotted(.md-menu-hidden){opacity:0}slot{display:block;height:inherit;max-height:inherit}::slotted(:is(md-divider,[role=separator])){margin:8px 0}@media(forced-colors: active){.menu{border-style:solid;border-color:CanvasText;border-width:1px}}
`;
  var menu_styles_cssresult_default = styles39.styleSheet;

  // ../menu/menu.js
  var MdMenu = class MdMenu2 extends Menu {
  };
  MdMenu.styles = [styles39];
  MdMenu = __decorate([
    e("md-menu")
  ], MdMenu);

  // ../menu/internal/controllers/menuItemController.js
  var MenuItemController = class {
    /**
     * @param host The MenuItem in which to attach this controller to.
     * @param config The object that configures this controller's behavior.
     */
    constructor(host, config) {
      this.host = host;
      this.internalTypeaheadText = null;
      this.onClick = () => {
        if (this.host.keepOpen)
          return;
        this.host.dispatchEvent(createDefaultCloseMenuEvent(this.host, {
          kind: CloseReason.CLICK_SELECTION
        }));
      };
      this.onKeydown = (event) => {
        if (this.host.href && event.code === "Enter") {
          const interactiveElement = this.getInteractiveElement();
          if (interactiveElement instanceof HTMLAnchorElement) {
            interactiveElement.click();
          }
        }
        if (event.defaultPrevented)
          return;
        const keyCode = event.code;
        if (this.host.keepOpen && keyCode !== "Escape")
          return;
        if (isClosableKey(keyCode)) {
          event.preventDefault();
          this.host.dispatchEvent(createDefaultCloseMenuEvent(this.host, {
            kind: CloseReason.KEYDOWN,
            key: keyCode
          }));
        }
      };
      this.getHeadlineElements = config.getHeadlineElements;
      this.getSupportingTextElements = config.getSupportingTextElements;
      this.getDefaultElements = config.getDefaultElements;
      this.getInteractiveElement = config.getInteractiveElement;
      this.host.addController(this);
    }
    /**
     * The text that is selectable via typeahead. If not set, defaults to the
     * innerText of the item slotted into the `"headline"` slot, and if there are
     * no slotted elements into headline, then it checks the _default_ slot, and
     * then the `"supporting-text"` slot if nothing is in _default_.
     */
    get typeaheadText() {
      if (this.internalTypeaheadText !== null) {
        return this.internalTypeaheadText;
      }
      const headlineElements = this.getHeadlineElements();
      const textParts = [];
      headlineElements.forEach((headlineElement) => {
        if (headlineElement.textContent && headlineElement.textContent.trim()) {
          textParts.push(headlineElement.textContent.trim());
        }
      });
      if (textParts.length === 0) {
        this.getDefaultElements().forEach((defaultElement) => {
          if (defaultElement.textContent && defaultElement.textContent.trim()) {
            textParts.push(defaultElement.textContent.trim());
          }
        });
      }
      if (textParts.length === 0) {
        this.getSupportingTextElements().forEach((supportingTextElement) => {
          if (supportingTextElement.textContent && supportingTextElement.textContent.trim()) {
            textParts.push(supportingTextElement.textContent.trim());
          }
        });
      }
      return textParts.join(" ");
    }
    /**
     * The recommended tag name to render as the list item.
     */
    get tagName() {
      const type = this.host.type;
      switch (type) {
        case "link":
          return "a";
        case "button":
          return "button";
        default:
        case "menuitem":
        case "option":
          return "li";
      }
    }
    /**
     * The recommended role of the menu item.
     */
    get role() {
      return this.host.type === "option" ? "option" : "menuitem";
    }
    hostConnected() {
      this.host.toggleAttribute("md-menu-item", true);
    }
    hostUpdate() {
      if (this.host.href) {
        this.host.type = "link";
      }
    }
    /**
     * Use to set the typeaheadText when it changes.
     */
    setTypeaheadText(text) {
      this.internalTypeaheadText = text;
    }
  };

  // ../menu/internal/menuitem/menu-item.js
  var menuItemBaseClass = mixinDelegatesAria(s3);
  var MenuItemEl = class extends menuItemBaseClass {
    constructor() {
      super(...arguments);
      this.disabled = false;
      this.type = "menuitem";
      this.href = "";
      this.target = "";
      this.rel = "";
      this.referrerPolicy = "";
      this.keepOpen = false;
      this.selected = false;
      this.menuItemController = new MenuItemController(this, {
        getHeadlineElements: () => {
          return this.headlineElements;
        },
        getSupportingTextElements: () => {
          return this.supportingTextElements;
        },
        getDefaultElements: () => {
          return this.defaultElements;
        },
        getInteractiveElement: () => this.listItemRoot
      });
    }
    /**
     * The text that is selectable via typeahead. If not set, defaults to the
     * innerText of the item slotted into the `"headline"` slot.
     */
    get typeaheadText() {
      return this.menuItemController.typeaheadText;
    }
    set typeaheadText(text) {
      this.menuItemController.setTypeaheadText(text);
    }
    render() {
      return this.renderListItem(T`
      <md-item>
        <div slot="container">
          ${this.renderRipple()} ${this.renderFocusRing()}
        </div>
        <slot name="start" slot="start"></slot>
        <slot name="end" slot="end"></slot>
        ${this.renderBody()}
      </md-item>
    `);
    }
    /**
     * Renders the root list item.
     *
     * @param content the child content of the list item.
     */
    renderListItem(content) {
      const isAnchor = this.type === "link";
      let tag;
      switch (this.menuItemController.tagName) {
        case "a":
          tag = i6`a`;
          break;
        case "button":
          tag = i6`button`;
          break;
        default:
        case "li":
          tag = i6`li`;
          break;
      }
      const target = isAnchor && !!this.target ? this.target : A;
      return n7`
      <${tag}
        id="item"
        tabindex=${this.disabled && !isAnchor ? -1 : 0}
        role=${this.menuItemController.role}
        aria-label=${this.ariaLabel || A}
        aria-selected=${this.ariaSelected || A}
        aria-checked=${this.ariaChecked || A}
        aria-expanded=${this.ariaExpanded || A}
        aria-haspopup=${this.ariaHasPopup || A}
        class="list-item ${o8(this.getRenderClasses())}"
        href=${safeHref(this.href)}
        target=${target}
        rel=${isAnchor && this.rel || A}
        referrerpolicy=${isAnchor && this.referrerPolicy || A}
        @click=${this.menuItemController.onClick}
        @keydown=${this.menuItemController.onKeydown}
      >${content}</${tag}>
    `;
    }
    /**
     * Handles rendering of the ripple element.
     */
    renderRipple() {
      return T` <md-ripple
      part="ripple"
      for="item"
      ?disabled=${this.disabled}></md-ripple>`;
    }
    /**
     * Handles rendering of the focus ring.
     */
    renderFocusRing() {
      return T` <md-focus-ring
      part="focus-ring"
      for="item"
      inward></md-focus-ring>`;
    }
    /**
     * Classes applied to the list item root.
     */
    getRenderClasses() {
      return {
        "disabled": this.disabled,
        "selected": this.selected
      };
    }
    /**
     * Handles rendering the headline and supporting text.
     */
    renderBody() {
      return T`
      <slot></slot>
      <slot name="overline" slot="overline"></slot>
      <slot name="headline" slot="headline"></slot>
      <slot name="supporting-text" slot="supporting-text"></slot>
      <slot
        name="trailing-supporting-text"
        slot="trailing-supporting-text"></slot>
    `;
    }
    focus() {
      this.listItemRoot?.focus();
    }
  };
  MenuItemEl.shadowRootOptions = {
    ...s3.shadowRootOptions,
    delegatesFocus: true
  };
  __decorate([
    n({ type: Boolean, reflect: true })
  ], MenuItemEl.prototype, "disabled", void 0);
  __decorate([
    n()
  ], MenuItemEl.prototype, "type", void 0);
  __decorate([
    n()
  ], MenuItemEl.prototype, "href", void 0);
  __decorate([
    n()
  ], MenuItemEl.prototype, "target", void 0);
  __decorate([
    n()
  ], MenuItemEl.prototype, "rel", void 0);
  __decorate([
    n()
  ], MenuItemEl.prototype, "referrerPolicy", void 0);
  __decorate([
    n({ type: Boolean, attribute: "keep-open" })
  ], MenuItemEl.prototype, "keepOpen", void 0);
  __decorate([
    n({ type: Boolean })
  ], MenuItemEl.prototype, "selected", void 0);
  __decorate([
    i2(".list-item")
  ], MenuItemEl.prototype, "listItemRoot", void 0);
  __decorate([
    e5({ slot: "headline" })
  ], MenuItemEl.prototype, "headlineElements", void 0);
  __decorate([
    e5({ slot: "supporting-text" })
  ], MenuItemEl.prototype, "supportingTextElements", void 0);
  __decorate([
    o2({ slot: "" })
  ], MenuItemEl.prototype, "defaultElements", void 0);
  __decorate([
    n({ attribute: "typeahead-text" })
  ], MenuItemEl.prototype, "typeaheadText", null);

  // ../menu/internal/menuitem/menu-item-styles.cssresult.js
  var styles40 = i3`:host{display:flex;gap:16px;--md-ripple-hover-color: var(--md-menu-item-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-hover-opacity: var(--md-menu-item-hover-state-layer-opacity, 0.08);--md-ripple-pressed-color: var(--md-menu-item-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-pressed-opacity: var(--md-menu-item-pressed-state-layer-opacity, 0.12)}:host([disabled]){opacity:var(--md-menu-item-disabled-opacity, 0.3);pointer-events:none}md-focus-ring{z-index:1;--md-focus-ring-shape: 8px}a,button,li{background:none;border:none;padding:0;margin:0;text-align:unset;text-decoration:none}.list-item{border-radius:inherit;display:flex;flex:1;gap:inherit;max-width:inherit;min-width:inherit;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.list-item:not(.disabled){cursor:pointer}[slot=container]{pointer-events:none}md-ripple{border-radius:inherit}md-item{border-radius:inherit;flex:1;color:var(--md-menu-item-label-text-color, var(--md-sys-color-on-surface, #1d1b20));font-family:var(--md-menu-item-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-menu-item-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));line-height:var(--md-menu-item-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));font-weight:var(--md-menu-item-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));min-height:var(--md-menu-item-one-line-container-height, 56px);padding-top:var(--md-menu-item-top-space, 12px);padding-bottom:var(--md-menu-item-bottom-space, 12px);padding-inline-start:var(--md-menu-item-leading-space, 16px);padding-inline-end:var(--md-menu-item-trailing-space, 16px);gap:inherit}md-item[multiline]{min-height:var(--md-menu-item-two-line-container-height, 72px)}[slot=supporting-text]{color:var(--md-menu-item-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-menu-item-supporting-text-font, var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-menu-item-supporting-text-size, var(--md-sys-typescale-body-medium-size, 0.875rem));line-height:var(--md-menu-item-supporting-text-line-height, var(--md-sys-typescale-body-medium-line-height, 1.25rem));font-weight:var(--md-menu-item-supporting-text-weight, var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400)))}[slot=trailing-supporting-text]{color:var(--md-menu-item-trailing-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-menu-item-trailing-supporting-text-font, var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-menu-item-trailing-supporting-text-size, var(--md-sys-typescale-label-small-size, 0.6875rem));line-height:var(--md-menu-item-trailing-supporting-text-line-height, var(--md-sys-typescale-label-small-line-height, 1rem));font-weight:var(--md-menu-item-trailing-supporting-text-weight, var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500)))}:is([slot=start],[slot=end])::slotted(*){fill:currentColor}[slot=start]{color:var(--md-menu-item-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f))}[slot=end]{color:var(--md-menu-item-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f))}.list-item{background-color:var(--md-menu-item-container-color, transparent)}.list-item.selected{background-color:var(--md-menu-item-selected-container-color, var(--md-sys-color-secondary-container, #e8def8))}.selected:not(.disabled) ::slotted(*){color:var(--md-menu-item-selected-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b))}@media(forced-colors: active){:host([disabled]),:host([disabled]) slot{color:GrayText;opacity:1}.list-item{position:relative}.list-item.selected::before{content:"";position:absolute;inset:0;box-sizing:border-box;border-radius:inherit;pointer-events:none;border:3px double CanvasText}}
`;
  var menu_item_styles_cssresult_default = styles40.styleSheet;

  // ../menu/menu-item.js
  var MdMenuItem = class MdMenuItem2 extends MenuItemEl {
  };
  MdMenuItem.styles = [styles40];
  MdMenuItem = __decorate([
    e("md-menu-item")
  ], MdMenuItem);

  // ../menu/internal/submenu/sub-menu.js
  var SubMenu = class extends s3 {
    get item() {
      return this.items[0] ?? null;
    }
    get menu() {
      return this.menus[0] ?? null;
    }
    constructor() {
      super();
      this.anchorCorner = Corner.START_END;
      this.menuCorner = Corner.START_START;
      this.hoverOpenDelay = 400;
      this.hoverCloseDelay = 400;
      this.isSubMenu = true;
      this.previousOpenTimeout = 0;
      this.previousCloseTimeout = 0;
      this.onMouseenter = () => {
        clearTimeout(this.previousOpenTimeout);
        clearTimeout(this.previousCloseTimeout);
        if (this.menu?.open)
          return;
        if (!this.hoverOpenDelay) {
          this.show();
        } else {
          this.previousOpenTimeout = setTimeout(() => {
            this.show();
          }, this.hoverOpenDelay);
        }
      };
      this.onMouseleave = () => {
        clearTimeout(this.previousCloseTimeout);
        clearTimeout(this.previousOpenTimeout);
        if (!this.hoverCloseDelay) {
          this.close();
        } else {
          this.previousCloseTimeout = setTimeout(() => {
            this.close();
          }, this.hoverCloseDelay);
        }
      };
      if (!o7) {
        this.addEventListener("mouseenter", this.onMouseenter);
        this.addEventListener("mouseleave", this.onMouseleave);
      }
    }
    render() {
      return T`
      <slot
        name="item"
        @click=${this.onClick}
        @keydown=${this.onKeydown}
        @slotchange=${this.onSlotchange}>
      </slot>
      <slot
        name="menu"
        @keydown=${this.onSubMenuKeydown}
        @close-menu=${this.onCloseSubmenu}
        @slotchange=${this.onSlotchange}>
      </slot>
    `;
    }
    firstUpdated() {
      this.onSlotchange();
    }
    /**
     * Shows the submenu.
     */
    async show() {
      const menu = this.menu;
      if (!menu || menu.open)
        return;
      menu.addEventListener("closed", () => {
        this.item.ariaExpanded = "false";
        this.dispatchEvent(createActivateTypeaheadEvent());
        this.dispatchEvent(createDeactivateItemsEvent());
        menu.ariaHidden = "true";
      }, { once: true });
      if (menu.positioning === "document") {
        menu.positioning = "absolute";
      }
      menu.quick = true;
      menu.hasOverflow = true;
      menu.anchorCorner = this.anchorCorner;
      menu.menuCorner = this.menuCorner;
      menu.anchorElement = this.item;
      menu.defaultFocus = "first-item";
      menu.removeAttribute("aria-hidden");
      menu.skipRestoreFocus = false;
      const menuAlreadyOpen = menu.open;
      menu.show();
      this.item.ariaExpanded = "true";
      this.item.ariaHasPopup = "menu";
      if (menu.id) {
        this.item.setAttribute("aria-controls", menu.id);
      }
      this.dispatchEvent(createDeactivateItemsEvent());
      this.dispatchEvent(createDeactivateTypeaheadEvent());
      this.item.selected = true;
      if (!menuAlreadyOpen) {
        let open = (value) => {
        };
        const opened = new Promise((resolve) => {
          open = resolve;
        });
        menu.addEventListener("opened", open, { once: true });
        await opened;
      }
    }
    /**
     * Closes the submenu.
     */
    async close() {
      const menu = this.menu;
      if (!menu || !menu.open)
        return;
      this.dispatchEvent(createActivateTypeaheadEvent());
      menu.quick = true;
      menu.close();
      this.dispatchEvent(createDeactivateItemsEvent());
      let close = (value) => {
      };
      const closed = new Promise((resolve) => {
        close = resolve;
      });
      menu.addEventListener("closed", close, { once: true });
      await closed;
    }
    onSlotchange() {
      if (!this.item) {
        return;
      }
      this.item.ariaExpanded = "false";
      this.item.ariaHasPopup = "menu";
      if (this.menu?.id) {
        this.item.setAttribute("aria-controls", this.menu.id);
      }
      this.item.keepOpen = true;
      const menu = this.menu;
      if (!menu)
        return;
      menu.isSubmenu = true;
      menu.ariaHidden = "true";
    }
    onClick() {
      this.show();
    }
    /**
     * On item keydown handles opening the submenu.
     */
    async onKeydown(event) {
      const shouldOpenSubmenu = this.isSubmenuOpenKey(event.code);
      if (event.defaultPrevented)
        return;
      const openedWithLR = shouldOpenSubmenu && (NavigableKey.LEFT === event.code || NavigableKey.RIGHT === event.code);
      if (event.code === SelectionKey.SPACE || openedWithLR) {
        event.preventDefault();
        if (openedWithLR) {
          event.stopPropagation();
        }
      }
      if (!shouldOpenSubmenu) {
        return;
      }
      const submenu = this.menu;
      if (!submenu)
        return;
      const submenuItems = submenu.items;
      const firstActivatableItem = getFirstActivatableItem(submenuItems);
      if (firstActivatableItem) {
        await this.show();
        firstActivatableItem.tabIndex = 0;
        firstActivatableItem.focus();
        return;
      }
    }
    onCloseSubmenu(event) {
      const { itemPath, reason } = event.detail;
      itemPath.push(this.item);
      this.dispatchEvent(createActivateTypeaheadEvent());
      if (reason.kind === CloseReason.KEYDOWN && reason.key === KeydownCloseKey.ESCAPE) {
        event.stopPropagation();
        this.item.dispatchEvent(createRequestActivationEvent());
        return;
      }
      this.dispatchEvent(createDeactivateItemsEvent());
    }
    async onSubMenuKeydown(event) {
      if (event.defaultPrevented)
        return;
      const { close: shouldClose, keyCode } = this.isSubmenuCloseKey(event.code);
      if (!shouldClose)
        return;
      event.preventDefault();
      if (keyCode === NavigableKey.LEFT || keyCode === NavigableKey.RIGHT) {
        event.stopPropagation();
      }
      await this.close();
      deactivateActiveItem(this.menu.items);
      this.item?.focus();
      this.item.tabIndex = 0;
      this.item.focus();
    }
    /**
     * Determines whether the given KeyboardEvent code is one that should open
     * the submenu. This is RTL-aware. By default, left, right, space, or enter.
     *
     * @param code The native KeyboardEvent code.
     * @return Whether or not the key code should open the submenu.
     */
    isSubmenuOpenKey(code) {
      const isRtl2 = getComputedStyle(this).direction === "rtl";
      const arrowEnterKey = isRtl2 ? NavigableKey.LEFT : NavigableKey.RIGHT;
      switch (code) {
        case arrowEnterKey:
        case SelectionKey.SPACE:
        case SelectionKey.ENTER:
          return true;
        default:
          return false;
      }
    }
    /**
     * Determines whether the given KeyboardEvent code is one that should close
     * the submenu. This is RTL-aware. By default right, left, or escape.
     *
     * @param code The native KeyboardEvent code.
     * @return Whether or not the key code should close the submenu.
     */
    isSubmenuCloseKey(code) {
      const isRtl2 = getComputedStyle(this).direction === "rtl";
      const arrowEnterKey = isRtl2 ? NavigableKey.RIGHT : NavigableKey.LEFT;
      switch (code) {
        case arrowEnterKey:
        case KeydownCloseKey.ESCAPE:
          return { close: true, keyCode: code };
        default:
          return { close: false };
      }
    }
  };
  __decorate([
    n({ attribute: "anchor-corner" })
  ], SubMenu.prototype, "anchorCorner", void 0);
  __decorate([
    n({ attribute: "menu-corner" })
  ], SubMenu.prototype, "menuCorner", void 0);
  __decorate([
    n({ type: Number, attribute: "hover-open-delay" })
  ], SubMenu.prototype, "hoverOpenDelay", void 0);
  __decorate([
    n({ type: Number, attribute: "hover-close-delay" })
  ], SubMenu.prototype, "hoverCloseDelay", void 0);
  __decorate([
    n({ type: Boolean, reflect: true, attribute: "md-sub-menu" })
  ], SubMenu.prototype, "isSubMenu", void 0);
  __decorate([
    e5({ slot: "item", flatten: true })
  ], SubMenu.prototype, "items", void 0);
  __decorate([
    e5({ slot: "menu", flatten: true })
  ], SubMenu.prototype, "menus", void 0);

  // ../menu/internal/submenu/sub-menu-styles.cssresult.js
  var styles41 = i3`:host{position:relative;display:flex;flex-direction:column}
`;
  var sub_menu_styles_cssresult_default = styles41.styleSheet;

  // ../menu/sub-menu.js
  var MdSubMenu = class MdSubMenu2 extends SubMenu {
  };
  MdSubMenu.styles = [styles41];
  MdSubMenu = __decorate([
    e("md-sub-menu")
  ], MdSubMenu);

  // ../progress/internal/progress.js
  var progressBaseClass = mixinDelegatesAria(s3);
  var Progress = class extends progressBaseClass {
    constructor() {
      super(...arguments);
      this.value = 0;
      this.max = 1;
      this.indeterminate = false;
      this.fourColor = false;
    }
    render() {
      const { ariaLabel } = this;
      return T`
      <div
        class="progress ${o8(this.getRenderClasses())}"
        role="progressbar"
        aria-label="${ariaLabel || A}"
        aria-valuemin="0"
        aria-valuemax=${this.max}
        aria-valuenow=${this.indeterminate ? A : this.value}
        >${this.renderIndicator()}</div
      >
    `;
    }
    getRenderClasses() {
      return {
        "indeterminate": this.indeterminate,
        "four-color": this.fourColor
      };
    }
  };
  __decorate([
    n({ type: Number })
  ], Progress.prototype, "value", void 0);
  __decorate([
    n({ type: Number })
  ], Progress.prototype, "max", void 0);
  __decorate([
    n({ type: Boolean })
  ], Progress.prototype, "indeterminate", void 0);
  __decorate([
    n({ type: Boolean, attribute: "four-color" })
  ], Progress.prototype, "fourColor", void 0);

  // ../progress/internal/circular-progress.js
  var CircularProgress = class extends Progress {
    renderIndicator() {
      if (this.indeterminate) {
        return this.renderIndeterminateContainer();
      }
      return this.renderDeterminateContainer();
    }
    // Determinate mode is rendered with an svg so the progress arc can be
    // easily animated via stroke-dashoffset.
    renderDeterminateContainer() {
      const dashOffset = (1 - this.value / this.max) * 100;
      return T`
      <svg viewBox="0 0 4800 4800">
        <circle class="track" pathLength="100"></circle>
        <circle
          class="active-track"
          pathLength="100"
          stroke-dashoffset=${dashOffset}></circle>
      </svg>
    `;
    }
    // Indeterminate mode rendered with 2 bordered-divs. The borders are
    // clipped into half circles by their containers. The divs are then carefully
    // animated to produce changes to the spinner arc size.
    // This approach has 4.5x the FPS of rendering via svg on Chrome 111.
    // See https://lit.dev/playground/#gist=febb773565272f75408ab06a0eb49746.
    renderIndeterminateContainer() {
      return T` <div class="spinner">
      <div class="left">
        <div class="circle"></div>
      </div>
      <div class="right">
        <div class="circle"></div>
      </div>
    </div>`;
    }
  };

  // ../progress/internal/circular-progress-styles.cssresult.js
  var styles42 = i3`:host{--_active-indicator-color: var(--md-circular-progress-active-indicator-color, var(--md-sys-color-primary, #6750a4));--_active-indicator-width: var(--md-circular-progress-active-indicator-width, 10);--_four-color-active-indicator-four-color: var(--md-circular-progress-four-color-active-indicator-four-color, var(--md-sys-color-tertiary-container, #ffd8e4));--_four-color-active-indicator-one-color: var(--md-circular-progress-four-color-active-indicator-one-color, var(--md-sys-color-primary, #6750a4));--_four-color-active-indicator-three-color: var(--md-circular-progress-four-color-active-indicator-three-color, var(--md-sys-color-tertiary, #7d5260));--_four-color-active-indicator-two-color: var(--md-circular-progress-four-color-active-indicator-two-color, var(--md-sys-color-primary-container, #eaddff));--_size: var(--md-circular-progress-size, 48px);display:inline-flex;vertical-align:middle;width:var(--_size);height:var(--_size);position:relative;align-items:center;justify-content:center;contain:strict;content-visibility:auto}.progress{flex:1;align-self:stretch;margin:4px}.progress,.spinner,.left,.right,.circle,svg,.track,.active-track{position:absolute;inset:0}svg{transform:rotate(-90deg)}circle{cx:50%;cy:50%;r:calc(50%*(1 - var(--_active-indicator-width)/100));stroke-width:calc(var(--_active-indicator-width)*1%);stroke-dasharray:100;fill:rgba(0,0,0,0)}.active-track{transition:stroke-dashoffset 500ms cubic-bezier(0, 0, 0.2, 1);stroke:var(--_active-indicator-color)}.track{stroke:rgba(0,0,0,0)}.progress.indeterminate{animation:linear infinite linear-rotate;animation-duration:1568.2352941176ms}.spinner{animation:infinite both rotate-arc;animation-duration:5332ms;animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}.left{overflow:hidden;inset:0 50% 0 0}.right{overflow:hidden;inset:0 0 0 50%}.circle{box-sizing:border-box;border-radius:50%;border:solid calc(var(--_active-indicator-width)/100*(var(--_size) - 8px));border-color:var(--_active-indicator-color) var(--_active-indicator-color) rgba(0,0,0,0) rgba(0,0,0,0);animation:expand-arc;animation-iteration-count:infinite;animation-fill-mode:both;animation-duration:1333ms,5332ms;animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}.four-color .circle{animation-name:expand-arc,four-color}.left .circle{rotate:135deg;inset:0 -100% 0 0}.right .circle{rotate:100deg;inset:0 0 0 -100%;animation-delay:-666.5ms,0ms}@media(forced-colors: active){.active-track{stroke:CanvasText}.circle{border-color:CanvasText CanvasText Canvas Canvas}}@keyframes expand-arc{0%{transform:rotate(265deg)}50%{transform:rotate(130deg)}100%{transform:rotate(265deg)}}@keyframes rotate-arc{12.5%{transform:rotate(135deg)}25%{transform:rotate(270deg)}37.5%{transform:rotate(405deg)}50%{transform:rotate(540deg)}62.5%{transform:rotate(675deg)}75%{transform:rotate(810deg)}87.5%{transform:rotate(945deg)}100%{transform:rotate(1080deg)}}@keyframes linear-rotate{to{transform:rotate(360deg)}}@keyframes four-color{0%{border-top-color:var(--_four-color-active-indicator-one-color);border-right-color:var(--_four-color-active-indicator-one-color)}15%{border-top-color:var(--_four-color-active-indicator-one-color);border-right-color:var(--_four-color-active-indicator-one-color)}25%{border-top-color:var(--_four-color-active-indicator-two-color);border-right-color:var(--_four-color-active-indicator-two-color)}40%{border-top-color:var(--_four-color-active-indicator-two-color);border-right-color:var(--_four-color-active-indicator-two-color)}50%{border-top-color:var(--_four-color-active-indicator-three-color);border-right-color:var(--_four-color-active-indicator-three-color)}65%{border-top-color:var(--_four-color-active-indicator-three-color);border-right-color:var(--_four-color-active-indicator-three-color)}75%{border-top-color:var(--_four-color-active-indicator-four-color);border-right-color:var(--_four-color-active-indicator-four-color)}90%{border-top-color:var(--_four-color-active-indicator-four-color);border-right-color:var(--_four-color-active-indicator-four-color)}100%{border-top-color:var(--_four-color-active-indicator-one-color);border-right-color:var(--_four-color-active-indicator-one-color)}}
`;
  var circular_progress_styles_cssresult_default = styles42.styleSheet;

  // ../progress/circular-progress.js
  var MdCircularProgress = class MdCircularProgress2 extends CircularProgress {
  };
  MdCircularProgress.styles = [styles42];
  MdCircularProgress = __decorate([
    e("md-circular-progress")
  ], MdCircularProgress);

  // ../progress/internal/linear-progress.js
  var LinearProgress = class extends Progress {
    constructor() {
      super(...arguments);
      this.buffer = 0;
    }
    // Note, the indeterminate animation is rendered with transform %'s
    // Previously, this was optimized to use px calculated with the resizeObserver
    // due to a now fixed Chrome bug: crbug.com/389359.
    renderIndicator() {
      const progressStyles = {
        transform: `scaleX(${(this.indeterminate ? 1 : this.value / this.max) * 100}%)`
      };
      const bufferValue = this.buffer ?? 0;
      const hasBuffer = bufferValue > 0;
      const dotSize = this.indeterminate || !hasBuffer ? 1 : bufferValue / this.max;
      const dotStyles = {
        transform: `scaleX(${dotSize * 100}%)`
      };
      const hideDots = this.indeterminate || !hasBuffer || bufferValue >= this.max || this.value >= this.max;
      return T`
      <div class="dots" ?hidden=${hideDots}></div>
      <div class="inactive-track" style=${o9(dotStyles)}></div>
      <div class="bar primary-bar" style=${o9(progressStyles)}>
        <div class="bar-inner"></div>
      </div>
      <div class="bar secondary-bar">
        <div class="bar-inner"></div>
      </div>
    `;
    }
  };
  __decorate([
    n({ type: Number })
  ], LinearProgress.prototype, "buffer", void 0);

  // ../progress/internal/linear-progress-styles.cssresult.js
  var styles43 = i3`:host{--_active-indicator-color: var(--md-linear-progress-active-indicator-color, var(--md-sys-color-primary, #6750a4));--_active-indicator-height: var(--md-linear-progress-active-indicator-height, 4px);--_four-color-active-indicator-four-color: var(--md-linear-progress-four-color-active-indicator-four-color, var(--md-sys-color-tertiary-container, #ffd8e4));--_four-color-active-indicator-one-color: var(--md-linear-progress-four-color-active-indicator-one-color, var(--md-sys-color-primary, #6750a4));--_four-color-active-indicator-three-color: var(--md-linear-progress-four-color-active-indicator-three-color, var(--md-sys-color-tertiary, #7d5260));--_four-color-active-indicator-two-color: var(--md-linear-progress-four-color-active-indicator-two-color, var(--md-sys-color-primary-container, #eaddff));--_track-color: var(--md-linear-progress-track-color, var(--md-sys-color-surface-container-highest, #e6e0e9));--_track-height: var(--md-linear-progress-track-height, 4px);--_track-shape: var(--md-linear-progress-track-shape, var(--md-sys-shape-corner-none, 0px));border-radius:var(--_track-shape);display:flex;position:relative;min-width:80px;height:var(--_track-height);content-visibility:auto;contain:strict}.progress,.dots,.inactive-track,.bar,.bar-inner{position:absolute}.progress{direction:ltr;inset:0;border-radius:inherit;overflow:hidden;display:flex;align-items:center}.bar{animation:none;width:100%;height:var(--_active-indicator-height);transform-origin:left center;transition:transform 250ms cubic-bezier(0.4, 0, 0.6, 1)}.secondary-bar{display:none}.bar-inner{inset:0;animation:none;background:var(--_active-indicator-color)}.inactive-track{background:var(--_track-color);inset:0;transition:transform 250ms cubic-bezier(0.4, 0, 0.6, 1);transform-origin:left center}.dots{inset:0;animation:linear infinite 250ms;animation-name:buffering;background-color:var(--_track-color);background-repeat:repeat-x;-webkit-mask-image:url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 5 2' preserveAspectRatio='xMinYMin slice'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/svg%3E");mask-image:url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 5 2' preserveAspectRatio='xMinYMin slice'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/svg%3E");z-index:-1}.dots[hidden]{display:none}.indeterminate .bar{transition:none}.indeterminate .primary-bar{inset-inline-start:-145.167%}.indeterminate .secondary-bar{inset-inline-start:-54.8889%;display:block}.indeterminate .primary-bar{animation:linear infinite 2s;animation-name:primary-indeterminate-translate}.indeterminate .primary-bar>.bar-inner{animation:linear infinite 2s primary-indeterminate-scale}.indeterminate.four-color .primary-bar>.bar-inner{animation-name:primary-indeterminate-scale,four-color;animation-duration:2s,4s}.indeterminate .secondary-bar{animation:linear infinite 2s;animation-name:secondary-indeterminate-translate}.indeterminate .secondary-bar>.bar-inner{animation:linear infinite 2s secondary-indeterminate-scale}.indeterminate.four-color .secondary-bar>.bar-inner{animation-name:secondary-indeterminate-scale,four-color;animation-duration:2s,4s}:host(:dir(rtl)){transform:scale(-1)}@keyframes primary-indeterminate-scale{0%{transform:scaleX(0.08)}36.65%{animation-timing-function:cubic-bezier(0.334731, 0.12482, 0.785844, 1);transform:scaleX(0.08)}69.15%{animation-timing-function:cubic-bezier(0.06, 0.11, 0.6, 1);transform:scaleX(0.661479)}100%{transform:scaleX(0.08)}}@keyframes secondary-indeterminate-scale{0%{animation-timing-function:cubic-bezier(0.205028, 0.057051, 0.57661, 0.453971);transform:scaleX(0.08)}19.15%{animation-timing-function:cubic-bezier(0.152313, 0.196432, 0.648374, 1.00432);transform:scaleX(0.457104)}44.15%{animation-timing-function:cubic-bezier(0.257759, -0.003163, 0.211762, 1.38179);transform:scaleX(0.72796)}100%{transform:scaleX(0.08)}}@keyframes buffering{0%{transform:translateX(calc(var(--_track-height) / 2 * 5))}}@keyframes primary-indeterminate-translate{0%{transform:translateX(0px)}20%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(0px)}59.15%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(83.6714%)}100%{transform:translateX(200.611%)}}@keyframes secondary-indeterminate-translate{0%{animation-timing-function:cubic-bezier(0.15, 0, 0.515058, 0.409685);transform:translateX(0px)}25%{animation-timing-function:cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);transform:translateX(37.6519%)}48.35%{animation-timing-function:cubic-bezier(0.4, 0.627035, 0.6, 0.902026);transform:translateX(84.3862%)}100%{transform:translateX(160.278%)}}@keyframes four-color{0%{background:var(--_four-color-active-indicator-one-color)}15%{background:var(--_four-color-active-indicator-one-color)}25%{background:var(--_four-color-active-indicator-two-color)}40%{background:var(--_four-color-active-indicator-two-color)}50%{background:var(--_four-color-active-indicator-three-color)}65%{background:var(--_four-color-active-indicator-three-color)}75%{background:var(--_four-color-active-indicator-four-color)}90%{background:var(--_four-color-active-indicator-four-color)}100%{background:var(--_four-color-active-indicator-one-color)}}@media(forced-colors: active){:host{outline:1px solid CanvasText}.bar-inner,.dots{background-color:CanvasText}}
`;
  var linear_progress_styles_cssresult_default = styles43.styleSheet;

  // ../progress/linear-progress.js
  var MdLinearProgress = class MdLinearProgress2 extends LinearProgress {
  };
  MdLinearProgress.styles = [styles43];
  MdLinearProgress = __decorate([
    e("md-linear-progress")
  ], MdLinearProgress);

  // ../labs/behaviors/focusable.js
  var isFocusable2 = /* @__PURE__ */ Symbol("isFocusable");
  var privateIsFocusable = /* @__PURE__ */ Symbol("privateIsFocusable");
  var externalTabIndex = /* @__PURE__ */ Symbol("externalTabIndex");
  var isUpdatingTabIndex = /* @__PURE__ */ Symbol("isUpdatingTabIndex");
  var updateTabIndex = /* @__PURE__ */ Symbol("updateTabIndex");
  function mixinFocusable(base) {
    var _a3, _b, _c;
    class FocusableElement extends base {
      constructor() {
        super(...arguments);
        this[_a3] = true;
        this[_b] = null;
        this[_c] = false;
      }
      get [isFocusable2]() {
        return this[privateIsFocusable];
      }
      set [isFocusable2](value) {
        if (this[isFocusable2] === value) {
          return;
        }
        this[privateIsFocusable] = value;
        this[updateTabIndex]();
      }
      connectedCallback() {
        super.connectedCallback();
        this[updateTabIndex]();
      }
      attributeChangedCallback(name, old, value) {
        if (name !== "tabindex") {
          super.attributeChangedCallback(name, old, value);
          return;
        }
        this.requestUpdate("tabIndex", Number(old ?? -1));
        if (this[isUpdatingTabIndex]) {
          return;
        }
        if (!this.hasAttribute("tabindex")) {
          this[externalTabIndex] = null;
          this[updateTabIndex]();
          return;
        }
        this[externalTabIndex] = this.tabIndex;
      }
      [(_a3 = privateIsFocusable, _b = externalTabIndex, _c = isUpdatingTabIndex, updateTabIndex)]() {
        const internalTabIndex = this[isFocusable2] ? 0 : -1;
        const computedTabIndex = this[externalTabIndex] ?? internalTabIndex;
        this[isUpdatingTabIndex] = true;
        this.tabIndex = computedTabIndex;
        this[isUpdatingTabIndex] = false;
      }
    }
    __decorate([
      n({ noAccessor: true })
    ], FocusableElement.prototype, "tabIndex", void 0);
    return FocusableElement;
  }

  // ../labs/behaviors/validators/radio-validator.js
  var RadioValidator = class extends Validator {
    computeValidity(states) {
      if (!this.radioElement) {
        this.radioElement = document.createElement("input");
        this.radioElement.type = "radio";
        this.radioElement.name = "group";
      }
      let isRequired = false;
      let isChecked = false;
      for (const { checked, required } of states) {
        if (required) {
          isRequired = true;
        }
        if (checked) {
          isChecked = true;
        }
      }
      this.radioElement.checked = isChecked;
      this.radioElement.required = isRequired;
      return {
        validity: {
          valueMissing: isRequired && !isChecked
        },
        validationMessage: this.radioElement.validationMessage
      };
    }
    equals(prevGroup, nextGroup) {
      if (prevGroup.length !== nextGroup.length) {
        return false;
      }
      for (let i10 = 0; i10 < prevGroup.length; i10++) {
        const prev = prevGroup[i10];
        const next = nextGroup[i10];
        if (prev.checked !== next.checked || prev.required !== next.required) {
          return false;
        }
      }
      return true;
    }
    copy(states) {
      return states.map(({ checked, required }) => ({
        checked,
        required
      }));
    }
  };

  // ../radio/internal/single-selection-controller.js
  var SingleSelectionController = class {
    /**
     * All single selection elements in the host element's root with the same
     * `name` attribute, including the host element.
     */
    get controls() {
      const name = this.host.getAttribute("name");
      if (!name || !this.root || !this.host.isConnected) {
        return [this.host];
      }
      return Array.from(this.root.querySelectorAll(`[name="${CSS.escape(name)}"]`));
    }
    constructor(host) {
      this.host = host;
      this.focused = false;
      this.root = null;
      this.handleFocusIn = () => {
        this.focused = true;
        this.updateTabIndices();
      };
      this.handleFocusOut = () => {
        this.focused = false;
        this.updateTabIndices();
      };
      this.handleKeyDown = (event) => {
        const isDown = event.key === "ArrowDown";
        const isUp = event.key === "ArrowUp";
        const isLeft = event.key === "ArrowLeft";
        const isRight = event.key === "ArrowRight";
        if (!isLeft && !isRight && !isDown && !isUp) {
          return;
        }
        const siblings = this.controls;
        if (!siblings.length) {
          return;
        }
        event.preventDefault();
        const isRtl2 = getComputedStyle(this.host).direction === "rtl";
        const forwards = isRtl2 ? isLeft || isDown : isRight || isDown;
        const hostIndex = siblings.indexOf(this.host);
        if (hostIndex === -1) {
          return;
        }
        let nextIndex = forwards ? hostIndex + 1 : hostIndex - 1;
        while (nextIndex !== hostIndex) {
          if (nextIndex >= siblings.length) {
            nextIndex = 0;
          } else if (nextIndex < 0) {
            nextIndex = siblings.length - 1;
          }
          const nextSibling = siblings[nextIndex];
          if (nextSibling.hasAttribute("disabled")) {
            if (forwards) {
              nextIndex++;
            } else {
              nextIndex--;
            }
            continue;
          }
          for (const sibling of siblings) {
            if (sibling !== nextSibling) {
              sibling.checked = false;
              sibling.tabIndex = -1;
              sibling.blur();
            }
          }
          nextSibling.checked = true;
          nextSibling.tabIndex = 0;
          nextSibling.focus();
          nextSibling.dispatchEvent(new Event("change", { bubbles: true }));
          break;
        }
      };
    }
    hostConnected() {
      this.host.addEventListener("keydown", this.handleKeyDown);
      this.host.addEventListener("focusin", this.handleFocusIn);
      this.host.addEventListener("focusout", this.handleFocusOut);
      queueMicrotask(() => {
        this.root = this.host.getRootNode();
        if (this.host.checked) {
          this.uncheckSiblings();
        }
        this.updateTabIndices();
      });
    }
    hostDisconnected() {
      this.host.removeEventListener("keydown", this.handleKeyDown);
      this.host.removeEventListener("focusin", this.handleFocusIn);
      this.host.removeEventListener("focusout", this.handleFocusOut);
      queueMicrotask(() => {
        this.updateTabIndices();
        this.root = null;
      });
    }
    /**
     * Should be called whenever the host's `checked` property changes
     * synchronously.
     */
    handleCheckedChange() {
      if (!this.host.checked) {
        return;
      }
      this.uncheckSiblings();
      this.updateTabIndices();
    }
    uncheckSiblings() {
      for (const sibling of this.controls) {
        if (sibling !== this.host) {
          sibling.checked = false;
        }
      }
    }
    /**
     * Updates the `tabindex` of the host and its siblings.
     */
    updateTabIndices() {
      const siblings = this.controls;
      const checkedSibling = siblings.find((sibling) => sibling.checked);
      if (checkedSibling || this.focused) {
        const focusable = checkedSibling || this.host;
        focusable.tabIndex = 0;
        for (const sibling of siblings) {
          if (sibling !== focusable) {
            sibling.tabIndex = -1;
          }
        }
        return;
      }
      for (const sibling of siblings) {
        sibling.tabIndex = 0;
      }
    }
  };

  // ../radio/internal/radio.js
  var _a;
  var CHECKED = /* @__PURE__ */ Symbol("checked");
  var maskId = 0;
  var radioBaseClass = mixinConstraintValidation(mixinFormAssociated(mixinElementInternals(mixinFocusable(s3))));
  var Radio = class extends radioBaseClass {
    /**
     * Whether or not the radio is selected.
     */
    get checked() {
      return this[CHECKED];
    }
    set checked(checked) {
      const wasChecked = this.checked;
      if (wasChecked === checked) {
        return;
      }
      this[CHECKED] = checked;
      this.requestUpdate("checked", wasChecked);
      this.selectionController.handleCheckedChange();
    }
    constructor() {
      super();
      this.maskId = `cutout${++maskId}`;
      this[_a] = false;
      this.required = false;
      this.value = "on";
      this.selectionController = new SingleSelectionController(this);
      this.addController(this.selectionController);
      if (!o7) {
        this[internals].role = "radio";
        this.addEventListener("click", this.handleClick.bind(this));
        this.addEventListener("keydown", this.handleKeydown.bind(this));
      }
    }
    render() {
      const classes = { "checked": this.checked };
      return T`
      <div class="container ${o8(classes)}" aria-hidden="true">
        <md-ripple
          part="ripple"
          .control=${this}
          ?disabled=${this.disabled}></md-ripple>
        <md-focus-ring part="focus-ring" .control=${this}></md-focus-ring>
        <svg class="icon" viewBox="0 0 20 20">
          <mask id="${this.maskId}">
            <rect width="100%" height="100%" fill="white" />
            <circle cx="10" cy="10" r="8" fill="black" />
          </mask>
          <circle
            class="outer circle"
            cx="10"
            cy="10"
            r="10"
            mask="url(#${this.maskId})" />
          <circle class="inner circle" cx="10" cy="10" r="5" />
        </svg>

        <div class="touch-target"></div>
      </div>
    `;
    }
    updated() {
      this[internals].ariaChecked = String(this.checked);
    }
    async handleClick(event) {
      if (this.disabled) {
        return;
      }
      await 0;
      if (event.defaultPrevented) {
        return;
      }
      if (isActivationClick(event)) {
        this.focus();
      }
      this.checked = true;
      this.dispatchEvent(new Event("change", { bubbles: true }));
      this.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true }));
    }
    async handleKeydown(event) {
      await 0;
      if (event.key !== " " || event.defaultPrevented) {
        return;
      }
      this.click();
    }
    [(_a = CHECKED, getFormValue)]() {
      return this.checked ? this.value : null;
    }
    [getFormState]() {
      return String(this.checked);
    }
    formResetCallback() {
      this.checked = this.hasAttribute("checked");
    }
    formStateRestoreCallback(state) {
      this.checked = state === "true";
    }
    [createValidator]() {
      return new RadioValidator(() => {
        if (!this.selectionController) {
          return [this];
        }
        return this.selectionController.controls;
      });
    }
    [getValidityAnchor]() {
      return this.container;
    }
  };
  __decorate([
    n({ type: Boolean })
  ], Radio.prototype, "checked", null);
  __decorate([
    n({ type: Boolean })
  ], Radio.prototype, "required", void 0);
  __decorate([
    n()
  ], Radio.prototype, "value", void 0);
  __decorate([
    i2(".container")
  ], Radio.prototype, "container", void 0);

  // ../radio/internal/radio-styles.cssresult.js
  var styles44 = i3`@layer{:host{display:inline-flex;height:var(--md-radio-icon-size, 20px);outline:none;position:relative;vertical-align:top;width:var(--md-radio-icon-size, 20px);-webkit-tap-highlight-color:rgba(0,0,0,0);cursor:pointer;--md-ripple-hover-color: var(--md-radio-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-hover-opacity: var(--md-radio-hover-state-layer-opacity, 0.08);--md-ripple-pressed-color: var(--md-radio-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--md-ripple-pressed-opacity: var(--md-radio-pressed-state-layer-opacity, 0.12)}:host([disabled]){cursor:default}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--md-radio-icon-size, 20px))/2)}.container{display:flex;height:100%;place-content:center;place-items:center;width:100%}md-focus-ring{height:44px;inset:unset;width:44px}.checked{--md-ripple-hover-color: var(--md-radio-selected-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--md-ripple-hover-opacity: var(--md-radio-selected-hover-state-layer-opacity, 0.08);--md-ripple-pressed-color: var(--md-radio-selected-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-pressed-opacity: var(--md-radio-selected-pressed-state-layer-opacity, 0.12)}.touch-target{height:48px;position:absolute;width:48px}:host([touch-target=none]) .touch-target{display:none}md-ripple{border-radius:50%;height:var(--md-radio-state-layer-size, 40px);inset:unset;width:var(--md-radio-state-layer-size, 40px)}.icon{fill:var(--md-radio-icon-color, var(--md-sys-color-on-surface-variant, #49454f));inset:0;position:absolute}.outer.circle{transition:fill 50ms linear}.inner.circle{opacity:0;transform-origin:center;transition:opacity 50ms linear}.checked .icon{fill:var(--md-radio-selected-icon-color, var(--md-sys-color-primary, #6750a4))}.checked .inner.circle{animation:inner-circle-grow 300ms cubic-bezier(0.05, 0.7, 0.1, 1);opacity:1}@keyframes inner-circle-grow{from{transform:scale(0)}to{transform:scale(1)}}:host([disabled]) .circle{animation-duration:0s;transition-duration:0s}:host(:hover) .icon{fill:var(--md-radio-hover-icon-color, var(--md-sys-color-on-surface, #1d1b20))}:host(:focus-within) .icon{fill:var(--md-radio-focus-icon-color, var(--md-sys-color-on-surface, #1d1b20))}:host(:active) .icon{fill:var(--md-radio-pressed-icon-color, var(--md-sys-color-on-surface, #1d1b20))}:host([disabled]) .icon{fill:var(--md-radio-disabled-unselected-icon-color, var(--md-sys-color-on-surface, #1d1b20));opacity:var(--md-radio-disabled-unselected-icon-opacity, 0.38)}:host(:hover) .checked .icon{fill:var(--md-radio-selected-hover-icon-color, var(--md-sys-color-primary, #6750a4))}:host(:focus-within) .checked .icon{fill:var(--md-radio-selected-focus-icon-color, var(--md-sys-color-primary, #6750a4))}:host(:active) .checked .icon{fill:var(--md-radio-selected-pressed-icon-color, var(--md-sys-color-primary, #6750a4))}:host([disabled]) .checked .icon{fill:var(--md-radio-disabled-selected-icon-color, var(--md-sys-color-on-surface, #1d1b20));opacity:var(--md-radio-disabled-selected-icon-opacity, 0.38)}}@layer hcm{@media(forced-colors: active){.icon{fill:CanvasText}:host([disabled]) .icon{fill:GrayText;opacity:1}}}
`;
  var radio_styles_cssresult_default = styles44.styleSheet;

  // ../radio/radio.js
  var MdRadio = class MdRadio2 extends Radio {
  };
  MdRadio.styles = [styles44];
  MdRadio = __decorate([
    e("md-radio")
  ], MdRadio);

  // ../labs/behaviors/on-report-validity.js
  var onReportValidity = /* @__PURE__ */ Symbol("onReportValidity");
  var privateCleanupFormListeners = /* @__PURE__ */ Symbol("privateCleanupFormListeners");
  var privateDoNotReportInvalid = /* @__PURE__ */ Symbol("privateDoNotReportInvalid");
  var privateIsSelfReportingValidity = /* @__PURE__ */ Symbol("privateIsSelfReportingValidity");
  var privateCallOnReportValidity = /* @__PURE__ */ Symbol("privateCallOnReportValidity");
  function mixinOnReportValidity(base) {
    var _a3, _b, _c;
    class OnReportValidityElement extends base {
      // Mixins must have a constructor with `...args: any[]`
      // tslint:disable-next-line:no-any
      constructor(...args) {
        super(...args);
        this[_a3] = new AbortController();
        this[_b] = false;
        this[_c] = false;
        if (o7) {
          return;
        }
        this.addEventListener("invalid", (invalidEvent) => {
          if (this[privateDoNotReportInvalid] || !invalidEvent.isTrusted) {
            return;
          }
          this.addEventListener("invalid", () => {
            this[privateCallOnReportValidity](invalidEvent);
          }, { once: true });
        }, {
          // Listen during the capture phase, which will happen before the
          // bubbling phase. That way, we can add a final event listener that
          // will run after other event listeners, and we can check if it was
          // default prevented. This works because invalid does not bubble.
          capture: true
        });
      }
      checkValidity() {
        this[privateDoNotReportInvalid] = true;
        const valid = super.checkValidity();
        this[privateDoNotReportInvalid] = false;
        return valid;
      }
      reportValidity() {
        this[privateIsSelfReportingValidity] = true;
        const valid = super.reportValidity();
        if (valid) {
          this[privateCallOnReportValidity](null);
        }
        this[privateIsSelfReportingValidity] = false;
        return valid;
      }
      [(_a3 = privateCleanupFormListeners, _b = privateDoNotReportInvalid, _c = privateIsSelfReportingValidity, privateCallOnReportValidity)](invalidEvent) {
        const wasCanceled = invalidEvent?.defaultPrevented;
        if (wasCanceled) {
          return;
        }
        this[onReportValidity](invalidEvent);
        const implementationCanceledFocus = !wasCanceled && invalidEvent?.defaultPrevented;
        if (!implementationCanceledFocus) {
          return;
        }
        if (this[privateIsSelfReportingValidity] || isFirstInvalidControlInForm(this[internals].form, this)) {
          this.focus();
        }
      }
      [onReportValidity](invalidEvent) {
        throw new Error("Implement [onReportValidity]");
      }
      formAssociatedCallback(form) {
        if (super.formAssociatedCallback) {
          super.formAssociatedCallback(form);
        }
        this[privateCleanupFormListeners].abort();
        if (!form) {
          return;
        }
        this[privateCleanupFormListeners] = new AbortController();
        addFormReportValidListener(this, form, () => {
          this[privateCallOnReportValidity](null);
        }, this[privateCleanupFormListeners].signal);
      }
    }
    return OnReportValidityElement;
  }
  function addFormReportValidListener(control, form, onControlValid, cleanup) {
    const validateHooks = getFormValidateHooks(form);
    let controlFiredInvalid = false;
    let cleanupInvalidListener;
    let isNextSubmitFromHook = false;
    validateHooks.addEventListener("before", () => {
      isNextSubmitFromHook = true;
      cleanupInvalidListener = new AbortController();
      controlFiredInvalid = false;
      control.addEventListener("invalid", () => {
        controlFiredInvalid = true;
      }, {
        signal: cleanupInvalidListener.signal
      });
    }, { signal: cleanup });
    validateHooks.addEventListener("after", () => {
      isNextSubmitFromHook = false;
      cleanupInvalidListener?.abort();
      if (controlFiredInvalid) {
        return;
      }
      onControlValid();
    }, { signal: cleanup });
    form.addEventListener("submit", () => {
      if (isNextSubmitFromHook) {
        return;
      }
      onControlValid();
    }, {
      signal: cleanup
    });
  }
  var FORM_VALIDATE_HOOKS = /* @__PURE__ */ new WeakMap();
  function getFormValidateHooks(form) {
    if (!FORM_VALIDATE_HOOKS.has(form)) {
      const hooks = new EventTarget();
      FORM_VALIDATE_HOOKS.set(form, hooks);
      for (const methodName of ["reportValidity", "requestSubmit"]) {
        const superMethod = form[methodName];
        form[methodName] = function() {
          hooks.dispatchEvent(new Event("before"));
          const result = Reflect.apply(superMethod, this, arguments);
          hooks.dispatchEvent(new Event("after"));
          return result;
        };
      }
    }
    return FORM_VALIDATE_HOOKS.get(form);
  }
  function isFirstInvalidControlInForm(form, control) {
    if (!form) {
      return true;
    }
    let firstInvalidControl;
    for (const element of form.elements) {
      if (element.matches(":invalid")) {
        firstInvalidControl = element;
        break;
      }
    }
    return firstInvalidControl === control;
  }

  // ../labs/behaviors/validators/select-validator.js
  var SelectValidator = class extends Validator {
    computeValidity(state) {
      if (!this.selectControl) {
        this.selectControl = document.createElement("select");
      }
      B(T`<option value=${state.value}></option>`, this.selectControl);
      this.selectControl.value = state.value;
      this.selectControl.required = state.required;
      return {
        validity: this.selectControl.validity,
        validationMessage: this.selectControl.validationMessage
      };
    }
    equals(prev, next) {
      return prev.value === next.value && prev.required === next.required;
    }
    copy({ value, required }) {
      return { value, required };
    }
  };

  // ../select/internal/shared.js
  function getSelectedItems(items) {
    const selectedItemRecords = [];
    for (let i10 = 0; i10 < items.length; i10++) {
      const item = items[i10];
      if (item.selected) {
        selectedItemRecords.push([item, i10]);
      }
    }
    return selectedItemRecords;
  }

  // ../select/internal/select.js
  var _a2;
  var VALUE = /* @__PURE__ */ Symbol("value");
  var selectBaseClass = mixinDelegatesAria(mixinOnReportValidity(mixinConstraintValidation(mixinFormAssociated(mixinElementInternals(s3)))));
  var Select = class extends selectBaseClass {
    /**
     * The value of the currently selected option.
     *
     * Note: For SSR, set `[selected]` on the requested option and `displayText`
     * rather than setting `value` setting `value` will incur a DOM query.
     */
    get value() {
      return this[VALUE];
    }
    set value(value) {
      if (o7)
        return;
      this.lastUserSetValue = value;
      this.select(value);
    }
    get options() {
      return this.menu?.items ?? [];
    }
    /**
     * The index of the currently selected option.
     *
     * Note: For SSR, set `[selected]` on the requested option and `displayText`
     * rather than setting `selectedIndex` setting `selectedIndex` will incur a
     * DOM query.
     */
    get selectedIndex() {
      const [_option, index] = (this.getSelectedOptions() ?? [])[0] ?? [];
      return index ?? -1;
    }
    set selectedIndex(index) {
      this.lastUserSetSelectedIndex = index;
      this.selectIndex(index);
    }
    /**
     * Returns an array of selected options.
     *
     * NOTE: md-select only supports single selection.
     */
    get selectedOptions() {
      return (this.getSelectedOptions() ?? []).map(([option]) => option);
    }
    get hasError() {
      return this.error || this.nativeError;
    }
    constructor() {
      super();
      this.quick = false;
      this.required = false;
      this.errorText = "";
      this.label = "";
      this.noAsterisk = false;
      this.supportingText = "";
      this.error = false;
      this.menuPositioning = "popover";
      this.clampMenuWidth = false;
      this.typeaheadDelay = DEFAULT_TYPEAHEAD_BUFFER_TIME;
      this.hasLeadingIcon = false;
      this.displayText = "";
      this.menuAlign = "start";
      this[_a2] = "";
      this.lastUserSetValue = null;
      this.lastUserSetSelectedIndex = null;
      this.lastSelectedOption = null;
      this.lastSelectedOptionRecords = [];
      this.nativeError = false;
      this.nativeErrorText = "";
      this.focused = false;
      this.open = false;
      this.defaultFocus = FocusState.NONE;
      this.prevOpen = this.open;
      this.selectWidth = 0;
      if (o7) {
        return;
      }
      this.addEventListener("focus", this.handleFocus.bind(this));
      this.addEventListener("blur", this.handleBlur.bind(this));
    }
    /**
     * Selects an option given the value of the option, and updates MdSelect's
     * value.
     */
    select(value) {
      const optionToSelect = this.options.find((option) => option.value === value);
      if (optionToSelect) {
        this.selectItem(optionToSelect);
      }
    }
    /**
     * Selects an option given the index of the option, and updates MdSelect's
     * value.
     */
    selectIndex(index) {
      const optionToSelect = this.options[index];
      if (optionToSelect) {
        this.selectItem(optionToSelect);
      }
    }
    /**
     * Reset the select to its default value.
     */
    reset() {
      for (const option of this.options) {
        option.selected = option.hasAttribute("selected");
      }
      this.updateValueAndDisplayText();
      this.nativeError = false;
      this.nativeErrorText = "";
    }
    /** Shows the picker. If it's already open, this is a no-op. */
    showPicker() {
      this.open = true;
    }
    [(_a2 = VALUE, onReportValidity)](invalidEvent) {
      invalidEvent?.preventDefault();
      const prevMessage = this.getErrorText();
      this.nativeError = !!invalidEvent;
      this.nativeErrorText = this.validationMessage;
      if (prevMessage === this.getErrorText()) {
        this.field?.reannounceError();
      }
    }
    update(changed) {
      if (!this.hasUpdated) {
        this.initUserSelection();
      }
      if (this.prevOpen !== this.open && this.open) {
        const selectRect = this.getBoundingClientRect();
        this.selectWidth = selectRect.width;
      }
      this.prevOpen = this.open;
      super.update(changed);
    }
    render() {
      return T`
      <span
        class="select ${o8(this.getRenderClasses())}"
        @focusout=${this.handleFocusout}>
        ${this.renderField()} ${this.renderMenu()}
      </span>
    `;
    }
    async firstUpdated(changed) {
      await this.menu?.updateComplete;
      if (!this.lastSelectedOptionRecords.length) {
        this.initUserSelection();
      }
      if (!this.lastSelectedOptionRecords.length && !o7 && !this.options.length) {
        setTimeout(() => {
          this.updateValueAndDisplayText();
        });
      }
      super.firstUpdated(changed);
    }
    getRenderClasses() {
      return {
        "disabled": this.disabled,
        "error": this.error,
        "open": this.open
      };
    }
    renderField() {
      const ariaLabel = this.ariaLabel || this.label;
      return n7`
      <${this.fieldTag}
          aria-haspopup="listbox"
          role="combobox"
          part="field"
          id="field"
          tabindex=${this.disabled ? "-1" : "0"}
          aria-label=${ariaLabel || A}
          aria-describedby="description"
          aria-expanded=${this.open ? "true" : "false"}
          aria-controls="listbox"
          class="field"
          label=${this.label}
          ?no-asterisk=${this.noAsterisk}
          .focused=${this.focused || this.open}
          .populated=${!!this.displayText}
          .disabled=${this.disabled}
          .required=${this.required}
          .error=${this.hasError}
          ?has-start=${this.hasLeadingIcon}
          has-end
          supporting-text=${this.supportingText}
          error-text=${this.getErrorText()}
          @keydown=${this.handleKeydown}
          @click=${this.handleClick}>
         ${this.renderFieldContent()}
         <div id="description" slot="aria-describedby"></div>
      </${this.fieldTag}>`;
    }
    renderFieldContent() {
      return [
        this.renderLeadingIcon(),
        this.renderLabel(),
        this.renderTrailingIcon()
      ];
    }
    renderLeadingIcon() {
      return T`
      <span class="icon leading" slot="start">
        <slot name="leading-icon" @slotchange=${this.handleIconChange}></slot>
      </span>
    `;
    }
    renderTrailingIcon() {
      return T`
      <span class="icon trailing" slot="end">
        <slot name="trailing-icon" @slotchange=${this.handleIconChange}>
          <svg height="5" viewBox="7 10 10 5" focusable="false">
            <polygon
              class="down"
              stroke="none"
              fill-rule="evenodd"
              points="7 10 12 15 17 10"></polygon>
            <polygon
              class="up"
              stroke="none"
              fill-rule="evenodd"
              points="7 15 12 10 17 15"></polygon>
          </svg>
        </slot>
      </span>
    `;
    }
    renderLabel() {
      return T`<div id="label">${this.displayText || T`&nbsp;`}</div>`;
    }
    renderMenu() {
      const ariaLabel = this.label || this.ariaLabel;
      return T`<div class="menu-wrapper">
      <md-menu
        id="listbox"
        .defaultFocus=${this.defaultFocus}
        role="listbox"
        tabindex="-1"
        aria-label=${ariaLabel || A}
        stay-open-on-focusout
        part="menu"
        exportparts="focus-ring: menu-focus-ring"
        anchor="field"
        style=${o9({
        "--__menu-min-width": `${this.selectWidth}px`,
        "--__menu-max-width": this.clampMenuWidth ? `${this.selectWidth}px` : void 0
      })}
        no-navigation-wrap
        .open=${this.open}
        .quick=${this.quick}
        .positioning=${this.menuPositioning}
        .typeaheadDelay=${this.typeaheadDelay}
        .anchorCorner=${this.menuAlign === "start" ? "end-start" : "end-end"}
        .menuCorner=${this.menuAlign === "start" ? "start-start" : "start-end"}
        @opening=${this.handleOpening}
        @opened=${this.redispatchEvent}
        @closing=${this.redispatchEvent}
        @closed=${this.handleClosed}
        @close-menu=${this.handleCloseMenu}
        @request-selection=${this.handleRequestSelection}
        @request-deselection=${this.handleRequestDeselection}>
        ${this.renderMenuContent()}
      </md-menu>
    </div>`;
    }
    renderMenuContent() {
      return T`<slot></slot>`;
    }
    /**
     * Handles opening the select on keydown and typahead selection when the menu
     * is closed.
     */
    handleKeydown(event) {
      if (this.open || this.disabled || !this.menu) {
        return;
      }
      const typeaheadController = this.menu.typeaheadController;
      const isOpenKey = event.code === "Space" || event.code === "ArrowDown" || event.code === "ArrowUp" || event.code === "End" || event.code === "Home" || event.code === "Enter";
      if (!typeaheadController.isTypingAhead && isOpenKey) {
        event.preventDefault();
        this.open = true;
        switch (event.code) {
          case "Space":
          case "ArrowDown":
          case "Enter":
            this.defaultFocus = FocusState.NONE;
            break;
          case "End":
            this.defaultFocus = FocusState.LAST_ITEM;
            break;
          case "ArrowUp":
          case "Home":
            this.defaultFocus = FocusState.FIRST_ITEM;
            break;
          default:
            break;
        }
        return;
      }
      const isPrintableKey = event.key.length === 1;
      if (isPrintableKey) {
        typeaheadController.onKeydown(event);
        event.preventDefault();
        const { lastActiveRecord } = typeaheadController;
        if (!lastActiveRecord) {
          return;
        }
        this.labelEl?.setAttribute?.("aria-live", "polite");
        const hasChanged = this.selectItem(lastActiveRecord[TYPEAHEAD_RECORD.ITEM]);
        if (hasChanged) {
          this.dispatchInteractionEvents();
        }
      }
    }
    handleClick() {
      this.open = !this.open;
    }
    handleFocus() {
      this.focused = true;
    }
    handleBlur() {
      this.focused = false;
    }
    /**
     * Handles closing the menu when the focus leaves the select's subtree.
     */
    handleFocusout(event) {
      if (event.relatedTarget && isElementInSubtree(event.relatedTarget, this)) {
        return;
      }
      this.open = false;
    }
    /**
     * Gets a list of all selected select options as a list item record array.
     *
     * @return An array of selected list option records.
     */
    getSelectedOptions() {
      if (!this.menu) {
        this.lastSelectedOptionRecords = [];
        return null;
      }
      const items = this.menu.items;
      this.lastSelectedOptionRecords = getSelectedItems(items);
      return this.lastSelectedOptionRecords;
    }
    async getUpdateComplete() {
      await this.menu?.updateComplete;
      return super.getUpdateComplete();
    }
    /**
     * Gets the selected options from the DOM, and updates the value and display
     * text to the first selected option's value and headline respectively.
     *
     * @return Whether or not the selected option has changed since last update.
     */
    updateValueAndDisplayText() {
      const selectedOptions = this.getSelectedOptions() ?? [];
      let hasSelectedOptionChanged = false;
      if (selectedOptions.length) {
        const [firstSelectedOption] = selectedOptions[0];
        hasSelectedOptionChanged = this.lastSelectedOption !== firstSelectedOption;
        this.lastSelectedOption = firstSelectedOption;
        this[VALUE] = firstSelectedOption.value;
        this.displayText = firstSelectedOption.displayText;
      } else {
        hasSelectedOptionChanged = this.lastSelectedOption !== null;
        this.lastSelectedOption = null;
        this[VALUE] = "";
        this.displayText = "";
      }
      return hasSelectedOptionChanged;
    }
    /**
     * Focuses and activates the last selected item upon opening, and resets other
     * active items.
     */
    async handleOpening(e13) {
      this.labelEl?.removeAttribute?.("aria-live");
      this.redispatchEvent(e13);
      if (this.defaultFocus !== FocusState.NONE) {
        return;
      }
      const items = this.menu.items;
      const activeItem = getActiveItem(items)?.item;
      let [selectedItem] = this.lastSelectedOptionRecords[0] ?? [null];
      if (activeItem && activeItem !== selectedItem) {
        activeItem.tabIndex = -1;
      }
      selectedItem = selectedItem ?? items[0];
      if (selectedItem) {
        selectedItem.tabIndex = 0;
        selectedItem.focus();
      }
    }
    redispatchEvent(e13) {
      redispatchEvent(this, e13);
    }
    handleClosed(e13) {
      this.open = false;
      this.redispatchEvent(e13);
    }
    /**
     * Determines the reason for closing, and updates the UI accordingly.
     */
    handleCloseMenu(event) {
      const reason = event.detail.reason;
      const item = event.detail.itemPath[0];
      this.open = false;
      let hasChanged = false;
      if (reason.kind === "click-selection") {
        hasChanged = this.selectItem(item);
      } else if (reason.kind === "keydown" && isSelectableKey(reason.key)) {
        hasChanged = this.selectItem(item);
      } else {
        item.tabIndex = -1;
        item.blur();
      }
      if (hasChanged) {
        this.dispatchInteractionEvents();
      }
    }
    /**
     * Selects a given option, deselects other options, and updates the UI.
     *
     * @return Whether the last selected option has changed.
     */
    selectItem(item) {
      const selectedOptions = this.getSelectedOptions() ?? [];
      selectedOptions.forEach(([option]) => {
        if (item !== option) {
          option.selected = false;
          option.tabIndex = -1;
        }
      });
      item.selected = true;
      item.tabIndex = 0;
      return this.updateValueAndDisplayText();
    }
    /**
     * Handles updating selection when an option element requests selection via
     * property / attribute change.
     */
    handleRequestSelection(event) {
      const requestingOptionEl = event.target;
      if (this.lastSelectedOptionRecords.some(([option]) => option === requestingOptionEl)) {
        return;
      }
      this.selectItem(requestingOptionEl);
    }
    /**
     * Handles updating selection when an option element requests deselection via
     * property / attribute change.
     */
    handleRequestDeselection(event) {
      const requestingOptionEl = event.target;
      if (!this.lastSelectedOptionRecords.some(([option]) => option === requestingOptionEl)) {
        return;
      }
      this.updateValueAndDisplayText();
    }
    /**
     * Attempts to initialize the selected option from user-settable values like
     * SSR, setting `value`, or `selectedIndex` at startup.
     */
    initUserSelection() {
      if (this.lastUserSetValue && !this.lastSelectedOptionRecords.length) {
        this.select(this.lastUserSetValue);
      } else if (this.lastUserSetSelectedIndex !== null && !this.lastSelectedOptionRecords.length) {
        this.selectIndex(this.lastUserSetSelectedIndex);
      } else {
        this.updateValueAndDisplayText();
      }
    }
    handleIconChange() {
      this.hasLeadingIcon = this.leadingIcons.length > 0;
    }
    /**
     * Dispatches the `input` and `change` events.
     */
    dispatchInteractionEvents() {
      this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
      this.dispatchEvent(new Event("change", { bubbles: true }));
    }
    getErrorText() {
      return this.error ? this.errorText : this.nativeErrorText;
    }
    [getFormValue]() {
      return this.value;
    }
    formResetCallback() {
      this.reset();
    }
    formStateRestoreCallback(state) {
      this.value = state;
    }
    click() {
      this.field?.click();
    }
    [createValidator]() {
      return new SelectValidator(() => this);
    }
    [getValidityAnchor]() {
      return this.field;
    }
  };
  Select.shadowRootOptions = {
    ...s3.shadowRootOptions,
    delegatesFocus: true
  };
  __decorate([
    n({ type: Boolean })
  ], Select.prototype, "quick", void 0);
  __decorate([
    n({ type: Boolean })
  ], Select.prototype, "required", void 0);
  __decorate([
    n({ type: String, attribute: "error-text" })
  ], Select.prototype, "errorText", void 0);
  __decorate([
    n()
  ], Select.prototype, "label", void 0);
  __decorate([
    n({ type: Boolean, attribute: "no-asterisk" })
  ], Select.prototype, "noAsterisk", void 0);
  __decorate([
    n({ type: String, attribute: "supporting-text" })
  ], Select.prototype, "supportingText", void 0);
  __decorate([
    n({ type: Boolean, reflect: true })
  ], Select.prototype, "error", void 0);
  __decorate([
    n({ attribute: "menu-positioning" })
  ], Select.prototype, "menuPositioning", void 0);
  __decorate([
    n({ type: Boolean, attribute: "clamp-menu-width" })
  ], Select.prototype, "clampMenuWidth", void 0);
  __decorate([
    n({ type: Number, attribute: "typeahead-delay" })
  ], Select.prototype, "typeaheadDelay", void 0);
  __decorate([
    n({ type: Boolean, attribute: "has-leading-icon" })
  ], Select.prototype, "hasLeadingIcon", void 0);
  __decorate([
    n({ attribute: "display-text" })
  ], Select.prototype, "displayText", void 0);
  __decorate([
    n({ attribute: "menu-align" })
  ], Select.prototype, "menuAlign", void 0);
  __decorate([
    n()
  ], Select.prototype, "value", null);
  __decorate([
    n({ type: Number, attribute: "selected-index" })
  ], Select.prototype, "selectedIndex", null);
  __decorate([
    t()
  ], Select.prototype, "nativeError", void 0);
  __decorate([
    t()
  ], Select.prototype, "nativeErrorText", void 0);
  __decorate([
    t()
  ], Select.prototype, "focused", void 0);
  __decorate([
    t()
  ], Select.prototype, "open", void 0);
  __decorate([
    t()
  ], Select.prototype, "defaultFocus", void 0);
  __decorate([
    i2(".field")
  ], Select.prototype, "field", void 0);
  __decorate([
    i2("md-menu")
  ], Select.prototype, "menu", void 0);
  __decorate([
    i2("#label")
  ], Select.prototype, "labelEl", void 0);
  __decorate([
    e5({ slot: "leading-icon", flatten: true })
  ], Select.prototype, "leadingIcons", void 0);

  // ../select/internal/filled-select.js
  var FilledSelect = class extends Select {
    constructor() {
      super(...arguments);
      this.fieldTag = i6`md-filled-field`;
    }
  };

  // ../select/internal/filled-select-styles.cssresult.js
  var styles45 = i3`:host{--_text-field-active-indicator-color: var(--md-filled-select-text-field-active-indicator-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-active-indicator-height: var(--md-filled-select-text-field-active-indicator-height, 1px);--_text-field-container-color: var(--md-filled-select-text-field-container-color, var(--md-sys-color-surface-container-highest, #e6e0e9));--_text-field-disabled-active-indicator-color: var(--md-filled-select-text-field-disabled-active-indicator-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-active-indicator-height: var(--md-filled-select-text-field-disabled-active-indicator-height, 1px);--_text-field-disabled-active-indicator-opacity: var(--md-filled-select-text-field-disabled-active-indicator-opacity, 0.38);--_text-field-disabled-container-color: var(--md-filled-select-text-field-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-container-opacity: var(--md-filled-select-text-field-disabled-container-opacity, 0.04);--_text-field-disabled-input-text-color: var(--md-filled-select-text-field-disabled-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-input-text-opacity: var(--md-filled-select-text-field-disabled-input-text-opacity, 0.38);--_text-field-disabled-label-text-color: var(--md-filled-select-text-field-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-label-text-opacity: var(--md-filled-select-text-field-disabled-label-text-opacity, 0.38);--_text-field-disabled-leading-icon-color: var(--md-filled-select-text-field-disabled-leading-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-leading-icon-opacity: var(--md-filled-select-text-field-disabled-leading-icon-opacity, 0.38);--_text-field-disabled-supporting-text-color: var(--md-filled-select-text-field-disabled-supporting-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-supporting-text-opacity: var(--md-filled-select-text-field-disabled-supporting-text-opacity, 0.38);--_text-field-disabled-trailing-icon-color: var(--md-filled-select-text-field-disabled-trailing-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-trailing-icon-opacity: var(--md-filled-select-text-field-disabled-trailing-icon-opacity, 0.38);--_text-field-error-active-indicator-color: var(--md-filled-select-text-field-error-active-indicator-color, var(--md-sys-color-error, #b3261e));--_text-field-error-focus-active-indicator-color: var(--md-filled-select-text-field-error-focus-active-indicator-color, var(--md-sys-color-error, #b3261e));--_text-field-error-focus-input-text-color: var(--md-filled-select-text-field-error-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-error-focus-label-text-color: var(--md-filled-select-text-field-error-focus-label-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-focus-leading-icon-color: var(--md-filled-select-text-field-error-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-error-focus-supporting-text-color: var(--md-filled-select-text-field-error-focus-supporting-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-focus-trailing-icon-color: var(--md-filled-select-text-field-error-focus-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_text-field-error-hover-active-indicator-color: var(--md-filled-select-text-field-error-hover-active-indicator-color, var(--md-sys-color-on-error-container, #410e0b));--_text-field-error-hover-input-text-color: var(--md-filled-select-text-field-error-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-error-hover-label-text-color: var(--md-filled-select-text-field-error-hover-label-text-color, var(--md-sys-color-on-error-container, #410e0b));--_text-field-error-hover-leading-icon-color: var(--md-filled-select-text-field-error-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-error-hover-state-layer-color: var(--md-filled-select-text-field-error-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-error-hover-state-layer-opacity: var(--md-filled-select-text-field-error-hover-state-layer-opacity, 0.08);--_text-field-error-hover-supporting-text-color: var(--md-filled-select-text-field-error-hover-supporting-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-hover-trailing-icon-color: var(--md-filled-select-text-field-error-hover-trailing-icon-color, var(--md-sys-color-on-error-container, #410e0b));--_text-field-error-input-text-color: var(--md-filled-select-text-field-error-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-error-label-text-color: var(--md-filled-select-text-field-error-label-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-leading-icon-color: var(--md-filled-select-text-field-error-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-error-supporting-text-color: var(--md-filled-select-text-field-error-supporting-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-trailing-icon-color: var(--md-filled-select-text-field-error-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_text-field-focus-active-indicator-color: var(--md-filled-select-text-field-focus-active-indicator-color, var(--md-sys-color-primary, #6750a4));--_text-field-focus-active-indicator-height: var(--md-filled-select-text-field-focus-active-indicator-height, 3px);--_text-field-focus-input-text-color: var(--md-filled-select-text-field-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-focus-label-text-color: var(--md-filled-select-text-field-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_text-field-focus-leading-icon-color: var(--md-filled-select-text-field-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-focus-supporting-text-color: var(--md-filled-select-text-field-focus-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-focus-trailing-icon-color: var(--md-filled-select-text-field-focus-trailing-icon-color, var(--md-sys-color-primary, #6750a4));--_text-field-hover-active-indicator-color: var(--md-filled-select-text-field-hover-active-indicator-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-hover-active-indicator-height: var(--md-filled-select-text-field-hover-active-indicator-height, 1px);--_text-field-hover-input-text-color: var(--md-filled-select-text-field-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-hover-label-text-color: var(--md-filled-select-text-field-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-hover-leading-icon-color: var(--md-filled-select-text-field-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-hover-state-layer-color: var(--md-filled-select-text-field-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-hover-state-layer-opacity: var(--md-filled-select-text-field-hover-state-layer-opacity, 0.08);--_text-field-hover-supporting-text-color: var(--md-filled-select-text-field-hover-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-hover-trailing-icon-color: var(--md-filled-select-text-field-hover-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-input-text-color: var(--md-filled-select-text-field-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-input-text-font: var(--md-filled-select-text-field-input-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_text-field-input-text-line-height: var(--md-filled-select-text-field-input-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_text-field-input-text-size: var(--md-filled-select-text-field-input-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_text-field-input-text-weight: var(--md-filled-select-text-field-input-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_text-field-label-text-color: var(--md-filled-select-text-field-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-label-text-font: var(--md-filled-select-text-field-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_text-field-label-text-line-height: var(--md-filled-select-text-field-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_text-field-label-text-populated-line-height: var(--md-filled-select-text-field-label-text-populated-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_text-field-label-text-populated-size: var(--md-filled-select-text-field-label-text-populated-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_text-field-label-text-size: var(--md-filled-select-text-field-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_text-field-label-text-weight: var(--md-filled-select-text-field-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_text-field-leading-icon-color: var(--md-filled-select-text-field-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-leading-icon-size: var(--md-filled-select-text-field-leading-icon-size, 24px);--_text-field-supporting-text-color: var(--md-filled-select-text-field-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-supporting-text-font: var(--md-filled-select-text-field-supporting-text-font, var(--md-sys-typescale-body-small-font, var(--md-ref-typeface-plain, Roboto)));--_text-field-supporting-text-line-height: var(--md-filled-select-text-field-supporting-text-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_text-field-supporting-text-size: var(--md-filled-select-text-field-supporting-text-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_text-field-supporting-text-weight: var(--md-filled-select-text-field-supporting-text-weight, var(--md-sys-typescale-body-small-weight, var(--md-ref-typeface-weight-regular, 400)));--_text-field-trailing-icon-color: var(--md-filled-select-text-field-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-trailing-icon-size: var(--md-filled-select-text-field-trailing-icon-size, 24px);--_text-field-container-shape-start-start: var(--md-filled-select-text-field-container-shape-start-start, var(--md-filled-select-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_text-field-container-shape-start-end: var(--md-filled-select-text-field-container-shape-start-end, var(--md-filled-select-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_text-field-container-shape-end-end: var(--md-filled-select-text-field-container-shape-end-end, var(--md-filled-select-text-field-container-shape, var(--md-sys-shape-corner-none, 0px)));--_text-field-container-shape-end-start: var(--md-filled-select-text-field-container-shape-end-start, var(--md-filled-select-text-field-container-shape, var(--md-sys-shape-corner-none, 0px)));--md-filled-field-active-indicator-color: var(--_text-field-active-indicator-color);--md-filled-field-active-indicator-height: var(--_text-field-active-indicator-height);--md-filled-field-container-color: var(--_text-field-container-color);--md-filled-field-container-shape-end-end: var(--_text-field-container-shape-end-end);--md-filled-field-container-shape-end-start: var(--_text-field-container-shape-end-start);--md-filled-field-container-shape-start-end: var(--_text-field-container-shape-start-end);--md-filled-field-container-shape-start-start: var(--_text-field-container-shape-start-start);--md-filled-field-content-color: var(--_text-field-input-text-color);--md-filled-field-content-font: var(--_text-field-input-text-font);--md-filled-field-content-line-height: var(--_text-field-input-text-line-height);--md-filled-field-content-size: var(--_text-field-input-text-size);--md-filled-field-content-weight: var(--_text-field-input-text-weight);--md-filled-field-disabled-active-indicator-color: var(--_text-field-disabled-active-indicator-color);--md-filled-field-disabled-active-indicator-height: var(--_text-field-disabled-active-indicator-height);--md-filled-field-disabled-active-indicator-opacity: var(--_text-field-disabled-active-indicator-opacity);--md-filled-field-disabled-container-color: var(--_text-field-disabled-container-color);--md-filled-field-disabled-container-opacity: var(--_text-field-disabled-container-opacity);--md-filled-field-disabled-content-color: var(--_text-field-disabled-input-text-color);--md-filled-field-disabled-content-opacity: var(--_text-field-disabled-input-text-opacity);--md-filled-field-disabled-label-text-color: var(--_text-field-disabled-label-text-color);--md-filled-field-disabled-label-text-opacity: var(--_text-field-disabled-label-text-opacity);--md-filled-field-disabled-leading-content-color: var(--_text-field-disabled-leading-icon-color);--md-filled-field-disabled-leading-content-opacity: var(--_text-field-disabled-leading-icon-opacity);--md-filled-field-disabled-supporting-text-color: var(--_text-field-disabled-supporting-text-color);--md-filled-field-disabled-supporting-text-opacity: var(--_text-field-disabled-supporting-text-opacity);--md-filled-field-disabled-trailing-content-color: var(--_text-field-disabled-trailing-icon-color);--md-filled-field-disabled-trailing-content-opacity: var(--_text-field-disabled-trailing-icon-opacity);--md-filled-field-error-active-indicator-color: var(--_text-field-error-active-indicator-color);--md-filled-field-error-content-color: var(--_text-field-error-input-text-color);--md-filled-field-error-focus-active-indicator-color: var(--_text-field-error-focus-active-indicator-color);--md-filled-field-error-focus-content-color: var(--_text-field-error-focus-input-text-color);--md-filled-field-error-focus-label-text-color: var(--_text-field-error-focus-label-text-color);--md-filled-field-error-focus-leading-content-color: var(--_text-field-error-focus-leading-icon-color);--md-filled-field-error-focus-supporting-text-color: var(--_text-field-error-focus-supporting-text-color);--md-filled-field-error-focus-trailing-content-color: var(--_text-field-error-focus-trailing-icon-color);--md-filled-field-error-hover-active-indicator-color: var(--_text-field-error-hover-active-indicator-color);--md-filled-field-error-hover-content-color: var(--_text-field-error-hover-input-text-color);--md-filled-field-error-hover-label-text-color: var(--_text-field-error-hover-label-text-color);--md-filled-field-error-hover-leading-content-color: var(--_text-field-error-hover-leading-icon-color);--md-filled-field-error-hover-state-layer-color: var(--_text-field-error-hover-state-layer-color);--md-filled-field-error-hover-state-layer-opacity: var(--_text-field-error-hover-state-layer-opacity);--md-filled-field-error-hover-supporting-text-color: var(--_text-field-error-hover-supporting-text-color);--md-filled-field-error-hover-trailing-content-color: var(--_text-field-error-hover-trailing-icon-color);--md-filled-field-error-label-text-color: var(--_text-field-error-label-text-color);--md-filled-field-error-leading-content-color: var(--_text-field-error-leading-icon-color);--md-filled-field-error-supporting-text-color: var(--_text-field-error-supporting-text-color);--md-filled-field-error-trailing-content-color: var(--_text-field-error-trailing-icon-color);--md-filled-field-focus-active-indicator-color: var(--_text-field-focus-active-indicator-color);--md-filled-field-focus-active-indicator-height: var(--_text-field-focus-active-indicator-height);--md-filled-field-focus-content-color: var(--_text-field-focus-input-text-color);--md-filled-field-focus-label-text-color: var(--_text-field-focus-label-text-color);--md-filled-field-focus-leading-content-color: var(--_text-field-focus-leading-icon-color);--md-filled-field-focus-supporting-text-color: var(--_text-field-focus-supporting-text-color);--md-filled-field-focus-trailing-content-color: var(--_text-field-focus-trailing-icon-color);--md-filled-field-hover-active-indicator-color: var(--_text-field-hover-active-indicator-color);--md-filled-field-hover-active-indicator-height: var(--_text-field-hover-active-indicator-height);--md-filled-field-hover-content-color: var(--_text-field-hover-input-text-color);--md-filled-field-hover-label-text-color: var(--_text-field-hover-label-text-color);--md-filled-field-hover-leading-content-color: var(--_text-field-hover-leading-icon-color);--md-filled-field-hover-state-layer-color: var(--_text-field-hover-state-layer-color);--md-filled-field-hover-state-layer-opacity: var(--_text-field-hover-state-layer-opacity);--md-filled-field-hover-supporting-text-color: var(--_text-field-hover-supporting-text-color);--md-filled-field-hover-trailing-content-color: var(--_text-field-hover-trailing-icon-color);--md-filled-field-label-text-color: var(--_text-field-label-text-color);--md-filled-field-label-text-font: var(--_text-field-label-text-font);--md-filled-field-label-text-line-height: var(--_text-field-label-text-line-height);--md-filled-field-label-text-populated-line-height: var(--_text-field-label-text-populated-line-height);--md-filled-field-label-text-populated-size: var(--_text-field-label-text-populated-size);--md-filled-field-label-text-size: var(--_text-field-label-text-size);--md-filled-field-label-text-weight: var(--_text-field-label-text-weight);--md-filled-field-leading-content-color: var(--_text-field-leading-icon-color);--md-filled-field-supporting-text-color: var(--_text-field-supporting-text-color);--md-filled-field-supporting-text-font: var(--_text-field-supporting-text-font);--md-filled-field-supporting-text-line-height: var(--_text-field-supporting-text-line-height);--md-filled-field-supporting-text-size: var(--_text-field-supporting-text-size);--md-filled-field-supporting-text-weight: var(--_text-field-supporting-text-weight);--md-filled-field-trailing-content-color: var(--_text-field-trailing-icon-color)}[has-start] .icon.leading{font-size:var(--_text-field-leading-icon-size);height:var(--_text-field-leading-icon-size);width:var(--_text-field-leading-icon-size)}.icon.trailing{font-size:var(--_text-field-trailing-icon-size);height:var(--_text-field-trailing-icon-size);width:var(--_text-field-trailing-icon-size)}
`;
  var filled_select_styles_cssresult_default = styles45.styleSheet;

  // ../select/internal/shared-styles.cssresult.js
  var styles46 = i3`:host{color:unset;min-width:210px;display:flex}.field{cursor:default;outline:none}.select{position:relative;flex-direction:column}.icon.trailing svg,.icon ::slotted(*){fill:currentColor}.icon ::slotted(*){width:inherit;height:inherit;font-size:inherit}.icon slot{display:flex;height:100%;width:100%;align-items:center;justify-content:center}.icon.trailing :is(.up,.down){opacity:0;transition:opacity 75ms linear 75ms}.select:not(.open) .down,.select.open .up{opacity:1}.field,.select,md-menu{min-width:inherit;width:inherit;max-width:inherit;display:flex}md-menu{min-width:var(--__menu-min-width);max-width:var(--__menu-max-width, inherit)}.menu-wrapper{width:0px;height:0px;max-width:inherit}md-menu ::slotted(:not[disabled]){cursor:pointer}.field,.select{width:100%}:host{display:inline-flex}:host([disabled]){pointer-events:none}
`;
  var shared_styles_cssresult_default6 = styles46.styleSheet;

  // ../select/filled-select.js
  var MdFilledSelect = class MdFilledSelect2 extends FilledSelect {
  };
  MdFilledSelect.styles = [styles46, styles45];
  MdFilledSelect = __decorate([
    e("md-filled-select")
  ], MdFilledSelect);

  // ../select/internal/outlined-select.js
  var OutlinedSelect = class extends Select {
    constructor() {
      super(...arguments);
      this.fieldTag = i6`md-outlined-field`;
    }
  };

  // ../select/internal/outlined-select-styles.cssresult.js
  var styles47 = i3`:host{--_text-field-disabled-input-text-color: var(--md-outlined-select-text-field-disabled-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-input-text-opacity: var(--md-outlined-select-text-field-disabled-input-text-opacity, 0.38);--_text-field-disabled-label-text-color: var(--md-outlined-select-text-field-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-label-text-opacity: var(--md-outlined-select-text-field-disabled-label-text-opacity, 0.38);--_text-field-disabled-leading-icon-color: var(--md-outlined-select-text-field-disabled-leading-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-leading-icon-opacity: var(--md-outlined-select-text-field-disabled-leading-icon-opacity, 0.38);--_text-field-disabled-outline-color: var(--md-outlined-select-text-field-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-outline-opacity: var(--md-outlined-select-text-field-disabled-outline-opacity, 0.12);--_text-field-disabled-outline-width: var(--md-outlined-select-text-field-disabled-outline-width, 1px);--_text-field-disabled-supporting-text-color: var(--md-outlined-select-text-field-disabled-supporting-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-supporting-text-opacity: var(--md-outlined-select-text-field-disabled-supporting-text-opacity, 0.38);--_text-field-disabled-trailing-icon-color: var(--md-outlined-select-text-field-disabled-trailing-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-trailing-icon-opacity: var(--md-outlined-select-text-field-disabled-trailing-icon-opacity, 0.38);--_text-field-error-focus-input-text-color: var(--md-outlined-select-text-field-error-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-error-focus-label-text-color: var(--md-outlined-select-text-field-error-focus-label-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-focus-leading-icon-color: var(--md-outlined-select-text-field-error-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-error-focus-outline-color: var(--md-outlined-select-text-field-error-focus-outline-color, var(--md-sys-color-error, #b3261e));--_text-field-error-focus-supporting-text-color: var(--md-outlined-select-text-field-error-focus-supporting-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-focus-trailing-icon-color: var(--md-outlined-select-text-field-error-focus-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_text-field-error-hover-input-text-color: var(--md-outlined-select-text-field-error-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-error-hover-label-text-color: var(--md-outlined-select-text-field-error-hover-label-text-color, var(--md-sys-color-on-error-container, #410e0b));--_text-field-error-hover-leading-icon-color: var(--md-outlined-select-text-field-error-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-error-hover-outline-color: var(--md-outlined-select-text-field-error-hover-outline-color, var(--md-sys-color-on-error-container, #410e0b));--_text-field-error-hover-supporting-text-color: var(--md-outlined-select-text-field-error-hover-supporting-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-hover-trailing-icon-color: var(--md-outlined-select-text-field-error-hover-trailing-icon-color, var(--md-sys-color-on-error-container, #410e0b));--_text-field-error-input-text-color: var(--md-outlined-select-text-field-error-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-error-label-text-color: var(--md-outlined-select-text-field-error-label-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-leading-icon-color: var(--md-outlined-select-text-field-error-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-error-outline-color: var(--md-outlined-select-text-field-error-outline-color, var(--md-sys-color-error, #b3261e));--_text-field-error-supporting-text-color: var(--md-outlined-select-text-field-error-supporting-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-trailing-icon-color: var(--md-outlined-select-text-field-error-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_text-field-focus-input-text-color: var(--md-outlined-select-text-field-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-focus-label-text-color: var(--md-outlined-select-text-field-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_text-field-focus-leading-icon-color: var(--md-outlined-select-text-field-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-focus-outline-color: var(--md-outlined-select-text-field-focus-outline-color, var(--md-sys-color-primary, #6750a4));--_text-field-focus-outline-width: var(--md-outlined-select-text-field-focus-outline-width, 3px);--_text-field-focus-supporting-text-color: var(--md-outlined-select-text-field-focus-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-focus-trailing-icon-color: var(--md-outlined-select-text-field-focus-trailing-icon-color, var(--md-sys-color-primary, #6750a4));--_text-field-hover-input-text-color: var(--md-outlined-select-text-field-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-hover-label-text-color: var(--md-outlined-select-text-field-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-hover-leading-icon-color: var(--md-outlined-select-text-field-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-hover-outline-color: var(--md-outlined-select-text-field-hover-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-hover-outline-width: var(--md-outlined-select-text-field-hover-outline-width, 1px);--_text-field-hover-supporting-text-color: var(--md-outlined-select-text-field-hover-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-hover-trailing-icon-color: var(--md-outlined-select-text-field-hover-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-input-text-color: var(--md-outlined-select-text-field-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-input-text-font: var(--md-outlined-select-text-field-input-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_text-field-input-text-line-height: var(--md-outlined-select-text-field-input-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_text-field-input-text-size: var(--md-outlined-select-text-field-input-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_text-field-input-text-weight: var(--md-outlined-select-text-field-input-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_text-field-label-text-color: var(--md-outlined-select-text-field-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-label-text-font: var(--md-outlined-select-text-field-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_text-field-label-text-line-height: var(--md-outlined-select-text-field-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_text-field-label-text-populated-line-height: var(--md-outlined-select-text-field-label-text-populated-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_text-field-label-text-populated-size: var(--md-outlined-select-text-field-label-text-populated-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_text-field-label-text-size: var(--md-outlined-select-text-field-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_text-field-label-text-weight: var(--md-outlined-select-text-field-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_text-field-leading-icon-color: var(--md-outlined-select-text-field-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-leading-icon-size: var(--md-outlined-select-text-field-leading-icon-size, 24px);--_text-field-outline-color: var(--md-outlined-select-text-field-outline-color, var(--md-sys-color-outline, #79747e));--_text-field-outline-width: var(--md-outlined-select-text-field-outline-width, 1px);--_text-field-supporting-text-color: var(--md-outlined-select-text-field-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-supporting-text-font: var(--md-outlined-select-text-field-supporting-text-font, var(--md-sys-typescale-body-small-font, var(--md-ref-typeface-plain, Roboto)));--_text-field-supporting-text-line-height: var(--md-outlined-select-text-field-supporting-text-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_text-field-supporting-text-size: var(--md-outlined-select-text-field-supporting-text-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_text-field-supporting-text-weight: var(--md-outlined-select-text-field-supporting-text-weight, var(--md-sys-typescale-body-small-weight, var(--md-ref-typeface-weight-regular, 400)));--_text-field-trailing-icon-color: var(--md-outlined-select-text-field-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-trailing-icon-size: var(--md-outlined-select-text-field-trailing-icon-size, 24px);--_text-field-container-shape-start-start: var(--md-outlined-select-text-field-container-shape-start-start, var(--md-outlined-select-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_text-field-container-shape-start-end: var(--md-outlined-select-text-field-container-shape-start-end, var(--md-outlined-select-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_text-field-container-shape-end-end: var(--md-outlined-select-text-field-container-shape-end-end, var(--md-outlined-select-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_text-field-container-shape-end-start: var(--md-outlined-select-text-field-container-shape-end-start, var(--md-outlined-select-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--md-outlined-field-container-shape-end-end: var(--_text-field-container-shape-end-end);--md-outlined-field-container-shape-end-start: var(--_text-field-container-shape-end-start);--md-outlined-field-container-shape-start-end: var(--_text-field-container-shape-start-end);--md-outlined-field-container-shape-start-start: var(--_text-field-container-shape-start-start);--md-outlined-field-content-color: var(--_text-field-input-text-color);--md-outlined-field-content-font: var(--_text-field-input-text-font);--md-outlined-field-content-line-height: var(--_text-field-input-text-line-height);--md-outlined-field-content-size: var(--_text-field-input-text-size);--md-outlined-field-content-weight: var(--_text-field-input-text-weight);--md-outlined-field-disabled-content-color: var(--_text-field-disabled-input-text-color);--md-outlined-field-disabled-content-opacity: var(--_text-field-disabled-input-text-opacity);--md-outlined-field-disabled-label-text-color: var(--_text-field-disabled-label-text-color);--md-outlined-field-disabled-label-text-opacity: var(--_text-field-disabled-label-text-opacity);--md-outlined-field-disabled-leading-content-color: var(--_text-field-disabled-leading-icon-color);--md-outlined-field-disabled-leading-content-opacity: var(--_text-field-disabled-leading-icon-opacity);--md-outlined-field-disabled-outline-color: var(--_text-field-disabled-outline-color);--md-outlined-field-disabled-outline-opacity: var(--_text-field-disabled-outline-opacity);--md-outlined-field-disabled-outline-width: var(--_text-field-disabled-outline-width);--md-outlined-field-disabled-supporting-text-color: var(--_text-field-disabled-supporting-text-color);--md-outlined-field-disabled-supporting-text-opacity: var(--_text-field-disabled-supporting-text-opacity);--md-outlined-field-disabled-trailing-content-color: var(--_text-field-disabled-trailing-icon-color);--md-outlined-field-disabled-trailing-content-opacity: var(--_text-field-disabled-trailing-icon-opacity);--md-outlined-field-error-content-color: var(--_text-field-error-input-text-color);--md-outlined-field-error-focus-content-color: var(--_text-field-error-focus-input-text-color);--md-outlined-field-error-focus-label-text-color: var(--_text-field-error-focus-label-text-color);--md-outlined-field-error-focus-leading-content-color: var(--_text-field-error-focus-leading-icon-color);--md-outlined-field-error-focus-outline-color: var(--_text-field-error-focus-outline-color);--md-outlined-field-error-focus-supporting-text-color: var(--_text-field-error-focus-supporting-text-color);--md-outlined-field-error-focus-trailing-content-color: var(--_text-field-error-focus-trailing-icon-color);--md-outlined-field-error-hover-content-color: var(--_text-field-error-hover-input-text-color);--md-outlined-field-error-hover-label-text-color: var(--_text-field-error-hover-label-text-color);--md-outlined-field-error-hover-leading-content-color: var(--_text-field-error-hover-leading-icon-color);--md-outlined-field-error-hover-outline-color: var(--_text-field-error-hover-outline-color);--md-outlined-field-error-hover-supporting-text-color: var(--_text-field-error-hover-supporting-text-color);--md-outlined-field-error-hover-trailing-content-color: var(--_text-field-error-hover-trailing-icon-color);--md-outlined-field-error-label-text-color: var(--_text-field-error-label-text-color);--md-outlined-field-error-leading-content-color: var(--_text-field-error-leading-icon-color);--md-outlined-field-error-outline-color: var(--_text-field-error-outline-color);--md-outlined-field-error-supporting-text-color: var(--_text-field-error-supporting-text-color);--md-outlined-field-error-trailing-content-color: var(--_text-field-error-trailing-icon-color);--md-outlined-field-focus-content-color: var(--_text-field-focus-input-text-color);--md-outlined-field-focus-label-text-color: var(--_text-field-focus-label-text-color);--md-outlined-field-focus-leading-content-color: var(--_text-field-focus-leading-icon-color);--md-outlined-field-focus-outline-color: var(--_text-field-focus-outline-color);--md-outlined-field-focus-outline-width: var(--_text-field-focus-outline-width);--md-outlined-field-focus-supporting-text-color: var(--_text-field-focus-supporting-text-color);--md-outlined-field-focus-trailing-content-color: var(--_text-field-focus-trailing-icon-color);--md-outlined-field-hover-content-color: var(--_text-field-hover-input-text-color);--md-outlined-field-hover-label-text-color: var(--_text-field-hover-label-text-color);--md-outlined-field-hover-leading-content-color: var(--_text-field-hover-leading-icon-color);--md-outlined-field-hover-outline-color: var(--_text-field-hover-outline-color);--md-outlined-field-hover-outline-width: var(--_text-field-hover-outline-width);--md-outlined-field-hover-supporting-text-color: var(--_text-field-hover-supporting-text-color);--md-outlined-field-hover-trailing-content-color: var(--_text-field-hover-trailing-icon-color);--md-outlined-field-label-text-color: var(--_text-field-label-text-color);--md-outlined-field-label-text-font: var(--_text-field-label-text-font);--md-outlined-field-label-text-line-height: var(--_text-field-label-text-line-height);--md-outlined-field-label-text-populated-line-height: var(--_text-field-label-text-populated-line-height);--md-outlined-field-label-text-populated-size: var(--_text-field-label-text-populated-size);--md-outlined-field-label-text-size: var(--_text-field-label-text-size);--md-outlined-field-label-text-weight: var(--_text-field-label-text-weight);--md-outlined-field-leading-content-color: var(--_text-field-leading-icon-color);--md-outlined-field-outline-color: var(--_text-field-outline-color);--md-outlined-field-outline-width: var(--_text-field-outline-width);--md-outlined-field-supporting-text-color: var(--_text-field-supporting-text-color);--md-outlined-field-supporting-text-font: var(--_text-field-supporting-text-font);--md-outlined-field-supporting-text-line-height: var(--_text-field-supporting-text-line-height);--md-outlined-field-supporting-text-size: var(--_text-field-supporting-text-size);--md-outlined-field-supporting-text-weight: var(--_text-field-supporting-text-weight);--md-outlined-field-trailing-content-color: var(--_text-field-trailing-icon-color)}[has-start] .icon.leading{font-size:var(--_text-field-leading-icon-size);height:var(--_text-field-leading-icon-size);width:var(--_text-field-leading-icon-size)}.icon.trailing{font-size:var(--_text-field-trailing-icon-size);height:var(--_text-field-trailing-icon-size);width:var(--_text-field-trailing-icon-size)}
`;
  var outlined_select_styles_cssresult_default = styles47.styleSheet;

  // ../select/outlined-select.js
  var MdOutlinedSelect = class MdOutlinedSelect2 extends OutlinedSelect {
  };
  MdOutlinedSelect.styles = [styles46, styles47];
  MdOutlinedSelect = __decorate([
    e("md-outlined-select")
  ], MdOutlinedSelect);

  // ../select/internal/selectoption/selectOptionController.js
  function createRequestSelectionEvent() {
    return new Event("request-selection", {
      bubbles: true,
      composed: true
    });
  }
  function createRequestDeselectionEvent() {
    return new Event("request-deselection", {
      bubbles: true,
      composed: true
    });
  }
  var SelectOptionController = class {
    /**
     * The recommended role of the select option.
     */
    get role() {
      return this.menuItemController.role;
    }
    /**
     * The text that is selectable via typeahead. If not set, defaults to the
     * innerText of the item slotted into the `"headline"` slot, and if there are
     * no slotted elements into headline, then it checks the _default_ slot, and
     * then the `"supporting-text"` slot if nothing is in _default_.
     */
    get typeaheadText() {
      return this.menuItemController.typeaheadText;
    }
    setTypeaheadText(text) {
      this.menuItemController.setTypeaheadText(text);
    }
    /**
     * The text that is displayed in the select field when selected. If not set,
     * defaults to the textContent of the item slotted into the `"headline"` slot,
     * and if there are no slotted elements into headline, then it checks the
     * _default_ slot, and then the `"supporting-text"` slot if nothing is in
     * _default_.
     */
    get displayText() {
      if (this.internalDisplayText !== null) {
        return this.internalDisplayText;
      }
      return this.menuItemController.typeaheadText;
    }
    setDisplayText(text) {
      this.internalDisplayText = text;
    }
    /**
     * @param host The SelectOption in which to attach this controller to.
     * @param config The object that configures this controller's behavior.
     */
    constructor(host, config) {
      this.host = host;
      this.internalDisplayText = null;
      this.firstUpdate = true;
      this.onClick = () => {
        this.menuItemController.onClick();
      };
      this.onKeydown = (e13) => {
        this.menuItemController.onKeydown(e13);
      };
      this.lastSelected = this.host.selected;
      this.menuItemController = new MenuItemController(host, config);
      host.addController(this);
    }
    hostUpdate() {
      if (this.lastSelected !== this.host.selected) {
        this.host.ariaSelected = this.host.selected ? "true" : "false";
      }
    }
    hostUpdated() {
      if (this.lastSelected !== this.host.selected && !this.firstUpdate) {
        if (this.host.selected) {
          this.host.dispatchEvent(createRequestSelectionEvent());
        } else {
          this.host.dispatchEvent(createRequestDeselectionEvent());
        }
      }
      this.lastSelected = this.host.selected;
      this.firstUpdate = false;
    }
  };

  // ../select/internal/selectoption/select-option.js
  var selectOptionBaseClass = mixinDelegatesAria(s3);
  var SelectOptionEl = class extends selectOptionBaseClass {
    constructor() {
      super(...arguments);
      this.disabled = false;
      this.isMenuItem = true;
      this.selected = false;
      this.value = "";
      this.type = "option";
      this.selectOptionController = new SelectOptionController(this, {
        getHeadlineElements: () => {
          return this.headlineElements;
        },
        getSupportingTextElements: () => {
          return this.supportingTextElements;
        },
        getDefaultElements: () => {
          return this.defaultElements;
        },
        getInteractiveElement: () => this.listItemRoot
      });
    }
    /**
     * The text that is selectable via typeahead. If not set, defaults to the
     * innerText of the item slotted into the `"headline"` slot.
     */
    get typeaheadText() {
      return this.selectOptionController.typeaheadText;
    }
    set typeaheadText(text) {
      this.selectOptionController.setTypeaheadText(text);
    }
    /**
     * The text that is displayed in the select field when selected. If not set,
     * defaults to the textContent of the item slotted into the `"headline"` slot.
     */
    get displayText() {
      return this.selectOptionController.displayText;
    }
    set displayText(text) {
      this.selectOptionController.setDisplayText(text);
    }
    render() {
      return this.renderListItem(T`
      <md-item>
        <div slot="container">
          ${this.renderRipple()} ${this.renderFocusRing()}
        </div>
        <slot name="start" slot="start"></slot>
        <slot name="end" slot="end"></slot>
        ${this.renderBody()}
      </md-item>
    `);
    }
    /**
     * Renders the root list item.
     *
     * @param content the child content of the list item.
     */
    renderListItem(content) {
      return T`
      <li
        id="item"
        tabindex=${this.disabled ? -1 : 0}
        role=${this.selectOptionController.role}
        aria-label=${this.ariaLabel || A}
        aria-selected=${this.ariaSelected || A}
        aria-checked=${this.ariaChecked || A}
        aria-expanded=${this.ariaExpanded || A}
        aria-haspopup=${this.ariaHasPopup || A}
        class="list-item ${o8(this.getRenderClasses())}"
        @click=${this.selectOptionController.onClick}
        @keydown=${this.selectOptionController.onKeydown}
        >${content}</li
      >
    `;
    }
    /**
     * Handles rendering of the ripple element.
     */
    renderRipple() {
      return T` <md-ripple
      part="ripple"
      for="item"
      ?disabled=${this.disabled}></md-ripple>`;
    }
    /**
     * Handles rendering of the focus ring.
     */
    renderFocusRing() {
      return T` <md-focus-ring
      part="focus-ring"
      for="item"
      inward></md-focus-ring>`;
    }
    /**
     * Classes applied to the list item root.
     */
    getRenderClasses() {
      return {
        "disabled": this.disabled,
        "selected": this.selected
      };
    }
    /**
     * Handles rendering the headline and supporting text.
     */
    renderBody() {
      return T`
      <slot></slot>
      <slot name="overline" slot="overline"></slot>
      <slot name="headline" slot="headline"></slot>
      <slot name="supporting-text" slot="supporting-text"></slot>
      <slot
        name="trailing-supporting-text"
        slot="trailing-supporting-text"></slot>
    `;
    }
    focus() {
      this.listItemRoot?.focus();
    }
  };
  SelectOptionEl.shadowRootOptions = {
    ...s3.shadowRootOptions,
    delegatesFocus: true
  };
  __decorate([
    n({ type: Boolean, reflect: true })
  ], SelectOptionEl.prototype, "disabled", void 0);
  __decorate([
    n({ type: Boolean, attribute: "md-menu-item", reflect: true })
  ], SelectOptionEl.prototype, "isMenuItem", void 0);
  __decorate([
    n({ type: Boolean })
  ], SelectOptionEl.prototype, "selected", void 0);
  __decorate([
    n()
  ], SelectOptionEl.prototype, "value", void 0);
  __decorate([
    i2(".list-item")
  ], SelectOptionEl.prototype, "listItemRoot", void 0);
  __decorate([
    e5({ slot: "headline" })
  ], SelectOptionEl.prototype, "headlineElements", void 0);
  __decorate([
    e5({ slot: "supporting-text" })
  ], SelectOptionEl.prototype, "supportingTextElements", void 0);
  __decorate([
    o2({ slot: "" })
  ], SelectOptionEl.prototype, "defaultElements", void 0);
  __decorate([
    n({ attribute: "typeahead-text" })
  ], SelectOptionEl.prototype, "typeaheadText", null);
  __decorate([
    n({ attribute: "display-text" })
  ], SelectOptionEl.prototype, "displayText", null);

  // ../select/select-option.js
  var MdSelectOption = class MdSelectOption2 extends SelectOptionEl {
  };
  MdSelectOption.styles = [styles40];
  MdSelectOption = __decorate([
    e("md-select-option")
  ], MdSelectOption);

  // ../slider/internal/forced-colors-styles.cssresult.js
  var styles48 = i3`@media(forced-colors: active){:host{--md-slider-active-track-color: CanvasText;--md-slider-disabled-active-track-color: GrayText;--md-slider-disabled-active-track-opacity: 1;--md-slider-disabled-handle-color: GrayText;--md-slider-disabled-inactive-track-color: GrayText;--md-slider-disabled-inactive-track-opacity: 1;--md-slider-focus-handle-color: CanvasText;--md-slider-handle-color: CanvasText;--md-slider-handle-shadow-color: Canvas;--md-slider-hover-handle-color: CanvasText;--md-slider-hover-state-layer-color: Canvas;--md-slider-hover-state-layer-opacity: 1;--md-slider-inactive-track-color: Canvas;--md-slider-label-container-color: Canvas;--md-slider-label-text-color: CanvasText;--md-slider-pressed-handle-color: CanvasText;--md-slider-pressed-state-layer-color: Canvas;--md-slider-pressed-state-layer-opacity: 1;--md-slider-with-overlap-handle-outline-color: CanvasText}.label,.label::before{border:var(--_with-overlap-handle-outline-color) solid var(--_with-overlap-handle-outline-width)}:host(:not([disabled])) .track::before{border:1px solid var(--_active-track-color)}.tickmarks::before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='CanvasText'%3E%3Ccircle cx='2' cy='2'  r='1'/%3E%3C/svg%3E")}.tickmarks::after{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='Canvas'%3E%3Ccircle cx='2' cy='2' r='1'/%3E%3C/svg%3E")}:host([disabled]) .tickmarks::before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='Canvas'%3E%3Ccircle cx='2' cy='2'  r='1'/%3E%3C/svg%3E")}}
`;
  var forced_colors_styles_cssresult_default2 = styles48.styleSheet;

  // ../node_modules/lit-html/node/directives/when.js
  function n9(n13, o11, r8) {
    return n13 ? o11() : null == r8 ? void 0 : r8();
  }

  // ../slider/internal/slider.js
  var sliderBaseClass = mixinDelegatesAria(mixinFormAssociated(mixinElementInternals(s3)));
  var Slider = class extends sliderBaseClass {
    /**
     * The HTML name to use in form submission for a range slider's starting
     * value. Use `name` instead if both the start and end values should use the
     * same name.
     */
    get nameStart() {
      return this.getAttribute("name-start") ?? this.name;
    }
    set nameStart(name) {
      this.setAttribute("name-start", name);
    }
    /**
     * The HTML name to use in form submission for a range slider's ending value.
     * Use `name` instead if both the start and end values should use the same
     * name.
     */
    get nameEnd() {
      return this.getAttribute("name-end") ?? this.nameStart;
    }
    set nameEnd(name) {
      this.setAttribute("name-end", name);
    }
    // Note: start aria-* properties are only applied when range=true, which is
    // why they do not need to handle both cases.
    get renderAriaLabelStart() {
      const { ariaLabel } = this;
      return this.ariaLabelStart || ariaLabel && `${ariaLabel} start` || this.valueLabelStart || String(this.valueStart);
    }
    get renderAriaValueTextStart() {
      return this.ariaValueTextStart || this.valueLabelStart || String(this.valueStart);
    }
    // Note: end aria-* properties are applied for single and range sliders, which
    // is why it needs to handle `this.range` (while start aria-* properties do
    // not).
    get renderAriaLabelEnd() {
      const { ariaLabel } = this;
      if (this.range) {
        return this.ariaLabelEnd || ariaLabel && `${ariaLabel} end` || this.valueLabelEnd || String(this.valueEnd);
      }
      return ariaLabel || this.valueLabel || String(this.value);
    }
    get renderAriaValueTextEnd() {
      if (this.range) {
        return this.ariaValueTextEnd || this.valueLabelEnd || String(this.valueEnd);
      }
      const { ariaValueText } = this;
      return ariaValueText || this.valueLabel || String(this.value);
    }
    constructor() {
      super();
      this.min = 0;
      this.max = 100;
      this.valueLabel = "";
      this.valueLabelStart = "";
      this.valueLabelEnd = "";
      this.ariaLabelStart = "";
      this.ariaValueTextStart = "";
      this.ariaLabelEnd = "";
      this.ariaValueTextEnd = "";
      this.step = 1;
      this.ticks = false;
      this.labeled = false;
      this.range = false;
      this.handleStartHover = false;
      this.handleEndHover = false;
      this.startOnTop = false;
      this.handlesOverlapping = false;
      this.ripplePointerId = 1;
      this.isRedispatchingEvent = false;
      if (!o7) {
        this.addEventListener("click", (event) => {
          if (!isActivationClick(event) || !this.inputEnd) {
            return;
          }
          this.focus();
          dispatchActivationClick(this.inputEnd);
        });
      }
    }
    focus() {
      this.inputEnd?.focus();
    }
    willUpdate(changed) {
      this.renderValueStart = changed.has("valueStart") ? this.valueStart : this.inputStart?.valueAsNumber;
      const endValueChanged = changed.has("valueEnd") && this.range || changed.has("value");
      this.renderValueEnd = endValueChanged ? this.range ? this.valueEnd : this.value : this.inputEnd?.valueAsNumber;
      if (changed.get("handleStartHover") !== void 0) {
        this.toggleRippleHover(this.rippleStart, this.handleStartHover);
      } else if (changed.get("handleEndHover") !== void 0) {
        this.toggleRippleHover(this.rippleEnd, this.handleEndHover);
      }
    }
    updated(changed) {
      if (this.range) {
        this.renderValueStart = this.inputStart.valueAsNumber;
      }
      this.renderValueEnd = this.inputEnd.valueAsNumber;
      if (this.range) {
        const segment = (this.max - this.min) / 3;
        if (this.valueStart === void 0) {
          this.inputStart.valueAsNumber = this.min + segment;
          const v5 = this.inputStart.valueAsNumber;
          this.valueStart = this.renderValueStart = v5;
        }
        if (this.valueEnd === void 0) {
          this.inputEnd.valueAsNumber = this.min + 2 * segment;
          const v5 = this.inputEnd.valueAsNumber;
          this.valueEnd = this.renderValueEnd = v5;
        }
      } else {
        this.value ??= this.renderValueEnd;
      }
      if (changed.has("range") || changed.has("renderValueStart") || changed.has("renderValueEnd") || this.isUpdatePending) {
        const startNub = this.handleStart?.querySelector(".handleNub");
        const endNub = this.handleEnd?.querySelector(".handleNub");
        this.handlesOverlapping = isOverlapping(startNub, endNub);
      }
      this.performUpdate();
    }
    render() {
      const step = this.step === 0 ? 1 : this.step;
      const range = Math.max(this.max - this.min, step);
      const startFraction = this.range ? ((this.renderValueStart ?? this.min) - this.min) / range : 0;
      const endFraction = ((this.renderValueEnd ?? this.min) - this.min) / range;
      const containerStyles = {
        // for clipping inputs and active track.
        "--_start-fraction": String(startFraction),
        "--_end-fraction": String(endFraction),
        // for generating tick marks
        "--_tick-count": String(range / step)
      };
      const containerClasses = { ranged: this.range };
      const labelStart = this.valueLabelStart || String(this.renderValueStart);
      const labelEnd = (this.range ? this.valueLabelEnd : this.valueLabel) || String(this.renderValueEnd);
      const inputStartProps = {
        start: true,
        value: this.renderValueStart,
        ariaLabel: this.renderAriaLabelStart,
        ariaValueText: this.renderAriaValueTextStart,
        ariaMin: this.min,
        ariaMax: this.valueEnd ?? this.max
      };
      const inputEndProps = {
        start: false,
        value: this.renderValueEnd,
        ariaLabel: this.renderAriaLabelEnd,
        ariaValueText: this.renderAriaValueTextEnd,
        ariaMin: this.range ? this.valueStart ?? this.min : this.min,
        ariaMax: this.max
      };
      const handleStartProps = {
        start: true,
        hover: this.handleStartHover,
        label: labelStart
      };
      const handleEndProps = {
        start: false,
        hover: this.handleEndHover,
        label: labelEnd
      };
      const handleContainerClasses = {
        hover: this.handleStartHover || this.handleEndHover
      };
      return T` <div
      class="container ${o8(containerClasses)}"
      style=${o9(containerStyles)}>
      ${n9(this.range, () => this.renderInput(inputStartProps))}
      ${this.renderInput(inputEndProps)} ${this.renderTrack()}
      <div class="handleContainerPadded">
        <div class="handleContainerBlock">
          <div class="handleContainer ${o8(handleContainerClasses)}">
            ${n9(this.range, () => this.renderHandle(handleStartProps))}
            ${this.renderHandle(handleEndProps)}
          </div>
        </div>
      </div>
    </div>`;
    }
    renderTrack() {
      return T`
      <div class="track"></div>
      ${this.ticks ? T`<div class="tickmarks"></div>` : A}
    `;
    }
    renderLabel(value) {
      return T`<div class="label" aria-hidden="true">
      <span class="labelContent" part="label">${value}</span>
    </div>`;
    }
    renderHandle({ start, hover, label }) {
      const onTop = !this.disabled && start === this.startOnTop;
      const isOverlapping2 = !this.disabled && this.handlesOverlapping;
      const name = start ? "start" : "end";
      return T`<div
      class="handle ${o8({
        [name]: true,
        hover,
        onTop,
        isOverlapping: isOverlapping2
      })}">
      <md-focus-ring part="focus-ring" for=${name}></md-focus-ring>
      <md-ripple
        for=${name}
        class=${name}
        ?disabled=${this.disabled}></md-ripple>
      <div class="handleNub">
        <md-elevation part="elevation"></md-elevation>
      </div>
      ${n9(this.labeled, () => this.renderLabel(label))}
    </div>`;
    }
    renderInput({ start, value, ariaLabel, ariaValueText, ariaMin, ariaMax }) {
      const name = start ? `start` : `end`;
      return T`<input
      type="range"
      class="${o8({
        start,
        end: !start
      })}"
      @focus=${this.handleFocus}
      @pointerdown=${this.handleDown}
      @pointerup=${this.handleUp}
      @pointerenter=${this.handleEnter}
      @pointermove=${this.handleMove}
      @pointerleave=${this.handleLeave}
      @keydown=${this.handleKeydown}
      @keyup=${this.handleKeyup}
      @input=${this.handleInput}
      @change=${this.handleChange}
      id=${name}
      .disabled=${this.disabled}
      .min=${String(this.min)}
      aria-valuemin=${ariaMin}
      .max=${String(this.max)}
      aria-valuemax=${ariaMax}
      .step=${String(this.step)}
      .value=${String(value)}
      .tabIndex=${start ? 1 : 0}
      aria-label=${ariaLabel || A}
      aria-valuetext=${ariaValueText} />`;
    }
    async toggleRippleHover(ripple, hovering) {
      const rippleEl = await ripple;
      if (!rippleEl) {
        return;
      }
      if (hovering) {
        rippleEl.handlePointerenter(new PointerEvent("pointerenter", {
          isPrimary: true,
          pointerId: this.ripplePointerId
        }));
      } else {
        rippleEl.handlePointerleave(new PointerEvent("pointerleave", {
          isPrimary: true,
          pointerId: this.ripplePointerId
        }));
      }
    }
    handleFocus(event) {
      this.updateOnTop(event.target);
    }
    startAction(event) {
      const target = event.target;
      const fixed = target === this.inputStart ? this.inputEnd : this.inputStart;
      this.action = {
        canFlip: event.type === "pointerdown",
        flipped: false,
        target,
        fixed,
        values: /* @__PURE__ */ new Map([
          [target, target.valueAsNumber],
          [fixed, fixed?.valueAsNumber]
        ])
      };
    }
    finishAction(event) {
      this.action = void 0;
    }
    handleKeydown(event) {
      this.startAction(event);
    }
    handleKeyup(event) {
      this.finishAction(event);
    }
    handleDown(event) {
      this.startAction(event);
      this.ripplePointerId = event.pointerId;
      const isStart = event.target === this.inputStart;
      this.handleStartHover = !this.disabled && isStart && Boolean(this.handleStart);
      this.handleEndHover = !this.disabled && !isStart && Boolean(this.handleEnd);
    }
    async handleUp(event) {
      if (!this.action) {
        return;
      }
      const { target, values, flipped } = this.action;
      await new Promise(requestAnimationFrame);
      if (target !== void 0) {
        target.focus();
        if (flipped && target.valueAsNumber !== values.get(target)) {
          target.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }
      this.finishAction(event);
    }
    /**
     * The move handler tracks handle hovering to facilitate proper ripple
     * behavior on the slider handle. This is needed because user interaction with
     * the native input is leveraged to position the handle. Because the separate
     * displayed handle element has pointer events disabled (to allow interaction
     * with the input) and the input's handle is a pseudo-element, neither can be
     * the ripple's interactive element. Therefore the input is the ripple's
     * interactive element and has a `ripple` directive; however the ripple
     * is gated on the handle being hovered. In addition, because the ripple
     * hover state is being specially handled, it must be triggered independent
     * of the directive. This is done based on the hover state when the
     * slider is updated.
     */
    handleMove(event) {
      this.handleStartHover = !this.disabled && inBounds(event, this.handleStart);
      this.handleEndHover = !this.disabled && inBounds(event, this.handleEnd);
    }
    handleEnter(event) {
      this.handleMove(event);
    }
    handleLeave() {
      this.handleStartHover = false;
      this.handleEndHover = false;
    }
    updateOnTop(input) {
      this.startOnTop = input.classList.contains("start");
    }
    needsClamping() {
      if (!this.action) {
        return false;
      }
      const { target, fixed } = this.action;
      const isStart = target === this.inputStart;
      return isStart ? target.valueAsNumber > fixed.valueAsNumber : target.valueAsNumber < fixed.valueAsNumber;
    }
    // if start/end start coincident and the first drag input would e.g. move
    // start > end, avoid clamping and "flip" to use the other input
    // as the action target.
    isActionFlipped() {
      const { action } = this;
      if (!action) {
        return false;
      }
      const { target, fixed, values } = action;
      if (action.canFlip) {
        const coincident = values.get(target) === values.get(fixed);
        if (coincident && this.needsClamping()) {
          action.canFlip = false;
          action.flipped = true;
          action.target = fixed;
          action.fixed = target;
        }
      }
      return action.flipped;
    }
    // when flipped, apply the drag input to the flipped target and reset
    // the actual target.
    flipAction() {
      if (!this.action) {
        return false;
      }
      const { target, fixed, values } = this.action;
      const changed = target.valueAsNumber !== fixed.valueAsNumber;
      target.valueAsNumber = fixed.valueAsNumber;
      fixed.valueAsNumber = values.get(fixed);
      return changed;
    }
    // clamp such that start does not move beyond end and visa versa.
    clampAction() {
      if (!this.needsClamping() || !this.action) {
        return false;
      }
      const { target, fixed } = this.action;
      target.valueAsNumber = fixed.valueAsNumber;
      return true;
    }
    handleInput(event) {
      if (this.isRedispatchingEvent) {
        return;
      }
      let stopPropagation = false;
      let redispatch = false;
      if (this.range) {
        if (this.isActionFlipped()) {
          stopPropagation = true;
          redispatch = this.flipAction();
        }
        if (this.clampAction()) {
          stopPropagation = true;
          redispatch = false;
        }
      }
      const target = event.target;
      this.updateOnTop(target);
      if (this.range) {
        this.valueStart = this.inputStart.valueAsNumber;
        this.valueEnd = this.inputEnd.valueAsNumber;
      } else {
        this.value = this.inputEnd.valueAsNumber;
      }
      if (stopPropagation) {
        event.stopPropagation();
      }
      if (redispatch) {
        this.isRedispatchingEvent = true;
        redispatchEvent(target, event);
        this.isRedispatchingEvent = false;
      }
    }
    handleChange(event) {
      const changeTarget = event.target;
      const { target, values } = this.action ?? {};
      const squelch = target && target.valueAsNumber === values.get(changeTarget);
      if (!squelch) {
        redispatchEvent(this, event);
      }
      this.finishAction(event);
    }
    [getFormValue]() {
      if (this.range) {
        const data = new FormData();
        data.append(this.nameStart, String(this.valueStart));
        data.append(this.nameEnd, String(this.valueEnd));
        return data;
      }
      return String(this.value);
    }
    formResetCallback() {
      if (this.range) {
        const valueStart = this.getAttribute("value-start");
        this.valueStart = valueStart !== null ? Number(valueStart) : void 0;
        const valueEnd = this.getAttribute("value-end");
        this.valueEnd = valueEnd !== null ? Number(valueEnd) : void 0;
        return;
      }
      const value = this.getAttribute("value");
      this.value = value !== null ? Number(value) : void 0;
    }
    formStateRestoreCallback(state) {
      if (Array.isArray(state)) {
        const [[, valueStart], [, valueEnd]] = state;
        this.valueStart = Number(valueStart);
        this.valueEnd = Number(valueEnd);
        this.range = true;
        return;
      }
      this.value = Number(state);
      this.range = false;
    }
  };
  Slider.shadowRootOptions = {
    ...s3.shadowRootOptions,
    delegatesFocus: true
  };
  __decorate([
    n({ type: Number })
  ], Slider.prototype, "min", void 0);
  __decorate([
    n({ type: Number })
  ], Slider.prototype, "max", void 0);
  __decorate([
    n({ type: Number })
  ], Slider.prototype, "value", void 0);
  __decorate([
    n({ type: Number, attribute: "value-start" })
  ], Slider.prototype, "valueStart", void 0);
  __decorate([
    n({ type: Number, attribute: "value-end" })
  ], Slider.prototype, "valueEnd", void 0);
  __decorate([
    n({ attribute: "value-label" })
  ], Slider.prototype, "valueLabel", void 0);
  __decorate([
    n({ attribute: "value-label-start" })
  ], Slider.prototype, "valueLabelStart", void 0);
  __decorate([
    n({ attribute: "value-label-end" })
  ], Slider.prototype, "valueLabelEnd", void 0);
  __decorate([
    n({ attribute: "aria-label-start" })
  ], Slider.prototype, "ariaLabelStart", void 0);
  __decorate([
    n({ attribute: "aria-valuetext-start" })
  ], Slider.prototype, "ariaValueTextStart", void 0);
  __decorate([
    n({ attribute: "aria-label-end" })
  ], Slider.prototype, "ariaLabelEnd", void 0);
  __decorate([
    n({ attribute: "aria-valuetext-end" })
  ], Slider.prototype, "ariaValueTextEnd", void 0);
  __decorate([
    n({ type: Number })
  ], Slider.prototype, "step", void 0);
  __decorate([
    n({ type: Boolean })
  ], Slider.prototype, "ticks", void 0);
  __decorate([
    n({ type: Boolean })
  ], Slider.prototype, "labeled", void 0);
  __decorate([
    n({ type: Boolean })
  ], Slider.prototype, "range", void 0);
  __decorate([
    i2("input.start")
  ], Slider.prototype, "inputStart", void 0);
  __decorate([
    i2(".handle.start")
  ], Slider.prototype, "handleStart", void 0);
  __decorate([
    e4("md-ripple.start")
  ], Slider.prototype, "rippleStart", void 0);
  __decorate([
    i2("input.end")
  ], Slider.prototype, "inputEnd", void 0);
  __decorate([
    i2(".handle.end")
  ], Slider.prototype, "handleEnd", void 0);
  __decorate([
    e4("md-ripple.end")
  ], Slider.prototype, "rippleEnd", void 0);
  __decorate([
    t()
  ], Slider.prototype, "handleStartHover", void 0);
  __decorate([
    t()
  ], Slider.prototype, "handleEndHover", void 0);
  __decorate([
    t()
  ], Slider.prototype, "startOnTop", void 0);
  __decorate([
    t()
  ], Slider.prototype, "handlesOverlapping", void 0);
  __decorate([
    t()
  ], Slider.prototype, "renderValueStart", void 0);
  __decorate([
    t()
  ], Slider.prototype, "renderValueEnd", void 0);
  function inBounds({ x: x3, y: y4 }, element) {
    if (!element) {
      return false;
    }
    const { top, left, bottom, right } = element.getBoundingClientRect();
    return x3 >= left && x3 <= right && y4 >= top && y4 <= bottom;
  }
  function isOverlapping(elA, elB) {
    if (!(elA && elB)) {
      return false;
    }
    const a7 = elA.getBoundingClientRect();
    const b4 = elB.getBoundingClientRect();
    return !(a7.top > b4.bottom || a7.right < b4.left || a7.bottom < b4.top || a7.left > b4.right);
  }

  // ../slider/internal/slider-styles.cssresult.js
  var styles49 = i3`:host{--_active-track-color: var(--md-slider-active-track-color, var(--md-sys-color-primary, #6750a4));--_active-track-height: var(--md-slider-active-track-height, 4px);--_active-track-shape: var(--md-slider-active-track-shape, var(--md-sys-shape-corner-full, 9999px));--_disabled-active-track-color: var(--md-slider-disabled-active-track-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-active-track-opacity: var(--md-slider-disabled-active-track-opacity, 0.38);--_disabled-handle-color: var(--md-slider-disabled-handle-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-handle-elevation: var(--md-slider-disabled-handle-elevation, 0);--_disabled-inactive-track-color: var(--md-slider-disabled-inactive-track-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-inactive-track-opacity: var(--md-slider-disabled-inactive-track-opacity, 0.12);--_focus-handle-color: var(--md-slider-focus-handle-color, var(--md-sys-color-primary, #6750a4));--_handle-color: var(--md-slider-handle-color, var(--md-sys-color-primary, #6750a4));--_handle-elevation: var(--md-slider-handle-elevation, 1);--_handle-height: var(--md-slider-handle-height, 20px);--_handle-shadow-color: var(--md-slider-handle-shadow-color, var(--md-sys-color-shadow, #000));--_handle-shape: var(--md-slider-handle-shape, var(--md-sys-shape-corner-full, 9999px));--_handle-width: var(--md-slider-handle-width, 20px);--_hover-handle-color: var(--md-slider-hover-handle-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-color: var(--md-slider-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-opacity: var(--md-slider-hover-state-layer-opacity, 0.08);--_inactive-track-color: var(--md-slider-inactive-track-color, var(--md-sys-color-surface-container-highest, #e6e0e9));--_inactive-track-height: var(--md-slider-inactive-track-height, 4px);--_inactive-track-shape: var(--md-slider-inactive-track-shape, var(--md-sys-shape-corner-full, 9999px));--_label-container-color: var(--md-slider-label-container-color, var(--md-sys-color-primary, #6750a4));--_label-container-height: var(--md-slider-label-container-height, 28px);--_pressed-handle-color: var(--md-slider-pressed-handle-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-color: var(--md-slider-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-opacity: var(--md-slider-pressed-state-layer-opacity, 0.12);--_state-layer-size: var(--md-slider-state-layer-size, 40px);--_with-overlap-handle-outline-color: var(--md-slider-with-overlap-handle-outline-color, var(--md-sys-color-on-primary, #fff));--_with-overlap-handle-outline-width: var(--md-slider-with-overlap-handle-outline-width, 1px);--_with-tick-marks-active-container-color: var(--md-slider-with-tick-marks-active-container-color, var(--md-sys-color-on-primary, #fff));--_with-tick-marks-container-size: var(--md-slider-with-tick-marks-container-size, 2px);--_with-tick-marks-disabled-container-color: var(--md-slider-with-tick-marks-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_with-tick-marks-inactive-container-color: var(--md-slider-with-tick-marks-inactive-container-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-color: var(--md-slider-label-text-color, var(--md-sys-color-on-primary, #fff));--_label-text-font: var(--md-slider-label-text-font, var(--md-sys-typescale-label-medium-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-slider-label-text-line-height, var(--md-sys-typescale-label-medium-line-height, 1rem));--_label-text-size: var(--md-slider-label-text-size, var(--md-sys-typescale-label-medium-size, 0.75rem));--_label-text-weight: var(--md-slider-label-text-weight, var(--md-sys-typescale-label-medium-weight, var(--md-ref-typeface-weight-medium, 500)));--_start-fraction: 0;--_end-fraction: 0;--_tick-count: 0;display:inline-flex;vertical-align:middle;min-inline-size:200px;--md-elevation-level: var(--_handle-elevation);--md-elevation-shadow-color: var(--_handle-shadow-color)}md-focus-ring{height:48px;inset:unset;width:48px}md-elevation{transition-duration:250ms}@media(prefers-reduced-motion){.label{transition-duration:0}}:host([disabled]){opacity:var(--_disabled-active-track-opacity);--md-elevation-level: var(--_disabled-handle-elevation)}.container{flex:1;display:flex;align-items:center;position:relative;block-size:var(--_state-layer-size);pointer-events:none;touch-action:none;user-select:none}.track,.tickmarks{position:absolute;inset:0;display:flex;align-items:center}.track::before,.tickmarks::before,.track::after,.tickmarks::after{position:absolute;content:"";inset-inline-start:calc(var(--_state-layer-size)/2 - var(--_with-tick-marks-container-size));inset-inline-end:calc(var(--_state-layer-size)/2 - var(--_with-tick-marks-container-size));background-size:calc((100% - var(--_with-tick-marks-container-size)*2)/var(--_tick-count)) 100%}.track::before,.tickmarks::before{block-size:var(--_inactive-track-height);border-radius:var(--_inactive-track-shape)}.track::before{background:var(--_inactive-track-color)}.tickmarks::before{background-image:radial-gradient(circle at var(--_with-tick-marks-container-size) center, var(--_with-tick-marks-inactive-container-color) 0, var(--_with-tick-marks-inactive-container-color) calc(var(--_with-tick-marks-container-size) / 2), transparent calc(var(--_with-tick-marks-container-size) / 2))}:host([disabled]) .track::before{opacity:calc(1/var(--_disabled-active-track-opacity)*var(--_disabled-inactive-track-opacity));background:var(--_disabled-inactive-track-color)}.track::after,.tickmarks::after{block-size:var(--_active-track-height);border-radius:var(--_active-track-shape);clip-path:inset(0 calc(var(--_with-tick-marks-container-size) * min((1 - var(--_end-fraction)) * 1000000000, 1) + (100% - var(--_with-tick-marks-container-size) * 2) * (1 - var(--_end-fraction))) 0 calc(var(--_with-tick-marks-container-size) * min(var(--_start-fraction) * 1000000000, 1) + (100% - var(--_with-tick-marks-container-size) * 2) * var(--_start-fraction)))}.track::after{background:var(--_active-track-color)}.tickmarks::after{background-image:radial-gradient(circle at var(--_with-tick-marks-container-size) center, var(--_with-tick-marks-active-container-color) 0, var(--_with-tick-marks-active-container-color) calc(var(--_with-tick-marks-container-size) / 2), transparent calc(var(--_with-tick-marks-container-size) / 2))}.track:dir(rtl)::after{clip-path:inset(0 calc(var(--_with-tick-marks-container-size) * min(var(--_start-fraction) * 1000000000, 1) + (100% - var(--_with-tick-marks-container-size) * 2) * var(--_start-fraction)) 0 calc(var(--_with-tick-marks-container-size) * min((1 - var(--_end-fraction)) * 1000000000, 1) + (100% - var(--_with-tick-marks-container-size) * 2) * (1 - var(--_end-fraction))))}.tickmarks:dir(rtl)::after{clip-path:inset(0 calc(var(--_with-tick-marks-container-size) * min(var(--_start-fraction) * 1000000000, 1) + (100% - var(--_with-tick-marks-container-size) * 2) * var(--_start-fraction)) 0 calc(var(--_with-tick-marks-container-size) * min((1 - var(--_end-fraction)) * 1000000000, 1) + (100% - var(--_with-tick-marks-container-size) * 2) * (1 - var(--_end-fraction))))}:host([disabled]) .track::after{background:var(--_disabled-active-track-color)}:host([disabled]) .tickmarks::before{background-image:radial-gradient(circle at var(--_with-tick-marks-container-size) center, var(--_with-tick-marks-disabled-container-color) 0, var(--_with-tick-marks-disabled-container-color) calc(var(--_with-tick-marks-container-size) / 2), transparent calc(var(--_with-tick-marks-container-size) / 2))}.handleContainerPadded{position:relative;block-size:100%;inline-size:100%;padding-inline:calc(var(--_state-layer-size)/2)}.handleContainerBlock{position:relative;block-size:100%;inline-size:100%}.handleContainer{position:absolute;inset-block-start:0;inset-block-end:0;inset-inline-start:calc(100%*var(--_start-fraction));inline-size:calc(100%*(var(--_end-fraction) - var(--_start-fraction)))}.handle{position:absolute;block-size:var(--_state-layer-size);inline-size:var(--_state-layer-size);border-radius:var(--_handle-shape);display:flex;place-content:center;place-items:center}.handleNub{position:absolute;height:var(--_handle-height);width:var(--_handle-width);border-radius:var(--_handle-shape);background:var(--_handle-color)}:host([disabled]) .handleNub{background:var(--_disabled-handle-color)}input.end:focus~.handleContainerPadded .handle.end>.handleNub,input.start:focus~.handleContainerPadded .handle.start>.handleNub{background:var(--_focus-handle-color)}.container>.handleContainerPadded .handle.hover>.handleNub{background:var(--_hover-handle-color)}:host(:not([disabled])) input.end:active~.handleContainerPadded .handle.end>.handleNub,:host(:not([disabled])) input.start:active~.handleContainerPadded .handle.start>.handleNub{background:var(--_pressed-handle-color)}.onTop.isOverlapping .label,.onTop.isOverlapping .label::before{outline:var(--_with-overlap-handle-outline-color) solid var(--_with-overlap-handle-outline-width)}.onTop.isOverlapping .handleNub{border:var(--_with-overlap-handle-outline-color) solid var(--_with-overlap-handle-outline-width)}.handle.start{inset-inline-start:calc(0px - var(--_state-layer-size)/2)}.handle.end{inset-inline-end:calc(0px - var(--_state-layer-size)/2)}.label{position:absolute;box-sizing:border-box;display:flex;padding:4px;place-content:center;place-items:center;border-radius:var(--md-sys-shape-corner-full, 9999px);color:var(--_label-text-color);font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight);inset-block-end:100%;min-inline-size:var(--_label-container-height);min-block-size:var(--_label-container-height);background:var(--_label-container-color);transition:transform 100ms cubic-bezier(0.2, 0, 0, 1);transform-origin:center bottom;transform:scale(0)}:host(:focus-within) .label,.handleContainer.hover .label,:where(:has(input:active)) .label{transform:scale(1)}.label::before,.label::after{position:absolute;display:block;content:"";background:inherit}.label::before{inline-size:calc(var(--_label-container-height)/2);block-size:calc(var(--_label-container-height)/2);bottom:calc(var(--_label-container-height)/-10);transform:rotate(45deg)}.label::after{inset:0px;border-radius:inherit}.labelContent{z-index:1}input[type=range]{opacity:0;-webkit-tap-highlight-color:rgba(0,0,0,0);position:absolute;box-sizing:border-box;height:100%;width:100%;margin:0;background:rgba(0,0,0,0);cursor:pointer;pointer-events:auto;appearance:none}input[type=range]:focus{outline:none}::-webkit-slider-runnable-track{-webkit-appearance:none}::-moz-range-track{appearance:none}::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;block-size:var(--_handle-height);inline-size:var(--_handle-width);opacity:0;z-index:2}input.end::-webkit-slider-thumb{--_track-and-knob-padding: calc( (var(--_state-layer-size) - var(--_handle-width)) / 2 );--_x-translate: calc( var(--_track-and-knob-padding) - 2 * var(--_end-fraction) * var(--_track-and-knob-padding) );transform:translateX(var(--_x-translate))}input.end:dir(rtl)::-webkit-slider-thumb{transform:translateX(calc(-1 * var(--_x-translate)))}input.start::-webkit-slider-thumb{--_track-and-knob-padding: calc( (var(--_state-layer-size) - var(--_handle-width)) / 2 );--_x-translate: calc( var(--_track-and-knob-padding) - 2 * var(--_start-fraction) * var(--_track-and-knob-padding) );transform:translateX(var(--_x-translate))}input.start:dir(rtl)::-webkit-slider-thumb{transform:translateX(calc(-1 * var(--_x-translate)))}::-moz-range-thumb{appearance:none;block-size:var(--_state-layer-size);inline-size:var(--_state-layer-size);transform:scaleX(0);opacity:0;z-index:2}.ranged input.start{clip-path:inset(0 calc(100% - (var(--_state-layer-size) / 2 + (100% - var(--_state-layer-size)) * (var(--_start-fraction) + (var(--_end-fraction) - var(--_start-fraction)) / 2))) 0 0)}.ranged input.start:dir(rtl){clip-path:inset(0 0 0 calc(100% - (var(--_state-layer-size) / 2 + (100% - var(--_state-layer-size)) * (var(--_start-fraction) + (var(--_end-fraction) - var(--_start-fraction)) / 2))))}.ranged input.end{clip-path:inset(0 0 0 calc(var(--_state-layer-size) / 2 + (100% - var(--_state-layer-size)) * (var(--_start-fraction) + (var(--_end-fraction) - var(--_start-fraction)) / 2)))}.ranged input.end:dir(rtl){clip-path:inset(0 calc(var(--_state-layer-size) / 2 + (100% - var(--_state-layer-size)) * (var(--_start-fraction) + (var(--_end-fraction) - var(--_start-fraction)) / 2)) 0 0)}.onTop{z-index:1}.handle{--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}md-ripple{border-radius:50%;height:var(--_state-layer-size);width:var(--_state-layer-size)}
`;
  var slider_styles_cssresult_default = styles49.styleSheet;

  // ../slider/slider.js
  var MdSlider = class MdSlider2 extends Slider {
  };
  MdSlider.styles = [styles49, styles48];
  MdSlider = __decorate([
    e("md-slider")
  ], MdSlider);

  // ../switch/internal/switch.js
  var switchBaseClass = mixinDelegatesAria(mixinConstraintValidation(mixinFormAssociated(mixinElementInternals(s3))));
  var Switch = class extends switchBaseClass {
    constructor() {
      super();
      this.selected = false;
      this.icons = false;
      this.showOnlySelectedIcon = false;
      this.required = false;
      this.value = "on";
      if (o7) {
        return;
      }
      this.addEventListener("click", (event) => {
        if (!isActivationClick(event) || !this.input) {
          return;
        }
        this.focus();
        dispatchActivationClick(this.input);
      });
      setupDispatchHooks(this, "keydown");
      this.addEventListener("keydown", (event) => {
        afterDispatch(event, () => {
          const ignoreEvent = event.defaultPrevented || event.key !== "Enter";
          if (ignoreEvent || this.disabled || !this.input) {
            return;
          }
          this.input.click();
        });
      });
    }
    render() {
      return T`
      <div class="switch ${o8(this.getRenderClasses())}">
        <input
          id="switch"
          class="touch"
          type="checkbox"
          role="switch"
          aria-label=${this.ariaLabel || A}
          ?checked=${this.selected}
          ?disabled=${this.disabled}
          ?required=${this.required}
          @input=${this.handleInput}
          @change=${this.handleChange} />

        <md-focus-ring part="focus-ring" for="switch"></md-focus-ring>
        <span class="track"> ${this.renderHandle()} </span>
      </div>
    `;
    }
    getRenderClasses() {
      return {
        "selected": this.selected,
        "unselected": !this.selected,
        "disabled": this.disabled
      };
    }
    renderHandle() {
      const classes = {
        "with-icon": this.showOnlySelectedIcon ? this.selected : this.icons
      };
      return T`
      ${this.renderTouchTarget()}
      <span class="handle-container">
        <md-ripple for="switch" ?disabled="${this.disabled}"></md-ripple>
        <span class="handle ${o8(classes)}">
          ${this.shouldShowIcons() ? this.renderIcons() : T``}
        </span>
      </span>
    `;
    }
    renderIcons() {
      return T`
      <div class="icons">
        ${this.renderOnIcon()}
        ${this.showOnlySelectedIcon ? T`` : this.renderOffIcon()}
      </div>
    `;
    }
    /**
     * https://fonts.google.com/icons?selected=Material%20Symbols%20Outlined%3Acheck%3AFILL%400%3Bwght%40500%3BGRAD%400%3Bopsz%4024
     */
    renderOnIcon() {
      return T`
      <slot class="icon icon--on" name="on-icon">
        <svg viewBox="0 0 24 24">
          <path
            d="M9.55 18.2 3.65 12.3 5.275 10.675 9.55 14.95 18.725 5.775 20.35 7.4Z" />
        </svg>
      </slot>
    `;
    }
    /**
     * https://fonts.google.com/icons?selected=Material%20Symbols%20Outlined%3Aclose%3AFILL%400%3Bwght%40500%3BGRAD%400%3Bopsz%4024
     */
    renderOffIcon() {
      return T`
      <slot class="icon icon--off" name="off-icon">
        <svg viewBox="0 0 24 24">
          <path
            d="M6.4 19.2 4.8 17.6 10.4 12 4.8 6.4 6.4 4.8 12 10.4 17.6 4.8 19.2 6.4 13.6 12 19.2 17.6 17.6 19.2 12 13.6Z" />
        </svg>
      </slot>
    `;
    }
    renderTouchTarget() {
      return T`<span class="touch"></span>`;
    }
    shouldShowIcons() {
      return this.icons || this.showOnlySelectedIcon;
    }
    handleInput(event) {
      const target = event.target;
      this.selected = target.checked;
    }
    handleChange(event) {
      redispatchEvent(this, event);
    }
    [getFormValue]() {
      return this.selected ? this.value : null;
    }
    [getFormState]() {
      return String(this.selected);
    }
    formResetCallback() {
      this.selected = this.hasAttribute("selected");
    }
    formStateRestoreCallback(state) {
      this.selected = state === "true";
    }
    [createValidator]() {
      return new CheckboxValidator(() => ({
        checked: this.selected,
        required: this.required
      }));
    }
    [getValidityAnchor]() {
      return this.input;
    }
  };
  Switch.shadowRootOptions = {
    mode: "open",
    delegatesFocus: true
  };
  __decorate([
    n({ type: Boolean })
  ], Switch.prototype, "selected", void 0);
  __decorate([
    n({ type: Boolean })
  ], Switch.prototype, "icons", void 0);
  __decorate([
    n({ type: Boolean, attribute: "show-only-selected-icon" })
  ], Switch.prototype, "showOnlySelectedIcon", void 0);
  __decorate([
    n({ type: Boolean })
  ], Switch.prototype, "required", void 0);
  __decorate([
    n()
  ], Switch.prototype, "value", void 0);
  __decorate([
    i2("input")
  ], Switch.prototype, "input", void 0);

  // ../switch/internal/switch-styles.cssresult.js
  var styles50 = i3`@layer styles, hcm;@layer styles{:host{display:inline-flex;outline:none;vertical-align:top;-webkit-tap-highlight-color:rgba(0,0,0,0);cursor:pointer}:host([disabled]){cursor:default}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--md-switch-track-height, 32px))/2) 0px}md-focus-ring{--md-focus-ring-shape-start-start: var(--md-switch-track-shape-start-start, var(--md-switch-track-shape, var(--md-sys-shape-corner-full, 9999px)));--md-focus-ring-shape-start-end: var(--md-switch-track-shape-start-end, var(--md-switch-track-shape, var(--md-sys-shape-corner-full, 9999px)));--md-focus-ring-shape-end-end: var(--md-switch-track-shape-end-end, var(--md-switch-track-shape, var(--md-sys-shape-corner-full, 9999px)));--md-focus-ring-shape-end-start: var(--md-switch-track-shape-end-start, var(--md-switch-track-shape, var(--md-sys-shape-corner-full, 9999px)))}.switch{align-items:center;display:inline-flex;flex-shrink:0;position:relative;width:var(--md-switch-track-width, 52px);height:var(--md-switch-track-height, 32px);border-start-start-radius:var(--md-switch-track-shape-start-start, var(--md-switch-track-shape, var(--md-sys-shape-corner-full, 9999px)));border-start-end-radius:var(--md-switch-track-shape-start-end, var(--md-switch-track-shape, var(--md-sys-shape-corner-full, 9999px)));border-end-end-radius:var(--md-switch-track-shape-end-end, var(--md-switch-track-shape, var(--md-sys-shape-corner-full, 9999px)));border-end-start-radius:var(--md-switch-track-shape-end-start, var(--md-switch-track-shape, var(--md-sys-shape-corner-full, 9999px)))}input{appearance:none;background:none;height:max(100%,var(--md-switch-touch-target-size, 48px));outline:none;margin:0;position:absolute;width:max(100%,var(--md-switch-touch-target-size, 48px));z-index:1;cursor:inherit;top:50%;left:50%;transform:translate(-50%, -50%)}:host([touch-target=none]) input{display:none}}@layer styles{.track{position:absolute;width:100%;height:100%;box-sizing:border-box;border-radius:inherit;display:flex;justify-content:center;align-items:center}.track::before{content:"";display:flex;position:absolute;height:100%;width:100%;border-radius:inherit;box-sizing:border-box;transition-property:opacity,background-color;transition-timing-function:linear;transition-duration:67ms}.disabled .track{background-color:rgba(0,0,0,0);border-color:rgba(0,0,0,0)}.disabled .track::before,.disabled .track::after{transition:none;opacity:var(--md-switch-disabled-track-opacity, 0.12)}.disabled .track::before{background-clip:content-box}.selected .track::before{background-color:var(--md-switch-selected-track-color, var(--md-sys-color-primary, #6750a4))}.selected:hover .track::before{background-color:var(--md-switch-selected-hover-track-color, var(--md-sys-color-primary, #6750a4))}.selected:focus-within .track::before{background-color:var(--md-switch-selected-focus-track-color, var(--md-sys-color-primary, #6750a4))}.selected:active .track::before{background-color:var(--md-switch-selected-pressed-track-color, var(--md-sys-color-primary, #6750a4))}.selected.disabled .track{background-clip:border-box}.selected.disabled .track::before{background-color:var(--md-switch-disabled-selected-track-color, var(--md-sys-color-on-surface, #1d1b20))}.unselected .track::before{background-color:var(--md-switch-track-color, var(--md-sys-color-surface-container-highest, #e6e0e9));border-color:var(--md-switch-track-outline-color, var(--md-sys-color-outline, #79747e));border-style:solid;border-width:var(--md-switch-track-outline-width, 2px)}.unselected:hover .track::before{background-color:var(--md-switch-hover-track-color, var(--md-sys-color-surface-container-highest, #e6e0e9));border-color:var(--md-switch-hover-track-outline-color, var(--md-sys-color-outline, #79747e))}.unselected:focus-visible .track::before{background-color:var(--md-switch-focus-track-color, var(--md-sys-color-surface-container-highest, #e6e0e9));border-color:var(--md-switch-focus-track-outline-color, var(--md-sys-color-outline, #79747e))}.unselected:active .track::before{background-color:var(--md-switch-pressed-track-color, var(--md-sys-color-surface-container-highest, #e6e0e9));border-color:var(--md-switch-pressed-track-outline-color, var(--md-sys-color-outline, #79747e))}.unselected.disabled .track::before{background-color:var(--md-switch-disabled-track-color, var(--md-sys-color-surface-container-highest, #e6e0e9));border-color:var(--md-switch-disabled-track-outline-color, var(--md-sys-color-on-surface, #1d1b20))}}@layer hcm{@media(forced-colors: active){.selected .track::before{background:ButtonText;border-color:ButtonText}.disabled .track::before{border-color:GrayText;opacity:1}.disabled.selected .track::before{background:GrayText}}}@layer styles{.handle-container{display:flex;place-content:center;place-items:center;position:relative;transition:margin 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)}.selected .handle-container{margin-inline-start:calc(var(--md-switch-track-width, 52px) - var(--md-switch-track-height, 32px))}.unselected .handle-container{margin-inline-end:calc(var(--md-switch-track-width, 52px) - var(--md-switch-track-height, 32px))}.disabled .handle-container{transition:none}.handle{border-start-start-radius:var(--md-switch-handle-shape-start-start, var(--md-switch-handle-shape, var(--md-sys-shape-corner-full, 9999px)));border-start-end-radius:var(--md-switch-handle-shape-start-end, var(--md-switch-handle-shape, var(--md-sys-shape-corner-full, 9999px)));border-end-end-radius:var(--md-switch-handle-shape-end-end, var(--md-switch-handle-shape, var(--md-sys-shape-corner-full, 9999px)));border-end-start-radius:var(--md-switch-handle-shape-end-start, var(--md-switch-handle-shape, var(--md-sys-shape-corner-full, 9999px)));height:var(--md-switch-handle-height, 16px);width:var(--md-switch-handle-width, 16px);transform-origin:center;transition-property:height,width;transition-duration:250ms,250ms;transition-timing-function:cubic-bezier(0.2, 0, 0, 1),cubic-bezier(0.2, 0, 0, 1);z-index:0}.handle::before{content:"";display:flex;inset:0;position:absolute;border-radius:inherit;box-sizing:border-box;transition:background-color 67ms linear}.disabled .handle,.disabled .handle::before{transition:none}.selected .handle{height:var(--md-switch-selected-handle-height, 24px);width:var(--md-switch-selected-handle-width, 24px)}.handle.with-icon{height:var(--md-switch-with-icon-handle-height, 24px);width:var(--md-switch-with-icon-handle-width, 24px)}.selected:not(.disabled):active .handle,.unselected:not(.disabled):active .handle{height:var(--md-switch-pressed-handle-height, 28px);width:var(--md-switch-pressed-handle-width, 28px);transition-timing-function:linear;transition-duration:100ms}.selected .handle::before{background-color:var(--md-switch-selected-handle-color, var(--md-sys-color-on-primary, #fff))}.selected:hover .handle::before{background-color:var(--md-switch-selected-hover-handle-color, var(--md-sys-color-primary-container, #eaddff))}.selected:focus-within .handle::before{background-color:var(--md-switch-selected-focus-handle-color, var(--md-sys-color-primary-container, #eaddff))}.selected:active .handle::before{background-color:var(--md-switch-selected-pressed-handle-color, var(--md-sys-color-primary-container, #eaddff))}.selected.disabled .handle::before{background-color:var(--md-switch-disabled-selected-handle-color, var(--md-sys-color-surface, #fef7ff));opacity:var(--md-switch-disabled-selected-handle-opacity, 1)}.unselected .handle::before{background-color:var(--md-switch-handle-color, var(--md-sys-color-outline, #79747e))}.unselected:hover .handle::before{background-color:var(--md-switch-hover-handle-color, var(--md-sys-color-on-surface-variant, #49454f))}.unselected:focus-within .handle::before{background-color:var(--md-switch-focus-handle-color, var(--md-sys-color-on-surface-variant, #49454f))}.unselected:active .handle::before{background-color:var(--md-switch-pressed-handle-color, var(--md-sys-color-on-surface-variant, #49454f))}.unselected.disabled .handle::before{background-color:var(--md-switch-disabled-handle-color, var(--md-sys-color-on-surface, #1d1b20));opacity:var(--md-switch-disabled-handle-opacity, 0.38)}md-ripple{border-radius:var(--md-switch-state-layer-shape, var(--md-sys-shape-corner-full, 9999px));height:var(--md-switch-state-layer-size, 40px);inset:unset;width:var(--md-switch-state-layer-size, 40px)}.selected md-ripple{--md-ripple-hover-color: var(--md-switch-selected-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--md-ripple-pressed-color: var(--md-switch-selected-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--md-ripple-hover-opacity: var(--md-switch-selected-hover-state-layer-opacity, 0.08);--md-ripple-pressed-opacity: var(--md-switch-selected-pressed-state-layer-opacity, 0.12)}.unselected md-ripple{--md-ripple-hover-color: var(--md-switch-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-pressed-color: var(--md-switch-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-hover-opacity: var(--md-switch-hover-state-layer-opacity, 0.08);--md-ripple-pressed-opacity: var(--md-switch-pressed-state-layer-opacity, 0.12)}}@layer hcm{@media(forced-colors: active){.unselected .handle::before{background:ButtonText}.disabled .handle::before{opacity:1}.disabled.unselected .handle::before{background:GrayText}}}@layer styles{.icons{position:relative;height:100%;width:100%}.icon{position:absolute;inset:0;margin:auto;display:flex;align-items:center;justify-content:center;fill:currentColor;transition:fill 67ms linear,opacity 33ms linear,transform 167ms cubic-bezier(0.2, 0, 0, 1);opacity:0}.disabled .icon{transition:none}.selected .icon--on,.unselected .icon--off{opacity:1}.unselected .handle:not(.with-icon) .icon--on{transform:rotate(-45deg)}.icon--off{width:var(--md-switch-icon-size, 16px);height:var(--md-switch-icon-size, 16px);color:var(--md-switch-icon-color, var(--md-sys-color-surface-container-highest, #e6e0e9))}.unselected:hover .icon--off{color:var(--md-switch-hover-icon-color, var(--md-sys-color-surface-container-highest, #e6e0e9))}.unselected:focus-within .icon--off{color:var(--md-switch-focus-icon-color, var(--md-sys-color-surface-container-highest, #e6e0e9))}.unselected:active .icon--off{color:var(--md-switch-pressed-icon-color, var(--md-sys-color-surface-container-highest, #e6e0e9))}.unselected.disabled .icon--off{color:var(--md-switch-disabled-icon-color, var(--md-sys-color-surface-container-highest, #e6e0e9));opacity:var(--md-switch-disabled-icon-opacity, 0.38)}.icon--on{width:var(--md-switch-selected-icon-size, 16px);height:var(--md-switch-selected-icon-size, 16px);color:var(--md-switch-selected-icon-color, var(--md-sys-color-on-primary-container, #21005d))}.selected:hover .icon--on{color:var(--md-switch-selected-hover-icon-color, var(--md-sys-color-on-primary-container, #21005d))}.selected:focus-within .icon--on{color:var(--md-switch-selected-focus-icon-color, var(--md-sys-color-on-primary-container, #21005d))}.selected:active .icon--on{color:var(--md-switch-selected-pressed-icon-color, var(--md-sys-color-on-primary-container, #21005d))}.selected.disabled .icon--on{color:var(--md-switch-disabled-selected-icon-color, var(--md-sys-color-on-surface, #1d1b20));opacity:var(--md-switch-disabled-selected-icon-opacity, 0.38)}}@layer hcm{@media(forced-colors: active){.icon--off{fill:Canvas}.icon--on{fill:ButtonText}.disabled.unselected .icon--off,.disabled.selected .icon--on{opacity:1}.disabled .icon--on{fill:GrayText}}}
`;
  var switch_styles_cssresult_default = styles50.styleSheet;

  // ../switch/switch.js
  var MdSwitch = class MdSwitch2 extends Switch {
  };
  MdSwitch.styles = [styles50];
  MdSwitch = __decorate([
    e("md-switch")
  ], MdSwitch);

  // ../tabs/internal/tab.js
  var ANIMATE_INDICATOR = /* @__PURE__ */ Symbol("animateIndicator");
  var tabBaseClass = mixinFocusable(s3);
  var Tab = class extends tabBaseClass {
    /**
     * @deprecated use `active`
     */
    get selected() {
      return this.active;
    }
    set selected(active) {
      this.active = active;
    }
    constructor() {
      super();
      this.isTab = true;
      this.active = false;
      this.hasIcon = false;
      this.iconOnly = false;
      this.fullWidthIndicator = false;
      this.internals = // Cast needed for closure
      this.attachInternals();
      if (!o7) {
        this.internals.role = "tab";
        this.addEventListener("keydown", this.handleKeydown.bind(this));
      }
    }
    render() {
      const indicator = T`<div class="indicator"></div>`;
      return T`<div
      class="button"
      role="presentation"
      @click=${this.handleContentClick}>
      <md-focus-ring part="focus-ring" inward .control=${this}></md-focus-ring>
      <md-elevation part="elevation"></md-elevation>
      <md-ripple .control=${this}></md-ripple>
      <div
        class="content ${o8(this.getContentClasses())}"
        role="presentation">
        <slot name="icon" @slotchange=${this.handleIconSlotChange}></slot>
        <slot @slotchange=${this.handleSlotChange}></slot>
        ${this.fullWidthIndicator ? A : indicator}
      </div>
      ${this.fullWidthIndicator ? indicator : A}
    </div>`;
    }
    getContentClasses() {
      return {
        "has-icon": this.hasIcon,
        "has-label": !this.iconOnly
      };
    }
    updated() {
      this.internals.ariaSelected = String(this.active);
    }
    async handleKeydown(event) {
      await 0;
      if (event.defaultPrevented) {
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.click();
      }
    }
    handleContentClick(event) {
      event.stopPropagation();
      this.click();
    }
    [ANIMATE_INDICATOR](previousTab) {
      if (!this.indicator) {
        return;
      }
      this.indicator.getAnimations().forEach((a7) => {
        a7.cancel();
      });
      const frames = this.getKeyframes(previousTab);
      if (frames !== null) {
        this.indicator.animate(frames, {
          duration: 250,
          easing: EASING.EMPHASIZED
        });
      }
    }
    getKeyframes(previousTab) {
      const reduceMotion = shouldReduceMotion();
      if (!this.active) {
        return reduceMotion ? [{ "opacity": 1 }, { "transform": "none" }] : null;
      }
      const from = {};
      const fromRect = previousTab.indicator?.getBoundingClientRect() ?? {};
      const fromPos = fromRect.left;
      const fromExtent = fromRect.width;
      const toRect = this.indicator.getBoundingClientRect();
      const toPos = toRect.left;
      const toExtent = toRect.width;
      const scale = fromExtent / toExtent;
      if (!reduceMotion && fromPos !== void 0 && toPos !== void 0 && !isNaN(scale)) {
        from["transform"] = `translateX(${(fromPos - toPos).toFixed(4)}px) scaleX(${scale.toFixed(4)})`;
      } else {
        from["opacity"] = 0;
      }
      return [from, { "transform": "none" }];
    }
    handleSlotChange() {
      this.iconOnly = false;
      for (const node of this.assignedDefaultNodes) {
        const hasTextContent = node.nodeType === Node.TEXT_NODE && !!node.wholeText.match(/\S/);
        if (node.nodeType === Node.ELEMENT_NODE || hasTextContent) {
          return;
        }
      }
      this.iconOnly = true;
    }
    handleIconSlotChange() {
      this.hasIcon = this.assignedIcons.length > 0;
    }
  };
  __decorate([
    n({ type: Boolean, reflect: true, attribute: "md-tab" })
  ], Tab.prototype, "isTab", void 0);
  __decorate([
    n({ type: Boolean, reflect: true })
  ], Tab.prototype, "active", void 0);
  __decorate([
    n({ type: Boolean })
  ], Tab.prototype, "selected", null);
  __decorate([
    n({ type: Boolean, attribute: "has-icon" })
  ], Tab.prototype, "hasIcon", void 0);
  __decorate([
    n({ type: Boolean, attribute: "icon-only" })
  ], Tab.prototype, "iconOnly", void 0);
  __decorate([
    i2(".indicator")
  ], Tab.prototype, "indicator", void 0);
  __decorate([
    t()
  ], Tab.prototype, "fullWidthIndicator", void 0);
  __decorate([
    o2({ flatten: true })
  ], Tab.prototype, "assignedDefaultNodes", void 0);
  __decorate([
    e5({ slot: "icon", flatten: true })
  ], Tab.prototype, "assignedIcons", void 0);
  function shouldReduceMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  // ../tabs/internal/primary-tab.js
  var PrimaryTab = class extends Tab {
    constructor() {
      super(...arguments);
      this.inlineIcon = false;
    }
    getContentClasses() {
      return {
        ...super.getContentClasses(),
        "stacked": !this.inlineIcon
      };
    }
  };
  __decorate([
    n({ type: Boolean, attribute: "inline-icon" })
  ], PrimaryTab.prototype, "inlineIcon", void 0);

  // ../tabs/internal/primary-tab-styles.cssresult.js
  var styles51 = i3`:host{--_active-indicator-color: var(--md-primary-tab-active-indicator-color, var(--md-sys-color-primary, #6750a4));--_active-indicator-height: var(--md-primary-tab-active-indicator-height, 3px);--_active-indicator-shape: var(--md-primary-tab-active-indicator-shape, 3px 3px 0px 0px);--_active-hover-state-layer-color: var(--md-primary-tab-active-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_active-hover-state-layer-opacity: var(--md-primary-tab-active-hover-state-layer-opacity, 0.08);--_active-pressed-state-layer-color: var(--md-primary-tab-active-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_active-pressed-state-layer-opacity: var(--md-primary-tab-active-pressed-state-layer-opacity, 0.12);--_container-color: var(--md-primary-tab-container-color, var(--md-sys-color-surface, #fef7ff));--_container-elevation: var(--md-primary-tab-container-elevation, 0);--_container-height: var(--md-primary-tab-container-height, 48px);--_with-icon-and-label-text-container-height: var(--md-primary-tab-with-icon-and-label-text-container-height, 64px);--_hover-state-layer-color: var(--md-primary-tab-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-state-layer-opacity: var(--md-primary-tab-hover-state-layer-opacity, 0.08);--_pressed-state-layer-color: var(--md-primary-tab-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-opacity: var(--md-primary-tab-pressed-state-layer-opacity, 0.12);--_active-focus-icon-color: var(--md-primary-tab-active-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_active-hover-icon-color: var(--md-primary-tab-active-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_active-icon-color: var(--md-primary-tab-active-icon-color, var(--md-sys-color-primary, #6750a4));--_active-pressed-icon-color: var(--md-primary-tab-active-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-size: var(--md-primary-tab-icon-size, 24px);--_focus-icon-color: var(--md-primary-tab-focus-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-icon-color: var(--md-primary-tab-hover-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_icon-color: var(--md-primary-tab-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-icon-color: var(--md-primary-tab-pressed-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_label-text-font: var(--md-primary-tab-label-text-font, var(--md-sys-typescale-title-small-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-primary-tab-label-text-line-height, var(--md-sys-typescale-title-small-line-height, 1.25rem));--_label-text-size: var(--md-primary-tab-label-text-size, var(--md-sys-typescale-title-small-size, 0.875rem));--_label-text-weight: var(--md-primary-tab-label-text-weight, var(--md-sys-typescale-title-small-weight, var(--md-ref-typeface-weight-medium, 500)));--_active-focus-label-text-color: var(--md-primary-tab-active-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_active-hover-label-text-color: var(--md-primary-tab-active-hover-label-text-color, var(--md-sys-color-primary, #6750a4));--_active-label-text-color: var(--md-primary-tab-active-label-text-color, var(--md-sys-color-primary, #6750a4));--_active-pressed-label-text-color: var(--md-primary-tab-active-pressed-label-text-color, var(--md-sys-color-primary, #6750a4));--_focus-label-text-color: var(--md-primary-tab-focus-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-label-text-color: var(--md-primary-tab-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_label-text-color: var(--md-primary-tab-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-label-text-color: var(--md-primary-tab-pressed-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_container-shape-start-start: var(--md-primary-tab-container-shape-start-start, var(--md-primary-tab-container-shape, var(--md-sys-shape-corner-none, 0px)));--_container-shape-start-end: var(--md-primary-tab-container-shape-start-end, var(--md-primary-tab-container-shape, var(--md-sys-shape-corner-none, 0px)));--_container-shape-end-end: var(--md-primary-tab-container-shape-end-end, var(--md-primary-tab-container-shape, var(--md-sys-shape-corner-none, 0px)));--_container-shape-end-start: var(--md-primary-tab-container-shape-end-start, var(--md-primary-tab-container-shape, var(--md-sys-shape-corner-none, 0px)))}.content.stacked{flex-direction:column;gap:2px}.content.stacked.has-icon.has-label{height:var(--_with-icon-and-label-text-container-height)}
`;
  var primary_tab_styles_cssresult_default = styles51.styleSheet;

  // ../tabs/internal/tab-styles.cssresult.js
  var styles52 = i3`:host{display:inline-flex;align-items:center;justify-content:center;outline:none;padding:0 16px;position:relative;-webkit-tap-highlight-color:rgba(0,0,0,0);vertical-align:middle;user-select:none;font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight);color:var(--_label-text-color);z-index:0;--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity);--md-elevation-level: var(--_container-elevation)}md-focus-ring{--md-focus-ring-shape: 8px}:host([active]) md-focus-ring{margin-bottom:calc(var(--_active-indicator-height) + 1px)}.button::before{background:var(--_container-color);content:"";inset:0;position:absolute;z-index:-1}.button::before,md-ripple,md-elevation{border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-end-radius:var(--_container-shape-end-end);border-end-start-radius:var(--_container-shape-end-start)}.content{position:relative;box-sizing:border-box;display:inline-flex;flex-direction:row;align-items:center;justify-content:center;height:var(--_container-height);gap:8px}.indicator{position:absolute;box-sizing:border-box;z-index:-1;transform-origin:bottom left;background:var(--_active-indicator-color);border-radius:var(--_active-indicator-shape);height:var(--_active-indicator-height);inset:auto 0 0 0;opacity:0}::slotted([slot=icon]){display:inline-flex;position:relative;writing-mode:horizontal-tb;fill:currentColor;color:var(--_icon-color);font-size:var(--_icon-size);width:var(--_icon-size);height:var(--_icon-size)}:host(:hover){color:var(--_hover-label-text-color);cursor:pointer}:host(:hover) ::slotted([slot=icon]){color:var(--_hover-icon-color)}:host(:focus){color:var(--_focus-label-text-color)}:host(:focus) ::slotted([slot=icon]){color:var(--_focus-icon-color)}:host(:active){color:var(--_pressed-label-text-color)}:host(:active) ::slotted([slot=icon]){color:var(--_pressed-icon-color)}:host([active]) .indicator{opacity:1}:host([active]){color:var(--_active-label-text-color);--md-ripple-hover-color: var(--_active-hover-state-layer-color);--md-ripple-hover-opacity: var(--_active-hover-state-layer-opacity);--md-ripple-pressed-color: var(--_active-pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_active-pressed-state-layer-opacity)}:host([active]) ::slotted([slot=icon]){color:var(--_active-icon-color)}:host([active]:hover){color:var(--_active-hover-label-text-color)}:host([active]:hover) ::slotted([slot=icon]){color:var(--_active-hover-icon-color)}:host([active]:focus){color:var(--_active-focus-label-text-color)}:host([active]:focus) ::slotted([slot=icon]){color:var(--_active-focus-icon-color)}:host([active]:active){color:var(--_active-pressed-label-text-color)}:host([active]:active) ::slotted([slot=icon]){color:var(--_active-pressed-icon-color)}:host,::slotted(*){white-space:nowrap}@media(forced-colors: active){.indicator{background:CanvasText}}
`;
  var tab_styles_cssresult_default = styles52.styleSheet;

  // ../tabs/primary-tab.js
  var MdPrimaryTab = class MdPrimaryTab2 extends PrimaryTab {
  };
  MdPrimaryTab.styles = [styles52, styles51];
  MdPrimaryTab = __decorate([
    e("md-primary-tab")
  ], MdPrimaryTab);

  // ../tabs/internal/secondary-tab.js
  var SecondaryTab = class extends Tab {
    constructor() {
      super(...arguments);
      this.fullWidthIndicator = true;
    }
  };

  // ../tabs/internal/secondary-tab-styles.cssresult.js
  var styles53 = i3`:host{--_active-indicator-color: var(--md-secondary-tab-active-indicator-color, var(--md-sys-color-primary, #6750a4));--_active-indicator-height: var(--md-secondary-tab-active-indicator-height, 2px);--_active-label-text-color: var(--md-secondary-tab-active-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_container-color: var(--md-secondary-tab-container-color, var(--md-sys-color-surface, #fef7ff));--_container-elevation: var(--md-secondary-tab-container-elevation, 0);--_container-height: var(--md-secondary-tab-container-height, 48px);--_focus-label-text-color: var(--md-secondary-tab-focus-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-label-text-color: var(--md-secondary-tab-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-state-layer-color: var(--md-secondary-tab-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-state-layer-opacity: var(--md-secondary-tab-hover-state-layer-opacity, 0.08);--_label-text-font: var(--md-secondary-tab-label-text-font, var(--md-sys-typescale-title-small-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-secondary-tab-label-text-line-height, var(--md-sys-typescale-title-small-line-height, 1.25rem));--_label-text-size: var(--md-secondary-tab-label-text-size, var(--md-sys-typescale-title-small-size, 0.875rem));--_label-text-weight: var(--md-secondary-tab-label-text-weight, var(--md-sys-typescale-title-small-weight, var(--md-ref-typeface-weight-medium, 500)));--_pressed-label-text-color: var(--md-secondary-tab-pressed-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_pressed-state-layer-color: var(--md-secondary-tab-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_pressed-state-layer-opacity: var(--md-secondary-tab-pressed-state-layer-opacity, 0.12);--_active-focus-icon-color: var(--md-secondary-tab-active-focus-icon-color, );--_active-focus-label-text-color: var(--md-secondary-tab-active-focus-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_active-hover-icon-color: var(--md-secondary-tab-active-hover-icon-color, );--_active-hover-label-text-color: var(--md-secondary-tab-active-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_active-hover-state-layer-color: var(--md-secondary-tab-active-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_active-hover-state-layer-opacity: var(--md-secondary-tab-active-hover-state-layer-opacity, 0.08);--_active-icon-color: var(--md-secondary-tab-active-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_active-indicator-shape: var(--md-secondary-tab-active-indicator-shape, 0);--_active-pressed-icon-color: var(--md-secondary-tab-active-pressed-icon-color, );--_active-pressed-label-text-color: var(--md-secondary-tab-active-pressed-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_active-pressed-state-layer-color: var(--md-secondary-tab-active-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_active-pressed-state-layer-opacity: var(--md-secondary-tab-active-pressed-state-layer-opacity, 0.12);--_label-text-color: var(--md-secondary-tab-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-icon-color: var(--md-secondary-tab-focus-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-icon-color: var(--md-secondary-tab-hover-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_icon-size: var(--md-secondary-tab-icon-size, 24px);--_icon-color: var(--md-secondary-tab-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-icon-color: var(--md-secondary-tab-pressed-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_container-shape-start-start: var(--md-secondary-tab-container-shape-start-start, var(--md-secondary-tab-container-shape, var(--md-sys-shape-corner-none, 0px)));--_container-shape-start-end: var(--md-secondary-tab-container-shape-start-end, var(--md-secondary-tab-container-shape, var(--md-sys-shape-corner-none, 0px)));--_container-shape-end-end: var(--md-secondary-tab-container-shape-end-end, var(--md-secondary-tab-container-shape, var(--md-sys-shape-corner-none, 0px)));--_container-shape-end-start: var(--md-secondary-tab-container-shape-end-start, var(--md-secondary-tab-container-shape, var(--md-sys-shape-corner-none, 0px)))}
`;
  var secondary_tab_styles_cssresult_default = styles53.styleSheet;

  // ../tabs/secondary-tab.js
  var MdSecondaryTab = class MdSecondaryTab2 extends SecondaryTab {
  };
  MdSecondaryTab.styles = [styles52, styles53];
  MdSecondaryTab = __decorate([
    e("md-secondary-tab")
  ], MdSecondaryTab);

  // ../tabs/internal/tabs.js
  var Tabs = class extends s3 {
    /**
     * The currently selected tab, `null` only when there are no tab children.
     *
     * @export
     */
    get activeTab() {
      return this.tabs.find((tab) => tab.active) ?? null;
    }
    set activeTab(tab) {
      if (tab) {
        this.activateTab(tab);
      }
    }
    /**
     * The index of the currently selected tab.
     *
     * @export
     */
    get activeTabIndex() {
      return this.tabs.findIndex((tab) => tab.active);
    }
    set activeTabIndex(index) {
      const activateTabAtIndex = () => {
        const tab = this.tabs[index];
        if (tab) {
          this.activateTab(tab);
        }
      };
      if (!this.slotElement) {
        this.updateComplete.then(activateTabAtIndex);
        return;
      }
      activateTabAtIndex();
    }
    get focusedTab() {
      return this.tabs.find((tab) => tab.matches(":focus-within"));
    }
    constructor() {
      super();
      this.autoActivate = false;
      this.internals = // Cast needed for closure
      this.attachInternals();
      if (!o7) {
        this.internals.role = "tablist";
        this.addEventListener("keydown", this.handleKeydown.bind(this));
        this.addEventListener("keyup", this.handleKeyup.bind(this));
        this.addEventListener("focusout", this.handleFocusout.bind(this));
      }
    }
    /**
     * Scrolls the toolbar, if overflowing, to the active tab, or the provided
     * tab.
     *
     * @param tabToScrollTo The tab that should be scrolled to. Defaults to the
     *     active tab.
     * @return A Promise that resolves after the tab has been scrolled to.
     */
    async scrollToTab(tabToScrollTo) {
      await this.updateComplete;
      const { tabs } = this;
      tabToScrollTo ??= this.activeTab;
      if (!tabToScrollTo || !tabs.includes(tabToScrollTo) || !this.tabsScrollerElement) {
        return;
      }
      for (const tab of this.tabs) {
        await tab.updateComplete;
      }
      const offset = tabToScrollTo.offsetLeft;
      const extent = tabToScrollTo.offsetWidth;
      const scroll = this.scrollLeft;
      const hostExtent = this.offsetWidth;
      const scrollMargin = 48;
      const min = offset - scrollMargin;
      const max = offset + extent - hostExtent + scrollMargin;
      const to = Math.min(min, Math.max(max, scroll));
      const behavior = !this.focusedTab ? "instant" : "auto";
      this.tabsScrollerElement.scrollTo({ behavior, top: 0, left: to });
    }
    render() {
      return T`
      <div class="tabs">
        <slot
          @slotchange=${this.handleSlotChange}
          @click=${this.handleTabClick}></slot>
      </div>
      <md-divider part="divider"></md-divider>
    `;
    }
    async handleTabClick(event) {
      const tab = event.target;
      await 0;
      if (event.defaultPrevented || !isTab(tab) || tab.active) {
        return;
      }
      this.activateTab(tab);
    }
    activateTab(activeTab) {
      const { tabs } = this;
      const previousTab = this.activeTab;
      if (!tabs.includes(activeTab) || previousTab === activeTab) {
        return;
      }
      for (const tab of tabs) {
        tab.active = tab === activeTab;
      }
      if (previousTab) {
        const defaultPrevented = !this.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
        if (defaultPrevented) {
          for (const tab of tabs) {
            tab.active = tab === previousTab;
          }
          return;
        }
        activeTab[ANIMATE_INDICATOR](previousTab);
      }
      this.updateFocusableTab(activeTab);
      this.scrollToTab(activeTab);
    }
    updateFocusableTab(focusableTab) {
      for (const tab of this.tabs) {
        tab.tabIndex = tab === focusableTab ? 0 : -1;
      }
    }
    // focus item on keydown and optionally select it
    async handleKeydown(event) {
      await 0;
      const isLeft = event.key === "ArrowLeft";
      const isRight = event.key === "ArrowRight";
      const isHome = event.key === "Home";
      const isEnd = event.key === "End";
      if (event.defaultPrevented || !isLeft && !isRight && !isHome && !isEnd) {
        return;
      }
      const { tabs } = this;
      if (tabs.length < 2) {
        return;
      }
      event.preventDefault();
      let indexToFocus;
      if (isHome || isEnd) {
        indexToFocus = isHome ? 0 : tabs.length - 1;
      } else {
        const isRtl2 = getComputedStyle(this).direction === "rtl";
        const forwards = isRtl2 ? isLeft : isRight;
        const { focusedTab } = this;
        if (!focusedTab) {
          indexToFocus = forwards ? 0 : tabs.length - 1;
        } else {
          const focusedIndex = this.tabs.indexOf(focusedTab);
          indexToFocus = forwards ? focusedIndex + 1 : focusedIndex - 1;
          if (indexToFocus >= tabs.length) {
            indexToFocus = 0;
          } else if (indexToFocus < 0) {
            indexToFocus = tabs.length - 1;
          }
        }
      }
      const tabToFocus = tabs[indexToFocus];
      tabToFocus.focus();
      if (this.autoActivate) {
        this.activateTab(tabToFocus);
      } else {
        this.updateFocusableTab(tabToFocus);
      }
    }
    // scroll to item on keyup.
    handleKeyup() {
      this.scrollToTab(this.focusedTab ?? this.activeTab);
    }
    handleFocusout() {
      if (this.matches(":focus-within")) {
        return;
      }
      const { activeTab } = this;
      if (activeTab) {
        this.updateFocusableTab(activeTab);
      }
    }
    handleSlotChange() {
      const firstTab = this.tabs[0];
      if (!this.activeTab && firstTab) {
        this.activateTab(firstTab);
      }
      this.scrollToTab(this.activeTab);
    }
  };
  __decorate([
    e5({ flatten: true, selector: "[md-tab]" })
  ], Tabs.prototype, "tabs", void 0);
  __decorate([
    n({ type: Number, attribute: "active-tab-index" })
  ], Tabs.prototype, "activeTabIndex", null);
  __decorate([
    n({ type: Boolean, attribute: "auto-activate" })
  ], Tabs.prototype, "autoActivate", void 0);
  __decorate([
    i2(".tabs")
  ], Tabs.prototype, "tabsScrollerElement", void 0);
  __decorate([
    i2("slot")
  ], Tabs.prototype, "slotElement", void 0);
  function isTab(element) {
    return element instanceof HTMLElement && element.hasAttribute("md-tab");
  }

  // ../tabs/internal/tabs-styles.cssresult.js
  var styles54 = i3`:host{box-sizing:border-box;display:flex;flex-direction:column;overflow:auto;scroll-behavior:smooth;scrollbar-width:none;position:relative}:host([hidden]){display:none}:host::-webkit-scrollbar{display:none}.tabs{align-items:end;display:flex;height:100%;overflow:inherit;scroll-behavior:inherit;scrollbar-width:inherit;justify-content:space-between;width:100%}::slotted(*){flex:1}::slotted([active]){z-index:1}
`;
  var tabs_styles_cssresult_default = styles54.styleSheet;

  // ../tabs/tabs.js
  var MdTabs = class MdTabs2 extends Tabs {
  };
  MdTabs.styles = [styles54];
  MdTabs = __decorate([
    e("md-tabs")
  ], MdTabs);

  // ../textfield/internal/filled-styles.cssresult.js
  var styles55 = i3`:host{--_active-indicator-color: var(--md-filled-text-field-active-indicator-color, var(--md-sys-color-on-surface-variant, #49454f));--_active-indicator-height: var(--md-filled-text-field-active-indicator-height, 1px);--_caret-color: var(--md-filled-text-field-caret-color, var(--md-sys-color-primary, #6750a4));--_container-color: var(--md-filled-text-field-container-color, var(--md-sys-color-surface-container-highest, #e6e0e9));--_disabled-active-indicator-color: var(--md-filled-text-field-disabled-active-indicator-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-active-indicator-height: var(--md-filled-text-field-disabled-active-indicator-height, 1px);--_disabled-active-indicator-opacity: var(--md-filled-text-field-disabled-active-indicator-opacity, 0.38);--_disabled-container-color: var(--md-filled-text-field-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-container-opacity: var(--md-filled-text-field-disabled-container-opacity, 0.04);--_disabled-input-text-color: var(--md-filled-text-field-disabled-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-input-text-opacity: var(--md-filled-text-field-disabled-input-text-opacity, 0.38);--_disabled-label-text-color: var(--md-filled-text-field-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-filled-text-field-disabled-label-text-opacity, 0.38);--_disabled-leading-icon-color: var(--md-filled-text-field-disabled-leading-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-leading-icon-opacity: var(--md-filled-text-field-disabled-leading-icon-opacity, 0.38);--_disabled-supporting-text-color: var(--md-filled-text-field-disabled-supporting-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-supporting-text-opacity: var(--md-filled-text-field-disabled-supporting-text-opacity, 0.38);--_disabled-trailing-icon-color: var(--md-filled-text-field-disabled-trailing-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-trailing-icon-opacity: var(--md-filled-text-field-disabled-trailing-icon-opacity, 0.38);--_error-active-indicator-color: var(--md-filled-text-field-error-active-indicator-color, var(--md-sys-color-error, #b3261e));--_error-focus-active-indicator-color: var(--md-filled-text-field-error-focus-active-indicator-color, var(--md-sys-color-error, #b3261e));--_error-focus-caret-color: var(--md-filled-text-field-error-focus-caret-color, var(--md-sys-color-error, #b3261e));--_error-focus-input-text-color: var(--md-filled-text-field-error-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_error-focus-label-text-color: var(--md-filled-text-field-error-focus-label-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-leading-icon-color: var(--md-filled-text-field-error-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-focus-supporting-text-color: var(--md-filled-text-field-error-focus-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-trailing-icon-color: var(--md-filled-text-field-error-focus-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_error-hover-active-indicator-color: var(--md-filled-text-field-error-hover-active-indicator-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-input-text-color: var(--md-filled-text-field-error-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_error-hover-label-text-color: var(--md-filled-text-field-error-hover-label-text-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-leading-icon-color: var(--md-filled-text-field-error-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-hover-state-layer-color: var(--md-filled-text-field-error-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_error-hover-state-layer-opacity: var(--md-filled-text-field-error-hover-state-layer-opacity, 0.08);--_error-hover-supporting-text-color: var(--md-filled-text-field-error-hover-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-hover-trailing-icon-color: var(--md-filled-text-field-error-hover-trailing-icon-color, var(--md-sys-color-on-error-container, #410e0b));--_error-input-text-color: var(--md-filled-text-field-error-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_error-label-text-color: var(--md-filled-text-field-error-label-text-color, var(--md-sys-color-error, #b3261e));--_error-leading-icon-color: var(--md-filled-text-field-error-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-supporting-text-color: var(--md-filled-text-field-error-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-trailing-icon-color: var(--md-filled-text-field-error-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_focus-active-indicator-color: var(--md-filled-text-field-focus-active-indicator-color, var(--md-sys-color-primary, #6750a4));--_focus-active-indicator-height: var(--md-filled-text-field-focus-active-indicator-height, 3px);--_focus-input-text-color: var(--md-filled-text-field-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_focus-label-text-color: var(--md-filled-text-field-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_focus-leading-icon-color: var(--md-filled-text-field-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-supporting-text-color: var(--md-filled-text-field-focus-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-trailing-icon-color: var(--md-filled-text-field-focus-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-active-indicator-color: var(--md-filled-text-field-hover-active-indicator-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-active-indicator-height: var(--md-filled-text-field-hover-active-indicator-height, 1px);--_hover-input-text-color: var(--md-filled-text-field-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-label-text-color: var(--md-filled-text-field-hover-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-leading-icon-color: var(--md-filled-text-field-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-color: var(--md-filled-text-field-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-state-layer-opacity: var(--md-filled-text-field-hover-state-layer-opacity, 0.08);--_hover-supporting-text-color: var(--md-filled-text-field-hover-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-trailing-icon-color: var(--md-filled-text-field-hover-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-color: var(--md-filled-text-field-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_input-text-font: var(--md-filled-text-field-input-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_input-text-line-height: var(--md-filled-text-field-input-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_input-text-placeholder-color: var(--md-filled-text-field-input-text-placeholder-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-prefix-color: var(--md-filled-text-field-input-text-prefix-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-size: var(--md-filled-text-field-input-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_input-text-suffix-color: var(--md-filled-text-field-input-text-suffix-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-weight: var(--md-filled-text-field-input-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_label-text-color: var(--md-filled-text-field-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-font: var(--md-filled-text-field-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-filled-text-field-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_label-text-populated-line-height: var(--md-filled-text-field-label-text-populated-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_label-text-populated-size: var(--md-filled-text-field-label-text-populated-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_label-text-size: var(--md-filled-text-field-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_label-text-weight: var(--md-filled-text-field-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_leading-icon-color: var(--md-filled-text-field-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_leading-icon-size: var(--md-filled-text-field-leading-icon-size, 24px);--_supporting-text-color: var(--md-filled-text-field-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_supporting-text-font: var(--md-filled-text-field-supporting-text-font, var(--md-sys-typescale-body-small-font, var(--md-ref-typeface-plain, Roboto)));--_supporting-text-line-height: var(--md-filled-text-field-supporting-text-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_supporting-text-size: var(--md-filled-text-field-supporting-text-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_supporting-text-weight: var(--md-filled-text-field-supporting-text-weight, var(--md-sys-typescale-body-small-weight, var(--md-ref-typeface-weight-regular, 400)));--_trailing-icon-color: var(--md-filled-text-field-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_trailing-icon-size: var(--md-filled-text-field-trailing-icon-size, 24px);--_container-shape-start-start: var(--md-filled-text-field-container-shape-start-start, var(--md-filled-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-start-end: var(--md-filled-text-field-container-shape-start-end, var(--md-filled-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-end-end: var(--md-filled-text-field-container-shape-end-end, var(--md-filled-text-field-container-shape, var(--md-sys-shape-corner-none, 0px)));--_container-shape-end-start: var(--md-filled-text-field-container-shape-end-start, var(--md-filled-text-field-container-shape, var(--md-sys-shape-corner-none, 0px)));--_icon-input-space: var(--md-filled-text-field-icon-input-space, 16px);--_leading-space: var(--md-filled-text-field-leading-space, 16px);--_trailing-space: var(--md-filled-text-field-trailing-space, 16px);--_top-space: var(--md-filled-text-field-top-space, 16px);--_bottom-space: var(--md-filled-text-field-bottom-space, 16px);--_input-text-prefix-trailing-space: var(--md-filled-text-field-input-text-prefix-trailing-space, 2px);--_input-text-suffix-leading-space: var(--md-filled-text-field-input-text-suffix-leading-space, 2px);--_with-label-top-space: var(--md-filled-text-field-with-label-top-space, 8px);--_with-label-bottom-space: var(--md-filled-text-field-with-label-bottom-space, 8px);--_focus-caret-color: var(--md-filled-text-field-focus-caret-color, var(--md-sys-color-primary, #6750a4));--_with-leading-icon-leading-space: var(--md-filled-text-field-with-leading-icon-leading-space, 12px);--_with-trailing-icon-trailing-space: var(--md-filled-text-field-with-trailing-icon-trailing-space, 12px);--md-filled-field-active-indicator-color: var(--_active-indicator-color);--md-filled-field-active-indicator-height: var(--_active-indicator-height);--md-filled-field-bottom-space: var(--_bottom-space);--md-filled-field-container-color: var(--_container-color);--md-filled-field-container-shape-end-end: var(--_container-shape-end-end);--md-filled-field-container-shape-end-start: var(--_container-shape-end-start);--md-filled-field-container-shape-start-end: var(--_container-shape-start-end);--md-filled-field-container-shape-start-start: var(--_container-shape-start-start);--md-filled-field-content-color: var(--_input-text-color);--md-filled-field-content-font: var(--_input-text-font);--md-filled-field-content-line-height: var(--_input-text-line-height);--md-filled-field-content-size: var(--_input-text-size);--md-filled-field-content-space: var(--_icon-input-space);--md-filled-field-content-weight: var(--_input-text-weight);--md-filled-field-disabled-active-indicator-color: var(--_disabled-active-indicator-color);--md-filled-field-disabled-active-indicator-height: var(--_disabled-active-indicator-height);--md-filled-field-disabled-active-indicator-opacity: var(--_disabled-active-indicator-opacity);--md-filled-field-disabled-container-color: var(--_disabled-container-color);--md-filled-field-disabled-container-opacity: var(--_disabled-container-opacity);--md-filled-field-disabled-content-color: var(--_disabled-input-text-color);--md-filled-field-disabled-content-opacity: var(--_disabled-input-text-opacity);--md-filled-field-disabled-label-text-color: var(--_disabled-label-text-color);--md-filled-field-disabled-label-text-opacity: var(--_disabled-label-text-opacity);--md-filled-field-disabled-leading-content-color: var(--_disabled-leading-icon-color);--md-filled-field-disabled-leading-content-opacity: var(--_disabled-leading-icon-opacity);--md-filled-field-disabled-supporting-text-color: var(--_disabled-supporting-text-color);--md-filled-field-disabled-supporting-text-opacity: var(--_disabled-supporting-text-opacity);--md-filled-field-disabled-trailing-content-color: var(--_disabled-trailing-icon-color);--md-filled-field-disabled-trailing-content-opacity: var(--_disabled-trailing-icon-opacity);--md-filled-field-error-active-indicator-color: var(--_error-active-indicator-color);--md-filled-field-error-content-color: var(--_error-input-text-color);--md-filled-field-error-focus-active-indicator-color: var(--_error-focus-active-indicator-color);--md-filled-field-error-focus-content-color: var(--_error-focus-input-text-color);--md-filled-field-error-focus-label-text-color: var(--_error-focus-label-text-color);--md-filled-field-error-focus-leading-content-color: var(--_error-focus-leading-icon-color);--md-filled-field-error-focus-supporting-text-color: var(--_error-focus-supporting-text-color);--md-filled-field-error-focus-trailing-content-color: var(--_error-focus-trailing-icon-color);--md-filled-field-error-hover-active-indicator-color: var(--_error-hover-active-indicator-color);--md-filled-field-error-hover-content-color: var(--_error-hover-input-text-color);--md-filled-field-error-hover-label-text-color: var(--_error-hover-label-text-color);--md-filled-field-error-hover-leading-content-color: var(--_error-hover-leading-icon-color);--md-filled-field-error-hover-state-layer-color: var(--_error-hover-state-layer-color);--md-filled-field-error-hover-state-layer-opacity: var(--_error-hover-state-layer-opacity);--md-filled-field-error-hover-supporting-text-color: var(--_error-hover-supporting-text-color);--md-filled-field-error-hover-trailing-content-color: var(--_error-hover-trailing-icon-color);--md-filled-field-error-label-text-color: var(--_error-label-text-color);--md-filled-field-error-leading-content-color: var(--_error-leading-icon-color);--md-filled-field-error-supporting-text-color: var(--_error-supporting-text-color);--md-filled-field-error-trailing-content-color: var(--_error-trailing-icon-color);--md-filled-field-focus-active-indicator-color: var(--_focus-active-indicator-color);--md-filled-field-focus-active-indicator-height: var(--_focus-active-indicator-height);--md-filled-field-focus-content-color: var(--_focus-input-text-color);--md-filled-field-focus-label-text-color: var(--_focus-label-text-color);--md-filled-field-focus-leading-content-color: var(--_focus-leading-icon-color);--md-filled-field-focus-supporting-text-color: var(--_focus-supporting-text-color);--md-filled-field-focus-trailing-content-color: var(--_focus-trailing-icon-color);--md-filled-field-hover-active-indicator-color: var(--_hover-active-indicator-color);--md-filled-field-hover-active-indicator-height: var(--_hover-active-indicator-height);--md-filled-field-hover-content-color: var(--_hover-input-text-color);--md-filled-field-hover-label-text-color: var(--_hover-label-text-color);--md-filled-field-hover-leading-content-color: var(--_hover-leading-icon-color);--md-filled-field-hover-state-layer-color: var(--_hover-state-layer-color);--md-filled-field-hover-state-layer-opacity: var(--_hover-state-layer-opacity);--md-filled-field-hover-supporting-text-color: var(--_hover-supporting-text-color);--md-filled-field-hover-trailing-content-color: var(--_hover-trailing-icon-color);--md-filled-field-label-text-color: var(--_label-text-color);--md-filled-field-label-text-font: var(--_label-text-font);--md-filled-field-label-text-line-height: var(--_label-text-line-height);--md-filled-field-label-text-populated-line-height: var(--_label-text-populated-line-height);--md-filled-field-label-text-populated-size: var(--_label-text-populated-size);--md-filled-field-label-text-size: var(--_label-text-size);--md-filled-field-label-text-weight: var(--_label-text-weight);--md-filled-field-leading-content-color: var(--_leading-icon-color);--md-filled-field-leading-space: var(--_leading-space);--md-filled-field-supporting-text-color: var(--_supporting-text-color);--md-filled-field-supporting-text-font: var(--_supporting-text-font);--md-filled-field-supporting-text-line-height: var(--_supporting-text-line-height);--md-filled-field-supporting-text-size: var(--_supporting-text-size);--md-filled-field-supporting-text-weight: var(--_supporting-text-weight);--md-filled-field-top-space: var(--_top-space);--md-filled-field-trailing-content-color: var(--_trailing-icon-color);--md-filled-field-trailing-space: var(--_trailing-space);--md-filled-field-with-label-bottom-space: var(--_with-label-bottom-space);--md-filled-field-with-label-top-space: var(--_with-label-top-space);--md-filled-field-with-leading-content-leading-space: var(--_with-leading-icon-leading-space);--md-filled-field-with-trailing-content-trailing-space: var(--_with-trailing-icon-trailing-space)}
`;
  var filled_styles_cssresult_default4 = styles55.styleSheet;

  // ../node_modules/lit-html/node/directive-helpers.js
  var { I: l6 } = Z;
  var e10 = (o11) => void 0 === o11.strings;
  var s5 = {};
  var a4 = (o11, l11 = s5) => o11._$AH = l11;

  // ../node_modules/lit-html/node/directives/live.js
  var l7 = e8(class extends i5 {
    constructor(r8) {
      if (super(r8), r8.type !== t4.PROPERTY && r8.type !== t4.ATTRIBUTE && r8.type !== t4.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
      if (!e10(r8)) throw Error("`live` bindings can only contain a single expression");
    }
    render(r8) {
      return r8;
    }
    update(i10, [t7]) {
      if (t7 === w || t7 === A) return t7;
      const o11 = i10.element, l11 = i10.name;
      if (i10.type === t4.PROPERTY) {
        if (t7 === o11[l11]) return w;
      } else if (i10.type === t4.BOOLEAN_ATTRIBUTE) {
        if (!!t7 === o11.hasAttribute(l11)) return w;
      } else if (i10.type === t4.ATTRIBUTE && o11.getAttribute(l11) === t7 + "") return w;
      return a4(i10), t7;
    }
  });

  // ../internal/controller/string-converter.js
  var stringConverter = {
    fromAttribute(value) {
      return value ?? "";
    },
    toAttribute(value) {
      return value || null;
    }
  };

  // ../labs/behaviors/validators/text-field-validator.js
  var TextFieldValidator = class extends Validator {
    computeValidity({ state, renderedControl }) {
      let inputOrTextArea = renderedControl;
      if (isInputState(state) && !inputOrTextArea) {
        inputOrTextArea = this.inputControl || document.createElement("input");
        this.inputControl = inputOrTextArea;
      } else if (!inputOrTextArea) {
        inputOrTextArea = this.textAreaControl || document.createElement("textarea");
        this.textAreaControl = inputOrTextArea;
      }
      const input = isInputState(state) ? inputOrTextArea : null;
      if (input) {
        input.type = state.type;
      }
      if (inputOrTextArea.value !== state.value) {
        inputOrTextArea.value = state.value;
      }
      inputOrTextArea.required = state.required;
      if (input) {
        const inputState = state;
        if (inputState.pattern) {
          input.pattern = inputState.pattern;
        } else {
          input.removeAttribute("pattern");
        }
        if (inputState.min) {
          input.min = inputState.min;
        } else {
          input.removeAttribute("min");
        }
        if (inputState.max) {
          input.max = inputState.max;
        } else {
          input.removeAttribute("max");
        }
        if (inputState.step) {
          input.step = inputState.step;
        } else {
          input.removeAttribute("step");
        }
      }
      if ((state.minLength ?? -1) > -1) {
        inputOrTextArea.setAttribute("minlength", String(state.minLength));
      } else {
        inputOrTextArea.removeAttribute("minlength");
      }
      if ((state.maxLength ?? -1) > -1) {
        inputOrTextArea.setAttribute("maxlength", String(state.maxLength));
      } else {
        inputOrTextArea.removeAttribute("maxlength");
      }
      return {
        validity: inputOrTextArea.validity,
        validationMessage: inputOrTextArea.validationMessage
      };
    }
    equals({ state: prev }, { state: next }) {
      const inputOrTextAreaEqual = prev.type === next.type && prev.value === next.value && prev.required === next.required && prev.minLength === next.minLength && prev.maxLength === next.maxLength;
      if (!isInputState(prev) || !isInputState(next)) {
        return inputOrTextAreaEqual;
      }
      return inputOrTextAreaEqual && prev.pattern === next.pattern && prev.min === next.min && prev.max === next.max && prev.step === next.step;
    }
    copy({ state }) {
      return {
        state: isInputState(state) ? this.copyInput(state) : this.copyTextArea(state),
        renderedControl: null
      };
    }
    copyInput(state) {
      const { type, pattern, min, max, step } = state;
      return {
        ...this.copySharedState(state),
        type,
        pattern,
        min,
        max,
        step
      };
    }
    copyTextArea(state) {
      return {
        ...this.copySharedState(state),
        type: state.type
      };
    }
    copySharedState({ value, required, minLength, maxLength }) {
      return { value, required, minLength, maxLength };
    }
  };
  function isInputState(state) {
    return state.type !== "textarea";
  }

  // ../textfield/internal/text-field.js
  var textFieldBaseClass = mixinDelegatesAria(mixinOnReportValidity(mixinConstraintValidation(mixinFormAssociated(mixinElementInternals(s3)))));
  var TextField = class extends textFieldBaseClass {
    constructor() {
      super(...arguments);
      this.error = false;
      this.errorText = "";
      this.label = "";
      this.noAsterisk = false;
      this.required = false;
      this.value = "";
      this.prefixText = "";
      this.suffixText = "";
      this.hasLeadingIcon = false;
      this.hasTrailingIcon = false;
      this.supportingText = "";
      this.textDirection = "";
      this.rows = 2;
      this.cols = 20;
      this.inputMode = "";
      this.max = "";
      this.maxLength = -1;
      this.min = "";
      this.minLength = -1;
      this.noSpinner = false;
      this.pattern = "";
      this.placeholder = "";
      this.readOnly = false;
      this.multiple = false;
      this.step = "";
      this.type = "text";
      this.autocomplete = "";
      this.dirty = false;
      this.focused = false;
      this.nativeError = false;
      this.nativeErrorText = "";
    }
    /**
     * Gets or sets the direction in which selection occurred.
     */
    get selectionDirection() {
      return this.getInputOrTextarea().selectionDirection;
    }
    set selectionDirection(value) {
      this.getInputOrTextarea().selectionDirection = value;
    }
    /**
     * Gets or sets the end position or offset of a text selection.
     */
    get selectionEnd() {
      return this.getInputOrTextarea().selectionEnd;
    }
    set selectionEnd(value) {
      this.getInputOrTextarea().selectionEnd = value;
    }
    /**
     * Gets or sets the starting position or offset of a text selection.
     */
    get selectionStart() {
      return this.getInputOrTextarea().selectionStart;
    }
    set selectionStart(value) {
      this.getInputOrTextarea().selectionStart = value;
    }
    /**
     * The text field's value as a number.
     */
    get valueAsNumber() {
      const input = this.getInput();
      if (!input) {
        return NaN;
      }
      return input.valueAsNumber;
    }
    set valueAsNumber(value) {
      const input = this.getInput();
      if (!input) {
        return;
      }
      input.valueAsNumber = value;
      this.value = input.value;
    }
    /**
     * The text field's value as a Date.
     */
    get valueAsDate() {
      const input = this.getInput();
      if (!input) {
        return null;
      }
      return input.valueAsDate;
    }
    set valueAsDate(value) {
      const input = this.getInput();
      if (!input) {
        return;
      }
      input.valueAsDate = value;
      this.value = input.value;
    }
    get hasError() {
      return this.error || this.nativeError;
    }
    /**
     * Selects all the text in the text field.
     *
     * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select
     */
    select() {
      this.getInputOrTextarea().select();
    }
    setRangeText(...args) {
      this.getInputOrTextarea().setRangeText(...args);
      this.value = this.getInputOrTextarea().value;
    }
    /**
     * Sets the start and end positions of a selection in the text field.
     *
     * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setSelectionRange
     *
     * @param start The offset into the text field for the start of the selection.
     * @param end The offset into the text field for the end of the selection.
     * @param direction The direction in which the selection is performed.
     */
    setSelectionRange(start, end, direction) {
      this.getInputOrTextarea().setSelectionRange(start, end, direction);
    }
    /**
     * Shows the browser picker for an input element of type "date", "time", etc.
     *
     * For a full list of supported types, see:
     * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/showPicker#browser_compatibility
     *
     * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/showPicker
     */
    showPicker() {
      const input = this.getInput();
      if (!input) {
        return;
      }
      input.showPicker();
    }
    /**
     * Decrements the value of a numeric type text field by `step` or `n` `step`
     * number of times.
     *
     * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/stepDown
     *
     * @param stepDecrement The number of steps to decrement, defaults to 1.
     */
    stepDown(stepDecrement) {
      const input = this.getInput();
      if (!input) {
        return;
      }
      input.stepDown(stepDecrement);
      this.value = input.value;
    }
    /**
     * Increments the value of a numeric type text field by `step` or `n` `step`
     * number of times.
     *
     * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/stepUp
     *
     * @param stepIncrement The number of steps to increment, defaults to 1.
     */
    stepUp(stepIncrement) {
      const input = this.getInput();
      if (!input) {
        return;
      }
      input.stepUp(stepIncrement);
      this.value = input.value;
    }
    /**
     * Reset the text field to its default value.
     */
    reset() {
      this.dirty = false;
      this.value = this.getAttribute("value") ?? "";
      this.nativeError = false;
      this.nativeErrorText = "";
    }
    attributeChangedCallback(attribute, newValue, oldValue) {
      if (attribute === "value" && this.dirty) {
        return;
      }
      super.attributeChangedCallback(attribute, newValue, oldValue);
    }
    render() {
      const classes = {
        "disabled": this.disabled,
        "error": !this.disabled && this.hasError,
        "textarea": this.type === "textarea",
        "no-spinner": this.noSpinner
      };
      return T`
      <span class="text-field ${o8(classes)}">
        ${this.renderField()}
      </span>
    `;
    }
    updated(changedProperties) {
      const value = this.getInputOrTextarea().value;
      if (this.value !== value) {
        this.value = value;
      }
    }
    renderField() {
      return n7`<${this.fieldTag}
      class="field"
      count=${this.value.length}
      ?disabled=${this.disabled}
      ?error=${this.hasError}
      error-text=${this.getErrorText()}
      ?focused=${this.focused}
      ?has-end=${this.hasTrailingIcon}
      ?has-start=${this.hasLeadingIcon}
      label=${this.label}
      ?no-asterisk=${this.noAsterisk}
      max=${this.maxLength}
      ?populated=${!!this.value}
      ?required=${this.required}
      ?resizable=${this.type === "textarea"}
      supporting-text=${this.supportingText}
    >
      ${this.renderLeadingIcon()}
      ${this.renderInputOrTextarea()}
      ${this.renderTrailingIcon()}
      <div id="description" slot="aria-describedby"></div>
      <slot name="container" slot="container"></slot>
    </${this.fieldTag}>`;
    }
    renderLeadingIcon() {
      return T`
      <span class="icon leading" slot="start">
        <slot name="leading-icon" @slotchange=${this.handleIconChange}></slot>
      </span>
    `;
    }
    renderTrailingIcon() {
      return T`
      <span class="icon trailing" slot="end">
        <slot name="trailing-icon" @slotchange=${this.handleIconChange}></slot>
      </span>
    `;
    }
    renderInputOrTextarea() {
      const style = { "direction": this.textDirection };
      const ariaLabel = this.ariaLabel || this.label || A;
      const autocomplete = this.autocomplete;
      const hasMaxLength = (this.maxLength ?? -1) > -1;
      const hasMinLength = (this.minLength ?? -1) > -1;
      if (this.type === "textarea") {
        return T`
        <textarea
          class="input"
          style=${o9(style)}
          aria-describedby="description"
          aria-invalid=${this.hasError}
          aria-label=${ariaLabel}
          autocomplete=${autocomplete || A}
          name=${this.name || A}
          ?disabled=${this.disabled}
          maxlength=${hasMaxLength ? this.maxLength : A}
          minlength=${hasMinLength ? this.minLength : A}
          placeholder=${this.placeholder || A}
          ?readonly=${this.readOnly}
          ?required=${this.required}
          rows=${this.rows}
          cols=${this.cols}
          .value=${l7(this.value)}
          @change=${this.redispatchEvent}
          @focus=${this.handleFocusChange}
          @blur=${this.handleFocusChange}
          @input=${this.handleInput}
          @select=${this.redispatchEvent}></textarea>
      `;
      }
      const prefix = this.renderPrefix();
      const suffix = this.renderSuffix();
      const inputMode = this.inputMode;
      return T`
      <div class="input-wrapper">
        ${prefix}
        <input
          class="input"
          style=${o9(style)}
          aria-describedby="description"
          aria-invalid=${this.hasError}
          aria-label=${ariaLabel}
          autocomplete=${autocomplete || A}
          name=${this.name || A}
          ?disabled=${this.disabled}
          inputmode=${inputMode || A}
          max=${this.max || A}
          maxlength=${hasMaxLength ? this.maxLength : A}
          min=${this.min || A}
          minlength=${hasMinLength ? this.minLength : A}
          pattern=${this.pattern || A}
          placeholder=${this.placeholder || A}
          ?readonly=${this.readOnly}
          ?required=${this.required}
          ?multiple=${this.multiple}
          step=${this.step || A}
          type=${this.type}
          .value=${l7(this.value)}
          @change=${this.redispatchEvent}
          @focus=${this.handleFocusChange}
          @blur=${this.handleFocusChange}
          @input=${this.handleInput}
          @select=${this.redispatchEvent} />
        ${suffix}
      </div>
    `;
    }
    renderPrefix() {
      return this.renderAffix(
        this.prefixText,
        /* isSuffix */
        false
      );
    }
    renderSuffix() {
      return this.renderAffix(
        this.suffixText,
        /* isSuffix */
        true
      );
    }
    renderAffix(text, isSuffix) {
      if (!text) {
        return A;
      }
      const classes = {
        "suffix": isSuffix,
        "prefix": !isSuffix
      };
      return T`<span class="${o8(classes)}">${text}</span>`;
    }
    getErrorText() {
      return this.error ? this.errorText : this.nativeErrorText;
    }
    handleFocusChange() {
      this.focused = this.inputOrTextarea?.matches(":focus") ?? false;
    }
    handleInput(event) {
      this.dirty = true;
      this.value = event.target.value;
    }
    redispatchEvent(event) {
      redispatchEvent(this, event);
    }
    getInputOrTextarea() {
      if (!this.inputOrTextarea) {
        this.connectedCallback();
        this.scheduleUpdate();
      }
      if (this.isUpdatePending) {
        this.scheduleUpdate();
      }
      return this.inputOrTextarea;
    }
    getInput() {
      if (this.type === "textarea") {
        return null;
      }
      return this.getInputOrTextarea();
    }
    handleIconChange() {
      this.hasLeadingIcon = this.leadingIcons.length > 0;
      this.hasTrailingIcon = this.trailingIcons.length > 0;
    }
    [getFormValue]() {
      return this.value;
    }
    formResetCallback() {
      this.reset();
    }
    formStateRestoreCallback(state) {
      this.value = state;
    }
    focus() {
      this.getInputOrTextarea().focus();
    }
    [createValidator]() {
      return new TextFieldValidator(() => ({
        state: this,
        renderedControl: this.inputOrTextarea
      }));
    }
    [getValidityAnchor]() {
      return this.inputOrTextarea;
    }
    [onReportValidity](invalidEvent) {
      invalidEvent?.preventDefault();
      const prevMessage = this.getErrorText();
      this.nativeError = !!invalidEvent;
      this.nativeErrorText = this.validationMessage;
      if (prevMessage === this.getErrorText()) {
        this.field?.reannounceError();
      }
    }
  };
  TextField.shadowRootOptions = {
    ...s3.shadowRootOptions,
    delegatesFocus: true
  };
  __decorate([
    n({ type: Boolean, reflect: true })
  ], TextField.prototype, "error", void 0);
  __decorate([
    n({ attribute: "error-text" })
  ], TextField.prototype, "errorText", void 0);
  __decorate([
    n()
  ], TextField.prototype, "label", void 0);
  __decorate([
    n({ type: Boolean, attribute: "no-asterisk" })
  ], TextField.prototype, "noAsterisk", void 0);
  __decorate([
    n({ type: Boolean, reflect: true })
  ], TextField.prototype, "required", void 0);
  __decorate([
    n()
  ], TextField.prototype, "value", void 0);
  __decorate([
    n({ attribute: "prefix-text" })
  ], TextField.prototype, "prefixText", void 0);
  __decorate([
    n({ attribute: "suffix-text" })
  ], TextField.prototype, "suffixText", void 0);
  __decorate([
    n({ type: Boolean, attribute: "has-leading-icon" })
  ], TextField.prototype, "hasLeadingIcon", void 0);
  __decorate([
    n({ type: Boolean, attribute: "has-trailing-icon" })
  ], TextField.prototype, "hasTrailingIcon", void 0);
  __decorate([
    n({ attribute: "supporting-text" })
  ], TextField.prototype, "supportingText", void 0);
  __decorate([
    n({ attribute: "text-direction" })
  ], TextField.prototype, "textDirection", void 0);
  __decorate([
    n({ type: Number })
  ], TextField.prototype, "rows", void 0);
  __decorate([
    n({ type: Number })
  ], TextField.prototype, "cols", void 0);
  __decorate([
    n({ reflect: true })
  ], TextField.prototype, "inputMode", void 0);
  __decorate([
    n()
  ], TextField.prototype, "max", void 0);
  __decorate([
    n({ type: Number })
  ], TextField.prototype, "maxLength", void 0);
  __decorate([
    n()
  ], TextField.prototype, "min", void 0);
  __decorate([
    n({ type: Number })
  ], TextField.prototype, "minLength", void 0);
  __decorate([
    n({ type: Boolean, attribute: "no-spinner" })
  ], TextField.prototype, "noSpinner", void 0);
  __decorate([
    n()
  ], TextField.prototype, "pattern", void 0);
  __decorate([
    n({ reflect: true, converter: stringConverter })
  ], TextField.prototype, "placeholder", void 0);
  __decorate([
    n({ type: Boolean, reflect: true })
  ], TextField.prototype, "readOnly", void 0);
  __decorate([
    n({ type: Boolean, reflect: true })
  ], TextField.prototype, "multiple", void 0);
  __decorate([
    n()
  ], TextField.prototype, "step", void 0);
  __decorate([
    n({ reflect: true })
  ], TextField.prototype, "type", void 0);
  __decorate([
    n({ reflect: true })
  ], TextField.prototype, "autocomplete", void 0);
  __decorate([
    t()
  ], TextField.prototype, "dirty", void 0);
  __decorate([
    t()
  ], TextField.prototype, "focused", void 0);
  __decorate([
    t()
  ], TextField.prototype, "nativeError", void 0);
  __decorate([
    t()
  ], TextField.prototype, "nativeErrorText", void 0);
  __decorate([
    i2(".input")
  ], TextField.prototype, "inputOrTextarea", void 0);
  __decorate([
    i2(".field")
  ], TextField.prototype, "field", void 0);
  __decorate([
    e5({ slot: "leading-icon" })
  ], TextField.prototype, "leadingIcons", void 0);
  __decorate([
    e5({ slot: "trailing-icon" })
  ], TextField.prototype, "trailingIcons", void 0);

  // ../textfield/internal/filled-text-field.js
  var FilledTextField = class extends TextField {
    constructor() {
      super(...arguments);
      this.fieldTag = i6`md-filled-field`;
    }
  };

  // ../textfield/internal/shared-styles.cssresult.js
  var styles56 = i3`:host{display:inline-flex;outline:none;resize:both;text-align:start;-webkit-tap-highlight-color:rgba(0,0,0,0)}.text-field,.field{width:100%}.text-field{display:inline-flex}.field{cursor:text}.disabled .field{cursor:default}.text-field,.textarea .field{resize:inherit}slot[name=container]{border-radius:inherit}.icon{color:currentColor;display:flex;align-items:center;justify-content:center;fill:currentColor;position:relative}.icon ::slotted(*){display:flex;position:absolute}[has-start] .icon.leading{font-size:var(--_leading-icon-size);height:var(--_leading-icon-size);width:var(--_leading-icon-size)}[has-end] .icon.trailing{font-size:var(--_trailing-icon-size);height:var(--_trailing-icon-size);width:var(--_trailing-icon-size)}.input-wrapper{display:flex}.input-wrapper>*{all:inherit;padding:0}.input{caret-color:var(--_caret-color);overflow-x:hidden;text-align:inherit}.input::placeholder{color:currentColor;opacity:1}.input::-webkit-calendar-picker-indicator{display:none}.input::-webkit-search-decoration,.input::-webkit-search-cancel-button{display:none}@media(forced-colors: active){.input{background:none}}.no-spinner .input::-webkit-inner-spin-button,.no-spinner .input::-webkit-outer-spin-button{display:none}.no-spinner .input[type=number]{-moz-appearance:textfield}:focus-within .input{caret-color:var(--_focus-caret-color)}.error:focus-within .input{caret-color:var(--_error-focus-caret-color)}.text-field:not(.disabled) .prefix{color:var(--_input-text-prefix-color)}.text-field:not(.disabled) .suffix{color:var(--_input-text-suffix-color)}.text-field:not(.disabled) .input::placeholder{color:var(--_input-text-placeholder-color)}.prefix,.suffix{text-wrap:nowrap;width:min-content}.prefix{padding-inline-end:var(--_input-text-prefix-trailing-space)}.suffix{padding-inline-start:var(--_input-text-suffix-leading-space)}
`;
  var shared_styles_cssresult_default7 = styles56.styleSheet;

  // ../textfield/filled-text-field.js
  var MdFilledTextField = class MdFilledTextField2 extends FilledTextField {
    constructor() {
      super(...arguments);
      this.fieldTag = i6`md-filled-field`;
    }
  };
  MdFilledTextField.styles = [styles56, styles55];
  MdFilledTextField = __decorate([
    e("md-filled-text-field")
  ], MdFilledTextField);

  // ../textfield/internal/outlined-styles.cssresult.js
  var styles57 = i3`:host{--_caret-color: var(--md-outlined-text-field-caret-color, var(--md-sys-color-primary, #6750a4));--_disabled-input-text-color: var(--md-outlined-text-field-disabled-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-input-text-opacity: var(--md-outlined-text-field-disabled-input-text-opacity, 0.38);--_disabled-label-text-color: var(--md-outlined-text-field-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-outlined-text-field-disabled-label-text-opacity, 0.38);--_disabled-leading-icon-color: var(--md-outlined-text-field-disabled-leading-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-leading-icon-opacity: var(--md-outlined-text-field-disabled-leading-icon-opacity, 0.38);--_disabled-outline-color: var(--md-outlined-text-field-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-opacity: var(--md-outlined-text-field-disabled-outline-opacity, 0.12);--_disabled-outline-width: var(--md-outlined-text-field-disabled-outline-width, 1px);--_disabled-supporting-text-color: var(--md-outlined-text-field-disabled-supporting-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-supporting-text-opacity: var(--md-outlined-text-field-disabled-supporting-text-opacity, 0.38);--_disabled-trailing-icon-color: var(--md-outlined-text-field-disabled-trailing-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-trailing-icon-opacity: var(--md-outlined-text-field-disabled-trailing-icon-opacity, 0.38);--_error-focus-caret-color: var(--md-outlined-text-field-error-focus-caret-color, var(--md-sys-color-error, #b3261e));--_error-focus-input-text-color: var(--md-outlined-text-field-error-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_error-focus-label-text-color: var(--md-outlined-text-field-error-focus-label-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-leading-icon-color: var(--md-outlined-text-field-error-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-focus-outline-color: var(--md-outlined-text-field-error-focus-outline-color, var(--md-sys-color-error, #b3261e));--_error-focus-supporting-text-color: var(--md-outlined-text-field-error-focus-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-trailing-icon-color: var(--md-outlined-text-field-error-focus-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_error-hover-input-text-color: var(--md-outlined-text-field-error-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_error-hover-label-text-color: var(--md-outlined-text-field-error-hover-label-text-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-leading-icon-color: var(--md-outlined-text-field-error-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-hover-outline-color: var(--md-outlined-text-field-error-hover-outline-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-supporting-text-color: var(--md-outlined-text-field-error-hover-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-hover-trailing-icon-color: var(--md-outlined-text-field-error-hover-trailing-icon-color, var(--md-sys-color-on-error-container, #410e0b));--_error-input-text-color: var(--md-outlined-text-field-error-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_error-label-text-color: var(--md-outlined-text-field-error-label-text-color, var(--md-sys-color-error, #b3261e));--_error-leading-icon-color: var(--md-outlined-text-field-error-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-outline-color: var(--md-outlined-text-field-error-outline-color, var(--md-sys-color-error, #b3261e));--_error-supporting-text-color: var(--md-outlined-text-field-error-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-trailing-icon-color: var(--md-outlined-text-field-error-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_focus-input-text-color: var(--md-outlined-text-field-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_focus-label-text-color: var(--md-outlined-text-field-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_focus-leading-icon-color: var(--md-outlined-text-field-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-outline-color: var(--md-outlined-text-field-focus-outline-color, var(--md-sys-color-primary, #6750a4));--_focus-outline-width: var(--md-outlined-text-field-focus-outline-width, 3px);--_focus-supporting-text-color: var(--md-outlined-text-field-focus-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-trailing-icon-color: var(--md-outlined-text-field-focus-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-input-text-color: var(--md-outlined-text-field-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-label-text-color: var(--md-outlined-text-field-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-leading-icon-color: var(--md-outlined-text-field-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-outline-color: var(--md-outlined-text-field-hover-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-outline-width: var(--md-outlined-text-field-hover-outline-width, 1px);--_hover-supporting-text-color: var(--md-outlined-text-field-hover-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-trailing-icon-color: var(--md-outlined-text-field-hover-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-color: var(--md-outlined-text-field-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_input-text-font: var(--md-outlined-text-field-input-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_input-text-line-height: var(--md-outlined-text-field-input-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_input-text-placeholder-color: var(--md-outlined-text-field-input-text-placeholder-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-prefix-color: var(--md-outlined-text-field-input-text-prefix-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-size: var(--md-outlined-text-field-input-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_input-text-suffix-color: var(--md-outlined-text-field-input-text-suffix-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-weight: var(--md-outlined-text-field-input-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_label-text-color: var(--md-outlined-text-field-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-font: var(--md-outlined-text-field-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-outlined-text-field-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_label-text-populated-line-height: var(--md-outlined-text-field-label-text-populated-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_label-text-populated-size: var(--md-outlined-text-field-label-text-populated-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_label-text-size: var(--md-outlined-text-field-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_label-text-weight: var(--md-outlined-text-field-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_leading-icon-color: var(--md-outlined-text-field-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_leading-icon-size: var(--md-outlined-text-field-leading-icon-size, 24px);--_outline-color: var(--md-outlined-text-field-outline-color, var(--md-sys-color-outline, #79747e));--_outline-width: var(--md-outlined-text-field-outline-width, 1px);--_supporting-text-color: var(--md-outlined-text-field-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_supporting-text-font: var(--md-outlined-text-field-supporting-text-font, var(--md-sys-typescale-body-small-font, var(--md-ref-typeface-plain, Roboto)));--_supporting-text-line-height: var(--md-outlined-text-field-supporting-text-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_supporting-text-size: var(--md-outlined-text-field-supporting-text-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_supporting-text-weight: var(--md-outlined-text-field-supporting-text-weight, var(--md-sys-typescale-body-small-weight, var(--md-ref-typeface-weight-regular, 400)));--_trailing-icon-color: var(--md-outlined-text-field-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_trailing-icon-size: var(--md-outlined-text-field-trailing-icon-size, 24px);--_container-shape-start-start: var(--md-outlined-text-field-container-shape-start-start, var(--md-outlined-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-start-end: var(--md-outlined-text-field-container-shape-start-end, var(--md-outlined-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-end-end: var(--md-outlined-text-field-container-shape-end-end, var(--md-outlined-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-end-start: var(--md-outlined-text-field-container-shape-end-start, var(--md-outlined-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_icon-input-space: var(--md-outlined-text-field-icon-input-space, 16px);--_leading-space: var(--md-outlined-text-field-leading-space, 16px);--_trailing-space: var(--md-outlined-text-field-trailing-space, 16px);--_top-space: var(--md-outlined-text-field-top-space, 16px);--_bottom-space: var(--md-outlined-text-field-bottom-space, 16px);--_input-text-prefix-trailing-space: var(--md-outlined-text-field-input-text-prefix-trailing-space, 2px);--_input-text-suffix-leading-space: var(--md-outlined-text-field-input-text-suffix-leading-space, 2px);--_focus-caret-color: var(--md-outlined-text-field-focus-caret-color, var(--md-sys-color-primary, #6750a4));--_with-leading-icon-leading-space: var(--md-outlined-text-field-with-leading-icon-leading-space, 12px);--_with-trailing-icon-trailing-space: var(--md-outlined-text-field-with-trailing-icon-trailing-space, 12px);--md-outlined-field-bottom-space: var(--_bottom-space);--md-outlined-field-container-shape-end-end: var(--_container-shape-end-end);--md-outlined-field-container-shape-end-start: var(--_container-shape-end-start);--md-outlined-field-container-shape-start-end: var(--_container-shape-start-end);--md-outlined-field-container-shape-start-start: var(--_container-shape-start-start);--md-outlined-field-content-color: var(--_input-text-color);--md-outlined-field-content-font: var(--_input-text-font);--md-outlined-field-content-line-height: var(--_input-text-line-height);--md-outlined-field-content-size: var(--_input-text-size);--md-outlined-field-content-space: var(--_icon-input-space);--md-outlined-field-content-weight: var(--_input-text-weight);--md-outlined-field-disabled-content-color: var(--_disabled-input-text-color);--md-outlined-field-disabled-content-opacity: var(--_disabled-input-text-opacity);--md-outlined-field-disabled-label-text-color: var(--_disabled-label-text-color);--md-outlined-field-disabled-label-text-opacity: var(--_disabled-label-text-opacity);--md-outlined-field-disabled-leading-content-color: var(--_disabled-leading-icon-color);--md-outlined-field-disabled-leading-content-opacity: var(--_disabled-leading-icon-opacity);--md-outlined-field-disabled-outline-color: var(--_disabled-outline-color);--md-outlined-field-disabled-outline-opacity: var(--_disabled-outline-opacity);--md-outlined-field-disabled-outline-width: var(--_disabled-outline-width);--md-outlined-field-disabled-supporting-text-color: var(--_disabled-supporting-text-color);--md-outlined-field-disabled-supporting-text-opacity: var(--_disabled-supporting-text-opacity);--md-outlined-field-disabled-trailing-content-color: var(--_disabled-trailing-icon-color);--md-outlined-field-disabled-trailing-content-opacity: var(--_disabled-trailing-icon-opacity);--md-outlined-field-error-content-color: var(--_error-input-text-color);--md-outlined-field-error-focus-content-color: var(--_error-focus-input-text-color);--md-outlined-field-error-focus-label-text-color: var(--_error-focus-label-text-color);--md-outlined-field-error-focus-leading-content-color: var(--_error-focus-leading-icon-color);--md-outlined-field-error-focus-outline-color: var(--_error-focus-outline-color);--md-outlined-field-error-focus-supporting-text-color: var(--_error-focus-supporting-text-color);--md-outlined-field-error-focus-trailing-content-color: var(--_error-focus-trailing-icon-color);--md-outlined-field-error-hover-content-color: var(--_error-hover-input-text-color);--md-outlined-field-error-hover-label-text-color: var(--_error-hover-label-text-color);--md-outlined-field-error-hover-leading-content-color: var(--_error-hover-leading-icon-color);--md-outlined-field-error-hover-outline-color: var(--_error-hover-outline-color);--md-outlined-field-error-hover-supporting-text-color: var(--_error-hover-supporting-text-color);--md-outlined-field-error-hover-trailing-content-color: var(--_error-hover-trailing-icon-color);--md-outlined-field-error-label-text-color: var(--_error-label-text-color);--md-outlined-field-error-leading-content-color: var(--_error-leading-icon-color);--md-outlined-field-error-outline-color: var(--_error-outline-color);--md-outlined-field-error-supporting-text-color: var(--_error-supporting-text-color);--md-outlined-field-error-trailing-content-color: var(--_error-trailing-icon-color);--md-outlined-field-focus-content-color: var(--_focus-input-text-color);--md-outlined-field-focus-label-text-color: var(--_focus-label-text-color);--md-outlined-field-focus-leading-content-color: var(--_focus-leading-icon-color);--md-outlined-field-focus-outline-color: var(--_focus-outline-color);--md-outlined-field-focus-outline-width: var(--_focus-outline-width);--md-outlined-field-focus-supporting-text-color: var(--_focus-supporting-text-color);--md-outlined-field-focus-trailing-content-color: var(--_focus-trailing-icon-color);--md-outlined-field-hover-content-color: var(--_hover-input-text-color);--md-outlined-field-hover-label-text-color: var(--_hover-label-text-color);--md-outlined-field-hover-leading-content-color: var(--_hover-leading-icon-color);--md-outlined-field-hover-outline-color: var(--_hover-outline-color);--md-outlined-field-hover-outline-width: var(--_hover-outline-width);--md-outlined-field-hover-supporting-text-color: var(--_hover-supporting-text-color);--md-outlined-field-hover-trailing-content-color: var(--_hover-trailing-icon-color);--md-outlined-field-label-text-color: var(--_label-text-color);--md-outlined-field-label-text-font: var(--_label-text-font);--md-outlined-field-label-text-line-height: var(--_label-text-line-height);--md-outlined-field-label-text-populated-line-height: var(--_label-text-populated-line-height);--md-outlined-field-label-text-populated-size: var(--_label-text-populated-size);--md-outlined-field-label-text-size: var(--_label-text-size);--md-outlined-field-label-text-weight: var(--_label-text-weight);--md-outlined-field-leading-content-color: var(--_leading-icon-color);--md-outlined-field-leading-space: var(--_leading-space);--md-outlined-field-outline-color: var(--_outline-color);--md-outlined-field-outline-width: var(--_outline-width);--md-outlined-field-supporting-text-color: var(--_supporting-text-color);--md-outlined-field-supporting-text-font: var(--_supporting-text-font);--md-outlined-field-supporting-text-line-height: var(--_supporting-text-line-height);--md-outlined-field-supporting-text-size: var(--_supporting-text-size);--md-outlined-field-supporting-text-weight: var(--_supporting-text-weight);--md-outlined-field-top-space: var(--_top-space);--md-outlined-field-trailing-content-color: var(--_trailing-icon-color);--md-outlined-field-trailing-space: var(--_trailing-space);--md-outlined-field-with-leading-content-leading-space: var(--_with-leading-icon-leading-space);--md-outlined-field-with-trailing-content-trailing-space: var(--_with-trailing-icon-trailing-space)}
`;
  var outlined_styles_cssresult_default4 = styles57.styleSheet;

  // ../textfield/internal/outlined-text-field.js
  var OutlinedTextField = class extends TextField {
    constructor() {
      super(...arguments);
      this.fieldTag = i6`md-outlined-field`;
    }
  };

  // ../textfield/outlined-text-field.js
  var MdOutlinedTextField = class MdOutlinedTextField2 extends OutlinedTextField {
    constructor() {
      super(...arguments);
      this.fieldTag = i6`md-outlined-field`;
    }
  };
  MdOutlinedTextField.styles = [styles56, styles57];
  MdOutlinedTextField = __decorate([
    e("md-outlined-text-field")
  ], MdOutlinedTextField);

  // src/components/catalog-component-header.ts
  var CatalogComponentHeader = class extends s3 {
    render() {
      return T` <div>
      <slot class="title" name="title"></slot>
      <slot class="image"></slot>
    </div>`;
    }
  };
  CatalogComponentHeader.styles = i3`
    :host {
      display: block;
      --catalog-image-border-radius: var(--catalog-shape-xl);
      container: host / inline-size;
      position: relative;
      margin-inline: auto;
    }

    slot {
      height: 100%;
    }

    slot,
    .image::slotted(*) {
      display: flex;
      align-items: start;
      margin: 0;
    }

    .end slot,
    .end .image::slotted(*) {
      align-items: end;
    }

    .center slot,
    .center .image::slotted(*) {
      align-items: center;
    }

    .image {
      /* Color needs to differ from top-app-bar and sidebar */
      background-color: var(--md-sys-color-surface-variant);
      border-radius: var(--catalog-image-border-radius);
      overflow: hidden;
      margin-block-start: 16px;
      aspect-ratio: 3 / 2;
      max-width: 100%;
    }

    ::slotted(*) {
      box-sizing: border-box;
      height: 100%;
      width: 100%;
    }

    .image::slotted(*) {
      --catalog-image-border-radius: 0px;
      --catalog-header-image-height: 100%;
      --catalog-header-image-width: auto;
      display: flex;
      justify-content: center;
    }

    /* fit ipad pro at least */
    @container (width > 1000px) {
      div {
        display: grid;
        grid-gap: 8px;
        gap: 8px;
        grid-template-columns: repeat(2, 1fr);
        grid-auto-flow: row;
      }

      .image {
        margin-block-start: 0;
        aspect-ratio: unset;
      }

      .image,
      .image::slotted(*) {
        min-height: 100%;
        max-height: 544px;
      }
    }
  `;
  CatalogComponentHeader = __decorateClass([
    e("catalog-component-header")
  ], CatalogComponentHeader);

  // src/components/catalog-component-header-title.ts
  var CatalogComponentHeaderTitle = class extends s3 {
    render() {
      return T`<slot></slot>`;
    }
  };
  CatalogComponentHeaderTitle.styles = i3`
    :host {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-radius: var(--catalog-image-border-radius);
      padding: 56px;
      /* It has no border so we need it to be a different color from the top app
       * bar and nav drawer.
       */
      background-color: var(--md-sys-color-surface-variant);
      color: var(--md-sys-color-on-surface-variant);
    }

    slot::slotted(h1) {
      margin-block-end: 8px;
      font-weight: 475;
    }

    slot::slotted(p) {
      font-size: var(--catalog-title-l-font-size);
    }

    slot::slotted(*) {
      margin-block-start: 0;
    }

    slot::slotted(*:last-child) {
      margin-block-end: 0;
    }

    @media screen and (max-width: 600px) {
      :host {
        padding: 32px;
      }
    }
  `;
  CatalogComponentHeaderTitle = __decorateClass([
    e("catalog-component-header-title")
  ], CatalogComponentHeaderTitle);

  // ../node_modules/lit-html/node/async-directive.js
  var s6 = (i10, t7) => {
    var e13, o11;
    const r8 = i10._$AN;
    if (void 0 === r8) return false;
    for (const i11 of r8) null === (o11 = (e13 = i11)._$AO) || void 0 === o11 || o11.call(e13, t7, false), s6(i11, t7);
    return true;
  };
  var o10 = (i10) => {
    let t7, e13;
    do {
      if (void 0 === (t7 = i10._$AM)) break;
      e13 = t7._$AN, e13.delete(i10), i10 = t7;
    } while (0 === (null == e13 ? void 0 : e13.size));
  };
  var r4 = (i10) => {
    for (let t7; t7 = i10._$AM; i10 = t7) {
      let e13 = t7._$AN;
      if (void 0 === e13) t7._$AN = e13 = /* @__PURE__ */ new Set();
      else if (e13.has(i10)) break;
      e13.add(i10), l8(t7);
    }
  };
  function n10(i10) {
    void 0 !== this._$AN ? (o10(this), this._$AM = i10, r4(this)) : this._$AM = i10;
  }
  function h3(i10, t7 = false, e13 = 0) {
    const r8 = this._$AH, n13 = this._$AN;
    if (void 0 !== n13 && 0 !== n13.size) if (t7) if (Array.isArray(r8)) for (let i11 = e13; i11 < r8.length; i11++) s6(r8[i11], false), o10(r8[i11]);
    else null != r8 && (s6(r8, false), o10(r8));
    else s6(this, i10);
  }
  var l8 = (i10) => {
    var t7, s8, o11, r8;
    i10.type == t4.CHILD && (null !== (t7 = (o11 = i10)._$AP) && void 0 !== t7 || (o11._$AP = h3), null !== (s8 = (r8 = i10)._$AQ) && void 0 !== s8 || (r8._$AQ = n10));
  };
  var c4 = class extends i5 {
    constructor() {
      super(...arguments), this._$AN = void 0;
    }
    _$AT(i10, t7, e13) {
      super._$AT(i10, t7, e13), r4(this), this.isConnected = i10._$AU;
    }
    _$AO(i10, t7 = true) {
      var e13, r8;
      i10 !== this.isConnected && (this.isConnected = i10, i10 ? null === (e13 = this.reconnected) || void 0 === e13 || e13.call(this) : null === (r8 = this.disconnected) || void 0 === r8 || r8.call(this)), t7 && (s6(this, i10), o10(this));
    }
    setValue(t7) {
      if (e10(this._$Ct)) this._$Ct._$AI(t7, this);
      else {
        const i10 = [...this._$Ct._$AH];
        i10[this._$Ci] = t7, this._$Ct._$AI(i10, this, 0);
      }
    }
    disconnected() {
    }
    reconnected() {
    }
  };

  // ../node_modules/@lit-labs/motion/animate-controller.js
  var i8 = /* @__PURE__ */ new WeakMap();

  // ../node_modules/@lit-labs/motion/animate.js
  var h4 = 0;
  var r5 = /* @__PURE__ */ new Map();
  var n11 = /* @__PURE__ */ new WeakSet();
  var a5 = () => new Promise(((t7) => requestAnimationFrame(t7)));
  var f2 = [{ opacity: 0 }];
  var p3 = [{ opacity: 0 }, { opacity: 1 }];
  var g2 = (t7, i10) => {
    const s8 = t7 - i10;
    return 0 === s8 ? void 0 : s8;
  };
  var w2 = (t7, i10) => {
    const s8 = t7 / i10;
    return 1 === s8 ? void 0 : s8;
  };
  var A2 = { left: (t7, i10) => {
    const s8 = g2(t7, i10);
    return { value: s8, transform: s8 && `translateX(${s8}px)` };
  }, top: (t7, i10) => {
    const s8 = g2(t7, i10);
    return { value: s8, transform: s8 && `translateY(${s8}px)` };
  }, width: (t7, i10) => {
    const s8 = w2(t7, i10);
    return { value: s8, transform: s8 && `scaleX(${s8})` };
  }, height: (t7, i10) => {
    const s8 = w2(t7, i10);
    return { value: s8, transform: s8 && `scaleY(${s8})` };
  } };
  var b2 = { duration: 333, easing: "ease-in-out" };
  var j2 = ["left", "top", "width", "height", "opacity", "color", "background"];
  var x2 = /* @__PURE__ */ new WeakMap();
  var S3 = class extends c4 {
    constructor(t7) {
      if (super(t7), this.t = null, this.i = null, this.o = true, this.shouldLog = false, t7.type === t4.CHILD) throw Error("The `animate` directive must be used in attribute position.");
      this.createFinished();
    }
    createFinished() {
      var t7;
      null === (t7 = this.resolveFinished) || void 0 === t7 || t7.call(this), this.finished = new Promise(((t8) => {
        this.h = t8;
      }));
    }
    async resolveFinished() {
      var t7;
      null === (t7 = this.h) || void 0 === t7 || t7.call(this), this.h = void 0;
    }
    render(i10) {
      return A;
    }
    getController() {
      return i8.get(this.l);
    }
    isDisabled() {
      var t7;
      return this.options.disabled || (null === (t7 = this.getController()) || void 0 === t7 ? void 0 : t7.disabled);
    }
    update(t7, [i10]) {
      var s8;
      const e13 = void 0 === this.l;
      return e13 && (this.l = null === (s8 = t7.options) || void 0 === s8 ? void 0 : s8.host, this.l.addController(this), this.element = t7.element, x2.set(this.element, this)), this.optionsOrCallback = i10, (e13 || "function" != typeof i10) && this.u(i10), this.render(i10);
    }
    u(t7) {
      var i10, s8;
      t7 = null != t7 ? t7 : {};
      const e13 = this.getController();
      void 0 !== e13 && ((t7 = { ...e13.defaultOptions, ...t7 }).keyframeOptions = { ...e13.defaultOptions.keyframeOptions, ...t7.keyframeOptions }), null !== (i10 = (s8 = t7).properties) && void 0 !== i10 || (s8.properties = j2), this.options = t7;
    }
    v() {
      const t7 = {}, i10 = this.element.getBoundingClientRect(), s8 = getComputedStyle(this.element);
      return this.options.properties.forEach(((e13) => {
        var o11;
        const h7 = null !== (o11 = i10[e13]) && void 0 !== o11 ? o11 : A2[e13] ? void 0 : s8[e13], r8 = Number(h7);
        t7[e13] = isNaN(r8) ? h7 + "" : r8;
      })), t7;
    }
    p() {
      let t7, i10 = true;
      return this.options.guard && (t7 = this.options.guard(), i10 = ((t8, i11) => {
        if (Array.isArray(t8)) {
          if (Array.isArray(i11) && i11.length === t8.length && t8.every(((t9, s8) => t9 === i11[s8]))) return false;
        } else if (i11 === t8) return false;
        return true;
      })(t7, this.m)), this.o = this.l.hasUpdated && !this.isDisabled() && !this.isAnimating() && i10 && this.element.isConnected, this.o && (this.m = Array.isArray(t7) ? Array.from(t7) : t7), this.o;
    }
    hostUpdate() {
      var t7;
      "function" == typeof this.optionsOrCallback && this.u(this.optionsOrCallback()), this.p() && (this.g = this.v(), this.t = null !== (t7 = this.t) && void 0 !== t7 ? t7 : this.element.parentNode, this.i = this.element.nextSibling);
    }
    async hostUpdated() {
      if (!this.o || !this.element.isConnected || this.options.skipInitial && !this.isHostRendered) return;
      let t7;
      this.prepare(), await a5;
      const i10 = this._(), s8 = this.A(this.options.keyframeOptions, i10), e13 = this.v();
      if (void 0 !== this.g) {
        const { from: s9, to: o11 } = this.O(this.g, e13, i10);
        this.log("measured", [this.g, e13, s9, o11]), t7 = this.calculateKeyframes(s9, o11);
      } else {
        const s9 = r5.get(this.options.inId);
        if (s9) {
          r5.delete(this.options.inId);
          const { from: o11, to: n13 } = this.O(s9, e13, i10);
          t7 = this.calculateKeyframes(o11, n13), t7 = this.options.in ? [{ ...this.options.in[0], ...t7[0] }, ...this.options.in.slice(1), t7[1]] : t7, h4++, t7.forEach(((t8) => t8.zIndex = h4));
        } else this.options.in && (t7 = [...this.options.in, {}]);
      }
      this.animate(t7, s8);
    }
    resetStyles() {
      var t7;
      void 0 !== this.P && (this.element.setAttribute("style", null !== (t7 = this.P) && void 0 !== t7 ? t7 : ""), this.P = void 0);
    }
    commitStyles() {
      var t7, i10;
      this.P = this.element.getAttribute("style"), null === (t7 = this.webAnimation) || void 0 === t7 || t7.commitStyles(), null === (i10 = this.webAnimation) || void 0 === i10 || i10.cancel();
    }
    reconnected() {
    }
    async disconnected() {
      var t7;
      if (!this.o) return;
      if (void 0 !== this.options.id && r5.set(this.options.id, this.g), void 0 === this.options.out) return;
      if (this.prepare(), await a5(), null === (t7 = this.t) || void 0 === t7 ? void 0 : t7.isConnected) {
        const t8 = this.i && this.i.parentNode === this.t ? this.i : null;
        if (this.t.insertBefore(this.element, t8), this.options.stabilizeOut) {
          const t9 = this.v();
          this.log("stabilizing out");
          const i11 = this.g.left - t9.left, s8 = this.g.top - t9.top;
          !("static" === getComputedStyle(this.element).position) || 0 === i11 && 0 === s8 || (this.element.style.position = "relative"), 0 !== i11 && (this.element.style.left = i11 + "px"), 0 !== s8 && (this.element.style.top = s8 + "px");
        }
      }
      const i10 = this.A(this.options.keyframeOptions);
      await this.animate(this.options.out, i10), this.element.remove();
    }
    prepare() {
      this.createFinished();
    }
    start() {
      var t7, i10;
      null === (i10 = (t7 = this.options).onStart) || void 0 === i10 || i10.call(t7, this);
    }
    didFinish(t7) {
      var i10, s8;
      t7 && (null === (s8 = (i10 = this.options).onComplete) || void 0 === s8 || s8.call(i10, this)), this.g = void 0, this.animatingProperties = void 0, this.frames = void 0, this.resolveFinished();
    }
    _() {
      const t7 = [];
      for (let i10 = this.element.parentNode; i10; i10 = null == i10 ? void 0 : i10.parentNode) {
        const s8 = x2.get(i10);
        s8 && !s8.isDisabled() && s8 && t7.push(s8);
      }
      return t7;
    }
    get isHostRendered() {
      const t7 = n11.has(this.l);
      return t7 || this.l.updateComplete.then((() => {
        n11.add(this.l);
      })), t7;
    }
    A(t7, i10 = this._()) {
      const s8 = { ...b2 };
      return i10.forEach(((t8) => Object.assign(s8, t8.options.keyframeOptions))), Object.assign(s8, t7), s8;
    }
    O(t7, i10, s8) {
      t7 = { ...t7 }, i10 = { ...i10 };
      const e13 = s8.map(((t8) => t8.animatingProperties)).filter(((t8) => void 0 !== t8));
      let o11 = 1, h7 = 1;
      return void 0 !== e13 && (e13.forEach(((t8) => {
        t8.width && (o11 /= t8.width), t8.height && (h7 /= t8.height);
      })), void 0 !== t7.left && void 0 !== i10.left && (t7.left = o11 * t7.left, i10.left = o11 * i10.left), void 0 !== t7.top && void 0 !== i10.top && (t7.top = h7 * t7.top, i10.top = h7 * i10.top)), { from: t7, to: i10 };
    }
    calculateKeyframes(t7, i10, s8 = false) {
      var e13;
      const o11 = {}, h7 = {};
      let r8 = false;
      const n13 = {};
      for (const s9 in i10) {
        const a7 = t7[s9], l11 = i10[s9];
        if (s9 in A2) {
          const t8 = A2[s9];
          if (void 0 === a7 || void 0 === l11) continue;
          const i11 = t8(a7, l11);
          void 0 !== i11.transform && (n13[s9] = i11.value, r8 = true, o11.transform = `${null !== (e13 = o11.transform) && void 0 !== e13 ? e13 : ""} ${i11.transform}`);
        } else a7 !== l11 && void 0 !== a7 && void 0 !== l11 && (r8 = true, o11[s9] = a7, h7[s9] = l11);
      }
      return o11.transformOrigin = h7.transformOrigin = s8 ? "center center" : "top left", this.animatingProperties = n13, r8 ? [o11, h7] : void 0;
    }
    async animate(t7, i10 = this.options.keyframeOptions) {
      this.start(), this.frames = t7;
      let s8 = false;
      if (!this.isAnimating() && !this.isDisabled() && (this.options.onFrames && (this.frames = t7 = this.options.onFrames(this), this.log("modified frames", t7)), void 0 !== t7)) {
        this.log("animate", [t7, i10]), s8 = true, this.webAnimation = this.element.animate(t7, i10);
        const e13 = this.getController();
        null == e13 || e13.add(this);
        try {
          await this.webAnimation.finished;
        } catch (t8) {
        }
        null == e13 || e13.remove(this);
      }
      return this.didFinish(s8), s8;
    }
    isAnimating() {
      var t7, i10;
      return "running" === (null === (t7 = this.webAnimation) || void 0 === t7 ? void 0 : t7.playState) || (null === (i10 = this.webAnimation) || void 0 === i10 ? void 0 : i10.pending);
    }
    log(t7, i10) {
      this.shouldLog && !this.isDisabled() && console.log(t7, this.options.id, i10);
    }
  };
  var $2 = e8(S3);

  // ../node_modules/@lit-labs/motion/position.js
  var r6 = ["top", "right", "bottom", "left"];
  var e11 = class extends c4 {
    constructor(t7) {
      if (super(t7), t7.type !== t4.ELEMENT) throw Error("The `position` directive must be used in attribute position.");
    }
    render(i10, o11) {
      return A;
    }
    update(t7, [i10, o11]) {
      var s8;
      return void 0 === this.l && (this.l = null === (s8 = t7.options) || void 0 === s8 ? void 0 : s8.host, this.l.addController(this)), this.j = t7.element, this.S = i10, this.C = null != o11 ? o11 : ["left", "top", "width", "height"], this.render(i10, o11);
    }
    hostUpdated() {
      this.F();
    }
    F() {
      var t7, i10;
      const o11 = "function" == typeof this.S ? this.S() : null === (t7 = this.S) || void 0 === t7 ? void 0 : t7.value, s8 = o11.offsetParent;
      if (void 0 === o11 || !s8) return;
      const e13 = o11.getBoundingClientRect(), h7 = s8.getBoundingClientRect();
      null === (i10 = this.C) || void 0 === i10 || i10.forEach(((t8) => {
        const i11 = r6.includes(t8) ? e13[t8] - h7[t8] : e13[t8];
        this.j.style[t8] = i11 + "px";
      }));
    }
  };
  var h5 = e8(e11);

  // ../node_modules/@preact/signals-core/dist/signals-core.module.js
  function i9() {
    throw new Error("Cycle detected");
  }
  function t6() {
    if (!(h6 > 1)) {
      var i10, t7 = false;
      while (void 0 !== n12) {
        var o11 = n12;
        n12 = void 0;
        s7++;
        while (void 0 !== o11) {
          var r8 = o11.o;
          o11.o = void 0;
          o11.f &= -3;
          if (!(8 & o11.f) && c6(o11)) try {
            o11.c();
          } catch (o12) {
            if (!t7) {
              i10 = o12;
              t7 = true;
            }
          }
          o11 = r8;
        }
      }
      s7 = 0;
      h6--;
      if (t7) throw i10;
    } else h6--;
  }
  var r7 = void 0;
  var n12 = void 0;
  var h6 = 0;
  var s7 = 0;
  var f3 = 0;
  function v4(i10) {
    if (void 0 !== r7) {
      var t7 = i10.n;
      if (void 0 === t7 || t7.t !== r7) {
        t7 = { i: 0, S: i10, p: r7.s, n: void 0, t: r7, e: void 0, x: void 0, r: t7 };
        if (void 0 !== r7.s) r7.s.n = t7;
        r7.s = t7;
        i10.n = t7;
        if (32 & r7.f) i10.S(t7);
        return t7;
      } else if (-1 === t7.i) {
        t7.i = 0;
        if (void 0 !== t7.n) {
          t7.n.p = t7.p;
          if (void 0 !== t7.p) t7.p.n = t7.n;
          t7.p = r7.s;
          t7.n = void 0;
          r7.s.n = t7;
          r7.s = t7;
        }
        return t7;
      }
    }
  }
  function e12(i10) {
    this.v = i10;
    this.i = 0;
    this.n = void 0;
    this.t = void 0;
  }
  e12.prototype.h = function() {
    return true;
  };
  e12.prototype.S = function(i10) {
    if (this.t !== i10 && void 0 === i10.e) {
      i10.x = this.t;
      if (void 0 !== this.t) this.t.e = i10;
      this.t = i10;
    }
  };
  e12.prototype.U = function(i10) {
    if (void 0 !== this.t) {
      var t7 = i10.e, o11 = i10.x;
      if (void 0 !== t7) {
        t7.x = o11;
        i10.e = void 0;
      }
      if (void 0 !== o11) {
        o11.e = t7;
        i10.x = void 0;
      }
      if (i10 === this.t) this.t = o11;
    }
  };
  e12.prototype.subscribe = function(i10) {
    var t7 = this;
    return b3(function() {
      var o11 = t7.value, r8 = 32 & this.f;
      this.f &= -33;
      try {
        i10(o11);
      } finally {
        this.f |= r8;
      }
    });
  };
  e12.prototype.valueOf = function() {
    return this.value;
  };
  e12.prototype.toString = function() {
    return this.value + "";
  };
  e12.prototype.toJSON = function() {
    return this.value;
  };
  e12.prototype.peek = function() {
    return this.v;
  };
  Object.defineProperty(e12.prototype, "value", { get: function() {
    var i10 = v4(this);
    if (void 0 !== i10) i10.i = this.i;
    return this.v;
  }, set: function(o11) {
    if (r7 instanceof l10) !(function() {
      throw new Error("Computed cannot have side-effects");
    })();
    if (o11 !== this.v) {
      if (s7 > 100) i9();
      this.v = o11;
      this.i++;
      f3++;
      h6++;
      try {
        for (var n13 = this.t; void 0 !== n13; n13 = n13.x) n13.t.N();
      } finally {
        t6();
      }
    }
  } });
  function u5(i10) {
    return new e12(i10);
  }
  function c6(i10) {
    for (var t7 = i10.s; void 0 !== t7; t7 = t7.n) if (t7.S.i !== t7.i || !t7.S.h() || t7.S.i !== t7.i) return true;
    return false;
  }
  function d4(i10) {
    for (var t7 = i10.s; void 0 !== t7; t7 = t7.n) {
      var o11 = t7.S.n;
      if (void 0 !== o11) t7.r = o11;
      t7.S.n = t7;
      t7.i = -1;
      if (void 0 === t7.n) {
        i10.s = t7;
        break;
      }
    }
  }
  function a6(i10) {
    var t7 = i10.s, o11 = void 0;
    while (void 0 !== t7) {
      var r8 = t7.p;
      if (-1 === t7.i) {
        t7.S.U(t7);
        if (void 0 !== r8) r8.n = t7.n;
        if (void 0 !== t7.n) t7.n.p = r8;
      } else o11 = t7;
      t7.S.n = t7.r;
      if (void 0 !== t7.r) t7.r = void 0;
      t7 = r8;
    }
    i10.s = o11;
  }
  function l10(i10) {
    e12.call(this, void 0);
    this.x = i10;
    this.s = void 0;
    this.g = f3 - 1;
    this.f = 4;
  }
  (l10.prototype = new e12()).h = function() {
    this.f &= -3;
    if (1 & this.f) return false;
    if (32 == (36 & this.f)) return true;
    this.f &= -5;
    if (this.g === f3) return true;
    this.g = f3;
    this.f |= 1;
    if (this.i > 0 && !c6(this)) {
      this.f &= -2;
      return true;
    }
    var i10 = r7;
    try {
      d4(this);
      r7 = this;
      var t7 = this.x();
      if (16 & this.f || this.v !== t7 || 0 === this.i) {
        this.v = t7;
        this.f &= -17;
        this.i++;
      }
    } catch (i11) {
      this.v = i11;
      this.f |= 16;
      this.i++;
    }
    r7 = i10;
    a6(this);
    this.f &= -2;
    return true;
  };
  l10.prototype.S = function(i10) {
    if (void 0 === this.t) {
      this.f |= 36;
      for (var t7 = this.s; void 0 !== t7; t7 = t7.n) t7.S.S(t7);
    }
    e12.prototype.S.call(this, i10);
  };
  l10.prototype.U = function(i10) {
    if (void 0 !== this.t) {
      e12.prototype.U.call(this, i10);
      if (void 0 === this.t) {
        this.f &= -33;
        for (var t7 = this.s; void 0 !== t7; t7 = t7.n) t7.S.U(t7);
      }
    }
  };
  l10.prototype.N = function() {
    if (!(2 & this.f)) {
      this.f |= 6;
      for (var i10 = this.t; void 0 !== i10; i10 = i10.x) i10.t.N();
    }
  };
  l10.prototype.peek = function() {
    if (!this.h()) i9();
    if (16 & this.f) throw this.v;
    return this.v;
  };
  Object.defineProperty(l10.prototype, "value", { get: function() {
    if (1 & this.f) i9();
    var t7 = v4(this);
    this.h();
    if (void 0 !== t7) t7.i = this.i;
    if (16 & this.f) throw this.v;
    return this.v;
  } });
  function y3(i10) {
    var o11 = i10.u;
    i10.u = void 0;
    if ("function" == typeof o11) {
      h6++;
      var n13 = r7;
      r7 = void 0;
      try {
        o11();
      } catch (t7) {
        i10.f &= -2;
        i10.f |= 8;
        _2(i10);
        throw t7;
      } finally {
        r7 = n13;
        t6();
      }
    }
  }
  function _2(i10) {
    for (var t7 = i10.s; void 0 !== t7; t7 = t7.n) t7.S.U(t7);
    i10.x = void 0;
    i10.s = void 0;
    y3(i10);
  }
  function p4(i10) {
    if (r7 !== this) throw new Error("Out-of-order effect");
    a6(this);
    r7 = i10;
    this.f &= -2;
    if (8 & this.f) _2(this);
    t6();
  }
  function g3(i10) {
    this.x = i10;
    this.u = void 0;
    this.s = void 0;
    this.o = void 0;
    this.f = 32;
  }
  g3.prototype.c = function() {
    var i10 = this.S();
    try {
      if (8 & this.f) return;
      if (void 0 === this.x) return;
      var t7 = this.x();
      if ("function" == typeof t7) this.u = t7;
    } finally {
      i10();
    }
  };
  g3.prototype.S = function() {
    if (1 & this.f) i9();
    this.f |= 1;
    this.f &= -9;
    y3(this);
    d4(this);
    h6++;
    var t7 = r7;
    r7 = this;
    return p4.bind(this, t7);
  };
  g3.prototype.N = function() {
    if (!(2 & this.f)) {
      this.f |= 2;
      this.o = n12;
      n12 = this;
    }
  };
  g3.prototype.d = function() {
    this.f |= 8;
    if (!(1 & this.f)) _2(this);
  };
  function b3(i10) {
    var t7 = new g3(i10);
    try {
      t7.c();
    } catch (i11) {
      t7.d();
      throw i11;
    }
    return t7.d.bind(t7);
  }

  // src/signals/signal-element.ts
  function SignalElement(Base) {
    return class SignalElement extends Base {
      performUpdate() {
        if (!this.isUpdatePending) {
          return;
        }
        this._disposeEffect?.();
        let performingUpdate = true;
        this._disposeEffect = b3(() => {
          if (performingUpdate) {
            performingUpdate = false;
            super.performUpdate();
          } else {
            this.requestUpdate();
          }
        });
      }
    };
  }

  // src/signals/drawer-open-state.ts
  var drawerOpenSignal = u5(false);

  // src/signals/inert.ts
  var inertContentSignal = u5(false);
  var inertSidebarSignal = u5(false);

  // src/components/nav-drawer.ts
  var NavDrawer = class extends SignalElement(s3) {
    constructor() {
      super(...arguments);
      this.isCollapsible = false;
      this.hasToc = false;
      this.pageTitle = "";
      this.lastDrawerOpen = drawerOpenSignal.value;
    }
    render() {
      const showModal = this.isCollapsible && drawerOpenSignal.value;
      const drawerSlideAnimationDuration = showModal ? 500 : 150;
      const drawerContentOpacityDuration = showModal ? 300 : 150;
      const scrimOpacityDuration = 150;
      const drawerSlideAnimationEasing = showModal ? EASING.EMPHASIZED : EASING.EMPHASIZED_ACCELERATE;
      return T`
      <div class="root">
        <slot name="top-app-bar"></slot>
        <div class="body  ${drawerOpenSignal.value ? "open" : ""}">
          <div class="spacer" ?inert=${inertSidebarSignal.value}>
            ${showModal ? T`<div
                  class="scrim"
                  @click=${this.onScrimClick}
                  ${$2({
        properties: ["opacity"],
        keyframeOptions: {
          duration: scrimOpacityDuration,
          easing: "linear"
        },
        in: p3,
        out: f2
      })}></div>` : A}
            <aside
              ?inert=${this.isCollapsible && !drawerOpenSignal.value}
              ${$2({
        properties: ["transform"],
        keyframeOptions: {
          duration: drawerSlideAnimationDuration,
          easing: drawerSlideAnimationEasing
        }
      })}>
              <div class="scroll-wrapper">
                <slot
                  ${$2({
        properties: ["opacity"],
        keyframeOptions: {
          duration: drawerContentOpacityDuration,
          easing: "linear"
        }
      })}></slot>
              </div>
            </aside>
          </div>
          <div class="panes">
            ${this.renderTocPane(showModal)}${this.renderContent(showModal)}
          </div>
        </div>
      </div>
    `;
    }
    renderContent(showModal) {
      return T` <div
      class="pane content-pane"
      ?inert=${showModal || inertContentSignal.value}>
      <div class="scroll-wrapper">
        <div class="content">
          <slot name="app-content"></slot>
        </div>
      </div>
    </div>`;
    }
    renderTocPane(showModal) {
      if (!this.hasToc) {
        return A;
      }
      return T` <div
      class="pane toc"
      ?inert=${showModal || inertContentSignal.value}>
      <div class="scroll-wrapper">
        <p>On this page:</p>
        <h2>${this.pageTitle}</h2>
        <slot name="toc"></slot>
      </div>
    </div>`;
    }
    /**
     * Closes the drawer on scrim click.
     */
    onScrimClick() {
      drawerOpenSignal.value = false;
    }
    firstUpdated() {
      const queryResult = window.matchMedia("(max-width: 1500px)");
      this.isCollapsible = queryResult.matches;
      queryResult.addEventListener("change", (e13) => {
        this.isCollapsible = e13.matches;
      });
    }
    updated(changed) {
      super.updated(changed);
      if (this.lastDrawerOpen !== drawerOpenSignal.value && drawerOpenSignal.value && this.isCollapsible) {
        this.querySelector(
          'md-list.nav md-list-item[tabindex="0"]'
        )?.focus();
      }
    }
  };
  NavDrawer.styles = i3`
    :host {
      --_drawer-width: var(--catalog-drawer-width, 300px);
      /* When in wide mode inline start margin is handled by the sidebar */
      --_pane-margin-inline-start: 0px;
      --_pane-margin-inline-end: var(--catalog-spacing-l);
      --_pane-margin-block-end: var(--catalog-spacing-l);
      --_toc-pane-width: 250px;
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
    }

    ::slotted(nav) {
      list-style: none;
    }

    .body {
      display: flex;
      flex-grow: 1;
    }

    .spacer {
      position: relative;
      transition: min-width 0.5s cubic-bezier(0.3, 0, 0, 1);
    }

    .spacer,
    aside {
      min-width: var(--_drawer-width);
      max-width: var(--_drawer-width);
    }

    .pane {
      box-sizing: border-box;
      overflow: auto;
      width: 100%;
      /* Explicit height to make overflow work */
      height: calc(
        100dvh - var(--catalog-top-app-bar-height) -
          var(--_pane-margin-block-end)
      );
      background-color: var(--md-sys-color-surface);
      border-radius: var(--catalog-shape-xl);
    }

    .pane,
    .panes {
      /* emphasized – duration matching render fn for sidebar */
      transition: 0.5s cubic-bezier(0.3, 0, 0, 1);
      transition-property: margin, height, border-radius, max-width, width;
    }

    .panes {
      display: flex;
      justify-content: start;
      flex-direction: row-reverse;
      gap: var(--_pane-margin-inline-end);
      margin-inline: var(--_pane-margin-inline-start)
        var(--_pane-margin-inline-end);
      width: 100%;
      max-width: calc(
        100% - var(--_drawer-width) - var(--_pane-margin-inline-start) -
          var(--_pane-margin-inline-end)
      );
    }

    .pane.content-pane {
      flex-grow: 1;
    }

    .pane.toc {
      width: auto;
      box-sizing: border-box;
      width: var(--_toc-pane-width);
    }

    .toc .scroll-wrapper {
      padding-inline: var(--catalog-spacing-xl);
    }

    .pane.toc p {
      margin-block: 0;
      font-size: var(--catalog-label-s-font-size);
    }

    .pane.toc h2 {
      margin-block: var(--catalog-spacing-s) var(--catalog-spacing-m);
      font-size: var(--catalog-headline-s-font-size);
    }

    .content {
      flex-grow: 1;
      display: flex;
      justify-content: center;
      box-sizing: border-box;
      padding-inline: var(--catalog-spacing-xl);
      width: 100%;
    }

    .content slot {
      display: block;
      width: 100%;
      max-width: min(100%, var(--_max-width));
    }

    aside {
      transition: transform 0.5s cubic-bezier(0.3, 0, 0, 1);
      position: fixed;
      isolation: isolate;
      inset: var(--catalog-top-app-bar-height) 0 0 0;
      z-index: 12;
      background-color: var(--md-sys-color-surface-container);
      overflow: hidden;
    }

    .scroll-wrapper {
      overflow-y: auto;
      max-height: 100%;
      border-radius: inherit;
      box-sizing: border-box;
    }

    .pane .scroll-wrapper {
      padding-block: var(--catalog-spacing-xl);
    }

    aside slot {
      display: block;
    }

    .scrim {
      background-color: rgba(0, 0, 0, 0.32);
    }

    @media (max-width: 900px) {
      .pane.toc {
        display: none;
      }
    }

    @media (max-width: 1500px) {
      .spacer {
        min-width: 0px;
      }

      .panes {
        max-width: calc(
          100% - var(--_pane-margin-inline-start) -
            var(--_pane-margin-inline-end)
        );
      }

      .content {
        max-width: 100vw;
        padding-inline: var(--catalog-spacing-xl);
      }

      .scrim {
        position: fixed;
        inset: 0;
      }

      aside {
        transition: unset;
        transform: translateX(-100%);
        border-radius: 0 var(--catalog-shape-xl) var(--catalog-shape-xl) 0;
      }

      :host {
        --_pane-margin-inline-start: var(--catalog-spacing-xl);
      }

      .open aside {
        transform: translateX(0);
      }

      aside slot {
        opacity: 0;
      }

      .open aside slot {
        opacity: 1;
      }

      .open .scrim {
        inset: 0;
        z-index: 11;
      }
    }

    @media (max-width: 600px) {
      .pane {
        border-end-start-radius: 0;
        border-end-end-radius: 0;
      }

      :host {
        --_pane-margin-block-end: 0px;
        --_pane-margin-inline-start: 0px;
        --_pane-margin-inline-end: 0px;
      }
    }

    /* On desktop, make the scrollbars less blocky so you can see the border
     * radius of the pane. On most mobile platforms, these scrollbars are hidden
     * by default. It'll still unfortunately render on top of the border radius.
     */
    @media (pointer: fine) {
      :host {
        --_scrollbar-width: 8px;
      }

      .scroll-wrapper {
        /* firefox */
        scrollbar-color: var(--md-sys-color-primary) transparent;
        scrollbar-width: thin;
      }

      .content {
        /* adjust for the scrollbar width */
        padding-inline-end: calc(
          var(--catalog-spacing-xl) - var(--_scrollbar-width)
        );
      }

      /* Chromium + Safari */
      .scroll-wrapper::-webkit-scrollbar {
        background-color: transparent;
        width: var(--_scrollbar-width);
      }

      .scroll-wrapper::-webkit-scrollbar-thumb {
        background-color: var(--md-sys-color-primary);
        border-radius: calc(var(--_scrollbar-width) / 2);
      }
    }

    @media (forced-colors: active) {
      .pane {
        border: 1px solid CanvasText;
      }

      @media (max-width: 1500px) {
        aside {
          box-sizing: border-box;
          border: 1px solid CanvasText;
        }

        .scrim {
          background-color: rgba(0, 0, 0, 0.75);
        }
      }

      @media (pointer: fine) {
        .scroll-wrapper {
          /* firefox */
          scrollbar-color: CanvasText transparent;
        }

        .scroll-wrapper::-webkit-scrollbar-thumb {
          /* Chromium + Safari */
          background-color: CanvasText;
        }
      }
    }
  `;
  __decorateClass([
    t()
  ], NavDrawer.prototype, "isCollapsible", 2);
  __decorateClass([
    n({ type: Boolean, attribute: "has-toc" })
  ], NavDrawer.prototype, "hasToc", 2);
  __decorateClass([
    n({ attribute: "page-title" })
  ], NavDrawer.prototype, "pageTitle", 2);
  NavDrawer = __decorateClass([
    e("nav-drawer")
  ], NavDrawer);

  // ../labs/segmentedbutton/internal/segmented-button.js
  var segmentedButtonBaseClass = mixinDelegatesAria(s3);
  var SegmentedButton = class extends segmentedButtonBaseClass {
    constructor() {
      super(...arguments);
      this.disabled = false;
      this.selected = false;
      this.label = "";
      this.noCheckmark = false;
      this.hasIcon = false;
      this.animState = "";
    }
    update(props) {
      this.animState = this.nextAnimationState(props);
      super.update(props);
      this.hasIcon = this.iconElement.length > 0;
    }
    nextAnimationState(changedProps) {
      const prevSelected = changedProps.get("selected");
      if (prevSelected === void 0)
        return "";
      const nextSelected = this.selected;
      const nextHasCheckmark = !this.noCheckmark;
      if (!prevSelected && nextSelected && nextHasCheckmark) {
        return "selecting";
      }
      if (prevSelected && !nextSelected && nextHasCheckmark) {
        return "deselecting";
      }
      return "";
    }
    handleClick() {
      const event = new Event("segmented-button-interaction", {
        bubbles: true,
        composed: true
      });
      this.dispatchEvent(event);
    }
    render() {
      const { ariaLabel } = this;
      return T`
      <button
        tabindex="${this.disabled ? "-1" : "0"}"
        aria-label=${ariaLabel || A}
        aria-pressed=${this.selected}
        ?disabled=${this.disabled}
        @click="${this.handleClick}"
        class="md3-segmented-button ${o8(this.getRenderClasses())}">
        <md-focus-ring
          class="md3-segmented-button__focus-ring"
          part="focus-ring"></md-focus-ring>
        <md-ripple
          ?disabled="${this.disabled}"
          class="md3-segmented-button__ripple"></md-ripple>
        ${this.renderOutline()} ${this.renderLeading()} ${this.renderLabel()}
        ${this.renderTouchTarget()}
      </button>
    `;
    }
    getRenderClasses() {
      return {
        "md3-segmented-button--selected": this.selected,
        "md3-segmented-button--unselected": !this.selected,
        "md3-segmented-button--with-label": this.label !== "",
        "md3-segmented-button--without-label": this.label === "",
        "md3-segmented-button--with-icon": this.hasIcon,
        "md3-segmented-button--with-checkmark": !this.noCheckmark,
        "md3-segmented-button--without-checkmark": this.noCheckmark,
        "md3-segmented-button--selecting": this.animState === "selecting",
        "md3-segmented-button--deselecting": this.animState === "deselecting"
      };
    }
    renderOutline() {
      return A;
    }
    renderLeading() {
      return this.label === "" ? this.renderLeadingWithoutLabel() : this.renderLeadingWithLabel();
    }
    renderLeadingWithoutLabel() {
      return T`
      <span class="md3-segmented-button__leading" aria-hidden="true">
        <span class="md3-segmented-button__graphic">
          <svg class="md3-segmented-button__checkmark" viewBox="0 0 24 24">
            <path
              class="md3-segmented-button__checkmark-path"
              fill="none"
              d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
          </svg>
        </span>
        <span class="md3-segmented-button__icon" aria-hidden="true">
          <slot name="icon"></slot>
        </span>
      </span>
    `;
    }
    renderLeadingWithLabel() {
      return T`
      <span class="md3-segmented-button__leading" aria-hidden="true">
        <span class="md3-segmented-button__graphic">
          <svg class="md3-segmented-button__checkmark" viewBox="0 0 24 24">
            <path
              class="md3-segmented-button__checkmark-path"
              fill="none"
              d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
          </svg>
          <span class="md3-segmented-button__icon" aria-hidden="true">
            <slot name="icon"></slot>
          </span>
        </span>
      </span>
    `;
    }
    renderLabel() {
      return T`
      <span class="md3-segmented-button__label-text">${this.label}</span>
    `;
    }
    renderTouchTarget() {
      return T`<span class="md3-segmented-button__touch"></span>`;
    }
  };
  __decorate([
    n({ type: Boolean })
  ], SegmentedButton.prototype, "disabled", void 0);
  __decorate([
    n({ type: Boolean })
  ], SegmentedButton.prototype, "selected", void 0);
  __decorate([
    n()
  ], SegmentedButton.prototype, "label", void 0);
  __decorate([
    n({ type: Boolean, attribute: "no-checkmark" })
  ], SegmentedButton.prototype, "noCheckmark", void 0);
  __decorate([
    n({ type: Boolean, attribute: "has-icon" })
  ], SegmentedButton.prototype, "hasIcon", void 0);
  __decorate([
    t()
  ], SegmentedButton.prototype, "animState", void 0);
  __decorate([
    e5({ slot: "icon", flatten: true })
  ], SegmentedButton.prototype, "iconElement", void 0);

  // ../labs/segmentedbutton/internal/outlined-segmented-button.js
  var OutlinedSegmentedButton = class extends SegmentedButton {
    getRenderClasses() {
      return {
        ...super.getRenderClasses(),
        "md3-segmented-button--outlined": true
      };
    }
    renderOutline() {
      return T`<span class="md3-segmented-button__outline"></span>`;
    }
  };

  // ../labs/segmentedbutton/internal/outlined-styles.cssresult.js
  var styles58 = i3`:host{--_container-height: var(--md-outlined-segmented-button-container-height, 40px);--_disabled-icon-color: var(--md-outlined-segmented-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-color: var(--md-outlined-segmented-button-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-color: var(--md-outlined-segmented-button-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-state-layer-opacity: var(--md-outlined-segmented-button-hover-state-layer-opacity, 0.08);--_label-text-font: var(--md-outlined-segmented-button-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-outlined-segmented-button-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-outlined-segmented-button-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-outlined-segmented-button-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_outline-color: var(--md-outlined-segmented-button-outline-color, var(--md-sys-color-outline, #79747e));--_pressed-state-layer-opacity: var(--md-outlined-segmented-button-pressed-state-layer-opacity, 0.12);--_selected-container-color: var(--md-outlined-segmented-button-selected-container-color, var(--md-sys-color-secondary-container, #e8def8));--_selected-focus-icon-color: var(--md-outlined-segmented-button-selected-focus-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-focus-label-text-color: var(--md-outlined-segmented-button-selected-focus-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-icon-color: var(--md-outlined-segmented-button-selected-hover-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-label-text-color: var(--md-outlined-segmented-button-selected-hover-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-state-layer-color: var(--md-outlined-segmented-button-selected-hover-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-label-text-color: var(--md-outlined-segmented-button-selected-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-icon-color: var(--md-outlined-segmented-button-selected-pressed-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-label-text-color: var(--md-outlined-segmented-button-selected-pressed-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-state-layer-color: var(--md-outlined-segmented-button-selected-pressed-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_shape: var(--md-outlined-segmented-button-shape, var(--md-sys-shape-corner-full, 9999px));--_unselected-focus-icon-color: var(--md-outlined-segmented-button-unselected-focus-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-focus-label-text-color: var(--md-outlined-segmented-button-unselected-focus-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-hover-icon-color: var(--md-outlined-segmented-button-unselected-hover-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-hover-label-text-color: var(--md-outlined-segmented-button-unselected-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-hover-state-layer-color: var(--md-outlined-segmented-button-unselected-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-label-text-color: var(--md-outlined-segmented-button-unselected-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-pressed-icon-color: var(--md-outlined-segmented-button-unselected-pressed-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-pressed-label-text-color: var(--md-outlined-segmented-button-unselected-pressed-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-pressed-state-layer-color: var(--md-outlined-segmented-button-unselected-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_icon-size: var(--md-outlined-segmented-button-icon-size, 18px);--_selected-icon-color: var(--md-outlined-segmented-button-selected-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_unselected-icon-color: var(--md-outlined-segmented-button-unselected-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_shape-start-start: var(--md-outlined-segmented-button-shape-start-start, var(--md-outlined-segmented-button-shape, var(--md-sys-shape-corner-full, 9999px)));--_shape-start-end: var(--md-outlined-segmented-button-shape-start-end, var(--md-outlined-segmented-button-shape, var(--md-sys-shape-corner-full, 9999px)));--_shape-end-end: var(--md-outlined-segmented-button-shape-end-end, var(--md-outlined-segmented-button-shape, var(--md-sys-shape-corner-full, 9999px)));--_shape-end-start: var(--md-outlined-segmented-button-shape-end-start, var(--md-outlined-segmented-button-shape, var(--md-sys-shape-corner-full, 9999px)));--_spacing-leading: 12px;--_spacing-trailing: 12px}.md3-segmented-button__outline{border-radius:inherit;border-style:solid;border-width:1px;inset:0px -0.5px;pointer-events:none;position:absolute}
`;
  var outlined_styles_cssresult_default5 = styles58.styleSheet;

  // ../labs/segmentedbutton/internal/shared-styles.cssresult.js
  var styles59 = i3`@keyframes md3-segmented-button-checkmark-selection-draw-in{from{stroke-dashoffset:29.7833385}to{stroke-dashoffset:0}}@keyframes md3-segmented-button-simple-fade-out{from{opacity:1}to{opacity:0}}@keyframes md3-segmented-button-simple-fade-in{from{opacity:0}to{opacity:1}}:host{display:inline-flex;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.md3-segmented-button{align-items:center;background:rgba(0,0,0,0);border:none;border-radius:inherit;display:flex;flex:1;justify-content:center;outline:none;position:relative;vertical-align:middle;padding-inline-start:var(--_spacing-leading);padding-inline-end:var(--_spacing-trailing);text-transform:inherit}.md3-segmented-button .md3-segmented-button__outline{border-color:var(--_outline-color)}.md3-segmented-button:disabled .md3-segmented-button__outline{border-color:var(--_disabled-outline-color)}.md3-segmented-button .md3-segmented-button__graphic,.md3-segmented-button .md3-segmented-button__checkmark,.md3-segmented-button .md3-segmented-button__icon,.md3-segmented-button .md3-segmented-button__icon ::slotted([slot=icon]){height:var(--_icon-size);width:var(--_icon-size);font-size:var(--_icon-size)}.md3-segmented-button.md3-segmented-button--with-icon.md3-segmented-button--with-label .md3-segmented-button__graphic,.md3-segmented-button.md3-segmented-button--selected.md3-segmented-button--with-label.md3-segmented-button--with-checkmark .md3-segmented-button__graphic,.md3-segmented-button.md3-segmented-button--selected.md3-segmented-button--without-label.md3-segmented-button--with-checkmark .md3-segmented-button__graphic{width:calc(var(--_icon-size) + 8px)}.md3-segmented-button .md3-segmented-button__label-text{font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight)}.md3-segmented-button.md3-segmented-button--selected:enabled .md3-segmented-button__label-text{color:var(--_selected-label-text-color)}.md3-segmented-button.md3-segmented-button--selected:enabled:hover .md3-segmented-button__label-text{color:var(--_selected-hover-label-text-color)}.md3-segmented-button.md3-segmented-button--selected:enabled:focus .md3-segmented-button__label-text{color:var(--_selected-focus-label-text-color)}.md3-segmented-button.md3-segmented-button--selected:enabled:active .md3-segmented-button__label-text{color:var(--_selected-pressed-label-text-color)}.md3-segmented-button.md3-segmented-button--unselected:enabled .md3-segmented-button__label-text{color:var(--_unselected-label-text-color)}.md3-segmented-button.md3-segmented-button--unselected:enabled:hover .md3-segmented-button__label-text{color:var(--_unselected-hover-label-text-color)}.md3-segmented-button.md3-segmented-button--unselected:enabled:focus .md3-segmented-button__label-text{color:var(--_unselected-focus-label-text-color)}.md3-segmented-button.md3-segmented-button--unselected:enabled:active .md3-segmented-button__label-text{color:var(--_unselected-pressed-label-text-color)}.md3-segmented-button:disabled .md3-segmented-button__label-text{color:var(--_disabled-label-text-color)}.md3-segmented-button--unselected .md3-segmented-button__icon{color:var(--_unselected-icon-color)}.md3-segmented-button--unselected:hover .md3-segmented-button__icon{color:var(--_unselected-hover-icon-color)}.md3-segmented-button--unselected:focus .md3-segmented-button__icon{color:var(--_unselected-focus-icon-color)}.md3-segmented-button--unselected:active .md3-segmented-button__icon{color:var(--_unselected-pressed-icon-color)}.md3-segmented-button--unselected:disabled .md3-segmented-button__icon{color:var(--_disabled-icon-color)}.md3-segmented-button--unselected{--md-ripple-hover-color: var(--_unselected-hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_unselected-pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}.md3-segmented-button--selected{background-color:var(--_selected-container-color)}.md3-segmented-button--selected .md3-segmented-button__icon{color:var(--_selected-icon-color)}.md3-segmented-button--selected .md3-segmented-button__checkmark-path{stroke:var(--_selected-icon-color)}.md3-segmented-button--selected:hover .md3-segmented-button__checkmark-path{stroke:var(--_selected-hover-icon-color)}.md3-segmented-button--selected:focus .md3-segmented-button__checkmark-path{stroke:var(--_selected-focus-icon-color)}.md3-segmented-button--selected:active .md3-segmented-button__checkmark-path{stroke:var(--_selected-pressed-icon-color)}.md3-segmented-button--selected:disabled .md3-segmented-button__checkmark-path{stroke:var(--_disabled-icon-color)}.md3-segmented-button--selected{--md-ripple-hover-color: var(--_selected-hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_selected-pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}.md3-segmented-button:enabled{cursor:pointer}.md3-segmented-button__focus-ring{z-index:1}.md3-segmented-button__ripple{border-radius:inherit;z-index:0}.md3-segmented-button__touch{position:absolute;top:50%;height:48px;left:50%;width:100%;transform:translate(-50%, -50%)}.md3-segmented-button__leading,.md3-segmented-button__graphic{display:inline-flex;justify-content:flex-start;align-items:center}.md3-segmented-button__graphic{position:relative;overflow:hidden}.md3-segmented-button__graphic{transition:width 150ms cubic-bezier(0.4, 0, 0.2, 1)}.md3-segmented-button--unselected.md3-segmented-button--with-label .md3-segmented-button__graphic,.md3-segmented-button--unselected.md3-segmented-button--without-label .md3-segmented-button__graphic,.md3-segmented-button--selected.md3-segmented-button--without-checkmark .md3-segmented-button__graphic{width:0}.md3-segmented-button--unselected .md3-segmented-button__checkmark{opacity:0}.md3-segmented-button--selected.md3-segmented-button--with-label .md3-segmented-button__icon{opacity:0}.md3-segmented-button--with-label .md3-segmented-button__checkmark{display:inline-flex;position:absolute}.md3-segmented-button__checkmark-path{stroke-width:2px;stroke-dasharray:29.7833385}.md3-segmented-button--selecting .md3-segmented-button__checkmark-path{stroke-dashoffset:29.7833385;animation:md3-segmented-button-checkmark-selection-draw-in;animation-duration:150ms;animation-delay:50ms;animation-fill-mode:forwards;animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}.md3-segmented-button--selecting.md3-segmented-button--with-label .md3-segmented-button__icon{animation:md3-segmented-button-simple-fade-out;animation-duration:75ms;animation-timing-function:linear;animation-fill-mode:forwards}.md3-segmented-button--deselecting .md3-segmented-button__checkmark{animation:md3-segmented-button-simple-fade-out;animation-duration:50ms;animation-timing-function:linear;animation-fill-mode:forwards}.md3-segmented-button--deselecting.md3-segmented-button--with-label .md3-segmented-button__icon{opacity:0;animation:md3-segmented-button-simple-fade-in;animation-delay:50ms;animation-duration:150ms;animation-timing-function:linear;animation-fill-mode:forwards}
`;
  var shared_styles_cssresult_default8 = styles59.styleSheet;

  // ../labs/segmentedbutton/outlined-segmented-button.js
  var MdOutlinedSegmentedButton = class MdOutlinedSegmentedButton2 extends OutlinedSegmentedButton {
  };
  MdOutlinedSegmentedButton.styles = [styles59, styles58];
  MdOutlinedSegmentedButton = __decorate([
    e("md-outlined-segmented-button")
  ], MdOutlinedSegmentedButton);

  // ../labs/segmentedbuttonset/internal/segmented-button-set.js
  var segmentedButtonSetBaseClass = mixinDelegatesAria(s3);
  var SegmentedButtonSet = class extends segmentedButtonSetBaseClass {
    constructor() {
      super(...arguments);
      this.multiselect = false;
    }
    getButtonDisabled(index) {
      if (this.indexOutOfBounds(index))
        return false;
      return this.buttons[index].disabled;
    }
    setButtonDisabled(index, disabled) {
      if (this.indexOutOfBounds(index))
        return;
      this.buttons[index].disabled = disabled;
    }
    getButtonSelected(index) {
      if (this.indexOutOfBounds(index))
        return false;
      return this.buttons[index].selected;
    }
    setButtonSelected(index, selected) {
      if (this.indexOutOfBounds(index))
        return;
      if (this.getButtonDisabled(index))
        return;
      if (this.multiselect) {
        this.buttons[index].selected = selected;
        this.emitSelectionEvent(index);
        return;
      }
      if (!selected)
        return;
      this.buttons[index].selected = true;
      this.emitSelectionEvent(index);
      for (let i10 = 0; i10 < this.buttons.length; i10++) {
        if (i10 === index)
          continue;
        this.buttons[i10].selected = false;
      }
    }
    handleSegmentedButtonInteraction(event) {
      const index = this.buttons.indexOf(event.target);
      this.toggleSelection(index);
    }
    toggleSelection(index) {
      if (this.indexOutOfBounds(index))
        return;
      this.setButtonSelected(index, !this.buttons[index].selected);
    }
    indexOutOfBounds(index) {
      return index < 0 || index >= this.buttons.length;
    }
    emitSelectionEvent(index) {
      this.dispatchEvent(new CustomEvent("segmented-button-set-selection", {
        detail: {
          button: this.buttons[index],
          selected: this.buttons[index].selected,
          index
        },
        bubbles: true,
        composed: true
      }));
    }
    render() {
      const { ariaLabel } = this;
      return T`
      <span
        role="group"
        @segmented-button-interaction="${this.handleSegmentedButtonInteraction}"
        aria-label=${ariaLabel || A}
        class="md3-segmented-button-set">
        <slot></slot>
      </span>
    `;
    }
    getRenderClasses() {
      return {};
    }
  };
  __decorate([
    n({ type: Boolean })
  ], SegmentedButtonSet.prototype, "multiselect", void 0);
  __decorate([
    e5({ flatten: true })
  ], SegmentedButtonSet.prototype, "buttons", void 0);

  // ../labs/segmentedbuttonset/internal/outlined-segmented-button-set.js
  var OutlinedSegmentedButtonSet = class extends SegmentedButtonSet {
    getRenderClasses() {
      return {
        ...super.getRenderClasses(),
        "md3-segmented-button-set--outlined": true
      };
    }
  };

  // ../labs/segmentedbuttonset/internal/outlined-styles.cssresult.js
  var styles60 = i3`:host{--_container-height: var(--md-outlined-segmented-button-container-height, 40px);--_disabled-icon-color: var(--md-outlined-segmented-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-color: var(--md-outlined-segmented-button-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-color: var(--md-outlined-segmented-button-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-state-layer-opacity: var(--md-outlined-segmented-button-hover-state-layer-opacity, 0.08);--_label-text-font: var(--md-outlined-segmented-button-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-outlined-segmented-button-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-outlined-segmented-button-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-outlined-segmented-button-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_outline-color: var(--md-outlined-segmented-button-outline-color, var(--md-sys-color-outline, #79747e));--_pressed-state-layer-opacity: var(--md-outlined-segmented-button-pressed-state-layer-opacity, 0.12);--_selected-container-color: var(--md-outlined-segmented-button-selected-container-color, var(--md-sys-color-secondary-container, #e8def8));--_selected-focus-icon-color: var(--md-outlined-segmented-button-selected-focus-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-focus-label-text-color: var(--md-outlined-segmented-button-selected-focus-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-icon-color: var(--md-outlined-segmented-button-selected-hover-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-label-text-color: var(--md-outlined-segmented-button-selected-hover-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-state-layer-color: var(--md-outlined-segmented-button-selected-hover-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-label-text-color: var(--md-outlined-segmented-button-selected-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-icon-color: var(--md-outlined-segmented-button-selected-pressed-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-label-text-color: var(--md-outlined-segmented-button-selected-pressed-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-state-layer-color: var(--md-outlined-segmented-button-selected-pressed-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_unselected-focus-icon-color: var(--md-outlined-segmented-button-unselected-focus-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-focus-label-text-color: var(--md-outlined-segmented-button-unselected-focus-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-hover-icon-color: var(--md-outlined-segmented-button-unselected-hover-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-hover-label-text-color: var(--md-outlined-segmented-button-unselected-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-hover-state-layer-color: var(--md-outlined-segmented-button-unselected-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-label-text-color: var(--md-outlined-segmented-button-unselected-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-pressed-icon-color: var(--md-outlined-segmented-button-unselected-pressed-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-pressed-label-text-color: var(--md-outlined-segmented-button-unselected-pressed-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-pressed-state-layer-color: var(--md-outlined-segmented-button-unselected-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_icon-size: var(--md-outlined-segmented-button-icon-size, 18px);--_selected-icon-color: var(--md-outlined-segmented-button-selected-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_unselected-icon-color: var(--md-outlined-segmented-button-unselected-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_shape-start-start: var(--md-outlined-segmented-button-shape-start-start, var(--md-outlined-segmented-button-shape, var(--md-sys-shape-corner-full, 9999px)));--_shape-start-end: var(--md-outlined-segmented-button-shape-start-end, var(--md-outlined-segmented-button-shape, var(--md-sys-shape-corner-full, 9999px)));--_shape-end-end: var(--md-outlined-segmented-button-shape-end-end, var(--md-outlined-segmented-button-shape, var(--md-sys-shape-corner-full, 9999px)));--_shape-end-start: var(--md-outlined-segmented-button-shape-end-start, var(--md-outlined-segmented-button-shape, var(--md-sys-shape-corner-full, 9999px)))}
`;
  var outlined_styles_cssresult_default6 = styles60.styleSheet;

  // ../labs/segmentedbuttonset/internal/shared-styles.cssresult.js
  var styles61 = i3`:host{display:flex;outline:none}.md3-segmented-button-set{display:grid;grid-auto-columns:1fr;grid-auto-flow:column;grid-auto-rows:auto;width:100%;height:var(--_container-height)}.md3-segmented-button-set ::slotted(:first-child){border-start-start-radius:var(--_shape-start-start);border-end-start-radius:var(--_shape-end-start)}.md3-segmented-button-set ::slotted(:last-child){border-start-end-radius:var(--_shape-start-end);border-end-end-radius:var(--_shape-end-end)}
`;
  var shared_styles_cssresult_default9 = styles61.styleSheet;

  // ../labs/segmentedbuttonset/outlined-segmented-button-set.js
  var MdOutlinedSegmentedButtonSet = class MdOutlinedSegmentedButtonSet2 extends OutlinedSegmentedButtonSet {
  };
  MdOutlinedSegmentedButtonSet.styles = [styles61, styles60];
  MdOutlinedSegmentedButtonSet = __decorate([
    e("md-outlined-segmented-button-set")
  ], MdOutlinedSegmentedButtonSet);

  // src/components/copy-code-button.ts
  var CopyCodeButton = class extends s3 {
    constructor() {
      super(...arguments);
      this.showCheckmark = false;
      this.label = "Copy code";
      this.successLabel = "Copy successful";
      this.buttonTitle = "Copy code";
    }
    render() {
      return T`
      <slot></slot>
      <md-icon-button
        toggle
        @click=${this.onClick}
        @input=${this.onInput}
        title=${this.buttonTitle}
        .selected=${this.showCheckmark}
        aria-label=${this.label}
        aria-label-selected=${this.successLabel}>
        <md-icon>content_copy</md-icon>
        <md-icon slot="selected">check</md-icon>
      </md-icon-button>
    `;
    }
    async onClick() {
      await navigator.clipboard.writeText(this.getCopyText());
      this.onCopySuccess();
    }
    onInput() {
      this.showCheckmark = this.copyButton.selected;
    }
    /**
     * Returns the text to be copied. By default, it copies the textContent of the
     * nodes slotted into the element. Override for custom functionality.
     */
    getCopyText() {
      let text = "";
      for (const el of this.slottedEls) {
        text += el.textContent;
      }
      return text;
    }
    onCopySuccess() {
      this.showCheckmark = true;
      if (this.timeoutId) {
        window.clearTimeout(this.timeoutId);
      }
      this.timeoutId = window.setTimeout(() => {
        this.showCheckmark = false;
      }, 2e3);
    }
  };
  CopyCodeButton.styles = i3`
    :host {
      display: block;
      position: relative;
      --_border-radius: calc(var(--catalog-code-block-border-radius) / 4);
    }

    md-icon-button {
      color: red;
      position: absolute;
      inset: var(
        --catalog-copy-code-button-inset,
        var(--_border-radius) var(--_border-radius) auto auto
      );
      --md-sys-color-on-surface-variant: var(--md-sys-color-on-surface);
      --md-sys-color-primary: var(--md-sys-color-on-surface);
    }
  `;
  __decorateClass([
    t()
  ], CopyCodeButton.prototype, "showCheckmark", 2);
  __decorateClass([
    n()
  ], CopyCodeButton.prototype, "label", 2);
  __decorateClass([
    n({ attribute: "success-label" })
  ], CopyCodeButton.prototype, "successLabel", 2);
  __decorateClass([
    n({ attribute: "button-title" })
  ], CopyCodeButton.prototype, "buttonTitle", 2);
  __decorateClass([
    i2("md-icon-button")
  ], CopyCodeButton.prototype, "copyButton", 2);
  __decorateClass([
    e5({ flatten: true, selector: "*" })
  ], CopyCodeButton.prototype, "slottedEls", 2);
  CopyCodeButton = __decorateClass([
    e("copy-code-button")
  ], CopyCodeButton);

  // node_modules/@material/material-color-utilities/utils/math_utils.js
  function signum(num) {
    if (num < 0) {
      return -1;
    } else if (num === 0) {
      return 0;
    } else {
      return 1;
    }
  }
  function lerp(start, stop, amount) {
    return (1 - amount) * start + amount * stop;
  }
  function clampInt(min, max, input) {
    if (input < min) {
      return min;
    } else if (input > max) {
      return max;
    }
    return input;
  }
  function clampDouble(min, max, input) {
    if (input < min) {
      return min;
    } else if (input > max) {
      return max;
    }
    return input;
  }
  function sanitizeDegreesInt(degrees) {
    degrees = degrees % 360;
    if (degrees < 0) {
      degrees = degrees + 360;
    }
    return degrees;
  }
  function sanitizeDegreesDouble(degrees) {
    degrees = degrees % 360;
    if (degrees < 0) {
      degrees = degrees + 360;
    }
    return degrees;
  }
  function differenceDegrees(a7, b4) {
    return 180 - Math.abs(Math.abs(a7 - b4) - 180);
  }
  function matrixMultiply(row, matrix) {
    const a7 = row[0] * matrix[0][0] + row[1] * matrix[0][1] + row[2] * matrix[0][2];
    const b4 = row[0] * matrix[1][0] + row[1] * matrix[1][1] + row[2] * matrix[1][2];
    const c7 = row[0] * matrix[2][0] + row[1] * matrix[2][1] + row[2] * matrix[2][2];
    return [a7, b4, c7];
  }

  // node_modules/@material/material-color-utilities/utils/color_utils.js
  var SRGB_TO_XYZ = [
    [0.41233895, 0.35762064, 0.18051042],
    [0.2126, 0.7152, 0.0722],
    [0.01932141, 0.11916382, 0.95034478]
  ];
  var XYZ_TO_SRGB = [
    [
      3.2413774792388685,
      -1.5376652402851851,
      -0.49885366846268053
    ],
    [
      -0.9691452513005321,
      1.8758853451067872,
      0.04156585616912061
    ],
    [
      0.05562093689691305,
      -0.20395524564742123,
      1.0571799111220335
    ]
  ];
  var WHITE_POINT_D65 = [95.047, 100, 108.883];
  function argbFromRgb(red, green, blue) {
    return (255 << 24 | (red & 255) << 16 | (green & 255) << 8 | blue & 255) >>> 0;
  }
  function argbFromLinrgb(linrgb) {
    const r8 = delinearized(linrgb[0]);
    const g4 = delinearized(linrgb[1]);
    const b4 = delinearized(linrgb[2]);
    return argbFromRgb(r8, g4, b4);
  }
  function redFromArgb(argb) {
    return argb >> 16 & 255;
  }
  function greenFromArgb(argb) {
    return argb >> 8 & 255;
  }
  function blueFromArgb(argb) {
    return argb & 255;
  }
  function argbFromXyz(x3, y4, z2) {
    const matrix = XYZ_TO_SRGB;
    const linearR = matrix[0][0] * x3 + matrix[0][1] * y4 + matrix[0][2] * z2;
    const linearG = matrix[1][0] * x3 + matrix[1][1] * y4 + matrix[1][2] * z2;
    const linearB = matrix[2][0] * x3 + matrix[2][1] * y4 + matrix[2][2] * z2;
    const r8 = delinearized(linearR);
    const g4 = delinearized(linearG);
    const b4 = delinearized(linearB);
    return argbFromRgb(r8, g4, b4);
  }
  function xyzFromArgb(argb) {
    const r8 = linearized(redFromArgb(argb));
    const g4 = linearized(greenFromArgb(argb));
    const b4 = linearized(blueFromArgb(argb));
    return matrixMultiply([r8, g4, b4], SRGB_TO_XYZ);
  }
  function argbFromLstar(lstar) {
    const y4 = yFromLstar(lstar);
    const component = delinearized(y4);
    return argbFromRgb(component, component, component);
  }
  function lstarFromArgb(argb) {
    const y4 = xyzFromArgb(argb)[1];
    return 116 * labF(y4 / 100) - 16;
  }
  function yFromLstar(lstar) {
    return 100 * labInvf((lstar + 16) / 116);
  }
  function lstarFromY(y4) {
    return labF(y4 / 100) * 116 - 16;
  }
  function linearized(rgbComponent) {
    const normalized = rgbComponent / 255;
    if (normalized <= 0.040449936) {
      return normalized / 12.92 * 100;
    } else {
      return Math.pow((normalized + 0.055) / 1.055, 2.4) * 100;
    }
  }
  function delinearized(rgbComponent) {
    const normalized = rgbComponent / 100;
    let delinearized2 = 0;
    if (normalized <= 31308e-7) {
      delinearized2 = normalized * 12.92;
    } else {
      delinearized2 = 1.055 * Math.pow(normalized, 1 / 2.4) - 0.055;
    }
    return clampInt(0, 255, Math.round(delinearized2 * 255));
  }
  function whitePointD65() {
    return WHITE_POINT_D65;
  }
  function labF(t7) {
    const e13 = 216 / 24389;
    const kappa = 24389 / 27;
    if (t7 > e13) {
      return Math.pow(t7, 1 / 3);
    } else {
      return (kappa * t7 + 16) / 116;
    }
  }
  function labInvf(ft) {
    const e13 = 216 / 24389;
    const kappa = 24389 / 27;
    const ft3 = ft * ft * ft;
    if (ft3 > e13) {
      return ft3;
    } else {
      return (116 * ft - 16) / kappa;
    }
  }

  // node_modules/@material/material-color-utilities/hct/viewing_conditions.js
  var ViewingConditions = class _ViewingConditions {
    /**
     * Create ViewingConditions from a simple, physically relevant, set of
     * parameters.
     *
     * @param whitePoint White point, measured in the XYZ color space.
     *     default = D65, or sunny day afternoon
     * @param adaptingLuminance The luminance of the adapting field. Informally,
     *     how bright it is in the room where the color is viewed. Can be
     *     calculated from lux by multiplying lux by 0.0586. default = 11.72,
     *     or 200 lux.
     * @param backgroundLstar The lightness of the area surrounding the color.
     *     measured by L* in L*a*b*. default = 50.0
     * @param surround A general description of the lighting surrounding the
     *     color. 0 is pitch dark, like watching a movie in a theater. 1.0 is a
     *     dimly light room, like watching TV at home at night. 2.0 means there
     *     is no difference between the lighting on the color and around it.
     *     default = 2.0
     * @param discountingIlluminant Whether the eye accounts for the tint of the
     *     ambient lighting, such as knowing an apple is still red in green light.
     *     default = false, the eye does not perform this process on
     *       self-luminous objects like displays.
     */
    static make(whitePoint = whitePointD65(), adaptingLuminance = 200 / Math.PI * yFromLstar(50) / 100, backgroundLstar = 50, surround = 2, discountingIlluminant = false) {
      const xyz = whitePoint;
      const rW = xyz[0] * 0.401288 + xyz[1] * 0.650173 + xyz[2] * -0.051461;
      const gW = xyz[0] * -0.250268 + xyz[1] * 1.204414 + xyz[2] * 0.045854;
      const bW = xyz[0] * -2079e-6 + xyz[1] * 0.048952 + xyz[2] * 0.953127;
      const f4 = 0.8 + surround / 10;
      const c7 = f4 >= 0.9 ? lerp(0.59, 0.69, (f4 - 0.9) * 10) : lerp(0.525, 0.59, (f4 - 0.8) * 10);
      let d5 = discountingIlluminant ? 1 : f4 * (1 - 1 / 3.6 * Math.exp((-adaptingLuminance - 42) / 92));
      d5 = d5 > 1 ? 1 : d5 < 0 ? 0 : d5;
      const nc = f4;
      const rgbD = [
        d5 * (100 / rW) + 1 - d5,
        d5 * (100 / gW) + 1 - d5,
        d5 * (100 / bW) + 1 - d5
      ];
      const k2 = 1 / (5 * adaptingLuminance + 1);
      const k4 = k2 * k2 * k2 * k2;
      const k4F = 1 - k4;
      const fl = k4 * adaptingLuminance + 0.1 * k4F * k4F * Math.cbrt(5 * adaptingLuminance);
      const n13 = yFromLstar(backgroundLstar) / whitePoint[1];
      const z2 = 1.48 + Math.sqrt(n13);
      const nbb = 0.725 / Math.pow(n13, 0.2);
      const ncb = nbb;
      const rgbAFactors = [
        Math.pow(fl * rgbD[0] * rW / 100, 0.42),
        Math.pow(fl * rgbD[1] * gW / 100, 0.42),
        Math.pow(fl * rgbD[2] * bW / 100, 0.42)
      ];
      const rgbA = [
        400 * rgbAFactors[0] / (rgbAFactors[0] + 27.13),
        400 * rgbAFactors[1] / (rgbAFactors[1] + 27.13),
        400 * rgbAFactors[2] / (rgbAFactors[2] + 27.13)
      ];
      const aw = (2 * rgbA[0] + rgbA[1] + 0.05 * rgbA[2]) * nbb;
      return new _ViewingConditions(n13, aw, nbb, ncb, c7, nc, rgbD, fl, Math.pow(fl, 0.25), z2);
    }
    /**
     * Parameters are intermediate values of the CAM16 conversion process. Their
     * names are shorthand for technical color science terminology, this class
     * would not benefit from documenting them individually. A brief overview
     * is available in the CAM16 specification, and a complete overview requires
     * a color science textbook, such as Fairchild's Color Appearance Models.
     */
    constructor(n13, aw, nbb, ncb, c7, nc, rgbD, fl, fLRoot, z2) {
      this.n = n13;
      this.aw = aw;
      this.nbb = nbb;
      this.ncb = ncb;
      this.c = c7;
      this.nc = nc;
      this.rgbD = rgbD;
      this.fl = fl;
      this.fLRoot = fLRoot;
      this.z = z2;
    }
  };
  ViewingConditions.DEFAULT = ViewingConditions.make();

  // node_modules/@material/material-color-utilities/hct/cam16.js
  var Cam16 = class _Cam16 {
    /**
     * All of the CAM16 dimensions can be calculated from 3 of the dimensions, in
     * the following combinations:
     *      -  {j or q} and {c, m, or s} and hue
     *      - jstar, astar, bstar
     * Prefer using a static method that constructs from 3 of those dimensions.
     * This constructor is intended for those methods to use to return all
     * possible dimensions.
     *
     * @param hue
     * @param chroma informally, colorfulness / color intensity. like saturation
     *     in HSL, except perceptually accurate.
     * @param j lightness
     * @param q brightness; ratio of lightness to white point's lightness
     * @param m colorfulness
     * @param s saturation; ratio of chroma to white point's chroma
     * @param jstar CAM16-UCS J coordinate
     * @param astar CAM16-UCS a coordinate
     * @param bstar CAM16-UCS b coordinate
     */
    constructor(hue, chroma, j3, q, m3, s8, jstar, astar, bstar) {
      this.hue = hue;
      this.chroma = chroma;
      this.j = j3;
      this.q = q;
      this.m = m3;
      this.s = s8;
      this.jstar = jstar;
      this.astar = astar;
      this.bstar = bstar;
    }
    /**
     * CAM16 instances also have coordinates in the CAM16-UCS space, called J*,
     * a*, b*, or jstar, astar, bstar in code. CAM16-UCS is included in the CAM16
     * specification, and is used to measure distances between colors.
     */
    distance(other) {
      const dJ = this.jstar - other.jstar;
      const dA = this.astar - other.astar;
      const dB = this.bstar - other.bstar;
      const dEPrime = Math.sqrt(dJ * dJ + dA * dA + dB * dB);
      const dE = 1.41 * Math.pow(dEPrime, 0.63);
      return dE;
    }
    /**
     * @param argb ARGB representation of a color.
     * @return CAM16 color, assuming the color was viewed in default viewing
     *     conditions.
     */
    static fromInt(argb) {
      return _Cam16.fromIntInViewingConditions(argb, ViewingConditions.DEFAULT);
    }
    /**
     * @param argb ARGB representation of a color.
     * @param viewingConditions Information about the environment where the color
     *     was observed.
     * @return CAM16 color.
     */
    static fromIntInViewingConditions(argb, viewingConditions) {
      const red = (argb & 16711680) >> 16;
      const green = (argb & 65280) >> 8;
      const blue = argb & 255;
      const redL = linearized(red);
      const greenL = linearized(green);
      const blueL = linearized(blue);
      const x3 = 0.41233895 * redL + 0.35762064 * greenL + 0.18051042 * blueL;
      const y4 = 0.2126 * redL + 0.7152 * greenL + 0.0722 * blueL;
      const z2 = 0.01932141 * redL + 0.11916382 * greenL + 0.95034478 * blueL;
      const rC = 0.401288 * x3 + 0.650173 * y4 - 0.051461 * z2;
      const gC = -0.250268 * x3 + 1.204414 * y4 + 0.045854 * z2;
      const bC = -2079e-6 * x3 + 0.048952 * y4 + 0.953127 * z2;
      const rD = viewingConditions.rgbD[0] * rC;
      const gD = viewingConditions.rgbD[1] * gC;
      const bD = viewingConditions.rgbD[2] * bC;
      const rAF = Math.pow(viewingConditions.fl * Math.abs(rD) / 100, 0.42);
      const gAF = Math.pow(viewingConditions.fl * Math.abs(gD) / 100, 0.42);
      const bAF = Math.pow(viewingConditions.fl * Math.abs(bD) / 100, 0.42);
      const rA = signum(rD) * 400 * rAF / (rAF + 27.13);
      const gA = signum(gD) * 400 * gAF / (gAF + 27.13);
      const bA = signum(bD) * 400 * bAF / (bAF + 27.13);
      const a7 = (11 * rA + -12 * gA + bA) / 11;
      const b4 = (rA + gA - 2 * bA) / 9;
      const u6 = (20 * rA + 20 * gA + 21 * bA) / 20;
      const p22 = (40 * rA + 20 * gA + bA) / 20;
      const atan2 = Math.atan2(b4, a7);
      const atanDegrees = atan2 * 180 / Math.PI;
      const hue = atanDegrees < 0 ? atanDegrees + 360 : atanDegrees >= 360 ? atanDegrees - 360 : atanDegrees;
      const hueRadians = hue * Math.PI / 180;
      const ac = p22 * viewingConditions.nbb;
      const j3 = 100 * Math.pow(ac / viewingConditions.aw, viewingConditions.c * viewingConditions.z);
      const q = 4 / viewingConditions.c * Math.sqrt(j3 / 100) * (viewingConditions.aw + 4) * viewingConditions.fLRoot;
      const huePrime = hue < 20.14 ? hue + 360 : hue;
      const eHue = 0.25 * (Math.cos(huePrime * Math.PI / 180 + 2) + 3.8);
      const p1 = 5e4 / 13 * eHue * viewingConditions.nc * viewingConditions.ncb;
      const t7 = p1 * Math.sqrt(a7 * a7 + b4 * b4) / (u6 + 0.305);
      const alpha = Math.pow(t7, 0.9) * Math.pow(1.64 - Math.pow(0.29, viewingConditions.n), 0.73);
      const c7 = alpha * Math.sqrt(j3 / 100);
      const m3 = c7 * viewingConditions.fLRoot;
      const s8 = 50 * Math.sqrt(alpha * viewingConditions.c / (viewingConditions.aw + 4));
      const jstar = (1 + 100 * 7e-3) * j3 / (1 + 7e-3 * j3);
      const mstar = 1 / 0.0228 * Math.log(1 + 0.0228 * m3);
      const astar = mstar * Math.cos(hueRadians);
      const bstar = mstar * Math.sin(hueRadians);
      return new _Cam16(hue, c7, j3, q, m3, s8, jstar, astar, bstar);
    }
    /**
     * @param j CAM16 lightness
     * @param c CAM16 chroma
     * @param h CAM16 hue
     */
    static fromJch(j3, c7, h7) {
      return _Cam16.fromJchInViewingConditions(j3, c7, h7, ViewingConditions.DEFAULT);
    }
    /**
     * @param j CAM16 lightness
     * @param c CAM16 chroma
     * @param h CAM16 hue
     * @param viewingConditions Information about the environment where the color
     *     was observed.
     */
    static fromJchInViewingConditions(j3, c7, h7, viewingConditions) {
      const q = 4 / viewingConditions.c * Math.sqrt(j3 / 100) * (viewingConditions.aw + 4) * viewingConditions.fLRoot;
      const m3 = c7 * viewingConditions.fLRoot;
      const alpha = c7 / Math.sqrt(j3 / 100);
      const s8 = 50 * Math.sqrt(alpha * viewingConditions.c / (viewingConditions.aw + 4));
      const hueRadians = h7 * Math.PI / 180;
      const jstar = (1 + 100 * 7e-3) * j3 / (1 + 7e-3 * j3);
      const mstar = 1 / 0.0228 * Math.log(1 + 0.0228 * m3);
      const astar = mstar * Math.cos(hueRadians);
      const bstar = mstar * Math.sin(hueRadians);
      return new _Cam16(h7, c7, j3, q, m3, s8, jstar, astar, bstar);
    }
    /**
     * @param jstar CAM16-UCS lightness.
     * @param astar CAM16-UCS a dimension. Like a* in L*a*b*, it is a Cartesian
     *     coordinate on the Y axis.
     * @param bstar CAM16-UCS b dimension. Like a* in L*a*b*, it is a Cartesian
     *     coordinate on the X axis.
     */
    static fromUcs(jstar, astar, bstar) {
      return _Cam16.fromUcsInViewingConditions(jstar, astar, bstar, ViewingConditions.DEFAULT);
    }
    /**
     * @param jstar CAM16-UCS lightness.
     * @param astar CAM16-UCS a dimension. Like a* in L*a*b*, it is a Cartesian
     *     coordinate on the Y axis.
     * @param bstar CAM16-UCS b dimension. Like a* in L*a*b*, it is a Cartesian
     *     coordinate on the X axis.
     * @param viewingConditions Information about the environment where the color
     *     was observed.
     */
    static fromUcsInViewingConditions(jstar, astar, bstar, viewingConditions) {
      const a7 = astar;
      const b4 = bstar;
      const m3 = Math.sqrt(a7 * a7 + b4 * b4);
      const M2 = (Math.exp(m3 * 0.0228) - 1) / 0.0228;
      const c7 = M2 / viewingConditions.fLRoot;
      let h7 = Math.atan2(b4, a7) * (180 / Math.PI);
      if (h7 < 0) {
        h7 += 360;
      }
      const j3 = jstar / (1 - (jstar - 100) * 7e-3);
      return _Cam16.fromJchInViewingConditions(j3, c7, h7, viewingConditions);
    }
    /**
     *  @return ARGB representation of color, assuming the color was viewed in
     *     default viewing conditions, which are near-identical to the default
     *     viewing conditions for sRGB.
     */
    toInt() {
      return this.viewed(ViewingConditions.DEFAULT);
    }
    /**
     * @param viewingConditions Information about the environment where the color
     *     will be viewed.
     * @return ARGB representation of color
     */
    viewed(viewingConditions) {
      const alpha = this.chroma === 0 || this.j === 0 ? 0 : this.chroma / Math.sqrt(this.j / 100);
      const t7 = Math.pow(alpha / Math.pow(1.64 - Math.pow(0.29, viewingConditions.n), 0.73), 1 / 0.9);
      const hRad = this.hue * Math.PI / 180;
      const eHue = 0.25 * (Math.cos(hRad + 2) + 3.8);
      const ac = viewingConditions.aw * Math.pow(this.j / 100, 1 / viewingConditions.c / viewingConditions.z);
      const p1 = eHue * (5e4 / 13) * viewingConditions.nc * viewingConditions.ncb;
      const p22 = ac / viewingConditions.nbb;
      const hSin = Math.sin(hRad);
      const hCos = Math.cos(hRad);
      const gamma = 23 * (p22 + 0.305) * t7 / (23 * p1 + 11 * t7 * hCos + 108 * t7 * hSin);
      const a7 = gamma * hCos;
      const b4 = gamma * hSin;
      const rA = (460 * p22 + 451 * a7 + 288 * b4) / 1403;
      const gA = (460 * p22 - 891 * a7 - 261 * b4) / 1403;
      const bA = (460 * p22 - 220 * a7 - 6300 * b4) / 1403;
      const rCBase = Math.max(0, 27.13 * Math.abs(rA) / (400 - Math.abs(rA)));
      const rC = signum(rA) * (100 / viewingConditions.fl) * Math.pow(rCBase, 1 / 0.42);
      const gCBase = Math.max(0, 27.13 * Math.abs(gA) / (400 - Math.abs(gA)));
      const gC = signum(gA) * (100 / viewingConditions.fl) * Math.pow(gCBase, 1 / 0.42);
      const bCBase = Math.max(0, 27.13 * Math.abs(bA) / (400 - Math.abs(bA)));
      const bC = signum(bA) * (100 / viewingConditions.fl) * Math.pow(bCBase, 1 / 0.42);
      const rF = rC / viewingConditions.rgbD[0];
      const gF = gC / viewingConditions.rgbD[1];
      const bF = bC / viewingConditions.rgbD[2];
      const x3 = 1.86206786 * rF - 1.01125463 * gF + 0.14918677 * bF;
      const y4 = 0.38752654 * rF + 0.62144744 * gF - 897398e-8 * bF;
      const z2 = -0.0158415 * rF - 0.03412294 * gF + 1.04996444 * bF;
      const argb = argbFromXyz(x3, y4, z2);
      return argb;
    }
    /// Given color expressed in XYZ and viewed in [viewingConditions], convert to
    /// CAM16.
    static fromXyzInViewingConditions(x3, y4, z2, viewingConditions) {
      const rC = 0.401288 * x3 + 0.650173 * y4 - 0.051461 * z2;
      const gC = -0.250268 * x3 + 1.204414 * y4 + 0.045854 * z2;
      const bC = -2079e-6 * x3 + 0.048952 * y4 + 0.953127 * z2;
      const rD = viewingConditions.rgbD[0] * rC;
      const gD = viewingConditions.rgbD[1] * gC;
      const bD = viewingConditions.rgbD[2] * bC;
      const rAF = Math.pow(viewingConditions.fl * Math.abs(rD) / 100, 0.42);
      const gAF = Math.pow(viewingConditions.fl * Math.abs(gD) / 100, 0.42);
      const bAF = Math.pow(viewingConditions.fl * Math.abs(bD) / 100, 0.42);
      const rA = signum(rD) * 400 * rAF / (rAF + 27.13);
      const gA = signum(gD) * 400 * gAF / (gAF + 27.13);
      const bA = signum(bD) * 400 * bAF / (bAF + 27.13);
      const a7 = (11 * rA + -12 * gA + bA) / 11;
      const b4 = (rA + gA - 2 * bA) / 9;
      const u6 = (20 * rA + 20 * gA + 21 * bA) / 20;
      const p22 = (40 * rA + 20 * gA + bA) / 20;
      const atan2 = Math.atan2(b4, a7);
      const atanDegrees = atan2 * 180 / Math.PI;
      const hue = atanDegrees < 0 ? atanDegrees + 360 : atanDegrees >= 360 ? atanDegrees - 360 : atanDegrees;
      const hueRadians = hue * Math.PI / 180;
      const ac = p22 * viewingConditions.nbb;
      const J = 100 * Math.pow(ac / viewingConditions.aw, viewingConditions.c * viewingConditions.z);
      const Q = 4 / viewingConditions.c * Math.sqrt(J / 100) * (viewingConditions.aw + 4) * viewingConditions.fLRoot;
      const huePrime = hue < 20.14 ? hue + 360 : hue;
      const eHue = 1 / 4 * (Math.cos(huePrime * Math.PI / 180 + 2) + 3.8);
      const p1 = 5e4 / 13 * eHue * viewingConditions.nc * viewingConditions.ncb;
      const t7 = p1 * Math.sqrt(a7 * a7 + b4 * b4) / (u6 + 0.305);
      const alpha = Math.pow(t7, 0.9) * Math.pow(1.64 - Math.pow(0.29, viewingConditions.n), 0.73);
      const C2 = alpha * Math.sqrt(J / 100);
      const M2 = C2 * viewingConditions.fLRoot;
      const s8 = 50 * Math.sqrt(alpha * viewingConditions.c / (viewingConditions.aw + 4));
      const jstar = (1 + 100 * 7e-3) * J / (1 + 7e-3 * J);
      const mstar = Math.log(1 + 0.0228 * M2) / 0.0228;
      const astar = mstar * Math.cos(hueRadians);
      const bstar = mstar * Math.sin(hueRadians);
      return new _Cam16(hue, C2, J, Q, M2, s8, jstar, astar, bstar);
    }
    /// XYZ representation of CAM16 seen in [viewingConditions].
    xyzInViewingConditions(viewingConditions) {
      const alpha = this.chroma === 0 || this.j === 0 ? 0 : this.chroma / Math.sqrt(this.j / 100);
      const t7 = Math.pow(alpha / Math.pow(1.64 - Math.pow(0.29, viewingConditions.n), 0.73), 1 / 0.9);
      const hRad = this.hue * Math.PI / 180;
      const eHue = 0.25 * (Math.cos(hRad + 2) + 3.8);
      const ac = viewingConditions.aw * Math.pow(this.j / 100, 1 / viewingConditions.c / viewingConditions.z);
      const p1 = eHue * (5e4 / 13) * viewingConditions.nc * viewingConditions.ncb;
      const p22 = ac / viewingConditions.nbb;
      const hSin = Math.sin(hRad);
      const hCos = Math.cos(hRad);
      const gamma = 23 * (p22 + 0.305) * t7 / (23 * p1 + 11 * t7 * hCos + 108 * t7 * hSin);
      const a7 = gamma * hCos;
      const b4 = gamma * hSin;
      const rA = (460 * p22 + 451 * a7 + 288 * b4) / 1403;
      const gA = (460 * p22 - 891 * a7 - 261 * b4) / 1403;
      const bA = (460 * p22 - 220 * a7 - 6300 * b4) / 1403;
      const rCBase = Math.max(0, 27.13 * Math.abs(rA) / (400 - Math.abs(rA)));
      const rC = signum(rA) * (100 / viewingConditions.fl) * Math.pow(rCBase, 1 / 0.42);
      const gCBase = Math.max(0, 27.13 * Math.abs(gA) / (400 - Math.abs(gA)));
      const gC = signum(gA) * (100 / viewingConditions.fl) * Math.pow(gCBase, 1 / 0.42);
      const bCBase = Math.max(0, 27.13 * Math.abs(bA) / (400 - Math.abs(bA)));
      const bC = signum(bA) * (100 / viewingConditions.fl) * Math.pow(bCBase, 1 / 0.42);
      const rF = rC / viewingConditions.rgbD[0];
      const gF = gC / viewingConditions.rgbD[1];
      const bF = bC / viewingConditions.rgbD[2];
      const x3 = 1.86206786 * rF - 1.01125463 * gF + 0.14918677 * bF;
      const y4 = 0.38752654 * rF + 0.62144744 * gF - 897398e-8 * bF;
      const z2 = -0.0158415 * rF - 0.03412294 * gF + 1.04996444 * bF;
      return [x3, y4, z2];
    }
  };

  // node_modules/@material/material-color-utilities/hct/hct_solver.js
  var HctSolver = class _HctSolver {
    /**
     * Sanitizes a small enough angle in radians.
     *
     * @param angle An angle in radians; must not deviate too much
     * from 0.
     * @return A coterminal angle between 0 and 2pi.
     */
    static sanitizeRadians(angle) {
      return (angle + Math.PI * 8) % (Math.PI * 2);
    }
    /**
     * Delinearizes an RGB component, returning a floating-point
     * number.
     *
     * @param rgbComponent 0.0 <= rgb_component <= 100.0, represents
     * linear R/G/B channel
     * @return 0.0 <= output <= 255.0, color channel converted to
     * regular RGB space
     */
    static trueDelinearized(rgbComponent) {
      const normalized = rgbComponent / 100;
      let delinearized2 = 0;
      if (normalized <= 31308e-7) {
        delinearized2 = normalized * 12.92;
      } else {
        delinearized2 = 1.055 * Math.pow(normalized, 1 / 2.4) - 0.055;
      }
      return delinearized2 * 255;
    }
    static chromaticAdaptation(component) {
      const af = Math.pow(Math.abs(component), 0.42);
      return signum(component) * 400 * af / (af + 27.13);
    }
    /**
     * Returns the hue of a linear RGB color in CAM16.
     *
     * @param linrgb The linear RGB coordinates of a color.
     * @return The hue of the color in CAM16, in radians.
     */
    static hueOf(linrgb) {
      const scaledDiscount = matrixMultiply(linrgb, _HctSolver.SCALED_DISCOUNT_FROM_LINRGB);
      const rA = _HctSolver.chromaticAdaptation(scaledDiscount[0]);
      const gA = _HctSolver.chromaticAdaptation(scaledDiscount[1]);
      const bA = _HctSolver.chromaticAdaptation(scaledDiscount[2]);
      const a7 = (11 * rA + -12 * gA + bA) / 11;
      const b4 = (rA + gA - 2 * bA) / 9;
      return Math.atan2(b4, a7);
    }
    static areInCyclicOrder(a7, b4, c7) {
      const deltaAB = _HctSolver.sanitizeRadians(b4 - a7);
      const deltaAC = _HctSolver.sanitizeRadians(c7 - a7);
      return deltaAB < deltaAC;
    }
    /**
     * Solves the lerp equation.
     *
     * @param source The starting number.
     * @param mid The number in the middle.
     * @param target The ending number.
     * @return A number t such that lerp(source, target, t) = mid.
     */
    static intercept(source, mid, target) {
      return (mid - source) / (target - source);
    }
    static lerpPoint(source, t7, target) {
      return [
        source[0] + (target[0] - source[0]) * t7,
        source[1] + (target[1] - source[1]) * t7,
        source[2] + (target[2] - source[2]) * t7
      ];
    }
    /**
     * Intersects a segment with a plane.
     *
     * @param source The coordinates of point A.
     * @param coordinate The R-, G-, or B-coordinate of the plane.
     * @param target The coordinates of point B.
     * @param axis The axis the plane is perpendicular with. (0: R, 1:
     * G, 2: B)
     * @return The intersection point of the segment AB with the plane
     * R=coordinate, G=coordinate, or B=coordinate
     */
    static setCoordinate(source, coordinate, target, axis) {
      const t7 = _HctSolver.intercept(source[axis], coordinate, target[axis]);
      return _HctSolver.lerpPoint(source, t7, target);
    }
    static isBounded(x3) {
      return 0 <= x3 && x3 <= 100;
    }
    /**
     * Returns the nth possible vertex of the polygonal intersection.
     *
     * @param y The Y value of the plane.
     * @param n The zero-based index of the point. 0 <= n <= 11.
     * @return The nth possible vertex of the polygonal intersection
     * of the y plane and the RGB cube, in linear RGB coordinates, if
     * it exists. If this possible vertex lies outside of the cube,
     * [-1.0, -1.0, -1.0] is returned.
     */
    static nthVertex(y4, n13) {
      const kR = _HctSolver.Y_FROM_LINRGB[0];
      const kG = _HctSolver.Y_FROM_LINRGB[1];
      const kB = _HctSolver.Y_FROM_LINRGB[2];
      const coordA = n13 % 4 <= 1 ? 0 : 100;
      const coordB = n13 % 2 === 0 ? 0 : 100;
      if (n13 < 4) {
        const g4 = coordA;
        const b4 = coordB;
        const r8 = (y4 - g4 * kG - b4 * kB) / kR;
        if (_HctSolver.isBounded(r8)) {
          return [r8, g4, b4];
        } else {
          return [-1, -1, -1];
        }
      } else if (n13 < 8) {
        const b4 = coordA;
        const r8 = coordB;
        const g4 = (y4 - r8 * kR - b4 * kB) / kG;
        if (_HctSolver.isBounded(g4)) {
          return [r8, g4, b4];
        } else {
          return [-1, -1, -1];
        }
      } else {
        const r8 = coordA;
        const g4 = coordB;
        const b4 = (y4 - r8 * kR - g4 * kG) / kB;
        if (_HctSolver.isBounded(b4)) {
          return [r8, g4, b4];
        } else {
          return [-1, -1, -1];
        }
      }
    }
    /**
     * Finds the segment containing the desired color.
     *
     * @param y The Y value of the color.
     * @param targetHue The hue of the color.
     * @return A list of two sets of linear RGB coordinates, each
     * corresponding to an endpoint of the segment containing the
     * desired color.
     */
    static bisectToSegment(y4, targetHue) {
      let left = [-1, -1, -1];
      let right = left;
      let leftHue = 0;
      let rightHue = 0;
      let initialized = false;
      let uncut = true;
      for (let n13 = 0; n13 < 12; n13++) {
        const mid = _HctSolver.nthVertex(y4, n13);
        if (mid[0] < 0) {
          continue;
        }
        const midHue = _HctSolver.hueOf(mid);
        if (!initialized) {
          left = mid;
          right = mid;
          leftHue = midHue;
          rightHue = midHue;
          initialized = true;
          continue;
        }
        if (uncut || _HctSolver.areInCyclicOrder(leftHue, midHue, rightHue)) {
          uncut = false;
          if (_HctSolver.areInCyclicOrder(leftHue, targetHue, midHue)) {
            right = mid;
            rightHue = midHue;
          } else {
            left = mid;
            leftHue = midHue;
          }
        }
      }
      return [left, right];
    }
    static midpoint(a7, b4) {
      return [
        (a7[0] + b4[0]) / 2,
        (a7[1] + b4[1]) / 2,
        (a7[2] + b4[2]) / 2
      ];
    }
    static criticalPlaneBelow(x3) {
      return Math.floor(x3 - 0.5);
    }
    static criticalPlaneAbove(x3) {
      return Math.ceil(x3 - 0.5);
    }
    /**
     * Finds a color with the given Y and hue on the boundary of the
     * cube.
     *
     * @param y The Y value of the color.
     * @param targetHue The hue of the color.
     * @return The desired color, in linear RGB coordinates.
     */
    static bisectToLimit(y4, targetHue) {
      const segment = _HctSolver.bisectToSegment(y4, targetHue);
      let left = segment[0];
      let leftHue = _HctSolver.hueOf(left);
      let right = segment[1];
      for (let axis = 0; axis < 3; axis++) {
        if (left[axis] !== right[axis]) {
          let lPlane = -1;
          let rPlane = 255;
          if (left[axis] < right[axis]) {
            lPlane = _HctSolver.criticalPlaneBelow(_HctSolver.trueDelinearized(left[axis]));
            rPlane = _HctSolver.criticalPlaneAbove(_HctSolver.trueDelinearized(right[axis]));
          } else {
            lPlane = _HctSolver.criticalPlaneAbove(_HctSolver.trueDelinearized(left[axis]));
            rPlane = _HctSolver.criticalPlaneBelow(_HctSolver.trueDelinearized(right[axis]));
          }
          for (let i10 = 0; i10 < 8; i10++) {
            if (Math.abs(rPlane - lPlane) <= 1) {
              break;
            } else {
              const mPlane = Math.floor((lPlane + rPlane) / 2);
              const midPlaneCoordinate = _HctSolver.CRITICAL_PLANES[mPlane];
              const mid = _HctSolver.setCoordinate(left, midPlaneCoordinate, right, axis);
              const midHue = _HctSolver.hueOf(mid);
              if (_HctSolver.areInCyclicOrder(leftHue, targetHue, midHue)) {
                right = mid;
                rPlane = mPlane;
              } else {
                left = mid;
                leftHue = midHue;
                lPlane = mPlane;
              }
            }
          }
        }
      }
      return _HctSolver.midpoint(left, right);
    }
    static inverseChromaticAdaptation(adapted) {
      const adaptedAbs = Math.abs(adapted);
      const base = Math.max(0, 27.13 * adaptedAbs / (400 - adaptedAbs));
      return signum(adapted) * Math.pow(base, 1 / 0.42);
    }
    /**
     * Finds a color with the given hue, chroma, and Y.
     *
     * @param hueRadians The desired hue in radians.
     * @param chroma The desired chroma.
     * @param y The desired Y.
     * @return The desired color as a hexadecimal integer, if found; 0
     * otherwise.
     */
    static findResultByJ(hueRadians, chroma, y4) {
      let j3 = Math.sqrt(y4) * 11;
      const viewingConditions = ViewingConditions.DEFAULT;
      const tInnerCoeff = 1 / Math.pow(1.64 - Math.pow(0.29, viewingConditions.n), 0.73);
      const eHue = 0.25 * (Math.cos(hueRadians + 2) + 3.8);
      const p1 = eHue * (5e4 / 13) * viewingConditions.nc * viewingConditions.ncb;
      const hSin = Math.sin(hueRadians);
      const hCos = Math.cos(hueRadians);
      for (let iterationRound = 0; iterationRound < 5; iterationRound++) {
        const jNormalized = j3 / 100;
        const alpha = chroma === 0 || j3 === 0 ? 0 : chroma / Math.sqrt(jNormalized);
        const t7 = Math.pow(alpha * tInnerCoeff, 1 / 0.9);
        const ac = viewingConditions.aw * Math.pow(jNormalized, 1 / viewingConditions.c / viewingConditions.z);
        const p22 = ac / viewingConditions.nbb;
        const gamma = 23 * (p22 + 0.305) * t7 / (23 * p1 + 11 * t7 * hCos + 108 * t7 * hSin);
        const a7 = gamma * hCos;
        const b4 = gamma * hSin;
        const rA = (460 * p22 + 451 * a7 + 288 * b4) / 1403;
        const gA = (460 * p22 - 891 * a7 - 261 * b4) / 1403;
        const bA = (460 * p22 - 220 * a7 - 6300 * b4) / 1403;
        const rCScaled = _HctSolver.inverseChromaticAdaptation(rA);
        const gCScaled = _HctSolver.inverseChromaticAdaptation(gA);
        const bCScaled = _HctSolver.inverseChromaticAdaptation(bA);
        const linrgb = matrixMultiply([rCScaled, gCScaled, bCScaled], _HctSolver.LINRGB_FROM_SCALED_DISCOUNT);
        if (linrgb[0] < 0 || linrgb[1] < 0 || linrgb[2] < 0) {
          return 0;
        }
        const kR = _HctSolver.Y_FROM_LINRGB[0];
        const kG = _HctSolver.Y_FROM_LINRGB[1];
        const kB = _HctSolver.Y_FROM_LINRGB[2];
        const fnj = kR * linrgb[0] + kG * linrgb[1] + kB * linrgb[2];
        if (fnj <= 0) {
          return 0;
        }
        if (iterationRound === 4 || Math.abs(fnj - y4) < 2e-3) {
          if (linrgb[0] > 100.01 || linrgb[1] > 100.01 || linrgb[2] > 100.01) {
            return 0;
          }
          return argbFromLinrgb(linrgb);
        }
        j3 = j3 - (fnj - y4) * j3 / (2 * fnj);
      }
      return 0;
    }
    /**
     * Finds an sRGB color with the given hue, chroma, and L*, if
     * possible.
     *
     * @param hueDegrees The desired hue, in degrees.
     * @param chroma The desired chroma.
     * @param lstar The desired L*.
     * @return A hexadecimal representing the sRGB color. The color
     * has sufficiently close hue, chroma, and L* to the desired
     * values, if possible; otherwise, the hue and L* will be
     * sufficiently close, and chroma will be maximized.
     */
    static solveToInt(hueDegrees, chroma, lstar) {
      if (chroma < 1e-4 || lstar < 1e-4 || lstar > 99.9999) {
        return argbFromLstar(lstar);
      }
      hueDegrees = sanitizeDegreesDouble(hueDegrees);
      const hueRadians = hueDegrees / 180 * Math.PI;
      const y4 = yFromLstar(lstar);
      const exactAnswer = _HctSolver.findResultByJ(hueRadians, chroma, y4);
      if (exactAnswer !== 0) {
        return exactAnswer;
      }
      const linrgb = _HctSolver.bisectToLimit(y4, hueRadians);
      return argbFromLinrgb(linrgb);
    }
    /**
     * Finds an sRGB color with the given hue, chroma, and L*, if
     * possible.
     *
     * @param hueDegrees The desired hue, in degrees.
     * @param chroma The desired chroma.
     * @param lstar The desired L*.
     * @return An CAM16 object representing the sRGB color. The color
     * has sufficiently close hue, chroma, and L* to the desired
     * values, if possible; otherwise, the hue and L* will be
     * sufficiently close, and chroma will be maximized.
     */
    static solveToCam(hueDegrees, chroma, lstar) {
      return Cam16.fromInt(_HctSolver.solveToInt(hueDegrees, chroma, lstar));
    }
  };
  HctSolver.SCALED_DISCOUNT_FROM_LINRGB = [
    [
      0.001200833568784504,
      0.002389694492170889,
      2795742885861124e-19
    ],
    [
      5891086651375999e-19,
      0.0029785502573438758,
      3270666104008398e-19
    ],
    [
      10146692491640572e-20,
      5364214359186694e-19,
      0.0032979401770712076
    ]
  ];
  HctSolver.LINRGB_FROM_SCALED_DISCOUNT = [
    [
      1373.2198709594231,
      -1100.4251190754821,
      -7.278681089101213
    ],
    [
      -271.815969077903,
      559.6580465940733,
      -32.46047482791194
    ],
    [
      1.9622899599665666,
      -57.173814538844006,
      308.7233197812385
    ]
  ];
  HctSolver.Y_FROM_LINRGB = [0.2126, 0.7152, 0.0722];
  HctSolver.CRITICAL_PLANES = [
    0.015176349177441876,
    0.045529047532325624,
    0.07588174588720938,
    0.10623444424209313,
    0.13658714259697685,
    0.16693984095186062,
    0.19729253930674434,
    0.2276452376616281,
    0.2579979360165119,
    0.28835063437139563,
    0.3188300904430532,
    0.350925934958123,
    0.3848314933096426,
    0.42057480301049466,
    0.458183274052838,
    0.4976837250274023,
    0.5391024159806381,
    0.5824650784040898,
    0.6277969426914107,
    0.6751227633498623,
    0.7244668422128921,
    0.775853049866786,
    0.829304845476233,
    0.8848452951698498,
    0.942497089126609,
    1.0022825574869039,
    1.0642236851973577,
    1.1283421258858297,
    1.1946592148522128,
    1.2631959812511864,
    1.3339731595349034,
    1.407011200216447,
    1.4823302800086415,
    1.5599503113873272,
    1.6398909516233677,
    1.7221716113234105,
    1.8068114625156377,
    1.8938294463134073,
    1.9832442801866852,
    2.075074464868551,
    2.1693382909216234,
    2.2660538449872063,
    2.36523901573795,
    2.4669114995532007,
    2.5710888059345764,
    2.6777882626779785,
    2.7870270208169257,
    2.898822059350997,
    3.0131901897720907,
    3.1301480604002863,
    3.2497121605402226,
    3.3718988244681087,
    3.4967242352587946,
    3.624204428461639,
    3.754355295633311,
    3.887192587735158,
    4.022731918402185,
    4.160988767090289,
    4.301978482107941,
    4.445716283538092,
    4.592217266055746,
    4.741496401646282,
    4.893568542229298,
    5.048448422192488,
    5.20615066083972,
    5.3666897647573375,
    5.5300801301023865,
    5.696336044816294,
    5.865471690767354,
    6.037501145825082,
    6.212438385869475,
    6.390297286737924,
    6.571091626112461,
    6.7548350853498045,
    6.941541251256611,
    7.131223617812143,
    7.323895587840543,
    7.5195704746346665,
    7.7182615035334345,
    7.919981813454504,
    8.124744458384042,
    8.332562408825165,
    8.543448553206703,
    8.757415699253682,
    8.974476575321063,
    9.194643831691977,
    9.417930041841839,
    9.644347703669503,
    9.873909240696694,
    10.106627003236781,
    10.342513269534024,
    10.58158024687427,
    10.8238400726681,
    11.069304815507364,
    11.317986476196008,
    11.569896988756009,
    11.825048221409341,
    12.083451977536606,
    12.345119996613247,
    12.610063955123938,
    12.878295467455942,
    13.149826086772048,
    13.42466730586372,
    13.702830557985108,
    13.984327217668513,
    14.269168601521828,
    14.55736596900856,
    14.848930523210871,
    15.143873411576273,
    15.44220572664832,
    15.743938506781891,
    16.04908273684337,
    16.35764934889634,
    16.66964922287304,
    16.985093187232053,
    17.30399201960269,
    17.62635644741625,
    17.95219714852476,
    18.281524751807332,
    18.614349837764564,
    18.95068293910138,
    19.290534541298456,
    19.633915083172692,
    19.98083495742689,
    20.331304511189067,
    20.685334046541502,
    21.042933821039977,
    21.404114048223256,
    21.76888489811322,
    22.137256497705877,
    22.50923893145328,
    22.884842241736916,
    23.264076429332462,
    23.6469514538663,
    24.033477234264016,
    24.42366364919083,
    24.817520537484558,
    25.21505769858089,
    25.61628489293138,
    26.021211842414342,
    26.429848230738664,
    26.842203703840827,
    27.258287870275353,
    27.678110301598522,
    28.10168053274597,
    28.529008062403893,
    28.96010235337422,
    29.39497283293396,
    29.83362889318845,
    30.276079891419332,
    30.722335150426627,
    31.172403958865512,
    31.62629557157785,
    32.08401920991837,
    32.54558406207592,
    33.010999283389665,
    33.4802739966603,
    33.953417292456834,
    34.430438229418264,
    34.911345834551085,
    35.39614910352207,
    35.88485700094671,
    36.37747846067349,
    36.87402238606382,
    37.37449765026789,
    37.87891309649659,
    38.38727753828926,
    38.89959975977785,
    39.41588851594697,
    39.93615253289054,
    40.460400508064545,
    40.98864111053629,
    41.520882981230194,
    42.05713473317016,
    42.597404951718396,
    43.141702194811224,
    43.6900349931913,
    44.24241185063697,
    44.798841244188324,
    45.35933162437017,
    45.92389141541209,
    46.49252901546552,
    47.065252796817916,
    47.64207110610409,
    48.22299226451468,
    48.808024568002054,
    49.3971762874833,
    49.9904556690408,
    50.587870934119984,
    51.189430279724725,
    51.79514187861014,
    52.40501387947288,
    53.0190544071392,
    53.637271562750364,
    54.259673423945976,
    54.88626804504493,
    55.517063457223934,
    56.15206766869424,
    56.79128866487574,
    57.43473440856916,
    58.08241284012621,
    58.734331877617365,
    59.39049941699807,
    60.05092333227251,
    60.715611475655585,
    61.38457167773311,
    62.057811747619894,
    62.7353394731159,
    63.417162620860914,
    64.10328893648692,
    64.79372614476921,
    65.48848194977529,
    66.18756403501224,
    66.89098006357258,
    67.59873767827808,
    68.31084450182222,
    69.02730813691093,
    69.74813616640164,
    70.47333615344107,
    71.20291564160104,
    71.93688215501312,
    72.67524319850172,
    73.41800625771542,
    74.16517879925733,
    74.9167682708136,
    75.67278210128072,
    76.43322770089146,
    77.1981124613393,
    77.96744375590167,
    78.74122893956174,
    79.51947534912904,
    80.30219030335869,
    81.08938110306934,
    81.88105503125999,
    82.67721935322541,
    83.4778813166706,
    84.28304815182372,
    85.09272707154808,
    85.90692527145302,
    86.72564993000343,
    87.54890820862819,
    88.3767072518277,
    89.2090541872801,
    90.04595612594655,
    90.88742016217518,
    91.73345337380438,
    92.58406282226491,
    93.43925555268066,
    94.29903859396902,
    95.16341895893969,
    96.03240364439274,
    96.9059996312159,
    97.78421388448044,
    98.6670533535366,
    99.55452497210776
  ];

  // node_modules/@material/material-color-utilities/hct/hct.js
  var Hct = class _Hct {
    static from(hue, chroma, tone) {
      return new _Hct(HctSolver.solveToInt(hue, chroma, tone));
    }
    /**
     * @param argb ARGB representation of a color.
     * @return HCT representation of a color in default viewing conditions
     */
    static fromInt(argb) {
      return new _Hct(argb);
    }
    toInt() {
      return this.argb;
    }
    /**
     * A number, in degrees, representing ex. red, orange, yellow, etc.
     * Ranges from 0 <= hue < 360.
     */
    get hue() {
      return this.internalHue;
    }
    /**
     * @param newHue 0 <= newHue < 360; invalid values are corrected.
     * Chroma may decrease because chroma has a different maximum for any given
     * hue and tone.
     */
    set hue(newHue) {
      this.setInternalState(HctSolver.solveToInt(newHue, this.internalChroma, this.internalTone));
    }
    get chroma() {
      return this.internalChroma;
    }
    /**
     * @param newChroma 0 <= newChroma < ?
     * Chroma may decrease because chroma has a different maximum for any given
     * hue and tone.
     */
    set chroma(newChroma) {
      this.setInternalState(HctSolver.solveToInt(this.internalHue, newChroma, this.internalTone));
    }
    /** Lightness. Ranges from 0 to 100. */
    get tone() {
      return this.internalTone;
    }
    /**
     * @param newTone 0 <= newTone <= 100; invalid valids are corrected.
     * Chroma may decrease because chroma has a different maximum for any given
     * hue and tone.
     */
    set tone(newTone) {
      this.setInternalState(HctSolver.solveToInt(this.internalHue, this.internalChroma, newTone));
    }
    constructor(argb) {
      this.argb = argb;
      const cam = Cam16.fromInt(argb);
      this.internalHue = cam.hue;
      this.internalChroma = cam.chroma;
      this.internalTone = lstarFromArgb(argb);
      this.argb = argb;
    }
    setInternalState(argb) {
      const cam = Cam16.fromInt(argb);
      this.internalHue = cam.hue;
      this.internalChroma = cam.chroma;
      this.internalTone = lstarFromArgb(argb);
      this.argb = argb;
    }
    /**
     * Translates a color into different [ViewingConditions].
     *
     * Colors change appearance. They look different with lights on versus off,
     * the same color, as in hex code, on white looks different when on black.
     * This is called color relativity, most famously explicated by Josef Albers
     * in Interaction of Color.
     *
     * In color science, color appearance models can account for this and
     * calculate the appearance of a color in different settings. HCT is based on
     * CAM16, a color appearance model, and uses it to make these calculations.
     *
     * See [ViewingConditions.make] for parameters affecting color appearance.
     */
    inViewingConditions(vc) {
      const cam = Cam16.fromInt(this.toInt());
      const viewedInVc = cam.xyzInViewingConditions(vc);
      const recastInVc = Cam16.fromXyzInViewingConditions(viewedInVc[0], viewedInVc[1], viewedInVc[2], ViewingConditions.make());
      const recastHct = _Hct.from(recastInVc.hue, recastInVc.chroma, lstarFromY(viewedInVc[1]));
      return recastHct;
    }
  };

  // node_modules/@material/material-color-utilities/contrast/contrast.js
  var Contrast = class _Contrast {
    /**
     * Returns a contrast ratio, which ranges from 1 to 21.
     *
     * @param toneA Tone between 0 and 100. Values outside will be clamped.
     * @param toneB Tone between 0 and 100. Values outside will be clamped.
     */
    static ratioOfTones(toneA, toneB) {
      toneA = clampDouble(0, 100, toneA);
      toneB = clampDouble(0, 100, toneB);
      return _Contrast.ratioOfYs(yFromLstar(toneA), yFromLstar(toneB));
    }
    static ratioOfYs(y1, y22) {
      const lighter = y1 > y22 ? y1 : y22;
      const darker = lighter === y22 ? y1 : y22;
      return (lighter + 5) / (darker + 5);
    }
    /**
     * Returns a tone >= tone parameter that ensures ratio parameter.
     * Return value is between 0 and 100.
     * Returns -1 if ratio cannot be achieved with tone parameter.
     *
     * @param tone Tone return value must contrast with.
     * Range is 0 to 100. Invalid values will result in -1 being returned.
     * @param ratio Contrast ratio of return value and tone.
     * Range is 1 to 21, invalid values have undefined behavior.
     */
    static lighter(tone, ratio) {
      if (tone < 0 || tone > 100) {
        return -1;
      }
      const darkY = yFromLstar(tone);
      const lightY = ratio * (darkY + 5) - 5;
      const realContrast = _Contrast.ratioOfYs(lightY, darkY);
      const delta = Math.abs(realContrast - ratio);
      if (realContrast < ratio && delta > 0.04) {
        return -1;
      }
      const returnValue = lstarFromY(lightY) + 0.4;
      if (returnValue < 0 || returnValue > 100) {
        return -1;
      }
      return returnValue;
    }
    /**
     * Returns a tone <= tone parameter that ensures ratio parameter.
     * Return value is between 0 and 100.
     * Returns -1 if ratio cannot be achieved with tone parameter.
     *
     * @param tone Tone return value must contrast with.
     * Range is 0 to 100. Invalid values will result in -1 being returned.
     * @param ratio Contrast ratio of return value and tone.
     * Range is 1 to 21, invalid values have undefined behavior.
     */
    static darker(tone, ratio) {
      if (tone < 0 || tone > 100) {
        return -1;
      }
      const lightY = yFromLstar(tone);
      const darkY = (lightY + 5) / ratio - 5;
      const realContrast = _Contrast.ratioOfYs(lightY, darkY);
      const delta = Math.abs(realContrast - ratio);
      if (realContrast < ratio && delta > 0.04) {
        return -1;
      }
      const returnValue = lstarFromY(darkY) - 0.4;
      if (returnValue < 0 || returnValue > 100) {
        return -1;
      }
      return returnValue;
    }
    /**
     * Returns a tone >= tone parameter that ensures ratio parameter.
     * Return value is between 0 and 100.
     * Returns 100 if ratio cannot be achieved with tone parameter.
     *
     * This method is unsafe because the returned value is guaranteed to be in
     * bounds for tone, i.e. between 0 and 100. However, that value may not reach
     * the ratio with tone. For example, there is no color lighter than T100.
     *
     * @param tone Tone return value must contrast with.
     * Range is 0 to 100. Invalid values will result in 100 being returned.
     * @param ratio Desired contrast ratio of return value and tone parameter.
     * Range is 1 to 21, invalid values have undefined behavior.
     */
    static lighterUnsafe(tone, ratio) {
      const lighterSafe = _Contrast.lighter(tone, ratio);
      return lighterSafe < 0 ? 100 : lighterSafe;
    }
    /**
     * Returns a tone >= tone parameter that ensures ratio parameter.
     * Return value is between 0 and 100.
     * Returns 100 if ratio cannot be achieved with tone parameter.
     *
     * This method is unsafe because the returned value is guaranteed to be in
     * bounds for tone, i.e. between 0 and 100. However, that value may not reach
     * the [ratio with [tone]. For example, there is no color darker than T0.
     *
     * @param tone Tone return value must contrast with.
     * Range is 0 to 100. Invalid values will result in 0 being returned.
     * @param ratio Desired contrast ratio of return value and tone parameter.
     * Range is 1 to 21, invalid values have undefined behavior.
     */
    static darkerUnsafe(tone, ratio) {
      const darkerSafe = _Contrast.darker(tone, ratio);
      return darkerSafe < 0 ? 0 : darkerSafe;
    }
  };

  // node_modules/@material/material-color-utilities/dislike/dislike_analyzer.js
  var DislikeAnalyzer = class _DislikeAnalyzer {
    /**
     * Returns true if a color is disliked.
     *
     * @param hct A color to be judged.
     * @return Whether the color is disliked.
     *
     * Disliked is defined as a dark yellow-green that is not neutral.
     */
    static isDisliked(hct) {
      const huePasses = Math.round(hct.hue) >= 90 && Math.round(hct.hue) <= 111;
      const chromaPasses = Math.round(hct.chroma) > 16;
      const tonePasses = Math.round(hct.tone) < 65;
      return huePasses && chromaPasses && tonePasses;
    }
    /**
     * If a color is disliked, lighten it to make it likable.
     *
     * @param hct A color to be judged.
     * @return A new color if the original color is disliked, or the original
     *   color if it is acceptable.
     */
    static fixIfDisliked(hct) {
      if (_DislikeAnalyzer.isDisliked(hct)) {
        return Hct.from(hct.hue, hct.chroma, 70);
      }
      return hct;
    }
  };

  // node_modules/@material/material-color-utilities/dynamiccolor/dynamic_color.js
  var DynamicColor = class _DynamicColor {
    /**
     * Create a DynamicColor defined by a TonalPalette and HCT tone.
     *
     * @param args Functions with DynamicScheme as input. Must provide a palette
     * and tone. May provide a background DynamicColor and ToneDeltaConstraint.
     */
    static fromPalette(args) {
      return new _DynamicColor(args.name ?? "", args.palette, args.tone, args.isBackground ?? false, args.background, args.secondBackground, args.contrastCurve, args.toneDeltaPair);
    }
    /**
     * The base constructor for DynamicColor.
     *
     * _Strongly_ prefer using one of the convenience constructors. This class is
     * arguably too flexible to ensure it can support any scenario. Functional
     * arguments allow  overriding without risks that come with subclasses.
     *
     * For example, the default behavior of adjust tone at max contrast
     * to be at a 7.0 ratio with its background is principled and
     * matches accessibility guidance. That does not mean it's the desired
     * approach for _every_ design system, and every color pairing,
     * always, in every case.
     *
     * @param name The name of the dynamic color. Defaults to empty.
     * @param palette Function that provides a TonalPalette given
     * DynamicScheme. A TonalPalette is defined by a hue and chroma, so this
     * replaces the need to specify hue/chroma. By providing a tonal palette, when
     * contrast adjustments are made, intended chroma can be preserved.
     * @param tone Function that provides a tone, given a DynamicScheme.
     * @param isBackground Whether this dynamic color is a background, with
     * some other color as the foreground. Defaults to false.
     * @param background The background of the dynamic color (as a function of a
     *     `DynamicScheme`), if it exists.
     * @param secondBackground A second background of the dynamic color (as a
     *     function of a `DynamicScheme`), if it
     * exists.
     * @param contrastCurve A `ContrastCurve` object specifying how its contrast
     * against its background should behave in various contrast levels options.
     * @param toneDeltaPair A `ToneDeltaPair` object specifying a tone delta
     * constraint between two colors. One of them must be the color being
     * constructed.
     */
    constructor(name, palette, tone, isBackground, background, secondBackground, contrastCurve, toneDeltaPair) {
      this.name = name;
      this.palette = palette;
      this.tone = tone;
      this.isBackground = isBackground;
      this.background = background;
      this.secondBackground = secondBackground;
      this.contrastCurve = contrastCurve;
      this.toneDeltaPair = toneDeltaPair;
      this.hctCache = /* @__PURE__ */ new Map();
      if (!background && secondBackground) {
        throw new Error(`Color ${name} has secondBackgrounddefined, but background is not defined.`);
      }
      if (!background && contrastCurve) {
        throw new Error(`Color ${name} has contrastCurvedefined, but background is not defined.`);
      }
      if (background && !contrastCurve) {
        throw new Error(`Color ${name} has backgrounddefined, but contrastCurve is not defined.`);
      }
    }
    /**
     * Return a ARGB integer (i.e. a hex code).
     *
     * @param scheme Defines the conditions of the user interface, for example,
     * whether or not it is dark mode or light mode, and what the desired
     * contrast level is.
     */
    getArgb(scheme) {
      return this.getHct(scheme).toInt();
    }
    /**
     * Return a color, expressed in the HCT color space, that this
     * DynamicColor is under the conditions in scheme.
     *
     * @param scheme Defines the conditions of the user interface, for example,
     * whether or not it is dark mode or light mode, and what the desired
     * contrast level is.
     */
    getHct(scheme) {
      const cachedAnswer = this.hctCache.get(scheme);
      if (cachedAnswer != null) {
        return cachedAnswer;
      }
      const tone = this.getTone(scheme);
      const answer = this.palette(scheme).getHct(tone);
      if (this.hctCache.size > 4) {
        this.hctCache.clear();
      }
      this.hctCache.set(scheme, answer);
      return answer;
    }
    /**
     * Return a tone, T in the HCT color space, that this DynamicColor is under
     * the conditions in scheme.
     *
     * @param scheme Defines the conditions of the user interface, for example,
     * whether or not it is dark mode or light mode, and what the desired
     * contrast level is.
     */
    getTone(scheme) {
      const decreasingContrast = scheme.contrastLevel < 0;
      if (this.toneDeltaPair) {
        const toneDeltaPair = this.toneDeltaPair(scheme);
        const roleA = toneDeltaPair.roleA;
        const roleB = toneDeltaPair.roleB;
        const delta = toneDeltaPair.delta;
        const polarity = toneDeltaPair.polarity;
        const stayTogether = toneDeltaPair.stayTogether;
        const bg = this.background(scheme);
        const bgTone = bg.getTone(scheme);
        const aIsNearer = polarity === "nearer" || polarity === "lighter" && !scheme.isDark || polarity === "darker" && scheme.isDark;
        const nearer = aIsNearer ? roleA : roleB;
        const farther = aIsNearer ? roleB : roleA;
        const amNearer = this.name === nearer.name;
        const expansionDir = scheme.isDark ? 1 : -1;
        const nContrast = nearer.contrastCurve.getContrast(scheme.contrastLevel);
        const fContrast = farther.contrastCurve.getContrast(scheme.contrastLevel);
        const nInitialTone = nearer.tone(scheme);
        let nTone = Contrast.ratioOfTones(bgTone, nInitialTone) >= nContrast ? nInitialTone : _DynamicColor.foregroundTone(bgTone, nContrast);
        const fInitialTone = farther.tone(scheme);
        let fTone = Contrast.ratioOfTones(bgTone, fInitialTone) >= fContrast ? fInitialTone : _DynamicColor.foregroundTone(bgTone, fContrast);
        if (decreasingContrast) {
          nTone = _DynamicColor.foregroundTone(bgTone, nContrast);
          fTone = _DynamicColor.foregroundTone(bgTone, fContrast);
        }
        if ((fTone - nTone) * expansionDir >= delta) {
        } else {
          fTone = clampDouble(0, 100, nTone + delta * expansionDir);
          if ((fTone - nTone) * expansionDir >= delta) {
          } else {
            nTone = clampDouble(0, 100, fTone - delta * expansionDir);
          }
        }
        if (50 <= nTone && nTone < 60) {
          if (expansionDir > 0) {
            nTone = 60;
            fTone = Math.max(fTone, nTone + delta * expansionDir);
          } else {
            nTone = 49;
            fTone = Math.min(fTone, nTone + delta * expansionDir);
          }
        } else if (50 <= fTone && fTone < 60) {
          if (stayTogether) {
            if (expansionDir > 0) {
              nTone = 60;
              fTone = Math.max(fTone, nTone + delta * expansionDir);
            } else {
              nTone = 49;
              fTone = Math.min(fTone, nTone + delta * expansionDir);
            }
          } else {
            if (expansionDir > 0) {
              fTone = 60;
            } else {
              fTone = 49;
            }
          }
        }
        return amNearer ? nTone : fTone;
      } else {
        let answer = this.tone(scheme);
        if (this.background == null) {
          return answer;
        }
        const bgTone = this.background(scheme).getTone(scheme);
        const desiredRatio = this.contrastCurve.getContrast(scheme.contrastLevel);
        if (Contrast.ratioOfTones(bgTone, answer) >= desiredRatio) {
        } else {
          answer = _DynamicColor.foregroundTone(bgTone, desiredRatio);
        }
        if (decreasingContrast) {
          answer = _DynamicColor.foregroundTone(bgTone, desiredRatio);
        }
        if (this.isBackground && 50 <= answer && answer < 60) {
          if (Contrast.ratioOfTones(49, bgTone) >= desiredRatio) {
            answer = 49;
          } else {
            answer = 60;
          }
        }
        if (this.secondBackground) {
          const [bg1, bg2] = [this.background, this.secondBackground];
          const [bgTone1, bgTone2] = [bg1(scheme).getTone(scheme), bg2(scheme).getTone(scheme)];
          const [upper, lower] = [Math.max(bgTone1, bgTone2), Math.min(bgTone1, bgTone2)];
          if (Contrast.ratioOfTones(upper, answer) >= desiredRatio && Contrast.ratioOfTones(lower, answer) >= desiredRatio) {
            return answer;
          }
          const lightOption = Contrast.lighter(upper, desiredRatio);
          const darkOption = Contrast.darker(lower, desiredRatio);
          const availables = [];
          if (lightOption !== -1)
            availables.push(lightOption);
          if (darkOption !== -1)
            availables.push(darkOption);
          const prefersLight = _DynamicColor.tonePrefersLightForeground(bgTone1) || _DynamicColor.tonePrefersLightForeground(bgTone2);
          if (prefersLight) {
            return lightOption < 0 ? 100 : lightOption;
          }
          if (availables.length === 1) {
            return availables[0];
          }
          return darkOption < 0 ? 0 : darkOption;
        }
        return answer;
      }
    }
    /**
     * Given a background tone, find a foreground tone, while ensuring they reach
     * a contrast ratio that is as close to [ratio] as possible.
     *
     * @param bgTone Tone in HCT. Range is 0 to 100, undefined behavior when it
     *     falls outside that range.
     * @param ratio The contrast ratio desired between bgTone and the return
     *     value.
     */
    static foregroundTone(bgTone, ratio) {
      const lighterTone = Contrast.lighterUnsafe(bgTone, ratio);
      const darkerTone = Contrast.darkerUnsafe(bgTone, ratio);
      const lighterRatio = Contrast.ratioOfTones(lighterTone, bgTone);
      const darkerRatio = Contrast.ratioOfTones(darkerTone, bgTone);
      const preferLighter = _DynamicColor.tonePrefersLightForeground(bgTone);
      if (preferLighter) {
        const negligibleDifference = Math.abs(lighterRatio - darkerRatio) < 0.1 && lighterRatio < ratio && darkerRatio < ratio;
        return lighterRatio >= ratio || lighterRatio >= darkerRatio || negligibleDifference ? lighterTone : darkerTone;
      } else {
        return darkerRatio >= ratio || darkerRatio >= lighterRatio ? darkerTone : lighterTone;
      }
    }
    /**
     * Returns whether [tone] prefers a light foreground.
     *
     * People prefer white foregrounds on ~T60-70. Observed over time, and also
     * by Andrew Somers during research for APCA.
     *
     * T60 used as to create the smallest discontinuity possible when skipping
     * down to T49 in order to ensure light foregrounds.
     * Since `tertiaryContainer` in dark monochrome scheme requires a tone of
     * 60, it should not be adjusted. Therefore, 60 is excluded here.
     */
    static tonePrefersLightForeground(tone) {
      return Math.round(tone) < 60;
    }
    /**
     * Returns whether [tone] can reach a contrast ratio of 4.5 with a lighter
     * color.
     */
    static toneAllowsLightForeground(tone) {
      return Math.round(tone) <= 49;
    }
    /**
     * Adjust a tone such that white has 4.5 contrast, if the tone is
     * reasonably close to supporting it.
     */
    static enableLightForeground(tone) {
      if (_DynamicColor.tonePrefersLightForeground(tone) && !_DynamicColor.toneAllowsLightForeground(tone)) {
        return 49;
      }
      return tone;
    }
  };

  // node_modules/@material/material-color-utilities/scheme/variant.js
  var Variant;
  (function(Variant2) {
    Variant2[Variant2["MONOCHROME"] = 0] = "MONOCHROME";
    Variant2[Variant2["NEUTRAL"] = 1] = "NEUTRAL";
    Variant2[Variant2["TONAL_SPOT"] = 2] = "TONAL_SPOT";
    Variant2[Variant2["VIBRANT"] = 3] = "VIBRANT";
    Variant2[Variant2["EXPRESSIVE"] = 4] = "EXPRESSIVE";
    Variant2[Variant2["FIDELITY"] = 5] = "FIDELITY";
    Variant2[Variant2["CONTENT"] = 6] = "CONTENT";
    Variant2[Variant2["RAINBOW"] = 7] = "RAINBOW";
    Variant2[Variant2["FRUIT_SALAD"] = 8] = "FRUIT_SALAD";
  })(Variant || (Variant = {}));

  // node_modules/@material/material-color-utilities/dynamiccolor/contrast_curve.js
  var ContrastCurve = class {
    /**
     * Creates a `ContrastCurve` object.
     *
     * @param low Contrast requirement for contrast level -1.0
     * @param normal Contrast requirement for contrast level 0.0
     * @param medium Contrast requirement for contrast level 0.5
     * @param high Contrast requirement for contrast level 1.0
     */
    constructor(low, normal, medium, high) {
      this.low = low;
      this.normal = normal;
      this.medium = medium;
      this.high = high;
    }
    /**
     * Returns the contrast ratio at a given contrast level.
     *
     * @param contrastLevel The contrast level. 0.0 is the default (normal);
     * -1.0 is the lowest; 1.0 is the highest.
     * @return The contrast ratio, a number between 1.0 and 21.0.
     */
    getContrast(contrastLevel) {
      if (contrastLevel <= -1) {
        return this.low;
      } else if (contrastLevel < 0) {
        return lerp(this.low, this.normal, (contrastLevel - -1) / 1);
      } else if (contrastLevel < 0.5) {
        return lerp(this.normal, this.medium, (contrastLevel - 0) / 0.5);
      } else if (contrastLevel < 1) {
        return lerp(this.medium, this.high, (contrastLevel - 0.5) / 0.5);
      } else {
        return this.high;
      }
    }
  };

  // node_modules/@material/material-color-utilities/dynamiccolor/tone_delta_pair.js
  var ToneDeltaPair = class {
    /**
     * Documents a constraint in tone distance between two DynamicColors.
     *
     * The polarity is an adjective that describes "A", compared to "B".
     *
     * For instance, ToneDeltaPair(A, B, 15, 'darker', stayTogether) states that
     * A's tone should be at least 15 darker than B's.
     *
     * 'nearer' and 'farther' describes closeness to the surface roles. For
     * instance, ToneDeltaPair(A, B, 10, 'nearer', stayTogether) states that A
     * should be 10 lighter than B in light mode, and 10 darker than B in dark
     * mode.
     *
     * @param roleA The first role in a pair.
     * @param roleB The second role in a pair.
     * @param delta Required difference between tones. Absolute value, negative
     * values have undefined behavior.
     * @param polarity The relative relation between tones of roleA and roleB,
     * as described above.
     * @param stayTogether Whether these two roles should stay on the same side of
     * the "awkward zone" (T50-59). This is necessary for certain cases where
     * one role has two backgrounds.
     */
    constructor(roleA, roleB, delta, polarity, stayTogether) {
      this.roleA = roleA;
      this.roleB = roleB;
      this.delta = delta;
      this.polarity = polarity;
      this.stayTogether = stayTogether;
    }
  };

  // node_modules/@material/material-color-utilities/dynamiccolor/material_dynamic_colors.js
  function isFidelity(scheme) {
    return scheme.variant === Variant.FIDELITY || scheme.variant === Variant.CONTENT;
  }
  function isMonochrome(scheme) {
    return scheme.variant === Variant.MONOCHROME;
  }
  function findDesiredChromaByTone(hue, chroma, tone, byDecreasingTone) {
    let answer = tone;
    let closestToChroma = Hct.from(hue, chroma, tone);
    if (closestToChroma.chroma < chroma) {
      let chromaPeak = closestToChroma.chroma;
      while (closestToChroma.chroma < chroma) {
        answer += byDecreasingTone ? -1 : 1;
        const potentialSolution = Hct.from(hue, chroma, answer);
        if (chromaPeak > potentialSolution.chroma) {
          break;
        }
        if (Math.abs(potentialSolution.chroma - chroma) < 0.4) {
          break;
        }
        const potentialDelta = Math.abs(potentialSolution.chroma - chroma);
        const currentDelta = Math.abs(closestToChroma.chroma - chroma);
        if (potentialDelta < currentDelta) {
          closestToChroma = potentialSolution;
        }
        chromaPeak = Math.max(chromaPeak, potentialSolution.chroma);
      }
    }
    return answer;
  }
  function viewingConditionsForAlbers(scheme) {
    return ViewingConditions.make(
      /*whitePoint=*/
      void 0,
      /*adaptingLuminance=*/
      void 0,
      /*backgroundLstar=*/
      scheme.isDark ? 30 : 80,
      /*surround=*/
      void 0,
      /*discountingIlluminant=*/
      void 0
    );
  }
  function performAlbers(prealbers, scheme) {
    const albersd = prealbers.inViewingConditions(viewingConditionsForAlbers(scheme));
    if (DynamicColor.tonePrefersLightForeground(prealbers.tone) && !DynamicColor.toneAllowsLightForeground(albersd.tone)) {
      return DynamicColor.enableLightForeground(prealbers.tone);
    } else {
      return DynamicColor.enableLightForeground(albersd.tone);
    }
  }
  var MaterialDynamicColors = class _MaterialDynamicColors {
    static highestSurface(s8) {
      return s8.isDark ? _MaterialDynamicColors.surfaceBright : _MaterialDynamicColors.surfaceDim;
    }
  };
  MaterialDynamicColors.contentAccentToneDelta = 15;
  MaterialDynamicColors.primaryPaletteKeyColor = DynamicColor.fromPalette({
    name: "primary_palette_key_color",
    palette: (s8) => s8.primaryPalette,
    tone: (s8) => s8.primaryPalette.keyColor.tone
  });
  MaterialDynamicColors.secondaryPaletteKeyColor = DynamicColor.fromPalette({
    name: "secondary_palette_key_color",
    palette: (s8) => s8.secondaryPalette,
    tone: (s8) => s8.secondaryPalette.keyColor.tone
  });
  MaterialDynamicColors.tertiaryPaletteKeyColor = DynamicColor.fromPalette({
    name: "tertiary_palette_key_color",
    palette: (s8) => s8.tertiaryPalette,
    tone: (s8) => s8.tertiaryPalette.keyColor.tone
  });
  MaterialDynamicColors.neutralPaletteKeyColor = DynamicColor.fromPalette({
    name: "neutral_palette_key_color",
    palette: (s8) => s8.neutralPalette,
    tone: (s8) => s8.neutralPalette.keyColor.tone
  });
  MaterialDynamicColors.neutralVariantPaletteKeyColor = DynamicColor.fromPalette({
    name: "neutral_variant_palette_key_color",
    palette: (s8) => s8.neutralVariantPalette,
    tone: (s8) => s8.neutralVariantPalette.keyColor.tone
  });
  MaterialDynamicColors.background = DynamicColor.fromPalette({
    name: "background",
    palette: (s8) => s8.neutralPalette,
    tone: (s8) => s8.isDark ? 6 : 98,
    isBackground: true
  });
  MaterialDynamicColors.onBackground = DynamicColor.fromPalette({
    name: "on_background",
    palette: (s8) => s8.neutralPalette,
    tone: (s8) => s8.isDark ? 90 : 10,
    background: (s8) => MaterialDynamicColors.background,
    contrastCurve: new ContrastCurve(3, 3, 4.5, 7)
  });
  MaterialDynamicColors.surface = DynamicColor.fromPalette({
    name: "surface",
    palette: (s8) => s8.neutralPalette,
    tone: (s8) => s8.isDark ? 6 : 98,
    isBackground: true
  });
  MaterialDynamicColors.surfaceDim = DynamicColor.fromPalette({
    name: "surface_dim",
    palette: (s8) => s8.neutralPalette,
    tone: (s8) => s8.isDark ? 6 : 87,
    isBackground: true
  });
  MaterialDynamicColors.surfaceBright = DynamicColor.fromPalette({
    name: "surface_bright",
    palette: (s8) => s8.neutralPalette,
    tone: (s8) => s8.isDark ? 24 : 98,
    isBackground: true
  });
  MaterialDynamicColors.surfaceContainerLowest = DynamicColor.fromPalette({
    name: "surface_container_lowest",
    palette: (s8) => s8.neutralPalette,
    tone: (s8) => s8.isDark ? 4 : 100,
    isBackground: true
  });
  MaterialDynamicColors.surfaceContainerLow = DynamicColor.fromPalette({
    name: "surface_container_low",
    palette: (s8) => s8.neutralPalette,
    tone: (s8) => s8.isDark ? 10 : 96,
    isBackground: true
  });
  MaterialDynamicColors.surfaceContainer = DynamicColor.fromPalette({
    name: "surface_container",
    palette: (s8) => s8.neutralPalette,
    tone: (s8) => s8.isDark ? 12 : 94,
    isBackground: true
  });
  MaterialDynamicColors.surfaceContainerHigh = DynamicColor.fromPalette({
    name: "surface_container_high",
    palette: (s8) => s8.neutralPalette,
    tone: (s8) => s8.isDark ? 17 : 92,
    isBackground: true
  });
  MaterialDynamicColors.surfaceContainerHighest = DynamicColor.fromPalette({
    name: "surface_container_highest",
    palette: (s8) => s8.neutralPalette,
    tone: (s8) => s8.isDark ? 22 : 90,
    isBackground: true
  });
  MaterialDynamicColors.onSurface = DynamicColor.fromPalette({
    name: "on_surface",
    palette: (s8) => s8.neutralPalette,
    tone: (s8) => s8.isDark ? 90 : 10,
    background: (s8) => MaterialDynamicColors.highestSurface(s8),
    contrastCurve: new ContrastCurve(4.5, 7, 11, 21)
  });
  MaterialDynamicColors.surfaceVariant = DynamicColor.fromPalette({
    name: "surface_variant",
    palette: (s8) => s8.neutralVariantPalette,
    tone: (s8) => s8.isDark ? 30 : 90,
    isBackground: true
  });
  MaterialDynamicColors.onSurfaceVariant = DynamicColor.fromPalette({
    name: "on_surface_variant",
    palette: (s8) => s8.neutralVariantPalette,
    tone: (s8) => s8.isDark ? 80 : 30,
    background: (s8) => MaterialDynamicColors.highestSurface(s8),
    contrastCurve: new ContrastCurve(3, 4.5, 7, 11)
  });
  MaterialDynamicColors.inverseSurface = DynamicColor.fromPalette({
    name: "inverse_surface",
    palette: (s8) => s8.neutralPalette,
    tone: (s8) => s8.isDark ? 90 : 20
  });
  MaterialDynamicColors.inverseOnSurface = DynamicColor.fromPalette({
    name: "inverse_on_surface",
    palette: (s8) => s8.neutralPalette,
    tone: (s8) => s8.isDark ? 20 : 95,
    background: (s8) => MaterialDynamicColors.inverseSurface,
    contrastCurve: new ContrastCurve(4.5, 7, 11, 21)
  });
  MaterialDynamicColors.outline = DynamicColor.fromPalette({
    name: "outline",
    palette: (s8) => s8.neutralVariantPalette,
    tone: (s8) => s8.isDark ? 60 : 50,
    background: (s8) => MaterialDynamicColors.highestSurface(s8),
    contrastCurve: new ContrastCurve(1.5, 3, 4.5, 7)
  });
  MaterialDynamicColors.outlineVariant = DynamicColor.fromPalette({
    name: "outline_variant",
    palette: (s8) => s8.neutralVariantPalette,
    tone: (s8) => s8.isDark ? 30 : 80,
    background: (s8) => MaterialDynamicColors.highestSurface(s8),
    contrastCurve: new ContrastCurve(1, 1, 3, 7)
  });
  MaterialDynamicColors.shadow = DynamicColor.fromPalette({
    name: "shadow",
    palette: (s8) => s8.neutralPalette,
    tone: (s8) => 0
  });
  MaterialDynamicColors.scrim = DynamicColor.fromPalette({
    name: "scrim",
    palette: (s8) => s8.neutralPalette,
    tone: (s8) => 0
  });
  MaterialDynamicColors.surfaceTint = DynamicColor.fromPalette({
    name: "surface_tint",
    palette: (s8) => s8.primaryPalette,
    tone: (s8) => s8.isDark ? 80 : 40,
    isBackground: true
  });
  MaterialDynamicColors.primary = DynamicColor.fromPalette({
    name: "primary",
    palette: (s8) => s8.primaryPalette,
    tone: (s8) => {
      if (isMonochrome(s8)) {
        return s8.isDark ? 100 : 0;
      }
      return s8.isDark ? 80 : 40;
    },
    isBackground: true,
    background: (s8) => MaterialDynamicColors.highestSurface(s8),
    contrastCurve: new ContrastCurve(3, 4.5, 7, 11),
    toneDeltaPair: (s8) => new ToneDeltaPair(MaterialDynamicColors.primaryContainer, MaterialDynamicColors.primary, 15, "nearer", false)
  });
  MaterialDynamicColors.onPrimary = DynamicColor.fromPalette({
    name: "on_primary",
    palette: (s8) => s8.primaryPalette,
    tone: (s8) => {
      if (isMonochrome(s8)) {
        return s8.isDark ? 10 : 90;
      }
      return s8.isDark ? 20 : 100;
    },
    background: (s8) => MaterialDynamicColors.primary,
    contrastCurve: new ContrastCurve(4.5, 7, 11, 21)
  });
  MaterialDynamicColors.primaryContainer = DynamicColor.fromPalette({
    name: "primary_container",
    palette: (s8) => s8.primaryPalette,
    tone: (s8) => {
      if (isFidelity(s8)) {
        return performAlbers(s8.sourceColorHct, s8);
      }
      if (isMonochrome(s8)) {
        return s8.isDark ? 85 : 25;
      }
      return s8.isDark ? 30 : 90;
    },
    isBackground: true,
    background: (s8) => MaterialDynamicColors.highestSurface(s8),
    contrastCurve: new ContrastCurve(1, 1, 3, 7),
    toneDeltaPair: (s8) => new ToneDeltaPair(MaterialDynamicColors.primaryContainer, MaterialDynamicColors.primary, 15, "nearer", false)
  });
  MaterialDynamicColors.onPrimaryContainer = DynamicColor.fromPalette({
    name: "on_primary_container",
    palette: (s8) => s8.primaryPalette,
    tone: (s8) => {
      if (isFidelity(s8)) {
        return DynamicColor.foregroundTone(MaterialDynamicColors.primaryContainer.tone(s8), 4.5);
      }
      if (isMonochrome(s8)) {
        return s8.isDark ? 0 : 100;
      }
      return s8.isDark ? 90 : 10;
    },
    background: (s8) => MaterialDynamicColors.primaryContainer,
    contrastCurve: new ContrastCurve(4.5, 7, 11, 21)
  });
  MaterialDynamicColors.inversePrimary = DynamicColor.fromPalette({
    name: "inverse_primary",
    palette: (s8) => s8.primaryPalette,
    tone: (s8) => s8.isDark ? 40 : 80,
    background: (s8) => MaterialDynamicColors.inverseSurface,
    contrastCurve: new ContrastCurve(3, 4.5, 7, 11)
  });
  MaterialDynamicColors.secondary = DynamicColor.fromPalette({
    name: "secondary",
    palette: (s8) => s8.secondaryPalette,
    tone: (s8) => s8.isDark ? 80 : 40,
    isBackground: true,
    background: (s8) => MaterialDynamicColors.highestSurface(s8),
    contrastCurve: new ContrastCurve(3, 4.5, 7, 11),
    toneDeltaPair: (s8) => new ToneDeltaPair(MaterialDynamicColors.secondaryContainer, MaterialDynamicColors.secondary, 15, "nearer", false)
  });
  MaterialDynamicColors.onSecondary = DynamicColor.fromPalette({
    name: "on_secondary",
    palette: (s8) => s8.secondaryPalette,
    tone: (s8) => {
      if (isMonochrome(s8)) {
        return s8.isDark ? 10 : 100;
      } else {
        return s8.isDark ? 20 : 100;
      }
    },
    background: (s8) => MaterialDynamicColors.secondary,
    contrastCurve: new ContrastCurve(4.5, 7, 11, 21)
  });
  MaterialDynamicColors.secondaryContainer = DynamicColor.fromPalette({
    name: "secondary_container",
    palette: (s8) => s8.secondaryPalette,
    tone: (s8) => {
      const initialTone = s8.isDark ? 30 : 90;
      if (isMonochrome(s8)) {
        return s8.isDark ? 30 : 85;
      }
      if (!isFidelity(s8)) {
        return initialTone;
      }
      let answer = findDesiredChromaByTone(s8.secondaryPalette.hue, s8.secondaryPalette.chroma, initialTone, s8.isDark ? false : true);
      answer = performAlbers(s8.secondaryPalette.getHct(answer), s8);
      return answer;
    },
    isBackground: true,
    background: (s8) => MaterialDynamicColors.highestSurface(s8),
    contrastCurve: new ContrastCurve(1, 1, 3, 7),
    toneDeltaPair: (s8) => new ToneDeltaPair(MaterialDynamicColors.secondaryContainer, MaterialDynamicColors.secondary, 15, "nearer", false)
  });
  MaterialDynamicColors.onSecondaryContainer = DynamicColor.fromPalette({
    name: "on_secondary_container",
    palette: (s8) => s8.secondaryPalette,
    tone: (s8) => {
      if (!isFidelity(s8)) {
        return s8.isDark ? 90 : 10;
      }
      return DynamicColor.foregroundTone(MaterialDynamicColors.secondaryContainer.tone(s8), 4.5);
    },
    background: (s8) => MaterialDynamicColors.secondaryContainer,
    contrastCurve: new ContrastCurve(4.5, 7, 11, 21)
  });
  MaterialDynamicColors.tertiary = DynamicColor.fromPalette({
    name: "tertiary",
    palette: (s8) => s8.tertiaryPalette,
    tone: (s8) => {
      if (isMonochrome(s8)) {
        return s8.isDark ? 90 : 25;
      }
      return s8.isDark ? 80 : 40;
    },
    isBackground: true,
    background: (s8) => MaterialDynamicColors.highestSurface(s8),
    contrastCurve: new ContrastCurve(3, 4.5, 7, 11),
    toneDeltaPair: (s8) => new ToneDeltaPair(MaterialDynamicColors.tertiaryContainer, MaterialDynamicColors.tertiary, 15, "nearer", false)
  });
  MaterialDynamicColors.onTertiary = DynamicColor.fromPalette({
    name: "on_tertiary",
    palette: (s8) => s8.tertiaryPalette,
    tone: (s8) => {
      if (isMonochrome(s8)) {
        return s8.isDark ? 10 : 90;
      }
      return s8.isDark ? 20 : 100;
    },
    background: (s8) => MaterialDynamicColors.tertiary,
    contrastCurve: new ContrastCurve(4.5, 7, 11, 21)
  });
  MaterialDynamicColors.tertiaryContainer = DynamicColor.fromPalette({
    name: "tertiary_container",
    palette: (s8) => s8.tertiaryPalette,
    tone: (s8) => {
      if (isMonochrome(s8)) {
        return s8.isDark ? 60 : 49;
      }
      if (!isFidelity(s8)) {
        return s8.isDark ? 30 : 90;
      }
      const albersTone = performAlbers(s8.tertiaryPalette.getHct(s8.sourceColorHct.tone), s8);
      const proposedHct = s8.tertiaryPalette.getHct(albersTone);
      return DislikeAnalyzer.fixIfDisliked(proposedHct).tone;
    },
    isBackground: true,
    background: (s8) => MaterialDynamicColors.highestSurface(s8),
    contrastCurve: new ContrastCurve(1, 1, 3, 7),
    toneDeltaPair: (s8) => new ToneDeltaPair(MaterialDynamicColors.tertiaryContainer, MaterialDynamicColors.tertiary, 15, "nearer", false)
  });
  MaterialDynamicColors.onTertiaryContainer = DynamicColor.fromPalette({
    name: "on_tertiary_container",
    palette: (s8) => s8.tertiaryPalette,
    tone: (s8) => {
      if (isMonochrome(s8)) {
        return s8.isDark ? 0 : 100;
      }
      if (!isFidelity(s8)) {
        return s8.isDark ? 90 : 10;
      }
      return DynamicColor.foregroundTone(MaterialDynamicColors.tertiaryContainer.tone(s8), 4.5);
    },
    background: (s8) => MaterialDynamicColors.tertiaryContainer,
    contrastCurve: new ContrastCurve(4.5, 7, 11, 21)
  });
  MaterialDynamicColors.error = DynamicColor.fromPalette({
    name: "error",
    palette: (s8) => s8.errorPalette,
    tone: (s8) => s8.isDark ? 80 : 40,
    isBackground: true,
    background: (s8) => MaterialDynamicColors.highestSurface(s8),
    contrastCurve: new ContrastCurve(3, 4.5, 7, 11),
    toneDeltaPair: (s8) => new ToneDeltaPair(MaterialDynamicColors.errorContainer, MaterialDynamicColors.error, 15, "nearer", false)
  });
  MaterialDynamicColors.onError = DynamicColor.fromPalette({
    name: "on_error",
    palette: (s8) => s8.errorPalette,
    tone: (s8) => s8.isDark ? 20 : 100,
    background: (s8) => MaterialDynamicColors.error,
    contrastCurve: new ContrastCurve(4.5, 7, 11, 21)
  });
  MaterialDynamicColors.errorContainer = DynamicColor.fromPalette({
    name: "error_container",
    palette: (s8) => s8.errorPalette,
    tone: (s8) => s8.isDark ? 30 : 90,
    isBackground: true,
    background: (s8) => MaterialDynamicColors.highestSurface(s8),
    contrastCurve: new ContrastCurve(1, 1, 3, 7),
    toneDeltaPair: (s8) => new ToneDeltaPair(MaterialDynamicColors.errorContainer, MaterialDynamicColors.error, 15, "nearer", false)
  });
  MaterialDynamicColors.onErrorContainer = DynamicColor.fromPalette({
    name: "on_error_container",
    palette: (s8) => s8.errorPalette,
    tone: (s8) => s8.isDark ? 90 : 10,
    background: (s8) => MaterialDynamicColors.errorContainer,
    contrastCurve: new ContrastCurve(4.5, 7, 11, 21)
  });
  MaterialDynamicColors.primaryFixed = DynamicColor.fromPalette({
    name: "primary_fixed",
    palette: (s8) => s8.primaryPalette,
    tone: (s8) => isMonochrome(s8) ? 40 : 90,
    isBackground: true,
    background: (s8) => MaterialDynamicColors.highestSurface(s8),
    contrastCurve: new ContrastCurve(1, 1, 3, 7),
    toneDeltaPair: (s8) => new ToneDeltaPair(MaterialDynamicColors.primaryFixed, MaterialDynamicColors.primaryFixedDim, 10, "lighter", true)
  });
  MaterialDynamicColors.primaryFixedDim = DynamicColor.fromPalette({
    name: "primary_fixed_dim",
    palette: (s8) => s8.primaryPalette,
    tone: (s8) => isMonochrome(s8) ? 30 : 80,
    isBackground: true,
    background: (s8) => MaterialDynamicColors.highestSurface(s8),
    contrastCurve: new ContrastCurve(1, 1, 3, 7),
    toneDeltaPair: (s8) => new ToneDeltaPair(MaterialDynamicColors.primaryFixed, MaterialDynamicColors.primaryFixedDim, 10, "lighter", true)
  });
  MaterialDynamicColors.onPrimaryFixed = DynamicColor.fromPalette({
    name: "on_primary_fixed",
    palette: (s8) => s8.primaryPalette,
    tone: (s8) => isMonochrome(s8) ? 100 : 10,
    background: (s8) => MaterialDynamicColors.primaryFixedDim,
    secondBackground: (s8) => MaterialDynamicColors.primaryFixed,
    contrastCurve: new ContrastCurve(4.5, 7, 11, 21)
  });
  MaterialDynamicColors.onPrimaryFixedVariant = DynamicColor.fromPalette({
    name: "on_primary_fixed_variant",
    palette: (s8) => s8.primaryPalette,
    tone: (s8) => isMonochrome(s8) ? 90 : 30,
    background: (s8) => MaterialDynamicColors.primaryFixedDim,
    secondBackground: (s8) => MaterialDynamicColors.primaryFixed,
    contrastCurve: new ContrastCurve(3, 4.5, 7, 11)
  });
  MaterialDynamicColors.secondaryFixed = DynamicColor.fromPalette({
    name: "secondary_fixed",
    palette: (s8) => s8.secondaryPalette,
    tone: (s8) => isMonochrome(s8) ? 80 : 90,
    isBackground: true,
    background: (s8) => MaterialDynamicColors.highestSurface(s8),
    contrastCurve: new ContrastCurve(1, 1, 3, 7),
    toneDeltaPair: (s8) => new ToneDeltaPair(MaterialDynamicColors.secondaryFixed, MaterialDynamicColors.secondaryFixedDim, 10, "lighter", true)
  });
  MaterialDynamicColors.secondaryFixedDim = DynamicColor.fromPalette({
    name: "secondary_fixed_dim",
    palette: (s8) => s8.secondaryPalette,
    tone: (s8) => isMonochrome(s8) ? 70 : 80,
    isBackground: true,
    background: (s8) => MaterialDynamicColors.highestSurface(s8),
    contrastCurve: new ContrastCurve(1, 1, 3, 7),
    toneDeltaPair: (s8) => new ToneDeltaPair(MaterialDynamicColors.secondaryFixed, MaterialDynamicColors.secondaryFixedDim, 10, "lighter", true)
  });
  MaterialDynamicColors.onSecondaryFixed = DynamicColor.fromPalette({
    name: "on_secondary_fixed",
    palette: (s8) => s8.secondaryPalette,
    tone: (s8) => 10,
    background: (s8) => MaterialDynamicColors.secondaryFixedDim,
    secondBackground: (s8) => MaterialDynamicColors.secondaryFixed,
    contrastCurve: new ContrastCurve(4.5, 7, 11, 21)
  });
  MaterialDynamicColors.onSecondaryFixedVariant = DynamicColor.fromPalette({
    name: "on_secondary_fixed_variant",
    palette: (s8) => s8.secondaryPalette,
    tone: (s8) => isMonochrome(s8) ? 25 : 30,
    background: (s8) => MaterialDynamicColors.secondaryFixedDim,
    secondBackground: (s8) => MaterialDynamicColors.secondaryFixed,
    contrastCurve: new ContrastCurve(3, 4.5, 7, 11)
  });
  MaterialDynamicColors.tertiaryFixed = DynamicColor.fromPalette({
    name: "tertiary_fixed",
    palette: (s8) => s8.tertiaryPalette,
    tone: (s8) => isMonochrome(s8) ? 40 : 90,
    isBackground: true,
    background: (s8) => MaterialDynamicColors.highestSurface(s8),
    contrastCurve: new ContrastCurve(1, 1, 3, 7),
    toneDeltaPair: (s8) => new ToneDeltaPair(MaterialDynamicColors.tertiaryFixed, MaterialDynamicColors.tertiaryFixedDim, 10, "lighter", true)
  });
  MaterialDynamicColors.tertiaryFixedDim = DynamicColor.fromPalette({
    name: "tertiary_fixed_dim",
    palette: (s8) => s8.tertiaryPalette,
    tone: (s8) => isMonochrome(s8) ? 30 : 80,
    isBackground: true,
    background: (s8) => MaterialDynamicColors.highestSurface(s8),
    contrastCurve: new ContrastCurve(1, 1, 3, 7),
    toneDeltaPair: (s8) => new ToneDeltaPair(MaterialDynamicColors.tertiaryFixed, MaterialDynamicColors.tertiaryFixedDim, 10, "lighter", true)
  });
  MaterialDynamicColors.onTertiaryFixed = DynamicColor.fromPalette({
    name: "on_tertiary_fixed",
    palette: (s8) => s8.tertiaryPalette,
    tone: (s8) => isMonochrome(s8) ? 100 : 10,
    background: (s8) => MaterialDynamicColors.tertiaryFixedDim,
    secondBackground: (s8) => MaterialDynamicColors.tertiaryFixed,
    contrastCurve: new ContrastCurve(4.5, 7, 11, 21)
  });
  MaterialDynamicColors.onTertiaryFixedVariant = DynamicColor.fromPalette({
    name: "on_tertiary_fixed_variant",
    palette: (s8) => s8.tertiaryPalette,
    tone: (s8) => isMonochrome(s8) ? 90 : 30,
    background: (s8) => MaterialDynamicColors.tertiaryFixedDim,
    secondBackground: (s8) => MaterialDynamicColors.tertiaryFixed,
    contrastCurve: new ContrastCurve(3, 4.5, 7, 11)
  });

  // node_modules/@material/material-color-utilities/palettes/tonal_palette.js
  var TonalPalette = class _TonalPalette {
    /**
     * @param argb ARGB representation of a color
     * @return Tones matching that color's hue and chroma.
     */
    static fromInt(argb) {
      const hct = Hct.fromInt(argb);
      return _TonalPalette.fromHct(hct);
    }
    /**
     * @param hct Hct
     * @return Tones matching that color's hue and chroma.
     */
    static fromHct(hct) {
      return new _TonalPalette(hct.hue, hct.chroma, hct);
    }
    /**
     * @param hue HCT hue
     * @param chroma HCT chroma
     * @return Tones matching hue and chroma.
     */
    static fromHueAndChroma(hue, chroma) {
      return new _TonalPalette(hue, chroma, _TonalPalette.createKeyColor(hue, chroma));
    }
    constructor(hue, chroma, keyColor) {
      this.hue = hue;
      this.chroma = chroma;
      this.keyColor = keyColor;
      this.cache = /* @__PURE__ */ new Map();
    }
    static createKeyColor(hue, chroma) {
      const startTone = 50;
      let smallestDeltaHct = Hct.from(hue, chroma, startTone);
      let smallestDelta = Math.abs(smallestDeltaHct.chroma - chroma);
      for (let delta = 1; delta < 50; delta += 1) {
        if (Math.round(chroma) === Math.round(smallestDeltaHct.chroma)) {
          return smallestDeltaHct;
        }
        const hctAdd = Hct.from(hue, chroma, startTone + delta);
        const hctAddDelta = Math.abs(hctAdd.chroma - chroma);
        if (hctAddDelta < smallestDelta) {
          smallestDelta = hctAddDelta;
          smallestDeltaHct = hctAdd;
        }
        const hctSubtract = Hct.from(hue, chroma, startTone - delta);
        const hctSubtractDelta = Math.abs(hctSubtract.chroma - chroma);
        if (hctSubtractDelta < smallestDelta) {
          smallestDelta = hctSubtractDelta;
          smallestDeltaHct = hctSubtract;
        }
      }
      return smallestDeltaHct;
    }
    /**
     * @param tone HCT tone, measured from 0 to 100.
     * @return ARGB representation of a color with that tone.
     */
    tone(tone) {
      let argb = this.cache.get(tone);
      if (argb === void 0) {
        argb = Hct.from(this.hue, this.chroma, tone).toInt();
        this.cache.set(tone, argb);
      }
      return argb;
    }
    /**
     * @param tone HCT tone.
     * @return HCT representation of a color with that tone.
     */
    getHct(tone) {
      return Hct.fromInt(this.tone(tone));
    }
  };

  // node_modules/@material/material-color-utilities/scheme/dynamic_scheme.js
  var DynamicScheme = class {
    constructor(args) {
      this.sourceColorArgb = args.sourceColorArgb;
      this.variant = args.variant;
      this.contrastLevel = args.contrastLevel;
      this.isDark = args.isDark;
      this.sourceColorHct = Hct.fromInt(args.sourceColorArgb);
      this.primaryPalette = args.primaryPalette;
      this.secondaryPalette = args.secondaryPalette;
      this.tertiaryPalette = args.tertiaryPalette;
      this.neutralPalette = args.neutralPalette;
      this.neutralVariantPalette = args.neutralVariantPalette;
      this.errorPalette = TonalPalette.fromHueAndChroma(25, 84);
    }
    /**
     * Support design spec'ing Dynamic Color by schemes that specify hue
     * rotations that should be applied at certain breakpoints.
     * @param sourceColor the source color of the theme, in HCT.
     * @param hues The "breakpoints", i.e. the hues at which a rotation should
     * be apply.
     * @param rotations The rotation that should be applied when source color's
     * hue is >= the same index in hues array, and <= the hue at the next index
     * in hues array.
     */
    static getRotatedHue(sourceColor, hues, rotations) {
      const sourceHue = sourceColor.hue;
      if (hues.length !== rotations.length) {
        throw new Error(`mismatch between hue length ${hues.length} & rotations ${rotations.length}`);
      }
      if (rotations.length === 1) {
        return sanitizeDegreesDouble(sourceColor.hue + rotations[0]);
      }
      const size = hues.length;
      for (let i10 = 0; i10 <= size - 2; i10++) {
        const thisHue = hues[i10];
        const nextHue = hues[i10 + 1];
        if (thisHue < sourceHue && sourceHue < nextHue) {
          return sanitizeDegreesDouble(sourceHue + rotations[i10]);
        }
      }
      return sourceHue;
    }
  };

  // node_modules/@material/material-color-utilities/scheme/scheme_expressive.js
  var SchemeExpressive = class _SchemeExpressive extends DynamicScheme {
    constructor(sourceColorHct, isDark, contrastLevel) {
      super({
        sourceColorArgb: sourceColorHct.toInt(),
        variant: Variant.EXPRESSIVE,
        contrastLevel,
        isDark,
        primaryPalette: TonalPalette.fromHueAndChroma(sanitizeDegreesDouble(sourceColorHct.hue + 240), 40),
        secondaryPalette: TonalPalette.fromHueAndChroma(DynamicScheme.getRotatedHue(sourceColorHct, _SchemeExpressive.hues, _SchemeExpressive.secondaryRotations), 24),
        tertiaryPalette: TonalPalette.fromHueAndChroma(DynamicScheme.getRotatedHue(sourceColorHct, _SchemeExpressive.hues, _SchemeExpressive.tertiaryRotations), 32),
        neutralPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue + 15, 8),
        neutralVariantPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue + 15, 12)
      });
    }
  };
  SchemeExpressive.hues = [
    0,
    21,
    51,
    121,
    151,
    191,
    271,
    321,
    360
  ];
  SchemeExpressive.secondaryRotations = [
    45,
    95,
    45,
    20,
    45,
    90,
    45,
    45,
    45
  ];
  SchemeExpressive.tertiaryRotations = [
    120,
    120,
    20,
    45,
    20,
    15,
    20,
    120,
    120
  ];

  // node_modules/@material/material-color-utilities/scheme/scheme_vibrant.js
  var SchemeVibrant = class _SchemeVibrant extends DynamicScheme {
    constructor(sourceColorHct, isDark, contrastLevel) {
      super({
        sourceColorArgb: sourceColorHct.toInt(),
        variant: Variant.VIBRANT,
        contrastLevel,
        isDark,
        primaryPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 200),
        secondaryPalette: TonalPalette.fromHueAndChroma(DynamicScheme.getRotatedHue(sourceColorHct, _SchemeVibrant.hues, _SchemeVibrant.secondaryRotations), 24),
        tertiaryPalette: TonalPalette.fromHueAndChroma(DynamicScheme.getRotatedHue(sourceColorHct, _SchemeVibrant.hues, _SchemeVibrant.tertiaryRotations), 32),
        neutralPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 10),
        neutralVariantPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 12)
      });
    }
  };
  SchemeVibrant.hues = [
    0,
    41,
    61,
    101,
    131,
    181,
    251,
    301,
    360
  ];
  SchemeVibrant.secondaryRotations = [
    18,
    15,
    10,
    12,
    15,
    18,
    15,
    12,
    12
  ];
  SchemeVibrant.tertiaryRotations = [
    35,
    30,
    20,
    25,
    30,
    35,
    30,
    25,
    25
  ];

  // node_modules/@material/material-color-utilities/score/score.js
  var SCORE_OPTION_DEFAULTS = {
    desired: 4,
    fallbackColorARGB: 4282549748,
    filter: true
    // Avoid unsuitable colors.
  };
  function compare(a7, b4) {
    if (a7.score > b4.score) {
      return -1;
    } else if (a7.score < b4.score) {
      return 1;
    }
    return 0;
  }
  var Score = class _Score {
    constructor() {
    }
    /**
     * Given a map with keys of colors and values of how often the color appears,
     * rank the colors based on suitability for being used for a UI theme.
     *
     * @param colorsToPopulation map with keys of colors and values of how often
     *     the color appears, usually from a source image.
     * @param {ScoreOptions} options optional parameters.
     * @return Colors sorted by suitability for a UI theme. The most suitable
     *     color is the first item, the least suitable is the last. There will
     *     always be at least one color returned. If all the input colors
     *     were not suitable for a theme, a default fallback color will be
     *     provided, Google Blue.
     */
    static score(colorsToPopulation, options) {
      const { desired, fallbackColorARGB, filter } = { ...SCORE_OPTION_DEFAULTS, ...options };
      const colorsHct = [];
      const huePopulation = new Array(360).fill(0);
      let populationSum = 0;
      for (const [argb, population] of colorsToPopulation.entries()) {
        const hct = Hct.fromInt(argb);
        colorsHct.push(hct);
        const hue = Math.floor(hct.hue);
        huePopulation[hue] += population;
        populationSum += population;
      }
      const hueExcitedProportions = new Array(360).fill(0);
      for (let hue = 0; hue < 360; hue++) {
        const proportion = huePopulation[hue] / populationSum;
        for (let i10 = hue - 14; i10 < hue + 16; i10++) {
          const neighborHue = sanitizeDegreesInt(i10);
          hueExcitedProportions[neighborHue] += proportion;
        }
      }
      const scoredHct = new Array();
      for (const hct of colorsHct) {
        const hue = sanitizeDegreesInt(Math.round(hct.hue));
        const proportion = hueExcitedProportions[hue];
        if (filter && (hct.chroma < _Score.CUTOFF_CHROMA || proportion <= _Score.CUTOFF_EXCITED_PROPORTION)) {
          continue;
        }
        const proportionScore = proportion * 100 * _Score.WEIGHT_PROPORTION;
        const chromaWeight = hct.chroma < _Score.TARGET_CHROMA ? _Score.WEIGHT_CHROMA_BELOW : _Score.WEIGHT_CHROMA_ABOVE;
        const chromaScore = (hct.chroma - _Score.TARGET_CHROMA) * chromaWeight;
        const score = proportionScore + chromaScore;
        scoredHct.push({ hct, score });
      }
      scoredHct.sort(compare);
      const chosenColors = [];
      for (let differenceDegrees2 = 90; differenceDegrees2 >= 15; differenceDegrees2--) {
        chosenColors.length = 0;
        for (const { hct } of scoredHct) {
          const duplicateHue = chosenColors.find((chosenHct) => {
            return differenceDegrees(hct.hue, chosenHct.hue) < differenceDegrees2;
          });
          if (!duplicateHue) {
            chosenColors.push(hct);
          }
          if (chosenColors.length >= desired)
            break;
        }
        if (chosenColors.length >= desired)
          break;
      }
      const colors = [];
      if (chosenColors.length === 0) {
        colors.push(fallbackColorARGB);
      }
      for (const chosenHct of chosenColors) {
        colors.push(chosenHct.toInt());
      }
      return colors;
    }
  };
  Score.TARGET_CHROMA = 48;
  Score.WEIGHT_PROPORTION = 0.7;
  Score.WEIGHT_CHROMA_ABOVE = 0.3;
  Score.WEIGHT_CHROMA_BELOW = 0.1;
  Score.CUTOFF_CHROMA = 5;
  Score.CUTOFF_EXCITED_PROPORTION = 0.01;

  // node_modules/@material/material-color-utilities/utils/string_utils.js
  function hexFromArgb(argb) {
    const r8 = redFromArgb(argb);
    const g4 = greenFromArgb(argb);
    const b4 = blueFromArgb(argb);
    const outParts = [r8.toString(16), g4.toString(16), b4.toString(16)];
    for (const [i10, part] of outParts.entries()) {
      if (part.length === 1) {
        outParts[i10] = "0" + part;
      }
    }
    return "#" + outParts.join("");
  }
  function argbFromHex(hex) {
    hex = hex.replace("#", "");
    const isThree = hex.length === 3;
    const isSix = hex.length === 6;
    const isEight = hex.length === 8;
    if (!isThree && !isSix && !isEight) {
      throw new Error("unexpected hex " + hex);
    }
    let r8 = 0;
    let g4 = 0;
    let b4 = 0;
    if (isThree) {
      r8 = parseIntHex(hex.slice(0, 1).repeat(2));
      g4 = parseIntHex(hex.slice(1, 2).repeat(2));
      b4 = parseIntHex(hex.slice(2, 3).repeat(2));
    } else if (isSix) {
      r8 = parseIntHex(hex.slice(0, 2));
      g4 = parseIntHex(hex.slice(2, 4));
      b4 = parseIntHex(hex.slice(4, 6));
    } else if (isEight) {
      r8 = parseIntHex(hex.slice(2, 4));
      g4 = parseIntHex(hex.slice(4, 6));
      b4 = parseIntHex(hex.slice(6, 8));
    }
    return (255 << 24 | (r8 & 255) << 16 | (g4 & 255) << 8 | b4 & 255) >>> 0;
  }
  function parseIntHex(value) {
    return parseInt(value, 16);
  }

  // src/utils/material-color-helpers.ts
  var materialColors = {
    background: MaterialDynamicColors.background,
    "on-background": MaterialDynamicColors.onBackground,
    surface: MaterialDynamicColors.surface,
    "surface-dim": MaterialDynamicColors.surfaceDim,
    "surface-bright": MaterialDynamicColors.surfaceBright,
    "surface-container-lowest": MaterialDynamicColors.surfaceContainerLowest,
    "surface-container-low": MaterialDynamicColors.surfaceContainerLow,
    "surface-container": MaterialDynamicColors.surfaceContainer,
    "surface-container-high": MaterialDynamicColors.surfaceContainerHigh,
    "surface-container-highest": MaterialDynamicColors.surfaceContainerHighest,
    "on-surface": MaterialDynamicColors.onSurface,
    "surface-variant": MaterialDynamicColors.surfaceVariant,
    "on-surface-variant": MaterialDynamicColors.onSurfaceVariant,
    "inverse-surface": MaterialDynamicColors.inverseSurface,
    "inverse-on-surface": MaterialDynamicColors.inverseOnSurface,
    outline: MaterialDynamicColors.outline,
    "outline-variant": MaterialDynamicColors.outlineVariant,
    shadow: MaterialDynamicColors.shadow,
    scrim: MaterialDynamicColors.scrim,
    "surface-tint": MaterialDynamicColors.surfaceTint,
    primary: MaterialDynamicColors.primary,
    "on-primary": MaterialDynamicColors.onPrimary,
    "primary-container": MaterialDynamicColors.primaryContainer,
    "on-primary-container": MaterialDynamicColors.onPrimaryContainer,
    "inverse-primary": MaterialDynamicColors.inversePrimary,
    secondary: MaterialDynamicColors.secondary,
    "on-secondary": MaterialDynamicColors.onSecondary,
    "secondary-container": MaterialDynamicColors.secondaryContainer,
    "on-secondary-container": MaterialDynamicColors.onSecondaryContainer,
    tertiary: MaterialDynamicColors.tertiary,
    "on-tertiary": MaterialDynamicColors.onTertiary,
    "tertiary-container": MaterialDynamicColors.tertiaryContainer,
    "on-tertiary-container": MaterialDynamicColors.onTertiaryContainer,
    error: MaterialDynamicColors.error,
    "on-error": MaterialDynamicColors.onError,
    "error-container": MaterialDynamicColors.errorContainer,
    "on-error-container": MaterialDynamicColors.onErrorContainer
  };
  function hctFromHex(value) {
    return Hct.fromInt(argbFromHex(value));
  }
  function hexFromHct(hue, chroma, tone) {
    const hct = Hct.from(hue, chroma, tone);
    const value = hct.toInt();
    return hexFromArgb(value);
  }

  // src/components/hct-slider.ts
  var HUE_RANGE = [0, 360];
  var CHROMA_RANGE = [0, 150];
  var TONE_RANGE = [0, 100];
  var HCTSlider = class extends s3 {
    constructor() {
      super(...arguments);
      this.label = "";
      this.value = 0;
      this.color = "";
      this.type = "hue";
    }
    render() {
      let range = HUE_RANGE;
      if (this.type === "chroma") {
        range = CHROMA_RANGE;
      } else if (this.type === "tone") {
        range = TONE_RANGE;
      }
      return T`<section>
      <span id="label" class="color-on-surface-text">${this.label}</span>
      <md-slider
        id="source"
        labeled
        aria-label=${this.label}
        .min=${range[0]}
        .max=${range[1]}
        .value=${this.value}
        @input=${this.onInput}></md-slider>
      <div
        id="gradient"
        class=${this.type}
        style=${o9({
        background: this.buildGradient()
      })}></div>
    </section>`;
    }
    onInput(e13) {
      const target = e13.target;
      this.value = target.value;
      this.dispatchEvent(new Event("input"));
    }
    /**
     * Generates the linear-gradient background image CSS string for the gradient
     * preview under the slider.
     *
     * @return A linear gradient CSS string.
     */
    buildGradient() {
      const numStops = 100;
      let linearGradientString = "linear-gradient(to right";
      if (this.type === "hue") {
        for (let i10 = 0; i10 < numStops; i10++) {
          const hue = HUE_RANGE[1] / numStops * i10;
          const hex = hexFromHct(hue, 100, 50);
          linearGradientString += `, ${hex} ${i10}%`;
        }
      } else if (this.type === "chroma") {
        const hct = hctFromHex(this.color || "#000");
        const hue = hct.hue;
        for (let i10 = 0; i10 < numStops; i10++) {
          const chroma = CHROMA_RANGE[1] / numStops * i10;
          const hex = hexFromHct(hue, chroma, 50);
          linearGradientString += `, ${hex} ${i10}%`;
        }
      } else if (this.type === "tone") {
        for (let i10 = 0; i10 < numStops; i10++) {
          const tone = TONE_RANGE[1] / numStops * i10;
          const hex = hexFromHct(0, 0, tone);
          linearGradientString += `, ${hex} ${i10}%`;
        }
      }
      linearGradientString += ")";
      return linearGradientString;
    }
  };
  HCTSlider.styles = i3`
    section {
      display: flex;
      flex-direction: column;
    }

    #gradient {
      height: 24px;
      border-radius: 12px;
      border: 1px solid currentColor;
      box-sizing: border-box;
    }

    #gradient.chroma {
      will-change: background;
    }

    #label,
    #gradient {
      margin-inline: calc(var(--md-slider-handle-width, 20px) / 2);
    }
  `;
  __decorateClass([
    n({ type: String })
  ], HCTSlider.prototype, "label", 2);
  __decorateClass([
    n({ type: Number })
  ], HCTSlider.prototype, "value", 2);
  __decorateClass([
    n({ type: String })
  ], HCTSlider.prototype, "color", 2);
  __decorateClass([
    n({ type: String })
  ], HCTSlider.prototype, "type", 2);
  HCTSlider = __decorateClass([
    e("hct-slider")
  ], HCTSlider);

  // src/types/color-events.ts
  var ChangeColorEvent = class extends Event {
    /**
     * @param color The new source color to apply.
     */
    constructor(color) {
      super("change-color", { bubbles: true, composed: true });
      this.color = color;
    }
  };
  var ChangeDarkModeEvent = class extends Event {
    /**
     * @param mode The new color mode to apply.
     */
    constructor(mode) {
      super("change-mode", { bubbles: true, composed: true });
      this.mode = mode;
    }
  };

  // src/utils/theme.ts
  function getCurrentThemeString() {
    return localStorage.getItem("material-theme");
  }
  function getCurrentMode() {
    return localStorage.getItem("color-mode");
  }
  function getCurrentSeedColor() {
    return localStorage.getItem("seed-color");
  }

  // src/components/theme-changer.ts
  var ThemeChanger = class extends s3 {
    constructor() {
      super(...arguments);
      this.selectedColorMode = null;
      this.hexColor = "";
      this.hue = 0;
      this.chroma = 0;
      this.tone = 0;
    }
    render() {
      return T`
      <div id="head-wrapper">
        <h2> Theme Controls </h2>
        <copy-code-button
          button-title="Copy current theme to clipboard"
          label="Copy current theme"
          .getCopyText=${getCurrentThemeString}>
        </copy-code-button>
      </div>
      ${this.renderHexPicker()} ${this.renderHctPicker()}
      ${this.renderColorModePicker()}
    `;
    }
    /**
     * Renders a circular native color picker with a focus ring.
     */
    renderHexPicker() {
      return T`<div>
      <label id="hex" for="color-input">
        <span class="label">Hex Source Color</span>
        <span class="input-wrapper">
          <div class="overflow">
            <input
              id="color-input"
              @input=${this.onHexPickerInput}
              type="color"
              .value=${l7(this.hexColor)} />
          </div>
          <md-focus-ring for="color-input"></md-focus-ring>
        </span>
      </label>
    </div>`;
    }
    /**
     * Renders the three hct color pickers.
     */
    renderHctPicker() {
      return T`<div class="sliders">
      <hct-slider
        .value=${l7(this.hue)}
        type="hue"
        label="Hue"
        max="360"
        @input=${this.onSliderInput}></hct-slider>
      <hct-slider
        .value=${l7(this.chroma)}
        .color=${this.hexColor}
        type="chroma"
        label="Chroma"
        max="150"
        @input=${this.onSliderInput}></hct-slider>
      <hct-slider
        .value=${l7(this.tone)}
        type="tone"
        label="Tone"
        max="100"
        @input=${this.onSliderInput}></hct-slider>
    </div>`;
    }
    /**
     * Renders the color mode segmented button set picker.
     */
    renderColorModePicker() {
      return T`<md-outlined-segmented-button-set
      @segmented-button-set-selection=${this.onColorModeSelection}
      aria-label="Color mode">
      ${this.renderModeButton("dark", "dark_mode")}
      ${this.renderModeButton("auto", "brightness_medium")}
      ${this.renderModeButton("light", "light_mode")}
    </md-outlined-segmented-button-set>`;
    }
    /**
     * Renders a color mode segmented button.
     *
     * @param mode Sets the value and the title of the button to the given color
     *     mode.
     * @param icon The icon to display in the button.
     */
    renderModeButton(mode, icon) {
      return T`<md-outlined-segmented-button
      data-value=${mode}
      title=${mode}
      aria-label="${mode} color scheme"
      .selected=${this.selectedColorMode === mode}>
      <md-icon slot="icon">${icon}</md-icon>
    </md-outlined-segmented-button>`;
    }
    onSliderInput() {
      for (const slider of this.sliders) {
        this[slider.type] = slider.value;
      }
      this.hexColor = hexFromHct(this.hue, this.chroma, this.tone);
      this.dispatchEvent(new ChangeColorEvent(this.hexColor));
    }
    /**
     * Updates the HCT sliders by converting a hex color to HCT.
     *
     * @param hexColor The hex color to convert to HCT and update the sliders.
     */
    updateHctFromHex(hexColor) {
      const hct = hctFromHex(hexColor);
      this.hue = hct.hue;
      this.chroma = hct.chroma;
      this.tone = hct.tone;
    }
    onHexPickerInput() {
      this.hexColor = this.inputEl.value;
      this.updateHctFromHex(this.hexColor);
      this.dispatchEvent(new ChangeColorEvent(this.hexColor));
    }
    async firstUpdated() {
      if (!this.selectedColorMode) {
        this.selectedColorMode = getCurrentMode();
      }
      if (!this.hexColor) {
        this.hexColor = getCurrentSeedColor();
      }
      this.updateHctFromHex(this.hexColor);
    }
    onColorModeSelection(e13) {
      const { button } = e13.detail;
      const value = button.dataset.value;
      this.selectedColorMode = value;
      this.dispatchEvent(new ChangeDarkModeEvent(value));
    }
  };
  ThemeChanger.shadowRootOptions = {
    ...s3.shadowRootOptions,
    delegatesFocus: true
  };
  ThemeChanger.styles = i3`
    :host {
      /* These are the default values, but we don't want the alignment to break
       * in case the token values are updated.
       */
      --_copy-button-button-size: 40px;
      --_copy-button-icon-size: 24px;
      position: relative;
      display: flex;
      flex-direction: column;
      margin: var(--catalog-spacing-m) var(--catalog-spacing-l);
    }

    :host > * {
      margin-block-end: var(--catalog-spacing-l);
    }

    :host > *:last-child {
      margin-block-end: 0;
    }

    #head-wrapper {
      display: flex;
      align-items: space-between;
    }

    input {
      border: none;
      background: none;
    }

    .sliders,
    #hex {
      padding-inline: var(--catalog-spacing-m);
      border-radius: var(--catalog-shape-l);
      background-color: var(--md-sys-color-surface-variant);
      color: var(--md-sys-color-on-surface-variant);

      /* Default track color is inaccessible in a surface-variant */
      --md-slider-inactive-track-color: var(--md-sys-color-on-surface-variant);
    }

    hct-slider {
      display: block;
      margin-block: 24px;
    }

    h2 {
      margin: 0;
      text-align: center;
      position: relative;
      height: var(--_copy-button-icon-size);
    }

    copy-code-button {
      --md-icon-button-icon-size: var(--_copy-button-icon-size);
      --md-icon-button-state-layer-width: var(--_copy-button-button-size);
      --md-icon-button-state-layer-height: var(--_copy-button-button-size);
      /*
       * Center the copy icon with the h2 text
       * -(icon button size - intrinsic icon size) / 2
       */
      --_inline-block-inset: calc(
        -1 * (var(--_copy-button-button-size) - var(--_copy-button-icon-size)) /
          2
      );
      --catalog-copy-code-button-inset: var(--_inline-block-inset) 0 auto auto;
      position: static;
    }

    #hex {
      display: flex;
      padding: 12px;
      align-items: center;
    }

    #hex .label {
      flex-grow: 1;
    }

    #hex .input-wrapper {
      box-sizing: border-box;
      width: 48px;
      height: 48px;
      box-sizing: border-box;
      border: 1px solid var(--md-sys-color-on-secondary-container);
      position: relative;
    }

    #hex .input-wrapper,
    #hex md-focus-ring {
      border-radius: 50%;
    }

    .overflow {
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #hex input {
      min-width: 200%;
      min-height: 200%;
    }

    @media (forced-colors: active) {
      #hex,
      .sliders {
        box-sizing: border-box;
        border: 1px solid CanvasText;
      }
    }
  `;
  __decorateClass([
    t()
  ], ThemeChanger.prototype, "selectedColorMode", 2);
  __decorateClass([
    t()
  ], ThemeChanger.prototype, "hexColor", 2);
  __decorateClass([
    t()
  ], ThemeChanger.prototype, "hue", 2);
  __decorateClass([
    t()
  ], ThemeChanger.prototype, "chroma", 2);
  __decorateClass([
    t()
  ], ThemeChanger.prototype, "tone", 2);
  __decorateClass([
    i2("input")
  ], ThemeChanger.prototype, "inputEl", 2);
  __decorateClass([
    e3("hct-slider")
  ], ThemeChanger.prototype, "sliders", 2);
  ThemeChanger = __decorateClass([
    e("theme-changer")
  ], ThemeChanger);

  // src/svg/material-design-logo.ts
  var materialDesign = T` <svg
  viewBox="0 96 960 960"
  fill="currentColor">
  <path
    d="M480 1016q-91 0-171-34.5T169 887q-60-60-94.5-140T40 576q0-91 34.5-171T169 265q60-60 140-94.5T480 136q91 0 171 34.5T791 265q60 60 94.5 140T920 576q0 91-34.5 171T791 887q-60 60-140 94.5T480 1016ZM200 802V351q-38 47-59 104t-21 121q0 65 21 122t59 104Zm54-506h452q-47-38-104-59t-122-21q-65 0-122 21t-104 59Zm226 381 151-301H330l150 301Zm40 99h160V456L520 776Zm-240 0h160L280 456v320Zm200 160q64 0 121.5-21T706 856H254q47 38 104.5 59T480 936Zm280-134q38-47 59-104t21-122q0-64-21-121t-59-104v451Z" />
</svg>`;

  // src/components/top-app-bar.ts
  var TopAppBar = class extends SignalElement(s3) {
    constructor() {
      super(...arguments);
      this.menuOpen = false;
    }
    render() {
      return T`
      <header>
        <div class="default-content">
          <section class="start">
            <md-icon-button
              toggle
              class="menu-button"
              aria-label-selected="open navigation menu"
              aria-label="close navigation menu"
              aria-expanded=${drawerOpenSignal.value ? "false" : "true"}
              title="${!drawerOpenSignal.value ? "Open" : "Close"} navigation menu"
              .selected=${l7(!drawerOpenSignal.value)}
              @input=${this.onMenuIconToggle}>
              <md-icon slot="selected">menu</md-icon>
              <md-icon>menu_open</md-icon>
            </md-icon-button>
            <md-icon-button
              href="/"
              class="home-button"
              title="Home"
              aria-label="Home">
              ${materialDesign}
            </md-icon-button>
          </section>

          <a href="/" id="home-link">
            Material Web
            <md-focus-ring for="home-link"></md-focus-ring>
          </a>
          <slot name="start"></slot>

          <a id="skip-to-main" href="#main-content" tabindex="0">
            Skip to main content
          </a>

          <section class="end">
            <slot name="end"></slot>
            <lit-island
              on:interaction="pointerenter,focusin,pointerdown"
              import="/js/hydration-entrypoints/menu.js"
              id="menu-island">
              <md-icon-button
                title="GitHub repository"
                aria-label="GitHub repository"
                href="https://github.com/material-components/material-web"
                target="_blank">
                <md-icon>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 98 96">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" />
                  </svg>
                </md-icon>
              </md-icon-button>
              <md-icon-button
                id="theme-button"
                @click="${this.onPaletteClick}"
                title="Page theme controls"
                aria-label="Page theme controls"
                aria-haspopup="dialog"
                aria-expanded=${this.menuOpen ? "true" : "false"}>
                <md-icon>palette</md-icon>
              </md-icon-button>
              <md-menu
                anchor="theme-button"
                menu-corner="start-end"
                anchor-corner="end-end"
                default-focus="none"
                role="dialog"
                aria-label="Page color theme controls"
                .open=${this.menuOpen}
                @opened=${this.onMenuOpened}
                @closed=${this.onMenuClosed}
                @keydown=${this.onKeydown}>
                <theme-changer></theme-changer>
              </md-menu>
            </lit-island>
          </section>
        </div>
        <slot></slot>
      </header>
    `;
    }
    /**
     * Opens the theme changer menu and inerts the rest of the page.
     */
    onPaletteClick() {
      this.menuOpen = true;
      inertContentSignal.value = true;
      inertSidebarSignal.value = true;
      drawerOpenSignal.value = false;
    }
    /**
     * Syncs current menu state with actual menu state and makes the rest of the
     * page interactive again.
     */
    onMenuClosed() {
      this.menuOpen = false;
      inertContentSignal.value = false;
      inertSidebarSignal.value = false;
    }
    onMenuOpened() {
      this.themeChanger.focus();
    }
    onKeydown(e13) {
      if (!e13.defaultPrevented && e13.key === "Escape") {
        e13.preventDefault();
        this.menuOpen = false;
      }
    }
    /**
     * Toggles the sidebar's open state.
     */
    onMenuIconToggle(e13) {
      drawerOpenSignal.value = !e13.target.selected;
    }
  };
  TopAppBar.styles = i3`
    :host,
    header {
      display: block;
      height: var(--catalog-top-app-bar-height);
    }

    header {
      position: fixed;
      inset: 0 0 auto 0;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding: var(--catalog-spacing-m) var(--catalog-spacing-l);
      background-color: var(--md-sys-color-surface-container);
      color: var(--md-sys-color-on-surface);
      z-index: 12;
    }

    .default-content {
      width: 100%;
      display: flex;
      align-items: center;
    }

    md-icon-button:not(:defined) {
      width: 40px;
      height: 40px;
      display: flex;
      visibility: hidden;
    }

    md-icon-button * {
      display: block;
    }

    a {
      color: var(--md-sys-color-primary);
      font-size: max(var(--catalog-title-l-font-size), 22px);
      text-decoration: none;
      padding-inline: 12px;
      position: relative;
      outline: none;
      vertical-align: middle;
    }

    .start .menu-button {
      display: none;
    }

    .start .home-button * {
      color: var(--md-sys-color-primary);
    }

    .end {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }

    #menu-island {
      position: relative;
      display: flex;
      align-items: center;
    }

    #home-link {
      white-space: nowrap;
    }

    /* Narrow windows: the version select (slot="start") needs the room; the
       navigation drawer still links home. */
    @media (max-width: 480px) {
      #home-link {
        display: none;
      }
    }

    #skip-to-main {
      padding: var(--catalog-spacing-s);
      border-radius: var(--catalog-shape-m);
      background-color: var(--md-sys-color-inverse-surface);
      color: var(--md-sys-color-inverse-on-surface);
      opacity: 0;
      position: absolute;
      pointer-events: none;
    }

    #skip-to-main:focus-visible {
      opacity: 1;
      pointer-events: auto;
    }

    @media (max-width: 1500px) {
      .start .home-button {
        display: none;
      }

      .start .menu-button {
        display: flex;
      }
    }
  `;
  __decorateClass([
    t()
  ], TopAppBar.prototype, "menuOpen", 2);
  __decorateClass([
    i2("theme-changer")
  ], TopAppBar.prototype, "themeChanger", 2);
  TopAppBar = __decorateClass([
    e("top-app-bar")
  ], TopAppBar);

  // src/components/drag-playground.ts
  var DragPlayground = class extends s3 {
    constructor() {
      super(...arguments);
      this.isDragging = false;
      this.editorHeightPercent = 0;
      /**
       * A set of pointer IDs in the case that the user is dragging with multiple
       * pointers.
       */
      this.pointerIds = /* @__PURE__ */ new Set();
    }
    render() {
      return T`<div
      id="wrapper"
      style=${o9({
        "--editor-percentage": `${this.editorHeightPercent}%`
      })}
    >
      <slot name="preview"></slot>
      <div
        id="drag-bar"
        tabindex="0"
        role="slider"
        aria-orientation="vertical"
        aria-valuemax="100"
        aria-valuemin="0"
        aria-valuenow="${this.editorHeightPercent}"
        aria-valuetext="${this.editorHeightPercent} percent"
        aria-label="Editor height"
        @focus=${this.onFocus}
        @blur=${this.onBlur}
        @keydown=${this.onKeydown}
        @pointerdown=${this.onPointerdown}
        @pointerup=${this.onPointerup}
        @pointermove=${this.onPointermove}
        class=${o8({
        isDragging: this.isDragging
      })}
      >
        <md-icon>drag_handle</md-icon>
      </div>
      <slot name="editor"></slot>
    </div>`;
    }
    onFocus() {
      this.isDragging = true;
    }
    onBlur() {
      this.isDragging = false;
    }
    onKeydown(event) {
      const { key } = event;
      switch (key) {
        case "ArrowRight":
        case "ArrowUp":
          this.editorHeightPercent = Math.min(this.editorHeightPercent + 1, 100);
          break;
        case "ArrowLeft":
        case "ArrowDown":
          this.editorHeightPercent = Math.max(this.editorHeightPercent - 1, 0);
          break;
        case "PageUp":
          this.editorHeightPercent = Math.min(this.editorHeightPercent + 10, 100);
          break;
        case "PageDown":
          this.editorHeightPercent = Math.max(this.editorHeightPercent - 10, 0);
          break;
        case "Home":
          this.editorHeightPercent = 0;
          break;
        case "End":
          this.editorHeightPercent = 100;
          break;
        default:
          break;
      }
    }
    onPointerdown(event) {
      this.isDragging = true;
      if (this.pointerIds.has(event.pointerId)) return;
      this.pointerIds.add(event.pointerId);
      event.target.setPointerCapture(event.pointerId);
    }
    onPointerup(event) {
      this.pointerIds.delete(event.pointerId);
      event.target.releasePointerCapture(event.pointerId);
      if (this.pointerIds.size === 0) {
        this.isDragging = false;
      }
    }
    onPointermove(event) {
      if (!this.isDragging) return;
      const { clientY: mouseY } = event;
      const { top: wrapperTop, bottom: wrapperBottom } = this.wrapperEl.getBoundingClientRect();
      const height = wrapperBottom - wrapperTop;
      const editorHeightPercent = 100 - (mouseY - wrapperTop) / height * 100;
      this.editorHeightPercent = Math.min(Math.max(editorHeightPercent, 0), 100);
    }
  };
  DragPlayground.styles = i3`
    :host {
      display: block;
      --_drag-bar-height: 24px;
      --_drag-bar-border-width: 1px;
      --_half-drag-bar-height: calc(
        (var(--_drag-bar-height) / 2) + var(--_drag-bar-border-width)
      );
    }

    #wrapper {
      display: flex;
      flex-direction: column;
    }

    :host,
    #wrapper,
    ::slotted(*) {
      height: 100%;
    }

    slot {
      display: block;
      overflow: hidden;
    }

    [name='preview'] {
      height: max(
        calc(
          100% - var(--editor-percentage, 0%) - var(--_half-drag-bar-height)
        ),
        0px
      );
    }

    [name='editor'] {
      height: max(
        calc(var(--editor-percentage, 0px) - var(--_half-drag-bar-height)),
        0px
      );
    }

    #drag-bar {
      touch-action: none;
      background-color: var(--md-sys-color-surface-container);
      color: var(--md-sys-color-on-surface);
      border: var(--_drag-bar-border-width) solid var(--md-sys-color-outline);
      border-radius: 12px;
      height: var(--_drag-bar-height);
      display: flex;
      justify-content: center;
      align-items: center;
      -webkit-user-select: none;
      user-select: none;
    }

    #drag-bar:hover {
      background-color: var(--md-sys-color-surface-container-high);
      cursor: grab;
    }

    #drag-bar.isDragging {
      background-color: var(--md-sys-color-inverse-surface);
      color: var(--md-sys-color-inverse-on-surface);
      cursor: grabbing;
    }
  `;
  __decorateClass([
    t()
  ], DragPlayground.prototype, "isDragging", 2);
  __decorateClass([
    t()
  ], DragPlayground.prototype, "editorHeightPercent", 2);
  __decorateClass([
    i2("#wrapper")
  ], DragPlayground.prototype, "wrapperEl", 2);
  DragPlayground = __decorateClass([
    e("drag-playground")
  ], DragPlayground);
})();
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/*! Bundled license information:

@lit/reactive-element/node/decorators/custom-element.js:
@lit/reactive-element/node/decorators/property.js:
@lit/reactive-element/node/decorators/state.js:
@lit/reactive-element/node/decorators/base.js:
@lit/reactive-element/node/decorators/event-options.js:
@lit/reactive-element/node/decorators/query.js:
@lit/reactive-element/node/decorators/query-all.js:
@lit/reactive-element/node/decorators/query-async.js:
@lit/reactive-element/node/decorators/query-assigned-nodes.js:
@lit/reactive-element/node/reactive-element.js:
lit-html/node/lit-html.js:
lit-element/lit-element.js:
lit-html/node/directive.js:
lit-html/node/async-directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/node/decorators/query-assigned-elements.js:
lit-html/node/directives/when.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit-labs/ssr-dom-shim/lib/element-internals.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit-labs/ssr-dom-shim/index.js:
@lit/reactive-element/node/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/node/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/node/directives/class-map.js:
lit-html/node/directives/style-map.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

safevalues/dist/mjs/environment/dev.js:
safevalues/dist/mjs/builders/url_builders.js:
safevalues/dist/mjs/dom/elements/anchor.js:
safevalues/dist/mjs/dom/elements/area.js:
safevalues/dist/mjs/internals/trusted_types.js:
safevalues/dist/mjs/internals/secrets.js:
safevalues/dist/mjs/internals/resource_url_impl.js:
safevalues/dist/mjs/dom/elements/base.js:
safevalues/dist/mjs/dom/elements/button.js:
safevalues/dist/mjs/internals/attribute_impl.js:
safevalues/dist/mjs/internals/pure.js:
safevalues/dist/mjs/internals/html_impl.js:
safevalues/dist/mjs/dom/elements/embed.js:
safevalues/dist/mjs/dom/elements/form.js:
safevalues/dist/mjs/dom/elements/iframe.js:
safevalues/dist/mjs/dom/elements/input.js:
safevalues/dist/mjs/dom/elements/object.js:
safevalues/dist/mjs/internals/script_impl.js:
safevalues/dist/mjs/dom/globals/window.js:
safevalues/dist/mjs/dom/elements/script.js:
safevalues/dist/mjs/dom/elements/element.js:
safevalues/dist/mjs/dom/elements/link.js:
safevalues/dist/mjs/internals/style_sheet_impl.js:
safevalues/dist/mjs/dom/elements/style.js:
safevalues/dist/mjs/dom/elements/svg.js:
safevalues/dist/mjs/dom/elements/svg_use.js:
safevalues/dist/mjs/dom/globals/document.js:
safevalues/dist/mjs/dom/globals/dom_parser.js:
safevalues/dist/mjs/dom/globals/fetch.js:
safevalues/dist/mjs/dom/globals/global.js:
safevalues/dist/mjs/dom/globals/location.js:
safevalues/dist/mjs/dom/globals/range.js:
safevalues/dist/mjs/dom/globals/service_worker_container.js:
safevalues/dist/mjs/dom/globals/url.js:
safevalues/dist/mjs/dom/globals/worker.js:
safevalues/dist/mjs/dom/index.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

lit-html/node/static.js:
lit-html/node/directive-helpers.js:
lit-html/node/directives/live.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@material/material-color-utilities/utils/math_utils.js:
@material/material-color-utilities/utils/color_utils.js:
@material/material-color-utilities/hct/viewing_conditions.js:
@material/material-color-utilities/hct/cam16.js:
@material/material-color-utilities/hct/hct_solver.js:
@material/material-color-utilities/hct/hct.js:
@material/material-color-utilities/blend/blend.js:
@material/material-color-utilities/palettes/tonal_palette.js:
@material/material-color-utilities/palettes/core_palette.js:
@material/material-color-utilities/quantize/lab_point_provider.js:
@material/material-color-utilities/quantize/quantizer_wsmeans.js:
@material/material-color-utilities/quantize/quantizer_map.js:
@material/material-color-utilities/quantize/quantizer_wu.js:
@material/material-color-utilities/quantize/quantizer_celebi.js:
@material/material-color-utilities/scheme/scheme.js:
@material/material-color-utilities/scheme/scheme_android.js:
@material/material-color-utilities/score/score.js:
@material/material-color-utilities/utils/string_utils.js:
@material/material-color-utilities/utils/image_utils.js:
@material/material-color-utilities/utils/theme_utils.js:
@material/material-color-utilities/index.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/contrast/contrast.js:
@material/material-color-utilities/dynamiccolor/dynamic_color.js:
@material/material-color-utilities/scheme/variant.js:
@material/material-color-utilities/dynamiccolor/material_dynamic_colors.js:
@material/material-color-utilities/scheme/dynamic_scheme.js:
@material/material-color-utilities/scheme/scheme_expressive.js:
@material/material-color-utilities/scheme/scheme_monochrome.js:
@material/material-color-utilities/scheme/scheme_neutral.js:
@material/material-color-utilities/scheme/scheme_tonal_spot.js:
@material/material-color-utilities/scheme/scheme_vibrant.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/dislike/dislike_analyzer.js:
@material/material-color-utilities/dynamiccolor/contrast_curve.js:
@material/material-color-utilities/dynamiccolor/tone_delta_pair.js:
@material/material-color-utilities/temperature/temperature_cache.js:
@material/material-color-utilities/scheme/scheme_content.js:
@material/material-color-utilities/scheme/scheme_fidelity.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
//# sourceMappingURL=ssr.js.map
