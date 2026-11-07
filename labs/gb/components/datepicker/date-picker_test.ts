/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';

import {
  addMonths,
  daysInMonth,
  getDateInputFormat,
  getFirstDayOfWeek,
  getMonthGrid,
  parseInputDate,
  parseIsoDate,
  splitRangeText,
  toIsoDate,
  today,
} from './calendar.js';
import {
  DATE_PICKER_CLASSES,
  datePickerClasses,
  datePickerDayClasses,
  getKeyboardTargetDate,
} from './date-picker.js';
import {DatePickerElement} from './date-picker-element.js';
import './md-gb-date-picker.js';

function q<T extends Element = HTMLElement>(el: DatePickerElement, selector: string) {
  return el.shadowRoot!.querySelector<T>(selector);
}

function qa<T extends Element = HTMLElement>(el: DatePickerElement, selector: string) {
  return [...el.shadowRoot!.querySelectorAll<T>(selector)];
}

function cell(el: DatePickerElement, iso: string) {
  const found = q(el, `[data-date="${iso}"]`);
  if (!found) {
    throw new Error(`No cell for ${iso}`);
  }
  return found;
}

function focusedCell(el: DatePickerElement) {
  return q(el, '.date-picker-grid [tabindex="0"]');
}

function key(target: Element, keyName: string, init: KeyboardEventInit = {}) {
  target.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: keyName,
      bubbles: true,
      composed: true,
      cancelable: true,
      ...init,
    }),
  );
}

function getInnerInput(field: Element) {
  const input = field.shadowRoot?.querySelector('input');
  if (!input) {
    throw new Error('No inner <input>');
  }
  return input;
}

function type(field: Element, text: string) {
  const input = getInnerInput(field);
  input.value = text;
  input.dispatchEvent(new InputEvent('input', {bubbles: true, composed: true}));
}

function change(field: Element) {
  getInnerInput(field).dispatchEvent(new Event('change', {bubbles: true}));
}

describe('date picker calendar model', () => {
  it('parses and formats ISO dates', () => {
    expect(parseIsoDate('2025-08-17')).toEqual({year: 2025, month: 8, day: 17});
    expect(parseIsoDate('2025-02-30')).toBeNull();
    expect(parseIsoDate('17/08/2025')).toBeNull();
    expect(toIsoDate({year: 987, month: 1, day: 2})).toBe('0987-01-02');
  });

  it('knows month lengths and leap years', () => {
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2025, 2)).toBe(28);
    expect(daysInMonth(1900, 2)).toBe(28);
    expect(daysInMonth(2000, 2)).toBe(29);
    expect(daysInMonth(2025, 4)).toBe(30);
    expect(daysInMonth(2025, 12)).toBe(31);
  });

  it('clamps the day when adding months', () => {
    expect(addMonths({year: 2025, month: 1, day: 31}, 1)).toEqual({
      year: 2025,
      month: 2,
      day: 28,
    });
    expect(addMonths({year: 2025, month: 1, day: 15}, -1)).toEqual({
      year: 2024,
      month: 12,
      day: 15,
    });
  });

  it('lays out weeks from the first day of the week', () => {
    // August 2025 starts on a Friday.
    const sunday = getMonthGrid(2025, 8, 0, false);
    expect(sunday.weeks.length).toBe(6);
    expect(sunday.weeks[0][5].date).toEqual({year: 2025, month: 8, day: 1});
    expect(sunday.weeks[0][0].outside).toBeTrue();
    const monday = getMonthGrid(2025, 8, 1, false);
    expect(monday.weeks[0][4].date.day).toBe(1);
    expect(monday.weeks.length).toBe(5);
    expect(getMonthGrid(2025, 8, 1, true).weeks.length).toBe(6);
  });

  it('derives the date input format from the locale', () => {
    expect(getDateInputFormat('en-US')).toEqual({
      order: ['m', 'd', 'y'],
      delimiter: '/',
      pattern: 'MM/DD/YYYY',
    });
    expect(getDateInputFormat('de-DE').pattern).toBe('DD.MM.YYYY');
    expect(getDateInputFormat('ja-JP').order).toEqual(['y', 'm', 'd']);
  });

  it('parses typed dates leniently', () => {
    const us = getDateInputFormat('en-US');
    const expected = {year: 2023, month: 8, day: 17};
    for (const text of [
      '08/17/2023',
      '8/17/2023',
      '8-17-2023',
      '8.17.2023',
      '8 17 2023',
      '08172023',
      '2023-08-17',
    ]) {
      expect(parseInputDate(text, us)).withContext(text).toEqual(expected);
    }
    expect(parseInputDate('13/17/2023', us)).toBeNull();
    expect(parseInputDate('8/17/23', us)).toBeNull();
    expect(parseInputDate('17.08.2023', getDateInputFormat('de-DE'))).toEqual(
      expected,
    );
  });

  it('splits range text', () => {
    expect(splitRangeText('08/17/2025 – 08/23/2025')).toEqual([
      '08/17/2025',
      '08/23/2025',
    ]);
    expect(splitRangeText('8-17-2025 - 8-23-2025')).toEqual([
      '8-17-2025',
      '8-23-2025',
    ]);
    expect(splitRangeText('08/17/2025')).toBeNull();
  });

  it('reads the first day of the week from Intl', () => {
    expect(getFirstDayOfWeek('en-US')).toBe(0);
    const supported =
      'getWeekInfo' in Intl.Locale.prototype || 'weekInfo' in Intl.Locale.prototype;
    if (supported) {
      expect(getFirstDayOfWeek('de-DE')).toBe(1);
    }
  });
});

