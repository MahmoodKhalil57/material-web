/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/iconbutton/md-gb-icon-button.js';
import '@material/web/labs/gb/styles/icon/md-gb-icon.js';

import {MaterialStoryInit} from './material-collection.js';
import {
  IconButtonColor,
  IconButtonSize,
  IconButtonWidth,
} from '@material/web/labs/gb/components/iconbutton/icon-button.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';
import {css, html, nothing} from 'lit';

/** Knob types for icon button stories. */
export interface StoryKnobs {
  icon: string;
  color?: IconButtonColor;
  size?: IconButtonSize;
  width?: IconButtonWidth;
  square: boolean;
  disabled: boolean;
  softDisabled: boolean;
  toggle: boolean;
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

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  render(knobs) {
    return html`
      <md-gb-icon-button
        color=${knobs.color || nothing}
        size=${knobs.size || nothing}
        width=${knobs.width || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        density=${knobs.density}
        type=${knobs.toggle ? 'toggle' : nothing}>
        <md-gb-icon>${knobs.icon}</md-gb-icon>
      </md-gb-icon-button>
    `;
  },
};

const colors: MaterialStoryInit<StoryKnobs> = {
  name: 'Colors',
  render(knobs) {
    return html`
      <md-gb-icon-button
        color="filled"
        size=${knobs.size || nothing}
        width=${knobs.width || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        density=${knobs.density}
        type=${knobs.toggle ? 'toggle' : nothing}>
        <md-gb-icon>${knobs.icon}</md-gb-icon>
      </md-gb-icon-button>
      <md-gb-icon-button
        color="tonal"
        size=${knobs.size || nothing}
        width=${knobs.width || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        density=${knobs.density}
        type=${knobs.toggle ? 'toggle' : nothing}>
        <md-gb-icon>${knobs.icon}</md-gb-icon>
      </md-gb-icon-button>
      <md-gb-icon-button
        color="outlined"
        size=${knobs.size || nothing}
        width=${knobs.width || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        density=${knobs.density}
        type=${knobs.toggle ? 'toggle' : nothing}>
        <md-gb-icon>${knobs.icon}</md-gb-icon>
      </md-gb-icon-button>
      <md-gb-icon-button
        color="standard"
        size=${knobs.size || nothing}
        width=${knobs.width || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        density=${knobs.density}
        type=${knobs.toggle ? 'toggle' : nothing}>
        <md-gb-icon>${knobs.icon}</md-gb-icon>
      </md-gb-icon-button>
    `;
  },
};

const sizes: MaterialStoryInit<StoryKnobs> = {
  name: 'Sizes',
  render(knobs) {
    return html`
      <md-gb-icon-button
        size="xs"
        color=${knobs.color || nothing}
        width=${knobs.width || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        density=${knobs.density}
        type=${knobs.toggle ? 'toggle' : nothing}>
        <md-gb-icon>${knobs.icon}</md-gb-icon>
      </md-gb-icon-button>
      <md-gb-icon-button
        size="sm"
        color=${knobs.color || nothing}
        width=${knobs.width || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        density=${knobs.density}
        type=${knobs.toggle ? 'toggle' : nothing}>
        <md-gb-icon>${knobs.icon}</md-gb-icon>
      </md-gb-icon-button>
      <md-gb-icon-button
        size="md"
        color=${knobs.color || nothing}
        width=${knobs.width || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        density=${knobs.density}
        type=${knobs.toggle ? 'toggle' : nothing}>
        <md-gb-icon>${knobs.icon}</md-gb-icon>
      </md-gb-icon-button>
      <md-gb-icon-button
        size="lg"
        color=${knobs.color || nothing}
        width=${knobs.width || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        density=${knobs.density}
        type=${knobs.toggle ? 'toggle' : nothing}>
        <md-gb-icon>${knobs.icon}</md-gb-icon>
      </md-gb-icon-button>
      <md-gb-icon-button
        size="xl"
        color=${knobs.color || nothing}
        width=${knobs.width || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        density=${knobs.density}
        type=${knobs.toggle ? 'toggle' : nothing}>
        <md-gb-icon>${knobs.icon}</md-gb-icon>
      </md-gb-icon-button>
    `;
  },
};

const widths: MaterialStoryInit<StoryKnobs> = {
  name: 'Widths',
  render(knobs) {
    return html`
      <md-gb-icon-button
        width="narrow"
        color=${knobs.color || nothing}
        size=${knobs.size || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        density=${knobs.density}
        type=${knobs.toggle ? 'toggle' : nothing}>
        <md-gb-icon>${knobs.icon}</md-gb-icon>
      </md-gb-icon-button>
      <md-gb-icon-button
        color=${knobs.color || nothing}
        size=${knobs.size || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        density=${knobs.density}
        type=${knobs.toggle ? 'toggle' : nothing}>
        <md-gb-icon>${knobs.icon}</md-gb-icon>
      </md-gb-icon-button>
      <md-gb-icon-button
        width="wide"
        color=${knobs.color || nothing}
        size=${knobs.size || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        density=${knobs.density}
        type=${knobs.toggle ? 'toggle' : nothing}>
        <md-gb-icon>${knobs.icon}</md-gb-icon>
      </md-gb-icon-button>
    `;
  },
};

// icon-buttons.md, Layout & density: "Avoid applying density by default".
// Each step removes 4px from the container; the target stays 48px.
const density: MaterialStoryInit<StoryKnobs> = {
  name: 'Density',
  render(knobs) {
    return html`${['0', '-1', '-2', '-3'].map(
      (d) =>
        html`<div style="display: flex; align-items: center; gap: 8px">
          <md-gb-icon-button
            aria-label="Density ${d}"
            density=${d}
            color=${knobs.color || nothing}
            size=${knobs.size || nothing}
            width=${knobs.width || nothing}
            ?square=${knobs.square}>
            <md-gb-icon>${knobs.icon}</md-gb-icon>
          </md-gb-icon-button>
          <span>Density ${d}</span>
        </div>`,
    )}`;
  },
};

/** Icon Button stories. */
export const stories = [playground, colors, sizes, widths, density];
