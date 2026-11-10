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
  'Checkbox',
  [
    new Knob('checked', {ui: boolInput()}),
    new Knob('indeterminate', {ui: boolInput()}),
    new Knob('error', {ui: boolInput()}),
    new Knob('density', {
      ui: selectDropdown({
        options: [
          {value: '0', label: '0 (48px box)'},
          {value: '-1', label: '-1 (44px box)'},
          {value: '-2', label: '-2 (40px box)'},
          {value: '-3', label: '-3 (36px box)'},
        ],
      }),
      defaultValue: '0',
    }),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
