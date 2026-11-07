/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-radio.js';

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {RADIO_CLASSES, radioClasses} from './radio.js';
import {type RadioElement} from './radio-element.js';

adoptStyles(document, [m3Styles]);

describe('<md-gb-radio> density', () => {
  const env = new Environment();

  async function setupTest() {
    const root = env.render(html`<md-gb-radio></md-gb-radio>`);
    await env.waitForStability();
    const radio = root.querySelector('md-gb-radio') as RadioElement;
    const inner = radio.shadowRoot!.querySelector<HTMLElement>('.radio')!;
    return {radio, inner};
  }

  it('defaults to density 0', async () => {
    const {radio} = await setupTest();
    expect(radio.density).toBe(0);
  });

  // spec: radio-button-ecfc98
  it('removes 4px from the box and state layer per step', async () => {
    const {radio, inner} = await setupTest();
    for (const [density, box, stateLayer] of [
      [0, 48, 40],
      [-1, 44, 36],
      [-2, 40, 32],
      [-3, 36, 28],
    ]) {
      radio.density = density;
      await env.waitForStability();
      const rect = radio.getBoundingClientRect();
      expect(rect.width).withContext(`density ${density} width`).toBe(box);
      expect(rect.height).withContext(`density ${density} height`).toBe(box);
      expect(getComputedStyle(inner, '::after').width)
        .withContext(`density ${density} state layer`)
        .toBe(`${stateLayer}px`);
    }
  });

  // spec: radio-button-bc3bad
  it('keeps a 48px touch target at every density', async () => {
    const {radio, inner} = await setupTest();
    radio.density = -3;
    await env.waitForStability();
    const host = radio.getBoundingClientRect();
    const target = inner.getBoundingClientRect();
    expect(target.width).toBe(48);
    expect(target.height).toBe(48);
    // Centered on the smaller box.
    expect(target.left + target.width / 2).toBe(host.left + host.width / 2);
    expect(target.top + target.height / 2).toBe(host.top + host.height / 2);
  });

  it('lowers the target when --target-size is lowered', async () => {
    const {radio, inner} = await setupTest();
    inner.style.setProperty('--target-size', '0px');
    radio.density = -2;
    await env.waitForStability();
    expect(inner.getBoundingClientRect().width).toBe(32);
    expect(radio.getBoundingClientRect().width).toBe(32);
  });

  it('clamps density to 0..-3 and reflects it', async () => {
    const {radio} = await setupTest();
    radio.density = -7;
    await env.waitForStability();
    expect(radio.density).toBe(-3);
    expect(radio.getAttribute('density')).toBe('-3');
    radio.density = 2;
    expect(radio.density).toBe(0);
  });

  it('reads the density attribute', async () => {
    const root = env.render(html`<md-gb-radio density="-2"></md-gb-radio>`);
    await env.waitForStability();
    const radio = root.querySelector('md-gb-radio') as RadioElement;
    expect(radio.density).toBe(-2);
    expect(radio.getBoundingClientRect().width).toBe(40);
  });
});

describe('radioClasses() density', () => {
  it('adds one class per density step', () => {
    expect(radioClasses({density: -2})).toEqual(
      jasmine.objectContaining({
        [RADIO_CLASSES.density1]: false,
        [RADIO_CLASSES.density2]: true,
        [RADIO_CLASSES.density3]: false,
      }),
    );
    expect(radioClasses()[RADIO_CLASSES.density1]).toBeFalse();
  });
});
