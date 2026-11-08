import{a,b as l,c as h}from"./chunk-MSNV3O7X.js";import{d as o}from"./chunk-YRNKHAFN.js";var c="important",d=" !"+c,m=l(class extends h{constructor(r){var t;if(super(r),r.type!==a.ATTRIBUTE||r.name!=="style"||((t=r.strings)===null||t===void 0?void 0:t.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(r){return Object.keys(r).reduce((t,s)=>{let e=r[s];return e==null?t:t+`${s=s.includes("-")?s:s.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${e};`},"")}update(r,[t]){let{style:s}=r.element;if(this.ht===void 0){this.ht=new Set;for(let e in t)this.ht.add(e);return this.render(t)}this.ht.forEach(e=>{t[e]==null&&(this.ht.delete(e),e.includes("-")?s.removeProperty(e):s[e]="")});for(let e in t){let n=t[e];if(n!=null){this.ht.add(e);let i=typeof n=="string"&&n.endsWith(d);e.includes("-")||i?s.setProperty(e,i?n.slice(0,-11):n,i?c:""):s[e]=n}}return o}});export{m as a};
/*! Bundled license information:

lit-html/directives/style-map.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
