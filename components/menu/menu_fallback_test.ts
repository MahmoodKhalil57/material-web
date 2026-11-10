/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

// The menu without CSS anchor positioning and without `@container style()`:
// both are forced here, in a browser that has them, to drive the fallbacks
// that older browsers get (menu.scss, shared/anchored-overlay.ts).

import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {forceAnchorPositioningSupport} from '../shared/anchored-overlay.js';

import './md-gb-menu.js';
import './md-gb-menu-group.js';
import './md-gb-menu-item.js';
import {type MenuElement} from './menu-element.js';
import {type MenuItemElement} from './menu-item-element.js';
import menuStyles from './menu.cssresult.js';

adoptStyles(document, [m3Styles, menuStyles]);

function toggled(element: HTMLElement) {
  return new Promise<void>((resolve) => {
    element.addEventListener('toggle', () => resolve(), {once: true});
  });
}

describe('<md-gb-menu> without CSS anchor positioning', () => {
  const env = new Environment();

  beforeEach(() => forceAnchorPositioningSupport(false));
  afterEach(() => forceAnchorPositioningSupport(null));

  async function setup(invokerStyle: string) {
    const root = env.render(html`
      <button
        id="invoker"
        popovertarget="menu"
        style="position: fixed; left: 100px; ${invokerStyle}; width: 80px; height: 30px;">
        Edit
      </button>
      <md-gb-menu id="menu">
        <md-gb-menu-item>Cut</md-gb-menu-item>
        <md-gb-menu-item>Copy</md-gb-menu-item>
        <md-gb-menu-item>Paste</md-gb-menu-item>
      </md-gb-menu>
    `);
    await env.waitForStability();
    const menu = root.querySelector('#menu') as MenuElement;
    const invoker = root.querySelector('#invoker') as HTMLElement;
    const opened = toggled(menu);
    invoker.click();
    await opened;
    await env.waitForStability();
    return {menu, invoker};
  }

  // spec: menus-eb894b
  it('opens below the invoker, start edges aligned', async () => {
    const {menu, invoker} = await setup('top: 100px');
    const a = invoker.getBoundingClientRect();
    const m = menu.getBoundingClientRect();
    expect(menu.style.position).toBe('fixed');
    expect(Math.round(m.top)).toBe(Math.round(a.bottom));
    expect(Math.round(m.left)).toBe(Math.round(a.left));
  });

  // spec: menus-74a090
  it('opens above the invoker when there is no room below', async () => {
    const {menu, invoker} = await setup(
      `top: ${window.innerHeight - 40}px`,
    );
    const a = invoker.getBoundingClientRect();
    const m = menu.getBoundingClientRect();
    expect(Math.round(m.bottom)).toBeLessThanOrEqual(Math.round(a.top));
    expect(m.top).toBeGreaterThanOrEqual(0);
  });

  async function openSubmenu() {
    const root = env.render(html`
      <md-gb-menu id="menu" style="position: fixed; left: 100px; top: 100px">
        <md-gb-menu-item>Cut</md-gb-menu-item>
        <md-gb-menu-item>
          Share
          <md-gb-menu slot="submenu" id="submenu">
            <md-gb-menu-item>Email</md-gb-menu-item>
            <md-gb-menu-item>Message</md-gb-menu-item>
          </md-gb-menu>
        </md-gb-menu-item>
      </md-gb-menu>
    `);
    await env.waitForStability();
    const menu = root.querySelector('#menu') as MenuElement;
    const submenu = root.querySelector('#submenu') as MenuElement;
    const parentItem = menu.items[1] as MenuItemElement;
    const opened = toggled(menu);
    menu.showPopover();
    await opened;
    const subOpened = toggled(submenu);
    parentItem.click();
    await subOpened;
    await env.waitForStability();
    return {submenu, parentItem};
  }

  it('lines the first item of a submenu up with its parent item', async () => {
    const {submenu, parentItem} = await openSubmenu();
    // The JS position, not CSS anchoring, placed it.
    expect(submenu.style.position).toBe('fixed');
    expect(submenu.style.marginBlockStart).not.toBe('');
    const first = submenu.items[0].getBoundingClientRect();
    expect(Math.round(first.top)).toBe(
      Math.round(parentItem.getBoundingClientRect().top),
    );
  });

  it('lines the first item up the same in CSS positioning', async () => {
    forceAnchorPositioningSupport(null);
    const {submenu, parentItem} = await openSubmenu();
    expect(submenu.style.position).toBe('');
    const first = submenu.items[0].getBoundingClientRect();
    expect(Math.round(first.top)).toBe(
      Math.round(parentItem.getBoundingClientRect().top),
    );
  });

  it('is placed by CSS, not by the controller, when the browser has it', async () => {
    forceAnchorPositioningSupport(null);
    const {menu} = await setup('top: 100px');
    expect(menu.style.left).toBe('');
    expect(menu.style.top).toBe('');
  });
});

