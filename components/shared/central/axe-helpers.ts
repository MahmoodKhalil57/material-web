/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Runs axe-core (WCAG 2.0 A/AA, 2.1 AA and 2.2 AA rules) on a
 * rendered subject. axe-core is injected as a classic script from
 * `node_modules`, so its global is the only thing the page gains. No rule is
 * disabled globally; a row that really violates a rule is listed in
 * `AXE_GAPS` and runs in `axe_gap.ts` instead of `axe_test.ts`.
 */

import './axe-internals.js';
import {deepElements, loadSubject, renderSubject, settle, SUBJECTS, type Subject} from './subjects.js';

import '../../appbar/md-gb-app-bar.js';
import '../../buttongroup/md-gb-button-group.js';
import '../../carousel/md-gb-carousel.js';
import '../../carousel/md-gb-carousel-item.js';
import '../../fabmenu/md-gb-fab-menu.js';
import '../../fabmenu/md-gb-fab-menu-item.js';
import '../../select/md-gb-select.js';
import '../../select/md-gb-select-option.js';
import '../../splitbutton/md-gb-split-button.js';
import '../../toolbar/md-gb-toolbar.js';
import '../../datepicker/md-gb-date-picker.js';
import '../../dialog/md-gb-dialog.js';
import '../../search/md-gb-search-view.js';
import '../../sheet/md-gb-bottom-sheet.js';
import '../../sheet/md-gb-side-sheet.js';
import '../../snackbar/md-gb-snackbar.js';
import '../../timepicker/md-gb-time-picker.js';
import '../../tooltip/md-gb-tooltip.js';

/** The slice of axe-core's API the suites use. */
interface Axe {
  run(
    context: Element,
    options: {runOnly: {type: 'tag'; values: string[]}},
  ): Promise<{violations: AxeViolation[]}>;
}

/** One failed rule. */
export interface AxeViolation {
  id: string;
  help: string;
  nodes: Array<{target: unknown[]; html: string; failureSummary?: string}>;
}

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'];

let loading: Promise<Axe> | undefined;

/** Loads axe-core once. */
function loadAxe(): Promise<Axe> {
  loading ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = '/node_modules/axe-core/axe.min.js';
    script.onload = () => resolve((window as unknown as {axe: Axe}).axe);
    script.onerror = () => reject(new Error('axe-core did not load'));
    document.head.append(script);
  });
  return loading;
}

/** Runs axe on `root` and returns the violations. */
export async function axeViolations(root: Element): Promise<AxeViolation[]> {
  const axe = await loadAxe();
  for (const e of deepElements(root)) e.getAnimations().forEach((a) => a.finish());
  const {violations} = await axe.run(root, {runOnly: {type: 'tag', values: TAGS}});
  return violations;
}

/** A readable list of violations: rule and the elements it names. */
export function describeViolations(violations: AxeViolation[]): string {
  return violations
    .map((v) => `${v.id} (${v.help}): ${v.nodes.map((n) => n.target.join(' >>> ') + ' ' + n.html.slice(0, 160) + ' :: ' + (n.failureSummary ?? '').replace(/\s+/g, ' ')).join('; ')}`)
    .join('\n');
}

/** One thing to check: a markup string, rendered and optionally opened. */
export interface AxeRow {
  id: string;
  html: string;
  prepare?: (container: HTMLElement) => Promise<void> | void;
  /** The `Subject` this row comes from, when it is one. */
  subject?: Subject;
}

/** Renders a row in a fresh container. */
export async function renderRow(row: AxeRow) {
  if (row.subject) {
    const {container, cleanup} = await renderSubject(row.subject);
    return {container, cleanup};
  }
  await loadSubject();
  const container = document.createElement('div');
  container.style.cssText = 'padding:64px;display:block;position:relative';
  container.innerHTML = row.html;
  document.body.append(container);
  await row.prepare?.(container);
  await settle(container);
  return {container, cleanup: () => container.remove()};
}

const ICON = (name: string) => `<md-gb-icon>${name}</md-gb-icon>`;

