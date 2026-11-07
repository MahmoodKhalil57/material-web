/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * /robots.txt: everything is allowed. The site root is the v2.5 docs, which
 * have no sitemap of their own; /3.0/ has one, listed here.
 */

const {absolute} = require('../eleventy-helpers/gb-site.cjs');

class GbRobots {
  data() {
    return {permalink: '/robots.txt', eleventyExcludeFromCollections: true};
  }

  render() {
    return (
      '# The 3.0 docs (/3.0/) also publish Markdown at each page URL plus .md,\n' +
      `# ${absolute('/3.0/llms.txt')} and ${absolute('/3.0/llms-full.txt')}.\n` +
      'User-agent: *\n' +
      'Allow: /\n' +
      '\n' +
      `Sitemap: ${absolute('/3.0/sitemap.xml')}\n`
    );
  }
}

module.exports = GbRobots;
