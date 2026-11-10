/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/components/button/md-gb-button.js';
import '@material/web/components/datepicker/md-gb-date-picker.js';

import {type MaterialStoryInit} from './material-collection.js';
import {
  type DatePickerElement,
  type DatePickerValueDetail,
} from '@material/web/components/datepicker/date-picker-element.js';
import {adoptStyles} from '@material/web/styles/adopt-styles.js';
import {css, html} from 'lit';
import {createRef, ref, type Ref} from 'lit/directives/ref.js';

import {styles as m3Styles} from '@material/web/styles/m3.cssresult.js';

/** Knob types for date picker stories. */
export interface StoryKnobs {
  locale: string;
  firstDayOfWeek: string;
  min: string;
  max: string;
  disableWeekends: boolean;
  hideActions: boolean;
  clearable: boolean;
  rtl: boolean;
  quick: boolean;
  density: string;
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

  .demo-row {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 24px;
  }

  .demo-output {
    margin: 0;
    min-block-size: 1.5em;
    color: var(--md-sys-color-on-surface-variant);
    font: var(--md-sys-typescale-body-md);
  }

  md-gb-date-picker[variant='docked']:not([inline]) {
    inline-size: 320px;
  }

  .demo-phone {
    inline-size: 360px;
    block-size: 640px;
    border: 1px solid var(--md-sys-color-outline-variant);
    overflow: hidden;
  }

