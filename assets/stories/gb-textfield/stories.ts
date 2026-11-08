/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/button/md-gb-button.js';
import '@material/web/labs/gb/components/iconbutton/md-gb-icon-button.js';
import '@material/web/labs/gb/components/textfield/md-gb-text-field.js';
import '@material/web/labs/gb/styles/icon/md-gb-icon.js';

import {type MaterialStoryInit} from './material-collection.js';
import {type TextFieldVariant} from '@material/web/labs/gb/components/textfield/text-field.js';
import {type TextFieldElement} from '@material/web/labs/gb/components/textfield/text-field-element.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';
import {css, html} from 'lit';

/** Knob types for text field stories. */
export interface StoryKnobs {
  variant: TextFieldVariant;
  label: string;
  placeholder: string;
  supportingText: string;
  errorText: string;
  prefixText: string;
  suffixText: string;
  maxLength: number;
  disabled: boolean;
  required: boolean;
  error: boolean;
  leadingIcon: boolean;
  trailingIcon: boolean;
  density: string;
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

  .grid md-gb-text-field,
  form md-gb-text-field {
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

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render(knobs) {
    return html`
      <div class="demo">
        <md-gb-text-field
          variant=${knobs.variant}
          density=${knobs.density}
          label=${knobs.label}
          placeholder=${knobs.placeholder}
          supporting-text=${knobs.supportingText}
          error-text=${knobs.errorText}
          prefix-text=${knobs.prefixText}
          suffix-text=${knobs.suffixText}
          .maxLength=${Number(knobs.maxLength)}
          ?disabled=${knobs.disabled}
          ?required=${knobs.required}
          ?error=${knobs.error}
        >
          ${
            knobs.leadingIcon
              ? html`<md-gb-icon slot="leading-icon">search</md-gb-icon>`
              : ''
          }
          ${
            knobs.trailingIcon
              ? html`<md-gb-icon slot="trailing-icon"
                  >${knobs.error ? 'error' : 'mic'}</md-gb-icon
                >`
              : ''
          }
        </md-gb-text-field>
      </div>
    `;
  },
};

function variantGrid(variant: TextFieldVariant) {
  return html`
    <div class="grid">
      <md-gb-text-field variant=${variant} label="Label"></md-gb-text-field>
      <md-gb-text-field
        variant=${variant}
        label="Label"
        value="Input text"
      ></md-gb-text-field>
      <md-gb-text-field
        variant=${variant}
        label="Label"
        placeholder="Placeholder"
        supporting-text="Supporting text"
      ></md-gb-text-field>
      <md-gb-text-field variant=${variant} label="Label" value="Input text">
        <md-gb-icon slot="leading-icon">search</md-gb-icon>
      </md-gb-text-field>
      <md-gb-text-field variant=${variant} label="Label" value="Input text">
        <md-gb-icon-button
          slot="trailing-icon"
          color="standard"
          aria-label="Clear"
        >
          <md-gb-icon>cancel</md-gb-icon>
        </md-gb-icon-button>
      </md-gb-text-field>
      <md-gb-text-field variant=${variant} label="Label">
        <md-gb-icon slot="leading-icon">search</md-gb-icon>
        <md-gb-icon slot="trailing-icon">mic</md-gb-icon>
      </md-gb-text-field>
      <md-gb-text-field
        variant=${variant}
        label="Amount"
        prefix-text="$"
        value="100"
      ></md-gb-text-field>
      <md-gb-text-field
        variant=${variant}
        label="Email"
        suffix-text="@gmail.com"
        value="name"
      ></md-gb-text-field>
      <md-gb-text-field
        variant=${variant}
        label="Username"
        required
        supporting-text="*required"
      ></md-gb-text-field>
      <md-gb-text-field
        variant=${variant}
        label="Bio"
        maxlength="20"
        .maxLength=${20}
        value="Hello"
        supporting-text="Supporting text"
      ></md-gb-text-field>
      <md-gb-text-field
        variant=${variant}
        label="ZIP code"
        value="1234"
        error
        error-text="Not a valid ZIP code"
      >
        <md-gb-icon slot="trailing-icon" aria-label="Error">error</md-gb-icon>
      </md-gb-text-field>
      <md-gb-text-field
        variant=${variant}
        label="Disabled"
        value="Input text"
        supporting-text="Supporting text"
        disabled
      ></md-gb-text-field>
      <md-gb-text-field
        variant=${variant}
        label="Read-only"
        value="Input text"
        readonly
        supporting-text="Read-only"
      ></md-gb-text-field>
      <md-gb-text-field
        variant=${variant}
        type="textarea"
        label="Text area"
        rows="3"
        supporting-text="Multi-line text area"
      ></md-gb-text-field>
      <md-gb-text-field
        variant=${variant}
        type="password"
        label="Password"
        value="secret"
      ></md-gb-text-field>
      <md-gb-text-field
        variant=${variant}
        type="date"
        label="Date"
      ></md-gb-text-field>
    </div>
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
      for (const field of form.querySelectorAll<TextFieldElement>(
        'md-gb-text-field',
      )) {
        field.reportValidity();
      }
    };
    return html`
      <div class="demo">
        <form @submit=${submit} novalidate>
          <md-gb-text-field
            name="name"
            label="Name"
            required
            supporting-text="*required"
          ></md-gb-text-field>
          <md-gb-text-field
            name="email"
            type="email"
            label="Email"
            required
          ></md-gb-text-field>
          <md-gb-text-field
            name="zip"
            label="ZIP code"
            pattern="[0-9]{5}"
            supporting-text="5 digits"
          ></md-gb-text-field>
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

// text-fields.md "Density": "Dense text fields enable people to scan and take
// action on large amounts of information"; "Avoid applying density by
// default". Each step removes 4px from the container height.
const density: MaterialStoryInit<StoryKnobs> = {
  name: 'Density',
  styles,
  render({variant}) {
    return html`
      <div class="demo">
        <div class="grid">
          ${[0, -1, -2, -3].map(
            (d) => html`
              <md-gb-text-field
                variant=${variant}
                density=${d}
                label="Density ${d}"
                value="Input text"
              ></md-gb-text-field>
              <md-gb-text-field
                variant=${variant}
                density=${d}
                label="Density ${d}"
                has-leading-icon
              >
                <md-gb-icon slot="leading-icon">search</md-gb-icon>
              </md-gb-text-field>
            `,
          )}
        </div>
      </div>
    `;
  },
};

/** Text field demo stories. */
export const stories = [playground, filled, outlined, forms, density];
