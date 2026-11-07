/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Client script of the /3.0/ site shell (site/_includes/gb/default.html):
 * registers the labs/gb components it uses, switches the navigation drawer
 * between modal and standard, wires the version select and theme button,
 * keeps the dynamic color theme, marks the current section in the table of
 * contents, adds copy buttons to code blocks and collapses the code of demo
 * cards.
 */

import '@material/web/labs/gb/components/appbar/md-gb-app-bar.js';
import '@material/web/labs/gb/components/button/md-gb-button.js';
import '@material/web/labs/gb/components/divider/md-gb-divider.js';
import '@material/web/labs/gb/components/iconbutton/md-gb-icon-button.js';
import '@material/web/labs/gb/components/navdrawer/md-gb-nav-drawer-item.js';
import '@material/web/labs/gb/components/navdrawer/md-gb-nav-drawer.js';
import '@material/web/labs/gb/components/select/md-gb-select-option.js';
import '@material/web/labs/gb/components/select/md-gb-select.js';
import '@material/web/labs/gb/components/tabs/md-gb-tab.js';
import '@material/web/labs/gb/components/tabs/md-gb-tabs.js';
import '@material/web/labs/gb/styles/icon/md-gb-icon.js';

import './download.js';
import './navigation.js';
import './search.js';
import './webmcp.js';

import {
  themeFromSource,
  themeToCss,
} from '@material/web/labs/gb/styles/color/dynamic-color.js';

const DEFAULT_SEED = '#6750a4';
/**
 * Bump when themeToCss output changes: the pre-paint script in
 * catalog/site/_includes/gb/default.html ignores caches of other versions.
 */
const THEME_CACHE_VERSION = 2;
/**
 * The 3.0 site's own seed key: the v2.5 site saves its default seed under
 * `seed-color` on first visit, which would recolor 3.0 without a choice.
 */
const SEED_KEY = 'gb-seed-color';
const MODES = ['auto', 'light', 'dark'] as const;
type Mode = (typeof MODES)[number];
const MODE_ICON: Record<Mode, string> = {
  auto: 'brightness_auto',
  light: 'light_mode',
  dark: 'dark_mode',
};
const MODE_NAME: Record<Mode, string> = {
  auto: 'system',
  light: 'light',
  dark: 'dark',
};

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage can be blocked; the theme just is not remembered.
  }
}

function announce(message: string) {
  const status = document.getElementById('gb-status');
  if (!status) return;
  status.textContent = '';
  // A change of text is what screen readers announce.
  setTimeout(() => (status.textContent = message), 50);
}

// --- Theme ---------------------------------------------------------------

function getMode(): Mode {
  const mode = read('color-mode');
  return (MODES as readonly string[]).includes(mode ?? '')
    ? (mode as Mode)
    : 'auto';
}

function applyMode(mode: Mode) {
  document.documentElement.style.colorScheme =
    mode === 'auto' ? 'light dark' : mode;
  const button = document.getElementById('gb-theme');
  if (!button) return;
  const next = MODES[(MODES.indexOf(mode) + 1) % MODES.length];
  button.dataset['mode'] = mode;
  button.setAttribute(
    'aria-label',
    `Color theme: ${MODE_NAME[mode]}. Change to ${MODE_NAME[next]}`,
  );
  const icon = button.querySelector('md-gb-icon');
  if (icon) icon.textContent = MODE_ICON[mode];
}

/**
 * Generates the dynamic color CSS for a seed (light-dark() values, so it
 * follows color-scheme; high contrast under prefers-contrast: more) and
 * applies and caches it.
 */
function applySeed(seed: string) {
  const cached = read('gb-theme-css');
  let css = '';
  try {
    const parsed = cached ? JSON.parse(cached) : null;
    if (parsed?.v === THEME_CACHE_VERSION && parsed.seed === seed) css = parsed.css;
  } catch {
    // Regenerate below.
  }
  if (!css) {
    // Unlayered, so it wins over the baseline tokens (layer md.sys.color)
    // that demos adopt into the document after this style element.
    const standard = themeToCss(themeFromSource({source: seed}), {layer: ''});
    const high = themeToCss(themeFromSource({source: seed, contrast: 'high'}), {
      layer: '',
    });
    css = `${standard}@media (prefers-contrast: more){${high}}`;
    write('gb-theme-css', JSON.stringify({v: THEME_CACHE_VERSION, seed, css}));
  }
  let style = document.getElementById('gb-theme-style');
  if (!style) {
    style = document.createElement('style');
    style.id = 'gb-theme-style';
    document.head.append(style);
  }
  style.textContent = css;
}

