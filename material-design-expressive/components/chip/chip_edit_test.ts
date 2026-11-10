/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Tests for editable input chips and the remove-only chip.

// import 'jasmine'; (google3-only)

import {sendKeys} from '@web/test-runner-commands';
import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {ChipElement} from './chip-element.js';
import './md-gb-chip.js';

adoptStyles(document, [m3Styles]);

// Environment mocks requestAnimationFrame; poll with the real one.
const realRaf = window.requestAnimationFrame.bind(window);
async function until(check: () => unknown, timeout = 1000) {
  const end = performance.now() + timeout;
  while (!check()) {
    if (performance.now() >= end) return false;
    await new Promise((resolve) => realRaf(resolve));
  }
  return true;
}

describe('md-gb-chip editing', () => {
  const env = new Environment();

  async function setup(template: ReturnType<typeof html>) {
    const root = env.render(template);
    await env.waitForStability();
    const el = root.querySelector('md-gb-chip') as ChipElement;
    await el.updateComplete;
    const field = () =>
      el.shadowRoot!.querySelector<HTMLInputElement>('.chip-edit');
    const action = () =>
      el.shadowRoot!.querySelector<HTMLElement>('button.chip-action, button.chip')!;
    return {el, field, action};
  }

  const chip = () =>
    html`<md-gb-chip type="input" editable removable>ann@example.com</md-gb-chip>`;

  // spec: chips-0a0548
  it('is selected by the first interaction and edited by a second one', async () => {
    const {el, field, action} = await setup(chip());
    action().click();
    await el.updateComplete;
    expect(el.selected).toBeTrue();
    expect(field()).toBeNull();
    action().click();
    await until(() => field());
    expect(field()).not.toBeNull();
  });

  // spec: chips-0a0548
  it('starts editing with Enter on the selected chip', async () => {
    const {el, field, action} = await setup(chip());
    el.selected = true;
    await el.updateComplete;
    action().focus();
    await sendKeys({press: 'Enter'});
    await until(() => field());
    expect(field()).not.toBeNull();
  });

  // spec: chips-0a0548
  it('starts editing on a double click', async () => {
    const {field, action} = await setup(chip());
    action().dispatchEvent(new MouseEvent('dblclick', {bubbles: true, composed: true}));
    await until(() => field());
    expect(field()).not.toBeNull();
  });

  // spec: chips-d82288, chips-a899e6
  it('does not edit unless it is editable', async () => {
    const {el, field, action} = await setup(
      html`<md-gb-chip type="input">ann@example.com</md-gb-chip>`,
    );
    el.selected = true;
    action().click();
    action().dispatchEvent(new MouseEvent('dblclick', {bubbles: true, composed: true}));
    await el.updateComplete;
    expect(field()).toBeNull();
  });

  // spec: chips-d14ce6
  it('turns back into a text string in edit mode, with the chip text selected', async () => {
    const {el, field} = await setup(chip());
    el.startEdit();
    await until(() => field());
    const input = field()!;
    expect(input.type).toBe('text');
    expect(input.value).toBe('ann@example.com');
    await until(() => el.shadowRoot!.activeElement === input);
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(input.value.length);
  });

  // spec: chips-d82288, chips-a899e6
  it('commits the corrected text with Enter and fires edit', async () => {
    const {el, field, action} = await setup(chip());
    const edit = jasmine.createSpy('edit');
    el.addEventListener('edit', edit);
    el.startEdit();
    expect(await until(() => field())).toBeTrue();
    expect(await until(() => el.shadowRoot!.activeElement === field())).toBeTrue();
    await sendKeys({type: 'bob@example.com'});
    await sendKeys({press: 'Enter'});
    await until(() => !field());
    expect(field()).toBeNull();
    expect(el.textContent!.trim()).toBe('bob@example.com');
    expect(el.value).toBe('bob@example.com');
    expect(edit).toHaveBeenCalledTimes(1);
    expect((edit.calls.mostRecent().args[0] as CustomEvent).detail).toEqual({
      value: 'bob@example.com',
      previousValue: 'ann@example.com',
    });
    // Focus returns to the chip.
    await until(() => el.shadowRoot!.activeElement === action());
    expect(el.shadowRoot!.activeElement).toBe(action());
  });

  // spec: chips-d82288
  it('commits when focus leaves the field', async () => {
    const {el, field} = await setup(chip());
    el.startEdit();
    expect(await until(() => field())).toBeTrue();
    expect(await until(() => el.shadowRoot!.activeElement === field())).toBeTrue();
    await sendKeys({type: 'x'});
    field()!.blur();
    await until(() => !field());
    expect(el.textContent!.trim()).toBe('x');
  });

  // spec: chips-d82288
  it('cancels with Escape and keeps the old text', async () => {
    const {el, field} = await setup(chip());
    const edit = jasmine.createSpy('edit');
    el.addEventListener('edit', edit);
    el.startEdit();
    expect(await until(() => field())).toBeTrue();
    expect(await until(() => el.shadowRoot!.activeElement === field())).toBeTrue();
    await sendKeys({type: 'zzz'});
    await sendKeys({press: 'Escape'});
    await until(() => !field());
    expect(el.textContent!.trim()).toBe('ann@example.com');
    expect(edit).not.toHaveBeenCalled();
  });

  it('keeps Backspace in the field instead of removing the chip', async () => {
    const {el, field} = await setup(chip());
    const remove = jasmine.createSpy('remove');
    el.addEventListener('remove', remove);
    el.startEdit();
    expect(await until(() => field())).toBeTrue();
    expect(await until(() => el.shadowRoot!.activeElement === field())).toBeTrue();
    await sendKeys({press: 'Backspace'});
    expect(remove).not.toHaveBeenCalled();
  });
});

describe('md-gb-chip with only a remove icon', () => {
  const env = new Environment();

  // spec: chips-5012fa
  it('is one focusable element, the remove button', async () => {
    const root = env.render(html`<md-gb-chip type="input" removable></md-gb-chip>`);
    await env.waitForStability();
    const el = root.querySelector('md-gb-chip') as ChipElement;
    await el.updateComplete;
    const focusable = el.shadowRoot!.querySelectorAll(
      'button, a[href], input, [tabindex]:not([tabindex="-1"])',
    );
    expect(focusable.length).toBe(1);
    const remove = jasmine.createSpy('remove');
    el.addEventListener('remove', remove);
    (focusable[0] as HTMLElement).click();
    expect(remove).toHaveBeenCalledTimes(1);
    expect(focusable[0].getAttribute('aria-label')).toBeTruthy();
  });

  it('keeps separate actions once the chip has a label', async () => {
    const root = env.render(
      html`<md-gb-chip type="input" removable>Hiking</md-gb-chip>`,
    );
    await env.waitForStability();
    const el = root.querySelector('md-gb-chip') as ChipElement;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll('button').length).toBe(2);
  });
});
