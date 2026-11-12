/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Pages that moved: a small page at the old URL with a meta refresh, a
 * canonical link and a link (GitHub Pages has no server redirects).
 */

const {absolute} = require('../eleventy/site.cjs');

const MOVED = [
  // Scaffold is a foundation (Foundations > Layout > Scaffold in M3).
  {from: '/3.0/components/scaffold/', to: '/3.0/foundations/scaffold/', title: 'Scaffold'},
];

class Redirects {
  data() {
    return {
      pagination: {data: 'movedPages', size: 1, alias: 'moved'},
      movedPages: MOVED,
      permalink: (data) => data.moved.from,
      eleventyExcludeFromCollections: true,
    };
  }

  render(data) {
    const {to, title} = data.moved;
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${title} has moved - Material Web 3.0</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <link rel="canonical" href="${absolute(to)}" />
    <meta http-equiv="refresh" content="0; url=${to}" />
  </head>
  <body>
    <p>${title} has moved to <a href="${to}">${absolute(to)}</a>.</p>
  </body>
</html>
`;
  }
}

module.exports = Redirects;
