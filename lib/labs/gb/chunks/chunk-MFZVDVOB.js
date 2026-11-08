import{a as b}from"./chunk-VWE5E4LF.js";import{a,h as m}from"./chunk-UDQB6G66.js";import{c as f,f as g,g as y}from"./chunk-22NDCS7S.js";import{a as d}from"./chunk-HSWNOLES.js";import{a as u}from"./chunk-SFW3MHH7.js";import{a as h}from"./chunk-AZF4SAF6.js";import{a as o,c as l}from"./chunk-SZVN5I3Q.js";import{a as p,b as r,e as i,h as c}from"./chunk-YRNKHAFN.js";var v=d(c),e=class extends v{constructor(){super(...arguments),this.color="primary-container",this.size="default",this.label="",this.expanded=!0,this.tooltip=!0,this.scrollTarget="",this.disclosure=new m(this,{expanded:()=>this.expanded,setExpanded:t=>{this.expanded=t},aria:!1})}connectedCallback(){super.connectedCallback(),this.hasUpdated&&this.listenToScroll()}disconnectedCallback(){super.disconnectedCallback(),this.scrollCleanup?.abort(),this.scrollCleanup=void 0}render(){let{ariaLabel:t}=this,s=this.label?r`<span part="label" class="${f.fabLabel}"
          >${this.label}</span
        >`:i,n=this.label||t,x=!this.label||!this.expanded,C=this.tooltip&&x&&n?r`<md-gb-tooltip for="fab">${n}</md-gb-tooltip>`:i;return r`<button
      id="fab"
      part="fab"
      class="${g({color:this.color,size:this.size,expanded:this.expanded})}"
      aria-label=${t||i}>
      <slot></slot>${s}
    </button>${C}`}updated(t){t.has("scrollTarget")&&this.listenToScroll()}listenToScroll(){this.scrollCleanup?.abort(),this.scrollCleanup=void 0;let t=this.resolveScrollTarget();t&&(this.scrollCleanup=new AbortController,y(t,s=>{s?this.disclosure.expand():this.disclosure.collapse()},{signal:this.scrollCleanup.signal}))}resolveScrollTarget(){let t=this.scrollTarget;return t?t==="window"?window:this.getRootNode().getElementById?.(t)??document.getElementById(t):null}};e.shadowRootOptions={mode:"open",delegatesFocus:!0};e.styles=[h,u,b,p`
      :host {
        display: inline-flex;
        vertical-align: middle;
      }
      .fab {
        flex: 1;
      }
    `];o([l()],e.prototype,"color",void 0);o([l()],e.prototype,"size",void 0);o([l()],e.prototype,"label",void 0);o([l({type:Boolean,converter:a})],e.prototype,"expanded",void 0);o([l({type:Boolean,converter:a})],e.prototype,"tooltip",void 0);o([l({attribute:"scroll-target"})],e.prototype,"scrollTarget",void 0);export{e as a};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
