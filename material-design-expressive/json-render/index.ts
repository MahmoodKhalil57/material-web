/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview json-render (https://json-render.dev) for the library: the
 * schema of its JSON specs, the catalog of its components (generated from
 * custom-elements.json), the M3 rules specs are checked against, and the
 * renderer.
 *
 * ```js
 * import '@material/web/all.js';
 * import {checkSpec, m3Prompt, renderSpec} from '@material/web/json-render/index.js';
 *
 * const system = m3Prompt(); // for the model that writes specs
 * const {valid, issues} = checkSpec(spec);
 * if (valid) renderSpec(spec, document.querySelector('#app'));
 * ```
 *
 * It renders the elements, so register them first (`all.js` or each
 * element's module).
 */

export {catalog, COMPONENTS, HTML_TAGS, type ComponentName} from './catalog.js';
export {checkSpec, m3Prompt, type SpecCheck, type SpecCheckIssue} from './check.js';
export {checkM3, M3_RULES, m3PromptRules, type M3Issue, type M3Rule} from './m3-rules.js';
export {
  renderSpec,
  type ActionHandler,
  type RenderedSpec,
  type RenderSpecOptions,
} from './renderer.js';
export {BUILT_IN_ACTIONS, dynamic, FORMAT_RULES, isExpression, schema, type Md3Schema} from './schema.js';
