/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import '../appbar/md-gb-app-bar.js';
import '../navbar/md-gb-nav-bar.js';
import '../navbar/md-gb-nav-bar-item.js';
import '../tabs/md-gb-tab.js';
import '../tabs/md-gb-tabs.js';
import '../toolbar/md-gb-toolbar.js';
import '../iconbutton/md-gb-icon-button.js';

import {emulateMedia, sendKeys} from '@web/test-runner-commands';
import {html, render as litRender, type TemplateResult} from 'lit';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {AppBarElement} from '../appbar/app-bar-element.js';
import {
  parseScrollBehavior,
  SCROLL_HIDDEN_ATTRIBUTE,
  SCROLL_THRESHOLD,
  stepScroll,
  type ScrollStep,
} from './scroll-behavior.js';
import {until} from './test-dom.js';

adoptStyles(document, [m3Styles]);

const TOP: ScrollStep = {y: 0, hidden: false, travel: 0};

function run(positions: number[], canHide = true, from = TOP) {
  let step = from;
  for (const y of positions) step = stepScroll(step, y, canHide);
  return step;
}

describe('stepScroll', () => {
  it('hides after scrolling down past the threshold', () => {
    expect(run([SCROLL_THRESHOLD - 1]).hidden).toBeFalse();
    expect(run([SCROLL_THRESHOLD]).hidden).toBeTrue();
  });

  // spec: app-bars-35b14b, navigation-bar-f032de
  it('reveals on scrolling up and at the top', () => {
    const hidden = run([100, 200]);
    expect(hidden.hidden).toBeTrue();
    expect(stepScroll(hidden, 200 - SCROLL_THRESHOLD).hidden).toBeFalse();
    expect(stepScroll(hidden, 0).hidden).toBeFalse();
  });

  it('ignores small back-and-forth movement', () => {
    expect(run([100, 98, 101, 99]).hidden).toBeTrue();
    expect(run([100, 200, 195, 205, 200]).hidden).toBeTrue();
  });

  it('only reveals when it cannot hide', () => {
    expect(run([100, 200], false).hidden).toBeFalse();
    const hidden = run([100, 200]);
    expect(run([300], false, hidden).hidden).toBeTrue();
    expect(run([100], false, hidden).hidden).toBeFalse();
  });

  it('parses the behavior attribute', () => {
    expect(parseScrollBehavior('hide')).toBe('hide');
    expect(parseScrollBehavior('compress')).toBe('compress');
    expect(parseScrollBehavior('other')).toBeNull();
    expect(parseScrollBehavior(null)).toBeNull();
  });
});

