import{a as f}from"./chunk-EZKHESQI.js";import{b as p,c as b,d as v,f as i,j as E}from"./chunk-AEVMN2TV.js";import{a as o,b as g}from"./chunk-THNPU74B.js";import{a as s,b as l,c as u}from"./chunk-TY6MUWQF.js";import{g as m}from"./chunk-MZFGRIKD.js";import{a as h,b as r,e as c,h as d}from"./chunk-YRNKHAFN.js";var y=g(d),x=0,e=class extends y{get menu(){return this.menuContext?.menu||null}get items(){return(this.menuContext?.getItems?.()||[]).filter(t=>this.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_CONTAINED_BY)}constructor(){super(),this.checkable=null,this.label="",this.menuContext=null,this.inactive=!1,this.engaged=!1,this.hasBeenEngaged=!1,this.labelId=`md-gb-menu-group-label-${++x}`,this[o].role="group",this.addEventListener("change",n=>{if(this.checkable==="single"){let C=n.composedPath(),k=this.items;for(let a of k)!C.includes(a)&&a.checked&&(a.checked=!1)}});let t=n=>()=>{this.engaged=n,n&&(this.hasBeenEngaged=!0),this.inactive=this.hasBeenEngaged&&!this.isEngaged()};this.addEventListener("pointerenter",t(!0)),this.addEventListener("pointerleave",t(!1)),this.addEventListener("focusin",t(!0)),this.addEventListener("focusout",()=>{this.engaged=this.matches(":hover"),this.inactive=this.hasBeenEngaged&&!this.isEngaged()})}connectedCallback(){super.connectedCallback(),this.menuAbort=new AbortController,queueMicrotask(()=>{this.menu?.addEventListener("toggle",()=>{this.hasBeenEngaged=!1,this.engaged=!1,this.inactive=!1},{signal:this.menuAbort?.signal})})}disconnectedCallback(){super.disconnectedCallback(),this.menuAbort?.abort()}render(){return r`<div
      class=${m({[i.group]:!0,[i.groupInactive]:this.inactive,[i.menuGrouped]:this.menu?.layout==="grouped"})}
      part="group"
    >
      ${this.label?r`<div
              id=${this.labelId}
              class=${i.sectionLabel}
              part="label"
              aria-hidden="true"
            >
              ${this.label}
            </div>`:c}
      <slot></slot>
    </div>`}updated(){this[o].role=this.label?"group":"none",this[o].ariaLabel=this.label||null}isEngaged(){return this.engaged||this.matches(":focus-within")}};e.styles=[f,h`
      :host {
        display: contents;
      }
      :host([hidden]) {
        display: none;
      }
    `];s([p({context:E}),l({reflect:!0})],e.prototype,"checkable",void 0);s([l()],e.prototype,"label",void 0);s([b({context:v,subscribe:!0})],e.prototype,"menuContext",void 0);s([u()],e.prototype,"inactive",void 0);export{e as a};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
