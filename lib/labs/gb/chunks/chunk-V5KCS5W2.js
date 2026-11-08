import{b as p,c as i}from"./chunk-E5JOGHFC.js";import{l as a,m as u}from"./chunk-ZPNHW3ZE.js";import{a as n}from"./chunk-2TXI42VJ.js";import{h as o}from"./chunk-MZFGRIKD.js";var l={select:"select",autocomplete:"autocomplete",open:"select-open",value:"select-value",arrow:"select-arrow",menu:"select-menu"};function m({open:t=!1,autocomplete:e=!1,...s}={}){return{...p({...s,hasTrailingIcon:!0}),[l.select]:!0,[l.autocomplete]:e,[l.open]:t}}function f(t,e){i(t,e)}var h=o({getClasses:m,setupElement:f});function d(t,e,s){if(s==="none"||!e)return!0;let r=t.trim().toLocaleLowerCase(),c=e.trim().toLocaleLowerCase();return s==="starts-with"?r.startsWith(c):r.includes(c)}function C({selected:t=!1,active:e=!1,...s}={}){return{...a({...s,checked:t,focus:e}),[n.focusVisible]:e}}var w=o({getClasses:C,setupElement:u});export{l as a,m as b,f as c,h as d,d as e,C as f,w as g};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
