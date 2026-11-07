/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {argbFromHex, Contrast, Hct} from '@material/material-color-utilities';

import {adoptStyles} from '../adopt-styles.js';

import {
  applyTheme,
  clearTheme,
  COLOR_ROLES,
  harmonize,
  sourceColorFromPixels,
  themeFromImage,
  themeFromSource,
} from './dynamic-color.js';
import {styles as colorStyles} from './md-color-tokens.cssresult.js';

adoptStyles(document, [colorStyles]);

function hct(hex: string) {
  return Hct.fromInt(argbFromHex(hex));
}

function ratio(a: string, b: string) {
  return Contrast.ratioOfTones(hct(a).tone, hct(b).tone);
}

/** The color a role resolves to for an element in the given color scheme. */
function resolved(role: string, scheme: 'light' | 'dark', parent: Element = document.body) {
  const el = document.createElement('div');
  el.style.cssText = `color-scheme:${scheme};color:var(--md-sys-color-${role})`;
  parent.append(el);
  const color = getComputedStyle(el).color;
  el.remove();
  return color;
}

function rgbToHex(rgb: string) {
  const [r, g, b] = rgb.match(/[\d.]+/g)!.map(Number);
  return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
}

describe('baseline (static) color scheme', () => {
  // spec: color-static-58b912, color-static-f7f813, color-static-f2a4c9, color-static-d2abff, color-choosing-a-scheme-6c7eeb, color-system-8ff7c3
  it('provides light and dark values for the roles with accessible pairings', () => {
    expect(rgbToHex(resolved('primary', 'light'))).toBe('#6750a4');
    expect(rgbToHex(resolved('primary', 'dark'))).toBe('#d0bcff');
    for (const scheme of ['light', 'dark'] as const) {
      const hex = (role: string) => rgbToHex(resolved(role, scheme));
      expect(ratio(hex('on-primary'), hex('primary'))).toBeGreaterThanOrEqual(4.5);
      expect(ratio(hex('on-secondary-container'), hex('secondary-container')))
        .toBeGreaterThanOrEqual(4.5);
    }
  });

  // spec: color-system-802f14, color-system-8200d2, color-system-94f87a, color-system-3f99cc
  it('uses tone 98 for the light surface and a darker dark surface (tone-based)', () => {
    const theme = themeFromSource({source: '#6750a4', specVersion: '2021'});
    expect(Math.round(hct(theme.light['surface']).tone)).toBe(98);
    expect(Math.round(hct(theme.dark['surface']).tone)).toBe(6);
    expect(Math.round(hct(rgbToHex(resolved('surface', 'light'))).tone)).toBe(98);
    // Surface roles are tone steps, not elevation overlays.
    const tones = ['lowest', 'low', '', 'high', 'highest'].map(
      (n) => hct(theme.dark[n ? `surface-container-${n}` : 'surface-container']).tone,
    );
    for (let i = 1; i < tones.length; i++) expect(tones[i]).toBeGreaterThan(tones[i - 1]);
  });
});

