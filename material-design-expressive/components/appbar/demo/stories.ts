/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/components/appbar/md-gb-app-bar.js';
import '@material/web/components/button/md-gb-button.js';
import '@material/web/components/iconbutton/md-gb-icon-button.js';
import '@material/web/styles/icons/md-gb-icon.js';

import {MaterialStoryInit} from './material-collection.js';
import {
  type AppBarSize,
  type AppBarVariant,
} from '@material/web/components/appbar/app-bar.js';
import {
  type ScrollPaddingController,
  setupScrollPadding,
} from '@material/web/components/appbar/scroll-padding.js';
import {adoptStyles} from '@material/web/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/styles/m3.cssresult.js';
import {css, html, nothing} from 'lit';
import {ref} from 'lit/directives/ref.js';

/** Knob types for app bar stories. */
export interface StoryKnobs {
  size?: AppBarSize;
  variant?: AppBarVariant;
  scrolled: boolean;
  centered: boolean;
  subtitle: boolean;
}

adoptStyles(document, [
  m3Styles,
  css`
    :root {
      --md-icon-font: 'Material Symbols Outlined';
    }
  `,
]);

const styles = css`
  .demo-container {
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 24px;
    background-color: var(--md-sys-color-surface);
    box-shadow: var(--md-sys-elevation-shadow-1);
  }
`;

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render(knobs) {
    const size = knobs.size || 'sm';
    const variant = knobs.variant || 'standard';
    const scrolled = Boolean(knobs.scrolled);
    const centered = Boolean(knobs.centered);

    if (variant === 'search') {
      return html`
        <div class="demo-container">
          <md-gb-app-bar
            variant="search"
            ?scrolled=${scrolled}
            ?centered=${centered}>
            <md-gb-icon-button slot="leading" color="standard">
              <md-gb-icon>menu</md-gb-icon>
            </md-gb-icon-button>
            <input
              slot="search"
              type="text"
              placeholder="Search"
              aria-label="Search"
              style="width: 100%; border: none; background: transparent; font: inherit; color: inherit; outline: none; padding-inline: 16px;" />
            <md-gb-icon-button slot="trailing" color="standard">
              <md-gb-icon>account_circle</md-gb-icon>
            </md-gb-icon-button>
          </md-gb-app-bar>
        </div>
      `;
    }

    const showSubtitle = Boolean(knobs.subtitle);

    return html`
      <div class="demo-container">
        <md-gb-app-bar
          size=${size}
          ?scrolled=${scrolled}
          ?centered=${centered}>
          <md-gb-icon-button slot="leading" color="standard">
            <md-gb-icon>menu</md-gb-icon>
          </md-gb-icon-button>
          Expressive App Bar (${size})
          ${showSubtitle
            ? html`<span slot="subtitle"
                >Two-tier expressive hierarchy (${size})</span
              >`
            : nothing}
          <md-gb-icon-button slot="trailing" color="standard">
            <md-gb-icon>search</md-gb-icon>
          </md-gb-icon-button>
          <md-gb-icon-button slot="trailing" color="standard">
            <md-gb-icon>more_vert</md-gb-icon>
          </md-gb-icon-button>
        </md-gb-app-bar>
      </div>
    `;
  },
};

const allSizes: MaterialStoryInit<StoryKnobs> = {
  name: 'Expressive Sizes & Variants',
  styles,
  render() {
    return html`
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div class="demo-container">
          <md-gb-app-bar size="sm">
            <md-gb-icon-button slot="leading" color="standard">
              <md-gb-icon>menu</md-gb-icon>
            </md-gb-icon-button>
            Small App Bar (sm)
            <md-gb-icon-button slot="trailing" color="standard">
              <md-gb-icon>search</md-gb-icon>
            </md-gb-icon-button>
            <md-gb-icon-button slot="trailing" color="standard">
              <md-gb-icon>account_circle</md-gb-icon>
            </md-gb-icon-button>
          </md-gb-app-bar>
        </div>

        <div class="demo-container">
          <md-gb-app-bar size="md">
            <md-gb-icon-button slot="leading" color="standard">
              <md-gb-icon>arrow_back</md-gb-icon>
            </md-gb-icon-button>
            Medium App Bar (md)
            <md-gb-icon-button slot="trailing" color="standard">
              <md-gb-icon>more_vert</md-gb-icon>
            </md-gb-icon-button>
          </md-gb-app-bar>
        </div>

        <div class="demo-container">
          <md-gb-app-bar size="md">
            <md-gb-icon-button slot="leading" color="standard">
              <md-gb-icon>menu</md-gb-icon>
            </md-gb-icon-button>
            Medium App Bar with Subtitle
            <span slot="subtitle">Two-tier expressive hierarchy</span>
            <md-gb-icon-button slot="trailing" color="standard">
              <md-gb-icon>edit</md-gb-icon>
            </md-gb-icon-button>
          </md-gb-app-bar>
        </div>

        <div class="demo-container">
          <md-gb-app-bar size="lg">
            <md-gb-icon-button slot="leading" color="standard">
              <md-gb-icon>menu</md-gb-icon>
            </md-gb-icon-button>
            Large App Bar (lg)
            <md-gb-icon-button slot="trailing" color="standard">
              <md-gb-icon>settings</md-gb-icon>
            </md-gb-icon-button>
          </md-gb-app-bar>
        </div>

        <div class="demo-container">
          <md-gb-app-bar size="lg">
            <md-gb-icon-button slot="leading" color="standard">
              <md-gb-icon>menu</md-gb-icon>
            </md-gb-icon-button>
            Large App Bar with Subtitle
            <span slot="subtitle">Dynamic headline layout</span>
            <md-gb-icon-button slot="trailing" color="standard">
              <md-gb-icon>account_circle</md-gb-icon>
            </md-gb-icon-button>
          </md-gb-app-bar>
        </div>

        <div class="demo-container">
          <md-gb-app-bar variant="search">
            <md-gb-icon-button slot="leading" color="standard">
              <md-gb-icon>search</md-gb-icon>
            </md-gb-icon-button>
            <input
              slot="search"
              type="text"
              placeholder="Search variant..."
              style="width:100%; border:none; background:transparent; font:inherit; color: inherit; outline:none; padding-inline: 16px;" />
            <md-gb-icon-button slot="trailing" color="standard">
              <md-gb-icon>close</md-gb-icon>
            </md-gb-icon-button>
          </md-gb-app-bar>
        </div>

        <div class="demo-container">
          <md-gb-app-bar size="md" scrolled>
            <md-gb-icon-button slot="leading" color="standard">
              <md-gb-icon>menu</md-gb-icon>
            </md-gb-icon-button>
            Scrolled App Bar (Declarative property)
            <span slot="subtitle">Demonstrating elevated scrolled style</span>
            <md-gb-icon-button slot="trailing" color="standard">
              <md-gb-icon>filter_list</md-gb-icon>
            </md-gb-icon-button>
          </md-gb-app-bar>
        </div>
      </div>
    `;
  },
};

