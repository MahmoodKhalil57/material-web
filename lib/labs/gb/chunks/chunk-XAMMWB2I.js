import{g as i}from"./chunk-YRNKHAFN.js";function n(){let o=Element.prototype.animate;function t(...e){let r=o.apply(this,e);return r.effect&&r.effect.updateTiming({delay:0,duration:1,easing:"step-start",iterations:1}),r}return Object.defineProperty(Element.prototype,"animate",{configurable:!0,enumerable:!0,writable:!0,value:t}),()=>{Object.defineProperty(Element.prototype,"animate",{configurable:!0,enumerable:!0,writable:!0,value:o})}}var a=class{constructor(){this.roots=[],window.requestAnimationFrame=t=>setTimeout(t,1),window.cancelAnimationFrame=t=>{clearTimeout(t)},beforeAll(()=>{jasmine.clock().install()}),afterEach(()=>{this.getCurrentRoot()?.remove()}),afterAll(()=>{jasmine.clock().uninstall();for(let t of this.roots)document.body.appendChild(t)})}withoutWebAnimations(){return n(),this}async waitForStability(){jasmine.clock().tick(1);let t=this.getCurrentRoot();t&&await this.waitForLitRender(t)}async waitForLitRender(t){for(let e of t.querySelectorAll("*"))this.isReactiveElement(e)&&(await e.updateComplete,await this.waitForLitRender(e.renderRoot))}isReactiveElement(t){return!!t.updateComplete}render(t){let e=this.createNewRoot();return i(t,e),e}createNewRoot(){let t=this.getCurrentRoot();t&&t.remove();let e=document.createElement("div");return e.id="root",e.style.display="inline-flex",document.body.appendChild(e),this.roots.push(e),e}getCurrentRoot(){return this.roots[this.roots.length-1]}};export{a};
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
