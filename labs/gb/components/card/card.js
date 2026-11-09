/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { FOCUS_RING_CLASSES } from '../focus/focus-ring.js';
import { createClassMapDirective } from '../shared/directives.js';
import { PSEUDO_CLASSES } from '../shared/pseudo-classes.js';
/** Card color configurations. */
export const CARD_COLORS = {
    elevated: 'elevated',
    filled: 'filled',
    outlined: 'outlined',
};
/** Card classes. */
export const CARD_CLASSES = {
    card: 'card',
    cardElevated: 'card-elevated',
    cardFilled: 'card-filled',
    cardOutlined: 'card-outlined',
    hover: PSEUDO_CLASSES.hover,
    focus: PSEUDO_CLASSES.focus,
    active: PSEUDO_CLASSES.active,
    dragged: 'dragged',
    selected: 'card-selected',
    disabled: PSEUDO_CLASSES.disabled,
};
/**
 * Returns the card classes to apply to an element based on the given state.
 *
 * @param state The state of the card.
 * @return An object of class names and truthy values if they apply.
 */
export function cardClasses({ color, interactive = false, hover = false, focus = false, active = false, dragged = false, disabled = false, selected = false, } = {}) {
    return {
        [FOCUS_RING_CLASSES.focusRingOuter]: interactive,
        [CARD_CLASSES.card]: true,
        [CARD_CLASSES.cardElevated]: color === CARD_COLORS.elevated,
        [CARD_CLASSES.cardFilled]: color === CARD_COLORS.filled,
        [CARD_CLASSES.cardOutlined]: color === CARD_COLORS.outlined || !color,
        [CARD_CLASSES.hover]: hover,
        [CARD_CLASSES.focus]: focus,
        [CARD_CLASSES.active]: active,
        [CARD_CLASSES.dragged]: dragged,
        [CARD_CLASSES.disabled]: disabled,
        [CARD_CLASSES.selected]: selected,
    };
}
/**
 * A Lit directive that adds card styling and functionality to its element.
 *
 * @example
 * ```ts
 * html`
 *   <div class="${card({color: 'filled'})} flex flex-row p-4">
 *     Card content
 *   </div>
 * `
 * ```
 */
export const card = createClassMapDirective({
    getClasses: cardClasses,
});
//# sourceMappingURL=card.js.map