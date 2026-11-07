/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {sendKeys} from '@web/test-runner-commands';

import {deepActiveElement, focusRingsOf, prop, renderSubject, sleep, SUBJECTS} from './subjects.js';

// Gap checks for foundations/interaction/inputs.md > Physical keyboard >
// Escape key. Run with `npm run gb:check -- --gaps ...`.

const subject = (id: string) => SUBJECTS.find((s) => s.id === id)!;

describe('Escape key (central gaps)', () => {
  afterEach(() => (document.activeElement as HTMLElement | null)?.blur());

  // spec: interaction-inputs-0d5dc6
  it('removes the visible keyboard focus indicator and resets the focus order on Escape', async () => {
    const {el, cleanup} = await renderSubject(subject('button-filled'));
    await sendKeys({press: 'Shift'});
    el.focus();
    await sleep(60);
    const shown = () => focusRingsOf(el).filter((r) => prop(r, '--focus-ring-outline') !== 'none').length;
    expect(shown()).toBeGreaterThan(0);
    await sendKeys({press: 'Escape'});
    await sleep(60);
    expect(shown()).toBe(0);
    expect(deepActiveElement()).not.toBe(el.shadowRoot?.activeElement ?? el);
    cleanup();
  });

  // spec: interaction-inputs-e456f0
  it('removes the text cursor on Escape while typing, but keeps the typed text', async () => {
    const {el, cleanup} = await renderSubject(subject('text-field-filled'));
    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
    input.focus();
    await sendKeys({type: 'hello'});
    expect(input.value).toBe('hello');
    await sendKeys({press: 'Escape'});
    await sleep(60);
    expect(input.value).toBe('hello');
    expect(el.shadowRoot!.activeElement).not.toBe(input);
    cleanup();
  });
});
