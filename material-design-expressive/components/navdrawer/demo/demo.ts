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
import {boolInput, Knob} from './index.js';

import {stories, type StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Navigation Drawer',
  [
    new Knob('modal', {ui: boolInput(), defaultValue: false}),
    new Knob('open', {ui: boolInput(), defaultValue: true}),
    new Knob('showHeadline', {ui: boolInput(), defaultValue: true}),
    new Knob('showIcons', {ui: boolInput(), defaultValue: true}),
    new Knob('showBadges', {ui: boolInput(), defaultValue: true}),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