describe('color roles', () => {
  // spec: color-system-db17f2, color-system-8a915d, color-system-50dfec, color-system-c68144
  it('assigns tones of the palettes to roles in light and dark', () => {
    const theme = themeFromSource({source: '#6750a4', specVersion: '2021'});
    expect(Math.round(hct(theme.light['primary']).tone)).toBe(40);
    expect(Math.round(hct(theme.light['on-primary']).tone)).toBe(100);
    expect(Math.round(hct(theme.dark['primary']).tone)).toBe(80);
    expect(Math.round(hct(theme.dark['on-primary']).tone)).toBe(20);
    expect(theme.dark['primary']).not.toBe(theme.light['primary']);
  });

  // spec: color-roles-d48fe9, color-roles-1f7917, color-system-b3e5d6, color-system-2a1457, color-system-5f573e
  it('keeps role pairs legible and raises their contrast with the contrast level', () => {
    const pairs = [
      ['on-primary', 'primary'],
      ['on-secondary-container', 'secondary-container'],
      ['on-surface', 'surface-container'],
    ];
    for (const mode of ['light', 'dark'] as const) {
      const [standard, medium, high] = (['standard', 'medium', 'high'] as const).map(
        (contrast) => themeFromSource({source: '#6750a4', contrast})[mode],
      );
      for (const [on, bg] of pairs) {
        const r = [standard, medium, high].map((t) => ratio(t[on], t[bg]));
        expect(r[0]).withContext(`${mode} ${on} standard`).toBeGreaterThanOrEqual(3);
                expect(r[1]).withContext(`${mode} ${on} medium`).toBeGreaterThanOrEqual(3);
        expect(r[2]).withContext(`${mode} ${on} high`).toBeGreaterThanOrEqual(7);
      }
    }
  });

  // spec: color-roles-de16db, color-roles-55236f, color-roles-98b7b8
  it('keeps error roles the same for every source color but adapts them to light and dark', () => {
    const a = themeFromSource({source: '#6750a4', specVersion: '2021'});
    const b = themeFromSource({source: '#00696b', variant: 'vibrant', specVersion: '2021'});
    expect(a.light['error']).toBe(b.light['error']);
    expect(a.dark['error']).toBe(b.dark['error']);
    expect(a.light['error']).not.toBe(a.dark['error']);
  });

  // spec: color-roles-73288b, color-roles-16ebde, color-roles-07545f, color-roles-47f081, color-roles-094e42, color-roles-2be243, color-system-12a635
  it('has fixed, fixed dim and on-fixed roles that keep their tone in both themes', () => {
    const theme = themeFromSource({source: '#6750a4', specVersion: '2021'});
    for (const group of ['primary', 'secondary', 'tertiary']) {
      for (const role of [`${group}-fixed`, `${group}-fixed-dim`, `on-${group}-fixed`, `on-${group}-fixed-variant`]) {
        expect(COLOR_ROLES as readonly string[]).toContain(role);
        expect(Math.abs(hct(theme.light[role]).tone - hct(theme.dark[role]).tone)).withContext(role).toBeLessThan(1);
      }
      // Dim is a stronger (darker) tone than the fixed color.
      expect(hct(theme.light[`${group}-fixed-dim`]).tone).toBeLessThan(hct(theme.light[`${group}-fixed`]).tone);
    }
    // A container role changes tone between themes; a fixed one does not.
    expect(Math.abs(hct(theme.light['primary-container']).tone - hct(theme.dark['primary-container']).tone))
      .toBeGreaterThan(20);
  });

  // spec: color-roles-ccea04, color-roles-28395b, color-roles-fe5cbd, color-roles-9b48cf, color-roles-961d88, color-roles-2b0395
  it('keeps surface bright brighter than surface dim in both themes while surface inverts', () => {
    const theme = themeFromSource({source: '#6750a4'});
    for (const mode of ['light', 'dark'] as const) {
      expect(hct(theme[mode]['surface-bright']).tone).toBeGreaterThan(hct(theme[mode]['surface-dim']).tone);
    }
    expect(hct(theme.light['surface']).tone).toBeGreaterThan(90);
    expect(hct(theme.dark['surface']).tone).toBeLessThan(15);
    // Surface bright is bright in dark theme, relative to surface.
    expect(hct(theme.dark['surface-bright']).tone).toBeGreaterThan(hct(theme.dark['surface']).tone);
    expect(hct(theme.light['surface-dim']).tone).toBeLessThan(hct(theme.light['surface']).tone);
  });

  // spec: color-roles-5fc125, color-roles-8aff3f
  it('has inverse roles that reverse the surrounding theme', () => {
    const theme = themeFromSource({source: '#6750a4'});
    expect(hct(theme.light['inverse-surface']).tone).toBeLessThan(hct(theme.light['surface']).tone - 50);
    expect(hct(theme.dark['inverse-surface']).tone).toBeGreaterThan(hct(theme.dark['surface']).tone + 50);
    expect(ratio(theme.light['inverse-on-surface'], theme.light['inverse-surface'])).toBeGreaterThanOrEqual(4.5);
    expect(ratio(theme.light['inverse-primary'], theme.light['inverse-surface'])).toBeGreaterThanOrEqual(3);
  });

  // spec: color-roles-332861, color-roles-bb2234, color-roles-95c6ce, color-roles-95aded, color-roles-e40a60, color-roles-8e5a51, color-roles-aecde9, color-roles-5484fb, color-roles-178347
  it('has the primary, secondary, tertiary, error, outline variant and on surface roles', () => {
    for (const role of [
      'primary', 'primary-container', 'secondary', 'secondary-container',
      'tertiary', 'tertiary-container', 'error', 'error-container',
      'outline-variant', 'on-surface',
    ]) {
      expect(COLOR_ROLES as readonly string[]).toContain(role);
    }
    // Containers are fills: lighter than their accent in light theme.
    const light = themeFromSource({source: '#6750a4'}).light;
    expect(hct(light['primary-container']).tone).toBeGreaterThan(hct(light['primary']).tone);
  });
});

