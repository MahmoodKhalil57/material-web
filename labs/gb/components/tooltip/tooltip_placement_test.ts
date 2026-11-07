/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import '../appbar/md-gb-app-bar.js';

import {sendKeys} from '@web/test-runner-commands';
import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';

import './md-gb-tooltip.js';
import {type TooltipElement} from './tooltip-element.js';

adoptStyles(document, [m3Styles]);

function pointer(type: string) {
  return new PointerEvent(type, {
    pointerType: 'mouse',
    bubbles: type !== 'pointerenter' && type !== 'pointerleave',
    composed: true,
  });
}

describe('<md-gb-tooltip> placement', () => {
  const env = new Environment();

  async function setup(template: ReturnType<typeof html>) {
    const root = env.render(template);
    await env.waitForStability();
    const tooltip = root.querySelector('md-gb-tooltip') as TooltipElement;
    const anchor = root.querySelector<HTMLElement>('#anchor')!;
    await tooltip.updateComplete;
    return {root, tooltip, anchor};
  }

  async function open(tooltip: TooltipElement, anchor: HTMLElement) {
    anchor.dispatchEvent(pointer('pointerenter'));
    await tooltip.updateComplete;
    jasmine.clock().tick(1000);
    await env.waitForStability();
    return {
      tip: tooltip.getBoundingClientRect(),
      host: anchor.getBoundingClientRect(),
    };
  }

  afterEach(() => {
    document.querySelectorAll('md-gb-tooltip').forEach((t) => t.hide());
  });

  // spec: tooltips-2409e1
  it('keeps a plain tooltip 4dp from a boundary and 8dp from text without one', async () => {
    const gaps: number[] = [];
    for (const noBoundary of [false, true]) {
      const {tooltip, anchor} = await setup(html`
        <div style="padding: 100px">
          <button id="anchor">Anchor</button>
          <md-gb-tooltip for="anchor" quick ?no-boundary=${noBoundary}
            >Tip</md-gb-tooltip
          >
        </div>
      `);
      const {tip, host} = await open(tooltip, anchor);
      gaps.push(Math.round(host.top - tip.bottom));
      tooltip.hide();
    }
    expect(gaps).toEqual([4, 8]);
  });

  // spec: tooltips-98f8bd
  it('appears below an element in an app bar, at the same distance', async () => {
    const {tooltip, anchor} = await setup(html`
      <div style="padding: 100px">
        <md-gb-app-bar>
          <button id="anchor" slot="leading">Menu</button>
          <md-gb-tooltip for="anchor" quick>Menu</md-gb-tooltip>
        </md-gb-app-bar>
      </div>
    `);
    const {tip, host} = await open(tooltip, anchor);
    expect(Math.round(tip.top - host.bottom)).toBe(4);
  });

  // spec: tooltips-78d339, tooltips-bc60fe
  it('does not cover its anchor and stays on screen, plain or rich', async () => {
    for (const variant of ['plain', 'rich']) {
      for (const [x, y] of [
        ['4px', '4px'],
        ['calc(100vw - 80px)', '4px'],
        ['4px', 'calc(100vh - 40px)'],
        ['calc(100vw - 80px)', 'calc(100vh - 40px)'],
        ['300px', '300px'],
      ]) {
        const {tooltip, anchor} = await setup(html`
          <button
            id="anchor"
            style="position: fixed; left: ${x}; top: ${y}">
            Anchor
          </button>
          <md-gb-tooltip for="anchor" variant=${variant} quick>
            A longer supporting text for the tooltip to wrap
          </md-gb-tooltip>
        `);
        const {tip, host} = await open(tooltip, anchor);
        const label = `${variant} at ${x}, ${y}`;
        const overlaps =
          tip.left < host.right &&
          tip.right > host.left &&
          tip.top < host.bottom &&
          tip.bottom > host.top;
        expect(overlaps).withContext(label + ' overlaps').toBeFalse();
        expect(tip.left).withContext(label).toBeGreaterThanOrEqual(8 - 0.5);
        expect(tip.top).withContext(label).toBeGreaterThanOrEqual(8 - 0.5);
        expect(tip.right)
          .withContext(label)
          .toBeLessThanOrEqual(window.innerWidth - 8 + 0.5);
        expect(tip.bottom)
          .withContext(label)
          .toBeLessThanOrEqual(window.innerHeight - 8 + 0.5);
        tooltip.hide();
      }
    }
  });

  // spec: tooltips-78d339
  it('can center a rich tooltip below its anchor on desktop', async () => {
    const {tooltip, anchor} = await setup(html`
      <div style="padding: 200px">
        <button id="anchor">Anchor</button>
        <md-gb-tooltip for="anchor" variant="rich" align="center" quick>
          Supporting text
        </md-gb-tooltip>
      </div>
    `);
    const {tip, host} = await open(tooltip, anchor);
    expect(tip.top).toBeGreaterThanOrEqual(host.bottom);
    expect(
      Math.abs((tip.left + tip.right) / 2 - (host.left + host.right) / 2),
    ).toBeLessThan(1);
  });

  // spec: tooltips-bc60fe
  it('does not stop the anchor from being used and closes with Escape', async () => {
    const {tooltip, anchor} = await setup(html`
      <div style="padding: 100px">
        <button id="anchor">Anchor</button>
        <md-gb-tooltip for="anchor" quick>Tip</md-gb-tooltip>
      </div>
    `);
    const clicks = jasmine.createSpy('click');
    anchor.addEventListener('click', clicks);
    await open(tooltip, anchor);
    expect(tooltip.matches(':popover-open')).toBeTrue();
    anchor.click();
    expect(clicks).toHaveBeenCalledTimes(1);
    anchor.focus();
    await sendKeys({press: 'Escape'});
    expect(tooltip.matches(':popover-open')).toBeFalse();
  });

  describe('rich tooltip content', () => {
    const rich = html`
      <div style="padding: 100px">
        <button id="anchor">Anchor</button>
        <md-gb-tooltip
          for="anchor"
          variant="rich"
          persistent
          quick
          subhead="Subhead">
          Supporting text with a <a id="link" href="#docs">link</a>.
          <button slot="action" id="one">One</button>
          <button slot="action" id="two">Two</button>
        </md-gb-tooltip>
      </div>
    `;

    // spec: tooltips-60cfa8
    it('can contain a subhead, buttons and hyperlinks', async () => {
      const {tooltip, root} = await setup(rich);
      expect(
        tooltip.shadowRoot!.querySelector('.tooltip-subhead')?.textContent,
      ).toContain('Subhead');
      expect(root.querySelectorAll('md-gb-tooltip [slot="action"]').length).toBe(
        2,
      );
      expect(root.querySelector('md-gb-tooltip a[href]')).not.toBeNull();
    });

    // spec: tooltips-dfbfa9
    it('moves focus top to bottom between its interactive elements', async () => {
      const {tooltip, anchor, root} = await setup(rich);
      anchor.focus();
      await sendKeys({press: 'Enter'});
      await env.waitForStability();
      expect(tooltip.matches(':popover-open')).toBeTrue();
      // Tab moves focus from the anchor into the tooltip, link first.
      const order: string[] = [];
      for (let i = 0; i < 3; i++) {
        await sendKeys({press: 'Tab'});
        order.push((document.activeElement as HTMLElement).id || document.activeElement!.tagName + (document.activeElement!.shadowRoot?.activeElement ? '>' + document.activeElement!.shadowRoot!.activeElement!.outerHTML.slice(0, 80) : ''));
      }
      expect(order).toEqual(['link', 'one', 'two']);
      const tops = order.map(
        (id) => root.querySelector(`#${id}`)!.getBoundingClientRect().top,
      );
      expect(tops).toEqual([...tops].sort((a, b) => a - b));
    });

    // spec: tooltips-40026d, tooltips-19da76
    it('activates the focused element with Space or Enter', async () => {
      const {tooltip, anchor, root} = await setup(rich);
      anchor.focus();
      await sendKeys({press: 'Enter'});
      await env.waitForStability();
      expect(tooltip.matches(':popover-open')).toBeTrue();
      const one = root.querySelector<HTMLElement>('#one')!;
      const clicks = jasmine.createSpy('click');
      one.addEventListener('click', clicks);
      one.focus();
      await sendKeys({press: 'Enter'});
      expect(clicks).toHaveBeenCalledTimes(1);
      await sendKeys({press: 'Space'});
      expect(clicks).toHaveBeenCalledTimes(2);
    });
  });
});
