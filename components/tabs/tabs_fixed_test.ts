/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Fixed tabs: equal sections that fill compact windows, and stop at the
// widest tab's width in a group that is centered (or leading-aligned) above.

// import 'jasmine'; (google3-only)

import './md-gb-tab.js';
import './md-gb-tabs.js';

import {setViewport} from '@web/test-runner-commands';
import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {styles as badgeStyles} from '../badge/badge.cssresult.js';
import focusRingStyles from '../focus/focus-ring.cssresult.js';
import rippleStyles from '../ripple/ripple.cssresult.js';
import {styles as tabsStyles} from './tabs.cssresult.js';

adoptStyles(document, [
  m3Styles,
  badgeStyles,
  focusRingStyles,
  rippleStyles,
  tabsStyles,
]);

describe('fixed tabs', () => {
  const env = new Environment();
  const labels = ['Hi', 'Trains', 'Car rental and more'];

  async function render(
    dir: 'ltr' | 'rtl',
    width: number,
    align?: 'start',
    tabLabels = labels,
  ) {
    await setViewport({width, height: 600});
    const root = env.render(html`<div dir=${dir} style="width: ${width}px"
      ><md-gb-tabs aria-label="Trips" align=${align ?? 'center'}>
        ${tabLabels.map(
          (label) =>
            html`<md-gb-tab><span slot="label">${label}</span></md-gb-tab>`,
        )}
      </md-gb-tabs></div
    >`);
    await env.waitForStability();
    const tabs = root.querySelector('md-gb-tabs')!;
    const items = Array.from(root.querySelectorAll('md-gb-tab'));
    const rects = items.map((item) => item.getBoundingClientRect());
    return {tabs, rects, bar: tabs.getBoundingClientRect()};
  }

  afterEach(async () => {
    await setViewport({width: 800, height: 600});
  });

  // spec: tabs-28dacf
  it('keeps every tab as wide as the widest when the tabs overflow a compact window', async () => {
    const {tabs, rects} = await render('ltr', 400);
    expect(tabs.scrollWidth).toBeGreaterThan(tabs.clientWidth);
    for (const rect of rects) {
      expect(Math.abs(rect.width - rects[0].width)).toBeLessThan(1);
    }
  });

  for (const dir of ['ltr', 'rtl'] as const) {
    // spec: tabs-28dacf, tabs-966d74, tabs-38c40d
    it(`gives equal sections that fill the window at compact widths (${dir})`, async () => {
      const {rects, bar} = await render(dir, 400, undefined, ['Hi', 'Trains', 'Flights']);
      for (const rect of rects) {
        expect(Math.abs(rect.width - rects[0].width)).toBeLessThan(1);
      }
      const total = rects.reduce((sum, rect) => sum + rect.width, 0);
      expect(total).toBeCloseTo(bar.width, 0);
    });

    // spec: tabs-28dacf
    it(`limits each tab to the widest tab and centers the group in a wide window (${dir})`, async () => {
      const {rects, bar} = await render(dir, 1000);
      const widest = rects[0].width;
      for (const rect of rects) {
        expect(Math.abs(rect.width - widest)).toBeLessThan(1);
      }
      // The widest label is "Car rental and more": well under a third of 1000.
      expect(widest).toBeLessThan(333);
      const total = widest * rects.length;
      const left = Math.min(...rects.map((r) => r.left));
      const right = Math.max(...rects.map((r) => r.right));
      expect(right - left).toBeCloseTo(total, 0);
      expect(left - bar.left).toBeCloseTo(bar.right - right, 0);
      expect(left - bar.left).toBeGreaterThan(100);
    });

    // spec: tabs-28dacf
    it(`aligns the group to the leading edge with align="start" (${dir})`, async () => {
      const {rects, bar} = await render(dir, 1000, 'start');
      const widest = rects[0].width;
      expect(widest).toBeLessThan(333);
      if (dir === 'ltr') {
        expect(Math.min(...rects.map((r) => r.left)) - bar.left).toBeCloseTo(0, 0);
      } else {
        expect(bar.right - Math.max(...rects.map((r) => r.right))).toBeCloseTo(0, 0);
      }
    });
  }
});
