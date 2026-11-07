/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-radio.js';

import {sendKeys, sendMouse} from '@web/test-runner-commands';
import {html} from 'lit';
import {internals} from '../../../behaviors/element-internals.js';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {type RadioElement} from './radio-element.js';

adoptStyles(document, [m3Styles]);

const ROLES =
  '--md-sys-color-primary: rgb(1, 2, 3); --md-sys-color-on-surface: rgb(4, 5, 6); --md-sys-color-on-surface-variant: rgb(7, 8, 9);';

describe('<md-gb-radio> spec behavior', () => {
  const env = new Environment();

  async function setup(template: unknown) {
    const root = env.render(html`<div style=${ROLES}>${template}</div>`);
    await env.waitForStability();
    const radios = [
      ...root.querySelectorAll<RadioElement>('md-gb-radio'),
    ];
    const part = (r: RadioElement) =>
      r.shadowRoot!.querySelector<HTMLElement>('.radio')!;
    return {root, radios, part};
  }

  const prop = (el: HTMLElement, name: string) =>
    getComputedStyle(el).getPropertyValue(name).trim();

  // spec: radio-button-ecb7cb, radio-button-fc4d14, radio-button-48cdd3, radio-button-1f2e50, radio-button-6e9d10
  it('colors the icon from the role tokens: on-surface-variant unselected, primary selected', async () => {
    const {radios, part} = await setup(html`
      <md-gb-radio aria-label="a"></md-gb-radio>
      <md-gb-radio checked aria-label="b"></md-gb-radio>`);
    expect(prop(part(radios[0]), '--icon-color')).toBe('rgb(7, 8, 9)');
    expect(prop(part(radios[1]), '--icon-color')).toBe('rgb(1, 2, 3)');
    expect(getComputedStyle(part(radios[0]), '::before').color).toBe(
      'rgb(7, 8, 9)',
    );
  });

  // spec: radio-button-dcf6cf
  it('shows the enabled state with the resting unselected icon and state layer colors', async () => {
    const {radios, part} = await setup(
      html`<md-gb-radio aria-label="a"></md-gb-radio>`,
    );
    expect(prop(part(radios[0]), '--icon-color')).toBe('rgb(7, 8, 9)');
    expect(prop(part(radios[0]), '--state-layer-color')).toBe('rgb(4, 5, 6)');
  });

  // spec: radio-button-752ba7
  it('shows the hovered state when the pointer is over it', async () => {
    const {radios, part} = await setup(
      html`<md-gb-radio aria-label="a"></md-gb-radio>`,
    );
    const r = radios[0].getBoundingClientRect();
    await sendMouse({
      type: 'move',
      position: [Math.round(r.x + r.width / 2), Math.round(r.y + r.height / 2)],
    });
    expect(prop(part(radios[0]), '--icon-color')).toBe('rgb(4, 5, 6)');
    await sendMouse({type: 'move', position: [0, 0]});
  });

  // spec: radio-button-c22596
  it('shows the focused state when focused by keyboard', async () => {
    const {radios, part} = await setup(
      html`<md-gb-radio aria-label="a"></md-gb-radio>`,
    );
    await sendKeys({press: 'Tab'});
    await env.waitForStability();
    expect(part(radios[0]).classList.contains('focus')).toBeTrue();
    expect(prop(part(radios[0]), '--icon-color')).toBe('rgb(4, 5, 6)');
  });

  // spec: radio-button-bd1692
  it('shows the pressed state while the pointer is down', async () => {
    const {radios, part} = await setup(
      html`<md-gb-radio aria-label="a"></md-gb-radio>`,
    );
    const r = radios[0].getBoundingClientRect();
    await sendMouse({
      type: 'move',
      position: [Math.round(r.x + r.width / 2), Math.round(r.y + r.height / 2)],
    });
    await sendMouse({type: 'down'});
    expect(prop(part(radios[0]), '--state-layer-color')).toBe('rgb(1, 2, 3)');
    await sendMouse({type: 'up'});
    await sendMouse({type: 'move', position: [0, 0]});
  });

  // spec: radio-button-03d588
  it('is reached with Tab', async () => {
    const {radios} = await setup(
      html`<md-gb-radio aria-label="a"></md-gb-radio>`,
    );
    await sendKeys({press: 'Tab'});
    expect(document.activeElement).toBe(radios[0]);
  });

  // spec: radio-button-697780
  it('is either selected or unselected, exposed as aria-checked', async () => {
    const {radios} = await setup(
      html`<md-gb-radio aria-label="a"></md-gb-radio>`,
    );
    expect(radios[0].checked).toBeFalse();
    radios[0].click();
    await env.waitForStability();
    expect(radios[0][internals].ariaChecked).toBe('true');
  });

  // spec: radio-button-1958cc, radio-button-46261a
  it('is read as its label followed by the radio role', async () => {
    const {radios} = await setup(
      html`<md-gb-radio aria-label="Small"></md-gb-radio>`,
    );
    expect(radios[0][internals].role).toBe('radio');
    expect(radios[0].getAttribute('aria-label')).toBe('Small');
  });

  // spec: radio-button-e8f26d, radio-button-22a025
  it('is selected by clicking either the radio button icon or its label', async () => {
    const {radios} = await setup(html`
      <label id="l1"><md-gb-radio name="size" value="s"></md-gb-radio> <span id="t1">Small</span></label>
      <label id="l2"><md-gb-radio name="size" value="m"></md-gb-radio> <span id="t2">Medium</span></label>`);
    const [small, medium] = radios;
    (document.querySelector('#t1') as HTMLElement).click();
    await small.updateComplete;
    expect(small.checked).toBeTrue();
    // The radio button icon itself.
    const box = medium.getBoundingClientRect();
    await sendMouse({
      type: 'click',
      position: [Math.round(box.x + box.width / 2), Math.round(box.y + box.height / 2)],
    });
    await medium.updateComplete;
    expect(medium.checked).toBeTrue();
    expect(small.checked).toBeFalse();
    // Clicking the label text of the other choice selects it and deselects this one.
    (document.querySelector('#t1') as HTMLElement).click();
    await small.updateComplete;
    expect(small.checked).toBeTrue();
    expect(medium.checked).toBeFalse();
  });
});
