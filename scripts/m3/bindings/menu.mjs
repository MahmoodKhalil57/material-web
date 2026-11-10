/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Vertical menus (`components/menu`).
 *
 * `md.comp.menus` holds the shared layout tokens (container, groups, item
 * sizes and shapes); `md.comp.menus.standard` / `.vibrant` hold the colors.
 * Each color style's tokens live in mixins named after it (`standard`,
 * `item-standard`, `item-standard-hovered`, ...), so every declaration names
 * the token set it comes from. Selected and disabled colors are separate
 * mixins (`item-<color>-selected`, `item-<color>-disabled`).
 *
 * Not compiled:
 * - `horizontal.*` and `icon-button.*`: horizontal (icon) menus are not part
 *   of the vertical menus the web supports.
 * - state layers: the shared ripple paints them in the label color, which is
 *   the state layer color of every menu-item state in both color styles.
 * - `focus.indicator.*`: the shared focus ring (`components/focus`).
 * - `container.shadow-color`: shadows use the elevation tokens.
 * Disabled `*.opacity` tokens are folded into their colors
 * (`hsl(from <color> h s l / 38%)`), as Compose does (`copy(alpha = ...)`).
 */

const M = 'md.comp.menus';
const COLORS = {standard: `${M}.standard`, vibrant: `${M}.vibrant`};
const ITEM_STATES = ['hovered', 'focused', 'pressed', 'disabled', 'selected', 'selected.disabled'];

export default {
  generate: true,
  file: 'components/menu/_menu-tokens.scss',
  exclude: [
    'state-layer',
    '^focus-indicator-',
    // `first-child.*` / `last-child.*` are their own mixins.
    '^(first|last)-child-',
    // Opacities without a color in the same state (vibrant
    // `selected.disabled.*.opacity`) are applied by hand under `// EDIT:`.
    '-opacity$',
  ],
  root: {
    set: M,
    only: true,
    pick: {
      'container.shape': 'container-shape',
      'container.elevation': 'container-elevation',
      'gap': 'gap',
      'group.padding': 'group-padding',
      'group.shape': 'group-shape',
    },
  },
  mixins: [
    // Submenu focus shape morph.
    {name: 'active', set: M, state: 'active'},
    {name: 'inactive', set: M, state: 'inactive'},
    ...Object.entries(COLORS).map(([name, set]) => ({
      name,
      set,
      only: true,
      pick: {'container.color': 'container-color', 'section-label-text.color': 'section-label-text-color'},
    })),
    {name: 'item', set: M, state: 'menu-item'},
    {name: 'item-first-child', set: M, state: 'menu-item.first-child'},
    {name: 'item-last-child', set: M, state: 'menu-item.last-child'},
    {name: 'item-selected', set: M, state: 'menu-item.selected'},
    ...Object.entries(COLORS).flatMap(([name, set]) => [
      // `vibrant.menu-item.color` is the item container color.
      {name: `item-${name}`, set, state: 'menu-item', pick: {color: 'container-color'}},
      ...ITEM_STATES.map((state) => ({
        name: `item-${name}-${state.replace('.', '-')}`,
        set,
        state: `menu-item.${state}`,
      })),
    ]),
  ],
};
