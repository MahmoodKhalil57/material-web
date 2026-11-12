/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * /3.0/llms.txt (https://llmstxt.org): the sections and pages of the /3.0/
 * docs, each with its description and a link to its Markdown version.
 */

const {SECTIONS, SITE, absolute, mdUrl, sorted} = require('../eleventy/site.cjs');

class Llms {
  data() {
    return {permalink: '/3.0/llms.txt', eleventyExcludeFromCollections: true};
  }

  render(data) {
    // The section index pages (order 0) head their sections.
    const pages = sorted([...(data.collections?.docs ?? []), ...(data.collections?.sectionIndex ?? [])]);
    const lines = [
      `# ${SITE.name}`,
      '',
      `> ${SITE.description}`,
      '',
      'Every page is also available as Markdown at its URL plus `.md`. ' +
        `All pages in one file: [llms-full.txt](${absolute('/3.0/llms-full.txt')}).`,
      '',
      `The API of every element (attributes, members, events, slots, CSS parts and properties) as a Custom Elements Manifest: [custom-elements.json](${absolute('/3.0/custom-elements.json')}). ` +
        `An agent skill about the md-gb elements: [skill/index.json](${absolute('/3.0/skill/index.json')}) lists its files with their URLs.`,
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

module.exports = Llms;
