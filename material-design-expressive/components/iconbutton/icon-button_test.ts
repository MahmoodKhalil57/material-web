/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import '../../styles/icons/md-gb-icon.js';
import './md-gb-icon-button.js';

import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {ICON_BUTTON_CLASSES, iconButtonClasses} from './icon-button.js';
import {type IconButtonElement} from './icon-button-element.js';

adoptStyles(document, [m3Styles]);

describe('<md-gb-icon-button> density', () => {
  const env = new Environment();

  async function setupTest(size = 'sm') {
    const root = env.render(
      html`<md-gb-icon-button aria-label="Favorite" size=${size}>
        <md-gb-icon>favorite</md-gb-icon>
      </md-gb-icon-button>`,
    );
    await env.waitForStability();
    const button = root.querySelector('md-gb-icon-button') as IconButtonElement;
    const inner = button.shadowRoot!.querySelector<HTMLElement>('.icon-btn')!;
    return {button, inner};
  }

  // spec: icon-buttons-d8f6de
  it('defaults to density 0', async () => {
    const {button} = await setupTest();
    expect(button.density).toBe(0);
  });

  // icon-buttons.md, Measurements: container heights per size.
  for (const [size, height] of [
    ['xs', 32],
    ['sm', 40],
    ['md', 56],
    ['lg', 96],
    ['xl', 136],
  ] as const) {
    it(`removes 4px from the ${size} container per step`, async () => {
      const {button, inner} = await setupTest(size);
      for (const density of [0, -1, -2, -3]) {
        button.density = density;
        await env.waitForStability();
        const rect = inner.getBoundingClientRect();
        // An extra-small button at -3 (20px) is kept 2px larger than its
        // 20px icon and 1px outline.
        const expected = Math.max(22, height + 4 * density);
        expect(rect.height)
          .withContext(`${size} density ${density} height`)
          .toBe(expected);
        expect(rect.width)
          .withContext(`${size} density ${density} width`)
          .toBe(expected);
      }
    });
  }

  it('keeps the icon size', async () => {
    const {button} = await setupTest();
    button.density = -3;
    await env.waitForStability();
    const icon = button.querySelector('md-gb-icon')!;
    expect(icon.getBoundingClientRect().height).toBe(24);
  });

  it('keeps a 48px touch target at every density', async () => {
    const {button, inner} = await setupTest('xs');
    button.density = -3;
    await env.waitForStability();
    const target = getComputedStyle(inner, '::before');
    expect(target.width).toBe('48px');
    expect(target.height).toBe('48px');
  });

  it('inherits the density of an enclosing component', async () => {
    const root = env.render(
      html`<div style="--_density: -2">
        <md-gb-icon-button aria-label="Favorite">
          <md-gb-icon>favorite</md-gb-icon>
        </md-gb-icon-button>
      </div>`,
    );
    await env.waitForStability();
    const button = root.querySelector('md-gb-icon-button')!;
    const inner = button.shadowRoot!.querySelector('.icon-btn')!;
    expect(inner.getBoundingClientRect().height).toBe(32);
    // Its own density wins.
    button.density = -1;
    await env.waitForStability();
    expect(inner.getBoundingClientRect().height).toBe(36);
  });

  it('clamps density to 0..-3 and reflects it', async () => {
    const {button} = await setupTest();
    button.density = -7;
    await env.waitForStability();
    expect(button.density).toBe(-3);
    expect(button.getAttribute('density')).toBe('-3');
    button.density = 2;
    expect(button.density).toBe(0);
  });
});

describe('iconButtonClasses() density', () => {
  it('adds one class per density step', () => {
    expect(iconButtonClasses({density: -1})).toEqual(
      jasmine.objectContaining({
        [ICON_BUTTON_CLASSES.density1]: true,
        [ICON_BUTTON_CLASSES.density2]: false,
        [ICON_BUTTON_CLASSES.density3]: false,
      }),
    );
  });
});
