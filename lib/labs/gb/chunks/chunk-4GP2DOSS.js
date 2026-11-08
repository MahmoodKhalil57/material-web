import{a as s}from"./chunk-THNPU74B.js";import{a,b as i}from"./chunk-TY6MUWQF.js";var l=Symbol("getFormValue"),u=Symbol("getFormState");function h(n){class r extends n{get form(){return this[s].form}get labels(){return this[s].labels}get name(){return this.getAttribute("name")??""}set name(t){this.setAttribute("name",t)}get disabled(){return this.hasAttribute("disabled")}set disabled(t){this.toggleAttribute("disabled",!!t)}attributeChangedCallback(t,e,o){if(t==="name"||t==="disabled"){let d=t==="disabled"?e!==null:e;this.requestUpdate(t,d);return}super.attributeChangedCallback(t,e,o)}requestUpdate(t,e,o){super.requestUpdate(t,e,o),this[s].setFormValue(this[l](),this[u]())}[l](){return this.getAttribute("value")}[u](){return this[l]()}formDisabledCallback(t){this.disabled=t}}return r.formAssociated=!0,a([i({noAccessor:!0})],r.prototype,"name",null),a([i({type:Boolean,noAccessor:!0})],r.prototype,"disabled",null),r}export{l as a,u as b,h as c};
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
