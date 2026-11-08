import{a as v}from"./chunk-ISFB5CYH.js";import{a as S,b as M,d as C,i as w,k as E}from"./chunk-ONQX2M7Y.js";import{a as g}from"./chunk-VWE5E4LF.js";import{f as y}from"./chunk-UDQB6G66.js";import{a as f}from"./chunk-HSWNOLES.js";import{a as b}from"./chunk-SFW3MHH7.js";import{a as h}from"./chunk-AZF4SAF6.js";import{a as o,b as s,d as n}from"./chunk-TY6MUWQF.js";import{g as m}from"./chunk-MZFGRIKD.js";import{a as p,b as c,e as u,h as d}from"./chunk-YRNKHAFN.js";var _=f(d),t=class extends _{constructor(){super(...arguments),this.open=!1,this.color=S.primary,this.size="default",this.align=M.end}get items(){return(this.itemSlot?.assignedElements({flatten:!0})??[]).filter(e=>e instanceof HTMLElement)}connectedCallback(){super.connectedCallback(),this.hasUpdated&&this.setupMenu()}disconnectedCallback(){super.disconnectedCallback(),this.cleanup?.abort()}firstUpdated(){this.setupMenu()}updated(){y(this.open,{trigger:this.renderRoot.querySelector("#button"),region:this.renderRoot.querySelector("#list")})}render(){let{ariaLabel:e}=this;return c`<div
      part="fab-menu"
      class="${m(C({color:this.color,open:this.open,align:this.align}))}">
      <div
        part="list"
        class="fab-menu-list"
        id="list"
        role="menu"
        aria-labelledby="button">
        <slot></slot>
      </div>
      <button
        part="button"
        id="button"
        class="${E({color:this.color,size:this.size})}"
        aria-label="${e||u}"
        aria-haspopup="menu">
        <span class="fab-menu-button-icon" aria-hidden="true">
          <slot name="icon"
            ><span class="fab-menu-icon-font">add</span></slot
          >
        </span>
        <span class="fab-menu-button-close-icon" aria-hidden="true">
          <slot name="close-icon"
            ><span class="fab-menu-icon-font">close</span></slot
          >
        </span>
      </button>
    </div>`}setupMenu(){let e=this.root;if(!e)return;this.cleanup?.abort(),this.cleanup=new AbortController;let{signal:i}=this.cleanup;w(e,{signal:i,getItems:()=>this.items}),e.addEventListener("toggle",a=>{let{newState:r,oldState:L}=a,l=new ToggleEvent("toggle",{newState:r,oldState:L,cancelable:!0});if(this.dispatchEvent(l),l.defaultPrevented){a.preventDefault();return}this.open=r==="open"},{signal:i})}};t.styles=[h,b,g,v,p`
      :host {
        display: inline-flex;
        vertical-align: bottom;
      }
      slot[name] {
        display: contents;
      }
    `];o([s({type:Boolean,reflect:!0})],t.prototype,"open",void 0);o([s()],t.prototype,"color",void 0);o([s()],t.prototype,"size",void 0);o([s()],t.prototype,"align",void 0);o([n(".fab-menu")],t.prototype,"root",void 0);o([n(".fab-menu-list slot")],t.prototype,"itemSlot",void 0);export{t as a};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
