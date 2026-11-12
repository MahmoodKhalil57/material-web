#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Generates measurement tests from the spec pages' Specs > Measurements
 * tables: each row (a dp value for a named part) becomes one test that
 * renders the component (in the variant / size the row names), measures the
 * part's box in the browser (bounding rect, or computed style for radius,
 * padding and gaps) and compares it with the spec value. Each test cites the
 * row's unit IDs (`// spec:`).
 *
 * Rows that measure wrong in gb go to
 * `components/<dir>/<dir>_measurement_gap.ts` (not run in the main
 * suite, run with `npm run check -- --gaps <dir>`); the rest go to
 * `<dir>_measurement_test.ts`.
 *
 *   node scripts/m3/gen-measurement-tests.mjs            # all components
 *   node scripts/m3/gen-measurement-tests.mjs switch     # one
 *   node scripts/m3/gen-measurement-tests.mjs --check    # fail if out of date
 *
 * Rows of a measurement section that MEASUREMENTS neither maps nor skips
 * (with a reason) are listed in the output, never guessed.
 */

import {pathToFileURL} from 'node:url';
import {
  componentPath,
  emit,
  header,
  loadUnits,
  pruneHelpers,
  resolveCells,
  MEASURE_HELPERS,
  TS_HELPERS,
  tsString,
} from './gen-dom-lib.mjs';
import {MORE_MEASUREMENTS} from './gen-measurement-configs.mjs';

/**
 * Per component directory:
 * - imports: side-effect modules, relative to the component directory.
 * - sections: one per measurement table, with
 *   - page: spec page slug (`.m3-specs/pages/components/<page>.md`);
 *   - section: the units' section prefix (see `units.json`);
 *   - kind: the units' kind or kinds (default `table-row`; `list-item`, `sentence` for measurements
 *     the page lists as bullets);
 *   - host: the component's tag; rows measure elements below it;
 *   - base: default markup;
 *   - rows, in table order.
 *
 * A row:
 * - cells: the texts of its table cells (element name, attribute, value; a
 *   merged multi-column cell matches by its first cell). Every cell is cited.
 * - name: test title.
 * - markup: replaces the section's base markup (the variant / size the row
 *   names).
 * - el: where the part is, as a chain of selectors relative to the host: `''`
 *   is the host, `button` its shadow root's button, `a >> b` goes through
 *   another shadow root, `light:x` queries light DOM (see `find()` in
 *   gen-dom-lib.mjs).
 * - m: what to measure: `width`, `height` (bounding rect), `radius`,
 *   `padding-left|right|top|bottom`, `css-width` / `css-height` (computed, ignoring transforms), `clip-size` / `clip-radius` (a part cut
 *   out with clip-path: inset(), e.g. the switch handle), `margin-left|right|top|bottom`, `radius-top-right|bottom-right|bottom-left`,
 *   `offset-left|right|top|bottom` (the distance to the same edge of `dp.rel`, a part or `window`),
 *   `center-offset-x|y` (the distance between the centers), `line-height`, `gap`
 *   (column gap), `border` (border width; `border-bottom`), `font-size`.
 * - pseudo: measure the pseudo-element's computed box instead (`::after`).
 * - dp: the spec value: a number (equal within 0.5), `{min}`, `{max}`, or
 *   `'full'` (fully rounded radius); `{like: el}` equals the same metric of
 *   another part, `{eq, rel: el}` gives the reference of an `offset-*` metric.
 * - checks: several `{el, m, pseudo, dp}` for one row (e.g. height and
 *   width); a row's own el / m / pseudo / dp are the first.
 * - cases: `[{name, markup, dp, ...}]`, one test each, for a row with a value
 *   per size.
 * - setup: TypeScript statements run after mounting (also per section), e.g.
 *   opening a popover.
 * - viewport: `{width, height}` the window is resized to for this case.
 * - add: `[{el, class}]` classes to add before measuring (e.g. `active` for the
 *   pressed state, which gb styles with a class as well as `:active`).
 * - css / is: instead of m / dp, check a computed style property (e.g.
 *   `css: 'text-align', is: ['start', 'left']`); any listed value passes.
 * - absent: instead, the part must not exist for this markup.
 * - gap: reason string; measured wrong, goes to the gap file (also per case).
 * - skip: reason string; not tested (listed in the report).
 */
const SLIDER_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
const slider = (size, attrs = '', icon = false) =>
  `<md-gb-slider size="${size}" value="50"${attrs} style="width: 300px">${icon ? '<md-gb-icon slot="icon">volume_up</md-gb-icon>' : ''}</md-gb-slider>`;

const CHIP_ICON = '<md-gb-icon slot="icon">star</md-gb-icon>';
const CHIP_TRAILING = '<md-gb-icon slot="trailing-icon">arrow_drop_down</md-gb-icon>';
const CHIP_AVATAR = '<img slot="icon" class="chip-avatar" alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=">';
const chip = (type, attrs = '', inner = '') => `<md-gb-chip type="${type}"${attrs}>Label${inner}</md-gb-chip>`;

