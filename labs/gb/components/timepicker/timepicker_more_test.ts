/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-time-picker.js';

import {setViewport} from '@web/test-runner-commands';
import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {type TimePickerElement} from './time-picker-element.js';

adoptStyles(document, [m3Styles]);

describe('time picker more spec behavior', () => {
  const env = new Environment();

  async function setup(attrs: {modal?: boolean; mode?: string; cycle?: string} = {}) {
    const root = env.render(html`<md-gb-time-picker
      ?modal=${attrs.modal}
      mode=${attrs.mode ?? 'dial'}
      value="14:30"
      hour-cycle=${attrs.cycle ?? '12'}
      locale="en-US"
      quick
    ></md-gb-time-picker>`);
    await env.waitForStability();
    const picker = root.querySelector('md-gb-time-picker') as TimePickerElement;
    await picker.updateComplete;
    return picker;
  }

  const q = <T extends Element = HTMLElement>(picker: TimePickerElement, selector: string) =>
    picker.shadowRoot!.querySelector<T>(selector)!;

  // spec: time-pickers-48b501, time-pickers-0fec69, time-pickers-8c9ab8
  it('appears above other elements in a modal dialog with a scrim behind it', async () => {
    const picker = await setup({modal: true});
    await picker.show();
    await env.waitForStability();
    const dialog = q<HTMLDialogElement>(picker, 'dialog');
    expect(dialog.matches(':modal')).toBeTrue();
    const scrim = getComputedStyle(dialog, '::backdrop').backgroundColor;
    expect(scrim).not.toBe('rgba(0, 0, 0, 0)');
    expect(scrim).not.toBe('transparent');
    // The container holds all the elements.
    for (const selector of ['.time-picker-headline', '.time-picker-body', '.time-picker-actions']) {
      expect(dialog.contains(q(picker, selector))).withContext(selector).toBeTrue();
    }
  });

  // spec: time-pickers-43cf3b, time-pickers-5229c3, time-pickers-dc2b04, time-pickers-fb881c, time-pickers-fc98c2, time-pickers-778ce5
  it('gives the input selector separate hour and minute fields, larger than a text field, with a label below each', async () => {
    const picker = await setup({mode: 'input'});
    const fields = [...picker.shadowRoot!.querySelectorAll<HTMLElement>('.time-picker-field')];
    expect(fields.length).toBe(2);
    const [hour, minute] = fields.map((f) => f.querySelector('input')!);
    expect(hour.getAttribute('data-selection')).toBe('hour');
    expect(minute.getAttribute('data-selection')).toBe('minute');
    // A larger shape, size and font than a 56dp text field with 16dp text.
    const box = fields[0].getBoundingClientRect();
    expect(box.height).toBeGreaterThan(56);
    expect(parseFloat(getComputedStyle(hour).fontSize)).toBeGreaterThan(16);
    // The label sits below the field.
    for (const field of fields) {
      const label = field.querySelector<HTMLElement>('.time-picker-field-label, [class*=label]')!;
      expect(label).not.toBeNull();
      expect(label.getBoundingClientRect().top).toBeGreaterThanOrEqual(
        field.querySelector('input')!.getBoundingClientRect().bottom - 1,
      );
    }
    // The selected field is highlighted.
    hour.focus();
    await env.waitForStability();
    expect(getComputedStyle(hour).backgroundColor).not.toBe(
      getComputedStyle(minute).backgroundColor,
    );
  });

  // spec: time-pickers-f59cc6, time-pickers-e7cad7
  it('shows the AM/PM selector right of the minutes on a 12-hour clock only', async () => {
    const twelve = await setup({mode: 'input', cycle: '12'});
    const period = q(twelve, '.time-picker-period');
    const minute = q(twelve, 'input[data-selection="minute"]');
    expect(period).not.toBeNull();
    expect(period.getBoundingClientRect().left).toBeGreaterThanOrEqual(
      minute.getBoundingClientRect().right - 1,
    );
    const twentyFour = await setup({mode: 'input', cycle: '24'});
    expect(twentyFour.shadowRoot!.querySelector('.time-picker-period')).toBeNull();
  });

  // spec: time-pickers-f34c4d
  it('shapes the dial like a round watch face', async () => {
    const picker = await setup();
    const dial = q(picker, '.time-picker-dial');
    const r = dial.getBoundingClientRect();
    expect(r.width).toBeCloseTo(r.height, 0);
    const radius = parseFloat(getComputedStyle(dial).borderTopLeftRadius);
    expect(radius).toBeGreaterThanOrEqual(r.width / 2 - 0.5);
  });

  // spec: time-pickers-a5b252, time-pickers-925263
  it('reads the dial selection out of the total, such as Hour 7 of 12', async () => {
    const picker = await setup();
    picker.value = '07:00';
    await picker.updateComplete;
    expect(q(picker, '.time-picker-dial').getAttribute('aria-valuetext')).toBe('Hour 7 of 12');
    picker.selection = 'minute';
    await picker.updateComplete;
    expect(q(picker, '.time-picker-dial').getAttribute('aria-valuetext')).toMatch(/of 60$/);
  });

  // spec: time-pickers-c3ee93
  it('does not scroll when the window is short', async () => {
    await setViewport({width: 900, height: 400});
    try {
      const picker = await setup({modal: true});
      await picker.show();
      await env.waitForStability();
      const dialog = q<HTMLDialogElement>(picker, 'dialog');
      expect(dialog.scrollHeight).toBeLessThanOrEqual(dialog.clientHeight);
      expect(dialog.getBoundingClientRect().height).toBeLessThanOrEqual(window.innerHeight);
    } finally {
      await setViewport({width: 800, height: 600});
    }
  });

  // spec: time-pickers-ec9ac3
  it('puts all the numbers of a 12-hour dial in the outer ring', async () => {
    const picker = await setup({cycle: '12'});
    const labels = picker.shadowRoot!.querySelectorAll('.time-picker-dial-face-hour .time-picker-dial-label');
    expect(labels.length).toBe(12);
    expect(
      picker.shadowRoot!.querySelectorAll('.time-picker-dial-face-hour .time-picker-dial-label-inner').length,
    ).toBe(0);
  });
});
