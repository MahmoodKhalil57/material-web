import{f as p}from"./chunk-KPMUBDDJ.js";import{h as n}from"./chunk-MZFGRIKD.js";function d({navigation:a,windowClass:o,heightClass:t="medium",paneCount:i=1,hasBar:f=!1,hasRail:l=!1}){if(a==="none")return"none";let e;return a==="auto"?o==="compact"?e="bar":o==="medium"?e=i>=2&&t!=="compact"?"bar":"rail":e="rail":e=a,e==="bar"?f?"bar":l?"rail":"none":l?"rail":f?"bar":"none"}function m(a){return p(a,"large")}var r={appScaffold:"app-scaffold",navBar:"app-scaffold-nav-bar",navRail:"app-scaffold-nav-rail"};function s({navigation:a="none"}={}){return{[r.appScaffold]:!0,[r.navBar]:a==="bar",[r.navRail]:a==="rail"}}var S=n({getClasses:s});export{d as a,m as b,r as c,s as d,S as e};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
