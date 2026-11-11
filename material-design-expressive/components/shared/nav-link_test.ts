/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import '../navbar/md-gb-nav-bar.js';
import '../navbar/md-gb-nav-bar-item.js';
import '../navrail/md-gb-nav-rail.js';
import '../navrail/md-gb-nav-rail-item.js';

import {sendKeys} from '@web/test-runner-commands';
import {internals} from '../../internal/behaviors/element-internals.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {until} from './test-dom.js';

adoptStyles(document, [m3Styles]);

type Item = HTMLElement & {
  updateComplete: Promise<unknown>;
  selected: boolean;
  href: string;
  [internals]: ElementInternals;
};
type Bar = HTMLElement & {
  updateComplete: Promise<unknown>;
  [internals]: ElementInternals;
};

const containers: HTMLElement[] = [];

for (const [barTag, itemTag] of [
  ['md-gb-nav-bar', 'md-gb-nav-bar-item'],
  ['md-gb-nav-rail', 'md-gb-nav-rail-item'],
]) {
  describe(`<${itemTag}> as a link`, () => {
    const start = location.href;

    afterEach(() => {
      for (const c of containers.splice(0)) c.remove();
      history.replaceState(null, '', start);
    });

    async function mount(items: string) {
      const container = document.createElement('div');
      containers.push(container);
      container.innerHTML = `<${barTag}>${items}</${barTag}>`;
      document.body.append(container);
      const bar = container.querySelector<Bar>(barTag)!;
      const all = [...container.querySelectorAll<Item>(itemTag)];
      await bar.updateComplete;
      await Promise.all(all.map((item) => item.updateComplete));
      return {bar, items: all};
    }

    const anchor = (item: Item) =>
      item.shadowRoot!.querySelector<HTMLAnchorElement>('a');

    it('keeps the tab role and a button behavior without href', async () => {
      const {bar, items} = await mount(
        `<${itemTag} selected>One</${itemTag}><${itemTag}>Two</${itemTag}>`,
      );
      expect(bar[internals].role).toBe('tablist');
      expect(items[0][internals].role).toBe('tab');
      expect(items[0][internals].ariaSelected).toBe('true');
      expect(items[1][internals].ariaSelected).toBe('false');
      expect(anchor(items[0])).toBeNull();
    });

    it('renders a link with the href, target and rel', async () => {
      const {items} = await mount(
        `<${itemTag} href="#one" target="_blank" rel="noopener">One</${itemTag}>`,
      );
      const a = anchor(items[0])!;
      expect(a.getAttribute('href')).toBe('#one');
      expect(a.getAttribute('target')).toBe('_blank');
      expect(a.getAttribute('rel')).toBe('noopener');
      expect(items[0][internals].role).toBe('link');
      expect(items[0][internals].ariaSelected).toBeNull();
    });

    it('marks the selected link aria-current="page" and drops aria-selected', async () => {
      const {bar, items} = await mount(
        `<${itemTag} href="#one" selected>One</${itemTag}><${itemTag} href="#two">Two</${itemTag}>`,
      );
      expect(bar[internals].role).toBe('navigation');
      expect(items[0][internals].ariaCurrent).toBe('page');
      expect(items[1][internals].ariaCurrent).toBeNull();
      expect(items[0].selected).toBeTrue();
      expect(items[0][internals].ariaSelected).toBeNull();
      expect(items[1][internals].ariaSelected).toBeNull();
      items[1].selected = true;
      items[0].selected = false;
      await items[1].updateComplete;
      expect(items[1][internals].ariaCurrent).toBe('page');
      expect(items[0][internals].ariaCurrent).toBeNull();
      expect(items[0][internals].ariaSelected).toBeNull();
    });

    it('follows href being set and removed', async () => {
      const {bar, items} = await mount(
        `<${itemTag} selected>One</${itemTag}><${itemTag}>Two</${itemTag}>`,
      );
      for (const item of items) item.href = '#x';
      expect(await until(() => bar[internals].role === 'navigation')).toBeTrue();
      expect(items[0][internals].role).toBe('link');
      expect(items[0][internals].ariaCurrent).toBe('page');
      for (const item of items) item.href = '';
      expect(await until(() => bar[internals].role === 'tablist')).toBeTrue();
      expect(items[0][internals].role).toBe('tab');
      expect(items[0][internals].ariaSelected).toBe('true');
      expect(items[0][internals].ariaCurrent).toBeNull();
      expect(items[1][internals].ariaSelected).toBe('false');
    });

    it('navigates on click and selects the item', async () => {
      const {items} = await mount(
        `<${itemTag} href="#one" selected>One</${itemTag}><${itemTag} href="#two">Two</${itemTag}>`,
      );
      anchor(items[1])!.click();
      expect(location.hash).toBe('#two');
      expect(await until(() => items[1].selected)).toBeTrue();
      expect(items[0].selected).toBeFalse();
    });

    it('navigates with Enter but not Space', async () => {
      const {items} = await mount(
        `<${itemTag} href="#one" selected>One</${itemTag}><${itemTag} href="#two">Two</${itemTag}>`,
      );
      items[1].focus();
      await sendKeys({press: 'Space'});
      expect(location.hash).not.toBe('#two');
      await sendKeys({press: 'Enter'});
      expect(await until(() => location.hash === '#two')).toBeTrue();
    });

    it('does not navigate when disabled', async () => {
      const {items} = await mount(
        `<${itemTag} href="#one" selected>One</${itemTag}><${itemTag} href="#two" disabled>Two</${itemTag}>`,
      );
      expect(anchor(items[1])!.hasAttribute('href')).toBeFalse();
      items[1].click();
      anchor(items[1])!.click();
      expect(location.hash).not.toBe('#two');
    });
  });
}
