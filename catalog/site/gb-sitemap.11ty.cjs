/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/** /3.0/sitemap.xml: every /3.0/ page (the start page included). */

const {absolute, pageDate} = require('../eleventy-helpers/gb-site.cjs');

const xml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

class GbSitemap {
  data() {
    return {permalink: '/3.0/sitemap.xml', eleventyExcludeFromCollections: true};
  }

  render(data) {
    const urls = (data.collections?.gbAll ?? []).map(
      (p) => `  <url>\n    <loc>${xml(absolute(p.url))}</loc>\n    <lastmod>${pageDate(p).slice(0, 10)}</lastmod>\n  </url>`,
    );
    return (
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      urls.join('\n') +
      '\n</urlset>\n'
    );
  }
}

module.exports = GbSitemap;
