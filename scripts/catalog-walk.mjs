/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Walks the /3.0/ docs the way a reader pages through them: opens the home
// page in headless Chromium and clicks the top "Next" link until a page has
// none. Reports every stop, the time each navigation took, and where the
// Next link sat, flagging any page where it moved (paging through should
// need no mouse movement). Exits 1 on a loop, a failed navigation or a
// moved link.
//
//   node scripts/catalog-walk.mjs [--url http://localhost:8000/3.0/]
//                                 [--width 1300] [--height 900] [--headed]
//                                 [--motion]
//
// The dev server must be running (npm run catalog:dev).

import {chromium} from 'playwright';
import {parseArgs} from 'node:util';

const {values: args} = parseArgs({
  options: {
    url: {type: 'string', default: 'http://localhost:8000/3.0/'},
    width: {type: 'string', default: '1300'},
    height: {type: 'string', default: '900'},
    headed: {type: 'boolean', default: false},
    motion: {type: 'boolean', default: false},
  },
});

const NEXT = '.gb-pager-top .gb-pager-next';
const browser = await chromium.launch({headless: !args.headed});
const page = await browser.newPage({
  viewport: {width: Number(args.width), height: Number(args.height)},
  // No view transitions between pages (the site honors reduced motion), so
  // each page can be clicked as soon as it's there. --motion keeps them.
  reducedMotion: args.motion ? 'no-preference' : 'reduce',
});

const stops = [];
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
  const next = page.locator(NEXT);
  const box = (await next.count()) ? await next.boundingBox() : null;
  stops.push({url, ms: Math.round(performance.now() - t), box});
  if (!box) break;
  t = performance.now();
  try {
    await Promise.all([
      page.waitForURL((u) => u.pathname !== url, {waitUntil: 'domcontentloaded', timeout: 15000}),
      // The arrow at the link's end: where the pointer rests while paging.
      page.mouse.click(box.x + box.width - 12, box.y + box.height / 2),
    ]);
  } catch (error) {
    problems.push(`${url}: Next didn't navigate (${error.message.split('\n')[0]})`);
    break;
  }
}
const total = Math.round(performance.now() - started);

// Where the Next link's end (its arrow) sits: the same on every page.
const ends = stops.filter((s) => s.box).map((s) => `${Math.round(s.box.x + s.box.width)},${Math.round(s.box.y)}`);
const usual = [...ends.reduce((m, e) => m.set(e, (m.get(e) ?? 0) + 1), new Map())].sort((a, b) => b[1] - a[1])[0]?.[0];

for (const [i, s] of stops.entries()) {
  const end = s.box ? `${Math.round(s.box.x + s.box.width)},${Math.round(s.box.y)}` : 'end';
  const moved = s.box && end !== usual;
  if (moved) problems.push(`${s.url}: Next link at ${end}, elsewhere ${usual}`);
  console.log(`${String(i + 1).padStart(3)}  ${String(s.ms).padStart(5)} ms  ${end.padEnd(9)}${moved ? ' MOVED' : '      '}  ${s.url}`);
}
console.log(`\n${stops.length} pages in ${total} ms; Next link end at ${usual ?? '-'}`);
for (const p of problems) console.log(`problem: ${p}`);

await browser.close();
process.exitCode = problems.length ? 1 : 0;
