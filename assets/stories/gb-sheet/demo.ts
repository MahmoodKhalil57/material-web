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
  'Sheets',
  [
    new Knob('skipPartiallyExpanded', {ui: boolInput(), defaultValue: false}),
    new Knob('hideDragHandle', {ui: boolInput(), defaultValue: false}),
    new Knob('headline', {ui: textInput(), defaultValue: 'Title'}),
    new Knob('hasBackButton', {ui: boolInput(), defaultValue: false}),
    new Knob('divider', {ui: boolInput(), defaultValue: false}),
    new Knob('rtl', {ui: boolInput(), defaultValue: false}),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
