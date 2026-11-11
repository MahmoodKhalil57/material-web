/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Spec unit tests for tabs: scroll start offset and fixed tab widths.

// import 'jasmine'; (google3-only)

import './md-gb-tab.js';
import './md-gb-tabs.js';

import {setViewport} from '@web/test-runner-commands';
import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {styles as badgeStyles} from '../badge/badge.cssresult.js';
import focusRingStyles from '../../foundations/interaction/states/focus/focus-ring.cssresult.js';
import rippleStyles from '../../foundations/interaction/states/ripple/ripple.cssresult.js';
import {styles as tabsStyles} from './tabs.cssresult.js';

adoptStyles(document, [
  m3Styles,
  badgeStyles,
  focusRingStyles,
  rippleStyles,
  tabsStyles,
]);

describe('tabs layout spec units', () => {
  const env = new Environment();

  afterEach(async () => {
    await setViewport({width: 800, height: 600});
  });

  async function render(dir: 'ltr' | 'rtl', width: number, labels: string[]) {
    // Fixed tabs fill the bar only in compact windows; the window is as wide as the bar.
    await setViewport({width: Math.min(width, 599), height: 600});
    const root = env.render(html`<div
      dir=${dir}
      style="width: ${width}px"
      ><md-gb-tabs aria-label="Trips">
        ${labels.map(
          (label) =>
            html`<md-gb-tab><span slot="label">${label}</span></md-gb-tab>`,
        )}
      </md-gb-tabs></div
    >`);
    await env.waitForStability();
    const tabs = root.querySelector('md-gb-tabs')!;
    const items = Array.from(root.querySelectorAll('md-gb-tab'));
    return {tabs, items};
  }

  const scrollingLabels = [
    'Flights',
    'Hotels',
    'Car rental',
    'Trains',
    'Cruises',
  ];

  describe('scrollable tabs', () => {
    // spec: tabs-bf79b7, tabs-7ce157, tabs-09e737
    it('offsets the first tab by 52dp from the leading edge in LTR', async () => {
      const {tabs, items} = await render('ltr', 240, scrollingLabels);
      expect(tabs.scrollWidth).toBeGreaterThan(tabs.clientWidth);
      const first = items[0].getBoundingClientRect();
      const bar = tabs.getBoundingClientRect();
      expect(first.left - bar.left).toBeCloseTo(52, 0);
    });

    // spec: tabs-bf79b7, tabs-7ce157, tabs-09e737
    it('offsets the first tab by 52dp from the leading edge in RTL', async () => {
      const {tabs, items} = await render('rtl', 240, scrollingLabels);
      expect(tabs.scrollWidth).toBeGreaterThan(tabs.clientWidth);
      const first = items[0].getBoundingClientRect();
      const bar = tabs.getBoundingClientRect();
      expect(bar.right - first.right).toBeCloseTo(52, 0);
    });
  });

  describe('tabs that fit', () => {
    it('does not offset the first tab when the tabs do not scroll', async () => {
      const {tabs, items} = await render('ltr', 600, ['Hi', 'Trains', 'Cruises']);
      expect(tabs.scrollWidth).toBe(tabs.clientWidth);
      const first = items[0].getBoundingClientRect();
      const bar = tabs.getBoundingClientRect();
      expect(first.left - bar.left).toBeCloseTo(0, 0);
    });
  });
});
