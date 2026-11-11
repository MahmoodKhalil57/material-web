/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import './md-gb-shape.js';

import {MATERIAL_SHAPES} from '../../styles/shape/material-shapes.js';
import type {ShapeElement} from './shape-element.js';
import {SHAPE_MORPHS} from './shape-morphs.js';

describe('md-gb-shape', () => {
  let shape: ShapeElement;

  /** Waits for the element and its morph paths. */
  async function settle() {
    await shape.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await shape.updateComplete;
  }

  const path = () => shape.shadowRoot!.querySelector('path')!;
  const svgEl = () => shape.shadowRoot!.querySelector('svg')!;

  beforeEach(async () => {
    shape = document.createElement('md-gb-shape');
    document.body.append(shape);
    await settle();
  });

  afterEach(() => shape.remove());

  it('draws the Material shape, decorative, at its size', async () => {
    shape.shape = 'cookie9Sided';
    shape.size = 64;
    await settle();
    expect(path().getAttribute('d')).toBe(MATERIAL_SHAPES.cookie9Sided);
    expect(svgEl().getAttribute('aria-hidden')).toBe('true');
    expect(svgEl().getAttribute('viewBox')).toBe('0 0 1 1');
    expect(shape.getBoundingClientRect().width).toBe(64);
  });

  it('fills with the color role', async () => {
    shape.style.setProperty('--md-sys-color-tertiary-container', 'rgb(1, 2, 3)');
    shape.color = 'tertiary-container';
    await settle();
    expect(getComputedStyle(path()).fill).toBe('rgb(1, 2, 3)');
  });

  it('centers content on the shape in the on- color of the role', async () => {
    shape.style.setProperty('--md-sys-color-on-error-container', 'rgb(7, 8, 9)');
    shape.color = 'error-container';
    shape.size = 80;
    const icon = document.createElement('span');
    icon.textContent = 'x';
    shape.append(icon);
    await settle();
    expect(getComputedStyle(icon).color).toBe('rgb(7, 8, 9)');
    const box = shape.getBoundingClientRect();
    const r = icon.getBoundingClientRect();
    expect(Math.abs(r.left + r.width / 2 - (box.left + box.width / 2))).toBeLessThan(1);
    expect(Math.abs(r.top + r.height / 2 - (box.top + box.height / 2))).toBeLessThan(1);
  });

  it('fills with the text color by default', async () => {
    shape.style.color = 'rgb(4, 5, 6)';
    await settle();
    expect(getComputedStyle(path()).fill).toBe('rgb(4, 5, 6)');
  });

  it('morphs into `to` with the matched paths of the pair', async () => {
    const [key, [start, end]] = Object.entries(SHAPE_MORPHS)[0];
    const [from, to] = key.split(':') as [ShapeElement['shape'], ShapeElement['shape']];
    shape.shape = from;
    shape.to = to;
    await settle();
    expect(svgEl().classList.contains('morph')).toBeTrue();
    expect(svgEl().style.getPropertyValue('--_from')).toBe(`path('${start}')`);
    expect(svgEl().style.getPropertyValue('--_to')).toBe(`path('${end}')`);
  });

  it('morphs a pair the other way round', async () => {
    // A pair whose reverse has no paths of its own.
    const [key, [start, end]] = Object.entries(SHAPE_MORPHS).find(
      ([k]) => !SHAPE_MORPHS[k.split(':').reverse().join(':')],
    )!;
    const [from, to] = key.split(':') as [ShapeElement['shape'], ShapeElement['shape']];
    shape.shape = to;
    shape.to = from;
    await settle();
    expect(svgEl().style.getPropertyValue('--_from')).toBe(`path('${end}')`);
    expect(svgEl().style.getPropertyValue('--_to')).toBe(`path('${start}')`);
  });

  it('stays still without a morph for the pair', async () => {
    shape.shape = 'circle';
    shape.to = 'square';
    await settle();
    expect(svgEl().classList.contains('morph')).toBeFalse();
    expect(path().getAttribute('d')).toBe(MATERIAL_SHAPES.circle);
  });

  it('reflects morphed, loop and color for styling', async () => {
    shape.morphed = true;
    shape.loop = true;
    shape.color = 'primary';
    await settle();
    expect(shape.hasAttribute('morphed')).toBeTrue();
    expect(shape.hasAttribute('loop')).toBeTrue();
    expect(shape.getAttribute('color')).toBe('primary');
  });
});
