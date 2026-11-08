import{a as m}from"./chunk-THNPU74B.js";import{a,b as p}from"./chunk-UUQJVX7P.js";import{a as i,b as s}from"./chunk-TY6MUWQF.js";function k(c){class e extends c{get name(){return this.getAttribute("name")??""}set name(r){this.setAttribute("name",r)}constructor(...r){super(...r),this.type="submit",this.value="",!!1&&(p(this,"click"),this.addEventListener("click",async o=>{let n=this.type==="reset",f=this.type==="submit",u=this[m],{form:t}=u;!t||!(f||n)||a(o,()=>{if(!o.defaultPrevented){if(n){t.reset();return}t.addEventListener("submit",l=>{Object.defineProperty(l,"submitter",{configurable:!0,enumerable:!0,get:()=>this})},{capture:!0,once:!0}),u.setFormValue(this.value),t.requestSubmit()}})}))}}return i([s()],e.prototype,"type",void 0),i([s({reflect:!0})],e.prototype,"value",void 0),e}export{k as a};
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
