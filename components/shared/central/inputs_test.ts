/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import '../../button/md-gb-button.js';
import '../../carousel/md-gb-carousel.js';
import '../../carousel/md-gb-carousel-item.js';
import '../../dialog/md-gb-dialog.js';
import '../../menu/md-gb-menu.js';
import '../../menu/md-gb-menu-item.js';
import '../../navdrawer/md-gb-nav-drawer.js';
import '../../navdrawer/md-gb-nav-drawer-item.js';
import '../../scaffold/md-gb-pane-scaffold.js';
import '../../card/md-gb-card.js';
import '../../sheet/md-gb-bottom-sheet.js';
import '../../tooltip/md-gb-tooltip.js';

import {sendKeys, sendMouse} from '@web/test-runner-commands';

import {
  center,
  deepActiveElement,
  deepElements,
  focusRingsOf,
  prop,
  renderSubject,
  ripplesOf,
  settle,
  SUBJECTS,
  type Subject,
  until,
} from './subjects.js';

// Foundations > Interaction > Inputs (foundations/interaction/inputs.md):
// mouse and cursor, mouse wheel and trackpad, and the physical keyboard. The
// parts of the page that are the browser's or the operating system's (the
// virtual keyboard, touch text-selection handles, trackpad pinch) are in
// `scripts/m3/exclusions/interaction-motion.md`.

const subject = (id: string): Subject => SUBJECTS.find((s) => s.id === id)!;

async function mount(html: string) {
  const container = document.createElement('div');
  container.style.cssText = 'padding:48px;position:relative';
  container.innerHTML = html;
  document.body.append(container);
  await settle(container);
  return {container, cleanup: () => container.remove()};
}

