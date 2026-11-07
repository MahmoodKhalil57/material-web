/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-bottom-sheet.js';

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {type BottomSheetElement} from './bottom-sheet-element.js';

adoptStyles(document, [m3Styles]);

describe('md-gb-bottom-sheet full-screen height and height controls', () => {
  const env = new Environment();

  async function render(attrs: {modal?: boolean; hideHandle?: boolean} = {}) {
    const root = env.render(html`
      <div style="position: relative; block-size: 600px; inline-size: 400px">
        <md-gb-bottom-sheet
          quick
          ?modal=${attrs.modal}
          ?hide-drag-handle=${attrs.hideHandle}>
          <div style="block-size: 4000px">Very tall content</div>
        </md-gb-bottom-sheet>
      </div>
    `);
    await env.waitForStability();
    const sheet = root.querySelector('md-gb-bottom-sheet') as BottomSheetElement;
    await sheet.updateComplete;
    const settle = async () => {
      await env.waitForStability();
      await sheet.updateComplete;
      document.getAnimations().forEach((a) => a.finish());
      await sheet.updateComplete;
      await env.waitForStability();
    };
    const bar = () =>
      sheet.shadowRoot!.querySelector<HTMLElement>('.bottom-sheet-app-bar');
    return {sheet, settle, bar};
  }

  afterEach(() => {
    for (const el of document.querySelectorAll('md-gb-bottom-sheet')) {
      el.shadowRoot?.querySelector('dialog')?.close();
    }
  });

  // spec: bottom-sheets-1e4113
  it('shows a collapse icon in an app bar at full-screen height of a standard sheet', async () => {
    const {sheet, settle, bar} = await render();
    await sheet.show();
    await settle();
    expect(bar()).withContext('partially expanded').toBeNull();
    sheet.expand();
    await settle();
    expect(bar()).not.toBeNull();
    const collapse = bar()!.querySelector<HTMLElement>('button')!;
    expect(collapse.getAttribute('aria-label')).toBe('Collapse');
    collapse.click();
    await settle();
    expect(sheet.state).toBe('partially-expanded');
    expect(bar()).withContext('collapsed').toBeNull();
  });

  // spec: bottom-sheets-95a481
  it('shows a close affordance at full-screen height of a modal sheet', async () => {
    const {sheet, settle, bar} = await render({modal: true});
    await sheet.show();
    await settle();
    expect(bar()).withContext('partially expanded').toBeNull();
    sheet.expand();
    await settle();
    expect(bar()).not.toBeNull();
    const close = bar()!.querySelector<HTMLElement>('button')!;
    expect(close.getAttribute('aria-label')).toBe('Close');
    close.click();
    await settle();
    expect(sheet.open).toBeFalse();
  });

  // spec: bottom-sheets-7f27dd
  it('changes height with a single click on the drag handle, or from code when the handle is hidden', async () => {
    const withHandle = await render();
    await withHandle.sheet.show();
    await withHandle.settle();
    const handle = withHandle.sheet.shadowRoot!.querySelector<HTMLElement>(
      '.bottom-sheet-drag-handle',
    )!;
    expect(withHandle.sheet.state).toBe('partially-expanded');
    handle.click();
    await withHandle.settle();
    expect(withHandle.sheet.state).toBe('expanded');
    handle.click();
    await withHandle.settle();
    expect(withHandle.sheet.state).toBe('partially-expanded');

    const noHandle = await render({hideHandle: true});
    await noHandle.sheet.show();
    await noHandle.settle();
    noHandle.sheet.expand();
    expect(noHandle.sheet.state).toBe('expanded');
    noHandle.sheet.partialExpand();
    expect(noHandle.sheet.state).toBe('partially-expanded');
  });

  // spec: bottom-sheets-ccbb7f
  it('can be raised fully by the system or toggled by the user', async () => {
    const {sheet, settle} = await render();
    sheet.state = 'expanded';
    await sheet.show();
    await settle();
    expect(sheet.state).toBe('expanded');
    sheet.shadowRoot!
      .querySelector<HTMLElement>('.bottom-sheet-drag-handle')!
      .click();
    await settle();
    expect(sheet.state).toBe('partially-expanded');
  });

  // spec: bottom-sheets-03c53d
  it('lets content scroll horizontally without scrolling the sheet or the page', async () => {
    const root = env.render(html`
      <div style="position: relative; block-size: 600px; inline-size: 400px">
        <md-gb-bottom-sheet quick>
          <div id="row" style="overflow-x: auto; white-space: nowrap">
            <div style="inline-size: 1500px; block-size: 40px">Wide row</div>
          </div>
        </md-gb-bottom-sheet>
      </div>
    `);
    await env.waitForStability();
    const sheet = root.querySelector('md-gb-bottom-sheet') as BottomSheetElement;
    await sheet.show();
    await env.waitForStability();
    const row = root.querySelector<HTMLElement>('#row')!;
    const content = sheet.shadowRoot!.querySelector<HTMLElement>('.bottom-sheet-content')!;
    row.scrollLeft = 300;
    expect(row.scrollLeft).toBe(300);
    expect(content.scrollLeft).toBe(0);
    expect(window.scrollX).toBe(0);
    // The sheet content itself never scrolls sideways.
    expect(getComputedStyle(content).overflowX).not.toBe('scroll');
  });
});
