/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-bottom-sheet.js';
import './md-gb-side-sheet.js';

import {sendKeys} from '@web/test-runner-commands';
import {html, type TemplateResult} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {BOTTOM_SHEET_STATES} from './bottom-sheet.js';
import {type BottomSheetElement} from './bottom-sheet-element.js';
import {type SideSheetElement} from './side-sheet-element.js';

adoptStyles(document, [m3Styles]);

function resolvedColor(token: string) {
  const probe = document.createElement('div');
  probe.style.color = `var(${token})`;
  document.body.appendChild(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return color;
}

function dialogOf(sheet: HTMLElement) {
  return sheet.shadowRoot!.querySelector<HTMLDialogElement>('dialog')!;
}

function panelOf(sheet: HTMLElement) {
  return sheet.shadowRoot!.querySelector<HTMLElement>('.sheet-panel')!;
}

function shadow(sheet: HTMLElement, selector: string) {
  return sheet.shadowRoot!.querySelector<HTMLElement>(selector)!;
}

describe('md-gb-bottom-sheet spec units', () => {
  const env = new Environment();

  async function render(template: TemplateResult, width = 400) {
    const root = env.render(html`
      <button id="before">Before</button>
      <div
        style="position: relative; block-size: 600px; inline-size: ${width}px"
      >
        ${template}
      </div>
    `);
    await env.waitForStability();
    const sheet = root.querySelector('md-gb-bottom-sheet') as BottomSheetElement;
    await sheet.updateComplete;
    return {root, sheet, before: root.querySelector<HTMLElement>('#before')!};
  }

  const tall = html`<md-gb-bottom-sheet quick>
    <div style="block-size: 400px">Tall content</div>
  </md-gb-bottom-sheet>`;
  const tallModal = html`<md-gb-bottom-sheet modal quick>
    <div style="block-size: 400px">Tall content</div>
  </md-gb-bottom-sheet>`;

  afterEach(() => {
    for (const el of document.querySelectorAll('md-gb-bottom-sheet')) {
      dialogOf(el).close();
    }
  });

  // spec: bottom-sheets-d3999a
  it('rounds the top corners of a bottom sheet with 28dp', async () => {
    const {sheet} = await render(tall);
    await sheet.show();
    const style = getComputedStyle(panelOf(sheet));
    expect(style.borderTopLeftRadius).toBe('28px');
    expect(style.borderTopRightRadius).toBe('28px');
    expect(style.borderBottomLeftRadius).toBe('0px');
    expect(style.borderBottomRightRadius).toBe('0px');
  });

  // spec: bottom-sheets-343604, bottom-sheets-c55aa3, bottom-sheets-10d0a2, bottom-sheets-bd1cb3
  it('colors the container surface container low and the drag handle on surface variant', async () => {
    const {sheet} = await render(tall);
    await sheet.show();
    expect(getComputedStyle(panelOf(sheet)).backgroundColor)
      .withContext('container')
      .toBe(resolvedColor('--md-sys-color-surface-container-low'));
    expect(
      getComputedStyle(shadow(sheet, '.bottom-sheet-drag-handle'))
        .backgroundColor,
    )
      .withContext('drag handle')
      .toBe(resolvedColor('--md-sys-color-on-surface-variant'));
  });

  // spec: bottom-sheets-ab671d, bottom-sheets-e6e77c, bottom-sheets-373971
  it('puts a modal sheet above a scrim and a standard sheet above none', async () => {
    const {sheet} = await render(tallModal);
    await sheet.show();
    const dialog = dialogOf(sheet);
    expect(dialog.matches(':modal')).toBeTrue();
    expect(getComputedStyle(dialog, '::backdrop').backgroundColor).toBe(
      resolvedColor('--md-sys-color-scrim'),
    );
    expect(Number(getComputedStyle(dialog, '::backdrop').opacity)).toBeGreaterThan(0);
    await sheet.close();

    const standard = (await render(tall)).sheet;
    await standard.show();
    expect(dialogOf(standard).matches(':modal')).toBeFalse();
    expect(dialogOf(standard).open).toBeTrue();
  });

  // spec: bottom-sheets-54fc7d, bottom-sheets-524bf8, bottom-sheets-0f0bab
  it('caps the sheet width at 640dp, which can be overridden', async () => {
    const {sheet} = await render(tallModal);
    await sheet.show();
    expect(window.innerWidth).toBeGreaterThan(640);
    expect(panelOf(sheet).getBoundingClientRect().width).toBe(640);
    await sheet.close();

    const {sheet: wide} = await render(
      html`<md-gb-bottom-sheet modal quick style="--max-width: 680px">
        <div style="block-size: 400px">Tall content</div>
      </md-gb-bottom-sheet>`,
    );
    await wide.show();
    expect(panelOf(wide).getBoundingClientRect().width).toBe(
      680,
    );
  });

  // spec: bottom-sheets-7e9842, bottom-sheets-8e434c
  it('extends across the width of a compact container', async () => {
    const {sheet} = await render(tall, 360);
    await sheet.show();
    expect(panelOf(sheet).getBoundingClientRect().width).toBe(360);
    expect(dialogOf(sheet).getBoundingClientRect().width).toBe(360);
  });

  // spec: bottom-sheets-8fb986
  it('scrolls when its content exceeds the viewable height', async () => {
    const {sheet} = await render(
      html`<md-gb-bottom-sheet quick state="expanded">
        <div style="block-size: 4000px">Very tall content</div>
      </md-gb-bottom-sheet>`,
    );
    await sheet.show();
    const content = shadow(sheet, '.bottom-sheet-content');
    expect(content.scrollHeight).toBeGreaterThan(content.clientHeight);
    content.scrollTop = 200;
    expect(content.scrollTop).toBe(200);
  });

  // spec: bottom-sheets-9b56c5, bottom-sheets-3039ea
  it('reserves the top 48dp of the sheet for resizing with the drag handle', async () => {
    const {sheet} = await render(tall);
    await sheet.show();
    const area = shadow(sheet, '.bottom-sheet-drag-area');
    const panelTop = panelOf(sheet).getBoundingClientRect().top;
    const areaRect = area.getBoundingClientRect();
    expect(areaRect.height).toBe(48);
    expect(areaRect.top).toBeCloseTo(panelTop, 0);
    // The handle's own touch target is 48dp, too.
    const target = getComputedStyle(
      shadow(sheet, '.bottom-sheet-drag-handle'),
      '::after',
    );
    expect(parseFloat(target.height)).toBe(48);
  });

  // spec: bottom-sheets-7ef7ac, bottom-sheets-358b3a, bottom-sheets-ecca14
  it('lands Tab on the drag handle and shows a visible focus ring', async () => {
    const {sheet, before} = await render(tall);
    await sheet.show();
    before.focus();
    await sendKeys({press: 'Tab'});
    const handle = shadow(sheet, '.bottom-sheet-drag-handle');
    expect(sheet.shadowRoot!.activeElement).toBe(handle);
    const style = getComputedStyle(handle);
    expect(style.outlineStyle).toBe('solid');
    expect(style.outlineColor).toBe(resolvedColor('--md-sys-color-secondary'));
  });

  // spec: bottom-sheets-329880
  it('toggles between the available heights with Enter and Space', async () => {
    const {sheet, before} = await render(tall);
    await sheet.show();
    before.focus();
    await sendKeys({press: 'Tab'});
    expect(sheet.state).toBe(BOTTOM_SHEET_STATES.partiallyExpanded);
    await sendKeys({press: 'Enter'});
    expect(sheet.state).toBe(BOTTOM_SHEET_STATES.expanded);
    await sendKeys({press: 'Space'});
    expect(sheet.state).toBe(BOTTOM_SHEET_STATES.partiallyExpanded);
  });

  // md.comp.sheet.bottom.docked.minimized.container.shape (corner none)
  it('exposes the minimized container shape token as square corners', async () => {
    const {sheet} = await render(html`<md-gb-bottom-sheet></md-gb-bottom-sheet>`);
    const style = getComputedStyle(panelOf(sheet));
    expect(style.getPropertyValue('--minimized-container-shape').trim()).toBe(
      style.getPropertyValue('--md-sys-shape-corner-none').trim(),
    );
  });
});

describe('md-gb-side-sheet spec units', () => {
  const env = new Environment();

  async function render(template: TemplateResult, dir = 'ltr') {
    const root = env.render(html`
      <button id="before">Before</button>
      <div
        dir=${dir}
        style="display: flex; block-size: 400px; inline-size: 800px"
      >
        <main tabindex="-1" style="flex: 1; block-size: 400px; overflow: auto">
          <div style="block-size: 2000px">Main</div>
        </main>
        ${template}
      </div>
    `);
    await env.waitForStability();
    const sheet = root.querySelector('md-gb-side-sheet') as SideSheetElement;
    await sheet.updateComplete;
    return {
      root,
      sheet,
      main: root.querySelector('main')!,
      before: root.querySelector<HTMLElement>('#before')!,
    };
  }

  const standard = html`<md-gb-side-sheet quick divider headline="Title">
    <p>Sheet content</p>
  </md-gb-side-sheet>`;
  const modal = html`<md-gb-side-sheet
    modal
    quick
    has-back-button
    headline="Title"
  >
    <p>Sheet content</p>
  </md-gb-side-sheet>`;

  afterEach(() => {
    for (const el of document.querySelectorAll('md-gb-side-sheet')) {
      dialogOf(el).close();
    }
  });

  // spec: side-sheets-21738f, side-sheets-6719f8
  it('rounds the inline-start corners of a modal side sheet with 16dp', async () => {
    const {sheet} = await render(modal);
    await sheet.show();
    const style = getComputedStyle(panelOf(sheet));
    expect(style.borderTopLeftRadius).toBe('16px');
    expect(style.borderBottomLeftRadius).toBe('16px');
  });

  // spec: side-sheets-f95028, side-sheets-6ae4a2, side-sheets-58c25a, side-sheets-d66393, side-sheets-ce873d
  it('colors a standard side sheet surface with on surface variant text', async () => {
    const {sheet} = await render(standard);
    await sheet.show();
    expect(getComputedStyle(panelOf(sheet)).backgroundColor)
      .withContext('container')
      .toBe(resolvedColor('--md-sys-color-surface'));
    expect(getComputedStyle(shadow(sheet, '.side-sheet-headline')).color)
      .withContext('headline')
      .toBe(resolvedColor('--md-sys-color-on-surface-variant'));
    expect(getComputedStyle(shadow(sheet, '.side-sheet-close')).color)
      .withContext('close icon')
      .toBe(resolvedColor('--md-sys-color-on-surface-variant'));
  });

  // spec: side-sheets-4e5a99, side-sheets-a357cf, side-sheets-2eb620, side-sheets-c2a59c, side-sheets-db5fab
  it('colors a modal side sheet surface container low with on surface variant text and icons', async () => {
    const {sheet} = await render(modal);
    await sheet.show();
    expect(getComputedStyle(panelOf(sheet)).backgroundColor)
      .withContext('container')
      .toBe(resolvedColor('--md-sys-color-surface-container-low'));
    expect(getComputedStyle(shadow(sheet, '.side-sheet-headline')).color)
      .withContext('headline')
      .toBe(resolvedColor('--md-sys-color-on-surface-variant'));
    expect(getComputedStyle(shadow(sheet, '.side-sheet-close')).color)
      .withContext('close icon')
      .toBe(resolvedColor('--md-sys-color-on-surface-variant'));
    expect(getComputedStyle(shadow(sheet, '.side-sheet-back')).color)
      .withContext('back icon')
      .toBe(resolvedColor('--md-sys-color-on-surface-variant'));
  });

  // spec: side-sheets-176a11
  it('has a fixed width and spans the height of its container', async () => {
    const {sheet} = await render(standard);
    await sheet.show();
    const rect = sheet.getBoundingClientRect();
    expect(rect.width).toBe(256);
    expect(rect.height).toBe(400);
  });

  // spec: side-sheets-8a9540
  it('can be resized through its width token', async () => {
    const {sheet} = await render(
      html`<md-gb-side-sheet quick headline="Title" style="--container-width: 320px">
      </md-gb-side-sheet>`,
    );
    await sheet.show();
    expect(sheet.getBoundingClientRect().width).toBe(320);
  });

  // spec: side-sheets-935faf, side-sheets-5c70fb
  it('mirrors a standard side sheet to the left edge in right-to-left languages', async () => {
    const ltr = await render(standard, 'ltr');
    await ltr.sheet.show();
    const ltrSheet = ltr.sheet.getBoundingClientRect();
    const ltrMain = ltr.main.getBoundingClientRect();
    expect(ltrSheet.left).toBeGreaterThan(ltrMain.left);
    const ltrClose = shadow(ltr.sheet, '.side-sheet-close').getBoundingClientRect();
    const ltrHeadline = shadow(ltr.sheet, '.side-sheet-headline').getBoundingClientRect();
    expect(ltrClose.left).toBeGreaterThan(ltrHeadline.left);
    await ltr.sheet.close();

    const rtl = await render(standard, 'rtl');
    await rtl.sheet.show();
    const rtlSheet = rtl.sheet.getBoundingClientRect();
    const rtlMain = rtl.main.getBoundingClientRect();
    expect(rtlSheet.left).toBeLessThan(rtlMain.left);
    const rtlClose = shadow(rtl.sheet, '.side-sheet-close').getBoundingClientRect();
    const rtlHeadline = shadow(rtl.sheet, '.side-sheet-headline').getBoundingClientRect();
    expect(rtlClose.left).toBeLessThan(rtlHeadline.left);
  });

  // spec: side-sheets-ce1c41, side-sheets-3eae43, side-sheets-e6c1f2
  it('scrolls vertically on its own, independent of the page', async () => {
    const {sheet, main} = await render(
      html`<md-gb-side-sheet quick headline="Title">
        <div style="block-size: 3000px">Tall content</div>
      </md-gb-side-sheet>`,
    );
    await sheet.show();
    const content = shadow(sheet, '.side-sheet-content');
    expect(getComputedStyle(content).overflowY).toBe('auto');
    expect(content.scrollHeight).toBeGreaterThan(content.clientHeight);
    content.scrollTop = 300;
    main.scrollTop = 700;
    expect(content.scrollTop).withContext('sheet keeps its position').toBe(300);
    expect(main.scrollTop).toBe(700);
    content.scrollTop = 100;
    expect(main.scrollTop).withContext('page keeps its position').toBe(700);
  });

  // spec: side-sheets-104f88, side-sheets-64ec58
  it('does not scroll horizontally', async () => {
    const {sheet} = await render(
      html`<md-gb-side-sheet quick headline="Title">
        <div style="inline-size: 2000px">Wide content</div>
      </md-gb-side-sheet>`,
    );
    await sheet.show();
    const content = shadow(sheet, '.side-sheet-content');
    expect(getComputedStyle(content).overflowX).toBe('hidden');
    const panel = panelOf(sheet);
    expect(getComputedStyle(panel).overflowX).toBe('hidden');
    expect(panel.getBoundingClientRect().width).toBe(256);
  });

  // spec: side-sheets-ab940a, side-sheets-cff2d5, side-sheets-362a31
  it('lands Tab on the icon buttons and the actions', async () => {
    const {sheet, before} = await render(
      html`<md-gb-side-sheet quick headline="Title" has-back-button>
        <button slot="actions" id="save">Save</button>
      </md-gb-side-sheet>`,
    );
    await sheet.show();
    before.focus();
    await sendKeys({press: 'Tab'});
    expect(sheet.shadowRoot!.activeElement).toBe(shadow(sheet, '.side-sheet-back'));
    // The headline is next in the focus order (headline, close, actions).
    await sendKeys({press: 'Tab'});
    expect(sheet.shadowRoot!.activeElement).toBe(shadow(sheet, '.side-sheet-headline'));
    await sendKeys({press: 'Tab'});
    expect(sheet.shadowRoot!.activeElement).toBe(shadow(sheet, '.side-sheet-close'));
    await sendKeys({press: 'Tab'});
    expect(document.activeElement).toBe(sheet.querySelector('#save'));
  });

  // spec: side-sheets-aae8d9, side-sheets-5f72b0
  it('activates the focused icon button with Space or Enter', async () => {
    const {sheet, before} = await render(
      html`<md-gb-side-sheet quick headline="Title" has-back-button>
      </md-gb-side-sheet>`,
    );
    await sheet.show();
    const back = jasmine.createSpy('back');
    sheet.addEventListener('back', back);
    before.focus();
    await sendKeys({press: 'Tab'});
    expect(sheet.shadowRoot!.activeElement).toBe(shadow(sheet, '.side-sheet-back'));
    await sendKeys({press: 'Enter'});
    expect(back).toHaveBeenCalledTimes(1);
    await sendKeys({press: 'Space'});
    expect(back).toHaveBeenCalledTimes(2);

    await sendKeys({press: 'Tab'});
    await sendKeys({press: 'Tab'});
    expect(sheet.shadowRoot!.activeElement).toBe(shadow(sheet, '.side-sheet-close'));
    await sendKeys({press: 'Space'});
    await env.waitForStability();
    expect(sheet.open).toBeFalse();
  });
  // spec: side-sheets-1a579d
  it('draws the standard side sheet divider with the outline variant role', async () => {
    const {sheet} = await render(html`
      <md-gb-side-sheet open quick divider headline="Title"></md-gb-side-sheet>
    `);
    expect(getComputedStyle(panelOf(sheet)).borderInlineStartColor).toBe(
      resolvedColor('--md-sys-color-outline-variant'),
    );
  });
});
