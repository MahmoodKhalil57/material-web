import{f as u}from"./chunk-BX5ELK2G.js";import{d as f}from"./chunk-L3PXXNKW.js";import{a as o,c as a,d as c}from"./chunk-SZVN5I3Q.js";import{a as b}from"./chunk-DWMAQFPI.js";import{f as m}from"./chunk-3NK4CXDR.js";import{a as v,b as r,h as g}from"./chunk-YRNKHAFN.js";var y={compact:{trailingActions:2},expanded:{trailingActions:4}},e=class extends g{constructor(){super(...arguments),this.size="sm",this.variant="standard",this.scrolled=!1,this.scrollTarget="",this.scrollController=new u(this,{behavior:()=>this.scrollBehavior,target:()=>this.scrollTarget,hiddenTransform:"translateY(-100%)",onScrolledChange:t=>{(this.scrollBehavior==="compress"||this.scrollBehavior==="hide"&&this.size==="sm")&&(this.scrolled=t,this.dispatchEvent(new CustomEvent("scrollstatechange",{bubbles:!0,composed:!0,detail:{scrolled:t}})))}}),this.centered=!1,this.adaptive=new f(this,{base:{trailingActions:2},options:y}),this.overflowed=[],this.hiddenByOverflow=new WeakSet,this.hasSubtitle=!1,this.hasLeading=!1}get overflowedActions(){return this.overflowed}render(){let t=this.variant!=="search"&&this.hasSubtitle,n=this.scrolled?"sm":this.size,d=m({size:n,withSubtitle:t,variant:this.variant,scrolled:this.scrolled,centered:this.centered,hasLeading:this.hasLeading}),i=r`<div class="app-bar-leading">
      <slot name="leading" @slotchange=${this.handleLeadingSlotChange}></slot>
    </div>`,h=r`<div class="app-bar-trailing">
      <slot
        name="trailing"
        @slotchange=${this.handleTrailingSlotChange}></slot>
      <slot name="overflow" ?hidden=${this.overflowed.length===0}></slot>
    </div>`;if(this.variant==="search")return r`<div part="app-bar" class="${d}">
        ${i}
        <div class="app-bar-search-container">
          <div class="app-bar-search-bar">
            <slot name="search"></slot>
          </div>
        </div>
        ${h}
      </div>
      <slot name="tabs"></slot>`;let s=r`<div class="app-bar-title-wrapper">
      <div class="app-bar-image"><slot name="image"></slot></div>
      <div class="app-bar-title">
        <slot></slot>
      </div>
      <div class="app-bar-subtitle">
        <slot
          name="subtitle"
          @slotchange=${this.handleSubtitleSlotChange}></slot>
      </div>
    </div>`,l=r`<slot name="tabs"></slot>`;return n==="md"||n==="lg"?r`<div part="app-bar" class="${d}">
        <div class="app-bar-top-row">${i}${h}</div>
        <div class="app-bar-bottom-row">${s}</div>
      </div>${l}`:r`<div part="app-bar" class="${d}">
      ${i}${s}${h}
    </div>${l}`}updated(){this.updateOverflow()}updateOverflow(){let n=this.shadowRoot?.querySelector('slot[name="trailing"]')?.assignedElements({flatten:!0})??[],d=this.adaptive.options.trailingActions,i=[];n.forEach((s,l)=>{l>=d?(i.push(s),this.hiddenByOverflow.add(s),s.toggleAttribute("hidden",!0)):this.hiddenByOverflow.has(s)&&(this.hiddenByOverflow.delete(s),s.toggleAttribute("hidden",!1))}),!(i.length===this.overflowed.length&&i.every((s,l)=>s===this.overflowed[l]))&&(this.overflowed=i,this.toggleAttribute("overflowing",i.length>0),this.dispatchEvent(new CustomEvent("overflowchange",{detail:{overflowed:i},bubbles:!0,composed:!0})))}handleTrailingSlotChange(){this.updateOverflow()}handleSubtitleSlotChange(t){this.hasSubtitle=w(t.target)}handleLeadingSlotChange(t){this.hasLeading=w(t.target)}};e.styles=[b,v`
      :host {
        display: flex;
        flex-direction: column;
        width: 100%;
        position: relative;
      }
      /* Lets the inner bar read its stuck state (scrolled color) in CSS. */
      @supports (container-type: scroll-state) {
        :host {
          container-type: scroll-state;
        }
      }
    `];o([a({reflect:!0})],e.prototype,"size",void 0);o([a({reflect:!0})],e.prototype,"variant",void 0);o([a({type:Boolean,reflect:!0})],e.prototype,"scrolled",void 0);o([a({attribute:"scroll-behavior",reflect:!0})],e.prototype,"scrollBehavior",void 0);o([a({attribute:"scroll-target"})],e.prototype,"scrollTarget",void 0);o([a({type:Boolean,reflect:!0})],e.prototype,"centered",void 0);o([c()],e.prototype,"overflowed",void 0);o([c()],e.prototype,"hasSubtitle",void 0);o([c()],e.prototype,"hasLeading",void 0);function w(p){return p.assignedNodes({flatten:!0}).some(t=>t.nodeType===Node.ELEMENT_NODE||t.textContent?.trim())}export{y as a,e as b};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
