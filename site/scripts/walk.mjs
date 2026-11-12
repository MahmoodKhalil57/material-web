/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Walks the /3.0/ docs the way a reader pages through them: opens the home
// page in headless Chromium and clicks the "Next" link at the end of each
// page until a page has none. Per page it reports:
//
// - the time from the click to the page being ready to click again;
// - where the Next link sat once scrolled into view: its end lines up at
//   the end of the content on every page (the pager follows the content, so
//   only its horizontal position is the same);
// - the Core Web Vitals of the visit (site/scripts/vitals.mjs): LCP, CLS
//   and INP, the walker's click on Next being the interaction.
//
// With --shots it saves a screenshot of every page and layers them into a
// heatmap of what stays the same and what changes (site/scripts/heatmap.mjs).
//
// Exits 1 on a loop, a dead Next link, a link that moved, any layout shift
// (CLS above 0, unless INTENDED_SHIFTS lists the page), or LCP or INP past
// "good" (2.5 s, 200 ms; web.dev/articles/vitals).
//
//   node site/scripts/walk.mjs [--url http://localhost:8000/3.0/]
//     [--width 1300] [--height 900] [--headed] [--motion]
//     [--shots] [--out <dir>] [--rare 0.1]
//
// --motion keeps the view transitions between pages (slower; reduced motion
// turns them off). --out is where the screenshots and the heatmap go (a
// temporary directory by default). The dev server must be running
// (npm run catalog:dev).

import {chromium} from 'playwright';
import {mkdirSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {parseArgs} from 'node:util';
import {buildHeatmap} from './heatmap.mjs';
import {collectVitals} from './vitals.mjs';

const {values: args} = parseArgs({
  options: {
    url: {type: 'string', default: 'http://localhost:8000/3.0/'},
    width: {type: 'string', default: '1300'},
    height: {type: 'string', default: '900'},
    headed: {type: 'boolean', default: false},
    motion: {type: 'boolean', default: false},
    shots: {type: 'boolean', default: false},
    out: {type: 'string', default: join(tmpdir(), 'catalog-walk')},
    rare: {type: 'string', default: '0.1'},
  },
});

// CLS: nothing moves that the reader didn't move (web.dev's "good" is 0.1).
const GOOD = {lcp: 2500, cls: 0, inp: 200};
/**
 * Pages whose layout shift is intended (a landing animation, content that
 * enters as it scrolls into view), by path, with why: their CLS is
 * reported, not a problem.
 */
const INTENDED_SHIFTS = new Map([
  // ['/3.0/some/page/', 'why the page moves on purpose'],
]);
// The spec shell's pager (specs/shell.cjs).
// Its Next link: the md-gb-button's own <a> (rel and href are the button's
// properties once the shell hydrates, so not attributes to select on).
const nextLink = (page) => page.locator('nav[aria-label="Previous and next pages"]').getByRole('link', {name: /^Next:/});
/**
 * A locator's box once it stays put for 100 ms (up to 3 s): late layout
 * (a demo frame reaching its height) can still move it after the page
 * loads. The shifts themselves count in the page's CLS.
 */
async function settledBox(locator) {
  let last = await locator.boundingBox();
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 100));
    const box = await locator.boundingBox();
    if (box && last && Math.abs(box.x - last.x) < 1 && Math.abs(box.y - last.y) < 1) return box;
    last = box;
  }
  return last;
}
const LAYOUT_CSS = `
  #page-content { visibility: hidden !important; }
  *, *::before, *::after { color: transparent !important; text-shadow: none !important; }
  /* Inherited into the components' shadow roots, which set their own color. */
  :root { -webkit-text-fill-color: transparent !important; }
  img, svg, video, canvas { visibility: hidden !important; }
`;
const shotsDir = join(args.out, `${args.width}x${args.height}`);
if (args.shots) {
  rmSync(shotsDir, {recursive: true, force: true});
  mkdirSync(join(shotsDir, 'page'), {recursive: true});
  mkdirSync(join(shotsDir, 'layout'), {recursive: true});
}

const browser = await chromium.launch({headless: !args.headed});
const page = await browser.newPage({
  viewport: {width: Number(args.width), height: Number(args.height)},
  reducedMotion: args.motion ? 'no-preference' : 'reduce',
});
await page.addInitScript(collectVitals);

const stops = [];
const shots = [];
const layoutShots = [];
const problems = [];
const seen = new Set();
const started = performance.now();

