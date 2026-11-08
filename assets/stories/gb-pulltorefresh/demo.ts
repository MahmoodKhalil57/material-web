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
import {boolInput, Knob, numberInput} from './index.js';

import {stories, type StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Pull to refresh',
  [
    new Knob('circular', {ui: boolInput(), defaultValue: false}),
    new Knob('disabled', {ui: boolInput(), defaultValue: false}),
    new Knob('threshold', {ui: numberInput({step: 10}), defaultValue: 80}),
    new Knob('refreshMs', {ui: numberInput({step: 250}), defaultValue: 1500}),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
