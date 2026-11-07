/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * FAB and extended FAB (`labs/gb/components/fab`).
 *
 * One `.fab` element is both: an icon-only FAB uses the `md.comp.fab` sizes
 * (square container), and a FAB with a label is an extended FAB that also
 * uses the `md.comp.extended-fab` size sets (label type, padding, icon-label
 * space). The default size is the FAB / small extended FAB (`extended-sm`
 * is included with `root`); the baseline extended FAB
 * (`md.comp.extended-fab`, label large) is no longer recommended by the
 * spec and is not bound. The small FAB (`md.comp.fab.small`, `sm`) is
 * "still available, but no longer recommended" (floating-action-button.md).
 *
 * Elevations come from `md.comp.fab.primary-container` (Compose
 * FloatingActionButtonDefaults.elevation, used by FABs and extended FABs);
 * every color style has the same elevation.
 */

const F = 'md.comp.fab';
const EF = 'md.comp.extended-fab';
const elevation = {'container.elevation': 'container-elevation'};
const colors = [
  'primary-container',
  'primary',
  'secondary-container',
  'secondary',
  'tertiary-container',
  'tertiary',
];

export default {
  generate: true,
  file: 'labs/gb/components/fab/_fab-tokens.scss',
  // State layers use the shared ripple; shadows use the elevation tokens.
  exclude: ['state-layer', 'shadow-color'],
  root: [
    {set: 'md.comp.fab'},
    // Every color style has the same elevation; color mixins leave it out so
    // they do not override the state mixins.
    {set: `${F}.primary-container`, pick: elevation, only: true},
  ],
  mixins: [
    {name: 'extended-sm', set: `${EF}.small`},
    {name: 'hovered', set: `${F}.primary-container`, state: 'hovered', pick: elevation, only: true},
    {name: 'focused', set: `${F}.primary-container`, state: 'focused', pick: elevation, only: true},
    {name: 'pressed', set: `${F}.primary-container`, state: 'pressed', pick: elevation, only: true},
    ...colors.map((name) => ({name, set: `${EF}.${name}`, pick: {'container.elevation': null}})),
    {name: 'sm', set: `${F}.small`},
    {name: 'md', set: 'md.comp.fab.medium'},
    {name: 'extended-md', set: `${EF}.medium`},
    {name: 'lg', set: 'md.comp.fab.large'},
    {name: 'extended-lg', set: `${EF}.large`},
  ],
};
