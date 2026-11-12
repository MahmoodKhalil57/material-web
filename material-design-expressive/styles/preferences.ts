/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  SCHEME_VARIANTS,
  themeFromSource,
  themeToCss,
  type SchemeVariant,
} from './color/dynamic-color.js';
import {REDUCED_MOTION_CLASS} from './motion/motion.js';
import {PREFERENCES_KEY, THEME_CSS_VERSION, THEME_STYLE_ID} from './preferences-script.js';

export {prePaintScript, PREFERENCES_KEY, THEME_STYLE_ID} from './preferences-script.js';

/** The color mode: the system's (`auto`), or light or dark. */
export type ColorMode = 'auto' | 'light' | 'dark';

/** A named contrast level of a dynamic theme. */
export type ThemeContrast = 'standard' | 'medium' | 'high';

/** A dynamic color theme: its seed color, scheme variant and contrast. */
export interface ThemePreference {
  /** The seed (source) color, as `#rrggbb`. */
  seed: string;
  variant: SchemeVariant;
  contrast: ThemeContrast;
}

/** A person's appearance preferences for an app. */
export interface Preferences {
  colorMode: ColorMode;
  /** Reduce motion in the app, whatever the platform setting. */
  reduceMotion: boolean;
  theme: ThemePreference;
}

/** Where preferences are kept and applied. */
export interface PreferencesOptions {
  /**
   * The storage key: the preferences are kept as JSON under it, and the
   * generated theme CSS under `<key>-theme-css`. Default `md-preferences`.
   */
  key?: string;
  /** The storage. Default `localStorage` (none when it is unavailable). */
  storage?: Storage | null;
  /** The id of the `<style>` that holds the theme CSS. Default `md-theme`. */
  styleId?: string;
}

/** The baseline theme, which needs no CSS (the M3 baseline tokens). */
export const DEFAULT_THEME: Readonly<ThemePreference> = Object.freeze({
  seed: '#6750a4',
  variant: 'tonal-spot',
  contrast: 'standard',
});

export const DEFAULT_PREFERENCES: Readonly<Preferences> = Object.freeze({
  colorMode: 'auto',
  reduceMotion: false,
  theme: DEFAULT_THEME,
});

const COLOR_MODES: readonly ColorMode[] = ['auto', 'light', 'dark'];
const CONTRASTS: readonly ThemeContrast[] = ['standard', 'medium', 'high'];

function storageOf(options: PreferencesOptions): Storage | null {
  if (options.storage !== undefined) return options.storage;
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null; // Storage is off (an opaque origin, some private modes).
  }
}

const keyOf = (options: PreferencesOptions) => options.key ?? PREFERENCES_KEY;

