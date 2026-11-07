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
  'Carousel',
  [
    new Knob('layout', {
      ui: selectDropdown({
        options: [
          {value: 'multi-browse', label: 'Multi-browse'},
          {value: 'uncontained', label: 'Uncontained'},
          {
            value: 'uncontained-multi-aspect',
            label: 'Uncontained multi-aspect ratio',
          },
          {value: 'hero', label: 'Hero'},
          {value: 'full-screen', label: 'Full-screen'},
        ],
      }),
      defaultValue: 'multi-browse',
    }),
    new Knob('centered', {ui: boolInput(), defaultValue: false}),
    new Knob('itemWidth', {ui: numberInput(), defaultValue: 186}),
    new Knob('itemCount', {ui: numberInput(), defaultValue: 10}),
    new Knob('labels', {ui: boolInput(), defaultValue: true}),
    new Knob('rtl', {ui: boolInput(), defaultValue: false}),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
