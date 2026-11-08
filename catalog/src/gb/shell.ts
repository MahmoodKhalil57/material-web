/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The layout of the /3.0/ site (imported by gb.ts; markup in
 * site/_includes/gb/default.html, styles in shell.css): a search app bar,
 * and the navigation rail, navigation bar and sheets of labs/gb:
 *
 * - Medium (600px and up) and expanded (840px and up) windows: an M3
 *   Expressive navigation rail, the only navigation. Its menu button
 *   expands it to show the current section's pages as secondary
 *   destinations (in place of a navigation drawer). From 840px the expanded
 *   rail is beside the content, expanded unless the reader collapsed it
 *   (remembered); below, it expands modal over the content.
 * - Compact windows (below 600px): a navigation bar with the sections.
 *   Selecting the current one again opens its pages in a bottom sheet.
 * - All sizes: the header's actions, Download & copy (download.ts) and
 *   Customize theme in a side sheet (a bottom sheet when compact), and Send
 *   feedback in a dialog that opens a prefilled GitHub issue.
 *
 * Prerender safe: nothing here reads the network or the clipboard.
 */

import '@material/web/labs/gb/components/appbar/md-gb-app-bar.js';
import '@material/web/labs/gb/components/dialog/md-gb-dialog.js';
import '@material/web/labs/gb/components/divider/md-gb-divider.js';
import '@material/web/labs/gb/components/fab/md-gb-fab.js';
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

// --- Transitions -------------------------------------------------------------------

