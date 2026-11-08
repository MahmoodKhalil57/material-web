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
import {Knob, numberInput, selectDropdown} from './index.js';

import {stories, StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Tabs',
  [
    new Knob('variant', {
      ui: selectDropdown<'primary' | 'secondary'>({
        options: [
          {label: 'primary', value: 'primary'},
          {label: 'secondary', value: 'secondary'},
        ],
      }),
    }),
    new Knob('selectedIndex', {ui: numberInput(), defaultValue: 0}),
    // tabs.md "Avoid applying density by default": opt-in, 4px per step.
    new Knob('density', {
      ui: selectDropdown({
        options: [
          {value: '0', label: '0 (48px / 64px)'},
          {value: '-1', label: '-1 (44px / 60px)'},
          {value: '-2', label: '-2 (40px / 56px)'},
          {value: '-3', label: '-3 (36px / 52px)'},
        ],
      }),
      defaultValue: '0',
    }),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
