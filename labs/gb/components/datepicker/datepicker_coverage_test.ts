/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {emulateMedia} from '@web/test-runner-commands';
import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';

import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {until} from '../shared/test-dom.js';

import {DatePickerElement} from './date-picker-element.js';
import './md-gb-date-picker.js';

adoptStyles(document, [m3Styles]);

type ColorProp = 'color' | 'background-color' | 'border-top-color' | 'border-bottom-color';
const SCHEMES = ['light', 'dark'] as const;

/**
 * The first match of `selector` in the shadow tree of `root`, or in its
 * children when it has no shadow root.
 */
function part<T extends Element = HTMLElement>(root: Element, selector: string): T {
  const scope: ParentNode = root.shadowRoot ?? root;
  const el = scope.querySelector<T>(selector);
  if (!el) {
    throw new Error(`no element matches ${selector}`);
  }
  return el;
}

/** The computed `prop` of a probe with `value`, resolved where `el` is. */
function probeValue(el: Element, prop: ColorProp, value: string): string {
  const probe = document.createElement('span');
  probe.style.setProperty(prop, value);
  el.parentNode!.appendChild(probe);
  const resolved = getComputedStyle(probe).getPropertyValue(prop);
  probe.remove();
  return resolved;
}

/** Expects the computed `prop` of `el` to equal the color role `role`. */
async function expectColor(el: Element, prop: ColorProp, cssValue: string, what: string) {
  const value = () => probeValue(el, prop, cssValue);
  // Waits out color transitions (focus and scheme changes) before comparing.
  await until(() => getComputedStyle(el).getPropertyValue(prop) === value());
  expect(getComputedStyle(el).getPropertyValue(prop)).withContext(`${what}: ${prop} should be ${cssValue}`).toBe(value());
}

/** Expects the computed `prop` of `el` to equal the color role `role`. */
async function expectRole(el: Element, prop: ColorProp, role: string, what: string) {
  // Guards against a comparison of two unresolved values.
  expect(getComputedStyle(document.documentElement).getPropertyValue(`--md-sys-color-${role}`).trim())
    .withContext(`--md-sys-color-${role} is defined`)
    .not.toBe('');
  await expectColor(el, prop, `var(--md-sys-color-${role})`, what);
}

