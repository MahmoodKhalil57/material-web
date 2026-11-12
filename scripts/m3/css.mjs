/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Converts resolved spec tokens into CSS values using the library's naming
 * conventions (`--md-sys-shape-corner-md`, `--md-sys-typescale-label-lg`, ...).
 */

/** `extra-large` -> `xl`, `medium` -> `md`, ... as used by the library. */
export function abbreviateSize(name) {
  return name
    .replace(/extra-extra-large/g, 'xxl')
    .replace(/extra-large/g, 'xl')
    .replace(/extra-small/g, 'xs')
    .replace(/\blarge\b/g, 'lg')
    .replace(/\bmedium\b/g, 'md')
    .replace(/\bsmall\b/g, 'sm');
}

/** CSS custom property for a system token, or undefined if not mapped. */
export function sysVar(tokenName) {
  const m = tokenName.match(/^md\.sys\.([a-z]+)\.(.+)$/);
  if (!m) return undefined;
  const [, kind, rest] = m;
  const dashed = rest.replace(/\./g, '-');
  switch (kind) {
    case 'color':
      return `var(--md-sys-color-${dashed})`;
    case 'shape':
      return `var(--md-sys-shape-${abbreviateSize(dashed)})`;
    case 'elevation': {
      const level = rest.match(/^level(\d)$/)?.[1];
      return level ? `var(--md-sys-elevation-shadow-${level})` : undefined;
    }
    case 'typescale':
      return `var(--md-sys-typescale-${abbreviateSize(dashed)})`;
    case 'motion':
      return `var(--md-sys-motion-${dashed})`;
    case 'measurement': {
      // md.sys.measurement.space50 -> --md-sys-space-50
      const space = rest.match(/^space(\d+)$/)?.[1];
      return space ? `var(--md-sys-space-${space})` : undefined;
    }
    default:
      // md.sys.state.* etc. are inlined as literals by the caller.
      return undefined;
  }
}

/** Formats a literal spec value (length, opacity, color, ...) as CSS. */
export function literalCss(value) {
  if (!value) return undefined;
  if (value.length) return lengthCss(value.length);
  if (value.opacity !== undefined) return String(round(value.opacity));
  if (value.numeric !== undefined) return String(round(value.numeric));
  if (value.color) return colorCss(value.color);
  if (value.elevation) return lengthCss(value.elevation);
  if (value.shape) {
    const {family, defaultSize, topLeft, topRight, bottomRight, bottomLeft} = value.shape;
    if (family === 'SHAPE_FAMILY_CIRCULAR') return 'calc(var(--container-height) / 2)';
    // Per-corner shapes (e.g. a top-rounded indicator) keep each corner, in
    // `border-radius` order; a corner without a value is 0. Equal corners
    // collapse to one value.
    const corners = [topLeft, topRight, bottomRight, bottomLeft];
    if (corners.some(Boolean)) {
      const values = corners.map((c) => lengthCss(c ?? defaultSize ?? {}));
      return values.every((v) => v === values[0]) ? values[0] : values.join(' ');
    }
    if (defaultSize) return lengthCss(defaultSize);
  }
  return undefined;
}

function lengthCss({value = 0, unit}) {
  if (value === 0) return '0';
  if (unit === 'PERCENT') return `${round(value)}%`;
  return `${round(value)}px`;
}

function colorCss({red = 0, green = 0, blue = 0, alpha = 1}) {
  const hex = [red, green, blue]
    .map((c) => Math.round(c * 255).toString(16).padStart(2, '0'))
    .join('');
  return alpha === 1 ? `#${hex}` : `rgb(from #${hex} r g b / ${round(alpha * 100)}%)`;
}

function round(n) {
  return Math.round(n * 1000) / 1000;
}

/**
 * Resolves a token to a CSS value, following references until a system token
 * (emitted as `var(...)`) or a literal is reached.
 */
export function tokenCss(db, tokenName, ctx, seen = new Set()) {
  if (seen.has(tokenName)) return undefined;
  seen.add(tokenName);
  const direct = sysVar(tokenName);
  if (direct) return direct;
  const r = db.resolve(tokenName, ctx);
  if (!r) return undefined;
  if (r.ref) {
    const viaRef = sysVar(r.ref) ?? tokenCss(db, r.ref, ctx, seen);
    if (viaRef) return viaRef;
  }
  return literalCss(r.value) ?? literalCss(r.resolved);
}

/** Opacity as a CSS percentage, e.g. 0.38 -> `38%`. */
export function opacityPercent(db, tokenName, ctx) {
  const css = tokenCss(db, tokenName, ctx);
  const n = Number(css);
  return Number.isFinite(n) ? `${round(n * 100)}%` : undefined;
}
