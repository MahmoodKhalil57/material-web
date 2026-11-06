/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * JavaScript port of `androidx.graphics.shapes` (graphics-shapes 1.1.0).
 *
 * Ported from the Android Open Source Project, Copyright 2022-2025 The Android
 * Open Source Project, licensed under the Apache License, Version 2.0.
 * Sources: Point.kt, Utils.kt, CornerRounding.kt, Cubic.kt, Features.kt,
 * FeatureDetector.kt, RoundedPolygon.kt, Shapes.kt, PolygonMeasure.kt,
 * FeatureMapping.kt, FloatMapping.kt, Morph.kt.
 *
 * Names, math and constants follow upstream. Deliberate deviations:
 * - Arithmetic uses JS doubles instead of Kotlin 32-bit `Float`. Results
 *   differ from upstream by float32 rounding noise (~1e-7 relative).
 * - Points are plain `{x, y}` objects; `PointTransformer` is a JS function
 *   `(x, y) => [x, y]`; `FloatArray` bounds are plain arrays.
 * - Kotlin overloaded `RoundedPolygon(...)` factory functions become static
 *   methods: `RoundedPolygon.fromNumVertices`, `fromVertices`, `fromFeatures`
 *   and `copy`. Named/default parameters become option objects.
 * - `Float.MIN_VALUE` / `Float.MAX_VALUE` keep their Kotlin float32 values
 *   (MIN_VALUE is the smallest *positive* float), including the upstream use
 *   of MIN_VALUE as the initial max in `calculateBounds`.
 * - debugLog calls are dropped. SvgPathParser, FeatureSerializer and
 *   PolygonValidation are not ported (not needed to build or morph shapes).
 */

// ---------------------------------------------------------------------------
// Utils.kt / Point.kt
// ---------------------------------------------------------------------------

/** Kotlin `Float.MIN_VALUE` (smallest positive float32). */
export const FLOAT_MIN_VALUE = 1.401298464324817e-45;
/** Kotlin `Float.MAX_VALUE`. */
export const FLOAT_MAX_VALUE = 3.4028234663852886e38;

export const DistanceEpsilon = 1e-4;
export const AngleEpsilon = 1e-6;
export const RelaxedDistanceEpsilon = 5e-3;
export const FloatPi = Math.PI;
export const TwoPi = 2 * Math.PI;

/** @typedef {{x: number, y: number}} Point */
/** @typedef {(x: number, y: number) => [number, number]} PointTransformer */

/** @return {Point} */
export const Point = (x, y) => ({x, y});
export const Zero = Point(0, 0);

export const getDistance = (p) => Math.sqrt(p.x * p.x + p.y * p.y);
export const getDistanceSquared = (p) => p.x * p.x + p.y * p.y;
export const dotProduct = (p, o) => p.x * o.x + p.y * o.y;
export const dotProductXY = (p, ox, oy) => p.x * ox + p.y * oy;
export const clockwise = (p, o) => p.x * o.y - p.y * o.x > 0;
export function getDirection(p) {
  const d = getDistance(p);
  if (!(d > 0)) throw new Error("Can't get the direction of a 0-length vector");
  return div(p, d);
}
export const neg = (p) => Point(-p.x, -p.y);
export const minus = (a, b) => Point(a.x - b.x, a.y - b.y);
export const plus = (a, b) => Point(a.x + b.x, a.y + b.y);
export const times = (p, k) => Point(p.x * k, p.y * k);
export const div = (p, k) => Point(p.x / k, p.y / k);
export const rem = (p, k) => Point(p.x % k, p.y % k);
export const rotate90 = (p) => Point(-p.y, p.x);
export function interpolatePoint(start, stop, fraction) {
  return Point(
    interpolate(start.x, stop.x, fraction),
    interpolate(start.y, stop.y, fraction),
  );
}
export function transformedPoint(p, f) {
  const [x, y] = f(p.x, p.y);
  return Point(x, y);
}

export const distance = (x, y) => Math.sqrt(x * x + y * y);
export const distanceSquared = (x, y) => x * x + y * y;
export function directionVector(x, y) {
  if (y === undefined) {
    // directionVector(angleRadians)
    return Point(Math.cos(x), Math.sin(x));
  }
  const d = distance(x, y);
  if (!(d > 0)) throw new Error('Required distance greater than zero');
  return Point(x / d, y / d);
}
export const radialToCartesian = (radius, angleRadians, center = Zero) =>
  plus(times(directionVector(angleRadians), radius), center);
export const square = (x) => x * x;
export const interpolate = (start, stop, fraction) =>
  (1 - fraction) * start + fraction * stop;
export const positiveModulo = (num, mod) => ((num % mod) + mod) % mod;
const coerceIn = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
const inRange = (v, lo, hi) => v >= lo && v <= hi;

export function collinearIsh(aX, aY, bX, bY, cX, cY, tolerance = DistanceEpsilon) {
  const ab = rotate90(Point(bX - aX, bY - aY));
  const ac = Point(cX - aX, cY - aY);
  const dp = Math.abs(dotProduct(ab, ac));
  const relativeTolerance = tolerance * getDistance(ab) * getDistance(ac);
  return dp < tolerance || dp < relativeTolerance;
}

export function convex(previous, current, next) {
  // TODO: b/369320447 - This is a fast, but not reliable calculation.
  return clockwise(minus(current, previous), minus(next, current));
}

// ---------------------------------------------------------------------------
// CornerRounding.kt
// ---------------------------------------------------------------------------

export class CornerRounding {
  constructor(radius = 0, smoothing = 0) {
    this.radius = radius;
    this.smoothing = smoothing;
  }
}
CornerRounding.Unrounded = new CornerRounding();

// ---------------------------------------------------------------------------
// Cubic.kt
// ---------------------------------------------------------------------------

export class Cubic {
  /** @param {number[]} [points] 8 values: a0x a0y c0x c0y c1x c1y a1x a1y */
  constructor(points = new Array(8).fill(0)) {
    if (points.length !== 8) throw new Error('Points array size should be 8');
    this.points = points;
  }

  /** `Cubic(anchor0X, anchor0Y, ..., anchor1Y)` */
  static of(a0x, a0y, c0x, c0y, c1x, c1y, a1x, a1y) {
    return new Cubic([a0x, a0y, c0x, c0y, c1x, c1y, a1x, a1y]);
  }

  /** `Cubic(anchor0: Point, control0: Point, control1: Point, anchor1: Point)` */
  static fromPoints(anchor0, control0, control1, anchor1) {
    return new Cubic([
      anchor0.x, anchor0.y, control0.x, control0.y,
      control1.x, control1.y, anchor1.x, anchor1.y,
    ]);
  }

  get anchor0X() { return this.points[0]; }
  get anchor0Y() { return this.points[1]; }
  get control0X() { return this.points[2]; }
  get control0Y() { return this.points[3]; }
  get control1X() { return this.points[4]; }
  get control1Y() { return this.points[5]; }
  get anchor1X() { return this.points[6]; }
  get anchor1Y() { return this.points[7]; }

  pointOnCurve(t) {
    const u = 1 - t;
    return Point(
      this.anchor0X * (u * u * u) +
        this.control0X * (3 * t * u * u) +
        this.control1X * (3 * t * t * u) +
        this.anchor1X * (t * t * t),
      this.anchor0Y * (u * u * u) +
        this.control0Y * (3 * t * u * u) +
        this.control1Y * (3 * t * t * u) +
        this.anchor1Y * (t * t * t),
    );
  }

  zeroLength() {
    return (
      Math.abs(this.anchor0X - this.anchor1X) < DistanceEpsilon &&
      Math.abs(this.anchor0Y - this.anchor1Y) < DistanceEpsilon
    );
  }

  convexTo(next) {
    const prevVertex = Point(this.anchor0X, this.anchor0Y);
    const currVertex = Point(this.anchor1X, this.anchor1Y);
    const nextVertex = Point(next.anchor1X, next.anchor1Y);
    return convex(prevVertex, currVertex, nextVertex);
  }

