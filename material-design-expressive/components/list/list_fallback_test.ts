/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

// The list without style queries and without `appearance: base-select`,
// `::picker()`, `::checkmark` or `width: stretch` (list.scss). Neither can be
// switched off in a browser that has them, so the compiled sheet is rewritten
// to what an older browser keeps: those `@supports` blocks and `@container
// style()` blocks are dropped, and the rules outside them stay.

import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';

import listStyles from './list.cssresult.js';

adoptStyles(document, [m3Styles]);

/** Rules an older browser drops from `list.css`. */
const isNewer = (rule: CSSRule): boolean =>
  /^@container\b[^{]*style\(/.test(rule.cssText) ||
  /^@supports\b[^{]*(base-select|picker|stretch|checkmark)/.test(rule.cssText);

/** A copy of `sheet` without the rules `drop` matches, at any depth. */
function stripped(
  sheet: CSSStyleSheet,
  drop: (rule: CSSRule) => boolean,
): CSSStyleSheet {
  const convert = (rules: CSSRuleList): string =>
    Array.from(rules)
      .filter((rule) => !drop(rule))
      .map((rule) =>
        rule instanceof CSSLayerBlockRule
          ? `@layer ${rule.name} {${convert(rule.cssRules)}}`
          : rule.cssText,
      )
      .join('\n');
  const out = new CSSStyleSheet();
  out.replaceSync(convert(sheet.cssRules));
  return out;
}

const withoutNewer = (sheet: CSSStyleSheet) =>
  stripped(sheet, isNewer);

describe('<div class="list"> without style queries and newer CSS', () => {
  const env = new Environment();

  let saved: CSSStyleSheet[];
  beforeEach(() => (saved = [...document.adoptedStyleSheets]));
  afterEach(() => (document.adoptedStyleSheets = saved));

  async function setup(sheet: CSSStyleSheet, className = 'list') {
    document.adoptedStyleSheets = [
      ...saved.filter((s) => s !== listStyles),
      sheet,
    ];
    const root = env.render(html`
      <div class="${className}" role="list" style="inline-size: 360px">
        <div class="list-item" role="listitem">One</div>
        <div class="list-item" role="listitem">Two</div>
        <div class="list-item" role="listitem">Three</div>
      </div>
    `);
    await env.waitForStability();
    const list = root.querySelector('.list') as HTMLElement;
    const items = Array.from(
      root.querySelectorAll<HTMLElement>('.list-item'),
    );
    return {list, items};
  }

  /** The color a `var()` resolves to in this document. */
  function resolvedColor(value: string): string {
    const probe = document.createElement('div');
    probe.style.backgroundColor = value;
    document.body.append(probe);
    const color = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return color;
  }

  it('drops the style queries and the newer selectors', () => {
    const css = withoutNewer(listStyles).cssRules;
    const text = Array.from(css)
      .map((rule) => rule.cssText)
      .join('\n');
    expect(text).not.toContain('@container');
    expect(text).not.toContain('base-select');
    expect(text).not.toMatch(/width:\s*stretch/);
    // The rules outside those blocks stay.
    expect(text).toContain('.list-select');
    expect(text).toContain('.list-item');
  });

  it('keeps the segmented container color without the style query', async () => {
    const {items} = await setup(withoutNewer(listStyles), 'list list-segmented');
    const surface = resolvedColor('var(--md-sys-color-surface)');
    expect(surface).not.toBe('rgba(0, 0, 0, 0)');
    for (const item of items) {
      expect(getComputedStyle(item).backgroundColor).toBe(surface);
    }
  });

  it('gives the first and last segments the container radius', async () => {
    const {list, items} = await setup(
      withoutNewer(listStyles),
      'list list-segmented',
    );
    const [first, middle, last] = items;
    const radius = (el: HTMLElement, corner: string) =>
      getComputedStyle(el).getPropertyValue(`border-${corner}-radius`);
    const container = radius(list, 'top-left');
    // The container shape is larger than a segment's own shape.
    expect(container).not.toBe(radius(middle, 'top-left'));
    // First segment: its top corners follow the container, bottom corners
    // match a middle segment.
    expect(radius(first, 'top-left')).toBe(container);
    expect(radius(first, 'top-right')).toBe(container);
    expect(radius(first, 'bottom-left')).toBe(radius(middle, 'bottom-left'));
    // Last segment: the bottom corners follow the container.
    expect(radius(last, 'bottom-left')).toBe(container);
    expect(radius(last, 'bottom-right')).toBe(container);
    expect(radius(last, 'top-left')).toBe(radius(middle, 'top-left'));
  });

  it('applies the native-select rule without base-select or ::picker', async () => {
    document.adoptedStyleSheets = [
      ...saved.filter((s) => s !== listStyles),
      withoutNewer(listStyles),
    ];
    const root = env.render(html`
      <select class="list-select" aria-label="Choose">
        <option>One</option>
        <option>Two</option>
      </select>
    `);
    await env.waitForStability();
    const select = root.querySelector('select') as HTMLSelectElement;
    const style = getComputedStyle(select);
    // `.list-select { border: none; background: none }` is not in a guard.
    expect(style.borderTopStyle).toBe('none');
    expect(style.backgroundImage).toBe('none');
    // The select keeps working as a native select.
    expect(select.options.length).toBe(2);
    select.value = 'Two';
    expect(select.value).toBe('Two');
  });

  it('fills the list width where width: stretch is missing', async () => {
    const {list, items} = await setup(withoutNewer(listStyles));
    const listWidth = list.getBoundingClientRect().width;
    expect(listWidth).toBe(360);
    for (const item of items) {
      expect(item.getBoundingClientRect().width).toBe(listWidth);
    }
  });
});
