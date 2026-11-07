/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Tests for spec units that were tracked as gaps and are now built.

// import 'jasmine'; (google3-only)
import '../../styles/icon/md-gb-icon.js';
import './md-gb-nav-drawer.js';
import './md-gb-nav-drawer-item.js';

import {sendKeys} from '@web/test-runner-commands';
import {html, type TemplateResult} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {type NavDrawerElement} from './nav-drawer-element.js';
import {type NavDrawerItemElement} from './nav-drawer-item-element.js';

adoptStyles(document, [m3Styles]);

function control(item: NavDrawerItemElement) {
  return item.shadowRoot!.querySelector<HTMLElement>('.nav-drawer-item')!;
}

describe('md-gb-nav-drawer tracked spec units', () => {
  const env = new Environment();

  async function render(template: TemplateResult) {
    const root = env.render(html`<button id="before">Before</button>${template}`);
    await env.waitForStability();
    const drawer = root.querySelector('md-gb-nav-drawer') as NavDrawerElement;
    await drawer.updateComplete;
    const items = Array.from(root.querySelectorAll<NavDrawerItemElement>('md-gb-nav-drawer-item'));
    for (const item of items) await item.updateComplete;
    return {root, drawer, items};
  }

  const standard = html`<md-gb-nav-drawer quick open aria-label="Mail">
    <md-gb-nav-drawer-item selected><md-gb-icon slot="icon">inbox</md-gb-icon>Inbox</md-gb-nav-drawer-item>
    <md-gb-nav-drawer-item><md-gb-icon slot="icon">send</md-gb-icon>Outbox</md-gb-nav-drawer-item>
    <md-gb-nav-drawer-item>Trash</md-gb-nav-drawer-item>
  </md-gb-nav-drawer>`;

  afterEach(() => {
    for (const drawer of document.querySelectorAll('md-gb-nav-drawer')) {
      drawer.shadowRoot?.querySelector('dialog')?.close();
    }
  });

  // spec: navigation-drawer-ff691f
  it('keeps one destination active', async () => {
    const {items} = await render(standard);
    items[1].click();
    await env.waitForStability();
    expect(items.filter((i) => i.selected)).toEqual([items[1]]);
    // Selecting the active destination again leaves it active.
    items[1].click();
    await env.waitForStability();
    expect(items.filter((i) => i.selected)).toEqual([items[1]]);
  });

  // spec: navigation-drawer-437e51
  it('changes size to suit the screen of the device', async () => {
    const {drawer} = await render(html`<div style="width: 260px; height: 400px; display: flex"
      >${standard}</div
    >`);
    expect(drawer.getBoundingClientRect().width).toBeLessThanOrEqual(260);
    const wide = await render(html`<div style="width: 1000px; height: 400px; display: flex"
      >${standard}</div
    >`);
    expect(wide.drawer.getBoundingClientRect().width).toBeGreaterThan(260);
    expect(wide.drawer.getBoundingClientRect().width).toBeLessThanOrEqual(360);
  });

  // spec: navigation-drawer-36f727
  it('labels a destination with its adjacent UI text', async () => {
    const {items} = await render(standard);
    expect(control(items[0]).hasAttribute('aria-label')).toBeFalse();
    expect(items[0].textContent).toContain('Inbox');
  });

  describe('interaction', () => {
    // spec: navigation-drawer-f10ffa, navigation-drawer-aaa5c4
    it('has a ripple and a hover indicator on each destination', async () => {
      const {items} = await render(standard);
      const part = control(items[1]);
      expect(part.classList.contains('ripple')).toBeTrue();
      expect(getComputedStyle(part).cursor).toBe('pointer');
    });

    // spec: navigation-drawer-fd0aca, navigation-drawer-aaf9c9
    it('selects the focused destination with Space or Enter', async () => {
      const {items} = await render(standard);
      items[1].focus();
      await sendKeys({press: 'Enter'});
      await env.waitForStability();
      expect(items[1].selected).toBeTrue();
      items[2].focus();
      await sendKeys({press: 'Space'});
      await env.waitForStability();
      expect(items[2].selected).toBeTrue();
      expect(items[1].selected).toBeFalse();
    });
  });
});
