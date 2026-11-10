/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Switch (`components/switch`).
 *
 * The spec names the selected and unselected parts of every state
 * (`unselected.hover.handle.color`), so each has its own mixin; switch.scss
 * applies `unselected*` to an unchecked switch and `selected*` to a checked
 * one. Spec states are named `hover` / `focus` / `pressed`.
 *
 * Disabled colors: `disabled.selected.*` / `disabled.unselected.*` fold their
 * handle and icon opacities into the colors. The track opacity is one token
 * for both (`disabled.track.opacity`), applied by switch.scss to the track
 * color and outline like Compose (`DisabledUnselectedTrackOutlineColor.copy(
 * alpha = DisabledTrackOpacity)`).
 */

const S = 'md.comp.switch';

export default {
  generate: true,
  file: 'components/switch/_switch-tokens.scss',
  exclude: [
    // The shared ripple applies the state layer opacities, so the state layer
    // colors (on-surface unselected, primary selected, without the folded
    // opacity) are `// EDIT:` lines; the focus indicator is the shared focus
    // ring.
    'state-layer-(color|opacity)$',
    '^focus-indicator-',
    // `unselected.hover.*` etc. are compiled into their own state mixins.
    '^(hover|focus|pressed)-',
    // Compose draws the handle without a shadow (no handle elevation).
    'handle-(elevation|shadow-color)$',
    // `disabled.handle.opacity` is folded into the selected / unselected
    // disabled handle colors.
    '^handle-opacity$',
  ],
  root: {set: S},
  mixins: [
    {name: 'unselected', set: S, state: 'unselected'},
    {name: 'unselected-hovered', set: S, state: 'unselected.hover'},
    {name: 'unselected-focused', set: S, state: 'unselected.focus'},
    {name: 'unselected-pressed', set: S, state: 'unselected.pressed'},
    {name: 'selected', set: S, state: 'selected'},
    {name: 'selected-hovered', set: S, state: 'selected.hover'},
    {name: 'selected-focused', set: S, state: 'selected.focus'},
    {name: 'selected-pressed', set: S, state: 'selected.pressed'},
    {name: 'pressed', set: S, state: 'pressed'},
    {name: 'disabled', set: S, state: 'disabled'},
    {name: 'disabled-unselected', set: S, state: 'disabled.unselected'},
    {name: 'disabled-selected', set: S, state: 'disabled.selected'},
  ],
};
