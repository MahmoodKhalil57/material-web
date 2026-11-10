/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/** Docked and modal date pickers and the modal date input (`components/datepicker`). */
export default {
  generate: true,
  file: 'components/datepicker/_date-picker-tokens.scss',
  // State layers use the shared ripple; shadows and the surface tint use the
  // elevation tokens. The spec names some states `hover.` / `focus.` /
  // `pressed.`; their colors equal the resting colors and are drawn by the
  // ripple.
  exclude: [
    'state-layer',
    'shadow-color',
    'surface-tint',
    '\.hover\.',
    '\.focus\.',
    '\.pressed\.',
  ],
  root: {set: 'md.comp.date-picker.docked'},
  mixins: [
    {name: 'modal', set: 'md.comp.date-picker.modal'},
    {name: 'input', set: 'md.comp.date-input.modal'},
  ],
};
