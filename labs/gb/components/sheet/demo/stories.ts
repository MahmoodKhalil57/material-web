/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/button/md-gb-button.js';
import '@material/web/labs/gb/components/sheet/md-gb-bottom-sheet.js';
import '@material/web/labs/gb/components/sheet/md-gb-side-sheet.js';

import {type MaterialStoryInit} from './material-collection.js';
import {type BottomSheetElement} from '@material/web/labs/gb/components/sheet/bottom-sheet-element.js';
import {type SideSheetElement} from '@material/web/labs/gb/components/sheet/side-sheet-element.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {css, html} from 'lit';
import {createRef, ref} from 'lit/directives/ref.js';

import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';

/** Knob types for sheet stories. */
export interface StoryKnobs {
  skipPartiallyExpanded: boolean;
  hideDragHandle: boolean;
  headline: string;
  hasBackButton: boolean;
  divider: boolean;
  rtl: boolean;
}

adoptStyles(document, [m3Styles]);

const styles = css`
  .demo-container {
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 24px;
    box-sizing: border-box;
  }

  .demo-section {
    display: flex;
    flex-direction: column;
    gap: 16px;

    h2 {
      font: var(--md-sys-typescale-headline-sm);
      letter-spacing: var(--md-sys-typescale-headline-sm-tracking);
      margin: 0;
      color: var(--md-sys-color-on-surface);
    }
  }

  .demo-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .demo-hint,
  .stage-text {
    font: var(--md-sys-typescale-body-md);
    letter-spacing: var(--md-sys-typescale-body-md-tracking);
    color: var(--md-sys-color-on-surface-variant);
    margin: 0;
  }

  /* A standard bottom sheet sits at the bottom of its positioned container. */
  .bottom-stage {
    position: relative;
    overflow: hidden;
    block-size: 480px;
    max-inline-size: 720px;
    background-color: var(--md-sys-color-surface);
    border: 2px dashed var(--md-sys-color-outline-variant);
    border-radius: 16px;
    box-sizing: border-box;
    padding: 24px;
  }

  /* A standard side sheet sits at the end of a flex row. */
  .side-stage {
    display: flex;
    overflow: hidden;
    block-size: 480px;
    background-color: var(--md-sys-color-surface);
    border: 2px dashed var(--md-sys-color-outline-variant);
    border-radius: 16px;
    box-sizing: border-box;
  }

  .side-stage-main {
    flex: 1;
    min-inline-size: 0;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .sheet-list {
    list-style: none;
    margin: 0;
    padding: 0 0 24px;
  }

  .sheet-list li {
    font: var(--md-sys-typescale-body-lg);
    letter-spacing: var(--md-sys-typescale-body-lg-tracking);
    color: var(--md-sys-color-on-surface);
    padding: 16px 24px;
  }

  .side-sheet-text {
    font: var(--md-sys-typescale-body-md);
    letter-spacing: var(--md-sys-typescale-body-md-tracking);
    color: var(--md-sys-color-on-surface-variant);
    margin: 0 0 16px;
  }
`;

const items = [
  'Share',
  'Get link',
  'Edit name',
  'Make a copy',
  'Download',
  'Move to folder',
  'Add to starred',
  'Details',
  'Report',
  'Remove',
];

function sheetList() {
  return html`<ul class="sheet-list">
    ${items.map((item) => html`<li>${item}</li>`)}
  </ul>`;
}

