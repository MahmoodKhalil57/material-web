import{a as c}from"./chunk-ISFB5CYH.js";import{l as m}from"./chunk-ONQX2M7Y.js";import{a as o,b as n}from"./chunk-THNPU74B.js";import{a}from"./chunk-SFW3MHH7.js";import{a as l}from"./chunk-AZF4SAF6.js";import{a as s,b as i,h as r}from"./chunk-YRNKHAFN.js";var p=n(r),e=class extends p{constructor(){super(),this[o].role="menuitem",this.addEventListener("keydown",t=>{t.defaultPrevented||(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),this.click())})}connectedCallback(){super.connectedCallback(),this.hasAttribute("tabindex")||(this.tabIndex=-1)}render(){return i`<div
      part="item"
      class="${m()} ripple-host focus-ring-host">
      <slot name="icon"></slot>
      <slot></slot>
    </div>`}};e.styles=[l,a,c,s`
      :host {
        display: flex;
        outline: none;
      }
      ::slotted(*) {
        flex: none;
      }
    `];export{e as a};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
