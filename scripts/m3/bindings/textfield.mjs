/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Filled and outlined text fields (`labs/gb/components/textfield`).
 *
 * The text field sets prefix their states with `hover`, `focus`, `error` and
 * `disabled` (not the `hovered`/`focused` names the compiler skips), so each
 * state is its own mixin and `exclude` drops the state-prefixed properties
 * from the resting mixins.
 */

const F = 'md.comp.filled-text-field';
const O = 'md.comp.outlined-text-field';

const states = [
  ['hover', 'hover'],
  ['focus', 'focus'],
  ['error', 'error'],
  ['error-hover', 'error.hover'],
  ['error-focus', 'error.focus'],
  ['disabled', 'disabled'],
];

export default {
  generate: true,
  file: 'labs/gb/components/textfield/_text-field-tokens.scss',
  exclude: [
    '^(hover|focus|error|disabled)-',
    // `label-text.populated.size` / `.line-height` reference typescale parts;
    // they are not type styles, so they have no `-axes` / `-tracking`.
    'populated-(size|line-height)-(axes|tracking)$',
    // `focus.active-indicator.thickness` is the keyboard focus indicator
    // (3px); the focused active indicator is `focus.active-indicator.height`.
    'active-indicator-thickness',
  ],
  root: {set: F},
  mixins: [
    ...states.map(([name, state]) => ({name, set: F, state})),
    {name: 'outlined', set: O},
    ...states.map(([name, state]) => ({name: `outlined-${name}`, set: O, state})),
  ],
};
