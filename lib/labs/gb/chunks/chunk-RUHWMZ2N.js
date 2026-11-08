import{d as b}from"./chunk-HYV4J4IK.js";import{f as v}from"./chunk-6Z7EVUE6.js";import{a as l}from"./chunk-HSWNOLES.js";import{a as p}from"./chunk-PSCELYSS.js";import{a as h}from"./chunk-SFW3MHH7.js";import{a as c}from"./chunk-AZF4SAF6.js";import{d as s}from"./chunk-JUNG2MTN.js";import{a,c as r}from"./chunk-SZVN5I3Q.js";import{a as d,b as i,e as o,h as n}from"./chunk-YRNKHAFN.js";var m=new CSSStyleSheet;m.replaceSync(`/*!
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */@layer md.sys, md.comp.ripple, md.comp.focus-ring;@layer md.comp.card{.card{--state-layer-color: var(--md-sys-color-on-surface);--disabled-content-opacity: 0.38}.card:is(:disabled,.disabled,[aria-disabled=true]){--disabled: true}.card.card-elevated{--container-color: var(--md-sys-color-surface-container-low);--container-elevation: var(--md-sys-elevation-shadow-1);--container-shape: var(--md-sys-shape-corner-md)}@media(hover: hover){.card.card-elevated:where(:hover,.hover):where(:has(.card-btn:not(:disabled,.disabled,[aria-disabled=true]))){--container-elevation: var(--md-sys-elevation-shadow-2)}}.card.card-elevated:where(:focus-within,.focus){--container-elevation: var(--md-sys-elevation-shadow-1)}.card.card-elevated:where(.active,:has(.card-btn:active)):where(:has(.card-btn:not(:disabled,.disabled,[aria-disabled=true]))){--container-elevation: var(--md-sys-elevation-shadow-1)}.card.card-elevated:where(.dragged){--container-elevation: var(--md-sys-elevation-shadow-4)}.card.card-elevated:where(:disabled,.disabled,[aria-disabled=true]){--container-color: hsl(from var(--md-sys-color-surface) h s l / 38%);--container-elevation: var(--md-sys-elevation-shadow-1)}.card.card-filled{--container-color: var(--md-sys-color-surface-container-highest);--container-elevation: var(--md-sys-elevation-shadow-0);--container-shape: var(--md-sys-shape-corner-md)}@media(hover: hover){.card.card-filled:where(:hover,.hover):where(:has(.card-btn:not(:disabled,.disabled,[aria-disabled=true]))){--container-elevation: var(--md-sys-elevation-shadow-1)}}.card.card-filled:where(:focus-within,.focus){--container-elevation: var(--md-sys-elevation-shadow-0)}.card.card-filled:where(.active,:has(.card-btn:active)):where(:has(.card-btn:not(:disabled,.disabled,[aria-disabled=true]))){--container-elevation: var(--md-sys-elevation-shadow-0)}.card.card-filled:where(.dragged){--container-elevation: var(--md-sys-elevation-shadow-3)}.card.card-filled:where(:disabled,.disabled,[aria-disabled=true]){--container-color: hsl(from var(--md-sys-color-on-surface) h s l / 38%);--container-elevation: var(--md-sys-elevation-shadow-0)}.card.card-outlined{--container-color: var(--md-sys-color-surface);--container-elevation: var(--md-sys-elevation-shadow-0);--container-shape: var(--md-sys-shape-corner-md);--outline-color: var(--md-sys-color-outline-variant);--outline-width: 1px}@media(hover: hover){.card.card-outlined:where(:hover,.hover):where(:has(.card-btn:not(:disabled,.disabled,[aria-disabled=true]))){--container-elevation: var(--md-sys-elevation-shadow-1);--outline-color: var(--md-sys-color-outline-variant)}}.card.card-outlined:where(:focus-within,.focus){--container-elevation: var(--md-sys-elevation-shadow-0);--outline-color: var(--md-sys-color-on-surface)}.card.card-outlined:where(.active,:has(.card-btn:active)):where(:has(.card-btn:not(:disabled,.disabled,[aria-disabled=true]))){--container-elevation: var(--md-sys-elevation-shadow-0);--outline-color: var(--md-sys-color-outline-variant)}.card.card-outlined:where(.dragged){--container-elevation: var(--md-sys-elevation-shadow-3);--outline-color: var(--md-sys-color-outline-variant)}.card.card-outlined:where(:disabled,.disabled,[aria-disabled=true]){--container-elevation: var(--md-sys-elevation-shadow-0);--outline-color: hsl(from var(--md-sys-color-outline) h s l / 12%)}.card{display:flex;flex-direction:column;position:relative;overflow:hidden;background-color:var(--container-color);border-radius:var(--container-shape);box-shadow:var(--container-elevation);border:var(--outline-width, 0) solid var(--outline-color, transparent);padding-inline:var(--padding-inline, 16px);transition-property:box-shadow,border-color;transition-duration:var(--md-sys-motion-spring-fast-effects-duration);transition-timing-function:var(--md-sys-motion-spring-fast-effects)}.card:is(:disabled,.disabled,[aria-disabled=true])>:not(.card-btn,slot){opacity:var(--disabled-content-opacity)}.card:is(:disabled,.disabled,[aria-disabled=true])>slot:not([name]){color:hsl(from var(--md-sys-color-on-surface) h s l/var(--disabled-content-opacity))}.card:has(>.fx-playing){--outline-color: transparent;--container-elevation: none}.card.card-selected{--container-color: var(--md-sys-color-secondary-container);--outline-color: var(--md-sys-color-primary)}.card.card-selected.card-outlined{--outline-width: 2px}.card.card-selected::after{content:"check"/"";position:absolute;inset-block-start:8px;inset-inline-start:8px;display:grid;place-items:center;inline-size:24px;block-size:24px;border-radius:50%;background-color:var(--md-sys-color-primary);color:var(--md-sys-color-on-primary);font:18px var(--md-icon-font);pointer-events:none}.card .card-btn{appearance:none;background-color:rgba(0,0,0,0);border:none;outline:none;position:absolute;inset:0;color:var(--state-layer-color);display:block;cursor:pointer}.card .card-btn:is(:disabled,.disabled,[aria-disabled=true]){cursor:default}}
`);var u=m;var y=l(n),e=class extends y{constructor(){super(...arguments),this.color="outlined",this.disabled=!1,this.interactive=!1,this.dragged=!1,this.selectable=!1,this.selected=!1,this.href="",this.target="",this.handleToggle=()=>{!this.selectable||this.disabled||(this.selected=!this.selected,this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0})),this.dispatchEvent(new Event("change",{bubbles:!0})))}}render(){let{ariaLabel:t}=this;return i`<div
      part="card"
      class="${b({color:this.color,disabled:this.disabled,dragged:this.dragged,interactive:this.interactive,selected:this.selectable&&this.selected})}">
      ${this.renderAction(t)}
      <slot></slot>
      <slot name="container" ${p()} ${v()}></slot>
    </div>`}renderAction(t){return this.interactive?this.href?i`<a
        part="card-btn"
        class="card-btn ripple focus-ring-target ${this.disabled?"disabled":""}"
        ${s()}
        href="${this.disabled?o:this.href}"
        target="${this.target||o}"
        aria-disabled="${this.disabled?"true":o}"
        aria-label="${t||o}"></a>`:i`<button
      part="card-btn"
      class="card-btn ripple focus-ring-target"
      ${s()}
      ?disabled="${this.disabled}"
      aria-pressed="${this.selectable?String(this.selected):o}"
      @click="${this.handleToggle}"
      aria-label="${t||o}"></button>`:o}};e.shadowRootOptions={mode:"open",delegatesFocus:!0};e.styles=[c,h,u,d`
      :host {
        display: inline-flex;
        isolation: isolate;
      }
      .card {
        flex: 1;
        position: relative;
      }
      .card:has([name='container'].has-slotted) {
        background-color: transparent;
      }
      slot[name='container'] {
        display: block;
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
        --color: var(--container-color);
        z-index: -1;
        transition: inherit;
      }
      :is(.disabled, [aria-disabled='true']) > slot:not([name])::slotted(*) {
        opacity: var(--disabled-content-opacity);
      }
      slot[name='container']::slotted(*) {
        width: 100%;
        height: 100%;
      }
    `];a([r()],e.prototype,"color",void 0);a([r({type:Boolean})],e.prototype,"disabled",void 0);a([r({type:Boolean})],e.prototype,"interactive",void 0);a([r({type:Boolean,reflect:!0})],e.prototype,"dragged",void 0);a([r({type:Boolean,reflect:!0})],e.prototype,"selectable",void 0);a([r({type:Boolean,reflect:!0})],e.prototype,"selected",void 0);a([r()],e.prototype,"href",void 0);a([r()],e.prototype,"target",void 0);export{e as a};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
