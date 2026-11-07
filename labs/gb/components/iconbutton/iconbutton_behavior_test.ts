/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-icon-button.js';
import '../../styles/icon/md-gb-icon.js';

import {sendKeys, sendMouse} from '@web/test-runner-commands';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {center} from '../shared/central/subjects.js';

adoptStyles(document, [m3Styles]);

type IconButton = HTMLElement & {updateComplete: Promise<unknown>; selected: boolean};

const containers: HTMLElement[] = [];

async function mount(attrs: string) {
  const container = document.createElement('div');
  containers.push(container);
  container.style.padding = '64px';
  container.innerHTML = `<md-gb-icon-button aria-label="Favorite" ${attrs}><md-gb-icon>favorite</md-gb-icon></md-gb-icon-button>`;
  document.body.append(container);
  const el = container.firstElementChild as IconButton;
  await el.updateComplete;
  await new Promise((r) => requestAnimationFrame(r));
  const btn = el.shadowRoot!.querySelector<HTMLElement>('[part="icon-btn"]')!;
  finish(el);
  return {el, btn};
}

function finish(el: Element) {
  for (const a of el.shadowRoot!.querySelector('[part="icon-btn"]')!.getAnimations({subtree: true})) {
    try {
      a.finish();
    } catch {
      // ignore
    }
  }
}

const radius = (btn: HTMLElement) => parseFloat(getComputedStyle(btn).borderTopLeftRadius);
const SIZES = {xs: 32, sm: 40, md: 56, lg: 96, xl: 136} as const;

