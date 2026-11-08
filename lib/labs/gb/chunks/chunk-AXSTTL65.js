import{a as w}from"./chunk-G3CNR2DB.js";import{a as b}from"./chunk-JOFVBJZY.js";import{a as x}from"./chunk-BSYQOTQO.js";import{c as y}from"./chunk-4GP2DOSS.js";import{b as u}from"./chunk-THNPU74B.js";import{a as v}from"./chunk-L53ZTFE6.js";import{a as m}from"./chunk-LAM7XTM2.js";import{f as l}from"./chunk-6Z7EVUE6.js";import{a as f}from"./chunk-HSWNOLES.js";import{a}from"./chunk-PSCELYSS.js";import{a as $}from"./chunk-SFW3MHH7.js";import{a as g}from"./chunk-AZF4SAF6.js";import{f as D}from"./chunk-SEGIRCNK.js";import{a as o,b as i}from"./chunk-TY6MUWQF.js";import{a as h,b as r,e as t,h as c}from"./chunk-YRNKHAFN.js";var S=f(b(y(u(c)))),e=class extends S{get type(){return this.href?"link":super.type}set type(s){this.href&&s!=="link"||(super.type=s)}constructor(){super(),this.color="text",this.size="sm",this.square=!1,this.unfilledIcon=!1,this.softDisabled=!1,this.selected=!1,this.href="",this.download="",this.target="",this.rel="",this.referrerPolicy="",new x(this,()=>this.renderRoot?.querySelector("button"))}render(){let s=D({color:this.color,size:this.size,square:this.square,selected:this.type==="toggle"?this.selected:void 0,disabled:this.disabled||this.softDisabled}),{ariaLabel:n,ariaHasPopup:d,ariaExpanded:p}=this;return this.type==="link"?r`<a
        part="btn"
        class=${s}
        href=${v(this.href)}
        download=${this.download||t}
        target=${this.target||t}
        rel=${this.rel||t}
        referrerpolicy=${this.referrerPolicy||t}
        aria-label=${n||t}
        aria-haspopup=${d||t}
        aria-expanded=${p||t}
        aria-disabled=${this.disabled||this.softDisabled||t}
        tabindex=${this.disabled&&!this.softDisabled?-1:t}>
        <slot></slot>
        <slot name="container" ${a()} ${l()}></slot>
      </a>`:r`<button
      part="btn"
      class=${s}
      ?disabled=${this.disabled}
      aria-disabled=${this.softDisabled||t}
      aria-label=${n||t}
      aria-pressed=${this.type==="toggle"?this.selected:t}
      aria-haspopup=${d||t}
      aria-expanded=${p||t}
      @change=${this.handleChange}>
      <slot></slot>
      <slot name="container" ${a()} ${l()}></slot>
    </button>`}handleChange(s){this.selected=s.target.ariaPressed==="true",m(this,s)}};e.shadowRootOptions={mode:"open",delegatesFocus:!0};e.styles=[g,$,w,h`
      :host {
        --md-icon-fill: 1;
        display: inline-flex;
        isolation: isolate;
      }

      :host([type='toggle']:not([selected])) {
        --md-icon-fill: 0;
      }

      :host([type='toggle'][selected]) {
        --md-icon-fill: 1;
      }

      /*
       * A selected toggle whose icon has no filled version gets a semibold
       * icon instead of a filled one (buttons.md Toggle buttons).
       */
      :host([type='toggle'][selected][unfilled-icon]) {
        --md-icon-fill: 0;
        --md-icon-wght: 600;
      }

      .btn {
        flex: 1;
        position: relative;
      }
      .btn:has([name='container'].has-slotted) {
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
      slot[name='container']::slotted(*) {
        width: 100%;
        height: 100%;
      }
    `];o([i()],e.prototype,"color",void 0);o([i()],e.prototype,"size",void 0);o([i({type:Boolean})],e.prototype,"square",void 0);o([i({type:Boolean,reflect:!0,attribute:"unfilled-icon"})],e.prototype,"unfilledIcon",void 0);o([i({noAccessor:!0,reflect:!0})],e.prototype,"type",null);o([i({type:Boolean,attribute:"soft-disabled",reflect:!0})],e.prototype,"softDisabled",void 0);o([i({type:Boolean,reflect:!0})],e.prototype,"selected",void 0);o([i()],e.prototype,"href",void 0);o([i()],e.prototype,"download",void 0);o([i()],e.prototype,"target",void 0);o([i()],e.prototype,"rel",void 0);o([i()],e.prototype,"referrerPolicy",void 0);export{e as a};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
