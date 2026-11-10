/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Toolbar overflow menu, flexible width and standard-scheme button color.

// import 'jasmine'; (google3-only)

import '../button/md-gb-button.js';
import '../iconbutton/md-gb-icon-button.js';
import './md-gb-toolbar.js';

import {sendKeys} from '@web/test-runner-commands';
import {html, render as litRender, type TemplateResult} from 'lit';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {until} from '../shared/central/subjects.js';

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

// A few frames, for checking that nothing changes.
async function frames(count: number) {
  for (let i = 0; i < count; i++) {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
}

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

async function renderToolbar(template: TemplateResult) {
  litRender(template, container);
  const toolbar = container.querySelector('md-gb-toolbar') as ToolbarElement;
  await toolbar.updateComplete;
  await until(() => toolbar.getBoundingClientRect().width > 0);
  await settle(container);
  return {root: container, toolbar};
}
import {ToolbarElement} from './toolbar-element.js';

adoptStyles(document, [m3Styles]);

function resolvedColor(token: string) {
  const probe = document.createElement('div');
  probe.style.color = `var(${token})`;
  document.body.appendChild(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return color;
}

const actions = (count: number) =>
  Array.from(
    {length: count},
    (_, i) =>
      html`<md-gb-icon-button slot="trailing" aria-label=${'Action ' + i}
        >${i}</md-gb-icon-button
      >`,
  );

describe('md-gb-toolbar overflow', () => {
  const render = renderToolbar;

  const trailing = (root: Element) =>
    Array.from(root.querySelectorAll<HTMLElement>('[slot=trailing]'));
  const hiddenOf = (root: Element) => trailing(root).filter((a) => a.hidden);
  const triggerOf = (root: Element) =>
    root.querySelector<HTMLElement>('[slot=overflow]')!;
  const menuOf = (toolbar: Element) =>
    toolbar.shadowRoot!.querySelector<HTMLElement>('.overflow-menu')!;
  const toolbarTemplate = (width: string, count = 12) =>
    html`<div id="box" style="width: ${width}"
      ><md-gb-toolbar
        >${actions(count)}<md-gb-icon-button
          slot="overflow"
          aria-label="More"
          >m</md-gb-icon-button
        ></md-gb-toolbar
      ></div
    >`;

  // spec: toolbars-2ba1d1, toolbars-f576ad, toolbars-830ef9
  it('moves the trailing actions that do not fit into an overflow slot', async () => {
    const {root} = await render(toolbarTemplate('240px'));
    expect(await until(() => hiddenOf(root).length > 0)).toBeTrue();
    expect(triggerOf(root).getBoundingClientRect().width).toBeGreaterThan(0);
    // The last actions hide first; the toolbar stays inside its window.
    const hidden = hiddenOf(root);
    expect(hidden[hidden.length - 1]).toBe(trailing(root)[11]);
    expect(trailing(root)[0].hidden).toBeFalse();
    const toolbar = root.querySelector('md-gb-toolbar')!;
    expect(toolbar.getBoundingClientRect().width).toBeLessThanOrEqual(240.5);
  });

  // spec: toolbars-830ef9, toolbars-8c6224, toolbars-2ba1d1
  it('shows more actions as the window grows and the menu again when it shrinks', async () => {
    const {root} = await render(toolbarTemplate('240px'));
    const box = root.querySelector<HTMLElement>('#box')!;
    await until(() => hiddenOf(root).length > 0);
    const small = hiddenOf(root).length;
    box.style.width = '420px';
    expect(await until(() => hiddenOf(root).length < small)).toBeTrue();
    box.style.width = '1000px';
    expect(await until(() => hiddenOf(root).length === 0)).toBeTrue();
    // Nothing overflows: the trigger leaves the layout.
    expect(triggerOf(root).getBoundingClientRect().width).toBe(0);
    box.style.width = '240px';
    expect(await until(() => hiddenOf(root).length === small)).toBeTrue();
    expect(triggerOf(root).getBoundingClientRect().width).toBeGreaterThan(0);
  });

  // spec: toolbars-b8c059
  it('caps the width of the toolbar to hide more actions', async () => {
    const {root, toolbar} = await render(toolbarTemplate('1000px', 6));
    await frames(3);
    expect(hiddenOf(root).length).toBe(0);
    toolbar.style.maxWidth = '200px';
    expect(await until(() => hiddenOf(root).length > 0)).toBeTrue();
    expect(toolbar.getBoundingClientRect().width).toBeLessThanOrEqual(200.5);
  });

  // spec: toolbars-f576ad, toolbars-2ba1d1
  it('lists the hidden actions in the menu and clicks the original', async () => {
    const {root, toolbar} = await render(toolbarTemplate('240px'));
    await until(() => hiddenOf(root).length > 0);
    await toolbar.updateComplete;
    const hidden = hiddenOf(root);
    const last = hidden[hidden.length - 1];
    let clicks = 0;
    last.addEventListener('click', () => clicks++);

    triggerOf(root).click();
    const menu = menuOf(toolbar);
    expect(await until(() => menu.matches(':popover-open'))).toBeTrue();
    const entries = Array.from(menu.querySelectorAll('md-gb-menu-item'));
    expect(entries.length).toBe(hidden.length);
    expect(entries.map((e) => e.textContent!.trim())).toEqual(
      hidden.map((h) => h.getAttribute('aria-label')),
    );
    (entries[entries.length - 1] as HTMLElement).click();
    expect(clicks).toBe(1);
    expect(await until(() => !menu.matches(':popover-open'))).toBeTrue();
  });

  // spec: toolbars-f576ad
  it('reaches the hidden actions from the keyboard', async () => {
    const {root, toolbar} = await render(toolbarTemplate('240px'));
    await until(() => hiddenOf(root).length > 0);
    await toolbar.updateComplete;
    const hidden = hiddenOf(root);
    let clicks = 0;
    hidden[0].addEventListener('click', () => clicks++);

    triggerOf(root).focus();
    await sendKeys({press: 'Enter'});
    const menu = menuOf(toolbar);
    expect(await until(() => menu.matches(':popover-open'))).toBeTrue();
    // The first item has focus; Enter chooses it.
    expect(
      await until(() => menu.querySelector('md-gb-menu-item:focus-within')),
    ).toBeTruthy();
    await sendKeys({press: 'Enter'});
    expect(clicks).toBe(1);
    expect(await until(() => !menu.matches(':popover-open'))).toBeTrue();
  });

  // spec: toolbars-f576ad
  it('opens the menu with the Down arrow on the trigger', async () => {
    const {root, toolbar} = await render(toolbarTemplate('240px'));
    await until(() => hiddenOf(root).length > 0);
    triggerOf(root).focus();
    await sendKeys({press: 'ArrowDown'});
    expect(
      await until(() => menuOf(toolbar).matches(':popover-open')),
    ).toBeTrue();
  });

  // spec: toolbars-2ba1d1
  it('keeps the arrow keys inside the visible controls', async () => {
    const {root} = await render(toolbarTemplate('240px'));
    await until(() => hiddenOf(root).length > 0);
    const visible = trailing(root).filter((a) => !a.hidden);
    visible[visible.length - 1].focus();
    await sendKeys({press: 'ArrowRight'});
    expect(document.activeElement).toBe(triggerOf(root));
  });

  // spec: toolbars-2ba1d1
  it('offers a default More actions button with overflow-menu', async () => {
    const {root, toolbar} = await render(
      html`<div style="width: 240px"
        ><md-gb-toolbar overflow-menu>${actions(12)}</md-gb-toolbar></div
      >`,
    );
    await until(() => hiddenOf(root).length > 0);
    const trigger =
      toolbar.shadowRoot!.querySelector<HTMLElement>('.overflow-trigger')!;
    expect(trigger.getAttribute('aria-label')).toBe('More actions');
    expect(trigger.getBoundingClientRect().width).toBeGreaterThan(0);
    trigger.click();
    expect(
      await until(() => menuOf(toolbar).matches(':popover-open')),
    ).toBeTrue();
  });

  it('leaves actions alone without an overflow trigger', async () => {
    const {root} = await render(
      html`<div style="width: 240px"
        ><md-gb-toolbar>${actions(12)}</md-gb-toolbar></div
      >`,
    );
    await frames(3);
    expect(hiddenOf(root).length).toBe(0);
  });

  it('does not touch actions the app hides itself', async () => {
    const {root} = await render(toolbarTemplate('1000px', 4));
    const mine = trailing(root)[1];
    mine.hidden = true;
    const box = root.querySelector<HTMLElement>('#box')!;
    box.style.width = '120px';
    // Overflow hid more than the action the app hid.
    expect(await until(() => hiddenOf(root).length > 1)).toBeTrue();
    box.style.width = '1000px';
    expect(await until(() => hiddenOf(root).length === 1)).toBeTrue();
    expect(hiddenOf(root)).toEqual([mine]);
  });
});

describe('md-gb-toolbar color and spacing', () => {
  let afterEachSheet: CSSStyleSheet | undefined;
  afterEach(() => {
    document.adoptedStyleSheets = document.adoptedStyleSheets.filter(
      (s) => s !== afterEachSheet,
    );
  });

  const render = renderToolbar;

  const iconColor = (el: Element) => {
    const part = el.shadowRoot!.querySelector<HTMLElement>('[part=icon-btn]')!;
    return getComputedStyle(part).color;
  };

  // Not cited: toolbars-9bc3d1 is excluded as contradicted (exclusions/components-other.md).
  // The tokens and the color figure use on-surface-variant; the page's list
  // says "(Primary)" (kept as the tokens have it, see scripts/m3/TODO.md).
  it('draws a standard icon button in on-surface-variant in the standard scheme', async () => {
    const {root} = await render(
      html`<md-gb-toolbar color="standard"
        ><md-gb-icon-button aria-label="Share">s</md-gb-icon-button></md-gb-toolbar
      >`,
    );
    document.getAnimations().forEach((a) => a.finish());
    expect(iconColor(root.querySelector('md-gb-icon-button')!)).toBe(
      resolvedColor('--md-sys-color-on-surface-variant'),
    );
  });

  // Not cited: toolbars-9bc3d1 is excluded as contradicted (exclusions/components-other.md).
  it('keeps on primary container for a standard button in the vibrant scheme', async () => {
    const {root} = await render(
      html`<md-gb-toolbar color="vibrant"
        ><md-gb-icon-button aria-label="Share">s</md-gb-icon-button></md-gb-toolbar
      >`,
    );
    document.getAnimations().forEach((a) => a.finish());
    expect(iconColor(root.querySelector('md-gb-icon-button')!)).toBe(
      resolvedColor('--md-sys-color-on-primary-container'),
    );
  });

  // spec: toolbars-298c6b
  it('centers a docked toolbar with 8dp between items', async () => {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(
      'md-gb-toolbar::part(toolbar) {--docked-container-min-spacing: 8px; --docked-container-max-spacing: 8px}',
    );
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
    afterEachSheet = sheet;
    const {root, toolbar} = await render(
      html`<div style="width: 600px"
        ><md-gb-toolbar
          docked
          ><md-gb-icon-button aria-label="A">a</md-gb-icon-button
          ><md-gb-icon-button aria-label="B">b</md-gb-icon-button
          ><md-gb-icon-button aria-label="C">c</md-gb-icon-button></md-gb-toolbar
        ></div
      >`,
    );
    const boxes = Array.from(root.querySelectorAll('md-gb-icon-button')).map(
      (el) => el.getBoundingClientRect(),
    );
    expect(boxes[1].left - boxes[0].right).toBeCloseTo(8, 0);
    expect(boxes[2].left - boxes[1].right).toBeCloseTo(8, 0);
    const bar = toolbar.getBoundingClientRect();
    expect(boxes[0].left - bar.left).toBeCloseTo(bar.right - boxes[2].right, 0);
    expect(boxes[0].left - bar.left).toBeGreaterThan(100);
  });
});
