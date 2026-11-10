/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html} from 'lit';

/**
 * A mark for WAI-ARIA, which has no logo of its own: a person (accessible
 * to everyone) between the angle brackets of markup (roles and attributes on
 * the elements), in the current color.
 *
 * Source: Custom
 */
export const aria = html` <svg
  viewBox="0 0 96 96"
  fill="none"
  stroke="currentColor"
  stroke-width="7"
  stroke-linecap="round"
  stroke-linejoin="round">
  <path d="M26 28 10 48l16 20" />
  <path d="m70 28 16 20-16 20" />
  <circle cx="48" cy="26" r="7" fill="currentColor" stroke="none" />
  <path d="M34 42h28" />
  <path d="M48 42v14l-8 15" />
  <path d="m48 56 8 15" />
</svg>`;
