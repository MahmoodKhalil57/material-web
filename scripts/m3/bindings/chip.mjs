/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Assist, filter, input and suggestion chips (`components/chip`).
 *
 * Each chip type has its own spec token set, organized as a tree of styles
 * (`elevated`, `flat`), selection (`selected`, `unselected`), content
 * (`with-icon`, `with-leading-icon`, `with-trailing-icon`, `with-avatar`)
 * and states. Every subtree the reference implementation (Compose
 * `*ChipDefaults`) uses is compiled into one mixin named after its path, e.g.
 * `filter-flat-unselected` = `md.comp.filter-chip.flat.unselected.*`, and
 * chip.scss includes each one under the matching selector. Disabled colors
 * fold their `.opacity` tokens. `root` is the default assist chip.
 */

const TYPES = {
  assist: [
    '',
    'elevated',
    'elevated.hover',
    'elevated.focus',
    'elevated.pressed',
    'elevated.disabled',
    'flat',
    'flat.focus',
    'flat.disabled',
    'disabled',
    'dragged',
    'with-icon',
    'with-icon.disabled',
  ],
  suggestion: [
    '',
    'elevated',
    'elevated.hover',
    'elevated.focus',
    'elevated.pressed',
    'elevated.disabled',
    'flat',
    'flat.focus',
    'flat.disabled',
    'disabled',
    'dragged',
    'with-leading-icon',
    'with-leading-icon.disabled',
  ],
  filter: [
    '',
    'unselected',
    'selected',
    'elevated',
    'elevated.unselected',
    'elevated.selected',
    'elevated.hover',
    'elevated.focus',
    'elevated.pressed',
    'elevated.disabled',
    'flat',
    'flat.unselected',
    'flat.selected',
    'flat.unselected.hover',
    'flat.unselected.focus',
    'flat.unselected.pressed',
    'flat.selected.hover',
    'flat.selected.focus',
    'flat.selected.pressed',
    'flat.disabled.unselected',
    'flat.disabled.selected',
    'disabled',
    'dragged',
    'with-icon',
    'with-leading-icon.unselected',
    'with-leading-icon.selected',
    'with-leading-icon.disabled',
    'with-trailing-icon.unselected',
    'with-trailing-icon.selected',
    'with-trailing-icon.disabled',
  ],
  input: [
    '',
    'unselected',
    'selected',
    'unselected.focus',
    'disabled',
    'disabled.unselected',
    'disabled.selected',
    'dragged',
    'with-leading-icon',
    'with-leading-icon.unselected',
    'with-leading-icon.selected',
    'with-leading-icon.disabled',
    'with-trailing-icon',
    'with-trailing-icon.unselected',
    'with-trailing-icon.selected',
    'with-trailing-icon.disabled',
    'with-avatar',
    'with-avatar.disabled',
  ],
};

const STATE_NAMES = {hover: 'hovered', focus: 'focused'};

/** `elevated.hover` -> `elevated-hovered`. */
function mixinName(type, path) {
  const words = path ? path.split('.').map((w) => STATE_NAMES[w] ?? w) : [];
  return [type, ...words].join('-');
}

export default {
  generate: true,
  file: 'components/chip/_chip-tokens.scss',
  exclude: [
    // State layers use the shared ripple (the label color); shadows and the
    // surface tint use the elevation tokens.
    'state-layer',
    'shadow-color',
    'surface-tint',
    // Subtrees are compiled into their own mixins (see above), so a mixin
    // drops the paths below it.
    '^(elevated|flat|with-icon|with-leading-icon|with-trailing-icon|with-avatar)-',
    '^(hover|focus|pressed)-',
    // `with-leading-icon.leading-icon.unselected.color` duplicates
    // `with-leading-icon.unselected.leading-icon.color` (used by Compose).
    '-unselected-color$',
  ],
  root: {set: 'md.comp.assist-chip'},
  mixins: Object.entries(TYPES).flatMap(([type, paths]) =>
    paths.map((path) => ({
      name: mixinName(type, path),
      set: `md.comp.${type}-chip`,
      ...(path ? {state: path} : {}),
      // Compose only uses the filter chip `with-icon` icon size.
      ...(type === 'filter' && path === 'with-icon'
        ? {pick: {'icon.size': 'icon-size'}, only: true}
        : {}),
    })),
  ),
};
