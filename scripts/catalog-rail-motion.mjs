/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Toggles the /3.0/ navigation rail with its menu button, again and again,
// and records every animation frame of each transition, to check its
// responsiveness (INP), its stability (CLS) and its motion against the M3
// spec:
//
// - navigation-rail.md: collapsed and expanded rails "match visually and can
//   transition into each other"; the menu button changes them.
// - motion transitions.md, Applying transitions: no jarring jump cuts,
//   stable layouts, persistent elements, fades (not pops); under reduced
//   motion, subtle fades instead of movement.
// - motion overview.md: spatial springs for size and position (they may
//   overshoot), effects springs for opacity (no overshoot).
//
// Scenarios: the standard rail (expanded beside the content, 1300px), the
// modal rail (over the content, 700px), and both under reduced motion. Each
// toggle is a real click on the menu button. In the standard rail it also
// closes and opens the current section's pages (its chevron) and a group's
// (its toggle), checked against motion transitions.md, Enter and exit
// (expand and collapse along the y axis, clean fades): the toggle stays put,
// leaving pages fade out before the rows below move up, rows make room
// before entering pages fade in, no jump cut. Per frame: the rail column's
// width, the rail's own width, the content pane, the menu button, every
// section's icon, the active pill, the labels, the scrim, and the gaps
// between frames.
//
//   node scripts/catalog-rail-motion.mjs [--url http://localhost:8000/3.0/components/]
//     [--cycles 3] [--frames] [--shots] [--out <dir>] [--only modal]
//
// Motion is checked on toggles sampled every frame; smoothness (frame gaps,
// long animation frames), INP and layout shifts on separate toggles with
// only a light frame timer, so the sampling doesn't slow what it measures.
// --only runs the scenarios whose name contains the text.
// --frames prints every frame of the first expand and collapse. --shots
// saves the real frames of one expand and one collapse (CDP screencast) to
// --out. Exits 1 when an expectation fails. The dev server must be running.

