/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {adoptStyles} from '../../styles/adopt-styles.js';

import {CHIP_CLASSES, chipClasses, specChipType} from './chip.js';
import {ChipElement} from './chip-element.js';
import './md-gb-chip.js';

adoptStyles(document, [m3Styles]);

describe('chipClasses()', () => {
  it('defaults to a flat assist chip', () => {
    const classes = chipClasses();
    expect(classes[CHIP_CLASSES.chip]).toBeTrue();
    expect(classes[CHIP_CLASSES.chipAssist]).toBeTrue();
    expect(classes[CHIP_CLASSES.chipElevated]).toBeFalse();
  });

  it('adds one class per spec chip type', () => {
    for (const type of ['assist', 'filter', 'input', 'suggestion'] as const) {
      const classes = chipClasses({type});
      expect(classes[`chip-${type}`]).withContext(type).toBeTrue();
    }
  });

  it('maps the legacy types to spec types', () => {
    expect(specChipType('action')).toBe('assist');
    expect(specChipType('link')).toBe('assist');
    expect(specChipType('toggle')).toBe('filter');
    expect(chipClasses({type: 'toggle'})[CHIP_CLASSES.chipFilter]).toBeTrue();
  });

  it('adds the elevated class (also for the legacy color)', () => {
    expect(chipClasses({elevated: true})[CHIP_CLASSES.chipElevated]).toBeTrue();
    expect(
      chipClasses({color: 'elevated'})[CHIP_CLASSES.chipElevated],
    ).toBeTrue();
  });

  it('never elevates input chips (no elevated input chip in the spec)', () => {
    expect(
      chipClasses({type: 'input', elevated: true})[CHIP_CLASSES.chipElevated],
    ).toBeFalse();
  });

  it('adds the trailing icon class to removable chips', () => {
    expect(
      chipClasses({removable: true})[CHIP_CLASSES.chipWithTrailingIcon],
    ).toBeTrue();
  });

  it('uses the avatar class instead of the leading icon class', () => {
    const classes = chipClasses({withLeadingIcon: true, withAvatar: true});
    expect(classes[CHIP_CLASSES.chipWithAvatar]).toBeTrue();
    expect(classes[CHIP_CLASSES.chipWithLeadingIcon]).toBeFalse();
  });
});