describe('mouse and cursor (central)', () => {
  afterEach(async () => {
    await sendMouse({type: 'up'}).catch(() => {});
    await sendMouse({type: 'move', position: [0, 0]});
    (document.activeElement as HTMLElement | null)?.blur();
  });

  // spec: interaction-inputs-bf0be0, interaction-inputs-1deba8, interaction-inputs-b307e1
  it('shows the same pressed feedback (the ripple) for a mouse click as for touch', async () => {
    const {el, cleanup} = await renderSubject(subject('button-filled'));
    const c = center(el);
    await sendMouse({type: 'move', position: [c.x, c.y]});
    await sendMouse({type: 'down'});
    const [ripple] = ripplesOf(el);
    await until(() => prop(ripple, '--ripple-press-opacity') === '10%');
    expect(prop(ripple, '--ripple-press-opacity')).toBe('10%');
    expect(ripple.getAnimations().map((a) => (a as CSSAnimation).animationName)).toContain('ripple-press');
    await sendMouse({type: 'up'});
    cleanup();
  });

  // spec: interaction-inputs-a92149, interaction-inputs-1e5a2c, interaction-inputs-e34d0b
  it('opens a context menu at the pointer on a secondary click (right click)', async () => {
    const {container, cleanup} = await mount(`
      <div id="target" style="inline-size:240px;block-size:120px">Target</div>
      <md-gb-menu context-for="target" aria-label="Actions">
        <md-gb-menu-item>Open</md-gb-menu-item>
        <md-gb-menu-item>Delete</md-gb-menu-item>
      </md-gb-menu>`);
    const target = container.querySelector('#target') as HTMLElement;
    const menu = container.querySelector('md-gb-menu') as HTMLElement;
    const r = target.getBoundingClientRect();
    const x = Math.round(r.left + 50);
    const y = Math.round(r.top + 40);
    await sendMouse({type: 'click', position: [x, y], button: 'right'});
    await until(() => menu.matches(':popover-open'));
    expect(menu.matches(':popover-open')).toBeTrue();
    const m = menu.getBoundingClientRect();
    expect(Math.abs(m.left - x)).toBeLessThanOrEqual(2);
    expect(Math.abs(m.top - y)).toBeLessThanOrEqual(2);
    cleanup();
  });

  // spec: interaction-inputs-aff92c
  it('shows a tooltip when the cursor hovers its anchor', async () => {
    const {container, cleanup} = await mount(`
      <md-gb-button id="anchor" color="text">Anchor</md-gb-button>
      <md-gb-tooltip for="anchor">Helpful text</md-gb-tooltip>`);
    const anchor = container.querySelector('#anchor') as HTMLElement;
    const tooltip = container.querySelector('md-gb-tooltip') as HTMLElement;
    expect(tooltip.matches(':popover-open')).toBeFalse();
    const c = center(anchor);
    await sendMouse({type: 'move', position: [c.x, c.y]});
    await until(() => tooltip.matches(':popover-open'));
    expect(tooltip.matches(':popover-open')).toBeTrue();
    cleanup();
  });

  // spec: interaction-inputs-b11d7f, interaction-inputs-5dd14d, interaction-inputs-791673
  it('shows the hand cursor over a link (a button with an href)', async () => {
    const {container, cleanup} = await mount(`<md-gb-button href="#target" color="text">Link</md-gb-button>`);
    const link = container.querySelector('md-gb-button') as HTMLElement;
    const cursors = deepElements(link).map((e) => getComputedStyle(e).cursor);
    expect(cursors).toContain('pointer');
    cleanup();
  });

  // spec: interaction-inputs-b11d7f, interaction-inputs-99299d, interaction-inputs-f5a162
  it('shows resize arrows over the drag handle that resizes panes', async () => {
    const {container, cleanup} = await mount(`<md-gb-pane-scaffold resizable style="width:1000px;height:300px"><div slot="secondary">List</div><div>Detail</div></md-gb-pane-scaffold>`);
    const scaffold = container.querySelector('md-gb-pane-scaffold') as HTMLElement;
    const handle = scaffold.shadowRoot!.querySelector('.drag-handle') as HTMLElement;
    expect(handle).not.toBeNull();
    expect(getComputedStyle(handle).cursor).toBe('col-resize');
    cleanup();
  });

  // spec: interaction-inputs-5163b4
  it('keeps the default pointer (arrow) over content that is not interactive', async () => {
    const {container, cleanup} = await mount(`<md-gb-card style="width:200px;height:80px"><span id="t">Plain card</span></md-gb-card>`);
    const card = container.querySelector('md-gb-card') as HTMLElement;
    for (const e of [card, ...deepElements(card)]) {
      expect(['auto', 'default']).toContain(getComputedStyle(e).cursor);
    }
    cleanup();
  });

  // spec: interaction-inputs-b11d7f, interaction-inputs-6804c7
  it('shows the I-beam cursor over editable text', async () => {
    const {el, cleanup} = await renderSubject(subject('text-field-filled'));
    const input = el.shadowRoot!.querySelector('input, textarea') as HTMLElement;
    expect(getComputedStyle(input).cursor).toBe('text');
    cleanup();
  });

  // spec: interaction-inputs-6484ef, interaction-inputs-a2529d, interaction-inputs-af88fe, interaction-inputs-4c8778, interaction-inputs-eae415
  it('selects and highlights text when dragging with the mouse', async () => {
    const {container, cleanup} = await mount(`<p id="text" style="font-size:20px;margin:0;width:max-content">Selectable sample text</p>
      <md-gb-card style="width:300px;height:80px" color="filled"><span id="cardtext">Card text sample</span></md-gb-card>`);
    for (const id of ['text', 'cardtext']) {
      const node = container.querySelector(`#${id}`) as HTMLElement;
      expect(getComputedStyle(node).userSelect).not.toBe('none');
      const r = node.getBoundingClientRect();
      const y = Math.round(r.top + r.height / 2);
      await sendMouse({type: 'move', position: [Math.round(r.left + 2), y]});
      await sendMouse({type: 'down'});
      await sendMouse({type: 'move', position: [Math.round(r.right - 2), y]});
      await sendMouse({type: 'up'});
      expect(window.getSelection()!.toString().length).withContext(id).toBeGreaterThan(3);
      window.getSelection()!.removeAllRanges();
    }
    // The highlight is the browser's single selection color.
    const sample = container.querySelector('#text') as HTMLElement;
    const style = getComputedStyle(sample, '::selection');
    expect(style.backgroundColor).not.toBe('');
    cleanup();
  });

  // spec: interaction-inputs-6484ef, interaction-inputs-af88fe
  it('selects text with a mouse drag inside a text field', async () => {
    const {el, cleanup} = await renderSubject(subject('text-field-filled'));
    (el as unknown as {value: string}).value = 'Hello selectable world';
    await settle(el);
    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
    const r = input.getBoundingClientRect();
    const y = Math.round(r.top + r.height / 2);
    await sendMouse({type: 'move', position: [Math.round(r.left + 2), y]});
    await sendMouse({type: 'down'});
    await sendMouse({type: 'move', position: [Math.round(r.left + 120), y]});
    await sendMouse({type: 'up'});
    expect((input.selectionEnd ?? 0) - (input.selectionStart ?? 0)).toBeGreaterThan(3);
    cleanup();
  });

  // spec: interaction-inputs-89fee9, interaction-inputs-de69da, interaction-inputs-7c4455
  it('scrolls a carousel horizontally with a scroll wheel or a two-finger trackpad gesture (an overflow scroller)', async () => {
    const {container, cleanup} = await mount(`<md-gb-carousel style="width:300px" aria-label="Pictures">
        ${Array.from({length: 8}, (_, i) => `<md-gb-carousel-item style="width:200px;height:100px" aria-label="Item ${i}"></md-gb-carousel-item>`).join('')}
      </md-gb-carousel>`);
    const carousel = container.querySelector('md-gb-carousel') as HTMLElement;
    const scrollers = () => [carousel, ...deepElements(carousel)].filter((e) => {
      const o = getComputedStyle(e).overflowX;
      return (o === 'auto' || o === 'scroll') && e.scrollWidth > e.clientWidth;
    });
    await until(() => scrollers().length > 0);
    expect(scrollers().length).toBeGreaterThan(0);
    const scroller = scrollers()[0];
    scroller.scrollLeft = 80;
    await until(() => scroller.scrollLeft > 0);
    expect(scroller.scrollLeft).toBeGreaterThan(0);
    cleanup();
  });
});

