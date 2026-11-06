#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Generates the M3 Expressive loading indicator animation as pure CSS from
 * the reference implementation (Jetpack Compose `LoadingIndicator.kt`), the
 * ported shape library and the spec tokens.
 *
 * `Morph` interpolates matched cubics linearly, and CSS interpolates SVG
 * `d: path()` linearly between paths with the same commands, so each morph is
 * exactly two keyframes with the morph spring as the keyframe easing.
 *
 * Timing, springs and shape sequences are read from LoadingIndicator.kt so an
 * upstream change flows through on the next run.
 *
 *   node scripts/m3/gen-loading-indicator.mjs
 *
 * Writes:
 *   labs/gb/components/loadingindicator/_loading-indicator-motion.scss
 *   labs/gb/components/loadingindicator/loading-indicator-paths.ts
 */

import {readFile, writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {Morph} from './shapes/graphics-shapes.mjs';
import {MaterialShapes} from './shapes/material-shapes.mjs';
import {SpecDb} from './spec-db.mjs';
import {settleTime, springEasing} from './spring.mjs';

const OUT = 'labs/gb/components/loadingindicator';
const SOURCE = '.m3-specs/compose/material3/commonMain/androidx/compose/material3/LoadingIndicator.kt';

const kt = await readFile(SOURCE, 'utf8');
const db = await SpecDb.load();

// --- Read the reference implementation -------------------------------------
const constant = (name) => {
  const m = kt.match(new RegExp(`${name}\\s*=\\s*([\\d.]+)`));
  if (!m) throw new Error(`${name} not found in LoadingIndicator.kt`);
  return Number(m[1]);
};
const INTERVAL = constant('MorphIntervalMillis') / 1000;
const SPIN = constant('GlobalRotationDurationMillis') / 1000;
const springMatch = kt.match(
  /val morphAnimationSpec\s*=\s*spring\(dampingRatio = ([\d.]+)f, stiffness = ([\d.]+)f, visibilityThreshold = ([\d.]+)f\)/,
);
if (!springMatch) throw new Error('morph spring not found in LoadingIndicator.kt');
const [DAMPING, STIFFNESS, THRESHOLD] = springMatch.slice(1).map(Number);
// Compose rotates `progress * 90` per morph, from a quarter-turn start.
if (!/rotate\(progress \* 90 \+ morphRotationTargetAngle/.test(kt)) {
  throw new Error('indeterminate rotation changed in LoadingIndicator.kt; re-check the port');
}
if (!/val rotation = -progressValue \* 180/.test(kt)) {
  throw new Error('determinate rotation changed in LoadingIndicator.kt; re-check the port');
}

/** Parses `public val <name>: List<RoundedPolygon> = listOf(...)`. */
function polygonList(name) {
  const start = kt.indexOf(`val ${name}`);
  const body = kt.slice(kt.indexOf('listOf(', start), kt.indexOf('\n        )', start));
  return [...body.matchAll(/MaterialShapes\.(\w+)(\.transformed\(Matrix\(\)\.apply \{ rotateZ\(([\d.]+)f \/ ([\d.]+)\) \}\))?/g)].map(
    ([, shape, , num, den]) => {
      const polygon = MaterialShapes[shape];
      if (!polygon) throw new Error(`Unknown MaterialShapes.${shape}`);
      return {name: shape, polygon: num ? polygon.transformed(rotateZ(Number(num) / Number(den))) : polygon};
    },
  );
}
const INDETERMINATE = polygonList('IndeterminateIndicatorPolygons');
const DETERMINATE = polygonList('DeterminateIndicatorPolygons');

// Compose also multiplies by ActiveIndicatorScale (active size / container
// size); on the web the SVG is sized with --active-indicator-size instead, so
// that spec token stays a real, overridable CSS property.

// --- Geometry (LoadingIndicator.kt calculateScaleFactor / processPath) ------
function rotateZ(degrees) {
  const r = (degrees * Math.PI) / 180;
  const [s, c] = [Math.sin(r), Math.cos(r)];
  return (x, y) => [c * x - s * y, s * x + c * y];
}

function scaleFactor(polygons) {
  let factor = 1;
  for (const {polygon} of polygons) {
    const b = polygon.calculateBounds();
    const m = polygon.calculateMaxBounds();
    factor = Math.min(factor, Math.max((b[2] - b[0]) / (m[2] - m[0]), (b[3] - b[1]) / (m[3] - m[1])));
  }
  return factor;
}

/** Cubics -> SVG path in a 0..100 box, scaled by `scale` and centered. */
function svgPath(cubics, scale) {
  let [minX, minY, maxX, maxY] = [Infinity, Infinity, -Infinity, -Infinity];
  for (const c of cubics) {
    for (let i = 0; i < 8; i += 2) {
      minX = Math.min(minX, c.points[i]);
      maxX = Math.max(maxX, c.points[i]);
      minY = Math.min(minY, c.points[i + 1]);
      maxY = Math.max(maxY, c.points[i + 1]);
    }
  }
  const [cx, cy] = [(minX + maxX) / 2, (minY + maxY) / 2];
  const n = (v) => String(Math.round(v * 10) / 10);
  const X = (x) => n((x - cx) * 100 * scale + 50);
  const Y = (y) => n((y - cy) * 100 * scale + 50);
  const parts = [`M${X(cubics[0].points[0])} ${Y(cubics[0].points[1])}`];
  for (const c of cubics) {
    const p = c.points;
    parts.push(`C${X(p[2])} ${Y(p[3])} ${X(p[4])} ${Y(p[5])} ${X(p[6])} ${Y(p[7])}`);
  }
  return parts.join('') + 'Z';
}

// --- Keyframes ---------------------------------------------------------------
const SETTLE = settleTime(DAMPING, STIFFNESS, THRESHOLD);
const EASING = springEasing(DAMPING, STIFFNESS, SETTLE, 0.005);
const pct = (t, total) => `${Math.round((t / total) * 1e6) / 1e4}%`;
const EPSILON = 0.001; // seconds: hold a shape until the next morph starts

// Morphs: one cycle through every shape, circularly (Compose morphSequence).
const indeterminateScale = scaleFactor(INDETERMINATE);
const morphCycle = INDETERMINATE.length * INTERVAL;
const morphFrames = [];
INDETERMINATE.forEach(({polygon}, k) => {
  const next = INDETERMINATE[(k + 1) % INDETERMINATE.length].polygon;
  const morph = new Morph(polygon, next);
  const start = svgPath(morph.asCubics(0), indeterminateScale);
  const end = svgPath(morph.asCubics(1), indeterminateScale);
  const t = k * INTERVAL;
  morphFrames.push(`  ${pct(t, morphCycle)} { d: path('${start}'); animation-timing-function: ${EASING}; }`);
  morphFrames.push(`  ${pct(t + SETTLE, morphCycle)}, ${pct(t + INTERVAL - EPSILON, morphCycle)} { d: path('${end}'); animation-timing-function: linear; }`);
  if (k === INDETERMINATE.length - 1) morphFrames.push(`  100% { d: path('${end}'); }`);
});

// Rotation: +90deg per morph from a quarter turn. 4 shape cycles make a
// whole number of turns (4 * n * 90 is a multiple of 360), so it loops.
const rotationMorphs = 4 * INDETERMINATE.length;
const rotationCycle = rotationMorphs * INTERVAL;
const rotationFrames = [];
for (let k = 0; k < rotationMorphs; k++) {
  const t = k * INTERVAL;
  rotationFrames.push(`  ${pct(t, rotationCycle)} { rotate: ${90 + 90 * k}deg; animation-timing-function: ${EASING}; }`);
  rotationFrames.push(`  ${pct(t + SETTLE, rotationCycle)} { rotate: ${180 + 90 * k}deg; animation-timing-function: linear; }`);
}
rotationFrames.push(`  100% { rotate: ${90 + 90 * rotationMorphs}deg; }`);

// Determinate: a single morph scrubbed by progress.
const determinateScale = scaleFactor(DETERMINATE);
const determinateMorph = new Morph(DETERMINATE[0].polygon, DETERMINATE[1].polygon);
const determinateStart = svgPath(determinateMorph.asCubics(0), determinateScale);
const determinateEnd = svgPath(determinateMorph.asCubics(1), determinateScale);

const header = (comment) => `${comment}
${comment} Copyright 2026 Google LLC
${comment} SPDX-License-Identifier: Apache-2.0
${comment}
${comment} AUTOGENERATED. DO NOT MODIFY.
${comment} To modify this file, run: node scripts/m3/gen-loading-indicator.mjs
${comment} Sources: androidx.compose.material3 LoadingIndicator.kt + MaterialShapes
${comment} (Apache-2.0), m3.material.io ${db.version} (md.comp.loading-indicator).
`;

await writeFile(
  join(OUT, '_loading-indicator-motion.scss'),
  `${header('//')}
// Indeterminate: ${INDETERMINATE.map((s) => s.name).join(' -> ')}, a morph every
// ${INTERVAL * 1000}ms with spring(damping ${DAMPING}, stiffness ${STIFFNESS}) settling in
// ${Math.round(SETTLE * 1000)}ms, +90deg per morph, plus a linear turn every ${SPIN * 1000}ms.
// Determinate: ${DETERMINATE.map((s) => s.name).join(' -> ')}, rotating -180deg over progress.

$morph-duration: ${Math.round(morphCycle * 1000)}ms;
$rotation-duration: ${Math.round(rotationCycle * 1000)}ms;
$spin-duration: ${Math.round(SPIN * 1000)}ms;

@mixin keyframes {
  @keyframes md-loading-indicator-morph {
${morphFrames.join('\n')}
  }

  @keyframes md-loading-indicator-rotate {
${rotationFrames.join('\n')}
  }

  @keyframes md-loading-indicator-spin {
    from { rotate: 0deg; }
    to { rotate: 360deg; }
  }

  @keyframes md-loading-indicator-determinate {
    from { d: path('${determinateStart}'); }
    to { d: path('${determinateEnd}'); }
  }
}
`,
);

await writeFile(
  join(OUT, 'loading-indicator-paths.ts'),
  `${header('//')}
/**
 * Initial shapes, used as the SVG \`d\` attribute so the indicator renders a
 * shape where CSS \`d\` animation is not supported.
 */
export const INDETERMINATE_INITIAL_PATH =
  '${svgPath(new Morph(INDETERMINATE[0].polygon, INDETERMINATE[1].polygon).asCubics(0), indeterminateScale)}';

/** The determinate start shape (progress 0). */
export const DETERMINATE_INITIAL_PATH = '${determinateStart}';
`,
);

console.log(
  `Loading indicator: ${INDETERMINATE.length} indeterminate shapes, morph every ${INTERVAL * 1000}ms ` +
    `(spring settles in ${Math.round(SETTLE * 1000)}ms), ${DETERMINATE.length} determinate shapes.`,
);
