/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-checkbox.js';

import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {CHECKBOX_CLASSES, checkboxClasses} from './checkbox.js';
import {type CheckboxElement} from './checkbox-element.js';

adoptStyles(document, [m3Styles]);

describe('<md-gb-checkbox> density', () => {
  const env = new Environment();

  async function setupTest() {
    const root = env.render(html`<md-gb-checkbox></md-gb-checkbox>`);
    await env.waitForStability();
    const checkbox = root.querySelector('md-gb-checkbox') as CheckboxElement;
    const input = checkbox.shadowRoot!.querySelector('input')!;
    return {checkbox, input};
  }

  // spec: checkbox-d70081
  it('defaults to density 0', async () => {
    const {checkbox} = await setupTest();
    expect(checkbox.density).toBe(0);
  });

  it('removes 4px from the box and state layer per step', async () => {
    const {checkbox, input} = await setupTest();
    for (const [density, box, stateLayer] of [
      [0, 48, 40],
      [-1, 44, 36],
      [-2, 40, 32],
      [-3, 36, 28],
    ]) {
      checkbox.density = density;
      await env.waitForStability();
      const rect = checkbox.getBoundingClientRect();
      expect(rect.width).withContext(`density ${density} width`).toBe(box);
      expect(rect.height).withContext(`density ${density} height`).toBe(box);
      expect(getComputedStyle(input, '::after').width)
        .withContext(`density ${density} state layer`)
        .toBe(`${stateLayer}px`);
    }
  });

  it('keeps a 48px touch target at every density', async () => {
    const {checkbox, input} = await setupTest();
    checkbox.density = -3;
    await env.waitForStability();
    const host = checkbox.getBoundingClientRect();
    const target = input.getBoundingClientRect();
    expect(target.width).toBe(48);
    expect(target.height).toBe(48);
    // Centered on the smaller box.
    expect(target.left + target.width / 2).toBe(host.left + host.width / 2);
    expect(target.top + target.height / 2).toBe(host.top + host.height / 2);
  });

  it('lowers the target when --target-size is lowered', async () => {
    const {checkbox, input} = await setupTest();
    input.style.setProperty('--target-size', '0px');
    checkbox.density = -2;
    await env.waitForStability();
    expect(input.getBoundingClientRect().width).toBe(32);
    expect(checkbox.getBoundingClientRect().width).toBe(32);
  });

  // spec: checkbox-9233c9
  it('clamps density to 0..-3 and reflects it', async () => {
    const {checkbox} = await setupTest();
    checkbox.density = -7;
    await env.waitForStability();
    expect(checkbox.density).toBe(-3);
    expect(checkbox.getAttribute('density')).toBe('-3');
    checkbox.density = 2;
    expect(checkbox.density).toBe(0);
  });

  it('reads the density attribute', async () => {
    const root = env.render(
      html`<md-gb-checkbox density="-2"></md-gb-checkbox>`,
    );
    await env.waitForStability();
    const checkbox = root.querySelector('md-gb-checkbox') as CheckboxElement;
    expect(checkbox.density).toBe(-2);
    expect(checkbox.getBoundingClientRect().width).toBe(40);
  });
});

describe('checkboxClasses() density', () => {
  it('adds one class per density step', () => {
    expect(checkboxClasses({density: -2})).toEqual(
      jasmine.objectContaining({
        [CHECKBOX_CLASSES.density1]: false,
        [CHECKBOX_CLASSES.density2]: true,
        [CHECKBOX_CLASSES.density3]: false,
      }),
    );
    expect(checkboxClasses()[CHECKBOX_CLASSES.density1]).toBeFalse();
  });
});
