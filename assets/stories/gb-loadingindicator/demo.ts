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
import {boolInput, Knob, numberInput} from './index.js';

import {stories, StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Loading indicator',
  [
    new Knob('contained', {ui: boolInput(), defaultValue: false}),
    new Knob('determinate', {ui: boolInput(), defaultValue: false}),
    new Knob('progress', {ui: numberInput({step: 0.05}), defaultValue: 0.4}),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection);
