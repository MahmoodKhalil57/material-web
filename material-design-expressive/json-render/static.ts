/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Renders a json-render spec of the library's catalog to an
 * HTML string, for static sites and server rendering: the page has its
 * content and works before JavaScript runs, and the md-gb-* elements upgrade
 * when their modules load. `hydrateSpec()` (./renderer.js) then takes the
 * spec over in the browser where it has state or actions.
 *
 * It renders what `renderSpec()` renders, from the same resolution of props
 * (with the spec's state), visibility and repeats: custom elements with the
 * attributes of their props (`catalog.ts` `attributes`; props without an
 * attribute are set when the spec hydrates), text escaped, `Html` limited to
 * HTML_TAGS and HTML_ATTRIBUTES, and URLs sanitized. Runs in Node and in
 * browsers (no DOM needed).
 */

import {
  evaluateVisibility,
  getByPath,
  resolveElementProps,
  resolveRepeatStatePath,
  type ComputedFunction,
  type PropResolutionContext,
  type Spec,
  type UIElement,
} from '@json-render/core';

import {COMPONENTS, HTML_ATTRIBUTES, HTML_TAG, HTML_TAGS, HTML_VOID_TAGS, TEXT_TAG} from './catalog.js';
import {isSafeSrc, safeHref} from './urls.js';

/** Options of `renderSpecToString()`. */
export interface RenderSpecToStringOptions {
  /** State to render with, instead of the spec's `state`. */
  state?: Record<string, unknown>;
  /** Functions for `$computed` props. */
  functions?: Record<string, ComputedFunction>;
  /** Called for problems that skip part of the spec (unknown types, keys). */
  onWarning?: (message: string) => void;
}

type Component = (typeof COMPONENTS)[keyof typeof COMPONENTS];
const components = COMPONENTS as Record<string, Component>;
const HTML_ALLOWED = new Set<string>(HTML_TAGS);
const VOID = new Set<string>(HTML_VOID_TAGS);

const escapeText = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeAttr = (s: string) => escapeText(s).replace(/"/g, '&quot;');
const attr = (name: string, value: string) => ` ${name}="${escapeAttr(value)}"`;

/** The attributes of a custom element's resolved props. */
function elementAttributes(component: Component, props: Record<string, unknown>): string {
  const booleans = new Set(component.booleans);
  let out = '';
  for (const [prop, value] of Object.entries(props)) {
    const name = component.attributes[prop];
    if (!name || value === undefined || value === null) continue;
    if (booleans.has(prop)) {
      if (value === true) out += ` ${name}`;
    } else if (typeof value === 'string' || typeof value === 'number') {
      out += attr(name, prop === 'href' ? safeHref(String(value)) : String(value));
    }
  }
  return out;
}

/** The attributes of an Html primitive's resolved props. */
function htmlAttributes(props: Record<string, unknown>, warn: (m: string) => void): string {
  let out = '';
  for (const [prop, name] of Object.entries(HTML_ATTRIBUTES)) {
    const value = props[prop];
    if (value !== undefined && value !== null) out += attr(name, String(value));
  }
  if (props['target'] === '_blank') out += ' rel="noopener noreferrer"';
  if (typeof props['href'] === 'string') out += attr('href', safeHref(props['href']));
  if (typeof props['src'] === 'string') {
    if (isSafeSrc(props['src'])) out += attr('src', props['src']);
    else warn(`Html img: unsafe src ignored: ${props['src']}`);
  }
  return out;
}

/**
 * Renders a spec to HTML.
 *
 * ```js
 * import {renderSpecToString} from '@material/web/json-render/static.js';
 * const html = renderSpecToString(spec); // in a build step or a server
 * ```
 */
export function renderSpecToString(spec: Spec, options: RenderSpecToStringOptions = {}): string {
  const warnings = new Set<string>();
  const warn = (message: string) => {
    if (warnings.has(message)) return;
    warnings.add(message);
    (options.onWarning ?? ((m: string) => console.warn(`json-render: ${m}`)))(message);
  };
  const stateModel = options.state ?? spec.state ?? {};
  const visiting = new Set<string>();

  const node = (key: string, ctx: PropResolutionContext, slot?: string): string => {
    const el: UIElement | undefined = spec.elements?.[key];
    if (!el) {
      warn(`Missing element "${key}".`);
      return '';
    }
    if (visiting.has(key)) {
      warn(`Element "${key}" contains itself.`);
      return '';
    }
    const component = components[el.type];
    if (!component) {
      warn(`Unknown component type "${el.type}" (element "${key}").`);
      return '';
    }
    if (el.visible !== undefined && !evaluateVisibility(el.visible, ctx)) return '';
    const props = resolveElementProps((el.props ?? {}) as Record<string, unknown>, ctx);
    const slotAttr = slot ? attr('slot', slot) : '';

    if (component.tag === TEXT_TAG) {
      const text = escapeText(String(props['text'] ?? ''));
      return slot ? `<span${slotAttr}>${text}</span>` : text;
    }

    visiting.add(key);
    const children = childrenOf(el, ctx);
    const named = Object.entries(el.slots ?? {})
      .map(([name, keys]) => keys.map((k) => node(k, ctx, name === 'default' ? undefined : name)).join(''))
      .join('');
    visiting.delete(key);

    if (component.tag === HTML_TAG) {
      const tag = String(props['tag']);
      if (!HTML_ALLOWED.has(tag)) {
        warn(`Html: tag "${tag}" is not allowed (element "${key}").`);
        return '';
      }
      const open = `<${tag}${slotAttr}${htmlAttributes(props, warn)}>`;
      if (VOID.has(tag)) return open;
      const text = props['text'] !== undefined ? escapeText(String(props['text'])) : '';
      return `${open}${text}${children}${named}</${tag}>`;
    }
    return `<${component.tag}${slotAttr}${elementAttributes(component, props)}>${children}${named}</${component.tag}>`;
  };

  /** The default slot's children; once per item for a `repeat` element. */
  const childrenOf = (el: UIElement, ctx: PropResolutionContext): string => {
    const keys = el.children ?? [];
    if (!el.repeat) return keys.map((k) => node(k, ctx)).join('');
    const path = resolveRepeatStatePath(el.repeat.statePath, ctx.repeatBasePath);
    const items = path === undefined ? undefined : getByPath(ctx.stateModel, path);
    if (!Array.isArray(items)) return '';
    return items
      .map((item, i) =>
        keys.map((k) => node(k, {...ctx, repeatItem: item, repeatIndex: i, repeatBasePath: `${path}/${i}`})).join(''),
      )
      .join('');
  };

  if (!spec.root) return '';
  return node(spec.root, {stateModel, functions: options.functions});
}