const centeredText: MaterialStoryInit<StoryKnobs> = {
  name: 'Centered text',
  styles,
  render() {
    const bar = (size: AppBarSize, title: string, subtitle?: string) => html`
      <div class="demo-container">
        <md-gb-app-bar size=${size} centered>
          <md-gb-icon-button
            slot="leading"
            color="standard"
            aria-label="Back">
            <md-gb-icon>arrow_back</md-gb-icon>
          </md-gb-icon-button>
          ${title}
          ${subtitle
            ? html`<span slot="subtitle">${subtitle}</span>`
            : nothing}
          <md-gb-icon-button
            slot="trailing"
            color="standard"
            aria-label="Attach">
            <md-gb-icon>attach_file</md-gb-icon>
          </md-gb-icon-button>
          <md-gb-icon-button
            slot="trailing"
            color="standard"
            aria-label="More">
            <md-gb-icon>more_vert</md-gb-icon>
          </md-gb-icon-button>
        </md-gb-app-bar>
      </div>
    `;
    return html`
      <div style="display: flex; flex-direction: column; gap: 24px;">
        ${bar('sm', 'Small centered')}
        ${bar('sm', 'Small centered', 'With a subtitle')}
        ${bar('md', 'Medium flexible centered', 'Subtitle')}
        ${bar('lg', 'Large flexible centered headline that wraps', 'Subtitle')}
      </div>
    `;
  },
};

const smallSubtitle: MaterialStoryInit<StoryKnobs> = {
  name: 'Small with subtitle, no leading icon',
  styles,
  render() {
    return html`
      <div class="demo-container">
        <md-gb-app-bar>
          Inbox
          <span slot="subtitle">24 unread</span>
          <md-gb-icon-button
            slot="trailing"
            color="standard"
            aria-label="Search">
            <md-gb-icon>search</md-gb-icon>
          </md-gb-icon-button>
        </md-gb-app-bar>
      </div>
    `;
  },
};

const paddings = new WeakMap<Element, ScrollPaddingController>();

/** Sets up `setupScrollPadding()` on the scroller once it renders. */
const scrollPaddingRef = ref((scroller?: Element) => {
  if (!(scroller instanceof HTMLElement) || paddings.has(scroller)) return;
  const bar = scroller.querySelector('md-gb-app-bar');
  paddings.set(
    scroller,
    setupScrollPadding(scroller, {start: bar ? [bar] : []}),
  );
});

const focusNotObscured: MaterialStoryInit<StoryKnobs> = {
  name: 'Sticky app bar: focus not obscured',
  styles: [
    styles,
    css`
      .scroll-demo {
        block-size: 360px;
        overflow: auto;
        position: relative;
      }

      .scroll-demo md-gb-app-bar {
        inset-block-start: 0;
        position: sticky;
        z-index: 1;
      }

      .scroll-demo-list {
        display: grid;
        gap: 12px;
        padding: 16px;
      }

      .scroll-demo p {
        color: var(--md-sys-color-on-surface-variant);
        font: var(--md-sys-typescale-body-md);
        margin: 0;
        padding: 16px 16px 0;
      }
    `,
  ],
  render() {
    return html`
      <div class="demo-container scroll-demo" ${scrollPaddingRef}>
        <md-gb-app-bar scrolled>
          <md-gb-icon-button slot="leading" color="standard" aria-label="Menu">
            <md-gb-icon>menu</md-gb-icon>
          </md-gb-icon-button>
          Inbox
        </md-gb-app-bar>
        <p>
          setupScrollPadding() sets scroll-padding-block-start (and
          --md-gb-obscured-block-start) on this scroller to the sticky app
          bar's height plus the focus indicator, so tabbing backwards up the
          list never leaves a focused button or its focus ring under the bar.
        </p>
        <div class="scroll-demo-list">
          ${Array.from(
            {length: 16},
            (_, i) =>
              html`<md-gb-button color="outlined">Message ${i + 1}</md-gb-button>`,
          )}
        </div>
      </div>
    `;
  },
};

/** App Bar stories. */
export const stories = [
  playground,
  allSizes,
  centeredText,
  smallSubtitle,
  focusNotObscured,
];
