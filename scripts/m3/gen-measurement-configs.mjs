/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * More MEASUREMENTS entries for gen-measurement-tests.mjs (the config format
 * is documented there): the components whose spec tables are large. Rows
 * the spec lists but no part of gb can be measured for carry `skip: reason`.
 */


// Time pickers -------------------------------------------------------------

// A fixed time: with no value the picker shows the current time, and the dial
// handle and track rotate toward it, which changes their bounding boxes.
const TP = (attrs = '') => `<md-gb-time-picker hour-cycle="12" value="12:00"${attrs}></md-gb-time-picker>`;

/** The rows the dial tables share; `orientation` is the layout the table names. */
function timePickerDialRows(orientation) {
  const o = (attrs = '') => TP(` orientation="${orientation}"${attrs}`);
  return [
    {cells: ['Container', 'Width', 'Dynamic'], name: 'Container width', skip: 'dynamic; not a dp value'},
    {cells: ['Height', 'Dynamic'], name: 'Container height', skip: 'dynamic; not a dp value'},
    {cells: ['Headline alignment', 'Left'], name: 'Headline alignment', markup: o(), el: '[part=headline]', css: 'text-align', is: ['start', 'left']},
    {cells: ['Top/bottom padding', '24dp'], name: 'Top/bottom padding', markup: o(), el: '[part=container]', m: 'padding-top', dp: 24, checks: [{el: '[part=container]', m: 'padding-bottom', dp: 24}]},
    {cells: ['Left/right padding', '24dp'], name: 'Left/right padding', markup: o(), el: '[part=container]', m: 'padding-left', dp: 24, checks: [{el: '[part=container]', m: 'padding-right', dp: 24}]},
    {cells: ['Time selector container', 'Width', '96dp'], name: 'Time selector container width', markup: o(), el: '.time-picker-selector', m: 'width', dp: 96},
    {cells: ['Width (24h vertical)', '114dp'], name: 'Time selector container width, 24h vertical', markup: `<md-gb-time-picker hour-cycle="24" value="12:00" orientation="vertical"></md-gb-time-picker>`, el: '.time-picker-selector', m: 'width', dp: 114},
    {cells: ['Height', '80dp'], name: 'Time selector container height', markup: o(), el: '.time-picker-selector', m: 'height', dp: 80},
    {cells: ['Period selector container', 'Width (vertical layout)', '52dp'], name: 'Period selector container width, vertical layout', markup: TP(' orientation="vertical"'), el: '.time-picker-period', m: 'width', dp: 52},
    {cells: ['Height (vertical layout)', '80dp'], name: 'Period selector container height, vertical layout', markup: TP(' orientation="vertical"'), el: '.time-picker-period', m: 'height', dp: 80},
    {cells: ['Width (horizontal layout)', '216dp'], name: 'Period selector container width, horizontal layout', markup: TP(' orientation="horizontal"'), el: '.time-picker-period', m: 'width', dp: 216},
    {cells: ['Height (horizontal layout)', '38dp'], name: 'Period selector container height, horizontal layout', markup: TP(' orientation="horizontal"'), el: '.time-picker-period', m: 'height', dp: 38},
    {cells: ['Clock dial container', 'Size', '256dp'], name: 'Clock dial container size', markup: o(), el: '[part=dial]', m: 'width', dp: 256, checks: [{el: '[part=dial]', m: 'height', dp: 256}]},
    {cells: ['Clock dial selector handle', 'Size', '48dp'], name: 'Clock dial selector handle size', markup: o(), el: '.time-picker-dial-handle', m: 'width', dp: 48, checks: [{el: '.time-picker-dial-handle', m: 'height', dp: 48}]},
    {cells: ['Clock dial selector center', 'Size', '8dp'], name: 'Clock dial selector center size', markup: o(), el: '.time-picker-dial-center', m: 'width', dp: 8, checks: [{el: '.time-picker-dial-center', m: 'height', dp: 8}]},
    {cells: ['Clock dial selector track', 'Width', '2dp'], name: 'Clock dial selector track width', markup: o(), el: '.time-picker-dial-track', m: 'width', dp: 2},
  ];
}

const TP_INPUT = TP(' mode="input"');

const timepicker = {
  imports: ['./md-gb-time-picker.js'],
  sections: [
    {
      page: 'time-pickers',
      section: 'time-pickers/specs/measurements/time-picker-dial-vertical',
      host: 'md-gb-time-picker',
      base: TP(' orientation="vertical"'),
      rows: timePickerDialRows('vertical').map((r) => ({...r, name: `Dial, vertical: ${r.name}`})),
    },
    {
      page: 'time-pickers',
      section: 'time-pickers/specs/measurements/time-picker-dial-horizontal',
      host: 'md-gb-time-picker',
      base: TP(' orientation="horizontal"'),
      rows: timePickerDialRows('horizontal').map((r) => ({...r, name: `Dial, horizontal: ${r.name}`})),
    },
    {
      page: 'time-pickers',
      section: 'time-pickers/specs/measurements/time-picker-input',
      host: 'md-gb-time-picker',
      base: TP_INPUT,
      rows: [
        {cells: ['Container', 'Width', 'Dynamic'], name: 'Container width', skip: 'dynamic; not a dp value'},
        {cells: ['Height', 'Dynamic'], name: 'Container height', skip: 'dynamic; not a dp value'},
        {cells: ['Headline alignment', 'Left'], name: 'Headline alignment', el: '[part=headline]', css: 'text-align', is: ['start', 'left']},
        {cells: ['Top/bottom padding', '24dp'], name: 'Top/bottom padding', el: '[part=container]', m: 'padding-top', dp: 24, checks: [{el: '[part=container]', m: 'padding-bottom', dp: 24}]},
        {cells: ['Left/right padding', '24dp'], name: 'Left/right padding', el: '[part=container]', m: 'padding-left', dp: 24, checks: [{el: '[part=container]', m: 'padding-right', dp: 24}]},
        {cells: ['Time input field container', 'Width', '96dp'], name: 'Time input field container width', el: '.time-picker-field', m: 'width', dp: 96},
        {cells: ['Height', '72dp'], name: 'Time input field container height', el: '.time-picker-field-input', m: 'height', dp: 72},
        {cells: ['Period selector container', 'Width', '52dp'], name: 'Period selector container width', el: '.time-picker-period', m: 'width', dp: 52},
        {cells: ['Height', '72dp'], name: 'Period selector container height', el: '.time-picker-period', m: 'height', dp: 72},
      ].map((r) => ({...r, name: `Input: ${r.name}`})),
    },
  ],
};

// Dialogs ------------------------------------------------------------------

const DIALOG = (attrs = '', inner = '<span slot="headline">Title</span>Body text<md-gb-button slot="actions">Cancel</md-gb-button><md-gb-button slot="actions">OK</md-gb-button>') =>
  `<md-gb-dialog open quick${attrs}>${inner}</md-gb-dialog>`;
const DIALOG_ICON = DIALOG('', `<md-gb-icon slot="icon">delete</md-gb-icon><span slot="headline">Title</span>Body text<md-gb-button slot="actions">OK</md-gb-button>`);
const LONG = 'Long body text. '.repeat(120);

