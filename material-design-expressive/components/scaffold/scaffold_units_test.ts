/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {WINDOW_SIZE_CLASSES} from '../../foundations/layout/window-size-class.js';

import {planPanes} from './pane-scaffold.js';

describe('pane totals', () => {
  // spec: layout-scaffold-14ba8f, layout-scaffold-2c6e9f
  it('shows one flexible pane at every window size class when there is no secondary pane', () => {
    for (const windowClass of WINDOW_SIZE_CLASSES) {
      const plan = planPanes({layout: 'list-detail', windowClass});
      expect(plan.mode).withContext(windowClass).toBe('single');
      expect(plan.visible).withContext(windowClass).toEqual(['primary']);
      expect(plan.paneCount).withContext(windowClass).toBe(1);
    }
  });

  // spec: layout-scaffold-d12891, layout-scaffold-c07466
  it('shows between one and three panes in any layout', () => {
    for (const windowClass of WINDOW_SIZE_CLASSES) {
      for (const layout of ['list-detail', 'supporting-pane', 'feed'] as const) {
        const plan = planPanes({
          layout,
          windowClass,
          hasSecondary: true,
          hasTertiary: true,
        });
        expect(plan.paneCount).withContext(`${layout} ${windowClass}`).toBeGreaterThanOrEqual(1);
        expect(plan.paneCount).withContext(`${layout} ${windowClass}`).toBeLessThanOrEqual(3);
      }
    }
  });

  // spec: layout-scaffold-c80a1a, layout-scaffold-2e92e2
  it('shows and hides the secondary pane depending on the window size class', () => {
    const shown = WINDOW_SIZE_CLASSES.map((windowClass) =>
      planPanes({layout: 'list-detail', windowClass, hasSecondary: true, detailOpen: true}).visible.length,
    );
    expect(shown).toEqual([1, 1, 2, 2, 2]);
  });
});
