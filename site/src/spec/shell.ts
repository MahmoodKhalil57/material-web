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
 * App actions: `cycleColorMode` (system -> light -> dark). State changes
 * apply the color mode and reduced motion to the document and save them.
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

import {createStateStore, type Spec} from '@json-render/core';
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
  });

  // The content isn't part of the spec yet: keep its nodes across hydration.
  const kept = document.createDocumentFragment();
  kept.append(...content.childNodes);
  hydrateSpec(spec, shell, {
    store,
    handlers: {
      cycleColorMode: () => {
        const mode = store.get('/colorMode') as ColorMode;
        store.set('/colorMode', MODES[(MODES.indexOf(mode) + 1) % MODES.length]);
      },
    },
  });
  document.getElementById('gb-content')?.append(kept);
  apply(store.getSnapshot());
  store.subscribe(() => apply(store.getSnapshot()));
  if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
}

boot();
