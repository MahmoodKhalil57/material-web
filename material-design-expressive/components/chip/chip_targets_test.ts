/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-chip.js';
import './md-gb-chip-set.js';

import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {type ChipElement} from './chip-element.js';

adoptStyles(document, [m3Styles]);

describe('<md-gb-chip> targets and overflow', () => {
  const env = new Environment();

  async function setup(template: unknown) {
    const root = env.render(html`<div style="padding: 32px">${template}</div>`);
    await env.waitForStability();
    const chips = root.querySelectorAll<ChipElement>('md-gb-chip');
    const chip = chips[chips.length - 1];
    await chip.updateComplete;
    return chip;
  }

  // The 48x48dp interaction area of an element: its box grown to 48dp.
  function target(el: Element) {
    const r = el.getBoundingClientRect();
    const w = Math.max(r.width, 48);
    const h = Math.max(r.height, 48);
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    return {left: cx - w / 2, right: cx + w / 2, top: cy - h / 2, bottom: cy + h / 2};
  }

  // spec: chips-8f026d, chips-23eef2
  it('has a trailing remove icon on input chips (required) and on removable filter chips (optional)', async () => {
    const input = await setup(html`<md-gb-chip type="input" removable>Ada</md-gb-chip>`);
    expect(input.shadowRoot!.querySelector('.chip-remove')).not.toBeNull();
    const filter = await setup(html`<md-gb-chip type="filter" removable>Ada</md-gb-chip>`);
    expect(filter.shadowRoot!.querySelector('.chip-remove')).not.toBeNull();
    const plain = await setup(html`<md-gb-chip type="filter">Ada</md-gb-chip>`);
    expect(plain.shadowRoot!.querySelector('.chip-remove')).toBeNull();
  });

  // spec: chips-4da408, chips-f1648c, chips-41a536, chips-fb7890, chips-539701
  it('gives the primary action and the remove action their own 48x48dp targets, at a 88dp minimum width', async () => {
    const chip = await setup(html`<md-gb-chip type="input" removable>A</md-gb-chip>`);
    expect(chip.getBoundingClientRect().width).toBeGreaterThanOrEqual(88);
    const primary = chip.shadowRoot!.querySelector('.chip-action')!;
    const remove = chip.shadowRoot!.querySelector('.chip-remove')!;
    const a = target(primary);
    const b = target(remove);
    const rb = remove.getBoundingClientRect();
    expect(Math.max(rb.width, 48)).toBeGreaterThanOrEqual(48);
    expect(Math.max(rb.height, 48)).toBeGreaterThanOrEqual(48);
    // The remove target does not interfere with the primary action: the two
    // 48dp targets do not overlap horizontally.
    const pr = primary.getBoundingClientRect();
    const labelEnd = pr.left + (pr.width - 48);
    expect(b.left).toBeGreaterThanOrEqual(Math.min(labelEnd, a.right) - 1);
  });

  // spec: chips-cbf669
  it('truncates a label that is wider than its container', async () => {
    const chip = await setup(html`<div style="inline-size: 120px">
      <md-gb-chip>A very long chip label that cannot fit</md-gb-chip>
    </div>`);
    expect(chip.getBoundingClientRect().width).toBeLessThanOrEqual(121);
    const label = chip.shadowRoot!.querySelector<HTMLElement>('.chip-label')!;
    expect(label).not.toBeNull();
    expect(getComputedStyle(label).textOverflow).toBe('ellipsis');
  });
});
