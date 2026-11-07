/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {sendKeys} from '@web/test-runner-commands';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';

import './md-gb-snackbar.js';
import {until} from '../shared/test-dom.js';
import {type SnackbarElement} from './snackbar-element.js';

adoptStyles(document, [m3Styles]);

function resolvedColor(token: string) {
  const probe = document.createElement('div');
  probe.style.color = `var(${token})`;
  document.body.appendChild(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return color;
}

describe('<md-gb-snackbar> spec units', () => {
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

  function surface(snackbar: SnackbarElement) {
    return snackbar.shadowRoot!.querySelector<HTMLElement>('.snackbar-surface')!;
  }

  const one = html`<div style="width: 400px; height: 400px; position: relative">
    <md-gb-snackbar open quick label-text="Message" action-label="Undo"></md-gb-snackbar>
  </div>`;

  // spec: snackbar-97f686, snackbar-a37c69, snackbar-71172c, snackbar-d6f5f8, snackbar-301b12, snackbar-a4408a
  it('uses an opaque inverse-surface container with a shadow', async () => {
    const {snackbar} = await render(one);
    await finish(snackbar);
    const style = getComputedStyle(surface(snackbar));
    expect(style.backgroundColor).toBe(resolvedColor('--md-sys-color-inverse-surface'));
    expect(style.backgroundColor).not.toContain('/');
    expect(style.boxShadow).not.toBe('none');
  });

  // spec: snackbar-defafe, snackbar-217016, snackbar-fbe455, snackbar-ad1103, snackbar-a33595
  it('colors the label inverse on surface and the action inverse primary', async () => {
    const {snackbar} = await render(one);
    await finish(snackbar);
    const label = snackbar.shadowRoot!.querySelector<HTMLElement>('.snackbar-label')!;
    const action = snackbar.shadowRoot!.querySelector<HTMLElement>('.snackbar-action')!;
    const labelColor = getComputedStyle(label).color;
    const actionColor = getComputedStyle(action).color;
    expect(labelColor).toBe(resolvedColor('--md-sys-color-inverse-on-surface'));
    expect(actionColor).toBe(resolvedColor('--md-sys-color-inverse-primary'));
    expect(actionColor).not.toBe(labelColor);
  });

  // spec: snackbar-d399c2, snackbar-299d4c
  it('appears at the bottom of its container, in front of the content', async () => {
    const {snackbar} = await render(one);
    await finish(snackbar);
    const container = snackbar.parentElement!.getBoundingClientRect();
    const box = surface(snackbar).getBoundingClientRect();
    expect(container.bottom - box.bottom).toBeLessThan(32);
    expect(box.top).toBeGreaterThan(container.top + container.height / 2);
    expect(getComputedStyle(snackbar).position).toMatch(/absolute|fixed/);
    expect(getComputedStyle(snackbar).zIndex).not.toBe('auto');
  });

  // spec: snackbar-01a364, snackbar-c84fce
  it('widens its container on wide layouts for longer labels', async () => {
    const text =
      'A long message that needs more room than a compact layout provides here';
    const widths: number[] = [];
    for (const width of [360, 900]) {
      const {snackbar} = await render(
        html`<div style="width: ${width}px; height: 300px; position: relative">
          <md-gb-snackbar open quick label-text=${text}></md-gb-snackbar>
        </div>`,
      );
      await finish(snackbar);
      widths.push(surface(snackbar).getBoundingClientRect().width);
    }
    expect(widths[1]).toBeGreaterThan(widths[0]);
  });

  // spec: snackbar-6c7969, snackbar-f3a573
  it('is not flush to either edge of a wide layout', async () => {
    const {snackbar} = await render(
      html`<div style="width: 900px; height: 300px; position: relative">
        <md-gb-snackbar open quick label-text="Short message"></md-gb-snackbar>
      </div>`,
    );
    await finish(snackbar);
    const container = snackbar.parentElement!.getBoundingClientRect();
    const box = surface(snackbar).getBoundingClientRect();
    expect(box.left - container.left).toBeGreaterThanOrEqual(16);
    expect(container.right - box.right).toBeGreaterThanOrEqual(16);
  });

  // spec: snackbar-23caa1, snackbar-df1452
  it('puts a long action on its own line below the label', async () => {
    const {snackbar} = await render(
      html`<div style="width: 360px; height: 300px; position: relative">
        <md-gb-snackbar
          open
          quick
          label-text="Two lines of supporting text that wrap onto a second line here"
          action-label="A rather long action label"></md-gb-snackbar>
      </div>`,
    );
    await finish(snackbar);
    const label = snackbar.shadowRoot!.querySelector('.snackbar-label')!.getBoundingClientRect();
    const action = snackbar.shadowRoot!.querySelector('.snackbar-action')!.getBoundingClientRect();
    expect(action.top).toBeGreaterThanOrEqual(label.bottom - 1);
  });

  // spec: snackbar-1f1a89, snackbar-301e4d, snackbar-8605f7
  it('moves focus between its controls with Tab and does not trap it', async () => {
    const {snackbar, root} = await render(
      html`<button id="before">Before</button>
        <md-gb-snackbar
          open
          quick
          label-text="Message"
          action-label="Undo"
          has-close-button></md-gb-snackbar>
        <button id="after">After</button>`,
    );
    await finish(snackbar);
    const action = snackbar.shadowRoot!.querySelector<HTMLElement>('.snackbar-action')!;
    root.querySelector<HTMLElement>('#before')!.focus();
    await sendKeys({press: 'Tab'});
    expect(snackbar.shadowRoot!.activeElement).toBe(action);
    await sendKeys({press: 'Tab'});
    expect(snackbar.shadowRoot!.activeElement?.getAttribute('aria-label') ?? '')
      .toBe('Close');
    await sendKeys({press: 'Tab'});
    expect(document.activeElement).toBe(root.querySelector('#after'));
  });

  /** Waits (at most a second) until the polite live region holds `expected`. */
  async function politeText(snackbar: SnackbarElement, expected: string) {
    const region = () =>
      snackbar.shadowRoot!.querySelector<HTMLElement>('[data-announcer="polite"]');
    await until(() => region()?.textContent?.trim() === expected);
    return region()?.textContent?.trim() ?? '';
  }

  // spec: snackbar-9f201c, snackbar-a475ea, snackbar-66bf7e
  it('alerts politely, without disrupting the focused element, when it appears', async () => {
    const {snackbar, root} = await render(
      html`<button id="before">Before</button>
        <md-gb-snackbar
          quick
          label-text="Message sent"
          action-label="Undo"></md-gb-snackbar>`,
    );
    const before = root.querySelector<HTMLElement>('#before')!;
    before.focus();
    await snackbar.show();
    expect(await politeText(snackbar, 'Message sent. Undo')).toBe(
      'Message sent. Undo',
    );
    const region = snackbar.shadowRoot!.querySelector('[data-announcer="polite"]')!;
    expect(region.getAttribute('role')).toBe('status');
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(snackbar.shadowRoot!.querySelector('[aria-live="assertive"]')).toBeNull();
    expect(document.activeElement).toBe(before);
  });

  // spec: snackbar-a8a651
  it('announces a snackbar that is open on load without taking focus', async () => {
    const {snackbar} = await render(
      html`<md-gb-snackbar
        open
        quick
        label-text="Welcome back"
        action-label="Dismiss"></md-gb-snackbar>`,
    );
    expect(await politeText(snackbar, 'Welcome back. Dismiss')).toBe(
      'Welcome back. Dismiss',
    );
    expect(snackbar.contains(document.activeElement)).toBeFalse();
    expect(snackbar.shadowRoot!.activeElement).toBeNull();
  });
});