  calculateBounds(bounds = new Array(4).fill(0), approximate = false) {
    if (this.zeroLength()) {
      bounds[0] = this.anchor0X;
      bounds[1] = this.anchor0Y;
      bounds[2] = this.anchor0X;
      bounds[3] = this.anchor0Y;
      return bounds;
    }
    let minX = Math.min(this.anchor0X, this.anchor1X);
    let minY = Math.min(this.anchor0Y, this.anchor1Y);
    let maxX = Math.max(this.anchor0X, this.anchor1X);
    let maxY = Math.max(this.anchor0Y, this.anchor1Y);

    if (approximate) {
      bounds[0] = Math.min(minX, Math.min(this.control0X, this.control1X));
      bounds[1] = Math.min(minY, Math.min(this.control0Y, this.control1Y));
      bounds[2] = Math.max(maxX, Math.max(this.control0X, this.control1X));
      bounds[3] = Math.max(maxY, Math.max(this.control0Y, this.control1Y));
      return bounds;
    }

    const zeroIsh = (v) => Math.abs(v) < DistanceEpsilon;
    const checkX = (t) => {
      if (inRange(t, 0, 1)) {
        const v = this.pointOnCurve(t).x;
        if (v < minX) minX = v;
        if (v > maxX) maxX = v;
      }
    };
    const checkY = (t) => {
      if (inRange(t, 0, 1)) {
        const v = this.pointOnCurve(t).y;
        if (v < minY) minY = v;
        if (v > maxY) maxY = v;
      }
    };

    const xa = -this.anchor0X + 3 * this.control0X - 3 * this.control1X + this.anchor1X;
    const xb = 2 * this.anchor0X - 4 * this.control0X + 2 * this.control1X;
    const xc = -this.anchor0X + this.control0X;
    if (zeroIsh(xa)) {
      if (xb !== 0) checkX((2 * xc) / (-2 * xb));
    } else {
      const xs = xb * xb - 4 * xa * xc;
      if (xs >= 0) {
        checkX((-xb + Math.sqrt(xs)) / (2 * xa));
        checkX((-xb - Math.sqrt(xs)) / (2 * xa));
      }
    }

    const ya = -this.anchor0Y + 3 * this.control0Y - 3 * this.control1Y + this.anchor1Y;
    const yb = 2 * this.anchor0Y - 4 * this.control0Y + 2 * this.control1Y;
    const yc = -this.anchor0Y + this.control0Y;
    if (zeroIsh(ya)) {
      if (yb !== 0) checkY((2 * yc) / (-2 * yb));
    } else {
      const ys = yb * yb - 4 * ya * yc;
      if (ys >= 0) {
        checkY((-yb + Math.sqrt(ys)) / (2 * ya));
        checkY((-yb - Math.sqrt(ys)) / (2 * ya));
      }
    }
    bounds[0] = minX;
    bounds[1] = minY;
    bounds[2] = maxX;
    bounds[3] = maxY;
    return bounds;
  }

  /** @return {[Cubic, Cubic]} */
  split(t) {
    const u = 1 - t;
    const p = this.pointOnCurve(t);
    const {anchor0X, anchor0Y, control0X, control0Y, control1X, control1Y, anchor1X, anchor1Y} = this;
    return [
      Cubic.of(
        anchor0X,
        anchor0Y,
        anchor0X * u + control0X * t,
        anchor0Y * u + control0Y * t,
        anchor0X * (u * u) + control0X * (2 * u * t) + control1X * (t * t),
        anchor0Y * (u * u) + control0Y * (2 * u * t) + control1Y * (t * t),
        p.x,
        p.y,
      ),
      Cubic.of(
        p.x,
        p.y,
        control0X * (u * u) + control1X * (2 * u * t) + anchor1X * (t * t),
        control0Y * (u * u) + control1Y * (2 * u * t) + anchor1Y * (t * t),
        control1X * u + anchor1X * t,
        control1Y * u + anchor1Y * t,
        anchor1X,
        anchor1Y,
      ),
    ];
  }

  reverse() {
    return Cubic.of(
      this.anchor1X, this.anchor1Y, this.control1X, this.control1Y,
      this.control0X, this.control0Y, this.anchor0X, this.anchor0Y,
    );
  }

  plus(o) { return new Cubic(this.points.map((v, i) => v + o.points[i])); }
  times(x) { return new Cubic(this.points.map((v) => v * x)); }
  div(x) { return this.times(1 / x); }

  equals(other) {
    if (this === other) return true;
    if (!(other instanceof Cubic)) return false;
    return this.points.every((v, i) => v === other.points[i]);
  }

  toString() {
    return (
      `anchor0: (${this.anchor0X}, ${this.anchor0Y}) control0: (${this.control0X}, ${this.control0Y}), ` +
      `control1: (${this.control1X}, ${this.control1Y}), anchor1: (${this.anchor1X}, ${this.anchor1Y})`
    );
  }

  /** @param {PointTransformer} f */
  transformed(f) {
    const c = new MutableCubic();
    for (let i = 0; i < 8; i++) c.points[i] = this.points[i];
    c.transform(f);
    return c;
  }

  static straightLine(x0, y0, x1, y1) {
    return Cubic.of(
      x0,
      y0,
      interpolate(x0, x1, 1 / 3),
      interpolate(y0, y1, 1 / 3),
      interpolate(x0, x1, 2 / 3),
      interpolate(y0, y1, 2 / 3),
      x1,
      y1,
    );
  }

  static circularArc(centerX, centerY, x0, y0, x1, y1) {
    const p0d = directionVector(x0 - centerX, y0 - centerY);
    const p1d = directionVector(x1 - centerX, y1 - centerY);
    const rotatedP0 = rotate90(p0d);
    const rotatedP1 = rotate90(p1d);
    const isClockwise = dotProductXY(rotatedP0, x1 - centerX, y1 - centerY) >= 0;
    const cosa = dotProduct(p0d, p1d);
    if (cosa > 0.999) /* p0 ~= p1 */ return Cubic.straightLine(x0, y0, x1, y1);
    const k =
      ((((distance(x0 - centerX, y0 - centerY) * 4) / 3) *
        (Math.sqrt(2 * (1 - cosa)) - Math.sqrt(1 - cosa * cosa))) /
        (1 - cosa)) *
      (isClockwise ? 1 : -1);
    return Cubic.of(
      x0,
      y0,
      x0 + rotatedP0.x * k,
      y0 + rotatedP0.y * k,
      x1 - rotatedP1.x * k,
      y1 - rotatedP1.y * k,
      x1,
      y1,
    );
  }

  static empty(x0, y0) {
    return Cubic.of(x0, y0, x0, y0, x0, y0, x0, y0);
  }
}

export class MutableCubic extends Cubic {
  transformOnePoint(f, ix) {
    const [x, y] = f(this.points[ix], this.points[ix + 1]);
    this.points[ix] = x;
    this.points[ix + 1] = y;
  }

  /** @param {PointTransformer} f */
  transform(f) {
    this.transformOnePoint(f, 0);
    this.transformOnePoint(f, 2);
    this.transformOnePoint(f, 4);
    this.transformOnePoint(f, 6);
  }

  interpolate(c1, c2, progress) {
    for (let i = 0; i < 8; i++) {
      this.points[i] = interpolate(c1.points[i], c2.points[i], progress);
    }
  }
}

// ---------------------------------------------------------------------------
// Features.kt
// ---------------------------------------------------------------------------

export class Feature {
  /** @param {Cubic[]} cubics */
  constructor(cubics) {
    this.cubics = cubics;
  }

  static buildIgnorableFeature(cubics) { return Feature.validated(new Edge(cubics)); }
  static buildEdge(cubic) { return new Edge([cubic]); }
  static buildConvexCorner(cubics) { return Feature.validated(new Corner(cubics, true)); }
  static buildConcaveCorner(cubics) { return Feature.validated(new Corner(cubics, false)); }

  static validated(feature) {
    if (feature.cubics.length === 0) throw new Error('Features need at least one cubic.');
    if (!Feature.isContinuous(feature)) {
      throw new Error(
        'Feature must be continuous, with the anchor points of all cubics ' +
          'matching the anchor points of the preceding and succeeding cubics',
      );
    }
    return feature;
  }

