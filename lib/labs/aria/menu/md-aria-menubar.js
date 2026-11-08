import{a as i}from"../../gb/chunks/chunk-OQSCP7HS.js";import{a as e,b as n}from"../../gb/chunks/chunk-THNPU74B.js";import{a as t,b as o,h as s}from"../../gb/chunks/chunk-YRNKHAFN.js";var d=n(s),r=class extends d{constructor(){super(),this[e].role="menubar",this[e].ariaOrientation="horizontal"}updated(a){super.updated(a),this.hasAttribute("focusgroup")||this.setAttribute("focusgroup","menubar")}render(){return o`<slot></slot>`}};r.styles=[t`
      :host {
        display: inline-flex;
        flex-direction: row;
        width: max-content;
        background-color: transparent;
        gap: 0.5em;
        border-width: 1px;
        border-style: solid;
        border-color: currentcolor;
        border-image: none;
        border-radius: 0.25em;
        padding: 0.25em;
      }
    `,i];customElements.define("md-aria-menubar",r);
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
