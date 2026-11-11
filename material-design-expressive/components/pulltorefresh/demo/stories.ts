/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/components/iconbutton/md-gb-icon-button.js';
import '@material/web/components/pulltorefresh/md-gb-pull-to-refresh.js';
import '@material/web/styles/icons/md-gb-icon.js';

import {type MaterialStoryInit} from './material-collection.js';
import {type PullToRefreshElement} from '@material/web/components/pulltorefresh/pull-to-refresh-element.js';
import {adoptStyles} from '@material/web/styles/adopt-styles.js';
import {css, html, render} from 'lit';
import {createRef, ref} from 'lit/directives/ref.js';

import {styles as m3Styles} from '@material/web/styles/m3.cssresult.js';

/** Knob types for pull to refresh stories. */
export interface StoryKnobs {
  circular: boolean;
  disabled: boolean;
  threshold: number;
  refreshMs: number;
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
  .demo-phone {
    background-color: var(--md-sys-color-surface);
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 24px;
    box-shadow: var(--md-sys-elevation-shadow-1);
    color: var(--md-sys-color-on-surface);
    display: flex;
    flex-direction: column;
    height: 560px;
    max-width: 360px;
    overflow: hidden;
    width: 100%;
  }

  .demo-bar {
    align-items: center;
    display: flex;
    flex: none;
    font: var(--md-sys-typescale-title-lg);
    gap: 8px;
    min-height: 64px;
    padding-inline: 16px 4px;
  }

  .demo-bar h2 {
    flex: 1;
    font: inherit;
    margin: 0;
  }

  md-gb-pull-to-refresh {
    flex: 1;
    min-height: 0;
  }

  .demo-list {
    list-style: none;
    margin: 0;
    padding: 0 16px 16px;
  }

  .demo-list li {
    background-color: var(--md-sys-color-surface-container);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-block-end: 8px;
    padding: 16px;
  }

  .demo-list strong {
    font: var(--md-sys-typescale-title-md);
  }

  .demo-list span {
    color: var(--md-sys-color-on-surface-variant);
    font: var(--md-sys-typescale-body-md);
  }

  .demo-hint {
    color: var(--md-sys-color-on-surface-variant);
    font: var(--md-sys-typescale-body-md);
    margin: 0;
    padding: 0 16px 12px;
  }

  .demo-row {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
  }
`;

const topics = [
  'Markets',
  'Science',
  'Weather',
  'Sports',
  'Travel',
  'Culture',
  'Technology',
  'Health',
];

function renderList(count: number) {
  return Array.from({length: 12}, (_, i) => {
    const topic = topics[(i + count) % topics.length];
    return html`<li>
      <strong>${topic} update ${count * 12 + i + 1}</strong>
      <span>Pull down from the top of the list to load newer stories.</span>
    </li>`;
  });
}

/**
 * A feed that refreshes after `refreshMs`. The app bar's refresh button is
 * the spec's single-pointer alternative to the gesture.
 */
function renderFeed(
  {
    circular = false,
    disabled = false,
    threshold = 80,
    refreshMs = 1500,
  }: Partial<StoryKnobs>,
  title: string,
) {
  const ptr = createRef<PullToRefreshElement>();
  let list: HTMLUListElement | undefined;
  let refreshCount = 0;
  const handleRefresh = () => {
    setTimeout(() => {
      refreshCount++;
      if (list) {
        render(renderList(refreshCount), list);
      }
      if (ptr.value) {
        ptr.value.refreshing = false;
      }
    }, refreshMs);
  };
  return html`
    <div class="demo-phone">
      <div class="demo-bar">
        <h2>${title}</h2>
        <md-gb-icon-button
          aria-label="Refresh"
          @click=${() => ptr.value?.refresh()}>
          <md-gb-icon>refresh</md-gb-icon>
        </md-gb-icon-button>
      </div>
      <md-gb-pull-to-refresh
        ${ref(ptr)}
        indicator=${circular ? 'circular' : 'loading'}
        indicator-label="Refreshing ${title.toLowerCase()}"
        ?disabled=${disabled}
        .threshold=${threshold}
        @refresh=${handleRefresh}>
        <p class="demo-hint">
          Drag down (touch or mouse) past the threshold and release.
        </p>
        <ul
          class="demo-list"
          ${ref((el) => {
            if (el && el !== list) {
              list = el as HTMLUListElement;
              render(renderList(refreshCount), list);
            }
          })}></ul>
      </md-gb-pull-to-refresh>
    </div>
  `;
}

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render(knobs) {
    return renderFeed(knobs, 'News');
  },
};

const variants: MaterialStoryInit<StoryKnobs> = {
  name: 'Indicators',
  styles,
  render() {
    return html`<div class="demo-row">
      ${renderFeed({}, 'Loading indicator')}
      ${renderFeed({circular: true}, 'Circular indicator')}
    </div>`;
  },
};

/** Pull to refresh stories. */
export const stories = [playground, variants];
