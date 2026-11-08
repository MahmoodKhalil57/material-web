import {
  l
} from "../chunk-MFSXPBED.js";
import "../chunk-RTSU4DGK.js";
import {
  o as o2
} from "../chunk-KNPMS4HC.js";
import {
  __assign,
  __decorate,
  __extends,
  __values,
  e,
  e2,
  e4 as e3,
  i,
  i2,
  n,
  o3 as o,
  s,
  t
} from "../chunk-KV6CMQ6O.js";
import {
  A,
  D,
  x
} from "../chunk-JVQ4V6KC.js";
import "../chunk-EUXUH3YW.js";

// ../node_modules/lit-html/directives/if-defined.js
var l2 = (l3) => null != l3 ? l3 : A;

// ../node_modules/playground-elements/_codemirror/codemirror-bundle.js
var e4;
function t2(e5, t3, r2, n3, i4, o3) {
  this.name = e5, this.tokenType = t3, this.depth = r2, this.parent = n3, this.startLine = i4, this.startPos = o3;
}
function r() {
  this.stream = null, this.line = this.startPos = 0, this.string = this.startLine = "", this.copyInstance = null;
}
e4 = function() {
  var e5 = navigator.userAgent, t3 = navigator.platform, r2 = /gecko\/\d/i.test(e5), n3 = /MSIE \d/.test(e5), i4 = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(e5), o3 = /Edge\/(\d+)/.exec(e5), a = n3 || i4 || o3, l3 = a && (n3 ? document.documentMode || 6 : +(o3 || i4)[1]), s2 = !o3 && /WebKit\//.test(e5), c = s2 && /Qt\/\d+\.\d+/.test(e5), u = !o3 && /Chrome\/(\d+)/.exec(e5), d = u && +u[1], f = /Opera\//.test(e5), h = /Apple Computer/.test(navigator.vendor), p = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(e5), m = /PhantomJS/.test(e5), g = h && (/Mobile\/\w+/.test(e5) || navigator.maxTouchPoints > 2), v = /Android/.test(e5), y = g || v || /webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(e5), b = g || /Mac/.test(t3), w = /\bCrOS\b/.test(e5), k = /win/i.test(t3), x2 = f && e5.match(/Version\/(\d*\.\d*)/);
  x2 && (x2 = Number(x2[1])), x2 && x2 >= 15 && (f = false, s2 = true);
  var C = b && (c || f && (null == x2 || x2 < 12.11)), S = r2 || a && l3 >= 9;
  function T(e6) {
    return RegExp("(^|\\s)" + e6 + "(?:$|\\s)\\s*");
  }
  var L, A2 = function(e6, t4) {
    var r3 = e6.className, n4 = T(t4).exec(r3);
    if (n4) {
      var i5 = r3.slice(n4.index + n4[0].length);
      e6.className = r3.slice(0, n4.index) + (i5 ? n4[1] + i5 : "");
    }
  };
  function M(e6) {
    for (var t4 = e6.childNodes.length; t4 > 0; --t4) e6.removeChild(e6.firstChild);
    return e6;
  }
  function z(e6, t4) {
    return M(e6).appendChild(t4);
  }
  function O(e6, t4, r3, n4) {
    var i5 = document.createElement(e6);
    if (r3 && (i5.className = r3), n4 && (i5.style.cssText = n4), "string" == typeof t4) i5.appendChild(document.createTextNode(t4));
    else if (t4) for (var o4 = 0; o4 < t4.length; ++o4) i5.appendChild(t4[o4]);
    return i5;
  }
  function _(e6, t4, r3, n4) {
    var i5 = O(e6, t4, r3, n4);
    return i5.setAttribute("role", "presentation"), i5;
  }
  function N(e6, t4) {
    if (3 == t4.nodeType && (t4 = t4.parentNode), e6.contains) return e6.contains(t4);
    do {
      if (11 == t4.nodeType && (t4 = t4.host), t4 == e6) return true;
    } while (t4 = t4.parentNode);
  }
  function P(e6) {
    var t4;
    try {
      t4 = e6.activeElement;
    } catch (r3) {
      t4 = e6.body || null;
    }
    for (; t4 && t4.shadowRoot && t4.shadowRoot.activeElement; ) t4 = t4.shadowRoot.activeElement;
    return t4;
  }
  function E(e6, t4) {
    var r3 = e6.className;
    T(t4).test(r3) || (e6.className += (r3 ? " " : "") + t4);
  }
  function D2(e6, t4) {
    for (var r3 = e6.split(" "), n4 = 0; n4 < r3.length; n4++) r3[n4] && !T(r3[n4]).test(t4) && (t4 += " " + r3[n4]);
    return t4;
  }
  L = document.createRange ? function(e6, t4, r3, n4) {
    var i5 = document.createRange();
    return i5.setEnd(n4 || e6, r3), i5.setStart(e6, t4), i5;
  } : function(e6, t4, r3) {
    var n4 = document.body.createTextRange();
    try {
      n4.moveToElementText(e6.parentNode);
    } catch (e7) {
      return n4;
    }
    return n4.collapse(true), n4.moveEnd("character", r3), n4.moveStart("character", t4), n4;
  };
  var W = function(e6) {
    e6.select();
  };
  function F(e6) {
    return e6.display.wrapper.ownerDocument;
  }
  function I(e6) {
    return F(e6).defaultView;
  }
  function H(e6) {
    var t4 = Array.prototype.slice.call(arguments, 1);
    return function() {
      return e6.apply(null, t4);
    };
  }
  function B(e6, t4, r3) {
    for (var n4 in t4 || (t4 = {}), e6) !e6.hasOwnProperty(n4) || false === r3 && t4.hasOwnProperty(n4) || (t4[n4] = e6[n4]);
    return t4;
  }
  function $(e6, t4, r3, n4, i5) {
    null == t4 && -1 == (t4 = e6.search(/[^\s\u00a0]/)) && (t4 = e6.length);
    for (var o4 = n4 || 0, a2 = i5 || 0; ; ) {
      var l4 = e6.indexOf("	", o4);
      if (l4 < 0 || l4 >= t4) return a2 + (t4 - o4);
      a2 += l4 - o4, a2 += r3 - a2 % r3, o4 = l4 + 1;
    }
  }
  g ? W = function(e6) {
    e6.selectionStart = 0, e6.selectionEnd = e6.value.length;
  } : a && (W = function(e6) {
    try {
      e6.select();
    } catch (e7) {
    }
  });
  var R = function() {
    this.id = null, this.f = null, this.time = 0, this.handler = H(this.onTimeout, this);
  };
  function Z(e6, t4) {
    for (var r3 = 0; r3 < e6.length; ++r3) if (e6[r3] == t4) return r3;
    return -1;
  }
  R.prototype.onTimeout = function(e6) {
    e6.id = 0, e6.time <= +/* @__PURE__ */ new Date() ? e6.f() : setTimeout(e6.handler, e6.time - +/* @__PURE__ */ new Date());
  }, R.prototype.set = function(e6, t4) {
    this.f = t4;
    var r3 = +/* @__PURE__ */ new Date() + e6;
    (!this.id || r3 < this.time) && (clearTimeout(this.id), this.id = setTimeout(this.handler, e6), this.time = r3);
  };
  var j = { toString: function() {
    return "CodeMirror.Pass";
  } }, U = { scroll: false }, V = { origin: "*mouse" }, K = { origin: "+move" };
  function G(e6, t4, r3) {
    for (var n4 = 0, i5 = 0; ; ) {
      var o4 = e6.indexOf("	", n4);
      -1 == o4 && (o4 = e6.length);
      var a2 = o4 - n4;
      if (o4 == e6.length || i5 + a2 >= t4) return n4 + Math.min(a2, t4 - i5);
      if (i5 += o4 - n4, n4 = o4 + 1, (i5 += r3 - i5 % r3) >= t4) return n4;
    }
  }
  var q = [""];
  function X(e6) {
    for (; q.length <= e6; ) q.push(Y(q) + " ");
    return q[e6];
  }
  function Y(e6) {
    return e6[e6.length - 1];
  }
  function Q(e6, t4) {
    for (var r3 = [], n4 = 0; n4 < e6.length; n4++) r3[n4] = t4(e6[n4], n4);
    return r3;
  }
  function J() {
  }
  function ee(e6, t4) {
    var r3;
    return Object.create ? r3 = Object.create(e6) : (J.prototype = e6, r3 = new J()), t4 && B(t4, r3), r3;
  }
  var te = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
  function re(e6) {
    return /\w/.test(e6) || e6 > "\x80" && (e6.toUpperCase() != e6.toLowerCase() || te.test(e6));
  }
  function ne(e6, t4) {
    return t4 ? !!(t4.source.indexOf("\\w") > -1 && re(e6)) || t4.test(e6) : re(e6);
  }
  function ie(e6) {
    for (var t4 in e6) if (e6.hasOwnProperty(t4) && e6[t4]) return false;
    return true;
  }
  var oe = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;
  function ae(e6) {
    return e6.charCodeAt(0) >= 768 && oe.test(e6);
  }
  function le(e6, t4, r3) {
    for (; (r3 < 0 ? t4 > 0 : t4 < e6.length) && ae(e6.charAt(t4)); ) t4 += r3;
    return t4;
  }
  function se(e6, t4, r3) {
    for (var n4 = t4 > r3 ? -1 : 1; ; ) {
      if (t4 == r3) return t4;
      var i5 = (t4 + r3) / 2, o4 = n4 < 0 ? Math.ceil(i5) : Math.floor(i5);
      if (o4 == t4) return e6(o4) ? t4 : r3;
      e6(o4) ? r3 = o4 : t4 = o4 + n4;
    }
  }
  var ce = null;
  function ue(e6, t4, r3) {
    var n4;
    ce = null;
    for (var i5 = 0; i5 < e6.length; ++i5) {
      var o4 = e6[i5];
      if (o4.from < t4 && o4.to > t4) return i5;
      o4.to == t4 && (o4.from != o4.to && "before" == r3 ? n4 = i5 : ce = i5), o4.from == t4 && (o4.from != o4.to && "before" != r3 ? n4 = i5 : ce = i5);
    }
    return null != n4 ? n4 : ce;
  }
  var de = /* @__PURE__ */ (function() {
    var e6 = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/, t4 = /[stwN]/, r3 = /[LRr]/, n4 = /[Lb1n]/, i5 = /[1n]/;
    function o4(e7, t5, r4) {
      this.level = e7, this.from = t5, this.to = r4;
    }
    return function(a2, l4) {
      var s3 = "ltr" == l4 ? "L" : "R";
      if (0 == a2.length || "ltr" == l4 && !e6.test(a2)) return false;
      for (var c2, u2 = a2.length, d2 = [], f2 = 0; f2 < u2; ++f2) d2.push((c2 = a2.charCodeAt(f2)) <= 247 ? "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN".charAt(c2) : 1424 <= c2 && c2 <= 1524 ? "R" : 1536 <= c2 && c2 <= 1785 ? "nnnnnnNNr%%r,rNNmmmmmmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmmmnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmnNmmmmmmrrmmNmmmmrr1111111111".charAt(c2 - 1536) : 1774 <= c2 && c2 <= 2220 ? "r" : 8192 <= c2 && c2 <= 8203 ? "w" : 8204 == c2 ? "b" : "L");
      for (var h2 = 0, p2 = s3; h2 < u2; ++h2) {
        var m2 = d2[h2];
        "m" == m2 ? d2[h2] = p2 : p2 = m2;
      }
      for (var g2 = 0, v2 = s3; g2 < u2; ++g2) {
        var y2 = d2[g2];
        "1" == y2 && "r" == v2 ? d2[g2] = "n" : r3.test(y2) && (v2 = y2, "r" == y2 && (d2[g2] = "R"));
      }
      for (var b2 = 1, w2 = d2[0]; b2 < u2 - 1; ++b2) {
        var k2 = d2[b2];
        "+" == k2 && "1" == w2 && "1" == d2[b2 + 1] ? d2[b2] = "1" : "," != k2 || w2 != d2[b2 + 1] || "1" != w2 && "n" != w2 || (d2[b2] = w2), w2 = k2;
      }
      for (var x3 = 0; x3 < u2; ++x3) {
        var C2 = d2[x3];
        if ("," == C2) d2[x3] = "N";
        else if ("%" == C2) {
          var S2 = void 0;
          for (S2 = x3 + 1; S2 < u2 && "%" == d2[S2]; ++S2) ;
          for (var T2 = x3 && "!" == d2[x3 - 1] || S2 < u2 && "1" == d2[S2] ? "1" : "N", L2 = x3; L2 < S2; ++L2) d2[L2] = T2;
          x3 = S2 - 1;
        }
      }
      for (var A3 = 0, M2 = s3; A3 < u2; ++A3) {
        var z2 = d2[A3];
        "L" == M2 && "1" == z2 ? d2[A3] = "L" : r3.test(z2) && (M2 = z2);
      }
      for (var O2 = 0; O2 < u2; ++O2) if (t4.test(d2[O2])) {
        var _2 = void 0;
        for (_2 = O2 + 1; _2 < u2 && t4.test(d2[_2]); ++_2) ;
        for (var N2 = "L" == (O2 ? d2[O2 - 1] : s3), P2 = N2 == ("L" == (_2 < u2 ? d2[_2] : s3)) ? N2 ? "L" : "R" : s3, E2 = O2; E2 < _2; ++E2) d2[E2] = P2;
        O2 = _2 - 1;
      }
      for (var D3, W2 = [], F2 = 0; F2 < u2; ) if (n4.test(d2[F2])) {
        var I2 = F2;
        for (++F2; F2 < u2 && n4.test(d2[F2]); ++F2) ;
        W2.push(new o4(0, I2, F2));
      } else {
        var H2 = F2, B2 = W2.length, $2 = "rtl" == l4 ? 1 : 0;
        for (++F2; F2 < u2 && "L" != d2[F2]; ++F2) ;
        for (var R2 = H2; R2 < F2; ) if (i5.test(d2[R2])) {
          H2 < R2 && (W2.splice(B2, 0, new o4(1, H2, R2)), B2 += $2);
          var Z2 = R2;
          for (++R2; R2 < F2 && i5.test(d2[R2]); ++R2) ;
          W2.splice(B2, 0, new o4(2, Z2, R2)), B2 += $2, H2 = R2;
        } else ++R2;
        H2 < F2 && W2.splice(B2, 0, new o4(1, H2, F2));
      }
      return "ltr" == l4 && (1 == W2[0].level && (D3 = a2.match(/^\s+/)) && (W2[0].from = D3[0].length, W2.unshift(new o4(0, 0, D3[0].length))), 1 == Y(W2).level && (D3 = a2.match(/\s+$/)) && (Y(W2).to -= D3[0].length, W2.push(new o4(0, u2 - D3[0].length, u2)))), "rtl" == l4 ? W2.reverse() : W2;
    };
  })();
  function fe(e6, t4) {
    var r3 = e6.order;
    return null == r3 && (r3 = e6.order = de(e6.text, t4)), r3;
  }
  var he = [], pe = function(e6, t4, r3) {
    if (e6.addEventListener) e6.addEventListener(t4, r3, false);
    else if (e6.attachEvent) e6.attachEvent("on" + t4, r3);
    else {
      var n4 = e6._handlers || (e6._handlers = {});
      n4[t4] = (n4[t4] || he).concat(r3);
    }
  };
  function me(e6, t4) {
    return e6._handlers && e6._handlers[t4] || he;
  }
  function ge(e6, t4, r3) {
    if (e6.removeEventListener) e6.removeEventListener(t4, r3, false);
    else if (e6.detachEvent) e6.detachEvent("on" + t4, r3);
    else {
      var n4 = e6._handlers, i5 = n4 && n4[t4];
      if (i5) {
        var o4 = Z(i5, r3);
        o4 > -1 && (n4[t4] = i5.slice(0, o4).concat(i5.slice(o4 + 1)));
      }
    }
  }
  function ve(e6, t4) {
    var r3 = me(e6, t4);
    if (r3.length) for (var n4 = Array.prototype.slice.call(arguments, 2), i5 = 0; i5 < r3.length; ++i5) r3[i5].apply(null, n4);
  }
  function ye(e6, t4, r3) {
    return "string" == typeof t4 && (t4 = { type: t4, preventDefault: function() {
      this.defaultPrevented = true;
    } }), ve(e6, r3 || t4.type, e6, t4), Se(t4) || t4.codemirrorIgnore;
  }
  function be(e6) {
    var t4 = e6._handlers && e6._handlers.cursorActivity;
    if (t4) for (var r3 = e6.curOp.cursorActivityHandlers || (e6.curOp.cursorActivityHandlers = []), n4 = 0; n4 < t4.length; ++n4) -1 == Z(r3, t4[n4]) && r3.push(t4[n4]);
  }
  function we(e6, t4) {
    return me(e6, t4).length > 0;
  }
  function ke(e6) {
    e6.prototype.on = function(e7, t4) {
      pe(this, e7, t4);
    }, e6.prototype.off = function(e7, t4) {
      ge(this, e7, t4);
    };
  }
  function xe(e6) {
    e6.preventDefault ? e6.preventDefault() : e6.returnValue = false;
  }
  function Ce(e6) {
    e6.stopPropagation ? e6.stopPropagation() : e6.cancelBubble = true;
  }
  function Se(e6) {
    return null != e6.defaultPrevented ? e6.defaultPrevented : 0 == e6.returnValue;
  }
  function Te(e6) {
    xe(e6), Ce(e6);
  }
  function Le(e6) {
    return e6.target || e6.srcElement;
  }
  function Ae(e6) {
    var t4 = e6.which;
    return null == t4 && (1 & e6.button ? t4 = 1 : 2 & e6.button ? t4 = 3 : 4 & e6.button && (t4 = 2)), b && e6.ctrlKey && 1 == t4 && (t4 = 3), t4;
  }
  var Me, ze, Oe = (function() {
    if (a && l3 < 9) return false;
    var e6 = O("div");
    return "draggable" in e6 || "dragDrop" in e6;
  })();
  function _e(e6) {
    if (null == Me) {
      var t4 = O("span", "\u200B");
      z(e6, O("span", [t4, document.createTextNode("x")])), 0 != e6.firstChild.offsetHeight && (Me = t4.offsetWidth <= 1 && t4.offsetHeight > 2 && !(a && l3 < 8));
    }
    var r3 = Me ? O("span", "\u200B") : O("span", "\xA0", null, "display: inline-block; width: 1px; margin-right: -1px");
    return r3.setAttribute("cm-text", ""), r3;
  }
  function Ne(e6) {
    if (null != ze) return ze;
    var t4 = z(e6, document.createTextNode("A\u062EA")), r3 = L(t4, 0, 1).getBoundingClientRect(), n4 = L(t4, 1, 2).getBoundingClientRect();
    return M(e6), !(!r3 || r3.left == r3.right) && (ze = n4.right - r3.right < 3);
  }
  var Pe, Ee = function(e6) {
    return e6.split(/\r\n?|\n/);
  }, De = window.getSelection ? function(e6) {
    try {
      return e6.selectionStart != e6.selectionEnd;
    } catch (e7) {
      return false;
    }
  } : function(e6) {
    var t4;
    try {
      t4 = e6.ownerDocument.selection.createRange();
    } catch (e7) {
    }
    return !(!t4 || t4.parentElement() != e6) && 0 != t4.compareEndPoints("StartToEnd", t4);
  }, We = "oncopy" in (Pe = O("div")) || (Pe.setAttribute("oncopy", "return;"), "function" == typeof Pe.oncopy), Fe = null, Ie = {}, He = {};
  function Be(e6, t4) {
    arguments.length > 2 && (t4.dependencies = Array.prototype.slice.call(arguments, 2)), Ie[e6] = t4;
  }
  function $e(e6) {
    if ("string" == typeof e6 && He.hasOwnProperty(e6)) e6 = He[e6];
    else if (e6 && "string" == typeof e6.name && He.hasOwnProperty(e6.name)) {
      var t4 = He[e6.name];
      "string" == typeof t4 && (t4 = { name: t4 }), (e6 = ee(t4, e6)).name = t4.name;
    } else {
      if ("string" == typeof e6 && /^[\w\-]+\/[\w\-]+\+xml$/.test(e6)) return $e("application/xml");
      if ("string" == typeof e6 && /^[\w\-]+\/[\w\-]+\+json$/.test(e6)) return $e("application/json");
    }
    return "string" == typeof e6 ? { name: e6 } : e6 || { name: "null" };
  }
  function Re(e6, t4) {
    t4 = $e(t4);
    var r3 = Ie[t4.name];
    if (!r3) return Re(e6, "text/plain");
    var n4 = r3(e6, t4);
    if (Ze.hasOwnProperty(t4.name)) {
      var i5 = Ze[t4.name];
      for (var o4 in i5) i5.hasOwnProperty(o4) && (n4.hasOwnProperty(o4) && (n4["_" + o4] = n4[o4]), n4[o4] = i5[o4]);
    }
    if (n4.name = t4.name, t4.helperType && (n4.helperType = t4.helperType), t4.modeProps) for (var a2 in t4.modeProps) n4[a2] = t4.modeProps[a2];
    return n4;
  }
  var Ze = {};
  function je(e6, t4) {
    B(t4, Ze.hasOwnProperty(e6) ? Ze[e6] : Ze[e6] = {});
  }
  function Ue(e6, t4) {
    if (true === t4) return t4;
    if (e6.copyState) return e6.copyState(t4);
    var r3 = {};
    for (var n4 in t4) {
      var i5 = t4[n4];
      i5 instanceof Array && (i5 = i5.concat([])), r3[n4] = i5;
    }
    return r3;
  }
  function Ve(e6, t4) {
    for (var r3; e6.innerMode && (r3 = e6.innerMode(t4)) && r3.mode != e6; ) t4 = r3.state, e6 = r3.mode;
    return r3 || { mode: e6, state: t4 };
  }
  function Ke(e6, t4, r3) {
    return !e6.startState || e6.startState(t4, r3);
  }
  var Ge = function(e6, t4, r3) {
    this.pos = this.start = 0, this.string = e6, this.tabSize = t4 || 8, this.lastColumnPos = this.lastColumnValue = 0, this.lineStart = 0, this.lineOracle = r3;
  };
  function qe(e6, t4) {
    if ((t4 -= e6.first) < 0 || t4 >= e6.size) throw Error("There is no line " + (t4 + e6.first) + " in the document.");
    for (var r3 = e6; !r3.lines; ) for (var n4 = 0; ; ++n4) {
      var i5 = r3.children[n4], o4 = i5.chunkSize();
      if (t4 < o4) {
        r3 = i5;
        break;
      }
      t4 -= o4;
    }
    return r3.lines[t4];
  }
  function Xe(e6, t4, r3) {
    var n4 = [], i5 = t4.line;
    return e6.iter(t4.line, r3.line + 1, (function(e7) {
      var o4 = e7.text;
      i5 == r3.line && (o4 = o4.slice(0, r3.ch)), i5 == t4.line && (o4 = o4.slice(t4.ch)), n4.push(o4), ++i5;
    })), n4;
  }
  function Ye(e6, t4, r3) {
    var n4 = [];
    return e6.iter(t4, r3, (function(e7) {
      n4.push(e7.text);
    })), n4;
  }
  function Qe(e6, t4) {
    var r3 = t4 - e6.height;
    if (r3) for (var n4 = e6; n4; n4 = n4.parent) n4.height += r3;
  }
  function Je(e6) {
    if (null == e6.parent) return null;
    for (var t4 = e6.parent, r3 = Z(t4.lines, e6), n4 = t4.parent; n4; t4 = n4, n4 = n4.parent) for (var i5 = 0; n4.children[i5] != t4; ++i5) r3 += n4.children[i5].chunkSize();
    return r3 + t4.first;
  }
  function et(e6, t4) {
    var r3 = e6.first;
    e: do {
      for (var n4 = 0; n4 < e6.children.length; ++n4) {
        var i5 = e6.children[n4], o4 = i5.height;
        if (t4 < o4) {
          e6 = i5;
          continue e;
        }
        t4 -= o4, r3 += i5.chunkSize();
      }
      return r3;
    } while (!e6.lines);
    for (var a2 = 0; a2 < e6.lines.length; ++a2) {
      var l4 = e6.lines[a2].height;
      if (t4 < l4) break;
      t4 -= l4;
    }
    return r3 + a2;
  }
  function tt(e6, t4) {
    return t4 >= e6.first && t4 < e6.first + e6.size;
  }
  function rt(e6, t4) {
    return e6.lineNumberFormatter(t4 + e6.firstLineNumber) + "";
  }
  function nt(e6, t4, r3) {
    if (void 0 === r3 && (r3 = null), !(this instanceof nt)) return new nt(e6, t4, r3);
    this.line = e6, this.ch = t4, this.sticky = r3;
  }
  function it(e6, t4) {
    return e6.line - t4.line || e6.ch - t4.ch;
  }
  function ot(e6, t4) {
    return e6.sticky == t4.sticky && 0 == it(e6, t4);
  }
  function at(e6) {
    return nt(e6.line, e6.ch);
  }
  function lt(e6, t4) {
    return it(e6, t4) < 0 ? t4 : e6;
  }
  function st(e6, t4) {
    return it(e6, t4) < 0 ? e6 : t4;
  }
  function ct(e6, t4) {
    return Math.max(e6.first, Math.min(t4, e6.first + e6.size - 1));
  }
  function ut(e6, t4) {
    if (t4.line < e6.first) return nt(e6.first, 0);
    var r3 = e6.first + e6.size - 1;
    return t4.line > r3 ? nt(r3, qe(e6, r3).text.length) : (function(e7, t5) {
      var r4 = e7.ch;
      return null == r4 || r4 > t5 ? nt(e7.line, t5) : r4 < 0 ? nt(e7.line, 0) : e7;
    })(t4, qe(e6, t4.line).text.length);
  }
  function dt(e6, t4) {
    for (var r3 = [], n4 = 0; n4 < t4.length; n4++) r3[n4] = ut(e6, t4[n4]);
    return r3;
  }
  Ge.prototype.eol = function() {
    return this.pos >= this.string.length;
  }, Ge.prototype.sol = function() {
    return this.pos == this.lineStart;
  }, Ge.prototype.peek = function() {
    return this.string.charAt(this.pos) || void 0;
  }, Ge.prototype.next = function() {
    if (this.pos < this.string.length) return this.string.charAt(this.pos++);
  }, Ge.prototype.eat = function(e6) {
    var t4 = this.string.charAt(this.pos);
    if ("string" == typeof e6 ? t4 == e6 : t4 && (e6.test ? e6.test(t4) : e6(t4))) return ++this.pos, t4;
  }, Ge.prototype.eatWhile = function(e6) {
    for (var t4 = this.pos; this.eat(e6); ) ;
    return this.pos > t4;
  }, Ge.prototype.eatSpace = function() {
    for (var e6 = this.pos; /[\s\u00a0]/.test(this.string.charAt(this.pos)); ) ++this.pos;
    return this.pos > e6;
  }, Ge.prototype.skipToEnd = function() {
    this.pos = this.string.length;
  }, Ge.prototype.skipTo = function(e6) {
    var t4 = this.string.indexOf(e6, this.pos);
    if (t4 > -1) return this.pos = t4, true;
  }, Ge.prototype.backUp = function(e6) {
    this.pos -= e6;
  }, Ge.prototype.column = function() {
    return this.lastColumnPos < this.start && (this.lastColumnValue = $(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue), this.lastColumnPos = this.start), this.lastColumnValue - (this.lineStart ? $(this.string, this.lineStart, this.tabSize) : 0);
  }, Ge.prototype.indentation = function() {
    return $(this.string, null, this.tabSize) - (this.lineStart ? $(this.string, this.lineStart, this.tabSize) : 0);
  }, Ge.prototype.match = function(e6, t4, r3) {
    if ("string" != typeof e6) {
      var n4 = this.string.slice(this.pos).match(e6);
      return n4 && n4.index > 0 ? null : (n4 && false !== t4 && (this.pos += n4[0].length), n4);
    }
    var i5 = function(e7) {
      return r3 ? e7.toLowerCase() : e7;
    };
    if (i5(this.string.substr(this.pos, e6.length)) == i5(e6)) return false !== t4 && (this.pos += e6.length), true;
  }, Ge.prototype.current = function() {
    return this.string.slice(this.start, this.pos);
  }, Ge.prototype.hideFirstChars = function(e6, t4) {
    this.lineStart += e6;
    try {
      return t4();
    } finally {
      this.lineStart -= e6;
    }
  }, Ge.prototype.lookAhead = function(e6) {
    var t4 = this.lineOracle;
    return t4 && t4.lookAhead(e6);
  }, Ge.prototype.baseToken = function() {
    var e6 = this.lineOracle;
    return e6 && e6.baseToken(this.pos);
  };
  var ft = function(e6, t4) {
    this.state = e6, this.lookAhead = t4;
  }, ht = function(e6, t4, r3, n4) {
    this.state = t4, this.doc = e6, this.line = r3, this.maxLookAhead = n4 || 0, this.baseTokens = null, this.baseTokenPos = 1;
  };
  function pt(e6, t4, r3, n4) {
    var i5 = [e6.state.modeGen], o4 = {};
    Ct(e6, t4.text, e6.doc.mode, r3, (function(e7, t5) {
      return i5.push(e7, t5);
    }), o4, n4);
    for (var a2 = r3.state, l4 = function(n5) {
      r3.baseTokens = i5;
      var l5 = e6.state.overlays[n5], s4 = 1, c2 = 0;
      r3.state = true, Ct(e6, t4.text, l5.mode, r3, (function(e7, t5) {
        for (var r4 = s4; c2 < e7; ) {
          var n6 = i5[s4];
          n6 > e7 && i5.splice(s4, 1, e7, i5[s4 + 1], n6), s4 += 2, c2 = Math.min(e7, n6);
        }
        if (t5) if (l5.opaque) i5.splice(r4, s4 - r4, e7, "overlay " + t5), s4 = r4 + 2;
        else for (; r4 < s4; r4 += 2) {
          var o5 = i5[r4 + 1];
          i5[r4 + 1] = (o5 ? o5 + " " : "") + "overlay " + t5;
        }
      }), o4), r3.state = a2, r3.baseTokens = null, r3.baseTokenPos = 1;
    }, s3 = 0; s3 < e6.state.overlays.length; ++s3) l4(s3);
    return { styles: i5, classes: o4.bgClass || o4.textClass ? o4 : null };
  }
  function mt(e6, t4, r3) {
    if (!t4.styles || t4.styles[0] != e6.state.modeGen) {
      var n4 = gt(e6, Je(t4)), i5 = t4.text.length > e6.options.maxHighlightLength && Ue(e6.doc.mode, n4.state), o4 = pt(e6, t4, n4);
      i5 && (n4.state = i5), t4.stateAfter = n4.save(!i5), t4.styles = o4.styles, o4.classes ? t4.styleClasses = o4.classes : t4.styleClasses && (t4.styleClasses = null), r3 === e6.doc.highlightFrontier && (e6.doc.modeFrontier = Math.max(e6.doc.modeFrontier, ++e6.doc.highlightFrontier));
    }
    return t4.styles;
  }
  function gt(e6, t4, r3) {
    var n4 = e6.doc, i5 = e6.display;
    if (!n4.mode.startState) return new ht(n4, true, t4);
    var o4 = (function(e7, t5, r4) {
      for (var n5, i6, o5 = e7.doc, a3 = r4 ? -1 : t5 - (e7.doc.mode.innerMode ? 1e3 : 100), l5 = t5; l5 > a3; --l5) {
        if (l5 <= o5.first) return o5.first;
        var s3 = qe(o5, l5 - 1), c2 = s3.stateAfter;
        if (c2 && (!r4 || l5 + (c2 instanceof ft ? c2.lookAhead : 0) <= o5.modeFrontier)) return l5;
        var u2 = $(s3.text, null, e7.options.tabSize);
        (null == i6 || n5 > u2) && (i6 = l5 - 1, n5 = u2);
      }
      return i6;
    })(e6, t4, r3), a2 = o4 > n4.first && qe(n4, o4 - 1).stateAfter, l4 = a2 ? ht.fromSaved(n4, a2, o4) : new ht(n4, Ke(n4.mode), o4);
    return n4.iter(o4, t4, (function(r4) {
      vt(e6, r4.text, l4);
      var n5 = l4.line;
      r4.stateAfter = n5 == t4 - 1 || n5 % 5 == 0 || n5 >= i5.viewFrom && n5 < i5.viewTo ? l4.save() : null, l4.nextLine();
    })), r3 && (n4.modeFrontier = l4.line), l4;
  }
  function vt(e6, t4, r3, n4) {
    var i5 = e6.doc.mode, o4 = new Ge(t4, e6.options.tabSize, r3);
    for (o4.start = o4.pos = n4 || 0, "" == t4 && yt(i5, r3.state); !o4.eol(); ) bt(i5, o4, r3.state), o4.start = o4.pos;
  }
  function yt(e6, t4) {
    if (e6.blankLine) return e6.blankLine(t4);
    if (e6.innerMode) {
      var r3 = Ve(e6, t4);
      return r3.mode.blankLine ? r3.mode.blankLine(r3.state) : void 0;
    }
  }
  function bt(e6, t4, r3, n4) {
    for (var i5 = 0; i5 < 10; i5++) {
      n4 && (n4[0] = Ve(e6, r3).mode);
      var o4 = e6.token(t4, r3);
      if (t4.pos > t4.start) return o4;
    }
    throw Error("Mode " + e6.name + " failed to advance stream.");
  }
  ht.prototype.lookAhead = function(e6) {
    var t4 = this.doc.getLine(this.line + e6);
    return null != t4 && e6 > this.maxLookAhead && (this.maxLookAhead = e6), t4;
  }, ht.prototype.baseToken = function(e6) {
    if (!this.baseTokens) return null;
    for (; this.baseTokens[this.baseTokenPos] <= e6; ) this.baseTokenPos += 2;
    var t4 = this.baseTokens[this.baseTokenPos + 1];
    return { type: t4 && t4.replace(/( |^)overlay .*/, ""), size: this.baseTokens[this.baseTokenPos] - e6 };
  }, ht.prototype.nextLine = function() {
    this.line++, this.maxLookAhead > 0 && this.maxLookAhead--;
  }, ht.fromSaved = function(e6, t4, r3) {
    return t4 instanceof ft ? new ht(e6, Ue(e6.mode, t4.state), r3, t4.lookAhead) : new ht(e6, Ue(e6.mode, t4), r3);
  }, ht.prototype.save = function(e6) {
    var t4 = false !== e6 ? Ue(this.doc.mode, this.state) : this.state;
    return this.maxLookAhead > 0 ? new ft(t4, this.maxLookAhead) : t4;
  };
  var wt = function(e6, t4, r3) {
    this.start = e6.start, this.end = e6.pos, this.string = e6.current(), this.type = t4 || null, this.state = r3;
  };
  function kt(e6, t4, r3, n4) {
    var i5, o4, a2 = e6.doc, l4 = a2.mode, s3 = qe(a2, (t4 = ut(a2, t4)).line), c2 = gt(e6, t4.line, r3), u2 = new Ge(s3.text, e6.options.tabSize, c2);
    for (n4 && (o4 = []); (n4 || u2.pos < t4.ch) && !u2.eol(); ) u2.start = u2.pos, i5 = bt(l4, u2, c2.state), n4 && o4.push(new wt(u2, i5, Ue(a2.mode, c2.state)));
    return n4 ? o4 : new wt(u2, i5, c2.state);
  }
  function xt(e6, t4) {
    if (e6) for (; ; ) {
      var r3 = e6.match(/(?:^|\s+)line-(background-)?(\S+)/);
      if (!r3) break;
      e6 = e6.slice(0, r3.index) + e6.slice(r3.index + r3[0].length);
      var n4 = r3[1] ? "bgClass" : "textClass";
      null == t4[n4] ? t4[n4] = r3[2] : RegExp("(?:^|\\s)" + r3[2] + "(?:$|\\s)").test(t4[n4]) || (t4[n4] += " " + r3[2]);
    }
    return e6;
  }
  function Ct(e6, t4, r3, n4, i5, o4, a2) {
    var l4 = r3.flattenSpans;
    null == l4 && (l4 = e6.options.flattenSpans);
    var s3, c2 = 0, u2 = null, d2 = new Ge(t4, e6.options.tabSize, n4), f2 = e6.options.addModeClass && [null];
    for ("" == t4 && xt(yt(r3, n4.state), o4); !d2.eol(); ) {
      if (d2.pos > e6.options.maxHighlightLength ? (l4 = false, a2 && vt(e6, t4, n4, d2.pos), d2.pos = t4.length, s3 = null) : s3 = xt(bt(r3, d2, n4.state, f2), o4), f2) {
        var h2 = f2[0].name;
        h2 && (s3 = "m-" + (s3 ? h2 + " " + s3 : h2));
      }
      if (!l4 || u2 != s3) {
        for (; c2 < d2.start; ) i5(c2 = Math.min(d2.start, c2 + 5e3), u2);
        u2 = s3;
      }
      d2.start = d2.pos;
    }
    for (; c2 < d2.pos; ) {
      var p2 = Math.min(d2.pos, c2 + 5e3);
      i5(p2, u2), c2 = p2;
    }
  }
  var St = false, Tt = false;
  function Lt(e6, t4, r3) {
    this.marker = e6, this.from = t4, this.to = r3;
  }
  function At(e6, t4) {
    if (e6) for (var r3 = 0; r3 < e6.length; ++r3) {
      var n4 = e6[r3];
      if (n4.marker == t4) return n4;
    }
  }
  function Mt(e6, t4) {
    for (var r3, n4 = 0; n4 < e6.length; ++n4) e6[n4] != t4 && (r3 || (r3 = [])).push(e6[n4]);
    return r3;
  }
  function zt(e6, t4) {
    if (t4.full) return null;
    var r3 = tt(e6, t4.from.line) && qe(e6, t4.from.line).markedSpans, n4 = tt(e6, t4.to.line) && qe(e6, t4.to.line).markedSpans;
    if (!r3 && !n4) return null;
    var i5 = t4.from.ch, o4 = t4.to.ch, a2 = 0 == it(t4.from, t4.to), l4 = (function(e7, t5, r4) {
      var n5;
      if (e7) for (var i6 = 0; i6 < e7.length; ++i6) {
        var o5 = e7[i6], a3 = o5.marker;
        if (null == o5.from || (a3.inclusiveLeft ? o5.from <= t5 : o5.from < t5) || o5.from == t5 && "bookmark" == a3.type && (!r4 || !o5.marker.insertLeft)) {
          var l5 = null == o5.to || (a3.inclusiveRight ? o5.to >= t5 : o5.to > t5);
          (n5 || (n5 = [])).push(new Lt(a3, o5.from, l5 ? null : o5.to));
        }
      }
      return n5;
    })(r3, i5, a2), s3 = (function(e7, t5, r4) {
      var n5;
      if (e7) for (var i6 = 0; i6 < e7.length; ++i6) {
        var o5 = e7[i6], a3 = o5.marker;
        if (null == o5.to || (a3.inclusiveRight ? o5.to >= t5 : o5.to > t5) || o5.from == t5 && "bookmark" == a3.type && (!r4 || o5.marker.insertLeft)) {
          var l5 = null == o5.from || (a3.inclusiveLeft ? o5.from <= t5 : o5.from < t5);
          (n5 || (n5 = [])).push(new Lt(a3, l5 ? null : o5.from - t5, null == o5.to ? null : o5.to - t5));
        }
      }
      return n5;
    })(n4, o4, a2), c2 = 1 == t4.text.length, u2 = Y(t4.text).length + (c2 ? i5 : 0);
    if (l4) for (var d2 = 0; d2 < l4.length; ++d2) {
      var f2 = l4[d2];
      if (null == f2.to) {
        var h2 = At(s3, f2.marker);
        h2 ? c2 && (f2.to = null == h2.to ? null : h2.to + u2) : f2.to = i5;
      }
    }
    if (s3) for (var p2 = 0; p2 < s3.length; ++p2) {
      var m2 = s3[p2];
      null != m2.to && (m2.to += u2), null == m2.from ? At(l4, m2.marker) || (m2.from = u2, c2 && (l4 || (l4 = [])).push(m2)) : (m2.from += u2, c2 && (l4 || (l4 = [])).push(m2));
    }
    l4 && (l4 = Ot(l4)), s3 && s3 != l4 && (s3 = Ot(s3));
    var g2 = [l4];
    if (!c2) {
      var v2, y2 = t4.text.length - 2;
      if (y2 > 0 && l4) for (var b2 = 0; b2 < l4.length; ++b2) null == l4[b2].to && (v2 || (v2 = [])).push(new Lt(l4[b2].marker, null, null));
      for (var w2 = 0; w2 < y2; ++w2) g2.push(v2);
      g2.push(s3);
    }
    return g2;
  }
  function Ot(e6) {
    for (var t4 = 0; t4 < e6.length; ++t4) {
      var r3 = e6[t4];
      null != r3.from && r3.from == r3.to && false !== r3.marker.clearWhenEmpty && e6.splice(t4--, 1);
    }
    return e6.length ? e6 : null;
  }
  function _t(e6) {
    var t4 = e6.markedSpans;
    if (t4) {
      for (var r3 = 0; r3 < t4.length; ++r3) t4[r3].marker.detachLine(e6);
      e6.markedSpans = null;
    }
  }
  function Nt(e6, t4) {
    if (t4) {
      for (var r3 = 0; r3 < t4.length; ++r3) t4[r3].marker.attachLine(e6);
      e6.markedSpans = t4;
    }
  }
  function Pt(e6) {
    return e6.inclusiveLeft ? -1 : 0;
  }
  function Et(e6) {
    return e6.inclusiveRight ? 1 : 0;
  }
  function Dt(e6, t4) {
    var r3 = e6.lines.length - t4.lines.length;
    if (0 != r3) return r3;
    var n4 = e6.find(), i5 = t4.find(), o4 = it(n4.from, i5.from) || Pt(e6) - Pt(t4);
    return o4 ? -o4 : it(n4.to, i5.to) || Et(e6) - Et(t4) || t4.id - e6.id;
  }
  function Wt(e6, t4) {
    var r3, n4 = Tt && e6.markedSpans;
    if (n4) for (var i5 = void 0, o4 = 0; o4 < n4.length; ++o4) (i5 = n4[o4]).marker.collapsed && null == (t4 ? i5.from : i5.to) && (!r3 || Dt(r3, i5.marker) < 0) && (r3 = i5.marker);
    return r3;
  }
  function Ft(e6) {
    return Wt(e6, true);
  }
  function It(e6) {
    return Wt(e6, false);
  }
  function Ht(e6, t4) {
    var r3, n4 = Tt && e6.markedSpans;
    if (n4) for (var i5 = 0; i5 < n4.length; ++i5) {
      var o4 = n4[i5];
      o4.marker.collapsed && (null == o4.from || o4.from < t4) && (null == o4.to || o4.to > t4) && (!r3 || Dt(r3, o4.marker) < 0) && (r3 = o4.marker);
    }
    return r3;
  }
  function Bt(e6, t4, r3, n4, i5) {
    var o4 = qe(e6, t4), a2 = Tt && o4.markedSpans;
    if (a2) for (var l4 = 0; l4 < a2.length; ++l4) {
      var s3 = a2[l4];
      if (s3.marker.collapsed) {
        var c2 = s3.marker.find(0), u2 = it(c2.from, r3) || Pt(s3.marker) - Pt(i5), d2 = it(c2.to, n4) || Et(s3.marker) - Et(i5);
        if (!(u2 >= 0 && d2 <= 0 || u2 <= 0 && d2 >= 0) && (u2 <= 0 && (s3.marker.inclusiveRight && i5.inclusiveLeft ? it(c2.to, r3) >= 0 : it(c2.to, r3) > 0) || u2 >= 0 && (s3.marker.inclusiveRight && i5.inclusiveLeft ? it(c2.from, n4) <= 0 : it(c2.from, n4) < 0))) return true;
      }
    }
  }
  function $t(e6) {
    for (var t4; t4 = Ft(e6); ) e6 = t4.find(-1, true).line;
    return e6;
  }
  function Rt(e6, t4) {
    var r3 = qe(e6, t4), n4 = $t(r3);
    return r3 == n4 ? t4 : Je(n4);
  }
  function Zt(e6, t4) {
    if (t4 > e6.lastLine()) return t4;
    var r3, n4 = qe(e6, t4);
    if (!jt(e6, n4)) return t4;
    for (; r3 = It(n4); ) n4 = r3.find(1, true).line;
    return Je(n4) + 1;
  }
  function jt(e6, t4) {
    var r3 = Tt && t4.markedSpans;
    if (r3) {
      for (var n4 = void 0, i5 = 0; i5 < r3.length; ++i5) if ((n4 = r3[i5]).marker.collapsed) {
        if (null == n4.from) return true;
        if (!n4.marker.widgetNode && 0 == n4.from && n4.marker.inclusiveLeft && Ut(e6, t4, n4)) return true;
      }
    }
  }
  function Ut(e6, t4, r3) {
    if (null == r3.to) {
      var n4 = r3.marker.find(1, true);
      return Ut(e6, n4.line, At(n4.line.markedSpans, r3.marker));
    }
    if (r3.marker.inclusiveRight && r3.to == t4.text.length) return true;
    for (var i5 = void 0, o4 = 0; o4 < t4.markedSpans.length; ++o4) if ((i5 = t4.markedSpans[o4]).marker.collapsed && !i5.marker.widgetNode && i5.from == r3.to && (null == i5.to || i5.to != r3.from) && (i5.marker.inclusiveLeft || r3.marker.inclusiveRight) && Ut(e6, t4, i5)) return true;
  }
  function Vt(e6) {
    for (var t4 = 0, r3 = (e6 = $t(e6)).parent, n4 = 0; n4 < r3.lines.length; ++n4) {
      var i5 = r3.lines[n4];
      if (i5 == e6) break;
      t4 += i5.height;
    }
    for (var o4 = r3.parent; o4; o4 = (r3 = o4).parent) for (var a2 = 0; a2 < o4.children.length; ++a2) {
      var l4 = o4.children[a2];
      if (l4 == r3) break;
      t4 += l4.height;
    }
    return t4;
  }
  function Kt(e6) {
    if (0 == e6.height) return 0;
    for (var t4, r3 = e6.text.length, n4 = e6; t4 = Ft(n4); ) {
      var i5 = t4.find(0, true);
      n4 = i5.from.line, r3 += i5.from.ch - i5.to.ch;
    }
    for (n4 = e6; t4 = It(n4); ) {
      var o4 = t4.find(0, true);
      r3 -= n4.text.length - o4.from.ch, r3 += (n4 = o4.to.line).text.length - o4.to.ch;
    }
    return r3;
  }
  function Gt(e6) {
    var t4 = e6.display, r3 = e6.doc;
    t4.maxLine = qe(r3, r3.first), t4.maxLineLength = Kt(t4.maxLine), t4.maxLineChanged = true, r3.iter((function(e7) {
      var r4 = Kt(e7);
      r4 > t4.maxLineLength && (t4.maxLineLength = r4, t4.maxLine = e7);
    }));
  }
  var qt = function(e6, t4, r3) {
    this.text = e6, Nt(this, t4), this.height = r3 ? r3(this) : 1;
  };
  function Xt(e6) {
    e6.parent = null, _t(e6);
  }
  qt.prototype.lineNo = function() {
    return Je(this);
  }, ke(qt);
  var Yt = {}, Qt = {};
  function Jt(e6, t4) {
    if (!e6 || /^\s*$/.test(e6)) return null;
    var r3 = t4.addModeClass ? Qt : Yt;
    return r3[e6] || (r3[e6] = e6.replace(/\S+/g, "cm-$&"));
  }
  function er(e6, t4) {
    var r3 = _("span", null, null, s2 ? "padding-right: .1px" : null), n4 = { pre: _("pre", [r3], "CodeMirror-line"), content: r3, col: 0, pos: 0, cm: e6, trailingSpace: false, splitSpaces: e6.getOption("lineWrapping") };
    t4.measure = {};
    for (var i5 = 0; i5 <= (t4.rest ? t4.rest.length : 0); i5++) {
      var o4 = i5 ? t4.rest[i5 - 1] : t4.line, a2 = void 0;
      n4.pos = 0, n4.addToken = rr, Ne(e6.display.measure) && (a2 = fe(o4, e6.doc.direction)) && (n4.addToken = nr(n4.addToken, a2)), n4.map = [], or(o4, n4, mt(e6, o4, t4 != e6.display.externalMeasured && Je(o4))), o4.styleClasses && (o4.styleClasses.bgClass && (n4.bgClass = D2(o4.styleClasses.bgClass, n4.bgClass || "")), o4.styleClasses.textClass && (n4.textClass = D2(o4.styleClasses.textClass, n4.textClass || ""))), 0 == n4.map.length && n4.map.push(0, 0, n4.content.appendChild(_e(e6.display.measure))), 0 == i5 ? (t4.measure.map = n4.map, t4.measure.cache = {}) : ((t4.measure.maps || (t4.measure.maps = [])).push(n4.map), (t4.measure.caches || (t4.measure.caches = [])).push({}));
    }
    if (s2) {
      var l4 = n4.content.lastChild;
      (/\bcm-tab\b/.test(l4.className) || l4.querySelector && l4.querySelector(".cm-tab")) && (n4.content.className = "cm-tab-wrap-hack");
    }
    return ve(e6, "renderLine", e6, t4.line, n4.pre), n4.pre.className && (n4.textClass = D2(n4.pre.className, n4.textClass || "")), n4;
  }
  function tr(e6) {
    var t4 = O("span", "\u2022", "cm-invalidchar");
    return t4.title = "\\u" + e6.charCodeAt(0).toString(16), t4.setAttribute("aria-label", t4.title), t4;
  }
  function rr(e6, t4, r3, n4, i5, o4, s3) {
    if (t4) {
      var c2, u2 = e6.splitSpaces ? (function(e7, t5) {
        if (e7.length > 1 && !/  /.test(e7)) return e7;
        for (var r4 = t5, n5 = "", i6 = 0; i6 < e7.length; i6++) {
          var o5 = e7.charAt(i6);
          " " != o5 || !r4 || i6 != e7.length - 1 && 32 != e7.charCodeAt(i6 + 1) || (o5 = "\xA0"), n5 += o5, r4 = " " == o5;
        }
        return n5;
      })(t4, e6.trailingSpace) : t4, d2 = e6.cm.state.specialChars, f2 = false;
      if (d2.test(t4)) {
        c2 = document.createDocumentFragment();
        for (var h2 = 0; ; ) {
          d2.lastIndex = h2;
          var p2 = d2.exec(t4), m2 = p2 ? p2.index - h2 : t4.length - h2;
          if (m2) {
            var g2 = document.createTextNode(u2.slice(h2, h2 + m2));
            a && l3 < 9 ? c2.appendChild(O("span", [g2])) : c2.appendChild(g2), e6.map.push(e6.pos, e6.pos + m2, g2), e6.col += m2, e6.pos += m2;
          }
          if (!p2) break;
          h2 += m2 + 1;
          var v2 = void 0;
          if ("	" == p2[0]) {
            var y2 = e6.cm.options.tabSize, b2 = y2 - e6.col % y2;
            (v2 = c2.appendChild(O("span", X(b2), "cm-tab"))).setAttribute("role", "presentation"), v2.setAttribute("cm-text", "	"), e6.col += b2;
          } else "\r" == p2[0] || "\n" == p2[0] ? ((v2 = c2.appendChild(O("span", "\r" == p2[0] ? "\u240D" : "\u2424", "cm-invalidchar"))).setAttribute("cm-text", p2[0]), e6.col += 1) : ((v2 = e6.cm.options.specialCharPlaceholder(p2[0])).setAttribute("cm-text", p2[0]), a && l3 < 9 ? c2.appendChild(O("span", [v2])) : c2.appendChild(v2), e6.col += 1);
          e6.map.push(e6.pos, e6.pos + 1, v2), e6.pos++;
        }
      } else e6.col += t4.length, c2 = document.createTextNode(u2), e6.map.push(e6.pos, e6.pos + t4.length, c2), a && l3 < 9 && (f2 = true), e6.pos += t4.length;
      if (e6.trailingSpace = 32 == u2.charCodeAt(t4.length - 1), r3 || n4 || i5 || f2 || o4 || s3) {
        var w2 = r3 || "";
        n4 && (w2 += n4), i5 && (w2 += i5);
        var k2 = O("span", [c2], w2, o4);
        if (s3) for (var x3 in s3) s3.hasOwnProperty(x3) && "style" != x3 && "class" != x3 && k2.setAttribute(x3, s3[x3]);
        return e6.content.appendChild(k2);
      }
      e6.content.appendChild(c2);
    }
  }
  function nr(e6, t4) {
    return function(r3, n4, i5, o4, a2, l4, s3) {
      i5 = i5 ? i5 + " cm-force-border" : "cm-force-border";
      for (var c2 = r3.pos, u2 = c2 + n4.length; ; ) {
        for (var d2 = void 0, f2 = 0; f2 < t4.length && !((d2 = t4[f2]).to > c2 && d2.from <= c2); f2++) ;
        if (d2.to >= u2) return e6(r3, n4, i5, o4, a2, l4, s3);
        e6(r3, n4.slice(0, d2.to - c2), i5, o4, null, l4, s3), o4 = null, n4 = n4.slice(d2.to - c2), c2 = d2.to;
      }
    };
  }
  function ir(e6, t4, r3, n4) {
    var i5 = !n4 && r3.widgetNode;
    i5 && e6.map.push(e6.pos, e6.pos + t4, i5), !n4 && e6.cm.display.input.needsContentAttribute && (i5 || (i5 = e6.content.appendChild(document.createElement("span"))), i5.setAttribute("cm-marker", r3.id)), i5 && (e6.cm.display.input.setUneditable(i5), e6.content.appendChild(i5)), e6.pos += t4, e6.trailingSpace = false;
  }
  function or(e6, t4, r3) {
    var n4 = e6.markedSpans, i5 = e6.text, o4 = 0;
    if (n4) for (var a2, l4, s3, c2, u2, d2, f2, h2 = i5.length, p2 = 0, m2 = 1, g2 = "", v2 = 0; ; ) {
      if (v2 == p2) {
        s3 = c2 = u2 = l4 = "", f2 = null, d2 = null, v2 = 1 / 0;
        for (var y2 = [], b2 = void 0, w2 = 0; w2 < n4.length; ++w2) {
          var k2 = n4[w2], x3 = k2.marker;
          if ("bookmark" == x3.type && k2.from == p2 && x3.widgetNode) y2.push(x3);
          else if (k2.from <= p2 && (null == k2.to || k2.to > p2 || x3.collapsed && k2.to == p2 && k2.from == p2)) {
            if (null != k2.to && k2.to != p2 && v2 > k2.to && (v2 = k2.to, c2 = ""), x3.className && (s3 += " " + x3.className), x3.css && (l4 = (l4 ? l4 + ";" : "") + x3.css), x3.startStyle && k2.from == p2 && (u2 += " " + x3.startStyle), x3.endStyle && k2.to == v2 && (b2 || (b2 = [])).push(x3.endStyle, k2.to), x3.title && ((f2 || (f2 = {})).title = x3.title), x3.attributes) for (var C2 in x3.attributes) (f2 || (f2 = {}))[C2] = x3.attributes[C2];
            x3.collapsed && (!d2 || Dt(d2.marker, x3) < 0) && (d2 = k2);
          } else k2.from > p2 && v2 > k2.from && (v2 = k2.from);
        }
        if (b2) for (var S2 = 0; S2 < b2.length; S2 += 2) b2[S2 + 1] == v2 && (c2 += " " + b2[S2]);
        if (!d2 || d2.from == p2) for (var T2 = 0; T2 < y2.length; ++T2) ir(t4, 0, y2[T2]);
        if (d2 && (d2.from || 0) == p2) {
          if (ir(t4, (null == d2.to ? h2 + 1 : d2.to) - p2, d2.marker, null == d2.from), null == d2.to) return;
          d2.to == p2 && (d2 = false);
        }
      }
      if (p2 >= h2) break;
      for (var L2 = Math.min(h2, v2); ; ) {
        if (g2) {
          var A3 = p2 + g2.length;
          if (!d2) {
            var M2 = A3 > L2 ? g2.slice(0, L2 - p2) : g2;
            t4.addToken(t4, M2, a2 ? a2 + s3 : s3, u2, p2 + M2.length == v2 ? c2 : "", l4, f2);
          }
          if (A3 >= L2) {
            g2 = g2.slice(L2 - p2), p2 = L2;
            break;
          }
          p2 = A3, u2 = "";
        }
        g2 = i5.slice(o4, o4 = r3[m2++]), a2 = Jt(r3[m2++], t4.cm.options);
      }
    }
    else for (var z2 = 1; z2 < r3.length; z2 += 2) t4.addToken(t4, i5.slice(o4, o4 = r3[z2]), Jt(r3[z2 + 1], t4.cm.options));
  }
  function ar(e6, t4, r3) {
    this.line = t4, this.rest = (function(e7) {
      for (var t5, r4; t5 = It(e7); ) e7 = t5.find(1, true).line, (r4 || (r4 = [])).push(e7);
      return r4;
    })(t4), this.size = this.rest ? Je(Y(this.rest)) - r3 + 1 : 1, this.node = this.text = null, this.hidden = jt(e6, t4);
  }
  function lr(e6, t4, r3) {
    for (var n4, i5 = [], o4 = t4; o4 < r3; o4 = n4) {
      var a2 = new ar(e6.doc, qe(e6.doc, o4), o4);
      n4 = o4 + a2.size, i5.push(a2);
    }
    return i5;
  }
  var sr = null, cr = null;
  function ur(e6, t4) {
    var r3 = me(e6, t4);
    if (r3.length) {
      var n4, i5 = Array.prototype.slice.call(arguments, 2);
      sr ? n4 = sr.delayedCallbacks : cr ? n4 = cr : (n4 = cr = [], setTimeout(dr, 0));
      for (var o4 = function(e7) {
        n4.push((function() {
          return r3[e7].apply(null, i5);
        }));
      }, a2 = 0; a2 < r3.length; ++a2) o4(a2);
    }
  }
  function dr() {
    var e6 = cr;
    cr = null;
    for (var t4 = 0; t4 < e6.length; ++t4) e6[t4]();
  }
  function fr(e6, t4, r3, n4) {
    for (var i5 = 0; i5 < t4.changes.length; i5++) {
      var o4 = t4.changes[i5];
      "text" == o4 ? mr(e6, t4) : "gutter" == o4 ? vr(e6, t4, r3, n4) : "class" == o4 ? gr(e6, t4) : "widget" == o4 && yr(e6, t4, n4);
    }
    t4.changes = null;
  }
  function hr(e6) {
    return e6.node == e6.text && (e6.node = O("div", null, null, "position: relative"), e6.text.parentNode && e6.text.parentNode.replaceChild(e6.node, e6.text), e6.node.appendChild(e6.text), a && l3 < 8 && (e6.node.style.zIndex = 2)), e6.node;
  }
  function pr(e6, t4) {
    var r3 = e6.display.externalMeasured;
    return r3 && r3.line == t4.line ? (e6.display.externalMeasured = null, t4.measure = r3.measure, r3.built) : er(e6, t4);
  }
  function mr(e6, t4) {
    var r3 = t4.text.className, n4 = pr(e6, t4);
    t4.text == t4.node && (t4.node = n4.pre), t4.text.parentNode.replaceChild(n4.pre, t4.text), t4.text = n4.pre, n4.bgClass != t4.bgClass || n4.textClass != t4.textClass ? (t4.bgClass = n4.bgClass, t4.textClass = n4.textClass, gr(e6, t4)) : r3 && (t4.text.className = r3);
  }
  function gr(e6, t4) {
    !(function(e7, t5) {
      var r4 = t5.bgClass ? t5.bgClass + " " + (t5.line.bgClass || "") : t5.line.bgClass;
      if (r4 && (r4 += " CodeMirror-linebackground"), t5.background) r4 ? t5.background.className = r4 : (t5.background.parentNode.removeChild(t5.background), t5.background = null);
      else if (r4) {
        var n4 = hr(t5);
        t5.background = n4.insertBefore(O("div", null, r4), n4.firstChild), e7.display.input.setUneditable(t5.background);
      }
    })(e6, t4), t4.line.wrapClass ? hr(t4).className = t4.line.wrapClass : t4.node != t4.text && (t4.node.className = "");
    var r3 = t4.textClass ? t4.textClass + " " + (t4.line.textClass || "") : t4.line.textClass;
    t4.text.className = r3 || "";
  }
  function vr(e6, t4, r3, n4) {
    if (t4.gutter && (t4.node.removeChild(t4.gutter), t4.gutter = null), t4.gutterBackground && (t4.node.removeChild(t4.gutterBackground), t4.gutterBackground = null), t4.line.gutterClass) {
      var i5 = hr(t4);
      t4.gutterBackground = O("div", null, "CodeMirror-gutter-background " + t4.line.gutterClass, "left: " + (e6.options.fixedGutter ? n4.fixedPos : -n4.gutterTotalWidth) + "px; width: " + n4.gutterTotalWidth + "px"), e6.display.input.setUneditable(t4.gutterBackground), i5.insertBefore(t4.gutterBackground, t4.text);
    }
    var o4 = t4.line.gutterMarkers;
    if (e6.options.lineNumbers || o4) {
      var a2 = hr(t4), l4 = t4.gutter = O("div", null, "CodeMirror-gutter-wrapper", "left: " + (e6.options.fixedGutter ? n4.fixedPos : -n4.gutterTotalWidth) + "px");
      if (l4.setAttribute("aria-hidden", "true"), e6.display.input.setUneditable(l4), a2.insertBefore(l4, t4.text), t4.line.gutterClass && (l4.className += " " + t4.line.gutterClass), !e6.options.lineNumbers || o4 && o4["CodeMirror-linenumbers"] || (t4.lineNumber = l4.appendChild(O("div", rt(e6.options, r3), "CodeMirror-linenumber CodeMirror-gutter-elt", "left: " + n4.gutterLeft["CodeMirror-linenumbers"] + "px; width: " + e6.display.lineNumInnerWidth + "px"))), o4) for (var s3 = 0; s3 < e6.display.gutterSpecs.length; ++s3) {
        var c2 = e6.display.gutterSpecs[s3].className, u2 = o4.hasOwnProperty(c2) && o4[c2];
        u2 && l4.appendChild(O("div", [u2], "CodeMirror-gutter-elt", "left: " + n4.gutterLeft[c2] + "px; width: " + n4.gutterWidth[c2] + "px"));
      }
    }
  }
  function yr(e6, t4, r3) {
    t4.alignable && (t4.alignable = null);
    for (var n4 = T("CodeMirror-linewidget"), i5 = t4.node.firstChild, o4 = void 0; i5; i5 = o4) o4 = i5.nextSibling, n4.test(i5.className) && t4.node.removeChild(i5);
    wr(e6, t4, r3);
  }
  function br(e6, t4, r3, n4) {
    var i5 = pr(e6, t4);
    return t4.text = t4.node = i5.pre, i5.bgClass && (t4.bgClass = i5.bgClass), i5.textClass && (t4.textClass = i5.textClass), gr(e6, t4), vr(e6, t4, r3, n4), wr(e6, t4, n4), t4.node;
  }
  function wr(e6, t4, r3) {
    if (kr(e6, t4.line, t4, r3, true), t4.rest) for (var n4 = 0; n4 < t4.rest.length; n4++) kr(e6, t4.rest[n4], t4, r3, false);
  }
  function kr(e6, t4, r3, n4, i5) {
    if (t4.widgets) for (var o4 = hr(r3), a2 = 0, l4 = t4.widgets; a2 < l4.length; ++a2) {
      var s3 = l4[a2], c2 = O("div", [s3.node], "CodeMirror-linewidget" + (s3.className ? " " + s3.className : ""));
      s3.handleMouseEvents || c2.setAttribute("cm-ignore-events", "true"), xr(s3, c2, r3, n4), e6.display.input.setUneditable(c2), i5 && s3.above ? o4.insertBefore(c2, r3.gutter || r3.text) : o4.appendChild(c2), ur(s3, "redraw");
    }
  }
  function xr(e6, t4, r3, n4) {
    if (e6.noHScroll) {
      (r3.alignable || (r3.alignable = [])).push(t4);
      var i5 = n4.wrapperWidth;
      t4.style.left = n4.fixedPos + "px", e6.coverGutter || (i5 -= n4.gutterTotalWidth, t4.style.paddingLeft = n4.gutterTotalWidth + "px"), t4.style.width = i5 + "px";
    }
    e6.coverGutter && (t4.style.zIndex = 5, t4.style.position = "relative", e6.noHScroll || (t4.style.marginLeft = -n4.gutterTotalWidth + "px"));
  }
  function Cr(e6) {
    if (null != e6.height) return e6.height;
    var t4 = e6.doc.cm;
    if (!t4) return 0;
    if (!N(document.body, e6.node)) {
      var r3 = "position: relative;";
      e6.coverGutter && (r3 += "margin-left: -" + t4.display.gutters.offsetWidth + "px;"), e6.noHScroll && (r3 += "width: " + t4.display.wrapper.clientWidth + "px;"), z(t4.display.measure, O("div", [e6.node], null, r3));
    }
    return e6.height = e6.node.parentNode.offsetHeight;
  }
  function Sr(e6, t4) {
    for (var r3 = Le(t4); r3 != e6.wrapper; r3 = r3.parentNode) if (!r3 || 1 == r3.nodeType && "true" == r3.getAttribute("cm-ignore-events") || r3.parentNode == e6.sizer && r3 != e6.mover) return true;
  }
  function Tr(e6) {
    return e6.lineSpace.offsetTop;
  }
  function Lr(e6) {
    return e6.mover.offsetHeight - e6.lineSpace.offsetHeight;
  }
  function Ar(e6) {
    if (e6.cachedPaddingH) return e6.cachedPaddingH;
    var t4 = z(e6.measure, O("pre", "x", "CodeMirror-line-like")), r3 = window.getComputedStyle ? window.getComputedStyle(t4) : t4.currentStyle, n4 = { left: parseInt(r3.paddingLeft), right: parseInt(r3.paddingRight) };
    return isNaN(n4.left) || isNaN(n4.right) || (e6.cachedPaddingH = n4), n4;
  }
  function Mr(e6) {
    return 50 - e6.display.nativeBarWidth;
  }
  function zr(e6) {
    return e6.display.scroller.clientWidth - Mr(e6) - e6.display.barWidth;
  }
  function Or(e6) {
    return e6.display.scroller.clientHeight - Mr(e6) - e6.display.barHeight;
  }
  function _r(e6, t4, r3) {
    if (e6.line == t4) return { map: e6.measure.map, cache: e6.measure.cache };
    if (e6.rest) {
      for (var n4 = 0; n4 < e6.rest.length; n4++) if (e6.rest[n4] == t4) return { map: e6.measure.maps[n4], cache: e6.measure.caches[n4] };
      for (var i5 = 0; i5 < e6.rest.length; i5++) if (Je(e6.rest[i5]) > r3) return { map: e6.measure.maps[i5], cache: e6.measure.caches[i5], before: true };
    }
  }
  function Nr(e6, t4, r3, n4) {
    return Dr(e6, Er(e6, t4), r3, n4);
  }
  function Pr(e6, t4) {
    if (t4 >= e6.display.viewFrom && t4 < e6.display.viewTo) return e6.display.view[hn(e6, t4)];
    var r3 = e6.display.externalMeasured;
    return r3 && t4 >= r3.lineN && t4 < r3.lineN + r3.size ? r3 : void 0;
  }
  function Er(e6, t4) {
    var r3 = Je(t4), n4 = Pr(e6, r3);
    n4 && !n4.text ? n4 = null : n4 && n4.changes && (fr(e6, n4, r3, sn(e6)), e6.curOp.forceUpdate = true), n4 || (n4 = (function(e7, t5) {
      var r4 = Je(t5 = $t(t5)), n5 = e7.display.externalMeasured = new ar(e7.doc, t5, r4);
      n5.lineN = r4;
      var i6 = n5.built = er(e7, n5);
      return n5.text = i6.pre, z(e7.display.lineMeasure, i6.pre), n5;
    })(e6, t4));
    var i5 = _r(n4, t4, r3);
    return { line: t4, view: n4, rect: null, map: i5.map, cache: i5.cache, before: i5.before, hasHeights: false };
  }
  function Dr(e6, t4, r3, n4, i5) {
    t4.before && (r3 = -1);
    var o4, s3 = r3 + (n4 || "");
    return t4.cache.hasOwnProperty(s3) ? o4 = t4.cache[s3] : (t4.rect || (t4.rect = t4.view.text.getBoundingClientRect()), t4.hasHeights || ((function(e7, t5, r4) {
      var n5 = e7.options.lineWrapping, i6 = n5 && zr(e7);
      if (!t5.measure.heights || n5 && t5.measure.width != i6) {
        var o5 = t5.measure.heights = [];
        if (n5) {
          t5.measure.width = i6;
          for (var a2 = t5.text.firstChild.getClientRects(), l4 = 0; l4 < a2.length - 1; l4++) {
            var s4 = a2[l4], c2 = a2[l4 + 1];
            Math.abs(s4.bottom - c2.bottom) > 2 && o5.push((s4.bottom + c2.top) / 2 - r4.top);
          }
        }
        o5.push(r4.bottom - r4.top);
      }
    })(e6, t4.view, t4.rect), t4.hasHeights = true), o4 = (function(e7, t5, r4, n5) {
      var i6, o5 = Ir(t5.map, r4, n5), s4 = o5.node, c2 = o5.start, u2 = o5.end, d2 = o5.collapse;
      if (3 == s4.nodeType) {
        for (var f2 = 0; f2 < 4; f2++) {
          for (; c2 && ae(t5.line.text.charAt(o5.coverStart + c2)); ) --c2;
          for (; o5.coverStart + u2 < o5.coverEnd && ae(t5.line.text.charAt(o5.coverStart + u2)); ) ++u2;
          if ((i6 = a && l3 < 9 && 0 == c2 && u2 == o5.coverEnd - o5.coverStart ? s4.parentNode.getBoundingClientRect() : Hr(L(s4, c2, u2).getClientRects(), n5)).left || i6.right || 0 == c2) break;
          u2 = c2, c2 -= 1, d2 = "right";
        }
        a && l3 < 11 && (i6 = (function(e8, t6) {
          if (!window.screen || null == screen.logicalXDPI || screen.logicalXDPI == screen.deviceXDPI || !(function(e9) {
            if (null != Fe) return Fe;
            var t7 = z(e9, O("span", "x")), r6 = t7.getBoundingClientRect(), n7 = L(t7, 0, 1).getBoundingClientRect();
            return Fe = Math.abs(r6.left - n7.left) > 1;
          })(e8)) return t6;
          var r5 = screen.logicalXDPI / screen.deviceXDPI, n6 = screen.logicalYDPI / screen.deviceYDPI;
          return { left: t6.left * r5, right: t6.right * r5, top: t6.top * n6, bottom: t6.bottom * n6 };
        })(e7.display.measure, i6));
      } else {
        var h2;
        c2 > 0 && (d2 = n5 = "right"), i6 = e7.options.lineWrapping && (h2 = s4.getClientRects()).length > 1 ? h2["right" == n5 ? h2.length - 1 : 0] : s4.getBoundingClientRect();
      }
      if (a && l3 < 9 && !c2 && (!i6 || !i6.left && !i6.right)) {
        var p2 = s4.parentNode.getClientRects()[0];
        i6 = p2 ? { left: p2.left, right: p2.left + ln(e7.display), top: p2.top, bottom: p2.bottom } : Fr;
      }
      for (var m2 = i6.top - t5.rect.top, g2 = i6.bottom - t5.rect.top, v2 = (m2 + g2) / 2, y2 = t5.view.measure.heights, b2 = 0; b2 < y2.length - 1 && !(v2 < y2[b2]); b2++) ;
      var w2 = b2 ? y2[b2 - 1] : 0, k2 = y2[b2], x3 = { left: ("right" == d2 ? i6.right : i6.left) - t5.rect.left, right: ("left" == d2 ? i6.left : i6.right) - t5.rect.left, top: w2, bottom: k2 };
      return i6.left || i6.right || (x3.bogus = true), e7.options.singleCursorHeightPerLine || (x3.rtop = m2, x3.rbottom = g2), x3;
    })(e6, t4, r3, n4), o4.bogus || (t4.cache[s3] = o4)), { left: o4.left, right: o4.right, top: i5 ? o4.rtop : o4.top, bottom: i5 ? o4.rbottom : o4.bottom };
  }
  var Wr, Fr = { left: 0, right: 0, top: 0, bottom: 0 };
  function Ir(e6, t4, r3) {
    for (var n4, i5, o4, a2, l4, s3, c2 = 0; c2 < e6.length; c2 += 3) if (l4 = e6[c2], s3 = e6[c2 + 1], t4 < l4 ? (i5 = 0, o4 = 1, a2 = "left") : t4 < s3 ? o4 = 1 + (i5 = t4 - l4) : (c2 == e6.length - 3 || t4 == s3 && e6[c2 + 3] > t4) && (i5 = (o4 = s3 - l4) - 1, t4 >= s3 && (a2 = "right")), null != i5) {
      if (n4 = e6[c2 + 2], l4 == s3 && r3 == (n4.insertLeft ? "left" : "right") && (a2 = r3), "left" == r3 && 0 == i5) for (; c2 && e6[c2 - 2] == e6[c2 - 3] && e6[c2 - 1].insertLeft; ) n4 = e6[2 + (c2 -= 3)], a2 = "left";
      if ("right" == r3 && i5 == s3 - l4) for (; c2 < e6.length - 3 && e6[c2 + 3] == e6[c2 + 4] && !e6[c2 + 5].insertLeft; ) n4 = e6[(c2 += 3) + 2], a2 = "right";
      break;
    }
    return { node: n4, start: i5, end: o4, collapse: a2, coverStart: l4, coverEnd: s3 };
  }
  function Hr(e6, t4) {
    var r3 = Fr;
    if ("left" == t4) for (var n4 = 0; n4 < e6.length && (r3 = e6[n4]).left == r3.right; n4++) ;
    else for (var i5 = e6.length - 1; i5 >= 0 && (r3 = e6[i5]).left == r3.right; i5--) ;
    return r3;
  }
  function Br(e6) {
    if (e6.measure && (e6.measure.cache = {}, e6.measure.heights = null, e6.rest)) for (var t4 = 0; t4 < e6.rest.length; t4++) e6.measure.caches[t4] = {};
  }
  function $r(e6) {
    e6.display.externalMeasure = null, M(e6.display.lineMeasure);
    for (var t4 = 0; t4 < e6.display.view.length; t4++) Br(e6.display.view[t4]);
  }
  function Rr(e6) {
    $r(e6), e6.display.cachedCharWidth = e6.display.cachedTextHeight = e6.display.cachedPaddingH = null, e6.options.lineWrapping || (e6.display.maxLineChanged = true), e6.display.lineNumChars = null;
  }
  function Zr(e6) {
    return u && v ? -(e6.body.getBoundingClientRect().left - parseInt(getComputedStyle(e6.body).marginLeft)) : e6.defaultView.pageXOffset || (e6.documentElement || e6.body).scrollLeft;
  }
  function jr(e6) {
    return u && v ? -(e6.body.getBoundingClientRect().top - parseInt(getComputedStyle(e6.body).marginTop)) : e6.defaultView.pageYOffset || (e6.documentElement || e6.body).scrollTop;
  }
  function Ur(e6) {
    var t4 = $t(e6).widgets, r3 = 0;
    if (t4) for (var n4 = 0; n4 < t4.length; ++n4) t4[n4].above && (r3 += Cr(t4[n4]));
    return r3;
  }
  function Vr(e6, t4, r3, n4, i5) {
    if (!i5) {
      var o4 = Ur(t4);
      r3.top += o4, r3.bottom += o4;
    }
    if ("line" == n4) return r3;
    n4 || (n4 = "local");
    var a2 = Vt(t4);
    if ("local" == n4 ? a2 += Tr(e6.display) : a2 -= e6.display.viewOffset, "page" == n4 || "window" == n4) {
      var l4 = e6.display.lineSpace.getBoundingClientRect();
      a2 += l4.top + ("window" == n4 ? 0 : jr(F(e6)));
      var s3 = l4.left + ("window" == n4 ? 0 : Zr(F(e6)));
      r3.left += s3, r3.right += s3;
    }
    return r3.top += a2, r3.bottom += a2, r3;
  }
  function Kr(e6, t4, r3) {
    if ("div" == r3) return t4;
    var n4 = t4.left, i5 = t4.top;
    if ("page" == r3) n4 -= Zr(F(e6)), i5 -= jr(F(e6));
    else if ("local" == r3 || !r3) {
      var o4 = e6.display.sizer.getBoundingClientRect();
      n4 += o4.left, i5 += o4.top;
    }
    var a2 = e6.display.lineSpace.getBoundingClientRect();
    return { left: n4 - a2.left, top: i5 - a2.top };
  }
  function Gr(e6, t4, r3, n4, i5) {
    return n4 || (n4 = qe(e6.doc, t4.line)), Vr(e6, n4, Nr(e6, n4, t4.ch, i5), r3);
  }
  function qr(e6, t4, r3, n4, i5, o4) {
    function a2(t5, a3) {
      var l5 = Dr(e6, i5, t5, a3 ? "right" : "left", o4);
      return a3 ? l5.left = l5.right : l5.right = l5.left, Vr(e6, n4, l5, r3);
    }
    n4 = n4 || qe(e6.doc, t4.line), i5 || (i5 = Er(e6, n4));
    var l4 = fe(n4, e6.doc.direction), s3 = t4.ch, c2 = t4.sticky;
    if (s3 >= n4.text.length ? (s3 = n4.text.length, c2 = "before") : s3 <= 0 && (s3 = 0, c2 = "after"), !l4) return a2("before" == c2 ? s3 - 1 : s3, "before" == c2);
    function u2(e7, t5, r4) {
      return a2(r4 ? e7 - 1 : e7, 1 == l4[t5].level != r4);
    }
    var d2 = ue(l4, s3, c2), f2 = ce, h2 = u2(s3, d2, "before" == c2);
    return null != f2 && (h2.other = u2(s3, f2, "before" != c2)), h2;
  }
  function Xr(e6, t4) {
    var r3 = 0;
    t4 = ut(e6.doc, t4), e6.options.lineWrapping || (r3 = ln(e6.display) * t4.ch);
    var n4 = qe(e6.doc, t4.line), i5 = Vt(n4) + Tr(e6.display);
    return { left: r3, right: r3, top: i5, bottom: i5 + n4.height };
  }
  function Yr(e6, t4, r3, n4, i5) {
    var o4 = nt(e6, t4, r3);
    return o4.xRel = i5, n4 && (o4.outside = n4), o4;
  }
  function Qr(e6, t4, r3) {
    var n4 = e6.doc;
    if ((r3 += e6.display.viewOffset) < 0) return Yr(n4.first, 0, null, -1, -1);
    var i5 = et(n4, r3), o4 = n4.first + n4.size - 1;
    if (i5 > o4) return Yr(n4.first + n4.size - 1, qe(n4, o4).text.length, null, 1, 1);
    t4 < 0 && (t4 = 0);
    for (var a2 = qe(n4, i5); ; ) {
      var l4 = rn(e6, a2, i5, t4, r3), s3 = Ht(a2, l4.ch + (l4.xRel > 0 || l4.outside > 0 ? 1 : 0));
      if (!s3) return l4;
      var c2 = s3.find(1);
      if (c2.line == i5) return c2;
      a2 = qe(n4, i5 = c2.line);
    }
  }
  function Jr(e6, t4, r3, n4) {
    n4 -= Ur(t4);
    var i5 = t4.text.length, o4 = se((function(t5) {
      return Dr(e6, r3, t5 - 1).bottom <= n4;
    }), i5, 0);
    return { begin: o4, end: i5 = se((function(t5) {
      return Dr(e6, r3, t5).top > n4;
    }), o4, i5) };
  }
  function en(e6, t4, r3, n4) {
    return r3 || (r3 = Er(e6, t4)), Jr(e6, t4, r3, Vr(e6, t4, Dr(e6, r3, n4), "line").top);
  }
  function tn(e6, t4, r3, n4) {
    return !(e6.bottom <= r3) && (e6.top > r3 || (n4 ? e6.left : e6.right) > t4);
  }
  function rn(e6, t4, r3, n4, i5) {
    i5 -= Vt(t4);
    var o4 = Er(e6, t4), a2 = Ur(t4), l4 = 0, s3 = t4.text.length, c2 = true, u2 = fe(t4, e6.doc.direction);
    if (u2) {
      var d2 = (e6.options.lineWrapping ? on : nn)(e6, t4, r3, o4, u2, n4, i5);
      l4 = (c2 = 1 != d2.level) ? d2.from : d2.to - 1, s3 = c2 ? d2.to : d2.from - 1;
    }
    var f2, h2, p2 = null, m2 = null, g2 = se((function(t5) {
      var r4 = Dr(e6, o4, t5);
      return r4.top += a2, r4.bottom += a2, !!tn(r4, n4, i5, false) && (r4.top <= i5 && r4.left <= n4 && (p2 = t5, m2 = r4), true);
    }), l4, s3), v2 = false;
    if (m2) {
      var y2 = n4 - m2.left < m2.right - n4, b2 = y2 == c2;
      g2 = p2 + (b2 ? 0 : 1), h2 = b2 ? "after" : "before", f2 = y2 ? m2.left : m2.right;
    } else {
      c2 || g2 != s3 && g2 != l4 || g2++, h2 = 0 == g2 ? "after" : g2 == t4.text.length ? "before" : Dr(e6, o4, g2 - (c2 ? 1 : 0)).bottom + a2 <= i5 == c2 ? "after" : "before";
      var w2 = qr(e6, nt(r3, g2, h2), "line", t4, o4);
      f2 = w2.left, v2 = i5 < w2.top ? -1 : i5 >= w2.bottom ? 1 : 0;
    }
    return Yr(r3, g2 = le(t4.text, g2, 1), h2, v2, n4 - f2);
  }
  function nn(e6, t4, r3, n4, i5, o4, a2) {
    var l4 = se((function(l5) {
      var s4 = i5[l5], c3 = 1 != s4.level;
      return tn(qr(e6, nt(r3, c3 ? s4.to : s4.from, c3 ? "before" : "after"), "line", t4, n4), o4, a2, true);
    }), 0, i5.length - 1), s3 = i5[l4];
    if (l4 > 0) {
      var c2 = 1 != s3.level, u2 = qr(e6, nt(r3, c2 ? s3.from : s3.to, c2 ? "after" : "before"), "line", t4, n4);
      tn(u2, o4, a2, true) && u2.top > a2 && (s3 = i5[l4 - 1]);
    }
    return s3;
  }
  function on(e6, t4, r3, n4, i5, o4, a2) {
    var l4 = Jr(e6, t4, n4, a2), s3 = l4.begin, c2 = l4.end;
    /\s/.test(t4.text.charAt(c2 - 1)) && c2--;
    for (var u2 = null, d2 = null, f2 = 0; f2 < i5.length; f2++) {
      var h2 = i5[f2];
      if (!(h2.from >= c2 || h2.to <= s3)) {
        var p2 = Dr(e6, n4, 1 != h2.level ? Math.min(c2, h2.to) - 1 : Math.max(s3, h2.from)).right, m2 = p2 < o4 ? o4 - p2 + 1e9 : p2 - o4;
        (!u2 || d2 > m2) && (u2 = h2, d2 = m2);
      }
    }
    return u2 || (u2 = i5[i5.length - 1]), u2.from < s3 && (u2 = { from: s3, to: u2.to, level: u2.level }), u2.to > c2 && (u2 = { from: u2.from, to: c2, level: u2.level }), u2;
  }
  function an(e6) {
    if (null != e6.cachedTextHeight) return e6.cachedTextHeight;
    if (null == Wr) {
      Wr = O("pre", null, "CodeMirror-line-like");
      for (var t4 = 0; t4 < 49; ++t4) Wr.appendChild(document.createTextNode("x")), Wr.appendChild(O("br"));
      Wr.appendChild(document.createTextNode("x"));
    }
    z(e6.measure, Wr);
    var r3 = Wr.offsetHeight / 50;
    return r3 > 3 && (e6.cachedTextHeight = r3), M(e6.measure), r3 || 1;
  }
  function ln(e6) {
    if (null != e6.cachedCharWidth) return e6.cachedCharWidth;
    var t4 = O("span", "xxxxxxxxxx"), r3 = O("pre", [t4], "CodeMirror-line-like");
    z(e6.measure, r3);
    var n4 = t4.getBoundingClientRect(), i5 = (n4.right - n4.left) / 10;
    return i5 > 2 && (e6.cachedCharWidth = i5), i5 || 10;
  }
  function sn(e6) {
    for (var t4 = e6.display, r3 = {}, n4 = {}, i5 = t4.gutters.clientLeft, o4 = t4.gutters.firstChild, a2 = 0; o4; o4 = o4.nextSibling, ++a2) {
      var l4 = e6.display.gutterSpecs[a2].className;
      r3[l4] = o4.offsetLeft + o4.clientLeft + i5, n4[l4] = o4.clientWidth;
    }
    return { fixedPos: cn(t4), gutterTotalWidth: t4.gutters.offsetWidth, gutterLeft: r3, gutterWidth: n4, wrapperWidth: t4.wrapper.clientWidth };
  }
  function cn(e6) {
    return e6.scroller.getBoundingClientRect().left - e6.sizer.getBoundingClientRect().left;
  }
  function un(e6) {
    var t4 = an(e6.display), r3 = e6.options.lineWrapping, n4 = r3 && Math.max(5, e6.display.scroller.clientWidth / ln(e6.display) - 3);
    return function(i5) {
      if (jt(e6.doc, i5)) return 0;
      var o4 = 0;
      if (i5.widgets) for (var a2 = 0; a2 < i5.widgets.length; a2++) i5.widgets[a2].height && (o4 += i5.widgets[a2].height);
      return r3 ? o4 + (Math.ceil(i5.text.length / n4) || 1) * t4 : o4 + t4;
    };
  }
  function dn(e6) {
    var t4 = e6.doc, r3 = un(e6);
    t4.iter((function(e7) {
      var t5 = r3(e7);
      t5 != e7.height && Qe(e7, t5);
    }));
  }
  function fn2(e6, t4, r3, n4) {
    var i5 = e6.display;
    if (!r3 && "true" == Le(t4).getAttribute("cm-not-content")) return null;
    var o4, a2, l4 = i5.lineSpace.getBoundingClientRect();
    try {
      o4 = t4.clientX - l4.left, a2 = t4.clientY - l4.top;
    } catch (e7) {
      return null;
    }
    var s3, c2 = Qr(e6, o4, a2);
    if (n4 && c2.xRel > 0 && (s3 = qe(e6.doc, c2.line).text).length == c2.ch) {
      var u2 = $(s3, s3.length, e6.options.tabSize) - s3.length;
      c2 = nt(c2.line, Math.max(0, Math.round((o4 - Ar(e6.display).left) / ln(e6.display)) - u2));
    }
    return c2;
  }
  function hn(e6, t4) {
    if (t4 >= e6.display.viewTo) return null;
    if ((t4 -= e6.display.viewFrom) < 0) return null;
    for (var r3 = e6.display.view, n4 = 0; n4 < r3.length; n4++) if ((t4 -= r3[n4].size) < 0) return n4;
  }
  function pn(e6, t4, r3, n4) {
    null == t4 && (t4 = e6.doc.first), null == r3 && (r3 = e6.doc.first + e6.doc.size), n4 || (n4 = 0);
    var i5 = e6.display;
    if (n4 && r3 < i5.viewTo && (null == i5.updateLineNumbers || i5.updateLineNumbers > t4) && (i5.updateLineNumbers = t4), e6.curOp.viewChanged = true, t4 >= i5.viewTo) Tt && Rt(e6.doc, t4) < i5.viewTo && gn(e6);
    else if (r3 <= i5.viewFrom) Tt && Zt(e6.doc, r3 + n4) > i5.viewFrom ? gn(e6) : (i5.viewFrom += n4, i5.viewTo += n4);
    else if (t4 <= i5.viewFrom && r3 >= i5.viewTo) gn(e6);
    else if (t4 <= i5.viewFrom) {
      var o4 = vn(e6, r3, r3 + n4, 1);
      o4 ? (i5.view = i5.view.slice(o4.index), i5.viewFrom = o4.lineN, i5.viewTo += n4) : gn(e6);
    } else if (r3 >= i5.viewTo) {
      var a2 = vn(e6, t4, t4, -1);
      a2 ? (i5.view = i5.view.slice(0, a2.index), i5.viewTo = a2.lineN) : gn(e6);
    } else {
      var l4 = vn(e6, t4, t4, -1), s3 = vn(e6, r3, r3 + n4, 1);
      l4 && s3 ? (i5.view = i5.view.slice(0, l4.index).concat(lr(e6, l4.lineN, s3.lineN)).concat(i5.view.slice(s3.index)), i5.viewTo += n4) : gn(e6);
    }
    var c2 = i5.externalMeasured;
    c2 && (r3 < c2.lineN ? c2.lineN += n4 : t4 < c2.lineN + c2.size && (i5.externalMeasured = null));
  }
  function mn(e6, t4, r3) {
    e6.curOp.viewChanged = true;
    var n4 = e6.display, i5 = e6.display.externalMeasured;
    if (i5 && t4 >= i5.lineN && t4 < i5.lineN + i5.size && (n4.externalMeasured = null), !(t4 < n4.viewFrom || t4 >= n4.viewTo)) {
      var o4 = n4.view[hn(e6, t4)];
      if (null != o4.node) {
        var a2 = o4.changes || (o4.changes = []);
        -1 == Z(a2, r3) && a2.push(r3);
      }
    }
  }
  function gn(e6) {
    e6.display.viewFrom = e6.display.viewTo = e6.doc.first, e6.display.view = [], e6.display.viewOffset = 0;
  }
  function vn(e6, t4, r3, n4) {
    var i5, o4 = hn(e6, t4), a2 = e6.display.view;
    if (!Tt || r3 == e6.doc.first + e6.doc.size) return { index: o4, lineN: r3 };
    for (var l4 = e6.display.viewFrom, s3 = 0; s3 < o4; s3++) l4 += a2[s3].size;
    if (l4 != t4) {
      if (n4 > 0) {
        if (o4 == a2.length - 1) return null;
        i5 = l4 + a2[o4].size - t4, o4++;
      } else i5 = l4 - t4;
      t4 += i5, r3 += i5;
    }
    for (; Rt(e6.doc, r3) != r3; ) {
      if (o4 == (n4 < 0 ? 0 : a2.length - 1)) return null;
      r3 += n4 * a2[o4 - (n4 < 0 ? 1 : 0)].size, o4 += n4;
    }
    return { index: o4, lineN: r3 };
  }
  function yn(e6) {
    for (var t4 = e6.display.view, r3 = 0, n4 = 0; n4 < t4.length; n4++) {
      var i5 = t4[n4];
      i5.hidden || i5.node && !i5.changes || ++r3;
    }
    return r3;
  }
  function bn(e6) {
    e6.display.input.showSelection(e6.display.input.prepareSelection());
  }
  function wn(e6, t4) {
    void 0 === t4 && (t4 = true);
    var r3 = e6.doc, n4 = {}, i5 = n4.cursors = document.createDocumentFragment(), o4 = n4.selection = document.createDocumentFragment(), a2 = e6.options.$customCursor;
    a2 && (t4 = true);
    for (var l4 = 0; l4 < r3.sel.ranges.length; l4++) if (t4 || l4 != r3.sel.primIndex) {
      var s3 = r3.sel.ranges[l4];
      if (!(s3.from().line >= e6.display.viewTo || s3.to().line < e6.display.viewFrom)) {
        var c2 = s3.empty();
        if (a2) {
          var u2 = a2(e6, s3);
          u2 && kn(e6, u2, i5);
        } else (c2 || e6.options.showCursorWhenSelecting) && kn(e6, s3.head, i5);
        c2 || Cn(e6, s3, o4);
      }
    }
    return n4;
  }
  function kn(e6, t4, r3) {
    var n4 = qr(e6, t4, "div", null, null, !e6.options.singleCursorHeightPerLine), i5 = r3.appendChild(O("div", "\xA0", "CodeMirror-cursor"));
    if (i5.style.left = n4.left + "px", i5.style.top = n4.top + "px", i5.style.height = Math.max(0, n4.bottom - n4.top) * e6.options.cursorHeight + "px", /\bcm-fat-cursor\b/.test(e6.getWrapperElement().className)) {
      var o4 = Gr(e6, t4, "div", null, null), a2 = o4.right - o4.left;
      i5.style.width = (a2 > 0 ? a2 : e6.defaultCharWidth()) + "px";
    }
    if (n4.other) {
      var l4 = r3.appendChild(O("div", "\xA0", "CodeMirror-cursor CodeMirror-secondarycursor"));
      l4.style.display = "", l4.style.left = n4.other.left + "px", l4.style.top = n4.other.top + "px", l4.style.height = 0.85 * (n4.other.bottom - n4.other.top) + "px";
    }
  }
  function xn(e6, t4) {
    return e6.top - t4.top || e6.left - t4.left;
  }
  function Cn(e6, t4, r3) {
    var n4 = e6.display, i5 = e6.doc, o4 = document.createDocumentFragment(), a2 = Ar(e6.display), l4 = a2.left, s3 = Math.max(n4.sizerWidth, zr(e6) - n4.sizer.offsetLeft) - a2.right, c2 = "ltr" == i5.direction;
    function u2(e7, t5, r4, n5) {
      t5 < 0 && (t5 = 0), t5 = Math.round(t5), n5 = Math.round(n5), o4.appendChild(O("div", null, "CodeMirror-selected", "position: absolute; left: " + e7 + "px;\n                             top: " + t5 + "px; width: " + (null == r4 ? s3 - e7 : r4) + "px;\n                             height: " + (n5 - t5) + "px"));
    }
    function d2(t5, r4, n5) {
      var o5, a3, d3 = qe(i5, t5), f3 = d3.text.length;
      function h3(r5, n6) {
        return Gr(e6, nt(t5, r5), "div", d3, n6);
      }
      function p3(t6, r5, n6) {
        var i6 = en(e6, d3, null, t6), o6 = "ltr" == r5 == ("after" == n6) ? "left" : "right";
        return h3("after" == n6 ? i6.begin : i6.end - (/\s/.test(d3.text.charAt(i6.end - 1)) ? 2 : 1), o6)[o6];
      }
      var m3 = fe(d3, i5.direction);
      return (function(e7, t6, r5, n6) {
        if (!e7) return n6(t6, r5, "ltr", 0);
        for (var i6 = false, o6 = 0; o6 < e7.length; ++o6) {
          var a4 = e7[o6];
          (a4.from < r5 && a4.to > t6 || t6 == r5 && a4.to == t6) && (n6(Math.max(a4.from, t6), Math.min(a4.to, r5), 1 == a4.level ? "rtl" : "ltr", o6), i6 = true);
        }
        i6 || n6(t6, r5, "ltr");
      })(m3, r4 || 0, null == n5 ? f3 : n5, (function(e7, t6, i6, d4) {
        var g3 = "ltr" == i6, v3 = h3(e7, g3 ? "left" : "right"), y3 = h3(t6 - 1, g3 ? "right" : "left"), b2 = null == r4 && 0 == e7, w2 = null == n5 && t6 == f3, k2 = 0 == d4, x3 = !m3 || d4 == m3.length - 1;
        if (y3.top - v3.top <= 3) {
          var C2 = (c2 ? w2 : b2) && x3, S2 = (c2 ? b2 : w2) && k2 ? l4 : (g3 ? v3 : y3).left, T2 = C2 ? s3 : (g3 ? y3 : v3).right;
          u2(S2, v3.top, T2 - S2, v3.bottom);
        } else {
          var L2, A3, M2, z2;
          g3 ? (L2 = c2 && b2 && k2 ? l4 : v3.left, A3 = c2 ? s3 : p3(e7, i6, "before"), M2 = c2 ? l4 : p3(t6, i6, "after"), z2 = c2 && w2 && x3 ? s3 : y3.right) : (L2 = c2 ? p3(e7, i6, "before") : l4, A3 = !c2 && b2 && k2 ? s3 : v3.right, M2 = !c2 && w2 && x3 ? l4 : y3.left, z2 = c2 ? p3(t6, i6, "after") : s3), u2(L2, v3.top, A3 - L2, v3.bottom), v3.bottom < y3.top && u2(l4, v3.bottom, null, y3.top), u2(M2, y3.top, z2 - M2, y3.bottom);
        }
        (!o5 || xn(v3, o5) < 0) && (o5 = v3), xn(y3, o5) < 0 && (o5 = y3), (!a3 || xn(v3, a3) < 0) && (a3 = v3), xn(y3, a3) < 0 && (a3 = y3);
      })), { start: o5, end: a3 };
    }
    var f2 = t4.from(), h2 = t4.to();
    if (f2.line == h2.line) d2(f2.line, f2.ch, h2.ch);
    else {
      var p2 = qe(i5, f2.line), m2 = qe(i5, h2.line), g2 = $t(p2) == $t(m2), v2 = d2(f2.line, f2.ch, g2 ? p2.text.length + 1 : null).end, y2 = d2(h2.line, g2 ? 0 : null, h2.ch).start;
      g2 && (v2.top < y2.top - 2 ? (u2(v2.right, v2.top, null, v2.bottom), u2(l4, y2.top, y2.left, y2.bottom)) : u2(v2.right, v2.top, y2.left - v2.right, v2.bottom)), v2.bottom < y2.top && u2(l4, v2.bottom, null, y2.top);
    }
    r3.appendChild(o4);
  }
  function Sn(e6) {
    if (e6.state.focused) {
      var t4 = e6.display;
      clearInterval(t4.blinker);
      var r3 = true;
      t4.cursorDiv.style.visibility = "", e6.options.cursorBlinkRate > 0 ? t4.blinker = setInterval((function() {
        e6.hasFocus() || Mn(e6), t4.cursorDiv.style.visibility = (r3 = !r3) ? "" : "hidden";
      }), e6.options.cursorBlinkRate) : e6.options.cursorBlinkRate < 0 && (t4.cursorDiv.style.visibility = "hidden");
    }
  }
  function Tn(e6) {
    e6.hasFocus() || (e6.display.input.focus(), e6.state.focused || An(e6));
  }
  function Ln(e6) {
    e6.state.delayingBlurEvent = true, setTimeout((function() {
      e6.state.delayingBlurEvent && (e6.state.delayingBlurEvent = false, e6.state.focused && Mn(e6));
    }), 100);
  }
  function An(e6, t4) {
    e6.state.delayingBlurEvent && !e6.state.draggingText && (e6.state.delayingBlurEvent = false), "nocursor" != e6.options.readOnly && (e6.state.focused || (ve(e6, "focus", e6, t4), e6.state.focused = true, E(e6.display.wrapper, "CodeMirror-focused"), e6.curOp || e6.display.selForContextMenu == e6.doc.sel || (e6.display.input.reset(), s2 && setTimeout((function() {
      return e6.display.input.reset(true);
    }), 20)), e6.display.input.receivedFocus()), Sn(e6));
  }
  function Mn(e6, t4) {
    e6.state.delayingBlurEvent || (e6.state.focused && (ve(e6, "blur", e6, t4), e6.state.focused = false, A2(e6.display.wrapper, "CodeMirror-focused")), clearInterval(e6.display.blinker), setTimeout((function() {
      e6.state.focused || (e6.display.shift = false);
    }), 150));
  }
  function zn(e6) {
    for (var t4 = e6.display, r3 = t4.lineDiv.offsetTop, n4 = Math.max(0, t4.scroller.getBoundingClientRect().top), i5 = t4.lineDiv.getBoundingClientRect().top, o4 = 0, s3 = 0; s3 < t4.view.length; s3++) {
      var c2 = t4.view[s3], u2 = e6.options.lineWrapping, d2 = void 0, f2 = 0;
      if (!c2.hidden) {
        if (i5 += c2.line.height, a && l3 < 8) {
          var h2 = c2.node.offsetTop + c2.node.offsetHeight;
          d2 = h2 - r3, r3 = h2;
        } else {
          var p2 = c2.node.getBoundingClientRect();
          d2 = p2.bottom - p2.top, !u2 && c2.text.firstChild && (f2 = c2.text.firstChild.getBoundingClientRect().right - p2.left - 1);
        }
        var m2 = c2.line.height - d2;
        if ((m2 > 5e-3 || m2 < -5e-3) && (i5 < n4 && (o4 -= m2), Qe(c2.line, d2), On(c2.line), c2.rest)) for (var g2 = 0; g2 < c2.rest.length; g2++) On(c2.rest[g2]);
        if (f2 > e6.display.sizerWidth) {
          var v2 = Math.ceil(f2 / ln(e6.display));
          v2 > e6.display.maxLineLength && (e6.display.maxLineLength = v2, e6.display.maxLine = c2.line, e6.display.maxLineChanged = true);
        }
      }
    }
    Math.abs(o4) > 2 && (t4.scroller.scrollTop += o4);
  }
  function On(e6) {
    if (e6.widgets) for (var t4 = 0; t4 < e6.widgets.length; ++t4) {
      var r3 = e6.widgets[t4], n4 = r3.node.parentNode;
      n4 && (r3.height = n4.offsetHeight);
    }
  }
  function _n(e6, t4, r3) {
    var n4 = r3 && null != r3.top ? Math.max(0, r3.top) : e6.scroller.scrollTop;
    n4 = Math.floor(n4 - Tr(e6));
    var i5 = r3 && null != r3.bottom ? r3.bottom : n4 + e6.wrapper.clientHeight, o4 = et(t4, n4), a2 = et(t4, i5);
    if (r3 && r3.ensure) {
      var l4 = r3.ensure.from.line, s3 = r3.ensure.to.line;
      l4 < o4 ? (o4 = l4, a2 = et(t4, Vt(qe(t4, l4)) + e6.wrapper.clientHeight)) : Math.min(s3, t4.lastLine()) >= a2 && (o4 = et(t4, Vt(qe(t4, s3)) - e6.wrapper.clientHeight), a2 = s3);
    }
    return { from: o4, to: Math.max(a2, o4 + 1) };
  }
  function Nn(e6, t4) {
    var r3 = e6.display, n4 = an(e6.display);
    t4.top < 0 && (t4.top = 0);
    var i5 = e6.curOp && null != e6.curOp.scrollTop ? e6.curOp.scrollTop : r3.scroller.scrollTop, o4 = Or(e6), a2 = {};
    t4.bottom - t4.top > o4 && (t4.bottom = t4.top + o4);
    var l4 = e6.doc.height + Lr(r3), s3 = t4.top < n4, c2 = t4.bottom > l4 - n4;
    if (t4.top < i5) a2.scrollTop = s3 ? 0 : t4.top;
    else if (t4.bottom > i5 + o4) {
      var u2 = Math.min(t4.top, (c2 ? l4 : t4.bottom) - o4);
      u2 != i5 && (a2.scrollTop = u2);
    }
    var d2 = e6.options.fixedGutter ? 0 : r3.gutters.offsetWidth, f2 = e6.curOp && null != e6.curOp.scrollLeft ? e6.curOp.scrollLeft : r3.scroller.scrollLeft - d2, h2 = zr(e6) - r3.gutters.offsetWidth, p2 = t4.right - t4.left > h2;
    return p2 && (t4.right = t4.left + h2), t4.left < 10 ? a2.scrollLeft = 0 : t4.left < f2 ? a2.scrollLeft = Math.max(0, t4.left + d2 - (p2 ? 0 : 10)) : t4.right > h2 + f2 - 3 && (a2.scrollLeft = t4.right + (p2 ? 0 : 10) - h2), a2;
  }
  function Pn(e6, t4) {
    null != t4 && (Wn(e6), e6.curOp.scrollTop = (null == e6.curOp.scrollTop ? e6.doc.scrollTop : e6.curOp.scrollTop) + t4);
  }
  function En(e6) {
    Wn(e6);
    var t4 = e6.getCursor();
    e6.curOp.scrollToPos = { from: t4, to: t4, margin: e6.options.cursorScrollMargin };
  }
  function Dn(e6, t4, r3) {
    null == t4 && null == r3 || Wn(e6), null != t4 && (e6.curOp.scrollLeft = t4), null != r3 && (e6.curOp.scrollTop = r3);
  }
  function Wn(e6) {
    var t4 = e6.curOp.scrollToPos;
    t4 && (e6.curOp.scrollToPos = null, Fn(e6, Xr(e6, t4.from), Xr(e6, t4.to), t4.margin));
  }
  function Fn(e6, t4, r3, n4) {
    var i5 = Nn(e6, { left: Math.min(t4.left, r3.left), top: Math.min(t4.top, r3.top) - n4, right: Math.max(t4.right, r3.right), bottom: Math.max(t4.bottom, r3.bottom) + n4 });
    Dn(e6, i5.scrollLeft, i5.scrollTop);
  }
  function In(e6, t4) {
    Math.abs(e6.doc.scrollTop - t4) < 2 || (r2 || fi(e6, { top: t4 }), Hn(e6, t4, true), r2 && fi(e6), ai(e6, 100));
  }
  function Hn(e6, t4, r3) {
    t4 = Math.max(0, Math.min(e6.display.scroller.scrollHeight - e6.display.scroller.clientHeight, t4)), (e6.display.scroller.scrollTop != t4 || r3) && (e6.doc.scrollTop = t4, e6.display.scrollbars.setScrollTop(t4), e6.display.scroller.scrollTop != t4 && (e6.display.scroller.scrollTop = t4));
  }
  function Bn(e6, t4, r3, n4) {
    t4 = Math.max(0, Math.min(t4, e6.display.scroller.scrollWidth - e6.display.scroller.clientWidth)), (r3 ? t4 == e6.doc.scrollLeft : Math.abs(e6.doc.scrollLeft - t4) < 2) && !n4 || (e6.doc.scrollLeft = t4, mi(e6), e6.display.scroller.scrollLeft != t4 && (e6.display.scroller.scrollLeft = t4), e6.display.scrollbars.setScrollLeft(t4));
  }
  function $n(e6) {
    var t4 = e6.display, r3 = t4.gutters.offsetWidth, n4 = Math.round(e6.doc.height + Lr(e6.display));
    return { clientHeight: t4.scroller.clientHeight, viewHeight: t4.wrapper.clientHeight, scrollWidth: t4.scroller.scrollWidth, clientWidth: t4.scroller.clientWidth, viewWidth: t4.wrapper.clientWidth, barLeft: e6.options.fixedGutter ? r3 : 0, docHeight: n4, scrollHeight: n4 + Mr(e6) + t4.barHeight, nativeBarWidth: t4.nativeBarWidth, gutterWidth: r3 };
  }
  var Rn = function(e6, t4, r3) {
    this.cm = r3;
    var n4 = this.vert = O("div", [O("div", null, null, "min-width: 1px")], "CodeMirror-vscrollbar"), i5 = this.horiz = O("div", [O("div", null, null, "height: 100%; min-height: 1px")], "CodeMirror-hscrollbar");
    n4.tabIndex = i5.tabIndex = -1, e6(n4), e6(i5), pe(n4, "scroll", (function() {
      n4.clientHeight && t4(n4.scrollTop, "vertical");
    })), pe(i5, "scroll", (function() {
      i5.clientWidth && t4(i5.scrollLeft, "horizontal");
    })), this.checkedZeroWidth = false, a && l3 < 8 && (this.horiz.style.minHeight = this.vert.style.minWidth = "18px");
  };
  Rn.prototype.update = function(e6) {
    var t4 = e6.scrollWidth > e6.clientWidth + 1, r3 = e6.scrollHeight > e6.clientHeight + 1, n4 = e6.nativeBarWidth;
    if (r3) {
      this.vert.style.display = "block", this.vert.style.bottom = t4 ? n4 + "px" : "0";
      var i5 = e6.viewHeight - (t4 ? n4 : 0);
      this.vert.firstChild.style.height = Math.max(0, e6.scrollHeight - e6.clientHeight + i5) + "px";
    } else this.vert.scrollTop = 0, this.vert.style.display = "", this.vert.firstChild.style.height = "0";
    if (t4) {
      this.horiz.style.display = "block", this.horiz.style.right = r3 ? n4 + "px" : "0", this.horiz.style.left = e6.barLeft + "px";
      var o4 = e6.viewWidth - e6.barLeft - (r3 ? n4 : 0);
      this.horiz.firstChild.style.width = Math.max(0, e6.scrollWidth - e6.clientWidth + o4) + "px";
    } else this.horiz.style.display = "", this.horiz.firstChild.style.width = "0";
    return !this.checkedZeroWidth && e6.clientHeight > 0 && (0 == n4 && this.zeroWidthHack(), this.checkedZeroWidth = true), { right: r3 ? n4 : 0, bottom: t4 ? n4 : 0 };
  }, Rn.prototype.setScrollLeft = function(e6) {
    this.horiz.scrollLeft != e6 && (this.horiz.scrollLeft = e6), this.disableHoriz && this.enableZeroWidthBar(this.horiz, this.disableHoriz, "horiz");
  }, Rn.prototype.setScrollTop = function(e6) {
    this.vert.scrollTop != e6 && (this.vert.scrollTop = e6), this.disableVert && this.enableZeroWidthBar(this.vert, this.disableVert, "vert");
  }, Rn.prototype.zeroWidthHack = function() {
    var e6 = b && !p ? "12px" : "18px";
    this.horiz.style.height = this.vert.style.width = e6, this.horiz.style.visibility = this.vert.style.visibility = "hidden", this.disableHoriz = new R(), this.disableVert = new R();
  }, Rn.prototype.enableZeroWidthBar = function(e6, t4, r3) {
    e6.style.visibility = "", t4.set(1e3, (function n4() {
      var i5 = e6.getBoundingClientRect();
      ("vert" == r3 ? document.elementFromPoint(i5.right - 1, (i5.top + i5.bottom) / 2) : document.elementFromPoint((i5.right + i5.left) / 2, i5.bottom - 1)) != e6 ? e6.style.visibility = "hidden" : t4.set(1e3, n4);
    }));
  }, Rn.prototype.clear = function() {
    var e6 = this.horiz.parentNode;
    e6.removeChild(this.horiz), e6.removeChild(this.vert);
  };
  var Zn = function() {
  };
  function jn(e6, t4) {
    t4 || (t4 = $n(e6));
    var r3 = e6.display.barWidth, n4 = e6.display.barHeight;
    Un(e6, t4);
    for (var i5 = 0; i5 < 4 && r3 != e6.display.barWidth || n4 != e6.display.barHeight; i5++) r3 != e6.display.barWidth && e6.options.lineWrapping && zn(e6), Un(e6, $n(e6)), r3 = e6.display.barWidth, n4 = e6.display.barHeight;
  }
  function Un(e6, t4) {
    var r3 = e6.display, n4 = r3.scrollbars.update(t4);
    r3.sizer.style.paddingRight = (r3.barWidth = n4.right) + "px", r3.sizer.style.paddingBottom = (r3.barHeight = n4.bottom) + "px", r3.heightForcer.style.borderBottom = n4.bottom + "px solid transparent", n4.right && n4.bottom ? (r3.scrollbarFiller.style.display = "block", r3.scrollbarFiller.style.height = n4.bottom + "px", r3.scrollbarFiller.style.width = n4.right + "px") : r3.scrollbarFiller.style.display = "", n4.bottom && e6.options.coverGutterNextToScrollbar && e6.options.fixedGutter ? (r3.gutterFiller.style.display = "block", r3.gutterFiller.style.height = n4.bottom + "px", r3.gutterFiller.style.width = t4.gutterWidth + "px") : r3.gutterFiller.style.display = "";
  }
  Zn.prototype.update = function() {
    return { bottom: 0, right: 0 };
  }, Zn.prototype.setScrollLeft = function() {
  }, Zn.prototype.setScrollTop = function() {
  }, Zn.prototype.clear = function() {
  };
  var Vn = { native: Rn, null: Zn };
  function Kn(e6) {
    e6.display.scrollbars && (e6.display.scrollbars.clear(), e6.display.scrollbars.addClass && A2(e6.display.wrapper, e6.display.scrollbars.addClass)), e6.display.scrollbars = new Vn[e6.options.scrollbarStyle]((function(t4) {
      e6.display.wrapper.insertBefore(t4, e6.display.scrollbarFiller), pe(t4, "mousedown", (function() {
        e6.state.focused && setTimeout((function() {
          return e6.display.input.focus();
        }), 0);
      })), t4.setAttribute("cm-not-content", "true");
    }), (function(t4, r3) {
      "horizontal" == r3 ? Bn(e6, t4) : In(e6, t4);
    }), e6), e6.display.scrollbars.addClass && E(e6.display.wrapper, e6.display.scrollbars.addClass);
  }
  var Gn = 0;
  function qn(e6) {
    var t4;
    e6.curOp = { cm: e6, viewChanged: false, startHeight: e6.doc.height, forceUpdate: false, updateInput: 0, typing: false, changeObjs: null, cursorActivityHandlers: null, cursorActivityCalled: 0, selectionChanged: false, updateMaxLine: false, scrollLeft: null, scrollTop: null, scrollToPos: null, focus: false, id: ++Gn, markArrays: null }, t4 = e6.curOp, sr ? sr.ops.push(t4) : t4.ownsGroup = sr = { ops: [t4], delayedCallbacks: [] };
  }
  function Xn(e6) {
    var t4 = e6.curOp;
    t4 && (function(e7, t5) {
      var r3 = e7.ownsGroup;
      if (r3) try {
        !(function(e8) {
          var t6 = e8.delayedCallbacks, r4 = 0;
          do {
            for (; r4 < t6.length; r4++) t6[r4].call(null);
            for (var n4 = 0; n4 < e8.ops.length; n4++) {
              var i5 = e8.ops[n4];
              if (i5.cursorActivityHandlers) for (; i5.cursorActivityCalled < i5.cursorActivityHandlers.length; ) i5.cursorActivityHandlers[i5.cursorActivityCalled++].call(null, i5.cm);
            }
          } while (r4 < t6.length);
        })(r3);
      } finally {
        sr = null, (function(e8) {
          for (var t6 = 0; t6 < e8.ops.length; t6++) e8.ops[t6].cm.curOp = null;
          !(function(e9) {
            for (var t7 = e9.ops, r4 = 0; r4 < t7.length; r4++) Yn(t7[r4]);
            for (var n4 = 0; n4 < t7.length; n4++) Qn(t7[n4]);
            for (var i5 = 0; i5 < t7.length; i5++) Jn(t7[i5]);
            for (var o4 = 0; o4 < t7.length; o4++) ei(t7[o4]);
            for (var a2 = 0; a2 < t7.length; a2++) ti(t7[a2]);
          })(e8);
        })(r3);
      }
    })(t4);
  }
  function Yn(e6) {
    var t4 = e6.cm, r3 = t4.display;
    !(function(e7) {
      var t5 = e7.display;
      !t5.scrollbarsClipped && t5.scroller.offsetWidth && (t5.nativeBarWidth = t5.scroller.offsetWidth - t5.scroller.clientWidth, t5.heightForcer.style.height = Mr(e7) + "px", t5.sizer.style.marginBottom = -t5.nativeBarWidth + "px", t5.sizer.style.borderRightWidth = Mr(e7) + "px", t5.scrollbarsClipped = true);
    })(t4), e6.updateMaxLine && Gt(t4), e6.mustUpdate = e6.viewChanged || e6.forceUpdate || null != e6.scrollTop || e6.scrollToPos && (e6.scrollToPos.from.line < r3.viewFrom || e6.scrollToPos.to.line >= r3.viewTo) || r3.maxLineChanged && t4.options.lineWrapping, e6.update = e6.mustUpdate && new si(t4, e6.mustUpdate && { top: e6.scrollTop, ensure: e6.scrollToPos }, e6.forceUpdate);
  }
  function Qn(e6) {
    e6.updatedDisplay = e6.mustUpdate && ui(e6.cm, e6.update);
  }
  function Jn(e6) {
    var t4 = e6.cm, r3 = t4.display;
    e6.updatedDisplay && zn(t4), e6.barMeasure = $n(t4), r3.maxLineChanged && !t4.options.lineWrapping && (e6.adjustWidthTo = Nr(t4, r3.maxLine, r3.maxLine.text.length).left + 3, t4.display.sizerWidth = e6.adjustWidthTo, e6.barMeasure.scrollWidth = Math.max(r3.scroller.clientWidth, r3.sizer.offsetLeft + e6.adjustWidthTo + Mr(t4) + t4.display.barWidth), e6.maxScrollLeft = Math.max(0, r3.sizer.offsetLeft + e6.adjustWidthTo - zr(t4))), (e6.updatedDisplay || e6.selectionChanged) && (e6.preparedSelection = r3.input.prepareSelection());
  }
  function ei(e6) {
    var t4 = e6.cm;
    null != e6.adjustWidthTo && (t4.display.sizer.style.minWidth = e6.adjustWidthTo + "px", e6.maxScrollLeft < t4.doc.scrollLeft && Bn(t4, Math.min(t4.display.scroller.scrollLeft, e6.maxScrollLeft), true), t4.display.maxLineChanged = false);
    var r3 = e6.focus && e6.focus == P(F(t4));
    e6.preparedSelection && t4.display.input.showSelection(e6.preparedSelection, r3), (e6.updatedDisplay || e6.startHeight != t4.doc.height) && jn(t4, e6.barMeasure), e6.updatedDisplay && pi(t4, e6.barMeasure), e6.selectionChanged && Sn(t4), t4.state.focused && e6.updateInput && t4.display.input.reset(e6.typing), r3 && Tn(e6.cm);
  }
  function ti(e6) {
    var t4 = e6.cm, r3 = t4.display, n4 = t4.doc;
    if (e6.updatedDisplay && di(t4, e6.update), null == r3.wheelStartX || null == e6.scrollTop && null == e6.scrollLeft && !e6.scrollToPos || (r3.wheelStartX = r3.wheelStartY = null), null != e6.scrollTop && Hn(t4, e6.scrollTop, e6.forceScroll), null != e6.scrollLeft && Bn(t4, e6.scrollLeft, true, true), e6.scrollToPos) {
      var i5 = (function(e7, t5, r4, n5) {
        var i6;
        null == n5 && (n5 = 0), e7.options.lineWrapping || t5 != r4 || (r4 = "before" == t5.sticky ? nt(t5.line, t5.ch + 1, "before") : t5, t5 = t5.ch ? nt(t5.line, "before" == t5.sticky ? t5.ch - 1 : t5.ch, "after") : t5);
        for (var o5 = 0; o5 < 5; o5++) {
          var a3 = false, l5 = qr(e7, t5), s4 = r4 && r4 != t5 ? qr(e7, r4) : l5, c2 = Nn(e7, i6 = { left: Math.min(l5.left, s4.left), top: Math.min(l5.top, s4.top) - n5, right: Math.max(l5.left, s4.left), bottom: Math.max(l5.bottom, s4.bottom) + n5 }), u2 = e7.doc.scrollTop, d2 = e7.doc.scrollLeft;
          if (null != c2.scrollTop && (In(e7, c2.scrollTop), Math.abs(e7.doc.scrollTop - u2) > 1 && (a3 = true)), null != c2.scrollLeft && (Bn(e7, c2.scrollLeft), Math.abs(e7.doc.scrollLeft - d2) > 1 && (a3 = true)), !a3) break;
        }
        return i6;
      })(t4, ut(n4, e6.scrollToPos.from), ut(n4, e6.scrollToPos.to), e6.scrollToPos.margin);
      !(function(e7, t5) {
        if (!ye(e7, "scrollCursorIntoView")) {
          var r4 = e7.display, n5 = r4.sizer.getBoundingClientRect(), i6 = null, o5 = r4.wrapper.ownerDocument;
          if (t5.top + n5.top < 0 ? i6 = true : t5.bottom + n5.top > (o5.defaultView.innerHeight || o5.documentElement.clientHeight) && (i6 = false), null != i6 && !m) {
            var a3 = O("div", "\u200B", null, "position: absolute;\n                         top: " + (t5.top - r4.viewOffset - Tr(e7.display)) + "px;\n                         height: " + (t5.bottom - t5.top + Mr(e7) + r4.barHeight) + "px;\n                         left: " + t5.left + "px; width: " + Math.max(2, t5.right - t5.left) + "px;");
            e7.display.lineSpace.appendChild(a3), a3.scrollIntoView(i6), e7.display.lineSpace.removeChild(a3);
          }
        }
      })(t4, i5);
    }
    var o4 = e6.maybeHiddenMarkers, a2 = e6.maybeUnhiddenMarkers;
    if (o4) for (var l4 = 0; l4 < o4.length; ++l4) o4[l4].lines.length || ve(o4[l4], "hide");
    if (a2) for (var s3 = 0; s3 < a2.length; ++s3) a2[s3].lines.length && ve(a2[s3], "unhide");
    r3.wrapper.offsetHeight && (n4.scrollTop = t4.display.scroller.scrollTop), e6.changeObjs && ve(t4, "changes", t4, e6.changeObjs), e6.update && e6.update.finish();
  }
  function ri(e6, t4) {
    if (e6.curOp) return t4();
    qn(e6);
    try {
      return t4();
    } finally {
      Xn(e6);
    }
  }
  function ni(e6, t4) {
    return function() {
      if (e6.curOp) return t4.apply(e6, arguments);
      qn(e6);
      try {
        return t4.apply(e6, arguments);
      } finally {
        Xn(e6);
      }
    };
  }
  function ii(e6) {
    return function() {
      if (this.curOp) return e6.apply(this, arguments);
      qn(this);
      try {
        return e6.apply(this, arguments);
      } finally {
        Xn(this);
      }
    };
  }
  function oi(e6) {
    return function() {
      var t4 = this.cm;
      if (!t4 || t4.curOp) return e6.apply(this, arguments);
      qn(t4);
      try {
        return e6.apply(this, arguments);
      } finally {
        Xn(t4);
      }
    };
  }
  function ai(e6, t4) {
    e6.doc.highlightFrontier < e6.display.viewTo && e6.state.highlight.set(t4, H(li, e6));
  }
  function li(e6) {
    var t4 = e6.doc;
    if (!(t4.highlightFrontier >= e6.display.viewTo)) {
      var r3 = +/* @__PURE__ */ new Date() + e6.options.workTime, n4 = gt(e6, t4.highlightFrontier), i5 = [];
      t4.iter(n4.line, Math.min(t4.first + t4.size, e6.display.viewTo + 500), (function(o4) {
        if (n4.line >= e6.display.viewFrom) {
          var a2 = o4.styles, l4 = o4.text.length > e6.options.maxHighlightLength ? Ue(t4.mode, n4.state) : null, s3 = pt(e6, o4, n4, true);
          l4 && (n4.state = l4), o4.styles = s3.styles;
          var c2 = o4.styleClasses, u2 = s3.classes;
          u2 ? o4.styleClasses = u2 : c2 && (o4.styleClasses = null);
          for (var d2 = !a2 || a2.length != o4.styles.length || c2 != u2 && (!c2 || !u2 || c2.bgClass != u2.bgClass || c2.textClass != u2.textClass), f2 = 0; !d2 && f2 < a2.length; ++f2) d2 = a2[f2] != o4.styles[f2];
          d2 && i5.push(n4.line), o4.stateAfter = n4.save(), n4.nextLine();
        } else o4.text.length <= e6.options.maxHighlightLength && vt(e6, o4.text, n4), o4.stateAfter = n4.line % 5 == 0 ? n4.save() : null, n4.nextLine();
        if (+/* @__PURE__ */ new Date() > r3) return ai(e6, e6.options.workDelay), true;
      })), t4.highlightFrontier = n4.line, t4.modeFrontier = Math.max(t4.modeFrontier, n4.line), i5.length && ri(e6, (function() {
        for (var t5 = 0; t5 < i5.length; t5++) mn(e6, i5[t5], "text");
      }));
    }
  }
  var si = function(e6, t4, r3) {
    var n4 = e6.display;
    this.viewport = t4, this.visible = _n(n4, e6.doc, t4), this.editorIsHidden = !n4.wrapper.offsetWidth, this.wrapperHeight = n4.wrapper.clientHeight, this.wrapperWidth = n4.wrapper.clientWidth, this.oldDisplayWidth = zr(e6), this.force = r3, this.dims = sn(e6), this.events = [];
  };
  function ci(e6) {
    if (e6.hasFocus()) return null;
    var t4 = P(F(e6));
    if (!t4 || !N(e6.display.lineDiv, t4)) return null;
    var r3 = { activeElt: t4 };
    if (window.getSelection) {
      var n4 = I(e6).getSelection();
      n4.anchorNode && n4.extend && N(e6.display.lineDiv, n4.anchorNode) && (r3.anchorNode = n4.anchorNode, r3.anchorOffset = n4.anchorOffset, r3.focusNode = n4.focusNode, r3.focusOffset = n4.focusOffset);
    }
    return r3;
  }
  function ui(e6, t4) {
    var r3 = e6.display, n4 = e6.doc;
    if (t4.editorIsHidden) return gn(e6), false;
    if (!t4.force && t4.visible.from >= r3.viewFrom && t4.visible.to <= r3.viewTo && (null == r3.updateLineNumbers || r3.updateLineNumbers >= r3.viewTo) && r3.renderedView == r3.view && 0 == yn(e6)) return false;
    gi(e6) && (gn(e6), t4.dims = sn(e6));
    var i5 = n4.first + n4.size, o4 = Math.max(t4.visible.from - e6.options.viewportMargin, n4.first), a2 = Math.min(i5, t4.visible.to + e6.options.viewportMargin);
    r3.viewFrom < o4 && o4 - r3.viewFrom < 20 && (o4 = Math.max(n4.first, r3.viewFrom)), r3.viewTo > a2 && r3.viewTo - a2 < 20 && (a2 = Math.min(i5, r3.viewTo)), Tt && (o4 = Rt(e6.doc, o4), a2 = Zt(e6.doc, a2));
    var l4 = o4 != r3.viewFrom || a2 != r3.viewTo || r3.lastWrapHeight != t4.wrapperHeight || r3.lastWrapWidth != t4.wrapperWidth;
    !(function(e7, t5, r4) {
      var n5 = e7.display;
      0 == n5.view.length || t5 >= n5.viewTo || r4 <= n5.viewFrom ? (n5.view = lr(e7, t5, r4), n5.viewFrom = t5) : (n5.viewFrom > t5 ? n5.view = lr(e7, t5, n5.viewFrom).concat(n5.view) : n5.viewFrom < t5 && (n5.view = n5.view.slice(hn(e7, t5))), n5.viewFrom = t5, n5.viewTo < r4 ? n5.view = n5.view.concat(lr(e7, n5.viewTo, r4)) : n5.viewTo > r4 && (n5.view = n5.view.slice(0, hn(e7, r4)))), n5.viewTo = r4;
    })(e6, o4, a2), r3.viewOffset = Vt(qe(e6.doc, r3.viewFrom)), e6.display.mover.style.top = r3.viewOffset + "px";
    var c2 = yn(e6);
    if (!l4 && 0 == c2 && !t4.force && r3.renderedView == r3.view && (null == r3.updateLineNumbers || r3.updateLineNumbers >= r3.viewTo)) return false;
    var u2 = ci(e6);
    return c2 > 4 && (r3.lineDiv.style.display = "none"), (function(e7, t5, r4) {
      var n5 = e7.display, i6 = e7.options.lineNumbers, o5 = n5.lineDiv, a3 = o5.firstChild;
      function l5(t6) {
        var r5 = t6.nextSibling;
        return s2 && b && e7.display.currentWheelTarget == t6 ? t6.style.display = "none" : t6.parentNode.removeChild(t6), r5;
      }
      for (var c3 = n5.view, u3 = n5.viewFrom, d2 = 0; d2 < c3.length; d2++) {
        var f2 = c3[d2];
        if (f2.hidden) ;
        else if (f2.node && f2.node.parentNode == o5) {
          for (; a3 != f2.node; ) a3 = l5(a3);
          var h2 = i6 && null != t5 && t5 <= u3 && f2.lineNumber;
          f2.changes && (Z(f2.changes, "gutter") > -1 && (h2 = false), fr(e7, f2, u3, r4)), h2 && (M(f2.lineNumber), f2.lineNumber.appendChild(document.createTextNode(rt(e7.options, u3)))), a3 = f2.node.nextSibling;
        } else {
          var p2 = br(e7, f2, u3, r4);
          o5.insertBefore(p2, a3);
        }
        u3 += f2.size;
      }
      for (; a3; ) a3 = l5(a3);
    })(e6, r3.updateLineNumbers, t4.dims), c2 > 4 && (r3.lineDiv.style.display = ""), r3.renderedView = r3.view, (function(e7) {
      if (e7 && e7.activeElt && e7.activeElt != P(e7.activeElt.ownerDocument) && (e7.activeElt.focus(), !/^(INPUT|TEXTAREA)$/.test(e7.activeElt.nodeName) && e7.anchorNode && N(document.body, e7.anchorNode) && N(document.body, e7.focusNode))) {
        var t5 = e7.activeElt.ownerDocument, r4 = t5.defaultView.getSelection(), n5 = t5.createRange();
        n5.setEnd(e7.anchorNode, e7.anchorOffset), n5.collapse(false), r4.removeAllRanges(), r4.addRange(n5), r4.extend(e7.focusNode, e7.focusOffset);
      }
    })(u2), M(r3.cursorDiv), M(r3.selectionDiv), r3.gutters.style.height = r3.sizer.style.minHeight = 0, l4 && (r3.lastWrapHeight = t4.wrapperHeight, r3.lastWrapWidth = t4.wrapperWidth, ai(e6, 400)), r3.updateLineNumbers = null, true;
  }
  function di(e6, t4) {
    for (var r3 = t4.viewport, n4 = true; ; n4 = false) {
      if (n4 && e6.options.lineWrapping && t4.oldDisplayWidth != zr(e6)) n4 && (t4.visible = _n(e6.display, e6.doc, r3));
      else if (r3 && null != r3.top && (r3 = { top: Math.min(e6.doc.height + Lr(e6.display) - Or(e6), r3.top) }), t4.visible = _n(e6.display, e6.doc, r3), t4.visible.from >= e6.display.viewFrom && t4.visible.to <= e6.display.viewTo) break;
      if (!ui(e6, t4)) break;
      zn(e6);
      var i5 = $n(e6);
      bn(e6), jn(e6, i5), pi(e6, i5), t4.force = false;
    }
    t4.signal(e6, "update", e6), e6.display.viewFrom == e6.display.reportedViewFrom && e6.display.viewTo == e6.display.reportedViewTo || (t4.signal(e6, "viewportChange", e6, e6.display.viewFrom, e6.display.viewTo), e6.display.reportedViewFrom = e6.display.viewFrom, e6.display.reportedViewTo = e6.display.viewTo);
  }
  function fi(e6, t4) {
    var r3 = new si(e6, t4);
    if (ui(e6, r3)) {
      zn(e6), di(e6, r3);
      var n4 = $n(e6);
      bn(e6), jn(e6, n4), pi(e6, n4), r3.finish();
    }
  }
  function hi(e6) {
    var t4 = e6.gutters.offsetWidth;
    e6.sizer.style.marginLeft = t4 + "px", ur(e6, "gutterChanged", e6);
  }
  function pi(e6, t4) {
    e6.display.sizer.style.minHeight = t4.docHeight + "px", e6.display.heightForcer.style.top = t4.docHeight + "px", e6.display.gutters.style.height = t4.docHeight + e6.display.barHeight + Mr(e6) + "px";
  }
  function mi(e6) {
    var t4 = e6.display, r3 = t4.view;
    if (t4.alignWidgets || t4.gutters.firstChild && e6.options.fixedGutter) {
      for (var n4 = cn(t4) - t4.scroller.scrollLeft + e6.doc.scrollLeft, i5 = t4.gutters.offsetWidth, o4 = n4 + "px", a2 = 0; a2 < r3.length; a2++) if (!r3[a2].hidden) {
        e6.options.fixedGutter && (r3[a2].gutter && (r3[a2].gutter.style.left = o4), r3[a2].gutterBackground && (r3[a2].gutterBackground.style.left = o4));
        var l4 = r3[a2].alignable;
        if (l4) for (var s3 = 0; s3 < l4.length; s3++) l4[s3].style.left = o4;
      }
      e6.options.fixedGutter && (t4.gutters.style.left = n4 + i5 + "px");
    }
  }
  function gi(e6) {
    if (!e6.options.lineNumbers) return false;
    var t4 = e6.doc, r3 = rt(e6.options, t4.first + t4.size - 1), n4 = e6.display;
    if (r3.length != n4.lineNumChars) {
      var i5 = n4.measure.appendChild(O("div", [O("div", r3)], "CodeMirror-linenumber CodeMirror-gutter-elt")), o4 = i5.firstChild.offsetWidth, a2 = i5.offsetWidth - o4;
      return n4.lineGutter.style.width = "", n4.lineNumInnerWidth = Math.max(o4, n4.lineGutter.offsetWidth - a2) + 1, n4.lineNumWidth = n4.lineNumInnerWidth + a2, n4.lineNumChars = n4.lineNumInnerWidth ? r3.length : -1, n4.lineGutter.style.width = n4.lineNumWidth + "px", hi(e6.display), true;
    }
    return false;
  }
  function vi(e6, t4) {
    for (var r3 = [], n4 = false, i5 = 0; i5 < e6.length; i5++) {
      var o4 = e6[i5], a2 = null;
      if ("string" != typeof o4 && (a2 = o4.style, o4 = o4.className), "CodeMirror-linenumbers" == o4) {
        if (!t4) continue;
        n4 = true;
      }
      r3.push({ className: o4, style: a2 });
    }
    return t4 && !n4 && r3.push({ className: "CodeMirror-linenumbers", style: null }), r3;
  }
  function yi(e6) {
    var t4 = e6.gutters, r3 = e6.gutterSpecs;
    M(t4), e6.lineGutter = null;
    for (var n4 = 0; n4 < r3.length; ++n4) {
      var i5 = r3[n4], o4 = i5.className, a2 = i5.style, l4 = t4.appendChild(O("div", null, "CodeMirror-gutter " + o4));
      a2 && (l4.style.cssText = a2), "CodeMirror-linenumbers" == o4 && (e6.lineGutter = l4, l4.style.width = (e6.lineNumWidth || 1) + "px");
    }
    t4.style.display = r3.length ? "" : "none", hi(e6);
  }
  function bi(e6) {
    yi(e6.display), pn(e6), mi(e6);
  }
  function wi(e6, t4, n4, i5) {
    var o4 = this;
    this.input = n4, o4.scrollbarFiller = O("div", null, "CodeMirror-scrollbar-filler"), o4.scrollbarFiller.setAttribute("cm-not-content", "true"), o4.gutterFiller = O("div", null, "CodeMirror-gutter-filler"), o4.gutterFiller.setAttribute("cm-not-content", "true"), o4.lineDiv = _("div", null, "CodeMirror-code"), o4.selectionDiv = O("div", null, null, "position: relative; z-index: 1"), o4.cursorDiv = O("div", null, "CodeMirror-cursors"), o4.measure = O("div", null, "CodeMirror-measure"), o4.lineMeasure = O("div", null, "CodeMirror-measure"), o4.lineSpace = _("div", [o4.measure, o4.lineMeasure, o4.selectionDiv, o4.cursorDiv, o4.lineDiv], null, "position: relative; outline: none");
    var c2 = _("div", [o4.lineSpace], "CodeMirror-lines");
    o4.mover = O("div", [c2], null, "position: relative"), o4.sizer = O("div", [o4.mover], "CodeMirror-sizer"), o4.sizerWidth = null, o4.heightForcer = O("div", null, null, "position: absolute; height: 50px; width: 1px;"), o4.gutters = O("div", null, "CodeMirror-gutters"), o4.lineGutter = null, o4.scroller = O("div", [o4.sizer, o4.heightForcer, o4.gutters], "CodeMirror-scroll"), o4.scroller.setAttribute("tabIndex", "-1"), o4.wrapper = O("div", [o4.scrollbarFiller, o4.gutterFiller, o4.scroller], "CodeMirror"), u && d >= 105 && (o4.wrapper.style.clipPath = "inset(0px)"), o4.wrapper.setAttribute("translate", "no"), a && l3 < 8 && (o4.gutters.style.zIndex = -1, o4.scroller.style.paddingRight = 0), s2 || r2 && y || (o4.scroller.draggable = true), e6 && (e6.appendChild ? e6.appendChild(o4.wrapper) : e6(o4.wrapper)), o4.viewFrom = o4.viewTo = t4.first, o4.reportedViewFrom = o4.reportedViewTo = t4.first, o4.view = [], o4.renderedView = null, o4.externalMeasured = null, o4.viewOffset = 0, o4.lastWrapHeight = o4.lastWrapWidth = 0, o4.updateLineNumbers = null, o4.nativeBarWidth = o4.barHeight = o4.barWidth = 0, o4.scrollbarsClipped = false, o4.lineNumWidth = o4.lineNumInnerWidth = o4.lineNumChars = null, o4.alignWidgets = false, o4.cachedCharWidth = o4.cachedTextHeight = o4.cachedPaddingH = null, o4.maxLine = null, o4.maxLineLength = 0, o4.maxLineChanged = false, o4.wheelDX = o4.wheelDY = o4.wheelStartX = o4.wheelStartY = null, o4.shift = false, o4.selForContextMenu = null, o4.activeTouch = null, o4.gutterSpecs = vi(i5.gutters, i5.lineNumbers), yi(o4), n4.init(o4);
  }
  si.prototype.signal = function(e6, t4) {
    we(e6, t4) && this.events.push(arguments);
  }, si.prototype.finish = function() {
    for (var e6 = 0; e6 < this.events.length; e6++) ve.apply(null, this.events[e6]);
  };
  var ki = 0, xi = null;
  function Ci(e6) {
    var t4 = e6.wheelDeltaX, r3 = e6.wheelDeltaY;
    return null == t4 && e6.detail && e6.axis == e6.HORIZONTAL_AXIS && (t4 = e6.detail), null == r3 && e6.detail && e6.axis == e6.VERTICAL_AXIS ? r3 = e6.detail : null == r3 && (r3 = e6.wheelDelta), { x: t4, y: r3 };
  }
  function Si(e6) {
    var t4 = Ci(e6);
    return t4.x *= xi, t4.y *= xi, t4;
  }
  function Ti(e6, t4) {
    u && 102 == d && (null == e6.display.chromeScrollHack ? e6.display.sizer.style.pointerEvents = "none" : clearTimeout(e6.display.chromeScrollHack), e6.display.chromeScrollHack = setTimeout((function() {
      e6.display.chromeScrollHack = null, e6.display.sizer.style.pointerEvents = "";
    }), 100));
    var n4 = Ci(t4), i5 = n4.x, o4 = n4.y, a2 = xi;
    0 === t4.deltaMode && (i5 = t4.deltaX, o4 = t4.deltaY, a2 = 1);
    var l4 = e6.display, c2 = l4.scroller, h2 = c2.scrollWidth > c2.clientWidth, p2 = c2.scrollHeight > c2.clientHeight;
    if (i5 && h2 || o4 && p2) {
      if (o4 && b && s2) {
        e: for (var m2 = t4.target, g2 = l4.view; m2 != c2; m2 = m2.parentNode) for (var v2 = 0; v2 < g2.length; v2++) if (g2[v2].node == m2) {
          e6.display.currentWheelTarget = m2;
          break e;
        }
      }
      if (i5 && !r2 && !f && null != a2) return o4 && p2 && In(e6, Math.max(0, c2.scrollTop + o4 * a2)), Bn(e6, Math.max(0, c2.scrollLeft + i5 * a2)), (!o4 || o4 && p2) && xe(t4), void (l4.wheelStartX = null);
      if (o4 && null != a2) {
        var y2 = o4 * a2, w2 = e6.doc.scrollTop, k2 = w2 + l4.wrapper.clientHeight;
        y2 < 0 ? w2 = Math.max(0, w2 + y2 - 50) : k2 = Math.min(e6.doc.height, k2 + y2 + 50), fi(e6, { top: w2, bottom: k2 });
      }
      ki < 20 && 0 !== t4.deltaMode && (null == l4.wheelStartX ? (l4.wheelStartX = c2.scrollLeft, l4.wheelStartY = c2.scrollTop, l4.wheelDX = i5, l4.wheelDY = o4, setTimeout((function() {
        if (null != l4.wheelStartX) {
          var e7 = c2.scrollLeft - l4.wheelStartX, t5 = c2.scrollTop - l4.wheelStartY, r3 = t5 && l4.wheelDY && t5 / l4.wheelDY || e7 && l4.wheelDX && e7 / l4.wheelDX;
          l4.wheelStartX = l4.wheelStartY = null, r3 && (xi = (xi * ki + r3) / (ki + 1), ++ki);
        }
      }), 200)) : (l4.wheelDX += i5, l4.wheelDY += o4));
    }
  }
  a ? xi = -0.53 : r2 ? xi = 15 : u ? xi = -0.7 : h && (xi = -1 / 3);
  var Li = function(e6, t4) {
    this.ranges = e6, this.primIndex = t4;
  };
  Li.prototype.primary = function() {
    return this.ranges[this.primIndex];
  }, Li.prototype.equals = function(e6) {
    if (e6 == this) return true;
    if (e6.primIndex != this.primIndex || e6.ranges.length != this.ranges.length) return false;
    for (var t4 = 0; t4 < this.ranges.length; t4++) {
      var r3 = this.ranges[t4], n4 = e6.ranges[t4];
      if (!ot(r3.anchor, n4.anchor) || !ot(r3.head, n4.head)) return false;
    }
    return true;
  }, Li.prototype.deepCopy = function() {
    for (var e6 = [], t4 = 0; t4 < this.ranges.length; t4++) e6[t4] = new Ai(at(this.ranges[t4].anchor), at(this.ranges[t4].head));
    return new Li(e6, this.primIndex);
  }, Li.prototype.somethingSelected = function() {
    for (var e6 = 0; e6 < this.ranges.length; e6++) if (!this.ranges[e6].empty()) return true;
    return false;
  }, Li.prototype.contains = function(e6, t4) {
    t4 || (t4 = e6);
    for (var r3 = 0; r3 < this.ranges.length; r3++) {
      var n4 = this.ranges[r3];
      if (it(t4, n4.from()) >= 0 && it(e6, n4.to()) <= 0) return r3;
    }
    return -1;
  };
  var Ai = function(e6, t4) {
    this.anchor = e6, this.head = t4;
  };
  function Mi(e6, t4, r3) {
    var n4 = e6 && e6.options.selectionsMayTouch, i5 = t4[r3];
    t4.sort((function(e7, t5) {
      return it(e7.from(), t5.from());
    })), r3 = Z(t4, i5);
    for (var o4 = 1; o4 < t4.length; o4++) {
      var a2 = t4[o4], l4 = t4[o4 - 1], s3 = it(l4.to(), a2.from());
      if (n4 && !a2.empty() ? s3 > 0 : s3 >= 0) {
        var c2 = st(l4.from(), a2.from()), u2 = lt(l4.to(), a2.to()), d2 = l4.empty() ? a2.from() == a2.head : l4.from() == l4.head;
        o4 <= r3 && --r3, t4.splice(--o4, 2, new Ai(d2 ? u2 : c2, d2 ? c2 : u2));
      }
    }
    return new Li(t4, r3);
  }
  function zi(e6, t4) {
    return new Li([new Ai(e6, t4 || e6)], 0);
  }
  function Oi(e6) {
    return e6.text ? nt(e6.from.line + e6.text.length - 1, Y(e6.text).length + (1 == e6.text.length ? e6.from.ch : 0)) : e6.to;
  }
  function _i(e6, t4) {
    if (it(e6, t4.from) < 0) return e6;
    if (it(e6, t4.to) <= 0) return Oi(t4);
    var r3 = e6.line + t4.text.length - (t4.to.line - t4.from.line) - 1, n4 = e6.ch;
    return e6.line == t4.to.line && (n4 += Oi(t4).ch - t4.to.ch), nt(r3, n4);
  }
  function Ni(e6, t4) {
    for (var r3 = [], n4 = 0; n4 < e6.sel.ranges.length; n4++) {
      var i5 = e6.sel.ranges[n4];
      r3.push(new Ai(_i(i5.anchor, t4), _i(i5.head, t4)));
    }
    return Mi(e6.cm, r3, e6.sel.primIndex);
  }
  function Pi(e6, t4, r3) {
    return e6.line == t4.line ? nt(r3.line, e6.ch - t4.ch + r3.ch) : nt(r3.line + (e6.line - t4.line), e6.ch);
  }
  function Ei(e6) {
    e6.doc.mode = Re(e6.options, e6.doc.modeOption), Di(e6);
  }
  function Di(e6) {
    e6.doc.iter((function(e7) {
      e7.stateAfter && (e7.stateAfter = null), e7.styles && (e7.styles = null);
    })), e6.doc.modeFrontier = e6.doc.highlightFrontier = e6.doc.first, ai(e6, 100), e6.state.modeGen++, e6.curOp && pn(e6);
  }
  function Wi(e6, t4) {
    return 0 == t4.from.ch && 0 == t4.to.ch && "" == Y(t4.text) && (!e6.cm || e6.cm.options.wholeLineUpdateBefore);
  }
  function Fi(e6, t4, r3, n4) {
    function i5(e7) {
      return r3 ? r3[e7] : null;
    }
    function o4(e7, r4, i6) {
      !(function(e8, t5, r5, n5) {
        e8.text = t5, e8.stateAfter && (e8.stateAfter = null), e8.styles && (e8.styles = null), null != e8.order && (e8.order = null), _t(e8), Nt(e8, r5);
        var i7 = n5 ? n5(e8) : 1;
        i7 != e8.height && Qe(e8, i7);
      })(e7, r4, i6, n4), ur(e7, "change", e7, t4);
    }
    function a2(e7, t5) {
      for (var r4 = [], o5 = e7; o5 < t5; ++o5) r4.push(new qt(c2[o5], i5(o5), n4));
      return r4;
    }
    var l4 = t4.from, s3 = t4.to, c2 = t4.text, u2 = qe(e6, l4.line), d2 = qe(e6, s3.line), f2 = Y(c2), h2 = i5(c2.length - 1), p2 = s3.line - l4.line;
    if (t4.full) e6.insert(0, a2(0, c2.length)), e6.remove(c2.length, e6.size - c2.length);
    else if (Wi(e6, t4)) {
      var m2 = a2(0, c2.length - 1);
      o4(d2, d2.text, h2), p2 && e6.remove(l4.line, p2), m2.length && e6.insert(l4.line, m2);
    } else if (u2 == d2) if (1 == c2.length) o4(u2, u2.text.slice(0, l4.ch) + f2 + u2.text.slice(s3.ch), h2);
    else {
      var g2 = a2(1, c2.length - 1);
      g2.push(new qt(f2 + u2.text.slice(s3.ch), h2, n4)), o4(u2, u2.text.slice(0, l4.ch) + c2[0], i5(0)), e6.insert(l4.line + 1, g2);
    }
    else if (1 == c2.length) o4(u2, u2.text.slice(0, l4.ch) + c2[0] + d2.text.slice(s3.ch), i5(0)), e6.remove(l4.line + 1, p2);
    else {
      o4(u2, u2.text.slice(0, l4.ch) + c2[0], i5(0)), o4(d2, f2 + d2.text.slice(s3.ch), h2);
      var v2 = a2(1, c2.length - 1);
      p2 > 1 && e6.remove(l4.line + 1, p2 - 1), e6.insert(l4.line + 1, v2);
    }
    ur(e6, "change", e6, t4);
  }
  function Ii(e6, t4, r3) {
    !(function e7(n4, i5, o4) {
      if (n4.linked) for (var a2 = 0; a2 < n4.linked.length; ++a2) {
        var l4 = n4.linked[a2];
        if (l4.doc != i5) {
          var s3 = o4 && l4.sharedHist;
          r3 && !s3 || (t4(l4.doc, s3), e7(l4.doc, n4, s3));
        }
      }
    })(e6, null, true);
  }
  function Hi(e6, t4) {
    if (t4.cm) throw Error("This document is already in use.");
    e6.doc = t4, t4.cm = e6, dn(e6), Ei(e6), Bi(e6), e6.options.direction = t4.direction, e6.options.lineWrapping || Gt(e6), e6.options.mode = t4.modeOption, pn(e6);
  }
  function Bi(e6) {
    ("rtl" == e6.doc.direction ? E : A2)(e6.display.lineDiv, "CodeMirror-rtl");
  }
  function $i(e6) {
    this.done = [], this.undone = [], this.undoDepth = e6 ? e6.undoDepth : 1 / 0, this.lastModTime = this.lastSelTime = 0, this.lastOp = this.lastSelOp = null, this.lastOrigin = this.lastSelOrigin = null, this.generation = this.maxGeneration = e6 ? e6.maxGeneration : 1;
  }
  function Ri(e6, t4) {
    var r3 = { from: at(t4.from), to: Oi(t4), text: Xe(e6, t4.from, t4.to) };
    return Vi(e6, r3, t4.from.line, t4.to.line + 1), Ii(e6, (function(e7) {
      return Vi(e7, r3, t4.from.line, t4.to.line + 1);
    }), true), r3;
  }
  function Zi(e6) {
    for (; e6.length && Y(e6).ranges; ) e6.pop();
  }
  function ji(e6, t4, r3, n4) {
    var i5 = e6.history;
    i5.undone.length = 0;
    var o4, a2, l4 = +/* @__PURE__ */ new Date();
    if ((i5.lastOp == n4 || i5.lastOrigin == t4.origin && t4.origin && ("+" == t4.origin.charAt(0) && i5.lastModTime > l4 - (e6.cm ? e6.cm.options.historyEventDelay : 500) || "*" == t4.origin.charAt(0))) && (o4 = (function(e7, t5) {
      return t5 ? (Zi(e7.done), Y(e7.done)) : e7.done.length && !Y(e7.done).ranges ? Y(e7.done) : e7.done.length > 1 && !e7.done[e7.done.length - 2].ranges ? (e7.done.pop(), Y(e7.done)) : void 0;
    })(i5, i5.lastOp == n4))) a2 = Y(o4.changes), 0 == it(t4.from, t4.to) && 0 == it(t4.from, a2.to) ? a2.to = Oi(t4) : o4.changes.push(Ri(e6, t4));
    else {
      var s3 = Y(i5.done);
      for (s3 && s3.ranges || Ui(e6.sel, i5.done), o4 = { changes: [Ri(e6, t4)], generation: i5.generation }, i5.done.push(o4); i5.done.length > i5.undoDepth; ) i5.done.shift(), i5.done[0].ranges || i5.done.shift();
    }
    i5.done.push(r3), i5.generation = ++i5.maxGeneration, i5.lastModTime = i5.lastSelTime = l4, i5.lastOp = i5.lastSelOp = n4, i5.lastOrigin = i5.lastSelOrigin = t4.origin, a2 || ve(e6, "historyAdded");
  }
  function Ui(e6, t4) {
    var r3 = Y(t4);
    r3 && r3.ranges && r3.equals(e6) || t4.push(e6);
  }
  function Vi(e6, t4, r3, n4) {
    var i5 = t4["spans_" + e6.id], o4 = 0;
    e6.iter(Math.max(e6.first, r3), Math.min(e6.first + e6.size, n4), (function(r4) {
      r4.markedSpans && ((i5 || (i5 = t4["spans_" + e6.id] = {}))[o4] = r4.markedSpans), ++o4;
    }));
  }
  function Ki(e6) {
    if (!e6) return null;
    for (var t4, r3 = 0; r3 < e6.length; ++r3) e6[r3].marker.explicitlyCleared ? t4 || (t4 = e6.slice(0, r3)) : t4 && t4.push(e6[r3]);
    return t4 ? t4.length ? t4 : null : e6;
  }
  function Gi(e6, t4) {
    var r3 = (function(e7, t5) {
      var r4 = t5["spans_" + e7.id];
      if (!r4) return null;
      for (var n5 = [], i6 = 0; i6 < t5.text.length; ++i6) n5.push(Ki(r4[i6]));
      return n5;
    })(e6, t4), n4 = zt(e6, t4);
    if (!r3) return n4;
    if (!n4) return r3;
    for (var i5 = 0; i5 < r3.length; ++i5) {
      var o4 = r3[i5], a2 = n4[i5];
      if (o4 && a2) e: for (var l4 = 0; l4 < a2.length; ++l4) {
        for (var s3 = a2[l4], c2 = 0; c2 < o4.length; ++c2) if (o4[c2].marker == s3.marker) continue e;
        o4.push(s3);
      }
      else a2 && (r3[i5] = a2);
    }
    return r3;
  }
  function qi(e6, t4, r3) {
    for (var n4 = [], i5 = 0; i5 < e6.length; ++i5) {
      var o4 = e6[i5];
      if (o4.ranges) n4.push(r3 ? Li.prototype.deepCopy.call(o4) : o4);
      else {
        var a2 = o4.changes, l4 = [];
        n4.push({ changes: l4 });
        for (var s3 = 0; s3 < a2.length; ++s3) {
          var c2 = a2[s3], u2 = void 0;
          if (l4.push({ from: c2.from, to: c2.to, text: c2.text }), t4) for (var d2 in c2) (u2 = d2.match(/^spans_(\d+)$/)) && Z(t4, Number(u2[1])) > -1 && (Y(l4)[d2] = c2[d2], delete c2[d2]);
        }
      }
    }
    return n4;
  }
  function Xi(e6, t4, r3, n4) {
    if (n4) {
      var i5 = e6.anchor;
      if (r3) {
        var o4 = it(t4, i5) < 0;
        o4 != it(r3, i5) < 0 ? (i5 = t4, t4 = r3) : o4 != it(t4, r3) < 0 && (t4 = r3);
      }
      return new Ai(i5, t4);
    }
    return new Ai(r3 || t4, t4);
  }
  function Yi(e6, t4, r3, n4, i5) {
    null == i5 && (i5 = e6.cm && (e6.cm.display.shift || e6.extend)), ro(e6, new Li([Xi(e6.sel.primary(), t4, r3, i5)], 0), n4);
  }
  function Qi(e6, t4, r3) {
    for (var n4 = [], i5 = e6.cm && (e6.cm.display.shift || e6.extend), o4 = 0; o4 < e6.sel.ranges.length; o4++) n4[o4] = Xi(e6.sel.ranges[o4], t4[o4], null, i5);
    ro(e6, Mi(e6.cm, n4, e6.sel.primIndex), r3);
  }
  function Ji(e6, t4, r3, n4) {
    var i5 = e6.sel.ranges.slice(0);
    i5[t4] = r3, ro(e6, Mi(e6.cm, i5, e6.sel.primIndex), n4);
  }
  function eo(e6, t4, r3, n4) {
    ro(e6, zi(t4, r3), n4);
  }
  function to(e6, t4, r3) {
    var n4 = e6.history.done, i5 = Y(n4);
    i5 && i5.ranges ? (n4[n4.length - 1] = t4, no(e6, t4, r3)) : ro(e6, t4, r3);
  }
  function ro(e6, t4, r3) {
    no(e6, t4, r3), (function(e7, t5, r4, n4) {
      var i5 = e7.history, o4 = n4 && n4.origin;
      r4 == i5.lastSelOp || o4 && i5.lastSelOrigin == o4 && (i5.lastModTime == i5.lastSelTime && i5.lastOrigin == o4 || (function(e8, t6, r5, n5) {
        var i6 = t6.charAt(0);
        return "*" == i6 || "+" == i6 && r5.ranges.length == n5.ranges.length && r5.somethingSelected() == n5.somethingSelected() && /* @__PURE__ */ new Date() - e8.history.lastSelTime <= (e8.cm ? e8.cm.options.historyEventDelay : 500);
      })(e7, o4, Y(i5.done), t5)) ? i5.done[i5.done.length - 1] = t5 : Ui(t5, i5.done), i5.lastSelTime = +/* @__PURE__ */ new Date(), i5.lastSelOrigin = o4, i5.lastSelOp = r4, n4 && false !== n4.clearRedo && Zi(i5.undone);
    })(e6, e6.sel, e6.cm ? e6.cm.curOp.id : NaN, r3);
  }
  function no(e6, t4, r3) {
    (we(e6, "beforeSelectionChange") || e6.cm && we(e6.cm, "beforeSelectionChange")) && (t4 = (function(e7, t5, r4) {
      var n5 = { ranges: t5.ranges, update: function(t6) {
        this.ranges = [];
        for (var r5 = 0; r5 < t6.length; r5++) this.ranges[r5] = new Ai(ut(e7, t6[r5].anchor), ut(e7, t6[r5].head));
      }, origin: r4 && r4.origin };
      return ve(e7, "beforeSelectionChange", e7, n5), e7.cm && ve(e7.cm, "beforeSelectionChange", e7.cm, n5), n5.ranges != t5.ranges ? Mi(e7.cm, n5.ranges, n5.ranges.length - 1) : t5;
    })(e6, t4, r3));
    var n4 = r3 && r3.bias || (it(t4.primary().head, e6.sel.primary().head) < 0 ? -1 : 1);
    io(e6, ao(e6, t4, n4, true)), r3 && false === r3.scroll || !e6.cm || "nocursor" == e6.cm.getOption("readOnly") || En(e6.cm);
  }
  function io(e6, t4) {
    t4.equals(e6.sel) || (e6.sel = t4, e6.cm && (e6.cm.curOp.updateInput = 1, e6.cm.curOp.selectionChanged = true, be(e6.cm)), ur(e6, "cursorActivity", e6));
  }
  function oo(e6) {
    io(e6, ao(e6, e6.sel, null, false));
  }
  function ao(e6, t4, r3, n4) {
    for (var i5, o4 = 0; o4 < t4.ranges.length; o4++) {
      var a2 = t4.ranges[o4], l4 = t4.ranges.length == e6.sel.ranges.length && e6.sel.ranges[o4], s3 = so(e6, a2.anchor, l4 && l4.anchor, r3, n4), c2 = a2.head == a2.anchor ? s3 : so(e6, a2.head, l4 && l4.head, r3, n4);
      (i5 || s3 != a2.anchor || c2 != a2.head) && (i5 || (i5 = t4.ranges.slice(0, o4)), i5[o4] = new Ai(s3, c2));
    }
    return i5 ? Mi(e6.cm, i5, t4.primIndex) : t4;
  }
  function lo(e6, t4, r3, n4, i5) {
    var o4 = qe(e6, t4.line);
    if (o4.markedSpans) for (var a2 = 0; a2 < o4.markedSpans.length; ++a2) {
      var l4 = o4.markedSpans[a2], s3 = l4.marker, c2 = "selectLeft" in s3 ? !s3.selectLeft : s3.inclusiveLeft, u2 = "selectRight" in s3 ? !s3.selectRight : s3.inclusiveRight;
      if ((null == l4.from || (c2 ? l4.from <= t4.ch : l4.from < t4.ch)) && (null == l4.to || (u2 ? l4.to >= t4.ch : l4.to > t4.ch))) {
        if (i5 && (ve(s3, "beforeCursorEnter"), s3.explicitlyCleared)) {
          if (o4.markedSpans) {
            --a2;
            continue;
          }
          break;
        }
        if (!s3.atomic) continue;
        if (r3) {
          var d2 = s3.find(n4 < 0 ? 1 : -1), f2 = void 0;
          if ((n4 < 0 ? u2 : c2) && (d2 = co(e6, d2, -n4, d2 && d2.line == t4.line ? o4 : null)), d2 && d2.line == t4.line && (f2 = it(d2, r3)) && (n4 < 0 ? f2 < 0 : f2 > 0)) return lo(e6, d2, t4, n4, i5);
        }
        var h2 = s3.find(n4 < 0 ? -1 : 1);
        return (n4 < 0 ? c2 : u2) && (h2 = co(e6, h2, n4, h2.line == t4.line ? o4 : null)), h2 ? lo(e6, h2, t4, n4, i5) : null;
      }
    }
    return t4;
  }
  function so(e6, t4, r3, n4, i5) {
    var o4 = n4 || 1;
    return lo(e6, t4, r3, o4, i5) || !i5 && lo(e6, t4, r3, o4, true) || lo(e6, t4, r3, -o4, i5) || !i5 && lo(e6, t4, r3, -o4, true) || (e6.cantEdit = true, nt(e6.first, 0));
  }
  function co(e6, t4, r3, n4) {
    return r3 < 0 && 0 == t4.ch ? t4.line > e6.first ? ut(e6, nt(t4.line - 1)) : null : r3 > 0 && t4.ch == (n4 || qe(e6, t4.line)).text.length ? t4.line < e6.first + e6.size - 1 ? nt(t4.line + 1, 0) : null : new nt(t4.line, t4.ch + r3);
  }
  function uo(e6) {
    e6.setSelection(nt(e6.firstLine(), 0), nt(e6.lastLine()), U);
  }
  function fo(e6, t4, r3) {
    var n4 = { canceled: false, from: t4.from, to: t4.to, text: t4.text, origin: t4.origin, cancel: function() {
      return n4.canceled = true;
    } };
    return r3 && (n4.update = function(t5, r4, i5, o4) {
      t5 && (n4.from = ut(e6, t5)), r4 && (n4.to = ut(e6, r4)), i5 && (n4.text = i5), void 0 !== o4 && (n4.origin = o4);
    }), ve(e6, "beforeChange", e6, n4), e6.cm && ve(e6.cm, "beforeChange", e6.cm, n4), n4.canceled ? (e6.cm && (e6.cm.curOp.updateInput = 2), null) : { from: n4.from, to: n4.to, text: n4.text, origin: n4.origin };
  }
  function ho(e6, t4, r3) {
    if (e6.cm) {
      if (!e6.cm.curOp) return ni(e6.cm, ho)(e6, t4, r3);
      if (e6.cm.state.suppressEdits) return;
    }
    if (!(we(e6, "beforeChange") || e6.cm && we(e6.cm, "beforeChange")) || (t4 = fo(e6, t4, true))) {
      var n4 = St && !r3 && (function(e7, t5, r4) {
        var n5 = null;
        if (e7.iter(t5.line, r4.line + 1, (function(e8) {
          if (e8.markedSpans) for (var t6 = 0; t6 < e8.markedSpans.length; ++t6) {
            var r5 = e8.markedSpans[t6].marker;
            !r5.readOnly || n5 && -1 != Z(n5, r5) || (n5 || (n5 = [])).push(r5);
          }
        })), !n5) return null;
        for (var i6 = [{ from: t5, to: r4 }], o4 = 0; o4 < n5.length; ++o4) for (var a2 = n5[o4], l4 = a2.find(0), s3 = 0; s3 < i6.length; ++s3) {
          var c2 = i6[s3];
          if (!(it(c2.to, l4.from) < 0 || it(c2.from, l4.to) > 0)) {
            var u2 = [s3, 1], d2 = it(c2.from, l4.from), f2 = it(c2.to, l4.to);
            (d2 < 0 || !a2.inclusiveLeft && !d2) && u2.push({ from: c2.from, to: l4.from }), (f2 > 0 || !a2.inclusiveRight && !f2) && u2.push({ from: l4.to, to: c2.to }), i6.splice.apply(i6, u2), s3 += u2.length - 3;
          }
        }
        return i6;
      })(e6, t4.from, t4.to);
      if (n4) for (var i5 = n4.length - 1; i5 >= 0; --i5) po(e6, { from: n4[i5].from, to: n4[i5].to, text: i5 ? [""] : t4.text, origin: t4.origin });
      else po(e6, t4);
    }
  }
  function po(e6, t4) {
    if (1 != t4.text.length || "" != t4.text[0] || 0 != it(t4.from, t4.to)) {
      var r3 = Ni(e6, t4);
      ji(e6, t4, r3, e6.cm ? e6.cm.curOp.id : NaN), vo(e6, t4, r3, zt(e6, t4));
      var n4 = [];
      Ii(e6, (function(e7, r4) {
        r4 || -1 != Z(n4, e7.history) || (ko(e7.history, t4), n4.push(e7.history)), vo(e7, t4, null, zt(e7, t4));
      }));
    }
  }
  function mo(e6, t4, r3) {
    var n4 = e6.cm && e6.cm.state.suppressEdits;
    if (!n4 || r3) {
      for (var i5, o4 = e6.history, a2 = e6.sel, l4 = "undo" == t4 ? o4.done : o4.undone, s3 = "undo" == t4 ? o4.undone : o4.done, c2 = 0; c2 < l4.length && (i5 = l4[c2], r3 ? !i5.ranges || i5.equals(e6.sel) : i5.ranges); c2++) ;
      if (c2 != l4.length) {
        for (o4.lastOrigin = o4.lastSelOrigin = null; ; ) {
          if (!(i5 = l4.pop()).ranges) {
            if (n4) return void l4.push(i5);
            break;
          }
          if (Ui(i5, s3), r3 && !i5.equals(e6.sel)) return void ro(e6, i5, { clearRedo: false });
          a2 = i5;
        }
        var u2 = [];
        Ui(a2, s3), s3.push({ changes: u2, generation: o4.generation }), o4.generation = i5.generation || ++o4.maxGeneration;
        for (var d2 = we(e6, "beforeChange") || e6.cm && we(e6.cm, "beforeChange"), f2 = function(r4) {
          var n5 = i5.changes[r4];
          if (n5.origin = t4, d2 && !fo(e6, n5, false)) return l4.length = 0, {};
          u2.push(Ri(e6, n5));
          var o5 = r4 ? Ni(e6, n5) : Y(l4);
          vo(e6, n5, o5, Gi(e6, n5)), !r4 && e6.cm && e6.cm.scrollIntoView({ from: n5.from, to: Oi(n5) });
          var a3 = [];
          Ii(e6, (function(e7, t5) {
            t5 || -1 != Z(a3, e7.history) || (ko(e7.history, n5), a3.push(e7.history)), vo(e7, n5, null, Gi(e7, n5));
          }));
        }, h2 = i5.changes.length - 1; h2 >= 0; --h2) {
          var p2 = f2(h2);
          if (p2) return p2.v;
        }
      }
    }
  }
  function go(e6, t4) {
    if (0 != t4 && (e6.first += t4, e6.sel = new Li(Q(e6.sel.ranges, (function(e7) {
      return new Ai(nt(e7.anchor.line + t4, e7.anchor.ch), nt(e7.head.line + t4, e7.head.ch));
    })), e6.sel.primIndex), e6.cm)) {
      pn(e6.cm, e6.first, e6.first - t4, t4);
      for (var r3 = e6.cm.display, n4 = r3.viewFrom; n4 < r3.viewTo; n4++) mn(e6.cm, n4, "gutter");
    }
  }
  function vo(e6, t4, r3, n4) {
    if (e6.cm && !e6.cm.curOp) return ni(e6.cm, vo)(e6, t4, r3, n4);
    if (t4.to.line < e6.first) go(e6, t4.text.length - 1 - (t4.to.line - t4.from.line));
    else if (!(t4.from.line > e6.lastLine())) {
      if (t4.from.line < e6.first) {
        var i5 = t4.text.length - 1 - (e6.first - t4.from.line);
        go(e6, i5), t4 = { from: nt(e6.first, 0), to: nt(t4.to.line + i5, t4.to.ch), text: [Y(t4.text)], origin: t4.origin };
      }
      var o4 = e6.lastLine();
      t4.to.line > o4 && (t4 = { from: t4.from, to: nt(o4, qe(e6, o4).text.length), text: [t4.text[0]], origin: t4.origin }), t4.removed = Xe(e6, t4.from, t4.to), r3 || (r3 = Ni(e6, t4)), e6.cm ? (function(e7, t5, r4) {
        var n5 = e7.doc, i6 = e7.display, o5 = t5.from, a2 = t5.to, l4 = false, s3 = o5.line;
        e7.options.lineWrapping || (s3 = Je($t(qe(n5, o5.line))), n5.iter(s3, a2.line + 1, (function(e8) {
          if (e8 == i6.maxLine) return l4 = true, true;
        }))), n5.sel.contains(t5.from, t5.to) > -1 && be(e7), Fi(n5, t5, r4, un(e7)), e7.options.lineWrapping || (n5.iter(s3, o5.line + t5.text.length, (function(e8) {
          var t6 = Kt(e8);
          t6 > i6.maxLineLength && (i6.maxLine = e8, i6.maxLineLength = t6, i6.maxLineChanged = true, l4 = false);
        })), l4 && (e7.curOp.updateMaxLine = true)), (function(e8, t6) {
          if (e8.modeFrontier = Math.min(e8.modeFrontier, t6), !(e8.highlightFrontier < t6 - 10)) {
            for (var r5 = e8.first, n6 = t6 - 1; n6 > r5; n6--) {
              var i7 = qe(e8, n6).stateAfter;
              if (i7 && (!(i7 instanceof ft) || n6 + i7.lookAhead < t6)) {
                r5 = n6 + 1;
                break;
              }
            }
            e8.highlightFrontier = Math.min(e8.highlightFrontier, r5);
          }
        })(n5, o5.line), ai(e7, 400);
        var c2 = t5.text.length - (a2.line - o5.line) - 1;
        t5.full ? pn(e7) : o5.line != a2.line || 1 != t5.text.length || Wi(e7.doc, t5) ? pn(e7, o5.line, a2.line + 1, c2) : mn(e7, o5.line, "text");
        var u2 = we(e7, "changes"), d2 = we(e7, "change");
        if (d2 || u2) {
          var f2 = { from: o5, to: a2, text: t5.text, removed: t5.removed, origin: t5.origin };
          d2 && ur(e7, "change", e7, f2), u2 && (e7.curOp.changeObjs || (e7.curOp.changeObjs = [])).push(f2);
        }
        e7.display.selForContextMenu = null;
      })(e6.cm, t4, n4) : Fi(e6, t4, n4), no(e6, r3, U), e6.cantEdit && so(e6, nt(e6.firstLine(), 0)) && (e6.cantEdit = false);
    }
  }
  function yo(e6, t4, r3, n4, i5) {
    var o4;
    n4 || (n4 = r3), it(n4, r3) < 0 && (r3 = (o4 = [n4, r3])[0], n4 = o4[1]), "string" == typeof t4 && (t4 = e6.splitLines(t4)), ho(e6, { from: r3, to: n4, text: t4, origin: i5 });
  }
  function bo(e6, t4, r3, n4) {
    r3 < e6.line ? e6.line += n4 : t4 < e6.line && (e6.line = t4, e6.ch = 0);
  }
  function wo(e6, t4, r3, n4) {
    for (var i5 = 0; i5 < e6.length; ++i5) {
      var o4 = e6[i5], a2 = true;
      if (o4.ranges) {
        o4.copied || ((o4 = e6[i5] = o4.deepCopy()).copied = true);
        for (var l4 = 0; l4 < o4.ranges.length; l4++) bo(o4.ranges[l4].anchor, t4, r3, n4), bo(o4.ranges[l4].head, t4, r3, n4);
      } else {
        for (var s3 = 0; s3 < o4.changes.length; ++s3) {
          var c2 = o4.changes[s3];
          if (r3 < c2.from.line) c2.from = nt(c2.from.line + n4, c2.from.ch), c2.to = nt(c2.to.line + n4, c2.to.ch);
          else if (t4 <= c2.to.line) {
            a2 = false;
            break;
          }
        }
        a2 || (e6.splice(0, i5 + 1), i5 = 0);
      }
    }
  }
  function ko(e6, t4) {
    var r3 = t4.from.line, n4 = t4.to.line, i5 = t4.text.length - (n4 - r3) - 1;
    wo(e6.done, r3, n4, i5), wo(e6.undone, r3, n4, i5);
  }
  function xo(e6, t4, r3, n4) {
    var i5 = t4, o4 = t4;
    return "number" == typeof t4 ? o4 = qe(e6, ct(e6, t4)) : i5 = Je(t4), null == i5 ? null : (n4(o4, i5) && e6.cm && mn(e6.cm, i5, r3), o4);
  }
  function Co(e6) {
    this.lines = e6, this.parent = null;
    for (var t4 = 0, r3 = 0; r3 < e6.length; ++r3) e6[r3].parent = this, t4 += e6[r3].height;
    this.height = t4;
  }
  function So(e6) {
    this.children = e6;
    for (var t4 = 0, r3 = 0, n4 = 0; n4 < e6.length; ++n4) {
      var i5 = e6[n4];
      t4 += i5.chunkSize(), r3 += i5.height, i5.parent = this;
    }
    this.size = t4, this.height = r3, this.parent = null;
  }
  Ai.prototype.from = function() {
    return st(this.anchor, this.head);
  }, Ai.prototype.to = function() {
    return lt(this.anchor, this.head);
  }, Ai.prototype.empty = function() {
    return this.head.line == this.anchor.line && this.head.ch == this.anchor.ch;
  }, Co.prototype = { chunkSize: function() {
    return this.lines.length;
  }, removeInner: function(e6, t4) {
    for (var r3 = e6, n4 = e6 + t4; r3 < n4; ++r3) {
      var i5 = this.lines[r3];
      this.height -= i5.height, Xt(i5), ur(i5, "delete");
    }
    this.lines.splice(e6, t4);
  }, collapse: function(e6) {
    e6.push.apply(e6, this.lines);
  }, insertInner: function(e6, t4, r3) {
    this.height += r3, this.lines = this.lines.slice(0, e6).concat(t4).concat(this.lines.slice(e6));
    for (var n4 = 0; n4 < t4.length; ++n4) t4[n4].parent = this;
  }, iterN: function(e6, t4, r3) {
    for (var n4 = e6 + t4; e6 < n4; ++e6) if (r3(this.lines[e6])) return true;
  } }, So.prototype = { chunkSize: function() {
    return this.size;
  }, removeInner: function(e6, t4) {
    this.size -= t4;
    for (var r3 = 0; r3 < this.children.length; ++r3) {
      var n4 = this.children[r3], i5 = n4.chunkSize();
      if (e6 < i5) {
        var o4 = Math.min(t4, i5 - e6), a2 = n4.height;
        if (n4.removeInner(e6, o4), this.height -= a2 - n4.height, i5 == o4 && (this.children.splice(r3--, 1), n4.parent = null), 0 == (t4 -= o4)) break;
        e6 = 0;
      } else e6 -= i5;
    }
    if (this.size - t4 < 25 && (this.children.length > 1 || !(this.children[0] instanceof Co))) {
      var l4 = [];
      this.collapse(l4), this.children = [new Co(l4)], this.children[0].parent = this;
    }
  }, collapse: function(e6) {
    for (var t4 = 0; t4 < this.children.length; ++t4) this.children[t4].collapse(e6);
  }, insertInner: function(e6, t4, r3) {
    this.size += t4.length, this.height += r3;
    for (var n4 = 0; n4 < this.children.length; ++n4) {
      var i5 = this.children[n4], o4 = i5.chunkSize();
      if (e6 <= o4) {
        if (i5.insertInner(e6, t4, r3), i5.lines && i5.lines.length > 50) {
          for (var a2 = i5.lines.length % 25 + 25, l4 = a2; l4 < i5.lines.length; ) {
            var s3 = new Co(i5.lines.slice(l4, l4 += 25));
            i5.height -= s3.height, this.children.splice(++n4, 0, s3), s3.parent = this;
          }
          i5.lines = i5.lines.slice(0, a2), this.maybeSpill();
        }
        break;
      }
      e6 -= o4;
    }
  }, maybeSpill: function() {
    if (!(this.children.length <= 10)) {
      var e6 = this;
      do {
        var t4 = new So(e6.children.splice(e6.children.length - 5, 5));
        if (e6.parent) {
          e6.size -= t4.size, e6.height -= t4.height;
          var r3 = Z(e6.parent.children, e6);
          e6.parent.children.splice(r3 + 1, 0, t4);
        } else {
          var n4 = new So(e6.children);
          n4.parent = e6, e6.children = [n4, t4], e6 = n4;
        }
        t4.parent = e6.parent;
      } while (e6.children.length > 10);
      e6.parent.maybeSpill();
    }
  }, iterN: function(e6, t4, r3) {
    for (var n4 = 0; n4 < this.children.length; ++n4) {
      var i5 = this.children[n4], o4 = i5.chunkSize();
      if (e6 < o4) {
        var a2 = Math.min(t4, o4 - e6);
        if (i5.iterN(e6, a2, r3)) return true;
        if (0 == (t4 -= a2)) break;
        e6 = 0;
      } else e6 -= o4;
    }
  } };
  var To = function(e6, t4, r3) {
    if (r3) for (var n4 in r3) r3.hasOwnProperty(n4) && (this[n4] = r3[n4]);
    this.doc = e6, this.node = t4;
  };
  function Lo(e6, t4, r3) {
    Vt(t4) < (e6.curOp && e6.curOp.scrollTop || e6.doc.scrollTop) && Pn(e6, r3);
  }
  To.prototype.clear = function() {
    var e6 = this.doc.cm, t4 = this.line.widgets, r3 = this.line, n4 = Je(r3);
    if (null != n4 && t4) {
      for (var i5 = 0; i5 < t4.length; ++i5) t4[i5] == this && t4.splice(i5--, 1);
      t4.length || (r3.widgets = null);
      var o4 = Cr(this);
      Qe(r3, Math.max(0, r3.height - o4)), e6 && (ri(e6, (function() {
        Lo(e6, r3, -o4), mn(e6, n4, "widget");
      })), ur(e6, "lineWidgetCleared", e6, this, n4));
    }
  }, To.prototype.changed = function() {
    var e6 = this, t4 = this.height, r3 = this.doc.cm, n4 = this.line;
    this.height = null;
    var i5 = Cr(this) - t4;
    i5 && (jt(this.doc, n4) || Qe(n4, n4.height + i5), r3 && ri(r3, (function() {
      r3.curOp.forceUpdate = true, Lo(r3, n4, i5), ur(r3, "lineWidgetChanged", r3, e6, Je(n4));
    })));
  }, ke(To);
  var Ao = 0, Mo = function(e6, t4) {
    this.lines = [], this.type = t4, this.doc = e6, this.id = ++Ao;
  };
  function zo(e6, t4, r3, n4, i5) {
    if (n4 && n4.shared) return (function(e7, t5, r4, n5, i6) {
      (n5 = B(n5)).shared = false;
      var o5 = [zo(e7, t5, r4, n5, i6)], a3 = o5[0], l5 = n5.widgetNode;
      return Ii(e7, (function(e8) {
        l5 && (n5.widgetNode = l5.cloneNode(true)), o5.push(zo(e8, ut(e8, t5), ut(e8, r4), n5, i6));
        for (var s4 = 0; s4 < e8.linked.length; ++s4) if (e8.linked[s4].isParent) return;
        a3 = Y(o5);
      })), new Oo(o5, a3);
    })(e6, t4, r3, n4, i5);
    if (e6.cm && !e6.cm.curOp) return ni(e6.cm, zo)(e6, t4, r3, n4, i5);
    var o4 = new Mo(e6, i5), a2 = it(t4, r3);
    if (n4 && B(n4, o4, false), a2 > 0 || 0 == a2 && false !== o4.clearWhenEmpty) return o4;
    if (o4.replacedWith && (o4.collapsed = true, o4.widgetNode = _("span", [o4.replacedWith], "CodeMirror-widget"), n4.handleMouseEvents || o4.widgetNode.setAttribute("cm-ignore-events", "true"), n4.insertLeft && (o4.widgetNode.insertLeft = true)), o4.collapsed) {
      if (Bt(e6, t4.line, t4, r3, o4) || t4.line != r3.line && Bt(e6, r3.line, t4, r3, o4)) throw Error("Inserting collapsed marker partially overlapping an existing one");
      Tt = true;
    }
    o4.addToHistory && ji(e6, { from: t4, to: r3, origin: "markText" }, e6.sel, NaN);
    var l4, s3 = t4.line, c2 = e6.cm;
    if (e6.iter(s3, r3.line + 1, (function(n5) {
      c2 && o4.collapsed && !c2.options.lineWrapping && $t(n5) == c2.display.maxLine && (l4 = true), o4.collapsed && s3 != t4.line && Qe(n5, 0), (function(e7, t5, r4) {
        var n6 = r4 && window.WeakSet && (r4.markedSpans || (r4.markedSpans = /* @__PURE__ */ new WeakSet()));
        n6 && e7.markedSpans && n6.has(e7.markedSpans) ? e7.markedSpans.push(t5) : (e7.markedSpans = e7.markedSpans ? e7.markedSpans.concat([t5]) : [t5], n6 && n6.add(e7.markedSpans)), t5.marker.attachLine(e7);
      })(n5, new Lt(o4, s3 == t4.line ? t4.ch : null, s3 == r3.line ? r3.ch : null), e6.cm && e6.cm.curOp), ++s3;
    })), o4.collapsed && e6.iter(t4.line, r3.line + 1, (function(t5) {
      jt(e6, t5) && Qe(t5, 0);
    })), o4.clearOnEnter && pe(o4, "beforeCursorEnter", (function() {
      return o4.clear();
    })), o4.readOnly && (St = true, (e6.history.done.length || e6.history.undone.length) && e6.clearHistory()), o4.collapsed && (o4.id = ++Ao, o4.atomic = true), c2) {
      if (l4 && (c2.curOp.updateMaxLine = true), o4.collapsed) pn(c2, t4.line, r3.line + 1);
      else if (o4.className || o4.startStyle || o4.endStyle || o4.css || o4.attributes || o4.title) for (var u2 = t4.line; u2 <= r3.line; u2++) mn(c2, u2, "text");
      o4.atomic && oo(c2.doc), ur(c2, "markerAdded", c2, o4);
    }
    return o4;
  }
  Mo.prototype.clear = function() {
    if (!this.explicitlyCleared) {
      var e6 = this.doc.cm, t4 = e6 && !e6.curOp;
      if (t4 && qn(e6), we(this, "clear")) {
        var r3 = this.find();
        r3 && ur(this, "clear", r3.from, r3.to);
      }
      for (var n4 = null, i5 = null, o4 = 0; o4 < this.lines.length; ++o4) {
        var a2 = this.lines[o4], l4 = At(a2.markedSpans, this);
        e6 && !this.collapsed ? mn(e6, Je(a2), "text") : e6 && (null != l4.to && (i5 = Je(a2)), null != l4.from && (n4 = Je(a2))), a2.markedSpans = Mt(a2.markedSpans, l4), null == l4.from && this.collapsed && !jt(this.doc, a2) && e6 && Qe(a2, an(e6.display));
      }
      if (e6 && this.collapsed && !e6.options.lineWrapping) for (var s3 = 0; s3 < this.lines.length; ++s3) {
        var c2 = $t(this.lines[s3]), u2 = Kt(c2);
        u2 > e6.display.maxLineLength && (e6.display.maxLine = c2, e6.display.maxLineLength = u2, e6.display.maxLineChanged = true);
      }
      null != n4 && e6 && this.collapsed && pn(e6, n4, i5 + 1), this.lines.length = 0, this.explicitlyCleared = true, this.atomic && this.doc.cantEdit && (this.doc.cantEdit = false, e6 && oo(e6.doc)), e6 && ur(e6, "markerCleared", e6, this, n4, i5), t4 && Xn(e6), this.parent && this.parent.clear();
    }
  }, Mo.prototype.find = function(e6, t4) {
    var r3, n4;
    null == e6 && "bookmark" == this.type && (e6 = 1);
    for (var i5 = 0; i5 < this.lines.length; ++i5) {
      var o4 = this.lines[i5], a2 = At(o4.markedSpans, this);
      if (null != a2.from && (r3 = nt(t4 ? o4 : Je(o4), a2.from), -1 == e6)) return r3;
      if (null != a2.to && (n4 = nt(t4 ? o4 : Je(o4), a2.to), 1 == e6)) return n4;
    }
    return r3 && { from: r3, to: n4 };
  }, Mo.prototype.changed = function() {
    var e6 = this, t4 = this.find(-1, true), r3 = this, n4 = this.doc.cm;
    t4 && n4 && ri(n4, (function() {
      var i5 = t4.line, o4 = Je(t4.line), a2 = Pr(n4, o4);
      if (a2 && (Br(a2), n4.curOp.selectionChanged = n4.curOp.forceUpdate = true), n4.curOp.updateMaxLine = true, !jt(r3.doc, i5) && null != r3.height) {
        var l4 = r3.height;
        r3.height = null;
        var s3 = Cr(r3) - l4;
        s3 && Qe(i5, i5.height + s3);
      }
      ur(n4, "markerChanged", n4, e6);
    }));
  }, Mo.prototype.attachLine = function(e6) {
    if (!this.lines.length && this.doc.cm) {
      var t4 = this.doc.cm.curOp;
      t4.maybeHiddenMarkers && -1 != Z(t4.maybeHiddenMarkers, this) || (t4.maybeUnhiddenMarkers || (t4.maybeUnhiddenMarkers = [])).push(this);
    }
    this.lines.push(e6);
  }, Mo.prototype.detachLine = function(e6) {
    if (this.lines.splice(Z(this.lines, e6), 1), !this.lines.length && this.doc.cm) {
      var t4 = this.doc.cm.curOp;
      (t4.maybeHiddenMarkers || (t4.maybeHiddenMarkers = [])).push(this);
    }
  }, ke(Mo);
  var Oo = function(e6, t4) {
    this.markers = e6, this.primary = t4;
    for (var r3 = 0; r3 < e6.length; ++r3) e6[r3].parent = this;
  };
  function _o(e6) {
    return e6.findMarks(nt(e6.first, 0), e6.clipPos(nt(e6.lastLine())), (function(e7) {
      return e7.parent;
    }));
  }
  function No(e6) {
    for (var t4 = function(t5) {
      var r4 = e6[t5], n4 = [r4.primary.doc];
      Ii(r4.primary.doc, (function(e7) {
        return n4.push(e7);
      }));
      for (var i5 = 0; i5 < r4.markers.length; i5++) {
        var o4 = r4.markers[i5];
        -1 == Z(n4, o4.doc) && (o4.parent = null, r4.markers.splice(i5--, 1));
      }
    }, r3 = 0; r3 < e6.length; r3++) t4(r3);
  }
  Oo.prototype.clear = function() {
    if (!this.explicitlyCleared) {
      this.explicitlyCleared = true;
      for (var e6 = 0; e6 < this.markers.length; ++e6) this.markers[e6].clear();
      ur(this, "clear");
    }
  }, Oo.prototype.find = function(e6, t4) {
    return this.primary.find(e6, t4);
  }, ke(Oo);
  var Po = 0, Eo = function(e6, t4, r3, n4, i5) {
    if (!(this instanceof Eo)) return new Eo(e6, t4, r3, n4, i5);
    null == r3 && (r3 = 0), So.call(this, [new Co([new qt("", null)])]), this.first = r3, this.scrollTop = this.scrollLeft = 0, this.cantEdit = false, this.cleanGeneration = 1, this.modeFrontier = this.highlightFrontier = r3;
    var o4 = nt(r3, 0);
    this.sel = zi(o4), this.history = new $i(null), this.id = ++Po, this.modeOption = t4, this.lineSep = n4, this.direction = "rtl" == i5 ? "rtl" : "ltr", this.extend = false, "string" == typeof e6 && (e6 = this.splitLines(e6)), Fi(this, { from: o4, to: o4, text: e6 }), ro(this, zi(o4), U);
  };
  Eo.prototype = ee(So.prototype, { constructor: Eo, iter: function(e6, t4, r3) {
    r3 ? this.iterN(e6 - this.first, t4 - e6, r3) : this.iterN(this.first, this.first + this.size, e6);
  }, insert: function(e6, t4) {
    for (var r3 = 0, n4 = 0; n4 < t4.length; ++n4) r3 += t4[n4].height;
    this.insertInner(e6 - this.first, t4, r3);
  }, remove: function(e6, t4) {
    this.removeInner(e6 - this.first, t4);
  }, getValue: function(e6) {
    var t4 = Ye(this, this.first, this.first + this.size);
    return false === e6 ? t4 : t4.join(e6 || this.lineSeparator());
  }, setValue: oi((function(e6) {
    var t4 = nt(this.first, 0), r3 = this.first + this.size - 1;
    ho(this, { from: t4, to: nt(r3, qe(this, r3).text.length), text: this.splitLines(e6), origin: "setValue", full: true }, true), this.cm && Dn(this.cm, 0, 0), ro(this, zi(t4), U);
  })), replaceRange: function(e6, t4, r3, n4) {
    yo(this, e6, t4 = ut(this, t4), r3 = r3 ? ut(this, r3) : t4, n4);
  }, getRange: function(e6, t4, r3) {
    var n4 = Xe(this, ut(this, e6), ut(this, t4));
    return false === r3 ? n4 : "" === r3 ? n4.join("") : n4.join(r3 || this.lineSeparator());
  }, getLine: function(e6) {
    var t4 = this.getLineHandle(e6);
    return t4 && t4.text;
  }, getLineHandle: function(e6) {
    if (tt(this, e6)) return qe(this, e6);
  }, getLineNumber: function(e6) {
    return Je(e6);
  }, getLineHandleVisualStart: function(e6) {
    return "number" == typeof e6 && (e6 = qe(this, e6)), $t(e6);
  }, lineCount: function() {
    return this.size;
  }, firstLine: function() {
    return this.first;
  }, lastLine: function() {
    return this.first + this.size - 1;
  }, clipPos: function(e6) {
    return ut(this, e6);
  }, getCursor: function(e6) {
    var t4 = this.sel.primary();
    return null == e6 || "head" == e6 ? t4.head : "anchor" == e6 ? t4.anchor : "end" == e6 || "to" == e6 || false === e6 ? t4.to() : t4.from();
  }, listSelections: function() {
    return this.sel.ranges;
  }, somethingSelected: function() {
    return this.sel.somethingSelected();
  }, setCursor: oi((function(e6, t4, r3) {
    eo(this, ut(this, "number" == typeof e6 ? nt(e6, t4 || 0) : e6), null, r3);
  })), setSelection: oi((function(e6, t4, r3) {
    eo(this, ut(this, e6), ut(this, t4 || e6), r3);
  })), extendSelection: oi((function(e6, t4, r3) {
    Yi(this, ut(this, e6), t4 && ut(this, t4), r3);
  })), extendSelections: oi((function(e6, t4) {
    Qi(this, dt(this, e6), t4);
  })), extendSelectionsBy: oi((function(e6, t4) {
    Qi(this, dt(this, Q(this.sel.ranges, e6)), t4);
  })), setSelections: oi((function(e6, t4, r3) {
    if (e6.length) {
      for (var n4 = [], i5 = 0; i5 < e6.length; i5++) n4[i5] = new Ai(ut(this, e6[i5].anchor), ut(this, e6[i5].head || e6[i5].anchor));
      null == t4 && (t4 = Math.min(e6.length - 1, this.sel.primIndex)), ro(this, Mi(this.cm, n4, t4), r3);
    }
  })), addSelection: oi((function(e6, t4, r3) {
    var n4 = this.sel.ranges.slice(0);
    n4.push(new Ai(ut(this, e6), ut(this, t4 || e6))), ro(this, Mi(this.cm, n4, n4.length - 1), r3);
  })), getSelection: function(e6) {
    for (var t4, r3 = this.sel.ranges, n4 = 0; n4 < r3.length; n4++) {
      var i5 = Xe(this, r3[n4].from(), r3[n4].to());
      t4 = t4 ? t4.concat(i5) : i5;
    }
    return false === e6 ? t4 : t4.join(e6 || this.lineSeparator());
  }, getSelections: function(e6) {
    for (var t4 = [], r3 = this.sel.ranges, n4 = 0; n4 < r3.length; n4++) {
      var i5 = Xe(this, r3[n4].from(), r3[n4].to());
      false !== e6 && (i5 = i5.join(e6 || this.lineSeparator())), t4[n4] = i5;
    }
    return t4;
  }, replaceSelection: function(e6, t4, r3) {
    for (var n4 = [], i5 = 0; i5 < this.sel.ranges.length; i5++) n4[i5] = e6;
    this.replaceSelections(n4, t4, r3 || "+input");
  }, replaceSelections: oi((function(e6, t4, r3) {
    for (var n4 = [], i5 = this.sel, o4 = 0; o4 < i5.ranges.length; o4++) {
      var a2 = i5.ranges[o4];
      n4[o4] = { from: a2.from(), to: a2.to(), text: this.splitLines(e6[o4]), origin: r3 };
    }
    for (var l4 = t4 && "end" != t4 && (function(e7, t5, r4) {
      for (var n5 = [], i6 = nt(e7.first, 0), o5 = i6, a3 = 0; a3 < t5.length; a3++) {
        var l5 = t5[a3], s4 = Pi(l5.from, i6, o5), c2 = Pi(Oi(l5), i6, o5);
        if (i6 = l5.to, o5 = c2, "around" == r4) {
          var u2 = e7.sel.ranges[a3], d2 = it(u2.head, u2.anchor) < 0;
          n5[a3] = new Ai(d2 ? c2 : s4, d2 ? s4 : c2);
        } else n5[a3] = new Ai(s4, s4);
      }
      return new Li(n5, e7.sel.primIndex);
    })(this, n4, t4), s3 = n4.length - 1; s3 >= 0; s3--) ho(this, n4[s3]);
    l4 ? to(this, l4) : this.cm && En(this.cm);
  })), undo: oi((function() {
    mo(this, "undo");
  })), redo: oi((function() {
    mo(this, "redo");
  })), undoSelection: oi((function() {
    mo(this, "undo", true);
  })), redoSelection: oi((function() {
    mo(this, "redo", true);
  })), setExtending: function(e6) {
    this.extend = e6;
  }, getExtending: function() {
    return this.extend;
  }, historySize: function() {
    for (var e6 = this.history, t4 = 0, r3 = 0, n4 = 0; n4 < e6.done.length; n4++) e6.done[n4].ranges || ++t4;
    for (var i5 = 0; i5 < e6.undone.length; i5++) e6.undone[i5].ranges || ++r3;
    return { undo: t4, redo: r3 };
  }, clearHistory: function() {
    var e6 = this;
    this.history = new $i(this.history), Ii(this, (function(t4) {
      return t4.history = e6.history;
    }), true);
  }, markClean: function() {
    this.cleanGeneration = this.changeGeneration(true);
  }, changeGeneration: function(e6) {
    return e6 && (this.history.lastOp = this.history.lastSelOp = this.history.lastOrigin = null), this.history.generation;
  }, isClean: function(e6) {
    return this.history.generation == (e6 || this.cleanGeneration);
  }, getHistory: function() {
    return { done: qi(this.history.done), undone: qi(this.history.undone) };
  }, setHistory: function(e6) {
    var t4 = this.history = new $i(this.history);
    t4.done = qi(e6.done.slice(0), null, true), t4.undone = qi(e6.undone.slice(0), null, true);
  }, setGutterMarker: oi((function(e6, t4, r3) {
    return xo(this, e6, "gutter", (function(e7) {
      var n4 = e7.gutterMarkers || (e7.gutterMarkers = {});
      return n4[t4] = r3, !r3 && ie(n4) && (e7.gutterMarkers = null), true;
    }));
  })), clearGutter: oi((function(e6) {
    var t4 = this;
    this.iter((function(r3) {
      r3.gutterMarkers && r3.gutterMarkers[e6] && xo(t4, r3, "gutter", (function() {
        return r3.gutterMarkers[e6] = null, ie(r3.gutterMarkers) && (r3.gutterMarkers = null), true;
      }));
    }));
  })), lineInfo: function(e6) {
    var t4;
    if ("number" == typeof e6) {
      if (!tt(this, e6)) return null;
      if (t4 = e6, !(e6 = qe(this, e6))) return null;
    } else if (null == (t4 = Je(e6))) return null;
    return { line: t4, handle: e6, text: e6.text, gutterMarkers: e6.gutterMarkers, textClass: e6.textClass, bgClass: e6.bgClass, wrapClass: e6.wrapClass, widgets: e6.widgets };
  }, addLineClass: oi((function(e6, t4, r3) {
    return xo(this, e6, "gutter" == t4 ? "gutter" : "class", (function(e7) {
      var n4 = "text" == t4 ? "textClass" : "background" == t4 ? "bgClass" : "gutter" == t4 ? "gutterClass" : "wrapClass";
      if (e7[n4]) {
        if (T(r3).test(e7[n4])) return false;
        e7[n4] += " " + r3;
      } else e7[n4] = r3;
      return true;
    }));
  })), removeLineClass: oi((function(e6, t4, r3) {
    return xo(this, e6, "gutter" == t4 ? "gutter" : "class", (function(e7) {
      var n4 = "text" == t4 ? "textClass" : "background" == t4 ? "bgClass" : "gutter" == t4 ? "gutterClass" : "wrapClass", i5 = e7[n4];
      if (!i5) return false;
      if (null == r3) e7[n4] = null;
      else {
        var o4 = i5.match(T(r3));
        if (!o4) return false;
        var a2 = o4.index + o4[0].length;
        e7[n4] = i5.slice(0, o4.index) + (o4.index && a2 != i5.length ? " " : "") + i5.slice(a2) || null;
      }
      return true;
    }));
  })), addLineWidget: oi((function(e6, t4, r3) {
    return (function(e7, t5, r4, n4) {
      var i5 = new To(e7, r4, n4), o4 = e7.cm;
      return o4 && i5.noHScroll && (o4.display.alignWidgets = true), xo(e7, t5, "widget", (function(t6) {
        var r5 = t6.widgets || (t6.widgets = []);
        if (null == i5.insertAt ? r5.push(i5) : r5.splice(Math.min(r5.length, Math.max(0, i5.insertAt)), 0, i5), i5.line = t6, o4 && !jt(e7, t6)) {
          var n5 = Vt(t6) < e7.scrollTop;
          Qe(t6, t6.height + Cr(i5)), n5 && Pn(o4, i5.height), o4.curOp.forceUpdate = true;
        }
        return true;
      })), o4 && ur(o4, "lineWidgetAdded", o4, i5, "number" == typeof t5 ? t5 : Je(t5)), i5;
    })(this, e6, t4, r3);
  })), removeLineWidget: function(e6) {
    e6.clear();
  }, markText: function(e6, t4, r3) {
    return zo(this, ut(this, e6), ut(this, t4), r3, r3 && r3.type || "range");
  }, setBookmark: function(e6, t4) {
    var r3 = { replacedWith: t4 && (null == t4.nodeType ? t4.widget : t4), insertLeft: t4 && t4.insertLeft, clearWhenEmpty: false, shared: t4 && t4.shared, handleMouseEvents: t4 && t4.handleMouseEvents };
    return zo(this, e6 = ut(this, e6), e6, r3, "bookmark");
  }, findMarksAt: function(e6) {
    var t4 = [], r3 = qe(this, (e6 = ut(this, e6)).line).markedSpans;
    if (r3) for (var n4 = 0; n4 < r3.length; ++n4) {
      var i5 = r3[n4];
      (null == i5.from || i5.from <= e6.ch) && (null == i5.to || i5.to >= e6.ch) && t4.push(i5.marker.parent || i5.marker);
    }
    return t4;
  }, findMarks: function(e6, t4, r3) {
    e6 = ut(this, e6), t4 = ut(this, t4);
    var n4 = [], i5 = e6.line;
    return this.iter(e6.line, t4.line + 1, (function(o4) {
      var a2 = o4.markedSpans;
      if (a2) for (var l4 = 0; l4 < a2.length; l4++) {
        var s3 = a2[l4];
        null != s3.to && i5 == e6.line && e6.ch >= s3.to || null == s3.from && i5 != e6.line || null != s3.from && i5 == t4.line && s3.from >= t4.ch || r3 && !r3(s3.marker) || n4.push(s3.marker.parent || s3.marker);
      }
      ++i5;
    })), n4;
  }, getAllMarks: function() {
    var e6 = [];
    return this.iter((function(t4) {
      var r3 = t4.markedSpans;
      if (r3) for (var n4 = 0; n4 < r3.length; ++n4) null != r3[n4].from && e6.push(r3[n4].marker);
    })), e6;
  }, posFromIndex: function(e6) {
    var t4, r3 = this.first, n4 = this.lineSeparator().length;
    return this.iter((function(i5) {
      var o4 = i5.text.length + n4;
      if (o4 > e6) return t4 = e6, true;
      e6 -= o4, ++r3;
    })), ut(this, nt(r3, t4));
  }, indexFromPos: function(e6) {
    var t4 = (e6 = ut(this, e6)).ch;
    if (e6.line < this.first || e6.ch < 0) return 0;
    var r3 = this.lineSeparator().length;
    return this.iter(this.first, e6.line, (function(e7) {
      t4 += e7.text.length + r3;
    })), t4;
  }, copy: function(e6) {
    var t4 = new Eo(Ye(this, this.first, this.first + this.size), this.modeOption, this.first, this.lineSep, this.direction);
    return t4.scrollTop = this.scrollTop, t4.scrollLeft = this.scrollLeft, t4.sel = this.sel, t4.extend = false, e6 && (t4.history.undoDepth = this.history.undoDepth, t4.setHistory(this.getHistory())), t4;
  }, linkedDoc: function(e6) {
    e6 || (e6 = {});
    var t4 = this.first, r3 = this.first + this.size;
    null != e6.from && e6.from > t4 && (t4 = e6.from), null != e6.to && e6.to < r3 && (r3 = e6.to);
    var n4 = new Eo(Ye(this, t4, r3), e6.mode || this.modeOption, t4, this.lineSep, this.direction);
    return e6.sharedHist && (n4.history = this.history), (this.linked || (this.linked = [])).push({ doc: n4, sharedHist: e6.sharedHist }), n4.linked = [{ doc: this, isParent: true, sharedHist: e6.sharedHist }], (function(e7, t5) {
      for (var r4 = 0; r4 < t5.length; r4++) {
        var n5 = t5[r4], i5 = n5.find(), o4 = e7.clipPos(i5.from), a2 = e7.clipPos(i5.to);
        if (it(o4, a2)) {
          var l4 = zo(e7, o4, a2, n5.primary, n5.primary.type);
          n5.markers.push(l4), l4.parent = n5;
        }
      }
    })(n4, _o(this)), n4;
  }, unlinkDoc: function(e6) {
    if (e6 instanceof za && (e6 = e6.doc), this.linked) {
      for (var t4 = 0; t4 < this.linked.length; ++t4) if (this.linked[t4].doc == e6) {
        this.linked.splice(t4, 1), e6.unlinkDoc(this), No(_o(this));
        break;
      }
    }
    if (e6.history == this.history) {
      var r3 = [e6.id];
      Ii(e6, (function(e7) {
        return r3.push(e7.id);
      }), true), e6.history = new $i(null), e6.history.done = qi(this.history.done, r3), e6.history.undone = qi(this.history.undone, r3);
    }
  }, iterLinkedDocs: function(e6) {
    Ii(this, e6);
  }, getMode: function() {
    return this.mode;
  }, getEditor: function() {
    return this.cm;
  }, splitLines: function(e6) {
    return this.lineSep ? e6.split(this.lineSep) : Ee(e6);
  }, lineSeparator: function() {
    return this.lineSep || "\n";
  }, setDirection: oi((function(e6) {
    var t4;
    "rtl" != e6 && (e6 = "ltr"), e6 != this.direction && (this.direction = e6, this.iter((function(e7) {
      return e7.order = null;
    })), this.cm && ri(t4 = this.cm, (function() {
      Bi(t4), pn(t4);
    })));
  })) }), Eo.prototype.eachLine = Eo.prototype.iter;
  var Do = 0;
  function Wo(e6) {
    var t4 = this;
    if (Fo(t4), !ye(t4, e6) && !Sr(t4.display, e6)) {
      xe(e6), a && (Do = +/* @__PURE__ */ new Date());
      var r3 = fn2(t4, e6, true), n4 = e6.dataTransfer.files;
      if (r3 && !t4.isReadOnly()) if (n4 && n4.length && window.FileReader && window.File) for (var i5 = n4.length, o4 = Array(i5), l4 = 0, s3 = function() {
        ++l4 == i5 && ni(t4, (function() {
          var e7 = { from: r3 = ut(t4.doc, r3), to: r3, text: t4.doc.splitLines(o4.filter((function(e8) {
            return null != e8;
          })).join(t4.doc.lineSeparator())), origin: "paste" };
          ho(t4.doc, e7), to(t4.doc, zi(ut(t4.doc, r3), ut(t4.doc, Oi(e7))));
        }))();
      }, c2 = function(e7, r4) {
        if (t4.options.allowDropFileTypes && -1 == Z(t4.options.allowDropFileTypes, e7.type)) s3();
        else {
          var n5 = new FileReader();
          n5.onerror = function() {
            return s3();
          }, n5.onload = function() {
            var e8 = n5.result;
            /[\x00-\x08\x0e-\x1f]{2}/.test(e8) || (o4[r4] = e8), s3();
          }, n5.readAsText(e7);
        }
      }, u2 = 0; u2 < n4.length; u2++) c2(n4[u2], u2);
      else {
        if (t4.state.draggingText && t4.doc.sel.contains(r3) > -1) return t4.state.draggingText(e6), void setTimeout((function() {
          return t4.display.input.focus();
        }), 20);
        try {
          var d2 = e6.dataTransfer.getData("Text");
          if (d2) {
            var f2;
            if (t4.state.draggingText && !t4.state.draggingText.copy && (f2 = t4.listSelections()), no(t4.doc, zi(r3, r3)), f2) for (var h2 = 0; h2 < f2.length; ++h2) yo(t4.doc, "", f2[h2].anchor, f2[h2].head, "drag");
            t4.replaceSelection(d2, "around", "paste"), t4.display.input.focus();
          }
        } catch (e7) {
        }
      }
    }
  }
  function Fo(e6) {
    e6.display.dragCursor && (e6.display.lineSpace.removeChild(e6.display.dragCursor), e6.display.dragCursor = null);
  }
  function Io(e6) {
    if (document.getElementsByClassName) {
      for (var t4 = document.getElementsByClassName("CodeMirror"), r3 = [], n4 = 0; n4 < t4.length; n4++) {
        var i5 = t4[n4].CodeMirror;
        i5 && r3.push(i5);
      }
      r3.length && r3[0].operation((function() {
        for (var t5 = 0; t5 < r3.length; t5++) e6(r3[t5]);
      }));
    }
  }
  var Ho = false;
  function Bo(e6) {
    var t4 = e6.display;
    t4.cachedCharWidth = t4.cachedTextHeight = t4.cachedPaddingH = null, t4.scrollbarsClipped = false, e6.setSize();
  }
  for (var $o = { 3: "Pause", 8: "Backspace", 9: "Tab", 13: "Enter", 16: "Shift", 17: "Ctrl", 18: "Alt", 19: "Pause", 20: "CapsLock", 27: "Esc", 32: "Space", 33: "PageUp", 34: "PageDown", 35: "End", 36: "Home", 37: "Left", 38: "Up", 39: "Right", 40: "Down", 44: "PrintScrn", 45: "Insert", 46: "Delete", 59: ";", 61: "=", 91: "Mod", 92: "Mod", 93: "Mod", 106: "*", 107: "=", 109: "-", 110: ".", 111: "/", 145: "ScrollLock", 173: "-", 186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\", 221: "]", 222: "'", 224: "Mod", 63232: "Up", 63233: "Down", 63234: "Left", 63235: "Right", 63272: "Delete", 63273: "Home", 63275: "End", 63276: "PageUp", 63277: "PageDown", 63302: "Insert" }, Ro = 0; Ro < 10; Ro++) $o[Ro + 48] = $o[Ro + 96] = Ro + "";
  for (var Zo = 65; Zo <= 90; Zo++) $o[Zo] = String.fromCharCode(Zo);
  for (var jo = 1; jo <= 12; jo++) $o[jo + 111] = $o[jo + 63235] = "F" + jo;
  var Uo = {};
  function Vo(e6) {
    var t4, r3, n4, i5, o4 = e6.split(/-(?!$)/);
    e6 = o4[o4.length - 1];
    for (var a2 = 0; a2 < o4.length - 1; a2++) {
      var l4 = o4[a2];
      if (/^(cmd|meta|m)$/i.test(l4)) i5 = true;
      else if (/^a(lt)?$/i.test(l4)) t4 = true;
      else if (/^(c|ctrl|control)$/i.test(l4)) r3 = true;
      else {
        if (!/^s(hift)?$/i.test(l4)) throw Error("Unrecognized modifier name: " + l4);
        n4 = true;
      }
    }
    return t4 && (e6 = "Alt-" + e6), r3 && (e6 = "Ctrl-" + e6), i5 && (e6 = "Cmd-" + e6), n4 && (e6 = "Shift-" + e6), e6;
  }
  function Ko(e6) {
    var t4 = {};
    for (var r3 in e6) if (e6.hasOwnProperty(r3)) {
      var n4 = e6[r3];
      if (/^(name|fallthrough|(de|at)tach)$/.test(r3)) continue;
      if ("..." == n4) {
        delete e6[r3];
        continue;
      }
      for (var i5 = Q(r3.split(" "), Vo), o4 = 0; o4 < i5.length; o4++) {
        var a2 = void 0, l4 = void 0;
        o4 == i5.length - 1 ? (l4 = i5.join(" "), a2 = n4) : (l4 = i5.slice(0, o4 + 1).join(" "), a2 = "...");
        var s3 = t4[l4];
        if (s3) {
          if (s3 != a2) throw Error("Inconsistent bindings for " + l4);
        } else t4[l4] = a2;
      }
      delete e6[r3];
    }
    for (var c2 in t4) e6[c2] = t4[c2];
    return e6;
  }
  function Go(e6, t4, r3, n4) {
    var i5 = (t4 = Qo(t4)).call ? t4.call(e6, n4) : t4[e6];
    if (false === i5) return "nothing";
    if ("..." === i5) return "multi";
    if (null != i5 && r3(i5)) return "handled";
    if (t4.fallthrough) {
      if ("[object Array]" != Object.prototype.toString.call(t4.fallthrough)) return Go(e6, t4.fallthrough, r3, n4);
      for (var o4 = 0; o4 < t4.fallthrough.length; o4++) {
        var a2 = Go(e6, t4.fallthrough[o4], r3, n4);
        if (a2) return a2;
      }
    }
  }
  function qo(e6) {
    var t4 = "string" == typeof e6 ? e6 : $o[e6.keyCode];
    return "Ctrl" == t4 || "Alt" == t4 || "Shift" == t4 || "Mod" == t4;
  }
  function Xo(e6, t4, r3) {
    var n4 = e6;
    return t4.altKey && "Alt" != n4 && (e6 = "Alt-" + e6), (C ? t4.metaKey : t4.ctrlKey) && "Ctrl" != n4 && (e6 = "Ctrl-" + e6), (C ? t4.ctrlKey : t4.metaKey) && "Mod" != n4 && (e6 = "Cmd-" + e6), !r3 && t4.shiftKey && "Shift" != n4 && (e6 = "Shift-" + e6), e6;
  }
  function Yo(e6, t4) {
    if (f && 34 == e6.keyCode && e6.char) return false;
    var r3 = $o[e6.keyCode];
    return null != r3 && !e6.altGraphKey && (3 == e6.keyCode && e6.code && (r3 = e6.code), Xo(r3, e6, t4));
  }
  function Qo(e6) {
    return "string" == typeof e6 ? Uo[e6] : e6;
  }
  function Jo(e6, t4) {
    for (var r3 = e6.doc.sel.ranges, n4 = [], i5 = 0; i5 < r3.length; i5++) {
      for (var o4 = t4(r3[i5]); n4.length && it(o4.from, Y(n4).to) <= 0; ) {
        var a2 = n4.pop();
        if (it(a2.from, o4.from) < 0) {
          o4.from = a2.from;
          break;
        }
      }
      n4.push(o4);
    }
    ri(e6, (function() {
      for (var t5 = n4.length - 1; t5 >= 0; t5--) yo(e6.doc, "", n4[t5].from, n4[t5].to, "+delete");
      En(e6);
    }));
  }
  function ea(e6, t4, r3) {
    var n4 = le(e6.text, t4 + r3, r3);
    return n4 < 0 || n4 > e6.text.length ? null : n4;
  }
  function ta(e6, t4, r3) {
    var n4 = ea(e6, t4.ch, r3);
    return null == n4 ? null : new nt(t4.line, n4, r3 < 0 ? "after" : "before");
  }
  function ra(e6, t4, r3, n4, i5) {
    if (e6) {
      "rtl" == t4.doc.direction && (i5 = -i5);
      var o4 = fe(r3, t4.doc.direction);
      if (o4) {
        var a2, l4 = i5 < 0 ? Y(o4) : o4[0], s3 = i5 < 0 == (1 == l4.level) ? "after" : "before";
        if (l4.level > 0 || "rtl" == t4.doc.direction) {
          var c2 = Er(t4, r3);
          a2 = i5 < 0 ? r3.text.length - 1 : 0;
          var u2 = Dr(t4, c2, a2).top;
          a2 = se((function(e7) {
            return Dr(t4, c2, e7).top == u2;
          }), i5 < 0 == (1 == l4.level) ? l4.from : l4.to - 1, a2), "before" == s3 && (a2 = ea(r3, a2, 1));
        } else a2 = i5 < 0 ? l4.to : l4.from;
        return new nt(n4, a2, s3);
      }
    }
    return new nt(n4, i5 < 0 ? r3.text.length : 0, i5 < 0 ? "before" : "after");
  }
  Uo.basic = { Left: "goCharLeft", Right: "goCharRight", Up: "goLineUp", Down: "goLineDown", End: "goLineEnd", Home: "goLineStartSmart", PageUp: "goPageUp", PageDown: "goPageDown", Delete: "delCharAfter", Backspace: "delCharBefore", "Shift-Backspace": "delCharBefore", Tab: "defaultTab", "Shift-Tab": "indentAuto", Enter: "newlineAndIndent", Insert: "toggleOverwrite", Esc: "singleSelection" }, Uo.pcDefault = { "Ctrl-A": "selectAll", "Ctrl-D": "deleteLine", "Ctrl-Z": "undo", "Shift-Ctrl-Z": "redo", "Ctrl-Y": "redo", "Ctrl-Home": "goDocStart", "Ctrl-End": "goDocEnd", "Ctrl-Up": "goLineUp", "Ctrl-Down": "goLineDown", "Ctrl-Left": "goGroupLeft", "Ctrl-Right": "goGroupRight", "Alt-Left": "goLineStart", "Alt-Right": "goLineEnd", "Ctrl-Backspace": "delGroupBefore", "Ctrl-Delete": "delGroupAfter", "Ctrl-S": "save", "Ctrl-F": "find", "Ctrl-G": "findNext", "Shift-Ctrl-G": "findPrev", "Shift-Ctrl-F": "replace", "Shift-Ctrl-R": "replaceAll", "Ctrl-[": "indentLess", "Ctrl-]": "indentMore", "Ctrl-U": "undoSelection", "Shift-Ctrl-U": "redoSelection", "Alt-U": "redoSelection", fallthrough: "basic" }, Uo.emacsy = { "Ctrl-F": "goCharRight", "Ctrl-B": "goCharLeft", "Ctrl-P": "goLineUp", "Ctrl-N": "goLineDown", "Ctrl-A": "goLineStart", "Ctrl-E": "goLineEnd", "Ctrl-V": "goPageDown", "Shift-Ctrl-V": "goPageUp", "Ctrl-D": "delCharAfter", "Ctrl-H": "delCharBefore", "Alt-Backspace": "delWordBefore", "Ctrl-K": "killLine", "Ctrl-T": "transposeChars", "Ctrl-O": "openLine" }, Uo.macDefault = { "Cmd-A": "selectAll", "Cmd-D": "deleteLine", "Cmd-Z": "undo", "Shift-Cmd-Z": "redo", "Cmd-Y": "redo", "Cmd-Home": "goDocStart", "Cmd-Up": "goDocStart", "Cmd-End": "goDocEnd", "Cmd-Down": "goDocEnd", "Alt-Left": "goGroupLeft", "Alt-Right": "goGroupRight", "Cmd-Left": "goLineLeft", "Cmd-Right": "goLineRight", "Alt-Backspace": "delGroupBefore", "Ctrl-Alt-Backspace": "delGroupAfter", "Alt-Delete": "delGroupAfter", "Cmd-S": "save", "Cmd-F": "find", "Cmd-G": "findNext", "Shift-Cmd-G": "findPrev", "Cmd-Alt-F": "replace", "Shift-Cmd-Alt-F": "replaceAll", "Cmd-[": "indentLess", "Cmd-]": "indentMore", "Cmd-Backspace": "delWrappedLineLeft", "Cmd-Delete": "delWrappedLineRight", "Cmd-U": "undoSelection", "Shift-Cmd-U": "redoSelection", "Ctrl-Up": "goDocStart", "Ctrl-Down": "goDocEnd", fallthrough: ["basic", "emacsy"] }, Uo.default = b ? Uo.macDefault : Uo.pcDefault;
  var na = { selectAll: uo, singleSelection: function(e6) {
    return e6.setSelection(e6.getCursor("anchor"), e6.getCursor("head"), U);
  }, killLine: function(e6) {
    return Jo(e6, (function(t4) {
      if (t4.empty()) {
        var r3 = qe(e6.doc, t4.head.line).text.length;
        return t4.head.ch == r3 && t4.head.line < e6.lastLine() ? { from: t4.head, to: nt(t4.head.line + 1, 0) } : { from: t4.head, to: nt(t4.head.line, r3) };
      }
      return { from: t4.from(), to: t4.to() };
    }));
  }, deleteLine: function(e6) {
    return Jo(e6, (function(t4) {
      return { from: nt(t4.from().line, 0), to: ut(e6.doc, nt(t4.to().line + 1, 0)) };
    }));
  }, delLineLeft: function(e6) {
    return Jo(e6, (function(e7) {
      return { from: nt(e7.from().line, 0), to: e7.from() };
    }));
  }, delWrappedLineLeft: function(e6) {
    return Jo(e6, (function(t4) {
      var r3 = e6.charCoords(t4.head, "div").top + 5;
      return { from: e6.coordsChar({ left: 0, top: r3 }, "div"), to: t4.from() };
    }));
  }, delWrappedLineRight: function(e6) {
    return Jo(e6, (function(t4) {
      var r3 = e6.charCoords(t4.head, "div").top + 5, n4 = e6.coordsChar({ left: e6.display.lineDiv.offsetWidth + 100, top: r3 }, "div");
      return { from: t4.from(), to: n4 };
    }));
  }, undo: function(e6) {
    return e6.undo();
  }, redo: function(e6) {
    return e6.redo();
  }, undoSelection: function(e6) {
    return e6.undoSelection();
  }, redoSelection: function(e6) {
    return e6.redoSelection();
  }, goDocStart: function(e6) {
    return e6.extendSelection(nt(e6.firstLine(), 0));
  }, goDocEnd: function(e6) {
    return e6.extendSelection(nt(e6.lastLine()));
  }, goLineStart: function(e6) {
    return e6.extendSelectionsBy((function(t4) {
      return ia(e6, t4.head.line);
    }), { origin: "+move", bias: 1 });
  }, goLineStartSmart: function(e6) {
    return e6.extendSelectionsBy((function(t4) {
      return oa(e6, t4.head);
    }), { origin: "+move", bias: 1 });
  }, goLineEnd: function(e6) {
    return e6.extendSelectionsBy((function(t4) {
      return (function(e7, t5) {
        var r3 = qe(e7.doc, t5), n4 = (function(e8) {
          for (var t6; t6 = It(e8); ) e8 = t6.find(1, true).line;
          return e8;
        })(r3);
        return n4 != r3 && (t5 = Je(n4)), ra(true, e7, r3, t5, -1);
      })(e6, t4.head.line);
    }), { origin: "+move", bias: -1 });
  }, goLineRight: function(e6) {
    return e6.extendSelectionsBy((function(t4) {
      var r3 = e6.cursorCoords(t4.head, "div").top + 5;
      return e6.coordsChar({ left: e6.display.lineDiv.offsetWidth + 100, top: r3 }, "div");
    }), K);
  }, goLineLeft: function(e6) {
    return e6.extendSelectionsBy((function(t4) {
      var r3 = e6.cursorCoords(t4.head, "div").top + 5;
      return e6.coordsChar({ left: 0, top: r3 }, "div");
    }), K);
  }, goLineLeftSmart: function(e6) {
    return e6.extendSelectionsBy((function(t4) {
      var r3 = e6.cursorCoords(t4.head, "div").top + 5, n4 = e6.coordsChar({ left: 0, top: r3 }, "div");
      return n4.ch < e6.getLine(n4.line).search(/\S/) ? oa(e6, t4.head) : n4;
    }), K);
  }, goLineUp: function(e6) {
    return e6.moveV(-1, "line");
  }, goLineDown: function(e6) {
    return e6.moveV(1, "line");
  }, goPageUp: function(e6) {
    return e6.moveV(-1, "page");
  }, goPageDown: function(e6) {
    return e6.moveV(1, "page");
  }, goCharLeft: function(e6) {
    return e6.moveH(-1, "char");
  }, goCharRight: function(e6) {
    return e6.moveH(1, "char");
  }, goColumnLeft: function(e6) {
    return e6.moveH(-1, "column");
  }, goColumnRight: function(e6) {
    return e6.moveH(1, "column");
  }, goWordLeft: function(e6) {
    return e6.moveH(-1, "word");
  }, goGroupRight: function(e6) {
    return e6.moveH(1, "group");
  }, goGroupLeft: function(e6) {
    return e6.moveH(-1, "group");
  }, goWordRight: function(e6) {
    return e6.moveH(1, "word");
  }, delCharBefore: function(e6) {
    return e6.deleteH(-1, "codepoint");
  }, delCharAfter: function(e6) {
    return e6.deleteH(1, "char");
  }, delWordBefore: function(e6) {
    return e6.deleteH(-1, "word");
  }, delWordAfter: function(e6) {
    return e6.deleteH(1, "word");
  }, delGroupBefore: function(e6) {
    return e6.deleteH(-1, "group");
  }, delGroupAfter: function(e6) {
    return e6.deleteH(1, "group");
  }, indentAuto: function(e6) {
    return e6.indentSelection("smart");
  }, indentMore: function(e6) {
    return e6.indentSelection("add");
  }, indentLess: function(e6) {
    return e6.indentSelection("subtract");
  }, insertTab: function(e6) {
    return e6.replaceSelection("	");
  }, insertSoftTab: function(e6) {
    for (var t4 = [], r3 = e6.listSelections(), n4 = e6.options.tabSize, i5 = 0; i5 < r3.length; i5++) {
      var o4 = r3[i5].from(), a2 = $(e6.getLine(o4.line), o4.ch, n4);
      t4.push(X(n4 - a2 % n4));
    }
    e6.replaceSelections(t4);
  }, defaultTab: function(e6) {
    e6.somethingSelected() ? e6.indentSelection("add") : e6.execCommand("insertTab");
  }, transposeChars: function(e6) {
    return ri(e6, (function() {
      for (var t4 = e6.listSelections(), r3 = [], n4 = 0; n4 < t4.length; n4++) if (t4[n4].empty()) {
        var i5 = t4[n4].head, o4 = qe(e6.doc, i5.line).text;
        if (o4) {
          if (i5.ch == o4.length && (i5 = new nt(i5.line, i5.ch - 1)), i5.ch > 0) i5 = new nt(i5.line, i5.ch + 1), e6.replaceRange(o4.charAt(i5.ch - 1) + o4.charAt(i5.ch - 2), nt(i5.line, i5.ch - 2), i5, "+transpose");
          else if (i5.line > e6.doc.first) {
            var a2 = qe(e6.doc, i5.line - 1).text;
            a2 && (i5 = new nt(i5.line, 1), e6.replaceRange(o4.charAt(0) + e6.doc.lineSeparator() + a2.charAt(a2.length - 1), nt(i5.line - 1, a2.length - 1), i5, "+transpose"));
          }
        }
        r3.push(new Ai(i5, i5));
      }
      e6.setSelections(r3);
    }));
  }, newlineAndIndent: function(e6) {
    return ri(e6, (function() {
      for (var t4 = e6.listSelections(), r3 = t4.length - 1; r3 >= 0; r3--) e6.replaceRange(e6.doc.lineSeparator(), t4[r3].anchor, t4[r3].head, "+input");
      t4 = e6.listSelections();
      for (var n4 = 0; n4 < t4.length; n4++) e6.indentLine(t4[n4].from().line, null, true);
      En(e6);
    }));
  }, openLine: function(e6) {
    return e6.replaceSelection("\n", "start");
  }, toggleOverwrite: function(e6) {
    return e6.toggleOverwrite();
  } };
  function ia(e6, t4) {
    var r3 = qe(e6.doc, t4), n4 = $t(r3);
    return n4 != r3 && (t4 = Je(n4)), ra(true, e6, n4, t4, 1);
  }
  function oa(e6, t4) {
    var r3 = ia(e6, t4.line), n4 = qe(e6.doc, r3.line), i5 = fe(n4, e6.doc.direction);
    if (!i5 || 0 == i5[0].level) {
      var o4 = Math.max(r3.ch, n4.text.search(/\S/)), a2 = t4.line == r3.line && t4.ch <= o4 && t4.ch;
      return nt(r3.line, a2 ? 0 : o4, r3.sticky);
    }
    return r3;
  }
  function aa(e6, t4, r3) {
    if ("string" == typeof t4 && !(t4 = na[t4])) return false;
    e6.display.input.ensurePolled();
    var n4 = e6.display.shift, i5 = false;
    try {
      e6.isReadOnly() && (e6.state.suppressEdits = true), r3 && (e6.display.shift = false), i5 = t4(e6) != j;
    } finally {
      e6.display.shift = n4, e6.state.suppressEdits = false;
    }
    return i5;
  }
  var la = new R();
  function sa(e6, t4, r3, n4) {
    var i5 = e6.state.keySeq;
    if (i5) {
      if (qo(t4)) return "handled";
      if (/\'$/.test(t4) ? e6.state.keySeq = null : la.set(50, (function() {
        e6.state.keySeq == i5 && (e6.state.keySeq = null, e6.display.input.reset());
      })), ca(e6, i5 + " " + t4, r3, n4)) return true;
    }
    return ca(e6, t4, r3, n4);
  }
  function ca(e6, t4, r3, n4) {
    var i5 = (function(e7, t5, r4) {
      for (var n5 = 0; n5 < e7.state.keyMaps.length; n5++) {
        var i6 = Go(t5, e7.state.keyMaps[n5], r4, e7);
        if (i6) return i6;
      }
      return e7.options.extraKeys && Go(t5, e7.options.extraKeys, r4, e7) || Go(t5, e7.options.keyMap, r4, e7);
    })(e6, t4, n4);
    return "multi" == i5 && (e6.state.keySeq = t4), "handled" == i5 && ur(e6, "keyHandled", e6, t4, r3), "handled" != i5 && "multi" != i5 || (xe(r3), Sn(e6)), !!i5;
  }
  function ua(e6, t4) {
    var r3 = Yo(t4, true);
    return !!r3 && (t4.shiftKey && !e6.state.keySeq ? sa(e6, "Shift-" + r3, t4, (function(t5) {
      return aa(e6, t5, true);
    })) || sa(e6, r3, t4, (function(t5) {
      if ("string" == typeof t5 ? /^go[A-Z]/.test(t5) : t5.motion) return aa(e6, t5);
    })) : sa(e6, r3, t4, (function(t5) {
      return aa(e6, t5);
    })));
  }
  var da = null;
  function fa(e6) {
    var t4 = this;
    if (!(e6.target && e6.target != t4.display.input.getField() || (t4.curOp.focus = P(F(t4)), ye(t4, e6)))) {
      a && l3 < 11 && 27 == e6.keyCode && (e6.returnValue = false);
      var n4 = e6.keyCode;
      t4.display.shift = 16 == n4 || e6.shiftKey;
      var i5 = ua(t4, e6);
      f && (da = i5 ? n4 : null, i5 || 88 != n4 || We || !(b ? e6.metaKey : e6.ctrlKey) || t4.replaceSelection("", null, "cut")), r2 && !b && !i5 && 46 == n4 && e6.shiftKey && !e6.ctrlKey && document.execCommand && document.execCommand("cut"), 18 != n4 || /\bCodeMirror-crosshair\b/.test(t4.display.lineDiv.className) || (function(e7) {
        var t5 = e7.display.lineDiv;
        function r3(e8) {
          18 != e8.keyCode && e8.altKey || (A2(t5, "CodeMirror-crosshair"), ge(document, "keyup", r3), ge(document, "mouseover", r3));
        }
        E(t5, "CodeMirror-crosshair"), pe(document, "keyup", r3), pe(document, "mouseover", r3);
      })(t4);
    }
  }
  function ha(e6) {
    16 == e6.keyCode && (this.doc.sel.shift = false), ye(this, e6);
  }
  function pa(e6) {
    var t4 = this;
    if (!(e6.target && e6.target != t4.display.input.getField() || Sr(t4.display, e6) || ye(t4, e6) || e6.ctrlKey && !e6.altKey || b && e6.metaKey)) {
      var r3 = e6.keyCode, n4 = e6.charCode;
      if (f && r3 == da) return da = null, void xe(e6);
      if (!f || e6.which && !(e6.which < 10) || !ua(t4, e6)) {
        var i5 = String.fromCharCode(null == n4 ? r3 : n4);
        "\b" != i5 && ((function(e7, t5, r4) {
          return sa(e7, "'" + r4 + "'", t5, (function(t6) {
            return aa(e7, t6, true);
          }));
        })(t4, e6, i5) || t4.display.input.onKeyPress(e6));
      }
    }
  }
  var ma, ga, va = function(e6, t4, r3) {
    this.time = e6, this.pos = t4, this.button = r3;
  };
  function ya(e6) {
    var t4 = this, r3 = t4.display;
    if (!(ye(t4, e6) || r3.activeTouch && r3.input.supportsTouch())) {
      if (r3.input.ensurePolled(), r3.shift = e6.shiftKey, Sr(r3, e6)) s2 || (r3.scroller.draggable = false, setTimeout((function() {
        return r3.scroller.draggable = true;
      }), 100));
      else if (!ka(t4, e6)) {
        var n4 = fn2(t4, e6), i5 = Ae(e6), o4 = n4 ? (function(e7, t5) {
          var r4 = +/* @__PURE__ */ new Date();
          return ga && ga.compare(r4, e7, t5) ? (ma = ga = null, "triple") : ma && ma.compare(r4, e7, t5) ? (ga = new va(r4, e7, t5), ma = null, "double") : (ma = new va(r4, e7, t5), ga = null, "single");
        })(n4, i5) : "single";
        I(t4).focus(), 1 == i5 && t4.state.selectingText && t4.state.selectingText(e6), n4 && (function(e7, t5, r4, n5, i6) {
          var o5 = "Click";
          return "double" == n5 ? o5 = "Double" + o5 : "triple" == n5 && (o5 = "Triple" + o5), sa(e7, Xo(o5 = (1 == t5 ? "Left" : 2 == t5 ? "Middle" : "Right") + o5, i6), i6, (function(t6) {
            if ("string" == typeof t6 && (t6 = na[t6]), !t6) return false;
            var n6 = false;
            try {
              e7.isReadOnly() && (e7.state.suppressEdits = true), n6 = t6(e7, r4) != j;
            } finally {
              e7.state.suppressEdits = false;
            }
            return n6;
          }));
        })(t4, i5, n4, o4, e6) || (1 == i5 ? n4 ? (function(e7, t5, r4, n5) {
          a ? setTimeout(H(Tn, e7), 0) : e7.curOp.focus = P(F(e7));
          var i6, o5 = (function(e8, t6, r5) {
            var n6 = e8.getOption("configureMouse"), i7 = n6 ? n6(e8, t6, r5) : {};
            if (null == i7.unit) {
              var o6 = w ? r5.shiftKey && r5.metaKey : r5.altKey;
              i7.unit = o6 ? "rectangle" : "single" == t6 ? "char" : "double" == t6 ? "word" : "line";
            }
            return (null == i7.extend || e8.doc.extend) && (i7.extend = e8.doc.extend || r5.shiftKey), null == i7.addNew && (i7.addNew = b ? r5.metaKey : r5.ctrlKey), null == i7.moveOnDrag && (i7.moveOnDrag = !(b ? r5.altKey : r5.ctrlKey)), i7;
          })(e7, r4, n5), c2 = e7.doc.sel;
          e7.options.dragDrop && Oe && !e7.isReadOnly() && "single" == r4 && (i6 = c2.contains(t5)) > -1 && (it((i6 = c2.ranges[i6]).from(), t5) < 0 || t5.xRel > 0) && (it(i6.to(), t5) > 0 || t5.xRel < 0) ? (function(e8, t6, r5, n6) {
            var i7 = e8.display, o6 = false, c3 = ni(e8, (function(t7) {
              s2 && (i7.scroller.draggable = false), e8.state.draggingText = false, e8.state.delayingBlurEvent && (e8.hasFocus() ? e8.state.delayingBlurEvent = false : Ln(e8)), ge(i7.wrapper.ownerDocument, "mouseup", c3), ge(i7.wrapper.ownerDocument, "mousemove", u2), ge(i7.scroller, "dragstart", d2), ge(i7.scroller, "drop", c3), o6 || (xe(t7), n6.addNew || Yi(e8.doc, r5, null, null, n6.extend), s2 && !h || a && 9 == l3 ? setTimeout((function() {
                i7.wrapper.ownerDocument.body.focus({ preventScroll: true }), i7.input.focus();
              }), 20) : i7.input.focus());
            })), u2 = function(e9) {
              o6 = o6 || Math.abs(t6.clientX - e9.clientX) + Math.abs(t6.clientY - e9.clientY) >= 10;
            }, d2 = function() {
              return o6 = true;
            };
            s2 && (i7.scroller.draggable = true), e8.state.draggingText = c3, c3.copy = !n6.moveOnDrag, pe(i7.wrapper.ownerDocument, "mouseup", c3), pe(i7.wrapper.ownerDocument, "mousemove", u2), pe(i7.scroller, "dragstart", d2), pe(i7.scroller, "drop", c3), e8.state.delayingBlurEvent = true, setTimeout((function() {
              return i7.input.focus();
            }), 20), i7.scroller.dragDrop && i7.scroller.dragDrop();
          })(e7, n5, t5, o5) : (function(e8, t6, r5, n6) {
            a && Ln(e8);
            var i7 = e8.display, o6 = e8.doc;
            xe(t6);
            var l4, s3, c3 = o6.sel, u2 = c3.ranges;
            if (n6.addNew && !n6.extend ? (s3 = o6.sel.contains(r5), l4 = s3 > -1 ? u2[s3] : new Ai(r5, r5)) : (l4 = o6.sel.primary(), s3 = o6.sel.primIndex), "rectangle" == n6.unit) n6.addNew || (l4 = new Ai(r5, r5)), r5 = fn2(e8, t6, true, true), s3 = -1;
            else {
              var d2 = ba(e8, r5, n6.unit);
              l4 = n6.extend ? Xi(l4, d2.anchor, d2.head, n6.extend) : d2;
            }
            n6.addNew ? -1 == s3 ? (s3 = u2.length, ro(o6, Mi(e8, u2.concat([l4]), s3), { scroll: false, origin: "*mouse" })) : u2.length > 1 && u2[s3].empty() && "char" == n6.unit && !n6.extend ? (ro(o6, Mi(e8, u2.slice(0, s3).concat(u2.slice(s3 + 1)), 0), { scroll: false, origin: "*mouse" }), c3 = o6.sel) : Ji(o6, s3, l4, V) : (s3 = 0, ro(o6, new Li([l4], 0), V), c3 = o6.sel);
            var f2 = r5;
            var h2 = i7.wrapper.getBoundingClientRect(), p2 = 0;
            function m2(t7) {
              var a2 = ++p2, u3 = fn2(e8, t7, true, "rectangle" == n6.unit);
              if (u3) if (0 != it(u3, f2)) {
                e8.curOp.focus = P(F(e8)), (function(t8) {
                  if (0 != it(f2, t8)) if (f2 = t8, "rectangle" == n6.unit) {
                    for (var i8 = [], a3 = e8.options.tabSize, u4 = $(qe(o6, r5.line).text, r5.ch, a3), d4 = $(qe(o6, t8.line).text, t8.ch, a3), h3 = Math.min(u4, d4), p3 = Math.max(u4, d4), m3 = Math.min(r5.line, t8.line), g4 = Math.min(e8.lastLine(), Math.max(r5.line, t8.line)); m3 <= g4; m3++) {
                      var v3 = qe(o6, m3).text, y3 = G(v3, h3, a3);
                      h3 == p3 ? i8.push(new Ai(nt(m3, y3), nt(m3, y3))) : v3.length > y3 && i8.push(new Ai(nt(m3, y3), nt(m3, G(v3, p3, a3))));
                    }
                    i8.length || i8.push(new Ai(r5, r5)), ro(o6, Mi(e8, c3.ranges.slice(0, s3).concat(i8), s3), { origin: "*mouse", scroll: false }), e8.scrollIntoView(t8);
                  } else {
                    var b2, w2 = l4, k2 = ba(e8, t8, n6.unit), x3 = w2.anchor;
                    it(k2.anchor, x3) > 0 ? (b2 = k2.head, x3 = st(w2.from(), k2.anchor)) : (b2 = k2.anchor, x3 = lt(w2.to(), k2.head));
                    var C2 = c3.ranges.slice(0);
                    C2[s3] = (function(e9, t9) {
                      var r6 = t9.anchor, n7 = t9.head, i9 = qe(e9.doc, r6.line);
                      if (0 == it(r6, n7) && r6.sticky == n7.sticky) return t9;
                      var o7 = fe(i9);
                      if (!o7) return t9;
                      var a4 = ue(o7, r6.ch, r6.sticky), l5 = o7[a4];
                      if (l5.from != r6.ch && l5.to != r6.ch) return t9;
                      var s4, c4 = a4 + (l5.from == r6.ch == (1 != l5.level) ? 0 : 1);
                      if (0 == c4 || c4 == o7.length) return t9;
                      if (n7.line != r6.line) s4 = (n7.line - r6.line) * ("ltr" == e9.doc.direction ? 1 : -1) > 0;
                      else {
                        var u5 = ue(o7, n7.ch, n7.sticky), d5 = u5 - a4 || (n7.ch - r6.ch) * (1 == l5.level ? -1 : 1);
                        s4 = u5 == c4 - 1 || u5 == c4 ? d5 < 0 : d5 > 0;
                      }
                      var f3 = o7[c4 + (s4 ? -1 : 0)], h4 = s4 == (1 == f3.level), p4 = h4 ? f3.from : f3.to, m4 = h4 ? "after" : "before";
                      return r6.ch == p4 && r6.sticky == m4 ? t9 : new Ai(new nt(r6.line, p4, m4), n7);
                    })(e8, new Ai(ut(o6, x3), b2)), ro(o6, Mi(e8, C2, s3), V);
                  }
                })(u3);
                var d3 = _n(i7, o6);
                (u3.line >= d3.to || u3.line < d3.from) && setTimeout(ni(e8, (function() {
                  p2 == a2 && m2(t7);
                })), 150);
              } else {
                var g3 = t7.clientY < h2.top ? -20 : t7.clientY > h2.bottom ? 20 : 0;
                g3 && setTimeout(ni(e8, (function() {
                  p2 == a2 && (i7.scroller.scrollTop += g3, m2(t7));
                })), 50);
              }
            }
            function g2(t7) {
              e8.state.selectingText = false, p2 = 1 / 0, t7 && (xe(t7), i7.input.focus()), ge(i7.wrapper.ownerDocument, "mousemove", v2), ge(i7.wrapper.ownerDocument, "mouseup", y2), o6.history.lastSelOrigin = null;
            }
            var v2 = ni(e8, (function(e9) {
              0 !== e9.buttons && Ae(e9) ? m2(e9) : g2(e9);
            })), y2 = ni(e8, g2);
            e8.state.selectingText = y2, pe(i7.wrapper.ownerDocument, "mousemove", v2), pe(i7.wrapper.ownerDocument, "mouseup", y2);
          })(e7, n5, t5, o5);
        })(t4, n4, o4, e6) : Le(e6) == r3.scroller && xe(e6) : 2 == i5 ? (n4 && Yi(t4.doc, n4), setTimeout((function() {
          return r3.input.focus();
        }), 20)) : 3 == i5 && (S ? t4.display.input.onContextMenu(e6) : Ln(t4)));
      }
    }
  }
  function ba(e6, t4, r3) {
    if ("char" == r3) return new Ai(t4, t4);
    if ("word" == r3) return e6.findWordAt(t4);
    if ("line" == r3) return new Ai(nt(t4.line, 0), ut(e6.doc, nt(t4.line + 1, 0)));
    var n4 = r3(e6, t4);
    return new Ai(n4.from, n4.to);
  }
  function wa(e6, t4, r3, n4) {
    var i5, o4;
    if (t4.touches) i5 = t4.touches[0].clientX, o4 = t4.touches[0].clientY;
    else try {
      i5 = t4.clientX, o4 = t4.clientY;
    } catch (e7) {
      return false;
    }
    if (i5 >= Math.floor(e6.display.gutters.getBoundingClientRect().right)) return false;
    n4 && xe(t4);
    var a2 = e6.display, l4 = a2.lineDiv.getBoundingClientRect();
    if (o4 > l4.bottom || !we(e6, r3)) return Se(t4);
    o4 -= l4.top - a2.viewOffset;
    for (var s3 = 0; s3 < e6.display.gutterSpecs.length; ++s3) {
      var c2 = a2.gutters.childNodes[s3];
      if (c2 && c2.getBoundingClientRect().right >= i5) return ve(e6, r3, e6, et(e6.doc, o4), e6.display.gutterSpecs[s3].className, t4), Se(t4);
    }
  }
  function ka(e6, t4) {
    return wa(e6, t4, "gutterClick", true);
  }
  function xa(e6, t4) {
    Sr(e6.display, t4) || (function(e7, t5) {
      return !!we(e7, "gutterContextMenu") && wa(e7, t5, "gutterContextMenu", false);
    })(e6, t4) || ye(e6, t4, "contextmenu") || S || e6.display.input.onContextMenu(t4);
  }
  function Ca(e6) {
    e6.display.wrapper.className = e6.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") + e6.options.theme.replace(/(^|\s)\s*/g, " cm-s-"), Rr(e6);
  }
  va.prototype.compare = function(e6, t4, r3) {
    return this.time + 400 > e6 && 0 == it(t4, this.pos) && r3 == this.button;
  };
  var Sa = { toString: function() {
    return "CodeMirror.Init";
  } }, Ta = {}, La = {};
  function Aa(e6, t4, r3) {
    if (!t4 != !(r3 && r3 != Sa)) {
      var n4 = e6.display.dragFunctions, i5 = t4 ? pe : ge;
      i5(e6.display.scroller, "dragstart", n4.start), i5(e6.display.scroller, "dragenter", n4.enter), i5(e6.display.scroller, "dragover", n4.over), i5(e6.display.scroller, "dragleave", n4.leave), i5(e6.display.scroller, "drop", n4.drop);
    }
  }
  function Ma(e6) {
    e6.options.lineWrapping ? (E(e6.display.wrapper, "CodeMirror-wrap"), e6.display.sizer.style.minWidth = "", e6.display.sizerWidth = null) : (A2(e6.display.wrapper, "CodeMirror-wrap"), Gt(e6)), dn(e6), pn(e6), Rr(e6), setTimeout((function() {
      return jn(e6);
    }), 100);
  }
  function za(e6, t4) {
    var r3 = this;
    if (!(this instanceof za)) return new za(e6, t4);
    this.options = t4 = t4 ? B(t4) : {}, B(Ta, t4, false);
    var n4 = t4.value;
    "string" == typeof n4 ? n4 = new Eo(n4, t4.mode, null, t4.lineSeparator, t4.direction) : t4.mode && (n4.modeOption = t4.mode), this.doc = n4;
    var i5 = new za.inputStyles[t4.inputStyle](this), o4 = this.display = new wi(e6, n4, i5, t4);
    for (var c2 in o4.wrapper.CodeMirror = this, Ca(this), t4.lineWrapping && (this.display.wrapper.className += " CodeMirror-wrap"), Kn(this), this.state = { keyMaps: [], overlays: [], modeGen: 0, overwrite: false, delayingBlurEvent: false, focused: false, suppressEdits: false, pasteIncoming: -1, cutIncoming: -1, selectingText: false, draggingText: false, highlight: new R(), keySeq: null, specialChars: null }, t4.autofocus && !y && o4.input.focus(), a && l3 < 11 && setTimeout((function() {
      return r3.display.input.reset(true);
    }), 20), (function(e7) {
      var t5 = e7.display;
      pe(t5.scroller, "mousedown", ni(e7, ya)), pe(t5.scroller, "dblclick", a && l3 < 11 ? ni(e7, (function(t6) {
        if (!ye(e7, t6)) {
          var r5 = fn2(e7, t6);
          if (r5 && !ka(e7, t6) && !Sr(e7.display, t6)) {
            xe(t6);
            var n6 = e7.findWordAt(r5);
            Yi(e7.doc, n6.anchor, n6.head);
          }
        }
      })) : function(t6) {
        return ye(e7, t6) || xe(t6);
      }), pe(t5.scroller, "contextmenu", (function(t6) {
        return xa(e7, t6);
      })), pe(t5.input.getField(), "contextmenu", (function(r5) {
        t5.scroller.contains(r5.target) || xa(e7, r5);
      }));
      var r4, n5 = { end: 0 };
      function i6() {
        t5.activeTouch && (r4 = setTimeout((function() {
          return t5.activeTouch = null;
        }), 1e3), (n5 = t5.activeTouch).end = +/* @__PURE__ */ new Date());
      }
      function o5(e8, t6) {
        if (null == t6.left) return true;
        var r5 = t6.left - e8.left, n6 = t6.top - e8.top;
        return r5 * r5 + n6 * n6 > 400;
      }
      pe(t5.scroller, "touchstart", (function(i7) {
        if (!ye(e7, i7) && !(function(e8) {
          if (1 != e8.touches.length) return false;
          var t6 = e8.touches[0];
          return t6.radiusX <= 1 && t6.radiusY <= 1;
        })(i7) && !ka(e7, i7)) {
          t5.input.ensurePolled(), clearTimeout(r4);
          var o6 = +/* @__PURE__ */ new Date();
          t5.activeTouch = { start: o6, moved: false, prev: o6 - n5.end <= 300 ? n5 : null }, 1 == i7.touches.length && (t5.activeTouch.left = i7.touches[0].pageX, t5.activeTouch.top = i7.touches[0].pageY);
        }
      })), pe(t5.scroller, "touchmove", (function() {
        t5.activeTouch && (t5.activeTouch.moved = true);
      })), pe(t5.scroller, "touchend", (function(r5) {
        var n6 = t5.activeTouch;
        if (n6 && !Sr(t5, r5) && null != n6.left && !n6.moved && /* @__PURE__ */ new Date() - n6.start < 300) {
          var a2, l4 = e7.coordsChar(t5.activeTouch, "page");
          a2 = !n6.prev || o5(n6, n6.prev) ? new Ai(l4, l4) : !n6.prev.prev || o5(n6, n6.prev.prev) ? e7.findWordAt(l4) : new Ai(nt(l4.line, 0), ut(e7.doc, nt(l4.line + 1, 0))), e7.setSelection(a2.anchor, a2.head), e7.focus(), xe(r5);
        }
        i6();
      })), pe(t5.scroller, "touchcancel", i6), pe(t5.scroller, "scroll", (function() {
        t5.scroller.clientHeight && (In(e7, t5.scroller.scrollTop), Bn(e7, t5.scroller.scrollLeft, true), ve(e7, "scroll", e7));
      })), pe(t5.scroller, "mousewheel", (function(t6) {
        return Ti(e7, t6);
      })), pe(t5.scroller, "DOMMouseScroll", (function(t6) {
        return Ti(e7, t6);
      })), pe(t5.wrapper, "scroll", (function() {
        return t5.wrapper.scrollTop = t5.wrapper.scrollLeft = 0;
      })), t5.dragFunctions = { enter: function(t6) {
        ye(e7, t6) || Te(t6);
      }, over: function(t6) {
        ye(e7, t6) || ((function(e8, t7) {
          var r5 = fn2(e8, t7);
          if (r5) {
            var n6 = document.createDocumentFragment();
            kn(e8, r5, n6), e8.display.dragCursor || (e8.display.dragCursor = O("div", null, "CodeMirror-cursors CodeMirror-dragcursors"), e8.display.lineSpace.insertBefore(e8.display.dragCursor, e8.display.cursorDiv)), z(e8.display.dragCursor, n6);
          }
        })(e7, t6), Te(t6));
      }, start: function(t6) {
        return (function(e8, t7) {
          if (a && (!e8.state.draggingText || +/* @__PURE__ */ new Date() - Do < 100)) Te(t7);
          else if (!ye(e8, t7) && !Sr(e8.display, t7) && (t7.dataTransfer.setData("Text", e8.getSelection()), t7.dataTransfer.effectAllowed = "copyMove", t7.dataTransfer.setDragImage && !h)) {
            var r5 = O("img", null, null, "position: fixed; left: 0; top: 0;");
            r5.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==", f && (r5.width = r5.height = 1, e8.display.wrapper.appendChild(r5), r5._top = r5.offsetTop), t7.dataTransfer.setDragImage(r5, 0, 0), f && r5.parentNode.removeChild(r5);
          }
        })(e7, t6);
      }, drop: ni(e7, Wo), leave: function(t6) {
        ye(e7, t6) || Fo(e7);
      } };
      var s3 = t5.input.getField();
      pe(s3, "keyup", (function(t6) {
        return ha.call(e7, t6);
      })), pe(s3, "keydown", ni(e7, fa)), pe(s3, "keypress", ni(e7, pa)), pe(s3, "focus", (function(t6) {
        return An(e7, t6);
      })), pe(s3, "blur", (function(t6) {
        return Mn(e7, t6);
      }));
    })(this), (function() {
      var e7;
      Ho || (pe(window, "resize", (function() {
        null == e7 && (e7 = setTimeout((function() {
          e7 = null, Io(Bo);
        }), 100));
      })), pe(window, "blur", (function() {
        return Io(Mn);
      })), Ho = true);
    })(), qn(this), this.curOp.forceUpdate = true, Hi(this, n4), t4.autofocus && !y || this.hasFocus() ? setTimeout((function() {
      r3.hasFocus() && !r3.state.focused && An(r3);
    }), 20) : Mn(this), La) La.hasOwnProperty(c2) && La[c2](this, t4[c2], Sa);
    gi(this), t4.finishInit && t4.finishInit(this);
    for (var u2 = 0; u2 < Oa.length; ++u2) Oa[u2](this);
    Xn(this), s2 && t4.lineWrapping && "optimizelegibility" == getComputedStyle(o4.lineDiv).textRendering && (o4.lineDiv.style.textRendering = "auto");
  }
  za.defaults = Ta, za.optionHandlers = La;
  var Oa = [];
  function _a(e6, t4, r3, n4) {
    var i5, o4 = e6.doc;
    null == r3 && (r3 = "add"), "smart" == r3 && (o4.mode.indent ? i5 = gt(e6, t4).state : r3 = "prev");
    var a2 = e6.options.tabSize, l4 = qe(o4, t4), s3 = $(l4.text, null, a2);
    l4.stateAfter && (l4.stateAfter = null);
    var c2, u2 = l4.text.match(/^\s*/)[0];
    if (n4 || /\S/.test(l4.text)) {
      if ("smart" == r3 && ((c2 = o4.mode.indent(i5, l4.text.slice(u2.length), l4.text)) == j || c2 > 150)) {
        if (!n4) return;
        r3 = "prev";
      }
    } else c2 = 0, r3 = "not";
    "prev" == r3 ? c2 = t4 > o4.first ? $(qe(o4, t4 - 1).text, null, a2) : 0 : "add" == r3 ? c2 = s3 + e6.options.indentUnit : "subtract" == r3 ? c2 = s3 - e6.options.indentUnit : "number" == typeof r3 && (c2 = s3 + r3), c2 = Math.max(0, c2);
    var d2 = "", f2 = 0;
    if (e6.options.indentWithTabs) for (var h2 = Math.floor(c2 / a2); h2; --h2) f2 += a2, d2 += "	";
    if (f2 < c2 && (d2 += X(c2 - f2)), d2 != u2) return yo(o4, d2, nt(t4, 0), nt(t4, u2.length), "+input"), l4.stateAfter = null, true;
    for (var p2 = 0; p2 < o4.sel.ranges.length; p2++) {
      var m2 = o4.sel.ranges[p2];
      if (m2.head.line == t4 && m2.head.ch < u2.length) {
        var g2 = nt(t4, u2.length);
        Ji(o4, p2, new Ai(g2, g2));
        break;
      }
    }
  }
  za.defineInitHook = function(e6) {
    return Oa.push(e6);
  };
  var Na = null;
  function Pa(e6) {
    Na = e6;
  }
  function Ea(e6, t4, r3, n4, i5) {
    var o4 = e6.doc;
    e6.display.shift = false, n4 || (n4 = o4.sel);
    var a2 = +/* @__PURE__ */ new Date() - 200, l4 = "paste" == i5 || e6.state.pasteIncoming > a2, s3 = Ee(t4), c2 = null;
    if (l4 && n4.ranges.length > 1) if (Na && Na.text.join("\n") == t4) {
      if (n4.ranges.length % Na.text.length == 0) {
        c2 = [];
        for (var u2 = 0; u2 < Na.text.length; u2++) c2.push(o4.splitLines(Na.text[u2]));
      }
    } else s3.length == n4.ranges.length && e6.options.pasteLinesPerSelection && (c2 = Q(s3, (function(e7) {
      return [e7];
    })));
    for (var d2 = e6.curOp.updateInput, f2 = n4.ranges.length - 1; f2 >= 0; f2--) {
      var h2 = n4.ranges[f2], p2 = h2.from(), m2 = h2.to();
      h2.empty() && (r3 && r3 > 0 ? p2 = nt(p2.line, p2.ch - r3) : e6.state.overwrite && !l4 ? m2 = nt(m2.line, Math.min(qe(o4, m2.line).text.length, m2.ch + Y(s3).length)) : l4 && Na && Na.lineWise && Na.text.join("\n") == s3.join("\n") && (p2 = m2 = nt(p2.line, 0)));
      var g2 = { from: p2, to: m2, text: c2 ? c2[f2 % c2.length] : s3, origin: i5 || (l4 ? "paste" : e6.state.cutIncoming > a2 ? "cut" : "+input") };
      ho(e6.doc, g2), ur(e6, "inputRead", e6, g2);
    }
    t4 && !l4 && Wa(e6, t4), En(e6), e6.curOp.updateInput < 2 && (e6.curOp.updateInput = d2), e6.curOp.typing = true, e6.state.pasteIncoming = e6.state.cutIncoming = -1;
  }
  function Da(e6, t4) {
    var r3 = e6.clipboardData && e6.clipboardData.getData("Text");
    if (r3) return e6.preventDefault(), t4.isReadOnly() || t4.options.disableInput || !t4.hasFocus() || ri(t4, (function() {
      return Ea(t4, r3, 0, null, "paste");
    })), true;
  }
  function Wa(e6, t4) {
    if (e6.options.electricChars && e6.options.smartIndent) for (var r3 = e6.doc.sel, n4 = r3.ranges.length - 1; n4 >= 0; n4--) {
      var i5 = r3.ranges[n4];
      if (!(i5.head.ch > 100 || n4 && r3.ranges[n4 - 1].head.line == i5.head.line)) {
        var o4 = e6.getModeAt(i5.head), a2 = false;
        if (o4.electricChars) {
          for (var l4 = 0; l4 < o4.electricChars.length; l4++) if (t4.indexOf(o4.electricChars.charAt(l4)) > -1) {
            a2 = _a(e6, i5.head.line, "smart");
            break;
          }
        } else o4.electricInput && o4.electricInput.test(qe(e6.doc, i5.head.line).text.slice(0, i5.head.ch)) && (a2 = _a(e6, i5.head.line, "smart"));
        a2 && ur(e6, "electricInput", e6, i5.head.line);
      }
    }
  }
  function Fa(e6) {
    for (var t4 = [], r3 = [], n4 = 0; n4 < e6.doc.sel.ranges.length; n4++) {
      var i5 = e6.doc.sel.ranges[n4].head.line, o4 = { anchor: nt(i5, 0), head: nt(i5 + 1, 0) };
      r3.push(o4), t4.push(e6.getRange(o4.anchor, o4.head));
    }
    return { text: t4, ranges: r3 };
  }
  function Ia(e6, t4, r3, n4) {
    e6.setAttribute("autocorrect", r3 ? "" : "off"), e6.setAttribute("autocapitalize", n4 ? "" : "off"), e6.setAttribute("spellcheck", !!t4);
  }
  function Ha() {
    var e6 = O("textarea", null, null, "position: absolute; bottom: -1em; padding: 0; width: 1px; height: 1em; min-height: 1em; outline: none"), t4 = O("div", [e6], null, "overflow: hidden; position: relative; width: 3px; height: 0px;");
    return s2 ? e6.style.width = "1000px" : e6.setAttribute("wrap", "off"), g && (e6.style.border = "1px solid black"), Ia(e6), t4;
  }
  function Ba(e6, t4, r3, n4, i5) {
    var o4 = t4, a2 = r3, l4 = qe(e6, t4.line), s3 = i5 && "rtl" == e6.direction ? -r3 : r3;
    function c2(o5) {
      var a3, c3;
      if ("codepoint" == n4) {
        var u3 = l4.text.charCodeAt(t4.ch + (r3 > 0 ? 0 : -1));
        if (isNaN(u3)) a3 = null;
        else {
          var d3 = r3 > 0 ? u3 >= 55296 && u3 < 56320 : u3 >= 56320 && u3 < 57343;
          a3 = new nt(t4.line, Math.max(0, Math.min(l4.text.length, t4.ch + r3 * (d3 ? 2 : 1))), -r3);
        }
      } else a3 = i5 ? (function(e7, t5, r4, n5) {
        var i6 = fe(t5, e7.doc.direction);
        if (!i6) return ta(t5, r4, n5);
        r4.ch >= t5.text.length ? (r4.ch = t5.text.length, r4.sticky = "before") : r4.ch <= 0 && (r4.ch = 0, r4.sticky = "after");
        var o6 = ue(i6, r4.ch, r4.sticky), a4 = i6[o6];
        if ("ltr" == e7.doc.direction && a4.level % 2 == 0 && (n5 > 0 ? a4.to > r4.ch : a4.from < r4.ch)) return ta(t5, r4, n5);
        var l5, s4 = function(e8, r5) {
          return ea(t5, e8 instanceof nt ? e8.ch : e8, r5);
        }, c4 = function(r5) {
          return e7.options.lineWrapping ? (l5 = l5 || Er(e7, t5), en(e7, t5, l5, r5)) : { begin: 0, end: t5.text.length };
        }, u4 = c4("before" == r4.sticky ? s4(r4, -1) : r4.ch);
        if ("rtl" == e7.doc.direction || 1 == a4.level) {
          var d4 = 1 == a4.level == n5 < 0, f3 = s4(r4, d4 ? 1 : -1);
          if (null != f3 && (d4 ? f3 <= a4.to && f3 <= u4.end : f3 >= a4.from && f3 >= u4.begin)) {
            var h3 = d4 ? "before" : "after";
            return new nt(r4.line, f3, h3);
          }
        }
        var p3 = function(e8, t6, n6) {
          for (var o7 = function(e9, t7) {
            return t7 ? new nt(r4.line, s4(e9, 1), "before") : new nt(r4.line, e9, "after");
          }; e8 >= 0 && e8 < i6.length; e8 += t6) {
            var a5 = i6[e8], l6 = t6 > 0 == (1 != a5.level), c5 = l6 ? n6.begin : s4(n6.end, -1);
            if (a5.from <= c5 && c5 < a5.to) return o7(c5, l6);
            if (c5 = l6 ? a5.from : s4(a5.to, -1), n6.begin <= c5 && c5 < n6.end) return o7(c5, l6);
          }
        }, m3 = p3(o6 + n5, n5, u4);
        if (m3) return m3;
        var g3 = n5 > 0 ? u4.end : s4(u4.begin, -1);
        return null == g3 || n5 > 0 && g3 == t5.text.length || !(m3 = p3(n5 > 0 ? 0 : i6.length - 1, n5, c4(g3))) ? null : m3;
      })(e6.cm, l4, t4, r3) : ta(l4, t4, r3);
      if (null == a3) {
        if (o5 || (c3 = t4.line + s3) < e6.first || c3 >= e6.first + e6.size || (t4 = new nt(c3, t4.ch, t4.sticky), !(l4 = qe(e6, c3)))) return false;
        t4 = ra(i5, e6.cm, l4, t4.line, s3);
      } else t4 = a3;
      return true;
    }
    if ("char" == n4 || "codepoint" == n4) c2();
    else if ("column" == n4) c2(true);
    else if ("word" == n4 || "group" == n4) for (var u2 = null, d2 = "group" == n4, f2 = e6.cm && e6.cm.getHelper(t4, "wordChars"), h2 = true; !(r3 < 0) || c2(!h2); h2 = false) {
      var p2 = l4.text.charAt(t4.ch) || "\n", m2 = ne(p2, f2) ? "w" : d2 && "\n" == p2 ? "n" : !d2 || /\s/.test(p2) ? null : "p";
      if (!d2 || h2 || m2 || (m2 = "s"), u2 && u2 != m2) {
        r3 < 0 && (r3 = 1, c2(), t4.sticky = "after");
        break;
      }
      if (m2 && (u2 = m2), r3 > 0 && !c2(!h2)) break;
    }
    var g2 = so(e6, t4, o4, a2, true);
    return ot(o4, g2) && (g2.hitSide = true), g2;
  }
  function $a(e6, t4, r3, n4) {
    var i5, o4, a2 = e6.doc, l4 = t4.left;
    if ("page" == n4) {
      var s3 = Math.min(e6.display.wrapper.clientHeight, I(e6).innerHeight || a2(e6).documentElement.clientHeight), c2 = Math.max(s3 - 0.5 * an(e6.display), 3);
      i5 = (r3 > 0 ? t4.bottom : t4.top) + r3 * c2;
    } else "line" == n4 && (i5 = r3 > 0 ? t4.bottom + 3 : t4.top - 3);
    for (; (o4 = Qr(e6, l4, i5)).outside; ) {
      if (r3 < 0 ? i5 <= 0 : i5 >= a2.height) {
        o4.hitSide = true;
        break;
      }
      i5 += 5 * r3;
    }
    return o4;
  }
  var Ra = function(e6) {
    this.cm = e6, this.lastAnchorNode = this.lastAnchorOffset = this.lastFocusNode = this.lastFocusOffset = null, this.polling = new R(), this.composing = null, this.gracePeriod = false, this.readDOMTimeout = null;
  };
  function Za(e6, t4) {
    var r3 = Pr(e6, t4.line);
    if (!r3 || r3.hidden) return null;
    var n4 = qe(e6.doc, t4.line), i5 = _r(r3, n4, t4.line), o4 = fe(n4, e6.doc.direction), a2 = "left";
    o4 && (a2 = ue(o4, t4.ch) % 2 ? "right" : "left");
    var l4 = Ir(i5.map, t4.ch, a2);
    return l4.offset = "right" == l4.collapse ? l4.end : l4.start, l4;
  }
  function ja(e6, t4) {
    return t4 && (e6.bad = true), e6;
  }
  function Ua(e6, t4, r3) {
    var n4;
    if (t4 == e6.display.lineDiv) {
      if (!(n4 = e6.display.lineDiv.childNodes[r3])) return ja(e6.clipPos(nt(e6.display.viewTo - 1)), true);
      t4 = null, r3 = 0;
    } else for (n4 = t4; ; n4 = n4.parentNode) {
      if (!n4 || n4 == e6.display.lineDiv) return null;
      if (n4.parentNode && n4.parentNode == e6.display.lineDiv) break;
    }
    for (var i5 = 0; i5 < e6.display.view.length; i5++) {
      var o4 = e6.display.view[i5];
      if (o4.node == n4) return Va(o4, t4, r3);
    }
  }
  function Va(e6, t4, r3) {
    var n4 = e6.text.firstChild, i5 = false;
    if (!t4 || !N(n4, t4)) return ja(nt(Je(e6.line), 0), true);
    if (t4 == n4 && (i5 = true, t4 = n4.childNodes[r3], r3 = 0, !t4)) {
      var o4 = e6.rest ? Y(e6.rest) : e6.line;
      return ja(nt(Je(o4), o4.text.length), i5);
    }
    var a2 = 3 == t4.nodeType ? t4 : null, l4 = t4;
    for (a2 || 1 != t4.childNodes.length || 3 != t4.firstChild.nodeType || (a2 = t4.firstChild, r3 && (r3 = a2.nodeValue.length)); l4.parentNode != n4; ) l4 = l4.parentNode;
    var s3 = e6.measure, c2 = s3.maps;
    function u2(t5, r4, n5) {
      for (var i6 = -1; i6 < (c2 ? c2.length : 0); i6++) for (var o5 = i6 < 0 ? s3.map : c2[i6], a3 = 0; a3 < o5.length; a3 += 3) {
        var l5 = o5[a3 + 2];
        if (l5 == t5 || l5 == r4) {
          var u3 = Je(i6 < 0 ? e6.line : e6.rest[i6]), d3 = o5[a3] + n5;
          return (n5 < 0 || l5 != t5) && (d3 = o5[a3 + (n5 ? 1 : 0)]), nt(u3, d3);
        }
      }
    }
    var d2 = u2(a2, l4, r3);
    if (d2) return ja(d2, i5);
    for (var f2 = l4.nextSibling, h2 = a2 ? a2.nodeValue.length - r3 : 0; f2; f2 = f2.nextSibling) {
      if (d2 = u2(f2, f2.firstChild, 0)) return ja(nt(d2.line, d2.ch - h2), i5);
      h2 += f2.textContent.length;
    }
    for (var p2 = l4.previousSibling, m2 = r3; p2; p2 = p2.previousSibling) {
      if (d2 = u2(p2, p2.firstChild, -1)) return ja(nt(d2.line, d2.ch + m2), i5);
      m2 += p2.textContent.length;
    }
  }
  Ra.prototype.init = function(e6) {
    var t4 = this, r3 = this, n4 = r3.cm, i5 = r3.div = e6.lineDiv;
    function o4(e7) {
      for (var t5 = e7.target; t5; t5 = t5.parentNode) {
        if (t5 == i5) return true;
        if (/\bCodeMirror-(?:line)?widget\b/.test(t5.className)) break;
      }
      return false;
    }
    function a2(e7) {
      if (o4(e7) && !ye(n4, e7)) {
        if (n4.somethingSelected()) Pa({ lineWise: false, text: n4.getSelections() }), "cut" == e7.type && n4.replaceSelection("", null, "cut");
        else {
          if (!n4.options.lineWiseCopyCut) return;
          var t5 = Fa(n4);
          Pa({ lineWise: true, text: t5.text }), "cut" == e7.type && n4.operation((function() {
            n4.setSelections(t5.ranges, 0, U), n4.replaceSelection("", null, "cut");
          }));
        }
        if (e7.clipboardData) {
          e7.clipboardData.clearData();
          var a3 = Na.text.join("\n");
          if (e7.clipboardData.setData("Text", a3), e7.clipboardData.getData("Text") == a3) return void e7.preventDefault();
        }
        var l4 = Ha(), s3 = l4.firstChild;
        n4.display.lineSpace.insertBefore(l4, n4.display.lineSpace.firstChild), s3.value = Na.text.join("\n");
        var c2 = P(i5.ownerDocument);
        W(s3), setTimeout((function() {
          n4.display.lineSpace.removeChild(l4), c2.focus(), c2 == i5 && r3.showPrimarySelection();
        }), 50);
      }
    }
    i5.contentEditable = true, Ia(i5, n4.options.spellcheck, n4.options.autocorrect, n4.options.autocapitalize), pe(i5, "paste", (function(e7) {
      !o4(e7) || ye(n4, e7) || Da(e7, n4) || l3 <= 11 && setTimeout(ni(n4, (function() {
        return t4.updateFromDOM();
      })), 20);
    })), pe(i5, "compositionstart", (function(e7) {
      t4.composing = { data: e7.data, done: false };
    })), pe(i5, "compositionupdate", (function(e7) {
      t4.composing || (t4.composing = { data: e7.data, done: false });
    })), pe(i5, "compositionend", (function(e7) {
      t4.composing && (e7.data != t4.composing.data && t4.readFromDOMSoon(), t4.composing.done = true);
    })), pe(i5, "touchstart", (function() {
      return r3.forceCompositionEnd();
    })), pe(i5, "input", (function() {
      t4.composing || t4.readFromDOMSoon();
    })), pe(i5, "copy", a2), pe(i5, "cut", a2);
  }, Ra.prototype.screenReaderLabelChanged = function(e6) {
    e6 ? this.div.setAttribute("aria-label", e6) : this.div.removeAttribute("aria-label");
  }, Ra.prototype.prepareSelection = function() {
    var e6 = wn(this.cm, false);
    return e6.focus = P(this.div.ownerDocument) == this.div, e6;
  }, Ra.prototype.showSelection = function(e6, t4) {
    e6 && this.cm.display.view.length && ((e6.focus || t4) && this.showPrimarySelection(), this.showMultipleSelections(e6));
  }, Ra.prototype.getSelection = function() {
    return this.cm.display.wrapper.ownerDocument.getSelection();
  }, Ra.prototype.showPrimarySelection = function() {
    var e6 = this.getSelection(), t4 = this.cm, n4 = t4.doc.sel.primary(), i5 = n4.from(), o4 = n4.to();
    if (t4.display.viewTo == t4.display.viewFrom || i5.line >= t4.display.viewTo || o4.line < t4.display.viewFrom) e6.removeAllRanges();
    else {
      var a2 = Ua(t4, e6.anchorNode, e6.anchorOffset), l4 = Ua(t4, e6.focusNode, e6.focusOffset);
      if (!a2 || a2.bad || !l4 || l4.bad || 0 != it(st(a2, l4), i5) || 0 != it(lt(a2, l4), o4)) {
        var s3 = t4.display.view, c2 = i5.line >= t4.display.viewFrom && Za(t4, i5) || { node: s3[0].measure.map[2], offset: 0 }, u2 = o4.line < t4.display.viewTo && Za(t4, o4);
        if (!u2) {
          var d2 = s3[s3.length - 1].measure, f2 = d2.maps ? d2.maps[d2.maps.length - 1] : d2.map;
          u2 = { node: f2[f2.length - 1], offset: f2[f2.length - 2] - f2[f2.length - 3] };
        }
        if (c2 && u2) {
          var h2, p2 = e6.rangeCount && e6.getRangeAt(0);
          try {
            h2 = L(c2.node, c2.offset, u2.offset, u2.node);
          } catch (e7) {
          }
          h2 && (!r2 && t4.state.focused ? (e6.collapse(c2.node, c2.offset), h2.collapsed || (e6.removeAllRanges(), e6.addRange(h2))) : (e6.removeAllRanges(), e6.addRange(h2)), p2 && null == e6.anchorNode ? e6.addRange(p2) : r2 && this.startGracePeriod()), this.rememberSelection();
        } else e6.removeAllRanges();
      }
    }
  }, Ra.prototype.startGracePeriod = function() {
    var e6 = this;
    clearTimeout(this.gracePeriod), this.gracePeriod = setTimeout((function() {
      e6.gracePeriod = false, e6.selectionChanged() && e6.cm.operation((function() {
        return e6.cm.curOp.selectionChanged = true;
      }));
    }), 20);
  }, Ra.prototype.showMultipleSelections = function(e6) {
    z(this.cm.display.cursorDiv, e6.cursors), z(this.cm.display.selectionDiv, e6.selection);
  }, Ra.prototype.rememberSelection = function() {
    var e6 = this.getSelection();
    this.lastAnchorNode = e6.anchorNode, this.lastAnchorOffset = e6.anchorOffset, this.lastFocusNode = e6.focusNode, this.lastFocusOffset = e6.focusOffset;
  }, Ra.prototype.selectionInEditor = function() {
    var e6 = this.getSelection();
    if (!e6.rangeCount) return false;
    var t4 = e6.getRangeAt(0).commonAncestorContainer;
    return N(this.div, t4);
  }, Ra.prototype.focus = function() {
    "nocursor" != this.cm.options.readOnly && (this.selectionInEditor() && P(this.div.ownerDocument) == this.div || this.showSelection(this.prepareSelection(), true), this.div.focus());
  }, Ra.prototype.blur = function() {
    this.div.blur();
  }, Ra.prototype.getField = function() {
    return this.div;
  }, Ra.prototype.supportsTouch = function() {
    return true;
  }, Ra.prototype.receivedFocus = function() {
    var e6 = this, t4 = this;
    this.selectionInEditor() ? setTimeout((function() {
      return e6.pollSelection();
    }), 20) : ri(this.cm, (function() {
      return t4.cm.curOp.selectionChanged = true;
    })), this.polling.set(this.cm.options.pollInterval, (function e7() {
      t4.cm.state.focused && (t4.pollSelection(), t4.polling.set(t4.cm.options.pollInterval, e7));
    }));
  }, Ra.prototype.selectionChanged = function() {
    var e6 = this.getSelection();
    return e6.anchorNode != this.lastAnchorNode || e6.anchorOffset != this.lastAnchorOffset || e6.focusNode != this.lastFocusNode || e6.focusOffset != this.lastFocusOffset;
  }, Ra.prototype.pollSelection = function() {
    if (null == this.readDOMTimeout && !this.gracePeriod && this.selectionChanged()) {
      var e6 = this.getSelection(), t4 = this.cm;
      if (v && u && this.cm.display.gutterSpecs.length && (function(e7) {
        for (var t5 = e7; t5; t5 = t5.parentNode) if (/CodeMirror-gutter-wrapper/.test(t5.className)) return true;
        return false;
      })(e6.anchorNode)) return this.cm.triggerOnKeyDown({ type: "keydown", keyCode: 8, preventDefault: Math.abs }), this.blur(), void this.focus();
      if (!this.composing) {
        this.rememberSelection();
        var r3 = Ua(t4, e6.anchorNode, e6.anchorOffset), n4 = Ua(t4, e6.focusNode, e6.focusOffset);
        r3 && n4 && ri(t4, (function() {
          ro(t4.doc, zi(r3, n4), U), (r3.bad || n4.bad) && (t4.curOp.selectionChanged = true);
        }));
      }
    }
  }, Ra.prototype.pollContent = function() {
    null != this.readDOMTimeout && (clearTimeout(this.readDOMTimeout), this.readDOMTimeout = null);
    var e6, t4, r3, n4 = this.cm, i5 = n4.display, o4 = n4.doc.sel.primary(), a2 = o4.from(), l4 = o4.to();
    if (0 == a2.ch && a2.line > n4.firstLine() && (a2 = nt(a2.line - 1, qe(n4.doc, a2.line - 1).length)), l4.ch == qe(n4.doc, l4.line).text.length && l4.line < n4.lastLine() && (l4 = nt(l4.line + 1, 0)), a2.line < i5.viewFrom || l4.line > i5.viewTo - 1) return false;
    a2.line == i5.viewFrom || 0 == (e6 = hn(n4, a2.line)) ? (t4 = Je(i5.view[0].line), r3 = i5.view[0].node) : (t4 = Je(i5.view[e6].line), r3 = i5.view[e6 - 1].node.nextSibling);
    var s3, c2, u2 = hn(n4, l4.line);
    if (u2 == i5.view.length - 1 ? (s3 = i5.viewTo - 1, c2 = i5.lineDiv.lastChild) : (s3 = Je(i5.view[u2 + 1].line) - 1, c2 = i5.view[u2 + 1].node.previousSibling), !r3) return false;
    for (var d2 = n4.doc.splitLines((function(e7, t5, r4, n5, i6) {
      var o5 = "", a3 = false, l5 = e7.doc.lineSeparator(), s4 = false;
      function c3() {
        a3 && (o5 += l5, s4 && (o5 += l5), a3 = s4 = false);
      }
      function u3(e8) {
        e8 && (c3(), o5 += e8);
      }
      function d3(t6) {
        if (1 == t6.nodeType) {
          var r5 = t6.getAttribute("cm-text");
          if (r5) return void u3(r5);
          var o6, f3 = t6.getAttribute("cm-marker");
          if (f3) {
            var h3 = e7.findMarks(nt(n5, 0), nt(i6 + 1, 0), (g3 = +f3, function(e8) {
              return e8.id == g3;
            }));
            return void (h3.length && (o6 = h3[0].find(0)) && u3(Xe(e7.doc, o6.from, o6.to).join(l5)));
          }
          if ("false" == t6.getAttribute("contenteditable")) return;
          var p3 = /^(pre|div|p|li|table|br)$/i.test(t6.nodeName);
          if (!/^br$/i.test(t6.nodeName) && 0 == t6.textContent.length) return;
          p3 && c3();
          for (var m3 = 0; m3 < t6.childNodes.length; m3++) d3(t6.childNodes[m3]);
          /^(pre|p)$/i.test(t6.nodeName) && (s4 = true), p3 && (a3 = true);
        } else 3 == t6.nodeType && u3(t6.nodeValue.replace(/\u200b/g, "").replace(/\u00a0/g, " "));
        var g3;
      }
      for (; d3(t5), t5 != r4; ) t5 = t5.nextSibling, s4 = false;
      return o5;
    })(n4, r3, c2, t4, s3)), f2 = Xe(n4.doc, nt(t4, 0), nt(s3, qe(n4.doc, s3).text.length)); d2.length > 1 && f2.length > 1; ) if (Y(d2) == Y(f2)) d2.pop(), f2.pop(), s3--;
    else {
      if (d2[0] != f2[0]) break;
      d2.shift(), f2.shift(), t4++;
    }
    for (var h2 = 0, p2 = 0, m2 = d2[0], g2 = f2[0], v2 = Math.min(m2.length, g2.length); h2 < v2 && m2.charCodeAt(h2) == g2.charCodeAt(h2); ) ++h2;
    for (var y2 = Y(d2), b2 = Y(f2), w2 = Math.min(y2.length - (1 == d2.length ? h2 : 0), b2.length - (1 == f2.length ? h2 : 0)); p2 < w2 && y2.charCodeAt(y2.length - p2 - 1) == b2.charCodeAt(b2.length - p2 - 1); ) ++p2;
    if (1 == d2.length && 1 == f2.length && t4 == a2.line) for (; h2 && h2 > a2.ch && y2.charCodeAt(y2.length - p2 - 1) == b2.charCodeAt(b2.length - p2 - 1); ) h2--, p2++;
    d2[d2.length - 1] = y2.slice(0, y2.length - p2).replace(/^\u200b+/, ""), d2[0] = d2[0].slice(h2).replace(/\u200b+$/, "");
    var k2 = nt(t4, h2), x3 = nt(s3, f2.length ? Y(f2).length - p2 : 0);
    return d2.length > 1 || d2[0] || it(k2, x3) ? (yo(n4.doc, d2, k2, x3, "+input"), true) : void 0;
  }, Ra.prototype.ensurePolled = function() {
    this.forceCompositionEnd();
  }, Ra.prototype.reset = function() {
    this.forceCompositionEnd();
  }, Ra.prototype.forceCompositionEnd = function() {
    this.composing && (clearTimeout(this.readDOMTimeout), this.composing = null, this.updateFromDOM(), this.div.blur(), this.div.focus());
  }, Ra.prototype.readFromDOMSoon = function() {
    var e6 = this;
    null == this.readDOMTimeout && (this.readDOMTimeout = setTimeout((function() {
      if (e6.readDOMTimeout = null, e6.composing) {
        if (!e6.composing.done) return;
        e6.composing = null;
      }
      e6.updateFromDOM();
    }), 80));
  }, Ra.prototype.updateFromDOM = function() {
    var e6 = this;
    !this.cm.isReadOnly() && this.pollContent() || ri(this.cm, (function() {
      return pn(e6.cm);
    }));
  }, Ra.prototype.setUneditable = function(e6) {
    e6.contentEditable = "false";
  }, Ra.prototype.onKeyPress = function(e6) {
    0 == e6.charCode || this.composing || (e6.preventDefault(), this.cm.isReadOnly() || ni(this.cm, Ea)(this.cm, String.fromCharCode(null == e6.charCode ? e6.keyCode : e6.charCode), 0));
  }, Ra.prototype.readOnlyChanged = function(e6) {
    this.div.contentEditable = ("nocursor" != e6) + "";
  }, Ra.prototype.onContextMenu = function() {
  }, Ra.prototype.resetPosition = function() {
  }, Ra.prototype.needsContentAttribute = true;
  var Ka = function(e6) {
    this.cm = e6, this.prevInput = "", this.pollingFast = false, this.polling = new R(), this.hasSelection = false, this.composing = null, this.resetting = false;
  };
  Ka.prototype.init = function(e6) {
    var t4 = this, r3 = this, n4 = this.cm;
    this.createField(e6);
    var i5 = this.textarea;
    function o4(e7) {
      if (!ye(n4, e7)) {
        if (n4.somethingSelected()) Pa({ lineWise: false, text: n4.getSelections() });
        else {
          if (!n4.options.lineWiseCopyCut) return;
          var t5 = Fa(n4);
          Pa({ lineWise: true, text: t5.text }), "cut" == e7.type ? n4.setSelections(t5.ranges, null, U) : (r3.prevInput = "", i5.value = t5.text.join("\n"), W(i5));
        }
        "cut" == e7.type && (n4.state.cutIncoming = +/* @__PURE__ */ new Date());
      }
    }
    e6.wrapper.insertBefore(this.wrapper, e6.wrapper.firstChild), g && (i5.style.width = "0px"), pe(i5, "input", (function() {
      a && l3 >= 9 && t4.hasSelection && (t4.hasSelection = null), r3.poll();
    })), pe(i5, "paste", (function(e7) {
      ye(n4, e7) || Da(e7, n4) || (n4.state.pasteIncoming = +/* @__PURE__ */ new Date(), r3.fastPoll());
    })), pe(i5, "cut", o4), pe(i5, "copy", o4), pe(e6.scroller, "paste", (function(t5) {
      if (!Sr(e6, t5) && !ye(n4, t5)) {
        if (!i5.dispatchEvent) return n4.state.pasteIncoming = +/* @__PURE__ */ new Date(), void r3.focus();
        var o5 = new Event("paste");
        o5.clipboardData = t5.clipboardData, i5.dispatchEvent(o5);
      }
    })), pe(e6.lineSpace, "selectstart", (function(t5) {
      Sr(e6, t5) || xe(t5);
    })), pe(i5, "compositionstart", (function() {
      var e7 = n4.getCursor("from");
      r3.composing && r3.composing.range.clear(), r3.composing = { start: e7, range: n4.markText(e7, n4.getCursor("to"), { className: "CodeMirror-composing" }) };
    })), pe(i5, "compositionend", (function() {
      r3.composing && (r3.poll(), r3.composing.range.clear(), r3.composing = null);
    }));
  }, Ka.prototype.createField = function(e6) {
    this.wrapper = Ha(), this.textarea = this.wrapper.firstChild;
  }, Ka.prototype.screenReaderLabelChanged = function(e6) {
    e6 ? this.textarea.setAttribute("aria-label", e6) : this.textarea.removeAttribute("aria-label");
  }, Ka.prototype.prepareSelection = function() {
    var e6 = this.cm, t4 = e6.display, r3 = e6.doc, n4 = wn(e6);
    if (e6.options.moveInputWithCursor) {
      var i5 = qr(e6, r3.sel.primary().head, "div"), o4 = t4.wrapper.getBoundingClientRect(), a2 = t4.lineDiv.getBoundingClientRect();
      n4.teTop = Math.max(0, Math.min(t4.wrapper.clientHeight - 10, i5.top + a2.top - o4.top)), n4.teLeft = Math.max(0, Math.min(t4.wrapper.clientWidth - 10, i5.left + a2.left - o4.left));
    }
    return n4;
  }, Ka.prototype.showSelection = function(e6) {
    var t4 = this.cm.display;
    z(t4.cursorDiv, e6.cursors), z(t4.selectionDiv, e6.selection), null != e6.teTop && (this.wrapper.style.top = e6.teTop + "px", this.wrapper.style.left = e6.teLeft + "px");
  }, Ka.prototype.reset = function(e6) {
    if (!(this.contextMenuPending || this.composing && e6)) {
      var t4 = this.cm;
      if (this.resetting = true, t4.somethingSelected()) {
        this.prevInput = "";
        var r3 = t4.getSelection();
        this.textarea.value = r3, t4.state.focused && W(this.textarea), a && l3 >= 9 && (this.hasSelection = r3);
      } else e6 || (this.prevInput = this.textarea.value = "", a && l3 >= 9 && (this.hasSelection = null));
      this.resetting = false;
    }
  }, Ka.prototype.getField = function() {
    return this.textarea;
  }, Ka.prototype.supportsTouch = function() {
    return false;
  }, Ka.prototype.focus = function() {
    if ("nocursor" != this.cm.options.readOnly && (!y || P(this.textarea.ownerDocument) != this.textarea)) try {
      this.textarea.focus();
    } catch (e6) {
    }
  }, Ka.prototype.blur = function() {
    this.textarea.blur();
  }, Ka.prototype.resetPosition = function() {
    this.wrapper.style.top = this.wrapper.style.left = 0;
  }, Ka.prototype.receivedFocus = function() {
    this.slowPoll();
  }, Ka.prototype.slowPoll = function() {
    var e6 = this;
    this.pollingFast || this.polling.set(this.cm.options.pollInterval, (function() {
      e6.poll(), e6.cm.state.focused && e6.slowPoll();
    }));
  }, Ka.prototype.fastPoll = function() {
    var e6 = false, t4 = this;
    t4.pollingFast = true, t4.polling.set(20, (function r3() {
      t4.poll() || e6 ? (t4.pollingFast = false, t4.slowPoll()) : (e6 = true, t4.polling.set(60, r3));
    }));
  }, Ka.prototype.poll = function() {
    var e6 = this, t4 = this.cm, r3 = this.textarea, n4 = this.prevInput;
    if (this.contextMenuPending || this.resetting || !t4.state.focused || De(r3) && !n4 && !this.composing || t4.isReadOnly() || t4.options.disableInput || t4.state.keySeq) return false;
    var i5 = r3.value;
    if (i5 == n4 && !t4.somethingSelected()) return false;
    if (a && l3 >= 9 && this.hasSelection === i5 || b && /[\uf700-\uf7ff]/.test(i5)) return t4.display.input.reset(), false;
    if (t4.doc.sel == t4.display.selForContextMenu) {
      var o4 = i5.charCodeAt(0);
      if (8203 != o4 || n4 || (n4 = "\u200B"), 8666 == o4) return this.reset(), this.cm.execCommand("undo");
    }
    for (var s3 = 0, c2 = Math.min(n4.length, i5.length); s3 < c2 && n4.charCodeAt(s3) == i5.charCodeAt(s3); ) ++s3;
    return ri(t4, (function() {
      Ea(t4, i5.slice(s3), n4.length - s3, null, e6.composing ? "*compose" : null), i5.length > 1e3 || i5.indexOf("\n") > -1 ? r3.value = e6.prevInput = "" : e6.prevInput = i5, e6.composing && (e6.composing.range.clear(), e6.composing.range = t4.markText(e6.composing.start, t4.getCursor("to"), { className: "CodeMirror-composing" }));
    })), true;
  }, Ka.prototype.ensurePolled = function() {
    this.pollingFast && this.poll() && (this.pollingFast = false);
  }, Ka.prototype.onKeyPress = function() {
    a && l3 >= 9 && (this.hasSelection = null), this.fastPoll();
  }, Ka.prototype.onContextMenu = function(e6) {
    var t4 = this, r3 = t4.cm, n4 = r3.display, i5 = t4.textarea;
    t4.contextMenuPending && t4.contextMenuPending();
    var o4 = fn2(r3, e6), c2 = n4.scroller.scrollTop;
    if (o4 && !f) {
      r3.options.resetSelectionOnContextMenu && -1 == r3.doc.sel.contains(o4) && ni(r3, ro)(r3.doc, zi(o4), U);
      var u2, d2 = i5.style.cssText, h2 = t4.wrapper.style.cssText, p2 = t4.wrapper.offsetParent.getBoundingClientRect();
      if (t4.wrapper.style.cssText = "position: static", i5.style.cssText = "position: absolute; width: 30px; height: 30px;\n      top: " + (e6.clientY - p2.top - 5) + "px; left: " + (e6.clientX - p2.left - 5) + "px;\n      z-index: 1000; background: " + (a ? "rgba(255, 255, 255, .05)" : "transparent") + ";\n      outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);", s2 && (u2 = i5.ownerDocument.defaultView.scrollY), n4.input.focus(), s2 && i5.ownerDocument.defaultView.scrollTo(null, u2), n4.input.reset(), r3.somethingSelected() || (i5.value = t4.prevInput = " "), t4.contextMenuPending = v2, n4.selForContextMenu = r3.doc.sel, clearTimeout(n4.detectingSelectAll), a && l3 >= 9 && g2(), S) {
        Te(e6);
        var m2 = function() {
          ge(window, "mouseup", m2), setTimeout(v2, 20);
        };
        pe(window, "mouseup", m2);
      } else setTimeout(v2, 50);
    }
    function g2() {
      if (null != i5.selectionStart) {
        var e7 = r3.somethingSelected(), o5 = "\u200B" + (e7 ? i5.value : "");
        i5.value = "\u21DA", i5.value = o5, t4.prevInput = e7 ? "" : "\u200B", i5.selectionStart = 1, i5.selectionEnd = o5.length, n4.selForContextMenu = r3.doc.sel;
      }
    }
    function v2() {
      if (t4.contextMenuPending == v2 && (t4.contextMenuPending = false, t4.wrapper.style.cssText = h2, i5.style.cssText = d2, a && l3 < 9 && n4.scrollbars.setScrollTop(n4.scroller.scrollTop = c2), null != i5.selectionStart)) {
        (!a || a && l3 < 9) && g2();
        var e7 = 0, o5 = function() {
          n4.selForContextMenu == r3.doc.sel && 0 == i5.selectionStart && i5.selectionEnd > 0 && "\u200B" == t4.prevInput ? ni(r3, uo)(r3) : e7++ < 10 ? n4.detectingSelectAll = setTimeout(o5, 500) : (n4.selForContextMenu = null, n4.input.reset());
        };
        n4.detectingSelectAll = setTimeout(o5, 200);
      }
    }
  }, Ka.prototype.readOnlyChanged = function(e6) {
    e6 || this.reset(), this.textarea.disabled = "nocursor" == e6, this.textarea.readOnly = !!e6;
  }, Ka.prototype.setUneditable = function() {
  }, Ka.prototype.needsContentAttribute = false, (function(e6) {
    var t4 = e6.optionHandlers;
    function r3(r4, n4, i5, o4) {
      e6.defaults[r4] = n4, i5 && (t4[r4] = o4 ? function(e7, t5, r5) {
        r5 != Sa && i5(e7, t5, r5);
      } : i5);
    }
    e6.defineOption = r3, e6.Init = Sa, r3("value", "", (function(e7, t5) {
      return e7.setValue(t5);
    }), true), r3("mode", null, (function(e7, t5) {
      e7.doc.modeOption = t5, Ei(e7);
    }), true), r3("indentUnit", 2, Ei, true), r3("indentWithTabs", false), r3("smartIndent", true), r3("tabSize", 4, (function(e7) {
      Di(e7), Rr(e7), pn(e7);
    }), true), r3("lineSeparator", null, (function(e7, t5) {
      if (e7.doc.lineSep = t5, t5) {
        var r4 = [], n4 = e7.doc.first;
        e7.doc.iter((function(e8) {
          for (var i6 = 0; ; ) {
            var o4 = e8.text.indexOf(t5, i6);
            if (-1 == o4) break;
            i6 = o4 + t5.length, r4.push(nt(n4, o4));
          }
          n4++;
        }));
        for (var i5 = r4.length - 1; i5 >= 0; i5--) yo(e7.doc, t5, r4[i5], nt(r4[i5].line, r4[i5].ch + t5.length));
      }
    })), r3("specialChars", /[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b\u200e\u200f\u2028\u2029\u202d\u202e\u2066\u2067\u2069\ufeff\ufff9-\ufffc]/g, (function(e7, t5, r4) {
      e7.state.specialChars = RegExp(t5.source + (t5.test("	") ? "" : "|	"), "g"), r4 != Sa && e7.refresh();
    })), r3("specialCharPlaceholder", tr, (function(e7) {
      return e7.refresh();
    }), true), r3("electricChars", true), r3("inputStyle", y ? "contenteditable" : "textarea", (function() {
      throw Error("inputStyle can not (yet) be changed in a running editor");
    }), true), r3("spellcheck", false, (function(e7, t5) {
      return e7.getInputField().spellcheck = t5;
    }), true), r3("autocorrect", false, (function(e7, t5) {
      return e7.getInputField().autocorrect = t5;
    }), true), r3("autocapitalize", false, (function(e7, t5) {
      return e7.getInputField().autocapitalize = t5;
    }), true), r3("rtlMoveVisually", !k), r3("wholeLineUpdateBefore", true), r3("theme", "default", (function(e7) {
      Ca(e7), bi(e7);
    }), true), r3("keyMap", "default", (function(e7, t5, r4) {
      var n4 = Qo(t5), i5 = r4 != Sa && Qo(r4);
      i5 && i5.detach && i5.detach(e7, n4), n4.attach && n4.attach(e7, i5 || null);
    })), r3("extraKeys", null), r3("configureMouse", null), r3("lineWrapping", false, Ma, true), r3("gutters", [], (function(e7, t5) {
      e7.display.gutterSpecs = vi(t5, e7.options.lineNumbers), bi(e7);
    }), true), r3("fixedGutter", true, (function(e7, t5) {
      e7.display.gutters.style.left = t5 ? cn(e7.display) + "px" : "0", e7.refresh();
    }), true), r3("coverGutterNextToScrollbar", false, (function(e7) {
      return jn(e7);
    }), true), r3("scrollbarStyle", "native", (function(e7) {
      Kn(e7), jn(e7), e7.display.scrollbars.setScrollTop(e7.doc.scrollTop), e7.display.scrollbars.setScrollLeft(e7.doc.scrollLeft);
    }), true), r3("lineNumbers", false, (function(e7, t5) {
      e7.display.gutterSpecs = vi(e7.options.gutters, t5), bi(e7);
    }), true), r3("firstLineNumber", 1, bi, true), r3("lineNumberFormatter", (function(e7) {
      return e7;
    }), bi, true), r3("showCursorWhenSelecting", false, bn, true), r3("resetSelectionOnContextMenu", true), r3("lineWiseCopyCut", true), r3("pasteLinesPerSelection", true), r3("selectionsMayTouch", false), r3("readOnly", false, (function(e7, t5) {
      "nocursor" == t5 && (Mn(e7), e7.display.input.blur()), e7.display.input.readOnlyChanged(t5);
    })), r3("screenReaderLabel", null, (function(e7, t5) {
      t5 = "" === t5 ? null : t5, e7.display.input.screenReaderLabelChanged(t5);
    })), r3("disableInput", false, (function(e7, t5) {
      t5 || e7.display.input.reset();
    }), true), r3("dragDrop", true, Aa), r3("allowDropFileTypes", null), r3("cursorBlinkRate", 530), r3("cursorScrollMargin", 0), r3("cursorHeight", 1, bn, true), r3("singleCursorHeightPerLine", true, bn, true), r3("workTime", 100), r3("workDelay", 100), r3("flattenSpans", true, Di, true), r3("addModeClass", false, Di, true), r3("pollInterval", 100), r3("undoDepth", 200, (function(e7, t5) {
      return e7.doc.history.undoDepth = t5;
    })), r3("historyEventDelay", 1250), r3("viewportMargin", 10, (function(e7) {
      return e7.refresh();
    }), true), r3("maxHighlightLength", 1e4, Di, true), r3("moveInputWithCursor", true, (function(e7, t5) {
      t5 || e7.display.input.resetPosition();
    })), r3("tabindex", null, (function(e7, t5) {
      return e7.display.input.getField().tabIndex = t5 || "";
    })), r3("autofocus", null), r3("direction", "ltr", (function(e7, t5) {
      return e7.doc.setDirection(t5);
    }), true), r3("phrases", null);
  })(za), (function(e6) {
    var t4 = e6.optionHandlers, r3 = e6.helpers = {};
    e6.prototype = { constructor: e6, focus: function() {
      I(this).focus(), this.display.input.focus();
    }, setOption: function(e7, r4) {
      var n4 = this.options, i5 = n4[e7];
      n4[e7] == r4 && "mode" != e7 || (n4[e7] = r4, t4.hasOwnProperty(e7) && ni(this, t4[e7])(this, r4, i5), ve(this, "optionChange", this, e7));
    }, getOption: function(e7) {
      return this.options[e7];
    }, getDoc: function() {
      return this.doc;
    }, addKeyMap: function(e7, t5) {
      this.state.keyMaps[t5 ? "push" : "unshift"](Qo(e7));
    }, removeKeyMap: function(e7) {
      for (var t5 = this.state.keyMaps, r4 = 0; r4 < t5.length; ++r4) if (t5[r4] == e7 || t5[r4].name == e7) return t5.splice(r4, 1), true;
    }, addOverlay: ii((function(t5, r4) {
      var n4 = t5.token ? t5 : e6.getMode(this.options, t5);
      if (n4.startState) throw Error("Overlays may not be stateful.");
      !(function(e7, t6, r5) {
        for (var n5 = 0, i5 = r5(t6); n5 < e7.length && r5(e7[n5]) <= i5; ) n5++;
        e7.splice(n5, 0, t6);
      })(this.state.overlays, { mode: n4, modeSpec: t5, opaque: r4 && r4.opaque, priority: r4 && r4.priority || 0 }, (function(e7) {
        return e7.priority;
      })), this.state.modeGen++, pn(this);
    })), removeOverlay: ii((function(e7) {
      for (var t5 = this.state.overlays, r4 = 0; r4 < t5.length; ++r4) {
        var n4 = t5[r4].modeSpec;
        if (n4 == e7 || "string" == typeof e7 && n4.name == e7) return t5.splice(r4, 1), this.state.modeGen++, void pn(this);
      }
    })), indentLine: ii((function(e7, t5, r4) {
      "string" != typeof t5 && "number" != typeof t5 && (t5 = null == t5 ? this.options.smartIndent ? "smart" : "prev" : t5 ? "add" : "subtract"), tt(this.doc, e7) && _a(this, e7, t5, r4);
    })), indentSelection: ii((function(e7) {
      for (var t5 = this.doc.sel.ranges, r4 = -1, n4 = 0; n4 < t5.length; n4++) {
        var i5 = t5[n4];
        if (i5.empty()) i5.head.line > r4 && (_a(this, i5.head.line, e7, true), r4 = i5.head.line, n4 == this.doc.sel.primIndex && En(this));
        else {
          var o4 = i5.from(), a2 = i5.to(), l4 = Math.max(r4, o4.line);
          r4 = Math.min(this.lastLine(), a2.line - (a2.ch ? 0 : 1)) + 1;
          for (var s3 = l4; s3 < r4; ++s3) _a(this, s3, e7);
          var c2 = this.doc.sel.ranges;
          0 == o4.ch && t5.length == c2.length && c2[n4].from().ch > 0 && Ji(this.doc, n4, new Ai(o4, c2[n4].to()), U);
        }
      }
    })), getTokenAt: function(e7, t5) {
      return kt(this, e7, t5);
    }, getLineTokens: function(e7, t5) {
      return kt(this, nt(e7), t5, true);
    }, getTokenTypeAt: function(e7) {
      e7 = ut(this.doc, e7);
      var t5, r4 = mt(this, qe(this.doc, e7.line)), n4 = 0, i5 = (r4.length - 1) / 2, o4 = e7.ch;
      if (0 == o4) t5 = r4[2];
      else for (; ; ) {
        var a2 = n4 + i5 >> 1;
        if ((a2 ? r4[2 * a2 - 1] : 0) >= o4) i5 = a2;
        else {
          if (!(r4[2 * a2 + 1] < o4)) {
            t5 = r4[2 * a2 + 2];
            break;
          }
          n4 = a2 + 1;
        }
      }
      var l4 = t5 ? t5.indexOf("overlay ") : -1;
      return l4 < 0 ? t5 : 0 == l4 ? null : t5.slice(0, l4 - 1);
    }, getModeAt: function(t5) {
      var r4 = this.doc.mode;
      return r4.innerMode ? e6.innerMode(r4, this.getTokenAt(t5).state).mode : r4;
    }, getHelper: function(e7, t5) {
      return this.getHelpers(e7, t5)[0];
    }, getHelpers: function(e7, t5) {
      var n4 = [];
      if (!r3.hasOwnProperty(t5)) return n4;
      var i5 = r3[t5], o4 = this.getModeAt(e7);
      if ("string" == typeof o4[t5]) i5[o4[t5]] && n4.push(i5[o4[t5]]);
      else if (o4[t5]) for (var a2 = 0; a2 < o4[t5].length; a2++) {
        var l4 = i5[o4[t5][a2]];
        l4 && n4.push(l4);
      }
      else o4.helperType && i5[o4.helperType] ? n4.push(i5[o4.helperType]) : i5[o4.name] && n4.push(i5[o4.name]);
      for (var s3 = 0; s3 < i5._global.length; s3++) {
        var c2 = i5._global[s3];
        c2.pred(o4, this) && -1 == Z(n4, c2.val) && n4.push(c2.val);
      }
      return n4;
    }, getStateAfter: function(e7, t5) {
      var r4 = this.doc;
      return gt(this, (e7 = ct(r4, null == e7 ? r4.first + r4.size - 1 : e7)) + 1, t5).state;
    }, cursorCoords: function(e7, t5) {
      var r4 = this.doc.sel.primary();
      return qr(this, null == e7 ? r4.head : "object" == typeof e7 ? ut(this.doc, e7) : e7 ? r4.from() : r4.to(), t5 || "page");
    }, charCoords: function(e7, t5) {
      return Gr(this, ut(this.doc, e7), t5 || "page");
    }, coordsChar: function(e7, t5) {
      return Qr(this, (e7 = Kr(this, e7, t5 || "page")).left, e7.top);
    }, lineAtHeight: function(e7, t5) {
      return e7 = Kr(this, { top: e7, left: 0 }, t5 || "page").top, et(this.doc, e7 + this.display.viewOffset);
    }, heightAtLine: function(e7, t5, r4) {
      var n4, i5 = false;
      if ("number" == typeof e7) {
        var o4 = this.doc.first + this.doc.size - 1;
        e7 < this.doc.first ? e7 = this.doc.first : e7 > o4 && (e7 = o4, i5 = true), n4 = qe(this.doc, e7);
      } else n4 = e7;
      return Vr(this, n4, { top: 0, left: 0 }, t5 || "page", r4 || i5).top + (i5 ? this.doc.height - Vt(n4) : 0);
    }, defaultTextHeight: function() {
      return an(this.display);
    }, defaultCharWidth: function() {
      return ln(this.display);
    }, getViewport: function() {
      return { from: this.display.viewFrom, to: this.display.viewTo };
    }, addWidget: function(e7, t5, r4, n4, i5) {
      var o4, a2, l4 = this.display, s3 = (e7 = qr(this, ut(this.doc, e7))).bottom, c2 = e7.left;
      if (t5.style.position = "absolute", t5.setAttribute("cm-ignore-events", "true"), this.display.input.setUneditable(t5), l4.sizer.appendChild(t5), "over" == n4) s3 = e7.top;
      else if ("above" == n4 || "near" == n4) {
        var u2 = Math.max(l4.wrapper.clientHeight, this.doc.height), d2 = Math.max(l4.sizer.clientWidth, l4.lineSpace.clientWidth);
        ("above" == n4 || e7.bottom + t5.offsetHeight > u2) && e7.top > t5.offsetHeight ? s3 = e7.top - t5.offsetHeight : e7.bottom + t5.offsetHeight <= u2 && (s3 = e7.bottom), c2 + t5.offsetWidth > d2 && (c2 = d2 - t5.offsetWidth);
      }
      t5.style.top = s3 + "px", t5.style.left = t5.style.right = "", "right" == i5 ? (c2 = l4.sizer.clientWidth - t5.offsetWidth, t5.style.right = "0px") : ("left" == i5 ? c2 = 0 : "middle" == i5 && (c2 = (l4.sizer.clientWidth - t5.offsetWidth) / 2), t5.style.left = c2 + "px"), r4 && (null != (a2 = Nn(o4 = this, { left: c2, top: s3, right: c2 + t5.offsetWidth, bottom: s3 + t5.offsetHeight })).scrollTop && In(o4, a2.scrollTop), null != a2.scrollLeft && Bn(o4, a2.scrollLeft));
    }, triggerOnKeyDown: ii(fa), triggerOnKeyPress: ii(pa), triggerOnKeyUp: ha, triggerOnMouseDown: ii(ya), execCommand: function(e7) {
      if (na.hasOwnProperty(e7)) return na[e7].call(null, this);
    }, triggerElectric: ii((function(e7) {
      Wa(this, e7);
    })), findPosH: function(e7, t5, r4, n4) {
      var i5 = 1;
      t5 < 0 && (i5 = -1, t5 = -t5);
      for (var o4 = ut(this.doc, e7), a2 = 0; a2 < t5 && !(o4 = Ba(this.doc, o4, i5, r4, n4)).hitSide; ++a2) ;
      return o4;
    }, moveH: ii((function(e7, t5) {
      var r4 = this;
      this.extendSelectionsBy((function(n4) {
        return r4.display.shift || r4.doc.extend || n4.empty() ? Ba(r4.doc, n4.head, e7, t5, r4.options.rtlMoveVisually) : e7 < 0 ? n4.from() : n4.to();
      }), K);
    })), deleteH: ii((function(e7, t5) {
      var r4 = this.doc.sel, n4 = this.doc;
      r4.somethingSelected() ? n4.replaceSelection("", null, "+delete") : Jo(this, (function(r5) {
        var i5 = Ba(n4, r5.head, e7, t5, false);
        return e7 < 0 ? { from: i5, to: r5.head } : { from: r5.head, to: i5 };
      }));
    })), findPosV: function(e7, t5, r4, n4) {
      var i5 = 1, o4 = n4;
      t5 < 0 && (i5 = -1, t5 = -t5);
      for (var a2 = ut(this.doc, e7), l4 = 0; l4 < t5; ++l4) {
        var s3 = qr(this, a2, "div");
        if (null == o4 ? o4 = s3.left : s3.left = o4, (a2 = $a(this, s3, i5, r4)).hitSide) break;
      }
      return a2;
    }, moveV: ii((function(e7, t5) {
      var r4 = this, n4 = this.doc, i5 = [], o4 = !this.display.shift && !n4.extend && n4.sel.somethingSelected();
      if (n4.extendSelectionsBy((function(a3) {
        if (o4) return e7 < 0 ? a3.from() : a3.to();
        var l4 = qr(r4, a3.head, "div");
        null != a3.goalColumn && (l4.left = a3.goalColumn), i5.push(l4.left);
        var s3 = $a(r4, l4, e7, t5);
        return "page" == t5 && a3 == n4.sel.primary() && Pn(r4, Gr(r4, s3, "div").top - l4.top), s3;
      }), K), i5.length) for (var a2 = 0; a2 < n4.sel.ranges.length; a2++) n4.sel.ranges[a2].goalColumn = i5[a2];
    })), findWordAt: function(e7) {
      var t5 = qe(this.doc, e7.line).text, r4 = e7.ch, n4 = e7.ch;
      if (t5) {
        var i5 = this.getHelper(e7, "wordChars");
        "before" != e7.sticky && n4 != t5.length || !r4 ? ++n4 : --r4;
        for (var o4 = t5.charAt(r4), a2 = ne(o4, i5) ? function(e8) {
          return ne(e8, i5);
        } : /\s/.test(o4) ? function(e8) {
          return /\s/.test(e8);
        } : function(e8) {
          return !/\s/.test(e8) && !ne(e8);
        }; r4 > 0 && a2(t5.charAt(r4 - 1)); ) --r4;
        for (; n4 < t5.length && a2(t5.charAt(n4)); ) ++n4;
      }
      return new Ai(nt(e7.line, r4), nt(e7.line, n4));
    }, toggleOverwrite: function(e7) {
      null != e7 && e7 == this.state.overwrite || ((this.state.overwrite = !this.state.overwrite) ? E(this.display.cursorDiv, "CodeMirror-overwrite") : A2(this.display.cursorDiv, "CodeMirror-overwrite"), ve(this, "overwriteToggle", this, this.state.overwrite));
    }, hasFocus: function() {
      return this.display.input.getField() == P(F(this));
    }, isReadOnly: function() {
      return !(!this.options.readOnly && !this.doc.cantEdit);
    }, scrollTo: ii((function(e7, t5) {
      Dn(this, e7, t5);
    })), getScrollInfo: function() {
      var e7 = this.display.scroller;
      return { left: e7.scrollLeft, top: e7.scrollTop, height: e7.scrollHeight - Mr(this) - this.display.barHeight, width: e7.scrollWidth - Mr(this) - this.display.barWidth, clientHeight: Or(this), clientWidth: zr(this) };
    }, scrollIntoView: ii((function(e7, t5) {
      null == e7 ? (e7 = { from: this.doc.sel.primary().head, to: null }, null == t5 && (t5 = this.options.cursorScrollMargin)) : "number" == typeof e7 ? e7 = { from: nt(e7, 0), to: null } : null == e7.from && (e7 = { from: e7, to: null }), e7.to || (e7.to = e7.from), e7.margin = t5 || 0, null != e7.from.line ? (function(e8, t6) {
        Wn(e8), e8.curOp.scrollToPos = t6;
      })(this, e7) : Fn(this, e7.from, e7.to, e7.margin);
    })), setSize: ii((function(e7, t5) {
      var r4 = this, n4 = function(e8) {
        return "number" == typeof e8 || /^\d+$/.test(e8 + "") ? e8 + "px" : e8;
      };
      null != e7 && (this.display.wrapper.style.width = n4(e7)), null != t5 && (this.display.wrapper.style.height = n4(t5)), this.options.lineWrapping && $r(this);
      var i5 = this.display.viewFrom;
      this.doc.iter(i5, this.display.viewTo, (function(e8) {
        if (e8.widgets) {
          for (var t6 = 0; t6 < e8.widgets.length; t6++) if (e8.widgets[t6].noHScroll) {
            mn(r4, i5, "widget");
            break;
          }
        }
        ++i5;
      })), this.curOp.forceUpdate = true, ve(this, "refresh", this);
    })), operation: function(e7) {
      return ri(this, e7);
    }, startOperation: function() {
      return qn(this);
    }, endOperation: function() {
      return Xn(this);
    }, refresh: ii((function() {
      var e7 = this.display.cachedTextHeight;
      pn(this), this.curOp.forceUpdate = true, Rr(this), Dn(this, this.doc.scrollLeft, this.doc.scrollTop), hi(this.display), (null == e7 || Math.abs(e7 - an(this.display)) > 0.5 || this.options.lineWrapping) && dn(this), ve(this, "refresh", this);
    })), swapDoc: ii((function(e7) {
      var t5 = this.doc;
      return t5.cm = null, this.state.selectingText && this.state.selectingText(), Hi(this, e7), Rr(this), this.display.input.reset(), Dn(this, e7.scrollLeft, e7.scrollTop), this.curOp.forceScroll = true, ur(this, "swapDoc", this, t5), t5;
    })), phrase: function(e7) {
      var t5 = this.options.phrases;
      return t5 && Object.prototype.hasOwnProperty.call(t5, e7) ? t5[e7] : e7;
    }, getInputField: function() {
      return this.display.input.getField();
    }, getWrapperElement: function() {
      return this.display.wrapper;
    }, getScrollerElement: function() {
      return this.display.scroller;
    }, getGutterElement: function() {
      return this.display.gutters;
    } }, ke(e6), e6.registerHelper = function(t5, n4, i5) {
      r3.hasOwnProperty(t5) || (r3[t5] = e6[t5] = { _global: [] }), r3[t5][n4] = i5;
    }, e6.registerGlobalHelper = function(t5, n4, i5, o4) {
      e6.registerHelper(t5, n4, o4), r3[t5]._global.push({ pred: i5, val: o4 });
    };
  })(za);
  var Ga = "iter insert remove copy getEditor constructor".split(" ");
  for (var qa in Eo.prototype) Eo.prototype.hasOwnProperty(qa) && Z(Ga, qa) < 0 && (za.prototype[qa] = /* @__PURE__ */ (function(e6) {
    return function() {
      return e6.apply(this.doc, arguments);
    };
  })(Eo.prototype[qa]));
  return ke(Eo), za.inputStyles = { textarea: Ka, contenteditable: Ra }, za.defineMode = function(e6) {
    za.defaults.mode || "null" == e6 || (za.defaults.mode = e6), Be.apply(this, arguments);
  }, za.defineMIME = function(e6, t4) {
    He[e6] = t4;
  }, za.defineMode("null", (function() {
    return { token: function(e6) {
      return e6.skipToEnd();
    } };
  })), za.defineMIME("text/plain", "null"), za.defineExtension = function(e6, t4) {
    za.prototype[e6] = t4;
  }, za.defineDocExtension = function(e6, t4) {
    Eo.prototype[e6] = t4;
  }, za.fromTextArea = function(e6, t4) {
    if ((t4 = t4 ? B(t4) : {}).value = e6.value, !t4.tabindex && e6.tabIndex && (t4.tabindex = e6.tabIndex), !t4.placeholder && e6.placeholder && (t4.placeholder = e6.placeholder), null == t4.autofocus) {
      var r3 = P(e6.ownerDocument);
      t4.autofocus = r3 == e6 || null != e6.getAttribute("autofocus") && r3 == document.body;
    }
    function n4() {
      e6.value = l4.getValue();
    }
    var i5;
    if (e6.form && (pe(e6.form, "submit", n4), !t4.leaveSubmitMethodAlone)) {
      var o4 = e6.form;
      i5 = o4.submit;
      try {
        var a2 = o4.submit = function() {
          n4(), o4.submit = i5, o4.submit(), o4.submit = a2;
        };
      } catch (e7) {
      }
    }
    t4.finishInit = function(r4) {
      r4.save = n4, r4.getTextArea = function() {
        return e6;
      }, r4.toTextArea = function() {
        r4.toTextArea = isNaN, n4(), e6.parentNode.removeChild(r4.getWrapperElement()), e6.style.display = "", e6.form && (ge(e6.form, "submit", n4), t4.leaveSubmitMethodAlone || "function" != typeof e6.form.submit || (e6.form.submit = i5));
      };
    }, e6.style.display = "none";
    var l4 = za((function(t5) {
      return e6.parentNode.insertBefore(t5, e6.nextSibling);
    }), t4);
    return l4;
  }, (function(e6) {
    e6.off = ge, e6.on = pe, e6.wheelEventPixels = Si, e6.Doc = Eo, e6.splitLines = Ee, e6.countColumn = $, e6.findColumn = G, e6.isWordChar = re, e6.Pass = j, e6.signal = ve, e6.Line = qt, e6.changeEnd = Oi, e6.scrollbarModel = Vn, e6.Pos = nt, e6.cmpPos = it, e6.modes = Ie, e6.mimeModes = He, e6.resolveMode = $e, e6.getMode = Re, e6.modeExtensions = Ze, e6.extendMode = je, e6.copyState = Ue, e6.startState = Ke, e6.innerMode = Ve, e6.commands = na, e6.keyMap = Uo, e6.keyName = Yo, e6.isModifierKey = qo, e6.lookupKey = Go, e6.normalizeKeyMap = Ko, e6.StringStream = Ge, e6.SharedTextMarker = Oo, e6.TextMarker = Mo, e6.LineWidget = To, e6.e_preventDefault = xe, e6.e_stopPropagation = Ce, e6.e_stop = Te, e6.addClass = E, e6.contains = N, e6.rmClass = A2, e6.keyNames = $o;
  })(za), za.version = "5.65.9", za;
}, (window || self).CodeMirror = e4(), (function(e5) {
  function t3(e6, t4) {
    if (this.cm = e6, this.options = t4, this.widget = null, this.debounce = 0, this.tick = 0, this.startPos = this.cm.getCursor("start"), this.startLen = this.cm.getLine(this.startPos.line).length - this.cm.getSelection().length, this.options.updateOnCursorActivity) {
      var r3 = this;
      e6.on("cursorActivity", this.activityFunc = function() {
        r3.cursorActivity();
      });
    }
  }
  e5.showHint = function(e6, t4, r3) {
    if (!t4) return e6.showHint(r3);
    r3 && r3.async && (t4.async = true);
    var n4 = { hint: t4 };
    if (r3) for (var i5 in r3) n4[i5] = r3[i5];
    return e6.showHint(n4);
  }, e5.defineExtension("showHint", (function(r3) {
    r3 = (function(e6, t4, r4) {
      var n5 = e6.options.hintOptions, i6 = {};
      for (var o5 in s2) i6[o5] = s2[o5];
      if (n5) for (var o5 in n5) void 0 !== n5[o5] && (i6[o5] = n5[o5]);
      if (r4) for (var o5 in r4) void 0 !== r4[o5] && (i6[o5] = r4[o5]);
      return i6.hint.resolve && (i6.hint = i6.hint.resolve(e6, t4)), i6;
    })(this, this.getCursor("start"), r3);
    var n4 = this.listSelections();
    if (!(n4.length > 1)) {
      if (this.somethingSelected()) {
        if (!r3.hint.supportsSelection) return;
        for (var i5 = 0; i5 < n4.length; i5++) if (n4[i5].head.line != n4[i5].anchor.line) return;
      }
      this.state.completionActive && this.state.completionActive.close();
      var o4 = this.state.completionActive = new t3(this, r3);
      o4.options.hint && (e5.signal(this, "startCompletion", this), o4.update(true));
    }
  })), e5.defineExtension("closeHint", (function() {
    this.state.completionActive && this.state.completionActive.close();
  }));
  var r2 = window.requestAnimationFrame || function(e6) {
    return setTimeout(e6, 1e3 / 60);
  }, n3 = window.cancelAnimationFrame || clearTimeout;
  function i4(e6) {
    return "string" == typeof e6 ? e6 : e6.text;
  }
  function o3(e6, t4) {
    for (; t4 && t4 != e6; ) {
      if ("LI" === t4.nodeName.toUpperCase() && t4.parentNode == e6) return t4;
      t4 = t4.parentNode;
    }
  }
  function a(t4, r3) {
    this.id = "cm-complete-" + Math.floor(Math.random(1e6)), this.completion = t4, this.data = r3, this.picked = false;
    var n4 = this, a2 = t4.cm, l4 = a2.getInputField().ownerDocument, s3 = l4.defaultView || l4.parentWindow, c = this.hints = l4.createElement("ul");
    c.setAttribute("role", "listbox"), c.setAttribute("aria-expanded", "true"), c.id = this.id;
    var u = t4.cm.options.theme;
    c.className = "CodeMirror-hints " + u, this.selectedHint = r3.selectedHint || 0;
    for (var d = r3.list, f = 0; f < d.length; ++f) {
      var h = c.appendChild(l4.createElement("li")), p = d[f], m = "CodeMirror-hint" + (f != this.selectedHint ? "" : " CodeMirror-hint-active");
      null != p.className && (m = p.className + " " + m), h.className = m, f == this.selectedHint && h.setAttribute("aria-selected", "true"), h.id = this.id + "-" + f, h.setAttribute("role", "option"), p.render ? p.render(h, r3, p) : h.appendChild(l4.createTextNode(p.displayText || i4(p))), h.hintId = f;
    }
    var g = t4.options.container || l4.body, v = a2.cursorCoords(t4.options.alignWithWord ? r3.from : null), y = v.left, b = v.bottom, w = true, k = 0, x2 = 0;
    if (g !== l4.body) {
      var C = -1 !== ["absolute", "relative", "fixed"].indexOf(s3.getComputedStyle(g).position) ? g : g.offsetParent, S = C.getBoundingClientRect(), T = l4.body.getBoundingClientRect();
      k = S.left - T.left - C.scrollLeft, x2 = S.top - T.top - C.scrollTop;
    }
    c.style.left = y - k + "px", c.style.top = b - x2 + "px";
    var L = s3.innerWidth || Math.max(l4.body.offsetWidth, l4.documentElement.offsetWidth), A2 = s3.innerHeight || Math.max(l4.body.offsetHeight, l4.documentElement.offsetHeight);
    g.appendChild(c), a2.getInputField().setAttribute("aria-autocomplete", "list"), a2.getInputField().setAttribute("aria-owns", this.id), a2.getInputField().setAttribute("aria-activedescendant", this.id + "-" + this.selectedHint);
    var M, z = t4.options.moveOnOverlap ? c.getBoundingClientRect() : new DOMRect(), O = !!t4.options.paddingForScrollbar && c.scrollHeight > c.clientHeight + 1;
    if (setTimeout((function() {
      M = a2.getScrollInfo();
    })), z.bottom - A2 > 0) {
      var _ = z.bottom - z.top, N = z.top - (v.bottom - v.top) - 2;
      A2 - z.top < N ? (_ > N && (c.style.height = (_ = N) + "px"), c.style.top = (b = v.top - _) + x2 + "px", w = false) : c.style.height = A2 - z.top - 2 + "px";
    }
    var P, E = z.right - L;
    if (O && (E += a2.display.nativeBarWidth), E > 0 && (z.right - z.left > L && (c.style.width = L - 5 + "px", E -= z.right - z.left - L), c.style.left = (y = Math.max(v.left - E - k, 0)) + "px"), O) for (var D2 = c.firstChild; D2; D2 = D2.nextSibling) D2.style.paddingRight = a2.display.nativeBarWidth + "px";
    a2.addKeyMap(this.keyMap = (function(e6, t5) {
      var r4 = { Up: function() {
        t5.moveFocus(-1);
      }, Down: function() {
        t5.moveFocus(1);
      }, PageUp: function() {
        t5.moveFocus(1 - t5.menuSize(), true);
      }, PageDown: function() {
        t5.moveFocus(t5.menuSize() - 1, true);
      }, Home: function() {
        t5.setFocus(0);
      }, End: function() {
        t5.setFocus(t5.length - 1);
      }, Enter: t5.pick, Tab: t5.pick, Esc: t5.close };
      /Mac/.test(navigator.platform) && (r4["Ctrl-P"] = function() {
        t5.moveFocus(-1);
      }, r4["Ctrl-N"] = function() {
        t5.moveFocus(1);
      });
      var n5 = e6.options.customKeys, i5 = n5 ? {} : r4;
      function o4(e7, n6) {
        var o5;
        o5 = "string" != typeof n6 ? function(e8) {
          return n6(e8, t5);
        } : r4.hasOwnProperty(n6) ? r4[n6] : n6, i5[e7] = o5;
      }
      if (n5) for (var a3 in n5) n5.hasOwnProperty(a3) && o4(a3, n5[a3]);
      var l5 = e6.options.extraKeys;
      if (l5) for (var a3 in l5) l5.hasOwnProperty(a3) && o4(a3, l5[a3]);
      return i5;
    })(t4, { moveFocus: function(e6, t5) {
      n4.changeActive(n4.selectedHint + e6, t5);
    }, setFocus: function(e6) {
      n4.changeActive(e6);
    }, menuSize: function() {
      return n4.screenAmount();
    }, length: d.length, close: function() {
      t4.close();
    }, pick: function() {
      n4.pick();
    }, data: r3 })), t4.options.closeOnUnfocus && (a2.on("blur", this.onBlur = function() {
      P = setTimeout((function() {
        t4.close();
      }), 100);
    }), a2.on("focus", this.onFocus = function() {
      clearTimeout(P);
    })), a2.on("scroll", this.onScroll = function() {
      var e6 = a2.getScrollInfo(), r4 = a2.getWrapperElement().getBoundingClientRect();
      M || (M = a2.getScrollInfo());
      var n5 = b + M.top - e6.top, i5 = n5 - (s3.pageYOffset || (l4.documentElement || l4.body).scrollTop);
      if (w || (i5 += c.offsetHeight), i5 <= r4.top || i5 >= r4.bottom) return t4.close();
      c.style.top = n5 + "px", c.style.left = y + M.left - e6.left + "px";
    }), e5.on(c, "dblclick", (function(e6) {
      var t5 = o3(c, e6.target || e6.srcElement);
      t5 && null != t5.hintId && (n4.changeActive(t5.hintId), n4.pick());
    })), e5.on(c, "click", (function(e6) {
      var r4 = o3(c, e6.target || e6.srcElement);
      r4 && null != r4.hintId && (n4.changeActive(r4.hintId), t4.options.completeOnSingleClick && n4.pick());
    })), e5.on(c, "mousedown", (function() {
      setTimeout((function() {
        a2.focus();
      }), 20);
    }));
    var W = this.getSelectedHintRange();
    return 0 === W.from && 0 === W.to || this.scrollToActive(), e5.signal(r3, "select", d[this.selectedHint], c.childNodes[this.selectedHint]), true;
  }
  function l3(e6, t4, r3, n4) {
    if (e6.async) e6(t4, n4, r3);
    else {
      var i5 = e6(t4, r3);
      i5 && i5.then ? i5.then(n4) : n4(i5);
    }
  }
  t3.prototype = { close: function() {
    this.active() && (this.cm.state.completionActive = null, this.tick = null, this.options.updateOnCursorActivity && this.cm.off("cursorActivity", this.activityFunc), this.widget && this.data && e5.signal(this.data, "close"), this.widget && this.widget.close(), e5.signal(this.cm, "endCompletion", this.cm));
  }, active: function() {
    return this.cm.state.completionActive == this;
  }, pick: function(t4, r3) {
    var n4 = t4.list[r3], o4 = this;
    this.cm.operation((function() {
      n4.hint ? n4.hint(o4.cm, t4, n4) : o4.cm.replaceRange(i4(n4), n4.from || t4.from, n4.to || t4.to, "complete"), e5.signal(t4, "pick", n4), o4.cm.scrollIntoView();
    })), this.options.closeOnPick && this.close();
  }, cursorActivity: function() {
    this.debounce && (n3(this.debounce), this.debounce = 0);
    var e6 = this.startPos;
    this.data && (e6 = this.data.from);
    var t4 = this.cm.getCursor(), i5 = this.cm.getLine(t4.line);
    if (t4.line != this.startPos.line || i5.length - t4.ch != this.startLen - this.startPos.ch || t4.ch < e6.ch || this.cm.somethingSelected() || !t4.ch || this.options.closeCharacters.test(i5.charAt(t4.ch - 1))) this.close();
    else {
      var o4 = this;
      this.debounce = r2((function() {
        o4.update();
      })), this.widget && this.widget.disable();
    }
  }, update: function(e6) {
    if (null != this.tick) {
      var t4 = this, r3 = ++this.tick;
      l3(this.options.hint, this.cm, this.options, (function(n4) {
        t4.tick == r3 && t4.finishUpdate(n4, e6);
      }));
    }
  }, finishUpdate: function(t4, r3) {
    this.data && e5.signal(this.data, "update");
    var n4 = this.widget && this.widget.picked || r3 && this.options.completeSingle;
    this.widget && this.widget.close(), this.data = t4, t4 && t4.list.length && (n4 && 1 == t4.list.length ? this.pick(t4, 0) : (this.widget = new a(this, t4), e5.signal(t4, "shown")));
  } }, a.prototype = { close: function() {
    if (this.completion.widget == this) {
      this.completion.widget = null, this.hints.parentNode && this.hints.parentNode.removeChild(this.hints), this.completion.cm.removeKeyMap(this.keyMap);
      var e6 = this.completion.cm.getInputField();
      e6.removeAttribute("aria-activedescendant"), e6.removeAttribute("aria-owns");
      var t4 = this.completion.cm;
      this.completion.options.closeOnUnfocus && (t4.off("blur", this.onBlur), t4.off("focus", this.onFocus)), t4.off("scroll", this.onScroll);
    }
  }, disable: function() {
    this.completion.cm.removeKeyMap(this.keyMap);
    var e6 = this;
    this.keyMap = { Enter: function() {
      e6.picked = true;
    } }, this.completion.cm.addKeyMap(this.keyMap);
  }, pick: function() {
    this.completion.pick(this.data, this.selectedHint);
  }, changeActive: function(t4, r3) {
    if (t4 >= this.data.list.length ? t4 = r3 ? this.data.list.length - 1 : 0 : t4 < 0 && (t4 = r3 ? 0 : this.data.list.length - 1), this.selectedHint != t4) {
      var n4 = this.hints.childNodes[this.selectedHint];
      n4 && (n4.className = n4.className.replace(" CodeMirror-hint-active", ""), n4.removeAttribute("aria-selected")), (n4 = this.hints.childNodes[this.selectedHint = t4]).className += " CodeMirror-hint-active", n4.setAttribute("aria-selected", "true"), this.completion.cm.getInputField().setAttribute("aria-activedescendant", n4.id), this.scrollToActive(), e5.signal(this.data, "select", this.data.list[this.selectedHint], n4);
    }
  }, scrollToActive: function() {
    var e6 = this.getSelectedHintRange(), t4 = this.hints.childNodes[e6.from], r3 = this.hints.childNodes[e6.to], n4 = this.hints.firstChild;
    t4.offsetTop < this.hints.scrollTop ? this.hints.scrollTop = t4.offsetTop - n4.offsetTop : r3.offsetTop + r3.offsetHeight > this.hints.scrollTop + this.hints.clientHeight && (this.hints.scrollTop = r3.offsetTop + r3.offsetHeight - this.hints.clientHeight + n4.offsetTop);
  }, screenAmount: function() {
    return Math.floor(this.hints.clientHeight / this.hints.firstChild.offsetHeight) || 1;
  }, getSelectedHintRange: function() {
    var e6 = this.completion.options.scrollMargin || 0;
    return { from: Math.max(0, this.selectedHint - e6), to: Math.min(this.data.list.length - 1, this.selectedHint + e6) };
  } }, e5.registerHelper("hint", "auto", { resolve: function(t4, r3) {
    var n4, i5 = t4.getHelpers(r3, "hint");
    if (i5.length) {
      var o4 = function(e6, t5, r4) {
        var n5 = (function(e7, t6) {
          if (!e7.somethingSelected()) return t6;
          for (var r5 = [], n6 = 0; n6 < t6.length; n6++) t6[n6].supportsSelection && r5.push(t6[n6]);
          return r5;
        })(e6, i5);
        !(function i6(o5) {
          if (o5 == n5.length) return t5(null);
          l3(n5[o5], e6, r4, (function(e7) {
            e7 && e7.list.length > 0 ? t5(e7) : i6(o5 + 1);
          }));
        })(0);
      };
      return o4.async = true, o4.supportsSelection = true, o4;
    }
    return (n4 = t4.getHelper(t4.getCursor(), "hintWords")) ? function(t5) {
      return e5.hint.fromList(t5, { words: n4 });
    } : e5.hint.anyword ? function(t5, r4) {
      return e5.hint.anyword(t5, r4);
    } : function() {
    };
  } }), e5.registerHelper("hint", "fromList", (function(t4, r3) {
    var n4, i5 = t4.getCursor(), o4 = t4.getTokenAt(i5), a2 = e5.Pos(i5.line, o4.start), l4 = i5;
    o4.start < i5.ch && /\w/.test(o4.string.charAt(i5.ch - o4.start - 1)) ? n4 = o4.string.substr(0, i5.ch - o4.start) : (n4 = "", a2 = i5);
    for (var s3 = [], c = 0; c < r3.words.length; c++) {
      var u = r3.words[c];
      u.slice(0, n4.length) == n4 && s3.push(u);
    }
    if (s3.length) return { list: s3, from: a2, to: l4 };
  })), e5.commands.autocomplete = e5.showHint;
  var s2 = { hint: e5.hint.auto, completeSingle: true, alignWithWord: true, closeCharacters: /[\s()\[\]{};:>,]/, closeOnPick: true, closeOnUnfocus: true, updateOnCursorActivity: true, completeOnSingleClick: true, container: null, customKeys: null, extraKeys: null, paddingForScrollbar: true, moveOnOverlap: true };
  e5.defineOption("hintOptions", null);
})(CodeMirror), (function(e5) {
  function t3(t4, r3, i4, o3) {
    if (i4 && i4.call) {
      var a = i4;
      i4 = null;
    } else a = n3(t4, i4, "rangeFinder");
    "number" == typeof r3 && (r3 = e5.Pos(r3, 0));
    var l3 = n3(t4, i4, "minFoldSize");
    function s2(e6) {
      var n4 = a(t4, r3);
      if (!n4 || n4.to.line - n4.from.line < l3) return null;
      if ("fold" === o3) return n4;
      for (var i5 = t4.findMarksAt(n4.from), s3 = 0; s3 < i5.length; ++s3) if (i5[s3].__isFold) {
        if (!e6) return null;
        n4.cleared = true, i5[s3].clear();
      }
      return n4;
    }
    var c = s2(true);
    if (n3(t4, i4, "scanUp")) for (; !c && r3.line > t4.firstLine(); ) r3 = e5.Pos(r3.line - 1, 0), c = s2(false);
    if (c && !c.cleared && "unfold" !== o3) {
      var u = (function(e6, t5, r4) {
        var i5 = n3(e6, t5, "widget");
        if ("function" == typeof i5 && (i5 = i5(r4.from, r4.to)), "string" == typeof i5) {
          var o4 = document.createTextNode(i5);
          (i5 = document.createElement("span")).appendChild(o4), i5.className = "CodeMirror-foldmarker";
        } else i5 && (i5 = i5.cloneNode(true));
        return i5;
      })(t4, i4, c);
      e5.on(u, "mousedown", (function(t5) {
        d.clear(), e5.e_preventDefault(t5);
      }));
      var d = t4.markText(c.from, c.to, { replacedWith: u, clearOnEnter: n3(t4, i4, "clearOnEnter"), __isFold: true });
      d.on("clear", (function(r4, n4) {
        e5.signal(t4, "unfold", t4, r4, n4);
      })), e5.signal(t4, "fold", t4, c.from, c.to);
    }
  }
  e5.newFoldFunction = function(e6, r3) {
    return function(n4, i4) {
      t3(n4, i4, { rangeFinder: e6, widget: r3 });
    };
  }, e5.defineExtension("foldCode", (function(e6, r3, n4) {
    t3(this, e6, r3, n4);
  })), e5.defineExtension("isFolded", (function(e6) {
    for (var t4 = this.findMarksAt(e6), r3 = 0; r3 < t4.length; ++r3) if (t4[r3].__isFold) return true;
  })), e5.commands.toggleFold = function(e6) {
    e6.foldCode(e6.getCursor());
  }, e5.commands.fold = function(e6) {
    e6.foldCode(e6.getCursor(), null, "fold");
  }, e5.commands.unfold = function(e6) {
    e6.foldCode(e6.getCursor(), { scanUp: false }, "unfold");
  }, e5.commands.foldAll = function(t4) {
    t4.operation((function() {
      for (var r3 = t4.firstLine(), n4 = t4.lastLine(); r3 <= n4; r3++) t4.foldCode(e5.Pos(r3, 0), { scanUp: false }, "fold");
    }));
  }, e5.commands.unfoldAll = function(t4) {
    t4.operation((function() {
      for (var r3 = t4.firstLine(), n4 = t4.lastLine(); r3 <= n4; r3++) t4.foldCode(e5.Pos(r3, 0), { scanUp: false }, "unfold");
    }));
  }, e5.registerHelper("fold", "combine", (function() {
    var e6 = Array.prototype.slice.call(arguments, 0);
    return function(t4, r3) {
      for (var n4 = 0; n4 < e6.length; ++n4) {
        var i4 = e6[n4](t4, r3);
        if (i4) return i4;
      }
    };
  })), e5.registerHelper("fold", "auto", (function(e6, t4) {
    for (var r3 = e6.getHelpers(t4, "fold"), n4 = 0; n4 < r3.length; n4++) {
      var i4 = r3[n4](e6, t4);
      if (i4) return i4;
    }
  }));
  var r2 = { rangeFinder: e5.fold.auto, widget: "\u2194", minFoldSize: 0, scanUp: false, clearOnEnter: true };
  function n3(e6, t4, n4) {
    if (t4 && void 0 !== t4[n4]) return t4[n4];
    var i4 = e6.options.foldOptions;
    return i4 && void 0 !== i4[n4] ? i4[n4] : r2[n4];
  }
  e5.defineOption("foldOptions", null), e5.defineExtension("foldOption", (function(e6, t4) {
    return n3(this, e6, t4);
  }));
})(CodeMirror), (function(e5) {
  var t3 = {}, r2 = /[^\s\u00a0]/, n3 = e5.Pos, i4 = e5.cmpPos;
  function o3(e6) {
    var t4 = e6.search(r2);
    return -1 == t4 ? 0 : t4;
  }
  function a(e6, t4) {
    var r3 = e6.getMode();
    return false !== r3.useInnerComments && r3.innerMode ? e6.getModeAt(t4) : r3;
  }
  e5.commands.toggleComment = function(e6) {
    e6.toggleComment();
  }, e5.defineExtension("toggleComment", (function(e6) {
    e6 || (e6 = t3);
    for (var r3 = this, i5 = 1 / 0, o4 = this.listSelections(), a2 = null, l3 = o4.length - 1; l3 >= 0; l3--) {
      var s2 = o4[l3].from(), c = o4[l3].to();
      s2.line >= i5 || (c.line >= i5 && (c = n3(i5, 0)), i5 = s2.line, null == a2 ? r3.uncomment(s2, c, e6) ? a2 = "un" : (r3.lineComment(s2, c, e6), a2 = "line") : "un" == a2 ? r3.uncomment(s2, c, e6) : r3.lineComment(s2, c, e6));
    }
  })), e5.defineExtension("lineComment", (function(e6, i5, l3) {
    l3 || (l3 = t3);
    var s2 = this, c = a(s2, e6), u = s2.getLine(e6.line);
    if (null != u && (d = e6, f = u, !/\bstring\b/.test(s2.getTokenTypeAt(n3(d.line, 0))) || /^[\'\"\`]/.test(f))) {
      var d, f, h = l3.lineComment || c.lineComment;
      if (h) {
        var p = Math.min(0 != i5.ch || i5.line == e6.line ? i5.line + 1 : i5.line, s2.lastLine() + 1), m = null == l3.padding ? " " : l3.padding, g = l3.commentBlankLines || e6.line == i5.line;
        s2.operation((function() {
          if (l3.indent) {
            for (var t4 = null, i6 = e6.line; i6 < p; ++i6) {
              var a2 = -1 === (c2 = s2.getLine(i6)).search(r2) ? c2 : c2.slice(0, o3(c2));
              (null == t4 || t4.length > a2.length) && (t4 = a2);
            }
            for (i6 = e6.line; i6 < p; ++i6) {
              var c2 = s2.getLine(i6), u2 = t4.length;
              (g || r2.test(c2)) && (c2.slice(0, u2) != t4 && (u2 = o3(c2)), s2.replaceRange(t4 + h + m, n3(i6, 0), n3(i6, u2)));
            }
          } else for (i6 = e6.line; i6 < p; ++i6) (g || r2.test(s2.getLine(i6))) && s2.replaceRange(h + m, n3(i6, 0));
        }));
      } else (l3.blockCommentStart || c.blockCommentStart) && (l3.fullLines = true, s2.blockComment(e6, i5, l3));
    }
  })), e5.defineExtension("blockComment", (function(e6, o4, l3) {
    l3 || (l3 = t3);
    var s2 = this, c = a(s2, e6), u = l3.blockCommentStart || c.blockCommentStart, d = l3.blockCommentEnd || c.blockCommentEnd;
    if (u && d) {
      if (!/\bcomment\b/.test(s2.getTokenTypeAt(n3(e6.line, 0)))) {
        var f = Math.min(o4.line, s2.lastLine());
        f != e6.line && 0 == o4.ch && r2.test(s2.getLine(f)) && --f;
        var h = null == l3.padding ? " " : l3.padding;
        e6.line > f || s2.operation((function() {
          if (0 != l3.fullLines) {
            var t4 = r2.test(s2.getLine(f));
            s2.replaceRange(h + d, n3(f)), s2.replaceRange(u + h, n3(e6.line, 0));
            var a2 = l3.blockCommentLead || c.blockCommentLead;
            if (null != a2) for (var p = e6.line + 1; p <= f; ++p) (p != f || t4) && s2.replaceRange(a2 + h, n3(p, 0));
          } else {
            var m = 0 == i4(s2.getCursor("to"), o4), g = !s2.somethingSelected();
            s2.replaceRange(d, o4), m && s2.setSelection(g ? o4 : s2.getCursor("from"), o4), s2.replaceRange(u, e6);
          }
        }));
      }
    } else (l3.lineComment || c.lineComment) && 0 != l3.fullLines && s2.lineComment(e6, o4, l3);
  })), e5.defineExtension("uncomment", (function(e6, i5, o4) {
    o4 || (o4 = t3);
    var l3, s2 = this, c = a(s2, e6), u = Math.min(0 != i5.ch || i5.line == e6.line ? i5.line : i5.line - 1, s2.lastLine()), d = Math.min(e6.line, u), f = o4.lineComment || c.lineComment, h = [], p = null == o4.padding ? " " : o4.padding;
    e: if (f) {
      for (var m = d; m <= u; ++m) {
        var g = s2.getLine(m), v = g.indexOf(f);
        if (v > -1 && !/comment/.test(s2.getTokenTypeAt(n3(m, v + 1))) && (v = -1), -1 == v && r2.test(g)) break e;
        if (v > -1 && r2.test(g.slice(0, v))) break e;
        h.push(g);
      }
      if (s2.operation((function() {
        for (var e7 = d; e7 <= u; ++e7) {
          var t4 = h[e7 - d], r3 = t4.indexOf(f), i6 = r3 + f.length;
          r3 < 0 || (t4.slice(i6, i6 + p.length) == p && (i6 += p.length), l3 = true, s2.replaceRange("", n3(e7, r3), n3(e7, i6)));
        }
      })), l3) return true;
    }
    var y = o4.blockCommentStart || c.blockCommentStart, b = o4.blockCommentEnd || c.blockCommentEnd;
    if (!y || !b) return false;
    var w = o4.blockCommentLead || c.blockCommentLead, k = s2.getLine(d), x2 = k.indexOf(y);
    if (-1 == x2) return false;
    var C = u == d ? k : s2.getLine(u), S = C.indexOf(b, u == d ? x2 + y.length : 0), T = n3(d, x2 + 1), L = n3(u, S + 1);
    if (-1 == S || !/comment/.test(s2.getTokenTypeAt(T)) || !/comment/.test(s2.getTokenTypeAt(L)) || s2.getRange(T, L, "\n").indexOf(b) > -1) return false;
    var A2 = k.lastIndexOf(y, e6.ch), M = -1 == A2 ? -1 : k.slice(0, e6.ch).indexOf(b, A2 + y.length);
    if (-1 != A2 && -1 != M && M + b.length != e6.ch) return false;
    M = C.indexOf(b, i5.ch);
    var z = C.slice(i5.ch).lastIndexOf(y, M - i5.ch);
    return A2 = -1 == M || -1 == z ? -1 : i5.ch + z, (-1 == M || -1 == A2 || A2 == i5.ch) && (s2.operation((function() {
      s2.replaceRange("", n3(u, S - (p && C.slice(S - p.length, S) == p ? p.length : 0)), n3(u, S + b.length));
      var e7 = x2 + y.length;
      if (p && k.slice(e7, e7 + p.length) == p && (e7 += p.length), s2.replaceRange("", n3(d, x2), n3(d, e7)), w) for (var t4 = d + 1; t4 <= u; ++t4) {
        var i6 = s2.getLine(t4), o5 = i6.indexOf(w);
        if (-1 != o5 && !r2.test(i6.slice(0, o5))) {
          var a2 = o5 + w.length;
          p && i6.slice(a2, a2 + p.length) == p && (a2 += p.length), s2.replaceRange("", n3(t4, o5), n3(t4, a2));
        }
      }
    })), true);
  }));
})(CodeMirror), r.prototype.start = function(e5) {
  return this.stream = e5, this.line = 0, this.string = e5.string.slice(e5.start), this.startLine = e5.string, this.startPos = e5.start, this;
}, r.prototype.startLinebreak = function() {
  return this.stream = null, this.line = this.startPos = 0, this.string = "\n", this.startLine = "", this;
}, r.prototype.copy = function() {
  var e5 = this.copyInstance || (this.copyInstance = new r());
  return e5.stream = this.stream, e5.startPos = this.startPos, e5.line = this.line, e5.startLine = this.startLine, e5.string = this.string, e5;
}, r.prototype.updateStart = function() {
  this.startLine = this.stream ? 0 == this.line ? this.stream.string : this.stream.lookAhead(this.line) : "", this.startPos = this.startLine.length - (this.string.length - 1);
}, r.prototype.ahead = function(e5) {
  for (; ; ) {
    if (e5 <= this.string.length) return true;
    if (10 !== this.string.charCodeAt(this.string.length - 1)) this.string += "\n";
    else {
      if (3 === this.line || !this.stream || !this.stream.lookAhead) return false;
      var t3 = this.stream.lookAhead(this.line + 1);
      if (null == t3) return false;
      this.string += t3 + "\n", this.line++;
    }
  }
};
var n2 = null;
function i3(e5, i4) {
  this.State = (function(e6, i5) {
    function o3(e7, t3) {
      this.stack = e7, this.context = t3;
    }
    function a() {
      return null;
    }
    return o3.prototype.matchNext = function(r2, i6, o4, a2) {
      for (var l3 = this.stack.length - 1, s2 = this.stack[l3], c = e6.nodes[s2], u = 0; u < c.length; u++) {
        var d, f, h = c[u];
        if (0 === h) d = i6, f = c[++u];
        else {
          if (1 === h || 2 === h) {
            var p = c[++u], m = c[++u];
            this.go(m);
            var g = this.context;
            if (2 === h) {
              var v = c[++u];
              this.context = new t2(v.name, v.token, this.stack.length, this.context, r2.startLine, r2.startPos);
            }
            this.stack.push(p);
            var y = this.matchNext(r2, i6, 0, false);
            if (y === i6 && (y = this.matchNext(r2, i6, u == c.length - 1 ? o4 : 0, a2)), y < 0) {
              this.stack.length = l3 + 1, this.stack[l3] = s2, this.context = g;
              continue;
            }
            return y;
          }
          if (3 === h) {
            var b = c[++u];
            d = this.matchExpr(c[++u], r2, i6), f = c[++u], d > i6 && (n2 = b);
          } else d = this.matchExpr(h, r2, i6), f = c[++u];
        }
        if (d < 0) {
          if (!(o4 > 0 && u == c.length - 1)) continue;
          o4--, d = i6;
        }
        if (this.go(f), !a2 && -1 === f || 0 === this.stack.length) return d;
        if (d > i6) return d;
        if ((d = this.matchNext(r2, i6, u == c.length - 1 ? o4 : 0, a2)) >= 0) return d;
        this.stack.length = l3 + 1, this.stack[l3] = s2;
      }
      return -1;
    }, o3.prototype.go = function(e7) {
      for (this.stack.pop(); this.context && this.context.depth > this.stack.length; ) this.context = this.context.parent;
      -1 !== e7 && this.stack.push(e7);
    }, o3.prototype.runMaybe = function(e7, t3, r2) {
      return n2 = null, this.matchNext(e7, t3, r2, true);
    }, o3.prototype.forward = function(t3, r2) {
      var n3 = this.runMaybe(t3, r2, 2);
      return n3 < 0 && (this.stack.push(e6.token), n3 = this.runMaybe(t3, r2, 0)), n3;
    }, o3.prototype.lookahead = function(e7, t3, r2) {
      var i6 = n2, o4 = new this.constructor([r2], null);
      for (e7 = e7.copy(); ; ) {
        e7.updateStart();
        var a2 = o4.runMaybe(e7, t3, 0);
        if (a2 < 0) return n2 = i6, false;
        if (0 === o4.stack.length) return n2 = i6, true;
        t3 = a2;
      }
    }, o3.prototype.matchExpr = function(e7, t3, r2) {
      if ("string" == typeof e7) {
        var n3 = r2 + e7.length;
        return t3.ahead(n3) && t3.string.slice(r2, n3) === e7 ? n3 : -1;
      }
      if (e7.exec) {
        var o4 = t3.ahead(r2 + 1) && e7.exec(r2 > 0 ? t3.string.slice(r2) : t3.string);
        return o4 ? r2 + o4[0].length : -1;
      }
      var l3, s2 = e7[0];
      if (0 === s2) {
        for (var c = 1; c < e7.length; c++) if ((r2 = this.matchExpr(e7[c], t3, r2)) < 0) return -1;
        return r2;
      }
      if (1 === s2) {
        c = 1;
        for (var u = e7.length - 1; ; c++) {
          var d = this.matchExpr(e7[c], t3, r2);
          if (c === u || d > -1) return d;
        }
        return -1;
      }
      if (2 !== s2 && 3 !== s2) {
        if (4 === s2) return Math.max(this.matchExpr(e7[1], t3, r2), r2);
        if (5 === s2) return this.lookahead(t3, r2, e7[1]) ? r2 : -1;
        if (6 === s2) return this.lookahead(t3, r2, e7[1]) ? -1 : r2;
        if (7 === s2) {
          var f, h, p = r2 ? t3.string.lastIndexOf("\n", r2 - 1) : -1;
          if (t3.stream && p < 0) f = t3.stream.string, h = r2 + t3.stream.start;
          else {
            var m = t3.string.indexOf("\n", r2);
            f = t3.string.slice(p + 1, m < 0 ? t3.string.length : m), h = r2 - (p + 1);
          }
          return i5.predicates[e7[1]](f, h, this.context, t3.stream ? (l3 = t3.stream, function(e8) {
            return l3.lookAhead(e8);
          }) : a) ? r2 : -1;
        }
        throw Error("Unknown match type " + e7);
      }
      if (3 === s2 && (r2 = this.matchExpr(e7[1], t3, r2)) < 0) return -1;
      for (; ; ) {
        var g = this.matchExpr(e7[1], t3, r2);
        if (-1 == g) return r2;
        r2 = g;
      }
    }, o3.prototype.contextAt = function(e7, t3) {
      var n3 = this.copy(), i6 = new r(), o4 = 0, a2 = this.context;
      for (i6.string = e7 + "\n", i6.startLine = e7; ; ) {
        var l3 = n3.runMaybe(i6, o4, 0);
        if (-1 == l3) return n3.context;
        if (l3 > t3) {
          var s2 = n3.context;
          if (o4 == t3) e: for (; s2; ) {
            for (var c = a2; c; c = c.parent) if (c === s2) break e;
            s2 = s2.parent;
          }
          return s2;
        }
        o4 = l3, a2 = n3.context;
      }
    }, o3.prototype.copy = function() {
      return new this.constructor(this.stack.slice(), this.context);
    }, o3.start = function() {
      return new this([e6.start], null);
    }, o3;
  })(e5, i4 || {}), this.mcx = new r();
}
CodeMirror.GrammarMode = i3, i3.prototype.startState = function() {
  return this.State.start();
}, i3.prototype.copyState = function(e5) {
  return e5.copy();
}, i3.prototype.token = function(e5, t3) {
  e5.pos += t3.forward(this.mcx.start(e5), 0);
  for (var r2 = n2, i4 = t3.context; i4; i4 = i4.parent) i4.tokenType && (r2 = i4.tokenType + (r2 ? " " + r2 : ""));
  return e5.eol() && t3.forward(this.mcx, e5.pos - e5.start), r2;
}, i3.prototype.blankLine = function(e5) {
  e5.forward(this.mcx.startLinebreak(), 0);
}, (function(e5, t3) {
  !(function(e6) {
    function t4(e7) {
      if (e7 && e7.__esModule) return e7;
      var t5 = /* @__PURE__ */ Object.create(null);
      return e7 && Object.keys(e7).forEach((function(r3) {
        if ("default" !== r3) {
          var n4 = Object.getOwnPropertyDescriptor(e7, r3);
          Object.defineProperty(t5, r3, n4.get ? n4 : { enumerable: true, get: function() {
            return e7[r3];
          } });
        }
      })), t5.default = e7, Object.freeze(t5);
    }
    var r2 = t4(e6), n3 = [/^(?:var|let|const)(?![a-zA-Z¡-￿_0-9_\$])/, /^while(?![a-zA-Z¡-￿_0-9_\$])/, /^with(?![a-zA-Z¡-￿_0-9_\$])/, /^do(?![a-zA-Z¡-￿_0-9_\$])/, /^debugger(?![a-zA-Z¡-￿_0-9_\$])/, /^if(?![a-zA-Z¡-￿_0-9_\$])/, /^function(?![a-zA-Z¡-￿_0-9_\$])/, /^for(?![a-zA-Z¡-￿_0-9_\$])/, /^default(?![a-zA-Z¡-￿_0-9_\$])/, /^case(?![a-zA-Z¡-￿_0-9_\$])/, /^return(?![a-zA-Z¡-￿_0-9_\$])/, /^throw(?![a-zA-Z¡-￿_0-9_\$])/, /^(?:break|continue)(?![a-zA-Z¡-￿_0-9_\$])/, /^switch(?![a-zA-Z¡-￿_0-9_\$])/, /^try(?![a-zA-Z¡-￿_0-9_\$])/, /^class(?![a-zA-Z¡-￿_0-9_\$])/, /^export(?![a-zA-Z¡-￿_0-9_\$])/, /^import(?![a-zA-Z¡-￿_0-9_\$])/, [0, "async", /^(?![a-zA-Z¡-￿_0-9_\$])/, [5, 114]], [1, ";", /^(?=\})/, [7, "canInsertSemi"]], /^[a-zA-Z¡-￿__\$][a-zA-Z¡-￿_0-9_\$]*/, /^extends(?![a-zA-Z¡-￿_0-9_\$])/, /^from(?![a-zA-Z¡-￿_0-9_\$])/, /^else(?![a-zA-Z¡-￿_0-9_\$])/, /^catch(?![a-zA-Z¡-￿_0-9_\$])/, /^finally(?![a-zA-Z¡-￿_0-9_\$])/, /^as(?![a-zA-Z¡-￿_0-9_\$])/, /^(?:true|false|null|undefined|NaN|Infinity)(?![a-zA-Z¡-￿_0-9_\$])/, /^(?:super|this)(?![a-zA-Z¡-￿_0-9_\$])/, /^(?:delete|typeof|yield|await|void)(?![a-zA-Z¡-￿_0-9_\$])/, /^(?:\.\.\.|\!|\+\+?|\-\-?)/, /^(?:0x[0-9a-fA-F_]+|0o[0-7_]+|0b[01_]+|(?:[0-9][0-9_]*(?:\.[0-9_]*)?|\.[0-9_]+)(?:[eE][\+\-]?[0-9_]+)?)/, /^\/(?![\/\*])(?:\\.|\[(?:(?!\]).)*\]|(?!\/).)+\/[gimyus]*/, /^(?:\+\+|\-\-)/, /^(?:(?:\+|\-|\%|\*|\/(?![\/\*])|\>\>?\>?|\<\<?|\=\=?|\&\&?|\|\|?|\^|\!\=)\=?|\?\?)/, /^(?:in|instanceof)(?![a-zA-Z¡-￿_0-9_\$])/, /^[a-zA-Z¡-￿__\$][a-zA-Z¡-￿_0-9_\$]*(?= *\()/, /^(?:\.|\?\.)/, [1, "\n", "	", " "], /^new(?![a-zA-Z¡-￿_0-9_\$])/], i4 = Object.freeze({ __proto__: null, nodes: [[1, 6, 2], [/^[^]/, 0], [1, 6, 3], [2, 7, 4, { name: "Statement" }, 0, 1], [1, 6, 3], [3, "keyword", n3[0], -1, 3, "keyword", n3[1], -1, 3, "keyword", n3[2], -1, 3, "keyword", n3[23], -1, 3, "keyword", n3[3], -1, 3, "keyword", n3[14], -1, 3, "keyword", n3[25], -1, 3, "keyword", n3[10], -1, 3, "keyword", n3[11], -1, 3, "keyword", n3[12], -1, 3, "keyword", n3[4], -1, 3, "keyword", n3[9], -1, 3, "keyword", n3[8], -1, 3, "keyword", n3[6], -1, 3, "keyword", n3[5], -1, 3, "keyword", n3[24], -1, 3, "keyword", n3[7], -1, 3, "keyword", n3[13], -1, 3, "keyword", n3[15], -1, 3, "keyword", n3[16], -1, 3, "keyword", n3[17], -1, 3, "keyword", n3[21], -1, 3, "keyword", n3[18], -1, 3, "keyword", n3[39], -1, 3, "keyword", n3[35], -1, 3, "keyword", n3[29], -1, 3, "keyword", n3[28], -1, 3, "atom", n3[27], -1, 3, "variable", n3[20], -1, 3, "operator", n3[30], -1, 3, "operator", n3[34], -1, 3, "operator", n3[33], -1, 2, 116, -1, { name: "string", token: "string" }, 3, "number", n3[31], -1, 2, 121, -1, { name: "comment", token: "comment" }, 3, "string-2", n3[32], -1, 1, 125, -1, /^[^]/, -1], [n3[38], 6, 2, 121, 6, { name: "comment", token: "comment" }, 0, -1], [3, "keyword", n3[0], 8, 3, "keyword", n3[1], 23, 3, "keyword", n3[2], 23, 3, "keyword", n3[3], 27, 2, 129, -1, { name: "Block" }, ";", -1, 3, "keyword", n3[4], -1, 3, "keyword", n3[5], 35, 3, "keyword", n3[6], 40, 3, "keyword", n3[7], 46, 3, "keyword", n3[8], 48, /^[a-zA-Z¡-￿__\$][a-zA-Z¡-￿_0-9_\$]*(?= *\:)/, 48, 3, "keyword", n3[9], 49, 3, "keyword", n3[10], 52, 3, "keyword", n3[11], 56, 3, "keyword", n3[12], 60, 3, "keyword", n3[13], 64, 3, "keyword", n3[14], 68, 3, "keyword", n3[15], 72, 3, "keyword", n3[16], 80, 3, "keyword", n3[17], 92, 3, "keyword", n3[18], 108, "@", 110, 1, 133, 112], [1, 6, 9], [1, 139, 10], [1, 6, 11], [3, "operator", "=", 12, 0, 13], [1, 6, 14], [1, 6, 15], [1, 142, 13], [",", 16, n3[19], -1], [1, 6, 17], [1, 139, 18], [1, 6, 19], [3, "operator", "=", 20, 0, 21], [1, 6, 22], [1, 6, 15], [1, 142, 21], [1, 6, 24], [2, 146, 25, { name: "CondExpr" }], [1, 6, 26], [2, 7, -1, { name: "Statement" }], [1, 6, 28], [2, 7, 29, { name: "Statement" }], [1, 6, 30], [3, "keyword", n3[1], 31, 0, -1], [1, 6, 32], [2, 146, 33, { name: "CondExpr" }], [1, 6, 34], [n3[19], -1], [1, 6, 36], [2, 146, 37, { name: "CondExpr" }], [1, 6, 38], [2, 7, 39, { name: "Statement" }], [2, 151, -1, { name: "Alternative" }], [1, 6, 41], [3, "keyword", "*", 42, 0, 42], [1, 6, 43], [3, "def", n3[20], 44], [1, 6, 45], [2, 155, -1, { name: "FunctionDef" }], [1, 6, 47], [2, 158, -1, { name: "ForStatement" }], [1, 6, 50], [1, 6, 51], [":", -1], [1, 133, 48], [1, 6, 53], [n3[19], -1, 1, 133, 54], [1, 6, 55], [n3[19], -1], [1, 6, 57], [1, 133, 58], [1, 6, 59], [n3[19], -1], [1, 6, 61], [/^(?:[a-zA-Z¡-￿__\$][a-zA-Z¡-￿_0-9_\$]*)?/, 62], [1, 6, 63], [n3[19], -1], [1, 6, 65], [2, 146, 66, { name: "CondExpr" }], [1, 6, 67], [2, 129, -1, { name: "Block" }], [1, 6, 69], [2, 129, 70, { name: "Block" }], [1, 6, 71], [2, 161, -1, { name: "CatchFinally" }], [1, 6, 73], [3, "type def", n3[20], 74], [1, 6, 75], [3, "keyword", n3[21], 76, 0, 77], [1, 6, 78], [1, 6, 79], [1, 133, 77], [2, 174, -1, { name: "ClassBody" }], [1, 6, 81], ["*", 82, 3, "keyword", n3[8], 82, "{", 83, 2, 7, -1, { name: "Statement" }], [1, 6, 84], [1, 6, 85], [3, "keyword", n3[22], 86, 0, 87], [1, 182, 88], [1, 6, 89], [1, 6, 90], [1, 6, 91], [2, 116, 87, { name: "string", token: "string" }], [n3[19], -1], ["}", 82], [1, 6, 93], [2, 116, 94, { name: "string", token: "string" }, 3, "keyword", "*", 95, 1, 188, 96, "{", 97], [1, 6, 98], [1, 6, 99], [1, 6, 100], [1, 6, 101], [n3[19], -1], [3, "keyword", n3[26], 102, 0, 96], [3, "keyword", n3[22], 103, 0, 94], [1, 182, 104], [1, 6, 105], [1, 6, 106], [1, 6, 107], [3, "def", n3[20], 96], [2, 116, 94, { name: "string", token: "string" }], ["}", 96], [1, 6, 109], [2, 7, -1, { name: "Statement" }], [1, 6, 111], [1, 133, -1], [1, 6, 113], [n3[19], -1], [1, 6, 115], [3, "keyword", n3[6], -1, /^(?:[a-zA-Z¡-￿__\$][a-zA-Z¡-￿_0-9_\$]*|\()/, -1], ["'", 117, '"', 119], ["\\", 118, /^(?!\')./, 117, "'", -1], [/^[^]/, 117], ["\\", 120, /^(?!\")./, 119, '"', -1], [/^[^]/, 119], [/^\/\*\*(?!\/)/, 122, "/*", 124, /^\/\/.*/, -1], [1, 193, 122, 0, 123], [2, 196, 123, { name: "doccomment.tagGroup" }, "*/", -1], [[0, /^(?!\*\/)/, /^[^]/], 124, "*/", -1], [3, "string-2", "`", 126], [3, "string-2", "${", 127, 2, 198, 126, { name: "str2", token: "string-2" }, 3, "string-2", /^(?:(?!\`|\$\{|\\).)+/, 126, 3, "string-2", "`", -1], [1, 133, 128], [3, "string-2", "}", 126], ["{", 130], [1, 6, 131], [2, 7, 132, { name: "Statement" }, "}", -1], [1, 6, 131], [1, 200, 134], [1, 6, 135], [",", 136, 1, 218, 137, 0, -1], [1, 6, 138], [1, 6, 135], [1, 142, 137], [3, "operator", "...", 140, 0, 140], [1, 6, 141], [3, "def", n3[20], -1, 2, 233, -1, { name: "ArrayPattern" }, 2, 238, -1, { name: "ObjectPattern" }], [1, 200, 143], [1, 6, 144], [1, 243, 145, 0, -1], [1, 6, 144], ["(", 147], [1, 6, 148], [1, 133, 149], [1, 6, 150], [")", -1], [1, 6, 152], [3, "keyword", n3[23], 153, 0, -1], [1, 6, 154], [2, 7, -1, { name: "Statement" }], [2, 258, 156, { name: "ParamList" }], [1, 6, 157], [2, 129, -1, { name: "Block" }], [2, 263, 159, { name: "ForSpec" }], [1, 6, 160], [2, 7, -1, { name: "Statement" }], [3, "keyword", n3[24], 162, 0, 170], [1, 6, 163], ["(", 164, 0, 165], [1, 6, 166], [1, 6, 167], [1, 139, 168], [2, 129, 170, { name: "Block" }], [1, 6, 169], [")", 165], [1, 6, 171], [3, "keyword", n3[25], 172, 0, -1], [1, 6, 173], [2, 129, -1, { name: "Block" }], ["{", 175], [1, 6, 176], [3, "keyword", /^static(?![a-zA-Z¡-￿_0-9_\$])/, 177, 0, 177, "@", 178, "}", -1], [1, 6, 179], [1, 6, 180], [2, 274, 181, { name: "ObjectMember" }], [1, 133, 181], [1, 6, 176], [1, 188, 183, 0, -1], [1, 6, 184], [",", 185, 0, -1], [1, 6, 186], [1, 188, 187, 0, 187], [1, 6, 184], [3, "variable", /^[a-zA-Z¡-￿__\$][a-zA-Z¡-￿_0-9_\$]*(?= +as)/, 189, 3, "def", n3[20], -1], [1, 6, 190], [3, "keyword", n3[26], 191], [1, 6, 192], [3, "def", n3[20], -1], [0, 194, 2, 289, -1, { name: "doccomment.braced" }], [[0, /^(?!\*\/|\@[a-zA-Z¡-￿_0-9]|\{)/, /^[^]/], 195], [0, 194, 0, -1], [1, 293, 197], [1, 193, 197, 0, -1], ["\\", 199, "\n", -1], [/^[^]/, -1], [3, "atom", n3[27], -1, 3, "keyword", n3[28], -1, 3, "keyword", n3[29], 201, 3, "operator", n3[30], 201, 3, "keyword", n3[18], 201, 2, 299, -1, { name: "NewExpression" }, 3, "keyword", n3[6], 203, 3, "keyword", n3[15], 209, 2, 309, -1, { name: "ArrowFunc" }, 3, "variable callee", n3[36], -1, 3, "variable", n3[20], -1, 3, "number", n3[31], -1, 2, 116, -1, { name: "string", token: "string" }, 3, "string-2", n3[32], -1, 1, 125, -1, 2, 313, -1, { name: "ArrayLiteral" }, 2, 318, -1, { name: "ObjectLiteral" }, 2, 323, -1, { name: "ParenExpr" }], [1, 6, 202], [1, 200, -1], [1, 6, 204], [3, "keyword", "*", 205, 0, 205], [1, 6, 206], [3, "def", n3[20], 207, 0, 207], [1, 6, 208], [2, 155, -1, { name: "FunctionDef" }], [1, 6, 210], [[6, 328], 211, 0, 212], [3, "type def", n3[20], 212], [1, 6, 213], [3, "keyword", n3[21], 214, 0, 215], [1, 6, 216], [1, 6, 217], [1, 133, 215], [2, 174, -1, { name: "ClassBody" }], [3, "operator", n3[33], -1, 3, "operator", n3[34], 219, 3, "keyword", n3[35], 219, 2, 329, -1, { name: "ArgList" }, 1, 125, -1, n3[37], 221, "[", 223, 3, "operator", "?", 227], [1, 6, 220], [1, 133, -1], [1, 6, 222], [3, "property callee", n3[36], -1, 3, "property", n3[20], -1], [1, 6, 224], [1, 133, 225], [1, 6, 226], ["]", -1], [1, 6, 228], [1, 133, 229], [1, 6, 230], [3, "operator", ":", 231], [1, 6, 232], [1, 133, -1], ["[", 234], [1, 6, 235], [1, 334, 236], [1, 6, 237], ["]", -1], ["{", 239], [1, 6, 240], [1, 340, 241], [1, 6, 242], ["}", -1], [3, "operator", n3[33], -1, 3, "operator", n3[34], 244, 3, "keyword", n3[35], 244, 2, 329, -1, { name: "ArgList" }, 1, 125, -1, n3[37], 246, "[", 248, 3, "operator", "?", 252], [1, 6, 245], [1, 142, -1], [1, 6, 247], [3, "property callee", n3[36], -1, 3, "property", n3[20], -1], [1, 6, 249], [1, 133, 250], [1, 6, 251], ["]", -1], [1, 6, 253], [1, 133, 254], [1, 6, 255], [3, "operator", ":", 256], [1, 6, 257], [1, 142, -1], ["(", 259], [1, 6, 260], [1, 346, 261], [1, 6, 262], [")", -1], ["(", 264], [1, 6, 265], [2, 352, 266, { name: "StatementMaybeOf" }], [1, 6, 267], [1, 133, 268, 0, 268, 0, 272], [1, 6, 269], [";", 270], [1, 6, 271], [1, 133, 272, 0, 272], [1, 6, 273], [")", -1], [3, "keyword", /^(?:get|set|async)(?![a-zA-Z¡-￿_0-9_\$])(?! *[\,\}\:\(])/, 275, 0, 275], [1, 6, 276], [3, "keyword", "*", 277, 0, 277], [1, 6, 278], [3, "def property", n3[20], 279, "[", 280, 3, "number", n3[31], 279, 2, 116, 279, { name: "string", token: "string" }, 3, "operator", "...", 281], [1, 6, 282], [1, 6, 283], [1, 6, 284], [2, 155, -1, { name: "FunctionDef" }, ":", 285, 0, -1], [1, 133, 286], [1, 142, -1], [1, 6, 287], [1, 6, 288], [1, 142, -1], ["]", 279], ["{", 290], [1, 293, 291, 1, 193, 292], [[0, /^(?!\}|\*\/)/, /^[^]/], 291, 0, 292], [/^(?:\}|(?=\*\/))/, -1], [3, "tag", /^\@(?:member|param|arg(?:ument)?|module|namespace|typedef)(?![a-zA-Z¡-￿_0-9])/, 294, 3, "tag", /^\@[a-zA-Z¡-￿_0-9]+/, -1], [n3[38], 294, "{", 295, 0, 296, 0, -1], [2, 357, 297, { name: "doccomment.type" }], [3, "def", /^[a-zA-Z¡-￿_0-9]+/, -1, 0, -1], ["}", 298], [[1, "\n", "	", " ", /^\*(?!\/)/], 298, 0, 296], [3, "keyword", n3[39], 300], [1, 6, 301], [".", 302, 1, 200, 303], [1, 6, 304], [1, 6, 305], [3, "keyword", /^target(?![a-zA-Z¡-￿_0-9_\$])/, -1], [2, 329, 306, { name: "ArgList" }, ".", 307, 0, -1], [1, 6, 305], [1, 6, 308], [3, "property callee", n3[36], 306, 3, "property", n3[20], 306], [3, "def", [0, /^[a-zA-Z¡-￿__\$]/, /^[a-zA-Z¡-￿_0-9_\$]*/, [5, 361]], 311, [5, 363], 310], [2, 258, 311, { name: "ParamList" }], [1, 6, 312], [2, 366, -1, { name: "ArrowRest" }], ["[", 314], [1, 6, 315], [1, 369, 316], [1, 6, 317], ["]", -1], ["{", 319], [1, 6, 320], [1, 375, 321], [1, 6, 322], ["}", -1], ["(", 324], [1, 6, 325], [1, 133, 326], [1, 6, 327], [")", -1], [3, "keyword", n3[21], -1], ["(", 330], [1, 6, 331], [1, 369, 332], [1, 6, 333], [")", -1], [1, 381, 335, 0, 335, 0, -1], [1, 6, 336], [",", 337, 0, -1], [1, 6, 338], [1, 381, 339, 0, 339, 0, 339], [1, 6, 336], [1, 386, 341, 0, -1], [1, 6, 342], [",", 343, 0, -1], [1, 6, 344], [1, 386, 345, 0, 345], [1, 6, 342], [1, 381, 347, 0, -1], [1, 6, 348], [",", 349, 0, -1], [1, 6, 350], [1, 381, 351, 0, 351], [1, 6, 348], [2, 7, 353, { name: "Statement" }], [1, 6, 354], [3, "keyword", /^of(?![a-zA-Z¡-￿_0-9_\$])/, 355, 0, -1], [1, 6, 356], [1, 133, -1], [3, "type", "{", 358, 3, "type", /^(?:(?!\{|\}|\*\/).)+/, 357, "\n", 359, 0, -1], [2, 357, 360, { name: "doccomment.type" }], [/^[\t ]*(?:\*(?!\/)[\t ]*)?/, 357], [/^(?=\*\/)/, 357, 3, "type", "}", 357], [1, 6, 362], ["=>", -1], [2, 258, 364, { name: "ParamList" }], [1, 6, 365], ["=>", -1], [3, "operator", "=>", 367], [1, 6, 368], [2, 129, -1, { name: "Block" }, 1, 142, -1], [1, 142, 370, 0, -1], [1, 6, 371], [",", 372, 0, -1], [1, 6, 373], [1, 142, 374, 0, 374], [1, 6, 371], [2, 274, 376, { name: "ObjectMember" }, 0, -1], [1, 6, 377], [",", 378, 0, -1], [1, 6, 379], [2, 274, 380, { name: "ObjectMember" }, 0, 380], [1, 6, 377], [1, 139, 382], [1, 6, 383], [3, "operator", "=", 384, 0, -1], [1, 6, 385], [1, 142, -1], [3, "def", /^[a-zA-Z¡-￿__\$][a-zA-Z¡-￿_0-9_\$]*(?![a-z]|[A-Z]|[¡-￿]|_|[0-9]|_|\$| *\:)/, 387, 3, "property", n3[20], 391, 3, "number", n3[31], 391, 2, 116, 391, { name: "string", token: "string" }, 3, "operator", "...", 395], [1, 6, 388], [3, "operator", "=", 389, 0, -1], [1, 6, 390], [1, 142, -1], [1, 6, 392], [":", 393], [1, 6, 394], [1, 381, -1], [1, 6, 396], [1, 381, -1]], start: 0, token: 5 }), o3 = /(^|\s)variable($|\s)/;
    function a(e7) {
      var t5 = /^(if|for|do|while|try)\b/.exec(e7.startLine.slice(e7.startPos));
      return t5 && t5[1];
    }
    var l3 = { Block: "}", BlockOf: "}", ClassBody: "}", AnnotationTypeBody: "}", ObjectLiteral: "}", ObjectPattern: "}", EnumBody: "}", LambdaBlock: "}", WhenBody: "}", ObjType: "}", ArrayInitializer: "}", NamespaceBlock: "}", BraceTokens: "}", ArrayLiteral: "]", BracketTokens: "]", TupleType: "]", ParamList: ")", SimpleParamList: ")", ArgList: ")", ParenExpr: ")", CondExpr: ")", ForSpec: ")", ParenTokens: ")", ParenthesizedExpression: ")", ConstructorParamList: ")", TypeParams: ">", TypeArgs: ">", TemplateArgs: ">", TemplateParams: ">" }, s2 = ["Block", "NamespaceBlock", "ClassBody", "AnnotationTypeBody", "BlockOf", "EnumBody"], c = ["Statement", "ObjectMember", "ClassItem", "EnumConstant", "AnnotationTypeItem", "ArgExpr", "StatementMaybeOf", "NewExpr"];
    function u(e7, t5) {
      for (var n4 = e7.startLine; ; e7 = e7.parent) {
        if ("CondExpr" == e7.name) return r2.countColumn(e7.startLine, e7.startPos + 1, t5.tabSize);
        if (c.indexOf(e7.name) > -1 && /(^\s*|[\(\{\[])$/.test(e7.startLine.slice(0, e7.startPos))) return r2.countColumn(e7.startLine, e7.startPos, t5.tabSize);
        if (!e7.parent || e7.parent.startLine != n4) return r2.countColumn(e7.startLine, null, t5.tabSize);
      }
    }
    function d(e7, t5, n4) {
      if (!e7) return 0;
      if ("string" == e7.name || "comment" == e7.name) return r2.Pass;
      var i5, o4, h2 = l3[e7.name], p2 = t5 && t5.charAt(0) == h2;
      if (h2 && false !== n4.align && (!n4.dontAlign || n4.dontAlign.indexOf(e7.name) < 0) && (function(e8) {
        return !/^\s*((\/\/.*)?$|.*=>)/.test(e8.startLine.slice(e8.startPos + 1));
      })(e7)) return r2.countColumn(e7.startLine, e7.startPos, n4.tabSize) + (p2 ? 0 : 1);
      if (h2 && s2.indexOf(e7.name) > -1) {
        var m2 = e7.parent;
        m2 && "Statement" == m2.name && m2.parent && "Statement" == m2.parent.name && a(m2.parent) && !a(m2) && (m2 = m2.parent);
        var g2 = f(m2, n4);
        return p2 || "NamespaceBlock" == e7.name ? g2 : /^(public|private|protected)\s*:/.test(t5) ? g2 + 1 : !(o4 = e7.parent) || "Statement" != o4.name || !/^switch\b/.test(o4.startLine.slice(o4.startPos)) || (i5 = t5) && /^\s*(case|default)\b/.test(i5) ? g2 + n4.indentUnit : g2 + 2 * n4.indentUnit;
      }
      var v2 = u(e7, n4);
      return h2 ? p2 && (n4.dontCloseBrackets || "").indexOf(h2) < 0 ? v2 : v2 + n4.indentUnit * ((n4.doubleIndentBrackets || "").indexOf(h2) < 0 ? 1 : 2) : c.indexOf(e7.name) > -1 ? a(e7) ? v2 + n4.indentUnit : v2 + 2 * n4.indentUnit : "Alternative" == e7.name || "CatchFinally" == e7.name ? (v2 = u(e7.parent, n4), !t5 || /^((else|catch|finally)\b|\/[\/\*])/.test(t5) ? v2 : v2 + n4.indentUnit) : "ArrowRest" == e7.name ? v2 + n4.indentUnit : "NewExpression" == e7.name && e7.startLine.length > e7.startPos + 5 ? r2.countColumn(e7.startLine, e7.startPos, n4.tabSize) + 2 * n4.indentUnit : "InitializerList" == e7.name ? v2 + 2 : "ThrowsClause" != e7.name || /throws\s*$/.test(e7.startLine.slice(e7.startPos)) ? d(e7.parent, t5, n4) : v2 + 2 * n4.indentUnit;
    }
    function f(e7, t5) {
      for (; ; e7 = e7.parent) {
        if (!e7) return 0;
        if (c.indexOf(e7.name) > -1 || e7.parent && l3[e7.parent.name]) return r2.countColumn(e7.startLine, null, t5.tabSize);
      }
    }
    function h(e7, t5, n4, i5) {
      var o4 = e7.context && e7.context.name;
      if ("DeclType" == o4 || "BeforeStatement" == o4 || "AnnotationHead" == o4 || "Template" == o4 || "str" == o4) return f(e7.context, i5);
      if (("doccomment.braced" == o4 || "doccomment.tagGroup" == o4) && !/^[@*]/.test(t5)) return r2.countColumn(e7.context.startLine, null, i5.tabSize) + 2 * i5.indentUnit;
      var a2 = i5.forceContent && /^\s*(\/\/.*)?$/.test(n4) ? "x" : n4;
      return d(e7.contextAt(a2, n4.length - t5.length), t5, i5);
    }
    function p(e7, t5) {
      for (var r3 = t5 - 1; r3 >= 0; r3--) {
        var n4 = e7.charCodeAt(r3);
        if (10 === n4) break;
        if (32 !== n4 && 9 !== n4) return false;
      }
      return true;
    }
    var m = function(e7) {
      this.config = e7;
    };
    m.prototype.startState = function() {
      return new g();
    }, m.prototype.copyState = function(e7) {
      return e7.copy();
    }, m.prototype.shouldInterceptTokenizing = function(e7) {
      var t5 = e7.currentTemplateState;
      return void 0 !== t5 && null !== t5.mode;
    }, m.prototype.interceptTokenizing = function(e7, t5) {
      if (e7.match("${") && (e7.backUp(2), !this.isEscaped(e7, e7.pos - 2))) return { handled: false };
      if ("`" === e7.peek() && !this.isEscaped(e7, e7.pos)) return { handled: false };
      var r3 = t5.currentTemplateState, n4 = r3.mode, i5 = r3.state, o4 = n4.token(e7, i5);
      return this.backupIfEmbeddedTokenizerOvershot(e7), { handled: true, style: o4 };
    }, m.prototype.trackState = function(e7, t5, r3) {
      if (e7) {
        var n4 = r3.currentTemplateState;
        n4 && "inline-expression" !== n4.kind ? this.trackStateInTemplate(e7, t5, r3, n4) : this.trackStateNotInTemplate(e7, t5, r3, n4), r3.previousVariable = "variable" === e7 ? t5.current() : null;
      }
    }, m.prototype.trackStateNotInTemplate = function(e7, t5, r3, n4) {
      if (n4 && "string-2" === e7 && t5.current().startsWith("}")) return r3.templateStack.pop(), void t5.backUp(t5.current().length - 1);
      if ("string-2" === e7 && t5.current().startsWith("`")) {
        var i5 = this.getModeForTemplateTag(r3.previousVariable), o4 = "template";
        i5 ? (t5.backUp(t5.current().length - 1), r3.templateStack.push(new y(o4, i5, CodeMirror.startState(i5)))) : r3.templateStack.push(new y(o4, null, null));
      }
    }, m.prototype.trackStateInTemplate = function(e7, t5, r3, n4) {
      "string-2" !== e7 || !t5.current().endsWith("`") || this.isEscaped(t5.pos - 1) ? "string-2" !== e7 || !t5.current().endsWith("${") || this.isEscaped(t5.pos - 2) || r3.templateStack.push(new y("inline-expression", null, null)) : r3.templateStack.pop();
    }, m.prototype.backupIfEmbeddedTokenizerOvershot = function(e7) {
      for (var t5 = e7.current(), r3 = 0; ; ) {
        var n4 = t5.slice(r3).search(/`|\$\{/);
        if (-1 === n4) return;
        n4 += r3;
        var i5 = t5.length - n4, o4 = e7.pos - i5;
        if (!this.isEscaped(e7, o4)) return void e7.backUp(t5.length - n4);
        r3 = n4 + 1;
      }
    }, m.prototype.isEscaped = function(e7, t5) {
      for (var r3 = false, n4 = t5; n4 > 0 && "\\" === e7.string[n4 - 1]; ) r3 = !r3, n4--;
      return r3;
    }, m.prototype.getModeForTemplateTag = function(e7) {
      if (!e7) return null;
      "htm" === e7 && (e7 = "html");
      for (var t5 = ["google-" + e7, "" + e7], r3 = 0; r3 < t5.length; r3++) {
        var n4 = CodeMirror.getMode(this.config, t5[r3]);
        if (n4 && "null" !== n4.name) return n4;
      }
      return null;
    };
    var g = function(e7, t5) {
      void 0 === e7 && (e7 = []), void 0 === t5 && (t5 = null), this.templateStack = e7, this.previousVariable = t5;
    }, v = { currentTemplateState: { configurable: true } };
    g.prototype.copy = function() {
      return new g(this.templateStack.map((function(e7) {
        return e7.copy();
      })), this.previousVariable);
    }, v.currentTemplateState.get = function() {
      return this.templateStack[this.templateStack.length - 1];
    }, Object.defineProperties(g.prototype, v);
    var y = function(e7, t5, r3) {
      this.kind = e7, this.mode = t5, this.state = r3;
    };
    y.prototype.copy = function() {
      return this.mode ? new y(this.kind, this.mode, CodeMirror.copyState(this.mode, this.state)) : new y(this.kind, null, null);
    };
    var b = ["Block", "FunctionDef", "ArrowFunc", "ForStatement"], w = (function(e7) {
      function t5(t6, r3) {
        e7.call(this, i4, { predicates: { canInsertSemi: false === r3.requireSemicolons ? p : function() {
          return false;
        } } }), this.embeddedParser = new m(t6), this.indentConf = { doubleIndentBrackets: ">)", dontCloseBrackets: ")", tabSize: t6.tabSize, indentUnit: t6.indentUnit, forceContent: true };
      }
      return e7 && (t5.__proto__ = e7), t5.prototype = Object.create(e7 && e7.prototype), t5.prototype.constructor = t5, t5.prototype.startState = function() {
        var t6 = e7.prototype.startState.call(this);
        return t6.embeddedParserState = this.embeddedParser.startState(), t6;
      }, t5.prototype.copyState = function(t6) {
        var r3 = e7.prototype.copyState.call(this, t6);
        return r3.embeddedParserState = this.embeddedParser.copyState(t6.embeddedParserState), r3;
      }, t5.prototype.token = function(t6, r3) {
        var n4 = r3.embeddedParserState;
        if (this.embeddedParser.shouldInterceptTokenizing(n4)) {
          var i5 = this.embeddedParser.interceptTokenizing(t6, n4), a2 = i5.handled, l4 = i5.style;
          if (a2) return l4;
        }
        var s3 = e7.prototype.token.call(this, t6, r3);
        return this.embeddedParser.trackState(s3, t6, n4), (function(e8, t7, r4, n5) {
          if ("def" == e8) {
            var i6 = (function(e9, t8) {
              for (var r5 = e9; r5; r5 = r5.parent) if (t8.indexOf(r5.name) > -1) return r5;
            })(n5.context, t7), a3 = r4.current();
            if (i6 && (i6.locals || (i6.locals = []), -1 == i6.locals.indexOf(a3) && i6.locals.push(a3), "funcName" != n5.context.name)) return "def local";
          } else o3.test(e8) && !/qualified/.test(e8) && (function(e9, t8) {
            for (var r5 = e9; r5; r5 = r5.parent) if (r5.locals && r5.locals.indexOf(t8) > -1) return true;
            return false;
          })(n5.context, r4.current()) && (e8 = e8.replace(o3, "$1variable-2$2"));
          return e8;
        })(s3, b, t6, r3);
      }, t5.prototype.indent = function(e8, t6, r3) {
        return t6 || (t6 = r3 = "x"), h(e8, t6, r3, this.indentConf);
      }, t5;
    })(r2.GrammarMode), k = { electricInput: /^\s*(?:case .*?:|default:|\{|\})$/, blockCommentStart: "/*", blockCommentEnd: "*/", blockCommentContinue: " * ", lineComment: "//", fold: "brace", closeBrackets: "()[]{}''\"\"``" };
    for (var x2 in k) w.prototype[x2] = k[x2];
    r2.registerHelper("wordChars", "google-javascript", /[\w$]/), r2.defineMode("google-javascript", (function(e7, t5) {
      return new w(e7, t5);
    }));
  })((e5 = "undefined" != typeof globalThis ? globalThis : e5 || self).CodeMirror);
})(window), (function(e5, t3) {
  !(function(e6) {
    function t4(e7) {
      if (e7 && e7.__esModule) return e7;
      var t5 = /* @__PURE__ */ Object.create(null);
      return e7 && Object.keys(e7).forEach((function(r3) {
        if ("default" !== r3) {
          var n4 = Object.getOwnPropertyDescriptor(e7, r3);
          Object.defineProperty(t5, r3, n4.get ? n4 : { enumerable: true, get: function() {
            return e7[r3];
          } });
        }
      })), t5.default = e7, Object.freeze(t5);
    }
    var r2 = t4(e6), n3 = [/^(?:var|let|const)(?![a-zA-Z¡-￿_0-9_\$])/, /^while(?![a-zA-Z¡-￿_0-9_\$])/, /^with(?![a-zA-Z¡-￿_0-9_\$])/, /^do(?![a-zA-Z¡-￿_0-9_\$])/, /^debugger(?![a-zA-Z¡-￿_0-9_\$])/, /^if(?![a-zA-Z¡-￿_0-9_\$])/, /^function(?![a-zA-Z¡-￿_0-9_\$])/, /^for(?![a-zA-Z¡-￿_0-9_\$])/, /^default(?![a-zA-Z¡-￿_0-9_\$])/, /^case(?![a-zA-Z¡-￿_0-9_\$])/, /^return(?![a-zA-Z¡-￿_0-9_\$])/, /^throw(?![a-zA-Z¡-￿_0-9_\$])/, /^(?:break|continue)(?![a-zA-Z¡-￿_0-9_\$])/, /^switch(?![a-zA-Z¡-￿_0-9_\$])/, /^try(?![a-zA-Z¡-￿_0-9_\$])/, /^class(?![a-zA-Z¡-￿_0-9_\$])/, /^export(?![a-zA-Z¡-￿_0-9_\$])/, /^import(?![a-zA-Z¡-￿_0-9_\$])/, [0, "async", /^(?![a-zA-Z¡-￿_0-9_\$])/, [5, 139]], /^[a-zA-Z¡-￿__\$][a-zA-Z¡-￿_0-9_\$]*/, /^extends(?![a-zA-Z¡-￿_0-9_\$])/, /^enum(?![a-zA-Z¡-￿_0-9_\$])/, [1, ";", /^(?=\})/, [7, "canInsertSemi"]], /^from(?![a-zA-Z¡-￿_0-9_\$])/, [1, "\n", "	", " "], /^[a-zA-Z¡-￿__\$]/, /^const(?![a-zA-Z¡-￿_0-9_\$])/, /^(?:true|false|null|undefined|NaN|Infinity)(?![a-zA-Z¡-￿_0-9_\$])/, /^new(?![a-zA-Z¡-￿_0-9_\$])/, /^(?:0x[0-9a-fA-F_]+|0o[0-7_]+|0b[01_]+|(?:[0-9][0-9_]*(?:\.[0-9_]*)?|\.[0-9_]+)(?:[eE][\+\-]?[0-9_]+)?)/, /^else(?![a-zA-Z¡-￿_0-9_\$])/, /^catch(?![a-zA-Z¡-￿_0-9_\$])/, /^finally(?![a-zA-Z¡-￿_0-9_\$])/, /^as(?![a-zA-Z¡-￿_0-9_\$])/, /^(?:super|this)(?![a-zA-Z¡-￿_0-9_\$])/, /^(?:delete|typeof|yield|await|void)(?![a-zA-Z¡-￿_0-9_\$])/, /^(?:\.\.\.|\!|\+\+?|\-\-?)/, /^\/(?![\/\*])(?:\\.|\[(?:(?!\]).)*\]|(?!\/).)+\/[gimyus]*/, [0, /^[a-zA-Z¡-￿__\$]/, /^[a-zA-Z¡-￿_0-9_\$]*/, [5, 508]], /^(?:\+\+|\-\-)/, /^(?:(?:\+|\-|\%|\*|\/(?![\/\*])|\>\>?\>?|\<\<?|\=\=?|\&\&?|\|\|?|\^|\!\=)\=?|\?\?)/, /^(?:in|instanceof)(?![a-zA-Z¡-￿_0-9_\$])/, /^(?:public|private|protected|readonly|abstract|static)(?![a-zA-Z¡-￿_0-9_\$])/, /^(?:\.|\?\.)/, [0, /^[a-zA-Z¡-￿__\$]/, /^[a-zA-Z¡-￿_0-9_\$]*/, [5, 533]], /^[a-zA-Z¡-￿__\$][a-zA-Z¡-￿_0-9_\$]*(?= *\:)/, /^is(?![a-zA-Z¡-￿_0-9_\$])/, /^(?:\.\.\.)?/, /^(?:get|set|async)(?![a-zA-Z¡-￿_0-9_\$])(?! *[\,\}\:\(\<])/], i4 = Object.freeze({ __proto__: null, nodes: [[1, 6, 2], [/^[^]/, 0], [1, 6, 3], [2, 7, 4, { name: "Statement" }, 0, 1], [1, 6, 3], [3, "keyword", n3[0], -1, 3, "keyword", n3[1], -1, 3, "keyword", n3[2], -1, 3, "keyword", n3[30], -1, 3, "keyword", n3[3], -1, 3, "keyword", n3[14], -1, 3, "keyword", n3[32], -1, 3, "keyword", n3[10], -1, 3, "keyword", n3[11], -1, 3, "keyword", n3[12], -1, 3, "keyword", n3[4], -1, 3, "keyword", n3[9], -1, 3, "keyword", n3[8], -1, 3, "keyword", n3[6], -1, 3, "keyword", n3[5], -1, 3, "keyword", n3[31], -1, 3, "keyword", n3[7], -1, 3, "keyword", n3[13], -1, 3, "keyword", n3[15], -1, 3, "keyword", n3[16], -1, 3, "keyword", n3[17], -1, 3, "keyword", n3[20], -1, 3, "keyword", n3[18], -1, 3, "keyword", n3[28], -1, 3, "keyword", n3[41], -1, 3, "keyword", n3[35], -1, 3, "keyword", n3[34], -1, 3, "atom", n3[27], -1, 3, "variable", n3[19], -1, 3, "operator", n3[36], -1, 3, "operator", n3[40], -1, 3, "operator", n3[39], -1, 2, 141, -1, { name: "string", token: "string" }, 3, "number", n3[29], -1, 2, 146, -1, { name: "comment", token: "comment" }, 3, "string-2", n3[37], -1, 1, 150, -1, /^[^]/, -1], [n3[24], 6, 2, 146, 6, { name: "comment", token: "comment" }, 0, -1], [3, "keyword", [0, "type", /^(?![a-zA-Z¡-￿_0-9_\$])/, [5, 154]], 8, 3, "keyword", [0, "namespace", /^(?![a-zA-Z¡-￿_0-9_\$])/, [5, 155]], 18, 3, "keyword", [0, "interface", /^(?![a-zA-Z¡-￿_0-9_\$])/, [5, 156]], 26, [5, 157], 36, 3, "keyword", n3[21], 37, 3, "keyword", [0, "declare", /^(?![a-zA-Z¡-￿_0-9_\$])/, [5, 160]], 43, 3, "keyword", /^abstract(?![a-zA-Z¡-￿_0-9_\$])/, 43, 3, "keyword", n3[0], 45, 3, "keyword", n3[1], 52, 3, "keyword", n3[2], 52, 3, "keyword", n3[3], 56, 2, 161, -1, { name: "Block" }, ";", -1, 3, "keyword", n3[4], -1, 3, "keyword", n3[5], 64, 3, "keyword", n3[6], 69, 3, "keyword", n3[7], 75, 3, "keyword", n3[8], 77, n3[45], 77, 3, "keyword", n3[9], 78, 3, "keyword", n3[10], 81, 3, "keyword", n3[11], 85, 3, "keyword", n3[12], 89, 3, "keyword", n3[13], 93, 3, "keyword", n3[14], 97, 3, "keyword", n3[15], 101, 3, "keyword", n3[16], 105, 3, "keyword", n3[17], 117, 3, "keyword", n3[18], 133, "@", 135, 1, 165, 137], [1, 6, 9], [3, "def type", n3[19], 10], [1, 6, 11], [2, 171, 12, { name: "TypeParams" }, 0, 12], [1, 6, 13], [3, "operator", "=", 14], [1, 6, 15], [1, 176, 16], [1, 6, 17], [n3[22], -1], [1, 6, 19], [[5, 224], 20, 3, "def", n3[19], 21], [3, "variable", n3[19], 22], [1, 6, 23], [1, 6, 24], [2, 161, -1, { name: "Block" }], [".", 25], [1, 6, 19], [1, 6, 27], [3, "def type", n3[19], 28], [1, 6, 29], [2, 171, 30, { name: "TypeParams" }, 0, 30], [1, 6, 31], [3, "keyword", n3[20], 32, 0, 33], [1, 6, 34], [1, 6, 35], [1, 227, 33], [2, 233, -1, { name: "ObjType" }], [3, "keyword", n3[26], 38], [1, 6, 39], [1, 6, 40], [3, "def type", n3[19], 41], [3, "keyword", n3[21], 37], [1, 6, 42], [2, 241, -1, { name: "EnumBody" }], [1, 6, 44], [2, 7, -1, { name: "Statement" }], [1, 6, 46], [1, 246, 47], [1, 6, 48], [",", 49, n3[22], -1], [1, 6, 50], [1, 246, 51], [1, 6, 48], [1, 6, 53], [2, 257, 54, { name: "CondExpr" }], [1, 6, 55], [2, 7, -1, { name: "Statement" }], [1, 6, 57], [2, 7, 58, { name: "Statement" }], [1, 6, 59], [3, "keyword", n3[1], 60, 0, -1], [1, 6, 61], [2, 257, 62, { name: "CondExpr" }], [1, 6, 63], [n3[22], -1], [1, 6, 65], [2, 257, 66, { name: "CondExpr" }], [1, 6, 67], [2, 7, 68, { name: "Statement" }], [2, 262, -1, { name: "Alternative" }], [1, 6, 70], [3, "keyword", "*", 71, 0, 71], [1, 6, 72], [3, "def", n3[19], 73], [1, 6, 74], [2, 266, -1, { name: "FunctionDef" }], [1, 6, 76], [2, 275, -1, { name: "ForStatement" }], [1, 6, 79], [1, 6, 80], [":", -1], [1, 165, 77], [1, 6, 82], [n3[22], -1, 1, 165, 83], [1, 6, 84], [n3[22], -1], [1, 6, 86], [1, 165, 87], [1, 6, 88], [n3[22], -1], [1, 6, 90], [/^(?:[a-zA-Z¡-￿__\$][a-zA-Z¡-￿_0-9_\$]*)?/, 91], [1, 6, 92], [n3[22], -1], [1, 6, 94], [2, 257, 95, { name: "CondExpr" }], [1, 6, 96], [2, 161, -1, { name: "Block" }], [1, 6, 98], [2, 161, 99, { name: "Block" }], [1, 6, 100], [2, 278, -1, { name: "CatchFinally" }], [1, 6, 102], [3, "def type", n3[19], 103], [1, 6, 104], [1, 291, -1], [1, 6, 106], ["*", 107, 3, "keyword", n3[8], 107, "{", 108, 2, 7, -1, { name: "Statement" }], [1, 6, 109], [1, 6, 110], [3, "keyword", n3[23], 111, 0, 112], [1, 302, 113], [1, 6, 114], [1, 6, 115], [1, 6, 116], [2, 141, 112, { name: "string", token: "string" }], [n3[22], -1], ["}", 107], [1, 6, 118], [2, 141, 119, { name: "string", token: "string" }, 3, "keyword", "*", 120, 1, 308, 121, "{", 122], [1, 6, 123], [1, 6, 124], [1, 6, 125], [1, 6, 126], [n3[22], -1], [3, "keyword", n3[33], 127, 0, 121], [3, "keyword", n3[23], 128, 0, 119], [1, 302, 129], [1, 6, 130], [1, 6, 131], [1, 6, 132], [3, "def", n3[19], 121], [2, 141, 119, { name: "string", token: "string" }], ["}", 121], [1, 6, 134], [2, 7, -1, { name: "Statement" }], [1, 6, 136], [1, 165, -1], [1, 6, 138], [n3[22], -1], [1, 6, 140], [3, "keyword", n3[6], -1, /^(?:[a-zA-Z¡-￿__\$][a-zA-Z¡-￿_0-9_\$]*|\()/, -1], ["'", 142, '"', 144], ["\\", 143, /^(?!\')./, 142, "'", -1], [/^[^]/, 142], ["\\", 145, /^(?!\")./, 144, '"', -1], [/^[^]/, 144], [/^\/\*\*(?!\/)/, 147, "/*", 149, /^\/\/.*/, -1], [1, 313, 147, 0, 148], [2, 316, 148, { name: "doccomment.tagGroup" }, "*/", -1], [[0, /^(?!\*\/)/, /^[^]/], 149, "*/", -1], [3, "string-2", "`", 151], [3, "string-2", "${", 152, 2, 318, 151, { name: "str2", token: "string-2" }, 3, "string-2", /^(?:(?!\`|\$\{|\\).)+/, 151, 3, "string-2", "`", -1], [1, 165, 153], [3, "string-2", "}", 151], [n3[24], 154, n3[25], -1], [n3[24], 155, n3[25], -1], [n3[24], 156, n3[25], -1], [3, "keyword", n3[26], 158], [1, 6, 159], [3, "keyword", n3[21], -1], [n3[24], 160, n3[25], -1], ["{", 162], [1, 6, 163], [2, 7, 164, { name: "Statement" }, "}", -1], [1, 6, 163], [1, 320, 166], [1, 6, 167], [",", 168, 1, 348, 169, 0, -1], [1, 6, 170], [1, 6, 167], [1, 367, 169], ["<", 172], [1, 6, 173], [1, 371, 174], [1, 6, 175], [">", -1], [3, "keyword", /^this(?![a-zA-Z¡-￿_0-9_\$])/, 209, 3, "atom", n3[27], 209, 3, "keyword", /^typeof(?![a-zA-Z¡-￿_0-9_\$])/, 177, 3, "keyword", /^(?:keyof|readonly|unique)(?![a-zA-Z¡-￿_0-9_\$])/, 178, [0, [5, 393], "("], 179, 3, "keyword", n3[28], 180, 0, 180, 0, 181, 2, 396, 209, { name: "TupleType" }, 2, 233, 209, { name: "ObjType" }, 2, 141, 209, { name: "string", token: "string" }, 3, "number", n3[29], 209], [1, 6, 182], [1, 6, 183], [1, 6, 184], [1, 6, 185], [[5, 401], 186, 3, "type", n3[19], 187], [3, "variable", n3[19], 188], [1, 176, 209], [1, 176, 189], [2, 171, 190, { name: "TypeParams" }, 0, 190], [3, "variable", n3[19], 191], [1, 6, 192], [1, 6, 193], [1, 6, 194], [1, 6, 195], [1, 6, 196], [2, 404, 209, { name: "TypeArgs" }, 0, 209], [".", 197, "[", 198, 0, 209], [")", 209], [2, 409, 199, { name: "ParamListSpec" }], [".", 200], [1, 6, 201], [1, 6, 202], [1, 6, 203], [1, 6, 181], [3, "property", n3[19], 204], [1, 165, 205], [3, "operator", "=>", 206], [1, 6, 193], [1, 6, 207], [1, 6, 208], ["]", 204], [1, 410, 209], [1, 6, 210], [3, "operator", /^[\&\|]/, 211, 3, "keyword", n3[20], 211, "[", 212, 3, "operator", "?", 213, 0, -1], [1, 6, 214], [1, 6, 215], [1, 6, 216], [1, 176, 217], [1, 176, 218, 0, 218], [1, 176, 219], [1, 6, 210], [1, 6, 220], [1, 6, 221], ["]", 217], [3, "operator", ":", 222], [1, 6, 223], [1, 176, 217], [n3[19], 225], [1, 6, 226], [".", -1], [1, 176, 228, 0, -1], [1, 6, 229], [",", 230, 0, -1], [1, 6, 231], [1, 176, 232, 0, 232], [1, 6, 229], ["{", 234], [1, 6, 235], [1, 416, 236, 0, 236], [1, 6, 237], [/^[\,\;]/, 238, "}", -1], [1, 6, 239], [1, 416, 240, 0, 240], [1, 6, 237], ["{", 242], [1, 6, 243], [1, 449, 244], [1, 6, 245], ["}", -1], [1, 463, 247], [1, 6, 248], [3, "operator", "!", 249, 0, 249], [1, 6, 250], [":", 251, 0, 253], [1, 6, 252], [1, 176, 253], [1, 6, 254], [3, "operator", "=", 255, 0, -1], [1, 6, 256], [1, 367, -1], ["(", 258], [1, 6, 259], [1, 165, 260], [1, 6, 261], [")", -1], [1, 6, 263], [3, "keyword", n3[30], 264, 0, -1], [1, 6, 265], [2, 7, -1, { name: "Statement" }], [2, 171, 267, { name: "TypeParams" }, 0, 267], [1, 6, 268], [2, 466, 269, { name: "ParamList" }], [1, 6, 270], [":", 271, 0, 273], [1, 6, 272], [1, 410, 273], [1, 6, 274], [2, 161, -1, { name: "Block" }, n3[22], -1], [2, 471, 276, { name: "ForSpec" }], [1, 6, 277], [2, 7, -1, { name: "Statement" }], [3, "keyword", n3[31], 279, 0, 287], [1, 6, 280], ["(", 281, 0, 282], [1, 6, 283], [1, 6, 284], [1, 463, 285], [2, 161, 287, { name: "Block" }], [1, 6, 286], [")", 282], [1, 6, 288], [3, "keyword", n3[32], 289, 0, -1], [1, 6, 290], [2, 161, -1, { name: "Block" }], [2, 171, 292, { name: "TypeParams" }, 0, 292], [1, 6, 293], [3, "keyword", n3[20], 294, 0, 296], [1, 6, 295], [1, 176, 296], [1, 6, 297], [3, "keyword", /^implements(?![a-zA-Z¡-￿_0-9_\$])/, 298, 0, 300], [1, 6, 299], [1, 227, 300], [1, 6, 301], [2, 482, -1, { name: "ClassBody" }], [1, 308, 303, 0, -1], [1, 6, 304], [",", 305, 0, -1], [1, 6, 306], [1, 308, 307, 0, 307], [1, 6, 304], [3, "variable", /^[a-zA-Z¡-￿__\$][a-zA-Z¡-￿_0-9_\$]*(?= +as)/, 309, 3, "def", n3[19], -1], [1, 6, 310], [3, "keyword", n3[33], 311], [1, 6, 312], [3, "def", n3[19], -1], [0, 314, 2, 490, -1, { name: "doccomment.braced" }], [[0, /^(?!\*\/|\@[a-zA-Z¡-￿_0-9]|\{)/, /^[^]/], 315], [0, 314, 0, -1], [1, 494, 317], [1, 313, 317, 0, -1], ["\\", 319, "\n", -1], [/^[^]/, -1], ["<", 321, 3, "atom", n3[27], -1, 3, "keyword", n3[34], -1, 3, "keyword", n3[35], 327, 3, "operator", n3[36], 327, 3, "keyword", n3[18], 327, 3, "keyword", n3[28], 329, 3, "keyword", n3[6], 335, 3, "keyword", n3[15], 341, 2, 500, -1, { name: "ArrowFunc" }, 3, "variable callee", n3[38], 346, 3, "variable", n3[19], -1, 3, "number", n3[29], -1, 2, 141, -1, { name: "string", token: "string" }, 3, "string-2", n3[37], -1, 1, 150, -1, 2, 512, -1, { name: "ArrayLiteral" }, 2, 517, -1, { name: "ObjectLiteral" }, 2, 522, -1, { name: "ParenExpr" }], [1, 6, 322], [1, 176, 323], [1, 6, 324], [">", 325], [1, 6, 326], [1, 320, -1], [1, 6, 328], [1, 320, -1], [1, 6, 330], [".", 331, 3, "variable callee", n3[38], 332, 1, 320, -1], [1, 6, 333], [1, 6, 334], [3, "keyword", /^target(?![a-zA-Z¡-￿_0-9_\$])/, -1], [2, 404, -1, { name: "TypeArgs" }, 0, -1], [1, 6, 336], [3, "keyword", "*", 337, 0, 337], [1, 6, 338], [3, "def", n3[19], 339, 0, 339], [1, 6, 340], [2, 266, -1, { name: "FunctionDef" }], [1, 6, 342], [[6, 527], 343, 0, 344], [3, "def type", n3[19], 344], [1, 6, 345], [1, 291, -1], [1, 6, 347], [2, 404, -1, { name: "TypeArgs" }, 0, -1], [3, "keyword", n3[33], 349, 3, "operator", "!", -1, 3, "operator", n3[39], -1, 3, "operator", n3[40], 351, 3, "keyword", n3[41], 351, 2, 528, -1, { name: "ArgList" }, 1, 150, -1, n3[43], 353, "[", 357, 3, "operator", "?", 361], [1, 6, 350], [1, 176, -1], [1, 6, 352], [1, 165, -1], [1, 6, 354], [3, "property callee", n3[44], 355, 3, "property", n3[19], -1], [1, 6, 356], [2, 404, -1, { name: "TypeArgs" }, 0, -1], [1, 6, 358], [1, 165, 359], [1, 6, 360], ["]", -1], [1, 6, 362], [1, 165, 363], [1, 6, 364], [3, "operator", ":", 365], [1, 6, 366], [1, 165, -1], [1, 320, 368], [1, 6, 369], [1, 537, 370, 0, -1], [1, 6, 369], [3, "def type", n3[19], 372, 0, -1], [1, 6, 373], [3, "keyword", n3[20], 374, 0, 375], [1, 6, 376], [1, 6, 377], [1, 176, 375], [3, "operator", "=", 378, 0, 379], [1, 6, 380], [1, 6, 381], [1, 176, 379], [",", 382, 0, -1], [1, 6, 383], [3, "def type", n3[19], 384, 0, 385], [1, 6, 386], [1, 6, 381], [3, "keyword", n3[20], 387, 0, 388], [1, 6, 389], [1, 6, 390], [1, 176, 388], [3, "operator", "=", 391, 0, 385], [1, 6, 392], [1, 176, 385], ["(", 394], [1, 6, 395], [[6, 556], -1], ["[", 397], [1, 6, 398], [1, 559, 399], [1, 6, 400], ["]", -1], [n3[19], 402], [1, 6, 403], [".", -1], ["<", 405], [1, 6, 406], [1, 227, 407], [1, 6, 408], [">", -1], [2, 466, -1, { name: "ParamList" }], [[5, 573], 411, 0, 414], [3, "variable", n3[19], 412], [1, 6, 413], [3, "keyword", n3[46], 414], [1, 6, 415], [1, 176, -1], [3, "keyword", n3[28], 417, 0, 417, 0, 425], [1, 6, 418], [2, 171, 419, { name: "TypeParams" }, 0, 419], [1, 6, 420], [2, 466, 421, { name: "ParamList" }], [1, 6, 422], [":", 423, 0, -1], [1, 6, 424], [1, 410, -1], [3, "keyword", n3[42], 426, "[", 427, 3, "def property", n3[19], 428, 2, 141, 428, { name: "string", token: "string" }, 3, "number", n3[29], 428], [1, 6, 425], [1, 6, 429], [1, 6, 430], [[0, [5, 576], /^[a-zA-Z¡-￿__\$]/, /^[a-zA-Z¡-￿_0-9_\$]*/], 431, 1, 165, 432], [/^\??/, 433], [1, 6, 434], [1, 6, 435], [1, 6, 436], [":", 437, 3, "keyword", /^in(?![a-zA-Z¡-￿_0-9_\$])/, 437], ["]", 438], [2, 171, 439, { name: "TypeParams" }, 0, 439, 0, 440], [1, 6, 441], [1, 6, 442], [1, 6, 443], [1, 6, 444], [1, 176, 432], [":", 445], [2, 466, 440, { name: "ParamList" }], [":", 446, 0, -1], [1, 6, 447], [1, 6, 448], [1, 176, -1], [1, 410, -1], [3, "def property", n3[19], 450, 0, -1], [1, 6, 451], [3, "operator", "=", 452, 0, 453], [1, 6, 454], [1, 6, 455], [1, 367, 453], [",", 456, 0, -1], [1, 6, 457], [3, "def property", n3[19], 458, 0, 459], [1, 6, 460], [1, 6, 455], [3, "operator", "=", 461, 0, 459], [1, 6, 462], [1, 367, 459], [3, "operator", "...", 464, 0, 464], [1, 6, 465], [3, "def", n3[19], -1, 2, 579, -1, { name: "ArrayPattern" }, 2, 584, -1, { name: "ObjectPattern" }], ["(", 467], [1, 6, 468], [1, 589, 469], [1, 6, 470], [")", -1], ["(", 472], [1, 6, 473], [2, 629, 474, { name: "StatementMaybeOf" }], [1, 6, 475], [1, 165, 476, 0, 476, 0, 480], [1, 6, 477], [";", 478], [1, 6, 479], [1, 165, 480, 0, 480], [1, 6, 481], [")", -1], ["{", 483], [1, 6, 484], [0, 485, "@", 486, "}", -1], [3, "keyword", n3[42], 487, 3, "keyword", [0, "override", /^(?![a-zA-Z¡-￿_0-9_\$])/, [5, 634]], 487, 2, 635, 488, { name: "ClassItem" }], [1, 6, 489], [1, 6, 485], [1, 6, 484], [1, 165, 488], ["{", 491], [1, 494, 492, 1, 313, 493], [[0, /^(?!\}|\*\/)/, /^[^]/], 492, 0, 493], [/^(?:\}|(?=\*\/))/, -1], [3, "tag", /^\@(?:member|param|arg(?:ument)?|module|namespace|typedef)(?![a-zA-Z¡-￿_0-9])/, 495, 3, "tag", /^\@[a-zA-Z¡-￿_0-9]+/, -1], [n3[24], 495, "{", 496, 0, 497, 0, -1], [2, 656, 498, { name: "doccomment.type" }], [3, "def", /^[a-zA-Z¡-￿_0-9]+/, -1, 0, -1], ["}", 499], [[1, "\n", "	", " ", /^\*(?!\/)/], 499, 0, 497], [3, "def", [0, /^[a-zA-Z¡-￿__\$]/, /^[a-zA-Z¡-￿_0-9_\$]*/, [5, 660]], 506, [5, 666], 501], [2, 466, 502, { name: "ParamList" }], [1, 6, 503], [":", 504, 0, 506], [1, 6, 505], [1, 410, 506], [1, 6, 507], [2, 673, -1, { name: "ArrowRest" }], [/^\<(?! )/, -1, /^ */, 509], [1, 678, 510, 0, 511], [/^ */, 511], ["(", -1], ["[", 513], [1, 6, 514], [1, 680, 515], [1, 6, 516], ["]", -1], ["{", 518], [1, 6, 519], [1, 686, 520], [1, 6, 521], ["}", -1], ["(", 523], [1, 6, 524], [1, 165, 525], [1, 6, 526], [")", -1], [3, "keyword", n3[20], -1], ["(", 529], [1, 6, 530], [1, 680, 531], [1, 6, 532], [")", -1], [/^ */, 534], [1, 678, 535, 0, 536], [/^ */, 536], ["(", -1], [3, "keyword", n3[33], 538, 3, "operator", "!", -1, 3, "operator", n3[39], -1, 3, "operator", n3[40], 540, 3, "keyword", n3[41], 540, 2, 528, -1, { name: "ArgList" }, 1, 150, -1, n3[43], 542, "[", 546, 3, "operator", "?", 550], [1, 6, 539], [1, 176, -1], [1, 6, 541], [1, 367, -1], [1, 6, 543], [3, "property callee", n3[44], 544, 3, "property", n3[19], -1], [1, 6, 545], [2, 404, -1, { name: "TypeArgs" }, 0, -1], [1, 6, 547], [1, 165, 548], [1, 6, 549], ["]", -1], [1, 6, 551], [1, 165, 552], [1, 6, 553], [3, "operator", ":", 554], [1, 6, 555], [1, 367, -1], [/^(?:\)|\.\.\.)/, -1, n3[19], 557], [1, 6, 558], [/^[\?\:]/, -1], [n3[45], 560, 0, 561, 0, -1], [1, 6, 562], [1, 6, 563], [":", 561], [1, 176, 564], [1, 6, 565], [",", 566, 0, -1], [1, 6, 567], [n3[45], 568, 0, 569, 0, 570], [1, 6, 571], [1, 6, 572], [1, 6, 565], [":", 569], [1, 176, 570], [n3[19], 574], [1, 6, 575], [3, "keyword", n3[46], -1], [n3[19], 577], [1, 6, 578], [/^(?:\:|in)/, -1], ["[", 580], [1, 6, 581], [1, 692, 582], [1, 6, 583], ["]", -1], ["{", 585], [1, 6, 586], [1, 698, 587], [1, 6, 588], ["}", -1], ["@", 590, 0, 591, 0, -1], [1, 6, 592], [3, "keyword", n3[42], 593, n3[47], 594], [1, 165, 595], [1, 6, 591], [1, 6, 596], [1, 6, 589], [1, 463, 597], [1, 6, 598], [/^\??/, 599], [1, 6, 600], [":", 601, 0, 602], [1, 6, 603], [1, 6, 604], [1, 176, 602], [3, "operator", "=", 605, 0, 606], [1, 6, 607], [1, 6, 608], [1, 367, 606], [",", 609, 0, -1], [1, 6, 610], ["@", 611, 0, 612, 0, 613], [1, 6, 614], [3, "keyword", n3[42], 615, n3[47], 616], [1, 6, 608], [1, 165, 617], [1, 6, 612], [1, 6, 618], [1, 6, 610], [1, 463, 619], [1, 6, 620], [/^\??/, 621], [1, 6, 622], [":", 623, 0, 624], [1, 6, 625], [1, 6, 626], [1, 176, 624], [3, "operator", "=", 627, 0, 613], [1, 6, 628], [1, 367, 613], [2, 7, 630, { name: "Statement" }], [1, 6, 631], [3, "keyword", /^of(?![a-zA-Z¡-￿_0-9_\$])/, 632, 0, -1], [1, 6, 633], [1, 165, -1], [n3[24], 634, n3[25], -1], [3, "keyword", n3[48], 636, 0, 636], [1, 6, 637], [3, "def property", n3[19], 642, "[", 638, 3, "number", n3[29], 642, 2, 141, 642, { name: "string", token: "string" }], [1, 6, 639], [1, 165, 640], [1, 6, 641], ["]", 642], [1, 6, 643], [3, "keyword", "*", 644, 0, 644, /^[\!\?]?/, 645], [1, 6, 646], [1, 6, 647], [2, 266, -1, { name: "FunctionDef" }], [":", 648, 0, 649], [1, 6, 650], [1, 6, 651], [1, 176, 649], [3, "operator", "=", 652, 0, 653], [1, 6, 654], [1, 6, 655], [1, 165, 653], [n3[22], -1], [3, "type", "{", 657, 3, "type", /^(?:(?!\{|\}|\*\/).)+/, 656, "\n", 658, 0, -1], [2, 656, 659, { name: "doccomment.type" }], [/^[\t ]*(?:\*(?!\/)[\t ]*)?/, 656], [/^(?=\*\/)/, 656, 3, "type", "}", 656], [1, 6, 661], [":", 662, 0, 665], [1, 6, 663], [1, 176, 664], [1, 6, 665], ["=>", -1], [2, 466, 667, { name: "ParamList" }], [1, 6, 668], [":", 669, 0, 671], [1, 6, 670], [1, 410, 671], [1, 6, 672], ["=>", -1], [3, "operator", "=>", 674], [1, 6, 675], [2, 171, 676, { name: "TypeParams" }, 0, 676], [1, 6, 677], [2, 161, -1, { name: "Block" }, 1, 367, -1], ["<", 679], [1, 678, 679, [1, "=>", [0, /^(?!\>)/, /^[^]/]], 679, ">", -1], [1, 367, 681, 0, -1], [1, 6, 682], [",", 683, 0, -1], [1, 6, 684], [1, 367, 685, 0, 685], [1, 6, 682], [2, 704, 687, { name: "ObjectMember" }, 0, -1], [1, 6, 688], [",", 689, 0, -1], [1, 6, 690], [2, 704, 691, { name: "ObjectMember" }, 0, 691], [1, 6, 688], [1, 719, 693, 0, 693, 0, -1], [1, 6, 694], [",", 695, 0, -1], [1, 6, 696], [1, 719, 697, 0, 697, 0, 697], [1, 6, 694], [1, 724, 699, 0, -1], [1, 6, 700], [",", 701, 0, -1], [1, 6, 702], [1, 724, 703, 0, 703], [1, 6, 700], [3, "keyword", n3[48], 705, 0, 705], [1, 6, 706], [3, "keyword", "*", 707, 0, 707], [1, 6, 708], [3, "def property", n3[19], 709, "[", 710, 3, "number", n3[29], 709, 2, 141, 709, { name: "string", token: "string" }, 3, "operator", "...", 711], [1, 6, 712], [1, 6, 713], [1, 6, 714], [2, 266, -1, { name: "FunctionDef" }, ":", 715, 0, -1], [1, 165, 716], [1, 367, -1], [1, 6, 717], [1, 6, 718], [1, 367, -1], ["]", 709], [1, 463, 720], [1, 6, 721], [3, "operator", "=", 722, 0, -1], [1, 6, 723], [1, 367, -1], [3, "def", /^[a-zA-Z¡-￿__\$][a-zA-Z¡-￿_0-9_\$]*(?![a-z]|[A-Z]|[¡-￿]|_|[0-9]|_|\$| *\:)/, 725, 3, "property", n3[19], 729, 3, "number", n3[29], 729, 2, 141, 729, { name: "string", token: "string" }, 3, "operator", "...", 733], [1, 6, 726], [3, "operator", "=", 727, 0, -1], [1, 6, 728], [1, 367, -1], [1, 6, 730], [":", 731], [1, 6, 732], [1, 719, -1], [1, 6, 734], [1, 719, -1]], start: 0, token: 5 }), o3 = /(^|\s)variable($|\s)/;
    function a(e7) {
      var t5 = /^(if|for|do|while|try)\b/.exec(e7.startLine.slice(e7.startPos));
      return t5 && t5[1];
    }
    var l3 = { Block: "}", BlockOf: "}", ClassBody: "}", AnnotationTypeBody: "}", ObjectLiteral: "}", ObjectPattern: "}", EnumBody: "}", LambdaBlock: "}", WhenBody: "}", ObjType: "}", ArrayInitializer: "}", NamespaceBlock: "}", BraceTokens: "}", ArrayLiteral: "]", BracketTokens: "]", TupleType: "]", ParamList: ")", SimpleParamList: ")", ArgList: ")", ParenExpr: ")", CondExpr: ")", ForSpec: ")", ParenTokens: ")", ParenthesizedExpression: ")", ConstructorParamList: ")", TypeParams: ">", TypeArgs: ">", TemplateArgs: ">", TemplateParams: ">" }, s2 = ["Block", "NamespaceBlock", "ClassBody", "AnnotationTypeBody", "BlockOf", "EnumBody"], c = ["Statement", "ObjectMember", "ClassItem", "EnumConstant", "AnnotationTypeItem", "ArgExpr", "StatementMaybeOf", "NewExpr"];
    function u(e7, t5) {
      for (var n4 = e7.startLine; ; e7 = e7.parent) {
        if ("CondExpr" == e7.name) return r2.countColumn(e7.startLine, e7.startPos + 1, t5.tabSize);
        if (c.indexOf(e7.name) > -1 && /(^\s*|[\(\{\[])$/.test(e7.startLine.slice(0, e7.startPos))) return r2.countColumn(e7.startLine, e7.startPos, t5.tabSize);
        if (!e7.parent || e7.parent.startLine != n4) return r2.countColumn(e7.startLine, null, t5.tabSize);
      }
    }
    function d(e7, t5, n4) {
      if (!e7) return 0;
      if ("string" == e7.name || "comment" == e7.name) return r2.Pass;
      var i5, o4, h2 = l3[e7.name], p2 = t5 && t5.charAt(0) == h2;
      if (h2 && false !== n4.align && (!n4.dontAlign || n4.dontAlign.indexOf(e7.name) < 0) && (function(e8) {
        return !/^\s*((\/\/.*)?$|.*=>)/.test(e8.startLine.slice(e8.startPos + 1));
      })(e7)) return r2.countColumn(e7.startLine, e7.startPos, n4.tabSize) + (p2 ? 0 : 1);
      if (h2 && s2.indexOf(e7.name) > -1) {
        var m2 = e7.parent;
        m2 && "Statement" == m2.name && m2.parent && "Statement" == m2.parent.name && a(m2.parent) && !a(m2) && (m2 = m2.parent);
        var g2 = f(m2, n4);
        return p2 || "NamespaceBlock" == e7.name ? g2 : /^(public|private|protected)\s*:/.test(t5) ? g2 + 1 : !(o4 = e7.parent) || "Statement" != o4.name || !/^switch\b/.test(o4.startLine.slice(o4.startPos)) || (i5 = t5) && /^\s*(case|default)\b/.test(i5) ? g2 + n4.indentUnit : g2 + 2 * n4.indentUnit;
      }
      var v2 = u(e7, n4);
      return h2 ? p2 && (n4.dontCloseBrackets || "").indexOf(h2) < 0 ? v2 : v2 + n4.indentUnit * ((n4.doubleIndentBrackets || "").indexOf(h2) < 0 ? 1 : 2) : c.indexOf(e7.name) > -1 ? a(e7) ? v2 + n4.indentUnit : v2 + 2 * n4.indentUnit : "Alternative" == e7.name || "CatchFinally" == e7.name ? (v2 = u(e7.parent, n4), !t5 || /^((else|catch|finally)\b|\/[\/\*])/.test(t5) ? v2 : v2 + n4.indentUnit) : "ArrowRest" == e7.name ? v2 + n4.indentUnit : "NewExpression" == e7.name && e7.startLine.length > e7.startPos + 5 ? r2.countColumn(e7.startLine, e7.startPos, n4.tabSize) + 2 * n4.indentUnit : "InitializerList" == e7.name ? v2 + 2 : "ThrowsClause" != e7.name || /throws\s*$/.test(e7.startLine.slice(e7.startPos)) ? d(e7.parent, t5, n4) : v2 + 2 * n4.indentUnit;
    }
    function f(e7, t5) {
      for (; ; e7 = e7.parent) {
        if (!e7) return 0;
        if (c.indexOf(e7.name) > -1 || e7.parent && l3[e7.parent.name]) return r2.countColumn(e7.startLine, null, t5.tabSize);
      }
    }
    function h(e7, t5, n4, i5) {
      var o4 = e7.context && e7.context.name;
      if ("DeclType" == o4 || "BeforeStatement" == o4 || "AnnotationHead" == o4 || "Template" == o4 || "str" == o4) return f(e7.context, i5);
      if (("doccomment.braced" == o4 || "doccomment.tagGroup" == o4) && !/^[@*]/.test(t5)) return r2.countColumn(e7.context.startLine, null, i5.tabSize) + 2 * i5.indentUnit;
      var a2 = i5.forceContent && /^\s*(\/\/.*)?$/.test(n4) ? "x" : n4;
      return d(e7.contextAt(a2, n4.length - t5.length), t5, i5);
    }
    function p(e7, t5) {
      for (var r3 = t5 - 1; r3 >= 0; r3--) {
        var n4 = e7.charCodeAt(r3);
        if (10 === n4) break;
        if (32 !== n4 && 9 !== n4) return false;
      }
      return true;
    }
    var m = function(e7) {
      this.config = e7;
    };
    m.prototype.startState = function() {
      return new g();
    }, m.prototype.copyState = function(e7) {
      return e7.copy();
    }, m.prototype.shouldInterceptTokenizing = function(e7) {
      var t5 = e7.currentTemplateState;
      return void 0 !== t5 && null !== t5.mode;
    }, m.prototype.interceptTokenizing = function(e7, t5) {
      if (e7.match("${") && (e7.backUp(2), !this.isEscaped(e7, e7.pos - 2))) return { handled: false };
      if ("`" === e7.peek() && !this.isEscaped(e7, e7.pos)) return { handled: false };
      var r3 = t5.currentTemplateState, n4 = r3.mode, i5 = r3.state, o4 = n4.token(e7, i5);
      return this.backupIfEmbeddedTokenizerOvershot(e7), { handled: true, style: o4 };
    }, m.prototype.trackState = function(e7, t5, r3) {
      if (e7) {
        var n4 = r3.currentTemplateState;
        n4 && "inline-expression" !== n4.kind ? this.trackStateInTemplate(e7, t5, r3, n4) : this.trackStateNotInTemplate(e7, t5, r3, n4), r3.previousVariable = "variable" === e7 ? t5.current() : null;
      }
    }, m.prototype.trackStateNotInTemplate = function(e7, t5, r3, n4) {
      if (n4 && "string-2" === e7 && t5.current().startsWith("}")) return r3.templateStack.pop(), void t5.backUp(t5.current().length - 1);
      if ("string-2" === e7 && t5.current().startsWith("`")) {
        var i5 = this.getModeForTemplateTag(r3.previousVariable), o4 = "template";
        i5 ? (t5.backUp(t5.current().length - 1), r3.templateStack.push(new y(o4, i5, CodeMirror.startState(i5)))) : r3.templateStack.push(new y(o4, null, null));
      }
    }, m.prototype.trackStateInTemplate = function(e7, t5, r3, n4) {
      "string-2" !== e7 || !t5.current().endsWith("`") || this.isEscaped(t5.pos - 1) ? "string-2" !== e7 || !t5.current().endsWith("${") || this.isEscaped(t5.pos - 2) || r3.templateStack.push(new y("inline-expression", null, null)) : r3.templateStack.pop();
    }, m.prototype.backupIfEmbeddedTokenizerOvershot = function(e7) {
      for (var t5 = e7.current(), r3 = 0; ; ) {
        var n4 = t5.slice(r3).search(/`|\$\{/);
        if (-1 === n4) return;
        n4 += r3;
        var i5 = t5.length - n4, o4 = e7.pos - i5;
        if (!this.isEscaped(e7, o4)) return void e7.backUp(t5.length - n4);
        r3 = n4 + 1;
      }
    }, m.prototype.isEscaped = function(e7, t5) {
      for (var r3 = false, n4 = t5; n4 > 0 && "\\" === e7.string[n4 - 1]; ) r3 = !r3, n4--;
      return r3;
    }, m.prototype.getModeForTemplateTag = function(e7) {
      if (!e7) return null;
      "htm" === e7 && (e7 = "html");
      for (var t5 = ["google-" + e7, "" + e7], r3 = 0; r3 < t5.length; r3++) {
        var n4 = CodeMirror.getMode(this.config, t5[r3]);
        if (n4 && "null" !== n4.name) return n4;
      }
      return null;
    };
    var g = function(e7, t5) {
      void 0 === e7 && (e7 = []), void 0 === t5 && (t5 = null), this.templateStack = e7, this.previousVariable = t5;
    }, v = { currentTemplateState: { configurable: true } };
    g.prototype.copy = function() {
      return new g(this.templateStack.map((function(e7) {
        return e7.copy();
      })), this.previousVariable);
    }, v.currentTemplateState.get = function() {
      return this.templateStack[this.templateStack.length - 1];
    }, Object.defineProperties(g.prototype, v);
    var y = function(e7, t5, r3) {
      this.kind = e7, this.mode = t5, this.state = r3;
    };
    y.prototype.copy = function() {
      return this.mode ? new y(this.kind, this.mode, CodeMirror.copyState(this.mode, this.state)) : new y(this.kind, null, null);
    };
    var b = ["Block", "FunctionDef", "ArrowFunc", "ForStatement", "ParamListSpec"], w = (function(e7) {
      function t5(t6, r3) {
        e7.call(this, i4, { predicates: { canInsertSemi: false === r3.requireSemicolons ? p : function() {
          return false;
        } } }), this.templateTokenizer = new m(t6), this.indentConf = { doubleIndentBrackets: ">)", dontCloseBrackets: ")", tabSize: t6.tabSize, indentUnit: t6.indentUnit, forceContent: true };
      }
      return e7 && (t5.__proto__ = e7), t5.prototype = Object.create(e7 && e7.prototype), t5.prototype.constructor = t5, t5.prototype.startState = function() {
        var t6 = e7.prototype.startState.call(this);
        return t6.embeddedParserState = this.templateTokenizer.startState(), t6;
      }, t5.prototype.copyState = function(t6) {
        var r3 = e7.prototype.copyState.call(this, t6);
        return r3.embeddedParserState = this.templateTokenizer.copyState(t6.embeddedParserState), r3;
      }, t5.prototype.token = function(t6, r3) {
        var n4 = r3.embeddedParserState;
        if (this.templateTokenizer.shouldInterceptTokenizing(n4)) {
          var i5 = this.templateTokenizer.interceptTokenizing(t6, n4), a2 = i5.handled, l4 = i5.style;
          if (a2) return l4;
        }
        var s3 = e7.prototype.token.call(this, t6, r3);
        return this.templateTokenizer.trackState(s3, t6, n4), (function(e8, t7, r4, n5) {
          if ("def" == e8) {
            var i6 = (function(e9, t8) {
              for (var r5 = e9; r5; r5 = r5.parent) if (t8.indexOf(r5.name) > -1) return r5;
            })(n5.context, t7), a3 = r4.current();
            if (i6 && (i6.locals || (i6.locals = []), -1 == i6.locals.indexOf(a3) && i6.locals.push(a3), "funcName" != n5.context.name)) return "def local";
          } else o3.test(e8) && !/qualified/.test(e8) && (function(e9, t8) {
            for (var r5 = e9; r5; r5 = r5.parent) if (r5.locals && r5.locals.indexOf(t8) > -1) return true;
            return false;
          })(n5.context, r4.current()) && (e8 = e8.replace(o3, "$1variable-2$2"));
          return e8;
        })(s3, b, t6, r3);
      }, t5.prototype.indent = function(e8, t6, r3) {
        return t6 || (t6 = r3 = "x"), h(e8, t6, r3, this.indentConf);
      }, t5;
    })(r2.GrammarMode), k = { electricInput: /^\s*(?:case .*?:|default:|\{|\})$/, blockCommentStart: "/*", blockCommentEnd: "*/", blockCommentContinue: " * ", lineComment: "//", fold: "brace", closeBrackets: "()[]{}''\"\"``" };
    for (var x2 in k) w.prototype[x2] = k[x2];
    r2.registerHelper("wordChars", "google-typescript", /[\w$]/), r2.defineMode("google-typescript", (function(e7, t5) {
      return new w(e7, t5);
    }));
  })((e5 = "undefined" != typeof globalThis ? globalThis : e5 || self).CodeMirror);
})(window), (function(e5, t3) {
  !(function(e6) {
    function t4(e7) {
      if (e7 && e7.__esModule) return e7;
      var t5 = /* @__PURE__ */ Object.create(null);
      return e7 && Object.keys(e7).forEach((function(r3) {
        if ("default" !== r3) {
          var n4 = Object.getOwnPropertyDescriptor(e7, r3);
          Object.defineProperty(t5, r3, n4.get ? n4 : { enumerable: true, get: function() {
            return e7[r3];
          } });
        }
      })), t5.default = e7, Object.freeze(t5);
    }
    var r2 = t4(e6), n3 = [[1, "\n", "	", " "], /^[a-zA-Z\-\.0-9_]+/], i4 = Object.freeze({ __proto__: null, nodes: [[1, 3, 0, 0, 1], [/^[^]/, 0], [/^[^]/, -1], [2, 4, -1, { name: "comment", token: "comment" }, 2, 6, -1, { name: "doctype", token: "meta" }, 2, 8, -1, { name: "tag" }, 3, "atom", /^\&(?:(?![\;\n\t ]).)*\;/, -1, [1, "\n", /^(?:(?![\&\<]).)+/], -1], ["<!--", 5], [[0, /^(?!\-\-\>)/, /^[^]/], 5, "-->", -1], [/^(?:\<\!doctype|\<\!DOCTYPE)(?![a-zA-Z\-\.0-9_])/, 7], [[0, /^(?!\>)/, /^[^]/], 7, ">", -1], [2, 14, 9, { name: "openTag" }], [3, "tag", "/>", -1, [7, "selfClosing"], 10, 3, "tag", ">", 11], [3, "tag", ">", -1], [1, 3, 11, /^(?=\<\/)/, 12], [[7, "matchingTag"], 13, 0, -1], [2, 21, -1, { name: "closeTag" }], [3, "tag", [0, "<", [6, 24]], 15], [n3[0], 15, 3, "tag", n3[1], 16], [n3[0], 16, 0, 17], [3, "attribute", n3[1], 18, 0, -1], [n3[0], 18, "=", 19, 0, 20], [n3[0], 19, 2, 25, 20, { name: "attributeValue", token: "string" }], [n3[0], 20, 0, 17], [3, "tag", "</", 22], [n3[0], 22, 3, "tag", n3[1], 23], [3, "tag", ">", -1], [n3[0], 24, "/", -1], ['"', 26, "'", 27, /^(?:(?![\n\t \>]).)*/, -1], [[0, /^(?!\")/, /^[^]/], 26, '"', -1], [[0, /^(?!\')/, /^[^]/], 27, "'", -1]], start: 0, token: 2 });
    function o3(e7) {
      var t5 = /^\s*([\w_\.-]+)/.exec(e7);
      return t5 ? t5[1].toLowerCase() : "x";
    }
    function a(e7) {
      return o3(e7.startLine.slice(e7.startPos + 1));
    }
    var l3 = "area base br col command embed frame hr img input keygen link meta param source track wbr menuitem".split(" "), s2 = { selfClosing: function(e7, t5, r3) {
      return l3.indexOf(a(r3)) > -1;
    }, matchingTag: function(e7, t5, r3) {
      return o3(e7.slice(t5 + 2)) == a(r3);
    } }, c = (function(e7) {
      function t5(t6, r3) {
        e7.call(this, i4, { predicates: s2 }), this.conf = t6;
      }
      return e7 && (t5.__proto__ = e7), t5.prototype = Object.create(e7 && e7.prototype), t5.prototype.constructor = t5, t5.prototype.indent = function(e8, t6, r3) {
        return (function(e9, t7, r4, n4) {
          for (var i5 = e9.contextAt(r4, r4.length - t7.length), o4 = /^\s*<\/\s*([\w_\.-]+)/.exec(t7); i5; ) {
            if ("tag" == i5.name) {
              var l4 = CodeMirror.countColumn(i5.startLine, null, n4.tabSize);
              return o4 && o4[1].toLowerCase() == a(i5) ? l4 : l4 + n4.indentUnit;
            }
            if ("openTag" == i5.name) return CodeMirror.countColumn(i5.startLine, null, n4.tabSize) + 2 * n4.indentUnit;
            i5 = i5.parent;
          }
          return 0;
        })(e8, t6, r3, this.conf);
      }, t5;
    })(r2.GrammarMode), u = c.prototype;
    u.electricInput = /^\s*<\/.*?>/, u.blockCommentStart = "<!--", u.blockCommentEnd = "-->", u.fold = "xml", (function(e7) {
      e7.xmlCurrentTag = function(e8) {
        var t5 = e8.context;
        if (!t5 || "openTag" != t5.name && "closeTag" != t5.name) return null;
        var r3 = /^<\/?\s*([\w\-\.]+)/.exec(t5.startLine.slice(t5.startPos));
        return r3 ? { name: r3[1], close: "closeTag" == t5.name } : null;
      }, e7.xmlCurrentContext = function(e8) {
        for (var t5 = [], r3 = e8.context; r3; r3 = r3.parent) if ("tag" == r3.name) {
          var n4 = /^<\s*([\w\-\.]+)/.exec(r3.startLine.slice(r3.startPos));
          n4 && t5.push(n4[1]);
        }
        return t5.reverse();
      };
    })(u), r2.defineMode("google-html", (function(e7, t5) {
      return new c(e7, t5);
    }));
  })((e5 = "undefined" != typeof globalThis ? globalThis : e5 || self).CodeMirror);
})(window), (function(e5) {
  function t3(e6) {
    for (var t4 = {}, r3 = 0; r3 < e6.length; ++r3) t4[e6[r3].toLowerCase()] = true;
    return t4;
  }
  e5.defineMode("css", (function(t4, r3) {
    var n4 = r3.inline;
    r3.propertyKeywords || (r3 = e5.resolveMode("text/css"));
    var i5, o4, a2 = t4.indentUnit, l4 = r3.tokenHooks, s3 = r3.documentTypes || {}, c2 = r3.mediaTypes || {}, u2 = r3.mediaFeatures || {}, d2 = r3.mediaValueKeywords || {}, f2 = r3.propertyKeywords || {}, h2 = r3.nonStandardPropertyKeywords || {}, p2 = r3.fontProperties || {}, m2 = r3.counterDescriptors || {}, g2 = r3.colorKeywords || {}, v2 = r3.valueKeywords || {}, y2 = r3.allowNested, b2 = r3.lineComment, w2 = true === r3.supportsAtComponent, k2 = false !== t4.highlightNonStandardPropertyKeywords;
    function x2(e6, t5) {
      return i5 = t5, e6;
    }
    function C(e6, t5) {
      var r4 = e6.next();
      if (l4[r4]) {
        var n5 = l4[r4](e6, t5);
        if (false !== n5) return n5;
      }
      return "@" == r4 ? (e6.eatWhile(/[\w\\\-]/), x2("def", e6.current())) : "=" == r4 || ("~" == r4 || "|" == r4) && e6.eat("=") ? x2(null, "compare") : '"' == r4 || "'" == r4 ? (t5.tokenize = S(r4), t5.tokenize(e6, t5)) : "#" == r4 ? (e6.eatWhile(/[\w\\\-]/), x2("atom", "hash")) : "!" == r4 ? (e6.match(/^\s*\w*/), x2("keyword", "important")) : /\d/.test(r4) || "." == r4 && e6.eat(/\d/) ? (e6.eatWhile(/[\w.%]/), x2("number", "unit")) : "-" !== r4 ? /[,+>*\/]/.test(r4) ? x2(null, "select-op") : "." == r4 && e6.match(/^-?[_a-z][_a-z0-9-]*/i) ? x2("qualifier", "qualifier") : /[:;{}\[\]\(\)]/.test(r4) ? x2(null, r4) : e6.match(/^[\w-.]+(?=\()/) ? (/^(url(-prefix)?|domain|regexp)$/i.test(e6.current()) && (t5.tokenize = T), x2("variable callee", "variable")) : /[\w\\\-]/.test(r4) ? (e6.eatWhile(/[\w\\\-]/), x2("property", "word")) : x2(null, null) : /[\d.]/.test(e6.peek()) ? (e6.eatWhile(/[\w.%]/), x2("number", "unit")) : e6.match(/^-[\w\\\-]*/) ? (e6.eatWhile(/[\w\\\-]/), e6.match(/^\s*:/, false) ? x2("variable-2", "variable-definition") : x2("variable-2", "variable")) : e6.match(/^\w+-/) ? x2("meta", "meta") : void 0;
    }
    function S(e6) {
      return function(t5, r4) {
        for (var n5, i6 = false; null != (n5 = t5.next()); ) {
          if (n5 == e6 && !i6) {
            ")" == e6 && t5.backUp(1);
            break;
          }
          i6 = !i6 && "\\" == n5;
        }
        return (n5 == e6 || !i6 && ")" != e6) && (r4.tokenize = null), x2("string", "string");
      };
    }
    function T(e6, t5) {
      return e6.next(), e6.match(/^\s*[\"\')]/, false) ? t5.tokenize = null : t5.tokenize = S(")"), x2(null, "(");
    }
    function L(e6, t5, r4) {
      this.type = e6, this.indent = t5, this.prev = r4;
    }
    function A2(e6, t5, r4, n5) {
      return e6.context = new L(r4, t5.indentation() + (false === n5 ? 0 : a2), e6.context), r4;
    }
    function M(e6) {
      return e6.context.prev && (e6.context = e6.context.prev), e6.context.type;
    }
    function z(e6, t5, r4) {
      return N[r4.context.type](e6, t5, r4);
    }
    function O(e6, t5, r4, n5) {
      for (var i6 = n5 || 1; i6 > 0; i6--) r4.context = r4.context.prev;
      return z(e6, t5, r4);
    }
    function _(e6) {
      var t5 = e6.current().toLowerCase();
      o4 = v2.hasOwnProperty(t5) ? "atom" : g2.hasOwnProperty(t5) ? "keyword" : "variable";
    }
    var N = { top: function(e6, t5, r4) {
      if ("{" == e6) return A2(r4, t5, "block");
      if ("}" == e6 && r4.context.prev) return M(r4);
      if (w2 && /@component/i.test(e6)) return A2(r4, t5, "atComponentBlock");
      if (/^@(-moz-)?document$/i.test(e6)) return A2(r4, t5, "documentTypes");
      if (/^@(media|supports|(-moz-)?document|import)$/i.test(e6)) return A2(r4, t5, "atBlock");
      if (/^@(font-face|counter-style)/i.test(e6)) return r4.stateArg = e6, "restricted_atBlock_before";
      if (/^@(-(moz|ms|o|webkit)-)?keyframes$/i.test(e6)) return "keyframes";
      if (e6 && "@" == e6.charAt(0)) return A2(r4, t5, "at");
      if ("hash" == e6) o4 = "builtin";
      else if ("word" == e6) o4 = "tag";
      else {
        if ("variable-definition" == e6) return "maybeprop";
        if ("interpolation" == e6) return A2(r4, t5, "interpolation");
        if (":" == e6) return "pseudo";
        if (y2 && "(" == e6) return A2(r4, t5, "parens");
      }
      return r4.context.type;
    }, block: function(e6, t5, r4) {
      if ("word" == e6) {
        var n5 = t5.current().toLowerCase();
        return f2.hasOwnProperty(n5) ? (o4 = "property", "maybeprop") : h2.hasOwnProperty(n5) ? (o4 = k2 ? "string-2" : "property", "maybeprop") : y2 ? (o4 = t5.match(/^\s*:(?:\s|$)/, false) ? "property" : "tag", "block") : (o4 += " error", "maybeprop");
      }
      return "meta" == e6 ? "block" : y2 || "hash" != e6 && "qualifier" != e6 ? N.top(e6, t5, r4) : (o4 = "error", "block");
    }, maybeprop: function(e6, t5, r4) {
      return ":" == e6 ? A2(r4, t5, "prop") : z(e6, t5, r4);
    }, prop: function(e6, t5, r4) {
      if (";" == e6) return M(r4);
      if ("{" == e6 && y2) return A2(r4, t5, "propBlock");
      if ("}" == e6 || "{" == e6) return O(e6, t5, r4);
      if ("(" == e6) return A2(r4, t5, "parens");
      if ("hash" != e6 || /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(t5.current())) {
        if ("word" == e6) _(t5);
        else if ("interpolation" == e6) return A2(r4, t5, "interpolation");
      } else o4 += " error";
      return "prop";
    }, propBlock: function(e6, t5, r4) {
      return "}" == e6 ? M(r4) : "word" == e6 ? (o4 = "property", "maybeprop") : r4.context.type;
    }, parens: function(e6, t5, r4) {
      return "{" == e6 || "}" == e6 ? O(e6, t5, r4) : ")" == e6 ? M(r4) : "(" == e6 ? A2(r4, t5, "parens") : "interpolation" == e6 ? A2(r4, t5, "interpolation") : ("word" == e6 && _(t5), "parens");
    }, pseudo: function(e6, t5, r4) {
      return "meta" == e6 ? "pseudo" : "word" == e6 ? (o4 = "variable-3", r4.context.type) : z(e6, t5, r4);
    }, documentTypes: function(e6, t5, r4) {
      return "word" == e6 && s3.hasOwnProperty(t5.current()) ? (o4 = "tag", r4.context.type) : N.atBlock(e6, t5, r4);
    }, atBlock: function(e6, t5, r4) {
      if ("(" == e6) return A2(r4, t5, "atBlock_parens");
      if ("}" == e6 || ";" == e6) return O(e6, t5, r4);
      if ("{" == e6) return M(r4) && A2(r4, t5, y2 ? "block" : "top");
      if ("interpolation" == e6) return A2(r4, t5, "interpolation");
      if ("word" == e6) {
        var n5 = t5.current().toLowerCase();
        o4 = "only" == n5 || "not" == n5 || "and" == n5 || "or" == n5 ? "keyword" : c2.hasOwnProperty(n5) ? "attribute" : u2.hasOwnProperty(n5) ? "property" : d2.hasOwnProperty(n5) ? "keyword" : f2.hasOwnProperty(n5) ? "property" : h2.hasOwnProperty(n5) ? k2 ? "string-2" : "property" : v2.hasOwnProperty(n5) ? "atom" : g2.hasOwnProperty(n5) ? "keyword" : "error";
      }
      return r4.context.type;
    }, atComponentBlock: function(e6, t5, r4) {
      return "}" == e6 ? O(e6, t5, r4) : "{" == e6 ? M(r4) && A2(r4, t5, y2 ? "block" : "top", false) : ("word" == e6 && (o4 = "error"), r4.context.type);
    }, atBlock_parens: function(e6, t5, r4) {
      return ")" == e6 ? M(r4) : "{" == e6 || "}" == e6 ? O(e6, t5, r4, 2) : N.atBlock(e6, t5, r4);
    }, restricted_atBlock_before: function(e6, t5, r4) {
      return "{" == e6 ? A2(r4, t5, "restricted_atBlock") : "word" == e6 && "@counter-style" == r4.stateArg ? (o4 = "variable", "restricted_atBlock_before") : z(e6, t5, r4);
    }, restricted_atBlock: function(e6, t5, r4) {
      return "}" == e6 ? (r4.stateArg = null, M(r4)) : "word" == e6 ? (o4 = "@font-face" == r4.stateArg && !p2.hasOwnProperty(t5.current().toLowerCase()) || "@counter-style" == r4.stateArg && !m2.hasOwnProperty(t5.current().toLowerCase()) ? "error" : "property", "maybeprop") : "restricted_atBlock";
    }, keyframes: function(e6, t5, r4) {
      return "word" == e6 ? (o4 = "variable", "keyframes") : "{" == e6 ? A2(r4, t5, "top") : z(e6, t5, r4);
    }, at: function(e6, t5, r4) {
      return ";" == e6 ? M(r4) : "{" == e6 || "}" == e6 ? O(e6, t5, r4) : ("word" == e6 ? o4 = "tag" : "hash" == e6 && (o4 = "builtin"), "at");
    }, interpolation: function(e6, t5, r4) {
      return "}" == e6 ? M(r4) : "{" == e6 || ";" == e6 ? O(e6, t5, r4) : ("word" == e6 ? o4 = "variable" : "variable" != e6 && "(" != e6 && ")" != e6 && (o4 = "error"), "interpolation");
    } };
    return { startState: function(e6) {
      return { tokenize: null, state: n4 ? "block" : "top", stateArg: null, context: new L(n4 ? "block" : "top", e6 || 0, null) };
    }, token: function(e6, t5) {
      if (!t5.tokenize && e6.eatSpace()) return null;
      var r4 = (t5.tokenize || C)(e6, t5);
      return r4 && "object" == typeof r4 && (i5 = r4[1], r4 = r4[0]), o4 = r4, "comment" != i5 && (t5.state = N[t5.state](i5, e6, t5)), o4;
    }, indent: function(e6, t5) {
      var r4 = e6.context, n5 = t5 && t5.charAt(0), i6 = r4.indent;
      return "prop" != r4.type || "}" != n5 && ")" != n5 || (r4 = r4.prev), r4.prev && ("}" != n5 || "block" != r4.type && "top" != r4.type && "interpolation" != r4.type && "restricted_atBlock" != r4.type ? (")" != n5 || "parens" != r4.type && "atBlock_parens" != r4.type) && ("{" != n5 || "at" != r4.type && "atBlock" != r4.type) || (i6 = Math.max(0, r4.indent - a2)) : i6 = (r4 = r4.prev).indent), i6;
    }, electricChars: "}", blockCommentStart: "/*", blockCommentEnd: "*/", blockCommentContinue: " * ", lineComment: b2, fold: "brace" };
  }));
  var r2 = ["domain", "regexp", "url", "url-prefix"], n3 = t3(r2), i4 = ["all", "aural", "braille", "handheld", "print", "projection", "screen", "tty", "tv", "embossed"], o3 = t3(i4), a = ["width", "min-width", "max-width", "height", "min-height", "max-height", "device-width", "min-device-width", "max-device-width", "device-height", "min-device-height", "max-device-height", "aspect-ratio", "min-aspect-ratio", "max-aspect-ratio", "device-aspect-ratio", "min-device-aspect-ratio", "max-device-aspect-ratio", "color", "min-color", "max-color", "color-index", "min-color-index", "max-color-index", "monochrome", "min-monochrome", "max-monochrome", "resolution", "min-resolution", "max-resolution", "scan", "grid", "orientation", "device-pixel-ratio", "min-device-pixel-ratio", "max-device-pixel-ratio", "pointer", "any-pointer", "hover", "any-hover", "prefers-color-scheme", "dynamic-range", "video-dynamic-range"], l3 = t3(a), s2 = ["landscape", "portrait", "none", "coarse", "fine", "on-demand", "hover", "interlace", "progressive", "dark", "light", "standard", "high"], c = t3(s2), u = ["align-content", "align-items", "align-self", "alignment-adjust", "alignment-baseline", "all", "anchor-point", "animation", "animation-delay", "animation-direction", "animation-duration", "animation-fill-mode", "animation-iteration-count", "animation-name", "animation-play-state", "animation-timing-function", "appearance", "azimuth", "backdrop-filter", "backface-visibility", "background", "background-attachment", "background-blend-mode", "background-clip", "background-color", "background-image", "background-origin", "background-position", "background-position-x", "background-position-y", "background-repeat", "background-size", "baseline-shift", "binding", "bleed", "block-size", "bookmark-label", "bookmark-level", "bookmark-state", "bookmark-target", "border", "border-bottom", "border-bottom-color", "border-bottom-left-radius", "border-bottom-right-radius", "border-bottom-style", "border-bottom-width", "border-collapse", "border-color", "border-image", "border-image-outset", "border-image-repeat", "border-image-slice", "border-image-source", "border-image-width", "border-left", "border-left-color", "border-left-style", "border-left-width", "border-radius", "border-right", "border-right-color", "border-right-style", "border-right-width", "border-spacing", "border-style", "border-top", "border-top-color", "border-top-left-radius", "border-top-right-radius", "border-top-style", "border-top-width", "border-width", "bottom", "box-decoration-break", "box-shadow", "box-sizing", "break-after", "break-before", "break-inside", "caption-side", "caret-color", "clear", "clip", "color", "color-profile", "column-count", "column-fill", "column-gap", "column-rule", "column-rule-color", "column-rule-style", "column-rule-width", "column-span", "column-width", "columns", "contain", "content", "counter-increment", "counter-reset", "crop", "cue", "cue-after", "cue-before", "cursor", "direction", "display", "dominant-baseline", "drop-initial-after-adjust", "drop-initial-after-align", "drop-initial-before-adjust", "drop-initial-before-align", "drop-initial-size", "drop-initial-value", "elevation", "empty-cells", "fit", "fit-content", "fit-position", "flex", "flex-basis", "flex-direction", "flex-flow", "flex-grow", "flex-shrink", "flex-wrap", "float", "float-offset", "flow-from", "flow-into", "font", "font-family", "font-feature-settings", "font-kerning", "font-language-override", "font-optical-sizing", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-synthesis", "font-variant", "font-variant-alternates", "font-variant-caps", "font-variant-east-asian", "font-variant-ligatures", "font-variant-numeric", "font-variant-position", "font-variation-settings", "font-weight", "gap", "grid", "grid-area", "grid-auto-columns", "grid-auto-flow", "grid-auto-rows", "grid-column", "grid-column-end", "grid-column-gap", "grid-column-start", "grid-gap", "grid-row", "grid-row-end", "grid-row-gap", "grid-row-start", "grid-template", "grid-template-areas", "grid-template-columns", "grid-template-rows", "hanging-punctuation", "height", "hyphens", "icon", "image-orientation", "image-rendering", "image-resolution", "inline-box-align", "inset", "inset-block", "inset-block-end", "inset-block-start", "inset-inline", "inset-inline-end", "inset-inline-start", "isolation", "justify-content", "justify-items", "justify-self", "left", "letter-spacing", "line-break", "line-height", "line-height-step", "line-stacking", "line-stacking-ruby", "line-stacking-shift", "line-stacking-strategy", "list-style", "list-style-image", "list-style-position", "list-style-type", "margin", "margin-bottom", "margin-left", "margin-right", "margin-top", "marks", "marquee-direction", "marquee-loop", "marquee-play-count", "marquee-speed", "marquee-style", "mask-clip", "mask-composite", "mask-image", "mask-mode", "mask-origin", "mask-position", "mask-repeat", "mask-size", "mask-type", "max-block-size", "max-height", "max-inline-size", "max-width", "min-block-size", "min-height", "min-inline-size", "min-width", "mix-blend-mode", "move-to", "nav-down", "nav-index", "nav-left", "nav-right", "nav-up", "object-fit", "object-position", "offset", "offset-anchor", "offset-distance", "offset-path", "offset-position", "offset-rotate", "opacity", "order", "orphans", "outline", "outline-color", "outline-offset", "outline-style", "outline-width", "overflow", "overflow-style", "overflow-wrap", "overflow-x", "overflow-y", "padding", "padding-bottom", "padding-left", "padding-right", "padding-top", "page", "page-break-after", "page-break-before", "page-break-inside", "page-policy", "pause", "pause-after", "pause-before", "perspective", "perspective-origin", "pitch", "pitch-range", "place-content", "place-items", "place-self", "play-during", "position", "presentation-level", "punctuation-trim", "quotes", "region-break-after", "region-break-before", "region-break-inside", "region-fragment", "rendering-intent", "resize", "rest", "rest-after", "rest-before", "richness", "right", "rotate", "rotation", "rotation-point", "row-gap", "ruby-align", "ruby-overhang", "ruby-position", "ruby-span", "scale", "scroll-behavior", "scroll-margin", "scroll-margin-block", "scroll-margin-block-end", "scroll-margin-block-start", "scroll-margin-bottom", "scroll-margin-inline", "scroll-margin-inline-end", "scroll-margin-inline-start", "scroll-margin-left", "scroll-margin-right", "scroll-margin-top", "scroll-padding", "scroll-padding-block", "scroll-padding-block-end", "scroll-padding-block-start", "scroll-padding-bottom", "scroll-padding-inline", "scroll-padding-inline-end", "scroll-padding-inline-start", "scroll-padding-left", "scroll-padding-right", "scroll-padding-top", "scroll-snap-align", "scroll-snap-type", "shape-image-threshold", "shape-inside", "shape-margin", "shape-outside", "size", "speak", "speak-as", "speak-header", "speak-numeral", "speak-punctuation", "speech-rate", "stress", "string-set", "tab-size", "table-layout", "target", "target-name", "target-new", "target-position", "text-align", "text-align-last", "text-combine-upright", "text-decoration", "text-decoration-color", "text-decoration-line", "text-decoration-skip", "text-decoration-skip-ink", "text-decoration-style", "text-emphasis", "text-emphasis-color", "text-emphasis-position", "text-emphasis-style", "text-height", "text-indent", "text-justify", "text-orientation", "text-outline", "text-overflow", "text-rendering", "text-shadow", "text-size-adjust", "text-space-collapse", "text-transform", "text-underline-position", "text-wrap", "top", "touch-action", "transform", "transform-origin", "transform-style", "transition", "transition-delay", "transition-duration", "transition-property", "transition-timing-function", "translate", "unicode-bidi", "user-select", "vertical-align", "visibility", "voice-balance", "voice-duration", "voice-family", "voice-pitch", "voice-range", "voice-rate", "voice-stress", "voice-volume", "volume", "white-space", "widows", "width", "will-change", "word-break", "word-spacing", "word-wrap", "writing-mode", "z-index", "clip-path", "clip-rule", "mask", "enable-background", "filter", "flood-color", "flood-opacity", "lighting-color", "stop-color", "stop-opacity", "pointer-events", "color-interpolation", "color-interpolation-filters", "color-rendering", "fill", "fill-opacity", "fill-rule", "image-rendering", "marker", "marker-end", "marker-mid", "marker-start", "paint-order", "shape-rendering", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "text-rendering", "baseline-shift", "dominant-baseline", "glyph-orientation-horizontal", "glyph-orientation-vertical", "text-anchor", "writing-mode"], d = t3(u), f = ["accent-color", "aspect-ratio", "border-block", "border-block-color", "border-block-end", "border-block-end-color", "border-block-end-style", "border-block-end-width", "border-block-start", "border-block-start-color", "border-block-start-style", "border-block-start-width", "border-block-style", "border-block-width", "border-inline", "border-inline-color", "border-inline-end", "border-inline-end-color", "border-inline-end-style", "border-inline-end-width", "border-inline-start", "border-inline-start-color", "border-inline-start-style", "border-inline-start-width", "border-inline-style", "border-inline-width", "content-visibility", "margin-block", "margin-block-end", "margin-block-start", "margin-inline", "margin-inline-end", "margin-inline-start", "overflow-anchor", "overscroll-behavior", "padding-block", "padding-block-end", "padding-block-start", "padding-inline", "padding-inline-end", "padding-inline-start", "scroll-snap-stop", "scrollbar-3d-light-color", "scrollbar-arrow-color", "scrollbar-base-color", "scrollbar-dark-shadow-color", "scrollbar-face-color", "scrollbar-highlight-color", "scrollbar-shadow-color", "scrollbar-track-color", "searchfield-cancel-button", "searchfield-decoration", "searchfield-results-button", "searchfield-results-decoration", "shape-inside", "zoom"], h = t3(f), p = t3(["font-display", "font-family", "src", "unicode-range", "font-variant", "font-feature-settings", "font-stretch", "font-weight", "font-style"]), m = t3(["additive-symbols", "fallback", "negative", "pad", "prefix", "range", "speak-as", "suffix", "symbols", "system"]), g = ["aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "grey", "green", "greenyellow", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightgrey", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "slategrey", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"], v = t3(g), y = ["above", "absolute", "activeborder", "additive", "activecaption", "afar", "after-white-space", "ahead", "alias", "all", "all-scroll", "alphabetic", "alternate", "always", "amharic", "amharic-abegede", "antialiased", "appworkspace", "arabic-indic", "armenian", "asterisks", "attr", "auto", "auto-flow", "avoid", "avoid-column", "avoid-page", "avoid-region", "axis-pan", "background", "backwards", "baseline", "below", "bidi-override", "binary", "bengali", "blink", "block", "block-axis", "blur", "bold", "bolder", "border", "border-box", "both", "bottom", "break", "break-all", "break-word", "brightness", "bullets", "button", "buttonface", "buttonhighlight", "buttonshadow", "buttontext", "calc", "cambodian", "capitalize", "caps-lock-indicator", "caption", "captiontext", "caret", "cell", "center", "checkbox", "circle", "cjk-decimal", "cjk-earthly-branch", "cjk-heavenly-stem", "cjk-ideographic", "clear", "clip", "close-quote", "col-resize", "collapse", "color", "color-burn", "color-dodge", "column", "column-reverse", "compact", "condensed", "conic-gradient", "contain", "content", "contents", "content-box", "context-menu", "continuous", "contrast", "copy", "counter", "counters", "cover", "crop", "cross", "crosshair", "cubic-bezier", "currentcolor", "cursive", "cyclic", "darken", "dashed", "decimal", "decimal-leading-zero", "default", "default-button", "dense", "destination-atop", "destination-in", "destination-out", "destination-over", "devanagari", "difference", "disc", "discard", "disclosure-closed", "disclosure-open", "document", "dot-dash", "dot-dot-dash", "dotted", "double", "down", "drop-shadow", "e-resize", "ease", "ease-in", "ease-in-out", "ease-out", "element", "ellipse", "ellipsis", "embed", "end", "ethiopic", "ethiopic-abegede", "ethiopic-abegede-am-et", "ethiopic-abegede-gez", "ethiopic-abegede-ti-er", "ethiopic-abegede-ti-et", "ethiopic-halehame-aa-er", "ethiopic-halehame-aa-et", "ethiopic-halehame-am-et", "ethiopic-halehame-gez", "ethiopic-halehame-om-et", "ethiopic-halehame-sid-et", "ethiopic-halehame-so-et", "ethiopic-halehame-ti-er", "ethiopic-halehame-ti-et", "ethiopic-halehame-tig", "ethiopic-numeric", "ew-resize", "exclusion", "expanded", "extends", "extra-condensed", "extra-expanded", "fantasy", "fast", "fill", "fill-box", "fixed", "flat", "flex", "flex-end", "flex-start", "footnotes", "forwards", "from", "geometricPrecision", "georgian", "grayscale", "graytext", "grid", "groove", "gujarati", "gurmukhi", "hand", "hangul", "hangul-consonant", "hard-light", "hebrew", "help", "hidden", "hide", "higher", "highlight", "highlighttext", "hiragana", "hiragana-iroha", "horizontal", "hsl", "hsla", "hue", "hue-rotate", "icon", "ignore", "inactiveborder", "inactivecaption", "inactivecaptiontext", "infinite", "infobackground", "infotext", "inherit", "initial", "inline", "inline-axis", "inline-block", "inline-flex", "inline-grid", "inline-table", "inset", "inside", "intrinsic", "invert", "italic", "japanese-formal", "japanese-informal", "justify", "kannada", "katakana", "katakana-iroha", "keep-all", "khmer", "korean-hangul-formal", "korean-hanja-formal", "korean-hanja-informal", "landscape", "lao", "large", "larger", "left", "level", "lighter", "lighten", "line-through", "linear", "linear-gradient", "lines", "list-item", "listbox", "listitem", "local", "logical", "loud", "lower", "lower-alpha", "lower-armenian", "lower-greek", "lower-hexadecimal", "lower-latin", "lower-norwegian", "lower-roman", "lowercase", "ltr", "luminosity", "malayalam", "manipulation", "match", "matrix", "matrix3d", "media-play-button", "media-slider", "media-sliderthumb", "media-volume-slider", "media-volume-sliderthumb", "medium", "menu", "menulist", "menulist-button", "menutext", "message-box", "middle", "min-intrinsic", "mix", "mongolian", "monospace", "move", "multiple", "multiple_mask_images", "multiply", "myanmar", "n-resize", "narrower", "ne-resize", "nesw-resize", "no-close-quote", "no-drop", "no-open-quote", "no-repeat", "none", "normal", "not-allowed", "nowrap", "ns-resize", "numbers", "numeric", "nw-resize", "nwse-resize", "oblique", "octal", "opacity", "open-quote", "optimizeLegibility", "optimizeSpeed", "oriya", "oromo", "outset", "outside", "outside-shape", "overlay", "overline", "padding", "padding-box", "painted", "page", "paused", "persian", "perspective", "pinch-zoom", "plus-darker", "plus-lighter", "pointer", "polygon", "portrait", "pre", "pre-line", "pre-wrap", "preserve-3d", "progress", "push-button", "radial-gradient", "radio", "read-only", "read-write", "read-write-plaintext-only", "rectangle", "region", "relative", "repeat", "repeating-linear-gradient", "repeating-radial-gradient", "repeating-conic-gradient", "repeat-x", "repeat-y", "reset", "reverse", "rgb", "rgba", "ridge", "right", "rotate", "rotate3d", "rotateX", "rotateY", "rotateZ", "round", "row", "row-resize", "row-reverse", "rtl", "run-in", "running", "s-resize", "sans-serif", "saturate", "saturation", "scale", "scale3d", "scaleX", "scaleY", "scaleZ", "screen", "scroll", "scrollbar", "scroll-position", "se-resize", "searchfield", "searchfield-cancel-button", "searchfield-decoration", "searchfield-results-button", "searchfield-results-decoration", "self-start", "self-end", "semi-condensed", "semi-expanded", "separate", "sepia", "serif", "show", "sidama", "simp-chinese-formal", "simp-chinese-informal", "single", "skew", "skewX", "skewY", "skip-white-space", "slide", "slider-horizontal", "slider-vertical", "sliderthumb-horizontal", "sliderthumb-vertical", "slow", "small", "small-caps", "small-caption", "smaller", "soft-light", "solid", "somali", "source-atop", "source-in", "source-out", "source-over", "space", "space-around", "space-between", "space-evenly", "spell-out", "square", "square-button", "start", "static", "status-bar", "stretch", "stroke", "stroke-box", "sub", "subpixel-antialiased", "svg_masks", "super", "sw-resize", "symbolic", "symbols", "system-ui", "table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row", "table-row-group", "tamil", "telugu", "text", "text-bottom", "text-top", "textarea", "textfield", "thai", "thick", "thin", "threeddarkshadow", "threedface", "threedhighlight", "threedlightshadow", "threedshadow", "tibetan", "tigre", "tigrinya-er", "tigrinya-er-abegede", "tigrinya-et", "tigrinya-et-abegede", "to", "top", "trad-chinese-formal", "trad-chinese-informal", "transform", "translate", "translate3d", "translateX", "translateY", "translateZ", "transparent", "ultra-condensed", "ultra-expanded", "underline", "unidirectional-pan", "unset", "up", "upper-alpha", "upper-armenian", "upper-greek", "upper-hexadecimal", "upper-latin", "upper-norwegian", "upper-roman", "uppercase", "urdu", "url", "var", "vertical", "vertical-text", "view-box", "visible", "visibleFill", "visiblePainted", "visibleStroke", "visual", "w-resize", "wait", "wave", "wider", "window", "windowframe", "windowtext", "words", "wrap", "wrap-reverse", "x-large", "x-small", "xor", "xx-large", "xx-small"], b = t3(y), w = r2.concat(i4).concat(a).concat(s2).concat(u).concat(f).concat(g).concat(y);
  function k(e6, t4) {
    for (var r3, n4 = false; null != (r3 = e6.next()); ) {
      if (n4 && "/" == r3) {
        t4.tokenize = null;
        break;
      }
      n4 = "*" == r3;
    }
    return ["comment", "comment"];
  }
  e5.registerHelper("hintWords", "css", w), e5.defineMIME("text/css", { documentTypes: n3, mediaTypes: o3, mediaFeatures: l3, mediaValueKeywords: c, propertyKeywords: d, nonStandardPropertyKeywords: h, fontProperties: p, counterDescriptors: m, colorKeywords: v, valueKeywords: b, tokenHooks: { "/": function(e6, t4) {
    return !!e6.eat("*") && (t4.tokenize = k, k(e6, t4));
  } }, name: "css" }), e5.defineMIME("text/x-scss", { mediaTypes: o3, mediaFeatures: l3, mediaValueKeywords: c, propertyKeywords: d, nonStandardPropertyKeywords: h, colorKeywords: v, valueKeywords: b, fontProperties: p, allowNested: true, lineComment: "//", tokenHooks: { "/": function(e6, t4) {
    return e6.eat("/") ? (e6.skipToEnd(), ["comment", "comment"]) : e6.eat("*") ? (t4.tokenize = k, k(e6, t4)) : ["operator", "operator"];
  }, ":": function(e6) {
    return !!e6.match(/^\s*\{/, false) && [null, null];
  }, $: function(e6) {
    return e6.match(/^[\w-]+/), e6.match(/^\s*:/, false) ? ["variable-2", "variable-definition"] : ["variable-2", "variable"];
  }, "#": function(e6) {
    return !!e6.eat("{") && [null, "interpolation"];
  } }, name: "css", helperType: "scss" }), e5.defineMIME("text/x-less", { mediaTypes: o3, mediaFeatures: l3, mediaValueKeywords: c, propertyKeywords: d, nonStandardPropertyKeywords: h, colorKeywords: v, valueKeywords: b, fontProperties: p, allowNested: true, lineComment: "//", tokenHooks: { "/": function(e6, t4) {
    return e6.eat("/") ? (e6.skipToEnd(), ["comment", "comment"]) : e6.eat("*") ? (t4.tokenize = k, k(e6, t4)) : ["operator", "operator"];
  }, "@": function(e6) {
    return e6.eat("{") ? [null, "interpolation"] : !e6.match(/^(charset|document|font-face|import|(-(moz|ms|o|webkit)-)?keyframes|media|namespace|page|supports)\b/i, false) && (e6.eatWhile(/[\w\\\-]/), e6.match(/^\s*:/, false) ? ["variable-2", "variable-definition"] : ["variable-2", "variable"]);
  }, "&": function() {
    return ["atom", "atom"];
  } }, name: "css", helperType: "less" }), e5.defineMIME("text/x-gss", { documentTypes: n3, mediaTypes: o3, mediaFeatures: l3, propertyKeywords: d, nonStandardPropertyKeywords: h, fontProperties: p, counterDescriptors: m, colorKeywords: v, valueKeywords: b, supportsAtComponent: true, tokenHooks: { "/": function(e6, t4) {
    return !!e6.eat("*") && (t4.tokenize = k, k(e6, t4));
  } }, name: "css", helperType: "gss" });
})(CodeMirror), (function(e5) {
  e5.defineMode("javascript", (function(t3, r2) {
    var n3, i4, o3 = t3.indentUnit, a = r2.statementIndent, l3 = r2.jsonld, s2 = r2.json || l3, c = false !== r2.trackScope, u = r2.typescript, d = r2.wordCharacters || /[\w$\xa1-\uffff]/, f = (function() {
      function e6(e7) {
        return { type: e7, style: "keyword" };
      }
      var t4 = e6("keyword a"), r3 = e6("keyword b"), n4 = e6("keyword c"), i5 = e6("keyword d"), o4 = e6("operator"), a2 = { type: "atom", style: "atom" };
      return { if: e6("if"), while: t4, with: t4, else: r3, do: r3, try: r3, finally: r3, return: i5, break: i5, continue: i5, new: e6("new"), delete: n4, void: n4, throw: n4, debugger: e6("debugger"), var: e6("var"), const: e6("var"), let: e6("var"), function: e6("function"), catch: e6("catch"), for: e6("for"), switch: e6("switch"), case: e6("case"), default: e6("default"), in: o4, typeof: o4, instanceof: o4, true: a2, false: a2, null: a2, undefined: a2, NaN: a2, Infinity: a2, this: e6("this"), class: e6("class"), super: e6("atom"), yield: n4, export: e6("export"), import: e6("import"), extends: n4, await: n4 };
    })(), h = /[+\-*&%=<>!?|~^@]/, p = /^@(context|id|value|language|type|container|list|set|reverse|index|base|vocab|graph)"/;
    function m(e6, t4, r3) {
      return n3 = e6, i4 = r3, t4;
    }
    function g(e6, t4) {
      var r3, n4 = e6.next();
      if ('"' == n4 || "'" == n4) return t4.tokenize = (r3 = n4, function(e7, t5) {
        var n5, i6 = false;
        if (l3 && "@" == e7.peek() && e7.match(p)) return t5.tokenize = g, m("jsonld-keyword", "meta");
        for (; null != (n5 = e7.next()) && (n5 != r3 || i6); ) i6 = !i6 && "\\" == n5;
        return i6 || (t5.tokenize = g), m("string", "string");
      }), t4.tokenize(e6, t4);
      if ("." == n4 && e6.match(/^\d[\d_]*(?:[eE][+\-]?[\d_]+)?/)) return m("number", "number");
      if ("." == n4 && e6.match("..")) return m("spread", "meta");
      if (/[\[\]{}\(\),;\:\.]/.test(n4)) return m(n4);
      if ("=" == n4 && e6.eat(">")) return m("=>", "operator");
      if ("0" == n4 && e6.match(/^(?:x[\dA-Fa-f_]+|o[0-7_]+|b[01_]+)n?/)) return m("number", "number");
      if (/\d/.test(n4)) return e6.match(/^[\d_]*(?:n|(?:\.[\d_]*)?(?:[eE][+\-]?[\d_]+)?)?/), m("number", "number");
      if ("/" == n4) return e6.eat("*") ? (t4.tokenize = v, v(e6, t4)) : e6.eat("/") ? (e6.skipToEnd(), m("comment", "comment")) : Je(e6, t4, 1) ? ((function(e7) {
        for (var t5, r4 = false, n5 = false; null != (t5 = e7.next()); ) {
          if (!r4) {
            if ("/" == t5 && !n5) return;
            "[" == t5 ? n5 = true : n5 && "]" == t5 && (n5 = false);
          }
          r4 = !r4 && "\\" == t5;
        }
      })(e6), e6.match(/^\b(([gimyus])(?![gimyus]*\2))+\b/), m("regexp", "string-2")) : (e6.eat("="), m("operator", "operator", e6.current()));
      if ("`" == n4) return t4.tokenize = y, y(e6, t4);
      if ("#" == n4 && "!" == e6.peek()) return e6.skipToEnd(), m("meta", "meta");
      if ("#" == n4 && e6.eatWhile(d)) return m("variable", "property");
      if ("<" == n4 && e6.match("!--") || "-" == n4 && e6.match("->") && !/\S/.test(e6.string.slice(0, e6.start))) return e6.skipToEnd(), m("comment", "comment");
      if (h.test(n4)) return ">" == n4 && t4.lexical && ">" == t4.lexical.type || (e6.eat("=") ? "!" != n4 && "=" != n4 || e6.eat("=") : /[<>*+\-|&?]/.test(n4) && (e6.eat(n4), ">" == n4 && e6.eat(n4))), "?" == n4 && e6.eat(".") ? m(".") : m("operator", "operator", e6.current());
      if (d.test(n4)) {
        e6.eatWhile(d);
        var i5 = e6.current();
        if ("." != t4.lastType) {
          if (f.propertyIsEnumerable(i5)) {
            var o4 = f[i5];
            return m(o4.type, o4.style, i5);
          }
          if ("async" == i5 && e6.match(/^(\s|\/\*([^*]|\*(?!\/))*?\*\/)*[\[\(\w]/, false)) return m("async", "keyword", i5);
        }
        return m("variable", "variable", i5);
      }
    }
    function v(e6, t4) {
      for (var r3, n4 = false; r3 = e6.next(); ) {
        if ("/" == r3 && n4) {
          t4.tokenize = g;
          break;
        }
        n4 = "*" == r3;
      }
      return m("comment", "comment");
    }
    function y(e6, t4) {
      for (var r3, n4 = false; null != (r3 = e6.next()); ) {
        if (!n4 && ("`" == r3 || "$" == r3 && e6.eat("{"))) {
          t4.tokenize = g;
          break;
        }
        n4 = !n4 && "\\" == r3;
      }
      return m("quasi", "string-2", e6.current());
    }
    function b(e6, t4) {
      t4.fatArrowAt && (t4.fatArrowAt = null);
      var r3 = e6.string.indexOf("=>", e6.start);
      if (!(r3 < 0)) {
        if (u) {
          var n4 = /:\s*(?:\w+(?:<[^>]*>|\[\])?|\{[^}]*\})\s*$/.exec(e6.string.slice(e6.start, r3));
          n4 && (r3 = n4.index);
        }
        for (var i5 = 0, o4 = false, a2 = r3 - 1; a2 >= 0; --a2) {
          var l4 = e6.string.charAt(a2), s3 = "([{}])".indexOf(l4);
          if (s3 >= 0 && s3 < 3) {
            if (!i5) {
              ++a2;
              break;
            }
            if (0 == --i5) {
              "(" == l4 && (o4 = true);
              break;
            }
          } else if (s3 >= 3 && s3 < 6) ++i5;
          else if (d.test(l4)) o4 = true;
          else if (/["'\/`]/.test(l4)) for (; ; --a2) {
            if (0 == a2) return;
            if (e6.string.charAt(a2 - 1) == l4 && "\\" != e6.string.charAt(a2 - 2)) {
              a2--;
              break;
            }
          }
          else if (o4 && !i5) {
            ++a2;
            break;
          }
        }
        o4 && !i5 && (t4.fatArrowAt = a2);
      }
    }
    var w = { atom: true, number: true, variable: true, string: true, regexp: true, this: true, import: true, "jsonld-keyword": true };
    function k(e6, t4, r3, n4, i5, o4) {
      this.indented = e6, this.column = t4, this.type = r3, this.prev = i5, this.info = o4, null != n4 && (this.align = n4);
    }
    function x2(e6, t4) {
      if (!c) return false;
      for (var r3 = e6.localVars; r3; r3 = r3.next) if (r3.name == t4) return true;
      for (var n4 = e6.context; n4; n4 = n4.prev) for (r3 = n4.vars; r3; r3 = r3.next) if (r3.name == t4) return true;
    }
    function C(e6, t4, r3, n4, i5) {
      var o4 = e6.cc;
      for (S.state = e6, S.stream = i5, S.marked = null, S.cc = o4, S.style = t4, e6.lexical.hasOwnProperty("align") || (e6.lexical.align = true); ; ) if ((o4.length ? o4.pop() : s2 ? R : B)(r3, n4)) {
        for (; o4.length && o4[o4.length - 1].lex; ) o4.pop()();
        return S.marked ? S.marked : "variable" == r3 && x2(e6, n4) ? "variable-2" : t4;
      }
    }
    var S = { state: null, column: null, marked: null, cc: null };
    function T() {
      for (var e6 = arguments.length - 1; e6 >= 0; e6--) S.cc.push(arguments[e6]);
    }
    function L() {
      return T.apply(null, arguments), true;
    }
    function A2(e6, t4) {
      for (var r3 = t4; r3; r3 = r3.next) if (r3.name == e6) return true;
      return false;
    }
    function M(e6) {
      var t4 = S.state;
      if (S.marked = "def", c) {
        if (t4.context) {
          if ("var" == t4.lexical.info && t4.context && t4.context.block) {
            var n4 = z(e6, t4.context);
            if (null != n4) return void (t4.context = n4);
          } else if (!A2(e6, t4.localVars)) return void (t4.localVars = new N(e6, t4.localVars));
        }
        r2.globalVars && !A2(e6, t4.globalVars) && (t4.globalVars = new N(e6, t4.globalVars));
      }
    }
    function z(e6, t4) {
      if (t4) {
        if (t4.block) {
          var r3 = z(e6, t4.prev);
          return r3 ? r3 == t4.prev ? t4 : new _(r3, t4.vars, true) : null;
        }
        return A2(e6, t4.vars) ? t4 : new _(t4.prev, new N(e6, t4.vars), false);
      }
      return null;
    }
    function O(e6) {
      return "public" == e6 || "private" == e6 || "protected" == e6 || "abstract" == e6 || "readonly" == e6;
    }
    function _(e6, t4, r3) {
      this.prev = e6, this.vars = t4, this.block = r3;
    }
    function N(e6, t4) {
      this.name = e6, this.next = t4;
    }
    var P = new N("this", new N("arguments", null));
    function E() {
      S.state.context = new _(S.state.context, S.state.localVars, false), S.state.localVars = P;
    }
    function D2() {
      S.state.context = new _(S.state.context, S.state.localVars, true), S.state.localVars = null;
    }
    function W() {
      S.state.localVars = S.state.context.vars, S.state.context = S.state.context.prev;
    }
    function F(e6, t4) {
      var r3 = function() {
        var r4 = S.state, n4 = r4.indented;
        if ("stat" == r4.lexical.type) n4 = r4.lexical.indented;
        else for (var i5 = r4.lexical; i5 && ")" == i5.type && i5.align; i5 = i5.prev) n4 = i5.indented;
        r4.lexical = new k(n4, S.stream.column(), e6, null, r4.lexical, t4);
      };
      return r3.lex = true, r3;
    }
    function I() {
      var e6 = S.state;
      e6.lexical.prev && (")" == e6.lexical.type && (e6.indented = e6.lexical.indented), e6.lexical = e6.lexical.prev);
    }
    function H(e6) {
      return function t4(r3) {
        return r3 == e6 ? L() : ";" == e6 || "}" == r3 || ")" == r3 || "]" == r3 ? T() : L(t4);
      };
    }
    function B(e6, t4) {
      return "var" == e6 ? L(F("vardef", t4), Se, H(";"), I) : "keyword a" == e6 ? L(F("form"), j, B, I) : "keyword b" == e6 ? L(F("form"), B, I) : "keyword d" == e6 ? S.stream.match(/^\s*$/, false) ? L() : L(F("stat"), V, H(";"), I) : "debugger" == e6 ? L(H(";")) : "{" == e6 ? L(F("}"), D2, se, I, W) : ";" == e6 ? L() : "if" == e6 ? ("else" == S.state.lexical.info && S.state.cc[S.state.cc.length - 1] == I && S.state.cc.pop()(), L(F("form"), j, B, I, Oe)) : "function" == e6 ? L(Ee) : "for" == e6 ? L(F("form"), D2, _e, B, W, I) : "class" == e6 || u && "interface" == t4 ? (S.marked = "keyword", L(F("form", "class" == e6 ? e6 : t4), He, I)) : "variable" == e6 ? u && "declare" == t4 ? (S.marked = "keyword", L(B)) : u && ("module" == t4 || "enum" == t4 || "type" == t4) && S.stream.match(/^\s*\w/, false) ? (S.marked = "keyword", "enum" == t4 ? L(Ye) : "type" == t4 ? L(We, H("operator"), he, H(";")) : L(F("form"), Te, H("{"), F("}"), se, I, I)) : u && "namespace" == t4 ? (S.marked = "keyword", L(F("form"), R, B, I)) : u && "abstract" == t4 ? (S.marked = "keyword", L(B)) : L(F("stat"), te) : "switch" == e6 ? L(F("form"), j, H("{"), F("}", "switch"), D2, se, I, I, W) : "case" == e6 ? L(R, H(":")) : "default" == e6 ? L(H(":")) : "catch" == e6 ? L(F("form"), E, $, B, I, W) : "export" == e6 ? L(F("stat"), Ze, I) : "import" == e6 ? L(F("stat"), Ue, I) : "async" == e6 ? L(B) : "@" == t4 ? L(R, B) : T(F("stat"), R, H(";"), I);
    }
    function $(e6) {
      if ("(" == e6) return L(Fe, H(")"));
    }
    function R(e6, t4) {
      return U(e6, t4, false);
    }
    function Z(e6, t4) {
      return U(e6, t4, true);
    }
    function j(e6) {
      return "(" != e6 ? T() : L(F(")"), V, H(")"), I);
    }
    function U(e6, t4, r3) {
      if (S.state.fatArrowAt == S.stream.start) {
        var n4 = r3 ? Q : Y;
        if ("(" == e6) return L(E, F(")"), ae(Fe, ")"), I, H("=>"), n4, W);
        if ("variable" == e6) return T(E, Te, H("=>"), n4, W);
      }
      var i5 = r3 ? G : K;
      return w.hasOwnProperty(e6) ? L(i5) : "function" == e6 ? L(Ee, i5) : "class" == e6 || u && "interface" == t4 ? (S.marked = "keyword", L(F("form"), Ie, I)) : "keyword c" == e6 || "async" == e6 ? L(r3 ? Z : R) : "(" == e6 ? L(F(")"), V, H(")"), I, i5) : "operator" == e6 || "spread" == e6 ? L(r3 ? Z : R) : "[" == e6 ? L(F("]"), Xe, I, i5) : "{" == e6 ? le(ne, "}", null, i5) : "quasi" == e6 ? T(q, i5) : "new" == e6 ? L(/* @__PURE__ */ (function(e7) {
        return function(t5) {
          return "." == t5 ? L(e7 ? ee : J) : "variable" == t5 && u ? L(ke, e7 ? G : K) : T(e7 ? Z : R);
        };
      })(r3)) : L();
    }
    function V(e6) {
      return e6.match(/[;\}\)\],]/) ? T() : T(R);
    }
    function K(e6, t4) {
      return "," == e6 ? L(V) : G(e6, t4, false);
    }
    function G(e6, t4, r3) {
      var n4 = 0 == r3 ? K : G, i5 = 0 == r3 ? R : Z;
      return "=>" == e6 ? L(E, r3 ? Q : Y, W) : "operator" == e6 ? /\+\+|--/.test(t4) || u && "!" == t4 ? L(n4) : u && "<" == t4 && S.stream.match(/^([^<>]|<[^<>]*>)*>\s*\(/, false) ? L(F(">"), ae(he, ">"), I, n4) : "?" == t4 ? L(R, H(":"), i5) : L(i5) : "quasi" == e6 ? T(q, n4) : ";" != e6 ? "(" == e6 ? le(Z, ")", "call", n4) : "." == e6 ? L(re, n4) : "[" == e6 ? L(F("]"), V, H("]"), I, n4) : u && "as" == t4 ? (S.marked = "keyword", L(he, n4)) : "regexp" == e6 ? (S.state.lastType = S.marked = "operator", S.stream.backUp(S.stream.pos - S.stream.start - 1), L(i5)) : void 0 : void 0;
    }
    function q(e6, t4) {
      return "quasi" != e6 ? T() : "${" != t4.slice(t4.length - 2) ? L(q) : L(V, X);
    }
    function X(e6) {
      if ("}" == e6) return S.marked = "string-2", S.state.tokenize = y, L(q);
    }
    function Y(e6) {
      return b(S.stream, S.state), T("{" == e6 ? B : R);
    }
    function Q(e6) {
      return b(S.stream, S.state), T("{" == e6 ? B : Z);
    }
    function J(e6, t4) {
      if ("target" == t4) return S.marked = "keyword", L(K);
    }
    function ee(e6, t4) {
      if ("target" == t4) return S.marked = "keyword", L(G);
    }
    function te(e6) {
      return ":" == e6 ? L(I, B) : T(K, H(";"), I);
    }
    function re(e6) {
      if ("variable" == e6) return S.marked = "property", L();
    }
    function ne(e6, t4) {
      return "async" == e6 ? (S.marked = "property", L(ne)) : "variable" == e6 || "keyword" == S.style ? (S.marked = "property", "get" == t4 || "set" == t4 ? L(ie) : (u && S.state.fatArrowAt == S.stream.start && (r3 = S.stream.match(/^\s*:\s*/, false)) && (S.state.fatArrowAt = S.stream.pos + r3[0].length), L(oe))) : "number" == e6 || "string" == e6 ? (S.marked = l3 ? "property" : S.style + " property", L(oe)) : "jsonld-keyword" == e6 ? L(oe) : u && O(t4) ? (S.marked = "keyword", L(ne)) : "[" == e6 ? L(R, ce, H("]"), oe) : "spread" == e6 ? L(Z, oe) : "*" == t4 ? (S.marked = "keyword", L(ne)) : ":" == e6 ? T(oe) : void 0;
      var r3;
    }
    function ie(e6) {
      return "variable" != e6 ? T(oe) : (S.marked = "property", L(Ee));
    }
    function oe(e6) {
      return ":" == e6 ? L(Z) : "(" == e6 ? T(Ee) : void 0;
    }
    function ae(e6, t4, r3) {
      function n4(i5, o4) {
        if (r3 ? r3.indexOf(i5) > -1 : "," == i5) {
          var a2 = S.state.lexical;
          return "call" == a2.info && (a2.pos = (a2.pos || 0) + 1), L((function(r4, n5) {
            return r4 == t4 || n5 == t4 ? T() : T(e6);
          }), n4);
        }
        return i5 == t4 || o4 == t4 ? L() : r3 && r3.indexOf(";") > -1 ? T(e6) : L(H(t4));
      }
      return function(r4, i5) {
        return r4 == t4 || i5 == t4 ? L() : T(e6, n4);
      };
    }
    function le(e6, t4, r3) {
      for (var n4 = 3; n4 < arguments.length; n4++) S.cc.push(arguments[n4]);
      return L(F(t4, r3), ae(e6, t4), I);
    }
    function se(e6) {
      return "}" == e6 ? L() : T(B, se);
    }
    function ce(e6, t4) {
      if (u) {
        if (":" == e6) return L(he);
        if ("?" == t4) return L(ce);
      }
    }
    function ue(e6, t4) {
      if (u && (":" == e6 || "in" == t4)) return L(he);
    }
    function de(e6) {
      if (u && ":" == e6) return S.stream.match(/^\s*\w+\s+is\b/, false) ? L(R, fe, he) : L(he);
    }
    function fe(e6, t4) {
      if ("is" == t4) return S.marked = "keyword", L();
    }
    function he(e6, t4) {
      return "keyof" == t4 || "typeof" == t4 || "infer" == t4 || "readonly" == t4 ? (S.marked = "keyword", L("typeof" == t4 ? Z : he)) : "variable" == e6 || "void" == t4 ? (S.marked = "type", L(we)) : "|" == t4 || "&" == t4 ? L(he) : "string" == e6 || "number" == e6 || "atom" == e6 ? L(we) : "[" == e6 ? L(F("]"), ae(he, "]", ","), I, we) : "{" == e6 ? L(F("}"), me, I, we) : "(" == e6 ? L(ae(be, ")"), pe, we) : "<" == e6 ? L(ae(he, ">"), he) : "quasi" == e6 ? T(ve, we) : void 0;
    }
    function pe(e6) {
      if ("=>" == e6) return L(he);
    }
    function me(e6) {
      return e6.match(/[\}\)\]]/) ? L() : "," == e6 || ";" == e6 ? L(me) : T(ge, me);
    }
    function ge(e6, t4) {
      return "variable" == e6 || "keyword" == S.style ? (S.marked = "property", L(ge)) : "?" == t4 || "number" == e6 || "string" == e6 ? L(ge) : ":" == e6 ? L(he) : "[" == e6 ? L(H("variable"), ue, H("]"), ge) : "(" == e6 ? T(De, ge) : e6.match(/[;\}\)\],]/) ? void 0 : L();
    }
    function ve(e6, t4) {
      return "quasi" != e6 ? T() : "${" != t4.slice(t4.length - 2) ? L(ve) : L(he, ye);
    }
    function ye(e6) {
      if ("}" == e6) return S.marked = "string-2", S.state.tokenize = y, L(ve);
    }
    function be(e6, t4) {
      return "variable" == e6 && S.stream.match(/^\s*[?:]/, false) || "?" == t4 ? L(be) : ":" == e6 ? L(he) : "spread" == e6 ? L(be) : T(he);
    }
    function we(e6, t4) {
      return "<" == t4 ? L(F(">"), ae(he, ">"), I, we) : "|" == t4 || "." == e6 || "&" == t4 ? L(he) : "[" == e6 ? L(he, H("]"), we) : "extends" == t4 || "implements" == t4 ? (S.marked = "keyword", L(he)) : "?" == t4 ? L(he, H(":"), he) : void 0;
    }
    function ke(e6, t4) {
      if ("<" == t4) return L(F(">"), ae(he, ">"), I, we);
    }
    function xe() {
      return T(he, Ce);
    }
    function Ce(e6, t4) {
      if ("=" == t4) return L(he);
    }
    function Se(e6, t4) {
      return "enum" == t4 ? (S.marked = "keyword", L(Ye)) : T(Te, ce, Me, ze);
    }
    function Te(e6, t4) {
      return u && O(t4) ? (S.marked = "keyword", L(Te)) : "variable" == e6 ? (M(t4), L()) : "spread" == e6 ? L(Te) : "[" == e6 ? le(Ae, "]") : "{" == e6 ? le(Le, "}") : void 0;
    }
    function Le(e6, t4) {
      return "variable" != e6 || S.stream.match(/^\s*:/, false) ? ("variable" == e6 && (S.marked = "property"), "spread" == e6 ? L(Te) : "}" == e6 ? T() : "[" == e6 ? L(R, H("]"), H(":"), Le) : L(H(":"), Te, Me)) : (M(t4), L(Me));
    }
    function Ae() {
      return T(Te, Me);
    }
    function Me(e6, t4) {
      if ("=" == t4) return L(Z);
    }
    function ze(e6) {
      if ("," == e6) return L(Se);
    }
    function Oe(e6, t4) {
      if ("keyword b" == e6 && "else" == t4) return L(F("form", "else"), B, I);
    }
    function _e(e6, t4) {
      return "await" == t4 ? L(_e) : "(" == e6 ? L(F(")"), Ne, I) : void 0;
    }
    function Ne(e6) {
      return "var" == e6 ? L(Se, Pe) : "variable" == e6 ? L(Pe) : T(Pe);
    }
    function Pe(e6, t4) {
      return ")" == e6 ? L() : ";" == e6 ? L(Pe) : "in" == t4 || "of" == t4 ? (S.marked = "keyword", L(R, Pe)) : T(R, Pe);
    }
    function Ee(e6, t4) {
      return "*" == t4 ? (S.marked = "keyword", L(Ee)) : "variable" == e6 ? (M(t4), L(Ee)) : "(" == e6 ? L(E, F(")"), ae(Fe, ")"), I, de, B, W) : u && "<" == t4 ? L(F(">"), ae(xe, ">"), I, Ee) : void 0;
    }
    function De(e6, t4) {
      return "*" == t4 ? (S.marked = "keyword", L(De)) : "variable" == e6 ? (M(t4), L(De)) : "(" == e6 ? L(E, F(")"), ae(Fe, ")"), I, de, W) : u && "<" == t4 ? L(F(">"), ae(xe, ">"), I, De) : void 0;
    }
    function We(e6, t4) {
      return "keyword" == e6 || "variable" == e6 ? (S.marked = "type", L(We)) : "<" == t4 ? L(F(">"), ae(xe, ">"), I) : void 0;
    }
    function Fe(e6, t4) {
      return "@" == t4 && L(R, Fe), "spread" == e6 ? L(Fe) : u && O(t4) ? (S.marked = "keyword", L(Fe)) : u && "this" == e6 ? L(ce, Me) : T(Te, ce, Me);
    }
    function Ie(e6, t4) {
      return "variable" == e6 ? He(e6, t4) : Be(e6, t4);
    }
    function He(e6, t4) {
      if ("variable" == e6) return M(t4), L(Be);
    }
    function Be(e6, t4) {
      return "<" == t4 ? L(F(">"), ae(xe, ">"), I, Be) : "extends" == t4 || "implements" == t4 || u && "," == e6 ? ("implements" == t4 && (S.marked = "keyword"), L(u ? he : R, Be)) : "{" == e6 ? L(F("}"), $e, I) : void 0;
    }
    function $e(e6, t4) {
      return "async" == e6 || "variable" == e6 && ("static" == t4 || "get" == t4 || "set" == t4 || u && O(t4)) && S.stream.match(/^\s+[\w$\xa1-\uffff]/, false) ? (S.marked = "keyword", L($e)) : "variable" == e6 || "keyword" == S.style ? (S.marked = "property", L(Re, $e)) : "number" == e6 || "string" == e6 ? L(Re, $e) : "[" == e6 ? L(R, ce, H("]"), Re, $e) : "*" == t4 ? (S.marked = "keyword", L($e)) : u && "(" == e6 ? T(De, $e) : ";" == e6 || "," == e6 ? L($e) : "}" == e6 ? L() : "@" == t4 ? L(R, $e) : void 0;
    }
    function Re(e6, t4) {
      if ("!" == t4) return L(Re);
      if ("?" == t4) return L(Re);
      if (":" == e6) return L(he, Me);
      if ("=" == t4) return L(Z);
      var r3 = S.state.lexical.prev;
      return T(r3 && "interface" == r3.info ? De : Ee);
    }
    function Ze(e6, t4) {
      return "*" == t4 ? (S.marked = "keyword", L(qe, H(";"))) : "default" == t4 ? (S.marked = "keyword", L(R, H(";"))) : "{" == e6 ? L(ae(je, "}"), qe, H(";")) : T(B);
    }
    function je(e6, t4) {
      return "as" == t4 ? (S.marked = "keyword", L(H("variable"))) : "variable" == e6 ? T(Z, je) : void 0;
    }
    function Ue(e6) {
      return "string" == e6 ? L() : "(" == e6 ? T(R) : "." == e6 ? T(K) : T(Ve, Ke, qe);
    }
    function Ve(e6, t4) {
      return "{" == e6 ? le(Ve, "}") : ("variable" == e6 && M(t4), "*" == t4 && (S.marked = "keyword"), L(Ge));
    }
    function Ke(e6) {
      if ("," == e6) return L(Ve, Ke);
    }
    function Ge(e6, t4) {
      if ("as" == t4) return S.marked = "keyword", L(Ve);
    }
    function qe(e6, t4) {
      if ("from" == t4) return S.marked = "keyword", L(R);
    }
    function Xe(e6) {
      return "]" == e6 ? L() : T(ae(Z, "]"));
    }
    function Ye() {
      return T(F("form"), Te, H("{"), F("}"), ae(Qe, "}"), I, I);
    }
    function Qe() {
      return T(Te, Me);
    }
    function Je(e6, t4, r3) {
      return t4.tokenize == g && /^(?:operator|sof|keyword [bcd]|case|new|export|default|spread|[\[{}\(,;:]|=>)$/.test(t4.lastType) || "quasi" == t4.lastType && /\{\s*$/.test(e6.string.slice(0, e6.pos - (r3 || 0)));
    }
    return E.lex = D2.lex = true, W.lex = true, I.lex = true, { startState: function(e6) {
      var t4 = { tokenize: g, lastType: "sof", cc: [], lexical: new k((e6 || 0) - o3, 0, "block", false), localVars: r2.localVars, context: r2.localVars && new _(null, null, false), indented: e6 || 0 };
      return r2.globalVars && "object" == typeof r2.globalVars && (t4.globalVars = r2.globalVars), t4;
    }, token: function(e6, t4) {
      if (e6.sol() && (t4.lexical.hasOwnProperty("align") || (t4.lexical.align = false), t4.indented = e6.indentation(), b(e6, t4)), t4.tokenize != v && e6.eatSpace()) return null;
      var r3 = t4.tokenize(e6, t4);
      return "comment" == n3 ? r3 : (t4.lastType = "operator" != n3 || "++" != i4 && "--" != i4 ? n3 : "incdec", C(t4, r3, n3, i4, e6));
    }, indent: function(t4, n4) {
      if (t4.tokenize == v || t4.tokenize == y) return e5.Pass;
      if (t4.tokenize != g) return 0;
      var i5, l4 = n4 && n4.charAt(0), s3 = t4.lexical;
      if (!/^\s*else\b/.test(n4)) for (var c2 = t4.cc.length - 1; c2 >= 0; --c2) {
        var u2 = t4.cc[c2];
        if (u2 == I) s3 = s3.prev;
        else if (u2 != Oe && u2 != W) break;
      }
      for (; ("stat" == s3.type || "form" == s3.type) && ("}" == l4 || (i5 = t4.cc[t4.cc.length - 1]) && (i5 == K || i5 == G) && !/^[,\.=+\-*:?[\(]/.test(n4)); ) s3 = s3.prev;
      a && ")" == s3.type && "stat" == s3.prev.type && (s3 = s3.prev);
      var d2 = s3.type, f2 = l4 == d2;
      return "vardef" == d2 ? s3.indented + ("operator" == t4.lastType || "," == t4.lastType ? s3.info.length + 1 : 0) : "form" == d2 && "{" == l4 ? s3.indented : "form" == d2 ? s3.indented + o3 : "stat" == d2 ? s3.indented + ((function(e6, t5) {
        return "operator" == e6.lastType || "," == e6.lastType || h.test(t5.charAt(0)) || /[,.]/.test(t5.charAt(0));
      })(t4, n4) ? a || o3 : 0) : "switch" != s3.info || f2 || 0 == r2.doubleIndentSwitch ? s3.align ? s3.column + (f2 ? 0 : 1) : s3.indented + (f2 ? 0 : o3) : s3.indented + (/^(?:case|default)\b/.test(n4) ? o3 : 2 * o3);
    }, electricInput: /^\s*(?:case .*?:|default:|\{|\})$/, blockCommentStart: s2 ? null : "/*", blockCommentEnd: s2 ? null : "*/", blockCommentContinue: s2 ? null : " * ", lineComment: s2 ? null : "//", fold: "brace", closeBrackets: "()[]{}''\"\"``", helperType: s2 ? "json" : "javascript", jsonldMode: l3, jsonMode: s2, expressionAllowed: Je, skipExpression: function(t4) {
      C(t4, "atom", "atom", "true", new e5.StringStream("", 2, null));
    } };
  })), e5.registerHelper("wordChars", "javascript", /[\w$]/), e5.defineMIME("text/javascript", "javascript"), e5.defineMIME("text/ecmascript", "javascript"), e5.defineMIME("application/javascript", "javascript"), e5.defineMIME("application/x-javascript", "javascript"), e5.defineMIME("application/ecmascript", "javascript"), e5.defineMIME("application/json", { name: "javascript", json: true }), e5.defineMIME("application/x-json", { name: "javascript", json: true }), e5.defineMIME("application/manifest+json", { name: "javascript", json: true }), e5.defineMIME("application/ld+json", { name: "javascript", jsonld: true }), e5.defineMIME("text/typescript", { name: "javascript", typescript: true }), e5.defineMIME("application/typescript", { name: "javascript", typescript: true });
})(CodeMirror), (function(e5) {
  var t3 = { autoSelfClosers: { area: true, base: true, br: true, col: true, command: true, embed: true, frame: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true, menuitem: true }, implicitlyClosed: { dd: true, li: true, optgroup: true, option: true, p: true, rp: true, rt: true, tbody: true, td: true, tfoot: true, th: true, tr: true }, contextGrabbers: { dd: { dd: true, dt: true }, dt: { dd: true, dt: true }, li: { li: true }, option: { option: true, optgroup: true }, optgroup: { optgroup: true }, p: { address: true, article: true, aside: true, blockquote: true, dir: true, div: true, dl: true, fieldset: true, footer: true, form: true, h1: true, h2: true, h3: true, h4: true, h5: true, h6: true, header: true, hgroup: true, hr: true, menu: true, nav: true, ol: true, p: true, pre: true, section: true, table: true, ul: true }, rp: { rp: true, rt: true }, rt: { rp: true, rt: true }, tbody: { tbody: true, tfoot: true }, td: { td: true, th: true }, tfoot: { tbody: true }, th: { td: true, th: true }, thead: { tbody: true, tfoot: true }, tr: { tr: true } }, doNotIndent: { pre: true }, allowUnquoted: true, allowMissing: true, caseFold: true }, r2 = { autoSelfClosers: {}, implicitlyClosed: {}, contextGrabbers: {}, doNotIndent: {}, allowUnquoted: false, allowMissing: false, allowMissingTagName: false, caseFold: false };
  e5.defineMode("xml", (function(n3, i4) {
    var o3, a, l3 = n3.indentUnit, s2 = {}, c = i4.htmlMode ? t3 : r2;
    for (var u in c) s2[u] = c[u];
    for (var u in i4) s2[u] = i4[u];
    function d(e6, t4) {
      function r3(r4) {
        return t4.tokenize = r4, r4(e6, t4);
      }
      var n4 = e6.next();
      return "<" == n4 ? e6.eat("!") ? e6.eat("[") ? e6.match("CDATA[") ? r3(h("atom", "]]>")) : null : e6.match("--") ? r3(h("comment", "-->")) : e6.match("DOCTYPE", true, true) ? (e6.eatWhile(/[\w\._\-]/), r3(p(1))) : null : e6.eat("?") ? (e6.eatWhile(/[\w\._\-]/), t4.tokenize = h("meta", "?>"), "meta") : (o3 = e6.eat("/") ? "closeTag" : "openTag", t4.tokenize = f, "tag bracket") : "&" == n4 ? (e6.eat("#") ? e6.eat("x") ? e6.eatWhile(/[a-fA-F\d]/) && e6.eat(";") : e6.eatWhile(/[\d]/) && e6.eat(";") : e6.eatWhile(/[\w\.\-:]/) && e6.eat(";")) ? "atom" : "error" : (e6.eatWhile(/[^&<]/), null);
    }
    function f(e6, t4) {
      var r3, n4, i5 = e6.next();
      if (">" == i5 || "/" == i5 && e6.eat(">")) return t4.tokenize = d, o3 = ">" == i5 ? "endTag" : "selfcloseTag", "tag bracket";
      if ("=" == i5) return o3 = "equals", null;
      if ("<" == i5) {
        t4.tokenize = d, t4.state = b, t4.tagName = t4.tagStart = null;
        var a2 = t4.tokenize(e6, t4);
        return a2 ? a2 + " tag error" : "tag error";
      }
      return /[\'\"]/.test(i5) ? (t4.tokenize = (r3 = i5, n4 = function(e7, t5) {
        for (; !e7.eol(); ) if (e7.next() == r3) {
          t5.tokenize = f;
          break;
        }
        return "string";
      }, n4.isInAttribute = true, n4), t4.stringStartCol = e6.column(), t4.tokenize(e6, t4)) : (e6.match(/^[^\s\u00a0=<>\"\']*[^\s\u00a0=<>\"\'\/]/), "word");
    }
    function h(e6, t4) {
      return function(r3, n4) {
        for (; !r3.eol(); ) {
          if (r3.match(t4)) {
            n4.tokenize = d;
            break;
          }
          r3.next();
        }
        return e6;
      };
    }
    function p(e6) {
      return function(t4, r3) {
        for (var n4; null != (n4 = t4.next()); ) {
          if ("<" == n4) return r3.tokenize = p(e6 + 1), r3.tokenize(t4, r3);
          if (">" == n4) {
            if (1 == e6) {
              r3.tokenize = d;
              break;
            }
            return r3.tokenize = p(e6 - 1), r3.tokenize(t4, r3);
          }
        }
        return "meta";
      };
    }
    function m(e6) {
      return e6 && e6.toLowerCase();
    }
    function g(e6, t4, r3) {
      this.prev = e6.context, this.tagName = t4 || "", this.indent = e6.indented, this.startOfLine = r3, (s2.doNotIndent.hasOwnProperty(t4) || e6.context && e6.context.noIndent) && (this.noIndent = true);
    }
    function v(e6) {
      e6.context && (e6.context = e6.context.prev);
    }
    function y(e6, t4) {
      for (var r3; ; ) {
        if (!e6.context) return;
        if (r3 = e6.context.tagName, !s2.contextGrabbers.hasOwnProperty(m(r3)) || !s2.contextGrabbers[m(r3)].hasOwnProperty(m(t4))) return;
        v(e6);
      }
    }
    function b(e6, t4, r3) {
      return "openTag" == e6 ? (r3.tagStart = t4.column(), w) : "closeTag" == e6 ? k : b;
    }
    function w(e6, t4, r3) {
      return "word" == e6 ? (r3.tagName = t4.current(), a = "tag", S) : s2.allowMissingTagName && "endTag" == e6 ? (a = "tag bracket", S(e6, t4, r3)) : (a = "error", w);
    }
    function k(e6, t4, r3) {
      if ("word" == e6) {
        var n4 = t4.current();
        return r3.context && r3.context.tagName != n4 && s2.implicitlyClosed.hasOwnProperty(m(r3.context.tagName)) && v(r3), r3.context && r3.context.tagName == n4 || false === s2.matchClosing ? (a = "tag", x2) : (a = "tag error", C);
      }
      return s2.allowMissingTagName && "endTag" == e6 ? (a = "tag bracket", x2(e6, t4, r3)) : (a = "error", C);
    }
    function x2(e6, t4, r3) {
      return "endTag" != e6 ? (a = "error", x2) : (v(r3), b);
    }
    function C(e6, t4, r3) {
      return a = "error", x2(e6, 0, r3);
    }
    function S(e6, t4, r3) {
      if ("word" == e6) return a = "attribute", T;
      if ("endTag" == e6 || "selfcloseTag" == e6) {
        var n4 = r3.tagName, i5 = r3.tagStart;
        return r3.tagName = r3.tagStart = null, "selfcloseTag" == e6 || s2.autoSelfClosers.hasOwnProperty(m(n4)) ? y(r3, n4) : (y(r3, n4), r3.context = new g(r3, n4, i5 == r3.indented)), b;
      }
      return a = "error", S;
    }
    function T(e6, t4, r3) {
      return "equals" == e6 ? L : (s2.allowMissing || (a = "error"), S(e6, 0, r3));
    }
    function L(e6, t4, r3) {
      return "string" == e6 ? A2 : "word" == e6 && s2.allowUnquoted ? (a = "string", S) : (a = "error", S(e6, 0, r3));
    }
    function A2(e6, t4, r3) {
      return "string" == e6 ? A2 : S(e6, 0, r3);
    }
    return d.isInText = true, { startState: function(e6) {
      var t4 = { tokenize: d, state: b, indented: e6 || 0, tagName: null, tagStart: null, context: null };
      return null != e6 && (t4.baseIndent = e6), t4;
    }, token: function(e6, t4) {
      if (!t4.tagName && e6.sol() && (t4.indented = e6.indentation()), e6.eatSpace()) return null;
      o3 = null;
      var r3 = t4.tokenize(e6, t4);
      return (r3 || o3) && "comment" != r3 && (a = null, t4.state = t4.state(o3 || r3, e6, t4), a && (r3 = "error" == a ? r3 + " error" : a)), r3;
    }, indent: function(t4, r3, n4) {
      var i5 = t4.context;
      if (t4.tokenize.isInAttribute) return t4.tagStart == t4.indented ? t4.stringStartCol + 1 : t4.indented + l3;
      if (i5 && i5.noIndent) return e5.Pass;
      if (t4.tokenize != f && t4.tokenize != d) return n4 ? n4.match(/^(\s*)/)[0].length : 0;
      if (t4.tagName) return false !== s2.multilineTagIndentPastTag ? t4.tagStart + t4.tagName.length + 2 : t4.tagStart + l3 * (s2.multilineTagIndentFactor || 1);
      if (s2.alignCDATA && /<!\[CDATA\[/.test(r3)) return 0;
      var o4 = r3 && /^<(\/)?([\w_:\.-]*)/.exec(r3);
      if (o4 && o4[1]) for (; i5; ) {
        if (i5.tagName == o4[2]) {
          i5 = i5.prev;
          break;
        }
        if (!s2.implicitlyClosed.hasOwnProperty(m(i5.tagName))) break;
        i5 = i5.prev;
      }
      else if (o4) for (; i5; ) {
        var a2 = s2.contextGrabbers[m(i5.tagName)];
        if (!a2 || !a2.hasOwnProperty(m(o4[2]))) break;
        i5 = i5.prev;
      }
      for (; i5 && i5.prev && !i5.startOfLine; ) i5 = i5.prev;
      return i5 ? i5.indent + l3 : t4.baseIndent || 0;
    }, electricInput: /<\/[\s\w:]+>$/, blockCommentStart: "<!--", blockCommentEnd: "-->", configuration: s2.htmlMode ? "html" : "xml", helperType: s2.htmlMode ? "html" : "xml", skipAttribute: function(e6) {
      e6.state == L && (e6.state = S);
    }, xmlCurrentTag: function(e6) {
      return e6.tagName ? { name: e6.tagName, close: "closeTag" == e6.type } : null;
    }, xmlCurrentContext: function(e6) {
      for (var t4 = [], r3 = e6.context; r3; r3 = r3.prev) t4.push(r3.tagName);
      return t4.reverse();
    } };
  })), e5.defineMIME("text/xml", "xml"), e5.defineMIME("application/xml", "xml"), e5.mimeModes.hasOwnProperty("text/html") || e5.defineMIME("text/html", { name: "xml", htmlMode: true });
})(CodeMirror), (function(e5) {
  function t3(e6, t4, r3, n3) {
    this.state = e6, this.mode = t4, this.depth = r3, this.prev = n3;
  }
  function r2(n3) {
    return new t3(e5.copyState(n3.mode, n3.state), n3.mode, n3.depth, n3.prev && r2(n3.prev));
  }
  e5.defineMode("jsx", (function(n3, i4) {
    var o3 = e5.getMode(n3, { name: "xml", allowMissing: true, multilineTagIndentPastTag: false, allowMissingTagName: true }), a = e5.getMode(n3, i4 && i4.base || "javascript");
    function l3(e6) {
      var t4 = e6.tagName;
      e6.tagName = null;
      var r3 = o3.indent(e6, "", "");
      return e6.tagName = t4, r3;
    }
    function s2(r3, i5) {
      return i5.context.mode == o3 ? (function(r4, i6, c) {
        if (2 == c.depth) return r4.match(/^.*?\*\//) ? c.depth = 1 : r4.skipToEnd(), "comment";
        if ("{" == r4.peek()) {
          o3.skipAttribute(c.state);
          var u = l3(c.state), d = c.state.context;
          if (d && r4.match(/^[^>]*>\s*$/, false)) {
            for (; d.prev && !d.startOfLine; ) d = d.prev;
            d.startOfLine ? u -= n3.indentUnit : c.prev.state.lexical && (u = c.prev.state.lexical.indented);
          } else 1 == c.depth && (u += n3.indentUnit);
          return i6.context = new t3(e5.startState(a, u), a, 0, i6.context), null;
        }
        if (1 == c.depth) {
          if ("<" == r4.peek()) return o3.skipAttribute(c.state), i6.context = new t3(e5.startState(o3, l3(c.state)), o3, 0, i6.context), null;
          if (r4.match("//")) return r4.skipToEnd(), "comment";
          if (r4.match("/*")) return c.depth = 2, s2(r4, i6);
        }
        var f, h = o3.token(r4, c.state), p = r4.current();
        return /\btag\b/.test(h) ? />$/.test(p) ? c.state.context ? c.depth = 0 : i6.context = i6.context.prev : /^</.test(p) && (c.depth = 1) : !h && (f = p.indexOf("{")) > -1 && r4.backUp(p.length - f), h;
      })(r3, i5, i5.context) : (function(r4, n4, i6) {
        if ("<" == r4.peek() && a.expressionAllowed(r4, i6.state)) return n4.context = new t3(e5.startState(o3, a.indent(i6.state, "", "")), o3, 0, n4.context), a.skipExpression(i6.state), null;
        var l4 = a.token(r4, i6.state);
        if (!l4 && null != i6.depth) {
          var s3 = r4.current();
          "{" == s3 ? i6.depth++ : "}" == s3 && 0 == --i6.depth && (n4.context = n4.context.prev);
        }
        return l4;
      })(r3, i5, i5.context);
    }
    return { startState: function() {
      return { context: new t3(e5.startState(a), a) };
    }, copyState: function(e6) {
      return { context: r2(e6.context) };
    }, token: s2, indent: function(e6, t4, r3) {
      return e6.context.mode.indent(e6.context.state, t4, r3);
    }, innerMode: function(e6) {
      return e6.context;
    } };
  }), "xml", "javascript"), e5.defineMIME("text/jsx", "jsx"), e5.defineMIME("text/typescript-jsx", { name: "jsx", base: { name: "javascript", typescript: true } });
})(CodeMirror);

// ../node_modules/playground-elements/internal/codemirror.js
var CodeMirror2 = window.CodeMirror;

// ../node_modules/playground-elements/playground-styles.js
var styles = i2`/**
 * This file is derived from \`code-mirror/lib/codemirror.css\`, modified in the
 * following ways:
 *
 * - CSS custom properties added.
 * - Rules for unused features and addons removed.
 * - Unnecessary vendor prefixes removed.
 * - \`.cm-s-default\` class selectors removed.
 * - Empty rules removed.
 */

/* BASICS */

.CodeMirror {
  /* Set height, width, borders, and global font properties here */
  font-family: var(--playground-code-font-family, monospace);
  font-size: var(--playground-code-font-size, 14px);
  padding: var(--playground-code-padding, 0);
  height: 350px;
  color: var(--playground-code-default-color, #000);
  background: var(--playground-code-background, #fff);
  direction: ltr;
  /* CodeMirror uses z-indexes up to 6 to e.g. place scrollbars above the code
     area. However, this can create undesirable stacking effects with the rest
     of the page. Force a new stacking context. */
  isolation: isolate;
  line-height: var(--playground-code-line-height, 1.4em);
}

/* PADDING */

.CodeMirror-lines {
  padding: 4px 0; /* Vertical padding around content */
}
.CodeMirror pre.CodeMirror-line,
.CodeMirror pre.CodeMirror-line-like {
  padding: var(
    --playground-code-line-padding,
    0 4px
  ); /* Horizontal padding of content */
}

.CodeMirror-scrollbar-filler,
.CodeMirror-gutter-filler {
  background: var(
    --playground-code-background,
    #fff
  ); /* The little square between H and V scrollbars */
}

/* GUTTER */

.CodeMirror-gutters {
  border-right: var(--playground-code-gutter-border-right, none);
  background: var(
    --playground-code-gutter-background,
    var(--playground-code-background, #fff)
  );
  box-shadow: var(--playground-code-gutter-box-shadow, none);
  white-space: nowrap;
}
.CodeMirror-linenumber {
  padding: 0 3px 0 5px;
  min-width: 20px;
  text-align: right;
  color: var(--playground-code-linenumber-color, #767676);
  white-space: nowrap;
  margin-right: 1em;
}
.CodeMirror-code > div > .CodeMirror-line {
  /* Some extra room between the line number gutter and the line */
  padding-left: 0.7em;
}

/* CURSOR */

.CodeMirror-cursor {
  border-left: 2px solid
    var(
      --playground-code-cursor-color,
      var(--playground-code-default-color, #000)
    );
  border-right: none;
  width: 0;
}

@keyframes blink {
  0% {
  }
  50% {
    background: transparent;
  }
  100% {
  }
}

/* DEFAULT THEME */

.cm-header,
.cm-strong {
  font-weight: bold;
}
.cm-em {
  font-style: italic;
}
.cm-link {
  text-decoration: underline;
}
.cm-strikethrough {
  text-decoration: line-through;
}

.cm-keyword {
  color: var(--playground-code-keyword-color, #708);
}
.cm-atom {
  color: var(--playground-code-atom-color, #219);
}
.cm-number {
  color: var(--playground-code-number-color, #164);
}
.cm-def {
  color: var(--playground-code-def-color, #00f);
}
.cm-variable {
  color: var(--playground-code-variable-color, #000);
}
.cm-property {
  color: var(--playground-code-property-color, #000);
}
.cm-operator {
  color: var(--playground-code-operator-color, #000);
}
.cm-variable-2 {
  color: var(--playground-code-variable-2-color, #05a);
}
.cm-variable-3 {
  color: var(--playground-code-variable-3-color, #085);
}
.cm-type {
  color: var(--playground-code-type-color, #085);
}
.cm-comment {
  color: var(--playground-code-comment-color, #a50);
}
.cm-string {
  color: var(--playground-code-string-color, #a11);
}
.cm-string-2 {
  color: var(--playground-code-string-2-color, #f50);
}
.cm-meta {
  color: var(--playground-code-meta-color, #555);
}
.cm-qualifier {
  color: var(--playground-code-qualifier-color, #555);
}
.cm-builtin {
  color: var(--playground-code-builtin-color, #30a);
}
.cm-tag {
  color: var(--playground-code-tag-color, #170);
}
.cm-attribute {
  color: var(--playground-code-attribute-color, #00c);
}
.cm-callee {
  color: var(--playground-code-callee-color, #000);
}

.CodeMirror-composing {
  border-bottom: 2px solid;
}

/* STOP */

/* The rest of this file contains styles related to the mechanics of
   the editor. You probably shouldn't touch them. */

.CodeMirror {
  position: relative;
  overflow: hidden;
}

.CodeMirror-scroll {
  overflow: scroll !important; /* Things will break if this is overridden */
  /* 50px is the magic margin used to hide the element's real scrollbars */
  /* See overflow: hidden in .CodeMirror */
  margin-bottom: -50px;
  margin-right: -50px;
  padding-bottom: 50px;
  height: 100%;
  outline: none; /* Prevent dragging from highlighting the element */
  position: relative;
}
.CodeMirror-sizer {
  position: relative;
  border-right: 50px solid transparent;
}

/* The fake, visible scrollbars. Used to force redraw during scrolling
   before actual scrolling happens, thus preventing shaking and
   flickering artifacts. */
.CodeMirror-vscrollbar,
.CodeMirror-hscrollbar,
.CodeMirror-scrollbar-filler,
.CodeMirror-gutter-filler {
  position: absolute;
  z-index: 6;
  display: none;
  outline: none;
}
.CodeMirror-vscrollbar {
  right: 0;
  top: 0;
  overflow-x: hidden;
  overflow-y: scroll;
}
.CodeMirror-hscrollbar {
  bottom: 0;
  left: 0;
  overflow-y: hidden;
  overflow-x: scroll;
}
.CodeMirror-scrollbar-filler {
  right: 0;
  bottom: 0;
}
.CodeMirror-gutter-filler {
  left: 0;
  bottom: 0;
}

.CodeMirror-gutters {
  position: absolute;
  left: 0;
  top: 0;
  min-height: 100%;
  z-index: 3;
}
.CodeMirror-gutter {
  white-space: normal;
  height: 100%;
  display: inline-block;
  vertical-align: top;
  margin-bottom: -50px;
}
.CodeMirror-gutter-wrapper {
  position: absolute;
  z-index: 4;
  background: none !important;
  border: none !important;
}
.CodeMirror-gutter-background {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 4;
}
.CodeMirror-gutter-elt {
  position: absolute;
  cursor: default;
  z-index: 4;
}
.CodeMirror-gutter-wrapper ::selection {
  background: transparent;
}

.CodeMirror-lines {
  cursor: text;
  min-height: 1px; /* prevents collapsing before first draw */
}
.CodeMirror pre.CodeMirror-line,
.CodeMirror pre.CodeMirror-line-like {
  /* Reset some styles that the rest of the page might have set */
  border-radius: 0;
  border-width: 0;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  margin: 0;
  white-space: pre;
  word-wrap: normal;
  line-height: inherit;
  color: inherit;
  z-index: 2;
  position: relative;
  overflow: visible;
  -webkit-tap-highlight-color: transparent;
  font-variant-ligatures: contextual;
}
.CodeMirror-wrap pre.CodeMirror-line,
.CodeMirror-wrap pre.CodeMirror-line-like {
  word-wrap: break-word;
  white-space: pre-wrap;
  word-break: normal;
}

.CodeMirror-linebackground {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 0;
}

.CodeMirror-linewidget {
  position: relative;
  z-index: 2;
  padding: 0.1px; /* Force widget margins to stay inside of the container */
}

.CodeMirror-rtl pre {
  direction: rtl;
}

.CodeMirror-code {
  outline: none;
}

/* Force content-box sizing for the elements where we expect it */
.CodeMirror-scroll,
.CodeMirror-sizer,
.CodeMirror-gutter,
.CodeMirror-gutters,
.CodeMirror-linenumber {
  box-sizing: content-box;
}

.CodeMirror-measure {
  position: absolute;
  width: 100%;
  height: 0;
  overflow: hidden;
  visibility: hidden;
}

.CodeMirror-cursor {
  position: absolute;
  pointer-events: none;
}
.CodeMirror-measure pre {
  position: static;
}

div.CodeMirror-cursors {
  visibility: hidden;
  position: relative;
  z-index: 3;
}
div.CodeMirror-dragcursors {
  visibility: visible;
}

.CodeMirror-focused div.CodeMirror-cursors {
  visibility: visible;
}

.CodeMirror-selected {
  background: var(--playground-code-selection-background, #d7d4f0);
}
.CodeMirror-focused .CodeMirror-selected {
  background: var(--playground-code-selection-background, #d7d4f0);
}
.CodeMirror-crosshair {
  cursor: crosshair;
}
.CodeMirror-line::selection,
.CodeMirror-line > span::selection,
.CodeMirror-line > span > span::selection {
  background: var(--playground-code-selection-background, #d7d4f0);
}

/* Completions */

.CodeMirror-hints {
  position: absolute;
  z-index: 10;
  overflow: hidden;
  list-style: none;

  margin: 0;
  padding: 0;

  box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 5px -3px,
    rgba(0, 0, 0, 0.14) 0px 8px 10px 1px, rgba(0, 0, 0, 0.12) 0px 3px 14px 2px;
  border: 1px solid var(--playground-code-selection-background, silver);

  background: var(--playground-code-background, white);
  font-size: var(--playground-code-font-size, 14px);
  font-family: var(--playground-code-font-family, monospace);

  max-height: 20em;
  width: 600px;
  max-width: min(600px, 80vw);
  overflow-y: auto;
}

.CodeMirror-hint {
  margin: 0;
  padding: 0 6px;
  white-space: pre;
  color: var(--playground-code-cursor-color, black);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
}

@media (pointer: coarse) {
  .CodeMirror-hint {
    padding: 1em 6px;
  }
}

.CodeMirror-hint-active {
  background: var(--playground-code-background, rgba(0, 0, 0, 0.2));
  filter: brightness(1.2);
}

.CodeMirror-hint mark {
  background: inherit;
  color: var(--playground-code-qualifier-color, #555);
}

.CodeMirror-hint .hint-object-name {
  padding-right: 2em;
  white-space: nowrap;
}

.CodeMirror-hint .hint-object-details {
  flex-basis: 80%;
  font-size: calc(var(--playground-code-font-size, 14px) * 0.9);
  color: var(--playground-code-string-2-color, white);
  opacity: 0.8;
  text-align: right;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Used to force a border model for a node */
.cm-force-border {
  padding-right: 0.1px;
}

@media print {
  /* Hide the cursor when printing */
  .CodeMirror div.CodeMirror-cursors {
    visibility: hidden;
  }
}

/* See issue #2901 */
.cm-tab-wrap-hack:after {
  content: '';
}

/* Help users use markselection to safely style text background */
span.CodeMirror-selectedtext {
  background: none;
}
`;

// ../node_modules/playground-elements/internal/overlay.js
var PlaygroundInternalOverlay = class PlaygroundInternalOverlay2 extends s {
  render() {
    return x`<div id="message"><slot></slot></div>`;
  }
};
PlaygroundInternalOverlay.styles = i2`
    :host {
      position: absolute;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      left: 0;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      z-index: 9;
      background: rgba(0, 0, 0, 0.32);
      overflow-y: auto;
    }

    #message {
      background: #fff;
      color: #000;
      padding: 10px 20px;
      border-radius: 5px;
      box-shadow: rgba(0, 0, 0, 0.3) 0 2px 10px;
    }
  `;
PlaygroundInternalOverlay = __decorate([
  e("playground-internal-overlay")
], PlaygroundInternalOverlay);

// ../node_modules/playground-elements/playground-code-editor.js
var unreachable = (n3) => n3;
var PlaygroundCodeEditor = class PlaygroundCodeEditor2 extends s {
  constructor() {
    super(...arguments);
    this._docCache = /* @__PURE__ */ new WeakMap();
    this.lineNumbers = false;
    this.lineWrapping = false;
    this.readonly = false;
    this.noCompletions = false;
    this._completionsOpen = false;
    this._currentCompletionSelectionLabel = "";
    this._currentCompletionRequestId = 0;
    this.pragmas = "on";
    this._showKeyboardHelp = false;
    this._resizing = false;
    this._valueChangingFromOutside = false;
    this._diagnosticMarkers = [];
    this._diagnosticsMouseoverListenerActive = false;
    this._onMouseOverWithDiagnostics = (event) => {
      var _a, _b, _c;
      if (!((_a = this.diagnostics) === null || _a === void 0 ? void 0 : _a.length)) {
        return;
      }
      const idxMatch = (_b = event.target.className) === null || _b === void 0 ? void 0 : _b.match(/diagnostic-(\d+)/);
      if (idxMatch === null) {
        this._tooltipDiagnostic = void 0;
        return;
      }
      const idx = Number(idxMatch[1]);
      const diagnostic = this.diagnostics[idx];
      if (diagnostic === ((_c = this._tooltipDiagnostic) === null || _c === void 0 ? void 0 : _c.diagnostic)) {
        return;
      }
      let position = "";
      const hostRect = this.getBoundingClientRect();
      const spanRect = event.target.getBoundingClientRect();
      const hostCenterY = hostRect.y + hostRect.height / 2;
      if (spanRect.y < hostCenterY) {
        position += `top:${spanRect.y + spanRect.height - hostRect.y}px;`;
      } else {
        position += `bottom:${hostRect.bottom - spanRect.y}px;`;
      }
      const hostCenterX = hostRect.x + hostRect.width / 2;
      if (spanRect.left < hostCenterX) {
        position += `left:${Math.max(0, spanRect.x - hostRect.x)}px`;
      } else {
        position += `right:${Math.max(0, hostRect.right - spanRect.right)}px`;
      }
      this._tooltipDiagnostic = { diagnostic, position };
    };
  }
  get cursorPosition() {
    var _a;
    const cursor = (_a = this._codemirror) === null || _a === void 0 ? void 0 : _a.getCursor("start");
    if (!cursor)
      return { ch: 0, line: 0 };
    return {
      ch: cursor.ch,
      line: cursor.line
    };
  }
  get cursorIndex() {
    const cm = this._codemirror;
    if (!cm)
      return 0;
    const cursorPosition = cm.getCursor("start");
    return cm.indexFromPos(cursorPosition);
  }
  get tokenUnderCursor() {
    const cm = this._codemirror;
    if (!cm)
      return { start: 0, end: 0, string: "" };
    const cursorPosition = cm.getCursor("start");
    const token = cm.getTokenAt(cursorPosition);
    return {
      start: token.start,
      end: token.end,
      string: token.string
    };
  }
  get value() {
    return this._value;
  }
  set value(v) {
    const oldValue = this._value;
    this._value = v;
    this.requestUpdate("value", oldValue);
  }
  update(changedProperties) {
    var _a, _b, _c, _d, _e, _f;
    const cm = this._codemirror;
    if (cm === void 0) {
      this._createView();
    } else {
      const changedTyped = changedProperties;
      for (const prop of changedTyped.keys()) {
        switch (prop) {
          case "documentKey": {
            const docKey = (_a = this.documentKey) !== null && _a !== void 0 ? _a : {};
            let docInstance = this._docCache.get(docKey);
            let createdNewDoc = false;
            if (!docInstance) {
              docInstance = new CodeMirror2.Doc((_b = this.value) !== null && _b !== void 0 ? _b : "", this._getLanguageMode());
              this._docCache.set(docKey, docInstance);
              createdNewDoc = true;
            } else if (docInstance.getValue() !== this.value) {
              docInstance.setValue((_c = this.value) !== null && _c !== void 0 ? _c : "");
            }
            this._valueChangingFromOutside = true;
            cm.swapDoc(docInstance);
            if (createdNewDoc) {
              this._applyHideAndFoldRegions();
            }
            this._valueChangingFromOutside = false;
            break;
          }
          case "value":
            if (changedTyped.has("documentKey")) {
              break;
            }
            this._valueChangingFromOutside = true;
            cm.setValue((_d = this.value) !== null && _d !== void 0 ? _d : "");
            this._valueChangingFromOutside = false;
            break;
          case "lineNumbers":
            cm.setOption("lineNumbers", this.lineNumbers);
            break;
          case "lineWrapping":
            if (this.lineWrapping) {
              cm.on("renderLine", this._onRenderLine);
            } else {
              cm.off("renderLine", this._onRenderLine);
            }
            cm.setOption("lineWrapping", this.lineWrapping);
            break;
          case "type":
            cm.setOption("mode", this._getLanguageMode());
            break;
          case "readonly":
            cm.setOption("readOnly", this.readonly);
            break;
          case "pragmas":
            this._applyHideAndFoldRegions();
            break;
          case "diagnostics":
            this._showDiagnostics();
            break;
          case "cursorIndex":
            cm.setCursor((_e = this.cursorIndex) !== null && _e !== void 0 ? _e : 0);
            break;
          case "cursorPosition":
            cm.setCursor((_f = this.cursorPosition) !== null && _f !== void 0 ? _f : { ch: 0, line: 0 });
            break;
          case "_completions":
            this._showCompletions();
            break;
          case "tokenUnderCursor":
          case "noCompletions":
          case "_completionsOpen":
            break;
          default:
            unreachable(prop);
        }
      }
    }
    super.update(changedProperties);
  }
  render() {
    var _a, _b;
    if (this.readonly) {
      return this._cmDom;
    }
    return x`
      <div
        id="focusContainer"
        tabindex="0"
        @mousedown=${this._onMousedown}
        @focus=${this._onFocus}
        @blur=${this._onBlur}
        @keydown=${this._onKeyDown}
      >
        ${this._showKeyboardHelp ? x`<playground-internal-overlay>
              <p id="keyboardHelp" part="dialog">
                Press <strong>Enter</strong> to start editing<br />
                Press <strong>Escape</strong> to exit editor
              </p>
            </playground-internal-overlay>` : A}
        ${this._cmDom}
        <div
          id="tooltip"
          ?hidden=${!this._tooltipDiagnostic}
          style=${l2((_a = this._tooltipDiagnostic) === null || _a === void 0 ? void 0 : _a.position)}
        >
          <div part="diagnostic-tooltip">
            ${(_b = this._tooltipDiagnostic) === null || _b === void 0 ? void 0 : _b.diagnostic.message}
          </div>
        </div>
      </div>
    `;
  }
  connectedCallback() {
    if (typeof ResizeObserver === "function") {
      this._resizeObserver = new ResizeObserver(() => {
        var _a;
        if (this._resizing) {
          return;
        }
        this._resizing = true;
        (_a = this._codemirror) === null || _a === void 0 ? void 0 : _a.refresh();
        this._resizing = false;
      });
      this._resizeObserver.observe(this);
    }
    super.connectedCallback();
  }
  disconnectedCallback() {
    var _a;
    (_a = this._resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
    this._resizeObserver = void 0;
    super.disconnectedCallback();
  }
  _createView() {
    var _a;
    const cm = CodeMirror2((dom) => {
      this._cmDom = dom;
      this._resizing = true;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          var _a2;
          (_a2 = this._codemirror) === null || _a2 === void 0 ? void 0 : _a2.refresh();
          this._resizing = false;
        });
      });
    }, {
      value: (_a = this.value) !== null && _a !== void 0 ? _a : "",
      lineNumbers: this.lineNumbers,
      lineWrapping: this.lineWrapping,
      mode: this._getLanguageMode(),
      readOnly: this.readonly,
      inputStyle: "contenteditable",
      // Don't allow naturally tabbing into the editor, because it's a
      // tab-trap. Instead, the container is focusable, and Enter/Escape are
      // used to explicitly enter the editable area.
      tabindex: -1,
      // Tab key inserts spaces instead of tab character
      extraKeys: {
        Tab: () => {
          var _a2;
          cm.replaceSelection(Array((_a2 = cm.getOption("indentUnit")) !== null && _a2 !== void 0 ? _a2 : 2).join(" "));
        },
        // Ctrl + Space requests code completions.
        ["Ctrl-Space"]: () => {
          const tokenUnderCursor = this.tokenUnderCursor.string.trim();
          this._requestCompletions({
            isRefinement: false,
            tokenUnderCursor
          });
        },
        ["Ctrl-/"]: () => cm.toggleComment(),
        ["Cmd-/"]: () => cm.toggleComment()
      }
    });
    cm.on("change", (_editorInstance, changeObject) => {
      this._value = cm.getValue();
      if (this._valueChangingFromOutside) {
        this._applyHideAndFoldRegions();
        this._showDiagnostics();
      } else {
        this.dispatchEvent(new Event("change"));
        this._requestCompletionsIfNeeded(changeObject);
      }
    });
    if (this.lineWrapping) {
      cm.on("renderLine", this._onRenderLine);
    }
    this._codemirror = cm;
  }
  _onRenderLine(editorInstance, line, elt) {
    const basePadding = 4;
    const gutter = editorInstance.getOption("lineNumbers") ? "0.7em" : `${basePadding}px`;
    const tabSize = editorInstance.getOption("tabSize") || basePadding;
    const off = CodeMirror2.countColumn(line.text, null, tabSize);
    if (off > 0) {
      elt.style.textIndent = `-${off}ch`;
      elt.style.paddingLeft = `calc(${gutter} + ${off}ch)`;
    }
  }
  _requestCompletionsIfNeeded(changeObject) {
    if (this.noCompletions || !this._currentFiletypeSupportsCompletion() || !this._codemirror)
      return;
    const previousToken = this._codemirror.getTokenAt(changeObject.from);
    const tokenUnderCursor = this.tokenUnderCursor.string.trim();
    const tokenUnderCursorAsString = tokenUnderCursor.trim();
    const isInputEvent = changeObject.origin === "+input";
    const isRefinement = (tokenUnderCursor.length > 1 || previousToken.string === ".") && isInputEvent;
    const changeWasCodeCompletion = changeObject.origin === "complete";
    if (tokenUnderCursorAsString.length <= 0)
      return;
    if (changeWasCodeCompletion) {
      this._completions = [];
      return;
    }
    this._requestCompletions({
      isRefinement,
      tokenUnderCursor
    });
  }
  _requestCompletions({ isRefinement, tokenUnderCursor }) {
    if (this.noCompletions || !this._currentFiletypeSupportsCompletion() || !this._codemirror)
      return;
    const id = ++this._currentCompletionRequestId;
    const cursorIndexOnRequest = this.cursorIndex;
    this.dispatchEvent(new CustomEvent("request-completions", {
      detail: {
        isRefinement,
        fileContent: this.value,
        tokenUnderCursor,
        cursorIndex: this.cursorIndex,
        provideCompletions: (completions) => this._onCompletionsProvided(id, completions, cursorIndexOnRequest)
      }
    }));
  }
  _onCompletionsProvided(id, completions, cursorIndex) {
    if (id !== this._currentCompletionRequestId || cursorIndex !== this.cursorIndex) {
      return;
    }
    this._completions = completions;
  }
  _currentFiletypeSupportsCompletion() {
    return this.type === "ts";
  }
  focus() {
    var _a;
    (_a = this._codemirrorEditable) === null || _a === void 0 ? void 0 : _a.focus();
  }
  _completionsAsHints() {
    var _a, _b;
    const cm = this._codemirror;
    const cursorPosition = cm.getCursor("start");
    const token = cm.getTokenAt(cursorPosition);
    const lineNumber = cursorPosition.line;
    const hintList = (_b = (_a = this._completions) === null || _a === void 0 ? void 0 : _a.map((comp, i4) => ({
      text: comp.text,
      displayText: comp.displayText,
      render: (element, _data, hint) => {
        const codeEditorHint = hint;
        this._renderHint(
          element,
          _data,
          codeEditorHint,
          i4 === 0 ? comp.details : void 0
          // Only render the detail on the first item
        );
      },
      get details() {
        return comp.details;
      }
    }))) !== null && _b !== void 0 ? _b : [];
    const hints = {
      from: { line: lineNumber, ch: token.start },
      to: { line: lineNumber, ch: token.end },
      list: hintList
    };
    CodeMirror2.on(hints, "select", async (hint, element) => {
      var _a2;
      if (!this._isCodeEditorHint(hint))
        return;
      if (this._currentCompletionSelectionLabel === hint.text)
        return;
      (_a2 = this._onCompletionSelectedChange) === null || _a2 === void 0 ? void 0 : _a2.call(this);
      this._renderHint(element, hints, hint, hint.details);
    });
    CodeMirror2.on(hints, "shown", () => {
      window.requestAnimationFrame(() => {
        this._completionsOpen = true;
      });
    });
    CodeMirror2.on(hints, "close", () => {
      window.requestAnimationFrame(() => {
        this._completionsOpen = false;
      });
    });
    return hints;
  }
  _isCodeEditorHint(hint) {
    return typeof hint !== "string" && Object.prototype.hasOwnProperty.call(hint, "details");
  }
  _renderHint(element, _data, hint, detail) {
    var _a;
    if (!element)
      return;
    const itemIndex = _data.list.indexOf(hint);
    const completionData = (_a = this._completions) === null || _a === void 0 ? void 0 : _a[itemIndex];
    const objectName = this._buildHintObjectName(hint.displayText, completionData);
    this._renderCompletionItem(objectName, element);
    if (detail !== void 0) {
      detail.then((detailResult) => {
        this._renderCompletionItemWithDetails(objectName, detailResult, element);
        this._onCompletionSelectedChange = () => this._renderHint(element, _data, hint);
        this._currentCompletionSelectionLabel = hint.text;
      });
    }
  }
  _renderCompletionItem(objectName, target) {
    D(x`<span class="hint-object-name">${objectName}</span>`, target);
  }
  _renderCompletionItemWithDetails(objectName, details, target) {
    D(x`<span class="hint-object-name">${objectName}</span>
        <span class="hint-object-details">${details.text}</span> `, target);
  }
  /**
   * Builds the name of the completable item for use in the completion UI.
   * Using marks, we can highlight the matching characters in the typed input
   * matching with the completion suggestion.
   */
  _buildHintObjectName(objectName, completionData) {
    var _a;
    const markedObjectName = objectName !== null && objectName !== void 0 ? objectName : "";
    const matches2 = (_a = completionData === null || completionData === void 0 ? void 0 : completionData.matches) !== null && _a !== void 0 ? _a : [];
    if (matches2.length <= 0) {
      return markedObjectName;
    }
    const firstMatch = matches2[0];
    const firstMatchingIndex = firstMatch.indices[0];
    const start = firstMatchingIndex[0];
    const end = firstMatchingIndex[1];
    const preMarkContent = markedObjectName === null || markedObjectName === void 0 ? void 0 : markedObjectName.substring(0, start);
    const markedContent = markedObjectName === null || markedObjectName === void 0 ? void 0 : markedObjectName.substring(start, end + 1);
    const postMarkedContent = markedObjectName === null || markedObjectName === void 0 ? void 0 : markedObjectName.substring(end + 1);
    return x`
      ${preMarkContent}<mark>${markedContent}</mark>${postMarkedContent}
    `;
  }
  _showCompletions() {
    const cm = this._codemirror;
    if (!cm || !this._completions || this._completions.length <= 0)
      return;
    const options = {
      hint: this._completionsAsHints.bind(this),
      completeSingle: false,
      closeOnPick: true,
      closeOnUnfocus: true,
      container: this._focusContainer,
      alignWithWord: true
    };
    cm.showHint(options);
  }
  _onMousedown() {
    var _a;
    (_a = this._codemirrorEditable) === null || _a === void 0 ? void 0 : _a.focus();
  }
  _onFocus() {
    this._showKeyboardHelp = true;
  }
  _onBlur() {
    this._showKeyboardHelp = false;
  }
  _onKeyDown(event) {
    var _a, _b;
    if (event.key === "Enter" && event.target === this._focusContainer) {
      (_a = this._codemirrorEditable) === null || _a === void 0 ? void 0 : _a.focus();
      event.preventDefault();
    } else if (event.key === "Escape") {
      if (!this._completionsOpen) {
        (_b = this._focusContainer) === null || _b === void 0 ? void 0 : _b.focus();
      }
    }
  }
  /**
   * Create hidden and folded regions for playground-hide and playground-fold
   * comments.
   */
  async _applyHideAndFoldRegions() {
    const cm = this._codemirror;
    if (!cm) {
      return;
    }
    for (const mark of cm.getAllMarks()) {
      mark.clear();
    }
    if (this.pragmas === "off-visible") {
      return;
    }
    const pattern = this._maskPatternForLang();
    if (pattern === void 0) {
      return;
    }
    const doc = cm.getDoc();
    const fold = (fromIdx, toIdx) => {
      cm.foldCode(
        /* ignored by our rangeFinder */
        0,
        {
          widget: "\u2026",
          rangeFinder: () => ({
            from: doc.posFromIndex(fromIdx),
            to: doc.posFromIndex(toIdx)
          })
        }
      );
    };
    const hide = (fromIdx, toIdx, readOnly) => {
      doc.markText(doc.posFromIndex(fromIdx), doc.posFromIndex(toIdx), {
        collapsed: true,
        readOnly
      });
    };
    const value = cm.getValue();
    for (const match of value.matchAll(pattern)) {
      const [, opener, kind, content, closer] = match;
      const openerStart = match.index;
      if (openerStart === void 0) {
        continue;
      }
      const openerEnd = openerStart + opener.length;
      hide(openerStart, openerEnd, false);
      const contentStart = openerEnd;
      let contentEnd;
      if (content && closer) {
        contentEnd = contentStart + content.length;
        const closerStart = contentEnd;
        const closerEnd = contentEnd + closer.length;
        hide(closerStart, closerEnd, false);
      } else {
        contentEnd = value.length;
      }
      if (this.pragmas === "on") {
        if (kind === "fold") {
          fold(contentStart, contentEnd);
        } else if (kind === "hide") {
          hide(contentStart, contentEnd, true);
        }
      }
    }
  }
  _maskPatternForLang() {
    switch (this.type) {
      case "js":
      case "ts":
      case "css":
      case "jsx":
      case "tsx":
        return /( *\/\* *playground-(?<kind>hide|fold) *\*\/\n?)(?:(.*?)( *\/\* *playground-\k<kind>-end *\*\/\n?))?/gs;
      case "html":
        return /( *<!-- *playground-(?<kind>hide|fold) *-->\n?)(?:(.*?)( *<!-- *playground-\k<kind>-end *-->\n?))?/gs;
      default:
        return void 0;
    }
  }
  _getLanguageMode() {
    switch (this.type) {
      case "ts":
        return "google-typescript";
      case "js":
      case "json":
        return "google-javascript";
      case "html":
        return "google-html";
      case "css":
        return "css";
      case "jsx":
      case "tsx":
        return "jsx";
    }
    return void 0;
  }
  _showDiagnostics() {
    const cm = this._codemirror;
    if (cm === void 0) {
      return;
    }
    cm.operation(() => {
      var _a, _b, _c;
      this._tooltipDiagnostic = void 0;
      while (this._diagnosticMarkers.length > 0) {
        this._diagnosticMarkers.pop().clear();
      }
      if (!((_a = this.diagnostics) === null || _a === void 0 ? void 0 : _a.length)) {
        if (this._diagnosticsMouseoverListenerActive) {
          (_b = this._cmDom) === null || _b === void 0 ? void 0 : _b.removeEventListener("mouseover", this._onMouseOverWithDiagnostics);
          this._diagnosticsMouseoverListenerActive = false;
        }
        return;
      }
      if (!this._diagnosticsMouseoverListenerActive) {
        (_c = this._cmDom) === null || _c === void 0 ? void 0 : _c.addEventListener("mouseover", this._onMouseOverWithDiagnostics);
        this._diagnosticsMouseoverListenerActive = true;
      }
      for (let i4 = 0; i4 < this.diagnostics.length; i4++) {
        const diagnostic = this.diagnostics[i4];
        this._diagnosticMarkers.push(cm.markText({
          line: diagnostic.range.start.line,
          ch: diagnostic.range.start.character
        }, {
          line: diagnostic.range.end.line,
          ch: diagnostic.range.end.character
        }, {
          className: `diagnostic diagnostic-${i4}`
        }));
      }
    });
  }
};
PlaygroundCodeEditor.styles = [
  i2`
      :host {
        display: block;
      }

      #focusContainer {
        height: 100%;
        position: relative;
      }
      #focusContainer:focus {
        outline: none;
      }

      .CodeMirror {
        height: 100% !important;
        border-radius: inherit;
      }

      .CodeMirror-foldmarker {
        font-family: sans-serif;
      }
      .CodeMirror-foldmarker:hover {
        cursor: pointer;
        /* Pretty much any color from the theme is good enough. */
        color: var(--playground-code-keyword-color, #770088);
      }

      #keyboardHelp {
        font-size: 18px;
        font-family: sans-serif;
        padding: 10px 20px;
      }

      .diagnostic {
        position: relative;
      }

      .diagnostic::before {
        /* It would be nice to use "text-decoration: red wavy underline" here,
           but unfortunately it renders nothing at all for single characters.
           See https://bugs.chromium.org/p/chromium/issues/detail?id=668042. */
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sJDw4cOCW1/KIAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAHElEQVQI12NggIL/DAz/GdA5/xkY/qPKMDAwAADLZwf5rvm+LQAAAABJRU5ErkJggg==');
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
      }

      #tooltip {
        position: absolute;
        padding: 7px;
        z-index: 4;
        font-family: var(--playground-code-font-family, monospace);
      }

      #tooltip > div {
        background: var(--playground-code-background, #fff);
        color: var(--playground-code-default-color, #000);
        /* Kind of hacky... line number color tends to work out as a good
           default border, because it's usually visible on top of the
           background, but slightly muted. */
        border: 1px solid var(--playground-code-linenumber-color, #ccc);
        padding: 5px;
      }
    `,
  styles
];
__decorate([
  n()
], PlaygroundCodeEditor.prototype, "value", null);
__decorate([
  n({ attribute: false })
  // eslint-disable-next-line @typescript-eslint/ban-types
], PlaygroundCodeEditor.prototype, "documentKey", void 0);
__decorate([
  n()
], PlaygroundCodeEditor.prototype, "type", void 0);
__decorate([
  n({ type: Boolean, attribute: "line-numbers", reflect: true })
], PlaygroundCodeEditor.prototype, "lineNumbers", void 0);
__decorate([
  n({ type: Boolean, attribute: "line-wrapping", reflect: true })
], PlaygroundCodeEditor.prototype, "lineWrapping", void 0);
__decorate([
  n({ type: Boolean, reflect: true })
], PlaygroundCodeEditor.prototype, "readonly", void 0);
__decorate([
  n({ type: Boolean, attribute: "no-completions" })
], PlaygroundCodeEditor.prototype, "noCompletions", void 0);
__decorate([
  n({ attribute: false })
], PlaygroundCodeEditor.prototype, "diagnostics", void 0);
__decorate([
  t()
], PlaygroundCodeEditor.prototype, "_completions", void 0);
__decorate([
  t()
], PlaygroundCodeEditor.prototype, "_completionsOpen", void 0);
__decorate([
  n()
], PlaygroundCodeEditor.prototype, "pragmas", void 0);
__decorate([
  t()
], PlaygroundCodeEditor.prototype, "_tooltipDiagnostic", void 0);
__decorate([
  t()
], PlaygroundCodeEditor.prototype, "_showKeyboardHelp", void 0);
__decorate([
  i("#focusContainer")
], PlaygroundCodeEditor.prototype, "_focusContainer", void 0);
__decorate([
  i(".CodeMirror-code")
], PlaygroundCodeEditor.prototype, "_codemirrorEditable", void 0);
PlaygroundCodeEditor = __decorate([
  e("playground-code-editor")
], PlaygroundCodeEditor);

// ../node_modules/playground-elements/playground-connected-element.js
var PlaygroundConnectedElement = class extends s {
  /**
   * The project that this element is associated with. Either the
   * `<playground-project>` node itself, or its `id` in the host scope.
   */
  set project(elementOrId) {
    if (typeof elementOrId === "string") {
      requestAnimationFrame(() => {
        var _a;
        const root = this.getRootNode();
        this._project = (_a = root.getElementById(elementOrId)) !== null && _a !== void 0 ? _a : void 0;
      });
    } else {
      this._project = elementOrId;
    }
  }
};
__decorate([
  n()
], PlaygroundConnectedElement.prototype, "project", null);
__decorate([
  t()
], PlaygroundConnectedElement.prototype, "_project", void 0);

// ../node_modules/playground-elements/playground-file-editor.js
var PlaygroundFileEditor = class PlaygroundFileEditor2 extends PlaygroundConnectedElement {
  constructor() {
    super(...arguments);
    this.lineNumbers = false;
    this.lineWrapping = false;
    this.pragmas = "on";
    this.readonly = false;
    this.noCompletions = false;
    this._onProjectFilesChanged = () => {
      var _a, _b;
      (_a = this.filename) !== null && _a !== void 0 ? _a : this.filename = (_b = this._files[0]) === null || _b === void 0 ? void 0 : _b.name;
      this.requestUpdate();
    };
    this._onCompileDone = () => {
      this.requestUpdate();
    };
    this._onDiagnosticsChanged = () => {
      this.requestUpdate();
    };
  }
  get _files() {
    var _a, _b;
    return (_b = (_a = this._project) === null || _a === void 0 ? void 0 : _a.files) !== null && _b !== void 0 ? _b : [];
  }
  get _currentFile() {
    return this.filename ? this._files.find((file) => file.name === this.filename) : void 0;
  }
  async update(changedProperties) {
    if (changedProperties.has("_project")) {
      const oldProject = changedProperties.get("_project");
      if (oldProject) {
        oldProject.removeEventListener("filesChanged", this._onProjectFilesChanged);
        oldProject.removeEventListener("compileDone", this._onCompileDone);
        oldProject.removeEventListener("diagnosticsChanged", this._onDiagnosticsChanged);
      }
      if (this._project) {
        this._project.addEventListener("filesChanged", this._onProjectFilesChanged);
        this._project.addEventListener("compileDone", this._onCompileDone);
        this._project.addEventListener("diagnosticsChanged", this._onDiagnosticsChanged);
      }
      this._onProjectFilesChanged();
    }
    super.update(changedProperties);
  }
  render() {
    var _a, _b, _c, _d, _e, _f;
    return x`
      ${this._files ? x`
            <playground-code-editor
              exportparts="diagnostic-tooltip, dialog"
              .value=${// We need live() because the lit's dirty-checking value for
    // content is not updated by user edits.
    l((_b = (_a = this._currentFile) === null || _a === void 0 ? void 0 : _a.content) !== null && _b !== void 0 ? _b : "")}
              .documentKey=${this._currentFile}
              .type=${this._currentFile ? mimeTypeToTypeEnum(this._currentFile.contentType) : void 0}
              .lineNumbers=${this.lineNumbers}
              .lineWrapping=${this.lineWrapping}
              .readonly=${this.readonly || !this._currentFile}
              .pragmas=${this.pragmas}
              .diagnostics=${(_d = (_c = this._project) === null || _c === void 0 ? void 0 : _c.diagnostics) === null || _d === void 0 ? void 0 : _d.get((_f = (_e = this._currentFile) === null || _e === void 0 ? void 0 : _e.name) !== null && _f !== void 0 ? _f : "")}
              .noCompletions=${this.noCompletions}
              @change=${this._onEdit}
              @request-completions=${this._onRequestCompletions}
            >
            </playground-code-editor>
          ` : x`<slot></slot>`}
    `;
  }
  _onEdit() {
    if (this._project === void 0 || this._currentFile === void 0 || this._editor.value === void 0) {
      return;
    }
    this._project.editFile(this._currentFile, this._editor.value);
  }
  async _onRequestCompletions(e5) {
    var _a, _b;
    const codeEditorChangeData = e5.detail;
    codeEditorChangeData.fileName = (_a = this.filename) !== null && _a !== void 0 ? _a : "";
    const completions = await ((_b = this._project) === null || _b === void 0 ? void 0 : _b.getCompletions(codeEditorChangeData));
    if (completions) {
      codeEditorChangeData.provideCompletions(completions);
    }
  }
};
PlaygroundFileEditor.styles = i2`
    :host {
      display: block;
      /* Prevents scrollbars from changing container size and shifting layout
      slightly. */
      box-sizing: border-box;
      height: 350px;
    }

    slot {
      height: 100%;
      display: block;
      background: var(--playground-code-background, unset);
    }

    playground-code-editor {
      height: 100%;
      border-radius: inherit;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  `;
__decorate([
  i("playground-code-editor")
], PlaygroundFileEditor.prototype, "_editor", void 0);
__decorate([
  n()
], PlaygroundFileEditor.prototype, "filename", void 0);
__decorate([
  n({ type: Boolean, attribute: "line-numbers" })
], PlaygroundFileEditor.prototype, "lineNumbers", void 0);
__decorate([
  n({ type: Boolean, attribute: "line-wrapping" })
], PlaygroundFileEditor.prototype, "lineWrapping", void 0);
__decorate([
  n()
], PlaygroundFileEditor.prototype, "pragmas", void 0);
__decorate([
  n({ type: Boolean, reflect: true })
], PlaygroundFileEditor.prototype, "readonly", void 0);
__decorate([
  n({ type: Boolean, attribute: "no-completions" })
], PlaygroundFileEditor.prototype, "noCompletions", void 0);
PlaygroundFileEditor = __decorate([
  e("playground-file-editor")
], PlaygroundFileEditor);
var mimeTypeToTypeEnum = (mimeType) => {
  if (mimeType === void 0) {
    return;
  }
  const encodingSepIndex = mimeType.indexOf(";");
  if (encodingSepIndex !== -1) {
    mimeType = mimeType.substring(0, encodingSepIndex);
  }
  switch (mimeType) {
    // TypeScript: this is the mime-type returned by servers
    // .ts files aren't usually served to browsers, so they don't yet
    // have their own mime-type.
    case "video/mp2t":
      return "ts";
    case "text/javascript":
    case "application/javascript":
      return "js";
    case "text/jsx":
      return "jsx";
    case "text/typescript-jsx":
      return "tsx";
    case "application/json":
      return "json";
    case "text/html":
      return "html";
    case "text/css":
      return "css";
  }
  return void 0;
};

// ../node_modules/@material/dom/ponyfill.js
function matches(element, selector) {
  var nativeMatches = element.matches || element.webkitMatchesSelector || element.msMatchesSelector;
  return nativeMatches.call(element, selector);
}

// ../node_modules/@material/mwc-base/utils.js
var supportsPassive = false;
var fn = () => {
};
var optionsBlock = {
  get passive() {
    supportsPassive = true;
    return false;
  }
};
document.addEventListener("x", fn, optionsBlock);
document.removeEventListener("x", fn);

// ../node_modules/@material/mwc-base/base-element.js
var BaseElement = class extends s {
  click() {
    if (this.mdcRoot) {
      this.mdcRoot.focus();
      this.mdcRoot.click();
      return;
    }
    super.click();
  }
  /**
   * Create and attach the MDC Foundation to the instance
   */
  createFoundation() {
    if (this.mdcFoundation !== void 0) {
      this.mdcFoundation.destroy();
    }
    if (this.mdcFoundationClass) {
      this.mdcFoundation = new this.mdcFoundationClass(this.createAdapter());
      this.mdcFoundation.init();
    }
  }
  firstUpdated() {
    this.createFoundation();
  }
};

// ../node_modules/@material/base/foundation.js
var MDCFoundation = (
  /** @class */
  (function() {
    function MDCFoundation2(adapter) {
      if (adapter === void 0) {
        adapter = {};
      }
      this.adapter = adapter;
    }
    Object.defineProperty(MDCFoundation2, "cssClasses", {
      get: function() {
        return {};
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(MDCFoundation2, "strings", {
      get: function() {
        return {};
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(MDCFoundation2, "numbers", {
      get: function() {
        return {};
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(MDCFoundation2, "defaultAdapter", {
      get: function() {
        return {};
      },
      enumerable: false,
      configurable: true
    });
    MDCFoundation2.prototype.init = function() {
    };
    MDCFoundation2.prototype.destroy = function() {
    };
    return MDCFoundation2;
  })()
);

// ../node_modules/@material/ripple/constants.js
var cssClasses = {
  // Ripple is a special case where the "root" component is really a "mixin" of sorts,
  // given that it's an 'upgrade' to an existing component. That being said it is the root
  // CSS class that all other CSS classes derive from.
  BG_FOCUSED: "mdc-ripple-upgraded--background-focused",
  FG_ACTIVATION: "mdc-ripple-upgraded--foreground-activation",
  FG_DEACTIVATION: "mdc-ripple-upgraded--foreground-deactivation",
  ROOT: "mdc-ripple-upgraded",
  UNBOUNDED: "mdc-ripple-upgraded--unbounded"
};
var strings = {
  VAR_FG_SCALE: "--mdc-ripple-fg-scale",
  VAR_FG_SIZE: "--mdc-ripple-fg-size",
  VAR_FG_TRANSLATE_END: "--mdc-ripple-fg-translate-end",
  VAR_FG_TRANSLATE_START: "--mdc-ripple-fg-translate-start",
  VAR_LEFT: "--mdc-ripple-left",
  VAR_TOP: "--mdc-ripple-top"
};
var numbers = {
  DEACTIVATION_TIMEOUT_MS: 225,
  FG_DEACTIVATION_MS: 150,
  INITIAL_ORIGIN_SCALE: 0.6,
  PADDING: 10,
  TAP_DELAY_MS: 300
  // Delay between touch and simulated mouse events on touch devices
};

// ../node_modules/@material/ripple/util.js
function getNormalizedEventCoords(evt, pageOffset, clientRect) {
  if (!evt) {
    return { x: 0, y: 0 };
  }
  var x2 = pageOffset.x, y = pageOffset.y;
  var documentX = x2 + clientRect.left;
  var documentY = y + clientRect.top;
  var normalizedX;
  var normalizedY;
  if (evt.type === "touchstart") {
    var touchEvent = evt;
    normalizedX = touchEvent.changedTouches[0].pageX - documentX;
    normalizedY = touchEvent.changedTouches[0].pageY - documentY;
  } else {
    var mouseEvent = evt;
    normalizedX = mouseEvent.pageX - documentX;
    normalizedY = mouseEvent.pageY - documentY;
  }
  return { x: normalizedX, y: normalizedY };
}

// ../node_modules/@material/ripple/foundation.js
var ACTIVATION_EVENT_TYPES = [
  "touchstart",
  "pointerdown",
  "mousedown",
  "keydown"
];
var POINTER_DEACTIVATION_EVENT_TYPES = [
  "touchend",
  "pointerup",
  "mouseup",
  "contextmenu"
];
var activatedTargets = [];
var MDCRippleFoundation = (
  /** @class */
  (function(_super) {
    __extends(MDCRippleFoundation2, _super);
    function MDCRippleFoundation2(adapter) {
      var _this = _super.call(this, __assign(__assign({}, MDCRippleFoundation2.defaultAdapter), adapter)) || this;
      _this.activationAnimationHasEnded = false;
      _this.activationTimer = 0;
      _this.fgDeactivationRemovalTimer = 0;
      _this.fgScale = "0";
      _this.frame = { width: 0, height: 0 };
      _this.initialSize = 0;
      _this.layoutFrame = 0;
      _this.maxRadius = 0;
      _this.unboundedCoords = { left: 0, top: 0 };
      _this.activationState = _this.defaultActivationState();
      _this.activationTimerCallback = function() {
        _this.activationAnimationHasEnded = true;
        _this.runDeactivationUXLogicIfReady();
      };
      _this.activateHandler = function(e5) {
        _this.activateImpl(e5);
      };
      _this.deactivateHandler = function() {
        _this.deactivateImpl();
      };
      _this.focusHandler = function() {
        _this.handleFocus();
      };
      _this.blurHandler = function() {
        _this.handleBlur();
      };
      _this.resizeHandler = function() {
        _this.layout();
      };
      return _this;
    }
    Object.defineProperty(MDCRippleFoundation2, "cssClasses", {
      get: function() {
        return cssClasses;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(MDCRippleFoundation2, "strings", {
      get: function() {
        return strings;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(MDCRippleFoundation2, "numbers", {
      get: function() {
        return numbers;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(MDCRippleFoundation2, "defaultAdapter", {
      get: function() {
        return {
          addClass: function() {
            return void 0;
          },
          browserSupportsCssVars: function() {
            return true;
          },
          computeBoundingRect: function() {
            return { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 };
          },
          containsEventTarget: function() {
            return true;
          },
          deregisterDocumentInteractionHandler: function() {
            return void 0;
          },
          deregisterInteractionHandler: function() {
            return void 0;
          },
          deregisterResizeHandler: function() {
            return void 0;
          },
          getWindowPageOffset: function() {
            return { x: 0, y: 0 };
          },
          isSurfaceActive: function() {
            return true;
          },
          isSurfaceDisabled: function() {
            return true;
          },
          isUnbounded: function() {
            return true;
          },
          registerDocumentInteractionHandler: function() {
            return void 0;
          },
          registerInteractionHandler: function() {
            return void 0;
          },
          registerResizeHandler: function() {
            return void 0;
          },
          removeClass: function() {
            return void 0;
          },
          updateCssVariable: function() {
            return void 0;
          }
        };
      },
      enumerable: false,
      configurable: true
    });
    MDCRippleFoundation2.prototype.init = function() {
      var _this = this;
      var supportsPressRipple = this.supportsPressRipple();
      this.registerRootHandlers(supportsPressRipple);
      if (supportsPressRipple) {
        var _a = MDCRippleFoundation2.cssClasses, ROOT_1 = _a.ROOT, UNBOUNDED_1 = _a.UNBOUNDED;
        requestAnimationFrame(function() {
          _this.adapter.addClass(ROOT_1);
          if (_this.adapter.isUnbounded()) {
            _this.adapter.addClass(UNBOUNDED_1);
            _this.layoutInternal();
          }
        });
      }
    };
    MDCRippleFoundation2.prototype.destroy = function() {
      var _this = this;
      if (this.supportsPressRipple()) {
        if (this.activationTimer) {
          clearTimeout(this.activationTimer);
          this.activationTimer = 0;
          this.adapter.removeClass(MDCRippleFoundation2.cssClasses.FG_ACTIVATION);
        }
        if (this.fgDeactivationRemovalTimer) {
          clearTimeout(this.fgDeactivationRemovalTimer);
          this.fgDeactivationRemovalTimer = 0;
          this.adapter.removeClass(MDCRippleFoundation2.cssClasses.FG_DEACTIVATION);
        }
        var _a = MDCRippleFoundation2.cssClasses, ROOT_2 = _a.ROOT, UNBOUNDED_2 = _a.UNBOUNDED;
        requestAnimationFrame(function() {
          _this.adapter.removeClass(ROOT_2);
          _this.adapter.removeClass(UNBOUNDED_2);
          _this.removeCssVars();
        });
      }
      this.deregisterRootHandlers();
      this.deregisterDeactivationHandlers();
    };
    MDCRippleFoundation2.prototype.activate = function(evt) {
      this.activateImpl(evt);
    };
    MDCRippleFoundation2.prototype.deactivate = function() {
      this.deactivateImpl();
    };
    MDCRippleFoundation2.prototype.layout = function() {
      var _this = this;
      if (this.layoutFrame) {
        cancelAnimationFrame(this.layoutFrame);
      }
      this.layoutFrame = requestAnimationFrame(function() {
        _this.layoutInternal();
        _this.layoutFrame = 0;
      });
    };
    MDCRippleFoundation2.prototype.setUnbounded = function(unbounded) {
      var UNBOUNDED = MDCRippleFoundation2.cssClasses.UNBOUNDED;
      if (unbounded) {
        this.adapter.addClass(UNBOUNDED);
      } else {
        this.adapter.removeClass(UNBOUNDED);
      }
    };
    MDCRippleFoundation2.prototype.handleFocus = function() {
      var _this = this;
      requestAnimationFrame(function() {
        return _this.adapter.addClass(MDCRippleFoundation2.cssClasses.BG_FOCUSED);
      });
    };
    MDCRippleFoundation2.prototype.handleBlur = function() {
      var _this = this;
      requestAnimationFrame(function() {
        return _this.adapter.removeClass(MDCRippleFoundation2.cssClasses.BG_FOCUSED);
      });
    };
    MDCRippleFoundation2.prototype.supportsPressRipple = function() {
      return this.adapter.browserSupportsCssVars();
    };
    MDCRippleFoundation2.prototype.defaultActivationState = function() {
      return {
        activationEvent: void 0,
        hasDeactivationUXRun: false,
        isActivated: false,
        isProgrammatic: false,
        wasActivatedByPointer: false,
        wasElementMadeActive: false
      };
    };
    MDCRippleFoundation2.prototype.registerRootHandlers = function(supportsPressRipple) {
      var e_1, _a;
      if (supportsPressRipple) {
        try {
          for (var ACTIVATION_EVENT_TYPES_1 = __values(ACTIVATION_EVENT_TYPES), ACTIVATION_EVENT_TYPES_1_1 = ACTIVATION_EVENT_TYPES_1.next(); !ACTIVATION_EVENT_TYPES_1_1.done; ACTIVATION_EVENT_TYPES_1_1 = ACTIVATION_EVENT_TYPES_1.next()) {
            var evtType = ACTIVATION_EVENT_TYPES_1_1.value;
            this.adapter.registerInteractionHandler(evtType, this.activateHandler);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (ACTIVATION_EVENT_TYPES_1_1 && !ACTIVATION_EVENT_TYPES_1_1.done && (_a = ACTIVATION_EVENT_TYPES_1.return)) _a.call(ACTIVATION_EVENT_TYPES_1);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
        if (this.adapter.isUnbounded()) {
          this.adapter.registerResizeHandler(this.resizeHandler);
        }
      }
      this.adapter.registerInteractionHandler("focus", this.focusHandler);
      this.adapter.registerInteractionHandler("blur", this.blurHandler);
    };
    MDCRippleFoundation2.prototype.registerDeactivationHandlers = function(evt) {
      var e_2, _a;
      if (evt.type === "keydown") {
        this.adapter.registerInteractionHandler("keyup", this.deactivateHandler);
      } else {
        try {
          for (var POINTER_DEACTIVATION_EVENT_TYPES_1 = __values(POINTER_DEACTIVATION_EVENT_TYPES), POINTER_DEACTIVATION_EVENT_TYPES_1_1 = POINTER_DEACTIVATION_EVENT_TYPES_1.next(); !POINTER_DEACTIVATION_EVENT_TYPES_1_1.done; POINTER_DEACTIVATION_EVENT_TYPES_1_1 = POINTER_DEACTIVATION_EVENT_TYPES_1.next()) {
            var evtType = POINTER_DEACTIVATION_EVENT_TYPES_1_1.value;
            this.adapter.registerDocumentInteractionHandler(evtType, this.deactivateHandler);
          }
        } catch (e_2_1) {
          e_2 = { error: e_2_1 };
        } finally {
          try {
            if (POINTER_DEACTIVATION_EVENT_TYPES_1_1 && !POINTER_DEACTIVATION_EVENT_TYPES_1_1.done && (_a = POINTER_DEACTIVATION_EVENT_TYPES_1.return)) _a.call(POINTER_DEACTIVATION_EVENT_TYPES_1);
          } finally {
            if (e_2) throw e_2.error;
          }
        }
      }
    };
    MDCRippleFoundation2.prototype.deregisterRootHandlers = function() {
      var e_3, _a;
      try {
        for (var ACTIVATION_EVENT_TYPES_2 = __values(ACTIVATION_EVENT_TYPES), ACTIVATION_EVENT_TYPES_2_1 = ACTIVATION_EVENT_TYPES_2.next(); !ACTIVATION_EVENT_TYPES_2_1.done; ACTIVATION_EVENT_TYPES_2_1 = ACTIVATION_EVENT_TYPES_2.next()) {
          var evtType = ACTIVATION_EVENT_TYPES_2_1.value;
          this.adapter.deregisterInteractionHandler(evtType, this.activateHandler);
        }
      } catch (e_3_1) {
        e_3 = { error: e_3_1 };
      } finally {
        try {
          if (ACTIVATION_EVENT_TYPES_2_1 && !ACTIVATION_EVENT_TYPES_2_1.done && (_a = ACTIVATION_EVENT_TYPES_2.return)) _a.call(ACTIVATION_EVENT_TYPES_2);
        } finally {
          if (e_3) throw e_3.error;
        }
      }
      this.adapter.deregisterInteractionHandler("focus", this.focusHandler);
      this.adapter.deregisterInteractionHandler("blur", this.blurHandler);
      if (this.adapter.isUnbounded()) {
        this.adapter.deregisterResizeHandler(this.resizeHandler);
      }
    };
    MDCRippleFoundation2.prototype.deregisterDeactivationHandlers = function() {
      var e_4, _a;
      this.adapter.deregisterInteractionHandler("keyup", this.deactivateHandler);
      try {
        for (var POINTER_DEACTIVATION_EVENT_TYPES_2 = __values(POINTER_DEACTIVATION_EVENT_TYPES), POINTER_DEACTIVATION_EVENT_TYPES_2_1 = POINTER_DEACTIVATION_EVENT_TYPES_2.next(); !POINTER_DEACTIVATION_EVENT_TYPES_2_1.done; POINTER_DEACTIVATION_EVENT_TYPES_2_1 = POINTER_DEACTIVATION_EVENT_TYPES_2.next()) {
          var evtType = POINTER_DEACTIVATION_EVENT_TYPES_2_1.value;
          this.adapter.deregisterDocumentInteractionHandler(evtType, this.deactivateHandler);
        }
      } catch (e_4_1) {
        e_4 = { error: e_4_1 };
      } finally {
        try {
          if (POINTER_DEACTIVATION_EVENT_TYPES_2_1 && !POINTER_DEACTIVATION_EVENT_TYPES_2_1.done && (_a = POINTER_DEACTIVATION_EVENT_TYPES_2.return)) _a.call(POINTER_DEACTIVATION_EVENT_TYPES_2);
        } finally {
          if (e_4) throw e_4.error;
        }
      }
    };
    MDCRippleFoundation2.prototype.removeCssVars = function() {
      var _this = this;
      var rippleStrings = MDCRippleFoundation2.strings;
      var keys = Object.keys(rippleStrings);
      keys.forEach(function(key) {
        if (key.indexOf("VAR_") === 0) {
          _this.adapter.updateCssVariable(rippleStrings[key], null);
        }
      });
    };
    MDCRippleFoundation2.prototype.activateImpl = function(evt) {
      var _this = this;
      if (this.adapter.isSurfaceDisabled()) {
        return;
      }
      var activationState = this.activationState;
      if (activationState.isActivated) {
        return;
      }
      var previousActivationEvent = this.previousActivationEvent;
      var isSameInteraction = previousActivationEvent && evt !== void 0 && previousActivationEvent.type !== evt.type;
      if (isSameInteraction) {
        return;
      }
      activationState.isActivated = true;
      activationState.isProgrammatic = evt === void 0;
      activationState.activationEvent = evt;
      activationState.wasActivatedByPointer = activationState.isProgrammatic ? false : evt !== void 0 && (evt.type === "mousedown" || evt.type === "touchstart" || evt.type === "pointerdown");
      var hasActivatedChild = evt !== void 0 && activatedTargets.length > 0 && activatedTargets.some(function(target) {
        return _this.adapter.containsEventTarget(target);
      });
      if (hasActivatedChild) {
        this.resetActivationState();
        return;
      }
      if (evt !== void 0) {
        activatedTargets.push(evt.target);
        this.registerDeactivationHandlers(evt);
      }
      activationState.wasElementMadeActive = this.checkElementMadeActive(evt);
      if (activationState.wasElementMadeActive) {
        this.animateActivation();
      }
      requestAnimationFrame(function() {
        activatedTargets = [];
        if (!activationState.wasElementMadeActive && evt !== void 0 && (evt.key === " " || evt.keyCode === 32)) {
          activationState.wasElementMadeActive = _this.checkElementMadeActive(evt);
          if (activationState.wasElementMadeActive) {
            _this.animateActivation();
          }
        }
        if (!activationState.wasElementMadeActive) {
          _this.activationState = _this.defaultActivationState();
        }
      });
    };
    MDCRippleFoundation2.prototype.checkElementMadeActive = function(evt) {
      return evt !== void 0 && evt.type === "keydown" ? this.adapter.isSurfaceActive() : true;
    };
    MDCRippleFoundation2.prototype.animateActivation = function() {
      var _this = this;
      var _a = MDCRippleFoundation2.strings, VAR_FG_TRANSLATE_START = _a.VAR_FG_TRANSLATE_START, VAR_FG_TRANSLATE_END = _a.VAR_FG_TRANSLATE_END;
      var _b = MDCRippleFoundation2.cssClasses, FG_DEACTIVATION = _b.FG_DEACTIVATION, FG_ACTIVATION = _b.FG_ACTIVATION;
      var DEACTIVATION_TIMEOUT_MS = MDCRippleFoundation2.numbers.DEACTIVATION_TIMEOUT_MS;
      this.layoutInternal();
      var translateStart = "";
      var translateEnd = "";
      if (!this.adapter.isUnbounded()) {
        var _c = this.getFgTranslationCoordinates(), startPoint = _c.startPoint, endPoint = _c.endPoint;
        translateStart = startPoint.x + "px, " + startPoint.y + "px";
        translateEnd = endPoint.x + "px, " + endPoint.y + "px";
      }
      this.adapter.updateCssVariable(VAR_FG_TRANSLATE_START, translateStart);
      this.adapter.updateCssVariable(VAR_FG_TRANSLATE_END, translateEnd);
      clearTimeout(this.activationTimer);
      clearTimeout(this.fgDeactivationRemovalTimer);
      this.rmBoundedActivationClasses();
      this.adapter.removeClass(FG_DEACTIVATION);
      this.adapter.computeBoundingRect();
      this.adapter.addClass(FG_ACTIVATION);
      this.activationTimer = setTimeout(function() {
        _this.activationTimerCallback();
      }, DEACTIVATION_TIMEOUT_MS);
    };
    MDCRippleFoundation2.prototype.getFgTranslationCoordinates = function() {
      var _a = this.activationState, activationEvent = _a.activationEvent, wasActivatedByPointer = _a.wasActivatedByPointer;
      var startPoint;
      if (wasActivatedByPointer) {
        startPoint = getNormalizedEventCoords(activationEvent, this.adapter.getWindowPageOffset(), this.adapter.computeBoundingRect());
      } else {
        startPoint = {
          x: this.frame.width / 2,
          y: this.frame.height / 2
        };
      }
      startPoint = {
        x: startPoint.x - this.initialSize / 2,
        y: startPoint.y - this.initialSize / 2
      };
      var endPoint = {
        x: this.frame.width / 2 - this.initialSize / 2,
        y: this.frame.height / 2 - this.initialSize / 2
      };
      return { startPoint, endPoint };
    };
    MDCRippleFoundation2.prototype.runDeactivationUXLogicIfReady = function() {
      var _this = this;
      var FG_DEACTIVATION = MDCRippleFoundation2.cssClasses.FG_DEACTIVATION;
      var _a = this.activationState, hasDeactivationUXRun = _a.hasDeactivationUXRun, isActivated = _a.isActivated;
      var activationHasEnded = hasDeactivationUXRun || !isActivated;
      if (activationHasEnded && this.activationAnimationHasEnded) {
        this.rmBoundedActivationClasses();
        this.adapter.addClass(FG_DEACTIVATION);
        this.fgDeactivationRemovalTimer = setTimeout(function() {
          _this.adapter.removeClass(FG_DEACTIVATION);
        }, numbers.FG_DEACTIVATION_MS);
      }
    };
    MDCRippleFoundation2.prototype.rmBoundedActivationClasses = function() {
      var FG_ACTIVATION = MDCRippleFoundation2.cssClasses.FG_ACTIVATION;
      this.adapter.removeClass(FG_ACTIVATION);
      this.activationAnimationHasEnded = false;
      this.adapter.computeBoundingRect();
    };
    MDCRippleFoundation2.prototype.resetActivationState = function() {
      var _this = this;
      this.previousActivationEvent = this.activationState.activationEvent;
      this.activationState = this.defaultActivationState();
      setTimeout(function() {
        return _this.previousActivationEvent = void 0;
      }, MDCRippleFoundation2.numbers.TAP_DELAY_MS);
    };
    MDCRippleFoundation2.prototype.deactivateImpl = function() {
      var _this = this;
      var activationState = this.activationState;
      if (!activationState.isActivated) {
        return;
      }
      var state = __assign({}, activationState);
      if (activationState.isProgrammatic) {
        requestAnimationFrame(function() {
          _this.animateDeactivation(state);
        });
        this.resetActivationState();
      } else {
        this.deregisterDeactivationHandlers();
        requestAnimationFrame(function() {
          _this.activationState.hasDeactivationUXRun = true;
          _this.animateDeactivation(state);
          _this.resetActivationState();
        });
      }
    };
    MDCRippleFoundation2.prototype.animateDeactivation = function(_a) {
      var wasActivatedByPointer = _a.wasActivatedByPointer, wasElementMadeActive = _a.wasElementMadeActive;
      if (wasActivatedByPointer || wasElementMadeActive) {
        this.runDeactivationUXLogicIfReady();
      }
    };
    MDCRippleFoundation2.prototype.layoutInternal = function() {
      var _this = this;
      this.frame = this.adapter.computeBoundingRect();
      var maxDim = Math.max(this.frame.height, this.frame.width);
      var getBoundedRadius = function() {
        var hypotenuse = Math.sqrt(Math.pow(_this.frame.width, 2) + Math.pow(_this.frame.height, 2));
        return hypotenuse + MDCRippleFoundation2.numbers.PADDING;
      };
      this.maxRadius = this.adapter.isUnbounded() ? maxDim : getBoundedRadius();
      var initialSize = Math.floor(maxDim * MDCRippleFoundation2.numbers.INITIAL_ORIGIN_SCALE);
      if (this.adapter.isUnbounded() && initialSize % 2 !== 0) {
        this.initialSize = initialSize - 1;
      } else {
        this.initialSize = initialSize;
      }
      this.fgScale = "" + this.maxRadius / this.initialSize;
      this.updateLayoutCssVars();
    };
    MDCRippleFoundation2.prototype.updateLayoutCssVars = function() {
      var _a = MDCRippleFoundation2.strings, VAR_FG_SIZE = _a.VAR_FG_SIZE, VAR_LEFT = _a.VAR_LEFT, VAR_TOP = _a.VAR_TOP, VAR_FG_SCALE = _a.VAR_FG_SCALE;
      this.adapter.updateCssVariable(VAR_FG_SIZE, this.initialSize + "px");
      this.adapter.updateCssVariable(VAR_FG_SCALE, this.fgScale);
      if (this.adapter.isUnbounded()) {
        this.unboundedCoords = {
          left: Math.round(this.frame.width / 2 - this.initialSize / 2),
          top: Math.round(this.frame.height / 2 - this.initialSize / 2)
        };
        this.adapter.updateCssVariable(VAR_LEFT, this.unboundedCoords.left + "px");
        this.adapter.updateCssVariable(VAR_TOP, this.unboundedCoords.top + "px");
      }
    };
    return MDCRippleFoundation2;
  })(MDCFoundation)
);
var foundation_default = MDCRippleFoundation;

// ../node_modules/@material/mwc-ripple/mwc-ripple-base.js
var RippleBase = class extends BaseElement {
  constructor() {
    super(...arguments);
    this.primary = false;
    this.accent = false;
    this.unbounded = false;
    this.disabled = false;
    this.activated = false;
    this.selected = false;
    this.internalUseStateLayerCustomProperties = false;
    this.hovering = false;
    this.bgFocused = false;
    this.fgActivation = false;
    this.fgDeactivation = false;
    this.fgScale = "";
    this.fgSize = "";
    this.translateStart = "";
    this.translateEnd = "";
    this.leftPos = "";
    this.topPos = "";
    this.mdcFoundationClass = foundation_default;
  }
  get isActive() {
    return matches(this.parentElement || this, ":active");
  }
  createAdapter() {
    return {
      browserSupportsCssVars: () => true,
      isUnbounded: () => this.unbounded,
      isSurfaceActive: () => this.isActive,
      isSurfaceDisabled: () => this.disabled,
      addClass: (className) => {
        switch (className) {
          case "mdc-ripple-upgraded--background-focused":
            this.bgFocused = true;
            break;
          case "mdc-ripple-upgraded--foreground-activation":
            this.fgActivation = true;
            break;
          case "mdc-ripple-upgraded--foreground-deactivation":
            this.fgDeactivation = true;
            break;
          default:
            break;
        }
      },
      removeClass: (className) => {
        switch (className) {
          case "mdc-ripple-upgraded--background-focused":
            this.bgFocused = false;
            break;
          case "mdc-ripple-upgraded--foreground-activation":
            this.fgActivation = false;
            break;
          case "mdc-ripple-upgraded--foreground-deactivation":
            this.fgDeactivation = false;
            break;
          default:
            break;
        }
      },
      containsEventTarget: () => true,
      registerInteractionHandler: () => void 0,
      deregisterInteractionHandler: () => void 0,
      registerDocumentInteractionHandler: () => void 0,
      deregisterDocumentInteractionHandler: () => void 0,
      registerResizeHandler: () => void 0,
      deregisterResizeHandler: () => void 0,
      updateCssVariable: (varName, value) => {
        switch (varName) {
          case "--mdc-ripple-fg-scale":
            this.fgScale = value;
            break;
          case "--mdc-ripple-fg-size":
            this.fgSize = value;
            break;
          case "--mdc-ripple-fg-translate-end":
            this.translateEnd = value;
            break;
          case "--mdc-ripple-fg-translate-start":
            this.translateStart = value;
            break;
          case "--mdc-ripple-left":
            this.leftPos = value;
            break;
          case "--mdc-ripple-top":
            this.topPos = value;
            break;
          default:
            break;
        }
      },
      computeBoundingRect: () => (this.parentElement || this).getBoundingClientRect(),
      getWindowPageOffset: () => ({ x: window.pageXOffset, y: window.pageYOffset })
    };
  }
  startPress(ev) {
    this.waitForFoundation(() => {
      this.mdcFoundation.activate(ev);
    });
  }
  endPress() {
    this.waitForFoundation(() => {
      this.mdcFoundation.deactivate();
    });
  }
  startFocus() {
    this.waitForFoundation(() => {
      this.mdcFoundation.handleFocus();
    });
  }
  endFocus() {
    this.waitForFoundation(() => {
      this.mdcFoundation.handleBlur();
    });
  }
  startHover() {
    this.hovering = true;
  }
  endHover() {
    this.hovering = false;
  }
  /**
   * Wait for the MDCFoundation to be created by `firstUpdated`
   */
  waitForFoundation(fn2) {
    if (this.mdcFoundation) {
      fn2();
    } else {
      this.updateComplete.then(fn2);
    }
  }
  update(changedProperties) {
    if (changedProperties.has("disabled")) {
      if (this.disabled) {
        this.endHover();
      }
    }
    super.update(changedProperties);
  }
  /** @soyTemplate */
  render() {
    const shouldActivateInPrimary = this.activated && (this.primary || !this.accent);
    const shouldSelectInPrimary = this.selected && (this.primary || !this.accent);
    const classes = {
      "mdc-ripple-surface--accent": this.accent,
      "mdc-ripple-surface--primary--activated": shouldActivateInPrimary,
      "mdc-ripple-surface--accent--activated": this.accent && this.activated,
      "mdc-ripple-surface--primary--selected": shouldSelectInPrimary,
      "mdc-ripple-surface--accent--selected": this.accent && this.selected,
      "mdc-ripple-surface--disabled": this.disabled,
      "mdc-ripple-surface--hover": this.hovering,
      "mdc-ripple-surface--primary": this.primary,
      "mdc-ripple-surface--selected": this.selected,
      "mdc-ripple-upgraded--background-focused": this.bgFocused,
      "mdc-ripple-upgraded--foreground-activation": this.fgActivation,
      "mdc-ripple-upgraded--foreground-deactivation": this.fgDeactivation,
      "mdc-ripple-upgraded--unbounded": this.unbounded,
      "mdc-ripple-surface--internal-use-state-layer-custom-properties": this.internalUseStateLayerCustomProperties
    };
    return x`
        <div class="mdc-ripple-surface mdc-ripple-upgraded ${o(classes)}"
          style="${o2({
      "--mdc-ripple-fg-scale": this.fgScale,
      "--mdc-ripple-fg-size": this.fgSize,
      "--mdc-ripple-fg-translate-end": this.translateEnd,
      "--mdc-ripple-fg-translate-start": this.translateStart,
      "--mdc-ripple-left": this.leftPos,
      "--mdc-ripple-top": this.topPos
    })}"></div>`;
  }
};
__decorate([
  i(".mdc-ripple-surface")
], RippleBase.prototype, "mdcRoot", void 0);
__decorate([
  n({ type: Boolean })
], RippleBase.prototype, "primary", void 0);
__decorate([
  n({ type: Boolean })
], RippleBase.prototype, "accent", void 0);
__decorate([
  n({ type: Boolean })
], RippleBase.prototype, "unbounded", void 0);
__decorate([
  n({ type: Boolean })
], RippleBase.prototype, "disabled", void 0);
__decorate([
  n({ type: Boolean })
], RippleBase.prototype, "activated", void 0);
__decorate([
  n({ type: Boolean })
], RippleBase.prototype, "selected", void 0);
__decorate([
  n({ type: Boolean })
], RippleBase.prototype, "internalUseStateLayerCustomProperties", void 0);
__decorate([
  t()
], RippleBase.prototype, "hovering", void 0);
__decorate([
  t()
], RippleBase.prototype, "bgFocused", void 0);
__decorate([
  t()
], RippleBase.prototype, "fgActivation", void 0);
__decorate([
  t()
], RippleBase.prototype, "fgDeactivation", void 0);
__decorate([
  t()
], RippleBase.prototype, "fgScale", void 0);
__decorate([
  t()
], RippleBase.prototype, "fgSize", void 0);
__decorate([
  t()
], RippleBase.prototype, "translateStart", void 0);
__decorate([
  t()
], RippleBase.prototype, "translateEnd", void 0);
__decorate([
  t()
], RippleBase.prototype, "leftPos", void 0);
__decorate([
  t()
], RippleBase.prototype, "topPos", void 0);

// ../node_modules/@material/mwc-ripple/mwc-ripple.css.js
var styles2 = i2`.mdc-ripple-surface{--mdc-ripple-fg-size: 0;--mdc-ripple-left: 0;--mdc-ripple-top: 0;--mdc-ripple-fg-scale: 1;--mdc-ripple-fg-translate-end: 0;--mdc-ripple-fg-translate-start: 0;-webkit-tap-highlight-color:rgba(0,0,0,0);will-change:transform,opacity;position:relative;outline:none;overflow:hidden}.mdc-ripple-surface::before,.mdc-ripple-surface::after{position:absolute;border-radius:50%;opacity:0;pointer-events:none;content:""}.mdc-ripple-surface::before{transition:opacity 15ms linear,background-color 15ms linear;z-index:1;z-index:var(--mdc-ripple-z-index, 1)}.mdc-ripple-surface::after{z-index:0;z-index:var(--mdc-ripple-z-index, 0)}.mdc-ripple-surface.mdc-ripple-upgraded::before{transform:scale(var(--mdc-ripple-fg-scale, 1))}.mdc-ripple-surface.mdc-ripple-upgraded::after{top:0;left:0;transform:scale(0);transform-origin:center center}.mdc-ripple-surface.mdc-ripple-upgraded--unbounded::after{top:var(--mdc-ripple-top, 0);left:var(--mdc-ripple-left, 0)}.mdc-ripple-surface.mdc-ripple-upgraded--foreground-activation::after{animation:mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards}.mdc-ripple-surface.mdc-ripple-upgraded--foreground-deactivation::after{animation:mdc-ripple-fg-opacity-out 150ms;transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}.mdc-ripple-surface::before,.mdc-ripple-surface::after{top:calc(50% - 100%);left:calc(50% - 100%);width:200%;height:200%}.mdc-ripple-surface.mdc-ripple-upgraded::after{width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-ripple-surface[data-mdc-ripple-is-unbounded],.mdc-ripple-upgraded--unbounded{overflow:visible}.mdc-ripple-surface[data-mdc-ripple-is-unbounded]::before,.mdc-ripple-surface[data-mdc-ripple-is-unbounded]::after,.mdc-ripple-upgraded--unbounded::before,.mdc-ripple-upgraded--unbounded::after{top:calc(50% - 50%);left:calc(50% - 50%);width:100%;height:100%}.mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::before,.mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::after,.mdc-ripple-upgraded--unbounded.mdc-ripple-upgraded::before,.mdc-ripple-upgraded--unbounded.mdc-ripple-upgraded::after{top:var(--mdc-ripple-top, calc(50% - 50%));left:var(--mdc-ripple-left, calc(50% - 50%));width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::after,.mdc-ripple-upgraded--unbounded.mdc-ripple-upgraded::after{width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-ripple-surface::before,.mdc-ripple-surface::after{background-color:#000;background-color:var(--mdc-ripple-color, #000)}.mdc-ripple-surface:hover::before,.mdc-ripple-surface.mdc-ripple-surface--hover::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-ripple-surface.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-ripple-surface:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-ripple-surface.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}@keyframes mdc-ripple-fg-radius-in{from{animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transform:translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1)}to{transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}}@keyframes mdc-ripple-fg-opacity-in{from{animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity, 0)}}@keyframes mdc-ripple-fg-opacity-out{from{animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity, 0)}to{opacity:0}}:host{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;display:block}:host .mdc-ripple-surface{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;will-change:unset}.mdc-ripple-surface--primary::before,.mdc-ripple-surface--primary::after{background-color:#6200ee;background-color:var(--mdc-ripple-color, var(--mdc-theme-primary, #6200ee))}.mdc-ripple-surface--primary:hover::before,.mdc-ripple-surface--primary.mdc-ripple-surface--hover::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-ripple-surface--primary.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--primary:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-ripple-surface--primary:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--primary:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-ripple-surface--primary.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-ripple-surface--primary--activated::before{opacity:0.12;opacity:var(--mdc-ripple-activated-opacity, 0.12)}.mdc-ripple-surface--primary--activated::before,.mdc-ripple-surface--primary--activated::after{background-color:#6200ee;background-color:var(--mdc-ripple-color, var(--mdc-theme-primary, #6200ee))}.mdc-ripple-surface--primary--activated:hover::before,.mdc-ripple-surface--primary--activated.mdc-ripple-surface--hover::before{opacity:0.16;opacity:var(--mdc-ripple-hover-opacity, 0.16)}.mdc-ripple-surface--primary--activated.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--primary--activated:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.24;opacity:var(--mdc-ripple-focus-opacity, 0.24)}.mdc-ripple-surface--primary--activated:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--primary--activated:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.24;opacity:var(--mdc-ripple-press-opacity, 0.24)}.mdc-ripple-surface--primary--activated.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.24)}.mdc-ripple-surface--primary--selected::before{opacity:0.08;opacity:var(--mdc-ripple-selected-opacity, 0.08)}.mdc-ripple-surface--primary--selected::before,.mdc-ripple-surface--primary--selected::after{background-color:#6200ee;background-color:var(--mdc-ripple-color, var(--mdc-theme-primary, #6200ee))}.mdc-ripple-surface--primary--selected:hover::before,.mdc-ripple-surface--primary--selected.mdc-ripple-surface--hover::before{opacity:0.12;opacity:var(--mdc-ripple-hover-opacity, 0.12)}.mdc-ripple-surface--primary--selected.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--primary--selected:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.2;opacity:var(--mdc-ripple-focus-opacity, 0.2)}.mdc-ripple-surface--primary--selected:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--primary--selected:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.2;opacity:var(--mdc-ripple-press-opacity, 0.2)}.mdc-ripple-surface--primary--selected.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.2)}.mdc-ripple-surface--accent::before,.mdc-ripple-surface--accent::after{background-color:#018786;background-color:var(--mdc-ripple-color, var(--mdc-theme-secondary, #018786))}.mdc-ripple-surface--accent:hover::before,.mdc-ripple-surface--accent.mdc-ripple-surface--hover::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-ripple-surface--accent.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--accent:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-ripple-surface--accent:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--accent:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-ripple-surface--accent.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-ripple-surface--accent--activated::before{opacity:0.12;opacity:var(--mdc-ripple-activated-opacity, 0.12)}.mdc-ripple-surface--accent--activated::before,.mdc-ripple-surface--accent--activated::after{background-color:#018786;background-color:var(--mdc-ripple-color, var(--mdc-theme-secondary, #018786))}.mdc-ripple-surface--accent--activated:hover::before,.mdc-ripple-surface--accent--activated.mdc-ripple-surface--hover::before{opacity:0.16;opacity:var(--mdc-ripple-hover-opacity, 0.16)}.mdc-ripple-surface--accent--activated.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--accent--activated:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.24;opacity:var(--mdc-ripple-focus-opacity, 0.24)}.mdc-ripple-surface--accent--activated:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--accent--activated:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.24;opacity:var(--mdc-ripple-press-opacity, 0.24)}.mdc-ripple-surface--accent--activated.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.24)}.mdc-ripple-surface--accent--selected::before{opacity:0.08;opacity:var(--mdc-ripple-selected-opacity, 0.08)}.mdc-ripple-surface--accent--selected::before,.mdc-ripple-surface--accent--selected::after{background-color:#018786;background-color:var(--mdc-ripple-color, var(--mdc-theme-secondary, #018786))}.mdc-ripple-surface--accent--selected:hover::before,.mdc-ripple-surface--accent--selected.mdc-ripple-surface--hover::before{opacity:0.12;opacity:var(--mdc-ripple-hover-opacity, 0.12)}.mdc-ripple-surface--accent--selected.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--accent--selected:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.2;opacity:var(--mdc-ripple-focus-opacity, 0.2)}.mdc-ripple-surface--accent--selected:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--accent--selected:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.2;opacity:var(--mdc-ripple-press-opacity, 0.2)}.mdc-ripple-surface--accent--selected.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.2)}.mdc-ripple-surface--disabled{opacity:0}.mdc-ripple-surface--internal-use-state-layer-custom-properties::before,.mdc-ripple-surface--internal-use-state-layer-custom-properties::after{background-color:#000;background-color:var(--mdc-ripple-hover-state-layer-color, #000)}.mdc-ripple-surface--internal-use-state-layer-custom-properties:hover::before,.mdc-ripple-surface--internal-use-state-layer-custom-properties.mdc-ripple-surface--hover::before{opacity:0.04;opacity:var(--mdc-ripple-hover-state-layer-opacity, 0.04)}.mdc-ripple-surface--internal-use-state-layer-custom-properties.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--internal-use-state-layer-custom-properties:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-state-layer-opacity, 0.12)}.mdc-ripple-surface--internal-use-state-layer-custom-properties:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--internal-use-state-layer-custom-properties:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-pressed-state-layer-opacity, 0.12)}.mdc-ripple-surface--internal-use-state-layer-custom-properties.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-pressed-state-layer-opacity, 0.12)}`;

// ../node_modules/@material/mwc-ripple/mwc-ripple.js
var Ripple = class Ripple2 extends RippleBase {
};
Ripple.styles = [styles2];
Ripple = __decorate([
  e("mwc-ripple")
], Ripple);

// ../node_modules/@material/mwc-base/aria-property.js
function tsDecorator(prototype, name, descriptor) {
  const constructor = prototype.constructor;
  if (!descriptor) {
    const litInternalPropertyKey = `__${name}`;
    descriptor = constructor.getPropertyDescriptor(name, litInternalPropertyKey);
    if (!descriptor) {
      throw new Error("@ariaProperty must be used after a @property decorator");
    }
  }
  const propDescriptor = descriptor;
  let attribute = "";
  if (!propDescriptor.set) {
    throw new Error(`@ariaProperty requires a setter for ${name}`);
  }
  if (prototype.dispatchWizEvent) {
    return descriptor;
  }
  const wrappedDescriptor = {
    configurable: true,
    enumerable: true,
    set(value) {
      if (attribute === "") {
        const options = constructor.getPropertyOptions(name);
        attribute = typeof options.attribute === "string" ? options.attribute : name;
      }
      if (this.hasAttribute(attribute)) {
        this.removeAttribute(attribute);
      }
      propDescriptor.set.call(this, value);
    }
  };
  if (propDescriptor.get) {
    wrappedDescriptor.get = function() {
      return propDescriptor.get.call(this);
    };
  }
  return wrappedDescriptor;
}
function ariaProperty(protoOrDescriptor, name, descriptor) {
  if (name !== void 0) {
    return tsDecorator(protoOrDescriptor, name, descriptor);
  } else {
    throw new Error("@ariaProperty only supports TypeScript Decorators");
  }
}

// ../node_modules/@material/mwc-ripple/ripple-handlers.js
var RippleHandlers = class {
  constructor(rippleFn) {
    this.startPress = (ev) => {
      rippleFn().then((r2) => {
        r2 && r2.startPress(ev);
      });
    };
    this.endPress = () => {
      rippleFn().then((r2) => {
        r2 && r2.endPress();
      });
    };
    this.startFocus = () => {
      rippleFn().then((r2) => {
        r2 && r2.startFocus();
      });
    };
    this.endFocus = () => {
      rippleFn().then((r2) => {
        r2 && r2.endFocus();
      });
    };
    this.startHover = () => {
      rippleFn().then((r2) => {
        r2 && r2.startHover();
      });
    };
    this.endHover = () => {
      rippleFn().then((r2) => {
        r2 && r2.endHover();
      });
    };
  }
};

// ../node_modules/@material/mwc-icon-button/mwc-icon-button-base.js
var IconButtonBase = class extends s {
  constructor() {
    super(...arguments);
    this.disabled = false;
    this.icon = "";
    this.shouldRenderRipple = false;
    this.rippleHandlers = new RippleHandlers(() => {
      this.shouldRenderRipple = true;
      return this.ripple;
    });
  }
  /** @soyTemplate */
  renderRipple() {
    return this.shouldRenderRipple ? x`
            <mwc-ripple
                .disabled="${this.disabled}"
                unbounded>
            </mwc-ripple>` : "";
  }
  focus() {
    const buttonElement = this.buttonElement;
    if (buttonElement) {
      this.rippleHandlers.startFocus();
      buttonElement.focus();
    }
  }
  blur() {
    const buttonElement = this.buttonElement;
    if (buttonElement) {
      this.rippleHandlers.endFocus();
      buttonElement.blur();
    }
  }
  /** @soyTemplate */
  render() {
    return x`<button
        class="mdc-icon-button mdc-icon-button--display-flex"
        aria-label="${this.ariaLabel || this.icon}"
        aria-haspopup="${l2(this.ariaHasPopup)}"
        ?disabled="${this.disabled}"
        @focus="${this.handleRippleFocus}"
        @blur="${this.handleRippleBlur}"
        @mousedown="${this.handleRippleMouseDown}"
        @mouseenter="${this.handleRippleMouseEnter}"
        @mouseleave="${this.handleRippleMouseLeave}"
        @touchstart="${this.handleRippleTouchStart}"
        @touchend="${this.handleRippleDeactivate}"
        @touchcancel="${this.handleRippleDeactivate}"
    >${this.renderRipple()}
    ${this.icon ? x`<i class="material-icons">${this.icon}</i>` : ""}
    <span
      ><slot></slot
    ></span>
  </button>`;
  }
  handleRippleMouseDown(event) {
    const onUp = () => {
      window.removeEventListener("mouseup", onUp);
      this.handleRippleDeactivate();
    };
    window.addEventListener("mouseup", onUp);
    this.rippleHandlers.startPress(event);
  }
  handleRippleTouchStart(event) {
    this.rippleHandlers.startPress(event);
  }
  handleRippleDeactivate() {
    this.rippleHandlers.endPress();
  }
  handleRippleMouseEnter() {
    this.rippleHandlers.startHover();
  }
  handleRippleMouseLeave() {
    this.rippleHandlers.endHover();
  }
  handleRippleFocus() {
    this.rippleHandlers.startFocus();
  }
  handleRippleBlur() {
    this.rippleHandlers.endFocus();
  }
};
__decorate([
  n({ type: Boolean, reflect: true })
], IconButtonBase.prototype, "disabled", void 0);
__decorate([
  n({ type: String })
], IconButtonBase.prototype, "icon", void 0);
__decorate([
  ariaProperty,
  n({ type: String, attribute: "aria-label" })
], IconButtonBase.prototype, "ariaLabel", void 0);
__decorate([
  ariaProperty,
  n({ type: String, attribute: "aria-haspopup" })
], IconButtonBase.prototype, "ariaHasPopup", void 0);
__decorate([
  i("button")
], IconButtonBase.prototype, "buttonElement", void 0);
__decorate([
  e3("mwc-ripple")
], IconButtonBase.prototype, "ripple", void 0);
__decorate([
  t()
], IconButtonBase.prototype, "shouldRenderRipple", void 0);
__decorate([
  e2({ passive: true })
], IconButtonBase.prototype, "handleRippleMouseDown", null);
__decorate([
  e2({ passive: true })
], IconButtonBase.prototype, "handleRippleTouchStart", null);

// ../node_modules/@material/mwc-icon-button/mwc-icon-button.css.js
var styles3 = i2`.material-icons{font-family:var(--mdc-icon-font, "Material Icons");font-weight:normal;font-style:normal;font-size:var(--mdc-icon-size, 24px);line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-moz-osx-font-smoothing:grayscale;font-feature-settings:"liga"}.mdc-icon-button{font-size:24px;width:48px;height:48px;padding:12px}.mdc-icon-button .mdc-icon-button__focus-ring{display:none}.mdc-icon-button.mdc-ripple-upgraded--background-focused .mdc-icon-button__focus-ring,.mdc-icon-button:not(.mdc-ripple-upgraded):focus .mdc-icon-button__focus-ring{display:block;max-height:48px;max-width:48px}@media screen and (forced-colors: active){.mdc-icon-button.mdc-ripple-upgraded--background-focused .mdc-icon-button__focus-ring,.mdc-icon-button:not(.mdc-ripple-upgraded):focus .mdc-icon-button__focus-ring{pointer-events:none;border:2px solid transparent;border-radius:6px;box-sizing:content-box;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);height:100%;width:100%}}@media screen and (forced-colors: active)and (forced-colors: active){.mdc-icon-button.mdc-ripple-upgraded--background-focused .mdc-icon-button__focus-ring,.mdc-icon-button:not(.mdc-ripple-upgraded):focus .mdc-icon-button__focus-ring{border-color:CanvasText}}@media screen and (forced-colors: active){.mdc-icon-button.mdc-ripple-upgraded--background-focused .mdc-icon-button__focus-ring::after,.mdc-icon-button:not(.mdc-ripple-upgraded):focus .mdc-icon-button__focus-ring::after{content:"";border:2px solid transparent;border-radius:8px;display:block;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);height:calc(100% + 4px);width:calc(100% + 4px)}}@media screen and (forced-colors: active)and (forced-colors: active){.mdc-icon-button.mdc-ripple-upgraded--background-focused .mdc-icon-button__focus-ring::after,.mdc-icon-button:not(.mdc-ripple-upgraded):focus .mdc-icon-button__focus-ring::after{border-color:CanvasText}}.mdc-icon-button.mdc-icon-button--reduced-size .mdc-icon-button__ripple{width:40px;height:40px;margin-top:4px;margin-bottom:4px;margin-right:4px;margin-left:4px}.mdc-icon-button.mdc-icon-button--reduced-size.mdc-ripple-upgraded--background-focused .mdc-icon-button__focus-ring,.mdc-icon-button.mdc-icon-button--reduced-size:not(.mdc-ripple-upgraded):focus .mdc-icon-button__focus-ring{max-height:40px;max-width:40px}.mdc-icon-button .mdc-icon-button__touch{position:absolute;top:50%;height:48px;left:50%;width:48px;transform:translate(-50%, -50%)}.mdc-icon-button:disabled{color:rgba(0, 0, 0, 0.38);color:var(--mdc-theme-text-disabled-on-light, rgba(0, 0, 0, 0.38))}.mdc-icon-button svg,.mdc-icon-button img{width:24px;height:24px}.mdc-icon-button{display:inline-block;position:relative;box-sizing:border-box;border:none;outline:none;background-color:transparent;fill:currentColor;color:inherit;text-decoration:none;cursor:pointer;user-select:none;z-index:0;overflow:visible}.mdc-icon-button .mdc-icon-button__touch{position:absolute;top:50%;height:48px;left:50%;width:48px;transform:translate(-50%, -50%)}.mdc-icon-button:disabled{cursor:default;pointer-events:none}.mdc-icon-button--display-flex{align-items:center;display:inline-flex;justify-content:center}.mdc-icon-button__icon{display:inline-block}.mdc-icon-button__icon.mdc-icon-button__icon--on{display:none}.mdc-icon-button--on .mdc-icon-button__icon{display:none}.mdc-icon-button--on .mdc-icon-button__icon.mdc-icon-button__icon--on{display:inline-block}.mdc-icon-button__link{height:100%;left:0;outline:none;position:absolute;top:0;width:100%}.mdc-icon-button{display:inline-block;position:relative;box-sizing:border-box;border:none;outline:none;background-color:transparent;fill:currentColor;color:inherit;text-decoration:none;cursor:pointer;user-select:none;z-index:0;overflow:visible}.mdc-icon-button .mdc-icon-button__touch{position:absolute;top:50%;height:48px;left:50%;width:48px;transform:translate(-50%, -50%)}.mdc-icon-button:disabled{cursor:default;pointer-events:none}.mdc-icon-button--display-flex{align-items:center;display:inline-flex;justify-content:center}.mdc-icon-button__icon{display:inline-block}.mdc-icon-button__icon.mdc-icon-button__icon--on{display:none}.mdc-icon-button--on .mdc-icon-button__icon{display:none}.mdc-icon-button--on .mdc-icon-button__icon.mdc-icon-button__icon--on{display:inline-block}.mdc-icon-button__link{height:100%;left:0;outline:none;position:absolute;top:0;width:100%}:host{display:inline-block;outline:none}:host([disabled]){pointer-events:none}.mdc-icon-button i,.mdc-icon-button svg,.mdc-icon-button img,.mdc-icon-button ::slotted(*){display:block}:host{--mdc-ripple-color: currentcolor;-webkit-tap-highlight-color:transparent}:host,.mdc-icon-button{vertical-align:top}.mdc-icon-button{width:var(--mdc-icon-button-size, 48px);height:var(--mdc-icon-button-size, 48px);padding:calc( (var(--mdc-icon-button-size, 48px) - var(--mdc-icon-size, 24px)) / 2 )}.mdc-icon-button i,.mdc-icon-button svg,.mdc-icon-button img,.mdc-icon-button ::slotted(*){display:block;width:var(--mdc-icon-size, 24px);height:var(--mdc-icon-size, 24px)}`;

// ../node_modules/@material/mwc-icon-button/mwc-icon-button.js
var IconButton = class IconButton2 extends IconButtonBase {
};
IconButton.styles = [styles3];
IconButton = __decorate([
  e("mwc-icon-button")
], IconButton);

// ../node_modules/@material/mwc-linear-progress/mwc-linear-progress-base.js
var LinearProgressBase = class extends s {
  constructor() {
    super(...arguments);
    this.indeterminate = false;
    this.progress = 0;
    this.buffer = 1;
    this.reverse = false;
    this.closed = false;
    this.stylePrimaryHalf = "";
    this.stylePrimaryFull = "";
    this.styleSecondaryQuarter = "";
    this.styleSecondaryHalf = "";
    this.styleSecondaryFull = "";
    this.animationReady = true;
    this.closedAnimationOff = false;
    this.resizeObserver = null;
  }
  connectedCallback() {
    super.connectedCallback();
    if (this.rootEl) {
      this.attachResizeObserver();
    }
  }
  /**
   * @soyTemplate
   */
  render() {
    const classes = {
      "mdc-linear-progress--closed": this.closed,
      "mdc-linear-progress--closed-animation-off": this.closedAnimationOff,
      "mdc-linear-progress--indeterminate": this.indeterminate,
      // needed for controller-less render
      "mdc-linear-progress--animation-ready": this.animationReady
    };
    const rootStyles = {
      "--mdc-linear-progress-primary-half": this.stylePrimaryHalf,
      "--mdc-linear-progress-primary-half-neg": this.stylePrimaryHalf !== "" ? `-${this.stylePrimaryHalf}` : "",
      "--mdc-linear-progress-primary-full": this.stylePrimaryFull,
      "--mdc-linear-progress-primary-full-neg": this.stylePrimaryFull !== "" ? `-${this.stylePrimaryFull}` : "",
      "--mdc-linear-progress-secondary-quarter": this.styleSecondaryQuarter,
      "--mdc-linear-progress-secondary-quarter-neg": this.styleSecondaryQuarter !== "" ? `-${this.styleSecondaryQuarter}` : "",
      "--mdc-linear-progress-secondary-half": this.styleSecondaryHalf,
      "--mdc-linear-progress-secondary-half-neg": this.styleSecondaryHalf !== "" ? `-${this.styleSecondaryHalf}` : "",
      "--mdc-linear-progress-secondary-full": this.styleSecondaryFull,
      "--mdc-linear-progress-secondary-full-neg": this.styleSecondaryFull !== "" ? `-${this.styleSecondaryFull}` : ""
    };
    const bufferBarStyles = {
      "flex-basis": this.indeterminate ? "100%" : `${this.buffer * 100}%`
    };
    const primaryBarStyles = {
      transform: this.indeterminate ? "scaleX(1)" : `scaleX(${this.progress})`
    };
    return x`
      <div
          role="progressbar"
          class="mdc-linear-progress ${o(classes)}"
          style="${o2(rootStyles)}"
          dir="${l2(this.reverse ? "rtl" : void 0)}"
          aria-label="${l2(this.ariaLabel)}"
          aria-valuemin="0"
          aria-valuemax="1"
          aria-valuenow="${l2(this.indeterminate ? void 0 : this.progress)}"
        @transitionend="${this.syncClosedState}">
        <div class="mdc-linear-progress__buffer">
          <div
            class="mdc-linear-progress__buffer-bar"
            style=${o2(bufferBarStyles)}>
          </div>
          <div class="mdc-linear-progress__buffer-dots"></div>
        </div>
        <div
            class="mdc-linear-progress__bar mdc-linear-progress__primary-bar"
            style=${o2(primaryBarStyles)}>
          <span class="mdc-linear-progress__bar-inner"></span>
        </div>
        <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
          <span class="mdc-linear-progress__bar-inner"></span>
        </div>
      </div>`;
  }
  update(changedProperties) {
    if (changedProperties.has("closed") && (!this.closed || changedProperties.get("closed") === void 0)) {
      this.syncClosedState();
    }
    super.update(changedProperties);
  }
  async firstUpdated(changed) {
    super.firstUpdated(changed);
    this.attachResizeObserver();
  }
  syncClosedState() {
    this.closedAnimationOff = this.closed;
  }
  updated(changed) {
    if (!changed.has("indeterminate") && changed.has("reverse") && this.indeterminate) {
      this.restartAnimation();
    }
    if (changed.has("indeterminate") && changed.get("indeterminate") !== void 0 && this.indeterminate && window.ResizeObserver) {
      this.calculateAndSetAnimationDimensions(this.rootEl.offsetWidth);
    }
    super.updated(changed);
  }
  disconnectedCallback() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    super.disconnectedCallback();
  }
  attachResizeObserver() {
    if (window.ResizeObserver) {
      this.resizeObserver = new window.ResizeObserver((entries) => {
        if (!this.indeterminate) {
          return;
        }
        for (const entry of entries) {
          if (entry.contentRect) {
            const width = entry.contentRect.width;
            this.calculateAndSetAnimationDimensions(width);
          }
        }
      });
      this.resizeObserver.observe(this.rootEl);
      return;
    }
    this.resizeObserver = null;
  }
  calculateAndSetAnimationDimensions(width) {
    const primaryHalf = width * 0.8367142;
    const primaryFull = width * 2.00611057;
    const secondaryQuarter = width * 0.37651913;
    const secondaryHalf = width * 0.84386165;
    const secondaryFull = width * 1.60277782;
    this.stylePrimaryHalf = `${primaryHalf}px`;
    this.stylePrimaryFull = `${primaryFull}px`;
    this.styleSecondaryQuarter = `${secondaryQuarter}px`;
    this.styleSecondaryHalf = `${secondaryHalf}px`;
    this.styleSecondaryFull = `${secondaryFull}px`;
    this.restartAnimation();
  }
  async restartAnimation() {
    this.animationReady = false;
    await this.updateComplete;
    await new Promise(requestAnimationFrame);
    this.animationReady = true;
    await this.updateComplete;
  }
  open() {
    this.closed = false;
  }
  close() {
    this.closed = true;
  }
};
__decorate([
  i(".mdc-linear-progress")
], LinearProgressBase.prototype, "rootEl", void 0);
__decorate([
  n({ type: Boolean, reflect: true })
], LinearProgressBase.prototype, "indeterminate", void 0);
__decorate([
  n({ type: Number })
], LinearProgressBase.prototype, "progress", void 0);
__decorate([
  n({ type: Number })
], LinearProgressBase.prototype, "buffer", void 0);
__decorate([
  n({ type: Boolean, reflect: true })
], LinearProgressBase.prototype, "reverse", void 0);
__decorate([
  n({ type: Boolean, reflect: true })
], LinearProgressBase.prototype, "closed", void 0);
__decorate([
  ariaProperty,
  n({ attribute: "aria-label" })
], LinearProgressBase.prototype, "ariaLabel", void 0);
__decorate([
  t()
], LinearProgressBase.prototype, "stylePrimaryHalf", void 0);
__decorate([
  t()
], LinearProgressBase.prototype, "stylePrimaryFull", void 0);
__decorate([
  t()
], LinearProgressBase.prototype, "styleSecondaryQuarter", void 0);
__decorate([
  t()
], LinearProgressBase.prototype, "styleSecondaryHalf", void 0);
__decorate([
  t()
], LinearProgressBase.prototype, "styleSecondaryFull", void 0);
__decorate([
  t()
], LinearProgressBase.prototype, "animationReady", void 0);
__decorate([
  t()
], LinearProgressBase.prototype, "closedAnimationOff", void 0);

// ../node_modules/@material/mwc-linear-progress/mwc-linear-progress.css.js
var styles4 = i2`@keyframes mdc-linear-progress-primary-indeterminate-translate{0%{transform:translateX(0)}20%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(0)}59.15%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(83.67142%);transform:translateX(var(--mdc-linear-progress-primary-half, 83.67142%))}100%{transform:translateX(200.611057%);transform:translateX(var(--mdc-linear-progress-primary-full, 200.611057%))}}@keyframes mdc-linear-progress-primary-indeterminate-scale{0%{transform:scaleX(0.08)}36.65%{animation-timing-function:cubic-bezier(0.334731, 0.12482, 0.785844, 1);transform:scaleX(0.08)}69.15%{animation-timing-function:cubic-bezier(0.06, 0.11, 0.6, 1);transform:scaleX(0.661479)}100%{transform:scaleX(0.08)}}@keyframes mdc-linear-progress-secondary-indeterminate-translate{0%{animation-timing-function:cubic-bezier(0.15, 0, 0.515058, 0.409685);transform:translateX(0)}25%{animation-timing-function:cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);transform:translateX(37.651913%);transform:translateX(var(--mdc-linear-progress-secondary-quarter, 37.651913%))}48.35%{animation-timing-function:cubic-bezier(0.4, 0.627035, 0.6, 0.902026);transform:translateX(84.386165%);transform:translateX(var(--mdc-linear-progress-secondary-half, 84.386165%))}100%{transform:translateX(160.277782%);transform:translateX(var(--mdc-linear-progress-secondary-full, 160.277782%))}}@keyframes mdc-linear-progress-secondary-indeterminate-scale{0%{animation-timing-function:cubic-bezier(0.205028, 0.057051, 0.57661, 0.453971);transform:scaleX(0.08)}19.15%{animation-timing-function:cubic-bezier(0.152313, 0.196432, 0.648374, 1.004315);transform:scaleX(0.457104)}44.15%{animation-timing-function:cubic-bezier(0.257759, -0.003163, 0.211762, 1.38179);transform:scaleX(0.72796)}100%{transform:scaleX(0.08)}}@keyframes mdc-linear-progress-buffering{from{transform:rotate(180deg) translateX(-10px)}}@keyframes mdc-linear-progress-primary-indeterminate-translate-reverse{0%{transform:translateX(0)}20%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(0)}59.15%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(-83.67142%);transform:translateX(var(--mdc-linear-progress-primary-half-neg, -83.67142%))}100%{transform:translateX(-200.611057%);transform:translateX(var(--mdc-linear-progress-primary-full-neg, -200.611057%))}}@keyframes mdc-linear-progress-secondary-indeterminate-translate-reverse{0%{animation-timing-function:cubic-bezier(0.15, 0, 0.515058, 0.409685);transform:translateX(0)}25%{animation-timing-function:cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);transform:translateX(-37.651913%);transform:translateX(var(--mdc-linear-progress-secondary-quarter-neg, -37.651913%))}48.35%{animation-timing-function:cubic-bezier(0.4, 0.627035, 0.6, 0.902026);transform:translateX(-84.386165%);transform:translateX(var(--mdc-linear-progress-secondary-half-neg, -84.386165%))}100%{transform:translateX(-160.277782%);transform:translateX(var(--mdc-linear-progress-secondary-full-neg, -160.277782%))}}@keyframes mdc-linear-progress-buffering-reverse{from{transform:translateX(-10px)}}.mdc-linear-progress{position:relative;width:100%;transform:translateZ(0);outline:1px solid transparent;overflow:hidden;transition:opacity 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}@media screen and (forced-colors: active){.mdc-linear-progress{outline-color:CanvasText}}.mdc-linear-progress__bar{position:absolute;width:100%;height:100%;animation:none;transform-origin:top left;transition:transform 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-linear-progress__bar-inner{display:inline-block;position:absolute;width:100%;animation:none;border-top-style:solid}.mdc-linear-progress__buffer{display:flex;position:absolute;width:100%;height:100%}.mdc-linear-progress__buffer-dots{background-repeat:repeat-x;flex:auto;transform:rotate(180deg);animation:mdc-linear-progress-buffering 250ms infinite linear}.mdc-linear-progress__buffer-bar{flex:0 1 100%;transition:flex-basis 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-linear-progress__primary-bar{transform:scaleX(0)}.mdc-linear-progress__secondary-bar{display:none}.mdc-linear-progress--indeterminate .mdc-linear-progress__bar{transition:none}.mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar{left:-145.166611%}.mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar{left:-54.888891%;display:block}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar{animation:mdc-linear-progress-primary-indeterminate-translate 2s infinite linear}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar>.mdc-linear-progress__bar-inner{animation:mdc-linear-progress-primary-indeterminate-scale 2s infinite linear}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar{animation:mdc-linear-progress-secondary-indeterminate-translate 2s infinite linear}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar>.mdc-linear-progress__bar-inner{animation:mdc-linear-progress-secondary-indeterminate-scale 2s infinite linear}[dir=rtl] .mdc-linear-progress:not([dir=ltr]) .mdc-linear-progress__bar,.mdc-linear-progress[dir=rtl]:not([dir=ltr]) .mdc-linear-progress__bar{right:0;-webkit-transform-origin:center right;transform-origin:center right}[dir=rtl] .mdc-linear-progress:not([dir=ltr]).mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar,.mdc-linear-progress[dir=rtl]:not([dir=ltr]).mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar{animation-name:mdc-linear-progress-primary-indeterminate-translate-reverse}[dir=rtl] .mdc-linear-progress:not([dir=ltr]).mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar,.mdc-linear-progress[dir=rtl]:not([dir=ltr]).mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar{animation-name:mdc-linear-progress-secondary-indeterminate-translate-reverse}[dir=rtl] .mdc-linear-progress:not([dir=ltr]) .mdc-linear-progress__buffer-dots,.mdc-linear-progress[dir=rtl]:not([dir=ltr]) .mdc-linear-progress__buffer-dots{animation:mdc-linear-progress-buffering-reverse 250ms infinite linear;transform:rotate(0)}[dir=rtl] .mdc-linear-progress:not([dir=ltr]).mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar,.mdc-linear-progress[dir=rtl]:not([dir=ltr]).mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar{right:-145.166611%;left:auto}[dir=rtl] .mdc-linear-progress:not([dir=ltr]).mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar,.mdc-linear-progress[dir=rtl]:not([dir=ltr]).mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar{right:-54.888891%;left:auto}.mdc-linear-progress--closed{opacity:0}.mdc-linear-progress--closed-animation-off .mdc-linear-progress__buffer-dots{animation:none}.mdc-linear-progress--closed-animation-off.mdc-linear-progress--indeterminate .mdc-linear-progress__bar,.mdc-linear-progress--closed-animation-off.mdc-linear-progress--indeterminate .mdc-linear-progress__bar .mdc-linear-progress__bar-inner{animation:none}.mdc-linear-progress__bar-inner{border-color:#6200ee;border-color:var(--mdc-theme-primary, #6200ee)}.mdc-linear-progress__buffer-dots{background-image:url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' enable-background='new 0 0 5 2' xml:space='preserve' viewBox='0 0 5 2' preserveAspectRatio='none slice'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23e6e6e6'/%3E%3C/svg%3E")}.mdc-linear-progress__buffer-bar{background-color:#e6e6e6}.mdc-linear-progress{height:4px}.mdc-linear-progress__bar-inner{border-top-width:4px}.mdc-linear-progress__buffer-dots{background-size:10px 4px}:host{display:block}.mdc-linear-progress__buffer-bar{background-color:#e6e6e6;background-color:var(--mdc-linear-progress-buffer-color, #e6e6e6)}.mdc-linear-progress__buffer-dots{background-image:url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' enable-background='new 0 0 5 2' xml:space='preserve' viewBox='0 0 5 2' preserveAspectRatio='none slice'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23e6e6e6'/%3E%3C/svg%3E");background-image:var(--mdc-linear-progress-buffering-dots-image, url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' enable-background='new 0 0 5 2' xml:space='preserve' viewBox='0 0 5 2' preserveAspectRatio='none slice'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23e6e6e6'/%3E%3C/svg%3E"))}`;

// ../node_modules/@material/mwc-linear-progress/mwc-linear-progress.js
var LinearProgress = class LinearProgress2 extends LinearProgressBase {
};
LinearProgress.styles = [styles4];
LinearProgress = __decorate([
  e("mwc-linear-progress")
], LinearProgress);

// ../node_modules/playground-elements/playground-preview.js
var PlaygroundPreview = class PlaygroundPreview2 extends PlaygroundConnectedElement {
  constructor() {
    super();
    this.htmlFile = "index.html";
    this.location = "Result";
    this._loading = true;
    this._showLoadingBar = false;
    this._loadedAtLeastOnce = false;
    this.reload = () => {
      const iframe = this.iframe;
      if (!iframe) {
        return;
      }
      const { parentNode, nextSibling } = iframe;
      if (parentNode) {
        iframe.remove();
      }
      iframe.src = "";
      iframe.src = this._indexUrl;
      if (parentNode) {
        parentNode.insertBefore(iframe, nextSibling);
      }
      this._loading = true;
      this._showLoadingBar = true;
    };
    if (navigator.serviceWorker === void 0) {
      this._error = x`<p>
          <b>Sorry!</b> Preview unavailable because this browser doesn't
          <a
            href="https://caniuse.com/serviceworkers"
            target="_blank"
            rel="noopener"
            >support</a
          >
          service workers.
        </p>
        <p>
          <i
            >Note: Firefox
            <a
              href="https://bugzilla.mozilla.org/show_bug.cgi?id=1320796"
              target="_blank"
              rel="noopener"
              >doesn't</a
            >
            support service workers in private browsing mode.</i
          >
        </p> `;
    }
  }
  update(changedProperties) {
    if (changedProperties.has("_project")) {
      const oldProject = changedProperties.get("_project");
      if (oldProject) {
        oldProject.removeEventListener("urlChanged", this.reload);
        oldProject.removeEventListener("compileStart", this.reload);
      }
      if (this._project) {
        this._project.addEventListener("urlChanged", this.reload);
        this._project.addEventListener("compileStart", this.reload);
      }
    }
    super.update(changedProperties);
  }
  get _indexUrl() {
    var _a;
    const base = (_a = this._project) === null || _a === void 0 ? void 0 : _a.baseUrl;
    if (!base || !this.htmlFile) {
      return "";
    }
    const url = new URL(this.htmlFile, base);
    return url.toString();
  }
  render() {
    return x`
      <div id="toolbar" part="preview-toolbar">
        <span id="location" part="preview-location"> ${this.location}</span>
        <mwc-icon-button
          id="reload-button"
          aria-label="Reload preview"
          part="preview-reload-button"
          ?disabled=${!this._indexUrl}
          @click=${this.reload}
        >
          <!-- Source: https://material.io/resources/icons/?icon=refresh&style=baseline -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentcolor"
            width="18px"
            height="18px"
          >
            <path
              d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
            />
          </svg>
        </mwc-icon-button>
      </div>

      <div id="content" class=${o({ error: !!this._error })}>
        <mwc-linear-progress
          aria-hidden=${this._loading ? "false" : "true"}
          part="preview-loading-indicator"
          indeterminate
          ?closed=${!this._showLoadingBar}
        ></mwc-linear-progress>

        ${this._loadedAtLeastOnce ? A : x`<slot></slot>`}

        <iframe
          title="Project preview"
          @load=${this._onIframeLoad}
          ?hidden=${!this._loadedAtLeastOnce}
        ></iframe>
      </div>

      ${this._error ? x`
            <playground-internal-overlay id="error">
              ${this._error}</playground-internal-overlay
            >
          ` : A}
    `;
  }
  updated() {
    if (this.iframe && this.iframe.src !== this._indexUrl) {
      this.iframe.src = this._indexUrl;
    }
  }
  async firstUpdated() {
    var _a, _b;
    if (this._loading && !this._slotHasAnyVisibleChildren()) {
      this._showLoadingBar = true;
    }
    const progress = this.shadowRoot.querySelector("mwc-linear-progress");
    await progress.updateComplete;
    (_b = (_a = progress.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("[role=progressbar]")) === null || _b === void 0 ? void 0 : _b.setAttribute("aria-label", "Preview is loading");
  }
  _slotHasAnyVisibleChildren() {
    var _a;
    const assigned = (_a = this._slot) === null || _a === void 0 ? void 0 : _a.assignedNodes({ flatten: true });
    if (!assigned) {
      return false;
    }
    for (const node of assigned) {
      if (node.nodeType === Node.COMMENT_NODE) {
        continue;
      }
      if (node.nodeType === Node.TEXT_NODE && (node.textContent || "").trim() === "") {
        continue;
      }
      return true;
    }
    return false;
  }
  _onIframeLoad() {
    if (this._indexUrl) {
      this._loading = false;
      this._loadedAtLeastOnce = true;
      this._showLoadingBar = false;
    }
  }
};
PlaygroundPreview.styles = i2`
    :host {
      display: flex;
      flex-direction: column;
      background: white;
      font-family: sans-serif;
      height: 350px;
      position: relative; /* for the error message overlay */
    }

    #toolbar {
      flex: 0 0 var(--playground-bar-height, 40px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: var(--playground-border, solid 1px #ddd);
      font-size: 15px;
      color: var(--playground-preview-toolbar-foreground-color, #444);
      border-radius: inherit;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      background: var(--playground-preview-toolbar-background, white);
    }

    #location {
      margin: 0 10px;
    }

    #reload-button {
      --mdc-icon-button-size: 30px;
      --mdc-icon-size: 18px;
    }

    #content {
      max-height: 100%;
      position: relative;
      flex: 1;
    }

    #content.error {
      display: none;
    }

    #error {
      padding: 0 20px;
    }

    mwc-linear-progress {
      /* There is no way to directly specify the height of a linear progress
      bar, but zooming works well enough. It's 4px by default, and we want it to
      be 2px to match the tab bar indicator.*/
      zoom: 0.5;
      --mdc-linear-progress-buffer-color: transparent;
      position: absolute;
      top: -6px;
      width: 100%;
      --mdc-theme-primary: var(--playground-highlight-color, #6200ee);
    }

    iframe,
    slot {
      width: 100%;
      height: 100%;
    }

    iframe {
      border: none;
    }

    [hidden] {
      display: none;
    }
  `;
__decorate([
  n({ attribute: "html-file" })
], PlaygroundPreview.prototype, "htmlFile", void 0);
__decorate([
  n()
], PlaygroundPreview.prototype, "location", void 0);
__decorate([
  i("iframe", true)
], PlaygroundPreview.prototype, "iframe", void 0);
__decorate([
  i("slot")
], PlaygroundPreview.prototype, "_slot", void 0);
__decorate([
  t()
], PlaygroundPreview.prototype, "_loading", void 0);
__decorate([
  t()
], PlaygroundPreview.prototype, "_showLoadingBar", void 0);
__decorate([
  t()
], PlaygroundPreview.prototype, "_loadedAtLeastOnce", void 0);
__decorate([
  t()
], PlaygroundPreview.prototype, "_error", void 0);
PlaygroundPreview = __decorate([
  e("playground-preview")
], PlaygroundPreview);

// ../node_modules/comlink/dist/esm/comlink.mjs
var proxyMarker = /* @__PURE__ */ Symbol("Comlink.proxy");
var createEndpoint = /* @__PURE__ */ Symbol("Comlink.endpoint");
var releaseProxy = /* @__PURE__ */ Symbol("Comlink.releaseProxy");
var throwMarker = /* @__PURE__ */ Symbol("Comlink.thrown");
var isObject = (val) => typeof val === "object" && val !== null || typeof val === "function";
var proxyTransferHandler = {
  canHandle: (val) => isObject(val) && val[proxyMarker],
  serialize(obj) {
    const { port1, port2 } = new MessageChannel();
    expose(obj, port1);
    return [port2, [port2]];
  },
  deserialize(port) {
    port.start();
    return wrap(port);
  }
};
var throwTransferHandler = {
  canHandle: (value) => isObject(value) && throwMarker in value,
  serialize({ value }) {
    let serialized;
    if (value instanceof Error) {
      serialized = {
        isError: true,
        value: {
          message: value.message,
          name: value.name,
          stack: value.stack
        }
      };
    } else {
      serialized = { isError: false, value };
    }
    return [serialized, []];
  },
  deserialize(serialized) {
    if (serialized.isError) {
      throw Object.assign(new Error(serialized.value.message), serialized.value);
    }
    throw serialized.value;
  }
};
var transferHandlers = /* @__PURE__ */ new Map([
  ["proxy", proxyTransferHandler],
  ["throw", throwTransferHandler]
]);
function expose(obj, ep = self) {
  ep.addEventListener("message", function callback(ev) {
    if (!ev || !ev.data) {
      return;
    }
    const { id, type, path } = Object.assign({ path: [] }, ev.data);
    const argumentList = (ev.data.argumentList || []).map(fromWireValue);
    let returnValue;
    try {
      const parent = path.slice(0, -1).reduce((obj2, prop) => obj2[prop], obj);
      const rawValue = path.reduce((obj2, prop) => obj2[prop], obj);
      switch (type) {
        case "GET":
          {
            returnValue = rawValue;
          }
          break;
        case "SET":
          {
            parent[path.slice(-1)[0]] = fromWireValue(ev.data.value);
            returnValue = true;
          }
          break;
        case "APPLY":
          {
            returnValue = rawValue.apply(parent, argumentList);
          }
          break;
        case "CONSTRUCT":
          {
            const value = new rawValue(...argumentList);
            returnValue = proxy(value);
          }
          break;
        case "ENDPOINT":
          {
            const { port1, port2 } = new MessageChannel();
            expose(obj, port2);
            returnValue = transfer(port1, [port1]);
          }
          break;
        case "RELEASE":
          {
            returnValue = void 0;
          }
          break;
        default:
          return;
      }
    } catch (value) {
      returnValue = { value, [throwMarker]: 0 };
    }
    Promise.resolve(returnValue).catch((value) => {
      return { value, [throwMarker]: 0 };
    }).then((returnValue2) => {
      const [wireValue, transferables] = toWireValue(returnValue2);
      ep.postMessage(Object.assign(Object.assign({}, wireValue), { id }), transferables);
      if (type === "RELEASE") {
        ep.removeEventListener("message", callback);
        closeEndPoint(ep);
      }
    });
  });
  if (ep.start) {
    ep.start();
  }
}
function isMessagePort(endpoint) {
  return endpoint.constructor.name === "MessagePort";
}
function closeEndPoint(endpoint) {
  if (isMessagePort(endpoint))
    endpoint.close();
}
function wrap(ep, target) {
  return createProxy(ep, [], target);
}
function throwIfProxyReleased(isReleased) {
  if (isReleased) {
    throw new Error("Proxy has been released and is not useable");
  }
}
function createProxy(ep, path = [], target = function() {
}) {
  let isProxyReleased = false;
  const proxy2 = new Proxy(target, {
    get(_target, prop) {
      throwIfProxyReleased(isProxyReleased);
      if (prop === releaseProxy) {
        return () => {
          return requestResponseMessage(ep, {
            type: "RELEASE",
            path: path.map((p) => p.toString())
          }).then(() => {
            closeEndPoint(ep);
            isProxyReleased = true;
          });
        };
      }
      if (prop === "then") {
        if (path.length === 0) {
          return { then: () => proxy2 };
        }
        const r2 = requestResponseMessage(ep, {
          type: "GET",
          path: path.map((p) => p.toString())
        }).then(fromWireValue);
        return r2.then.bind(r2);
      }
      return createProxy(ep, [...path, prop]);
    },
    set(_target, prop, rawValue) {
      throwIfProxyReleased(isProxyReleased);
      const [value, transferables] = toWireValue(rawValue);
      return requestResponseMessage(ep, {
        type: "SET",
        path: [...path, prop].map((p) => p.toString()),
        value
      }, transferables).then(fromWireValue);
    },
    apply(_target, _thisArg, rawArgumentList) {
      throwIfProxyReleased(isProxyReleased);
      const last = path[path.length - 1];
      if (last === createEndpoint) {
        return requestResponseMessage(ep, {
          type: "ENDPOINT"
        }).then(fromWireValue);
      }
      if (last === "bind") {
        return createProxy(ep, path.slice(0, -1));
      }
      const [argumentList, transferables] = processArguments(rawArgumentList);
      return requestResponseMessage(ep, {
        type: "APPLY",
        path: path.map((p) => p.toString()),
        argumentList
      }, transferables).then(fromWireValue);
    },
    construct(_target, rawArgumentList) {
      throwIfProxyReleased(isProxyReleased);
      const [argumentList, transferables] = processArguments(rawArgumentList);
      return requestResponseMessage(ep, {
        type: "CONSTRUCT",
        path: path.map((p) => p.toString()),
        argumentList
      }, transferables).then(fromWireValue);
    }
  });
  return proxy2;
}
function myFlat(arr) {
  return Array.prototype.concat.apply([], arr);
}
function processArguments(argumentList) {
  const processed = argumentList.map(toWireValue);
  return [processed.map((v) => v[0]), myFlat(processed.map((v) => v[1]))];
}
var transferCache = /* @__PURE__ */ new WeakMap();
function transfer(obj, transfers) {
  transferCache.set(obj, transfers);
  return obj;
}
function proxy(obj) {
  return Object.assign(obj, { [proxyMarker]: true });
}
function toWireValue(value) {
  for (const [name, handler] of transferHandlers) {
    if (handler.canHandle(value)) {
      const [serializedValue, transferables] = handler.serialize(value);
      return [
        {
          type: "HANDLER",
          name,
          value: serializedValue
        },
        transferables
      ];
    }
  }
  return [
    {
      type: "RAW",
      value
    },
    transferCache.get(value) || []
  ];
}
function fromWireValue(value) {
  switch (value.type) {
    case "HANDLER":
      return transferHandlers.get(value.name).deserialize(value.value);
    case "RAW":
      return value.value;
  }
}
function requestResponseMessage(ep, msg, transfers) {
  return new Promise((resolve) => {
    const id = generateUUID();
    ep.addEventListener("message", function l3(ev) {
      if (!ev.data || !ev.data.id || ev.data.id !== id) {
        return;
      }
      ep.removeEventListener("message", l3);
      resolve(ev.data);
    });
    if (ep.start) {
      ep.start();
    }
    ep.postMessage(Object.assign({ id }, msg), transfers);
  });
}
function generateUUID() {
  return new Array(4).fill(0).map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)).join("-");
}

// ../node_modules/playground-elements/shared/worker-api.js
var CONFIGURE_PROXY = 1;
var CONNECT_PROJECT_TO_SW = 3;
var ACKNOWLEDGE_SW_CONNECTION = 4;
var UPDATE_SERVICE_WORKER = 6;

// ../node_modules/playground-elements/shared/util.js
var endWithSlash = (s2) => s2.endsWith("/") ? s2 : s2 + "/";
var getRandomString = () => crypto.getRandomValues(new Uint32Array(1))[0].toString(32);
var forceSkypackRawMode = (url) => {
  if (url.hostname === "cdn.skypack.dev") {
    url.pathname = url.pathname.replace(/mode=imports\/(un)?optimized/, "mode=raw");
  }
  return url;
};

// ../node_modules/fuse.js/dist/fuse.esm.js
function isArray(value) {
  return !Array.isArray ? getTag(value) === "[object Array]" : Array.isArray(value);
}
var INFINITY = 1 / 0;
function baseToString(value) {
  if (typeof value == "string") {
    return value;
  }
  let result = value + "";
  return result == "0" && 1 / value == -INFINITY ? "-0" : result;
}
function toString(value) {
  return value == null ? "" : baseToString(value);
}
function isString(value) {
  return typeof value === "string";
}
function isNumber(value) {
  return typeof value === "number";
}
function isBoolean(value) {
  return value === true || value === false || isObjectLike(value) && getTag(value) == "[object Boolean]";
}
function isObject2(value) {
  return typeof value === "object";
}
function isObjectLike(value) {
  return isObject2(value) && value !== null;
}
function isDefined(value) {
  return value !== void 0 && value !== null;
}
function isBlank(value) {
  return !value.trim().length;
}
function getTag(value) {
  return value == null ? value === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(value);
}
var INCORRECT_INDEX_TYPE = "Incorrect 'index' type";
var LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY = (key) => `Invalid value for key ${key}`;
var PATTERN_LENGTH_TOO_LARGE = (max) => `Pattern length exceeds max of ${max}.`;
var MISSING_KEY_PROPERTY = (name) => `Missing ${name} property in key`;
var INVALID_KEY_WEIGHT_VALUE = (key) => `Property 'weight' in key '${key}' must be a positive integer`;
var hasOwn = Object.prototype.hasOwnProperty;
var KeyStore = class {
  constructor(keys) {
    this._keys = [];
    this._keyMap = {};
    let totalWeight = 0;
    keys.forEach((key) => {
      let obj = createKey(key);
      totalWeight += obj.weight;
      this._keys.push(obj);
      this._keyMap[obj.id] = obj;
      totalWeight += obj.weight;
    });
    this._keys.forEach((key) => {
      key.weight /= totalWeight;
    });
  }
  get(keyId) {
    return this._keyMap[keyId];
  }
  keys() {
    return this._keys;
  }
  toJSON() {
    return JSON.stringify(this._keys);
  }
};
function createKey(key) {
  let path = null;
  let id = null;
  let src = null;
  let weight = 1;
  let getFn = null;
  if (isString(key) || isArray(key)) {
    src = key;
    path = createKeyPath(key);
    id = createKeyId(key);
  } else {
    if (!hasOwn.call(key, "name")) {
      throw new Error(MISSING_KEY_PROPERTY("name"));
    }
    const name = key.name;
    src = name;
    if (hasOwn.call(key, "weight")) {
      weight = key.weight;
      if (weight <= 0) {
        throw new Error(INVALID_KEY_WEIGHT_VALUE(name));
      }
    }
    path = createKeyPath(name);
    id = createKeyId(name);
    getFn = key.getFn;
  }
  return { path, id, weight, src, getFn };
}
function createKeyPath(key) {
  return isArray(key) ? key : key.split(".");
}
function createKeyId(key) {
  return isArray(key) ? key.join(".") : key;
}
function get(obj, path) {
  let list = [];
  let arr = false;
  const deepGet = (obj2, path2, index) => {
    if (!isDefined(obj2)) {
      return;
    }
    if (!path2[index]) {
      list.push(obj2);
    } else {
      let key = path2[index];
      const value = obj2[key];
      if (!isDefined(value)) {
        return;
      }
      if (index === path2.length - 1 && (isString(value) || isNumber(value) || isBoolean(value))) {
        list.push(toString(value));
      } else if (isArray(value)) {
        arr = true;
        for (let i4 = 0, len = value.length; i4 < len; i4 += 1) {
          deepGet(value[i4], path2, index + 1);
        }
      } else if (path2.length) {
        deepGet(value, path2, index + 1);
      }
    }
  };
  deepGet(obj, isString(path) ? path.split(".") : path, 0);
  return arr ? list : list[0];
}
var MatchOptions = {
  // Whether the matches should be included in the result set. When `true`, each record in the result
  // set will include the indices of the matched characters.
  // These can consequently be used for highlighting purposes.
  includeMatches: false,
  // When `true`, the matching function will continue to the end of a search pattern even if
  // a perfect match has already been located in the string.
  findAllMatches: false,
  // Minimum number of characters that must be matched before a result is considered a match
  minMatchCharLength: 1
};
var BasicOptions = {
  // When `true`, the algorithm continues searching to the end of the input even if a perfect
  // match is found before the end of the same input.
  isCaseSensitive: false,
  // When true, the matching function will continue to the end of a search pattern even if
  includeScore: false,
  // List of properties that will be searched. This also supports nested properties.
  keys: [],
  // Whether to sort the result list, by score
  shouldSort: true,
  // Default sort function: sort by ascending score, ascending index
  sortFn: (a, b) => a.score === b.score ? a.idx < b.idx ? -1 : 1 : a.score < b.score ? -1 : 1
};
var FuzzyOptions = {
  // Approximately where in the text is the pattern expected to be found?
  location: 0,
  // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
  // (of both letters and location), a threshold of '1.0' would match anything.
  threshold: 0.6,
  // Determines how close the match must be to the fuzzy location (specified above).
  // An exact letter match which is 'distance' characters away from the fuzzy location
  // would score as a complete mismatch. A distance of '0' requires the match be at
  // the exact location specified, a threshold of '1000' would require a perfect match
  // to be within 800 characters of the fuzzy location to be found using a 0.8 threshold.
  distance: 100
};
var AdvancedOptions = {
  // When `true`, it enables the use of unix-like search commands
  useExtendedSearch: false,
  // The get function to use when fetching an object's properties.
  // The default will search nested paths *ie foo.bar.baz*
  getFn: get,
  // When `true`, search will ignore `location` and `distance`, so it won't matter
  // where in the string the pattern appears.
  // More info: https://fusejs.io/concepts/scoring-theory.html#fuzziness-score
  ignoreLocation: false,
  // When `true`, the calculation for the relevance score (used for sorting) will
  // ignore the field-length norm.
  // More info: https://fusejs.io/concepts/scoring-theory.html#field-length-norm
  ignoreFieldNorm: false,
  // The weight to determine how much field length norm effects scoring.
  fieldNormWeight: 1
};
var Config = {
  ...BasicOptions,
  ...MatchOptions,
  ...FuzzyOptions,
  ...AdvancedOptions
};
var SPACE = /[^ ]+/g;
function norm(weight = 1, mantissa = 3) {
  const cache = /* @__PURE__ */ new Map();
  const m = Math.pow(10, mantissa);
  return {
    get(value) {
      const numTokens = value.match(SPACE).length;
      if (cache.has(numTokens)) {
        return cache.get(numTokens);
      }
      const norm2 = 1 / Math.pow(numTokens, 0.5 * weight);
      const n3 = parseFloat(Math.round(norm2 * m) / m);
      cache.set(numTokens, n3);
      return n3;
    },
    clear() {
      cache.clear();
    }
  };
}
var FuseIndex = class {
  constructor({
    getFn = Config.getFn,
    fieldNormWeight = Config.fieldNormWeight
  } = {}) {
    this.norm = norm(fieldNormWeight, 3);
    this.getFn = getFn;
    this.isCreated = false;
    this.setIndexRecords();
  }
  setSources(docs = []) {
    this.docs = docs;
  }
  setIndexRecords(records = []) {
    this.records = records;
  }
  setKeys(keys = []) {
    this.keys = keys;
    this._keysMap = {};
    keys.forEach((key, idx) => {
      this._keysMap[key.id] = idx;
    });
  }
  create() {
    if (this.isCreated || !this.docs.length) {
      return;
    }
    this.isCreated = true;
    if (isString(this.docs[0])) {
      this.docs.forEach((doc, docIndex) => {
        this._addString(doc, docIndex);
      });
    } else {
      this.docs.forEach((doc, docIndex) => {
        this._addObject(doc, docIndex);
      });
    }
    this.norm.clear();
  }
  // Adds a doc to the end of the index
  add(doc) {
    const idx = this.size();
    if (isString(doc)) {
      this._addString(doc, idx);
    } else {
      this._addObject(doc, idx);
    }
  }
  // Removes the doc at the specified index of the index
  removeAt(idx) {
    this.records.splice(idx, 1);
    for (let i4 = idx, len = this.size(); i4 < len; i4 += 1) {
      this.records[i4].i -= 1;
    }
  }
  getValueForItemAtKeyId(item, keyId) {
    return item[this._keysMap[keyId]];
  }
  size() {
    return this.records.length;
  }
  _addString(doc, docIndex) {
    if (!isDefined(doc) || isBlank(doc)) {
      return;
    }
    let record = {
      v: doc,
      i: docIndex,
      n: this.norm.get(doc)
    };
    this.records.push(record);
  }
  _addObject(doc, docIndex) {
    let record = { i: docIndex, $: {} };
    this.keys.forEach((key, keyIndex) => {
      let value = key.getFn ? key.getFn(doc) : this.getFn(doc, key.path);
      if (!isDefined(value)) {
        return;
      }
      if (isArray(value)) {
        let subRecords = [];
        const stack = [{ nestedArrIndex: -1, value }];
        while (stack.length) {
          const { nestedArrIndex, value: value2 } = stack.pop();
          if (!isDefined(value2)) {
            continue;
          }
          if (isString(value2) && !isBlank(value2)) {
            let subRecord = {
              v: value2,
              i: nestedArrIndex,
              n: this.norm.get(value2)
            };
            subRecords.push(subRecord);
          } else if (isArray(value2)) {
            value2.forEach((item, k) => {
              stack.push({
                nestedArrIndex: k,
                value: item
              });
            });
          } else ;
        }
        record.$[keyIndex] = subRecords;
      } else if (isString(value) && !isBlank(value)) {
        let subRecord = {
          v: value,
          n: this.norm.get(value)
        };
        record.$[keyIndex] = subRecord;
      }
    });
    this.records.push(record);
  }
  toJSON() {
    return {
      keys: this.keys,
      records: this.records
    };
  }
};
function createIndex(keys, docs, { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}) {
  const myIndex = new FuseIndex({ getFn, fieldNormWeight });
  myIndex.setKeys(keys.map(createKey));
  myIndex.setSources(docs);
  myIndex.create();
  return myIndex;
}
function parseIndex(data, { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}) {
  const { keys, records } = data;
  const myIndex = new FuseIndex({ getFn, fieldNormWeight });
  myIndex.setKeys(keys);
  myIndex.setIndexRecords(records);
  return myIndex;
}
function computeScore$1(pattern, {
  errors = 0,
  currentLocation = 0,
  expectedLocation = 0,
  distance = Config.distance,
  ignoreLocation = Config.ignoreLocation
} = {}) {
  const accuracy = errors / pattern.length;
  if (ignoreLocation) {
    return accuracy;
  }
  const proximity = Math.abs(expectedLocation - currentLocation);
  if (!distance) {
    return proximity ? 1 : accuracy;
  }
  return accuracy + proximity / distance;
}
function convertMaskToIndices(matchmask = [], minMatchCharLength = Config.minMatchCharLength) {
  let indices = [];
  let start = -1;
  let end = -1;
  let i4 = 0;
  for (let len = matchmask.length; i4 < len; i4 += 1) {
    let match = matchmask[i4];
    if (match && start === -1) {
      start = i4;
    } else if (!match && start !== -1) {
      end = i4 - 1;
      if (end - start + 1 >= minMatchCharLength) {
        indices.push([start, end]);
      }
      start = -1;
    }
  }
  if (matchmask[i4 - 1] && i4 - start >= minMatchCharLength) {
    indices.push([start, i4 - 1]);
  }
  return indices;
}
var MAX_BITS = 32;
function search(text, pattern, patternAlphabet, {
  location = Config.location,
  distance = Config.distance,
  threshold = Config.threshold,
  findAllMatches = Config.findAllMatches,
  minMatchCharLength = Config.minMatchCharLength,
  includeMatches = Config.includeMatches,
  ignoreLocation = Config.ignoreLocation
} = {}) {
  if (pattern.length > MAX_BITS) {
    throw new Error(PATTERN_LENGTH_TOO_LARGE(MAX_BITS));
  }
  const patternLen = pattern.length;
  const textLen = text.length;
  const expectedLocation = Math.max(0, Math.min(location, textLen));
  let currentThreshold = threshold;
  let bestLocation = expectedLocation;
  const computeMatches = minMatchCharLength > 1 || includeMatches;
  const matchMask = computeMatches ? Array(textLen) : [];
  let index;
  while ((index = text.indexOf(pattern, bestLocation)) > -1) {
    let score = computeScore$1(pattern, {
      currentLocation: index,
      expectedLocation,
      distance,
      ignoreLocation
    });
    currentThreshold = Math.min(score, currentThreshold);
    bestLocation = index + patternLen;
    if (computeMatches) {
      let i4 = 0;
      while (i4 < patternLen) {
        matchMask[index + i4] = 1;
        i4 += 1;
      }
    }
  }
  bestLocation = -1;
  let lastBitArr = [];
  let finalScore = 1;
  let binMax = patternLen + textLen;
  const mask = 1 << patternLen - 1;
  for (let i4 = 0; i4 < patternLen; i4 += 1) {
    let binMin = 0;
    let binMid = binMax;
    while (binMin < binMid) {
      const score2 = computeScore$1(pattern, {
        errors: i4,
        currentLocation: expectedLocation + binMid,
        expectedLocation,
        distance,
        ignoreLocation
      });
      if (score2 <= currentThreshold) {
        binMin = binMid;
      } else {
        binMax = binMid;
      }
      binMid = Math.floor((binMax - binMin) / 2 + binMin);
    }
    binMax = binMid;
    let start = Math.max(1, expectedLocation - binMid + 1);
    let finish = findAllMatches ? textLen : Math.min(expectedLocation + binMid, textLen) + patternLen;
    let bitArr = Array(finish + 2);
    bitArr[finish + 1] = (1 << i4) - 1;
    for (let j = finish; j >= start; j -= 1) {
      let currentLocation = j - 1;
      let charMatch = patternAlphabet[text.charAt(currentLocation)];
      if (computeMatches) {
        matchMask[currentLocation] = +!!charMatch;
      }
      bitArr[j] = (bitArr[j + 1] << 1 | 1) & charMatch;
      if (i4) {
        bitArr[j] |= (lastBitArr[j + 1] | lastBitArr[j]) << 1 | 1 | lastBitArr[j + 1];
      }
      if (bitArr[j] & mask) {
        finalScore = computeScore$1(pattern, {
          errors: i4,
          currentLocation,
          expectedLocation,
          distance,
          ignoreLocation
        });
        if (finalScore <= currentThreshold) {
          currentThreshold = finalScore;
          bestLocation = currentLocation;
          if (bestLocation <= expectedLocation) {
            break;
          }
          start = Math.max(1, 2 * expectedLocation - bestLocation);
        }
      }
    }
    const score = computeScore$1(pattern, {
      errors: i4 + 1,
      currentLocation: expectedLocation,
      expectedLocation,
      distance,
      ignoreLocation
    });
    if (score > currentThreshold) {
      break;
    }
    lastBitArr = bitArr;
  }
  const result = {
    isMatch: bestLocation >= 0,
    // Count exact matches (those with a score of 0) to be "almost" exact
    score: Math.max(1e-3, finalScore)
  };
  if (computeMatches) {
    const indices = convertMaskToIndices(matchMask, minMatchCharLength);
    if (!indices.length) {
      result.isMatch = false;
    } else if (includeMatches) {
      result.indices = indices;
    }
  }
  return result;
}
function createPatternAlphabet(pattern) {
  let mask = {};
  for (let i4 = 0, len = pattern.length; i4 < len; i4 += 1) {
    const char = pattern.charAt(i4);
    mask[char] = (mask[char] || 0) | 1 << len - i4 - 1;
  }
  return mask;
}
var BitapSearch = class {
  constructor(pattern, {
    location = Config.location,
    threshold = Config.threshold,
    distance = Config.distance,
    includeMatches = Config.includeMatches,
    findAllMatches = Config.findAllMatches,
    minMatchCharLength = Config.minMatchCharLength,
    isCaseSensitive = Config.isCaseSensitive,
    ignoreLocation = Config.ignoreLocation
  } = {}) {
    this.options = {
      location,
      threshold,
      distance,
      includeMatches,
      findAllMatches,
      minMatchCharLength,
      isCaseSensitive,
      ignoreLocation
    };
    this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
    this.chunks = [];
    if (!this.pattern.length) {
      return;
    }
    const addChunk = (pattern2, startIndex) => {
      this.chunks.push({
        pattern: pattern2,
        alphabet: createPatternAlphabet(pattern2),
        startIndex
      });
    };
    const len = this.pattern.length;
    if (len > MAX_BITS) {
      let i4 = 0;
      const remainder = len % MAX_BITS;
      const end = len - remainder;
      while (i4 < end) {
        addChunk(this.pattern.substr(i4, MAX_BITS), i4);
        i4 += MAX_BITS;
      }
      if (remainder) {
        const startIndex = len - MAX_BITS;
        addChunk(this.pattern.substr(startIndex), startIndex);
      }
    } else {
      addChunk(this.pattern, 0);
    }
  }
  searchIn(text) {
    const { isCaseSensitive, includeMatches } = this.options;
    if (!isCaseSensitive) {
      text = text.toLowerCase();
    }
    if (this.pattern === text) {
      let result2 = {
        isMatch: true,
        score: 0
      };
      if (includeMatches) {
        result2.indices = [[0, text.length - 1]];
      }
      return result2;
    }
    const {
      location,
      distance,
      threshold,
      findAllMatches,
      minMatchCharLength,
      ignoreLocation
    } = this.options;
    let allIndices = [];
    let totalScore = 0;
    let hasMatches = false;
    this.chunks.forEach(({ pattern, alphabet, startIndex }) => {
      const { isMatch, score, indices } = search(text, pattern, alphabet, {
        location: location + startIndex,
        distance,
        threshold,
        findAllMatches,
        minMatchCharLength,
        includeMatches,
        ignoreLocation
      });
      if (isMatch) {
        hasMatches = true;
      }
      totalScore += score;
      if (isMatch && indices) {
        allIndices = [...allIndices, ...indices];
      }
    });
    let result = {
      isMatch: hasMatches,
      score: hasMatches ? totalScore / this.chunks.length : 1
    };
    if (hasMatches && includeMatches) {
      result.indices = allIndices;
    }
    return result;
  }
};
var BaseMatch = class {
  constructor(pattern) {
    this.pattern = pattern;
  }
  static isMultiMatch(pattern) {
    return getMatch(pattern, this.multiRegex);
  }
  static isSingleMatch(pattern) {
    return getMatch(pattern, this.singleRegex);
  }
  search() {
  }
};
function getMatch(pattern, exp) {
  const matches2 = pattern.match(exp);
  return matches2 ? matches2[1] : null;
}
var ExactMatch = class extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return "exact";
  }
  static get multiRegex() {
    return /^="(.*)"$/;
  }
  static get singleRegex() {
    return /^=(.*)$/;
  }
  search(text) {
    const isMatch = text === this.pattern;
    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [0, this.pattern.length - 1]
    };
  }
};
var InverseExactMatch = class extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return "inverse-exact";
  }
  static get multiRegex() {
    return /^!"(.*)"$/;
  }
  static get singleRegex() {
    return /^!(.*)$/;
  }
  search(text) {
    const index = text.indexOf(this.pattern);
    const isMatch = index === -1;
    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [0, text.length - 1]
    };
  }
};
var PrefixExactMatch = class extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return "prefix-exact";
  }
  static get multiRegex() {
    return /^\^"(.*)"$/;
  }
  static get singleRegex() {
    return /^\^(.*)$/;
  }
  search(text) {
    const isMatch = text.startsWith(this.pattern);
    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [0, this.pattern.length - 1]
    };
  }
};
var InversePrefixExactMatch = class extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return "inverse-prefix-exact";
  }
  static get multiRegex() {
    return /^!\^"(.*)"$/;
  }
  static get singleRegex() {
    return /^!\^(.*)$/;
  }
  search(text) {
    const isMatch = !text.startsWith(this.pattern);
    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [0, text.length - 1]
    };
  }
};
var SuffixExactMatch = class extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return "suffix-exact";
  }
  static get multiRegex() {
    return /^"(.*)"\$$/;
  }
  static get singleRegex() {
    return /^(.*)\$$/;
  }
  search(text) {
    const isMatch = text.endsWith(this.pattern);
    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [text.length - this.pattern.length, text.length - 1]
    };
  }
};
var InverseSuffixExactMatch = class extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return "inverse-suffix-exact";
  }
  static get multiRegex() {
    return /^!"(.*)"\$$/;
  }
  static get singleRegex() {
    return /^!(.*)\$$/;
  }
  search(text) {
    const isMatch = !text.endsWith(this.pattern);
    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [0, text.length - 1]
    };
  }
};
var FuzzyMatch = class extends BaseMatch {
  constructor(pattern, {
    location = Config.location,
    threshold = Config.threshold,
    distance = Config.distance,
    includeMatches = Config.includeMatches,
    findAllMatches = Config.findAllMatches,
    minMatchCharLength = Config.minMatchCharLength,
    isCaseSensitive = Config.isCaseSensitive,
    ignoreLocation = Config.ignoreLocation
  } = {}) {
    super(pattern);
    this._bitapSearch = new BitapSearch(pattern, {
      location,
      threshold,
      distance,
      includeMatches,
      findAllMatches,
      minMatchCharLength,
      isCaseSensitive,
      ignoreLocation
    });
  }
  static get type() {
    return "fuzzy";
  }
  static get multiRegex() {
    return /^"(.*)"$/;
  }
  static get singleRegex() {
    return /^(.*)$/;
  }
  search(text) {
    return this._bitapSearch.searchIn(text);
  }
};
var IncludeMatch = class extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return "include";
  }
  static get multiRegex() {
    return /^'"(.*)"$/;
  }
  static get singleRegex() {
    return /^'(.*)$/;
  }
  search(text) {
    let location = 0;
    let index;
    const indices = [];
    const patternLen = this.pattern.length;
    while ((index = text.indexOf(this.pattern, location)) > -1) {
      location = index + patternLen;
      indices.push([index, location - 1]);
    }
    const isMatch = !!indices.length;
    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices
    };
  }
};
var searchers = [
  ExactMatch,
  IncludeMatch,
  PrefixExactMatch,
  InversePrefixExactMatch,
  InverseSuffixExactMatch,
  SuffixExactMatch,
  InverseExactMatch,
  FuzzyMatch
];
var searchersLen = searchers.length;
var SPACE_RE = / +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/;
var OR_TOKEN = "|";
function parseQuery(pattern, options = {}) {
  return pattern.split(OR_TOKEN).map((item) => {
    let query = item.trim().split(SPACE_RE).filter((item2) => item2 && !!item2.trim());
    let results = [];
    for (let i4 = 0, len = query.length; i4 < len; i4 += 1) {
      const queryItem = query[i4];
      let found = false;
      let idx = -1;
      while (!found && ++idx < searchersLen) {
        const searcher = searchers[idx];
        let token = searcher.isMultiMatch(queryItem);
        if (token) {
          results.push(new searcher(token, options));
          found = true;
        }
      }
      if (found) {
        continue;
      }
      idx = -1;
      while (++idx < searchersLen) {
        const searcher = searchers[idx];
        let token = searcher.isSingleMatch(queryItem);
        if (token) {
          results.push(new searcher(token, options));
          break;
        }
      }
    }
    return results;
  });
}
var MultiMatchSet = /* @__PURE__ */ new Set([FuzzyMatch.type, IncludeMatch.type]);
var ExtendedSearch = class {
  constructor(pattern, {
    isCaseSensitive = Config.isCaseSensitive,
    includeMatches = Config.includeMatches,
    minMatchCharLength = Config.minMatchCharLength,
    ignoreLocation = Config.ignoreLocation,
    findAllMatches = Config.findAllMatches,
    location = Config.location,
    threshold = Config.threshold,
    distance = Config.distance
  } = {}) {
    this.query = null;
    this.options = {
      isCaseSensitive,
      includeMatches,
      minMatchCharLength,
      findAllMatches,
      ignoreLocation,
      location,
      threshold,
      distance
    };
    this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
    this.query = parseQuery(this.pattern, this.options);
  }
  static condition(_, options) {
    return options.useExtendedSearch;
  }
  searchIn(text) {
    const query = this.query;
    if (!query) {
      return {
        isMatch: false,
        score: 1
      };
    }
    const { includeMatches, isCaseSensitive } = this.options;
    text = isCaseSensitive ? text : text.toLowerCase();
    let numMatches = 0;
    let allIndices = [];
    let totalScore = 0;
    for (let i4 = 0, qLen = query.length; i4 < qLen; i4 += 1) {
      const searchers2 = query[i4];
      allIndices.length = 0;
      numMatches = 0;
      for (let j = 0, pLen = searchers2.length; j < pLen; j += 1) {
        const searcher = searchers2[j];
        const { isMatch, indices, score } = searcher.search(text);
        if (isMatch) {
          numMatches += 1;
          totalScore += score;
          if (includeMatches) {
            const type = searcher.constructor.type;
            if (MultiMatchSet.has(type)) {
              allIndices = [...allIndices, ...indices];
            } else {
              allIndices.push(indices);
            }
          }
        } else {
          totalScore = 0;
          numMatches = 0;
          allIndices.length = 0;
          break;
        }
      }
      if (numMatches) {
        let result = {
          isMatch: true,
          score: totalScore / numMatches
        };
        if (includeMatches) {
          result.indices = allIndices;
        }
        return result;
      }
    }
    return {
      isMatch: false,
      score: 1
    };
  }
};
var registeredSearchers = [];
function register(...args) {
  registeredSearchers.push(...args);
}
function createSearcher(pattern, options) {
  for (let i4 = 0, len = registeredSearchers.length; i4 < len; i4 += 1) {
    let searcherClass = registeredSearchers[i4];
    if (searcherClass.condition(pattern, options)) {
      return new searcherClass(pattern, options);
    }
  }
  return new BitapSearch(pattern, options);
}
var LogicalOperator = {
  AND: "$and",
  OR: "$or"
};
var KeyType = {
  PATH: "$path",
  PATTERN: "$val"
};
var isExpression = (query) => !!(query[LogicalOperator.AND] || query[LogicalOperator.OR]);
var isPath = (query) => !!query[KeyType.PATH];
var isLeaf = (query) => !isArray(query) && isObject2(query) && !isExpression(query);
var convertToExplicit = (query) => ({
  [LogicalOperator.AND]: Object.keys(query).map((key) => ({
    [key]: query[key]
  }))
});
function parse(query, options, { auto = true } = {}) {
  const next = (query2) => {
    let keys = Object.keys(query2);
    const isQueryPath = isPath(query2);
    if (!isQueryPath && keys.length > 1 && !isExpression(query2)) {
      return next(convertToExplicit(query2));
    }
    if (isLeaf(query2)) {
      const key = isQueryPath ? query2[KeyType.PATH] : keys[0];
      const pattern = isQueryPath ? query2[KeyType.PATTERN] : query2[key];
      if (!isString(pattern)) {
        throw new Error(LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY(key));
      }
      const obj = {
        keyId: createKeyId(key),
        pattern
      };
      if (auto) {
        obj.searcher = createSearcher(pattern, options);
      }
      return obj;
    }
    let node = {
      children: [],
      operator: keys[0]
    };
    keys.forEach((key) => {
      const value = query2[key];
      if (isArray(value)) {
        value.forEach((item) => {
          node.children.push(next(item));
        });
      }
    });
    return node;
  };
  if (!isExpression(query)) {
    query = convertToExplicit(query);
  }
  return next(query);
}
function computeScore(results, { ignoreFieldNorm = Config.ignoreFieldNorm }) {
  results.forEach((result) => {
    let totalScore = 1;
    result.matches.forEach(({ key, norm: norm2, score }) => {
      const weight = key ? key.weight : null;
      totalScore *= Math.pow(
        score === 0 && weight ? Number.EPSILON : score,
        (weight || 1) * (ignoreFieldNorm ? 1 : norm2)
      );
    });
    result.score = totalScore;
  });
}
function transformMatches(result, data) {
  const matches2 = result.matches;
  data.matches = [];
  if (!isDefined(matches2)) {
    return;
  }
  matches2.forEach((match) => {
    if (!isDefined(match.indices) || !match.indices.length) {
      return;
    }
    const { indices, value } = match;
    let obj = {
      indices,
      value
    };
    if (match.key) {
      obj.key = match.key.src;
    }
    if (match.idx > -1) {
      obj.refIndex = match.idx;
    }
    data.matches.push(obj);
  });
}
function transformScore(result, data) {
  data.score = result.score;
}
function format(results, docs, {
  includeMatches = Config.includeMatches,
  includeScore = Config.includeScore
} = {}) {
  const transformers = [];
  if (includeMatches) transformers.push(transformMatches);
  if (includeScore) transformers.push(transformScore);
  return results.map((result) => {
    const { idx } = result;
    const data = {
      item: docs[idx],
      refIndex: idx
    };
    if (transformers.length) {
      transformers.forEach((transformer) => {
        transformer(result, data);
      });
    }
    return data;
  });
}
var Fuse = class {
  constructor(docs, options = {}, index) {
    this.options = { ...Config, ...options };
    if (this.options.useExtendedSearch && false) {
      throw new Error(EXTENDED_SEARCH_UNAVAILABLE);
    }
    this._keyStore = new KeyStore(this.options.keys);
    this.setCollection(docs, index);
  }
  setCollection(docs, index) {
    this._docs = docs;
    if (index && !(index instanceof FuseIndex)) {
      throw new Error(INCORRECT_INDEX_TYPE);
    }
    this._myIndex = index || createIndex(this.options.keys, this._docs, {
      getFn: this.options.getFn,
      fieldNormWeight: this.options.fieldNormWeight
    });
  }
  add(doc) {
    if (!isDefined(doc)) {
      return;
    }
    this._docs.push(doc);
    this._myIndex.add(doc);
  }
  remove(predicate = () => false) {
    const results = [];
    for (let i4 = 0, len = this._docs.length; i4 < len; i4 += 1) {
      const doc = this._docs[i4];
      if (predicate(doc, i4)) {
        this.removeAt(i4);
        i4 -= 1;
        len -= 1;
        results.push(doc);
      }
    }
    return results;
  }
  removeAt(idx) {
    this._docs.splice(idx, 1);
    this._myIndex.removeAt(idx);
  }
  getIndex() {
    return this._myIndex;
  }
  search(query, { limit = -1 } = {}) {
    const {
      includeMatches,
      includeScore,
      shouldSort,
      sortFn,
      ignoreFieldNorm
    } = this.options;
    let results = isString(query) ? isString(this._docs[0]) ? this._searchStringList(query) : this._searchObjectList(query) : this._searchLogical(query);
    computeScore(results, { ignoreFieldNorm });
    if (shouldSort) {
      results.sort(sortFn);
    }
    if (isNumber(limit) && limit > -1) {
      results = results.slice(0, limit);
    }
    return format(results, this._docs, {
      includeMatches,
      includeScore
    });
  }
  _searchStringList(query) {
    const searcher = createSearcher(query, this.options);
    const { records } = this._myIndex;
    const results = [];
    records.forEach(({ v: text, i: idx, n: norm2 }) => {
      if (!isDefined(text)) {
        return;
      }
      const { isMatch, score, indices } = searcher.searchIn(text);
      if (isMatch) {
        results.push({
          item: text,
          idx,
          matches: [{ score, value: text, norm: norm2, indices }]
        });
      }
    });
    return results;
  }
  _searchLogical(query) {
    const expression = parse(query, this.options);
    const evaluate = (node, item, idx) => {
      if (!node.children) {
        const { keyId, searcher } = node;
        const matches2 = this._findMatches({
          key: this._keyStore.get(keyId),
          value: this._myIndex.getValueForItemAtKeyId(item, keyId),
          searcher
        });
        if (matches2 && matches2.length) {
          return [
            {
              idx,
              item,
              matches: matches2
            }
          ];
        }
        return [];
      }
      const res = [];
      for (let i4 = 0, len = node.children.length; i4 < len; i4 += 1) {
        const child = node.children[i4];
        const result = evaluate(child, item, idx);
        if (result.length) {
          res.push(...result);
        } else if (node.operator === LogicalOperator.AND) {
          return [];
        }
      }
      return res;
    };
    const records = this._myIndex.records;
    const resultMap = {};
    const results = [];
    records.forEach(({ $: item, i: idx }) => {
      if (isDefined(item)) {
        let expResults = evaluate(expression, item, idx);
        if (expResults.length) {
          if (!resultMap[idx]) {
            resultMap[idx] = { idx, item, matches: [] };
            results.push(resultMap[idx]);
          }
          expResults.forEach(({ matches: matches2 }) => {
            resultMap[idx].matches.push(...matches2);
          });
        }
      }
    });
    return results;
  }
  _searchObjectList(query) {
    const searcher = createSearcher(query, this.options);
    const { keys, records } = this._myIndex;
    const results = [];
    records.forEach(({ $: item, i: idx }) => {
      if (!isDefined(item)) {
        return;
      }
      let matches2 = [];
      keys.forEach((key, keyIndex) => {
        matches2.push(
          ...this._findMatches({
            key,
            value: item[keyIndex],
            searcher
          })
        );
      });
      if (matches2.length) {
        results.push({
          idx,
          item,
          matches: matches2
        });
      }
    });
    return results;
  }
  _findMatches({ key, value, searcher }) {
    if (!isDefined(value)) {
      return [];
    }
    let matches2 = [];
    if (isArray(value)) {
      value.forEach(({ v: text, i: idx, n: norm2 }) => {
        if (!isDefined(text)) {
          return;
        }
        const { isMatch, score, indices } = searcher.searchIn(text);
        if (isMatch) {
          matches2.push({
            score,
            key,
            value: text,
            idx,
            norm: norm2,
            indices
          });
        }
      });
    } else {
      const { v: text, n: norm2 } = value;
      const { isMatch, score, indices } = searcher.searchIn(text);
      if (isMatch) {
        matches2.push({ score, key, value: text, norm: norm2, indices });
      }
    }
    return matches2;
  }
};
Fuse.version = "6.6.2";
Fuse.createIndex = createIndex;
Fuse.parseIndex = parseIndex;
Fuse.config = Config;
{
  Fuse.parseQuery = parse;
}
{
  register(ExtendedSearch);
}

// ../node_modules/playground-elements/shared/completion-utils.js
function sortCompletionItems(completions, searchWord) {
  if (!completions)
    return [];
  const fuse = new Fuse(completions !== null && completions !== void 0 ? completions : [], {
    // Keep the threshold a bit lower than the default
    // so that the matching isn't too forgiving/confusing, but so
    // that a small typo doesn't delete all of the matches
    threshold: 0.3,
    shouldSort: true,
    isCaseSensitive: true,
    includeScore: true,
    includeMatches: true,
    keys: ["name"],
    // Match characters so that at least most of the word matches
    minMatchCharLength: Math.max(searchWord.length / 1.2, 1)
  });
  const relevantCompletions = fuse.search(searchWord);
  const editorCompletions = relevantCompletions.map((item) => {
    var _a;
    return {
      text: item.item.name,
      displayText: item.item.name,
      score: (_a = item.score) !== null && _a !== void 0 ? _a : 0,
      matches: item.matches,
      get details() {
        return item.item.details;
      }
    };
  }).sort((a, b) => {
    if (a.score === b.score) {
      return a.text.localeCompare(b.text);
    }
    return a.score - b.score;
  });
  return editorCompletions;
}
function completionEntriesAsEditorCompletions(completions, prefix = "") {
  var _a;
  return (_a = completions === null || completions === void 0 ? void 0 : completions.map((comp) => ({
    // Since the completion engine will only append the word
    // given as the text property here, auto-completing from a period
    // would replace the period with the word. This is why we need
    // to append the period into the text property. This is not visible to the
    // user however, so no harm is done.
    text: prefix + comp.name,
    displayText: comp.name,
    score: Number.parseInt(comp.sortText),
    get details() {
      return comp.details;
    }
  }))) !== null && _a !== void 0 ? _a : [];
}
function populateCompletionInfoWithDetailGetters(completionInfo, filename, cursorIndex, getCompletionDetailsFunction) {
  const completionInfoWithDetails = completionInfo;
  completionInfoWithDetails.entries = completionInfo === null || completionInfo === void 0 ? void 0 : completionInfo.entries.map((entry) => ({
    ...entry,
    // Details are fetched using a proxy pattern, in which the details
    // are not instantiated until requested for. When asking for details
    // from the completion item, the getter is called, launching the
    // query if needed.
    _details: void 0,
    get details() {
      if (!this._details) {
        this._details = getCompletionDetailsFunction(filename, cursorIndex, entry.name);
      }
      return this._details;
    }
  }));
  return completionInfoWithDetails;
}

// ../node_modules/playground-elements/shared/version.js
var npmVersion = "0.17.1";
var serviceWorkerHash = "1dae6563";

// ../node_modules/playground-elements/shared/deferred.js
var Deferred = class {
  constructor() {
    this.settled = false;
    this.promise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }
  resolve(value) {
    this.settled = true;
    this._resolve(value);
  }
  reject(reason) {
    this.settled = true;
    this._reject(reason);
  }
};

// ../node_modules/playground-elements/internal/build.js
var unreachable2 = (n3) => n3;
var errorNotFound = {
  status: (
    /* Not Found */
    404
  ),
  body: "Playground file not found"
};
var errorCancelled = {
  status: (
    /* Service Unavailable */
    503
  ),
  body: "Playground build cancelled"
};
var PlaygroundBuild = class {
  /**
   * @param diagnosticsCallback Function that will be invoked when one or more
   * new diagnostics have been received. Fires at most once per animation frame.
   */
  constructor(diagnosticsCallback) {
    this.diagnostics = /* @__PURE__ */ new Map();
    this._state = "active";
    this._stateChange = new Deferred();
    this._files = /* @__PURE__ */ new Map();
    this._diagnosticsCallback = diagnosticsCallback;
  }
  /**
   * The current state of this build.
   */
  state() {
    return this._state;
  }
  /**
   * Promise of the next state change.
   */
  get stateChange() {
    return this._stateChange.promise;
  }
  /**
   * Set this build's state to cancelled, ignore any future build results, and
   * fail any pending file gets.
   */
  cancel() {
    this._errorPendingFileRequests(errorCancelled);
    this._changeState("cancelled");
  }
  /**
   * Return a promise of a build output with the given name. If the file is not
   * received before the build is completed or cancelled, this promise will be
   * rejected.
   */
  async getFile(name) {
    let deferred = this._files.get(name);
    if (deferred === void 0) {
      if (this._state === "done") {
        return errorNotFound;
      } else if (this._state === "cancelled") {
        return errorCancelled;
      }
      deferred = new Deferred();
      this._files.set(name, deferred);
    }
    return deferred.promise;
  }
  /**
   * Handle a worker build output.
   */
  onOutput(output) {
    if (this._state !== "active") {
      return;
    }
    if (output.kind === "file") {
      this._onFile(output);
    } else if (output.kind === "diagnostic") {
      this._onDiagnostic(output);
    } else if (output.kind === "done") {
      this._onDone();
    } else {
      throw new Error(`Unexpected BuildOutput kind: ${unreachable2(output).kind}`);
    }
  }
  _changeState(state) {
    this._state = state;
    this._stateChange.resolve();
    this._stateChange = new Deferred();
  }
  _onFile(output) {
    let deferred = this._files.get(output.file.name);
    if (deferred === void 0) {
      deferred = new Deferred();
      this._files.set(output.file.name, deferred);
    }
    deferred.resolve(output.file);
  }
  _onDiagnostic(output) {
    let arr = this.diagnostics.get(output.filename);
    if (arr === void 0) {
      arr = [];
      this.diagnostics.set(output.filename, arr);
    }
    arr.push(output.diagnostic);
    if (this._diagnosticsDebounceId === void 0) {
      this._diagnosticsDebounceId = requestAnimationFrame(() => {
        if (this._state !== "cancelled") {
          this._diagnosticsDebounceId = void 0;
          this._diagnosticsCallback();
        }
      });
    }
  }
  _onDone() {
    this._errorPendingFileRequests(errorNotFound);
    this._changeState("done");
  }
  _errorPendingFileRequests(error) {
    for (const file of this._files.values()) {
      if (!file.settled) {
        file.resolve(error);
      }
    }
  }
};

// ../node_modules/playground-elements/playground-project.js
var sessions = /* @__PURE__ */ new Set();
var generateUniqueSessionId = () => {
  let sessionId;
  do {
    sessionId = getRandomString();
  } while (sessions.has(sessionId));
  sessions.add(sessionId);
  return sessionId;
};
var FilesChangedEvent = class extends Event {
  constructor(projectLoaded = false) {
    super("filesChanged");
    this.projectLoaded = projectLoaded;
  }
};
var PlaygroundProject = class PlaygroundProject2 extends s {
  constructor() {
    super(...arguments);
    this._source = { type: "none" };
    this.sandboxBaseUrl = `https://unpkg.com/playground-elements@${npmVersion}/`;
    this.sandboxScope = `__playground_swfs_${serviceWorkerHash}/`;
    this._modified = false;
    this._sessionId = generateUniqueSessionId();
    this._deferredTypeScriptWorkerApi = new Deferred();
    this._validImportMap = {};
    this.lastSave = Promise.resolve();
    this.savePending = false;
  }
  /**
   * A document-relative path to a project configuration file.
   *
   * When both `projectSrc` and `files` are set, the one set most recently wins.
   * Slotted children win only if both `projectSrc` and `files` are undefined
   */
  get projectSrc() {
    if (this._source.type === "url") {
      return this._source.url;
    }
    return void 0;
  }
  set projectSrc(url) {
    if (url) {
      if (this._source.type !== "url" || this._source.url !== url) {
        this._source = { type: "url", url };
      }
    } else if (this._source.type === "url") {
      this._source = { type: "none" };
    }
  }
  /**
   * Get or set the project config.
   *
   * When both `projectSrc` and `config` are set, the one set most recently
   * wins. Slotted children win only if both `projectSrc` and `config` are
   * undefined.
   */
  get config() {
    var _a;
    return {
      files: Object.fromEntries(((_a = this._files) !== null && _a !== void 0 ? _a : []).map((file) => [
        file.name,
        {
          ...file,
          name: void 0
        }
      ])),
      importMap: this._validImportMap
    };
  }
  set config(config) {
    if (config) {
      this._source = { type: "direct", config };
    } else if (this._source.type === "direct") {
      this._source = { type: "none" };
    }
  }
  get files() {
    return this._files;
  }
  /**
   * Map from filename to array of Language Server Protocol diagnostics
   * resulting from the latest compilation.
   */
  get diagnostics() {
    var _a;
    return (_a = this._build) === null || _a === void 0 ? void 0 : _a.diagnostics;
  }
  /**
   * Indicates whether the user has modified, added, or removed any project
   * files. Resets whenever a new project is loaded.
   */
  get modified() {
    if (this._modified === void 0) {
      if (this._files === void 0 && this._pristineFiles === void 0) {
        this._modified = false;
      } else if (this._files === void 0 || this._pristineFiles === void 0) {
        this._modified = true;
      } else {
        this._modified = !playgroundFilesDeepEqual(this._files, this._pristineFiles);
      }
    }
    return this._modified;
  }
  set _importMap(importMap) {
    const errors = validateImportMap(importMap);
    if (errors.length > 0) {
      for (const error of errors) {
        console.error(error);
      }
      this._validImportMap = {};
    } else {
      this._validImportMap = importMap;
    }
  }
  get _importMap() {
    return this._validImportMap;
  }
  get _normalizedSandboxBaseUrl() {
    const url = new URL(this.sandboxBaseUrl, import.meta.url);
    url.pathname = endWithSlash(url.pathname);
    return url;
  }
  get baseUrl() {
    if (this._serviceWorkerAPI === void 0 || this._files === void 0) {
      return void 0;
    }
    const indexUrl = new URL(`${endWithSlash(this.sandboxScope)}${this._sessionId}/`, this._normalizedSandboxBaseUrl);
    return indexUrl.href;
  }
  get _serviceWorkerProxyIframeUrl() {
    return new URL(`playground-service-worker-proxy.html#playground-session-id=${this._sessionId}`, this._normalizedSandboxBaseUrl).href;
  }
  async update(changedProperties) {
    if (changedProperties.has("_source")) {
      this._loadProjectFromSource();
    }
    if (changedProperties.has("sandboxScope") || changedProperties.has("sandboxBaseUrl") || changedProperties.has("_serviceWorkerAPI")) {
      this.dispatchEvent(new CustomEvent("urlChanged"));
    }
    super.update(changedProperties);
  }
  async _loadProjectFromSource() {
    const source = this._source;
    switch (source.type) {
      case "none":
        this._files = void 0;
        this._importMap = {};
        break;
      case "direct":
        {
          const { files, importMap } = await expandProjectConfig(source.config, document.baseURI);
          if (source !== this._source) {
            return;
          }
          this._files = files;
          this._importMap = importMap;
        }
        break;
      case "slot":
        this._files = source.files;
        this._importMap = source.importMap;
        break;
      case "url":
        {
          const { files, importMap } = await fetchProjectConfig(new URL(source.url, document.baseURI).href);
          if (source !== this._source) {
            return;
          }
          this._files = files;
          this._importMap = importMap;
        }
        break;
      default:
        source;
        break;
    }
    this._pristineFiles = this._files && JSON.parse(JSON.stringify(this._files));
    this._modified = false;
    this.dispatchEvent(new FilesChangedEvent(true));
    this.save();
  }
  render() {
    return x`
      <slot @slotchange=${this._slotChange}></slot>
      <iframe
        src=${this._serviceWorkerProxyIframeUrl}
        @load=${this._onServiceWorkerProxyIframeLoad}
      ></iframe>
    `;
  }
  _slotChange() {
    var _a;
    const { type } = this._source;
    if (type !== "none" && type !== "slot") {
      return;
    }
    const files = [];
    let importMap = void 0;
    for (const s2 of this._slot.assignedElements({ flatten: true })) {
      const typeAttr = s2.getAttribute("type");
      if (!(typeAttr === null || typeAttr === void 0 ? void 0 : typeAttr.startsWith("sample/"))) {
        continue;
      }
      const fileType = typeAttr.substring("sample/".length);
      let content = (_a = s2.textContent) !== null && _a !== void 0 ? _a : "";
      if (fileType === "html") {
        content = content.replace(/&lt;\//g, "</");
      }
      if (!s2.hasAttribute("preserve-whitespace")) {
        content = outdent(content);
      }
      if (fileType === "importmap") {
        try {
          importMap = JSON.parse(content);
        } catch {
          console.error("Invalid import map JSON", s2);
        }
      } else {
        const name = s2.getAttribute("filename");
        if (!name) {
          continue;
        }
        const label = s2.getAttribute("label") || void 0;
        const selected = s2.hasAttribute("selected");
        const contentType = typeEnumToMimeType(fileType);
        files.push({
          name,
          label,
          hidden: s2.hasAttribute("hidden"),
          content,
          contentType,
          selected
        });
      }
    }
    if (files.length > 0 || importMap !== void 0) {
      this._source = { type: "slot", files, importMap: importMap !== null && importMap !== void 0 ? importMap : {} };
    }
  }
  async firstUpdated() {
    const typescriptWorkerScriptUrl = forceSkypackRawMode(new URL("./playground-typescript-worker.js", import.meta.url));
    let worker;
    if (typescriptWorkerScriptUrl.origin === window.location.origin) {
      worker = new Worker(typescriptWorkerScriptUrl);
    } else {
      const resp = await fetch(typescriptWorkerScriptUrl.href);
      const text = await resp.text();
      const blobUrl = URL.createObjectURL(new Blob([text], { type: "application/javascript" }));
      worker = new Worker(blobUrl);
      URL.revokeObjectURL(blobUrl);
    }
    this._deferredTypeScriptWorkerApi.resolve(wrap(worker));
  }
  _onServiceWorkerProxyIframeLoad() {
    const { port1, port2 } = new MessageChannel();
    port1.addEventListener("message", (event) => {
      if (event.data.type === CONNECT_PROJECT_TO_SW) {
        this._onNewServiceWorkerPort(event.data.port);
      }
    });
    port1.start();
    this._postMessageToServiceWorkerProxyIframe({
      type: CONFIGURE_PROXY,
      scope: this.sandboxScope,
      port: port2
    }, [port2]);
  }
  _onNewServiceWorkerPort(port) {
    const onMessage = (e5) => {
      if (e5.data.type === ACKNOWLEDGE_SW_CONNECTION) {
        port.removeEventListener("message", onMessage);
        if (e5.data.version === serviceWorkerHash) {
          this._serviceWorkerAPI = wrap(port);
          this._serviceWorkerAPI.setFileAPI(proxy({
            getFile: (name) => this._getFile(name)
          }), this._sessionId);
        } else {
          console.info(`Playground service worker is outdated. Want ${serviceWorkerHash} but got ${e5.data.version}. Waiting for update.`);
          this._postMessageToServiceWorkerProxyIframe({
            type: UPDATE_SERVICE_WORKER
          });
        }
      }
    };
    port.addEventListener("message", onMessage);
    port.start();
  }
  _postMessageToServiceWorkerProxyIframe(message, transfer2) {
    const iframeWindow = this._serviceWorkerProxyIframe.contentWindow;
    if (!iframeWindow) {
      throw new Error("Unexpected internal error: <playground-project> service worker proxy iframe had no contentWindow");
    }
    iframeWindow.postMessage(message, "*", transfer2);
  }
  async _getFile(name) {
    if (this._build === void 0) {
      return {
        status: (
          /* Service Unavailable */
          503
        ),
        body: "Playground build not started"
      };
    }
    return this._build.getFile(name);
  }
  /**
   * Build this project immediately, cancelling any previous build.
   */
  async save() {
    var _a, _b;
    (_a = this._build) === null || _a === void 0 ? void 0 : _a.cancel();
    const build = new PlaygroundBuild(() => {
      this.dispatchEvent(new CustomEvent("diagnosticsChanged"));
    });
    this._build = build;
    this.dispatchEvent(new CustomEvent("compileStart"));
    const workerApi = await this._deferredTypeScriptWorkerApi.promise;
    if (build.state() !== "active") {
      return;
    }
    workerApi.compileProject((_b = this._files) !== null && _b !== void 0 ? _b : [], { importMap: this._importMap }, proxy((result) => build.onOutput(result)));
    await build.stateChange;
    if (build.state() !== "done") {
      return;
    }
    this.dispatchEvent(new CustomEvent("compileDone"));
  }
  async getCompletions(changeData) {
    var _a, _b, _c;
    const tokenUnderCursorAsString = changeData.tokenUnderCursor.trim();
    if (!changeData.isRefinement) {
      const workerApi = await this._deferredTypeScriptWorkerApi.promise;
      const completionInfo = await workerApi.getCompletions(changeData.fileName, changeData.fileContent, tokenUnderCursorAsString, changeData.cursorIndex, { importMap: this._importMap });
      if (completionInfo) {
        const getCompletionDetailsFunction = this._getCompletionDetails.bind(this);
        this._completionInfo = populateCompletionInfoWithDetailGetters(completionInfo, changeData.fileName, changeData.cursorIndex, getCompletionDetailsFunction);
      }
    }
    const skipFuzzySearch = changeData.tokenUnderCursor === "." || changeData.tokenUnderCursor === "";
    let completions = [];
    if (skipFuzzySearch) {
      completions = completionEntriesAsEditorCompletions((_a = this._completionInfo) === null || _a === void 0 ? void 0 : _a.entries, changeData.tokenUnderCursor);
    } else {
      completions = sortCompletionItems((_b = this._completionInfo) === null || _b === void 0 ? void 0 : _b.entries, tokenUnderCursorAsString);
    }
    void ((_c = completions[0]) === null || _c === void 0 ? void 0 : _c.details);
    return completions;
  }
  async _getCompletionDetails(filename, cursorIndex, completionWord) {
    const workerApi = await this._deferredTypeScriptWorkerApi.promise;
    const completionItemDetails = await workerApi.getCompletionItemDetails(filename, cursorIndex, { importMap: this._importMap }, completionWord);
    return completionItemDetails;
  }
  /**
   * A simple debouncer that aims for maximal responsiveness when compiles are fast.
   *
   * There is no meaning to when the returned promise resolves.
   */
  async saveDebounced() {
    if (this.savePending) {
      return;
    }
    this.savePending = true;
    await this.lastSave;
    this.savePending = false;
    this.lastSave = this.save();
  }
  isValidNewFilename(name) {
    var _a;
    if (!name) {
      return false;
    }
    const existing = (_a = this._files) === null || _a === void 0 ? void 0 : _a.find((file) => file.name === name);
    if (existing !== void 0) {
      return existing.hidden === true;
    }
    return true;
  }
  editFile(file, newContent) {
    file.content = newContent;
    this._modified = void 0;
    this.saveDebounced();
  }
  addFile(name) {
    var _a;
    if (!this._files || !this.isValidNewFilename(name)) {
      return;
    }
    const existing = (_a = this._files) === null || _a === void 0 ? void 0 : _a.find((file) => file.name === name);
    if ((existing === null || existing === void 0 ? void 0 : existing.hidden) === true) {
      existing.hidden = false;
    } else {
      this._files.push({
        name,
        content: "",
        contentType: typeFromFilename(name)
      });
    }
    this._modified = void 0;
    this.requestUpdate();
    this.dispatchEvent(new FilesChangedEvent());
    this.save();
  }
  deleteFile(filename) {
    if (!this._files) {
      return;
    }
    const idx = this._files.findIndex((file) => file.name === filename);
    if (idx < 0) {
      return;
    }
    this._files = [...this._files.slice(0, idx), ...this._files.slice(idx + 1)];
    this._modified = void 0;
    this.dispatchEvent(new FilesChangedEvent());
    this.save();
  }
  renameFile(oldName, newName) {
    if (!oldName || !this._files) {
      return;
    }
    if (!this.isValidNewFilename(newName)) {
      return;
    }
    const file = this._files.find((file2) => file2.name === oldName);
    if (!file) {
      return;
    }
    file.name = newName;
    file.contentType = typeFromFilename(newName);
    this._files = [...this._files];
    this._modified = void 0;
    this.dispatchEvent(new FilesChangedEvent());
    this.save();
  }
};
PlaygroundProject.styles = i2`
    iframe {
      display: none;
    }
  `;
__decorate([
  n({ attribute: "project-src", hasChanged: () => false })
], PlaygroundProject.prototype, "projectSrc", null);
__decorate([
  n({ attribute: false, hasChanged: () => false })
], PlaygroundProject.prototype, "config", null);
__decorate([
  t()
], PlaygroundProject.prototype, "_source", void 0);
__decorate([
  n({ attribute: "sandbox-base-url" })
], PlaygroundProject.prototype, "sandboxBaseUrl", void 0);
__decorate([
  n({ attribute: "sandbox-scope" })
], PlaygroundProject.prototype, "sandboxScope", void 0);
__decorate([
  t()
], PlaygroundProject.prototype, "_serviceWorkerAPI", void 0);
__decorate([
  i("slot")
], PlaygroundProject.prototype, "_slot", void 0);
__decorate([
  i("iframe")
], PlaygroundProject.prototype, "_serviceWorkerProxyIframe", void 0);
PlaygroundProject = __decorate([
  e("playground-project")
], PlaygroundProject);
var fetchProjectConfig = async (url, alreadyFetchedFilenames = /* @__PURE__ */ new Set(), alreadyFetchedConfigUrls = /* @__PURE__ */ new Set()) => {
  if (alreadyFetchedConfigUrls.has(url)) {
    throw new Error(`Circular project config extends: ${[
      ...alreadyFetchedConfigUrls.values(),
      url
    ].join(" extends ")}`);
  }
  alreadyFetchedConfigUrls.add(url);
  const resp = await fetch(url);
  if (resp.status !== 200) {
    throw new Error(`Error ${resp.status} fetching project config from ${url}: ${await resp.text()}`);
  }
  let config;
  try {
    config = await resp.json();
  } catch (e5) {
    throw new Error(`Error parsing project config JSON from ${url}: ${e5.message}`);
  }
  return await expandProjectConfig(config, url, alreadyFetchedFilenames, alreadyFetchedConfigUrls);
};
var expandProjectConfig = async (config, baseUrl, alreadyFetchedFilenames = /* @__PURE__ */ new Set(), alreadyFetchedConfigUrls = /* @__PURE__ */ new Set()) => {
  var _a, _b, _c, _d, _e;
  const filePromises = [];
  for (const [filename, info] of Object.entries((_a = config.files) !== null && _a !== void 0 ? _a : {})) {
    if (alreadyFetchedFilenames.has(filename)) {
      continue;
    }
    alreadyFetchedFilenames.add(filename);
    if (info.content === void 0) {
      filePromises.push((async () => {
        var _a2, _b2;
        const resp = await fetch(new URL(filename, baseUrl).href);
        return {
          ...info,
          name: filename,
          content: await resp.text(),
          contentType: (_b2 = (_a2 = resp.headers.get("Content-Type")) === null || _a2 === void 0 ? void 0 : _a2.toLowerCase()) !== null && _b2 !== void 0 ? _b2 : "text/plain"
        };
      })());
    } else {
      filePromises.push(Promise.resolve({
        ...info,
        name: filename,
        content: (_b = info.content) !== null && _b !== void 0 ? _b : "",
        contentType: (_c = typeFromFilename(filename)) !== null && _c !== void 0 ? _c : "text/plain"
      }));
    }
  }
  const extendsConfigPromise = config.extends ? fetchProjectConfig(new URL(config.extends, baseUrl).href, alreadyFetchedFilenames, alreadyFetchedConfigUrls) : void 0;
  const files = await Promise.all(filePromises);
  const importMap = (_d = config.importMap) !== null && _d !== void 0 ? _d : {};
  if (extendsConfigPromise) {
    const extendsConfig = await extendsConfigPromise;
    files.push(...extendsConfig.files);
    importMap.imports = {
      ...(_e = extendsConfig.importMap) === null || _e === void 0 ? void 0 : _e.imports,
      // Our imports take precedence over our parents.
      ...importMap.imports
    };
  }
  return { files, importMap };
};
var typeFromFilename = (filename) => {
  const idx = filename.lastIndexOf(".");
  if (idx === -1 || idx === filename.length - 1) {
    return void 0;
  }
  const extension = filename.slice(idx + 1);
  return typeEnumToMimeType(extension);
};
var typeEnumToMimeType = (type) => {
  if (type === void 0) {
    return;
  }
  switch (type) {
    // TypeScript
    case "ts":
      return "video/mp2t";
    case "js":
      return "application/javascript; charset=utf-8";
    case "json":
      return "application/json; charset=utf-8";
    case "jsx":
      return "text/jsx; charset=utf-8";
    case "tsx":
      return "text/typescript-jsx; charset=utf-8";
    case "html":
      return "text/html; charset=utf-8";
    case "css":
      return "text/css; charset=utf-8";
    // taken from MDN's common MIME types
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
    case "svg":
      return "image/svg+xml";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "jpeg":
    case "jpg":
      return "image/jpeg";
    case "ico":
      return "image/vnd.microsoft.icon";
    case "webp":
      return "image/webp";
    case "webm":
      return "video/webm";
    case "mid":
    case "midi":
      return "audio/midi";
    case "mp3":
      return "audio/mpeg";
    case "weba":
      return "audio/webm";
  }
  return void 0;
};
var validateImportMap = (importMap) => {
  const errors = [];
  if (typeof importMap !== "object" || importMap === null) {
    errors.push(`Import map is invalid because it must be an object, but it was ${importMap === null ? "null" : typeof importMap}.`);
    return errors;
  }
  const invalidKeys = Object.keys(importMap).filter((key) => key !== "imports");
  if (invalidKeys.length > 0) {
    errors.push(`Invalid import map properties: ${[...invalidKeys].join(", ")}. Only "imports" are currently supported.`);
  }
  const imports = importMap.imports;
  if (imports === void 0) {
    return errors;
  }
  if (typeof imports !== "object" || imports === null) {
    errors.push(`Import map "imports" property is invalid because it must be an object, but it was ${imports === null ? "null" : typeof imports}.`);
    return errors;
  }
  for (const [specifierKey, resolutionResult] of Object.entries(imports)) {
    if (typeof resolutionResult !== "string") {
      errors.push(`Import map key "${specifierKey}" is invalid because address must be a string, but was ${resolutionResult === null ? "null" : typeof resolutionResult}`);
      continue;
    }
    if (specifierKey.endsWith("/") && !resolutionResult.endsWith("/")) {
      errors.push(`Import map key "${specifierKey}" is invalid because address "${resolutionResult}" must end in a forward-slash.`);
    }
    try {
      new URL(resolutionResult);
    } catch {
      errors.push(`Import map key "${specifierKey}" is invalid because address "${resolutionResult}" is not a valid URL.`);
    }
  }
  return errors;
};
var outdent = (str) => {
  str = str.replace(/(^[\n\s]*\n)|(\n[\n\s]*$)/g, "");
  let shortestIndent;
  for (const line of str.split(/\n/g)) {
    const indent = line.match(/^\s*/)[0].length;
    if (shortestIndent === void 0 || indent < shortestIndent) {
      shortestIndent = indent;
    }
  }
  return str.replace(RegExp(`^\\s{${shortestIndent !== null && shortestIndent !== void 0 ? shortestIndent : 0}}`, "gm"), "");
};
var playgroundFilesDeepEqual = (filesA, filesB) => {
  if (filesA.length !== filesB.length) {
    return false;
  }
  for (let i4 = 0; i4 < filesA.length; i4++) {
    const fileA = filesA[i4];
    const fileB = filesB[i4];
    if (fileA.name !== fileB.name || fileA.contentType !== fileB.contentType || fileA.hidden !== fileB.hidden || fileA.label !== fileB.label) {
      return false;
    }
  }
  for (let i4 = 0; i4 < filesA.length; i4++) {
    const fileA = filesA[i4];
    const fileB = filesB[i4];
    if (fileA.content !== fileB.content) {
      return false;
    }
  }
  return true;
};
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/*! Bundled license information:

lit-html/directives/if-defined.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

playground-elements/_codemirror/codemirror-bundle.js:
  (* @license CodeMirror, copyright (c) by Marijn Haverbeke and others
  Distributed under an MIT license: https://codemirror.net/LICENSE *)

playground-elements/internal/codemirror.js:
playground-elements/internal/overlay.js:
playground-elements/playground-connected-element.js:
playground-elements/shared/completion-utils.js:
playground-elements/shared/version.js:
playground-elements/internal/build.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

playground-elements/playground-code-editor.js:
playground-elements/shared/deferred.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

playground-elements/playground-file-editor.js:
playground-elements/playground-preview.js:
playground-elements/shared/worker-api.js:
playground-elements/shared/util.js:
playground-elements/playground-project.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@material/dom/ponyfill.js:
  (**
   * @license
   * Copyright 2018 Google Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   * THE SOFTWARE.
   *)

@material/mwc-base/utils.js:
@material/mwc-base/base-element.js:
@material/mwc-ripple/mwc-ripple-base.js:
@material/mwc-ripple/mwc-ripple.js:
@material/mwc-icon-button/mwc-icon-button-base.js:
@material/mwc-icon-button/mwc-icon-button.js:
@material/mwc-linear-progress/mwc-linear-progress-base.js:
@material/mwc-linear-progress/mwc-linear-progress.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

@material/base/foundation.js:
@material/ripple/constants.js:
@material/ripple/foundation.js:
  (**
   * @license
   * Copyright 2016 Google Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   * THE SOFTWARE.
   *)

@material/mwc-ripple/mwc-ripple.css.js:
@material/mwc-icon-button/mwc-icon-button.css.js:
@material/mwc-linear-progress/mwc-linear-progress.css.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-LIcense-Identifier: Apache-2.0
   *)

@material/mwc-base/aria-property.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

@material/mwc-ripple/ripple-handlers.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)
*/
//# sourceMappingURL=playground-elements.js.map
