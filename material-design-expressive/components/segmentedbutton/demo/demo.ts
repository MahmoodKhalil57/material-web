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
import {boolInput, Knob, numberInput, selectDropdown} from './index.js';

import {stories, type StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Segmented button',
  [
    new Knob('multiselect', {ui: boolInput(), defaultValue: false}),
    new Knob('required', {ui: boolInput(), defaultValue: false}),
    new Knob('segments', {ui: numberInput(), defaultValue: 3}),
    new Knob('content', {
      ui: selectDropdown({
        options: [
          {value: 'label', label: 'Label'},
          {value: 'icon-label', label: 'Icon and label'},
          {value: 'icon', label: 'Icon'},
        ],
      }),
      defaultValue: 'label',
    }),
    new Knob('density', {
      ui: selectDropdown({
        options: [
          {value: '0', label: '0 (40px)'},
          {value: '-1', label: '-1 (36px)'},
          {value: '-2', label: '-2 (32px)'},
          {value: '-3', label: '-3 (28px)'},
        ],
      }),
      defaultValue: '0',
    }),
    new Knob('noCheckmark', {ui: boolInput(), defaultValue: false}),
    new Knob('disabled', {ui: boolInput(), defaultValue: false}),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
