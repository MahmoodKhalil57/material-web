import{a as l,b as p}from"./chunk-THNPU74B.js";import{a as f,b as T}from"./chunk-UUQJVX7P.js";import{a,b as o,d as b}from"./chunk-TY6MUWQF.js";import{a as d,b as h,h as u}from"./chunk-YRNKHAFN.js";var S=p(u),i=class extends S{get tabs(){return this.slotElement?.assignedElements({flatten:!0}).filter(t=>this.isTab(t))??[]}get selectedTab(){return this.tabs.find(t=>this.isTabSelected(t))??null}set selectedTab(t){t&&this.updateSelectedTab(t)}get selectedTabIndex(){return this.tabs.findIndex(t=>this.isTabSelected(t))}set selectedTabIndex(t){let e=()=>{let s=this.tabs[t];s&&this.updateSelectedTab(s)};if(!this.slotElement){this.updateComplete.then(e);return}e()}constructor(){super(),this.autoSelect=!1,this.orientation="horizontal",!!1&&(this[l].role="tablist",T(this,"click","focusin"),this.addEventListener("click",this.handleClick.bind(this)),this.addEventListener("focusin",this.handleFocusin.bind(this)))}updated(t){if(super.updated(t),t.has("orientation")||!this.hasAttribute("focusgroup")){let e=this.orientation==="vertical";this[l].ariaOrientation=e?"vertical":"horizontal",this.setAttribute("focusgroup",`tablist ${e?"block":"inline"}`)}}render(){return h`<slot @slotchange=${this.handleSlotChange}></slot>`}isTab(t){return r(t)}isTabSelected(t){return r(t)?t.selected:!1}setTabSelected(t,e){if(!r(t))return;t.selected=e;let s=t.tabpanelElement;s&&(s.hidden=!e)}onTabChange(t){this.dispatchEvent(new Event("change",{bubbles:!0}))}updateSelectedTab(t){let{tabs:e}=this;if(e.indexOf(t)!==-1)for(let c of e)this.setTabSelected(c,c===t)}handleClick(t){let e=t.composedPath().find(s=>this.isTab(s));f(t,()=>{if(!t.defaultPrevented&&e&&!this.isTabSelected(e)){let s=this.selectedTab;this.updateSelectedTab(e),this.onTabChange(s)}})}handleFocusin(t){this.autoSelect&&this.handleClick(t)}handleSlotChange(){let t=this.selectedTab??this.tabs[0];t&&this.updateSelectedTab(t)}};i.styles=d`
    :host {
      display: flex;
    }
    :host([orientation='vertical']) {
      flex-direction: column;
    }
  `;a([o({type:Number})],i.prototype,"selectedTabIndex",null);a([o({type:Boolean})],i.prototype,"autoSelect",void 0);a([o({reflect:!0})],i.prototype,"orientation",void 0);a([b("slot:not([name])")],i.prototype,"slotElement",void 0);function r(n){return!!(n&&typeof n=="object"&&"selected"in n&&"tabpanelElement"in n)}export{i as a};
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
