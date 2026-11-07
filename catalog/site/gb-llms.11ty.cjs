/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * /3.0/llms.txt (https://llmstxt.org): the sections and pages of the /3.0/
 * docs, each with its description and a link to its Markdown version.
 */

const {SECTIONS, SITE, absolute, mdUrl, sorted} = require('../eleventy-helpers/gb-site.cjs');

class GbLlms {
  data() {
    return {permalink: '/3.0/llms.txt', eleventyExcludeFromCollections: true};
  }

  render(data) {
    const pages = sorted(data.collections?.gb3 ?? []);
    const lines = [
      `# ${SITE.name}`,
      '',
      `> ${SITE.description}`,
      '',
      'Every page is also available as Markdown at its URL plus `.md`. ' +
        `All pages in one file: [llms-full.txt](${absolute('/3.0/llms-full.txt')}).`,
    ];
    for (const section of SECTIONS) {
      const inSection = pages.filter((p) => p.data.section === section.id);
      if (!inSection.length) continue;
      lines.push('', `## ${section.label}`, '');
      for (const p of inSection) {
        const description = String(p.data.description ?? '').replace(/\s+/g, ' ').trim();
        lines.push(`- [${p.data.title}](${absolute(mdUrl(p.url))})${description ? ': ' + description : ''}`);
      }
    }
    return lines.join('\n') + '\n';
  }
}

module.exports = GbLlms;
