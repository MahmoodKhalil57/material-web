/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {argbFromHex, Contrast, Hct} from '@material/material-color-utilities';

import {COLOR_ROLES, hctFromColor, SCHEME_VARIANTS, sourceColorFromPixels, themeFromImage, themeFromSource} from './dynamic-color.js';
import {styles as colorStyles} from './md-color-tokens.cssresult.js';

function tone(hex: string) {
  return Hct.fromInt(argbFromHex(hex)).tone;
}

function ratio(a: string, b: string) {
  return Contrast.ratioOfTones(tone(a), tone(b));
}

/** The color tokens md-color-tokens.css declares as `--md-sys-color-*`. */
function declared() {
  return new Set([...colorStyles.cssText.matchAll(/--md-sys-color-([a-z-]+):/g)].map((m) => m[1]));
}

const SOURCES = ['#6750a4', '#00696b', '#b33b15'];

describe('color roles', () => {
  // spec: color-roles-8db941
  it('declares every role as a --md-sys-color-* token', () => {
    const tokens = declared();
    for (const role of COLOR_ROLES) expect(tokens.has(role)).withContext(role).toBeTrue();
  });

  // spec: color-roles-13987a, color-roles-5ee6b4, color-roles-9baade, color-roles-879106, color-roles-83ea1e, color-roles-09a4bc, color-roles-f91f74
  it('has four roles for each of primary, secondary, tertiary and error', () => {
    const tokens = declared();
    for (const name of ['primary', 'secondary', 'tertiary', 'error']) {
      for (const role of [name, `on-${name}`, `${name}-container`, `on-${name}-container`]) {
        expect(tokens.has(role)).withContext(role).toBeTrue();
      }
    }
  });

  // spec: color-roles-eef364, color-roles-351e50, color-roles-ddb0e3, color-roles-8b44c1, color-roles-42df46, color-roles-642e89, color-roles-836085, color-roles-32d6f9, elevation-66697c
  it('has surface, on surface variant and five surface container roles', () => {
    const tokens = declared();
    for (const role of [
      'surface',
      'on-surface',
      'on-surface-variant',
      'surface-container-lowest',
      'surface-container-low',
      'surface-container',
      'surface-container-high',
      'surface-container-highest',
    ]) {
      expect(tokens.has(role)).withContext(role).toBeTrue();
    }
  });

  // spec: color-roles-490463, color-roles-791204, color-roles-3e5917, color-roles-3c9eff, color-roles-e35f67
  it('has inverse, outline and bright surface roles', () => {
    const tokens = declared();
    for (const role of [
      'inverse-surface',
      'inverse-on-surface',
      'inverse-primary',
      'outline',
      'outline-variant',
      'surface-bright',
      'surface-dim',
    ]) {
      expect(tokens.has(role)).withContext(role).toBeTrue();
    }
  });

  // spec: color-roles-73fab9, color-roles-de4f08, color-roles-dfe412, color-roles-46ea0b, color-roles-57c564, color-roles-369f75, color-roles-8f867c, color-roles-9363c7
  it('keeps text and icons readable (4.5:1) on their accent and container colors', () => {
    for (const source of SOURCES) {
      const theme = themeFromSource({source});
      for (const mode of ['light', 'dark'] as const) {
        for (const name of ['primary', 'secondary', 'tertiary', 'error']) {
          const t = theme[mode];
          expect(ratio(t[`on-${name}`], t[name])).withContext(`${source} ${mode} on-${name}`).toBeGreaterThanOrEqual(4.5);
          expect(ratio(t[`on-${name}-container`], t[`${name}-container`]))
            .withContext(`${source} ${mode} on-${name}-container`)
            .toBeGreaterThanOrEqual(4.5);
        }
      }
    }
  });
});

