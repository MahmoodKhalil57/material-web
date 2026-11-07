/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';

import './md-gb-search-bar.js';
import './md-gb-search-view.js';
import {
  getResultOptions,
  SEARCH_BAR_CLASSES,
  SEARCH_CLOSE_REASONS,
  SEARCH_VIEW_CLASSES,
  searchBarClasses,
  searchViewClasses,
} from './search.js';
import {type SearchBarElement} from './search-bar-element.js';
import searchBarStyles from './search-bar.cssresult.js';
import {type SearchViewElement} from './search-view-element.js';
import searchViewStyles from './search-view.cssresult.js';

// The utility classes must be styled in the document for Light DOM usage.
adoptStyles(document, [searchBarStyles, searchViewStyles]);

function key(target: Element, k: string, init: KeyboardEventInit = {}) {
  const event = new KeyboardEvent('keydown', {
    key: k,
    bubbles: true,
    composed: true,
    cancelable: true,
    ...init,
  });
  target.dispatchEvent(event);
  return event;
}

function type(input: HTMLInputElement, value: string) {
  input.value = value;
  input.dispatchEvent(
    new InputEvent('input', {bubbles: true, composed: true, data: value}),
  );
}

/** The element focused in the shadow tree of `root`. */
function deepActiveElement(): Element | null {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement;
  }
  return active;
}

