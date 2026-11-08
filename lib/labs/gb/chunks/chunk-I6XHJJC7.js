import{h as c}from"./chunk-MZFGRIKD.js";var r={ACTION:"action",DISMISS:"dismiss",TIMEOUT:"timeout"},n={snackbar:"snackbar",open:"snackbar-open",opening:"snackbar-opening",closing:"snackbar-closing",fixed:"snackbar-fixed"};function i({open:e=!1,opening:t=!1,closing:a=!1,fixed:s=!1}={}){return{[n.snackbar]:!0,[n.open]:e,[n.opening]:t,[n.closing]:a,[n.fixed]:s}}function l(e,t){let a=s=>{if(s.key==="Escape"){let o=e;if(o.open===!1)return;s.preventDefault(),typeof o.close=="function"?o.close(r.DISMISS):e.dispatchEvent(new CustomEvent("close",{bubbles:!0,cancelable:!0,detail:{reason:r.DISMISS}}))}};e.addEventListener("keydown",a,t)}var f=c({getClasses:i,setupElement:l});export{r as a,n as b,i as c,l as d,f as e};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
