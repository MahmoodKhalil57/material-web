/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/components/button/md-gb-button.js';
import '@material/web/components/select/md-gb-autocomplete.js';
import '@material/web/components/select/md-gb-select.js';
import '@material/web/styles/icon/md-gb-icon.js';

import {type MaterialStoryInit} from './material-collection.js';
import {
  type AutocompleteFilter,
  type SelectVariant,
} from '@material/web/components/select/select.js';
import {type SelectBase} from '@material/web/components/select/select-base.js';
import {adoptStyles} from '@material/web/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/styles/m3.cssresult.js';
import {css, html} from 'lit';

/** Knob types for select stories. */
export interface StoryKnobs {
  variant: SelectVariant;
  label: string;
  supportingText: string;
  errorText: string;
  filter: AutocompleteFilter;
  disabled: boolean;
  required: boolean;
  error: boolean;
  leadingIcon: boolean;
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
  .demo {
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 24px;
    box-sizing: border-box;
  }

  h2 {
    font: var(--md-sys-typescale-title-md);
    letter-spacing: var(--md-sys-typescale-title-md-tracking);
    color: var(--md-sys-color-on-surface);
    margin: 0 0 16px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 24px 16px;
    align-items: start;
  }

  .grid > md-gb-select,
  .grid > md-gb-autocomplete,
  form > md-gb-select,
  form > md-gb-autocomplete {
    inline-size: 100%;
  }

  form {
    display: grid;
    gap: 16px;
    max-inline-size: 400px;
  }

  .actions {
    display: flex;
    gap: 8px;
  }

