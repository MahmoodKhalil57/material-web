/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';

import {DatePickerElement} from './date-picker-element.js';
import './md-gb-date-picker.js';

adoptStyles(document, [m3Styles]);

function q<T extends Element = HTMLElement>(
  el: DatePickerElement,
  selector: string,
) {
  return el.shadowRoot!.querySelector<T>(selector);
}

function rgbOf(color: string) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  const context = canvas.getContext('2d', {willReadFrequently: true})!;
  context.fillStyle = '#000';
  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);
  return [...context.getImageData(0, 0, 1, 1).data].slice(0, 3);
}

function luminance(rgb: number[]) {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(rgbOf(a)), luminance(rgbOf(b))].sort(
    (x, y) => y - x,
  );
  return (hi + 0.05) / (lo + 0.05);
}

describe('date picker accessibility', () => {
  const env = new Environment();

  async function setup(variant = 'docked', extra = '') {
    const root = env.render(html`<div style="padding: 24px">
      <md-gb-date-picker
        variant=${variant}
        quick
        locale="en-US"
        value="2025-08-17"
        .isDateDisabled=${(d: {day: number}) => d.day === 20}
      ></md-gb-date-picker>
    </div>`);
    void extra;
    await env.waitForStability();
    const picker = root.querySelector('md-gb-date-picker')!;
    await picker.updateComplete;
    return picker;
  }

  async function settle(picker: DatePickerElement) {
    await picker.updateComplete;
    await env.waitForStability();
    await picker.updateComplete;
  }

  const tooltipOf = (picker: DatePickerElement, anchor: string) =>
    q<HTMLElement>(picker, `md-gb-tooltip[for="${anchor}"]`)!;
  const isOpen = (tip: HTMLElement) => tip.matches(':popover-open');

  afterEach(() => {
    document.querySelectorAll('md-gb-date-picker').forEach((picker) => {
      picker.shadowRoot
        ?.querySelectorAll('md-gb-tooltip')
        .forEach((tip) => tip.hide());
    });
  });

  // spec: date-pickers-d95825
  it('opens the calendar from the calendar icon only, not from the text field', async () => {
    const picker = await setup();
    const input = q(picker, 'md-gb-text-field')!.shadowRoot!.querySelector(
      'input',
    )!;
    input.focus();
    input.click();
    await settle(picker);
    expect(picker.open).toBeFalse();
    q(picker, '.date-picker-calendar-button')!.click();
    await settle(picker);
    expect(picker.open).toBeTrue();
    await picker.close();
  });

  // spec: date-pickers-eb8a78
  it('shows the shortcut key in a tooltip when a calendar button takes focus', async () => {
    const picker = await setup();
    await picker.show();
    await settle(picker);
    const next = q(picker, '.date-picker-next-month')!;
    const tip = tooltipOf(picker, next.id);
    expect(isOpen(tip)).toBeFalse();
    next.focus();
    jasmine.clock().tick(1000);
    expect(isOpen(tip)).toBeTrue();
    expect(tip.textContent).toContain('Page Down');
    expect(next.getAttribute('aria-keyshortcuts')).toBe('PageDown');
    await picker.close();
  });

  // spec: date-pickers-56d951, date-pickers-f26e2c
  it('shows weekday tooltips with the full name on pointer hover only', async () => {
    const picker = await setup();
    await picker.show();
    await settle(picker);
    const weekday = q(picker, '.date-picker-weekday')!;
    // Days of the week are not keyboard navigable...
    expect(weekday.hasAttribute('tabindex')).toBeFalse();
    expect(weekday.matches('button, a, input, [tabindex]')).toBeFalse();
    // ...but a pointer hover shows the full name that the narrow label cuts.
    const tip = tooltipOf(picker, weekday.id);
    expect(weekday.textContent!.trim().length).toBe(1);
    weekday.dispatchEvent(
      new PointerEvent('pointerenter', {pointerType: 'mouse', composed: true}),
    );
    jasmine.clock().tick(1000);
    expect(isOpen(tip)).toBeTrue();
    expect(tip.textContent!.trim().length).toBeGreaterThan(1);
    await picker.close();
  });

  // spec: date-pickers-bb13f5, date-pickers-770efd
  it('gives every interactive element a target of at least 48 by 48dp', async () => {
    const picker = await setup();
    await picker.show();
    await settle(picker);
    const targets = [
      ...picker.shadowRoot!.querySelectorAll<HTMLElement>(
        'button, [role="gridcell"][tabindex]',
      ),
    ].filter((el) => el.getBoundingClientRect().width > 0);
    expect(targets.length).toBeGreaterThan(5);
    const small: string[] = [];
    for (const el of targets) {
      const box = el.getBoundingClientRect();
      // The touch target is the element's box or the `::before` that
      // extends it.
      const before = getComputedStyle(el, '::before');
      const width = Math.max(box.width, parseFloat(before.width) || 0);
      const height = Math.max(box.height, parseFloat(before.height) || 0);
      if (width < 48 || height < 48) {
        small.push(`${el.className} ${width}x${height}`);
      }
    }
    expect(small).toEqual([]);
    await picker.close();
  });

  // spec: date-pickers-23b0a1, date-pickers-806b87
  it('keeps date text at a contrast of 4.5:1 or more with its background', async () => {
    const picker = await setup();
    await picker.show();
    await settle(picker);
    const dayOf = (selector: string) => q(picker, selector)!;
    const surface = getComputedStyle(
      q(picker, '[role="grid"]')!.closest('.date-picker-surface, .date-picker') ||
        picker,
    ).backgroundColor;
    const probe = document.createElement('div');
    probe.style.color = 'var(--md-sys-color-surface-container-high)';
    document.body.append(probe);
    const container = getComputedStyle(probe).color;
    probe.remove();
    void surface;
    const days = [
      dayOf('[data-date="2025-08-10"] > span'),
      dayOf('[data-date="2025-08-17"] > span'),
    ];
    for (const day of days) {
      const style = getComputedStyle(day);
      const background =
        style.backgroundColor === 'rgba(0, 0, 0, 0)'
          ? container
          : style.backgroundColor;
      expect(contrast(style.color, background))
        .withContext(day.textContent!)
        .toBeGreaterThanOrEqual(4.5);
    }
    const today = q(picker, '[aria-current="date"] > span');
    if (today) {
      const style = getComputedStyle(today);
      expect(contrast(style.color, container)).toBeGreaterThanOrEqual(4.5);
    }
    await picker.close();
  });

  // spec: date-pickers-9e536a
  it('describes the text field with the date format as its helper text', async () => {
    const picker = await setup();
    const field = q(picker, 'md-gb-text-field')!;
    const input = field.shadowRoot!.querySelector('input')!;
    expect(field.getAttribute('supporting-text')).toBe('MM/DD/YYYY');
    expect(input.getAttribute('placeholder')).toBe('MM/DD/YYYY');
    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const description = field.shadowRoot!.getElementById(
      describedBy!.split(' ')[0],
    );
    expect(description?.textContent).toContain('MM/DD/YYYY');
  });
});
