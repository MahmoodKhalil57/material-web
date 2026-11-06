#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Generates the M3 Expressive FAB menu motion from the reference
 * implementation (Jetpack Compose `FloatingActionButtonMenu.kt`) and the
 * spec's spring tokens.
 *
 * Compose drives the menu with springs from the motion scheme:
 * - the toggle FAB's `checkedProgress` (size, corner radius, colors, icon),
 * - each item's width and alpha, once it becomes visible,
 * - an `Animatable<Int>` that counts how many items are visible, bottom
 *   first when expanding and top first when collapsing (the stagger).
 *
 * The first two map to CSS transitions with the global spring easings. The
 * stagger is a spring over an integer, so each item starts when the spring
 * crosses its index: those crossing times become per-item transition delays,
 * expressed as fractions of the stagger spring's CSS duration.
 *
 * Spring choices, thresholds and the icon swap point are read from
 * FloatingActionButtonMenu.kt so an upstream change flows through on the next
 * run.
 *
 *   node scripts/m3/gen-fab-menu.mjs
 *
 * Writes:
 *   labs/gb/components/fabmenu/_fab-menu-motion.scss
 */

import {readFile, writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {SpecDb, WEB_CONTEXT} from './spec-db.mjs';
import {settleTime, springAt} from './spring.mjs';

const OUT = 'labs/gb/components/fabmenu';
const SOURCE = '.m3-specs/compose/material3/commonMain/androidx/compose/material3/FloatingActionButtonMenu.kt';
const DOCS = '.m3-specs/pages/components/fab-menu.md';
/** Must match gen-motion.mjs, which defines the CSS spring durations. */
const SETTLE = 0.002;

const kt = await readFile(SOURCE, 'utf8');
const docs = await readFile(DOCS, 'utf8').catch(() => '');
const db = await SpecDb.load();

// --- Read the reference implementation -------------------------------------
function match(regex, what) {
  const m = kt.match(regex);
  if (!m) throw new Error(`${what} not found in FloatingActionButtonMenu.kt; re-check the port`);
  return m;
}
/** `MotionSchemeKeyTokens.FastSpatial` -> `fast-spatial`. */
const springName = (key) => key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

const STAGGER = springName(match(/staggerAnimSpec: FiniteAnimationSpec<Int> = MotionSchemeKeyTokens\.(\w+)\.value\(\)/, 'stagger spring')[1]);
const STAGGER_THRESHOLD = Number(match(/visibilityThreshold = (\d+),/, 'stagger visibilityThreshold')[1]);
const ITEM_WIDTH = springName(match(/widthSpring: FiniteAnimationSpec<Float> = MotionSchemeKeyTokens\.(\w+)\.value\(\)/, 'item width spring')[1]);
const ITEM_ALPHA = springName(match(/alphaSpring: FiniteAnimationSpec<Float> = MotionSchemeKeyTokens\.(\w+)\.value\(\)/, 'item alpha spring')[1]);
const TOGGLE = springName(match(/checkedProgress =\s*animateFloatAsState\([\s\S]*?animationSpec = MotionSchemeKeyTokens\.(\w+)\.value\(\)/, 'toggle FAB spring')[1]);
// "an Icon that switches from an Add to a Close sign at 50% checked progress"
const ICON_SWAP = Number(match(/to a Close sign at (\d+)% checked progress/, 'icon swap point')[1]) / 100;

// Behavior the CSS port relies on; fail loudly if upstream changes it.
const assertions = [
  [/val itemVisible = index >= itemCount - \(staggerAnim\?\.value \?: 0\)/, 'bottom-first item visibility'],
  [/Animatable\(targetItemCount, Int\.VectorConverter\)/, 'integer stagger'],
  [/private val FabFinalCornerRadius = FabFinalSize\.div\(2\)/, 'close button corner = size / 2'],
  [/FabMenuItemMinWidth\s*get\(\) = FabMenuBaselineTokens\.ListItemContainerHeight/, 'item min width = item height'],
  [/horizontalAlignment: Alignment\.Horizontal = Alignment\.End/, 'end alignment by default'],
  [/contentAlignment: Alignment = Alignment\.TopEnd/, 'close button anchored top-end'],
  [/FabMenuPaddingBottom\s*get\(\) = FabMenuBaselineTokens\.CloseButtonBetweenSpace/, 'items above the button by close-button.between-space'],
  [/\(placeable\.width \* maxOf\(\(widthAnim\?\.value \?: 0f\), 0f\)\)\.roundToInt\(\)/, 'item width scaled by its spring'],
];
for (const [regex, what] of assertions) match(regex, what);

/** Docs: "FAB menus can contain 2–6 items". */
const MAX_ITEMS = Number(docs.match(/can contain \d+\s*[–-]\s*(\d+) items/)?.[1] ?? 6);

// --- Springs (spec tokens, expressive scheme, as gen-motion.mjs) -----------
const EXPRESSIVE = {...WEB_CONTEXT, 'motion.scheme': 'expressive'};
function springParams(name) {
  const get = (part) => {
    const token = `md.sys.motion.spring.${name.replace('-', '.')}.${part}`;
    const r = db.resolve(token, EXPRESSIVE);
    const v = r?.value?.numeric ?? r?.resolved?.numeric;
    if (v === undefined) throw new Error(`Missing ${token}`);
    return v;
  };
  return {damping: get('damping'), stiffness: get('stiffness')};
}

const stagger = springParams(STAGGER);
const staggerDuration = settleTime(stagger.damping, stagger.stiffness, SETTLE);
const s = (t) => springAt(t, stagger.damping, stagger.stiffness);
const DT = 0.0001;

/** First time the stagger spring reaches `level` (0..1). */
function reach(level, strict = false) {
  for (let t = 0; t < 10; t += DT) {
    const v = s(t);
    if (strict ? v > level : v >= level) return t;
  }
  return Infinity;
}

/**
 * When the spring is considered finished: Compose stops (and snaps to the
 * target) once it is within `visibilityThreshold` items of it.
 */
function finished(n) {
  const threshold = STAGGER_THRESHOLD / n;
  let last = 0;
  for (let t = 0; t < 10; t += DT) if (Math.abs(s(t) - 1) >= threshold) last = t;
  return last + DT;
}

/**
 * Item `i` (0 = top) of `n` is visible while `i >= n - value`, where `value`
 * is the spring position truncated to an Int (`Int.VectorConverter`).
 * Expanding animates value 0 -> n, so the bottom item appears first.
 * Collapsing animates n -> 0, so the top item disappears first.
 */
function delays(n) {
  const end = finished(n);
  const enter = [];
  const exit = [];
  for (let i = 0; i < n; i++) {
    const k = n - i; // value needed to show item i
    enter.push(Math.min(k === n ? end : reach(k / n), end));
    exit.push(i === 0 ? 0 : Math.min(reach(i / n, true), end));
  }
  return {enter, exit};
}

const ms = (t) => Math.round(t * 1000);
const fraction = (t) => Math.round((ms(t) / 1000 / staggerDuration) * 1000) / 1000;
const delayValue = (t) =>
  ms(t) === 0 ? '0s' : `calc(var(--md-sys-motion-spring-${STAGGER}-duration) * ${fraction(t)})`;

const rows = [];
for (let n = 1; n <= MAX_ITEMS; n++) rows.push({n, ...delays(n)});
const map = (key) =>
  rows.map(({n, [key]: list}) => `  ${n}: (${list.map(delayValue).join(', ')}${list.length === 1 ? ',' : ''}),`).join('\n');
const table = (key) => rows.map(({n, [key]: list}) => `//   ${n}: ${list.map(ms).join(', ')}`).join('\n');

// Icon swap: the toggle spring (0 -> 1, or 1 -> 0) crosses ICON_SWAP.
const toggle = springParams(TOGGLE);
const toggleDuration = settleTime(toggle.damping, toggle.stiffness, SETTLE);
let swap = 0;
while (springAt(swap, toggle.damping, toggle.stiffness) < ICON_SWAP) swap += DT;
const swapFraction = Math.round((swap / toggleDuration) * 1000) / 1000;

const scss = `//
// Copyright 2026 Google LLC
// SPDX-License-Identifier: Apache-2.0
//
// AUTOGENERATED. DO NOT MODIFY.
// To modify this file, run: node scripts/m3/gen-fab-menu.mjs
// Sources: androidx.compose.material3 FloatingActionButtonMenu.kt (Apache-2.0),
// m3.material.io ${db.version} (md.sys.motion.spring.*).

// Springs, as the global \`--md-sys-motion-spring-<name>\` easings and
// \`-duration\`s (MotionSchemeKeyTokens in FloatingActionButtonMenu.kt).
// Toggle FAB checkedProgress: size, corner radius, colors and icon.
$toggle-spring: '${TOGGLE}';
// Item width (revealed from the aligned edge) and alpha.
$item-width-spring: '${ITEM_WIDTH}';
$item-opacity-spring: '${ITEM_ALPHA}';

// The open icon switches to the close icon at ${ICON_SWAP * 100}% checked progress:
// ${ms(swap)}ms into the ${TOGGLE} spring (damping ${toggle.damping}, stiffness ${toggle.stiffness}).
$icon-swap-delay: calc(var(--md-sys-motion-spring-${TOGGLE}-duration) * ${swapFraction});

// Stagger: an Int spring (${STAGGER}: damping ${stagger.damping}, stiffness ${stagger.stiffness},
// visibilityThreshold ${STAGGER_THRESHOLD}) counts visible items, bottom first when expanding
// and top first when collapsing. Each item starts its width and alpha springs
// when the count reaches it.
$stagger-spring: '${STAGGER}';
// Delays per item count, top item first, in ms:
// enter
${table('enter')}
// exit
${table('exit')}
$max-items: ${MAX_ITEMS};
$enter-delays: (
${map('enter')}
);
$exit-delays: (
${map('exit')}
);
`;

await writeFile(join(OUT, '_fab-menu-motion.scss'), scss);
console.log(
  `FAB menu: toggle ${TOGGLE}, items ${ITEM_WIDTH}/${ITEM_ALPHA}, stagger ${STAGGER} ` +
    `(up to ${MAX_ITEMS} items, ${ms(rows.at(-1).enter[0])}ms to show all), icon swap at ${ms(swap)}ms.`,
);
