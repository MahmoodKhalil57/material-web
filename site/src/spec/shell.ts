/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The spec shell in the browser (layout gb/spec.html): hydrates the page's
 * shell spec (eleventy-helpers/gb-shell-spec.cjs) with the library's
 * renderer, with the reader's saved preferences as its state, and keeps the
 * page's content (not a spec yet) in the live shell.
 *
 * App actions: `cycleColorMode` (system -> light -> dark), and the tools'
 * (./tools.ts: download, copy, install, theme, feedback). State changes
 * apply the color mode, reduced motion and theme to the document and save
 * them.
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
import '@material/web/components/segmentedbutton/md-gb-segmented-button-set.js';
import '@material/web/components/segmentedbutton/md-gb-segmented-button.js';
import '@material/web/components/sheet/md-gb-side-sheet.js';
import '@material/web/components/snackbar/md-gb-snackbar.js';
import '@material/web/components/textfield/md-gb-text-field.js';
import '@material/web/extras/select/md-gb-select-option.js';
import '@material/web/extras/select/md-gb-select.js';

import {createStateStore, type Spec} from '@json-render/core';
import '@material/web/components/search/md-gb-search-bar.js';
import {searchHandlers} from './search.js';
import {applyTheme, savedTheme, toolHandlers} from './tools.js';
import {hydrateSpec} from '@material/web/json-render/renderer.js';
import {adoptStyles} from '@material/web/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/styles/m3.cssresult.js';

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

/** Applies the color mode and reduced motion to the document, and saves them. */
function apply(state: Record<string, unknown>) {
  const root = document.documentElement;
  const mode = (state['colorMode'] as ColorMode) ?? 'auto';
  root.style.colorScheme = mode === 'auto' ? 'light dark' : mode;
  write('color-mode', mode);
  if (state['reduceMotion']) root.dataset['motion'] = 'reduce';
  else delete root.dataset['motion'];
  write('gb-reduce-motion', state['reduceMotion'] ? '1' : '0');
  write('gb-rail', state['railExpanded'] === false ? 'collapsed' : 'expanded');
}

function boot() {
  adoptStyles(document, [m3Styles]);
  const specScript = document.getElementById('gb-shell-spec');
  const shell = document.getElementById('gb-shell');
  const content = document.getElementById('gb-content');
  if (!specScript || !shell || !content) return;
  const spec = JSON.parse(specScript.textContent ?? '{}') as Spec;

  const saved = read('color-mode');
  const store = createStateStore({
    ...spec.state,
    colorMode: MODES.includes(saved as ColorMode) ? saved : 'auto',
    reduceMotion: read('gb-reduce-motion') === '1',
    railExpanded: read('gb-rail') !== 'collapsed',
    theme: savedTheme(),
  });
  const siteUrl = String(spec.state?.['siteUrl'] ?? location.origin);

  // The content isn't part of the spec yet: keep its nodes across hydration.
  const kept = document.createDocumentFragment();
  kept.append(...content.childNodes);
  hydrateSpec(spec, shell, {
    store,
    handlers: {
      ...toolHandlers(store, siteUrl),
      ...searchHandlers(store),
      cycleColorMode: () => {
        const mode = store.get('/colorMode') as ColorMode;
        store.set('/colorMode', MODES[(MODES.indexOf(mode) + 1) % MODES.length]);
      },
    },
  });
  document.getElementById('gb-content')?.append(kept);
  apply(store.getSnapshot());
  // The theme's CSS is regenerated only when its seed, variant or contrast change.
  const themeKey = () => {
    const t = store.get('/theme') as {seed: string; variant: string; contrast: string};
    return `${t.seed}|${t.variant}|${t.contrast}`;
  };
  let lastTheme = '';
  const applyThemeIfChanged = () => {
    const key = themeKey();
    if (key === lastTheme) return;
    lastTheme = key;
    try {
      applyTheme(store.get('/theme') as Parameters<typeof applyTheme>[0]);
    } catch (e) {
      console.warn('Could not generate the theme', e);
    }
  };
  applyThemeIfChanged();

  // Demo iframes (md-gb-demo previews with a script) get the page's theme:
  // its generated CSS and color scheme, when they're ready and on changes.
  const theme = () => ({
    type: 'gb-demo-theme',
    css: document.getElementById('gb-theme-style')?.textContent ?? '',
    colorScheme: document.documentElement.style.colorScheme,
  });
  addEventListener('message', (e) => {
    if (e.data?.type === 'gb-demo-ready') (e.source as Window | null)?.postMessage(theme(), '*');
  });
  const broadcast = () => {
    // Slotted frames, and the frames md-gb-demo renders for `srcdoc`.
    for (const demo of document.querySelectorAll('md-gb-demo')) {
      for (const frame of [...demo.querySelectorAll('iframe'), ...(demo.shadowRoot?.querySelectorAll('iframe') ?? [])]) {
        frame.contentWindow?.postMessage(theme(), '*');
      }
    }
  };

  store.subscribe(() => {
    apply(store.getSnapshot());
    applyThemeIfChanged();
    broadcast();
  });
  if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();

  // Ctrl/Cmd+K and "/" (outside text fields) open search, as before.
  addEventListener('keydown', (e) => {
    const typing = (e.target as Element | null)?.closest?.('input, textarea, [contenteditable], md-gb-text-field, md-gb-search-bar');
    const shortcut = ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') || (e.key === '/' && !typing);
    if (!shortcut) return;
    const bar = document.querySelector<HTMLElement & {expanded: boolean}>('md-gb-search-bar');
    if (!bar) return;
    e.preventDefault();
    bar.expanded = true;
  });
}

boot();
