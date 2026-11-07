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
  'Menu',
  [
    new Knob('vibrant', {ui: boolInput()}),
    // menus.md "Density" (web only): 4px less item height per step.
    new Knob('density', {
      ui: selectDropdown({
        options: [
          {value: '0', label: '0 (48px items)'},
          {value: '-1', label: '-1 (44px items)'},
          {value: '-2', label: '-2 (40px items)'},
          {value: '-3', label: '-3 (36px items)'},
        ],
      }),
      defaultValue: '0',
    }),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
