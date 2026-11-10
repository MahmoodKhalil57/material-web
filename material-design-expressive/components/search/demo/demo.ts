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
import {boolInput, Knob, textInput} from './index.js';

import {stories, type StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Search',
  [
    new Knob('placeholder', {
      ui: textInput(),
      defaultValue: 'Search recipes',
    }),
    new Knob('docked', {ui: boolInput(), defaultValue: false}),
    new Knob('divided', {ui: boolInput(), defaultValue: false}),
    new Knob('avatar', {ui: boolInput(), defaultValue: true}),
    new Knob('disabled', {ui: boolInput(), defaultValue: false}),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
