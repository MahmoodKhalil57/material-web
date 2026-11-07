/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Button group overflow menu and fixed / flexible resizing.

// import 'jasmine'; (google3-only)

import '../button/md-gb-button.js';
import '../iconbutton/md-gb-icon-button.js';
import './md-gb-button-group.js';

import {sendKeys} from '@web/test-runner-commands';
import {html, render as litRender, type TemplateResult} from 'lit';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {until} from '../shared/central/subjects.js';
import {ButtonGroupElement} from './button-group-element.js';

adoptStyles(document, [m3Styles]);

// Real timers and frames: the menu focuses its first item in a timeout, which
// the Environment's mocked clock would hold back.
let container: HTMLElement;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});
afterEach(() => {
  litRender(html``, container);
  container.remove();
});

// Waits until the number of hidden elements stops changing: the first
// measures can run before the buttons are styled.
async function settle(root: Element) {
  let last = -1;
  let steady = 0;
  while (steady < 6) {
    const count = root.querySelectorAll('[hidden]').length;
    steady = count === last ? steady + 1 : 0;
    last = count;
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
}

async function render(template: TemplateResult) {
  litRender(template, container);
  const group = container.querySelector('md-gb-button-group') as ButtonGroupElement;
  await group.updateComplete;
  await until(() => group.getBoundingClientRect().width > 0);
  await settle(container);
  return group;
}

const labels = ['One', 'Two', 'Three', 'Four', 'Five', 'Six'];
const buttons = labels.map(
  (label) => html`<md-gb-button value=${label}>${label}</md-gb-button>`,
);
const hiddenOf = (group: Element) =>
  Array.from(group.querySelectorAll<HTMLElement>('md-gb-button')).filter(
    (b) => b.hidden,
  );
const menuOf = (group: Element) =>
  group.shadowRoot!.querySelector<HTMLElement>('.overflow-menu')!;
const triggerOf = (group: Element) =>
  group.shadowRoot!.querySelector<HTMLElement>('.overflow-trigger')!;
const width = (el: Element) => el.getBoundingClientRect().width;

describe('md-gb-button-group overflow menu', () => {
  const template = (boxWidth: string, attrs = html``) =>
    html`<div id="box" style="width: ${boxWidth}"
      ><md-gb-button-group overflow-menu>${buttons}</md-gb-button-group></div
    >`;

  // spec: button-groups-610620, button-groups-1c44fd, button-groups-555e59
  it('collapses the trailing buttons into a trailing overflow menu and brings them back', async () => {
    const group = await render(template('1000px'));
    expect(hiddenOf(group).length).toBe(0);
    // Nothing overflows: no trigger.
    expect(width(triggerOf(group))).toBe(0);

    const box = container.querySelector<HTMLElement>('#box')!;
    box.style.width = '260px';
    expect(await until(() => hiddenOf(group).length > 0)).toBeTrue();
    const hidden = hiddenOf(group);
    // The last buttons hide first; the first stays.
    expect((hidden[hidden.length - 1] as HTMLElement & {value: string}).value).toBe('Six');
    expect(group.querySelector<HTMLElement>('md-gb-button')!.hidden).toBeFalse();
    // The trigger sits at the trailing end, inside the box.
    const trigger = triggerOf(group).getBoundingClientRect();
    expect(trigger.width).toBeGreaterThan(0);
    const last = Array.from(group.querySelectorAll('md-gb-button'))
      .filter((b) => !b.hidden)
      .pop()!
      .getBoundingClientRect();
    expect(trigger.left).toBeGreaterThanOrEqual(last.right);
    expect(width(group)).toBeLessThanOrEqual(260.5);
    const hiddenAtSmall = hidden.length;

    box.style.width = '380px';
    expect(await until(() => hiddenOf(group).length < hiddenAtSmall)).toBeTrue();
    box.style.width = '1000px';
    expect(await until(() => hiddenOf(group).length === 0)).toBeTrue();
    expect(width(triggerOf(group))).toBe(0);
  });

  // spec: button-groups-555e59
  it('does nothing without overflow-menu', async () => {
    const group = await render(
      html`<div style="width: 260px"
        ><md-gb-button-group>${buttons}</md-gb-button-group></div
      >`,
    );
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(hiddenOf(group).length).toBe(0);
    expect(group.shadowRoot!.querySelector('.overflow-trigger')).toBeNull();
  });

  // spec: button-groups-610620
  it('lists the hidden buttons in the menu and clicks the original', async () => {
    const group = await render(template('260px'));
    expect(await until(() => hiddenOf(group).length > 0)).toBeTrue();
    await group.updateComplete;
    const hidden = hiddenOf(group);
    let clicks = 0;
    hidden[hidden.length - 1].addEventListener('click', () => clicks++);

    triggerOf(group).click();
    const menu = menuOf(group);
    expect(await until(() => menu.matches(':popover-open'))).toBeTrue();
    const entries = Array.from(menu.querySelectorAll<HTMLElement>('md-gb-menu-item'));
    expect(entries.map((e) => e.textContent!.trim())).toEqual(
      hidden.map((b) => b.textContent!.trim()),
    );
    entries[entries.length - 1].click();
    expect(clicks).toBe(1);
    expect(await until(() => !menu.matches(':popover-open'))).toBeTrue();
  });

  // spec: button-groups-610620
  it('reaches the hidden buttons from the keyboard', async () => {
    const group = await render(template('260px'));
    expect(await until(() => hiddenOf(group).length > 0)).toBeTrue();
    await group.updateComplete;
    const hidden = hiddenOf(group);
    let clicks = 0;
    hidden[0].addEventListener('click', () => clicks++);

    triggerOf(group).focus();
    await sendKeys({press: 'Enter'});
    const menu = menuOf(group);
    expect(await until(() => menu.matches(':popover-open'))).toBeTrue();
    expect(
      await until(() => menu.querySelector('md-gb-menu-item:focus-within')),
    ).toBeTruthy();
    await sendKeys({press: 'Enter'});
    expect(clicks).toBe(1);
    expect(await until(() => !menu.matches(':popover-open'))).toBeTrue();
  });

  // spec: button-groups-610620
  it('selects a hidden button of a single-select group from the menu', async () => {
    const group = await render(
      html`<div id="box" style="width: 260px"
        ><md-gb-button-group overflow-menu selection="single"
          >${buttons}</md-gb-button-group
        ></div
      >`,
    );
    expect(await until(() => hiddenOf(group).length > 0)).toBeTrue();
    await group.updateComplete;
    triggerOf(group).click();
    const menu = menuOf(group);
    expect(await until(() => menu.matches(':popover-open'))).toBeTrue();
    const entries = Array.from(menu.querySelectorAll<HTMLElement>('md-gb-menu-item'));
    entries[entries.length - 1].click();
    expect(group.value).toBe('Six');
  });

  // spec: button-groups-1c44fd
  it('accepts its own overflow button in the overflow slot', async () => {
    const group = await render(
      html`<div style="width: 260px"
        ><md-gb-button-group overflow-menu
          >${buttons}<md-gb-icon-button slot="overflow" aria-label="More"
            >m</md-gb-icon-button
          ></md-gb-button-group
        ></div
      >`,
    );
    expect(await until(() => hiddenOf(group).length > 0)).toBeTrue();
    const custom = group.querySelector<HTMLElement>('[slot=overflow]')!;
    expect(width(custom)).toBeGreaterThan(0);
    custom.click();
    expect(await until(() => menuOf(group).matches(':popover-open'))).toBeTrue();
  });
});

describe('md-gb-button-group resizing', () => {
  const box = (group: TemplateResult) =>
    html`<div style="width: 800px">${group}</div>`;

  // spec: button-groups-d66f7d, button-groups-52d3e1
  it('keeps the widths of a fixed group and fills the container with a flexible one', async () => {
    const fixed = await render(
      box(html`<md-gb-button-group resizing="fixed">${buttons}</md-gb-button-group>`),
    );
    const fixedWidth = width(fixed);
    const fixedButton = width(fixed.querySelector('md-gb-button')!);
    expect(fixedWidth).toBeLessThan(700);

    const flexible = await render(
      box(html`<md-gb-button-group resizing="flexible">${buttons}</md-gb-button-group>`),
    );
    expect(width(flexible)).toBeCloseTo(800, 0);
    expect(width(flexible.querySelector('md-gb-button')!)).toBeGreaterThan(fixedButton + 20);
  });

  // spec: button-groups-39104b
  it('grows the flexible buttons evenly as the container grows and shrinks them back', async () => {
    const group = await render(
      html`<div id="box" style="width: 600px"
        ><md-gb-button-group resizing="flexible">${buttons}</md-gb-button-group></div
      >`,
    );
    const first = group.querySelector('md-gb-button')!;
    const wide = width(first);
    const boxEl = container.querySelector<HTMLElement>('#box')!;
    boxEl.style.width = '1000px';
    expect(await until(() => width(first) > wide + 20)).toBeTrue();
    // Every button grew by the same amount (the same extra space).
    const grown = Array.from(group.querySelectorAll('md-gb-button')).map(width);
    for (const w of grown) expect(Math.abs(w - grown[0])).toBeLessThan(40);
    boxEl.style.width = '600px';
    expect(await until(() => Math.abs(width(first) - wide) < 1)).toBeTrue();
  });

  // spec: button-groups-d66f7d
  it('lets one button stay fixed in a flexible group, and one grow in a fixed group', async () => {
    const flexible = await render(
      box(html`<md-gb-button-group resizing="flexible"
        ><md-gb-button resizing="fixed">Fixed</md-gb-button
        ><md-gb-button>Grows</md-gb-button
        ><md-gb-button>Grows too</md-gb-button></md-gb-button-group
      >`),
    );
    const [fixedBtn, ...grows] = Array.from(flexible.querySelectorAll('md-gb-button'));
    expect(width(grows[0])).toBeGreaterThan(width(fixedBtn) + 100);

    const fixed = await render(
      html`<div style="width: 800px"
        ><md-gb-button-group
          style="inline-size: 100%"
          ><md-gb-button>Stays</md-gb-button
          ><md-gb-button resizing="flexible">Grows</md-gb-button></md-gb-button-group
        ></div
      >`,
    );
    const [stays, grew] = Array.from(fixed.querySelectorAll('md-gb-button'));
    expect(width(grew)).toBeGreaterThan(width(stays) + 100);
  });

  // spec: button-groups-52d3e1
  it('does not stretch icon buttons in a flexible group', async () => {
    const group = await render(
      box(html`<md-gb-button-group resizing="flexible"
        ><md-gb-icon-button aria-label="A">a</md-gb-icon-button
        ><md-gb-button>Label</md-gb-button
        ><md-gb-button>Label two</md-gb-button></md-gb-button-group
      >`),
    );
    const icon = group.querySelector('md-gb-icon-button')!;
    expect(width(icon)).toBeLessThan(80);
    expect(width(group.querySelector('md-gb-button')!)).toBeGreaterThan(150);
  });
});
