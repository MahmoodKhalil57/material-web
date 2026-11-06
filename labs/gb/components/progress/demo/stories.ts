/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/progress/md-gb-progress.js';

import {MaterialStoryInit} from './material-collection.js';
import {progress} from '@material/web/labs/gb/components/progress/progress.js';
import {styles as progressStyles} from '@material/web/labs/gb/components/progress/progress.cssresult.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';
import {css, html} from 'lit';

/** Knob types for progress indicator stories. */
export interface StoryKnobs {
  circular: boolean;
  wavy: boolean;
  determinate: boolean;
  progress: number;
}

adoptStyles(document, [m3Styles]);

const styles = css`
  .column {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin: 16px;
    max-width: 320px;
  }
  .row {
    align-items: center;
    display: flex;
    gap: 24px;
  }
`;

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render({circular, wavy, determinate, progress}) {
    return html`
      <div class="column">
        <md-gb-progress
          aria-label="Loading"
          ?circular=${circular}
          ?wavy=${wavy}
          .value=${determinate ? progress : undefined}></md-gb-progress>
      </div>
    `;
  },
};

const variants: MaterialStoryInit<StoryKnobs> = {
  name: 'Variants',
  styles,
  render({progress}) {
    return html`
      <div class="column">
        <md-gb-progress aria-label="Loading" .value=${progress}></md-gb-progress>
        <md-gb-progress aria-label="Loading"></md-gb-progress>
        <md-gb-progress aria-label="Loading" wavy .value=${progress}></md-gb-progress>
        <md-gb-progress aria-label="Loading" wavy></md-gb-progress>
        <div class="row">
          <md-gb-progress
            aria-label="Loading"
            circular
            .value=${progress}></md-gb-progress>
          <md-gb-progress aria-label="Loading" circular></md-gb-progress>
          <md-gb-progress
            aria-label="Loading"
            circular
            wavy
            .value=${progress}></md-gb-progress>
          <md-gb-progress aria-label="Loading" circular wavy></md-gb-progress>
        </div>
      </div>
    `;
  },
};

const directive: MaterialStoryInit<StoryKnobs> = {
  name: 'Directive',
  styles: [styles, progressStyles],
  render({progress: value}) {
    return html`
      <div class="column">
        <div class="${progress()}" aria-label="Loading"></div>
        <div class="${progress({wavy: true})}" aria-label="Loading"></div>
        <div
          class="${progress({determinate: true})}"
          style="--progress: ${value}"
          aria-label="Downloading"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="${Math.round(value * 100)}"></div>
        <div class="row">
          <div class="${progress({circular: true})}" aria-label="Loading"></div>
          <div
            class="${progress({circular: true, wavy: true})}"
            aria-label="Loading"></div>
          <div
            class="${progress({circular: true, determinate: true})}"
            style="--progress: ${value}"
            aria-label="Downloading"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow="${Math.round(value * 100)}"></div>
        </div>
      </div>
    `;
  },
};

/** Progress indicator stories. */
export const stories = [playground, variants, directive];
