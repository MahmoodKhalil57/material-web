import{a as i}from"./chunk-XRXVYG7D.js";import{i as p}from"./chunk-MZFGRIKD.js";var l={playing:"fx-playing"};function f({playing:n=!1}={}){return{[l.playing]:n}}var o=class n extends Event{constructor(s){super(n.type,{bubbles:!0,composed:!1,...s}),this.playing=s?.playing??!1}};o.type="fx-change";function x(n,s){let a=n.classList.contains(l.playing),e=s.playing??!1;i(n,f({playing:e})),e!==a&&n.dispatchEvent(new o({playing:e}))}function y(n,s){if(!(n instanceof HTMLSlotElement))throw new Error("fxSlot() must be used on a <slot> element.");let a=n,e=new Set,r=()=>{for(let t of e)(!(t instanceof Element)||!t.isConnected||!t.classList.contains(l.playing))&&e.delete(t);i(a,f({playing:e.size>0}))},c=()=>{e.clear();for(let t of a.assignedElements({flatten:!0})){t.matches(`.${l.playing}`)&&e.add(t);for(let g of t.querySelectorAll(`.${l.playing}`))e.add(g)}r()};c(),a.addEventListener("slotchange",c,s),a.addEventListener(o.type,t=>{t.target&&(t.playing?e.add(t.target):e.delete(t.target),r())},s)}var m=p(y);export{l as a,f as b,o as c,x as d,y as e,m as f};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
