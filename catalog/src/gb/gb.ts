/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Client script of the /3.0/ site shell (site/_includes/gb/default.html):
 * registers the labs/gb components it uses, keeps the dynamic color theme
 * (seed, scheme variant, contrast and color mode: `window.gbTheme`, the
 * customize theme sheet is in shell.ts), marks the current section in the
 * table of contents, adds copy buttons to code blocks and collapses the code
 * of demo cards. The layout (rail, pages pane, sheets, FAB menu) is shell.ts.
 */

import '@material/web/labs/gb/components/button/md-gb-button.js';
import '@material/web/labs/gb/components/divider/md-gb-divider.js';
import '@material/web/labs/gb/components/iconbutton/md-gb-icon-button.js';
import '@material/web/labs/gb/components/tabs/md-gb-tab.js';
import '@material/web/labs/gb/components/tabs/md-gb-tabs.js';
import '@material/web/labs/gb/styles/icon/md-gb-icon.js';

import './shell.js';
import './download.js';
import './navigation.js';
import './search.js';
import './webmcp.js';

import {
  themeFromSource,
  themeToCss,
  type SchemeVariant,
} from '@material/web/labs/gb/styles/color/dynamic-color.js';

const DEFAULT_SEED = '#6750a4';
const DEFAULT_VARIANT: SchemeVariant = 'tonal-spot';
/**
 * Bump when themeToCss output or the cache key changes: the pre-paint script
 * in catalog/site/_includes/gb/default.html ignores caches of other versions.
 */
const THEME_CACHE_VERSION = 3;
/**
 * The 3.0 site's own seed key: the v2.5 site saves its default seed under
 * `seed-color` on first visit, which would recolor 3.0 without a choice.
 */
const SEED_KEY = 'gb-seed-color';
const VARIANT_KEY = 'gb-scheme-variant';
const CONTRAST_KEY = 'gb-contrast';
const MODE_KEY = 'color-mode';
const MODES = ['auto', 'light', 'dark'] as const;
type Mode = (typeof MODES)[number];
const CONTRASTS = ['standard', 'medium', 'high'] as const;
type Contrast = (typeof CONTRASTS)[number];
const VARIANTS: readonly SchemeVariant[] = [
  'tonal-spot',
  'neutral',
  'vibrant',
  'expressive',
  'fidelity',
  'content',
  'monochrome',
  'rainbow',
  'fruit-salad',
];
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

function remove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore.
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

export interface GbThemeState {
  seed: string;
  variant: SchemeVariant;
  contrast: Contrast;
  mode: Mode;
}

function getMode(): Mode {
  const mode = read(MODE_KEY);
  return (MODES as readonly string[]).includes(mode ?? '')
    ? (mode as Mode)
    : 'auto';
}

function getSeed(): string {
  const seed = read(SEED_KEY);
  return seed && /^#[0-9a-f]{6}$/i.test(seed) ? seed.toLowerCase() : DEFAULT_SEED;
}

function getVariant(): SchemeVariant {
  const variant = read(VARIANT_KEY);
  return (VARIANTS as readonly string[]).includes(variant ?? '')
    ? (variant as SchemeVariant)
    : DEFAULT_VARIANT;
}

function getContrast(): Contrast {
  const contrast = read(CONTRAST_KEY);
  return (CONTRASTS as readonly string[]).includes(contrast ?? '')
    ? (contrast as Contrast)
    : 'standard';
}

function state(): GbThemeState {
  return {
    seed: getSeed(),
    variant: getVariant(),
    contrast: getContrast(),
    mode: getMode(),
  };
}

/** Every control that cycles the color mode (the rail's and the sheet's). */
const toggles = () =>
  document.querySelectorAll<HTMLElement>('#gb-theme, [data-theme-toggle]');

function applyMode(mode: Mode) {
  document.documentElement.style.colorScheme =
    mode === 'auto' ? 'light dark' : mode;
  const next = MODES[(MODES.indexOf(mode) + 1) % MODES.length];
  for (const button of toggles()) {
    button.dataset['mode'] = mode;
    const label = `Color theme: ${MODE_NAME[mode]}. Change to ${MODE_NAME[next]}`;
    button.setAttribute('aria-label', label);
    const icon = button.querySelector('md-gb-icon');
    if (icon) icon.textContent = MODE_ICON[mode];
    const text = button.querySelector('.gb-theme-toggle-label');
    if (text) text.textContent = `Theme: ${MODE_NAME[mode]}`;
  }
}

/**
 * Generates the dynamic color CSS for a theme (light-dark() values, so it
 * follows color-scheme; standard contrast also gets the high contrast values
 * under prefers-contrast: more) and applies and caches it. The baseline
 * tokens are the default theme's, which needs no generated CSS.
 */
