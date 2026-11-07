/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Tests for spec units that were tracked as gaps and are now built.

// import 'jasmine'; (google3-only)

import '../iconbutton/md-gb-icon-button.js';
import './md-gb-app-bar.js';

import {sendKeys} from '@web/test-runner-commands';
import {html, type TemplateResult} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {AppBarElement} from './app-bar-element.js';

adoptStyles(document, [m3Styles]);

function inner(appBar: AppBarElement) {
  return appBar.shadowRoot!.querySelector<HTMLElement>('.app-bar')!;
}

describe('md-gb-app-bar tracked spec units', () => {
  const env = new Environment();

  async function render(template: TemplateResult) {
    const root = env.render(template);
    await env.waitForStability();
    const appBar = root.querySelector('md-gb-app-bar') as AppBarElement;
    await appBar.updateComplete;
    await appBar.updateComplete;
    return appBar;
  }

  function finishAnimations(appBar: AppBarElement) {
    appBar.shadowRoot!.getAnimations().forEach((a) => a.finish());
    appBar.getAnimations({subtree: true}).forEach((a) => a.finish());
  }

  // spec: app-bars-4e5480
  it('separates a scrolled app bar with a color fill, not a drop shadow', async () => {
    const appBar = await render(html`<md-gb-app-bar>Title</md-gb-app-bar>`);
    finishAnimations(appBar);
    const flat = getComputedStyle(inner(appBar));
    const flatFill = flat.backgroundColor;
    expect(flat.boxShadow).toBe('none');
    appBar.scrolled = true;
    await appBar.updateComplete;
    finishAnimations(appBar);
    const scrolled = getComputedStyle(inner(appBar));
    expect(scrolled.boxShadow).toBe('none');
    expect(scrolled.backgroundColor).not.toBe(flatFill);
  });

  describe('search app bar', () => {
    // spec: app-bars-0a0296, app-bars-f61e4d, app-bars-41853e, app-bars-4c71e7
    it('takes a leading element and trailing elements inside and outside the search bar', async () => {
      const appBar = await render(
        html`<div style="width: 800px"
          ><md-gb-app-bar variant="search">
            <button slot="leading" style="width: 40px">Menu</button>
            <input slot="search" style="width: 120px" />
            <button slot="search" style="width: 40px">In</button>
            <button slot="trailing" style="width: 48px">One</button>
            <button slot="trailing" style="width: 48px">Two</button>
          </md-gb-app-bar></div
        >`,
      );
      const bar = inner(appBar)
        .querySelector('.app-bar-search-bar')!
        .getBoundingClientRect();
      const leading = appBar.querySelector('[slot=leading]')!.getBoundingClientRect();
      const inside = appBar.querySelector('[slot=search]:not(input)')!.getBoundingClientRect();
      const outside = Array.from(
        appBar.querySelectorAll('[slot=trailing]'),
      ).map((el) => el.getBoundingClientRect());
      expect(leading.right).toBeLessThanOrEqual(bar.left);
      expect(inside.left).toBeGreaterThanOrEqual(bar.left);
      expect(inside.right).toBeLessThanOrEqual(bar.right);
      expect(outside.length).toBe(2);
      for (const rect of outside) expect(rect.left).toBeGreaterThanOrEqual(bar.right);
    });

    // spec: app-bars-57f1db
    it('shows at most two trailing icons next to the search bar in a compact window', async () => {
      const appBar = await render(
        html`<div style="width: 400px"
          ><md-gb-app-bar variant="search">
            <input slot="search" />
            <button slot="trailing" style="width: 48px">1</button>
            <button slot="trailing" style="width: 48px">2</button>
            <button slot="trailing" style="width: 48px">3</button>
          </md-gb-app-bar></div
        >`,
      );
      const actions = Array.from(
        appBar.querySelectorAll<HTMLElement>('[slot=trailing]'),
      );
      expect(actions.map((a) => a.hidden)).toEqual([false, false, true]);
    });
  });

  describe('search width', () => {
    async function searchBarWidths(width: number) {
      const appBar = await render(
        html`<div style=${'width: ' + width + 'px'}
          ><md-gb-app-bar variant="search">
            <input slot="search" />
          </md-gb-app-bar></div
        >`,
      );
      const bar = inner(appBar).querySelector('.app-bar-search-bar')!;
      const container = inner(appBar).querySelector('.app-bar-search-container')!;
      const style = getComputedStyle(container);
      const space =
        container.getBoundingClientRect().width -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight);
      return {bar: bar.getBoundingClientRect().width, space};
    }

    // spec: app-bars-faff53
    it('fills all the space between the other elements until it reaches 312dp', async () => {
      const {bar, space} = await searchBarWidths(300);
      expect(space).toBeLessThanOrEqual(312);
      expect(bar).toBeCloseTo(space, 0);
    });

    // spec: app-bars-d71c5e
    it('then only grows to fill 50% of the space', async () => {
      const {bar, space} = await searchBarWidths(1000);
      expect(space).toBeGreaterThan(624);
      expect(bar).toBeCloseTo(space / 2, 0);
    });
  });

  describe('images', () => {
    function pixel() {
      return html`<img
        slot="image"
        alt="Logo"
        width="32"
        height="32"
        src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />`;
    }

    // spec: app-bars-e7448f, app-bars-293fea, app-bars-08f01d, app-bars-7d19aa
    it('places an image in a small app bar in place of the title text', async () => {
      const appBar = await render(
        html`<md-gb-app-bar size="sm">${pixel()}</md-gb-app-bar>`,
      );
      const image = appBar.querySelector('img')!.getBoundingClientRect();
      const bar = inner(appBar).getBoundingClientRect();
      expect(image.width).toBeGreaterThan(0);
      expect(image.top).toBeGreaterThanOrEqual(bar.top);
      expect(image.bottom).toBeLessThanOrEqual(bar.bottom);
    });

    // spec: app-bars-7d19aa, app-bars-08f01d
    it('places an image above the text in medium and large app bars', async () => {
      for (const size of ['md', 'lg']) {
        const appBar = await render(
          html`<md-gb-app-bar size=${size}>${pixel()}Title</md-gb-app-bar>`,
        );
        const image = appBar.querySelector('img')!.getBoundingClientRect();
        const title = inner(appBar)
          .querySelector('.app-bar-title')!
          .getBoundingClientRect();
        expect(image.bottom).withContext(size).toBeLessThanOrEqual(title.top + 0.5);
      }
    });
  });

  // spec: app-bars-80a6a9, app-bars-3ff664
  it('replaces the trailing icon buttons with a single filled icon button', async () => {
    const appBar = await render(
      html`<md-gb-app-bar>
        Title
        <md-gb-icon-button slot="trailing" color="filled" aria-label="Add"
          >add</md-gb-icon-button
        >
      </md-gb-app-bar>`,
    );
    const button = appBar.querySelector<HTMLElement>('[slot=trailing]')!;
    expect(button.hidden).toBeFalse();
    expect(button.getBoundingClientRect().width).toBeGreaterThanOrEqual(40);
    expect(button.getAttribute('color')).toBe('filled');
    expect(appBar.overflowedActions.length).toBe(0);
  });

  describe('keyboard', () => {
    async function setup() {
      const appBar = await render(
        html`<button id="before">Before</button>
          <md-gb-app-bar>
            Title
            <button slot="leading" id="menu">Menu</button>
            <button slot="trailing" id="search">Search</button>
            <button slot="trailing" id="more">More</button>
          </md-gb-app-bar>`,
      );
      return appBar;
    }

    // spec: app-bars-306ab9, app-bars-9d999b, app-bars-2db7a9
    it('moves focus from the leading button to the next interactive element with Tab', async () => {
      await setup();
      const before = document.querySelector<HTMLElement>('#before')!;
      before.focus();
      await sendKeys({press: 'Tab'});
      expect(document.activeElement!.id).toBe('menu');
      await sendKeys({press: 'Tab'});
      expect(document.activeElement!.id).toBe('search');
      await sendKeys({press: 'Tab'});
      expect(document.activeElement!.id).toBe('more');
    });

    // spec: app-bars-364a30, app-bars-05f3ec
    it('activates the focused element with Space or Enter', async () => {
      await setup();
      const menu = document.querySelector<HTMLElement>('#menu')!;
      let activations = 0;
      menu.addEventListener('click', () => activations++);
      menu.focus();
      await sendKeys({press: 'Enter'});
      await sendKeys({press: 'Space'});
      expect(activations).toBe(2);
    });
  });

  describe('accessibility labels', () => {
    // spec: app-bars-4515ab, app-bars-7ca941
    it('exposes the title text as its accessible text, and keeps action roles', async () => {
      const appBar = await render(
        html`<md-gb-app-bar>
          Inbox
          <button slot="trailing">Search</button>
        </md-gb-app-bar>`,
      );
      const title = inner(appBar).querySelector('.app-bar-title')!;
      expect(title.getAttribute('aria-hidden')).toBeNull();
      const slot = title.querySelector('slot')!;
      const text = slot
        .assignedNodes({flatten: true})
        .map((n) => n.textContent)
        .join('')
        .trim();
      expect(text).toBe('Inbox');
      const action = appBar.querySelector('[slot=trailing]')!;
      expect(action.tagName).toBe('BUTTON');
    });

    // spec: app-bars-d4540b
    it('lets the app bar label add context to its UI text', async () => {
      const appBar = await render(
        html`<md-gb-app-bar aria-label="Inbox, 3 unread">Inbox</md-gb-app-bar>`,
      );
      expect(appBar.getAttribute('aria-label')).toBe('Inbox, 3 unread');
    });
  });
});
