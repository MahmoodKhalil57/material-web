import "../chunk-BJVPWPVZ.js";
import "../chunk-DVYP2TIY.js";
import "../chunk-BCJ5JKJX.js";
import {
  l
} from "../chunk-MFSXPBED.js";
import {
  e as e3
} from "../chunk-RTSU4DGK.js";
import "../chunk-2M5KBCPP.js";
import "../chunk-XZJUA2GG.js";
import "../chunk-G4K3MFK5.js";
import "../chunk-23AR7BXN.js";
import "../chunk-AAO4BAFU.js";
import "../chunk-AE6MH53A.js";
import "../chunk-2L6NDFVR.js";
import {
  EASING
} from "../chunk-AE4DAVXE.js";
import {
  e,
  i,
  i2,
  n,
  s,
  t
} from "../chunk-KV6CMQ6O.js";
import {
  A,
  e as e2,
  i as i3,
  t as t2,
  x
} from "../chunk-JVQ4V6KC.js";
import {
  __decorateClass
} from "../chunk-EUXUH3YW.js";

// ../node_modules/lit-html/async-directive.js
var s2 = (i6, t5) => {
  var e6, o2;
  const r5 = i6._$AN;
  if (void 0 === r5) return false;
  for (const i7 of r5) null === (o2 = (e6 = i7)._$AO) || void 0 === o2 || o2.call(e6, t5, false), s2(i7, t5);
  return true;
};
var o = (i6) => {
  let t5, e6;
  do {
    if (void 0 === (t5 = i6._$AM)) break;
    e6 = t5._$AN, e6.delete(i6), i6 = t5;
  } while (0 === (null == e6 ? void 0 : e6.size));
};
var r = (i6) => {
  for (let t5; t5 = i6._$AM; i6 = t5) {
    let e6 = t5._$AN;
    if (void 0 === e6) t5._$AN = e6 = /* @__PURE__ */ new Set();
    else if (e6.has(i6)) break;
    e6.add(i6), l2(t5);
  }
};
function n2(i6) {
  void 0 !== this._$AN ? (o(this), this._$AM = i6, r(this)) : this._$AM = i6;
}
function h(i6, t5 = false, e6 = 0) {
  const r5 = this._$AH, n5 = this._$AN;
  if (void 0 !== n5 && 0 !== n5.size) if (t5) if (Array.isArray(r5)) for (let i7 = e6; i7 < r5.length; i7++) s2(r5[i7], false), o(r5[i7]);
  else null != r5 && (s2(r5, false), o(r5));
  else s2(this, i6);
}
var l2 = (i6) => {
  var t5, s4, o2, r5;
  i6.type == t2.CHILD && (null !== (t5 = (o2 = i6)._$AP) && void 0 !== t5 || (o2._$AP = h), null !== (s4 = (r5 = i6)._$AQ) && void 0 !== s4 || (r5._$AQ = n2));
};
var c = class extends i3 {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(i6, t5, e6) {
    super._$AT(i6, t5, e6), r(this), this.isConnected = i6._$AU;
  }
  _$AO(i6, t5 = true) {
    var e6, r5;
    i6 !== this.isConnected && (this.isConnected = i6, i6 ? null === (e6 = this.reconnected) || void 0 === e6 || e6.call(this) : null === (r5 = this.disconnected) || void 0 === r5 || r5.call(this)), t5 && (s2(this, i6), o(this));
  }
  setValue(t5) {
    if (e3(this._$Ct)) this._$Ct._$AI(t5, this);
    else {
      const i6 = [...this._$Ct._$AH];
      i6[this._$Ci] = t5, this._$Ct._$AI(i6, this, 0);
    }
  }
  disconnected() {
  }
  reconnected() {
  }
};

// ../node_modules/@lit-labs/motion/animate-controller.js
var i4 = /* @__PURE__ */ new WeakMap();

