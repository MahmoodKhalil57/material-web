/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/components/appbar/md-gb-app-bar.js';
import '@material/web/components/iconbutton/md-gb-icon-button.js';
import '@material/web/components/list/md-gb-list-item.js';
import '@material/web/components/search/md-gb-search-bar.js';
import '@material/web/components/search/md-gb-search-view.js';
import '@material/web/styles/icon/md-gb-icon.js';

import {type MaterialStoryInit} from './material-collection.js';
import {type SearchViewElement} from '@material/web/components/search/search-view-element.js';
import {adoptStyles} from '@material/web/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/styles/m3.cssresult.js';
import {css, html, LitElement, nothing} from 'lit';
import {property, state} from 'lit/decorators.js';

/** Knob types for search stories. */
export interface StoryKnobs {
  placeholder: string;
  docked: boolean;
  divided: boolean;
  avatar: boolean;
  disabled: boolean;
}

adoptStyles(document, [
  m3Styles,
  css`
    :root {
      --md-icon-font: 'Material Symbols Outlined';
    }

    .search-demo-avatar {
      align-items: center;
      background: var(--md-sys-color-primary-container);
      color: var(--md-sys-color-on-primary-container);
      display: inline-flex;
      font: var(--md-sys-typescale-label-lg);
      justify-content: center;
    }
  `,
]);

const styles = css`
  .demo-container {
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 24px;
    box-sizing: border-box;
  }

  .demo-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-inline-size: 720px;
  }

  h2 {
    font: var(--md-sys-typescale-headline-sm);
    letter-spacing: var(--md-sys-typescale-headline-sm-tracking);
    margin: 0;
    color: var(--md-sys-color-on-surface);
  }

  .demo-hint {
    font: var(--md-sys-typescale-body-md);
    letter-spacing: var(--md-sys-typescale-body-md-tracking);
    color: var(--md-sys-color-on-surface-variant);
    margin: 0;
  }
`;

const SUGGESTIONS = [
  {icon: 'history', text: 'Mexican dishes'},
  {icon: 'history', text: 'Peanut sauce'},
  {icon: 'history', text: 'Plants'},
  {icon: 'search', text: 'Pasta recipes'},
  {icon: 'search', text: 'Pancakes'},
  {icon: 'search', text: 'Pad thai'},
];

function renderSuggestions(query: string, select: (text: string) => void) {
  const q = query.trim().toLowerCase();
  return SUGGESTIONS.filter(({text}) => text.toLowerCase().includes(q)).map(
    ({icon, text}) => html`
      <md-gb-list-item
        static
        role="option"
        @click=${() => {
          select(text);
        }}>
        <md-gb-icon slot="leading">${icon}</md-gb-icon>
        ${text}
      </md-gb-list-item>
    `,
  );
}

/**
 * A search bar whose suggestions filter as the person types. Renders in
 * Light DOM so the suggestions are slotted children of the bar.
 */
class SearchDemoBar extends LitElement {
  @property() placeholder = '';
  @property({type: Boolean}) docked = false;
  @property({type: Boolean}) divided = false;
  @property({type: Boolean}) disabled = false;
  @property({type: Boolean}) avatar = false;
  @property({type: Number}) trailing = 1;
  @property({type: Boolean, attribute: 'app-bar'}) appBar = false;
  @state() private value = '';

  protected override createRenderRoot() {
    return this;
  }

  override render() {
    const select = (text: string) => {
      this.value = text;
      this.querySelector('md-gb-search-bar')?.close();
    };
    return html`
      <md-gb-search-bar
        style=${this.appBar ? '--container-color: transparent' : nothing}
        placeholder=${this.placeholder}
        .value=${this.value}
        ?docked=${this.docked}
        ?divided=${this.divided}
        ?disabled=${this.disabled}
        @input=${(event: Event) => {
          this.value = (event.currentTarget as {value: string}).value;
        }}>
        ${this.appBar
          ? html`<md-gb-icon slot="leading">search</md-gb-icon>`
          : html`<md-gb-icon-button slot="leading" aria-label="Menu">
              <md-gb-icon>menu</md-gb-icon>
            </md-gb-icon-button>`}
        ${this.trailing > 0
          ? html`<md-gb-icon-button slot="trailing" aria-label="Voice search">
              <md-gb-icon>mic</md-gb-icon>
            </md-gb-icon-button>`
          : nothing}
        ${this.trailing > 1
          ? html`<md-gb-icon-button slot="trailing" aria-label="More options">
              <md-gb-icon>more_vert</md-gb-icon>
            </md-gb-icon-button>`
          : nothing}
        ${this.avatar
          ? html`<span
              slot="avatar"
              class="search-demo-avatar"
              role="img"
              aria-label="Profile"
              >A</span
            >`
          : nothing}
        ${renderSuggestions(this.value, select)}
      </md-gb-search-bar>
    `;
  }
}

