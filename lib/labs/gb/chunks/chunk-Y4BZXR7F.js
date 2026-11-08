import{a as l,c as d}from"./chunk-SZVN5I3Q.js";var s=Symbol("isFocusable"),r=Symbol("privateIsFocusable"),a=Symbol("externalTabIndex"),n=Symbol("isUpdatingTabIndex"),i=Symbol("updateTabIndex");function f(h){var o,b,c;class u extends h{constructor(){super(...arguments),this[o]=!0,this[b]=null,this[c]=!1}get[s](){return this[r]}set[s](t){this[s]!==t&&(this[r]=t,this[i]())}connectedCallback(){super.connectedCallback(),this[i]()}attributeChangedCallback(t,e,x){if(t!=="tabindex"){super.attributeChangedCallback(t,e,x);return}if(this.requestUpdate("tabIndex",Number(e??-1)),!this[n]){if(!this.hasAttribute("tabindex")){this[a]=null,this[i]();return}this[a]=this.tabIndex}}[(o=r,b=a,c=n,i)](){let t=this[s]?0:-1,e=this[a]??t;this[n]=!0,this.tabIndex=e,this[n]=!1}}return l([d({noAccessor:!0})],u.prototype,"tabIndex",void 0),u}export{s as a,f as b};
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
