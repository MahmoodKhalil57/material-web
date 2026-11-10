/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import './md-gb-slider.js';

import {html, render} from 'lit';

import {SliderElement} from './slider-element.js';

// Single-pointer alternative to dragging (WCAG 2.5.7; spec Sliders >
// Accessibility): a tap (click) on the track moves the handle there, so the
// value can be changed without dragging. These tests use real mouse input,
// since only trusted clicks move a native range input.
// Loaded by URL (not a bare import) so the package's Node typings stay out of
// the gb TypeScript build.
const COMMANDS = '/node_modules/@web/test-runner-commands/browser/commands.mjs';

interface SendMousePayload {
  type: 'move' | 'down' | 'up' | 'click';
  position?: [number, number];
}

async function sendMouse(payload: SendMousePayload): Promise<void> {
  const commands = (await import(COMMANDS)) as {
    sendMouse(payload: SendMousePayload): Promise<void>;
  };
  await commands.sendMouse(payload);
}

describe('md-gb-slider single-pointer input', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.style.cssText = 'position: fixed; inset: 0 auto auto 0;';
    document.body.append(container);
  });

  afterEach(async () => {
    await sendMouse({type: 'up'});
    container.remove();
  });

  async function setup(template: unknown) {
    render(template, container);
    const slider = container.querySelector<SliderElement>('md-gb-slider')!;
    await slider.updateComplete;
    await new Promise((resolve) => requestAnimationFrame(resolve));
    return slider;
  }

  function trackRect(slider: SliderElement) {
    return slider
      .shadowRoot!.querySelector('input.slider-end')!
      .getBoundingClientRect();
  }

  async function tap(x: number, y: number) {
    await sendMouse({type: 'click', position: [Math.round(x), Math.round(y)]});
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }

  it('changes the value with a tap on the track', async () => {
    const slider = await setup(
      html`<md-gb-slider style="width: 400px" value="50"></md-gb-slider>`,
    );
    const input = jasmine.createSpy('input');
    const change = jasmine.createSpy('change');
    slider.addEventListener('input', input);
    slider.addEventListener('change', change);
    const rect = trackRect(slider);
    await tap(rect.left + rect.width * 0.2, rect.top + rect.height / 2);
    expect(slider.value).toBeLessThan(30);
    expect(slider.value).toBeGreaterThan(10);
    expect(input).toHaveBeenCalled();
    expect(change).toHaveBeenCalled();
  });

  it('mirrors taps in RTL', async () => {
    const slider = await setup(
      html`<md-gb-slider dir="rtl" style="width: 400px"></md-gb-slider>`,
    );
    const rect = trackRect(slider);
    await tap(rect.left + rect.width * 0.2, rect.top + rect.height / 2);
    expect(slider.value).toBeGreaterThan(70);
  });

  it('moves the nearest handle of a range slider', async () => {
    const slider = await setup(
      html`<md-gb-slider
        range
        style="width: 400px"
        value-start="40"
        value-end="60"></md-gb-slider>`,
    );
    const rect = trackRect(slider);
    await tap(rect.left + rect.width * 0.1, rect.top + rect.height / 2);
    expect(slider.valueStart).toBeLessThan(20);
    expect(slider.valueEnd).toBe(60);
    await tap(rect.left + rect.width * 0.9, rect.top + rect.height / 2);
    expect(slider.valueEnd).toBeGreaterThan(80);
    expect(slider.valueStart).toBeLessThan(20);
  });

  it('changes a vertical slider with a tap', async () => {
    const slider = await setup(
      html`<md-gb-slider
        orientation="vertical"
        style="height: 300px"
        value="50"></md-gb-slider>`,
    );
    const rect = slider.getBoundingClientRect();
    // Vertical sliders grow upward: a tap near the bottom lowers the value.
    await tap(rect.left + rect.width / 2, rect.top + rect.height * 0.85);
    expect(slider.value).toBeLessThan(35);
  });

  it('ignores taps when disabled', async () => {
    const slider = await setup(
      html`<md-gb-slider disabled style="width: 400px"></md-gb-slider>`,
    );
    const rect = trackRect(slider);
    await tap(rect.left + rect.width * 0.2, rect.top + rect.height / 2);
    expect(slider.value).toBe(50);
  });
});
