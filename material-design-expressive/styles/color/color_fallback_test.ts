/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {emulateMedia} from '@web/test-runner-commands';

import {themeFromSource, themeToCss} from './dynamic-color.js';
import {styles as contrastStyles} from './md-color-tokens-contrast.cssresult.js';
import {styles as colorStyles} from './md-color-tokens.cssresult.js';

/**
 * Removes every `@supports (color: light-dark(...)) {...}` block, leaving the
 * CSS a browser without `light-dark()` would use.
 */
function withoutLightDark(css: string): string {
  let out = '';
  let i = 0;
  const re = /@supports\s*\(color:\s*light-dark\(/g;
  for (let m = re.exec(css); m; m = re.exec(css)) {
    out += css.slice(i, m.index);
    let depth = 0;
    let j = css.indexOf('{', m.index);
    for (; j < css.length; j++) {
      if (css[j] === '{') depth++;
      if (css[j] === '}' && --depth === 0) break;
    }
    i = j + 1;
    re.lastIndex = i;
  }
  return out + css.slice(i);
}

/** Removes the `prefers-color-scheme: dark` blocks (a negative control). */
function withoutDarkMedia(css: string): string {
  return css.replace(
    /@media\s*\([^)]*prefers-color-scheme:\s*dark\)\s*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g,
    '',
  );
}

const sheets: HTMLStyleElement[] = [];
function install(css: string) {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.append(style);
  sheets.push(style);
}

function token(role: string, el: Element = document.documentElement) {
  return getComputedStyle(el).getPropertyValue(`--md-sys-color-${role}`).trim();
}

describe('color tokens without light-dark()', () => {
  afterEach(async () => {
    sheets.splice(0).forEach((s) => s.remove());
    await emulateMedia({colorScheme: 'no-preference'});
  });

  it('strips to rules with no light-dark() at all', () => {
    for (const {cssText} of [colorStyles, contrastStyles]) {
      expect(cssText).toContain('@supports');
      expect(withoutLightDark(cssText)).not.toContain('light-dark(');
    }
  });

  it('uses the light value, and the dark one under prefers-color-scheme: dark', async () => {
    install(withoutLightDark(colorStyles.cssText));
    await emulateMedia({colorScheme: 'light'});
    expect(token('primary')).toBe('#6750a4');
    expect(token('on-primary')).toBe('#fff');
    await emulateMedia({colorScheme: 'dark'});
    expect(token('primary')).toBe('#d0bcff');
    expect(token('on-primary')).toBe('#381e72');
    // Roles that do not change between schemes keep their value.
    expect(token('primary-fixed')).toBe('#eaddff');
  });

  it('would stay light without the prefers-color-scheme rules (control)', async () => {
    install(withoutDarkMedia(withoutLightDark(colorStyles.cssText)));
    await emulateMedia({colorScheme: 'dark'});
    expect(token('primary')).toBe('#6750a4');
  });

  it('keeps the contrast levels, light and dark', async () => {
    install(withoutLightDark(contrastStyles.cssText));
    const levels = {
      standard: ['#6750a4', '#d0bcff'],
      medium: ['#4f378b', '#eaddff'],
      high: ['#381e72', '#f6edff'],
    };
    for (const [level, [light, dark]] of Object.entries(levels)) {
      const el = document.createElement('div');
      el.className = `md-contrast-${level}`;
      document.body.append(el);
      await emulateMedia({colorScheme: 'light'});
      expect(token('primary', el)).withContext(`${level} light`).toBe(light);
      await emulateMedia({colorScheme: 'dark'});
      expect(token('primary', el)).withContext(`${level} dark`).toBe(dark);
      el.remove();
    }
  });

  it('keeps light-dark() where supported', async () => {
    install(colorStyles.cssText);
    const el = document.createElement('div');
    el.style.color = 'var(--md-sys-color-primary)';
    document.body.append(el);
    // The declaration is light-dark(), which follows color-scheme.
    expect(token('primary')).toContain('light-dark(#6750a4, #d0bcff)');
    el.style.colorScheme = 'light';
    expect(getComputedStyle(el).color).toBe('rgb(103, 80, 164)');
    el.style.colorScheme = 'dark';
    expect(getComputedStyle(el).color).toBe('rgb(208, 188, 255)');
    el.remove();
  });

  it('serializes a generated theme with the same fallback', async () => {
    const theme = themeFromSource({source: '#00696b'});
    install(withoutLightDark(themeToCss(theme)));
    await emulateMedia({colorScheme: 'light'});
    expect(token('primary')).toBe(theme.light.primary);
    await emulateMedia({colorScheme: 'dark'});
    expect(token('primary')).toBe(theme.dark.primary);
    expect(token('primary')).not.toBe(theme.light.primary);
  });
});
