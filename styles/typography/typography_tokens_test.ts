/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {adoptStyles} from '../adopt-styles.js';
import {styles as m3Styles} from '../m3.cssresult.js';

adoptStyles(document, [m3Styles]);

/** The computed type of an element using the body-lg style, in a `lang`. */
function bodyLarge(lang?: string, tokens = ['size', 'line-height', 'weight']) {
  const el = document.createElement('div');
  if (lang) el.lang = lang;
  el.textContent = 'x';
  el.style.cssText = `font-size: var(--md-sys-typescale-body-lg-${tokens[0]}); line-height: var(--md-sys-typescale-body-lg-${tokens[1]}); font-weight: var(--md-sys-typescale-body-lg-${tokens[2]})`;
  document.body.append(el);
  const s = getComputedStyle(el);
  const result = {size: s.fontSize, lineHeight: parseFloat(s.lineHeight), weight: s.fontWeight};
  el.remove();
  return result;
}

describe('individual type tokens', () => {
  // spec: typography-244c47
  it('has size, line height and weight tokens per style', () => {
    const style = bodyLarge();
    expect(style.size).toBe('16px');
    expect(style.lineHeight).toBe(24);
    expect(style.weight).toBe('400');
    const root = getComputedStyle(document.documentElement);
    for (const prop of ['font', 'size', 'line-height', 'weight', 'tracking']) {
      expect(root.getPropertyValue(`--md-sys-typescale-title-md-${prop}`))
        .withContext(prop)
        .not.toBe('');
      const emphasized = root.getPropertyValue(`--md-sys-typescale-emphasized-label-sm-${prop}`);
      if (prop === 'tracking') {
        // The emphasized styles define no tracking token (only axes, size,
        // weight); this pins that so a change is noticed.
        expect(emphasized).withContext('emphasized tracking').toBe('');
      } else {
        expect(emphasized).withContext(`emphasized ${prop}`).not.toBe('');
      }
    }
  });
});

describe('language height', () => {
  // spec: typography-54318e, typography-9cbff4, typography-1d8cee
  it('adapts line height to the language height category', () => {
    const small = bodyLarge('en').lineHeight;
    expect(small).toBe(24);
    expect(bodyLarge('ja').lineHeight).toBeCloseTo(small * 1.07, 2);
    expect(bodyLarge('my').lineHeight).toBeCloseTo(small * 1.3, 2);
    expect(bodyLarge('ur').lineHeight).toBeCloseTo(small * 2, 2);
  });

  // spec: typography-9f0998
  it('makes the medium scripts about 7% taller', () => {
    for (const lang of ['ar', 'zh', 'hi', 'th', 'ko', 'vi', 'am']) {
      expect(bodyLarge(lang).lineHeight).withContext(lang).toBeCloseTo(24 * 1.07, 2);
    }
  });

  // spec: typography-0bd294
  it('makes Burmese and Telugu about 30% taller', () => {
    for (const lang of ['my', 'te']) {
      expect(bodyLarge(lang).lineHeight).withContext(lang).toBeCloseTo(24 * 1.3, 2);
    }
  });

  // spec: typography-d6d5a7
  it('makes Nastaliq about 100% taller', () => {
    for (const lang of ['ur']) {
      expect(bodyLarge(lang).lineHeight).withContext(lang).toBeCloseTo(48, 2);
    }
  });

  // spec: typography-8513fa, typography-63df31
  it('lets an app choose the default language height with one token', () => {
    const root = document.documentElement;
    root.style.setProperty('--md-sys-language-height-scale', '1.07');
    try {
      expect(bodyLarge().lineHeight).toBeCloseTo(24 * 1.07, 2);
    } finally {
      root.style.removeProperty('--md-sys-language-height-scale');
    }
    expect(bodyLarge().lineHeight).toBe(24);
  });
});
