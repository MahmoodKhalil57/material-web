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
import {
  boolInput,
  Knob,
  numberInput,
  selectDropdown,
  textInput,
} from './index.js';

import {stories, type StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Text field',
  [
    new Knob('variant', {
      ui: selectDropdown({
        options: [
          {value: 'filled', label: 'Filled'},
          {value: 'outlined', label: 'Outlined'},
        ],
      }),
      defaultValue: 'filled',
    }),
    new Knob('label', {ui: textInput(), defaultValue: 'Label'}),
    new Knob('placeholder', {ui: textInput(), defaultValue: ''}),
    new Knob('supportingText', {
      ui: textInput(),
      defaultValue: 'Supporting text',
    }),
    new Knob('errorText', {ui: textInput(), defaultValue: 'Error text'}),
    new Knob('prefixText', {ui: textInput(), defaultValue: ''}),
    new Knob('suffixText', {ui: textInput(), defaultValue: ''}),
    new Knob('maxLength', {ui: numberInput(), defaultValue: -1}),
    new Knob('disabled', {ui: boolInput(), defaultValue: false}),
    new Knob('required', {ui: boolInput(), defaultValue: false}),
    new Knob('error', {ui: boolInput(), defaultValue: false}),
    new Knob('leadingIcon', {ui: boolInput(), defaultValue: false}),
    new Knob('trailingIcon', {ui: boolInput(), defaultValue: false}),
    // text-fields.md "Avoid applying density by default": opt-in, 4px less
    // height per step.
    new Knob('density', {
      ui: selectDropdown({
        options: [
          {value: '0', label: '0 (56px)'},
          {value: '-1', label: '-1 (52px)'},
          {value: '-2', label: '-2 (48px)'},
          {value: '-3', label: '-3 (44px)'},
        ],
      }),
      defaultValue: '0',
    }),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