const named = (section, prefix) => {
  for (const row of section.rows) row.name = `${prefix}, ${row.name}`;
  return section;
};

/** The measurement rows of one chip type's table; the pages name the same rows differently. */
function chipSection(type) {
  const rows = (names) => names;
  const c = (attrs, inner) => chip(type, attrs, inner);
  const container = type === 'assist' ? '' : 'Container ';
  const [height, shape, padNoIcon, padIcon] =
    type === 'assist' ? ['Height', 'Shape', 'Left/right padding', 'Left/right padding with icon']
    : type === 'suggestion' ? ['Container height', 'Container shape', 'Left/right padding without icon', 'Left/right padding with icon']
    : ['Container height', 'Container shape', 'Left/right padding', 'Left/right padding with icon'];
  const section = {
    page: 'chips',
    section: `chips/specs/${type}-chip/${type}-chip-measurements`,
    host: 'md-gb-chip',
    base: chip(type),
    rows: [],
  };
  const prefix = `${type[0].toUpperCase()}${type.slice(1)} chip`;
  if (type === 'input') {
    section.rows.push(
      {cells: [height, '32dp'], name: 'Container height', el: '[part=chip]', m: 'height', dp: 32},
      {cells: [shape, '8dp corner radius'], name: 'Container shape', el: '[part=chip]', m: 'radius', dp: 8},
      {cells: ['Icon size', '18dp'], name: 'Icon size', markup: c('', CHIP_ICON), el: 'light:md-gb-icon', m: 'width', dp: 18},
      {cells: ['Avatar shape', '12dp corner radius'], name: 'Avatar shape', markup: c('', CHIP_AVATAR), el: 'light:.chip-avatar', m: 'radius', dp: 12},
      {cells: ['Avatar size', '24dp'], name: 'Avatar size', markup: c('', CHIP_AVATAR), el: 'light:.chip-avatar', m: 'width', dp: 24, checks: [{el: 'light:.chip-avatar', m: 'height', dp: 24}]},
      {cells: ['Vertical label text alignment', 'Center-aligned'], name: 'Vertical label text alignment', el: '[part=chip]', css: 'align-items', is: 'center'},
      {cells: ['Horizontal label text alignment', 'Start-aligned'], name: 'Horizontal label text alignment', el: '[part=chip]', css: 'justify-content', is: ['normal', 'flex-start', 'start']},
      {cells: ['Left padding for avatar', '4dp'], name: 'Left padding for avatar', markup: c('', CHIP_AVATAR), el: '[part=chip]', m: 'padding-left', dp: 4},
      {cells: ['Right padding for avatar', '8dp'], name: 'Right padding for avatar', markup: c(' removable', CHIP_AVATAR), el: '[part=chip]', m: 'padding-right', dp: 8},
      {cells: ['Left/right padding for icon', '8dp'], name: 'Left/right padding for icon', markup: c(' removable', CHIP_ICON), el: '[part=chip]', m: 'padding-left', dp: 8, checks: [{el: '[part=chip]', m: 'padding-right', dp: 8}]},
      {cells: ['Padding between elements', '8dp'], name: 'Padding between elements', markup: c(' removable', CHIP_ICON), el: '[part=chip] .chip-action', m: 'gap', dp: 8},
      {cells: ['Target size for close icon', 'Min 48dp'], name: 'Target size for close icon', markup: c(' removable'), el: '.chip-remove', pseudo: '::before', m: 'width', dp: {min: 48}, checks: [{el: '.chip-remove', pseudo: '::before', m: 'height', dp: {min: 48}}]},
    );
    return named(section, prefix);
  }
  section.rows.push(
    {cells: [height, '32dp'], name: 'Container height', el: '[part=chip]', m: 'height', dp: 32},
    {cells: [shape, '8dp corner radius'], name: 'Container shape', el: '[part=chip]', m: 'radius', dp: 8},
    {cells: ['Icon size', '18dp'], name: 'Icon size', markup: c('', CHIP_ICON), el: 'light:md-gb-icon', m: 'width', dp: 18},
    {cells: ['Vertical label text alignment', 'Center-aligned'], name: 'Vertical label text alignment', el: '[part=chip]', css: 'align-items', is: 'center'},
    {cells: ['Horizontal label text alignment', 'Start-aligned'], name: 'Horizontal label text alignment', el: '[part=chip]', css: 'justify-content', is: ['normal', 'flex-start', 'start']},
    {cells: [padNoIcon, '16dp'], name: 'Left/right padding without icon', el: '[part=chip]', m: 'padding-left', dp: 16, checks: [{el: '[part=chip]', m: 'padding-right', dp: 16}]},
    {cells: [padIcon, '8dp'], name: 'Left padding with leading icon', markup: c('', CHIP_ICON), el: '[part=chip]', m: 'padding-left', dp: 8},
    {cells: ['Padding between elements', '8dp'], name: 'Padding between elements', markup: c('', CHIP_ICON), el: '[part=chip]', m: 'gap', dp: 8},
  );
  return named(section, prefix);
}

