import{b,c as w}from"../../gb/chunks/chunk-2LNST52H.js";import{a as P,b as T}from"../../gb/chunks/chunk-Y4BZXR7F.js";import{a as l,b as E}from"../../gb/chunks/chunk-THNPU74B.js";import{a as n,b as f}from"../../gb/chunks/chunk-UUQJVX7P.js";import{a as S}from"../../gb/chunks/chunk-OZUV56YX.js";import{a as h,b as x,c as g}from"../../gb/chunks/chunk-SZVN5I3Q.js";import{a as u,b as k,h as D}from"../../gb/chunks/chunk-YRNKHAFN.js";function B(s,e){let r=e?.isDisabled??(()=>S(s)),c=!1;f(s,"keydown","keyup");let m=t=>t.key===" ",y=t=>t.key==="Enter",C=t=>{!(m(t)||y(t))||r()||n(t,()=>{t.defaultPrevented||(m(t)?(c=!0,t.preventDefault()):y(t)&&s.click())})},I=t=>{!m(t)||r()||n(t,()=>{let A=c;c=!1,!t.defaultPrevented&&A&&s.click()})},L=()=>{c=!1},p=new AbortController;return s.addEventListener("keydown",C,{signal:p.signal}),s.addEventListener("keyup",I,{signal:p.signal}),s.addEventListener("blur",L,{signal:p.signal}),()=>{p.abort()}}var K=T(w(E(D))),i=Symbol("isToggleDisabled"),o=Symbol("isTogglePressed"),a=class extends K{get[o](){return this[l].ariaPressed==="true"}set[o](e){e=!!e,this[l].ariaPressed=String(e),this[b]("selected",e)}get[i](){return this[l].ariaDisabled==="true"}set[i](e){e=!!e,this[l].ariaDisabled=String(e),this[b]("disabled",e),this[b]("enabled",!e),this[P]=!e}constructor(){super(),!!1&&(this[l].role="button",this[o]=!1,this[i]=!1,f(this,"click"),B(this),this.addEventListener("click",e=>{if(this[i]){e.stopImmediatePropagation(),e.preventDefault();return}let r=this[o];this[o]=!r,n(e,()=>{if(e.defaultPrevented){this[o]=r;return}this.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0})),this.dispatchEvent(new Event("change",{bubbles:!0}))})},{capture:!0}))}render(){return k`<slot></slot>`}};a.styles=u`
    :host {
      display: inline-flex;
      user-select: none;
    }
    :host(:state(enabled)) {
      cursor: pointer;
    }
  `;var d=class extends a{get selected(){return this[o]}set selected(e){let r=this.selected;this[o]=e,this.requestUpdate("selected",r)}get disabled(){return this[i]}set disabled(e){let r=this.disabled;this[i]=e,this.requestUpdate("disabled",r)}};d.styles=[a.styles,u`
      :host {
        background-color: ButtonFace;
        color: ButtonText;
      }
      :host(:state(selected)) {
        background-color: SelectedItem;
        color: SelectedItemText;
      }
      :host(:focus-visible) {
        outline: 2px solid AccentColor;
        outline-offset: 2px;
      }
      :host(:state(disabled)) {
        opacity: 38%;
      }
    `];h([g({type:Boolean,reflect:!0})],d.prototype,"selected",null);h([g({type:Boolean,reflect:!0})],d.prototype,"disabled",null);d=h([x("md-aria-toggle")],d);export{d as MdAriaToggleElement};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
