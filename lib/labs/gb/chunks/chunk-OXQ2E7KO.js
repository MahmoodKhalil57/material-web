import{c as o}from"./chunk-DWUR375C.js";var r=!1;function n(){let e=document.body;if(!e)return;let t=e.hasAttribute("tabindex");t||(e.tabIndex=-1),e.focus({preventScroll:!0}),t||e.removeAttribute("tabindex")}function i(){let e=o();!e||e===document.body||(e.blur?.(),n())}function u(){r||typeof document>"u"||(r=!0,document.addEventListener("keydown",e=>{if(e.key!=="Escape"||e.defaultPrevented||e.isComposing||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey)return;let t=o();!t||t===document.body||setTimeout(()=>{o()===t&&i()})}))}u();export{n as a,i as b,u as c};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