const seed = read(SEED_KEY) || DEFAULT_SEED;
// The baseline tokens are the default seed's; others need generating.
if (seed.toLowerCase() !== DEFAULT_SEED) {
  try {
    applySeed(seed);
  } catch (e) {
    console.warn('Could not generate the theme from', seed, e);
  }
} else {
  // The baseline needs no generated CSS: drop any applied before paint.
  document.getElementById('gb-theme-style')?.remove();
}

/** Sets the seed color of the dynamic theme and remembers it. */
(window as unknown as {gbTheme: object}).gbTheme = {
  setSeed(hex: string) {
    write(SEED_KEY, hex);
    applySeed(hex);
  },
};

applyMode(getMode());
document.getElementById('gb-theme')?.addEventListener('click', () => {
  const mode = MODES[(MODES.indexOf(getMode()) + 1) % MODES.length];
  write('color-mode', mode);
  applyMode(mode);
  announce(`Color theme: ${MODE_NAME[mode]}`);
});

// --- Navigation drawer ---------------------------------------------------

interface DrawerElement extends HTMLElement {
  open: boolean;
  modal: boolean;
  quick: boolean;
}

const drawer = document.getElementById('gb-drawer') as DrawerElement | null;
const menu = document.getElementById('gb-menu');
const expanded = matchMedia('(min-width: 840px)');

function syncMenu() {
  if (drawer && menu) menu.setAttribute('aria-expanded', String(drawer.open));
}

if (drawer) {
  // Standard and open at expanded and up; modal and closed below.
  const place = () => {
    drawer.quick = true;
    drawer.modal = !expanded.matches;
    drawer.open = expanded.matches;
    syncMenu();
    requestAnimationFrame(() => (drawer.quick = false));
  };
  place();
  expanded.addEventListener('change', place);
  menu?.addEventListener('click', () => {
    drawer.open = !drawer.open;
    syncMenu();
  });
  for (const type of ['opened', 'closed', 'open']) {
    drawer.addEventListener(type, syncMenu);
  }
}

// --- Version select ------------------------------------------------------

const version = document.getElementById('gb-version') as
  | (HTMLElement & {value: string})
  | null;
version?.addEventListener('change', () => {
  // v2.5.0 is the site root; 3.0 stays under /3.0/.
  if (version.value === '2.5') location.assign('/');
});

// --- Table of contents ---------------------------------------------------

const tocDetails = document.getElementById(
  'gb-toc-details',
) as HTMLDetailsElement | null;
if (tocDetails) {
  // A column on large windows (always open); collapsible above the text below.
  const large = matchMedia('(min-width: 1200px)');
  tocDetails.open = large.matches;
  large.addEventListener('change', () => (tocDetails.open = large.matches));
  const targets = new Map<Element, HTMLAnchorElement>();
  for (const link of tocDetails.querySelectorAll<HTMLAnchorElement>(
    'a[href^="#"]',
  )) {
    const el = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    if (el) targets.set(el, link);
  }
  if (targets.size && 'IntersectionObserver' in window) {
    let current: HTMLAnchorElement | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const link = targets.get(entry.target);
          if (!link || link === current) continue;
          current?.removeAttribute('aria-current');
          link.setAttribute('aria-current', 'location');
          current = link;
        }
      },
      {rootMargin: '-72px 0px -70% 0px'},
    );
    for (const el of targets.keys()) observer.observe(el);
  }
}

// --- Copy buttons --------------------------------------------------------

