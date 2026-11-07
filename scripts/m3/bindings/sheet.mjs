/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Bottom and side sheets (`labs/gb/components/sheet`).
 *
 * `root` is the standard (docked) bottom sheet. `modal` layers the modal
 * bottom sheet over it. `side` re-points the shared container tokens at the
 * standard side sheet, and `side-modal` / `side-detached` layer the modal and
 * detached (floating) side sheet over that.
 *
 * `md.comp.sheet.floating` has no tokens in the spec database (it is only in
 * the legacy Sass export), so detached sheets use `side.detached`.
 */

const BOTTOM = 'md.comp.sheet.bottom';
const SIDE = 'md.comp.sheet.side';

export default {
  generate: true,
  file: 'labs/gb/components/sheet/_sheet-tokens.scss',
  // State layers and action label colors belong to the slotted buttons;
  // focus indicators use the shared focus ring.
  exclude: ['state-layer', '^action-', 'focus-indicator'],
  root: [
    {
      set: BOTTOM,
      state: 'docked',
      pick: {
        'standard.container.elevation': 'container-elevation',
        'modal.container.elevation': null,
        // The shape of a hidden sheet, which is never on screen.
        'minimized.container.shape': null,
      },
    },
  ],
  mixins: [
    {
      name: 'modal',
      set: BOTTOM,
      state: 'docked.modal',
    },
    {
      name: 'side',
      set: SIDE,
      state: 'docked',
      pick: {
        'standard.container.color': 'container-color',
        'standard.container.elevation': 'container-elevation',
        'modal.container.color': null,
        'modal.container.elevation': null,
        'modal.container.shape': null,
      },
    },
    {
      name: 'side-modal',
      set: SIDE,
      state: 'docked.modal',
    },
    {
      name: 'side-detached',
      set: SIDE,
      state: 'detached',
    },
  ],
};
