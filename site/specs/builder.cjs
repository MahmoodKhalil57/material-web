/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Builds a json-render spec (a flat map of elements of the library's
 * catalog) from nested calls:
 *
 *   const b = specBuilder('home');
 *   const root = b.el('Stack', {gap: '400'}, [
 *     b.el('Typography', {scale: 'title-md'}, [b.html('h2', {}, ['Title'])]),
 *   ]);
 *   const spec = b.spec(root);
 *
 * Children are element keys or strings (Text elements). Named slots go in
 * `slots`: `b.el('ListItem', {}, ['Label'], {leading: [icon]})`.
 *
 * @param {string} prefix The prefix of the element keys.
 */
function specBuilder(prefix) {
  const elements = {};
  let n = 0;
  const key = () => `${prefix}-${(n++).toString(36)}`;
  const text = (value) => {
    const k = key();
    elements[k] = {type: 'Text', props: {text: String(value)}, children: []};
    return k;
  };
  const children = (list) => list.filter((c) => c !== null && c !== undefined && c !== false).map((c) => (typeof c === 'string' && !elements[c] ? text(c) : c));
  const el = (type, props = {}, kids = [], slots) => {
    const k = key();
    const clean = Object.fromEntries(Object.entries(props).filter(([, v]) => v !== undefined && v !== '' && v !== false));
    elements[k] = {type, props: clean, children: children(kids)};
    if (slots) elements[k].slots = Object.fromEntries(Object.entries(slots).map(([name, list]) => [name, children(list)]));
    return k;
  };
  /** A native element of the Html primitive. */
  const html = (tag, props = {}, kids = []) => el('Html', {tag, ...props}, kids);
  /**
   * Adds the elements of another spec (a converted fragment) and returns its
   * root's key.
   */
  const include = (spec) => {
    for (const [k, e] of Object.entries(spec.elements)) {
      if (elements[k]) throw new Error(`specBuilder: duplicate key ${k}`);
      elements[k] = e;
    }
    return spec.root;
  };
  return {el, html, text, include, elements, spec: (root) => ({root, elements})};
}

module.exports = {specBuilder};