// ../node_modules/@lit-labs/motion/animate.js
var h2 = 0;
var r2 = /* @__PURE__ */ new Map();
var n3 = /* @__PURE__ */ new WeakSet();
var a = () => new Promise(((t5) => requestAnimationFrame(t5)));
var f = [{ opacity: 0 }];
var p = [{ opacity: 0 }, { opacity: 1 }];
var g = (t5, i6) => {
  const s4 = t5 - i6;
  return 0 === s4 ? void 0 : s4;
};
var w = (t5, i6) => {
  const s4 = t5 / i6;
  return 1 === s4 ? void 0 : s4;
};
var A2 = { left: (t5, i6) => {
  const s4 = g(t5, i6);
  return { value: s4, transform: s4 && `translateX(${s4}px)` };
}, top: (t5, i6) => {
  const s4 = g(t5, i6);
  return { value: s4, transform: s4 && `translateY(${s4}px)` };
}, width: (t5, i6) => {
  const s4 = w(t5, i6);
  return { value: s4, transform: s4 && `scaleX(${s4})` };
}, height: (t5, i6) => {
  const s4 = w(t5, i6);
  return { value: s4, transform: s4 && `scaleY(${s4})` };
} };
var b = { duration: 333, easing: "ease-in-out" };
var j = ["left", "top", "width", "height", "opacity", "color", "background"];
var x2 = /* @__PURE__ */ new WeakMap();
var S = class extends c {
  constructor(t5) {
    if (super(t5), this.t = null, this.i = null, this.o = true, this.shouldLog = false, t5.type === t2.CHILD) throw Error("The `animate` directive must be used in attribute position.");
    this.createFinished();
  }
  createFinished() {
    var t5;
    null === (t5 = this.resolveFinished) || void 0 === t5 || t5.call(this), this.finished = new Promise(((t6) => {
      this.h = t6;
    }));
  }
  async resolveFinished() {
    var t5;
    null === (t5 = this.h) || void 0 === t5 || t5.call(this), this.h = void 0;
  }
  render(i6) {
    return A;
  }
  getController() {
    return i4.get(this.l);
  }
  isDisabled() {
    var t5;
    return this.options.disabled || (null === (t5 = this.getController()) || void 0 === t5 ? void 0 : t5.disabled);
  }
  update(t5, [i6]) {
    var s4;
    const e6 = void 0 === this.l;
    return e6 && (this.l = null === (s4 = t5.options) || void 0 === s4 ? void 0 : s4.host, this.l.addController(this), this.element = t5.element, x2.set(this.element, this)), this.optionsOrCallback = i6, (e6 || "function" != typeof i6) && this.u(i6), this.render(i6);
  }
  u(t5) {
    var i6, s4;
    t5 = null != t5 ? t5 : {};
    const e6 = this.getController();
    void 0 !== e6 && ((t5 = { ...e6.defaultOptions, ...t5 }).keyframeOptions = { ...e6.defaultOptions.keyframeOptions, ...t5.keyframeOptions }), null !== (i6 = (s4 = t5).properties) && void 0 !== i6 || (s4.properties = j), this.options = t5;
  }
  v() {
    const t5 = {}, i6 = this.element.getBoundingClientRect(), s4 = getComputedStyle(this.element);
    return this.options.properties.forEach(((e6) => {
      var o2;
      const h5 = null !== (o2 = i6[e6]) && void 0 !== o2 ? o2 : A2[e6] ? void 0 : s4[e6], r5 = Number(h5);
      t5[e6] = isNaN(r5) ? h5 + "" : r5;
    })), t5;
  }
  p() {
    let t5, i6 = true;
    return this.options.guard && (t5 = this.options.guard(), i6 = ((t6, i7) => {
      if (Array.isArray(t6)) {
        if (Array.isArray(i7) && i7.length === t6.length && t6.every(((t7, s4) => t7 === i7[s4]))) return false;
      } else if (i7 === t6) return false;
      return true;
    })(t5, this.m)), this.o = this.l.hasUpdated && !this.isDisabled() && !this.isAnimating() && i6 && this.element.isConnected, this.o && (this.m = Array.isArray(t5) ? Array.from(t5) : t5), this.o;
  }
  hostUpdate() {
    var t5;
    "function" == typeof this.optionsOrCallback && this.u(this.optionsOrCallback()), this.p() && (this.g = this.v(), this.t = null !== (t5 = this.t) && void 0 !== t5 ? t5 : this.element.parentNode, this.i = this.element.nextSibling);
  }
  async hostUpdated() {
    if (!this.o || !this.element.isConnected || this.options.skipInitial && !this.isHostRendered) return;
    let t5;
    this.prepare(), await a;
    const i6 = this._(), s4 = this.A(this.options.keyframeOptions, i6), e6 = this.v();
    if (void 0 !== this.g) {
      const { from: s5, to: o2 } = this.O(this.g, e6, i6);
      this.log("measured", [this.g, e6, s5, o2]), t5 = this.calculateKeyframes(s5, o2);
    } else {
      const s5 = r2.get(this.options.inId);
      if (s5) {
        r2.delete(this.options.inId);
        const { from: o2, to: n5 } = this.O(s5, e6, i6);
        t5 = this.calculateKeyframes(o2, n5), t5 = this.options.in ? [{ ...this.options.in[0], ...t5[0] }, ...this.options.in.slice(1), t5[1]] : t5, h2++, t5.forEach(((t6) => t6.zIndex = h2));
      } else this.options.in && (t5 = [...this.options.in, {}]);
    }
    this.animate(t5, s4);
  }
  resetStyles() {
    var t5;
    void 0 !== this.P && (this.element.setAttribute("style", null !== (t5 = this.P) && void 0 !== t5 ? t5 : ""), this.P = void 0);
  }
  commitStyles() {
    var t5, i6;
    this.P = this.element.getAttribute("style"), null === (t5 = this.webAnimation) || void 0 === t5 || t5.commitStyles(), null === (i6 = this.webAnimation) || void 0 === i6 || i6.cancel();
  }
  reconnected() {
  }
  async disconnected() {
    var t5;
    if (!this.o) return;
    if (void 0 !== this.options.id && r2.set(this.options.id, this.g), void 0 === this.options.out) return;
    if (this.prepare(), await a(), null === (t5 = this.t) || void 0 === t5 ? void 0 : t5.isConnected) {
      const t6 = this.i && this.i.parentNode === this.t ? this.i : null;
      if (this.t.insertBefore(this.element, t6), this.options.stabilizeOut) {
        const t7 = this.v();
        this.log("stabilizing out");
        const i7 = this.g.left - t7.left, s4 = this.g.top - t7.top;
        !("static" === getComputedStyle(this.element).position) || 0 === i7 && 0 === s4 || (this.element.style.position = "relative"), 0 !== i7 && (this.element.style.left = i7 + "px"), 0 !== s4 && (this.element.style.top = s4 + "px");
      }
    }
    const i6 = this.A(this.options.keyframeOptions);
    await this.animate(this.options.out, i6), this.element.remove();
  }
  prepare() {
    this.createFinished();
  }
  start() {
    var t5, i6;
    null === (i6 = (t5 = this.options).onStart) || void 0 === i6 || i6.call(t5, this);
  }
  didFinish(t5) {
    var i6, s4;
    t5 && (null === (s4 = (i6 = this.options).onComplete) || void 0 === s4 || s4.call(i6, this)), this.g = void 0, this.animatingProperties = void 0, this.frames = void 0, this.resolveFinished();
  }
  _() {
    const t5 = [];
    for (let i6 = this.element.parentNode; i6; i6 = null == i6 ? void 0 : i6.parentNode) {
      const s4 = x2.get(i6);
      s4 && !s4.isDisabled() && s4 && t5.push(s4);
    }
    return t5;
  }
  get isHostRendered() {
    const t5 = n3.has(this.l);
    return t5 || this.l.updateComplete.then((() => {
      n3.add(this.l);
    })), t5;
  }
  A(t5, i6 = this._()) {
    const s4 = { ...b };
    return i6.forEach(((t6) => Object.assign(s4, t6.options.keyframeOptions))), Object.assign(s4, t5), s4;
  }
  O(t5, i6, s4) {
    t5 = { ...t5 }, i6 = { ...i6 };
    const e6 = s4.map(((t6) => t6.animatingProperties)).filter(((t6) => void 0 !== t6));
    let o2 = 1, h5 = 1;
    return void 0 !== e6 && (e6.forEach(((t6) => {
      t6.width && (o2 /= t6.width), t6.height && (h5 /= t6.height);
    })), void 0 !== t5.left && void 0 !== i6.left && (t5.left = o2 * t5.left, i6.left = o2 * i6.left), void 0 !== t5.top && void 0 !== i6.top && (t5.top = h5 * t5.top, i6.top = h5 * i6.top)), { from: t5, to: i6 };
  }
  calculateKeyframes(t5, i6, s4 = false) {
    var e6;
    const o2 = {}, h5 = {};
    let r5 = false;
    const n5 = {};
    for (const s5 in i6) {
      const a3 = t5[s5], l5 = i6[s5];
      if (s5 in A2) {
        const t6 = A2[s5];
        if (void 0 === a3 || void 0 === l5) continue;
        const i7 = t6(a3, l5);
        void 0 !== i7.transform && (n5[s5] = i7.value, r5 = true, o2.transform = `${null !== (e6 = o2.transform) && void 0 !== e6 ? e6 : ""} ${i7.transform}`);
      } else a3 !== l5 && void 0 !== a3 && void 0 !== l5 && (r5 = true, o2[s5] = a3, h5[s5] = l5);
    }
    return o2.transformOrigin = h5.transformOrigin = s4 ? "center center" : "top left", this.animatingProperties = n5, r5 ? [o2, h5] : void 0;
  }
  async animate(t5, i6 = this.options.keyframeOptions) {
    this.start(), this.frames = t5;
    let s4 = false;
    if (!this.isAnimating() && !this.isDisabled() && (this.options.onFrames && (this.frames = t5 = this.options.onFrames(this), this.log("modified frames", t5)), void 0 !== t5)) {
      this.log("animate", [t5, i6]), s4 = true, this.webAnimation = this.element.animate(t5, i6);
      const e6 = this.getController();
      null == e6 || e6.add(this);
      try {
        await this.webAnimation.finished;
      } catch (t6) {
      }
      null == e6 || e6.remove(this);
    }
    return this.didFinish(s4), s4;
  }
  isAnimating() {
    var t5, i6;
    return "running" === (null === (t5 = this.webAnimation) || void 0 === t5 ? void 0 : t5.playState) || (null === (i6 = this.webAnimation) || void 0 === i6 ? void 0 : i6.pending);
  }
  log(t5, i6) {
    this.shouldLog && !this.isDisabled() && console.log(t5, this.options.id, i6);
  }
};
var $ = e2(S);

