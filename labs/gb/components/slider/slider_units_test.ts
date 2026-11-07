/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-slider.js';
import '../../styles/icon/md-gb-icon.js';

import {sendKeys, sendMouse} from '@web/test-runner-commands';
import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {type SliderElement} from './slider-element.js';

adoptStyles(document, [m3Styles]);

describe('<md-gb-slider> spec units', () => {
  const env = new Environment();

  async function setup(template: unknown) {
    const root = env.render(html`<div style="width: 400px">${template}</div>`);
    await env.waitForStability();
    const els = [...root.querySelectorAll<SliderElement>('md-gb-slider')];
    const q = (e: SliderElement, sel: string) =>
      e.shadowRoot!.querySelector<HTMLElement>(sel)!;
    return {root, els, q};
  }

  const finish = (el: SliderElement) =>
    el.shadowRoot!
      .querySelector('.slider')!
      .getAnimations({subtree: true})
      .forEach((a) => a.finish());

  afterEach(async () => {
    await sendMouse({type: 'up'}).catch(() => {});
    await sendMouse({type: 'move', position: [0, 0]});
  });

  // spec: sliders-47267f, sliders-f2a64a
  it('shows the value on only one handle of a range slider at a time', async () => {
    const {els, q} = await setup(html`
      <md-gb-slider
        range
        labeled
        value-start="20"
        value-end="70"
        label-start="Start"
        label-end="End"></md-gb-slider>`);
    const labels = [
      q(els[0], '.slider-handle.slider-start .slider-label'),
      q(els[0], '.slider-handle.slider-end .slider-label'),
    ];
    const opacities = () =>
      labels.map((label) => getComputedStyle(label).opacity);
    finish(els[0]);
    expect(opacities()).toEqual(['0', '0']);
    for (const [index, nubSelector] of [
      '.slider-handle.slider-start .slider-handle-nub',
      '.slider-handle.slider-end .slider-handle-nub',
    ].entries()) {
      const r = q(els[0], nubSelector).getBoundingClientRect();
      await sendMouse({
        type: 'move',
        position: [
          Math.round(r.left + r.width / 2),
          Math.round(r.top + r.height / 2),
        ],
      });
      finish(els[0]);
      const shown = opacities().map((o) => o === '1');
      expect(shown.filter(Boolean).length).withContext(`handle ${index}`).toBe(1);
      expect(shown[index]).toBeTrue();
    }
  });

  // spec: sliders-9cdc0c, sliders-b6f37d
  it('moves the inset icon to the inactive track when the active track is too short', async () => {
    const {els, q} = await setup(html`
      <md-gb-slider size="lg" value="50" aria-label="a">
        <md-gb-icon slot="icon">volume_up</md-gb-icon>
      </md-gb-slider>
      <md-gb-slider size="lg" value="0" aria-label="b">
        <md-gb-icon slot="icon">volume_up</md-gb-icon>
      </md-gb-slider>`);
    const [mid, low] = els;
    const iconOf = (e: SliderElement) => q(e, '.slider-icon');
    const handleOf = (e: SliderElement) =>
      q(e, '.slider-handle.slider-end .slider-handle-nub');
    finish(mid);
    finish(low);
    // At 50% the icon sits before the handle (on the active track)...
    expect(iconOf(mid).getBoundingClientRect().right).toBeLessThanOrEqual(
      handleOf(mid).getBoundingClientRect().left + 0.5,
    );
    expect(iconOf(mid).classList).toContain('slider-over-active');
    // ...at zero it moves past the handle onto the inactive track.
    expect(iconOf(low).getBoundingClientRect().left).toBeGreaterThanOrEqual(
      handleOf(low).getBoundingClientRect().right - 0.5,
    );
    expect(iconOf(low).classList).not.toContain('slider-over-active');
  });

  // spec: sliders-9729e3
  it('gives assistive technology the value and its text as the value changes', async () => {
    const {els, q} = await setup(html`
      <md-gb-slider
        value="50"
        aria-label="Volume"
        aria-valuetext="Half"></md-gb-slider>`);
    const input = q(els[0], 'input');
    expect(input.getAttribute('type')).toBe('range');
    expect(input.getAttribute('aria-label')).toBe('Volume');
    expect(input.getAttribute('aria-valuetext')).toBe('Half');
    input.focus();
    await sendKeys({press: 'ArrowRight'});
    expect((input as HTMLInputElement).valueAsNumber).toBe(51);
  });
});
