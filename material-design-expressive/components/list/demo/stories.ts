/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/components/list/md-gb-list.js';
import '@material/web/components/list/md-gb-list-item.js';
import '@material/web/styles/icons/md-gb-icon.js';

import {MaterialStoryInit} from './material-collection.js';
import {styles as checkboxStyles} from '@material/web/components/checkbox/checkbox.cssresult.js';
import {styles as focusRingStyles} from '@material/web/foundations/interaction/states/focus/focus-ring.cssresult.js';
import {
  type ListReorderEvent,
  type ListSelectionChangeEvent,
} from '@material/web/components/list/list-element.js';
import {list, listItem} from '@material/web/components/list/list.js';
import {styles as listStyles} from '@material/web/components/list/list.cssresult.js';
import {styles as radioStyles} from '@material/web/components/radio/radio.cssresult.js';
import {styles as rippleStyles} from '@material/web/foundations/interaction/states/ripple/ripple.cssresult.js';
import {adoptStyles} from '@material/web/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/styles/m3.cssresult.js';
import {css, html} from 'lit';

/** Knob types for list stories. */
export interface StoryKnobs {
  segmented: boolean;
  nonInteractive: boolean;
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
  focusRingStyles,
  rippleStyles,
  listStyles,
  checkboxStyles,
  radioStyles,
  css`
    .container {
      background-color: var(--md-sys-color-surface-container);
      border-radius: var(--md-sys-shape-corner-lg);
      padding: 2rem;
      border: 1px solid var(--md-sys-color-outline-variant);
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  `,
];

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render(knobs) {
    return html`
      <div class="container" style="width: 360px;">
        <md-gb-list ?segmented=${knobs.segmented} density=${knobs.density}>
          <md-gb-list-item ?static=${knobs.nonInteractive}>
            Basic Item
          </md-gb-list-item>
          <md-gb-list-item ?static=${knobs.nonInteractive}>
            <md-gb-icon slot="leading">star</md-gb-icon>
            With Leading Icon
          </md-gb-list-item>
          <md-gb-list-item ?static=${knobs.nonInteractive}>
            <span slot="avatar">A</span>
            With Avatar & Supporting Text
            <span slot="supporting-text">Supporting text goes here</span>
          </md-gb-list-item>
          <md-gb-list-item
            ?static=${knobs.nonInteractive}
            style="align-items: start;">
            <md-gb-icon slot="leading">image</md-gb-icon>
            <span slot="overline">Overline text</span>
            Complex Item
            <span slot="supporting-text">
              With overline, support text, and two icons
            </span>
            <span slot="trailing-text">100+</span>
            <md-gb-icon slot="trailing">chevron_right</md-gb-icon>
          </md-gb-list-item>
          <md-gb-list-item ?static=${knobs.nonInteractive} checked>
            <md-gb-icon slot="leading">check</md-gb-icon>
            Selected Item
          </md-gb-list-item>
          <md-gb-list-item ?static=${knobs.nonInteractive} disabled>
            <md-gb-icon slot="leading">block</md-gb-icon>
            Disabled Item
            <span slot="supporting-text">This item is disabled</span>
          </md-gb-list-item>
        </md-gb-list>
      </div>
    `;
  },
};

const staticList: MaterialStoryInit<StoryKnobs> = {
  name: 'Non-interactive',
  styles,
  render(knobs) {
    return html`
      <div class="container" style="width: 360px;">
        <md-gb-list ?segmented=${knobs.segmented}>
          <md-gb-list-item static>
            <md-gb-icon slot="leading">developer_board</md-gb-icon>
            The first computer (ENIAC)
            <span slot="trailing-text">Feb 14, 1946</span>
          </md-gb-list-item>
          <md-gb-list-item static>
            <md-gb-icon slot="leading">satellite_alt</md-gb-icon>
            Sputnik launched into space
            <span slot="trailing-text">Oct 4, 1957</span>
          </md-gb-list-item>
          <md-gb-list-item static>
            <md-gb-icon slot="leading">rocket_launch</md-gb-icon>
            The Apollo 11 moon landing
            <span slot="trailing-text">Jul 20, 1969</span>
          </md-gb-list-item>
          <md-gb-list-item static>
            <md-gb-icon slot="leading">moon_stars</md-gb-icon>
            Artemis 2 crewed lunar flyby
            <span slot="trailing-text">Apr 1, 2026</span>
          </md-gb-list-item>
        </md-gb-list>
      </div>
    `;
  },
};

