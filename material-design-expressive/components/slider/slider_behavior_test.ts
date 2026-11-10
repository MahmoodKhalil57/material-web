/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import '../../styles/icon/md-gb-icon.js';
import './md-gb-slider.js';

import {sendKeys, sendMouse} from '@web/test-runner-commands';
import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {type SliderElement} from './slider-element.js';

adoptStyles(document, [m3Styles]);

const ROLES = [
  '--md-sys-color-primary: rgb(1, 1, 1)',
  '--md-sys-color-on-primary: rgb(2, 2, 2)',
  '--md-sys-color-secondary-container: rgb(3, 3, 3)',
  '--md-sys-color-on-secondary-container: rgb(4, 4, 4)',
  '--md-sys-color-inverse-surface: rgb(5, 5, 5)',
  '--md-sys-color-inverse-on-surface: rgb(6, 6, 6)',
].join(';');

describe('<md-gb-slider> spec behavior', () => {
  const env = new Environment();

  async function setup(template: unknown) {
    const root = env.render(
      html`<div style="width: 400px; ${ROLES}">${template}</div>`,
    );
    await env.waitForStability();
    const els = [...root.querySelectorAll<SliderElement>('md-gb-slider')];
    const q = (e: SliderElement, sel: string) =>
      e.shadowRoot!.querySelector<HTMLElement>(sel)!;
    return {root, els, q};
  }

  const prop = (el: Element, name: string) =>
    getComputedStyle(el).getPropertyValue(name).trim();

  const finish = (el: SliderElement) =>
    el.shadowRoot!.querySelector(".slider")!.getAnimations({subtree: true}).forEach((a) => a.finish());

  afterEach(async () => {
    await sendMouse({type: 'up'}).catch(() => {});
    await sendMouse({type: 'move', position: [0, 0]});
  });

  // spec: sliders-b65a1b, sliders-445b56, sliders-47db4e, sliders-308966, sliders-699f16, sliders-fb93ac, sliders-37b134, sliders-84b422, sliders-b6d224, sliders-340421
  it('offers standard (continuous), centered and range variants', async () => {
    const {els, q} = await setup(html`
      <md-gb-slider aria-label="a"></md-gb-slider>
      <md-gb-slider centered aria-label="b"></md-gb-slider>
      <md-gb-slider range label-start="s" label-end="e" value-start="20" value-end="70"></md-gb-slider>`);
    const [standard, centered, range] = els;
    expect(q(standard, '.slider').classList.contains('slider-ticks')).toBeFalse();
    expect(standard.shadowRoot!.querySelectorAll('input').length).toBe(1);
    expect(q(centered, '.slider').classList.contains('slider-centered')).toBeTrue();
    expect(range.shadowRoot!.querySelectorAll('input').length).toBe(2);
    expect(range.value).toBeUndefined;
    expect(range.valueStart).toBe(20);
    expect(range.valueEnd).toBe(70);
  });

  // spec: sliders-597dd8, sliders-b6e7e2, sliders-616323, sliders-742d06, sliders-abadf8
  it('shows a stop indicator for each available value on a discrete slider', async () => {
    const {els, q} = await setup(html`
      <md-gb-slider ticks min="0" max="100" step="25" value="50" aria-label="a"></md-gb-slider>
      <md-gb-slider min="0" max="100" step="25" value="50" aria-label="b"></md-gb-slider>`);
    const [discrete, continuous] = els;
    const box = (e: SliderElement) => q(e, '.slider-track-box.slider-ticks');
    expect(box(discrete)).not.toBeNull();
    expect(Number(prop(box(discrete), '--__tick-count'))).toBeGreaterThan(0);
    expect(continuous.shadowRoot!.querySelector('.slider-track-box.slider-ticks')).toBeNull();
  });

  // spec: sliders-2d6b17, sliders-a807b2, sliders-3ca784, sliders-7ca4aa
  it('snaps to the closest stop when a discrete slider is tapped', async () => {
    const {els, q} = await setup(html`
      <md-gb-slider ticks min="0" max="100" step="25" value="0" aria-label="a"></md-gb-slider>`);
    const input = q(els[0], 'input.slider-end');
    const r = input.getBoundingClientRect();
    await sendMouse({
      type: 'click',
      position: [Math.round(r.left + r.width * 0.55), Math.round(r.top + r.height / 2)],
    });
    expect(els[0].value! % 25).toBe(0);
    expect(els[0].value).toBeGreaterThan(0);
  });

  // spec: sliders-d4945b, sliders-3ca784
  it('moves a standard slider to the selected location of the track', async () => {
    const {els, q} = await setup(html`
      <md-gb-slider value="0" aria-label="a"></md-gb-slider>`);
    const r = q(els[0], 'input.slider-end').getBoundingClientRect();
    await sendMouse({
      type: 'click',
      position: [Math.round(r.left + r.width * 0.8), Math.round(r.top + r.height / 2)],
    });
    expect(els[0].value).toBeGreaterThan(70);
    expect(els[0].value).toBeLessThan(90);
  });

  // spec: sliders-f321a6, sliders-3a9047
  it('drags the handle smoothly through values', async () => {
    const {els, q} = await setup(html`
      <md-gb-slider value="10" aria-label="a"></md-gb-slider>`);
    const r = q(els[0], 'input.slider-end').getBoundingClientRect();
    const y = Math.round(r.top + r.height / 2);
    await sendMouse({type: 'move', position: [Math.round(r.left + r.width * 0.1), y]});
    await sendMouse({type: 'down'});
    const seen: number[] = [];
    for (const f of [0.3, 0.45, 0.6]) {
      await sendMouse({type: 'move', position: [Math.round(r.left + r.width * f), y]});
      seen.push(els[0].value!);
    }
    await sendMouse({type: 'up'});
    expect(seen[0]).toBeLessThan(seen[1]);
    expect(seen[1]).toBeLessThan(seen[2]);
    expect(new Set(seen.map((v) => Number.isInteger(v))).size).toBe(1);
  });

  // spec: sliders-2c7c39, sliders-d0a21b, sliders-70c2ce
  it('updates its value and fires input while the handle moves, before any release', async () => {
    const {els, q} = await setup(html`
      <md-gb-slider value="10" aria-label="a"></md-gb-slider>`);
    const inputs: number[] = [];
    els[0].addEventListener('input', () => inputs.push(els[0].value!));
    const r = q(els[0], 'input.slider-end').getBoundingClientRect();
    const y = Math.round(r.top + r.height / 2);
    await sendMouse({type: 'move', position: [Math.round(r.left + r.width * 0.1), y]});
    await sendMouse({type: 'down'});
    await sendMouse({type: 'move', position: [Math.round(r.left + r.width * 0.5), y]});
    expect(inputs.length).toBeGreaterThan(0);
    expect(inputs[inputs.length - 1]).toBeGreaterThan(30);
    await sendMouse({type: 'up'});
  });

  // spec: sliders-1ff9a9, sliders-cefce3, sliders-9f4e57, sliders-a397a2, sliders-c2c25a, sliders-7d3dc7, sliders-086f16, sliders-591c15
  it('changes the value by one step per arrow key, and to the next stop when discrete', async () => {
    const {els} = await setup(html`
      <md-gb-slider value="50" aria-label="a"></md-gb-slider>
      <md-gb-slider ticks step="25" value="50" aria-label="b"></md-gb-slider>`);
    await sendKeys({press: 'Tab'});
    await sendKeys({press: 'ArrowRight'});
    expect(els[0].value).toBe(51);
    await sendKeys({press: 'ArrowLeft'});
    await sendKeys({press: 'ArrowLeft'});
    expect(els[0].value).toBe(49);
    await sendKeys({press: 'Tab'});
    await sendKeys({press: 'ArrowRight'});
    expect(els[1].value).toBe(75);
    await sendKeys({press: 'ArrowLeft'});
    await sendKeys({press: 'ArrowLeft'});
    expect(els[1].value).toBe(25);
  });

  // spec: sliders-79bf79, sliders-09373b, sliders-474ce8, sliders-e9d08e
  it('lands focus on the handle with Tab and shows the focus indicator', async () => {
    const {els, q} = await setup(html`<md-gb-slider value="50" aria-label="a"></md-gb-slider>`);
    await sendKeys({press: 'Tab'});
    expect(document.activeElement).toBe(els[0]);
    const input = q(els[0], 'input.slider-end');
    expect(els[0].shadowRoot!.activeElement).toBe(input);
    expect(input.matches(':focus-visible')).toBeTrue();
    finish(els[0]);
    const nub = q(els[0], '.slider-handle.slider-end .slider-handle-nub');
    expect(getComputedStyle(nub, '::before').outlineStyle).toBe('solid');
  });

  // spec: sliders-364029, sliders-bf0e8b, sliders-77f7e2, sliders-25b3cb, sliders-9fe44e
  it('shrinks the handle and shows the value while pressed or dragged', async () => {
    const {els, q} = await setup(html`
      <md-gb-slider labeled value="50" aria-label="a"></md-gb-slider>`);
    const nub = q(els[0], '.slider-handle.slider-end .slider-handle-nub');
    const label = q(els[0], '.slider-handle.slider-end .slider-label');
    finish(els[0]);
    const resting = parseFloat(getComputedStyle(nub).width);
    expect(getComputedStyle(label).opacity).toBe('0');
    const r = nub.getBoundingClientRect();
    await sendMouse({
      type: 'move',
      position: [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2)],
    });
    await sendMouse({type: 'down'});
    finish(els[0]);
    expect(parseFloat(getComputedStyle(nub).width)).toBeLessThan(resting);
    expect(getComputedStyle(label).opacity).toBe('1');
    await sendMouse({type: 'up'});
  });

  // spec: sliders-5b6b13, sliders-bb08e5
  it('shows the value when the handle is hovered', async () => {
    const {els, q} = await setup(html`
      <md-gb-slider labeled value="50" aria-label="a"></md-gb-slider>`);
    const label = q(els[0], '.slider-handle.slider-end .slider-label');
    const nub = q(els[0], '.slider-handle.slider-end .slider-handle-nub');
    const r = nub.getBoundingClientRect();
    await sendMouse({
      type: 'move',
      position: [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2)],
    });
    finish(els[0]);
    expect(getComputedStyle(label).opacity).toBe('1');
  });

  // spec: sliders-aa8d2d
  it('rests with no value shown and a full-width handle in the enabled state', async () => {
    const {els, q} = await setup(html`
      <md-gb-slider labeled value="50" aria-label="a"></md-gb-slider>`);
    expect(getComputedStyle(q(els[0], '.slider-label')).opacity).toBe('0');
    expect(getComputedStyle(q(els[0], '.slider-handle-nub')).width).toBe('4px');
  });

  // spec: sliders-3b1823
  it('displays the value that corresponds with the handle', async () => {
    const {els, q} = await setup(html`
      <md-gb-slider labeled value="42" aria-label="a"></md-gb-slider>`);
    expect(q(els[0], '.slider-label-content').textContent?.trim()).toBe('42');
    els[0].value = 17;
    await els[0].updateComplete;
    expect(q(els[0], '.slider-label-content').textContent?.trim()).toBe('17');
  });

  // spec: sliders-3e978f, sliders-f3dc3d, sliders-57b129, sliders-3faf02, sliders-a61887, sliders-b1c2ff, sliders-face0e, sliders-5f7a12, sliders-5dd647, sliders-77d9f5, sliders-94151d
  it('is horizontal by default and can be vertical, in every variant', async () => {
    const {els, q} = await setup(html`
      <md-gb-slider aria-label="a"></md-gb-slider>
      <md-gb-slider orientation="vertical" style="height: 200px" aria-label="b"></md-gb-slider>
      <md-gb-slider orientation="vertical" centered style="height: 200px" aria-label="c"></md-gb-slider>`);
    const dims = (e: SliderElement) => {
      const r = q(e, 'input.slider-end').getBoundingClientRect();
      return r.width > r.height ? 'horizontal' : 'vertical';
    };
    expect(els[0].orientation).toBe('horizontal');
    expect(dims(els[0])).toBe('horizontal');
    expect(dims(els[1])).toBe('vertical');
    expect(dims(els[2])).toBe('vertical');
    expect(els[1].size).toBe('xs');
  });

  // spec: sliders-2fa3b9, sliders-d85388, sliders-6d4427, sliders-4f358b, sliders-2cbdd7, sliders-4cf36a, sliders-387dda, sliders-fb7c78
  it('comes in XS to XL track sizes with equal active and inactive tracks', async () => {
    const heights = {xs: 16, sm: 24, md: 40, lg: 56, xl: 96};
    const {els, q} = await setup(html`${Object.keys(heights).map(
      (s) => html`<md-gb-slider size=${s} value="50" aria-label=${s}></md-gb-slider>`,
    )}`);
    els.forEach((e, i) => {
      const expected = Object.values(heights)[i];
      expect(prop(q(e, '.slider'), '--track-height')).toBe(`${expected}px`);
      const active = q(e, '.slider-track-box.slider-active').getBoundingClientRect();
      const inactive = q(e, '.slider-track-box.slider-inactive')?.getBoundingClientRect();
      expect(Math.round(active.height)).toBe(expected);
      if (inactive) expect(Math.round(inactive.height)).toBe(expected);
    });
  });

  // spec: sliders-269ff5, sliders-bd0d09, sliders-0c4ca9, sliders-c747b9, sliders-c2f6cd, sliders-411726, sliders-50a0fb, sliders-a2f04c, sliders-021d28, sliders-9c552d
  it('takes its colors from the slider color roles', async () => {
    const {els, q} = await setup(html`<md-gb-slider ticks step="25" value="50" labeled aria-label="a"></md-gb-slider>`);
    const s = q(els[0], '.slider');
    expect(prop(s, '--active-track-color')).toBe('rgb(1, 1, 1)');
    expect(prop(s, '--handle-color')).toBe('rgb(1, 1, 1)');
    expect(prop(s, '--inactive-track-color')).toBe('rgb(3, 3, 3)');
    expect(prop(s, '--stop-indicator-color')).toBe('rgb(4, 4, 4)');
    expect(prop(s, '--stop-indicator-color-selected')).toBe('rgb(2, 2, 2)');
    expect(prop(s, '--value-indicator-color')).toBe('rgb(5, 5, 5)');
    expect(prop(s, '--value-indicator-label-text-color')).toBe('rgb(6, 6, 6)');
  });

  // spec: sliders-bbfb2f, sliders-166cdb, sliders-e4aa05
  it('ends the inactive track with a stop indicator', async () => {
    const {els, q} = await setup(html`<md-gb-slider value="50" aria-label="a"></md-gb-slider>`);
    const stop = q(els[0], '.slider-boundary-stop');
    expect(stop).not.toBeNull();
    const r = stop.getBoundingClientRect();
    expect(r.width).toBe(4);
    const input = q(els[0], 'input.slider-end').getBoundingClientRect();
    expect(r.right).toBeLessThanOrEqual(input.right);
    expect(r.right).toBeGreaterThan(input.right - 16);
  });

  // spec: sliders-2fe695, sliders-609e1c
  it('has the slider role and is read as its label', async () => {
    const {els, q} = await setup(html`<md-gb-slider value="50" aria-label="Volume"></md-gb-slider>`);
    const input = q(els[0], 'input.slider-end') as HTMLInputElement;
    expect(input.type).toBe('range');
    expect(input.getAttribute('aria-label')).toBe('Volume');
  });
});
