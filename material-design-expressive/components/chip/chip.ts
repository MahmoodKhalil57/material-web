/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {
  afterDispatch,
  setupDispatchHooks,
} from '../../internal/events/dispatch-hooks.js';
import {focusRingClasses} from '../../foundations/interaction/states/focus/focus-ring.js';
import {rippleClasses, setupRipple} from '../../foundations/interaction/states/ripple/ripple.js';
import {densityClasses, densityClassNames} from '../../foundations/layout/density.js';
import {createClassMapDirective} from '../shared/directives.js';
import {isDisabled, PSEUDO_CLASSES} from '../../foundations/interaction/states/pseudo-classes.js';

/**
 * The chip types of the M3 spec: assist, filter, input and suggestion.
 *
 * `action` (= `assist`), `toggle` (= `filter`) and `link` (an assist chip
 * rendered as a link) are kept as aliases of earlier gb types.
 */
export type ChipType =
  | 'assist'
  | 'filter'
  | 'input'
  | 'suggestion'
  | 'action'
  | 'toggle'
  | 'link';

/** The spec chip type for a (possibly legacy) chip type. */
export type SpecChipType = 'assist' | 'filter' | 'input' | 'suggestion';

/**
 * Chip container style: flat (outlined, the default) or elevated.
 *
 * `outlined` is an alias of `flat`. `filled` and `tonal` are not spec styles
 * and render as `flat`.
 */
export type ChipColor = 'flat' | 'elevated' | 'outlined' | 'filled' | 'tonal';

/** Chip styles. */
export const CHIP_COLORS = {
  flat: 'flat',
  elevated: 'elevated',
} as const;

/** Chip classes. */
export const CHIP_CLASSES = {
  chip: 'chip',
  chipAssist: 'chip-assist',
  chipFilter: 'chip-filter',
  chipInput: 'chip-input',
  chipSuggestion: 'chip-suggestion',
  chipElevated: 'chip-elevated',
  chipSelected: 'chip-selected',
  chipRemovable: 'chip-removable',
  chipWithLeadingIcon: 'chip-with-leading-icon',
  chipWithTrailingIcon: 'chip-with-trailing-icon',
  chipWithAvatar: 'chip-with-avatar',
  dragged: 'dragged',
  disabled: PSEUDO_CLASSES.disabled,
  /** The primary action button of a removable chip. */
  action: 'chip-action',
  /** The remove button of a removable chip. */
  remove: 'chip-remove',
  ...densityClassNames('chip'),
} as const;

/** Chip set classes (`.chip-set` on any container). */
export const CHIP_SET_CLASSES = {
  chipSet: 'chip-set',
  singleLine: 'chip-set-single-line',
  ...densityClassNames('chip-set'),
} as const;

/** Maps legacy gb chip types to the spec chip types. */
export function specChipType(type: ChipType = 'assist'): SpecChipType {
  switch (type) {
    case 'action':
    case 'link':
      return 'assist';
    case 'toggle':
      return 'filter';
    default:
      return type;
  }
}

/** The state provided to the `chipClasses()` function. */
export interface ChipClassesState {
  /** The chip type (`assist`, `filter`, `input`, `suggestion`). */
  type?: ChipType;
  /**
   * Elevated container (spec: on images or complex backgrounds). Input chips
   * have no elevated style.
   */
  elevated?: boolean;
  /** @deprecated Use `elevated`. `'elevated'` sets `elevated`. */
  color?: ChipColor;
  /** Whether the filter or input chip is selected. */
  selected?: boolean;
  /** Whether the chip has a trailing remove button. */
  removable?: boolean;
  /** Whether the chip has a leading icon. */
  withLeadingIcon?: boolean;
  /** Whether the chip has a trailing icon (or remove button). */
  withTrailingIcon?: boolean;
  /** Whether the chip has a leading avatar (input chips). */
  withAvatar?: boolean;
  /** Emulates the dragged state. */
  dragged?: boolean;
  /** Emulates `:disabled`. */
  disabled?: boolean;
  /**
   * The density, 0 (default) to -3. Density 0 inherits the density of an
   * enclosing chip set.
   */
  density?: number;
}

