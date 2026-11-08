import{a as x,b as w,c as S,d as C}from"./chunk-3LTWYQLS.js";import{a as k}from"./chunk-XJCQ33S2.js";import{a as d}from"./chunk-DIPY6KYJ.js";import{c as y}from"./chunk-UCJN52SI.js";import{a as v}from"./chunk-I43TUDDJ.js";import{a as f}from"./chunk-MNQPNGBC.js";import{q as u}from"./chunk-NW7G5JJC.js";import{g as r}from"./chunk-XITO3S2G.js";import{a as b}from"./chunk-PSCELYSS.js";import{a as m}from"./chunk-SFW3MHH7.js";import{a as g}from"./chunk-AZF4SAF6.js";import{a as s,c as i,d as c}from"./chunk-SZVN5I3Q.js";import{g as p}from"./chunk-MZFGRIKD.js";import{a as h,b as n,e as a}from"./chunk-YRNKHAFN.js";var z=new CSSStyleSheet;z.replaceSync(`/*!
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */@layer md.sys, md.comp.ripple, md.comp.focus-ring, md.comp.icon-btn;@layer md.comp.side-sheet{:host,.side-sheet{--container-color: var(--md-sys-color-surface-container-low);--container-elevation: var(--md-sys-elevation-shadow-1);--container-shape: var(--md-sys-shape-corner-xl-top);--drag-handle-color: var(--md-sys-color-on-surface-variant);--drag-handle-height: 4px;--drag-handle-width: 32px;--minimized-container-shape: var(--md-sys-shape-corner-none);--max-width: 640px;--top-margin: 72px;--wide-margin: 56px;--drag-handle-padding-block: 22px;--peek-height: 56px;--partially-expanded-height: 50dvh;--scrim-color: var(--md-sys-color-scrim);--scrim-opacity: 0.32;--container-color: var(--md-sys-color-surface);--container-elevation: var(--md-sys-elevation-shadow-0);--container-height: 100%;--container-shape: var(--md-sys-shape-corner-none);--container-width: 256px;--headline: var(--md-sys-typescale-title-lg);--headline-axes: var(--md-sys-typescale-title-lg-axes);--headline-color: var(--md-sys-color-on-surface-variant);--headline-tracking: var(--md-sys-typescale-title-lg-tracking);--divider-color: var(--md-sys-color-outline-variant);--max-width: 400px;--padding-inline: 24px;--icon-padding-inline: 16px;--header-gap: 12px;--header-height: 72px;--actions-height: 72px;--actions-padding-block-start: 16px;--actions-padding-block-end: 24px;--container-margin: 0px;--_end: 1}:host(:dir(rtl)),.side-sheet:dir(rtl){--_end: -1}:host([modal]),.side-sheet.side-sheet-modal{--container-color: var(--md-sys-color-surface-container-low);--container-elevation: var(--md-sys-elevation-shadow-1);--container-shape: var(--md-sys-shape-corner-lg)}:host([detached]),.side-sheet.side-sheet-detached{--container-shape: var(--md-sys-shape-corner-lg);--container-margin: 16px}:host{display:block;flex:none;box-sizing:border-box;inline-size:0;block-size:var(--container-height);overflow:clip;transition:inline-size var(--md-sys-motion-spring-default-spatial-duration) var(--md-sys-motion-spring-default-spatial)}:host([open]){inline-size:calc(min(var(--container-width),var(--max-width)) + 2*var(--container-margin))}:host([modal]){display:contents}.side-sheet-dialog,.side-sheet{position:static;box-sizing:border-box;inline-size:100%;block-size:100%;max-inline-size:none;max-block-size:none;margin:0;padding:0;border:none;background:none;color:inherit;overflow:clip}.side-sheet-dialog:is([open],.side-sheet-open,.side-sheet-closing),.side-sheet:is([open],.side-sheet-open,.side-sheet-closing){display:flex;justify-content:flex-end;align-items:stretch}.side-sheet-dialog.side-sheet-modal,.side-sheet.side-sheet-modal{position:fixed;inset:0}.side-sheet-dialog::backdrop,.side-sheet::backdrop{background-color:var(--scrim-color);opacity:0;transition:opacity var(--md-sys-motion-spring-default-effects-duration) var(--md-sys-motion-spring-default-effects)}.side-sheet-dialog.side-sheet-open::backdrop,.side-sheet.side-sheet-open::backdrop{opacity:var(--scrim-opacity)}@starting-style{.side-sheet-open::backdrop{opacity:0}}.side-sheet-panel{box-sizing:border-box;display:flex;flex-direction:column;flex:none;inline-size:min(var(--container-width),var(--max-width));margin:var(--container-margin);background-color:var(--container-color);box-shadow:var(--container-elevation);border-radius:var(--container-shape);overflow:hidden}.side-sheet-modal:not(.side-sheet-detached) .side-sheet-panel{border-radius:0;border-start-start-radius:var(--container-shape);border-end-start-radius:var(--container-shape)}.side-sheet-divider:not(.side-sheet-modal,.side-sheet-detached) .side-sheet-panel{border-inline-start:1px solid var(--divider-color)}.side-sheet-modal .side-sheet-panel{max-inline-size:calc(100% - 2*var(--container-margin));transform:translateX(calc(var(--_end) * (100% + 2 * var(--container-margin))));transition:transform var(--md-sys-motion-spring-default-spatial-duration) var(--md-sys-motion-spring-default-spatial)}.side-sheet-modal.side-sheet-open .side-sheet-panel{transform:none}@starting-style{.side-sheet-modal.side-sheet-open .side-sheet-panel{transform:translateX(calc(var(--_end) * (100% + 2 * var(--container-margin))))}}.side-sheet-modal.side-sheet-closing .side-sheet-panel{transition:transform var(--md-sys-motion-spring-fast-effects-duration) var(--md-sys-motion-spring-fast-effects)}.side-sheet-modal.side-sheet-dragging .side-sheet-panel{transition:none}.side-sheet-modal{touch-action:pan-y}.side-sheet-header{flex:none;display:flex;align-items:center;gap:var(--header-gap);min-block-size:var(--header-height);padding-inline:var(--padding-inline);box-sizing:border-box}.side-sheet-header:has(.side-sheet-back){padding-inline-start:var(--icon-padding-inline)}.side-sheet-header:has(.side-sheet-close){padding-inline-end:var(--icon-padding-inline)}.side-sheet-headline{flex:1 1 auto;min-inline-size:0;margin:0;color:var(--headline-color);font:var(--headline);letter-spacing:var(--headline-tracking);font-variation-settings:var(--headline-axes);overflow-wrap:anywhere}.side-sheet-back,.side-sheet-close{--outline-width: 0;flex:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.side-sheet-back svg,.side-sheet-close svg{inline-size:var(--icon-size);block-size:var(--icon-size);fill:currentColor}:host(:dir(rtl)) .side-sheet-back svg,.side-sheet:dir(rtl) .side-sheet-back svg{transform:scaleX(-1)}.side-sheet-content{flex:1 1 auto;min-block-size:0;overflow-x:hidden;overflow-y:auto;scrollbar-gutter:var(--scrollbar-gutter, stable)}@supports not selector(::-webkit-scrollbar){.side-sheet-content{scrollbar-width:thin;scrollbar-color:var(--md-sys-color-outline) rgba(0,0,0,0)}.side-sheet-content:hover{scrollbar-color:var(--md-sys-color-on-surface-variant) rgba(0,0,0,0)}}.side-sheet-content::-webkit-scrollbar{width:10px;height:10px}.side-sheet-content::-webkit-scrollbar-button{display:none}.side-sheet-content::-webkit-scrollbar-track,.side-sheet-content::-webkit-scrollbar-corner{background:rgba(0,0,0,0)}.side-sheet-content::-webkit-scrollbar-track{margin:var(--scrollbar-track-inset, 4px)}.side-sheet-content::-webkit-scrollbar-thumb{min-height:40px;border:2px solid rgba(0,0,0,0);border-radius:var(--md-sys-shape-corner-full);background:var(--md-sys-color-outline) padding-box}.side-sheet-content:hover::-webkit-scrollbar-thumb{background-color:var(--md-sys-color-on-surface-variant)}.side-sheet-content{overscroll-behavior:contain;padding-inline:var(--padding-inline)}.side-sheet-actions{flex:none;display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-start;gap:8px;box-sizing:border-box;min-block-size:var(--actions-height);padding-inline:var(--padding-inline);padding-block:var(--actions-padding-block-start) var(--actions-padding-block-end)}.side-sheet-actions:not(:has(>slot.has-slotted,>:not(slot))){display:none}.side-sheet-divider .side-sheet-actions{border-block-start:1px solid var(--divider-color)}@media(prefers-reduced-motion: reduce){:host,.side-sheet-panel,.side-sheet-dialog::backdrop,.side-sheet::backdrop{transition-duration:0s}}:host([quick]),:host([quick]) .side-sheet-panel,:host([quick]) .side-sheet-dialog::backdrop{transition:none}}
`);var B=z;var t=class extends k{constructor(){super(...arguments),this.detached=!1,this.divider=!1,this.headline="",this.hasBackButton=!1,this.hideCloseButton=!1,this.backLabel="Back",this.closeLabel="Close",this.label="",this.gesturesDisabled=!1,this.dragOffset=null,this.dragWidth=0,this.dragDirection=1,this.swipe=new y(this,{axis:"x",target:()=>this.isConnected&&this.modal?this.dialog:null,anchors:()=>[0,this.panel?.offsetWidth??0],value:()=>0,reverse:()=>this.panelIsRtl(),velocityThreshold:S,positionalThreshold:e=>e*w,disabled:()=>!(this.modal&&this.open&&!this.isClosing)||this.gesturesDisabled,onDragStart:()=>{this.dragWidth=this.panel?.offsetWidth??0,this.dragDirection=this.panelIsRtl()?-1:1,this.dragOffset=0},onDrag:e=>{this.dragOffset=e},onFrame:e=>{this.dragOffset=e},onSettled:()=>{this.dragOffset=null},onSettle:e=>{this.dragWidth>0&&e===this.dragWidth&&this.close(d.SWIPE)},onCancel:()=>{this.dragOffset=null}}),this.handleBackClick=()=>{this.dispatchEvent(new Event("back",{bubbles:!0}))},this.handleCloseClick=()=>{this.close(d.CLOSE_BUTTON)},this.handleHeadlineSlotChange=()=>{this.requestUpdate()}}disconnectedCallback(){super.disconnectedCallback(),this.dragOffset=null}gestureSettled(){return this.swipe.whenSettled()}panelIsRtl(){let e=this.panel;return!!e&&getComputedStyle(e).direction==="rtl"}playPredictiveBack(){let e=this.dialog;return e?u(e,{kind:"side",edge:"end",measure:this.panel}):null}render(){let e=C({root:!1,modal:this.modal,detached:this.detached,divider:this.divider,open:this.open,closing:this.isClosing}),l=this.modal&&this.dragOffset!==null,E=l?{transform:`translateX(${this.dragDirection*this.dragOffset}px)`}:{},o=!!this.headline||this.hasSlottedHeadline();return n`
      <dialog
        class="sheet-dialog side-sheet-dialog ${p({...e,[x.dragging]:l})}"
        part="dialog"
        aria-labelledby=${o?"headline":a}
        aria-label=${!o&&this.label?this.label:a}
      >
        <div
          class="sheet-panel side-sheet-panel"
          part="container"
          style=${v(E)}>
          <div class="side-sheet-header" part="header">
            ${this.hasBackButton?n`
                    <button
                      type="button"
                      class="${r({classes:{"side-sheet-back":!0}})}"
                      aria-label=${this.backLabel}
                      @click=${this.handleBackClick}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
                        />
                      </svg>
                    </button>
                  `:a}
            <h2
              id="headline"
              class="side-sheet-headline focus-ring-outer"
              part="headline"
              tabindex=${o?"0":a}
              aria-hidden=${o?a:"true"}
            >
              <slot name="headline" @slotchange=${this.handleHeadlineSlotChange}
                >${this.headline}</slot
              >
            </h2>
            ${this.hideCloseButton?a:n`
                    <button
                      type="button"
                      class="${r({classes:{"side-sheet-close":!0}})}"
                      aria-label=${this.closeLabel}
                      @click=${this.handleCloseClick}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                        />
                      </svg>
                    </button>
                  `}
          </div>
          <div class="side-sheet-content" part="content">
            <slot></slot>
          </div>
          <div class="side-sheet-actions" part="actions">
            <slot name="actions" ${b()}></slot>
          </div>
        </div>
      </dialog>
    `}hasSlottedHeadline(){return!!this.querySelector(':scope > [slot="headline"]')}};t.styles=[g,m,f,B,h`
      :host([hidden]) {
        display: none;
      }
    `];s([i({type:Boolean,reflect:!0})],t.prototype,"detached",void 0);s([i({type:Boolean,reflect:!0})],t.prototype,"divider",void 0);s([i()],t.prototype,"headline",void 0);s([i({type:Boolean,attribute:"has-back-button"})],t.prototype,"hasBackButton",void 0);s([i({type:Boolean,attribute:"hide-close-button"})],t.prototype,"hideCloseButton",void 0);s([i({attribute:"back-label"})],t.prototype,"backLabel",void 0);s([i({attribute:"close-label"})],t.prototype,"closeLabel",void 0);s([i()],t.prototype,"label",void 0);s([i({type:Boolean,attribute:"gestures-disabled"})],t.prototype,"gesturesDisabled",void 0);s([c()],t.prototype,"dragOffset",void 0);export{t as a};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
