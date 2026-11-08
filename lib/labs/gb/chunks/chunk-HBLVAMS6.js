var c=new WeakMap,i=new WeakMap,l=HTMLElement.prototype.attachInternals;HTMLElement.prototype.attachInternals=function(){let t=l.call(this);return c.set(t,this),t};for(let t of Object.getOwnPropertyNames(ElementInternals.prototype)){let a=t==="role";if(!a&&!(t.startsWith("aria")&&!t.endsWith("Elements")))continue;let e=a?"role":`aria-${t.slice(4).toLowerCase()}`,s=Object.getOwnPropertyDescriptor(ElementInternals.prototype,t);s.set&&Object.defineProperty(ElementInternals.prototype,t,{...s,set(o){s.set.call(this,o);let n=c.get(this);if(!n)return;let r=i.get(n);r||i.set(n,r=new Set),!(n.hasAttribute(e)&&!r.has(e))&&(o==null?(r.delete(e),n.removeAttribute(e)):(r.add(e),n.setAttribute(e,String(o))))}})}
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
