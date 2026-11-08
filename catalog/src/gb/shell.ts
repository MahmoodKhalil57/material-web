/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The layout of the /3.0/ site (imported by gb.ts; markup in
 * site/_includes/gb/default.html, styles in shell.css), modelled on
 * m3.material.io with the navigation rail, navigation bar, FAB menu and
 * sheets of labs/gb:
 *
 * - Expanded (840px and up) and medium (600px and up) windows: a navigation
 *   rail with the menu button, the search FAB, the four sections, and the
 *   theme, version and more controls. The pages pane (the current section's
 *   pages in an `md-gb-nav-drawer`) is standard beside the rail when expanded
 *   (the menu button toggles it, remembered in localStorage) and modal in
 *   medium windows. While the pane is open, hovering or focusing another
 *   section's destination shows that section's pages in the pane (Right
 *   arrow moves into them); leaving the rail and pane shows the current
 *   section again. With the pane closed, hovering does nothing.
 * - Compact windows (below 600px): a navigation bar with the sections.
 *   Selecting the current one again opens its pages in a bottom sheet, and
 *   the small search button follows the scroll (hides when scrolling down).
 * - All sizes: the FAB menu with Download & copy (download.ts) and Customize
 *   theme in a side sheet (a bottom sheet when compact), and Send feedback in
 *   a dialog that opens a prefilled GitHub issue.
 *
 * Prerender safe: nothing here reads the network or the clipboard.
 */

import '@material/web/labs/gb/components/dialog/md-gb-dialog.js';
import '@material/web/labs/gb/components/fab/md-gb-fab.js';
import '@material/web/labs/gb/components/fabmenu/md-gb-fab-menu.js';
import '@material/web/labs/gb/components/fabmenu/md-gb-fab-menu-item.js';
// The menu first: items find it through a context, which only reaches those
// upgraded after it is defined.
import '@material/web/labs/gb/components/menu/md-gb-menu.js';
import '@material/web/labs/gb/components/menu/md-gb-menu-item.js';
import '@material/web/labs/gb/components/navbar/md-gb-nav-bar.js';
import '@material/web/labs/gb/components/navbar/md-gb-nav-bar-item.js';
import '@material/web/labs/gb/components/navdrawer/md-gb-nav-drawer.js';
import '@material/web/labs/gb/components/navdrawer/md-gb-nav-drawer-item.js';
import '@material/web/labs/gb/components/navrail/md-gb-nav-rail.js';
import '@material/web/labs/gb/components/navrail/md-gb-nav-rail-item.js';
import '@material/web/labs/gb/components/segmentedbutton/md-gb-segmented-button.js';
import '@material/web/labs/gb/components/segmentedbutton/md-gb-segmented-button-set.js';
import '@material/web/labs/gb/components/select/md-gb-select.js';
import '@material/web/labs/gb/components/select/md-gb-select-option.js';
import '@material/web/labs/gb/components/sheet/md-gb-bottom-sheet.js';
import '@material/web/labs/gb/components/sheet/md-gb-side-sheet.js';
import '@material/web/labs/gb/components/textfield/md-gb-text-field.js';
import '@material/web/labs/gb/components/tooltip/md-gb-tooltip.js';

import {
  stepScroll,
  type ScrollStep,
} from '@material/web/labs/gb/components/shared/scroll-behavior.js';

import type {SchemeVariant} from '@material/web/labs/gb/styles/color/dynamic-color.js';

const REPO = 'https://github.com/material-components/material-web';
const PANE_KEY = 'gb-pane';

const $ = <T extends HTMLElement = HTMLElement>(id: string) =>
  document.getElementById(id) as T | null;

const expanded = matchMedia('(min-width: 840px)');
const compact = matchMedia('(max-width: 599px)');

function store(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Storage can be blocked; the choice is just not remembered.
  }
}

