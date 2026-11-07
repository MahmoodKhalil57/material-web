#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Checks every /3.0/ page built by `npm run catalog:dev` (catalog/_dev/3.0)
 * against the running server: status 200, no console errors, no code block
 * outside a demo card (shell excepted), no raw ``` fences, no demo script
 * errors, and axe-core with the live previews excluded. Run from the repo
 * root: `node scripts/catalog-check.mjs`. Exits 1 when a page has problems.
 */
import {chromium} from 'playwright';
import {readFileSync, readdirSync, statSync} from 'node:fs';
import {join} from 'node:path';

const pages = [];
const walk = (d) => {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) walk(p);
    else if (n === 'index.html') pages.push(p);
  }
};
walk('catalog/_dev/3.0');
const axe = readFileSync('node_modules/axe-core/axe.min.js', 'utf8');
const b = await chromium.launch();
const ctx = await b.newContext({viewport: {width: 1280, height: 900}, serviceWorkers: 'block'});
const bad = [];
for (const file of pages) {
  const url = 'http://localhost:8000/' + file.replace(/\\/g, '/').replace('catalog/_dev/', '').replace('index.html', '');
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e).slice(0, 120)));
  p.on('console', (m) => m.type() === 'error' && errs.push(m.text().slice(0, 120)));
  const res = await p.goto(url, {waitUntil: 'networkidle'});
  // Scroll through so lazy demo iframes load.
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  await p.waitForTimeout(800);
  const r = await p.evaluate(() => {
    const loose = [...document.querySelectorAll('.gb-content pre')].filter(
      (pre) => !pre.closest('.gb-demo') && !/language-(sh|bash|shell)/.test(pre.className + pre.querySelector('code')?.className),
    ).length;
    const rawFences = (document.querySelector('.gb-content')?.textContent.match(/```/g) ?? []).length;
    const demoErrors = [...document.querySelectorAll('iframe')].map((f) => {
      try {
        return f.contentDocument?.querySelector('.gb-demo-error')?.textContent ?? '';
      } catch {
        return '';
      }
    }).filter(Boolean);
    return {loose, rawFences, demoErrors};
  });
  await p.addScriptTag({content: axe});
  const v = await p.evaluate(async () => {
    const out = await window.axe.run({exclude: [['.gb-demo-preview'], ['.gb-example']]});
    return out.violations.map((x) => x.id + ':' + x.nodes.length);
  });
  const problems = [];
  if (res.status() !== 200) problems.push('status ' + res.status());
  if (errs.length) problems.push('errors ' + JSON.stringify(errs.slice(0, 2)));
  if (r.loose) problems.push('loose code blocks ' + r.loose);
  if (r.rawFences) problems.push('raw ``` ' + r.rawFences);
  if (r.demoErrors.length) problems.push('demo errors ' + JSON.stringify(r.demoErrors.slice(0, 2)));
  if (v.length) problems.push('axe ' + v.join(','));
  if (problems.length) bad.push(url + '  ' + problems.join(' | '));
  await p.close();
}
console.log(pages.length, 'pages;', bad.length, 'with problems');
for (const l of bad) console.log(l);
await b.close();
process.exitCode = bad.length ? 1 : 0;
