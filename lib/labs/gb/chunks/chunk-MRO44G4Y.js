import{f as v,g as w}from"./chunk-HUXS3TKG.js";import{a as p,b as g,e as b}from"./chunk-YRNKHAFN.js";var y="data-overflow-hidden",k=p`
  [data-overflow-hidden],
  ::slotted([data-overflow-hidden]) {
    display: none !important;
  }
`,I=g`<svg
  viewBox="0 -960 960 960"
  width="24"
  height="24"
  fill="currentColor"
  aria-hidden="true">
  <path
    d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" />
</svg>`;function C(r){return r.getAttribute("aria-label")||(r.textContent??"").replace(/\s+/g," ").trim()||r.getAttribute("title")||""}function x(r,t,o){let e=[];for(let n of Array.from(r.children))n instanceof HTMLSlotElement?e.push(...n.assignedElements({flatten:!0})):e.push(n);let s=r.getBoundingClientRect(),h=getComputedStyle(r),d=n=>parseFloat(n)||0,f=t?s.top+d(h.borderTopWidth)+d(h.paddingTop):s.left+d(h.borderLeftWidth)+d(h.paddingLeft),c=t?s.bottom-d(h.borderBottomWidth)-d(h.paddingBottom):s.right-d(h.borderRightWidth)-d(h.paddingRight);for(let n of e){if(n===o||!n.getClientRects().length)continue;let a=n.getBoundingClientRect();if(!a.width&&!a.height)continue;let i=t?a.top:a.left,l=t?a.bottom:a.right;if(i<f-1||l>c+1)return!1}return!0}function T(r){return!!r.disabled||r.getAttribute("aria-disabled")==="true"}var A=class{constructor(t,o){this.host=t,this.options=o,this.hiddenByUs=new Set,this.observed=new Set,this.measuring=!1,this.frame=0,this.menuNode=null,this.closedAt=-1/0,this.overflowedItems=[],this.onClick=e=>{let s=this.options.trigger();!s||!e.composedPath().includes(s)||e.detail>0&&performance.now()-this.closedAt<250||this.open()},this.onKeydown=e=>{if(e.key!=="ArrowDown"&&e.key!=="ArrowUp"||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey)return;let s=this.options.trigger();!s||!e.composedPath().includes(s)||(e.preventDefault(),e.stopPropagation(),this.open())},this.observer=new ResizeObserver(()=>{cancelAnimationFrame(this.frame),this.frame=requestAnimationFrame(()=>{this.measure()})}),t.addController(this)}get overflowed(){return this.overflowedItems}hostConnected(){this.host.addEventListener("click",this.onClick),this.host.addEventListener("keydown",this.onKeydown)}hostDisconnected(){this.host.removeEventListener("click",this.onClick),this.host.removeEventListener("keydown",this.onKeydown),cancelAnimationFrame(this.frame),this.observer.disconnect(),this.observed.clear(),this.menuAbort?.abort(),this.menuNode=null}hostUpdated(){this.watchMenu(),this.observe(),this.measure()}refresh(){this.observe(),this.measure()}open(){let t=this.options.menu(),o=this.options.trigger();!t||!o||t.matches(":popover-open")||t.showPopover.call(t,{source:o})}close(){let t=this.options.menu();t?.matches(":popover-open")&&t.hidePopover()}activate(t){this.close(),!T(t)&&t.click()}observe(){let t=new Set,o=this.options.container();o&&t.add(o),t.add(this.host);let e=this.host.parentElement??this.host.getRootNode().host??null;e&&t.add(e);for(let s of this.options.items())t.add(s);for(let s of this.observed)t.has(s)||this.observer.unobserve(s);for(let s of t)this.observed.has(s)||this.observer.observe(s);this.observed=t}setHidden(t,o){o?this.hiddenByUs.add(t):this.hiddenByUs.delete(t),t.hidden=o,t.toggleAttribute(y,o)}measure(){if(this.measuring)return;this.measuring=!0;let t=v();try{let{options:o}=this,e=o.container(),s=o.trigger();if(e&&!e.getClientRects().length)return;let h=(o.enabled?.()??!0)&&!!e;if(!h&&!this.hiddenByUs.size&&!this.overflowedItems.length)return;let d=o.items();for(let i of this.hiddenByUs)d.includes(i)||this.setHidden(i,!1);let f=d.filter(i=>this.hiddenByUs.has(i)||!i.hidden);for(let i of f)this.setHidden(i,!1);let c=i=>{!s||s.hidden!==i||(s.toggleAttribute(y,!i),s.hidden=!i)};s&&!s.hasAttribute("aria-haspopup")&&s.setAttribute("aria-haspopup","menu");let n=[];if(h&&e){let i=o.axis?.()==="block",l=u=>x(e,i,u);if(c(!0),l())c(!1);else if(l(s))c(!1);else for(let u=f.length-1;u>=0;u--){let m=f[u],q=m.matches(":focus-within");if(this.setHidden(m,!0),n.unshift(m),q&&s?.focus(),l())break}}else c(!1);let a=n.length!==this.overflowedItems.length||n.some((i,l)=>i!==this.overflowedItems[l]);this.overflowedItems=n,n.length||this.close(),a&&this.host.requestUpdate()}finally{this.measuring=!1,w("overflow.measure",t,{hidden:this.overflowedItems.length})}}watchMenu(){let t=this.options.menu();if(t===this.menuNode||(this.menuAbort?.abort(),this.menuNode=t,!t))return;let o=new AbortController;this.menuAbort=o,t.addEventListener("toggle",e=>{let s=e.newState==="open";s||(this.closedAt=performance.now()),this.options.trigger()?.setAttribute("aria-expanded",String(s))},{signal:o.signal})}};function L(r,t={}){let o=r.overflowed;return o.length?g`<md-gb-menu
    class="overflow-menu"
    @toggle=${e=>{e.newState==="closed"&&t.onClose?.()}}>
    ${o.length?o.map(e=>g`<md-gb-menu-item
              ?disabled=${T(e)}
              @click=${()=>{r.activate(e)}}>
              ${C(e)}
            </md-gb-menu-item>`):b}
  </md-gb-menu>`:g``}export{y as a,k as b,I as c,C as d,A as e,L as f};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
