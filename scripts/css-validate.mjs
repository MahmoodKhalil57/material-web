#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Validates every compiled library stylesheet (`*.css`, the Sass output) with
 * Lightning CSS against the browser targets below. Nothing is rewritten.
 *
 *   npm run css-validate
 *   npm run css-validate -- --notes     # also list syntax Lightning would
 *                                          # lower or prefix for the targets
 *
 * Fails (exit 1) on parse errors and on Lightning warnings (invalid or
 * unsupported rules). With --notes it also prints, per file, whether compiling
 * for the targets would change the CSS (nesting, `color-mix()`, prefixes...):
 * information only, since gb is Chromium-first and uses `@supports` for the
 * rest.
 *
 * Run `npm run check -- --all` (or the Sass build) first: this reads the
 * compiled .css files, which are not committed.
 */

import {readdirSync, readFileSync, statSync} from 'node:fs';
import {join, relative} from 'node:path';
import {transform} from 'lightningcss';
import {baselineTargets} from './baseline.mjs';

/**
 * Browser targets: Baseline "widely available" from `baseline-browser-mapping`
 * (web-features), as Lightning CSS targets (chrome, edge, firefox, safari,
 * ios_saf). Derived on every run, so they move with the installed data
 * package; the versions are printed below.
 */
const {targets: TARGETS, versions: TARGET_VERSIONS} = baselineTargets();
export {TARGETS};
console.log(`[css-validate] Baseline widely available targets: ${Object.entries(TARGET_VERSIONS).map(([b, v]) => `${b} ${v}`).join(', ')}`);

const ROOT = join('material-design-expressive');

/**
 * Tailwind v4 directives in styles/tailwind.css are input for Tailwind, not
 * plain CSS, so Lightning reports them as unknown at-rules. Allowed only there.
 */
const TAILWIND_AT_RULES = /^Unknown at rule: @(theme|utility|custom-variant|source|variant|apply|plugin|config|reference)$/;
const allowed = (rel, message) => rel.endsWith('styles/tailwind.css') && TAILWIND_AT_RULES.test(message);
const showNotes = process.argv.includes('--notes');

function cssFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules') continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...cssFiles(path));
    else if (name.endsWith('.css')) out.push(path);
  }
  return out;
}

const compile = (filename, code, targets) =>
  transform({filename, code, targets, minify: true, errorRecovery: false});

const files = cssFiles(ROOT);
if (!files.length) {
  console.error('No compiled .css files under material-design-expressive/. Run `npm run check -- --all` first.');
  process.exit(2);
}

let errors = 0;
let warnings = 0;
let lowered = 0;
for (const file of files) {
  const rel = relative('.', file).replaceAll('\\', '/');
  const code = readFileSync(file);
  let result;
  try {
    result = compile(file, code, TARGETS);
  } catch (e) {
    errors++;
    console.error(`ERROR ${rel}:${e.loc?.line ?? '?'}:${e.loc?.column ?? '?'} ${e.message}`);
    continue;
  }
  for (const w of result.warnings) {
    if (allowed(rel, w.message)) continue;
    warnings++;
    console.error(`WARN  ${rel}:${w.loc.line}:${w.loc.column} ${w.message}`);
  }
  if (showNotes) {
    // Same stylesheet with no targets: any difference is syntax or prefixes
    // that Lightning would lower for the targets above.
    const baseline = compile(file, code, undefined);
    if (Buffer.compare(Buffer.from(baseline.code), Buffer.from(result.code)) !== 0) {
      lowered++;
      console.log(`NOTE  ${rel}: would be lowered/prefixed for the targets`);
    }
  }
}

console.log(
  `[css-validate] ${files.length} files, ${errors} errors, ${warnings} warnings` +
    (showNotes ? `, ${lowered} would be lowered` : ''),
);
process.exit(errors || warnings ? 1 : 0);
