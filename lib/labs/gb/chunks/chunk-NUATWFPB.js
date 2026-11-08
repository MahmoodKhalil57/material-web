import{b as r,d as w}from"./chunk-72F3BXJM.js";import{a as x}from"./chunk-VLERZ7M6.js";import{a as d}from"./chunk-PSCELYSS.js";import{a as v}from"./chunk-SFW3MHH7.js";import{a as b}from"./chunk-AZF4SAF6.js";import{b as y,d as f}from"./chunk-JUNG2MTN.js";import{c as m}from"./chunk-OHIE4ONL.js";import{a,c as t,e as p}from"./chunk-SZVN5I3Q.js";import{g as u}from"./chunk-MZFGRIKD.js";import{a as h,b as l,e as c,h as g}from"./chunk-YRNKHAFN.js";var k=new CSSStyleSheet;k.replaceSync(`/*!
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */@layer md.sys, md.comp.ripple, md.comp.focus-ring, md.comp.icon-btn;@layer md.comp.search{:host,.search-bar{--avatar-shape: var(--md-sys-shape-corner-full);--avatar-size: 30px;--contained-avatar-target-size: 48px;--contained-icon-label-gap: var(--md-sys-space-50);--contained-leading-margin: var(--md-sys-space-300);--contained-leading-space: var(--md-sys-space-50);--contained-motion-spring: var(--md-sys-motion-spring-fast-spatial);--contained-no-actions-leading-space: var(--md-sys-space-200);--contained-no-actions-trailing-space: var(--md-sys-space-200);--contained-trailing-actions-gap: var(--md-sys-space-0);--contained-trailing-actions-leading-space: var(--md-sys-space-50);--contained-trailing-actions-trailing-space: var(--md-sys-space-50);--contained-trailing-margin: var(--md-sys-space-300);--contained-trailing-space: var(--md-sys-space-50);--container-color: var(--md-sys-color-surface-container-high);--container-height: 56px;--container-shape: var(--md-sys-shape-corner-full);--icon-size: 24px;--input-text: var(--md-sys-typescale-body-lg);--input-text-axes: var(--md-sys-typescale-body-lg-axes);--input-text-color: var(--md-sys-color-on-surface);--input-text-tracking: var(--md-sys-typescale-body-lg-tracking);--leading-icon-color: var(--md-sys-color-on-surface);--leading-icon-leading-icon-label-space: var(--md-sys-space-200);--leading-space: var(--md-sys-space-200);--supporting-text: var(--md-sys-typescale-body-lg);--supporting-text-axes: var(--md-sys-typescale-body-lg-axes);--supporting-text-color: var(--md-sys-color-on-surface-variant);--supporting-text-tracking: var(--md-sys-typescale-body-lg-tracking);--trailing-icon-color: var(--md-sys-color-on-surface-variant);--trailing-icon-label-trailing-icon-space: var(--md-sys-space-200);--trailing-space: var(--md-sys-space-200);--icon-target-size: 48px;--unfocused-glyph-margin: var(--md-sys-space-300);--focused-glyph-margin: var(--md-sys-space-150);--min-width: 360px;--max-width: 720px;--contained-motion-duration: var(--md-sys-motion-spring-fast-spatial-duration)}:host{display:block;inline-size:100%;min-inline-size:var(--min-width);max-inline-size:var(--max-width)}:host([hidden]){display:none}:host>.search-bar{--avatar-shape: inherit;--avatar-size: inherit;--contained-avatar-target-size: inherit;--contained-icon-label-gap: inherit;--contained-leading-margin: inherit;--contained-leading-space: inherit;--contained-motion-duration: inherit;--contained-motion-spring: inherit;--contained-no-actions-leading-space: inherit;--contained-no-actions-trailing-space: inherit;--contained-trailing-actions-gap: inherit;--contained-trailing-actions-leading-space: inherit;--contained-trailing-actions-trailing-space: inherit;--contained-trailing-margin: inherit;--contained-trailing-space: inherit;--container-color: inherit;--container-height: inherit;--container-shape: inherit;--focused-glyph-margin: inherit;--icon-size: inherit;--icon-target-size: inherit;--input-text: inherit;--input-text-axes: inherit;--input-text-color: inherit;--input-text-tracking: inherit;--leading-icon-color: inherit;--leading-icon-leading-icon-label-space: inherit;--leading-space: inherit;--max-width: inherit;--min-width: inherit;--supporting-text: inherit;--supporting-text-axes: inherit;--supporting-text-color: inherit;--supporting-text-tracking: inherit;--trailing-icon-color: inherit;--trailing-icon-label-trailing-icon-space: inherit;--trailing-space: inherit;--unfocused-glyph-margin: inherit}.search-bar{--_glyph-margin: var(--unfocused-glyph-margin);--_glyph-inset: calc( var(--_glyph-margin) - (var(--icon-target-size) - var(--icon-size)) / 2 );position:relative;display:flex;align-items:center;box-sizing:border-box;inline-size:100%;block-size:var(--container-height);padding-inline:var(--_glyph-inset) var(--contained-no-actions-trailing-space);background-color:var(--container-color);border-radius:var(--container-shape);color:var(--leading-icon-color);cursor:text;-webkit-tap-highlight-color:rgba(0,0,0,0)}.search-bar:has(.search-bar-trailing>slot.has-slotted,.search-bar-trailing>:not(slot)){padding-inline-end:var(--_glyph-inset)}.search-bar.search-bar-expanded{--_glyph-margin: var(--focused-glyph-margin)}.search-bar.search-bar-disabled{cursor:default;pointer-events:none;opacity:.38}.search-bar-leading,.search-bar-trailing{display:flex;flex:none;align-items:center}.search-bar-leading{justify-content:center;min-inline-size:var(--icon-target-size);block-size:var(--icon-target-size);color:var(--leading-icon-color)}.search-bar-trailing{gap:var(--contained-trailing-actions-gap);margin-inline-start:var(--contained-trailing-actions-leading-space);color:var(--trailing-icon-color)}.search-bar-trailing:not(:has(>slot.has-slotted,>:not(slot))){display:none}.search-bar-icon{inline-size:var(--icon-size);block-size:var(--icon-size);fill:currentColor}.search-bar-trailing ::slotted(:not([slot=avatar])),.search-bar-trailing>:not(slot,.search-bar-avatar){display:inline-flex;flex:none;align-items:center;justify-content:center;box-sizing:border-box;min-inline-size:var(--icon-target-size);min-block-size:var(--icon-target-size)}.search-bar-leading ::slotted(*){flex:none}.search-bar-trailing ::slotted([slot=avatar]),.search-bar-trailing>.search-bar-avatar{flex:none;box-sizing:border-box;inline-size:var(--avatar-size);block-size:var(--avatar-size);margin:calc((var(--contained-avatar-target-size) - var(--avatar-size))/2);border-radius:var(--avatar-shape);object-fit:cover;overflow:hidden}.search-bar-input{flex:1 1 auto;align-self:stretch;min-inline-size:0;box-sizing:border-box;margin:0;margin-inline-start:var(--contained-icon-label-gap);padding:0;border:none;outline:none;appearance:none;background:rgba(0,0,0,0);color:var(--input-text-color);caret-color:var(--input-text-color);font:var(--input-text);font-variation-settings:var(--input-text-axes);letter-spacing:var(--input-text-tracking);text-overflow:ellipsis;cursor:inherit}.search-bar-input::placeholder{color:var(--supporting-text-color);font:var(--supporting-text);font-variation-settings:var(--supporting-text-axes);letter-spacing:var(--supporting-text-tracking);opacity:1}}
`);var z=k;var $=l`<svg
  class="search-bar-icon"
  viewBox="0 0 24 24"
  aria-hidden="true">
  <path
    d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
</svg>`,i=class extends g{constructor(){super(...arguments),this.value="",this.placeholder="",this.label="",this.disabled=!1,this.docked=!1,this.divided=!1,this.quick=!1,this.backLabel="Back",this.clearLabel="Clear search",this.resultsLabel="Search results",this.searching=!1,this.searchingLabel="Searching",this.suggestionsLabel="Suggestions available",this.isExpandedInternal=!1,this.handleBarClick=e=>{if(!(this.disabled||this.isExpandedInternal)){for(let n of e.composedPath()){if(n===this)break;if(n instanceof Element&&n.parentElement===this&&n.slot)return}this.show()}},this.handleInputKeyDown=e=>{this.disabled||e.isComposing||(e.key==="Enter"||e.key==="ArrowDown")&&(e.preventDefault(),this.show())},this.handleInput=e=>{this.value=e.target.value,this.isExpandedInternal||this.show()},this.handleViewInput=()=>{this.value=this.view?.value??""},this.redispatch=e=>{if(e.target!==this.view)return;let n={bubbles:e.bubbles,cancelable:e.cancelable},o=e instanceof CustomEvent?new CustomEvent(e.type,{...n,detail:e.detail}):new Event(e.type,n);if(!this.dispatchEvent(o)){e.preventDefault();return}if(e.type==="open"||e.type==="close"){let s=this.isExpandedInternal;this.isExpandedInternal=e.type==="open",this.requestUpdate("expanded",s)}if(e.type==="closed"){let s=document.activeElement;(!s||s===document.body)&&this.focus({preventScroll:!0})}}}get expanded(){return this.isExpandedInternal}set expanded(e){e!==this.isExpandedInternal&&(e?this.show():this.close())}focus(e){this.input?.focus(e)}async show(){this.disabled||(await this.updateComplete,await this.view?.show())}async close(e){await this.updateComplete,await this.view?.close(e)}render(){let e=this.isExpandedInternal,n=this.label||this.placeholder||c,o={...y({disabled:this.disabled}),...m(),...w({expanded:e,disabled:this.disabled})};return l`
      <div
        class="${u(o)}"
        part="bar"
        ${f()}
        @click=${this.handleBarClick}>
        <span class="${r.leading}">
          <slot name="leading">${$}</slot>
        </span>
        <input
          id="input"
          class="${r.input} ripple-target focus-ring-target"
          part="input"
          type="text"
          role="combobox"
          autocomplete="off"
          enterkeyhint="search"
          spellcheck="false"
          aria-haspopup="dialog"
          aria-expanded=${e?"true":"false"}
          aria-controls="view"
          aria-label=${n}
          placeholder=${this.placeholder||c}
          ?disabled=${this.disabled}
          .value=${x(this.value)}
          @input=${this.handleInput}
          @keydown=${this.handleInputKeyDown}
          @change=${()=>{this.dispatchEvent(new Event("change",{bubbles:!0}))}} />
        <span class="${r.trailing}">
          <slot name="trailing" ${d()}></slot>
          <slot name="avatar" ${d()}></slot>
        </span>
      </div>
      <md-gb-search-view
        id="view"
        part="view"
        .bar=${this}
        .value=${this.value}
        placeholder=${this.placeholder}
        label=${this.label}
        back-label=${this.backLabel}
        clear-label=${this.clearLabel}
        results-label=${this.resultsLabel}
        suggestions-label=${this.suggestionsLabel}
        searching-label=${this.searchingLabel}
        ?searching=${this.searching}
        ?docked=${this.docked}
        ?divided=${this.divided}
        ?quick=${this.quick}
        @input=${this.handleViewInput}
        @open=${this.redispatch}
        @opened=${this.redispatch}
        @close=${this.redispatch}
        @closed=${this.redispatch}
        @change=${this.redispatch}
        @search=${this.redispatch}>
        <slot></slot>
        <slot name="view-trailing" slot="trailing"></slot>
      </md-gb-search-view>
    `}};i.styles=[b,v,z,h`
      md-gb-search-view {
        display: contents;
      }
    `];a([t()],i.prototype,"value",void 0);a([t()],i.prototype,"placeholder",void 0);a([t()],i.prototype,"label",void 0);a([t({type:Boolean,reflect:!0})],i.prototype,"disabled",void 0);a([t({type:Boolean,reflect:!0})],i.prototype,"docked",void 0);a([t({type:Boolean,reflect:!0})],i.prototype,"divided",void 0);a([t({type:Boolean,reflect:!0})],i.prototype,"quick",void 0);a([t({attribute:"back-label"})],i.prototype,"backLabel",void 0);a([t({attribute:"clear-label"})],i.prototype,"clearLabel",void 0);a([t({attribute:"results-label"})],i.prototype,"resultsLabel",void 0);a([t({type:Boolean,reflect:!0})],i.prototype,"searching",void 0);a([t({attribute:"searching-label"})],i.prototype,"searchingLabel",void 0);a([t({attribute:"suggestions-label"})],i.prototype,"suggestionsLabel",void 0);a([t({type:Boolean,reflect:!0})],i.prototype,"expanded",null);a([p("md-gb-search-view")],i.prototype,"view",void 0);a([p(".search-bar-input")],i.prototype,"input",void 0);export{i as a};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
