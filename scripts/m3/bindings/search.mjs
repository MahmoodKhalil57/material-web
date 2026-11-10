/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/** Search bar and search view (`components/search`). */

const V = 'md.comp.search-view';

// Layout- and style-specific search view tokens are bound by the `docked`,
// `full-screen` and `contained-*` mixins below, not the shared `view` mixin.
const viewPick = {
  'docked.container.shape': null,
  'docked.header.container.height': null,
  'full-screen.container.shape': null,
  'full-screen.header.container.height': null,
  'contained.docked.bar.shape': null,
  'contained.docked.bar-results.gap': null,
  'contained.docked.results.shape': null,
  'contained.full-screen.bar.container.height': null,
};

export default {
  generate: true,
  file: 'components/search/_search-tokens.scss',
  // State layers use the shared ripple, focus indicators the shared focus
  // ring. The tint layer and elevation are Android tonal elevation; Compose
  // and the spec page draw search with no shadow by default. Hover and pressed
  // supporting text colors equal the resting color.
  exclude: ['state-layer', 'focus-indicator', 'surface-tint', '^hover-', 'elevation'],
  root: {set: 'md.comp.search-bar'},
  mixins: [
    {name: 'view', set: V, pick: viewPick},
    {name: 'docked', set: V, state: 'docked'},
    {name: 'full-screen', set: V, state: 'full-screen'},
    {name: 'contained-docked', set: V, state: 'contained.docked'},
    {name: 'contained-full-screen', set: V, state: 'contained.full-screen'},
  ],
};
