/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {argbFromHex, Contrast, Hct} from '@material/material-color-utilities';

import {COLOR_ROLES, themeFromSource} from './dynamic-color.js';
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