describe('on colors', () => {
  // spec: interaction-states-d59607
  it('gives every container color a corresponding on color', () => {
    const tokens = declared();
    const containers = [...tokens].filter((r) => /(^|-)container$/.test(r) && !r.startsWith('surface') && !r.startsWith('on-'));
    expect(containers.length).toBeGreaterThanOrEqual(4);
    for (const container of containers) {
      expect(tokens.has('on-' + container)).withContext(container).toBeTrue();
    }
  });
});

describe('dynamic color roles', () => {
  // spec: color-choosing-a-scheme-f3a27a, color-system-971a4d
  it('keeps the same role mappings across sources and variants', () => {
    const keys = (source: string, variant?: 'tonal-spot' | 'vibrant') =>
      Object.keys(themeFromSource({source, variant}).light).sort();
    expect(keys('#6750a4')).toEqual(keys('#00696b'));
    expect(keys('#6750a4')).toEqual(keys('#b33b15', 'vibrant'));
  });

  // spec: color-system-16610e
  it('generates both light and dark themes for any contrast level', () => {
    for (const contrast of ['standard', 'medium', 'high'] as const) {
      const theme = themeFromSource({source: '#6750a4', contrast});
      expect(theme.light.primary).not.toBe(theme.dark.primary);
      expect(ratio(theme.light['on-surface'], theme.light.surface)).toBeGreaterThanOrEqual(4.5);
      expect(ratio(theme.dark['on-surface'], theme.dark.surface)).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe("role groups and scheme generation", () => {
  const BASE = themeFromSource({source: "#6750a4"});

  // spec: color-roles-3a6d18, color-roles-2ad754, color-roles-c783f0, color-roles-7bf45f, color-system-caf233, color-system-ded507
  it("resolves the four primary roles for light and dark, readable on their pairs", () => {
    for (const mode of ["light", "dark"] as const) {
      const t = BASE[mode];
      for (const role of ["primary", "on-primary", "primary-container", "on-primary-container"]) {
        expect(t[role]).withContext(mode + " " + role).toMatch(/^#[0-9a-f]{6}$/i);
      }
      expect(t["on-primary-container"]).not.toBe(t["primary-container"]);
      expect(ratio(t["on-primary-container"], t["primary-container"])).toBeGreaterThanOrEqual(4.5);
    }
    expect(Math.abs(hctFromColor(BASE.light.primary).hue - hctFromColor("#6750a4").hue)).toBeLessThan(10);
    expect(BASE.dark.primary).not.toBe(BASE.light.primary);
  });

  // spec: color-roles-a8fe6f, color-roles-fc7557, color-roles-bea3ff, color-roles-c54932, color-roles-39e9bc
  it("resolves the secondary, tertiary and error accent roles in both modes", () => {
    const tokens = declared();
    for (const name of ["secondary", "tertiary", "error"]) {
      for (const role of [name, "on-" + name, name + "-container", "on-" + name + "-container"]) {
        expect(tokens.has(role)).withContext(role).toBeTrue();
        expect(BASE.light[role]).withContext("light " + role).toMatch(/^#[0-9a-f]{6}$/i);
        expect(BASE.dark[role]).withContext("dark " + role).toMatch(/^#[0-9a-f]{6}$/i);
      }
    }
  });

  // spec: color-roles-338773, color-roles-815de4, color-roles-24d9e2
  it("has inverse, outline and variant roles that differ from their non-variant pairs", () => {
    for (const mode of ["light", "dark"] as const) {
      const t = BASE[mode];
      for (const role of ["inverse-surface", "inverse-on-surface", "inverse-primary", "outline", "outline-variant", "on-surface-variant"]) {
        expect(t[role]).withContext(mode + " " + role).toMatch(/^#[0-9a-f]{6}$/i);
      }
      expect(t["outline-variant"]).not.toBe(t["outline"]);
      expect(t["on-surface-variant"]).not.toBe(t["on-surface"]);
      expect(ratio(t["inverse-on-surface"], t["inverse-surface"])).toBeGreaterThanOrEqual(4.5);
    }
  });

  // spec: color-roles-e94210, color-roles-444dd2, color-roles-6cbc21, color-roles-412b99, color-roles-0f6c26, color-roles-a4842f
  it("orders surface dim, surface and surface bright by tone in light and dark", () => {
    for (const mode of ["light", "dark"] as const) {
      const t = BASE[mode];
      expect(tone(t["surface-dim"])).withContext(mode).toBeLessThanOrEqual(tone(t["surface"]));
      expect(tone(t["surface"])).withContext(mode).toBeLessThanOrEqual(tone(t["surface-bright"]));
      expect(tone(t["surface-dim"])).withContext(mode).toBeLessThan(tone(t["surface-bright"]));
    }
    // Dim is dimmer than bright in light and dark, so the two swap relative to surface.
    expect(tone(BASE.light["surface-dim"])).toBeGreaterThan(tone(BASE.dark["surface-bright"]));
  });

  // spec: customization-e4e5cd, customization-eb8523, customization-84b0bf, customization-91d94b, customization-9edb65
  it("assigns the primary, secondary, tertiary, error and surface role groups", () => {
    for (const group of ["primary", "secondary", "tertiary"]) {
      for (const role of [group, "on-" + group, group + "-container", "on-" + group + "-container", group + "-fixed"]) {
        expect((COLOR_ROLES as readonly string[]).includes(role)).withContext(role).toBeTrue();
      }
    }
    for (const role of ["error", "on-error", "error-container", "on-error-container", "surface", "on-surface"]) {
      expect((COLOR_ROLES as readonly string[]).includes(role)).withContext(role).toBeTrue();
    }
  });

  // spec: customization-33dd62, customization-aa2a91, customization-ee7c17
  it("generates complementary tonal palettes and every role from one source color", () => {
    const brand = themeFromSource({source: "#b33b15"});
    expect(brand.light.primary.toLowerCase()).not.toBe(BASE.light.primary.toLowerCase());
    const primary = hctFromColor(brand.light["primary-container"]);
    const tertiary = hctFromColor(brand.light["tertiary-container"]);
    expect(Math.abs(primary.hue - tertiary.hue)).toBeGreaterThan(5);
    for (const mode of ["light", "dark"] as const) {
      for (const role of COLOR_ROLES) {
        expect(brand[mode][role]).withContext(mode + " " + role).toBeDefined();
      }
    }
  });

  // spec: color-advanced-590195, color-advanced-d2c6c8
  it("changes the vibrancy of the default roles with the scheme variant", () => {
    const chroma = (variant: (typeof SCHEME_VARIANTS)[number]) =>
      hctFromColor(themeFromSource({source: "#b33b15", variant}).light["primary-container"]).chroma;
    expect(chroma("vibrant")).toBeGreaterThan(chroma("neutral"));
    expect(chroma("monochrome")).toBeLessThan(chroma("tonal-spot"));
  });

  // spec: color-advanced-db493c
  it("offers fidelity and content variants that keep the input color tones", () => {
    expect(SCHEME_VARIANTS).toContain("fidelity");
    expect(SCHEME_VARIANTS).toContain("content");
    const source = "#b33b15";
    const input = hctFromColor(source);
    for (const variant of ["fidelity", "content"] as const) {
      const hct = hctFromColor(themeFromSource({source, variant}).light["primary-container"]);
      expect(Math.abs(hct.hue - input.hue)).withContext(variant).toBeLessThan(10);
    }
  });

  // spec: color-system-628a16
  it("generates a theme dynamically from a wallpaper or image", async () => {
    const pixels = new Uint8ClampedArray(64 * 4);
    for (let i = 0; i < 64; i++) pixels.set([0, 105, 107, 255], i * 4);
    const source = sourceColorFromPixels(pixels);
    expect(source).toBe("#00696b");
    expect(themeFromSource({source}).light.primary).toBeDefined();
    expect(typeof themeFromImage).toBe("function");
  });
});
