#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Generates the M3 Expressive (wavy) progress indicator motion and geometry
 * from the reference implementation (Jetpack Compose `ProgressIndicator.kt`,
 * `WavyProgressIndicator.kt` and its draw modifiers), the ported shape
 * library and the spec tokens.
 *
 * Every Compose animation is a keyframed scalar (line heads and tails, the
 * circular sweep and rotations, the wave phase). Each becomes a CSS
 * `@keyframes` on a registered custom property, and the styles derive the
 * drawing (dash lengths, track segments) from those scalars with the same
 * arithmetic as the Compose draw caches, so the browser evaluates it per
 * frame. Compose `keyframes { v at t using e }` applies `e` to the interval
 * that *starts* at `t`, which is also what a CSS keyframe's
 * `animation-timing-function` does, so keyframes map one to one.
 *
 * Wave shapes cannot be parametrized in CSS (`d: path()` takes no `var()`),
 * so they are generated here at the spec token sizes: the linear wave (as
 * Compose plots it, with quadratic curves) and the circular star polygon
 * (Compose `CircularShapes`, morphed from a circle). Amplitude changes
 * transition `d` between a flat and a wavy path with the same commands.
 *
 *   node scripts/m3/gen-progress.mjs
 *
 * Writes:
 *   components/progress/_progress-motion.scss
 *   components/progress/progress-paths.ts
 */

