/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-switch.js';

import {sendMouse} from '@web/test-runner-commands';
import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {type SwitchElement} from './switch-element.js';

adoptStyles(document, [m3Styles]);

describe('<md-gb-switch> with a text label', () => {
  const env = new Environment();

  // spec: switch-951524, switch-dc34f9
  it('takes its accessibility label from the adjacent text label', async () => {
    const root = env.render(html`
      <label>
        <md-gb-switch><span slot="on-icon">on</span></md-gb-switch>
        Wi-Fi
      </label>
      <md-gb-switch id="other"></md-gb-switch>
      <label for="other">Bluetooth</label>
    `);
    await env.waitForStability();
    const [wrapped, other] = [...root.querySelectorAll<SwitchElement>('md-gb-switch')];
    const nameOf = (s: SwitchElement) =>
      s.shadowRoot!.querySelector('button')!.getAttribute('aria-label');
    // The label's own text only, not the switch's slotted icons.
    expect(nameOf(wrapped)).toBe('Wi-Fi');
    expect(nameOf(other)).toBe('Bluetooth');
  });

  it('keeps an explicit aria-label over the label text', async () => {
    const root = env.render(html`
      <label><md-gb-switch aria-label="Radio"></md-gb-switch> Wi-Fi</label>
    `);
    await env.waitForStability();
    const el = root.querySelector('md-gb-switch') as SwitchElement;
    expect(el.shadowRoot!.querySelector('button')!.getAttribute('aria-label')).toBe('Radio');
  });

  it('is toggled by selecting its text label', async () => {
    const root = env.render(html`
      <label><md-gb-switch></md-gb-switch> <span>Wi-Fi</span></label>
    `);
    await env.waitForStability();
    const el = root.querySelector('md-gb-switch') as SwitchElement;
    root.querySelector<HTMLElement>('span')!.click();
    await env.waitForStability();
    expect(el.selected).toBeTrue();
    el.shadowRoot!.querySelector('button')!.click();
    await env.waitForStability();
    expect(el.selected).toBeFalse();
  });
});

describe('<md-gb-switch> dragging', () => {
  const env = new Environment();

  async function drag(el: SwitchElement, from: number, to: number) {
    const r = el.getBoundingClientRect();
    const y = Math.round(r.y + r.height / 2);
    await sendMouse({type: 'move', position: [Math.round(r.x + from), y]});
    await sendMouse({type: 'down'});
    await sendMouse({type: 'move', position: [Math.round(r.x + to), y]});
    await sendMouse({type: 'up'});
    await env.waitForStability();
  }

  async function setup(selected: boolean, dir = 'ltr') {
    const root = env.render(html`
      <div dir=${dir}><md-gb-switch ?selected=${selected} aria-label="a"></md-gb-switch></div>
    `);
    await env.waitForStability();
    return root.querySelector('md-gb-switch') as SwitchElement;
  }

  // spec: switch-7c3135
  it('switches on when the handle is dragged toward the on end', async () => {
    const el = await setup(false);
    await drag(el, 14, 40);
    expect(el.selected).toBeTrue();
  });

  // spec: switch-7c3135
  it('switches off when the handle is dragged toward the off end', async () => {
    const el = await setup(true);
    await drag(el, 38, 12);
    expect(el.selected).toBeFalse();
  });

  // spec: switch-7c3135
  it('keeps the state when the handle is dragged toward the end it is at', async () => {
    const el = await setup(true);
    await drag(el, 24, 44);
    expect(el.selected).toBeTrue();
    const off = await setup(false);
    await drag(off, 24, 6);
    expect(off.selected).toBeFalse();
  });

  // spec: switch-7c3135
  it('mirrors the drag direction for right-to-left', async () => {
    const el = await setup(false, 'rtl');
    await drag(el, 38, 12);
    expect(el.selected).toBeTrue();
  });

  // spec: switch-7c3135
  it('still toggles on a tap', async () => {
    const el = await setup(false);
    await drag(el, 24, 24);
    expect(el.selected).toBeTrue();
  });
});
