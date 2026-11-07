/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Tests for spec units that were tracked as gaps and are now built.

// import 'jasmine'; (google3-only)

import '../button/md-gb-button.js';
import '../iconbutton/md-gb-icon-button.js';
import './md-gb-toolbar.js';

import {sendKeys} from '@web/test-runner-commands';
import {html, type TemplateResult} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {ToolbarElement} from './toolbar-element.js';

adoptStyles(document, [m3Styles]);

function inner(toolbar: ToolbarElement) {
  return toolbar.shadowRoot!.querySelector<HTMLElement>('[part=toolbar]')!;
}

describe('md-gb-toolbar tracked spec units', () => {
  const env = new Environment();

  async function render(template: TemplateResult) {
    const root = env.render(html`<button id="before">Before</button>${template}`);
    await env.waitForStability();
    const toolbar = root.querySelector('md-gb-toolbar') as ToolbarElement;
    await toolbar.updateComplete;
    await env.waitForStability();
    return {root, toolbar, before: root.querySelector<HTMLElement>('#before')!};
  }

  const buttons = html`
    <md-gb-icon-button aria-label="Bold" id="bold">b</md-gb-icon-button>
    <md-gb-icon-button aria-label="Italic" id="italic">i</md-gb-icon-button>
    <md-gb-icon-button aria-label="Underline" id="underline">u</md-gb-icon-button>
  `;

  describe('keyboard', () => {
    // spec: toolbars-1d1826, toolbars-cde7d0
    it('moves focus between controls with the arrow keys', async () => {
      const {toolbar} = await render(html`<md-gb-toolbar>${buttons}</md-gb-toolbar>`);
      const [first, second, third] = Array.from(
        toolbar.querySelectorAll<HTMLElement>('md-gb-icon-button'),
      );
      first.focus();
      await sendKeys({press: 'ArrowRight'});
      expect(document.activeElement).toBe(second);
      await sendKeys({press: 'ArrowRight'});
      expect(document.activeElement).toBe(third);
      await sendKeys({press: 'ArrowLeft'});
      expect(document.activeElement).toBe(second);
    });

    it('moves with Up and Down in a vertical toolbar, and mirrors Left and Right in RTL', async () => {
      const vertical = await render(
        html`<md-gb-toolbar orientation="vertical">${buttons}</md-gb-toolbar>`,
      );
      const [a, b] = Array.from(
        vertical.toolbar.querySelectorAll<HTMLElement>('md-gb-icon-button'),
      );
      a.focus();
      await sendKeys({press: 'ArrowRight'});
      expect(document.activeElement).withContext('Right does nothing when vertical').toBe(a);
      await sendKeys({press: 'ArrowDown'});
      expect(document.activeElement).toBe(b);
      const rtl = await render(
        html`<div dir="rtl"><md-gb-toolbar>${buttons}</md-gb-toolbar></div>`,
      );
      const [c, d] = Array.from(
        rtl.toolbar.querySelectorAll<HTMLElement>('md-gb-icon-button'),
      );
      c.focus();
      await sendKeys({press: 'ArrowLeft'});
      expect(document.activeElement).toBe(d);
    });

    // spec: toolbars-85d5ab, toolbars-4f7f1a, toolbars-e2387c
    it('lands focus on the first control and tabs through the others', async () => {
      const {toolbar, before} = await render(
        html`<md-gb-toolbar>${buttons}</md-gb-toolbar>`,
      );
      const items = Array.from(toolbar.querySelectorAll<HTMLElement>('md-gb-icon-button'));
      before.focus();
      await sendKeys({press: 'Tab'});
      expect(document.activeElement).toBe(items[0]);
      await sendKeys({press: 'Tab'});
      expect(document.activeElement).toBe(items[1]);
      await sendKeys({press: 'Tab'});
      expect(document.activeElement).toBe(items[2]);
    });

    // spec: toolbars-2b10d6, toolbars-7c818f, toolbars-bdb04d
    it('activates the focused control with Space or Enter', async () => {
      const {toolbar} = await render(html`<md-gb-toolbar>${buttons}</md-gb-toolbar>`);
      const item = toolbar.querySelector<HTMLElement>('#italic')!;
      let clicks = 0;
      item.addEventListener('click', () => clicks++);
      item.focus();
      await sendKeys({press: 'Enter'});
      await sendKeys({press: 'Space'});
      expect(clicks).toBe(2);
    });
  });

  describe('docked toolbar', () => {
    // spec: toolbars-e61277
    it('is 64dp tall with no elevation or shadow', async () => {
      const {toolbar} = await render(html`<md-gb-toolbar docked>${buttons}</md-gb-toolbar>`);
      expect(inner(toolbar).getBoundingClientRect().height).toBe(64);
      expect(getComputedStyle(inner(toolbar)).boxShadow).toBe('none');
    });

    // spec: toolbars-6a9be1, toolbars-b52234
    it('keeps at least 16dp of padding at its edges and spaces its items 32dp apart by default', async () => {
      const {toolbar} = await render(
        html`<div style="width: 1000px"><md-gb-toolbar docked>${buttons}</md-gb-toolbar></div>`,
      );
      const style = getComputedStyle(inner(toolbar));
      expect(parseFloat(style.paddingLeft)).toBeGreaterThanOrEqual(16);
      expect(parseFloat(style.paddingRight)).toBeGreaterThanOrEqual(16);
      expect(parseFloat(style.columnGap)).toBe(32);
    });

    // spec: toolbars-1eef5a, toolbars-539357
    it('spaces its items evenly in a compact window', async () => {
      const {toolbar} = await render(
        html`<div style="width: 360px"><md-gb-toolbar docked>${buttons}</md-gb-toolbar></div>`,
      );
      const boxes = Array.from(toolbar.querySelectorAll('md-gb-icon-button')).map((el) =>
        el.getBoundingClientRect(),
      );
      const gaps = [boxes[1].left - boxes[0].right, boxes[2].left - boxes[1].right];
      expect(Math.abs(gaps[0] - gaps[1])).toBeLessThan(1);
      expect(gaps[0]).toBeGreaterThanOrEqual(4);
    });

    // spec: toolbars-7e3845
    it('gives every control a target of at least 48x48dp', async () => {
      const {toolbar} = await render(html`<md-gb-toolbar docked>${buttons}</md-gb-toolbar>`);
      for (const el of toolbar.querySelectorAll('md-gb-icon-button')) {
        const box = el.getBoundingClientRect();
        // The target extends 4dp past the 40dp button in every direction.
        const x = box.left + box.width / 2;
        for (const [px, py] of [
          [x, box.top - 3],
          [x, box.bottom + 3],
        ]) {
          const hit = document.elementFromPoint(px, py);
          expect(hit === el || el.contains(hit)).withContext('target at ' + py).toBeTrue();
        }
      }
    });
  });

  describe('color', () => {
    function resolvedColor(token: string) {
      const probe = document.createElement('div');
      probe.style.color = `var(${token})`;
      document.body.appendChild(probe);
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    }

    // spec: toolbars-c7db57, toolbars-fdd47e
    it('draws a filled button in primary with on primary content, in both color schemes', async () => {
      for (const scheme of ['standard', 'vibrant']) {
        const {toolbar} = await render(html`<md-gb-toolbar color=${scheme}>
          <md-gb-button color="filled">Save</md-gb-button>
        </md-gb-toolbar>`);
        const button = toolbar.querySelector('md-gb-button')!;
        await (button as unknown as {updateComplete: Promise<unknown>}).updateComplete;
        document.getAnimations().forEach((a) => a.finish());
        const surface = button.shadowRoot!.querySelector<HTMLElement>('[part=btn]')!;
        expect(getComputedStyle(surface).backgroundColor).withContext(scheme).toBe(resolvedColor('--md-sys-color-primary'));
        expect(getComputedStyle(surface).color).withContext(scheme).toBe(resolvedColor('--md-sys-color-on-primary'));
      }
    });
  });

  describe('floating toolbar', () => {
    // spec: toolbars-77f3d8, toolbars-6f8535
    it('is only as big as the items inside it', async () => {
      const {toolbar} = await render(
        html`<div style="width: 800px"><md-gb-toolbar>${buttons}</md-gb-toolbar></div>`,
      );
      expect(toolbar.getBoundingClientRect().width).toBeLessThan(300);
    });

    // spec: toolbars-065a2d, toolbars-16db0a
    it('does not exceed the edge of its window or pane', async () => {
      const many = Array.from({length: 12}, (_, i) => html`<md-gb-icon-button aria-label=${'Item ' + i}>${i}</md-gb-icon-button>`);
      const {toolbar} = await render(
        html`<div style="width: 240px"><md-gb-toolbar>${many}</md-gb-toolbar></div>`,
      );
      expect(toolbar.getBoundingClientRect().width).toBeLessThanOrEqual(240);
    });

    // spec: toolbars-d52c99
    it('can be vertical', async () => {
      const {toolbar} = await render(
        html`<md-gb-toolbar orientation="vertical">${buttons}</md-gb-toolbar>`,
      );
      const boxes = Array.from(toolbar.querySelectorAll('md-gb-icon-button')).map((el) =>
        el.getBoundingClientRect(),
      );
      expect(boxes[1].top).toBeGreaterThanOrEqual(boxes[0].bottom);
      expect(Math.abs(boxes[1].left - boxes[0].left)).toBeLessThan(1);
    });

    // spec: toolbars-bdb7dc
    it('mirrors the order of its items in right-to-left languages', async () => {
      const {toolbar} = await render(
        html`<div dir="rtl" style="width: 400px"><md-gb-toolbar>${buttons}</md-gb-toolbar></div>`,
      );
      const [first, , last] = Array.from(toolbar.querySelectorAll('md-gb-icon-button')).map((el) =>
        el.getBoundingClientRect(),
      );
      expect(first.left).toBeGreaterThan(last.left);
    });
  });
});
