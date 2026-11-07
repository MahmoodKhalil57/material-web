/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-search-bar.js';
import './md-gb-search-view.js';

import {sendKeys, sendMouse} from '@web/test-runner-commands';
import {html, type TemplateResult} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {SEARCH_BAR_CLASSES, SEARCH_VIEW_CLASSES} from './search.js';
import {type SearchBarElement} from './search-bar-element.js';
import {type SearchViewElement} from './search-view-element.js';

adoptStyles(document, [m3Styles]);

function resolvedColor(token: string) {
  const probe = document.createElement('div');
  probe.style.color = `var(${token})`;
  document.body.appendChild(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return color;
}

/** Finishes transitions and animations so computed styles are final. */
function finish(...hosts: Element[]) {
  document.body.offsetHeight;
  const roots: DocumentOrShadowRoot[] = [document];
  for (const host of hosts) {
    if (host.shadowRoot) {
      roots.push(host.shadowRoot);
      for (const nested of host.shadowRoot.querySelectorAll('*')) {
        if (nested.shadowRoot) roots.push(nested.shadowRoot);
      }
    }
  }
  for (const root of roots) root.getAnimations().forEach((a) => a.finish());
  document.body.offsetHeight;
}

/** The element focused in the shadow trees of `document`. */
function deepActiveElement(): Element | null {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement;
  }
  return active;
}

/** The elements slotted into the view's results list. */
function resultsOf(view: SearchViewElement) {
  const slot = view.shadowRoot!.querySelector<HTMLSlotElement>('.search-view-results slot')!;
  return slot.assignedElements({flatten: true});
}

