/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';

import layoutStyles from './md-layout-tokens.cssresult.js';
import {WINDOW_SIZE_CLASS_VALUES, windowSizeClass} from './window-size-class.js';

adoptStyles(document, [m3Styles, layoutStyles]);

/** A layout token, and the spacing unit, as seen at a window width. */
function at(width: number) {
  const frame = document.createElement('div');
  frame.className = 'md-window';
  frame.style.width = `${width}px`;
  const child = document.createElement('div');
  frame.append(child);
  document.body.append(frame);
  const style = getComputedStyle(child);
  const result = {
    margin: parseFloat(style.getPropertyValue('--md-sys-layout-margin')),
    spacer: parseFloat(style.getPropertyValue('--md-sys-layout-spacer')),
    unit: style.getPropertyValue('--md-sys-space-unit').trim(),
  };
  frame.remove();
  return result;
}

describe('window size class ranges', () => {
  // spec: layout-breakpoints-a9db4f, layout-breakpoints-fa4a0a, layout-breakpoints-3c5c33
  it('covers 600-839dp, 840-1199dp and 1200-1599dp', () => {
    const {medium, expanded, large} = WINDOW_SIZE_CLASS_VALUES;
    expect([medium.minWidth, medium.maxWidth! - 1]).toEqual([600, 839]);
    expect([expanded.minWidth, expanded.maxWidth! - 1]).toEqual([840, 1199]);
    expect([large.minWidth, large.maxWidth! - 1]).toEqual([1200, 1599]);
    expect(windowSizeClass(839)).toBe('medium');
    expect(windowSizeClass(1199)).toBe('expanded');
    expect(windowSizeClass(1599)).toBe('large');
  });
});

describe('spacing across breakpoints', () => {
  // spec: layout-grids-spacing-f0fda6, layout-grids-spacing-d63be0
  it('adapts margins and spacers to the breakpoint, more generous on larger windows', () => {
    expect(at(1000).margin).toBeGreaterThan(at(400).margin);
    expect(at(1000).spacer).toBeGreaterThan(at(400).spacer);
  });

  // spec: layout-grids-spacing-31505e, layout-grids-spacing-c9a84d
  it('changes density only when the spacing unit is changed, never by breakpoint', () => {
    const units = new Set([400, 700, 1000, 1300, 1700].map((w) => at(w).unit));
    expect(units.size).toBe(1);
    const root = document.documentElement;
    root.style.setProperty('--md-sys-space-unit', '4px');
    const dense = at(1000).unit;
    root.style.removeProperty('--md-sys-space-unit');
    expect(dense).toBe('4px');
  });
});
