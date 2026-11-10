/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-search-bar.js';
import './md-gb-search-view.js';

import {sendKeys, sendMouse} from '@web/test-runner-commands';
import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {center, deepElements, prop, ripplesOf} from '../shared/central/subjects.js';
import {type SearchBarElement} from './search-bar-element.js';
import {type SearchViewElement} from './search-view-element.js';

adoptStyles(document, [m3Styles]);

function settle(el: Element) {
  for (let pass = 0; pass < 2; pass++) {
    for (const a of [
      ...document.getAnimations(),
      ...deepElements(el).flatMap((e) => e.getAnimations()),
    ]) {
      try {
        a.finish();
      } catch {
        // Infinite animations cannot finish.
      }
    }
  }
}

describe('<md-gb-search-view> more spec behavior', () => {
  const env = new Environment();

  async function setup(value = '') {
    const root = env.render(html`
      <md-gb-search-view open quick placeholder="Search" value=${value}>
        <div role="option" tabindex="-1">One</div>
        <div role="option" tabindex="-1">Two</div>
      </md-gb-search-view>`);
    await env.waitForStability();
    const view = root.querySelector('md-gb-search-view') as SearchViewElement;
    await view.updateComplete;
    settle(view);
    const part = (name: string) =>
      view.shadowRoot!.querySelector<HTMLElement>(`[part=${name}]`)!;
    return {view, part};
  }

  afterEach(async () => {
    await sendMouse({type: 'up'}).catch(() => {});
    await sendMouse({type: 'move', position: [0, 0]});
  });

  // spec: search-78b7fe, search-72750c
  it('keeps the interaction states of its own elements while search is focused', async () => {
    const {view} = await setup('Query');
    const clear = view.shadowRoot!.querySelector<HTMLElement>('.search-view-clear')!;
    const c = center(clear);
    await sendMouse({type: 'move', position: [c.x, c.y]});
    settle(view);
    expect(ripplesOf(view).some((r) => prop(r, '--ripple-hover-opacity') === '8%')).toBeTrue();
    // The input is a separate element and does not share the hover state.
    const input = view.shadowRoot!.querySelector<HTMLInputElement>('[part=input]')!;
    expect(input.matches(':hover')).toBeFalse();
  });

  // spec: search-b5c471, search-881f08
  it('has 12dp margins around the expanded (focused) search bar', async () => {
    const {part} = await setup();
    const container = part('container').getBoundingClientRect();
    const header = part('header').getBoundingClientRect();
    expect(header.left - container.left).toBeCloseTo(12, 0);
    expect(container.right - header.right).toBeCloseTo(12, 0);
  });

  // spec: search-3a3f1b
  it('keeps the query visible but out of focus once the results are queried', async () => {
    const { view, part } = await setup();
    const input = part('input') as HTMLInputElement;
    input.focus();
    await sendKeys({type: 'plants'});
    let searched = '';
    view.addEventListener('search', (e) => {
      searched = (e as CustomEvent<{value: string}>).detail.value;
    });
    await sendKeys({press: 'Enter'});
    expect(searched).toBe('plants');
    expect(input.value).toBe('plants');
    expect(view.shadowRoot!.activeElement).not.toBe(input);
    // The arrow keys still move into the results.
    await sendKeys({press: 'ArrowDown'});
    expect(document.activeElement?.textContent).toBe('One');
  });
});

describe('<md-gb-search-bar> focused glyph margins', () => {
  const env = new Environment();

  // spec: search-86d2ac, search-aa3bb4
  it('moves the glyphs from 24dp to 12dp from the container edge when focused', async () => {
    const root = env.render(html`<div style="inline-size: 500px">
      <md-gb-search-bar quick placeholder="Search"></md-gb-search-bar>
    </div>`);
    await env.waitForStability();
    const bar = root.querySelector('md-gb-search-bar') as SearchBarElement;
    await bar.updateComplete;
    const offset = () => {
      const container = bar.shadowRoot!.querySelector('[part=bar]')!.getBoundingClientRect();
      const icon = bar.shadowRoot!.querySelector('.search-bar-icon')!.getBoundingClientRect();
      return icon.left - container.left;
    };
    expect(offset()).toBeCloseTo(24, 0);
    await bar.show();
    await env.waitForStability();
    await bar.updateComplete;
    expect(bar.hasAttribute('expanded')).toBeTrue();
    expect(offset()).toBeCloseTo(12, 0);
    await bar.close();
    await env.waitForStability();
    await bar.updateComplete;
    expect(offset()).toBeCloseTo(24, 0);
  });
});
