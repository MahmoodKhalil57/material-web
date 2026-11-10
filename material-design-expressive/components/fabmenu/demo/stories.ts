/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/components/fabmenu/md-gb-fab-menu.js';
import '@material/web/components/fabmenu/md-gb-fab-menu-item.js';
import '@material/web/styles/icon/md-gb-icon.js';

import {MaterialStoryInit} from './material-collection.js';
import {type FabSize} from '@material/web/components/fab/fab.js';
import {styles as fabStyles} from '@material/web/components/fab/fab.cssresult.js';
import {
  fabMenu,
  fabMenuButton,
  fabMenuItem,
  type FabMenuAlign,
  type FabMenuColor,
} from '@material/web/components/fabmenu/fab-menu.js';
import {styles as fabMenuStyles} from '@material/web/components/fabmenu/fab-menu.cssresult.js';
import {styles as focusRingStyles} from '@material/web/components/focus/focus-ring.cssresult.js';
import {styles as rippleStyles} from '@material/web/components/ripple/ripple.cssresult.js';
import {adoptStyles} from '@material/web/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/styles/m3.cssresult.js';
import {css, html, nothing} from 'lit';

/** Knob types for FAB menu stories. */
export interface StoryKnobs {
  color?: FabMenuColor;
  size?: FabSize;
  align?: FabMenuAlign;
  items: number;
}

adoptStyles(document, [
  m3Styles,
  css`
    :root {
      --md-icon-font: 'Material Symbols Outlined';
    }
  `,
]);

// Room above the FAB for the items; the FAB keeps 16dp margins.
const styles = css`
  .stage {
    align-items: flex-end;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;
    min-height: 480px;
    padding: 16px;
  }
  .stage.start {
    justify-content: flex-start;
  }
`;

const ACTIONS = [
  ['mail', 'Messages'],
  ['archive', 'Archive'],
  ['snooze', 'Snooze'],
  ['label', 'Label'],
  ['share', 'Share'],
  ['delete', 'Delete'],
];

function actions(count: number) {
  return ACTIONS.slice(0, Math.max(1, Math.min(count, ACTIONS.length)));
}

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render({color, size, align, items}) {
    return html`
      <div class="stage ${align === 'start' ? 'start' : ''}">
        <md-gb-fab-menu
          aria-label="Message actions"
          color="${color || nothing}"
          size="${size || nothing}"
          align="${align || nothing}">
          ${actions(items).map(
            ([icon, label]) => html`
              <md-gb-fab-menu-item>
                <md-gb-icon slot="icon">${icon}</md-gb-icon>
                ${label}
              </md-gb-fab-menu-item>
            `,
          )}
        </md-gb-fab-menu>
      </div>
    `;
  },
};

const directive: MaterialStoryInit<StoryKnobs> = {
  name: 'Directive',
  styles: [styles, focusRingStyles, rippleStyles, fabStyles, fabMenuStyles],
  render({color, size, align, items}) {
    return html`
      <div class="stage ${align === 'start' ? 'start' : ''}">
        <div class="${fabMenu({color, align})}">
          <div class="fab-menu-list" aria-label="Message actions">
            ${actions(items).map(
              ([icon, label]) => html`
                <button class="${fabMenuItem()}">
                  <md-gb-icon>${icon}</md-gb-icon>
                  ${label}
                </button>
              `,
            )}
          </div>
          <button
            class="${fabMenuButton({color, size})}"
            aria-label="Message actions">
            <md-gb-icon class="fab-menu-button-icon">add</md-gb-icon>
            <md-gb-icon class="fab-menu-button-close-icon">close</md-gb-icon>
          </button>
        </div>
      </div>
    `;
  },
};

/** FAB menu stories. */
export const stories = [playground, directive];
