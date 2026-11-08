import{a as e}from"./chunk-THNPU74B.js";var l=Symbol("createValidator"),d=Symbol("getValidityAnchor"),o=Symbol("privateValidator"),t=Symbol("privateSyncValidity"),a=Symbol("privateCustomValidationMessage");function g(h){var n;class c extends h{constructor(){super(...arguments),this[n]=""}get validity(){return this[t](),this[e].validity}get validationMessage(){return this[t](),this[e].validationMessage}get willValidate(){return this[t](),this[e].willValidate}checkValidity(){return this[t](),this[e].checkValidity()}reportValidity(){return this[t](),this[e].reportValidity()}setCustomValidity(i){this[a]=i,this[t]()}requestUpdate(i,r,s){super.requestUpdate(i,r,s),this[t]()}firstUpdated(i){super.firstUpdated(i),this[t]()}[(n=a,t)](){if(!1)return;this[o]||(this[o]=this[l]());let{validity:i,validationMessage:r}=this[o].getValidity(),s=!!this[a],V=this[a]||r;this[e].setValidity({...i,customError:s},V,this[d]()??void 0)}[l](){throw new Error("Implement [createValidator]")}[d](){throw new Error("Implement [getValidityAnchor]")}}return c}export{l as a,d as b,g as c};
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
