/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Self-check for the graphics-shapes / MaterialShapes JS port.
 *
 *   node scripts/m3/shapes/check.mjs
 */

import {Corner, Cubic, Morph, RoundedPolygon, star} from './graphics-shapes.mjs';
import {MATERIAL_SHAPE_BUILDERS, MaterialShapes, toSvgPath} from './material-shapes.mjs';

const EPS = 1e-3;
const results = [];
function check(name, fn) {
  try {
    const detail = fn();
    results.push({name, ok: true, detail});
  } catch (e) {
    results.push({name, ok: false, detail: e.message});
  }
}
function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}
const near = (a, b, eps) => Math.abs(a - b) <= eps;

const names = Object.keys(MATERIAL_SHAPE_BUILDERS);

check('35 shapes defined', () => {
  assert(names.length === 35, `expected 35 shapes, got ${names.length}`);
  return `${names.length}`;
});

for (const name of names) {
  check(`${name}: builds, bounds in [0,1]`, () => {
    const p = MaterialShapes[name];
    assert(p instanceof RoundedPolygon, 'not a RoundedPolygon');
    assert(p.cubics.length > 0, 'no cubics');
    const exact = p.calculateBounds(undefined, false);
    const approx = p.calculateBounds(undefined, true);
    for (const b of [...exact, ...approx]) assert(b >= -EPS && b <= 1 + EPS, `bounds out of range: ${approx}`);
    // Normalized: the larger side spans the full unit box.
    const side = Math.max(approx[2] - approx[0], approx[3] - approx[1]);
    assert(near(side, 1, 1e-6), `normalized side ${side}`);
    const d = toSvgPath(p);
    const nums = d.match(/-?\d+(\.\d+)?/g).map(Number);
    for (const v of nums) assert(v >= -EPS && v <= 1 + EPS, `path value ${v} out of range`);
    assert(/^M [^MZ]+( C [^MZ]+)+ Z$/.test(d), 'path not M ... C ... Z');
    return `${p.cubics.length} cubics`;
  });
}

check('Circle bounds ~ [0,0,1,1]', () => {
  const b = MaterialShapes.Circle.calculateBounds();
  const e = MaterialShapes.Circle.calculateBounds(undefined, false);
  for (const [v, t] of [[b[0], 0], [b[1], 0], [b[2], 1], [b[3], 1], [e[0], 0], [e[1], 0], [e[2], 1], [e[3], 1]]) {
    assert(near(v, t, 0.01), `circle bounds ${b} / exact ${e}`);
  }
  // Every on-curve point is ~0.5 from the center.
  const p = MaterialShapes.Circle;
  let maxErr = 0;
  for (const c of p.cubics) {
    for (let t = 0; t <= 1; t += 0.125) {
      const q = c.pointOnCurve(t);
      maxErr = Math.max(maxErr, Math.abs(Math.hypot(q.x - p.centerX, q.y - p.centerY) - b[2] / 2 + b[0] / 2));
    }
  }
  assert(maxErr < 0.005, `radius error ${maxErr}`);
  return `approx ${b.map((v) => v.toFixed(4))}; radius err ${maxErr.toExponential(1)}`;
});

check('star vertex counts', () => {
  const counts = [];
  for (const n of [3, 5, 7, 8, 9, 12]) {
    const s = star(n, {innerRadius: 0.6});
    const corners = s.features.filter((f) => f instanceof Corner).length;
    assert(corners === 2 * n, `star(${n}) has ${corners} corners`);
    assert(s.features.length === 4 * n, `star(${n}) has ${s.features.length} features`);
    counts.push(`${n}->${corners}`);
  }
  for (const [name, n] of [['Sunny', 8], ['Cookie7Sided', 7], ['Cookie9Sided', 9], ['Cookie12Sided', 12]]) {
    const corners = MaterialShapes[name].features.filter((f) => f instanceof Corner).length;
    assert(corners === 2 * n, `${name} has ${corners} corners`);
  }
  return counts.join(' ');
});

function samePath(a, b, eps) {
  // Compare traced outlines: sample both cubic lists and check every sample of
  // one lies near the other (morph may split cubics, so compare geometry).
  const sample = (cubics, steps) => {
    const pts = [];
    for (const c of cubics) for (let i = 0; i <= steps; i++) pts.push(c.pointOnCurve(i / steps));
    return pts;
  };
  let worst = 0;
  for (const [src, dst] of [[sample(a, 8), sample(b, 64)], [sample(b, 8), sample(a, 64)]]) {
    for (const p of src) {
      // Distance to the densely sampled polyline of the other outline.
      let best = Infinity;
      for (let i = 0; i + 1 < dst.length; i++) {
        const q = dst[i];
        const r = dst[i + 1];
        const dx = r.x - q.x;
        const dy = r.y - q.y;
        const len2 = dx * dx + dy * dy;
        const t = len2 > 0 ? Math.max(0, Math.min(1, ((p.x - q.x) * dx + (p.y - q.y) * dy) / len2)) : 0;
        best = Math.min(best, Math.hypot(p.x - q.x - t * dx, p.y - q.y - t * dy));
      }
      worst = Math.max(worst, best);
    }
  }
  assert(worst < eps, `outline mismatch ${worst}`);
  return worst;
}

const morphPairs = [
  ['Circle', 'Cookie9Sided'],
  ['Square', 'Sunny'],
  ['Pill', 'Heart'],
  ['Triangle', 'Clover4Leaf'],
  ['SoftBoom', 'PixelCircle'],
];
for (const [a, b] of morphPairs) {
  check(`Morph ${a} -> ${b} endpoints`, () => {
    const m = new Morph(MaterialShapes[a], MaterialShapes[b]);
    const c0 = m.asCubics(0);
    const c1 = m.asCubics(1);
    // Exact: progress 0/1 equal the matched start/end cubics.
    for (let i = 0; i < m.morphMatch.length; i++) {
      for (let k = 0; k < 8; k++) {
        assert(near(c0[i].points[k], m.morphMatch[i][0].points[k], 1e-6), 'progress 0 != start match');
        assert(near(c1[i].points[k], m.morphMatch[i][1].points[k], 1e-6), 'progress 1 != end match');
      }
    }
    assert(c0[0] instanceof Cubic, 'asCubics did not return Cubics');
    // Geometric: same outline as the start/end polygons.
    const e0 = samePath(c0, MaterialShapes[a].cubics, 2e-3);
    const e1 = samePath(c1, MaterialShapes[b].cubics, 2e-3);
    return `${m.morphMatch.length} pairs, outline err ${e0.toExponential(1)} / ${e1.toExponential(1)}`;
  });
}

check('Morph builds for all 35x35 pairs', () => {
  let n = 0;
  for (const a of names) for (const b of names) {
    const m = new Morph(MaterialShapes[a], MaterialShapes[b]);
    assert(m.asCubics(0.5).length > 0, `${a}->${b} empty`);
    n++;
  }
  return `${n} pairs`;
});

const failed = results.filter((r) => !r.ok);
for (const r of results) {
  if (!r.ok || process.argv.includes('-v')) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}: ${r.detail ?? ''}`);
}
const summary = results.filter((r) => !r.name.includes(': builds'));
for (const r of summary) if (r.ok && !process.argv.includes('-v')) console.log(`PASS  ${r.name}: ${r.detail ?? ''}`);
console.log(`\n${results.length - failed.length}/${results.length} checks passed (${names.length} shapes)`);
process.exit(failed.length ? 1 : 0);