const dialog = {
  imports: ['./md-gb-dialog.js', '../button/md-gb-button.js', '../../styles/icon/md-gb-icon.js'],
  sections: [
    {
      page: 'dialogs',
      section: 'dialogs/specs/basic-dialogs/basic-dialog-measurements',
      host: 'md-gb-dialog',
      base: DIALOG(),
      rows: [
        {cells: ['Container shape', '28dp corner radius'], name: 'Container shape', el: '[part=dialog]', m: 'radius', dp: 28},
        {cells: ['Container height', 'Dynamic'], name: 'Container height', skip: 'dynamic; not a dp value'},
        {cells: ['Container width', 'Min 280dp; Max 560dp'], name: 'Container width', el: '[part=dialog]', m: 'width', cases: [
          {name: 'minimum', markup: DIALOG('', 'Hi'), dp: {min: 280}},
          {name: 'maximum', markup: DIALOG('', `<span slot="headline">Title</span>${LONG}`), dp: {max: 560}},
        ]},
        {cells: ['Divider height', '1dp'], name: 'Divider height', markup: DIALOG('', `<span slot="headline">Title</span>${LONG}<md-gb-button slot="actions">OK</md-gb-button>`), el: '.dialog-divider-top', m: 'border-bottom', dp: 1},
        {cells: ['Icon size', '24dp'], name: 'Icon size', markup: DIALOG_ICON, el: 'light:md-gb-icon', m: 'width', dp: 24, checks: [{el: 'light:md-gb-icon', m: 'height', dp: 24}]},
        {cells: ['Minimum width', '280dp'], name: 'Minimum width', markup: DIALOG('', 'Hi'), el: '[part=dialog]', m: 'width', dp: {min: 280}},
        {cells: ['Maximum width', '560dp'], name: 'Maximum width', markup: DIALOG('', `<span slot="headline">Title</span>${LONG}`), el: '[part=dialog]', m: 'width', dp: {max: 560}},
        {cells: ['Alignment with icon', 'Center-aligned'], name: 'Alignment with icon', markup: DIALOG_ICON, el: '[part=headline]', css: 'text-align', is: 'center'},
        {cells: ['Alignment without icon', 'Start-aligned'], name: 'Alignment without icon', el: '[part=headline]', css: 'text-align', is: ['start', 'left']},
        {cells: ['Top/Left/right/bottom padding', '24dp'], name: 'Top/left/right/bottom padding', el: '[part=header]', m: 'padding-top', dp: 24, checks: [
          {el: '[part=header]', m: 'padding-left', dp: 24},
          {el: '[part=content]', m: 'padding-right', dp: 24},
          {el: '.dialog-actions', m: 'padding-right', dp: 24},
          {el: '.dialog-actions', m: 'padding-bottom', dp: 24},
        ]},
        {cells: ['Padding between buttons', '8dp'], name: 'Padding between buttons', el: '.dialog-actions', m: 'gap', dp: 8},
        {cells: ['Padding between title and body', '16dp'], name: 'Padding between title and body', el: '[part=headline]', m: 'padding-bottom', dp: 16},
        {cells: ['Padding between icon and title', '16dp'], name: 'Padding between icon and title', markup: DIALOG_ICON, el: '[part=icon]', m: 'margin-bottom', dp: 16},
        {cells: ['Padding between body and actions', '24dp'], name: 'Padding between body and actions', el: '.dialog-actions', m: 'padding-top', dp: 24},
      ],
    },
    {
      page: 'dialogs',
      section: 'dialogs/specs/full-screen-dialogs/full-screen-dialog-measurements',
      host: 'md-gb-dialog',
      base: DIALOG(' full-screen', '<span slot="headline">Title</span>Body text<md-gb-button slot="actions">Save</md-gb-button>'),
      rows: [
        {cells: ['Container shape', '0dp corner radius'], name: 'Container shape', el: '[part=dialog]', m: 'radius', dp: 0},
        {cells: ['Container height', 'Dynamic'], name: 'Container height', skip: 'dynamic; not a dp value'},
        {cells: ['Container width', 'Container width; Max 560dp'], name: 'Container width', el: '[part=dialog]', m: 'width', dp: {max: 560}, gap: 'dialogs-1bb3d9 and dialogs-6777bc say a full-screen dialog fills the entire screen; the measurement table caps it at 560dp. The two conflict above 560dp, and full-screen dialogs are for compact windows only, so it fills the window'},
        {cells: ['Header height', '56dp'], name: 'Header height', el: '[part=header]', m: 'height', dp: 56},
        {cells: ['Header width', 'Container width'], name: 'Header width', el: '[part=header]', m: 'width', dp: {like: '[part=dialog]'}},
        {cells: ['Headline text alignment', 'Start-aligned'], name: 'Headline text alignment', el: '[part=headline]', css: 'text-align', is: ['start', 'left']},
        {cells: ['Divider height', '1dp'], name: 'Divider height', el: '.dialog-divider-top', m: 'border-bottom', dp: 1},
        {cells: ['Icon (close affordance) size', '24dp'], name: 'Close icon size', el: '[part=close-button] svg', m: 'width', dp: 24, checks: [{el: '[part=close-button] svg', m: 'height', dp: 24}]},
        {cells: ['Bottom action bar height', '56dp'], name: 'Bottom action bar height', skip: 'the full-screen anatomy lists a header text button and no bottom action bar; the Save action sits in the header'},
        {cells: ['Bottom action bar width', 'Container width'], name: 'Bottom action bar width', skip: 'the full-screen anatomy lists a header text button and no bottom action bar; the Save action sits in the header'},
        {cells: ['Top/left/right padding', '24dp'], name: 'Top/left/right padding', el: '[part=header]', m: 'padding-left', dp: 24, checks: [{el: '[part=header]', m: 'padding-right', dp: 24}, {el: '[part=content]', m: 'padding-left', dp: 24}]},
        {cells: ['Padding between elements', '8dp'], name: 'Padding between elements', el: '[part=header]', m: 'gap', dp: 8},
      ],
    },
  ],
};

// Navigation drawer --------------------------------------------------------

const DRAWER_ITEM = '<md-gb-nav-drawer-item><md-gb-icon slot="icon">inbox</md-gb-icon>Inbox</md-gb-nav-drawer-item>';
const DRAWER_WRAP = (attrs = '', item = DRAWER_ITEM) =>
  `<div style="height: 500px; position: relative"><md-gb-nav-drawer open${attrs} aria-label="Mail">${item}</md-gb-nav-drawer></div>`;
const ITEM = 'light:md-gb-nav-drawer-item >> ';

function drawerRows(modal) {
  const m = modal ? ' modal' : '';
  const wrap = (item) => DRAWER_WRAP(m, item);
  const rows = [
    {cells: ['Container height', '100%'], name: 'Container height', el: '[part=drawer]', m: 'height', dp: modal ? {like: 'window'} : 500},
    {cells: ['Container width', '360dp'], name: 'Container width', el: '[part=drawer]', m: 'width', dp: 360},
  ];
  if (!modal) {
    rows.push({cells: ['Container shape', '0,16,16,0dp corner radii'], name: 'Container shape', el: '[part=drawer]', m: 'radius', dp: 0, checks: [
      {el: '[part=drawer]', m: 'radius-top-right', dp: 16},
      {el: '[part=drawer]', m: 'radius-bottom-right', dp: 16},
      {el: '[part=drawer]', m: 'radius-bottom-left', dp: 0},
    ]});
  }
  rows.push(
    {cells: ['Icon size', '24dp'], name: 'Icon size', el: 'light:md-gb-icon', m: 'width', dp: 24, checks: [{el: 'light:md-gb-icon', m: 'height', dp: 24}]},
    {cells: ['Active indicator height', '56dp'], name: 'Active indicator height', el: `${ITEM}[part=item]`, m: 'height', dp: 56},
    {cells: ['Active indicator shape', '28dp'], name: 'Active indicator shape', el: `${ITEM}[part=item]`, m: 'radius', dp: 28},
    {cells: ['Active indicator width', '336dp'], name: 'Active indicator width', el: `${ITEM}[part=item]`, m: 'width', dp: 336},
    {cells: ['Horizontal label alignment', 'Start-aligned'], name: 'Horizontal label alignment', el: `${ITEM}[part=label]`, css: 'text-align', is: ['start', 'left']},
    {cells: ['Left padding', '28dp'], name: 'Left padding', el: 'light:md-gb-icon', m: 'offset-left', dp: {eq: 28, rel: '[part=drawer]'}},
    {cells: ['Right padding', '28dp'], name: 'Right padding', markup: wrap('<md-gb-nav-drawer-item badge="12"><md-gb-icon slot="icon">inbox</md-gb-icon>Inbox</md-gb-nav-drawer-item>'), el: `${ITEM}[part=badge]`, m: 'offset-right', dp: {eq: 28, rel: '[part=drawer]'}},
    {cells: ['Active indicator padding', '12dp'], name: 'Active indicator padding', el: `${ITEM}[part=item]`, m: 'offset-left', dp: {eq: 12, rel: '[part=drawer]'}, checks: [{el: `${ITEM}[part=item]`, m: 'offset-right', dp: {eq: 12, rel: '[part=drawer]'}}]},
    {cells: ['Padding between elements', '0dp'], name: 'Padding between elements', markup: wrap('<md-gb-nav-drawer-item>One</md-gb-nav-drawer-item><md-gb-nav-drawer-item>Two</md-gb-nav-drawer-item>'), el: '[part=nav]', m: 'row-gap', dp: 0},
  );
  return rows;
}