  static isContinuous(feature) {
    let prevCubic = feature.cubics[0];
    for (let index = 1; index < feature.cubics.length; index++) {
      const cubic = feature.cubics[index];
      if (
        Math.abs(cubic.anchor0X - prevCubic.anchor1X) > DistanceEpsilon ||
        Math.abs(cubic.anchor0Y - prevCubic.anchor1Y) > DistanceEpsilon
      ) {
        return false;
      }
      prevCubic = cubic;
    }
    return true;
  }
}

export class Edge extends Feature {
  transformed(f) { return new Edge(this.cubics.map((c) => c.transformed(f))); }
  reversed() {
    const r = [];
    for (let i = this.cubics.length - 1; i >= 0; i--) r.push(this.cubics[i].reverse());
    return new Edge(r);
  }
  toString() { return 'Edge'; }
  get isIgnorableFeature() { return true; }
  get isEdge() { return true; }
  get isConvexCorner() { return false; }
  get isConcaveCorner() { return false; }
}

export class Corner extends Feature {
  constructor(cubics, convex = true) {
    super(cubics);
    this.convex = convex;
  }
  transformed(f) {
    return new Corner(this.cubics.map((c) => c.transformed(f)), this.convex);
  }
  reversed() {
    const r = [];
    for (let i = this.cubics.length - 1; i >= 0; i--) r.push(this.cubics[i].reverse());
    // TODO: b/369320447 - Revert flag negation when [RoundedPolygon] ignores orientation
    // for setting the flag
    return new Corner(r, !this.convex);
  }
  toString() {
    return `Corner: cubics=${this.cubics.map((c) => `[${c}]`).join(', ')} convex=${this.convex}`;
  }
  get isIgnorableFeature() { return false; }
  get isEdge() { return false; }
  get isConvexCorner() { return this.convex; }
  get isConcaveCorner() { return !this.convex; }
}
Feature.Edge = Edge;
Feature.Corner = Corner;

// ---------------------------------------------------------------------------
// FeatureDetector.kt
// ---------------------------------------------------------------------------

export function detectFeatures(cubics) {
  if (cubics.length === 0) return [];
  // TODO: b/372651969 Try different heuristics for corner grouping
  const out = [];
  let current = cubics[0];
  for (let i = 0; i < cubics.length; i++) {
    const next = cubics[(i + 1) % cubics.length];
    if (i < cubics.length - 1 && alignsIshWith(current, next)) {
      current = extendCubic(current, next);
      continue;
    }
    out.push(asFeature(current, next));
    if (!smoothesIntoIsh(current, next)) {
      out.push(asFeature(Cubic.empty(current.anchor1X, current.anchor1Y), next));
    }
    current = next;
  }
  return out;
}

const asFeature = (c, next) =>
  straightIsh(c) ? new Edge([c]) : new Corner([c], c.convexTo(next));

const straightIsh = (c) =>
  !c.zeroLength() &&
  collinearIsh(c.anchor0X, c.anchor0Y, c.anchor1X, c.anchor1Y, c.control0X, c.control0Y, RelaxedDistanceEpsilon) &&
  collinearIsh(c.anchor0X, c.anchor0Y, c.anchor1X, c.anchor1Y, c.control1X, c.control1Y, RelaxedDistanceEpsilon);

const smoothesIntoIsh = (c, next) =>
  collinearIsh(c.control1X, c.control1Y, next.control0X, next.control0Y, c.anchor1X, c.anchor1Y, RelaxedDistanceEpsilon);

const alignsIshWith = (c, next) =>
  (straightIsh(c) && straightIsh(next) && smoothesIntoIsh(c, next)) ||
  c.zeroLength() ||
  next.zeroLength();

const extendCubic = (a, b) =>
  a.zeroLength()
    ? Cubic.of(a.anchor0X, a.anchor0Y, b.control0X, b.control0Y, b.control1X, b.control1Y, b.anchor1X, b.anchor1Y)
    : Cubic.of(a.anchor0X, a.anchor0Y, a.control0X, a.control0Y, a.control1X, a.control1Y, b.anchor1X, b.anchor1Y);

// ---------------------------------------------------------------------------
// RoundedPolygon.kt
// ---------------------------------------------------------------------------

export class RoundedPolygon {
  /**
   * Internal primary constructor `RoundedPolygon(features, center)`.
   * @param {Feature[]} features
   * @param {Point} center
   */
  constructor(features, center) {
    this.features = features;
    this.center = center;
    this.cubics = buildCubics(features, center);

    let prevCubic = this.cubics[this.cubics.length - 1];
    for (let index = 0; index < this.cubics.length; index++) {
      const cubic = this.cubics[index];
      if (
        Math.abs(cubic.anchor0X - prevCubic.anchor1X) > DistanceEpsilon ||
        Math.abs(cubic.anchor0Y - prevCubic.anchor1Y) > DistanceEpsilon
      ) {
        throw new Error(
          'RoundedPolygon must be contiguous, with the anchor points of all curves ' +
            'matching the anchor points of the preceding and succeeding cubics',
        );
      }
      prevCubic = cubic;
    }
  }

  get centerX() { return this.center.x; }
  get centerY() { return this.center.y; }

  /** @param {PointTransformer} f */
  transformed(f) {
    const center = transformedPoint(this.center, f);
    return new RoundedPolygon(this.features.map((ft) => ft.transformed(f)), center);
  }

  normalized() {
    const bounds = this.calculateBounds();
    const width = bounds[2] - bounds[0];
    const height = bounds[3] - bounds[1];
    const side = Math.max(width, height);
    // Center the shape if bounds are not a square
    const offsetX = (side - width) / 2 - bounds[0]; /* left */
    const offsetY = (side - height) / 2 - bounds[1]; /* top */
    return this.transformed((x, y) => [(x + offsetX) / side, (y + offsetY) / side]);
  }

  toString() {
    return (
      '[RoundedPolygon. Cubics = ' + this.cubics.join(', ') +
      ' || Features = ' + this.features.join(', ') +
      ` || Center = (${this.centerX}, ${this.centerY})]`
    );
  }

  calculateMaxBounds(bounds = new Array(4).fill(0)) {
    if (bounds.length < 4) throw new Error('Required bounds size of 4');
    let maxDistSquared = 0;
    for (const cubic of this.cubics) {
      const anchorDistance = distanceSquared(cubic.anchor0X - this.centerX, cubic.anchor0Y - this.centerY);
      const middlePoint = cubic.pointOnCurve(0.5);
      const middleDistance = distanceSquared(middlePoint.x - this.centerX, middlePoint.y - this.centerY);
      maxDistSquared = Math.max(maxDistSquared, Math.max(anchorDistance, middleDistance));
    }
    const d = Math.sqrt(maxDistSquared);
    bounds[0] = this.centerX - d;
    bounds[1] = this.centerY - d;
    bounds[2] = this.centerX + d;
    bounds[3] = this.centerY + d;
    return bounds;
  }

  calculateBounds(bounds = new Array(4).fill(0), approximate = true) {
    if (bounds.length < 4) throw new Error('Required bounds size of 4');
    let minX = FLOAT_MAX_VALUE;
    let minY = FLOAT_MAX_VALUE;
    let maxX = FLOAT_MIN_VALUE;
    let maxY = FLOAT_MIN_VALUE;
    for (const cubic of this.cubics) {
      cubic.calculateBounds(bounds, approximate);
      minX = Math.min(minX, bounds[0]);
      minY = Math.min(minY, bounds[1]);
      maxX = Math.max(maxX, bounds[2]);
      maxY = Math.max(maxY, bounds[3]);
    }
    bounds[0] = minX;
    bounds[1] = minY;
    bounds[2] = maxX;
    bounds[3] = maxY;
    return bounds;
  }

  equals(other) {
    if (this === other) return true;
    if (!(other instanceof RoundedPolygon)) return false;
    return (
      this.features.length === other.features.length &&
      this.features.every((f, i) => f === other.features[i])
    );
  }

  /**
   * `RoundedPolygon(numVertices, radius, centerX, centerY, rounding, perVertexRounding)`
   */
  static fromNumVertices(
    numVertices,
    {radius = 1, centerX = 0, centerY = 0, rounding = CornerRounding.Unrounded, perVertexRounding = null} = {},
  ) {
    return RoundedPolygon.fromVertices(verticesFromNumVerts(numVertices, radius, centerX, centerY), {
      rounding,
      perVertexRounding,
      centerX,
      centerY,
    });
  }

