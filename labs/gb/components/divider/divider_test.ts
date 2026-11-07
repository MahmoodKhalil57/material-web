/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';

import {DIVIDER_CLASSES, dividerClasses} from './divider.js';
import './md-gb-divider.js';

describe('<md-gb-divider>', () => {
  const env = new Environment();

  async function inner(template: unknown) {
    const root = env.render(html`<div style="width: 200px; height: 200px; display: flex; flex-direction: column">${template}</div>`);
    await env.waitForStability();
    const el = root.querySelector('md-gb-divider')!;
    return el.shadowRoot!.querySelector<HTMLElement>('.divider')!;
  }

  // spec: divider-2abf81, divider-3cb7f9
  it('is full width by default', async () => {
    const d = await inner(html`<md-gb-divider></md-gb-divider>`);
    expect(d.getBoundingClientRect().width).toBe(200);
  });

  // spec: divider-48d180, divider-e84a53
  it('indents the leading end with inset-start (spec 16dp)', async () => {
    const d = await inner(html`<md-gb-divider inset-start></md-gb-divider>`);
    const style = getComputedStyle(d);
    expect(style.marginInlineStart).toBe('16px');
    expect(style.marginInlineEnd).toBe('0px');
    expect(d.getBoundingClientRect().width).toBe(184);
  });

  it('indents the trailing end with inset-end', async () => {
    const d = await inner(html`<md-gb-divider inset-end></md-gb-divider>`);
    const style = getComputedStyle(d);
    expect(style.marginInlineStart).toBe('0px');
    expect(style.marginInlineEnd).toBe('16px');
  });

  // spec: divider-abc2dc
  it('indents both ends with inset (spec middle inset)', async () => {
    const d = await inner(html`<md-gb-divider inset></md-gb-divider>`);
    expect(d.getBoundingClientRect().width).toBe(168);
  });

  // spec: divider-7ae83b, divider-85e098, divider-d87aa5, divider-3820f7
  it('takes its color from the outline-variant role token', async () => {
    const root = env.render(html`<div style="--md-sys-color-outline-variant: rgb(1, 2, 3); width: 200px"><md-gb-divider></md-gb-divider></div>`);
    await env.waitForStability();
    const d = root.querySelector('md-gb-divider')!.shadowRoot!.querySelector<HTMLElement>('.divider')!;
    expect(getComputedStyle(d).borderBottomColor).toBe('rgb(1, 2, 3)');
  });

  it('follows RTL with logical margins', async () => {
    const d = await inner(html`<md-gb-divider dir="rtl" inset-start></md-gb-divider>`);
    const style = getComputedStyle(d);
    expect(style.marginRight).toBe('16px');
    expect(style.marginLeft).toBe('0px');
  });
});

describe('dividerClasses()', () => {
  it('adds the inset classes', () => {
    const classes = dividerClasses({inset: true, insetStart: true, insetEnd: true});
    expect(classes[DIVIDER_CLASSES.dividerInset]).toBeTrue();
    expect(classes[DIVIDER_CLASSES.dividerInsetStart]).toBeTrue();
    expect(classes[DIVIDER_CLASSES.dividerInsetEnd]).toBeTrue();
  });
});
