/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import "@material/web/components/chip/md-gb-chip.js";
import "@material/web/components/chip/md-gb-chip-set.js";
import "@material/web/styles/icons/md-gb-icon.js";

import { MaterialStoryInit } from "./material-collection.js";
import { type ChipType } from "@material/web/components/chip/chip.js";
import { adoptStyles } from "@material/web/styles/adopt-styles.js";
import { styles as m3Styles } from "@material/web/styles/m3.cssresult.js";
import { css, html } from "lit";

/** Knob types for chip stories. */
export interface StoryKnobs {
  type?: ChipType;
  elevated?: boolean;
  selected?: boolean;
  removable?: boolean;
  dragged?: boolean;
  disabled?: boolean;
  softDisabled?: boolean;
  density?: string;
}

adoptStyles(document, [
  m3Styles,
  css`
    :root {
      --md-icon-font: "Material Symbols Outlined";
    }
  `,
]);

const styles = css`
  .demo-group {
    margin-bottom: 16px;
  }
  .demo-label {
    font: var(--md-sys-typescale-title-sm);
    color: var(--md-sys-color-on-surface-variant);
    margin: 0 0 8px;
  }
  .chip-avatar {
    background-color: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font: var(--md-sys-typescale-label-md);
  }
`;

function removeChip(event: Event) {
  (event.target as HTMLElement).remove();
}

const playground: MaterialStoryInit<StoryKnobs> = {
  name: "Playground",
  styles,
  render(knobs) {
    return html`
      <md-gb-chip-set
        class="demo-group"
        aria-label="Playground"
        density=${knobs.density ?? "0"}
      >
        <md-gb-chip
          type=${knobs.type || "assist"}
          ?elevated=${knobs.elevated ?? false}
          ?selected=${knobs.selected ?? false}
          ?removable=${knobs.removable ?? false}
          ?dragged=${knobs.dragged ?? false}
          ?disabled=${knobs.disabled ?? false}
          ?soft-disabled=${knobs.softDisabled ?? false}
        >
          <md-gb-icon slot="icon">event</md-gb-icon>
          Chip
        </md-gb-chip>
      </md-gb-chip-set>
    `;
  },
};

const assist: MaterialStoryInit<StoryKnobs> = {
  name: "Assist chips",
  styles,
  render() {
    return html`
      <p class="demo-label">Flat</p>
      <md-gb-chip-set class="demo-group" aria-label="Assist chips">
        <md-gb-chip>Add to calendar</md-gb-chip>
        <md-gb-chip>
          <md-gb-icon slot="icon">event</md-gb-icon>
          Add to calendar
        </md-gb-chip>
        <md-gb-chip href="https://m3.material.io/components/chips">
          <md-gb-icon slot="icon">open_in_new</md-gb-icon>
          Link
        </md-gb-chip>
        <md-gb-chip disabled>
          <md-gb-icon slot="icon">event</md-gb-icon>
          Disabled
        </md-gb-chip>
      </md-gb-chip-set>
      <p class="demo-label">Elevated</p>
      <md-gb-chip-set class="demo-group" aria-label="Elevated assist chips">
        <md-gb-chip elevated>
          <md-gb-icon slot="icon">local_taxi</md-gb-icon>
          Get a ride
        </md-gb-chip>
        <md-gb-chip elevated dragged>
          <md-gb-icon slot="icon">drag_indicator</md-gb-icon>
          Dragged
        </md-gb-chip>
        <md-gb-chip elevated disabled>
          <md-gb-icon slot="icon">local_taxi</md-gb-icon>
          Disabled
        </md-gb-chip>
      </md-gb-chip-set>
    `;
  },
};

const filter: MaterialStoryInit<StoryKnobs> = {
  name: "Filter chips",
  styles,
  render() {
    return html`
      <p class="demo-label">Flat</p>
      <md-gb-chip-set class="demo-group" aria-label="Filter chips">
        <md-gb-chip type="filter">Unselected</md-gb-chip>
        <md-gb-chip type="filter" selected>Selected</md-gb-chip>
        <md-gb-chip type="filter">
          <md-gb-icon slot="icon">restaurant</md-gb-icon>
          Leading icon
        </md-gb-chip>
        <md-gb-chip type="filter">
          Price
          <md-gb-icon slot="trailing-icon">arrow_drop_down</md-gb-icon>
        </md-gb-chip>
        <md-gb-chip type="filter" disabled>Disabled</md-gb-chip>
        <md-gb-chip type="filter" selected disabled
          >Selected disabled</md-gb-chip
        >
      </md-gb-chip-set>
      <p class="demo-label">Elevated</p>
      <md-gb-chip-set class="demo-group" aria-label="Elevated filter chips">
        <md-gb-chip type="filter" elevated>Unselected</md-gb-chip>
        <md-gb-chip type="filter" elevated selected>Selected</md-gb-chip>
        <md-gb-chip type="filter" elevated disabled>Disabled</md-gb-chip>
      </md-gb-chip-set>
    `;
  },
};

