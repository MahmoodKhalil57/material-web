/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import './md-gb-nav-bar.js';
import './md-gb-nav-bar-item.js';

import {html, type TemplateResult} from 'lit';
import {Environment} from '../../testing/environment.js';
import {internals} from '../../internal/behaviors/element-internals.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {NavBarElement} from './nav-bar-element.js';
import {NavBarItemElement} from './nav-bar-item-element.js';

adoptStyles(document, [m3Styles]);

describe('md-gb-nav-bar', () => {
  const env = new Environment();

  async function render(template: TemplateResult) {
    const root = env.render(template);
    await env.waitForStability();
    const bar = root.querySelector('md-gb-nav-bar') as NavBarElement;
    await bar.updateComplete;
    await bar.updateComplete;
    return bar;
  }

  function items(n: number) {
    return Array.from(
      {length: n},
      (_, i) =>
        html`<md-gb-nav-bar-item ?active=${i === 0}>Item ${i}</md-gb-nav-bar-item>`,
    );
  }

  it('uses the tablist role with tab items', async () => {
    const bar = await render(html`<md-gb-nav-bar>${items(3)}</md-gb-nav-bar>`);
    expect(bar[internals].role).toBe('tablist');
    const item = bar.querySelector('md-gb-nav-bar-item') as NavBarItemElement;
    expect(item[internals].role).toBe('tab');
  });

  it('is 64px tall with 48px minimum targets', async () => {
    const bar = await render(html`<md-gb-nav-bar>${items(3)}</md-gb-nav-bar>`);
    const inner = bar.shadowRoot!.querySelector<HTMLElement>('.nav-bar')!;
    expect(inner.getBoundingClientRect().height).toBe(64);
    const item = bar.querySelector('md-gb-nav-bar-item')!;
    expect(parseFloat(getComputedStyle(item).minWidth)).toBeGreaterThanOrEqual(48);
  });

  it('syncs the item layout to its items', async () => {
    const bar = await render(
      html`<md-gb-nav-bar item-layout="horizontal">${items(3)}</md-gb-nav-bar>`,
    );
    for (const item of bar.querySelectorAll('md-gb-nav-bar-item')) {
      expect(item.getAttribute('item-layout')).toBe('horizontal');
    }
  });

  it('centers horizontal items with outer margins (Compose)', async () => {
    const bar = await render(
      html`<div style="width: 1000px"
        ><md-gb-nav-bar item-layout="horizontal">${items(4)}</md-gb-nav-bar></div
      >`,
    );
    const all = Array.from(bar.querySelectorAll('md-gb-nav-bar-item'));
    const first = all[0].getBoundingClientRect();
    const last = all[3].getBoundingClientRect();
    // 4 items take 70% of the bar width: 15% margin on each side.
    expect(first.left - bar.getBoundingClientRect().left).toBeCloseTo(150, 0);
    expect(bar.getBoundingClientRect().right - last.right).toBeCloseTo(150, 0);
  });

  it('uses the spec indicator sizes for horizontal items', async () => {
    const bar = await render(
      html`<md-gb-nav-bar item-layout="horizontal">${items(3)}</md-gb-nav-bar>`,
    );
    const item = bar.querySelector('md-gb-nav-bar-item')!;
    await (item as NavBarItemElement).updateComplete;
    const content = item.shadowRoot!.querySelector<HTMLElement>(
      '.nav-bar-item-content',
    )!;
    const style = getComputedStyle(content);
    expect(style.height).toBe('40px');
    expect(style.paddingInlineStart).toBe('16px');
    expect(style.columnGap).toBe('4px');
  });

  it('resolves `auto` from the window width', async () => {
    const bar = await render(
      html`<md-gb-nav-bar item-layout="auto">${items(3)}</md-gb-nav-bar>`,
    );
    const medium = window.matchMedia('(min-width: 600px)').matches;
    expect(bar.resolvedItemLayout).toBe(medium ? 'horizontal' : 'vertical');
    const item = bar.querySelector('md-gb-nav-bar-item')!;
    expect(item.getAttribute('item-layout')).toBe(bar.resolvedItemLayout);
  });
});