// ../node_modules/@lit-labs/motion/position.js
var r3 = ["top", "right", "bottom", "left"];
var e4 = class extends c {
  constructor(t5) {
    if (super(t5), t5.type !== t2.ELEMENT) throw Error("The `position` directive must be used in attribute position.");
  }
  render(i6, o2) {
    return A;
  }
  update(t5, [i6, o2]) {
    var s4;
    return void 0 === this.l && (this.l = null === (s4 = t5.options) || void 0 === s4 ? void 0 : s4.host, this.l.addController(this)), this.j = t5.element, this.S = i6, this.C = null != o2 ? o2 : ["left", "top", "width", "height"], this.render(i6, o2);
  }
  hostUpdated() {
    this.F();
  }
  F() {
    var t5, i6;
    const o2 = "function" == typeof this.S ? this.S() : null === (t5 = this.S) || void 0 === t5 ? void 0 : t5.value, s4 = o2.offsetParent;
    if (void 0 === o2 || !s4) return;
    const e6 = o2.getBoundingClientRect(), h5 = s4.getBoundingClientRect();
    null === (i6 = this.C) || void 0 === i6 || i6.forEach(((t6) => {
      const i7 = r3.includes(t6) ? e6[t6] - h5[t6] : e6[t6];
      this.j.style[t6] = i7 + "px";
    }));
  }
};
var h3 = e2(e4);

