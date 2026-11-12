/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The index pages of the /3.0/ sections: /3.0/about/, /3.0/foundations/,
 * /3.0/styles/ and /3.0/components/. Their content is a spec
 * (specs/sections.cjs), rendered as JSON for the layout (contentFormat
 * `spec`); the text comes from docs/<section>/README.md.
 *
 * The pages carry the tag `sectionIndex` and `indexPage: true`: the shell leaves
 * out its title block (the hero has the h1), and eleventy/site.cjs adds them
 * to the `allPages` collection (sitemap, Markdown, llms.txt, search).
 */

const {SECTIONS} = require('../eleventy/site.cjs');
const {sectionSpec} = require('../specs/sections.cjs');

class GbSections {
  data() {
    return {
      layout: 'spec.html',
      contentFormat: 'spec',
      tags: ['sectionIndex'],
      indexPage: true,
      order: 0,
      pagination: {data: 'sectionList', size: 1, alias: 'sec', addAllPagesToCollections: true},
      sectionList: SECTIONS,
      permalink: (data) => `/3.0/${data.sec.id}/`,
      eleventyComputed: {
        section: (data) => data.sec.id,
        title: (data) => data.sec.label,
        description: (data) => data.sec.description,
      },
    };
  }

  render(data) {
    return JSON.stringify(sectionSpec(data.sec));
  }
}

module.exports = GbSections;
