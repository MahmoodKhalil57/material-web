/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

// Expectations compare indices and booleans, not elements: a failing
// expectation on an element can stall the test runner while it serializes
// the element.

import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import {internals} from '../../internal/behaviors/element-internals.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {TEXT_FIELD_CLASSES} from '../../components/textfield/text-field.js';

import './md-gb-select.js';
import {type SelectBase} from './select-base.js';
import {type SelectOptionElement} from './select-option-element.js';
import {
  SELECT_CLASSES,
  matchesFilter,
  selectClasses,
  selectOptionClasses,
} from './select.js';
import {type SelectElement} from './select-element.js';

adoptStyles(document, [m3Styles]);

describe('<md-gb-select>', () => {
  const env = new Environment();

  const fruits = html`
    <md-gb-select-option value="apple">Apple</md-gb-select-option>
    <md-gb-select-option value="banana">Banana</md-gb-select-option>
    <md-gb-select-option value="blueberry">Blueberry</md-gb-select-option>
    <md-gb-select-option value="cherry" disabled>Cherry</md-gb-select-option>
    <md-gb-select-option value="date">Date</md-gb-select-option>
  `;

  async function setupTest(
    template = html`<md-gb-select label="Fruit">${fruits}</md-gb-select>`,
  ) {
    const root = env.render(template);
    await env.waitForStability();
    const select = root.querySelector('md-gb-select') as SelectElement;
    if (!select) {
      throw new Error('Failed to query rendered <md-gb-select>');
    }
    await select.updateComplete;
    const shadow = select.shadowRoot!;
    const field = shadow.querySelector('[role="combobox"]') as HTMLElement;
    const listbox = shadow.querySelector('[role="listbox"]') as HTMLElement;
    const fieldRoot = shadow.querySelector('.select') as HTMLElement;
    const options = select.options;
    return {root, select, shadow, field, listbox, fieldRoot, options};
  }


  /** The index of the active option (`aria-activedescendant`), or -1. */
  function activeIndex(field: HTMLElement) {
    const active = field.ariaActiveDescendantElement;
    const host = field.getRootNode() as ShadowRoot;
    return (host.host as SelectBase).options.indexOf(
      active as SelectOptionElement,
    );
  }

  async function key(
    select: SelectElement,
    target: HTMLElement,
    keyName: string,
    init: KeyboardEventInit = {},
  ) {
    const event = new KeyboardEvent('keydown', {
      key: keyName,
      bubbles: true,
      composed: true,
      cancelable: true,
      ...init,
    });
    target.dispatchEvent(event);
    await select.updateComplete;
    return event;
  }

  describe('rendering', () => {
    it('renders a filled text field by default', async () => {
      const {select, fieldRoot} = await setupTest();
      expect(select.variant).toBe('filled');
      expect(fieldRoot.classList).toContain(TEXT_FIELD_CLASSES.filled);
      expect(fieldRoot.classList).toContain(SELECT_CLASSES.select);
      expect(fieldRoot.classList).toContain(TEXT_FIELD_CLASSES.hasTrailingIcon);
    });

    it('renders the outlined variant', async () => {
      const {fieldRoot} = await setupTest(
        html`<md-gb-select variant="outlined" label="Fruit"
          >${fruits}</md-gb-select
        >`,
      );
      expect(fieldRoot.classList).toContain(TEXT_FIELD_CLASSES.outlined);
    });

    it('uses the outlined select container color (transparent)', async () => {
      const {shadow} = await setupTest(
        html`<md-gb-select variant="outlined" label="Fruit"
          >${fruits}</md-gb-select
        >`,
      );
      const container = shadow.querySelector('.text-field-container')!;
      expect(getComputedStyle(container).backgroundColor).toBe(
        'rgba(0, 0, 0, 0)',
      );
    });

    it('renders the label, with an asterisk when required', async () => {
      const {select, shadow} = await setupTest(
        html`<md-gb-select label="Fruit" required>${fruits}</md-gb-select>`,
      );
      expect(shadow.querySelector('#label')!.textContent).toBe('Fruit*');
      select.noAsterisk = true;
      await select.updateComplete;
      expect(shadow.querySelector('#label')!.textContent).toBe('Fruit');
    });

    it('renders supporting text and error text', async () => {
      const {select, shadow, field} = await setupTest(
        html`<md-gb-select label="Fruit" supporting-text="Pick one"
          >${fruits}</md-gb-select
        >`,
      );
      const text = () => shadow.querySelector('#supporting-text');
      expect(text()!.textContent).toBe('Pick one');
      expect(field.getAttribute('aria-describedby')).toBe('supporting-text');
      select.error = true;
      select.errorText = 'Required';
      await select.updateComplete;
      expect(text()!.textContent).toBe('Required');
      expect(text()!.getAttribute('role')).toBe('alert');
      expect(field.getAttribute('aria-invalid')).toBe('true');
    });

    it('renders a dropdown arrow that rotates while open', async () => {
      const {select, shadow, fieldRoot} = await setupTest();
      const arrow = shadow.querySelector(`.${SELECT_CLASSES.arrow}`)!;
      expect(arrow.querySelector('svg')).not.toBeNull();
      expect(fieldRoot.classList).not.toContain(SELECT_CLASSES.open);
      select.open = true;
      await select.updateComplete;
      expect(fieldRoot.classList).toContain(SELECT_CLASSES.open);
      // The rotation transitions; its target is the token value.
      expect(
        getComputedStyle(select).getPropertyValue(
          '--trailing-icon-expanded-rotation',
        ),
      ).toBe('180deg');
    });

    it('floats the label when an option is selected', async () => {
      const {select, fieldRoot, field} = await setupTest();
      expect(fieldRoot.classList).not.toContain(TEXT_FIELD_CLASSES.populated);
      select.value = 'banana';
      await select.updateComplete;
      expect(fieldRoot.classList).toContain(TEXT_FIELD_CLASSES.populated);
      expect(field.textContent!.trim()).toBe('Banana');
    });

    it('sizes the menu to the field width', async () => {
      const {select, shadow, listbox} = await setupTest(
        // No motion, so the menu is not mid-way through its scale-in.
        html`<md-gb-select
          label="Fruit"
          style="inline-size: 320px; --md-sys-motion-spring-fast-spatial-duration: 0s"
          >${fruits}</md-gb-select
        >`,
      );
      select.open = true;
      await select.updateComplete;
      const container = shadow.querySelector('.text-field-container')!;
      const fieldRect = container.getBoundingClientRect();
      const menuRect = listbox.getBoundingClientRect();
      expect(Math.round(menuRect.width)).toBe(Math.round(fieldRect.width));
      expect(Math.round(menuRect.left)).toBe(Math.round(fieldRect.left));
      expect(Math.round(menuRect.top)).toBe(Math.round(fieldRect.bottom));
    });
  });

  describe('accessibility', () => {
    it('uses the combobox and listbox roles', async () => {
      const {field, listbox, options} = await setupTest();
      expect(field.getAttribute('role')).toBe('combobox');
      expect(field.getAttribute('aria-haspopup')).toBe('listbox');
      expect(field.getAttribute('aria-controls')).toBe(listbox.id);
      expect(field.getAttribute('aria-expanded')).toBe('false');
      expect(field.getAttribute('aria-labelledby')).toBe('label');
      expect(listbox.getAttribute('aria-labelledby')).toBe('label');
      expect(field.tabIndex).toBe(0);
      expect(options[0][internals].role).toBe('option');
    });

    it('sets aria-selected and aria-disabled on options', async () => {
      const {select, options} = await setupTest();
      select.value = 'apple';
      await select.updateComplete;
      await options[0].updateComplete;
      await options[3].updateComplete;
      expect(options[0][internals].ariaSelected).toBe('true');
      expect(options[1][internals].ariaSelected).toBe('false');
      expect(options[3][internals].ariaDisabled).toBe('true');
    });

    it('sets aria-expanded and aria-activedescendant while open', async () => {
      const {select, field, options} = await setupTest();
      select.value = 'banana';
      select.open = true;
      await select.updateComplete;
      expect(field.getAttribute('aria-expanded')).toBe('true');
      expect(activeIndex(field)).toBe(1);
      expect(options[1].active).toBeTrue();
      select.open = false;
      await select.updateComplete;
      expect(activeIndex(field)).toBe(-1);
      expect(options[1].active).toBeFalse();
    });

    it('uses aria-label from the host instead of the label', async () => {
      const {field} = await setupTest(
        html`<md-gb-select aria-label="Choose a fruit">${fruits}</md-gb-select>`,
      );
      expect(field.getAttribute('aria-label')).toBe('Choose a fruit');
      expect(field.hasAttribute('aria-labelledby')).toBeFalse();
    });

    it('shows the focus ring on the active option', async () => {
      const {select, options} = await setupTest();
      select.open = true;
      await select.updateComplete;
      await options[0].updateComplete;
      const item = options[0].shadowRoot!.querySelector('.menu-item')!;
      expect(item.classList).toContain('focus-visible');
      expect(getComputedStyle(item, '::before').outlineStyle).not.toBe('none');
    });

    it('shows a checkmark on the selected option', async () => {
      const {select, options} = await setupTest();
      select.value = 'date';
      await select.updateComplete;
      await options[4].updateComplete;
      expect(options[4].shadowRoot!.querySelector('.checkmark')).not.toBeNull();
      expect(options[0].shadowRoot!.querySelector('.checkmark')).toBeNull();
    });
  });

  describe('selection', () => {
    it('selects by value', async () => {
      const {select, options} = await setupTest();
      expect(select.value).toBe('');
      expect(select.selectedIndex).toBe(-1);
      select.value = 'blueberry';
      expect(select.value).toBe('blueberry');
      expect(select.selectedIndex).toBe(2);
      expect(options[2].selected).toBeTrue();
      expect(select.selectedOptions.length).toBe(1);
      expect(select.selectedOptions[0] === options[2]).toBeTrue();
    });

    it('selects by selectedIndex', async () => {
      const {select, options} = await setupTest();
      select.selectedIndex = 1;
      expect(select.value).toBe('banana');
      expect(options[1].selected).toBeTrue();
      select.selectedIndex = -1;
      expect(select.value).toBe('');
      expect(options.some((option) => option.selected)).toBeFalse();
    });

    it('keeps a single selection when an option is selected directly', async () => {
      const {select, options} = await setupTest();
      select.value = 'apple';
      options[4].selected = true;
      expect(options[0].selected).toBeFalse();
      expect(select.value).toBe('date');
    });

    it('applies the value attribute', async () => {
      const {select, field} = await setupTest(
        html`<md-gb-select label="Fruit" value="date">${fruits}</md-gb-select>`,
      );
      expect(select.value).toBe('date');
      expect(field.textContent!.trim()).toBe('Date');
    });

    it('applies a selected option attribute', async () => {
      const {select} = await setupTest(
        html`<md-gb-select label="Fruit">
          <md-gb-select-option value="a">A</md-gb-select-option>
          <md-gb-select-option value="b" selected>B</md-gb-select-option>
        </md-gb-select>`,
      );
      expect(select.value).toBe('b');
      expect(select.selectedIndex).toBe(1);
    });

    it('defaults option values to their text', async () => {
      const {select} = await setupTest(
        html`<md-gb-select label="Fruit">
          <md-gb-select-option>Kiwi</md-gb-select-option>
        </md-gb-select>`,
      );
      select.selectedIndex = 0;
      expect(select.value).toBe('Kiwi');
    });

    it('does not fire events for programmatic changes', async () => {
      const {select} = await setupTest();
      const change = jasmine.createSpy('change');
      select.addEventListener('change', change);
      select.value = 'apple';
      expect(change).not.toHaveBeenCalled();
    });
  });

  describe('pointer', () => {
    it('opens and closes the menu on click', async () => {
      const {select, shadow, listbox} = await setupTest();
      const container = shadow.querySelector(
        '.text-field-container',
      ) as HTMLElement;
      const opening = jasmine.createSpy('opening');
      select.addEventListener('opening', opening);
      // The popover's `toggle` event (and so `opened`) fires in a later task.
      const opened = new Promise((resolve) => {
        select.addEventListener('opened', resolve, {once: true});
      });
      container.click();
      await select.updateComplete;
      expect(select.open).toBeTrue();
      expect(listbox.matches(':popover-open')).toBeTrue();
      expect(opening).toHaveBeenCalledTimes(1);
      await opened;
      container.click();
      await select.updateComplete;
      expect(select.open).toBeFalse();
      expect(listbox.matches(':popover-open')).toBeFalse();
    });

    it('selects a clicked option and fires input and change', async () => {
      const {select, options} = await setupTest();
      select.open = true;
      await select.updateComplete;
      const input = jasmine.createSpy('input');
      const change = jasmine.createSpy('change');
      select.addEventListener('input', input);
      select.addEventListener('change', change);
      options[1].click();
      await select.updateComplete;
      expect(select.value).toBe('banana');
      expect(select.open).toBeFalse();
      expect(input).toHaveBeenCalledTimes(1);
      expect(change).toHaveBeenCalledTimes(1);
    });

    it('ignores clicks on disabled options', async () => {
      const {select, options} = await setupTest();
      select.open = true;
      await select.updateComplete;
      options[3].click();
      await select.updateComplete;
      expect(select.value).toBe('');
      expect(select.open).toBeTrue();
    });

    it('does not open when disabled', async () => {
      const {select, shadow, field} = await setupTest(
        html`<md-gb-select label="Fruit" disabled>${fruits}</md-gb-select>`,
      );
      (shadow.querySelector('.text-field-container') as HTMLElement).click();
      await select.updateComplete;
      expect(select.open).toBeFalse();
      expect(field.tabIndex).toBe(-1);
      expect(field.getAttribute('aria-disabled')).toBe('true');
    });

    it('closes when focus leaves', async () => {
      const {root, select, field} = await setupTest(
        html`<md-gb-select label="Fruit">${fruits}</md-gb-select
          ><button>Next</button>`,
      );
      field.focus();
      select.open = true;
      await select.updateComplete;
      root.querySelector('button')!.focus();
      await select.updateComplete;
      expect(select.open).toBeFalse();
    });
  });

  describe('keyboard', () => {
    it('opens with Alt+Down and activates the selected option', async () => {
      const {select, field} = await setupTest();
      select.value = 'blueberry';
      await key(select, field, 'ArrowDown', {altKey: true});
      expect(select.open).toBeTrue();
      expect(activeIndex(field)).toBe(2);
    });

    it('opens with Enter, Space, Down and Up on the first option', async () => {
      for (const name of ['Enter', ' ', 'ArrowDown', 'ArrowUp']) {
        const {select, field} = await setupTest();
        const event = await key(select, field, name);
        expect(event.defaultPrevented).withContext(name).toBeTrue();
        expect(select.open).withContext(name).toBeTrue();
        expect(activeIndex(field))
          .withContext(name).toBe(0);
      }
    });

    it('moves the active option with arrows, Home and End', async () => {
      const {select, field} = await setupTest();
      await key(select, field, 'ArrowDown');
      await key(select, field, 'ArrowDown');
      expect(activeIndex(field)).toBe(1);
      await key(select, field, 'End');
      expect(activeIndex(field)).toBe(4);
      // Does not wrap.
      await key(select, field, 'ArrowDown');
      expect(activeIndex(field)).toBe(4);
      await key(select, field, 'ArrowUp');
      // Disabled options can be active (menus spec).
      expect(activeIndex(field)).toBe(3);
      await key(select, field, 'Home');
      expect(activeIndex(field)).toBe(0);
    });

    it('selects the active option with Enter and closes', async () => {
      const {select, field} = await setupTest();
      const change = jasmine.createSpy('change');
      select.addEventListener('change', change);
      await key(select, field, 'ArrowDown');
      await key(select, field, 'ArrowDown');
      await key(select, field, 'Enter');
      expect(select.value).toBe('banana');
      expect(select.open).toBeFalse();
      expect(change).toHaveBeenCalledTimes(1);
    });

    it('selects the active option with Alt+Up', async () => {
      const {select, field} = await setupTest();
      await key(select, field, 'End');
      await key(select, field, 'ArrowUp', {altKey: true});
      expect(select.value).toBe('date');
      expect(select.open).toBeFalse();
    });

    it('does not select a disabled option', async () => {
      const {select, field} = await setupTest();
      await key(select, field, 'End');
      await key(select, field, 'ArrowUp');
      await key(select, field, 'Enter');
      expect(select.value).toBe('');
      expect(select.open).toBeTrue();
    });

    it('closes with Escape without changing the value', async () => {
      const {select, field} = await setupTest();
      select.value = 'apple';
      await key(select, field, 'ArrowDown');
      await key(select, field, 'ArrowDown');
      const event = await key(select, field, 'Escape');
      expect(event.defaultPrevented).toBeTrue();
      expect(select.open).toBeFalse();
      expect(select.value).toBe('apple');
    });

    it('moves to the option matching typed characters', async () => {
      const {select, field} = await setupTest();
      await key(select, field, 'b');
      expect(select.open).toBeTrue();
      expect(activeIndex(field)).toBe(1);
      await key(select, field, 'l');
      expect(activeIndex(field)).toBe(2);
    });

    it('cycles through options when the same character repeats', async () => {
      const {select, field} = await setupTest();
      await key(select, field, 'b');
      expect(activeIndex(field)).toBe(1);
      await key(select, field, 'b');
      expect(activeIndex(field)).toBe(2);
      await key(select, field, 'b');
      expect(activeIndex(field)).toBe(1);
    });
  });

  describe('forms', () => {
    it('submits the value under its name', async () => {
      const {root, select} = await setupTest(
        html`<form>
          <md-gb-select name="fruit" label="Fruit">${fruits}</md-gb-select>
        </form>`,
      );
      select.value = 'cherry';
      const form = root.querySelector('form')!;
      expect(new FormData(form).get('fruit')).toBe('cherry');
    });

    it('is invalid when required and empty', async () => {
      const {select, shadow} = await setupTest(
        html`<md-gb-select label="Fruit" required>${fruits}</md-gb-select>`,
      );
      expect(select.checkValidity()).toBeFalse();
      expect(select.reportValidity()).toBeFalse();
      await select.updateComplete;
      const text = shadow.querySelector('#supporting-text')!;
      expect(text.textContent).toBe(select.validationMessage);
      select.value = 'apple';
      expect(select.checkValidity()).toBeTrue();
    });

    it('resets to the default selection', async () => {
      const {root, select} = await setupTest(
        html`<form>
          <md-gb-select name="fruit" label="Fruit">
            <md-gb-select-option value="a">A</md-gb-select-option>
            <md-gb-select-option value="b" selected>B</md-gb-select-option>
          </md-gb-select>
        </form>`,
      );
      select.value = 'a';
      root.querySelector('form')!.reset();
      expect(select.value).toBe('b');
    });
  });

  describe('selectClasses()', () => {
    it('adds the select classes to the text field classes', () => {
      const classes = selectClasses({open: true, variant: 'outlined'});
      expect(classes[TEXT_FIELD_CLASSES.textField]).toBeTrue();
      expect(classes[TEXT_FIELD_CLASSES.outlined]).toBeTrue();
      expect(classes[TEXT_FIELD_CLASSES.hasTrailingIcon]).toBeTrue();
      expect(classes[SELECT_CLASSES.select]).toBeTrue();
      expect(classes[SELECT_CLASSES.open]).toBeTrue();
      expect(classes[SELECT_CLASSES.autocomplete]).toBeFalse();
    });
  });

  describe('selectOptionClasses()', () => {
    it('maps selected to checked and active to focus-visible', () => {
      const classes = selectOptionClasses({selected: true, active: true});
      expect(classes['menu-item']).toBeTrue();
      expect(classes['checked']).toBeTrue();
      expect(classes['focus-visible']).toBeTrue();
      expect(selectOptionClasses()['focus-visible']).toBeFalse();
    });
  });

  describe('matchesFilter()', () => {
    it('filters by contains, starts-with or none', () => {
      expect(matchesFilter('Blueberry', 'BERRY', 'contains')).toBeTrue();
      expect(matchesFilter('Blueberry', 'berry', 'starts-with')).toBeFalse();
      expect(matchesFilter('Blueberry', 'blue', 'starts-with')).toBeTrue();
      expect(matchesFilter('Blueberry', 'x', 'none')).toBeTrue();
      expect(matchesFilter('Blueberry', '', 'contains')).toBeTrue();
    });
  });
});

