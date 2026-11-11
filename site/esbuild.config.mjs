/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Bundles the /3.0/ site's client (src/spec/): lib/spec/shell.js (layout
 * site/content/_includes/gb/spec.html, and the all-pages document) and
 * lib/spec/sw.js (its service worker). The library's sources import their
 * styles as `with {type: 'css'}` modules, which become constructed
 * stylesheets here.
 */

import esbuild from 'esbuild';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

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
      bundle: true,
      format: 'esm',
      sourcemap: true,
      outdir: 'lib',
      outbase: 'src',
      entryPoints: ['src/spec/shell.ts', 'src/spec/sw.ts'],
      plugins: [cssModulePlugin],
      // '@material/web/...' imports resolve to the library's sources.
      alias: {'@material/web': fileURLToPath(new URL('../material-design-expressive/', import.meta.url))},
      // Names the service worker's caches: every build is a new
      // worker, which replaces the old one and its caches.
      define: {__GB_BUILD_ID__: JSON.stringify(Date.now().toString(36))},
    })
    .catch(() => process.exit(1));
