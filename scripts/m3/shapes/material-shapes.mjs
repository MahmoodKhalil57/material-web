/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * JavaScript port of `androidx.compose.material3.MaterialShapes` and the
 * `RoundedPolygon.transformed(Matrix)` / `toPath` helpers from
 * `androidx.compose.material3.internal.ShapeUtil`.
 *
 * Ported from the Android Open Source Project, Copyright 2024-2025 The Android
 * Open Source Project, licensed under the Apache License, Version 2.0.
 *
 * The lowercase builder functions (`circle`, `cookie9`, ...) are the upstream
 * internal functions and return the *un-normalized* polygon, exactly like
 * upstream. `MaterialShapes.<PublicName>` (e.g. `MaterialShapes.Cookie9Sided`)
 * returns the cached `.normalized()` polygon, like the Compose public getters.
 *
 * Deviations:
 * - Compose `Matrix` is replaced by the 2D affine helpers below
 *   (`rotateZ`/`scale`), which reproduce `Matrix().apply { rotateZ(d) }` and
 *   `Matrix().apply { scale(x, y) }` followed by `Matrix.map(Offset)`:
 *   rotateZ(d) maps (x, y) -> (x cos d - y sin d, x sin d + y cos d).
 * - `Offset` is a plain `{x, y}` point.
 */

import * as gs from './graphics-shapes.mjs';

const {CornerRounding, RoundedPolygon} = gs;

// ---------------------------------------------------------------------------
// Matrix stand-ins (Compose ui-graphics Matrix.rotateZ / scale + map)
// ---------------------------------------------------------------------------

/** @return {gs.PointTransformer} */
function rotateZ(degrees) {
  const r = (degrees * Math.PI) / 180;
  const s = Math.sin(r);
  const c = Math.cos(r);
  return (x, y) => [c * x - s * y, s * x + c * y];
}

/** @return {gs.PointTransformer} */
function scale(sx = 1, sy = 1) {
  return (x, y) => [x * sx, y * sy];
}

/** `RoundedPolygon.transformed(matrix: Matrix)` from material3/internal/ShapeUtil.kt */
const transformed = (polygon, matrix) => polygon.transformed(matrix);

// ---------------------------------------------------------------------------
// MaterialShapes.Companion
// ---------------------------------------------------------------------------

// Cache various roundings for use below
const cornerRound15 = new CornerRounding(0.15);
const cornerRound20 = new CornerRounding(0.2);
const cornerRound30 = new CornerRounding(0.3);
const cornerRound50 = new CornerRounding(0.5);
const cornerRound100 = new CornerRounding(1);

const rotateNeg45 = rotateZ(-45);
const rotateNeg90 = rotateZ(-90);
const rotateNeg135 = rotateZ(-135);

const Offset = (x, y) => ({x, y});
const R = (radius, smoothing = 0) => new CornerRounding(radius, smoothing);
/** `data class PointNRound(o: Offset, r: CornerRounding = Unrounded)` */
const PointNRound = (o, r = CornerRounding.Unrounded) => ({o, r});

export function circle(numVertices = 10) {
  return RoundedPolygon.circle({numVertices});
}

export function square() {
  return RoundedPolygon.rectangle({width: 1, height: 1, rounding: cornerRound30});
}

export function slanted() {
  return customPolygon(
    [
      PointNRound(Offset(0.926, 0.97), R(0.189, 0.811)),
      PointNRound(Offset(-0.021, 0.967), R(0.187, 0.057)),
    ],
    2,
  );
}

export function arch() {
  return transformed(
    RoundedPolygon.fromNumVertices(4, {
      perVertexRounding: [cornerRound100, cornerRound100, cornerRound20, cornerRound20],
    }),
    rotateNeg135,
  );
}

export function fan() {
  return customPolygon(
    [
      PointNRound(Offset(1.004, 1.0), R(0.148, 0.417)),
      PointNRound(Offset(0.0, 1.0), R(0.151)),
      PointNRound(Offset(0.0, -0.003), R(0.148)),
      PointNRound(Offset(0.978, 0.02), R(0.803)),
    ],
    1,
  );
}

