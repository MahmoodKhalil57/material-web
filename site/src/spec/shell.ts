/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The /3.0/ site in the browser (layout gb/spec.html): hydrates the page's
 * shell spec (eleventy-helpers/gb-shell-spec.cjs) with the library's
 * renderer, with the reader's saved preferences as its state, and keeps the
 * page's content (rendered from its own spec at build time) in the live
 * shell.
 *
 * - App actions: `cycleColorMode` (system -> light -> dark), `toggleMotion`,
 *   the tools' (tools.ts: download, copy, install, theme, feedback) and the
 *   search's (search.ts). State changes apply the color mode, reduced motion
 *   and theme to the document and save them.
 * - Demo frames get the page's theme (`gb-demo-theme` messages).
 * - Navigation (navigation.ts): route progress, speculation rules, the
 *   service worker. The WebMCP tools (webmcp.ts).
 * - A page without a shell spec (the all-pages document, /3.0/all/) gets
 *   the theme, the demo frames' theme and the WebMCP tools.
 */

import '@material/web/components/appbar/md-gb-app-bar.js';
import '@material/web/components/button/md-gb-button.js';
import '@material/web/components/iconbutton/md-gb-icon-button.js';
import '@material/web/components/navbar/md-gb-nav-bar-item.js';
import '@material/web/components/navbar/md-gb-nav-bar.js';
import '@material/web/components/navrail/md-gb-nav-rail-item.js';
import '@material/web/components/navrail/md-gb-nav-rail.js';
import '@material/web/extras/prose/md-gb-prose.js';
import '@material/web/extras/scaffold/md-gb-app-scaffold.js';
import '@material/web/styles/icons/md-gb-icon.js';

import '@material/web/components/chip/md-gb-chip-set.js';
import '@material/web/components/chip/md-gb-chip.js';
import '@material/web/components/dialog/md-gb-dialog.js';
import '@material/web/components/list/md-gb-list-item.js';
import '@material/web/components/list/md-gb-list.js';
import '@material/web/components/loadingindicator/md-gb-loading-indicator.js';
import '@material/web/components/progress/md-gb-progress.js';
import '@material/web/components/search/md-gb-search-bar.js';
import '@material/web/components/segmentedbutton/md-gb-segmented-button-set.js';
import '@material/web/components/segmentedbutton/md-gb-segmented-button.js';
import '@material/web/components/sheet/md-gb-side-sheet.js';
import '@material/web/components/snackbar/md-gb-snackbar.js';
import '@material/web/components/textfield/md-gb-text-field.js';
import '@material/web/extras/select/md-gb-select-option.js';
import '@material/web/extras/select/md-gb-select.js';

import {createStateStore, type Spec, type StateStore} from '@json-render/core';
import {hydrateSpec, type ActionHandler} from '@material/web/json-render/renderer.js';
import {adoptStyles} from '@material/web/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/styles/m3.cssresult.js';

import {setUpNavigation} from './navigation.js';
import {openSearch, searchHandlers} from './search.js';
import {applyTheme, savedTheme, toolHandlers} from './tools.js';
import './webmcp.js';

type ColorMode = 'auto' | 'light' | 'dark';
const MODES: ColorMode[] = ['auto', 'light', 'dark'];

const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage is off (private mode): the preference lasts for the page.
  }
};

const savedMode = (): ColorMode => {
  const saved = read('color-mode');
  return MODES.includes(saved as ColorMode) ? (saved as ColorMode) : 'auto';
};

/** Applies the color mode and reduced motion to the document, and saves them. */
function apply(state: Record<string, unknown>) {
  const root = document.documentElement;
  const mode = (state['colorMode'] as ColorMode) ?? 'auto';
  root.style.colorScheme = mode === 'auto' ? 'light dark' : mode;
  write('color-mode', mode);
  // The library's motion tokens resolve to 0ms inside .md-motion-reduced;
  // data-motion makes the layout's matchMedia answer "reduce".
  root.classList.toggle('md-motion-reduced', Boolean(state['reduceMotion']));
  if (state['reduceMotion']) root.dataset['motion'] = 'reduce';
  else delete root.dataset['motion'];
  write('gb-reduce-motion', state['reduceMotion'] ? '1' : '0');
  if ('railExpanded' in state) write('gb-rail', state['railExpanded'] === false ? 'collapsed' : 'expanded');
}

