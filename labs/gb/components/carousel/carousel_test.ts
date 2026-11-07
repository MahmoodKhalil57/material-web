/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';

import {
  CAROUSEL_CLASSES,
  CAROUSEL_ITEM_PROPERTIES,
  carouselClasses,
  carouselItemClasses,
} from './carousel.js';
import {type CarouselElement} from './carousel-element.js';
import {
  heroKeylineList,
  multiBrowseKeylineList,
  uncontainedKeylineList,
} from './keylines.js';
import './md-gb-carousel.js';
import {
  calculateMaxScrollOffset,
  calculateParallaxItemInfo,
  getSnapScrollOffset,
  placeCarouselItem,
  Strategy,
} from './strategy.js';

import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';

adoptStyles(document, [m3Styles]);

const sizes = (list: {keylines: readonly {size: number}[]}) =>
  list.keylines.map((k) => Math.round(k.size * 10) / 10);

describe('carousel keylines (Compose port)', () => {
  it('fits a multi-browse arrangement of large, medium and small items', () => {
    const keylines = multiBrowseKeylineList({
      carouselMainAxisSize: 328,
      preferredItemSize: 186,
      itemSpacing: 8,
      itemCount: 10,
    });
    // anchor, large, medium, small, anchor
    expect(sizes(keylines)).toEqual([10, 178.4, 93.6, 40, 10]);
    expect(keylines.firstFocal.offset).toBeCloseTo(89.2);
    expect(keylines.first().isAnchor).toBeTrue();
    expect(keylines.last().isAnchor).toBeTrue();
  });

  it('drops small and medium keylines when there are few items', () => {
    const keylines = multiBrowseKeylineList({
      carouselMainAxisSize: 328,
      preferredItemSize: 186,
      itemSpacing: 8,
      itemCount: 2,
    });
    expect(keylines.keylines.filter((k) => !k.isAnchor).length).toBe(2);
  });

  it('creates a start-aligned hero with one small item', () => {
    const keylines = heroKeylineList({
      carouselMainAxisSize: 328,
      preferredItemSize: null,
      itemSpacing: 8,
      itemCount: 10,
    });
    expect(sizes(keylines)).toEqual([10, 280, 40, 10]);
  });

  it('centers a hero between two small items', () => {
    const keylines = heroKeylineList({
      carouselMainAxisSize: 328,
      preferredItemSize: null,
      itemSpacing: 8,
      itemCount: 10,
      isCentered: true,
    });
    expect(sizes(keylines)).toEqual([10, 40, 232, 40, 10]);
    expect(keylines.firstFocal.offset).toBeCloseTo(164);
  });

  it('cuts off a medium item at the end of an uncontained carousel', () => {
    const keylines = uncontainedKeylineList({
      carouselMainAxisSize: 360,
      itemSize: 240,
      itemSpacing: 8,
    });
    expect(sizes(keylines)).toEqual([84, 248, 168, 10]);
  });

  it('shifts the focal range to the end as the carousel scrolls to its end', () => {
    const keylines = multiBrowseKeylineList({
      carouselMainAxisSize: 328,
      preferredItemSize: 186,
      itemSpacing: 8,
      itemCount: 10,
    });
    const strategy = new Strategy(keylines, 328, 8, 0, 0);
    expect(strategy.startKeylineSteps.length).toBe(1);
    expect(strategy.endKeylineSteps.length).toBe(3);
    const max = calculateMaxScrollOffset(strategy, 10);
    expect(strategy.getKeylineListForScrollOffset(0, max)).toBe(keylines);
    const end = strategy.getKeylineListForScrollOffset(max, max);
    expect(end.lastNonAnchor.isFocal).toBeTrue();
    // The last item snaps to the end of the scroll range.
    expect(getSnapScrollOffset(strategy, 9, 10)).toBeCloseTo(max, 0);
  });

  it('masks items to their keyline size and pins them edge to edge', () => {
    const keylines = multiBrowseKeylineList({
      carouselMainAxisSize: 328,
      preferredItemSize: 186,
      itemSpacing: 8,
      itemCount: 10,
    });
    const strategy = new Strategy(keylines, 328, 8, 0, 0);
    const list = strategy.getKeylineListForScrollOffset(0, 1000);
    const first = placeCarouselItem(strategy, list, 0, 0);
    const second = placeCarouselItem(strategy, list, 1, 0);
    expect(first.size).toBeCloseTo(178.4);
    expect(first.translation).toBeCloseTo(0);
    expect(second.size).toBeCloseTo(93.6);
    expect(second.maskStart).toBeCloseTo((178.4 - 93.6) / 2);
    // The second item's visible start is 8px after the first item's end.
    const secondStart =
      strategy.itemMainAxisSize + 8 + second.translation + second.maskStart;
    expect(secondStart).toBeCloseTo(178.4 + 8);
  });

  it('masks and parallaxes multi-aspect items leaving the viewport', () => {
    const inside = calculateParallaxItemInfo(200, 200, 20, 0, 360);
    expect(inside.maskStart).toBe(0);
    expect(inside.maskEnd).toBe(200);
    const leaving = calculateParallaxItemInfo(200, 200, -100, 0, 360);
    expect(leaving.maskStart).toBeGreaterThan(0);
    expect(leaving.parallax).toBeGreaterThan(0);
  });
});

