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
import {styles as m3Styles} from '../../styles/m3.cssresult.js';

import './md-gb-snackbar.js';
import {type SnackbarElement} from './snackbar-element.js';

adoptStyles(document, [m3Styles]);

describe('<md-gb-snackbar> accessibility and layout', () => {
  const env = new Environment();

  async function render(template: ReturnType<typeof html>) {
    const root = env.render(template);
    await env.waitForStability();
    const snackbar = root.querySelector('md-gb-snackbar') as SnackbarElement;
    await snackbar.updateComplete;
    return {root, snackbar};
  }

  async function finish(snackbar: SnackbarElement) {
    await snackbar.updateComplete;
    document.body.offsetHeight;
    snackbar.shadowRoot!.getAnimations().forEach((a) => a.finish());
    document.getAnimations().forEach((a) => a.finish());
  }

  const surface = (snackbar: SnackbarElement) =>
    snackbar.shadowRoot!.querySelector<HTMLElement>('.snackbar-surface')!;

  describe('auto-dismiss', () => {
    // spec: snackbar-f7e195, snackbar-933e5f, snackbar-c98d24
    it('does not auto-dismiss a snackbar with an action', async () => {
      const {snackbar} = await render(html`<md-gb-snackbar
        label-text="Item deleted"
        action-label="Undo"
        timeout-ms="1000"
        quick></md-gb-snackbar>`);
      await snackbar.show();
      jasmine.clock().tick(60000);
      await env.waitForStability();
      expect(snackbar.open).toBeTrue();
    });

    // spec: snackbar-f7e195, snackbar-933e5f
    it('does not auto-dismiss a snackbar with a slotted action', async () => {
      const {snackbar} = await render(html`<md-gb-snackbar
        label-text="Item deleted"
        timeout-ms="1000"
        quick>
        <button slot="action">Undo</button>
      </md-gb-snackbar>`);
      await snackbar.show();
      jasmine.clock().tick(60000);
      await env.waitForStability();
      expect(snackbar.open).toBeTrue();
    });

    // spec: snackbar-c98d24
    it('still auto-dismisses a snackbar without an action, unless hovered or focused', async () => {
      const {snackbar} = await render(html`<md-gb-snackbar
        label-text="Saved"
        timeout-ms="1000"
        quick></md-gb-snackbar>`);
      await snackbar.show();
      snackbar.dispatchEvent(new MouseEvent('mouseenter'));
      jasmine.clock().tick(5000);
      expect(snackbar.open).toBeTrue();
      snackbar.dispatchEvent(new MouseEvent('mouseleave'));
      jasmine.clock().tick(1001);
      await env.waitForStability();
      expect(snackbar.open).toBeFalse();
    });
  });

  describe('focus', () => {
    // spec: snackbar-58cfe3
    it('moves focus to the action with Alt+G', async () => {
      const {root, snackbar} = await render(html`
        <button id="before">Before</button>
        <md-gb-snackbar
          open
          quick
          label-text="Item deleted"
          action-label="Undo"></md-gb-snackbar>
      `);
      await finish(snackbar);
      root.querySelector<HTMLElement>('#before')!.focus();
      await sendKeys({press: 'Alt+g'});
      const action = snackbar.shadowRoot!.querySelector('.snackbar-action');
      expect(snackbar.shadowRoot!.activeElement).toBe(action);
    });

    it('ignores Alt+G when there is no action', async () => {
      const {root, snackbar} = await render(html`
        <button id="before">Before</button>
        <md-gb-snackbar open quick label-text="Saved"></md-gb-snackbar>
      `);
      await finish(snackbar);
      const before = root.querySelector<HTMLElement>('#before')!;
      before.focus();
      await sendKeys({press: 'Alt+g'});
      expect(document.activeElement).toBe(before);
    });

    // spec: snackbar-0729f1, snackbar-b2fa1a
    it('returns focus to the previously focused element when it closes', async () => {
      const {root, snackbar} = await render(html`
        <button id="trigger">Trigger</button>
        <md-gb-snackbar
          open
          quick
          label-text="Item deleted"
          action-label="Undo"></md-gb-snackbar>
      `);
      await finish(snackbar);
      const trigger = root.querySelector<HTMLElement>('#trigger')!;
      trigger.focus();
      await sendKeys({press: 'Alt+g'});
      expect(document.activeElement).toBe(snackbar);
      await sendKeys({press: 'Escape'});
      await env.waitForStability();
      expect(document.activeElement).toBe(trigger);
    });

    // spec: snackbar-3d0aaf, snackbar-b2fa1a
    it('moves focus to the next logical element when the previous one is gone', async () => {
      const {root, snackbar} = await render(html`
        <button id="trigger">Trigger</button>
        <md-gb-snackbar
          open
          quick
          label-text="Item deleted"
          action-label="Undo"></md-gb-snackbar>
        <button id="next">Next</button>
      `);
      await finish(snackbar);
      const trigger = root.querySelector<HTMLElement>('#trigger')!;
      trigger.focus();
      await sendKeys({press: 'Alt+g'});
      trigger.remove();
      await sendKeys({press: 'Escape'});
      await env.waitForStability();
      expect(document.activeElement).toBe(root.querySelector('#next'));
    });

    it('leaves focus alone when it closes without holding focus', async () => {
      const {root, snackbar} = await render(html`
        <button id="other">Other</button>
        <md-gb-snackbar open quick label-text="Saved"></md-gb-snackbar>
      `);
      await finish(snackbar);
      const other = root.querySelector<HTMLElement>('#other')!;
      other.focus();
      await snackbar.close();
      expect(document.activeElement).toBe(other);
    });
  });

  describe('layout', () => {
    // spec: snackbar-5f9681, snackbar-625f0b
    // snackbar-fbf72d says 48dp to 64dp; the token database and Compose
    // (SnackbarTokens.TwoLinesContainerHeight) give the two-line container
    // 68dp, and the page's measurement figure shows only the 48dp line, so
    // the token value wins.
    it('is 48dp for one line and grows for two lines on compact layouts, with fixed edge distances', async () => {
      const heights: number[] = [];
      const edges: number[][] = [];
      for (const text of [
        'One line',
        'A message long enough that it needs to wrap onto a second line on a compact layout',
      ]) {
        const {snackbar} = await render(
          html`<div style="width: 360px; height: 300px; position: relative">
            <md-gb-snackbar open quick label-text=${text}></md-gb-snackbar>
          </div>`,
        );
        await finish(snackbar);
        const container = snackbar.parentElement!.getBoundingClientRect();
        const box = surface(snackbar).getBoundingClientRect();
        heights.push(box.height);
        edges.push([box.left - container.left, container.right - box.right]);
      }
      expect(heights[0]).toBe(48);
      expect(heights[1]).toBeGreaterThan(48);
      // Two lines use the token's 68dp container (the guideline text says 64).
      expect(heights[1]).toBe(68);
      expect(edges[1]).toEqual(edges[0]);
      expect(edges[0][0]).toBe(edges[0][1]);
    });

    // spec: snackbar-98ae3f
    it('spans the width of a compact layout', async () => {
      const {snackbar} = await render(
        html`<div style="width: 360px; height: 300px; position: relative">
          <md-gb-snackbar open quick label-text="Message"></md-gb-snackbar>
        </div>`,
      );
      await finish(snackbar);
      const container = snackbar.parentElement!.getBoundingClientRect();
      const box = surface(snackbar).getBoundingClientRect();
      expect(box.width).toBe(container.width - 32);
    });

    // spec: snackbar-6e7b09, snackbar-94b618, snackbar-2142a7
    it('is centered or left-aligned on wide layouts, always in the same spot', async () => {
      const positions: Record<string, number[]> = {};
      for (const align of ['center', 'start']) {
        positions[align] = [];
        for (const text of ['Short', 'A somewhat longer message for the same spot']) {
          const {snackbar} = await render(
            html`<div style="width: 1000px; height: 300px; position: relative">
              <md-gb-snackbar
                open
                quick
                align=${align}
                label-text=${text}></md-gb-snackbar>
            </div>`,
          );
          await finish(snackbar);
          const container = snackbar.parentElement!.getBoundingClientRect();
          const box = surface(snackbar).getBoundingClientRect();
          positions[align].push(
            align === 'start'
              ? box.left - container.left
              : (box.left + box.right) / 2 - (container.left + container.right) / 2,
          );
        }
      }
      // Left-aligned: the same inset from the leading edge.
      expect(positions['start'][0]).toBe(positions['start'][1]);
      expect(positions['start'][0]).toBeGreaterThanOrEqual(16);
      // Centered: the same center.
      expect(Math.abs(positions['center'][0])).toBeLessThan(1);
      expect(Math.abs(positions['center'][1])).toBeLessThan(1);
    });

    // spec: snackbar-726c1a, snackbar-238a42, snackbar-68dc7a
    it('sits above an anchored element so it does not cover it', async () => {
      const {root, snackbar} = await render(
        html`<div style="width: 400px; height: 400px; position: relative">
          <button
            id="fab"
            style="position: absolute; inset-block-end: 16px; inset-inline-end: 16px; width: 56px; height: 56px">
            +
          </button>
          <md-gb-snackbar
            open
            quick
            anchor="fab"
            label-text="Message"></md-gb-snackbar>
        </div>`,
      );
      await finish(snackbar);
      await snackbar.updateComplete;
      const fab = root.querySelector('#fab')!.getBoundingClientRect();
      const box = surface(snackbar).getBoundingClientRect();
      expect(box.bottom).toBeLessThanOrEqual(fab.top + 0.5);
    });
  });
});
