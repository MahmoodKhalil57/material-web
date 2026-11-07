/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Tests for spec units that were tracked as gaps and are now built.

// import 'jasmine'; (google3-only)

import './md-gb-tab.js';
import './md-gb-tabs.js';
import '../../styles/icon/md-gb-icon.js';

import {sendKeys} from '@web/test-runner-commands';
import {html, type TemplateResult} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {styles as badgeStyles} from '../badge/badge.cssresult.js';
import focusRingStyles from '../focus/focus-ring.cssresult.js';
import rippleStyles from '../ripple/ripple.cssresult.js';
import {type TabElement} from './tab-element.js';
import {type TabsElement} from './tabs-element.js';
import {styles as tabsStyles} from './tabs.cssresult.js';

adoptStyles(document, [m3Styles, badgeStyles, focusRingStyles, rippleStyles, tabsStyles]);

describe('md-gb-tabs tracked spec units', () => {
  const env = new Environment();

  async function render(template: TemplateResult) {
    const root = env.render(html`<button id="before">Before</button>${template}`);
    await env.waitForStability();
    const tabs = root.querySelector('md-gb-tabs') as TabsElement;
    const items = Array.from(root.querySelectorAll('md-gb-tab')) as TabElement[];
    await env.waitForStability();
    return {root, tabs, items, before: root.querySelector<HTMLElement>('#before')!};
  }

  const three = html`<md-gb-tabs aria-label="Trips">
    <md-gb-tab selected><span slot="label">Flights</span></md-gb-tab>
    <md-gb-tab><span slot="label">Hotels</span></md-gb-tab>
    <md-gb-tab><span slot="label">Car rental and more</span></md-gb-tab>
  </md-gb-tabs>`;

  describe('keyboard', () => {
    // spec: tabs-2afc93, tabs-219136, tabs-4f9b51
    it('moves focus between the tabs with the arrow keys, and with Tab', async () => {
      const {items, before} = await render(three);
      before.focus();
      await sendKeys({press: 'Tab'});
      expect(document.activeElement).toBe(items[0]);
      await sendKeys({press: 'ArrowRight'});
      expect(document.activeElement).toBe(items[1]);
      await sendKeys({press: 'ArrowLeft'});
      expect(document.activeElement).toBe(items[0]);
    });

    // spec: tabs-2d4b99, tabs-87b85c, tabs-2ad70e, tabs-509a62, tabs-4d35af, tabs-e8d9ae
    it('navigates with arrows and Tab, and keeps Space and Enter for activating the focused tab', async () => {
      const {items, before} = await render(three);
      before.focus();
      await sendKeys({press: 'Tab'});
      // Arrow keys alone navigate; they don't activate the tab.
      await sendKeys({press: 'ArrowRight'});
      expect(document.activeElement).toBe(items[1]);
      expect(items[1].selected).toBeFalse();
      await sendKeys({press: 'Enter'});
      await env.waitForStability();
      expect(items[1].selected).toBeTrue();
      await sendKeys({press: 'ArrowRight'});
      expect(items[2].selected).toBeFalse();
      await sendKeys({press: 'Space'});
      await env.waitForStability();
      expect(items[2].selected).toBeTrue();
    });
  });

  describe('selecting', () => {
    // spec: tabs-5c86ba, tabs-42c239, tabs-9b1f67
    it('selects a tab that is tapped and moves the indicator under it', async () => {
      const {tabs, items} = await render(three);
      const before = getComputedStyle(tabs, '::after');
      const left = before.insetInlineStart;
      items[1].click();
      await env.waitForStability();
      document.getAnimations().forEach((a) => a.finish());
      expect(items[1].selected).toBeTrue();
      expect(getComputedStyle(tabs, '::after').insetInlineStart).not.toBe(left);
    });
  });

  describe('layout', () => {
    // spec: tabs-f6cf78, tabs-a716c4
    it('sizes a scrollable tab by its label, so tabs grow with the number of items', async () => {
      const {items, tabs} = await render(html`<md-gb-tabs aria-label="Trips" scrollable>
        <md-gb-tab selected><span slot="label">Flights</span></md-gb-tab>
        <md-gb-tab><span slot="label">Hotels</span></md-gb-tab>
        <md-gb-tab><span slot="label">Car rental and more</span></md-gb-tab>
      </md-gb-tabs>`);
      const widths = items.map((i) => i.getBoundingClientRect().width);
      expect(widths[2]).toBeGreaterThan(widths[0]);
      expect(widths[0]).not.toBe(widths[1]);
      expect(tabs.scrollWidth).toBeGreaterThan(0);
    });

    // spec: tabs-2ac967
    it('takes a small (dot) and a large (number) badge', async () => {
      const {items} = await render(html`<md-gb-tabs aria-label="Trips">
        <md-gb-tab selected><span slot="label">One</span><span class="badge tab-badge" slot="badge"></span></md-gb-tab>
        <md-gb-tab><span slot="label">Two</span><span class="badge tab-badge" slot="badge">3</span></md-gb-tab>
      </md-gb-tabs>`);
      const small = items[0].querySelector('[slot=badge]')!.getBoundingClientRect();
      const large = items[1].querySelector('[slot=badge]')!.getBoundingClientRect();
      expect(small.width).toBeGreaterThan(0);
      expect(large.width).toBeGreaterThan(small.width - 0.5);
      expect(large.height).toBeGreaterThanOrEqual(small.height);
    });
  });
});
