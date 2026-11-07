/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';

import './md-gb-tooltip.js';
import {
  computeTooltipPosition,
  setupTooltip,
  TOOLTIP_CLASSES,
  TOOLTIP_HIDE_DELAY_MS,
  TOOLTIP_LONG_PRESS_MS,
  tooltipClasses,
} from './tooltip.js';
import {type TooltipElement} from './tooltip-element.js';
import tooltipStyles from './tooltip.cssresult.js';

// The Environment installs the Jasmine clock for the whole suite.
adoptStyles(document, tooltipStyles);

function pointer(type: string, pointerType = 'mouse', init: PointerEventInit = {}) {
  return new PointerEvent(type, {
    pointerType,
    bubbles: type !== 'pointerenter' && type !== 'pointerleave',
    composed: true,
    ...init,
  });
}

function isOpen(tooltip: TooltipElement) {
  return tooltip.matches(':popover-open');
}

describe('<md-gb-tooltip>', () => {
  const env = new Environment();

  async function setupTest(
    template = html`
      <div style="padding: 120px">
        <button id="anchor">Anchor</button>
        <md-gb-tooltip for="anchor" quick>Plain tooltip</md-gb-tooltip>
      </div>
    `,
  ) {
    const root = env.render(template);
    await env.waitForStability();
    const tooltip = root.querySelector('md-gb-tooltip')!;
    const anchor = root.querySelector<HTMLElement>('#anchor')!;
    await tooltip.updateComplete;
    return {root, tooltip, anchor};
  }

  afterEach(() => {
    for (const tooltip of document.querySelectorAll('md-gb-tooltip')) {
      tooltip.hide();
    }
  });

  describe('properties', () => {
    it('initializes with default values', async () => {
      const {tooltip} = await setupTest();
      expect(tooltip.variant).toBe('plain');
      expect(tooltip.open).toBeFalse();
      expect(tooltip.persistent).toBeFalse();
      expect(tooltip.caret).toBeFalse();
      expect(tooltip.placement).toBe('');
      expect(tooltip.showDelay).toBe(0);
      expect(tooltip.hideDelay).toBe(TOOLTIP_HIDE_DELAY_MS);
      expect(TOOLTIP_HIDE_DELAY_MS).toBe(1500);
    });

    it('resolves the anchor from `for`', async () => {
      const {tooltip, anchor} = await setupTest();
      expect(tooltip.anchorElement).toBe(anchor);
    });

    it('accepts an anchor element directly', async () => {
      const {tooltip, root} = await setupTest(html`
        <button class="other">Other</button>
        <md-gb-tooltip quick>Tip</md-gb-tooltip>
      `);
      const other = root.querySelector<HTMLElement>('.other')!;
      tooltip.anchorElement = other;
      expect(tooltip.anchorElement).toBe(other);
      expect(other.getAttribute('aria-describedby')).toBe(tooltip.id);
    });

    it('is a manual popover', async () => {
      const {tooltip} = await setupTest();
      expect(tooltip.popover).toBe('manual');
      expect(isOpen(tooltip)).toBeFalse();
    });
  });

  describe('accessibility', () => {
    it('has the tooltip role and describes the anchor', async () => {
      const {tooltip, anchor} = await setupTest();
      expect(tooltip['internals'].role).toBe('tooltip');
      expect(tooltip.id).toMatch(/^md-gb-tooltip-\d+$/);
      expect(anchor.getAttribute('aria-describedby')).toBe(tooltip.id);
    });

    it('keeps existing aria-describedby ids and removes only its own', async () => {
      const {tooltip, anchor} = await setupTest(html`
        <button id="anchor" aria-describedby="hint">Anchor</button>
        <span id="hint">Hint</span>
        <md-gb-tooltip id="tip" for="anchor" quick>Tip</md-gb-tooltip>
      `);
      expect(anchor.getAttribute('aria-describedby')).toBe('hint tip');
      tooltip.remove();
      expect(anchor.getAttribute('aria-describedby')).toBe('hint');
    });

    it('is a non-modal dialog labelled by its subhead when rich with actions', async () => {
      const {tooltip, anchor} = await setupTest(html`
        <button id="anchor">Anchor</button>
        <md-gb-tooltip for="anchor" variant="rich" subhead="New feature" quick>
          Details
          <button slot="action">Learn more</button>
        </md-gb-tooltip>
      `);
      await tooltip.updateComplete;
      expect(tooltip['internals'].role).toBe('dialog');
      expect(tooltip['internals'].ariaLabel).toBe('New feature');
      expect(anchor.hasAttribute('aria-describedby')).toBeFalse();
    });

    it('keeps the tooltip role when rich without actions', async () => {
      const {tooltip, anchor} = await setupTest(html`
        <button id="anchor">Anchor</button>
        <md-gb-tooltip for="anchor" variant="rich" subhead="Title" quick>
          Details
        </md-gb-tooltip>
      `);
      expect(tooltip['internals'].role).toBe('tooltip');
      expect(anchor.getAttribute('aria-describedby')).toBe(tooltip.id);
    });

    it('sets aria-haspopup and aria-expanded on a persistent anchor', async () => {
      const {tooltip, anchor} = await setupTest(html`
        <button id="anchor">Anchor</button>
        <md-gb-tooltip for="anchor" variant="rich" persistent quick>
          Details
          <button slot="action">OK</button>
        </md-gb-tooltip>
      `);
      await tooltip.updateComplete;
      expect(anchor.getAttribute('aria-haspopup')).toBe('dialog');
      expect(anchor.getAttribute('aria-expanded')).toBe('false');
      tooltip.show();
      expect(anchor.getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('show and hide', () => {
    it('opens and closes the popover and reflects `open`', async () => {
      const {tooltip} = await setupTest();
      tooltip.show();
      await tooltip.updateComplete;
      expect(isOpen(tooltip)).toBeTrue();
      expect(tooltip.hasAttribute('open')).toBeTrue();
      tooltip.hide();
      await tooltip.updateComplete;
      expect(isOpen(tooltip)).toBeFalse();
      expect(tooltip.hasAttribute('open')).toBeFalse();
    });

    it('fires open, opened, close and closed', async () => {
      const {tooltip} = await setupTest();
      const events: string[] = [];
      for (const type of ['open', 'opened', 'close', 'closed']) {
        tooltip.addEventListener(type, () => events.push(type));
      }
      tooltip.show();
      tooltip.hide();
      expect(events).toEqual(['open', 'opened', 'close', 'closed']);
    });

    it('can cancel opening and closing', async () => {
      const {tooltip} = await setupTest();
      const cancel = (e: Event) => {
        e.preventDefault();
      };
      tooltip.addEventListener('open', cancel);
      tooltip.show();
      expect(tooltip.open).toBeFalse();
      tooltip.removeEventListener('open', cancel);
      tooltip.show();
      tooltip.addEventListener('close', cancel);
      tooltip.hide();
      expect(tooltip.open).toBeTrue();
    });

    it('opens on load with the `open` attribute', async () => {
      const {tooltip} = await setupTest(html`
        <button id="anchor">Anchor</button>
        <md-gb-tooltip for="anchor" variant="rich" persistent open quick>
          New feature
        </md-gb-tooltip>
      `);
      expect(tooltip.open).toBeTrue();
      expect(isOpen(tooltip)).toBeTrue();
    });

    it('shows only one tooltip at a time', async () => {
      const {root} = await setupTest(html`
        <button id="a">A</button>
        <button id="b">B</button>
        <md-gb-tooltip class="a" for="a" quick>A</md-gb-tooltip>
        <md-gb-tooltip class="b" for="b" quick>B</md-gb-tooltip>
      `);
      const a = root.querySelector<TooltipElement>('.a')!;
      const b = root.querySelector<TooltipElement>('.b')!;
      a.show();
      b.show();
      expect(isOpen(a)).toBeFalse();
      expect(isOpen(b)).toBeTrue();
    });
  });

  describe('interaction', () => {
    it('shows on hover and hides after the hide delay', async () => {
      const {tooltip, anchor} = await setupTest();
      tooltip.hideDelay = 20;
      anchor.dispatchEvent(pointer('pointerenter'));
      expect(isOpen(tooltip)).toBeTrue();
      anchor.dispatchEvent(pointer('pointerleave'));
      expect(isOpen(tooltip)).withContext('during hide delay').toBeTrue();
      jasmine.clock().tick(50);
      expect(isOpen(tooltip)).toBeFalse();
    });

    it('waits for the show delay', async () => {
      const {tooltip, anchor} = await setupTest();
      tooltip.showDelay = 20;
      anchor.dispatchEvent(pointer('pointerenter'));
      expect(isOpen(tooltip)).toBeFalse();
      jasmine.clock().tick(50);
      expect(isOpen(tooltip)).toBeTrue();
    });

    it('stays open while the pointer is over the tooltip', async () => {
      const {tooltip, anchor} = await setupTest();
      tooltip.hideDelay = 20;
      anchor.dispatchEvent(pointer('pointerenter'));
      anchor.dispatchEvent(pointer('pointerleave'));
      tooltip.dispatchEvent(pointer('pointerenter'));
      jasmine.clock().tick(50);
      expect(isOpen(tooltip)).toBeTrue();
    });

    it('shows on keyboard focus and hides on blur', async () => {
      const {tooltip, anchor} = await setupTest();
      anchor.focus();
      expect(isOpen(tooltip)).toBeTrue();
      anchor.blur();
      expect(isOpen(tooltip)).toBeFalse();
    });

    it('shows on touch long press and suppresses the click', async () => {
      const {tooltip, anchor} = await setupTest();
      const clicked = jasmine.createSpy('click');
      anchor.addEventListener('click', clicked);
      anchor.dispatchEvent(pointer('pointerdown', 'touch'));
      jasmine.clock().tick(TOOLTIP_LONG_PRESS_MS - 1);
      expect(isOpen(tooltip)).toBeFalse();
      jasmine.clock().tick(1);
      expect(isOpen(tooltip)).toBeTrue();
      anchor.dispatchEvent(pointer('pointerup', 'touch'));
      anchor.click();
      expect(clicked).not.toHaveBeenCalled();
      jasmine.clock().tick(TOOLTIP_HIDE_DELAY_MS);
      expect(isOpen(tooltip)).toBeFalse();
    });

    it('cancels a long press when the pointer moves', async () => {
      const {tooltip, anchor} = await setupTest();
      anchor.dispatchEvent(pointer('pointerdown', 'touch', {clientX: 0}));
      anchor.dispatchEvent(pointer('pointermove', 'touch', {clientX: 40}));
      jasmine.clock().tick(TOOLTIP_LONG_PRESS_MS);
      expect(isOpen(tooltip)).toBeFalse();
    });

    it('hides on Escape', async () => {
      const {tooltip, anchor} = await setupTest();
      anchor.focus();
      expect(isOpen(tooltip)).toBeTrue();
      anchor.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'Escape', bubbles: true, composed: true}),
      );
      expect(isOpen(tooltip)).toBeFalse();
    });

    it('hides on pointerdown outside', async () => {
      const {tooltip, root} = await setupTest();
      tooltip.show();
      root.dispatchEvent(pointer('pointerdown'));
      expect(isOpen(tooltip)).toBeFalse();
    });
  });

  describe('persistent rich tooltip', () => {
    async function setupPersistent() {
      return setupTest(html`
        <div style="padding: 120px">
          <button id="anchor">Anchor</button>
          <md-gb-tooltip for="anchor" variant="rich" persistent quick>
            Details
            <button slot="action" class="action">Got it</button>
          </md-gb-tooltip>
          <button class="outside">Outside</button>
        </div>
      `);
    }

    it('ignores hover and toggles on click', async () => {
      const {tooltip, anchor} = await setupPersistent();
      anchor.dispatchEvent(pointer('pointerenter'));
      expect(isOpen(tooltip)).toBeFalse();
      anchor.click();
      expect(isOpen(tooltip)).toBeTrue();
      anchor.dispatchEvent(pointer('pointerleave'));
      expect(isOpen(tooltip)).toBeTrue();
      anchor.click();
      expect(isOpen(tooltip)).toBeFalse();
    });

    it('closes when focus moves to another element', async () => {
      const {tooltip, anchor, root} = await setupPersistent();
      anchor.click();
      root.querySelector<HTMLElement>('.outside')!.focus();
      expect(isOpen(tooltip)).toBeFalse();
    });

    it('moves focus into the actions on Tab and back on Escape', async () => {
      const {tooltip, anchor, root} = await setupPersistent();
      await tooltip.updateComplete;
      anchor.focus();
      anchor.click();
      const tab = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true,
      });
      anchor.dispatchEvent(tab);
      expect(tab.defaultPrevented).toBeTrue();
      const action = root.querySelector('.action')!;
      expect(document.activeElement).toBe(action);
      expect(isOpen(tooltip)).toBeTrue();
      action.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'Escape', bubbles: true, composed: true}),
      );
      expect(isOpen(tooltip)).toBeFalse();
      expect(document.activeElement).toBe(anchor);
    });
  });

  describe('rendering', () => {
    it('renders the subhead, supporting text and actions for rich', async () => {
      const {tooltip} = await setupTest(html`
        <button id="anchor">Anchor</button>
        <md-gb-tooltip for="anchor" variant="rich" subhead="Title" quick>
          Body
          <button slot="action">Action</button>
        </md-gb-tooltip>
      `);
      await tooltip.updateComplete;
      const surface = tooltip.shadowRoot!.querySelector('.tooltip')!;
      expect(surface.classList).toContain(TOOLTIP_CLASSES.rich);
      expect(surface.classList).toContain(TOOLTIP_CLASSES.subhead);
      expect(surface.classList).toContain(TOOLTIP_CLASSES.actions);
      expect(
        tooltip.shadowRoot!.querySelector('.tooltip-subhead')!.textContent,
      ).toContain('Title');
    });

    it('does not render rich slots for plain', async () => {
      const {tooltip} = await setupTest();
      expect(tooltip.shadowRoot!.querySelector('slot[name="action"]')).toBeNull();
      expect(tooltip.shadowRoot!.querySelector('slot[name="subhead"]')).toBeNull();
    });

    it('positions a plain tooltip above the anchor, centered', async () => {
      const {tooltip, anchor} = await setupTest();
      tooltip.show();
      await tooltip.updateComplete;
      const a = anchor.getBoundingClientRect();
      const t = tooltip.getBoundingClientRect();
      expect(t.bottom).toBeCloseTo(a.top - 4, 0);
      expect(t.left + t.width / 2).toBeCloseTo(a.left + a.width / 2, 0);
      const surface = tooltip.shadowRoot!.querySelector('.tooltip')!;
      expect(surface.classList).toContain(TOOLTIP_CLASSES.above);
    });

    it('positions a rich tooltip below the anchor, start aligned', async () => {
      const {tooltip, anchor} = await setupTest(html`
        <div style="padding: 120px">
          <button id="anchor">Anchor</button>
          <md-gb-tooltip for="anchor" variant="rich" quick>Body</md-gb-tooltip>
        </div>
      `);
      tooltip.show();
      await tooltip.updateComplete;
      const a = anchor.getBoundingClientRect();
      const t = tooltip.getBoundingClientRect();
      expect(t.top).toBeCloseTo(a.bottom + 4, 0);
      expect(t.left).toBeCloseTo(a.left, 0);
    });

    it('adds the caret height to the spacing and renders the caret', async () => {
      const {tooltip, anchor} = await setupTest(html`
        <div style="padding: 120px">
          <button id="anchor">Anchor</button>
          <md-gb-tooltip for="anchor" caret quick>Tip</md-gb-tooltip>
        </div>
      `);
      tooltip.show();
      await tooltip.updateComplete;
      const a = anchor.getBoundingClientRect();
      const t = tooltip.getBoundingClientRect();
      expect(t.bottom).toBeCloseTo(a.top - 12, 0);
      const caret = tooltip.shadowRoot!.querySelector<HTMLElement>('.tooltip-caret')!;
      const c = caret.getBoundingClientRect();
      expect(c.height).toBeCloseTo(8, 0);
      expect(c.top).toBeCloseTo(t.bottom, 0);
    });

    it('uses plain spec tokens', async () => {
      const {tooltip} = await setupTest();
      tooltip.show();
      const surface = tooltip.shadowRoot!.querySelector<HTMLElement>('.tooltip')!;
      const style = getComputedStyle(surface);
      expect(style.minHeight).toBe('24px');
      expect(style.paddingInlineStart).toBe('8px');
      expect(style.maxWidth).toContain('200px');
    });
  });

  describe('Light DOM', () => {
    it('tooltipClasses() maps state to classes', () => {
      expect(
        tooltipClasses({variant: 'rich', side: 'below', caret: true, hasActions: true}),
      ).toEqual(
        jasmine.objectContaining({
          [TOOLTIP_CLASSES.tooltip]: true,
          [TOOLTIP_CLASSES.rich]: true,
          [TOOLTIP_CLASSES.below]: true,
          [TOOLTIP_CLASSES.above]: false,
          [TOOLTIP_CLASSES.caret]: true,
          [TOOLTIP_CLASSES.actions]: true,
        }),
      );
      expect(tooltipClasses({hasActions: true})[TOOLTIP_CLASSES.actions]).toBeFalse();
    });

    it('setupTooltip() adds the role and hides on Escape', () => {
      const el = document.createElement('div');
      el.popover = 'manual';
      document.body.append(el);
      try {
        setupTooltip(el);
        expect(el.getAttribute('role')).toBe('tooltip');
        el.showPopover();
        el.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
        expect(el.matches(':popover-open')).toBeFalse();
      } finally {
        el.remove();
      }
    });
  });
});

