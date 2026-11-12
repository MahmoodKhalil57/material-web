/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The Markdown version of every /3.0/ page, at the page's URL plus `.md`
 * (/3.0/styles/motion/ -> /3.0/styles/motion.md; /3.0/ -> /3.0/index.md).
 * Rendered by eleventy/site.cjs, like llms-full.txt.
 */

const {mdUrl, pageMarkdown} = require('../eleventy/site.cjs');

class MarkdownPages {
  data() {
    return {
      pagination: {data: 'collections.allPages', size: 1, alias: 'mdPage'},
      permalink: (data) => mdUrl(data.mdPage.url),
      eleventyExcludeFromCollections: true,
    };
  }

  async render(data) {
    return pageMarkdown(data.mdPage);
  }
}

module.exports = MarkdownPages;