const navdrawer = {
  imports: ['./md-gb-nav-drawer.js', './md-gb-nav-drawer-item.js', '../../styles/icon/md-gb-icon.js'],
  sections: [
    {
      page: 'navigation-drawer',
      section: 'navigation-drawer/specs/measurements/standard-navigation-drawer',
      host: 'md-gb-nav-drawer',
      base: DRAWER_WRAP(),
      rows: drawerRows(false).map((r) => ({...r, name: `Standard: ${r.name}`})),
    },
    {
      page: 'navigation-drawer',
      section: 'navigation-drawer/specs/measurements/modal-navigation-drawer',
      host: 'md-gb-nav-drawer',
      base: DRAWER_WRAP(' modal'),
      rows: drawerRows(true).map((r) => ({...r, name: `Modal: ${r.name}`})),
    },
  ],
};

// Search -------------------------------------------------------------------

const BAR = (inner = '', wrap = 500) => `<div style="width: ${wrap}px"><md-gb-search-bar placeholder="Search" quick>${inner}</md-gb-search-bar></div>`;
const TRAILING = '<md-gb-icon-button slot="trailing"><md-gb-icon>mic</md-gb-icon></md-gb-icon-button>';
const AVATAR = '<img slot="avatar" alt="" width="30" height="30" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=">';
const VIEW = (attrs = '') => `<md-gb-search-view open quick placeholder="Search"${attrs}></md-gb-search-view>`;

const search = {
  imports: ['./md-gb-search-bar.js', './md-gb-search-view.js', '../iconbutton/md-gb-icon-button.js', '../../styles/icon/md-gb-icon.js'],
  sections: [
    {
      page: 'search',
      section: 'search/specs/measurements/search-bar',
      host: 'md-gb-search-bar',
      base: BAR(),
      rows: [
        {cells: ['Container', 'Width', 'Min: 360dp, max: 720dp'], name: 'Container width', el: '[part=bar]', m: 'width', cases: [
          {name: 'minimum', markup: BAR('', 200), dp: {min: 360}},
          {name: 'maximum', markup: BAR('', 900), dp: {max: 720}},
        ]},
        {cells: ['Height', '56dp'], name: 'Container height', el: '[part=bar]', m: 'height', dp: 56},
        {cells: ['Label alignment', 'Start-aligned'], name: 'Label alignment', el: '[part=input]', css: 'text-align', is: ['start', 'left']},
        {cells: ['Leading padding', 'Unfocused: 24dp, focused: 12dp'], name: 'Leading padding, unfocused', el: '.search-bar-icon', m: 'offset-left', dp: {eq: 24, rel: '[part=bar]'}},
        {cells: ['Trailing padding', 'Unfocused: 24dp, focused: 12dp'], name: 'Trailing padding, unfocused', markup: BAR(TRAILING), el: 'light:md-gb-icon', m: 'offset-right', dp: {eq: 24, rel: '[part=bar]'}},
        {cells: ['Leading icon and label padding (from tap target)', '4dp'], name: 'Leading icon and label padding', el: '[part=input]', m: 'offset-left', dp: {eq: 40, rel: '.search-bar-icon'}},
        {cells: ['Label and trailing icon padding (from tap target)', '4dp'], name: 'Label and trailing icon padding', markup: BAR(TRAILING), el: '[part=input]', m: 'offset-right', dp: {eq: 52, rel: 'light:md-gb-icon-button'}},
        {cells: ['Avatar', 'Size', '30dp'], name: 'Avatar size', markup: BAR(AVATAR), el: 'light:img', m: 'width', dp: 30, checks: [{el: 'light:img', m: 'height', dp: 30}]},
      ],
    },
    {
      page: 'search',
      section: 'search/specs/measurements/focused-search/contained-style',
      host: 'md-gb-search-view',
      base: VIEW(),
      rows: [
        {cells: ['Full-screen container', 'Width', 'Full width'], name: 'Full-screen container width', el: '[part=container]', m: 'width', dp: {like: 'window'}},
        {cells: ['Height', 'Full height'], name: 'Full-screen container height', el: '[part=container]', m: 'height', dp: {like: 'window'}},
        {cells: ['Docked container', 'Width', 'Min: 360dp, max: 720dp'], name: 'Docked container width', markup: VIEW(' docked'), el: '[part=container]', m: 'width', dp: {min: 360, max: 720}},
        {cells: ['Height', 'Min: 240dp, max: 2/3 of screen height'], name: 'Docked container height', markup: VIEW(' docked'), el: '[part=container]', m: 'height', dp: {min: 240}, checks: [{el: '[part=container]', m: 'height', dp: {max: 400}}]},
        {cells: ['Search bar container', 'Height', '56dp'], name: 'Search bar container height', el: '[part=header]', m: 'height', dp: 56},
        {cells: ['Label alignment', 'Start-aligned'], name: 'Label alignment', el: '[part=input]', css: 'text-align', is: ['start', 'left']},
        {cells: ['Leading padding', '16dp'], name: 'Leading padding', el: '.search-view-back svg', m: 'offset-left', dp: {eq: 16, rel: '[part=header]'}},
        {cells: ['Trailing padding', '16dp'], name: 'Trailing padding', markup: VIEW(' value="Query"'), el: '.search-view-clear svg', m: 'offset-right', dp: {eq: 16, rel: '[part=header]'}},
        {cells: ['Leading icon and label padding (from tap target)', '4dp'], name: 'Leading icon and label padding', el: '[part=input]', m: 'offset-left', dp: {eq: 48, rel: '.search-view-back'}},
        {cells: ['Leading icon and label padding (from tap target)', '4dp'], name: 'Label and trailing icon padding', markup: VIEW(' value="Query"'), el: '[part=input]', m: 'offset-right', dp: {eq: 48, rel: '.search-view-clear'}},
      ],
    },
  ],
};

// Text fields --------------------------------------------------------------

const TF = (variant, attrs = '', inner = '') => `<md-gb-text-field variant="${variant}" label="Label" supporting-text="Help"${attrs}>${inner}</md-gb-text-field>`;
const TF_LEADING = '<md-gb-icon slot="leading-icon">search</md-gb-icon>';
const TF_BOTH = `${TF_LEADING}<md-gb-icon slot="trailing-icon">clear</md-gb-icon>`;
const CONTAINER = '[part=container]';

function textFieldRows(variant) {
  const t = (attrs, inner) => TF(variant, attrs, inner);
  const filled = variant === 'filled';
  const iconAlignment = {cells: ['Icon alignment', 'Vertically centered'], name: 'Icon alignment', markup: t('', TF_BOTH), el: 'light:md-gb-icon', m: 'center-offset-y', dp: {eq: 0, rel: CONTAINER}};
  const iconPadding = {cells: ['Padding between icons and text', '16dp'], name: 'Padding between icons and text', markup: t('', TF_LEADING), el: '.text-field-content', m: 'offset-left', dp: {eq: 16 + 24, rel: 'light:md-gb-icon'}};
  const labelAlignment = (cell) => ({cells: [cell, 'Vertically centered'], name: 'Label alignment, unpopulated', el: '[part=label]', m: 'center-offset-y', dp: {eq: 0, rel: CONTAINER}});
  const rows = [{cells: [filled ? 'Default container height' : 'Container height', '56dp'], name: 'Container height', el: CONTAINER, m: 'height', dp: 56}];
  if (filled) {
    rows.push(labelAlignment('Label alignment (unpopulated)'));
    rows.push({cells: ['Top/bottom padding', '8dp'], name: 'Top/bottom padding', markup: t(' value="Text"'), el: '[part=label]', m: 'offset-top', dp: {eq: 8, rel: CONTAINER}, checks: [{el: '.text-field-content', m: 'padding-bottom', dp: 8}]});
  }
  rows.push(
    {cells: ['Left/right padding without icons', '16dp'], name: 'Left/right padding without icons', el: '.text-field-input-row', m: 'offset-left', dp: {eq: 16, rel: CONTAINER}, checks: [{el: '.text-field-input-row', m: 'offset-right', dp: {eq: 16, rel: CONTAINER}}]},
    {cells: ['Left/right padding with icons', '12dp'], name: 'Left/right padding with icons', markup: t('', TF_BOTH), el: 'light:md-gb-icon[slot=leading-icon]', m: 'offset-left', dp: {eq: 12, rel: CONTAINER}, checks: [{el: 'light:md-gb-icon[slot=trailing-icon]', m: 'offset-right', dp: {eq: 12, rel: CONTAINER}}]},
    ...(filled ? [iconAlignment, iconPadding] : [iconPadding, iconAlignment]),
    {cells: ['Supporting text and character counter top padding', '4dp'], name: 'Supporting text and character counter top padding', markup: t(' maxlength="20"'), el: '.text-field-supporting', m: 'padding-top', dp: 4},
    {cells: ['Padding between supporting text and character counter', '16dp'], name: 'Padding between supporting text and character counter', markup: t(' maxlength="20"'), el: '.text-field-supporting', m: 'gap', dp: 16},
  );
  if (!filled) {
    rows.push(labelAlignment('Label alignment'));
    rows.push({cells: ['Left/right padding populated label text', '4dp'], name: 'Left/right padding populated label text', markup: t(' value="Text"'), el: '.text-field-outline-notch', m: 'padding-left', dp: 4, checks: [{el: '.text-field-outline-notch', m: 'padding-right', dp: 4}]});
  }
  rows.push({cells: ['Target size'], name: 'Target size', el: CONTAINER, m: 'height', dp: {min: 56}});
  return rows;
}

