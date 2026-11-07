/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {sendKeys} from '@web/test-runner-commands';
import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';

import './md-gb-tooltip.js';
import {TOOLTIP_CLASSES, TOOLTIP_HIDE_DELAY_MS} from './tooltip.js';
import {type TooltipElement} from './tooltip-element.js';
import tooltipStyles from './tooltip.cssresult.js';

// The Environment installs the Jasmine clock for the whole suite.
adoptStyles(document, tooltipStyles);

function pointer(type: string, pointerType = 'mouse') {
  return new PointerEvent(type, {
    pointerType,
    bubbles: type !== 'pointerenter' && type !== 'pointerleave',
    composed: true,
  });
}

function isOpen(tooltip: TooltipElement) {
  return tooltip.matches(':popover-open');
}

describe('<md-gb-tooltip> spec units', () => {
  const env = new Environment();

  async function setup(template: ReturnType<typeof html>) {
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

  // spec: tooltips-f5221f, tooltips-86de97, tooltips-797e02, tooltips-6b926e
  it('stays on screen for 1.5 seconds after the pointer leaves, plain or rich', async () => {
    expect(TOOLTIP_HIDE_DELAY_MS).toBe(1500);
    for (const variant of ['plain', 'rich']) {
      const {tooltip, anchor} = await setup(html`
        <button id="anchor">Anchor</button>
        <md-gb-tooltip for="anchor" variant=${variant} quick>Tip</md-gb-tooltip>
      `);
      anchor.dispatchEvent(pointer('pointerenter'));
      expect(isOpen(tooltip)).toBeTrue();
      anchor.dispatchEvent(pointer('pointerleave'));
      jasmine.clock().tick(1499);
      expect(isOpen(tooltip)).withContext(`${variant} at 1499ms`).toBeTrue();
      jasmine.clock().tick(1);
      expect(isOpen(tooltip)).withContext(`${variant} at 1500ms`).toBeFalse();
    }
  });

  // spec: tooltips-c3c5c3, tooltips-8cc82f, tooltips-f9602c, tooltips-0988e3
  it('configures a rich tooltip with a subhead, supporting text and two buttons', async () => {
    const {tooltip} = await setup(html`
      <button id="anchor">Anchor</button>
      <md-gb-tooltip for="anchor" variant="rich" subhead="Subhead" quick>
        Supporting text
        <button slot="action">One</button>
        <button slot="action">Two</button>
      </md-gb-tooltip>
    `);
    const root = tooltip.shadowRoot!;
    expect(root.querySelector('.tooltip-subhead')!.textContent).toContain('Subhead');
    const actions = root
      .querySelector<HTMLSlotElement>('slot[name="action"]')!
      .assignedElements();
    expect(actions.map((a) => a.textContent)).toEqual(['One', 'Two']);
    expect(tooltip.textContent).toContain('Supporting text');
  });

  // spec: tooltips-685038, tooltips-3f8503
  it('configures a rich tooltip with one button, with or without a subhead', async () => {
    for (const subhead of ['Subhead', '']) {
      const {tooltip} = await setup(html`
        <button id="anchor">Anchor</button>
        <md-gb-tooltip for="anchor" variant="rich" subhead=${subhead} quick>
          Supporting text
          <button slot="action">One</button>
        </md-gb-tooltip>
      `);
      const root = tooltip.shadowRoot!;
      const surface = root.querySelector('.tooltip')!;
      expect(surface.classList.contains(TOOLTIP_CLASSES.subhead)).toBe(!!subhead);
      expect(surface.classList).toContain(TOOLTIP_CLASSES.actions);
      expect(
        root.querySelector<HTMLSlotElement>('slot[name="action"]')!.assignedElements()
          .length,
      ).toBe(1);
    }
  });

  // spec: tooltips-6cf917
  it('configures a rich tooltip with a subhead and supporting text only', async () => {
    const {tooltip} = await setup(html`
      <button id="anchor">Anchor</button>
      <md-gb-tooltip for="anchor" variant="rich" subhead="Subhead" quick>
        Supporting text
      </md-gb-tooltip>
    `);
    const surface = tooltip.shadowRoot!.querySelector('.tooltip')!;
    expect(surface.classList).toContain(TOOLTIP_CLASSES.subhead);
    expect(surface.classList).not.toContain(TOOLTIP_CLASSES.actions);
  });

  // spec: tooltips-58406e
  it('configures a rich tooltip with supporting text and two buttons', async () => {
    const {tooltip} = await setup(html`
      <button id="anchor">Anchor</button>
      <md-gb-tooltip for="anchor" variant="rich" quick>
        Supporting text
        <button slot="action">One</button>
        <button slot="action">Two</button>
      </md-gb-tooltip>
    `);
    const surface = tooltip.shadowRoot!.querySelector('.tooltip')!;
    expect(surface.classList).not.toContain(TOOLTIP_CLASSES.subhead);
    expect(
      tooltip
        .shadowRoot!.querySelector<HTMLSlotElement>('slot[name="action"]')!
        .assignedElements().length,
    ).toBe(2);
  });

  // spec: tooltips-55ae7f
  it('is activated from the keyboard, by focus or by Enter on a persistent rich tooltip', async () => {
    const {tooltip, anchor} = await setup(html`
      <button id="anchor">Anchor</button>
      <md-gb-tooltip for="anchor" quick>Tip</md-gb-tooltip>
      <button id="rich-anchor">Rich</button>
      <md-gb-tooltip for="rich-anchor" variant="rich" persistent quick>
        Supporting text
      </md-gb-tooltip>
    `);
    await sendKeys({press: 'Tab'});
    expect(document.activeElement).toBe(anchor);
    expect(isOpen(tooltip)).withContext('plain, on focus').toBeTrue();
    await sendKeys({press: 'Tab'});
    const rich = document.querySelector<TooltipElement>(
      'md-gb-tooltip[variant="rich"]',
    )!;
    expect(isOpen(rich)).withContext('rich before Enter').toBeFalse();
    await sendKeys({press: 'Enter'});
    expect(isOpen(rich)).withContext('rich after Enter').toBeTrue();
  });
});
