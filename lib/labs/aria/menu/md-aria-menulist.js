import{a}from"../../gb/chunks/chunk-OQSCP7HS.js";import{a as o,b as p}from"../../gb/chunks/chunk-THNPU74B.js";import{a as r,c as l}from"../../gb/chunks/chunk-SZVN5I3Q.js";import{a as s,b as i,h as n}from"../../gb/chunks/chunk-YRNKHAFN.js";var u=p(n),e=class extends u{constructor(){super(),this.popover="auto",this.opener=null,this[o].role="menu",this[o].ariaOrientation="vertical",this.addEventListener("toggle",this.handleToggle.bind(this)),this.addEventListener("focusout",this.handleFocusout.bind(this))}updated(t){super.updated(t),this.hasAttribute("focusgroup")||this.setAttribute("focusgroup","menu")}render(){return i`<slot></slot>`}handleToggle(t){t.newState==="open"?this.opener=t.source:t.newState==="closed"&&this.matches(":focus-within")&&this.opener?.focus?.()}handleFocusout(){this.matches(":focus-within")||this.hidePopover()}};e.styles=[a,s`
      /* Unset UA |[popover]| styles. */
      @layer {
        :host([popover]) {
          position: unset;
          width: unset;
          height: unset;
          color: unset;
          background-color: unset;
          inset: unset;
          margin: unset;
          border: unset;
          border-image: unset;
          padding: unset;
          overflow: unset;
        }

        :host([popover]:popover-open) {
          display: unset;
          overlay: unset;
        }
      }

      :host {
        display: block;
        position: fixed;
        width: max-content;
        max-block-size: stretch;
        color: canvastext;
        background-color: canvas;
        margin: 0px;
        inset: auto;
        overflow: auto;
        border: 1px solid currentColor;
        border-image: none;
        padding: 0.25em;
        position-area: block-end span-inline-end;
        position-try-fallbacks:
          flip-block,
          flip-inline,
          flip-block flip-inline;
      }

      :host(:not(:popover-open)) {
        display: none;
      }
    `];r([l({reflect:!0})],e.prototype,"popover",void 0);customElements.define("md-aria-menulist",e);
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