const singleAction: MaterialStoryInit<StoryKnobs> = {
  name: 'Single-action',
  styles: [
    ...styles,
    css`
      .img {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        background-color: var(--md-sys-color-tertiary-container);
      }
    `,
  ],
  render(knobs) {
    return html`
      <div class="container" style="width: 360px;">
        <md-gb-list ?segmented=${knobs.segmented}>
          <md-gb-list-item>
            <div class="img" slot="avatar"></div>
            Festivals
            <span slot="supporting-text">Food, music, arts, community...</span>
            <span slot="trailing-text">May 8</span>
          </md-gb-list-item>
          <md-gb-list-item>
            <div class="img" slot="avatar"></div>
            Arts
            <span slot="supporting-text">
              Literature, games, music, physical...
            </span>
            <span slot="trailing-text">May 8</span>
          </md-gb-list-item>
          <md-gb-list-item>
            <div class="img" slot="avatar"></div>
            Family & friends
            <span slot="supporting-text">
              The relationships that bring and bind...
            </span>
            <span slot="trailing-text">May 8</span>
          </md-gb-list-item>
        </md-gb-list>
      </div>
    `;
  },
};

// TODO: add multi-action list examples

const singleSelect: MaterialStoryInit<StoryKnobs> = {
  name: 'Single-select',
  styles,
  render(knobs) {
    return html`
      <div class="container" style="width: 360px;">
        <select class="list-select" size="3">
          <div class="${list(knobs)}">
            <option class="${listItem()}">
              <div class="list-item-leading list-item-radio radio"></div>
              List item 1
            </option>
            <option class="${listItem()}" selected>
              <div class="list-item-leading list-item-radio radio"></div>
              List item 2
            </option>
            <option class="${listItem()}">
              <div class="list-item-leading list-item-radio radio"></div>
              List item 3
            </option>
          </div>
        </select>
      </div>
    `;
  },
};

const multiSelect: MaterialStoryInit<StoryKnobs> = {
  name: 'Multi-select',
  styles,
  render(knobs) {
    return html`
      <div class="container" style="width: 360px;">
        <select class="list-select" multiple size="3">
          <div class="${list(knobs)}">
            <option class="${listItem()}">
              <div class="list-item-leading list-item-checkbox checkbox"></div>
              List item 1
            </option>
            <option class="${listItem()}" selected>
              <div class="list-item-leading list-item-checkbox checkbox"></div>
              List item 2
            </option>
            <option class="${listItem()}">
              <div class="list-item-leading list-item-checkbox checkbox"></div>
              List item 3
            </option>
          </div>
        </select>
      </div>
    `;
  },
};

const expand: MaterialStoryInit<StoryKnobs> = {
  name: 'Expand',
  styles,
  render(knobs) {
    return html`
      <div class="container" style="width: 360px;">
        <md-gb-list ?segmented=${knobs.segmented}>
          <md-gb-list-item expandable expanded>
            <md-gb-icon slot="leading">checklist</md-gb-icon>
            Groceries
            <span slot="supporting-text">3 items</span>
            <md-gb-list slot="nested" ?segmented=${knobs.segmented}>
              <md-gb-list-item>Bread</md-gb-list-item>
              <md-gb-list-item>Milk</md-gb-list-item>
              <md-gb-list-item>Eggs</md-gb-list-item>
            </md-gb-list>
          </md-gb-list-item>
          <md-gb-list-item expandable>
            <md-gb-icon slot="leading">home_repair_service</md-gb-icon>
            Chores
            <span slot="supporting-text">2 items</span>
            <md-gb-list slot="nested" ?segmented=${knobs.segmented}>
              <md-gb-list-item>Laundry</md-gb-list-item>
              <md-gb-list-item>Water the plants</md-gb-list-item>
            </md-gb-list>
          </md-gb-list-item>
          <md-gb-list-item>
            <md-gb-icon slot="leading">event</md-gb-icon>
            Book a dentist appointment
          </md-gb-list-item>
        </md-gb-list>
      </div>
    `;
  },
};

