/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/components/button/md-gb-button.js';
import '@material/web/components/fab/md-gb-fab.js';
import '@material/web/components/iconbutton/md-gb-icon-button.js';
import '@material/web/components/navrail/md-gb-nav-rail.js';
import '@material/web/components/navrail/md-gb-nav-rail-item.js';
import '@material/web/styles/icon/md-gb-icon.js';

import {type MaterialStoryInit} from './material-collection.js';
import {type NavRailAlignment} from '@material/web/components/navrail/nav-rail.js';
import {type NavRailElement} from '@material/web/components/navrail/nav-rail-element.js';
import {adoptStyles} from '@material/web/styles/adopt-styles.js';
import {css, html, nothing} from 'lit';
import {createRef, ref} from 'lit/directives/ref.js';

import {styles as m3Styles} from '@material/web/styles/m3.cssresult.js';

/** Knob types for navigation rail stories. */
export interface StoryKnobs {
  alignment?: NavRailAlignment;
  expanded?: boolean;
  modal?: boolean;
  narrow?: boolean;
  showBadges?: boolean;
  showHeader?: boolean;
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
    height: 480px;
    max-width: 720px;
    overflow: hidden;
    width: 100%;
  }

  .demo-content {
    align-items: center;
    color: var(--md-sys-color-on-surface-variant);
    display: flex;
    flex: 1;
    font: var(--md-sys-typescale-body-lg);
    justify-content: center;
    padding: 24px;
  }

  .demo-row {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
  }
