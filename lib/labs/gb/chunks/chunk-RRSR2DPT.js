function n(t,e){if(!t)return;e=Array.isArray(e)?e:[e];let r=e.map(S=>S instanceof CSSStyleSheet?S:S.styleSheet);a(t,r)||(a(t.ownerDocument,r),a(t.getRootNode(),r))}function a(t,e){if(t&&"adoptedStyleSheets"in t){let r=e.filter(S=>!t.adoptedStyleSheets.includes(S));return r.length&&(t.adoptedStyleSheets=Array.from(new Set([...t.adoptedStyleSheets,...r]))),!0}return!1}export{n as a};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
