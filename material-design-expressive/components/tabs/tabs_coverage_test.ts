/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Behavior tests for tabs spec units that no other suite cites: the container,
// the icon and label anatomy, the active indicator, states, scrolling, the
// ripple, focus and swipe. Each test cites the units it proves.

// import 'jasmine'; (google3-only)

import '../../foundations/accessibility/aria/tabs/md-aria-tabpanel.js';
import '../appbar/md-gb-app-bar.js';
import './md-gb-tab.js';
import './md-gb-tab-panels.js';
import './md-gb-tabs.js';
import '../../styles/icons/md-gb-icon.js';

import {sendKeys, sendMouse} from '@web/test-runner-commands';
import {html, type TemplateResult} from 'lit';
import {Environment} from '../../testing/environment.js';
import {internals} from '../../internal/behaviors/element-internals.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {styles as badgeStyles} from '../badge/badge.cssresult.js';
import focusRingStyles from '../../foundations/interaction/states/focus/focus-ring.cssresult.js';
import rippleStyles from '../../foundations/interaction/states/ripple/ripple.cssresult.js';
import {center, prop} from '../shared/test-dom.js';
import {type TabElement} from './tab-element.js';
import {type TabPanelsElement} from './tab-panels-element.js';
import {type TabsElement} from './tabs-element.js';
import {styles as tabsStyles} from './tabs.cssresult.js';

adoptStyles(document, [
  m3Styles,
  badgeStyles,
  focusRingStyles,
  rippleStyles,
  tabsStyles,
]);

// The Environment installs a Jasmine clock, which makes timers synchronous, so
// waiting on setTimeout never resolves. Keep the browser's own frame callback
// for waits that depend on scroll events and style updates.
const nativeFrame = window.requestAnimationFrame.bind(window);

/** Resolves on the next painted frame. */
function frame() {
  return new Promise<void>((resolve) => nativeFrame(() => resolve()));
}

/** Waits up to `frames` frames for `check` to pass; returns its result. */
async function settle(check: () => unknown, frames = 60) {
  for (let i = 0; i < frames && !check(); i++) {
    await frame();
  }
  return check();
}

/** The client rectangle of an element, as plain numbers. */
function rectOf(el: Element) {
  const r = el.getBoundingClientRect();
  return {
    top: r.top,
    bottom: r.bottom,
    left: r.left,
    right: r.right,
    width: r.width,
    height: r.height,
  };
}

/**
 * Ends running transitions and animations so that reads see the final state.
 * The style flush comes first: a transition only starts on a style change, so
 * finishing before the flush would leave it running from its start value.
 */
function finishAnimations() {
  void document.documentElement.offsetWidth;
  document.getAnimations().forEach((a) => a.finish());
}

