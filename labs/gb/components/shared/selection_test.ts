/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {sendKeys} from '@web/test-runner-commands';
import {html, LitElement, render, type TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';

import {
  ariaSelectionValue,
  nextSelection,
  normalizeSelection,
  SelectionController,
  type SelectionAria,
  type SelectionMode,
  type SelectionOptions,
} from './selection.js';

describe('nextSelection()', () => {
  it('does nothing in none mode', () => {
    expect(nextSelection([false, true], 0, {mode: 'none'})).toEqual([false, true]);
  });

  // spec: segmented-buttons-5e14ea, segmented-buttons-79f767
  it('single mode selects the item and unselects the others', () => {
    expect(nextSelection([true, false, false], 2, {mode: 'single'})).toEqual([false, false, true]);
  });

  // spec: segmented-buttons-79dd8e
  it('single mode unselects the selected item', () => {
    expect(nextSelection([false, true], 1, {mode: 'single'})).toEqual([false, false]);
  });

  // spec: button-groups-8b0224
  it('single mode with required keeps the selected item selected', () => {
    expect(nextSelection([false, true], 1, {mode: 'single', required: true})).toEqual([false, true]);
    expect(nextSelection([false, true], 0, {mode: 'single', required: true})).toEqual([true, false]);
  });

  // spec: segmented-buttons-3c4a1d, segmented-buttons-ad49bf, segmented-buttons-160c2f
  it('multiple mode toggles the item and keeps the others', () => {
    expect(nextSelection([true, false], 1, {mode: 'multiple'})).toEqual([true, true]);
    expect(nextSelection([true, true], 0, {mode: 'multiple'})).toEqual([false, true]);
  });

  // spec: segmented-buttons-244706
  it('multiple mode is never required: all can be unselected', () => {
    expect(nextSelection([true], 0, {mode: 'multiple', required: true})).toEqual([false]);
  });

  it('ignores items that cannot be selected and indices out of range', () => {
    expect(nextSelection([false, false], 1, {mode: 'single'}, [true, false])).toEqual([false, false]);
    expect(nextSelection([false], 3, {mode: 'single'})).toEqual([false]);
    expect(nextSelection([false], -1, {mode: 'single'})).toEqual([false]);
  });

  it('does not change its input', () => {
    const selected = [false, true];
    nextSelection(selected, 0, {mode: 'single'});
    expect(selected).toEqual([false, true]);
  });
});

describe('normalizeSelection()', () => {
  it('none mode unselects everything', () => {
    expect(normalizeSelection([true, true], {mode: 'none'})).toEqual([false, false]);
  });

  it('single mode keeps the last selected item', () => {
    expect(normalizeSelection([true, true, false], {mode: 'single'})).toEqual([false, true, false]);
  });

  it('single mode keeps the preferred item when it is selected', () => {
    expect(normalizeSelection([true, true], {mode: 'single'}, {preferred: 0})).toEqual([true, false]);
    expect(normalizeSelection([true, false, true], {mode: 'single'}, {preferred: 1})).toEqual([false, false, true]);
  });

  it('single mode leaves at most one selected item alone', () => {
    expect(normalizeSelection([false, true], {mode: 'single'})).toEqual([false, true]);
    expect(normalizeSelection([false, false], {mode: 'single'})).toEqual([false, false]);
  });

  it('required single mode selects the first selectable item when none is', () => {
    expect(normalizeSelection([false, false], {mode: 'single', required: true})).toEqual([true, false]);
    expect(
      normalizeSelection([false, false, false], {mode: 'single', required: true}, {selectable: [false, true, true]}),
    ).toEqual([false, true, false]);
  });

  it('required single mode with nothing selectable selects nothing', () => {
    expect(
      normalizeSelection([false, false], {mode: 'single', required: true}, {selectable: [false, false]}),
    ).toEqual([false, false]);
  });

  it('multiple mode keeps the state, even when nothing is selected and required', () => {
    expect(normalizeSelection([true, true, false], {mode: 'multiple'})).toEqual([true, true, false]);
    expect(normalizeSelection([false], {mode: 'multiple', required: true})).toEqual([false]);
  });
});

describe('ariaSelectionValue()', () => {
  it('is "true" or "false" for checked, pressed and selected', () => {
    for (const aria of ['checked', 'pressed', 'selected'] as SelectionAria[]) {
      expect(ariaSelectionValue(aria, true)).toBe('true');
      expect(ariaSelectionValue(aria, false)).toBe('false');
    }
  });

  it('is "page" for the current item and absent for the others', () => {
    expect(ariaSelectionValue('current', true)).toBe('page');
    expect(ariaSelectionValue('current', false)).toBeNull();
  });
});

class TestItem extends LitElement {
  @property({type: Boolean, reflect: true}) selected = false;
  @property({type: Boolean, reflect: true}) disabled = false;
  @property({type: Boolean, attribute: 'soft-disabled'}) softDisabled = false;
  @property() value = '';

  override connectedCallback() {
    super.connectedCallback();
    this.tabIndex = 0;
  }

  protected override render() {
    return html`<slot></slot><button part="inner" class="inner">inner</button>`;
  }
}
customElements.define('test-selection-item', TestItem);

/** A host whose controller options come from its properties. */
class TestHost extends LitElement {
  @property() mode: SelectionMode = 'single';
  @property({type: Boolean}) required = false;
  @property() aria?: SelectionAria;
  @property() keys: 'native' | 'controller' = 'controller';
  @property({type: Boolean}) claim = false;
  @property() eventsFrom: 'host' | 'item' = 'host';
  @property({attribute: false}) events?: Array<'input' | 'change'>;
  @property({attribute: false}) ignore?: SelectionOptions<TestItem>['ignore'];
  onChangeCalls: Array<TestItem | null> = [];

  readonly selection: SelectionController<TestItem>;

  constructor() {
    super();
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    this.selection = new SelectionController<TestItem>(this, {
      items: () => [...this.querySelectorAll<TestItem>('test-selection-item')],
      mode: () => this.mode,
      required: () => this.required,
      get aria() {
        return self.aria;
      },
      get keys() {
        return self.keys;
      },
      get claimClicks() {
        return self.claim;
      },
      get eventsFrom() {
        return self.eventsFrom;
      },
      get events() {
        return self.events;
      },
      ignore: (event, item) => Boolean(this.ignore?.(event, item)),
      onChange: (item) => this.onChangeCalls.push(item),
    });
  }

  protected override render() {
    return html`<slot></slot>`;
  }
}
customElements.define('test-selection-host', TestHost);

let container: HTMLElement | undefined;

async function settle() {
  const hostEl = container?.querySelector('test-selection-host') as TestHost | null;
  await hostEl?.updateComplete;
  for (const item of container?.querySelectorAll<TestItem>('test-selection-item') ?? []) {
    await item.updateComplete;
  }
  await new Promise((resolve) => requestAnimationFrame(resolve));
}

async function mount(template: TemplateResult) {
  container?.remove();
  container = document.createElement('div');
  document.body.appendChild(container);
  render(template, container);
  await settle();
  const hostEl = container.querySelector<TestHost>('test-selection-host')!;
  return {
    host: hostEl,
    items: [...container.querySelectorAll<TestItem>('test-selection-item')],
  };
}

const itemsHtml = html`
  <test-selection-item value="a">A</test-selection-item>
  <test-selection-item value="b">B</test-selection-item>
  <test-selection-item value="c">C</test-selection-item>
`;

/** Records the events a target receives. */
function record(target: EventTarget, types = ['input', 'change']) {
  const log: string[] = [];
  for (const type of types) target.addEventListener(type, (e) => log.push(`${type}:${(e.target as Element).localName}`));
  return log;
}

describe('SelectionController', () => {
  afterEach(() => container?.remove());

  const selectedValues = (items: TestItem[]) => items.filter((i) => i.selected).map((i) => i.value);

  describe('single mode', () => {
    // spec: segmented-buttons-5e14ea, segmented-buttons-79f767
    it('selects the clicked item and unselects the previous one', async () => {
      const {items} = await mount(html`<test-selection-host mode="single">${itemsHtml}</test-selection-host>`);
      items[0].click();
      expect(selectedValues(items)).toEqual(['a']);
      items[2].click();
      expect(selectedValues(items)).toEqual(['c']);
    });

    // spec: segmented-buttons-79dd8e
    it('unselects the selected item when clicked again', async () => {
      const {items} = await mount(html`<test-selection-host mode="single">${itemsHtml}</test-selection-host>`);
      items[1].click();
      items[1].click();
      expect(selectedValues(items)).toEqual([]);
    });

    // spec: button-groups-8b0224
    it('keeps the selected item selected when required, but still switches', async () => {
      const {items, host} = await mount(
        html`<test-selection-host mode="single" required>${itemsHtml}</test-selection-host>`,
      );
      items[1].click();
      items[1].click();
      expect(selectedValues(items)).toEqual(['b']);
      items[0].click();
      expect(selectedValues(items)).toEqual(['a']);
      expect(host.selection.required).toBeTrue();
    });
  });

  describe('multiple mode', () => {
    // spec: segmented-buttons-3c4a1d, segmented-buttons-ad49bf, chips-b762ef
    it('toggles each item on its own', async () => {
      const {items} = await mount(html`<test-selection-host mode="multiple">${itemsHtml}</test-selection-host>`);
      items[0].click();
      items[2].click();
      expect(selectedValues(items)).toEqual(['a', 'c']);
      items[0].click();
      expect(selectedValues(items)).toEqual(['c']);
    });

    // spec: segmented-buttons-244706
    it('allows all or none to be selected, even with required', async () => {
      const {items, host} = await mount(
        html`<test-selection-host mode="multiple" required>${itemsHtml}</test-selection-host>`,
      );
      for (const item of items) item.click();
      expect(selectedValues(items)).toEqual(['a', 'b', 'c']);
      for (const item of items) item.click();
      expect(selectedValues(items)).toEqual([]);
      expect(host.selection.required).toBeFalse();
    });
  });

  describe('none mode', () => {
    it('selects nothing on click and fires no events', async () => {
      const {items, host} = await mount(html`<test-selection-host mode="none">${itemsHtml}</test-selection-host>`);
      const log = record(host);
      items[0].click();
      expect(selectedValues(items)).toEqual([]);
      expect(log).toEqual([]);
    });
  });

  describe('which items can be selected', () => {
    it('ignores disabled and soft-disabled items', async () => {
      const {items} = await mount(html`
        <test-selection-host mode="multiple">
          <test-selection-item value="a" disabled>A</test-selection-item>
          <test-selection-item value="b" soft-disabled>B</test-selection-item>
          <test-selection-item value="c">C</test-selection-item>
        </test-selection-host>
      `);
      items[0].click();
      items[1].softDisabled = true;
      items[1].click();
      expect(selectedValues(items)).toEqual([]);
      items[2].click();
      expect(selectedValues(items)).toEqual(['c']);
    });

    it('ignores clicks outside the items and clicks `ignore` rejects', async () => {
      const {items, host} = await mount(html`
        <test-selection-host mode="single">
          <span id="other">x</span>
          <test-selection-item value="a">A</test-selection-item>
        </test-selection-host>
      `);
      container!.querySelector<HTMLElement>('#other')!.click();
      expect(selectedValues(items)).toEqual([]);
      host.ignore = (event) => event.composedPath().some((el) => (el as Element).classList?.contains('inner'));
      items[0].shadowRoot!.querySelector<HTMLElement>('.inner')!.click();
      expect(selectedValues(items)).toEqual([]);
      items[0].click();
      expect(selectedValues(items)).toEqual(['a']);
    });

    it('finds the item from a click inside its shadow root', async () => {
      const {items} = await mount(html`<test-selection-host mode="single">${itemsHtml}</test-selection-host>`);
      items[1].shadowRoot!.querySelector<HTMLElement>('.inner')!.click();
      expect(selectedValues(items)).toEqual(['b']);
    });

    it('leaves a click alone when something already cancelled it', async () => {
      const {items, host} = await mount(html`<test-selection-host mode="single">${itemsHtml}</test-selection-host>`);
      host.addEventListener('click', (e) => e.preventDefault(), {capture: true});
      items[0].click();
      expect(selectedValues(items)).toEqual([]);
    });
  });

  describe('keyboard', () => {
    // spec: button-groups-d2318f, segmented-buttons-79dd8e, segmented-buttons-a6ff04, chips-cfa8a5, tabs-85861b, navigation-bar-5077b0
    it('Space and Enter select the focused item', async () => {
      const {items} = await mount(html`<test-selection-host mode="single">${itemsHtml}</test-selection-host>`);
      items[0].focus();
      await sendKeys({press: 'Space'});
      expect(selectedValues(items)).toEqual(['a']);
      items[1].focus();
      await sendKeys({press: 'Enter'});
      expect(selectedValues(items)).toEqual(['b']);
    });

    // spec: segmented-buttons-160c2f, segmented-buttons-8e637f
    it('Space and Enter unselect a selected item in multiple mode', async () => {
      const {items} = await mount(html`<test-selection-host mode="multiple">${itemsHtml}</test-selection-host>`);
      items[0].focus();
      await sendKeys({press: 'Space'});
      await sendKeys({press: 'Enter'});
      expect(selectedValues(items)).toEqual([]);
    });

    it('Space and Enter respect required', async () => {
      const {items} = await mount(
        html`<test-selection-host mode="single" required>${itemsHtml}</test-selection-host>`,
      );
      items[0].focus();
      await sendKeys({press: 'Space'});
      await sendKeys({press: 'Space'});
      expect(selectedValues(items)).toEqual(['a']);
    });

    it('prevents the page from scrolling on Space', async () => {
      const {items} = await mount(html`<test-selection-host mode="single">${itemsHtml}</test-selection-host>`);
      const event = new KeyboardEvent('keydown', {key: ' ', bubbles: true, composed: true, cancelable: true});
      items[0].dispatchEvent(event);
      expect(event.defaultPrevented).toBeTrue();
      expect(selectedValues(items)).toEqual(['a']);
    });

    it('ignores other keys, modified keys and repeats', async () => {
      const {items} = await mount(html`<test-selection-host mode="multiple">${itemsHtml}</test-selection-host>`);
      const press = (init: KeyboardEventInit) =>
        items[0].dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, composed: true, cancelable: true, ...init}));
      press({key: 'a'});
      press({key: 'Enter', ctrlKey: true});
      press({key: 'Enter', shiftKey: true});
      press({key: 'Enter', altKey: true});
      press({key: 'Enter', metaKey: true});
      expect(selectedValues(items)).toEqual([]);
      press({key: 'Enter'});
      press({key: 'Enter', repeat: true});
      expect(selectedValues(items)).toEqual(['a']);
    });

    it('does not handle keys in native mode (the item turns them into clicks)', async () => {
      const {items} = await mount(
        html`<test-selection-host mode="single" keys="native">${itemsHtml}</test-selection-host>`,
      );
      items[0].focus();
      await sendKeys({press: 'Enter'});
      expect(selectedValues(items)).toEqual([]);
    });

    it('selects through a native button, which clicks on Space and Enter', async () => {
      const {items} = await mount(
        html`<test-selection-host mode="single" keys="native">${itemsHtml}</test-selection-host>`,
      );
      items[1].shadowRoot!.querySelector<HTMLElement>('.inner')!.focus();
      await sendKeys({press: 'Space'});
      expect(selectedValues(items)).toEqual(['b']);
      await sendKeys({press: 'Enter'});
      expect(selectedValues(items)).toEqual([]);
    });
  });

  describe('events', () => {
    // spec: button-groups-5d154b
    it('fires input then change on the host when the user changes the selection', async () => {
      const {items, host} = await mount(html`<test-selection-host mode="single">${itemsHtml}</test-selection-host>`);
      const log = record(host);
      items[0].click();
      expect(log).toEqual(['input:test-selection-host', 'change:test-selection-host']);
    });

    it('fires input as a composed InputEvent and change as a bubbling Event', async () => {
      const {items, host} = await mount(html`<test-selection-host mode="single">${itemsHtml}</test-selection-host>`);
      let input: Event | undefined;
      let change: Event | undefined;
      host.addEventListener('input', (e) => (input = e));
      host.addEventListener('change', (e) => (change = e));
      items[0].click();
      expect(input instanceof InputEvent).toBeTrue();
      expect(input!.bubbles && input!.composed).toBeTrue();
      expect(change!.bubbles).toBeTrue();
    });

    it('has updated the selection and the form value when the events fire', async () => {
      const {items, host} = await mount(html`<test-selection-host mode="single">${itemsHtml}</test-selection-host>`);
      const seen: string[] = [];
      host.addEventListener('change', () => seen.push(host.selection.value));
      items[2].click();
      expect(seen).toEqual(['c']);
    });

    it('does not fire when the user changes nothing (required, none, disabled)', async () => {
      const {items, host} = await mount(
        html`<test-selection-host mode="single" required>${itemsHtml}</test-selection-host>`,
      );
      const log = record(host);
      items[0].click();
      expect(log.length).toBe(2);
      items[0].click();
      expect(log.length).toBe(2);
    });

    it('does not fire for programmatic changes', async () => {
      const {items, host} = await mount(html`<test-selection-host mode="multiple">${itemsHtml}</test-selection-host>`);
      const log = record(host);
      host.selection.select(items[0]);
      host.selection.setValues(['b', 'c']);
      host.selection.normalize();
      host.selection.clear();
      host.selection.reset();
      items[1].selected = true;
      await settle();
      expect(log).toEqual([]);
    });

    it('can fire from the item instead of the host', async () => {
      const {items, host} = await mount(
        html`<test-selection-host mode="single" eventsFrom="item">${itemsHtml}</test-selection-host>`,
      );
      const log = record(host);
      items[1].click();
      expect(log).toEqual(['input:test-selection-item', 'change:test-selection-item']);
    });

    it('can fire from the host and, without bubbling, from the item', async () => {
      const {items, host} = await mount(
        html`<test-selection-host mode="single" eventsFrom="both">${itemsHtml}</test-selection-host>`,
      );
      const hostLog = record(host);
      const itemEvents: boolean[] = [];
      items[1].addEventListener('change', (e) => itemEvents.push(e.bubbles));
      items[1].click();
      expect(itemEvents).toEqual([false]);
      expect(hostLog).toEqual(['input:test-selection-host', 'change:test-selection-host']);
    });

    it('lets a listener cancel the click to veto the selection', async () => {
      const {items, host} = await mount(html`<test-selection-host mode="single">${itemsHtml}</test-selection-host>`);
      container!.addEventListener('click', (e) => e.preventDefault());
      items[0].click();
      expect(host.selection.value).toBe('');
    });

    it('can fire only some events', async () => {
      const {items, host} = await mount(html`<test-selection-host mode="single">${itemsHtml}</test-selection-host>`);
      host.events = ['change'];
      const log = record(host);
      items[1].click();
      expect(log).toEqual(['change:test-selection-host']);
    });

    it('reports the activated item to onChange, and null for programmatic changes', async () => {
      const {items, host} = await mount(html`<test-selection-host mode="single">${itemsHtml}</test-selection-host>`);
      host.onChangeCalls.length = 0;
      items[1].click();
      expect(host.onChangeCalls).toEqual([items[1]]);
      host.onChangeCalls.length = 0;
      host.selection.select(items[2]);
      expect(host.onChangeCalls).toEqual([null]);
    });
  });

  describe('claimed clicks', () => {
    it('cancels the click when it handles it, so items that toggle themselves stay out', async () => {
      const {items, host} = await mount(
        html`<test-selection-host mode="single" claim>${itemsHtml}</test-selection-host>`,
      );
      let prevented = false;
      container!.addEventListener('click', (e) => (prevented = e.defaultPrevented));
      items[0].click();
      expect(prevented).toBeTrue();
      expect(host.selection.value).toBe('a');
    });

    it('leaves the click alone by default', async () => {
      const {items} = await mount(html`<test-selection-host mode="single">${itemsHtml}</test-selection-host>`);
      let prevented = true;
      container!.addEventListener('click', (e) => (prevented = e.defaultPrevented));
      items[0].click();
      expect(prevented).toBeFalse();
    });
  });

  describe('ARIA state', () => {
    const attributeOf = (item: TestItem, aria: string) => item.getAttribute(`aria-${aria}`);

    // spec: segmented-buttons-5e14ea, segmented-buttons-3c4a1d, segmented-buttons-7f895a
    it('reflects aria-checked for radio and checkbox items', async () => {
      const {items} = await mount(
        html`<test-selection-host mode="single" aria="checked">${itemsHtml}</test-selection-host>`,
      );
      expect(items.map((i) => attributeOf(i, 'checked'))).toEqual(['false', 'false', 'false']);
      items[1].click();
      await settle();
      expect(items.map((i) => attributeOf(i, 'checked'))).toEqual(['false', 'true', 'false']);
    });

    it('reflects aria-pressed for toggle buttons', async () => {
      const {items} = await mount(
        html`<test-selection-host mode="multiple" aria="pressed">${itemsHtml}</test-selection-host>`,
      );
      items[0].click();
      items[2].click();
      await settle();
      expect(items.map((i) => attributeOf(i, 'pressed'))).toEqual(['true', 'false', 'true']);
    });

    it('reflects aria-selected for tabs and options', async () => {
      const {items, host} = await mount(
        html`<test-selection-host mode="single" required aria="selected">${itemsHtml}</test-selection-host>`,
      );
      host.selection.normalize();
      await settle();
      expect(items.map((i) => attributeOf(i, 'selected'))).toEqual(['true', 'false', 'false']);
      items[2].click();
      await settle();
      expect(items.map((i) => attributeOf(i, 'selected'))).toEqual(['false', 'false', 'true']);
    });

    it('reflects aria-current="page" on the current item only', async () => {
      const {items, host} = await mount(
        html`<test-selection-host mode="single" required aria="current">${itemsHtml}</test-selection-host>`,
      );
      host.selection.normalize();
      await settle();
      expect(items.map((i) => attributeOf(i, 'current'))).toEqual(['page', null, null]);
      items[1].click();
      await settle();
      expect(items.map((i) => attributeOf(i, 'current'))).toEqual([null, 'page', null]);
    });

    it('follows programmatic changes too', async () => {
      const {items, host} = await mount(
        html`<test-selection-host mode="single" aria="checked">${itemsHtml}</test-selection-host>`,
      );
      host.selection.setValues(['c']);
      expect(attributeOf(items[2], 'checked')).toBe('true');
      host.selection.clear();
      expect(attributeOf(items[2], 'checked')).toBe('false');
    });

    it('writes no ARIA attribute when the items render their own', async () => {
      const {items} = await mount(html`<test-selection-host mode="single">${itemsHtml}</test-selection-host>`);
      items[0].click();
      await settle();
      for (const name of ['checked', 'pressed', 'selected', 'current']) {
        expect(items.map((i) => attributeOf(i, name))).toEqual([null, null, null]);
      }
    });
  });

  describe('form value', () => {
    it('is null when nothing is selected', async () => {
      const {host} = await mount(html`<test-selection-host mode="single">${itemsHtml}</test-selection-host>`);
      expect(host.selection.formValue('x')).toBeNull();
    });

    it('is the selected value in single mode', async () => {
      const {items, host} = await mount(html`<test-selection-host mode="single">${itemsHtml}</test-selection-host>`);
      items[1].click();
      expect(host.selection.formValue('x')).toBe('b');
    });

    it('is one entry per selected item in multiple mode', async () => {
      const {items, host} = await mount(html`<test-selection-host mode="multiple">${itemsHtml}</test-selection-host>`);
      items[0].click();
      items[2].click();
      const data = host.selection.formValue('x') as FormData;
      expect(data instanceof FormData).toBeTrue();
      expect(data.getAll('x')).toEqual(['a', 'c']);
    });
  });

  describe('programmatic API', () => {
    it('exposes the selected items, indices and values', async () => {
      const {items, host} = await mount(html`<test-selection-host mode="multiple">${itemsHtml}</test-selection-host>`);
      items[1].click();
      items[2].click();
      expect(host.selection.selectedItems).toEqual([items[1], items[2]]);
      expect(host.selection.selectedIndex).toBe(1);
      expect(host.selection.selectedIndices).toEqual([1, 2]);
      expect(host.selection.value).toBe('b');
      expect(host.selection.values).toEqual(['b', 'c']);
    });

    it('has no selection index or value when nothing is selected', async () => {
      const {host} = await mount(html`<test-selection-host mode="single">${itemsHtml}</test-selection-host>`);
      expect(host.selection.selectedIndex).toBe(-1);
      expect(host.selection.value).toBe('');
      expect(host.selection.values).toEqual([]);
    });

    it('setValues() selects only the first match in single mode', async () => {
      const {items, host} = await mount(html`<test-selection-host mode="single">${itemsHtml}</test-selection-host>`);
      host.selection.setValues(['c', 'a']);
      expect(selectedValues(items)).toEqual(['a']);
      host.selection.setValues([]);
      expect(selectedValues(items)).toEqual([]);
    });

    it('setValues() selects every match in multiple mode', async () => {
      const {items, host} = await mount(html`<test-selection-host mode="multiple">${itemsHtml}</test-selection-host>`);
      host.selection.setValues(['c', 'a']);
      expect(selectedValues(items)).toEqual(['a', 'c']);
    });

    it('select() in single mode unselects the others; unselecting works too', async () => {
      const {items, host} = await mount(html`<test-selection-host mode="single">${itemsHtml}</test-selection-host>`);
      host.selection.select(items[0]);
      host.selection.select(items[1]);
      expect(selectedValues(items)).toEqual(['b']);
      host.selection.select(items[1], false);
      expect(selectedValues(items)).toEqual([]);
      host.selection.select(document.createElement('test-selection-item') as TestItem);
      expect(selectedValues(items)).toEqual([]);
    });

    it('activate() reports whether the selection changed', async () => {
      const {items, host} = await mount(
        html`<test-selection-host mode="single" required>${itemsHtml}</test-selection-host>`,
      );
      expect(host.selection.activate(items[0])).toBeTrue();
      expect(host.selection.activate(items[0])).toBeFalse();
      expect(host.selection.activate(document.createElement('test-selection-item') as TestItem)).toBeFalse();
    });
  });

  describe('normalize()', () => {
    it('keeps one item in single mode', async () => {
      const {items, host} = await mount(html`
        <test-selection-host mode="single">
          <test-selection-item value="a" selected>A</test-selection-item>
          <test-selection-item value="b" selected>B</test-selection-item>
        </test-selection-host>
      `);
      host.selection.normalize();
      expect(selectedValues(items)).toEqual(['b']);
      items[0].selected = true;
      host.selection.normalize(items[0]);
      expect(selectedValues(items)).toEqual(['a']);
    });

    // spec: button-groups-8b0224
    it('selects the first selectable item when required and none is selected', async () => {
      const {items, host} = await mount(html`
        <test-selection-host mode="single" required>
          <test-selection-item value="a" disabled>A</test-selection-item>
          <test-selection-item value="b">B</test-selection-item>
        </test-selection-host>
      `);
      host.selection.normalize();
      expect(selectedValues(items)).toEqual(['b']);
    });

    it('clears the selection in none mode', async () => {
      const {items, host} = await mount(html`
        <test-selection-host mode="none">
          <test-selection-item value="a" selected>A</test-selection-item>
        </test-selection-host>
      `);
      host.selection.normalize();
      expect(selectedValues(items)).toEqual([]);
    });

    it('re-applies the rules when the mode changes', async () => {
      const {items, host} = await mount(html`
        <test-selection-host mode="multiple">
          <test-selection-item value="a" selected>A</test-selection-item>
          <test-selection-item value="b" selected>B</test-selection-item>
        </test-selection-host>
      `);
      expect(selectedValues(items)).toEqual(['a', 'b']);
      host.mode = 'single';
      host.selection.normalize();
      expect(selectedValues(items)).toEqual(['b']);
    });
  });

  describe('programmatic changes by the items', () => {
    it('unselects the others when an item is selected in single mode', async () => {
      const {items} = await mount(html`
        <test-selection-host mode="single">
          <test-selection-item value="a" selected>A</test-selection-item>
          <test-selection-item value="b">B</test-selection-item>
        </test-selection-host>
      `);
      items[1].selected = true;
      await settle();
      expect(selectedValues(items)).toEqual(['b']);
    });

    it('selects the first item again when required and the last one is unselected', async () => {
      const {items} = await mount(html`
        <test-selection-host mode="single" required>
          <test-selection-item value="a" selected>A</test-selection-item>
          <test-selection-item value="b">B</test-selection-item>
        </test-selection-host>
      `);
      items[0].selected = false;
      await settle();
      expect(selectedValues(items)).toEqual(['a']);
    });
  });

  describe('reset()', () => {
    it('restores the state the items had when they were first normalized', async () => {
      const {items, host} = await mount(html`
        <test-selection-host mode="multiple">
          <test-selection-item value="a" selected>A</test-selection-item>
          <test-selection-item value="b">B</test-selection-item>
        </test-selection-host>
      `);
      host.selection.normalize();
      items[0].click();
      items[1].click();
      expect(selectedValues(items)).toEqual(['b']);
      host.selection.reset();
      expect(selectedValues(items)).toEqual(['a']);
    });
  });

  describe('lifecycle', () => {
    it('stops listening when the host is disconnected', async () => {
      const {items, host} = await mount(html`<test-selection-host mode="single">${itemsHtml}</test-selection-host>`);
      const parent = host.parentElement!;
      host.remove();
      items[0].click();
      expect(selectedValues(items)).toEqual([]);
      parent.appendChild(host);
      items[0].click();
      expect(selectedValues(items)).toEqual(['a']);
    });
  });
});
