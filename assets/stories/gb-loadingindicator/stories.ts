/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/loadingindicator/md-gb-loading-indicator.js';

import {MaterialStoryInit} from './material-collection.js';
import {loadingIndicator} from '@material/web/labs/gb/components/loadingindicator/loading-indicator.js';
import {styles as loadingIndicatorStyles} from '@material/web/labs/gb/components/loadingindicator/loading-indicator.cssresult.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';
import {css, html} from 'lit';

/** Knob types for loading indicator stories. */
export interface StoryKnobs {
  contained: boolean;
  determinate: boolean;
  progress: number;
}

adoptStyles(document, [m3Styles]);

const styles = css`
  .row {
    align-items: center;
    display: flex;
    gap: 24px;
    margin: 16px;
  }
`;

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render({contained, determinate, progress}) {
    return html`
      <div class="row">
        <md-gb-loading-indicator
          aria-label="Loading"
          ?contained=${contained}
          .value=${determinate ? progress : undefined}></md-gb-loading-indicator>
      </div>
    `;
  },
};

const directive: MaterialStoryInit<StoryKnobs> = {
  name: 'Directive',
  styles: [styles, loadingIndicatorStyles],
  render({progress}) {
    return html`
      <div class="row">
        <div class="${loadingIndicator()}" aria-label="Loading"></div>
        <div
          class="${loadingIndicator({contained: true})}"
          aria-label="Loading"></div>
        <div
          class="${loadingIndicator({determinate: true})}"
          style="--progress: ${progress}"
          aria-label="Downloading"
          aria-valuenow="${Math.round(progress * 100)}"></div>
      </div>
    `;
  },
};

/** Loading indicator stories. */
export const stories = [playground, directive];