const BUTTON_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];

/** Corner radius table rows (buttons and icon buttons share the table). */
function cornerRows(tag, part) {
  const m = (size, attrs = '') =>
    `<${tag} size="${size}"${attrs}>${tag === 'md-gb-button' ? 'Label' : '<md-gb-icon>add</md-gb-icon>'}</${tag}>`;
  return [
    {cells: ['XS: A. Round button'], name: 'Round button corner radius', el: part, m: 'radius', cases: BUTTON_SIZES.map((size) => ({name: size, markup: m(size), dp: 'full'}))},
    {cells: ['XS: B. Square button'], name: 'Square button corner radius', el: part, m: 'radius', cases: BUTTON_SIZES.map((size, i) => ({name: size, markup: m(size, ' square'), dp: [12, 12, 16, 28, 28][i]}))},
    {cells: ['XS: C. Pressed state'], name: 'Pressed button corner radius', el: part, m: 'radius', add: [{el: part, class: 'active'}], cases: BUTTON_SIZES.map((size, i) => ({name: size, markup: m(size), dp: [8, 8, 12, 16, 16][i]}))},
  ];
}

const TABS = (icon = '') =>
  `<md-gb-tabs aria-label="Trips"><md-gb-tab>${icon}<span slot="label">Flights</span></md-gb-tab></md-gb-tabs>`;

const SEGMENTED = (icon = '') =>
  `<md-gb-segmented-button-set aria-label="View"><md-gb-segmented-button label="Day">${icon}</md-gb-segmented-button><md-gb-segmented-button label="Week">${icon}</md-gb-segmented-button><md-gb-segmented-button label="Month">${icon}</md-gb-segmented-button></md-gb-segmented-button-set>`;

