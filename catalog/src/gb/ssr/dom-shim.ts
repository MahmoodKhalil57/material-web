/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Build-time rendering (ssr-gb.ts): the DOM the labs/gb components touch
// while they're constructed or their modules load, beyond what Lit's DOM
// shim gives, as no-ops. On the server listeners never fire, queries find
// nothing, and nothing is connected; the browser hydrates the result.

import {HTMLElement} from '@lit-labs/ssr-dom-shim';

const noop = () => {};
const proto = HTMLElement.prototype as unknown as Record<string, unknown>;
for (const name of ['addEventListener', 'removeEventListener', 'toggleAttribute', 'focus', 'blur']) {
  if (!(name in proto)) proto[name] = noop;
}
if (!('dispatchEvent' in proto)) proto['dispatchEvent'] = () => true;
for (const name of ['querySelector', 'closest']) {
  if (!(name in proto)) proto[name] = () => null;
}
for (const name of ['querySelectorAll', 'getElementsByTagName']) {
  if (!(name in proto)) proto[name] = () => [];
}
if (!('matches' in proto)) proto['matches'] = () => false;
if (!('isConnected' in proto)) {
  Object.defineProperty(proto, 'isConnected', {get: () => false});
}
// ARIA reflection (ariaLabel and the rest read the host's aria-* attributes),
// which the browser has and Lit's shim doesn't: components that render from
// it (a tooltip from `ariaLabel`) render the same template on both sides,
// so hydration matches.
for (const name of [
  'ariaLabel', 'ariaHasPopup', 'ariaExpanded', 'ariaPressed', 'ariaCurrent',
  'ariaDisabled', 'ariaSelected', 'ariaChecked', 'ariaDescription',
  'ariaHidden', 'ariaInvalid', 'ariaRequired', 'ariaValueText', 'role',
]) {
  if (name in proto) continue;
  const attribute = name === 'role' ? 'role' : `aria-${name.slice(4).toLowerCase()}`;
  Object.defineProperty(proto, name, {
    configurable: true,
    get(this: {getAttribute(n: string): string | null}) {
      return this.getAttribute(attribute);
    },
    set(this: {setAttribute(n: string, v: string): void; removeAttribute(n: string): void}, value: string | null) {
      if (value === null) this.removeAttribute(attribute);
      else this.setAttribute(attribute, value);
    },
  });
}

const global = globalThis as unknown as Record<string, unknown>;
const doc = (global['document'] ??= {}) as Record<string, unknown>;
for (const [name, value] of Object.entries({
  addEventListener: noop,
  removeEventListener: noop,
  querySelector: () => null,
  querySelectorAll: () => [],
  getElementById: () => null,
  documentElement: {dir: '', lang: 'en', getAttribute: () => null},
  // lit-html's server build only stubs this when there's no document at all.
  createTreeWalker: () => ({}),
})) {
  if (!(name in doc)) doc[name] = value;
}
global['addEventListener'] ??= noop;
global['removeEventListener'] ??= noop;
global['matchMedia'] ??= () => ({
  matches: false,
  addEventListener: noop,
  removeEventListener: noop,
});