  /** `RoundedPolygon(source: RoundedPolygon)` */
  static copy(source) {
    return new RoundedPolygon(source.features, source.center);
  }

  /**
   * `RoundedPolygon(vertices, rounding, perVertexRounding, centerX, centerY)`
   * @param {number[]} vertices
   */
  static fromVertices(
    vertices,
    {
      rounding = CornerRounding.Unrounded,
      perVertexRounding = null,
      centerX = FLOAT_MIN_VALUE,
      centerY = FLOAT_MIN_VALUE,
    } = {},
  ) {
    if (vertices.length < 6) throw new Error('Polygons must have at least 3 vertices');
    if (vertices.length % 2 === 1) throw new Error('The vertices array should have even size');
    if (perVertexRounding != null && perVertexRounding.length * 2 !== vertices.length) {
      throw new Error(
        'perVertexRounding list should be either null or ' +
          'the same size as the number of vertices (vertices.size / 2)',
      );
    }
    const corners = [];
    const n = vertices.length / 2;
    const roundedCorners = [];
    for (let i = 0; i < n; i++) {
      const vtxRounding = perVertexRounding?.[i] ?? rounding;
      const prevIndex = ((i + n - 1) % n) * 2;
      const nextIndex = ((i + 1) % n) * 2;
      roundedCorners.push(
        new RoundedCorner(
          Point(vertices[prevIndex], vertices[prevIndex + 1]),
          Point(vertices[i * 2], vertices[i * 2 + 1]),
          Point(vertices[nextIndex], vertices[nextIndex + 1]),
          vtxRounding,
        ),
      );
    }

    // For each side, check if we have enough space to do the cuts needed, and if not split
    // the available space, first for round cuts, then for smoothing if there is space left.
    const cutAdjusts = [];
    for (let ix = 0; ix < n; ix++) {
      const expectedRoundCut =
        roundedCorners[ix].expectedRoundCut + roundedCorners[(ix + 1) % n].expectedRoundCut;
      const expectedCut = roundedCorners[ix].expectedCut + roundedCorners[(ix + 1) % n].expectedCut;
      const vtxX = vertices[ix * 2];
      const vtxY = vertices[ix * 2 + 1];
      const nextVtxX = vertices[((ix + 1) % n) * 2];
      const nextVtxY = vertices[((ix + 1) % n) * 2 + 1];
      const sideSize = distance(vtxX - nextVtxX, vtxY - nextVtxY);
      if (expectedRoundCut > sideSize) {
        cutAdjusts.push([sideSize / expectedRoundCut, 0]);
      } else if (expectedCut > sideSize) {
        cutAdjusts.push([1, (sideSize - expectedRoundCut) / (expectedCut - expectedRoundCut)]);
      } else {
        cutAdjusts.push([1, 1]);
      }
    }
    for (let i = 0; i < n; i++) {
      const allowedCuts = [];
      for (let delta = 0; delta <= 1; delta++) {
        const [roundCutRatio, cutRatio] = cutAdjusts[(i + n - 1 + delta) % n];
        allowedCuts.push(
          roundedCorners[i].expectedRoundCut * roundCutRatio +
            (roundedCorners[i].expectedCut - roundedCorners[i].expectedRoundCut) * cutRatio,
        );
      }
      corners.push(roundedCorners[i].getCubics(allowedCuts[0], allowedCuts[1]));
    }
    const tempFeatures = [];
    for (let i = 0; i < n; i++) {
      const prevVtxIndex = (i + n - 1) % n;
      const nextVtxIndex = (i + 1) % n;
      const currVertex = Point(vertices[i * 2], vertices[i * 2 + 1]);
      const prevVertex = Point(vertices[prevVtxIndex * 2], vertices[prevVtxIndex * 2 + 1]);
      const nextVertex = Point(vertices[nextVtxIndex * 2], vertices[nextVtxIndex * 2 + 1]);
      const isConvex = convex(prevVertex, currVertex, nextVertex);
      tempFeatures.push(new Corner(corners[i], isConvex));
      const last = corners[i][corners[i].length - 1];
      const nextFirst = corners[(i + 1) % n][0];
      tempFeatures.push(
        new Edge([Cubic.straightLine(last.anchor1X, last.anchor1Y, nextFirst.anchor0X, nextFirst.anchor0Y)]),
      );
    }

    const c =
      centerX === FLOAT_MIN_VALUE || centerY === FLOAT_MIN_VALUE
        ? calculateCenter(vertices)
        : Point(centerX, centerY);
    return RoundedPolygon.fromFeatures(tempFeatures, c.x, c.y);
  }

  /** `RoundedPolygon(features, centerX = NaN, centerY = NaN)` */
  static fromFeatures(features, centerX = NaN, centerY = NaN) {
    if (features.length < 2) throw new Error('Polygons must have at least 2 features');
    const vertices = [];
    for (const feature of features) {
      for (const cubic of feature.cubics) {
        vertices.push(cubic.anchor0X, cubic.anchor0Y);
      }
    }
    const cX = Number.isNaN(centerX) ? calculateCenter(vertices).x : centerX;
    const cY = Number.isNaN(centerY) ? calculateCenter(vertices).y : centerY;
    return new RoundedPolygon(features, Point(cX, cY));
  }
}

function buildCubics(features, center) {
  const out = [];
  // The first/last mechanism here ensures that the final anchor point in the shape
  // exactly matches the first anchor point.
  let firstCubic = null;
  let lastCubic = null;
  let firstFeatureSplitStart = null;
  let firstFeatureSplitEnd = null;
  if (features.length > 0 && features[0].cubics.length === 3) {
    const centerCubic = features[0].cubics[1];
    const [start, end] = centerCubic.split(0.5);
    firstFeatureSplitStart = [features[0].cubics[0], start];
    firstFeatureSplitEnd = [end, features[0].cubics[2]];
  }
  // iterating one past the features list size allows us to insert the initial split
  // cubic if it exists
  for (let i = 0; i <= features.length; i++) {
    let featureCubics;
    if (i === 0 && firstFeatureSplitEnd != null) featureCubics = firstFeatureSplitEnd;
    else if (i === features.length) {
      if (firstFeatureSplitStart != null) featureCubics = firstFeatureSplitStart;
      else break;
    } else featureCubics = features[i].cubics;
    for (const cubic of featureCubics) {
      // Skip zero-length curves; they add nothing and can trigger rendering artifacts
      if (!cubic.zeroLength()) {
        if (lastCubic != null) out.push(lastCubic);
        lastCubic = cubic;
        if (firstCubic == null) firstCubic = cubic;
      } else if (lastCubic != null) {
        // Make the last cubic use the latest anchor point, always.
        lastCubic = new Cubic(lastCubic.points.slice());
        lastCubic.points[6] = cubic.anchor1X;
        lastCubic.points[7] = cubic.anchor1Y;
      }
    }
  }
  if (lastCubic != null && firstCubic != null) {
    out.push(
      Cubic.of(
        lastCubic.anchor0X, lastCubic.anchor0Y,
        lastCubic.control0X, lastCubic.control0Y,
        lastCubic.control1X, lastCubic.control1Y,
        firstCubic.anchor0X, firstCubic.anchor0Y,
      ),
    );
  } else {
    // Empty / 0-sized polygon.
    out.push(Cubic.of(center.x, center.y, center.x, center.y, center.x, center.y, center.x, center.y));
  }
  return out;
}

export function calculateCenter(vertices) {
  let cumulativeX = 0;
  let cumulativeY = 0;
  let index = 0;
  while (index < vertices.length) {
    cumulativeX += vertices[index++];
    cumulativeY += vertices[index++];
  }
  // Kotlin: vertices.size / 2 is an Int division (size is always even here).
  const n = Math.trunc(vertices.length / 2);
  return Point(cumulativeX / n, cumulativeY / n);
}