export const MEASUREMENTS = {
  ...MORE_MEASUREMENTS,
  switch: {
    imports: ['./md-gb-switch.js', '../../styles/icons/md-gb-icon.js'],
    sections: [
      {
        page: 'switch',
        section: 'switch/specs/measurements',
        host: 'md-gb-switch',
        base: '<md-gb-switch></md-gb-switch>',
        rows: [
          {cells: ['Track', 'Height', '32dp'], name: 'Track height', el: 'button', m: 'height', dp: 32},
          {cells: ['Width', '52dp'], name: 'Track width', el: 'button', m: 'width', dp: 52},
          {cells: ['Outline width', '2dp'], name: 'Track outline width', el: 'button', m: 'border', dp: 2},
          {cells: ['Shape', '[md.sys.shape.corner.full'], name: 'Track shape is fully rounded', el: 'button', m: 'radius', dp: 'full'},
          {cells: ['Handle', 'Height (unselected)', '16dp'], name: 'Handle height, unselected', el: 'button', pseudo: '::before', m: 'clip-size', dp: 16},
          {cells: ['Height - with icon', '24dp'], name: 'Handle height, with icon', markup: '<md-gb-switch><md-gb-icon slot="off-icon">close</md-gb-icon></md-gb-switch>', el: 'button', pseudo: '::before', m: 'clip-size', dp: 24},
          {cells: ['Height (selected)', '24dp'], name: 'Handle height, selected', markup: '<md-gb-switch selected></md-gb-switch>', el: 'button', pseudo: '::before', m: 'clip-size', dp: 24},
          {cells: ['Height (pressed)', '28dp'], name: 'Handle height, pressed', add: [{el: 'button', class: 'active'}], el: 'button', pseudo: '::before', m: 'clip-size', dp: 28},
          {cells: ['Width (unselected)', '16dp'], name: 'Handle width, unselected', el: 'button', pseudo: '::before', m: 'clip-size', dp: 16},
          {cells: ['Width - with icon', '24dp'], name: 'Handle width, with icon', markup: '<md-gb-switch><md-gb-icon slot="off-icon">close</md-gb-icon></md-gb-switch>', el: 'button', pseudo: '::before', m: 'clip-size', dp: 24},
          {cells: ['Width (selected)', '24dp'], name: 'Handle width, selected', markup: '<md-gb-switch selected></md-gb-switch>', el: 'button', pseudo: '::before', m: 'clip-size', dp: 24},
          {cells: ['Width (pressed)', '28dp'], name: 'Handle width, pressed', add: [{el: 'button', class: 'active'}], el: 'button', pseudo: '::before', m: 'clip-size', dp: 28},
          {cells: ['Shape', '[md.sys.shape.corner.full'], name: 'Handle shape is fully rounded', el: 'button', pseudo: '::before', m: 'clip-radius', dp: 'full'},
          {cells: ['State layer', 'Size', '40dp'], name: 'State layer size', el: 'button', pseudo: '::after', m: 'width', dp: 40, checks: [{el: 'button', pseudo: '::after', m: 'height', dp: 40}]},
          {cells: ['Shape', '[md.sys.shape.corner.full'], name: 'State layer shape is fully rounded', el: 'button', pseudo: '::after', m: 'radius', dp: 'full'},
          {cells: ['Target', 'Size', '48dp'], name: 'Target size', el: 'button .switch-touch', m: 'height', dp: 48},
          {cells: ['Icon', 'Size (selected)', '16dp'], name: 'Icon size, selected', markup: '<md-gb-switch selected><md-gb-icon slot="on-icon">check</md-gb-icon></md-gb-switch>', el: 'light:md-gb-icon', m: 'width', dp: 16},
          {cells: ['Icon', 'Size (unselected)', '16dp'], name: 'Icon size, unselected', markup: '<md-gb-switch><md-gb-icon slot="off-icon">close</md-gb-icon></md-gb-switch>', el: 'light:md-gb-icon', m: 'width', dp: 16},
        ],
      },
    ],
  },
  checkbox: {
    imports: ['./md-gb-checkbox.js'],
    sections: [
      {
        page: 'checkbox',
        section: 'checkbox/specs/measurements',
        host: 'md-gb-checkbox',
        base: '<md-gb-checkbox></md-gb-checkbox>',
        rows: [
          {cells: ['Container size', '18dp'], name: 'Container size', markup: '<md-gb-checkbox checked></md-gb-checkbox>', el: 'input', pseudo: '::before', m: 'width', dp: 18, checks: [{el: 'input', pseudo: '::before', m: 'height', dp: 18}]},
          {cells: ['Container corner shape', '2dp'], name: 'Container corner shape', el: 'input', pseudo: '::before', m: 'radius', dp: 2},
          {cells: ['Icon size', '18dp'], name: 'Icon size', markup: '<md-gb-checkbox checked></md-gb-checkbox>', el: 'input', pseudo: '::before', m: 'font-size', dp: 18},
          {cells: ['Icon alignment', 'Center-aligned'], name: 'Icon alignment', markup: '<md-gb-checkbox checked></md-gb-checkbox>', el: 'input', pseudo: '::before', css: 'justify-content', is: 'center', checks: [{el: 'input', pseudo: '::before', css: 'align-items', is: 'center'}]},
          {cells: ['Target size', '48dp'], name: 'Target size', el: 'input', m: 'width', dp: 48, checks: [{el: 'input', m: 'height', dp: 48}]},
          {cells: ['State-layer size'], name: 'State layer size', el: 'input', pseudo: '::after', m: 'width', dp: 40, checks: [{el: 'input', pseudo: '::after', m: 'height', dp: 40}]},
        ],
      },
    ],
  },
  radio: {
    imports: ['./md-gb-radio.js'],
    sections: [
      {
        page: 'radio-button',
        section: 'radio-button/specs/measurements',
        host: 'md-gb-radio',
        base: '<md-gb-radio></md-gb-radio>',
        rows: [
          {cells: ['Icon size', '20dp'], name: 'Icon size', el: '[part=radio]', pseudo: '::before', m: 'width', dp: 20},
          {cells: ['State layer size', '40dp'], name: 'State layer size', el: '[part=radio]', pseudo: '::after', m: 'width', dp: 40, checks: [{el: '[part=radio]', pseudo: '::after', m: 'height', dp: 40}]},
          {cells: ['Target size', '48dp'], name: 'Target size', el: '[part=radio]', m: 'width', dp: 48, checks: [{el: '[part=radio]', m: 'height', dp: 48}]},
        ],
      },
    ],
  },
  card: {
    imports: ['./md-gb-card.js'],
    sections: [
      {
        page: 'cards',
        section: 'cards/specs/measurements',
        host: 'md-gb-card',
        base: '<md-gb-card><div style="height: 80px">Content</div></md-gb-card>',
        rows: [
          {cells: ['Shape', '12dp corner radius'], name: 'Shape is a 12dp corner radius', el: '[part=card]', m: 'radius', dp: 12},
          {cells: ['Left/right padding', '16dp'], name: 'Left/right padding', el: '[part=card]', m: 'padding-left', dp: 16, checks: [{el: '[part=card]', m: 'padding-right', dp: 16}]},
          {cells: ['Padding between cards', '8dp max'], name: 'Padding between cards', skip: 'layout between cards; no container in gb owns it'},
          {cells: ['Label text alignment', 'Start-aligned'], name: 'Label text alignment', skip: 'the card has no label text of its own (content is slotted)'},
        ],
      },
    ],
  },
  slider: {
    imports: ['./md-gb-slider.js', '../../styles/icons/md-gb-icon.js'],
    sections: [
      {
        page: 'sliders',
        section: 'sliders/specs/measurements',
        host: 'md-gb-slider',
        base: '<md-gb-slider value="50" style="width: 300px"></md-gb-slider>',
        rows: [
          {cells: ['Track height'], name: 'Track height', el: '.slider-active', m: 'height', cases: SLIDER_SIZES.map((size, i) => ({name: size, markup: slider(size), dp: [16, 24, 40, 56, 96][i]}))},
          {cells: ['Label container height', '44dp'], name: 'Label container height', markup: slider('xs', ' labeled'), el: '.slider-label', m: 'css-height', dp: 44},
          {cells: ['Label container width'], name: 'Label container width', markup: slider('xs', ' labeled'), el: '.slider-label', m: 'css-width', dp: 48},
          {cells: ['Handle height', '44dp'], name: 'Handle height', el: '.slider-handle-nub', m: 'height', cases: SLIDER_SIZES.map((size, i) => ({name: size, markup: slider(size), dp: [44, 44, 52, 68, 108][i]}))},
          {cells: ['Handle width', '4dp'], name: 'Handle width', el: '.slider-handle-nub', m: 'width', dp: 4},
          {cells: ['Track shape'], name: 'Track shape (corner radius)', el: '.slider-active', m: 'clip-radius', cases: SLIDER_SIZES.map((size, i) => ({name: size, markup: slider(size), dp: [8, 8, 12, 16, 28][i]}))},
          {cells: ['Inset icon size'], name: 'Inset icon size', cases: SLIDER_SIZES.map((size, i) => i < 2 ? {name: `${size}, no inset icon`, markup: slider(size, '', true), el: '.slider-icon', absent: true} : {name: size, markup: slider(size, '', true), el: 'light:md-gb-icon', m: 'width', dp: [24, 24, 32][i - 2]})},
        ],
      },
    ],
  },
  chip: {
    imports: ['./md-gb-chip.js', '../../styles/icons/md-gb-icon.js'],
    sections: ['assist', 'suggestion', 'filter', 'input'].map((type) => chipSection(type)),
  },
  button: {
    imports: ['./md-gb-button.js', '../../styles/icons/md-gb-icon.js'],
    sections: [
      {
        page: 'buttons',
        section: 'buttons/specs/measurements/corner-sizes',
        host: 'md-gb-button',
        base: '<md-gb-button>Label</md-gb-button>',
        rows: cornerRows('md-gb-button', '[part=btn]'),
      },
    ],
  },
  iconbutton: {
    imports: ['./md-gb-icon-button.js', '../../styles/icons/md-gb-icon.js'],
    sections: [
      {
        page: 'icon-buttons',
        section: 'icon-buttons/specs/measurements/button-corner-radius',
        host: 'md-gb-icon-button',
        base: '<md-gb-icon-button><md-gb-icon>add</md-gb-icon></md-gb-icon-button>',
        rows: cornerRows('md-gb-icon-button', '[part=icon-btn]'),
      },
    ],
  },
  fab: {
    imports: ['./md-gb-fab.js', '../../styles/icons/md-gb-icon.js'],
    sections: [
      {
        page: 'extended-fab',
        section: 'extended-fab/specs/baseline-extended-fab/baseline-measurements',
        host: 'md-gb-fab',
        base: '<md-gb-fab label="Create"><md-gb-icon>add</md-gb-icon></md-gb-fab>',
        rows: [
          {cells: ['Container height', '56dp'], name: 'Container height', el: '[part=fab]', m: 'height', dp: 56},
          {cells: ['Container width', 'Dynamic, 80dp min'], name: 'Container width, 80dp minimum', markup: '<md-gb-fab label="A"><md-gb-icon>add</md-gb-icon></md-gb-fab>', el: '[part=fab]', m: 'width', dp: {min: 80}},
          {cells: ['Container shape', '16dp corner radius'], name: 'Container shape', el: '[part=fab]', m: 'radius', dp: 16},
          {cells: ['Icon size', '24dp'], name: 'Icon size', el: 'light:md-gb-icon', m: 'width', dp: 24},
          {cells: ['Padding', '16dp'], name: 'Padding', el: '[part=fab]', m: 'padding-left', dp: 16, checks: [{el: '[part=fab]', m: 'padding-right', dp: 16}]},
        ],
      },
    ],
  },
  badge: {
    imports: ['./md-gb-badge.js'],
    sections: [
      {
        page: 'badges',
        section: 'badges/specs/measurements',
        host: 'md-gb-badge',
        base: '<md-gb-badge></md-gb-badge>',
        rows: [
          {cells: ['Small badge shape', '3dp corner radius'], name: 'Small badge shape', el: '[part=badge]', m: 'radius', dp: 3},
          {cells: ['Small badge size (HxW)', '6dp'], name: 'Small badge size', el: '[part=badge]', m: 'height', dp: 6, checks: [{el: '[part=badge]', m: 'width', dp: 6}]},
          {cells: ['Large badge shape', '8dp corner radius'], name: 'Large badge shape', markup: '<md-gb-badge value="3"></md-gb-badge>', el: '[part=badge]', m: 'radius', dp: 8},
          {cells: ['Large badge one digit size (HxW)', '16dp'], name: 'Large badge one digit size', markup: '<md-gb-badge value="3"></md-gb-badge>', el: '[part=badge]', m: 'height', dp: 16, checks: [{el: '[part=badge]', m: 'width', dp: 16}]},
          {cells: ['Large badge max character count size (HxW)', '16x34dp'], name: 'Large badge max character count height', markup: '<md-gb-badge value="1000"></md-gb-badge>', el: '[part=badge]', m: 'height', dp: 16},
          {cells: ['Small badge: distance from top trailing icon corner to bottom leading badge corner (HxW)', '6x6dp'], name: 'Small badge offset', skip: 'position relative to the icon it is placed on; the badge has no anchor of its own'},
          {cells: ['Large badge: distance from top trailing icon corner to bottom leading badge corner (HxW)', '14x12dp'], name: 'Large badge offset', skip: 'position relative to the icon it is placed on; the badge has no anchor of its own'},
          {cells: ['Large badge padding between badge and text container', '4dp'], name: 'Large badge padding between badge and text', markup: '<md-gb-badge value="1000"></md-gb-badge>', el: '[part=badge]', m: 'padding-left', dp: 4, checks: [{el: '[part=badge]', m: 'padding-right', dp: 4}]},
        ],
      },
    ],
  },
  divider: {
    imports: ['./md-gb-divider.js'],
    sections: [
      {
        page: 'divider',
        section: 'divider/specs/measurements',
        host: 'md-gb-divider',
        base: '<div style="width: 300px"><md-gb-divider></md-gb-divider></div>',
        rows: [
          {cells: ['Divider full-width', '100%'], name: 'Full-width divider spans its container', el: '[part=divider]', m: 'width', dp: 300},
          {cells: ['Divider inset left margin', '16dp'], name: 'Inset divider left margin', markup: '<div style="width: 300px"><md-gb-divider inset-start></md-gb-divider></div>', el: '[part=divider]', m: 'margin-left', dp: 16},
          {cells: ['Divider inset right margin', '0dp'], name: 'Inset divider right margin', markup: '<div style="width: 300px"><md-gb-divider inset-start></md-gb-divider></div>', el: '[part=divider]', m: 'margin-right', dp: 0},
          {cells: ['Divider middle-inset left margin', '16dp'], name: 'Middle-inset divider left margin', markup: '<div style="width: 300px"><md-gb-divider inset></md-gb-divider></div>', el: '[part=divider]', m: 'margin-left', dp: 16},
          {cells: ['Divider middle-inset right margin', '16dp'], name: 'Middle-inset divider right margin', markup: '<div style="width: 300px"><md-gb-divider inset></md-gb-divider></div>', el: '[part=divider]', m: 'margin-right', dp: 16},
          {cells: ['Space between divider & supporting-text', '4dp'], name: 'Space between divider and supporting text', skip: "spacing to a list item's supporting text; owned by the list, not the divider"},
          {cells: ['Divider right margin', '8dp'], name: 'Divider right margin', skip: 'spacing inside a list or menu item; owned by that component'},
          {cells: ['Divider bottom margin'], name: 'Divider bottom margin', skip: 'spacing inside a list or menu item; owned by that component'},
        ],
      },
    ],
  },
  segmentedbutton: {
    imports: ['./md-gb-segmented-button-set.js', './md-gb-segmented-button.js', '../../styles/icons/md-gb-icon.js'],
    sections: [
      {
        page: 'segmented-buttons',
        section: 'segmented-buttons/specs/measurements',
        host: 'md-gb-segmented-button-set',
        base: SEGMENTED(),
        rows: [
          {cells: ['Container width', 'Dynamic based on labels'], name: 'Container width follows the labels', skip: 'not a dp value; width grows with the label text'},
          {cells: ['Segment width'], name: 'Segment width', skip: 'fraction of the container (1/total segments), not dp'},
          {cells: ['Height', '40dp'], name: 'Height', el: 'light:md-gb-segmented-button >> button', m: 'height', dp: 40},
          {cells: ['Outline width'], name: 'Outline width', el: 'light:md-gb-segmented-button >> button', m: 'border', dp: 1},
          {cells: ['Label alignment', 'Center'], name: 'Label alignment', el: 'light:md-gb-segmented-button >> button', css: 'justify-content', is: ['center']},
          {cells: ['Left/right padding', 'Min 12dp'], name: 'Left/right padding', el: 'light:md-gb-segmented-button >> button', m: 'padding-left', dp: {min: 12}, checks: [{el: 'light:md-gb-segmented-button >> button', m: 'padding-right', dp: {min: 12}}]},
          {cells: ['Padding between elements', '8dp'], name: 'Padding between elements', markup: SEGMENTED('<md-gb-icon slot="icon">star</md-gb-icon>'), el: 'light:md-gb-segmented-button >> .segmented-button-content', m: 'gap', dp: 8},
          {cells: ['Target size'], name: 'Target size', el: 'light:md-gb-segmented-button >> .segmented-button-touch', m: 'height', dp: 48},
        ],
      },
    ],
  },
  tabs: {
    imports: ['./md-gb-tabs.js', './md-gb-tab.js', '../../styles/icons/md-gb-icon.js'],
    sections: [
      {
        page: 'tabs',
        section: 'tabs/specs/measurements',
        host: 'md-gb-tabs',
        base: TABS(),
        rows: [
          {cells: ['Container height (label text only)'], name: 'Container height, label text only', el: '', m: 'height', dp: 48},
          {cells: ['Container height (icon and label text)'], name: 'Container height, icon and label text', markup: TABS('<md-gb-icon>flight</md-gb-icon>'), el: '', m: 'height', dp: 64},
          {cells: ['Icon size'], name: 'Icon size', markup: TABS('<md-gb-icon>flight</md-gb-icon>'), el: 'light:md-gb-icon', m: 'width', dp: 24},
          {cells: ['Divider height'], name: 'Divider height', el: '', m: 'border-bottom', dp: 1},
          {cells: ['Primary active indicator height'], name: 'Primary active indicator height', markup: TABS().replace('<md-gb-tab>', '<md-gb-tab selected>'), el: '', pseudo: '::after', m: 'height', dp: 3},
          {cells: ['Secondary active indicator height'], name: 'Secondary active indicator height', markup: TABS().replace('<md-gb-tabs ', '<md-gb-tabs variant="secondary" ').replace('<md-gb-tab>', '<md-gb-tab selected>'), el: '', pseudo: '::after', m: 'height', dp: 2},
          {cells: ['Active indicator shape'], name: 'Active indicator shape', skip: 'per-corner radii (3, 3, 0, 0); the test measures a single radius'},
          {cells: ['Active indicator minimum length'], name: 'Active indicator minimum length', skip: 'positioned with CSS anchors under the tab content; no stable box to measure'},
          {cells: ['Padding between inline icon and text'], name: 'Padding between inline icon and text', skip: 'inline icon layout is not a tab variant in gb (icons stack above the label)'},
          {cells: ['Padding between inline text and badge'], name: 'Padding between inline text and badge', skip: 'inline badge layout not measured yet'},
          {cells: ['Overlap of badge on stacked icon'], name: 'Overlap of badge on stacked icon', skip: 'badge overlap not measured yet'},
        ],
      },
    ],
  },
};