import {chromium} from 'playwright';
import {mkdirSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {parseArgs} from 'node:util';

const {values: args} = parseArgs({
  options: {
    url: {type: 'string', default: 'http://localhost:8000/3.0/components/'},
    cycles: {type: 'string', default: '3'},
    frames: {type: 'boolean', default: false},
    shots: {type: 'boolean', default: false},
    out: {type: 'string', default: join(tmpdir(), 'catalog-rail-motion')},
    only: {type: 'string'},
  },
});

const SCENARIOS = [
  {name: 'standard', width: 1300, reducedMotion: 'no-preference'},
  {name: 'modal', width: 700, reducedMotion: 'no-preference'},
  {name: 'standard, reduced motion', width: 1300, reducedMotion: 'reduce'},
  {name: 'modal, reduced motion', width: 700, reducedMotion: 'reduce'},
];
const GOOD_INP = 200;

// --- In the page ---------------------------------------------------------------

// Installed before the page's scripts: event timing, layout shifts and long
// animation frames, with their times, for the whole visit.
function observe() {
  window.__perf = {events: [], shifts: [], loafs: []};
  const watch = (type, fn, extra = {}) => {
    try {
      new PerformanceObserver((list) => list.getEntries().forEach(fn)).observe({type, buffered: true, ...extra});
    } catch {}
  };
  watch('event', (e) => {
    if (e.interactionId) window.__perf.events.push({t: e.startTime, name: e.name, duration: e.duration, processing: e.processingEnd - e.processingStart, delay: e.processingStart - e.startTime});
  }, {durationThreshold: 16});
  watch('layout-shift', (e) => window.__perf.shifts.push({t: e.startTime, value: e.value, input: e.hadRecentInput}));
  watch('long-animation-frame', (e) => window.__perf.loafs.push({t: e.startTime, duration: e.duration, blocking: e.blockingDuration}));
}

// Samples every frame from now until the rail has been still for 20
// frames (or 2s). Resolves with the frames.
function sampleFrames() {
  const rail = document.getElementById('gb-rail');
  const area = document.querySelector('.gb-rail-area');
  const pane = document.getElementById('gb-content-pane');
  const inner = rail.shadowRoot.querySelector('.nav-rail');
  const menu = rail.shadowRoot.querySelector('.nav-rail-menu-button');
  const sections = [...rail.querySelectorAll('md-gb-nav-rail-item[data-section]')];
  const center = (el) => {
    const r = el.getBoundingClientRect();
    return [Math.round((r.left + r.width / 2) * 10) / 10, Math.round((r.top + r.height / 2) * 10) / 10];
  };
  const frames = [];
  const t0 = performance.now();
  // The active destination before the click (sampling starts just before
  // it): on a page in an open section, expanding moves it from the section
  // to the page.
  const from = rail.querySelector('md-gb-nav-rail-item[selected]')?.getAttribute('href') ?? '';
  let still = 0;
  let last = '';
  return new Promise((resolve) => {
    const tick = (now) => {
      const selected = rail.querySelector('md-gb-nav-rail-item[selected]');
      const root = selected?.shadowRoot;
      const horizontal = root?.querySelector('.nav-rail-item')?.classList.contains('nav-rail-item-horizontal');
      const pill = root?.querySelector(horizontal ? '.nav-rail-item-content' : '.nav-rail-item-indicator');
      const scrim = rail.shadowRoot.querySelector('.nav-rail-scrim');
      const frame = {
        t: Math.round(now - t0),
        expanded: rail.expanded,
        from,
        selected: selected?.getAttribute('href') ?? '',
        column: Math.round(area.getBoundingClientRect().width * 10) / 10,
        rail: Math.round(inner.getBoundingClientRect().width * 10) / 10,
        paneX: Math.round(pane.getBoundingClientRect().left * 10) / 10,
        menu: center(menu),
        icons: sections.map((s) => center(s.shadowRoot.querySelector('.nav-rail-item-icon'))),
        pillInset: pill ? getComputedStyle(pill, '::before').inset : '',
        labels: sections.map((s) => Number(getComputedStyle(s.shadowRoot.querySelector('.nav-rail-item-label')).opacity)),
        scrim: scrim ? Number(getComputedStyle(scrim).opacity) : null,
        animations: rail.getAnimations({subtree: true}).length + sections.reduce((n, s) => n + s.shadowRoot.getAnimations().length, 0),
      };
      frames.push(frame);
      const key = JSON.stringify({...frame, t: 0});
      still = key === last ? still + 1 : 0;
      last = key;
      if ((still >= 20 && frame.t > 100) || frame.t > 2000) resolve(frames);
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

// Samples a disclosure in the expanded rail (a section's chevron or a group's
// toggle, window.__disclosure: the toggle, the pages it shows or hides, and
// the first row after them) every frame until it has been still for 20
// frames (or 2s).
function sampleDisclosure() {
  const {toggle, pages, below} = window.__disclosure;
  const list = document.getElementById('gb-rail').shadowRoot.querySelector('.nav-rail-items');
  const view = list.getBoundingClientRect();
  const inView = (r) => r.height > 0 && r.bottom > view.top && r.top < view.bottom;
  const frames = [];
  const t0 = performance.now();
  let still = 0;
  let last = '';
  return new Promise((resolve) => {
    const tick = (now) => {
      const shown = pages.filter((el) => inView(el.getBoundingClientRect()));
      const frame = {
        t: Math.round(now - t0),
        toggle: Math.round(toggle.getBoundingClientRect().top * 10) / 10,
        // The first row after the pages, while it's in view (out of view,
        // nothing animates it).
        below: below && inView(below.getBoundingClientRect()) ? Math.round(below.getBoundingClientRect().top * 10) / 10 : null,
        // The pages in view, and how opaque they are on average (a hidden
        // page counts as transparent).
        shown: shown.length,
        opacity: shown.length ? shown.reduce((n, el) => n + Number(getComputedStyle(el).opacity), 0) / shown.length : 0,
        expanded: toggle.getAttribute('aria-expanded'),
      };
      frames.push(frame);
      const key = JSON.stringify({...frame, t: 0});
      still = key === last ? still + 1 : 0;
      last = key;
      if ((still >= 20 && frame.t > 100) || frame.t > 2000) resolve(frames);
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

// --- Checks ----------------------------------------------------------------------

const max = (xs) => xs.reduce((a, b) => Math.max(a, b), -Infinity);
const dist = ([x1, y1], [x2, y2]) => Math.hypot(x1 - x2, y1 - y2);

/** The expectations for one transition: [label, ok, detail]. */
function check(frames, {modal, reduced, perf, clickAt, endAt}) {
  const results = [];
  const add = (label, ok, detail) => results.push({label, ok, detail});
  const first = frames[0];
  const end = frames.at(-1);
  // When it settled: the last frame whose geometry, fades or pill differ
  // from the end (not the count of running animations: some finish
  // invisibly later).
  const visible = (f) => JSON.stringify({...f, t: 0, animations: 0});
  const moving = frames.filter((f) => visible(f) !== visible(end));
  const settle = moving.length ? moving.at(-1).t : 0;

  // The menu button doesn't move (it changes the rail; the eye stays on it).
  const menuDrift = max(frames.map((f) => dist(f.menu, first.menu)));
  add('menu button stays put', menuDrift <= 1, `drift ${menuDrift.toFixed(1)}px`);

  // The first destination's icon is persistent (it has nothing beside it to
  // move it): where it starts is where it ends, and it doesn't wander.
  const iconDrift = max(frames.map((f) => dist(f.icons[0], first.icons[0])));
  add('first icon stays put', iconDrift <= 1, `drift ${iconDrift.toFixed(1)}px`);

  // The column (standard) or the rail (modal) changes size continuously:
  // no frame does most of the change at once (a jump cut), unless motion is
  // reduced, where the change may be immediate.
  const size = modal ? 'rail' : 'column';
  const total = Math.abs(end[size] - first[size]);
  const steps = frames.slice(1).map((f, i) => Math.abs(f[size] - frames[i][size]));
  const biggest = total ? max(steps) / total : 0;
  if (reduced) {
    add(`${size} width without movement`, true, `largest step ${(biggest * 100).toFixed(0)}% of ${total}px`);
  } else {
    add(`${size} width moves, no jump cut`, total === 0 || biggest <= 0.4, `largest frame step ${(biggest * 100).toFixed(0)}% of ${total}px`);
    // Spatial springs settle within their duration (slow ~570ms, here up to
    // 1s with the overshoot), and don't drag on.
    add('settles in 200-1000ms', !total || (settle >= 150 && settle <= 1000), `settled at ${settle}ms`);
  }

  // Stable layout (standard): the rail takes its new width at once and the
  // column reveals or clips it, so its contents never reflow mid-way.
  if (!modal) {
    const reflow = frames.slice(1).filter((f) => f.rail !== end.rail).length;
    add('rail never reflows (clipped)', reflow === 0, `${reflow} frames at another width`);
  }

  // Labels fade in where they're laid out anew: some frames in between,
  // not a pop (also under reduced motion: "subtle fades").
  const fading = frames.filter((f) => f.labels.some((o) => o > 0.02 && o < 0.98)).length;
  add('labels fade (no pop)', fading >= 2, `${fading} frames mid-fade`);

  // The active pill stretches between its two shapes (spatial), unless
  // motion is reduced. When the active destination changes (the section
  // collapsed, its page expanded), the new one wasn't shown before: it
  // fades in where it is, like the other pages.
  if (!reduced) {
    const stretching = frames.filter((f) => f.pillInset && f.pillInset !== '0px').length;
    if (end.selected !== first.from) {
      add('active pill stretches', true, `active destination changes (${first.from} -> ${end.selected})`);
    } else {
      add('active pill stretches', stretching >= 2, `${stretching} frames mid-stretch`);
    }
  }

  // The modal rail's scrim fades (effects), not pops.
  if (modal && end.scrim !== null) {
    const scrimFading = frames.filter((f) => f.scrim !== null && f.scrim > 0.02 && f.scrim < 0.98).length;
    add('scrim fades in', reduced || scrimFading >= 2, `${scrimFading} frames mid-fade`);
  }

  return {results, settle};
}

/**
 * The expectations for one disclosure (shell.ts disclose; motion
 * transitions.md, Enter and exit: expand and collapse along the y axis,
 * clean fades): the toggle stays where it was clicked; pages that leave fade
 * out before the rows below move up into their space; rows make room before
 * pages that enter fade in; the rows move on a spring, not a jump cut, and
 * settle. Under reduced motion only the fades remain.
 */
function checkDisclosure(frames, {reduced, closing}) {
  const results = [];
  const add = (label, ok, detail) => results.push({label, ok, detail});
  const first = frames[0];
  const end = frames.at(-1);
  const visible = (f) => JSON.stringify({...f, t: 0});
  const moving = frames.filter((f) => visible(f) !== visible(end));
  const settle = moving.length ? moving.at(-1).t : 0;

  const drift = max(frames.map((f) => Math.abs(f.toggle - first.toggle)));
  add('toggle stays put', drift <= 1, `drift ${drift.toFixed(1)}px`);
  add('toggle state flips', end.expanded === (closing ? 'false' : 'true'), `aria-expanded ${end.expanded} after ${closing ? 'closing' : 'opening'}`);

  // The pages fade (effects), not pop, when any are in view.
  const fading = frames.filter((f) => f.shown && f.opacity > 0.02 && f.opacity < 0.98).length;
  const anyShown = (closing ? first : end).shown > 0;
  add(`pages fade ${closing ? 'out' : 'in'} (no pop)`, !anyShown || fading >= 2, `${fading} frames mid-fade`);

  // The first row below the pages: where it moves, when it starts, and how.
  const rowMoved = (f) => first.below !== null && f.below !== null && Math.abs(f.below - first.below) > 1;
  const startMove = frames.find(rowMoved);
  const total = first.below === null || end.below === null ? 0 : Math.abs(end.below - first.below);
  if (closing) {
    // Clean fade: the pages are gone before the rows close the gap.
    const atMove = startMove ? startMove.opacity : 0;
    add('fade-out before rows move', !startMove || !startMove.shown || atMove <= 0.05, startMove ? `pages at opacity ${atMove.toFixed(2)} when the rows start at +${startMove.t}ms` : 'rows below out of view');
  } else if (!reduced) {
    // Room first: the pages appear only once the rows have started moving.
    const firstFade = frames.find((f) => f.shown && f.opacity > 0.02);
    add('rows make room before fade-in', !firstFade || !startMove || firstFade.t >= startMove.t, firstFade && startMove ? `rows start at +${startMove.t}ms, pages at +${firstFade.t}ms` : 'nothing in view to order');
  }
  if (reduced) {
    add('rows without movement', true, `moved ${total}px`);
  } else if (total > 0) {
    const steps = frames.slice(1).map((f, i) => (f.below === null || frames[i].below === null ? 0 : Math.abs(f.below - frames[i].below)));
    const biggest = max(steps) / total;
    add('rows move, no jump cut', biggest <= 0.4, `largest frame step ${(biggest * 100).toFixed(0)}% of ${total}px`);
  }
  add('settles in <= 1000ms', settle <= 1000, `settled at ${settle}ms`);
  return {results, settle};
}

/**
 * Smoothness and responsiveness of one transition, from a run with only a
 * light frame timer (the motion sampler's style reads would slow the frames
 * it measures).
 */
function checkPerf(times, {perf, clickAt, endAt}) {
  const results = [];
  const add = (label, ok, detail) => results.push({label, ok, detail});
  // Smooth frames: no gap between frames over 50ms (3 dropped frames at
  // 60Hz), no long animation frame over 50ms.
  const gaps = times.slice(1).map((t, i) => Math.round(t - times[i]));
  const worstGap = max(gaps);
  const loafs = perf.loafs.filter((l) => l.t >= clickAt - 5 && l.t <= endAt && l.duration > 50);
  add('frames on time', worstGap <= 50 && loafs.length === 0, `worst gap ${worstGap}ms, ${gaps.filter((g) => g > 25).length} over 25ms, ${loafs.length} long frames${loafs.length ? ` (${loafs.map((l) => `${Math.round(l.duration)}ms at +${Math.round(l.t - clickAt)}`).join(', ')})` : ''}`);

  // Responsiveness: the click's interaction, input to next paint.
  const events = perf.events.filter((e) => e.t >= clickAt - 5 && e.t <= endAt);
  const inp = events.length ? max(events.map((e) => e.duration)) : null;
  const worst = events.find((e) => e.duration === inp);
  add(`INP <= ${GOOD_INP}ms`, inp === null || inp <= GOOD_INP, inp === null ? 'under 16ms' : `${Math.round(inp)}ms (${worst.name}: delay ${Math.round(worst.delay)}, processing ${Math.round(worst.processing)})`);

  // Stability: no layout shift the user didn't cause. The content pane
  // moving after the click is input-driven (excluded from CLS); anything
  // else counts.
  const shifts = perf.shifts.filter((s) => s.t >= clickAt - 5 && s.t <= endAt);
  const unexpected = shifts.filter((s) => !s.input).reduce((a, s) => a + s.value, 0);
  const caused = shifts.filter((s) => s.input).reduce((a, s) => a + s.value, 0);
  add('no unexpected layout shift', unexpected < 0.001, `CLS ${unexpected.toFixed(4)} (input-driven ${caused.toFixed(3)}, excluded)`);

  return {results};
}

// The light frame timer: frame times for a second.
function paceFrames() {
  const times = [];
  return new Promise((resolve) => {
    const tick = (now) => {
      times.push(now);
      if (now - times[0] < 1000) requestAnimationFrame(tick);
      else resolve(times);
    };
    requestAnimationFrame(tick);
  });
}

function printFrames(label, frames) {
  console.log(`\n  frames: ${label}`);
  console.log('     t  column    rail   paneX  menu         icon[0]       labels[0]  pill                     scrim  anims');
  for (const f of frames) {
    console.log(
      `  ${String(f.t).padStart(4)}  ${String(f.column).padStart(6)}  ${String(f.rail).padStart(6)}  ${String(f.paneX).padStart(6)}  ${f.menu.join(',').padEnd(11)}  ${f.icons[0].join(',').padEnd(12)}  ${f.labels[0].toFixed(2).padStart(9)}  ${(f.pillInset || '-').slice(0, 23).padEnd(23)}  ${f.scrim === null ? '    -' : f.scrim.toFixed(2).padStart(5)}  ${f.animations}`,
    );
  }
}

function printDisclosure(label, frames) {
  console.log(`\n  frames: ${label}`);
  console.log('     t  toggle   below  shown  opacity  expanded');
  for (const f of frames) {
    console.log(`  ${String(f.t).padStart(4)}  ${String(f.toggle).padStart(6)}  ${String(f.below ?? '-').padStart(6)}  ${String(f.shown).padStart(5)}  ${f.opacity.toFixed(2).padStart(7)}  ${f.expanded}`);
  }
}

// --- Run ---------------------------------------------------------------------------

const browser = await chromium.launch();
let failed = 0;
const cycles = Number(args.cycles);
if (args.shots) mkdirSync(args.out, {recursive: true});

/**
 * Clicks the menu button once, with `collect` running in the page from just
 * before the click; resolves with what it collected and the timing data.
 */
async function toggleOnce(context, page, collect, {shots = false} = {}) {
  const before = await page.evaluate(() => document.getElementById('gb-rail').expanded);
  const box = await page.evaluate(() => {
    const r = document.getElementById('gb-rail').shadowRoot.querySelector('.nav-rail-menu-button').getBoundingClientRect();
    return {x: r.left + r.width / 2, y: r.top + r.height / 2};
  });
  // Filmstrip (real frames, CDP screencast).
  let cdp = null;
  const pngs = [];
  if (shots) {
    cdp = await context.newCDPSession(page);
    cdp.on('Page.screencastFrame', (frame) => {
      pngs.push(frame);
      cdp.send('Page.screencastFrameAck', {sessionId: frame.sessionId}).catch(() => {});
    });
    await cdp.send('Page.startScreencast', {format: 'png', everyNthFrame: 1, maxWidth: 520, maxHeight: 360});
  }
  await page.evaluate((collect) => {
    window.__clickAt = performance.now();
    window.__collected = null;
    window[collect]().then((data) => (window.__collected = data));
  }, collect);
  await page.mouse.click(box.x, box.y);
  await page.waitForFunction(() => window.__collected, null, {timeout: 5000});
  const result = await page.evaluate(() => ({
    data: window.__collected,
    clickAt: window.__clickAt,
    endAt: performance.now(),
    perf: window.__perf,
  }));
  const label = before ? 'collapse' : 'expand';
  if (cdp) {
    await cdp.send('Page.stopScreencast');
    const dir = join(args.out, label);
    mkdirSync(dir, {recursive: true});
    pngs.forEach((s, n) => writeFileSync(join(dir, `${String(n).padStart(3, '0')}.png`), Buffer.from(s.data, 'base64')));
    console.log(`  ${pngs.length} frames of the ${label}: ${dir}`);
    await cdp.detach();
  }
  await page.waitForTimeout(250);
  return {...result, label};
}

/**
 * Clicks a disclosure toggle in the expanded rail once (`which`: the current
 * section's chevron or the first group's toggle), with `collect` running in
 * the page from just before the click.
 */
async function discloseOnce(page, which, collect) {
  const box = await page.evaluate((which) => {
    const rail = document.getElementById('gb-rail');
    const toggle =
      which === 'section'
        ? rail.querySelector('[data-section-toggle][data-default-open="true"]')
        : // Not the current page's group, which stays open.
          rail.querySelector('.gb-rail-group[data-group-toggle]:not([hidden], [data-current])');
    if (!toggle) return null;
    const pages =
      which === 'section'
        ? [...rail.querySelectorAll(`[data-in-section="${toggle.dataset.sectionToggle}"]`)]
        : [...rail.querySelectorAll(`[data-group="${toggle.dataset.groupToggle}"]`)];
    // The first row after the pages that stays (a group toggle or a section).
    const kids = [...rail.children];
    const after = kids.slice(kids.indexOf(pages.at(-1) ?? toggle) + 1);
    const below = after.find((el) => !pages.includes(el) && !el.hidden && el.localName !== 'script') ?? null;
    window.__disclosure = {toggle, pages, below};
    // In view, its pages and the rows below too where they fit. (Not at the
    // top of the list: closing the last section there shortens the list,
    // and the browser clamps its scroll.)
    const list = rail.shadowRoot.querySelector('.nav-rail-items').getBoundingClientRect();
    const at = toggle.getBoundingClientRect();
    if (at.top < list.top || at.bottom > list.bottom - 160) toggle.scrollIntoView({block: 'center'});
    const r = toggle.getBoundingClientRect();
    return {x: r.left + r.width / 2, y: r.top + r.height / 2, open: toggle.getAttribute('aria-expanded') === 'true'};
  }, which);
  if (!box) return null;
  await page.waitForTimeout(100);
  await page.evaluate((collect) => {
    window.__clickAt = performance.now();
    window.__collected = null;
    window[collect]().then((data) => (window.__collected = data));
  }, collect);
  await page.mouse.click(box.x, box.y);
  await page.waitForFunction(() => window.__collected, null, {timeout: 5000});
  const result = await page.evaluate(() => ({
    data: window.__collected,
    clickAt: window.__clickAt,
    endAt: performance.now(),
    perf: window.__perf,
  }));
  await page.waitForTimeout(250);
  return {...result, label: `${which} ${box.open ? 'close' : 'open'}`};
}

/** One line per expectation: how many transitions met it, and the worst. */
function report(rows) {
  const labels = [...new Set(rows.flatMap((r) => r.results.map((x) => x.label)))];
  for (const label of labels) {
    const all = rows.flatMap((r) => r.results.filter((x) => x.label === label).map((x) => ({...x, kind: r.label})));
    const bad = all.filter((x) => !x.ok);
    failed += bad.length;
    const shown = bad[0] ?? all.at(-1);
    console.log(`  ${bad.length ? 'FAIL' : 'ok  '}  ${label.padEnd(30)} ${all.length - bad.length}/${all.length}  ${shown.kind}: ${shown.detail}`);
  }
}

const only = args.only?.toLowerCase();
for (const scenario of SCENARIOS.filter((s) => !only || s.name.includes(only))) {
  const context = await browser.newContext({
    viewport: {width: scenario.width, height: 900},
    reducedMotion: scenario.reducedMotion,
    colorScheme: 'dark',
  });
  await context.addInitScript(observe);
  await context.addInitScript(
    `window.sampleFrames = ${sampleFrames.toString()}; window.sampleDisclosure = ${sampleDisclosure.toString()}; window.paceFrames = ${paceFrames.toString()};`,
  );
  // Start each scenario from the defaults (expanded from 840px).
  await context.addInitScript(() => {
    try {
      if (!sessionStorage.getItem('rail-motion')) {
        localStorage.removeItem('gb-rail');
        sessionStorage.setItem('rail-motion', '1');
      }
    } catch {}
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(args.url, {waitUntil: 'networkidle'});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  const modal = scenario.width < 840;
  const reduced = scenario.reducedMotion === 'reduce';
  console.log(`\n${scenario.name} (${scenario.width}px): ${new URL(args.url).pathname}`);

  // Motion: every frame sampled.
  const rows = [];
  for (let i = 0; i < cycles * 2; i++) {
    const shots = args.shots && i < 2 && scenario === SCENARIOS[0];
    const run = await toggleOnce(context, page, 'sampleFrames', {shots});
    if (args.frames && i < 2) printFrames(run.label, run.data);
    rows.push({label: run.label, ...check(run.data, {modal, reduced})});
  }
  // Smoothness and responsiveness: a light frame timer only.
  for (let i = 0; i < cycles * 2; i++) {
    const run = await toggleOnce(context, page, 'paceFrames');
    rows.push({label: run.label, ...checkPerf(run.data, run)});
  }
  report(rows);

  // Disclosures in the expanded standard rail: the current section's pages
  // and a group's, closed and opened again.
  if (!modal) {
    const expandedNow = await page.evaluate(() => document.getElementById('gb-rail').expanded);
    if (!expandedNow) await toggleOnce(context, page, 'paceFrames');
    console.log(`  disclosures:`);
    const disclosures = [];
    for (const which of ['section', 'group']) {
      for (let i = 0; i < cycles * 2; i++) {
        const run = await discloseOnce(page, which, 'sampleDisclosure');
        if (!run) break;
        if (args.frames && i < 2) printDisclosure(run.label, run.data);
        disclosures.push({label: run.label, ...checkDisclosure(run.data, {reduced, closing: run.label.endsWith('close')})});
      }
      for (let i = 0; i < cycles * 2; i++) {
        const run = await discloseOnce(page, which, 'paceFrames');
        if (!run) break;
        disclosures.push({label: run.label, ...checkPerf(run.data, run)});
      }
    }
    report(disclosures);
  }
  if (errors.length) {
    failed++;
    console.log(`  FAIL  page errors: ${errors.join(' | ')}`);
  }
  await context.close();
}
await browser.close();
console.log(failed ? `\n${failed} failed` : '\nall expectations met');
process.exitCode = failed ? 1 : 0;
