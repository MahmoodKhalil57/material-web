/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Site-wide values of the /3.0/ docs. `url` (no trailing slash) is the
 * production origin used in absolute URLs: canonical, Open Graph, JSON-LD,
 * sitemap.xml, llms.txt and robots.txt. Override with MWC_SITE_URL.
 */
module.exports = {
  url: (process.env.MWC_SITE_URL || 'https://material-web.dev').replace(/\/+$/, ''),
  name: 'Material Web 3.0',
  description:
    'Material Web 3.0: Material 3 Expressive components, styles and foundations built as web components.',
};
