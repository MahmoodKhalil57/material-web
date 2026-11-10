/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/components/menu/md-gb-menu.js';
import '@material/web/components/menu/md-gb-menu-group.js';
import '@material/web/components/menu/md-gb-menu-item.js';

import {MaterialStoryInit} from './material-collection.js';
import {button} from '@material/web/components/button/button.js';
import {styles as buttonStyles} from '@material/web/components/button/button.cssresult.js';
import {divider} from '@material/web/components/divider/divider.js';
import {styles as dividerStyles} from '@material/web/components/divider/divider.cssresult.js';
import {styles as focusRingStyles} from '@material/web/components/focus/focus-ring.cssresult.js';
import {styles as menuStyles} from '@material/web/components/menu/menu.cssresult.js';
import {styles as rippleStyles} from '@material/web/components/ripple/ripple.cssresult.js';
import {adoptStyles} from '@material/web/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/styles/m3.cssresult.js';
import {css, html} from 'lit';

/** Knob types for menu stories. */
export interface StoryKnobs {
  vibrant: boolean;
  density: string;
}

adoptStyles(document, [
  m3Styles,
  css`
    :root {
      --md-icon-font: 'Material Symbols Outlined';
    }
  `,
]);

const styles = [
  dividerStyles,
  menuStyles,
  buttonStyles,
  focusRingStyles,
  rippleStyles,
  css`
    .icon {
      font-family: var(--md-icon-font);
      font-size: var(--md-icon-size, 20px);
      font-variation-settings: 'FILL' var(--md-icon-fill, 0);
    }
    .context-target {
      display: grid;
      place-items: center;
      inline-size: 280px;
      block-size: 160px;
      border-radius: var(--md-sys-shape-corner-md);
      background: var(--md-sys-color-surface-container-highest);
      color: var(--md-sys-color-on-surface-variant);
      font: var(--md-sys-typescale-body-md);
      user-select: none;
      -webkit-touch-callout: none;
    }
  `,
];

const color = (knobs: StoryKnobs) => (knobs.vibrant ? 'vibrant' : 'standard');
const icon = (name: string) =>
  html`<span slot="leading" class="icon" aria-hidden="true">${name}</span>`;

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render(knobs) {
    return html`
      <button popovertarget="menu" class=${button({color: 'filled'})}>
        Open Menu
      </button>
      <md-gb-menu id="menu" color=${color(knobs)} density=${knobs.density}>
        <md-gb-menu-item>Standard Item 1</md-gb-menu-item>
        <md-gb-menu-item>
          Standard Item 2
          <span slot="supporting-text">Supporting text</span>
        </md-gb-menu-item>
        <md-gb-menu-item disabled>Standard Item 3</md-gb-menu-item>
        <hr class=${divider()} />
        <md-gb-menu-group checkable="single">
          <md-gb-menu-item checked>Radio 1</md-gb-menu-item>
          <md-gb-menu-item>Radio 2</md-gb-menu-item>
          <md-gb-menu-item disabled>Radio 3</md-gb-menu-item>
        </md-gb-menu-group>
        <hr class=${divider()} />
        <md-gb-menu-group checkable="multiple">
          <md-gb-menu-item checked>Checkbox 1</md-gb-menu-item>
          <md-gb-menu-item>Checkbox 2</md-gb-menu-item>
          <md-gb-menu-item disabled checked>Checkbox 3</md-gb-menu-item>
        </md-gb-menu-group>
      </md-gb-menu>
    `;
  },
};

const grouped: MaterialStoryInit<StoryKnobs> = {
  name: 'Grouped with gaps and labels',
  styles,
  render(knobs) {
    return html`
      <button popovertarget="menu-grouped" class=${button({color: 'filled'})}>
        Open grouped menu
      </button>
      <md-gb-menu
        id="menu-grouped"
        layout="grouped"
        color=${color(knobs)}
        density=${knobs.density}
      >
        <md-gb-menu-group>
          <md-gb-menu-item>${icon('undo')}Undo</md-gb-menu-item>
          <md-gb-menu-item disabled>${icon('redo')}Redo</md-gb-menu-item>
        </md-gb-menu-group>
        <md-gb-menu-group>
          <md-gb-menu-item>
            ${icon('content_cut')}Cut
            <span slot="trailing-text">⌘X</span>
          </md-gb-menu-item>
          <md-gb-menu-item>
            ${icon('content_copy')}Copy
            <span slot="trailing-text">⌘C</span>
          </md-gb-menu-item>
          <md-gb-menu-item>
            ${icon('content_paste')}Paste
            <span slot="trailing-text">⌘V</span>
          </md-gb-menu-item>
        </md-gb-menu-group>
        <md-gb-menu-group label="Sort by" checkable="single">
          <md-gb-menu-item checked>Name</md-gb-menu-item>
          <md-gb-menu-item>Date modified</md-gb-menu-item>
        </md-gb-menu-group>
      </md-gb-menu>
    `;
  },
};

