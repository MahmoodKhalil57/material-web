/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import gzipPlugin from '@luncheon/esbuild-plugin-gzip';
import esbuild from 'esbuild';
import {copyFileSync} from 'fs';
import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {join} from 'path';
import tinyGlob from 'tiny-glob';

// dev mode build
const DEV = process.env.NODE_ENV === 'DEV';
// Output folder for TS files
const jsFolder = DEV ? 'lib' : 'build';

// can use glob syntax. this will create a bundle for those specific files.
// you want to add SSR'd files here so that you can hydrate them later with
// <lit-island import="js/components/element-definition.js"></lit-island>
const tsEntrypoints = [
  // entrypoints for hydrating lit-islands
  './src/hydration-entrypoints/**/*.ts',
  // also include a bundle for each individual page
  './src/pages/*.ts',
  // SSR stuff
  './src/ssr-utils/lit-hydrate-support.ts',
  './src/ssr-utils/lit-island.ts',
];
const filesPromises = tsEntrypoints.map(async (entry) => tinyGlob(entry));
const entryPoints = (await Promise.all(filesPromises)).flat();

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

let componentsBuild = Promise.resolve();

// development build
if (DEV) {
  componentsBuild = esbuild
                        .build({
                          ...config,
                          entryPoints,
                        })
                        .catch(() => process.exit(1));

  // production build
} else {
  // config must be same for SSR and client builds to prevent hydration template
  // mismatches because we minify the templates in prod
  config = {
    bundle: true,
    outdir: jsFolder,
    minify: true,
    format: 'esm',
    treeShaking: true,
    legalComments: 'external',
    plugins: [
      // This plugin currently breaks certain css props for SVGs
      // (circularprogress) minifyHTMLLiteralsPlugin({
      //   shouldMinify: (template) => {
      //     const tag = template.tag && template.tag.toLowerCase();
      //     return (
      //       !!tag &&
      //       (tag.includes('html') || tag.includes('svg')) &&
      //       // tag name interpolations break
      //       tag !== 'statichtml'
      //     );
      //   },
      // }),
      gzipPlugin({
        gzip: true,
      }),
    ],
    // Needs to be off per the gzipPlugin docs
    write: false,
    splitting: true,
  };

  componentsBuild = esbuild
                        .build({
                          ...config,
                          entryPoints,
                        })
                        .catch(() => process.exit(1));
}

// seperate build so that the SSR bundle doesn't affect bundling for the
// frontend
const ssrBuild = esbuild
                     .build({
                       ...config,
                       format: 'iife',
                       splitting: false,
                       conditions: ['node'],
                       entryPoints: ['src/ssr.ts'],
                     })
                     .catch(() => process.exit(1));

// Glob of files that will be inlined on the page in <script> tags
const tsInlineEntrypoints = [
  './src/ssr-utils/dsd-polyfill.ts',
  // Anything in this directory will be inlined
  './src/inline/*.ts',
];
const inlineFilesPromises =
    tsInlineEntrypoints.map(async (entry) => tinyGlob(entry));
const inlineEntryPoints = (await Promise.all(inlineFilesPromises)).flat();

// this code is inlined into the HTML because it is performance-sensitive
const inlineBuild = esbuild
                        .build({
                          ...config,
                          format: 'iife',
                          splitting: false,
                          entryPoints: inlineEntryPoints,
                        })
                        .catch(() => process.exit(1));

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
const gbBuild = esbuild
                    .build({
                      ...config,
                      splitting: false,
                      plugins: [...(config.plugins ?? []), cssModulePlugin],
                      entryPoints: ['src/gb/gb.ts', 'src/gb/gb.css', 'src/gb/sw.ts'],
                      outbase: 'src',
                      // Names the service worker's caches: every build is a new
                      // worker, which replaces the old one and its caches.
                      define: {__GB_BUILD_ID__: JSON.stringify(Date.now().toString(36))},
                    })
                    .catch(() => process.exit(1));

await Promise.all([componentsBuild, ssrBuild, inlineBuild, gbBuild]);

// Copy the playground-elements worker to the build folder
const require = createRequire(import.meta.url);
copyFileSync(
    require.resolve('playground-elements/playground-typescript-worker.js'),
    join(jsFolder, 'hydration-entrypoints/playground-typescript-worker.js'));

process.exit(0);