/** Generates and applies the theme's CSS, unless it is the one applied last. */
let lastTheme = '';
function applyThemeIfChanged(theme: Parameters<typeof applyTheme>[0]) {
  const key = `${theme.seed}|${theme.variant}|${theme.contrast}`;
  if (key === lastTheme) return;
  lastTheme = key;
  try {
    applyTheme(theme);
  } catch (e) {
    console.warn('Could not generate the theme', e);
  }
}

/**
 * Demo iframes (md-gb-demo previews with a script) get the page's theme:
 * its generated CSS and color scheme, when they're ready and on changes.
 * Returns the function that sends it to every frame.
 */
function serveDemoTheme(): () => void {
  const theme = () => ({
    type: 'gb-demo-theme',
    css: document.getElementById('gb-theme-style')?.textContent ?? '',
    colorScheme: document.documentElement.style.colorScheme,
  });
  addEventListener('message', (e) => {
    if (e.data?.type === 'gb-demo-ready') (e.source as Window | null)?.postMessage(theme(), '*');
  });
  return () => {
    // Slotted frames, and the frames md-gb-demo renders for `srcdoc`.
    for (const demo of document.querySelectorAll('md-gb-demo')) {
      for (const frame of [...demo.querySelectorAll('iframe'), ...(demo.shadowRoot?.querySelectorAll('iframe') ?? [])]) {
        frame.contentWindow?.postMessage(theme(), '*');
      }
    }
  };
}

/** A page without the shell: its theme and the demo frames' theme. */
function bootPage() {
  apply({colorMode: savedMode(), reduceMotion: read('gb-reduce-motion') === '1'});
  applyThemeIfChanged(savedTheme());
  serveDemoTheme();
  setUpNavigation(null);
}

function bootShell(spec: Spec, shell: HTMLElement, content: HTMLElement) {
  const store: StateStore = createStateStore({
    ...spec.state,
    colorMode: savedMode(),
    reduceMotion: read('gb-reduce-motion') === '1',
    railExpanded: read('gb-rail') !== 'collapsed',
    theme: savedTheme(),
  });
  const siteUrl = String(spec.state?.['siteUrl'] ?? location.origin);

  // The content is static HTML from its own spec: keep its nodes across
  // the shell's hydration.
  const kept = document.createDocumentFragment();
  kept.append(...content.childNodes);
  const handlers: Record<string, ActionHandler> = {
    ...toolHandlers(store, siteUrl),
    ...searchHandlers(store, (action, params) => handlers[action]?.(params)),
    cycleColorMode: () => {
      const mode = store.get('/colorMode') as ColorMode;
      store.set('/colorMode', MODES[(MODES.indexOf(mode) + 1) % MODES.length]);
    },
    toggleMotion: () => store.set('/reduceMotion', !store.get('/reduceMotion')),
  };
  hydrateSpec(spec, shell, {store, handlers});
  document.getElementById('gb-content')?.append(kept);
  apply(store.getSnapshot());
  applyThemeIfChanged(store.get('/theme') as Parameters<typeof applyTheme>[0]);
  const broadcast = serveDemoTheme();
  store.subscribe(() => {
    apply(store.getSnapshot());
    applyThemeIfChanged(store.get('/theme') as Parameters<typeof applyTheme>[0]);
    broadcast();
  });
  if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();

  // Ctrl/Cmd+K and "/" (outside text fields) open search; ?q= opens it
  // with a query.
  addEventListener('keydown', (e) => {
    const typing = (e.target as Element | null)?.closest?.('input, textarea, [contenteditable], md-gb-text-field, md-gb-search-bar');
    const shortcut = ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') || (e.key === '/' && !typing);
    if (!shortcut) return;
    e.preventDefault();
    openSearch(store);
  });
  const q = new URLSearchParams(location.search).get('q');
  if (q) {
    openSearch(store, q);
    void handlers['search']?.({});
  }

  setUpNavigation(store);
}

function boot() {
  adoptStyles(document, [m3Styles]);
  const specScript = document.getElementById('gb-shell-spec');
  const shell = document.getElementById('gb-shell');
  const content = document.getElementById('gb-content');
  if (!specScript || !shell || !content) {
    bootPage();
    return;
  }
  bootShell(JSON.parse(specScript.textContent ?? '{}') as Spec, shell, content);
}

boot();