export function arrow() {
  return customPolygon(
    [
      PointNRound(Offset(0.5, 0.892), R(0.313)),
      PointNRound(Offset(-0.216, 1.05), R(0.207)),
      PointNRound(Offset(0.499, -0.16), R(0.215, 1.0)),
      PointNRound(Offset(1.225, 1.06), R(0.211)),
    ],
    1,
  );
}

export function semiCircle() {
  return RoundedPolygon.rectangle({
    width: 1.6,
    height: 1,
    perVertexRounding: [cornerRound20, cornerRound20, cornerRound100, cornerRound100],
  });
}

export function oval() {
  const m = scale(1, 0.64);
  return transformed(transformed(RoundedPolygon.circle(), m), rotateNeg45);
}

export function pill() {
  return customPolygon(
    [
      PointNRound(Offset(0.961, 0.039), R(0.426)),
      PointNRound(Offset(1.001, 0.428)),
      PointNRound(Offset(1.0, 0.609), R(1.0)),
    ],
    2,
    undefined,
    true,
  );
}

export function triangle() {
  return transformed(RoundedPolygon.fromNumVertices(3, {rounding: cornerRound20}), rotateNeg90);
}

export function diamond() {
  return customPolygon(
    [
      PointNRound(Offset(0.5, 1.096), R(0.151, 0.524)),
      PointNRound(Offset(0.04, 0.5), R(0.159)),
    ],
    2,
  );
}

export function clamShell() {
  return customPolygon(
    [
      PointNRound(Offset(0.171, 0.841), R(0.159)),
      PointNRound(Offset(-0.02, 0.5), R(0.14)),
      PointNRound(Offset(0.17, 0.159), R(0.159)),
    ],
    2,
  );
}

export function pentagon() {
  return customPolygon(
    [
      PointNRound(Offset(0.5, -0.009), R(0.172)),
      PointNRound(Offset(1.03, 0.365), R(0.164)),
      PointNRound(Offset(0.828, 0.97), R(0.169)),
    ],
    1,
    undefined,
    true,
  );
}

export function gem() {
  return customPolygon(
    [
      PointNRound(Offset(0.499, 1.023), R(0.241, 0.778)),
      PointNRound(Offset(-0.005, 0.792), R(0.208)),
      PointNRound(Offset(0.073, 0.258), R(0.228)),
      PointNRound(Offset(0.433, -0.0), R(0.491)),
    ],
    1,
    undefined,
    true,
  );
}

export function sunny() {
  return RoundedPolygon.star(8, {innerRadius: 0.8, rounding: cornerRound15});
}

export function verySunny() {
  return customPolygon(
    [
      PointNRound(Offset(0.5, 1.08), R(0.085)),
      PointNRound(Offset(0.358, 0.843), R(0.085)),
    ],
    8,
  );
}

export function cookie4() {
  return customPolygon(
    [
      PointNRound(Offset(1.237, 1.236), R(0.258)),
      PointNRound(Offset(0.5, 0.918), R(0.233)),
    ],
    4,
  );
}

export function cookie6() {
  // 6-point cookie
  return customPolygon(
    [
      PointNRound(Offset(0.723, 0.884), R(0.394)),
      PointNRound(Offset(0.5, 1.099), R(0.398)),
    ],
    6,
  );
}

export function cookie7() {
  // 7-point cookie
  return transformed(RoundedPolygon.star(7, {innerRadius: 0.75, rounding: cornerRound50}), rotateNeg90);
}

export function cookie9() {
  return transformed(RoundedPolygon.star(9, {innerRadius: 0.8, rounding: cornerRound50}), rotateNeg90);
}

export function cookie12() {
  return transformed(RoundedPolygon.star(12, {innerRadius: 0.8, rounding: cornerRound50}), rotateNeg90);
}

