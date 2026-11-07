/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Tests for spec units that were tracked as gaps and are now built.

// import 'jasmine'; (google3-only)
import '../button/md-gb-button.js';
import './md-gb-dialog.js';

import {sendKeys} from '@web/test-runner-commands';
import {html, type TemplateResult} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {DialogElement} from './dialog-element.js';

adoptStyles(document, [m3Styles]);

function inner(el: DialogElement) {
  return el.shadowRoot!.querySelector<HTMLDialogElement>('dialog')!;
}

function part(el: DialogElement, selector: string) {
  return el.shadowRoot!.querySelector<HTMLElement>(selector)!;
}

function resolvedColor(token: string) {
  const probe = document.createElement('div');
  probe.style.color = `var(${token})`;
  document.body.appendChild(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return color;
}

describe('md-gb-dialog tracked spec units', () => {
  const env = new Environment();

  async function render(template: TemplateResult) {
    const root = env.render(template);
    await env.waitForStability();
    const els = Array.from(root.querySelectorAll('md-gb-dialog')) as DialogElement[];
    for (const el of els) await el.updateComplete;
    return {root, el: els[0], els};
  }

  const basic = html`<md-gb-dialog quick>
    <span slot="headline">Reset settings?</span>
    This will reset your app preferences.
    <md-gb-button slot="actions" id="dismiss" value="cancel">Cancel</md-gb-button>
    <md-gb-button slot="actions" id="confirm" value="accept">Accept</md-gb-button>
  </md-gb-dialog>`;

  const fullScreen = html`<md-gb-dialog quick full-screen>
    <span slot="headline">New event</span>
    Supporting content
    <md-gb-button slot="actions" value="save">Save</md-gb-button>
  </md-gb-dialog>`;

  afterEach(() => {
    for (const el of document.querySelectorAll('md-gb-dialog')) {
      inner(el).close();
    }
  });

  describe('container and scrim', () => {
    // spec: dialogs-da4b02, dialogs-28ee64, dialogs-50b981
    it('shows a container in the top layer above a scrim, holding the headline, text and buttons', async () => {
      const {el} = await render(basic);
      await el.show();
      const dialog = inner(el);
      expect(dialog.matches(':modal')).toBeTrue();
      expect(getComputedStyle(dialog, '::backdrop').backgroundColor).toBe(
        resolvedColor('--md-sys-color-scrim'),
      );
      const box = dialog.getBoundingClientRect();
      const contained = (node: Element) => {
        const rect = node.getBoundingClientRect();
        return rect.left >= box.left && rect.right <= box.right && rect.top >= box.top && rect.bottom <= box.bottom;
      };
      expect(contained(part(el, '.dialog-headline'))).toBeTrue();
      expect(contained(part(el, '.dialog-content'))).toBeTrue();
      expect(contained(el.querySelector('md-gb-button')!)).toBeTrue();
    });
  });

  // spec: dialogs-44efcd
  it('wraps a long headline to a second line', async () => {
    const {el} = await render(html`<md-gb-dialog quick>
      <span slot="headline">A headline that is long enough that it has to wrap onto a second line of the dialog</span>
      Body
    </md-gb-dialog>`);
    await el.show();
    const headline = part(el, '.dialog-headline');
    const lineHeight = parseFloat(getComputedStyle(headline).lineHeight);
    expect(headline.getBoundingClientRect().height).toBeGreaterThan(lineHeight * 1.5);
  });

  describe('actions', () => {
    // spec: dialogs-8e0e1b, dialogs-26f35e
    it('holds text buttons next to one another', async () => {
      const {el} = await render(basic);
      await el.show();
      const [first, second] = Array.from(el.querySelectorAll('md-gb-button')).map((b) => b.getBoundingClientRect());
      expect(Math.abs(first.top - second.top)).toBeLessThan(1);
      expect(second.left).toBeGreaterThan(first.right);
    });

    // spec: dialogs-f1070f, dialogs-b356f0
    it('aligns the buttons to the trailing edge with the confirming action closest to it', async () => {
      const {el} = await render(basic);
      await el.show();
      const actions = part(el, '.dialog-actions').getBoundingClientRect();
      const dismiss = el.querySelector('#dismiss')!.getBoundingClientRect();
      const confirm = el.querySelector('#confirm')!.getBoundingClientRect();
      expect(actions.right - confirm.right).toBeLessThan(25);
      expect(confirm.left).toBeGreaterThan(dismiss.left);
    });

    // spec: dialogs-43e962
    it('mirrors the alignment in right-to-left languages', async () => {
      const {el} = await render(html`<div dir="rtl">${basic}</div>`);
      await el.show();
      const actions = part(el, '.dialog-actions').getBoundingClientRect();
      const confirm = el.querySelector('#confirm')!.getBoundingClientRect();
      const dismiss = el.querySelector('#dismiss')!.getBoundingClientRect();
      expect(confirm.left - actions.left).toBeLessThan(25);
      expect(confirm.left).toBeLessThan(dismiss.left);
    });

    // spec: dialogs-db459d
    it('stacks the confirming action above the dismissive action when they do not fit', async () => {
      const {el} = await render(html`<md-gb-dialog quick style="--max-width: 280px; --min-width: 280px">
        <span slot="headline">Title</span>
        Body
        <md-gb-button slot="actions" id="dismiss">A very long dismissive action label</md-gb-button>
        <md-gb-button slot="actions" id="confirm">A very long confirming action label</md-gb-button>
      </md-gb-dialog>`);
      await el.show();
      const dismiss = el.querySelector('#dismiss')!.getBoundingClientRect();
      const confirm = el.querySelector('#confirm')!.getBoundingClientRect();
      expect(confirm.top).toBeLessThan(dismiss.top);
    });

    // spec: dialogs-5e0abb
    it('triggers the focused action with Space or Enter', async () => {
      const {el} = await render(basic);
      await el.show();
      const confirm = el.querySelector<HTMLElement>('#confirm')!;
      let clicks = 0;
      confirm.addEventListener('click', () => clicks++);
      confirm.focus();
      await sendKeys({press: 'Enter'});
      expect(clicks).toBe(1);
      await el.show();
      confirm.focus();
      await sendKeys({press: 'Space'});
      expect(clicks).toBe(2);
    });
  });

  describe('full-screen dialog', () => {
    // spec: dialogs-b3e9e3
    it('has the close icon button as its only navigation option in the header', async () => {
      const {el} = await render(fullScreen);
      await el.show();
      const header = part(el, '.dialog-header');
      const close = header.querySelectorAll('.dialog-close');
      expect(close.length).toBe(1);
      // Navigation sits before the headline; nothing else precedes it.
      const nav = Array.from(header.children).filter(
        (child) =>
          getComputedStyle(child).display !== 'none' &&
          child.compareDocumentPosition(part(el, '.dialog-headline')) & Node.DOCUMENT_POSITION_FOLLOWING,
      );
      expect(nav.map((n) => n.className)).toEqual([jasmine.stringContaining('dialog-close')]);
    });

    // spec: dialogs-213583
    it('closes with the close icon', async () => {
      const {el} = await render(fullScreen);
      await el.show();
      let closed = 0;
      el.addEventListener('close', () => closed++);
      part(el, '.dialog-close').click();
      await env.waitForStability();
      expect(inner(el).open).toBeFalse();
      expect(closed).toBe(1);
    });

    // spec: dialogs-7318f7, dialogs-65b312, dialogs-89da2d, dialogs-15cc4a, dialogs-4f2b54
    it('lets a basic dialog confirm the discard in front of a full-screen dialog being dismissed', async () => {
      const {els} = await render(html`${fullScreen}${basic}`);
      const [full, confirm] = els;
      await full.show();
      // Dismissing the full-screen dialog is cancelable, so the app can ask.
      full.addEventListener('cancel', (event) => {
        event.preventDefault();
        void confirm.show();
      });
      part(full, '.dialog-close').click();
      await env.waitForStability();
      expect(inner(full).open).toBeTrue();
      expect(inner(confirm).open).toBeTrue();
      expect(inner(confirm).matches(':modal')).toBeTrue();
      // The basic dialog sits above the full-screen dialog.
      const box = inner(confirm).getBoundingClientRect();
      const topmost = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
      expect(topmost).toBe(confirm);
    });
  });

  // spec: dialogs-65b536, dialogs-c8d91d, dialogs-005089
  it('swaps between the full-screen and basic variants as the layout changes', async () => {
    const {el} = await render(fullScreen);
    await el.show();
    expect(inner(el).getBoundingClientRect().height).toBe(window.innerHeight);
    el.fullScreen = false;
    await el.updateComplete;
    expect(inner(el).getBoundingClientRect().height).toBeLessThan(window.innerHeight);
    el.fullScreen = true;
    await el.updateComplete;
    expect(inner(el).getBoundingClientRect().height).toBe(window.innerHeight);
  });

  // spec: dialogs-8ebfe6, dialogs-494724
  it('lets the app override the position of a basic dialog', async () => {
    const {el} = await render(html`<md-gb-dialog quick style="--md-gb-dialog-test: 1">
      <span slot="headline">Title</span>
      Body
    </md-gb-dialog>`);
    const sheet = new CSSStyleSheet();
    sheet.replaceSync('dialog { margin-inline: auto 56px; }');
    el.shadowRoot!.adoptedStyleSheets = [...el.shadowRoot!.adoptedStyleSheets, sheet];
    await el.show();
    const box = inner(el).getBoundingClientRect();
    expect(window.innerWidth - box.right).toBeCloseTo(56, 0);
    expect(box.left).toBeGreaterThanOrEqual(56);
  });
});
