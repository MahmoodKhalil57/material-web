/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';

/**
 * A component density, from 0 (the default) to -3 (the densest).
 *
 * foundations/layout/grids-spacing.md, Component scaling: "The density scale
 * is numbered, starting at 0 for a component's default density. The scale
 * moves to negative numbers (-1, -2, -3) as space decreases".
 */
export type Density = 0 | -1 | -2 | -3;

/** The lowest supported density. */
export const MIN_DENSITY = -3;

/** Clamps a density to the supported 0..-3 range (integers). */
export function clampDensity(density: number): Density {
  if (!Number.isFinite(density)) return 0;
  return Math.max(MIN_DENSITY, Math.min(0, Math.round(density))) as Density;
}

/**
 * The density class names of a component, e.g. `checkbox-density-1` for
 * density -1, matched by the `density.levels()` Sass mixin.
 *
 * @param prefix The component's root class, e.g. `checkbox`.
 */
export function densityClassNames(prefix: string) {
  return {
    density1: `${prefix}-density-1`,
    density2: `${prefix}-density-2`,
    density3: `${prefix}-density-3`,
  } as const;
}

/**
 * Returns the density classes of a component for a density. Density 0 adds
 * no class, so the component inherits the density of an enclosing component
 * (e.g. a button group or chip set).
 *
 * @param prefix The component's root class, e.g. `checkbox`.
 * @param density The density, clamped to 0..-3.
 */
export function densityClasses(prefix: string, density = 0): ClassInfo {
  const d = clampDensity(density);
  const names = densityClassNames(prefix);
  return {
    [names.density1]: d === -1,
    [names.density2]: d === -2,
    [names.density3]: d === -3,
  };
}