class RoundedCorner {
  constructor(p0, p1, p2, rounding = null) {
    this.p0 = p0;
    this.p1 = p1;
    this.p2 = p2;
    this.rounding = rounding;
    const v01 = minus(p0, p1);
    const v21 = minus(p2, p1);
    const d01 = getDistance(v01);
    const d21 = getDistance(v21);
    if (d01 > 0 && d21 > 0) {
      this.d1 = div(v01, d01);
      this.d2 = div(v21, d21);
      this.cornerRadius = rounding?.radius ?? 0;
      this.smoothing = rounding?.smoothing ?? 0;
      // cosine of angle at p1 is dot product of unit vectors to the other two vertices
      this.cosAngle = dotProduct(this.d1, this.d2);
      // identity: sin^2 + cos^2 = 1
      this.sinAngle = Math.sqrt(1 - square(this.cosAngle));
      // tan(A/2) = sinA/(1 + cosA), where tan(A/2) = radius/cut
      this.expectedRoundCut =
        this.sinAngle > 1e-3 ? (this.cornerRadius * (this.cosAngle + 1)) / this.sinAngle : 0;
    } else {
      this.d1 = Point(0, 0);
      this.d2 = Point(0, 0);
      this.cornerRadius = 0;
      this.smoothing = 0;
      this.cosAngle = 0;
      this.sinAngle = 0;
      this.expectedRoundCut = 0;
    }
    this.center = Point(0, 0);
  }

  // smoothing changes the actual cut. 0 is same as expectedRoundCut, 1 doubles it
  get expectedCut() {
    return (1 + this.smoothing) * this.expectedRoundCut;
  }

  getCubics(allowedCut0, allowedCut1 = allowedCut0) {
    const allowedCut = Math.min(allowedCut0, allowedCut1);
    const {p0, p1, p2, d1, d2} = this;
    if (
      this.expectedRoundCut < DistanceEpsilon ||
      allowedCut < DistanceEpsilon ||
      this.cornerRadius < DistanceEpsilon
    ) {
      this.center = p1;
      return [Cubic.straightLine(p1.x, p1.y, p1.x, p1.y)];
    }
    const actualRoundCut = Math.min(allowedCut, this.expectedRoundCut);
    const actualSmoothing0 = this.calculateActualSmoothingValue(allowedCut0);
    const actualSmoothing1 = this.calculateActualSmoothingValue(allowedCut1);
    const actualR = (this.cornerRadius * actualRoundCut) / this.expectedRoundCut;
    const centerDistance = Math.sqrt(square(actualR) + square(actualRoundCut));
    this.center = plus(p1, times(getDirection(div(plus(d1, d2), 2)), centerDistance));
    const circleIntersection0 = plus(p1, times(d1, actualRoundCut));
    const circleIntersection2 = plus(p1, times(d2, actualRoundCut));
    const flanking0 = this.computeFlankingCurve(
      actualRoundCut, actualSmoothing0, p1, p0,
      circleIntersection0, circleIntersection2, this.center, actualR,
    );
    const flanking2 = this.computeFlankingCurve(
      actualRoundCut, actualSmoothing1, p1, p2,
      circleIntersection2, circleIntersection0, this.center, actualR,
    ).reverse();
    return [
      flanking0,
      Cubic.circularArc(
        this.center.x, this.center.y,
        flanking0.anchor1X, flanking0.anchor1Y,
        flanking2.anchor0X, flanking2.anchor0Y,
      ),
      flanking2,
    ];
  }

  calculateActualSmoothingValue(allowedCut) {
    if (allowedCut > this.expectedCut) return this.smoothing;
    if (allowedCut > this.expectedRoundCut) {
      return (
        (this.smoothing * (allowedCut - this.expectedRoundCut)) /
        (this.expectedCut - this.expectedRoundCut)
      );
    }
    return 0;
  }

  computeFlankingCurve(
    actualRoundCut, actualSmoothingValues, corner, sideStart,
    circleSegmentIntersection, otherCircleSegmentIntersection, circleCenter, actualR,
  ) {
    const sideDirection = getDirection(minus(sideStart, corner));
    const curveStart = plus(corner, times(sideDirection, actualRoundCut * (1 + actualSmoothingValues)));
    const p = interpolatePoint(
      circleSegmentIntersection,
      div(plus(circleSegmentIntersection, otherCircleSegmentIntersection), 2),
      actualSmoothingValues,
    );
    const curveEnd = plus(
      circleCenter,
      times(directionVector(p.x - circleCenter.x, p.y - circleCenter.y), actualR),
    );
    const circleTangent = rotate90(minus(curveEnd, circleCenter));
    const anchorEnd =
      lineIntersection(sideStart, sideDirection, curveEnd, circleTangent) ?? circleSegmentIntersection;
    // 2/3 seems to come from design tools?
    const anchorStart = div(plus(curveStart, times(anchorEnd, 2)), 3);
    return Cubic.fromPoints(curveStart, anchorStart, anchorEnd, curveEnd);
  }
}

function lineIntersection(p0, d0, p1, d1) {
  const rotatedD1 = rotate90(d1);
  const den = dotProduct(d0, rotatedD1);
  if (Math.abs(den) < DistanceEpsilon) return null;
  const num = dotProduct(minus(p1, p0), rotatedD1);
  if (Math.abs(den) < DistanceEpsilon * Math.abs(num)) return null;
  const k = num / den;
  return plus(p0, times(d0, k));
}

function verticesFromNumVerts(numVertices, radius, centerX, centerY) {
  const result = [];
  for (let i = 0; i < numVertices; i++) {
    const vertex = plus(
      radialToCartesian(radius, (FloatPi / numVertices) * 2 * i),
      Point(centerX, centerY),
    );
    result.push(vertex.x, vertex.y);
  }
  return result;
}

// ---------------------------------------------------------------------------
// Shapes.kt
// ---------------------------------------------------------------------------

export function circle({numVertices = 8, radius = 1, centerX = 0, centerY = 0} = {}) {
  if (numVertices < 3) throw new Error('Circle must have at least three vertices');
  // Half of the angle between two adjacent vertices on the polygon
  const theta = FloatPi / numVertices;
  // Radius of the underlying RoundedPolygon object given the desired radius of the circle
  const polygonRadius = radius / Math.cos(theta);
  return RoundedPolygon.fromNumVertices(numVertices, {
    rounding: new CornerRounding(radius),
    radius: polygonRadius,
    centerX,
    centerY,
  });
}

export function rectangle({
  width = 2,
  height = 2,
  rounding = CornerRounding.Unrounded,
  perVertexRounding = null,
  centerX = 0,
  centerY = 0,
} = {}) {
  const left = centerX - width / 2;
  const top = centerY - height / 2;
  const right = centerX + width / 2;
  const bottom = centerY + height / 2;
  return RoundedPolygon.fromVertices([right, bottom, left, bottom, left, top, right, top], {
    rounding,
    perVertexRounding,
    centerX,
    centerY,
  });
}

export function star(
  numVerticesPerRadius,
  {
    radius = 1,
    innerRadius = 0.5,
    rounding = CornerRounding.Unrounded,
    innerRounding = null,
    perVertexRounding = null,
    centerX = 0,
    centerY = 0,
  } = {},
) {
  if (radius <= 0 || innerRadius <= 0) throw new Error('Star radii must both be greater than 0');
  if (innerRadius >= radius) throw new Error('innerRadius must be less than radius');
  let pvRounding = perVertexRounding;
  if (pvRounding == null && innerRounding != null) {
    pvRounding = [];
    for (let i = 0; i < numVerticesPerRadius; i++) pvRounding.push(rounding, innerRounding);
  }
  return RoundedPolygon.fromVertices(
    starVerticesFromNumVerts(numVerticesPerRadius, radius, innerRadius, centerX, centerY),
    {rounding, perVertexRounding: pvRounding, centerX, centerY},
  );
}

export function pill({width = 2, height = 1, smoothing = 0, centerX = 0, centerY = 0} = {}) {
  if (!(width > 0 && height > 0)) throw new Error('Pill shapes must have positive width and height');
  const wHalf = width / 2;
  const hHalf = height / 2;
  return RoundedPolygon.fromVertices(
    [
      wHalf + centerX, hHalf + centerY,
      -wHalf + centerX, hHalf + centerY,
      -wHalf + centerX, -hHalf + centerY,
      wHalf + centerX, -hHalf + centerY,
    ],
    {rounding: new CornerRounding(Math.min(wHalf, hHalf), smoothing), centerX, centerY},
  );
}