describe('scroll behavior controller', () => {
  // Real timers: the shared Environment installs a fake clock, which would
  // stop scroll events and animation frames from being waited on.
  const roots: HTMLElement[] = [];

  afterEach(() => {
    for (const root of roots.splice(0)) root.remove();
  });

  async function render(template: TemplateResult) {
    const root = document.createElement('div');
    document.body.append(root);
    roots.push(root);
    litRender(html`
      <div id="scroller" tabindex="0" style="height: 300px; overflow: auto">
        <div style="height: 4000px"></div>
      </div>
      ${template}
    `, root);
    for (const el of root.querySelectorAll('*')) {
      await (el as {updateComplete?: Promise<unknown>}).updateComplete;
    }
    return {
      root,
      scroller: root.querySelector<HTMLElement>('#scroller')!,
    };
  }

  const frame = () => new Promise((r) => requestAnimationFrame(() => r(null)));

  async function scrollTo(scroller: HTMLElement, top: number) {
    scroller.scrollTop = top;
    await until(() => scroller.scrollTop === top);
    await frame();
    await frame();
  }

  function isHidden(el: Element) {
    return el.hasAttribute(SCROLL_HIDDEN_ATTRIBUTE);
  }

  afterEach(() => emulateMedia({reducedMotion: 'no-preference'}));

  // spec: app-bars-e910da, app-bars-35b14b, motion-transitions-31df78
  it('hides an app bar on scroll down, beyond its edge, and reveals it on scroll up', async () => {
    const {root, scroller} = await render(html`
      <md-gb-app-bar
        scroll-behavior="hide"
        scroll-target="scroller"
        style="position: fixed; top: 0; left: 0; right: 0"
        >Title</md-gb-app-bar
      >
    `);
    const bar = root.querySelector('md-gb-app-bar')!;
    await bar.updateComplete;
    await scrollTo(scroller, 200);
    expect(isHidden(bar)).toBeTrue();
    bar.getAnimations().forEach((a) => a.finish());
    expect(bar.getBoundingClientRect().bottom).toBeLessThanOrEqual(0);

    await scrollTo(scroller, 150);
    expect(isHidden(bar)).toBeFalse();
    bar.getAnimations().forEach((a) => a.finish());
    expect(bar.getBoundingClientRect().top).toBe(0);
  });

  // spec: app-bars-e910da
  it('stays on the page at all times without a scroll behavior', async () => {
    const {root, scroller} = await render(html`
      <md-gb-app-bar scroll-target="scroller">Title</md-gb-app-bar>
    `);
    const bar = root.querySelector('md-gb-app-bar')!;
    await bar.updateComplete;
    await scrollTo(scroller, 300);
    expect(isHidden(bar)).toBeFalse();
  });

  // spec: motion-transitions-31df78
  it('moves with the spatial spring and jumps under reduced motion', async () => {
    const {root, scroller} = await render(html`
      <md-gb-app-bar scroll-behavior="hide" scroll-target="scroller"
        >Title</md-gb-app-bar
      >
    `);
    const bar = root.querySelector('md-gb-app-bar')!;
    await bar.updateComplete;
    await scrollTo(scroller, 200);
    expect(bar.style.transitionDuration).toContain(
      '--md-sys-motion-spring-default-spatial-duration',
    );
    expect(bar.style.transitionTimingFunction).toContain(
      '--md-sys-motion-spring-default-spatial',
    );
    expect(getComputedStyle(bar).transitionDuration).not.toBe('0s');

    await scrollTo(scroller, 0);
    await emulateMedia({reducedMotion: 'reduce'});
    await scrollTo(scroller, 200);
    expect(isHidden(bar)).toBeTrue();
    expect(getComputedStyle(bar).transitionDuration).toBe('0s');
  });

  // spec: app-bars-66c0e7, app-bars-971ae8, app-bars-302c28, app-bars-5d7418
  it('compresses a large flexible app bar and keeps it small until back at the top', async () => {
    const {root, scroller} = await render(html`
      <md-gb-app-bar
        size="lg"
        scroll-behavior="compress"
        scroll-target="scroller"
        >Title</md-gb-app-bar
      >
    `);
    const bar = root.querySelector('md-gb-app-bar') as AppBarElement;
    const height = async () => {
      await bar.updateComplete;
      bar.shadowRoot!.getAnimations().forEach((a) => a.finish());
      return bar.shadowRoot!.querySelector('.app-bar')!.getBoundingClientRect()
        .height;
    };
    const large = await height();
    await scrollTo(scroller, 120);
    expect(bar.scrolled).toBeTrue();
    const small = await height();
    expect(small).toBeLessThan(large);
    expect(isHidden(bar)).toBeFalse();

    // Scrolling up, not yet at the top: stays small.
    await scrollTo(scroller, 10);
    expect(await height()).toBe(small);

    await scrollTo(scroller, 0);
    expect(bar.scrolled).toBeFalse();
    expect(await height()).toBe(large);
  });

  // spec: tabs-0fbb30, tabs-1caa6d
  it('scrolls tabs off the screen and returns them when scrolling up', async () => {
    const {root, scroller} = await render(html`
      <md-gb-tabs
        scroll-behavior="hide"
        scroll-target="scroller"
        style="position: fixed; top: 0; left: 0; right: 0"
        ><md-gb-tab>One</md-gb-tab><md-gb-tab>Two</md-gb-tab></md-gb-tabs
      >
    `);
    const tabs = root.querySelector('md-gb-tabs')!;
    await scrollTo(scroller, 200);
    expect(isHidden(tabs)).toBeTrue();
    tabs.getAnimations().forEach((a) => a.finish());
    expect(tabs.getBoundingClientRect().bottom).toBeLessThanOrEqual(0);
    await scrollTo(scroller, 100);
    expect(isHidden(tabs)).toBeFalse();
    tabs.getAnimations().forEach((a) => a.finish());
    expect(tabs.getBoundingClientRect().top).toBe(0);
  });

  // spec: tabs-449208
  it('moves tabs attached to an app bar with it as one unit', async () => {
    const {root, scroller} = await render(html`
      <md-gb-app-bar
        scroll-behavior="hide"
        scroll-target="scroller"
        style="position: fixed; top: 0; left: 0; right: 0"
        >Title<md-gb-tabs slot="tabs"
          ><md-gb-tab>One</md-gb-tab><md-gb-tab>Two</md-gb-tab></md-gb-tabs
        ></md-gb-app-bar
      >
    `);
    const bar = root.querySelector('md-gb-app-bar')!;
    const tabs = root.querySelector('md-gb-tabs')!;
    await bar.updateComplete;
    const offset = () =>
      tabs.getBoundingClientRect().top - bar.getBoundingClientRect().top;
    const before = offset();
    expect(before).toBeGreaterThan(0);
    // The tabs sit inside the app bar's box.
    expect(tabs.getBoundingClientRect().bottom).toBeCloseTo(
      bar.getBoundingClientRect().bottom,
      0,
    );

    await scrollTo(scroller, 200);
    expect(isHidden(tabs)).toBeFalse();
    bar.getAnimations().forEach((a) => a.finish());
    expect(tabs.getBoundingClientRect().bottom).toBeLessThanOrEqual(0);
    expect(offset()).toBe(before);

    await scrollTo(scroller, 100);
    bar.getAnimations().forEach((a) => a.finish());
    expect(bar.getBoundingClientRect().top).toBe(0);
    expect(offset()).toBe(before);
  });

  // spec: navigation-bar-cbd409, navigation-bar-f032de
  it('hides a navigation bar on scroll down and reveals it on scroll up', async () => {
    const {root, scroller} = await render(html`
      <md-gb-nav-bar
        scroll-behavior="hide"
        scroll-target="scroller"
        style="position: fixed; bottom: 0; left: 0; right: 0"
        ><md-gb-nav-bar-item label="A"></md-gb-nav-bar-item
        ><md-gb-nav-bar-item label="B"></md-gb-nav-bar-item
      ></md-gb-nav-bar>
    `);
    const nav = root.querySelector('md-gb-nav-bar')!;
    await scrollTo(scroller, 200);
    expect(isHidden(nav)).toBeTrue();
    nav.getAnimations().forEach((a) => a.finish());
    expect(nav.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      window.innerHeight,
    );
    await scrollTo(scroller, 100);
    expect(isHidden(nav)).toBeFalse();
  });

  // spec: navigation-bar-791f1a
  describe('navigation bar and assistive technology', () => {
    async function navBar() {
      const {root, scroller} = await render(html`
        <md-gb-nav-bar
          scroll-behavior="hide"
          scroll-target="scroller"
          style="position: fixed; bottom: 0; left: 0; right: 0"
          ><md-gb-nav-bar-item label="A"></md-gb-nav-bar-item
          ><md-gb-nav-bar-item label="B"></md-gb-nav-bar-item
        ></md-gb-nav-bar>
      `);
      return {nav: root.querySelector('md-gb-nav-bar')!, scroller, root};
    }

    it('stays visible while focus is inside it', async () => {
      const {nav, scroller} = await navBar();
      nav.querySelector<HTMLElement>('md-gb-nav-bar-item')!.focus();
      expect(nav.matches(':focus-within')).toBeTrue();
      await scrollTo(scroller, 300);
      expect(isHidden(nav)).toBeFalse();
    });

    it('stays visible when the page scrolls because of a key press', async () => {
      const {nav, scroller} = await navBar();
      scroller.focus();
      await sendKeys({press: 'PageDown'});
      // PageDown scrolls smoothly: wait until it has gone past the threshold.
      expect(await until(() => scroller.scrollTop > SCROLL_THRESHOLD, {timeout: 3000})).toBeTrue();
      await frame();
      await frame();
      expect(isHidden(nav)).toBeFalse();
    });

    it('reveals a hidden bar when focus moves into it', async () => {
      const {nav, scroller} = await navBar();
      await scrollTo(scroller, 300);
      expect(isHidden(nav)).toBeTrue();
      nav.querySelector<HTMLElement>('md-gb-nav-bar-item')!.focus();
      expect(isHidden(nav)).toBeFalse();
    });
  });

  // spec: toolbars-7880d6, toolbars-bf8eac, toolbars-0b3427
  for (const docked of [true, false]) {
    it(`animates a ${docked ? 'docked' : 'floating'} toolbar offscreen and back`, async () => {
      const {root, scroller} = await render(html`
        <md-gb-toolbar
          ?docked=${docked}
          scroll-behavior="hide"
          scroll-target="scroller"
          style="position: fixed; bottom: 16px; left: 16px"
          ><md-gb-icon-button aria-label="One"></md-gb-icon-button
        ></md-gb-toolbar>
      `);
      const toolbar = root.querySelector('md-gb-toolbar')!;
      await toolbar.updateComplete;
      await scrollTo(scroller, 200);
      expect(isHidden(toolbar)).toBeTrue();
      toolbar.getAnimations().forEach((a) => a.finish());
      expect(toolbar.getBoundingClientRect().top).toBeGreaterThanOrEqual(
        window.innerHeight,
      );
      await scrollTo(scroller, 100);
      expect(isHidden(toolbar)).toBeFalse();
      toolbar.getAnimations().forEach((a) => a.finish());
      expect(toolbar.getBoundingClientRect().bottom).toBeLessThanOrEqual(
        window.innerHeight,
      );
    });
  }
});
