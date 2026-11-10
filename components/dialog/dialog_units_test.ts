/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import '../button/md-gb-button.js';
import './md-gb-dialog.js';

import {sendKeys} from '@web/test-runner-commands';
import {html, type TemplateResult} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {DialogElement} from './dialog-element.js';

adoptStyles(document, [m3Styles]);

function resolvedColor(token: string) {
  const probe = document.createElement('div');
  probe.style.color = `var(${token})`;
  document.body.appendChild(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return color;
}

function inner(el: DialogElement) {
  return el.shadowRoot!.querySelector<HTMLDialogElement>('dialog')!;
}

function part(el: DialogElement, selector: string) {
  return el.shadowRoot!.querySelector<HTMLElement>(selector)!;
}

// Environment mocks requestAnimationFrame; keep the real one.
const realRaf = window.requestAnimationFrame.bind(window);
const nextFrame = () => new Promise((resolve) => realRaf(resolve));

describe('md-gb-dialog spec units', () => {
  const env = new Environment();

  async function render(template: TemplateResult) {
    const root = env.render(template);
    await env.waitForStability();
    const el = root.querySelector('md-gb-dialog') as DialogElement;
    await el.updateComplete;
    return {root, el};
  }

  const basic = html`<md-gb-dialog quick>
    <span slot="icon">i</span>
    <span slot="headline">Reset settings?</span>
    This will reset your app preferences.
    <md-gb-button slot="actions" value="cancel">Cancel</md-gb-button>
    <md-gb-button slot="actions" value="accept">Accept</md-gb-button>
  </md-gb-dialog>`;

  const fullScreen = html`<md-gb-dialog quick full-screen always-full-screen>
    <span slot="headline">New event</span>
    Supporting content
    <md-gb-button slot="actions" value="save">Save</md-gb-button>
  </md-gb-dialog>`;

  afterEach(() => {
    for (const el of document.querySelectorAll('md-gb-dialog')) {
      inner(el).close();
    }
  });

  // spec: dialogs-cfd520, dialogs-9ab394, dialogs-b6872b, dialogs-ebdb25, dialogs-4bf22c, dialogs-b123d8, dialogs-559363, dialogs-601732, dialogs-5dbf74
  it('colors a basic dialog from the surface container high, secondary, on surface, on surface variant, primary and scrim roles', async () => {
    const {el} = await render(basic);
    await el.show();
    const dialog = inner(el);
    expect(getComputedStyle(dialog).backgroundColor)
      .withContext('container')
      .toBe(resolvedColor('--md-sys-color-surface-container-high'));
    expect(getComputedStyle(part(el, '.dialog-icon')).color)
      .withContext('icon')
      .toBe(resolvedColor('--md-sys-color-secondary'));
    expect(getComputedStyle(part(el, '.dialog-headline')).color)
      .withContext('headline')
      .toBe(resolvedColor('--md-sys-color-on-surface'));
    expect(getComputedStyle(part(el, '.dialog-content')).color)
      .withContext('supporting text')
      .toBe(resolvedColor('--md-sys-color-on-surface-variant'));
    const action = el.querySelector('md-gb-button')!;
    expect(getComputedStyle(action.shadowRoot!.firstElementChild!).color)
      .withContext('action label')
      .toBe(resolvedColor('--md-sys-color-primary'));
    expect(getComputedStyle(dialog, '::backdrop').backgroundColor)
      .withContext('scrim')
      .toBe(resolvedColor('--md-sys-color-scrim'));
  });

  // spec: dialogs-9e64d0, dialogs-1e3e2a, dialogs-1f738a, dialogs-11afa5, dialogs-194cfe
  it('colors a full-screen dialog header with on surface and its content with on surface variant', async () => {
    const {el} = await render(fullScreen);
    await el.show();
    expect(getComputedStyle(part(el, '.dialog-headline')).color)
      .withContext('headline')
      .toBe(resolvedColor('--md-sys-color-on-surface'));
    expect(getComputedStyle(part(el, '.dialog-close')).color)
      .withContext('close icon')
      .toBe(resolvedColor('--md-sys-color-on-surface'));
    expect(getComputedStyle(part(el, '.dialog-content')).color)
      .withContext('supporting content')
      .toBe(resolvedColor('--md-sys-color-on-surface-variant'));
  });

  // spec: dialogs-6f7ca4, dialogs-a00eba, dialogs-74b99f
  it('has a basic variant and a full-screen variant', async () => {
    const {el} = await render(basic);
    await el.show();
    expect(el.fullScreen).toBeFalse();
    expect(inner(el).getAttribute('role')).toBe('alertdialog');
    expect(el.shadowRoot!.querySelector('.dialog-header .dialog-close')).toBeNull();
    el.fullScreen = true;
    el.alwaysFullScreen = true;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.dialog-header .dialog-close')).not.toBeNull();
    expect(inner(el).getBoundingClientRect().width).toBe(window.innerWidth);
  });

  // spec: dialogs-f0ddde
  it('swaps from the full-screen variant to the basic variant', async () => {
    const {el} = await render(fullScreen);
    await el.show();
    const dialog = inner(el);
    expect(dialog.getBoundingClientRect().height).toBe(window.innerHeight);
    el.fullScreen = false;
    await el.updateComplete;
    expect(dialog.getBoundingClientRect().height).toBeLessThan(window.innerHeight);
    expect(dialog.getBoundingClientRect().width).toBeLessThanOrEqual(560);
  });

  // spec: dialogs-34b4b1
  it('centers a basic dialog by default', async () => {
    const {el} = await render(basic);
    await el.show();
    const rect = inner(el).getBoundingClientRect();
    expect(rect.left + rect.width / 2).toBeCloseTo(window.innerWidth / 2, 0);
    expect(rect.top + rect.height / 2).toBeCloseTo(window.innerHeight / 2, 0);
  });

  // spec: dialogs-14833a
  it('stays open until a person takes an action', async () => {
    const {el} = await render(basic);
    await el.show();
    await env.waitForStability();
    await nextFrame();
    expect(el.open).toBeTrue();
    // Clicking inside the dialog (not an action) does not close it.
    part(el, '.dialog-content').click();
    await el.updateComplete;
    expect(el.open).toBeTrue();
    const action = el.querySelector<HTMLElement>('[value="accept"]')!;
    action.addEventListener('click', () => void el.close('accept'));
    action.click();
    await env.waitForStability();
    expect(el.open).toBeFalse();
    expect(el.returnValue).toBe('accept');
  });

  // spec: dialogs-608918
  it('blocks the content behind it when it appears', async () => {
    const {root, el} = await render(basic);
    const outside = document.createElement('button');
    root.appendChild(outside);
    await el.show();
    outside.focus();
    expect(document.activeElement).not.toBe(outside);
    expect(inner(el).matches(':modal')).toBeTrue();
  });

  // spec: dialogs-0a3b74, dialogs-09ea9b, dialogs-608231
  it('animates in and out with an enter and exit transition', async () => {
    const {el} = await render(
      html`<md-gb-dialog>
        <span slot="headline">Title</span>
        Text
      </md-gb-dialog>`,
    );
    const dialog = inner(el);
    const names = () =>
      dialog
        .getAnimations()
        .filter((a): a is CSSTransition => a instanceof CSSTransition)
        .map((a) => a.transitionProperty);
    const shown = el.show();
    await el.updateComplete;
    await nextFrame();
    expect(names()).withContext('enter').toContain('opacity');
    await shown;
    const closing = el.close();
    await el.updateComplete;
    await nextFrame();
    expect(names()).withContext('exit').toContain('opacity');
    await closing;
  });

  // spec: dialogs-a5d3bc, dialogs-de93f1
  it('appears above other elements', async () => {
    const {root, el} = await render(basic);
    const cover = document.createElement('div');
    cover.style.cssText =
      'position:fixed;inset:0;z-index:2147483647;background:red';
    root.appendChild(cover);
    await el.show();
    const hit = document.elementFromPoint(
      window.innerWidth / 2,
      window.innerHeight / 2,
    );
    expect(hit).not.toBe(cover);
    expect(hit === el || el.contains(hit)).toBeTrue();
  });

  // spec: dialogs-8f75ef, dialogs-223189, dialogs-62b775, dialogs-8afd6f, dialogs-ace2c7
  it('keeps the headline and actions pinned while the content scrolls', async () => {
    const {el} = await render(
      html`<md-gb-dialog quick>
        <span slot="headline">Title</span>
        <div style="block-size: 4000px">Long list</div>
        <md-gb-button slot="actions">OK</md-gb-button>
      </md-gb-dialog>`,
    );
    await el.show();
    const scroller = part(el, '.dialog-scroller');
    const headline = part(el, '.dialog-headline');
    const actions = part(el, '.dialog-actions');
    const headlineTop = headline.getBoundingClientRect().top;
    const actionsBottom = actions.getBoundingClientRect().bottom;
    const dialogRect = inner(el).getBoundingClientRect();
    expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight);
    scroller.scrollTop = 500;
    expect(scroller.scrollTop).toBeGreaterThan(0);
    expect(headline.getBoundingClientRect().top).toBe(headlineTop);
    expect(actions.getBoundingClientRect().bottom).toBe(actionsBottom);
    expect(headlineTop).toBeLessThan(dialogRect.top + dialogRect.height / 2);
    expect(actionsBottom).toBeLessThanOrEqual(dialogRect.bottom);
  });

  // spec: dialogs-870921
  it('lets a person enter and submit input in the dialog', async () => {
    const {el} = await render(
      html`<md-gb-dialog quick>
        <span slot="headline">Rename</span>
        <form id="f" method="dialog"><input id="name" name="name" /></form>
        <button slot="actions" form="f" value="ok">OK</button>
      </md-gb-dialog>`,
    );
    await el.show();
    const input = el.querySelector<HTMLInputElement>('#name')!;
    input.focus();
    await sendKeys({type: 'abc'});
    expect(input.value).toBe('abc');
    const closed = new Promise((resolve) =>
      el.addEventListener('closed', resolve, {once: true}),
    );
    await sendKeys({press: 'Tab'});
    await sendKeys({press: 'Enter'});
    await closed;
    expect(el.returnValue).toBe('ok');
    expect(new FormData(el.querySelector('form')!).get('name')).toBe('abc');
  });

  // spec: dialogs-797d21, dialogs-b41b30
  it('triggers the focused action with Space or Enter', async () => {
    const {el} = await render(
      html`<md-gb-dialog quick>
        <span slot="headline">Title</span>
        <button slot="actions" id="act">Act</button>
      </md-gb-dialog>`,
    );
    const action = el.querySelector<HTMLElement>('#act')!;
    const spy = jasmine.createSpy('action');
    action.addEventListener('click', spy);
    await el.show();
    action.focus();
    await sendKeys({press: 'Enter'});
    expect(spy).toHaveBeenCalledTimes(1);
    await sendKeys({press: 'Space'});
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
