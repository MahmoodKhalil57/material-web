/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import '../../styles/icon/md-gb-icon.js';
import '../fab/md-gb-fab.js';
import './md-gb-nav-rail.js';
import './md-gb-nav-rail-item.js';

import {sendKeys, sendMouse} from '@web/test-runner-commands';
import {html, type TemplateResult} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {NavRailElement} from './nav-rail-element.js';
import {NavRailItemElement} from './nav-rail-item-element.js';

adoptStyles(document, [m3Styles]);

function resolvedColor(token: string) {
  const probe = document.createElement('div');
  probe.style.color = `var(${token})`;
  document.body.appendChild(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return color;
}

/** Finishes transitions so computed styles are final. */
function finish(...hosts: Element[]) {
  document.body.offsetHeight;
  const roots: DocumentOrShadowRoot[] = [document];
  for (const host of hosts) if (host.shadowRoot) roots.push(host.shadowRoot);
  for (const root of roots) root.getAnimations().forEach((a) => a.finish());
  document.body.offsetHeight;
}

function railEl(rail: NavRailElement) {
  return rail.shadowRoot!.querySelector<HTMLElement>('.nav-rail')!;
}

function part(item: NavRailItemElement, selector: string) {
  return item.shadowRoot!.querySelector<HTMLElement>(selector)!;
}

function iconOf(item: NavRailItemElement) {
  return item.querySelector<HTMLElement>('md-gb-icon')!;
}

/** The relative luminance contrast ratio of two `rgb()` colors. */
function contrast(a: string, b: string) {
  const luminance = (color: string) => {
    const [r, g, b] = color
      .match(/[\d.]+/g)!
      .slice(0, 3)
      .map((v) => {
        const c = Number(v) / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe('md-gb-nav-rail spec units', () => {
  const env = new Environment();

  async function render(template: TemplateResult) {
    const root = env.render(html`<button id="before">Before</button>${template}`);
    await env.waitForStability();
    const rail = root.querySelector('md-gb-nav-rail') as NavRailElement;
    await rail.updateComplete;
    const items = Array.from(
      root.querySelectorAll<NavRailItemElement>('md-gb-nav-rail-item'),
    );
    for (const item of items) await item.updateComplete;
    return {
      root,
      rail,
      items,
      before: root.querySelector<HTMLElement>('#before')!,
    };
  }

  const items = html`
    <md-gb-nav-rail-item selected badge="3">
      <md-gb-icon slot="icon">inbox</md-gb-icon>
      Inbox
    </md-gb-nav-rail-item>
    <md-gb-nav-rail-item>
      <md-gb-icon slot="icon">chat</md-gb-icon>
      Chat
    </md-gb-nav-rail-item>
    <md-gb-nav-rail-item>
      <md-gb-icon slot="icon">send</md-gb-icon>
      Sent
    </md-gb-nav-rail-item>
  `;

  const collapsed = html`<md-gb-nav-rail>${items}</md-gb-nav-rail>`;

  // spec: navigation-rail-2bb809, navigation-rail-f4e92d, navigation-rail-20c950, navigation-rail-1b1850, navigation-rail-7d2647, navigation-rail-5aabe5, navigation-rail-04ac7a, navigation-rail-2cc1c8, navigation-rail-b6737b, navigation-rail-7af982, navigation-rail-13751b, navigation-rail-1aa1e8, navigation-rail-de6387, navigation-rail-cb392d, navigation-rail-966230, navigation-rail-0566f0
  it('colors the indicator, icons, labels and badge from the color roles', async () => {
    const {items: list} = await render(collapsed);
    finish(...list);
    const [active, inactive] = list;
    const indicator = getComputedStyle(part(active, '.nav-rail-item-indicator'), '::before');
    expect(indicator.backgroundColor)
      .withContext('active indicator')
      .toBe(resolvedColor('--md-sys-color-secondary-container'));
    expect(getComputedStyle(iconOf(active)).color)
      .withContext('active icon')
      .toBe(resolvedColor('--md-sys-color-on-secondary-container'));
    expect(getComputedStyle(iconOf(inactive)).color)
      .withContext('inactive icon')
      .toBe(resolvedColor('--md-sys-color-on-surface-variant'));
    expect(getComputedStyle(part(inactive, '.nav-rail-item-label')).color)
      .withContext('inactive label')
      .toBe(resolvedColor('--md-sys-color-on-surface-variant'));
    const badge = getComputedStyle(part(active, '.nav-rail-item-badge'));
    expect(badge.backgroundColor)
      .withContext('badge')
      .toBe(resolvedColor('--md-sys-color-error'));
    expect(badge.color)
      .withContext('badge label')
      .toBe(resolvedColor('--md-sys-color-on-error'));
  });

  // spec: navigation-rail-a03731
  it('colors the active label secondary when vertical and on secondary container when horizontal', async () => {
    const {rail, items: list} = await render(collapsed);
    finish(...list);
    expect(getComputedStyle(part(list[0], '.nav-rail-item-label')).color)
      .withContext('vertical')
      .toBe(resolvedColor('--md-sys-color-secondary'));
    rail.expanded = true;
    await env.waitForStability();
    finish(...list);
    expect(getComputedStyle(part(list[0], '.nav-rail-item-label')).color)
      .withContext('horizontal')
      .toBe(resolvedColor('--md-sys-color-on-secondary-container'));
  });

  // spec: navigation-rail-d5cbbe
  it('colors an expanded modal rail with surface container', async () => {
    const {rail} = await render(
      html`<md-gb-nav-rail modal expanded>${items}</md-gb-nav-rail>`,
    );
    finish(rail);
    expect(getComputedStyle(railEl(rail)).backgroundColor).toBe(
      resolvedColor('--md-sys-color-surface-container'),
    );
  });

  // spec: navigation-rail-4ff282
  it('keeps active and inactive icon colors at 3:1 contrast against the container', async () => {
    const {rail, items: list} = await render(collapsed);
    finish(...list);
    const container = getComputedStyle(railEl(rail)).backgroundColor;
    expect(contrast(getComputedStyle(iconOf(list[1])).color, container))
      .withContext('inactive')
      .toBeGreaterThanOrEqual(3);
    const indicator = getComputedStyle(
      part(list[0], '.nav-rail-item-indicator'),
      '::before',
    ).backgroundColor;
    expect(contrast(getComputedStyle(iconOf(list[0])).color, indicator))
      .withContext('active')
      .toBeGreaterThanOrEqual(3);
  });

  // spec: navigation-rail-1d0626, navigation-rail-3c0c37, navigation-rail-07f752, navigation-rail-bee02a, navigation-rail-e0df7d, navigation-rail-9e8612, navigation-rail-1a852b, navigation-rail-0c5129, navigation-rail-9c222c
  it('changes an inactive destination across enabled, hovered, focused and pressed states', async () => {
    const {items: list, before} = await render(collapsed);
    const item = list[1];
    const control = part(item, '.nav-rail-item');
    const onSurface = resolvedColor('--md-sys-color-on-surface');
    finish(item);
    expect(getComputedStyle(iconOf(item)).color)
      .withContext('enabled')
      .toBe(resolvedColor('--md-sys-color-on-surface-variant'));

    // The `hover` and `active` classes emulate those pseudo-classes.
    control.classList.add('hover');
    finish(item);
    expect(getComputedStyle(iconOf(item)).color).withContext('hovered').toBe(onSurface);
    control.classList.remove('hover');

    control.classList.add('active');
    finish(item);
    expect(getComputedStyle(iconOf(item)).color).withContext('pressed').toBe(onSurface);
    control.classList.remove('active');

    before.focus();
    await sendKeys({press: 'Tab'});
    await sendKeys({press: 'Tab'});
    expect(document.activeElement).toBe(item);
    finish(item);
    expect(getComputedStyle(iconOf(item)).color).withContext('focused').toBe(onSurface);
  });

  // spec: navigation-rail-2eb63c, navigation-rail-f248bf, navigation-rail-d2fcc8, navigation-rail-80d8ef
  it('keeps an active destination on the active colors across its states', async () => {
    const {items: list, before} = await render(collapsed);
    const item = list[0];
    const control = part(item, '.nav-rail-item');
    const onSecondaryContainer = resolvedColor('--md-sys-color-on-secondary-container');
    const iconColor = () => getComputedStyle(iconOf(item)).color;
    finish(item);
    expect(iconColor()).withContext('enabled').toBe(onSecondaryContainer);
    control.classList.add('hover');
    finish(item);
    expect(iconColor()).withContext('hovered').toBe(onSecondaryContainer);
    control.classList.remove('hover');
    control.classList.add('active');
    finish(item);
    expect(iconColor()).withContext('pressed').toBe(onSecondaryContainer);
    control.classList.remove('active');
    before.focus();
    await sendKeys({press: 'Tab'});
    expect(document.activeElement).toBe(item);
    finish(item);
    expect(iconColor()).withContext('focused').toBe(onSecondaryContainer);
  });

  // spec: navigation-rail-03cf1e, navigation-rail-a9bbc8
  it('shows a hover state and a pointer cursor over a destination', async () => {
    const {items: list} = await render(collapsed);
    const item = list[1];
    finish(item);
    const before = getComputedStyle(iconOf(item)).color;
    const rect = item.getBoundingClientRect();
    await sendMouse({
      type: 'move',
      position: [Math.round(rect.left + rect.width / 2), Math.round(rect.top + rect.height / 2)],
    });
    finish(item);
    expect(getComputedStyle(iconOf(item)).color).not.toBe(before);
    expect(getComputedStyle(part(item, '.nav-rail-item')).cursor).toBe('pointer');
    await sendMouse({type: 'move', position: [0, 0]});
  });

  // spec: navigation-rail-5897b2, navigation-rail-e3abb1
  it('spans the target area across the full rail width while the indicator hugs the content', async () => {
    const {rail, items: list} = await render(
      html`<md-gb-nav-rail expanded>${items}</md-gb-nav-rail>`,
    );
    finish(rail);
    const item = list[1];
    const control = part(item, '.nav-rail-item');
    const content = part(item, '.nav-rail-item-content');
    const itemsRect = rail.shadowRoot!.querySelector('.nav-rail-items')!.getBoundingClientRect();
    const controlRect = control.getBoundingClientRect();
    expect(controlRect.width).toBeCloseTo(itemsRect.width - 2 * parseFloat(getComputedStyle(rail.shadowRoot!.querySelector('.nav-rail-items')!).paddingInlineStart), 0);
    expect(content.getBoundingClientRect().width).toBeLessThan(controlRect.width);
    // A click on the target area beside the indicator selects the item.
    const x = Math.round(controlRect.right - 4);
    const y = Math.round(controlRect.top + controlRect.height / 2);
    expect(content.getBoundingClientRect().right).toBeLessThan(x);
    await sendMouse({type: 'click', position: [x, y]});
    await env.waitForStability();
    expect(item.selected).toBeTrue();
  });

  // spec: navigation-rail-a90788, navigation-rail-b36687, navigation-rail-303489, navigation-rail-815210, navigation-rail-0f73af, navigation-rail-7d9e8d, navigation-rail-f4b370, navigation-rail-41a903
  it('stacks a menu, a FAB and labeled destinations vertically', async () => {
    const {rail, items: list} = await render(
      html`<md-gb-nav-rail collapsible>
        <md-gb-fab slot="header" label="Compose"></md-gb-fab>
        ${items}
      </md-gb-nav-rail>`,
    );
    const menu = rail.shadowRoot!.querySelector('.nav-rail-menu-button')!.getBoundingClientRect();
    const fab = rail.querySelector('md-gb-fab')!.getBoundingClientRect();
    const first = list[0].getBoundingClientRect();
    expect(menu.bottom).toBeLessThanOrEqual(fab.top + 1);
    expect(fab.bottom).toBeLessThanOrEqual(first.top + 1);
    for (let i = 1; i < list.length; i++) {
      expect(list[i].getBoundingClientRect().top).toBeGreaterThan(
        list[i - 1].getBoundingClientRect().bottom - 1,
      );
    }
    for (const item of list) {
      const label = part(item, '.nav-rail-item-label');
      expect(getComputedStyle(label).display).not.toBe('none');
      expect(label.getBoundingClientRect().height).toBeGreaterThan(0);
    }

    // Without the menu, the FAB leads the destinations.
    const noMenu = await render(
      html`<md-gb-nav-rail>
        <md-gb-fab slot="header" label="Compose"></md-gb-fab>
        ${items}
      </md-gb-nav-rail>`,
    );
    expect(noMenu.rail.shadowRoot!.querySelector('.nav-rail-menu-button')).toBeNull();
    expect(noMenu.rail.querySelector('md-gb-fab')!.getBoundingClientRect().bottom)
      .toBeLessThanOrEqual(noMenu.items[0].getBoundingClientRect().top + 1);

    // Without the FAB, the menu leads the destinations.
    const noFab = await render(
      html`<md-gb-nav-rail collapsible>${items}</md-gb-nav-rail>`,
    );
    expect(noFab.rail.shadowRoot!.querySelector('.nav-rail-menu-button')!.getBoundingClientRect().bottom)
      .toBeLessThanOrEqual(noFab.items[0].getBoundingClientRect().top + 1);
  });

  // spec: navigation-rail-182ad4, navigation-rail-6ba429, navigation-rail-4e6ac3
  it('transforms between collapsed and expanded when the menu button is selected', async () => {
    const {rail} = await render(
      html`<md-gb-nav-rail collapsible>${items}</md-gb-nav-rail>`,
    );
    const menu = () =>
      rail.shadowRoot!.querySelector<HTMLButtonElement>('.nav-rail-menu-button')!;
    const collapsedWidth = railEl(rail).getBoundingClientRect().width;
    menu().click();
    await env.waitForStability();
    finish(rail);
    expect(rail.expanded).toBeTrue();
    expect(menu().getAttribute('aria-expanded')).toBe('true');
    expect(railEl(rail).getBoundingClientRect().width).toBeGreaterThan(collapsedWidth);
    menu().click();
    await env.waitForStability();
    finish(rail);
    expect(rail.expanded).toBeFalse();
    expect(railEl(rail).getBoundingClientRect().width).toBe(collapsedWidth);
  });

  // spec: navigation-rail-1edfbd, navigation-rail-9c596a
  it('lays out the destinations horizontally when expanded', async () => {
    const {rail, items: list} = await render(
      html`<md-gb-nav-rail expanded>${items}</md-gb-nav-rail>`,
    );
    finish(rail);
    expect(railEl(rail).getBoundingClientRect().width).toBeGreaterThanOrEqual(220);
    expect(list[0].getAttribute('item-layout')).toBe('horizontal');
    const icon = iconOf(list[0]).getBoundingClientRect();
    const label = part(list[0], '.nav-rail-item-label').getBoundingClientRect();
    expect(label.left).toBeGreaterThan(icon.right - 1);
    expect(Math.abs(label.top + label.height / 2 - (icon.top + icon.height / 2))).toBeLessThan(2);
  });

  // spec: navigation-rail-a79223, navigation-rail-ec2ae4, navigation-rail-90be1b
  it('shifts the page content and fills the space when a standard rail expands', async () => {
    const {rail, items: list} = await render(
      html`<div style="display: flex; inline-size: 800px; block-size: 400px">
        <md-gb-nav-rail>${items}</md-gb-nav-rail>
        <main style="flex: 1">Content</main>
      </div>`,
    );
    const main = rail.parentElement!.querySelector('main')!;
    const before = main.getBoundingClientRect();
    const collapsedWidth = rail.getBoundingClientRect().width;
    rail.expanded = true;
    await env.waitForStability();
    finish(rail, ...list);
    const after = main.getBoundingClientRect();
    expect(after.left).toBeGreaterThan(before.left);
    expect(after.width).toBeLessThan(before.width);
    expect(rail.getBoundingClientRect().width).toBeGreaterThan(collapsedWidth);
    // The destinations fill the wider rail.
    const itemsWidth = rail.shadowRoot!.querySelector('.nav-rail-items')!.getBoundingClientRect().width;
    expect(list[1].getBoundingClientRect().width).toBeGreaterThan(itemsWidth * 0.8);
  });

  // spec: navigation-rail-c89e39
  it('moves between destinations with Tab and selects one with Enter', async () => {
    const {items: list, before} = await render(collapsed);
    before.focus();
    await sendKeys({press: 'Tab'});
    expect(document.activeElement).toBe(list[0]);
    await sendKeys({press: 'Tab'});
    expect(document.activeElement).toBe(list[1]);
    await sendKeys({press: 'Enter'});
    await env.waitForStability();
    expect(list[1].selected).toBeTrue();
    expect(list[0].selected).toBeFalse();
  });

  // spec: navigation-rail-b9ca31, navigation-rail-a8c4de, navigation-rail-771910, navigation-rail-a010ea
  it('shows the active indicator, ripple and new colors when a destination is tapped', async () => {
    const {items: list} = await render(collapsed);
    const item = list[1];
    const indicator = part(item, '.nav-rail-item-indicator');
    finish(item);
    expect(getComputedStyle(indicator, '::before').opacity).toBe('0');
    const iconBefore = getComputedStyle(iconOf(item)).color;
    const labelBefore = getComputedStyle(part(item, '.nav-rail-item-label')).color;
    item.click();
    await env.waitForStability();
    finish(item);
    expect(item.selected).toBeTrue();
    const style = getComputedStyle(indicator, '::before');
    expect(style.opacity).toBe('1');
    expect(new DOMMatrix(style.transform).a)
      .withContext('indicator expands from the center')
      .toBe(1);
    expect(getComputedStyle(iconOf(item)).color).not.toBe(iconBefore);
    expect(getComputedStyle(part(item, '.nav-rail-item-label')).color).not.toBe(labelBefore);
    // The ripple is drawn on the indicator element, over its fill.
    expect(getComputedStyle(indicator).backgroundImage).toContain('radial-gradient');
  });

  // spec: navigation-rail-119b6c, navigation-rail-5fd15d, navigation-rail-ed2087, navigation-rail-7405bd, navigation-rail-25e7e9
  it('fills the icon of the active destination and leaves the others outlined', async () => {
    const {items: list} = await render(collapsed);
    finish(...list);
    const fill = (item: NavRailItemElement) =>
      getComputedStyle(iconOf(item)).fontVariationSettings;
    expect(fill(list[0])).toContain('"FILL" 1');
    expect(fill(list[1])).toContain('"FILL" 0');
    list[1].selected = true;
    list[0].selected = false;
    await env.waitForStability();
    finish(...list);
    expect(fill(list[1])).toContain('"FILL" 1');
    expect(fill(list[0])).toContain('"FILL" 0');
  });

});
