/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Select and autocomplete (exposed dropdown menus,
 * `extras/select`).
 *
 * The four token sets hold two groups: `text-field.*` (the anchor field) and
 * `menu.*` (the dropdown). The field reuses the `md-gb-text-field` styles, so
 * every mixin reads its set under `state: 'text-field'` (or a
 * `text-field.<state>` prefix) and its properties keep the text field's
 * names (`--container-color`, `--label-text-color`, ...). The `menu.*` tokens
 * are dropped by that prefix: they describe the baseline menu, while the
 * Expressive menus page says exposed dropdown menus are now plain menus
 * ("Dropdown menu and exposed dropdown menu are now both referred to as
 * menu"), so the dropdown uses the shared `md-gb-menu` styles.
 *
 * The sets name their states `hover`, `focus`, `error` and `disabled` (not the
 * `hovered`/`focused` names the compiler skips), so each state is its own
 * mixin and `exclude` drops state-prefixed properties from resting mixins.
 */

const sets = {
  '': 'md.comp.filled-select',
  outlined: 'md.comp.outlined-select',
  autocomplete: 'md.comp.filled-autocomplete',
  'outlined-autocomplete': 'md.comp.outlined-autocomplete',
};

const states = [
  ['hover', 'hover'],
  ['focus', 'focus'],
  ['error', 'error'],
  ['error-hover', 'error.hover'],
  ['error-focus', 'error.focus'],
  ['disabled', 'disabled'],
];

const join = (...parts) => parts.filter(Boolean).join('-');

export default {
  generate: true,
  file: 'extras/select/_select-tokens.scss',
  exclude: [
    '^(hover|focus|error|disabled)-',
    // `label-text.populated.size` / `.line-height` reference typescale parts;
    // they are not type styles, so they have no `-axes` / `-tracking`.
    'populated-(size|line-height)-(axes|tracking)$',
    // `md.sys.typescale.body-sm.size` / `.line-height` are not defined in the
    // the library styles; root sets them with fallbacks under `// EDIT:`.
    '^label-text-populated-',
  ],
  root: {set: sets[''], state: 'text-field'},
  mixins: Object.entries(sets).flatMap(([variant, set]) => [
    ...(variant ? [{name: variant, set, state: 'text-field'}] : []),
    ...states.map(([name, state]) => ({
      name: join(variant, name),
      set,
      state: `text-field.${state}`,
    })),
  ]),
};
