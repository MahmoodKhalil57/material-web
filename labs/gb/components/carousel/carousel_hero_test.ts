/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {sendMouse} from '@web/test-runner-commands';
import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';

import {CAROUSEL_ITEM_PROPERTIES} from './carousel.js';
import {type CarouselElement} from './carousel-element.js';
import './md-gb-carousel.js';

adoptStyles(document, [m3Styles]);

describe('carousel hero layouts and press feedback', () => {
  const env = new Environment();

  const items = (count: number) =>
    Array.from(
      {length: count},
      (_, i) =>
        html`<md-gb-carousel-item label="Item ${i}">
          <div style="background: gray"></div>
        </md-gb-carousel-item>`,
    );

  // spec: carousel-0501f7
  it('center-aligned hero has its first large item centered at rest', async () => {
    const root = env.render(html`
      <md-gb-carousel
        aria-label="Destinations"
        layout="hero"
        alignment="center"
        style="inline-size: 360px">
        ${items(8)}
      </md-gb-carousel>`);
    await env.waitForStability();
    const carousel = root.querySelector('md-gb-carousel') as CarouselElement;
    carousel.relayout();
    const scroller = carousel.shadowRoot!.querySelector('.carousel-scroller') as HTMLElement;
    const frames = [...carousel.querySelectorAll('md-gb-carousel-item')].map(
      (i) => i.shadowRoot!.querySelector('[part=frame]') as HTMLElement,
    );
    expect(scroller.scrollLeft).toBeCloseTo(0, 0);
    const box = scroller.getBoundingClientRect();
    const r = frames[0].getBoundingClientRect();
    expect(r.width).toBeGreaterThan(100);
    expect((r.left + r.right) / 2).toBeCloseTo((box.left + box.right) / 2, 0);
    // The next item is a small one on the trailing side; nothing leads.
    expect(frames[1].getBoundingClientRect().left).toBeGreaterThanOrEqual(r.right - 1);
  });

  // spec: carousel-0501f7
  it('center-aligned hero rests every item centered when scrolled to it', async () => {
    const root = env.render(html`
      <md-gb-carousel
        aria-label="Destinations"
        layout="hero"
        alignment="center"
        style="inline-size: 360px">
        ${items(8)}
      </md-gb-carousel>`);
    await env.waitForStability();
    const carousel = root.querySelector('md-gb-carousel') as CarouselElement;
    carousel.relayout();
    const scroller = carousel.shadowRoot!.querySelector('.carousel-scroller') as HTMLElement;
    const frames = [...carousel.querySelectorAll('md-gb-carousel-item')].map(
      (i) => i.shadowRoot!.querySelector('[part=frame]') as HTMLElement,
    );
    const box = scroller.getBoundingClientRect();
    for (const index of [3, 7]) {
      carousel.scrollToItem(index, 'instant');
      const r = frames[index].getBoundingClientRect();
      expect((r.left + r.right) / 2).toBeCloseTo((box.left + box.right) / 2, 0);
    }
  });

  // spec: carousel-57b6ba
  it('hero shows more large items on larger screens', async () => {
    const large = async (width: number) => {
      const root = env.render(html`
        <md-gb-carousel
          aria-label="Destinations"
          layout="hero"
          style="inline-size: ${width}px">
          ${items(8)}
        </md-gb-carousel>`);
      await env.waitForStability();
      const carousel = root.querySelector('md-gb-carousel') as CarouselElement;
      carousel.relayout();
      const sizes = [...carousel.querySelectorAll('md-gb-carousel-item')].map(
        (i) => parseFloat((i as HTMLElement).style.getPropertyValue(CAROUSEL_ITEM_PROPERTIES.size)),
      );
      const max = Math.max(...sizes);
      return sizes.filter((s) => s >= max - 1).length;
    };
    const compact = await large(360);
    const expanded = await large(1200);
    expect(compact).toBe(1);
    expect(expanded).toBeGreaterThan(compact);
  });

  // spec: carousel-b7dc57
  it('changes the shape of an item slightly while it is pressed', async () => {
    const root = env.render(html`
      <md-gb-carousel aria-label="Destinations" layout="multi-browse" style="inline-size: 360px; --item-width: 186px; --height: 200px">
        ${items(4)}
      </md-gb-carousel>`);
    await env.waitForStability();
    const carousel = root.querySelector('md-gb-carousel') as CarouselElement;
    carousel.relayout();
    const item = carousel.querySelector('md-gb-carousel-item')!;
    const content = item.shadowRoot!.querySelector<HTMLElement>('[part=content]')!;
    const rest = getComputedStyle(content).clipPath;
    expect(rest).toContain('round');
    const action = item.shadowRoot!.querySelector<HTMLElement>('[part=action]')!;
    const r = action.getBoundingClientRect();
    await sendMouse({type: 'move', position: [Math.round(r.x + r.width / 2), Math.round(r.y + r.height / 2)]});
    await sendMouse({type: 'down'});
    // The shape eases to the pressed shape, so wait for it to move.
    // The environment fakes timers and frames; a round trip to the test
    // server gives the (real time) transition room to run.
    const at = [Math.round(r.x + r.width / 2), Math.round(r.y + r.height / 2)];
    let changed = false;
    for (let i = 0; i < 50 && !changed; i++) {
      await sendMouse({type: 'move', position: [at[0], at[1]]});
      changed = getComputedStyle(content).clipPath !== rest;
    }
    await sendMouse({type: 'up'});
    await sendMouse({type: 'move', position: [0, 0]});
    expect(changed).toBeTrue();
  });

  // spec: carousel-0770d6
  it('keeps uncontained multi-aspect item widths between 9:16 and 16:9', async () => {
    const root = env.render(html`
      <md-gb-carousel
        aria-label="Destinations"
        layout="uncontained-multi-aspect"
        style="inline-size: 800px; --height: 200px">
        <md-gb-carousel-item label="Thin" style="inline-size: 20px"></md-gb-carousel-item>
        <md-gb-carousel-item label="Wide" style="inline-size: 900px"></md-gb-carousel-item>
        <md-gb-carousel-item label="Fit" style="inline-size: 150px"></md-gb-carousel-item>
      </md-gb-carousel>`);
    await env.waitForStability();
    const carousel = root.querySelector('md-gb-carousel') as CarouselElement;
    carousel.relayout();
    const scroller = carousel.shadowRoot!.querySelector('.carousel-scroller') as HTMLElement;
    const height = scroller.clientHeight;
    const [thin, wide, fit] = [...carousel.querySelectorAll('md-gb-carousel-item')].map(
      (i) => i.getBoundingClientRect().width,
    );
    expect(thin).toBeCloseTo((height * 9) / 16, 0);
    expect(wide).toBeCloseTo((height * 16) / 9, 0);
    expect(fit).toBeCloseTo(150, 0);
  });

  // spec: carousel-a29de2
  it('changes the size of an item as it scrolls', async () => {
    const root = env.render(html`
      <md-gb-carousel aria-label="Destinations" layout="multi-browse" style="inline-size: 360px; --item-width: 186px; --height: 200px">
        ${items(8)}
      </md-gb-carousel>`);
    await env.waitForStability();
    const carousel = root.querySelector('md-gb-carousel') as CarouselElement;
    carousel.relayout();
    const second = carousel.querySelectorAll('md-gb-carousel-item')[1] as HTMLElement;
    const size = () => parseFloat(second.style.getPropertyValue(CAROUSEL_ITEM_PROPERTIES.size));
    const before = size();
    carousel.scrollToItem(3, 'instant');
    expect(size()).not.toBe(before);
  });
});