const submenus: MaterialStoryInit<StoryKnobs> = {
  name: 'Submenus',
  styles,
  render(knobs) {
    return html`
      <button popovertarget="menu-sub" class=${button({color: 'filled'})}>
        Open menu with submenus
      </button>
      <md-gb-menu id="menu-sub" color=${color(knobs)} density=${knobs.density}>
        <md-gb-menu-item>${icon('open_in_new')}Open</md-gb-menu-item>
        <md-gb-menu-item>
          ${icon('share')}Share
          <md-gb-menu slot="submenu" color=${color(knobs)}>
            <md-gb-menu-item>${icon('mail')}Email</md-gb-menu-item>
            <md-gb-menu-item>${icon('chat')}Message</md-gb-menu-item>
            <md-gb-menu-item>
              ${icon('link')}Copy link
              <md-gb-menu slot="submenu" color=${color(knobs)}>
                <md-gb-menu-item>Anyone with the link</md-gb-menu-item>
                <md-gb-menu-item>Only people added</md-gb-menu-item>
              </md-gb-menu>
            </md-gb-menu-item>
          </md-gb-menu>
        </md-gb-menu-item>
        <md-gb-menu-item>
          ${icon('palette')}Color
          <md-gb-menu slot="submenu" color=${color(knobs)}>
            <md-gb-menu-group checkable="single">
              <md-gb-menu-item checked>Red</md-gb-menu-item>
              <md-gb-menu-item>Green</md-gb-menu-item>
              <md-gb-menu-item>Blue</md-gb-menu-item>
            </md-gb-menu-group>
          </md-gb-menu>
        </md-gb-menu-item>
        <hr class=${divider()} />
        <md-gb-menu-item>${icon('delete')}Delete</md-gb-menu-item>
      </md-gb-menu>
    `;
  },
};

const contextMenu: MaterialStoryInit<StoryKnobs> = {
  name: 'Context menu',
  styles,
  render(knobs) {
    return html`
      <div id="context-target" class="context-target" tabindex="0">
        Right-click, long press or press the context menu key
      </div>
      <md-gb-menu
        context-for="context-target"
        color=${color(knobs)}
        density=${knobs.density}
      >
        <md-gb-menu-item
          >${icon('open_in_new')}Open in new window</md-gb-menu-item
        >
        <md-gb-menu-item>${icon('download')}Save as</md-gb-menu-item>
        <md-gb-menu-item>${icon('link')}Copy link</md-gb-menu-item>
      </md-gb-menu>
    `;
  },
};

// menus.md "Density": "On web only, density levels control the spacing
// between elements. Increasing density decreases the top and bottom padding"
// ("Density of menus from 0 to -3"). One menu button per density.
const densities: MaterialStoryInit<StoryKnobs> = {
  name: 'Density',
  styles: [
    ...styles,
    css`
      .densities {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
      }
    `,
  ],
  render(knobs) {
    return html`
      <div class="densities">
        ${[0, -1, -2, -3].map(
          (d) => html`
            <button
              popovertarget="menu-density${d}"
              class=${button({color: 'tonal'})}
            >
              Density ${d}
            </button>
            <md-gb-menu
              id="menu-density${d}"
              color=${color(knobs)}
              density=${d}
            >
              <md-gb-menu-item>${icon('content_cut')}Cut</md-gb-menu-item>
              <md-gb-menu-item>${icon('content_copy')}Copy</md-gb-menu-item>
              <md-gb-menu-item>
                ${icon('content_paste')}Paste
                <span slot="supporting-text">Supporting text</span>
              </md-gb-menu-item>
            </md-gb-menu>
          `,
        )}
      </div>
    `;
  },
};

/** Menu stories. */
export const stories = [playground, grouped, submenus, contextMenu, densities];
