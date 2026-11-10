/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-switch.js';

import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {SWITCH_CLASSES, switchClasses} from './switch.js';
import {type SwitchElement} from './switch-element.js';

adoptStyles(document, [m3Styles]);

describe('<md-gb-switch> density', () => {
  const env = new Environment();

  async function setupTest() {
    const root = env.render(html`<md-gb-switch></md-gb-switch>`);
    await env.waitForStability();
    const toggle = root.querySelector('md-gb-switch') as SwitchElement;
    const button = toggle.shadowRoot!.querySelector('button')!;
    const touch = toggle.shadowRoot!.querySelector('.switch-touch')!;
    return {toggle, button, touch};
  }

  // spec: switch-81e20c, switch-81e20c
  it('defaults to density 0', async () => {
    const {toggle} = await setupTest();
    expect(toggle.density).toBe(0);
  });

  it('removes 4px from the state layer per step', async () => {
    const {toggle, button} = await setupTest();
    for (const [density, stateLayer] of [
      [0, 40],
      [-1, 36],
      [-2, 32],
      [-3, 28],
    ]) {
      toggle.density = density;
      await env.waitForStability();
      expect(getComputedStyle(button, '::after').width)
        .withContext(`density ${density} state layer`)
        .toBe(`${stateLayer}px`);
    }
  });

  it('keeps the track size and a 48px touch target', async () => {
    const {toggle, button, touch} = await setupTest();
    toggle.density = -3;
    await env.waitForStability();
    const track = button.getBoundingClientRect();
    expect(track.width).toBe(52);
    expect(track.height).toBe(32);
    expect(touch.getBoundingClientRect().height).toBe(48);
  });

  // spec: switch-c900e6, switch-c900e6
  it('clamps density to 0..-3 and reflects it', async () => {
    const {toggle} = await setupTest();
    toggle.density = -7;
    await env.waitForStability();
    expect(toggle.density).toBe(-3);
    expect(toggle.getAttribute('density')).toBe('-3');
    toggle.density = 2;
    expect(toggle.density).toBe(0);
  });
});

describe('switchClasses() density', () => {
  it('adds one class per density step', () => {
    expect(switchClasses({density: -3})).toEqual(
      jasmine.objectContaining({
        [SWITCH_CLASSES.density1]: false,
        [SWITCH_CLASSES.density2]: false,
        [SWITCH_CLASSES.density3]: true,
      }),
    );
  });
});
