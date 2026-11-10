/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import './md-gb-app-bar.js';

import {html, type TemplateResult} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {AppBarElement} from './app-bar-element.js';

adoptStyles(document, [m3Styles]);

// `Environment` replaces `requestAnimationFrame` with a fake-clock timeout;
// scroll-state queries only update in real frames.
const realRaf = window.requestAnimationFrame.bind(window);
async function untilFrame(check: () => boolean) {
  for (let i = 0; i < 30 && !check(); i++) {
    await new Promise((resolve) => realRaf(resolve));
  }
  return check();
}

function inner(appBar: AppBarElement) {
  return appBar.shadowRoot!.querySelector<HTMLElement>('.app-bar')!;
}

describe('md-gb-app-bar', () => {
  const env = new Environment();

  async function render(template: TemplateResult) {
    const root = env.render(template);
    await env.waitForStability();
    const appBar = root.querySelector('md-gb-app-bar') as AppBarElement;
    await appBar.updateComplete;
    // Slot changes update state; wait for the follow-up render.
    await appBar.updateComplete;
    return appBar;
  }

  it('renders the small app bar by default', async () => {
    const appBar = await render(html`<md-gb-app-bar>Title</md-gb-app-bar>`);
    const bar = inner(appBar);
    expect(bar.classList.contains('app-bar-sm')).toBeTrue();
    expect(getComputedStyle(bar).minHeight).toBe('64px');
  });

  // spec: app-bars-a54714
  it('shows a subtitle in the small app bar', async () => {
    const appBar = await render(
      html`<md-gb-app-bar
        >Title<span slot="subtitle">Subtitle</span></md-gb-app-bar
      >`,
    );
    const bar = inner(appBar);
    expect(bar.classList.contains('app-bar-with-subtitle')).toBeTrue();
    const subtitle = bar.querySelector<HTMLElement>('.app-bar-subtitle')!;
    expect(getComputedStyle(subtitle).display).not.toBe('none');
    // Small app bars keep their height with a subtitle.
    expect(getComputedStyle(bar).minHeight).toBe('64px');
  });

  it('hides the subtitle row without a subtitle', async () => {
    const appBar = await render(html`<md-gb-app-bar size="md">T</md-gb-app-bar>`);
    const subtitle = inner(appBar).querySelector<HTMLElement>('.app-bar-subtitle')!;
    expect(getComputedStyle(subtitle).display).toBe('none');
  });

  // spec: app-bars-e2923e, app-bars-6b056f, app-bars-1aa0c4
  it('uses the taller flexible heights with a subtitle', async () => {
    const md = await render(
      html`<md-gb-app-bar size="md"
        >T<span slot="subtitle">S</span></md-gb-app-bar
      >`,
    );
    expect(getComputedStyle(inner(md)).minHeight).toBe('136px');
    const lg = await render(
      html`<md-gb-app-bar size="lg"
        >T<span slot="subtitle">S</span></md-gb-app-bar
      >`,
    );
    expect(getComputedStyle(inner(lg)).minHeight).toBe('152px');
  });

  // spec: app-bars-03803d, app-bars-91aba2
  it('lets flexible headlines wrap to two lines', async () => {
    const appBar = await render(html`<md-gb-app-bar size="lg">T</md-gb-app-bar>`);
    const title = inner(appBar).querySelector<HTMLElement>('.app-bar-title')!;
    const style = getComputedStyle(title);
    expect(style.whiteSpace).toBe('normal');
    expect(style.webkitLineClamp).toBe('2');
  });

  it('insets the small title when there is no leading icon', async () => {
    const appBar = await render(html`<md-gb-app-bar>Title</md-gb-app-bar>`);
    const bar = inner(appBar);
    expect(bar.classList.contains('app-bar-has-leading')).toBeFalse();
    const wrapper = bar.querySelector<HTMLElement>('.app-bar-title-wrapper')!;
    // 4px leading space + 12px title inset = 16px (Compose).
    expect(wrapper.getBoundingClientRect().left - bar.getBoundingClientRect().left).toBe(16);
  });

  it('tracks a leading element', async () => {
    const appBar = await render(
      html`<md-gb-app-bar
        ><button slot="leading" style="width: 48px">B</button>T</md-gb-app-bar
      >`,
    );
    expect(inner(appBar).classList.contains('app-bar-has-leading')).toBeTrue();
  });

  describe('centered', () => {
    it('reflects and adds the centered class', async () => {
      const appBar = await render(html`<md-gb-app-bar centered>T</md-gb-app-bar>`);
      expect(appBar.hasAttribute('centered')).toBeTrue();
      expect(inner(appBar).classList.contains('app-bar-centered')).toBeTrue();
    });

    // spec: app-bars-1132de, app-bars-4a6536, app-bars-3296eb
    it('centers the small title on the whole bar', async () => {
      const appBar = await render(
        html`<div style="width: 600px">
          <md-gb-app-bar centered>
            <button slot="leading" style="width: 48px">B</button>
            <span id="t">Title</span>
            <button slot="trailing" style="width: 96px">A</button>
          </md-gb-app-bar>
        </div>`,
      );
      const bar = inner(appBar).getBoundingClientRect();
      const title = inner(appBar)
        .querySelector<HTMLElement>('.app-bar-title-wrapper')!
        .getBoundingClientRect();
      const barCenter = bar.left + bar.width / 2;
      const titleCenter = title.left + title.width / 2;
      expect(Math.abs(barCenter - titleCenter)).toBeLessThan(1);
    });

    it('centers flexible titles', async () => {
      const appBar = await render(
        html`<md-gb-app-bar size="md" centered>T</md-gb-app-bar>`,
      );
      const wrapper = inner(appBar).querySelector<HTMLElement>(
        '.app-bar-title-wrapper',
      )!;
      expect(getComputedStyle(wrapper).alignItems).toBe('center');
    });
  });

  describe('search', () => {
    it('renders a search bar inside a small app bar', async () => {
      const appBar = await render(
        html`<md-gb-app-bar variant="search"
          ><input slot="search"
        /></md-gb-app-bar>`,
      );
      const bar = inner(appBar);
      expect(getComputedStyle(bar).minHeight).toBe('64px');
      const search = bar.querySelector<HTMLElement>('.app-bar-search-bar')!;
      const style = getComputedStyle(search);
      expect(style.minHeight).toBe('56px');
      expect(style.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
      expect(style.borderTopLeftRadius).not.toBe('0px');
    });

    // spec: app-bars-99d94f
    it('changes the search bar color on scroll', async () => {
      const appBar = await render(
        html`<md-gb-app-bar variant="search"
          ><input slot="search"
        /></md-gb-app-bar>`,
      );
      const search = inner(appBar).querySelector<HTMLElement>('.app-bar-search-bar')!;
      search.style.transition = 'none';
      const flat = getComputedStyle(search).backgroundColor;
      appBar.scrolled = true;
      await appBar.updateComplete;
      expect(getComputedStyle(search).backgroundColor).not.toBe(flat);
    });
  });

  describe('scrolled color via a scroll-state container query', () => {
    const supported = CSS.supports('container-type', 'scroll-state');

    async function renderInScroller() {
      const root = env.render(html`<div
        style="height: 200px; overflow: auto; position: relative"
        ><md-gb-app-bar style="position: sticky; top: 0">Title</md-gb-app-bar>
        <div style="height: 1000px"></div
      ></div>`);
      await env.waitForStability();
      const scroller = root.querySelector('div')!;
      const appBar = root.querySelector('md-gb-app-bar') as AppBarElement;
      await appBar.updateComplete;
      inner(appBar).style.transition = 'none';
      return {scroller, appBar};
    }

    // spec: app-bars-99d94f
    it('colors a stuck app bar without the scrolled attribute', async () => {
      if (!supported) {
        pending('scroll-state container queries are not supported');
      }
      const {scroller, appBar} = await renderInScroller();
      const flat = getComputedStyle(inner(appBar)).backgroundColor;
      const flatShadow = getComputedStyle(inner(appBar)).boxShadow;
      scroller.scrollTop = 100;
      expect(await untilFrame(() => getComputedStyle(inner(appBar)).backgroundColor !== flat)).withContext('stuck color').toBeTrue();
      expect(appBar.scrolled).toBeFalse();
      expect(getComputedStyle(inner(appBar)).boxShadow)
        .withContext('no drop shadow')
        .toBe(flatShadow);
      scroller.scrollTop = 0;
      expect(await untilFrame(() => getComputedStyle(inner(appBar)).backgroundColor === flat)).withContext('back to flat').toBeTrue();
    });

    it('falls back to the scrolled attribute', async () => {
      const {appBar} = await renderInScroller();
      const flat = getComputedStyle(inner(appBar)).backgroundColor;
      appBar.scrolled = true;
      await appBar.updateComplete;
      expect(getComputedStyle(inner(appBar)).backgroundColor).not.toBe(flat);
    });
  });

  it('fires scrollstatechange from a scroll target', async () => {
    const root = env.render(html`<div></div>`);
    const div = root.querySelector('div')!;
    div.className = 'app-bar';
    const scroller = document.createElement('div');
    const {setupAppBar} = await import('./app-bar.js');
    const spy = jasmine.createSpy('scrollstatechange');
    div.addEventListener('scrollstatechange', spy);
    Object.defineProperty(scroller, 'scrollTop', {value: 10});
    setupAppBar(div, {scrollTarget: scroller});
    expect(spy).toHaveBeenCalledTimes(1);
    expect(div.classList.contains('app-bar-scrolled')).toBeTrue();
  });
});