describe('<md-gb-chip>', () => {
  const env = new Environment();

  async function setup(template: ReturnType<typeof html>) {
    const root = env.render(template);
    const el = root.querySelector('md-gb-chip') as ChipElement;
    await el.updateComplete;
    // Let slotchange listeners update.
    await new Promise((resolve) => {
      queueMicrotask(() => resolve(undefined));
    });
    await el.updateComplete;
    const chipEl = el.shadowRoot!.querySelector<HTMLElement>('.chip')!;
    return {el, chipEl};
  }

  function cssVar(el: Element, name: string) {
    return getComputedStyle(el).getPropertyValue(name).trim();
  }

  function color(value: string) {
    const probe = document.createElement('div');
    probe.style.color = value;
    document.body.append(probe);
    const result = getComputedStyle(probe).color;
    probe.remove();
    return result;
  }

  it('renders an assist chip as a button', async () => {
    const {chipEl} = await setup(html`<md-gb-chip>Assist</md-gb-chip>`);
    expect(chipEl.localName).toBe('button');
    expect(chipEl.classList).toContain(CHIP_CLASSES.chipAssist);
    expect(chipEl.hasAttribute('aria-pressed')).toBeFalse();
  });

  it('renders a link chip when href is set', async () => {
    const {chipEl} = await setup(
      html`<md-gb-chip href="https://example.com">Link</md-gb-chip>`,
    );
    expect(chipEl.localName).toBe('a');
    expect(chipEl.getAttribute('href')).toBe('https://example.com');
  });

  it('is 32px tall with a 48px touch target', async () => {
    const {chipEl} = await setup(html`<md-gb-chip>Assist</md-gb-chip>`);
    expect(chipEl.getBoundingClientRect().height).toBe(32);
    // The target is offset from the padding box (inside the 1px outline).
    const before = getComputedStyle(chipEl, '::before');
    expect(before.height).toBe('48px');
    expect(before.top).toBe('-9px');
    expect(before.bottom).toBe('-9px');
  });

  it('uses 16px padding, or 8px beside an icon', async () => {
    const {chipEl} = await setup(html`<md-gb-chip>Assist</md-gb-chip>`);
    expect(getComputedStyle(chipEl).paddingInlineStart).toBe('16px');
    expect(getComputedStyle(chipEl).paddingInlineEnd).toBe('16px');

    const withIcon = await setup(
      html`<md-gb-chip><span slot="icon">x</span>Assist</md-gb-chip>`,
    );
    expect(withIcon.chipEl.classList).toContain(
      CHIP_CLASSES.chipWithLeadingIcon,
    );
    expect(getComputedStyle(withIcon.chipEl).paddingInlineStart).toBe('8px');
  });

  it('is flat (outlined) by default and elevated with `elevated`', async () => {
    const flat = await setup(html`<md-gb-chip>Flat</md-gb-chip>`);
    expect(getComputedStyle(flat.chipEl).borderTopWidth).toBe('1px');
    expect(getComputedStyle(flat.chipEl).boxShadow).toBe('none');

    const elevated = await setup(html`<md-gb-chip elevated>Up</md-gb-chip>`);
    expect(getComputedStyle(elevated.chipEl).borderTopWidth).toBe('0px');
    expect(getComputedStyle(elevated.chipEl).backgroundColor).toBe(
      color('var(--md-sys-color-surface-container-low)'),
    );
  });

  it('uses the assist chip leading icon color (primary)', async () => {
    const {chipEl} = await setup(
      html`<md-gb-chip><span slot="icon">x</span>Assist</md-gb-chip>`,
    );
    expect(cssVar(chipEl, '--md-icon-color')).toBe(
      color('var(--md-sys-color-primary)'),
    );
  });

  describe('filter chips', () => {
    it('toggle selection on click and fire input and change', async () => {
      const {el, chipEl} = await setup(
        html`<md-gb-chip type="filter">Filter</md-gb-chip>`,
      );
      const change = jasmine.createSpy('change');
      const input = jasmine.createSpy('input');
      el.addEventListener('change', change);
      el.addEventListener('input', input);
      expect(chipEl.getAttribute('aria-pressed')).toBe('false');

      chipEl.click();
      await el.updateComplete;

      expect(el.selected).toBeTrue();
      expect(chipEl.getAttribute('aria-pressed')).toBe('true');
      expect(change).toHaveBeenCalledTimes(1);
      expect(input).toHaveBeenCalledTimes(1);
    });

    it('show a checkmark and the selected container when selected', async () => {
      const {chipEl} = await setup(
        html`<md-gb-chip type="filter" selected>Filter</md-gb-chip>`,
      );
      expect(chipEl.querySelector('.chip-checkmark')).not.toBeNull();
      expect(chipEl.classList).toContain(CHIP_CLASSES.chipWithLeadingIcon);
      expect(getComputedStyle(chipEl).backgroundColor).toBe(
        color('var(--md-sys-color-secondary-container)'),
      );
      expect(getComputedStyle(chipEl).borderTopWidth).toBe('0px');
    });

    it('do not toggle when disabled', async () => {
      const {el, chipEl} = await setup(
        html`<md-gb-chip type="filter" soft-disabled>Filter</md-gb-chip>`,
      );
      chipEl.click();
      await el.updateComplete;
      expect(el.selected).toBeFalse();
    });
  });

  it('does not toggle assist chips', async () => {
    const {el, chipEl} = await setup(html`<md-gb-chip>Assist</md-gb-chip>`);
    chipEl.click();
    await el.updateComplete;
    expect(el.selected).toBeFalse();
    expect(chipEl.hasAttribute('aria-pressed')).toBeFalse();
  });

  describe('input chips', () => {
    it('have a separately focusable, labeled remove button', async () => {
      const {chipEl} = await setup(
        html`<md-gb-chip type="input" removable>Hiking</md-gb-chip>`,
      );
      const action = chipEl.querySelector<HTMLButtonElement>('.chip-action')!;
      const remove = chipEl.querySelector<HTMLButtonElement>('.chip-remove')!;
      expect(action.localName).toBe('button');
      expect(remove.localName).toBe('button');
      expect(remove.getAttribute('aria-label')).toBe('Remove Hiking');
    });

    it('fire remove from the remove button', async () => {
      const {el, chipEl} = await setup(
        html`<md-gb-chip type="input" removable>Hiking</md-gb-chip>`,
      );
      const remove = jasmine.createSpy('remove');
      el.addEventListener('remove', remove);
      chipEl.querySelector<HTMLButtonElement>('.chip-remove')!.click();
      expect(remove).toHaveBeenCalledTimes(1);
    });

    it('fire remove on Backspace and Delete', async () => {
      const {el, chipEl} = await setup(
        html`<md-gb-chip type="input" removable>Hiking</md-gb-chip>`,
      );
      const remove = jasmine.createSpy('remove');
      el.addEventListener('remove', remove);
      const action = chipEl.querySelector<HTMLButtonElement>('.chip-action')!;
      for (const key of ['Backspace', 'Delete']) {
        action.dispatchEvent(
          new KeyboardEvent('keydown', {key, bubbles: true, composed: true}),
        );
      }
      expect(remove).toHaveBeenCalledTimes(2);
    });

    it('do not fire remove when disabled', async () => {
      const {el, chipEl} = await setup(
        html`<md-gb-chip type="input" removable soft-disabled>A</md-gb-chip>`,
      );
      const remove = jasmine.createSpy('remove');
      el.addEventListener('remove', remove);
      chipEl.querySelector<HTMLButtonElement>('.chip-remove')!.click();
      expect(remove).not.toHaveBeenCalled();
    });

    it('use the avatar padding and size', async () => {
      const {chipEl} = await setup(html`
        <md-gb-chip type="input">
          <span slot="icon" class="chip-avatar"></span>
          Avatar
        </md-gb-chip>
      `);
      expect(chipEl.classList).toContain(CHIP_CLASSES.chipWithAvatar);
      expect(getComputedStyle(chipEl).paddingInlineStart).toBe('4px');
      const avatar = chipEl.ownerDocument.querySelector('.chip-avatar')!;
      expect(getComputedStyle(avatar).width).toBe('24px');
    });

    it('use 12px padding without icons', async () => {
      const {chipEl} = await setup(
        html`<md-gb-chip type="input">Input</md-gb-chip>`,
      );
      expect(getComputedStyle(chipEl).paddingInlineStart).toBe('12px');
      expect(getComputedStyle(chipEl).paddingInlineEnd).toBe('12px');
    });
  });

  it('hides icons from assistive technology', async () => {
    const {chipEl} = await setup(
      html`<md-gb-chip><span slot="icon">x</span>Assist</md-gb-chip>`,
    );
    expect(chipEl.querySelector('.chip-icon')!.getAttribute('aria-hidden')).toBe(
      'true',
    );
  });

  it('uses the dragged elevation', async () => {
    const {chipEl} = await setup(html`<md-gb-chip dragged>Drag</md-gb-chip>`);
    expect(chipEl.classList).toContain(CHIP_CLASSES.dragged);
    const probe = document.createElement('div');
    probe.style.boxShadow = 'var(--md-sys-elevation-shadow-4)';
    document.body.append(probe);
    const want = getComputedStyle(probe).boxShadow;
    probe.remove();
    expect(getComputedStyle(chipEl).boxShadow).toBe(want);
  });

  it('uses the disabled label opacity', async () => {
    const {chipEl} = await setup(html`<md-gb-chip disabled>Off</md-gb-chip>`);
    expect(getComputedStyle(chipEl).color).toBe(
      color('hsl(from var(--md-sys-color-on-surface) h s l / 38%)'),
    );
  });
});
