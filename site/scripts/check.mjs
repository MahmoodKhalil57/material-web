#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Checks every /3.0/ page built by `npm run catalog:dev` (site/_dev/3.0)
 * against the running server: status 200, no console errors, no raw ```
 * fences or code blocks the content conversion left as HTML, no demo script
 * errors, and axe-core (demos left out: their components' own tests check
 * them, and some show states on purpose). Run from the repo root:
 * `node site/scripts/check.mjs`. Exits 1 when a page has problems.
 *
 * axe reads ARIA from attributes, not the role and states components set
 * through ElementInternals (a nav rail's navigation, a chip set's grid, a
 * radio's radio), so it would report their children and labels as
 * misplaced. Each page first runs the library's axe-internals module
 * (foundations/accessibility/axe-internals.ts, which its own axe suites
 * use): every internals role and ARIA state also appears as an attribute,
 * so axe checks what assistive technology gets. axe also doesn't know that a
 * `<label>` names a form-associated custom element (a radio, a switch), as
 * it does in the browser: such an element gets `aria-labelledby` pointing at
 * its labels before axe runs.
 */
import {chromium} from 'playwright';
import {readFileSync, readdirSync, statSync} from 'node:fs';
import {join} from 'node:path';

const pages = [];
const walk = (d) => {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) walk(p);
    // /3.0/all/ (8000 requests in dev) is checked on its own.
    else if (n === 'index.html' && !/3\.0[\\/]all$/.test(d)) pages.push(p);
  }
};
walk('site/_dev/3.0');
const axe = readFileSync('node_modules/axe-core/axe.min.js', 'utf8');
const b = await chromium.launch();
const ctx = await b.newContext({viewport: {width: 1280, height: 900}, serviceWorkers: 'block'});
// Before any component is defined: internals ARIA mirrored to attributes.
const internals = readFileSync('material-design-expressive/foundations/accessibility/axe-internals.js', 'utf8').replace(/^export \{\};?\s*$/m, '');
await ctx.addInitScript({content: internals});
const bad = [];
for (const file of pages) {
  const url = 'http://localhost:8000/' + file.replace(/\\/g, '/').replace('site/_dev/', '').replace('index.html', '');
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e).slice(0, 120)));
  p.on('console', (m) => m.type() === 'error' && errs.push(`${m.text().slice(0, 100)} ${m.location()?.url ?? ''}`.trim()));
  const res = await p.goto(url, {waitUntil: 'networkidle'});
  // Bring every demo into view, so the lazy demo frames load.
  await p.evaluate(async () => {
    for (const demo of document.querySelectorAll('md-gb-demo')) {
      demo.scrollIntoView();
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  await p.waitForTimeout(800);
  const r = await p.evaluate(() => {
    const content = document.getElementById('gb-content');
    const rawFences = (content?.textContent.match(/```/g) ?? []).length;
    // Code blocks become md-gb-demo-code: a native <pre> in the content wasn't converted.
    const loose = content?.querySelectorAll('pre').length ?? 0;
    const frames = [...document.querySelectorAll('md-gb-demo')].flatMap((d) => [...d.querySelectorAll('iframe'), ...(d.shadowRoot?.querySelectorAll('iframe') ?? [])]);
    const demoErrors = frames
      .map((f) => {
        try {
          return f.contentDocument?.querySelector('.gb-demo-error')?.textContent ?? '';
        } catch {
          return '';
        }
      })
      .filter(Boolean);
    return {loose, rawFences, demoErrors};
  });
  // The names labels give form-associated custom elements, as attributes.
  await p.evaluate(() => {
    let n = 0;
    for (const el of document.querySelectorAll('*')) {
      if (!el.localName.includes('-') || !customElements.get(el.localName)?.formAssociated) continue;
      if (el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby')) continue;
      const labels = [...(el.id ? document.querySelectorAll(`label[for="${CSS.escape(el.id)}"]`) : []), el.closest('label')].filter(Boolean);
      if (!labels.length) continue;
      for (const label of labels) label.id ||= `check-label-${n++}`;
      el.setAttribute('aria-labelledby', labels.map((l) => l.id).join(' '));
    }
  });
  await p.addScriptTag({content: axe});
  const v = await p.evaluate(async () => {
    const out = await window.axe.run({exclude: [['md-gb-demo']]});
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
