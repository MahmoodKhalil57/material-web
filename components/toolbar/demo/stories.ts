/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/components/button/md-gb-button.js';
import '@material/web/components/fab/md-gb-fab.js';
import '@material/web/components/iconbutton/md-gb-icon-button.js';
import '@material/web/components/toolbar/md-gb-toolbar.js';
import '@material/web/styles/icon/md-gb-icon.js';

import {MaterialStoryInit} from './material-collection.js';
import {
  type ToolbarColor,
  type ToolbarOrientation,
} from '@material/web/components/toolbar/toolbar.js';
import {
  type ScrollPaddingController,
  setupScrollPadding,
} from '@material/web/components/appbar/scroll-padding.js';
import {adoptStyles} from '@material/web/styles/adopt-styles.js';
import {css, html} from 'lit';
import {ref} from 'lit/directives/ref.js';

import {styles as m3Styles} from '@material/web/styles/m3.cssresult.js';

/** Knob types for toolbar stories. */
export interface StoryKnobs {
  color?: ToolbarColor;
  orientation?: ToolbarOrientation;
  docked: boolean;
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
    align-items: center;
    background-color: var(--md-sys-color-surface);
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 16px;
    box-shadow: var(--md-sys-elevation-shadow-1);
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
    min-height: 140px;
    overflow: hidden;
    padding: 24px;
  }

  .demo-stack {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
`;

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render(knobs) {
    const color = knobs.color || 'standard';
    const orientation = knobs.orientation || 'horizontal';
    const docked = Boolean(knobs.docked);

    return html`
      <div class="demo-container">
        <md-gb-toolbar
          color=${color}
          orientation=${orientation}
          ?docked=${docked}
          aria-label="Formatting toolbar">
          <md-gb-button square type="toggle" selected>
            <md-gb-icon>edit</md-gb-icon>
            Edit
          </md-gb-button>
          <md-gb-button square type="toggle">
            <md-gb-icon>palette</md-gb-icon>
            Style
          </md-gb-button>
          <md-gb-icon-button square aria-label="Favorite" type="toggle">
            <md-gb-icon>favorite</md-gb-icon>
          </md-gb-icon-button>
          <md-gb-icon-button square aria-label="Settings" type="toggle">
            <md-gb-icon>settings</md-gb-icon>
          </md-gb-icon-button>
        </md-gb-toolbar>
      </div>
    `;
  },
};

const allVariants: MaterialStoryInit<StoryKnobs> = {
  name: 'Expressive Variants',
  styles,
  render() {
    return html`
      <div class="demo-stack">
        <div class="demo-container">
          <md-gb-toolbar color="standard" aria-label="Standard floating">
            <md-gb-button square type="toggle" selected>
              <md-gb-icon>star</md-gb-icon>
              Starred
            </md-gb-button>
            <md-gb-button square type="toggle">
              <md-gb-icon>visibility</md-gb-icon>
              Preview
            </md-gb-button>
            <md-gb-icon-button square aria-label="Favorite" type="toggle">
              <md-gb-icon>favorite</md-gb-icon>
            </md-gb-icon-button>
          </md-gb-toolbar>
        </div>

        <div class="demo-container">
          <md-gb-toolbar color="vibrant" aria-label="Vibrant floating">
            <md-gb-button square type="toggle" selected>
              <md-gb-icon>auto_awesome</md-gb-icon>
              Generate
            </md-gb-button>
            <md-gb-button square type="toggle">
              <md-gb-icon>palette</md-gb-icon>
              Theme
            </md-gb-button>
            <md-gb-icon-button
              square
              aria-label="Bookmark"
              type="toggle"
              selected>
              <md-gb-icon>bookmark</md-gb-icon>
            </md-gb-icon-button>
          </md-gb-toolbar>
        </div>

        <div class="demo-container">
          <md-gb-toolbar color="standard" docked aria-label="Standard docked">
            <md-gb-icon-button square aria-label="Home" type="toggle">
              <md-gb-icon>home</md-gb-icon>
            </md-gb-icon-button>
            <md-gb-button square type="toggle" selected>
              <md-gb-icon>folder</md-gb-icon>
              Files
            </md-gb-button>
            <md-gb-icon-button square aria-label="Image" type="toggle">
              <md-gb-icon>image</md-gb-icon>
            </md-gb-icon-button>
          </md-gb-toolbar>
        </div>
      </div>
    `;
  },
};

const withFab: MaterialStoryInit<StoryKnobs> = {
  name: 'Floating toolbar with FAB',
  styles,
  render() {
    const bar = (color: 'standard' | 'vibrant', vertical = false) => html`
      <md-gb-toolbar
        color=${color}
        orientation=${vertical ? 'vertical' : 'horizontal'}
        aria-label="${color} toolbar with FAB">
        <md-gb-icon-button aria-label="Bold"
          ><md-gb-icon>format_bold</md-gb-icon></md-gb-icon-button
        >
        <md-gb-icon-button aria-label="Italic"
          ><md-gb-icon>format_italic</md-gb-icon></md-gb-icon-button
        >
        <md-gb-icon-button aria-label="Underline"
          ><md-gb-icon>format_underlined</md-gb-icon></md-gb-icon-button
        >
        <md-gb-fab slot="fab" aria-label="Add"
          ><md-gb-icon>add</md-gb-icon></md-gb-fab
        >
      </md-gb-toolbar>
    `;
    const toggle = (event: Event) => {
      const button = event.currentTarget as HTMLElement;
      for (const toolbar of Array.from(
        button.parentElement!.querySelectorAll('md-gb-toolbar'),
      )) {
        toolbar.expanded = !toolbar.expanded;
      }
    };
    return html`
      <div style="display: flex; flex-direction: column; gap: 24px; align-items: flex-start;">
        <md-gb-button @click=${toggle}>Expand / collapse</md-gb-button>
        ${bar('standard')} ${bar('vibrant')}
        <div style="display: flex; gap: 24px;">
          ${bar('standard', true)} ${bar('vibrant', true)}
        </div>
      </div>
    `;
  },
};

const paddings = new WeakMap<Element, ScrollPaddingController>();

/** Sets up `setupScrollPadding()` for the floating toolbar and the FAB. */
const scrollPaddingRef = ref((scroller?: Element) => {
  if (!(scroller instanceof HTMLElement) || paddings.has(scroller)) return;
  const end = Array.from(
    scroller.querySelectorAll('.scroll-demo-toolbar, .scroll-demo-fab'),
  );
  paddings.set(scroller, setupScrollPadding(scroller, {end}));
});

const focusNotObscured: MaterialStoryInit<StoryKnobs> = {
  name: 'Floating toolbar and FAB: focus not obscured',
  styles: [
    styles,
    css`
      .scroll-demo {
        border: 1px solid var(--md-sys-color-outline-variant);
        border-radius: 16px;
        block-size: 360px;
        overflow: auto;
        position: relative;
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

      .scroll-demo-footer {
        align-items: end;
        display: flex;
        gap: 16px;
        inset-block-end: 16px;
        justify-content: center;
        pointer-events: none;
        position: sticky;
      }

      .scroll-demo-footer > * {
        pointer-events: auto;
      }
    `,
  ],
  render() {
    return html`
      <div class="scroll-demo" ${scrollPaddingRef}>
        <p>
          setupScrollPadding() sets scroll-padding-block-end (and
          --md-gb-obscured-block-end) on this scroller to the space the
          floating toolbar and the FAB cover, so tabbing down the list never
          leaves a focused button or its focus ring behind them.
        </p>
        <div class="scroll-demo-list">
          ${Array.from(
            {length: 16},
            (_, i) =>
              html`<md-gb-button color="outlined">Item ${i + 1}</md-gb-button>`,
          )}
        </div>
        <div class="scroll-demo-footer scroll-demo-toolbar">
          <md-gb-toolbar aria-label="Formatting">
            <md-gb-icon-button aria-label="Bold"
              ><md-gb-icon>format_bold</md-gb-icon></md-gb-icon-button
            >
            <md-gb-icon-button aria-label="Italic"
              ><md-gb-icon>format_italic</md-gb-icon></md-gb-icon-button
            >
          </md-gb-toolbar>
          <md-gb-fab class="scroll-demo-fab" aria-label="Add"
            ><md-gb-icon>add</md-gb-icon></md-gb-fab
          >
        </div>
      </div>
    `;
  },
};

/** Toolbar stories. */
export const stories = [playground, allVariants, withFab, focusNotObscured];