describe('carouselClasses()', () => {
  it('defaults to a snapping multi-browse carousel', () => {
    const classes = carouselClasses();
    expect(classes[CAROUSEL_CLASSES.multiBrowse]).toBeTrue();
    expect(classes[CAROUSEL_CLASSES.snap]).toBeTrue();
    expect(classes[CAROUSEL_CLASSES.snapSingle]).toBeFalse();
    expect(classes[CAROUSEL_CLASSES.vertical]).toBeFalse();
  });

  it('scrolls uncontained carousels freely by default', () => {
    expect(carouselClasses({layout: 'uncontained'})[CAROUSEL_CLASSES.snap])
      .withContext('uncontained')
      .toBeFalse();
    expect(
      carouselClasses({layout: 'uncontained', scrollMode: 'snap'})[
        CAROUSEL_CLASSES.snap
      ],
    )
      .withContext('scrollMode snap')
      .toBeTrue();
  });

  it('advances hero carousels one item at a time', () => {
    const classes = carouselClasses({layout: 'hero', alignment: 'center'});
    expect(classes[CAROUSEL_CLASSES.snapSingle]).toBeTrue();
    expect(classes[CAROUSEL_CLASSES.centered]).toBeTrue();
  });

  it('scrolls full-screen carousels vertically', () => {
    expect(
      carouselClasses({layout: 'full-screen'})[CAROUSEL_CLASSES.vertical],
    ).toBeTrue();
  });

  it('adds item state classes', () => {
    const classes = carouselItemClasses({outlined: true, disabled: true});
    expect(classes['carousel-item']).toBeTrue();
    expect(classes['carousel-item-outlined']).toBeTrue();
    expect(classes['disabled']).toBeTrue();
  });
});