/** A motion token's value: a duration in ms, or an easing. */
function token(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

let swapping = false;

/**
 * Changes a panel between two states with a clean fade (motion
 * transitions.md, Applying transitions: "Fully fade out content before
 * fading new content in"): `targets` fade out (fast effects), `change` runs
 * (the panel's size then moves on its spatial spring, in CSS), and the new
 * `targets` fade in (default effects) while it settles. Under reduced motion
 * the fades stay ("subtle fades instead of ... sliding"); CSS drops the size
 * change's motion.
 */
async function swapWithFade(targets: () => Element[], change: () => void) {
  if (swapping) return;
  swapping = true;
  try {
    const out = targets().map((el) =>
      el.animate(
        {opacity: [1, 0]},
        {
          duration: parseFloat(token('--md-sys-motion-spring-fast-effects-duration')) || 140,
          easing: token('--md-sys-motion-spring-fast-effects') || 'ease',
          fill: 'forwards',
        },
      ),
    );
    await Promise.all(out.map((a) => a.finished.catch(() => {})));
    change();
    const fadeIn = {
      duration: parseFloat(token('--md-sys-motion-spring-default-effects-duration')) || 220,
      easing: token('--md-sys-motion-spring-default-effects') || 'ease',
      fill: 'backwards' as FillMode,
    };
    for (const el of targets()) el.animate({opacity: [0, 1]}, fadeIn);
    for (const a of out) a.cancel();
  } finally {
    swapping = false;
  }
}

// --- Navigation rail: collapsed and expanded -----------------------------------------

interface RailElement extends HTMLElement {
  expanded: boolean;
  modal: boolean;
}

interface DrawerElement extends HTMLElement {
  open: boolean;
  quick: boolean;
}

const RAIL_KEY = 'gb-rail';
const root = document.documentElement;
const rail = $<RailElement>('gb-rail');
const sectionItem = rail?.querySelector<HTMLElement>('md-gb-nav-rail-item[data-section][data-current]') ?? null;
const pageItem = rail?.querySelector<HTMLElement>('md-gb-nav-rail-item[secondary][data-current]') ?? null;
const currentSection = sectionItem ? sectionOf(sectionItem) : 'about';

/**
 * One active destination (navigation-rail.md: the active indicator only for
 * the current page): the section while the rail is collapsed, the page
 * among the section's pages while it's expanded.
 */
function syncActive() {
  if (!rail || !sectionItem) return;
  const page = rail.expanded && pageItem;
  sectionItem.toggleAttribute('selected', !page);
  pageItem?.toggleAttribute('selected', !!page);
}

if (rail) {
  // From 840px the expanded rail is standard (beside the content, expanded
  // unless the reader collapsed it, remembered); below it, the rail is
  // collapsed and expands modal over the content.
  const place = () => {
    rail.modal = !expanded.matches;
    rail.expanded = expanded.matches && root.dataset['rail'] !== 'collapsed';
    syncActive();
  };
  place();
  expanded.addEventListener('change', place);
  // Expanding and collapsing morph in the rail itself (md-gb-nav-rail): the
  // icons stay, the active pill stretches, the labels fade in; the column
  // reveals or clips it (shell.css).
  rail.addEventListener('toggle', () => {
    if (expanded.matches) {
      if (rail.expanded) delete root.dataset['rail'];
      else root.dataset['rail'] = 'collapsed';
      store(RAIL_KEY, rail.expanded ? null : 'collapsed');
    }
    syncActive();
  });
}

/** The current section's pages, for the pages sheet (compact windows). */
function pagesOf(section: string): {nodes: Node[]; label: string} | null {
  const template = document.querySelector<HTMLTemplateElement>(
    `template[data-pages="${section}"]`,
  );
  if (!template) return null;
  return {
    nodes: [...(template.content.cloneNode(true) as DocumentFragment).childNodes],
    label: template.dataset['label'] ?? section,
  };
}

// --- Page outline ----------------------------------------------------------------------

const OUTLINE_KEY = 'gb-outline';
const outline = $('gb-outline');
const outlineOpenButton = $('gb-outline-toggle');
const outlineClose = $('gb-outline-close');
const outlineFab = $('gb-outline-fab');
const outlineSheet = $<SheetElement>('gb-outline-sheet');

/** From 840px: a column, open unless the reader closed it (remembered). */
const outlineOpen = () => root.dataset['outline'] !== 'closed';

function setOutline(open: boolean) {
  if (open) delete root.dataset['outline'];
  else root.dataset['outline'] = 'closed';
  store(OUTLINE_KEY, open ? null : 'closed');
  outlineOpenButton?.setAttribute('aria-expanded', String(open));
}

if (outline) {
  outlineOpenButton?.setAttribute('aria-expanded', String(outlineOpen()));
  // The outline and the strip swap with a clean fade while the column
  // resizes.
  const strip = outlineOpenButton?.closest('.gb-outline-strip');
  const showing = () => [outlineOpen() ? outline : strip].filter((el): el is Element => !!el);
  outlineClose?.addEventListener('click', () => {
    void swapWithFade(showing, () => setOutline(false)).then(() => outlineOpenButton?.focus());
  });
  outlineOpenButton?.addEventListener('click', () => {
    void swapWithFade(showing, () => setOutline(true)).then(() => outlineClose?.focus());
  });
}

// Below 840px: the FAB opens the outline in a bottom sheet; a heading closes
// it and scrolls there.
outlineFab?.addEventListener('click', () => {
  const body = outline?.querySelector('.gb-outline-body');
  if (!outlineSheet || !body) return;
  const list = body.cloneNode(true) as HTMLElement;
  list.classList.add('gb-sheet-outline');
  const title = document.createElement('h2');
  title.className = 'gb-sheet-title';
  title.textContent = 'On this page';
  list.prepend(title);
  outlineSheet.replaceChildren(list);
  returnFocus.set(outlineSheet, outlineFab);
  void outlineSheet.show();
});
outlineSheet?.addEventListener('click', (e) => {
  const item = (e.target as Element).closest<HTMLElement>('md-gb-nav-rail-item[href^="#"]');
  if (!item) return;
  e.preventDefault();
  const hash = item.getAttribute('href') ?? '';
  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  // The FAB keeps focus after the sheet; the heading is where to read next.
  returnFocus.set(outlineSheet, null);
  void outlineSheet.close().then(() => {
    target?.scrollIntoView({block: 'start'});
    history.replaceState(null, '', hash);
  });
});
outlineSheet?.addEventListener('closed', () => {
  returnFocus.get(outlineSheet)?.focus();
  outlineSheet.replaceChildren();
});

// --- Keyboard scrolling --------------------------------------------------------------

// The page is one screen high and the content scrolls in its own pane, so the
// scrolling keys pressed with nothing focused scroll that pane (they would
// scroll the document, which doesn't scroll).
const contentPane = $('gb-content-pane');
addEventListener('keydown', (e) => {
  if (!contentPane || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
  const active = document.activeElement;
  if (active && active !== document.body && active !== document.documentElement) return;
  const page = contentPane.clientHeight * 0.9;
  const steps: Record<string, number> = {
    PageDown: page,
    PageUp: -page,
    ' ': e.shiftKey ? -page : page,
    ArrowDown: 40,
    ArrowUp: -40,
  };
  if (e.key === 'Home' || e.key === 'End') {
    e.preventDefault();
    contentPane.scrollTo({top: e.key === 'Home' ? 0 : contentPane.scrollHeight});
  } else if (e.key in steps) {
    e.preventDefault();
    contentPane.scrollBy({top: steps[e.key]});
  }
});

// --- Component groups: split rows that collapse their pages ------------------------

// In the expanded rail and in the pages sheet of compact windows; the same
// choices apply to both.
const GROUPS_KEY = 'gb-groups';

function savedGroups(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(GROUPS_KEY) || '{}');
  } catch {
    return {};
  }
}

/**
 * A group's disclosure button: in the rail, the button itself (it's
 * slotted); in the sheet's drawer, the button in the group's row.
 */
const groupToggle = (list: ParentNode, id: string) =>
  list.querySelector<HTMLElement>(
    `.gb-rail-group[data-group-toggle="${id}"], .gb-pane-group[data-group="${id}"] .gb-pane-group-toggle`,
  );

/** The group a disclosure button shows or hides. */
const groupOf = (toggle: HTMLElement) =>
  toggle.dataset['groupToggle'] ??
  toggle.closest<HTMLElement>('.gb-pane-group')?.dataset['group'] ??
  '';

