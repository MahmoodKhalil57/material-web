/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-checkbox.js';

import {sendKeys, sendMouse} from '@web/test-runner-commands';
import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {type CheckboxElement} from './checkbox-element.js';

adoptStyles(document, [m3Styles]);

const ROLES =
  '--md-sys-color-primary: rgb(1, 2, 3); --md-sys-color-on-primary: rgb(10, 11, 12); --md-sys-color-on-surface: rgb(4, 5, 6); --md-sys-color-on-surface-variant: rgb(7, 8, 9);';

describe('<md-gb-checkbox> spec behavior', () => {
  const env = new Environment();

  async function setup(template: unknown) {
    const root = env.render(html`<div style=${ROLES}>${template}</div>`);
    await env.waitForStability();
    const boxes = [...root.querySelectorAll<CheckboxElement>('md-gb-checkbox')];
    const input = (c: CheckboxElement) =>
      c.shadowRoot!.querySelector<HTMLInputElement>('input')!;
    return {root, boxes, input};
  }

  const prop = (el: HTMLElement, name: string) =>
    getComputedStyle(el).getPropertyValue(name).trim();

  async function pointerOver(el: HTMLElement) {
    const r = el.getBoundingClientRect();
    await sendMouse({
      type: 'move',
      position: [Math.round(r.x + r.width / 2), Math.round(r.y + r.height / 2)],
    });
  }

  // spec: checkbox-04357e, checkbox-87ee67, checkbox-628903
  it('takes container and icon colors from the role tokens when selected', async () => {
    const {boxes, input} = await setup(html`
      <md-gb-checkbox aria-label="a"></md-gb-checkbox>
      <md-gb-checkbox checked aria-label="b"></md-gb-checkbox>`);
    expect(prop(input(boxes[0]), '--icon-color')).toBe('transparent');
    expect(prop(input(boxes[1]), '--container-color')).toBe('rgb(1, 2, 3)');
    expect(prop(input(boxes[1]), '--icon-color')).toBe('rgb(10, 11, 12)');
    expect(prop(input(boxes[0]), '--outline-color')).toBe('rgb(7, 8, 9)');
  });

  // spec: checkbox-500bab, checkbox-c599dd
  it('uses the on-surface state layer in the enabled state', async () => {
    const {boxes, input} = await setup(
      html`<md-gb-checkbox aria-label="a"></md-gb-checkbox>`,
    );
    expect(prop(input(boxes[0]), '--state-layer-color')).toBe('rgb(4, 5, 6)');
  });

  // spec: checkbox-794663
  it('shows the hovered state when the pointer is over it', async () => {
    const {boxes, input} = await setup(
      html`<md-gb-checkbox aria-label="a"></md-gb-checkbox>`,
    );
    await pointerOver(boxes[0]);
    expect(prop(input(boxes[0]), '--outline-color')).toBe('rgb(4, 5, 6)');
    await sendMouse({type: 'move', position: [0, 0]});
  });

  // spec: checkbox-7bed89
  it('shows the focused state when focused by keyboard', async () => {
    const {boxes, input} = await setup(
      html`<md-gb-checkbox aria-label="a"></md-gb-checkbox>`,
    );
    await sendKeys({press: 'Tab'});
    await env.waitForStability();
    expect(input(boxes[0]).matches(':focus-visible')).toBeTrue();
    expect(prop(input(boxes[0]), '--outline-color')).toBe('rgb(4, 5, 6)');
  });

  // spec: checkbox-aa0d1a
  it('shows the pressed state while the pointer is down', async () => {
    const {boxes, input} = await setup(
      html`<md-gb-checkbox aria-label="a"></md-gb-checkbox>`,
    );
    await pointerOver(boxes[0]);
    await sendMouse({type: 'down'});
    expect(prop(input(boxes[0]), '--state-layer-color')).toBe('rgb(1, 2, 3)');
    await sendMouse({type: 'up'});
    await sendMouse({type: 'move', position: [0, 0]});
  });

  // spec: checkbox-d80509
  it('shows the selected state in the same frame as the click', async () => {
    const {boxes, input} = await setup(
      html`<md-gb-checkbox aria-label="a"></md-gb-checkbox>`,
    );
    input(boxes[0]).click();
    expect(boxes[0].checked).toBeTrue();
    expect(prop(input(boxes[0]), '--container-color')).toBe('rgb(1, 2, 3)');
  });

  // spec: checkbox-ef7925, checkbox-c2218a
  it('has selected, unselected and indeterminate states (mixed)', async () => {
    const {boxes, input} = await setup(html`
      <md-gb-checkbox aria-label="a"></md-gb-checkbox>
      <md-gb-checkbox checked aria-label="b"></md-gb-checkbox>
      <md-gb-checkbox indeterminate aria-label="c"></md-gb-checkbox>`);
    const [off, on, mixed] = boxes.map(input);
    expect([off.checked, off.indeterminate]).toEqual([false, false]);
    expect([on.checked, on.indeterminate]).toEqual([true, false]);
    expect(mixed.indeterminate).toBeTrue();
    expect(mixed.getAttribute('aria-checked')).toBe('mixed');
    expect(prop(mixed, '--container-color')).toBe('rgb(1, 2, 3)');
    expect(getComputedStyle(mixed, '::before').content).toContain('remove');
  });

  // spec: checkbox-3a8930
  it('selects and unselects regardless of the other checkboxes in a group', async () => {
    const {boxes, input} = await setup(html`
      <md-gb-checkbox aria-label="a"></md-gb-checkbox>
      <md-gb-checkbox aria-label="b"></md-gb-checkbox>
      <md-gb-checkbox checked aria-label="c"></md-gb-checkbox>`);
    input(boxes[0]).click();
    input(boxes[1]).click();
    await env.waitForStability();
    expect(boxes.map((b) => b.checked)).toEqual([true, true, true]);
    input(boxes[2]).click();
    input(boxes[0]).click();
    await env.waitForStability();
    expect(boxes.map((b) => b.checked)).toEqual([false, true, false]);
  });

  // spec: checkbox-1857c8
  it('is read as its label followed by the checkbox role', async () => {
    const {boxes, input} = await setup(
      html`<md-gb-checkbox aria-label="Accept"></md-gb-checkbox>`,
    );
    expect(input(boxes[0]).getAttribute('aria-label')).toBe('Accept');
    expect(input(boxes[0]).type).toBe('checkbox');
  });

  // spec: checkbox-c6dbdb
  it('moves focus to an enabled checkbox with Tab and skips a disabled one', async () => {
    const {boxes, input} = await setup(html`
      <md-gb-checkbox disabled aria-label="off"></md-gb-checkbox>
      <md-gb-checkbox aria-label="on"></md-gb-checkbox>`);
    await sendKeys({press: 'Tab'});
    await env.waitForStability();
    expect(boxes[1].shadowRoot!.activeElement).toBe(input(boxes[1]));
    expect(boxes[0].shadowRoot!.activeElement).toBeNull();
    expect(input(boxes[1]).matches(':focus-visible')).toBeTrue();
  });
});
