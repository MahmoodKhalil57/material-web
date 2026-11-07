/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

// The switch without `if()` in its handle size (switch.scss). `if()` cannot be
// switched off in a browser that has it, so the compiled sheet is rewritten to
// what an older browser keeps: the `@supports (width: if(...))` block is
// dropped, and the rule that sizes the handle for an icon stays.

import {html, nothing} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';

import switchStyles from './switch.cssresult.js';

adoptStyles(document, [m3Styles]);

/** `switch.css` as a browser without `if()` sees it. */
function withoutIf(sheet: CSSStyleSheet): CSSStyleSheet {
  const convert = (rules: CSSRuleList): string =>
    Array.from(rules)
      .filter((rule) => !/^@supports\b[^{]*\bif\(/.test(rule.cssText))
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

describe('<button class="switch"> without if()', () => {
  const env = new Environment();

  let saved: CSSStyleSheet[];
  beforeEach(() => (saved = [...document.adoptedStyleSheets]));
  afterEach(() => (document.adoptedStyleSheets = saved));

  async function setup(sheet: CSSStyleSheet, withIcon: boolean) {
    document.adoptedStyleSheets = [
      ...saved.filter((s) => s !== switchStyles),
      sheet,
    ];
    const root = env.render(html`
      <button role="switch" aria-checked="false" class="switch">
        <span class="switch-touch" aria-hidden="true"></span>
        ${withIcon
          ? html`<span class="switch-icon-off">close</span>`
          : nothing}
        <span class="switch-icon-on">check</span>
      </button>
    `);
    await env.waitForStability();
    return root.querySelector('.switch') as HTMLElement;
  }

  /** The handle size as the `::before` (the handle) resolves it. */
  const handleSize = (sw: HTMLElement) =>
    getComputedStyle(sw, '::before')
      .getPropertyValue('--_handle-size')
      .trim();

  it('drops the if() rule and keeps the others', () => {
    const text = Array.from(withoutIf(switchStyles).cssRules)
      .map((rule) => rule.cssText)
      .join('\n');
    expect(text).not.toContain('if(');
    expect(text).toContain('.switch-icon-off');
    expect(text).toContain('--_icon-handle-size');
  });

  it('keeps the regular handle width without an icon', async () => {
    const sw = await setup(withoutIf(switchStyles), false);
    expect(handleSize(sw)).toContain('16px');
    expect(getComputedStyle(sw).getPropertyValue('--_icon-handle-size').trim()).toBe('');
  });

  it('grows the handle for an icon from the :has() rule', async () => {
    const sw = await setup(withoutIf(switchStyles), true);
    // `:has(.switch-icon-off)` sets the icon handle size; the handle reads it
    // without `if()`, so it is the larger of the two sizes.
    expect(getComputedStyle(sw).getPropertyValue('--_icon-handle-size')).toContain(
      '24px',
    );
    expect(handleSize(sw)).toContain('24px');
  });
});
