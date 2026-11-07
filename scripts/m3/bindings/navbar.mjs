/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Flexible navigation bar (`labs/gb/components/navbar`) with vertical items
 * (compact windows, the default) and horizontal items (medium windows).
 *
 * - `root`: the common `md.comp.nav-bar` tokens plus the vertical item
 *   tokens (the default layout), with `item-` names.
 * - `vertical` / `horizontal`: the item layout sets, applied on
 *   `[item-layout]` / `.nav-bar-{vertical,horizontal}`.
 *
 * Hover/focus/press state-layer colors are all the same per active state;
 * the ripple applies the state opacities, so only one color per active
 * state is bound.
 */

const NB = 'md.comp.nav-bar';
const item = (layout, extra = {}) => ({
  set: `${NB}.item.${layout}`,
  only: true,
  pick: {
    'label-text.font': 'item-label-text',
    'active-indicator.height': 'item-active-indicator-height',
    'active-indicator.width': 'item-active-indicator-width',
    'active-indicator.icon-label-space': 'item-active-indicator-icon-label-space',
    'active-indicator.leading-space': 'item-active-indicator-leading-space',
    'active-indicator.trailing-space': 'item-active-indicator-trailing-space',
    'container.between-space': 'item-container-between-space',
    ...extra,
  },
});

export default {
  generate: true,
  file: 'labs/gb/components/navbar/_nav-bar-tokens.scss',
  exclude: ['-(hovered|focused|pressed)-state-layer-'],
  root: [
    {set: NB},
    {
      set: NB,
      only: true,
      pick: {
        // The active color is an EDIT (its token folds in an opacity).
        'item.inactive.hovered.state-layer.color': 'item-inactive-state-layer-color',
      },
    },
    item('vertical'),
  ],
  mixins: [
    {name: 'vertical', ...item('vertical')},
    {name: 'horizontal', ...item('horizontal')},
  ],
};
