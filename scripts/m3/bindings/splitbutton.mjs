/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Split buttons (`components/splitbutton`).
 *
 * `root` (on `.split-btn`) is the space between the two buttons. The other
 * mixins apply to the buttons (`.btn-<size>` inside `.split-btn`): `<size>`
 * (height, inner corners), `<size>-leading-button` / `<size>-trailing-button`
 * (padding, menu icon), `<size>-hovered` / `<size>-pressed` (inner corners)
 * and `trailing-button-selected` (the menu is open).
 *
 * Corner sizes reference `md.sys.shape.corner-value.*`, which gb does not
 * define as custom properties; they are written by hand below `// EDIT:`
 * with the equal `--md-sys-shape-corner-*` radius, so `exclude` drops them.
 */

const S = 'md.comp.split-button';
const sizes = [
  ['xs', 'xsmall'],
  ['sm', 'small'],
  ['md', 'medium'],
  ['lg', 'large'],
  ['xl', 'xlarge'],
];

export default {
  generate: true,
  file: 'components/splitbutton/_split-button-tokens.scss',
  exclude: ['corner-size'],
  root: {set: `${S}.small`, pick: {'between-space': 'between-space'}, only: true},
  mixins: [
    {name: 'button', set: `${S}.small`, pick: {'outer-corner.corner-size': 'outer-corner-size'}, only: true},
    ...sizes.flatMap(([name, size]) => [
      {
        name,
        set: `${S}.${size}`,
        pick: {'container.height': 'container-height', 'inner-corner.corner-size': 'inner-corner-size'},
        only: true,
      },
      {
        name: `${name}-leading-button`,
        set: `${S}.${size}`,
        pick: {'leading-button.leading-space': 'leading-space', 'leading-button.trailing-space': 'trailing-space'},
        only: true,
      },
      {
        name: `${name}-trailing-button`,
        set: `${S}.${size}`,
        pick: {
          'trailing-button.leading-space': 'leading-space',
          'trailing-button.trailing-space': 'trailing-space',
          'trailing-button.icon.size': 'icon-size',
        },
        only: true,
      },
      {name: `${name}-hovered`, set: `${S}.${size}`, pick: {'inner-corner.hovered.corner-size': 'inner-corner-size'}, only: true},
      {name: `${name}-pressed`, set: `${S}.${size}`, pick: {'inner-corner.pressed.corner-size': 'inner-corner-size'}, only: true},
    ]),
    {
      name: 'trailing-button-selected',
      set: `${S}.small`,
      pick: {'trailing-button.inner-corner.selected.corner-size': 'inner-corner-size'},
      only: true,
    },
  ],
};
