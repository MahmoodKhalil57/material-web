/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Dial and input time pickers (`components/timepicker`).
 *
 * The time picker sets name selected and unselected parts inside the token
 * path (`time-selector.selected.container.color`), so both are kept as
 * distinct properties of the resting mixins. Their states are named `hover`,
 * `focus` and `pressed` (not the `hovered`/`focused` names the compiler
 * skips): state layers use the shared ripple, and the state label text
 * colors equal the resting ones, so `exclude` drops them.
 */
export default {
  generate: true,
  file: 'components/timepicker/_time-picker-tokens.scss',
  exclude: [
    'state-layer',
    '(hover|focus|pressed)-label-text-color$',
    // The keyboard focus indicator is the shared focus ring.
    '^focus-indicator-',
  ],
  root: {set: 'md.comp.time-picker'},
  mixins: [{name: 'input', set: 'md.comp.time-input'}],
};
