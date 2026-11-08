import{c as g}from"./chunk-VE5KQYCI.js";import{a as v}from"./chunk-G3CNR2DB.js";import{a as m}from"./chunk-SFW3MHH7.js";import{a as b}from"./chunk-AZF4SAF6.js";import{f as l}from"./chunk-SEGIRCNK.js";import{a as i,b as o}from"./chunk-TY6MUWQF.js";import{a as p,b as d,h}from"./chunk-YRNKHAFN.js";var u=new CSSStyleSheet;u.replaceSync(`/*!
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */@layer md.sys, md.comp.ripple, md.comp.focus-ring, md.comp.button;@layer md.comp.split-button{.split-btn{--between-space: var(--md-sys-space-25)}.split-btn .btn{--outer-corner-size: calc(var(--container-height) / 2)}.split-btn .btn-xs{--container-height: 32px;--inner-corner-size: var(--md-sys-shape-corner-xs)}.split-btn .btn-xs:where(:nth-child(1 of .btn)){--leading-space: var(--md-sys-space-150);--trailing-space: var(--md-sys-space-125)}.split-btn .btn-xs:where(:nth-last-child(1 of .btn)){--icon-size: 22px;--leading-space: 13px;--trailing-space: 13px;--menu-icon-offset: 1px}@media(hover: hover){.split-btn .btn-xs:where(:hover,.hover){--inner-corner-size: var(--md-sys-shape-corner-sm)}}.split-btn .btn-xs:where(.focus-visible){--inner-corner-size: var(--md-sys-shape-corner-sm)}.split-btn .btn-xs:where(:active,.active){--inner-corner-size: var(--md-sys-shape-corner-sm)}.split-btn .btn-sm{--container-height: 40px;--inner-corner-size: var(--md-sys-shape-corner-xs)}.split-btn .btn-sm:where(:nth-child(1 of .btn)){--leading-space: var(--md-sys-space-200);--trailing-space: var(--md-sys-space-150)}.split-btn .btn-sm:where(:nth-last-child(1 of .btn)){--icon-size: 22px;--leading-space: 13px;--trailing-space: 13px;--menu-icon-offset: 1px}@media(hover: hover){.split-btn .btn-sm:where(:hover,.hover){--inner-corner-size: var(--md-sys-shape-corner-md)}}.split-btn .btn-sm:where(.focus-visible){--inner-corner-size: var(--md-sys-shape-corner-md)}.split-btn .btn-sm:where(:active,.active){--inner-corner-size: var(--md-sys-shape-corner-md)}.split-btn .btn-md{--container-height: 56px;--inner-corner-size: var(--md-sys-shape-corner-xs)}.split-btn .btn-md:where(:nth-child(1 of .btn)){--leading-space: var(--md-sys-space-300);--trailing-space: var(--md-sys-space-300)}.split-btn .btn-md:where(:nth-last-child(1 of .btn)){--icon-size: 26px;--leading-space: 15px;--trailing-space: 15px;--menu-icon-offset: 2px}@media(hover: hover){.split-btn .btn-md:where(:hover,.hover){--inner-corner-size: var(--md-sys-shape-corner-md)}}.split-btn .btn-md:where(.focus-visible){--inner-corner-size: var(--md-sys-shape-corner-md)}.split-btn .btn-md:where(:active,.active){--inner-corner-size: var(--md-sys-shape-corner-md)}.split-btn .btn-lg{--container-height: 96px;--inner-corner-size: var(--md-sys-shape-corner-sm)}.split-btn .btn-lg:where(:nth-child(1 of .btn)){--leading-space: var(--md-sys-space-600);--trailing-space: var(--md-sys-space-600)}.split-btn .btn-lg:where(:nth-last-child(1 of .btn)){--icon-size: 38px;--leading-space: 29px;--trailing-space: 29px;--menu-icon-offset: 3px}@media(hover: hover){.split-btn .btn-lg:where(:hover,.hover){--inner-corner-size: var(--md-sys-shape-corner-lg-increased)}}.split-btn .btn-lg:where(.focus-visible){--inner-corner-size: var(--md-sys-shape-corner-lg-increased)}.split-btn .btn-lg:where(:active,.active){--inner-corner-size: var(--md-sys-shape-corner-lg-increased)}.split-btn .btn-xl{--container-height: 136px;--inner-corner-size: var(--md-sys-shape-corner-md)}.split-btn .btn-xl:where(:nth-child(1 of .btn)){--leading-space: var(--md-sys-space-800);--trailing-space: var(--md-sys-space-800)}.split-btn .btn-xl:where(:nth-last-child(1 of .btn)){--icon-size: 50px;--leading-space: 43px;--trailing-space: 43px;--menu-icon-offset: 6px}@media(hover: hover){.split-btn .btn-xl:where(:hover,.hover){--inner-corner-size: var(--md-sys-shape-corner-lg-increased)}}.split-btn .btn-xl:where(.focus-visible){--inner-corner-size: var(--md-sys-shape-corner-lg-increased)}.split-btn .btn-xl:where(:active,.active){--inner-corner-size: var(--md-sys-shape-corner-lg-increased)}.split-btn:is(.split-btn-selected,:has(:popover-open)) :nth-last-child(1 of .btn){--inner-corner-size: calc(var(--container-height) / 2)}.split-btn{display:inline-flex;align-items:center;gap:var(--between-space)}.split-btn :nth-child(1 of .btn){border-start-start-radius:var(--outer-corner-size);border-end-start-radius:var(--outer-corner-size);border-start-end-radius:var(--inner-corner-size);border-end-end-radius:var(--inner-corner-size)}.split-btn :nth-last-child(1 of .btn){border-start-start-radius:var(--inner-corner-size);border-end-start-radius:var(--inner-corner-size);border-start-end-radius:var(--outer-corner-size);border-end-end-radius:var(--outer-corner-size)}.split-btn :nth-last-child(1 of .btn)::after{content:"arrow_drop_down";font:var(--md-icon-size) var(--md-icon-font);display:flex;align-items:center;aspect-ratio:1;width:var(--md-icon-size);overflow:hidden;position:relative;inset-inline-start:calc(var(--menu-icon-offset, 0px)*-1);transition:transform var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard)}.split-btn:is(.split-btn-selected,:has(:popover-open)) :nth-last-child(1 of .btn)::after{transform:rotate(180deg)}.split-btn:is(.split-btn-selected,:has(:popover-open)) :nth-last-child(1 of .btn){--menu-icon-offset: 0px}::slotted(md-gb-menu:popover-open){margin:4px 0}::slotted(md-gb-menu){--menu-anchor-spacing: 4px;--menu-anchor-align: end}@supports(position-area: end) and (position-try-fallbacks: flip-block){::slotted(md-gb-menu:popover-open){position-area:block-end span-inline-start;position-try-fallbacks:flip-block,flip-inline,flip-block flip-inline}}@media(prefers-reduced-motion: reduce){.split-btn :nth-last-child(1 of .btn)::after{transition:none}}}
`);var f=u;var r=class extends h{constructor(){super(...arguments),this.color="filled",this.size="sm",this.selected=!1}render(){let e={color:this.color,size:this.size};return d`<div part="split-btn" class="${g(this)}">
      <slot
        name="leading"
        part="leading-btn"
        class="${l(e)}"
        @focusin=${this.updateSlotFocusVisible}
        @focusout=${this.updateSlotFocusVisible}
        @click=${this.forwardSlotClick}>
      </slot>
      <slot
        name="trailing"
        part="trailing-btn"
        class="${l(e)}"
        @focusin=${this.updateSlotFocusVisible}
        @focusout=${this.updateSlotFocusVisible}
        @click=${this.forwardSlotClick}
        @slotchange=${this.handleTrailingSlotchange}>
      </slot>
      <slot></slot>
    </div>`}forwardSlotClick(e){let n=e.currentTarget;if(e.target!==n)return;let t=n.assignedElements().find(s=>s.matches("button"));!t||t.disabled||(e.stopPropagation(),t.click())}updateSlotFocusVisible(e){let n=e.currentTarget,t=n.assignedElements().some(s=>s.matches(":focus-visible,:has(:focus-visible)"));n.classList.toggle("focus-visible",t)}handleTrailingSlotchange(e){this.cleanupToggleListener?.abort(),this.cleanupToggleListener=new AbortController;let t=e.target.assignedElements().find(a=>a.matches("button"));if(!t?.popoverTargetElement)return;let s=t.popoverTargetElement;t.setAttribute("aria-expanded",String(s.matches(":popover-open"))),s.addEventListener("toggle",a=>{let c=a.newState==="open";this.selected=c,t.setAttribute("aria-expanded",String(c))},{signal:this.cleanupToggleListener.signal})}};r.styles=[b,m,v,f,p`
      :host {
        display: inline-flex;
      }
      .split-btn {
        flex: 1;
        /* Contains the slots' touch targets (::before, absolute). The leading
           slot is display: contents, so without this its touch target sizes
           against the viewport and covers the page. */
        position: relative;
      }
      /* The menu icon is the trailing slot's ::after, painted over the
         slotted button: clicks pass through to the button. */
      [name='trailing']::after {
        pointer-events: none;
      }
      [name='leading'] {
        display: contents;
        &::slotted(button) {
          all: inherit;
          display: flex;
          /* The slot's border is part of the size height. */
          box-sizing: border-box;
        }
      }
      [name='trailing'] {
        position: relative;
        &::slotted(button) {
          position: absolute;
          inset: 0;
          appearance: none;
          background: none;
          border: none;
          outline: none;
          /* Optically centers the menu icon (split-button.md Measurements):
             content sits --menu-icon-offset left of center when unselected. */
          padding: 0;
          padding-inline-end: calc(var(--menu-icon-offset, 0px) * 2);
        }
      }
    `];i([o()],r.prototype,"color",void 0);i([o()],r.prototype,"size",void 0);i([o({type:Boolean})],r.prototype,"selected",void 0);export{r as a};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