describe('dynamic color', () => {
  afterEach(() => clearTheme(document));

  function primary() {
    return rgbToHex(resolved('primary', 'light'));
  }

  // spec: color-dynamic-f16282, color-system-f196f2, color-system-252f1b, color-system-f79a23, color-system-d09f4a, color-system-9d3878, color-system-ac7f23, customization-6f0064
  it('updates every role when the source color changes', () => {
    const first = applyTheme(document, {source: '#b33b15', dark: false});
    expect(primary()).toBe(first.light.primary);
    const second = applyTheme(document, {source: '#00696b', dark: false});
    expect(primary()).toBe(second.light.primary);
    expect(second.light.primary).not.toBe(first.light.primary);
  });

  // spec: customization-8ac684
  it('generates accessible contrast and legibility from a new source automatically', () => {
    for (const source of ['#ffde3f', '#00ff00', '#0000ff', '#808080']) {
      const t = themeFromSource({source});
      for (const mode of ['light', 'dark'] as const) {
        expect(ratio(t[mode]['on-primary'], t[mode]['primary'])).withContext(`${source} ${mode}`).toBeGreaterThanOrEqual(4.5);
        expect(ratio(t[mode]['on-surface'], t[mode]['surface'])).withContext(`${source} ${mode}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  // spec: color-dynamic-fa04b6, color-dynamic-560eed, color-dynamic-ecd81a
  it('turns on-screen imagery into a content-based scheme', async () => {
    const pixels = new Uint8ClampedArray(64 * 64 * 4);
    for (let i = 0; i < pixels.length; i += 4) {
      pixels.set([200, 30, 40, 255], i);
    }
    const data = new ImageData(pixels, 64, 64);
    expect(Math.abs(hct(sourceColorFromPixels(pixels)).hue - 22)).toBeLessThan(10);
    const theme = await themeFromImage(data);
    expect(theme.variant).toBe('content');
    // The scheme corresponds to the picture: its primary container shares the hue.
    const hue = hct(theme.source).hue;
    const diff = Math.abs(hct(theme.light['primary-container']).hue - hue);
    expect(Math.min(diff, 360 - diff)).toBeLessThan(40);
    applyTheme(document, {source: theme.source, variant: 'content', dark: false});
    expect(primary()).toBe(themeFromSource({source: theme.source, variant: 'content'}).light.primary);
  });
});

describe('advanced color customization', () => {
  afterEach(() => clearTheme(document));

  // spec: color-advanced-286034, color-advanced-059e1c, color-advanced-62210c, color-advanced-9e2daf, color-advanced-f8e1a4, color-advanced-9be345
  it('derives the regular roles from your own input colors', () => {
    const baseline = themeFromSource({source: '#6750a4'});
    const custom = themeFromSource({
      source: '#6750a4',
      palettes: {primary: '#006a6a', secondary: '#7a5900', tertiary: {hue: 25, chroma: 40}, neutral: '#7a7a00'},
    });
    expect(custom.light.primary).not.toBe(baseline.light.primary);
    expect(Math.abs(hct(custom.light.primary).hue - hct('#006a6a').hue)).toBeLessThan(5);
    expect(Math.abs(hct(custom.light['tertiary']).hue - 25)).toBeLessThan(5);
    expect(hct(custom.light['secondary-container']).hue).not.toBeCloseTo(hct(baseline.light['secondary-container']).hue, 0);
    // Same role set, still accessible, and light/dark both exist.
    expect(Object.keys(custom.dark).sort()).toEqual(Object.keys(baseline.dark).sort());
    for (const mode of ['light', 'dark'] as const) {
      expect(ratio(custom[mode]['on-primary'], custom[mode]['primary'])).toBeGreaterThanOrEqual(4.5);
    }
    // Palettes you leave out come from the variant.
    const c2021 = themeFromSource({source: '#6750a4', specVersion: '2021', palettes: {primary: '#006a6a'}});
    expect(c2021.light['error']).toBe(themeFromSource({source: '#6750a4', specVersion: '2021'}).light['error']);
  });

  // spec: color-advanced-4889e4, color-advanced-d006f4, color-advanced-c6497a, color-advanced-d3507f, color-advanced-7ffed4
  it('extends the roles with a custom color that follows the accent conventions', () => {
    const theme = themeFromSource({source: '#6750a4', customColors: [{name: 'success', value: '#00a86b'}]});
    expect(theme.customRoles.length).toBe(4);
    // Reference tones like the accents: 40 / 100 / 90 / 10 in light theme.
    const accent = themeFromSource({source: '#00a86b', specVersion: '2021'});
    const tones = (t: typeof theme, names: string[]) => names.map((n) => Math.round(hct(t.light[n]).tone));
    const two = themeFromSource({source: '#6750a4', specVersion: '2021', customColors: [{name: 'success', value: '#00a86b', harmonize: false}]});
    expect(tones(two, ['success', 'on-success', 'success-container', 'on-success-container']))
      .toEqual(tones(accent, ['primary', 'on-primary', 'primary-container', 'on-primary-container']));
  });

  // spec: color-advanced-c0ffbf, color-advanced-e8cc6e
  it('harmonizes a static color toward the primary hue', () => {
    const source = '#6750a4';
    const color = '#00a86b';
    const shifted = harmonize(color, source);
    const dist = (a: number, b: number) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));
    expect(dist(hct(shifted).hue, hct(source).hue)).toBeLessThan(dist(hct(color).hue, hct(source).hue));
  });

  // spec: color-advanced-a3024e, color-advanced-e89777
  it('lets custom components use the role tokens of a customized scheme', () => {
    applyTheme(document, {source: '#6750a4', dark: false, customColors: [{name: 'success', value: '#00a86b'}]});
    const el = document.createElement('div');
    el.style.color = 'var(--md-sys-color-success-container)';
    document.body.append(el);
    const color = getComputedStyle(el).color;
    el.remove();
    expect(color).not.toBe('');
    expect(color).toMatch(/^rgb/);
  });
});

describe('custom components and contrast levels', () => {
  afterEach(() => clearTheme(document));

  function pair(scheme: 'light' | 'dark') {
    const el = document.createElement('div');
    el.style.cssText = `color-scheme:${scheme};background:var(--md-sys-color-primary-container);color:var(--md-sys-color-on-primary-container)`;
    document.body.append(el);
    const style = getComputedStyle(el);
    const result = [rgbToHex(style.backgroundColor), rgbToHex(style.color)];
    el.remove();
    return result;
  }

  // spec: color-system-5f8f59, color-system-61b2a8, color-system-5de469, color-system-51a3cd, color-system-4e431e, color-system-5791f6, color-system-8dbe39
  it('lets a custom component follow theme and contrast level through the role tokens', () => {
    const ratios = [];
    for (const contrast of ['standard', 'medium', 'high'] as const) {
      applyTheme(document, {source: '#6750a4', contrast});
      const [container, on] = pair('light');
      ratios.push(ratio(on, container));
      // The same roles serve the dark theme.
      const [darkContainer, darkOn] = pair('dark');
      expect(darkContainer).not.toBe(container);
      expect(ratio(darkOn, darkContainer)).toBeGreaterThanOrEqual(4.5);
    }
    expect(ratios[2]).toBeGreaterThanOrEqual(7);
    expect(ratios[2]).toBeGreaterThan(ratios[0]);
  });

  // spec: color-system-8db239
  it('gives a dark container tone and a light label tone, at 3:1 or more', () => {
    const t = themeFromSource({source: '#6750a4'});
    expect(hct(t.light['primary']).tone).toBeLessThan(hct(t.light['on-primary']).tone);
    expect(ratio(t.light['on-primary'], t.light['primary'])).toBeGreaterThanOrEqual(3);
  });

  // spec: color-system-c420c4, color-system-d3fa1f, color-system-3cd21e, color-system-aa8593
  it('customizes a scheme with static or harmonized colors, an image source and key colors', async () => {
    const t = themeFromSource({
      source: '#6750a4',
      customColors: [
        {name: 'brand', value: '#ff6600', harmonize: false},
        {name: 'success', value: '#00a86b'},
      ],
      palettes: {secondary: '#336699'},
    });
    expect(t.customRoles.length).toBe(8);
    const image = new ImageData(new Uint8ClampedArray(16 * 16 * 4).fill(255), 16, 16);
    expect((await themeFromImage(image)).source).toMatch(/^#[0-9a-f]{6}$/);
  });
});

describe('text colors', () => {
  // spec: typography-41ca91, typography-4a8dba, typography-f4c546, typography-366342, typography-c9dba1, typography-bfa309, typography-908bf1, typography-95e232, typography-b1c0be, typography-375977
  it('reaches 4.5:1 for small text and 3:1 for large text with on surface and on surface variant', () => {
    for (const scheme of ['light', 'dark'] as const) {
      const surface = rgbToHex(resolved('surface', scheme));
      for (const role of ['on-surface', 'on-surface-variant']) {
        const text = rgbToHex(resolved(role, scheme));
        expect(ratio(text, surface)).withContext(`${scheme} ${role}`).toBeGreaterThanOrEqual(4.5);
      }
      for (const role of ['primary', 'tertiary']) {
        const text = rgbToHex(resolved(role, scheme));
        expect(ratio(text, surface)).withContext(`${scheme} ${role}`).toBeGreaterThanOrEqual(3);
      }
    }
  });
});
