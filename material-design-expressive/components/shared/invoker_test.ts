/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import '../button/md-gb-button.js';
import '../iconbutton/md-gb-icon-button.js';
import '../menu/md-gb-menu.js';
import '../menu/md-gb-menu-item.js';

import {sendKeys} from '@web/test-runner-commands';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import menuStyles from '../menu/menu.cssresult.js';
import {until} from './test-dom.js';

adoptStyles(document, [m3Styles, menuStyles]);

type Host = HTMLElement & {updateComplete: Promise<unknown>};
type Invoker = HTMLButtonElement & {commandForElement?: Element | null};

const hasCommandFor = 'commandForElement' in HTMLButtonElement.prototype;
const containers: HTMLElement[] = [];

async function mount(html: string) {
  const container = document.createElement('div');
  containers.push(container);
  container.innerHTML = html;
  document.body.append(container);
  const host = container.querySelector<Host>('[data-host]')!;
  await host.updateComplete;
  const inner = () =>
    host.shadowRoot!.querySelector<Invoker>('button, a') as Invoker;
  return {container, host, inner};
}

const popoverOpen = (el: Element | null) => !!el?.matches(':popover-open');

for (const tag of ['md-gb-button', 'md-gb-icon-button']) {
  describe(`<${tag}> invoker attributes`, () => {
    afterEach(() => {
      for (const c of containers.splice(0)) c.remove();
    });

    const host = (attrs: string) =>
      `<${tag} data-host aria-label="Open" ${attrs}>Open</${tag}>`;

    it('sets popoverTargetElement from popovertarget and opens the popover', async () => {
      const {container, inner, host: button} = await mount(
        `${host('popovertarget="p" type="button"')}<div id="p" popover>Hi</div>`,
      );
      const popover = container.querySelector('#p')!;
      expect(inner().popoverTargetElement === popover).toBeTrue();
      button.focus();
      await sendKeys({press: 'Enter'});
      expect(await until(() => popoverOpen(popover))).toBeTrue();
      await sendKeys({press: 'Space'});
      expect(await until(() => !popoverOpen(popover))).toBeTrue();
    });

    it('passes popovertargetaction', async () => {
      const {container, inner, host: button} = await mount(
        `${host('popovertarget="p" popovertargetaction="hide" type="button"')}<div id="p" popover>Hi</div>`,
      );
      const popover = container.querySelector<HTMLElement>('#p')!;
      expect(inner().getAttribute('popovertargetaction')).toBe('hide');
      popover.showPopover();
      button.focus();
      // Light dismiss would close it anyway; the hide action closes it from
      // the button.
      inner().click();
      expect(await until(() => !popoverOpen(popover))).toBeTrue();
      button.setAttribute('popovertargetaction', 'show');
      expect(
        await until(() => inner().getAttribute('popovertargetaction') === 'show'),
      ).toBeTrue();
      inner().click();
      expect(await until(() => popoverOpen(popover))).toBeTrue();
    });

    it('follows the attribute and a target that appears or goes', async () => {
      const {container, inner, host: button} = await mount(
        `${host('popovertarget="late" type="button"')}`,
      );
      expect(inner().popoverTargetElement).toBeNull();
      const late = document.createElement('div');
      late.popover = 'auto';
      late.id = 'late';
      container.append(late);
      expect(
        await until(() => inner().popoverTargetElement === late),
      ).toBeTrue();
      late.id = 'renamed';
      expect(
        await until(() => inner().popoverTargetElement === null),
      ).toBeTrue();
      button.setAttribute('popovertarget', 'renamed');
      expect(
        await until(() => inner().popoverTargetElement === late),
      ).toBeTrue();
      button.removeAttribute('popovertarget');
      expect(
        await until(() => inner().popoverTargetElement === null),
      ).toBeTrue();
    });

    it('resolves the id in the host root, inside a shadow root too', async () => {
      const {container} = await mount(host('type="button"'));
      container.innerHTML = '';
      const shadowHost = document.createElement('div');
      container.append(shadowHost);
      const root = shadowHost.attachShadow({mode: 'open'});
      root.innerHTML = `${host('popovertarget="p" type="button"')}<div id="p" popover>Hi</div>`;
      const button = root.querySelector<Host>('[data-host]')!;
      await button.updateComplete;
      const inner = button.shadowRoot!.querySelector<Invoker>('button')!;
      expect(inner.popoverTargetElement === root.getElementById('p')).toBeTrue();
    });

    it('commandfor opens the popover with the show, hide and toggle commands', async () => {
      const {container, inner, host: button} = await mount(
        `${host('commandfor="p" command="toggle-popover" type="button"')}<div id="p" popover>Hi</div>`,
      );
      const popover = container.querySelector('#p')!;
      if (hasCommandFor) {
        expect(inner().commandForElement === popover).toBeTrue();
        expect(inner().getAttribute('command')).toBe('toggle-popover');
      } else {
        // Falls back to the popovertarget behavior.
        expect(inner().popoverTargetElement === popover).toBeTrue();
        expect(inner().getAttribute('popovertargetaction')).toBe('toggle');
      }
      button.focus();
      await sendKeys({press: 'Enter'});
      expect(await until(() => popoverOpen(popover))).toBeTrue();
      button.setAttribute('command', 'hide-popover');
      expect(
        await until(
          () =>
            inner().getAttribute(hasCommandFor ? 'command' : 'popovertargetaction') ===
            (hasCommandFor ? 'hide-popover' : 'hide'),
        ),
      ).toBeTrue();
      inner().click();
      expect(await until(() => !popoverOpen(popover))).toBeTrue();
    });

    it('falls back to popovertarget where commandfor is unsupported', async () => {
      const proto = HTMLButtonElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(proto, 'commandForElement');
      if (!descriptor) return;
      // Hide the API for the duration of the test, as an older browser would.
      delete (proto as {commandForElement?: unknown}).commandForElement;
      try {
        const {container, inner} = await mount(
          `${host('commandfor="p" command="show-popover" type="button"')}<div id="p" popover>Hi</div>`,
        );
        const button = inner();
        expect(button.popoverTargetElement === container.querySelector('#p')).toBeTrue();
        expect(button.getAttribute('popovertargetaction')).toBe('show');
        expect(button.hasAttribute('command')).toBeFalse();
      } finally {
        Object.defineProperty(proto, 'commandForElement', descriptor);
      }
    });

    it('does nothing without a target', async () => {
      const {inner} = await mount(host('popovertarget="missing" type="button"'));
      expect(inner().popoverTargetElement).toBeNull();
      expect(inner().hasAttribute('popovertargetaction')).toBeFalse();
    });
  });

  describe(`<${tag}> as a menu invoker`, () => {
    afterEach(() => {
      for (const c of containers.splice(0)) c.remove();
    });

    async function setup() {
      const result = await mount(`
        <${tag} data-host aria-label="Menu" popovertarget="menu" type="button">Menu</${tag}>
        <md-gb-menu id="menu">
          <md-gb-menu-item>Cut</md-gb-menu-item>
          <md-gb-menu-item>Copy</md-gb-menu-item>
        </md-gb-menu>`);
      const menu = result.container.querySelector<HTMLElement>('#menu')!;
      await (menu as Host).updateComplete;
      return {...result, menu};
    }

    const expanded = (inner: () => Element) => inner().getAttribute('aria-expanded');

    for (const press of ['Enter', 'Space', 'ArrowDown', 'ArrowUp']) {
      it(`opens with ${press}, marks aria-expanded and returns focus`, async () => {
        const {host: button, inner, menu} = await setup();
        button.focus();
        await sendKeys({press});
        expect(await until(() => popoverOpen(menu))).toBeTrue();
        expect(await until(() => expanded(inner) === 'true')).toBeTrue();
        // The state lives on the host (delegated to the inner button) only.
        expect(button.hasAttribute('aria-expanded')).toBeFalse();
        await sendKeys({press: 'Escape'});
        expect(await until(() => !popoverOpen(menu))).toBeTrue();
        expect(await until(() => expanded(inner) === 'false')).toBeTrue();
        expect(await until(() => document.activeElement === button)).toBeTrue();
      });
    }

    it('opens on click', async () => {
      const {inner, menu} = await setup();
      inner().click();
      expect(await until(() => popoverOpen(menu))).toBeTrue();
      expect(await until(() => expanded(inner) === 'true')).toBeTrue();
    });
  });
}