const textfield = {
  imports: ['./md-gb-text-field.js', '../../styles/icon/md-gb-icon.js'],
  sections: ['filled', 'outlined'].map((variant) => ({
    page: 'text-fields',
    section: `text-fields/specs/${variant}-text-field/${variant}-text-field-measurements`,
    host: 'md-gb-text-field',
    base: TF(variant),
    rows: textFieldRows(variant).map((r) => ({...r, name: `${variant[0].toUpperCase()}${variant.slice(1)}: ${r.name}`})),
  })),
};

// Menus --------------------------------------------------------------------

const MENU = (inner = 'Item') => `<md-gb-menu open><md-gb-menu-item>${inner}</md-gb-menu-item></md-gb-menu>`;
const MENU_DIVIDED = '<md-gb-menu open><md-gb-menu-item>One</md-gb-menu-item><md-gb-divider></md-gb-divider><md-gb-menu-item>Two</md-gb-menu-item></md-gb-menu>';
const MI = 'light:md-gb-menu-item >> [part=menu-item]';

const menu = {
  imports: ['./md-gb-menu.js', './md-gb-menu-item.js', '../divider/md-gb-divider.js', '../../styles/icon/md-gb-icon.js'],
  sections: [
    {
      page: 'menus',
      section: 'menus/specs/menu-baseline/measurements',
      host: 'md-gb-menu',
      setup: "need('md-gb-menu').showPopover();\nawait settleStyle('md-gb-menu >> [part=menu]');",
      base: MENU(),
      rows: [
        {cells: ['Container width', '112dp min, 280dp max'], name: 'Container width', el: '[part=menu]', m: 'width', cases: [
          {name: 'minimum', markup: MENU('A'), dp: {min: 112}},
          {name: 'maximum', markup: MENU('A long menu item label that is wider than the menu maximum width '.repeat(3)), dp: {max: 280}},
        ]},
        {cells: ['Corner radius', '4dp'], name: 'Corner radius', skip: 'baseline menu only; the Expressive vertical menu takes its shape from md.comp.menus container.shape (corner-lg, 16dp)'},
        {cells: ['Vertical label text alignment', 'Center-aligned'], name: 'Vertical label text alignment', el: MI, css: 'align-items', is: 'center'},
        {cells: ['Horizontal label text alignment', 'Start-aligned'], name: 'Horizontal label text alignment', el: MI, css: 'justify-content', is: ['normal', 'flex-start', 'start']},
        {cells: ['Left/right padding', '12dp'], name: 'Left/right padding', skip: 'baseline menu only; the Expressive vertical menu takes its item padding from md.comp.menus.item leading-space and trailing-space (16dp)'},
        {cells: ['Left/right padding with-icon', '12dp'], name: 'Left/right padding with icon', skip: 'baseline menu only; the Expressive vertical menu takes its item padding from md.comp.menus.item leading-space and trailing-space (16dp)'},
        {cells: ['List item height', '48dp'], name: 'List item height', el: MI, m: 'height', dp: 48},
        {cells: ['Padding between elements within a list item', '12dp'], name: 'Padding between elements within a list item', markup: MENU('<md-gb-icon slot="leading">star</md-gb-icon>Item'), el: MI, m: 'gap', dp: 12},
        {cells: ['Divider top/bottom padding', '8dp'], name: 'Divider top/bottom padding', markup: MENU_DIVIDED, el: 'light:md-gb-divider', m: 'margin-top', dp: 8, checks: [{el: 'light:md-gb-divider', m: 'margin-bottom', dp: 8}]},
        {cells: ['Divider height', '1dp'], name: 'Divider height', markup: MENU_DIVIDED, el: 'light:md-gb-divider >> [part=divider]', m: 'border-bottom', dp: 1},
        {cells: ['Divider width', 'Dynamic'], name: 'Divider width', skip: 'dynamic; not a dp value'},
        {cells: ['Leading/trailing icon size', '24dp'], name: 'Leading and trailing icon size', skip: 'baseline menu only; the Expressive vertical menu takes its icon size from md.comp.menus.item leading-icon and trailing-icon size (20dp)'},
      ],
    },
  ],
};

// Tooltips -----------------------------------------------------------------

const TIP = (attrs = '', inner = 'Tip') => `<button id="anchor">Anchor</button><md-gb-tooltip for="anchor" open quick${attrs}>${inner}</md-gb-tooltip>`;
const RICH = TIP(' variant="rich"', '<span slot="subhead">Subhead</span>Supporting text for the rich tooltip.');

const tooltip = {
  imports: ['./md-gb-tooltip.js'],
  sections: [
    {
      page: 'tooltips',
      section: 'tooltips/specs/plain-tooltip/plain-tooltip-measurements',
      host: 'md-gb-tooltip',
      base: TIP(),
      rows: [
        {cells: ['Container height', '24dp'], name: 'Plain: Container height', el: '[part=tooltip]', m: 'height', dp: 24},
        {cells: ['Padding', '8dp'], name: 'Plain: Padding', el: '[part=tooltip]', m: 'padding-left', dp: 8, checks: [{el: '[part=tooltip]', m: 'padding-right', dp: 8}]},
      ],
    },
    {
      page: 'tooltips',
      section: 'tooltips/specs/rich-tooltip/rich-tooltip-measurements',
      host: 'md-gb-tooltip',
      base: RICH,
      rows: [
        {cells: ['Top padding'], name: 'Rich: Top padding', el: '[part=tooltip]', m: 'padding-top', dp: 12},
        {cells: ['Bottom padding'], name: 'Rich: Bottom padding', el: '[part=tooltip]', m: 'padding-bottom', dp: 8},
        {cells: ['Left and right padding'], name: 'Rich: Left and right padding', el: '[part=tooltip]', m: 'padding-left', dp: 16, checks: [{el: '[part=tooltip]', m: 'padding-right', dp: 16}]},
      ],
    },
  ],
};

// Sheets -------------------------------------------------------------------

const BOTTOM = (attrs = '', inner = 'Content') => `<md-gb-bottom-sheet open quick${attrs}>${inner}</md-gb-bottom-sheet>`;
const TALL = '<div style="height: 3000px">Content</div>';
const SETTLE_SHEET = "await settleStyle('md-gb-bottom-sheet >> [part=container]');";
const SIDE = (attrs = '', inner = 'Content<button slot="actions">Save</button>') => `<md-gb-side-sheet open quick headline="Title" divider${attrs}>${inner}</md-gb-side-sheet>`;
const SIDE_WIDE = SIDE('', 'Content<button slot="actions">Save</button>').replace('<md-gb-side-sheet ', '<md-gb-side-sheet style="--width: 900px" ');

function sideSheetRows(modal) {
  const m = modal ? ' modal' : '';
  const rows = [
    {cells: ['Start/end padding', '24dp'], name: 'Start/end padding', markup: SIDE(m), el: '[part=header]', m: 'padding-left', dp: 24, checks: [{el: '[part=content]', m: 'padding-left', dp: 24}]},
  ];
  if (modal) {
    rows.push({cells: ['Start padding with icon'], name: 'Start padding with icon', markup: SIDE(`${m} has-back-button`), el: '[part=header]', m: 'padding-left', dp: 16});
  }
  rows.push(
    {cells: modal ? ['Padding between top elements'] : ['Padding between top elements', '12dp'], name: 'Padding between top elements', markup: SIDE(`${m} has-back-button`), el: '[part=header]', m: 'gap', dp: 12},
    {cells: ['Bottom actions height', '72dp'], name: 'Bottom actions height', markup: SIDE(m), el: '[part=actions]', m: 'height', dp: 72},
    {cells: ['Bottom actions top padding', '16dp'], name: 'Bottom actions top padding', markup: SIDE(m), el: '[part=actions]', m: 'padding-top', dp: 16},
    {cells: modal ? ['Bottom actions bottom padding'] : ['Bottom actions bottom padding', '24dp'], name: 'Bottom actions bottom padding', markup: SIDE(m), el: '[part=actions]', m: 'padding-bottom', dp: 24},
    {cells: ['Bottom actions alignment (horizontal)', 'Left'], name: 'Bottom actions alignment', markup: SIDE(m), el: '[part=actions]', css: 'justify-content', is: ['normal', 'flex-start', 'start', 'left']},
    {cells: ['Max-width', '400dp'], name: 'Max-width', markup: SIDE(m), el: '[part=container]', m: 'width', dp: {max: 400}},
    {cells: ['Margins (when detached)', '16dp'], name: 'Margins when detached', markup: modal ? SIDE(`${m} detached`) : `<div style="position: fixed; inset: 0">${SIDE(`${m} detached`)}</div>`, el: '[part=container]', m: modal ? 'offset-right' : 'offset-left', dp: {eq: 16, rel: 'window'}, checks: [{el: '[part=container]', m: 'offset-top', dp: {eq: 16, rel: 'window'}}, {el: '[part=container]', m: 'offset-bottom', dp: {eq: 16, rel: 'window'}}]},
  );
  return rows;
}

