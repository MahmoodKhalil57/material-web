/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './material-collection.js';
import './index.js';

import {
  KnobTypesToKnobs,
  MaterialCollection,
  materialInitsToStoryInits,
  setUpDemo,
} from './material-collection.js';
import {boolInput, Knob, selectDropdown} from './index.js';

import {stories, StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Chip',
  [
    new Knob('type', {
      ui: selectDropdown({
        options: [
          {value: 'assist', label: 'Assist'},
          {value: 'filter', label: 'Filter'},
          {value: 'input', label: 'Input'},
          {value: 'suggestion', label: 'Suggestion'},
        ],
      }),
    }),
    new Knob('elevated', {
      ui: boolInput(),
      defaultValue: false,
    }),
    new Knob('selected', {
      ui: boolInput(),
      defaultValue: false,
    }),
    new Knob('removable', {
      ui: boolInput(),
      defaultValue: false,
    }),
    new Knob('dragged', {
      ui: boolInput(),
      defaultValue: false,
    }),
    new Knob('disabled', {
      ui: boolInput(),
      defaultValue: false,
    }),
    new Knob('softDisabled', {
      ui: boolInput(),
      defaultValue: false,
    }),
    new Knob('density', {
      ui: selectDropdown({
        options: [
          {value: '0', label: '0 (32px)'},
          {value: '-1', label: '-1 (28px)'},
          {value: '-2', label: '-2 (24px)'},
          {value: '-3', label: '-3 (20px)'},
        ],
      }),
      defaultValue: '0',
    }),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