  .demo-phone md-gb-date-picker {
    block-size: 100%;
  }
`;

const isWeekend = (iso: string) => {
  const day = new Date(`${iso}T00:00:00Z`).getUTCDay();
  return day === 0 || day === 6;
};

function common(knobs: StoryKnobs) {
  return {
    locale: knobs.locale,
    firstDayOfWeek: Number(knobs.firstDayOfWeek),
    min: knobs.min,
    max: knobs.max,
    isDateDisabled: knobs.disableWeekends ? isWeekend : null,
    dir: knobs.rtl ? 'rtl' : 'ltr',
  };
}

function report(output: Ref<HTMLParagraphElement>) {
  return (event: CustomEvent<DatePickerValueDetail>) => {
    if (output.value) {
      output.value.textContent = `change: ${event.detail.value || '(none)'}`;
    }
  };
}

const docked: MaterialStoryInit<StoryKnobs> = {
  name: 'Docked date picker',
  styles,
  render(knobs) {
    const opts = common(knobs);
    const single = createRef<HTMLParagraphElement>();
    const range = createRef<HTMLParagraphElement>();
    return html`
      <div class="demo-container" dir=${opts.dir}>
        <section class="demo-section">
          <h2>Docked date picker</h2>
          <div class="demo-row">
            <md-gb-date-picker
              value="2025-08-17"
              locale=${opts.locale}
              first-day-of-week=${opts.firstDayOfWeek}
              min=${opts.min}
              max=${opts.max}
              .isDateDisabled=${opts.isDateDisabled}
              ?hide-actions=${knobs.hideActions}
              ?clearable=${knobs.clearable}
              ?quick=${knobs.quick}
              density=${knobs.density}
              @change=${report(single)}
            ></md-gb-date-picker>
            <md-gb-date-picker
              range
              label="Trip dates"
              value="2025-08-17/2025-08-23"
              locale=${opts.locale}
              first-day-of-week=${opts.firstDayOfWeek}
              min=${opts.min}
              max=${opts.max}
              .isDateDisabled=${opts.isDateDisabled}
              ?hide-actions=${knobs.hideActions}
              ?clearable=${knobs.clearable}
              ?quick=${knobs.quick}
              density=${knobs.density}
              @change=${report(range)}
            ></md-gb-date-picker>
          </div>
          <p class="demo-output" aria-live="polite" ${ref(single)}></p>
          <p class="demo-output" aria-live="polite" ${ref(range)}></p>
        </section>
        <section class="demo-section">
          <h2>Required (form validation)</h2>
          <form
            class="demo-row"
            @submit=${(event: SubmitEvent) => {
              event.preventDefault();
            }}
          >
            <md-gb-date-picker
              name="date"
              required
              label="Event date"
              locale=${opts.locale}
              min=${opts.min}
              max=${opts.max}
              ?quick=${knobs.quick}
            ></md-gb-date-picker>
            <md-gb-button type="submit" color="tonal">Submit</md-gb-button>
          </form>
        </section>
        <section class="demo-section">
          <h2>Docked calendar (inline, swipe between months)</h2>
          <div class="demo-row">
            <md-gb-date-picker
              inline
              value="2025-08-17"
              locale=${opts.locale}
              first-day-of-week=${opts.firstDayOfWeek}
              min=${opts.min}
              max=${opts.max}
              .isDateDisabled=${opts.isDateDisabled}
              ?hide-actions=${knobs.hideActions}
              ?clearable=${knobs.clearable}
              ?quick=${knobs.quick}
            ></md-gb-date-picker>
            <md-gb-date-picker
              inline
              range
              value="2025-08-17/2025-08-23"
              locale=${opts.locale}
              first-day-of-week=${opts.firstDayOfWeek}
              min=${opts.min}
              max=${opts.max}
              .isDateDisabled=${opts.isDateDisabled}
              ?hide-actions=${knobs.hideActions}
              ?clearable=${knobs.clearable}
              ?quick=${knobs.quick}
            ></md-gb-date-picker>
          </div>
        </section>
      </div>
    `;
  },
};

const modal: MaterialStoryInit<StoryKnobs> = {
  name: 'Modal date picker',
  styles,
  render(knobs) {
    const opts = common(knobs);
    const single = createRef<DatePickerElement>();
    const input = createRef<DatePickerElement>();
    const range = createRef<DatePickerElement>();
    const fullscreen = createRef<DatePickerElement>();
    const output = createRef<HTMLParagraphElement>();
    const open = (picker: Ref<DatePickerElement>) => () => {
      picker.value?.show();
    };
    const picker = (
      pickerRef: Ref<DatePickerElement>,
      value: string,
      isRange: boolean,
      mode: 'picker' | 'input',
      isFullscreen = false,
    ) =>
      html`<md-gb-date-picker
        ${ref(pickerRef)}
        variant="modal"
        ?fullscreen=${isFullscreen}
        mode=${mode}
        ?range=${isRange}
        value=${value}
        locale=${opts.locale}
        first-day-of-week=${opts.firstDayOfWeek}
        min=${opts.min}
        max=${opts.max}
        .isDateDisabled=${opts.isDateDisabled}
        ?hide-actions=${knobs.hideActions}
        ?clearable=${knobs.clearable}
        ?quick=${knobs.quick}
        density=${knobs.density}
        @change=${report(output)}
      ></md-gb-date-picker>`;
    return html`
      <div class="demo-container" dir=${opts.dir}>
        <section class="demo-section">
          <h2>Modal date picker</h2>
          <div class="demo-row">
            <md-gb-button color="filled" @click=${open(single)}>
              Pick a date
            </md-gb-button>
            <md-gb-button color="tonal" @click=${open(input)}>
              Enter a date
            </md-gb-button>
            <md-gb-button color="outlined" @click=${open(range)}>
              Pick a date range
            </md-gb-button>
            <md-gb-button color="text" @click=${open(fullscreen)}>
              Full-screen date range
            </md-gb-button>
          </div>
          <p class="demo-output" aria-live="polite" ${ref(output)}></p>
        </section>
        ${picker(single, '2025-08-17', false, 'picker')}
        ${picker(input, '2025-08-17', false, 'input')}
        ${picker(range, '2025-08-17/2025-08-23', true, 'picker')}
        ${picker(fullscreen, '2025-08-17/2025-08-23', true, 'picker', true)}
        <section class="demo-section">
          <h2>Modal surfaces (inline)</h2>
          <div class="demo-row">
            <md-gb-date-picker
              inline
              variant="modal"
              value="2025-08-17"
              locale=${opts.locale}
              first-day-of-week=${opts.firstDayOfWeek}
              min=${opts.min}
              max=${opts.max}
              .isDateDisabled=${opts.isDateDisabled}
              ?hide-actions=${knobs.hideActions}
              ?clearable=${knobs.clearable}
            ></md-gb-date-picker>
            <md-gb-date-picker
              inline
              variant="modal"
              mode="input"
              value="2025-08-17"
              locale=${opts.locale}
              min=${opts.min}
              max=${opts.max}
              ?hide-actions=${knobs.hideActions}
            ></md-gb-date-picker>
            <md-gb-date-picker
              inline
              variant="modal"
              range
              value="2025-08-17/2025-08-23"
              locale=${opts.locale}
              first-day-of-week=${opts.firstDayOfWeek}
              min=${opts.min}
              max=${opts.max}
              .isDateDisabled=${opts.isDateDisabled}
              ?hide-actions=${knobs.hideActions}
            ></md-gb-date-picker>
          </div>
        </section>
        <section class="demo-section">
          <h2>Full-screen date range (inline)</h2>
          <div class="demo-row">
            <div class="demo-phone">
              <md-gb-date-picker
                inline
                fullscreen
                variant="modal"
                range
                value="2025-08-17/2025-08-23"
                locale=${opts.locale}
                first-day-of-week=${opts.firstDayOfWeek}
                min=${opts.min}
                max=${opts.max}
                .isDateDisabled=${opts.isDateDisabled}
                ?hide-actions=${knobs.hideActions}
              ></md-gb-date-picker>
            </div>
          </div>
        </section>
      </div>
    `;
  },
};

/** Date picker demo stories. */
export const stories = [docked, modal];
