/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Small (dot) and large (count) badges (`labs/gb/components/badge`).
 *
 * `md.comp.badge` holds both sizes: the small badge tokens at its root and
 * the large badge tokens under `large.`, compiled as an `lg` mixin (gb size abbreviation).
 */

const BADGE = 'md.comp.badge';
const container = {color: 'container-color', shape: 'shape', size: 'size'};

export default {
  generate: true,
  file: 'labs/gb/components/badge/_badge-tokens.scss',
  root: {set: BADGE, pick: container, only: true},
  mixins: [
    {name: 'lg', set: BADGE, state: 'large', pick: container},
  ],
};
