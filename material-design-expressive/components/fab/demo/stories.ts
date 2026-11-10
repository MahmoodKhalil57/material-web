/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/components/fab/md-gb-fab.js';
import '@material/web/styles/icon/md-gb-icon.js';

import {MaterialStoryInit} from './material-collection.js';
import {FabColor, FabSize} from '@material/web/components/fab/fab.js';
import {adoptStyles} from '@material/web/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/styles/m3.cssresult.js';
import {css, html, nothing} from 'lit';

/** Knob types for fab stories. */
export interface StoryKnobs {
  icon: string;
  label: string;
  expanded: boolean;
  color?: FabColor;
  size?: FabSize;
}

adoptStyles(document, [
  m3Styles,
  css`
    :root {
      --md-icon-font: 'Material Symbols Outlined';
    }
  `,
]);

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  render(knobs) {
    return html`
      <md-gb-fab
        color="${knobs.color || nothing}"
        size="${knobs.size || nothing}"
        label="${knobs.label || nothing}"
        aria-label="${knobs.label ? nothing : knobs.icon}"
        .expanded=${knobs.expanded}>
        <md-gb-icon>${knobs.icon}</md-gb-icon>
      </md-gb-fab>
    `;
  },
};

const colors: MaterialStoryInit<StoryKnobs> = {
  name: 'Colors',
  render(knobs) {
    const colors: FabColor[] = [
      'primary-container',
      'secondary-container',
      'tertiary-container',
      'primary',
      'secondary',
      'tertiary',
    ];
    return html`${colors.map(
      (color) => html`
        <md-gb-fab
          color="${color}"
          size="${knobs.size || nothing}"
          label="${knobs.label || nothing}"
          aria-label="${knobs.label ? nothing : knobs.icon}">
          <md-gb-icon>${knobs.icon}</md-gb-icon>
        </md-gb-fab>
      `,
    )}`;
  },
};

const sizes: MaterialStoryInit<StoryKnobs> = {
  name: 'Sizes',
  render(knobs) {
    return html`
      ${(['sm', 'default', 'md', 'lg'] as FabSize[]).map(
        (size) => html`
          <md-gb-fab
            color="${knobs.color || nothing}"
            size="${size}"
            aria-label="${knobs.icon}">
            <md-gb-icon>${knobs.icon}</md-gb-icon>
          </md-gb-fab>
        `,
      )}
    `;
  },
};

const extendedSizes: MaterialStoryInit<StoryKnobs> = {
  name: 'Extended FAB sizes',
  render(knobs) {
    const sizes: Array<[FabSize, string]> = [
      ['default', 'Small'],
      ['md', 'Medium'],
      ['lg', 'Large'],
    ];
    return html`
      <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 16px">
        ${sizes.map(
          ([size, name]) => html`
            <md-gb-fab
              color="${knobs.color || nothing}"
              size="${size}"
              label="${knobs.label || name}"
              .expanded=${knobs.expanded}>
              <md-gb-icon>${knobs.icon || 'edit'}</md-gb-icon>
            </md-gb-fab>
          `,
        )}
      </div>
    `;
  },
};

const expandCollapse: MaterialStoryInit<StoryKnobs> = {
  name: 'Expand and collapse',
  render(knobs) {
    const toggle = (event: Event) => {
      const fab = event.currentTarget as HTMLElement & {expanded: boolean};
      fab.expanded = !fab.expanded;
    };
    return html`
      <md-gb-fab
        color="${knobs.color || nothing}"
        size="${knobs.size || nothing}"
        label="${knobs.label || 'Compose'}"
        @click=${toggle}>
        <md-gb-icon>${knobs.icon || 'edit'}</md-gb-icon>
      </md-gb-fab>
    `;
  },
};

const collapseOnScroll: MaterialStoryInit<StoryKnobs> = {
  name: 'Collapse on scroll',
  styles: css`
    .scroll-demo {
      block-size: 320px;
      inline-size: min(360px, 100%);
      position: relative;
      border-radius: var(--md-sys-shape-corner-lg);
      background: var(--md-sys-color-surface-container);
      overflow: hidden;
    }
    .scroll-demo-list {
      block-size: 100%;
      overflow-y: auto;
      margin: 0;
      padding: 8px 16px;
      box-sizing: border-box;
      color: var(--md-sys-color-on-surface);
      font: var(--md-sys-typescale-body-lg);
    }
    .scroll-demo-list li {
      padding-block: 12px;
    }
    .scroll-demo md-gb-fab {
      position: absolute;
      inset-block-end: 16px;
      inset-inline-end: 16px;
    }
  `,
  render(knobs) {
    return html`
      <div class="scroll-demo">
        <ul id="fab-scroll-demo-list" class="scroll-demo-list">
          ${Array.from({length: 40}, (_, i) => html`<li>Message ${i + 1}</li>`)}
        </ul>
        <md-gb-fab
          color="${knobs.color || nothing}"
          size="${knobs.size || nothing}"
          label="${knobs.label || 'Compose'}"
          scroll-target="fab-scroll-demo-list">
          <md-gb-icon>${knobs.icon || 'edit'}</md-gb-icon>
        </md-gb-fab>
      </div>
    `;
  },
};

/** Fab stories. */
export const stories = [
  playground,
  extendedSizes,
  expandCollapse,
  collapseOnScroll,
  colors,
  sizes,
];
