#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Generates anatomy tests: each component page's Anatomy section lists the
 * component's parts ("1. Container 2. Label text 3. Icon ..."); the test for
 * a part renders the component and checks that it exposes that part, as an
 * element, a `part`, a class, a slot or a pseudo-element, whichever
 * ANATOMY maps it to. The tests cite the part's list-item units (the Specs
 * and the Guidelines copy of the list).
 *
 * Parts gb doesn't have go to `<dir>_anatomy_gap.ts` (red tests that look for
 * the hook the part would have; not run in the main suite, run with
 * `npm run gb:check -- --gaps <dir>`); the rest go to
 * `<dir>_anatomy_test.ts`.
 *
 *   node scripts/m3/gen-anatomy-tests.mjs            # all components
 *   node scripts/m3/gen-anatomy-tests.mjs switch     # one
 *   node scripts/m3/gen-anatomy-tests.mjs --check    # fail if out of date
 *
 * A listed part that ANATOMY doesn't map fails the run, so a new spec part
 * never goes unnoticed. Pages with an anatomy list but no ANATOMY entry are
 * listed in the report.
 */

import {pathToFileURL} from 'node:url';
import {
  componentPath,
  emit,
  header,
  loadUnits,
  pruneHelpers,
  TS_HELPERS,
  tsString,
} from './gen-dom-lib.mjs';

/**
 * Per component directory:
 * - imports: side-effect modules, relative to the component directory.
 * - pages: one per spec page that lists anatomy parts, with
 *   - page: spec page slug (`.m3-specs/pages/components/<page>.md`);
 *   - section: regexp source the anatomy list items' unit section must match
 *     (default `/anatomy$`);
 *   - host: the component's tag;
 *   - base: default markup;
 *   - parts: `{[normalized part name]: part}`; the key is the spec's list
 *     item lowercased without its "(optional)" remark; `names` adds other
 *     keys for the same part.
 *
 * A part:
 * - el: where it is, as a chain of selectors relative to the host: `''` is
 *   the host, `button` its shadow root's button, `a >> b` goes through
 *   another shadow root, `light:x` queries light DOM (see `find()` in
 *   gen-dom-lib.mjs).
 * - pseudo: the part is a pseudo-element of `el` (`::before`); it must
 *   generate content.
 * - assigned: `el` is a slot, and the markup must put content in it.
 * - present: only check that the element exists (it is not rendered while
 *   the component is closed, e.g. a dialog whose `::backdrop` is the scrim).
 * - markup: replaces the page's base markup (an optional part needs its
 *   state: the icon slotted, the badge with a value).
 * - gap: reason string; gb has no such part. `el` is then the hook the part
 *   would have, and the test is red until it exists.
 * - skip: reason string; the part is not a component part (e.g. text
 *   content a consumer supplies); listed in the report, not tested.
 */
const LIST = (extra = '') => `<md-gb-list><md-gb-list-item>Item${extra}</md-gb-list-item></md-gb-list>`;
const MENU = (extra = '') => `<md-gb-menu open><md-gb-menu-item>Item${extra}</md-gb-menu-item></md-gb-menu>`;
const NAVBAR = (attrs = '') => `<md-gb-nav-bar><md-gb-nav-bar-item label="Home"${attrs}><md-gb-icon slot="icon">home</md-gb-icon></md-gb-nav-bar-item></md-gb-nav-bar>`;
const NAVRAIL = (attrs = '') => `<md-gb-nav-rail><md-gb-nav-rail-item label="Home"${attrs}><md-gb-icon slot="icon">home</md-gb-icon></md-gb-nav-rail-item></md-gb-nav-rail>`;
const NAVDRAWER = (attrs = '') => `<md-gb-nav-drawer open aria-label="Mail"><md-gb-nav-drawer-item${attrs}><md-gb-icon slot="icon">inbox</md-gb-icon>Inbox</md-gb-nav-drawer-item></md-gb-nav-drawer>`;
const TABS = (icon = '') => `<md-gb-tabs aria-label="Trips"><md-gb-tab>${icon}<span slot="label">Flights</span></md-gb-tab></md-gb-tabs>`;

const CAROUSEL = '<md-gb-carousel layout="multi-browse" style="width: 400px"><md-gb-carousel-item label="One">A</md-gb-carousel-item><md-gb-carousel-item label="Two">B</md-gb-carousel-item><md-gb-carousel-item label="Three">C</md-gb-carousel-item></md-gb-carousel>';
const TIMEPICKER_INPUT = '<md-gb-time-picker hour-cycle="12" mode="input"></md-gb-time-picker>';

