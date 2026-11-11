/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {adoptStyles} from '../../styles/adopt-styles.js';
import layoutStyles from './md-layout-tokens.cssresult.js';
import {
  WINDOW_SIZE_CLASS_VALUES,
  windowSizeClass,
} from './window-size-class.js';

adoptStyles(document, layoutStyles);

/** Layout tokens a child of a `.md-window` of the given width sees. */
function tokens(width: number) {
  const frame = document.createElement('div');
  frame.className = 'md-window';
  frame.style.width = `${width}px`;
  const child = document.createElement('div');
  frame.append(child);
  document.body.append(frame);
  const style = getComputedStyle(child);
  const read = (name: string) => style.getPropertyValue(name).trim();
  const result = {
    margin: read('--md-sys-layout-margin'),
    spacer: read('--md-sys-layout-spacer'),
    columns: read('--md-sys-layout-columns'),
    fixed: read('--md-sys-layout-fixed-pane-width'),
  };
  frame.remove();
  return result;
}

describe('breakpoint layout tokens', () => {
  // spec: layout-breakpoints-d5e3f5, layout-breakpoints-7d0049, layout-breakpoints-6b5457, layout-breakpoints-f6af4f, layout-breakpoints-8f8a5b
  it('switches class exactly at 600, 840, 1200 and 1600dp', () => {
    expect(tokens(599).columns).toBe('4');
    expect(tokens(600).columns).toBe('8');
    expect(tokens(839).columns).toBe('8');
    expect(tokens(840).margin).toBe('24px');
    expect(windowSizeClass(839)).toBe('medium');
    expect(windowSizeClass(840)).toBe('expanded');
    expect(tokens(1199).columns).toBe('8');
    expect(tokens(1200).columns).toBe('12');
    expect(windowSizeClass(1599)).toBe('large');
    expect(windowSizeClass(1600)).toBe('extra-large');
  });

  // spec: layout-breakpoints-fcea99, layout-breakpoints-da1d19, layout-breakpoints-26d05d
  it('uses 16dp margins in compact windows', () => {
    expect(tokens(400).margin).toBe('16px');
  });

  // spec: layout-breakpoints-0be936, layout-breakpoints-134617, layout-breakpoints-5e833b, layout-breakpoints-35b640, layout-breakpoints-484dc6, layout-breakpoints-e24d01, layout-breakpoints-ff477f, layout-breakpoints-51e1cd, layout-breakpoints-b1d36c, layout-breakpoints-6d6c25, layout-breakpoints-a3ca63, layout-breakpoints-8bbd46
  it('uses 24dp margins and spacers from medium up', () => {
    for (const width of [700, 900, 1300, 1700]) {
      const t = tokens(width);
      expect(t.margin).withContext(`${width}`).toBe('24px');
      expect(t.spacer).withContext(`${width}`).toBe('24px');
    }
  });

  // spec: layout-breakpoints-dc9ca8, layout-breakpoints-007b01
  it('defaults the fixed pane to 360dp in medium and expanded windows', () => {
    expect(tokens(700).fixed).toBe('360px');
    expect(tokens(900).fixed).toBe('360px');
  });

  // spec: layout-breakpoints-94c8d1, layout-breakpoints-b3230c, layout-breakpoints-e682cf
  it('defaults the fixed pane to 412dp in large and extra-large windows', () => {
    expect(tokens(1300).fixed).toBe('412px');
    expect(tokens(1700).fixed).toBe('412px');
  });

  // spec: layout-breakpoints-9acbf0, layout-breakpoints-109bfe, layout-breakpoints-be834d
  it('allows one pane when compact, two up to large and three when extra-large', () => {
    const v = WINDOW_SIZE_CLASS_VALUES;
    expect(v.compact.panesMax).toBe(1);
    expect(v.expanded.panesMax).toBe(2);
    expect(v.large.panesMax).toBe(2);
    expect(v['extra-large'].panesMax).toBe(3);
  });

});

describe('layout grid', () => {
  // spec: layout-grids-spacing-e3883a, layout-grids-spacing-2186e2, layout-grids-spacing-15ff8a, layout-grids-spacing-47287e, layout-grids-spacing-72c2f5, layout-grids-spacing-5412b7, layout-overview-32d5d2
  it('adapts column count to the breakpoint, fewer when compact', () => {
    const counts = [400, 700, 1300].map((w) => tokens(w).columns);
    expect(counts).toEqual(['4', '8', '12']);
  });
});