describe('date picker keyboard targets', () => {
  const date = {year: 2025, month: 8, day: 13}; // A Wednesday.
  const keyOf = (keyName: string, init: Partial<KeyboardEvent> = {}) => ({
    key: keyName,
    shiftKey: false,
    ctrlKey: false,
    metaKey: false,
    ...init,
  });

  it('moves by day and week, mirrored in RTL', () => {
    expect(getKeyboardTargetDate(keyOf('ArrowRight'), date)?.day).toBe(14);
    expect(getKeyboardTargetDate(keyOf('ArrowLeft'), date)?.day).toBe(12);
    expect(getKeyboardTargetDate(keyOf('ArrowRight'), date, {rtl: true})?.day).toBe(12);
    expect(getKeyboardTargetDate(keyOf('ArrowDown'), date)?.day).toBe(20);
    expect(getKeyboardTargetDate(keyOf('ArrowUp'), date)?.day).toBe(6);
  });

  it('moves to the week and month edges', () => {
    expect(getKeyboardTargetDate(keyOf('Home'), date)?.day).toBe(10);
    expect(getKeyboardTargetDate(keyOf('End'), date)?.day).toBe(16);
    expect(getKeyboardTargetDate(keyOf('Home'), date, {firstDayOfWeek: 1})?.day).toBe(11);
    expect(getKeyboardTargetDate(keyOf('Home', {ctrlKey: true}), date)?.day).toBe(1);
    expect(getKeyboardTargetDate(keyOf('End', {ctrlKey: true}), date)?.day).toBe(31);
  });

  it('moves by month and year', () => {
    expect(getKeyboardTargetDate(keyOf('PageDown'), date)).toEqual({
      year: 2025,
      month: 9,
      day: 13,
    });
    expect(getKeyboardTargetDate(keyOf('PageUp', {shiftKey: true}), date)).toEqual({
      year: 2024,
      month: 8,
      day: 13,
    });
    expect(getKeyboardTargetDate(keyOf('a'), date)).toBeNull();
  });
});

describe('date picker classes', () => {
  it('returns container classes', () => {
    const classes = datePickerClasses({modal: true, range: true, input: true});
    expect(classes[DATE_PICKER_CLASSES.datePicker]).toBeTrue();
    expect(classes[DATE_PICKER_CLASSES.modal]).toBeTrue();
    expect(classes[DATE_PICKER_CLASSES.range]).toBeTrue();
    expect(classes[DATE_PICKER_CLASSES.input]).toBeTrue();
    expect(datePickerClasses({input: true})[DATE_PICKER_CLASSES.input]).toBeFalse();
  });

  it('returns day classes with a ripple', () => {
    const classes = datePickerDayClasses({selected: true, today: true});
    expect(classes[DATE_PICKER_CLASSES.day]).toBeTrue();
    expect(classes[DATE_PICKER_CLASSES.daySelected]).toBeTrue();
    expect(classes[DATE_PICKER_CLASSES.dayToday]).toBeTrue();
    expect(classes['ripple']).toBeTrue();
  });
});

