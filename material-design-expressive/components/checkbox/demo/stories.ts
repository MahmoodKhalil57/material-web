/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/components/checkbox/md-gb-checkbox.js';

import {MaterialStoryInit} from './material-collection.js';
import {adoptStyles} from '@material/web/styles/adopt-styles.js';
import {css, html} from 'lit';

import {styles as m3Styles} from '@material/web/styles/m3.cssresult.js';

/** Knob types for checkbox stories. */
export interface StoryKnobs {
  checked: boolean;
  indeterminate: boolean;
  error: boolean;
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
      <md-gb-checkbox density=${knobs.density}></md-gb-checkbox>
      <md-gb-checkbox checked density=${knobs.density}></md-gb-checkbox>
      <md-gb-checkbox
        density=${knobs.density}
        .checked=${knobs.checked}
        .indeterminate=${knobs.indeterminate}
        .error=${knobs.error}></md-gb-checkbox>
    `;
  },
};

// checkbox.md: "Avoid applying density by default". Each step removes 4px
// from the layout box; the touch target stays 48px.
const density: MaterialStoryInit<StoryKnobs> = {
  name: 'Density',
  render() {
    return html`${['0', '-1', '-2', '-3'].map(
      (d) =>
        html`<div style="display: flex; align-items: center">
          <md-gb-checkbox
            aria-label="Density ${d}"
            density=${d}></md-gb-checkbox>
          <md-gb-checkbox
            aria-label="Density ${d}, checked"
            checked
            density=${d}></md-gb-checkbox>
          <span>Density ${d}</span>
        </div>`,
    )}`;
  },
};

/** Checkbox stories. */
export const stories = [playground, density];