const sheet = {
  imports: ['./md-gb-bottom-sheet.js', './md-gb-side-sheet.js', '../../styles/icon/md-gb-icon.js'],
  sections: [
    {
      page: 'bottom-sheets',
      section: 'bottom-sheets/specs/measurements',
      host: 'md-gb-bottom-sheet',
      base: BOTTOM(),
      rows: [
        {cells: ['Drag handle alignment (horizontal)', 'Center'], name: 'Drag handle alignment', el: '[part=drag-handle]', m: 'center-offset-x', dp: {eq: 0, rel: '[part=container]'}},
        {cells: ['Drag handle padding top/bottom', '22dp'], name: 'Drag handle padding top/bottom', el: '[part=drag-handle]', m: 'offset-top', dp: {eq: 22, rel: '[part=container]'}},
        {cells: ['Top margin', '72dp'], name: 'Top margin', markup: BOTTOM(' state="expanded"', TALL), viewport: {width: 600, height: 800}, setup: SETTLE_SHEET, el: '[part=container]', m: 'offset-top', dp: {eq: 72, rel: 'window'}},
        {cells: ['Top margin (window width > 640dp)'], name: 'Top margin, window wider than 640dp', markup: BOTTOM(' state="expanded"', TALL), viewport: {width: 700, height: 800}, setup: SETTLE_SHEET, el: '[part=container]', m: 'offset-top', dp: {eq: 56, rel: 'window'}},
        {cells: ['Start/end margin (window width > 640dp)', '56dp'], name: 'Start/end margin, window wider than 640dp', markup: BOTTOM(' state="expanded"', TALL), viewport: {width: 700, height: 800}, setup: SETTLE_SHEET, el: '[part=container]', m: 'offset-left', dp: {eq: 56, rel: 'window'}, checks: [{el: '[part=container]', m: 'offset-right', dp: {eq: 56, rel: 'window'}}]},
        {cells: ['Width', 'Full width, up to max-width 640dp'], name: 'Width', cases: [
          {name: 'narrow window is full width', markup: BOTTOM(), viewport: {width: 500, height: 800}, el: '[part=container]', m: 'width', dp: {like: 'window'}},
          {name: 'wide window is at most 640dp', markup: BOTTOM(), viewport: {width: 1000, height: 800}, el: '[part=container]', m: 'width', dp: {max: 640}},
        ]},
        {cells: ['Height'], name: 'Height', skip: 'variable; not a dp value'},
      ],
    },
    {
      page: 'side-sheets',
      section: 'side-sheets/specs/standard-side-sheet/standard-side-sheet-measurements',
      host: 'md-gb-side-sheet',
      setup: "await settleStyle('md-gb-side-sheet >> [part=container]');",
      base: SIDE(),
      rows: sideSheetRows(false).map((r) => ({...r, name: `Standard: ${r.name}`})),
    },
    {
      page: 'side-sheets',
      section: 'side-sheets/specs/modal-side-sheet/modal-side-sheet-measurements',
      host: 'md-gb-side-sheet',
      setup: "await settleStyle('md-gb-side-sheet >> [part=container]');",
      base: SIDE(' modal'),
      rows: sideSheetRows(true).map((r) => ({...r, name: `Modal: ${r.name}`})),
    },
  ],
};

// Carousel -----------------------------------------------------------------

const CAROUSEL = (layout, attrs = '', count = 6) =>
  `<md-gb-carousel layout="${layout}"${attrs} style="width: 400px; height: 200px">${Array.from({length: count}, (_, i) => `<md-gb-carousel-item label="Item ${i + 1}">${i + 1}</md-gb-carousel-item>`).join('')}</md-gb-carousel>`;
const CITEM = 'light:md-gb-carousel-item >> [part=item]';

const carousel = {
  imports: ['./md-gb-carousel.js', './md-gb-carousel-item.js'],
  sections: [],
};

/** Adds one carousel table; `alignment` and the optional rows vary by layout. */
function carouselSection(name, section, layout, attrs, o) {
  const c = CAROUSEL(layout, attrs);
  const rows = [
    {cells: ['Alignment'], name: 'Alignment', el: CITEM, m: 'center-offset-y', dp: {eq: o.alignment ?? 0, rel: '[part=carousel]'}},
    {cells: [o.leading], name: 'Leading padding', el: o.clip ? 'light:md-gb-carousel-item >> [part=content]' : CITEM, m: o.clip ? 'clip-offset-left' : 'offset-left', dp: {eq: o.padding ?? 16, rel: '[part=carousel]'}},
    {cells: o.separate ? ['Top/bottom padding', `${o.topBottom ?? 8}dp`] : ['Top/bottom padding'], name: 'Top/bottom padding', el: CITEM, m: 'offset-top', dp: {eq: o.topBottom ?? 8, rel: '[part=carousel]'}},
    {cells: o.separate ? ['Padding between elements', '8dp'] : ['Padding between elements'], name: 'Padding between elements', el: '[part=scroller]', m: 'gap', dp: 8},
  ];
  if (o.widths) rows.push(...o.widths);
  if (o.radius !== false) rows.push({cells: ['Item corner radius'], name: 'Item corner radius', el: 'light:md-gb-carousel-item >> [part=content]', m: 'clip-radius', dp: 28});
  carousel.sections.push({
    page: 'carousel',
    section: `carousel/specs/${section}/measurements`,
    host: 'md-gb-carousel',
    base: c,
    rows: rows.map((r) => ({...r, name: `${name}: ${r.name}`})),
  });
}

const SIZE = 'prop:--carousel-item-size';
carouselSection('Multi-browse', 'multi-browse', 'multi-browse', '', {leading: 'Leading/trailing padding', separate: true, widths: [
  {cells: ['Large item width'], name: 'Large item width', skip: 'dynamic, or user-set; not a dp value'},
  {cells: ['Medium item width'], name: 'Medium item width', skip: 'dynamic; not a dp value'},
  {cells: ['Small item width'], name: 'Small item width', el: 'light:md-gb-carousel-item:nth-child(3)', m: SIZE, dp: {min: 40, max: 56}},
]});
carouselSection('Uncontained', 'uncontained', 'uncontained', '', {leading: 'Leading padding', separate: true, clip: true});
carouselSection('Uncontained multi aspect ratio', 'uncontained-mutli-aspect-ratio', 'uncontained-multi-aspect', '', {leading: 'Leading padding', separate: true, clip: true});
carouselSection('Hero', 'hero', 'hero', '', {leading: 'Leading/Trailing padding', widths: [
  {cells: ['Large item width'], name: 'Large item width', skip: 'dynamic; not a dp value'},
  {cells: ['Small item width'], name: 'Small item width', el: 'light:md-gb-carousel-item:nth-child(2)', m: SIZE, dp: {min: 40, max: 56}},
]});
carouselSection('Center-aligned hero', 'center-aligned-hero', 'hero', ' alignment="center"', {leading: 'Leading/Trailing padding', widths: [
  {cells: ['Large item width'], name: 'Large item width', skip: 'dynamic; not a dp value'},
  {cells: ['Small item width'], name: 'Small item width', el: 'light:md-gb-carousel-item:nth-child(2)', m: SIZE, dp: {min: 40, max: 56}},
]});
carousel.sections.push({
  page: 'carousel',
  section: 'carousel/specs/full-screen/measurements',
  host: 'md-gb-carousel',
  base: CAROUSEL('full-screen'),
  rows: [
    {cells: ['Alignment'], name: 'Alignment', el: CITEM, m: 'center-offset-x', dp: {eq: 0, rel: '[part=carousel]'}},
    {cells: ['Leading/Trailing padding'], name: 'Leading/trailing padding', el: CITEM, m: 'offset-left', dp: {eq: 0, rel: '[part=carousel]'}, checks: [{el: CITEM, m: 'offset-right', dp: {eq: 0, rel: '[part=carousel]'}}]},
    {cells: ['Top/bottom padding', '0dp'], name: 'Top/bottom padding', el: CITEM, m: 'offset-top', dp: {eq: 0, rel: '[part=carousel]'}},
    {cells: ['Padding between elements', '16dp'], name: 'Padding between elements', el: '[part=scroller]', m: 'row-gap', dp: 16},
  ].map((r) => ({...r, name: `Full-screen: ${r.name}`})),
});

