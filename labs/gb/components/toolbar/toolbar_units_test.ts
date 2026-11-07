/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import '../fab/md-gb-fab.js';
import '../iconbutton/md-gb-icon-button.js';
import '../../styles/icon/md-gb-icon.js';
import './md-gb-toolbar.js';

import {html, type TemplateResult} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
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

describe('md-gb-toolbar spec units', () => {
  const env = new Environment();

  async function render(template: TemplateResult) {
    const root = env.render(template);
    await env.waitForStability();
    const toolbar = root.querySelector('md-gb-toolbar') as ToolbarElement;
    await toolbar.updateComplete;
    await toolbar.updateComplete;
    return toolbar;
  }

  const buttons = html`
    <md-gb-icon-button aria-label="Bold">b</md-gb-icon-button>
    <md-gb-icon-button aria-label="Italic">i</md-gb-icon-button>
    <md-gb-icon-button aria-label="Underline">u</md-gb-icon-button>
  `;

  function bar(toolbar: ToolbarElement) {
    return toolbar.shadowRoot!.querySelector<HTMLElement>('.toolbar')!;
  }

  // spec: toolbars-28ac83, toolbars-8d3400
  it('exposes the toolbar role', async () => {
    const toolbar = await render(html`<md-gb-toolbar>${buttons}</md-gb-toolbar>`);
    expect(
      (toolbar as unknown as {internals: ElementInternals}).internals.role,
    ).toBe('toolbar');
  });

  // spec: toolbars-a7b877, toolbars-635e4b
  it('is horizontal by default and can be vertical', async () => {
    const toolbar = await render(html`<md-gb-toolbar>${buttons}</md-gb-toolbar>`);
    const horizontal = bar(toolbar).getBoundingClientRect();
    expect(horizontal.width).toBeGreaterThan(horizontal.height);
    expect(toolbar.orientation).toBe('horizontal');
    toolbar.orientation = 'vertical';
    await toolbar.updateComplete;
    const vertical = bar(toolbar).getBoundingClientRect();
    expect(vertical.height).toBeGreaterThan(vertical.width);
  });

  // spec: toolbars-0b5d6c, toolbars-4d27b0
  it('reports a vertical floating toolbar through aria-orientation', async () => {
    const toolbar = await render(
      html`<md-gb-toolbar orientation="vertical">${buttons}</md-gb-toolbar>`,
    );
    expect(
      (toolbar as unknown as {internals: ElementInternals}).internals
        .ariaOrientation,
    ).toBe('vertical');
    expect(toolbar.getAttribute('focusgroup')).toContain('block');
  });

  // spec: toolbars-089715, toolbars-0fac7d, toolbars-7a5a5f
  it('spans the full width of its container when docked', async () => {
    const toolbar = await render(
      html`<div style="width: 777px"
        ><md-gb-toolbar docked>${buttons}</md-gb-toolbar></div
      >`,
    );
    expect(toolbar.getBoundingClientRect().width).toBe(777);
    expect(bar(toolbar).getBoundingClientRect().width).toBe(777);
  });

  // spec: toolbars-6b9948
  it('uses straight corners when docked and rounded corners when floating', async () => {
    const docked = await render(
      html`<md-gb-toolbar docked>${buttons}</md-gb-toolbar>`,
    );
    expect(getComputedStyle(bar(docked)).borderTopLeftRadius).toBe('0px');
    const floating = await render(html`<md-gb-toolbar>${buttons}</md-gb-toolbar>`);
    expect(parseFloat(getComputedStyle(bar(floating)).borderTopLeftRadius)).toBeGreaterThan(0);
  });

  // spec: toolbars-9ba1f4
  it('elevates floating toolbars by default and not docked ones', async () => {
    const floating = await render(html`<md-gb-toolbar>${buttons}</md-gb-toolbar>`);
    expect(getComputedStyle(bar(floating)).boxShadow).not.toBe('none');
    const docked = await render(
      html`<md-gb-toolbar docked>${buttons}</md-gb-toolbar>`,
    );
    expect(getComputedStyle(bar(docked)).boxShadow).toBe('none');
  });

  // spec: toolbars-7e1ede
  it('lets the elevation be removed', async () => {
    const toolbar = await render(
      html`<style>md-gb-toolbar::part(toolbar) { --container-elevation: none; }</style
        ><md-gb-toolbar>${buttons}</md-gb-toolbar>`,
    );
    expect(getComputedStyle(bar(toolbar)).boxShadow).toBe('none');
  });

  // spec: toolbars-b45fa9
  it('can be used as a docked bottom bar', async () => {
    const toolbar = await render(
      html`<md-gb-toolbar docked>${buttons}</md-gb-toolbar>`,
    );
    expect(toolbar.hasAttribute('docked')).toBeTrue();
    expect(bar(toolbar).getBoundingClientRect().height).toBe(64);
  });

  // spec: toolbars-7cf5ad, toolbars-b1fdfd, toolbars-bee179
  it('uses the standard color scheme (surface container) by default', async () => {
    const toolbar = await render(html`<md-gb-toolbar>${buttons}</md-gb-toolbar>`);
    expect(toolbar.color).toBe('standard');
    expect(getComputedStyle(bar(toolbar)).backgroundColor).toBe(
      resolvedColor('--md-sys-color-surface-container'),
    );
  });

  // spec: toolbars-547116, toolbars-dda1a7, toolbars-ba3508
  it('uses the vibrant color scheme (primary container)', async () => {
    const toolbar = await render(
      html`<md-gb-toolbar color="vibrant">${buttons}</md-gb-toolbar>`,
    );
    expect(getComputedStyle(bar(toolbar)).backgroundColor).toBe(
      resolvedColor('--md-sys-color-primary-container'),
    );
  });

  // spec: toolbars-bd0915, toolbars-fa1cd2, toolbars-578318, toolbars-79b4b3, toolbars-42528a, toolbars-a8134f
  it('is a container with leading, content and trailing slots for any element', async () => {
    const toolbar = await render(
      html`<md-gb-toolbar>
        <md-gb-icon-button slot="leading" aria-label="Back">a</md-gb-icon-button>
        <input aria-label="Search" style="width: 60px" />
        <img alt="" width="24" height="24" />
        <button slot="trailing">More</button>
      </md-gb-toolbar>`,
    );
    // The overflow slot after them is covered by toolbar_overflow_test.ts.
    const slots = Array.from(bar(toolbar).querySelectorAll('slot')).filter(
      (s) => s.name !== 'overflow',
    );
    expect(slots.map((s) => s.name)).toEqual(['leading', '', 'trailing']);
    expect(slots[0].assignedElements().length).toBe(1);
    expect(slots[1].assignedElements().map((e) => e.localName)).toEqual([
      'input',
      'img',
    ]);
    expect(slots[2].assignedElements().length).toBe(1);
    const lead = toolbar.querySelector('[slot=leading]')!.getBoundingClientRect();
    const input = toolbar.querySelector('input')!.getBoundingClientRect();
    const trail = toolbar.querySelector('[slot=trailing]')!.getBoundingClientRect();
    expect(lead.right).toBeLessThanOrEqual(input.left);
    expect(input.right).toBeLessThanOrEqual(trail.left);
  });

  // spec: toolbars-009693, toolbars-76ea0d
  it('reverses the order of its items in right-to-left languages', async () => {
    const toolbar = await render(
      html`<div dir="rtl"
        ><md-gb-toolbar>
          <md-gb-icon-button aria-label="Back">a</md-gb-icon-button>
          <md-gb-icon-button slot="trailing" aria-label="Next">b</md-gb-icon-button>
        </md-gb-toolbar></div
      >`,
    );
    const first = toolbar.querySelector('md-gb-icon-button:not([slot])')!.getBoundingClientRect();
    const next = toolbar.querySelector('[slot=trailing]')!.getBoundingClientRect();
    expect(next.right).toBeLessThanOrEqual(first.left);
  });

  // spec: toolbars-e550bd, toolbars-4e75e8, toolbars-958dc1, toolbars-09427f
  it('pairs a floating toolbar with a FAB beside it', async () => {
    const toolbar = await render(
      html`<md-gb-toolbar>${buttons}
        <md-gb-fab slot="fab" aria-label="Add"><md-gb-icon>add</md-gb-icon></md-gb-fab>
      </md-gb-toolbar>`,
    );
    expect(toolbar.shadowRoot!.querySelector('.toolbar-with-fab')).not.toBeNull();
    const fab = toolbar.querySelector('md-gb-fab')!.getBoundingClientRect();
    expect(fab.left).toBeGreaterThan(bar(toolbar).getBoundingClientRect().right);
  });
});