describe('search spec units', () => {
  const env = new Environment();

  async function render(template: TemplateResult) {
    const root = env.render(
      html`<button id="before">Before</button>${template}`,
    );
    await env.waitForStability();
    const bar = root.querySelector('md-gb-search-bar') as SearchBarElement;
    await bar.updateComplete;
    const view = bar.shadowRoot!.querySelector(
      'md-gb-search-view',
    ) as SearchViewElement;
    await view.updateComplete;
    const q = (selector: string) =>
      view.shadowRoot!.querySelector<HTMLElement>(selector)!;
    return {
      root,
      bar,
      view,
      q,
      before: root.querySelector<HTMLElement>('#before')!,
      barBox: bar.shadowRoot!.querySelector<HTMLElement>(
        `.${SEARCH_BAR_CLASSES.searchBar}`,
      )!,
      barInput: bar.shadowRoot!.querySelector<HTMLInputElement>(
        `.${SEARCH_BAR_CLASSES.input}`,
      )!,
    };
  }

  const results = html`
    <div>Alpha</div>
    <div>Beta</div>
    <div>Gamma</div>
  `;

  const contained = html`<md-gb-search-bar quick placeholder="Search messages">
    <button slot="trailing" aria-label="Voice search">mic</button>
    ${results}
  </md-gb-search-bar>`;

  afterEach(() => {
    for (const bar of document.querySelectorAll('md-gb-search-bar')) {
      bar.shadowRoot!.querySelector('md-gb-search-view')!.shadowRoot!
        .querySelector('dialog')?.close();
    }
  });

  // spec: search-0a5328, search-5cb326, search-60501c, search-123ce9, search-3a101c, search-056a85
  it('colors a full-screen search with surface container low and high and on surface input text', async () => {
    const {bar, view, q, barBox} = await render(contained);
    await bar.show();
    finish(bar, view);
    expect(getComputedStyle(q('.search-view-container')).backgroundColor)
      .withContext('view container')
      .toBe(resolvedColor('--md-sys-color-surface-container-low'));
    expect(getComputedStyle(q('.search-view-header')).backgroundColor)
      .withContext('search bar in the view')
      .toBe(resolvedColor('--md-sys-color-surface-container-high'));
    expect(getComputedStyle(q('.search-view-input')).color)
      .withContext('input text')
      .toBe(resolvedColor('--md-sys-color-on-surface'));
    expect(getComputedStyle(barBox).backgroundColor)
      .withContext('closed search bar')
      .toBe(resolvedColor('--md-sys-color-surface-container-high'));
  });

  // spec: search-9d7616, search-a41589, search-a521cd
  it('colors the hinted text and the trailing icons on surface variant', async () => {
    const {bar, view, q, barInput} = await render(contained);
    const onSurfaceVariant = resolvedColor('--md-sys-color-on-surface-variant');
    const placeholder = getComputedStyle(barInput, '::placeholder').color;
    expect(placeholder).withContext('hinted text').toBe(onSurfaceVariant);
    const trailing = bar.querySelector('[slot="trailing"]')!;
    expect(getComputedStyle(
      bar.shadowRoot!.querySelector(`.${SEARCH_BAR_CLASSES.trailing}`)!,
    ).color)
      .withContext('trailing icon')
      .toBe(onSurfaceVariant);
    expect(trailing).not.toBeNull();
    await bar.show();
    bar.value = 'abc';
    await bar.updateComplete;
    await view.updateComplete;
    finish(bar, view);
    const clear = q('.search-view-clear');
    expect(getComputedStyle(clear).color)
      .withContext('clear icon in the view')
      .toBe(onSurfaceVariant);
  });

  // spec: search-9be33b, search-db5fd8, search-503ebc, search-b3284a, search-3b03c4, search-25c7af, search-b6a142
  it('colors a docked search with surface container high and on surface variant icons', async () => {
    const {bar, view, q} = await render(
      html`<md-gb-search-bar docked quick placeholder="Search">
        <button slot="trailing" aria-label="Voice search">mic</button>
        ${results}
      </md-gb-search-bar>`,
    );
    await bar.show();
    bar.value = 'abc';
    await bar.updateComplete;
    await view.updateComplete;
    finish(bar, view);
    const high = resolvedColor('--md-sys-color-surface-container-high');
    expect(getComputedStyle(q('.search-view-header')).backgroundColor)
      .withContext('search bar')
      .toBe(high);
    expect(getComputedStyle(q('.search-view-results')).backgroundColor)
      .withContext('results container')
      .toBe(high);
    expect(getComputedStyle(q('.search-view-input')).color)
      .withContext('input text')
      .toBe(resolvedColor('--md-sys-color-on-surface'));
    expect(getComputedStyle(q('.search-view-clear')).color)
      .withContext('clear icon')
      .toBe(resolvedColor('--md-sys-color-on-surface-variant'));
  });

  // spec: search-d3c8a5, search-96d4b2, search-95dd47, search-f6f94d
  it('gives the contained style a filled, rounded container that separates the bar from the list', async () => {
    const {bar, view, q, barBox} = await render(contained);
    expect(parseFloat(getComputedStyle(barBox).borderTopLeftRadius)).toBeGreaterThanOrEqual(28);
    expect(getComputedStyle(barBox).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    await bar.show();
    finish(bar, view);
    expect(getComputedStyle(q('.search-view-header')).backgroundColor).not.toBe(
      getComputedStyle(q('.search-view-container')).backgroundColor,
    );
    expect(view.divided).toBeFalse();
    expect(getComputedStyle(q('.search-view-divider')).display).toBe('none');
  });

  // spec: search-4cc40d, search-c3bafa, search-c1782d, search-bc3e20, search-a953bb
  it('supports docked and full-screen layouts in the contained and divided styles', async () => {
    for (const divided of [false, true]) {
      for (const docked of [false, true]) {
        const {bar, view, q} = await render(
          html`<md-gb-search-bar
            quick
            ?docked=${docked}
            ?divided=${divided}
            placeholder="Search"
            >${results}</md-gb-search-bar
          >`,
        );
        await bar.show();
        finish(bar, view);
        const label = `${divided ? 'divided' : 'contained'} ${docked ? 'docked' : 'full-screen'}`;
        const container = q('.search-view-container').getBoundingClientRect();
        if (docked) {
          expect(container.height).withContext(label).toBeLessThan(window.innerHeight);
        } else {
          expect(container.width).withContext(label).toBe(window.innerWidth);
          expect(container.height).withContext(label).toBe(window.innerHeight);
        }
        expect(getComputedStyle(q('.search-view-divider')).display)
          .withContext(label)
          .toBe(divided ? 'block' : 'none');
        await bar.close();
        await env.waitForStability();
      }
    }
  });

  // spec: search-52ef73, search-e897c9, search-692bac, search-50f3ea
  it('shows enabled, hovered, focused and pressed states on the search bar', async () => {
    const {bar, barBox, barInput} = await render(contained);
    const ripple = () => getComputedStyle(barBox).backgroundImage;
    const outline = () => getComputedStyle(barBox).outlineStyle;
    finish(bar);
    const enabled = ripple();
    expect(outline()).withContext('enabled').toBe('none');

    const rect = barBox.getBoundingClientRect();
    const x = Math.round(rect.left + rect.width / 2);
    const y = Math.round(rect.top + rect.height / 2);
    await sendMouse({type: 'move', position: [x, y]});
    finish(bar);
    expect(ripple()).withContext('hovered').not.toBe(enabled);
    await sendMouse({type: 'move', position: [0, 0]});
    finish(bar);

    barInput.focus();
    await sendKeys({press: 'Shift'});
    finish(bar);
    expect(barBox.matches(':has(:focus-visible)') || barBox.matches(':focus-within'))
      .withContext('focused')
      .toBeTrue();
    barInput.blur();

    await sendMouse({type: 'move', position: [x, y]});
    await sendMouse({type: 'down'});
    expect(barBox.getAnimations({subtree: true}).length + barBox.getAnimations().length)
      .withContext('pressed ripple')
      .toBeGreaterThan(0);
    await sendMouse({type: 'up'});
  });

  // spec: search-c5d462, search-23d92d
  it('has a results container that is empty by default', async () => {
    const {view, q} = await render(
      html`<md-gb-search-bar quick placeholder="Search"></md-gb-search-bar>`,
    );
    expect(q('.search-view-results').getAttribute('role')).toBe('listbox');
    expect(resultsOf(view).length).toBe(0);
  });

  // spec: search-eebd4f, search-7ab678, search-af9436, search-13929d
  it('shows suggestions in a list when focused, before any text is entered', async () => {
    const {bar, view, q, barInput} = await render(contained);
    barInput.focus();
    await sendKeys({press: 'Enter'});
    await view.updateComplete;
    await env.waitForStability();
    expect(bar.expanded).toBeTrue();
    expect(bar.value).toBe('');
    const options = resultsOf(view).filter((el) => el.getAttribute('role') === 'option');
    expect(options.length).toBe(3);
    for (const option of options) {
      expect(option.getBoundingClientRect().height).toBeGreaterThan(0);
    }
    expect(q('.search-view-results').getBoundingClientRect().height).toBeGreaterThan(0);
  });

  // spec: search-f10144, search-f638cd, search-63e711, search-784bc2, search-16b7a0, search-35725d
  it('shows results as text is typed and after a search is executed, in a list below the bar', async () => {
    const {bar, view, q, barInput} = await render(
      html`<md-gb-search-bar quick placeholder="Search messages"></md-gb-search-bar>`,
    );
    expect(resultsOf(view).length).toBe(0);
    // As text is typed, the app fills the list.
    bar.addEventListener('input', () => {
      if (bar.value && !bar.querySelector('.hit')) {
        bar.insertAdjacentHTML('beforeend', '<div class="hit">Result for typed text</div>');
      }
    });
    barInput.focus();
    await sendKeys({type: 'pea'});
    await view.updateComplete;
    await env.waitForStability();
    const hit = bar.querySelector<HTMLElement>('.hit')!;
    expect(bar.value).toBe('pea');
    expect(hit.getBoundingClientRect().height).toBeGreaterThan(0);
    expect(hit.getAttribute('role')).toBe('option');
    // Results sit below the search bar in the view.
    expect(hit.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      q('.search-view-header').getBoundingClientRect().bottom - 1,
    );

    // Executing a search with Enter fires `search` with the query.
    const searched = new Promise<string>((resolve) =>
      bar.addEventListener('search', (e) => resolve((e as CustomEvent).detail.value), {once: true}),
    );
    await sendKeys({press: 'Enter'});
    expect(await searched).toBe('pea');
    // The query stays visible in the view while the results show.
    expect(q('.search-view-input').getBoundingClientRect().height).toBeGreaterThan(0);
    expect((q('.search-view-input') as HTMLInputElement).value).toBe('pea');
    expect(hit.getBoundingClientRect().height).toBeGreaterThan(0);
  });

  // spec: search-f4a6a1, search-1874e6
  it('scrolls the results beneath the bar', async () => {
    const many = Array.from({length: 40}, (_, i) => i);
    const {bar, view, q} = await render(
      html`<md-gb-search-bar quick placeholder="Search"
        >${many.map((i) => html`<div style="block-size: 56px">Result ${i}</div>`)}</md-gb-search-bar
      >`,
    );
    await bar.show();
    finish(bar, view);
    const list = q('.search-view-results');
    const header = q('.search-view-header');
    const top = header.getBoundingClientRect().top;
    expect(list.scrollHeight).toBeGreaterThan(list.clientHeight);
    expect(list.getBoundingClientRect().top).toBeGreaterThanOrEqual(header.getBoundingClientRect().bottom - 1);
    list.scrollTop = 300;
    expect(list.scrollTop).toBe(300);
    expect(header.getBoundingClientRect().top).toBe(top);
  });

  // spec: search-4f5a1c, search-78cead, search-bab919
  it('stays in its pane and scales with it, anchoring its icons to the left and right', async () => {
    const measure = async (width: number) => {
      const {bar, barBox} = await render(
        html`<div style="inline-size: ${width}px">
          <md-gb-search-bar quick placeholder="Search"
            ><button slot="trailing" aria-label="Voice">mic</button></md-gb-search-bar
          >
        </div>`,
      );
      const pane = bar.parentElement!.getBoundingClientRect();
      const box = barBox.getBoundingClientRect();
      const leading = bar.shadowRoot!.querySelector(`.${SEARCH_BAR_CLASSES.leading}`)!.getBoundingClientRect();
      const trailing = bar.querySelector('[slot="trailing"]')!.getBoundingClientRect();
      return {pane, box, leading, trailing};
    };
    const narrow = await measure(400);
    const wide = await measure(600);
    expect(narrow.box.width).toBe(400);
    expect(wide.box.width).toBe(600);
    expect(narrow.box.left).toBe(narrow.pane.left);
    expect(wide.leading.left - wide.box.left).toBe(narrow.leading.left - narrow.box.left);
    expect(wide.box.right - wide.trailing.right).toBe(narrow.box.right - narrow.trailing.right);
  });

  // spec: search-24d215, search-96975d, search-543227
  it('focuses the search bar with Tab and moves between its interactive elements', async () => {
    const {before, bar, barInput} = await render(contained);
    const mic = bar.querySelector<HTMLElement>('[slot="trailing"]')!;
    before.focus();
    await sendKeys({press: 'Tab'});
    expect(deepActiveElement()).toBe(barInput);
    await sendKeys({press: 'Tab'});
    expect(deepActiveElement()).toBe(mic);
    await sendKeys({press: 'Shift+Tab'});
    expect(deepActiveElement()).toBe(barInput);
  });

  // spec: search-635131, search-e5530b
  it('activates the search field for input with Enter or Space', async () => {
    const {bar, view, before, barInput, q} = await render(contained);
    before.focus();
    await sendKeys({press: 'Tab'});
    await sendKeys({press: 'Enter'});
    await view.updateComplete;
    await env.waitForStability();
    expect(bar.expanded).toBeTrue();
    expect(deepActiveElement()).toBe(q('.search-view-input'));
    await bar.close();
    await env.waitForStability();

    barInput.focus();
    await sendKeys({press: 'Space'});
    await view.updateComplete;
    await env.waitForStability();
    expect(bar.expanded).toBeTrue();
    expect(deepActiveElement()).toBe(q('.search-view-input'));
  });

  // spec: search-f4f7f7
  it('shows the hinted search text', async () => {
    const {barInput} = await render(contained);
    expect(barInput.placeholder).toBe('Search messages');
    expect(barInput.value).toBe('');
    expect(getComputedStyle(barInput, '::placeholder').opacity).not.toBe('0');
  });

  // spec: search-54b3a2
  it('uses a text field with search affordances as the input', async () => {
    const {barInput, view, q} = await render(contained);
    expect(barInput.type).toBe('text');
    expect(barInput.getAttribute('role')).toBe('combobox');
    expect(barInput.getAttribute('enterkeyhint')).toBe('search');
    expect(q('.search-view-input').getAttribute('enterkeyhint')).toBe('search');
    expect(view.shadowRoot!.querySelector(`.${SEARCH_VIEW_CLASSES.input}`)).not.toBeNull();
  });

  // spec: search-168029
  it('shows a progress indicator and marks results busy while searching', async () => {
    const {bar, view, q} = await render(contained);
    await bar.show();
    finish(bar, view);
    expect(q('md-gb-progress')).withContext('idle').toBeNull();
    expect(q('.search-view-results').getAttribute('aria-busy')).toBe('false');
    bar.searching = true;
    await bar.updateComplete;
    await view.updateComplete;
    const progress = q('md-gb-progress');
    expect(progress).withContext('searching').not.toBeNull();
    await (progress as unknown as {updateComplete: Promise<unknown>}).updateComplete;
    expect(progress.shadowRoot!.querySelector('[role="progressbar"]')!
      .getAttribute('aria-label')).toBe('Searching');
    expect(q('.search-view-results').getAttribute('aria-busy')).toBe('true');
    expect(q('.search-view-status').textContent!.trim()).toBe('Searching');
    bar.searching = false;
    await bar.updateComplete;
    await view.updateComplete;
    expect(q('md-gb-progress')).withContext('done').toBeNull();
  });

  // spec: spacing-69a83a, spacing-4e4961
  it('pads the 40dp leading icon 8dp vertically and 8dp from the input text', async () => {
    const {barBox, barInput} = await render(
      html`<md-gb-search-bar quick placeholder="Search"
        ><button slot="leading" aria-label="Menu"
          style="inline-size: 40px; block-size: 40px; padding: 0; border: 0"
          >m</button
        ></md-gb-search-bar
      >`,
    );
    const box = barBox.getBoundingClientRect();
    const icon = barBox.getRootNode() instanceof ShadowRoot
      ? (barBox.getRootNode() as ShadowRoot).host.querySelector('[slot="leading"]')!.getBoundingClientRect()
      : box;
    expect(icon.top - box.top).withContext('vertical padding').toBe(8);
    expect(box.bottom - icon.bottom).toBe(8);
    expect(barInput.getBoundingClientRect().left - icon.right)
      .withContext('horizontal gap').toBe(8);
  });

  // spec: spacing-17a38e, spacing-780579
  it('recommends 24dp margins for the bar and 12dp in the focused view with the same padding and gaps', async () => {
    const {bar, view, q, barBox} = await render(contained);
    const margin = (el: Element, prop: string) =>
      parseFloat(getComputedStyle(el).getPropertyValue(prop));
    const toPx = (el: Element, token: string) => {
      const probe = document.createElement('div');
      probe.style.inlineSize = `var(${token})`;
      el.appendChild(probe);
      const px = probe.getBoundingClientRect().width;
      probe.remove();
      return px;
    };
    expect(toPx(barBox, '--contained-leading-margin')).withContext('bar leading').toBe(24);
    expect(toPx(barBox, '--contained-trailing-margin')).withContext('bar trailing').toBe(24);
    await bar.show();
    finish(bar, view);
    const header = q('.search-view-header');
    expect(margin(header, 'margin-inline-start')).withContext('view leading').toBe(12);
    expect(margin(header, 'margin-inline-end')).withContext('view trailing').toBe(12);
    const input = q('.search-view-input').getBoundingClientRect();
    const back = q('.search-view-back').getBoundingClientRect();
    const hb = header.getBoundingClientRect();
    expect(back.top - hb.top).withContext('vertical padding').toBe(8);
    expect(input.left - back.right).withContext('horizontal gap').toBe(8);
  });
});