describe('computeTooltipPosition()', () => {
  const viewport = {width: 400, height: 300};
  const tooltip = {width: 100, height: 24};
  const anchor = {left: 150, top: 100, right: 190, bottom: 140};

  it('centers above by default', () => {
    const p = computeTooltipPosition({anchor, tooltip, viewport, placement: 'above'});
    expect(p).toEqual({x: 120, y: 72, side: 'above', caretOffset: 50});
  });

  it('flips below when there is no room above', () => {
    const p = computeTooltipPosition({
      anchor: {left: 150, top: 10, right: 190, bottom: 50},
      tooltip,
      viewport,
      placement: 'above',
    });
    expect(p.side).toBe('below');
    expect(p.y).toBe(54);
  });

  it('flips above when there is no room below', () => {
    const p = computeTooltipPosition({
      anchor: {left: 150, top: 260, right: 190, bottom: 290},
      tooltip,
      viewport,
      placement: 'below',
    });
    expect(p.side).toBe('above');
  });

  it('keeps the tooltip inside the viewport and moves the caret', () => {
    const p = computeTooltipPosition({
      anchor: {left: 0, top: 100, right: 40, bottom: 140},
      tooltip,
      viewport,
      placement: 'above',
    });
    expect(p.x).toBe(8);
    expect(p.caretOffset).toBe(12);
  });

  it('start-aligns for rich and end-aligns when it would overflow', () => {
    const p = computeTooltipPosition({
      anchor,
      tooltip: {width: 200, height: 80},
      viewport,
      placement: 'below',
      align: 'start',
    });
    expect(p.x).toBe(150);
    const q = computeTooltipPosition({
      anchor: {left: 300, top: 100, right: 340, bottom: 140},
      tooltip: {width: 200, height: 80},
      viewport,
      placement: 'below',
      align: 'start',
    });
    expect(q.x).toBe(140);
  });

  it('start-aligns to the right edge in RTL', () => {
    const p = computeTooltipPosition({
      anchor: {left: 250, top: 100, right: 290, bottom: 140},
      tooltip: {width: 200, height: 80},
      viewport,
      placement: 'below',
      align: 'start',
      rtl: true,
    });
    expect(p.x).toBe(90);
  });

  it('places start / end by writing direction and flips', () => {
    expect(
      computeTooltipPosition({anchor, tooltip, viewport, placement: 'start'}).side,
    ).toBe('left');
    expect(
      computeTooltipPosition({anchor, tooltip, viewport, placement: 'start', rtl: true})
        .side,
    ).toBe('right');
    expect(
      computeTooltipPosition({
        anchor: {left: 20, top: 100, right: 60, bottom: 140},
        tooltip,
        viewport,
        placement: 'start',
      }).side,
    ).toBe('right');
  });
});
