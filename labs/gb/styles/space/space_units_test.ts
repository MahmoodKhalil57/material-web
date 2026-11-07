/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {adoptStyles} from '../adopt-styles.js';
import {styles as m3Styles} from '../m3.cssresult.js';

adoptStyles(document, [m3Styles]);

function px(token: string) {
  const el = document.createElement('div');
  el.style.width = `var(--md-sys-space-${token})`;
  document.body.append(el);
  const width = getComputedStyle(el).width;
  el.remove();
  return parseFloat(width);
}

describe('spacing tokens', () => {
  // spec: spacing-06ccd6, spacing-ba7a94, spacing-c9c082, spacing-de3cd3, spacing-f7303c, spacing-38c0e6
  it('are multiples of the 8dp space100 unit, from 0x to 9x', () => {
    expect(px('100')).toBe(8);
    expect(px('0')).toBe(0);
    expect(px('200')).toBe(16);
    expect(px('300')).toBe(24);
    expect(px('400')).toBe(32);
    expect(px('900')).toBe(72);
    expect(px('50')).toBe(4);
  });
});
