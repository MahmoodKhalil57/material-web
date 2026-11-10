/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Filter `gbPager`: the previous and next /3.0/ page of `url`, in sidebar
 * order: the home page, then each section's overview page, then its pages by `order` (the same
 * order as the pages pane), section after section. Used by the layout's
 * previous / next links (site/_includes/gb/default.html).
 *
 *   {% set nav = collections.gb3 | gbPager(page.url, gbSections) %}
 *   nav.prev / nav.next: {url, title, section} or undefined
 *
 * @param eleventyConfig The 11ty config in which to attach the filter.
 */
function gbPager(eleventyConfig) {
  eleventyConfig.addFilter('gbPager', (pages, url, sections) => {
    // The home page (/3.0/, not in the collection) comes first.
    const sequence = [{url: '/3.0/', title: 'Home', section: 'Home'}];
    for (const section of sections ?? []) {
      sequence.push({
        url: `/3.0/${section.id}/`,
        title: `${section.label} overview`,
        section: section.label,
      });
      const inSection = (pages ?? [])
        .filter((page) => page.data?.section === section.id)
        .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));
      for (const page of inSection) {
        sequence.push({url: page.url, title: page.data.title, section: section.label});
      }
    }
    const index = sequence.findIndex((entry) => entry.url === url);
    if (index < 0) return {};
    return {prev: sequence[index - 1], next: sequence[index + 1]};
  });
}

module.exports = gbPager;
