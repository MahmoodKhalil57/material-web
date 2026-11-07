#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Audits every `labs/gb` component token file against the M3 spec (binding
 * inference lives in gb-bindings.mjs), and optionally syncs drifted values.
 *
 *   node scripts/m3/audit-gb.mjs [component ...] [--verbose] [--sync] [--gaps]
 *
 * `--sync`  rewrites only high-confidence declarations that differ from the spec.
 *
 * Drift marks: `~` high confidence (for a generated token file: out of date
 * with its binding), `E~` a deliberate `// EDIT:` override of a generated
 * value, `?~` an inferred binding that may be wrong.
 * `--gaps`  lists spec tokens Compose uses that no gb declaration implements.
 *
 * Exits non-zero on high-confidence drift (unless synced). Token mixins the
 * component never includes are reported as warnings.
 */

import {readdir, writeFile} from 'node:fs/promises';
import {COMPONENT_SETS, GB, loadBindings} from './gb-bindings.mjs';

const argv = process.argv.slice(2);
const verbose = argv.includes('--verbose');
const sync = argv.includes('--sync');
const gapsOnly = argv.includes('--gaps');
const only = argv.filter((a) => !a.startsWith('--'));

const {db, usage, analyze} = await loadBindings();
const INTERACTION = ['hover', 'hovered', 'focus', 'focused', 'pressed'];
const totals = {decls: 0, match: 0, derived: 0, drift: 0, confident: 0, unbound: 0, gaps: 0, unwired: 0};
const rows = [];

for (const dir of (await readdir(GB)).sort()) {
  if (!COMPONENT_SETS[dir] || (only.length && !only.includes(dir))) continue;
  const result = await analyze(dir);
  if (!result) continue;
  const {files, records, tokens, bound, unwired} = result;
  const by = (status) => records.filter((r) => r.status === status);
  const drift = by('drift');
  const confident = drift.filter((d) => d.confident);

  if (sync) {
    for (const {path, source} of files) {
      const mine = confident.filter((d) => d.file === path);
      if (mine.length) await writeFile(path, applySync(source, mine));
    }
  }

  // Gaps: tokens the reference implementation uses for this component that
  // no gb declaration is bound to (spec features gb may be missing).
  // A token whose twin in a sibling set (same path after the component
  // name, same value) is implemented counts as implemented, e.g.
  // `md.comp.fab.primary-container.container.color` when the FAB colors
  // compile from `md.comp.extended-fab.primary-container`.
  const rel = (t) => t.split('.').slice(3).join('.');
  const value = (t) => JSON.stringify(db.resolve(t)?.ref ?? db.resolve(t)?.resolved);
  const twins = new Map();
  for (const b of bound) twins.set(`${rel(b)} ${value(b)}`, b);
  const gaps = tokens
    .filter((t) => usage.has(t) && !bound.has(t) && !db.tokens.get(t).token.deprecationMessage)
    .filter((t) => !twins.has(`${rel(t)} ${value(t)}`))
    // A hover / focus / pressed token equal to its resting token, which is
    // implemented, is implemented by that resting value.
    .filter((t) => {
      const parts = t.split('.');
      return !parts.some((p, i) => {
        if (!INTERACTION.includes(p)) return false;
        const rest = [...parts.slice(0, i), ...parts.slice(i + 1)].join('.');
        return bound.has(rest) && value(rest) === value(t);
      });
    })
    .sort();

  const counts = [records.length, by('match').length, by('derived').length, drift.length, by('unbound').length, gaps.length, unwired.length];
  rows.push([dir, ...counts]);
  totals.decls += counts[0];
  totals.match += counts[1];
  totals.derived += counts[2];
  totals.drift += counts[3];
  totals.unbound += counts[4];
  totals.gaps += counts[5];
  totals.unwired += counts[6];
  totals.confident += confident.length;

  const showDetails = !gapsOnly && (drift.length || unwired.length || (verbose && counts[4]));
  if (showDetails) {
    console.log(`\n## ${dir} (${files.map((f) => f.path).join(', ')})`);
    for (const d of drift) {
      const mark = d.confident ? '~' : d.edited ? 'E~' : '?~';
      const where = files.length > 1 ? `${d.ns}.${d.mixin}` : d.mixin;
      console.log(`  ${mark} ${where}: --${d.prop} is ${d.have}, spec ${d.token} says ${d.want}`);
    }
    for (const m of unwired) console.log(`  ! @mixin ${m} is never included by the component`);
    if (verbose) for (const u of by('unbound')) console.log(`  ? ${u.mixin}: --${u.prop}: ${u.have}`);
  }
  if (gapsOnly && gaps.length) {
    console.log(`\n## ${dir}: ${gaps.length} spec tokens used by Compose but not by gb`);
    for (const t of gaps) {
      const site = usage.get(t)[0];
      console.log(`  - ${t}  (${site.decl}${site.role ? ` ${site.role}` : ''})`);
    }
  }
}

console.log('\ncomponent      decls  match derived drift  no-spec  gaps unwired');
for (const [dir, ...n] of rows) {
  console.log(`${dir.padEnd(14)} ${n.map((x) => String(x).padStart(5)).join('  ')}`);
}
console.log(
  `\n${totals.decls} declarations: ${totals.match} match the spec, ${totals.derived} derived, ` +
    `${totals.drift} drift (${totals.confident} high-confidence${sync ? ', synced' : ''}), ` +
    `${totals.unbound} have no spec token; ${totals.gaps} spec tokens used by Compose are not ` +
    `implemented in gb; ${totals.unwired} token mixins are never included.`,
);
// Unwired mixins are reported as warnings; high-confidence drift fails.
if (totals.confident && !sync) process.exitCode = 1;

/** Rewrites drifted declarations inside their mixins. */
function applySync(source, drift) {
  for (const {mixin, prop, want} of drift) {
    const block = new RegExp(`(@mixin\\s+${mixin}\\s*\\{)([^}]*)(\\})`);
    source = source.replace(block, (_, open, body, close) => {
      const decl = new RegExp(`(--${prop}\\s*:\\s*)[^;]+;`);
      return open + body.replace(decl, `$1${want};`) + close;
    });
  }
  return source;
}
