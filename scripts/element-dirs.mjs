/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Where the md-gb-* element folders are. components/ is the M3
 * components index and extras/ the library's own components; both hold one
 * folder per component (`components/button`, `extras/scaffold`), at the same
 * depth, and folder names are unique across them. Scripts that walk the
 * components use these helpers instead of reading components/ alone.
 */

import {existsSync, readdirSync, readFileSync} from 'node:fs';
import {join} from 'node:path';

/** The library folder, relative to the repo root. */
export const LIB = 'material-design-expressive';

/** The element roots, relative to LIB (from element-roots.json). */
export const ELEMENT_ROOTS = JSON.parse(
  readFileSync(new URL('./element-roots.json', import.meta.url), 'utf8'),
).roots;

/** Folders under a root that are not components. */
const NOT_COMPONENTS = new Set(['shared']);

/**
 * Every component folder, sorted by name: `{name, root, dir}` where `dir` is
 * repo-relative (`material-design-expressive/extras/scaffold`).
 * @param {string} [repoRoot] - Prefix for `dir` (default: repo-relative).
 */
export function elementDirs(repoRoot = '') {
  const out = [];
  for (const root of ELEMENT_ROOTS) {
    const base = join(repoRoot, LIB, root);
    if (!existsSync(base)) continue;
    for (const d of readdirSync(base, {withFileTypes: true})) {
      if (d.isDirectory() && !NOT_COMPONENTS.has(d.name)) {
        out.push({name: d.name, root, dir: join(base, d.name)});
      }
    }
  }
  const seen = new Set();
  for (const {name} of out) {
    if (seen.has(name)) throw new Error(`Component folder ${name} is in two element roots.`);
    seen.add(name);
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

/** The names of every component folder, sorted. */
export function elementNames(repoRoot = '') {
  return elementDirs(repoRoot).map((e) => e.name);
}

/**
 * The folder of a component by name (`scaffold` ->
 * `material-design-expressive/extras/scaffold`), or the components/ path
 * for a name that doesn't exist yet (a generator's new output).
 */
export function elementDir(name, repoRoot = '') {
  return elementDirs(repoRoot).find((e) => e.name === name)?.dir ?? join(repoRoot, LIB, 'components', name);
}