describe('physical keyboard (central)', () => {
  afterEach(async () => {
    (document.activeElement as HTMLElement | null)?.blur();
    await sendMouse({type: 'move', position: [0, 0]});
  });

  // spec: interaction-inputs-51a697, interaction-inputs-a55dc7
  it('keeps the focus order logical: no part forces a tabindex above 0', async () => {
    const offenders: string[] = [];
    for (const s of SUBJECTS) {
      const {el, container, cleanup} = await renderSubject(s);
      for (const e of [...deepElements(container), ...deepElements(el)]) {
        const index = e.getAttribute('tabindex');
        if (index !== null && Number(index) > 0) offenders.push(`${s.id}: ${e.localName}[tabindex=${index}]`);
      }
      cleanup();
    }
    expect(offenders).toEqual([]);
  });

  // spec: interaction-inputs-51a697, interaction-inputs-a55dc7, interaction-inputs-4d0f6c
  it('moves focus, with its visible focus indicator, left to right through a row of controls with Tab', async () => {
    const {container, cleanup} = await mount(`<div style="display:flex;gap:24px">
        <md-gb-button color="tonal">One</md-gb-button>
        <md-gb-button color="tonal">Two</md-gb-button>
        <md-gb-button color="tonal">Three</md-gb-button></div>`);
    const buttons = Array.from(container.querySelectorAll<HTMLElement>('md-gb-button'));
    const visibleRings = (el: HTMLElement) =>
      focusRingsOf(el).filter((r) => prop(r, '--focus-ring-outline') !== 'none').length;
    const order: number[] = [];
    const focusedButton = () => {
      const active = deepActiveElement();
      return buttons.findIndex((b) => b === active || b.shadowRoot?.contains(active));
    };
    await sendKeys({press: 'Tab'});
    for (let i = 0; i < 3; i++) {
      await until(() => focusedButton() === i);
      const index = focusedButton();
      order.push(index);
      expect(visibleRings(buttons[index])).toBeGreaterThan(0);
      await sendKeys({press: 'Tab'});
    }
    expect(order).toEqual([0, 1, 2]);
    cleanup();
  });

  // spec: interaction-inputs-98c5cc, interaction-inputs-2d5543
  describe('Escape dismisses visible modal elements', () => {
    it('a menu', async () => {
      const {container, cleanup} = await mount(`<md-gb-button id="a">Open</md-gb-button>
        <md-gb-menu aria-label="Menu"><md-gb-menu-item>One</md-gb-menu-item><md-gb-menu-item>Two</md-gb-menu-item></md-gb-menu>`);
      const menu = container.querySelector('md-gb-menu') as HTMLElement;
      menu.showPopover();
      await settle(container);
      expect(menu.matches(':popover-open')).toBeTrue();
      (menu.querySelector('md-gb-menu-item') as HTMLElement).focus();
      await sendKeys({press: 'Escape'});
      await until(() => !menu.matches(':popover-open'));
      expect(menu.matches(':popover-open')).toBeFalse();
      cleanup();
    });

    it('a dialog', async () => {
      const {container, cleanup} = await mount(`<md-gb-dialog quick open><span slot="headline">Title</span>Body<md-gb-button slot="actions" value="ok">OK</md-gb-button></md-gb-dialog>`);
      const dialog = container.querySelector('md-gb-dialog') as HTMLElement & {open: boolean};
      await settle(container);
      expect(dialog.open).toBeTrue();
      await sendKeys({press: 'Escape'});
      await until(() => !dialog.open);
      expect(dialog.open).toBeFalse();
      cleanup();
    });

    it('a modal bottom sheet', async () => {
      const {container, cleanup} = await mount(`<md-gb-bottom-sheet quick modal open aria-label="Sheet"><p>Content</p><md-gb-button>Action</md-gb-button></md-gb-bottom-sheet>`);
      const sheet = container.querySelector('md-gb-bottom-sheet') as HTMLElement & {open: boolean};
      await settle(container);
      expect(sheet.open).toBeTrue();
      await sendKeys({press: 'Escape'});
      await until(() => !sheet.open);
      expect(sheet.open).toBeFalse();
      cleanup();
    });

    it('a modal navigation drawer', async () => {
      const {container, cleanup} = await mount(`<md-gb-nav-drawer quick open modal aria-label="Mail"><md-gb-nav-drawer-item>Inbox</md-gb-nav-drawer-item></md-gb-nav-drawer>`);
      const drawer = container.querySelector('md-gb-nav-drawer') as HTMLElement & {open: boolean};
      await settle(container);
      expect(drawer.open).toBeTrue();
      await sendKeys({press: 'Escape'});
      await until(() => !drawer.open);
      expect(drawer.open).toBeFalse();
      cleanup();
    });
  });
});
