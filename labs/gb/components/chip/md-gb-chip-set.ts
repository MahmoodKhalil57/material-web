/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChipSetElement } from "./chip-set-element.js";

export * from "./chip-set-element.js";

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design Expressive chip set. */
    "md-gb-chip-set": ChipSetElement;
  }
}

customElements.define("md-gb-chip-set", ChipSetElement);
