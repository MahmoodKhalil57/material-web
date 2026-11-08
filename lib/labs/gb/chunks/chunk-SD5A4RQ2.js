import{b as p}from"./chunk-DIPY6KYJ.js";import{h as d}from"./chunk-MZFGRIKD.js";var a={expanded:"expanded",partiallyExpanded:"partially-expanded"},e={bottomSheet:"bottom-sheet",modal:"bottom-sheet-modal",open:"bottom-sheet-open",closing:"bottom-sheet-closing",expanded:"bottom-sheet-expanded",partiallyExpanded:"bottom-sheet-partially-expanded",dragging:"bottom-sheet-dragging",panel:"bottom-sheet-panel",dragArea:"bottom-sheet-drag-area",dragHandle:"bottom-sheet-drag-handle",content:"bottom-sheet-content"};function m({modal:t=!1,open:o=!1,closing:s=!1,state:n=a.partiallyExpanded,dragging:l=!1,root:r=!0}={}){return{[e.bottomSheet]:r,[e.modal]:t,[e.open]:o,[e.closing]:s,[e.expanded]:n===a.expanded,[e.partiallyExpanded]:n===a.partiallyExpanded,[e.dragging]:l}}function i(t,o){p(t,()=>t.classList.contains(e.modal),o)}var h=d({getClasses:m,setupElement:i});export{a,e as b,m as c,i as d,h as e};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
