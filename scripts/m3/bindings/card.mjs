/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Elevated, filled and outlined cards (`labs/gb/components/card`).
 *
 * Every card has a color class, so the resting tokens of each style live in
 * a mixin named after it (`elevated`, `filled`, `outlined`) and its states in
 * `<style>-<state>` mixins. The card sets name states `hover.` / `focus.`
 * (not `hovered.` / `focused.`), so they are compiled as explicit state
 * mixins and excluded from the resting ones.
 */

const STYLES = {elevated: 'md.comp.elevated-card', filled: 'md.comp.filled-card', outlined: 'md.comp.outlined-card'};
const STATES = ['hover', 'focus', 'pressed', 'dragged', 'disabled'];

export default {
  generate: true,
  file: 'labs/gb/components/card/_card-tokens.scss',
  exclude: [
    // State layers use the shared ripple; shadows use the elevation tokens.
    'state-layer',
    'shadow-color',
    // M3 has no surface tint on the web (tonal surfaces are color roles).
    'surface-tint',
    // The focus indicator is the shared focus ring (`labs/gb/components/focus`).
    'focus-indicator',
    '^indicator-',
    // `hover.` / `focus.` tokens in the resting mixins (see above).
    '^(hover|focus)-',
    // The card has no icon of its own: icons are content (`md.comp.*-card.icon.*`
    // is unused by Compose's Card too).
    '^icon-',
  ],
  root: [],
  mixins: Object.entries(STYLES).flatMap(([name, set]) => [
    {name, set},
    ...STATES.map((state) => ({name: `${name}-${state}`, set, state})),
  ]),
};
