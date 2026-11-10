/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The Markdown version of every /3.0/ page, at the page's URL plus `.md`
 * (/3.0/styles/motion/ -> /3.0/styles/motion.md; /3.0/ -> /3.0/index.md).
 * Rendered by eleventy-helpers/gb-site.cjs, like llms-full.txt.
 */

const {mdUrl, pageMarkdown} = require('../eleventy-helpers/gb-site.cjs');

class GbMarkdown {
  data() {
    return {
      pagination: {data: 'collections.gbAll', size: 1, alias: 'gbpage'},
      permalink: (data) => mdUrl(data.gbpage.url),
      eleventyExcludeFromCollections: true,
    };
  }

  async render(data) {
    return pageMarkdown(data.gbpage);
  }
}

module.exports = GbMarkdown;
