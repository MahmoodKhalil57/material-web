/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Stand-in for the catalog story framework (./material-collection.js and
 * ./index.js) used by the library's demos (<component>/demo/). Renders each
 * story with its default knob
 * values into `[data-demo-story="<index>"]` on the docs page, inside a shadow
 * root so story CSS stays scoped; in capture mode records the story HTML.
 *
 * Copied by site/scripts/dev.mjs to site/_generated/_shim.js, which the
 * transpiled demos import instead of ./material-collection.js and ./index.js.
 */
import {render} from 'lit';

// The demos load the components from this library server while the page shell
// (/js/spec/shell.js) bundles some of them: the first definition of a tag wins.
const define = customElements.define.bind(customElements);
customElements.define = (name, ctor, options) => {
  if (!customElements.get(name)) define(name, ctor, options);
};

export class Knob {
  constructor(name, options = {}) {
    this.name = name;
    this.defaultValue = options.defaultValue;
  }
}
const ui = () => ({});
export const boolInput = ui;
export const numberInput = ui;
export const selectDropdown = ui;
export const textInput = ui;
export const colorPicker = ui;
export const title = ui;

export class MaterialCollection {
  constructor(title, knobs = []) {
    this.title = title;
    this.knobs = knobs;
    this.stories = [];
  }
  addStories(...stories) {
    this.stories.push(...stories);
  }
}
export function materialInitsToStoryInits(inits) {
  return inits;
}

const base = new CSSStyleSheet();
base.replaceSync(`
  :host { color: var(--md-sys-color-on-surface); }
  .demo-story { box-sizing: border-box; max-width: 100%; padding-block: 16px; }
`);

/**
 * A story's markup as written, for its code block: rendered into a document
 * without custom element definitions, so nothing upgrades and no runtime
 * state (reflected defaults, moved ARIA attributes, internal styles) gets
 * in. Demo layout wrappers (story-*, demo-*, grid classes) are unwrapped and
 * their hint paragraphs dropped: the code is what a reader copies.
 */
async function sourceHtml(story, knobs) {
  const doc = document.implementation.createHTMLDocument('');
  const box = doc.createElement('div');
  render(await story.render({...knobs}), box, {creationScope: doc});
  const demoOnly = /^(story|demo|grid|row|column|col)(-|$)/;
  const isDemo = (el) => [...el.classList].some((c) => demoOnly.test(c));
  for (const el of [...box.querySelectorAll('.demo-hint, [class*="hint"]')]) {
    if (isDemo(el)) el.remove();
  }
  for (const el of [...box.querySelectorAll('div, section')].reverse()) {
    if (isDemo(el) && !el.localName.includes('-')) el.replaceWith(...el.childNodes);
  }
  return box.innerHTML;
}

export async function setUpDemo(collection, dir) {
  const knobs = Object.fromEntries(collection.knobs.map((k) => [k.name, k.defaultValue]));
  const capture = document.documentElement.hasAttribute('data-demo-capture');
  const results = [];
  for (const [i, story] of collection.stories.entries()) {
    const hosts = capture
      ? [document.body.appendChild(Object.assign(document.createElement('div'), {
          // The /3.0/ content column at 1280px, so the measured height is the
          // one the page reserves (min-block-size) before the demo loads.
          style: 'inline-size: 656px',
        }))]
      : [...document.querySelectorAll('[data-demo-dir="' + dir + '"][data-demo-story="' + i + '"]')];
    for (const host of hosts) {
      const root = host.shadowRoot ?? host.attachShadow({mode: 'open'});
      const styles = [story.styles].flat().filter(Boolean).map((s) => s.styleSheet ?? s);
      root.adoptedStyleSheets = [base, ...styles];
      const container = document.createElement('div');
      container.className = 'demo-story';
      root.replaceChildren(container);
      render(await story.render({...knobs}), container);
      if (capture) {
        // Let the elements upgrade and lay out before measuring.
        await Promise.all([...container.querySelectorAll('*')].map((el) => el.updateComplete));
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        // captureExamples measures it again in a 400px window (narrowHeight).
        host.dataset.demoCaptured = String(results.length);
        results.push({name: story.name, html: await sourceHtml(story, knobs), height: Math.ceil(host.getBoundingClientRect().height)});
      }
    }
  }
  if (capture) window.__demoCapture = results;
}
