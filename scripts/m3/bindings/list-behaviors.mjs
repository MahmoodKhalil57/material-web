/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * M3 Expressive list interactions (`components/list`): expand,
 * reorder (drag) and reveal (swipe to reveal actions).
 *
 * The base list tokens live in the hand-maintained `_list-tokens.scss`; these
 * mixins layer over them, so they reuse its custom property names
 * (`--container-color`, `--label-text-color`, ...) where the behavior
 * re-points a base token, and use `expand-` / `reorder-` / `reveal-`
 * prefixes for new parts.
 *
 * - `root` (on `.list`): list-level reorder tokens.
 * - `expand` (on `.list-item-expandable`): the collapsed expand indicator.
 * - `expand-expanded` / `expand-expanded-segmented` (on `.list-item-expanded`).
 * - `reorder-dragged` + `reorder-dragged-elevation` (on `.list-item-dragged`):
 *   the lifted item.
 * - `reveal` / `reveal-segmented` (on `.list-item-swiped`): the swiped item.
 * - `reveal-actions` (on `.list-item-actions`): the revealed icon buttons.
 */

const LIST = 'md.comp.list';
const EXPAND = 'md.comp.list.expand';
const REORDER = 'md.comp.list.reorder';
const REVEAL = 'md.comp.list.reveal';

export default {
  generate: true,
  file: 'components/list/_list-behaviors-tokens.scss',
  // State layers use the shared ripple; shadows use the elevation tokens.
  exclude: ['shadow-color'],
  root: [
    {
      set: REORDER,
      only: true,
      pick: {
        'list-item.drop-zone.color': 'reorder-drop-zone-color',
        // The drop zone takes the shape of the lifted item.
        'list-item.shape': 'reorder-drop-zone-shape',
      },
    },
  ],
  mixins: [
    {
      name: 'expand',
      set: EXPAND,
      only: true,
      pick: {
        'trailing-icon.shape': 'expand-icon-shape',
        'collapsed.list-item.trailing-icon.container.color':
          'expand-icon-container-color',
        'collapsed.list-item.trailing-icon.icon.color': 'expand-icon-color',
      },
    },
    {
      name: 'expand-expanded',
      set: EXPAND,
      only: true,
      pick: {
        'container.shape': 'container-shape',
        'expanded.list-item.container.color': 'container-color',
        'expanded.list-item.trailing-icon.container.color':
          'expand-icon-container-color',
        'expanded.list-item.trailing-icon.icon.color': 'expand-icon-color',
      },
    },
    {
      name: 'expand-expanded-segmented',
      set: EXPAND,
      only: true,
      pick: {'expanded.list-item.segmented.container.color': 'container-color'},
    },
    {
      name: 'reorder-dragged',
      set: REORDER,
      only: true,
      pick: {
        'list-item.container.color': 'container-color',
        'list-item.shape': 'container-shape',
        'list-item.label-text.color': 'label-text-color',
        'list-item.leading-icon.color': 'leading-icon-color',
        'list-item.trailing-icon.color': 'trailing-icon-color',
        'list-item.overline.color': 'overline-color',
        'list-item.supporting-text.color': 'supporting-text-color',
        'list-item.trailing-supporting-text.color':
          'trailing-supporting-text-color',
        'list-item.state-layer.color': 'state-layer-color',
      },
    },
    {
      // The dragged elevation is in the common list set.
      name: 'reorder-dragged-elevation',
      set: LIST,
      only: true,
      pick: {'list-item.dragged.container.elevation': 'container-elevation'},
    },
    {
      name: 'reveal',
      set: REVEAL,
      only: true,
      pick: {
        'list-item.container.color': 'container-color',
        'list-item.container.shape': 'container-shape',
      },
    },
    {
      name: 'reveal-segmented',
      set: REVEAL,
      only: true,
      pick: {'list-item.segmented.container.shape': 'container-shape'},
    },
    {
      name: 'reveal-actions',
      set: REVEAL,
      only: true,
      pick: {
        'list-item.icon-button.container.color': 'reveal-action-color',
        'list-item.icon-button.icon.color': 'reveal-action-icon-color',
        'list-item.icon-button.container.shape': 'reveal-action-shape',
        'list-item.icon-button.hovered.state-layer.color':
          'reveal-action-hover-state-layer-color',
        'list-item.icon-button.focused.state-layer.color':
          'reveal-action-focus-state-layer-color',
        'list-item.icon-button.pressed.state-layer.color':
          'reveal-action-pressed-state-layer-color',
        'list-item.action.icon-button.container.color':
          'reveal-primary-action-color',
        'list-item.action.icon-button.icon.color':
          'reveal-primary-action-icon-color',
        'list-item.icon-button.action.container.shape':
          'reveal-primary-action-shape',
        'list-item.action.icon-button.hovered.state-layer.color':
          'reveal-primary-action-hover-state-layer-color',
        'list-item.action.icon-button.focused.state-layer.color':
          'reveal-primary-action-focus-state-layer-color',
        'list-item.action.icon-button.pressed.state-layer.color':
          'reveal-primary-action-pressed-state-layer-color',
      },
    },
  ],
};
