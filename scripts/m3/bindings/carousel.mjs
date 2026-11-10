/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

const ITEM = 'md.comp.carousel-item';

/**
 * Carousels (`components/carousel`).
 *
 * The spec only tokenizes the carousel item; the container and keyline layout
 * values come from the spec page and Compose `CarouselDefaults` (EDIT lines).
 *
 * The set names its states `hover.` / `focus.` (not `hovered.` / `focused.`),
 * so they are excluded from `root` and compiled as state mixins instead.
 * `with-outline` is the outlined item variant.
 */
export default {
  generate: true,
  file: 'components/carousel/_carousel-tokens.scss',
  // State layers use the shared ripple, focus indicators the shared focus
  // ring, and shadows the elevation tokens. Surface tint is deprecated.
  exclude: [
    'state-layer',
    'focus-indicator',
    'indicator-',
    'shadow-color',
    'surface-tint',
    '^hover-',
    '^focus-',
    '^pressed-',
    // The outline variant's tokens go in the `with-outline*` mixins.
    '^with-outline-',
  ],
  root: {set: ITEM},
  mixins: [
    {name: 'hover', set: ITEM, state: 'hover'},
    {name: 'focus', set: ITEM, state: 'focus'},
    {name: 'pressed', set: ITEM, state: 'pressed'},
    {name: 'disabled', set: ITEM, state: 'disabled'},
    {name: 'with-outline', set: ITEM, state: 'with-outline'},
    {name: 'with-outline-hover', set: ITEM, state: 'with-outline.hover'},
    {name: 'with-outline-focus', set: ITEM, state: 'with-outline.focus'},
    {name: 'with-outline-pressed', set: ITEM, state: 'with-outline.pressed'},
    {name: 'with-outline-disabled', set: ITEM, state: 'with-outline.disabled'},
  ],
};
