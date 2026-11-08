import{a as o}from"./chunk-5P7DCY45.js";var p={fromAttribute(u){return u??""},toAttribute(u){return u||null}};var m=class extends o{computeValidity({state:t,renderedControl:r}){let e=r;a(t)&&!e?(e=this.inputControl||document.createElement("input"),this.inputControl=e):e||(e=this.textAreaControl||document.createElement("textarea"),this.textAreaControl=e);let n=a(t)?e:null;if(n&&(n.type=t.type),e.value!==t.value&&(e.value=t.value),e.required=t.required,n){let i=t;i.pattern?n.pattern=i.pattern:n.removeAttribute("pattern"),i.min?n.min=i.min:n.removeAttribute("min"),i.max?n.max=i.max:n.removeAttribute("max"),i.step?n.step=i.step:n.removeAttribute("step")}return(t.minLength??-1)>-1?e.setAttribute("minlength",String(t.minLength)):e.removeAttribute("minlength"),(t.maxLength??-1)>-1?e.setAttribute("maxlength",String(t.maxLength)):e.removeAttribute("maxlength"),{validity:e.validity,validationMessage:e.validationMessage}}equals({state:t},{state:r}){let e=t.type===r.type&&t.value===r.value&&t.required===r.required&&t.minLength===r.minLength&&t.maxLength===r.maxLength;return!a(t)||!a(r)?e:e&&t.pattern===r.pattern&&t.min===r.min&&t.max===r.max&&t.step===r.step}copy({state:t}){return{state:a(t)?this.copyInput(t):this.copyTextArea(t),renderedControl:null}}copyInput(t){let{type:r,pattern:e,min:n,max:i,step:l}=t;return{...this.copySharedState(t),type:r,pattern:e,min:n,max:i,step:l}}copyTextArea(t){return{...this.copySharedState(t),type:t.type}}copySharedState({value:t,required:r,minLength:e,maxLength:n}){return{value:t,required:r,minLength:e,maxLength:n}}};function a(u){return u.type!=="textarea"}export{p as a,m as b};
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