const VALUE_LIKE = /\d\s*(x\s*\d+\s*)?dp\b|^Full$|^[\d.]+%$|md\.sys\.shape|aligned$|^Center$/i;

function checksOf(row) {
  const own = {el: row.el, m: row.m, pseudo: row.pseudo, dp: row.dp, css: row.css, is: row.is, absent: row.absent};
  return [own, ...(row.checks ?? [])].filter((c) => c.m || c.css || c.absent);
}

function specOf(dp, host) {
  const chainOf = (el) => tsString(el === 'window' ? el : [host, el].filter(Boolean).join(' >> '));
  if (dp === 'full') return "{full: true}";
  if (typeof dp === 'number') return `{eq: ${dp}}`;
  if (dp && typeof dp === 'object') return `{${Object.entries(dp).map(([k, v]) => `${k}: ${k === 'like' || k === 'rel' ? chainOf(v) : v}`).join(', ')}}`;
  throw new Error(`bad dp ${JSON.stringify(dp)}`);
}

function caseSource(section, row, c, name, ids, base) {
  const markup = c.markup ?? row.markup ?? section.base;
  const checks = checksOf({...row, ...c, checks: c.checks ?? row.checks});
  if (!checks.length) throw new Error(`${section.section}: row ${JSON.stringify(row.cells)} has nothing to measure`);
  const viewport = c.viewport ?? row.viewport;
  const setup = (c.setup ?? row.setup ?? section.setup ?? '')
    .split('\n')
    .filter(Boolean)
    .map((l) => `    ${l}\n`)
    .join('');
  const add = c.add ?? row.add ?? [];
  const adds = add.length
    ? [
        ...add.map((a) => `    need(${tsString([section.host, a.el].filter(Boolean).join(' >> '))}).classList.add(${tsString(a.class)});`),
        ...add.map((a) => `    await settleStyle(${tsString([section.host, a.el].filter(Boolean).join(' >> '))});`),
        '',
      ].join('\n')
    : '';
  const lines = checks.map((k) => {
    const chain = [section.host, k.el].filter(Boolean).join(' >> ');
    if (k.absent) return `    expect(find(${tsString(chain)})).withContext(${tsString(chain + ' is absent')}).toBeNull();`;
    if (k.css) return `    expectCss(${tsString(chain)}, ${tsString(k.css)}, ${tsString([k.is].flat().join('|'))}, ${tsString(k.pseudo ?? '')});`;
    const parts = [tsString(chain), tsString(k.m), specOf(k.dp, section.host)];
    if (k.pseudo) parts.push(tsString(k.pseudo));
    return `    expectDp(${parts.join(', ')});`;
  });
  return `  // spec: ${ids.join(', ')}
  it(${tsString(name)}, async () => {
    ${viewport ? `await setViewport({width: ${viewport.width}, height: ${viewport.height}});\n    ` : ''}await mount(${tsString(markup)});
${setup}${adds}${lines.join('\n')}
  });`;
}