// Lists --------------------------------------------------------------------

const LI = 'light:md-gb-list-item >> ';
const LI_ITEM = `${LI}[part=list-item]`;
const LIST = (item) => `<div style="width: 360px"><md-gb-list>${item}</md-gb-list></div>`;
const LIST_ONE = LIST('<md-gb-list-item><md-gb-icon slot="leading">star</md-gb-icon>Item<md-gb-icon slot="trailing">star</md-gb-icon></md-gb-list-item>');
const LIST_PLAIN = LIST('<md-gb-list-item>Item</md-gb-list-item>');
const LIST_TALL = LIST('<md-gb-list-item><md-gb-icon slot="leading">star</md-gb-icon><span slot="overline">Overline</span>Item<span slot="supporting-text">Supporting text that is long enough to wrap onto several lines of the narrow list so that the item is taller than 88dp</span><md-gb-icon slot="trailing">star</md-gb-icon></md-gb-list-item>');
const LIST_DIVIDED = (attrs = '') => LIST(`<md-gb-list-item>A</md-gb-list-item><md-gb-divider${attrs}></md-gb-divider><md-gb-list-item>B</md-gb-list-item>`);
const LIST_SEGMENTED = `<div style="width: 360px"><md-gb-list segmented selectable>${['A', 'B', 'C'].map((t, i) => `<md-gb-list-item${i === 1 ? ' checked' : ''}>${t}</md-gb-list-item>`).join('')}</md-gb-list></div>`;
const LI_N = (n) => `light:md-gb-list-item:nth-child(${n}) >> [part=list-item]`;

const list = {
  imports: ['./md-gb-list.js', './md-gb-list-item.js', '../divider/md-gb-divider.js', '../../styles/icon/md-gb-icon.js'],
  sections: [
    {
      page: 'lists',
      section: 'lists/specs/list-baseline/layout/three-line-lists',
      host: 'md-gb-list',
      base: LIST_ONE,
      rows: [
        {cells: ['Label alignment', 'Center'], name: 'Label alignment', el: `${LI}.list-item-content`, m: 'center-offset-y', dp: {eq: 0, rel: LI_ITEM}},
        {cells: ['Label alignment when height is 88dp or taller', 'Top'], name: 'Label alignment when height is 88dp or taller', markup: LIST_TALL, el: `${LI}.list-item-content`, m: 'offset-top', dp: {max: 12, rel: LI_ITEM}},
        {cells: ['Label left padding', '16dp'], name: 'Label left padding', markup: LIST_PLAIN, el: `${LI}.list-item-content`, m: 'offset-left', dp: {eq: 16, rel: LI_ITEM}},
        {cells: ['Leading element alignment (vertical)', 'Center'], name: 'Leading element alignment', el: `${LI}.list-item-leading`, m: 'center-offset-y', dp: {eq: 0, rel: LI_ITEM}},
        {cells: ['Leading element alignment (vertical) when height is 88dp or taller', 'Top'], name: 'Leading element alignment when height is 88dp or taller', markup: LIST_TALL, el: `${LI}.list-item-leading`, m: 'offset-top', dp: {max: 12, rel: LI_ITEM}},
        {cells: ['Leading element left padding', '16dp'], name: 'Leading element left padding', el: `${LI}.list-item-leading`, m: 'offset-left', dp: {eq: 16, rel: LI_ITEM}},
        {cells: ['Leading icon alignment (vertical)', 'Top'], name: 'Leading icon alignment', markup: LIST_TALL, el: `${LI}.list-item-leading`, m: 'offset-top', dp: {max: 12, rel: LI_ITEM}},
        {cells: ['Leading icon top padding', '8dp'], name: 'Leading icon top padding', skip: 'baseline-only 8dp; the Expressive list takes its vertical padding from md.comp.list.list-item.top-space (10dp)'},
        {cells: ['Leading icon top padding when height is 88dp or taller', '12dp'], name: 'Leading icon top padding when height is 88dp or taller', skip: 'baseline-only 12dp; the Expressive list takes its vertical padding from md.comp.list.list-item.top-space (10dp); top alignment is tested above'},
        {cells: ['Trailing element alignment (vertical)', 'Center'], name: 'Trailing element alignment', el: `${LI}.list-item-trailing`, m: 'center-offset-y', dp: {eq: 0, rel: LI_ITEM}},
        {cells: ['Trailing element alignment (vertical) when height is 88dp or taller', 'Top'], name: 'Trailing element alignment when height is 88dp or taller', markup: LIST_TALL, el: `${LI}.list-item-trailing`, m: 'offset-top', dp: {max: 12, rel: LI_ITEM}},
        {cells: ['Trailing element left padding', '16dp'], name: 'Trailing element left padding', skip: 'baseline-only 16dp; the Expressive list uses md.comp.list.list-item.between-space (12dp)'},
        {cells: ['Trailing element right padding', '24dp'], name: 'Trailing element right padding', skip: 'baseline-only 24dp; the Expressive list uses md.comp.list.list-item.trailing-space (16dp)'},
        {cells: ['Padding above/below divider', '0dp'], name: 'Padding above/below divider', markup: LIST_DIVIDED(), el: 'light:md-gb-divider', m: 'margin-top', dp: 0, checks: [{el: 'light:md-gb-divider', m: 'margin-bottom', dp: 0}]},
        {cells: ['Targets', '48dp'], name: 'Targets', el: LI_ITEM, m: 'height', dp: {min: 48}},
        {cells: ['Divider full-width', '100%'], name: 'Divider full-width', markup: LIST_DIVIDED(), el: 'light:md-gb-divider', m: 'width', dp: {like: ''}},
        {cells: ['Divider inset left padding', '16dp'], name: 'Divider inset left padding', markup: LIST_DIVIDED(' inset-start'), el: 'light:md-gb-divider >> [part=divider]', m: 'margin-left', dp: 16},
        {cells: ['Divider inset right padding', '24dp'], name: 'Divider inset right padding', skip: 'baseline-only 24dp; the Expressive list uses md.comp.list.divider.trailing-space (16dp)'},
      ],
    },
    {
      page: 'lists',
      section: 'lists/specs/measurements',
      kind: ['sentence', 'list-item'],
      host: 'md-gb-list',
      base: LIST_SEGMENTED,
      rows: [
        {cells: ['List item alignment, padding, and size measurements.'], name: 'Caption', skip: 'caption of the measurement figure; the figure rows are tested above'},
        {cells: ['The icon button height is dynamic, and automatically adjusts to fill the list item height.'], name: 'Icon button height', skip: 'dynamic; not a dp value'},
        {cells: ['When a list item is selected, the corner shape changes to highlight the active item:'], name: 'Shape morphing intro', skip: 'introduces the two radius rows below'},
        {cells: ['Unselected corner radius: 4dp inner, 16dp outer'], name: 'Unselected corner radius', el: LI_N(1), m: 'radius', dp: 16, checks: [{el: LI_N(1), m: 'radius-bottom-left', dp: 4}, {el: LI_N(3), m: 'radius', dp: 4}, {el: LI_N(3), m: 'radius-bottom-left', dp: 16}]},
        {cells: ['Selected corner radius: 16dp'], name: 'Selected corner radius', el: LI_N(2), m: 'radius', dp: 16, checks: [{el: LI_N(2), m: 'radius-bottom-left', dp: 16}, {el: LI_N(2), m: 'radius-top-right', dp: 16}]},
        {cells: ['Unselected list items have a 4dp inner corner radius, and 16dp outer corner radius'], name: 'Unselected list items inner and outer radius', el: LI_N(1), m: 'radius', dp: 16, checks: [{el: LI_N(1), m: 'radius-bottom-left', dp: 4}, {el: LI_N(3), m: 'radius-bottom-left', dp: 16}]},
        {cells: ['Selected list items have a 16dp corner radius all around'], name: 'Selected list items radius all around', el: LI_N(2), m: 'radius', dp: 16, checks: [{el: LI_N(2), m: 'radius-bottom-left', dp: 16}]},
      ],
    },
  ],
};

