/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {emulateMedia} from '@web/test-runner-commands';
import {html} from 'lit';
import {Environment} from '../../testing/environment.js';

import {CAROUSEL_ITEM_PROPERTIES} from './carousel.js';
import {type CarouselElement} from './carousel-element.js';
import './md-gb-carousel.js';

import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';

adoptStyles(document, [m3Styles]);

describe('carousel spec units', () => {
  const env = new Environment();

  async function setup(
    attrs: {
      layout?: string;
      alignment?: string;
      scrollMode?: string;
      width?: number;
      reduced?: boolean;
      count?: number;
    } = {},
  ) {
    const root = env.render(html`
      <div class=${attrs.reduced ? 'md-motion-reduced' : ''}>
        <md-gb-carousel
          aria-label="Destinations"
          layout=${attrs.layout ?? 'multi-browse'}
          alignment=${attrs.alignment ?? 'start'}
          scroll-mode=${attrs.scrollMode ?? ''}
          style="inline-size: ${attrs.width ?? 360}px; ${attrs.layout === 'hero' ? '' : '--item-width: 186px; --height: 200px'}">
          ${Array.from(
            {length: attrs.count ?? 8},
            (_, i) =>
              html`<md-gb-carousel-item label="Item ${i}">
                <div style="background: gray"></div>
              </md-gb-carousel-item>`,
          )}
        </md-gb-carousel>
      </div>
    `);
    await env.waitForStability();
    const carousel = root.querySelector('md-gb-carousel') as CarouselElement;
    carousel.relayout();
    const items = [...carousel.querySelectorAll('md-gb-carousel-item')] as HTMLElement[];
    const scroller = carousel.shadowRoot!.querySelector('.carousel-scroller') as HTMLElement;
    const size = (i: number) =>
      parseFloat(items[i].style.getPropertyValue(CAROUSEL_ITEM_PROPERTIES.size));
    return {carousel, items, scroller, size};
  }

  // spec: carousel-b496ba, carousel-bc3dbe, carousel-8401e0, carousel-970b0b, carousel-4a9eb7
  it('multi-browse shows large, medium and small items, small within 40-56dp', async () => {
    const {size} = await setup();
    expect(size(0)).toBeGreaterThan(size(1));
    expect(size(1)).toBeGreaterThan(size(2));
    expect(size(2)).toBeGreaterThanOrEqual(40);
    expect(size(2)).toBeLessThanOrEqual(56);
  });

  // spec: carousel-c3b54d, carousel-8abe0b, carousel-2c5135, carousel-a11a15
  it('shows more items at once as the container grows', async () => {
    const visible = async (width: number) => {
      const {items, scroller} = await setup({width});
      const box = scroller.getBoundingClientRect();
      return items.filter((item) => {
        const r = item.getBoundingClientRect();
        return r.width > 1 && r.left >= box.left - 1 && r.right <= box.right + 1;
      }).length;
    };
    const compact = await visible(360);
    const expanded = await visible(900);
    expect(expanded).toBeGreaterThan(compact);
  });

  // spec: carousel-a1cb45, carousel-0e616e
  it('hero shows one large item and one small item at compact width', async () => {
    const {size, items} = await setup({layout: 'hero'});
    expect(size(0)).toBeCloseTo(280, 0);
    expect(size(1)).toBeCloseTo(40, 0);
    expect(size(2)).toBeLessThan(40);
    expect(items.length).toBeGreaterThan(2);
  });

  // spec: carousel-80b4ab, carousel-f635f5
  it('center-aligned hero centers the large item between two small items', async () => {
    const {carousel, size, items, scroller} = await setup({layout: 'hero', alignment: 'center'});
    carousel.scrollToItem(2, 'instant');
    const box = scroller.getBoundingClientRect();
    const large = items[2];
    expect(size(2)).toBeGreaterThan(100);
    // The item's visible bounds (its box stays in the scroll flow).
    const r = large.shadowRoot!.querySelector('[part=frame]')!.getBoundingClientRect();
    expect((r.left + r.right) / 2).toBeCloseTo((box.left + box.right) / 2, 0);
    expect(size(1)).toBeLessThan(60);
    expect(size(3)).toBeLessThan(60);
  });

  // spec: carousel-925651, carousel-57a12d
  it('full-screen shows a single item filling the container', async () => {
    const {items, scroller} = await setup({layout: 'full-screen', width: 360});
    expect(items[0].getBoundingClientRect().height).toBeCloseTo(scroller.clientHeight, 0);
    expect(items[0].getBoundingClientRect().width).toBeCloseTo(scroller.clientWidth, 0);
  });

  // spec: carousel-1c3ff2, carousel-581abd, carousel-0b99fd, carousel-8d8e70, carousel-a1385d
  it('snap-scrolling is on for multi-browse, hero and full-screen', async () => {
    for (const layout of ['multi-browse', 'hero', 'full-screen']) {
      const {scroller} = await setup({layout});
      expect(getComputedStyle(scroller).scrollSnapType)
        .withContext(layout)
        .toContain('mandatory');
    }
  });

  // spec: carousel-e607e6, carousel-fbf980, carousel-0e2baf
  it('default scrolling does not snap and works for uncontained', async () => {
    const {scroller} = await setup({layout: 'uncontained'});
    expect(getComputedStyle(scroller).scrollSnapType).toBe('none');
  });

  // spec: carousel-ae447c
  it('uncontained also supports snap-scrolling', async () => {
    const {scroller} = await setup({layout: 'uncontained', scrollMode: 'snap'});
    expect(getComputedStyle(scroller).scrollSnapType).toContain('mandatory');
  });

  // spec: carousel-482390
  it('hero snap-scrolling advances one item at a time', async () => {
    const {items} = await setup({layout: 'hero'});
    expect(getComputedStyle(items[1]).scrollSnapStop).toBe('always');
  });

  // spec: carousel-03e00f, carousel-88864f, carousel-c5179b
  it('items snap into their layout position when scrolled', async () => {
    const {carousel, size} = await setup();
    carousel.scrollToItem(3, 'instant');
    expect(carousel.currentIndex).toBe(3);
    expect(size(3)).toBeCloseTo(178.4, 0);
  });

  // spec: carousel-c1d1b3
  it('reduced motion keeps every item the same size', async () => {
    await emulateMedia({reducedMotion: 'reduce'});
    try {
      const {items} = await setup();
      const widths = items.map((item) => item.getBoundingClientRect().width);
      expect(widths[0]).toBeGreaterThan(100);
      for (const item of items) {
        const mask = parseFloat(item.style.getPropertyValue(CAROUSEL_ITEM_PROPERTIES.size));
        expect(Number.isNaN(mask) || mask >= widths[0] - 1)
          .withContext(item.style.cssText)
          .toBeTrue();
      }
    } finally {
      await emulateMedia({reducedMotion: 'no-preference'});
    }
  });
});
