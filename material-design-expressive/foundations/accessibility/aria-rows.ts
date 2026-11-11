/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview The rows of the ARIA suite: every row of the axe suite
 * (`AXE_ROWS`, which covers each subject of the central table and the open
 * overlays) plus rows that put the components in the states ARIA depends on
 * (selected, checked, expanded, grouped, with panels, with an error).
 * `ARIA_GAPS` lists the rows with a real violation; they run in `aria_gap.ts`.
 */

import './aria-internals.js';

import {internalsOf} from './aria-internals.js';

import {AXE_ROWS, type AxeRow} from './axe-helpers.js';
import {deepElements, until} from '../../testing/subjects.js';

type Open = HTMLElement & {open: boolean; updateComplete?: Promise<unknown>};

const load = async () => {
  await Promise.all([
    import('../../components/badge/md-gb-badge.js'),
    import('../../components/divider/md-gb-divider.js'),
    import('../../components/loadingindicator/md-gb-loading-indicator.js'),
    import('../../components/progress/md-gb-progress.js'),
    import('../../components/menu/md-gb-menu-group.js'),
    import('../../components/select/md-gb-autocomplete.js'),
    import('../../components/tabs/md-gb-tab-panels.js'),
    import('../../components/fab/md-gb-fab.js'),
    import('../../components/checkbox/md-gb-checkbox.js'),
    import('../../components/radio/md-gb-radio.js'),
    import('../../components/switch/md-gb-switch.js'),
    import('../../components/textfield/md-gb-text-field.js'),
    import('../../components/chip/md-gb-chip-set.js'),
    import('../../components/chip/md-gb-chip.js'),
    import('../../components/list/md-gb-list.js'),
    import('../../components/list/md-gb-list-item.js'),
    import('../../components/slider/md-gb-slider.js'),
    import('../../components/segmentedbutton/md-gb-segmented-button-set.js'),
    import('../../components/segmentedbutton/md-gb-segmented-button.js'),
    import('../../components/iconbutton/md-gb-icon-button.js'),
    import('../../components/button/md-gb-button.js'),
    import('../../components/navbar/md-gb-nav-bar.js'),
    import('../../components/navbar/md-gb-nav-bar-item.js'),
    import('../../components/navdrawer/md-gb-nav-drawer.js'),
    import('../../components/navdrawer/md-gb-nav-drawer-item.js'),
    import('../../components/tabs/md-gb-tabs.js'),
    import('../../components/scaffold/md-gb-pane-scaffold.js'),
    import('../../components/scaffold/md-gb-app-scaffold.js'),
    import('../../components/pulltorefresh/md-gb-pull-to-refresh.js'),
    import('../../components/snackbar/md-gb-snackbar-host.js'),
    import('../../components/menu/md-gb-menu.js'),
    import('../../components/menu/md-gb-menu-item.js'),
  ]);
};

const popover = (selector: string) => async (c: HTMLElement) => {
  await load();
  const el = c.querySelector<HTMLElement>(selector)!;
  await (el as Open).updateComplete;
  el.showPopover();
  await (el as Open).updateComplete;
};

const open = (selector: string) => async (c: HTMLElement) => {
  await load();
  const el = c.querySelector<Open>(selector)!;
  await el.updateComplete;
  el.open = true;
  await el.updateComplete;
  await until(() => el.matches(':popover-open') || el.hasAttribute('open'));
};

const ready = async () => {
  await load();
};

const FRUIT = `<md-gb-select-option value="a">Apple</md-gb-select-option><md-gb-select-option value="b">Banana</md-gb-select-option>`;