// Button groups ------------------------------------------------------------

const GROUP_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
const BG = (variant, size, buttonAttrs = '') =>
  `<md-gb-button-group variant="${variant}" aria-label="Format"><md-gb-button size="${size}"${buttonAttrs}>One</md-gb-button><md-gb-button size="${size}"${buttonAttrs}>Two</md-gb-button><md-gb-button size="${size}"${buttonAttrs}>Three</md-gb-button></md-gb-button-group>`;
const FIRST = 'light:md-gb-button:nth-child(1) >> [part=btn]';
const LAST = 'light:md-gb-button:nth-child(3) >> [part=btn]';

const buttongroup = {
  imports: ['./md-gb-button-group.js', '../button/md-gb-button.js'],
  sections: [
    {
      page: 'button-groups',
      section: 'button-groups/specs/measurements/standard-button-group',
      kind: ['list-item', 'sentence'],
      host: 'md-gb-button-group',
      base: BG('standard', 'md'),
      rows: [
        {cells: ['Standard groups apply padding between all buttons.'], name: 'Standard: padding between all buttons', skip: 'introduces the per-size rows below'},
        {cells: ['The amount of padding changes based on button size to ensure a minimum accessible target size of 48dp.'], name: 'Standard: padding changes with size', skip: 'introduces the per-size rows below'},
        {cells: ['More details on padding: [Button specs](/m3/pages/common-buttons/specs), [icon button specs](/m3/pages/icon-buttons/specs)'], name: 'Standard: more details', skip: 'a pointer to the button specs'},
        {cells: ['Standard button group inner padding:'], name: 'Standard: inner padding heading', skip: 'introduces the per-size rows below'},
        ...GROUP_SIZES.map((size, i) => ({cells: [`${size === 'xs' ? 'XS' : size === 'sm' ? 'S' : size === 'md' ? 'M' : size === 'lg' ? 'L' : 'XL'}: ${[18, 12, 8, 8, 8][i]}dp`], name: `Standard: inner padding, ${size}`, markup: BG('standard', size), el: '', m: 'gap', dp: [18, 12, 8, 8, 8][i]})),
      ],
    },
    {
      page: 'button-groups',
      section: 'button-groups/specs/measurements/connected-button-group',
      kind: ['list-item', 'sentence'],
      host: 'md-gb-button-group',
      base: BG('connected', 'md'),
      rows: [
        {cells: ['For all connected button groups, use 2dp padding.'], name: 'Connected: 2dp padding', markup: BG('connected', 'md'), el: '', m: 'gap', dp: 2},
        {cells: ['This provides visual consistency at scale.'], name: 'Connected: visual consistency', skip: 'rationale; no value'},
        {cells: ['Round connected button group inner padding is 2dp at every size.'], name: 'Round connected: inner padding', el: '', m: 'gap', cases: GROUP_SIZES.map((size) => ({name: size, markup: BG('connected', size), dp: 2}))},
        {cells: ['The outer shape is fully round, and the inner shape remains square with the following corner sizes:'], name: 'Round connected: outer shape is fully round', el: FIRST, m: 'radius', cases: GROUP_SIZES.map((size) => ({name: size, markup: BG('connected', size), dp: 'full'}))},
        ...GROUP_SIZES.map((size, i) => ({cells: [`${['XS', 'S', 'M', 'L', 'XL'][i]}: ${[4, 8, 8, 16, 20][i]}dp`], name: `Round connected: inner corner, ${size}`, markup: BG('connected', size), el: FIRST, m: 'radius-top-right', dp: [4, 8, 8, 16, 20][i]})),
        {cells: ['Square connected button group inner padding is 2dp at every size.'], name: 'Square connected: inner padding', el: '', m: 'gap', cases: GROUP_SIZES.map((size) => ({name: size, markup: BG('connected', size, ' square'), dp: 2}))},
        {cells: ['The outer shape has the following corner sizes:'], name: 'Square connected: outer shape heading', skip: 'introduces the per-size rows below'},
        ...GROUP_SIZES.map((size, i) => ({cells: [`${['XS', 'S', 'M', 'L', 'XL'][i]}: ${[4, 8, 8, 16, 20][i]}dp`], name: `Square connected: outer corner, ${size}`, markup: BG('connected', size, ' square'), el: FIRST, m: 'radius', dp: [4, 8, 8, 16, 20][i]})),
      ],
    },
    {
      page: 'button-groups',
      section: 'button-groups/specs/measurements/minimum-widths',
      kind: ['list-item', 'sentence'],
      host: 'md-gb-button-group',
      base: BG('connected', 'xs'),
      rows: [
        {cells: ['Extra small and small connected button groups have 48dp target areas and a minimum width of 48dp.'], name: 'Minimum widths', skip: 'the figure rows below name the sizes; the 48dp target size is checked on the button'},
        {cells: ['Extra small'], name: 'Extra small', markup: BG('connected', 'xs'), el: 'light:md-gb-button:nth-child(1)', m: 'width', dp: {min: 48}},
        {cells: ['Small'], name: 'Small', markup: BG('connected', 'sm'), el: 'light:md-gb-button:nth-child(1)', m: 'width', dp: {min: 48}},
      ],
    },
  ],
};

// Split button -------------------------------------------------------------

const SPLIT = (size) =>
  `<md-gb-split-button size="${size}"><button slot="leading">Save</button><button slot="trailing" aria-label="More"><md-gb-icon>arrow_drop_down</md-gb-icon></button></md-gb-split-button>`;
const SPLIT_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];

const splitbutton = {
  imports: ['./md-gb-split-button.js', '../../styles/icon/md-gb-icon.js'],
  sections: [
    {
      page: 'split-button',
      section: 'split-button/specs/measurements',
      kind: ['list-item', 'sentence'],
      host: 'md-gb-split-button',
      base: SPLIT('md'),
      rows: [
        {cells: ['Text and icons are optically centered when the buttons are asymmetrical.'], name: 'Optical centering when asymmetrical', skip: 'qualitative; the offsets are the rows below'},
        {cells: ['They’re centered normally when symmetrical.'], name: 'Centered when symmetrical', skip: 'qualitative; no value'},
        {cells: ['Menu icon offset when unselected:'], name: 'Menu icon offset heading', skip: 'introduces the per-size rows below'},
        ...SPLIT_SIZES.map((size, i) => ({cells: [`${['XS', 'S', 'M', 'L', 'XL'][i]}: -${[1, 1, 2, 3, 6][i]}dp from center`], name: `Menu icon offset, ${size}`, markup: SPLIT(size), el: 'light:button[slot=trailing] md-gb-icon', m: 'center-offset-x', dp: {eq: -[1, 1, 2, 3, 6][i], rel: 'light:button[slot=trailing]'}})),
        {cells: ['The inner corner radius changes depending on button sizing.'], name: 'Inner corner radius changes with size', skip: 'introduces the per-size rows below'},
        {cells: ['The space should always be 2dp.'], name: 'Space between the buttons', markup: SPLIT('md'), el: '[part=split-btn]', m: 'gap', dp: 2},
        ...SPLIT_SIZES.map((size, i) => ({cells: [`${['Extra small', 'Small', 'Medium', 'Large', 'Extra large'][i]} ${[4, 4, 4, 8, 12][i]}dp`], name: `Inner corner radius, ${size}`, markup: SPLIT(size), el: 'light:button[slot=leading]', m: 'radius-top-right', dp: [4, 4, 4, 8, 12][i]})),
      ],
    },
  ],
};

// FAB menu, toolbar, progress, loading indicator ---------------------------
// Their spec pages state measurements in sentences and bullets, not tables.

const SENTENCES = ['sentence', 'list-item'];
const caption = (text, why = 'an image caption; no value of its own') => ({cells: [text], name: text.slice(0, 60), skip: why});

