/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import gzipPlugin from '@luncheon/esbuild-plugin-gzip';
import esbuild from 'esbuild';
import {readFile} from 'node:fs/promises';
import {join} from 'path';
import {fileURLToPath} from 'node:url';

// dev mode build
const DEV = process.env.NODE_ENV === 'DEV';
// Output folder for TS files
const jsFolder = DEV ? 'lib' : 'build';

// Shared esbuild config values
let config = {
  bundle: true,
  outdir: jsFolder,
  minify: false,
  format: 'esm',
  treeShaking: true,
  write: true,
  sourcemap: true,
  splitting: true,
};

// production build
if (!DEV) {
  config = {
    ...config,
    minify: true,
    legalComments: 'external',
    plugins: [gzipPlugin({gzip: true})],
    // Needs to be off per the gzipPlugin docs
    write: false,
  };
}

// The /3.0/ site shell (site/_includes/gb): src/gb/gb.ts and gb.css, built on
// their own because the labs/gb sources import their styles as
// `with {type: 'css'}` modules, which esbuild turns into constructed
// stylesheets here. Outputs <js>/gb/gb.js and <js>/gb/gb.css.
const cssModulePlugin = {
  name: 'css-modules-as-stylesheets',
  setup(build) {
    build.onResolve({filter: /\.css$/}, (args) => {
      if (args.with?.type !== 'css') return;
      return {
        path: join(args.resolveDir, args.path),
        namespace: 'css-module',
      };
    });
    build.onLoad({filter: /.*/, namespace: 'css-module'}, async (args) => {
      const text = await readFile(args.path, 'utf8');
      return {
        contents:
            `const sheet = new CSSStyleSheet();\n` +
            `sheet.replaceSync(${JSON.stringify(text)});\n` +
            `export default sheet;\n`,
        loader: 'js',
      };
    });
  },
};

await esbuild
    .build({
      ...config,
      splitting: false,
      plugins: [...(config.plugins ?? []), cssModulePlugin],
      // shape-morphs.css: the morph paths (scripts/gb-shape-morphs.mjs),
      // linked by the pages with morphing shapes only.
      entryPoints: ['src/gb/gb.ts', 'src/gb/gb.css', 'src/gb/shape-morphs.css', 'src/gb/sw.ts'],
      outbase: 'src',
      // The library is the repo root (the parent of this site folder):
      // '@material/web/components/...' imports resolve to its sources.
      alias: {'@material/web': fileURLToPath(new URL('..', import.meta.url))},
      // Names the service worker's caches: every build is a new
      // worker, which replaces the old one and its caches.
      define: {__GB_BUILD_ID__: JSON.stringify(Date.now().toString(36))},
    })
    .catch(() => process.exit(1));

process.exit(0);