describe('search', () => {
  const env = new Environment();

  async function setupBar(
    template = html`<md-gb-search-bar placeholder="Search messages" quick>
      <button slot="trailing" aria-label="Voice search">mic</button>
      <div class="result">Alpha</div>
      <div class="result">Beta</div>
      <div class="result">Gamma</div>
    </md-gb-search-bar>`,
  ) {
    const root = env.render(template);
    await env.waitForStability();
    const bar = root.querySelector('md-gb-search-bar') as SearchBarElement;
    if (!bar) throw new Error('Failed to query rendered <md-gb-search-bar>');
    const view = bar.shadowRoot!.querySelector(
      'md-gb-search-view',
    ) as SearchViewElement;
    await view.updateComplete;
    const barInput = bar.shadowRoot!.querySelector(
      `.${SEARCH_BAR_CLASSES.input}`,
    ) as HTMLInputElement;
    const viewRoot = view.shadowRoot!;
    const dialog = viewRoot.querySelector('dialog') as HTMLDialogElement;
    const viewInput = viewRoot.querySelector(
      `.${SEARCH_VIEW_CLASSES.input}`,
    ) as HTMLInputElement;
    const results = viewRoot.querySelector(
      `.${SEARCH_VIEW_CLASSES.results}`,
    ) as HTMLElement;
    return {root, bar, view, barInput, dialog, viewInput, results};
  }

  async function settle(el: {updateComplete: Promise<unknown>}) {
    await el.updateComplete;
    await env.waitForStability();
  }

  describe('md-gb-search-bar', () => {
    it('initializes with default values', async () => {
      const {bar} = await setupBar(
        html`<md-gb-search-bar></md-gb-search-bar>`,
      );
      expect(bar.value).toBe('');
      expect(bar.placeholder).toBe('');
      expect(bar.expanded).toBeFalse();
      expect(bar.docked).toBeFalse();
      expect(bar.divided).toBeFalse();
      expect(bar.disabled).toBeFalse();
    });

    // spec: search-e5c04d, search-632ef0
    it('renders a combobox input labeled by the hinted text', async () => {
      const {barInput} = await setupBar();
      expect(barInput.getAttribute('role')).toBe('combobox');
      expect(barInput.getAttribute('aria-expanded')).toBe('false');
      expect(barInput.getAttribute('aria-haspopup')).toBe('dialog');
      expect(barInput.getAttribute('aria-label')).toBe('Search messages');
      expect(barInput.placeholder).toBe('Search messages');
    });

    it('uses label over placeholder for the accessible label', async () => {
      const {barInput, viewInput} = await setupBar(
        html`<md-gb-search-bar
          placeholder="Search"
          label="Search your messages"></md-gb-search-bar>`,
      );
      expect(barInput.getAttribute('aria-label')).toBe('Search your messages');
      expect(viewInput.getAttribute('aria-label')).toBe(
        'Search your messages',
      );
    });

    it('controls the search view in the same tree', async () => {
      const {bar, barInput, view} = await setupBar();
      const id = barInput.getAttribute('aria-controls')!;
      expect(bar.shadowRoot!.getElementById(id)).toBe(view);
    });

    it('shows a non-functional search icon when nothing is leading', async () => {
      const {bar} = await setupBar();
      const icon = bar.shadowRoot!.querySelector(
        `.${SEARCH_BAR_CLASSES.leading} svg`,
      );
      expect(icon).not.toBeNull();
      expect(icon!.getAttribute('aria-hidden')).toBe('true');
    });

    it('renders the spec container height', async () => {
      const {bar} = await setupBar();
      const container = bar.shadowRoot!.querySelector(
        `.${SEARCH_BAR_CLASSES.searchBar}`,
      ) as HTMLElement;
      expect(container.getBoundingClientRect().height).toBe(56);
    });

    // spec: search-4ddb97, search-cfac1d, search-284084
    it('opens the view when clicked', async () => {
      const {bar, view, dialog, barInput} = await setupBar();
      barInput.click();
      await settle(bar);
      await view.updateComplete;
      expect(bar.expanded).toBeTrue();
      expect(bar.hasAttribute('expanded')).toBeTrue();
      expect(view.open).toBeTrue();
      expect(dialog.open).toBeTrue();
      expect(barInput.getAttribute('aria-expanded')).toBe('true');
    });

    it('does not open when a slotted trailing button is clicked', async () => {
      const {bar} = await setupBar();
      bar.querySelector<HTMLButtonElement>('[slot="trailing"]')!.click();
      await settle(bar);
      expect(bar.expanded).toBeFalse();
    });

    it('does not open when disabled', async () => {
      const {bar, barInput} = await setupBar(
        html`<md-gb-search-bar disabled quick></md-gb-search-bar>`,
      );
      expect(barInput.disabled).toBeTrue();
      bar.shadowRoot!.querySelector<HTMLElement>('.search-bar')!.click();
      await bar.show();
      expect(bar.expanded).toBeFalse();
    });

    for (const k of ['Enter', 'ArrowDown']) {
      it(`opens the view on ${k}`, async () => {
        const {bar, barInput} = await setupBar();
        const event = key(barInput, k);
        await settle(bar);
        expect(event.defaultPrevented).toBeTrue();
        expect(bar.expanded).toBeTrue();
      });
    }

    it('opens the view and keeps the text when typing', async () => {
      const {bar, view, barInput, viewInput} = await setupBar();
      type(barInput, 'pea');
      await settle(bar);
      await view.updateComplete;
      expect(bar.value).toBe('pea');
      expect(bar.expanded).toBeTrue();
      expect(viewInput.value).toBe('pea');
      expect(deepActiveElement()).toBe(viewInput);
    });

    it('moves focus into the view input when opened', async () => {
      const {bar, viewInput} = await setupBar();
      await bar.show();
      expect(deepActiveElement()).toBe(viewInput);
    });

    it('fires open and opened, then close and closed', async () => {
      const {bar} = await setupBar();
      const events: string[] = [];
      for (const type of ['open', 'opened', 'close', 'closed']) {
        bar.addEventListener(type, () => events.push(type));
      }
      await bar.show();
      await bar.close();
      expect(events).toEqual(['open', 'opened', 'close', 'closed']);
      expect(bar.expanded).toBeFalse();
    });

    it('cancels opening when open is defaultPrevented', async () => {
      const {bar, view} = await setupBar();
      bar.addEventListener('open', (event) => {
        event.preventDefault();
      });
      await bar.show();
      expect(bar.expanded).toBeFalse();
      expect(view.open).toBeFalse();
    });

    it('opens and closes from the expanded property', async () => {
      const {bar, view} = await setupBar();
      bar.expanded = true;
      await settle(bar);
      await view.updateComplete;
      expect(view.open).toBeTrue();
      bar.expanded = false;
      await settle(bar);
      await view.updateComplete;
      expect(view.open).toBeFalse();
    });

    it('closes on Escape in the view', async () => {
      const {bar, viewInput} = await setupBar();
      await bar.show();
      const closed = new Promise((resolve) => {
        bar.addEventListener('closed', resolve, {once: true});
      });
      const event = key(viewInput, 'Escape');
      await closed;
      expect(event.defaultPrevented).toBeTrue();
      expect(bar.expanded).toBeFalse();
    });

    it('closes on the dialog cancel event (Escape or back gesture)', async () => {
      const {bar, dialog} = await setupBar();
      await bar.show();
      const cancel = new Event('cancel', {cancelable: true});
      const closed = new Promise((resolve) => {
        bar.addEventListener('closed', resolve, {once: true});
      });
      dialog.dispatchEvent(cancel);
      await closed;
      expect(cancel.defaultPrevented).toBeTrue();
      expect(dialog.open).toBeFalse();
    });

    describe('close reasons and predictive back', () => {
      function reasonOf(event: Event) {
        return (event as CustomEvent<{reason: string}>).detail.reason;
      }

      async function closedReason(bar: SearchBarElement, act: () => void) {
        const closed = new Promise<string>((resolve) => {
          bar.addEventListener('closed', (e) => resolve(reasonOf(e)), {
            once: true,
          });
        });
        act();
        return closed;
      }

      it('reports escape for Escape and a synthetic cancel', async () => {
        const {bar, viewInput, dialog} = await setupBar();
        await bar.show();
        expect(await closedReason(bar, () => key(viewInput, 'Escape'))).toBe(
          SEARCH_CLOSE_REASONS.ESCAPE,
        );
        await bar.show();
        expect(
          await closedReason(bar, () =>
            dialog.dispatchEvent(new Event('cancel', {cancelable: true})),
          ),
        ).toBe(SEARCH_CLOSE_REASONS.ESCAPE);
      });

      it('reports back-button for the back icon button', async () => {
        const {bar, view} = await setupBar();
        await bar.show();
        const back =
          view.shadowRoot!.querySelector<HTMLButtonElement>(
            '.search-view-back',
          )!;
        expect(await closedReason(bar, () => back.click())).toBe(
          SEARCH_CLOSE_REASONS.BACK_BUTTON,
        );
      });

      it('closes with reason back from handleBack()', async () => {
        const {bar, view} = await setupBar();
        await bar.show();
        let closeReason = '';
        bar.addEventListener('close', (e) => {
          closeReason = reasonOf(e);
        });
        await view.handleBack();
        expect(closeReason).toBe(SEARCH_CLOSE_REASONS.BACK);
        expect(view.open).toBeFalse();
      });

      it('scales a full-screen view to 90% on back', async () => {
        const {bar, view} = await setupBar();
        await bar.show();
        view.quick = false;
        const container = view.shadowRoot!.querySelector<HTMLElement>(
          '.search-view-container',
        )!;
        const done = view.handleBack();
        const motion = container
          .getAnimations()
          .find((a) =>
            (a.effect as KeyframeEffect)
              .getKeyframes()
              .some((frame) => frame['scale'] === '0.9'),
          );
        expect(motion).withContext('predictive back scale').toBeDefined();
        view.quick = true;
        motion!.finish();
        await done;
        expect(view.open).toBeFalse();
        expect(container.getAnimations().length).toBe(0);
      });
    });

    // spec: search-1b376d, search-094a06, search-18cc24
    it('closes from the back button and returns focus to the bar', async () => {
      const {bar, view, barInput} = await setupBar();
      barInput.focus();
      await bar.show();
      const back = view.shadowRoot!.querySelector<HTMLButtonElement>(
        '.search-view-back',
      )!;
      expect(back.getAttribute('aria-label')).toBe('Back');
      const closed = new Promise((resolve) => {
        bar.addEventListener('closed', resolve, {once: true});
      });
      back.click();
      await closed;
      expect(bar.expanded).toBeFalse();
      expect(deepActiveElement()).toBe(barInput);
    });

    // spec: search-bedcd3
    it('fires input, change and search from the view', async () => {
      const {bar, viewInput} = await setupBar();
      await bar.show();
      const input = jasmine.createSpy('input');
      const change = jasmine.createSpy('change');
      let search = '';
      bar.addEventListener('input', input);
      bar.addEventListener('change', change);
      bar.addEventListener('search', (event) => {
        search = (event as CustomEvent<{value: string}>).detail.value;
      });

      type(viewInput, 'plants');
      expect(input).toHaveBeenCalledTimes(1);
      expect(bar.value).toBe('plants');

      viewInput.dispatchEvent(new Event('change', {bubbles: true}));
      expect(change).toHaveBeenCalledTimes(1);

      const enter = key(viewInput, 'Enter');
      expect(enter.defaultPrevented).toBeTrue();
      expect(search).toBe('plants');
      expect(bar.expanded).withContext('stays open').toBeTrue();
    });

    it('shows the query in the bar after closing', async () => {
      const {bar, barInput, viewInput} = await setupBar();
      await bar.show();
      type(viewInput, 'pasta');
      await bar.close();
      await settle(bar);
      expect(barInput.value).toBe('pasta');
    });

    // spec: search-a7e755, search-1bcb5c
    it('forwards docked and divided to the view', async () => {
      const {bar, view, dialog} = await setupBar(
        html`<md-gb-search-bar docked divided quick></md-gb-search-bar>`,
      );
      expect(view.docked).toBeTrue();
      expect(view.divided).toBeTrue();
      expect(view.bar).toBe(bar);
      expect(dialog.classList).toContain(SEARCH_VIEW_CLASSES.docked);
      expect(dialog.classList).toContain(SEARCH_VIEW_CLASSES.divided);
      expect(dialog.classList).toContain(SEARCH_VIEW_CLASSES.anchored);
    });

    // spec: search-49682c, search-2c41bb, search-05229d
    it('docks the view over the search bar', async () => {
      const {bar, view} = await setupBar(
        html`<md-gb-search-bar docked quick></md-gb-search-bar>`,
      );
      await bar.show();
      const header = view.shadowRoot!.querySelector(
        `.${SEARCH_VIEW_CLASSES.header}`,
      )!;
      const barRect = bar.getBoundingClientRect();
      const headerRect = header.getBoundingClientRect();
      expect(headerRect.top).toBeCloseTo(barRect.top, 0);
      expect(headerRect.left).toBeCloseTo(barRect.left, 0);
      expect(headerRect.height).toBe(56);
    });

    it('closes a docked view when the scrim is clicked', async () => {
      const {bar, dialog} = await setupBar(
        html`<md-gb-search-bar docked quick></md-gb-search-bar>`,
      );
      await bar.show();
      const closed = new Promise((resolve) => {
        bar.addEventListener('closed', resolve, {once: true});
      });
      dialog.dispatchEvent(new MouseEvent('click', {bubbles: true}));
      await closed;
      expect(bar.expanded).toBeFalse();
    });
  });

  describe('md-gb-search-view', () => {
    async function setupView(
      template = html`<md-gb-search-view placeholder="Search" quick>
        <div>One</div>
        <div role="option">Two</div>
        <div role="presentation">Heading</div>
        <div>Three</div>
      </md-gb-search-view>`,
    ) {
      const root = env.render(template);
      await env.waitForStability();
      const view = root.querySelector('md-gb-search-view') as SearchViewElement;
      const viewRoot = view.shadowRoot!;
      return {
        root,
        view,
        dialog: viewRoot.querySelector('dialog') as HTMLDialogElement,
        input: viewRoot.querySelector(
          `.${SEARCH_VIEW_CLASSES.input}`,
        ) as HTMLInputElement,
        results: viewRoot.querySelector(
          `.${SEARCH_VIEW_CLASSES.results}`,
        ) as HTMLElement,
      };
    }

    it('initializes closed', async () => {
      const {view, dialog} = await setupView();
      expect(view.open).toBeFalse();
      expect(dialog.open).toBeFalse();
      expect(view.backLabel).toBe('Back');
      expect(view.clearLabel).toBe('Clear search');
    });

    // spec: search-c3cd3d
    it('renders a combobox that controls a results listbox', async () => {
      const {view, input, results} = await setupView();
      expect(input.getAttribute('role')).toBe('combobox');
      expect(input.getAttribute('aria-autocomplete')).toBe('list');
      expect(input.getAttribute('aria-expanded')).toBe('false');
      expect(results.getAttribute('role')).toBe('listbox');
      expect(results.getAttribute('aria-label')).toBe('Search results');
      const id = input.getAttribute('aria-controls')!;
      expect(view.shadowRoot!.getElementById(id)).toBe(results);
    });

    it('gives slotted results without a role the option role', async () => {
      const {view} = await setupView();
      const roles = [...view.children].map((el) => el.getAttribute('role'));
      expect(roles).toEqual(['option', 'option', 'presentation', 'option']);
    });

    it('opens as a modal dialog with the input focused', async () => {
      const {view, dialog, input} = await setupView();
      await view.show();
      expect(view.open).toBeTrue();
      expect(view.hasAttribute('open')).toBeTrue();
      expect(dialog.open).toBeTrue();
      expect(dialog.matches(':modal')).toBeTrue();
      expect(dialog.getAttribute('aria-label')).toBe('Search');
      expect(input.getAttribute('aria-expanded')).toBe('true');
      expect(deepActiveElement()).toBe(input);
    });

    it('opens from the open attribute', async () => {
      const {view, dialog} = await setupView(
        html`<md-gb-search-view open quick></md-gb-search-view>`,
      );
      await view.updateComplete;
      await env.waitForStability();
      expect(view.open).toBeTrue();
      expect(dialog.open).toBeTrue();
    });

    // spec: search-c3ffc1, search-220ea8, search-6898a8, search-bb2242, search-9c42a1
    it('fills the viewport when full-screen', async () => {
      const {view} = await setupView();
      await view.show();
      const container = view.shadowRoot!.querySelector(
        `.${SEARCH_VIEW_CLASSES.container}`,
      )!;
      const rect = container.getBoundingClientRect();
      expect(rect.width).toBe(window.innerWidth);
      expect(rect.height).toBe(window.innerHeight);
      const header = view.shadowRoot!.querySelector(
        `.${SEARCH_VIEW_CLASSES.header}`,
      )!;
      // Contained full-screen: a 56dp bar inside the 72dp header.
      expect(header.getBoundingClientRect().height).toBe(56);
    });

    // spec: search-97e2b1, search-825ed3
    it('uses a 72dp header and a divider in the divided style', async () => {
      const {view} = await setupView(
        html`<md-gb-search-view divided quick></md-gb-search-view>`,
      );
      await view.show();
      const header = view.shadowRoot!.querySelector(
        `.${SEARCH_VIEW_CLASSES.header}`,
      )!;
      const divider = view.shadowRoot!.querySelector(
        `.${SEARCH_VIEW_CLASSES.divider}`,
      )!;
      expect(header.getBoundingClientRect().height).toBe(72);
      expect(divider.getBoundingClientRect().height).toBe(1);
    });

    // spec: search-2ba730, search-7a9d08, search-c08556
    it('moves focus through the options with the arrow keys', async () => {
      const {view, input} = await setupView();
      await view.show();
      const [one, two, , three] = [...view.children] as HTMLElement[];

      key(input, 'ArrowDown');
      expect(document.activeElement).toBe(one);
      key(one, 'ArrowDown');
      expect(document.activeElement).toBe(two);
      key(two, 'End');
      expect(document.activeElement).toBe(three);
      key(three, 'Home');
      expect(document.activeElement).toBe(one);
      key(one, 'ArrowUp');
      expect(deepActiveElement()).toBe(input);
      key(input, 'ArrowUp');
      expect(document.activeElement).toBe(three);
    });

    // spec: search-33b69d
    it('activates a focused option with Enter', async () => {
      const {view, input} = await setupView();
      await view.show();
      const one = view.children[0] as HTMLElement;
      const click = jasmine.createSpy('click');
      one.addEventListener('click', click);
      key(input, 'ArrowDown');
      key(one, 'Enter');
      expect(click).toHaveBeenCalledTimes(1);
    });

    // spec: search-314f92, search-6a73ef
    it('announces suggestions when it opens with results', async () => {
      const {view} = await setupView();
      await view.show();
      await view.updateComplete;
      const status = view.shadowRoot!.querySelector('[role="status"]')!;
      expect(status.getAttribute('aria-live')).toBe('polite');
      expect(status.textContent!.trim()).toBe('Suggestions available');
    });

    // spec: search-4e1678
    it('shows a clear button that clears the text', async () => {
      const {view, input} = await setupView();
      await view.show();
      const clearButton = () =>
        view.shadowRoot!.querySelector<HTMLButtonElement>(
          '.search-view-clear',
        );
      expect(clearButton()).toBeNull();

      type(input, 'abc');
      await view.updateComplete;
      expect(view.value).toBe('abc');
      expect(clearButton()!.getAttribute('aria-label')).toBe('Clear search');

      const inputSpy = jasmine.createSpy('input');
      view.addEventListener('input', inputSpy);
      clearButton()!.click();
      await view.updateComplete;
      expect(view.value).toBe('');
      expect(input.value).toBe('');
      expect(inputSpy).toHaveBeenCalledTimes(1);
      expect(deepActiveElement()).toBe(input);
    });

    it('cancels closing when close is defaultPrevented', async () => {
      const {view} = await setupView();
      await view.show();
      view.addEventListener('close', (event) => {
        event.preventDefault();
      });
      await view.close();
      expect(view.open).toBeTrue();
    });

    it('closes when disconnected', async () => {
      const {view, dialog} = await setupView();
      await view.show();
      view.remove();
      expect(view.open).toBeFalse();
      expect(dialog.open).toBeFalse();
    });

    it('animates open and closed with reduced motion', async () => {
      spyOn(window, 'matchMedia').and.callFake(
        (query: string) =>
          ({
            matches: query === '(prefers-reduced-motion: reduce)',
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
          }) as MediaQueryList,
      );
      const {view, dialog} = await setupView(
        html`<md-gb-search-view></md-gb-search-view>`,
      );
      const opened = jasmine.createSpy('opened');
      view.addEventListener('opened', opened);
      await view.show();
      expect(opened).toHaveBeenCalled();
      const container = dialog.querySelector(
        `.${SEARCH_VIEW_CLASSES.container}`,
      )!;
      expect(container.getAnimations().length).toBe(0);
      await view.close();
      expect(dialog.open).toBeFalse();
    });

    it('expands with the spec motion when animated', async () => {
      const {view} = await setupView(
        html`<md-gb-search-view docked></md-gb-search-view>`,
      );
      const animate = spyOn(Element.prototype, 'animate').and.callThrough();
      const shown = view.show();
      await view.updateComplete;
      await Promise.resolve();
      expect(animate).toHaveBeenCalled();
      const [, options] = animate.calls.first().args as [
        Keyframe[],
        KeyframeAnimationOptions,
      ];
      // Without the motion tokens loaded, the fallback easing applies.
      expect(options.easing).toBeTruthy();
      expect(options.duration).toBeGreaterThan(0);
      for (const animation of view.shadowRoot!
        .querySelector('dialog')!
        .getAnimations({subtree: true})) {
        animation.finish();
      }
      await shown;
      expect(view.open).toBeTrue();
    });
  });

  describe('class helpers', () => {
    it('returns search bar classes', () => {
      expect(searchBarClasses({expanded: true})).toEqual({
        'search-bar': true,
        'search-bar-expanded': true,
        'search-bar-disabled': false,
      });
    });

    it('omits the token root class when tokens is false', () => {
      const classes = searchViewClasses({tokens: false, docked: true});
      expect(classes['search-view']).toBeFalse();
      expect(classes['search-view-dialog']).toBeTrue();
      expect(classes['search-view-docked']).toBeTrue();
    });

    it('finds enabled options in a Light DOM results container', () => {
      const results = document.createElement('div');
      results.innerHTML = `
        <div role="option">A</div>
        <div role="group"><div role="option">B</div></div>
        <div role="option" aria-disabled="true">C</div>
        <div role="option" hidden>D</div>`;
      expect(getResultOptions(results).map((o) => o.textContent)).toEqual([
        'A',
        'B',
      ]);
    });
  });
});
