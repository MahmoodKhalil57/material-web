import{a as y}from"./chunk-SZYOZY4V.js";import{a as n,b as f}from"./chunk-WCSI55EV.js";import{a,d as p}from"./chunk-7MVIFZWH.js";import{a as v,e as b}from"./chunk-UTK47I5H.js";import{d as u}from"./chunk-VFSP4WBP.js";import{a as c}from"./chunk-THNPU74B.js";import{a as l}from"./chunk-RRSR2DPT.js";import{f as m}from"./chunk-BX5ELK2G.js";import{a as i,c as s,d as r}from"./chunk-SZVN5I3Q.js";import{a as h,b as d}from"./chunk-YRNKHAFN.js";var e=class extends y{constructor(){super(...arguments),this.itemLayout="vertical",this.scrollTarget="",this.scrollController=new m(this,{behavior:()=>this.scrollBehavior,target:()=>this.scrollTarget,hiddenTransform:"translateY(100%)",keyboardKeepsVisible:!0}),this.selectionModel=new u(this,{items:()=>this.tabs,mode:()=>"single",required:()=>!0,autoSelectFirst:!1,isSelected:t=>this.isTabSelected(t),setSelected:(t,o)=>this.setTabSelected(t,o),events:["change"],vetoable:!1}),this.mediumWindow=!1,this.itemCount=0,this.onMediaChange=()=>{this.mediumWindow=!!this.mediaQuery?.matches},this.syncRole=()=>{let t=this[c];p(this.tabs)?(t.role="navigation",t.ariaOrientation=null):(t.role="tablist",t.ariaOrientation=this.orientation)}}get resolvedItemLayout(){return this.itemLayout==="auto"?this.mediumWindow?"horizontal":"vertical":this.itemLayout==="horizontal"?"horizontal":"vertical"}get selectedIndex(){return this.selectedTabIndex}set selectedIndex(t){this.selectedTabIndex=t}connectedCallback(){super.connectedCallback(),this.addEventListener(a,this.syncRole),l(this,n),this.mediaQuery=window.matchMedia?.(v),this.mediaQuery?.addEventListener("change",this.onMediaChange),this.onMediaChange()}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(a,this.syncRole),this.mediaQuery?.removeEventListener("change",this.onMediaChange)}updated(t){super.updated(t),(t.has("itemLayout")||t.has("mediumWindow"))&&this.syncItemsLayout()}render(){return d`
      <div
        part="nav-bar"
        class="${b({itemLayout:this.resolvedItemLayout})}"
        style="--_nav-bar-items: ${this.itemCount||1}">
        <slot @slotchange=${this.handleSlotChange}></slot>
      </div>
    `}handleSlotChange(){super.handleSlotChange(),this.syncRole(),this.itemCount=this.tabs.length,this.syncItemsLayout()}syncItemsLayout(){let t=this.resolvedItemLayout;for(let o of this.tabs)o instanceof f?o.itemLayout=t:o.setAttribute("item-layout",t)}};e.styles=[n,h`
      :host {
        display: flex;
        width: 100%;
      }
    `];i([s({attribute:"item-layout",reflect:!0})],e.prototype,"itemLayout",void 0);i([s({attribute:"scroll-behavior",reflect:!0})],e.prototype,"scrollBehavior",void 0);i([s({attribute:"scroll-target"})],e.prototype,"scrollTarget",void 0);i([r()],e.prototype,"mediumWindow",void 0);i([r()],e.prototype,"itemCount",void 0);i([s({type:Number,attribute:"selected-index",noAccessor:!0})],e.prototype,"selectedIndex",null);export{e as a};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
