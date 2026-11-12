/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The measured heights of the framed demos (an md-gb-demo whose example is
 * its own document, `srcdoc`), by a hash of the document. A frame's height
 * is known only once its document has loaded, so a page reserves it from
 * the last build: scripts/dev.mjs measures the frames of the built pages
 * (at the width the pages are walked at) and builds again when a height is
 * new, and content.cjs gives each frame its measured height. The page then
 * doesn't move as the frames load.
 */

const {createHash} = require('node:crypto');
const {existsSync, readFileSync} = require('node:fs');
const {join} = require('node:path');

const FILE = join(__dirname, '..', '_dev-gb', 'frame-heights.json');

/** The key of a frame's document. */
const frameKey = (srcdoc) => createHash('sha1').update(srcdoc).digest('hex').slice(0, 16);

let heights;
/** The measured height (px) of a frame's document, if any. */
function measuredHeight(srcdoc) {
  heights ??= existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : {};
  return heights[frameKey(srcdoc)];
}

module.exports = {FILE, frameKey, measuredHeight};
