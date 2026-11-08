import{a as M,b as v}from"./chunk-6P3XTZD5.js";import{e as G}from"./chunk-AIE5VUYP.js";import{a as U}from"./chunk-YPLN57LF.js";import{a as L,d as X}from"./chunk-7MVIFZWH.js";import{c as z}from"./chunk-UCJN52SI.js";import{g as V}from"./chunk-ZEJ74G6U.js";import{a as A,q as W}from"./chunk-NW7G5JJC.js";import{e as P}from"./chunk-P6LKPJG5.js";import{a as q}from"./chunk-THNPU74B.js";import{a as R}from"./chunk-SFW3MHH7.js";import{a as B}from"./chunk-AZF4SAF6.js";import{c as D}from"./chunk-Q4E4VNSB.js";import{a as F}from"./chunk-RRSR2DPT.js";import{a as s,b as h,c as b,d as x}from"./chunk-TY6MUWQF.js";import{a as N,b as g,e as y}from"./chunk-YRNKHAFN.js";var H=["md-gb-icon-button",".icon-btn",".nav-rail-menu-button","[data-nav-rail-toggle]","[nav-rail-toggle]"].join(", "),w="md-gb-fab, .fab";function K(C){let t=C instanceof v?C.shadowRoot:null,e=t?.querySelector(".nav-rail-item");if(!t||!e)return{icon:null,label:null,pill:null};let i=e.classList.contains("nav-rail-item-horizontal");return{icon:t.querySelector(".nav-rail-item-icon"),label:t.querySelector(".nav-rail-item-label"),pill:t.querySelector(i?".nav-rail-item-content":".nav-rail-item-indicator")}}var j=.5,Y=125,a=class extends U{constructor(){super(...arguments),this.orientation="vertical",this.rovingFocus=new P(this,{items:()=>this.tabs,orientation:"both",homeEnd:!1,tabStops:"all"}),this.divider=!1,this.elevated=!1,this.expanded=!1,this.collapsible=!1,this.modal=!1,this.hideWhenCollapsed=!1,this.narrow=!1,this.dragOffset=null,this.modalSurface=new V(this,{isOpen:()=>this.isModal&&this.expanded,modal:()=>this.isModal,surface:()=>this,scrim:()=>this.shadowRoot?.querySelector(".nav-rail-scrim")??null,onCloseRequest:t=>{t===A?this.handleBack():this.collapseFor(t)}}),this.dragWidth=0,this.dragDirection=1,this.alignment="top",this.itemLayout="vertical",this.hasHeader=!1,this.hasSlottedToggle=!1,this.menuButtonAbortController=null,this.morphFrom=null,this.swipe=new z(this,{axis:"x",target:()=>this.isConnected&&this.isModal&&this.expanded?this.railElement:null,anchors:()=>[0,this.railElement?.offsetWidth??0],value:()=>0,reverse:()=>!this.railIsRtl(),velocityThreshold:Y,positionalThreshold:t=>t*j,disabled:()=>!(this.isModal&&this.expanded),onDragStart:()=>{this.dragWidth=this.railElement?.offsetWidth??0,this.dragDirection=this.railIsRtl()?-1:1,this.dragOffset=0},onDrag:t=>{this.dragOffset=t},onSettle:t=>{this.dragOffset=null,this.dragWidth>0&&t===this.dragWidth&&this.collapseFor("swipe")},onCancel:()=>{this.dragOffset=null}}),this.syncRole=()=>{let t=this[q];X(this.tabs)?(t.role="navigation",t.ariaOrientation=null):(t.role="tablist",t.ariaOrientation=this.orientation)}}get isModal(){return this.modal||this.hideWhenCollapsed}get selectedIndex(){return this.selectedTabIndex}set selectedIndex(t){this.selectedTabIndex=t}toggle(t){let e=t!==void 0?!!t:!this.expanded;if(this.expanded===e)return this.expanded;this.hasUpdated&&this.isConnected&&!this.morphFrom&&(this.morphFrom=this.measureMorph()),this.expanded=e;let i=this.collapseReason;return this.collapseReason=void 0,this.dispatchEvent(new CustomEvent("toggle",{bubbles:!0,composed:!0,detail:{expanded:this.expanded,reason:i}})),this.expanded}expand(){this.toggle(!0)}collapseFor(t){this.collapseReason=t,this.toggle(!1),this.collapseReason=void 0}collapse(){this.toggle(!1)}connectedCallback(){super.connectedCallback(),this.addEventListener(L,this.syncRole),F(this,[B,R,M])}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(L,this.syncRole),this.menuButtonAbortController?.abort(),this.menuButtonAbortController=null}willUpdate(t){super.willUpdate(t),t.has("expanded")&&this.hasUpdated&&this.isConnected&&!this.morphFrom&&(this.morphFrom=this.measureMorph())}updated(t){if(super.updated(t),(t.has("expanded")||t.has("itemLayout"))&&(this.syncItemsLayout(),this.syncHeaderState()),this.morphFrom){let e=this.morphFrom;this.morphFrom=null,this.morph(e)}t.has("collapsible")&&this.setupBuiltInMenuButton()}async handleBack(){if(!this.isModal||!this.expanded)return;let t=this.railElement,e=t?W(t,{kind:"side",edge:"start"}):null;if(await e?.finished,!this.isModal||!this.expanded){e?.cancel();return}this.collapseFor(A),await e?.settle()}render(){let t=this.expanded?"horizontal":this.itemLayout,e=this.hasHeader||this.collapsible,i=this.collapsible&&!this.hasSlottedToggle,o=this.isModal&&this.expanded,c=o&&this.dragOffset!==null,r=c?`translate: ${-this.dragDirection*this.dragOffset}px 0`:y,u=g`
      <div
        part="nav-rail"
        class="${G({alignment:this.alignment,expanded:this.expanded,itemLayout:t,modal:this.isModal,narrow:this.narrow,dragging:c})}"
        style=${r}>
        <div
          part="header"
          class="nav-rail-header"
          ?hidden=${!e}
          @click=${this.handleHeaderClick}>
          ${i?g`
                <button
                  type="button"
                  part="menu-button"
                  class="nav-rail-menu-button ripple focus-ring-inner"
                  aria-label=${this.expanded?"Collapse navigation rail":"Expand navigation rail"}
                  aria-expanded=${this.expanded?"true":"false"}
                  @click=${this.handleMenuButtonClick}>
                  <span aria-hidden="true">
                    ${this.expanded?"menu_open":"menu"}
                  </span>
                </button>
              `:y}
          <slot name="header" @slotchange=${this.handleHeaderSlotChange}></slot>
        </div>
        <div part="items" class="nav-rail-items">
          <slot @slotchange=${this.handleSlotChange}></slot>
        </div>
      </div>
    `;if(!this.isModal)return u;let m=c&&this.dragWidth>0?`opacity: ${1-this.dragOffset/this.dragWidth}`:y;return g`<div
      class="nav-rail-modal-host ${this.narrow?"nav-rail-modal-host-narrow":""}">
      ${o?g`<div
            part="scrim"
            class="nav-rail-scrim"
            style=${m}
            aria-hidden="true"></div>`:y}
      ${u}
    </div>`}railIsRtl(){let t=this.railElement;return!!t&&getComputedStyle(t).direction==="rtl"}setupBuiltInMenuButton(){this.menuButtonAbortController?.abort(),this.menuButtonAbortController=null,this.menuButtonElement&&(this.menuButtonAbortController=new AbortController,D(this.menuButtonElement,{signal:this.menuButtonAbortController.signal}))}handleMenuButtonClick(t){t.stopPropagation(),this.toggle()}handleHeaderClick(t){if(t.defaultPrevented)return;let e=this.headerSlot?.assignedElements({flatten:!0})??[];if(e.length===0)return;let i=t.composedPath();for(let o of i)if(o instanceof HTMLElement){if(o.matches(w)||o.hasAttribute("data-nav-rail-no-toggle"))return;if(e.includes(o)&&o.matches(H)){this.toggle();return}}}handleHeaderSlotChange(t){let i=t.target.assignedElements({flatten:!0});this.hasHeader=i.length>0,this.hasSlottedToggle=i.some(o=>o instanceof HTMLElement&&!o.matches(w)&&!o.hasAttribute("data-nav-rail-no-toggle")&&o.matches(H)),this.syncHeaderState(),this.setupBuiltInMenuButton()}syncHeaderState(){let t=this.headerSlot?.assignedElements({flatten:!0})??[];for(let e of t)if(e instanceof HTMLElement){if(!e.matches(w)&&!e.hasAttribute("data-nav-rail-no-toggle")&&e.matches(H)){e.setAttribute("aria-expanded",String(this.expanded));let i=e.querySelector("md-gb-icon, .md-icon")??(e.matches("md-gb-icon, .md-icon")?e:null);if(i){let o=this.expanded?"menu_open":"menu";for(let c of Array.from(i.childNodes))if(c.nodeType===Node.TEXT_NODE){let r=c.textContent?.trim();(r==="menu"||r==="menu_open")&&r!==o&&(c.textContent=o)}}}else if(e.matches("md-gb-fab")&&"expanded"in e)e.expanded=this.expanded;else if(e.matches(w)){let i=e.querySelectorAll(":scope > :not(md-gb-icon, .md-icon)");for(let o of Array.from(i))o instanceof HTMLElement&&o.toggleAttribute("hidden",!this.expanded)}}}handleSlotChange(){super.handleSlotChange(),this.syncRole(),this.syncItemsLayout()}measureMorph(){let t=new Map,e=this.shadowRoot?.querySelector("slot:not([name])");for(let i of e?.assignedElements({flatten:!0})??[]){let o=K(i);t.set(i,{box:i.getBoundingClientRect(),icon:o.icon?.getBoundingClientRect()??null,pill:o.pill?.getBoundingClientRect()??null,selected:i instanceof v&&i.selected})}return t}async morph(t){let e=[...t.keys()];await Promise.all(e.map(n=>n.updateComplete));let i=this.railElement,o=this.shadowRoot?.querySelector(".nav-rail-items");if(!i||!o)return;let c=matchMedia("(prefers-reduced-motion: reduce)").matches,r=getComputedStyle(i),u={duration:parseFloat(r.getPropertyValue("--motion-duration"))||420,easing:r.getPropertyValue("--motion-easing").trim()||"ease"},m={duration:parseFloat(r.getPropertyValue("--md-sys-motion-spring-default-effects-duration"))||220,easing:r.getPropertyValue("--md-sys-motion-spring-default-effects").trim()||"ease",fill:"backwards"},S=[o];for(let n of e){let l=n instanceof v?n.shadowRoot:null;S.push(...l?.querySelectorAll(".nav-rail-item, .nav-rail-item-content, .nav-rail-item-indicator, .nav-rail-item-icon, .nav-rail-item-label")??[])}for(let n of S)n.style.transition="none";let I=parseFloat(r.getPropertyValue(this.expanded?"--expanded-container-width-minimum":this.narrow?"--collapsed-narrow-container-width":"--container-width"));I>0&&(o.style.inlineSize=`${I}px`,o.style.overflowX="hidden",i.style.overflow="clip");let T=o.getBoundingClientRect(),$=n=>n.bottom>T.top&&n.top<T.bottom;for(let n of e){let l=t.get(n),E=n.getBoundingClientRect();if(!E.width||!$(E))continue;if(!l.box.width){n.animate({opacity:[0,1]},m);continue}let d=K(n);if(d.label?.animate({opacity:[0,1]},m),c)continue;let f=d.icon?.getBoundingClientRect(),O=!!f&&!!l.icon&&$(l.icon)&&Math.abs(l.icon.top-f.top)<=E.height;if(d.icon&&f&&l.icon&&!O)d.icon.animate({opacity:[0,1]},m);else if(d.icon&&f&&l.icon){let p=l.icon.left-f.left,k=l.icon.top-f.top;(p||k)&&d.icon.animate({translate:[`${p}px ${k}px`,"0px 0px"]},u)}let _=n.selected;if(d.pill&&_&&(!O||!l.selected))d.pill.animate({opacity:[0,1]},{...m,pseudoElement:"::before"});else if(d.pill&&l.pill&&_){let p=d.pill.getBoundingClientRect();d.pill.animate({inset:[`${l.pill.top-p.top}px ${p.right-l.pill.right}px ${p.bottom-l.pill.bottom}px ${l.pill.left-p.left}px`,"0px"]},{...u,pseudoElement:"::before"})}}await new Promise(n=>setTimeout(n,c?0:Number(u.duration)+50)),o.style.inlineSize="",o.style.overflowX="",i.style.overflow="";for(let n of S)n.style.transition=""}syncItemsLayout(){let t=this.expanded?"horizontal":this.itemLayout;for(let e of this.tabs)e instanceof v?e.itemLayout=t:e.setAttribute("item-layout",t)}};a.styles=[B,R,M,N`
      :host {
        block-size: 100%;
        display: inline-flex;
        flex-direction: column;
        outline: none;
      }

      .nav-rail ::slotted(:focus-within),
      .nav-rail-items ::slotted(:focus-within) {
        z-index: 1;
      }

      /* Hide when collapsed: no collapsed rail, no space in the layout. */
      :host([hide-when-collapsed]:not([expanded])) {
        display: none;
      }

      :host([hide-when-collapsed]) .nav-rail-modal-host {
        inline-size: 0;
      }

      /* Navigation rail, Divider: on the edge next to the content. */
      :host([divider]) .nav-rail {
        border-inline-end: 1px solid var(--md-sys-color-outline-variant);
      }

      /* Scrolling: elevating the rail to level 1 separates it from content. */
      :host([elevated]) .nav-rail {
        box-shadow: var(--md-sys-elevation-shadow-1);
      }

      /* Secondary destinations show only in the expanded rail. */
      :host(:not([expanded])) ::slotted(md-gb-nav-rail-item[secondary]) {
        display: none;
      }

      .nav-rail-header ::slotted(md-gb-icon-button),
      .nav-rail-header ::slotted(.icon-btn),
      .nav-rail-header ::slotted([data-nav-rail-toggle]),
      .nav-rail-header ::slotted([nav-rail-toggle]) {
        margin-inline-start: 8px;
      }
    `];s([h({type:Boolean,reflect:!0})],a.prototype,"divider",void 0);s([h({type:Boolean,reflect:!0})],a.prototype,"elevated",void 0);s([h({type:Boolean,reflect:!0})],a.prototype,"expanded",void 0);s([h({type:Boolean,reflect:!0})],a.prototype,"collapsible",void 0);s([h({type:Boolean,reflect:!0})],a.prototype,"modal",void 0);s([h({type:Boolean,reflect:!0,attribute:"hide-when-collapsed"})],a.prototype,"hideWhenCollapsed",void 0);s([h({type:Boolean,reflect:!0})],a.prototype,"narrow",void 0);s([b()],a.prototype,"dragOffset",void 0);s([x(".nav-rail")],a.prototype,"railElement",void 0);s([h({reflect:!0})],a.prototype,"alignment",void 0);s([h({attribute:"item-layout",reflect:!0})],a.prototype,"itemLayout",void 0);s([b()],a.prototype,"hasHeader",void 0);s([b()],a.prototype,"hasSlottedToggle",void 0);s([x('slot[name="header"]')],a.prototype,"headerSlot",void 0);s([x(".nav-rail-menu-button")],a.prototype,"menuButtonElement",void 0);s([h({type:Number,attribute:"selected-index",noAccessor:!0})],a.prototype,"selectedIndex",null);export{j as a,Y as b,a as c};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
