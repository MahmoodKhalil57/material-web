/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-progress.js';

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {type ProgressElement} from './progress-element.js';

adoptStyles(document, [m3Styles]);

function rgbOf(color: string) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  const context = canvas.getContext('2d', {willReadFrequently: true})!;
  context.fillStyle = '#000';
  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);
  return [...context.getImageData(0, 0, 1, 1).data].slice(0, 3);
}

function contrast(a: string, b: string) {
  const lum = (rgb: number[]) => {
    const [r, g, bl] = rgb.map((v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(rgbOf(a)), lum(rgbOf(b))].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function resolved(token: string) {
  const probe = document.createElement('div');
  probe.style.color = `var(${token})`;
  document.body.append(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return color;
}

describe('<md-gb-progress> spec units', () => {
  const env = new Environment();

  async function setup(template: unknown) {
    const root = env.render(html`<div style="width: 300px">${template}</div>`);
    await env.waitForStability();
    const els = [...root.querySelectorAll<ProgressElement>('md-gb-progress')];
    const part = (e: ProgressElement) =>
      e.shadowRoot!.querySelector<HTMLElement>('[part="indicator"]')!;
    return {root, els, part};
  }

  // spec: progress-indicators-eb8192
  it('measures the wave amplitude from the resting center line to the center of the peak', async () => {
    const {els, part} = await setup(
      html`<md-gb-progress wavy value="0.5" aria-label="a"></md-gb-progress>`,
    );
    const height = part(els[0]).getBoundingClientRect().height;
    const thickness = parseFloat(
      getComputedStyle(part(els[0])).getPropertyValue(
        '--active-indicator-thickness',
      ),
    );
    const d = getComputedStyle(
      els[0].shadowRoot!.querySelector('.progress-active-1')!,
    ).d;
    // A quadratic segment `Q cx cy x y` peaks half way to its control point.
    const control = Number(/Q\s+[\d.-]+\s+([\d.-]+)\s/.exec(d)![1]);
    const amplitude = control / 2;
    // The wave's outer edge (center of the peak plus half the stroke) fills
    // the container height with the resting line on its center.
    expect(amplitude + thickness / 2).toBeCloseTo(height / 2, 5);
  });

  // spec: progress-indicators-c888f2
  it('measures the wavelength between two adjacent peaks as 40dp', async () => {
    const {els} = await setup(
      html`<md-gb-progress wavy value="0.5" aria-label="a"></md-gb-progress>`,
    );
    const d = getComputedStyle(
      els[0].shadowRoot!.querySelector('.progress-active-1')!,
    ).d;
    // The wave is built from half waves: `Q cx cy x 0` then reflected `T x 0`
    // segments, which alternate up and down. Two of them make a wavelength.
    const half = Number(/Q\s+[\d.-]+\s+[\d.-]+\s+([\d.-]+)\s+0/.exec(d)![1]);
    expect(half * 2).toBe(40);
    expect(/T\s+40\s+0/.test(d)).toBeTrue();
  });

  // spec: progress-indicators-c675af, progress-indicators-70e45c
  it('sizes a circular indicator from 24dp to 240dp and never beyond', async () => {
    const {els, part} = await setup(html`
      ${[0, 1, 2, 3, 4].map(
        () => html`<md-gb-progress
          circular
          value="0.5"
          aria-label="a"></md-gb-progress>`,
      )}
    `);
    // Tokens are set on the indicator part, as the other progress tests do.
    els.forEach((e, i) =>
      part(e).style.setProperty('--size', ['8px', '24px', '100px', '240px', '600px'][i]),
    );
    const sizes = els.map((e) => part(e).getBoundingClientRect().width);
    expect(sizes).toEqual([24, 24, 100, 240, 240]);
    expect(els.map((e) => part(e).getBoundingClientRect().height)).toEqual(
      sizes,
    );
  });

  // spec: progress-indicators-604b64, progress-indicators-b8be1b
  it('insets a linear indicator 4dp at each end at minimum, and lets that grow', async () => {
    const {els, part} = await setup(html`
      <md-gb-progress value="0.5" aria-label="a"></md-gb-progress>
      <md-gb-progress
        value="0.5"
        style="--inset-inline: 16px"
        aria-label="b"></md-gb-progress>
      <md-gb-progress
        value="0.5"
        style="--inset-inline: 0px"
        aria-label="c"></md-gb-progress>
    `);
    const inset = (e: ProgressElement) => {
      const container = part(e).querySelector('.progress-container')!;
      const host = part(e).getBoundingClientRect();
      const box = container.getBoundingClientRect();
      return [box.left - host.left, host.right - box.right];
    };
    expect(inset(els[0])).toEqual([4, 4]);
    expect(inset(els[1])).toEqual([16, 16]);
    expect(inset(els[2])).toEqual([4, 4]);
  });

  // spec: progress-indicators-f90ba6, progress-indicators-02c2c8, progress-indicators-6933e8
  it('keeps the active and stop indicators at 3:1 contrast or more with the surface', async () => {
    const {els} = await setup(html`
      <md-gb-progress value="0.5" aria-label="a"></md-gb-progress>
      <md-gb-progress circular value="0.5" aria-label="b"></md-gb-progress>
    `);
    const surface = resolved('--md-sys-color-surface');
    const linear = els[0].shadowRoot!;
    const active = getComputedStyle(
      linear.querySelector('.progress-active-1')!,
    ).stroke;
    const stop = getComputedStyle(
      linear.querySelector('.progress-stop')!,
    ).backgroundColor;
    expect(contrast(active, surface)).toBeGreaterThanOrEqual(3);
    expect(contrast(stop, surface)).toBeGreaterThanOrEqual(3);
    const circular = getComputedStyle(
      els[1].shadowRoot!.querySelector('.progress-active-1')!,
    ).stroke;
    expect(contrast(circular, surface)).toBeGreaterThanOrEqual(3);
  });

  // spec: progress-indicators-db7ec2, progress-indicators-4d282d, progress-indicators-49a827, progress-indicators-aee92b
  it('takes the label color and drops the track when placed in a button', async () => {
    const root = env.render(html`
      <div style="width: 300px">
        <button
          style="color: rgb(10, 20, 30); background: rgb(250, 250, 250)">
          <md-gb-progress
            circular
            aria-label="Loading"></md-gb-progress>
          Saving
        </button>
      </div>
    `);
    await env.waitForStability();
    const shadow = root.querySelector('md-gb-progress')!.shadowRoot!;
    const indicator = shadow.querySelector<HTMLElement>('[part="indicator"]')!;
    indicator.style.setProperty('--active-indicator-color', 'currentColor');
    indicator.style.setProperty('--track-color', 'transparent');
    const active = getComputedStyle(shadow.querySelector('.progress-active-1')!);
    expect(active.stroke).toBe('rgb(10, 20, 30)');
    const track = getComputedStyle(shadow.querySelector('.progress-track-1')!);
    expect(track.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    // The label color contrasts with the button, so the indicator does too.
    expect(contrast(active.stroke, 'rgb(250, 250, 250)')).toBeGreaterThanOrEqual(3);
  });
});