const input: MaterialStoryInit<StoryKnobs> = {
  name: "Input chips",
  styles,
  render() {
    return html`
      <md-gb-chip-set
        class="demo-group"
        aria-label="Input chips"
        @remove=${removeChip}
      >
        <md-gb-chip type="input" removable>Hiking</md-gb-chip>
        <md-gb-chip type="input" removable>
          <md-gb-icon slot="icon">landscape</md-gb-icon>
          Leading icon
        </md-gb-chip>
        <md-gb-chip type="input" removable>
          <span slot="icon" class="chip-avatar">A</span>
          Avatar
        </md-gb-chip>
        <md-gb-chip type="input" removable selected>
          <span slot="icon" class="chip-avatar">B</span>
          Selected
        </md-gb-chip>
        <md-gb-chip type="input" removable disabled>Disabled</md-gb-chip>
        <md-gb-chip type="input" removable dragged>Dragged</md-gb-chip>
      </md-gb-chip-set>
    `;
  },
};

const suggestion: MaterialStoryInit<StoryKnobs> = {
  name: "Suggestion chips",
  styles,
  render() {
    return html`
      <p class="demo-label">Flat</p>
      <md-gb-chip-set class="demo-group" aria-label="Suggestion chips">
        <md-gb-chip type="suggestion">Sounds good</md-gb-chip>
        <md-gb-chip type="suggestion">
          <md-gb-icon slot="icon">thumb_up</md-gb-icon>
          Leading icon
        </md-gb-chip>
        <md-gb-chip type="suggestion" disabled>Disabled</md-gb-chip>
      </md-gb-chip-set>
      <p class="demo-label">Elevated</p>
      <md-gb-chip-set class="demo-group" aria-label="Elevated suggestion chips">
        <md-gb-chip type="suggestion" elevated>See you then</md-gb-chip>
        <md-gb-chip type="suggestion" elevated disabled>Disabled</md-gb-chip>
      </md-gb-chip-set>
    `;
  },
};

const chipSet: MaterialStoryInit<StoryKnobs> = {
  name: "Chip set",
  styles: [
    styles,
    css`
      .single-line {
        max-inline-size: 360px;
      }
    `,
  ],
  render() {
    const filters = [
      "Breakfast",
      "Lunch",
      "Dinner",
      "Vegetarian",
      "Vegan",
      "Gluten free",
      "Open now",
      "Delivery",
    ];
    return html`
      <p class="demo-label">Wrapping (arrow keys, Home and End move focus)</p>
      <md-gb-chip-set class="demo-group" aria-label="Meal filters">
        ${filters.map(
          (label) => html`<md-gb-chip type="filter">${label}</md-gb-chip>`,
        )}
      </md-gb-chip-set>
      <p class="demo-label">Single line (scrolls horizontally)</p>
      <div class="demo-group single-line">
        <md-gb-chip-set single-line aria-label="Meal filters, single line">
          ${filters.map(
            (label) => html`<md-gb-chip type="filter">${label}</md-gb-chip>`,
          )}
        </md-gb-chip-set>
      </div>
      <p class="demo-label">
        Input chips (Delete removes; focus moves to the next chip)
      </p>
      <md-gb-chip-set
        class="demo-group"
        aria-label="Guests"
        @remove=${removeChip}
      >
        ${["Ana", "Ben", "Chloe", "Dev"].map(
          (name) =>
            html`<md-gb-chip type="input" removable>
              <span slot="icon" class="chip-avatar">${name[0]}</span>
              ${name}
            </md-gb-chip>`,
        )}
      </md-gb-chip-set>
    `;
  },
};

// chips.md: "Avoid applying density by default". Each step removes 4dp from
// the chip height; the touch target stays 48dp "regardless of placement or
// density".
const density: MaterialStoryInit<StoryKnobs> = {
  name: "Density",
  styles,
  render() {
    return html`${["0", "-1", "-2", "-3"].map(
      (d) =>
        html`<p class="demo-label">Density ${d}</p>
          <md-gb-chip-set
            class="demo-group"
            aria-label="Density ${d}"
            density=${d}
          >
            <md-gb-chip>Assist</md-gb-chip>
            <md-gb-chip type="filter" selected>Filter</md-gb-chip>
            <md-gb-chip type="input" removable>
              <span slot="icon" class="chip-avatar">A</span>
              Input
            </md-gb-chip>
            <md-gb-chip type="suggestion">Suggestion</md-gb-chip>
          </md-gb-chip-set>`,
    )}`;
  },
};

/** Chip stories. */
export const stories = [
  playground,
  assist,
  filter,
  input,
  suggestion,
  chipSet,
  density,
];