`;

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render(knobs) {
    const alignment = knobs.alignment || 'top';
    const expanded = Boolean(knobs.expanded);
    const modal = Boolean(knobs.modal);
    const narrow = Boolean(knobs.narrow);
    const showBadges = Boolean(knobs.showBadges);
    const showHeader = Boolean(knobs.showHeader);

    return html`
      <div class="demo-shell">
        <md-gb-nav-rail
          alignment=${alignment}
          ?collapsible=${showHeader}
          ?expanded=${expanded}
          ?modal=${modal}
          ?narrow=${narrow}
          aria-label="Primary navigation rail">
          ${showHeader
            ? html`
                <md-gb-icon-button
                  slot="header"
                  aria-label="Toggle navigation rail">
                  <md-gb-icon>${expanded ? 'menu_open' : 'menu'}</md-gb-icon>
                </md-gb-icon-button>
                <md-gb-fab
                  slot="header"
                  color="tertiary-container"
                  label="Compose">
                  <md-gb-icon>edit</md-gb-icon>
                </md-gb-fab>
              `
            : nothing}
          <md-gb-nav-rail-item selected badge=${showBadges ? 'dot' : ''}>
            <md-gb-icon slot="icon">mail</md-gb-icon>
            Inbox
          </md-gb-nav-rail-item>
          <md-gb-nav-rail-item badge=${showBadges ? '4' : ''}>
            <md-gb-icon slot="icon">chat_bubble</md-gb-icon>
            Chat
          </md-gb-nav-rail-item>
          <md-gb-nav-rail-item badge=${showBadges ? '99+' : ''}>
            <md-gb-icon slot="icon">groups</md-gb-icon>
            Spaces
          </md-gb-nav-rail-item>
          <md-gb-nav-rail-item>
            <md-gb-icon slot="icon">videocam</md-gb-icon>
            Meet
          </md-gb-nav-rail-item>
        </md-gb-nav-rail>
        <div class="demo-content">Main application workspace</div>
      </div>
    `;
  },
};

const allVariants: MaterialStoryInit<StoryKnobs> = {
  name: 'Collapsed, Expanded & Aligned',
  styles,
  render() {
    return html`
      <div class="demo-row">
        <div class="demo-shell">
          <md-gb-nav-rail aria-label="Collapsed navigation rail">
            <md-gb-icon-button
              slot="header"
              aria-label="Toggle navigation rail">
              <md-gb-icon>menu</md-gb-icon>
            </md-gb-icon-button>
            <md-gb-fab
              slot="header"
              color="tertiary-container"
              label="Create">
              <md-gb-icon>add</md-gb-icon>
            </md-gb-fab>
            <md-gb-nav-rail-item selected>
              <md-gb-icon slot="icon">home</md-gb-icon>
              Home
            </md-gb-nav-rail-item>
            <md-gb-nav-rail-item badge="3">
              <md-gb-icon slot="icon">explore</md-gb-icon>
              Explore
            </md-gb-nav-rail-item>
            <md-gb-nav-rail-item badge="dot">
              <md-gb-icon slot="icon">library_music</md-gb-icon>
              Library
            </md-gb-nav-rail-item>
            <md-gb-nav-rail-item>
              <md-gb-icon slot="icon">settings</md-gb-icon>
              Settings
            </md-gb-nav-rail-item>
          </md-gb-nav-rail>
          <div class="demo-content">Collapsed Rail (Top Aligned)</div>
        </div>

        <div class="demo-shell">
          <md-gb-nav-rail modal collapsible aria-label="Modal navigation rail">
            <md-gb-fab
              slot="header"
              color="tertiary-container"
              label="Compose">
              <md-gb-icon>edit</md-gb-icon>
            </md-gb-fab>
            <md-gb-nav-rail-item selected>
              <md-gb-icon slot="icon">inbox</md-gb-icon>
              Inbox
            </md-gb-nav-rail-item>
            <md-gb-nav-rail-item badge="12">
              <md-gb-icon slot="icon">star</md-gb-icon>
              Starred
            </md-gb-nav-rail-item>
            <md-gb-nav-rail-item>
              <md-gb-icon slot="icon">send</md-gb-icon>
              Sent
            </md-gb-nav-rail-item>
            <md-gb-nav-rail-item>
              <md-gb-icon slot="icon">delete</md-gb-icon>
              Trash
            </md-gb-nav-rail-item>
          </md-gb-nav-rail>
          <div class="demo-content">
            Modal rail: expand it with the menu button; it opens over the
            content with a scrim. Click the scrim, press Escape or swipe it
            toward its edge to collapse.
          </div>
        </div>

        <div class="demo-shell">
          <md-gb-nav-rail
            collapsible
            alignment="center"
            aria-label="Center aligned navigation rail">
            <md-gb-nav-rail-item selected>
              <md-gb-icon slot="icon">dashboard</md-gb-icon>
              Overview
            </md-gb-nav-rail-item>
            <md-gb-nav-rail-item>
              <md-gb-icon slot="icon">analytics</md-gb-icon>
              Analytics
            </md-gb-nav-rail-item>
            <md-gb-nav-rail-item>
              <md-gb-icon slot="icon">person</md-gb-icon>
              Account
            </md-gb-nav-rail-item>
          </md-gb-nav-rail>
          <div class="demo-content">Center Aligned Rail</div>
        </div>
      </div>
    `;
  },
};

const modalBack: MaterialStoryInit<StoryKnobs> = {
  name: 'Modal rail and predictive back',
  styles,
  render() {
    const railRef = createRef<NavRailElement>();
    return html`
      <div class="demo-shell" style="position: relative">
        <md-gb-nav-rail
          ${ref(railRef)}
          modal
          collapsible
          aria-label="Modal navigation rail">
          <md-gb-nav-rail-item selected>
            <md-gb-icon slot="icon">mail</md-gb-icon>
            Inbox
          </md-gb-nav-rail-item>
          <md-gb-nav-rail-item>
            <md-gb-icon slot="icon">chat_bubble</md-gb-icon>
            Chat
          </md-gb-nav-rail-item>
          <md-gb-nav-rail-item>
            <md-gb-icon slot="icon">groups</md-gb-icon>
            Spaces
          </md-gb-nav-rail-item>
        </md-gb-nav-rail>
        <div class="demo-content" style="flex-direction: column; gap: 16px">
          <p style="max-width: 360px; margin: 0">
            Expand the modal rail with the menu button. The Android back
            gesture or button (or Escape) collapses it; back first plays the
            predictive back motion, popping the rail off its edge. The scrim
            and the menu button are the single-pointer alternatives to
            swiping it closed.
          </p>
          <md-gb-button
            color="tonal"
            @click=${() => {
              const rail = railRef.value;
              if (!rail) return;
              rail.expand();
              globalThis.setTimeout(() => {
                rail.handleBack();
              }, 600);
            }}>
            Expand, then simulate back
          </md-gb-button>
        </div>
      </div>
    `;
  },
};

/** Navigation Rail stories. */
export const stories = [playground, allVariants, modalBack];
