/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {
  argbFromHex,
  Contrast,
  Hct,
  SchemeFruitSalad,
  SchemeRainbow,
} from '@material/material-color-utilities';

import {
  applyTheme,
  clearTheme,
  COLOR_ROLES,
  contrastValue,
  createScheme,
  customColorRoles,
  DEFAULT_SPEC_VERSION,
  effectiveSpecVersion,
  harmonize,
  PLATFORMS,
  SCHEME_VARIANTS,
  SPEC_2025_VARIANTS,
  SPEC_VERSIONS,
  sourceColorFromImage,
  sourceColorFromPixels,
  themeFromImage,
  themeFromSource,
  themeProperties,
  themeToCss,
  themeToStyleSheet,
} from './dynamic-color.js';
import {styles as contrastStyles} from './md-color-tokens-contrast.cssresult.js';
import {styles as colorStyles} from './md-color-tokens.cssresult.js';

const HEX = /^#[0-9a-f]{6}$/;

function hct(hex: string) {
  return Hct.fromInt(argbFromHex(hex));
}

function ratio(a: string, b: string) {
  return Contrast.ratioOfTones(hct(a).tone, hct(b).tone);
}

function hueDistance(a: number, b: number) {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

/** The `--md-sys-color-*` names a stylesheet declares, in order. */
function declaredRoles(cssText: string) {
  const firstRule = cssText.slice(0, cssText.indexOf('}'));
  return [...firstRule.matchAll(/--md-sys-color-([a-z-]+):/g)].map((m) => m[1]);
}

describe('dynamic color', () => {
  describe('COLOR_ROLES', () => {
    it('matches the roles md-color-tokens.css defines', () => {
      expect(declaredRoles(colorStyles.cssText)).toEqual([...COLOR_ROLES]);
    });

    it('matches the roles md-color-tokens-contrast.css defines', () => {
      expect(declaredRoles(contrastStyles.cssText)).toEqual([...COLOR_ROLES]);
    });
  });

  describe('themeFromSource()', () => {
    it('generates every role for every variant, spec version and platform', () => {
      for (const variant of SCHEME_VARIANTS) {
        for (const specVersion of SPEC_VERSIONS) {
          for (const platform of PLATFORMS) {
            const theme = themeFromSource({
              source: '#6750a4',
              variant,
              specVersion,
              platform,
            });
            const context = `${variant} ${specVersion} ${platform}`;
            for (const role of COLOR_ROLES) {
              expect(theme.light[role])
                .withContext(`${context} light ${role}`)
                .toMatch(HEX);
              expect(theme.dark[role])
                .withContext(`${context} dark ${role}`)
                .toMatch(HEX);
            }
            expect(theme.variant).toBe(variant);
            expect(theme.platform).toBe(platform);
          }
        }
      }
    });

    it('produces distinct schemes per variant', () => {
      const primaries = new Set(
        SCHEME_VARIANTS.map(
          (variant) =>
            themeFromSource({source: '#b33b15', variant}).light[
              'primary-container'
            ],
        ),
      );
      expect(primaries.size).toBeGreaterThanOrEqual(6);
    });

    it('defaults to tonal spot at standard contrast, 2025 spec, phone', () => {
      const theme = themeFromSource({source: '#6750A4'});
      expect(theme.variant).toBe('tonal-spot');
      expect(theme.contrast).toBe(0);
      expect(theme.source).toBe('#6750a4');
      expect(DEFAULT_SPEC_VERSION).toBe('2025');
      expect(theme.specVersion).toBe('2025');
      expect(theme.platform).toBe('phone');
    });

    it('accepts an ARGB source', () => {
      expect(themeFromSource({source: 0xff6750a4}).light).toEqual(
        themeFromSource({source: '#6750a4'}).light,
      );
    });

    it('keeps the monochrome scheme gray', () => {
      const theme = themeFromSource({source: '#b33b15', variant: 'monochrome'});
      // Hex rounding leaves a little chroma.
      expect(hct(theme.light.primary).chroma).toBeLessThan(4);
      expect(hct(theme.light.surface).chroma).toBeLessThan(4);
    });

    // spec: color-advanced-1b60f6, color-advanced-7d0681
    it('matches the source tone with fidelity', () => {
      const source = '#b33b15';
      const fidelity = themeFromSource({source, variant: 'fidelity'});
      const tonalSpot = themeFromSource({source});
      const toneDelta = (hex: string) => Math.abs(hct(hex).tone - hct(source).tone);
      expect(toneDelta(fidelity.light['primary-container'])).toBeLessThan(
        toneDelta(tonalSpot.light['primary-container']),
      );
      expect(hct(fidelity.light['primary-container']).chroma).toBeGreaterThan(
        hct(tonalSpot.light['primary-container']).chroma,
      );
    });

    const FIXED_ROLES = [
      'primary-fixed',
      'primary-fixed-dim',
      'on-primary-fixed',
      'on-primary-fixed-variant',
      'secondary-fixed',
      'tertiary-fixed-dim',
    ] as const;

    it('keeps fixed roles the same in light and dark (2021)', () => {
      const theme = themeFromSource({source: '#00696b', specVersion: '2021'});
      for (const role of FIXED_ROLES) {
        expect(theme.dark[role]).withContext(role).toBe(theme.light[role]);
      }
    });

    it('keeps fixed roles at the same tone in light and dark (2025)', () => {
      // roles.md: fixed colors "maintain the same tone in light and dark
      // themes". 2025 palettes can have less chroma in dark theme (tonal spot
      // primary: 26 vs 32), so hex values can differ but the tones match.
      for (const variant of SPEC_2025_VARIANTS) {
        const theme = themeFromSource({source: '#00696b', variant});
        for (const role of FIXED_ROLES) {
          expect(
            Math.abs(hct(theme.dark[role]).tone - hct(theme.light[role]).tone),
          )
            .withContext(`${variant} ${role}`)
            .toBeLessThan(1);
        }
      }
    });

    it('orders surface containers from lowest to highest in light theme', () => {
      const {light} = themeFromSource({source: '#00696b'});
      const tones = [
        'surface-container-lowest',
        'surface-container-low',
        'surface-container',
        'surface-container-high',
        'surface-container-highest',
      ].map((role) => hct(light[role]).tone);
      for (let i = 1; i < tones.length; i++) {
        expect(tones[i]).toBeLessThan(tones[i - 1]);
      }
    });

    // spec: color-system-8a5f95, color-system-4cc19f
    it('raises contrast for medium (3:1+) and high (7:1+) levels', () => {
      const pairs = [
        ['on-surface-variant', 'surface-container-highest'],
        ['on-surface', 'surface-container'],
        ['outline', 'surface'],
      ];
      const cases = SPEC_VERSIONS.flatMap((specVersion) =>
        ['#6750a4', '#ffde3f', '#00696b'].map(
          (source) => [source, specVersion] as const,
        ),
      );
      for (const [source, specVersion] of cases) {
        const standard = themeFromSource({source, specVersion});
        const medium = themeFromSource({
          source,
          specVersion,
          contrast: 'medium',
        });
        const high = themeFromSource({source, specVersion, contrast: 'high'});
        expect(medium.contrast).toBe(0.5);
        expect(high.contrast).toBe(1);
        for (const [fg, bg] of pairs) {
          for (const mode of ['light', 'dark'] as const) {
            const s = ratio(standard[mode][fg], standard[mode][bg]);
            const m = ratio(medium[mode][fg], medium[mode][bg]);
            const h = ratio(high[mode][fg], high[mode][bg]);
            const context = `${source} ${specVersion} ${mode} ${fg}/${bg}`;
            // Contrast never drops below what the lower level gives, except
            // that pairs already past 7:1 may trade some of it (MCU 0.4's 2021
            // rules lighten dark surface containers at higher contrast).
            expect(m)
              .withContext(context)
              .toBeGreaterThanOrEqual(Math.min(s, 7) - 0.05);
            expect(h)
              .withContext(context)
              .toBeGreaterThanOrEqual(Math.min(m, 7) - 0.05);
            expect(h).withContext(context).toBeGreaterThanOrEqual(7 - 0.05);
          }
        }
        expect(
          ratio(high.light['on-primary'], high.light.primary),
        ).toBeGreaterThanOrEqual(7 - 0.05);
      }
    });

    it('rejects invalid input', () => {
      expect(() => themeFromSource({source: 'purple'})).toThrowError(/hex/);
      expect(() =>
        themeFromSource({source: '#6750a4', contrast: 'extra' as 'high'}),
      ).toThrowError(/contrast/);
      expect(() =>
        createScheme('#6750a4', 'pastel' as 'neutral'),
      ).toThrowError(/variant/);
      expect(() =>
        themeFromSource({source: '#6750a4', specVersion: '2024' as '2025'}),
      ).toThrowError(/spec version/);
      expect(() =>
        themeFromSource({source: '#6750a4', platform: 'tv' as 'phone'}),
      ).toThrowError(/platform/);
    });
  });

  describe('spec version', () => {
    const source = '#6750a4';

    it('generates the 2021 tonal spot scheme', () => {
      // MCU 2021 tonal spot for #6750A4 (as in Material Theme Builder).
      const {light, dark} = themeFromSource({source, specVersion: '2021'});
      expect(light.primary).toBe('#65558f');
      expect(light['primary-container']).toBe('#e9ddff');
      expect(light.surface).toBe('#fdf7ff');
      expect(light.error).toBe('#ba1a1a');
      expect(dark.primary).toBe('#cfbdfe');
      expect(dark.surface).toBe('#141218');
    });

    it('applies 2025 rules to tonal spot, neutral, vibrant and expressive', () => {
      for (const variant of SPEC_2025_VARIANTS) {
        const v2021 = themeFromSource({source, variant, specVersion: '2021'});
        const v2025 = themeFromSource({source, variant, specVersion: '2025'});
        expect(v2021.specVersion).toBe('2021');
        expect(v2025.specVersion).withContext(variant).toBe('2025');
        expect(
          createScheme(source, variant, false, 0, {specVersion: '2025'})
            .specVersion,
        )
          .withContext(variant)
          .toBe('2025');
        const changed = COLOR_ROLES.filter(
          (role) =>
            v2021.light[role] !== v2025.light[role] ||
            v2021.dark[role] !== v2025.dark[role],
        );
        expect(changed.length).withContext(variant).toBeGreaterThan(10);
      }
    });

    it('falls back to 2021 for variants without 2025 rules', () => {
      for (const variant of SCHEME_VARIANTS) {
        if (SPEC_2025_VARIANTS.includes(variant)) continue;
        const v2025 = themeFromSource({source: '#b33b15', variant});
        const v2021 = themeFromSource({
          source: '#b33b15',
          variant,
          specVersion: '2021',
        });
        expect(v2025.specVersion).withContext(variant).toBe('2021');
        expect(effectiveSpecVersion(variant, '2025')).toBe('2021');
        expect(v2025.light).withContext(variant).toEqual(v2021.light);
        expect(v2025.dark).withContext(variant).toEqual(v2021.dark);
      }
    });

    it('uses the MCU rainbow and fruit salad schemes', () => {
      expect(createScheme(source, 'rainbow')).toBeInstanceOf(SchemeRainbow);
      expect(createScheme(source, 'fruit-salad')).toBeInstanceOf(
        SchemeFruitSalad,
      );
    });

    it('changes the 2025 scheme for the watch platform only', () => {
      const phone = themeFromSource({source});
      const watch = themeFromSource({source, platform: 'watch'});
      expect(watch.platform).toBe('watch');
      expect(watch.dark).not.toEqual(phone.dark);
      expect(
        themeFromSource({source, specVersion: '2021', platform: 'watch'}).dark,
      ).toEqual(themeFromSource({source, specVersion: '2021'}).dark);
    });

    // spec: color-choosing-a-scheme-1b7f48
    it('keeps on-colors at 4.5:1 or more in both versions', () => {
      for (const specVersion of SPEC_VERSIONS) {
        for (const variant of SCHEME_VARIANTS) {
          const theme = themeFromSource({source, variant, specVersion});
          for (const mode of ['light', 'dark'] as const) {
            for (const [fg, bg] of [
              ['on-primary', 'primary'],
              ['on-primary-container', 'primary-container'],
              ['on-surface', 'surface'],
              ['on-error-container', 'error-container'],
            ]) {
              expect(ratio(theme[mode][fg], theme[mode][bg]))
                .withContext(`${variant} ${specVersion} ${mode} ${fg}/${bg}`)
                .toBeGreaterThanOrEqual(4.5 - 0.05);
            }
          }
        }
      }
    });
  });

  describe('contrastValue()', () => {
    it('maps names and clamps numbers', () => {
      expect(contrastValue('standard')).toBe(0);
      expect(contrastValue('medium')).toBe(0.5);
      expect(contrastValue('high')).toBe(1);
      expect(contrastValue(2)).toBe(1);
      expect(contrastValue(-3)).toBe(-1);
      expect(contrastValue()).toBe(0);
    });
  });

  describe('custom colors', () => {
    const success = {name: 'success', value: '#00a86b'};

    for (const specVersion of SPEC_VERSIONS) {
      it(`follows the ${specVersion} spec rules`, () => {
        const theme = themeFromSource({
          source: '#6750a4',
          specVersion,
          customColors: [success],
        });
        for (const mode of ['light', 'dark'] as const) {
          expect(
            ratio(
              theme[mode]['on-success-container'],
              theme[mode]['success-container'],
            ),
          ).toBeGreaterThanOrEqual(4.5);
        }
      });
    }

    // spec: color-advanced-4adc56, color-advanced-b234a7, color-advanced-d5db50, color-advanced-1dbb9a, color-advanced-4f2269, color-system-6b31b7
    it('adds color, on-color, container and on-container roles', () => {
      const theme = themeFromSource({source: '#6750a4', customColors: [success]});
      expect(theme.customRoles).toEqual(customColorRoles('success'));
      expect(theme.customRoles).toEqual([
        'success',
        'on-success',
        'success-container',
        'on-success-container',
      ]);
      for (const mode of ['light', 'dark'] as const) {
        for (const role of theme.customRoles) {
          expect(theme[mode][role]).withContext(`${mode} ${role}`).toMatch(HEX);
        }
        expect(
          ratio(theme[mode]['on-success'], theme[mode]['success']),
        ).toBeGreaterThanOrEqual(4.5);
        expect(
          ratio(theme[mode]['on-success-container'], theme[mode]['success-container']),
        ).toBeGreaterThanOrEqual(4.5);
      }
      // Light accents are dark and light containers are light.
      expect(hct(theme.light['success']).tone).toBeLessThan(50);
      expect(hct(theme.light['success-container']).tone).toBeGreaterThan(70);
      expect(hct(theme.dark['success']).tone).toBeGreaterThan(50);
    });

    // spec: color-advanced-f4af44, color-advanced-dabda6
    it('harmonizes toward the source hue by default', () => {
      const source = '#6750a4';
      const harmonized = themeFromSource({source, customColors: [success]});
      const exact = themeFromSource({
        source,
        customColors: [{...success, harmonize: false}],
      });
      const sourceHue = hct(source).hue;
      expect(
        hueDistance(hct(harmonized.light['success']).hue, sourceHue),
      ).toBeLessThan(hueDistance(hct(exact.light['success']).hue, sourceHue));
      expect(
        hueDistance(hct(exact.light['success']).hue, hct(success.value).hue),
      ).toBeLessThan(3);
    });

    it('follows the contrast level', () => {
      const high = themeFromSource({
        source: '#6750a4',
        contrast: 'high',
        customColors: [success],
      });
      expect(
        ratio(high.light['on-success-container'], high.light['success-container']),
      ).toBeGreaterThanOrEqual(7 - 0.05);
    });

    it('keeps its color in a monochrome scheme', () => {
      const theme = themeFromSource({
        source: '#6750a4',
        variant: 'monochrome',
        customColors: [{...success, harmonize: false}],
      });
      expect(hct(theme.light['success']).chroma).toBeGreaterThan(20);
    });

    it('rejects invalid and conflicting names', () => {
      expect(() =>
        themeFromSource({source: '#000000', customColors: [{name: 'Success', value: '#0f0'}]}),
      ).toThrowError(/kebab-case/);
      expect(() =>
        themeFromSource({source: '#000000', customColors: [{name: 'primary', value: '#0f0'}]}),
      ).toThrowError(/overrides/);
      expect(() =>
        themeFromSource({
          source: '#000000',
          customColors: [
            {name: 'brand', value: '#0f0'},
            {name: 'brand', value: '#f00'},
          ],
        }),
      ).toThrowError(/Duplicate/);
    });
  });

  describe('harmonize()', () => {
    // spec: color-advanced-0a8cd9
    it('moves hue at most 15 degrees toward the source', () => {
      const red = '#ff0000';
      const blue = '#0000ff';
      const result = harmonize(red, blue);
      const moved = hueDistance(hct(result).hue, hct(red).hue);
      expect(moved).toBeGreaterThan(5);
      expect(moved).toBeLessThanOrEqual(15.5);
      expect(hueDistance(hct(result).hue, hct(blue).hue)).toBeLessThan(
        hueDistance(hct(red).hue, hct(blue).hue),
      );
    });
  });

  describe('themeToCss()', () => {
    const theme = themeFromSource({
      source: '#00696b',
      customColors: [{name: 'brand', value: '#ff5722', harmonize: false}],
    });

    it('declares light-dark() values on :root in the md.sys.color layer', () => {
      const css = themeToCss(theme);
      expect(css).toMatch(/^@layer md\.sys\.color \{ :root \{ color-scheme: light dark;/);
      expect(css).toContain(
        `--md-sys-color-primary: light-dark(${theme.light.primary}, ${theme.dark.primary});`,
      );
      // Roles that are the same in light and dark get a plain value.
      for (const role of COLOR_ROLES) {
        const light = theme.light[role];
        const dark = theme.dark[role];
        const value = light === dark ? light : `light-dark(${light}, ${dark})`;
        expect(css).toContain(`--md-sys-color-${role}: ${value};`);
      }
      expect(css).toContain(
        `--md-sys-color-secondary-fixed: ${theme.light['secondary-fixed']};`,
      );
      expect(css).toContain('--md-sys-color-on-brand-container:');
    });

    it('emits light or dark values only', () => {
      const dark = themeToCss(theme, {dark: true, selector: '.x', layer: ''});
      expect(dark).toMatch(/^\.x \{ color-scheme: dark;/);
      expect(dark).toContain(`--md-sys-color-surface: ${theme.dark.surface};`);
      expect(dark).not.toContain('light-dark');
      const light = themeToCss(theme, {dark: false});
      expect(light).toContain(`--md-sys-color-surface: ${theme.light.surface};`);
    });

    it('creates a parsable stylesheet', () => {
      const sheet = themeToStyleSheet(theme);
      expect(sheet.cssRules.length).toBe(1);
    });

    it('lists every property', () => {
      expect(themeProperties(theme).length).toBe(COLOR_ROLES.length + 4);
    });
  });

  describe('applyTheme()', () => {
    let host: HTMLElement;

    beforeEach(() => {
      document.adoptedStyleSheets = [colorStyles.styleSheet!];
      host = document.createElement('div');
      document.body.append(host);
    });

    afterEach(() => {
      clearTheme(document);
      host.remove();
      document.adoptedStyleSheets = [];
    });

    function computed(element: Element, role: string) {
      return getComputedStyle(element)
        .getPropertyValue(`--md-sys-color-${role}`)
        .trim();
    }

    it('themes a document, replacing the previous theme', () => {
      const first = applyTheme(document, {source: '#b33b15', dark: false});
      expect(document.adoptedStyleSheets.length).toBe(2);
      expect(computed(document.documentElement, 'primary')).toBe(first.light.primary);

      const second = applyTheme(document, {source: '#00696b', dark: true});
      expect(document.adoptedStyleSheets.length).toBe(2);
      expect(computed(document.documentElement, 'primary')).toBe(second.dark.primary);
      expect(getComputedStyle(document.documentElement).colorScheme).toBe('dark');

      clearTheme(document);
      expect(document.adoptedStyleSheets.length).toBe(1);
    });

    it('themes a shadow root on :host', () => {
      const root = host.attachShadow({mode: 'open'});
      root.innerHTML = '<span></span>';
      const theme = applyTheme(root, {source: '#ffde3f', dark: false});
      expect(computed(root.querySelector('span')!, 'tertiary')).toBe(
        theme.light.tertiary,
      );
    });

    it('themes an element subtree with inline properties', () => {
      const child = document.createElement('span');
      host.append(child);
      const theme = applyTheme(host, {
        source: '#00696b',
        variant: 'vibrant',
        dark: true,
        customColors: [{name: 'success', value: '#00a86b'}],
      });
      expect(computed(child, 'primary')).toBe(theme.dark.primary);
      expect(computed(child, 'success-container')).toBe(
        theme.dark['success-container'],
      );
      expect(host.style.colorScheme).toBe('dark');

      clearTheme(host);
      expect(host.getAttribute('style') ?? '').toBe('');
    });

    it('adds a prefers-contrast rule for auto contrast', () => {
      applyTheme(document, {source: '#6750a4', contrast: 'auto'});
      const sheet = document.adoptedStyleSheets[document.adoptedStyleSheets.length - 1];
      const text = [...sheet.cssRules].map((r) => r.cssText).join('');
      expect(text).toContain('prefers-contrast: more');
    });
  });

  describe('source color from images', () => {
    function canvas(colors: string[]) {
      const c = document.createElement('canvas');
      c.width = 64 * colors.length;
      c.height = 64;
      const ctx = c.getContext('2d')!;
      colors.forEach((color, i) => {
        ctx.fillStyle = color;
        ctx.fillRect(i * 64, 0, 64, 64);
      });
      return c;
    }

    it('picks the color from pixels', () => {
      const pixels: number[] = [];
      for (let i = 0; i < 100; i++) pixels.push(0, 105, 107, 255);
      // Transparent pixels are ignored.
      for (let i = 0; i < 100; i++) pixels.push(255, 0, 0, 0);
      expect(sourceColorFromPixels(pixels)).toBe('#00696b');
    });

    it('picks the dominant colorful color from a canvas', async () => {
      const source = await sourceColorFromImage(
        canvas(['#1565c0', '#1565c0', '#1565c0', '#808080']),
      );
      expect(hueDistance(hct(source).hue, hct('#1565c0').hue)).toBeLessThan(5);
    });

    it('reads ImageData', async () => {
      const c = canvas(['#c2185b']);
      const data = c.getContext('2d')!.getImageData(0, 0, c.width, c.height);
      const source = await sourceColorFromImage(data);
      expect(hueDistance(hct(source).hue, hct('#c2185b').hue)).toBeLessThan(5);
    });

    it('reads an image element', async () => {
      const img = new Image();
      img.src = canvas(['#2e7d32']).toDataURL();
      await img.decode();
      const source = await sourceColorFromImage(img);
      expect(hueDistance(hct(source).hue, hct('#2e7d32').hue)).toBeLessThan(5);
    });

    // spec: color-dynamic-e85e37, color-dynamic-7aa671
    it('generates a content-based theme from an image', async () => {
      const theme = await themeFromImage(canvas(['#ef6c00']));
      expect(theme.variant).toBe('content');
      expect(hueDistance(hct(theme.light.primary).hue, hct('#ef6c00').hue)).toBeLessThan(10);
      const tonal = await themeFromImage(canvas(['#ef6c00']), {
        variant: 'tonal-spot',
        contrast: 'high',
      });
      expect(tonal.variant).toBe('tonal-spot');
      expect(tonal.contrast).toBe(1);
    });
  });

  describe('static contrast levels (md-color-tokens-contrast.css)', () => {
    let element: HTMLElement;

    beforeEach(() => {
      document.adoptedStyleSheets = [
        colorStyles.styleSheet!,
        contrastStyles.styleSheet!,
      ];
      element = document.createElement('div');
      element.style.colorScheme = 'light';
      document.body.append(element);
    });

    afterEach(() => {
      element.remove();
      document.adoptedStyleSheets = [];
    });

    function primary() {
      return getComputedStyle(element)
        .getPropertyValue('--md-sys-color-primary')
        .trim();
    }

    it('applies the spec medium and high contrast baseline values', () => {
      const standard = primary();
      element.className = 'md-contrast-medium';
      const medium = primary();
      element.className = 'md-contrast-high';
      const high = primary();
      // md.sys.color.primary: primary40 / medium primary30 / high primary20.
      expect(standard).toContain('#6750a4');
      expect(medium).toContain('#4f378b');
      expect(high).toContain('#381e72');
    });

    it('resets a subtree to standard contrast', () => {
      element.className = 'md-contrast-high';
      const child = document.createElement('div');
      child.className = 'md-contrast-standard';
      element.append(child);
      expect(
        getComputedStyle(child).getPropertyValue('--md-sys-color-primary'),
      ).toContain('#6750a4');
    });

    it('follows prefers-contrast: more on :root', () => {
      const text = [...contrastStyles.styleSheet!.cssRules]
        .map((r) => r.cssText)
        .join('');
      expect(text).toContain('prefers-contrast: more');
    });
  });
});
