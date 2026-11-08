/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/aria/tabs/md-aria-tabpanel.js';
import '@material/web/labs/gb/components/tabs/md-gb-tab.js';
import '@material/web/labs/gb/components/tabs/md-gb-tab-panels.js';
import '@material/web/labs/gb/components/tabs/md-gb-tabs.js';
import '@material/web/labs/gb/styles/icon/md-gb-icon.js';

import {MaterialStoryInit} from './material-collection.js';
import {styles as badgeStyles} from '@material/web/labs/gb/components/badge/badge.cssresult.js';
import {styles as focusRingStyles} from '@material/web/labs/gb/components/focus/focus-ring.cssresult.js';
import {styles as rippleStyles} from '@material/web/labs/gb/components/ripple/ripple.cssresult.js';
import {styles as tabsStyles} from '@material/web/labs/gb/components/tabs/tabs.cssresult.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';
import {css, html} from 'lit';

/** Knob types for tabs stories. */
export interface StoryKnobs {
  variant?: 'primary' | 'secondary';
  selectedIndex: number;
  density?: string;
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
  tabsStyles,
  css`
    .container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      inline-size: 480px;
    }
  `,
];

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render({variant, selectedIndex, density}) {
    const labels = ['Flights', 'Trips', 'Explore', 'Buy'];
    return html`
      <div class="container">
        <md-gb-tabs
          variant="${variant ?? 'primary'}"
          density="${density ?? '0'}"
          .selectedTabIndex="${selectedIndex}"
        >
          ${labels.map(
            (label) => html`
              <md-gb-tab><span slot="label">${label}</span></md-gb-tab>
            `,
          )}
        </md-gb-tabs>
      </div>
    `;
  },
};

const withIcons: MaterialStoryInit<StoryKnobs> = {
  name: 'Icons',
  styles,
  render({variant, selectedIndex, density}) {
    const items = [
      {icon: 'flight', label: 'Flights'},
      {icon: 'luggage', label: 'Trips'},
      {icon: 'explore', label: 'Explore'},
    ];
    return html`
      <div class="container">
        <md-gb-tabs
          variant="${variant ?? 'primary'}"
          density="${density ?? '0'}"
          .selectedTabIndex="${selectedIndex}"
        >
          ${items.map(
            ({icon, label}) => html`
              <md-gb-tab>
                <md-gb-icon>${icon}</md-gb-icon>
                <span slot="label">${label}</span>
              </md-gb-tab>
            `,
          )}
        </md-gb-tabs>
      </div>
    `;
  },
};

const iconOnly: MaterialStoryInit<StoryKnobs> = {
  name: 'Icon only',
  styles,
  render({variant, selectedIndex}) {
    const icons = ['flight', 'luggage', 'explore'];
    return html`
      <div class="container">
        <md-gb-tabs
          variant="${variant ?? 'primary'}"
          .selectedTabIndex="${selectedIndex}"
        >
          ${icons.map(
            (icon) => html`
              <md-gb-tab>
                <md-gb-icon>${icon}</md-gb-icon>
              </md-gb-tab>
            `,
          )}
        </md-gb-tabs>
      </div>
    `;
  },
};

const iconOnlyWithBadge: MaterialStoryInit<StoryKnobs> = {
  name: 'Icon only with badge',
  styles: [...styles, badgeStyles],
  render({variant, selectedIndex}) {
    const items = [
      {icon: 'mail', badge: '3'},
      {icon: 'send', badge: ''},
      {icon: 'report', badge: '99+'},
    ];
    return html`
      <div class="container">
        <md-gb-tabs
          variant="${variant ?? 'primary'}"
          .selectedTabIndex="${selectedIndex}"
        >
          ${items.map(
            ({icon, badge: count}) => html`
              <md-gb-tab>
                <md-gb-icon>${icon}</md-gb-icon>
                ${
                  count
                    ? html`<span
                        class="badge badge-large tab-badge"
                        slot="badge"
                        >${count}</span
                      >`
                    : ''
                }
              </md-gb-tab>
            `,
          )}
        </md-gb-tabs>
      </div>
    `;
  },
};

const withBadges: MaterialStoryInit<StoryKnobs> = {
  name: 'Badges',
  styles: [...styles, badgeStyles],
  render({variant, selectedIndex}) {
    const items = [
      {label: 'Inbox', badge: '3'},
      {label: 'Sent', badge: ''},
      {label: 'Spam', badge: '99+'},
    ];
    return html`
      <div class="container">
        <md-gb-tabs
          variant="${variant ?? 'primary'}"
          .selectedTabIndex="${selectedIndex}"
        >
          ${items.map(
            ({label, badge: count}) => html`
              <md-gb-tab>
                <span slot="label">${label}</span>
                ${
                  count
                    ? html`<span
                        class="badge badge-large tab-badge"
                        slot="badge"
                        >${count}</span
                      >`
                    : ''
                }
              </md-gb-tab>
            `,
          )}
        </md-gb-tabs>
      </div>
    `;
  },
};

const iconsWithBadges: MaterialStoryInit<StoryKnobs> = {
  name: 'Icons with badges',
  styles: [...styles, badgeStyles],
  render({variant, selectedIndex}) {
    const items = [
      {icon: 'flight', label: 'Flights', badge: '3'},
      {icon: 'luggage', label: 'Trips', badge: ''},
      {icon: 'explore', label: 'Explore', badge: '99+'},
    ];
    return html`
      <div class="container">
        <md-gb-tabs
          variant="${variant ?? 'primary'}"
          .selectedTabIndex="${selectedIndex}"
        >
          ${items.map(
            ({icon, label, badge: count}) => html`
              <md-gb-tab>
                <md-gb-icon>${icon}</md-gb-icon>
                <span slot="label">${label}</span>
                ${
                  count
                    ? html`<span
                        class="badge badge-large tab-badge"
                        slot="badge"
                        >${count}</span
                      >`
                    : ''
                }
              </md-gb-tab>
            `,
          )}
        </md-gb-tabs>
      </div>
    `;
  },
};

