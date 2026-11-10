/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {Environment} from '../../testing/environment.js';

import './md-gb-time-picker.js';
import {
  angleToValue,
  formatTime,
  localePeriodLabels,
  localeUses24Hour,
  nearestAngle,
  parseTime,
  pointToAngle,
  TIME_PICKER_CLASSES,
  timePickerClasses,
} from './time-picker.js';
import {type TimePickerElement} from './time-picker-element.js';

function q<T extends Element = HTMLElement>(
  el: TimePickerElement,
  selector: string,
): T {
  const found = el.shadowRoot!.querySelector<T>(selector);
  if (!found) {
    throw new Error(`Missing ${selector}`);
  }
  return found;
}

function key(target: Element, k: string) {
  const event = new KeyboardEvent('keydown', {
    key: k,
    bubbles: true,
    composed: true,
    cancelable: true,
  });
  target.dispatchEvent(event);
  return event;
}

/** Dispatches a pointer event at `ratio` (of the radius) and `angle` on the dial. */
function pointerAt(
  dial: HTMLElement,
  type: string,
  angleDeg: number,
  ratio = 101 / 256,
) {
  const rect = dial.getBoundingClientRect();
  const r = rect.width * ratio;
  const a = (angleDeg * Math.PI) / 180;
  const event = new PointerEvent(type, {
    clientX: rect.left + rect.width / 2 + r * Math.sin(a),
    clientY: rect.top + rect.height / 2 - r * Math.cos(a),
    button: 0,
    pointerId: 1,
    bubbles: true,
    composed: true,
    cancelable: true,
  });
  dial.dispatchEvent(event);
}

describe('time picker helpers', () => {
  it('parses and formats HH:MM', () => {
    expect(parseTime('07:05')).toEqual({hour: 7, minute: 5});
    expect(parseTime('23:59:30')).toEqual({hour: 23, minute: 59});
    expect(parseTime('24:00')).toBeNull();
    expect(parseTime('7')).toBeNull();
    expect(parseTime('')).toBeNull();
    expect(formatTime({hour: 9, minute: 3})).toBe('09:03');
  });

  it('maps dial angles to values', () => {
    expect(pointToAngle(0, -1)).toBe(0);
    expect(pointToAngle(1, 0)).toBe(90);
    expect(pointToAngle(-1, 0)).toBe(270);
    expect(angleToValue(90, 'hour')).toBe(3);
    expect(angleToValue(359, 'hour')).toBe(0);
    expect(angleToValue(42, 'minute')).toBe(7);
    expect(angleToValue(42, 'minute', 5)).toBe(5);
  });

  it('turns the short way round the dial', () => {
    expect(nearestAngle(330, 0)).toBe(360);
    expect(nearestAngle(10, 350)).toBe(-10);
    expect(nearestAngle(720, 90)).toBe(810);
  });

  it('reads the 12/24-hour clock and periods from Intl', () => {
    expect(localeUses24Hour('en-US')).toBeFalse();
    expect(localeUses24Hour('en-GB')).toBeTrue();
    expect(localePeriodLabels('en-US')).toEqual(['AM', 'PM']);
  });

  it('returns container classes', () => {
    expect(
      timePickerClasses({
        mode: 'input',
        orientation: 'horizontal',
        hour24: true,
      }),
    ).toEqual({
      [TIME_PICKER_CLASSES.timePicker]: true,
      [TIME_PICKER_CLASSES.input]: true,
      [TIME_PICKER_CLASSES.horizontal]: true,
      [TIME_PICKER_CLASSES.hour24]: true,
      [TIME_PICKER_CLASSES.closing]: false,
      [TIME_PICKER_CLASSES.density1]: false,
      [TIME_PICKER_CLASSES.density2]: false,
      [TIME_PICKER_CLASSES.density3]: false,
    });
    expect(
      timePickerClasses({density: -3})[TIME_PICKER_CLASSES.density3],
    ).toBeTrue();
  });
});

