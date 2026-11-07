/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-bottom-sheet.js';
import './md-gb-side-sheet.js';

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {type SideSheetElement} from './side-sheet-element.js';

adoptStyles(document, [m3Styles]);

describe('md-gb-side-sheet adaptive design', () => {
  const env = new Environment();

  async function render(attrs = '') {
    const root = env.render(html`
      <div style="display: flex; block-size: 400px; inline-size: 900px">
        <main style="flex: 1; min-inline-size: 0">Main</main>
        ${html`<md-gb-side-sheet
          quick
          headline="Title"
          .detached=${attrs.includes('detached')}></md-gb-side-sheet>`}
      </div>
    `);
    await env.waitForStability();
    const sheet = root.querySelector('md-gb-side-sheet') as SideSheetElement;
    await sheet.updateComplete;
    const main = root.querySelector('main')!;
    const settle = async () => {
      await env.waitForStability();
      await sheet.updateComplete;
      document.getAnimations().forEach((a) => a.finish());
    };
    return {sheet, main, settle};
  }

  // spec: side-sheets-beb0e6
  it('shrinks the body by the sheet width when a standard side sheet opens, keeping a margin when detached', async () => {
    const plain = await render();
    const full = plain.main.getBoundingClientRect().width;
    await plain.sheet.show();
    await plain.settle();
    const opened = plain.main.getBoundingClientRect().width;
    expect(full - opened).toBe(256);
    await plain.sheet.close();
    await plain.settle();
    expect(plain.main.getBoundingClientRect().width).toBe(full);

    const floating = await render('detached');
    await floating.sheet.show();
    await floating.settle();
    // The detached sheet's 16dp margin keeps the body off the sheet.
    const body = floating.main.getBoundingClientRect();
    const panel = floating.sheet.shadowRoot!
      .querySelector('.sheet-panel')!
      .getBoundingClientRect();
    expect(panel.left - body.right).toBe(16);
  });

  // spec: side-sheets-71a9c5, side-sheets-a650b1
  it('turns from a modal into a standard side sheet, still open, when the layout widens', async () => {
    const {sheet, main, settle} = await render();
    sheet.modal = true;
    await sheet.show();
    await settle();
    const dialog = sheet.shadowRoot!.querySelector('dialog')!;
    expect(dialog.matches(':modal')).toBeTrue();
    const modalWidth = main.getBoundingClientRect().width;
    expect(modalWidth).toBe(900);

    sheet.modal = false;
    await settle();
    expect(sheet.open).toBeTrue();
    expect(sheet.shadowRoot!.querySelector('dialog')!.matches(':modal')).toBeFalse();
    expect(main.getBoundingClientRect().width).toBe(900 - 256);
  });

  // spec: side-sheets-86da53, side-sheets-7a69a5, side-sheets-22cf8b
  it('always has a close affordance, standard or modal', async () => {
    for (const modal of [false, true]) {
      const {sheet, settle} = await render();
      sheet.modal = modal;
      await sheet.show();
      await settle();
      const close = sheet.shadowRoot!.querySelector<HTMLElement>('.side-sheet-close');
      expect(close).withContext(`modal ${modal}`).not.toBeNull();
      expect(close!.getAttribute('aria-label')).toBe('Close');
      close!.click();
      await settle();
      expect(sheet.open).withContext(`modal ${modal}`).toBeFalse();
    }
  });

  // spec: side-sheets-7a69a5
  it('offers a back icon button to move to a different experience', async () => {
    const root = env.render(html`
      <md-gb-side-sheet quick modal headline="Title" has-back-button></md-gb-side-sheet>
    `);
    await env.waitForStability();
    const sheet = root.querySelector('md-gb-side-sheet') as SideSheetElement;
    await sheet.show();
    const back = jasmine.createSpy('back');
    sheet.addEventListener('back', back);
    sheet.shadowRoot!.querySelector<HTMLElement>('.side-sheet-back')!.click();
    expect(back).toHaveBeenCalledTimes(1);
  });

  // spec: side-sheets-e37a74
  it('needs only its container', async () => {
    const root = env.render(html`
      <md-gb-side-sheet open quick hide-close-button></md-gb-side-sheet>
    `);
    await env.waitForStability();
    const sheet = root.querySelector('md-gb-side-sheet') as SideSheetElement;
    await sheet.updateComplete;
    const container = sheet.shadowRoot!.querySelector<HTMLElement>('.sheet-panel');
    expect(container).not.toBeNull();
    expect(container!.getBoundingClientRect().width).toBeGreaterThan(0);
    expect(sheet.shadowRoot!.querySelector('.side-sheet-back')).toBeNull();
    expect(sheet.shadowRoot!.querySelector('.side-sheet-close')).toBeNull();
    expect(sheet.querySelector('[slot="actions"]')).toBeNull();
  });

  // spec: side-sheets-51f691
  it('separates the regions of a sheet with an optional divider', async () => {
    const borders: string[] = [];
    for (const divider of [false, true]) {
      const root = env.render(html`
        <md-gb-side-sheet open quick modal ?divider=${divider} headline="Title">
          Content
          <button slot="actions">Save</button>
        </md-gb-side-sheet>
      `);
      await env.waitForStability();
      const sheet = root.querySelector('md-gb-side-sheet') as SideSheetElement;
      await sheet.updateComplete;
      const actions = sheet.shadowRoot!.querySelector<HTMLElement>('.side-sheet-actions')!;
      borders.push(getComputedStyle(actions).borderTopWidth);
    }
    expect(borders).toEqual(['0px', '1px']);
  });

  // spec: side-sheets-456d43, side-sheets-6668bd, side-sheets-a53a09
  it('shows visible focus on the headline and the close button', async () => {
    const {sheet, settle} = await render();
    sheet.modal = true;
    await sheet.show();
    await settle();
    const close = sheet.shadowRoot!.querySelector<HTMLElement>('.side-sheet-close')!;
    const headline = sheet.shadowRoot!.querySelector<HTMLElement>('.side-sheet-headline')!;
    expect(headline.textContent).toContain('Title');
    for (const el of [headline, close]) {
      el.focus();
      expect(sheet.shadowRoot!.activeElement)
        .withContext(el.className)
        .toBe(el);
      expect(el.matches(':focus-visible')).toBeTrue();
    }
  });
});