const reorder: MaterialStoryInit<StoryKnobs> = {
  name: 'Reorder',
  styles,
  render(knobs) {
    return html`
      <div class="container" style="width: 360px;">
        <p>
          Drag a handle, or tap it and use the move up and move down buttons;
          tap the handle again to drop the item.
        </p>
        <md-gb-list
          reorderable
          ?segmented=${knobs.segmented}
          density=${knobs.density}
          @reorder=${(event: Event) => {
            const {from, to} = event as ListReorderEvent;
            console.log(`reorder: ${from} -> ${to}`);
          }}>
          <md-gb-list-item>
            <md-gb-icon slot="leading">looks_one</md-gb-icon>
            Preheat the oven
          </md-gb-list-item>
          <md-gb-list-item>
            <md-gb-icon slot="leading">looks_two</md-gb-icon>
            Mix the dough
            <span slot="supporting-text">Flour, water, yeast, salt</span>
          </md-gb-list-item>
          <md-gb-list-item>
            <md-gb-icon slot="leading">looks_3</md-gb-icon>
            Let it rise
          </md-gb-list-item>
          <md-gb-list-item>
            <md-gb-icon slot="leading">looks_4</md-gb-icon>
            Bake for 40 minutes
          </md-gb-list-item>
        </md-gb-list>
      </div>
    `;
  },
};

const reveal: MaterialStoryInit<StoryKnobs> = {
  name: 'Swipe to reveal',
  styles,
  render(knobs) {
    const recipes = [
      'Fresh baked breads',
      'Summer salads',
      'Weeknight pastas',
      'Slow cooker soups',
    ];
    const archive = (event: Event) => {
      (event.target as Element).closest('md-gb-list-item')?.remove();
    };
    return html`
      <div class="container" style="width: 360px;">
        <md-gb-list ?segmented=${knobs.segmented} density=${knobs.density}>
          ${recipes.map(
            (recipe) => html`
              <md-gb-list-item>
                <md-gb-icon slot="leading">restaurant</md-gb-icon>
                ${recipe}
                <span slot="supporting-text">
                  Swipe, tap More, or press the arrow keys
                </span>
                <button slot="leading-actions" aria-label="Pin ${recipe}">
                  <md-gb-icon>keep</md-gb-icon>
                </button>
                <button slot="trailing-actions" aria-label="Share ${recipe}">
                  <md-gb-icon>share</md-gb-icon>
                </button>
                <button
                  slot="trailing-actions"
                  aria-label="Archive ${recipe}"
                  @click=${archive}>
                  <md-gb-icon>archive</md-gb-icon>
                </button>
              </md-gb-list-item>
            `,
          )}
        </md-gb-list>
      </div>
    `;
  },
};

const longPressSelect: MaterialStoryInit<StoryKnobs> = {
  name: 'Long press to select',
  styles,
  render(knobs) {
    const photos = ['Beach', 'Forest', 'Mountains', 'City', 'Desert', 'Lake'];
    return html`
      <div class="container" style="width: 360px;">
        <p>
          Long press an item to select it and enter selection mode, then tap
          items to select more. Long press and drag to select several.
        </p>
        <md-gb-list
          selectable
          ?segmented=${knobs.segmented}
          @itemselectionchange=${(event: Event) => {
            const {selected} = event as ListSelectionChangeEvent;
            console.log(`selected: ${selected.length}`);
          }}>
          ${photos.map(
            (photo) => html`
              <md-gb-list-item>
                <md-gb-icon slot="leading">image</md-gb-icon>
                ${photo}
              </md-gb-list-item>
            `,
          )}
        </md-gb-list>
      </div>
    `;
  },
};

const density: MaterialStoryInit<StoryKnobs> = {
  name: 'Density',
  styles,
  render(knobs) {
    return html`
      <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
        ${[0, -1, -2, -3].map(
          (value) => html`
            <div class="container" style="width: 240px;">
              <span>Density ${value}</span>
              <md-gb-list
                ?segmented=${knobs.segmented}
                density=${value}
                aria-label="Density ${value}">
                <md-gb-list-item>
                  <md-gb-icon slot="leading">inbox</md-gb-icon>
                  Inbox
                </md-gb-list-item>
                <md-gb-list-item>
                  <md-gb-icon slot="leading">send</md-gb-icon>
                  Sent
                  <span slot="supporting-text">Two-line item</span>
                </md-gb-list-item>
                <md-gb-list-item>
                  <md-gb-icon slot="leading">drafts</md-gb-icon>
                  Drafts
                </md-gb-list-item>
              </md-gb-list>
            </div>
          `,
        )}
      </div>
    `;
  },
};

/** List stories. */
export const stories = [
  playground,
  singleAction,
  singleSelect,
  multiSelect,
  staticList,
  expand,
  reorder,
  reveal,
  longPressSelect,
  density,
];
