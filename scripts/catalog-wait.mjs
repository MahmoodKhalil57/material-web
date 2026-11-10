#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Waits until `npm run catalog:dev` serves up-to-date pages, checking every
 * 250ms (it rebuilds the pages in place when watched files change, and marks
 * the state "pending" as soon as it sees a change).
 *
 *   node scripts/catalog-wait.mjs              # after an edit: pages rebuilt
 *   node scripts/catalog-wait.mjs --ready      # any finished build (just started)
 *   node scripts/catalog-wait.mjs --timeout 90 # seconds (default 90)
 *
 * Without --ready it waits a short grace period (the watcher reports an edit
 * within milliseconds), then returns as soon as no build is pending or
 * running. An edit whose rebuild already finished returns at once instead of
 * waiting for a build that never comes.
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
const STATE = join(fileURLToPath(new URL('..', import.meta.url)), 'site', '.catalog-dev.json');
const ready = argv.includes('--ready');
const started = Date.now();
const GRACE = 1500;
const deadline = Date.now() + Number(opt('timeout', 90)) * 1000;

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
    console.error('no catalog:dev run recorded (site/.catalog-dev.json); start it with npm run catalog:dev');
    process.exit(2);
  }
  // A dead pid may be a run that was just replaced: the new one rewrites the
  // state within a few seconds.
  if (state && !alive(state.pid) && Date.now() - started > 5000) {
    console.error(`catalog:dev (pid ${state.pid}) is not running; start it with npm run catalog:dev`);
    process.exit(2);
  }
  const settled = (ready || Date.now() - started > GRACE) && state && alive(state.pid);
  if (state?.status === 'error' && settled) {
    console.error(`catalog:dev build failed: ${state.error}`);
    process.exit(1);
  }
  if (state?.status === 'ready' && settled) {
    console.log(`ready: http://localhost:${state.port}/ (build ${state.builds})`);
    process.exit(0);
  }
  await new Promise((r) => setTimeout(r, 250));
}
console.error('catalog:dev: timed out waiting for a build');
process.exit(1);
