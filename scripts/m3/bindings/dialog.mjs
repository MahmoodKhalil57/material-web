/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/** Basic and full-screen dialogs (`labs/gb/components/dialog`). */
export default {
  generate: true,
  file: 'labs/gb/components/dialog/_dialog-tokens.scss',
  // State layers use the shared ripple; shadows use the elevation tokens.
  exclude: ['state-layer', 'shadow-color'],
  root: {set: 'md.comp.dialog'},
  mixins: [{name: 'full-screen', set: 'md.comp.full-screen-dialog'}],
};
