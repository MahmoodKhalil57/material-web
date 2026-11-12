/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/** /3.0/llms-full.txt: the Markdown of every /3.0/ page in one file. */

const {SITE, absolute, pageMarkdown, sorted} = require('../eleventy/site.cjs');

class LlmsFull {
  data() {
    return {permalink: '/3.0/llms-full.txt', eleventyExcludeFromCollections: true};
  }

  async render(data) {
    const parts = [`# ${SITE.name} (full documentation)\n\n> ${SITE.description}\n`];
    for (const page of sorted([...(data.collections?.docs ?? []), ...(data.collections?.sectionIndex ?? [])])) {
      parts.push(`---\n\nSource: ${absolute(page.url)}\n\n${await pageMarkdown(page)}`);
    }
    return parts.join('\n');
  }
}

module.exports = LlmsFull;
