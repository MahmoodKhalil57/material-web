/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

// The pull to refresh without `touch-action: pan-down` (pull-to-refresh.scss).
// Browsers without it keep `touch-action: auto` at the top: the content scrolls
// normally and the touch pull stays inactive. The element documents the
// alternative: a refresh button in the app that calls `refresh()`. The
// compiled sheet is rewritten to what such a browser keeps: the
// `@supports (touch-action: pan-down)` block is dropped.

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';

import './md-gb-pull-to-refresh.js';
import pullToRefreshStyles from './pull-to-refresh.cssresult.js';
import {type PullToRefreshElement} from './pull-to-refresh-element.js';

adoptStyles(document, [m3Styles]);

/** `pull-to-refresh.css` as a browser without `pan-down` sees it. */
function withoutPanDown(sheet: CSSStyleSheet): CSSStyleSheet {
  const convert = (rules: CSSRuleList): string =>
    Array.from(rules)
      .filter((rule) => !/^@supports\b[^{]*touch-action/.test(rule.cssText))
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

describe('<md-gb-pull-to-refresh> without touch-action: pan-down', () => {
  const env = new Environment();

  let saved: CSSStyleSheet[];
  beforeEach(() => (saved = [...document.adoptedStyleSheets]));
  afterEach(() => (document.adoptedStyleSheets = saved));

  async function setup(sheet: CSSStyleSheet) {
    const root = env.render(html`
      <button type="button">Refresh</button>
      <md-gb-pull-to-refresh>
        <p>Content</p>
      </md-gb-pull-to-refresh>
    `);
    const el = root.querySelector(
      'md-gb-pull-to-refresh',
    ) as PullToRefreshElement;
    await el.updateComplete;
    // The element's own sheet is replaced after its first render.
    el.shadowRoot!.adoptedStyleSheets = [sheet];
    await env.waitForStability();
    const button = root.querySelector('button') as HTMLButtonElement;
    return {el, button};
  }

  it('drops the pan-down rule from the element sheet', () => {
    const text = Array.from(withoutPanDown(pullToRefreshStyles).cssRules)
      .map((rule) => rule.cssText)
      .join('\n');
    expect(text).not.toContain('pan-down');
    expect(text).toContain('.pull-to-refresh-scroller');
  });

  it('renders the content and the hidden indicator', async () => {
    const {el} = await setup(withoutPanDown(pullToRefreshStyles));
    const scroller = el.shadowRoot!.querySelector(
      '.pull-to-refresh-scroller',
    ) as HTMLElement;
    const indicator = el.shadowRoot!.querySelector(
      '.pull-to-refresh-indicator',
    ) as HTMLElement;
    expect(scroller).not.toBeNull();
    expect(indicator).not.toBeNull();
    // The content is laid out and the touch pull is off: the browser scrolls.
    const content = el.querySelector('p')!;
    expect(content.getBoundingClientRect().height).toBeGreaterThan(0);
    expect(getComputedStyle(scroller).touchAction).not.toContain('pan-down');
    expect(getComputedStyle(indicator).visibility).toBe('hidden');
  });

  it('refreshes from a button without a touch pull', async () => {
    const {el, button} = await setup(withoutPanDown(pullToRefreshStyles));
    const refresh = jasmine.createSpy('refresh');
    el.addEventListener('refresh', refresh);
    button.addEventListener('click', () => el.refresh());

    button.click();
    await el.updateComplete;

    expect(refresh).toHaveBeenCalledTimes(1);
    expect(el.refreshing).toBeTrue();
    const indicator = el.shadowRoot!.querySelector(
      '.pull-to-refresh-indicator',
    ) as HTMLElement;
    expect(getComputedStyle(indicator).visibility).toBe('visible');
    expect(
      el.shadowRoot!.querySelector('.pull-to-refresh-refreshing'),
    ).not.toBeNull();
  });

  it('ends the refresh when the app clears refreshing', async () => {
    const {el, button} = await setup(withoutPanDown(pullToRefreshStyles));
    button.addEventListener('click', () => el.refresh());
    button.click();
    await el.updateComplete;

    el.refreshing = false;
    await el.updateComplete;

    expect(el.refreshing).toBeFalse();
    expect(
      el.shadowRoot!.querySelector('.pull-to-refresh-refreshing'),
    ).toBeNull();
  });
});
