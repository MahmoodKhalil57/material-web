#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Runs the whole M3 Expressive pipeline and writes a review report.
 *
 *   npm run m3:update                 # download, regenerate, audit, report
 *   npm run m3:update -- --offline    # reuse .m3-specs, regenerate + report
 *   npm run m3:update -- --sync       # also apply high-confidence gb drift
 *   npm run m3:update -- --accept     # mark current upstream files reviewed
 *   npm run m3:update -- --extract    # spec-checks also runs Clairic
 *
 * Steps:
 *   1. Download docs + token DB (m3.material.io) and Compose Material 3 sources.
 *   2. Extract Compose token usage.
 *   3. Regenerate material-design-expressive/foundations/design-tokens/versions/latest/sass (+ -meta files), spring easings,
 *      and Material shapes.
 *   4. Diff generated tokens against the previous run; audit labs/gb.
 *   5. Regenerate browser spec tests (<component>_spec_test.ts in each component).
 *   6. Report upstream Compose files that changed since they were last
 *      reviewed (scripts/m3/upstream-review.json).
 *   7. Spec coverage: classify new spec units (needs OPENROUTER_API_KEY;
 *      cached) and report buildable units nothing cites (spec-checks.mjs;
 *      full list in .m3-specs/spec-checks/report.md).
 *
 * The report is written to .m3-specs/report.md.
 */

import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {cp, readdir, readFile, rm, stat, writeFile} from 'node:fs/promises';
import {join} from 'node:path';

const argv = process.argv.slice(2);
const offline = argv.includes('--offline');
const sync = argv.includes('--sync');
const accept = argv.includes('--accept');

const SPECS = '.m3-specs';
const TOKENS = 'material-design-expressive/foundations/design-tokens/versions/latest/sass';
const PREV = join(SPECS, 'prev-sass');
const COMPOSE = join(SPECS, 'compose');
const REVIEW = 'scripts/m3/upstream-review.json';

/**
 * Upstream files we ported by hand (not token-driven). A change in any of
 * them means our port needs a look.
 */
const PORTED = {
  'material3/commonMain/androidx/compose/material3/MaterialShapes.kt': 'scripts/m3/shapes/material-shapes.mjs',
  'material3/commonMain/androidx/compose/material3/MotionScheme.kt': 'scripts/m3/gen-motion.mjs',
  'material3/commonMain/androidx/compose/material3/LoadingIndicator.kt': 'scripts/m3/gen-loading-indicator.mjs',
  'material3/commonMain/androidx/compose/material3/WavyProgressIndicator.kt': 'scripts/m3/gen-progress.mjs',
  'material3/commonMain/androidx/compose/material3/ProgressIndicator.kt': 'scripts/m3/gen-progress.mjs',
  'material3/commonMain/androidx/compose/material3/internal/LinearWavyProgressModifiers.kt': 'scripts/m3/gen-progress.mjs',
  'material3/commonMain/androidx/compose/material3/internal/CircularWavyProgressModifiers.kt': 'scripts/m3/gen-progress.mjs',
  'material3/commonMain/androidx/compose/material3/FloatingActionButtonMenu.kt': 'scripts/m3/gen-fab-menu.mjs',
  'graphics-shapes/commonMain/androidx/graphics/shapes/': 'scripts/m3/shapes/graphics-shapes.mjs',
};

const report = [];
const section = (title) => report.push(`\n## ${title}\n`);
const node = (script, args = [], {capture = false, allowFail = false} = {}) => {
  const shown = args.join(' ');
  console.log(`\n> node ${script} ${shown.length > 160 ? `(${args.length} files)` : shown}`);
  try {
    const out = execFileSync(process.execPath, [script, ...args], {
      encoding: 'utf8',
      stdio: capture ? ['ignore', 'pipe', 'inherit'] : 'inherit',
      maxBuffer: 64 * 1024 * 1024,
    });
    if (capture) process.stdout.write(tail(out, 30));
    return out ?? '';
  } catch (err) {
    if (!allowFail) throw err;
    return err.stdout ?? '';
  }
};

