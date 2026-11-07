/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-loading-indicator.js';

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {type LoadingIndicatorElement} from './loading-indicator-element.js';

adoptStyles(document, [m3Styles]);

function luminance(rgb: number[]) {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function rgbOf(color: string) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  const context = canvas.getContext('2d', {willReadFrequently: true})!;
  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);
  return [...context.getImageData(0, 0, 1, 1).data].slice(0, 3);
}

describe('<md-gb-loading-indicator> spec units', () => {
  const env = new Environment();

  async function setup(template: unknown) {
    const root = env.render(html`<div>${template}</div>`);
    await env.waitForStability();
    const els = [
      ...root.querySelectorAll<LoadingIndicatorElement>(
        'md-gb-loading-indicator',
      ),
    ];
    const part = (e: LoadingIndicatorElement) =>
      e.shadowRoot!.querySelector<HTMLElement>('[part="indicator"]')!;
    const active = (e: LoadingIndicatorElement) =>
      e.shadowRoot!.querySelector<HTMLElement>('.loading-indicator-spin')!;
    return {root, els, part, active};
  }

  // spec: loading-indicator-71db36, loading-indicator-d76e3d, loading-indicator-31e8e1, loading-indicator-5d67d9
  it('ranges in size from 24dp to 240dp and never exceeds that', async () => {
    const {els, part} = await setup(html`
      ${['8px', '24px', '100px', '240px', '600px'].map(
        (size) => html`<md-gb-loading-indicator
          style="--size: ${size}"
          aria-label="Loading"></md-gb-loading-indicator>`,
      )}
    `);
    const widths = els.map((e) => part(e).getBoundingClientRect().width);
    const heights = els.map((e) => part(e).getBoundingClientRect().height);
    expect(widths).toEqual([24, 24, 100, 240, 240]);
    expect(heights).toEqual(widths);
  });

  it('is 48dp by default', async () => {
    const {els, part} = await setup(
      html`<md-gb-loading-indicator aria-label="Loading"></md-gb-loading-indicator>`,
    );
    expect(part(els[0]).getBoundingClientRect().width).toBe(48);
  });

  // spec: loading-indicator-bfe889
  it('keeps the ratio between the container and the active indicator when resized', async () => {
    const {els, part, active} = await setup(html`
      ${['24px', '48px', '96px', '240px'].map(
        (size) => html`<md-gb-loading-indicator
          contained
          style="--size: ${size}"
          aria-label="Loading"></md-gb-loading-indicator>`,
      )}
    `);
    const ratios = els.map(
      (e) =>
        active(e).getBoundingClientRect().width /
        part(e).getBoundingClientRect().width,
    );
    for (const ratio of ratios) expect(ratio).toBeCloseTo(38 / 48, 3);
    // The container stays round at every size.
    for (const e of els) {
      const radius = parseFloat(getComputedStyle(part(e)).borderTopLeftRadius);
      expect(radius).toBeCloseTo(part(e).getBoundingClientRect().width / 2, 1);
    }
  });

  // spec: loading-indicator-a2aa16
  it('keeps the active indicator at 3:1 contrast or more with its container and the surface', async () => {
    const {els, part} = await setup(html`
      <md-gb-loading-indicator contained aria-label="a"></md-gb-loading-indicator>
      <md-gb-loading-indicator aria-label="b"></md-gb-loading-indicator>
    `);
    const probe = document.createElement('div');
    probe.style.color = 'var(--md-sys-color-surface)';
    document.body.append(probe);
    const surface = rgbOf(getComputedStyle(probe).color);
    probe.remove();
    expect(surface).not.toEqual([0, 0, 0]);
    const lums = (a: number[], b: number[]) => {
      const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
      return (hi + 0.05) / (lo + 0.05);
    };
    const contained = getComputedStyle(part(els[0]));
    expect(
      lums(rgbOf(contained.color), rgbOf(contained.backgroundColor)),
    ).toBeGreaterThanOrEqual(3);
    expect(
      lums(rgbOf(getComputedStyle(part(els[1])).color), surface),
    ).toBeGreaterThanOrEqual(3);
  });
});
