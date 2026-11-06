/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Binds the M3 button spec token sets to the `labs/gb` button token mixins.
 *
 * Each mixin takes the tokens of `set` under the `state` prefix (no prefix =
 * the resting state), maps each token suffix to a custom property, and keeps
 * only properties in the component's CSS API (the `root` mixin).
 *
 * `pick` overrides the suffix -> property mapping; `null` drops a suffix.
 */

const B = 'md.comp.button';

// Shape variants are bound explicitly through the round/square mixins.
const sizePick = {
  'container.shape.round': null,
  'container.shape.square': null,
  'outlined.outline.width': 'outline-width',
};

// `inherits` lists the mixins a mixin layers over in button.scss, so values
// that are already inherited are not reported as missing.

const sizes = [
  ['xs', 'xsmall'],
  ['sm', 'small'],
  ['md', 'medium'],
  ['lg', 'large'],
  ['xl', 'xlarge'],
];

export default {
  file: 'labs/gb/components/button/_button-tokens.scss',
  // Tokens the gb button intentionally styles in CSS instead of tokens.
  // Leaving them listed documents the decision and silences the report.
  ignore: ['state-layer-color', 'container-shadow-color', 'label-text-selected-color', 'label-text-unselected-color'],
  mixins: [
    {name: 'selected', set: B, state: 'selected', pick: {'container.shape.round': 'container-shape', 'container.shape.square': null, 'container.color': null, 'icon.color': null}},
    {name: 'filled', set: `${B}.filled`},
    {name: 'filled-unselected', set: `${B}.filled`, state: 'unselected'},
    {name: 'filled-selected', set: `${B}.filled`, state: 'selected'},
    {name: 'elevated', set: `${B}.elevated`},
    {name: 'elevated-selected', set: `${B}.elevated`, state: 'selected'},
    {name: 'tonal', set: `${B}.tonal`},
    {name: 'tonal-selected', set: `${B}.tonal`, state: 'selected'},
    {name: 'outlined', set: `${B}.outlined`},
    {name: 'outlined-selected', set: `${B}.outlined`, state: 'selected'},
    {name: 'text', set: `${B}.text`},
    ...sizes.flatMap(([name, size]) => [
      {name, set: `${B}.${size}`, pick: sizePick},
      {name: `${name}-selected`, set: `${B}.${size}`, state: 'selected', pick: {'container.shape.round': 'container-shape', 'container.shape.square': null}, inherits: ['selected'], optional: true},
      {name: `square-${name}`, set: `${B}.${size}`, pick: {'container.shape.square': 'container-shape'}, only: true, inherits: ['square'], optional: true},
      {name: `pressed-${name}`, set: `${B}.${size}`, state: 'pressed', inherits: ['pressed'], optional: true},
    ]),
    {name: 'disabled', set: B, state: 'disabled'},
  ],
};
