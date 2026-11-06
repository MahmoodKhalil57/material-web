/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Closed-form springs (unit mass, as Jetpack Compose `spring()`), sampled
 * into CSS `linear()` easings.
 */

/** Position of a unit-mass spring released from 0 towards 1. */
export function springAt(t, damping, stiffness) {
  const w = Math.sqrt(stiffness);
  if (damping < 1) {
    const wd = w * Math.sqrt(1 - damping * damping);
    return 1 - Math.exp(-damping * w * t) * (Math.cos(wd * t) + ((damping * w) / wd) * Math.sin(wd * t));
  }
  if (damping === 1) return 1 - Math.exp(-w * t) * (1 + w * t);
  const r1 = -w * (damping - Math.sqrt(damping * damping - 1));
  const r2 = -w * (damping + Math.sqrt(damping * damping - 1));
  return 1 - (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r2 - r1);
}

/**
 * Seconds after which the spring stays within `threshold` of its target,
 * rounded up to 10ms. Compose's `visibilityThreshold` plays the same role.
 */
export function settleTime(damping, stiffness, threshold = 0.002) {
  let last = 0;
  for (let t = 0; t < 10; t += 0.0005) {
    if (Math.abs(springAt(t, damping, stiffness) - 1) > threshold) last = t;
  }
  return Math.ceil((last * 1000) / 10) / 100;
}

/**
 * `linear(...)` easing for a spring over `duration` seconds, simplified to
 * within `tolerance`. The last point is exactly 1 (the spring snaps to its
 * target when it settles, as in Compose).
 */
export function springEasing(damping, stiffness, duration, tolerance = 0.002) {
  const samples = [];
  const n = 400;
  for (let i = 0; i <= n; i++) {
    const p = i / n;
    samples.push([p, i === n ? 1 : springAt(p * duration, damping, stiffness)]);
  }
  const points = simplify(samples, tolerance);
  const fmt = (v) => String(Math.round(v * 1000) / 1000);
  return `linear(${points
    .map(([p, x], i) => (i === 0 || i === points.length - 1 ? fmt(x) : `${fmt(x)} ${fmt(p * 100)}%`))
    .join(', ')})`;
}

/** Ramer-Douglas-Peucker on [progress, value] points (error in value). */
function simplify(points, tolerance) {
  if (points.length < 3) return points;
  const [a, b] = [points[0], points[points.length - 1]];
  let index = 0;
  let max = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [p, x] = points[i];
    const expected = a[1] + ((b[1] - a[1]) * (p - a[0])) / (b[0] - a[0]);
    const err = Math.abs(x - expected);
    if (err > max) [index, max] = [i, err];
  }
  if (max <= tolerance) return [a, b];
  return [
    ...simplify(points.slice(0, index + 1), tolerance).slice(0, -1),
    ...simplify(points.slice(index), tolerance),
  ];
}
