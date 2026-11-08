import{a as p}from"../../gb/chunks/chunk-3DCH5ZD6.js";import{b as a}from"../../gb/chunks/chunk-Y4BZXR7F.js";import{a as r,b as m}from"../../gb/chunks/chunk-THNPU74B.js";import{a as l,c as i}from"../../gb/chunks/chunk-SZVN5I3Q.js";import{a as s,b as o,h as n}from"../../gb/chunks/chunk-YRNKHAFN.js";var c=a(m(n)),t=class extends c{get tab(){return this.tabElement?.id||""}set tab(e){this.tabElement=p(this,e)}get tabElement(){return this[r].ariaLabelledByElements?.[0]||null}set tabElement(e){this[r].ariaLabelledByElements=e?[e]:[]}constructor(){super(),!!1&&(this[r].role="tabpanel")}render(){return o`<slot></slot>`}};t.styles=s`
    :host(:not([hidden])) {
      display: block;
    }
  `;l([i({type:String,reflect:!0,noAccessor:!0})],t.prototype,"tab",null);customElements.define("md-aria-tabpanel",t);
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
