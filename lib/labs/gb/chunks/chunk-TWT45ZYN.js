import{a as u}from"./chunk-3DCH5ZD6.js";import{b as h,c as f}from"./chunk-2LNST52H.js";import{b as d}from"./chunk-Y4BZXR7F.js";import{a as e,b as p}from"./chunk-THNPU74B.js";import{a as m,b as c}from"./chunk-UUQJVX7P.js";import{a as o,c as i}from"./chunk-SZVN5I3Q.js";import{a as n,b as l,h as a}from"./chunk-YRNKHAFN.js";var b=d(f(p(a))),r=class extends b{get tabpanel(){return this.tabpanelElement?.id||""}set tabpanel(t){this.tabpanelElement=u(this,t)}get tabpanelElement(){return this[e].ariaControlsElements?.[0]||null}set tabpanelElement(t){let s=this.tabpanelElement;t!==s&&(this[e].ariaControlsElements=t?[t]:[])}get selected(){return this[e].ariaSelected==="true"}set selected(t){let s=this.selected;t=!!t,this[e].ariaSelected=String(t),this[h]("selected",t),this.requestUpdate("selected",s)}constructor(){super(),!!1&&(this[e].role="tab",c(this,"keydown"),this.addEventListener("keydown",t=>{m(t,()=>{t.defaultPrevented||(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),this.click())})}))}render(){return l`<slot></slot>`}};r.styles=n`
    :host {
      display: inline-block;
      cursor: pointer;
    }
  `;o([i({type:String,reflect:!0,noAccessor:!0})],r.prototype,"tabpanel",null);o([i({type:Boolean,reflect:!0})],r.prototype,"selected",null);export{r as a};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
