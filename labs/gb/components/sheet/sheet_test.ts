/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html, render} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';

import {
  BOTTOM_SHEET_CLASSES,
  BOTTOM_SHEET_STATES,
  bottomSheet,
  bottomSheetClasses,
} from './bottom-sheet.js';
import {type BottomSheetElement} from './bottom-sheet-element.js';
import './md-gb-bottom-sheet.js';
import './md-gb-side-sheet.js';
import {CLOSE_REASONS} from './sheet.js';
import {SIDE_SHEET_CLASSES, sideSheetClasses} from './side-sheet.js';
import {type SideSheetElement} from './side-sheet-element.js';

// System tokens (shape, elevation, motion) the sheet tokens reference.
adoptStyles(document, [m3Styles]);

function reasonOf(event: Event) {
  return (event as CustomEvent<{reason: string}>).detail.reason;
}

function dialogOf(sheet: HTMLElement) {
  const dialog = sheet.shadowRoot?.querySelector('dialog');
  if (!dialog) {
    throw new Error('Sheet has no <dialog>');
  }
  return dialog;
}

function panelOf(sheet: HTMLElement) {
  return sheet.shadowRoot!.querySelector<HTMLElement>('.sheet-panel')!;
}

function pointer(type: string, target: Element, y: number, init = {}) {
  target.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      composed: true,
      pointerId: 1,
      pointerType: 'touch',
      clientY: y,
      button: 0,
      ...init,
    }),
  );
}