function sectionOf(el: Element): string {
  return (el as HTMLElement).dataset['section'] ?? '';
}

// --- Pages pane ----------------------------------------------------------------

interface DrawerElement extends HTMLElement {
  open: boolean;
  modal: boolean;
  quick: boolean;
}

const drawer = $<DrawerElement>('gb-drawer');
const menuButton = $('gb-menu');
const cell = drawer?.parentElement ?? null;
const root = document.documentElement;
const currentSection = drawer?.dataset['section'] ?? 'about';

const paneOpen = () => root.dataset['pane'] !== 'closed';

/** Whether the standard pane (not the modal one) is showing. */
const standardPaneShowing = () => expanded.matches && paneOpen();

function syncMenuButton() {
  if (!menuButton || !drawer) return;
  const open = expanded.matches ? paneOpen() : drawer.open;
  menuButton.setAttribute('aria-expanded', String(open));
  if (cell) cell.inert = expanded.matches && !paneOpen();
}

if (drawer) {
  // Standard and open at expanded and up; modal and closed below.
  const place = () => {
    drawer.quick = true;
    drawer.modal = !expanded.matches;
    drawer.open = expanded.matches;
    syncMenuButton();
    requestAnimationFrame(() => (drawer.quick = false));
  };
  place();
  expanded.addEventListener('change', place);
  menuButton?.addEventListener('click', () => {
    restorePane();
    if (expanded.matches) {
      // The pane slides away; the content takes the width (CSS).
      const open = !paneOpen();
      if (open) delete root.dataset['pane'];
      else root.dataset['pane'] = 'closed';
      store(PANE_KEY, open ? null : 'closed');
    } else {
      drawer.open = !drawer.open;
    }
    syncMenuButton();
  });
  for (const type of ['opened', 'closed', 'open']) {
    drawer.addEventListener(type, syncMenuButton);
  }
}

// --- Pane preview: another section's pages in the open pages pane ---------------

const rail = $('gb-rail');
const railItems = () =>
  [...(rail?.querySelectorAll<HTMLElement>('md-gb-nav-rail-item') ?? [])];

/** The pane's own items (the current section), kept while another shows. */
let homeNodes: Node[] | null = null;
let homeLabel = '';
let previewing = '';
let previewFrom: HTMLElement | null = null;
let previewTimer: number | undefined;
let skipFocusPreview = false;

/** Whether the pages pane is on screen (standard, or the open modal one). */
const paneShowing = () =>
  !!drawer && !compact.matches && (standardPaneShowing() || (drawer.modal && drawer.open));

/** Clones the pages of a section: from its template, or the live pane. */
function pagesOf(section: string): {nodes: Node[]; label: string} | null {
  const template = document.querySelector<HTMLTemplateElement>(
    `template[data-pages="${section}"]`,
  );
  if (template) {
    return {
      nodes: [...(template.content.cloneNode(true) as DocumentFragment).childNodes],
      label: template.dataset['label'] ?? section,
    };
  }
  if (section === currentSection && drawer) {
    const nodes = homeNodes ?? [...drawer.childNodes];
    return {
      nodes: nodes.map((c) => c.cloneNode(true)),
      label: (homeNodes ? homeLabel : drawer.getAttribute('label') ?? '').replace(/ pages$/, '') || section,
    };
  }
  return null;
}

/**
 * Shows a section's pages in the pages pane while its rail destination is
 * hovered or focused. Does nothing when the pane is closed.
 */
function previewSection(section: string, from: HTMLElement) {
  clearTimeout(previewTimer);
  if (!drawer || !paneShowing()) return;
  previewFrom = from;
  if (section === currentSection) {
    restorePane();
    return;
  }
  if (section === previewing) return;
  const pages = pagesOf(section);
  if (!pages) return;
  if (!homeNodes) {
    homeNodes = [...drawer.childNodes];
    homeLabel = drawer.getAttribute('label') ?? '';
  }
  drawer.replaceChildren(...pages.nodes);
  drawer.setAttribute('label', `${pages.label} pages`);
  drawer.dataset['preview'] = section;
  applySavedGroups(drawer);
  previewing = section;
}

