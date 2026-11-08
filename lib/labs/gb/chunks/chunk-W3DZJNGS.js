import{a as R,d as S,f as A,g as C}from"./chunk-MJ53EPGY.js";import{f as _}from"./chunk-4ALLPR45.js";import{a as v}from"./chunk-I43TUDDJ.js";import{a as s,c as l,d as g,e as k}from"./chunk-SZVN5I3Q.js";import{g as L}from"./chunk-MZFGRIKD.js";import{a as $,b as c,c as f,e as i,h as x}from"./chunk-YRNKHAFN.js";var z=new CSSStyleSheet;z.replaceSync(`/*!
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */@layer md.sys;@layer md.comp.pull-to-refresh{:host,.pull-to-refresh{--indicator-container-color: var(--md-sys-color-primary-container);--indicator-color: var(--md-sys-color-on-primary-container);--indicator-container-height: 48px;--indicator-container-width: 48px;--indicator-container-shape: var(--md-sys-shape-corner-full);--indicator-elevation: var(--md-sys-elevation-shadow-0);--indicator-max-distance: 80px;--motion-settle-duration: var(--md-sys-motion-spring-default-effects-duration);--motion-settle-easing: var(--md-sys-motion-spring-default-effects);--motion-effects-duration: var(--md-sys-motion-spring-default-effects-duration);--motion-effects-easing: var(--md-sys-motion-spring-default-effects)}:host([indicator=circular]),.pull-to-refresh-circular{--indicator-container-color: var(--md-sys-color-surface-container-high);--indicator-color: var(--md-sys-color-on-surface-variant);--indicator-container-height: 40px;--indicator-container-width: 40px;--indicator-elevation: var(--md-sys-elevation-shadow-2)}.pull-to-refresh{block-size:100%;box-sizing:border-box;display:block;overflow:hidden;position:relative}.pull-to-refresh-scroller{block-size:100%;box-sizing:border-box;overflow-y:auto;scrollbar-gutter:var(--scrollbar-gutter, stable)}@supports not selector(::-webkit-scrollbar){.pull-to-refresh-scroller{scrollbar-width:thin;scrollbar-color:var(--md-sys-color-outline) rgba(0,0,0,0)}.pull-to-refresh-scroller:hover{scrollbar-color:var(--md-sys-color-on-surface-variant) rgba(0,0,0,0)}}.pull-to-refresh-scroller::-webkit-scrollbar{width:10px;height:10px}.pull-to-refresh-scroller::-webkit-scrollbar-button{display:none}.pull-to-refresh-scroller::-webkit-scrollbar-track,.pull-to-refresh-scroller::-webkit-scrollbar-corner{background:rgba(0,0,0,0)}.pull-to-refresh-scroller::-webkit-scrollbar-track{margin:var(--scrollbar-track-inset, 4px)}.pull-to-refresh-scroller::-webkit-scrollbar-thumb{min-height:40px;border:2px solid rgba(0,0,0,0);border-radius:var(--md-sys-shape-corner-full);background:var(--md-sys-color-outline) padding-box}.pull-to-refresh-scroller:hover::-webkit-scrollbar-thumb{background-color:var(--md-sys-color-on-surface-variant)}.pull-to-refresh-scroller{overscroll-behavior-y:contain}@supports(touch-action: pan-down){.pull-to-refresh-scroller.pull-to-refresh-at-top{touch-action:pan-x pan-down pinch-zoom}}.pull-to-refresh-indicator{--_fraction: 0;align-items:center;background-color:var(--indicator-container-color);block-size:var(--indicator-container-height);border-radius:var(--indicator-container-shape);box-shadow:var(--indicator-elevation);box-sizing:border-box;color:var(--indicator-color);display:flex;inline-size:var(--indicator-container-width);inset-block-start:0;inset-inline:0;justify-content:center;margin-inline:auto;overflow:hidden;pointer-events:none;position:absolute;transition:translate var(--motion-settle-duration) var(--motion-settle-easing),visibility 0s linear var(--motion-settle-duration);translate:0 calc(var(--_fraction)*var(--indicator-max-distance) - 100%);visibility:hidden;z-index:1}.pull-to-refresh-pulling>.pull-to-refresh-indicator{--_fraction: var(--pull-to-refresh-fraction, 0);transition:none;visibility:visible}.pull-to-refresh-refreshing>.pull-to-refresh-indicator{--_fraction: 1;transition:translate var(--motion-settle-duration) var(--motion-settle-easing),visibility 0s;visibility:visible}.pull-to-refresh-pulling{-webkit-user-select:none}@supports(user-select: none){.pull-to-refresh-pulling{user-select:none}}.pull-to-refresh-loading{display:flex;flex:none}md-gb-loading-indicator::part(indicator),.pull-to-refresh-indicator>.loading-indicator{--active-indicator-color: var(--indicator-color);--container-color: var(--indicator-container-color);--container-height: var(--indicator-container-height);--container-width: var(--indicator-container-width)}.pull-to-refresh-arrow,.pull-to-refresh-spinner{block-size:16px;flex:none;grid-area:1/1;inline-size:16px;overflow:visible;transition:opacity var(--motion-effects-duration) var(--motion-effects-easing)}.pull-to-refresh-circular-stack{display:grid;place-items:center}.pull-to-refresh-arrow{fill:none;stroke:currentColor;stroke-width:2.5px}.pull-to-refresh-arrow-arc{opacity:var(--_alpha, 1);transition:opacity var(--motion-effects-duration) var(--motion-effects-easing)}.pull-to-refresh-spinner{animation:md-pull-to-refresh-spin 1333ms linear infinite;fill:none;opacity:0;stroke:currentColor;stroke-dasharray:32 42.4;stroke-width:2.5px}.pull-to-refresh-refreshing .pull-to-refresh-arrow{opacity:0}.pull-to-refresh-refreshing .pull-to-refresh-spinner{opacity:1}@keyframes md-pull-to-refresh-spin{to{rotate:360deg}}@media(prefers-reduced-motion: reduce){.pull-to-refresh-indicator,.pull-to-refresh-refreshing>.pull-to-refresh-indicator{transition:visibility 0s}.pull-to-refresh-arrow,.pull-to-refresh-arrow-arc,.pull-to-refresh-spinner{transition:none}.pull-to-refresh-spinner{animation-duration:4000ms}}@media(forced-colors: active){.pull-to-refresh-indicator{border:1px solid CanvasText}}}
`);var E=z;var U="Refreshing",D=5.5,b=2.5,G=10,P=5,a=16,t=class extends x{constructor(){super(...arguments),this.refreshing=!1,this.disabled=!1,this.threshold=R,this.indicator="loading",this.indicatorLabel=U,this.fraction=0,this.pulling=!1,this.gesture=null,this.announcer=new _(this)}connectedCallback(){super.connectedCallback(),this.hasUpdated&&this.connectGesture()}disconnectedCallback(){super.disconnectedCallback(),this.gesture?.disconnect(),this.gesture=null,this.pulling=!1}refresh(){return this.refreshing||!this.dispatchEvent(new Event("refresh",{cancelable:!0}))?!1:(this.refreshing=!0,!0)}firstUpdated(){this.connectGesture()}updated(r){(r.has("refreshing")||r.has("indicatorLabel"))&&(this.refreshing?this.announcer.announce(this.indicatorLabel):this.announcer.clear())}willUpdate(r){super.willUpdate(r),r.has("refreshing")&&this.refreshing&&(this.fraction=1)}render(){let r=this.pulling||this.refreshing;return c`
      <div
        class=${L(S({indicator:this.indicator,pulling:this.pulling,refreshing:this.refreshing,disabled:this.disabled}))}
        style=${v(this.pulling?{"--pull-to-refresh-fraction":String(this.fraction)}:{})}>
        <div part="scroller" class="pull-to-refresh-scroller">
          <slot></slot>
        </div>
        <div
          part="indicator"
          class="pull-to-refresh-indicator"
          aria-hidden=${r?i:"true"}>
          ${this.indicator==="circular"?this.renderCircular():this.renderLoading()}
        </div>
      </div>
    `}renderLoading(){let r=this.fraction,e=!this.refreshing&&r>1?-(r-1)*180:0;return c`<span
      class="pull-to-refresh-loading"
      style=${v(e?{rotate:`${e}deg`}:{})}>
      <md-gb-loading-indicator
        contained
        aria-label=${this.indicatorLabel}
        .value=${this.refreshing?void 0:Math.min(1,r)}>
      </md-gb-loading-indicator>
    </span>`}renderCircular(){let r=this.fraction,e=A(r),o=a/2,n=D+b/2,m=H=>{let w=H*Math.PI/180;return`${o+n*Math.cos(w)} ${o+n*Math.sin(w)}`},y=e.endAngle-e.startAngle,T=y>0?`M ${m(e.startAngle)} A ${n} ${n} 0 ${y>180?1:0} 1 ${m(e.endAngle)}`:"",h=G*e.scale,M=P*e.scale,d=n+o-h/2,p=o-b,I=`M ${d} ${p} L ${d+h/2} ${p+M} L ${d+h} ${p}`,u=r>0&&!this.refreshing;return c`<span class="pull-to-refresh-circular-stack">
      <svg
        class="pull-to-refresh-arrow"
        viewBox="0 0 ${a} ${a}"
        role="progressbar"
        aria-label=${this.indicatorLabel}
        aria-hidden=${this.refreshing?"true":i}
        aria-valuemin=${u?0:i}
        aria-valuemax=${u?100:i}
        aria-valuenow=${u?Math.round(Math.min(1,r)*100):i}
        style="--_alpha: ${e.alpha}">
        ${f`<g class="pull-to-refresh-arrow-arc"
          transform="rotate(${e.rotation} ${o} ${o})">
          <path d=${T}></path>
          <path d=${I}
            transform="rotate(${e.endAngle-b} ${o} ${o})"></path>
        </g>`}
      </svg>
      <svg
        class="pull-to-refresh-spinner"
        viewBox="0 0 ${a} ${a}"
        role=${this.refreshing?"progressbar":i}
        aria-label=${this.refreshing?this.indicatorLabel:i}
        aria-hidden=${this.refreshing?i:"true"}>
        ${f`<circle cx=${o} cy=${o} r=${n}></circle>`}
      </svg>
    </span>`}connectGesture(){if(this.gesture){this.gesture.syncScroller();return}let r=this.renderRoot.querySelector(".pull-to-refresh");r&&(this.gesture=new C(r,{scroller:()=>this.scroller,threshold:()=>this.threshold,enabled:()=>!this.disabled&&!this.refreshing,onPull:e=>{this.fraction=e,this.pulling=e>0},onRelease:e=>{this.pulling=!1,e&&this.refresh()}}))}};t.styles=[E,$`
      :host {
        display: block;
        position: relative;
      }

      :host([hidden]) {
        display: none;
      }
    `];s([l({type:Boolean,reflect:!0})],t.prototype,"refreshing",void 0);s([l({type:Boolean,reflect:!0})],t.prototype,"disabled",void 0);s([l({type:Number})],t.prototype,"threshold",void 0);s([l({reflect:!0})],t.prototype,"indicator",void 0);s([l({attribute:"indicator-label"})],t.prototype,"indicatorLabel",void 0);s([g()],t.prototype,"fraction",void 0);s([g()],t.prototype,"pulling",void 0);s([k(".pull-to-refresh-scroller")],t.prototype,"scroller",void 0);export{t as a};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
