/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Buttons and toggle buttons (`labs/gb/components/button`).
 *
 * `root` is the base set (the filled default colors) plus the small size,
 * the default size. Each color style has a mixin, plus `-unselected` /
 * `-selected` toggle mixins and a `-disabled` mixin. Each size has a mixin
 * and `-selected` / `-pressed` shape mixins.
 *
 * Shapes keep the spec names: a size sets `--container-shape-round` and
 * `--container-shape-square`, the `-selected` mixins replace both, and
 * button.scss picks one for `--container-shape` (round unless `.btn-square`).
 * The pressed shape is the same for round and square buttons.
 */

const B = 'md.comp.button';
const elevation = {'container.elevation': 'container-elevation'};
const shapes = {
  'container.shape.round': 'container-shape-round',
  'container.shape.square': 'container-shape-square',
};
const colors = ['filled', 'elevated', 'tonal', 'outlined', 'text'];
const toggles = ['filled', 'elevated', 'tonal', 'outlined']; // No text toggle.
const sizes = [
  ['xs', 'xsmall'],
  ['sm', 'small'],
  ['md', 'medium'],
  ['lg', 'large'],
  ['xl', 'xlarge'],
];

export default {
  generate: true,
  file: 'labs/gb/components/button/_button-tokens.scss',
  exclude: [
    // State layers use the shared ripple, focus indicators the shared focus
    // ring and shadows the elevation tokens.
    'state-layer',
    'focus-indicator',
    'shadow-color',
    // `label-text.(un)selected.color` duplicate the `(un)selected` mixins.
    '-(un)?selected-color$',
    // The pressed corner morph uses the fast spatial spring in button.scss.
    'motion-spring',
    // `disabled.container.opacity` without a color: folded by hand below.
    '^container-opacity$',
  ],
  root: [{set: B}, {set: `${B}.small`, pick: {'outlined.outline.width': 'outline-width'}}],
  mixins: [
    // `--md-icon-fill` only (see `// EDIT:`): unselected toggles use the
    // outlined icon, selected the filled one.
    {name: 'unselected', set: B, state: 'unselected', pick: {}, only: true},
    {name: 'selected', set: B, state: 'selected', pick: shapes, only: true},
    // Color styles. Hover / focus / pressed colors equal the resting colors
    // of their selection state; only the elevation is bound per state.
    ...colors.flatMap((c) => [
      {name: c, set: `${B}.${c}`},
      ...(toggles.includes(c)
        ? [
            {name: `${c}-unselected`, set: `${B}.${c}`, state: 'unselected'},
            {name: `${c}-selected`, set: `${B}.${c}`, state: 'selected'},
          ]
        : []),
      ...(c === 'filled' || c === 'elevated' || c === 'tonal'
        ? [
            {name: `${c}-hovered`, set: `${B}.${c}`, state: 'hovered', pick: elevation, only: true},
            {name: `${c}-focused`, set: `${B}.${c}`, state: 'focused', pick: elevation, only: true},
            {name: `${c}-pressed`, set: `${B}.${c}`, state: 'pressed', pick: elevation, only: true},
          ]
        : []),
      {name: `${c}-disabled`, set: `${B}.${c}`, state: 'disabled'},
    ]),
    {
      name: 'outlined-selected-disabled',
      set: `${B}.outlined`,
      state: 'selected.disabled',
    },
    ...sizes.flatMap(([name, size]) => [
      {name, set: `${B}.${size}`, pick: {...shapes, 'outlined.outline.width': 'outline-width'}},
      {name: `${name}-selected`, set: `${B}.${size}`, state: 'selected', pick: shapes},
      {name: `${name}-pressed`, set: `${B}.${size}`, state: 'pressed'},
    ]),
    {name: 'pressed', set: B, state: 'pressed', pick: {'container.shape': 'container-shape'}, only: true},
    {name: 'disabled', set: B, state: 'disabled'},
  ],
};
