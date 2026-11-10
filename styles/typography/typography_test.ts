/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {adoptStyles} from '../adopt-styles.js';
import {styles as m3Styles} from '../m3.cssresult.js';
import {styles as typographyStyles} from './md-typography-tokens.cssresult.js';

adoptStyles(document, [m3Styles]);

const ROLES = ['display', 'headline', 'title', 'body', 'label'];
const SIZES = ['lg', 'md', 'sm'];

function styleOf(token: string, rootStyle = '') {
  const root = document.documentElement;
  const saved = root.getAttribute('style');
  root.style.cssText += ';' + rootStyle;
  const parent = document.createElement('div');
  const el = document.createElement('div');
  el.textContent = 'Hamburgefonstiv';
  el.style.cssText = `font: var(--md-sys-typescale-${token}); letter-spacing: var(--md-sys-typescale-${token}-tracking, normal)`;
  parent.append(el);
  document.body.append(parent);
  const s = getComputedStyle(el);
  const result = {
    size: parseFloat(s.fontSize),
    weight: Number(s.fontWeight),
    lineHeight: parseFloat(s.lineHeight),
    family: s.fontFamily,
    tracking: parseFloat(s.letterSpacing),
    height: el.getBoundingClientRect().height,
  };
  parent.remove();
  if (saved === null) root.removeAttribute('style'); else root.setAttribute('style', saved);
  return result;
}

describe('type scale', () => {
  const declared = new Set([...typographyStyles.cssText.matchAll(/--md-sys-typescale-([a-z-]+):/g)].map((m) => m[1]));

  // spec: typography-935467, typography-0a4619, typography-d81c57, typography-8c5d96
  it('has 15 baseline and 15 emphasized styles, three sizes per role', () => {
    for (const role of ROLES) {
      for (const size of SIZES) {
        expect(declared.has(`${role}-${size}`)).withContext(`${role}-${size}`).toBeTrue();
        expect(declared.has(`emphasized-${role}-${size}`)).withContext(`emphasized ${role}-${size}`).toBeTrue();
      }
    }
    const styles = [...declared].filter((n) => !/-(tracking|axes|font|size|weight|line-height)$/.test(n));
    expect(styles.length).toBe(30);
  });

  // spec: typography-01b055, typography-50bbb2
  it('swaps a baseline token for the emphasized one of the same style, with a heavier weight', () => {
    for (const role of ROLES) {
      const base = styleOf(`${role}-lg`);
      const emphasized = styleOf(`emphasized-${role}-lg`);
      expect(emphasized.size).toBe(base.size);
      expect(emphasized.lineHeight).toBe(base.lineHeight);
      expect(emphasized.weight).withContext(role).toBeGreaterThan(base.weight);
    }
  });

  // spec: typography-a961bd, typography-c10320
  it('expresses sizes in rem (sp / 16) and tracking in rem (px / sp)', () => {
    expect(styleOf('body-lg').size).toBe(16);
    expect(styleOf('body-md').size).toBe(14);
    expect(styleOf('body-lg').tracking).toBe(0.5);
    expect(styleOf('label-lg').tracking).toBeCloseTo(0.1, 5);
    expect(typographyStyles.cssText).toContain('--md-sys-typescale-body-md-size:0.875rem');
    expect(typographyStyles.cssText).toContain('--md-sys-typescale-body-md-line-height:calc(1.25rem');
  });

  // spec: typography-4ae5cf, typography-a5c422
  it('has a bounding box as tall as the line height', () => {
    for (const token of ['body-lg', 'headline-md', 'display-lg']) {
      const s = styleOf(token);
      expect(s.height).withContext(token).toBe(s.lineHeight);
    }
  });

  // spec: typography-4d8d26, typography-3593aa, typography-5690de, typography-c682e5
  it('uses the brand typeface for large styles and Roboto by default for both typefaces', () => {
    expect(typographyStyles.cssText).toMatch(/--md-ref-typeface-plain:\s*Roboto Flex,\s*Roboto/);
    expect(typographyStyles.cssText).toMatch(/--md-ref-typeface-brand:\s*var\(--md-ref-typeface-plain\)/);
    const brand = '--md-ref-typeface-brand: Georgia, serif';
    expect(styleOf('display-lg', brand).family).toContain('Georgia');
    expect(styleOf('headline-md', brand).family).toContain('Georgia');
    expect(styleOf('body-lg', brand).family).not.toContain('Georgia');
  });

  // spec: typography-e031db
  it('falls back from Roboto Flex to Roboto to Noto Sans', () => {
    const family = typographyStyles.cssText.match(/--md-ref-typeface-plain:\s*([^;}]+)/)![1];
    const names = family.split(',').map((n) => n.trim());
    expect(names.indexOf('Roboto Flex')).toBeLessThan(names.indexOf('Roboto'));
    expect(names.indexOf('Roboto')).toBeLessThan(names.indexOf('Noto Sans'));
  });
});

describe('type style customization', () => {
  function styleWith(css: string) {
    const el = document.createElement('p');
    el.textContent = 'Hamburgefonstiv';
    el.style.cssText = css;
    document.body.append(el);
    const s = getComputedStyle(el);
    const result = {family: s.fontFamily, variation: s.fontVariationSettings, optical: s.fontOpticalSizing};
    el.remove();
    return result;
  }

  // spec: typography-1de7ae, typography-b0568a, typography-d3ba1d
  it('applies variable axes and a different typeface to emphasized styles', () => {
    const axes = styleWith('font: var(--md-sys-typescale-emphasized-body-lg); font-variation-settings: var(--md-sys-typescale-emphasized-body-lg-axes)');
    expect(axes.variation).toContain('ROND');
    expect(axes.optical).toBe('auto');
    const custom = styleWith('font: var(--md-sys-typescale-emphasized-body-lg); font-family: Georgia');
    expect(custom.family).toContain('Georgia');
    expect(styleWith('font: var(--md-sys-typescale-body-lg)').family).not.toContain('Georgia');
  });
});
