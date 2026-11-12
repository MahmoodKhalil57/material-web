/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {playwrightLauncher} from '@web/test-runner-playwright';
import {transform} from 'esbuild';
import {existsSync, readFileSync, statSync} from 'node:fs';
import {join} from 'node:path';
import {jasmineTestRunnerConfig} from 'web-test-runner-jasmine';

/**
 * Serves the library's modules (components, styles, aria, behaviors) straight from their TypeScript source: a request for
 * `**\/x.js` with a sibling `x.ts` gets the `.ts` transpiled by
 * esbuild (milliseconds), so tests always run the current source and don't
 * need a tsc build first. Type checking stays a separate step
 * (`npm run check`). Set MWC_TEST_COMPILED=1 to test tsc's output instead.
 */
/** Transpiled sources by path; reused while the file is unchanged (mtime). */
const transformCache = new Map();

const serveTypeScript = {
  name: 'serve-typescript',
  async serve(context) {
    if (process.env.MWC_TEST_COMPILED === '1') return undefined;
    const path = context.path;
    if (!path.startsWith('/') || !/\.[jt]s$/.test(path) || path.endsWith('.d.ts')) {
      return undefined;
    }
    // Test files may be requested as `.ts` (`npm run check` runs the
    // sources); imports between modules use `.js`.
    const source = join(process.cwd(), path.slice(1, -'.js'.length) + '.ts');
    if (!existsSync(source)) return undefined;
    const mtime = statSync(source).mtimeMs;
    const hit = transformCache.get(source);
    if (hit?.mtime === mtime) return {body: hit.code, type: 'js'};
    const {code} = await transform(readFileSync(source, 'utf8'), {
      loader: 'ts',
      format: 'esm',
      target: 'esnext',
      sourcefile: source,
      sourcemap: 'inline',
      tsconfigRaw: {
        compilerOptions: {experimentalDecorators: true, useDefineForClassFields: false},
      },
    });
    transformCache.set(source, {mtime, code});
    return {body: code, type: 'js'};
  },
};

const jasmineConfig = jasmineTestRunnerConfig();

/**
 * web-test-runner-jasmine sends a failed expectation's `expected` and
 * `actual` values to the runner as is. When they are DOM nodes (e.g.
 * `expect(el).toBe(other)`), serializing them never finishes and the whole run
 * hangs until `testsFinishTimeout`. Send a printable copy instead.
 */
function testRunnerHtml(path, config) {
  const html = jasmineConfig.testRunnerHtml(path, config);
  const patched = html
    .replace(
      'const failedImports = [];',
      `const failedImports = [];
              const printable = (value) => {
                if (value instanceof Node) {
                  return value instanceof Element
                    ? '<' + value.localName + (value.id ? '#' + value.id : '') + '>'
                    : value.nodeName;
                }
                try {
                  return JSON.parse(JSON.stringify(value) ?? 'null');
                } catch {
                  return String(value);
                }
              };`,
    )
    .replace('expected: e.expected,', 'expected: printable(e.expected),')
    .replace('actual: e.actual,', 'actual: printable(e.actual),');
  if (patched === html) {
    throw new Error('web-test-runner-jasmine changed; update the failure serialization patch');
  }
  return patched;
}

export default {
  ...jasmineConfig,
  testRunnerHtml,
  plugins: [serveTypeScript],
  nodeResolve: true,
  files: ['**/*test.js', '!node_modules/', '!.wireit/'],
  // A healthy run of every test file takes well under a minute.
  testsFinishTimeout: 60000,
  browsers:
      [
        playwrightLauncher({
          product: 'chromium',
          // Exclude since Firefox errors with "Touch is not defined"
          // product: 'firefox',
          // Exclude since Webkit errors with "Unknown error"
          // product: 'webkit',
        }),
      ],
};
