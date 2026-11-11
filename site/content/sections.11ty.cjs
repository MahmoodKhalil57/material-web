/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The index pages of the /3.0/ sections: /3.0/about/, /3.0/foundations/,
 * /3.0/styles/ and /3.0/components/. Their content is a spec
 * (spec/sections.cjs), rendered as JSON for the layout (contentFormat
 * `spec`); the text comes from docs/<section>/README.md.
 *
 * The pages carry the tag `gbsection` and `gbIndex: true`: the shell leaves
 * out its title block (the hero has the h1), and eleventy/site.cjs adds them
 * to the `gbAll` collection (sitemap, Markdown, llms.txt, search).
 */

const {SECTIONS} = require('../eleventy/site.cjs');
const {sectionSpec} = require('../spec/sections.cjs');

class GbSections {
  data() {
    return {
      layout: 'spec.html',
      contentFormat: 'spec',
      tags: ['gbsection'],
      gbIndex: true,
      order: 0,
      pagination: {data: 'gbSectionList', size: 1, alias: 'gbsec', addAllPagesToCollections: true},
      gbSectionList: SECTIONS,
      permalink: (data) => `/3.0/${data.gbsec.id}/`,
      eleventyComputed: {
        section: (data) => data.gbsec.id,
        title: (data) => data.gbsec.label,
        description: (data) => data.gbsec.description,
      },
    };
  }

  render(data) {
    return JSON.stringify(sectionSpec(data.gbsec));
  }
}

module.exports = GbSections;
