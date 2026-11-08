import{h as e}from"./chunk-MZFGRIKD.js";var l={standard:"standard",vibrant:"vibrant"},t={horizontal:"horizontal",vertical:"vertical"},o={toolbar:"toolbar",toolbarStandard:"toolbar-standard",toolbarVibrant:"toolbar-vibrant",toolbarHorizontal:"toolbar-horizontal",toolbarVertical:"toolbar-vertical",toolbarDocked:"toolbar-docked"};function s({color:a=l.standard,orientation:i=t.horizontal,docked:b=!1}={}){let n=!!b,r=n?t.horizontal:i;return{[o.toolbar]:!0,[o.toolbarStandard]:a===l.standard||!a,[o.toolbarVibrant]:a===l.vibrant,[o.toolbarHorizontal]:r===t.horizontal||!r,[o.toolbarVertical]:r===t.vertical,[o.toolbarDocked]:n}}var c=e({getClasses:s});export{l as a,t as b,o as c,s as d,c as e};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
