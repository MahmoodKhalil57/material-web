/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-switch.js';

import {sendKeys, sendMouse} from '@web/test-runner-commands';
import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {type SwitchElement} from './switch-element.js';

adoptStyles(document, [m3Styles]);

const ROLES = [
  '--md-sys-color-surface-container-highest: rgb(1, 1, 1)',
  '--md-sys-color-outline: rgb(2, 2, 2)',
  '--md-sys-color-primary: rgb(3, 3, 3)',
  '--md-sys-color-on-primary: rgb(4, 4, 4)',
  '--md-sys-color-on-surface: rgb(5, 5, 5)',
  '--md-sys-color-on-surface-variant: rgb(6, 6, 6)',
  '--md-sys-color-primary-container: rgb(7, 7, 7)',
].join(';');

describe('<md-gb-switch> spec behavior', () => {
  const env = new Environment();

  async function setup(template: unknown) {
    const root = env.render(html`<div style=${ROLES}>${template}</div>`);
    await env.waitForStability();
    const switches = [...root.querySelectorAll<SwitchElement>('md-gb-switch')];
    const button = (s: SwitchElement) =>
      s.shadowRoot!.querySelector<HTMLButtonElement>('button')!;
    return {root, switches, button};
  }

  const prop = (el: HTMLElement, name: string) =>
    getComputedStyle(el).getPropertyValue(name).trim();

  /** The handle's rendered size: the clip-path leaves 50% minus half of it. */
  const handleSize = (btn: HTMLElement) =>
    2 *
    parseFloat(
      /calc\(50% - ([\d.]+)px\)/.exec(
        getComputedStyle(btn, '::before').clipPath,
      )![1],
    );

  const finish = (el: HTMLElement) =>
    el.getAnimations({subtree: true}).forEach((a) => a.finish());

  async function pointerOver(el: HTMLElement) {
    const r = el.getBoundingClientRect();
    await sendMouse({
      type: 'move',
      position: [Math.round(r.x + r.width / 2), Math.round(r.y + r.height / 2)],
    });
  }

  // spec: switch-6a5df6, switch-ae32cd, switch-a445e0, switch-d12c70, switch-24f5b0, switch-95ca9a, switch-ab0a74
  it('takes track, outline and handle colors from the role tokens', async () => {
    const {switches, button} = await setup(html`
      <md-gb-switch aria-label="a"></md-gb-switch>
      <md-gb-switch selected aria-label="b"></md-gb-switch>`);
    const [off, on] = switches.map(button);
    expect(prop(off, '--track-color')).toBe('rgb(1, 1, 1)');
    expect(prop(off, '--track-outline-color')).toBe('rgb(2, 2, 2)');
    expect(prop(off, '--handle-color')).toBe('rgb(2, 2, 2)');
    expect(prop(on, '--track-color')).toBe('rgb(3, 3, 3)');
    expect(prop(on, '--handle-color')).toBe('rgb(4, 4, 4)');
  });

  // spec: switch-cf0809
  it('shows the enabled state with the resting handle and state layer', async () => {
    const {switches, button} = await setup(
      html`<md-gb-switch aria-label="a"></md-gb-switch>`,
    );
    expect(prop(button(switches[0]), '--handle-color')).toBe('rgb(2, 2, 2)');
    expect(prop(button(switches[0]), '--state-layer-color')).toBe(
      'rgb(5, 5, 5)',
    );
  });

  // spec: switch-1ca0b6, switch-e867fc
  it('shows the hovered state when the pointer is over it', async () => {
    const {switches, button} = await setup(
      html`<md-gb-switch aria-label="a"></md-gb-switch>`,
    );
    const idle = getComputedStyle(button(switches[0]), '::after').backgroundImage;
    await pointerOver(switches[0]);
    expect(prop(button(switches[0]), '--handle-color')).toBe('rgb(6, 6, 6)');
    // The hover area (state layer) appears around the handle.
    finish(button(switches[0]));
    expect(getComputedStyle(button(switches[0]), '::after').backgroundImage).not.toBe(idle);
    await sendMouse({type: 'move', position: [0, 0]});
  });

  // spec: switch-ce0752, switch-f61dcf, switch-da937b, switch-c4b1f6, switch-d22314
  it('is reached with Tab, which lands focus on the handle control, and shows the focused state', async () => {
    const {switches, button} = await setup(
      html`<md-gb-switch aria-label="a"></md-gb-switch>`,
    );
    await sendKeys({press: 'Tab'});
    expect(document.activeElement).toBe(switches[0]);
    expect(switches[0].shadowRoot!.activeElement).toBe(button(switches[0]));
    expect(button(switches[0]).matches(':focus-visible')).toBeTrue();
    expect(prop(button(switches[0]), '--handle-color')).toBe('rgb(6, 6, 6)');
  });

  // spec: switch-91bddb, switch-5367bd, switch-e867fc
  it('grows the handle to 28px while pressed', async () => {
    const {switches, button} = await setup(
      html`<md-gb-switch aria-label="a"></md-gb-switch>`,
    );
    const btn = button(switches[0]);
    expect(handleSize(btn)).toBeCloseTo(16, 0);
    await pointerOver(switches[0]);
    await sendMouse({type: 'down'});
    finish(btn);
    expect(prop(btn, '--handle-width')).toBe('28px');
    expect(handleSize(btn)).toBeCloseTo(28, 0);
    await sendMouse({type: 'up'});
    await sendMouse({type: 'move', position: [0, 0]});
  });

  // spec: switch-10d6ba, switch-b856fb
  it('indicates the on state with a larger handle', async () => {
    const {switches, button} = await setup(html`
      <md-gb-switch aria-label="a"></md-gb-switch>
      <md-gb-switch selected aria-label="b"></md-gb-switch>`);
    const [off, on] = switches.map(button);
    expect(handleSize(off)).toBeCloseTo(16, 0);
    expect(handleSize(on)).toBeCloseTo(24, 0);
  });

  // spec: switch-bf3929
  it('has no icons by default', async () => {
    const {switches, button} = await setup(
      html`<md-gb-switch aria-label="a"></md-gb-switch>`,
    );
    expect(prop(button(switches[0]), '--icon')).toBe('""');
    expect(handleSize(button(switches[0]))).toBeCloseTo(16, 0);
  });

  // spec: switch-9c431d, switch-dde9a6
  it('shows a slotted icon only in its state and sizes the handle for it', async () => {
    const {switches, button} = await setup(html`
      <md-gb-switch aria-label="a"><span slot="on-icon">on</span></md-gb-switch>
      <md-gb-switch aria-label="b">
        <span slot="on-icon">on</span>
        <span slot="off-icon">off</span>
      </md-gb-switch>`);
    const [onlyOn, both] = switches;
    const slotFor = (s: SwitchElement, cls: string) =>
      s.shadowRoot!.querySelector<HTMLElement>(cls)!;
    // The on-icon slot is hidden while unselected.
    expect(getComputedStyle(slotFor(onlyOn, '.switch-icon-on')).display).toBe(
      'none',
    );
    expect(getComputedStyle(slotFor(both, '.switch-icon-on')).display).toBe(
      'none',
    );
    expect(
      getComputedStyle(slotFor(both, '.switch-icon-off')).display,
    ).not.toBe('none');
    // An unselected switch with an off icon uses the larger icon handle.
    expect(handleSize(button(both))).toBeCloseTo(24, 0);
    onlyOn.selected = true;
    both.selected = true;
    await env.waitForStability();
    expect(
      getComputedStyle(slotFor(onlyOn, '.switch-icon-on')).display,
    ).not.toBe('none');
    expect(getComputedStyle(slotFor(both, '.switch-icon-off')).display).toBe(
      'none',
    );
  });

  // spec: switch-f7a0c0, switch-692abc, switch-852e74, switch-8a8ab9, switch-ca55e0
  it('toggles on and off at once on click, reporting true and false', async () => {
    const {switches, button} = await setup(
      html`<md-gb-switch aria-label="a"></md-gb-switch>`,
    );
    const s = switches[0];
    const changes: boolean[] = [];
    s.addEventListener('change', () => changes.push(s.selected));
    expect(button(s).getAttribute('aria-checked')).toBe('false');
    button(s).click();
    // No waiting: the value and the dispatched change are already there.
    expect(s.selected).toBeTrue();
    expect(button(s).getAttribute('aria-checked')).toBe('true');
    button(s).click();
    expect(s.selected).toBeFalse();
    expect(button(s).getAttribute('aria-checked')).toBe('false');
    expect(changes).toEqual([true, false]);
  });

  // spec: switch-294f67, switch-6135d6
  it('slides the handle to the opposite end of the track when selected', async () => {
    const {switches, button} = await setup(
      html`<md-gb-switch aria-label="a"></md-gb-switch>`,
    );
    const btn = button(switches[0]);
    const columns = () =>
      getComputedStyle(btn).gridTemplateColumns.split(' ').map(parseFloat);
    finish(btn);
    const [startA, , endA] = columns();
    expect(startA).toBe(0);
    expect(endA).toBeGreaterThan(0);
    btn.click();
    await env.waitForStability();
    finish(btn);
    const [startB, , endB] = columns();
    expect(startB).toBeGreaterThan(0);
    expect(endB).toBe(0);
  });

  // spec: switch-aad1ec
  it('is read as its label followed by the switch role', async () => {
    const {switches, button} = await setup(
      html`<md-gb-switch aria-label="Wi-Fi"></md-gb-switch>`,
    );
    expect(button(switches[0]).getAttribute('role')).toBe('switch');
    expect(button(switches[0]).getAttribute('aria-label')).toBe('Wi-Fi');
  });
});
