/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {Environment} from '../../testing/environment.js';

import {
  FOCUS_INDICATOR_EXTENT_PX,
  OBSCURED_BLOCK_END_PROPERTY,
  OBSCURED_BLOCK_START_PROPERTY,
  obscuredExtent,
  setupScrollPadding,
} from './scroll-padding.js';

describe('setupScrollPadding()', () => {
  const env = new Environment();

  function setup() {
    const root = env.render(html`
      <div
        class="scroller"
        style="position: relative; block-size: 300px; overflow: auto">
        <header
          class="top"
          style="position: sticky; inset-block-start: 0; block-size: 64px; z-index: 1">
          App bar
        </header>
        <div style="block-size: 400px"></div>
        <button class="target" style="block-size: 40px">Target</button>
        <div style="block-size: 800px"></div>
        <footer
          class="bottom"
          style="position: sticky; inset-block-end: 16px; block-size: 80px">
          Toolbar
        </footer>
      </div>
    `);
    const scroller = root.querySelector<HTMLElement>('.scroller')!;
    const top = root.querySelector<HTMLElement>('.top')!;
    const bottom = root.querySelector<HTMLElement>('.bottom')!;
    const target = root.querySelector<HTMLButtonElement>('.target')!;
    return {scroller, top, bottom, target};
  }

  it('measures sticky bars by their inset and height', () => {
    const {scroller, top, bottom} = setup();
    expect(obscuredExtent(top, scroller, 'start')).toBe(64);
    expect(obscuredExtent(bottom, scroller, 'end')).toBe(16 + 80);
  });

  it('ignores bars that scroll with the content', () => {
    const {scroller, top} = setup();
    top.style.position = 'static';
    expect(obscuredExtent(top, scroller, 'start')).toBe(0);
  });

  it('sets scroll-padding and the obscured custom properties', () => {
    const {scroller, top, bottom} = setup();
    const padding = setupScrollPadding(scroller, {start: [top], end: [bottom]});
    const start = 64 + FOCUS_INDICATOR_EXTENT_PX;
    const end = 96 + FOCUS_INDICATOR_EXTENT_PX;
    expect(padding.start).toBe(start);
    expect(padding.end).toBe(end);
    const style = getComputedStyle(scroller);
    expect(style.scrollPaddingBlockStart).toBe(`${start}px`);
    expect(style.scrollPaddingBlockEnd).toBe(`${end}px`);
    expect(scroller.style.getPropertyValue(OBSCURED_BLOCK_START_PROPERTY)).toBe(
      `${start}px`,
    );
    expect(scroller.style.getPropertyValue(OBSCURED_BLOCK_END_PROPERTY)).toBe(
      `${end}px`,
    );
    padding.disconnect();
    expect(scroller.style.scrollPaddingBlockStart).toBe('');
    expect(scroller.style.getPropertyValue(OBSCURED_BLOCK_START_PROPERTY)).toBe(
      '',
    );
  });

  it('accepts a custom gap', () => {
    const {scroller, top} = setup();
    const padding = setupScrollPadding(scroller, {start: [top], gap: 0});
    expect(padding.start).toBe(64);
    expect(padding.end).toBe(0);
    padding.disconnect();
  });

  it('updates when a bar resizes', () => {
    const {scroller, top} = setup();
    const padding = setupScrollPadding(scroller, {start: [top], gap: 0});
    top.style.blockSize = '112px';
    padding.update();
    expect(padding.start).toBe(112);
    padding.disconnect();
  });

  it('stops when the signal aborts', () => {
    const {scroller, top} = setup();
    const controller = new AbortController();
    setupScrollPadding(scroller, {start: [top], signal: controller.signal});
    expect(scroller.style.scrollPaddingBlockStart).not.toBe('');
    controller.abort();
    expect(scroller.style.scrollPaddingBlockStart).toBe('');
  });

  it('keeps a focused element and its focus indicator clear of the bars', () => {
    const {scroller, top, bottom, target} = setup();
    const padding = setupScrollPadding(scroller, {start: [top], end: [bottom]});
    // Put the target under the top app bar.
    scroller.scrollTop = target.offsetTop - 20;
    target.focus({preventScroll: true});
    const scrollport = scroller.getBoundingClientRect();
    const rect = target.getBoundingClientRect();
    expect(rect.top - FOCUS_INDICATOR_EXTENT_PX)
      .withContext('below the app bar')
      .toBeGreaterThanOrEqual(scrollport.top + padding.start - 1);
    target.blur();

    // Put the target under the bottom toolbar.
    scroller.scrollTop = target.offsetTop - 300 + 60;
    target.focus({preventScroll: true});
    const after = target.getBoundingClientRect();
    expect(after.bottom + FOCUS_INDICATOR_EXTENT_PX)
      .withContext('above the toolbar')
      .toBeLessThanOrEqual(scrollport.bottom - padding.end + 1);
    padding.disconnect();
  });

  it('does not scroll for focus inside a bar', () => {
    const {scroller, top} = setup();
    const button = document.createElement('button');
    button.textContent = 'Menu';
    top.append(button);
    const padding = setupScrollPadding(scroller, {start: [top]});
    scroller.scrollTop = 200;
    button.focus({preventScroll: true});
    expect(scroller.scrollTop).toBe(200);
    padding.disconnect();
  });
});
