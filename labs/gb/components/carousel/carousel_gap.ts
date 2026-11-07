/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Gaps: spec requirements the carousel does not meet yet. Red until the
// component is fixed; run with `npm run gb:check -- --gaps`.

// import 'jasmine'; (google3-only)

import {sendMouse} from '@web/test-runner-commands';
import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';

import {CAROUSEL_ITEM_PROPERTIES} from './carousel.js';
import {type CarouselElement} from './carousel-element.js';
import './md-gb-carousel.js';

describe('carousel gaps', () => {
  const env = new Environment();

  // carousel.md "Center-aligned hero": the large item sits between two small
  // items, centered. At rest the first item is the large one, but the keylines
  // lay out item 0 at the start edge (scrollLeft 0), so it is not centered
  // until the carousel is scrolled (scrollToItem works for later items).
  it('center-aligned hero has its first large item centered at rest', async () => {
    const root = env.render(html`
      <md-gb-carousel
        aria-label="Destinations"
        layout="hero"
        alignment="center"
        style="inline-size: 360px">
        ${Array.from(
          {length: 8},
          (_, i) =>
            html`<md-gb-carousel-item label="Item ${i}">
              <div style="background: gray"></div>
            </md-gb-carousel-item>`,
        )}
      </md-gb-carousel>`);
    await env.waitForStability();
    const carousel = root.querySelector('md-gb-carousel') as CarouselElement;
    carousel.relayout();
    const items = [...carousel.querySelectorAll('md-gb-carousel-item')] as HTMLElement[];
    const scroller = carousel.shadowRoot!.querySelector('.carousel-scroller') as HTMLElement;
    expect(scroller.scrollLeft).toBeCloseTo(0, 0);
    const box = scroller.getBoundingClientRect();
    const r = items[0].getBoundingClientRect();
    expect(r.width).toBeGreaterThan(100);
    expect((r.left + r.right) / 2).toBeCloseTo((box.left + box.right) / 2, 0);
  });

  // carousel.md Hero: "On larger screens, more large items are visible." The
  // hero layout always shows one large item, whatever the container width.
  it('hero shows more large items on larger screens', async () => {
    const large = async (width: number) => {
      const root = env.render(html`
        <md-gb-carousel
          aria-label="Destinations"
          layout="hero"
          style="inline-size: ${width}px">
          ${Array.from(
            {length: 8},
            (_, i) =>
              html`<md-gb-carousel-item label="Item ${i}">
                <div style="background: gray"></div>
              </md-gb-carousel-item>`,
          )}
        </md-gb-carousel>`);
      await env.waitForStability();
      const carousel = root.querySelector('md-gb-carousel') as CarouselElement;
      carousel.relayout();
      const items = [...carousel.querySelectorAll('md-gb-carousel-item')] as HTMLElement[];
      const size = (i: HTMLElement) =>
        parseFloat(i.style.getPropertyValue(CAROUSEL_ITEM_PROPERTIES.size));
      const max = Math.max(...items.map(size));
      return items.filter((i) => size(i) >= max - 1).length;
    };
    const compact = await large(360);
    const expanded = await large(1200);
    expect(expanded).toBeGreaterThan(compact);
  });

  // carousel.md Touch: "Tapping on a carousel item changes the shape slightly,
  // and creates a touch ripple." The ripple is there; the shape is not.
  // spec: carousel-b7dc57
  it('changes the shape of an item slightly while it is pressed', async () => {
    const root = env.render(html`
      <md-gb-carousel aria-label="Destinations" layout="multi-browse" style="inline-size: 360px; --item-width: 186px; --height: 200px">
        ${Array.from(
          {length: 4},
          (_, i) =>
            html`<md-gb-carousel-item label="Item ${i}">
              <div style="background: gray"></div>
            </md-gb-carousel-item>`,
        )}
      </md-gb-carousel>`);
    await env.waitForStability();
    const carousel = root.querySelector('md-gb-carousel') as CarouselElement;
    carousel.relayout();
    const item = carousel.querySelector('md-gb-carousel-item')!;
    const content = item.shadowRoot!.querySelector<HTMLElement>('[part=content]')!;
    const rest = getComputedStyle(content).clipPath;
    const action = item.shadowRoot!.querySelector<HTMLElement>('[part=action]')!;
    const r = action.getBoundingClientRect();
    await sendMouse({type: 'move', position: [Math.round(r.x + r.width / 2), Math.round(r.y + r.height / 2)]});
    await sendMouse({type: 'down'});
    for (const a of document.getAnimations()) a.finish();
    const pressed = getComputedStyle(content).clipPath;
    await sendMouse({type: 'up'});
    await sendMouse({type: 'move', position: [0, 0]});
    expect(pressed).not.toBe(rest);
  });
});
