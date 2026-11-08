import{a as l}from"./chunk-THNPU74B.js";import{a as h}from"./chunk-L53ZTFE6.js";import{a as n,b as a,e as r}from"./chunk-YRNKHAFN.js";var c="nav-link-change",o=class{constructor(e){this.host=e,this.selected=!1,this.isLink=!1,this.handleClick=t=>{this.host.disabled&&t.preventDefault()},e.addController(this),e.addEventListener("keydown",t=>{e.href&&t.key===" "&&t.preventDefault()})}hostUpdated(){this.sync()}sync(){let{host:e}=this,t=!!e.href,i=e[l];t?(i.role="link",i.ariaSelected=null,i.ariaCurrent=this.selected?"page":null):this.isLink&&(i.role="tab",i.ariaCurrent=null,i.ariaSelected=String(this.selected)),t!==this.isLink&&(this.isLink=t,e.dispatchEvent(new Event(c,{bubbles:!0})))}activate(){return this.host.href?(this.host.disabled||this.anchor?.click(),!0):!1}render(){let{host:e}=this;return e.href?a`<a
      part="link"
      class="nav-link"
      href=${e.disabled?r:h(e.href)}
      target=${e.target||r}
      rel=${e.rel||r}
      tabindex="-1"
      aria-hidden="true"
      @click=${this.handleClick}></a>`:r}get anchor(){return this.host.renderRoot?.querySelector("a.nav-link")}},k=n`
  .nav-link {
    border-radius: inherit;
    inset: 0;
    position: absolute;
    z-index: 1;
  }
`;function p(s){return s.some(e=>!!e.href)}export{c as a,o as b,k as c,p as d};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
