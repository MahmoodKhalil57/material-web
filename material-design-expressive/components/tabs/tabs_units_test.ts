/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Spec unit tests for tabs: layout, active indicator and keyboard rules.

// import 'jasmine'; (google3-only)

import './md-gb-tab.js';
import './md-gb-tabs.js';
import '../../styles/icon/md-gb-icon.js';

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

describe('tabs spec units', () => {
  const env = new Environment();

  afterEach(async () => {
    await setViewport({width: 800, height: 600});
  });

  async function render(template: unknown) {
    await setViewport({width: 400, height: 600});
    const root = env.render(html`${template}`);
    await env.waitForStability();
    await env.waitForStability();
    return root;
  }

  const fixed = html`
    <div style="width: 360px">
      <md-gb-tabs>
        <md-gb-tab><span slot="label">One</span></md-gb-tab>
        <md-gb-tab><span slot="label">Second tab</span></md-gb-tab>
        <md-gb-tab><span slot="label">Tab 3</span></md-gb-tab>
      </md-gb-tabs>
    </div>
  `;

  // spec: tabs-966d74, tabs-38c40d, tabs-172313
  it('divides a container that fits into equal sections', async () => {
    const root = await render(fixed);
    const tabs = root.querySelector('md-gb-tabs')!;
    const widths = Array.from(root.querySelectorAll('md-gb-tab')).map(
      (t) => t.getBoundingClientRect().width,
    );
    expect(tabs.getBoundingClientRect().width).toBeCloseTo(360, 0);
    expect(widths[0]).toBeCloseTo(widths[1], 0);
    expect(widths[1]).toBeCloseTo(widths[2], 0);
    expect(widths.reduce((a, b) => a + b)).toBeCloseTo(360, 0);
    expect(tabs.scrollWidth).toBeLessThanOrEqual(tabs.clientWidth);
  });

  // spec: tabs-28277f, tabs-a1be12
  it('lays tabs out in one row with each label on a single line', async () => {
    const root = await render(fixed);
    const tabs = Array.from(root.querySelectorAll('md-gb-tab'));
    const tops = tabs.map((t) => Math.round(t.getBoundingClientRect().top));
    expect(new Set(tops).size).toBe(1);
    for (const label of root.querySelectorAll<HTMLElement>('[slot=label]')) {
      expect(label.getBoundingClientRect().height).toBeLessThan(24);
    }
  });

  // spec: tabs-7ca85d, tabs-cdbc4a
  it('draws the divider on the bottom edge inside the container height', async () => {
    const root = await render(fixed);
    const tabs = root.querySelector('md-gb-tabs')!;
    const style = getComputedStyle(tabs);
    expect(parseFloat(style.borderBottomWidth)).toBeGreaterThan(0);
    expect(style.borderBottomStyle).toBe('solid');
    expect(tabs.getBoundingClientRect().height).toBeCloseTo(48, 0);
  });

  // spec: tabs-af0bc2, tabs-322061
  it('underlines the active tab and changes its color', async () => {
    const root = await render(fixed);
    const tabs = root.querySelector('md-gb-tabs')!;
    const [first, second] = Array.from(root.querySelectorAll('md-gb-tab'));
    first.click();
    await env.waitForStability();
    const color = (t: Element) => getComputedStyle(t).color;
    const labelColor = (t: Element) =>
      getComputedStyle(t.querySelector('[slot=label]')!).color;
    const active = labelColor(first);
    const inactive = labelColor(second);
    expect(active).not.toBe(inactive);
    expect(color(first)).toBeDefined();
    const after = getComputedStyle(tabs, '::after');
    expect(parseFloat(after.height)).toBeGreaterThan(0);
    const bar = tabs.getBoundingClientRect();
    const tab = first.getBoundingClientRect();
    // The indicator sits under the selected tab, not under the other one.
    const left = parseFloat(after.insetInlineStart || '0');
    expect(left).toBeGreaterThanOrEqual(tab.left - bar.left - 1);
    second.click();
    await env.waitForStability();
    expect(labelColor(second)).toBe(active);
    expect(labelColor(first)).toBe(inactive);
  });

  // spec: tabs-b3016d, tabs-13902e
  it('combines an icon and a label in a tab', async () => {
    const root = await render(html`
      <md-gb-tabs>
        <md-gb-tab>
          <md-gb-icon>flight</md-gb-icon>
          <span slot="label">Flights</span>
        </md-gb-tab>
      </md-gb-tabs>
    `);
    const tab = root.querySelector('md-gb-tab')!;
    const icon = tab.querySelector('md-gb-icon')!.getBoundingClientRect();
    const label = tab.querySelector('[slot=label]')!.getBoundingClientRect();
    expect(icon.width).toBeGreaterThan(0);
    expect(label.width).toBeGreaterThan(0);
  });

  // spec: tabs-1f56a7, tabs-b5400e
  it('keeps the same tab padding for scrollable tabs and long labels', async () => {
    const pad = async (label: string, width: string) => {
      const root = await render(html`
        <div style="width: ${width}">
          <md-gb-tabs>
            <md-gb-tab><span slot="label">${label}</span></md-gb-tab>
            <md-gb-tab><span slot="label">${label}</span></md-gb-tab>
            <md-gb-tab><span slot="label">${label}</span></md-gb-tab>
          </md-gb-tabs>
        </div>
      `);
      const s = getComputedStyle(root.querySelector('md-gb-tab')!);
      return [s.paddingLeft, s.paddingRight, s.paddingTop, s.paddingBottom];
    };
    const short = await pad('A', '600px');
    const long = await pad('A very long tab label for scrolling', '200px');
    expect(long).toEqual(short);
  });

  /** Resolves a tab token (a length) to pixels through a probe element. */
  function tokenPx(tabs: Element, name: string) {
    const probe = document.createElement("div");
    probe.style.width = `var(${name})`;
    tabs.append(probe);
    const width = probe.getBoundingClientRect().width;
    probe.remove();
    return width;
  }

  // spec: tabs-d717fb, tabs-2b74a6, tabs-cd5b4a
  it("spaces an inline icon 8dp from the text, a badge 4dp after it and overlaps a stacked icon badge by 6dp", async () => {
    const root = await render(html`
      <md-gb-tabs>
        <md-gb-tab><md-gb-icon>flight</md-gb-icon><span slot="label">Flights</span></md-gb-tab>
      </md-gb-tabs>
    `);
    const tabs = root.querySelector("md-gb-tabs")!;
    expect(tokenPx(tabs, "--icon-label-space")).toBe(8);
    expect(tokenPx(tabs, "--badge-space")).toBe(4);
    expect(tokenPx(tabs, "--icon-badge-inset")).toBe(6);
  });

  // spec: tabs-2bcae6, tabs-ac2110
  it("insets the active indicator 2dp per side with a 24dp minimum length", async () => {
    const root = await render(fixed);
    const tabs = root.querySelector("md-gb-tabs")!;
    expect(tokenPx(tabs, "--active-indicator-inset")).toBe(2);
    expect(tokenPx(tabs, "--active-indicator-min-length")).toBe(24);
    expect(tokenPx(tabs, "--active-indicator-height")).toBe(3);
  });
});