/** Rows that put components in the states ARIA depends on. */
const EXTRA: AxeRow[] = [
  {
    id: 'tabs-with-panels',
    prepare: ready,
    html: `<div><md-gb-tabs aria-label="Travel"><md-gb-tab><span slot="label">Flights</span></md-gb-tab><md-gb-tab><span slot="label">Trips</span></md-gb-tab></md-gb-tabs>
      <md-gb-tab-panels><div role="tabpanel" tabindex="0">Flights</div><div role="tabpanel" tabindex="0">Trips</div></md-gb-tab-panels></div>`,
  },
  {
    id: 'tabs-second-selected',
    prepare: async (c) => {
      await ready();
      (c.querySelector('md-gb-tabs') as HTMLElement & {selectedTabIndex: number}).selectedTabIndex = 1;
    },
    html: `<md-gb-tabs aria-label="Tabs"><md-gb-tab><span slot="label">One</span></md-gb-tab><md-gb-tab><span slot="label">Two</span></md-gb-tab></md-gb-tabs>`,
  },
  {
    id: 'menu-checkable-groups',
    prepare: async (c) => {
      await popover('md-gb-menu')(c);
      // The group gives its items their checkable role, and the check marks of
      // the checked items render, a frame later.
      const role = (selector: string) => internalsOf(c.querySelector(selector)!)?.role;
      await until(
        () =>
          role('[checkable=single] > md-gb-menu-item') === 'menuitemradio' &&
          role('[checkable=multiple] > md-gb-menu-item') === 'menuitemcheckbox' &&
          deepElements(c).filter((e) => e.classList.contains('checkmark')).length >= 2,
        {timeout: 4000},
      );
    },
    html: `<md-gb-menu aria-label="View"><md-gb-menu-item>Standard</md-gb-menu-item>
      <md-gb-menu-group checkable="single" label="Sort by"><md-gb-menu-item checked>Name</md-gb-menu-item><md-gb-menu-item>Date</md-gb-menu-item></md-gb-menu-group>
      <md-gb-menu-group checkable="multiple" label="Show"><md-gb-menu-item checked>Hidden files</md-gb-menu-item><md-gb-menu-item>Sizes</md-gb-menu-item></md-gb-menu-group>
      <md-gb-menu-group><md-gb-menu-item>Undo</md-gb-menu-item><md-gb-menu-item disabled>Redo</md-gb-menu-item></md-gb-menu-group></md-gb-menu>`,
  },
  {
    id: 'tooltips-anchored',
    prepare: ready,
    html: `<div><button id="a1">Plain</button><md-gb-tooltip for="a1" quick>Plain tooltip</md-gb-tooltip>
      <button id="a2">Rich persistent</button><md-gb-tooltip for="a2" variant="rich" persistent quick subhead="Subhead">Supporting text</md-gb-tooltip>
      <button id="a3">Rich actions</button><md-gb-tooltip for="a3" variant="rich" persistent quick subhead="Subhead">Supporting text<md-gb-button slot="action" color="text">Ok</md-gb-button></md-gb-tooltip></div>`,
  },
  {id: 'date-picker-docked-disabled', html: `<md-gb-date-picker open disabled label="Date"></md-gb-date-picker>`},
  {id: 'date-picker-modal-disabled-days', html: `<md-gb-date-picker variant="modal" open min="2026-11-10" label="Date"></md-gb-date-picker>`},
  {id: 'time-picker-modal-disabled', html: `<md-gb-time-picker modal open disabled></md-gb-time-picker>`},
  {
    id: 'select-open',
    prepare: open('md-gb-select'),
    html: `<md-gb-select label="Fruit" value="b">${FRUIT}</md-gb-select>`,
  },
  {
    id: 'select-error-required',
    prepare: ready,
    html: `<md-gb-select label="Fruit" required error error-text="Pick one" supporting-text="Choose">${FRUIT}</md-gb-select>`,
  },
  {
    id: 'autocomplete',
    prepare: ready,
    html: `<md-gb-autocomplete label="State"><md-gb-select-option value="a">Alabama</md-gb-select-option><md-gb-select-option value="b">Alaska</md-gb-select-option></md-gb-autocomplete>`,
  },
  {
    id: 'chip-set-filter-selected',
    prepare: ready,
    html: `<md-gb-chip-set aria-label="Filters"><md-gb-chip type="filter" selected>One</md-gb-chip><md-gb-chip type="filter">Two</md-gb-chip></md-gb-chip-set>`,
  },
  {
    id: 'chip-set-input-removable',
    prepare: ready,
    html: `<md-gb-chip-set aria-label="Recipients"><md-gb-chip type="input" removable remove-label="Remove Ann">Ann</md-gb-chip><md-gb-chip type="input" removable remove-label="Remove Bo">Bo</md-gb-chip></md-gb-chip-set>`,
  },
  {
    id: 'list-selectable',
    prepare: ready,
    html: `<md-gb-list selectable aria-label="Items"><md-gb-list-item>One</md-gb-list-item><md-gb-list-item>Two</md-gb-list-item></md-gb-list>`,
  },
  {
    id: 'list-reorderable',
    prepare: ready,
    html: `<md-gb-list reorderable aria-label="Items"><md-gb-list-item reorderable>One</md-gb-list-item><md-gb-list-item reorderable>Two</md-gb-list-item></md-gb-list>`,
  },
  {
    id: 'list-expandable',
    prepare: ready,
    html: `<md-gb-list aria-label="Items"><md-gb-list-item expandable>One<div slot="expanded-content">More</div></md-gb-list-item><md-gb-list-item>Two</md-gb-list-item></md-gb-list>`,
  },
  {
    id: 'segmented-multiselect',
    prepare: ready,
    html: `<md-gb-segmented-button-set multiselect aria-label="Days"><md-gb-segmented-button value="a" selected>Mon</md-gb-segmented-button><md-gb-segmented-button value="b">Tue</md-gb-segmented-button></md-gb-segmented-button-set>`,
  },
  {
    id: 'radio-group',
    prepare: ready,
    html: `<div role="radiogroup" aria-label="Size"><md-gb-radio name="s" value="a" aria-label="Small" checked></md-gb-radio><md-gb-radio name="s" value="b" aria-label="Large"></md-gb-radio></div>`,
  },
  {
    id: 'checkbox-states',
    prepare: ready,
    html: `<div><md-gb-checkbox aria-label="One" checked></md-gb-checkbox><md-gb-checkbox aria-label="Two" indeterminate></md-gb-checkbox><md-gb-checkbox aria-label="Three" disabled></md-gb-checkbox></div>`,
  },
  {
    id: 'switch-selected',
    prepare: ready,
    html: `<div><md-gb-switch aria-label="On" selected></md-gb-switch><md-gb-switch aria-label="Off disabled" disabled></md-gb-switch></div>`,
  },
  {
    id: 'buttons-toggle-disabled',
    prepare: ready,
    html: `<div><md-gb-button type="toggle" selected>On</md-gb-button><md-gb-button disabled>Off</md-gb-button><md-gb-button soft-disabled>Soft</md-gb-button><md-gb-icon-button type="toggle" selected aria-label="Fav"><md-gb-icon>favorite</md-gb-icon></md-gb-icon-button></div>`,
  },
  {
    id: 'progress',
    prepare: ready,
    html: `<div><md-gb-progress aria-label="Loading" value="40"></md-gb-progress><md-gb-progress aria-label="Loading"></md-gb-progress><md-gb-progress aria-label="Loading" circular value="30"></md-gb-progress><md-gb-progress aria-label="Loading" circular wavy></md-gb-progress></div>`,
  },
  {
    id: 'loading-indicator',
    prepare: ready,
    html: `<div><md-gb-loading-indicator aria-label="Loading"></md-gb-loading-indicator><md-gb-loading-indicator aria-label="Loading" contained></md-gb-loading-indicator></div>`,
  },
  {
    id: 'badge-divider',
    prepare: ready,
    html: `<div><md-gb-badge>3</md-gb-badge><md-gb-badge></md-gb-badge><md-gb-divider></md-gb-divider></div>`,
  },
  {
    id: 'text-field-error-supporting',
    prepare: ready,
    html: `<div><md-gb-text-field label="Email" required error error-text="Invalid email" supporting-text="Help" value="x"></md-gb-text-field><md-gb-text-field label="Notes" type="textarea" supporting-text="Optional" prefix-text="$" suffix-text="USD"></md-gb-text-field></div>`,
  },
  {
    id: 'slider-range',
    prepare: ready,
    html: `<md-gb-slider range style="width:300px" value-start="20" value-end="60" label-start="Minimum" label-end="Maximum" labeled></md-gb-slider>`,
  },
  {
    id: 'fab-menu-closed',
    prepare: ready,
    html: `<md-gb-fab-menu aria-label="Actions"><md-gb-fab-menu-item><md-gb-icon>edit</md-gb-icon>Edit</md-gb-fab-menu-item></md-gb-fab-menu>`,
  },
  {
    id: 'nav-drawer-standard',
    prepare: ready,
    html: `<md-gb-nav-drawer open aria-label="Mail"><md-gb-nav-drawer-item selected>Inbox</md-gb-nav-drawer-item><md-gb-nav-drawer-item>Sent</md-gb-nav-drawer-item></md-gb-nav-drawer>`,
  },
  {
    id: 'nav-bar-active',
    prepare: ready,
    html: `<md-gb-nav-bar><md-gb-nav-bar-item active><md-gb-icon slot="icon">home</md-gb-icon>Home</md-gb-nav-bar-item><md-gb-nav-bar-item><md-gb-icon slot="icon">mail</md-gb-icon>Mail</md-gb-nav-bar-item></md-gb-nav-bar>`,
  },
  {
    id: 'search-view-modal',
    prepare: ready,
    html: `<md-gb-search-view open quick placeholder="Search"><div>Result</div></md-gb-search-view>`,
  },
  {
    id: 'dialog-actions',
    prepare: ready,
    html: `<md-gb-dialog open quick><span slot="headline">Title</span>Body<md-gb-button slot="actions">Cancel</md-gb-button><md-gb-button slot="actions">OK</md-gb-button></md-gb-dialog>`,
  },
  {
    id: 'pane-scaffold-resizable',
    prepare: ready,
    html: `<md-gb-pane-scaffold layout="list-detail" resizable style="width:900px;height:400px">
      <div slot="secondary" role="list"><div role="listitem">Ann</div><div role="listitem">Bo</div></div>
      <article>Detail</article></md-gb-pane-scaffold>`,
  },
  {
    id: 'app-scaffold',
    prepare: ready,
    html: `<md-gb-app-scaffold style="height:400px"><md-gb-app-bar slot="top-app-bar" size="sm">Title</md-gb-app-bar>
      <md-gb-nav-bar slot="navigation-bar"><md-gb-nav-bar-item active><md-gb-icon slot="icon">home</md-gb-icon>Home</md-gb-nav-bar-item></md-gb-nav-bar>
      <md-gb-fab slot="fab" aria-label="Compose"><md-gb-icon>edit</md-gb-icon></md-gb-fab><p>Content</p></md-gb-app-scaffold>`,
  },
  {
    id: 'pull-to-refresh',
    prepare: ready,
    html: `<md-gb-pull-to-refresh indicator-label="Refreshing" style="height:200px"><ul><li>One</li><li>Two</li></ul></md-gb-pull-to-refresh>`,
  },
  {
    id: 'bottom-sheet-standard',
    prepare: ready,
    html: `<md-gb-bottom-sheet open quick label="Details">Content</md-gb-bottom-sheet>`,
  },
];

