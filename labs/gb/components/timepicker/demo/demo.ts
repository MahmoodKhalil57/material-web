/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './material-collection.js';
import './index.js';

import {
  type KnobTypesToKnobs,
  MaterialCollection,
  materialInitsToStoryInits,
  setUpDemo,
} from './material-collection.js';
import {boolInput, Knob, selectDropdown, textInput} from './index.js';

import {stories, type StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Time picker',
  [
    new Knob('value', {ui: textInput(), defaultValue: '07:30'}),
    new Knob('hourCycle', {
      ui: selectDropdown({
        options: [
          {value: '', label: 'Locale default'},
          {value: '12', label: '12-hour'},
          {value: '24', label: '24-hour'},
        ],
      }),
      defaultValue: '',
    }),
    new Knob('orientation', {
      ui: selectDropdown({
        options: [
          {value: '', label: 'Automatic'},
          {value: 'vertical', label: 'Vertical'},
          {value: 'horizontal', label: 'Horizontal'},
        ],
      }),
      defaultValue: '',
    }),
    new Knob('mode', {
      ui: selectDropdown({
        options: [
          {value: 'dial', label: 'Dial'},
          {value: 'input', label: 'Input'},
        ],
      }),
      defaultValue: 'dial',
    }),
    new Knob('disabled', {ui: boolInput(), defaultValue: false}),
    // time-pickers.md "Density": 4px less per step (not the horizontal dial).
    new Knob('density', {
      ui: selectDropdown({
        options: [
          {value: '0', label: '0'},
          {value: '-1', label: '-1'},
          {value: '-2', label: '-2'},
          {value: '-3', label: '-3'},
        ],
      }),
      defaultValue: '0',
    }),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
