/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview The json-render schema of the library (https://json-render.dev):
 * the grammar of the JSON specs that `renderSpec()` (./renderer.js) turns
 * into md-gb-* elements, and of the catalog (./catalog.js) that lists them.
 *
 * The spec format is json-render's flat element map, the same as its React
 * schema: `root`, `elements` (key -> `{type, props, children, slots?,
 * visible?, repeat?, on?}`) and an optional `state`. Props take json-render's
 * expressions (`$state`, `$bindState`, `$item`, `$cond`, `$template`, ...).
 *
 * The catalog shape adds what a web components target needs: each
 * component's `tag`, the DOM `events` its `on` bindings may name, whether
 * it is `deprecated`, and the M3 `spec` pages it implements, so a catalog,
 * and a spec checked against it, can be traced back to the M3 spec.
 */

import {defineSchema} from '@json-render/core';
import {z} from 'zod';

/**
 * Whether a prop value is a json-render expression (`{$state: ...}`,
 * `{$bindState: ...}`, `{$item: ...}`, `{$cond: ...}`, `{$template: ...}`
 * and so on) rather than a literal.
 */
export function isExpression(value: unknown): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.keys(value).some((key) => key.startsWith('$'))
  );
}

/**
 * A prop type that also takes a json-render expression, which is only
 * resolved when the spec renders.
 */
export function dynamic<T extends z.ZodType>(type: T) {
  return z.union([type, z.custom<Record<string, unknown>>(isExpression)]);
}

/** The actions every renderer handles, whatever the catalog. */
export const BUILT_IN_ACTIONS = [
  {
    name: 'setState',
    description:
      'Set the value at a state path. Params: { statePath: string, value: any }.',
  },
  {
    name: 'pushState',
    description:
      'Append a value to the array at a state path. Params: { statePath: string, value: any }.',
  },
  {
    name: 'removeState',
    description:
      'Remove the item at an index from the array at a state path. Params: { statePath: string, index: number }.',
  },
] as const;

/** Rules of the spec format, given to every prompt before the M3 rules. */
export const FORMAT_RULES = [
  'Every element MUST include a "children" array; leaf elements use "children": []. Every key in "children" and "slots" MUST name an element of "elements".',
  'Text is a "Text" element ({"type":"Text","props":{"text":"Save"},"children":[]}) in the parent\'s children. A component label that is a slot (a button label, an icon name) is a Text child.',
  'Use "children" for a component\'s default slot. For its named slots use a top-level "slots" object on the element ({"slots":{"headline":["title"]}}); never "slots.default".',
  'The "on", "visible" and "repeat" fields go on the element, NOT inside "props". "on" maps one of the component\'s events, or "click" ("press" means "click"), to an action binding: {"on":{"click":{"action":"setState","params":{"statePath":"/open","value":true}}}}.',
  'Two-way bind a value with {"$bindState":"/path"} on the component\'s value prop ("value", "checked", "selected" or "open").',
  'Use only the props listed for each component; props take literal values or $-expressions.',
] as const;

/**
 * The library's json-render schema: json-render's flat element spec, and a
 * catalog of web components.
 */
export const schema = defineSchema(
  (s) => ({
    spec: s.object({
      /** Root element key. */
      root: s.string(),
      /** Flat map of elements by key. */
      elements: s.record(
        s.object({
          /** Component name from the catalog. */
          type: s.ref('catalog.components'),
          /** Component props (literals or $-expressions). */
          props: s.propsOf('catalog.components'),
          /** Keys of the default slot's children. */
          children: s.array(s.string()),
          /** Keys of named slots' children. */
          slots: {...s.record(s.array(s.string())), ...s.optional()},
          /** Visibility condition. */
          visible: {...s.any(), ...s.optional()},
          /** Repeat the children once per item of a state array. */
          repeat: {...s.any(), ...s.optional()},
          /** DOM event name -> action binding(s). */
          on: {...s.record(s.any()), ...s.optional()},
        }),
      ),
    }),
    catalog: s.object({
      components: s.map({
        /** Zod schema of the props. */
        props: s.zod(),
        /** The custom element (`md-gb-button`), or a native one for primitives. */
        tag: s.string(),
        /** Slots: `default` for children, and the named slots. */
        slots: s.array(s.string()),
        /** The DOM events `on` may bind (`click` is always allowed). */
        events: s.array(s.string()),
        /** What the component is and when to use it. */
        description: s.string(),
        /** Whether the M3 spec no longer recommends the component. */
        deprecated: s.boolean(),
        /** The M3 spec pages the component implements (URLs). */
        spec: s.array(s.string()),
      }),
      actions: s.map({
        params: s.zod(),
        description: s.string(),
      }),
    }),
  }),
  {
    builtInActions: [...BUILT_IN_ACTIONS],
    defaultRules: [...FORMAT_RULES],
  },
);

/** The schema's type. */
export type Md3Schema = typeof schema;