export function ghostish() {
  return customPolygon(
    [
      PointNRound(Offset(0.5, 0), R(1.0)),
      PointNRound(Offset(1, 0), R(1.0)),
      PointNRound(Offset(1, 1.14), R(0.254, 0.106)),
      PointNRound(Offset(0.575, 0.906), R(0.253)),
    ],
    1,
    undefined,
    true,
  );
}

export function clover4() {
  return customPolygon(
    [PointNRound(Offset(0.5, 0.074)), PointNRound(Offset(0.725, -0.099), R(0.476))],
    4,
    undefined,
    true,
  );
}

export function clover8() {
  return customPolygon(
    [PointNRound(Offset(0.5, 0.036)), PointNRound(Offset(0.758, -0.101), R(0.209))],
    8,
  );
}

export function burst() {
  return customPolygon(
    [
      PointNRound(Offset(0.5, -0.006), R(0.006)),
      PointNRound(Offset(0.592, 0.158), R(0.006)),
    ],
    12,
  );
}

export function softBurst() {
  return customPolygon(
    [
      PointNRound(Offset(0.193, 0.277), R(0.053)),
      PointNRound(Offset(0.176, 0.055), R(0.053)),
    ],
    10,
  );
}

export function boom() {
  return customPolygon(
    [
      PointNRound(Offset(0.457, 0.296), R(0.007)),
      PointNRound(Offset(0.5, -0.051), R(0.007)),
    ],
    15,
  );
}

export function softBoom() {
  return customPolygon(
    [
      PointNRound(Offset(0.733, 0.454)),
      PointNRound(Offset(0.839, 0.437), R(0.532)),
      PointNRound(Offset(0.949, 0.449), R(0.439, 1.0)),
      PointNRound(Offset(0.998, 0.478), R(0.174)),
    ],
    16,
    undefined,
    true,
  );
}

export function flower() {
  return customPolygon(
    [
      PointNRound(Offset(0.37, 0.187)),
      PointNRound(Offset(0.416, 0.049), R(0.381)),
      PointNRound(Offset(0.479, 0.001), R(0.095)),
    ],
    8,
    undefined,
    true,
  );
}

export function puffy() {
  const m = scale(1, 0.742);
  return transformed(
    customPolygon(
      [
        PointNRound(Offset(0.5, 0.053)),
        PointNRound(Offset(0.545, -0.04), R(0.405)),
        PointNRound(Offset(0.67, -0.035), R(0.426)),
        PointNRound(Offset(0.717, 0.066), R(0.574)),
        PointNRound(Offset(0.722, 0.128)),
        PointNRound(Offset(0.777, 0.002), R(0.36)),
        PointNRound(Offset(0.914, 0.149), R(0.66)),
        PointNRound(Offset(0.926, 0.289), R(0.66)),
        PointNRound(Offset(0.881, 0.346)),
        PointNRound(Offset(0.94, 0.344), R(0.126)),
        PointNRound(Offset(1.003, 0.437), R(0.255)),
      ],
      2,
      undefined,
      true,
    ),
    m,
  );
}

export function puffyDiamond() {
  return customPolygon(
    [
      PointNRound(Offset(0.87, 0.13), R(0.146)),
      PointNRound(Offset(0.818, 0.357)),
      PointNRound(Offset(1.0, 0.332), R(0.853)),
    ],
    4,
    undefined,
    true,
  );
}

export function pixelCircle() {
  return customPolygon(
    [
      PointNRound(Offset(0.5, 0.0)),
      PointNRound(Offset(0.704, 0.0)),
      PointNRound(Offset(0.704, 0.065)),
      PointNRound(Offset(0.843, 0.065)),
      PointNRound(Offset(0.843, 0.148)),
      PointNRound(Offset(0.926, 0.148)),
      PointNRound(Offset(0.926, 0.296)),
      PointNRound(Offset(1.0, 0.296)),
    ],
    2,
    undefined,
    true,
  );
}

