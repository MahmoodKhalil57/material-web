/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/styles/icon/md-gb-icon.js';

import {type MaterialStoryInit} from './material-collection.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';
import {css, html} from 'lit';
import {styleMap} from 'lit/directives/style-map.js';

/** Knob types for icon stories. */
export interface StoryKnobs {
  icon: string;
  size: number;
  fill: boolean;
  weight: number;
  grade: number;
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
  .row {
    align-items: center;
    color: var(--md-sys-color-on-surface);
    display: flex;
    flex-wrap: wrap;
    font: var(--md-sys-typescale-label-md);
    gap: 24px;
  }
  .cell {
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;

/** Axis custom properties from the knobs, with per-cell overrides. */
function axes(knobs: StoryKnobs, overrides: Record<string, string | number>) {
  const style: Record<string, string> = {
    '--md-icon-size': `${knobs.size}px`,
    '--md-icon-fill': knobs.fill ? '1' : '0',
    '--md-icon-wght': String(knobs.weight),
    '--md-icon-grad': String(knobs.grade),
  };
  for (const [key, value] of Object.entries(overrides)) {
    style[key] = String(value);
  }
  return styleMap(style);
}

function axisRow(
  knobs: StoryKnobs,
  property: string,
  values: Array<string | number>,
  label: (value: string | number) => string = String,
) {
  return html`<div class="row">
    ${values.map(
      (value) =>
        html`<div class="cell">
          <md-gb-icon style=${axes(knobs, {[property]: value})}
            >${knobs.icon}</md-gb-icon
          >${label(value)}
        </div>`,
    )}
  </div>`;
}

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render(knobs) {
    return html`<md-gb-icon style=${axes(knobs, {})}
      >${knobs.icon}</md-gb-icon
    >`;
  },
};

const opticalSizes: MaterialStoryInit<StoryKnobs> = {
  name: 'Optical sizes',
  styles,
  render(knobs) {
    // styles/icons.md: 20, 24, 40 and 48dp; the optical size follows the size.
    return axisRow(knobs, '--md-icon-size', ['20px', '24px', '40px', '48px']);
  },
};

const weights: MaterialStoryInit<StoryKnobs> = {
  name: 'Weights',
  styles,
  render(knobs) {
    return axisRow(knobs, '--md-icon-wght', [100, 200, 300, 400, 500, 600, 700]);
  },
};

const fill: MaterialStoryInit<StoryKnobs> = {
  name: 'Fill',
  styles,
  render(knobs) {
    // Unselected (outlined) and selected (filled) symbols.
    return axisRow(knobs, '--md-icon-fill', [0, 1], (value) => `FILL ${value}`);
  },
};

const grades: MaterialStoryInit<StoryKnobs> = {
  name: 'Grades',
  styles,
  render(knobs) {
    // -25 for light icons on dark backgrounds, 0 by default, 200 emphasis.
    return axisRow(knobs, '--md-icon-grad', [-25, 0, 200]);
  },
};

/** Icon stories. */
export const stories = [playground, opticalSizes, weights, fill, grades];
