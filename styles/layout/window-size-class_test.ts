/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {adoptStyles} from '../adopt-styles.js';
import layoutStyles from './md-layout-tokens.cssresult.js';
import {
  compareWindowSizeClasses,
  isWindowHeightClassAtLeast,
  isWindowSizeClassAtLeast,
  observeWindowHeightClass,
  observeWindowSizeClass,
  WINDOW_HEIGHT_CLASS_VALUES,
  type WindowHeightClass,
  windowHeightClass,
  WINDOW_SIZE_CLASS_VALUES,
  WINDOW_SIZE_CLASSES,
  type WindowSizeClass,
  windowSizeClass,
  windowSizeClasses,
} from './window-size-class.js';

adoptStyles(document, layoutStyles);

/** Waits two frames, so ResizeObserver notifications have been delivered. */
async function frames(): Promise<void> {
  for (let i = 0; i < 2; i++) {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  }
}

describe('window size classes', () => {
  describe('windowSizeClass()', () => {
    // Spec (foundations/layout/breakpoints): compact < 600, medium 600–839,
    // expanded 840–1199, large 1200–1599, extra-large 1600+.
    const cases: Array<[number, WindowSizeClass]> = [
      [0, 'compact'],
      [599, 'compact'],
      [599.5, 'compact'],
      [600, 'medium'],
      [839, 'medium'],
      [840, 'expanded'],
      [1199, 'expanded'],
      [1200, 'large'],
      [1599, 'large'],
      [1600, 'extra-large'],
      [4000, 'extra-large'],
    ];
    for (const [width, cls] of cases) {
      it(`maps ${width}px to ${cls}`, () => {
        expect(windowSizeClass(width)).toBe(cls);
      });
    }
  });

  describe('windowHeightClass()', () => {
    // Spec (breakpoints, "Height breakpoints") names compact, medium and
    // expanded heights; ranges from the Android window size classes it
    // links to: compact < 480, medium 480–899, expanded 900+.
    const cases: Array<[number, WindowHeightClass]> = [
      [0, 'compact'],
      [479, 'compact'],
      [480, 'medium'],
      [899, 'medium'],
      [900, 'expanded'],
      [2000, 'expanded'],
    ];
    for (const [height, cls] of cases) {
      it(`maps ${height}px to ${cls}`, () => {
        expect(windowHeightClass(height)).toBe(cls);
      });
    }

    it('returns both classes with windowSizeClasses()', () => {
      // A phone in landscape: expanded width, compact height.
      expect(windowSizeClasses(900, 400)).toEqual({
        width: 'expanded',
        height: 'compact',
      });
    });

    it('compares height classes', () => {
      expect(isWindowHeightClassAtLeast('expanded', 'medium')).toBeTrue();
      expect(isWindowHeightClassAtLeast('compact', 'medium')).toBeFalse();
      expect(WINDOW_HEIGHT_CLASS_VALUES.medium).toEqual({
        minHeight: 480,
        maxHeight: 900,
      });
    });
  });

  it('has the spec margins, spacers and fixed pane widths', () => {
    const v = WINDOW_SIZE_CLASS_VALUES;
    expect(v.compact.margin).toBe(16);
    for (const cls of ['medium', 'expanded', 'large', 'extra-large'] as const) {
      expect(v[cls].margin).withContext(cls).toBe(24);
      expect(v[cls].spacer).withContext(cls).toBe(24);
    }
    expect(v.expanded.fixedPaneWidth).toBe(360);
    expect(v.large.fixedPaneWidth).toBe(412);
    expect(v['extra-large'].fixedPaneWidth).toBe(412);
  });

  it('has the spec pane totals', () => {
    const v = WINDOW_SIZE_CLASS_VALUES;
    expect(WINDOW_SIZE_CLASSES.map((c) => v[c].panesRecommended)).toEqual([
      1, 1, 2, 2, 2,
    ]);
    expect(WINDOW_SIZE_CLASSES.map((c) => v[c].panesMax)).toEqual([
      1, 2, 2, 2, 3,
    ]);
  });

  it('compares classes', () => {
    expect(compareWindowSizeClasses('compact', 'medium')).toBeLessThan(0);
    expect(compareWindowSizeClasses('large', 'large')).toBe(0);
    expect(isWindowSizeClassAtLeast('large', 'expanded')).toBeTrue();
    expect(isWindowSizeClassAtLeast('medium', 'expanded')).toBeFalse();
  });

  describe('observeWindowSizeClass()', () => {
    let el: HTMLElement;

    beforeEach(() => {
      el = document.createElement('div');
      el.style.width = '500px';
      document.body.appendChild(el);
    });

    afterEach(() => {
      el.remove();
    });

    it('reports the initial class synchronously', () => {
      const calls: string[] = [];
      const stop = observeWindowSizeClass(el, (cls) => calls.push(cls));
      expect(calls).toEqual(['compact']);
      stop();
    });

    it('reports class changes when the element resizes', async () => {
      const calls: string[] = [];
      const stop = observeWindowSizeClass(el, (cls) => calls.push(cls));
      el.style.width = '900px';
      await frames();
      expect(calls).toEqual(['compact', 'expanded']);
      stop();
    });

    it('does not report resizes within a class', async () => {
      const calls: string[] = [];
      const stop = observeWindowSizeClass(el, (cls) => calls.push(cls), {
        initial: false,
      });
      el.style.width = '550px';
      await frames();
      expect(calls).toEqual([]);
      stop();
    });

    it('stops when the signal aborts', async () => {
      const calls: string[] = [];
      const controller = new AbortController();
      observeWindowSizeClass(el, (cls) => calls.push(cls), {
        signal: controller.signal,
      });
      controller.abort();
      el.style.width = '1300px';
      await frames();
      expect(calls).toEqual(['compact']);
    });

    it('reports height class changes when the element resizes', async () => {
      el.style.height = '400px';
      const calls: string[] = [];
      const stop = observeWindowHeightClass(el, (cls) => calls.push(cls));
      el.style.height = '600px';
      await frames();
      el.style.width = '900px';
      await frames();
      expect(calls).toEqual(['compact', 'medium']);
      stop();
    });

    it('observes the viewport for a window', () => {
      const calls: string[] = [];
      const stop = observeWindowSizeClass(window, (cls) => calls.push(cls));
      expect(calls).toEqual([windowSizeClass(window.innerWidth)]);
      stop();
    });
  });

  describe('md-layout-tokens.css', () => {
    it('sets the viewport class tokens on :root', () => {
      const style = getComputedStyle(document.documentElement);
      const cls = windowSizeClass(window.innerWidth);
      expect(style.getPropertyValue('--md-sys-layout-margin').trim()).toBe(
        `${WINDOW_SIZE_CLASS_VALUES[cls].margin}px`,
      );
      expect(
        style.getPropertyValue('--md-sys-layout-breakpoint-medium').trim(),
      ).toBe('600px');
      expect(
        style
          .getPropertyValue('--md-sys-layout-breakpoint-height-medium')
          .trim(),
      ).toBe('480px');
      expect(
        style
          .getPropertyValue('--md-sys-layout-breakpoint-height-expanded')
          .trim(),
      ).toBe('900px');
    });

    it('scopes tokens to a .md-window container', async () => {
      const frame = document.createElement('div');
      frame.className = 'md-window';
      frame.style.width = '400px';
      const child = document.createElement('div');
      frame.appendChild(child);
      document.body.appendChild(frame);
      const value = (name: string) =>
        getComputedStyle(child).getPropertyValue(name).trim();
      expect(value('--md-sys-layout-margin')).toBe('16px');
      expect(value('--md-sys-layout-columns')).toBe('4');
      frame.style.width = '1300px';
      expect(value('--md-sys-layout-margin')).toBe('24px');
      expect(value('--md-sys-layout-columns')).toBe('12');
      expect(value('--md-sys-layout-fixed-pane-width')).toBe('412px');
      frame.remove();
    });

    it('lays .md-layout-grid children on the class columns', () => {
      const frame = document.createElement('div');
      frame.className = 'md-window';
      frame.style.width = '700px';
      const grid = document.createElement('div');
      grid.className = 'md-layout-grid';
      frame.appendChild(grid);
      document.body.appendChild(frame);
      const columns = getComputedStyle(grid)
        .gridTemplateColumns.split(' ')
        .filter(Boolean);
      expect(columns.length).toBe(8);
      expect(getComputedStyle(grid).paddingInlineStart).toBe('24px');
      frame.remove();
    });
  });
});
