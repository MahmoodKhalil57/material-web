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
import {boolInput, Knob, selectDropdown} from './index.js';

import {stories, type StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Scaffold',
  [
    new Knob('resizable', {ui: boolInput(), defaultValue: true}),
    new Knob('handleTap', {
      ui: selectDropdown({
        options: [
          {value: 'toggle', label: 'Tap toggles one / two panes'},
          {value: 'cycle', label: 'Tap cycles snap widths'},
        ],
      }),
      defaultValue: 'toggle',
    }),
    new Knob('mediumTwoPane', {ui: boolInput(), defaultValue: false}),
    new Knob('arrangement', {
      ui: selectDropdown({
        options: [
          {value: 'fixed-flexible', label: 'Fixed and flexible'},
          {value: 'split', label: 'Split'},
        ],
      }),
      defaultValue: 'fixed-flexible',
    }),
    new Knob('levitate', {
      ui: selectDropdown({
        options: [
          {value: 'docked', label: 'Docked (floating from medium)'},
          {value: 'floating', label: 'Floating'},
          {value: 'none', label: 'None (reflow)'},
        ],
      }),
      defaultValue: 'docked',
    }),
    new Knob('levitateModal', {ui: boolInput(), defaultValue: false}),
    new Knob('dir', {
      ui: selectDropdown({
        options: [
          {value: 'ltr', label: 'Left to right'},
          {value: 'rtl', label: 'Right to left'},
        ],
      }),
      defaultValue: 'ltr',
    }),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
