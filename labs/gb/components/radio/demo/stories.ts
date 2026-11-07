/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/radio/md-gb-radio.js';

import {MaterialStoryInit} from './material-collection.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {css, html} from 'lit';

import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';

/** Knob types for radio stories. */
export interface StoryKnobs {
  disabled: boolean;
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
      <md-gb-radio
        name="group"
        density=${knobs.density}
        ?disabled=${knobs.disabled}></md-gb-radio>
      <md-gb-radio
        name="group"
        density=${knobs.density}
        ?disabled=${knobs.disabled}></md-gb-radio>
      <md-gb-radio
        name="group"
        density=${knobs.density}
        ?disabled=${knobs.disabled}></md-gb-radio>
    `;
  },
};

// radio-button.md: "Avoid applying density by default". Each step removes
// 4px from the layout box; the touch target stays 48px.
const density: MaterialStoryInit<StoryKnobs> = {
  name: 'Density',
  render() {
    return html`${['0', '-1', '-2', '-3'].map(
      (d) =>
        html`<div style="display: flex; align-items: center">
          <md-gb-radio
            name="density${d}"
            aria-label="Density ${d}, first"
            checked
            density=${d}></md-gb-radio>
          <md-gb-radio
            name="density${d}"
            aria-label="Density ${d}, second"
            density=${d}></md-gb-radio>
          <span>Density ${d}</span>
        </div>`,
    )}`;
  },
};

/** Radio stories. */
export const stories = [playground, density];
