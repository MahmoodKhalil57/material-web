/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {
  type Fold,
  foldFromSegments,
  foldWithin,
  getFold,
  getViewportSegments,
  observeFold,
  simulateViewportSegments,
} from './viewport-segments.js';

describe('viewport segments', () => {
  afterEach(() => {
    simulateViewportSegments(undefined);
  });

  describe('foldFromSegments()', () => {
    it('finds a vertical fold between side-by-side segments', () => {
      // A dual-screen device: two 500px screens and a 20px hinge.
      expect(
        foldFromSegments([
          {x: 0, y: 0, width: 500, height: 800},
          {x: 520, y: 0, width: 500, height: 800},
        ]),
      ).toEqual({
        orientation: 'vertical',
        x: 500,
        y: 0,
        width: 20,
        height: 800,
      });
    });

    it('finds a horizontal fold between stacked segments', () => {
      // Tabletop posture of a seamless foldable: no hinge gap.
      expect(
        foldFromSegments([
          {x: 0, y: 420, width: 900, height: 420},
          {x: 0, y: 0, width: 900, height: 420},
        ]),
      ).toEqual({
        orientation: 'horizontal',
        x: 0,
        y: 420,
        width: 900,
        height: 0,
      });
    });

    it('returns null for one segment or none', () => {
      expect(foldFromSegments(null)).toBeNull();
      expect(
        foldFromSegments([{x: 0, y: 0, width: 400, height: 800}]),
      ).toBeNull();
    });
  });

  describe('foldWithin()', () => {
    const fold: Fold = {
      orientation: 'vertical',
      x: 500,
      y: 0,
      width: 20,
      height: 800,
    };

    it('measures a vertical fold from the inline-start edge', () => {
      const rect = {x: 100, y: 0, width: 800, height: 800};
      expect(foldWithin(fold, rect)).toEqual({
        orientation: 'vertical',
        start: 400,
        size: 20,
      });
      // Right-to-left: from the right edge (900 - 520).
      expect(foldWithin(fold, rect, true)?.start).toBe(380);
    });

    it('ignores a fold outside the element', () => {
      expect(
        foldWithin(fold, {x: 0, y: 0, width: 400, height: 800}),
      ).toBeNull();
      expect(
        foldWithin(fold, {x: 600, y: 0, width: 400, height: 800}),
      ).toBeNull();
      expect(
        foldWithin(null, {x: 0, y: 0, width: 1000, height: 800}),
      ).toBeNull();
    });

    it('measures a horizontal fold from the top edge', () => {
      const horizontal: Fold = {
        orientation: 'horizontal',
        x: 0,
        y: 400,
        width: 900,
        height: 10,
      };
      expect(
        foldWithin(horizontal, {x: 0, y: 100, width: 900, height: 700}),
      ).toEqual({orientation: 'horizontal', start: 300, size: 10});
    });
  });

  describe('simulateViewportSegments()', () => {
    it('reports no segments without the API or a simulation', () => {
      // Test browsers have one viewport segment.
      expect(getViewportSegments()).toBeNull();
      expect(getFold()).toBeNull();
    });

    it('fakes segments and notifies observers', () => {
      const folds: Array<Fold | null> = [];
      const stop = observeFold((fold) => folds.push(fold));
      expect(folds).toEqual([null]);
      simulateViewportSegments([
        {x: 0, y: 0, width: 400, height: 600},
        {x: 410, y: 0, width: 400, height: 600},
      ]);
      expect(folds.length).toBe(2);
      expect(folds[1]?.orientation).toBe('vertical');
      expect(folds[1]?.x).toBe(400);
      // Unchanged segments do not notify again.
      simulateViewportSegments([
        {x: 0, y: 0, width: 400, height: 600},
        {x: 410, y: 0, width: 400, height: 600},
      ]);
      expect(folds.length).toBe(2);
      simulateViewportSegments(null);
      expect(folds[2]).toBeNull();
      stop();
      simulateViewportSegments([
        {x: 0, y: 0, width: 400, height: 300},
        {x: 0, y: 300, width: 400, height: 300},
      ]);
      expect(folds.length).toBe(3);
    });

    it('stops observing when the signal aborts', () => {
      const folds: Array<Fold | null> = [];
      const controller = new AbortController();
      observeFold((fold) => folds.push(fold), {
        signal: controller.signal,
        initial: false,
      });
      controller.abort();
      simulateViewportSegments([
        {x: 0, y: 0, width: 400, height: 600},
        {x: 400, y: 0, width: 400, height: 600},
      ]);
      expect(folds).toEqual([]);
    });
  });
});
