#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Downloads the Jetpack Compose Material 3 source code (Kotlin sources only,
 * no build tooling) from Google's Maven repository, as the reference
 * implementation of M3 Expressive behavior, motion, shapes and token usage.
 *
 *   node scripts/m3/download-compose-sources.mjs [--version 1.5.0-rc01] [--out .m3-specs/compose]
 *
 * Output: `<out>/<artifact>/...kt` and `<out>/manifest.json`.
 * Sources are Apache-2.0; ported logic must keep attribution.
 */

import {execFileSync} from 'node:child_process';
import {mkdir, rm, writeFile} from 'node:fs/promises';
import {join, resolve} from 'node:path';

const MAVEN = 'https://dl.google.com/android/maven2';

const args = Object.fromEntries(
  process.argv.slice(2).flatMap((a, i, all) =>
    a.startsWith('--') ? [[a.slice(2), all[i + 1]?.startsWith('--') ? true : all[i + 1]]] : [],
  ),
);
const OUT = args.out ?? '.m3-specs/compose';

/** [group, artifact, classifier candidates in preference order] */
const ARTIFACTS = [
  ['androidx.compose.material3', 'material3', ['multiplatform-sources', 'sources']],
  ['androidx.compose.material3', 'material3-android', ['sources']],
  ['androidx.compose.material3', 'material3-ripple', ['multiplatform-sources', 'sources']],
  ['androidx.graphics', 'graphics-shapes', ['multiplatform-sources', 'sources']],
];

const manifest = {source: MAVEN, downloadedAt: new Date().toISOString(), artifacts: {}};
for (const [group, artifact, classifiers] of ARTIFACTS) {
  const base = `${MAVEN}/${group.replace(/\./g, '/')}/${artifact}`;
  // material3* share one version; other groups use their latest release.
  const version =
    group === 'androidx.compose.material3' && args.version
      ? args.version
      : await latestVersion(base, group === 'androidx.compose.material3');
  let jar;
  let used;
  for (const classifier of classifiers) {
    const res = await fetch(`${base}/${version}/${artifact}-${version}-${classifier}.jar`);
    if (res.ok) {
      jar = Buffer.from(await res.arrayBuffer());
      used = classifier;
      break;
    }
  }
  if (!jar) {
    console.warn(`  FAIL ${group}:${artifact}:${version} (no sources jar)`);
    continue;
  }
  const dir = join(OUT, artifact);
  await rm(dir, {recursive: true, force: true});
  await mkdir(dir, {recursive: true});
  const jarPath = join(OUT, `${artifact}-${version}-${used}.jar`);
  await writeFile(jarPath, jar);
  // Extract into its own empty folder; nothing in it is executed.
  execFileSync('unzip', ['-q', '-o', resolve(jarPath), '-d', resolve(dir)]);
  await rm(jarPath);
  const files = execFileSync('find', [dir, '-name', '*.kt'], {encoding: 'utf8'}).trim().split('\n');
  manifest.artifacts[`${group}:${artifact}`] = {version, classifier: used, ktFiles: files.length};
  console.log(`  ok   ${group}:${artifact}:${version} (${files.length} .kt files)`);
}
await writeFile(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));

/**
 * Latest version from maven-metadata.xml. For material3 the newest version
 * (including alpha/beta/rc) carries the Expressive APIs; elsewhere prefer the
 * latest release.
 */
async function latestVersion(base, allowPrerelease) {
  const xml = await (await fetch(`${base}/maven-metadata.xml`)).text();
  const tag = allowPrerelease ? 'latest' : 'release';
  const version = xml.match(new RegExp(`<${tag}>([^<]+)</${tag}>`))?.[1];
  if (!version) throw new Error(`No ${tag} version in ${base}/maven-metadata.xml`);
  return version;
}
