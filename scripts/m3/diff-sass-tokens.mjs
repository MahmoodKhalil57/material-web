#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Compares generated token modules against a reference folder (by default the
 * committed upstream output) declaration by declaration, ignoring headers and
 * ordering. Prints a per-file summary and the changed declarations.
 *
 *   node scripts/m3/diff-sass-tokens.mjs [generated] [reference] [--verbose]
 */

import {readdir, readFile} from 'node:fs/promises';
import {join} from 'node:path';

const [genDir = '.m3-specs/out/sass', refDir = 'tokens/versions/latest/sass'] = process.argv
  .slice(2)
  .filter((a) => !a.startsWith('--'));
const verbose = process.argv.includes('--verbose');
const limit = verbose ? Infinity : 6;

const gen = await scan(genDir);
const ref = await scan(refDir);

const totals = {same: 0, changed: 0, added: 0, removed: 0};
const onlyGen = [];
const onlyRef = [];
for (const file of [...new Set([...gen.keys(), ...ref.keys()])].sort()) {
  if (file.endsWith('-meta.scss') || file === '_index.scss') continue;
  const g = gen.get(file);
  const r = ref.get(file);
  if (!g) {
    onlyRef.push(file);
    continue;
  }
  if (!r) {
    onlyGen.push(file);
    continue;
  }
  const lines = [];
  for (const [name, value] of r) {
    if (!g.has(name)) {
      totals.removed++;
      lines.push(`  - ${name}: ${value}`);
    } else if (g.get(name) !== value) {
      totals.changed++;
      lines.push(`  ~ ${name}: ${value}  =>  ${g.get(name)}`);
    } else {
      totals.same++;
    }
  }
  for (const [name, value] of g) {
    if (!r.has(name)) {
      totals.added++;
      lines.push(`  + ${name}: ${value}`);
    }
  }
  if (lines.length) {
    console.log(`${file}: ${lines.length} difference(s)`);
    console.log(lines.slice(0, limit).join('\n'));
    if (lines.length > limit) console.log(`  ... ${lines.length - limit} more`);
  }
}
console.log(`\nOnly in generated (${onlyGen.length}): ${onlyGen.join(' ')}`);
console.log(`Only in reference (${onlyRef.length}): ${onlyRef.join(' ')}`);
console.log(
  `Declarations: ${totals.same} identical, ${totals.changed} changed, ` +
    `${totals.added} added, ${totals.removed} removed.`,
);

/** file -> Map(declaration name -> normalized value) */
async function scan(dir) {
  const out = new Map();
  for (const file of await readdir(dir)) {
    if (!file.endsWith('.scss')) continue;
    out.set(file, parse(await readFile(join(dir, file), 'utf8')));
  }
  return out;
}

function parse(source) {
  source = source.replace(/\r\n/g, '\n');
  const decls = new Map();
  for (const m of source.matchAll(/^\$([\w-]+):\s*(.+);$/gm)) decls.set(`$${m[1]}`, m[2].trim());
  for (const m of source.matchAll(/^@mixin ([\w-]+) \{\n([\s\S]*?)^\}/gm)) {
    decls.set(`@mixin ${m[1]}`, m[2].replace(/\s+/g, ' ').trim());
  }
  return decls;
}
