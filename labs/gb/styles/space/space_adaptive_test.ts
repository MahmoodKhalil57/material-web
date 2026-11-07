/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {adoptStyles} from '../adopt-styles.js';
import layoutStyles from '../layout/md-layout-tokens.cssresult.js';
import {styles as m3Styles} from '../m3.cssresult.js';

adoptStyles(document, [m3Styles, layoutStyles]);

/** An adaptive spacing token, as seen inside a window of a width. */
function at(width: number, token: string) {
  const frame = document.createElement('div');
  frame.className = 'md-window';
  frame.style.width = `${width}px`;
  const child = document.createElement('div');
  child.style.paddingLeft = `var(--md-sys-space-adaptive-${token})`;
  frame.append(child);
  document.body.append(frame);
  const result = parseFloat(getComputedStyle(child).paddingLeft);
  frame.remove();
  return result;
}

describe('adaptive spacing', () => {
  // spec: spacing-88b700, spacing-d841d0
  it('maps the spacing to different system tokens for each window size class', () => {
    expect(at(400, 'inline')).toBe(16);
    expect(at(700, 'inline')).toBe(24);
    expect(at(1000, 'inline')).toBe(24);
    expect(at(1400, 'inline')).toBe(32);
    expect(at(2000, 'inline')).toBe(32);
    expect(at(400, 'gap')).toBeLessThan(at(1400, 'gap'));
    expect(at(400, 'block')).toBeLessThan(at(2000, 'block'));
  });

  // spec: spacing-d841d0
  it('follows the spacing unit, so density still scales it', () => {
    const root = document.documentElement;
    root.style.setProperty('--md-sys-space-unit', '4px');
    try {
      expect(at(400, 'inline')).toBe(8);
    } finally {
      root.style.removeProperty('--md-sys-space-unit');
    }
  });
});
