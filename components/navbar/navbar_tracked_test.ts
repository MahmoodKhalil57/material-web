/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Tests for spec units that were tracked as gaps and are now built.

// import 'jasmine'; (google3-only)

import './md-gb-nav-bar.js';
import './md-gb-nav-bar-item.js';

import {html, type TemplateResult} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {NavBarElement} from './nav-bar-element.js';
import {NavBarItemElement} from './nav-bar-item-element.js';

adoptStyles(document, [m3Styles]);

function parts(item: Element) {
  const root = item.shadowRoot!;
  return {
    container: root.querySelector<HTMLElement>('[part=nav-bar-item]')!,
    indicator: root.querySelector<HTMLElement>('[part=indicator]')!,
    label: root.querySelector<HTMLElement>('[part=label]')!,
  };
}

describe('md-gb-nav-bar tracked spec units', () => {
  const env = new Environment();

  async function render(template: TemplateResult) {
    const root = env.render(template);
    await env.waitForStability();
    const bar = root.querySelector('md-gb-nav-bar') as NavBarElement;
    await bar.updateComplete;
    const items = Array.from(bar.querySelectorAll('md-gb-nav-bar-item')) as NavBarItemElement[];
    for (const item of items) await item.updateComplete;
    await bar.updateComplete;
    return {bar, items};
  }

  function itemMarkup(labels: string[], active = -1) {
    return labels.map(
      (label, i) =>
        html`<md-gb-nav-bar-item ?active=${i === active}
          ><span slot="icon" style="width: 24px; height: 24px; display: block"></span
          >${label}</md-gb-nav-bar-item
        >`,
    );
  }

  describe('destinations', () => {
    // spec: navigation-bar-979936
    it('always has one active destination', async () => {
      const {bar, items} = await render(html`<md-gb-nav-bar>${itemMarkup(['One', 'Two', 'Three'])}</md-gb-nav-bar>`);
      expect(items.filter((i) => i.selected).length).toBe(1);
      const active = items.find((i) => i.selected)!;
      // Selecting the active destination again keeps it active.
      active.click();
      await bar.updateComplete;
      expect(items.filter((i) => i.selected).length).toBe(1);
    });

    // spec: navigation-bar-0cb695
    it('takes people to the destination of the item that is tapped', async () => {
      const {bar, items} = await render(html`<md-gb-nav-bar>${itemMarkup(['One', 'Two', 'Three'], 0)}</md-gb-nav-bar>`);
      const changes = jasmine.createSpy('change');
      bar.addEventListener('change', changes);
      items[2].click();
      await bar.updateComplete;
      expect(items[2].selected).toBeTrue();
      expect(items[0].selected).toBeFalse();
      expect(bar.selectedIndex).toBe(2);
      expect(changes).toHaveBeenCalledTimes(1);
    });

    // spec: navigation-bar-61404d
    it('keeps the destinations at fixed positions', async () => {
      const {items} = await render(html`<md-gb-nav-bar>${itemMarkup(['One', 'Two', 'Three'], 0)}</md-gb-nav-bar>`);
      const before = items.map((i) => i.getBoundingClientRect().left);
      items[2].click();
      await env.waitForStability();
      expect(items.map((i) => i.getBoundingClientRect().left)).toEqual(before);
    });

    // spec: navigation-bar-5c7325
    it('divides the bar into equal-width segments', async () => {
      const {bar, items} = await render(html`<md-gb-nav-bar>${itemMarkup(['One', 'Two and more', 'Three'], 0)}</md-gb-nav-bar>`);
      const widths = items.map((i) => i.getBoundingClientRect().width);
      expect(Math.max(...widths) - Math.min(...widths)).toBeLessThan(1);
      expect(widths[0] * 3).toBeCloseTo(bar.getBoundingClientRect().width, 0);
    });
  });

  describe('selected destination', () => {
    // spec: navigation-bar-369f33
    it('uses a filled icon and a bold label for the selected destination', async () => {
      const {items} = await render(html`<md-gb-nav-bar>${itemMarkup(['One', 'Two'], 0)}</md-gb-nav-bar>`);
      await env.waitForStability();
      document.getAnimations().forEach((a) => a.finish());
      const active = parts(items[0]);
      const inactive = parts(items[1]);
      expect(getComputedStyle(active.container).getPropertyValue('--md-icon-fill')).toBe('1');
      expect(getComputedStyle(inactive.container).getPropertyValue('--md-icon-fill')).toBe('0');
      expect(parseInt(getComputedStyle(active.label).fontWeight)).toBeGreaterThan(
        parseInt(getComputedStyle(inactive.label).fontWeight),
      );
    });

    // spec: navigation-bar-296993, navigation-bar-64d831, navigation-bar-7f5b59
    it('passes the ripple and the hover state layer through the indicator', async () => {
      const {items} = await render(html`<div style="width: 360px"><md-gb-nav-bar>${itemMarkup(['One', 'Two'], 0)}</md-gb-nav-bar></div>`);
      const {container, indicator} = parts(items[0]);
      expect(container.classList.contains('ripple-host')).toBeTrue();
      const box = indicator.getBoundingClientRect();
      const host = container.getBoundingClientRect();
      // The indicator is the pill behind the icon, inside the item.
      expect(box.width).toBeGreaterThan(0);
      expect(box.width).toBeLessThan(host.width);
      expect(box.left).toBeGreaterThanOrEqual(host.left);
    });
  });

  // spec: navigation-bar-2fb55c, navigation-bar-2ab19d
  it('gives horizontal items the same width, with the same spacing between them', async () => {
    const {items} = await render(html`<div style="width: 800px"
      ><md-gb-nav-bar item-layout="horizontal">
        <md-gb-nav-bar-item active>Home</md-gb-nav-bar-item>
        <md-gb-nav-bar-item>Notifications</md-gb-nav-bar-item>
        <md-gb-nav-bar-item>Me</md-gb-nav-bar-item>
      </md-gb-nav-bar></div
    >`);
    const boxes = items.map((el) => el.getBoundingClientRect());
    expect(Math.abs(boxes[0].width - boxes[1].width)).toBeLessThan(1);
    expect(Math.abs(boxes[1].width - boxes[2].width)).toBeLessThan(1);
    const gaps = [boxes[1].left - boxes[0].right, boxes[2].left - boxes[1].right];
    expect(Math.abs(gaps[0] - gaps[1])).toBeLessThan(1);
  });

  describe('icons without a filled style', () => {
    // spec: navigation-bar-e0a18b, navigation-bar-ed15cd, navigation-bar-6f3e86
    it('uses a semibold icon instead of a filled one for the active destination', async () => {
      const {items} = await render(html`<div style="width: 360px"
        ><md-gb-nav-bar>
          <md-gb-nav-bar-item active unfilled-icon><span slot="icon" style="display: block; width: 24px; height: 24px"></span>One</md-gb-nav-bar-item>
          <md-gb-nav-bar-item active-not><span slot="icon" style="display: block; width: 24px; height: 24px"></span>Two</md-gb-nav-bar-item>
        </md-gb-nav-bar></div
      >`);
      await env.waitForStability();
      const style = getComputedStyle(parts(items[0]).container);
      expect(style.getPropertyValue('--md-icon-fill')).toBe('0');
      expect(style.getPropertyValue('--md-icon-wght')).toBe('600');
    });
  });

  describe('text scaling', () => {
    // spec: navigation-bar-703979, navigation-bar-752708, navigation-bar-e7bbb7, navigation-bar-967bfe
    it('shows the full label and grows the bar when a label needs more room', async () => {
      const {bar, items} = await render(html`<div style="width: 200px"
        ><md-gb-nav-bar>${itemMarkup(['Home', 'Notifications and updates', 'Settings'], 0)}</md-gb-nav-bar></div
      >`);
      const longLabel = parts(items[1]).label;
      expect(longLabel.scrollWidth).toBeLessThanOrEqual(longLabel.clientWidth + 1);
      expect(getComputedStyle(longLabel).textOverflow).not.toBe('ellipsis');
      const shortLabel = parts(items[0]).label;
      // A short label stays on one line and the bar keeps its default height.
      expect(shortLabel.getBoundingClientRect().height).toBeLessThan(longLabel.getBoundingClientRect().height);
      // The bar is 64dp by default.
      expect(bar.getBoundingClientRect().height).toBeGreaterThan(64);
    });

    // spec: navigation-bar-703979
    it('does not wrap or truncate a label that fits', async () => {
      const {items} = await render(html`<div style="width: 400px"
        ><md-gb-nav-bar>${itemMarkup(['Home', 'Search', 'Settings'], 0)}</md-gb-nav-bar></div
      >`);
      for (const item of items) {
        const label = parts(item).label;
        const lineHeight = parseFloat(getComputedStyle(label).lineHeight);
        expect(label.getBoundingClientRect().height).toBeLessThan(lineHeight * 1.5);
        expect(label.scrollWidth).toBeLessThanOrEqual(label.clientWidth + 1);
      }
    });
  });
});