/** Puts the current section's pages back in the pane. */
function restorePane(returnFocus = false) {
  clearTimeout(previewTimer);
  if (drawer && homeNodes) {
    drawer.replaceChildren(...homeNodes);
    drawer.setAttribute('label', homeLabel);
    delete drawer.dataset['preview'];
  }
  homeNodes = null;
  previewing = '';
  if (returnFocus && previewFrom) {
    // Focus goes back without previewing that destination again.
    skipFocusPreview = true;
    previewFrom.focus();
    skipFocusPreview = false;
  }
}

function restorePaneSoon() {
  clearTimeout(previewTimer);
  previewTimer = window.setTimeout(() => restorePane(), 280);
}

function focusPane() {
  const first = drawer?.querySelector<HTMLElement>('a, md-gb-nav-drawer-item[href]');
  requestAnimationFrame(() => first?.focus());
}

if (rail && drawer) {
  for (const item of railItems()) {
    const section = sectionOf(item);
    item.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'touch') return;
      clearTimeout(previewTimer);
      // A short delay, so moving across the rail doesn't flash each section.
      previewTimer = window.setTimeout(() => previewSection(section, item), 80);
    });
    item.addEventListener('pointerleave', restorePaneSoon);
    // Keyboard focus previews too; a click focus does not.
    item.addEventListener('focus', () => {
      if (!skipFocusPreview && item.matches(':focus-visible')) previewSection(section, item);
    });
  }
  cell?.addEventListener('pointerenter', () => clearTimeout(previewTimer));
  cell?.addEventListener('pointerleave', restorePaneSoon);
  // Right arrow (Left in right-to-left) moves into the pane; Left comes back.
  rail.addEventListener(
    'keydown',
    (e) => {
      const forward = getComputedStyle(rail).direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
      const item = (e.target as Element).closest<HTMLElement>('md-gb-nav-rail-item');
      if (e.key !== forward || !item || !paneShowing()) return;
      e.preventDefault();
      e.stopPropagation();
      previewSection(sectionOf(item), item);
      focusPane();
    },
    true,
  );
  drawer.addEventListener('keydown', (e) => {
    const back = getComputedStyle(drawer).direction === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    if (e.key === 'Escape' && previewing) {
      e.stopPropagation();
      restorePane(true);
    } else if (e.key === back && previewFrom) {
      e.preventDefault();
      previewFrom.focus();
    }
  });
  // Focus left the rail and the pane: show the current section again.
  document.addEventListener('focusin', (e) => {
    if (!previewing) return;
    const target = e.target as Node;
    if (!rail.contains(target) && !cell?.contains(target)) restorePane();
  });
  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Escape' && previewing && rail.contains(document.activeElement)) {
        restorePane();
      }
    },
    true,
  );
  compact.addEventListener('change', () => restorePane());
  expanded.addEventListener('change', () => restorePane());
}


// --- Component groups: split rows that collapse their pages ------------------------

const GROUPS_KEY = 'gb-groups';

function savedGroups(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(GROUPS_KEY) || '{}');
  } catch {
    return {};
  }
}

/** Shows or hides a group's pages in `list` and updates its toggle. */
function setGroup(list: ParentNode, id: string, open: boolean) {
  const row = list.querySelector<HTMLElement>(`.gb-pane-group[data-group="${id}"]`);
  row?.querySelector('.gb-pane-group-toggle')?.setAttribute('aria-expanded', String(open));
  for (const item of list.querySelectorAll<HTMLElement>(
    `md-gb-nav-drawer-item[data-group="${id}"]`,
  )) {
    item.hidden = !open;
  }
}

