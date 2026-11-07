/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Per-component Brotli size budgets for labs/gb.
 *
 *   npm run gb:size           # print today's sizes next to the budgets
 *   npm run gb:size:check     # exit 1 when a component exceeds its budget
 *   npm run gb:size:update    # rewrite gb-budgets.json: current size + 10%
 *
 * A component is a labs/gb/components directory with `md-gb-*.js` entries.
 * Its JS size is the minified module graph of those entries (Lit and other
 * node_modules external, Lit `css` templates stripped); its CSS size is its
 * compiled `.css` files concatenated. Both Brotli at maximum quality.
 *
 * Needs the compiled .js and .css (`npm run gb:check -- --all`).
 */

import {existsSync, readdirSync, readFileSync, statSync, writeFileSync} from 'fs';
import {join} from 'path';

import {getSplitBrotliSize} from './bundle-size.js';

const COMPONENTS = join('labs', 'gb', 'components');
const BUDGETS = join('scripts', 'size', 'gb-budgets.json');
/** Headroom added to today's size when writing budgets. */
const HEADROOM = 0.1;

interface Budget {
  js: number;
  css: number;
}

function listComponents(): Array<{name: string; js: string[]; css: string[]}> {
  const out = [];
  for (const name of readdirSync(COMPONENTS).sort()) {
    const dir = join(COMPONENTS, name);
    if (!statSync(dir).isDirectory()) continue;
    const files = readdirSync(dir);
    const js = files
      .filter((f) => /^md-gb-.*\.js$/.test(f))
      .map((f) => join(dir, f));
    if (!js.length) continue;
    const css = files.filter((f) => f.endsWith('.css')).map((f) => join(dir, f));
    out.push({name, js, css});
  }
  return out;
}

const mode = process.argv.includes('--update')
  ? 'update'
  : process.argv.includes('--check')
    ? 'check'
    : 'report';

const budgets: Record<string, Budget> = existsSync(BUDGETS)
  ? JSON.parse(readFileSync(BUDGETS, 'utf8')).components
  : {};

const sizes: Record<string, Budget> = {};
for (const c of listComponents()) {
  if (!c.css.length) {
    console.error(`${c.name}: no compiled .css (run gb:check -- --all)`);
    process.exit(2);
  }
  sizes[c.name] = await getSplitBrotliSize(c.js, c.css);
}

if (mode === 'update') {
  const components: Record<string, Budget> = {};
  for (const [name, s] of Object.entries(sizes)) {
    components[name] = {
      js: Math.ceil(s.js * (1 + HEADROOM)),
      css: Math.ceil(s.css * (1 + HEADROOM)),
    };
  }
  writeFileSync(
    BUDGETS,
    JSON.stringify({unit: 'bytes, brotli', headroom: HEADROOM, components}, null, 2) + '\n',
  );
  console.log(`[gb:size] wrote ${BUDGETS} (${Object.keys(components).length} components)`);
  process.exit(0);
}

const pad = (v: string | number, n: number) => String(v).padStart(n);
console.log(`${'component'.padEnd(18)} ${pad('js', 7)} ${pad('budget', 7)} ${pad('css', 7)} ${pad('budget', 7)}`);
let failures = 0;
for (const [name, s] of Object.entries(sizes)) {
  const b = budgets[name];
  const over = (kind: 'js' | 'css') => b && s[kind] > b[kind];
  const flag = (kind: 'js' | 'css') => (over(kind) ? '!' : ' ');
  console.log(
    `${name.padEnd(18)} ${pad(s.js, 7)}${flag('js')}${pad(b?.js ?? '-', 7)} ${pad(s.css, 7)}${flag('css')}${pad(b?.css ?? '-', 7)}`,
  );
  if (mode === 'check') {
    if (!b) {
      console.error(`${name}: no budget (run gb:size:update)`);
      failures++;
    }
    for (const kind of ['js', 'css'] as const) {
      if (over(kind)) {
        console.error(`${name}: ${kind} is ${s[kind]} B Brotli, budget ${b[kind]} B`);
        failures++;
      }
    }
  }
}
for (const name of Object.keys(budgets)) {
  if (mode === 'check' && !(name in sizes)) {
    console.error(`${name}: has a budget but no component (run gb:size:update)`);
    failures++;
  }
}
const total = (k: 'js' | 'css') => Object.values(sizes).reduce((a, s) => a + s[k], 0);
console.log(`${'total'.padEnd(18)} ${pad(total('js'), 7)} ${' '.repeat(7)} ${pad(total('css'), 7)}`);
if (failures) {
  console.error(`[gb:size] ${failures} budget failure(s)`);
  process.exit(1);
}
