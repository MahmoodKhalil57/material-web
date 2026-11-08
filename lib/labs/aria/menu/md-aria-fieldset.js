import{a as n,b as p,c as l}from"../../gb/chunks/chunk-YCTUUDJK.js";import{a as f}from"../../gb/chunks/chunk-OQSCP7HS.js";import{a as c,b as d}from"../../gb/chunks/chunk-THNPU74B.js";import{a as s,c as r}from"../../gb/chunks/chunk-SZVN5I3Q.js";import{a as o,b as m,h as a}from"../../gb/chunks/chunk-YRNKHAFN.js";var h=d(a),i=class extends h{get items(){return this.querySelectorAll("md-aria-menuitem")}get disabled(){return this.internalDisabled}set disabled(e){this.internalDisabled=e;for(let t of this.items)t[n]?.()}get checkable(){return this.internalCheckable}set checkable(e){if(typeof e=="string"){let t=e.toLowerCase();t==="single"||t==="multiple"?e=t:e="multiple"}this.internalCheckable=e,e==="single"&&this[l](null);for(let t of this.items)t[n]?.()}constructor(){super(),this.internalDisabled=!1,this.internalCheckable=null,this[c].role="group"}render(){return m`<slot></slot>`}[l](e){for(let t of this.items)t!==e&&t[p]?.(!1)}};i.styles=[f,o`
      :host {
        display: block;
        margin-inline: 2px;
        border: groove 2px ThreeDFace;
        padding-block: 0.35em 0.625em;
        padding-inline: 0.75em;
        min-inline-size: min-content;
      }
    `];s([r({type:Boolean,reflect:!0})],i.prototype,"disabled",null);s([r({type:String,reflect:!0})],i.prototype,"checkable",null);customElements.define("md-aria-fieldset",i);
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
