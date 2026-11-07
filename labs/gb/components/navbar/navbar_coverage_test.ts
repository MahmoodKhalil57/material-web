/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Measurement and layout coverage for the navigation bar (navigation-bar.md,
// Measurements). The spec gives these as images; the numbers checked here come
// from the md.comp.nav-bar tokens (labs/gb/components/navbar/_nav-bar-tokens.scss)
// and the item layout rules in nav-bar.scss.

// import 'jasmine'; (google3-only)

import './md-gb-nav-bar.js';
import './md-gb-nav-bar-item.js';

import {setViewport} from '@web/test-runner-commands';
import {html, type TemplateResult} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {until} from '../shared/test-dom.js';
import {NavBarElement} from './nav-bar-element.js';
import {NavBarItemElement} from './nav-bar-item-element.js';

adoptStyles(document, [m3Styles]);

function navItems(labels: string[], active = 0) {
  return labels.map(
    (label, i) =>
      html`<md-gb-nav-bar-item ?active=${i === active}
        ><span slot="icon" style="display: block; width: 24px; height: 24px"></span
        >${label}</md-gb-nav-bar-item
      >`,
  );
}

function parts(item: Element) {
  const root = item.shadowRoot!;
  return {
    indicator: root.querySelector<HTMLElement>('.nav-bar-item-icon-container')!,
    icon: root.querySelector<HTMLElement>('.nav-bar-item-icon')!,
    label: root.querySelector<HTMLElement>('.nav-bar-item-label')!,
    content: root.querySelector<HTMLElement>('.nav-bar-item-content')!,
  };
}

/** The horizontal space the body takes away from the window (margins and padding). */
function bodyInset(): number {
  const body = getComputedStyle(document.body);
  return (
    parseFloat(body.marginLeft) +
    parseFloat(body.marginRight) +
    parseFloat(body.paddingLeft) +
    parseFloat(body.paddingRight)
  );
}

describe('md-gb-nav-bar measurements coverage', () => {
  const env = new Environment();
  const startViewport = {width: window.innerWidth, height: window.innerHeight};

  afterEach(async () => {
    await setViewport(startViewport);
  });

  async function render(template: TemplateResult) {
    const root = env.render(template);
    // The environment's root is inline-flex; a block root gives the bar the
    // width of the window, as on a page.
    root.style.display = 'block';
    await env.waitForStability();
    const bar = root.querySelector('md-gb-nav-bar') as NavBarElement;
    await bar.updateComplete;
    const items = Array.from(
      bar.querySelectorAll('md-gb-nav-bar-item'),
    ) as NavBarItemElement[];
    for (const item of items) await item.updateComplete;
    await bar.updateComplete;
    return {root, bar, items};
  }

  // spec: navigation-bar-47c5e4
  it('stretches the bar across the full width of the window', async () => {
    for (const width of [390, 820]) {
      await setViewport({width, height: 700});
      const {root, bar} = await render(
        html`<md-gb-nav-bar>${navItems(['Home', 'Search', 'Settings'])}</md-gb-nav-bar>`,
      );
      const page = document.documentElement.clientWidth - bodyInset();
      expect(root.getBoundingClientRect().width).toBeCloseTo(page, 0);
      expect(bar.getBoundingClientRect().width).toBeCloseTo(page, 0);
      expect(bar.getBoundingClientRect().left).toBeCloseTo(
        root.getBoundingClientRect().left,
        0,
      );
    }
  });

  // spec: navigation-bar-de57ee
  it('shares the width of vertical items equally and follows the bar width', async () => {
    const root = env.render(
      html`<div style="width: 360px"
        ><md-gb-nav-bar>${navItems(['Home', 'Notifications and updates', 'Me'])}</md-gb-nav-bar></div
      >`,
    );
    await env.waitForStability();
    const bar = root.querySelector('md-gb-nav-bar') as NavBarElement;
    const container = root.querySelector('div') as HTMLElement;
    const items = Array.from(bar.querySelectorAll('md-gb-nav-bar-item'));
    await bar.updateComplete;

    const expectEqualShares = () => {
      const share = bar.getBoundingClientRect().width / items.length;
      for (const item of items) {
        expect(item.getBoundingClientRect().width).toBeCloseTo(share, 0);
      }
    };
    expectEqualShares();

    container.style.width = '520px';
    await until(() => Math.abs(bar.getBoundingClientRect().width - 520) < 1);
    expectEqualShares();
  });

  // spec: navigation-bar-18b4c8
  it('keeps horizontal items at a fixed width and adds the extra space to the ends', async () => {
    // Items take 10% * (n + 3) of the bar width, shared evenly; the rest is split
    // between the two ends (Compose CenteredContentMeasurePolicy).
    const barWidth = 1000;
    for (const n of [3, 4, 5]) {
      const labels = ['Home', 'Search', 'Library', 'Settings', 'Me'].slice(0, n);
      const {bar, items} = await render(
        html`<div style="width: ${barWidth}px"
          ><md-gb-nav-bar item-layout="horizontal">${navItems(labels)}</md-gb-nav-bar></div
        >`,
      );
      const boxes = items.map((item) => item.getBoundingClientRect());
      const itemWidth = (100 * (n + 3)) / n;
      const end = (barWidth - (barWidth * (n + 3)) / 10) / 2;
      for (const box of boxes) {
        expect(box.width).toBeCloseTo(itemWidth, 0);
      }
      const barBox = bar.getBoundingClientRect();
      expect(boxes[0].left - barBox.left).toBeCloseTo(end, 0);
      expect(barBox.right - boxes[n - 1].right).toBeCloseTo(end, 0);
    }
  });

  // spec: navigation-bar-426532
  it('uses full-width vertical items in compact windows and centered horizontal items in medium windows', async () => {
    const {root, bar, items} = await render(
      html`<md-gb-nav-bar item-layout="auto">${navItems(['Home', 'Search', 'Settings'])}</md-gb-nav-bar>`,
    );

    // Compact window: vertical items, no margin at the window edges.
    await setViewport({width: 400, height: 700});
    await until(() => bar.resolvedItemLayout === 'vertical');
    await until(() => items[0].getAttribute('item-layout') === 'vertical');
    let barBox = bar.getBoundingClientRect();
    expect(barBox.width).toBeCloseTo(
      document.documentElement.clientWidth - bodyInset(),
      0,
    );
    expect(barBox.width).toBeCloseTo(root.getBoundingClientRect().width, 0);
    expect(items[0].getBoundingClientRect().left).toBeCloseTo(barBox.left, 0);
    expect(items[2].getBoundingClientRect().right).toBeCloseTo(barBox.right, 0);

    // Medium window: horizontal items, 3 items take 60% of the bar and each
    // side keeps a 20% margin.
    await setViewport({width: 800, height: 700});
    await until(() => bar.resolvedItemLayout === 'horizontal');
    await until(() => items[0].getAttribute('item-layout') === 'horizontal');
    barBox = bar.getBoundingClientRect();
    expect(barBox.width).toBeCloseTo(
      document.documentElement.clientWidth - bodyInset(),
      0,
    );
    const boxes = items.map((item) => item.getBoundingClientRect());
    for (const box of boxes) {
      expect(box.width).toBeCloseTo(barBox.width * 0.2, 0);
    }
    expect(boxes[0].left - barBox.left).toBeCloseTo(barBox.width * 0.2, 0);
    expect(barBox.right - boxes[2].right).toBeCloseTo(barBox.width * 0.2, 0);
  });

  // spec: navigation-bar-12fd90, navigation-bar-f2e0bf
  it('uses the spec padding and size measurements for the bar and its items', async () => {
    // Vertical items (compact windows): 64dp bar, 56x32 indicator, 24dp icon,
    // 4dp between the indicator and the label, 6dp vertical padding in the item.
    const vertical = await render(
      html`<div style="width: 400px"><md-gb-nav-bar>${navItems(['Home', 'Search', 'Settings'])}</md-gb-nav-bar></div>`,
    );
    const v = vertical.items[0];
    const vParts = parts(v);
    const vBar = vertical.bar.getBoundingClientRect();
    expect(vBar.height).toBeCloseTo(64, 0);
    expect(vParts.indicator.getBoundingClientRect().width).toBeCloseTo(56, 0);
    expect(vParts.indicator.getBoundingClientRect().height).toBeCloseTo(32, 0);
    expect(vParts.icon.getBoundingClientRect().width).toBeCloseTo(24, 0);
    expect(vParts.icon.getBoundingClientRect().height).toBeCloseTo(24, 0);
    expect(
      vParts.label.getBoundingClientRect().top -
        vParts.indicator.getBoundingClientRect().bottom,
    ).toBeCloseTo(4, 0);
    expect(parseFloat(getComputedStyle(vParts.content).paddingTop)).toBe(6);
    expect(parseFloat(getComputedStyle(vParts.content).paddingBottom)).toBe(6);
    // The indicator is centered in the item.
    const vItemBox = v.getBoundingClientRect();
    const vIndicatorBox = vParts.indicator.getBoundingClientRect();
    expect(
      vIndicatorBox.left + vIndicatorBox.width / 2 -
        (vItemBox.left + vItemBox.width / 2),
    ).toBeCloseTo(0, 0);
    // Each item is a 48dp minimum target or wider and as tall as the bar.
    expect(vItemBox.width).toBeGreaterThanOrEqual(48);
    expect(vItemBox.height).toBeCloseTo(64, 0);

    // Horizontal items (medium windows): 40dp indicator, 16dp leading and
    // trailing space, 24dp icon and 4dp between the icon and the label.
    const horizontal = await render(
      html`<div style="width: 1000px"><md-gb-nav-bar item-layout="horizontal">${navItems(['Home', 'Search', 'Settings'])}</md-gb-nav-bar></div>`,
    );
    const h = horizontal.items[0];
    const hParts = parts(h);
    expect(hParts.content.getBoundingClientRect().height).toBeCloseTo(40, 0);
    const hStyle = getComputedStyle(hParts.content);
    expect(parseFloat(hStyle.paddingLeft)).toBe(16);
    expect(parseFloat(hStyle.paddingRight)).toBe(16);
    expect(hParts.icon.getBoundingClientRect().width).toBeCloseTo(24, 0);
    expect(
      hParts.label.getBoundingClientRect().left -
        hParts.indicator.getBoundingClientRect().right,
    ).toBeCloseTo(4, 0);
    expect(horizontal.bar.getBoundingClientRect().height).toBeCloseTo(64, 0);
  });
});
