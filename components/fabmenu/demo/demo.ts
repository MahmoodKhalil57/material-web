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
import {Knob, numberInput, selectDropdown} from './index.js';

import {type FabSize} from '../../fab/fab.js';
import {type FabMenuAlign, type FabMenuColor} from '../fab-menu.js';
import {stories, StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'FAB menu',
  [
    new Knob('color', {
      ui: selectDropdown<FabMenuColor>({
        options: [
          {value: 'primary', label: 'Primary'},
          {value: 'secondary', label: 'Secondary'},
          {value: 'tertiary', label: 'Tertiary'},
        ],
      }),
    }),
    new Knob('size', {
      ui: selectDropdown<FabSize>({
        options: [
          {value: 'default', label: 'Default'},
          {value: 'md', label: 'Medium'},
          {value: 'lg', label: 'Large'},
        ],
      }),
    }),
    new Knob('align', {
      ui: selectDropdown<FabMenuAlign>({
        options: [
          {value: 'end', label: 'End'},
          {value: 'start', label: 'Start'},
        ],
      }),
    }),
    new Knob('items', {ui: numberInput({step: 1}), defaultValue: 4}),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