const bottomSheets: MaterialStoryInit<StoryKnobs> = {
  name: 'Bottom sheets',
  styles,
  render(knobs) {
    const standardRef = createRef<BottomSheetElement>();
    const modalRef = createRef<BottomSheetElement>();
    const dir = knobs.rtl ? 'rtl' : 'ltr';

    return html`
      <div class="demo-container" dir=${dir}>
        <section class="demo-section">
          <h2>Standard</h2>
          <p class="demo-hint">
            Rests at the 56dp peek height. Drag the handle, or select it (click,
            Enter or Space) to expand and collapse.
          </p>
          <div class="demo-controls">
            <md-gb-button
              color="filled"
              @click=${() => standardRef.value?.show()}
            >
              Show standard sheet
            </md-gb-button>
            <md-gb-button
              color="outlined"
              @click=${() => standardRef.value?.close()}
            >
              Close
            </md-gb-button>
          </div>
          <div class="bottom-stage">
            <p class="stage-text">App content</p>
            <md-gb-bottom-sheet
              ${ref(standardRef)}
              open
              label="Standard bottom sheet"
              ?skip-partially-expanded=${knobs.skipPartiallyExpanded}
              ?hide-drag-handle=${knobs.hideDragHandle}
            >
              ${sheetList()}
            </md-gb-bottom-sheet>
          </div>
        </section>

        <section class="demo-section">
          <h2>Modal</h2>
          <p class="demo-hint">
            Opens to at most half the window above a scrim. Close it with the
            scrim, Escape or by swiping down.
          </p>
          <div class="demo-controls">
            <md-gb-button color="filled" @click=${() => modalRef.value?.show()}>
              Show modal sheet
            </md-gb-button>
          </div>
          <md-gb-bottom-sheet
            ${ref(modalRef)}
            modal
            label="File actions"
            ?skip-partially-expanded=${knobs.skipPartiallyExpanded}
            ?hide-drag-handle=${knobs.hideDragHandle}
          >
            ${sheetList()} ${sheetList()}
          </md-gb-bottom-sheet>
        </section>
      </div>
    `;
  },
};

function sideSheetBody(sheetRef: {value?: SideSheetElement}) {
  return html`
    <p class="side-sheet-text">
      Side sheets show secondary content and actions, such as filters, next to
      the main content.
    </p>
    <p class="side-sheet-text">
      The content scrolls vertically when it is taller than the sheet.
    </p>
    <md-gb-button
      slot="actions"
      color="filled"
      @click=${() => sheetRef.value?.close('save')}
    >
      Save
    </md-gb-button>
    <md-gb-button
      slot="actions"
      color="outlined"
      @click=${() => sheetRef.value?.close('cancel')}
    >
      Cancel
    </md-gb-button>
  `;
}

const sideSheets: MaterialStoryInit<StoryKnobs> = {
  name: 'Side sheets',
  styles,
  render(knobs) {
    const standardRef = createRef<SideSheetElement>();
    const detachedRef = createRef<SideSheetElement>();
    const modalRef = createRef<SideSheetElement>();
    const modalDetachedRef = createRef<SideSheetElement>();
    const dir = knobs.rtl ? 'rtl' : 'ltr';

    const standard = (
      sheetRef: typeof standardRef,
      title: string,
      detached: boolean,
    ) => html`
      <section class="demo-section">
        <h2>${title}</h2>
        <div class="side-stage">
          <div class="side-stage-main">
            <p class="stage-text">
              The main content shrinks while the sheet is open.
            </p>
            <div class="demo-controls">
              <md-gb-button
                color="filled"
                @click=${() => sheetRef.value?.show()}
              >
                Show
              </md-gb-button>
              <md-gb-button
                color="outlined"
                @click=${() => sheetRef.value?.close()}
              >
                Close
              </md-gb-button>
            </div>
          </div>
          <md-gb-side-sheet
            ${ref(sheetRef)}
            open
            ?detached=${detached}
            ?divider=${knobs.divider}
            ?has-back-button=${knobs.hasBackButton}
            headline=${knobs.headline}
          >
            ${sideSheetBody(sheetRef)}
          </md-gb-side-sheet>
        </div>
      </section>
    `;

    const modal = (
      sheetRef: typeof modalRef,
      title: string,
      detached: boolean,
    ) => html`
      <section class="demo-section">
        <h2>${title}</h2>
        <div class="demo-controls">
          <md-gb-button color="filled" @click=${() => sheetRef.value?.show()}>
            Show ${title.toLowerCase()} sheet
          </md-gb-button>
        </div>
        <md-gb-side-sheet
          ${ref(sheetRef)}
          modal
          ?detached=${detached}
          ?divider=${knobs.divider}
          ?has-back-button=${knobs.hasBackButton}
          headline=${knobs.headline}
        >
          ${sideSheetBody(sheetRef)}
        </md-gb-side-sheet>
      </section>
    `;

    return html`
      <div class="demo-container" dir=${dir}>
        ${standard(standardRef, 'Standard', false)}
        ${standard(detachedRef, 'Standard detached', true)}
        ${modal(modalRef, 'Modal', false)}
        ${modal(modalDetachedRef, 'Modal detached', true)}
      </div>
    `;
  },
};

/** Sheet demo stories. */
export const stories = [bottomSheets, sideSheets];