function testsHelpers(imports, viewport) {
  return `// import 'jasmine'; (google3-only)${viewport ? "\nimport {setViewport} from '@web/test-runner-commands';" : ''}
import {styles as m3Styles} from '../../material-design-expressive/styles/m3.cssresult.js';
import {adoptStyles} from '../../material-design-expressive/styles/adopt-styles.js';
${imports.map((m) => `import '${m}';`).join('\n')}
import type {ReactiveElement} from 'lit';

adoptStyles(document, [m3Styles]);

${TS_HELPERS}
${MEASURE_HELPERS}${viewport ? `
const originalViewport = {width: window.innerWidth, height: window.innerHeight};
afterEach(async () => {
  await setViewport(originalViewport);
  await new Promise((resolve) => requestAnimationFrame(resolve));
});
` : ''}`;
}

/** Resolves a component's rows to cases and unmapped rows. */
async function resolve(dir, config) {
  const units = await loadUnits();
  const tested = [];
  const gaps = [];
  const unmapped = [];
  let rowCount = 0;
  for (const section of config.sections) {
    const rows = units.filter(
      (u) => u.page === `components/${section.page}.md` && [section.kind ?? 'table-row'].flat().includes(u.kind) && u.section.startsWith(section.section),
    );
    if (!rows.length) throw new Error(`${dir}: no table rows in ${section.page} ${section.section}`);
    let cursor = 0;
    const used = new Set();
    for (const row of section.rows) {
      const where = `${dir} ${section.section} ${row.name}`;
      const {ids, end} = resolveCells(rows, row.cells, cursor, where);
      cursor = end - 1;
      ids.forEach((id) => used.add(id));
      rowCount++;
      if (row.skip) {
        unmapped.push(`${row.cells.join(' / ')} (${row.skip})`);
        continue;
      }
      const cases = row.cases ?? [{}];
      for (const c of cases) {
        const name = c.name ? `${row.name}, ${c.name}` : row.name;
        const source = caseSource(section, row, c, name, ids);
        (c.gap ?? row.gap ? gaps : tested).push({source, note: c.gap ?? row.gap, name});
      }
    }
    // Value cells nothing maps or skips.
    rows.forEach((u, i) => {
      if (used.has(u.id) || !VALUE_LIKE.test(u.text)) return;
      unmapped.push(`${rows[i - 1]?.text ?? '?'} / ${u.text} (not in config)`);
    });
  }
  return {tested, gaps, unmapped, rowCount};
}