export function pillStar({
  width = 2,
  height = 1,
  numVerticesPerRadius = 8,
  innerRadiusRatio = 0.5,
  rounding = CornerRounding.Unrounded,
  innerRounding = null,
  perVertexRounding = null,
  vertexSpacing = 0.5,
  startLocation = 0,
  centerX = 0,
  centerY = 0,
} = {}) {
  if (!(width > 0 && height > 0)) throw new Error('Pill shapes must have positive width and height');
  if (!(innerRadiusRatio > 0 && innerRadiusRatio <= 1)) {
    throw new Error('innerRadius must be between 0 and 1');
  }
  let pvRounding = perVertexRounding;
  if (pvRounding == null && innerRounding != null) {
    pvRounding = [];
    for (let i = 0; i < numVerticesPerRadius; i++) pvRounding.push(rounding, innerRounding);
  }
  return RoundedPolygon.fromVertices(
    pillStarVerticesFromNumVerts(
      numVerticesPerRadius, width, height, innerRadiusRatio,
      vertexSpacing, startLocation, centerX, centerY,
    ),
    {rounding, perVertexRounding: pvRounding, centerX, centerY},
  );
}

function pillStarVerticesFromNumVerts(
  numVerticesPerRadius, width, height, innerRadius, vertexSpacing, startLocation, centerX, centerY,
) {
  const endcapRadius = Math.min(width, height);
  const vSegLen = Math.max(height - width, 0);
  const hSegLen = Math.max(width - height, 0);
  const vSegHalf = vSegLen / 2;
  const hSegHalf = hSegLen / 2;
  const circlePerimeter = TwoPi * endcapRadius * interpolate(innerRadius, 1, vertexSpacing);
  const perimeter = 2 * hSegLen + 2 * vSegLen + circlePerimeter;

  const sections = new Array(11).fill(0);
  sections[0] = 0;
  sections[1] = vSegLen / 2;
  sections[2] = sections[1] + circlePerimeter / 4;
  sections[3] = sections[2] + hSegLen;
  sections[4] = sections[3] + circlePerimeter / 4;
  sections[5] = sections[4] + vSegLen;
  sections[6] = sections[5] + circlePerimeter / 4;
  sections[7] = sections[6] + hSegLen;
  sections[8] = sections[7] + circlePerimeter / 4;
  sections[9] = sections[8] + vSegLen / 2;
  sections[10] = perimeter;

  const tPerVertex = perimeter / (2 * numVerticesPerRadius);
  let inner = false;
  let currSecIndex = 0;
  let secStart = 0;
  let secEnd = sections[1];
  let t = startLocation * perimeter;
  const result = [];
  const rectBR = Point(hSegHalf, vSegHalf);
  const rectBL = Point(-hSegHalf, vSegHalf);
  const rectTL = Point(-hSegHalf, -vSegHalf);
  const rectTR = Point(hSegHalf, -vSegHalf);
  for (let i = 0; i < numVerticesPerRadius * 2; i++) {
    const boundedT = t % perimeter;
    if (boundedT < secStart) currSecIndex = 0;
    while (boundedT >= sections[(currSecIndex + 1) % sections.length]) {
      currSecIndex = (currSecIndex + 1) % sections.length;
      secStart = sections[currSecIndex];
      secEnd = sections[(currSecIndex + 1) % sections.length];
    }
    const tInSection = boundedT - secStart;
    const tProportion = tInSection / (secEnd - secStart);
    const currRadius = inner ? endcapRadius * innerRadius : endcapRadius;
    let vertex;
    switch (currSecIndex) {
      case 0: vertex = Point(currRadius, tProportion * vSegHalf); break;
      case 1: vertex = plus(radialToCartesian(currRadius, (tProportion * FloatPi) / 2), rectBR); break;
      case 2: vertex = Point(hSegHalf - tProportion * hSegLen, currRadius); break;
      case 3: vertex = plus(radialToCartesian(currRadius, FloatPi / 2 + (tProportion * FloatPi) / 2), rectBL); break;
      case 4: vertex = Point(-currRadius, vSegHalf - tProportion * vSegLen); break;
      case 5: vertex = plus(radialToCartesian(currRadius, FloatPi + (tProportion * FloatPi) / 2), rectTL); break;
      case 6: vertex = Point(-hSegHalf + tProportion * hSegLen, -currRadius); break;
      case 7: vertex = plus(radialToCartesian(currRadius, FloatPi * 1.5 + (tProportion * FloatPi) / 2), rectTR); break;
      default: vertex = Point(currRadius, -vSegHalf + tProportion * vSegHalf); // 8
    }
    result.push(vertex.x + centerX, vertex.y + centerY);
    t += tPerVertex;
    inner = !inner;
  }
  return result;
}

function starVerticesFromNumVerts(numVerticesPerRadius, radius, innerRadius, centerX, centerY) {
  const result = [];
  for (let i = 0; i < numVerticesPerRadius; i++) {
    let vertex = radialToCartesian(radius, (FloatPi / numVerticesPerRadius) * 2 * i);
    result.push(vertex.x + centerX, vertex.y + centerY);
    vertex = radialToCartesian(innerRadius, (FloatPi / numVerticesPerRadius) * (2 * i + 1));
    result.push(vertex.x + centerX, vertex.y + centerY);
  }
  return result;
}

RoundedPolygon.circle = circle;
RoundedPolygon.rectangle = rectangle;
RoundedPolygon.star = star;
RoundedPolygon.pill = pill;
RoundedPolygon.pillStar = pillStar;

// ---------------------------------------------------------------------------
// FloatMapping.kt
// ---------------------------------------------------------------------------

export function progressInRange(progress, progressFrom, progressTo) {
  return progressTo >= progressFrom
    ? inRange(progress, progressFrom, progressTo)
    : progress >= progressFrom || progress <= progressTo;
}

export function linearMap(xValues, yValues, x) {
  if (!inRange(x, 0, 1)) throw new Error(`Invalid progress: ${x}`);
  const segmentStartIndex = xValues.findIndex((_, it) =>
    progressInRange(x, xValues[it], xValues[(it + 1) % xValues.length]),
  );
  if (segmentStartIndex < 0) throw new Error('Collection contains no element matching the predicate.');
  const segmentEndIndex = (segmentStartIndex + 1) % xValues.length;
  const segmentSizeX = positiveModulo(xValues[segmentEndIndex] - xValues[segmentStartIndex], 1);
  const segmentSizeY = positiveModulo(yValues[segmentEndIndex] - yValues[segmentStartIndex], 1);
  const positionInSegment =
    segmentSizeX < 0.001 ? 0.5 : positiveModulo(x - xValues[segmentStartIndex], 1) / segmentSizeX;
  return positiveModulo(yValues[segmentStartIndex] + segmentSizeY * positionInSegment, 1);
}

export class DoubleMapper {
  /** @param {...[number, number]} mappings */
  constructor(...mappings) {
    this.sourceValues = mappings.map((m) => m[0]);
    this.targetValues = mappings.map((m) => m[1]);
    // Both source values and target values should be monotonically increasing, with the
    // exception of maybe one time (since progress wraps around).
    validateProgress(this.sourceValues);
    validateProgress(this.targetValues);
  }
  map(x) { return linearMap(this.sourceValues, this.targetValues, x); }
  mapBack(x) { return linearMap(this.targetValues, this.sourceValues, x); }
}
DoubleMapper.Identity = new DoubleMapper([0, 0], [0.5, 0.5]);

export function validateProgress(p) {
  let prev = p[p.length - 1];
  let wraps = 0;
  for (let i = 0; i < p.length; i++) {
    const curr = p[i];
    if (!(curr >= 0 && curr < 1)) {
      throw new Error('FloatMapping - Progress outside of range: ' + p.join(', '));
    }
    if (!(progressDistance(curr, prev) > DistanceEpsilon)) {
      throw new Error('FloatMapping - Progress repeats a value: ' + p.join(', '));
    }
    if (curr < prev) {
      wraps++;
      if (wraps > 1) throw new Error('FloatMapping - Progress wraps more than once: ' + p.join(', '));
    }
    prev = curr;
  }
}

