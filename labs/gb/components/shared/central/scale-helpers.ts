/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview The closed M3 scales (type, shape, elevation, color roles) as
 * the browser resolves them, for the per-part scale checks of suite 7.
 */

import {colorAlpha, textElements} from './style-helpers.js';
import {deepElements} from './subjects.js';

/** Resolves a CSS value for a property by computing it on a probe element. */
function resolve(property: string, value: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, value);
  probe.style.position = 'absolute';
  document.body.append(probe);
  const resolved = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return resolved;
}

/** `rgb(r, g, b)` of a computed color (alpha dropped), or null if invisible. */
export function rgbOf(color: string): string | null {
  if (!color || colorAlpha(color) === 0) return null;
  const srgb = color.match(/color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)/);
  if (srgb) return `rgb(${srgb.slice(1, 4).map((n) => Math.round(Number(n) * 255)).join(', ')})`;
  const rgb = color.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)/);
  return rgb ? `rgb(${rgb[1]}, ${rgb[2]}, ${rgb[3]})` : color;
}

const names = (re: RegExp) => {
  const out = new Set<string>();
  for (const sheet of [...document.adoptedStyleSheets, ...Array.from(document.styleSheets)]) {
    const text = Array.from(sheet.cssRules).map((r) => r.cssText).join('\n');
    for (const m of text.matchAll(re)) out.add(m[0]);
  }
  return [...out];
};

/** Every `--md-sys-color-*` role as a resolved rgb string. */
export function colorRoles(): Set<string> {
  const roles = new Set<string>();
  for (const name of names(/--md-sys-color-[a-z0-9-]+(?=\s*:)/g)) {
    const rgb = rgbOf(resolve('color', `var(${name})`));
    if (rgb) roles.add(rgb);
  }
  return roles;
}

/** Every type role as `size|line-height|weight`. */
export function typeScale(): Set<string> {
  const scale = new Set<string>();
  for (const name of names(/--md-sys-typescale-[a-z-]+(?=\s*:)/g)) {
    if (/-(axes|tracking)$/.test(name)) continue;
    const probe = document.createElement('div');
    probe.style.font = `var(${name})`;
    probe.style.position = 'absolute';
    document.body.append(probe);
    const s = getComputedStyle(probe);
    if (s.fontSize) scale.add(`${s.fontSize}|${s.lineHeight}|${s.fontWeight}`);
    probe.remove();
  }
  return scale;
}

/** The corner radii of the shape scale, in px, plus 0 and "full" (>= 100). */
export function shapeScale(): Set<number> {
  const radii = new Set<number>([0]);
  for (const name of names(/--md-sys-shape-corner-[a-z0-9-]+(?=\s*:)/g)) {
    const value = resolve('border-top-left-radius', `var(${name})`);
    if (value.endsWith('px')) radii.add(parseFloat(value));
  }
  return radii;
}

/** The elevation shadows (levels 0 to 5) as resolved `box-shadow`. */
export function elevations(): Set<string> {
  const shadows = new Set<string>(['none']);
  for (const name of names(/--md-sys-elevation-shadow-[0-9]+(?=\s*:)/g)) {
    shadows.add(resolve('box-shadow', `var(${name})`));
  }
  return shadows;
}

/** A violation of one of the scales, as `element: detail`. */
export type Violation = string;

const label = (e: Element) => `${e.localName}.${typeof e.className === 'string' ? e.className.trim() : ''}`;

/** Text that is not set in a type role. */
export function offTypeScale(root: Element, scale = typeScale()): Violation[] {
  const bad: Violation[] = [];
  for (const e of textElements(root)) {
    // Icons are glyphs (their size is the icon size); card content is the
    // author's slotted text, which the card does not style.
    if (e.localName === 'md-gb-icon' || e.localName === 'md-gb-card') continue;
    const source = e.shadowRoot?.querySelector('slot:not([name])') ?? e;
    const s = getComputedStyle(source);
    const key = `${s.fontSize}|${s.lineHeight}|${s.fontWeight}`;
    if (!scale.has(key)) bad.push(`${label(e)}: ${key}`);
  }
  return bad;
}

/** Corners that are not on the shape scale. */
export function offShapeScale(root: Element, scale = shapeScale()): Violation[] {
  const bad: Violation[] = [];
  for (const e of deepElements(root)) {
    const s = getComputedStyle(e);
    for (const corner of [
      s.borderTopLeftRadius,
      s.borderTopRightRadius,
      s.borderBottomRightRadius,
      s.borderBottomLeftRadius,
    ]) {
      for (const part of corner.split(' ')) {
        if (part.endsWith('%')) continue;
        const px = parseFloat(part);
        if (px >= 100 || scale.has(px)) continue;
        // Half the box is the "full" corner of any size.
        const box = e.getBoundingClientRect();
        if (Math.abs(px - Math.min(box.width, box.height) / 2) < 0.6) continue;
        bad.push(`${label(e)}: ${corner}`);
      }
    }
  }
  return bad;
}

/** Shadows that are not an elevation level. */
export function offElevationScale(root: Element, scale = elevations()): Violation[] {
  const bad: Violation[] = [];
  for (const e of deepElements(root)) {
    const shadow = getComputedStyle(e).boxShadow;
    if (!scale.has(shadow)) bad.push(`${label(e)}: ${shadow.slice(0, 80)}`);
  }
  return bad;
}

/** Colors (text, fill, borders) that are not an M3 color role. */
export function offColorRoles(root: Element, roles = colorRoles()): Violation[] {
  const bad: Violation[] = [];
  for (const e of deepElements(root)) {
    const s = getComputedStyle(e);
    const colors: Array<[string, string]> = [['background-color', s.backgroundColor]];
    // Not painted: a hidden measuring span. Card text is the author's.
    const painted = s.visibility !== 'hidden' && Number(s.opacity) > 0 && e.localName !== 'md-gb-card';
    if (painted && textElements(root).includes(e)) {
      const source = e.shadowRoot?.querySelector('slot:not([name])') ?? e;
      colors.push(['color', getComputedStyle(source).color]);
    }
    if (parseFloat(s.borderTopWidth) > 0 && s.borderTopStyle !== 'none') {
      colors.push(['border-color', s.borderTopColor]);
    }
    for (const [property, value] of colors) {
      const rgb = rgbOf(value);
      if (rgb && !roles.has(rgb)) bad.push(`${label(e)} ${property}: ${rgb}`);
    }
  }
  return bad;
}