describe('<md-gb-carousel>', () => {
  const env = new Environment();

  async function setupTest(
    attrs: {layout?: string; dir?: string; width?: number} = {},
  ) {
    const width = attrs.width ?? 360;
    const root = env.render(html`
      <button id="before">Before</button>
      <div dir=${attrs.dir ?? 'ltr'}>
        <md-gb-carousel
          aria-label="Destinations"
          layout=${attrs.layout ?? 'multi-browse'}
          style="inline-size: ${width}px; --item-width: 186px; --height: 200px">
          ${Array.from(
            {length: 8},
            (_, i) =>
              html`<md-gb-carousel-item label="Item ${i}">
                <div style="background: gray"></div>
                <span slot="label">Label ${i}</span>
              </md-gb-carousel-item>`,
          )}
        </md-gb-carousel>
      </div>
      <button id="after">Show all</button>
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
    return {root, carousel, items, scroller};
  }

  function actionOf(item: HTMLElement) {
    return item.shadowRoot!.querySelector(
      '.carousel-item-action',
    ) as HTMLElement;
  }

  function press(item: HTMLElement, key: string) {
    const event = new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    actionOf(item).dispatchEvent(event);
    return event;
  }

  describe('accessibility', () => {
    it('is a labelled carousel region with a list of items', async () => {
      const {carousel, items, scroller} = await setupTest();
      const internals = (
        carousel as unknown as {internals: ElementInternals}
      ).internals;
      expect(internals.role).toBe('region');
      expect(internals.ariaRoleDescription).toBe('carousel');
      expect(scroller.getAttribute('role')).toBe('list');
      const itemInternals = (items[0] as unknown as {internals: ElementInternals})
        .internals;
      expect(itemInternals.role).toBe('listitem');
    });

    it('names each item action with its label', async () => {
      const {items} = await setupTest();
      const action = actionOf(items[2]);
      expect(action.localName).toBe('button');
      expect(action.getAttribute('aria-label')).toBe('Item 2');
    });

    it('renders a link for items with href', async () => {
      const {items} = await setupTest();
      items[0].setAttribute('href', '#item');
      await env.waitForStability();
      const action = actionOf(items[0]);
      expect(action.localName).toBe('a');
      expect(action.getAttribute('href')).toBe('#item');
    });

    it('disables the action of disabled items', async () => {
      const {items} = await setupTest();
      items[1].toggleAttribute('disabled', true);
      await env.waitForStability();
      expect((actionOf(items[1]) as HTMLButtonElement).disabled).toBeTrue();
    });
  });

  describe('layout', () => {
    it('lays out items at the large item size with keyline masks', async () => {
      const {items, scroller} = await setupTest();
      // 360px wide less 16px padding on each side.
      expect(scroller.clientWidth).toBe(328);
      expect(items[0].getBoundingClientRect().width).toBeCloseTo(178.4, 0);
      const size = (i: number) =>
        parseFloat(items[i].style.getPropertyValue(CAROUSEL_ITEM_PROPERTIES.size));
      expect(size(0)).toBeCloseTo(178.4, 0);
      expect(size(1)).toBeCloseTo(93.6, 0);
      expect(size(2)).toBeCloseTo(40, 0);
      expect(
        Number(items[0].style.getPropertyValue(CAROUSEL_ITEM_PROPERTIES.fraction)),
      ).toBe(1);
    });

    it('puts the focal item in front', async () => {
      const {items} = await setupTest();
      expect(Number(items[0].style.zIndex)).toBeGreaterThan(
        Number(items[2].style.zIndex),
      );
    });

    it('scrolls an item to its snapped position', async () => {
      const {carousel, items} = await setupTest();
      carousel.scrollToItem(3, 'instant');
      expect(carousel.currentIndex).toBe(3);
      const size = parseFloat(
        items[3].style.getPropertyValue(CAROUSEL_ITEM_PROPERTIES.size),
      );
      expect(size).toBeCloseTo(178.4, 0);
    });

    it('scrolls the last item to the end of the container', async () => {
      const {carousel, scroller} = await setupTest();
      carousel.scrollToItem(7, 'instant');
      expect(carousel.currentIndex).toBe(7);
      expect(scroller.scrollLeft).toBeCloseTo(
        scroller.scrollWidth - scroller.clientWidth,
        0,
      );
    });

    it('mirrors translation in RTL', async () => {
      const {items} = await setupTest({dir: 'rtl'});
      const translate = items[1].style.getPropertyValue(
        CAROUSEL_ITEM_PROPERTIES.translate,
      );
      // LTR pulls the medium item toward the start (negative x).
      expect(parseFloat(translate)).toBeGreaterThan(0);
    });

    it('lays out a vertical full-screen carousel', async () => {
      const {carousel, items, scroller} = await setupTest({
        layout: 'full-screen',
      });
      const container = carousel.shadowRoot!.querySelector('.carousel')!;
      expect(container.classList).toContain(CAROUSEL_CLASSES.vertical);
      expect(items[0].getBoundingClientRect().height).toBeCloseTo(
        scroller.clientHeight,
        0,
      );
      carousel.scrollToItem(2, 'instant');
      expect(scroller.scrollTop).toBeGreaterThan(0);
      expect(carousel.currentIndex).toBe(2);
    });

    it('relayouts when the layout changes', async () => {
      const {carousel, items} = await setupTest();
      carousel.layout = 'hero';
      await env.waitForStability();
      const size = parseFloat(
        items[0].style.getPropertyValue(CAROUSEL_ITEM_PROPERTIES.size),
      );
      expect(size).toBeCloseTo(136, 0);
    });
  });

  describe('keyboard', () => {
    it('moves focus to the next and previous items with arrow keys', async () => {
      const {items} = await setupTest();
      items[0].focus();
      const event = press(items[0], 'ArrowRight');
      expect(event.defaultPrevented).toBeTrue();
      expect(document.activeElement).toBe(items[1]);
      press(items[1], 'ArrowLeft');
      expect(document.activeElement).toBe(items[0]);
    });

    it('jumps to the ends with Home and End', async () => {
      const {items} = await setupTest();
      items[0].focus();
      press(items[0], 'End');
      expect(document.activeElement).toBe(items[7]);
      press(items[7], 'Home');
      expect(document.activeElement).toBe(items[0]);
    });

    it('reverses arrow keys in RTL', async () => {
      const {items} = await setupTest({dir: 'rtl'});
      items[0].focus();
      press(items[0], 'ArrowLeft');
      expect(document.activeElement).toBe(items[1]);
    });

    it('leaves the carousel with the up and down arrows', async () => {
      const {root, items} = await setupTest();
      items[2].focus();
      press(items[2], 'ArrowDown');
      expect(document.activeElement).toBe(root.querySelector('#after'));
      items[2].focus();
      press(items[2], 'ArrowUp');
      expect(document.activeElement).toBe(root.querySelector('#before'));
    });
  });

  describe('mouse drag', () => {
    function mouse(
      type: string,
      target: Element,
      x: number,
      y: number,
      time: number,
    ) {
      const event = new PointerEvent(type, {
        bubbles: true,
        composed: true,
        cancelable: true,
        pointerId: 3,
        pointerType: 'mouse',
        isPrimary: true,
        button: 0,
        clientX: x,
        clientY: y,
      });
      Object.defineProperty(event, 'timeStamp', {value: time});
      target.dispatchEvent(event);
    }

    // Touch and pen scroll natively; a mouse drags the carousel through the
    // shared DragGesture and follows the pointer in real time.
    it('scrolls with the pointer while a mouse drags, in the drag direction', async () => {
      const {scroller} = await setupTest();
      const rect = scroller.getBoundingClientRect();
      const x = rect.left + 200;
      const y = rect.top + 60;
      mouse('pointerdown', scroller, x, y, 0);
      mouse('pointermove', scroller, x - 40, y, 50);
      mouse('pointermove', scroller, x - 100, y, 100);
      expect(scroller.scrollLeft).toBeCloseTo(100, 0);
      mouse('pointercancel', scroller, x - 100, y, 150);
    });

    it('mirrors the drag in right-to-left layouts', async () => {
      const {scroller} = await setupTest({dir: 'rtl'});
      const rect = scroller.getBoundingClientRect();
      const x = rect.left + 100;
      const y = rect.top + 60;
      mouse('pointerdown', scroller, x, y, 0);
      mouse('pointermove', scroller, x + 40, y, 50);
      mouse('pointermove', scroller, x + 100, y, 100);
      // Scrolling toward the end in RTL is a negative scrollLeft.
      expect(scroller.scrollLeft).toBeCloseTo(-100, 0);
      mouse('pointercancel', scroller, x + 100, y, 150);
    });

    it('does not click the item under the pointer after a drag', async () => {
      const {items, scroller} = await setupTest();
      const spy = jasmine.createSpy('click');
      items[0].addEventListener('click', spy);
      const rect = scroller.getBoundingClientRect();
      const x = rect.left + 100;
      const y = rect.top + 60;
      mouse('pointerdown', actionOf(items[0]), x, y, 0);
      mouse('pointermove', actionOf(items[0]), x - 40, y, 50);
      mouse('pointerup', actionOf(items[0]), x - 40, y, 600);
      actionOf(items[0]).click();
      expect(spy).not.toHaveBeenCalled();
    });

    it('ignores a touch pointer, which scrolls natively', async () => {
      const {scroller} = await setupTest();
      const rect = scroller.getBoundingClientRect();
      const x = rect.left + 200;
      const y = rect.top + 60;
      const touch = (type: string, px: number, time: number) => {
        const event = new PointerEvent(type, {
          bubbles: true,
          composed: true,
          pointerId: 4,
          pointerType: 'touch',
          isPrimary: true,
          clientX: px,
          clientY: y,
        });
        Object.defineProperty(event, 'timeStamp', {value: time});
        scroller.dispatchEvent(event);
      };
      touch('pointerdown', x, 0);
      touch('pointermove', x - 100, 50);
      expect(scroller.scrollLeft).toBe(0);
      touch('pointerup', x - 100, 100);
    });
  });

  describe('events', () => {
    it('fires click when an item is activated', async () => {
      const {items} = await setupTest();
      const spy = jasmine.createSpy('click');
      items[1].addEventListener('click', spy);
      actionOf(items[1]).click();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
