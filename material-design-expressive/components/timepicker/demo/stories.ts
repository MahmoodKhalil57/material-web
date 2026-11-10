/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/components/button/md-gb-button.js';
import '@material/web/components/timepicker/md-gb-time-picker.js';

import {type MaterialStoryInit} from './material-collection.js';
import {
  type TimePickerElement,
  type TimePickerHourCycle,
} from '@material/web/components/timepicker/time-picker-element.js';
import {
  type TimePickerMode,
  type TimePickerOrientation,
} from '@material/web/components/timepicker/time-picker.js';
import {adoptStyles} from '@material/web/styles/adopt-styles.js';
import {css, html} from 'lit';
import {createRef, ref} from 'lit/directives/ref.js';

import {styles as m3Styles} from '@material/web/styles/m3.cssresult.js';

/** Knob types for time picker stories. */
export interface StoryKnobs {
  value: string;
  hourCycle: string;
  orientation: string;
  mode: string;
  disabled: boolean;
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
    align-items: flex-start;
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
    font: var(--md-sys-typescale-body-md);
    letter-spacing: var(--md-sys-typescale-body-md-tracking);
    color: var(--md-sys-color-on-surface-variant);
    margin: 0;
  }
`;

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render(knobs) {
    const output = createRef<HTMLOutputElement>();
    const show = (event: Event) => {
      const picker = event.target as TimePickerElement;
      output.value!.textContent = `${event.type}: value ${
        picker.value || '(none)'
      }, pending ${picker.pendingValue}`;
    };
    return html`
      <div class="demo-container">
        <section class="demo-section">
          <h2>Inline</h2>
          <md-gb-time-picker
            .value=${knobs.value}
            .hourCycle=${knobs.hourCycle as TimePickerHourCycle}
            .orientation=${knobs.orientation as TimePickerOrientation | ''}
            .mode=${knobs.mode as TimePickerMode}
            density=${knobs.density}
            ?disabled=${knobs.disabled}
            @input=${show}
            @change=${show}
            @cancel=${show}
          ></md-gb-time-picker>
          <output class="demo-output" ${ref(output)}></output>
        </section>
      </div>
    `;
  },
};

const modal: MaterialStoryInit<StoryKnobs> = {
  name: 'Modal',
  styles,
  render(knobs) {
    const picker = createRef<TimePickerElement>();
    const output = createRef<HTMLOutputElement>();
    return html`
      <div class="demo-container">
        <section class="demo-section">
          <h2>Modal</h2>
          <md-gb-button color="filled" @click=${() => picker.value?.show()}>
            Set alarm
          </md-gb-button>
          <md-gb-time-picker
            ${ref(picker)}
            modal
            .value=${knobs.value}
            .hourCycle=${knobs.hourCycle as TimePickerHourCycle}
            .orientation=${knobs.orientation as TimePickerOrientation | ''}
            .mode=${knobs.mode as TimePickerMode}
            @change=${() => {
              output.value!.textContent = `Alarm set for ${picker.value!.value}`;
            }}
            @cancel=${() => {
              output.value!.textContent = 'Canceled';
            }}
          ></md-gb-time-picker>
          <output class="demo-output" ${ref(output)}></output>
        </section>
      </div>
    `;
  },
};

const variants: MaterialStoryInit<StoryKnobs> = {
  name: 'Variants',
  styles,
  render() {
    return html`
      <div class="demo-container">
        <section class="demo-section">
          <h2>Dial, vertical (12h and 24h)</h2>
          <div class="demo-row">
            <md-gb-time-picker
              value="07:00"
              hour-cycle="12"
              orientation="vertical"
            ></md-gb-time-picker>
            <md-gb-time-picker
              value="20:00"
              hour-cycle="24"
              orientation="vertical"
            ></md-gb-time-picker>
          </div>
        </section>
        <section class="demo-section">
          <h2>Dial, horizontal (12h and 24h)</h2>
          <div class="demo-row">
            <md-gb-time-picker
              value="07:00"
              hour-cycle="12"
              orientation="horizontal"
            ></md-gb-time-picker>
            <md-gb-time-picker
              value="20:00"
              hour-cycle="24"
              orientation="horizontal"
            ></md-gb-time-picker>
          </div>
        </section>
        <section class="demo-section">
          <h2>Input (12h and 24h)</h2>
          <div class="demo-row">
            <md-gb-time-picker
              mode="input"
              value="07:00"
              hour-cycle="12"
            ></md-gb-time-picker>
            <md-gb-time-picker
              mode="input"
              value="20:00"
              hour-cycle="24"
            ></md-gb-time-picker>
          </div>
        </section>
      </div>
    `;
  },
};

// time-pickers.md "Density": "High-density time picker displayed on mobile";
// "Don't apply density to the time picker dial when the viewport is
// constrained. Instead, use an input picker." The horizontal layout keeps a
// full-size dial.
const density: MaterialStoryInit<StoryKnobs> = {
  name: 'Density',
  styles,
  render() {
    return html`
      <div class="demo-container">
        <section class="demo-section">
          <h2>Dial, vertical: density 0 and -3</h2>
          <div class="demo-row">
            <md-gb-time-picker
              value="07:00"
              hour-cycle="12"
              orientation="vertical"
            ></md-gb-time-picker>
            <md-gb-time-picker
              value="07:00"
              hour-cycle="12"
              orientation="vertical"
              density="-3"
            ></md-gb-time-picker>
          </div>
        </section>
        <section class="demo-section">
          <h2>Input: density 0 and -3</h2>
          <div class="demo-row">
            <md-gb-time-picker
              mode="input"
              value="07:00"
              hour-cycle="12"
            ></md-gb-time-picker>
            <md-gb-time-picker
              mode="input"
              value="07:00"
              hour-cycle="12"
              density="-3"
            ></md-gb-time-picker>
          </div>
        </section>
      </div>
    `;
  },
};

/** Time picker demo stories. */
export const stories = [playground, modal, variants, density];
