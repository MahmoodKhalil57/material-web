/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {setViewport} from '@web/test-runner-commands';
import {html} from 'lit';
import {Environment} from '../../testing/environment.js';

import './md-gb-time-picker.js';
import {type TimePickerElement} from './time-picker-element.js';

function q<T extends Element = HTMLElement>(el: TimePickerElement, selector: string) {
  return el.shadowRoot!.querySelector<T>(selector)!;
}

describe('time picker spec units', () => {
  const env = new Environment();

  async function setup(attrs: {modal?: boolean; mode?: string} = {}) {
    const root = env.render(html`<md-gb-time-picker
      ?modal=${attrs.modal}
      mode=${attrs.mode ?? 'dial'}
      value="14:30"
      hour-cycle="12"
      quick
    ></md-gb-time-picker>`);
    await env.waitForStability();
    return root.querySelector('md-gb-time-picker')!;
  }

  // spec: time-pickers-7b8acb
  it('dismisses a modal time picker when the scrim is clicked', async () => {
    const picker = await setup({modal: true});
    await picker.show();
    await env.waitForStability();
    const dialog = q<HTMLDialogElement>(picker, 'dialog');
    const init = {bubbles: true, composed: true, clientX: 1, clientY: 1};
    dialog.dispatchEvent(new PointerEvent('pointerdown', init));
    dialog.dispatchEvent(new MouseEvent('click', init));
    await env.waitForStability();
    await picker.updateComplete;
    expect(dialog.open).toBeFalse();
    expect(picker.value).toBe('14:30');
  });

  // spec: time-pickers-604fc2, time-pickers-7522b5
  it('gives dial selector targets 48x48dp', async () => {
    const picker = await setup();
    const label = q(picker, '.time-picker-dial-label');
    const rect = label.getBoundingClientRect();
    expect(rect.width).toBe(48);
    expect(rect.height).toBe(48);
  });

  // spec: time-pickers-959dfe, time-pickers-21ddc7
  it('dial follows manually entered values', async () => {
    const picker = await setup({mode: 'input'});
    const hour = q<HTMLInputElement>(picker, 'input[data-selection="hour"]');
    hour.value = '09';
    hour.dispatchEvent(new InputEvent('input', {bubbles: true}));
    await env.waitForStability();
    q(picker, '.time-picker-mode-toggle').click();
    await env.waitForStability();
    q(picker, '[data-selection="hour"]').click();
    await env.waitForStability();
    expect(q(picker, '.time-picker-dial').getAttribute('aria-valuenow')).toBe('9');
  });

  // spec: time-pickers-e931de, time-pickers-fe9ec4, time-pickers-c19eb5
  it('switches to the horizontal layout when the viewport height is limited', async () => {
    await setViewport({width: 900, height: 400});
    try {
      const picker = await setup();
      expect(picker.effectiveOrientation).toBe('horizontal');
    } finally {
      await setViewport({width: 800, height: 600});
    }
    await setViewport({width: 800, height: 900});
    try {
      const picker = await setup();
      expect(picker.effectiveOrientation).toBe('vertical');
    } finally {
      await setViewport({width: 800, height: 600});
    }
  });

  // spec: time-pickers-79857b, time-pickers-eff744, time-pickers-84c14a, time-pickers-014b04
  it('falls back to the input picker and fits a 400px-high viewport', async () => {
    await setViewport({width: 900, height: 400});
    try {
      const picker = await setup();
      expect(picker.mode).toBe('input');
      const rect = q(picker, '.time-picker').getBoundingClientRect();
      expect(rect.height).toBeLessThanOrEqual(window.innerHeight);
    } finally {
      await setViewport({width: 800, height: 600});
    }
  });
});