if (!customElements.get('search-demo-bar')) {
  customElements.define('search-demo-bar', SearchDemoBar);
}

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render(knobs) {
    return html`
      <div class="demo-container">
        <section class="demo-section">
          <h2>Search</h2>
          <p class="demo-hint">
            Select the bar, or focus it and press Enter, to open focused
            search. Type to filter the suggestions, use the arrow keys to move
            through them, and press Escape or the back button to close.
          </p>
          <search-demo-bar
            placeholder=${knobs.placeholder}
            ?docked=${knobs.docked}
            ?divided=${knobs.divided}
            ?disabled=${knobs.disabled}
            ?avatar=${knobs.avatar}></search-demo-bar>
        </section>
      </div>
    `;
  },
};

// Spec anatomy examples: with avatar, one trailing icon button, two trailing
// icon buttons, and a trailing icon button with an avatar.
const trailingExamples = [
  {avatar: true, trailing: 0},
  {avatar: false, trailing: 1},
  {avatar: false, trailing: 2},
  {avatar: true, trailing: 1},
];

const examples: MaterialStoryInit<StoryKnobs> = {
  name: 'Trailing elements',
  styles,
  render(knobs) {
    return html`
      <div class="demo-container">
        <section class="demo-section">
          <h2>Trailing elements</h2>
          ${trailingExamples.map(
            ({avatar, trailing}) => html`
              <search-demo-bar
                placeholder=${knobs.placeholder}
                ?docked=${knobs.docked}
                ?divided=${knobs.divided}
                ?avatar=${avatar}
                .trailing=${trailing}></search-demo-bar>
            `,
          )}
        </section>
      </div>
    `;
  },
};

const layoutExamples = [
  {docked: false, divided: false, label: 'Full-screen, contained'},
  {docked: true, divided: false, label: 'Docked, contained'},
  {docked: false, divided: true, label: 'Full-screen, divided'},
  {docked: true, divided: true, label: 'Docked, divided'},
];

const layouts: MaterialStoryInit<StoryKnobs> = {
  name: 'Layouts and styles',
  styles,
  render(knobs) {
    return html`
      <div class="demo-container">
        ${layoutExamples.map(
          ({docked, divided, label}) => html`
            <section class="demo-section">
              <h2>${label}</h2>
              <search-demo-bar
                placeholder=${knobs.placeholder}
                ?docked=${docked}
                ?divided=${divided}
                ?avatar=${knobs.avatar}></search-demo-bar>
            </section>
          `,
        )}
      </div>
    `;
  },
};

const appBar: MaterialStoryInit<StoryKnobs> = {
  name: 'Search app bar',
  styles,
  render(knobs) {
    return html`
      <div class="demo-container">
        <p class="demo-hint">
          A search bar in the search slot of a search app bar. The app bar
          draws the search container, so the bar's container is transparent.
        </p>
        <md-gb-app-bar variant="search">
          <search-demo-bar
            slot="search"
            style="flex: 1"
            app-bar
            .trailing=${0}
            placeholder=${knobs.placeholder}
            ?docked=${knobs.docked}
            ?divided=${knobs.divided}></search-demo-bar>
          <md-gb-icon-button slot="trailing" aria-label="Profile">
            <md-gb-icon>account_circle</md-gb-icon>
          </md-gb-icon-button>
        </md-gb-app-bar>
      </div>
    `;
  },
};

const standalone: MaterialStoryInit<StoryKnobs> = {
  name: 'Standalone search view',
  styles,
  render(knobs) {
    return html`
      <div class="demo-container">
        <p class="demo-hint">
          Focused search can be a standalone destination, opened without a
          search bar.
        </p>
        <div>
          <md-gb-icon-button
            aria-label="Open search"
            @click=${(event: Event) => {
              const view = (event.currentTarget as Element)
                .nextElementSibling as SearchViewElement;
              view.show();
            }}>
            <md-gb-icon>search</md-gb-icon>
          </md-gb-icon-button>
          <md-gb-search-view
            placeholder=${knobs.placeholder}
            ?docked=${knobs.docked}
            ?divided=${knobs.divided}>
            ${renderSuggestions('', () => {})}
          </md-gb-search-view>
        </div>
      </div>
    `;
  },
};

/** Search demo stories. */
export const stories = [playground, examples, layouts, appBar, standalone];
