var h=Symbol("dispatchHooks");function u(e,r){let o=e[h];if(!o)throw new Error(`'${e.type}' event needs setupDispatchHooks().`);o.addEventListener("after",r,{once:!0})}var l=new WeakMap;function E(e,...r){let o=l.get(e);o||(o=new Set,l.set(e,o));for(let s of r)o.has(s)||(e.addEventListener(s,t=>{let p=new EventTarget;t[h]=p;let c=new AbortController,i=()=>{c.abort(),p.dispatchEvent(new Event("after"))},d=f=>function(){f.call(this),i()};t.stopPropagation=d(t.stopPropagation),t.stopImmediatePropagation=d(t.stopImmediatePropagation);let a=t.composedPath(),n;t.composed&&t.bubbles?n=a[a.length-1]:t.bubbles?n=a[0].getRootNode():n=a[0],n.addEventListener(s,()=>{i()},{once:!0,signal:c.signal})},{capture:!0}),o.add(s))}export{u as a,E as b};
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
