import {
  D,
  T,
  e,
  i,
  t
} from "./chunk-JVQ4V6KC.js";

// ../node_modules/tslib/tslib.es6.mjs
var extendStatics = function(d2, b) {
  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b2) {
    d3.__proto__ = b2;
  } || function(d3, b2) {
    for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d3[p] = b2[p];
  };
  return extendStatics(d2, b);
};
function __extends(d2, b) {
  if (typeof b !== "function" && b !== null)
    throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d2, b);
  function __() {
    this.constructor = d2;
  }
  d2.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function() {
  __assign = Object.assign || function __assign2(t4) {
    for (var s4, i5 = 1, n6 = arguments.length; i5 < n6; i5++) {
      s4 = arguments[i5];
      for (var p in s4) if (Object.prototype.hasOwnProperty.call(s4, p)) t4[p] = s4[p];
    }
    return t4;
  };
  return __assign.apply(this, arguments);
};
function __decorate(decorators, target, key, desc) {
  var c2 = arguments.length, r3 = c2 < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r3 = Reflect.decorate(decorators, target, key, desc);
  else for (var i5 = decorators.length - 1; i5 >= 0; i5--) if (d2 = decorators[i5]) r3 = (c2 < 3 ? d2(r3) : c2 > 3 ? d2(target, key, r3) : d2(target, key)) || r3;
  return c2 > 3 && r3 && Object.defineProperty(target, key, r3), r3;
}
function __values(o8) {
  var s4 = typeof Symbol === "function" && Symbol.iterator, m = s4 && o8[s4], i5 = 0;
  if (m) return m.call(o8);
  if (o8 && typeof o8.length === "number") return {
    next: function() {
      if (o8 && i5 >= o8.length) o8 = void 0;
      return { value: o8 && o8[i5++], done: !o8 };
    }
  };
  throw new TypeError(s4 ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

// ../node_modules/@lit/reactive-element/decorators/custom-element.js
var e2 = (e10) => (n6) => "function" == typeof n6 ? ((e11, n7) => (customElements.define(e11, n7), n7))(e10, n6) : ((e11, n7) => {
  const { kind: t4, elements: s4 } = n7;
  return { kind: t4, elements: s4, finisher(n8) {
    customElements.define(e11, n8);
  } };
})(e10, n6);

// ../node_modules/@lit/reactive-element/decorators/property.js
var i2 = (i5, e10) => "method" === e10.kind && e10.descriptor && !("value" in e10.descriptor) ? { ...e10, finisher(n6) {
  n6.createProperty(e10.key, i5);
} } : { kind: "field", key: /* @__PURE__ */ Symbol(), placement: "own", descriptor: {}, originalKey: e10.key, initializer() {
  "function" == typeof e10.initializer && (this[e10.key] = e10.initializer.call(this));
}, finisher(n6) {
  n6.createProperty(e10.key, i5);
} };
var e3 = (i5, e10, n6) => {
  e10.constructor.createProperty(n6, i5);
};
function n(n6) {
  return (t4, o8) => void 0 !== o8 ? e3(n6, t4, o8) : i2(n6, t4);
}

// ../node_modules/@lit/reactive-element/decorators/state.js
function t2(t4) {
  return n({ ...t4, state: true });
}

// ../node_modules/@lit/reactive-element/decorators/base.js
var o = ({ finisher: e10, descriptor: t4 }) => (o8, n6) => {
  var r3;
  if (void 0 === n6) {
    const n7 = null !== (r3 = o8.originalKey) && void 0 !== r3 ? r3 : o8.key, i5 = null != t4 ? { kind: "method", placement: "prototype", key: n7, descriptor: t4(o8.key) } : { ...o8, key: n7 };
    return null != e10 && (i5.finisher = function(t5) {
      e10(t5, n7);
    }), i5;
  }
  {
    const r4 = o8.constructor;
    void 0 !== t4 && Object.defineProperty(o8, n6, t4(n6)), null == e10 || e10(r4, n6);
  }
};

// ../node_modules/@lit/reactive-element/decorators/query.js
function i3(i5, n6) {
  return o({ descriptor: (o8) => {
    const t4 = { get() {
      var o9, n7;
      return null !== (n7 = null === (o9 = this.renderRoot) || void 0 === o9 ? void 0 : o9.querySelector(i5)) && void 0 !== n7 ? n7 : null;
    }, enumerable: true, configurable: true };
    if (n6) {
      const n7 = "symbol" == typeof o8 ? /* @__PURE__ */ Symbol() : "__" + o8;
      t4.get = function() {
        var o9, t5;
        return void 0 === this[n7] && (this[n7] = null !== (t5 = null === (o9 = this.renderRoot) || void 0 === o9 ? void 0 : o9.querySelector(i5)) && void 0 !== t5 ? t5 : null), this[n7];
      };
    }
    return t4;
  } });
}

// ../node_modules/@lit/reactive-element/decorators/query-all.js
function e4(e10) {
  return o({ descriptor: (r3) => ({ get() {
    var r4, o8;
    return null !== (o8 = null === (r4 = this.renderRoot) || void 0 === r4 ? void 0 : r4.querySelectorAll(e10)) && void 0 !== o8 ? o8 : [];
  }, enumerable: true, configurable: true }) });
}

// ../node_modules/@lit/reactive-element/decorators/query-assigned-elements.js
var n2;
var e5 = null != (null === (n2 = window.HTMLSlotElement) || void 0 === n2 ? void 0 : n2.prototype.assignedElements) ? (o8, n6) => o8.assignedElements(n6) : (o8, n6) => o8.assignedNodes(n6).filter(((o9) => o9.nodeType === Node.ELEMENT_NODE));
function l(n6) {
  const { slot: l4, selector: t4 } = null != n6 ? n6 : {};
  return o({ descriptor: (o8) => ({ get() {
    var o9;
    const r3 = "slot" + (l4 ? `[name=${l4}]` : ":not([name])"), i5 = null === (o9 = this.renderRoot) || void 0 === o9 ? void 0 : o9.querySelector(r3), s4 = null != i5 ? e5(i5, n6) : [];
    return t4 ? s4.filter(((o10) => o10.matches(t4))) : s4;
  }, enumerable: true, configurable: true }) });
}

// ../node_modules/@lit/reactive-element/decorators/event-options.js
function e6(e10) {
  return o({ finisher: (r3, t4) => {
    Object.assign(r3.prototype[t4], e10);
  } });
}

// ../node_modules/@lit/reactive-element/decorators/query-async.js
function e7(e10) {
  return o({ descriptor: (r3) => ({ async get() {
    var r4;
    return await this.updateComplete, null === (r4 = this.renderRoot) || void 0 === r4 ? void 0 : r4.querySelector(e10);
  }, enumerable: true, configurable: true }) });
}

// ../node_modules/@lit/reactive-element/decorators/query-assigned-nodes.js
function o2(o8, n6, r3) {
  let l4, s4 = o8;
  return "object" == typeof o8 ? (s4 = o8.slot, l4 = o8) : l4 = { flatten: n6 }, r3 ? l({ slot: s4, flatten: n6, selector: r3 }) : o({ descriptor: (e10) => ({ get() {
    var e11, t4;
    const o9 = "slot" + (s4 ? `[name=${s4}]` : ":not([name])"), n7 = null === (e11 = this.renderRoot) || void 0 === e11 ? void 0 : e11.querySelector(o9);
    return null !== (t4 = null == n7 ? void 0 : n7.assignedNodes(l4)) && void 0 !== t4 ? t4 : [];
  }, enumerable: true, configurable: true }) });
}

// ../node_modules/@lit/reactive-element/css-tag.js
var t3 = window;
var e8 = t3.ShadowRoot && (void 0 === t3.ShadyCSS || t3.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var s = /* @__PURE__ */ Symbol();
var n3 = /* @__PURE__ */ new WeakMap();
var o3 = class {
  constructor(t4, e10, n6) {
    if (this._$cssResult$ = true, n6 !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t4, this.t = e10;
  }
  get styleSheet() {
    let t4 = this.o;
    const s4 = this.t;
    if (e8 && void 0 === t4) {
      const e10 = void 0 !== s4 && 1 === s4.length;
      e10 && (t4 = n3.get(s4)), void 0 === t4 && ((this.o = t4 = new CSSStyleSheet()).replaceSync(this.cssText), e10 && n3.set(s4, t4));
    }
    return t4;
  }
  toString() {
    return this.cssText;
  }
};
var r = (t4) => new o3("string" == typeof t4 ? t4 : t4 + "", void 0, s);
var i4 = (t4, ...e10) => {
  const n6 = 1 === t4.length ? t4[0] : e10.reduce(((e11, s4, n7) => e11 + ((t5) => {
    if (true === t5._$cssResult$) return t5.cssText;
    if ("number" == typeof t5) return t5;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t5 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s4) + t4[n7 + 1]), t4[0]);
  return new o3(n6, t4, s);
};
var S = (s4, n6) => {
  e8 ? s4.adoptedStyleSheets = n6.map(((t4) => t4 instanceof CSSStyleSheet ? t4 : t4.styleSheet)) : n6.forEach(((e10) => {
    const n7 = document.createElement("style"), o8 = t3.litNonce;
    void 0 !== o8 && n7.setAttribute("nonce", o8), n7.textContent = e10.cssText, s4.appendChild(n7);
  }));
};
var c = e8 ? (t4) => t4 : (t4) => t4 instanceof CSSStyleSheet ? ((t5) => {
  let e10 = "";
  for (const s4 of t5.cssRules) e10 += s4.cssText;
  return r(e10);
})(t4) : t4;

// ../node_modules/@lit/reactive-element/reactive-element.js
var s2;
var e9 = window;
var r2 = e9.trustedTypes;
var h = r2 ? r2.emptyScript : "";
var o4 = e9.reactiveElementPolyfillSupport;
var n4 = { toAttribute(t4, i5) {
  switch (i5) {
    case Boolean:
      t4 = t4 ? h : null;
      break;
    case Object:
    case Array:
      t4 = null == t4 ? t4 : JSON.stringify(t4);
  }
  return t4;
}, fromAttribute(t4, i5) {
  let s4 = t4;
  switch (i5) {
    case Boolean:
      s4 = null !== t4;
      break;
    case Number:
      s4 = null === t4 ? null : Number(t4);
      break;
    case Object:
    case Array:
      try {
        s4 = JSON.parse(t4);
      } catch (t5) {
        s4 = null;
      }
  }
  return s4;
} };
var a = (t4, i5) => i5 !== t4 && (i5 == i5 || t4 == t4);
var l2 = { attribute: true, type: String, converter: n4, reflect: false, hasChanged: a };
var d = "finalized";
var u = class extends HTMLElement {
  constructor() {
    super(), this._$Ei = /* @__PURE__ */ new Map(), this.isUpdatePending = false, this.hasUpdated = false, this._$El = null, this.u();
  }
  static addInitializer(t4) {
    var i5;
    this.finalize(), (null !== (i5 = this.h) && void 0 !== i5 ? i5 : this.h = []).push(t4);
  }
  static get observedAttributes() {
    this.finalize();
    const t4 = [];
    return this.elementProperties.forEach(((i5, s4) => {
      const e10 = this._$Ep(s4, i5);
      void 0 !== e10 && (this._$Ev.set(e10, s4), t4.push(e10));
    })), t4;
  }
  static createProperty(t4, i5 = l2) {
    if (i5.state && (i5.attribute = false), this.finalize(), this.elementProperties.set(t4, i5), !i5.noAccessor && !this.prototype.hasOwnProperty(t4)) {
      const s4 = "symbol" == typeof t4 ? /* @__PURE__ */ Symbol() : "__" + t4, e10 = this.getPropertyDescriptor(t4, s4, i5);
      void 0 !== e10 && Object.defineProperty(this.prototype, t4, e10);
    }
  }
  static getPropertyDescriptor(t4, i5, s4) {
    return { get() {
      return this[i5];
    }, set(e10) {
      const r3 = this[t4];
      this[i5] = e10, this.requestUpdate(t4, r3, s4);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t4) {
    return this.elementProperties.get(t4) || l2;
  }
  static finalize() {
    if (this.hasOwnProperty(d)) return false;
    this[d] = true;
    const t4 = Object.getPrototypeOf(this);
    if (t4.finalize(), void 0 !== t4.h && (this.h = [...t4.h]), this.elementProperties = new Map(t4.elementProperties), this._$Ev = /* @__PURE__ */ new Map(), this.hasOwnProperty("properties")) {
      const t5 = this.properties, i5 = [...Object.getOwnPropertyNames(t5), ...Object.getOwnPropertySymbols(t5)];
      for (const s4 of i5) this.createProperty(s4, t5[s4]);
    }
    return this.elementStyles = this.finalizeStyles(this.styles), true;
  }
  static finalizeStyles(i5) {
    const s4 = [];
    if (Array.isArray(i5)) {
      const e10 = new Set(i5.flat(1 / 0).reverse());
      for (const i6 of e10) s4.unshift(c(i6));
    } else void 0 !== i5 && s4.push(c(i5));
    return s4;
  }
  static _$Ep(t4, i5) {
    const s4 = i5.attribute;
    return false === s4 ? void 0 : "string" == typeof s4 ? s4 : "string" == typeof t4 ? t4.toLowerCase() : void 0;
  }
  u() {
    var t4;
    this._$E_ = new Promise(((t5) => this.enableUpdating = t5)), this._$AL = /* @__PURE__ */ new Map(), this._$Eg(), this.requestUpdate(), null === (t4 = this.constructor.h) || void 0 === t4 || t4.forEach(((t5) => t5(this)));
  }
  addController(t4) {
    var i5, s4;
    (null !== (i5 = this._$ES) && void 0 !== i5 ? i5 : this._$ES = []).push(t4), void 0 !== this.renderRoot && this.isConnected && (null === (s4 = t4.hostConnected) || void 0 === s4 || s4.call(t4));
  }
  removeController(t4) {
    var i5;
    null === (i5 = this._$ES) || void 0 === i5 || i5.splice(this._$ES.indexOf(t4) >>> 0, 1);
  }
  _$Eg() {
    this.constructor.elementProperties.forEach(((t4, i5) => {
      this.hasOwnProperty(i5) && (this._$Ei.set(i5, this[i5]), delete this[i5]);
    }));
  }
  createRenderRoot() {
    var t4;
    const s4 = null !== (t4 = this.shadowRoot) && void 0 !== t4 ? t4 : this.attachShadow(this.constructor.shadowRootOptions);
    return S(s4, this.constructor.elementStyles), s4;
  }
  connectedCallback() {
    var t4;
    void 0 === this.renderRoot && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), null === (t4 = this._$ES) || void 0 === t4 || t4.forEach(((t5) => {
      var i5;
      return null === (i5 = t5.hostConnected) || void 0 === i5 ? void 0 : i5.call(t5);
    }));
  }
  enableUpdating(t4) {
  }
  disconnectedCallback() {
    var t4;
    null === (t4 = this._$ES) || void 0 === t4 || t4.forEach(((t5) => {
      var i5;
      return null === (i5 = t5.hostDisconnected) || void 0 === i5 ? void 0 : i5.call(t5);
    }));
  }
  attributeChangedCallback(t4, i5, s4) {
    this._$AK(t4, s4);
  }
  _$EO(t4, i5, s4 = l2) {
    var e10;
    const r3 = this.constructor._$Ep(t4, s4);
    if (void 0 !== r3 && true === s4.reflect) {
      const h2 = (void 0 !== (null === (e10 = s4.converter) || void 0 === e10 ? void 0 : e10.toAttribute) ? s4.converter : n4).toAttribute(i5, s4.type);
      this._$El = t4, null == h2 ? this.removeAttribute(r3) : this.setAttribute(r3, h2), this._$El = null;
    }
  }
  _$AK(t4, i5) {
    var s4;
    const e10 = this.constructor, r3 = e10._$Ev.get(t4);
    if (void 0 !== r3 && this._$El !== r3) {
      const t5 = e10.getPropertyOptions(r3), h2 = "function" == typeof t5.converter ? { fromAttribute: t5.converter } : void 0 !== (null === (s4 = t5.converter) || void 0 === s4 ? void 0 : s4.fromAttribute) ? t5.converter : n4;
      this._$El = r3, this[r3] = h2.fromAttribute(i5, t5.type), this._$El = null;
    }
  }
  requestUpdate(t4, i5, s4) {
    let e10 = true;
    void 0 !== t4 && (((s4 = s4 || this.constructor.getPropertyOptions(t4)).hasChanged || a)(this[t4], i5) ? (this._$AL.has(t4) || this._$AL.set(t4, i5), true === s4.reflect && this._$El !== t4 && (void 0 === this._$EC && (this._$EC = /* @__PURE__ */ new Map()), this._$EC.set(t4, s4))) : e10 = false), !this.isUpdatePending && e10 && (this._$E_ = this._$Ej());
  }
  async _$Ej() {
    this.isUpdatePending = true;
    try {
      await this._$E_;
    } catch (t5) {
      Promise.reject(t5);
    }
    const t4 = this.scheduleUpdate();
    return null != t4 && await t4, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var t4;
    if (!this.isUpdatePending) return;
    this.hasUpdated, this._$Ei && (this._$Ei.forEach(((t5, i6) => this[i6] = t5)), this._$Ei = void 0);
    let i5 = false;
    const s4 = this._$AL;
    try {
      i5 = this.shouldUpdate(s4), i5 ? (this.willUpdate(s4), null === (t4 = this._$ES) || void 0 === t4 || t4.forEach(((t5) => {
        var i6;
        return null === (i6 = t5.hostUpdate) || void 0 === i6 ? void 0 : i6.call(t5);
      })), this.update(s4)) : this._$Ek();
    } catch (t5) {
      throw i5 = false, this._$Ek(), t5;
    }
    i5 && this._$AE(s4);
  }
  willUpdate(t4) {
  }
  _$AE(t4) {
    var i5;
    null === (i5 = this._$ES) || void 0 === i5 || i5.forEach(((t5) => {
      var i6;
      return null === (i6 = t5.hostUpdated) || void 0 === i6 ? void 0 : i6.call(t5);
    })), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t4)), this.updated(t4);
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
  shouldUpdate(t4) {
    return true;
  }
  update(t4) {
    void 0 !== this._$EC && (this._$EC.forEach(((t5, i5) => this._$EO(i5, this[i5], t5))), this._$EC = void 0), this._$Ek();
  }
  updated(t4) {
  }
  firstUpdated(t4) {
  }
};
u[d] = true, u.elementProperties = /* @__PURE__ */ new Map(), u.elementStyles = [], u.shadowRootOptions = { mode: "open" }, null == o4 || o4({ ReactiveElement: u }), (null !== (s2 = e9.reactiveElementVersions) && void 0 !== s2 ? s2 : e9.reactiveElementVersions = []).push("1.6.2");

// ../node_modules/lit-element/lit-element.js
var l3;
var o5;
var s3 = class extends u {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t4, e10;
    const i5 = super.createRenderRoot();
    return null !== (t4 = (e10 = this.renderOptions).renderBefore) && void 0 !== t4 || (e10.renderBefore = i5.firstChild), i5;
  }
  update(t4) {
    const i5 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t4), this._$Do = D(i5, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t4;
    super.connectedCallback(), null === (t4 = this._$Do) || void 0 === t4 || t4.setConnected(true);
  }
  disconnectedCallback() {
    var t4;
    super.disconnectedCallback(), null === (t4 = this._$Do) || void 0 === t4 || t4.setConnected(false);
  }
  render() {
    return T;
  }
};
s3.finalized = true, s3._$litElement$ = true, null === (l3 = globalThis.litElementHydrateSupport) || void 0 === l3 || l3.call(globalThis, { LitElement: s3 });
var n5 = globalThis.litElementPolyfillSupport;
null == n5 || n5({ LitElement: s3 });
(null !== (o5 = globalThis.litElementVersions) && void 0 !== o5 ? o5 : globalThis.litElementVersions = []).push("3.3.2");

// ../node_modules/lit-html/is-server.js
var o6 = false;

// ../node_modules/lit-html/directives/class-map.js
var o7 = e(class extends i {
  constructor(t4) {
    var i5;
    if (super(t4), t4.type !== t.ATTRIBUTE || "class" !== t4.name || (null === (i5 = t4.strings) || void 0 === i5 ? void 0 : i5.length) > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(t4) {
    return " " + Object.keys(t4).filter(((i5) => t4[i5])).join(" ") + " ";
  }
  update(i5, [s4]) {
    var r3, o8;
    if (void 0 === this.it) {
      this.it = /* @__PURE__ */ new Set(), void 0 !== i5.strings && (this.nt = new Set(i5.strings.join(" ").split(/\s/).filter(((t4) => "" !== t4))));
      for (const t4 in s4) s4[t4] && !(null === (r3 = this.nt) || void 0 === r3 ? void 0 : r3.has(t4)) && this.it.add(t4);
      return this.render(s4);
    }
    const e10 = i5.element.classList;
    this.it.forEach(((t4) => {
      t4 in s4 || (e10.remove(t4), this.it.delete(t4));
    }));
    for (const t4 in s4) {
      const i6 = !!s4[t4];
      i6 === this.it.has(t4) || (null === (o8 = this.nt) || void 0 === o8 ? void 0 : o8.has(t4)) || (i6 ? (e10.add(t4), this.it.add(t4)) : (e10.remove(t4), this.it.delete(t4)));
    }
    return T;
  }
});

export {
  __extends,
  __assign,
  __decorate,
  __values,
  e2 as e,
  n,
  t2 as t,
  e6 as e2,
  i3 as i,
  e4 as e3,
  e7 as e4,
  l,
  o2 as o,
  i4 as i2,
  s3 as s,
  o6 as o2,
  o7 as o3
};
/*! Bundled license information:

@lit/reactive-element/decorators/custom-element.js:
@lit/reactive-element/decorators/property.js:
@lit/reactive-element/decorators/state.js:
@lit/reactive-element/decorators/base.js:
@lit/reactive-element/decorators/query.js:
@lit/reactive-element/decorators/query-all.js:
@lit/reactive-element/decorators/event-options.js:
@lit/reactive-element/decorators/query-async.js:
@lit/reactive-element/decorators/query-assigned-nodes.js:
@lit/reactive-element/reactive-element.js:
lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/class-map.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
//# sourceMappingURL=chunk-KV6CMQ6O.js.map
