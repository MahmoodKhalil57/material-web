import{a as o,b as t}from"./chunk-TY6MUWQF.js";import{b as r,h as a}from"./chunk-YRNKHAFN.js";var n=new CSSStyleSheet;n.replaceSync(`/*!
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */@layer md.sys.motion{.skeleton-placeholder{--_color: var( --md-skeleton-color, var(--md-sys-color-surface-container-highest) );--_highlight: var( --md-skeleton-highlight-color, var(--md-sys-color-surface-container-low) );--_duration: var( --md-skeleton-pulse-duration, calc(var(--md-sys-motion-duration-extra-long4) * 2) );background-attachment:fixed;background-color:var(--_color);background-image:linear-gradient(135deg, transparent 40%, var(--_highlight) 50%, transparent 60%);background-repeat:no-repeat;background-size:300vw 300vh;border-radius:var(--md-skeleton-shape, var(--md-sys-shape-corner-sm));animation:md-skeleton-pulse var(--_duration) var(--md-sys-motion-easing-emphasized) infinite}.skeleton-placeholder:dir(rtl){background-image:linear-gradient(225deg, transparent 40%, var(--_highlight) 50%, transparent 60%);animation-name:md-skeleton-pulse-rtl}.skeleton-placeholder.md-skeleton-text{block-size:1em;border-radius:var(--md-skeleton-shape, var(--md-sys-shape-corner-xs));margin-block:calc((1lh - 1em)/2)}.skeleton-placeholder.md-skeleton-circle{aspect-ratio:1;border-radius:var(--md-sys-shape-corner-full)}@media(prefers-reduced-motion: reduce){.skeleton-placeholder{animation:none;background-image:none}}@keyframes md-skeleton-pulse{0%{background-position:100% 100%}50%,100%{background-position:0% 0%}}@keyframes md-skeleton-pulse-rtl{0%{background-position:0% 100%}50%,100%{background-position:100% 0%}}:host{--_fade-duration: var( --md-transition-skeleton-fade-duration, var(--md-sys-motion-duration-short4) );--_fade-easing: var( --md-transition-skeleton-fade-easing, var(--md-sys-motion-easing-standard) );display:block;position:relative}:host([hidden]){display:none}:host([shape=text]){min-block-size:1lh}:host([shape=circle]){aspect-ratio:1}.skeleton-placeholder{inset:0;opacity:0;pointer-events:none;position:absolute;transition:opacity 0s linear var(--_fade-duration)}:host([shape=text]) .skeleton-placeholder{block-size:1em;border-radius:var(--md-skeleton-shape, var(--md-sys-shape-corner-xs));inset-block-start:calc((1lh - 1em)/2)}:host([shape=circle]) .skeleton-placeholder{border-radius:var(--md-sys-shape-corner-full)}.skeleton-content{transition:opacity var(--_fade-duration) var(--_fade-easing)}:host([loading]) .skeleton-placeholder{opacity:1;transition:none}:host([loading]) .skeleton-content{opacity:0;transition:none}@media(prefers-reduced-motion: reduce){.skeleton-content{transition-duration:var(--md-transition-reduced-duration, var(--md-sys-motion-duration-short4))}}}
`);var s=n;var e=class extends a{constructor(){super(...arguments),this.loading=!1,this.shape="rect"}render(){return r`
      <div
        class="skeleton-placeholder"
        part="placeholder"
        aria-hidden="true"
      ></div>
      <div class="skeleton-content" part="content" ?inert=${this.loading}>
        <slot></slot>
      </div>
    `}updated(i){i.has("loading")&&(this.loading?this.setAttribute("aria-busy","true"):this.removeAttribute("aria-busy"))}};e.styles=[s];o([t({type:Boolean,reflect:!0})],e.prototype,"loading",void 0);o([t({reflect:!0})],e.prototype,"shape",void 0);export{e as a};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
