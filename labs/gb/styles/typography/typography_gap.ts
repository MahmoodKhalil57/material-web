/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

// Red tests (gaps): not counted as tested.
//
// 1. typography-244c47: "Each axis and property, such as font, line height,
//    size, tracking, and weight, also has an individual token". The tokens
//    have one `font` shorthand plus `-tracking` and `-axes`; there are no
//    `-size`, `-line-height`, `-weight` or `-font` tokens.
// 2. typography-54318e, typography-1d8cee, typography-9cbff4,
//    typography-8513fa, typography-63df31, typography-9f0998,
//    typography-0bd294, typography-d6d5a7: line heights adapt to the
//    language height category (medium ~7%, large ~30%, extra large ~100%
//    taller; medium by default).
//
// Both need the typography token generator
// (scripts/m3/spec-tokens.mjs / typography-tokens.scss) to emit the
// individual tokens, which then also lets a language height multiplier apply.

import {adoptStyles} from '../adopt-styles.js';
import {styles as m3Styles} from '../m3.cssresult.js';

adoptStyles(document, [m3Styles]);

function read(token: string, rootStyle = '') {
  const root = document.documentElement;
  const saved = root.getAttribute('style');
  root.style.cssText += ';' + rootStyle;
  const el = document.createElement('div');
  el.style.cssText = `font-size: var(--md-sys-typescale-body-lg-size); line-height: var(--md-sys-typescale-body-lg-line-height); font-weight: var(--md-sys-typescale-body-lg-weight)`;
  document.body.append(el);
  const s = getComputedStyle(el);
  const result = {size: s.fontSize, lineHeight: s.lineHeight, weight: s.fontWeight, token};
  el.remove();
  if (saved === null) root.removeAttribute('style'); else root.setAttribute('style', saved);
  return result;
}

describe('individual type tokens (gap)', () => {
  it('has size, line height and weight tokens per style', () => {
    const style = read('body-lg');
    expect(style.size).toBe('16px');
    expect(style.lineHeight).toBe('24px');
    expect(style.weight).toBe('400');
  });
});

describe('language height (gap)', () => {
  it('defaults to the medium language height and grows line height for taller scripts', () => {
    const medium = parseFloat(read('body-lg').lineHeight);
    const large = parseFloat(read('body-lg', '--md-sys-language-height: large').lineHeight);
    const extraLarge = parseFloat(read('body-lg', '--md-sys-language-height: extra-large').lineHeight);
    expect(large).toBeGreaterThan(medium * 1.2);
    expect(extraLarge).toBeGreaterThan(medium * 1.8);
  });
});