/**
 * Returns the chip classes to apply to an element based on the given state.
 *
 * @param state The state of the chip.
 * @return An object of class names and truthy values if they apply.
 */
export function chipClasses({
  type = 'assist',
  elevated = false,
  color,
  selected = false,
  removable = false,
  withLeadingIcon = false,
  withTrailingIcon = false,
  withAvatar = false,
  dragged = false,
  disabled = false,
  density = 0,
}: ChipClassesState = {}): ClassInfo {
  const specType = specChipType(type);
  const isElevated =
    (elevated || color === CHIP_COLORS.elevated) && specType !== 'input';
  return {
    ...rippleClasses(),
    ...focusRingClasses(),
    [CHIP_CLASSES.chip]: true,
    [CHIP_CLASSES.chipAssist]: specType === 'assist',
    [CHIP_CLASSES.chipFilter]: specType === 'filter',
    [CHIP_CLASSES.chipInput]: specType === 'input',
    [CHIP_CLASSES.chipSuggestion]: specType === 'suggestion',
    [CHIP_CLASSES.chipElevated]: isElevated,
    [CHIP_CLASSES.chipSelected]: selected,
    [CHIP_CLASSES.chipRemovable]: removable,
    [CHIP_CLASSES.chipWithLeadingIcon]: withLeadingIcon && !withAvatar,
    [CHIP_CLASSES.chipWithTrailingIcon]: withTrailingIcon || removable,
    [CHIP_CLASSES.chipWithAvatar]: withAvatar,
    [CHIP_CLASSES.dragged]: dragged,
    [CHIP_CLASSES.disabled]: disabled,
    ...densityClasses(CHIP_CLASSES.chip, density),
  };
}

/**
 * Sets up chip functionality for the given element.
 *
 * @param chip The element on which to set up chip functionality.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export function setupChip(
  chip: HTMLElement,
  opts?: {signal?: AbortSignal},
): void {
  setupDispatchHooks(chip, 'click');
  setupRipple(chip, opts);
  chip.addEventListener(
    'click',
    (event) => {
      if (isDisabled(chip)) {
        event.stopImmediatePropagation();
        event.preventDefault();
        return;
      }
      // The remove button of a removable chip is a separate action.
      const path = event.composedPath();
      if (
        path.some(
          (el) =>
            el instanceof Element && el.classList.contains(CHIP_CLASSES.remove),
        )
      ) {
        return;
      }

      afterDispatch(event, () => {
        // A removable chip toggles its primary action button.
        const target =
          chip.querySelector<HTMLElement>(`:scope > .${CHIP_CLASSES.action}`) ??
          chip;
        // Only filter chips toggle (spec: filter chips are selected with a
        // checkmark; the other types perform actions).
        const isToggle =
          target.hasAttribute('aria-pressed') ||
          chip.matches(`.${CHIP_CLASSES.chipFilter}`);
        if (event.defaultPrevented || !isToggle) {
          return;
        }

        const isPressed = target.ariaPressed === 'true';
        target.ariaPressed = String(!isPressed);
        chip.dispatchEvent(
          new InputEvent('input', {bubbles: true, composed: true}),
        );
        chip.dispatchEvent(new Event('change', {bubbles: true}));
      });
    },
    {...opts, capture: true},
  );
}

/**
 * A Lit directive that adds chip styling and functionality to its element.
 *
 * @example
 * ```ts
 * html`<button class="${chip({type: 'assist', elevated: true})}">Assist</button>`;
 * html`<button class="${chip({type: 'filter'})}" aria-pressed="false">Filter</button>`;
 * ```
 */
export const chip = createClassMapDirective({
  getClasses: chipClasses,
  setupElement: setupChip,
});
