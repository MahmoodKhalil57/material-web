/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import './md-gb-typography.js';
import type {TypographyElement} from './typography-element.js';

/** What a property computes to for a value, on a probe element. */
function computed(prop: 'font' | 'color' | 'letterSpacing', value: string): string {
  const probe = document.createElement('div');
  probe.style[prop] = value;
  document.body.append(probe);
  const out = getComputedStyle(probe)[prop];
  probe.remove();
  return out;
}

describe('md-gb-typography', () => {
  let text: TypographyElement;
  beforeAll(() => adoptStyles(document, [m3Styles]));
  beforeEach(async () => {
    text = document.createElement('md-gb-typography');
    text.innerHTML = '<h3>Title</h3>';
    document.body.append(text);
    await text.updateComplete;
  });
  afterEach(() => text.remove());

  const h3 = () => text.querySelector('h3')!;

  it('sets its role of the type scale (typography, Applying type)', async () => {
    for (const scale of ['display-lg', 'headline-sm', 'title-md', 'label-sm', 'body-lg'] as const) {
      text.scale = scale;
      await text.updateComplete;
      expect(getComputedStyle(text).font).withContext(scale).toBe(computed('font', `var(--md-sys-typescale-${scale})`));
      expect(getComputedStyle(text).letterSpacing).withContext(scale).toBe(computed('letterSpacing', `var(--md-sys-typescale-${scale}-tracking)`));
    }
  });

  it("uses the role's emphasized style when emphasized", async () => {
    text.scale = 'title-md';
    text.emphasized = true;
    await text.updateComplete;
    expect(getComputedStyle(text).font).toBe(computed('font', 'var(--md-sys-typescale-emphasized-title-md)'));
  });

  it("gives a heading the role's style instead of the browser's, keeping its level", async () => {
    text.scale = 'title-md';
    await text.updateComplete;
    expect(getComputedStyle(h3()).font).toBe(getComputedStyle(text).font);
    expect(getComputedStyle(h3()).marginBlockStart).toBe('0px');
    expect(getComputedStyle(h3()).marginBlockEnd).toBe('0px');
    expect(h3().localName).toBe('h3');
  });

  it('colors the text with a color role', async () => {
    text.color = 'on-surface-variant';
    await text.updateComplete;
    expect(getComputedStyle(h3()).color).toBe(computed('color', 'var(--md-sys-color-on-surface-variant)'));
  });
});
