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

describe('<md-gb-progress> spec behavior', () => {
  const env = new Environment();

  async function setup(template: unknown, width = 200) {
    const root = env.render(
      html`<div style="width: ${width}px">${template}</div>`,
    );
    await env.waitForStability();
    const els = [...root.querySelectorAll<ProgressElement>('md-gb-progress')];
    const part = (e: ProgressElement) =>
      e.shadowRoot!.querySelector<HTMLElement>('[part="indicator"]')!;
    return {root, els, part};
  }

  const q = (e: ProgressElement, selector: string) =>
    e.shadowRoot!.querySelector<HTMLElement>(selector)!;

  // spec: progress-indicators-9cb885, progress-indicators-9ba559, progress-indicators-9e4da2
  it('has a 4dp track and active indicator by default and a variable thickness', async () => {
    const {els, part} = await setup(html`
      <md-gb-progress value="0.5" aria-label="a"></md-gb-progress>
      <md-gb-progress value="0.5" aria-label="b"></md-gb-progress>
      <md-gb-progress circular value="0.5" aria-label="c"></md-gb-progress>`);
    const [linear, thick, ring] = els;
    expect(getComputedStyle(q(linear, '.progress-track-1')).height).toBe('4px');
    expect(getComputedStyle(q(linear, '.progress-active-1')).strokeWidth).toBe(
      '4px',
    );
    expect(getComputedStyle(q(ring, '.progress-ring-track')).strokeWidth).toBe(
      '4px',
    );
    part(thick).style.setProperty('--track-thickness', '8px');
    part(thick).style.setProperty('--active-indicator-thickness', '8px');
    expect(getComputedStyle(q(thick, '.progress-track-1')).height).toBe('8px');
    expect(getComputedStyle(q(thick, '.progress-active-1')).strokeWidth).toBe(
      '8px',
    );
  });

  // spec: progress-indicators-cad9e5, progress-indicators-dd3961, progress-indicators-d113f9, progress-indicators-176100
  it('is flat by default and wavy when asked, linear and circular', async () => {
    const {els} = await setup(html`
      <md-gb-progress value="0.5" aria-label="a"></md-gb-progress>
      <md-gb-progress wavy value="0.5" aria-label="b"></md-gb-progress>
      <md-gb-progress circular value="0.5" aria-label="c"></md-gb-progress>
      <md-gb-progress circular wavy value="0.5" aria-label="d"></md-gb-progress>`);
    const d = (e: ProgressElement, selector: string) =>
      getComputedStyle(q(e, selector)).d;
    const [flat, wavy, ringFlat, ringWavy] = els;
    expect(d(flat, '.progress-active-1')).toContain('Q 10 0 20 0');
    expect(d(wavy, '.progress-active-1')).toContain('Q 10 6 20 0');
    expect(d(ringFlat, '.progress-ring .progress-active')).not.toBe(
      d(ringWavy, '.progress-ring .progress-active'),
    );
  });

  // spec: progress-indicators-3dbaa7
  it('fills determinate progress from 0% to 100%', async () => {
    const {els} = await setup(html`
      <md-gb-progress value="0" aria-label="a"></md-gb-progress>
      <md-gb-progress value="0.25" aria-label="b"></md-gb-progress>
      <md-gb-progress value="0.5" aria-label="c"></md-gb-progress>
      <md-gb-progress value="1" aria-label="d"></md-gb-progress>`);
    const lengths = els.map((e) =>
      parseFloat(getComputedStyle(q(e, '.progress-active-1')).strokeDasharray),
    );
    expect(lengths[0]).toBe(0);
    expect(lengths[1]).toBeLessThan(lengths[2]);
    expect(lengths[1]).toBeGreaterThan(lengths[0]);
    expect(lengths[2]).toBeLessThan(lengths[3]);
    // At 100% the active indicator spans the track (200px minus the 4px insets and the caps).
    expect(lengths[3]).toBeCloseTo(188, 0);
  });

  // spec: progress-indicators-559c77
  it('moves indeterminate indicators along a fixed track, growing and shrinking', async () => {
    const {els} = await setup(
      html`<md-gb-progress aria-label="a"></md-gb-progress>`,
    );
    const container = q(els[0], '.progress-container');
    const names = getComputedStyle(container).animationName;
    expect(names).toContain('md-progress-linear-head-1');
    expect(names).toContain('md-progress-linear-tail-1');
    const length = () =>
      parseFloat(getComputedStyle(q(els[0], '.progress-active-1')).strokeDasharray);
    const anim = container.getAnimations().find((a) =>
      (a as CSSAnimation).animationName === 'md-progress-linear-head-1');
    expect(anim).toBeDefined();
    const seen = new Set<number>();
    const duration = Number(anim!.effect!.getComputedTiming().duration);
    for (const f of [0.1, 0.3, 0.5, 0.7, 0.9]) {
      for (const a of container.getAnimations()) a.currentTime = duration * f;
      seen.add(Math.round(length()));
    }
    // The length changes over the cycle and stays within the 200px track.
    expect(seen.size).toBeGreaterThan(1);
    for (const v of seen) expect(v).toBeLessThanOrEqual(200);
  });

  // spec: progress-indicators-288e0a, progress-indicators-efda7f
  it('changes from indeterminate to determinate once a value is known', async () => {
    const {els, part} = await setup(
      html`<md-gb-progress aria-label="Loading screen"></md-gb-progress>`,
    );
    const el = els[0];
    expect(part(el).hasAttribute('aria-valuenow')).toBeFalse();
    expect(part(el).classList.contains('progress-determinate')).toBeFalse();
    el.value = 0.4;
    await el.updateComplete;
    expect(part(el).getAttribute('aria-valuenow')).toBe('40');
    expect(part(el).classList.contains('progress-determinate')).toBeTrue();
    expect(getComputedStyle(q(el, '.progress-container')).animationName).toBe(
      'md-progress-wave',
    );
  });

  // spec: progress-indicators-67f496, progress-indicators-8bfc95
  it('mirrors a linear indicator and flows right to left in RTL', async () => {
    const {root} = await setup(html`
      <md-gb-progress value="0.5" aria-label="a"></md-gb-progress>
      <div dir="rtl"><md-gb-progress value="0.5" aria-label="b"></md-gb-progress></div>`);
    const [ltr, rtl] = [
      ...root.querySelectorAll<ProgressElement>('md-gb-progress'),
    ].map((e) => getComputedStyle(q(e, '.progress-container')).rotate);
    expect(ltr).toBe('none');
    expect(rtl).toBe('180deg');
  });

  // spec: progress-indicators-495722, progress-indicators-f09d0e
  it('sizes circular indicators flexibly and scales the waveform with them', async () => {
    const {els, part} = await setup(html`
      <md-gb-progress circular wavy value="0.5" aria-label="a"></md-gb-progress>
      <md-gb-progress circular wavy value="0.5" aria-label="b"></md-gb-progress>`);
    part(els[1]).style.setProperty('--size', '96px');
    expect(getComputedStyle(part(els[0])).width).toBe('48px');
    expect(getComputedStyle(part(els[1])).width).toBe('96px');
    const ring = (e: ProgressElement) => q(e, '.progress-ring');
    expect(getComputedStyle(ring(els[1])).width).toBe('96px');
    // Same view box and path: the waveform keeps its proportions.
    expect(ring(els[0]).getAttribute('viewBox')).toBe(
      ring(els[1]).getAttribute('viewBox'),
    );
    const d = (e: ProgressElement) =>
      getComputedStyle(q(e, '.progress-ring .progress-active')).d;
    expect(d(els[0])).toBe(d(els[1]));
  });

  // spec: progress-indicators-7e2eba, progress-indicators-67a784
  it('spans the width of the element it is placed within', async () => {
    for (const width of [120, 240, 360]) {
      const {els, part} = await setup(
        html`<md-gb-progress value="0.5" aria-label="a"></md-gb-progress>`,
        width,
      );
      expect(part(els[0]).getBoundingClientRect().width)
        .withContext(`${width}px container`)
        .toBe(width);
    }
  });
});
