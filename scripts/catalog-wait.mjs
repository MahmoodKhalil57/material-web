#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Waits for `npm run catalog:dev` to finish its next build, checking every
 * 250ms (it rebuilds the pages in place when watched files change).
 *
 *   node scripts/catalog-wait.mjs              # a build that ends after now
 *   node scripts/catalog-wait.mjs --ready      # any finished build
 *   node scripts/catalog-wait.mjs --timeout 300
 *
 * Exits 0 when ready (prints the URL), 1 on a build error or timeout, 2 when
 * no catalog:dev run is recorded.
 */

import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const argv = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : fallback;
};
const STATE = join(fileURLToPath(new URL('..', import.meta.url)), 'catalog', '.catalog-dev.json');
const since = argv.includes('--ready') ? 0 : Date.now();
const started = Date.now();
const deadline = Date.now() + Number(opt('timeout', 300)) * 1000;

/** Whether the process that wrote the state is still running. */
function alive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

while (Date.now() < deadline) {
  let state;
  try {
    state = JSON.parse(await readFile(STATE, 'utf8'));
  } catch {
    state = undefined;
  }
  // No recorded run at all: give up quickly instead of waiting out the timeout.
  if (!state && Date.now() - started > 5000) {
    console.error('no catalog:dev run recorded (catalog/.catalog-dev.json); start it with npm run catalog:dev');
    process.exit(2);
  }
  if (state && !alive(state.pid)) {
    console.error(`catalog:dev (pid ${state.pid}) is not running; start it with npm run catalog:dev`);
    process.exit(2);
  }
  if (state?.status === 'error' && state.at >= since) {
    console.error(`catalog:dev build failed: ${state.error}`);
    process.exit(1);
  }
  if (state?.status === 'ready' && state.at >= since) {
    console.log(`ready: http://localhost:${state.port}/ (build ${state.builds})`);
    process.exit(0);
  }
  await new Promise((r) => setTimeout(r, 250));
}
console.error('catalog:dev: timed out waiting for a build');
process.exit(1);
