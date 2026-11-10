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
import {
  boolInput,
  Knob,
  numberInput,
  selectDropdown,
  textInput,
} from './index.js';

import {stories, type StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Tooltip',
  [
    new Knob('text', {ui: textInput(), defaultValue: 'Edit'}),
    new Knob('subhead', {ui: textInput(), defaultValue: 'Add others'}),
    new Knob('supportingText', {
      ui: textInput(),
      defaultValue:
        'Grant value is calculated using the closing stock price from the day before the grant date.',
    }),
    new Knob('placement', {
      ui: selectDropdown({
        options: [
          {value: '', label: 'Default'},
          {value: 'above', label: 'Above'},
          {value: 'below', label: 'Below'},
          {value: 'start', label: 'Start'},
          {value: 'end', label: 'End'},
        ],
      }),
      defaultValue: '',
    }),
    new Knob('caret', {ui: boolInput(), defaultValue: false}),
    new Knob('actions', {ui: numberInput(), defaultValue: 1}),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