describe('<md-gb-bottom-sheet>', () => {
  const env = new Environment();

  async function setupTest(
    template = html`<md-gb-bottom-sheet quick>
      <p>Sheet content</p>
    </md-gb-bottom-sheet>`,
  ) {
    const root = env.render(html`
      <div style="position: relative; block-size: 600px; inline-size: 400px">
        ${template}
      </div>
      <button id="trigger">Trigger</button>
    `);
    await env.waitForStability();
    const sheet = root.querySelector('md-gb-bottom-sheet');
    if (!sheet) {
      throw new Error('Failed to query rendered <md-gb-bottom-sheet>');
    }
    const trigger = root.querySelector<HTMLButtonElement>('#trigger')!;
    return {root, sheet, trigger};
  }

  function dragHandleOf(sheet: BottomSheetElement) {
    return sheet.shadowRoot!.querySelector<HTMLButtonElement>(
      '.bottom-sheet-drag-handle',
    );
  }

  describe('initial properties', () => {
    it('initializes with default values', async () => {
      const {sheet} = await setupTest();
      expect(sheet.open).toBeFalse();
      expect(sheet.modal).toBeFalse();
      expect(sheet.state).toBe(BOTTOM_SHEET_STATES.partiallyExpanded);
      expect(sheet.skipPartiallyExpanded).toBeFalse();
      expect(sheet.hideDragHandle).toBeFalse();
      expect(sheet.dragHandleLabel).toBe('Drag handle');
    });

    it('renders a closed dialog until opened', async () => {
      const {sheet} = await setupTest();
      expect(dialogOf(sheet).open).toBeFalse();
      expect(panelOf(sheet).offsetHeight).toBe(0);
    });
  });

  describe('show and close', () => {
    it('opens a non-modal dialog for a standard sheet', async () => {
      const {sheet} = await setupTest();
      await sheet.show();
      expect(sheet.open).toBeTrue();
      expect(sheet.hasAttribute('open')).toBeTrue();
      const dialog = dialogOf(sheet);
      expect(dialog.open).toBeTrue();
      expect(dialog.matches(':modal')).toBeFalse();
      expect(panelOf(sheet).offsetHeight).toBeGreaterThan(0);
    });

    it('does not take focus when a standard sheet opens', async () => {
      const {sheet, trigger} = await setupTest();
      trigger.focus();
      await sheet.show();
      expect(document.activeElement).toBe(trigger);
    });

    it('opens a modal dialog for a modal sheet', async () => {
      const {sheet} = await setupTest(
        html`<md-gb-bottom-sheet modal quick
          ><p>Content</p></md-gb-bottom-sheet
        >`,
      );
      await sheet.show();
      expect(dialogOf(sheet).matches(':modal')).toBeTrue();
      await sheet.close();
      expect(dialogOf(sheet).open).toBeFalse();
    });

    it('fires open, opened, close and closed events', async () => {
      const {sheet} = await setupTest();
      const events: string[] = [];
      for (const type of ['open', 'opened', 'close', 'closed']) {
        sheet.addEventListener(type, (e) => {
          events.push(e.type);
        });
      }
      await sheet.show();
      await sheet.close('custom');
      expect(events).toEqual(['open', 'opened', 'close', 'closed']);
    });

    it('passes the close reason in close and closed details', async () => {
      const {sheet} = await setupTest();
      await sheet.show();
      const reasons: string[] = [];
      sheet.addEventListener('close', (e) => reasons.push(reasonOf(e)));
      sheet.addEventListener('closed', (e) => reasons.push(reasonOf(e)));
      await sheet.close();
      expect(reasons).toEqual([CLOSE_REASONS.DISMISS, CLOSE_REASONS.DISMISS]);
    });

    it('opens and closes through the open property', async () => {
      const {sheet} = await setupTest();
      sheet.open = true;
      await env.waitForStability();
      expect(dialogOf(sheet).open).toBeTrue();
      const closed = new Promise((resolve) => {
        sheet.addEventListener('closed', resolve, {once: true});
      });
      sheet.open = false;
      await closed;
      expect(dialogOf(sheet).open).toBeFalse();
    });

    it('cancels show() when open is prevented', async () => {
      const {sheet} = await setupTest();
      sheet.addEventListener('open', (e) => {
        e.preventDefault();
      });
      await sheet.show();
      expect(sheet.open).toBeFalse();
    });

    it('stays open when close is prevented', async () => {
      const {sheet} = await setupTest();
      await sheet.show();
      sheet.addEventListener('close', (e) => {
        e.preventDefault();
      });
      await sheet.close();
      expect(sheet.open).toBeTrue();
    });

    it('waits for the closing motion before closing the dialog', async () => {
      const {sheet} = await setupTest(
        html`<md-gb-bottom-sheet modal><p>Content</p></md-gb-bottom-sheet>`,
      );
      await sheet.show();
      const closing = sheet.close();
      await sheet.updateComplete;
      expect(dialogOf(sheet).open)
        .withContext('dialog stays open while the sheet animates out')
        .toBeTrue();
      await closing;
      expect(dialogOf(sheet).open).toBeFalse();
    });
  });

  describe('modal dismissal', () => {
    it('closes on Escape (dialog cancel) with the escape reason', async () => {
      const {sheet} = await setupTest(
        html`<md-gb-bottom-sheet modal quick
          ><p>Content</p></md-gb-bottom-sheet
        >`,
      );
      await sheet.show();
      const closed = new Promise<string>((resolve) => {
        sheet.addEventListener('closed', (e) => {
          resolve(reasonOf(e));
        });
      });
      dialogOf(sheet).dispatchEvent(new Event('cancel', {cancelable: true}));
      expect(await closed).toBe(CLOSE_REASONS.ESCAPE);
      expect(sheet.open).toBeFalse();
    });

    it('closes when the scrim is clicked', async () => {
      const {sheet} = await setupTest(
        html`<md-gb-bottom-sheet modal quick
          ><p>Content</p></md-gb-bottom-sheet
        >`,
      );
      await sheet.show();
      let reason = '';
      sheet.addEventListener('close', (e) => {
        reason = reasonOf(e);
      });
      const dialog = dialogOf(sheet);
      pointer('pointerdown', dialog, 10);
      dialog.click();
      expect(reason).toBe(CLOSE_REASONS.SCRIM);
    });

    it('does not close when the sheet content is clicked', async () => {
      const {sheet} = await setupTest(
        html`<md-gb-bottom-sheet modal quick
          ><p>Content</p></md-gb-bottom-sheet
        >`,
      );
      await sheet.show();
      const content = sheet.querySelector('p')!;
      pointer('pointerdown', content, 10);
      content.click();
      expect(sheet.open).toBeTrue();
    });

    it('ignores Escape on a standard sheet', async () => {
      const {sheet} = await setupTest();
      await sheet.show();
      dialogOf(sheet).dispatchEvent(new Event('cancel', {cancelable: true}));
      expect(sheet.open).toBeTrue();
    });
  });

  describe('focus', () => {
    it('moves focus into a modal sheet and restores it on close', async () => {
      const {sheet, trigger} = await setupTest(
        html`<md-gb-bottom-sheet modal quick
          ><p>Content</p></md-gb-bottom-sheet
        >`,
      );
      trigger.focus();
      await sheet.show();
      expect(sheet.matches(':focus-within'))
        .withContext('focus is in the sheet')
        .toBeTrue();
      await sheet.close();
      expect(document.activeElement).toBe(trigger);
    });

    it('makes the page outside a modal sheet inert', async () => {
      const {sheet, trigger} = await setupTest(
        html`<md-gb-bottom-sheet modal quick
          ><p>Content</p></md-gb-bottom-sheet
        >`,
      );
      await sheet.show();
      trigger.focus();
      expect(document.activeElement).not.toBe(trigger);
    });
  });

  describe('accessibility', () => {
    it('labels the dialog', async () => {
      const {sheet} = await setupTest(
        html`<md-gb-bottom-sheet quick label="Share"></md-gb-bottom-sheet>`,
      );
      expect(dialogOf(sheet).getAttribute('aria-label')).toBe('Share');
    });

    it('renders the drag handle as a labeled button', async () => {
      const {sheet} = await setupTest();
      const handle = dragHandleOf(sheet)!;
      expect(handle.tagName).toBe('BUTTON');
      expect(handle.getAttribute('type')).toBe('button');
      expect(handle.getAttribute('aria-label')).toBe('Drag handle');
    });

    it('hides the drag handle with hide-drag-handle', async () => {
      const {sheet} = await setupTest(
        html`<md-gb-bottom-sheet quick hide-drag-handle></md-gb-bottom-sheet>`,
      );
      expect(dragHandleOf(sheet)).toBeNull();
    });
  });

  describe('heights', () => {
    const tall = html`<md-gb-bottom-sheet quick>
      <div style="block-size: 400px">Tall content</div>
    </md-gb-bottom-sheet>`;

    it('rests at the peek height when partially expanded', async () => {
      const {sheet} = await setupTest(tall);
      await sheet.show();
      const panel = panelOf(sheet);
      const dialog = dialogOf(sheet);
      const visible =
        dialog.getBoundingClientRect().bottom -
        panel.getBoundingClientRect().top;
      expect(visible).toBeCloseTo(56, 0);
    });

    it('rests fully visible when expanded', async () => {
      const {sheet} = await setupTest(tall);
      sheet.state = BOTTOM_SHEET_STATES.expanded;
      await sheet.show();
      const panel = panelOf(sheet);
      const dialog = dialogOf(sheet);
      expect(panel.getBoundingClientRect().bottom).toBeCloseTo(
        dialog.getBoundingClientRect().bottom,
        0,
      );
    });

    it('toggles heights with the drag handle and reports aria-expanded', async () => {
      const {sheet} = await setupTest(tall);
      await sheet.show();
      await sheet.updateComplete;
      const handle = dragHandleOf(sheet)!;
      expect(handle.getAttribute('aria-expanded')).toBe('false');
      const changes = jasmine.createSpy('state-change');
      sheet.addEventListener('state-change', changes);

      handle.click();
      await sheet.updateComplete;
      expect(sheet.state).toBe(BOTTOM_SHEET_STATES.expanded);
      expect(handle.getAttribute('aria-expanded')).toBe('true');

      handle.click();
      await sheet.updateComplete;
      expect(sheet.state).toBe(BOTTOM_SHEET_STATES.partiallyExpanded);
      expect(changes).toHaveBeenCalledTimes(2);
    });

    it('activates the drag handle from the keyboard (button semantics)', async () => {
      const {sheet} = await setupTest(tall);
      await sheet.show();
      const handle = dragHandleOf(sheet)!;
      handle.focus();
      expect(sheet.shadowRoot!.activeElement).toBe(handle);
      // Enter and Space activate a <button> through a click.
      handle.click();
      await sheet.updateComplete;
      expect(sheet.state).toBe(BOTTOM_SHEET_STATES.expanded);
    });

    it('closes from the drag handle without a lower height', async () => {
      const {sheet} = await setupTest(
        html`<md-gb-bottom-sheet quick skip-partially-expanded>
          <div style="block-size: 400px">Tall content</div>
        </md-gb-bottom-sheet>`,
      );
      await sheet.show();
      expect(sheet.state).toBe(BOTTOM_SHEET_STATES.expanded);
      let reason = '';
      sheet.addEventListener('close', (e) => {
        reason = reasonOf(e);
      });
      dragHandleOf(sheet)!.click();
      expect(reason).toBe(CLOSE_REASONS.DRAG_HANDLE);
    });

    it('expand() and partialExpand() set the state', async () => {
      const {sheet} = await setupTest(tall);
      await sheet.show();
      sheet.expand();
      expect(sheet.state).toBe(BOTTOM_SHEET_STATES.expanded);
      sheet.partialExpand();
      expect(sheet.state).toBe(BOTTOM_SHEET_STATES.partiallyExpanded);
    });
  });

  describe('dragging', () => {
    const tallModal = html`<md-gb-bottom-sheet modal quick state="expanded">
      <div style="block-size: 300px">Tall content</div>
    </md-gb-bottom-sheet>`;

    function dragArea(sheet: BottomSheetElement) {
      return sheet.shadowRoot!.querySelector('.bottom-sheet-drag-area')!;
    }

    it('follows the pointer while dragging', async () => {
      const {sheet} = await setupTest(tallModal);
      await sheet.show();
      const area = dragArea(sheet);
      const panel = panelOf(sheet);
      const top = panel.getBoundingClientRect().top;
      pointer('pointerdown', area, 100, {timeStamp: 0});
      pointer('pointermove', area, 140);
      await sheet.updateComplete;
      expect(panel.getBoundingClientRect().top).toBeCloseTo(top + 40, 0);
      pointer('pointercancel', area, 140);
      await sheet.updateComplete;
      expect(panel.getBoundingClientRect().top).toBeCloseTo(top, 0);
    });

    it('closes a modal sheet dragged down past its height', async () => {
      const {sheet} = await setupTest(tallModal);
      await sheet.show();
      const area = dragArea(sheet);
      const height = panelOf(sheet).offsetHeight;
      let reason = '';
      sheet.addEventListener('close', (e) => {
        reason = reasonOf(e);
      });
      pointer('pointerdown', area, 0);
      pointer('pointermove', area, height);
      pointer('pointerup', area, height);
      expect(reason).toBe(CLOSE_REASONS.SWIPE);
    });

    it('returns to its height after a short drag', async () => {
      const {sheet} = await setupTest(tallModal);
      await sheet.show();
      const area = dragArea(sheet);
      pointer('pointerdown', area, 100);
      pointer('pointermove', area, 120);
      // A later move without travel ends the drag at rest (no fling).
      pointer('pointermove', area, 120);
      pointer('pointerup', area, 120);
      await sheet.updateComplete;
      expect(sheet.open).toBeTrue();
      expect(sheet.state).toBe(BOTTOM_SHEET_STATES.expanded);
    });

    it('does not toggle the height on the click after a drag', async () => {
      const {sheet} = await setupTest(tallModal);
      await sheet.show();
      const area = dragArea(sheet);
      pointer('pointerdown', area, 100);
      pointer('pointermove', area, 104);
      pointer('pointermove', area, 115);
      pointer('pointerup', area, 115);
      const state = sheet.state;
      dragHandleOf(sheet)!.click();
      expect(sheet.state).toBe(state);
    });
  });

  describe('classes', () => {
    it('returns state classes', () => {
      expect(
        bottomSheetClasses({modal: true, open: true, state: 'expanded'}),
      ).toEqual(
        jasmine.objectContaining({
          [BOTTOM_SHEET_CLASSES.bottomSheet]: true,
          [BOTTOM_SHEET_CLASSES.modal]: true,
          [BOTTOM_SHEET_CLASSES.open]: true,
          [BOTTOM_SHEET_CLASSES.expanded]: true,
          [BOTTOM_SHEET_CLASSES.partiallyExpanded]: false,
        }),
      );
    });

    it('requests a close on Escape in a Light DOM modal sheet', async () => {
      const root = env.render(html`<div></div>`);
      const container = root.firstElementChild as HTMLElement;
      render(
        html`<div class="${bottomSheet({modal: true, open: true})}"></div>`,
        container,
      );
      const sheet = container.querySelector('div')!;
      expect(sheet.classList).toContain(BOTTOM_SHEET_CLASSES.modal);
      let reason = '';
      sheet.addEventListener('close', (e) => {
        reason = reasonOf(e);
      });
      sheet.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'Escape', cancelable: true}),
      );
      expect(reason).toBe(CLOSE_REASONS.ESCAPE);
    });
  });
});

