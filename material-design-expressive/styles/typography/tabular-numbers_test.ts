/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import '../../components/datepicker/md-gb-date-picker.js';
import '../../components/slider/md-gb-slider.js';
import '../../components/timepicker/md-gb-time-picker.js';
import {adoptStyles} from '../adopt-styles.js';
import {styles as m3Styles} from '../m3.cssresult.js';

adoptStyles(document, [m3Styles]);

// Values that change use tabular figures (font-variant-numeric), so their
// width does not shift the layout. Progress renders no numeric text, so it
// has no value to set.
describe('tabular numbers', () => {
  const env = new Environment();

  function tabular(el: Element | null | undefined) {
    if (!el) throw new Error('Missing element');
    return getComputedStyle(el).fontVariantNumeric;
  }

  // spec: typography-6a429e, typography-29cfca
  it('time picker selectors and input fields use tabular numbers', async () => {
    const root = env.render(html`<md-gb-time-picker value="14:30"></md-gb-time-picker>
      <md-gb-time-picker mode="input" value="14:30"></md-gb-time-picker>`);
    await env.waitForStability();
    const [dial, input] = [...root.querySelectorAll('md-gb-time-picker')];
    expect(tabular(dial.shadowRoot!.querySelector('.time-picker-selector'))).toBe('tabular-nums');
    expect(tabular(input.shadowRoot!.querySelector('.time-picker-field-input'))).toBe('tabular-nums');
  });

  // spec: typography-6a429e, typography-29cfca
  it('date picker day numbers use tabular numbers', async () => {
    const root = env.render(html`<md-gb-date-picker
      inline
      quick
      locale="en-US"
      value="2025-08-17"
    ></md-gb-date-picker>`);
    await env.waitForStability();
    const picker = root.querySelector('md-gb-date-picker')!;
    await picker.updateComplete;
    expect(tabular(picker.shadowRoot!.querySelector('.date-picker-day'))).toBe('tabular-nums');
  });

  // spec: typography-6a429e, typography-29cfca
  it('date picker headline (the changing date) uses tabular numbers', async () => {
    const root = env.render(html`<md-gb-date-picker
      variant="modal"
      quick
      locale="en-US"
      value="2025-08-17"
    ></md-gb-date-picker>`);
    await env.waitForStability();
    const picker = root.querySelector('md-gb-date-picker')!;
    await picker.show();
    await env.waitForStability();
    expect(tabular(picker.shadowRoot!.querySelector('.date-picker-headline'))).toBe('tabular-nums');
  });

  // spec: typography-6a429e, typography-29cfca
  it('slider value label uses tabular numbers', async () => {
    const root = env.render(html`<md-gb-slider labeled value="50"></md-gb-slider>`);
    await env.waitForStability();
    const slider = root.querySelector('md-gb-slider')!;
    expect(tabular(slider.shadowRoot!.querySelector('.slider-label'))).toBe('tabular-nums');
  });
});
