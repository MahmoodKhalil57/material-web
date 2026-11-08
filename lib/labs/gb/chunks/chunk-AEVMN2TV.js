import{c as R,d as E}from"./chunk-PV5BZ7Q3.js";import{b as C,c as g}from"./chunk-Q4E4VNSB.js";import{a as v,c as f}from"./chunk-5MKFU3OX.js";import{b as u}from"./chunk-WYBTMT3K.js";import{h as b}from"./chunk-MZFGRIKD.js";var a=class extends Event{constructor(t,s,o,e){super("context-request",{bubbles:!0,composed:!0}),this.context=t,this.contextTarget=s,this.callback=o,this.subscribe=e??!1}};var h=class{constructor(t,s,o,e){if(this.subscribe=!1,this.provided=!1,this.value=void 0,this.t=(n,r)=>{this.unsubscribe&&(this.unsubscribe!==r&&(this.provided=!1,this.unsubscribe()),this.subscribe||this.unsubscribe()),this.value=n,this.host.requestUpdate(),this.provided&&!this.subscribe||(this.provided=!0,this.callback&&this.callback(n,r)),this.unsubscribe=r},this.host=t,s.context!==void 0){let n=s;this.context=n.context,this.callback=n.callback,this.subscribe=n.subscribe??!1}else this.context=s,this.callback=o,this.subscribe=e??!1;this.host.addController(this)}hostConnected(){this.dispatchRequest()}hostDisconnected(){this.unsubscribe&&(this.unsubscribe(),this.unsubscribe=void 0)}dispatchRequest(){this.host.dispatchEvent(new a(this.context,this.host,this.t,this.subscribe))}};var x=class{get value(){return this.o}set value(t){this.setValue(t)}setValue(t,s=!1){let o=s||!Object.is(t,this.o);this.o=t,o&&this.updateObservers()}constructor(t){this.subscriptions=new Map,this.updateObservers=()=>{for(let[s,{disposer:o}]of this.subscriptions)s(this.o,o)},t!==void 0&&(this.value=t)}addCallback(t,s,o){if(!o)return void t(this.value);this.subscriptions.has(t)||this.subscriptions.set(t,{disposer:()=>{this.subscriptions.delete(t)},consumerHost:s});let{disposer:e}=this.subscriptions.get(t);t(this.value,e)}clearCallbacks(){this.subscriptions.clear()}};var m=class extends Event{constructor(t,s){super("context-provider",{bubbles:!0,composed:!0}),this.context=t,this.contextTarget=s}},l=class extends x{constructor(t,s,o){super(s.context!==void 0?s.initialValue:o),this.onContextRequest=e=>{if(e.context!==this.context)return;let n=e.contextTarget??e.composedPath()[0];n!==this.host&&(e.stopPropagation(),this.addCallback(e.callback,n,e.subscribe))},this.onProviderRequest=e=>{if(e.context!==this.context||(e.contextTarget??e.composedPath()[0])===this.host)return;let n=new Set;for(let[r,{consumerHost:c}]of this.subscriptions)n.has(r)||(n.add(r),c.dispatchEvent(new a(this.context,c,r,!0)));e.stopPropagation()},this.host=t,s.context!==void 0?this.context=s.context:this.context=s,this.attachListeners(),this.host.addController?.(this)}attachListeners(){this.host.addEventListener("context-request",this.onContextRequest),this.host.addEventListener("context-provider",this.onProviderRequest)}hostConnected(){this.host.dispatchEvent(new m(this.context,this.host))}};function k({context:i}){return(t,s)=>{let o=new WeakMap;if(typeof s=="object")return{get(){return t.get.call(this)},set(e){return o.get(this).setValue(e),t.set.call(this,e)},init(e){return o.set(this,new l(this,{context:i,initialValue:e})),e}};{t.constructor.addInitializer(r=>{o.set(r,new l(r,{context:i}))});let e=Object.getOwnPropertyDescriptor(t,s),n;if(e===void 0){let r=new WeakMap;n={get(){return r.get(this)},set(c){o.get(this).setValue(c),r.set(this,c)},configurable:!0,enumerable:!0}}else{let r=e.set;n={...e,set(c){o.get(this).setValue(c),r?.call(this,c)}}}return void Object.defineProperty(t,s,n)}}}function q({context:i,subscribe:t}){return(s,o)=>{typeof o=="object"?o.addInitializer(function(){new h(this,{context:i,callback:e=>{s.set.call(this,e)},subscribe:t})}):s.constructor.addInitializer(e=>{new h(e,{context:i,callback:n=>{e[o]=n},subscribe:t})})}}var rt=Symbol("menuContext"),P={standard:"standard",vibrant:"vibrant"},d={menu:"menu",menuVibrant:"menu-vibrant",menuGrouped:"menu-grouped",menuActive:"menu-active",menuInactive:"menu-inactive",...R("menu"),group:"menu-group",groupInactive:"menu-group-inactive",sectionLabel:"menu-section-label"};function S({color:i,layout:t,submenu:s,density:o=0}={}){return{[d.menu]:!0,[d.menuVibrant]:i===P.vibrant,[d.menuGrouped]:t==="grouped",[d.menuActive]:s==="active",[d.menuInactive]:s==="inactive",...E(d.menu,o)}}function I(i,t){}var ct=b({getClasses:S,setupElement:I}),at=Symbol("menuItemCheckable"),p={menuItem:"menu-item",checked:u.checked,hover:u.hover,focus:u.focus,active:u.active,disabled:u.disabled};function L({checked:i=!1,hover:t=!1,focus:s=!1,active:o=!1,disabled:e=!1}={}){return{...C(),...f({type:v.inner}),[p.menuItem]:!0,[p.checked]:i,[p.hover]:t,[p.focus]:s,[p.active]:o,[p.disabled]:e}}function M(i,t){g(i,t)}var ut=b({getClasses:L,setupElement:M});export{l as a,k as b,q as c,rt as d,P as e,d as f,S as g,I as h,ct as i,at as j,p as k,L as l,M as m,ut as n};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/*! Bundled license information:

@lit/context/lib/context-request-event.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/context/lib/create-context.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/context/lib/controllers/context-consumer.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/context/lib/value-notifier.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/context/lib/controllers/context-provider.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/context/lib/context-root.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/context/lib/decorators/provide.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/context/lib/decorators/consume.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