/** Applies the reader's saved choices; the current page's group stays open. */
function applySavedGroups(list: ParentNode) {
  const saved = savedGroups();
  for (const row of list.querySelectorAll<HTMLElement>('.gb-pane-group')) {
    const id = row.dataset['group'] ?? '';
    if (id in saved && !row.hasAttribute('data-current')) setGroup(list, id, saved[id]);
  }
}

/** Toggles a group from its chevron (in the pane, a preview, or the sheet). */
function handleGroupToggle(e: Event) {
  const toggle = (e.target as Element).closest<HTMLElement>('.gb-pane-group-toggle');
  const row = toggle?.closest<HTMLElement>('.gb-pane-group');
  const list = row?.parentElement;
  if (!toggle || !row || !list) return;
  const id = row.dataset['group'] ?? '';
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  setGroup(list, id, open);
  const saved = savedGroups();
  saved[id] = open;
  store(GROUPS_KEY, JSON.stringify(saved));
}

drawer?.addEventListener('click', handleGroupToggle);

// --- Compact: the navigation bar and the pages sheet ------------------------------

const pagesSheet = $<SheetElement>('gb-pages-sheet');
const pagesFoot = $('gb-pages-foot');
pagesSheet?.addEventListener('click', handleGroupToggle);

function openPagesSheet(trigger: HTMLElement) {
  if (!pagesSheet) return;
  const pages = pagesOf(currentSection);
  if (!pages) return;
  const list = document.createElement('md-gb-nav-drawer') as DrawerElement;
  list.className = 'gb-sheet-drawer';
  list.setAttribute('label', `${pages.label} pages`);
  list.append(...pages.nodes);
  list.quick = true;
  list.open = true;
  pagesSheet.replaceChildren(list);
  if (pagesFoot) pagesSheet.append(pagesFoot);
  returnFocus.set(pagesSheet, trigger);
  void pagesSheet.show();
}

pagesSheet?.addEventListener('closed', () => {
  // Park the footer again; the next open appends it.
  if (pagesFoot) $('gb-tools')?.append(pagesFoot);
  pagesSheet.replaceChildren();
  returnFocus.get(pagesSheet)?.focus();
});

addEventListener(
  'click',
  (e) => {
    const item = (e.target as Element | null)?.closest<HTMLElement>('md-gb-nav-bar-item');
    if (!item || !compact.matches || e.defaultPrevented) return;
    if (sectionOf(item) !== currentSection) return;
    e.preventDefault();
    openPagesSheet(item);
  },
  true,
);

// The search button floats at the top end and hides while scrolling down.
const searchCompact = $('gb-search-compact');
if (searchCompact) {
  let step: ScrollStep = {y: scrollY, hidden: false, travel: 0};
  let focusInside = false;
  searchCompact.addEventListener('focusin', () => {
    focusInside = true;
    searchCompact.removeAttribute('data-hidden');
    step = {...step, hidden: false, travel: 0};
  });
  searchCompact.addEventListener('focusout', () => (focusInside = false));
  addEventListener(
    'scroll',
    () => {
      const next = stepScroll(step, scrollY, !focusInside);
      if (next.hidden !== step.hidden) {
        searchCompact.toggleAttribute('data-hidden', next.hidden);
      }
      step = next;
    },
    {passive: true},
  );
}

// --- Rail menus --------------------------------------------------------------------

$('gb-version-menu')?.addEventListener('click', (e) => {
  const item = (e.target as Element).closest<HTMLElement>('md-gb-menu-item');
  // v2.5.0 is the site root; 3.0 stays under /3.0/.
  if (item?.dataset['version'] === '2.5') location.assign('/');
});

$('gb-more-menu')?.addEventListener('click', (e) => {
  const item = (e.target as Element).closest<HTMLElement>('md-gb-menu-item');
  if (!item) return;
  if (item.dataset['open']) {
    window.open(item.dataset['open'], '_blank', 'noopener');
  } else if (item.dataset['tool'] === 'feedback') {
    // The menu is closing and returns focus to its button.
    setTimeout(() => openFeedback($('gb-more')), 0);
  }
});