function fileText(dir, config, cases, gap) {
  const what = gap
    ? 'Measurement gaps: spec rows where the measured size differs from the spec. Red until the component is fixed; run with `npm run check -- --gaps`.'
    : 'Measurement tests: renders the component and measures the part each Specs > Measurements row names.';
  return pruneHelpers(`${header('gen-measurement-tests.mjs', dir, 'measurement', what)}
${testsHelpers(config.imports, cases.some((c) => c.source.includes('setViewport(')))}
describe('<${config.sections[0].host}> measurements${gap ? ' (gaps)' : ''}', () => {
${cases.map((c) => c.source).join('\n\n')}
});
`);
}

export async function main(argv) {
  const check = argv.includes('--check');
  const only = argv.filter((a) => !a.startsWith('--'));
  let stale = false;
  const report = [];
  for (const [dir, config] of Object.entries(MEASUREMENTS).sort(([a], [b]) => a.localeCompare(b))) {
    if (only.length && !only.includes(dir)) continue;
    const {tested, gaps, unmapped, rowCount} = await resolve(dir, config);
    stale = (await emit(componentPath(dir, `${dir}_measurement_test.ts`), tested.length ? fileText(dir, config, tested, false) : null, check)) || stale;
    stale = (await emit(componentPath(dir, `${dir}_measurement_gap.ts`), gaps.length ? fileText(dir, config, gaps, true) : null, check)) || stale;
    report.push(`${dir}: ${rowCount} rows, ${tested.length} tests, ${gaps.length} gap, ${unmapped.length} unmapped`);
    for (const u of unmapped) report.push(`    unmapped: ${u}`);
  }
  console.log(report.join('\n'));
  if (check && stale) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main(process.argv.slice(2));
