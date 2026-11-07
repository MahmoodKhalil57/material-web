/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  createPackageAnalyzer,
  type AbsolutePath,
} from '@lit-labs/analyzer/package-analyzer.js';
import {Type} from '@lit-labs/analyzer/lib/model.js';
import {generateManifest} from '@lit-labs/gen-manifest';
import {writeFileTree} from '@lit-labs/gen-utils/lib/file-utils.js';
import type {Package as Manifest, Module} from 'custom-elements-manifest';
import * as fs from 'fs';
import * as path from 'path';

ignoreUnprintedTypeReferences();

const ROOT = process.cwd() as AbsolutePath;

const mainManifest = await generateManifestFromTsconfig(ROOT);
const gbManifest = await generateManifestFromTsconfig(
  path.resolve(ROOT, 'labs/gb') as AbsolutePath,
);

const modulePathsAdded = new Set<string>(
  mainManifest.modules.map((module) => module.path),
);
const combinedModules = [...mainManifest.modules];
for (const module of gbManifest.modules) {
  if (!modulePathsAdded.has(module.path)) {
    modulePathsAdded.add(module.path);
    combinedModules.push(module);
  }
}
function includedModules(module: Module) {
  const isTestFile =
    module.path.includes('_test') ||
    module.path.includes('test/') ||
    module.path.includes('testing/');
  // Include all non-test files.
  if (!isTestFile) return true;
  // Only include these test files.
  return (
    module.path.includes('harness') ||
    module.path.includes('transform-pseudo-classes')
  );
}
const manifest = {
  ...mainManifest,
  modules: combinedModules.filter(includedModules),
};
addGbTagNames(manifest);

await writeFileTree(ROOT, {
  'custom-elements.json': JSON.stringify(manifest, null, 2),
});
console.log('Generated custom-elements.json');

async function generateManifestFromTsconfig(basePath: AbsolutePath) {
  const analyzer = createPackageAnalyzer(basePath);
  const pkg = analyzer.getPackage();
  const files = await generateManifest(pkg);
  const manifestContent = files['custom-elements.json'];
  if (typeof manifestContent !== 'string') {
    throw new Error(
      `Expected 'custom-elements.json': '<string>' from @lit-labs/gen-manifest, but got ${typeof manifestContent}`,
    );
  }
  return JSON.parse(manifestContent) as Manifest;
}

/**
 * TypeScript prints a namespaced type without its namespace (`Intl.Foo`
 * becomes `Foo`), but the analyzer still records `Intl` as a type reference.
 * gen-manifest then cannot find `Intl` in the type text and throws. Drop type
 * references that do not appear, in order, in their type text.
 */
function ignoreUnprintedTypeReferences() {
  const descriptor = Object.getOwnPropertyDescriptor(
    Type.prototype,
    'references',
  )!;
  Object.defineProperty(Type.prototype, 'references', {
    get(this: Type) {
      const references = descriptor.get!.call(this) as Type['references'];
      let curr = 0;
      return references.filter((ref) => {
        const start = this.text.indexOf(ref.name, curr);
        if (start < 0) return false;
        curr = start + ref.name.length;
        return true;
      });
    },
  });
}

/**
 * labs/gb registers its elements with `customElements.define('md-gb-x', X)`
 * in `md-gb-x.ts` instead of a decorator, which the analyzer does not
 * recognize. Read those calls and set `tagName` on the class declarations.
 */
function addGbTagNames(manifest: Manifest) {
  const componentsDir = path.resolve(ROOT, 'labs/gb/components');
  const tags = new Map<string, string>();
  for (const dir of fs.readdirSync(componentsDir, {withFileTypes: true})) {
    if (!dir.isDirectory()) continue;
    for (const file of fs.readdirSync(path.join(componentsDir, dir.name))) {
      if (!/^md-gb-.*\.ts$/.test(file) || file.endsWith('.d.ts')) continue;
      const source = fs.readFileSync(
        path.join(componentsDir, dir.name, file),
        'utf8',
      );
      const define = /customElements\.define\(\s*'(md-gb-[^']+)',\s*(\w+)/g;
      for (const match of source.matchAll(define)) {
        tags.set(match[2], match[1]);
      }
    }
  }
  for (const module of manifest.modules) {
    if (!module.path.split(path.sep).join('/').startsWith('labs/gb/')) continue;
    for (const declaration of module.declarations ?? []) {
      const tagName = tags.get(declaration.name);
      if (tagName && 'customElement' in declaration) {
        declaration.tagName = tagName;
      }
    }
  }
}
