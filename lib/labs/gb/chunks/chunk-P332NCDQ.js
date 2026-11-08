import{b as f,c as h}from"./chunk-2LNST52H.js";import{b as d}from"./chunk-J4PPHVRR.js";import{a as t,b as c}from"./chunk-THNPU74B.js";import{a as u,b as m}from"./chunk-UUQJVX7P.js";import{a as o,b as n}from"./chunk-TY6MUWQF.js";import{a as i,b as a,h as p}from"./chunk-YRNKHAFN.js";function y(l,e){return e?l.getRootNode().querySelector(`#${e}`):null}var g=d(h(c(p))),r=class extends g{get tabpanel(){return this.tabpanelElement?.id||""}set tabpanel(e){this.tabpanelElement=y(this,e)}get tabpanelElement(){return this[t].ariaControlsElements?.[0]||null}set tabpanelElement(e){let s=this.tabpanelElement;e!==s&&(this[t].ariaControlsElements=e?[e]:[])}get selected(){return this[t].ariaSelected==="true"}set selected(e){let s=this.selected;e=!!e,this[t].ariaSelected=String(e),this[f]("selected",e),this.requestUpdate("selected",s)}constructor(){super(),!!1&&(this[t].role="tab",m(this,"keydown"),this.addEventListener("keydown",e=>{u(e,()=>{e.defaultPrevented||(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),this.click())})}))}render(){return a`<slot></slot>`}};r.styles=i`
    :host {
      display: inline-block;
      cursor: pointer;
    }
  `;o([n({type:String,reflect:!0,noAccessor:!0})],r.prototype,"tabpanel",null);o([n({type:Boolean,reflect:!0})],r.prototype,"selected",null);export{r as a};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
