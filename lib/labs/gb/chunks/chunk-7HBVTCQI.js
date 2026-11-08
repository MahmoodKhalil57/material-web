import{a as g,b as w}from"./chunk-35O6XMNA.js";import{a,b as l,c as E,d as A,e as _,f as T}from"./chunk-BSHWTD4R.js";import{c as R}from"./chunk-UCJN52SI.js";import{a as u}from"./chunk-I43TUDDJ.js";import{g as C}from"./chunk-ZEJ74G6U.js";import{e as O}from"./chunk-P6LKPJG5.js";import{a as D}from"./chunk-HSWNOLES.js";import{a as f}from"./chunk-SFW3MHH7.js";import{a as m}from"./chunk-AZF4SAF6.js";import{a as v}from"./chunk-RRSR2DPT.js";import{a as r,b as o,c,d as p}from"./chunk-TY6MUWQF.js";import{g as h}from"./chunk-MZFGRIKD.js";import{a as y,b as d,h as b}from"./chunk-YRNKHAFN.js";var F="Navigation menu",I=D(b),s=class extends I{get open(){return this.modalSurface.open}set open(t){t!==this.modalSurface.open&&(t?this.show():this.close(a.method))}get visible(){return this.modalSurface.entered}get items(){let t=this.shadowRoot?.querySelector("slot:not([name])");return(t?t.assignedElements({flatten:!0}):Array.from(this.children)).filter(i=>i instanceof w)}get selectedItem(){return this.items.find(t=>t.selected)??null}constructor(){super(),this.modal=!1,this.quick=!1,this.label="",this.gesturesDisabled=!1,this.dragOffset=null,this.swipeSettling=!1,this.dragWidth=0,this.dragDirection=1,this.modalSurface=new C(this,{dialog:()=>this.dialog,scrim:()=>this.shadowRoot?.querySelector(".nav-drawer-scrim")??null,modal:()=>this.modal,defaultReason:a.method,waitForMotion:()=>this.waitForTransitions(),initialFocus:()=>this.items.find(t=>!t.disabled)}),this.hiddenObserver=new MutationObserver(()=>this.syncTabStops()),this.swipe=new R(this,{axis:"x",target:()=>this.modal?this.dialog:null,anchors:()=>[0,this.sheet?.offsetWidth??0],value:()=>0,reverse:()=>!this.sheetIsRtl(),velocityThreshold:T,positionalThreshold:t=>t*_,disabled:()=>!(this.modal&&this.open&&this.visible)||this.gesturesDisabled,onDragStart:()=>{this.dragWidth=this.sheet?.offsetWidth??0,this.dragDirection=this.sheetIsRtl()?-1:1,this.dragOffset=0},onDrag:t=>{this.dragOffset=t},onFrame:t=>{this.dragOffset=t},onSettled:()=>{this.dragOffset=null},onSettle:t=>{this.dragWidth>0&&t===this.dragWidth&&(this.swipeSettling=!0,this.close(a.swipe).finally(()=>{this.swipeSettling=!1}))},onCancel:()=>{this.dragOffset=null}}),this.rovingFocus=new O(this,{items:()=>this.items,orientation:"vertical",canFocus:t=>!t.hidden&&!t.disabled,setTabStop:(t,e)=>{t.tabStop=e}}),this.handleItemClick=t=>{let e=this.findItem(t);if(!(!e||e.disabled)){if(!e.selected){for(let i of this.items)i.selected=i===e;this.dispatchEvent(new Event("change",{bubbles:!0}))}this.syncTabStops(e),this.modal&&this.open&&this.close(a.item)}},this.addEventListener("click",this.handleItemClick)}connectedCallback(){super.connectedCallback(),v(this,[m,f,g]),this.hiddenObserver.observe(this,{subtree:!0,attributeFilter:["hidden"]})}disconnectedCallback(){super.disconnectedCallback(),this.hiddenObserver.disconnect(),this.dragOffset=null}show(){return this.modalSurface.show()}close(t=a.method){return this.modalSurface.close(t)}toggle(){return this.open?this.close():this.show()}updated(t){super.updated(t),this.syncTabStops()}render(){let{ariaLabel:t}=this,e=this.label||t||F,i=this.modal&&this.dragOffset!==null,n=i?{translate:`${-this.dragDirection*this.dragOffset}px 0`}:{},k=i&&this.dragWidth>0?{opacity:String(1-this.dragOffset/this.dragWidth)}:{},S=d`
      <div
        part="drawer"
        class=${h({...E({modal:this.modal,open:this.visible}),[l.navDrawerDragging]:i,[l.navDrawerSwipeSettle]:this.modal&&this.swipeSettling})}
        style=${u(n)}>
        <nav part="nav" class="nav-drawer-nav" aria-label=${e}>
          <slot name="headline"></slot>
          <slot @slotchange=${this.handleSlotChange}></slot>
        </nav>
      </div>
    `;return this.modal?d`
      <dialog
        part="dialog"
        class=${h(A({open:this.visible}))}
        aria-label=${e}>
        <div
          part="scrim"
          class=${h({[l.navDrawerScrim]:!0,[l.navDrawerDragging]:i})}
          style=${u(k)}
          aria-hidden="true"></div>
        ${S}
      </dialog>
    `:S}sheetIsRtl(){let t=this.sheet;return!!t&&getComputedStyle(t).direction==="rtl"}async waitForTransitions(){for(await this.swipe.whenSettled();this.isConnected&&this.isUpdatePending;)await this.updateComplete;let t=this.sheet;if(!t||this.quick)return;let i=[t,this.shadowRoot?.querySelector(".nav-drawer-scrim")].flatMap(n=>n?.getAnimations()??[]);await Promise.all(i.map(n=>n.finished.catch(()=>{})))}syncTabStops(t){t?this.rovingFocus.tabStop=t:this.rovingFocus.sync()}handleSlotChange(){this.syncTabStops()}findItem(t){for(let e of t.composedPath()){if(e===this)return null;if(e instanceof w)return this.items.includes(e)?e:null}return null}};s.styles=[m,f,g,y`
      :host {
        block-size: 100%;
        display: block;
        /* A standard drawer changes size to suit the screen: it shrinks
           when the window is narrower than the drawer. */
        flex: 0 1 auto;
        max-inline-size: 100%;
        min-inline-size: 0;
      }

      :host([modal]) {
        display: contents;
      }

      :host([hidden]) {
        display: none;
      }

      :host([quick]) :is(.nav-drawer, .nav-drawer-scrim) {
        transition: none;
      }
    `];r([o({type:Boolean,reflect:!0})],s.prototype,"open",null);r([o({type:Boolean,reflect:!0})],s.prototype,"modal",void 0);r([o({type:Boolean,reflect:!0})],s.prototype,"quick",void 0);r([o()],s.prototype,"label",void 0);r([o({type:Boolean,reflect:!0,attribute:"gestures-disabled"})],s.prototype,"gesturesDisabled",void 0);r([c()],s.prototype,"dragOffset",void 0);r([c()],s.prototype,"swipeSettling",void 0);r([p(".nav-drawer")],s.prototype,"sheet",void 0);r([p("dialog")],s.prototype,"dialog",void 0);export{s as a};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
