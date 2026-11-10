/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {adoptStyles} from '../adopt-styles.js';
import {styles as m3Styles} from '../m3.cssresult.js';

adoptStyles(document, [m3Styles]);

/**
 * The width of `value`, with `rootStyle` declared on the root (the tokens
 * are computed there, so a product customizes them there).
 */
function width(value: string, rootStyle = '', parentStyle = '') {
  const root = document.documentElement;
  const saved = root.getAttribute('style');
  root.style.cssText += ';' + rootStyle;
  const parent = document.createElement('div');
  parent.style.cssText = parentStyle;
  const el = document.createElement('div');
  el.style.width = value;
  parent.append(el);
  document.body.append(parent);
  const result = parseFloat(getComputedStyle(el).width);
  parent.remove();
  if (saved === null) root.removeAttribute('style'); else root.setAttribute('style', saved);
  return result;
}

describe('spacing system tokens', () => {
  // spec: spacing-29496e
  it('has tokens for the in-between values 2, 4, 6 and 10dp', () => {
    expect(width('var(--md-sys-space-25)')).toBe(2);
    expect(width('var(--md-sys-space-50)')).toBe(4);
    expect(width('var(--md-sys-space-75)')).toBe(6);
    expect(width('var(--md-sys-space-125)')).toBe(10);
  });

  // spec: spacing-84bdaf, spacing-fca6f4, spacing-38e5d6
  it('resolves to final values that a product can adapt to form factor or density', () => {
    const compact = '--md-sys-space-unit: 4px';
    expect(width('var(--md-sys-space-200)', compact)).toBe(8);
    expect(width('var(--md-sys-space-300)', compact)).toBe(12);
    // Remapping one token changes every use of it.
    expect(width('var(--md-sys-space-100)', '--md-sys-space-100: var(--md-sys-space-200)')).toBe(16);
  });

  // spec: spacing-b4d25b, spacing-d50048, spacing-58da4e
  it('lets a product add tokens that follow the multiplier pattern', () => {
    const own = '--md-sys-space-225: calc(var(--md-sys-space-unit) * 2.25)';
    expect(width('var(--md-sys-space-225)', own)).toBe(18);
    // A taller padding by mapping to space200 instead of space125.
    expect(width('var(--md-sys-space-200)')).toBeGreaterThan(width('var(--md-sys-space-125)'));
  });

  // spec: spacing-55ba8a
  it('keeps the same spacing when text is scaled up to 200%', () => {
    expect(width('var(--md-sys-space-200)', '', 'font-size: 32px')).toBe(16);
  });
});
