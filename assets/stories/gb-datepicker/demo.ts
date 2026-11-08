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
import {boolInput, Knob, selectDropdown, textInput} from './index.js';

import {stories, type StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Date picker',
  [
    new Knob('locale', {
      ui: selectDropdown({
        options: [
          {value: '', label: 'Default (document lang)'},
          {value: 'en-US', label: 'English (US)'},
          {value: 'en-GB', label: 'English (UK)'},
          {value: 'de-DE', label: 'German'},
          {value: 'fr-FR', label: 'French'},
          {value: 'ja-JP', label: 'Japanese'},
          {value: 'ar-EG', label: 'Arabic (Egypt)'},
          {value: 'he-IL', label: 'Hebrew'},
        ],
      }),
      defaultValue: '',
    }),
    new Knob('firstDayOfWeek', {
      ui: selectDropdown({
        options: [
          {value: '-1', label: 'Locale default'},
          {value: '0', label: 'Sunday'},
          {value: '1', label: 'Monday'},
          {value: '6', label: 'Saturday'},
        ],
      }),
      defaultValue: '-1',
    }),
    new Knob('min', {ui: textInput(), defaultValue: '2025-01-01'}),
    new Knob('max', {ui: textInput(), defaultValue: '2026-12-31'}),
    new Knob('disableWeekends', {ui: boolInput(), defaultValue: false}),
    new Knob('hideActions', {ui: boolInput(), defaultValue: false}),
    new Knob('clearable', {ui: boolInput(), defaultValue: false}),
    new Knob('rtl', {ui: boolInput(), defaultValue: false}),
    new Knob('quick', {ui: boolInput(), defaultValue: false}),
    // The text fields' density; the calendar keeps 48dp targets
    // (date-pickers.md, Accessibility).
    new Knob('density', {
      ui: selectDropdown({
        options: [
          {value: '0', label: '0'},
          {value: '-1', label: '-1'},
          {value: '-2', label: '-2'},
          {value: '-3', label: '-3'},
        ],
      }),
      defaultValue: '0',
    }),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