const FAB_MENU = '<md-gb-fab-menu open><md-gb-fab-menu-item>One</md-gb-fab-menu-item></md-gb-fab-menu>';
const fabmenu = {
  imports: ['./md-gb-fab-menu.js', './md-gb-fab-menu-item.js', '../../styles/icon/md-gb-icon.js'],
  sections: [
    {
      page: 'fab-menu',
      section: 'fab-menu/specs/measurements',
      kind: SENTENCES,
      host: 'md-gb-fab-menu',
      base: FAB_MENU,
      rows: [
        {cells: ['FAB menu items share the same measurements as the medium button specs.'], name: 'Menu items share the medium button height', el: 'light:md-gb-fab-menu-item >> [part=item]', m: 'height', dp: 56},
        {cells: ['The close button should always be 56dp.'], name: 'Close button size', el: '[part=button]', m: 'width', dp: 56, checks: [{el: '[part=button]', m: 'height', dp: 56}]},
        caption('FAB menu size measurements'),
        caption('The FAB menu animates from the top trailing edge of the FAB to ensure a smooth animation.', 'motion origin; not a measurement'),
        {cells: ['The FAB should always have 16dp margins'], name: 'FAB margins', skip: 'placement margin set by the page that places the FAB; the menu has no margin of its own'},
        caption('The close button and FAB share the top trailing corner as an anchor and appear in the same place', 'placement relative to the FAB; the FAB is not part of the menu'),
        caption('Larger FABs will place the FAB menu slightly higher, with larger margins underneath.', 'placement relative to the FAB; the FAB is not part of the menu'),
        {cells: ['The medium FAB placement has 16dp margins'], name: 'Medium FAB margins', skip: 'placement margin set by the page that places the FAB'},
        caption('The close button is placed higher to align with the top of the medium FAB', 'placement relative to the FAB; the FAB is not part of the menu'),
        {cells: ['The large FAB placement has 16dp margins'], name: 'Large FAB margins', skip: 'placement margin set by the page that places the FAB'},
        caption('The close button is placed higher to align with the top of the large FAB', 'placement relative to the FAB; the FAB is not part of the menu'),
        caption('On web, the FAB menu opens from the FAB, and inherits its states and specs from the baseline menu component.', 'no value'),
        {cells: ['The gap between the FAB and menu can vary, but 4dp is recommended.'], name: 'Gap between the FAB and menu', skip: 'a recommendation that can vary; the FAB is not part of the menu'},
        caption('Spacing and interaction on FAB menu for web:', 'introduces a figure'),
        caption('Enabled', 'a state label of the figure'),
        caption('Hovered', 'a state label of the figure'),
        caption('Selected', 'a state label of the figure'),
      ],
    },
  ],
};

const DOCKED_TOOLBAR = '<md-gb-toolbar docked><md-gb-icon-button><md-gb-icon>edit</md-gb-icon></md-gb-icon-button><md-gb-icon-button><md-gb-icon>share</md-gb-icon></md-gb-icon-button></md-gb-toolbar>';
const TOOLBAR = '<md-gb-toolbar><md-gb-icon-button><md-gb-icon>edit</md-gb-icon></md-gb-icon-button><md-gb-icon-button><md-gb-icon>share</md-gb-icon></md-gb-icon-button></md-gb-toolbar>';
const toolbar = {
  imports: ['./md-gb-toolbar.js', '../iconbutton/md-gb-icon-button.js', '../../styles/icon/md-gb-icon.js'],
  sections: [
    {
      page: 'toolbars',
      section: 'toolbars/specs/measurements',
      kind: SENTENCES,
      host: 'md-gb-toolbar',
      base: TOOLBAR,
      rows: [
        {cells: ['By default all toolbars are 64dp high, center-aligned, have equal padding between items, and have a minimum outside padding of 16dp.'], name: 'Default toolbar', cases: [
          {name: 'height', el: '[part=toolbar]', m: 'height', dp: 64},
          {name: 'minimum outside padding', markup: DOCKED_TOOLBAR, el: '[part=toolbar]', m: 'padding-left', dp: {min: 16}, checks: [{el: '[part=toolbar]', m: 'padding-right', dp: {min: 16}}]},
          {name: 'center-aligned', markup: DOCKED_TOOLBAR, el: '[part=toolbar]', css: 'justify-content', is: ['center']},
        ]},
        caption('Default margins and padding'),
        caption('Margins and padding with leading, middle, and trailing content'),
        caption('Alignment and padding can be configured to create unique layouts:', 'introduces figures'),
        caption('Left and right alignment', 'a figure label'),
        {cells: ['Center-aligned, 8dp padding between items'], name: 'Center-aligned, 8dp padding between items', skip: 'a layout example; the docked toolbar spaces its items with clamp(min-spacing 4dp, 4vw, max-spacing 32dp) and the floating toolbar uses between-space (4dp)'},
        caption('Default padding of floating toolbar'),
        caption('Floating toolbar size and padding measurements'),
        caption('Floating toolbar margins'),
      ],
    },
  ],
};

const progress = {
  imports: ['./md-gb-progress.js'],
  sections: [
    {
      page: 'progress-indicators',
      section: 'progress-indicators/specs/configurations',
      kind: ['table-row', 'list-item'],
      host: 'md-gb-progress',
      base: '<md-gb-progress value="0.5" style="width: 300px"></md-gb-progress>',
      rows: [
        {cells: ['Thickness: Default (4dp) and variable'], name: 'Default thickness', el: '.progress-track-1', m: 'height', dp: 4},
        {cells: ['Fixed (4dp)'], name: 'Track thickness is fixed at 4dp', el: '.progress-track-1', m: 'height', dp: 4},
      ],
    },
    {
      page: 'progress-indicators',
      section: 'progress-indicators/specs/measurements',
      kind: 'sentence',
      host: 'md-gb-progress',
      base: '<md-gb-progress value="0.5" style="width: 300px"></md-gb-progress>',
      rows: [
        caption('Wavy indicators use **amplitude** and **wavelength** to determine the shape of the wave.', 'no value'),
        caption('The height is the overall container height.', 'no value'),
        caption('**Amplitude** measures from the center of the resting position to the center of the peak', 'no value of its own'),
        caption('**Wavelength** measures the distance between two adjacent peaks', 'no value of its own'),
        caption('Size measurements for linear progress indicators.'),
        caption('The thicker variants are provided as sample measurement for makers to adjust the default version based on their use cases.', 'sample variants; not part of the default spec'),
        caption('Size measurements for circular progress indicators.'),
        caption('The thicker variants are provided as sample measurement for makers to adjust the default version based on their use cases.', 'sample variants; not part of the default spec'),
        {cells: ['The linear progress indicator is inset from the edge of the screen by 4dp'], name: 'Linear indicator inset', el: '.progress-container', m: 'offset-left', dp: {eq: 4, rel: '[part=indicator]'}, checks: [{el: '.progress-container', m: 'offset-right', dp: {eq: 4, rel: '[part=indicator]'}}]},
      ],
    },
  ],
};

const loadingindicator = {
  imports: ['./md-gb-loading-indicator.js'],
  sections: [
    {
      page: 'loading-indicator',
      section: 'loading-indicator/specs/measurements',
      kind: 'sentence',
      host: 'md-gb-loading-indicator',
      base: '<md-gb-loading-indicator contained></md-gb-loading-indicator>',
      rows: [
        {cells: ['To ensure sufficient margins, the size is 48dp while the shape container is 38dp'], name: 'Size is 48dp and the shape container 38dp', el: '[part=indicator]', m: 'width', dp: 48, checks: [{el: '[part=indicator]', m: 'height', dp: 48}, {el: '.loading-indicator-shape', m: 'width', dp: 38}, {el: '.loading-indicator-shape', m: 'height', dp: 38}]},
      ],
    },
  ],
};

/**
 * Marks rows measured wrong as gaps: `{[row name]: reason}` per component.
 * A name that matches no row (or case) is an error.
 */
function markGaps(config, gaps) {
  const left = new Set(Object.keys(gaps));
  for (const section of config.sections) {
    for (const row of section.rows) {
      if (gaps[row.name] !== undefined) {
        row.gap = gaps[row.name];
        left.delete(row.name);
      }
      for (const c of row.cases ?? []) {
        const full = `${row.name}, ${c.name}`;
        if (gaps[full] !== undefined) {
          c.gap = gaps[full];
          left.delete(full);
        }
      }
    }
  }
  if (left.size) throw new Error(`gap names match no row: ${[...left].join('; ')}`);
  return config;
}

['Bar', 'View'].forEach((prefix, i) => search.sections[i].rows.forEach((r) => (r.name = `${prefix}: ${r.name}`)));

export const MORE_MEASUREMENTS = {
  timepicker,
  dialog,
  navdrawer,
  search,
  textfield,
  menu,
  tooltip,
  sheet,
  carousel,
  list,
  buttongroup,
  splitbutton,
  fabmenu,
  toolbar,
  progress,
  loadingindicator,
};