function applyTheme() {
  const {seed, variant, contrast} = state();
  const style = document.getElementById('gb-theme-style');
  if (seed === DEFAULT_SEED && variant === DEFAULT_VARIANT && contrast === 'standard') {
    style?.remove();
    remove('gb-theme-css');
    return;
  }
  const key = [seed, variant, contrast].join('|');
  const cached = read('gb-theme-css');
  let css = '';
  try {
    const parsed = cached ? JSON.parse(cached) : null;
    if (parsed?.v === THEME_CACHE_VERSION && parsed.key === key) css = parsed.css;
  } catch {
    // Regenerate below.
  }
  if (!css) {
    // Unlayered, so it wins over the baseline tokens (layer md.sys.color)
    // that demos adopt into the document after this style element.
    const make = (level: Contrast) =>
      themeToCss(themeFromSource({source: seed, variant, contrast: level}), {
        layer: '',
      });
    css =
      contrast === 'standard'
        ? `${make('standard')}@media (prefers-contrast: more){${make('high')}}`
        : make(contrast);
    write('gb-theme-css', JSON.stringify({v: THEME_CACHE_VERSION, key, css}));
  }
  let el = style;
  if (!el) {
    el = document.createElement('style');
    el.id = 'gb-theme-style';
    document.head.append(el);
  }
  el.textContent = css;
}

function safeApplyTheme() {
  try {
    applyTheme();
  } catch (e) {
    console.warn('Could not generate the theme', e);
  }
}

function changed() {
  window.dispatchEvent(new CustomEvent('gb-theme-change', {detail: state()}));
}

safeApplyTheme();

/**
 * The theme of the site, for the customize theme sheet (shell.ts), WebMCP
 * and scripts. Every change applies at once, is remembered (localStorage) and
 * reaches the demo iframes. `gb-theme-change` is fired on window.
 */
const gbTheme = {
  get(): GbThemeState {
    return state();
  },
  /** Sets the seed color of the dynamic theme and remembers it. */
  setSeed(hex: string) {
    write(SEED_KEY, hex.toLowerCase());
    safeApplyTheme();
    changed();
  },
  setVariant(variant: SchemeVariant) {
    // The seed is always saved with a customized theme (the pre-paint cache).
    write(SEED_KEY, getSeed());
    write(VARIANT_KEY, variant);
    safeApplyTheme();
    changed();
  },
  setContrast(contrast: Contrast) {
    write(SEED_KEY, getSeed());
    write(CONTRAST_KEY, contrast);
    safeApplyTheme();
    changed();
  },
  setMode(mode: Mode) {
    write(MODE_KEY, mode);
    applyMode(mode);
    announce(`Color theme: ${MODE_NAME[mode]}`);
    changed();
  },
  /** Back to the baseline theme and the system color mode. */
  reset() {
    for (const key of [SEED_KEY, VARIANT_KEY, CONTRAST_KEY, MODE_KEY, 'gb-theme-css']) {
      remove(key);
    }
    safeApplyTheme();
    applyMode('auto');
    announce('Theme reset');
    changed();
  },
};
(window as unknown as {gbTheme: typeof gbTheme}).gbTheme = gbTheme;

applyMode(getMode());
addEventListener('click', (event) => {
  const button = (event.target as Element | null)?.closest?.(
    '#gb-theme, [data-theme-toggle]',
  );
  if (!button) return;
  gbTheme.setMode(MODES[(MODES.indexOf(getMode()) + 1) % MODES.length]);
});

// --- Table of contents ---------------------------------------------------

// The outline (a navigation rail's destinations, default.html) shows the
// section being read as the active destination: `selected` for the active
// indicator, and aria-current="location" (a place in this page, not the
// item's own "page").
{
  const targets = new Map<Element, HTMLElement[]>();
  for (const item of document.querySelectorAll<HTMLElement>(
    '.gb-toc md-gb-nav-rail-item[href^="#"]',
  )) {
    const id = decodeURIComponent((item.getAttribute('href') ?? '').slice(1));
    const el = document.getElementById(id);
    if (el) targets.set(el, [...(targets.get(el) ?? []), item]);
  }
  if (targets.size && 'IntersectionObserver' in window) {
    let current: HTMLElement[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const items = targets.get(entry.target);
          if (!items || items === current) continue;
          for (const item of current) {
            item.removeAttribute('selected');
            item.removeAttribute('aria-current');
          }
          for (const item of items) {
            item.setAttribute('selected', '');
            item.setAttribute('aria-current', 'location');
          }
          current = items;
        }
      },
      // The content scrolls in its own pane below the header.
      {rootMargin: '-80px 0px -70% 0px'},
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
