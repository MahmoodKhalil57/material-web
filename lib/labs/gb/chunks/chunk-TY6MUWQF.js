function m(t,e,r,a){var o=arguments.length,n=o<3?e:a===null?a=Object.getOwnPropertyDescriptor(e,r):a,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,r,a);else for(var l=t.length-1;l>=0;l--)(i=t[l])&&(n=(o<3?i(n):o>3?i(e,r,n):i(e,r))||n);return o>3&&n&&Object.defineProperty(e,r,n),n}var p=(t,e)=>e.kind==="method"&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(r){r.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){typeof e.initializer=="function"&&(this[e.key]=e.initializer.call(this))},finisher(r){r.createProperty(e.key,t)}},y=(t,e,r)=>{e.constructor.createProperty(r,t)};function f(t){return(e,r)=>r!==void 0?y(t,e,r):p(t,e)}function w(t){return f({...t,state:!0})}var u=({finisher:t,descriptor:e})=>(r,a)=>{var o;if(a===void 0){let n=(o=r.originalKey)!==null&&o!==void 0?o:r.key,i=e!=null?{kind:"method",placement:"prototype",key:n,descriptor:e(r.key)}:{...r,key:n};return t!=null&&(i.finisher=function(l){t(l,n)}),i}{let n=r.constructor;e!==void 0&&Object.defineProperty(r,a,e(a)),t?.(n,a)}};function P(t,e){return u({descriptor:r=>{let a={get(){var o,n;return(n=(o=this.renderRoot)===null||o===void 0?void 0:o.querySelector(t))!==null&&n!==void 0?n:null},enumerable:!0,configurable:!0};if(e){let o=typeof r=="symbol"?Symbol():"__"+r;a.get=function(){var n,i;return this[o]===void 0&&(this[o]=(i=(n=this.renderRoot)===null||n===void 0?void 0:n.querySelector(t))!==null&&i!==void 0?i:null),this[o]}}return a}})}var c,d=((c=window.HTMLSlotElement)===null||c===void 0?void 0:c.prototype.assignedElements)!=null?(t,e)=>t.assignedElements(e):(t,e)=>t.assignedNodes(e).filter(r=>r.nodeType===Node.ELEMENT_NODE);function h(t){let{slot:e,selector:r}=t??{};return u({descriptor:a=>({get(){var o;let n="slot"+(e?`[name=${e}]`:":not([name])"),i=(o=this.renderRoot)===null||o===void 0?void 0:o.querySelector(n),l=i!=null?d(i,t):[];return r?l.filter(s=>s.matches(r)):l},enumerable:!0,configurable:!0})})}export{m as a,f as b,w as c,P as d,h as e};
/*! Bundled license information:

@lit/reactive-element/decorators/property.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/state.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/base.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/custom-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/event-options.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-all.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-async.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