export function pixelTriangle() {
  return customPolygon(
    [
      PointNRound(Offset(0.11, 0.5)),
      PointNRound(Offset(0.113, 0.0)),
      PointNRound(Offset(0.287, 0.0)),
      PointNRound(Offset(0.287, 0.087)),
      PointNRound(Offset(0.421, 0.087)),
      PointNRound(Offset(0.421, 0.17)),
      PointNRound(Offset(0.56, 0.17)),
      PointNRound(Offset(0.56, 0.265)),
      PointNRound(Offset(0.674, 0.265)),
      PointNRound(Offset(0.675, 0.344)),
      PointNRound(Offset(0.789, 0.344)),
      PointNRound(Offset(0.789, 0.439)),
      PointNRound(Offset(0.888, 0.439)),
    ],
    1,
    undefined,
    true,
  );
}

export function bun() {
  return customPolygon(
    [
      PointNRound(Offset(0.796, 0.5)),
      PointNRound(Offset(0.853, 0.518), R(1)),
      PointNRound(Offset(0.992, 0.631), R(1)),
      PointNRound(Offset(0.968, 1.0), R(1)),
    ],
    2,
    undefined,
    true,
  );
}

export function heart() {
  return customPolygon(
    [
      PointNRound(Offset(0.5, 0.268), R(0.016)),
      PointNRound(Offset(0.792, -0.066), R(0.958)),
      PointNRound(Offset(1.064, 0.276), R(1.0)),
      PointNRound(Offset(0.501, 0.946), R(0.129)),
    ],
    1,
    undefined,
    true,
  );
}

// --- private helpers --------------------------------------------------------

function doRepeat(points, reps, center, mirroring) {
  if (mirroring) {
    const out = [];
    const angles = points.map((it) => angleDegrees(sub(it.o, center)));
    const distances = points.map((it) => gs.getDistance(sub(it.o, center)));
    const actualReps = reps * 2;
    const sectionAngle = 360 / actualReps;
    for (let it = 0; it < actualReps; it++) {
      for (let index = 0; index < points.length; index++) {
        const i = it % 2 === 0 ? index : points.length - 1 - index;
        if (i > 0 || it % 2 === 0) {
          const a = toRadians(
            sectionAngle * it +
              (it % 2 === 0 ? angles[i] : sectionAngle - angles[i] + 2 * angles[0]),
          );
          const finalPoint = add(mul(Offset(Math.cos(a), Math.sin(a)), distances[i]), center);
          out.push(PointNRound(finalPoint, points[i].r));
        }
      }
    }
    return out;
  }
  const np = points.length;
  const out = [];
  for (let it = 0; it < np * reps; it++) {
    // Kotlin: (it / np) is an Int division.
    const point = rotateDegrees(points[it % np].o, (Math.trunc(it / np) * 360) / reps, center);
    out.push(PointNRound(point, points[it % np].r));
  }
  return out;
}

const sub = (a, b) => Offset(a.x - b.x, a.y - b.y);
const add = (a, b) => Offset(a.x + b.x, a.y + b.y);
const mul = (a, k) => Offset(a.x * k, a.y * k);

function rotateDegrees(p, angle, center = Offset(0, 0)) {
  const a = toRadians(angle);
  const off = sub(p, center);
  return add(
    Offset(off.x * Math.cos(a) - off.y * Math.sin(a), off.x * Math.sin(a) + off.y * Math.cos(a)),
    center,
  );
}

const toRadians = (deg) => (deg / 360) * 2 * Math.PI;
const angleDegrees = (o) => (Math.atan2(o.y, o.x) * 180) / Math.PI;

function customPolygon(pnr, reps, center = Offset(0.5, 0.5), mirroring = false) {
  const actualPoints = doRepeat(pnr, reps, center, mirroring);
  const vertices = [];
  for (const p of actualPoints) vertices.push(p.o.x, p.o.y);
  return RoundedPolygon.fromVertices(vertices, {
    perVertexRounding: actualPoints.map((p) => p.r),
    centerX: center.x,
    centerY: center.y,
  });
}

// ---------------------------------------------------------------------------
// Public shapes (Compose names -> normalized polygons, cached like upstream)
// ---------------------------------------------------------------------------

