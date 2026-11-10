/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-chip.js';
import './md-gb-chip-set.js';

import {html, type TemplateResult} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {CHIP_CLASSES, CHIP_SET_CLASSES, chipClasses} from './chip.js';
import {type ChipElement} from './chip-element.js';
import {type ChipSetElement} from './chip-set-element.js';
import {styles as chipSetStyles} from './chip-set.cssresult.js';

// The Light DOM `.chip-set` classes.
adoptStyles(document, [m3Styles, chipSetStyles]);

describe('<md-gb-chip> density', () => {
  const env = new Environment();

  async function setup(template: TemplateResult) {
    const root = env.render(template);
    await env.waitForStability();
    const chip = root.querySelector('md-gb-chip') as ChipElement;
    await chip.updateComplete;
    const container = chip.shadowRoot!.querySelector<HTMLElement>('.chip')!;
    return {root, chip, container};
  }

  it('defaults to density 0', async () => {
    const {chip} = await setup(html`<md-gb-chip>Assist</md-gb-chip>`);
    expect(chip.density).toBe(0);
  });

  for (const type of ['assist', 'filter', 'input', 'suggestion']) {
    it(`removes 4px from the ${type} chip height per step`, async () => {
      const {chip, container} = await setup(
        html`<md-gb-chip type=${type}>Chip</md-gb-chip>`,
      );
      for (const [density, height] of [
        [0, 32],
        [-1, 28],
        [-2, 24],
        [-3, 20],
      ]) {
        chip.density = density;
        await env.waitForStability();
        expect(container.getBoundingClientRect().height)
          .withContext(`${type} density ${density}`)
          .toBe(height);
      }
    });
  }

  it('keeps 48px touch targets at every density (chips.md)', async () => {
    const {chip, container} = await setup(
      html`<md-gb-chip type="input" removable>Input</md-gb-chip>`,
    );
    chip.density = -3;
    await env.waitForStability();
    const action = container.querySelector('.chip-action')!;
    const remove = container.querySelector('.chip-remove')!;
    expect(getComputedStyle(action, '::before').height).toBe('48px');
    expect(getComputedStyle(remove, '::before').height).toBe('48px');
    expect(getComputedStyle(remove, '::before').width).toBe('48px');
    const plain = await setup(
      html`<md-gb-chip density="-2">Assist</md-gb-chip>`,
    );
    expect(getComputedStyle(plain.container, '::before').height).toBe('48px');
  });

  it('keeps the label size', async () => {
    const {chip, container} = await setup(
      html`<md-gb-chip>Assist</md-gb-chip>`,
    );
    const font = getComputedStyle(container).fontSize;
    chip.density = -3;
    await env.waitForStability();
    expect(getComputedStyle(container).fontSize).toBe(font);
  });

  it('shrinks the avatar to fit dense containers', async () => {
    const {chip} = await setup(
      html`<md-gb-chip type="input">
        <img slot="icon" alt="" />
        Ana
      </md-gb-chip>`,
    );
    const avatar = chip.querySelector('img')!;
    expect(avatar.getBoundingClientRect().height).toBe(24);
    chip.density = -3;
    await env.waitForStability();
    expect(avatar.getBoundingClientRect().height).toBe(16);
  });

  it('clamps density to 0..-3 and reflects it', async () => {
    const {chip} = await setup(html`<md-gb-chip>Assist</md-gb-chip>`);
    chip.density = -7;
    await env.waitForStability();
    expect(chip.density).toBe(-3);
    expect(chip.getAttribute('density')).toBe('-3');
    chip.density = 2;
    expect(chip.density).toBe(0);
  });
});

describe('<md-gb-chip-set> density', () => {
  const env = new Environment();

  it('applies its density to the chips inside', async () => {
    const root = env.render(
      html`<md-gb-chip-set aria-label="Filters" density="-2">
        <md-gb-chip type="filter">One</md-gb-chip>
        <md-gb-chip type="filter" density="-1">Two</md-gb-chip>
      </md-gb-chip-set>`,
    );
    await env.waitForStability();
    const set = root.querySelector('md-gb-chip-set') as ChipSetElement;
    expect(set.density).toBe(-2);
    const [one, two] = set.chips;
    await one.updateComplete;
    await two.updateComplete;
    const height = (chip: ChipElement) =>
      chip.shadowRoot!.querySelector('.chip')!.getBoundingClientRect().height;
    expect(height(one)).toBe(24);
    // A chip's own density wins.
    expect(height(two)).toBe(28);
    set.density = 0;
    await env.waitForStability();
    expect(height(one)).toBe(32);
  });

  it('keeps room for the targets of a single-line set', async () => {
    const root = env.render(
      html`<md-gb-chip-set aria-label="Filters" single-line density="-3">
        <md-gb-chip type="filter">One</md-gb-chip>
      </md-gb-chip-set>`,
    );
    await env.waitForStability();
    const set = root.querySelector('md-gb-chip-set')!;
    // (48px - 20px) / 2
    expect(getComputedStyle(set).paddingTop).toBe('14px');
  });

  it('supports the Light DOM density classes', async () => {
    const root = env.render(
      html`<div
        class="${CHIP_SET_CLASSES.chipSet} ${CHIP_SET_CLASSES.density3}">
        <md-gb-chip>One</md-gb-chip>
      </div>`,
    );
    await env.waitForStability();
    const chip = root.querySelector('md-gb-chip')!;
    await chip.updateComplete;
    expect(
      chip.shadowRoot!.querySelector('.chip')!.getBoundingClientRect().height,
    ).toBe(20);
  });
});

describe('chipClasses() density', () => {
  it('adds one class per density step', () => {
    expect(chipClasses({density: -2})).toEqual(
      jasmine.objectContaining({
        [CHIP_CLASSES.density1]: false,
        [CHIP_CLASSES.density2]: true,
        [CHIP_CLASSES.density3]: false,
      }),
    );
  });
});
