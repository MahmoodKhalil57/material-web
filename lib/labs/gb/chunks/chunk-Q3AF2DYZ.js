import{a as S,b as y}from"./chunk-Y4BZXR7F.js";import{a as k}from"./chunk-EZKHESQI.js";import{c as l,d as x,f as E,j as C,n as L}from"./chunk-ZPNHW3ZE.js";import{a as n,b as p}from"./chunk-THNPU74B.js";import{a}from"./chunk-PSCELYSS.js";import{a as g}from"./chunk-SFW3MHH7.js";import{a as v}from"./chunk-AZF4SAF6.js";import{a as b,b as f}from"./chunk-UUQJVX7P.js";import{a as o,c as h,d as u}from"./chunk-SZVN5I3Q.js";import{a as c,b as r,e as m,h as d}from"./chunk-YRNKHAFN.js";var T=p(y(d)),w=400,P=0,i=class extends T{get menu(){return this.menuContext?.menu||null}syncVibrantClass(){let e=this.menu?.color==="vibrant";this.shadowRoot?.querySelector(".menu-item")?.classList.toggle(E.menuVibrant,e)}get submenu(){return this.querySelector(':scope > [slot="submenu"]')}constructor(){super(),this.checked=!1,this.disabled=!1,this.hasSubmenu=!1,this.expanded=!1,this.hoverTimer=0,this.markIconsDecorative=e=>{let t=e.target;for(let s of t.assignedElements({flatten:!0}))s.matches('md-gb-icon, svg, img[alt=""]')&&(s.hasAttribute("aria-label")||s.hasAttribute("aria-labelledby")||s.setAttribute("aria-hidden","true"))},this.onSubmenuToggle=e=>{e.target===this.submenu&&(this.expanded=e.newState==="open")},this.onSubmenuPointerEnter=()=>{clearTimeout(this.hoverTimer)},this.onSubmenuPointerLeave=e=>{e.pointerType!=="touch"&&this.scheduleHover(!1)},this.boundSubmenus=[],this[n].role="menuitem",f(this,"click"),this.addEventListener("click",e=>{if(this.isFromSubmenu(e))return;if(this.disabled){e.stopImmediatePropagation();return}let t=this.checked;b(e,()=>{if(!e.defaultPrevented){if(this.submenu){this.openSubmenu();return}if(this.checkable&&(this.checked=!t,this.dispatchEvent(new Event("change",{bubbles:!0})),this.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0}))),this.checkable!=="multiple"){let s=this.menu;s?.closeAll?s.closeAll():s?.hidePopover()}}})}),this.addEventListener("keydown",e=>{if(e.target!==this||this.disabled)return;if(e.key==="Enter"||e.key===" "){e.preventDefault(),this.click();return}let t=this.matches(":dir(rtl)");this.submenu&&e.key===(t?"ArrowLeft":"ArrowRight")&&(e.preventDefault(),e.stopPropagation(),this.openSubmenu())}),this.addEventListener("pointerenter",e=>{e.pointerType!=="touch"&&this.scheduleHover(!0)}),this.addEventListener("pointerleave",e=>{e.pointerType!=="touch"&&this.scheduleHover(!1)})}connectedCallback(){super.connectedCallback(),this.menuContext?.itemConnected(this)}disconnectedCallback(){super.disconnectedCallback(),this.menuContext?.itemDisconnected(this),clearTimeout(this.hoverTimer)}openSubmenu(e=!0){let t=this.submenu;if(!(!t||this.disabled))if(clearTimeout(this.hoverTimer),t.matches(":popover-open"))e&&t.items?.[0]?.focus();else{let s=`--md-gb-submenu-${++P}`;this.style.setProperty("anchor-name",s),t.style.setProperty("position-anchor",s),t.skipInitialFocus=!e,t.showPopover()}}closeSubmenu(){clearTimeout(this.hoverTimer);let e=this.submenu;e?.matches(":popover-open")&&e.hidePopover()}render(){return r`<div
        part="menu-item"
        class="${L({checked:this.checked,disabled:this.disabled,classes:{"menu-item-expanded":this.expanded}})} ripple-host focus-ring-host"
      >
        ${this.renderContent()}
      </div>
      <slot name="submenu" @slotchange=${this.onSubmenuSlotChange}></slot>`}renderContent(){return r`
      <span class="menu-item-leading">
        <slot
          name="leading"
          ${a()}
          @slotchange=${this.markIconsDecorative}>
          ${this.checked?r`<span class="checkmark" aria-hidden="true">check</span>`:m}
        </slot>
      </span>
      <span class="menu-item-content">
        <slot></slot>
        <slot name="supporting-text" class="menu-item-supporting-text"></slot>
      </span>
      <span class="menu-item-trailing">
        <slot
          name="trailing-text"
          class="menu-item-trailing-text"
          ${a()}
        ></slot>
        <slot
          name="trailing"
          ${a()}
          @slotchange=${this.markIconsDecorative}>
          ${this.hasSubmenu?r`<span class="menu-item-submenu-icon" aria-hidden="true"
                  >arrow_right</span
                >`:m}
        </slot>
      </span>
    `}willUpdate(e){super.willUpdate(e),this.syncRole()}syncRole(){this.hasSubmenu?this[n].role="menuitem":this.checkable==="single"?this[n].role="menuitemradio":this.checkable==="multiple"?this[n].role="menuitemcheckbox":this[n].role="menuitem",this.checkable&&!this.hasSubmenu?this[n].ariaChecked=String(this.checked):this[n].ariaChecked=null}updated(){this.syncVibrantClass(),this.syncRole(),this[n].ariaHasPopup=this.hasSubmenu?"menu":null,this[n].ariaExpanded=this.hasSubmenu?String(this.expanded):null,this[n].ariaDisabled=String(this.disabled),this[S]=!this.disabled}onSubmenuSlotChange(){for(let t of this.boundSubmenus)t.removeEventListener("toggle",this.onSubmenuToggle),t.removeEventListener("pointerenter",this.onSubmenuPointerEnter),t.removeEventListener("pointerleave",this.onSubmenuPointerLeave),t.removeAttribute("submenu");let e=this.submenu;this.boundSubmenus=e?[e]:[],this.hasSubmenu=!!e,e&&(e.setAttribute("submenu",""),e.addEventListener("toggle",this.onSubmenuToggle),e.addEventListener("pointerenter",this.onSubmenuPointerEnter),e.addEventListener("pointerleave",this.onSubmenuPointerLeave))}scheduleHover(e){let t=this.submenu;if(!t||this.disabled)return;clearTimeout(this.hoverTimer);let s=t.matches(":popover-open");e!==s&&(this.hoverTimer=window.setTimeout(()=>{e?this.openSubmenu(!1):t.matches(":hover, :focus-within")||this.closeSubmenu()},w))}isFromSubmenu(e){let t=this.submenu;return!!t&&e.composedPath().includes(t)}};i.styles=[v,g,k,c`
      :host {
        display: flex;
        outline: none;
      }
      :host([hidden]) {
        display: none;
      }
      .menu-item {
        flex: 1;
      }
      :is(.menu-item-leading, .menu-item-trailing):not(
        :has(.has-slotted, .checkmark, .menu-item-submenu-icon)
      ) {
        display: none;
      }
      slot:not(.has-slotted) {
        display: contents;
      }
      .checkmark,
      .menu-item-submenu-icon {
        display: flex;
        font: var(--md-icon-size) var(--md-icon-font);
        font-variation-settings: 'FILL' var(--md-icon-fill, 0);
      }
      slot[name='submenu'] {
        display: contents;
      }
      /* The item that revealed an open submenu shows the active state layer
         (md.comp.menus.*.menu-item.active.state-layer.opacity, 8%). */
      .menu-item-expanded {
        --ripple-hover-opacity: 8%;
      }
    `];o([h({type:Boolean,reflect:!0})],i.prototype,"checked",void 0);o([h({type:Boolean,reflect:!0})],i.prototype,"disabled",void 0);o([l({context:x,subscribe:!0})],i.prototype,"menuContext",void 0);o([u(),l({context:C,subscribe:!0})],i.prototype,"checkable",void 0);o([u()],i.prototype,"hasSubmenu",void 0);o([u()],i.prototype,"expanded",void 0);export{w as a,i as b};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
