var l="md-gb",u="Material",c="md-gb-perf",f;function i(){try{if(globalThis.MD_GB_DEBUG_PERF||typeof location<"u"&&new URLSearchParams(location.search).has(c))return!0;if(typeof localStorage<"u")return localStorage.getItem(c)!==null}catch{}return!1}function p(){return f??=i()}function d(e){f=e}function s(){return p()?performance.now():-1}function a(e,t,r){if(!(t<0))try{performance.measure(e,{start:t,end:performance.now(),detail:{...r,devtools:{dataType:"track-entry",track:l,trackGroup:u,color:"primary"}}})}catch{}}function h(e,t){let r=s();if(r<0)return t();let n;try{n=t()}catch(o){throw a(e,r),o}if(n instanceof Promise){let o=()=>a(e,r);n.then(o,o)}else a(e,r);return n}export{l as a,u as b,c,p as d,d as e,s as f,a as g,h};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
