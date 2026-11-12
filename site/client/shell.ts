/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The /3.0/ site in the browser (layout spec.html): hydrates the page's
 * shell spec (spec/shell.cjs, embedded by the build) with the library's
 * renderer, keeping the page's content (the shell's static `gb-content`
 * island) as it is, with the reader's preferences as its state.
 *
 * - Preferences: the library's styles/preferences.ts loads, saves and
 *   applies the color mode, reduced motion and theme the shell's state
 *   holds (`/colorMode`, `/reduceMotion`, `/theme`).
 * - App actions: `cycleColorMode` (system -> light -> dark), `toggleMotion`,
 *   the tools' (tools.ts: download, copy, install, theme, feedback) and the
 *   search's (search.ts).
 * - Demo frames get the page's theme (`gb-demo-theme` messages).
 * - Navigation (navigation.ts): route progress, speculation rules, the
 *   service worker. The WebMCP tools (webmcp.ts).
 * - A page without a shell spec (the all-pages document, /3.0/all/) gets
 *   the preferences, the demo frames' theme and the WebMCP tools.
 */

import '@material/web/components/appbar/md-gb-app-bar.js';
import '@material/web/components/button/md-gb-button.js';
import '@material/web/components/iconbutton/md-gb-icon-button.js';
import '@material/web/components/navbar/md-gb-nav-bar-item.js';
import '@material/web/components/navbar/md-gb-nav-bar.js';
import '@material/web/components/navrail/md-gb-nav-rail-item.js';
import '@material/web/components/navrail/md-gb-nav-rail.js';
import '@material/web/extras/prose/md-gb-prose.js';
import '@material/web/extras/layout/md-gb-stack.js';
import '@material/web/extras/scaffold/md-gb-app-scaffold.js';
import '@material/web/extras/scaffold/md-gb-pane-scaffold.js';
import '@material/web/extras/typography/md-gb-typography.js';
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
import {hydrateSpec, readEmbeddedSpec, type ActionHandler} from '@material/web/json-render/renderer.js';
import {adoptStyles} from '@material/web/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/styles/m3.cssresult.js';
import {
  applyPreferences,
  loadPreferences,
  normalizePreferences,
  savePreferences,
  type ColorMode,
} from '@material/web/styles/preferences.js';

import {setUpNavigation} from './navigation.js';
import {openSearch, searchHandlers} from './search.js';
import {toolHandlers} from './tools.js';
import './webmcp.js';

const MODES: ColorMode[] = ['auto', 'light', 'dark'];
/** The ids of the shell's embedded spec and of its content island (spec/render.cjs). */
const SPEC_ID = 'gb-shell-spec';
const CONTENT_ID = 'gb-content';
/** Whether the rail is expanded: the site's own preference. */
const RAIL_KEY = 'gb-rail';

const readRail = () => {
  try {
    return localStorage.getItem(RAIL_KEY) !== 'collapsed';
  } catch {
    return true;
  }
};
const writeRail = (expanded: boolean) => {
  try {
    localStorage.setItem(RAIL_KEY, expanded ? 'expanded' : 'collapsed');
  } catch {
    // Storage is off (private mode): the choice lasts for the page.
  }
};

/** Applies preferences, warning (not failing) when the theme can't be generated. */
function apply(preferences: ReturnType<typeof loadPreferences>) {
  try {
    applyPreferences(preferences);
  } catch (e) {
    console.warn('Could not apply the preferences', e);
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
    css: document.getElementById('md-theme')?.textContent ?? '',
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

/** A page without the shell: its preferences and the demo frames' theme. */
function bootPage() {
  apply(loadPreferences());
  serveDemoTheme();
  setUpNavigation(null);
}

function bootShell(spec: Spec, shell: HTMLElement) {
  const saved = loadPreferences();
  const store: StateStore = createStateStore({
    ...spec.state,
    colorMode: saved.colorMode,
    reduceMotion: saved.reduceMotion,
    railExpanded: readRail(),
    // The theme tool edits the seed as text (`seedInput`) before it applies.
    theme: {...saved.theme, seedInput: saved.theme.seed},
  });
  const siteUrl = String(spec.state?.['siteUrl'] ?? location.origin);

  const handlers: Record<string, ActionHandler> = {
    ...toolHandlers(store, siteUrl),
    ...searchHandlers(store, (action, params) => handlers[action]?.(params)),
    cycleColorMode: () => {
      const mode = store.get('/colorMode') as ColorMode;
      store.set('/colorMode', MODES[(MODES.indexOf(mode) + 1) % MODES.length]);
    },
    toggleMotion: () => store.set('/reduceMotion', !store.get('/reduceMotion')),
  };
  hydrateSpec(spec, shell, {store, handlers, islands: [CONTENT_ID]});

  // The state's preferences, saved and applied when they change.
  const broadcast = serveDemoTheme();
  let applied = '';
  const sync = () => {
    const state = store.getSnapshot();
    const preferences = normalizePreferences(state);
    const key = JSON.stringify(preferences);
    if (key !== applied) {
      applied = key;
      savePreferences(preferences);
      apply(preferences);
      broadcast();
    }
    writeRail(state['railExpanded'] !== false);
  };
  sync();
  store.subscribe(sync);
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
  const spec = readEmbeddedSpec(SPEC_ID);
  const shell = document.getElementById('gb-shell');
  if (!spec || !shell) {
    bootPage();
    return;
  }
  bootShell(spec, shell);
}

boot();
