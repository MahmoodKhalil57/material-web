/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Spec unit tests for lists: layout, selection and interaction rules from the
// spec's Specs, Guidelines and Accessibility tabs.

// import 'jasmine'; (google3-only)
import {sendKeys} from '@web/test-runner-commands';
import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {ListElement} from './list-element.js';
import {ListItemElement} from './list-item-element.js';
import './md-gb-list-item.js';
import './md-gb-list.js';

adoptStyles(document, [m3Styles]);

function itemOf(item: ListItemElement) {
  return item.shadowRoot!.querySelector<HTMLElement>('.list-item')!;
}

describe('lists spec units', () => {
  const env = new Environment();

  async function render(template: unknown) {
    const root = env.render(html`${template}`);
    await env.waitForStability();
    await env.waitForStability();
    return root;
  }

  // spec: lists-e7b76e, lists-ce1dac, lists-d36188, lists-e80953
  it('separates segmented list items with gaps and round corners', async () => {
    const root = await render(html`
      <div style="width: 360px">
        <md-gb-list id="std">
          <md-gb-list-item>A</md-gb-list-item>
          <md-gb-list-item>B</md-gb-list-item>
        </md-gb-list>
        <md-gb-list id="seg" segmented>
          <md-gb-list-item>A</md-gb-list-item>
          <md-gb-list-item>B</md-gb-list-item>
        </md-gb-list>
      </div>`);
    const gap = (id: string) => {
      const [a, b] = Array.from(
        root.querySelectorAll<HTMLElement>(`#${id} md-gb-list-item`),
      );
      return b.getBoundingClientRect().top - a.getBoundingClientRect().bottom;
    };
    expect(gap('std')).toBeLessThanOrEqual(0.5);
    expect(gap('seg')).toBeGreaterThan(0);
    const seg = itemOf(root.querySelector('#seg md-gb-list-item')!);
    expect(parseFloat(getComputedStyle(seg).borderTopLeftRadius)).toBeGreaterThan(0);
  });

  // spec: lists-4f110e
  it('static items are not buttons and cannot be selected', async () => {
    const root = await render(html`
      <md-gb-list selectable style="width: 360px">
        <md-gb-list-item static>Static</md-gb-list-item>
        <md-gb-list-item>Normal</md-gb-list-item>
      </md-gb-list>`);
    const [stat, normal] = Array.from(
      root.querySelectorAll<ListItemElement>('md-gb-list-item'),
    );
    expect(itemOf(stat).tagName).toBe('DIV');
    expect(itemOf(normal).tagName).toBe('BUTTON');
    stat.click();
    expect(stat.checked).toBeFalse();
  });

  // spec: lists-949b83
  it('a single-action item is one button covering the whole item', async () => {
    const root = await render(html`
      <md-gb-list style="width: 360px">
        <md-gb-list-item>Go</md-gb-list-item>
      </md-gb-list>`);
    const item = root.querySelector<ListItemElement>('md-gb-list-item')!;
    const click = jasmine.createSpy('click');
    item.addEventListener('click', click);
    const rect = item.getBoundingClientRect();
    const inner = itemOf(item).getBoundingClientRect();
    expect(inner.width).toBeCloseTo(rect.width, 0);
    expect(inner.height).toBeCloseTo(rect.height, 0);
    itemOf(item).click();
    expect(click).toHaveBeenCalledTimes(1);
  });

  // spec: lists-35b105
  it('activates the focused item with Enter and Space', async () => {
    const root = await render(html`
      <md-gb-list style="width: 360px">
        <md-gb-list-item>Go</md-gb-list-item>
      </md-gb-list>`);
    const item = root.querySelector<ListItemElement>('md-gb-list-item')!;
    const click = jasmine.createSpy('click');
    item.addEventListener('click', click);
    itemOf(item).focus();
    await sendKeys({press: 'Enter'});
    await sendKeys({press: 'Space'});
    expect(click).toHaveBeenCalledTimes(2);
  });

  // spec: lists-29c6da, lists-432818
  it('names an item by its label and supporting text', async () => {
    const root = await render(html`
      <md-gb-list style="width: 360px">
        <md-gb-list-item>Label text<span slot="supporting-text">Supporting text</span></md-gb-list-item>
      </md-gb-list>`);
    const item = root.querySelector<ListItemElement>('md-gb-list-item')!;
    const button = itemOf(item);
    // No aria-label override: the name comes from the slotted content.
    expect(button.hasAttribute('aria-label')).toBeFalse();
    const text = Array.from(button.querySelectorAll('slot'))
      .flatMap((s) => s.assignedNodes({flatten: true}))
      .map((n) => n.textContent)
      .join(' ');
    expect(text).toContain('Label text');
    expect(text).toContain('Supporting text');
  });

  // spec: lists-01d645, lists-df5b07
  it('wraps long label and supporting text instead of clipping it', async () => {
    const root = await render(html`
      <md-gb-list style="width: 200px">
        <md-gb-list-item>Short</md-gb-list-item>
        <md-gb-list-item>A very long label that cannot fit on a single line of this narrow list
          <span slot="supporting-text">An equally long supporting text that has to wrap onto further lines</span>
        </md-gb-list-item>
      </md-gb-list>`);
    const [short, long] = Array.from(
      root.querySelectorAll<ListItemElement>('md-gb-list-item'),
    );
    expect(long.getBoundingClientRect().height).toBeGreaterThan(
      short.getBoundingClientRect().height + 20,
    );
  });

  // spec: lists-5dd877
  it('sizes an item to its tallest element', async () => {
    const root = await render(html`
      <md-gb-list style="width: 360px">
        <md-gb-list-item>Image
          <div slot="leading" style="width: 40px; height: 120px"></div>
        </md-gb-list-item>
      </md-gb-list>`);
    const item = root.querySelector<ListItemElement>('md-gb-list-item')!;
    expect(item.getBoundingClientRect().height).toBeGreaterThanOrEqual(120);
  });

  // spec: lists-2fe2ee, lists-d1dfda, lists-ed923c, lists-0c0e89
  it('aligns leading visuals at the leading edge of every item', async () => {
    const root = await render(html`
      <md-gb-list style="width: 360px">
        <md-gb-list-item>Short<div slot="leading" class="v" style="width: 24px; height: 24px"></div></md-gb-list-item>
        <md-gb-list-item>A much longer label text<div slot="leading" class="v" style="width: 24px; height: 24px"></div></md-gb-list-item>
      </md-gb-list>`);
    const visuals = Array.from(root.querySelectorAll<HTMLElement>('.v'));
    const items = Array.from(
      root.querySelectorAll<ListItemElement>('md-gb-list-item'),
    );
    const xs = visuals.map((v) => v.getBoundingClientRect().left);
    expect(xs[0]).toBeCloseTo(xs[1], 0);
    const list = root.querySelector('md-gb-list')!.getBoundingClientRect();
    expect(xs[0] - list.left).toBeLessThan(40);
    const content = items[0]
      .shadowRoot!.querySelector('.list-item-content')!
      .getBoundingClientRect();
    expect(visuals[0].getBoundingClientRect().right).toBeLessThanOrEqual(
      content.left + 0.5,
    );
  });

  // spec: lists-0e3f83
  it('shows trailing text at the trailing end', async () => {
    const root = await render(html`
      <md-gb-list style="width: 360px">
        <md-gb-list-item>Price<span slot="trailing-text" class="t">$12</span></md-gb-list-item>
      </md-gb-list>`);
    const t = root.querySelector('.t')!.getBoundingClientRect();
    const item = root.querySelector('md-gb-list-item')!.getBoundingClientRect();
    expect(t.width).toBeGreaterThan(0);
    expect(item.right - t.right).toBeLessThan(item.width / 4);
  });

  // spec: lists-03639e
  it('applies the selected state to the entire list item', async () => {
    const root = await render(html`
      <md-gb-list style="width: 360px">
        <md-gb-list-item checked>On</md-gb-list-item>
        <md-gb-list-item>Off</md-gb-list-item>
      </md-gb-list>`);
    const [on, off] = Array.from(
      root.querySelectorAll<ListItemElement>('md-gb-list-item'),
    );
    const bg = (i: ListItemElement) =>
      getComputedStyle(itemOf(i)).backgroundColor;
    expect(bg(on)).not.toBe(bg(off));
    expect(itemOf(on).getBoundingClientRect().width).toBeCloseTo(
      on.getBoundingClientRect().width,
      0,
    );
  });

  // spec: lists-c6ee1e, lists-e11614
  it('lets a selectable list toggle several items on', async () => {
    const root = await render(html`
      <md-gb-list selectable style="width: 360px">
        <md-gb-list-item checked>A</md-gb-list-item>
        <md-gb-list-item>B</md-gb-list-item>
        <md-gb-list-item>C</md-gb-list-item>
      </md-gb-list>`);
    const list = root.querySelector<ListElement>('md-gb-list')!;
    const items = Array.from(list.children) as ListItemElement[];
    expect(list.selectionMode).toBeTrue();
    items[1].click();
    expect(items.map((i) => i.checked)).toEqual([true, true, false]);
  });
});
