/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * /3.0/manifest.webmanifest. Icons are generated from images/favicon.svg by
 * site/scripts/assets.mjs into /3.0/icons/. Colors are baseline
 * md-sys-color tokens (styles/m3.css).
 */

const {SITE, baselineColors} = require('../eleventy/site.cjs');

class Manifest {
  data() {
    return {permalink: '/3.0/manifest.webmanifest', eleventyExcludeFromCollections: true};
  }

  render() {
    const {light} = baselineColors();
    return JSON.stringify(
      {
        name: SITE.name,
        short_name: 'Material Web',
        description: SITE.description,
        id: '/3.0/',
        start_url: '/3.0/',
        scope: '/3.0/',
        display: 'standalone',
        lang: 'en',
        theme_color: light.primary,
        background_color: light.surface,
        icons: [
          {src: '/3.0/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any'},
          {src: '/3.0/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any'},
          {src: '/3.0/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable'},
          {src: '/images/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any'},
        ],
      },
      null,
      2,
    ) + '\n';
  }
}

module.exports = Manifest;
