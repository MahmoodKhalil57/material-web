/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-badge.js';

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {BADGE_CLASSES} from './badge.js';
import {type BadgeElement} from './badge-element.js';

adoptStyles(document, [m3Styles]);

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

describe('<md-gb-badge> spec behavior', () => {
  const env = new Environment();

  async function setup(template: unknown, style = '') {
    const root = env.render(html`<div style=${style}>${template}</div>`);
    await env.waitForStability();
    const els = [...root.querySelectorAll<BadgeElement>('md-gb-badge')];
    const part = (e: BadgeElement) =>
      e.shadowRoot!.querySelector<HTMLElement>('.badge')!;
    return {root, els, part};
  }

  // spec: badges-c02c28, badges-ab74f1, badges-1bcc56, badges-c7590f, badges-d565f2, badges-f8108f, badges-f7b7fb, badges-0af4cb, badges-503fff, badges-ed2634
  it('has a small badge that is a plain circle and a large badge with the count in a container', async () => {
    const {els, part} = await setup(html`
      <md-gb-badge></md-gb-badge>
      <md-gb-badge value="7"></md-gb-badge>`);
    const [small, large] = els.map(part);
    expect(small.classList).not.toContain(BADGE_CLASSES.badgeLarge);
    expect(large.classList).toContain(BADGE_CLASSES.badgeLarge);
    const s = small.getBoundingClientRect();
    expect(s.width).toBe(s.height);
    expect(parseFloat(getComputedStyle(small).borderTopLeftRadius)).toBeGreaterThanOrEqual(
      s.height / 2,
    );
    // The small badge shows no visible text; only the screen reader label.
    expect(small.querySelector('.badge-label')).not.toBeNull();
    expect(getComputedStyle(small).fontSize).not.toBe('0px');
    expect(small.getBoundingClientRect().height).toBe(6);
    expect(large.textContent?.trim()).toBe('7');
    expect(large.getBoundingClientRect().height).toBe(16);
    expect(getComputedStyle(large).display).not.toBe('none');
  });

  // spec: badges-7de061, badges-70578e, badges-a67979, badges-639e18, badges-362dff, badges-5b5936, badges-a7ac52, badges-aeb6f5, badges-41f4e4, badges-3eff09, badges-c09e58, badges-1a87ef, badges-c94e60, badges-830d1f
  it('uses the error role for the container and on-error for the label', async () => {
    const {els, part} = await setup(
      html`<md-gb-badge></md-gb-badge><md-gb-badge value="3"></md-gb-badge>`,
      '--md-sys-color-error: rgb(11, 22, 33); --md-sys-color-on-error: rgb(44, 55, 66)',
    );
    const [small, large] = els.map(part);
    expect(getComputedStyle(small).backgroundColor).toBe('rgb(11, 22, 33)');
    expect(getComputedStyle(large).backgroundColor).toBe('rgb(11, 22, 33)');
    expect(getComputedStyle(large).color).toBe('rgb(44, 55, 66)');
  });

  // spec: badges-d104ed, badges-922831, badges-e27411, badges-af7d47, badges-3e6299
  it('uses the default colors, which keep 3:1 contrast in light and dark', async () => {
    for (const scheme of ['light', 'dark']) {
      const {els, part} = await setup(
        html`<md-gb-badge value="3"></md-gb-badge>`,
        `color-scheme: ${scheme}`,
      );
      const style = getComputedStyle(part(els[0]));
      expect(contrast(style.color, style.backgroundColor))
        .withContext(`${scheme} label on container`)
        .toBeGreaterThanOrEqual(3);
    }
  });

  // spec: badges-bc5d83, badges-c02355, badges-6e4806
  it('limits a count to four characters including the +', async () => {
    const {els, part} = await setup(html`
      <md-gb-badge value="1"></md-gb-badge>
      <md-gb-badge value="999"></md-gb-badge>
      <md-gb-badge value="1000"></md-gb-badge>
      <md-gb-badge value="123456"></md-gb-badge>`);
    const texts = els.map((e) => part(e).textContent!.trim());
    expect(texts).toEqual(['1', '999', '999+', '999+']);
    for (const t of texts) expect(t.length).toBeLessThanOrEqual(4);
  });

  // spec: badges-cb808a
  it('conveys a changing count as text', async () => {
    const {els, part} = await setup(html`<md-gb-badge value="2"></md-gb-badge>`);
    expect(part(els[0]).textContent!.trim()).toBe('2');
    els[0].value = 12;
    await els[0].updateComplete;
    expect(part(els[0]).textContent!.trim()).toBe('12');
  });
});
