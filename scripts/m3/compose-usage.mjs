#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Extracts how Jetpack Compose Material 3 (the reference implementation)
 * uses spec tokens: which token styles which component part and state.
 *
 * Compose's generated `*Tokens.kt` values are older snapshots, so values
 * always come from the docs; Compose only contributes *usage*.
 *
 *   node scripts/m3/compose-usage.mjs [--compose .m3-specs/compose]
 *
 * Writes `.m3-specs/compose-usage.json`:
 *   { tokens: { "md.comp.button.xsmall.leading-space": [{file, decl, role}] },
 *     unresolved: { "SomeTokens.Prop": count } }
 */

import {readdir, readFile, writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {SpecDb} from './spec-db.mjs';

const COMPOSE = process.argv.includes('--compose')
  ? process.argv[process.argv.indexOf('--compose') + 1]
  : '.m3-specs/compose';
const SRC = join(COMPOSE, 'material3', 'commonMain', 'androidx', 'compose', 'material3');

const db = await SpecDb.load();

/** Compose object names for system token sets. */
const SYS_SETS = {
  ColorLight: 'md.sys.color',
  ColorDark: 'md.sys.color',
  Palette: 'md.ref.palette',
  Typeface: 'md.ref.typeface',
  typography: 'md.sys.typescale',
  TypeScale: 'md.sys.typescale',
  Shape: 'md.sys.shape',
  Elevation: 'md.sys.elevation',
  State: 'md.sys.state',
  Motion: 'md.sys.motion',
  StandardMotion: 'md.sys.motion',
  ExpressiveMotion: 'md.sys.motion',
};
/** Word spellings that differ between Compose object names and set names. */
const WORD_ALIASES = {navigation: ['nav'], menu: ['menus'], fab: ['fab'], xsmall: ['xsmall'], xlarge: ['xlarge']};

const camelWords = (s) =>
  s
    .replace(/XSmall/g, 'Xsmall')
    .replace(/XLarge/g, 'Xlarge')
    .split(/(?=[A-Z])|[^A-Za-z0-9]/)
    .filter(Boolean)
    .map((w) => w.toLowerCase());
const setWords = (set) => set.replace(/^md\.(comp|sys|ref)\./, '').split(/[.-]/);
const bag = (words) => [...words].sort().join(' ');

// Index sets by their unordered words, including alias spellings.
const setsByBag = new Map();
for (const set of db.sets.keys()) {
  const k = bag(setWords(set));
  setsByBag.set(k, [...(setsByBag.get(k) ?? []), set]);
}

function objectSets(object) {
  const name = object.replace(/Tokens$/, '');
  if (SYS_SETS[name]) return [SYS_SETS[name]];
  const words = camelWords(name);
  // Try every alias combination (e.g. navigation -> nav).
  let variants = [[]];
  for (const w of words) {
    const options = [w, ...(WORD_ALIASES[w] ?? [])];
    variants = variants.flatMap((v) => options.map((o) => [...v, o]));
  }
  for (const v of variants) {
    const hit = setsByBag.get(bag(v));
    if (hit) return hit;
  }
  return [];
}

const tokenCache = new Map();
/**
 * Kotlin `FooTokens.Bar` -> {tokenName, extra} where `extra` counts spec
 * words the Kotlin name leaves out (0 = exact).
 */
function specToken(object, prop) {
  const cacheKey = `${object}.${prop}`;
  if (tokenCache.has(cacheKey)) return tokenCache.get(cacheKey);
  const propWords = camelWords(prop);
  let best;
  for (const set of objectSets(object)) {
    for (const tokenName of db.tokens.keys()) {
      if (!tokenName.startsWith(`${set}.`) || db.tokens.get(tokenName).set !== set) continue;
      const path = tokenName.slice(set.length + 1).split(/[.-]/);
      const extra = alignExtra(path, propWords);
      if (extra === undefined) continue;
      if (!best || extra < best.extra) best = {tokenName, extra};
    }
  }
  tokenCache.set(cacheKey, best);
  return best;
}

/** Ordered subsequence match anchored at the last word; returns skipped count. */
function alignExtra(path, words) {
  if (path[path.length - 1] !== words[words.length - 1]) return undefined;
  let j = words.length - 1;
  let extra = 0;
  for (let i = path.length - 1; i >= 0; i--) {
    if (j >= 0 && path[i] === words[j]) j--;
    else extra++;
  }
  // Kotlin names may not skip spec state words (selected, hover...).
  return j < 0 && extra <= 3 ? extra : undefined;
}

const usage = {};
const unresolved = {};
const files = (await walk(SRC)).filter((f) => f.endsWith('.kt') && !f.includes(`${'tokens'}`));
for (const file of files) {
  const lines = (await readFile(file, 'utf8')).split('\n');
  const decls = []; // stack of [indent, name]
  lines.forEach((line, i) => {
    const indent = line.search(/\S/);
    const decl = line.match(/\b(?:fun|val|var|object|class)\s+(?:<[^>]*>\s*)?(?:[\w.]+\.)?(\w+)/);
    if (decl && indent >= 0) {
      while (decls.length && decls[decls.length - 1][0] >= indent) decls.pop();
      decls.push([indent, decl[1]]);
    }
    for (const m of line.matchAll(/\b(\w+Tokens)\.(\w+)/g)) {
      const [ref, object, prop] = m;
      // *KeyTokens are enums pointing at other tokens, not tokens themselves.
      if (/KeyTokens$/.test(object)) continue;
      const hit = specToken(object, prop);
      if (!hit) {
        unresolved[ref] = (unresolved[ref] ?? 0) + 1;
        continue;
      }
      const role = line.slice(0, m.index).match(/(\w+)\s*[=:]\s*[^=]*$/)?.[1];
      (usage[hit.tokenName] ??= []).push({
        kotlin: ref,
        ...(hit.extra ? {extra: hit.extra} : {}),
        file: file.slice(SRC.length + 1).replace(/\\/g, '/'),
        line: i + 1,
        decl: decls.map(([, n]) => n).join('.'),
        ...(role ? {role} : {}),
      });
    }
  });
}

const out = join('.m3-specs', 'compose-usage.json');
await writeFile(out, JSON.stringify({compose: COMPOSE, tokens: usage, unresolved}, null, 2));
const total = Object.values(usage).reduce((n, u) => n + u.length, 0);
const misses = Object.values(unresolved).reduce((n, c) => n + c, 0);
console.log(
  `${Object.keys(usage).length} spec tokens used in ${total} places; ` +
    `${misses} references (${Object.keys(unresolved).length} distinct) not in the docs. -> ${out}`,
);

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, {withFileTypes: true})) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name !== 'tokens') out.push(...(await walk(p)));
    } else out.push(p);
  }
  return out;
}
