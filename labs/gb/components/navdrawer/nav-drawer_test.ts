/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {adoptStyles} from '../../styles/adopt-styles.js';

import './md-gb-nav-drawer.js';
import './md-gb-nav-drawer-item.js';
import {
  getNextNavDrawerItem,
  NAV_DRAWER_CLASSES,
  NAV_DRAWER_CLOSE_REASONS,
  NAV_DRAWER_ITEM_CLASSES,
  navDrawerClasses,
  navDrawerItemClasses,
  setupNavDrawer,
} from './nav-drawer.js';
import navDrawerStyles from './nav-drawer.cssresult.js';
import {type NavDrawerElement} from './nav-drawer-element.js';
import {type NavDrawerItemElement} from './nav-drawer-item-element.js';

adoptStyles(document, [m3Styles, navDrawerStyles]);

function innerControl(item: NavDrawerItemElement): HTMLElement {
  const el = item.shadowRoot!.querySelector<HTMLElement>('.nav-drawer-item');
  if (!el) {
    throw new Error('Missing .nav-drawer-item');
  }
  return el;
}

function deepActiveElement(): Element | null {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement;
  }
  return active;
}

function describeElement(el: Element | null): string {
  if (!el) return 'null';
  const host = (el.getRootNode() as ShadowRoot).host;
  const text = (host ?? el).textContent?.trim().replace(/\s+/g, ' ');
  return `${el.tagName.toLowerCase()}${host ? ` in <${host.tagName.toLowerCase()}>` : ''} "${text}"`;
}

/** Compares focus by description, avoiding pretty-printing DOM nodes. */
function expectFocused(el: Element, context = '') {
  expect(describeElement(deepActiveElement()))
    .withContext(context)
    .toBe(describeElement(el));
}

/** Waits for a real task (the jasmine mock clock replaces timers). */
function nextTask() {
  return new Promise<void>((resolve) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = () => {
      resolve();
    };
    channel.port2.postMessage(null);
  });
}

function press(target: Element, key: string) {
  target.dispatchEvent(
    new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      composed: true,
      cancelable: true,
    }),
  );
}

describe('nav-drawer classes', () => {
  it('returns sheet classes', () => {
    expect(navDrawerClasses()).toEqual({
      [NAV_DRAWER_CLASSES.navDrawer]: true,
      [NAV_DRAWER_CLASSES.navDrawerModal]: false,
      [NAV_DRAWER_CLASSES.navDrawerOpen]: false,
    });
    expect(navDrawerClasses({modal: true, open: true})).toEqual({
      [NAV_DRAWER_CLASSES.navDrawer]: true,
      [NAV_DRAWER_CLASSES.navDrawerModal]: true,
      [NAV_DRAWER_CLASSES.navDrawerOpen]: true,
    });
  });

  it('returns item classes with ripple and focus ring', () => {
    const classes = navDrawerItemClasses({active: true});
    expect(classes[NAV_DRAWER_ITEM_CLASSES.navDrawerItem]).toBeTrue();
    expect(classes[NAV_DRAWER_ITEM_CLASSES.navDrawerItemActive]).toBeTrue();
    expect(classes['ripple']).toBeTrue();
    expect(classes['focus-ring-inner']).toBeTrue();
  });

  it('getNextNavDrawerItem wraps arrow keys and supports Home/End', () => {
    const items = ['a', 'b', 'c'];
    expect(getNextNavDrawerItem(items, 'a', 'ArrowDown')).toBe('b');
    expect(getNextNavDrawerItem(items, 'c', 'ArrowDown')).toBe('a');
    expect(getNextNavDrawerItem(items, 'a', 'ArrowUp')).toBe('c');
    expect(getNextNavDrawerItem(items, 'b', 'Home')).toBe('a');
    expect(getNextNavDrawerItem(items, 'a', 'End')).toBe('c');
    expect(getNextNavDrawerItem(items, 'a', 'Enter')).toBeNull();
    expect(getNextNavDrawerItem([], null, 'ArrowDown')).toBeNull();
  });
});

