/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';

import {Environment} from '../../../../testing/environment.js';
import {styles as buttonStyles} from '../../components/button/button.cssresult.js';
import {styles as cardStyles} from '../../components/card/card.cssresult.js';
import '../../components/button/md-gb-button.js';
import '../../components/card/md-gb-card.js';
import {adoptStyles} from '../adopt-styles.js';
import {styles as m3Styles} from '../m3.cssresult.js';

import {MATERIAL_SHAPES} from './material-shapes.js';
import {innerCornerRadius} from './optical-radius.js';

adoptStyles(document, [m3Styles, cardStyles, buttonStyles]);

function corners(token: string, size = 200) {
  const el = document.createElement('div');
  el.style.cssText = `width:${size}px;height:${size}px;border-radius:var(--md-sys-shape-corner-${token})`;
  document.body.append(el);
  const s = getComputedStyle(el);
  const result = [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomRightRadius, s.borderBottomLeftRadius];
  el.remove();
  return result.map((v) => parseFloat(v));
}

describe('shape corner scale', () => {
  const SCALE: Array<[string, number]> = [
    ['none', 0],
    ['xs', 4],
    ['sm', 8],
    ['md', 12],
    ['lg', 16],
    ['lg-increased', 20],
    ['xl', 28],
    ['xl-increased', 32],
    ['xxl', 48],
  ];

  // spec: shape-85aadd, shape-a24d9e, shape-7d0e0f, shape-dd6214, shape-d6d89a, shape-9093b1, shape-a1eef6, shape-09554a, shape-b40475, shape-f3efd2
  it('has the none to extra extra large radii of the M3 scale', () => {
    for (const [token, dp] of SCALE) {
      expect(corners(token)).withContext(token).toEqual([dp, dp, dp, dp]);
    }
  });

  // spec: shape-38eccb, shape-eed7b1, shape-6a583b
  it('is a ten-level scale from none to full, with the Expressive shape library', () => {
    expect(SCALE.length + 1).toBe(10);
    expect(corners('full', 48)[0]).toBeGreaterThanOrEqual(24);
    // Full is its own token, not a percentage of the component size.
    expect(getComputedStyle(document.documentElement).getPropertyValue('--md-sys-shape-corner-full')).not.toContain('%');
    expect(Object.keys(MATERIAL_SHAPES).length).toBeGreaterThan(10);
  });

  // spec: shape-d2414f, shape-a5c4c4, shape-2919f1, shape-5b4ee1
  it('has symmetric corners and asymmetric ones that use the same scale values', () => {
    expect(new Set(corners('md')).size).toBe(1);
    const top = corners('lg-top');
    expect(top).toEqual([16, 16, 0, 0]);
    const scale = new Set(SCALE.map(([, dp]) => dp));
    for (const token of ['xs-top', 'lg-top', 'lg-start', 'lg-end', 'xl-top']) {
      for (const r of corners(token)) expect(scale.has(r)).withContext(token).toBeTrue();
      expect(new Set(corners(token)).size).withContext(token).toBeGreaterThan(1);
    }
  });
});

describe('shape customization', () => {
  const env = new Environment();

  async function radiusOf(template: ReturnType<typeof html>, inner: string) {
    const root = env.render(template);
    await env.waitForStability();
    const host = root.querySelector('[data-host]') as HTMLElement;
    const el = (host.shadowRoot?.querySelector(inner) ?? host) as HTMLElement;
    return parseFloat(getComputedStyle(el).borderTopLeftRadius);
  }

  // spec: shape-967365, shape-a0e61f, shape-d3d4b0, shape-d1a2b5
  it('changes every component of a shape style by customizing the style token', async () => {
    const before = await radiusOf(html`<md-gb-card data-host color="elevated"></md-gb-card>`, '.card');
    expect(before).toBe(12);
    const after = await radiusOf(
      html`<div style="--md-sys-shape-corner-md: 20px"><md-gb-card data-host color="elevated"></md-gb-card></div>`,
      '.card',
    );
    expect(after).toBe(20);
  });

  // spec: shape-bf50c0, shape-d0ab33, shape-4004a0, shape-aa09cb
  it('remaps one component to another style without changing the others', async () => {
    // The component styles are usable as plain classes; its tokens are
    // custom properties on the element, so a remap affects just that element.
    const root = env.render(html`
      <button class="btn" id="a">A</button>
      <button class="btn" id="b" style="--container-shape-round: var(--md-sys-shape-corner-sm)">B</button>
      <md-gb-card id="c" color="elevated"></md-gb-card>`);
    await env.waitForStability();
    const radius = (el: Element) => parseFloat(getComputedStyle(el).borderTopLeftRadius);
    expect(radius(root.querySelector('#a')!)).toBeGreaterThan(20);
    expect(radius(root.querySelector('#b')!)).toBe(8);
    expect(radius(root.querySelector('#c')!.shadowRoot!.querySelector('.card')!)).toBe(12);
  });
});

describe('optical roundness', () => {
  // spec: shape-41afee, shape-e4a97c, shape-25239a, shape-f04848
  it('subtracts the padding from the outer radius for nested components', () => {
    expect(innerCornerRadius(48, 14)).toBe(34);
    expect(innerCornerRadius(28, 8)).toBe(20);
    expect(innerCornerRadius(4, 8)).toBe(0);
  });
});
