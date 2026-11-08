import{d as r}from"./chunk-ZEJ74G6U.js";import{h as t}from"./chunk-MZFGRIKD.js";var o={dialog:"dialog",fullScreen:"dialog-full-screen",closing:"dialog-closing",hasIcon:"dialog-has-icon",hasHeadline:"dialog-has-headline",hasActions:"dialog-has-actions",scrollable:"dialog-scrollable",scrolledFromTop:"dialog-scrolled-from-top",scrolledFromBottom:"dialog-scrolled-from-bottom"};function f({fullScreen:e=!1,closing:s=!1,hasIcon:l=!1,hasHeadline:i=!1,hasActions:c=!1,scrollable:a=!1,scrolledFromTop:n=!1,scrolledFromBottom:d=!1}={}){return{[o.dialog]:!0,[o.fullScreen]:e,[o.closing]:s,[o.hasIcon]:l,[o.hasHeadline]:i,[o.hasActions]:c,[o.scrollable]:a,[o.scrolledFromTop]:a&&n,[o.scrolledFromBottom]:a&&d}}var g="data-no-focus-trap";function p(e,s){e.addEventListener("keydown",l=>{l.key==="Tab"&&!l.defaultPrevented&&!e.hasAttribute(g)&&r(l,e)},s)}var T=t({getClasses:f,setupElement:p});export{o as a,f as b,g as c,p as d,T as e};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