// 1. Download.
if (!offline) {
  node('scripts/download-m3-specs.mjs', ['--only', 'get-started', '--only', 'foundations', '--only', 'styles', '--only', 'components']);
  node('scripts/m3/download-compose-sources.mjs');
}
const manifest = JSON.parse(await readFile(join(SPECS, 'manifest.json'), 'utf8'));
const composeManifest = await readJson(join(COMPOSE, 'manifest.json'));
report.push(`# M3 pipeline report\n`);
report.push(`- Docs content version: \`${manifest.carbonVersion}\` (downloaded ${manifest.downloadedAt})`);
for (const [artifact, info] of Object.entries(composeManifest?.artifacts ?? {})) {
  report.push(`- ${artifact}: \`${info.version}\``);
}

// 2. Compose usage.
node('scripts/m3/compose-usage.mjs');

// 3. Regenerate, keeping the previous token output to diff against.
await rm(PREV, {recursive: true, force: true});
await cp(TOKENS, PREV, {recursive: true});
node('scripts/m3/gen-sass-tokens.mjs', ['--out', TOKENS]);
await generateTokenMeta();
node('scripts/m3/gen-motion.mjs');
// Token files of components built from the spec by this pipeline.
node('scripts/m3/spec-tokens.mjs', ['--write']);
// Layout values (breakpoints, margins, panes) read from the layout pages.
node('scripts/m3/gen-layout.mjs');
if (await exists('scripts/m3/gen-shapes.mjs')) node('scripts/m3/gen-shapes.mjs');
// Components whose behavior is generated from the Compose reference.
for (const generator of ['gen-loading-indicator', 'gen-progress', 'gen-fab-menu']) {
  node(`scripts/m3/${generator}.mjs`);
}

// 4. What changed in the spec, and where gb disagrees with it.
section('Token changes since the previous run');
const tokenDiff = node('scripts/m3/diff-sass-tokens.mjs', [TOKENS, PREV], {capture: true});
report.push(fence(tokenDiff.includes('difference') ? tokenDiff : `No token changes.\n${tail(tokenDiff, 3)}`));

section(`labs/gb audit${sync ? ' (high-confidence drift synced)' : ''}`);
const audit = node('scripts/m3/audit-gb.mjs', sync ? ['--sync'] : [], {capture: true, allowFail: true});
report.push(fence(audit));
report.push('`~` = high confidence (synced by `--sync`), `?~` = needs review. Full gap list: `node scripts/m3/audit-gb.mjs --gaps`.');

// Regenerate browser spec tests so `npm test` checks gb against this spec.
section('Generated spec tests');
report.push(fence(node('scripts/m3/gen-spec-tests.mjs', [], {capture: true})));
// Keyboard tests from the spec's key tables, and contract tests from each
// component's shared-controller config (CONTRACTS and scripts/m3/contracts/),
// measurement tests from the spec's measurement tables and anatomy tests from
// its anatomy lists (both from scripts/m3/gen-measurement-configs.mjs and the
// tables in gen-anatomy-tests.mjs).
report.push(fence(node('scripts/m3/gen-keyboard-tests.mjs', [], {capture: true, allowFail: true})));
report.push(fence(node('scripts/m3/gen-contract-tests.mjs', [], {capture: true, allowFail: true})));
report.push(fence(node('scripts/m3/gen-measurement-tests.mjs', [], {capture: true, allowFail: true})));
report.push(fence(node('scripts/m3/gen-anatomy-tests.mjs', [], {capture: true, allowFail: true})));
report.push('Run `npm test` to check every component against the spec in a browser.');
// Agent skill (skill) from the component sources, CHECKLIST.md and the
// exclusions; `--check` fails when it is stale.
report.push(fence(node('scripts/m3/gen-agent-skill.mjs', [], {capture: true, allowFail: true})));