function read(storage: Storage | null, key: string): string | null {
  try {
    return storage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function write(storage: Storage | null, key: string, value: string | null) {
  try {
    if (value === null) storage?.removeItem(key);
    else storage?.setItem(key, value);
  } catch {
    // Storage is full or off: the preferences last for the page.
  }
}

/** Whether a theme is the baseline one. */
export function isDefaultTheme(theme: ThemePreference): boolean {
  return (
    theme.seed.toLowerCase() === DEFAULT_THEME.seed &&
    theme.variant === DEFAULT_THEME.variant &&
    theme.contrast === DEFAULT_THEME.contrast
  );
}

/**
 * Preferences from any value (parsed JSON, a form's state): what is valid
 * is kept, the rest is the default.
 */
export function normalizePreferences(value: unknown): Preferences {
  const v = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>;
  const t = (v['theme'] && typeof v['theme'] === 'object' ? v['theme'] : {}) as Record<string, unknown>;
  const seed = typeof t['seed'] === 'string' && /^#[0-9a-f]{6}$/i.test(t['seed']) ? t['seed'].toLowerCase() : DEFAULT_THEME.seed;
  return {
    colorMode: COLOR_MODES.includes(v['colorMode'] as ColorMode) ? (v['colorMode'] as ColorMode) : 'auto',
    reduceMotion: v['reduceMotion'] === true,
    theme: {
      seed,
      variant: (SCHEME_VARIANTS as readonly string[]).includes(t['variant'] as string)
        ? (t['variant'] as SchemeVariant)
        : DEFAULT_THEME.variant,
      contrast: CONTRASTS.includes(t['contrast'] as ThemeContrast) ? (t['contrast'] as ThemeContrast) : 'standard',
    },
  };
}

/** The saved preferences, or the defaults. */
export function loadPreferences(options: PreferencesOptions = {}): Preferences {
  try {
    return normalizePreferences(JSON.parse(read(storageOf(options), keyOf(options)) ?? 'null'));
  } catch {
    return normalizePreferences(null);
  }
}

/** Saves preferences (the defaults clear them). */
export function savePreferences(preferences: Preferences, options: PreferencesOptions = {}) {
  const storage = storageOf(options);
  const p = normalizePreferences(preferences);
  const isDefault = p.colorMode === 'auto' && !p.reduceMotion && isDefaultTheme(p.theme);
  write(storage, keyOf(options), isDefault ? null : JSON.stringify(p));
  if (isDefaultTheme(p.theme)) write(storage, `${keyOf(options)}-theme-css`, null);
}

/**
 * The CSS of a dynamic theme: the color role tokens of its seed, variant and
 * contrast, with light-dark() values (so they follow the color mode), at
 * :root and outside any cascade layer (so they win over the baseline
 * tokens). A standard-contrast theme also gets its high-contrast roles
 * under `prefers-contrast: more`. The baseline theme needs none: ''.
 */
export function themeCss(theme: ThemePreference): string {
  if (isDefaultTheme(theme)) return '';
  const make = (contrast: ThemeContrast) =>
    themeToCss(themeFromSource({source: theme.seed, variant: theme.variant, contrast}), {layer: ''});
  return theme.contrast === 'standard'
    ? `${make('standard')}@media (prefers-contrast: more){${make('high')}}`
    : make(theme.contrast);
}

/** The cache key of a theme's CSS. */
const themeKey = (theme: ThemePreference) => `${THEME_CSS_VERSION}|${theme.seed}|${theme.variant}|${theme.contrast}`;

/**
 * Applies preferences to a document: its color scheme (`color-scheme` on
 * the root: `light dark` for auto), reduced motion (the `md-motion-reduced`
 * class on the root, which the library's motion follows), and the theme's
 * CSS in a `<style>` in its head (generated once, then cached in storage).
 */
export function applyPreferences(
  preferences: Preferences,
  options: PreferencesOptions & {document?: Document} = {},
) {
  const doc = options.document ?? document;
  const root = doc.documentElement;
  const p = normalizePreferences(preferences);
  root.style.colorScheme = p.colorMode === 'auto' ? 'light dark' : p.colorMode;
  root.classList.toggle(REDUCED_MOTION_CLASS, p.reduceMotion);

  const styleId = options.styleId ?? THEME_STYLE_ID;
  let style = doc.getElementById(styleId);
  if (isDefaultTheme(p.theme)) {
    style?.remove();
    return;
  }
  const storage = storageOf(options);
  const cacheKey = `${keyOf(options)}-theme-css`;
  let css = '';
  try {
    const cached = JSON.parse(read(storage, cacheKey) ?? 'null');
    if (cached?.key === themeKey(p.theme)) css = String(cached.css);
  } catch {
    // Regenerated below.
  }
  if (!css) {
    css = themeCss(p.theme);
    write(storage, cacheKey, JSON.stringify({key: themeKey(p.theme), css}));
  }
  if (!style) {
    style = doc.createElement('style');
    style.id = styleId;
    doc.head.append(style);
  }
  if (style.textContent !== css) style.textContent = css;
}
