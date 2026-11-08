import{b as v}from"./chunk-TF5TTUOH.js";import{g as x}from"./chunk-XITO3S2G.js";import{b as $}from"./chunk-VEUC3475.js";import{b as g}from"./chunk-YZRY4EP7.js";import{b as w}from"./chunk-PV5BZ7Q3.js";import{a as m}from"./chunk-2D6ET34O.js";import{a as b}from"./chunk-BSYQOTQO.js";import{c as y}from"./chunk-ZEX6GOS6.js";import{b as f}from"./chunk-THNPU74B.js";import{a as u}from"./chunk-L53ZTFE6.js";import{a as c}from"./chunk-LAM7XTM2.js";import{a as h}from"./chunk-HSWNOLES.js";import{a as o,c as i}from"./chunk-SZVN5I3Q.js";import{a as n,b as l,e,h as p}from"./chunk-YRNKHAFN.js";var D=h(m(y(f(p)))),t=class extends D{get density(){return this.densityValue}set density(s){let r=this.densityValue;this.densityValue=w(Number(s)),this.requestUpdate("density",r)}get type(){return this.href?"link":super.type}set type(s){this.href&&s!=="link"||(super.type=s)}constructor(){super(),this.color="standard",this.size="sm",this.square=!1,this.width="",this.densityValue=0,this.softDisabled=!1,this.selected=!1,this.unfilledIcon=!1,this.tooltip=!1,this.href="",this.download="",this.target="",this.rel="",this.referrerPolicy="",new b(this,()=>this.renderRoot?.querySelector("button"))}render(){let s=x({color:this.color,size:this.size,width:this.width,square:this.square,density:this.density,selected:this.type==="toggle"?this.selected:void 0,disabled:this.disabled||this.softDisabled}),{ariaLabel:r,ariaHasPopup:d,ariaExpanded:a}=this;return this.type==="link"?l`<a
        id="icon-btn"
        part="icon-btn"
        class=${s}
        href=${u(this.href)}
        download=${this.download||e}
        target=${this.target||e}
        rel=${this.rel||e}
        referrerpolicy=${this.referrerPolicy||e}
        aria-label=${r||e}
        aria-haspopup=${d||e}
        aria-expanded=${a||e}
        aria-disabled=${this.disabled||this.softDisabled||e}
        tabindex=${this.disabled&&!this.softDisabled?-1:e}>
        <slot></slot>
      </a>${this.renderTooltip(r)}`:l`<button
      id="icon-btn"
      part="icon-btn"
      class=${s}
      type="button"
      ?disabled=${this.disabled}
      aria-disabled=${this.softDisabled||e}
      aria-label=${r||e}
      aria-pressed=${this.type==="toggle"?this.selected:e}
      aria-haspopup=${d||e}
      aria-expanded=${a||e}
      @change=${this.handleChange}>
      <slot></slot>
    </button>${this.renderTooltip(r)}`}renderTooltip(s){return this.tooltip&&s?l`<md-gb-tooltip for="icon-btn">${s}</md-gb-tooltip>`:e}handleChange(s){this.selected=s.target.ariaPressed==="true",c(this,s)}};t.shadowRootOptions={mode:"open",delegatesFocus:!0};t.styles=[g,$,v,n`
      :host {
        --md-icon-fill: 1;
        display: inline-flex;
      }

      :host([type='toggle']:not([selected])) {
        --md-icon-fill: 0;
      }

      :host([type='toggle'][selected]) {
        --md-icon-fill: 1;
      }

      /*
       * A selected toggle whose icon has no filled version gets a semibold
       * icon instead of a filled one.
       */
      :host([type='toggle'][selected][unfilled-icon]) .icon-btn {
        --md-icon-fill: 0;
        --md-icon-wght: 600;
      }

      .icon-btn {
        flex: 1;
      }
    `];o([i()],t.prototype,"color",void 0);o([i()],t.prototype,"size",void 0);o([i({type:Boolean})],t.prototype,"square",void 0);o([i()],t.prototype,"width",void 0);o([i({type:Number,reflect:!0})],t.prototype,"density",null);o([i({noAccessor:!0,reflect:!0})],t.prototype,"type",null);o([i({type:Boolean,attribute:"soft-disabled",reflect:!0})],t.prototype,"softDisabled",void 0);o([i({type:Boolean,reflect:!0})],t.prototype,"selected",void 0);o([i({type:Boolean,reflect:!0,attribute:"unfilled-icon"})],t.prototype,"unfilledIcon",void 0);o([i({type:Boolean,reflect:!0})],t.prototype,"tooltip",void 0);o([i()],t.prototype,"href",void 0);o([i()],t.prototype,"download",void 0);o([i()],t.prototype,"target",void 0);o([i()],t.prototype,"rel",void 0);o([i()],t.prototype,"referrerPolicy",void 0);export{t as a};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
