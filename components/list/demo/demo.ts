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
  'List',
  [
    new Knob('segmented', {
      ui: boolInput(),
      defaultValue: true,
    }),
    new Knob('nonInteractive', {
      ui: boolInput(),
    }),
    new Knob('density', {
      ui: selectDropdown({
        options: [
          {value: '0', label: '0 (56px)'},
          {value: '-1', label: '-1 (52px)'},
          {value: '-2', label: '-2 (48px)'},
          {value: '-3', label: '-3 (44px)'},
        ],
      }),
      defaultValue: '0',
    }),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
