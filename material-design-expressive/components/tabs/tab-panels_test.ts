/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import '../../foundations/accessibility/aria/tabs/md-aria-tabpanel.js';
import './md-gb-tab.js';
import './md-gb-tab-panels.js';
import './md-gb-tabs.js';

import {html, type TemplateResult} from 'lit';
import {Environment} from '../../testing/environment.js';
import {freezeSpringClock, untilTicking} from '../shared/test-dom.js';
import {internals} from '../../internal/behaviors/element-internals.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {styles as tabPanelsStyles} from './tab-panels.cssresult.js';
import {
  TAB_PANEL_OFFSET_PROPERTY,
  TAB_PANELS_CLASSES,
} from './tab-panels.js';
import {styles as tabsStyles} from './tabs.cssresult.js';
import {type TabsElement} from './tabs-element.js';

adoptStyles(document, [m3Styles, tabsStyles]);

const WIDTH = 400;

describe('md-gb-tab-panels', () => {
  const env = new Environment();

  function tabsTemplate(count = 3) {
    return html`
      <md-gb-tabs>
        ${Array.from(
          {length: count},
          (_, i) =>
            html`<md-gb-tab><span slot="label">Tab ${i}</span></md-gb-tab>`,
        )}
      </md-gb-tabs>
    `;
  }

  function panelsTemplate(count = 3, attrs = '') {
    const panels = html`
      ${Array.from(
        {length: count},
        (_, i) => html`<md-aria-tabpanel>Panel ${i}</md-aria-tabpanel>`,
      )}
    `;
    return attrs === 'gestures-disabled'
      ? html`<md-gb-tab-panels gestures-disabled style="inline-size: ${WIDTH}px"
          >${panels}</md-gb-tab-panels
        >`
      : html`<md-gb-tab-panels style="inline-size: ${WIDTH}px"
          >${panels}</md-gb-tab-panels
        >`;
  }

  async function setup(
    template: TemplateResult = html`${tabsTemplate()}${panelsTemplate()}`,
    dir = 'ltr',
  ) {
    const root = env.render(html`<div dir=${dir}>${template}</div>`);
    await env.waitForStability();
    const tabs = root.querySelector('md-gb-tabs') as TabsElement | null;
    const panelsElement = root.querySelector('md-gb-tab-panels')!;
    const tabElements = Array.from(root.querySelectorAll('md-gb-tab'));
    const panels = panelsElement.panels;
    return {root, tabs, panelsElement, tabElements, panels};
  }

  function offsetOf(panel: HTMLElement) {
    const value = panel.style.getPropertyValue(TAB_PANEL_OFFSET_PROPERTY);
    return value === '' ? null : Number(value);
  }

  function visible(panels: HTMLElement[]) {
    return panels.map((panel) => !panel.hidden);
  }

  /** Ends any slide (the fallback timer after the transition duration). */
  async function finishSlide() {
    jasmine.clock().tick(1000);
    await env.waitForStability();
  }

  function swipePointer(
    type: string,
    target: Element,
    x: number,
    time: number,
    y = 100,
  ) {
    const event = new PointerEvent(type, {
      bubbles: true,
      composed: true,
      cancelable: true,
      pointerId: 1,
      pointerType: 'touch',
      isPrimary: true,
      clientX: x,
      clientY: y,
    });
    Object.defineProperty(event, 'timeStamp', {value: time});
    target.dispatchEvent(event);
  }

  async function drag(
    target: Element,
    points: Array<[x: number, time: number]>,
    release = true,
  ) {
    const [[x0, t0], ...moves] = points;
    swipePointer('pointerdown', target, x0, t0);
    for (const [x, t] of release ? moves.slice(0, -1) : moves) {
      swipePointer('pointermove', target, x, t);
    }
    await env.waitForStability();
    if (release) {
      const [x, t] = moves[moves.length - 1];
      swipePointer('pointerup', target, x, t);
      await env.waitForStability();
    }
  }

  describe('rendering', () => {
    it('shows only the selected tab’s panel', async () => {
      const {panels, panelsElement} = await setup();
      expect(visible(panels)).toEqual([true, false, false]);
      expect(panelsElement.selectedIndex).toBe(0);
      expect(panelsElement.activePanel).toBe(panels[0]);
      expect(panelsElement.classList).toContain(TAB_PANELS_CLASSES.tabPanels);
    });

    it('lays out the panels as a clipped, full-width track', async () => {
      const {panelsElement, panels} = await setup();
      const style = getComputedStyle(panelsElement);
      expect(style.display).toBe('grid');
      expect(style.overflow).toBe('clip');
      expect(style.touchAction).toBe('pan-y');
      expect(panels[0].getBoundingClientRect().width).toBe(WIDTH);
    });

    it('shows the panel of the initially selected tab', async () => {
      const {panels} = await setup(html`
        <md-gb-tabs .selectedTabIndex=${2}>
          <md-gb-tab><span slot="label">A</span></md-gb-tab>
          <md-gb-tab><span slot="label">B</span></md-gb-tab>
          <md-gb-tab><span slot="label">C</span></md-gb-tab>
        </md-gb-tabs>
        ${panelsTemplate()}
      `);
      expect(visible(panels)).toEqual([false, false, true]);
    });

    it('ignores children that are not tab panels', async () => {
      const {panelsElement} = await setup(html`
        ${tabsTemplate(2)}
        <md-gb-tab-panels>
          <div role="tabpanel">One</div>
          <span>Decoration</span>
          <div role="tabpanel">Two</div>
        </md-gb-tab-panels>
      `);
      expect(panelsElement.panels.map((p) => p.textContent)).toEqual([
        'One',
        'Two',
      ]);
    });
  });

  describe('linking', () => {
    it('links to the tabs before it', async () => {
      const {tabs, panelsElement} = await setup();
      expect(panelsElement.tabs).toBe(tabs);
    });

    it('links to the tabs named by `for`', async () => {
      const {panelsElement, root} = await setup(html`
        <md-gb-tabs id="my-tabs">
          <md-gb-tab><span slot="label">A</span></md-gb-tab>
          <md-gb-tab><span slot="label">B</span></md-gb-tab>
        </md-gb-tabs>
        <p>Between</p>
        <md-gb-tab-panels for="my-tabs">
          <div role="tabpanel">One</div>
          <div role="tabpanel">Two</div>
        </md-gb-tab-panels>
      `);
      expect(panelsElement.tabs).toBe(root.querySelector('md-gb-tabs'));
      root.querySelectorAll('md-gb-tab')[1].click();
      await env.waitForStability();
      await finishSlide();
      expect(visible(panelsElement.panels)).toEqual([false, true]);
    });

    it('links to the tabs set with the `tabs` property', async () => {
      const {panelsElement, root} = await setup(html`
        <md-gb-tabs>
          <md-gb-tab><span slot="label">A</span></md-gb-tab>
          <md-gb-tab><span slot="label">B</span></md-gb-tab>
        </md-gb-tabs>
        <p>Between</p>
        <md-gb-tab-panels>
          <div role="tabpanel">One</div>
          <div role="tabpanel">Two</div>
        </md-gb-tab-panels>
      `);
      expect(panelsElement.tabs).toBeNull();
      const tabs = root.querySelector('md-gb-tabs')!;
      panelsElement.tabs = tabs;
      expect(panelsElement.tabs).toBe(tabs);
      tabs.selectedTabIndex = 1;
      await env.waitForStability();
      await finishSlide();
      expect(visible(panelsElement.panels)).toEqual([false, true]);
    });

    it('sets aria-controls and aria-labelledby with ElementInternals', async () => {
      const {tabElements, panels} = await setup();
      tabElements.forEach((tab, i) => {
        expect(tab[internals].ariaControlsElements)
          .withContext(`tab ${i}`)
          .toEqual([panels[i]]);
        expect(
          (panels[i] as unknown as {[internals]: ElementInternals})[internals]
            .ariaLabelledByElements,
        )
          .withContext(`panel ${i}`)
          .toEqual([tab]);
      });
    });

    it('sets aria-labelledby on plain role="tabpanel" panels', async () => {
      const {tabElements, panelsElement} = await setup(html`
        ${tabsTemplate(2)}
        <md-gb-tab-panels>
          <div role="tabpanel">One</div>
          <div role="tabpanel">Two</div>
        </md-gb-tab-panels>
      `);
      const panels = panelsElement.panels;
      tabElements.forEach((tab, i) => {
        expect(tab.id).not.toBe('');
        expect(panels[i].getAttribute('aria-labelledby')).toBe(tab.id);
        expect(tab.tabpanelElement).toBe(panels[i]);
      });
    });

    it('links panels added later', async () => {
      const {panelsElement, tabElements} = await setup(html`
        ${tabsTemplate(2)}
        <md-gb-tab-panels>
          <div role="tabpanel">One</div>
        </md-gb-tab-panels>
      `);
      const second = document.createElement('div');
      second.setAttribute('role', 'tabpanel');
      panelsElement.append(second);
      await env.waitForStability();
      expect(tabElements[1].tabpanelElement).toBe(second);
      expect(second.hidden).toBeTrue();
    });
  });

  describe('tab selection', () => {
    it('slides from the old panel to the new one when a tab is clicked', async () => {
      const {tabElements, panels} = await setup();
      tabElements[1].click();
      await env.waitForStability();

      // Mid-slide: both panels are on screen; only the new one is reachable.
      expect(visible(panels)).toEqual([true, true, false]);
      expect(panels[0].inert).toBeTrue();
      expect(panels[1].inert).toBeFalse();
      expect(offsetOf(panels[0])).toBe(-1);
      expect(offsetOf(panels[1])).toBe(0);

      await finishSlide();
      expect(visible(panels)).toEqual([false, true, false]);
      expect(panels[0].inert).toBeFalse();
      expect(offsetOf(panels[0])).toBeNull();
      expect(offsetOf(panels[1])).toBeNull();
    });

    it('slides the new panel in from its side', async () => {
      const {tabElements, panels} = await setup();
      tabElements[2].click();
      await env.waitForStability();
      await finishSlide();

      tabElements[0].click();
      await env.waitForStability();
      // A move back slides the old panel toward the reading end and skips
      // the panels in between.
      expect(offsetOf(panels[0])).toBe(0);
      expect(offsetOf(panels[2])).toBe(1);
      expect(visible(panels)).toEqual([true, false, true]);
    });

    it('finishes the slide when the active panel’s transition ends', async () => {
      const {tabElements, panels} = await setup();
      tabElements[1].click();
      await env.waitForStability();
      panels[1].dispatchEvent(
        new TransitionEvent('transitionend', {
          bubbles: true,
          propertyName: 'translate',
        }),
      );
      expect(visible(panels)).toEqual([false, true, false]);
    });

    it('follows programmatic selection', async () => {
      const {tabs, panels} = await setup();
      tabs!.selectedTabIndex = 2;
      await env.waitForStability();
      await finishSlide();
      expect(visible(panels)).toEqual([false, false, true]);
    });

    it('selects the tab when `selectedIndex` is set', async () => {
      const {tabs, panelsElement, panels} = await setup();
      panelsElement.selectedIndex = 1;
      await env.waitForStability();
      await finishSlide();
      expect(tabs!.selectedTabIndex).toBe(1);
      expect(visible(panels)).toEqual([false, true, false]);
    });

    it('changes instantly when the slide duration is 0 (reduced motion)', async () => {
      const {tabElements, panelsElement, panels} = await setup();
      panelsElement.style.setProperty('--transition-duration', '0s');
      tabElements[1].click();
      await env.waitForStability();
      expect(visible(panels)).toEqual([false, true, false]);
      expect(panels[0].inert).toBeFalse();
    });

    it('zeroes the slide duration with prefers-reduced-motion', () => {
      const text = tabPanelsStyles.cssText;
      expect(text).toMatch(
        /@media\s*\(prefers-reduced-motion: reduce\)\s*\{:host\{--transition-duration: 0s\}/,
      );
    });

    it('works without tabs through `selectedIndex`', async () => {
      const {panelsElement, panels} = await setup(html`${panelsTemplate(2)}`);
      expect(panelsElement.tabs).toBeNull();
      expect(visible(panels)).toEqual([true, false]);
      panelsElement.selectedIndex = 1;
      await finishSlide();
      expect(visible(panels)).toEqual([false, true]);
    });
  });

  describe('swipe', () => {
    it('makes the panels follow a horizontal drag', async () => {
      const {panelsElement, panels} = await setup();
      await drag(
        panels[0],
        [
          [300, 0],
          [250, 100],
          [200, 200],
        ],
        false,
      );
      expect(panelsElement.classList).toContain(TAB_PANELS_CLASSES.dragging);
      expect(visible(panels)).toEqual([true, true, false]);
      expect(panels[1].inert).toBeTrue();
      expect(offsetOf(panels[0])).toBeCloseTo(-0.25);
      expect(offsetOf(panels[1])).toBeCloseTo(0.75);
      swipePointer('pointercancel', panels[0], 200, 300);
      await env.waitForStability();
      expect(panelsElement.classList).not.toContain(
        TAB_PANELS_CLASSES.dragging,
      );
      await finishSlide();
      expect(visible(panels)).toEqual([true, false, false]);
    });

    // spec: tabs-2a02c1, tabs-79df51, tabs-fd3bbd
    it('moves to the next tab when released past half the width', async () => {
      const {tabs, panels, panelsElement} = await setup();
      const onChange = jasmine.createSpy('change');
      tabs!.addEventListener('change', onChange);
      await drag(panels[0], [
        [380, 0],
        [300, 500],
        [150, 1000],
        [150, 2000],
      ]);

      expect(tabs!.selectedTabIndex).toBe(1);
      expect(onChange).toHaveBeenCalledTimes(1);
      // Settling: the old panel stays on screen until the slide ends.
      expect(visible(panels)).toEqual([true, true, false]);
      // The spring carries the panels on from where they were released.
      expect(offsetOf(panels[0])).toBeLessThan(0);
      expect(offsetOf(panels[0])).toBeGreaterThan(-1);
      expect(offsetOf(panels[1])).toBeGreaterThan(0);
      expect(await untilTicking(() => !panelsElement.classList.contains(TAB_PANELS_CLASSES.dragging))).toBeTrue();
      expect(visible(panels)).toEqual([false, true, false]);
    });

    it('keeps the release velocity: the settle starts moving the way the finger was going', async () => {
      const {tabs, panels} = await setup();
      const clock = freezeSpringClock();
      // Past half toward the next panel, then slowly back: it still moves on,
      // but the spring first drifts back with the finger.
      await drag(panels[0], [
        [380, 0],
        [300, 500],
        [145, 980],
        [147, 1000],
        [149, 1020],
      ]);
      expect(tabs!.selectedTabIndex).toBe(1);
      const released = offsetOf(panels[1])!;
      clock.advance(1);
      expect(offsetOf(panels[1])!).toBeGreaterThan(released);
    });

    it('returns to the same tab when released before half the width', async () => {
      const {tabs, panels, panelsElement} = await setup();
      const onChange = jasmine.createSpy('change');
      tabs!.addEventListener('change', onChange);
      await drag(panels[0], [
        [300, 0],
        [280, 500],
        [250, 1000],
        [250, 2000],
      ]);

      expect(tabs!.selectedTabIndex).toBe(0);
      expect(onChange).not.toHaveBeenCalled();
      expect(offsetOf(panels[0])).toBeLessThan(0.5);
      expect(offsetOf(panels[1])).toBeGreaterThan(0.5);
      expect(await untilTicking(() => !panelsElement.classList.contains(TAB_PANELS_CLASSES.dragging))).toBeTrue();
      expect(visible(panels)).toEqual([true, false, false]);
    });

    it('moves on a fling faster than 400px/s, however short', async () => {
      const {tabs, panels} = await setup();
      // 40px in 50ms: 800px/s.
      await drag(panels[0], [
        [300, 0],
        [280, 25],
        [260, 50],
      ]);
      expect(tabs!.selectedTabIndex).toBe(1);
    });

    it('swipes back to the previous tab', async () => {
      const {tabs, panels} = await setup();
      tabs!.selectedTabIndex = 1;
      await env.waitForStability();
      await finishSlide();
      await drag(panels[1], [
        [50, 0],
        [150, 500],
        [300, 1000],
        [300, 2000],
      ]);
      expect(tabs!.selectedTabIndex).toBe(0);
    });

    it('does not move past the first panel', async () => {
      const {tabs, panels} = await setup();
      await drag(
        panels[0],
        [
          [50, 0],
          [150, 100],
          [350, 200],
        ],
        false,
      );
      expect(offsetOf(panels[0])).toBe(0);
      expect(visible(panels)).toEqual([true, true, false]);
      swipePointer('pointerup', panels[0], 350, 300);
      await env.waitForStability();
      expect(tabs!.selectedTabIndex).toBe(0);
    });

    it('moves at most one panel per swipe', async () => {
      const {tabs, panels} = await setup();
      await drag(panels[0], [
        [399, 0],
        [200, 50],
        [-500, 100],
      ]);
      expect(tabs!.selectedTabIndex).toBe(1);
    });

    it('mirrors in right-to-left layouts', async () => {
      const {tabs, panels} = await setup(undefined, 'rtl');
      await drag(panels[0], [
        [20, 0],
        [100, 500],
        [250, 1000],
        [250, 2000],
      ]);
      expect(tabs!.selectedTabIndex).toBe(1);
      expect(getComputedStyle(panels[1]).translate).not.toBe('none');
    });

    it('ignores vertical drags', async () => {
      const {panelsElement, panels} = await setup();
      swipePointer('pointerdown', panels[0], 200, 0, 100);
      swipePointer('pointermove', panels[0], 205, 100, 200);
      await env.waitForStability();
      expect(panelsElement.classList).not.toContain(
        TAB_PANELS_CLASSES.dragging,
      );
      swipePointer('pointerup', panels[0], 205, 200, 300);
    });

    it('does not swipe with gestures-disabled', async () => {
      const {tabs, panels, panelsElement} = await setup(
        html`${tabsTemplate()}${panelsTemplate(3, 'gestures-disabled')}`,
      );
      expect(getComputedStyle(panelsElement).touchAction).toBe('auto');
      await drag(panels[0], [
        [380, 0],
        [300, 500],
        [150, 1000],
        [150, 2000],
      ]);
      expect(tabs!.selectedTabIndex).toBe(0);
      expect(visible(panels)).toEqual([true, false, false]);
    });

    it('does not swipe from a text field', async () => {
      const {tabs, panelsElement} = await setup(html`
        ${tabsTemplate(2)}
        <md-gb-tab-panels style="inline-size: ${WIDTH}px">
          <div role="tabpanel"><input /></div>
          <div role="tabpanel">Two</div>
        </md-gb-tab-panels>
      `);
      const input = panelsElement.querySelector('input')!;
      await drag(input, [
        [380, 0],
        [300, 500],
        [150, 1000],
        [150, 2000],
      ]);
      expect(tabs!.selectedTabIndex).toBe(0);
    });

    it('fires change on itself without tabs', async () => {
      const {panelsElement, panels} = await setup(html`${panelsTemplate(2)}`);
      const onChange = jasmine.createSpy('change');
      panelsElement.addEventListener('change', onChange);
      await drag(panels[0], [
        [380, 0],
        [300, 500],
        [150, 1000],
        [150, 2000],
      ]);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(panelsElement.selectedIndex).toBe(1);
    });

    it('does not click what is under a swipe', async () => {
      const {panelsElement} = await setup(html`
        ${tabsTemplate(2)}
        <md-gb-tab-panels style="inline-size: ${WIDTH}px">
          <div role="tabpanel"><button>Go</button></div>
          <div role="tabpanel">Two</div>
        </md-gb-tab-panels>
      `);
      const button = panelsElement.querySelector('button')!;
      let clicks = 0;
      button.addEventListener('click', () => {
        clicks++;
      });
      await drag(
        button,
        [
          [380, 0],
          [300, 500],
          [150, 1000],
        ],
        false,
      );
      // The click follows the release before any timer runs.
      swipePointer('pointerup', button, 150, 2000);
      button.click();
      expect(clicks).toBe(0);
    });
  });
});