/**
 * The compiled styles with every `@container style()` rule removed, as a
 * browser without style queries sees them.
 */
function withoutStyleQueries(sheet: CSSStyleSheet): CSSStyleSheet {
  const out = new CSSStyleSheet();
  const keep = (rules: CSSRuleList): string =>
    Array.from(rules)
      .map((rule) => {
        if (
          rule instanceof CSSContainerRule &&
          /style\(/.test(rule.conditionText)
        ) {
          return '';
        }
        if (rule instanceof CSSLayerBlockRule) {
          return `@layer ${rule.name} {${keep(rule.cssRules)}}`;
        }
        return rule.cssText;
      })
      .join('\n');
  out.replaceSync(keep(sheet.cssRules));
  return out;
}

describe('<md-gb-menu> without style queries', () => {
  const env = new Environment();

  async function color(
    attributes: string,
    sheets: CSSStyleSheet[],
  ): Promise<string> {
    document.adoptedStyleSheets = [...saved.filter((s) => s !== menuStyles), ...sheets];
    const root = env.render(html`
      <div class="menu ${attributes}">
        <div class="menu-item">Cut</div>
      </div>
    `);
    await env.waitForStability();
    return getComputedStyle(root.querySelector('.menu-item')!)
      .getPropertyValue('--label-text-color')
      .trim();
  }

  let saved: CSSStyleSheet[];
  beforeEach(() => (saved = [...document.adoptedStyleSheets]));
  afterEach(() => (document.adoptedStyleSheets = saved));

  it('colors vibrant items as with style queries, from the menu class', async () => {
    const full = await color('menu-vibrant', [menuStyles]);
    const fallback = await color('menu-vibrant', [
      withoutStyleQueries(menuStyles),
    ]);
    const standard = await color('', [withoutStyleQueries(menuStyles)]);
    expect(full.length).toBeGreaterThan(0);
    expect(fallback).toBe(full);
    // The fallback is not just the standard color.
    expect(fallback).not.toBe(standard);
  });

  it('puts the vibrant class on md-gb-menu-item roots', async () => {
    const root = env.render(html`
      <md-gb-menu color="vibrant" id="m">
        <md-gb-menu-item>Cut</md-gb-menu-item>
      </md-gb-menu>
    `);
    await env.waitForStability();
    const menu = root.querySelector('#m') as MenuElement;
    const item = root.querySelector('md-gb-menu-item') as MenuItemElement;
    const rootOf = () => item.shadowRoot!.querySelector('.menu-item')!;
    expect(rootOf().classList.contains('menu-vibrant')).toBeTrue();
    menu.color = 'standard';
    await menu.updateComplete;
    await item.updateComplete;
    expect(rootOf().classList.contains('menu-vibrant')).toBeFalse();
  });

  it('draws grouped surfaces from the menu-grouped class', async () => {
    const surface = async (sheets: CSSStyleSheet[]) => {
      document.adoptedStyleSheets = [...saved.filter((s) => s !== menuStyles), ...sheets];
      const root = env.render(html`
        <div class="menu menu-grouped">
          <div class="menu-group"><div class="menu-item">Cut</div></div>
        </div>
      `);
      await env.waitForStability();
      return getComputedStyle(root.querySelector('.menu-group')!).display;
    };
    expect(await surface([menuStyles])).toBe('flex');
    expect(await surface([withoutStyleQueries(menuStyles)])).toBe('flex');
  });
});
