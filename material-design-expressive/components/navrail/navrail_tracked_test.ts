/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Tests for spec units that were tracked as gaps and are now built.

// import 'jasmine'; (google3-only)
import '../fab/md-gb-fab.js';
import '../iconbutton/md-gb-icon-button.js';
import '../../styles/icons/md-gb-icon.js';
import './md-gb-nav-rail.js';
import './md-gb-nav-rail-item.js';

import {sendKeys} from '@web/test-runner-commands';
import {html, type TemplateResult} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {NavRailElement} from './nav-rail-element.js';
import {NavRailItemElement} from './nav-rail-item-element.js';

adoptStyles(document, [m3Styles]);

describe('md-gb-nav-rail tracked spec units', () => {
  const env = new Environment();

  async function render(template: TemplateResult) {
    const root = env.render(html`<button id="before">Before</button>${template}`);
    await env.waitForStability();
    const rail = root.querySelector('md-gb-nav-rail') as NavRailElement;
    await rail.updateComplete;
    const items = Array.from(root.querySelectorAll('md-gb-nav-rail-item')) as NavRailItemElement[];
    for (const item of items) await item.updateComplete;
    await env.waitForStability();
    return {root, rail, items, before: root.querySelector<HTMLElement>('#before')!};
  }

  const destinations = html`
    <md-gb-nav-rail-item selected><md-gb-icon slot="icon">inbox</md-gb-icon>Inbox</md-gb-nav-rail-item>
    <md-gb-nav-rail-item><md-gb-icon slot="icon">chat</md-gb-icon>Chat</md-gb-nav-rail-item>
    <md-gb-nav-rail-item><md-gb-icon slot="icon">send</md-gb-icon>Sent</md-gb-nav-rail-item>
  `;

  describe('keyboard', () => {
    // spec: navigation-rail-7a9bfa, navigation-rail-e454b1
    it('moves between the destinations with the arrow keys, and with Tab', async () => {
      const {items, before} = await render(html`<md-gb-nav-rail>${destinations}</md-gb-nav-rail>`);
      before.focus();
      await sendKeys({press: 'Tab'});
      expect(document.activeElement).toBe(items[0]);
      await sendKeys({press: 'ArrowDown'});
      expect(document.activeElement).toBe(items[1]);
      await sendKeys({press: 'ArrowRight'});
      expect(document.activeElement).toBe(items[2]);
      await sendKeys({press: 'ArrowUp'});
      expect(document.activeElement).toBe(items[1]);
      await sendKeys({press: 'Tab'});
      expect(document.activeElement).toBe(items[2]);
    });

    // spec: navigation-rail-3e872c, navigation-rail-12230b, navigation-rail-09467f, navigation-rail-e454b1
    it('selects the focused destination with Space or Enter', async () => {
      const {items} = await render(html`<md-gb-nav-rail>${destinations}</md-gb-nav-rail>`);
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

  describe('icons without a filled style', () => {
    // spec: navigation-rail-e71baf, navigation-rail-7f21df
    it('uses the semibold icon weight instead of a filled icon for the active destination', async () => {
      const {items} = await render(html`<md-gb-nav-rail>
        <md-gb-nav-rail-item selected unfilled-icon><md-gb-icon slot="icon">inbox</md-gb-icon>Inbox</md-gb-nav-rail-item>
        <md-gb-nav-rail-item><md-gb-icon slot="icon">chat</md-gb-icon>Chat</md-gb-nav-rail-item>
      </md-gb-nav-rail>`);
      const style = getComputedStyle(items[0].shadowRoot!.querySelector('.nav-rail-item')!);
      expect(style.getPropertyValue('--md-icon-fill')).toBe('0');
      expect(style.getPropertyValue('--md-icon-wght')).toBe('600');
    });
  });

  describe('labels', () => {
    // spec: navigation-rail-59a0b0, navigation-rail-936969, navigation-rail-fe0d4d, navigation-rail-4ee814, navigation-rail-67a644, navigation-rail-448efb
    it('breaks a long label into lines instead of truncating it, and the item grows', async () => {
      const {items} = await render(html`<md-gb-nav-rail>
        <md-gb-nav-rail-item selected><md-gb-icon slot="icon">inbox</md-gb-icon>Inbox</md-gb-nav-rail-item>
        <md-gb-nav-rail-item><md-gb-icon slot="icon">chat</md-gb-icon>Notifications and updates</md-gb-nav-rail-item>
      </md-gb-nav-rail>`);
      const label = items[1].shadowRoot!.querySelector<HTMLElement>('.nav-rail-item-label')!;
      expect(getComputedStyle(label).textOverflow).not.toBe('ellipsis');
      expect(label.scrollWidth).toBeLessThanOrEqual(label.clientWidth + 1);
      expect(items[1].getBoundingClientRect().height).toBeGreaterThan(items[0].getBoundingClientRect().height);
    });

    // spec: navigation-rail-7663f3
    it('names a destination with its adjacent text label', async () => {
      const {items} = await render(html`<md-gb-nav-rail>${destinations}</md-gb-nav-rail>`);
      expect(items[0].hasAttribute('aria-label')).toBeFalse();
      expect(items[0].textContent!.replace(/\s+/g, ' ').trim()).toContain('Inbox');
    });
  });

  describe('header', () => {
    // spec: navigation-rail-20ad41, navigation-rail-006a2b
    it('keeps the menu and FAB at the top, with destinations that have no labels', async () => {
      const {rail, items} = await render(html`<md-gb-nav-rail alignment="center">
        <md-gb-icon-button slot="header" aria-label="Menu"><md-gb-icon>menu</md-gb-icon></md-gb-icon-button>
        <md-gb-fab slot="header" aria-label="Compose"><md-gb-icon slot="icon">edit</md-gb-icon></md-gb-fab>
        <md-gb-nav-rail-item selected aria-label="Inbox"><md-gb-icon slot="icon">inbox</md-gb-icon></md-gb-nav-rail-item>
        <md-gb-nav-rail-item aria-label="Chat"><md-gb-icon slot="icon">chat</md-gb-icon></md-gb-nav-rail-item>
      </md-gb-nav-rail>`);
      const railBox = rail.getBoundingClientRect();
      const menu = rail.querySelector('md-gb-icon-button')!.getBoundingClientRect();
      const fab = rail.querySelector('md-gb-fab')!.getBoundingClientRect();
      expect(menu.top - railBox.top).toBeLessThan(56);
      expect(fab.top).toBeGreaterThanOrEqual(menu.bottom);
      expect(fab.top - railBox.top).toBeLessThan(120);
      // The destinations are centered below, not top-aligned with the header.
      expect(items[0].getBoundingClientRect().top).toBeGreaterThan(fab.bottom);
    });

    // spec: navigation-rail-5266d3
    it('rests a nested FAB at elevation level 0', async () => {
      const {rail} = await render(html`<md-gb-nav-rail>
        <md-gb-fab slot="header" aria-label="Compose"><md-gb-icon slot="icon">edit</md-gb-icon></md-gb-fab>
        ${destinations}
      </md-gb-nav-rail>`);
      const fab = rail.querySelector('md-gb-fab')!;
      await (fab as unknown as {updateComplete: Promise<unknown>}).updateComplete;
      document.getAnimations().forEach((a) => a.finish());
      const surface = fab.shadowRoot!.querySelector<HTMLElement>('[part=fab], button, .fab')!;
      expect(getComputedStyle(surface).boxShadow).toBe('none');
    });
  });

  describe('expanded rail', () => {
    // spec: navigation-rail-c38543, navigation-rail-d7e353, navigation-rail-8996a3, navigation-rail-2cf572, navigation-rail-9bcf95
    it('reveals secondary destinations when it expands', async () => {
      const {rail, items} = await render(html`<md-gb-nav-rail collapsible>
        <md-gb-nav-rail-item selected><md-gb-icon slot="icon">inbox</md-gb-icon>Inbox</md-gb-nav-rail-item>
        <md-gb-nav-rail-item secondary><md-gb-icon slot="icon">label</md-gb-icon>Labels</md-gb-nav-rail-item>
      </md-gb-nav-rail>`);
      expect(items[1].getBoundingClientRect().height).toBe(0);
      rail.expanded = true;
      await rail.updateComplete;
      await env.waitForStability();
      expect(items[1].getBoundingClientRect().height).toBeGreaterThan(0);
    });
  });

  describe('separation from content', () => {
    // spec: navigation-rail-d3678c, navigation-rail-f0ef63, navigation-rail-01b754, navigation-rail-edd0fd, navigation-rail-e0ba36
    it('draws a divider on the edge next to the content, mirrored in right-to-left languages', async () => {
      for (const dir of ['ltr', 'rtl']) {
        const {rail} = await render(html`<div dir=${dir}><md-gb-nav-rail divider>${destinations}</md-gb-nav-rail></div>`);
        const style = getComputedStyle(rail.shadowRoot!.querySelector('.nav-rail')!);
        const near = dir === 'ltr' ? style.borderRightWidth : style.borderLeftWidth;
        const far = dir === 'ltr' ? style.borderLeftWidth : style.borderRightWidth;
        expect(near).withContext(dir).toBe('1px');
        expect(far).withContext(dir).toBe('0px');
      }
    });

    // spec: navigation-rail-edd0fd, navigation-rail-c7feac
    it('can be elevated to level 1 over content that scrolls underneath', async () => {
      const {rail} = await render(html`<md-gb-nav-rail elevated>${destinations}</md-gb-nav-rail>`);
      const shadow = getComputedStyle(rail.shadowRoot!.querySelector('.nav-rail')!).boxShadow;
      expect(shadow).not.toBe('none');
    });

    // spec: navigation-rail-55ae3b
    it('keeps its destinations fixed while the content scrolls', async () => {
      const {rail} = await render(html`<div style="display: flex; height: 300px">
        <md-gb-nav-rail>${destinations}</md-gb-nav-rail>
        <main style="overflow: auto; flex: 1"><div style="height: 2000px">Content</div></main>
      </div>`);
      const before = rail.getBoundingClientRect().top;
      document.querySelector('main')!.scrollTop = 500;
      await env.waitForStability();
      expect(rail.getBoundingClientRect().top).toBe(before);
    });
  });
});
