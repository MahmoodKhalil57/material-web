/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/** Plain and rich tooltips (`labs/gb/components/tooltip`). */
export default {
  generate: true,
  file: 'labs/gb/components/tooltip/_tooltip-tokens.scss',
  // State layers use the shared ripple; shadows use the elevation tokens.
  exclude: ['state-layer', 'shadow-color'],
  root: {set: 'md.comp.plain-tooltip'},
  mixins: [{name: 'rich', set: 'md.comp.rich-tooltip'}],
};
