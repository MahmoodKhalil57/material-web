/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

const D = 'md.comp.navigation-drawer';

/** Standard and modal navigation drawers (`labs/gb/components/navdrawer`). */
export default {
  generate: true,
  file: 'labs/gb/components/navdrawer/_nav-drawer-tokens.scss',
  // State layers use the shared ripple and focus indicators the shared focus
  // ring. The bottom drawer is not part of M3.
  exclude: ['state-layer', 'focus-indicator', '^bottom-'],
  // The root is the standard drawer: its container tokens become the
  // `--container-*` properties and the `modal` mixin overrides them.
  root: {
    set: D,
    pick: {
      'standard.container.color': 'container-color',
      'standard.container.elevation': 'container-elevation',
      'modal.container.color': null,
      'modal.container.elevation': null,
      // `md.sys.typescale.label-large.weight-prominent` has no gb system
      // property; `--active-label-text` (below an EDIT) uses the emphasized
      // label style instead.
      'active.label-text.weight': null,
    },
  },
  mixins: [{name: 'modal', set: D, state: 'modal'}],
};
