var n=new WeakMap,e=HTMLElement.prototype.attachInternals;HTMLElement.prototype.attachInternals=function(){let t=e.call(this);return n.set(this,t),t};function a(t){return n.get(t)}export{a};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
