// ../node_modules/lit-html/lit-html.js
var t;
var i = window;
var s = i.trustedTypes;
var e = s ? s.createPolicy("lit-html", { createHTML: (t3) => t3 }) : void 0;
var o = "$lit$";
var n = `lit$${(Math.random() + "").slice(9)}$`;
var l = "?" + n;
var h = `<${l}>`;
var r = document;
var u = () => r.createComment("");
var d = (t3) => null === t3 || "object" != typeof t3 && "function" != typeof t3;
var c = Array.isArray;
var v = (t3) => c(t3) || "function" == typeof (null == t3 ? void 0 : t3[Symbol.iterator]);
var a = "[ 	\n\f\r]";
var f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var _ = /-->/g;
var m = />/g;
var p = RegExp(`>|${a}(?:([^\\s"'>=/]+)(${a}*=${a}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
var g = /'/g;
var $ = /"/g;
var y = /^(?:script|style|textarea|title)$/i;
var w = (t3) => (i3, ...s2) => ({ _$litType$: t3, strings: i3, values: s2 });
var x = w(1);
var b = w(2);
var T = /* @__PURE__ */ Symbol.for("lit-noChange");
var A = /* @__PURE__ */ Symbol.for("lit-nothing");
var E = /* @__PURE__ */ new WeakMap();
var C = r.createTreeWalker(r, 129, null, false);
function P(t3, i3) {
  if (!Array.isArray(t3) || !t3.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== e ? e.createHTML(i3) : i3;
}
var V = (t3, i3) => {
  const s2 = t3.length - 1, e3 = [];
  let l2, r2 = 2 === i3 ? "<svg>" : "", u2 = f;
  for (let i4 = 0; i4 < s2; i4++) {
    const s3 = t3[i4];
    let d2, c2, v2 = -1, a2 = 0;
    for (; a2 < s3.length && (u2.lastIndex = a2, c2 = u2.exec(s3), null !== c2); ) a2 = u2.lastIndex, u2 === f ? "!--" === c2[1] ? u2 = _ : void 0 !== c2[1] ? u2 = m : void 0 !== c2[2] ? (y.test(c2[2]) && (l2 = RegExp("</" + c2[2], "g")), u2 = p) : void 0 !== c2[3] && (u2 = p) : u2 === p ? ">" === c2[0] ? (u2 = null != l2 ? l2 : f, v2 = -1) : void 0 === c2[1] ? v2 = -2 : (v2 = u2.lastIndex - c2[2].length, d2 = c2[1], u2 = void 0 === c2[3] ? p : '"' === c2[3] ? $ : g) : u2 === $ || u2 === g ? u2 = p : u2 === _ || u2 === m ? u2 = f : (u2 = p, l2 = void 0);
    const w2 = u2 === p && t3[i4 + 1].startsWith("/>") ? " " : "";
    r2 += u2 === f ? s3 + h : v2 >= 0 ? (e3.push(d2), s3.slice(0, v2) + o + s3.slice(v2) + n + w2) : s3 + n + (-2 === v2 ? (e3.push(void 0), i4) : w2);
  }
  return [P(t3, r2 + (t3[s2] || "<?>") + (2 === i3 ? "</svg>" : "")), e3];
};
var N = class _N {
  constructor({ strings: t3, _$litType$: i3 }, e3) {
    let h2;
    this.parts = [];
    let r2 = 0, d2 = 0;
    const c2 = t3.length - 1, v2 = this.parts, [a2, f2] = V(t3, i3);
    if (this.el = _N.createElement(a2, e3), C.currentNode = this.el.content, 2 === i3) {
      const t4 = this.el.content, i4 = t4.firstChild;
      i4.remove(), t4.append(...i4.childNodes);
    }
    for (; null !== (h2 = C.nextNode()) && v2.length < c2; ) {
      if (1 === h2.nodeType) {
        if (h2.hasAttributes()) {
          const t4 = [];
          for (const i4 of h2.getAttributeNames()) if (i4.endsWith(o) || i4.startsWith(n)) {
            const s2 = f2[d2++];
            if (t4.push(i4), void 0 !== s2) {
              const t5 = h2.getAttribute(s2.toLowerCase() + o).split(n), i5 = /([.?@])?(.*)/.exec(s2);
              v2.push({ type: 1, index: r2, name: i5[2], strings: t5, ctor: "." === i5[1] ? H : "?" === i5[1] ? L : "@" === i5[1] ? z : k });
            } else v2.push({ type: 6, index: r2 });
          }
          for (const i4 of t4) h2.removeAttribute(i4);
        }
        if (y.test(h2.tagName)) {
          const t4 = h2.textContent.split(n), i4 = t4.length - 1;
          if (i4 > 0) {
            h2.textContent = s ? s.emptyScript : "";
            for (let s2 = 0; s2 < i4; s2++) h2.append(t4[s2], u()), C.nextNode(), v2.push({ type: 2, index: ++r2 });
            h2.append(t4[i4], u());
          }
        }
      } else if (8 === h2.nodeType) if (h2.data === l) v2.push({ type: 2, index: r2 });
      else {
        let t4 = -1;
        for (; -1 !== (t4 = h2.data.indexOf(n, t4 + 1)); ) v2.push({ type: 7, index: r2 }), t4 += n.length - 1;
      }
      r2++;
    }
  }
  static createElement(t3, i3) {
    const s2 = r.createElement("template");
    return s2.innerHTML = t3, s2;
  }
};
function S(t3, i3, s2 = t3, e3) {
  var o2, n2, l2, h2;
  if (i3 === T) return i3;
  let r2 = void 0 !== e3 ? null === (o2 = s2._$Co) || void 0 === o2 ? void 0 : o2[e3] : s2._$Cl;
  const u2 = d(i3) ? void 0 : i3._$litDirective$;
  return (null == r2 ? void 0 : r2.constructor) !== u2 && (null === (n2 = null == r2 ? void 0 : r2._$AO) || void 0 === n2 || n2.call(r2, false), void 0 === u2 ? r2 = void 0 : (r2 = new u2(t3), r2._$AT(t3, s2, e3)), void 0 !== e3 ? (null !== (l2 = (h2 = s2)._$Co) && void 0 !== l2 ? l2 : h2._$Co = [])[e3] = r2 : s2._$Cl = r2), void 0 !== r2 && (i3 = S(t3, r2._$AS(t3, i3.values), r2, e3)), i3;
}
var M = class {
  constructor(t3, i3) {
    this._$AV = [], this._$AN = void 0, this._$AD = t3, this._$AM = i3;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t3) {
    var i3;
    const { el: { content: s2 }, parts: e3 } = this._$AD, o2 = (null !== (i3 = null == t3 ? void 0 : t3.creationScope) && void 0 !== i3 ? i3 : r).importNode(s2, true);
    C.currentNode = o2;
    let n2 = C.nextNode(), l2 = 0, h2 = 0, u2 = e3[0];
    for (; void 0 !== u2; ) {
      if (l2 === u2.index) {
        let i4;
        2 === u2.type ? i4 = new R(n2, n2.nextSibling, this, t3) : 1 === u2.type ? i4 = new u2.ctor(n2, u2.name, u2.strings, this, t3) : 6 === u2.type && (i4 = new Z(n2, this, t3)), this._$AV.push(i4), u2 = e3[++h2];
      }
      l2 !== (null == u2 ? void 0 : u2.index) && (n2 = C.nextNode(), l2++);
    }
    return C.currentNode = r, o2;
  }
  v(t3) {
    let i3 = 0;
    for (const s2 of this._$AV) void 0 !== s2 && (void 0 !== s2.strings ? (s2._$AI(t3, s2, i3), i3 += s2.strings.length - 2) : s2._$AI(t3[i3])), i3++;
  }
};
var R = class _R {
  constructor(t3, i3, s2, e3) {
    var o2;
    this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t3, this._$AB = i3, this._$AM = s2, this.options = e3, this._$Cp = null === (o2 = null == e3 ? void 0 : e3.isConnected) || void 0 === o2 || o2;
  }
  get _$AU() {
    var t3, i3;
    return null !== (i3 = null === (t3 = this._$AM) || void 0 === t3 ? void 0 : t3._$AU) && void 0 !== i3 ? i3 : this._$Cp;
  }
  get parentNode() {
    let t3 = this._$AA.parentNode;
    const i3 = this._$AM;
    return void 0 !== i3 && 11 === (null == t3 ? void 0 : t3.nodeType) && (t3 = i3.parentNode), t3;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t3, i3 = this) {
    t3 = S(this, t3, i3), d(t3) ? t3 === A || null == t3 || "" === t3 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t3 !== this._$AH && t3 !== T && this._(t3) : void 0 !== t3._$litType$ ? this.g(t3) : void 0 !== t3.nodeType ? this.$(t3) : v(t3) ? this.T(t3) : this._(t3);
  }
  k(t3) {
    return this._$AA.parentNode.insertBefore(t3, this._$AB);
  }
  $(t3) {
    this._$AH !== t3 && (this._$AR(), this._$AH = this.k(t3));
  }
  _(t3) {
    this._$AH !== A && d(this._$AH) ? this._$AA.nextSibling.data = t3 : this.$(r.createTextNode(t3)), this._$AH = t3;
  }
  g(t3) {
    var i3;
    const { values: s2, _$litType$: e3 } = t3, o2 = "number" == typeof e3 ? this._$AC(t3) : (void 0 === e3.el && (e3.el = N.createElement(P(e3.h, e3.h[0]), this.options)), e3);
    if ((null === (i3 = this._$AH) || void 0 === i3 ? void 0 : i3._$AD) === o2) this._$AH.v(s2);
    else {
      const t4 = new M(o2, this), i4 = t4.u(this.options);
      t4.v(s2), this.$(i4), this._$AH = t4;
    }
  }
  _$AC(t3) {
    let i3 = E.get(t3.strings);
    return void 0 === i3 && E.set(t3.strings, i3 = new N(t3)), i3;
  }
  T(t3) {
    c(this._$AH) || (this._$AH = [], this._$AR());
    const i3 = this._$AH;
    let s2, e3 = 0;
    for (const o2 of t3) e3 === i3.length ? i3.push(s2 = new _R(this.k(u()), this.k(u()), this, this.options)) : s2 = i3[e3], s2._$AI(o2), e3++;
    e3 < i3.length && (this._$AR(s2 && s2._$AB.nextSibling, e3), i3.length = e3);
  }
  _$AR(t3 = this._$AA.nextSibling, i3) {
    var s2;
    for (null === (s2 = this._$AP) || void 0 === s2 || s2.call(this, false, true, i3); t3 && t3 !== this._$AB; ) {
      const i4 = t3.nextSibling;
      t3.remove(), t3 = i4;
    }
  }
  setConnected(t3) {
    var i3;
    void 0 === this._$AM && (this._$Cp = t3, null === (i3 = this._$AP) || void 0 === i3 || i3.call(this, t3));
  }
};
var k = class {
  constructor(t3, i3, s2, e3, o2) {
    this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t3, this.name = i3, this._$AM = e3, this.options = o2, s2.length > 2 || "" !== s2[0] || "" !== s2[1] ? (this._$AH = Array(s2.length - 1).fill(new String()), this.strings = s2) : this._$AH = A;
  }
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t3, i3 = this, s2, e3) {
    const o2 = this.strings;
    let n2 = false;
    if (void 0 === o2) t3 = S(this, t3, i3, 0), n2 = !d(t3) || t3 !== this._$AH && t3 !== T, n2 && (this._$AH = t3);
    else {
      const e4 = t3;
      let l2, h2;
      for (t3 = o2[0], l2 = 0; l2 < o2.length - 1; l2++) h2 = S(this, e4[s2 + l2], i3, l2), h2 === T && (h2 = this._$AH[l2]), n2 || (n2 = !d(h2) || h2 !== this._$AH[l2]), h2 === A ? t3 = A : t3 !== A && (t3 += (null != h2 ? h2 : "") + o2[l2 + 1]), this._$AH[l2] = h2;
    }
    n2 && !e3 && this.j(t3);
  }
  j(t3) {
    t3 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, null != t3 ? t3 : "");
  }
};
var H = class extends k {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t3) {
    this.element[this.name] = t3 === A ? void 0 : t3;
  }
};
var I = s ? s.emptyScript : "";
var L = class extends k {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t3) {
    t3 && t3 !== A ? this.element.setAttribute(this.name, I) : this.element.removeAttribute(this.name);
  }
};
var z = class extends k {
  constructor(t3, i3, s2, e3, o2) {
    super(t3, i3, s2, e3, o2), this.type = 5;
  }
  _$AI(t3, i3 = this) {
    var s2;
    if ((t3 = null !== (s2 = S(this, t3, i3, 0)) && void 0 !== s2 ? s2 : A) === T) return;
    const e3 = this._$AH, o2 = t3 === A && e3 !== A || t3.capture !== e3.capture || t3.once !== e3.once || t3.passive !== e3.passive, n2 = t3 !== A && (e3 === A || o2);
    o2 && this.element.removeEventListener(this.name, this, e3), n2 && this.element.addEventListener(this.name, this, t3), this._$AH = t3;
  }
  handleEvent(t3) {
    var i3, s2;
    "function" == typeof this._$AH ? this._$AH.call(null !== (s2 = null === (i3 = this.options) || void 0 === i3 ? void 0 : i3.host) && void 0 !== s2 ? s2 : this.element, t3) : this._$AH.handleEvent(t3);
  }
};
var Z = class {
  constructor(t3, i3, s2) {
    this.element = t3, this.type = 6, this._$AN = void 0, this._$AM = i3, this.options = s2;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t3) {
    S(this, t3);
  }
};
var j = { O: o, P: n, A: l, C: 1, M: V, L: M, R: v, D: S, I: R, V: k, H: L, N: z, U: H, F: Z };
var B = i.litHtmlPolyfillSupport;
null == B || B(N, R), (null !== (t = i.litHtmlVersions) && void 0 !== t ? t : i.litHtmlVersions = []).push("2.8.0");
var D = (t3, i3, s2) => {
  var e3, o2;
  const n2 = null !== (e3 = null == s2 ? void 0 : s2.renderBefore) && void 0 !== e3 ? e3 : i3;
  let l2 = n2._$litPart$;
  if (void 0 === l2) {
    const t4 = null !== (o2 = null == s2 ? void 0 : s2.renderBefore) && void 0 !== o2 ? o2 : null;
    n2._$litPart$ = l2 = new R(i3.insertBefore(u(), t4), t4, void 0, null != s2 ? s2 : {});
  }
  return l2._$AI(t3), l2;
};

// ../node_modules/lit-html/directive.js
var t2 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
var e2 = (t3) => (...e3) => ({ _$litDirective$: t3, values: e3 });
var i2 = class {
  constructor(t3) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t3, e3, i3) {
    this._$Ct = t3, this._$AM = e3, this._$Ci = i3;
  }
  _$AS(t3, e3) {
    return this.update(t3, e3);
  }
  update(t3, e3) {
    return this.render(...e3);
  }
};

export {
  x,
  b,
  T,
  A,
  j,
  D,
  t2 as t,
  e2 as e,
  i2 as i
};
/*! Bundled license information:

lit-html/lit-html.js:
lit-html/directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
//# sourceMappingURL=chunk-JVQ4V6KC.js.map
