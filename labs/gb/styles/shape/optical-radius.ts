/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The corner radius of a component nested in a rounded container, so both
 * corners look concentric (optical roundness): outer radius - padding.
 *
 * Spec: https://m3.material.io/styles/shape "Optical roundness".
 *
 * @example
 * ```ts
 * innerCornerRadius(48, 14); // 34
 * ```
 *
 * @param outerRadius The radius of the container, in dp.
 * @param padding The distance between the container and the nested component.
 * @return The radius for the nested component; never negative.
 */
export function innerCornerRadius(outerRadius: number, padding: number) {
  return Math.max(0, outerRadius - padding);
}
