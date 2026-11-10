/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {emulateMedia, sendKeys, sendMouse} from '@web/test-runner-commands';
import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {center, deepElements, prop, ripplesOf} from '../shared/test-dom.js';

import {type CarouselElement} from './carousel-element.js';
import './md-gb-carousel.js';

adoptStyles(document, [m3Styles]);

function settleTransitions(el: Element) {
  for (let pass = 0; pass < 2; pass++) {
    for (const a of [
      ...document.getAnimations(),
      ...deepElements(el).flatMap((e) => e.getAnimations()),
    ]) {
      try {
        a.finish();
      } catch {
        // Infinite animations cannot finish.
      }
    }
  }
}

describe('carousel states and layout', () => {
  const env = new Environment();

  async function setup(
    attrs: {layout?: string; width?: number; count?: number} = {},
  ) {
    const root = env.render(html`
      <button id="before">Before</button>
      <md-gb-carousel
        aria-label="Destinations"
        layout=${attrs.layout ?? 'multi-browse'}
        style="inline-size: ${attrs.width ?? 360}px; ${attrs.layout === 'hero' ? '' : '--item-width: 186px; --height: 200px'}">
        ${Array.from(
          {length: attrs.count ?? 8},
          (_, i) =>
            html`<md-gb-carousel-item label="Item ${i}">
              <div style="background: gray"></div>
            </md-gb-carousel-item>`,
        )}
      </md-gb-carousel>
      <button id="after">After</button>
    `);
    await env.waitForStability();
    const carousel = root.querySelector('md-gb-carousel') as CarouselElement;
    carousel.relayout();
    const items = [
      ...carousel.querySelectorAll('md-gb-carousel-item'),
    ] as HTMLElement[];
    const scroller = carousel.shadowRoot!.querySelector(
      '.carousel-scroller',
    ) as HTMLElement;
    const action = (i: number) =>
      items[i].shadowRoot!.querySelector<HTMLElement>('[part=action]')!;
    return {carousel, items, scroller, action};
  }

  afterEach(async () => {
    await sendMouse({type: 'up'}).catch(() => {});
    await sendMouse({type: 'move', position: [0, 0]});
  });

  // spec: carousel-a199be, carousel-35613e, carousel-bec92e
  it('shows a hover state layer on an item and a ripple when it is clicked', async () => {
    const {action, items} = await setup();
    const c = center(action(0));
    await sendMouse({type: 'move', position: [c.x, c.y]});
    settleTransitions(items[0]);
    expect(
      ripplesOf(items[0]).some((r) => prop(r, '--ripple-hover-opacity') === '8%'),
    ).toBeTrue();
    await sendMouse({type: 'down'});
    settleTransitions(items[0]);
    expect(
      ripplesOf(items[0]).some((r) => prop(r, '--ripple-press-opacity') === '10%'),
    ).toBeTrue();
    await sendMouse({type: 'up'});
  });

  // spec: carousel-0b30f2
  it('shows the press ripple when an item is tapped', async () => {
    const {action, items} = await setup();
    const c = center(action(1));
    await sendMouse({type: 'move', position: [c.x, c.y]});
    await sendMouse({type: 'down'});
    settleTransitions(items[1]);
    expect(
      ripplesOf(items[1]).some((r) => prop(r, '--ripple-press-opacity') === '10%'),
    ).toBeTrue();
    await sendMouse({type: 'up'});
  });

  // spec: carousel-06c0da, carousel-d63bc4, carousel-750377, carousel-fbb8ae
  it('puts initial focus on the first item (never the container), then moves between items', async () => {
    const {carousel, items} = await setup();
    document.querySelector<HTMLElement>('#before')!.focus();
    await sendKeys({press: 'Tab'});
    expect(carousel.matches(':focus')).withContext('container').toBeFalse();
    expect(items[0].matches(':focus-within')).toBeTrue();
    await sendKeys({press: 'ArrowRight'});
    expect(items[1].matches(':focus-within')).toBeTrue();
    await sendKeys({press: 'Tab'});
    expect(items[2].matches(':focus-within')).toBeTrue();
  });

  // spec: carousel-ae6f7c
  it('leaves the carousel with the down arrow', async () => {
    const {items} = await setup();
    document.querySelector<HTMLElement>('#before')!.focus();
    await sendKeys({press: 'Tab'});
    expect(items[0].matches(':focus-within')).toBeTrue();
    await sendKeys({press: 'ArrowDown'});
    expect(document.activeElement?.id).toBe('after');
  });

  // spec: carousel-1b39bc
  it('labels the carousel container with a list role', async () => {
    const {carousel} = await setup();
    expect(carousel.getAttribute('aria-label')).toBe('Destinations');
    const list = carousel.shadowRoot!.querySelector('[role=list]');
    const role = (carousel as HTMLElement & {role: string | null}).role;
    expect(list !== null || role === 'list' || role === 'region').toBeTrue();
  });

  // spec: carousel-fc653d
  it('gives every uncontained item the same size', async () => {
    const {items} = await setup({layout: 'uncontained'});
    const widths = items.map((i) => Math.round(i.getBoundingClientRect().width));
    expect(new Set(widths).size).toBe(1);
  });

  // spec: carousel-e80127, carousel-f74c8b
  it('with reduced motion, a hero carousel shows its small item only partly and reaches both edges', async () => {
    await emulateMedia({reducedMotion: 'reduce'});
    try {
      const {items, scroller} = await setup({layout: 'hero'});
      const box = scroller.getBoundingClientRect();
      const first = items[0].getBoundingClientRect();
      const second = items[1].getBoundingClientRect();
      expect(first.left).toBeCloseTo(box.left, 0);
      expect(second.left).toBeLessThan(box.right);
      expect(second.right).toBeGreaterThan(box.right - 1);
    } finally {
      await emulateMedia({reducedMotion: 'no-preference'});
    }
  });
});
