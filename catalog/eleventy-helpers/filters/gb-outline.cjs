/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Filter `gbOutline`: the page outline (the TOC plugin's nested lists of
 * heading links) as the destinations of an expanded `md-gb-nav-rail`, one
 * per heading, with its depth (1 for an h2, 2 for an h3) for the indent.
 * Used by the layout's outline panel (site/_includes/gb/default.html).
 *
 *   {{ content | toc | filterToc | gbOutline | safe }}
 *
 * The link text is kept as the plugin wrote it (already escaped).
 *
 * @param eleventyConfig The 11ty config in which to attach the filter.
 */
function gbOutline(eleventyConfig) {
  eleventyConfig.addFilter('gbOutline', (toc) => {
    const items = [];
    let depth = 0;
    const tokens = /<(\/?)(ol|ul)\b[^>]*>|<a href="(#[^"]*)"[^>]*>([\s\S]*?)<\/a>/g;
    for (const match of String(toc ?? '').matchAll(tokens)) {
      if (match[2]) {
        depth += match[1] ? -1 : 1;
      } else {
        const text = match[4].replace(/<[^>]+>/g, '').trim();
        items.push(
          `<md-gb-nav-rail-item href="${match[3]}" data-depth="${Math.max(1, depth)}">${text}</md-gb-nav-rail-item>`,
        );
      }
    }
    return items.join('\n');
  });
}

module.exports = gbOutline;
