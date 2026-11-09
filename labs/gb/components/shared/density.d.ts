/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ClassInfo } from 'lit/directives/class-map.js';
/**
 * A component density, from 0 (the default) to -3 (the densest).
 *
 * foundations/layout/grids-spacing.md, Component scaling: "The density scale
 * is numbered, starting at 0 for a component's default density. The scale
 * moves to negative numbers (-1, -2, -3) as space decreases".
 */
export type Density = 0 | -1 | -2 | -3;
/** The lowest supported density. */
export declare const MIN_DENSITY = -3;
/** Clamps a density to the supported 0..-3 range (integers). */
export declare function clampDensity(density: number): Density;
/**
 * The density class names of a component, e.g. `checkbox-density-1` for
 * density -1, matched by the `density.levels()` Sass mixin.
 *
 * @param prefix The component's root class, e.g. `checkbox`.
 */
export declare function densityClassNames(prefix: string): {
    readonly density1: `${string}-density-1`;
    readonly density2: `${string}-density-2`;
    readonly density3: `${string}-density-3`;
};
/**
 * Returns the density classes of a component for a density. Density 0 adds
 * no class, so the component inherits the density of an enclosing component
 * (e.g. a button group or chip set).
 *
 * @param prefix The component's root class, e.g. `checkbox`.
 * @param density The density, clamped to 0..-3.
 */
export declare function densityClasses(prefix: string, density?: number): ClassInfo;
