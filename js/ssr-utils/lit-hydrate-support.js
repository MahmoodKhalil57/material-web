import {
  e,
  i,
  t as t2
} from "../chunk-RTSU4DGK.js";
import {
  D,
  T,
  j,
  t
} from "../chunk-JVQ4V6KC.js";
import "../chunk-EUXUH3YW.js";

// ../node_modules/lit-html/private-ssr-support.js
var r = { boundAttributeSuffix: j.O, marker: j.P, markerMatch: j.A, HTML_RESULT: j.C, getTemplateHtml: j.M, overrideDirectiveResolve: (e2, t3) => class extends e2 {
  _$AS(e3, r2) {
    return t3(this, r2);
  }
}, setDirectiveClass(e2, t3) {
  e2._$litDirective$ = t3;
}, getAttributePartCommittedValue: (e2, r2, a) => {
  let i3 = T;
  return e2.j = (e3) => i3 = e3, e2._$AI(r2, e2, a), i3;
}, connectedDisconnectable: (e2) => ({ ...e2, _$AU: true }), resolveDirective: j.D, AttributePart: j.V, PropertyPart: j.U, BooleanAttributePart: j.H, EventPart: j.N, ElementPart: j.F, TemplateInstance: j.L, isIterable: j.R, ChildPart: j.I };

// ../node_modules/@lit-labs/ssr-client/lib/hydrate-lit-html.js
var { TemplateInstance: l, isIterable: i2, resolveDirective: s, ChildPart: c, ElementPart: d } = r;
var p = (e2, t3, r2 = {}) => {
  if (void 0 !== t3._$litPart$) throw Error("container already contains a live render");
  let n, o, a;
  const l2 = [], i3 = document.createTreeWalker(t3, NodeFilter.SHOW_COMMENT, null, false);
  let s2;
  for (; null !== (s2 = i3.nextNode()); ) {
    const t4 = s2.data;
    if (t4.startsWith("lit-part")) {
      if (0 === l2.length && void 0 !== n) throw Error(`There must be only one root part per container. Found a part marker (${s2}) when we already have a root part marker (${o})`);
      a = f(e2, s2, l2, r2), null != n || (n = a), null != o || (o = s2);
    } else if (t4.startsWith("lit-node")) h(s2, l2, r2);
    else if (t4.startsWith("/lit-part")) {
      if (1 === l2.length && a !== n) throw Error("internal error");
      a = m(s2, a, l2);
    }
  }
  if (void 0 === n) {
    const e3 = t3 instanceof ShadowRoot ? "{container.host.localName}'s shadow root" : t3 instanceof DocumentFragment ? "DocumentFragment" : t3.localName;
    console.error(`There should be exactly one root part in a render container, but we didn't find any in ${e3}.`);
  }
  t3._$litPart$ = n;
};
var f = (t3, r2, a, d2) => {
  let p2, f2;
  if (0 === a.length) f2 = new c(r2, null, void 0, d2), p2 = t3;
  else {
    const e2 = a[a.length - 1];
    if ("template-instance" === e2.type) f2 = new c(r2, null, e2.instance, d2), e2.instance._$AV.push(f2), p2 = e2.result.values[e2.instancePartIndex++], e2.templatePartIndex++;
    else if ("iterable" === e2.type) {
      f2 = new c(r2, null, e2.part, d2);
      const t4 = e2.iterator.next();
      if (t4.done) throw p2 = void 0, e2.done = true, Error("Unhandled shorter than expected iterable");
      p2 = t4.value, e2.part._$AH.push(f2);
    } else f2 = new c(r2, null, e2.part, d2);
  }
  if (p2 = s(f2, p2), p2 === T) a.push({ part: f2, type: "leaf" });
  else if (i(p2)) a.push({ part: f2, type: "leaf" }), f2._$AH = p2;
  else if (t2(p2)) {
    const e2 = "lit-part " + u(p2);
    if (r2.data !== e2) throw Error("Hydration value mismatch: Unexpected TemplateResult rendered to part");
    {
      const e3 = c.prototype._$AC(p2), t4 = new l(e3, f2);
      a.push({ type: "template-instance", instance: t4, part: f2, templatePartIndex: 0, instancePartIndex: 0, result: p2 }), f2._$AH = t4;
    }
  } else i2(p2) ? (a.push({ part: f2, type: "iterable", value: p2, iterator: p2[Symbol.iterator](), done: false }), f2._$AH = []) : (a.push({ part: f2, type: "leaf" }), f2._$AH = null == p2 ? "" : p2);
  return f2;
};
var m = (e2, t3, r2) => {
  if (void 0 === t3) throw Error("unbalanced part marker");
  t3._$AB = e2;
  const n = r2.pop();
  if ("iterable" === n.type && !n.iterator.next().done) throw Error("unexpected longer than expected iterable");
  if (r2.length > 0) return r2[r2.length - 1].part;
};
var h = (e2, t3, n) => {
  const o = /lit-node (\d+)/.exec(e2.data), l2 = parseInt(o[1]), i3 = e2.nextElementSibling;
  if (null === i3) throw Error("could not find node for attribute parts");
  i3.removeAttribute("defer-hydration");
  const c2 = t3[t3.length - 1];
  if ("template-instance" !== c2.type) throw Error("internal error");
  {
    const e3 = c2.instance;
    for (; ; ) {
      const t4 = e3._$AD.parts[c2.templatePartIndex];
      if (void 0 === t4 || t4.type !== t.ATTRIBUTE && t4.type !== t.ELEMENT || t4.index !== l2) break;
      if (t4.type === t.ATTRIBUTE) {
        const o2 = new t4.ctor(i3, t4.name, t4.strings, c2.instance, n), l3 = e(o2) ? c2.result.values[c2.instancePartIndex] : c2.result.values, s2 = !(o2.type === t.EVENT || o2.type === t.PROPERTY);
        o2._$AI(l3, o2, c2.instancePartIndex, s2), c2.instancePartIndex += t4.strings.length - 1, e3._$AV.push(o2);
      } else {
        const t5 = new d(i3, c2.instance, n);
        s(t5, c2.result.values[c2.instancePartIndex++]), e3._$AV.push(t5);
      }
      c2.templatePartIndex++;
    }
  }
};
var u = (e2) => {
  const t3 = new Uint32Array(2).fill(5381);
  for (const r3 of e2.strings) for (let e3 = 0; e3 < r3.length; e3++) t3[e3 % 2] = 33 * t3[e3 % 2] ^ r3.charCodeAt(e3);
  const r2 = String.fromCharCode(...new Uint8Array(t3.buffer));
  return btoa(r2);
};

