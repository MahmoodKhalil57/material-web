/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import './md-gb-nav-bar.js';
import './md-gb-nav-bar-item.js';

import {html, type TemplateResult} from 'lit';
import {sendKeys} from '@web/test-runner-commands';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {NavBarElement} from './nav-bar-element.js';
import {NavBarItemElement} from './nav-bar-item-element.js';

adoptStyles(document, [m3Styles]);

describe('md-gb-nav-bar spec units', () => {
  const env = new Environment();

  async function render(template: TemplateResult) {
    const root = env.render(template);
    await env.waitForStability();
    const bar = root.querySelector('md-gb-nav-bar') as NavBarElement;
    await bar.updateComplete;
    await bar.updateComplete;
    for (const item of bar.querySelectorAll('md-gb-nav-bar-item')) {
      await (item as NavBarItemElement).updateComplete;
    }
    return bar;
  }

  async function finishAnimations() {
    await env.waitForStability();
    document.body.offsetHeight; // flush styles so transitions start
    const roots: DocumentOrShadowRoot[] = [document];
    document.querySelectorAll('md-gb-nav-bar-item').forEach((i) => roots.push(i.shadowRoot!));
    for (const r of roots) r.getAnimations().forEach((a) => a.finish());
    document.body.offsetHeight;
  }

  function items(n: number, badge = '') {
    return Array.from(
      {length: n},
      (_, i) =>
        html`<md-gb-nav-bar-item ?active=${i === 0} badge=${i === 1 ? badge : ''}
          ><span
            slot="icon"
            style="width: 24px; height: 24px; display: block"></span
          >Item ${i}</md-gb-nav-bar-item
        >`,
    );
  }

  function parts(item: Element) {
    const root = item.shadowRoot!;
    return {
      indicator: root.querySelector<HTMLElement>('.nav-bar-item-icon-container')!,
      label: root.querySelector<HTMLElement>('.nav-bar-item-label')!,
      icon: root.querySelector<HTMLElement>('.nav-bar-item-icon')!,
    };
  }

  // spec: navigation-bar-b0a913, navigation-bar-c5b0c3
  it('lays items out vertically by default, label below the icon', async () => {
    const bar = await render(html`<md-gb-nav-bar>${items(3)}</md-gb-nav-bar>`);
    expect(bar.itemLayout).toBe('vertical');
    const {indicator, label} = parts(bar.querySelector('md-gb-nav-bar-item')!);
    expect(label.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      indicator.getBoundingClientRect().bottom - 1,
    );
  });

  // spec: navigation-bar-7e7199, navigation-bar-7e0e5a, navigation-bar-0a02bf
  it('lays horizontal items out with the label beside the icon', async () => {
    const bar = await render(
      html`<md-gb-nav-bar item-layout="horizontal">${items(3)}</md-gb-nav-bar>`,
    );
    const {icon, label} = parts(bar.querySelector('md-gb-nav-bar-item')!);
    expect(label.getBoundingClientRect().left).toBeGreaterThanOrEqual(
      icon.getBoundingClientRect().right - 1,
    );
  });

  // spec: navigation-bar-5543b4, navigation-bar-f4ea5b, navigation-bar-cdc165
  it('auto layout is vertical in compact and horizontal in medium windows', async () => {
    const bar = await render(
      html`<md-gb-nav-bar item-layout="auto">${items(3)}</md-gb-nav-bar>`,
    );
    const medium = window.matchMedia('(min-width: 600px)').matches;
    expect(bar.resolvedItemLayout).toBe(medium ? 'horizontal' : 'vertical');
  });

  // spec: navigation-bar-e018d7, navigation-bar-50c3ad
  it('spans 100% of the container width', async () => {
    const bar = await render(
      html`<div style="width: 733px"
        ><md-gb-nav-bar>${items(3)}</md-gb-nav-bar></div
      >`,
    );
    expect(bar.getBoundingClientRect().width).toBe(733);
  });

  // spec: navigation-bar-bbcb1c, navigation-bar-ad6014, navigation-bar-ef8f64
  it('supports 3, 4 and 5 destinations, each with an equal share', async () => {
    for (const n of [3, 4, 5]) {
      const bar = await render(
        html`<div style="width: 600px"
          ><md-gb-nav-bar>${items(n)}</md-gb-nav-bar></div
        >`,
      );
      const rects = Array.from(bar.querySelectorAll('md-gb-nav-bar-item')).map(
        (i) => i.getBoundingClientRect(),
      );
      expect(rects.length).toBe(n);
      for (const r of rects) expect(r.width).toBeCloseTo(600 / n, 0);
    }
  });

  // spec: navigation-bar-403b51
  it('centers items within the container', async () => {
    const bar = await render(
      html`<div style="width: 600px"
        ><md-gb-nav-bar>${items(3)}</md-gb-nav-bar></div
      >`,
    );
    const all = Array.from(bar.querySelectorAll('md-gb-nav-bar-item'));
    const left = all[0].getBoundingClientRect().left - bar.getBoundingClientRect().left;
    const right =
      bar.getBoundingClientRect().right - all[2].getBoundingClientRect().right;
    expect(Math.abs(left - right)).toBeLessThan(1);
  });

  // spec: navigation-bar-d91131
  it('shows an icon and label text for each destination', async () => {
    const bar = await render(html`<md-gb-nav-bar>${items(3)}</md-gb-nav-bar>`);
    const item = bar.querySelector('md-gb-nav-bar-item')!;
    const {icon, label} = parts(item);
    expect(icon.querySelector('slot')!.assignedElements().length).toBe(1);
    const slot = label.querySelector('slot') as HTMLSlotElement;
    expect(
      slot
        .assignedNodes()
        .map((n) => n.textContent)
        .join(''),
    ).toContain('Item 0');
  });

  // spec: navigation-bar-bdca20, navigation-bar-d63278, navigation-bar-0948c2
  it('shows the active indicator only on the active destination', async () => {
    const bar = await render(html`<md-gb-nav-bar>${items(3)}</md-gb-nav-bar>`);
    const all = Array.from(bar.querySelectorAll('md-gb-nav-bar-item'));
    const opacity = (i: number) =>
      getComputedStyle(parts(all[i]).indicator, '::before').opacity;
    expect(opacity(0)).toBe('1');
    expect(opacity(1)).toBe('0');
    expect(opacity(2)).toBe('0');
  });

  // spec: navigation-bar-692968, navigation-bar-a7fff8, navigation-bar-86165e, navigation-bar-4d2752, navigation-bar-11167d, navigation-bar-bb8c81, navigation-bar-92a197, navigation-bar-ba0394, navigation-bar-aa3dcb, navigation-bar-7687f3, navigation-bar-433de6
  it('fills the icon and moves the indicator when a destination is selected', async () => {
    const bar = await render(html`<md-gb-nav-bar>${items(3)}</md-gb-nav-bar>`);
    const all = Array.from(
      bar.querySelectorAll<NavBarItemElement>('md-gb-nav-bar-item'),
    );
    const fill = (i: number) =>
      getComputedStyle(all[i].shadowRoot!.querySelector('.nav-bar-item')!)
        .getPropertyValue('--md-icon-fill')
        .trim();
    expect(fill(0)).toBe('1');
    expect(fill(1)).toBe('0');
    all[1].click();
    await env.waitForStability();
    for (const i of all) await i.updateComplete;
    await finishAnimations();
    expect(fill(0)).toBe('0');
    expect(fill(1)).toBe('1');
    expect(getComputedStyle(parts(all[1]).indicator, '::before').opacity).toBe('1');
  });

  // spec: navigation-bar-1b62b9, navigation-bar-e6b7e3
  it('changes the icon color when active', async () => {
    const bar = await render(html`<md-gb-nav-bar>${items(2)}</md-gb-nav-bar>`);
    const all = Array.from(bar.querySelectorAll('md-gb-nav-bar-item'));
    const color = (i: number) => getComputedStyle(parts(all[i]).indicator).color;
    expect(color(0)).not.toBe(color(1));
  });

  // spec: navigation-bar-8f1e90, navigation-bar-114ba1, navigation-bar-ef280d, navigation-bar-f8cc68
  it('shows large (count) and small (dot) badges over the icon', async () => {
    const bar = await render(html`<md-gb-nav-bar>${items(3, '7')}</md-gb-nav-bar>`);
    const item = bar.querySelectorAll<NavBarItemElement>('md-gb-nav-bar-item')[1];
    const badge = item.shadowRoot!.querySelector<HTMLElement>('.nav-bar-item-badge')!;
    expect(badge.textContent!.trim()).toBe('7');
    const icon = parts(item).icon.getBoundingClientRect();
    const b = badge.getBoundingClientRect();
    expect(b.left).toBeLessThan(icon.right);
    expect(b.right).toBeGreaterThan(icon.left);
    expect(b.top).toBeLessThan(icon.bottom);
    item.badge = 'dot';
    await item.updateComplete;
    await finishAnimations();
    const dot = item.shadowRoot!.querySelector<HTMLElement>('.nav-bar-item-badge')!;
    expect(dot.getBoundingClientRect().width).toBe(6);
    expect(dot.getBoundingClientRect().width).toBeLessThan(b.width);
  });

  // spec: navigation-bar-51aca3, navigation-bar-e26dcf
  it('lands initial focus on the first navigation item', async () => {
    const bar = await render(
      html`<button id="before">before</button
        ><md-gb-nav-bar>${items(3)}</md-gb-nav-bar>`,
    );
    document.querySelector<HTMLElement>('#before')!.focus();
    await sendKeys({press: 'Tab'});
    expect(document.activeElement).toBe(bar.querySelector('md-gb-nav-bar-item'));
  });
});