/** Compose public name -> builder of the normalized polygon. */
export const MATERIAL_SHAPE_BUILDERS = {
  Circle: () => circle().normalized(),
  Square: () => square().normalized(),
  Slanted: () => slanted().normalized(),
  Arch: () => arch().normalized(),
  Fan: () => fan().normalized(),
  Arrow: () => arrow().normalized(),
  SemiCircle: () => semiCircle().normalized(),
  Oval: () => oval().normalized(),
  Pill: () => pill().normalized(),
  Triangle: () => triangle().normalized(),
  Diamond: () => diamond().normalized(),
  ClamShell: () => clamShell().normalized(),
  Pentagon: () => pentagon().normalized(),
  Gem: () => gem().normalized(),
  Sunny: () => sunny().normalized(),
  VerySunny: () => verySunny().normalized(),
  Cookie4Sided: () => cookie4().normalized(),
  Cookie6Sided: () => cookie6().normalized(),
  Cookie7Sided: () => cookie7().normalized(),
  Cookie9Sided: () => cookie9().normalized(),
  Cookie12Sided: () => cookie12().normalized(),
  Ghostish: () => ghostish().normalized(),
  Clover4Leaf: () => clover4().normalized(),
  Clover8Leaf: () => clover8().normalized(),
  Burst: () => burst().normalized(),
  SoftBurst: () => softBurst().normalized(),
  Boom: () => boom().normalized(),
  SoftBoom: () => softBoom().normalized(),
  Flower: () => flower().normalized(),
  Puffy: () => puffy().normalized(),
  PuffyDiamond: () => puffyDiamond().normalized(),
  PixelCircle: () => pixelCircle().normalized(),
  PixelTriangle: () => pixelTriangle().normalized(),
  Bun: () => bun().normalized(),
  Heart: () => heart().normalized(),
};

const cache = new Map();

/** `MaterialShapes.Circle`, `MaterialShapes.Cookie9Sided`, ... (lazy, cached). */
export const MaterialShapes = {};
for (const name of Object.keys(MATERIAL_SHAPE_BUILDERS)) {
  Object.defineProperty(MaterialShapes, name, {
    enumerable: true,
    get() {
      if (!cache.has(name)) cache.set(name, MATERIAL_SHAPE_BUILDERS[name]());
      return cache.get(name);
    },
  });
}
Object.freeze(MaterialShapes);

/** `Cookie9Sided` -> `cookie9Sided` */
export const toCamelCase = (name) => name[0].toLowerCase() + name.slice(1);

// ---------------------------------------------------------------------------
// toPath (material3/internal/ShapeUtil.kt pathFromCubics, as SVG path data)
// ---------------------------------------------------------------------------

function fmt(v, digits) {
  const s = v.toFixed(digits);
  // Trim trailing zeros and normalize "-0".
  const t = s.includes('.') ? s.replace(/0+$/, '').replace(/\.$/, '') : s;
  return t === '-0' ? '0' : t;
}

/**
 * SVG path data for a list of cubics, mirroring `pathFromCubics` with
 * `startAngle = 0`, `repeatPath = false`, `closePath = true` (what
 * `RoundedPolygon.toPath()` / `toShape()` use publicly).
 * @param {gs.Cubic[]} cubics
 */
export function cubicsToSvgPath(cubics, digits = 4) {
  if (cubics.length === 0) return '';
  const n = (v) => fmt(v, digits);
  const parts = [`M ${n(cubics[0].anchor0X)} ${n(cubics[0].anchor0Y)}`];
  for (const c of cubics) {
    parts.push(
      `C ${n(c.control0X)} ${n(c.control0Y)} ${n(c.control1X)} ${n(c.control1Y)} ${n(c.anchor1X)} ${n(c.anchor1Y)}`,
    );
  }
  parts.push('Z');
  return parts.join(' ');
}

/** `RoundedPolygon.toPath()` as SVG path data. */
export const toSvgPath = (polygon, digits = 4) => cubicsToSvgPath(polygon.cubics, digits);
