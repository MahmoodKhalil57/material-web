/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

// The Escape behavior under test (installs its document listener).
import '../focus-reset.js';
import {sendKeys} from '@web/test-runner-commands';

import {deepActiveElement, focusRingsOf, prop, renderSubject, SUBJECTS, until} from './subjects.js';

// foundations/interaction/inputs.md > Physical keyboard > Escape key.

const subject = (id: string) => SUBJECTS.find((s) => s.id === id)!;

describe('Escape key', () => {
  afterEach(() => (document.activeElement as HTMLElement | null)?.blur());

  // spec: interaction-inputs-0d5dc6
  it('removes the visible keyboard focus indicator and resets the focus order on Escape', async () => {
    const {el, cleanup} = await renderSubject(subject('button-filled'));
    await sendKeys({press: 'Shift'});
    el.focus();
    const shown = () => focusRingsOf(el).filter((r) => prop(r, '--focus-ring-outline') !== 'none').length;
    await until(() => shown() > 0);
    expect(shown()).toBeGreaterThan(0);
    await sendKeys({press: 'Escape'});
    await until(() => shown() === 0);
    expect(shown()).toBe(0);
    expect(deepActiveElement()).not.toBe(el.shadowRoot?.activeElement ?? el);
    cleanup();
  });

  // spec: interaction-inputs-0d5dc6
  it('starts the focus order over: Tab after Escape reaches the first focusable element', async () => {
    const container = document.createElement('div');
    container.innerHTML = '<button id="a">A</button><button id="b">B</button><button id="c">C</button>';
    document.body.prepend(container);
    const [a, b] = Array.from(container.querySelectorAll('button'));
    await sendKeys({press: 'Shift'});
    b.focus();
    await sendKeys({press: 'Escape'});
    expect(await until(() => document.activeElement !== b)).withContext('Escape leaves B').toBeTrue();
    await sendKeys({press: 'Tab'});
    const first = document.querySelector<HTMLElement>('a[href], button, input, [tabindex]:not([tabindex="-1"])')!;
    expect(document.activeElement).toBe(first);
    expect(first).toBe(a);
    container.remove();
  });

  // spec: interaction-inputs-e456f0
  it('removes the text cursor on Escape while typing, but keeps the typed text', async () => {
    const {el, cleanup} = await renderSubject(subject('text-field-filled'));
    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
    input.focus();
    await sendKeys({type: 'hello'});
    expect(input.value).toBe('hello');
    await sendKeys({press: 'Escape'});
    await until(() => el.shadowRoot!.activeElement !== input);
    expect(input.value).toBe('hello');
    expect(el.shadowRoot!.activeElement).not.toBe(input);
    cleanup();
  });

  it('leaves Escape alone when a handler already used it', async () => {
    const {el, cleanup} = await renderSubject(subject('button-filled'));
    el.focus();
    const stop = (e: KeyboardEvent) => e.key === 'Escape' && e.preventDefault();
    el.addEventListener('keydown', stop);
    await sendKeys({press: 'Escape'});
    // Nothing to wait for: give a (wrong) reset the time to happen.
    await until(() => deepActiveElement() !== (el.shadowRoot?.activeElement ?? el), {timeout: 100});
    expect(deepActiveElement()).toBe(el.shadowRoot?.activeElement ?? el);
    el.removeEventListener('keydown', stop);
    cleanup();
  });
});
