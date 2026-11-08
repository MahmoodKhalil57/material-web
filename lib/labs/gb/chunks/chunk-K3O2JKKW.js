import{c as l,d as h}from"./chunk-PV5BZ7Q3.js";import{a as n,b as p}from"./chunk-UUQJVX7P.js";import{b as f,c as m}from"./chunk-Q4E4VNSB.js";import{c as d}from"./chunk-5MKFU3OX.js";import{a as u,b as r}from"./chunk-WYBTMT3K.js";import{h as c}from"./chunk-MZFGRIKD.js";var s={switch:"switch",checked:r.checked,hover:r.hover,active:r.active,disabled:r.disabled,...l("switch")};function C({checked:e=!1,hover:a=!1,active:i=!1,disabled:t=!1,density:o=0}={}){return{...f(),...d(),[s.switch]:!0,[s.checked]:e,[s.hover]:a,[s.active]:i,[s.disabled]:t,...h(s.switch,o)}}function b(e,a){let i=e.matches("button");i&&p(e,"click"),m(e,a),i&&e.addEventListener("click",t=>{if(u(e)){t.stopImmediatePropagation(),t.preventDefault();return}let o=e.ariaChecked==="true";e.ariaChecked=String(!o),n(t,()=>{if(t.defaultPrevented){e.ariaChecked=String(o);return}e.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0})),e.dispatchEvent(new Event("change",{bubbles:!0}))})},{...a,capture:!0})}var I=c({getClasses:C,setupElement:b});export{s as a,C as b,b as c,I as d};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
