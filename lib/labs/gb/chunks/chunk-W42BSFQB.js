import{k as m,q as u}from"./chunk-6DARSD4W.js";import{a as p}from"./chunk-PSCELYSS.js";import{a as d}from"./chunk-SFW3MHH7.js";import{a as c}from"./chunk-AZF4SAF6.js";import{d as a}from"./chunk-JUNG2MTN.js";import{a as t,c as o}from"./chunk-SZVN5I3Q.js";import{b as i,e as r,h as n}from"./chunk-YRNKHAFN.js";var v=new CSSStyleSheet;v.replaceSync(`/*!
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */@layer md.sys, md.comp.ripple, md.comp.focus-ring;@layer md.comp.carousel-item{:host{display:block;position:relative;pointer-events:none}.carousel-item{display:block;position:relative;box-sizing:border-box;--_carousel-item-press: 0px;transition:--_carousel-item-press var(--md-sys-motion-spring-fast-spatial-duration) var(--md-sys-motion-spring-fast-spatial);block-size:100%;inline-size:100%;margin:0;padding:0;list-style:none;pointer-events:none}.carousel-item.carousel-item-outlined{--outline-color: var(--md-sys-color-outline);--outline-width: 1px}@media(hover: hover){.carousel-item:is(:hover,.hover):not(.disabled){--container-elevation: var(--md-sys-elevation-shadow-1)}.carousel-item:is(:hover,.hover):not(.disabled).carousel-item-outlined{--outline-color: var(--md-sys-color-outline)}}.carousel-item:is(:focus-within,.focus):not(.disabled){--container-elevation: var(--md-sys-elevation-shadow-0)}.carousel-item:is(:focus-within,.focus):not(.disabled).carousel-item-outlined{--outline-color: var(--md-sys-color-on-surface)}.carousel-item:is(:active,.active,:has(.ripple.active)):not(.disabled){--container-elevation: var(--md-sys-elevation-shadow-0);--_carousel-item-press: 8px}.carousel-item:is(:active,.active,:has(.ripple.active)):not(.disabled).carousel-item-outlined{--outline-color: var(--md-sys-color-outline)}.carousel-item.disabled{--container-color: hsl(from var(--md-sys-color-surface) h s l / 38%);--container-elevation: var(--md-sys-elevation-shadow-0);--disabled-content-opacity: 0.38}.carousel-item.disabled.carousel-item-outlined{--outline-color: hsl(from var(--md-sys-color-outline) h s l / 12%)}@media(hover: hover){:host(:hover) .carousel-item:not(.disabled){--container-elevation: var(--md-sys-elevation-shadow-1)}:host(:hover) .carousel-item:not(.disabled).carousel-item-outlined{--outline-color: var(--md-sys-color-outline)}}.carousel-item-content{position:absolute;inset:0;overflow:hidden;background-color:var(--container-color);translate:var(--_carousel-item-translate, none);clip-path:inset(var(--_carousel-item-clip-top, 0px) var(--_carousel-item-clip-right, 0px) var(--_carousel-item-clip-bottom, 0px) var(--_carousel-item-clip-left, 0px) round max(0px, var(--container-shape) - var(--_carousel-item-press, 0px)));pointer-events:none}.carousel-item.disabled .carousel-item-content{opacity:var(--disabled-content-opacity, 1)}.carousel-item-media{position:absolute;inset:0;translate:var(--_carousel-item-parallax, none)}.carousel-item-media>*,.carousel-item-media>slot::slotted(*){display:block;inline-size:100%;block-size:100%;object-fit:cover}.carousel-item-label{position:absolute;inset-block-end:var(--_carousel-item-clip-bottom, 0px);left:var(--_carousel-item-clip-left, 0px);right:var(--_carousel-item-clip-right, 0px);box-sizing:border-box;padding:var(--label-padding);overflow:hidden;color:var(--label-text-color);font:var(--label-text);font-variation-settings:var(--label-text-axes);letter-spacing:var(--label-text-tracking);background:linear-gradient(to top, var(--label-scrim-color), transparent);opacity:clamp(0,(var(--carousel-item-fraction, 1) - .6)*2.5,1);pointer-events:none}.carousel-item-label:empty,.carousel-item-label:not(:has(>.has-slotted)):has(>slot){display:none}.carousel-item-frame{position:absolute;inset:var(--_carousel-item-clip-top, 0px) var(--_carousel-item-clip-right, 0px) var(--_carousel-item-clip-bottom, 0px) var(--_carousel-item-clip-left, 0px);box-sizing:border-box;border-radius:max(0px,var(--container-shape) - var(--_carousel-item-press, 0px));border:var(--outline-width, 0px) solid var(--outline-color, transparent);box-shadow:var(--container-elevation);translate:var(--_carousel-item-translate, none);pointer-events:auto;transition:box-shadow var(--md-sys-motion-spring-fast-effects-duration) var(--md-sys-motion-spring-fast-effects)}.carousel-item-action{appearance:none;display:block;position:absolute;inset:0;margin:0;padding:0;border:none;border-radius:inherit;outline:none;background-color:rgba(0,0,0,0);color:var(--md-sys-color-on-surface);cursor:pointer;-webkit-tap-highlight-color:rgba(0,0,0,0)}.carousel-item-action:disabled,.carousel-item-action[aria-disabled=true]{cursor:default}@media(prefers-reduced-motion: reduce){.carousel-item-frame{transition:none}}}
`);var b=v;var h=!1;function f(){if(!(h||typeof CSS>"u"||!CSS.registerProperty)){h=!0;try{CSS.registerProperty({name:"--_carousel-item-press",syntax:"<length>",initialValue:"0px",inherits:!0})}catch{}}}var e=class extends n{constructor(){super(),this.label="",this.href="",this.target="",this.disabled=!1,this.outlined=!1,this.internals=this.attachInternals(),this.internals.role="listitem",f()}render(){return i`<div
      part="item"
      class=${u({outlined:this.outlined,disabled:this.disabled})}>
      <div part="content" class="carousel-item-content">
        <div class="carousel-item-media"><slot></slot></div>
        <div part="label" class="carousel-item-label" id="label">
          <slot name="label" ${p()}></slot>
        </div>
      </div>
      <div part="frame" class=${m}>
        ${this.renderAction()}
      </div>
    </div>`}renderAction(){let s=this.label||r,l=this.label?r:"label";return this.href&&!this.disabled?i`<a
        part="action"
        class="carousel-item-action ripple focus-ring-target"
        href=${this.href}
        target=${this.target||r}
        aria-label=${s}
        aria-labelledby=${l}
        ${a()}></a>`:i`<button
      part="action"
      class="carousel-item-action ripple focus-ring-target"
      ?disabled=${this.disabled}
      aria-label=${s}
      aria-labelledby=${l}
      ${a()}></button>`}};e.shadowRootOptions={mode:"open",delegatesFocus:!0};e.styles=[c,d,b];t([o()],e.prototype,"label",void 0);t([o()],e.prototype,"href",void 0);t([o()],e.prototype,"target",void 0);t([o({type:Boolean,reflect:!0})],e.prototype,"disabled",void 0);t([o({type:Boolean,reflect:!0})],e.prototype,"outlined",void 0);export{e as a};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
