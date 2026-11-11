/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

// The ripple without `@property` (ripple.scss). Registering the layer values
// cannot be switched off in a browser that has `@property`, so the compiled
// sheet is rewritten to what an older browser keeps: the registrations are
// dropped. The `:where(.ripple)` initial values stay, so the layers resolve
// to the same values, without the typed animation.

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../../../styles/m3.cssresult.js';

import rippleStyles from './ripple.cssresult.js';

adoptStyles(document, [m3Styles]);

/** `ripple.css` as a browser without `@property` sees it. */
function withoutProperty(sheet: CSSStyleSheet): CSSStyleSheet {
  const convert = (rules: CSSRuleList): string =>
    Array.from(rules)
      .filter((rule) => !/^@property\b/.test(rule.cssText))
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

describe('<span class="ripple"> without @property', () => {
  const env = new Environment();

  let saved: CSSStyleSheet[];
  beforeEach(() => (saved = [...document.adoptedStyleSheets]));
  afterEach(() => (document.adoptedStyleSheets = saved));

  async function setup(sheet: CSSStyleSheet, className = 'ripple') {
    document.adoptedStyleSheets = [
      ...saved.filter((s) => s !== rippleStyles),
      sheet,
    ];
    const root = env.render(html`
      <span class="${className}" style="display: block; inline-size: 80px; block-size: 40px"></span>
    `);
    await env.waitForStability();
    return root.querySelector('.ripple') as HTMLElement;
  }

  const layer = (el: HTMLElement, name: string) =>
    getComputedStyle(el).getPropertyValue(name).trim();

  it('drops the @property registrations and keeps the initial values', () => {
    const text = Array.from(withoutProperty(rippleStyles).cssRules)
      .map((rule) => rule.cssText)
      .join('\n');
    expect(text).not.toContain('@property');
    expect(text).toContain(':where(.ripple)');
  });

  it('starts every layer at its initial value', async () => {
    const el = await setup(withoutProperty(rippleStyles));
    expect(layer(el, '--ripple-hover-opacity')).toBe('0%');
    expect(layer(el, '--ripple-press-opacity')).toBe('0%');
    // `--ripple-scale` is not checked here: the `ripple-release` animation
    // holds it at 100% while it runs, with or without `@property`.
    expect(layer(el, '--ripple-x')).toBe('50%');
    expect(layer(el, '--ripple-y')).toBe('50%');
  });

  it('shows the hover layer at its end value on hover emulation', async () => {
    const el = await setup(withoutProperty(rippleStyles), 'ripple hover');
    expect(layer(el, '--ripple-hover-opacity')).toBe('8%');
    expect(getComputedStyle(el).backgroundImage).toContain('radial-gradient');
  });

  it('shows the focus and pressed layers at their end values', async () => {
    const focused = await setup(withoutProperty(rippleStyles), 'ripple focus');
    expect(layer(focused, '--ripple-hover-opacity')).toBe('10%');
    focused.remove();
    const pressed = await setup(withoutProperty(rippleStyles), 'ripple active');
    expect(layer(pressed, '--ripple-press-opacity')).toBe('10%');
  });

  it('takes the end value at once, without a typed transition', async () => {
    const el = await setup(withoutProperty(rippleStyles));
    el.classList.add('hover');
    // Read straight away: an unregistered custom property does not animate,
    // so the state value is there without waiting.
    expect(layer(el, '--ripple-hover-opacity')).toBe('8%');
  });
});
