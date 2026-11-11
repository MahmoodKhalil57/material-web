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
import {boolInput, Knob, numberInput, textInput} from './index.js';

import {stories, type StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Icons',
  [
    new Knob('icon', {ui: textInput(), defaultValue: 'favorite'}),
    new Knob('size', {ui: numberInput(), defaultValue: 24}),
    new Knob('fill', {ui: boolInput(), defaultValue: false}),
    new Knob('weight', {ui: numberInput(), defaultValue: 400}),
    new Knob('grade', {ui: numberInput(), defaultValue: 0}),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
