/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import '../../styles/icon/md-gb-icon.js';
import './md-gb-segmented-button-set.js';

import {html, type TemplateResult} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {internals} from '../../../behaviors/element-internals.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {
  clampDensity,
  nextFocusIndex,
  SEGMENTED_BUTTON_CLASSES,
  segmentedButtonClasses,
  segmentedButtonSetClasses,
  setupSegmentedButtonSet,
} from './segmented-button.js';
import {type SegmentedButtonElement} from './segmented-button-element.js';
import {type SegmentedButtonSetElement} from './segmented-button-set-element.js';
import segmentedButtonSetStyles from './segmented-button-set.cssresult.js';
import segmentedButtonStyles from './segmented-button.cssresult.js';

// System tokens (shape, typescale, motion) and the Light DOM classes.
adoptStyles(document, [
  m3Styles,
  segmentedButtonSetStyles,
  segmentedButtonStyles,
]);

describe('<md-gb-segmented-button-set>', () => {
  const env = new Environment();

  const threeSegments = html`<md-gb-segmented-button-set aria-label="Sort">
    <md-gb-segmented-button value="day">Day</md-gb-segmented-button>
    <md-gb-segmented-button value="week">Week</md-gb-segmented-button>
    <md-gb-segmented-button value="month">Month</md-gb-segmented-button>
  </md-gb-segmented-button-set>`;

  async function setupTest(template: TemplateResult = threeSegments) {
    const root = env.render(template);
    await env.waitForStability();
    const set = root.querySelector('md-gb-segmented-button-set');
    if (!set) {
      throw new Error('Failed to query rendered <md-gb-segmented-button-set>');
    }
    const segments = Array.from(
      set.querySelectorAll('md-gb-segmented-button'),
    );
    return {root, set, segments};
  }

  function innerButton(segment: SegmentedButtonElement) {
    const button = segment.shadowRoot?.querySelector('button');
    if (!button) throw new Error('Missing inner <button>');
    return button;
  }

  function press(target: Element, key: string) {
    const event = new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    target.dispatchEvent(event);
    return event;
  }

  /** The inner button that has focus, if any. */
  function focusedSegment(set: SegmentedButtonSetElement) {
    return set.segments.find(
      (segment) => segment.shadowRoot?.activeElement === innerButton(segment),
    );
  }

  describe('rendering', () => {
    it('defaults to single-select with density 0', async () => {
      const {set} = await setupTest();
      expect(set.multiselect).toBeFalse();
      expect(set.required).toBeFalse();
      expect(set.density).toBe(0);
      expect(set.value).toBe('');
      expect(set.selectedIndex).toBe(-1);
    });

    it('renders segments of equal width', async () => {
      const {segments} = await setupTest(html`<md-gb-segmented-button-set>
        <md-gb-segmented-button>A</md-gb-segmented-button>
        <md-gb-segmented-button>A much longer label</md-gb-segmented-button>
      </md-gb-segmented-button-set>`);
      const [a, b] = segments.map((s) => s.getBoundingClientRect().width);
      expect(a).toBeCloseTo(b, 1);
      // Sized to the widest label, not stretched.
      expect(a).toBeLessThan(400);
    });

    it('renders a 40px outlined container by default', async () => {
      const {segments} = await setupTest();
      const button = innerButton(segments[0]);
      const style = getComputedStyle(button);
      expect(button.getBoundingClientRect().height).toBe(40);
      expect(style.borderTopWidth).toBe('1px');
      expect(style.borderTopStyle).toBe('solid');
    });

    it('overlaps adjacent segments so borders are shared', async () => {
      const {segments} = await setupTest();
      expect(getComputedStyle(segments[0]).marginInlineEnd).toBe('-1px');
      expect(getComputedStyle(segments[2]).marginInlineEnd).toBe('-1px');
      const first = segments[0].getBoundingClientRect();
      const second = segments[1].getBoundingClientRect();
      expect(second.left).toBeCloseTo(first.right - 1, 0);
    });

    it('rounds only the outer corners', async () => {
      const {segments} = await setupTest();
      const first = getComputedStyle(innerButton(segments[0]));
      const middle = getComputedStyle(innerButton(segments[1]));
      const last = getComputedStyle(innerButton(segments[2]));
      expect(first.borderTopLeftRadius).not.toBe('0px');
      expect(first.borderTopRightRadius).toBe('0px');
      expect(middle.borderTopLeftRadius).toBe('0px');
      expect(middle.borderBottomRightRadius).toBe('0px');
      expect(last.borderTopLeftRadius).toBe('0px');
      expect(last.borderBottomRightRadius).not.toBe('0px');
    });

    it('mirrors the outer corners in RTL', async () => {
      const {segments} = await setupTest(html`<div dir="rtl">
        ${threeSegments}
      </div>`);
      const first = getComputedStyle(innerButton(segments[0]));
      expect(first.borderTopRightRadius).not.toBe('0px');
      expect(first.borderTopLeftRadius).toBe('0px');
      // The first segment is on the right.
      expect(segments[0].getBoundingClientRect().left).toBeGreaterThan(
        segments[1].getBoundingClientRect().left,
      );
    });

    it('removes 4px of height per density step', async () => {
      const {set, segments} = await setupTest();
      for (const [density, height] of [
        [-1, 36],
        [-2, 32],
        [-3, 28],
        [0, 40],
      ]) {
        set.density = density;
        await env.waitForStability();
        expect(innerButton(segments[0]).getBoundingClientRect().height)
          .withContext(`density ${density}`)
          .toBe(height);
      }
    });

    it('clamps density to 0..-3', async () => {
      const {set} = await setupTest();
      set.density = -7;
      await env.waitForStability();
      expect(set.density).toBe(-3);
      expect(set.getAttribute('density')).toBe('-3');
      set.density = 2;
      expect(set.density).toBe(0);
    });

    it('keeps a 48px touch target', async () => {
      const {set, segments} = await setupTest();
      set.density = -3;
      await env.waitForStability();
      const touch = segments[0].shadowRoot!.querySelector(
        `.${SEGMENTED_BUTTON_CLASSES.touch}`,
      )!;
      expect(touch.getBoundingClientRect().height).toBe(48);
    });

    it('marks segments with an icon and with a label', async () => {
      const {segments} = await setupTest(html`<md-gb-segmented-button-set>
        <md-gb-segmented-button
          ><md-gb-icon slot="icon">star</md-gb-icon>Both</md-gb-segmented-button
        >
        <md-gb-segmented-button aria-label="Star"
          ><md-gb-icon slot="icon">star</md-gb-icon></md-gb-segmented-button
        >
        <md-gb-segmented-button label="Label only"></md-gb-segmented-button>
      </md-gb-segmented-button-set>`);
      const [both, iconOnly, labelOnly] = segments.map(innerButton);
      expect(both.classList).toContain(SEGMENTED_BUTTON_CLASSES.withIcon);
      expect(both.classList).toContain(SEGMENTED_BUTTON_CLASSES.withLabel);
      expect(iconOnly.classList).toContain(SEGMENTED_BUTTON_CLASSES.withIcon);
      expect(iconOnly.classList).not.toContain(
        SEGMENTED_BUTTON_CLASSES.withLabel,
      );
      expect(iconOnly.getAttribute('aria-label')).toBe('Star');
      expect(labelOnly.classList).not.toContain(
        SEGMENTED_BUTTON_CLASSES.withIcon,
      );
      expect(labelOnly.classList).toContain(SEGMENTED_BUTTON_CLASSES.withLabel);
      expect(labelOnly.textContent).toContain('Label only');
    });

    it('shows the checkmark in place of the icon when selected', async () => {
      const {segments} = await setupTest(html`<md-gb-segmented-button-set>
        <md-gb-segmented-button selected
          ><md-gb-icon slot="icon">star</md-gb-icon>Icon</md-gb-segmented-button
        >
        <md-gb-segmented-button>Label</md-gb-segmented-button>
      </md-gb-segmented-button-set>`);
      const iconButton = innerButton(segments[0]);
      const icon = iconButton.querySelector(`.${SEGMENTED_BUTTON_CLASSES.icon}`)!;
      const check = iconButton.querySelector(
        `.${SEGMENTED_BUTTON_CLASSES.checkmark}`,
      )!;
      // Initial render has no transition.
      expect(getComputedStyle(icon).opacity).toBe('0');
      expect(getComputedStyle(check).opacity).toBe('1');
    });

    it('reserves the icon slot and centers the label of label-only segments', async () => {
      const {segments} = await setupTest(html`<md-gb-segmented-button-set>
        <md-gb-segmented-button>Label</md-gb-segmented-button>
        <md-gb-segmented-button no-checkmark>Plain</md-gb-segmented-button>
      </md-gb-segmented-button-set>`);
      const label = innerButton(segments[0]).querySelector(
        `.${SEGMENTED_BUTTON_CLASSES.label}`,
      )!;
      // (18px icon + 8px space) / 2
      expect(getComputedStyle(label).marginInlineStart).toBe('-13px');
      expect(getComputedStyle(label).marginInlineEnd).toBe('13px');
      const plain = innerButton(segments[1]);
      expect(
        getComputedStyle(
          plain.querySelector(`.${SEGMENTED_BUTTON_CLASSES.graphic}`)!,
        ).display,
      ).toBe('none');
    });
  });

  describe('accessibility', () => {
    it('is a radiogroup of radios in single-select', async () => {
      const {set, segments} = await setupTest();
      expect(set[internals].role).toBe('radiogroup');
      for (const segment of segments) {
        const button = innerButton(segment);
        expect(button.getAttribute('role')).toBe('radio');
        expect(button.getAttribute('aria-checked')).toBe('false');
      }
    });

    it('is a group of checkboxes in multi-select', async () => {
      const {set, segments} = await setupTest(html`<md-gb-segmented-button-set
        multiselect>
        <md-gb-segmented-button selected>A</md-gb-segmented-button>
        <md-gb-segmented-button>B</md-gb-segmented-button>
      </md-gb-segmented-button-set>`);
      expect(set[internals].role).toBe('group');
      expect(innerButton(segments[0]).getAttribute('role')).toBe('checkbox');
      expect(innerButton(segments[0]).getAttribute('aria-checked')).toBe(
        'true',
      );
      expect(innerButton(segments[1]).getAttribute('aria-checked')).toBe(
        'false',
      );
    });

    it('updates roles when multiselect changes', async () => {
      const {set, segments} = await setupTest();
      set.multiselect = true;
      await env.waitForStability();
      expect(set[internals].role).toBe('group');
      expect(innerButton(segments[0]).getAttribute('role')).toBe('checkbox');
    });

    it('sets aria-required on required single-select sets', async () => {
      const {set} = await setupTest();
      set.required = true;
      await env.waitForStability();
      expect(set[internals].ariaRequired).toBe('true');
    });

    it('has one tab stop: the first segment regardless of selection', async () => {
      const {segments} = await setupTest(html`<md-gb-segmented-button-set>
        <md-gb-segmented-button>A</md-gb-segmented-button>
        <md-gb-segmented-button selected>B</md-gb-segmented-button>
        <md-gb-segmented-button>C</md-gb-segmented-button>
      </md-gb-segmented-button-set>`);
      expect(segments.map((s) => innerButton(s).tabIndex)).toEqual([0, -1, -1]);
    });

    it('draws the shared focus ring when focus-visible', async () => {
      const {segments} = await setupTest();
      const button = innerButton(segments[0]);
      button.classList.add('focus-visible');
      expect(getComputedStyle(button).outlineStyle).toBe('solid');
    });

    it('skips a disabled first segment for the tab stop', async () => {
      const {segments} = await setupTest(html`<md-gb-segmented-button-set>
        <md-gb-segmented-button disabled>A</md-gb-segmented-button>
        <md-gb-segmented-button>B</md-gb-segmented-button>
      </md-gb-segmented-button-set>`);
      expect(innerButton(segments[0]).disabled).toBeTrue();
      expect(innerButton(segments[1]).tabIndex).toBe(0);
    });
  });

  describe('keyboard', () => {
    it('moves focus with arrow keys and wraps', async () => {
      const {set, segments} = await setupTest();
      segments[0].focus();
      press(innerButton(segments[0]), 'ArrowRight');
      expect(focusedSegment(set)).toBe(segments[1]);
      press(innerButton(segments[1]), 'ArrowDown');
      expect(focusedSegment(set)).toBe(segments[2]);
      press(innerButton(segments[2]), 'ArrowRight');
      expect(focusedSegment(set)).toBe(segments[0]);
      press(innerButton(segments[0]), 'ArrowLeft');
      expect(focusedSegment(set)).toBe(segments[2]);
      press(innerButton(segments[2]), 'Home');
      expect(focusedSegment(set)).toBe(segments[0]);
      press(innerButton(segments[0]), 'End');
      expect(focusedSegment(set)).toBe(segments[2]);
    });

    it('moves the tab stop with focus', async () => {
      const {set, segments} = await setupTest();
      segments[0].focus();
      press(innerButton(segments[0]), 'ArrowRight');
      await env.waitForStability();
      expect(focusedSegment(set)).toBe(segments[1]);
      expect(segments.map((s) => innerButton(s).tabIndex)).toEqual([-1, 0, -1]);
    });

    it('does not change selection when moving focus', async () => {
      const {set, segments} = await setupTest();
      segments[0].focus();
      press(innerButton(segments[0]), 'ArrowRight');
      expect(set.selectedIndex).toBe(-1);
    });

    it('skips disabled segments', async () => {
      const {set, segments} = await setupTest(html`<md-gb-segmented-button-set>
        <md-gb-segmented-button>A</md-gb-segmented-button>
        <md-gb-segmented-button disabled>B</md-gb-segmented-button>
        <md-gb-segmented-button>C</md-gb-segmented-button>
      </md-gb-segmented-button-set>`);
      segments[0].focus();
      press(innerButton(segments[0]), 'ArrowRight');
      expect(focusedSegment(set)).toBe(segments[2]);
    });

    it('flips left and right in RTL', async () => {
      const {set, segments} = await setupTest(html`<div dir="rtl">
        ${threeSegments}
      </div>`);
      segments[0].focus();
      press(innerButton(segments[0]), 'ArrowLeft');
      expect(focusedSegment(set)).toBe(segments[1]);
      press(innerButton(segments[1]), 'ArrowRight');
      expect(focusedSegment(set)).toBe(segments[0]);
    });

    it('prevents default for navigation keys only', async () => {
      const {segments} = await setupTest();
      segments[0].focus();
      expect(press(innerButton(segments[0]), 'ArrowRight').defaultPrevented)
        .toBeTrue();
      expect(press(innerButton(segments[1]), 'a').defaultPrevented).toBeFalse();
    });
  });

  describe('single-select', () => {
    it('selects the clicked segment and unselects the others', async () => {
      const {set, segments} = await setupTest();
      innerButton(segments[0]).click();
      innerButton(segments[2]).click();
      await env.waitForStability();
      expect(segments.map((s) => s.selected)).toEqual([false, false, true]);
      expect(set.value).toBe('month');
      expect(set.selectedIndex).toBe(2);
      expect(innerButton(segments[2]).getAttribute('aria-checked')).toBe(
        'true',
      );
    });

    it('unselects the selected segment when clicked again', async () => {
      const {set, segments} = await setupTest();
      innerButton(segments[1]).click();
      innerButton(segments[1]).click();
      expect(set.selectedIndex).toBe(-1);
    });

    it('keeps the selected segment when required', async () => {
      const {set, segments} = await setupTest();
      set.required = true;
      innerButton(segments[1]).click();
      innerButton(segments[1]).click();
      expect(set.selectedIndex).toBe(1);
    });

    it('keeps only the last selected segment initially', async () => {
      const {set} = await setupTest(html`<md-gb-segmented-button-set>
        <md-gb-segmented-button selected value="a">A</md-gb-segmented-button>
        <md-gb-segmented-button selected value="b">B</md-gb-segmented-button>
      </md-gb-segmented-button-set>`);
      expect(set.values).toEqual(['b']);
    });

    it('unselects others when a segment is selected programmatically', async () => {
      const {set, segments} = await setupTest();
      segments[0].selected = true;
      await env.waitForStability();
      segments[1].selected = true;
      await env.waitForStability();
      expect(set.selectedIndices).toEqual([1]);
    });

    it('sets the selection from value', async () => {
      const {set, segments} = await setupTest();
      set.value = 'week';
      expect(segments[1].selected).toBeTrue();
      set.value = '';
      expect(set.selectedIndex).toBe(-1);
    });
  });

  describe('multi-select', () => {
    const multi = html`<md-gb-segmented-button-set multiselect>
      <md-gb-segmented-button value="$">$</md-gb-segmented-button>
      <md-gb-segmented-button value="$$">$$</md-gb-segmented-button>
      <md-gb-segmented-button value="$$$">$$$</md-gb-segmented-button>
    </md-gb-segmented-button-set>`;

    it('toggles segments independently', async () => {
      const {set, segments} = await setupTest(multi);
      innerButton(segments[0]).click();
      innerButton(segments[2]).click();
      expect(set.values).toEqual(['$', '$$$']);
      innerButton(segments[0]).click();
      expect(set.values).toEqual(['$$$']);
      innerButton(segments[2]).click();
      expect(set.values).toEqual([]);
    });

    it('sets the selection from values', async () => {
      const {set} = await setupTest(multi);
      set.values = ['$$', '$$$'];
      expect(set.selectedIndices).toEqual([1, 2]);
    });
  });

  describe('events', () => {
    it('fires input then change on user selection', async () => {
      const {set, segments} = await setupTest();
      const events: string[] = [];
      set.addEventListener('input', (e) => {
        expect(e).toBeInstanceOf(InputEvent);
        expect(e.bubbles).toBeTrue();
        expect(e.composed).toBeTrue();
        expect(set.value).toBe('week');
        events.push('input');
      });
      set.addEventListener('change', (e) => {
        expect(e.bubbles).toBeTrue();
        events.push('change');
      });
      innerButton(segments[1]).click();
      expect(events).toEqual(['input', 'change']);
    });

    it('does not fire for programmatic changes', async () => {
      const {set} = await setupTest();
      const handler = jasmine.createSpy('change');
      set.addEventListener('change', handler);
      set.value = 'day';
      await env.waitForStability();
      expect(handler).not.toHaveBeenCalled();
    });

    it('does not fire when a required selection is clicked', async () => {
      const {set, segments} = await setupTest();
      set.required = true;
      innerButton(segments[0]).click();
      const handler = jasmine.createSpy('change');
      set.addEventListener('change', handler);
      innerButton(segments[0]).click();
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('disabled', () => {
    it('does not select disabled segments', async () => {
      const {set, segments} = await setupTest(html`<md-gb-segmented-button-set>
        <md-gb-segmented-button disabled>A</md-gb-segmented-button>
        <md-gb-segmented-button>B</md-gb-segmented-button>
      </md-gb-segmented-button-set>`);
      const handler = jasmine.createSpy('change');
      set.addEventListener('change', handler);
      segments[0].click();
      expect(segments[0].selected).toBeFalse();
      expect(handler).not.toHaveBeenCalled();
    });

    it('disables every segment when the set is disabled', async () => {
      const {set, segments} = await setupTest();
      set.disabled = true;
      await env.waitForStability();
      expect(set[internals].ariaDisabled).toBe('true');
      for (const segment of segments) {
        expect(innerButton(segment).disabled).toBeTrue();
      }
      set.disabled = false;
      await env.waitForStability();
      expect(innerButton(segments[0]).disabled).toBeFalse();
    });

    it('uses the disabled outline color', async () => {
      const {segments} = await setupTest(html`<md-gb-segmented-button-set>
        <md-gb-segmented-button disabled>A</md-gb-segmented-button>
        <md-gb-segmented-button>B</md-gb-segmented-button>
      </md-gb-segmented-button-set>`);
      const disabled = getComputedStyle(innerButton(segments[0]));
      const enabled = getComputedStyle(innerButton(segments[1]));
      expect(disabled.borderTopColor).not.toBe(enabled.borderTopColor);
    });
  });

  describe('forms', () => {
    async function setupForm(multiselect: boolean) {
      const root = env.render(html`<form>
        <md-gb-segmented-button-set name="size" ?multiselect=${multiselect}>
          <md-gb-segmented-button value="s" selected>S</md-gb-segmented-button>
          <md-gb-segmented-button value="m">M</md-gb-segmented-button>
          <md-gb-segmented-button value="l">L</md-gb-segmented-button>
        </md-gb-segmented-button-set>
      </form>`);
      await env.waitForStability();
      const form = root.querySelector('form')!;
      const set = root.querySelector('md-gb-segmented-button-set')!;
      return {form, set};
    }

    it('submits the selected value in single-select', async () => {
      const {form, set} = await setupForm(false);
      expect(set.form).toBe(form);
      expect(new FormData(form).getAll('size')).toEqual(['s']);
      innerButton(set.segments[2]).click();
      expect(new FormData(form).getAll('size')).toEqual(['l']);
    });

    it('submits every selected value in multi-select', async () => {
      const {form, set} = await setupForm(true);
      innerButton(set.segments[1]).click();
      expect(new FormData(form).getAll('size')).toEqual(['s', 'm']);
    });

    it('submits nothing without a selection', async () => {
      const {form, set} = await setupForm(false);
      innerButton(set.segments[0]).click();
      expect(new FormData(form).has('size')).toBeFalse();
    });

    it('restores the initial selection on reset', async () => {
      const {form, set} = await setupForm(false);
      innerButton(set.segments[1]).click();
      form.reset();
      expect(set.values).toEqual(['s']);
    });
  });
});

describe('segmented button helpers', () => {
  it('nextFocusIndex wraps and skips', () => {
    const all = () => true;
    expect(nextFocusIndex(3, 0, 'ArrowRight', all)).toBe(1);
    expect(nextFocusIndex(3, 2, 'ArrowRight', all)).toBe(0);
    expect(nextFocusIndex(3, 0, 'ArrowLeft', all)).toBe(2);
    expect(nextFocusIndex(3, 0, 'ArrowRight', all, true)).toBe(2);
    expect(nextFocusIndex(3, 0, 'ArrowRight', (i) => i !== 1)).toBe(2);
    expect(nextFocusIndex(3, 1, 'Home', (i) => i !== 0)).toBe(1);
    expect(nextFocusIndex(3, 0, 'End', all)).toBe(2);
    expect(nextFocusIndex(3, 0, 'Tab', all)).toBe(-1);
    expect(nextFocusIndex(0, -1, 'ArrowRight', all)).toBe(-1);
  });

  it('clampDensity clamps and rounds', () => {
    expect(clampDensity(-5)).toBe(-3);
    expect(clampDensity(1)).toBe(0);
    expect(clampDensity(-1.2)).toBe(-1);
    expect(clampDensity(NaN)).toBe(0);
  });

  it('returns set and segment classes', () => {
    expect(segmentedButtonSetClasses({density: -2})).toEqual(
      jasmine.objectContaining({
        'segmented-button-set': true,
        'segmented-button-set-density-2': true,
        'segmented-button-set-density-1': false,
      }),
    );
    expect(segmentedButtonClasses({selected: true, withIcon: true})).toEqual(
      jasmine.objectContaining({
        'segmented-button': true,
        'segmented-button-selected': true,
        'segmented-button-with-icon': true,
        'segmented-button-with-label': true,
        'segmented-button-with-checkmark': true,
      }),
    );
  });

  describe('Light DOM', () => {
    const env = new Environment();

    it('styles and navigates a .segmented-button-set', async () => {
      const root = env.render(html`<div class="segmented-button-set">
        <button class="segmented-button segmented-button-with-label">A</button>
        <button class="segmented-button segmented-button-with-label" disabled>
          B
        </button>
        <button class="segmented-button segmented-button-with-label">C</button>
      </div>`);
      await env.waitForStability();
      const set = root.querySelector<HTMLElement>('.segmented-button-set')!;
      const buttons = Array.from(set.querySelectorAll('button'));
      setupSegmentedButtonSet(set);
      expect(buttons.map((b) => b.tabIndex)).toEqual([0, -1, -1]);
      expect(buttons[0].getBoundingClientRect().height).toBe(40);
      expect(getComputedStyle(buttons[1]).marginInlineEnd).toBe('-1px');
      buttons[0].focus();
      buttons[0].dispatchEvent(
        new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true}),
      );
      expect(document.activeElement).toBe(buttons[2]);
      expect(buttons.map((b) => b.tabIndex)).toEqual([-1, -1, 0]);
    });
  });
});