let codeIndex = 0;
for (const pre of document.querySelectorAll<HTMLElement>('.gb-content pre')) {
  // The v2.5 markdown pipeline wraps code blocks in <copy-code-button>;
  // that element is not part of this site.
  const old = pre.parentElement;
  if (old?.localName === 'copy-code-button') old.replaceWith(pre);
  // Demo cards (shortcodes/gb.cjs) come with the wrapper, so nothing moves.
  let wrap = pre.parentElement!;
  if (!wrap.classList.contains('gb-code')) {
    wrap = document.createElement('div');
    wrap.className = 'gb-code';
    pre.replaceWith(wrap);
    wrap.append(pre);
  }
  // A scrollable region must be reachable and named for keyboard users.
  pre.tabIndex = 0;
  pre.setAttribute('role', 'region');
  const lang = pre.dataset['file'] ?? /language-(w+)/.exec(pre.className)?.[1]?.toUpperCase();
  pre.setAttribute('aria-label', `${lang ? lang + ' code' : 'Code'} ${++codeIndex}`);

  const button = document.createElement('md-gb-icon-button');
  button.className = 'gb-copy';
  button.setAttribute('aria-label', 'Copy code');
  button.innerHTML = '<md-gb-icon>content_copy</md-gb-icon>';
  let timer: number | undefined;
  button.addEventListener('click', async () => {
    const icon = button.querySelector('md-gb-icon')!;
    try {
      await navigator.clipboard.writeText(pre.textContent ?? '');
      icon.textContent = 'check';
      announce('Code copied');
    } catch {
      announce('Copying failed');
    }
    clearTimeout(timer);
    timer = window.setTimeout(() => (icon.textContent = 'content_copy'), 2000);
  });
  wrap.append(button);
}

// --- Tables ---------------------------------------------------------------

// A wide table scrolls inside a named, focusable region (not the table
// itself, whose semantics stay intact).
let tableIndex = 0;
for (const table of document.querySelectorAll<HTMLElement>(
  '.gb-content table',
)) {
  const wrap = document.createElement('div');
  wrap.className = 'gb-table';
  wrap.tabIndex = 0;
  wrap.setAttribute('role', 'region');
  wrap.setAttribute('aria-label', `Table ${++tableIndex}`);
  table.replaceWith(wrap);
  wrap.append(table);
}

// --- Demo cards ------------------------------------------------------------

// Code longer than a few lines is collapsed to its first lines (CSS, under
// :root.js, so the height is reserved before this runs) behind a "View code"
// button. The collapsed code is inert: its hidden part is out of the tab
// order and the accessibility tree, while the copy button stays usable.
let demoIndex = 0;
for (const demo of document.querySelectorAll<HTMLElement>(
  '.gb-demo:not([data-short])',
)) {
  const wraps = [...demo.querySelectorAll<HTMLElement>('.gb-code')];
  const pres = wraps.map((w) => w.querySelector('pre')).filter((p) => p);
  if (!wraps.length) continue;
  ++demoIndex;
  wraps.forEach((w, i) => (w.id ||= `gb-demo-code-${demoIndex}-${i}`));
  const button = document.createElement('md-gb-button');
  button.className = 'gb-demo-toggle';
  button.setAttribute('color', 'tonal');
  button.setAttribute('aria-controls', wraps.map((w) => w.id).join(' '));
  const set = (open: boolean) => {
    demo.toggleAttribute('data-open', open);
    for (const pre of pres) pre!.inert = !open;
    button.setAttribute('aria-expanded', String(open));
    button.textContent = open ? 'Hide code' : 'View code';
  };
  set(false);
  button.addEventListener('click', () => {
    set(!demo.hasAttribute('data-open'));
  });
  wraps[wraps.length - 1].after(button);
}

// --- Demo previews with a script (iframes) ------------------------------------

// The iframe documents (shortcodes/gb-demo.cjs) report their height, and
// get the page's theme (the generated dynamic color CSS and the color scheme)
// when they are ready and whenever it changes.
const frames = [...document.querySelectorAll<HTMLIFrameElement>('iframe.gb-demo-frame')];
if (frames.length) {
  const theme = () => ({
    type: 'gb-demo-theme',
    css: document.getElementById('gb-theme-style')?.textContent ?? '',
    colorScheme: document.documentElement.style.colorScheme,
  });
  const send = (frame: HTMLIFrameElement) =>
    frame.contentWindow?.postMessage(theme(), '*');
  addEventListener('message', (e) => {
    const frame = frames.find((f) => f.contentWindow === e.source);
    if (!frame) return;
    if (e.data?.type === 'gb-demo-ready') send(frame);
    if (e.data?.type === 'gb-demo-height') {
      const min = Number(frame.dataset['min']) || 0;
      frame.style.blockSize = Math.max(min, e.data.height) + 'px';
    }
  });
  for (const frame of frames) frame.addEventListener('load', () => send(frame));
  const broadcast = () => frames.forEach(send);
  new MutationObserver(broadcast).observe(document.head, {
    childList: true,
    subtree: true,
    characterData: true,
  });
  new MutationObserver(broadcast).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['style'],
  });
}
