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

  const after = (el: Element) => getComputedStyle(el, '::after');

  it('draws the primary indicator under the selected tab content', async () => {
    const {bar, selected} = await setup(withoutAnchorPositioning(tabsStyles));
    expect(indicator(bar).display).toBe('none');
    // The tab itself paints nothing; its label does.
    expect(getComputedStyle(selected).backgroundImage).toBe('none');
    const label = selected.querySelector('.tab-label')!;
    const style = after(label);
    const height = getComputedStyle(selected)
      .getPropertyValue('--active-indicator-height')
      .trim();
    expect(style.position).toBe('absolute');
    expect(style.height).toBe(height);
    expect(style.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  });

  it('spans the content of a primary tab inset on each side, not the tab', async () => {
    const {selected} = await setup(withoutAnchorPositioning(tabsStyles));
    const label = selected.querySelector('.tab-label')!;
    const inset = parseFloat(
      getComputedStyle(selected).getPropertyValue('--active-indicator-inset'),
    );
    const content = label.getBoundingClientRect();
    expect(parseFloat(after(label).width)).toBeCloseTo(content.width - 2 * inset, 1);
    // Narrower than the tab, which is a third of the bar.
    expect(parseFloat(after(label).width)).toBeLessThan(
      selected.getBoundingClientRect().width / 2,
    );
  });

  // md.comp.primary-navigation-tab.active-indicator.shape: 3dp top corners,
  // square bottom corners.
  it('rounds the top corners of the primary indicator like the anchored one', async () => {
    const {selected} = await setup(withoutAnchorPositioning(tabsStyles));
    const label = selected.querySelector('.tab-label')!;
    const style = after(label);
    expect(style.borderTopLeftRadius).toBe('3px');
    expect(style.borderTopRightRadius).toBe('3px');
    expect(style.borderBottomLeftRadius).toBe('0px');
    expect(style.borderBottomRightRadius).toBe('0px');
  });

  it('puts the primary indicator on the tab bottom edge', async () => {
    const {selected} = await setup(withoutAnchorPositioning(tabsStyles));
    const label = selected.querySelector('.tab-label')!;
    const style = after(label);
    const labelBox = label.getBoundingClientRect();
    const tabBox = selected.getBoundingClientRect();
    const bottom = labelBox.bottom - parseFloat(style.bottom);
    expect(bottom).toBeCloseTo(tabBox.bottom, 0);
  });

  it('puts the stacked primary indicator under the label only', async () => {
    const root = env.render(html`
      <div class="tabs" style="inline-size: 400px" role="tablist">
        <button class="tab selected" role="tab" aria-selected="true">
          <span class="md-icon" style="inline-size: 24px; block-size: 24px"></span>
          <span class="tab-label">Two</span>
        </button>
        <button class="tab" role="tab">Three</button>
      </div>
    `);
    document.adoptedStyleSheets = [
      ...saved.filter((s) => s !== tabsStyles),
      withoutAnchorPositioning(tabsStyles),
    ];
    await env.waitForStability();
    const tab = root.querySelector('.tab.selected') as HTMLElement;
    const label = tab.querySelector('.tab-label')!;
    expect(after(label).position).toBe('absolute');
    const bottom =
      label.getBoundingClientRect().bottom - parseFloat(after(label).bottom);
    expect(bottom).toBeCloseTo(tab.getBoundingClientRect().bottom, 0);
  });

  it('underlines only the selected tab', async () => {
    const {bar} = await setup(withoutAnchorPositioning(tabsStyles));
    const others = bar.querySelectorAll('.tab:not(.selected)');
    expect(others.length).toBe(2);
    for (const tab of others) {
      expect(getComputedStyle(tab).backgroundImage).toBe('none');
    }
  });

  it('spans the whole tab of a secondary bar with square corners', async () => {
    const {selected} = await setup(
      withoutAnchorPositioning(tabsStyles),
      'tabs-secondary',
    );
    const height = getComputedStyle(selected)
      .getPropertyValue('--active-indicator-height')
      .trim();
    expect(getComputedStyle(selected).backgroundSize).toBe(`100% ${height}`);
    // No content indicator: the gradient is the whole indicator.
    expect(after(selected.querySelector('.tab-label')!).content).toBe('none');
  });
});
