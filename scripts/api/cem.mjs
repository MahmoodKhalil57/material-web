/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Custom Elements Manifest (schema 2.1.0) conversions shared by
 * scripts/api/gen-api.mjs and scripts/gb-site-assets.mjs.
 */

/** `(a: T, b?: U) => R` -> {parameters, returns} (top-level parts only). */
export function parseSignature(signature) {
  if (!signature.startsWith('(')) return {parameters: [], returns: ''};
  const split = (text) => {
    const parts = [];
    let depth = 0;
    let start = 0;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (ch === '=' && text[i + 1] === '>') i++;
      else if ('([{<'.includes(ch)) depth++;
      else if (')]}>'.includes(ch)) depth--;
      else if (ch === ',' && depth === 0) {
        parts.push(text.slice(start, i));
        start = i + 1;
      }
    }
    parts.push(text.slice(start));
    return parts.map((p) => p.trim()).filter(Boolean);
  };
  let depth = 0;
  let close = -1;
  for (let i = 0; i < signature.length; i++) {
    if (signature[i] === '=' && signature[i + 1] === '>' && depth === 0) break;
    if ('([{'.includes(signature[i])) depth++;
    else if (')]}'.includes(signature[i]) && --depth === 0) {
      close = i;
      break;
    }
  }
  if (close < 0) return {parameters: [], returns: ''};
  const parameters = split(signature.slice(1, close)).map((p) => {
    const m = /^(\.\.\.)?([\w$]+)(\?)?\s*(?::\s*([\s\S]*))?$/.exec(p);
    if (!m) return {name: p};
    const out = {name: m[2]};
    if (m[4]) out.type = {text: m[4].trim()};
    if (m[3]) out.optional = true;
    if (m[1]) out.rest = true;
    return out;
  });
  const returns = /^\s*=>\s*([\s\S]*)$/.exec(signature.slice(close + 1))?.[1]?.trim() ?? '';
  return {parameters, returns};
}

/** One element as a Custom Elements Manifest class declaration. */
export function cemDeclaration(e) {
  const attributes = [];
  const members = [];
  for (const p of e.props) {
    const field = {
      kind: 'field',
      name: p.name,
      type: {text: p.type},
      privacy: 'public',
    };
    if (p.default) field.default = p.default;
    if (p.description) field.description = p.description;
    if (p.attribute) {
      field.attribute = p.attribute;
      if (p.reflect) field.reflects = true;
      const attribute = {name: p.attribute, type: {text: p.type}, fieldName: p.name};
      if (p.default) attribute.default = p.default;
      if (p.description) attribute.description = p.description;
      attributes.push(attribute);
    }
    members.push(field);
  }
  for (const m of e.methods) {
    // Custom element lifecycle callbacks are not API.
    if (/^(connected|disconnected|adopted|attributeChanged)Callback$/.test(m.name)) continue;
    const {parameters, returns} = parseSignature(m.signature);
    const method = {kind: 'method', name: m.name, privacy: 'public'};
    if (m.description) method.description = m.description;
    if (parameters.length) method.parameters = parameters;
    if (returns) method.return = {type: {text: returns}};
    members.push(method);
  }
  const declaration = {kind: 'class', name: e.className, tagName: e.tag, customElement: true};
  if (e.summary) {
    declaration.description = e.summary;
    declaration.summary = e.summary;
  }
  if (e.superclass) declaration.superclass = {name: e.superclass, module: `/${e.superclassFile.replace(/\.ts$/, '.js')}`};
  if (attributes.length) declaration.attributes = attributes;
  if (members.length) declaration.members = members;
  const named = (list, extra) => list.map(([name, description]) => ({name, ...(description ? {description} : {}), ...extra?.(name)}));
  if (e.events.length) {
    declaration.events = e.events.map(([name, {type, description}]) => ({
      name,
      type: {text: type},
      ...(description ? {description} : {}),
    }));
  }
  if (e.slots.length) declaration.slots = named(e.slots);
  if (e.parts.length) declaration.cssParts = named(e.parts);
  if (e.cssProps.length) declaration.cssProperties = named(e.cssProps);
  return declaration;
}