describe('<md-gb-side-sheet>', () => {
  const env = new Environment();

  async function setupTest(
    template = html`<md-gb-side-sheet quick headline="Title">
      <p>Sheet content</p>
    </md-gb-side-sheet>`,
    dir = 'ltr',
  ) {
    const root = env.render(html`
      <div
        dir=${dir}
        style="display: flex; block-size: 400px; inline-size: 800px"
      >
        <main style="flex: 1">Main</main>
        ${template}
      </div>
      <button id="trigger">Trigger</button>
    `);
    await env.waitForStability();
    const sheet = root.querySelector('md-gb-side-sheet');
    if (!sheet) {
      throw new Error('Failed to query rendered <md-gb-side-sheet>');
    }
    const trigger = root.querySelector<HTMLButtonElement>('#trigger')!;
    const main = root.querySelector('main')!;
    return {root, sheet, trigger, main};
  }

  function closeButtonOf(sheet: SideSheetElement) {
    return sheet.shadowRoot!.querySelector<HTMLButtonElement>(
      '.side-sheet-close',
    );
  }

  function backButtonOf(sheet: SideSheetElement) {
    return sheet.shadowRoot!.querySelector<HTMLButtonElement>(
      '.side-sheet-back',
    );
  }

  describe('initial properties', () => {
    it('initializes with default values', async () => {
      const {sheet} = await setupTest();
      expect(sheet.open).toBeFalse();
      expect(sheet.modal).toBeFalse();
      expect(sheet.detached).toBeFalse();
      expect(sheet.divider).toBeFalse();
      expect(sheet.hasBackButton).toBeFalse();
      expect(sheet.hideCloseButton).toBeFalse();
      expect(sheet.closeLabel).toBe('Close');
      expect(sheet.backLabel).toBe('Back');
    });

    it('takes no inline space while closed', async () => {
      const {sheet} = await setupTest();
      expect(sheet.getBoundingClientRect().width).toBe(0);
    });
  });

  describe('standard', () => {
    it('reserves the sheet width while open', async () => {
      const {sheet, main} = await setupTest();
      await sheet.show();
      expect(sheet.getBoundingClientRect().width).toBe(256);
      expect(main.getBoundingClientRect().width).toBe(800 - 256);
      expect(dialogOf(sheet).matches(':modal')).toBeFalse();
      await sheet.close();
      expect(sheet.getBoundingClientRect().width).toBe(0);
    });

    it('adds the detached margins to the reserved width', async () => {
      const {sheet} = await setupTest(
        html`<md-gb-side-sheet
          quick
          detached
          headline="Title"
        ></md-gb-side-sheet>`,
      );
      await sheet.show();
      expect(sheet.getBoundingClientRect().width).toBe(256 + 32);
      const panel = panelOf(sheet);
      expect(getComputedStyle(panel).borderTopLeftRadius).not.toBe('0px');
    });
  });

  describe('modal', () => {
    it('opens a modal dialog at the inline end of the window', async () => {
      const {sheet} = await setupTest(
        html`<md-gb-side-sheet
          modal
          quick
          headline="Title"
        ></md-gb-side-sheet>`,
      );
      await sheet.show();
      expect(dialogOf(sheet).matches(':modal')).toBeTrue();
      const rect = panelOf(sheet).getBoundingClientRect();
      expect(rect.right).toBeCloseTo(document.documentElement.clientWidth, 0);
      expect(rect.height).toBeCloseTo(window.innerHeight, 0);
    });

    it('opens at the left edge in RTL', async () => {
      const {sheet} = await setupTest(
        html`<md-gb-side-sheet
          modal
          quick
          headline="Title"
        ></md-gb-side-sheet>`,
        'rtl',
      );
      await sheet.show();
      expect(panelOf(sheet).getBoundingClientRect().left).toBeCloseTo(0, 0);
    });

    it('closes on Escape and on the scrim', async () => {
      const {sheet} = await setupTest(
        html`<md-gb-side-sheet
          modal
          quick
          headline="Title"
        ></md-gb-side-sheet>`,
      );
      const reasons: string[] = [];
      sheet.addEventListener('close', (e) => reasons.push(reasonOf(e)));
      await sheet.show();
      const closed = new Promise((resolve) => {
        sheet.addEventListener('closed', resolve, {once: true});
      });
      dialogOf(sheet).dispatchEvent(new Event('cancel', {cancelable: true}));
      await closed;
      await sheet.show();
      const dialog = dialogOf(sheet);
      pointer('pointerdown', dialog, 10);
      dialog.click();
      expect(reasons).toEqual([CLOSE_REASONS.ESCAPE, CLOSE_REASONS.SCRIM]);
    });

    it('traps focus and restores it on close', async () => {
      const {sheet, trigger} = await setupTest(
        html`<md-gb-side-sheet
          modal
          quick
          headline="Title"
        ></md-gb-side-sheet>`,
      );
      trigger.focus();
      await sheet.show();
      expect(sheet.matches(':focus-within')).toBeTrue();
      trigger.focus();
      expect(document.activeElement).not.toBe(trigger);
      await sheet.close();
      expect(document.activeElement).toBe(trigger);
    });
  });

  describe('header', () => {
    it('closes from the close button', async () => {
      const {sheet} = await setupTest();
      await sheet.show();
      let reason = '';
      sheet.addEventListener('close', (e) => {
        reason = reasonOf(e);
      });
      const close = closeButtonOf(sheet)!;
      expect(close.getAttribute('aria-label')).toBe('Close');
      close.click();
      expect(reason).toBe(CLOSE_REASONS.CLOSE_BUTTON);
    });

    it('hides the close button with hide-close-button', async () => {
      const {sheet} = await setupTest(
        html`<md-gb-side-sheet quick hide-close-button></md-gb-side-sheet>`,
      );
      expect(closeButtonOf(sheet)).toBeNull();
    });

    it('fires back from the back button', async () => {
      const {sheet} = await setupTest(
        html`<md-gb-side-sheet quick has-back-button></md-gb-side-sheet>`,
      );
      await sheet.show();
      const back = backButtonOf(sheet)!;
      expect(back.getAttribute('aria-label')).toBe('Back');
      const spy = jasmine.createSpy('back');
      sheet.addEventListener('back', spy);
      back.click();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(sheet.open).toBeTrue();
    });

    it('renders no back button by default', async () => {
      const {sheet} = await setupTest();
      expect(backButtonOf(sheet)).toBeNull();
    });
  });

  describe('swipe to dismiss', () => {
    /** A touch pointer event at `x` with a given `timeStamp` (ms). */
    function swipePointer(type: string, target: Element, x: number, time: number) {
      const event = new PointerEvent(type, {
        bubbles: true,
        composed: true,
        cancelable: true,
        pointerId: 1,
        pointerType: 'touch',
        isPrimary: true,
        clientX: x,
        clientY: 100,
      });
      Object.defineProperty(event, 'timeStamp', {value: time});
      target.dispatchEvent(event);
    }

    async function drag(
      target: Element,
      points: Array<[x: number, time: number]>,
      release = true,
    ) {
      const [[x0, t0], ...moves] = points;
      swipePointer('pointerdown', target, x0, t0);
      for (const [x, t] of release ? moves.slice(0, -1) : moves) {
        swipePointer('pointermove', target, x, t);
      }
      await env.waitForStability();
      if (release) {
        const [x, t] = moves[moves.length - 1];
        swipePointer('pointerup', target, x, t);
        await env.waitForStability();
      }
    }

    async function setupModal(attrs = '', dir = 'ltr') {
      const {sheet} = await setupTest(
        html`<md-gb-side-sheet modal quick headline="Title"></md-gb-side-sheet>`,
        dir,
      );
      if (attrs) sheet.setAttribute(attrs, '');
      await sheet.show();
      await env.waitForStability();
      return {sheet, panel: panelOf(sheet), width: panelOf(sheet).offsetWidth};
    }

    function translateX(panel: HTMLElement) {
      const match = panel.style.transform.match(/translateX\((-?[\d.]+)px\)/);
      return match ? Number(match[1]) : null;
    }

    it('makes the sheet follow a drag toward its edge', async () => {
      const {sheet, panel} = await setupModal();
      await drag(panel, [[600, 0], [650, 100], [700, 200]], false);
      expect(dialogOf(sheet).classList).toContain(SIDE_SHEET_CLASSES.dragging);
      expect(translateX(panel)).toBe(100);
      // Dragging away from the edge does not move the sheet past open.
      swipePointer('pointermove', panel, 400, 300);
      await env.waitForStability();
      expect(translateX(panel)).toBe(0);
      swipePointer('pointercancel', panel, 400, 400);
      await env.waitForStability();
      expect(translateX(panel)).toBeNull();
      expect(sheet.open).toBeTrue();
    });

    it('closes with reason swipe when released past half its width', async () => {
      const {sheet, panel, width} = await setupModal();
      const reasons: string[] = [];
      sheet.addEventListener('close', (e) => reasons.push(reasonOf(e)));
      const end = 500 + width / 2 + 10;
      await drag(panel, [[500, 0], [550, 500], [end, 1000], [end, 2000]]);
      expect(sheet.open).toBeFalse();
      expect(reasons).toEqual([CLOSE_REASONS.SWIPE]);
      expect(translateX(panel)).toBeNull();
    });

    it('springs back open when released before half its width', async () => {
      const {sheet, panel} = await setupModal();
      await drag(panel, [[500, 0], [530, 500], [540, 1000], [540, 2000]]);
      expect(sheet.open).toBeTrue();
      expect(translateX(panel)).toBeNull();
    });

    it('closes on a fast fling', async () => {
      const {sheet, panel} = await setupModal();
      await drag(panel, [[500, 0], [520, 10], [540, 20], [560, 30]]);
      expect(sheet.open).toBeFalse();
    });

    it('swipes toward the left edge in RTL', async () => {
      const {sheet, panel, width} = await setupModal('', 'rtl');
      const end = 300 - width / 2 - 10;
      await drag(panel, [[300, 0], [250, 500], [end, 1000], [end, 2000]]);
      expect(sheet.open).toBeFalse();
    });

    it('does not swipe with gestures-disabled', async () => {
      const {sheet, panel, width} = await setupModal('gestures-disabled');
      await sheet.updateComplete;
      const end = 500 + width;
      await drag(panel, [[500, 0], [550, 500], [end, 1000], [end, 2000]]);
      expect(sheet.open).toBeTrue();
    });
  });

  describe('accessibility', () => {
    it('is a dialog labelled by its headline', async () => {
      const {sheet} = await setupTest();
      const dialog = dialogOf(sheet);
      expect(dialog.getAttribute('aria-labelledby')).toBe('headline');
      const headline = sheet.shadowRoot!.getElementById('headline')!;
      expect(headline.textContent?.trim()).toBe('Title');
    });

    it('uses label without a headline', async () => {
      const {sheet} = await setupTest(
        html`<md-gb-side-sheet quick label="Filters"></md-gb-side-sheet>`,
      );
      const dialog = dialogOf(sheet);
      expect(dialog.hasAttribute('aria-labelledby')).toBeFalse();
      expect(dialog.getAttribute('aria-label')).toBe('Filters');
    });

    it('uses a slotted headline', async () => {
      const {sheet} = await setupTest(
        html`<md-gb-side-sheet quick label="Ignored"
          ><span slot="headline">Slotted</span></md-gb-side-sheet
        >`,
      );
      await sheet.updateComplete;
      expect(dialogOf(sheet).getAttribute('aria-labelledby')).toBe('headline');
    });
  });

  describe('actions', () => {
    it('hides the actions row when empty', async () => {
      const {sheet} = await setupTest();
      await sheet.show();
      const actions = sheet.shadowRoot!.querySelector<HTMLElement>(
        '.side-sheet-actions',
      )!;
      expect(getComputedStyle(actions).display).toBe('none');
    });

    it('shows slotted actions', async () => {
      const {sheet} = await setupTest(
        html`<md-gb-side-sheet quick headline="Title">
          <button slot="actions">Save</button>
        </md-gb-side-sheet>`,
      );
      await sheet.show();
      await env.waitForStability();
      const actions = sheet.shadowRoot!.querySelector<HTMLElement>(
        '.side-sheet-actions',
      )!;
      expect(getComputedStyle(actions).display).toBe('flex');
    });
  });

  describe('classes', () => {
    it('returns variant classes', () => {
      expect(
        sideSheetClasses({modal: true, detached: true, root: false}),
      ).toEqual(
        jasmine.objectContaining({
          [SIDE_SHEET_CLASSES.sideSheet]: false,
          [SIDE_SHEET_CLASSES.modal]: true,
          [SIDE_SHEET_CLASSES.detached]: true,
        }),
      );
    });
  });
});