describe('tabs coverage', () => {
  const env = new Environment();

  /**
   * Renders into a block-level wrapper. The Environment root is inline-flex,
   * so bare siblings would sit side by side.
   */
  async function render(template: TemplateResult) {
    const root = env.render(html`<div style="display: block; inline-size: 420px">
      <button id="before">Before</button>
      ${template}
    </div>`);
    await env.waitForStability();
    await env.waitForStability();
    const tabs = root.querySelector('md-gb-tabs') as TabsElement;
    const items = Array.from(root.querySelectorAll('md-gb-tab')) as TabElement[];
    return {
      root,
      tabs,
      items,
      before: root.querySelector<HTMLElement>('#before')!,
    };
  }

  const trio = html`<md-gb-tabs aria-label="Trips" style="inline-size: 360px">
    <md-gb-tab selected><span slot="label">Flights</span></md-gb-tab>
    <md-gb-tab><span slot="label">Hotels</span></md-gb-tab>
    <md-gb-tab><span slot="label">Trains</span></md-gb-tab>
  </md-gb-tabs>`;

  describe('container', () => {
    // spec: tabs-de7100, tabs-126ef1
    it('is one tablist that holds its tabs in a single row, each inside its bounds', async () => {
      const {tabs, items} = await render(trio);
      expect(tabs[internals].role).toBe('tablist');
      expect(items.length).toBe(3);
      expect(items.every((item) => item.parentElement === tabs)).toBeTrue();
      const bar = rectOf(tabs);
      const tops = new Set(items.map((item) => Math.round(rectOf(item).top)));
      expect(tops.size).toBe(1);
      for (const item of items) {
        const r = rectOf(item);
        expect(r.left).toBeGreaterThanOrEqual(bar.left - 0.5);
        expect(r.right).toBeLessThanOrEqual(bar.right + 0.5);
      }
    });

    // spec: tabs-6ea0d8
    it('lets content scroll under a container that stays at the top and paints over it', async () => {
      const root = env.render(html`<div style="display: block; inline-size: 420px">
        <div
          id="scroller"
          style="block-size: 220px; overflow-y: auto; position: relative">
          <div style="position: sticky; top: 0; z-index: 1">
            <md-gb-tabs aria-label="Trips" style="inline-size: 320px">
              <md-gb-tab selected><span slot="label">Flights</span></md-gb-tab>
              <md-gb-tab><span slot="label">Hotels</span></md-gb-tab>
            </md-gb-tabs>
          </div>
          <p style="block-size: 1200px; margin: 0">Content under the tabs</p>
        </div>
      </div>`);
      await env.waitForStability();
      const scroller = root.querySelector<HTMLElement>('#scroller')!;
      const tabs = root.querySelector('md-gb-tabs') as TabsElement;
      const before = rectOf(tabs).top;
      scroller.scrollTop = 400;
      await settle(() => scroller.scrollTop > 0);
      // The container stays where it was, so the content has passed under it.
      expect(Math.round(rectOf(tabs).top)).toBe(Math.round(before));
      expect(scroller.scrollTop).toBeGreaterThan(0);
      const at = center(tabs);
      expect(document.elementFromPoint(at.x, at.y)?.closest('md-gb-tabs')).toBe(
        tabs,
      );
      // The container is opaque, so the content under it is covered.
      const rgba = getComputedStyle(tabs).backgroundColor.match(/[\d.]+/g);
      expect(rgba && rgba.length === 4 ? Number(rgba[3]) : 1).toBe(1);
    });
  });

  describe('icon and label', () => {
    // spec: tabs-b730b5
    it('shows a text-only tab next to a tab with an icon, the icon stacked above its label', async () => {
      const {items} = await render(html`<md-gb-tabs aria-label="Shop" style="inline-size: 360px">
        <md-gb-tab selected><span slot="label">Purchases</span></md-gb-tab>
        <md-gb-tab>
          <md-gb-icon>favorite</md-gb-icon>
          <span slot="label">Wishlist</span>
        </md-gb-tab>
      </md-gb-tabs>`);
      const [text, iconed] = items;
      expect(text.querySelector('md-gb-icon')).toBeNull();
      const icon = rectOf(iconed.querySelector('md-gb-icon')!);
      const label = rectOf(iconed.querySelector('[slot=label]')!);
      expect(icon.bottom).toBeLessThanOrEqual(label.top + 0.5);
      // A text-only label sits on the centre line of its tab.
      const textLabel = rectOf(text.querySelector('[slot=label]')!);
      const textTab = rectOf(text);
      expect(
        Math.abs(
          textLabel.top + textLabel.height / 2 - (textTab.top + textTab.height / 2),
        ),
      ).toBeLessThan(2);
    });
  });

  describe('active indicator', () => {
    // spec: tabs-691a5a
    it('draws the indicator under the selected icon and label, which take the active color', async () => {
      const {tabs, items} = await render(html`<md-gb-tabs aria-label="Trips" style="inline-size: 360px">
        <md-gb-tab selected>
          <md-gb-icon>flight</md-gb-icon>
          <span slot="label">Flights</span>
        </md-gb-tab>
        <md-gb-tab>
          <md-gb-icon>hotel</md-gb-icon>
          <span slot="label">Hotels</span>
        </md-gb-tab>
      </md-gb-tabs>`);
      finishAnimations();
      await env.waitForStability();
      const selected = items[0];
      const icon = rectOf(selected.querySelector('md-gb-icon')!);
      const label = rectOf(selected.querySelector('[slot=label]')!);
      const bar = rectOf(tabs);
      const indicator = getComputedStyle(tabs, '::after');
      expect(indicator.display).not.toBe('none');
      // The indicator runs from the start of the content to its end, plus the
      // 2dp inset, not across the whole tab.
      const left = bar.left + tabs.clientLeft + parseFloat(indicator.insetInlineStart);
      const right = bar.right - tabs.clientLeft - parseFloat(indicator.insetInlineEnd);
      expect(Math.abs(left - Math.min(icon.left, label.left))).toBeLessThan(4);
      expect(Math.abs(right - Math.max(icon.right, label.right))).toBeLessThan(4);
      // It sits at the bottom edge of the bar, under the label.
      expect(parseFloat(indicator.insetBlockEnd)).toBe(0);
      expect(parseFloat(indicator.height)).toBe(3);
      expect(label.bottom).toBeLessThanOrEqual(bar.bottom - 3 + 1);
      // Selected and unselected labels use different colors.
      const selectedColor = getComputedStyle(selected.querySelector('[slot=label]')!).color;
      const idleColor = getComputedStyle(items[1].querySelector('[slot=label]')!).color;
      expect(selectedColor).not.toBe(idleColor);
    });
  });

  describe('states', () => {
    // spec: tabs-a4b627
    it('changes an inactive tab for hover, focus, and pressed, and leaves the selected tab in the active color', async () => {
      const {items, before} = await render(trio);
      finishAnimations();
      const labelOf = (i: number) => items[i].querySelector('[slot=label]')!;
      const colorOf = (i: number) => {
        finishAnimations();
        return getComputedStyle(labelOf(i)).color;
      };
      const idle = colorOf(1);
      const at = center(items[1]);

      // Hover: the pointer over an inactive tab changes its label color, and
      // moving away restores the idle color.
      await sendMouse({type: 'move', position: [at.x, at.y]});
      await env.waitForStability();
      const hover = colorOf(1);
      expect(hover).not.toBe(idle);
      await sendMouse({type: 'move', position: [0, 0]});
      await env.waitForStability();
      expect(colorOf(1)).toBe(idle);

      // Focus: keyboard focus on the inactive tab uses the focused color.
      before.focus();
      await sendKeys({press: 'Tab'});
      await sendKeys({press: 'ArrowRight'});
      await settle(() => document.activeElement === items[1]);
      expect(document.activeElement).toBe(items[1]);
      expect(colorOf(1)).toBe(hover);
      await sendKeys({press: 'ArrowLeft'});
      await env.waitForStability();

      // Pressed: the pointer held down on an inactive tab uses the pressed
      // color and shows the press ripple.
      const press = center(items[2]);
      await sendMouse({type: 'move', position: [press.x, press.y]});
      await sendMouse({type: 'down'});
      await env.waitForStability();
      expect(colorOf(2)).toBe(hover);
      expect(Number.parseFloat(prop(items[2], '--ripple-press-opacity'))).toBeGreaterThan(0);
      // Releasing on the tab clicks it, so the pressed tab becomes the selected
      // one: it takes the active color and the previous tab goes idle.
      await sendMouse({type: 'up'});
      await sendMouse({type: 'move', position: [0, 0]});
      await env.waitForStability();
      expect(items[2].selected).toBeTrue();
      expect(items[0].selected).toBeFalse();
      expect(colorOf(2)).not.toBe(idle);
      expect(colorOf(0)).toBe(idle);
    });

    // spec: tabs-4371ea
    it('shows the hover state on pointer hover, and a click makes the tab active', async () => {
      const {items} = await render(trio);
      finishAnimations();
      const label = items[1].querySelector('[slot=label]')!;
      const idle = getComputedStyle(label).color;
      const at = center(items[1]);
      await sendMouse({type: 'move', position: [at.x, at.y]});
      await settle(() => items[1].matches(':hover'));
      finishAnimations();
      expect(getComputedStyle(label).color).not.toBe(idle);
      await sendMouse({type: 'click', position: [at.x, at.y]});
      await env.waitForStability();
      expect(items[1].selected).toBeTrue();
      expect(items[0].selected).toBeFalse();
      await sendMouse({type: 'move', position: [0, 0]});
    });
  });

  describe('fixed and scrollable tabs', () => {
    // spec: tabs-2c6598
    it('shows every fixed tab at once: equal widths and no overflow', async () => {
      const {tabs, items} = await render(trio);
      expect(tabs.scrollable).toBeFalse();
      expect(tabs.scrollWidth).toBeLessThanOrEqual(tabs.clientWidth + 1);
      const widths = items.map((item) => rectOf(item).width);
      expect(Math.max(...widths) - Math.min(...widths)).toBeLessThan(1);
      const bar = rectOf(tabs);
      for (const item of items) {
        expect(rectOf(item).right).toBeLessThanOrEqual(bar.right + 0.5);
      }
    });

    // spec: tabs-b6bdad
    it('takes a larger number of tabs with longer labels, and the bar scrolls to reach them', async () => {
      const labels = [
        'Flights and hotels',
        'Trains',
        'Car rental and more',
        'Restaurants nearby',
        'Museum tickets',
        'Travel insurance',
        'Currency exchange',
        'Packing list',
      ];
      const {tabs, items} = await render(html`<md-gb-tabs
        aria-label="Trip"
        scrollable
        style="inline-size: 320px">
        ${labels.map(
          (label, i) =>
            html`<md-gb-tab ?selected=${i === 0}
              ><span slot="label">${label}</span></md-gb-tab
            >`,
        )}
      </md-gb-tabs>`);
      expect(tabs.scrollable).toBeTrue();
      expect(tabs.scrollWidth).toBeGreaterThan(tabs.clientWidth);
      expect(items.length).toBe(labels.length);
      expect(
        items.every((item) => item.scrollWidth <= item.clientWidth + 1),
      ).toBeTrue();
    });

    // spec: tabs-699a57, tabs-6afc51
    it('gives a scrollable tab room for its whole label, so a longer title is wider and not cut off', async () => {
      const {tabs, items} = await render(html`<md-gb-tabs
        aria-label="Trip"
        scrollable
        style="inline-size: 320px">
        <md-gb-tab selected><span slot="label">Hotels</span></md-gb-tab>
        <md-gb-tab><span slot="label">Car rental and more</span></md-gb-tab>
        <md-gb-tab><span slot="label">Trains</span></md-gb-tab>
        <md-gb-tab><span slot="label">Museum tickets</span></md-gb-tab>
      </md-gb-tabs>`);
      const [short, long] = [rectOf(items[0]), rectOf(items[1])];
      expect(long.width).toBeGreaterThan(short.width);
      // One line: the label does not wrap, so the tab keeps its height.
      expect(Math.abs(long.height - short.height)).toBeLessThan(1);
      expect(items[1].scrollWidth).toBeLessThanOrEqual(items[1].clientWidth + 1);
      // The last tab is reached by scrolling the bar, not by shrinking the tabs.
      expect(tabs.scrollWidth).toBeGreaterThan(tabs.clientWidth);
      tabs.scrollLeft = tabs.scrollWidth;
      await settle(() => tabs.scrollLeft > 0);
      expect(rectOf(items[3]).right).toBeLessThanOrEqual(rectOf(tabs).right + 1);
    });

    // spec: tabs-5adb26, tabs-d34540
    it('scrolls the bar left and right when the tabs overflow', async () => {
      const {tabs} = await render(html`<md-gb-tabs
        aria-label="Trip"
        scrollable
        style="inline-size: 240px">
        ${Array.from(
          {length: 6},
          (_, i) =>
            html`<md-gb-tab><span slot="label">Tab number ${i}</span></md-gb-tab>`,
        )}
      </md-gb-tabs>`);
      expect(prop(tabs, 'overflow-x')).toBe('auto');
      tabs.scrollLeft = 150;
      await settle(() => tabs.scrollLeft > 0);
      expect(tabs.scrollLeft).toBeGreaterThan(100);
      tabs.scrollLeft = 0;
      await settle(() => tabs.scrollLeft === 0);
      expect(tabs.scrollLeft).toBe(0);
    });

    it('does not scroll fixed tabs that fit', async () => {
      const {tabs} = await render(trio);
      tabs.scrollLeft = 100;
      await env.waitForStability();
      expect(tabs.scrollLeft).toBe(0);
    });
  });

  describe('scrolling content', () => {
    // spec: tabs-78305b
    it('stays at the top of the screen while the content scrolls, when placed at the top', async () => {
      const root = env.render(html`<div style="display: block; inline-size: 420px">
        <div id="scroller" style="block-size: 260px; overflow-y: auto">
          <div style="position: sticky; top: 0; z-index: 1">
            <md-gb-tabs aria-label="Trips" style="inline-size: 320px">
              <md-gb-tab selected><span slot="label">Flights</span></md-gb-tab>
              <md-gb-tab><span slot="label">Hotels</span></md-gb-tab>
            </md-gb-tabs>
          </div>
          <p style="block-size: 1500px; margin: 0">Long content</p>
        </div>
      </div>`);
      await env.waitForStability();
      const tabs = root.querySelector('md-gb-tabs') as TabsElement;
      const scroller = root.querySelector<HTMLElement>('#scroller')!;
      const at = Math.round(rectOf(tabs).top);
      scroller.scrollTop = 500;
      await settle(() => scroller.scrollTop > 0);
      expect(scroller.scrollTop).toBeGreaterThan(0);
      expect(Math.round(rectOf(tabs).top)).toBe(at);
      expect(tabs.hasAttribute('scroll-hidden')).toBeFalse();
      expect(prop(tabs, 'transform')).toBe('none');
    });

    // spec: tabs-543063
    it('either stays at the top or scrolls off the screen with the content, by scroll-behavior', async () => {
      const root = env.render(html`<div style="display: block; inline-size: 420px">
        <div id="scroller" style="block-size: 260px; overflow-y: auto">
          <div style="position: sticky; top: 0; z-index: 1">
            <md-gb-tabs
              aria-label="Trips"
              scroll-behavior="hide"
              scroll-target="scroller"
              style="inline-size: 320px">
              <md-gb-tab selected><span slot="label">Flights</span></md-gb-tab>
              <md-gb-tab><span slot="label">Hotels</span></md-gb-tab>
            </md-gb-tabs>
          </div>
          <p style="block-size: 1500px; margin: 0">Long content</p>
        </div>
      </div>`);
      await env.waitForStability();
      const tabs = root.querySelector('md-gb-tabs') as TabsElement;
      const scroller = root.querySelector<HTMLElement>('#scroller')!;
      scroller.scrollTop = 600;
      expect(await settle(() => tabs.hasAttribute('scroll-hidden'))).toBeTrue();
      finishAnimations();
      expect(rectOf(tabs).bottom).toBeLessThanOrEqual(rectOf(scroller).top + 1);
      // Scrolling back up reveals the tabs again.
      scroller.scrollTop = 500;
      expect(await settle(() => !tabs.hasAttribute('scroll-hidden'))).toBeTrue();
      scroller.scrollTop = 0;
      await settle(() => scroller.scrollTop === 0);
      finishAnimations();
      expect(Math.abs(rectOf(tabs).top - rectOf(scroller).top)).toBeLessThan(1.5);
    });

    // spec: tabs-f15a7a, tabs-0b0eec
    it('moves with an app bar it is attached to, as one unit, and never behind it', async () => {
      const root = env.render(html`<div style="display: block; inline-size: 420px">
        <div id="scroller" style="block-size: 300px; overflow-y: auto">
          <md-gb-app-bar
            id="bar"
            size="sm"
            scroll-behavior="hide"
            scroll-target="scroller"
            style="position: sticky; top: 0; z-index: 1">
            <span slot="title">Trips</span>
            <md-gb-tabs slot="tabs" aria-label="Trips">
              <md-gb-tab selected><span slot="label">Flights</span></md-gb-tab>
              <md-gb-tab><span slot="label">Hotels</span></md-gb-tab>
            </md-gb-tabs>
          </md-gb-app-bar>
          <p style="block-size: 1500px; margin: 0">Long content</p>
        </div>
      </div>`);
      await env.waitForStability();
      const bar = root.querySelector('md-gb-app-bar')!;
      // The host also holds the slotted tabs, so measure the bar's own row.
      const row = bar.shadowRoot!.querySelector('[part="app-bar"]')!;
      const tabs = root.querySelector('md-gb-tabs')!;
      const scroller = root.querySelector<HTMLElement>('#scroller')!;
      finishAnimations();
      const gap = () => {
        finishAnimations();
        return rectOf(tabs).top - rectOf(row).top;
      };
      // Not behind the bar: the attached tabs start below the bar's own row.
      expect(rectOf(tabs).top).toBeGreaterThanOrEqual(rectOf(row).bottom - 1);
      const attached = gap();
      scroller.scrollTop = 600;
      expect(await settle(() => bar.hasAttribute('scroll-hidden'))).toBeTrue();
      finishAnimations();
      expect(rectOf(tabs).bottom).toBeLessThanOrEqual(rectOf(scroller).top + 1);
      expect(Math.abs(gap() - attached)).toBeLessThan(1);
      scroller.scrollTop = 500;
      expect(await settle(() => !bar.hasAttribute('scroll-hidden'))).toBeTrue();
      expect(Math.abs(gap() - attached)).toBeLessThan(1);
    });
  });

  describe('ripple', () => {
    // spec: tabs-24d2a4
    it('shows the ripple where a tab is pressed, and clears it on release', async () => {
      const {items} = await render(trio);
      finishAnimations();
      const tab = items[1];
      const at = center(tab);
      expect(tab.classList.contains('ripple')).toBeTrue();
      const press = () => {
        finishAnimations();
        return Number.parseFloat(prop(tab, '--ripple-press-opacity')) || 0;
      };
      const idle = press();
      await sendMouse({type: 'move', position: [at.x, at.y]});
      await sendMouse({type: 'down'});
      await env.waitForStability();
      expect(press()).toBeGreaterThan(idle);
      await sendMouse({type: 'up'});
      await sendMouse({type: 'move', position: [0, 0]});
      await env.waitForStability();
      expect(press()).toBe(idle);
      expect(tab.selected).toBeTrue();
    });
  });

  describe('focus indicator', () => {
    // spec: tabs-17c4c2, tabs-2fdc76, tabs-72543e
    it('shows a focus indicator on the tab that Tab reaches, and keeps it on the tab that is then selected', async () => {
      const {items, before} = await render(trio);
      finishAnimations();
      before.focus();
      await sendKeys({press: 'Tab'});
      await settle(() => document.activeElement === items[0]);
      finishAnimations();
      expect(document.activeElement).toBe(items[0]);
      expect(items[0].matches(':focus-visible')).toBeTrue();
      const ring = getComputedStyle(items[0], '::before');
      expect(ring.outlineStyle).not.toBe('none');
      expect(Number.parseFloat(ring.outlineWidth)).toBeGreaterThan(0);

      await sendKeys({press: 'ArrowRight'});
      await settle(() => document.activeElement === items[1]);
      finishAnimations();
      expect(items[1].matches(':focus-visible')).toBeTrue();
      expect(getComputedStyle(items[1], '::before').outlineStyle).not.toBe(
        'none',
      );
      expect(items[0].matches(':focus-visible')).toBeFalse();

      await sendKeys({press: 'Enter'});
      await env.waitForStability();
      finishAnimations();
      expect(items[1].selected).toBeTrue();
      expect(items[1].matches(':focus-visible')).toBeTrue();
      expect(getComputedStyle(items[1], '::before').outlineStyle).not.toBe(
        'none',
      );
    });
  });

  describe('swipe', () => {
    // spec: tabs-d4fad5
    it('swipes the content left to select the next tab, and ignores a vertical scroll of the content', async () => {
      const root = env.render(html`<div style="display: block; inline-size: 420px">
        <md-gb-tabs aria-label="Trips" style="inline-size: 400px">
          <md-gb-tab selected><span slot="label">Flights</span></md-gb-tab>
          <md-gb-tab><span slot="label">Hotels</span></md-gb-tab>
          <md-gb-tab><span slot="label">Trains</span></md-gb-tab>
        </md-gb-tabs>
        <md-gb-tab-panels style="inline-size: 400px">
          <md-aria-tabpanel>Flights content</md-aria-tabpanel>
          <md-aria-tabpanel>Hotels content</md-aria-tabpanel>
          <md-aria-tabpanel>Trains content</md-aria-tabpanel>
        </md-gb-tab-panels>
      </div>`);
      await env.waitForStability();
      const tabs = root.querySelector('md-gb-tabs') as TabsElement;
      const panels = root.querySelector('md-gb-tab-panels') as TabPanelsElement;
      const target = panels.panels[0];

      // A mostly vertical drag scrolls the page and selects nothing.
      await drag(env, target, [
        [200, 100, 0],
        [200, 200, 300],
        [200, 250, 600],
        [200, 250, 900],
      ]);
      expect(tabs.selectedTabIndex).toBe(0);

      // A horizontal swipe to the left (toward the end) selects the next tab.
      await drag(env, target, [
        [380, 100, 0],
        [300, 100, 500],
        [150, 100, 1000],
        [150, 100, 2000],
      ]);
      await settle(() => tabs.selectedTabIndex === 1);
      expect(tabs.selectedTabIndex).toBe(1);
    });
  });
});

/** Dispatches one touch pointer event at (x, y) with a time stamp. */
function swipePointer(
  type: string,
  target: Element,
  x: number,
  y: number,
  time: number,
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

/** Presses at the first point, moves through the rest, and releases at the last. */
async function drag(
  env: Environment,
  target: Element,
  points: Array<[x: number, y: number, time: number]>,
) {
  const [[x0, y0, t0], ...moves] = points;
  swipePointer('pointerdown', target, x0, y0, t0);
  for (const [x, y, t] of moves.slice(0, -1)) {
    swipePointer('pointermove', target, x, y, t);
  }
  await env.waitForStability();
  const [x, y, t] = moves[moves.length - 1];
  swipePointer('pointerup', target, x, y, t);
  await env.waitForStability();
}
