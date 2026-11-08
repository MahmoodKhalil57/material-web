import{a as m,b as u,d as y}from"./chunk-H5DJN7XE.js";import{f as c,m as h}from"./chunk-KPMUBDDJ.js";import{a as i,b as n,c as o,d as l}from"./chunk-TY6MUWQF.js";import{g as f}from"./chunk-MZFGRIKD.js";import{a as r,b as d,h as p}from"./chunk-YRNKHAFN.js";var v=new CSSStyleSheet;v.replaceSync(`/*!
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */@layer md.sys;@layer md.comp.app-scaffold{:host{--md-sys-layout-breakpoint-medium: 600px;--md-sys-layout-breakpoint-expanded: 840px;--md-sys-layout-breakpoint-large: 1200px;--md-sys-layout-breakpoint-extra-large: 1600px;--md-sys-layout-breakpoint-height-medium: 480px;--md-sys-layout-breakpoint-height-expanded: 900px;--md-sys-layout-third-pane-max-width: 400px}:host([window-class=compact]){--md-sys-layout-margin: 16px;--md-sys-layout-spacer: 16px;--md-sys-layout-fixed-pane-width: 360px;--md-sys-layout-columns: 4;--md-sys-layout-panes-recommended: 1;--md-sys-layout-panes-max: 1}:host([window-class=medium]){--md-sys-layout-margin: 24px;--md-sys-layout-spacer: 24px;--md-sys-layout-fixed-pane-width: 360px;--md-sys-layout-columns: 8;--md-sys-layout-panes-recommended: 1;--md-sys-layout-panes-max: 2}:host([window-class=expanded]){--md-sys-layout-margin: 24px;--md-sys-layout-spacer: 24px;--md-sys-layout-fixed-pane-width: 360px;--md-sys-layout-columns: 8;--md-sys-layout-panes-recommended: 2;--md-sys-layout-panes-max: 2}:host([window-class=large]){--md-sys-layout-margin: 24px;--md-sys-layout-spacer: 24px;--md-sys-layout-fixed-pane-width: 412px;--md-sys-layout-columns: 12;--md-sys-layout-panes-recommended: 2;--md-sys-layout-panes-max: 2}:host([window-class=extra-large]){--md-sys-layout-margin: 24px;--md-sys-layout-spacer: 24px;--md-sys-layout-fixed-pane-width: 412px;--md-sys-layout-columns: 12;--md-sys-layout-panes-recommended: 2;--md-sys-layout-panes-max: 3}.app-scaffold{background-color:var(--container-color, var(--md-sys-color-surface));block-size:100%;box-sizing:border-box;color:var(--content-color, var(--md-sys-color-on-surface));display:grid;grid-template-columns:auto minmax(0, 1fr) auto;grid-template-rows:auto minmax(0, 1fr) auto;padding:var(--md-gb-scaffold-safe-top, env(safe-area-inset-top, 0px)) var(--md-gb-scaffold-safe-right, env(safe-area-inset-right, 0px)) var(--md-gb-scaffold-safe-bottom, env(safe-area-inset-bottom, 0px)) var(--md-gb-scaffold-safe-left, env(safe-area-inset-left, 0px))}.app-scaffold-companion{display:flex;grid-column:3;grid-row:1/-1;min-block-size:0}.app-scaffold-rail{display:flex;grid-column:1;grid-row:1/-1;min-block-size:0}.app-scaffold-top{grid-column:2;grid-row:1;min-inline-size:0}.app-scaffold-body{display:flex;flex-direction:column;grid-column:2;grid-row:2;min-block-size:0;min-inline-size:0;position:relative}.app-scaffold-content{flex:1;min-block-size:0;overflow:auto;scrollbar-gutter:var(--scrollbar-gutter, auto)}@supports not selector(::-webkit-scrollbar){.app-scaffold-content{scrollbar-width:thin;scrollbar-color:var(--md-sys-color-outline) rgba(0,0,0,0)}.app-scaffold-content:hover{scrollbar-color:var(--md-sys-color-on-surface-variant) rgba(0,0,0,0)}}.app-scaffold-content::-webkit-scrollbar{width:10px;height:10px}.app-scaffold-content::-webkit-scrollbar-button{display:none}.app-scaffold-content::-webkit-scrollbar-track,.app-scaffold-content::-webkit-scrollbar-corner{background:rgba(0,0,0,0)}.app-scaffold-content::-webkit-scrollbar-track{margin:var(--scrollbar-track-inset, 4px)}.app-scaffold-content::-webkit-scrollbar-thumb{min-height:40px;border:2px solid rgba(0,0,0,0);border-radius:var(--md-sys-shape-corner-full);background:var(--md-sys-color-outline) padding-box}.app-scaffold-content:hover::-webkit-scrollbar-thumb{background-color:var(--md-sys-color-on-surface-variant)}.app-scaffold-bar{grid-column:1/-1;grid-row:3;min-inline-size:0}.app-scaffold-overlay{display:flex;flex-direction:column;inset:0;pointer-events:none;position:absolute;z-index:1}.app-scaffold-snackbar{flex:1;position:relative}.app-scaffold-bottom-rail{align-items:flex-end;display:flex;gap:var(--md-sys-space-200);justify-content:flex-end;margin-block-end:var(--md-sys-space-200);margin-inline:var(--md-sys-space-200)}.app-scaffold-toolbar{display:flex;flex:1;justify-content:center;min-inline-size:0;pointer-events:auto}.app-scaffold-fab{pointer-events:auto}.app-scaffold [hidden]{display:none}}
`);var b=v;var s=class extends p{constructor(){super(...arguments),this.navigation="auto",this.autoExpandRail=!1,this.sideSheetNavigation="keep",this.sideSheetOpen=!1,this.hasBar=!1,this.hasRail=!1,this.hasFab=!1,this.hasToolbar=!1,this.contentPaneCount=1,this.paneSideSheet=!1,this.active="none",this.lastActive=null,this.railObserver=null,this.collapsedForSheet=new Map,this.size=new h(this,{onChange:(e,t)=>{this.autoExpandRail&&this.syncRailExpanded(e),this.dispatchEvent(new CustomEvent("window-class-change",{bubbles:!0,composed:!0,detail:{windowClass:e,previous:t}}))},onHeightChange:(e,t)=>{this.dispatchEvent(new CustomEvent("window-height-class-change",{bubbles:!0,composed:!0,detail:{windowHeightClass:e,previous:t}}))}}),this.handlePaneLayoutChange=e=>{let{paneCount:t,visiblePanes:a}=e.detail;this.contentPaneCount=t,this.paneSideSheet=a.includes("tertiary")}}get windowClass(){return this.size.value}get windowHeightClass(){return this.size.height}get activeNavigation(){return this.active}connectedCallback(){super.connectedCallback(),this.addEventListener("pane-layout-change",this.handlePaneLayoutChange),this.hasUpdated&&this.observeRail()}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("pane-layout-change",this.handlePaneLayoutChange),this.railObserver?.disconnect(),this.railObserver=null}firstUpdated(){this.observeRail()}observeRail(){this.railObserver?.disconnect(),this.railObserver=new ResizeObserver(()=>this.measureRegions());for(let e of[this.railRegion,this.companionRegion])e&&this.railObserver.observe(e);this.measureRegions()}measureRegions(){let e=this.bodyRegion;if(!e)return;let t=a=>a&&!a.hidden?a.getBoundingClientRect().width:0;e.style.setProperty("--md-gb-scaffold-nav-inline-size",`${t(this.railRegion)}px`),e.style.setProperty("--md-gb-scaffold-companion-inline-size",`${t(this.companionRegion)}px`)}get sideSheetPresent(){return this.sideSheetOpen||this.paneSideSheet}syncRailForSideSheet(){let e=this.sideSheetPresent&&this.sideSheetNavigation==="collapse",t=(this.railSlot?.assignedElements({flatten:!0})??[]).filter(a=>"expanded"in a);if(e)for(let a of t)this.collapsedForSheet.has(a)||(this.collapsedForSheet.set(a,a.expanded),a.expanded=!1);else{for(let[a,g]of this.collapsedForSheet)a.expanded=g;this.collapsedForSheet.clear()}}syncRailExpanded(e){if(this.collapsedForSheet.size>0)return;let t=u(e);for(let a of this.railSlot?.assignedElements({flatten:!0})??[])"expanded"in a&&(a.expanded=t)}handleSlotChange(e){let t=e.target,a=t.assignedElements({flatten:!0}).length>0;switch(t.name){case"navigation-bar":this.hasBar=a;break;case"navigation-rail":this.hasRail=a,a&&this.autoExpandRail&&this.syncRailExpanded(this.size.value),this.syncRailForSideSheet();break;case"fab":this.hasFab=a;break;case"toolbar":this.hasToolbar=a;break;default:break}}willUpdate(e){this.active=m({navigation:this.navigation,windowClass:this.size.value,heightClass:this.size.height,paneCount:this.contentPaneCount,hasBar:this.hasBar,hasRail:this.hasRail}),this.getAttribute("window-class")!==this.size.value&&this.setAttribute("window-class",this.size.value),this.getAttribute("window-height-class")!==this.size.height&&this.setAttribute("window-height-class",this.size.height),this.setAttribute("active-navigation",this.active),e.has("autoExpandRail")&&this.autoExpandRail&&this.syncRailExpanded(this.size.value)}updated(){this.measureRegions(),this.syncRailForSideSheet(),this.active!==this.lastActive&&(this.lastActive=this.active,this.dispatchEvent(new CustomEvent("navigation-change",{bubbles:!0,composed:!0,detail:{navigation:this.active}})))}render(){let e=this.active==="rail"&&!(this.sideSheetPresent&&this.sideSheetNavigation==="hide"),t=c(this.size.value,"large");return d`
      <div
        part="scaffold"
        class=${f(y({navigation:this.active}))}>
        <div class="app-scaffold-rail" part="rail" ?hidden=${!e}>
          <slot
            name="navigation-rail"
            @slotchange=${this.handleSlotChange}></slot>
        </div>
        <div
          class="app-scaffold-companion"
          part="companion-rail"
          ?hidden=${!t}>
          <slot name="companion-rail"></slot>
        </div>
        <div class="app-scaffold-top" part="top-app-bar">
          <slot name="top-app-bar"></slot>
        </div>
        <div class="app-scaffold-body" part="body">
          <div class="app-scaffold-content" part="content">
            <slot></slot>
          </div>
          <div class="app-scaffold-overlay">
            <div class="app-scaffold-snackbar">
              <slot name="snackbar"></slot>
            </div>
            <div class="app-scaffold-bottom-rail">
              <div
                class="app-scaffold-toolbar"
                part="toolbar"
                ?hidden=${!this.hasToolbar}>
                <slot
                  name="toolbar"
                  @slotchange=${this.handleSlotChange}></slot>
              </div>
              <div class="app-scaffold-fab" ?hidden=${!this.hasFab}>
                <slot name="fab" @slotchange=${this.handleSlotChange}></slot>
              </div>
            </div>
          </div>
        </div>
        <div
          class="app-scaffold-bar"
          part="navigation-bar"
          ?hidden=${this.active!=="bar"}>
          <slot
            name="navigation-bar"
            @slotchange=${this.handleSlotChange}></slot>
        </div>
      </div>
    `}};s.styles=[b,r`
      :host {
        display: block;
        block-size: 100%;
      }

      :host([hidden]) {
        display: none;
      }
    `];i([n({reflect:!0})],s.prototype,"navigation",void 0);i([n({type:Boolean,attribute:"auto-expand-rail",reflect:!0})],s.prototype,"autoExpandRail",void 0);i([n({attribute:"side-sheet-navigation",reflect:!0})],s.prototype,"sideSheetNavigation",void 0);i([n({type:Boolean,attribute:"side-sheet-open",reflect:!0})],s.prototype,"sideSheetOpen",void 0);i([o()],s.prototype,"hasBar",void 0);i([o()],s.prototype,"hasRail",void 0);i([o()],s.prototype,"hasFab",void 0);i([o()],s.prototype,"hasToolbar",void 0);i([o()],s.prototype,"contentPaneCount",void 0);i([o()],s.prototype,"paneSideSheet",void 0);i([l(".app-scaffold-rail")],s.prototype,"railRegion",void 0);i([l(".app-scaffold-companion")],s.prototype,"companionRegion",void 0);i([l(".app-scaffold-body")],s.prototype,"bodyRegion",void 0);i([l('slot[name="navigation-rail"]')],s.prototype,"railSlot",void 0);export{s as a};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