let t = performance.now();
await page.goto(args.url, {waitUntil: 'domcontentloaded'});
for (;;) {
  const url = new URL(page.url()).pathname;
  if (seen.has(url)) {
    problems.push(`loop: ${url} again`);
    break;
  }
  seen.add(url);
  // Arrived once the view transition into the page has finished: while it
  // runs, the transition's pseudo-elements take the clicks.
  await page.waitForFunction(() => !document.documentElement.matches(':active-view-transition'), null, {polling: 16});
  const next = nextLink(page);
  // The pager is at the end of the content: scroll it into view first.
  if (await next.count()) await next.scrollIntoViewIfNeeded();
  const box = (await next.count()) ? await settledBox(next) : null;
  stops.push({url, ms: Math.round(performance.now() - t), box});
  // The pointer rests on the link's arrow, as a reader's would.
  const pointer = box ? {x: box.x + box.width - 12, y: box.y + box.height / 2} : null;
  if (args.shots) {
    await page.evaluate(() => document.fonts.ready);
    if (pointer) await page.mouse.move(pointer.x, pointer.y);
    const name = `${String(stops.length).padStart(3, '0')}${url.replace(/\/$/, '').replace(/\//g, '-') || '-home'}.png`;
    const shot = {animations: 'disabled', caret: 'hide'};
    await page.screenshot({...shot, path: join(shotsDir, 'page', name)});
    shots.push(join(shotsDir, 'page', name));
    // The layout alone: the page's content hidden and all text transparent,
    // leaving the boxes (backgrounds, borders, indicators, state layers).
    await page.evaluate((css) => {
      const style = document.createElement('style');
      style.id = 'catalog-walk-layout';
      style.textContent = css;
      document.head.append(style);
    }, LAYOUT_CSS);
    await page.screenshot({...shot, path: join(shotsDir, 'layout', name)});
    layoutShots.push(join(shotsDir, 'layout', name));
    await page.evaluate(() => document.getElementById('catalog-walk-layout')?.remove());
  }
  if (!pointer) break;
  t = performance.now();
  try {
    await Promise.all([
      page.waitForURL((u) => u.pathname !== url, {waitUntil: 'domcontentloaded', timeout: 15000}),
      page.mouse.click(pointer.x, pointer.y),
    ]);
  } catch (error) {
    problems.push(`${url}: Next didn't navigate (${error.message.split('\n')[0]})`);
    break;
  }
}
const total = Math.round(performance.now() - started);

// The vitals of the pages left (saved on pagehide) and of the last one.
const vitals = new Map(
  (await page.evaluate(() => [...JSON.parse(sessionStorage.getItem('catalog-walk-vitals') || '[]'), window.__walkVitals?.()]))
    .filter(Boolean)
    .map((v) => [v.url, v]),
);

// Where the Next link's end (its arrow) sits across the page: the same on
// every page (its height follows the content).
const endOf = (box) => `x ${Math.round(box.x + box.width)}`;
const ends = stops.filter((s) => s.box).map((s) => endOf(s.box));
const usual = [...ends.reduce((m, e) => m.set(e, (m.get(e) ?? 0) + 1), new Map())].sort((a, b) => b[1] - a[1])[0]?.[0];

const flag = (value, limit) => (value != null && value > limit ? '!' : ' ');
console.log('  #  ready ms  next at      LCP ms     CLS  INP ms  page');
for (const [i, s] of stops.entries()) {
  const end = s.box ? endOf(s.box) : 'end';
  const moved = s.box && end !== usual;
  if (moved) problems.push(`${s.url}: Next link at ${end}, elsewhere ${usual}`);
  const v = {...vitals.get(s.url)};
  // Event Timing reports interactions of 16 ms and longer only; the click
  // on Next happened, so no entry means a shorter one.
  if (v.inp == null && s.box) v.inp = '<16';
  for (const key of ['lcp', 'cls', 'inp']) {
    if (key === 'cls' && INTENDED_SHIFTS.has(s.url)) continue;
    if (v[key] != null && v[key] > GOOD[key]) problems.push(`${s.url}: ${key.toUpperCase()} ${v[key]} (good: ${GOOD[key]})`);
  }
  console.log(
    `${String(i + 1).padStart(3)}  ${String(s.ms).padStart(8)}  ${end.padEnd(9)}${moved ? '!' : ' '}  ` +
      `${String(v.lcp ?? '-').padStart(6)}${flag(v.lcp, GOOD.lcp)} ${String(v.cls ?? '-').padStart(6)}${flag(v.cls, GOOD.cls)} ` +
      `${String(v.inp ?? '-').padStart(6)}${flag(v.inp, GOOD.inp)} ${s.url}`,
  );
}

// The worst page for each vital, with what it measured.
const all = [...vitals.values()];
const worst = (key) => all.filter((v) => v[key] != null).sort((a, b) => b[key] - a[key])[0];
console.log(`\n${stops.length} pages in ${total} ms (${args.motion ? 'with' : 'without'} view transitions); Next link end at ${usual ?? '-'}`);
const lcp = worst('lcp');
const cls = worst('cls');
const inp = worst('inp');
if (lcp) console.log(`worst LCP ${lcp.lcp} ms   ${lcp.url}  ${lcp.lcpElement}`);
if (cls) console.log(`worst CLS ${cls.cls}   ${cls.url}  ${cls.clsSources.join(', ')}`);
if (inp) console.log(`worst INP ${inp.inp} ms   ${inp.url}  ${inp.inpEvent}`);
console.log(`INP: ${all.length - 1 - all.filter((v) => v.inp != null).length} clicks under 16 ms (not reported by the browser)`);

await browser.close();

if (args.shots) {
  console.log('\nwhole pages:');
  buildHeatmap(shots, join(shotsDir, 'heatmap-page'), {rare: Number(args.rare)});
  console.log('\nlayout only (content hidden, text transparent):');
  buildHeatmap(layoutShots, join(shotsDir, 'heatmap-layout'), {rare: Number(args.rare), tolerance: 2});
}

for (const p of problems) console.log(`problem: ${p}`);
process.exitCode = problems.length ? 1 : 0;
