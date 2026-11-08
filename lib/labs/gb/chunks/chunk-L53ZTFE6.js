import{a,b as l,c as d}from"./chunk-MSNV3O7X.js";import{d as m,e as i}from"./chunk-YRNKHAFN.js";var h=/^\s*(?!javascript:)(?:[\w+.-]+:|[^:/?#]*(?:[/?#]|$))/i;function S(t){let e=!h.test(t);return e}function E(t){if(!S(t))return t}function r(t){return E(t)}function s(t,e){let n=r(e);n!==void 0&&(t.href=n)}var x=globalThis.trustedTypes;var u=class extends d{constructor(e){if(super(e),e.type!==a.ATTRIBUTE&&e.type!==a.PROPERTY)throw new Error("safeHref can only be used on attribute or property bindings");if(e.name!=="href")throw new Error('safeHref() directive can only be used on "href" attribute or property bindings.')}render(e){return e||i}update(e,[n]){let f=e.element;return f.removeAttribute("href"),!n||n===i?i:(s(f,n),m)}},Fr=l(u);export{Fr as a};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/*! Bundled license information:

safevalues/dist/mjs/environment/dev.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/builders/url_builders.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/dom/elements/anchor.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/dom/elements/area.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/internals/trusted_types.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/internals/secrets.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/internals/resource_url_impl.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/dom/elements/base.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/dom/elements/button.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/internals/attribute_impl.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/internals/pure.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/internals/html_impl.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/dom/elements/embed.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/dom/elements/form.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/dom/elements/iframe.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/dom/elements/input.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/dom/elements/object.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/internals/script_impl.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/dom/globals/window.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/dom/elements/script.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/dom/elements/element.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/dom/elements/link.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/internals/style_sheet_impl.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/dom/elements/style.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/dom/elements/svg.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/dom/elements/svg_use.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/dom/globals/document.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/dom/globals/dom_parser.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/dom/globals/fetch.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/dom/globals/global.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/dom/globals/location.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/dom/globals/range.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/dom/globals/service_worker_container.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/dom/globals/url.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/dom/globals/worker.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

safevalues/dist/mjs/dom/index.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)
*/