describe('<md-gb-time-picker>', () => {
  const env = new Environment();

  async function setupTest(
    template = html`<md-gb-time-picker
      value="14:30"
      hour-cycle="12"
      quick
    ></md-gb-time-picker>`,
  ) {
    const root = env.render(template);
    await env.waitForStability();
    const picker = root.querySelector('md-gb-time-picker')!;
    return {root, picker};
  }

  describe('rendering', () => {
    it('renders the dial mode with the selected time', async () => {
      const {picker} = await setupTest();
      expect(picker.mode).toBe('dial');
      expect(picker.value).toBe('14:30');
      expect(q(picker, '[data-selection="hour"]').textContent?.trim()).toBe(
        '02',
      );
      expect(q(picker, '[data-selection="minute"]').textContent?.trim()).toBe(
        '30',
      );
      expect(q(picker, '.time-picker-headline').textContent?.trim()).toBe(
        'Select time',
      );
      expect(q(picker, '.time-picker-dial').offsetWidth).toBe(256);
    });

    it('labels the container with the headline', async () => {
      const {picker} = await setupTest();
      const container = q(picker, '.time-picker');
      expect(container.getAttribute('role')).toBe('group');
      expect(container.getAttribute('aria-labelledby')).toBe('headline');
    });

    it('ignores an invalid value', async () => {
      const {picker} = await setupTest();
      picker.value = '25:00';
      expect(picker.value).toBe('');
    });

    it('follows the locale clock by default', async () => {
      const {picker} = await setupTest(
        html`<md-gb-time-picker
          value="14:30"
          locale="en-GB"
          quick
        ></md-gb-time-picker>`,
      );
      expect(picker.is24Hour).toBeTrue();
      expect(
        picker.shadowRoot!.querySelector('.time-picker-period'),
      ).toBeNull();
      expect(q(picker, '[data-selection="hour"]').textContent?.trim()).toBe(
        '14',
      );
      picker.locale = 'en-US';
      await env.waitForStability();
      expect(picker.is24Hour).toBeFalse();
      expect(
        picker.shadowRoot!.querySelector('.time-picker-period'),
      ).not.toBeNull();
    });

    // spec: time-pickers-dbff70, time-pickers-bd287c
    // time-pickers-690231 puts even hours inside and odd outside, but its own
    // figure and Compose (TimePicker.kt: outer `Hours`, inner `ExtraHours`)
    // put 00-11 on the outer ring and 12-23 on the inner one, as here.
    it('shows the 24-hour inner ring', async () => {
      const {picker} = await setupTest(
        html`<md-gb-time-picker
          value="14:30"
          hour-cycle="24"
          quick
        ></md-gb-time-picker>`,
      );
      const inner = picker.shadowRoot!.querySelectorAll(
        '.time-picker-dial-face-hour .time-picker-dial-label-inner',
      );
      expect(inner.length).toBe(12);
      expect(inner[0].textContent).toBe('12');
      expect([...inner].map((l) => Number(l.textContent)).sort((a, b) => a - b)).toEqual(
        Array.from({length: 12}, (_, i) => i + 12),
      );
      const outer = [
        ...picker.shadowRoot!.querySelectorAll(
          '.time-picker-dial-face-hour .time-picker-dial-label:not(.time-picker-dial-label-inner)',
        ),
      ].map((l) => Number(l.textContent));
      expect(outer.sort((a, b) => a - b)).toEqual(Array.from({length: 12}, (_, i) => i));
      expect(q(picker, '.time-picker').classList).toContain('time-picker-24h');
    });

    // spec: time-pickers-3d7e71, time-pickers-920d0e, time-pickers-80acbd, time-pickers-b81cc6
    it('lays out horizontally', async () => {
      const {picker} = await setupTest(
        html`<md-gb-time-picker
          orientation="horizontal"
          quick
        ></md-gb-time-picker>`,
      );
      expect(picker.effectiveOrientation).toBe('horizontal');
      expect(q(picker, '.time-picker').classList).toContain(
        'time-picker-horizontal',
      );
      const body = q(picker, '.time-picker-body');
      expect(getComputedStyle(body).flexDirection).toBe('row');
    });
  });

  describe('density', () => {
    it('defaults to 0, clamps to 0..-3 and reflects', async () => {
      const {picker} = await setupTest();
      expect(picker.density).toBe(0);
      picker.density = -4;
      expect(picker.density).toBe(-3);
      picker.density = 1;
      expect(picker.density).toBe(0);
      picker.density = -2;
      await picker.updateComplete;
      expect(picker.getAttribute('density')).toBe('-2');
    });

    it('removes 4px per step from the selectors, period and dial', async () => {
      const {picker} = await setupTest(
        html`<md-gb-time-picker
          value="14:30"
          hour-cycle="12"
          orientation="vertical"
        ></md-gb-time-picker>`,
      );
      const height = (selector: string) =>
        q(picker, selector).getBoundingClientRect().height;
      for (const [density, selector, dial] of [
        [0, 80, 256],
        [-1, 76, 252],
        [-3, 68, 244],
      ]) {
        picker.density = density;
        await picker.updateComplete;
        expect(height('[data-selection="hour"]'))
          .withContext(`density ${density} selector`)
          .toBe(selector);
        expect(height('.time-picker-period'))
          .withContext(`density ${density} period`)
          .toBe(selector);
        expect(height('.time-picker-dial'))
          .withContext(`density ${density} dial`)
          .toBe(dial);
      }
    });

    it('keeps the full-size dial in the horizontal layout', async () => {
      const {picker} = await setupTest(
        html`<md-gb-time-picker
          value="14:30"
          hour-cycle="12"
          orientation="horizontal"
          density="-3"
        ></md-gb-time-picker>`,
      );
      expect(
        q(picker, '.time-picker-dial').getBoundingClientRect().height,
      ).toBe(256);
    });

    it('removes 4px per step from the input fields', async () => {
      const {picker} = await setupTest(
        html`<md-gb-time-picker
          mode="input"
          value="14:30"
          hour-cycle="12"
          density="-3"
        ></md-gb-time-picker>`,
      );
      expect(
        q(picker, '.time-picker-field-input').getBoundingClientRect().height,
      ).toBe(60);
      expect(
        q(picker, '.time-picker-period').getBoundingClientRect().height,
      ).toBe(60);
    });
  });

  describe('dial', () => {
    // spec: time-pickers-b8f833, time-pickers-2cacc5
    it('is a slider with value text', async () => {
      const {picker} = await setupTest();
      const dial = q(picker, '.time-picker-dial');
      expect(dial.getAttribute('role')).toBe('slider');
      expect(dial.getAttribute('aria-label')).toBe('Select hour');
      expect(dial.getAttribute('aria-valuemin')).toBe('1');
      expect(dial.getAttribute('aria-valuemax')).toBe('12');
      expect(dial.getAttribute('aria-valuenow')).toBe('2');
      expect(dial.getAttribute('aria-valuetext')).toBe('Hour 2 of 12');
      expect(dial.tabIndex).toBe(0);
    });

    it('changes the hour with arrow keys and fires input', async () => {
      const {picker} = await setupTest();
      const input = jasmine.createSpy('input');
      const change = jasmine.createSpy('change');
      picker.addEventListener('input', input);
      picker.addEventListener('change', change);
      const dial = q(picker, '.time-picker-dial');
      expect(key(dial, 'ArrowUp').defaultPrevented).toBeTrue();
      await env.waitForStability();
      expect(picker.pendingValue).toBe('15:30');
      expect(picker.value).toBe('14:30');
      expect(input).toHaveBeenCalledTimes(1);
      expect(change).not.toHaveBeenCalled();
      expect(dial.getAttribute('aria-valuenow')).toBe('3');
      key(dial, 'ArrowDown');
      key(dial, 'ArrowDown');
      await env.waitForStability();
      expect(picker.pendingValue).toBe('13:30');
    });

    it('keeps the period when wrapping 12-hour hours', async () => {
      const {picker} = await setupTest(
        html`<md-gb-time-picker
          value="11:00"
          hour-cycle="12"
          quick
        ></md-gb-time-picker>`,
      );
      const dial = q(picker, '.time-picker-dial');
      key(dial, 'ArrowUp');
      expect(picker.pendingValue).toBe('00:00');
      key(dial, 'ArrowUp');
      expect(picker.pendingValue).toBe('01:00');
    });

    it('moves to the minutes with Enter and announces it', async () => {
      const {picker} = await setupTest();
      const dial = q(picker, '.time-picker-dial');
      key(dial, 'Enter');
      await env.waitForStability();
      expect(picker.selection).toBe('minute');
      expect(dial.getAttribute('aria-label')).toBe('Select minutes');
      expect(dial.getAttribute('aria-valuemax')).toBe('59');
      expect(dial.getAttribute('aria-valuetext')).toBe('Minute 30 of 60');
      expect(q(picker, '[role="status"]').textContent?.trim()).toBe(
        'Select minutes',
      );
      expect(
        q(picker, '[data-selection="minute"]').getAttribute('aria-pressed'),
      ).toBe('true');
      key(dial, 'PageUp');
      expect(picker.pendingValue).toBe('14:35');
      key(dial, 'Home');
      expect(picker.pendingValue).toBe('14:00');
      key(dial, 'End');
      expect(picker.pendingValue).toBe('14:59');
    });

    it('accepts typed digits', async () => {
      const {picker} = await setupTest();
      const dial = q(picker, '.time-picker-dial');
      key(dial, '1');
      expect(picker.pendingValue).toBe('13:30');
      key(dial, '1');
      expect(picker.pendingValue).toBe('23:30');
      await env.waitForStability();
      // A complete hour moves on to the minutes.
      expect(picker.selection).toBe('minute');
      key(dial, '4');
      key(dial, '5');
      expect(picker.pendingValue).toBe('23:45');
    });

    // spec: time-pickers-83ccc5
    it('picks the tapped hour, then switches to minutes', async () => {
      const {picker} = await setupTest();
      const dial = q(picker, '.time-picker-dial');
      pointerAt(dial, 'pointerdown', 90);
      pointerAt(dial, 'pointerup', 90);
      await env.waitForStability();
      expect(picker.pendingValue).toBe('15:30');
      expect(picker.selection).toBe('minute');
      // Minute taps snap to multiples of 5.
      pointerAt(dial, 'pointerdown', 183);
      pointerAt(dial, 'pointerup', 183);
      await env.waitForStability();
      expect(picker.pendingValue).toBe('15:30');
      pointerAt(dial, 'pointerdown', 268);
      pointerAt(dial, 'pointerup', 268);
      expect(picker.pendingValue).toBe('15:45');
    });

    // spec: time-pickers-83ccc5
    it('follows a drag', async () => {
      const {picker} = await setupTest();
      const dial = q(picker, '.time-picker-dial');
      key(dial, 'Enter');
      await env.waitForStability();
      pointerAt(dial, 'pointerdown', 0);
      pointerAt(dial, 'pointermove', 40);
      await env.waitForStability();
      expect(q(picker, '.time-picker').classList).toContain(
        'time-picker-dragging',
      );
      pointerAt(dial, 'pointermove', 42);
      // Drags pick single minutes.
      expect(picker.pendingValue).toBe('14:07');
      pointerAt(dial, 'pointerup', 42);
      await env.waitForStability();
      expect(q(picker, '.time-picker').classList).not.toContain(
        'time-picker-dragging',
      );
    });

    it('picks inner ring hours on a 24-hour dial', async () => {
      const {picker} = await setupTest(
        html`<md-gb-time-picker
          value="03:00"
          hour-cycle="24"
          quick
        ></md-gb-time-picker>`,
      );
      const dial = q(picker, '.time-picker-dial');
      pointerAt(dial, 'pointerdown', 180, 69 / 256);
      pointerAt(dial, 'pointerup', 180, 69 / 256);
      expect(picker.pendingValue).toBe('18:00');
      picker.selection = 'hour';
      pointerAt(dial, 'pointerdown', 180);
      pointerAt(dial, 'pointerup', 180);
      expect(picker.pendingValue).toBe('06:00');
    });
  });

  describe('period selector', () => {
    // spec: time-pickers-22f87c, time-pickers-2e84bf
    it('is a labeled radio group', async () => {
      const {picker} = await setupTest(
        html`<md-gb-time-picker
          value="14:30"
          hour-cycle="12"
          locale="en-US"
          quick
        ></md-gb-time-picker>`,
      );
      const group = q(picker, '.time-picker-period');
      expect(group.getAttribute('role')).toBe('radiogroup');
      expect(group.getAttribute('aria-label')).toBe('Select AM or PM');
      const [am, pm] = group.querySelectorAll('[role="radio"]');
      expect(am.textContent?.trim()).toBe('AM');
      expect(am.getAttribute('aria-checked')).toBe('false');
      expect(pm.getAttribute('aria-checked')).toBe('true');
      expect(pm.getAttribute('tabindex')).toBe('0');
      expect(am.getAttribute('tabindex')).toBe('-1');
    });

    it('switches the period by click and arrow keys', async () => {
      const {picker} = await setupTest();
      const input = jasmine.createSpy('input');
      picker.addEventListener('input', input);
      q(picker, '[data-period="am"]').click();
      await env.waitForStability();
      expect(picker.pendingValue).toBe('02:30');
      expect(input).toHaveBeenCalledTimes(1);
      key(q(picker, '[data-period="am"]'), 'ArrowDown');
      await env.waitForStability();
      expect(picker.pendingValue).toBe('14:30');
    });
  });

  describe('time selectors', () => {
    it('select hour or minute with labels', async () => {
      const {picker} = await setupTest();
      const hour = q(picker, '[data-selection="hour"]');
      const minute = q(picker, '[data-selection="minute"]');
      expect(hour.getAttribute('aria-label')).toBe("Select hour, 2 o'clock");
      expect(hour.getAttribute('aria-pressed')).toBe('true');
      minute.click();
      await env.waitForStability();
      expect(picker.selection).toBe('minute');
      expect(minute.getAttribute('aria-pressed')).toBe('true');
      expect(hour.getAttribute('aria-pressed')).toBe('false');
    });

    it('accept typed digits', async () => {
      const {picker} = await setupTest();
      const minute = q(picker, '[data-selection="minute"]');
      key(minute, '0');
      key(minute, '5');
      expect(picker.pendingValue).toBe('14:05');
    });
  });

  describe('input mode', () => {
    // spec: time-pickers-a80351, time-pickers-5c65e6, time-pickers-1f1a21, time-pickers-f26520, time-pickers-1e0ef8, time-pickers-2846c6, time-pickers-a93a27, time-pickers-c86ae4, time-pickers-ad7609
    it('toggles from the mode button', async () => {
      const {picker} = await setupTest();
      const toggle = q(picker, '.time-picker-mode-toggle');
      expect(toggle.getAttribute('aria-label')).toBe(
        'Switch to text input mode',
      );
      toggle.click();
      await env.waitForStability();
      expect(picker.mode).toBe('input');
      expect(picker.getAttribute('mode')).toBe('input');
      expect(q(picker, '.time-picker-headline').textContent?.trim()).toBe(
        'Enter time',
      );
      expect(
        q(picker, '.time-picker-mode-toggle').getAttribute('aria-label'),
      ).toBe('Switch to clock mode');
      expect(picker.shadowRoot!.querySelector('.time-picker-dial')).toBeNull();
    });

    // spec: time-pickers-6113ac, time-pickers-999de8, time-pickers-c57fc7, time-pickers-9f19d4, time-pickers-e14b2c, time-pickers-57068d, time-pickers-881070, time-pickers-bb2d8a, time-pickers-d99e41
    it('renders labeled hour and minute fields', async () => {
      const {picker} = await setupTest(
        html`<md-gb-time-picker
          mode="input"
          value="14:30"
          hour-cycle="12"
          quick
        ></md-gb-time-picker>`,
      );
      const hour = q<HTMLInputElement>(picker, 'input[data-selection="hour"]');
      const minute = q<HTMLInputElement>(
        picker,
        'input[data-selection="minute"]',
      );
      expect(hour.getAttribute('aria-label')).toBe('Hour');
      expect(minute.getAttribute('aria-label')).toBe('Minute');
      expect(hour.getAttribute('inputmode')).toBe('numeric');
      expect(hour.value).toBe('02');
      expect(minute.value).toBe('30');
      expect(hour.offsetHeight).toBe(72);
    });

    // spec: time-pickers-906143, time-pickers-66ab7d, time-pickers-58fb92, time-pickers-1d5455
    it('takes typed hours and minutes', async () => {
      const {picker} = await setupTest(
        html`<md-gb-time-picker
          mode="input"
          value="14:30"
          hour-cycle="12"
          quick
        ></md-gb-time-picker>`,
      );
      const input = jasmine.createSpy('input');
      picker.addEventListener('input', input);
      const hour = q<HTMLInputElement>(picker, 'input[data-selection="hour"]');
      const minute = q<HTMLInputElement>(
        picker,
        'input[data-selection="minute"]',
      );
      hour.focus();
      hour.value = '09';
      hour.dispatchEvent(new InputEvent('input', {bubbles: true}));
      await env.waitForStability();
      expect(picker.pendingValue).toBe('21:30');
      expect(input).toHaveBeenCalled();
      // A complete hour moves focus to the minutes.
      expect(picker.shadowRoot!.activeElement).toBe(minute);
      minute.value = '4a5';
      minute.dispatchEvent(new InputEvent('input', {bubbles: true}));
      expect(minute.value).toBe('45');
      expect(picker.pendingValue).toBe('21:45');
      key(minute, 'ArrowUp');
      expect(picker.pendingValue).toBe('21:46');
    });

    it('flags invalid input', async () => {
      const {picker} = await setupTest(
        html`<md-gb-time-picker
          mode="input"
          value="14:30"
          hour-cycle="12"
          quick
        ></md-gb-time-picker>`,
      );
      const hour = q<HTMLInputElement>(picker, 'input[data-selection="hour"]');
      hour.value = '13';
      hour.dispatchEvent(new InputEvent('input', {bubbles: true}));
      await env.waitForStability();
      expect(hour.getAttribute('aria-invalid')).toBe('true');
      expect(picker.pendingValue).toBe('14:30');
      hour.dispatchEvent(new FocusEvent('blur'));
      await env.waitForStability();
      expect(hour.value).toBe('02');
      expect(hour.getAttribute('aria-invalid')).toBe('false');
    });
  });

  describe('actions', () => {
    // spec: time-pickers-a7d83e, time-pickers-b0923c, time-pickers-6dad40
    it('commits with OK', async () => {
      const {picker} = await setupTest();
      const change = jasmine.createSpy('change');
      picker.addEventListener('change', change);
      key(q(picker, '.time-picker-dial'), 'ArrowUp');
      q(picker, '.time-picker-confirm').click();
      expect(picker.value).toBe('15:30');
      expect(change).toHaveBeenCalledTimes(1);
    });

    // spec: time-pickers-b0923c
    it('reverts with Cancel', async () => {
      const {picker} = await setupTest();
      const cancel = jasmine.createSpy('cancel');
      picker.addEventListener('cancel', cancel);
      key(q(picker, '.time-picker-dial'), 'ArrowUp');
      q(picker, '.time-picker-cancel').click();
      expect(cancel).toHaveBeenCalledTimes(1);
      expect(picker.value).toBe('14:30');
      expect(picker.pendingValue).toBe('14:30');
    });

    it('commits every change with hide-actions', async () => {
      const {picker} = await setupTest(
        html`<md-gb-time-picker
          value="14:30"
          hour-cycle="12"
          hide-actions
          quick
        ></md-gb-time-picker>`,
      );
      expect(
        picker.shadowRoot!.querySelector('.time-picker-confirm'),
      ).toBeNull();
      const change = jasmine.createSpy('change');
      picker.addEventListener('change', change);
      key(q(picker, '.time-picker-dial'), 'ArrowUp');
      expect(picker.value).toBe('15:30');
      expect(change).toHaveBeenCalledTimes(1);
    });
  });

  describe('form association', () => {
    it('submits and resets the value', async () => {
      const root = env.render(
        html`<form>
          <md-gb-time-picker
            name="alarm"
            value="07:15"
            hour-cycle="24"
            quick
          ></md-gb-time-picker>
        </form>`,
      );
      await env.waitForStability();
      const form = root.querySelector('form')!;
      const picker = root.querySelector('md-gb-time-picker')!;
      expect(new FormData(form).get('alarm')).toBe('07:15');
      key(q(picker, '.time-picker-dial'), 'ArrowUp');
      q(picker, '.time-picker-confirm').click();
      expect(new FormData(form).get('alarm')).toBe('08:15');
      form.reset();
      expect(picker.value).toBe('07:15');
    });

    it('disables its controls', async () => {
      const {picker} = await setupTest(
        html`<md-gb-time-picker disabled quick></md-gb-time-picker>`,
      );
      expect(
        q<HTMLButtonElement>(picker, '[data-selection="hour"]').disabled,
      ).toBeTrue();
      expect(q(picker, '.time-picker-dial').getAttribute('aria-disabled')).toBe(
        'true',
      );
    });
  });

  describe('modal', () => {
    it('opens a modal dialog and focuses the hour', async () => {
      const {picker} = await setupTest(
        html`<md-gb-time-picker
          modal
          value="14:30"
          hour-cycle="12"
          quick
        ></md-gb-time-picker>`,
      );
      const dialog = q<HTMLDialogElement>(picker, 'dialog');
      expect(dialog.open).toBeFalse();
      const open = jasmine.createSpy('open');
      picker.addEventListener('open', open);
      await picker.show();
      await env.waitForStability();
      expect(dialog.open).toBeTrue();
      expect(picker.open).toBeTrue();
      expect(open).toHaveBeenCalled();
      expect(picker.shadowRoot!.activeElement).toBe(
        q(picker, '[data-selection="hour"]'),
      );
      await picker.close();
    });

    it('cancels on Escape', async () => {
      const {picker} = await setupTest(
        html`<md-gb-time-picker
          modal
          value="14:30"
          hour-cycle="12"
          quick
        ></md-gb-time-picker>`,
      );
      await picker.show();
      const cancel = jasmine.createSpy('cancel');
      const close = jasmine.createSpy('close');
      picker.addEventListener('cancel', cancel);
      picker.addEventListener('close', close);
      key(q(picker, '.time-picker-dial'), 'ArrowUp');
      const dialog = q<HTMLDialogElement>(picker, 'dialog');
      dialog.dispatchEvent(new Event('cancel', {cancelable: true}));
      await env.waitForStability();
      await picker.updateComplete;
      expect(cancel).toHaveBeenCalled();
      expect(close).toHaveBeenCalled();
      expect(dialog.open).toBeFalse();
      expect(picker.value).toBe('14:30');
    });

    // spec: time-pickers-a7d83e
    it('confirms and closes with OK', async () => {
      const {picker} = await setupTest(
        html`<md-gb-time-picker
          modal
          value="14:30"
          hour-cycle="12"
          quick
        ></md-gb-time-picker>`,
      );
      await picker.show();
      const change = jasmine.createSpy('change');
      picker.addEventListener('change', change);
      key(q(picker, '.time-picker-dial'), 'ArrowDown');
      q(picker, '.time-picker-confirm').click();
      await env.waitForStability();
      await picker.updateComplete;
      expect(picker.value).toBe('13:30');
      expect(change).toHaveBeenCalledTimes(1);
      expect(q<HTMLDialogElement>(picker, 'dialog').open).toBeFalse();
    });
  });
});