describe('<md-gb-date-picker>', () => {
  const env = new Environment();

  async function setupTest(template = html`<md-gb-date-picker
    inline
    quick
    locale="en-US"
    value="2025-08-17"></md-gb-date-picker>`) {
    const root = env.render(template);
    await env.waitForStability();
    const picker = root.querySelector('md-gb-date-picker');
    if (!picker) {
      throw new Error('Failed to query rendered <md-gb-date-picker>');
    }
    await picker.updateComplete;
    return {root, picker};
  }

  async function settle(picker: DatePickerElement) {
    await picker.updateComplete;
    await env.waitForStability();
    await picker.updateComplete;
  }

  it('is an instance of DatePickerElement with defaults', async () => {
    const {picker} = await setupTest(html`<md-gb-date-picker></md-gb-date-picker>`);
    expect(picker).toBeInstanceOf(DatePickerElement);
    expect(picker.variant).toBe('docked');
    expect(picker.range).toBeFalse();
    expect(picker.open).toBeFalse();
    expect(picker.value).toBe('');
    expect(picker.mode).toBe('picker');
  });

  describe('calendar grid', () => {
    it('renders a grid with weekday column headers', async () => {
      const {picker} = await setupTest();
      const grid = q(picker, '[role="grid"]');
      expect(grid).not.toBeNull();
      expect(grid!.getAttribute('aria-label')).toBe('August 2025');
      const headers = qa(picker, '[role="columnheader"]');
      expect(headers.length).toBe(7);
      expect(headers[0].getAttribute('aria-label')).toBe('Sunday');
      expect(headers[0].textContent!.trim()).toBe('S');
      expect(qa(picker, '[role="row"]').length).toBeGreaterThan(4);
    });

    it('labels dates with the full date and marks the selection', async () => {
      const {picker} = await setupTest();
      const selected = cell(picker, '2025-08-17');
      expect(selected.getAttribute('role')).toBe('gridcell');
      expect(selected.getAttribute('aria-label')).toBe('Sunday, August 17, 2025');
      expect(selected.getAttribute('aria-selected')).toBe('true');
      expect(cell(picker, '2025-08-18').getAttribute('aria-selected')).toBe('false');
      expect(
        selected.querySelector(`.${DATE_PICKER_CLASSES.daySelected}`),
      ).not.toBeNull();
    });

    it('uses a roving tabindex starting on the selected date', async () => {
      const {picker} = await setupTest();
      const focusable = qa(picker, '.date-picker-grid [tabindex="0"]');
      expect(focusable.length).toBe(1);
      expect(focusable[0].dataset['date']).toBe('2025-08-17');
    });

    it('marks today', async () => {
      const {picker} = await setupTest(html`<md-gb-date-picker
        inline
        quick
        locale="en-US"></md-gb-date-picker>`);
      const todayCell = cell(picker, toIsoDate(today()));
      expect(todayCell.getAttribute('aria-current')).toBe('date');
      expect(todayCell.getAttribute('aria-label')).toMatch(/^Today, /);
      expect(
        todayCell.querySelector(`.${DATE_PICKER_CLASSES.dayToday}`),
      ).not.toBeNull();
    });

    it('starts the week on first-day-of-week', async () => {
      const {picker} = await setupTest(html`<md-gb-date-picker
        inline
        quick
        locale="en-US"
        first-day-of-week="1"
        value="2025-08-17"></md-gb-date-picker>`);
      const headers = qa(picker, '[role="columnheader"]');
      expect(headers[0].getAttribute('aria-label')).toBe('Monday');
    });

    it('localizes names with Intl', async () => {
      const {picker} = await setupTest(html`<md-gb-date-picker
        inline
        quick
        locale="de-DE"
        first-day-of-week="1"
        value="2025-08-17"></md-gb-date-picker>`);
      expect(q(picker, '[role="grid"]')!.getAttribute('aria-label')).toBe(
        'August 2025',
      );
      expect(qa(picker, '[role="columnheader"]')[0].getAttribute('aria-label')).toBe(
        'Montag',
      );
      expect(cell(picker, '2025-08-17').getAttribute('aria-label')).toBe(
        'Sonntag, 17. August 2025',
      );
    });

    it('shows adjacent month days in docked and hides them in modal', async () => {
      const {picker} = await setupTest();
      const outside = cell(picker, '2025-07-31');
      expect(outside.classList).toContain('date-picker-cell-outside');
      expect(outside.getAttribute('tabindex')).toBe('-1');

      picker.variant = 'modal';
      await settle(picker);
      expect(q(picker, '[data-date="2025-07-31"]')).toBeNull();
      expect(qa(picker, '.date-picker-week').length).toBe(6);
    });
  });

  describe('keyboard', () => {
    it('moves focus with arrow keys', async () => {
      const {picker} = await setupTest();
      const start = cell(picker, '2025-08-17');
      start.focus();
      key(start, 'ArrowRight');
      await settle(picker);
      expect(focusedCell(picker)!.dataset['date']).toBe('2025-08-18');
      expect(picker.shadowRoot!.activeElement).toBe(focusedCell(picker));

      key(focusedCell(picker)!, 'ArrowDown');
      await settle(picker);
      expect(focusedCell(picker)!.dataset['date']).toBe('2025-08-25');
    });

    it('mirrors left and right in RTL', async () => {
      const {picker} = await setupTest(html`<div dir="rtl">
        <md-gb-date-picker
          inline
          quick
          locale="en-US"
          value="2025-08-17"></md-gb-date-picker>
      </div>`);
      key(cell(picker, '2025-08-17'), 'ArrowRight');
      await settle(picker);
      expect(focusedCell(picker)!.dataset['date']).toBe('2025-08-16');
    });

    it('changes month with PageDown and announces it', async () => {
      const {picker} = await setupTest();
      key(cell(picker, '2025-08-17'), 'PageDown');
      await settle(picker);
      expect(q(picker, '[role="grid"]')!.getAttribute('aria-label')).toBe(
        'September 2025',
      );
      expect(focusedCell(picker)!.dataset['date']).toBe('2025-09-17');
      const live = q(picker, '[aria-live="polite"].date-picker-live')!;
      expect(live.textContent!.trim()).toBe('September 2025');
    });

    it('changes year with Shift+PageUp', async () => {
      const {picker} = await setupTest();
      key(cell(picker, '2025-08-17'), 'PageUp', {shiftKey: true});
      await settle(picker);
      expect(focusedCell(picker)!.dataset['date']).toBe('2024-08-17');
    });

    it('moves to the start and end of the week with Home and End', async () => {
      const {picker} = await setupTest();
      key(cell(picker, '2025-08-13'), 'Home');
      await settle(picker);
      expect(focusedCell(picker)!.dataset['date']).toBe('2025-08-10');
      key(focusedCell(picker)!, 'End');
      await settle(picker);
      expect(focusedCell(picker)!.dataset['date']).toBe('2025-08-16');
    });

    it('selects with Space and confirms with Enter', async () => {
      const {picker} = await setupTest();
      const changeSpy = jasmine.createSpy('change');
      const inputSpy = jasmine.createSpy('input');
      picker.addEventListener('change', changeSpy);
      picker.addEventListener('input', inputSpy);

      key(cell(picker, '2025-08-20'), ' ');
      await settle(picker);
      expect(inputSpy).toHaveBeenCalledTimes(1);
      expect(picker.pendingValue).toBe('2025-08-20');
      expect(picker.value).toBe('2025-08-17');
      expect(changeSpy).not.toHaveBeenCalled();

      key(cell(picker, '2025-08-21'), 'Enter');
      await settle(picker);
      expect(picker.value).toBe('2025-08-21');
      expect(changeSpy).toHaveBeenCalledTimes(1);
      expect(changeSpy.calls.mostRecent().args[0].detail.value).toBe('2025-08-21');
    });

    it('does not move past max', async () => {
      const {picker} = await setupTest(html`<md-gb-date-picker
        inline
        quick
        locale="en-US"
        max="2025-08-20"
        value="2025-08-17"></md-gb-date-picker>`);
      key(cell(picker, '2025-08-17'), 'PageDown');
      await settle(picker);
      expect(focusedCell(picker)!.dataset['date']).toBe('2025-08-20');
    });
  });

  describe('selection', () => {
    it('keeps a click pending until OK', async () => {
      const {picker} = await setupTest();
      const changeSpy = jasmine.createSpy('change');
      picker.addEventListener('change', changeSpy);
      cell(picker, '2025-08-05').click();
      await settle(picker);
      expect(cell(picker, '2025-08-05').getAttribute('aria-selected')).toBe('true');
      expect(picker.value).toBe('2025-08-17');

      q(picker, '.date-picker-confirm')!.click();
      await settle(picker);
      expect(picker.value).toBe('2025-08-05');
      expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    it('reverts with Cancel and fires cancel', async () => {
      const {picker} = await setupTest();
      const cancelSpy = jasmine.createSpy('cancel');
      picker.addEventListener('cancel', cancelSpy);
      cell(picker, '2025-08-05').click();
      await settle(picker);
      q(picker, '.date-picker-cancel')!.click();
      await settle(picker);
      expect(cancelSpy).toHaveBeenCalledTimes(1);
      expect(picker.pendingValue).toBe('2025-08-17');
      expect(cell(picker, '2025-08-17').getAttribute('aria-selected')).toBe('true');
    });

    it('commits right away with hide-actions', async () => {
      const {picker} = await setupTest(html`<md-gb-date-picker
        inline
        quick
        hide-actions
        locale="en-US"
        value="2025-08-17"></md-gb-date-picker>`);
      expect(q(picker, '.date-picker-actions')).toBeNull();
      cell(picker, '2025-08-09').click();
      await settle(picker);
      expect(picker.value).toBe('2025-08-09');
    });

    it('clears the selection with Clear', async () => {
      const {picker} = await setupTest(html`<md-gb-date-picker
        inline
        quick
        clearable
        locale="en-US"
        value="2025-08-17"></md-gb-date-picker>`);
      q(picker, '.date-picker-clear')!.click();
      await settle(picker);
      expect(picker.pendingValue).toBe('');
      q(picker, '.date-picker-confirm')!.click();
      await settle(picker);
      expect(picker.value).toBe('');
    });

    it('disables dates outside min and max and from isDateDisabled', async () => {
      const {picker} = await setupTest(html`<md-gb-date-picker
        inline
        quick
        locale="en-US"
        min="2025-08-05"
        max="2025-08-25"
        .isDateDisabled=${(iso: string) => iso === '2025-08-12'}
        value="2025-08-17"></md-gb-date-picker>`);
      expect(cell(picker, '2025-08-04').getAttribute('aria-disabled')).toBe('true');
      expect(cell(picker, '2025-08-26').getAttribute('aria-disabled')).toBe('true');
      expect(cell(picker, '2025-08-12').getAttribute('aria-disabled')).toBe('true');
      expect(cell(picker, '2025-08-13').hasAttribute('aria-disabled')).toBeFalse();

      cell(picker, '2025-08-12').click();
      await settle(picker);
      expect(picker.pendingValue).toBe('2025-08-17');

      expect(q<HTMLButtonElement>(picker, '.date-picker-previous-month')!.disabled).toBeTrue();
      expect(q<HTMLButtonElement>(picker, '.date-picker-next-month')!.disabled).toBeTrue();
    });

    it('navigates months with the arrow buttons', async () => {
      const {picker} = await setupTest();
      q(picker, '.date-picker-next-month')!.click();
      await settle(picker);
      expect(q(picker, '[role="grid"]')!.getAttribute('aria-label')).toBe(
        'September 2025',
      );
      expect(q(picker, '.date-picker-weeks-next')).not.toBeNull();
      q(picker, '.date-picker-previous-year')!.click();
      await settle(picker);
      expect(q(picker, '[role="grid"]')!.getAttribute('aria-label')).toBe(
        'September 2024',
      );
      expect(q(picker, '.date-picker-weeks-prev')).not.toBeNull();
    });
  });

  describe('range', () => {
    it('selects a start and end date with an in-range highlight', async () => {
      const {picker} = await setupTest(html`<md-gb-date-picker
        inline
        quick
        range
        locale="en-US"></md-gb-date-picker>`);
      picker.showMonth(2025, 8);
      await settle(picker);
      cell(picker, '2025-08-10').click();
      await settle(picker);
      cell(picker, '2025-08-14').click();
      await settle(picker);
      expect(picker.pendingValue).toBe('2025-08-10/2025-08-14');
      expect(cell(picker, '2025-08-10').classList).toContain(
        'date-picker-cell-range-start',
      );
      expect(cell(picker, '2025-08-14').classList).toContain(
        'date-picker-cell-range-end',
      );
      expect(cell(picker, '2025-08-12').classList).toContain(
        'date-picker-cell-in-range',
      );
      expect(cell(picker, '2025-08-12').getAttribute('aria-label')).toMatch(
        /^In range, /,
      );
      expect(cell(picker, '2025-08-10').getAttribute('aria-label')).toMatch(
        /^Start date, /,
      );
      expect(cell(picker, '2025-08-15').classList).not.toContain(
        'date-picker-cell-in-range',
      );

      q(picker, '.date-picker-confirm')!.click();
      await settle(picker);
      expect(picker.value).toBe('2025-08-10/2025-08-14');
      expect(picker.start).toBe('2025-08-10');
      expect(picker.end).toBe('2025-08-14');
    });

    it('restarts the range when picking before the start', async () => {
      const {picker} = await setupTest(html`<md-gb-date-picker
        inline
        quick
        range
        locale="en-US"
        value="2025-08-10/"></md-gb-date-picker>`);
      cell(picker, '2025-08-05').click();
      await settle(picker);
      expect(picker.pendingValue).toBe('2025-08-05/');
    });
  });

  describe('docked', () => {
    async function setupDocked(value = '2025-08-17') {
      return setupTest(html`<md-gb-date-picker
        quick
        locale="en-US"
        value=${value}></md-gb-date-picker>`);
    }

    it('renders an outlined text field with the formatted value and format hint', async () => {
      const {picker} = await setupDocked();
      const field = q(picker, 'md-gb-text-field') as HTMLElement & {
        value: string;
        variant: string;
        supportingText: string;
      };
      expect(field.variant).toBe('outlined');
      expect(field.value).toBe('08/17/2025');
      expect(field.supportingText).toBe('MM/DD/YYYY');
      const button = q(picker, '.date-picker-calendar-button')!;
      expect(button.getAttribute('aria-label')).toBe('Choose date');
      expect(button.getAttribute('aria-haspopup')).toBe('dialog');
      expect(button.getAttribute('aria-expanded')).toBe('false');
    });

    it('opens below the field from the calendar button and focuses the date', async () => {
      const {picker} = await setupDocked();
      const openSpy = jasmine.createSpy('open');
      picker.addEventListener('open', openSpy);
      q(picker, '.date-picker-calendar-button')!.click();
      await settle(picker);
      expect(picker.open).toBeTrue();
      expect(openSpy).toHaveBeenCalled();
      const surface = q(picker, '.date-picker')!;
      expect(surface.matches(':popover-open')).toBeTrue();
      expect(surface.getAttribute('role')).toBe('dialog');
      expect(picker.shadowRoot!.activeElement).toBe(cell(picker, '2025-08-17'));
      expect(
        q(picker, '.date-picker-calendar-button')!.getAttribute('aria-expanded'),
      ).toBe('true');
    });

    it('cancels with Escape and closes', async () => {
      const {picker} = await setupDocked();
      await picker.show();
      await settle(picker);
      const cancelSpy = jasmine.createSpy('cancel');
      const closeSpy = jasmine.createSpy('close');
      picker.addEventListener('cancel', cancelSpy);
      picker.addEventListener('close', closeSpy);
      key(cell(picker, '2025-08-17'), 'Escape');
      await settle(picker);
      expect(cancelSpy).toHaveBeenCalledTimes(1);
      expect(closeSpy).toHaveBeenCalledTimes(1);
      expect(closeSpy.calls.mostRecent().args[0].detail.reason).toBe('cancel');
      expect(picker.open).toBeFalse();
    });

    it('confirms with OK and closes', async () => {
      const {picker} = await setupDocked();
      await picker.show();
      await settle(picker);
      cell(picker, '2025-08-21').click();
      await settle(picker);
      q(picker, '.date-picker-confirm')!.click();
      await settle(picker);
      expect(picker.value).toBe('2025-08-21');
      expect(picker.open).toBeFalse();
      const field = q(picker, 'md-gb-text-field') as HTMLElement & {value: string};
      expect(field.value).toBe('08/21/2025');
    });

    it('commits typed dates and reformats them', async () => {
      const {picker} = await setupDocked('');
      const changeSpy = jasmine.createSpy('change');
      picker.addEventListener('change', changeSpy);
      const field = q(picker, 'md-gb-text-field')!;
      type(field, '8-5-2025');
      await settle(picker);
      change(field);
      await settle(picker);
      expect(picker.value).toBe('2025-08-05');
      expect(changeSpy).toHaveBeenCalledTimes(1);
      expect((field as HTMLElement & {value: string}).value).toBe('08/05/2025');
    });

    it('shows an error for invalid typed dates', async () => {
      const {picker} = await setupTest(html`<md-gb-date-picker
        quick
        locale="en-US"
        min="2025-01-01"
        max="2025-12-31"></md-gb-date-picker>`);
      const field = q(picker, 'md-gb-text-field') as HTMLElement & {
        error: boolean;
        errorText: string;
      };
      type(field, 'not a date');
      change(field);
      await settle(picker);
      expect(field.error).toBeTrue();
      expect(field.errorText).toBe('Date does not match expected pattern: MM/DD/YYYY');
      expect(picker.value).toBe('');

      type(field, '01/01/2030');
      change(field);
      await settle(picker);
      expect(field.errorText).toBe('Date out of expected year range 2025 - 2025');
    });

    it('opens the month and year menus', async () => {
      const {picker} = await setupTest();
      q(picker, '.date-picker-month-menu')!.click();
      await settle(picker);
      const list = q(picker, '[role="listbox"]')!;
      expect(list.getAttribute('aria-label')).toBe('Month');
      const options = qa(picker, '[role="option"]');
      expect(options.length).toBe(12);
      expect(options[7].getAttribute('aria-selected')).toBe('true');
      expect(picker.shadowRoot!.activeElement).toBe(options[7]);
      expect(q<HTMLButtonElement>(picker, '.date-picker-year-menu')!.disabled).toBeTrue();
      expect(q(picker, '.date-picker-actions')).toBeNull();

      options[2].click();
      await settle(picker);
      expect(q(picker, '[role="grid"]')!.getAttribute('aria-label')).toBe('March 2025');

      q(picker, '.date-picker-year-menu')!.click();
      await settle(picker);
      const years = qa(picker, '[role="option"]');
      expect(years.length).toBe(201);
      key(picker.shadowRoot!.activeElement!, 'ArrowDown');
      await settle(picker);
      key(picker.shadowRoot!.activeElement!, 'Enter');
      await settle(picker);
      expect(q(picker, '[role="grid"]')!.getAttribute('aria-label')).toBe('March 2026');
    });

    it('focuses the menus with Shift+M and Shift+Y', async () => {
      const {picker} = await setupTest();
      key(cell(picker, '2025-08-17'), 'M', {shiftKey: true});
      expect(picker.shadowRoot!.activeElement).toBe(q(picker, '.date-picker-month-menu'));
      key(cell(picker, '2025-08-17'), 'Y', {shiftKey: true});
      expect(picker.shadowRoot!.activeElement).toBe(q(picker, '.date-picker-year-menu'));
    });
  });

  describe('modal', () => {
    async function setupModal() {
      const result = await setupTest(html`<md-gb-date-picker
        variant="modal"
        quick
        locale="en-US"
        value="2025-08-17"></md-gb-date-picker>`);
      return result;
    }

    it('opens a modal dialog with the headline and focuses the date', async () => {
      const {picker} = await setupModal();
      await picker.show();
      await settle(picker);
      const dialog = q<HTMLDialogElement>(picker, 'dialog')!;
      expect(dialog.open).toBeTrue();
      expect(dialog.matches(':modal')).toBeTrue();
      expect(q(picker, '#title')!.textContent!.trim()).toBe('Select date');
      expect(dialog.getAttribute('aria-labelledby')).toBe('title');
      expect(q(picker, '.date-picker-headline')!.textContent!.trim()).toBe('Sun, Aug 17');
      expect(picker.shadowRoot!.activeElement).toBe(cell(picker, '2025-08-17'));
      expect(q(picker, '.date-picker-year-menu')!.textContent!.trim()).toBe('August 2025');
    });

    it('updates the headline with the pending date', async () => {
      const {picker} = await setupModal();
      await picker.show();
      await settle(picker);
      cell(picker, '2025-08-20').click();
      await settle(picker);
      expect(q(picker, '.date-picker-headline')!.textContent!.trim()).toBe('Wed, Aug 20');
      q(picker, '.date-picker-confirm')!.click();
      await settle(picker);
      expect(picker.value).toBe('2025-08-20');
      expect(picker.open).toBeFalse();
      expect(q<HTMLDialogElement>(picker, 'dialog')!.open).toBeFalse();
    });

    it('cancels from the native dialog cancel (Escape)', async () => {
      const {picker} = await setupModal();
      await picker.show();
      await settle(picker);
      const cancelSpy = jasmine.createSpy('cancel');
      picker.addEventListener('cancel', cancelSpy);
      q(picker, 'dialog')!.dispatchEvent(new Event('cancel', {cancelable: true}));
      await settle(picker);
      expect(cancelSpy).toHaveBeenCalledTimes(1);
      expect(picker.open).toBeFalse();
      expect(picker.value).toBe('2025-08-17');
    });

    it('keeps the dialog open when cancel is prevented', async () => {
      const {picker} = await setupModal();
      await picker.show();
      await settle(picker);
      picker.addEventListener('cancel', (event) => {
        event.preventDefault();
      });
      q(picker, '.date-picker-cancel')!.click();
      await settle(picker);
      expect(picker.open).toBeTrue();
      await picker.close();
    });

    it('shows a year grid from the month-year button', async () => {
      const {picker} = await setupModal();
      await picker.show();
      await settle(picker);
      q(picker, '.date-picker-year-menu')!.click();
      await settle(picker);
      const list = q(picker, '.date-picker-year-grid')!;
      expect(list.getAttribute('role')).toBe('listbox');
      const selected = q(picker, '[role="option"][aria-selected="true"]')!;
      expect(selected.textContent!.trim()).toBe('2025');
      expect(picker.shadowRoot!.activeElement).toBe(selected);
      // Three years per row.
      key(selected, 'ArrowDown');
      await settle(picker);
      expect(picker.shadowRoot!.activeElement!.textContent!.trim()).toBe('2028');
      key(picker.shadowRoot!.activeElement!, 'Enter');
      await settle(picker);
      expect(q(picker, '[role="grid"]')!.getAttribute('aria-label')).toBe('August 2028');
    });

    it('switches to the date input and validates it', async () => {
      const {picker} = await setupModal();
      await picker.show();
      await settle(picker);
      const toggle = q(picker, '.date-picker-mode-toggle')!;
      expect(toggle.getAttribute('aria-label')).toBe('Switch to text input mode');
      toggle.click();
      await settle(picker);
      expect(picker.mode).toBe('input');
      expect(q(picker, '[role="grid"]')).toBeNull();
      const field = q(picker, '.date-picker-inputs md-gb-text-field') as HTMLElement & {
        value: string;
        label: string;
        error: boolean;
        errorText: string;
      };
      expect(field.label).toBe('Date');
      expect(field.value).toBe('08/17/2025');
      expect(
        q(picker, '.date-picker-mode-toggle')!.getAttribute('aria-label'),
      ).toBe('Switch to calendar input mode');

      type(field, '9/1/2025');
      await settle(picker);
      expect(picker.pendingValue).toBe('2025-09-01');
      expect(q(picker, '.date-picker-headline')!.textContent!.trim()).toBe('Mon, Sep 1');

      type(field, '99/99/2025');
      await settle(picker);
      q(picker, '.date-picker-confirm')!.click();
      await settle(picker);
      expect(picker.open).toBeTrue();
      expect(field.error).toBeTrue();

      type(field, '9/2/2025');
      await settle(picker);
      q(picker, '.date-picker-confirm')!.click();
      await settle(picker);
      expect(picker.value).toBe('2025-09-02');
    });

    it('shows two fields for a range input', async () => {
      const {picker} = await setupTest(html`<md-gb-date-picker
        variant="modal"
        inline
        range
        mode="input"
        quick
        locale="en-US"
        value="2025-08-17/2025-08-23"></md-gb-date-picker>`);
      const fields = qa(picker, '.date-picker-inputs md-gb-text-field') as Array<
        HTMLElement & {label: string; value: string; errorText: string}
      >;
      expect(fields.map((f) => f.label)).toEqual(['Start date', 'End date']);
      expect(fields.map((f) => f.value)).toEqual(['08/17/2025', '08/23/2025']);
      expect(q(picker, '#title')!.textContent!.trim()).toBe('Enter dates');

      type(fields[1], '08/01/2025');
      change(fields[1]);
      await settle(picker);
      expect(fields[1].errorText).toBe('Invalid date range input');
    });
  });

  describe('form association', () => {
    it('submits the value under its name and resets', async () => {
      const {root, picker} = await setupTest(html`<form>
        <md-gb-date-picker
          name="date"
          inline
          quick
          locale="en-US"
          value="2025-08-17"></md-gb-date-picker>
      </form>`);
      const form = root.querySelector('form')!;
      expect(new FormData(form).get('date')).toBe('2025-08-17');
      picker.value = '2025-09-01';
      await settle(picker);
      expect(new FormData(form).get('date')).toBe('2025-09-01');
      form.reset();
      await settle(picker);
      expect(picker.value).toBe('2025-08-17');
    });

    it('submits a range as an ISO interval', async () => {
      const {root} = await setupTest(html`<form>
        <md-gb-date-picker
          name="trip"
          range
          inline
          quick
          value="2025-08-17/2025-08-23"></md-gb-date-picker>
      </form>`);
      expect(new FormData(root.querySelector('form')!).get('trip')).toBe(
        '2025-08-17/2025-08-23',
      );
    });
  });
});
