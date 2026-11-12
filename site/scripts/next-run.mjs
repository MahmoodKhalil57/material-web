/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Walks the 3.0 docs from the first page to the last by clicking "Next" in
// Chromium, and times it twice:
//
//   fresh  A new browser profile with an empty cache. The upper bound.
//   warm   The same profile again, with every page and asset already in the
//          HTTP cache. The lower bound for a real visitor.
//
// Each step counts from the click until the next page is loaded ("load") and
// until its view transition has finished ("ready", when the next click would
// land on the page rather than the transition).
//
//   node site/scripts/next-run.mjs [url] [--runs 3] [--headed]
//     [--reduce-motion] [--no-sw] [--json out.json]
//
// --no-sw blocks the site's service worker, to compare with it.
//
// url defaults to https://mahmoodkhalil57.github.io/material-web/3.0/

import {writeFileSync} from 'node:fs';
import {chromium} from 'playwright';

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};
const START =
  args.find((a) => /^https?:/.test(a)) ??
  'https://mahmoodkhalil57.github.io/material-web/3.0/';
const RUNS = Number(option('--runs', 1));
const JSON_OUT = option('--json');
// The spec shell's pager (site/specs/shell.cjs).
// Its Next link: the md-gb-button's own <a> (rel and href are the button's
// properties once the shell hydrates, so not attributes to select on).
const nextLink = (page) => page.locator('nav[aria-label="Previous and next pages"]').getByRole('link', {name: /^Next:/});
const MAX_STEPS = 500;

// Records when the incoming page's view transition finishes. Runs before the
// page's own scripts, so the listener is in place before pagereveal fires.
function watchTransition() {
  window.__gbReady = Promise.resolve();
  addEventListener('pagereveal', (event) => {
    const vt = event.viewTransition;
    if (vt) window.__gbReady = vt.finished.catch(() => {});
  });
}

async function walk(page, label) {
  const steps = [];
  const t0 = performance.now();
  await page.goto(START, {waitUntil: 'load'});
  const firstLoad = performance.now() - t0;

  for (let i = 0; i < MAX_STEPS; i++) {
    const next = nextLink(page);
    if ((await next.count()) === 0) break;
    const href = new URL(await next.getAttribute('href'), page.url()).href;
    const from = page.url();

    const start = performance.now();
    const clickedAt = Date.now();
    await Promise.all([
      page.waitForURL(href, {waitUntil: 'load'}),
      next.click(),
    ]);
    const load = performance.now() - start;
    // Where the time went, from the new page's navigation timing: how long
    // until the navigation started (the click itself, and the old page's
    // pageswap), then the response, DOMContentLoaded and load.
    const phases = await page.evaluate(async (clickedAt) => {
      const nav = performance.getEntriesByType('navigation')[0];
      const startedAt = performance.timeOrigin - clickedAt;
      return {
        start: startedAt,
        response: nav.responseEnd,
        dom: nav.domContentLoadedEventEnd,
        load: nav.loadEventEnd,
        cached: nav.transferSize === 0,
      };
    }, clickedAt);
    await page.evaluate(() => window.__gbReady);
    const ready = performance.now() - start;

    steps.push({from, to: page.url(), load, ready, phases});
    process.stdout.write(
      `\r${label}: ${steps.length} pages, ${fmt(performance.now() - t0)}   `,
    );
  }
  process.stdout.write('\n');
  return {firstLoad, steps, total: performance.now() - t0};
}

const fmt = (ms) => (ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${Math.round(ms)} ms`);
const sum = (xs) => xs.reduce((a, b) => a + b, 0);
function stats(xs) {
  const s = [...xs].sort((a, b) => a - b);
  const at = (q) => s[Math.min(s.length - 1, Math.floor(q * s.length))];
  return {min: s[0], median: at(0.5), p95: at(0.95), max: s[s.length - 1]};
}

function summary(run) {
  const load = run.steps.map((s) => s.load);
  const ready = run.steps.map((s) => s.ready);
  return {
    pages: run.steps.length + 1,
    firstLoad: run.firstLoad,
    total: run.total,
    clicksToLoad: sum(load),
    clicksToReady: sum(ready),
    load: stats(load),
    ready: stats(ready),
  };
}

const browser = await chromium.launch({headless: !flag('--headed')});
const results = {fresh: [], warm: []};
try {
  for (let r = 1; r <= RUNS; r++) {
    const context = await browser.newContext({
      viewport: {width: 1440, height: 900},
      reducedMotion: flag('--reduce-motion') ? 'reduce' : 'no-preference',
      serviceWorkers: flag('--no-sw') ? 'block' : 'allow',
    });
    await context.addInitScript(watchTransition);
    const page = await context.newPage();
    const tag = RUNS > 1 ? ` #${r}` : '';
    results.fresh.push(await walk(page, `fresh${tag}`));
    results.warm.push(await walk(page, `warm${tag}`));
    await context.close();
  }
} finally {
  await browser.close();
}

// The slowest step of each kind across all runs, to name the pages to look at.
const slowest = (runs) =>
  runs
    .flatMap((r) => r.steps)
    .sort((a, b) => b.ready - a.ready)
    .slice(0, 5)
    .map((s) => `    ${fmt(s.ready).padStart(8)}  ${new URL(s.to).pathname}`)
    .join('\n');

for (const kind of ['fresh', 'warm']) {
  const runs = results[kind].map(summary);
  const best = runs.reduce((a, b) => (b.total < a.total ? b : a));
  const worst = runs.reduce((a, b) => (b.total > a.total ? b : a));
  console.log(`\n${kind} (${runs.length} run${runs.length > 1 ? 's' : ''}, ${best.pages} pages)`);
  console.log(`  first page load   ${fmt(best.firstLoad)}`);
  console.log(`  start to last     ${fmt(best.total)}${runs.length > 1 ? ` best, ${fmt(worst.total)} worst` : ''}`);
  console.log(`  clicks to load    ${fmt(best.clicksToLoad)}`);
  console.log(`  clicks to ready   ${fmt(best.clicksToReady)}`);
  const {load, ready} = best;
  console.log(`  per click, load   min ${fmt(load.min)}, median ${fmt(load.median)}, p95 ${fmt(load.p95)}, max ${fmt(load.max)}`);
  console.log(`  per click, ready  min ${fmt(ready.min)}, median ${fmt(ready.median)}, p95 ${fmt(ready.p95)}, max ${fmt(ready.max)}`);
  const phase = (key) => fmt(stats(results[kind].flatMap((r) => r.steps.map((s) => s.phases[key]))).median);
  const cached = results[kind].flatMap((r) => r.steps).filter((s) => s.phases.cached).length;
  console.log(`  median phases     click to navigation ${phase('start')}, then response ${phase('response')}, DOM ${phase('dom')}, load ${phase('load')}`);
  console.log(`  pages from cache  ${cached} of ${results[kind].flatMap((r) => r.steps).length}`);
  console.log(`  slowest steps\n${slowest(results[kind])}`);
}

if (JSON_OUT) {
  writeFileSync(JSON_OUT, JSON.stringify({start: START, results}, null, 2));
  console.log(`\nWrote ${JSON_OUT}`);
}
