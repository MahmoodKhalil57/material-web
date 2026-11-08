function s(t,n){let c=()=>{let e=n.filter(h=>h.checked).length;t.checked=n.length>0&&e===n.length,t.indeterminate=e>0&&e<n.length},o=()=>{for(let e of n)e.disabled||(e.checked=t.checked);c()};t.addEventListener("change",o);for(let e of n)e.addEventListener("change",c);return c(),()=>{t.removeEventListener("change",o);for(let e of n)e.removeEventListener("change",c)}}export{s as linkParentCheckbox};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
