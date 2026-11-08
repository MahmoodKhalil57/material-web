import{a}from"./chunk-DWUR375C.js";import{h as p}from"./chunk-MZFGRIKD.js";var l={plain:"plain",rich:"rich"},b=1500,O=0,T=500,o={tooltip:"tooltip",rich:"tooltip-rich",caret:"tooltip-has-caret",subhead:"tooltip-has-subhead",actions:"tooltip-has-actions",above:"tooltip-above",below:"tooltip-below",left:"tooltip-left",right:"tooltip-right"};function n({variant:t=l.plain,side:e="above",caret:r=!1,hasSubhead:s=!1,hasActions:c=!1}={}){let i=t===l.rich;return{[o.tooltip]:!0,[o.rich]:i,[o.caret]:r,[o.subhead]:i&&s,[o.actions]:i&&c,[o.above]:e==="above",[o.below]:e==="below",[o.left]:e==="left",[o.right]:e==="right"}}function h(t,e){t.hasAttribute("role")||t.setAttribute("role","tooltip"),t.addEventListener("keydown",r=>{r.key!=="Escape"||!t.matches(":popover-open")||(r.preventDefault(),t.hidePopover())},e)}var _=p({getClasses:n,setupElement:h});function v({tooltip:t,...e}){return a({...e,surface:t})}export{l as a,b,O as c,T as d,o as e,n as f,h as g,_ as h,v as i};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
