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
import {boolInput, colorPicker, Knob, selectDropdown} from './index.js';

import {stories, type StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Color',
  [
    new Knob('source', {
      ui: colorPicker(),
      defaultValue: '#6750a4',
    }),
    new Knob('variant', {
      ui: selectDropdown({
        options: [
          {value: 'tonal-spot', label: 'Tonal spot'},
          {value: 'neutral', label: 'Neutral'},
          {value: 'vibrant', label: 'Vibrant'},
          {value: 'expressive', label: 'Expressive'},
          {value: 'fidelity', label: 'Fidelity'},
          {value: 'content', label: 'Content'},
          {value: 'monochrome', label: 'Monochrome'},
          {value: 'rainbow', label: 'Rainbow'},
          {value: 'fruit-salad', label: 'Fruit salad'},
        ],
      }),
      defaultValue: 'tonal-spot',
    }),
    new Knob('contrast', {
      ui: selectDropdown({
        options: [
          {value: 'standard', label: 'Standard'},
          {value: 'medium', label: 'Medium'},
          {value: 'high', label: 'High'},
        ],
      }),
      defaultValue: 'standard',
    }),
    new Knob('specVersion', {
      ui: selectDropdown({
        options: [
          {value: '2025', label: '2025 (Expressive)'},
          {value: '2021', label: '2021'},
        ],
      }),
      defaultValue: '2025',
    }),
    new Knob('platform', {
      ui: selectDropdown({
        options: [
          {value: 'phone', label: 'Phone'},
          {value: 'watch', label: 'Watch'},
        ],
      }),
      defaultValue: 'phone',
    }),
    new Knob('dark', {
      ui: boolInput(),
      defaultValue: false,
    }),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