// ../node_modules/@preact/signals-core/dist/signals-core.module.js
function i5() {
  throw new Error("Cycle detected");
}
function t4() {
  if (!(h4 > 1)) {
    var i6, t5 = false;
    while (void 0 !== n4) {
      var o2 = n4;
      n4 = void 0;
      s3++;
      while (void 0 !== o2) {
        var r5 = o2.o;
        o2.o = void 0;
        o2.f &= -3;
        if (!(8 & o2.f) && c3(o2)) try {
          o2.c();
        } catch (o3) {
          if (!t5) {
            i6 = o3;
            t5 = true;
          }
        }
        o2 = r5;
      }
    }
    s3 = 0;
    h4--;
    if (t5) throw i6;
  } else h4--;
}
var r4 = void 0;
var n4 = void 0;
var h4 = 0;
var s3 = 0;
var f2 = 0;
function v2(i6) {
  if (void 0 !== r4) {
    var t5 = i6.n;
    if (void 0 === t5 || t5.t !== r4) {
      t5 = { i: 0, S: i6, p: r4.s, n: void 0, t: r4, e: void 0, x: void 0, r: t5 };
      if (void 0 !== r4.s) r4.s.n = t5;
      r4.s = t5;
      i6.n = t5;
      if (32 & r4.f) i6.S(t5);
      return t5;
    } else if (-1 === t5.i) {
      t5.i = 0;
      if (void 0 !== t5.n) {
        t5.n.p = t5.p;
        if (void 0 !== t5.p) t5.p.n = t5.n;
        t5.p = r4.s;
        t5.n = void 0;
        r4.s.n = t5;
        r4.s = t5;
      }
      return t5;
    }
  }
}
function e5(i6) {
  this.v = i6;
  this.i = 0;
  this.n = void 0;
  this.t = void 0;
}
e5.prototype.h = function() {
  return true;
};
e5.prototype.S = function(i6) {
  if (this.t !== i6 && void 0 === i6.e) {
    i6.x = this.t;
    if (void 0 !== this.t) this.t.e = i6;
    this.t = i6;
  }
};
e5.prototype.U = function(i6) {
  if (void 0 !== this.t) {
    var t5 = i6.e, o2 = i6.x;
    if (void 0 !== t5) {
      t5.x = o2;
      i6.e = void 0;
    }
    if (void 0 !== o2) {
      o2.e = t5;
      i6.x = void 0;
    }
    if (i6 === this.t) this.t = o2;
  }
};
e5.prototype.subscribe = function(i6) {
  var t5 = this;
  return b2(function() {
    var o2 = t5.value, r5 = 32 & this.f;
    this.f &= -33;
    try {
      i6(o2);
    } finally {
      this.f |= r5;
    }
  });
};
e5.prototype.valueOf = function() {
  return this.value;
};
e5.prototype.toString = function() {
  return this.value + "";
};
e5.prototype.toJSON = function() {
  return this.value;
};
e5.prototype.peek = function() {
  return this.v;
};
Object.defineProperty(e5.prototype, "value", { get: function() {
  var i6 = v2(this);
  if (void 0 !== i6) i6.i = this.i;
  return this.v;
}, set: function(o2) {
  if (r4 instanceof l4) !(function() {
    throw new Error("Computed cannot have side-effects");
  })();
  if (o2 !== this.v) {
    if (s3 > 100) i5();
    this.v = o2;
    this.i++;
    f2++;
    h4++;
    try {
      for (var n5 = this.t; void 0 !== n5; n5 = n5.x) n5.t.N();
    } finally {
      t4();
    }
  }
} });
function u2(i6) {
  return new e5(i6);
}
function c3(i6) {
  for (var t5 = i6.s; void 0 !== t5; t5 = t5.n) if (t5.S.i !== t5.i || !t5.S.h() || t5.S.i !== t5.i) return true;
  return false;
}
function d2(i6) {
  for (var t5 = i6.s; void 0 !== t5; t5 = t5.n) {
    var o2 = t5.S.n;
    if (void 0 !== o2) t5.r = o2;
    t5.S.n = t5;
    t5.i = -1;
    if (void 0 === t5.n) {
      i6.s = t5;
      break;
    }
  }
}
function a2(i6) {
  var t5 = i6.s, o2 = void 0;
  while (void 0 !== t5) {
    var r5 = t5.p;
    if (-1 === t5.i) {
      t5.S.U(t5);
      if (void 0 !== r5) r5.n = t5.n;
      if (void 0 !== t5.n) t5.n.p = r5;
    } else o2 = t5;
    t5.S.n = t5.r;
    if (void 0 !== t5.r) t5.r = void 0;
    t5 = r5;
  }
  i6.s = o2;
}
function l4(i6) {
  e5.call(this, void 0);
  this.x = i6;
  this.s = void 0;
  this.g = f2 - 1;
  this.f = 4;
}
(l4.prototype = new e5()).h = function() {
  this.f &= -3;
  if (1 & this.f) return false;
  if (32 == (36 & this.f)) return true;
  this.f &= -5;
  if (this.g === f2) return true;
  this.g = f2;
  this.f |= 1;
  if (this.i > 0 && !c3(this)) {
    this.f &= -2;
    return true;
  }
  var i6 = r4;
  try {
    d2(this);
    r4 = this;
    var t5 = this.x();
    if (16 & this.f || this.v !== t5 || 0 === this.i) {
      this.v = t5;
      this.f &= -17;
      this.i++;
    }
  } catch (i7) {
    this.v = i7;
    this.f |= 16;
    this.i++;
  }
  r4 = i6;
  a2(this);
  this.f &= -2;
  return true;
};
l4.prototype.S = function(i6) {
  if (void 0 === this.t) {
    this.f |= 36;
    for (var t5 = this.s; void 0 !== t5; t5 = t5.n) t5.S.S(t5);
  }
  e5.prototype.S.call(this, i6);
};
l4.prototype.U = function(i6) {
  if (void 0 !== this.t) {
    e5.prototype.U.call(this, i6);
    if (void 0 === this.t) {
      this.f &= -33;
      for (var t5 = this.s; void 0 !== t5; t5 = t5.n) t5.S.U(t5);
    }
  }
};
l4.prototype.N = function() {
  if (!(2 & this.f)) {
    this.f |= 6;
    for (var i6 = this.t; void 0 !== i6; i6 = i6.x) i6.t.N();
  }
};
l4.prototype.peek = function() {
  if (!this.h()) i5();
  if (16 & this.f) throw this.v;
  return this.v;
};
Object.defineProperty(l4.prototype, "value", { get: function() {
  if (1 & this.f) i5();
  var t5 = v2(this);
  this.h();
  if (void 0 !== t5) t5.i = this.i;
  if (16 & this.f) throw this.v;
  return this.v;
} });
function y2(i6) {
  var o2 = i6.u;
  i6.u = void 0;
  if ("function" == typeof o2) {
    h4++;
    var n5 = r4;
    r4 = void 0;
    try {
      o2();
    } catch (t5) {
      i6.f &= -2;
      i6.f |= 8;
      _(i6);
      throw t5;
    } finally {
      r4 = n5;
      t4();
    }
  }
}
function _(i6) {
  for (var t5 = i6.s; void 0 !== t5; t5 = t5.n) t5.S.U(t5);
  i6.x = void 0;
  i6.s = void 0;
  y2(i6);
}
function p2(i6) {
  if (r4 !== this) throw new Error("Out-of-order effect");
  a2(this);
  r4 = i6;
  this.f &= -2;
  if (8 & this.f) _(this);
  t4();
}
function g2(i6) {
  this.x = i6;
  this.u = void 0;
  this.s = void 0;
  this.o = void 0;
  this.f = 32;
}
g2.prototype.c = function() {
  var i6 = this.S();
  try {
    if (8 & this.f) return;
    if (void 0 === this.x) return;
    var t5 = this.x();
    if ("function" == typeof t5) this.u = t5;
  } finally {
    i6();
  }
};
g2.prototype.S = function() {
  if (1 & this.f) i5();
  this.f |= 1;
  this.f &= -9;
  y2(this);
  d2(this);
  h4++;
  var t5 = r4;
  r4 = this;
  return p2.bind(this, t5);
};
g2.prototype.N = function() {
  if (!(2 & this.f)) {
    this.f |= 2;
    this.o = n4;
    n4 = this;
  }
};
g2.prototype.d = function() {
  this.f |= 8;
  if (!(1 & this.f)) _(this);
};
function b2(i6) {
  var t5 = new g2(i6);
  try {
    t5.c();
  } catch (i7) {
    t5.d();
    throw i7;
  }
  return t5.d.bind(t5);
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
      this._disposeEffect = b2(() => {
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
var drawerOpenSignal = u2(false);

// src/signals/inert.ts
var inertContentSignal = u2(false);
var inertSidebarSignal = u2(false);

// src/components/nav-drawer.ts
var NavDrawer = class extends SignalElement(s) {
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
    return x`
      <div class="root">
        <slot name="top-app-bar"></slot>
        <div class="body  ${drawerOpenSignal.value ? "open" : ""}">
          <div class="spacer" ?inert=${inertSidebarSignal.value}>
            ${showModal ? x`<div
                  class="scrim"
                  @click=${this.onScrimClick}
                  ${$({
      properties: ["opacity"],
      keyframeOptions: {
        duration: scrimOpacityDuration,
        easing: "linear"
      },
      in: p,
      out: f
    })}></div>` : A}
            <aside
              ?inert=${this.isCollapsible && !drawerOpenSignal.value}
              ${$({
      properties: ["transform"],
      keyframeOptions: {
        duration: drawerSlideAnimationDuration,
        easing: drawerSlideAnimationEasing
      }
    })}>
              <div class="scroll-wrapper">
                <slot
                  ${$({
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
    return x` <div
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
    return x` <div
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
    queryResult.addEventListener("change", (e6) => {
      this.isCollapsible = e6.matches;
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
NavDrawer.styles = i2`
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

// src/svg/material-design-logo.ts
var materialDesign = x` <svg
  viewBox="0 96 960 960"
  fill="currentColor">
  <path
    d="M480 1016q-91 0-171-34.5T169 887q-60-60-94.5-140T40 576q0-91 34.5-171T169 265q60-60 140-94.5T480 136q91 0 171 34.5T791 265q60 60 94.5 140T920 576q0 91-34.5 171T791 887q-60 60-140 94.5T480 1016ZM200 802V351q-38 47-59 104t-21 121q0 65 21 122t59 104Zm54-506h452q-47-38-104-59t-122-21q-65 0-122 21t-104 59Zm226 381 151-301H330l150 301Zm40 99h160V456L520 776Zm-240 0h160L280 456v320Zm200 160q64 0 121.5-21T706 856H254q47 38 104.5 59T480 936Zm280-134q38-47 59-104t21-122q0-64-21-121t-59-104v451Z" />
</svg>`;

// src/components/top-app-bar.ts
var TopAppBar = class extends SignalElement(s) {
  constructor() {
    super(...arguments);
    this.menuOpen = false;
  }
  render() {
    return x`
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
              .selected=${l(!drawerOpenSignal.value)}
              @input=${this.onMenuIconToggle}>
              <md-icon slot="selected">menu</md-icon>
              <md-icon>menu_open</md-icon>
            </md-icon-button>
            <md-icon-button
              href="/material-web/"
              class="home-button"
              title="Home"
              aria-label="Home">
              ${materialDesign}
            </md-icon-button>
          </section>

          <a href="/material-web/" id="home-link">
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
              import="/material-web/js/hydration-entrypoints/menu.js"
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
  onKeydown(e6) {
    if (!e6.defaultPrevented && e6.key === "Escape") {
      e6.preventDefault();
      this.menuOpen = false;
    }
  }
  /**
   * Toggles the sidebar's open state.
   */
  onMenuIconToggle(e6) {
    drawerOpenSignal.value = !e6.target.selected;
  }
};
TopAppBar.styles = i2`
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
  i("theme-changer")
], TopAppBar.prototype, "themeChanger", 2);
TopAppBar = __decorateClass([
  e("top-app-bar")
], TopAppBar);
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/*! Bundled license information:

lit-html/async-directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
//# sourceMappingURL=navigation.js.map
