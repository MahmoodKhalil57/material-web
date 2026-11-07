/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview axe-core reads ARIA from attributes only; it cannot see the
 * role and ARIA state a component sets through `ElementInternals`, which
 * browsers do expose to assistive technology. Importing this module first
 * (before any component is defined) makes every `internals.role = ...` or
 * `internals.ariaX = ...` also appear as the matching attribute on the host,
 * unless the host's author set that attribute (an attribute wins over
 * internals, as in the browser). Only the axe suites import it.
 */

const hosts = new WeakMap<ElementInternals, HTMLElement>();
const mirrored = new WeakMap<HTMLElement, Set<string>>();

const attach = HTMLElement.prototype.attachInternals;
HTMLElement.prototype.attachInternals = function (this: HTMLElement) {
  const internals = attach.call(this);
  hosts.set(internals, this);
  return internals;
};

for (const key of Object.getOwnPropertyNames(ElementInternals.prototype)) {
  const isRole = key === 'role';
  if (!isRole && !(key.startsWith('aria') && !key.endsWith('Elements'))) continue;
  const attr = isRole ? 'role' : `aria-${key.slice(4).toLowerCase()}`;
  const desc = Object.getOwnPropertyDescriptor(ElementInternals.prototype, key)!;
  if (!desc.set) continue;
  Object.defineProperty(ElementInternals.prototype, key, {
    ...desc,
    set(this: ElementInternals, value: string | null) {
      desc.set!.call(this, value);
      const host = hosts.get(this);
      if (!host) return;
      let own = mirrored.get(host);
      if (!own) mirrored.set(host, (own = new Set()));
      if (host.hasAttribute(attr) && !own.has(attr)) return;
      if (value == null) {
        own.delete(attr);
        host.removeAttribute(attr);
      } else {
        own.add(attr);
        host.setAttribute(attr, String(value));
      }
    },
  });
}
