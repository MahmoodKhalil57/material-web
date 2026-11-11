/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

// The select dropdown without CSS anchor positioning, forced in a browser that
// has it: the overlay controller places the dropdown and sizes it to the field
// (select.scss, select-base.ts, shared/anchored-overlay.ts).

import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {forceAnchorPositioningSupport} from '../../components/shared/anchored-overlay.js';

import './md-gb-select.js';
import {type SelectElement} from './select-element.js';

adoptStyles(document, [m3Styles]);

describe('<md-gb-select> without CSS anchor positioning', () => {
  const env = new Environment();

  beforeEach(() => forceAnchorPositioningSupport(false));
  afterEach(() => forceAnchorPositioningSupport(null));

  async function setup(wrapperStyle: string) {
    const root = env.render(html`
      <div style="position: fixed; left: 40px; width: 260px; ${wrapperStyle}">
        <md-gb-select label="Fruit">
          <md-gb-select-option value="a">Apple</md-gb-select-option>
          <md-gb-select-option value="b">Banana</md-gb-select-option>
          <md-gb-select-option value="c">Cherry</md-gb-select-option>
        </md-gb-select>
      </div>
    `);
    await env.waitForStability();
    const select = root.querySelector('md-gb-select') as SelectElement;
    select.open = true;
    await select.updateComplete;
    await env.waitForStability();
    const listbox = select.shadowRoot!.querySelector<HTMLElement>(
      '.select-menu',
    )!;
    const field = select.shadowRoot!.querySelector<HTMLElement>(
      '.text-field-container',
    )!;
    // Rects are measured once the open animation has finished.
    await Promise.all(listbox.getAnimations().map((a) => a.finished));
    return {select, listbox, field};
  }

  // spec: menus-eb894b
  it('opens below the field, as wide as the field', async () => {
    const {listbox, field} = await setup('top: 60px');
    const a = field.getBoundingClientRect();
    const l = listbox.getBoundingClientRect();
    expect(listbox.style.position).toBe('fixed');
    expect(Math.round(l.top)).toBe(Math.round(a.bottom));
    expect(Math.round(l.left)).toBe(Math.round(a.left));
    expect(Math.round(l.width)).toBe(Math.round(a.width));
  });

  // spec: menus-74a090
  it('opens above the field when there is no room below', async () => {
    const {listbox, field} = await setup(`top: ${window.innerHeight - 90}px`);
    const a = field.getBoundingClientRect();
    const l = listbox.getBoundingClientRect();
    expect(Math.round(l.bottom)).toBeLessThanOrEqual(Math.round(a.top));
    expect(l.top).toBeGreaterThanOrEqual(0);
  });

  it('leaves the placement to CSS when the browser has anchor positioning', async () => {
    forceAnchorPositioningSupport(null);
    const {listbox} = await setup('top: 60px');
    expect(listbox.style.left).toBe('');
    expect(listbox.style.inlineSize).toBe('');
  });
});
