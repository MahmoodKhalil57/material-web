/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/button/md-gb-button.js';
import '@material/web/labs/gb/components/dialog/md-gb-dialog.js';
import '@material/web/labs/gb/styles/icon/md-gb-icon.js';

import {type MaterialStoryInit} from './material-collection.js';
import {type DialogElement} from '@material/web/labs/gb/components/dialog/dialog-element.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {css, html} from 'lit';
import {createRef, ref, type Ref} from 'lit/directives/ref.js';

import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';

/** Knob types for dialog stories. */
export interface StoryKnobs {
  headline: string;
  supportingText: string;
  icon: string;
  quick: boolean;
  noFocusTrap: boolean;
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

  .demo-output {
    font: var(--md-sys-typescale-body-md);
    letter-spacing: var(--md-sys-typescale-body-md-tracking);
    color: var(--md-sys-color-on-surface-variant);
    margin: 0;
    min-block-size: 20px;
  }

  .actions-form {
    display: contents;
  }

  .choices {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .choices label {
    display: flex;
    align-items: center;
    gap: 16px;
    min-block-size: 48px;
  }

  .fields {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .fields label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font: var(--md-sys-typescale-body-sm);
    letter-spacing: var(--md-sys-typescale-body-sm-tracking);
  }

  .fields input {
    font: var(--md-sys-typescale-body-lg);
    padding: 12px 16px;
    border: 1px solid var(--md-sys-color-outline);
    border-radius: var(--md-sys-shape-corner-xs);
    background: transparent;
    color: var(--md-sys-color-on-surface);
  }
`;

const RINGTONES = [
  'None',
  'Callisto',
  'Ganymede',
  'Luna',
  'Oberon',
  'Phobos',
  'Dione',
  'Europa',
  'Io',
  'Titan',
  'Rhea',
  'Triton',
];

/** Opens a dialog and reports its `returnValue` once it has closed. */
function openAndReport(
  dialog: Ref<DialogElement>,
  output: Ref<HTMLParagraphElement>,
) {
  return async () => {
    const el = dialog.value;
    if (!el) return;
    el.returnValue = '';
    el.addEventListener(
      'closed',
      () => {
        if (output.value) {
          output.value.textContent = `Closed with returnValue "${el.returnValue}"`;
        }
      },
      {once: true},
    );
    await el.show();
  };
}

const basic: MaterialStoryInit<StoryKnobs> = {
  name: 'Basic dialog',
  styles,
  render(knobs) {
    const plain = createRef<DialogElement>();
    const withIcon = createRef<DialogElement>();
    const scrolling = createRef<DialogElement>();
    const output = createRef<HTMLParagraphElement>();
    const closeWith = (dialog: Ref<DialogElement>, value: string) => () =>
      dialog.value?.close(value);

    return html`
      <div class="demo-container">
        <section class="demo-section">
          <h2>Basic dialog</h2>
          <div class="demo-controls">
            <md-gb-button color="filled" @click=${openAndReport(plain, output)}>
              Open dialog
            </md-gb-button>
            <md-gb-button
              color="tonal"
              @click=${openAndReport(withIcon, output)}>
              Open with hero icon
            </md-gb-button>
            <md-gb-button
              color="outlined"
              @click=${openAndReport(scrolling, output)}>
              Open scrolling list
            </md-gb-button>
          </div>
          <p class="demo-output" aria-live="polite" ${ref(output)}></p>
        </section>

        <md-gb-dialog
          ${ref(plain)}
          ?quick=${knobs.quick}
          ?no-focus-trap=${knobs.noFocusTrap}>
          <span slot="headline">${knobs.headline}</span>
          ${knobs.supportingText}
          <md-gb-button slot="actions" @click=${closeWith(plain, 'cancel')}
            >Cancel</md-gb-button
          >
          <md-gb-button slot="actions" @click=${closeWith(plain, 'delete')}
            >Delete</md-gb-button
          >
        </md-gb-dialog>

        <md-gb-dialog
          ${ref(withIcon)}
          ?quick=${knobs.quick}
          ?no-focus-trap=${knobs.noFocusTrap}>
          <md-gb-icon slot="icon">${knobs.icon}</md-gb-icon>
          <span slot="headline">Reset settings?</span>
          This will reset your app preferences back to their default settings.
          The following accounts will also be signed out.
          <form id="reset-form" method="dialog" class="actions-form"></form>
          <md-gb-button slot="actions" form="reset-form" value="cancel"
            >Cancel</md-gb-button
          >
          <md-gb-button slot="actions" form="reset-form" value="reset"
            >Reset</md-gb-button
          >
        </md-gb-dialog>

        <md-gb-dialog
          ${ref(scrolling)}
          ?quick=${knobs.quick}
          ?no-focus-trap=${knobs.noFocusTrap}>
          <span slot="headline">Choose a ringtone</span>
          <ul class="choices">
            ${RINGTONES.map(
              (name, i) => html`<li>
                <label
                  ><input
                    type="radio"
                    name="ringtone"
                    value=${name}
                    ?checked=${i === 1} />${name}</label
                >
              </li>`,
            )}
          </ul>
          <md-gb-button slot="actions" @click=${closeWith(scrolling, 'cancel')}
            >Cancel</md-gb-button
          >
          <md-gb-button
            slot="actions"
            @click=${() => {
              const checked =
                scrolling.value?.querySelector<HTMLInputElement>(
                  'input:checked',
                );
              scrolling.value?.close(checked?.value ?? '');
            }}
            >OK</md-gb-button
          >
        </md-gb-dialog>
      </div>
    `;
  },
};

const fullScreen: MaterialStoryInit<StoryKnobs> = {
  name: 'Full-screen dialog',
  styles,
  render(knobs) {
    const dialog = createRef<DialogElement>();
    const discard = createRef<DialogElement>();
    const output = createRef<HTMLParagraphElement>();

    // Spec: dismissing a full-screen dialog confirms discarding unsaved
    // changes with a basic dialog in front of it.
    const confirmDiscard = async (event: Event) => {
      event.preventDefault();
      const confirm = discard.value;
      if (!confirm) return;
      confirm.returnValue = '';
      const closed = new Promise((resolve) => {
        confirm.addEventListener('closed', resolve, {once: true});
      });
      await confirm.show();
      await closed;
      if (confirm.returnValue === 'discard') {
        dialog.value?.close('discard');
      }
    };

    return html`
      <div class="demo-container">
        <section class="demo-section">
          <h2>Full-screen dialog</h2>
          <div class="demo-controls">
            <md-gb-button
              color="filled"
              @click=${openAndReport(dialog, output)}>
              New event
            </md-gb-button>
          </div>
          <p class="demo-output" aria-live="polite" ${ref(output)}></p>
        </section>

        <md-gb-dialog
          ${ref(dialog)}
          full-screen
          ?quick=${knobs.quick}
          ?no-focus-trap=${knobs.noFocusTrap}
          @cancel=${confirmDiscard}>
          <span slot="headline">New event</span>
          <md-gb-button slot="actions" @click=${() => dialog.value?.close('save')}
            >Save</md-gb-button
          >
          <div class="fields">
            <label>Event name <input type="text" /></label>
            <label>Location <input type="text" /></label>
            <label>Starts <input type="datetime-local" /></label>
            <label>Ends <input type="datetime-local" /></label>
          </div>
        </md-gb-dialog>

        <md-gb-dialog ${ref(discard)} ?quick=${knobs.quick}>
          <span slot="headline">Discard draft?</span>
          <md-gb-button
            slot="actions"
            @click=${() => discard.value?.close('keep')}
            >Keep editing</md-gb-button
          >
          <md-gb-button
            slot="actions"
            @click=${() => discard.value?.close('discard')}
            >Discard</md-gb-button
          >
        </md-gb-dialog>
      </div>
    `;
  },
};

/** Dialog demo stories. */
export const stories = [basic, fullScreen];
