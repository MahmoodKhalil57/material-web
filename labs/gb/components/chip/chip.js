/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { afterDispatch, setupDispatchHooks, } from '../../../../internal/events/dispatch-hooks.js';
import { focusRingClasses } from '../focus/focus-ring.js';
import { rippleClasses, setupRipple } from '../ripple/ripple.js';
import { densityClasses, densityClassNames } from '../shared/density.js';
import { createClassMapDirective } from '../shared/directives.js';
import { isDisabled, PSEUDO_CLASSES } from '../shared/pseudo-classes.js';
/** Chip styles. */
export const CHIP_COLORS = {
    flat: 'flat',
    elevated: 'elevated',
};
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
};
/** Chip set classes (`.chip-set` on any container). */
export const CHIP_SET_CLASSES = {
    chipSet: 'chip-set',
    singleLine: 'chip-set-single-line',
    ...densityClassNames('chip-set'),
};
/** Maps legacy gb chip types to the spec chip types. */
export function specChipType(type = 'assist') {
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
/**
 * Returns the chip classes to apply to an element based on the given state.
 *
 * @param state The state of the chip.
 * @return An object of class names and truthy values if they apply.
 */
export function chipClasses({ type = 'assist', elevated = false, color, selected = false, removable = false, withLeadingIcon = false, withTrailingIcon = false, withAvatar = false, dragged = false, disabled = false, density = 0, } = {}) {
    const specType = specChipType(type);
    const isElevated = (elevated || color === CHIP_COLORS.elevated) && specType !== 'input';
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
export function setupChip(chip, opts) {
    setupDispatchHooks(chip, 'click');
    setupRipple(chip, opts);
    chip.addEventListener('click', (event) => {
        if (isDisabled(chip)) {
            event.stopImmediatePropagation();
            event.preventDefault();
            return;
        }
        // The remove button of a removable chip is a separate action.
        const path = event.composedPath();
        if (path.some((el) => el instanceof Element && el.classList.contains(CHIP_CLASSES.remove))) {
            return;
        }
        afterDispatch(event, () => {
            // A removable chip toggles its primary action button.
            const target = chip.querySelector(`:scope > .${CHIP_CLASSES.action}`) ??
                chip;
            // Only filter chips toggle (spec: filter chips are selected with a
            // checkmark; the other types perform actions).
            const isToggle = target.hasAttribute('aria-pressed') ||
                chip.matches(`.${CHIP_CLASSES.chipFilter}`);
            if (event.defaultPrevented || !isToggle) {
                return;
            }
            const isPressed = target.ariaPressed === 'true';
            target.ariaPressed = String(!isPressed);
            chip.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
            chip.dispatchEvent(new Event('change', { bubbles: true }));
        });
    }, { ...opts, capture: true });
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
//# sourceMappingURL=chip.js.map