/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Computed-style helpers shared by the central suites.
 */

import {deepElements} from './subjects.js';

/** The parent in the composed tree (through slots and shadow hosts). */
export function composedParent(e: Element): Element | null {
  return (
    e.assignedSlot ??
    e.parentElement ??
    ((e.parentNode instanceof ShadowRoot ? e.parentNode.host : null) as Element | null)
  );
}

/** The alpha of a computed color string (`rgb()`, `rgba()`, `color(srgb ...)`). */
export function colorAlpha(color: string): number {
  if (!color || color === 'transparent') return 0;
  const slash = color.match(/\/\s*([\d.]+)\s*\)/);
  if (slash) return Number(slash[1]);
  const rgba = color.match(/rgba\([^)]*,\s*([\d.]+)\)/);
  if (rgba) return Number(rgba[1]);
  return 1;
}

/** Elements of a subject that carry their own text. */
export function textElements(el: Element): Element[] {
  return deepElements(el).filter((e) =>
    Array.from(e.childNodes).some(
      (n) => n.nodeType === Node.TEXT_NODE && n.textContent!.trim() !== '',
    ),
  );
}

/** The product of the opacities of an element and its composed ancestors. */
export function inheritedOpacity(e: Element): number {
  let opacity = 1;
  for (let p: Element | null = e; p; p = composedParent(p)) {
    opacity *= Number(getComputedStyle(p).opacity);
  }
  return opacity;
}

/**
 * The alpha that text-bearing elements of a subject paint with: the alpha of
 * their text color times the opacity of every ancestor in the composed tree.
 */
export function contentAlphas(el: Element): number[] {
  return textElements(el).map((e) => {
    // Text that is a direct child of a host is painted where its default slot
    // is, so it inherits from the slot, not from the host.
    const source = e.shadowRoot?.querySelector('slot:not([name])') ?? e;
    return (
      Math.round(
        colorAlpha(getComputedStyle(source).color) * inheritedOpacity(source) * 1000,
      ) / 1000
    );
  });
}

/** Whether `node` is `el` or inside it, descending through shadow roots. */
export function isWithin(el: Element, node: Element | null): boolean {
  for (let p: Element | null = node; p; p = composedParent(p)) {
    if (p === el) return true;
  }
  return false;
}

/** Properties that move or reshape an element. */
const SPATIAL =
  /^(all|transform|translate|scale|rotate|inset|top|left|right|bottom|width|height|inline-size|block-size|min-|max-|margin|padding|border-.*radius|border-radius|clip-path|--ripple-scale|--_?(shape|radius))/;

/** `<tag>.<classes>: <property>` for each spatial transition that takes time. */
export function spatialTransitions(root: Element): string[] {
  const found: string[] = [];
  for (const e of deepElements(root)) {
    for (const pseudo of [undefined, '::before', '::after']) {
      const style = getComputedStyle(e, pseudo);
      const props = style.transitionProperty.split(',').map((p) => p.trim());
      const times = style.transitionDuration.split(',').map((d) => parseFloat(d) * (d.includes('ms') ? 0.001 : 1));
      props.forEach((prop, i) => {
        if (SPATIAL.test(prop) && times[i % times.length] > 0) {
          found.push(`${e.localName}.${e.className}${pseudo ?? ''}: ${prop}`);
        }
      });
    }
  }
  return found;
}


/**
 * A computed-style fingerprint of the painted parts (colors, backgrounds,
 * borders, shadows) of a subject and its shadow trees: it changes when a state
 * (selected, hovered, ...) changes how the subject looks.
 */
export function paintFingerprint(root: Element): string {
  return deepElements(root)
    .flatMap((e) =>
      [undefined, '::before', '::after'].map((pseudo) => {
        const style = getComputedStyle(e, pseudo);
        return [
          style.backgroundColor,
          style.backgroundImage,
          style.borderColor,
          style.outlineStyle,
          style.boxShadow,
          style.color,
        ].join(' ');
      }),
    )
    .join('|');
}