// ../node_modules/@lit-labs/ssr-client/lit-element-hydrate-support.js
globalThis.litElementHydrateSupport = ({ LitElement: s2 }) => {
  const h2 = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(s2), "observedAttributes").get;
  Object.defineProperty(s2, "observedAttributes", { get() {
    return [...h2.call(this), "defer-hydration"];
  } });
  const e2 = s2.prototype.attributeChangedCallback;
  s2.prototype.attributeChangedCallback = function(t3, i3, s3) {
    "defer-hydration" === t3 && null === s3 && n.call(this), e2.call(this, t3, i3, s3);
  };
  const n = s2.prototype.connectedCallback;
  s2.prototype.connectedCallback = function() {
    this.hasAttribute("defer-hydration") || n.call(this);
  };
  const o = s2.prototype.createRenderRoot;
  s2.prototype.createRenderRoot = function() {
    return this.shadowRoot ? (this._$AG = true, this.shadowRoot) : o.call(this);
  };
  const r2 = Object.getPrototypeOf(s2.prototype).update;
  s2.prototype.update = function(s3) {
    const h3 = this.render();
    if (r2.call(this, s3), this._$AG) {
      this._$AG = false;
      for (let t3 = 0; t3 < this.attributes.length; t3++) {
        const i3 = this.attributes[t3];
        if (i3.name.startsWith("hydrate-internals-")) {
          const t4 = i3.name.slice(18);
          this.removeAttribute(t4), this.removeAttribute(i3.name);
        }
      }
      p(h3, this.renderRoot, this.renderOptions);
    } else D(h3, this.renderRoot, this.renderOptions);
  };
};
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/*! Bundled license information:

lit-html/private-ssr-support.js:
@lit-labs/ssr-client/lib/hydrate-lit-html.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
//# sourceMappingURL=lit-hydrate-support.js.map
