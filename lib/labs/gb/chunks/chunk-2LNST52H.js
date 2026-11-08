import{a as e}from"./chunk-THNPU74B.js";var h=Symbol("hasState"),l=Symbol("toggleState"),s=Symbol("privateUseDashedIdentifier"),r=Symbol("privateGetStateIdentifier");function u(n){var a;class o extends n{constructor(){super(...arguments),this[a]=null}[h](t){return t=this[r](t),this[e].states.has(t)}[l](t,i){t=this[r](t),i?this[e].states.add(t):this[e].states.delete(t)}[(a=s,r)](t){if(this[s]===null)try{let i="_test";this[e].states.add(i),this[e].states.delete(i),this[s]=!1}catch{this[s]=!0}return this[s]?`--${t}`:t}}return o}export{h as a,l as b,u as c};
/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
