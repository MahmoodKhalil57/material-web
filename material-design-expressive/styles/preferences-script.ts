/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview The pre-paint script of ./preferences.ts, on its own: it
 * imports nothing that needs a browser, so a build step or a server (Node)
 * can write it into pages.
 */

/** The default storage key of the preferences. */
export const PREFERENCES_KEY = 'md-preferences';
/** The default id of the `<style>` that holds the theme CSS. */
export const THEME_STYLE_ID = 'md-theme';
/** Bump when the theme CSS changes: cached CSS of another version is regenerated. */
export const THEME_CSS_VERSION = 1;
/** The class that reduces the library's motion (./motion/motion.ts). */
const REDUCED_MOTION_CLASS = 'md-motion-reduced';

/**
 * The source of an inline script for the page's `<head>` that applies the
 * saved preferences (./preferences.ts) before the first paint, from storage
 * alone: the color scheme, reduced motion, and the theme's cached CSS (when
 * the cache matches the saved theme; else applyPreferences() generates it
 * once the page's modules run). Put it in a classic `<script>` before the
 * stylesheets.
 */
export function prePaintScript(options: {key?: string; styleId?: string} = {}): string {
  const key = JSON.stringify(options.key ?? PREFERENCES_KEY);
  const styleId = JSON.stringify(options.styleId ?? THEME_STYLE_ID);
  return `(() => {
  try {
    const root = document.documentElement;
    const p = JSON.parse(localStorage.getItem(${key}) || 'null') || {};
    root.style.colorScheme = ['light', 'dark'].includes(p.colorMode) ? p.colorMode : 'light dark';
    if (p.reduceMotion === true) root.classList.add(${JSON.stringify(REDUCED_MOTION_CLASS)});
    const t = p.theme || {};
    const cached = JSON.parse(localStorage.getItem(${key} + '-theme-css') || 'null');
    const themeKey = [${THEME_CSS_VERSION}, String(t.seed).toLowerCase(), t.variant, t.contrast].join('|');
    if (cached && cached.key === themeKey && cached.css) {
      const style = document.createElement('style');
      style.id = ${styleId};
      style.textContent = cached.css;
      document.head.append(style);
    }
  } catch (e) {}
})();`;
}
