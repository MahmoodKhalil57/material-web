/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Whether the site is built with the M3 Expressive (labs/gb) components:
 * the header toggle, Expressive variants of examples, and Expressive-only
 * component pages. Set by `npm run catalog:dev`; off for regular builds.
 */
module.exports = process.env.MWC_EXPRESSIVE === '1';
