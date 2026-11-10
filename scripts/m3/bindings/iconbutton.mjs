/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Icon buttons and toggle icon buttons (`components/iconbutton`).
 *
 * `root` is the base set (the filled default colors) plus the small size,
 * the default size. Each color style has a mixin, `-unselected` /
 * `-selected` toggle mixins and a `-disabled` mixin. Each size has a mixin
 * (height, icon, outline, shapes), `-default` / `-narrow` / `-wide` width
 * mixins (padding), and `-selected` / `-pressed` shape mixins.
 *
 * Shapes keep the spec names like the button: a size sets
 * `--container-shape-round` and `--container-shape-square`, the `-selected`
 * mixins replace both, and icon-button.scss picks one for `--container-shape`.
 */

const I = 'md.comp.icon-button';
const shapes = {
  'container.shape.round': 'container-shape-round',
  'container.shape.square': 'container-shape-square',
};
const width = (w) => ({
  [`${w}.leading-space`]: 'leading-space',
  [`${w}.trailing-space`]: 'trailing-space',
});
const colors = ['filled', 'tonal', 'outlined', 'standard'];
const sizes = [
  ['xs', 'xsmall'],
  ['sm', 'small'],
  ['md', 'medium'],
  ['lg', 'large'],
  ['xl', 'xlarge'],
];

export default {
  generate: true,
  file: 'components/iconbutton/_icon-button-tokens.scss',
  exclude: [
    // State layers use the shared ripple, focus indicators the shared focus
    // ring. Hover / focus / pressed icon and outline colors equal the
    // resting colors of their selection state.
    'state-layer',
    'focus-indicator',
    'shadow-color',
    // The pressed corner morph uses the fast spatial spring in the SCSS.
    'motion-spring',
    // Widths are bound by the `-default` / `-narrow` / `-wide` mixins.
    '^(default|narrow|wide)-',
  ],
  root: [
    {set: I, pick: width('default')},
    {set: `${I}.small`, pick: {...width('default'), 'outlined.outline.width': 'outline-width'}},
  ],
  mixins: [
    // `--md-icon-fill` only (see `// EDIT:`): unselected toggles use the
    // outlined icon, selected the filled one.
    {name: 'unselected', set: I, state: 'unselected', pick: {}, only: true},
    {name: 'selected', set: I, state: 'selected', pick: shapes, only: true},
    ...colors.flatMap((c) => [
      {name: c, set: `${I}.${c}`},
      {name: `${c}-unselected`, set: `${I}.${c}`, state: 'unselected'},
      {name: `${c}-selected`, set: `${I}.${c}`, state: 'selected'},
      {name: `${c}-disabled`, set: `${I}.${c}`, state: 'disabled'},
    ]),
    {name: 'outlined-selected-disabled', set: `${I}.outlined`, state: 'selected.disabled'},
    ...sizes.flatMap(([name, size]) => [
      {name, set: `${I}.${size}`, pick: {...shapes, 'outlined.outline.width': 'outline-width'}},
      ...['default', 'narrow', 'wide'].map((w) => ({
        name: `${name}-${w}`,
        set: `${I}.${size}`,
        pick: width(w),
        only: true,
      })),
      {name: `${name}-selected`, set: `${I}.${size}`, state: 'selected', pick: shapes},
      {name: `${name}-pressed`, set: `${I}.${size}`, state: 'pressed'},
    ]),
    {name: 'pressed', set: I, state: 'pressed', pick: {'container.shape': 'container-shape'}, only: true},
    {name: 'disabled', set: I, state: 'disabled'},
  ],
};
