/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/divider/md-gb-divider.js';
import '@material/web/labs/gb/components/iconbutton/md-gb-icon-button.js';
import '@material/web/labs/gb/components/navdrawer/md-gb-nav-drawer.js';
import '@material/web/labs/gb/components/navdrawer/md-gb-nav-drawer-item.js';
import '@material/web/labs/gb/styles/icon/md-gb-icon.js';

import {type MaterialStoryInit} from './material-collection.js';
import {type NavDrawerElement} from '@material/web/labs/gb/components/navdrawer/nav-drawer-element.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {css, html, nothing} from 'lit';
import {createRef, ref} from 'lit/directives/ref.js';

import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';

/** Knob types for navigation drawer stories. */
export interface StoryKnobs {
  modal?: boolean;
  open?: boolean;
  showHeadline?: boolean;
  showBadges?: boolean;
  showIcons?: boolean;
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
  .demo-shell {
    background-color: var(--md-sys-color-surface-container-lowest);
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 16px;
    box-shadow: var(--md-sys-elevation-shadow-1);
    display: flex;
    height: 640px;
    max-width: 960px;
    overflow: hidden;
    width: 100%;
  }

  .demo-content {
    background-color: var(--md-sys-color-surface);
    color: var(--md-sys-color-on-surface-variant);
    display: flex;
    flex: 1;
    flex-direction: column;
    font: var(--md-sys-typescale-body-lg);
    gap: 16px;
    min-width: 0;
    padding: 16px 24px;
  }

  .demo-content p {
    margin: 0;
  }
`;

interface Destination {
  icon: string;
  label: string;
  badge?: string;
}

const mailboxes: Destination[] = [
  {icon: 'inbox', label: 'Inbox', badge: '24'},
  {icon: 'send', label: 'Outbox', badge: '100+'},
  {icon: 'favorite', label: 'Favorites'},
  {icon: 'delete', label: 'Trash'},
];

const labels: Destination[] = [
  {icon: 'label', label: 'Family'},
  {icon: 'label', label: 'School'},
  {icon: 'label', label: 'Work'},
];

function renderItems(
  destinations: Destination[],
  {showBadges = true, showIcons = true, selected = ''} = {},
) {
  return destinations.map(
    ({icon, label, badge}) => html`
      <md-gb-nav-drawer-item
        href="#${label.toLowerCase()}"
        ?selected=${label === selected}
        badge=${showBadges && badge ? badge : ''}>
        ${showIcons
          ? html`<md-gb-icon slot="icon">${icon}</md-gb-icon>`
          : nothing}
        ${label}
      </md-gb-nav-drawer-item>
    `,
  );
}

function renderDrawerContent(knobs: StoryKnobs) {
  const showBadges = knobs.showBadges ?? true;
  const showIcons = knobs.showIcons ?? true;
  return html`
    ${knobs.showHeadline ?? true ? html`<h2 slot="headline">Mail</h2>` : nothing}
    ${renderItems(mailboxes, {showBadges, showIcons, selected: 'Inbox'})}
    <md-gb-divider></md-gb-divider>
    <h3>Labels</h3>
    ${renderItems(labels, {showBadges, showIcons})}
  `;
}

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render(knobs) {
    const drawer = createRef<NavDrawerElement>();
    const modal = Boolean(knobs.modal);
    return html`
      <div class="demo-shell">
        <md-gb-nav-drawer
          ${ref(drawer)}
          ?modal=${modal}
          ?open=${knobs.open ?? true}
          aria-label="Mail">
          ${renderDrawerContent(knobs)}
        </md-gb-nav-drawer>
        <div class="demo-content">
          <md-gb-icon-button
            aria-label="Toggle navigation drawer"
            @click=${() => drawer.value?.toggle()}>
            <md-gb-icon>menu</md-gb-icon>
          </md-gb-icon-button>
          <p>
            ${modal
              ? 'The modal drawer opens over a scrim. Press Escape, click the scrim or select an item to close it.'
              : 'The standard drawer sits next to the content. The menu button opens and closes it.'}
          </p>
        </div>
      </div>
    `;
  },
};

const standard: MaterialStoryInit<StoryKnobs> = {
  name: 'Standard drawer',
  styles,
  render() {
    const drawer = createRef<NavDrawerElement>();
    return html`
      <div class="demo-shell">
        <md-gb-nav-drawer ${ref(drawer)} open aria-label="Mail">
          ${renderDrawerContent({})}
        </md-gb-nav-drawer>
        <div class="demo-content">
          <md-gb-icon-button
            aria-label="Toggle navigation drawer"
            @click=${() => drawer.value?.toggle()}>
            <md-gb-icon>menu</md-gb-icon>
          </md-gb-icon-button>
          <p>Dismissible standard drawer: the content slides along.</p>
        </div>
      </div>
    `;
  },
};

const modal: MaterialStoryInit<StoryKnobs> = {
  name: 'Modal drawer',
  styles,
  render() {
    const drawer = createRef<NavDrawerElement>();
    return html`
      <div class="demo-shell">
        <md-gb-nav-drawer ${ref(drawer)} modal aria-label="Mail">
          ${renderDrawerContent({})}
        </md-gb-nav-drawer>
        <div class="demo-content">
          <md-gb-icon-button
            aria-label="Open navigation drawer"
            @click=${() => drawer.value?.show()}>
            <md-gb-icon>menu</md-gb-icon>
          </md-gb-icon-button>
          <p>Open the modal drawer with the menu button.</p>
        </div>
      </div>
    `;
  },
};

const textOnly: MaterialStoryInit<StoryKnobs> = {
  name: 'Text labels only',
  styles,
  render() {
    return html`
      <div class="demo-shell">
        <md-gb-nav-drawer open aria-label="Settings">
          <h2 slot="headline">Settings</h2>
          ${renderItems(
            [
              {icon: '', label: 'General'},
              {icon: '', label: 'Notifications', badge: '3'},
              {icon: '', label: 'Privacy'},
              {icon: '', label: 'A very long destination label that truncates'},
            ],
            {showIcons: false, selected: 'General'},
          )}
          <md-gb-nav-drawer-item disabled>Disabled</md-gb-nav-drawer-item>
        </md-gb-nav-drawer>
        <div class="demo-content"><p>Items without icons.</p></div>
      </div>
    `;
  },
};

/** Navigation drawer stories. */
export const stories = [playground, standard, modal, textOnly];
