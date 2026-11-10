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
  'Dialog',
  [
    new Knob('headline', {
      ui: textInput(),
      defaultValue: 'Permanently delete?',
    }),
    new Knob('supportingText', {
      ui: textInput(),
      defaultValue:
        'Deleting the selected messages will also remove them from all synced devices.',
    }),
    new Knob('icon', {ui: textInput(), defaultValue: 'restart_alt'}),
    new Knob('quick', {ui: boolInput(), defaultValue: false}),
    new Knob('noFocusTrap', {ui: boolInput(), defaultValue: false}),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
