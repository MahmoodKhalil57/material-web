/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Plain and rich tooltips (`labs/gb/components/tooltip`).
 *
 * `root` holds only layout values without a spec token; each variant's
 * tokens live in a mixin named after it (`plain`, `rich`), so every
 * declaration names the token set it comes from.
 */
export default {
  generate: true,
  file: 'labs/gb/components/tooltip/_tooltip-tokens.scss',
  // State layers use the shared ripple; shadows use the elevation tokens.
  exclude: ['state-layer', 'shadow-color'],
  root: [],
  mixins: [
    {name: 'plain', set: 'md.comp.plain-tooltip'},
    {name: 'rich', set: 'md.comp.rich-tooltip'},
  ],
};