// 5. Upstream Compose files changed since last review.
section('Upstream Compose changes to review');
const current = await upstreamHashes();
const reviewed = (await readJson(REVIEW)) ?? {};
const changed = Object.keys(current).filter((f) => reviewed[f] && reviewed[f] !== current[f]);
const added = Object.keys(current).filter((f) => !reviewed[f]);
if (!Object.keys(reviewed).length) {
  report.push('No review baseline yet; run with `--accept` once the current state is reviewed.');
} else if (!changed.length && !added.length) {
  report.push('No reviewed upstream file changed.');
} else {
  for (const f of changed) report.push(`- changed: \`${f}\`${portNote(f)}`);
  for (const f of added) report.push(`- new: \`${f}\``);
}
if (accept) {
  await writeFile(REVIEW, JSON.stringify(sortKeys(current), null, 2) + '\n');
  report.push(`\nRecorded ${Object.keys(current).length} files as reviewed in \`${REVIEW}\`.`);
}

// 7. Spec coverage, computed from `spec:` citations in labs/gb and scripts/m3.
// Runs after the test generators so their citations are current.
section('Spec coverage');
// First pass computes statuses; the gap checklist is regenerated from them
// (one open item per section with units neither in code nor excluded); the
// second pass counts those as tracked and fails --strict on anything left.
node('scripts/m3/spec-checks.mjs', ['--summary', ...(argv.includes('--extract') ? ['--extract'] : [])], {capture: true, allowFail: true});
node('scripts/m3/gen-gap-checklist.mjs', [], {capture: true, allowFail: true});
const coverage = node('scripts/m3/spec-checks.mjs', ['--summary', '--strict'], {capture: true, allowFail: true});
report.push(coverage.trim() || 'spec-checks.mjs failed; run it directly to see why.');

// The catalog's Spec compliance page (3.0 only) from the data above.
node('scripts/m3/gen-compliance-page.mjs', [], {capture: true, allowFail: true});

await writeFile(join(SPECS, 'report.md'), report.join('\n') + '\n');
console.log(`\nReport: ${join(SPECS, 'report.md')}`);

// ---------------------------------------------------------------------------

/** Compose sources relevant to us: files that use spec tokens + ported files. */
async function upstreamHashes() {
  const files = new Set();
  const usage = await readJson(join(SPECS, 'compose-usage.json'));
  for (const sites of Object.values(usage?.tokens ?? {})) {
    for (const site of sites) files.add(`material3/commonMain/androidx/compose/material3/${site.file}`);
  }
  for (const path of Object.keys(PORTED)) {
    if (path.endsWith('/')) {
      for (const f of await readdir(join(COMPOSE, path))) if (f.endsWith('.kt')) files.add(path + f);
    } else files.add(path);
  }
  const hashes = {};
  for (const f of files) {
    try {
      hashes[f] = createHash('sha256').update(await readFile(join(COMPOSE, f))).digest('hex').slice(0, 16);
    } catch {
      // File removed upstream; it shows up as missing from `current`.
    }
  }
  return hashes;
}

function portNote(file) {
  const hit = Object.entries(PORTED).find(([p]) => file === p || (p.endsWith('/') && file.startsWith(p)));
  return hit ? ` -> re-check port in \`${hit[1]}\`` : '';
}

async function generateTokenMeta() {
  if (!(await exists('scripts/generate-sass-token-meta.js'))) {
    execFileSync('npx', ['tsc', '-b', 'scripts/tsconfig.json'], {stdio: 'inherit', shell: true});
  }
  const files = (await readdir(TOKENS))
    .filter((f) => /^_md-.*\.scss$/.test(f) && !f.endsWith('-meta.scss'))
    .map((f) => join(TOKENS, f));
  node('scripts/generate-sass-token-meta.js', files);
}

async function readJson(path) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch {
    return undefined;
  }
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

function tail(text, lines) {
  return text.trimEnd().split('\n').slice(-lines).join('\n') + '\n';
}

function fence(text) {
  return '```\n' + text.trimEnd() + '\n```';
}

function sortKeys(obj) {
  return Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)));
}