import {readFile, writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {circle, CornerRounding, Morph, star} from './shapes/graphics-shapes.mjs';
import {SpecDb} from './spec-db.mjs';

const OUT = 'components/progress';
const M3 = '.m3-specs/compose/material3/commonMain/androidx/compose/material3';
const SOURCES = {
  progress: `${M3}/ProgressIndicator.kt`,
  wavy: `${M3}/WavyProgressIndicator.kt`,
  linear: `${M3}/internal/LinearWavyProgressModifiers.kt`,
  circular: `${M3}/internal/CircularWavyProgressModifiers.kt`,
  motion: `${M3}/tokens/MotionTokens.kt`,
};
const kt = Object.fromEntries(
  await Promise.all(Object.entries(SOURCES).map(async ([k, p]) => [k, await readFile(p, 'utf8')])),
);
const db = await SpecDb.load();

// --- Reading helpers ---------------------------------------------------------
/** Removes `//` and block comments so regexes see code only. */
const code = (src) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
const src = Object.fromEntries(Object.entries(kt).map(([k, v]) => [k, code(v)]));

function require(cond, message) {
  if (!cond) throw new Error(`${message}; re-check the port in scripts/m3/gen-progress.mjs`);
}

/** `const val Name = 123` / `val Name = 1.5f` / `const val Name = 500.0`. */
function constants(source) {
  const out = {};
  for (const [, name, value] of source.matchAll(/(?:const )?val (\w+)\s*(?::\s*\w+)?\s*=\s*(-?[\d.]+)f?\b/g)) {
    out[name] = Number(value);
  }
  return out;
}
const C = {...constants(src.motion), ...constants(src.progress)};

/** Evaluates a Kotlin arithmetic expression over known constants. */
function evaluate(expr) {
  const js = expr
    .replace(/MotionTokens\./g, '')
    .replace(/\.toInt\(\)/g, '')
    .replace(/\b([A-Za-z_]\w*)\b/g, (name) => {
      if (!(name in C)) throw new Error(`Unknown constant ${name} in "${expr}"`);
      return String(C[name]);
    })
    .replace(/(\d)f\b/g, '$1');
  require(/^[\d.\s+\-*/()]+$/.test(js), `Unsupported expression "${expr}"`);
  return Function(`return (${js});`)();
}

/** MotionTokens `CubicBezierEasing(a, b, c, d)` as CSS. */
function easing(name) {
  const short = name.replace(/^MotionTokens\./, '');
  if (short === 'LinearEasing') return 'linear';
  // Aliases such as `LinearIndeterminateProgressEasing = MotionTokens.X`.
  const alias = src.progress.match(new RegExp(`val ${short}\\s*=\\s*([\\w.]+)`));
  if (alias) return easing(alias[1]);
  const m = src.motion.match(
    new RegExp(`val ${short}: CubicBezierEasing\\s*get\\(\\) = CubicBezierEasing\\(([\\d.]+)f, ([\\d.]+)f, ([\\d.]+)f, ([\\d.]+)f\\)`),
  );
  require(m, `Easing ${name} not found in MotionTokens.kt`);
  return `cubic-bezier(${m.slice(1).map(Number).join(', ')})`;
}

/**
 * Parses `internal val <name> get() = infiniteRepeatable(... keyframes {...})`
 * into [{time, value, easing}] keyframes (ms), with Compose semantics: the
 * animation starts at `from` and ends at `to` unless keyframes say otherwise,
 * and `using` eases the interval starting at its keyframe (default linear).
 */
function keyframesSpec(name, from, to) {
  const start = src.progress.indexOf(`val ${name}`);
  require(start >= 0, `${name} not found in ProgressIndicator.kt`);
  const open = src.progress.indexOf('keyframes {', start);
  const body = src.progress.slice(open + 'keyframes {'.length, src.progress.indexOf('}', open));
  const text = body.replace(/\s+/g, ' ').trim();
  const duration = evaluate(text.match(/durationMillis = ([\w.]+(?: [-+*/] [\w.]+)*)/)[1]);
  const entries = [...text.matchAll(/([\w.]+) at (.+?)(?: using ([\w.]+))?(?= [\w.]+ at |$)/g)];
  require(entries.length > 0, `No keyframes in ${name}`);
  const frames = [{time: 0, value: from, easing: 'linear'}];
  for (const [, value, time, using] of entries) {
    const frame = {time: evaluate(time), value: evaluate(value), easing: using ? easing(using) : 'linear'};
    if (frame.time === 0) frames[0] = frame;
    else frames.push(frame);
  }
  if (frames[frames.length - 1].time !== duration) frames.push({time: duration, value: to, easing: 'linear'});
  return {duration, frames};
}

// --- Indeterminate linear (ProgressIndicator.kt) ------------------------------
require(
  /animateFloat\(\s*initialValue = 0f,\s*targetValue = 1f,\s*animationSpec = linearIndeterminateFirstLineHeadAnimationSpec/.test(
    src.wavy,
  ),
  'linear indeterminate line animations changed in WavyProgressIndicator.kt',
);
const LINES = {
  'head-1': keyframesSpec('linearIndeterminateFirstLineHeadAnimationSpec', 0, 1),
  'tail-1': keyframesSpec('linearIndeterminateFirstLineTailAnimationSpec', 0, 1),
  'head-2': keyframesSpec('linearIndeterminateSecondLineHeadAnimationSpec', 0, 1),
  'tail-2': keyframesSpec('linearIndeterminateSecondLineTailAnimationSpec', 0, 1),
};

// --- Indeterminate circular ---------------------------------------------------
const MIN_SWEEP = C.CircularIndeterminateMinProgress;
const MAX_SWEEP = C.CircularIndeterminateMaxProgress;
const SWEEP = keyframesSpec('circularIndeterminateProgressAnimationSpec', MIN_SWEEP, MAX_SWEEP);
const ADDITIONAL = keyframesSpec(
  'circularIndeterminateRotationAnimationSpec',
  0,
  C.CircularAdditionalRotationDegreesTarget,
);
const globalSpec = src.progress.match(
  /val circularIndeterminateGlobalRotationAnimationSpec[\s\S]*?tween\((\w+), easing = (\w+)\)/,
);
require(globalSpec, 'global rotation spec not found in ProgressIndicator.kt');
const GLOBAL_DURATION = evaluate(globalSpec[1]);
const GLOBAL_EASING = easing(globalSpec[2]);
const GLOBAL_DEGREES = C.CircularGlobalRotationDegreesTarget;
const rotationOffset = src.circular.match(/degrees = currentGlobalRotation \+ currentAdditionalRotation \+ ([\d.]+)f/);
require(rotationOffset, 'indeterminate circular rotation changed in CircularWavyProgressModifiers.kt');
const ROTATION_OFFSET = Number(rotationOffset[1]);

// --- Wave motion and amplitude (WavyProgressIndicator.kt) ---------------------
require(/waveSpeed: Dp = wavelength,/.test(src.wavy), 'default wave speed changed in WavyProgressIndicator.kt');
require(
  /\(\(wavelength \/ waveSpeed\) \* 1000\)/.test(src.linear) &&
    /\(\(wavelength \/ waveSpeed\) \* 1000 \* vertexCountForCurrentAnimation\)/.test(src.circular),
  'wave offset durations changed',
);
// waveSpeed = wavelength: one wavelength per second.
const WAVE_PERIOD = 1000;
const amplitudeRule = src.wavy.match(/if \(progress <= ([\d.]+)f \|\| progress >= ([\d.]+)f\) \{\s*0f\s*\} else \{\s*1f\s*\}/);
require(amplitudeRule, 'indicatorAmplitude changed in WavyProgressIndicator.kt');
const [AMPLITUDE_MIN, AMPLITUDE_MAX] = amplitudeRule.slice(1).map(Number);
function tweenSpec(name) {
  const m = src.wavy.match(
    new RegExp(`val ${name}[\\s\\S]*?tween\\(\\s*durationMillis = ([\\w.]+)(?:\\.toInt\\(\\))?,\\s*easing = ([\\w.]+),?\\s*\\)`),
  );
  require(m, `${name} not found in WavyProgressIndicator.kt`);
  return {duration: evaluate(m[1]), easing: easing(m[2])};
}
const AMPLITUDE_UP = tweenSpec('IncreasingAmplitudeAnimationSpec');
const AMPLITUDE_DOWN = tweenSpec('DecreasingAmplitudeAnimationSpec');

require(AMPLITUDE_UP.duration === AMPLITUDE_DOWN.duration, 'amplitude durations differ');

// --- Spec tokens --------------------------------------------------------------
function px(token) {
  const r = db.resolve(token);
  const v = r?.resolved?.length?.value ?? r?.value?.length?.value;
  if (v === undefined) {
    // Fall back to the generated web value (e.g. "40px").
    const m = JSON.stringify(r).match(/"value":([\d.]+),"unit":"DIPS"/);
    require(m, `No length for ${token}`);
    return Number(m[1]);
  }
  return v;
}
const T = 'md.comp.progress-indicator';
const LINEAR = {
  thickness: px(`${T}.linear.active-indicator.thickness`),
  amplitude: px(`${T}.linear.active-indicator.wave.amplitude`),
  wavelength: px(`${T}.linear.active-indicator.wave.wavelength`),
  indeterminateWavelength: px(`${T}.linear.indeterminate.active-indicator.wave.wavelength`),
  height: px(`${T}.linear.with-wave.height`),
};
const CIRCULAR = {
  thickness: px(`${T}.circular.active-indicator.thickness`),
  wavelength: px(`${T}.circular.active-indicator.wave.wavelength`),
  size: px(`${T}.circular.size`),
  waveSize: px(`${T}.circular.with-wave.size`),
};

// --- Linear wave (LinearWavyProgressModifiers.kt LinearProgressDrawingCache) -
// Compose plots quadratics with control points at +/-(height - stroke) from
// the center, alternating, starting downwards: the wave peaks at half that.
require(/var controlY = height - stroke\.width/.test(src.linear), 'linear wave plot changed');
require(/controlY \*= -1f/.test(src.linear), 'linear wave plot changed');
if (Math.abs((LINEAR.height - LINEAR.thickness) / 2 - LINEAR.amplitude) > 1e-6) {
  console.warn(
    `Linear wave amplitude token (${LINEAR.amplitude}px) differs from Compose's (height - stroke) / 2 ` +
      `(${(LINEAR.height - LINEAR.thickness) / 2}px); using the token.`,
  );
}
// One long path shared by every width: wide enough for a 4096px track plus
// two wavelengths of phase (Compose `widthWithExtraPhase`), and a whole
// number of half waves for both wavelengths so flat and wavy paths share
// commands. `pathLength` makes dash lengths horizontal distances, as
// Compose's `progressPathScale` does.
const MAX_TRACK = 4096;
const halfWaves = [LINEAR.wavelength / 2, LINEAR.indeterminateWavelength / 2];
const lcm = halfWaves.reduce((a, b) => {
  const gcd = (x, y) => (y ? gcd(y, x % y) : x);
  return (a * b) / gcd(a, b);
});
const PATH_LENGTH = Math.ceil((MAX_TRACK + 2 * Math.max(LINEAR.wavelength, LINEAR.indeterminateWavelength)) / lcm) * lcm;
const n = (v) => String(Math.round(v * 1000) / 1000);
function linearWave(wavelength, amplitude) {
  const half = wavelength / 2;
  const count = PATH_LENGTH / half;
  return `M0 0q${n(half / 2)} ${n(2 * amplitude)} ${n(half)} 0${`t${n(half)} 0`.repeat(count - 1)}`;
}

// --- Circular star (CircularWavyProgressModifiers.kt CircularShapes) ----------
const starMatch = src.circular.match(
  /RoundedPolygon\.star\(\s*numVerticesPerRadius = numVertices,\s*innerRadius = ([\d.]+)f,\s*rounding = CornerRounding\(radius = ([\d.]+)f, smoothing = ([\d.]+)f\),\s*innerRounding = CornerRounding\(radius = ([\d.]+)f\),?\s*\)/,
);
require(starMatch, 'circular star polygon changed in CircularWavyProgressModifiers.kt');
const [INNER_RADIUS, ROUNDING, SMOOTHING, INNER_ROUNDING] = starMatch.slice(1).map(Number);
const minVertices = src.circular.match(/MinCircularVertexCount = (\d+)/);
require(minVertices, 'MinCircularVertexCount not found');
require(
  /val r = size\.minDimension \/ 2 - strokeWidth \/ 2/.test(src.circular) &&
    /\(2 \* PI \* r \/ wavelength\)\.fastRoundToInt\(\)/.test(src.circular),
  'circular vertex count changed',
);
require(/scale\(x = width - stroke\.width, y = height - stroke\.width\)/.test(src.circular), 'circular path scale changed');

/** Vertex count Compose uses for a box size. */
const vertexCount = (size) =>
  Math.max(Number(minVertices[1]), Math.round((2 * Math.PI * (size / 2 - CIRCULAR.thickness / 2)) / CIRCULAR.wavelength));
const VERTICES = vertexCount(CIRCULAR.waveSize);
const circlePolygon = (count) => circle({numVertices: count}).normalized();
const starPolygon = star(VERTICES, {
  innerRadius: INNER_RADIUS,
  rounding: new CornerRounding(ROUNDING, SMOOTHING),
  innerRounding: new CornerRounding(INNER_ROUNDING),
}).normalized();
const morph = new Morph(circlePolygon(VERTICES), starPolygon);

/**
 * Cubics (normalized, centered at 0.5) -> SVG path centered at 0, as Compose
 * `pathFromCubics` (rotated so the first anchor is at 12 o'clock) followed by
 * `processPath` (scaled to size - stroke, bounds centered).
 */
function circularPath(cubics, size) {
  const c0 = cubics[0].points;
  const angle = (Math.atan2(c0[1] - 0.5, c0[0] - 0.5) * 180) / Math.PI;
  const r = ((270 - angle) * Math.PI) / 180;
  const [cos, sin] = [Math.cos(r), Math.sin(r)];
  const scale = size - CIRCULAR.thickness;
  const pts = cubics.map((c) => {
    const out = [];
    for (let i = 0; i < 8; i += 2) {
      const [x, y] = [c.points[i], c.points[i + 1]];
      out.push((cos * x - sin * y) * scale, (sin * x + cos * y) * scale);
    }
    return out;
  });
  let [minX, minY, maxX, maxY] = [Infinity, Infinity, -Infinity, -Infinity];
  for (const p of pts) {
    for (let i = 0; i < 8; i += 2) {
      [minX, maxX] = [Math.min(minX, p[i]), Math.max(maxX, p[i])];
      [minY, maxY] = [Math.min(minY, p[i + 1]), Math.max(maxY, p[i + 1])];
    }
  }
  const [cx, cy] = [(minX + maxX) / 2, (minY + maxY) / 2];
  const f = (v) => String(Math.round(v * 100) / 100);
  const X = (x) => f(x - cx);
  const Y = (y) => f(y - cy);
  return (
    `M${X(pts[0][0])} ${Y(pts[0][1])}` +
    pts.map((p) => `C${X(p[2])} ${Y(p[3])} ${X(p[4])} ${Y(p[5])} ${X(p[6])} ${Y(p[7])}`).join('') +
    'Z'
  );
}
const circularFlat = circularPath(morph.asCubics(0), CIRCULAR.waveSize);
const circularWavy = circularPath(morph.asCubics(1), CIRCULAR.waveSize);
// Flat circular indicators are the smaller spec size, without a wave.
const flatCircle = circularPath(circlePolygon(vertexCount(CIRCULAR.size)).cubics, CIRCULAR.size);

// --- Output -----------------------------------------------------------------
const pct = (t, total) => `${Math.round((t / total) * 1e6) / 1e4}%`;
const prop = (name) => `--_md-progress-${name}`;

/** CSS keyframes animating a registered property through Compose keyframes. */
function cssKeyframes(name, property, {duration, frames}, unit = '', offset = 0) {
  const lines = frames.map(({time, value, easing}, i) => {
    const timing = i < frames.length - 1 ? ` animation-timing-function: ${easing};` : '';
    return `    ${pct(time, duration)} { ${property}: ${n(value + offset)}${unit};${timing} }`;
  });
  return `  @keyframes ${name} {\n${lines.join('\n')}\n  }`;
}

/** Registered properties the styles animate (registered again from JS for shadow roots). */
const PROPERTIES = [
  ['wave', '<number>', '0'],
  ['wavy', '<number>', '0'],
  ...Object.keys(LINES).map((k) => [k, '<number>', '0']),
  ['sweep', '<number>', String(MIN_SWEEP)],
];

const header = (comment) => `${comment}
${comment} Copyright 2026 Google LLC
${comment} SPDX-License-Identifier: Apache-2.0
${comment}
${comment} AUTOGENERATED. DO NOT MODIFY.
${comment} To modify this file, run: node scripts/m3/gen-progress.mjs
${comment} Sources: androidx.compose.material3 ProgressIndicator.kt, WavyProgressIndicator.kt,
${comment} internal/{Linear,Circular}WavyProgressModifiers.kt, tokens/MotionTokens.kt
${comment} (Apache-2.0), m3.material.io ${db.version} (md.comp.progress-indicator).
`;

const describeLines = Object.entries(LINES)
  .map(([k, {frames}]) => `${k} ${frames.find((f) => f.value === 0 && f.easing !== 'linear')?.time ?? 0}ms`)
  .join(', ');

await writeFile(
  join(OUT, '_progress-motion.scss'),
  `${header('//')}
// Linear indeterminate: two lines whose heads and tails run 0 -> 1 in a
// ${LINES['head-1'].duration}ms cycle (starting at ${describeLines}).
// Circular indeterminate: the sweep runs ${MIN_SWEEP} -> ${MAX_SWEEP} -> ${MIN_SWEEP} in ${SWEEP.duration}ms, plus a
// linear ${GLOBAL_DEGREES}deg turn and ${ADDITIONAL.frames.filter((f, i) => i > 0 && f.value !== ADDITIONAL.frames[i - 1].value).length} stepped turns in the same cycle.
// Waves travel one wavelength per ${WAVE_PERIOD}ms (circular: ${VERTICES} vertices, so ${VERTICES * WAVE_PERIOD}ms per turn).
// Determinate waves are flat at or below ${AMPLITUDE_MIN * 100}% and at or above ${AMPLITUDE_MAX * 100}%, animating
// ${AMPLITUDE_UP.duration}ms in and out.

$linear-duration: ${LINES['head-1'].duration}ms;
$circular-duration: ${SWEEP.duration}ms;
$global-rotation-duration: ${GLOBAL_DURATION}ms;
$global-rotation-easing: ${GLOBAL_EASING};
$wave-duration: ${WAVE_PERIOD}ms;
$circular-wave-duration: ${VERTICES * WAVE_PERIOD}ms;
$amplitude-duration: ${AMPLITUDE_UP.duration}ms;
$amplitude-increasing-easing: ${AMPLITUDE_UP.easing};
$amplitude-decreasing-easing: ${AMPLITUDE_DOWN.easing};
$amplitude-min-progress: ${AMPLITUDE_MIN};
$amplitude-max-progress: ${AMPLITUDE_MAX};

// Wave geometry, generated at the spec token sizes.
$linear-wavelength: ${LINEAR.wavelength}px;
$linear-indeterminate-wavelength: ${LINEAR.indeterminateWavelength}px;
$linear-path-length: ${PATH_LENGTH};
$circular-size: ${CIRCULAR.size}px;
$circular-wave-size: ${CIRCULAR.waveSize}px;
$circular-vertices: ${VERTICES};
$linear-flat-path: path('${linearWave(LINEAR.wavelength, 0)}');
$linear-wavy-path: path('${linearWave(LINEAR.wavelength, LINEAR.amplitude)}');
$linear-indeterminate-wavy-path: path('${linearWave(LINEAR.indeterminateWavelength, LINEAR.amplitude)}');
$circular-flat-path: path('${flatCircle}');
$circular-wavy-path: path('${circularWavy}');
// The circle the wavy circular indicator flattens to (same commands as the wave).
$circular-wavy-flat-path: path('${circularFlat}');

@mixin properties {
${PROPERTIES.map(([name, syntax, initial]) => `  @property ${prop(name)} {\n    syntax: '${syntax}';\n    inherits: true;\n    initial-value: ${initial};\n  }`).join('\n')}
}

@mixin keyframes {
${Object.entries(LINES)
  .map(([k, spec]) => cssKeyframes(`md-progress-linear-${k}`, prop(k), spec))
  .join('\n\n')}

${cssKeyframes('md-progress-circular-sweep', prop('sweep'), SWEEP)}

  @keyframes md-progress-circular-rotate {
    from { rotate: 0deg; animation-timing-function: ${GLOBAL_EASING}; }
    to { rotate: ${GLOBAL_DEGREES}deg; }
  }

  // Compose adds ${ROTATION_OFFSET}deg to the indeterminate rotation.
${cssKeyframes('md-progress-circular-rotate-steps', 'rotate', ADDITIONAL, 'deg', ROTATION_OFFSET)}

  @keyframes md-progress-wave {
    from { ${prop('wave')}: 0; }
    to { ${prop('wave')}: 1; }
  }
}
`,
);

await writeFile(
  join(OUT, 'progress-paths.ts'),
  `${header('//')}
/**
 * \`pathLength\` of the linear wave paths: their horizontal extent, so dash
 * lengths are horizontal distances.
 */
export const LINEAR_PATH_LENGTH = ${PATH_LENGTH};

/**
 * The flat (default) linear path, used as the \`d\` attribute where CSS \`d\`
 * is not supported.
 */
export const LINEAR_FLAT_PATH = '${linearWave(LINEAR.wavelength, 0)}';

/** The flat (default) circular path, used as the \`d\` attribute fallback. */
export const CIRCULAR_FLAT_PATH = '${flatCircle}';

/** The wavy linear path (determinate): the \`d\` attribute where CSS \`d\` is unsupported. */
export const LINEAR_WAVY_PATH = '${linearWave(LINEAR.wavelength, LINEAR.amplitude)}';

/** The wavy linear path of the indeterminate indicator (shorter wavelength). */
export const LINEAR_INDETERMINATE_WAVY_PATH = '${linearWave(LINEAR.indeterminateWavelength, LINEAR.amplitude)}';

/** The wavy circular path: the \`d\` attribute where CSS \`d\` is unsupported. */
export const CIRCULAR_WAVY_PATH = '${circularWavy}';

/** The circular SVG view box: the wavy container size, centered at 0. */
export const CIRCULAR_VIEW_BOX = '${-CIRCULAR.waveSize / 2} ${-CIRCULAR.waveSize / 2} ${CIRCULAR.waveSize} ${CIRCULAR.waveSize}';

/**
 * Animated custom properties. The styles register them with \`@property\`,
 * which does not apply inside shadow roots, so they are also registered from
 * script.
 */
export const PROGRESS_PROPERTIES: ReadonlyArray<{
  name: string;
  syntax: string;
  initialValue: string;
}> = [
${PROPERTIES.map(([name, syntax, initial]) => `  {name: '${prop(name)}', syntax: '${syntax}', initialValue: '${initial}'},`).join('\n')}
];
`,
);

console.log(
  `Progress: linear cycle ${LINES['head-1'].duration}ms, circular cycle ${SWEEP.duration}ms, ` +
    `${VERTICES}-vertex circular wave, linear path ${PATH_LENGTH}px.`,
);
