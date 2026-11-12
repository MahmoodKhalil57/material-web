/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The search index of the /3.0/ docs (client: client/search-index.ts), written to
 * /3.0/search-index.json from collections.docs.
 *
 * Format (short keys, to stay small):
 *
 *   {"v": 1,
 *    "pages": [{
 *      "u": "/3.0/components/button/",  // url
 *      "t": "Button",                   // title
 *      "s": "components",               // section
 *      "d": "description",
 *      "x": [                           // sections: intro, then each h2/h3
 *        ["", "", "text", "identifiers"],            // intro (no heading)
 *        ["usage-guidelines", "Usage guidelines", "text", "identifiers"]
 *      ]}]}
 *
 * The ids are the ones of the rendered heading anchors (markdown-it-anchor,
 * eleventy/permalinks.cjs). Text excludes demo previews and
 * code blocks; identifiers are the inline code and the code blocks' element
 * names, attributes and custom properties, which the API tables are full of.
 */

const cheerio = require('cheerio');
const markdownIt = require('markdown-it');
const permalinks = require('../eleventy/permalinks.cjs');
const {pageMarkdown} = require('../eleventy/site.cjs');

// The site's markdown-it setup (eleventy.config.cjs), so the heading ids are
// the ones of the rendered pages.
const md = markdownIt({html: true, breaks: false, linkify: true});
permalinks(md);

/** Markup that is not prose: previews, anchors' hidden text, scripts. */
const SKIP = 'script, style, iframe, svg, template, .demo-preview, .offscreen, a.anchor, md-gb-tabs';

const INLINE = new Set(['a', 'abbr', 'b', 'code', 'em', 'i', 'kbd', 'mark', 'small', 'span', 'strong', 'sub', 'sup']);

const squash =(s) => s.replace(/\s+/g, ' ').trim();

/** Splits one page's rendered content into sections. */
function sectionsOf(html) {
  const $ = cheerio.load(html, null, false);
  $(SKIP).remove();
  const sections = [{id: '', heading: '', text: [], idents: new Set()}];
  let current = sections[0];

  const addIdents = (text) => {
    for (const m of text.match(/(?:--[a-z][\w-]*|[a-z]+(?:-[a-z0-9]+)+)/gi) ?? []) {
      current.idents.add(m);
    }
  };

  const walk = (node) => {
    if (node.type === 'text') {
      current.text.push(node.data);
      return;
    }
    if (node.type !== 'tag') return;
    const name = node.name;
    if (name === 'h1') return; // The page title is its own field.
    if ((name === 'h2' || name === 'h3') && node.attribs?.id) {
      current = {
        id: node.attribs.id,
        heading: squash($(node).text()),
        text: [],
        idents: new Set(),
      };
      sections.push(current);
      return;
    }
    if (name === 'pre') {
      // Code blocks: only element names, attributes and properties.
      addIdents($(node).text());
      return;
    }
    if (name === 'figure' && $(node).hasClass('demo')) {
      // The demo's caption; its code is not searched.
      const caption = node.attribs['aria-label'];
      if (caption) current.text.push(' ' + caption + ' ');
      return;
    }
    if (name === 'code') {
      // Inline code that names something: element, attribute, property, event
      // or method. Plain words (`open`, `true`) are in the text already.
      const text = squash($(node).text());
      if (
        text.length > 3 &&
        text.length < 48 &&
        /^[-\w:.()@]+$/.test(text) &&
        /[-_:.()]|[a-z][A-Z]/.test(text)
      ) {
        current.idents.add(text);
      }
    }
    // Inline elements keep their text attached to the neighbors.
    const sep = INLINE.has(name) ? '' : ' ';
    current.text.push(sep);
    for (const child of node.children ?? []) walk(child);
    current.text.push(sep);
  };

  for (const node of $.root().contents().toArray()) walk(node);
  return sections.map((s) => ({
    id: s.id,
    heading: s.heading,
    text: squash(s.text.join('')),
    idents: [...s.idents].join(' '),
  }));
}

class SearchIndex {
  data() {
    return {
      permalink: '/3.0/search-index.json',
      eleventyExcludeFromCollections: true,
    };
  }

  async render(data) {
    const items = [...(data.collections?.docs ?? []), ...(data.collections?.sectionIndex ?? [])]
      .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));
    const pages = [];
    for (const item of items) {
      // The page as clean Markdown (demos as their code, API tables expanded),
      // rendered like the pages.
      const html = md.render(await pageMarkdown(item));
      const description = item.data.description ?? '';
      const sections = sectionsOf(html)
        // The description is its own field: not repeated in the intro.
        .map((s) => (s.id || !description ? s : {...s, text: s.text.replace(description, '').trim()}))
        // Drop empty sections, but keep the intro when it has text.
        .filter((s) => s.text || s.idents || s.id)
        .map((s) => [s.id, s.heading, s.text, s.idents]);
      pages.push({
        u: item.url,
        t: item.data.title ?? '',
        s: item.data.section ?? '',
        d: item.data.description ?? '',
        x: sections,
      });
    }
    return JSON.stringify({v: 1, pages});
  }
}

module.exports = SearchIndex;