// --- Sheets: download & copy and customize theme ---------------------------------------

interface SheetElement extends HTMLElement {
  open: boolean;
  headline?: string;
  show(): Promise<void>;
  close(reason?: string): Promise<void>;
}

const sideSheet = $<SheetElement>('gb-side-sheet');
const toolsSheet = $<SheetElement>('gb-tools-sheet');
const holder = $('gb-tools');
const fabMenu = $('gb-fab-menu');
/** Where focus returns when a sheet or the dialog closes. */
const returnFocus = new Map<HTMLElement, HTMLElement | null>();

const fabButton = () =>
  fabMenu?.shadowRoot?.getElementById('button') as HTMLElement | null | undefined;

let openTool: HTMLElement | null = null;

function openToolSheet(name: string) {
  const body = $(`gb-${name}-body`);
  if (!body) return;
  const sheet = compact.matches ? toolsSheet : sideSheet;
  if (!sheet) return;
  openTool = body;
  if (sheet === sideSheet) sheet.headline = body.dataset['title'] ?? '';
  sheet.replaceChildren(body);
  returnFocus.set(sheet, fabButton() ?? null);
  void sheet.show();
  dispatchEvent(new CustomEvent('gb-tool-open', {detail: name}));
}

for (const sheet of [sideSheet, toolsSheet]) {
  sheet?.addEventListener('closed', () => {
    // The body goes back to the holder, so the next sheet can take it.
    if (openTool) holder?.append(openTool);
    openTool = null;
    returnFocus.get(sheet)?.focus();
  });
}

addEventListener('gb-tools-close', () => {
  void sideSheet?.close();
  void toolsSheet?.close();
});

fabMenu?.addEventListener('activate', (e) => {
  const item = (e as CustomEvent<{item: HTMLElement}>).detail?.item;
  const tool = item?.dataset['tool'];
  if (!tool) return;
  // The menu closes first, then the tool opens.
  setTimeout(() => {
    if (tool === 'feedback') openFeedback(fabButton() ?? null);
    else openToolSheet(tool);
  }, 0);
});

// Send feedback from the pages sheet footer.
pagesFoot?.addEventListener('click', (e) => {
  const button = (e.target as Element).closest<HTMLElement>('[data-tool="feedback"]');
  if (!button) return;
  void pagesSheet?.close();
  setTimeout(() => openFeedback(null), 0);
});

// --- Customize theme -----------------------------------------------------------------

interface GbTheme {
  get(): {seed: string; variant: SchemeVariant; contrast: string; mode: string};
  setSeed(hex: string): void;
  setVariant(variant: SchemeVariant): void;
  setContrast(contrast: string): void;
  setMode(mode: string): void;
  reset(): void;
}
const gbTheme = () => (window as unknown as {gbTheme?: GbTheme}).gbTheme;

const swatches = [...document.querySelectorAll<HTMLInputElement>('input[name="gb-seed"]')];
const seedInput = $<HTMLInputElement>('gb-seed-input');
const seedHex = $<HTMLOutputElement>('gb-seed-hex');
const variantSelect = $<HTMLElement & {value: string}>('gb-variant');
const modeSet = $('gb-mode');
const contrastSet = $('gb-contrast');

function selectSegment(set: HTMLElement | null, value: string) {
  for (const segment of set?.querySelectorAll<HTMLElement & {selected: boolean; value: string}>('md-gb-segmented-button') ?? []) {
    segment.selected = segment.value === value;
  }
}

function selectedSegment(set: HTMLElement | null): string {
  const segment = [...(set?.querySelectorAll<HTMLElement & {selected: boolean; value: string}>('md-gb-segmented-button') ?? [])].find((s) => s.selected);
  return segment?.value ?? '';
}

