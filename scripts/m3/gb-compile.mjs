/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Shared helpers for compiling spec token sets into `labs/gb` custom
 * property declarations and for reading the gb `_*-tokens.scss` files.
 */

import {literalCss, opacityPercent, sysVar, tokenCss} from './gb-css.mjs';

export const STATES = ['hovered', 'focused', 'pressed', 'disabled', 'selected', 'unselected', 'dragged'];

/**
 * Alternative spellings of a spec value, e.g. `var(--md-sys-space-200)` ->
 * `16px`, so a hand-written literal still counts as matching the spec.
 */
export const LITERALS = new Map();

/** Whether a hand-written value matches a spec value. */
export function sameValue(have, want) {
  const h = norm(have);
  return h === norm(want) || h === LITERALS.get(want);
}

/** CSS for one token, folding a sibling `.opacity` token into a color. */
export function declValue(db, tokenName, ctx, opacityToken) {
  const r = db.resolve(tokenName, ctx);
  if (!r) return undefined;
  const type = db.type(tokenName);
  if (type === 'TYPOGRAPHY' || (r.ref && db.type(r.ref) === 'TYPOGRAPHY')) {
    return r.ref ? sysVar(r.ref) : undefined;
  }
  let value = tokenCss(db, tokenName, ctx);
  if (value === undefined) return undefined;
  if (opacityToken) {
    const pct = opacityPercent(db, opacityToken, ctx);
    if (pct && pct !== '100%') value = `hsl(from ${value} h s l / ${pct})`;
  }
  const literal = literalCss(r.resolved);
  if (literal && literal !== value) LITERALS.set(value, literal);
  return value;
}

/** Turns one binding mixin into `{customProperty: cssValue}`. */
export function compileMixin(db, {set, state, pick = {}, only}, ctx) {
  const prefix = state ? `${state}.` : '';
  const suffixes = new Map();
  for (const tokenName of db.tokensInSet(set)) {
    const suffix = tokenName.slice(set.length + 1);
    if (prefix && !suffix.startsWith(prefix)) continue;
    const rest = suffix.slice(prefix.length);
    if (STATES.some((s) => rest.startsWith(`${s}.`))) continue;
    suffixes.set(rest, tokenName);
  }

  const out = {};
  for (const [rest, tokenName] of suffixes) {
    if (only && !(rest in pick)) continue;
    const prop = rest in pick ? pick[rest] : rest.replace(/\./g, '-');
    if (!prop) continue;
    // `x.opacity` is folded into `x.color`.
    if (rest.endsWith('.opacity') && suffixes.has(rest.replace(/opacity$/, 'color'))) continue;
    const opacityToken = rest.endsWith('.color')
      ? suffixes.get(rest.replace(/color$/, 'opacity'))
      : undefined;
    const value = declValue(db, tokenName, ctx, opacityToken);
    if (value === undefined) continue;
    const typography = value.startsWith('var(--md-sys-typescale-');
    out[prop] = value;
    if (typography) {
      out[`${prop}-axes`] = value.replace(/\)$/, '-axes)');
      out[`${prop}-tracking`] = value.replace(/\)$/, '-tracking)');
    }
  }
  return out;
}

/**
 * Parses `@mixin name { --prop: value; }` blocks from a token file.
 * @return {Map<string, Record<string, string>>}
 */
export function parseMixins(source) {
  const mixins = new Map();
  for (const m of source.replace(/\r\n/g, '\n').matchAll(/@mixin\s+([\w-]+)\s*\{([^}]*)\}/g)) {
    const decls = {};
    const body = m[2].replace(/\/\/[^\n]*/g, '');
    for (const d of body.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
      decls[d[1]] = d[2].replace(/\s+/g, ' ').trim();
    }
    mixins.set(m[1], decls);
  }
  return mixins;
}

export function norm(v) {
  return v.replace(/\s+/g, ' ').trim();
}
