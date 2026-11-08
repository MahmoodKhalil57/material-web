import {
  A,
  T,
  e,
  i,
  t
} from "./chunk-JVQ4V6KC.js";

// ../node_modules/safevalues/dist/mjs/builders/url_builders.js
var IS_NOT_JAVASCRIPT_URL_PATTERN = /^\s*(?!javascript:)(?:[\w+.-]+:|[^:/?#]*(?:[/?#]|$))/i;
function reportJavaScriptUrl(url) {
  const hasJavascriptUrlScheme = !IS_NOT_JAVASCRIPT_URL_PATTERN.test(url);
  if (hasJavascriptUrlScheme) {
    if (true) {
      console.error(`A URL with content '${url}' was sanitized away.`);
    }
  }
  return hasJavascriptUrlScheme;
}
function sanitizeJavaScriptUrl(url) {
  if (reportJavaScriptUrl(url)) {
    return void 0;
  }
  return url;
}
function unwrapUrlOrSanitize(url) {
  return sanitizeJavaScriptUrl(url);
}

// ../node_modules/safevalues/dist/mjs/dom/elements/anchor.js
function setAnchorHref(anchor, url) {
  const sanitizedUrl = unwrapUrlOrSanitize(url);
  if (sanitizedUrl !== void 0) {
    anchor.href = sanitizedUrl;
  }
}

// ../node_modules/safevalues/dist/mjs/internals/trusted_types.js
var trustedTypes = globalThis.trustedTypes;

// ../internal/directives/safe-href.js
var SafeHrefDirective = class extends i {
  constructor(partInfo) {
    super(partInfo);
    if (partInfo.type !== t.ATTRIBUTE && partInfo.type !== t.PROPERTY) {
      throw new Error("safeHref can only be used on attribute or property bindings");
    }
    if (partInfo.name !== "href") {
      throw new Error('safeHref() directive can only be used on "href" attribute or property bindings.');
    }
  }
  render(value) {
    return value || A;
  }
  update(part, [value]) {
    const element = part.element;
    element.removeAttribute("href");
    if (!value || value === A) {
      return A;
    }
    setAnchorHref(element, value);
    return T;
  }
};
var safeHref = e(SafeHrefDirective);

export {
  safeHref
};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/*! Bundled license information:

safevalues/dist/mjs/environment/dev.js:
safevalues/dist/mjs/builders/url_builders.js:
safevalues/dist/mjs/dom/elements/anchor.js:
safevalues/dist/mjs/dom/elements/area.js:
safevalues/dist/mjs/internals/trusted_types.js:
safevalues/dist/mjs/internals/secrets.js:
safevalues/dist/mjs/internals/resource_url_impl.js:
safevalues/dist/mjs/dom/elements/base.js:
safevalues/dist/mjs/dom/elements/button.js:
safevalues/dist/mjs/internals/attribute_impl.js:
safevalues/dist/mjs/internals/pure.js:
safevalues/dist/mjs/internals/html_impl.js:
safevalues/dist/mjs/dom/elements/embed.js:
safevalues/dist/mjs/dom/elements/form.js:
safevalues/dist/mjs/dom/elements/iframe.js:
safevalues/dist/mjs/dom/elements/input.js:
safevalues/dist/mjs/dom/elements/object.js:
safevalues/dist/mjs/internals/script_impl.js:
safevalues/dist/mjs/dom/globals/window.js:
safevalues/dist/mjs/dom/elements/script.js:
safevalues/dist/mjs/dom/elements/element.js:
safevalues/dist/mjs/dom/elements/link.js:
safevalues/dist/mjs/internals/style_sheet_impl.js:
safevalues/dist/mjs/dom/elements/style.js:
safevalues/dist/mjs/dom/elements/svg.js:
safevalues/dist/mjs/dom/elements/svg_use.js:
safevalues/dist/mjs/dom/globals/document.js:
safevalues/dist/mjs/dom/globals/dom_parser.js:
safevalues/dist/mjs/dom/globals/fetch.js:
safevalues/dist/mjs/dom/globals/global.js:
safevalues/dist/mjs/dom/globals/location.js:
safevalues/dist/mjs/dom/globals/range.js:
safevalues/dist/mjs/dom/globals/service_worker_container.js:
safevalues/dist/mjs/dom/globals/url.js:
safevalues/dist/mjs/dom/globals/worker.js:
safevalues/dist/mjs/dom/index.js:
  (**
   * @license
   * Copyright Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)
*/
//# sourceMappingURL=chunk-AAO4BAFU.js.map