export const ANATOMY = {
  switch: {
    imports: ['./md-gb-switch.js', '../../styles/icon/md-gb-icon.js'],
    pages: [
      {
        page: 'switch',
        host: 'md-gb-switch',
        base: '<md-gb-switch></md-gb-switch>',
        parts: {
          'track': {el: 'button'},
          'handle': {el: 'button', pseudo: '::before'},
          'icon': {markup: '<md-gb-switch selected><md-gb-icon slot="on-icon">check</md-gb-icon></md-gb-switch>', el: 'slot[name=on-icon]', assigned: true},
        },
      },
    ],
  },
  button: {
    imports: ['./md-gb-button.js', '../../styles/icon/md-gb-icon.js'],
    pages: [
      {
        page: 'buttons',
        host: 'md-gb-button',
        base: '<md-gb-button>Label</md-gb-button>',
        parts: {
          'container': {el: '[part=btn]'},
          'label text': {el: 'slot:not([name])', assigned: true},
          'icon': {markup: '<md-gb-button><md-gb-icon>add</md-gb-icon>Label</md-gb-button>', el: 'slot:not([name])', assigned: true},
        },
      },
    ],
  },
  iconbutton: {
    imports: ['./md-gb-icon-button.js', '../../styles/icon/md-gb-icon.js'],
    pages: [
      {
        page: 'icon-buttons',
        host: 'md-gb-icon-button',
        base: '<md-gb-icon-button><md-gb-icon>add</md-gb-icon></md-gb-icon-button>',
        parts: {
          'container': {el: '[part=icon-btn]'},
          'icon': {el: 'slot:not([name])', assigned: true},
        },
      },
    ],
  },
  fab: {
    imports: ['./md-gb-fab.js', '../../styles/icon/md-gb-icon.js'],
    pages: [
      {
        page: 'floating-action-button',
        label: 'FAB',
        host: 'md-gb-fab',
        base: '<md-gb-fab><md-gb-icon>add</md-gb-icon></md-gb-fab>',
        parts: {
          'container': {el: '[part=fab]'},
          'icon': {el: 'slot:not([name])', assigned: true},
        },
      },
      {
        page: 'extended-fab',
        label: 'extended FAB',
        host: 'md-gb-fab',
        base: '<md-gb-fab label="Create"><md-gb-icon>add</md-gb-icon></md-gb-fab>',
        parts: {
          'container': {el: '[part=fab]'},
          'label text': {el: '[part=label]'},
          'icon': {el: 'slot:not([name])', assigned: true},
        },
      },
    ],
  },
  checkbox: {
    imports: ['./md-gb-checkbox.js'],
    pages: [
      {
        page: 'checkbox',
        host: 'md-gb-checkbox',
        base: '<md-gb-checkbox></md-gb-checkbox>',
        parts: {
          'container': {el: 'input', pseudo: '::before'},
          'icon': {markup: '<md-gb-checkbox checked></md-gb-checkbox>', el: 'input', pseudo: '::before'},
        },
      },
    ],
  },
  radio: {
    imports: ['./md-gb-radio.js'],
    pages: [
      {
        page: 'radio-button',
        host: 'md-gb-radio',
        base: '<md-gb-radio></md-gb-radio>',
        parts: {
          'selected icon': {markup: '<md-gb-radio checked></md-gb-radio>', el: '[part=radio]', pseudo: '::before'},
          'unselected icon': {el: '[part=radio]', pseudo: '::before'},
          'adjacent label text': {skip: 'the label is an adjacent <label> the consumer supplies; the radio is the control only'},
        },
      },
    ],
  },
  chip: {
    imports: ['./md-gb-chip.js', '../../styles/icon/md-gb-icon.js'],
    pages: [
      {
        page: 'chips',
        host: 'md-gb-chip',
        base: '<md-gb-chip type="filter">Label</md-gb-chip>',
        parts: {
          'container': {el: '[part=chip]'},
          'label text': {el: '.chip-label slot', assigned: true},
          'leading icon or image': {markup: '<md-gb-chip type="filter">Label<md-gb-icon slot="icon">star</md-gb-icon></md-gb-chip>', el: 'slot[name=icon]', assigned: true},
          'trailing icon': {markup: '<md-gb-chip type="filter">Label<md-gb-icon slot="trailing-icon">arrow_drop_down</md-gb-icon></md-gb-chip>', el: 'slot[name=trailing-icon]', assigned: true},
        },
      },
    ],
  },
  card: {
    imports: ['./md-gb-card.js'],
    pages: [
      {
        page: 'cards',
        host: 'md-gb-card',
        base: '<md-gb-card>Content</md-gb-card>',
        parts: {
          'container': {el: '[part=card]'},
          'image': {skip: 'card content is slotted by the consumer; the card has no structural hook for it'},
          'button': {skip: 'card actions are slotted buttons; the card has no structural hook for them'},
          'supporting text': {skip: 'card content is slotted by the consumer; the card has no structural hook for it'},
          'subhead': {skip: 'card content is slotted by the consumer; the card has no structural hook for it'},
          'headline': {skip: 'card content is slotted by the consumer; the card has no structural hook for it'},
        },
      },
    ],
  },
  badge: {
    imports: ['./md-gb-badge.js'],
    pages: [
      {
        page: 'badges',
        host: 'md-gb-badge',
        base: '<md-gb-badge></md-gb-badge>',
        parts: {
          'small badge': {el: '[part=badge]:not(.badge-large)'},
          'large badge container': {markup: '<md-gb-badge value="3"></md-gb-badge>', el: '[part=badge].badge-large'},
          'large badge label': {markup: '<md-gb-badge>3</md-gb-badge>', el: '[part=badge].badge-large slot', assigned: true},
        },
      },
    ],
  },
  divider: {
    imports: ['./md-gb-divider.js'],
    pages: [
      {
        page: 'divider',
        host: 'md-gb-divider',
        base: '<md-gb-divider></md-gb-divider>',
        parts: {
          'divider': {el: '[part=divider]'},
        },
      },
    ],
  },
  slider: {
    imports: ['./md-gb-slider.js', '../../styles/icon/md-gb-icon.js'],
    pages: [
      {
        page: 'sliders',
        host: 'md-gb-slider',
        base: '<md-gb-slider value="50"></md-gb-slider>',
        parts: {
          'value indicator': {markup: '<md-gb-slider value="50" labeled></md-gb-slider>', el: '.slider-handle .slider-label'},
          'stop indicators': {el: '.slider-boundary-stop'},
          'active track': {el: '.slider-active'},
          'handle': {el: '.slider-handle-nub'},
          'inactive track': {el: '.slider-inactive-trail'},
          'inset icon': {markup: '<md-gb-slider size="md" value="50"><md-gb-icon slot="icon">volume_up</md-gb-icon></md-gb-slider>', el: '.slider-icon slot[name=icon]', assigned: true},
        },
      },
    ],
  },
  segmentedbutton: {
    imports: ['./md-gb-segmented-button-set.js', './md-gb-segmented-button.js', '../../styles/icon/md-gb-icon.js'],
    pages: [
      {
        page: 'segmented-buttons',
        host: 'md-gb-segmented-button-set',
        base: '<md-gb-segmented-button-set aria-label="View"><md-gb-segmented-button label="Day"></md-gb-segmented-button></md-gb-segmented-button-set>',
        parts: {
          'segment': {el: 'light:md-gb-segmented-button >> button'},
          'container': {el: ''},
          'icon': {markup: '<md-gb-segmented-button-set aria-label="View"><md-gb-segmented-button label="Day"><md-gb-icon slot="icon">star</md-gb-icon></md-gb-segmented-button></md-gb-segmented-button-set>', el: 'light:md-gb-segmented-button >> slot[name=icon]', assigned: true},
          'label text': {el: 'light:md-gb-segmented-button >> .segmented-button-label'},
          'selected icon': {markup: '<md-gb-segmented-button-set aria-label="View"><md-gb-segmented-button label="Day" selected></md-gb-segmented-button></md-gb-segmented-button-set>', el: 'light:md-gb-segmented-button >> .segmented-button-checkmark'},
        },
      },
    ],
  },
  appbar: {
    imports: ['./md-gb-app-bar.js', '../iconbutton/md-gb-icon-button.js', '../../styles/icon/md-gb-icon.js'],
    pages: [
      {
        page: 'app-bars',
        host: 'md-gb-app-bar',
        base: '<md-gb-app-bar>Title</md-gb-app-bar>',
        parts: {
          'container': {el: '[part=app-bar]'},
          'leading button': {markup: '<md-gb-app-bar>Title<md-gb-icon-button slot="leading"><md-gb-icon>menu</md-gb-icon></md-gb-icon-button></md-gb-app-bar>', el: 'slot[name=leading]', assigned: true},
          'trailing elements': {markup: '<md-gb-app-bar>Title<md-gb-icon-button slot="trailing"><md-gb-icon>search</md-gb-icon></md-gb-icon-button></md-gb-app-bar>', el: 'slot[name=trailing]', assigned: true},
          'trailing icons': {markup: '<md-gb-app-bar>Title<md-gb-icon-button slot="trailing"><md-gb-icon>search</md-gb-icon></md-gb-icon-button></md-gb-app-bar>', el: 'slot[name=trailing]', assigned: true},
          'headline': {el: '.app-bar-title slot', assigned: true},
          'subtitle': {markup: '<md-gb-app-bar>Title<span slot="subtitle">Subtitle</span></md-gb-app-bar>', el: 'slot[name=subtitle]', assigned: true},
          'a subtitle': {markup: '<md-gb-app-bar>Title<span slot="subtitle">Subtitle</span></md-gb-app-bar>', el: 'slot[name=subtitle]', assigned: true},
          'an image or logo': {skip: 'an image or logo is consumer content placed in the title or leading slot'},
          'a filled icon button': {skip: 'an icon button of any color is placed in the leading or trailing slot (tested as those parts)'},
        },
      },
    ],
  },
  buttongroup: {
    imports: ['./md-gb-button-group.js', '../button/md-gb-button.js'],
    pages: [
      {
        page: 'button-groups',
        host: 'md-gb-button-group',
        base: '<md-gb-button-group aria-label="Format"><md-gb-button>One</md-gb-button><md-gb-button>Two</md-gb-button></md-gb-button-group>',
        parts: {
          'container': {el: ''},
        },
      },
    ],
  },
  fabmenu: {
    imports: ['./md-gb-fab-menu.js', './md-gb-fab-menu-item.js', '../../styles/icon/md-gb-icon.js'],
    pages: [
      {
        page: 'fab-menu',
        host: 'md-gb-fab-menu',
        base: '<md-gb-fab-menu open><md-gb-fab-menu-item>One</md-gb-fab-menu-item></md-gb-fab-menu>',
        parts: {
          'close button': {el: '[part=button] .fab-menu-button-close-icon'},
          'menu item': {el: 'light:md-gb-fab-menu-item >> [part=item]'},
          'list item': {el: 'light:md-gb-fab-menu-item >> [part=item]'},
        },
      },
    ],
  },
  loadingindicator: {
    imports: ['./md-gb-loading-indicator.js'],
    pages: [
      {
        page: 'loading-indicator',
        host: 'md-gb-loading-indicator',
        base: '<md-gb-loading-indicator contained></md-gb-loading-indicator>',
        parts: {
          'active indicator': {el: '.loading-indicator-shape'},
          'container': {el: '[part=indicator]'},
        },
      },
    ],
  },
  progress: {
    imports: ['./md-gb-progress.js'],
    pages: [
      {
        page: 'progress-indicators',
        host: 'md-gb-progress',
        base: '<md-gb-progress value="0.5"></md-gb-progress>',
        parts: {
          'active indicator': {el: '.progress-active'},
          'track': {el: '.progress-track-1'},
          'stop indicator': {el: '.progress-stop'},
        },
      },
    ],
  },
  splitbutton: {
    imports: ['./md-gb-split-button.js', '../../styles/icon/md-gb-icon.js'],
    pages: [
      {
        page: 'split-button',
        host: 'md-gb-split-button',
        base: '<md-gb-split-button><button slot="leading">Save</button><button slot="trailing" aria-label="More"><md-gb-icon>arrow_drop_down</md-gb-icon></button></md-gb-split-button>',
        parts: {
          'leading button': {el: '[part=leading-btn]'},
          'icon': {markup: '<md-gb-split-button><button slot="leading"><md-gb-icon>add</md-gb-icon></button><button slot="trailing" aria-label="More">v</button></md-gb-split-button>', el: 'slot[name=leading]', assigned: true},
          'label text': {el: 'slot[name=leading]', assigned: true},
          'label': {el: 'slot[name=leading]', assigned: true},
          'label + icon': {markup: '<md-gb-split-button><button slot="leading"><md-gb-icon>add</md-gb-icon>Save</button><button slot="trailing" aria-label="More">v</button></md-gb-split-button>', el: 'slot[name=leading]', assigned: true},
          'trailing button': {el: '[part=trailing-btn]'},
        },
      },
    ],
  },
  toolbar: {
    imports: ['./md-gb-toolbar.js', '../iconbutton/md-gb-icon-button.js', '../../styles/icon/md-gb-icon.js'],
    pages: [
      {
        page: 'toolbars',
        host: 'md-gb-toolbar',
        base: '<md-gb-toolbar><md-gb-icon-button><md-gb-icon>edit</md-gb-icon></md-gb-icon-button></md-gb-toolbar>',
        parts: {
          'container': {el: '[part=toolbar]'},
          'placed components': {el: 'slot:not([name])', assigned: true},
          'elements': {el: 'slot:not([name])', assigned: true},
        },
      },
    ],
  },
  list: {
    imports: ['./md-gb-list.js', './md-gb-list-item.js', '../../styles/icon/md-gb-icon.js', '../divider/md-gb-divider.js'],
    pages: [
      {
        page: 'lists',
        host: 'md-gb-list',
        base: LIST(),
        parts: {
          'container': {el: 'light:md-gb-list-item >> [part=list-item]'},
          'overline': {markup: LIST('<span slot="overline">Overline</span>'), el: 'light:md-gb-list-item >> slot[name=overline]', assigned: true},
          'label text': {el: 'light:md-gb-list-item >> slot:not([name])', assigned: true},
          'trailing text': {markup: LIST('<span slot="trailing-text">100+</span>'), el: 'light:md-gb-list-item >> slot[name=trailing-text]', assigned: true},
          'supporting text': {markup: LIST('<span slot="supporting-text">Supporting</span>'), el: 'light:md-gb-list-item >> slot[name=supporting-text]', assigned: true},
          'trailing icon': {markup: LIST('<md-gb-icon slot="trailing">star</md-gb-icon>'), el: 'light:md-gb-list-item >> slot[name=trailing]', assigned: true},
          'divider': {markup: '<md-gb-list><md-gb-list-item>Item</md-gb-list-item><md-gb-divider></md-gb-divider><md-gb-list-item>Item</md-gb-list-item></md-gb-list>', el: 'light:md-gb-divider'},
          'leading avatar': {markup: LIST('<img slot="avatar" alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=">'), el: 'light:md-gb-list-item >> slot[name=avatar]', assigned: true},
          'leading avatar container': {markup: LIST('<img slot="avatar" alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=">'), el: 'light:md-gb-list-item >> slot[name=avatar]', assigned: true},
          'leading avatar text': {markup: LIST('<span slot="avatar">A</span>'), el: 'light:md-gb-list-item >> slot[name=avatar]', assigned: true},
          'leading icon': {markup: LIST('<md-gb-icon slot="leading">star</md-gb-icon>'), el: 'light:md-gb-list-item >> slot[name=leading]', assigned: true},
          'leading media - image or video': {markup: LIST('<img slot="leading" alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=">'), el: 'light:md-gb-list-item >> slot[name=leading]', assigned: true},
          'trailing selection control - checkbox, radio button, switch': {markup: LIST('<input slot="trailing" type="checkbox" aria-label="Select">'), el: 'light:md-gb-list-item >> slot[name=trailing]', assigned: true},
        },
      },
    ],
  },
  menu: {
    imports: ['./md-gb-menu.js', './md-gb-menu-item.js', './md-gb-menu-group.js', '../divider/md-gb-divider.js', '../badge/md-gb-badge.js', '../../styles/icon/md-gb-icon.js'],
    pages: [
      {
        page: 'menus',
        host: 'md-gb-menu',
        base: MENU(),
        parts: {
          'list item': {el: 'light:md-gb-menu-item >> [part=menu-item]'},
          'menu item': {el: 'light:md-gb-menu-item >> [part=menu-item]'},
          'list item leading icon': {markup: MENU('<md-gb-icon slot="leading">star</md-gb-icon>'), el: 'light:md-gb-menu-item >> slot[name=leading]', assigned: true},
          'leading icon': {markup: MENU('<md-gb-icon slot="leading">star</md-gb-icon>'), el: 'light:md-gb-menu-item >> slot[name=leading]', assigned: true},
          'list item trailing icon': {markup: MENU('<md-gb-icon slot="trailing">star</md-gb-icon>'), el: 'light:md-gb-menu-item >> slot[name=trailing]', assigned: true},
          'trailing icon': {markup: MENU('<md-gb-icon slot="trailing">star</md-gb-icon>'), el: 'light:md-gb-menu-item >> slot[name=trailing]', assigned: true},
          'container': {el: '[part=menu]'},
          'list item trailing text': {markup: MENU('<span slot="trailing-text">Ctrl+C</span>'), el: 'light:md-gb-menu-item >> slot[name=trailing-text]', assigned: true},
          'trailing text': {markup: MENU('<span slot="trailing-text">Ctrl+C</span>'), el: 'light:md-gb-menu-item >> slot[name=trailing-text]', assigned: true},
          'divider': {markup: '<md-gb-menu open><md-gb-menu-item>One</md-gb-menu-item><md-gb-divider></md-gb-divider><md-gb-menu-item>Two</md-gb-menu-item></md-gb-menu>', el: 'slot', assigned: true},
          'menu item text': {el: 'light:md-gb-menu-item >> slot:not([name])', assigned: true},
          'badge': {markup: MENU('<md-gb-badge slot="trailing" value="3"></md-gb-badge>'), el: 'light:md-gb-menu-item >> slot[name=trailing]', assigned: true},
          'supporting text': {markup: MENU('<span slot="supporting-text">Supporting</span>'), el: 'light:md-gb-menu-item >> slot[name=supporting-text]', assigned: true},
          'label text': {markup: '<md-gb-menu open><md-gb-menu-group label="Group"><md-gb-menu-item>One</md-gb-menu-item></md-gb-menu-group></md-gb-menu>', el: 'light:md-gb-menu-group >> [part=label]'},
          'gap': {markup: '<md-gb-menu open><md-gb-menu-group label="Group"><md-gb-menu-item>One</md-gb-menu-item></md-gb-menu-group><md-gb-menu-group label="Two"><md-gb-menu-item>Two</md-gb-menu-item></md-gb-menu-group></md-gb-menu>', el: 'light:md-gb-menu-group >> [part=group]'},
        },
      },
    ],
  },
  navbar: {
    imports: ['./md-gb-nav-bar.js', './md-gb-nav-bar-item.js', '../../styles/icon/md-gb-icon.js'],
    pages: [
      {
        page: 'navigation-bar',
        host: 'md-gb-nav-bar',
        base: NAVBAR(),
        parts: {
          'container': {el: '[part=nav-bar]'},
          'icon': {el: 'light:md-gb-nav-bar-item >> slot[name=icon]', assigned: true},
          'label text': {el: 'light:md-gb-nav-bar-item >> [part=label]'},
          'active indicator': {el: 'light:md-gb-nav-bar-item >> [part=indicator]'},
          'small badge': {markup: NAVBAR(' badge="dot"'), el: 'light:md-gb-nav-bar-item >> .nav-bar-item-badge'},
          'large badge': {markup: NAVBAR(' badge="3"'), el: 'light:md-gb-nav-bar-item >> .nav-bar-item-badge'},
          'large badge label': {markup: NAVBAR(' badge="3"'), el: 'light:md-gb-nav-bar-item >> .nav-bar-item-badge'},
        },
      },
    ],
  },
  navrail: {
    imports: ['./md-gb-nav-rail.js', './md-gb-nav-rail-item.js', '../fab/md-gb-fab.js', '../../styles/icon/md-gb-icon.js'],
    pages: [
      {
        page: 'navigation-rail',
        host: 'md-gb-nav-rail',
        base: NAVRAIL(),
        parts: {
          'container': {el: '[part=nav-rail]'},
          'menu': {markup: '<md-gb-nav-rail collapsible><md-gb-nav-rail-item label="Home"><md-gb-icon slot="icon">home</md-gb-icon></md-gb-nav-rail-item></md-gb-nav-rail>', el: '[part=menu-button]'},
          'fab or extended fab': {markup: '<md-gb-nav-rail><md-gb-fab slot="header"><md-gb-icon>edit</md-gb-icon></md-gb-fab><md-gb-nav-rail-item label="Home"><md-gb-icon slot="icon">home</md-gb-icon></md-gb-nav-rail-item></md-gb-nav-rail>', el: 'slot[name=header]', assigned: true},
          'floating action button': {markup: '<md-gb-nav-rail><md-gb-fab slot="header"><md-gb-icon>edit</md-gb-icon></md-gb-fab><md-gb-nav-rail-item label="Home"><md-gb-icon slot="icon">home</md-gb-icon></md-gb-nav-rail-item></md-gb-nav-rail>', el: 'slot[name=header]', assigned: true},
          'icon': {el: 'light:md-gb-nav-rail-item >> slot[name=icon]', assigned: true},
          'icon - active': {markup: NAVRAIL(' selected'), el: 'light:md-gb-nav-rail-item >> slot[name=icon]', assigned: true},
          'icon - inactive': {el: 'light:md-gb-nav-rail-item >> slot[name=icon]', assigned: true},
          'active indicator': {el: 'light:md-gb-nav-rail-item >> [part=indicator]'},
          'label text': {el: 'light:md-gb-nav-rail-item >> [part=label]'},
          'label text - active': {markup: NAVRAIL(' selected'), el: 'light:md-gb-nav-rail-item >> [part=label]'},
          'label text - inactive': {el: 'light:md-gb-nav-rail-item >> [part=label]'},
          'large badge': {markup: NAVRAIL(' badge="3"'), el: 'light:md-gb-nav-rail-item >> .nav-rail-item-badge'},
          'large badge label': {markup: NAVRAIL(' badge="3"'), el: 'light:md-gb-nav-rail-item >> .nav-rail-item-badge'},
          'small badge': {markup: NAVRAIL(' badge="dot"'), el: 'light:md-gb-nav-rail-item >> .nav-rail-item-badge'},
        },
      },
    ],
  },
  navdrawer: {
    imports: ['./md-gb-nav-drawer.js', './md-gb-nav-drawer-item.js', '../divider/md-gb-divider.js', '../../styles/icon/md-gb-icon.js'],
    pages: [
      {
        page: 'navigation-drawer',
        host: 'md-gb-nav-drawer',
        base: NAVDRAWER(),
        parts: {
          'active indicator': {el: 'light:md-gb-nav-drawer-item >> [part=item]'},
          'icon': {el: 'light:md-gb-nav-drawer-item >> [part=icon]'},
          'label': {el: 'light:md-gb-nav-drawer-item >> [part=label]'},
          'badge label': {markup: NAVDRAWER(' badge="12"'), el: 'light:md-gb-nav-drawer-item >> [part=badge]'},
          'sheet': {el: '[part=drawer]'},
          'divider': {markup: '<md-gb-nav-drawer open aria-label="Mail"><md-gb-nav-drawer-item>Inbox</md-gb-nav-drawer-item><md-gb-divider></md-gb-divider></md-gb-nav-drawer>', el: 'light:md-gb-divider'},
          'section label': {markup: '<md-gb-nav-drawer open aria-label="Mail"><h3 class="nav-drawer-section-label">Labels</h3><md-gb-nav-drawer-item>Inbox</md-gb-nav-drawer-item></md-gb-nav-drawer>', el: 'light:.nav-drawer-section-label'},
          'scrim': {markup: '<md-gb-nav-drawer modal open aria-label="Mail"><md-gb-nav-drawer-item>Inbox</md-gb-nav-drawer-item></md-gb-nav-drawer>', el: '[part=scrim]'},
        },
      },
    ],
  },
  carousel: {
    imports: ['./md-gb-carousel.js', './md-gb-carousel-item.js'],
    pages: [
      {
        page: 'carousel',
        host: 'md-gb-carousel',
        base: CAROUSEL,
        parts: {
          'container': {el: '[part=carousel]'},
          'large carousel item': {el: 'light:md-gb-carousel-item >> [part=item]'},
          'medium carousel item': {el: 'light:md-gb-carousel-item >> [part=item]'},
          'small carousel item': {el: 'light:md-gb-carousel-item >> [part=item]'},
        },
      },
    ],
  },
  timepicker: {
    imports: ['./md-gb-time-picker.js'],
    pages: [
      {
        page: 'time-pickers',
        section: '/anatomy(/time-picker-(dial|input))?$',
        host: 'md-gb-time-picker',
        base: '<md-gb-time-picker hour-cycle="12"></md-gb-time-picker>',
        parts: {
          'container': {el: '[part=container]'},
          'headline': {el: '[part=headline]', names: ['label']},
          'time selector container': {el: '.time-picker-selector'},
          'time selector label text': {el: '.time-picker-selector'},
          'time selector separator': {el: '.time-picker-separator', names: ['time input field seperator']},
          'period selector container': {el: '.time-picker-period', names: ['period selector', 'period selector outline']},
          'period selector label text': {el: '.time-picker-period-button', names: ['period selector text']},
          'clock dial container': {el: '[part=dial]', names: ['clock dial']},
          'clock dial label text': {el: '.time-picker-dial-label', names: ['dial label']},
          'clock dial selector container': {el: '.time-picker-dial-handle'},
          'clock dial selector track': {el: '.time-picker-dial-track', names: ['dial selector track']},
          'clock dial selector center': {el: '.time-picker-dial-center'},
          'text button': {el: '.time-picker-confirm', names: ['text buttons']},
          'icon button': {el: '.time-picker-mode-toggle'},
          'time input field container': {markup: TIMEPICKER_INPUT, el: '.time-picker-field', names: ['input field']},
          'time input field label text': {markup: TIMEPICKER_INPUT, el: '.time-picker-field-input', names: ['input text']},
          'time input field supporting text': {markup: TIMEPICKER_INPUT, el: '.time-picker-field-label'},
        },
      },
    ],
  },
  tabs: {
    imports: ['./md-gb-tabs.js', './md-gb-tab.js', '../../styles/icon/md-gb-icon.js'],
    pages: [
      {
        page: 'tabs',
        host: 'md-gb-tabs',
        base: TABS(),
        parts: {
          'container': {el: ''},
          'icon': {markup: TABS('<md-gb-icon>flight</md-gb-icon>'), el: 'light:md-gb-tab >> slot:not([name])', assigned: true},
          'badge': {markup: TABS('<span slot="badge">3</span>'), el: 'light:md-gb-tab >> slot[name=badge]', assigned: true},
          'label': {el: 'light:md-gb-tab >> slot[name=label]', assigned: true},
          // The tabs element has no shadow root: it draws the divider as its
          // bottom border and the active indicator as its ::after.
          'divider': {el: ''},
          'active indicator': {el: '', pseudo: '::after'},
        },
      },
    ],
  },
  snackbar: {
    imports: ['./md-gb-snackbar.js'],
    pages: [
      {
        page: 'snackbar',
        host: 'md-gb-snackbar',
        base: '<md-gb-snackbar open label-text="Saved" action-label="Undo" has-close-button></md-gb-snackbar>',
        parts: {
          'container': {el: '[part=surface]'},
          'supporting text': {el: '[part=label]'},
          'action': {el: '[part=actions] button'},
          'close button': {el: '[part=actions] button'},
        },
      },
    ],
  },
  search: {
    imports: ['./md-gb-search-bar.js', '../iconbutton/md-gb-icon-button.js', '../../styles/icon/md-gb-icon.js'],
    pages: [
      {
        page: 'search',
        host: 'md-gb-search-bar',
        base: '<md-gb-search-bar placeholder="Search"></md-gb-search-bar>',
        parts: {
          'search bar container': {el: '[part=bar]'},
          'leading icon': {el: 'slot[name=leading]'},
          'supporting text': {el: '[part=input]'},
          'input text': {el: '[part=input]'},
          'trailing icon and avatar': {markup: '<md-gb-search-bar placeholder="Search"><md-gb-icon-button slot="trailing"><md-gb-icon>mic</md-gb-icon></md-gb-icon-button></md-gb-search-bar>', el: 'slot[name=trailing]', assigned: true},
          'avatar or trailing icon': {markup: '<md-gb-search-bar placeholder="Search"><md-gb-icon-button slot="trailing"><md-gb-icon>mic</md-gb-icon></md-gb-icon-button></md-gb-search-bar>', el: 'slot[name=trailing]', assigned: true},
          'container for search suggestions or results': {el: '[part=view]'},
        },
      },
    ],
  },
  sheet: {
    imports: ['./md-gb-bottom-sheet.js', './md-gb-side-sheet.js', '../../styles/icon/md-gb-icon.js'],
    pages: [
      {
        page: 'bottom-sheets',
        label: 'bottom sheet',
        host: 'md-gb-bottom-sheet',
        base: '<md-gb-bottom-sheet>Content</md-gb-bottom-sheet>',
        parts: {
          'container': {el: '[part=container]'},
          'drag handle': {el: '[part=drag-handle]'},
          'scrim': {el: '[part=dialog]', present: true},
        },
      },
      {
        page: 'side-sheets',
        label: 'side sheet',
        host: 'md-gb-side-sheet',
        base: '<md-gb-side-sheet headline="Title" divider has-back-button>Content<button slot="actions">Save</button></md-gb-side-sheet>',
        parts: {
          'divider': {el: '[part=header]'},
          'headline': {el: '[part=headline]'},
          'container': {el: '[part=container]'},
          'close icon button': {el: '[part=header] button'},
          'back icon button': {el: '[part=header] button'},
          'action buttons': {el: 'slot[name=actions]', assigned: true},
          'scrim': {el: '[part=dialog]', present: true},
        },
      },
    ],
  },
};