describe('setupNavDrawer() (Light DOM)', () => {
  const env = new Environment();

  it('provides roving focus between .nav-drawer-item elements', async () => {
    const root = env.render(html`
      <nav class="nav-drawer nav-drawer-open">
        <a class="nav-drawer-item" href="#a">A</a>
        <a class="nav-drawer-item nav-drawer-item-active" href="#b">B</a>
        <a class="nav-drawer-item" href="#c">C</a>
      </nav>
    `);
    const drawer = root.querySelector<HTMLElement>('.nav-drawer')!;
    setupNavDrawer(drawer);
    const [a, b, c] = Array.from(
      drawer.querySelectorAll<HTMLElement>('.nav-drawer-item'),
    );
    expect(a.tabIndex).toBe(-1);
    expect(b.tabIndex).toBe(0);

    b.focus();
    press(b, 'ArrowDown');
    expectFocused(c);
    expect(c.tabIndex).toBe(0);
    expect(b.tabIndex).toBe(-1);

    press(c, 'Home');
    expectFocused(a);
  });
});

describe('<md-gb-nav-drawer>', () => {
  const env = new Environment();

  async function setupTest(
    template = html`
      <md-gb-nav-drawer aria-label="Mail" quick>
        <h2 slot="headline">Mail</h2>
        <md-gb-nav-drawer-item href="#inbox" selected badge="24">
          <span slot="icon">inbox</span>
          Inbox
        </md-gb-nav-drawer-item>
        <md-gb-nav-drawer-item>Outbox</md-gb-nav-drawer-item>
        <hr />
        <h3>Labels</h3>
        <md-gb-nav-drawer-item disabled>Disabled</md-gb-nav-drawer-item>
        <md-gb-nav-drawer-item>Work</md-gb-nav-drawer-item>
      </md-gb-nav-drawer>
      <button id="outside">Outside</button>
    `,
  ) {
    const root = env.render(template);
    await env.waitForStability();
    const drawer = root.querySelector<NavDrawerElement>('md-gb-nav-drawer')!;
    const items = Array.from(
      root.querySelectorAll<NavDrawerItemElement>('md-gb-nav-drawer-item'),
    );
    const outside = root.querySelector<HTMLButtonElement>('#outside')!;
    return {root, drawer, items, outside};
  }

  function sheet(drawer: NavDrawerElement) {
    return drawer.shadowRoot!.querySelector<HTMLElement>('.nav-drawer')!;
  }

  describe('rendering', () => {
    it('initializes closed and standard', async () => {
      const {drawer} = await setupTest();
      expect(drawer.open).toBeFalse();
      expect(drawer.modal).toBeFalse();
      expect(sheet(drawer).classList).not.toContain('nav-drawer-open');
      expect(getComputedStyle(sheet(drawer)).visibility).toBe('hidden');
    });

    it('renders a labelled navigation landmark', async () => {
      const {drawer} = await setupTest();
      const nav = drawer.shadowRoot!.querySelector('nav')!;
      expect(nav).not.toBeNull();
      expect(nav.getAttribute('aria-label')).toBe('Mail');
      expect(drawer.hasAttribute('aria-label'))
        .withContext('aria-label moves off the host')
        .toBeFalse();
    });

    it('defaults the landmark label to "Navigation menu"', async () => {
      const {drawer} = await setupTest(
        html`<md-gb-nav-drawer></md-gb-nav-drawer>`,
      );
      const nav = drawer.shadowRoot!.querySelector('nav')!;
      expect(nav.getAttribute('aria-label')).toBe('Navigation menu');
    });

    it('renders open without animating when it starts open', async () => {
      const {drawer} = await setupTest(
        html`<md-gb-nav-drawer open>
          <md-gb-nav-drawer-item>A</md-gb-nav-drawer-item>
        </md-gb-nav-drawer>`,
      );
      expect(drawer.open).toBeTrue();
      expect(sheet(drawer).classList).toContain('nav-drawer-open');
      expect(getComputedStyle(sheet(drawer)).visibility).toBe('visible');
    });

    it('uses spec container tokens for standard and modal', async () => {
      const {drawer} = await setupTest();
      await drawer.show();
      const standardStyle = getComputedStyle(sheet(drawer));
      expect(standardStyle.width).toBe('360px');
      expect(standardStyle.borderTopRightRadius).toBe('16px');
      expect(standardStyle.borderTopLeftRadius).toBe('0px');
      const standardColor = standardStyle.backgroundColor;

      drawer.modal = true;
      await env.waitForStability();
      const modalColor = getComputedStyle(sheet(drawer)).backgroundColor;
      expect(modalColor).not.toBe(standardColor);
      await drawer.close();
    });

    it('applies host token overrides to the sheet and slotted items', async () => {
      const {drawer, items} = await setupTest();
      drawer.style.setProperty('--active-indicator-color', 'rgb(255, 0, 0)');
      drawer.style.setProperty('--container-width', '300px');
      await drawer.show();
      expect(getComputedStyle(sheet(drawer)).width).toBe('300px');
      expect(getComputedStyle(innerControl(items[0])).backgroundColor).toBe(
        'rgb(255, 0, 0)',
      );
    });
  });

  describe('items', () => {
    it('renders a link for href and a button otherwise', async () => {
      const {items} = await setupTest();
      expect(innerControl(items[0]).tagName).toBe('A');
      expect(innerControl(items[0]).getAttribute('href')).toBe('#inbox');
      expect(innerControl(items[1]).tagName).toBe('BUTTON');
    });

    it('marks the selected item with aria-current="page"', async () => {
      const {items} = await setupTest();
      expect(innerControl(items[0]).getAttribute('aria-current')).toBe('page');
      expect(innerControl(items[1]).hasAttribute('aria-current')).toBeFalse();
      expect(innerControl(items[0]).classList).toContain(
        'nav-drawer-item-active',
      );
    });

    it('renders the badge label and icon', async () => {
      const {items} = await setupTest();
      const badge = items[0].shadowRoot!.querySelector<HTMLElement>(
        '.nav-drawer-item-badge',
      )!;
      expect(badge.hidden).toBeFalse();
      expect(badge.textContent!.trim()).toBe('24');
      const icon = items[0].shadowRoot!.querySelector<HTMLElement>(
        '.nav-drawer-item-icon',
      )!;
      expect(icon.hidden).toBeFalse();

      const noBadge = items[1].shadowRoot!.querySelector<HTMLElement>(
        '.nav-drawer-item-badge',
      )!;
      expect(noBadge.hidden).toBeTrue();
      const noIcon = items[1].shadowRoot!.querySelector<HTMLElement>(
        '.nav-drawer-item-icon',
      )!;
      expect(noIcon.hidden).toBeTrue();
    });

    it('disables items', async () => {
      const {items} = await setupTest();
      const button = innerControl(items[2]) as HTMLButtonElement;
      expect(button.disabled).toBeTrue();
    });

    it('selects an item on click and fires change', async () => {
      const {drawer, items} = await setupTest();
      const changeSpy = jasmine.createSpy('change');
      drawer.addEventListener('change', changeSpy);
      innerControl(items[1]).click();
      await env.waitForStability();
      expect(items[1].selected).toBeTrue();
      expect(items[0].selected).toBeFalse();
      expect(drawer.selectedItem === items[1]).toBeTrue();
      expect(changeSpy).toHaveBeenCalledTimes(1);

      innerControl(items[1]).click();
      expect(changeSpy)
        .withContext('re-selecting does not fire change')
        .toHaveBeenCalledTimes(1);
    });

    it('does not select disabled items', async () => {
      const {items} = await setupTest();
      items[2].click();
      await env.waitForStability();
      expect(items[2].selected).toBeFalse();
      expect(items[0].selected).toBeTrue();
    });
  });

  describe('keyboard', () => {
    it('has a single tab stop on the selected item', async () => {
      const {drawer, items} = await setupTest();
      await drawer.show();
      const tabIndexes = items.map((item) => innerControl(item).tabIndex);
      expect(tabIndexes).toEqual([0, -1, -1, -1]);
    });

    it('moves focus with arrow keys, Home and End, skipping disabled items', async () => {
      const {drawer, items} = await setupTest();
      await drawer.show();
      items[0].focus();
      expectFocused(innerControl(items[0]));

      press(innerControl(items[0]), 'ArrowDown');
      await env.waitForStability();
      expectFocused(innerControl(items[1]));

      press(innerControl(items[1]), 'ArrowDown');
      await env.waitForStability();
      expectFocused(innerControl(items[3]), 'skips the disabled item');

      press(innerControl(items[3]), 'ArrowDown');
      await env.waitForStability();
      expectFocused(innerControl(items[0]), 'wraps');

      press(innerControl(items[0]), 'End');
      await env.waitForStability();
      expectFocused(innerControl(items[3]));
      expect(innerControl(items[3]).tabIndex).toBe(0);
      expect(innerControl(items[0]).tabIndex).toBe(-1);

      press(innerControl(items[3]), 'Home');
      await env.waitForStability();
      expectFocused(innerControl(items[0]));

      press(innerControl(items[0]), 'ArrowUp');
      await env.waitForStability();
      expectFocused(innerControl(items[3]));
    });
  });

  describe('standard drawer', () => {
    it('opens and closes with show(), close() and toggle()', async () => {
      const {drawer} = await setupTest();
      await drawer.show();
      expect(drawer.open).toBeTrue();
      expect(drawer.hasAttribute('open')).toBeTrue();
      expect(getComputedStyle(sheet(drawer)).visibility).toBe('visible');

      await drawer.close();
      expect(drawer.open).toBeFalse();
      expect(getComputedStyle(sheet(drawer)).visibility).toBe('hidden');

      await drawer.toggle();
      expect(drawer.open).toBeTrue();
      await drawer.toggle();
      expect(drawer.open).toBeFalse();
    });

    it('collapses the space it takes when closed', async () => {
      const {drawer} = await setupTest(
        html`<div style="display: flex; width: 800px">
          <md-gb-nav-drawer quick>
            <md-gb-nav-drawer-item>A</md-gb-nav-drawer-item>
          </md-gb-nav-drawer>
          <div id="content" style="flex: 1">Content</div>
        </div>`,
      );
      const content = drawer.parentElement!.querySelector('#content')!;
      expect(content.getBoundingClientRect().width).toBe(800);
      await drawer.show();
      expect(content.getBoundingClientRect().width).toBe(440);
    });

    it('fires open, opened, close and closed events', async () => {
      const {drawer} = await setupTest();
      const events: string[] = [];
      let closeReason = '';
      let closedReason = '';
      for (const type of ['open', 'opened', 'close', 'closed']) {
        drawer.addEventListener(type, (event) => {
          events.push(type);
          if (type === 'close') {
            closeReason = (event as CustomEvent).detail.reason;
          }
          if (type === 'closed') {
            closedReason = (event as CustomEvent).detail.reason;
          }
        });
      }
      await drawer.show();
      await drawer.close();
      expect(events).toEqual(['open', 'opened', 'close', 'closed']);
      expect(closeReason).toBe(NAV_DRAWER_CLOSE_REASONS.method);
      expect(closedReason).toBe(NAV_DRAWER_CLOSE_REASONS.method);
    });

    it('can cancel opening and closing', async () => {
      const {drawer} = await setupTest();
      const cancelOpen = (event: Event) => {
        event.preventDefault();
      };
      drawer.addEventListener('open', cancelOpen);
      await drawer.show();
      expect(drawer.open).toBeFalse();
      drawer.removeEventListener('open', cancelOpen);

      await drawer.show();
      drawer.addEventListener('close', (event) => {
        event.preventDefault();
      });
      await drawer.close();
      expect(drawer.open).toBeTrue();
    });

    it('opens and closes when the open property changes', async () => {
      const {drawer} = await setupTest();
      const openSpy = jasmine.createSpy('open');
      drawer.addEventListener('open', openSpy);
      drawer.open = true;
      await env.waitForStability();
      expect(openSpy).toHaveBeenCalled();
      expect(sheet(drawer).classList).toContain('nav-drawer-open');
      drawer.open = false;
      await env.waitForStability();
      expect(sheet(drawer).classList).not.toContain('nav-drawer-open');
    });

    it('does not close on Escape or item selection', async () => {
      const {drawer, items} = await setupTest();
      await drawer.show();
      press(innerControl(items[1]), 'Escape');
      innerControl(items[1]).click();
      await env.waitForStability();
      expect(drawer.open).toBeTrue();
    });

    it('does not render a dialog or scrim', async () => {
      const {drawer} = await setupTest();
      expect(drawer.shadowRoot!.querySelector('dialog')).toBeNull();
      expect(drawer.shadowRoot!.querySelector('.nav-drawer-scrim')).toBeNull();
    });
  });

  describe('modal drawer', () => {
    async function setupModal() {
      const result = await setupTest(html`
        <md-gb-nav-drawer modal quick aria-label="Mail">
          <md-gb-nav-drawer-item>Inbox</md-gb-nav-drawer-item>
          <md-gb-nav-drawer-item selected>Outbox</md-gb-nav-drawer-item>
          <md-gb-nav-drawer-item>Trash</md-gb-nav-drawer-item>
        </md-gb-nav-drawer>
        <button id="outside">Outside</button>
      `);
      const dialog = result.drawer.shadowRoot!.querySelector('dialog')!;
      return {...result, dialog};
    }

    it('opens a labelled modal dialog over a scrim', async () => {
      const {drawer, dialog} = await setupModal();
      expect(dialog.open).toBeFalse();
      await drawer.show();
      expect(dialog.open).toBeTrue();
      expect(dialog.matches(':modal')).toBeTrue();
      expect(dialog.getAttribute('aria-label')).toBe('Mail');
      const scrim = drawer.shadowRoot!.querySelector<HTMLElement>(
        '.nav-drawer-scrim',
      )!;
      expect(getComputedStyle(scrim).opacity).toBe('1');
      expect(sheet(drawer).classList).toContain('nav-drawer-modal');
    });

    it('moves focus to the selected item and restores it on close', async () => {
      const {drawer, items, outside} = await setupModal();
      outside.focus();
      await drawer.show();
      expectFocused(innerControl(items[1]));
      await drawer.close();
      expectFocused(outside);
    });

    it('makes the rest of the page inert while open', async () => {
      const {drawer, outside} = await setupModal();
      await drawer.show();
      outside.focus();
      expect(document.activeElement === outside)
        .withContext('content outside the modal drawer is inert')
        .toBeFalse();
      await drawer.close();
    });

    it('closes on scrim click', async () => {
      const {drawer, dialog} = await setupModal();
      await drawer.show();
      let reason = '';
      drawer.addEventListener('closed', (event) => {
        reason = (event as CustomEvent).detail.reason;
      });
      drawer.shadowRoot!.querySelector<HTMLElement>('.nav-drawer-scrim')!.click();
      await env.waitForStability();
      await nextTask();
      expect(drawer.open).toBeFalse();
      expect(dialog.open).toBeFalse();
      expect(reason).toBe(NAV_DRAWER_CLOSE_REASONS.scrim);
    });

    it('closes on Escape', async () => {
      const {drawer, dialog} = await setupModal();
      await drawer.show();
      let reason = '';
      drawer.addEventListener('close', (event) => {
        reason = (event as CustomEvent).detail.reason;
      });
      dialog.dispatchEvent(new Event('cancel', {cancelable: true}));
      await env.waitForStability();
      await nextTask();
      expect(drawer.open).toBeFalse();
      expect(dialog.open).toBeFalse();
      expect(reason).toBe(NAV_DRAWER_CLOSE_REASONS.escape);
    });

    it('closes when an item is selected', async () => {
      const {drawer, items} = await setupModal();
      await drawer.show();
      let reason = '';
      drawer.addEventListener('close', (event) => {
        reason = (event as CustomEvent).detail.reason;
      });
      innerControl(items[0]).click();
      await env.waitForStability();
      await nextTask();
      expect(items[0].selected).toBeTrue();
      expect(drawer.open).toBeFalse();
      expect(reason).toBe(NAV_DRAWER_CLOSE_REASONS.item);
    });

    it('syncs state when the dialog is closed natively', async () => {
      const {drawer, dialog} = await setupModal();
      await drawer.show();
      const closedSpy = jasmine.createSpy('closed');
      drawer.addEventListener('closed', closedSpy);
      const dialogClosed = new Promise((resolve) => {
        dialog.addEventListener('close', resolve, {once: true});
      });
      dialog.close();
      await dialogClosed;
      await env.waitForStability();
      expect(drawer.open).toBeFalse();
      expect(closedSpy).toHaveBeenCalledTimes(1);
    });
  });
});
