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
  'Select',
  [
    new Knob('variant', {
      ui: selectDropdown({
        options: [
          {value: 'filled', label: 'Filled'},
          {value: 'outlined', label: 'Outlined'},
        ],
      }),
      defaultValue: 'filled',
    }),
    new Knob('label', {ui: textInput(), defaultValue: 'Fruit'}),
    new Knob('supportingText', {
      ui: textInput(),
      defaultValue: 'Supporting text',
    }),
    new Knob('errorText', {ui: textInput(), defaultValue: 'Error text'}),
    new Knob('filter', {
      ui: selectDropdown({
        options: [
          {value: 'contains', label: 'Contains'},
          {value: 'starts-with', label: 'Starts with'},
          {value: 'none', label: 'None'},
        ],
      }),
      defaultValue: 'contains',
    }),
    new Knob('disabled', {ui: boolInput(), defaultValue: false}),
    new Knob('required', {ui: boolInput(), defaultValue: false}),
    new Knob('error', {ui: boolInput(), defaultValue: false}),
    new Knob('leadingIcon', {ui: boolInput(), defaultValue: false}),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