/** Every subject of the central table, plus the overlays in their open state. */
export const AXE_ROWS: AxeRow[] = [
  ...SUBJECTS.map((subject) => ({id: subject.id, html: subject.html, subject})),
  {id: 'dialog', html: `<md-gb-dialog open aria-label="Dialog">Content</md-gb-dialog>`},
  {id: 'dialog-full-screen', html: `<md-gb-dialog open full-screen always-full-screen aria-label="Dialog">Content</md-gb-dialog>`},
  {id: 'menu', html: `<md-gb-menu aria-label="Menu"><md-gb-menu-item>Cut</md-gb-menu-item><md-gb-menu-item>Copy</md-gb-menu-item></md-gb-menu>`, prepare: (c) => (c.querySelector('md-gb-menu') as HTMLElement).showPopover()},
  {id: 'bottom-sheet-modal', html: `<md-gb-bottom-sheet modal quick open label="Share">Content</md-gb-bottom-sheet>`},
  {id: 'side-sheet-modal', html: `<md-gb-side-sheet modal open label="Sheet">Content</md-gb-side-sheet>`},
  {id: 'side-sheet-docked', html: `<md-gb-side-sheet open label="Sheet">Content</md-gb-side-sheet>`},
  {id: 'date-picker-modal', html: `<md-gb-date-picker variant="modal" open label="Date"></md-gb-date-picker>`},
  {id: 'date-picker-docked', html: `<md-gb-date-picker open label="Date"></md-gb-date-picker>`},
  {id: 'time-picker-modal', html: `<md-gb-time-picker modal open></md-gb-time-picker>`},
  {id: 'search-view-docked', html: `<md-gb-search-view docked quick open placeholder="Search"><div>Result one</div><div>Result two</div></md-gb-search-view>`},
  {id: 'snackbar', html: `<md-gb-snackbar open label-text="Item deleted" action-label="Undo" quick></md-gb-snackbar>`},
  {id: 'tooltip-plain', html: `<md-gb-tooltip persistent>Label</md-gb-tooltip>`},
  {id: 'tooltip-rich', html: `<md-gb-tooltip variant="rich" persistent subhead="Subhead">Supporting text</md-gb-tooltip>`},
  {id: 'button-group', html: `<md-gb-button-group aria-label="Group"><md-gb-button>One</md-gb-button><md-gb-button>Two</md-gb-button></md-gb-button-group>`},
  {id: 'split-button', html: `<md-gb-split-button><button slot="leading">Label</button><button slot="trailing" aria-label="More">v</button></md-gb-split-button>`},
  {id: 'chip-set-assist', html: `<md-gb-chip-set aria-label="Chips"><md-gb-chip type="assist">Label</md-gb-chip><md-gb-chip type="assist">Other</md-gb-chip></md-gb-chip-set>`},
  {id: 'segmented-button-set', html: `<md-gb-segmented-button-set aria-label="Sort"><md-gb-segmented-button value="a">Day</md-gb-segmented-button><md-gb-segmented-button value="b">Week</md-gb-segmented-button></md-gb-segmented-button-set>`},
  {id: 'card-filled', html: `<md-gb-card color="filled" style="width:200px;height:120px">Content</md-gb-card>`},
  {id: 'card-outlined', html: `<md-gb-card color="outlined" style="width:200px;height:120px">Content</md-gb-card>`},
  {id: 'carousel', html: `<md-gb-carousel aria-label="Carousel"><md-gb-carousel-item><span slot="label">One</span></md-gb-carousel-item><md-gb-carousel-item><span slot="label">Two</span></md-gb-carousel-item></md-gb-carousel>`},
  {id: 'list', html: `<md-gb-list aria-label="Items"><md-gb-list-item>One</md-gb-list-item><md-gb-list-item>Two</md-gb-list-item></md-gb-list>`},
  {id: 'nav-rail', html: `<md-gb-nav-rail><md-gb-nav-rail-item><md-gb-icon slot="icon">home</md-gb-icon>Home</md-gb-nav-rail-item><md-gb-nav-rail-item><md-gb-icon slot="icon">mail</md-gb-icon>Mail</md-gb-nav-rail-item></md-gb-nav-rail>`},
  {id: 'nav-bar', html: `<md-gb-nav-bar><md-gb-nav-bar-item><md-gb-icon slot="icon">home</md-gb-icon>Home</md-gb-nav-bar-item><md-gb-nav-bar-item><md-gb-icon slot="icon">mail</md-gb-icon>Mail</md-gb-nav-bar-item></md-gb-nav-bar>`},
  {id: 'nav-drawer', html: `<md-gb-nav-drawer modal quick open aria-label="Mail"><md-gb-nav-drawer-item>Inbox</md-gb-nav-drawer-item><md-gb-nav-drawer-item>Sent</md-gb-nav-drawer-item></md-gb-nav-drawer>`},
  {id: 'tabs', html: `<md-gb-tabs aria-label="Tabs"><md-gb-tab><span slot="label">One</span></md-gb-tab><md-gb-tab><span slot="label">Two</span></md-gb-tab></md-gb-tabs>`},
  {id: 'app-bar', html: `<md-gb-app-bar><span slot="headline">Title</span></md-gb-app-bar>`},
  {id: 'toolbar', html: `<md-gb-toolbar aria-label="Tools"><md-gb-icon-button aria-label="Bold"><md-gb-icon>format_bold</md-gb-icon></md-gb-icon-button></md-gb-toolbar>`},
  {id: 'select', html: `<md-gb-select label="Fruit"><md-gb-select-option value="a">Apple</md-gb-select-option><md-gb-select-option value="b">Banana</md-gb-select-option></md-gb-select>`},
  {id: 'fab-menu', html: `<md-gb-fab-menu open aria-label="Actions"><md-gb-fab-menu-item>${ICON("edit")}Edit</md-gb-fab-menu-item></md-gb-fab-menu>`},
];

/**
 * Rows with a real violation: the rule axe reports, and why. They run in
 * `axe_gap.ts` (red) instead of `axe_test.ts`.
 */
export const AXE_GAPS: Record<string, {rule: string; why: string}> = {
};
