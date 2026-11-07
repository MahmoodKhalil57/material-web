/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Tests for spec units that were tracked as gaps and are now built.

// import 'jasmine'; (google3-only)

import '../checkbox/md-gb-checkbox.js';
import '../divider/md-gb-divider.js';
import '../iconbutton/md-gb-icon-button.js';
import '../radio/md-gb-radio.js';
import '../switch/md-gb-switch.js';
import './md-gb-list.js';
import './md-gb-list-item.js';

import {sendKeys} from '@web/test-runner-commands';
import {html, type TemplateResult} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {ListElement} from './list-element.js';
import {ListItemElement} from './list-item-element.js';

adoptStyles(document, [m3Styles]);

function resolvedColor(token: string) {
  const probe = document.createElement('div');
  probe.style.color = `var(${token})`;
  document.body.appendChild(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return color;
}

function rect(el: Element) {
  return el.getBoundingClientRect();
}

function itemOf(item: ListItemElement) {
  return item.shadowRoot!.querySelector<HTMLElement>('.list-item')!;
}

describe('md-gb-list tracked spec units', () => {
  const env = new Environment();

  async function render(template: TemplateResult) {
    const root = env.render(template);
    await env.waitForStability();
    const list = root.querySelector('md-gb-list') as ListElement;
    const items = Array.from(root.querySelectorAll('md-gb-list-item')) as ListItemElement[];
    await list.updateComplete;
    for (const item of items) await item.updateComplete;
    await env.waitForStability();
    return {root, list, items};
  }

  async function settleAnimations() {
    await env.waitForStability();
    document.getAnimations().forEach((a) => a.finish());
  }

  describe('layout', () => {
    // spec: lists-0206d0
    it('sets the item height from its tallest element: 56dp, 72dp or 88dp', async () => {
      const {items} = await render(html`<div style="width: 360px"
        ><md-gb-list>
          <md-gb-list-item>One line</md-gb-list-item>
          <md-gb-list-item>Two lines<span slot="supporting-text">Supporting</span></md-gb-list-item>
          <md-gb-list-item
            ><span slot="overline">Overline</span>Three lines<span slot="supporting-text">Supporting</span></md-gb-list-item
          >
          <md-gb-list-item
            >Tall element<span slot="leading" style="display: block; height: 120px">image</span></md-gb-list-item
          >
        </md-gb-list></div
      >`);
      const heights = items.map((item) => rect(itemOf(item)).height);
      expect(heights[0]).toBeCloseTo(56, 0);
      expect(heights[1]).toBeCloseTo(72, 0);
      expect(heights[2]).toBeCloseTo(88, 0);
      expect(heights[3]).toBeGreaterThan(120);
    });

    // spec: lists-f68fb5
    it('top-aligns the elements of an item that is 88dp or taller', async () => {
      const {items} = await render(html`<div style="width: 360px"
        ><md-gb-list>
          <md-gb-list-item
            ><span slot="leading" style="display: block; height: 24px; width: 24px">i</span>
            <span slot="overline">Overline</span>Headline
            <span slot="supporting-text">Supporting text that is long enough to wrap onto several lines of the narrow list</span>
            <span slot="trailing" style="display: block; height: 24px; width: 24px">t</span></md-gb-list-item
          >
        </md-gb-list></div
      >`);
      const item = rect(itemOf(items[0]));
      expect(item.height).toBeGreaterThanOrEqual(88);
      const leading = rect(items[0].shadowRoot!.querySelector('.list-item-leading')!);
      const trailing = rect(items[0].shadowRoot!.querySelector('.list-item-trailing')!);
      expect(leading.top - item.top).toBeLessThanOrEqual(12.5);
      expect(trailing.top - item.top).toBeLessThanOrEqual(12.5);
    });

    // spec: lists-e03c47
    it('extends edge to edge in a compact window', async () => {
      const {list} = await render(html`<div style="width: 360px"
        ><md-gb-list><md-gb-list-item>One</md-gb-list-item></md-gb-list></div
      >`);
      expect(rect(list).width).toBe(360);
    });

    // spec: lists-1a53ad
    it('adapts its density to a larger window', async () => {
      const {items} = await render(html`<div style="width: 360px"
        ><md-gb-list density="-1"><md-gb-list-item>Denser</md-gb-list-item></md-gb-list>
        <md-gb-list><md-gb-list-item>Default</md-gb-list-item></md-gb-list></div
      >`);
      expect(rect(itemOf(items[0])).height).toBeLessThan(rect(itemOf(items[1])).height);
    });

    // spec: lists-035c5f
    it('gives every item a target of at least 48dp', async () => {
      const {items} = await render(html`<div style="width: 360px"
        ><md-gb-list><md-gb-list-item>One</md-gb-list-item></md-gb-list></div
      >`);
      const box = rect(itemOf(items[0]));
      expect(box.height).toBeGreaterThanOrEqual(48);
      expect(box.width).toBeGreaterThanOrEqual(48);
    });

    // spec: lists-690f65, lists-2fd9b0, lists-434872
    it('makes the content slot the widest section, between the leading and trailing slots', async () => {
      const {items} = await render(html`<div style="width: 360px"
        ><md-gb-list>
          <md-gb-list-item
            ><span slot="leading" style="display: block; width: 24px; height: 24px">l</span>A list item label that has some length<span slot="trailing" style="display: block; width: 24px; height: 24px">t</span></md-gb-list-item
          >
        </md-gb-list></div
      >`);
      const root = items[0].shadowRoot!;
      const leading = rect(root.querySelector('.list-item-leading')!);
      const content = rect(root.querySelector('.list-item-content')!);
      const trailing = rect(root.querySelector('.list-item-trailing')!);
      expect(content.width).toBeGreaterThan(leading.width);
      expect(content.width).toBeGreaterThan(trailing.width);
      expect(leading.right).toBeLessThanOrEqual(content.left);
      expect(content.right).toBeLessThanOrEqual(trailing.left);
    });
  });

  describe('configurations', () => {
    function image() {
      return html`<img
        slot="leading"
        alt=""
        width="56"
        height="56"
        src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />`;
    }

    // spec: lists-ee0a9c, lists-d5548c, lists-f45896, lists-cc54ee
    it('takes a leading avatar, which is circular', async () => {
      const {items} = await render(html`<div style="width: 360px"
        ><md-gb-list><md-gb-list-item><span slot="avatar">A</span>Item</md-gb-list-item></md-gb-list></div
      >`);
      const avatar = items[0].shadowRoot!.querySelector<HTMLElement>('.list-item-avatar')!;
      const box = rect(avatar);
      expect(box.width).toBeGreaterThan(0);
      expect(box.width).toBeCloseTo(box.height, 0);
      expect(parseFloat(getComputedStyle(avatar).borderTopLeftRadius)).toBeGreaterThanOrEqual(box.width / 2);
    });

    // spec: lists-7f525d, lists-9e5b01, lists-25f323, lists-c08398, lists-f45896, lists-cc54ee, lists-a8a94b
    it('takes a leading image or video, with an optional trailing checkbox', async () => {
      const {items} = await render(html`<div style="width: 360px"
        ><md-gb-list>
          <md-gb-list-item>${image()}Image<md-gb-checkbox slot="trailing" aria-label="Select"></md-gb-checkbox></md-gb-list-item>
          <md-gb-list-item><video slot="leading" width="56" height="56"></video>Video<md-gb-checkbox slot="trailing" aria-label="Select"></md-gb-checkbox></md-gb-list-item>
        </md-gb-list></div
      >`);
      for (const item of items) {
        const leading = item.querySelector<HTMLElement>('[slot=leading]')!;
        const trailing = item.querySelector<HTMLElement>('[slot=trailing]')!;
        const box = rect(itemOf(item));
        expect(rect(leading).width).toBe(56);
        expect(rect(leading).left).toBeGreaterThanOrEqual(box.left);
        expect(rect(trailing).right).toBeLessThanOrEqual(box.right);
        expect(rect(leading).right).toBeLessThanOrEqual(rect(trailing).left);
      }
    });

    // spec: lists-865926, lists-e00042, lists-a43b62, lists-e2680b, lists-9c161d, lists-52c859, lists-3b8088, lists-5c23bd, lists-9f985d
    it('takes icons and selection controls (checkbox, radio button, switch) in the leading and trailing slots', async () => {
      const {items} = await render(html`<div style="width: 360px"
        ><md-gb-list>
          <md-gb-list-item><span slot="leading">i</span>Icon</md-gb-list-item>
          <md-gb-list-item><md-gb-checkbox slot="leading" aria-label="Select"></md-gb-checkbox>Checkbox</md-gb-list-item>
          <md-gb-list-item><md-gb-radio slot="leading" aria-label="Select"></md-gb-radio>Radio</md-gb-list-item>
          <md-gb-list-item><span slot="leading">i</span>Switch<md-gb-switch slot="trailing" aria-label="On"></md-gb-switch></md-gb-list-item>
          <md-gb-list-item>Badge<span slot="trailing-text">99+</span><span slot="trailing">b</span></md-gb-list-item>
        </md-gb-list></div
      >`);
      for (const item of items) {
        const box = rect(itemOf(item));
        const slotted = Array.from(item.querySelectorAll('[slot=leading], [slot=trailing], [slot=trailing-text]'));
        expect(slotted.length).toBeGreaterThan(0);
        for (const el of slotted) {
          const r = rect(el);
          expect(r.width).toBeGreaterThan(0);
          expect(r.left).toBeGreaterThanOrEqual(box.left);
          expect(r.right).toBeLessThanOrEqual(box.right);
        }
      }
    });

    // spec: lists-6dd163, lists-467d8d
    it('draws dividers in the outline variant color', async () => {
      await render(html`<div style="width: 360px"
        ><md-gb-list>
          <md-gb-list-item>A</md-gb-list-item>
          <md-gb-divider></md-gb-divider>
          <md-gb-list-item>B</md-gb-list-item>
        </md-gb-list></div
      >`);
      const divider = document.querySelector('md-gb-divider')!;
      const line = divider.shadowRoot!.querySelector('[part=divider]')!;
      expect(getComputedStyle(line).borderBottomColor).toBe(resolvedColor('--md-sys-color-outline-variant'));
    });
  });

  describe('styles and selection modes', () => {
    // spec: lists-56bd09, lists-f79eaa, lists-8dbf57
    it('keeps the same behavior in the standard and segmented styles', async () => {
      for (const segmented of [false, true]) {
        const {items} = await render(html`<div style="width: 360px"
          ><md-gb-list selectable ?segmented=${segmented}>
            <md-gb-list-item checked>A</md-gb-list-item>
            <md-gb-list-item>B</md-gb-list-item>
          </md-gb-list></div
        >`);
        items[0].shadowRoot!.querySelector<HTMLElement>('#item')!.focus();
        await sendKeys({press: 'ArrowDown'});
        expect(document.activeElement).withContext(`segmented=${segmented}`).toBe(items[1]);
        await sendKeys({press: 'Space'});
        await env.waitForStability();
        expect(items[1].checked).withContext(`segmented=${segmented}`).toBeTrue();
        expect(items[0].checked).toBeTrue();
      }
    });

    // spec: lists-224adc, lists-b29225
    it('has one selection mode at a time: a list is selectable or it is not', async () => {
      const {list, items} = await render(html`<div style="width: 360px"
        ><md-gb-list>
          <md-gb-list-item>A</md-gb-list-item>
        </md-gb-list></div
      >`);
      expect(list.selectable).toBeFalse();
      expect(list.getAttribute('role')).toBeNull();
      list.selectable = true;
      await list.updateComplete;
      expect(items[0].shadowRoot!.querySelector('#item')).not.toBeNull();
      expect(list.hasAttribute('selectable')).toBeTrue();
      list.selectable = false;
      await list.updateComplete;
      expect(list.hasAttribute('selectable')).toBeFalse();
    });

    // spec: lists-6f7731
    it('makes each item of a single-action list one tappable area', async () => {
      const {items} = await render(html`<div style="width: 360px"
        ><md-gb-list>
          <md-gb-list-item>A<span slot="supporting-text">Supporting</span></md-gb-list-item>
        </md-gb-list></div
      >`);
      const buttons = items[0].shadowRoot!.querySelectorAll('button');
      expect(buttons.length).toBe(1);
      expect(rect(buttons[0]).width).toBeCloseTo(rect(items[0]).width, 0);
    });
  });

  describe('selection feedback', () => {
    // spec: lists-22dcaf, lists-a10d3f, lists-d23493
    it('shows a selected item with a checkmark as well as a filled color', async () => {
      const {items} = await render(html`<div style="width: 360px"
        ><md-gb-list selectable>
          <md-gb-list-item>A</md-gb-list-item>
          <md-gb-list-item checked>B</md-gb-list-item>
        </md-gb-list></div
      >`);
      await settleAnimations();
      const plain = itemOf(items[0]);
      const selected = itemOf(items[1]);
      expect(getComputedStyle(selected).backgroundColor).not.toBe(getComputedStyle(plain).backgroundColor);
      expect(getComputedStyle(selected, '::checkmark').content).toContain('check');
    });
  });

  describe('keyboard', () => {
    async function setup(selected = -1) {
      const result = await render(html`<button id="before">Before</button>
        <md-gb-list selectable aria-label="Fruits">
          ${['Apples', 'Bananas', 'Cherries'].map(
            (label, i) => html`<md-gb-list-item ?checked=${i === selected}>${label}</md-gb-list-item>`,
          )}
        </md-gb-list>`);
      return result;
    }

    // spec: lists-b6a749, lists-9ddd5d
    it('focuses the first item with Tab', async () => {
      const {items} = await setup();
      document.querySelector<HTMLElement>('#before')!.focus();
      await sendKeys({press: 'Tab'});
      expect(document.activeElement).toBe(items[0]);
    });

    // spec: lists-c0bbd6, lists-9ddd5d
    it('focuses the selected item with Tab when the list has one', async () => {
      const {items} = await setup(1);
      document.querySelector<HTMLElement>('#before')!.focus();
      await sendKeys({press: 'Tab'});
      expect(document.activeElement).toBe(items[1]);
    });

    // spec: lists-bda6ed, lists-ce51cf
    it('navigates between the items with the arrow keys once one is focused', async () => {
      const {items} = await setup();
      items[0].focus();
      await sendKeys({press: 'ArrowDown'});
      expect(document.activeElement).toBe(items[1]);
      await sendKeys({press: 'ArrowDown'});
      expect(document.activeElement).toBe(items[2]);
      await sendKeys({press: 'ArrowUp'});
      expect(document.activeElement).toBe(items[1]);
    });

    // spec: lists-68139a, lists-ce4cd1
    it('activates an item with Space or Enter', async () => {
      const {items} = await setup(2);
      items[0].focus();
      await sendKeys({press: 'Space'});
      await env.waitForStability();
      expect(items[0].checked).toBeTrue();
      items[1].focus();
      await sendKeys({press: 'Enter'});
      await env.waitForStability();
      expect(items[1].checked).toBeTrue();
    });
  });

  describe('multi-action items', () => {
    async function setup() {
      return render(html`<button id="before">Before</button>
        <md-gb-list aria-label="Messages">
          <md-gb-list-item>
            First
            <md-gb-icon-button slot="trailing" id="a1" aria-label="Archive">a</md-gb-icon-button>
            <md-gb-icon-button slot="trailing" id="a2" aria-label="Delete">d</md-gb-icon-button>
          </md-gb-list-item>
          <md-gb-list-item>
            Second
            <md-gb-icon-button slot="trailing" id="b1" aria-label="Archive">a</md-gb-icon-button>
          </md-gb-list-item>
        </md-gb-list>`);
    }

    function active() {
      let el = document.activeElement;
      while (el?.shadowRoot?.activeElement) el = el.shadowRoot.activeElement;
      return el as HTMLElement;
    }

    function ids() {
      const path: string[] = [];
      let el = document.activeElement;
      while (el) {
        if (el.id) path.push(el.id);
        el = el.shadowRoot?.activeElement ?? null;
      }
      return path;
    }

    // spec: lists-52fda3, lists-218ed4, lists-f94d9c, lists-fc595a, lists-8d67e6, lists-635990
    it('focuses the first action with Tab, and each action on its own', async () => {
      const {items} = await setup();
      document.querySelector<HTMLElement>('#before')!.focus();
      await sendKeys({press: 'Tab'});
      expect(items[0].shadowRoot!.activeElement?.id ?? ids().join()).toBe('item');
      // The item as a whole isn't selectable; its actions are separate controls.
      expect(items[0].querySelectorAll('md-gb-icon-button').length).toBe(2);
    });

    // spec: lists-9c37cc, lists-9087ff, lists-3cc28d
    it('moves to the next action with Down or Right, and to the next item past the last action', async () => {
      const {items} = await setup();
      items[0].focus();
      await sendKeys({press: 'ArrowRight'});
      expect(ids()).toContain('a1');
      await sendKeys({press: 'ArrowDown'});
      expect(ids()).toContain('a2');
      await sendKeys({press: 'ArrowDown'});
      expect(document.activeElement).toBe(items[1]);
      await sendKeys({press: 'ArrowRight'});
      expect(ids()).toContain('b1');
    });

    // spec: lists-9c37cc, lists-8a5d69, lists-3cc28d
    it('moves to the previous action with Up or Left, and to the previous item before the first', async () => {
      const {items} = await setup();
      items[0].focus();
      await sendKeys({press: 'ArrowRight'});
      await sendKeys({press: 'ArrowRight'});
      expect(ids()).toContain('a2');
      await sendKeys({press: 'ArrowUp'});
      expect(ids()).toContain('a1');
      await sendKeys({press: 'ArrowLeft'});
      expect(document.activeElement).toBe(items[0]);
      expect(active().id).toBe('item');
      await sendKeys({press: 'ArrowLeft'});
      // Past the first element of the first item, focus wraps back.
      expect(document.activeElement).not.toBe(items[0]);
    });

    // spec: lists-36683c, lists-c8235b
    it('activates a focused action with Space or Enter', async () => {
      const {items} = await setup();
      const action = items[0].querySelector<HTMLElement>('#a1')!;
      let clicks = 0;
      action.addEventListener('click', () => clicks++);
      items[0].focus();
      await sendKeys({press: 'ArrowRight'});
      await sendKeys({press: 'Enter'});
      await sendKeys({press: 'Space'});
      expect(clicks).toBe(2);
    });
  });

  describe('accessibility', () => {
    // spec: lists-1810a3, lists-0b39e7, lists-92adae, lists-4280d5, lists-741eff, lists-25fe3e, lists-8b1a53, lists-506518
    it('is a list box of options that are selected or not selected, labeled with the selection type', async () => {
      const {list, items} = await render(html`<div style="width: 360px"
        ><md-gb-list selectable aria-label="Select fruits">
          <md-gb-list-item>A</md-gb-list-item>
          <md-gb-list-item checked>B</md-gb-list-item>
        </md-gb-list></div
      >`);
      expect(list.getAttribute('aria-label')).toBe('Select fruits');
      // The roles are set through ElementInternals; read them back.
      expect(accessibleRole(list)).toBe('listbox');
      expect(accessibleRole(items[0])).toBe('option');
      expect(ariaSelectedOf(items[0])).toBe('false');
      expect(ariaSelectedOf(items[1])).toBe('true');
      items[0].checked = true;
      await items[0].updateComplete;
      expect(ariaSelectedOf(items[0])).toBe('true');
    });

    // spec: lists-6dc299
    it('reads a list that is not selectable without the list box role', async () => {
      const {list, items} = await render(html`<div style="width: 360px"
        ><md-gb-list aria-label="Notifications">
          <md-gb-list-item>A</md-gb-list-item>
        </md-gb-list></div
      >`);
      expect(accessibleRole(list)).toBe('list');
      expect(accessibleRole(items[0])).toBe('listitem');
      expect(ariaSelectedOf(items[0])).toBeNull();
    });
  });
});

/** Reads the role an element sets through ElementInternals. */
function accessibleRole(el: HTMLElement): string | null {
  return captureInternals(el)?.role ?? null;
}

function ariaSelectedOf(el: HTMLElement): string | null {
  return captureInternals(el)?.ariaSelected ?? null;
}

const internalsCache = new WeakMap<Element, ElementInternals>();
const realAttach = HTMLElement.prototype.attachInternals;
HTMLElement.prototype.attachInternals = function (this: HTMLElement) {
  const internals = realAttach.call(this);
  internalsCache.set(this, internals);
  return internals;
};

function captureInternals(el: Element) {
  return internalsCache.get(el);
}
