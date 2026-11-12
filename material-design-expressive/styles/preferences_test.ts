/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {
  applyPreferences,
  DEFAULT_PREFERENCES,
  loadPreferences,
  normalizePreferences,
  prePaintScript,
  savePreferences,
  themeCss,
  type Preferences,
} from './preferences.js';

/** A Storage in memory. */
function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k) => map.get(k) ?? null,
    key: (i) => [...map.keys()][i] ?? null,
    removeItem: (k) => void map.delete(k),
    setItem: (k, v) => void map.set(k, String(v)),
  };
}

const THEMED: Preferences = {
  colorMode: 'dark',
  reduceMotion: true,
  theme: {seed: '#3b6e3b', variant: 'vibrant', contrast: 'standard'},
};

describe('preferences', () => {
  let doc: Document;
  let storage: Storage;
  beforeEach(() => {
    doc = document.implementation.createHTMLDocument('');
    storage = memoryStorage();
  });

  it('keeps what is valid and defaults the rest', () => {
    expect(normalizePreferences(null)).toEqual({...DEFAULT_PREFERENCES, theme: {...DEFAULT_PREFERENCES.theme}});
    const p = normalizePreferences({colorMode: 'sepia', reduceMotion: 'yes', theme: {seed: '#ABCDEF', variant: 'nope', contrast: 'high'}});
    expect(p).toEqual({colorMode: 'auto', reduceMotion: false, theme: {seed: '#abcdef', variant: 'tonal-spot', contrast: 'high'}});
  });

  it('saves and loads them, and clears the defaults', () => {
    savePreferences(THEMED, {storage});
    expect(loadPreferences({storage})).toEqual(THEMED);
    savePreferences({...DEFAULT_PREFERENCES}, {storage});
    expect(storage.length).toBe(0);
    expect(loadPreferences({storage})).toEqual(normalizePreferences(null));
  });

  it('loads the defaults from broken storage', () => {
    storage.setItem('md-preferences', '{not json');
    expect(loadPreferences({storage}).colorMode).toBe('auto');
  });

  it('applies the color scheme, reduced motion and the theme', () => {
    applyPreferences(THEMED, {storage, document: doc});
    const root = doc.documentElement;
    expect(root.style.colorScheme).toBe('dark');
    expect(root.classList.contains('md-motion-reduced')).toBeTrue();
    const style = doc.getElementById('md-theme')!;
    expect(style.textContent).toBe(themeCss(THEMED.theme));
    expect(style.textContent).toContain('--md-sys-color-primary');
    expect(style.textContent).toContain('prefers-contrast: more');
  });

  it('caches the theme CSS and reuses it', () => {
    applyPreferences(THEMED, {storage, document: doc});
    const cached = JSON.parse(storage.getItem('md-preferences-theme-css')!);
    expect(cached.css).toBe(themeCss(THEMED.theme));
    storage.setItem('md-preferences-theme-css', JSON.stringify({...cached, css: '/* cached */'}));
    const other = document.implementation.createHTMLDocument('');
    applyPreferences(THEMED, {storage, document: other});
    expect(other.getElementById('md-theme')!.textContent).toBe('/* cached */');
  });

  it('removes the theme CSS for the baseline theme, and follows the system for auto', () => {
    applyPreferences(THEMED, {storage, document: doc});
    applyPreferences({...DEFAULT_PREFERENCES}, {storage, document: doc});
    expect(doc.getElementById('md-theme')).toBeNull();
    expect(doc.documentElement.style.colorScheme).toBe('light dark');
    expect(doc.documentElement.classList.contains('md-motion-reduced')).toBeFalse();
  });

  it('applies the saved preferences before first paint with the same result', () => {
    // The page applied them once (generating and caching the theme CSS).
    const key = `md-preferences-test-${Math.random().toString(36).slice(2)}`;
    savePreferences(THEMED, {key, storage: localStorage});
    applyPreferences(THEMED, {key, storage: localStorage, document: doc, styleId: `${key}-style`});
    // The next page load runs the script against localStorage.
    const fresh = document.implementation.createHTMLDocument('');
    const run = new Function('document', 'localStorage', prePaintScript({key, styleId: `${key}-style`}));
    try {
      run(fresh, localStorage);
      expect(fresh.documentElement.style.colorScheme).toBe('dark');
      expect(fresh.documentElement.classList.contains('md-motion-reduced')).toBeTrue();
      expect(fresh.getElementById(`${key}-style`)!.textContent).toBe(themeCss(THEMED.theme));
    } finally {
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}-theme-css`);
    }
  });
});
