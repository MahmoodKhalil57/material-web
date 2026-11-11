/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Lighthouse (navigation mode: a cold load with a throttled phone, or a
// desktop with --desktop) on a few /3.0/ pages of each kind, for the lab
// scores and audits that site/scripts/walk.mjs doesn't cover (it measures
// warm page-to-page navigations). Runs Lighthouse through npx, so it adds no
// dependency, with Playwright's Chromium. Reports go to --out (HTML and
// JSON, a temporary directory by default) and never leave the machine.
//
//   node site/scripts/lighthouse.mjs [--desktop] [--out <dir>] [url ...]
//
// The dev server must be running (npm run catalog:dev). Its build isn't
// minified or compressed, so the performance score and the timing audits
// only mean something against a production build; the layout shift,
// accessibility, SEO and best-practices findings hold either way.

import {chromium} from 'playwright';
import {spawnSync} from 'node:child_process';
import {mkdirSync, readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {parseArgs} from 'node:util';

const LIGHTHOUSE = 'lighthouse@12';
const PAGES = [
  'http://localhost:8000/3.0/',
  'http://localhost:8000/3.0/components/',
  'http://localhost:8000/3.0/components/button/',
  'http://localhost:8000/3.0/components/carousel/',
  'http://localhost:8000/3.0/styles/color/',
];

const {values: args, positionals} = parseArgs({
  allowPositionals: true,
  options: {
    desktop: {type: 'boolean', default: false},
    out: {type: 'string', default: join(tmpdir(), 'catalog-lighthouse')},
  },
});
const urls = positionals.length ? positionals : PAGES;
const out = join(args.out, args.desktop ? 'desktop' : 'mobile');
mkdirSync(out, {recursive: true});

const rows = [];
for (const url of urls) {
  const name = new URL(url).pathname.replace(/\/$/, '').replace(/\//g, '-').replace(/^-/, '') || 'home';
  const base = join(out, name);
  const command = [
    'npx',
    '--yes',
    LIGHTHOUSE,
    url,
    '--quiet',
    '--output=json',
    '--output=html',
    `--output-path=${base}`,
    '--chrome-flags=--headless=new',
    ...(args.desktop ? ['--preset=desktop'] : []),
  ]
    .map((part) => (/[\s&|<>^()]/.test(part) ? `"${part}"` : part))
    .join(' ');
  // One command line through the shell: npx is a .cmd script on Windows.
  const result = spawnSync(command, {
    env: {...process.env, CHROME_PATH: chromium.executablePath()},
    encoding: 'utf8',
    shell: true,
  });
  if (result.status !== 0) {
    console.log(`${url}: lighthouse failed\n${result.stderr.trim().split('\n').slice(-5).join('\n')}`);
    process.exitCode = 1;
    continue;
  }
  const report = JSON.parse(readFileSync(`${base}.report.json`, 'utf8'));
  const score = (id) => Math.round((report.categories[id]?.score ?? 0) * 100);
  const audit = (id) => report.audits[id]?.numericValue;
  rows.push({
    page: new URL(url).pathname,
    perf: score('performance'),
    a11y: score('accessibility'),
    bp: score('best-practices'),
    seo: score('seo'),
    fcp: Math.round(audit('first-contentful-paint')),
    lcp: Math.round(audit('largest-contentful-paint')),
    tbt: Math.round(audit('total-blocking-time')),
    cls: Number((audit('cumulative-layout-shift') ?? 0).toFixed(3)),
    failed: Object.values(report.audits)
      .filter((a) => a.score !== null && a.score < 0.9 && a.scoreDisplayMode !== 'informative' && a.scoreDisplayMode !== 'manual')
      .map((a) => a.id),
  });
}

console.log(`Lighthouse (${args.desktop ? 'desktop' : 'mobile, throttled'}): ${out}`);
console.log('perf  a11y  bp  seo   FCP ms  LCP ms  TBT ms    CLS  page');
for (const r of rows) {
  console.log(
    `${String(r.perf).padStart(4)}  ${String(r.a11y).padStart(4)} ${String(r.bp).padStart(3)} ${String(r.seo).padStart(4)}  ` +
      `${String(r.fcp).padStart(7)} ${String(r.lcp).padStart(7)} ${String(r.tbt).padStart(7)} ${String(r.cls).padStart(6)}  ${r.page}`,
  );
}
const failing = new Map();
for (const r of rows) for (const id of r.failed) failing.set(id, [...(failing.get(id) ?? []), r.page]);
if (failing.size) {
  console.log('\naudits under 90 (pages):');
  for (const [id, pages] of [...failing].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  ${id}  (${pages.length}) ${pages.join(' ')}`);
  }
}
