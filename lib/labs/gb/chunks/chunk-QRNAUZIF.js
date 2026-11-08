import{a as g}from"./chunk-AAAYAAZS.js";import{c as p,d as c}from"./chunk-RRK5JWGV.js";import{a as t,b as n,c as h}from"./chunk-TY6MUWQF.js";import{a as r,b as a,e as i,h as d}from"./chunk-YRNKHAFN.js";var e=class extends d{constructor(){super(...arguments),this.max=999,this.label="New notification",this.anchored=!1,this.hasContent=!1}willUpdate(){this.toggleAttribute("large",this.value!==void 0&&this.value!==null||this.hasContent)}render(){let o=this.value===void 0||this.value===null?void 0:c(this.value,this.max),s=o!==void 0||this.hasContent;return a`<span part="badge" class="${p({large:s})}">
      ${o??i}
      <slot
        ?hidden=${o!==void 0}
        @slotchange=${this.handleSlotChange}></slot>
      ${!s&&this.label?a`<span class="badge-label">${this.label}</span>`:i}
    </span>`}handleSlotChange(o){let u=o.target.assignedNodes();this.hasContent=u.some(l=>l.nodeType===Node.TEXT_NODE?(l.textContent??"").trim().length>0:!0)}};e.styles=[g,r`
      :host {
        display: inline-flex;
      }
      /*
       * Anchored to the top trailing corner of the nearest positioned
       * ancestor (the icon's bounding box), in logical directions so it
       * mirrors for right-to-left. The leading corner of the badge's bottom
       * edge sits 6dp below the top and 6dp inside the trailing edge for a
       * small badge, 14dp and 12dp for a large one; a growing count extends
       * toward the trailing side and keeps the same placement.
       */
      :host([anchored]) {
        position: absolute;
        inset-block-end: calc(100% - 6px);
        inset-inline-start: calc(100% - 6px);
      }
      :host([anchored][large]) {
        inset-block-end: calc(100% - 14px);
        inset-inline-start: calc(100% - 12px);
      }
      .badge {
        flex: 1;
      }
    `];t([n({type:Number})],e.prototype,"value",void 0);t([n({type:Number})],e.prototype,"max",void 0);t([n()],e.prototype,"label",void 0);t([n({type:Boolean,reflect:!0})],e.prototype,"anchored",void 0);t([h()],e.prototype,"hasContent",void 0);export{e as a};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