describe('<md-gb-icon-button> spec behavior', () => {
  afterEach(async () => {
    for (const c of containers.splice(0)) c.remove();
    await sendMouse({type: 'up'}).catch(() => {});
    await sendMouse({type: 'move', position: [0, 0]});
  });

  // spec: icon-buttons-52cc01, icon-buttons-001f28, icon-buttons-e571d5, icon-buttons-3ec579
  it('is a default button until type is toggle, which keeps a pressed state', async () => {
    const plain = await mount('');
    expect(plain.btn.hasAttribute('aria-pressed')).toBeFalse();
    const toggle = await mount('type="toggle"');
    expect(toggle.btn.getAttribute('aria-pressed')).toBe('false');
    toggle.btn.click();
    await toggle.el.updateComplete;
    expect(toggle.el.selected).toBeTrue();
    expect(toggle.btn.getAttribute('aria-pressed')).toBe('true');
  });

  // spec: icon-buttons-a56d55, icon-buttons-9229ca, icon-buttons-a3078e, icon-buttons-8ce2b9, icon-buttons-e47f19, icon-buttons-43c057, icon-buttons-965b36, icon-buttons-fd6d48, icon-buttons-88fc1d, icon-buttons-c78fa1
  it('comes in five sizes, small (40dp) by default', async () => {
    const dflt = await mount('');
    expect(Math.round(dflt.btn.getBoundingClientRect().height)).toBe(40);
    for (const [size, height] of Object.entries(SIZES)) {
      const {btn} = await mount(`size="${size}"`);
      expect(Math.round(btn.getBoundingClientRect().height)).withContext(size).toBe(height);
    }
  });

  // spec: icon-buttons-5bac9a, icon-buttons-962a7d, icon-buttons-bfa1fb, icon-buttons-3f7fbb
  it('is round by default and square on request', async () => {
    const round = await mount('');
    const square = await mount('square');
    expect(radius(square.btn)).toBeLessThan(radius(round.btn));
    expect(radius(round.btn)).toBeGreaterThanOrEqual(20);
    expect(radius(square.btn)).toBeLessThan(20);
  });

  // spec: icon-buttons-bd74ce, icon-buttons-573390, icon-buttons-c7ecd9, icon-buttons-17bef3, icon-buttons-8d53b3, icon-buttons-c47118, icon-buttons-95da5e, icon-buttons-dc2980
  it('comes in default, narrow and wide widths', async () => {
    for (const size of Object.keys(SIZES)) {
      const widths: number[] = [];
      for (const width of ['narrow', '', 'wide']) {
        const {btn} = await mount(`size="${size}" width="${width}"`);
        widths.push(btn.getBoundingClientRect().width);
      }
      expect(widths[0]).withContext(`${size} narrow < default`).toBeLessThan(widths[1]);
      expect(widths[1]).withContext(`${size} default < wide`).toBeLessThan(widths[2]);
    }
  });

  // spec: icon-buttons-153d38, icon-buttons-0a4809, icon-buttons-eaa914, icon-buttons-45ec1c
  it('is available in four color styles, default and toggle', async () => {
    const seen = new Set<string>();
    for (const color of ['filled', 'tonal', 'outlined', 'standard']) {
      for (const type of ['', 'type="toggle"']) {
        const {btn} = await mount(`color="${color}" ${type}`);
        expect(btn.classList.contains(`icon-btn-${color}`)).withContext(color).toBeTrue();
        const css = getComputedStyle(btn);
        seen.add(`${color}:${css.backgroundColor}:${css.borderTopColor}`);
      }
    }
    // The styles do not collapse into each other.
    expect(seen.size).toBeGreaterThanOrEqual(4);
  });

  // spec: icon-buttons-740aee, icon-buttons-2796ae, icon-buttons-0cd759, icon-buttons-e7f776, icon-buttons-16d29a, icon-buttons-9bd01b, icon-buttons-db3db9, icon-buttons-1398c4
  it('morphs to the same more square shape when pressed, round or square', async () => {
    for (const size of Object.keys(SIZES)) {
      const radii: number[] = [];
      const resting: number[] = [];
      for (const shape of ['', 'square']) {
        const {el, btn} = await mount(`size="${size}" color="filled" ${shape}`);
        resting.push(radius(btn));
        const c = center(btn);
        await sendMouse({type: 'move', position: [c.x, c.y]});
        await sendMouse({type: 'down'});
        finish(el);
        radii.push(radius(btn));
        await sendMouse({type: 'up'});
        for (const c of containers.splice(0)) c.remove();
      }
      expect(radii[0]).withContext(`${size} pressed round = square`).toBe(radii[1]);
      expect(radii[0]).withContext(`${size} pressed < resting round`).toBeLessThan(resting[0]);
    }
  });

  // spec: icon-buttons-0febd0, icon-buttons-d761ce, icon-buttons-eb058e, icon-buttons-c1dfb1, icon-buttons-1f74c9, icon-buttons-71ada0, icon-buttons-0e4dfd, icon-buttons-554afd
  it('swaps round and square when a toggle is selected', async () => {
    const roundOff = await mount('type="toggle"');
    const roundOn = await mount('type="toggle" selected');
    const squareOff = await mount('type="toggle" square');
    const squareOn = await mount('type="toggle" square selected');
    finish(roundOn.el);
    finish(squareOn.el);
    expect(radius(roundOn.btn)).toBeLessThan(radius(roundOff.btn));
    expect(radius(squareOn.btn)).toBeGreaterThan(radius(squareOff.btn));
    expect(radius(squareOn.btn)).toBe(radius(roundOff.btn));
  });

  // spec: icon-buttons-dd522c, icon-buttons-4583fa
  it('fills the icon when selected and outlines it when unselected', async () => {
    const off = await mount('type="toggle"');
    const on = await mount('type="toggle" selected');
    expect(getComputedStyle(off.btn).getPropertyValue('--md-icon-fill').trim()).toBe('0');
    expect(getComputedStyle(on.btn).getPropertyValue('--md-icon-fill').trim()).toBe('1');
  });

  // spec: icon-buttons-96bbf7, icon-buttons-a0b91c, icon-buttons-21f4f3
  it('toggles a single choice on and off with each activation', async () => {
    const {el, btn} = await mount('type="toggle"');
    const states: boolean[] = [];
    el.addEventListener('change', () => states.push(el.selected));
    btn.click();
    btn.click();
    expect(states).toEqual([true, false]);
  });

  // spec: icon-buttons-aaa4e4, icon-buttons-137d09
  it('takes focus with Tab and activates with Space or Enter', async () => {
    const {el, btn} = await mount('');
    let clicks = 0;
    btn.addEventListener('click', () => clicks++);
    await sendKeys({press: 'Tab'});
    expect(document.activeElement).toBe(el);
    expect(el.shadowRoot!.activeElement).toBe(btn);
    await sendKeys({press: 'Enter'});
    await sendKeys({press: 'Space'});
    expect(clicks).toBe(2);
  });

  // spec: icon-buttons-aaa4e4
  it('does not take focus when disabled', async () => {
    const {el} = await mount('disabled');
    await sendKeys({press: 'Tab'});
    expect(document.activeElement).not.toBe(el);
  });

  // spec: icon-buttons-572ac7
  it('exposes its label to assistive technology', async () => {
    const {btn} = await mount('');
    expect(btn.getAttribute('aria-label')).toBe('Favorite');
  });
});