/** Shows or hides a group's pages in `list` and updates its toggle. */
function setGroup(list: ParentNode, id: string, open: boolean) {
  groupToggle(list, id)?.setAttribute('aria-expanded', String(open));
  for (const item of list.querySelectorAll<HTMLElement>(
    `md-gb-nav-drawer-item[data-group="${id}"], md-gb-nav-rail-item[data-group="${id}"]`,
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

/** Toggles a group from its button in the rail or the pages sheet. */
function handleGroupToggle(e: Event) {
  const toggle = (e.target as Element).closest<HTMLElement>('.gb-pane-group-toggle');
  const list = toggle?.closest('md-gb-nav-rail, md-gb-nav-drawer');
  if (!toggle || !list) return;
  const id = groupOf(toggle);
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  setGroup(list, id, open);
  const saved = savedGroups();
  saved[id] = open;
  store(GROUPS_KEY, JSON.stringify(saved));
}

// --- Compact: the navigation bar and the pages sheet ------------------------------

const pagesSheet = $<SheetElement>('gb-pages-sheet');
const pagesFoot = $('gb-pages-foot');
pagesSheet?.addEventListener('click', handleGroupToggle);
rail?.addEventListener('click', handleGroupToggle);

function openPagesSheet(trigger: HTMLElement) {
  if (!pagesSheet) return;
  const pages = pagesOf(currentSection);
  if (!pages) return;
  const list = document.createElement('md-gb-nav-drawer') as DrawerElement;
  list.className = 'gb-sheet-drawer';
  list.setAttribute('label', `${pages.label} pages`);
  list.append(...pages.nodes);
  applySavedGroups(list);
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

// --- Header: the more menu, and the actions that don't fit ---------------------------

const appBar = $('gb-appbar');
const moreMenu = $('gb-more-menu');
const moreButton = $('gb-more');
const overflowButton = $('gb-overflow');

/** The visible button that opened the more menu (focus returns there). */
const moreInvoker = () =>
  moreButton && !moreButton.hidden ? moreButton : overflowButton;

/**
 * The trailing actions the app bar hides at the current window size class
 * (2 up to medium, 4 from expanded) appear at the top of the more menu.
 */
function mirrorOverflow(actions: Element[]) {
  if (!moreMenu) return;
  for (const old of moreMenu.querySelectorAll('[data-mirror]')) old.remove();
  const mirrored = actions.filter((a) => a !== moreButton) as HTMLElement[];
  if (!mirrored.length) return;
  const first = moreMenu.firstElementChild;
  for (const action of mirrored) {
    const item = document.createElement('md-gb-menu-item');
    item.dataset['mirror'] = '';
    const icon = document.createElement('md-gb-icon');
    icon.slot = 'leading';
    icon.textContent = action.querySelector('md-gb-icon')?.textContent ?? '';
    item.append(icon, action.getAttribute('aria-label') ?? '');
    item.addEventListener('click', () => {
      // The menu closes first, then the hidden action runs as if pressed.
      setTimeout(() => action.click(), 0);
    });
    moreMenu.insertBefore(item, first);
  }
  const divider = document.createElement('md-gb-divider');
  divider.dataset['mirror'] = '';
  moreMenu.insertBefore(divider, first);
}

appBar?.addEventListener('overflowchange', (e) => {
  mirrorOverflow((e as CustomEvent<{overflowed: Element[]}>).detail.overflowed);
});

moreMenu?.addEventListener('click', (e) => {
  const item = (e.target as Element).closest<HTMLElement>('md-gb-menu-item');
  if (!item) return;
  if (item.dataset['version'] === '2.5') {
    // v2.5.0 is the site root; 3.0 stays under /3.0/.
    location.assign('/');
  } else if (item.dataset['open']) {
    window.open(item.dataset['open'], '_blank', 'noopener');
  } else if (item.dataset['tool'] === 'feedback') {
    // The menu is closing and returns focus to its button.
    setTimeout(() => openFeedback(moreInvoker()), 0);
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
/** Where focus returns when a sheet or the dialog closes. */
const returnFocus = new Map<HTMLElement, HTMLElement | null>();

let openTool: HTMLElement | null = null;

function openToolSheet(name: string, trigger: HTMLElement | null) {
  const body = $(`gb-${name}-body`);
  if (!body) return;
  const sheet = compact.matches ? toolsSheet : sideSheet;
  if (!sheet) return;
  openTool = body;
  if (sheet === sideSheet) sheet.headline = body.dataset['title'] ?? '';
  sheet.replaceChildren(body);
  returnFocus.set(sheet, trigger);
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

// The header's tool buttons (and their copies in the more menu).
appBar?.addEventListener('click', (e) => {
  const button = (e.target as Element).closest<HTMLElement>('[data-tool]');
  const tool = button?.dataset['tool'];
  if (!button || !tool || button.closest('md-gb-menu')) return;
  if (tool === 'feedback') openFeedback(button);
  // A hidden button (moved to the more menu) returns focus to that menu's button.
  else openToolSheet(tool, button.hidden ? moreInvoker() : button);
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
