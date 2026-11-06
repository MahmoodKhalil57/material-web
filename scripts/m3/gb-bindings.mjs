/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Infers which M3 spec token each `labs/gb` component token declaration
 * implements, without hand-written bindings. Shared by the audit
 * (audit-gb.mjs) and the spec test generator (gen-spec-tests.mjs).
 *
 * For each `--prop: value` in each `@mixin` of a component's
 * `_*-tokens.scss`, the matching token is inferred from the component's token
 * sets and the words of the mixin name (variant / size / state / part), with
 * Jetpack Compose token usage as a tie-breaker.
 */

import {readdir, readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {declValue, norm, parseMixins, sameValue, STATES} from './gb-compile.mjs';
import {SpecDb, WEB_CONTEXT} from './spec-db.mjs';

export const GB = 'labs/gb/components';

/**
 * Spec token-set prefixes per gb component. This (one line per component) is
 * the only component knowledge; everything else is inferred.
 */
export const COMPONENT_SETS = {
  appbar: ['md.comp.app-bar'],
  badge: ['md.comp.badge'],
  button: ['md.comp.button'],
  buttongroup: ['md.comp.button-group'],
  card: ['md.comp.filled-card', 'md.comp.outlined-card', 'md.comp.elevated-card'],
  checkbox: ['md.comp.checkbox'],
  chip: ['md.comp.assist-chip', 'md.comp.filter-chip', 'md.comp.input-chip', 'md.comp.suggestion-chip'],
  divider: ['md.comp.divider'],
  fab: ['md.comp.fab'],
  iconbutton: ['md.comp.icon-button'],
  list: ['md.comp.list'],
  loadingindicator: ['md.comp.loading-indicator'],
  menu: ['md.comp.menus'],
  navbar: ['md.comp.nav-bar'],
  navrail: ['md.comp.nav-rail'],
  radio: ['md.comp.radio-button'],
  slider: ['md.comp.slider'],
  snackbar: ['md.comp.snackbar'],
  splitbutton: ['md.comp.split-button'],
  switch: ['md.comp.switch'],
  tabs: ['md.comp.primary-navigation-tab', 'md.comp.secondary-navigation-tab'],
  toolbar: ['md.comp.toolbar'],
};

const SIZE = {xsmall: 'xs', small: 'sm', medium: 'md', large: 'lg', xlarge: 'xl'};
const SYNONYM = {hover: 'hovered', focus: 'focused', press: 'pressed', drag: 'dragged'};

/** Words used for the same thing in gb and in the spec. */
const PROP_ALIASES = {
  'shape': ['container-shape'],
  'padding-leading': ['leading-space'],
  'padding-trailing': ['trailing-space'],
  'gap': ['icon-label-space', 'between-space'],
  'height': ['container-height'],
  'width': ['container-width'],
};

/**
 * Loads the spec DB and (optional) Compose usage, and returns an analyzer.
 */
export async function loadBindings(specsDir = '.m3-specs') {
  const db = await SpecDb.load(specsDir);
  const usage = new Map();
  try {
    const json = JSON.parse(await readFile(join(specsDir, 'compose-usage.json'), 'utf8'));
    for (const [token, sites] of Object.entries(json.tokens)) usage.set(token, sites);
  } catch {
    console.warn('No compose-usage.json; run scripts/m3/compose-usage.mjs for better matching.');
  }
  return {db, usage, analyze: (dir) => analyze(db, usage, dir)};
}

/**
 * Analyzes one gb component.
 *
 * @return {Promise<undefined | {
 *   dir: string, path: string, source: string,
 *   records: Array<{mixin, prop, have, status, token?, want?, confident?}>,
 *   tokens: string[], bound: Set<string>, unwired: string[]}>}
 *   `status` is one of match | drift | derived | unbound.
 */
async function analyze(db, usage, dir) {
  const prefixes = COMPONENT_SETS[dir];
  if (!prefixes) return undefined;
  const files = await readdir(join(GB, dir));
  const tokenFile = files.find((f) => /^_.*-tokens\.scss$/.test(f));
  if (!tokenFile) return undefined;
  const path = join(GB, dir, tokenFile);
  const source = await readFile(path, 'utf8');
  const mixins = parseMixins(source);
  const sets = candidateTokens(db, prefixes);
  const records = [];
  const bound = new Set();

  for (const [mixin, decls] of mixins) {
    const words = mixin === 'root' ? [] : mixin.split('-').map((w) => SYNONYM[w] ?? w);
    for (const [prop, have] of Object.entries(decls)) {
      if (prop.startsWith('md-')) continue; // e.g. --md-icon-fill: not a spec token
      // Values derived from another component property are not spec values.
      if (/var\(\s*--(?!md-)/.test(have)) {
        records.push({mixin, prop, have, status: 'derived'});
        continue;
      }
      const hit = findToken(sets, words, prop, usage);
      if (!hit) {
        records.push({mixin, prop, have, status: 'unbound'});
        continue;
      }
      bound.add(hit.token);
      const want = specValue(db, hit.token, prop);
      const same = want === undefined || sameValue(have, want) || equivalent(have, want);
      records.push({
        mixin,
        prop,
        have,
        status: same ? 'match' : 'drift',
        token: hit.token,
        want,
        confident: hit.confident,
      });
    }
  }

  // Mixins defined in the token file but never included by the component.
  const styles = await Promise.all(
    files
      .filter((f) => f.endsWith('.scss') && f !== tokenFile)
      .map((f) => readFile(join(GB, dir, f), 'utf8')),
  );
  const used = styles.join('\n');
  const unwired = [...mixins.keys()].filter(
    (m) => !new RegExp(`@include\\s+[\\w-]+\\.${m}\\s*[;(]`).test(used),
  );

  return {dir, path, source, records, tokens: [...new Set(sets.map((s) => s.token))], bound, unwired};
}

/**
 * Every token under the component prefixes, as normalized path words
 * relative to the prefix (sizes abbreviated, legacy state names updated).
 */
function candidateTokens(db, prefixes) {
  const tokens = [];
  for (const set of db.sets.keys()) {
    for (const prefix of prefixes) {
      if (set !== prefix && !set.startsWith(`${prefix}.`)) continue;
      // `md.comp.filled-card` contributes `filled` when several prefixes
      // make up one component.
      const variant =
        prefixes.length > 1 ? prefix.replace(/^md\.comp\./, '').split('-').slice(0, -1) : [];
      for (const token of db.tokensInSet(set)) {
        const raw = token.slice(prefix.length + 1).split(/[.-]/);
        const words = raw.map((w, i) => {
          if (SIZE[w]) return SIZE[w];
          if (w === 'focus' && raw[i + 1] === 'indicator') return w;
          return SYNONYM[w] ?? w;
        });
        tokens.push({token, set, prefix, words: [...variant, ...words]});
      }
    }
  }
  // A base-set token (e.g. md.comp.button.icon.color, the filled defaults)
  // whose suffix a variant set also defines is variant-specific: binding it
  // to a variant-neutral mixin is a guess.
  const variantSuffixes = new Set(
    tokens.filter((t) => t.set !== t.prefix).map((t) => t.token.slice(t.set.length + 1)),
  );
  for (const t of tokens) {
    t.shadowed = t.set === t.prefix && variantSuffixes.has(t.token.slice(t.set.length + 1));
  }
  return tokens;
}

/**
 * Finds the spec token for `--prop` in a mixin named by `words`.
 *
 * The property's words must line up with the end of the token path; the
 * remaining path words are "context". Every mixin word must appear in the
 * context, and any state in the context must be named by the mixin. Among
 * matches, the one with the fewest unexplained context words wins.
 */
function findToken(tokens, words, prop, usage) {
  let best;
  for (const spelling of [prop, ...(PROP_ALIASES[prop] ?? [])]) {
    const propWords = spelling.split('-');
    for (const {token, words: path, shadowed} of tokens) {
      const context = align(path, propWords);
      if (!context) continue;
      if (!words.every((w) => context.includes(w))) continue;
      if (context.some((w) => STATES.includes(w) && !words.includes(w))) continue;
      const extra = context.filter((w) => !words.includes(w) && w !== 'enabled').length;
      // Prefer tokens the reference implementation actually uses.
      const used = usage.has(token) ? 1 : 0;
      const better =
        !best ||
        extra < best.extra ||
        (extra === best.extra && used > best.used) ||
        (extra === best.extra && used === best.used && path.length < best.length);
      // High confidence: no unexplained words, the property is the literal
      // end of the token name, the mixin is not the neutral `root`, and the
      // token is not a variant-specific default.
      const contiguous = path.slice(-propWords.length).join('-') === propWords.join('-');
      const confident = extra === 0 && contiguous && words.length > 0 && !shadowed;
      if (better) best = {token, extra, used, length: path.length, confident};
    }
  }
  return best;
}

/**
 * Matches `propWords` as a subsequence of `path` anchored at the last word
 * and returns the unmatched path words, or undefined.
 */
function align(path, propWords) {
  if (path[path.length - 1] !== propWords[propWords.length - 1]) return undefined;
  const context = [];
  let j = propWords.length - 1;
  for (let i = path.length - 1; i >= 0; i--) {
    if (j >= 0 && path[i] === propWords[j]) j--;
    else context.unshift(path[i]);
  }
  return j < 0 ? context : undefined;
}

/** The spec's CSS value for a gb property bound to `token`. */
export function specValue(db, token, prop) {
  const value = declValue(db, token, WEB_CONTEXT, opacityFor(db, token));
  const suffix = prop.match(/-(axes|tracking)$/)?.[0];
  if (suffix && value?.startsWith('var(--md-sys-typescale-') && !value.endsWith(`${suffix})`)) {
    return value.replace(/\)$/, `${suffix})`);
  }
  return value;
}

/**
 * The opacity token that applies to a color token: `x.color` -> `x.opacity`,
 * or a shared one with a qualifier dropped (`disabled.selected.track.color`
 * -> `disabled.track.opacity`). State-layer colors are excluded: gb applies
 * state-layer opacity in the ripple.
 */
function opacityFor(db, tokenName) {
  if (!tokenName.endsWith('.color') || tokenName.includes('state-layer')) return undefined;
  const parts = tokenName.replace(/\.color$/, '.opacity').split('.');
  if (db.tokens.has(parts.join('.'))) return parts.join('.');
  const head = tokenName.split('.').slice(0, 3).length; // md.comp.<name>
  for (let i = head; i < parts.length - 1; i++) {
    const candidate = [...parts.slice(0, i), ...parts.slice(i + 1)].join('.');
    if (db.tokens.has(candidate)) return candidate;
  }
  return undefined;
}

/**
 * Values that differ in spelling only: `9999px`/`calc(height / 2)` full
 * corners, `0`/`0px`, `/ 0.38` vs `/ 38%`, spaces inside `var( )`.
 */
export function equivalent(have, want) {
  const canon = (v) =>
    norm(v)
      .replace(/\(\s+/g, '(')
      .replace(/\s+\)/g, ')')
      .replace(/\/ (0?\.\d+|1)\)/g, (_, n) => `/ ${Math.round(Number(n) * 100)}%)`);
  if (canon(have) === canon(want)) return true;
  const full = /9999px|corner-full|calc\(var\(--[\w-]*height\) \/ 2\)|50cqmin|^50%$/;
  if (full.test(have) && full.test(want)) return true;
  if (/^0(px)?$/.test(norm(have)) && /^0(px)?$/.test(norm(want))) return true;
  return false;
}