/**
 * Rows that are open overlays: their open state is what the row shows, so the
 * checks that flip state (`open`, `disabled`) skip them.
 */
export const OVERLAY_ROWS = new Set([
  'dialog', 'dialog-full-screen', 'dialog-actions', 'menu', 'menu-item', 'menu-checkable-groups', 'bottom-sheet-modal',
  'bottom-sheet-standard', 'side-sheet-modal', 'side-sheet-docked', 'date-picker-modal', 'date-picker-docked',
  'time-picker-modal', 'date-picker-docked-disabled', 'date-picker-modal-disabled-days', 'time-picker-modal-disabled', 'search-view-docked', 'search-view-modal', 'snackbar', 'select-open', 'nav-drawer',
  'nav-drawer-item', 'nav-drawer-standard', 'fab-menu', 'tooltip-plain', 'tooltip-rich', 'tooltips-anchored',
]);

/** Every row the ARIA suite renders. */
export const ARIA_ROWS: AxeRow[] = [...AXE_ROWS, ...EXTRA];

/**
 * Rows with a real violation, by row id: the rule, and what is wrong. They run
 * in `aria_gap.ts` (red) instead of `aria_test.ts`.
 */
export const ARIA_GAPS: Record<string, Array<{rule: string; role: string; attr: string; why: string}>> = {};

/** True when a finding is the known gap `gap` (a role ending in `*` is a prefix). */
export function isGap(
  v: {rule: string; role: string; attr: string},
  gap: {rule: string; role: string; attr: string},
): boolean {
  const role = gap.role.endsWith('*') ? v.role.startsWith(gap.role.slice(0, -1)) : v.role === gap.role;
  return v.rule === gap.rule && v.attr === gap.attr && role;
}
