/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Outlined segmented buttons (`components/segmentedbutton`).
 *
 * The set prefixes its states with `selected`, `unselected` and `disabled`
 * (and `hover`/`focus`/`pressed` below those), so each is its own mixin and
 * `exclude` drops the state-prefixed properties from the resting mixins.
 */

const S = 'md.comp.outlined-segmented-button';

// The icon tokens apply to the leading icon and the selected checkmark; the
// shape is the container's outer corners.
const pick = {
  'shape': 'container-shape',
  'with-icon.icon.size': 'icon-size',
  'with-icon.icon.color': 'icon-color',
};

export default {
  generate: true,
  file: 'components/segmentedbutton/_segmented-button-tokens.scss',
  // State layers use the shared ripple, focus indicators the shared focus
  // ring. Hover / focus / pressed icon and label colors equal the resting
  // colors of their selection state.
  exclude: [
    'state-layer',
    'focus-indicator',
    '^(selected|unselected|disabled)-',
    '^(hover|focus|pressed)-',
  ],
  root: {set: S, pick},
  mixins: [
    {name: 'unselected', set: S, state: 'unselected', pick},
    {name: 'selected', set: S, state: 'selected', pick},
    {name: 'disabled', set: S, state: 'disabled', pick},
  ],
};
