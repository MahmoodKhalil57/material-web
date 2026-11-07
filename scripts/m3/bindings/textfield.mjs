/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Filled and outlined text fields (`labs/gb/components/textfield`).
 *
 * Like the card, each style's resting tokens live in a mixin named after it
 * (`filled`, `outlined`) and its states in `<style>-<state>` mixins, so every
 * declaration names the token set it comes from. `root` only holds the
 * layout values the spec has no token for (`// EDIT:`). The text field is
 * filled by default: `filled` applies with `root` and `outlined` layers over
 * it.
 *
 * The text field sets prefix their states with `hover`, `focus`, `error` and
 * `disabled` (not the `hovered`/`focused` names the compiler skips), so each
 * state is its own mixin and `exclude` drops the state-prefixed properties
 * from the resting mixins.
 *
 * Disabled `*.opacity` tokens are folded into their colors
 * (`hsl(from <color> h s l / 38%)`), as Compose does (`copy(alpha = ...)`).
 */

const STYLES = {filled: 'md.comp.filled-text-field', outlined: 'md.comp.outlined-text-field'};

const STATES = [
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
    // `label-text.populated.size` / `.line-height` reference
    // `md.sys.typescale.body-sm.size` / `.line-height`, which the labs/gb
    // typography styles do not define; `root` sets them with fallbacks under
    // `// EDIT:`.
    '^label-text-populated-',
    // `focus.active-indicator.thickness` is the keyboard focus indicator
    // (3px); the focused active indicator is `focus.active-indicator.height`.
    'active-indicator-thickness',
  ],
  root: [],
  mixins: Object.entries(STYLES).flatMap(([name, set]) => [
    {name, set},
    ...STATES.map(([state, path]) => ({name: `${name}-${state}`, set, state: path})),
  ]),
};