const overflow: MaterialStoryInit<StoryKnobs> = {
  name: 'Overflow',
  styles,
  render({variant, selectedIndex}) {
    const labels = [
      'Flights',
      'Trips',
      'Explore',
      'Buy',
      'Hotels',
      'Car rental',
      'Packages',
      'Things to do',
    ];
    return html`
      <div class="container" style="inline-size: 320px;">
        <md-gb-tabs
          variant="${variant ?? 'primary'}"
          .selectedTabIndex="${selectedIndex}"
        >
          ${labels.map(
            (label) => html`
              <md-gb-tab><span slot="label">${label}</span></md-gb-tab>
            `,
          )}
        </md-gb-tabs>
      </div>
    `;
  },
};

const withPanels: MaterialStoryInit<StoryKnobs> = {
  name: 'Tabpanels',
  styles,
  render({variant}) {
    return html`
      <div class="container">
        <md-gb-tabs variant="${variant ?? 'primary'}">
          <md-gb-tab tabpanel="panel-flights">
            <span slot="label">Flights</span>
          </md-gb-tab>
          <md-gb-tab tabpanel="panel-trips">
            <span slot="label">Trips</span>
          </md-gb-tab>
        </md-gb-tabs>
        <md-aria-tabpanel id="panel-flights">Flights content</md-aria-tabpanel>
        <md-aria-tabpanel id="panel-trips">Trips content</md-aria-tabpanel>
      </div>
    `;
  },
};

const swipeablePanels: MaterialStoryInit<StoryKnobs> = {
  name: 'Swipeable panels',
  styles: [
    ...styles,
    css`
      md-gb-tab-panels {
        border-radius: var(--md-sys-shape-corner-md);
        background: var(--md-sys-color-surface-container);
        color: var(--md-sys-color-on-surface);
      }

      .panel {
        box-sizing: border-box;
        min-block-size: 200px;
        padding: 24px;
        font: var(--md-sys-typescale-body-lg);
      }

      .panel h3 {
        margin: 0 0 8px;
        font: var(--md-sys-typescale-title-lg);
      }
    `,
  ],
  render({variant, selectedIndex}) {
    const items = [
      {
        icon: 'flight',
        label: 'Flights',
        text: 'Search one-way and round-trip fares.',
      },
      {
        icon: 'luggage',
        label: 'Trips',
        text: 'Your upcoming and past bookings.',
      },
      {
        icon: 'explore',
        label: 'Explore',
        text: 'Ideas for your next destination.',
      },
      {
        icon: 'sell',
        label: 'Deals',
        text: 'Price drops on routes you follow.',
      },
    ];
    return html`
      <div class="container">
        <md-gb-tabs
          variant="${variant ?? 'primary'}"
          .selectedTabIndex="${selectedIndex}"
          aria-label="Travel"
        >
          ${items.map(
            ({icon, label}) => html`
              <md-gb-tab>
                <md-gb-icon>${icon}</md-gb-icon>
                <span slot="label">${label}</span>
              </md-gb-tab>
            `,
          )}
        </md-gb-tabs>
        <md-gb-tab-panels>
          ${items.map(
            ({label, text}) => html`
              <div class="panel" role="tabpanel" tabindex="0">
                <h3>${label}</h3>
                <p>${text}</p>
                <p>Swipe left or right here to change tabs.</p>
              </div>
            `,
          )}
        </md-gb-tab-panels>
      </div>
    `;
  },
};

// tabs.md "Avoid applying density by default": density is opt-in (a denser
// layout or theme). Each step removes 4px from the tabs' height.
const densities: MaterialStoryInit<StoryKnobs> = {
  name: 'Density',
  styles,
  render({variant}) {
    return html`
      <div class="container">
        ${[0, -1, -2, -3].map(
          (d) => html`
            <md-gb-tabs
              variant="${variant ?? 'primary'}"
              density="${d}"
              aria-label="Density ${d}"
            >
              <md-gb-tab>
                <md-gb-icon>flight</md-gb-icon>
                <span slot="label">Flights</span>
              </md-gb-tab>
              <md-gb-tab>
                <md-gb-icon>luggage</md-gb-icon>
                <span slot="label">Trips</span>
              </md-gb-tab>
              <md-gb-tab>
                <md-gb-icon>explore</md-gb-icon>
                <span slot="label">Explore</span>
              </md-gb-tab>
            </md-gb-tabs>
            <md-gb-tabs
              variant="${variant ?? 'primary'}"
              density="${d}"
              aria-label="Density ${d}, labels"
            >
              <md-gb-tab><span slot="label">Flights</span></md-gb-tab>
              <md-gb-tab><span slot="label">Trips</span></md-gb-tab>
              <md-gb-tab><span slot="label">Explore</span></md-gb-tab>
            </md-gb-tabs>
          `,
        )}
      </div>
    `;
  },
};

/** Tabs stories. */
export const stories = [
  playground,
  withIcons,
  iconOnly,
  iconOnlyWithBadge,
  withBadges,
  iconsWithBadges,
  overflow,
  withPanels,
  swipeablePanels,
  densities,
];