/** The part name a list item stands for: lowercase, no remark in parentheses. */
export function normalize(text) {
  return text
    .toLowerCase()
    .replace(/\s*\(.*$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function caseSource(page, key, part, ids, label) {
  const markup = part.markup ?? page.base;
  const chain = [page.host, part.el].filter(Boolean).join(' >> ');
  const args = [tsString(chain)];
  if (part.pseudo || part.assigned || part.present) args.push(tsString(part.pseudo ?? ''));
  if (part.assigned || part.present) args.push(String(Boolean(part.assigned)));
  if (part.present) args.push('true');
  return `  // spec: ${ids.join(', ')}
  it(${tsString(`exposes the ${label}`)}, async () => {
    await mount(${tsString(markup)});
    expectPart(${args.join(', ')});
  });`;
}

const HELPERS = String.raw`/**
 * The component exposes a part: the element exists and is rendered, or the
 * pseudo-element generates content, or the slot has assigned content.
 */
function expectPart(chain: string, pseudo = '', assigned = false, present = false) {
  const el = find(chain);
  expect(el).withContext('no element for ' + chain).not.toBeNull();
  if (!el) return;
  if (pseudo) {
    const content = getComputedStyle(el, pseudo).content;
    expect(content).withContext(chain + pseudo + ' content').not.toBe('none');
    expect(content).withContext(chain + pseudo + ' content').not.toBe('normal');
  } else if (assigned) {
    expect((el as HTMLSlotElement).assignedNodes({flatten: true}).length).withContext(chain + ' assigned nodes').toBeGreaterThan(0);
  } else if (!present && !(el instanceof HTMLSlotElement)) {
    expect(getComputedStyle(el).display).withContext(chain + ' display').not.toBe('none');
  }
}
`;

function fileText(dir, config, cases, gap) {
  const what = gap
    ? "Anatomy gaps: parts the spec's Anatomy lists that the component does not expose yet. Red until it does; run with `npm run gb:check -- --gaps`."
    : "Anatomy tests: the component exposes each part its spec page's Anatomy lists.";
  const host = config.pages[0].host;
  return pruneHelpers(`${header('gen-anatomy-tests.mjs', dir, 'anatomy', what)}
// import 'jasmine'; (google3-only)
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
${config.imports.map((m) => `import '${m}';`).join('\n')}
import type {ReactiveElement} from 'lit';

adoptStyles(document, [m3Styles]);

${TS_HELPERS}
${HELPERS}
describe('<${host}> anatomy${gap ? ' (gaps)' : ''}', () => {
${cases.join('\n\n')}
});
`);
}

async function resolve(dir, config) {
  const units = await loadUnits();
  const tested = [];
  const gaps = [];
  const skipped = [];
  for (const page of config.pages) {
    const items = units.filter(
      (u) => u.page === `components/${page.page}.md` && u.kind === 'list-item' && new RegExp(page.section ?? '/anatomy$').test(u.section),
    );
    if (!items.length) throw new Error(`${dir}: no anatomy list items on ${page.page}`);
    const byKey = new Map();
    for (const [key, part] of Object.entries(page.parts)) {
      byKey.set(key, {key, part, ids: [], texts: []});
      for (const alias of part.names ?? []) byKey.set(alias, byKey.get(key));
    }
    const unmapped = [];
    for (const u of items) {
      const entry = byKey.get(normalize(u.text));
      if (!entry) unmapped.push(u.text);
      else {
        entry.ids.push(u.id);
        entry.texts.push(u.text);
      }
    }
    if (unmapped.length) {
      throw new Error(`${dir} (${page.page}): anatomy parts not in ANATOMY: ${[...new Set(unmapped)].join(', ')}`);
    }
    for (const entry of new Set(byKey.values())) {
      if (!entry.ids.length) throw new Error(`${dir} (${page.page}): part "${entry.key}" is not in the spec's anatomy list`);
      const label = entry.texts[0].replace(/\s*\(.*$/, '').toLowerCase() + (page.label ? ` (${page.label})` : '');
      if (entry.part.skip) {
        skipped.push(`${page.page}: ${entry.texts[0]} (${entry.part.skip})`);
        continue;
      }
      const source = caseSource(page, entry.key, entry.part, [...new Set(entry.ids)], label);
      (entry.part.gap ? gaps : tested).push(source);
    }
  }
  return {tested, gaps, skipped};
}

export async function main(argv) {
  const check = argv.includes('--check');
  const only = argv.filter((a) => !a.startsWith('--'));
  const units = await loadUnits();
  let stale = false;
  const report = [];
  for (const [dir, config] of Object.entries(ANATOMY).sort(([a], [b]) => a.localeCompare(b))) {
    if (only.length && !only.includes(dir)) continue;
    const {tested, gaps, skipped} = await resolve(dir, config);
    stale = (await emit(componentPath(dir, `${dir}_anatomy_test.ts`), tested.length ? fileText(dir, config, tested, false) : null, check)) || stale;
    stale = (await emit(componentPath(dir, `${dir}_anatomy_gap.ts`), gaps.length ? fileText(dir, config, gaps, true) : null, check)) || stale;
    report.push(`${dir}: ${tested.length} tests, ${gaps.length} gap, ${skipped.length} skipped`);
    for (const s of skipped) report.push(`    skipped: ${s}`);
  }
  if (!only.length) {
    const configured = new Set(Object.values(ANATOMY).flatMap((c) => c.pages.map((p) => `components/${p.page}.md`)));
    const pages = [...new Set(units.filter((u) => u.kind === 'list-item' && /\/anatomy$/.test(u.section) && u.page.startsWith('components/')).map((u) => u.page))];
    const missing = pages.filter((p) => !configured.has(p));
    if (missing.length) report.push(`pages with an anatomy list but no ANATOMY entry: ${missing.map((p) => p.replace(/^components\/|\.md$/g, '')).join(', ')}`);
  }
  console.log(report.join('\n'));
  if (check && stale) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main(process.argv.slice(2));