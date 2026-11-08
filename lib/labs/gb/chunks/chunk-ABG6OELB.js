import{c,d as b}from"./chunk-PV5BZ7Q3.js";import{a as i}from"./chunk-JUNG2MTN.js";import{b as o}from"./chunk-OHIE4ONL.js";import{h as r}from"./chunk-MZFGRIKD.js";var n={tabs:"tabs",tabsSecondary:"tabs-secondary",...c("tabs")};function p({variant:e="primary",density:s=0}={}){return{[n.tabs]:!0,[n.tabsSecondary]:e==="secondary",...b(n.tabs,s)}}function u(e,s){e.addEventListener("focusin",l=>{let a=l.target;!(a instanceof Element)||a===e||a.scrollIntoView({block:"nearest",inline:"nearest"})},s)}var g=r({getClasses:p,setupElement:u}),t={tab:"tab",tabLabel:"tab-label",tabBadge:"tab-badge",selected:"selected",focusRingInner:o.focusRingInner,ripple:i.ripple};function S({selected:e=!1}={}){return{[t.tab]:!0,[t.focusRingInner]:!0,[t.ripple]:!0,[t.selected]:e}}var x=r({getClasses:S});export{n as a,p as b,u as c,g as d,t as e,S as f,x as g};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
