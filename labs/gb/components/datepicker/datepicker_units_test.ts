/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';

import {DatePickerElement} from './date-picker-element.js';
import './md-gb-date-picker.js';

function q<T extends Element = HTMLElement>(el: DatePickerElement, selector: string) {
  return el.shadowRoot!.querySelector<T>(selector);
}

describe('date picker spec units', () => {
  const env = new Environment();

  async function setup(attrs: {variant?: string; clearable?: boolean} = {}) {
    const root = env.render(html`<md-gb-date-picker
      variant=${attrs.variant ?? 'docked'}
      ?clearable=${attrs.clearable}
      quick
      locale="en-US"
      value="2025-08-17"
    ></md-gb-date-picker>`);
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

  // spec: date-pickers-37dbeb, date-pickers-135584
  it('dismisses a modal date picker when the scrim outside it is clicked', async () => {
    const picker = await setup({variant: 'modal'});
    await picker.show();
    await settle(picker);
    const dialog = q<HTMLDialogElement>(picker, 'dialog')!;
    const init = {bubbles: true, composed: true, clientX: 1, clientY: 1};
    dialog.dispatchEvent(new PointerEvent('pointerdown', init));
    dialog.dispatchEvent(new MouseEvent('click', init));
    await settle(picker);
    expect(picker.open).toBeFalse();
  });

  // spec: date-pickers-90d0e9
  it('does not add slashes while the user is typing', async () => {
    const picker = await setup();
    const field = q(picker, 'md-gb-text-field')!;
    const input = field.shadowRoot!.querySelector('input')!;
    input.value = '1208';
    input.dispatchEvent(new InputEvent('input', {bubbles: true, composed: true}));
    await settle(picker);
    expect(input.value).toBe('1208');
  });

  // spec: date-pickers-c2b955, date-pickers-3b8d7e
  it('has no Clear button unless clearable, to keep tab stops down', async () => {
    const plain = await setup({variant: 'modal'});
    await plain.show();
    await settle(plain);
    expect(q(plain, '.date-picker-clear')).toBeNull();
    await plain.close();
    const clearable = await setup({variant: 'modal', clearable: true});
    await clearable.show();
    await settle(clearable);
    expect(q(clearable, '.date-picker-clear')).not.toBeNull();
    await clearable.close();
  });

  // spec: date-pickers-80d0ae, date-pickers-c49e3f
  it('docked picker offers the text field and the calendar together', async () => {
    const picker = await setup();
    await picker.show();
    await settle(picker);
    expect(q(picker, 'md-gb-text-field')).not.toBeNull();
    expect(q(picker, '[role="grid"]')).not.toBeNull();
  });

  // spec: date-pickers-c6bb51
  it('docked year selection menu replaces the calendar view', async () => {
    const picker = await setup();
    await picker.show();
    await settle(picker);
    q(picker, '.date-picker-year-menu')!.click();
    await settle(picker);
    expect(q(picker, '[role="listbox"]')).not.toBeNull();
    expect(q(picker, '[role="grid"]')).toBeNull();
  });

  // spec: date-pickers-f5ee03, date-pickers-2406ad
  it('drops the calendar down from a text field in the docked variant', async () => {
    const picker = await setup();
    await picker.show();
    await settle(picker);
    const field = q(picker, 'md-gb-text-field')!.getBoundingClientRect();
    const grid = q(picker, '[role="grid"]')!.getBoundingClientRect();
    expect(grid.width).toBeGreaterThan(0);
    expect(grid.top).toBeGreaterThanOrEqual(field.bottom - 1);
    expect(q(picker, 'dialog')).toBeNull();
    await picker.close();
  });

  // spec: date-pickers-f8da71
  it('shows the calendar in a modal dialog in the modal variant', async () => {
    const picker = await setup({variant: 'modal'});
    await picker.show();
    await settle(picker);
    const dialog = q<HTMLDialogElement>(picker, 'dialog')!;
    expect(dialog.open).toBeTrue();
    expect(dialog.matches(':modal')).toBeTrue();
    expect(q(picker, '[role="grid"]')).not.toBeNull();
    await picker.close();
  });

  // spec: date-pickers-09fe5e
  it('offers a docked date picker, a modal date picker and a modal date input', async () => {
    const docked = await setup({variant: 'docked'});
    await docked.show();
    await settle(docked);
    expect(q(docked, 'dialog')).toBeNull();
    expect(q(docked, 'md-gb-text-field')).not.toBeNull();
    await docked.close();

    const modal = await setup({variant: 'modal'});
    await modal.show();
    await settle(modal);
    expect(q<HTMLDialogElement>(modal, 'dialog')!.open).toBeTrue();
    expect(q(modal, '[role="grid"]')).not.toBeNull();
    await modal.close();

    const root = env.render(html`<md-gb-date-picker
      variant="modal"
      mode="input"
      quick
      locale="en-US"
      value="2025-08-17"
    ></md-gb-date-picker>`);
    await env.waitForStability();
    const input = root.querySelector('md-gb-date-picker')!;
    await input.show();
    await settle(input);
    expect(q<HTMLDialogElement>(input, 'dialog')!.open).toBeTrue();
    expect(q(input, 'md-gb-text-field')).not.toBeNull();
    expect(q(input, '[role="grid"]')).toBeNull();
    await input.close();
  });
});