// Since progress wraps around, we consider a difference of 0.99 as a distance of 0.01
export function progressDistance(p1, p2) {
  const it = Math.abs(p1 - p2);
  return Math.min(it, 1 - it);
}

// ---------------------------------------------------------------------------
// FeatureMapping.kt
// ---------------------------------------------------------------------------

/** `data class ProgressableFeature(progress, feature)` */
export class ProgressableFeature {
  constructor(progress, feature) {
    this.progress = progress;
    this.feature = feature;
  }
}

export function featureMapper(features1, features2) {
  // We only use corners for this mapping.
  const filteredFeatures1 = features1.filter((f) => f.feature instanceof Corner);
  const filteredFeatures2 = features2.filter((f) => f.feature instanceof Corner);
  const featureProgressMapping = doMapping(filteredFeatures1, filteredFeatures2);
  return new DoubleMapper(...featureProgressMapping);
}

export function doMapping(features1, features2) {
  const distanceVertexList = [];
  for (const f1 of features1) {
    for (const f2 of features2) {
      const d = featureDistSquared(f1.feature, f2.feature);
      if (d !== FLOAT_MAX_VALUE) distanceVertexList.push({distance: d, f1, f2});
    }
  }
  // Array.prototype.sort is stable, like Kotlin's sortedBy.
  distanceVertexList.sort((a, b) => a.distance - b.distance);

  // Special cases.
  if (distanceVertexList.length === 0) return IdentityMapping;
  if (distanceVertexList.length === 1) {
    const f1 = distanceVertexList[0].f1.progress;
    const f2 = distanceVertexList[0].f2.progress;
    return [
      [f1, f2],
      [(f1 + 0.5) % 1, (f2 + 0.5) % 1],
    ];
  }
  const helper = new MappingHelper();
  for (const it of distanceVertexList) helper.addMapping(it.f1, it.f2);
  return helper.mapping;
}

const IdentityMapping = [
  [0, 0],
  [0.5, 0.5],
];

/** Kotlin `List.binarySearchBy`: index if found, else `-(insertionPoint) - 1`. */
function binarySearchBy(list, key, selector) {
  let low = 0;
  let high = list.length - 1;
  while (low <= high) {
    const mid = (low + high) >>> 1;
    const midVal = selector(list[mid]);
    if (midVal < key) low = mid + 1;
    else if (midVal > key) high = mid - 1;
    else return mid;
  }
  return -(low + 1);
}

class MappingHelper {
  constructor() {
    /** @type {[number, number][]} sorted by the first element */
    this.mapping = [];
    this.usedF1 = new Set();
    this.usedF2 = new Set();
  }

  addMapping(f1, f2) {
    // We don't want to map the same feature twice.
    if (this.usedF1.has(f1) || this.usedF2.has(f2)) return;

    const index = binarySearchBy(this.mapping, f1.progress, (it) => it[0]);
    if (!(index < 0)) throw new Error("There can't be two features with the same progress");

    const insertionIndex = -index - 1;
    const n = this.mapping.length;

    if (n >= 1) {
      const [before1, before2] = this.mapping[(insertionIndex + n - 1) % n];
      const [after1, after2] = this.mapping[insertionIndex % n];
      if (
        progressDistance(f1.progress, before1) < DistanceEpsilon ||
        progressDistance(f1.progress, after1) < DistanceEpsilon ||
        progressDistance(f2.progress, before2) < DistanceEpsilon ||
        progressDistance(f2.progress, after2) < DistanceEpsilon
      ) {
        return;
      }
      // When we have 2 or more elements, we need to ensure we are not adding extra crossings.
      if (n > 1 && !progressInRange(f2.progress, before2, after2)) return;
    }

    this.mapping.splice(insertionIndex, 0, [f1.progress, f2.progress]);
    this.usedF1.add(f1);
    this.usedF2.add(f2);
  }
}

export function featureDistSquared(f1, f2) {
  // TODO: We might want to enable concave-convex matching in some situations.
  if (f1 instanceof Corner && f2 instanceof Corner && f1.convex !== f2.convex) {
    return FLOAT_MAX_VALUE;
  }
  return getDistanceSquared(minus(featureRepresentativePoint(f1), featureRepresentativePoint(f2)));
}

export function featureRepresentativePoint(feature) {
  const first = feature.cubics[0];
  const last = feature.cubics[feature.cubics.length - 1];
  const x = (first.anchor0X + last.anchor1X) / 2;
  const y = (first.anchor0Y + last.anchor1Y) / 2;
  return Point(x, y);
}

// ---------------------------------------------------------------------------
// PolygonMeasure.kt
// ---------------------------------------------------------------------------

export class LengthMeasurer {
  constructor() {
    // The minimum number needed to achieve up to 98.5% accuracy from the true arc length
    this.segments = 3;
  }
  measureCubic(c) { return this.closestProgressTo(c, Infinity)[1]; }
  findCubicCutPoint(c, m) { return this.closestProgressTo(c, m)[0]; }
  closestProgressTo(cubic, threshold) {
    let total = 0;
    let remainder = threshold;
    let prev = Point(cubic.anchor0X, cubic.anchor0Y);
    for (let i = 1; i <= this.segments; i++) {
      const progress = i / this.segments;
      const point = cubic.pointOnCurve(progress);
      const segment = getDistance(minus(point, prev));
      if (segment >= remainder) {
        return [progress - (1.0 - remainder / segment) / this.segments, threshold];
      }
      remainder -= segment;
      total += segment;
      prev = point;
    }
    return [1.0, total];
  }
}

export class MeasuredCubic {
  constructor(polygon, cubic, startOutlineProgress, endOutlineProgress) {
    if (!(endOutlineProgress >= startOutlineProgress)) {
      throw new Error('endOutlineProgress is expected to be equal or greater than startOutlineProgress');
    }
    this.polygon = polygon; // Kotlin inner class: access to the outer measurer
    this.cubic = cubic;
    this.measuredSize = polygon.measurer.measureCubic(cubic);
    this.startOutlineProgress = startOutlineProgress;
    this.endOutlineProgress = endOutlineProgress;
  }

  updateProgressRange(startOutlineProgress = this.startOutlineProgress, endOutlineProgress = this.endOutlineProgress) {
    if (!(endOutlineProgress >= startOutlineProgress)) {
      throw new Error('endOutlineProgress is expected to be equal or greater than startOutlineProgress');
    }
    this.startOutlineProgress = startOutlineProgress;
    this.endOutlineProgress = endOutlineProgress;
  }

  /** @return {[MeasuredCubic, MeasuredCubic]} */
  cutAtProgress(cutOutlineProgress) {
    const boundedCutOutlineProgress = coerceIn(cutOutlineProgress, this.startOutlineProgress, this.endOutlineProgress);
    const outlineProgressSize = this.endOutlineProgress - this.startOutlineProgress;
    const progressFromStart = boundedCutOutlineProgress - this.startOutlineProgress;
    const relativeProgress = progressFromStart / outlineProgressSize;
    const t = this.polygon.measurer.findCubicCutPoint(this.cubic, relativeProgress * this.measuredSize);
    if (!inRange(t, 0, 1)) throw new Error('Cubic cut point is expected to be between 0 and 1');
    const [c1, c2] = this.cubic.split(t);
    return [
      new MeasuredCubic(this.polygon, c1, this.startOutlineProgress, boundedCutOutlineProgress),
      new MeasuredCubic(this.polygon, c2, boundedCutOutlineProgress, this.endOutlineProgress),
    ];
  }

  toString() {
    return `MeasuredCubic(outlineProgress=[${this.startOutlineProgress} .. ${this.endOutlineProgress}], size=${this.measuredSize}, cubic=${this.cubic})`;
  }
}