describe('docked date picker spec units', () => {
  const env = new Environment();

  /**
   * A docked picker open on a month that shows today. The selected date is
   * another day, so the today and selected cells are both visible.
   */
  async function openDocked() {
    const today = new Date();
    const day = today.getDate() === 1 ? 2 : 1;
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const value = `${today.getFullYear()}-${month}-${String(day).padStart(2, '0')}`;
    const root = env.render(html`<md-gb-date-picker
      variant="docked"
      quick
      locale="en-US"
      value=${value}
    ></md-gb-date-picker>`);
    await env.waitForStability();
    const picker = root.querySelector<DatePickerElement>('md-gb-date-picker')!;
    await picker.updateComplete;
    await picker.show();
    await until(() => picker.shadowRoot?.querySelector('[role="grid"]'));
    await env.waitForStability();
    return picker;
  }

  /** Opens the month list through the Month menu button. */
  async function openMonths(picker: DatePickerElement) {
    part(picker, '.date-picker-month-menu').click();
    await until(() => picker.shadowRoot?.querySelector('.date-picker-month-list'));
    await env.waitForStability();
  }

  /** Focuses the text field input, which draws the focused outline. */
  async function focusField(picker: DatePickerElement) {
    const input = part(part(picker, 'md-gb-text-field'), 'input');
    input.focus();
    expect(await until(() => input.matches(':focus'))).withContext('text field input takes focus').toBeTrue();
    await env.waitForStability();
  }

  /** Runs `check` in light and in dark, so both color schemes hold. */
  async function inEachScheme(check: () => void | Promise<void>) {
    try {
      for (const scheme of SCHEMES) {
        await emulateMedia({colorScheme: scheme});
        await check();
      }
    } finally {
      await emulateMedia({colorScheme: 'light'});
    }
  }

  // spec: date-pickers-31c40f
  it('shows the month menu button pressed while the month list is open', async () => {
    const picker = await openDocked();
    const month = part<HTMLButtonElement>(picker, '.date-picker-month-menu');
    expect(month.getAttribute('aria-expanded')).toBe('false');
    await openMonths(picker);
    expect(month.getAttribute('aria-expanded')).toBe('true');
    expect(month.disabled).toBeFalse();
    const icon = part(month, '.date-picker-menu-button-icon');
    expect(icon.classList.contains('date-picker-menu-button-icon-expanded')).toBeTrue();
    expect(getComputedStyle(icon).rotate).toBe('180deg');
  });

  // spec: date-pickers-e102e2
  it('disables the year menu button while the month list is open', async () => {
    const picker = await openDocked();
    await openMonths(picker);
    const year = part<HTMLButtonElement>(picker, '.date-picker-year-menu');
    expect(year.disabled).toBeTrue();
    expect(year.getAttribute('aria-expanded')).toBe('false');
  });

  // spec: date-pickers-a6ad1b
  it('draws the disabled year menu label and icon on surface at 38%', async () => {
    const picker = await openDocked();
    await openMonths(picker);
    const year = part(picker, '.date-picker-year-menu');
    const disabled = 'hsl(from var(--md-sys-color-on-surface) h s l / 38%)';
    await inEachScheme(async () => {
      await expectColor(part(year, '.date-picker-menu-button-label'), 'color', disabled, 'disabled year label');
      await expectColor(part(year, '.date-picker-menu-button-icon'), 'color', disabled, 'disabled year icon');
    });
  });

  // spec: date-pickers-6a1a20, date-pickers-4e3281
  it('colors the outlined text field primary, in light and dark', async () => {
    const picker = await openDocked();
    await focusField(picker);
    const outline = part(part(picker, 'md-gb-text-field'), '.text-field-outline-start');
    await inEachScheme(() => expectRole(outline, 'border-top-color', 'primary', 'focused field outline'));
  });

  // spec: date-pickers-f61ed1
  it('colors the month menu label on surface variant', async () => {
    const picker = await openDocked();
    const label = part(part(picker, '.date-picker-month-menu'), '.date-picker-menu-button-label');
    await inEachScheme(() => expectRole(label, 'color', 'on-surface-variant', 'month menu label'));
  });

  // spec: date-pickers-9d3b82
  it('colors the next year icon button on surface variant', async () => {
    const picker = await openDocked();
    const next = part(picker, '.date-picker-next-year');
    await inEachScheme(() => expectRole(next, 'color', 'on-surface-variant', 'next year icon'));
  });

  // spec: date-pickers-fd797e
  it('colors the weekday labels on surface', async () => {
    const picker = await openDocked();
    const weekday = part(picker, '.date-picker-weekday');
    await inEachScheme(() => expectRole(weekday, 'color', 'on-surface', 'weekday label'));
  });

  // spec: date-pickers-47fff2
  it('colors an unselected date on surface', async () => {
    const picker = await openDocked();
    const day = part(
      picker,
      '.date-picker-day:not(.date-picker-day-selected):not(.date-picker-day-today):not(.date-picker-day-outside)',
    );
    await inEachScheme(() => expectRole(day, 'color', 'on-surface', 'unselected date'));
  });

  // spec: date-pickers-dba9ef
  it("colors today's date label primary", async () => {
    const picker = await openDocked();
    const today = part(picker, '.date-picker-day-today');
    await inEachScheme(() => expectRole(today, 'color', 'primary', "today's date label"));
  });

  // spec: date-pickers-44f091
  it('colors the text buttons primary', async () => {
    const picker = await openDocked();
    const confirm = part(picker, '.date-picker-confirm');
    await inEachScheme(() => expectRole(confirm, 'color', 'primary', 'text button'));
  });

  // spec: date-pickers-1ecb8c
  it('colors the docked date picker container surface container high', async () => {
    const picker = await openDocked();
    const container = part(picker, '.date-picker');
    await inEachScheme(() =>
      expectRole(container, 'background-color', 'surface-container-high', 'container'),
    );
  });

  // spec: date-pickers-d554b4
  it('colors the selected date container primary', async () => {
    const picker = await openDocked();
    const selected = part(picker, '.date-picker-day-selected');
    await inEachScheme(() => expectRole(selected, 'background-color', 'primary', 'selected date container'));
  });

  // spec: date-pickers-d437e3
  it('colors the selected date label on primary', async () => {
    const picker = await openDocked();
    const selected = part(picker, '.date-picker-day-selected');
    await inEachScheme(() => expectRole(selected, 'color', 'on-primary', 'selected date label'));
  });

  // spec: date-pickers-58eeec, date-pickers-577dc4
  it('colors the open month menu text field primary, in light and dark', async () => {
    const picker = await openDocked();
    await openMonths(picker);
    await focusField(picker);
    const outline = part(part(picker, 'md-gb-text-field'), '.text-field-outline-start');
    await inEachScheme(() => expectRole(outline, 'border-top-color', 'primary', 'menu field outline'));
  });

  // spec: date-pickers-ef720a
  it('colors the pressed month menu label on surface variant', async () => {
    const picker = await openDocked();
    await openMonths(picker);
    const label = part(part(picker, '.date-picker-month-menu'), '.date-picker-menu-button-label');
    await inEachScheme(() => expectRole(label, 'color', 'on-surface-variant', 'pressed month label'));
  });

  // spec: date-pickers-6540cb
  it('colors the menu divider outline variant', async () => {
    const picker = await openDocked();
    await openMonths(picker);
    const divider = part(picker, '.date-picker-divider');
    await inEachScheme(() => expectRole(divider, 'border-bottom-color', 'outline-variant', 'menu divider'));
  });

  // spec: date-pickers-6173d0
  it('colors the open month menu surface surface container high', async () => {
    const picker = await openDocked();
    await openMonths(picker);
    const container = part(picker, '.date-picker');
    await inEachScheme(() =>
      expectRole(container, 'background-color', 'surface-container-high', 'menu surface'),
    );
  });

  // spec: date-pickers-19b323
  it('colors an unselected menu item label on surface', async () => {
    const picker = await openDocked();
    await openMonths(picker);
    const item = part(
      picker,
      '.date-picker-list-item:not([aria-selected="true"]) .date-picker-list-item-label',
    );
    await inEachScheme(() => expectRole(item, 'color', 'on-surface', 'unselected menu item'));
  });
});
