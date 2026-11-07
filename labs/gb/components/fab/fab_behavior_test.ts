/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-fab.js';
import '../../styles/icon/md-gb-icon.js';

import {sendKeys} from '@web/test-runner-commands';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';

adoptStyles(document, [m3Styles]);

const containers: HTMLElement[] = [];

async function mount(attrs: string, wrapperAttrs = '') {
  const container = document.createElement('div');
  container.style.padding = '64px';
  containers.push(container);
  container.innerHTML = `<div ${wrapperAttrs}><md-gb-fab ${attrs}><md-gb-icon>add</md-gb-icon></md-gb-fab></div>`;
  document.body.append(container);
  const el = container.querySelector('md-gb-fab') as HTMLElement & {
    updateComplete: Promise<unknown>;
  };
  await el.updateComplete;
  await new Promise((r) => requestAnimationFrame(r));
  const btn = el.shadowRoot!.querySelector<HTMLElement>('[part="fab"]')!;
  return {el, btn};
}

function luminance(rgb: string) {
  const [r, g, b] = rgb
    .match(/[\d.]+/g)!
    .slice(0, 3)
    .map((v) => {
      const c = Number(v) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const height = (btn: HTMLElement) => Math.round(btn.getBoundingClientRect().height);
const width = (btn: HTMLElement) => Math.round(btn.getBoundingClientRect().width);

describe('<md-gb-fab> spec behavior', () => {
  afterEach(() => {
    for (const c of containers.splice(0)) c.remove();
  });

  // spec: floating-action-button-fe28f5, floating-action-button-5b8915, floating-action-button-5242eb, floating-action-button-a59ed1, floating-action-button-6ff243, floating-action-button-9d87ca, floating-action-button-3150a2, floating-action-button-879b39, floating-action-button-b42a70, floating-action-button-0ed13c
  it('comes in small (40), default (56), medium (80) and large (96) FAB sizes', async () => {
    for (const [size, px] of [
      ['sm', 40],
      ['default', 56],
      ['md', 80],
      ['lg', 96],
    ] as const) {
      const {btn} = await mount(`aria-label="Add" size="${size}"`);
      expect(height(btn)).withContext(size).toBe(px);
      expect(width(btn)).withContext(size).toBe(px);
    }
  });

  // spec: extended-fab-bd575a, extended-fab-ab721a, extended-fab-691b02, extended-fab-62d80a, extended-fab-c5bc8e, extended-fab-536e04, extended-fab-4c3d62, extended-fab-fcfc21, extended-fab-9f49b4, extended-fab-1f8bd1, extended-fab-887706, extended-fab-e57f79, extended-fab-f6090f, extended-fab-874c77, extended-fab-3a8802
  it('comes in small (56, default), medium (80) and large (96) extended FABs', async () => {
    for (const [size, px] of [
      ['default', 56],
      ['md', 80],
      ['lg', 96],
    ] as const) {
      const {btn} = await mount(`label="Create" size="${size}"`);
      expect(height(btn)).withContext(size).toBe(px);
      expect(width(btn)).withContext(size).toBeGreaterThan(px);
    }
  });

  // spec: extended-fab-fa979d, extended-fab-e6d4c3
  it('places the icon before the label in left-to-right', async () => {
    const { el } = await mount('label="Create"');
    const icon = el.querySelector('md-gb-icon')!.getBoundingClientRect();
    const label = el.shadowRoot!.querySelector('[part="label"]')!.getBoundingClientRect();
    expect(icon.right).toBeLessThanOrEqual(label.left + 0.5);
  });

  // spec: extended-fab-c7cfad, extended-fab-be8e54
  it('mirrors an extended FAB in right-to-left, with the icon after the label', async () => {
    const { el } = await mount('label="Create"', 'dir="rtl"');
    const icon = el.querySelector('md-gb-icon')!.getBoundingClientRect();
    const label = el.shadowRoot!.querySelector('[part="label"]')!.getBoundingClientRect();
    expect(icon.left).toBeGreaterThanOrEqual(label.right - 0.5);
  });

  // spec: floating-action-button-70d7a5, floating-action-button-fa1307, floating-action-button-b53d51, floating-action-button-0f1a1c, floating-action-button-237195
  it('takes focus with Tab and activates with Enter or Space', async () => {
    const { el, btn } = await mount('aria-label="Add"');
    let clicks = 0;
    el.addEventListener('click', () => clicks++);
    await sendKeys({press: 'Tab'});
    expect(document.activeElement).toBe(el);
    expect(el.shadowRoot!.activeElement).toBe(btn);
    await sendKeys({press: 'Enter'});
    await sendKeys({press: 'Space'});
    expect(clicks).toBe(2);
  });

  // spec: extended-fab-6dc8a5, extended-fab-f9f373, extended-fab-561340, extended-fab-e67b6d, extended-fab-4b5338, extended-fab-02d187
  it('treats an extended FAB label and icon as one focusable element', async () => {
    const { el, btn } = await mount('label="Create"');
    let clicks = 0;
    el.addEventListener('click', () => clicks++);
    await sendKeys({press: 'Tab'});
    expect(el.shadowRoot!.activeElement).toBe(btn);
    expect(btn.contains(el.shadowRoot!.querySelector('[part="label"]'))).toBeTrue();
    await sendKeys({press: 'Enter'});
    await sendKeys({press: 'Space'});
    expect(clicks).toBe(2);
    await sendKeys({press: 'Tab'});
    expect(document.activeElement).not.toBe(el);
  });

  // spec: floating-action-button-b1b49a, floating-action-button-7b0f18
  it('keeps the icon at 3:1 or more against the container in every color, light and dark', async () => {
    for (const scheme of ['light', 'dark']) {
      for (const color of [
        'primary-container',
        'secondary-container',
        'tertiary-container',
        'primary',
        'secondary',
        'tertiary',
      ]) {
        const { btn } = await mount(`aria-label="Add" color="${color}"`, `style="color-scheme: ${scheme}"`);
        const css = getComputedStyle(btn);
        expect(contrast(css.color, css.backgroundColor))
          .withContext(`${scheme} ${color}`)
          .toBeGreaterThanOrEqual(3);
      }
    }
  });
});
