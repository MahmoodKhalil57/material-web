/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import multiEntry from '@rollup/plugin-multi-entry';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import {Plugin, rollup} from 'rollup';
import {readFile} from 'fs/promises';
import {promisify} from 'util';
import {brotliCompress, constants, gzip} from 'zlib';

const gzipPromise = promisify(gzip);
const brotliPromise = promisify(brotliCompress);

/** Brotli size in bytes at maximum quality (what a CDN would serve). */
export async function brotliSize(content: string | Uint8Array): Promise<number> {
  const compressed = await brotliPromise(content, {
    params: {
      [constants.BROTLI_PARAM_QUALITY]: constants.BROTLI_MAX_QUALITY,
      [constants.BROTLI_PARAM_SIZE_HINT]: content.length,
    },
  });
  return compressed.length;
}

export interface Bundle {
  name: string;
  inputs: string[];
}

export interface BundleSize {
  name: string;
  size: Size;
  inputs: InputSize[];
}

export interface InputSize {
  input: string;
  size: Size;
}

export interface Size {
  raw: number;
  css: number;
  gzip: number;
  brotli: number;
}

export async function getBundleSize(bundle: Bundle): Promise<BundleSize> {
  const bundleSize = await computeBundleSize(bundle.inputs);
  let inputSizes: InputSize[];
  if (bundle.inputs.length === 1) {
    // If there's only one input, we don't need to re-generate the bundle.
    inputSizes = [{input: bundle.inputs[0], size: bundleSize}];
  } else {
    // Include computed bundle size for individual inputs.
    inputSizes = await Promise.all(
      bundle.inputs.map(async (input) => {
        return {
          input,
          size: await computeBundleSize(input),
        };
      }),
    );
  }

  return {
    name: bundle.name,
    size: bundleSize,
    inputs: inputSizes,
  };
}

/**
 * labs/gb imports its stylesheets as CSS modules (`import x from './a.css'
 * with {type: 'css'}`), which this Rollup version cannot parse. The import
 * attribute is dropped and the stylesheet replaced by an empty stub: the CSS is
 * measured separately, from the .css files.
 */
const cssModulePlugin: Plugin = {
  name: 'css-module-stub',
  transform(code) {
    return code.replace(
      /(import\s[^;]*?['"][^'"]+\.css['"])\s*with\s*\{[^}]*\}/g,
      '$1',
    );
  },
  load(id) {
    return id.endsWith('.css') ? 'export default {};' : null;
  },
};

async function bundleCode(input: string | string[]): Promise<string> {
  const rollupBundle = await rollup({
    input,
    external: [/node_modules/],
    plugins: [cssModulePlugin, multiEntry(), nodeResolve(), terser()],
  });

  try {
    const {output} = await rollupBundle.generate({});
    return output[0].code;
  } finally {
    rollupBundle.close();
  }
}

/** Removes the Lit css tagged templates from bundled code. */
function stripCss(code: string, required = true): string {
  const litCssTagNameMatch = code.match(/css\s*as\s*(\w+)/);
  if (!litCssTagNameMatch) {
    if (!required) return code;
    throw new Error("Cannot find `import { css as X } from 'lit'`");
  }

  const litCssTagName = litCssTagNameMatch[1];
  return code.replaceAll(
    new RegExp(`${litCssTagName}\`([^\`]*)\``, 'g'),
    '',
  );
}

export async function computeBundleSize(
  input: string | string[],
): Promise<Size> {
  const code = await bundleCode(input);
  const codeWithoutCss = stripCss(code);

  const encoder = new TextEncoder();
  const codeSize = encoder.encode(code).length;
  const codeSizeWithoutCss = encoder.encode(codeWithoutCss).length;
  const cssSize = codeSize - codeSizeWithoutCss;
  const gzipSize = (await gzipPromise(code)).length;
  return {
    raw: codeSize,
    css: cssSize,
    gzip: gzipSize,
    brotli: await brotliSize(code),
  };
}

/** Brotli sizes of one labs/gb component, JS and CSS counted separately. */
export interface SplitSize {
  /** Minified JS module graph (Lit and other node_modules external), no CSS. */
  js: number;
  /** The component's compiled stylesheets, concatenated. */
  css: number;
}

/**
 * Brotli-compressed size of a component's compiled JS module graph (Lit css
 * templates, if any, stripped out) and of its compiled CSS files.
 */
export async function getSplitBrotliSize(
  jsInputs: string[],
  cssFiles: string[],
): Promise<SplitSize> {
  const code = stripCss(await bundleCode(jsInputs), false);
  const css = (
    await Promise.all(cssFiles.map((file) => readFile(file, 'utf8')))
  ).join('');
  return {js: await brotliSize(code), css: await brotliSize(css)};
}