/** Shows the saved theme in the controls. */
function syncThemeControls() {
  const theme = gbTheme()?.get();
  if (!theme) return;
  for (const swatch of swatches) swatch.checked = swatch.value === theme.seed;
  if (seedInput) seedInput.value = theme.seed;
  if (seedHex) seedHex.textContent = theme.seed;
  if (variantSelect) variantSelect.value = theme.variant;
  selectSegment(modeSet, theme.mode);
  selectSegment(contrastSet, theme.contrast);
}

addEventListener('gb-theme-change', syncThemeControls);
addEventListener('gb-tool-open', (e) => {
  if ((e as CustomEvent<string>).detail === 'theme') syncThemeControls();
});

for (const swatch of swatches) {
  swatch.addEventListener('change', () => {
    if (swatch.checked) gbTheme()?.setSeed(swatch.value);
  });
}
seedInput?.addEventListener('input', () => gbTheme()?.setSeed(seedInput.value));
variantSelect?.addEventListener('change', () =>
  gbTheme()?.setVariant(variantSelect.value as SchemeVariant),
);
modeSet?.addEventListener('change', () => {
  const mode = selectedSegment(modeSet);
  if (mode && mode !== gbTheme()?.get().mode) gbTheme()?.setMode(mode);
});
contrastSet?.addEventListener('change', () => {
  const contrast = selectedSegment(contrastSet);
  if (contrast && contrast !== gbTheme()?.get().contrast) gbTheme()?.setContrast(contrast);
});
$('gb-theme-reset')?.addEventListener('click', () => gbTheme()?.reset());

// --- Send feedback ---------------------------------------------------------------------

interface DialogElement extends HTMLElement {
  show(): Promise<void>;
  close(returnValue?: string): Promise<void>;
}
interface FieldElement extends HTMLElement {
  value: string;
  error: boolean;
}

const feedbackDialog = $<DialogElement>('gb-feedback-dialog');
const feedbackPage = $<FieldElement>('gb-feedback-page');
const feedbackType = $<FieldElement>('gb-feedback-type');
const feedbackMessage = $<FieldElement>('gb-feedback-message');
let feedbackFrom: HTMLElement | null = null;

/** The title of the page without the site name. */
const pageTitle = () => document.title.replace(/ - Material Web 3\.0$/, '');

function openFeedback(from: HTMLElement | null) {
  feedbackFrom = from;
  if (feedbackPage) feedbackPage.value = location.href;
  if (feedbackMessage) {
    feedbackMessage.value = '';
    feedbackMessage.error = false;
  }
  void feedbackDialog?.show();
}

/** The GitHub new-issue URL of the feedback form. */
export function feedbackUrl(type: string, page: string, message: string): string {
  const params = new URLSearchParams({
    title: `[3.0 docs] ${type}: ${pageTitle()}`,
    body: `${message.trim()}\n\n---\nPage: ${page}\nType: ${type}`,
  });
  return `${REPO}/issues/new?${params}`;
}

function submitFeedback() {
  if (!feedbackMessage || !feedbackType || !feedbackPage) return;
  if (!feedbackMessage.value.trim()) {
    feedbackMessage.error = true;
    feedbackMessage.focus();
    return;
  }
  const url = feedbackUrl(feedbackType.value || 'bug', feedbackPage.value || location.href, feedbackMessage.value);
  window.open(url, '_blank', 'noopener');
  void feedbackDialog?.close('submit');
}

$('gb-feedback-submit')?.addEventListener('click', submitFeedback);
$('gb-feedback-cancel')?.addEventListener('click', () => void feedbackDialog?.close('cancel'));
$('gb-feedback-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  submitFeedback();
});
feedbackMessage?.addEventListener('input', () => (feedbackMessage.error = false));
feedbackDialog?.addEventListener('closed', () => feedbackFrom?.focus());