export class MeasuredPolygon {
  /**
   * @param {LengthMeasurer} measurer
   * @param {ProgressableFeature[]} features
   * @param {Cubic[]} cubics
   * @param {number[]} outlineProgress
   */
  constructor(measurer, features, cubics, outlineProgress) {
    if (outlineProgress.length !== cubics.length + 1) {
      throw new Error('Outline progress size is expected to be the cubics size + 1');
    }
    if (outlineProgress[0] !== 0) throw new Error('First outline progress value is expected to be zero');
    if (outlineProgress[outlineProgress.length - 1] !== 1) {
      throw new Error('Last outline progress value is expected to be one');
    }
    this.measurer = measurer;
    this.features = features;
    const measuredCubics = [];
    let startOutlineProgress = 0;
    for (let index = 0; index < cubics.length; index++) {
      // Filter out "empty" cubics
      if (outlineProgress[index + 1] - outlineProgress[index] > DistanceEpsilon) {
        measuredCubics.push(new MeasuredCubic(this, cubics[index], startOutlineProgress, outlineProgress[index + 1]));
        // The next measured cubic will start exactly where this one ends.
        startOutlineProgress = outlineProgress[index + 1];
      }
    }
    // We could have removed empty cubics at the end. Ensure the last measured cubic ends at 1f
    measuredCubics[measuredCubics.length - 1].updateProgressRange(undefined, 1);
    this.cubics = measuredCubics;
  }

  get size() { return this.cubics.length; }
  get(index) { return this.cubics[index]; }
  getOrNull(index) { return index >= 0 && index < this.cubics.length ? this.cubics[index] : null; }

  cutAndShift(cuttingPoint) {
    if (!inRange(cuttingPoint, 0, 1)) throw new Error('Cutting point is expected to be between 0 and 1');
    if (cuttingPoint < DistanceEpsilon) return this;

    const targetIndex = this.cubics.findIndex((it) =>
      inRange(cuttingPoint, it.startOutlineProgress, it.endOutlineProgress),
    );
    const target = this.cubics[targetIndex];
    const [b1, b2] = target.cutAtProgress(cuttingPoint);

    const retCubics = [b2.cubic];
    for (let i = 1; i < this.cubics.length; i++) {
      retCubics.push(this.cubics[(i + targetIndex) % this.cubics.length].cubic);
    }
    retCubics.push(b1.cubic);

    const retOutlineProgress = [];
    for (let index = 0; index < this.cubics.length + 2; index++) {
      if (index === 0) retOutlineProgress.push(0);
      else if (index === this.cubics.length + 1) retOutlineProgress.push(1);
      else {
        const cubicIndex = (targetIndex + index - 1) % this.cubics.length;
        retOutlineProgress.push(positiveModulo(this.cubics[cubicIndex].endOutlineProgress - cuttingPoint, 1));
      }
    }

    const newFeatures = this.features.map(
      (f) => new ProgressableFeature(positiveModulo(f.progress - cuttingPoint, 1), f.feature),
    );
    return new MeasuredPolygon(this.measurer, newFeatures, retCubics, retOutlineProgress);
  }

  static measurePolygon(measurer, polygon) {
    const cubics = [];
    const featureToCubic = [];
    for (const feature of polygon.features) {
      for (let cubicIndex = 0; cubicIndex < feature.cubics.length; cubicIndex++) {
        if (feature instanceof Corner && cubicIndex === Math.trunc(feature.cubics.length / 2)) {
          featureToCubic.push([feature, cubics.length]);
        }
        cubics.push(feature.cubics[cubicIndex]);
      }
    }
    const measures = [0];
    for (const cubic of cubics) {
      const it = measurer.measureCubic(cubic);
      if (!(it >= 0)) throw new Error('Measured cubic is expected to be greater or equal to zero');
      measures.push(measures[measures.length - 1] + it);
    }
    const totalMeasure = measures[measures.length - 1];
    const outlineProgress = measures.map((m) => m / totalMeasure);

    const features = featureToCubic.map(
      ([feature, ix]) =>
        new ProgressableFeature(positiveModulo((outlineProgress[ix] + outlineProgress[ix + 1]) / 2, 1), feature),
    );
    return new MeasuredPolygon(measurer, features, cubics, outlineProgress);
  }
}

// ---------------------------------------------------------------------------
// Morph.kt
// ---------------------------------------------------------------------------

export class Morph {
  /**
   * @param {RoundedPolygon} start
   * @param {RoundedPolygon} end
   */
  constructor(start, end) {
    this.start = start;
    this.end = end;
    /** @type {[Cubic, Cubic][]} */
    this.morphMatch = Morph.match(start, end);
  }

  calculateBounds(bounds = new Array(4).fill(0), approximate = true) {
    this.start.calculateBounds(bounds, approximate);
    const [minX, minY, maxX, maxY] = bounds;
    this.end.calculateBounds(bounds, approximate);
    bounds[0] = Math.min(minX, bounds[0]);
    bounds[1] = Math.min(minY, bounds[1]);
    bounds[2] = Math.max(maxX, bounds[2]);
    bounds[3] = Math.max(maxY, bounds[3]);
    return bounds;
  }

  calculateMaxBounds(bounds = new Array(4).fill(0)) {
    this.start.calculateMaxBounds(bounds);
    const [minX, minY, maxX, maxY] = bounds;
    this.end.calculateMaxBounds(bounds);
    bounds[0] = Math.min(minX, bounds[0]);
    bounds[1] = Math.min(minY, bounds[1]);
    bounds[2] = Math.max(maxX, bounds[2]);
    bounds[3] = Math.max(maxY, bounds[3]);
    return bounds;
  }

  /** @return {Cubic[]} */
  asCubics(progress) {
    const out = [];
    let firstCubic = null;
    let lastCubic = null;
    for (const [a, b] of this.morphMatch) {
      const cubic = new Cubic(a.points.map((v, it) => interpolate(v, b.points[it], progress)));
      if (firstCubic == null) firstCubic = cubic;
      if (lastCubic != null) out.push(lastCubic);
      lastCubic = cubic;
    }
    if (lastCubic != null && firstCubic != null) {
      out.push(
        Cubic.of(
          lastCubic.anchor0X, lastCubic.anchor0Y,
          lastCubic.control0X, lastCubic.control0Y,
          lastCubic.control1X, lastCubic.control1Y,
          firstCubic.anchor0X, firstCubic.anchor0Y,
        ),
      );
    }
    return out;
  }

  forEachCubic(progress, callback, mutableCubic = new MutableCubic()) {
    for (const [a, b] of this.morphMatch) {
      mutableCubic.interpolate(a, b, progress);
      callback(mutableCubic);
    }
  }

  /** @return {[Cubic, Cubic][]} */
  static match(p1, p2) {
    // Measure polygons, returns lists of measured cubics for each polygon, which
    // we then use to match start/end curves
    const measuredPolygon1 = MeasuredPolygon.measurePolygon(new LengthMeasurer(), p1);
    const measuredPolygon2 = MeasuredPolygon.measurePolygon(new LengthMeasurer(), p2);

    const features1 = measuredPolygon1.features;
    const features2 = measuredPolygon2.features;

    const doubleMapper = featureMapper(features1, features2);

    // cut point on poly2 is the mapping of the 0 point on poly1
    const polygon2CutPoint = doubleMapper.map(0);

    const bs1 = measuredPolygon1;
    const bs2 = measuredPolygon2.cutAndShift(polygon2CutPoint);

    const ret = [];
    let i1 = 0;
    let i2 = 0;
    let b1 = bs1.getOrNull(i1++);
    let b2 = bs2.getOrNull(i2++);
    while (b1 != null && b2 != null) {
      // Progresses are in shape1's perspective
      const b1a = i1 === bs1.size ? 1 : b1.endOutlineProgress;
      const b2a =
        i2 === bs2.size
          ? 1
          : doubleMapper.mapBack(positiveModulo(b2.endOutlineProgress + polygon2CutPoint, 1));
      const minb = Math.min(b1a, b2a);
      let seg1, newb1, seg2, newb2;
      if (b1a > minb + AngleEpsilon) {
        [seg1, newb1] = b1.cutAtProgress(minb);
      } else {
        seg1 = b1;
        newb1 = bs1.getOrNull(i1++);
      }
      if (b2a > minb + AngleEpsilon) {
        [seg2, newb2] = b2.cutAtProgress(positiveModulo(doubleMapper.map(minb) - polygon2CutPoint, 1));
      } else {
        seg2 = b2;
        newb2 = bs2.getOrNull(i2++);
      }
      ret.push([seg1.cubic, seg2.cubic]);
      b1 = newb1;
      b2 = newb2;
    }
    if (!(b1 == null && b2 == null)) throw new Error("Expected both Polygon's Cubic to be fully matched");
    return ret;
  }
}
