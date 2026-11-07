/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

// The tabs without CSS anchor positioning and without `@container style()`.
// Neither can be switched off in a browser that has it, so the compiled sheet
// is rewritten to what an older browser keeps: the `@supports` conditions on
// `anchor-name` are negated and the style queries dropped (tabs.scss).

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';

import tabsStyles from './tabs.cssresult.js';

adoptStyles(document, [m3Styles, tabsStyles]);

/** `tabs.css` as a browser without anchor positioning sees it. */
function withoutAnchorPositioning(sheet: CSSStyleSheet): CSSStyleSheet {
  const convert = (rules: CSSRuleList): string =>
    Array.from(rules)
      .map((rule) => {
        if (rule instanceof CSSSupportsRule) {
          const text = rule.conditionText;
          if (/anchor-name|anchor-scope/.test(text)) {
            const negated = /^not\b/.test(text);
            // `display: block` is true everywhere, `not (display: block)` false.
            const condition = negated ? '(display: block)' : 'not (display: block)';
            return `@supports ${condition} {${convert(rule.cssRules)}}`;
          }
        }
        if (rule instanceof CSSLayerBlockRule) {
          return `@layer ${rule.name} {${convert(rule.cssRules)}}`;
        }
        return rule.cssText;
      })
      .join('\n');
  const out = new CSSStyleSheet();
  out.replaceSync(convert(sheet.cssRules));
  return out;
}

describe('<div class="tabs"> without CSS anchor positioning', () => {
  const env = new Environment();

  let saved: CSSStyleSheet[];
  beforeEach(() => (saved = [...document.adoptedStyleSheets]));
  afterEach(() => (document.adoptedStyleSheets = saved));

  async function setup(sheet: CSSStyleSheet, variant = '') {
    document.adoptedStyleSheets = [...saved.filter((s) => s !== tabsStyles), sheet];
    const root = env.render(html`
      <div
        class="tabs ${variant}"
        style="inline-size: 400px"
        role="tablist">
        <button class="tab" role="tab">One</button>
        <button class="tab selected" role="tab" aria-selected="true">
          <span class="tab-label">Two</span>
        </button>
        <button class="tab" role="tab">Three</button>
      </div>
    `);
    await env.waitForStability();
    const bar = root.querySelector('.tabs') as HTMLElement;
    const selected = root.querySelector('.tab.selected') as HTMLElement;
    return {bar, selected};
  }

  const indicator = (bar: HTMLElement) => getComputedStyle(bar, '::after');

  it('draws the indicator on the bar when the browser has anchor positioning', async () => {
    const {bar, selected} = await setup(tabsStyles);
    expect(indicator(bar).display).not.toBe('none');
    expect(getComputedStyle(selected).backgroundImage).toBe('none');
  });

  it('underlines the selected tab itself', async () => {
    const {bar, selected} = await setup(withoutAnchorPositioning(tabsStyles));
    expect(indicator(bar).display).toBe('none');
    const style = getComputedStyle(selected);
    expect(style.backgroundImage).toContain('linear-gradient');
    // The bar is the active indicator height, along the bottom edge.
    const height = style.getPropertyValue('--active-indicator-height').trim();
    expect(style.backgroundSize.endsWith(` ${height}`)).toBeTrue();
    expect(style.backgroundPositionY).toBe('100%');
  });

  it('underlines only the selected tab', async () => {
    const {bar} = await setup(withoutAnchorPositioning(tabsStyles));
    const others = bar.querySelectorAll('.tab:not(.selected)');
    expect(others.length).toBe(2);
    for (const tab of others) {
      expect(getComputedStyle(tab).backgroundImage).toBe('none');
    }
  });

  it('spans the whole tab of a secondary bar', async () => {
    const {selected} = await setup(
      withoutAnchorPositioning(tabsStyles),
      'tabs-secondary',
    );
    const height = getComputedStyle(selected)
      .getPropertyValue('--active-indicator-height')
      .trim();
    expect(getComputedStyle(selected).backgroundSize).toBe(`100% ${height}`);
  });
});
