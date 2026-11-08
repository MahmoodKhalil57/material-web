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
import {boolInput, Knob, selectDropdown, textInput} from './index.js';

import {stories, StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Switch',
  [
    new Knob('selected', {ui: boolInput()}),
    new Knob('disabled', {ui: boolInput()}),
    new Knob('onIcon', {ui: textInput()}),
    new Knob('offIcon', {ui: textInput()}),
    new Knob('density', {
      ui: selectDropdown({
        options: [
          {value: '0', label: '0 (40px state layer)'},
          {value: '-1', label: '-1 (36px state layer)'},
          {value: '-2', label: '-2 (32px state layer)'},
          {value: '-3', label: '-3 (28px state layer)'},
        ],
      }),
      defaultValue: '0',
    }),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
