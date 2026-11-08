function r(n){let t=[],o=e=>{e instanceof Element&&t.push(e),e instanceof Element&&e.shadowRoot&&o(e.shadowRoot);for(let i of Array.from(e.children))o(i)};return o(n),t}function l(n){let t=n.getBoundingClientRect();return{x:Math.round(t.left+t.width/2),y:Math.round(t.top+t.height/2)}}function u(n){return r(n).filter(t=>t.classList.contains("ripple"))}function f(n){return r(n).filter(t=>t.classList.contains("focus-ring-outer")||t.classList.contains("focus-ring-inner"))}function p(n,t,o){return getComputedStyle(n,o).getPropertyValue(t).trim()}var c=globalThis.requestAnimationFrame.bind(globalThis),s=globalThis.setTimeout.bind(globalThis);async function a(n,{timeout:t=1e3}={}){let o=performance.now()+t;for(;!n();){if(performance.now()>o)return!1;await new Promise(e=>{c(e),s(e,16)})}return!0}function m(n,t){return a(()=>(jasmine.clock().tick(1),n()),t)}function h(){let n=performance.now();return spyOn(performance,"now").and.callFake(()=>n),{advance(t){n+=t,jasmine.clock().tick(1)}}}export{r as a,l as b,u as c,f as d,p as e,a as f,m as g,h};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
