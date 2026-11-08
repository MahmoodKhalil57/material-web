var r=-3;function i(t){return Number.isFinite(t)?Math.max(-3,Math.min(0,Math.round(t))):0}function d(t){return{density1:`${t}-density-1`,density2:`${t}-density-2`,density3:`${t}-density-3`}}function o(t,s=0){let n=i(s),e=d(t);return{[e.density1]:n===-1,[e.density2]:n===-2,[e.density3]:n===-3}}export{r as a,i as b,d as c,o as d};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
