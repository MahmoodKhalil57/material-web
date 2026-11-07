/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/segmentedbutton/md-gb-segmented-button-set.js';
import '@material/web/labs/gb/styles/icon/md-gb-icon.js';

import {type MaterialStoryInit} from './material-collection.js';
import {type SegmentedButtonSetElement} from '@material/web/labs/gb/components/segmentedbutton/segmented-button-set-element.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';
import {css, html, nothing} from 'lit';

/** Knob types for segmented button stories. */
export interface StoryKnobs {
  multiselect: boolean;
  required: boolean;
  segments: number;
  content: string;
  density: string;
  noCheckmark: boolean;
  disabled: boolean;
}

adoptStyles(document, [
  m3Styles,
  css`
    :root {
      --md-icon-font: 'Material Symbols Outlined';
    }
  `,
]);

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

  .demo-caption {
    font: var(--md-sys-typescale-body-md);
    letter-spacing: var(--md-sys-typescale-body-md-tracking);
    color: var(--md-sys-color-on-surface-variant);
    margin: 0;
  }
`;

interface Option {
  label: string;
  icon: string;
}

const OPTIONS: Option[] = [
  {label: 'Day', icon: 'calendar_view_day'},
  {label: 'Week', icon: 'calendar_view_week'},
  {label: 'Month', icon: 'calendar_view_month'},
  {label: 'Year', icon: 'calendar_today'},
  {label: 'All', icon: 'all_inclusive'},
];

interface SegmentOptions {
  selected?: boolean;
  disabled?: boolean;
  noCheckmark?: boolean;
}

/** `content` is 'label', 'icon-label' or 'icon'. */
function segment(
  {label, icon}: Option,
  content: string,
  {selected = false, disabled = false, noCheckmark = false}: SegmentOptions = {},
) {
  const showIcon = content !== 'label';
  const showLabel = content !== 'icon';
  return html`<md-gb-segmented-button
    value=${label.toLowerCase()}
    aria-label=${showLabel ? nothing : label}
    ?selected=${selected}
    ?disabled=${disabled}
    ?no-checkmark=${noCheckmark}
    >${showIcon
      ? html`<md-gb-icon slot="icon">${icon}</md-gb-icon>`
      : nothing}${showLabel ? label : nothing}</md-gb-segmented-button
  >`;
}

/** Writes the selection to the caption after the set. */
function showValue(event: Event) {
  const set = event.currentTarget as SegmentedButtonSetElement;
  const output = set.nextElementSibling;
  if (output) {
    output.textContent = `Selected: ${set.values.join(', ') || 'none'}`;
  }
}

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render(knobs) {
    const count = Math.min(5, Math.max(2, Math.round(knobs.segments || 3)));
    return html`
      <div class="demo-container">
        <section class="demo-section">
          <md-gb-segmented-button-set
            aria-label="Time range"
            ?multiselect=${knobs.multiselect}
            ?required=${knobs.required}
            ?disabled=${knobs.disabled}
            density=${knobs.density}
            @change=${showValue}>
            ${OPTIONS.slice(0, count).map((option, i) =>
              segment(option, knobs.content, {
                selected: i === 0,
                noCheckmark: knobs.noCheckmark,
              }),
            )}
          </md-gb-segmented-button-set>
          <p class="demo-caption">Selected: day</p>
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
          <h2>Single-select</h2>
          <md-gb-segmented-button-set
            aria-label="Beverage size"
            required
            @change=${showValue}>
            <md-gb-segmented-button value="small">Small</md-gb-segmented-button>
            <md-gb-segmented-button value="medium" selected
              >Medium</md-gb-segmented-button
            >
            <md-gb-segmented-button value="large">Large</md-gb-segmented-button>
          </md-gb-segmented-button-set>
          <p class="demo-caption">Selected: medium</p>
        </section>

        <section class="demo-section">
          <h2>Multi-select</h2>
          <md-gb-segmented-button-set
            aria-label="Price range"
            multiselect
            @change=${showValue}>
            <md-gb-segmented-button value="1" aria-label="Inexpensive"
              >$</md-gb-segmented-button
            >
            <md-gb-segmented-button value="2" selected aria-label="Moderate"
              >$$</md-gb-segmented-button
            >
            <md-gb-segmented-button value="3" selected aria-label="Pricey"
              >$$$</md-gb-segmented-button
            >
            <md-gb-segmented-button value="4" aria-label="Ultra high-end"
              >$$$$</md-gb-segmented-button
            >
          </md-gb-segmented-button-set>
          <p class="demo-caption">Selected: 2, 3</p>
        </section>

        <section class="demo-section">
          <h2>Segments (2 to 5)</h2>
          ${[2, 3, 4, 5].map(
            (count) =>
              html`<md-gb-segmented-button-set aria-label="${count} segments">
                ${OPTIONS.slice(0, count).map((option, i) =>
                  segment(option, 'label', {selected: i === 1}),
                )}
              </md-gb-segmented-button-set>`,
          )}
        </section>

        <section class="demo-section">
          <h2>Icons and labels</h2>
          ${['label', 'icon-label', 'icon'].map(
            (content) =>
              html`<md-gb-segmented-button-set aria-label="View" multiselect>
                ${OPTIONS.slice(0, 3).map((option, i) =>
                  segment(option, content, {selected: i === 0}),
                )}
              </md-gb-segmented-button-set>`,
          )}
        </section>

        <section class="demo-section">
          <h2>Density</h2>
          ${[0, -1, -2, -3].map(
            (density) =>
              html`<md-gb-segmented-button-set
                aria-label="Density ${density}"
                density=${density}>
                ${OPTIONS.slice(0, 3).map((option, i) =>
                  segment(option, 'label', {selected: i === 0}),
                )}
              </md-gb-segmented-button-set>`,
          )}
        </section>

        <section class="demo-section">
          <h2>Disabled</h2>
          <md-gb-segmented-button-set aria-label="Disabled segment">
            ${OPTIONS.slice(0, 3).map((option, i) =>
              segment(option, 'label', {selected: i === 0, disabled: i === 1}),
            )}
          </md-gb-segmented-button-set>
          <md-gb-segmented-button-set aria-label="Disabled set" disabled>
            ${OPTIONS.slice(0, 3).map((option, i) =>
              segment(option, 'icon-label', {selected: i === 0}),
            )}
          </md-gb-segmented-button-set>
        </section>

        <section class="demo-section" dir="rtl">
          <h2>RTL</h2>
          <md-gb-segmented-button-set aria-label="RTL" multiselect>
            ${OPTIONS.slice(0, 3).map((option, i) =>
              segment(option, 'icon-label', {selected: i === 0}),
            )}
          </md-gb-segmented-button-set>
        </section>
      </div>
    `;
  },
};

/** Segmented button demo stories. */
export const stories = [playground, variants];