  output {
    font: var(--md-sys-typescale-body-md);
    color: var(--md-sys-color-on-surface-variant);
    white-space: pre-wrap;
  }
`;

const FRUITS = [
  'Apple',
  'Apricot',
  'Banana',
  'Blueberry',
  'Cherry',
  'Grape',
  'Lemon',
  'Mango',
  'Orange',
  'Peach',
  'Pear',
  'Pineapple',
  'Strawberry',
];

const US_STATES = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
];

function fruitOptions() {
  return FRUITS.map(
    (fruit) =>
      html`<md-gb-select-option
        value=${fruit.toLowerCase()}
        ?disabled=${fruit === 'Cherry'}
        >${fruit}</md-gb-select-option
      >`,
  );
}

function stateOptions() {
  return US_STATES.map(
    (state) => html`<md-gb-select-option>${state}</md-gb-select-option>`,
  );
}

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render(knobs) {
    const icon = (name: string) =>
      knobs.leadingIcon
        ? html`<md-gb-icon slot="leading-icon">${name}</md-gb-icon>`
        : '';
    return html`
      <div class="demo grid">
        <md-gb-select
          variant=${knobs.variant}
          label=${knobs.label}
          supporting-text=${knobs.supportingText}
          error-text=${knobs.errorText}
          ?disabled=${knobs.disabled}
          ?required=${knobs.required}
          ?error=${knobs.error}>
          ${icon('nutrition')} ${fruitOptions()}
        </md-gb-select>
        <md-gb-autocomplete
          variant=${knobs.variant}
          label="State"
          supporting-text=${knobs.supportingText}
          error-text=${knobs.errorText}
          filter=${knobs.filter}
          ?disabled=${knobs.disabled}
          ?required=${knobs.required}
          ?error=${knobs.error}>
          ${icon('location_on')} ${stateOptions()}
        </md-gb-autocomplete>
      </div>
    `;
  },
};

function variantGrid(variant: SelectVariant) {
  return html`
    <section>
      <h2>Select</h2>
      <div class="grid">
        <md-gb-select variant=${variant} label="Fruit"
          >${fruitOptions()}</md-gb-select
        >
        <md-gb-select variant=${variant} label="Fruit" value="mango"
          >${fruitOptions()}</md-gb-select
        >
        <md-gb-select
          variant=${variant}
          label="Fruit"
          supporting-text="Supporting text"
          >${fruitOptions()}</md-gb-select
        >
        <md-gb-select variant=${variant} label="Fruit" value="peach">
          <md-gb-icon slot="leading-icon">nutrition</md-gb-icon>
          ${fruitOptions()}
        </md-gb-select>
        <md-gb-select
          variant=${variant}
          label="Fruit"
          error
          error-text="Error text"
          >${fruitOptions()}</md-gb-select
        >
        <md-gb-select variant=${variant} label="Fruit" value="apple" disabled
          >${fruitOptions()}</md-gb-select
        >
      </div>
    </section>
    <section>
      <h2>Autocomplete</h2>
      <div class="grid">
        <md-gb-autocomplete variant=${variant} label="State"
          >${stateOptions()}</md-gb-autocomplete
        >
        <md-gb-autocomplete
          variant=${variant}
          label="State"
          value="Alaska"
          supporting-text="Type to filter"
          >${stateOptions()}</md-gb-autocomplete
        >
        <md-gb-autocomplete
          variant=${variant}
          label="State"
          filter="starts-with"
          supporting-text="Matches the start of the name">
          <md-gb-icon slot="leading-icon">search</md-gb-icon>
          ${stateOptions()}
        </md-gb-autocomplete>
        <md-gb-autocomplete
          variant=${variant}
          label="State"
          error
          error-text="Error text"
          >${stateOptions()}</md-gb-autocomplete
        >
        <md-gb-autocomplete variant=${variant} label="State" disabled
          >${stateOptions()}</md-gb-autocomplete
        >
      </div>
    </section>
  `;
}

const filled: MaterialStoryInit<StoryKnobs> = {
  name: 'Filled',
  styles,
  render() {
    return html`<div class="demo">${variantGrid('filled')}</div>`;
  },
};

const outlined: MaterialStoryInit<StoryKnobs> = {
  name: 'Outlined',
  styles,
  render() {
    return html`<div class="demo">${variantGrid('outlined')}</div>`;
  },
};

const options: MaterialStoryInit<StoryKnobs> = {
  name: 'Options',
  styles,
  render() {
    return html`
      <div class="demo grid">
        <md-gb-select label="Phone type" value="mobile">
          <md-gb-select-option value="business">
            <md-gb-icon slot="leading">business_center</md-gb-icon>
            Business
          </md-gb-select-option>
          <md-gb-select-option value="mobile">
            <md-gb-icon slot="leading">smartphone</md-gb-icon>
            Mobile
          </md-gb-select-option>
          <md-gb-select-option value="home">
            <md-gb-icon slot="leading">home</md-gb-icon>
            Home
          </md-gb-select-option>
        </md-gb-select>
        <md-gb-select label="Plan" variant="outlined">
          <md-gb-select-option value="free">
            Free
            <span slot="supporting-text">1 project</span>
            <span slot="trailing-text">$0</span>
          </md-gb-select-option>
          <md-gb-select-option value="pro">
            Pro
            <span slot="supporting-text">Unlimited projects</span>
            <span slot="trailing-text">$8</span>
          </md-gb-select-option>
          <md-gb-select-option value="team" disabled>
            Team
            <span slot="supporting-text">Coming soon</span>
          </md-gb-select-option>
        </md-gb-select>
      </div>
    `;
  },
};

const forms: MaterialStoryInit<StoryKnobs> = {
  name: 'Forms',
  styles,
  render() {
    const submit = (event: SubmitEvent) => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const output = form.querySelector('output')!;
      output.textContent = JSON.stringify(
        Object.fromEntries(new FormData(form)),
        null,
        2,
      );
    };
    const report = (event: Event) => {
      const form = (event.target as HTMLElement).closest('form')!;
      for (const field of form.querySelectorAll<SelectBase>(
        'md-gb-select, md-gb-autocomplete',
      )) {
        field.reportValidity();
      }
    };
    return html`
      <div class="demo">
        <form @submit=${submit} novalidate>
          <md-gb-select name="fruit" label="Fruit" required
            >${fruitOptions()}</md-gb-select
          >
          <md-gb-select name="size" label="Size" variant="outlined">
            <md-gb-select-option value="s">Small</md-gb-select-option>
            <md-gb-select-option value="m" selected>Medium</md-gb-select-option>
            <md-gb-select-option value="l">Large</md-gb-select-option>
          </md-gb-select>
          <md-gb-autocomplete name="state" label="State" required
            >${stateOptions()}</md-gb-autocomplete
          >
          <div class="actions">
            <md-gb-button color="filled" type="submit">Submit</md-gb-button>
            <md-gb-button color="outlined" type="button" @click=${report}
              >Validate</md-gb-button
            >
            <md-gb-button color="text" type="reset">Reset</md-gb-button>
          </div>
          <output></output>
        </form>
      </div>
    `;
  },
};

/** Select and autocomplete demo stories. */
export const stories = [playground, filled, outlined, options, forms];
