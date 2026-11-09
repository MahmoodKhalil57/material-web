/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { densityClasses, densityClassNames } from '../shared/density.js';
import { createClassMapDirective } from '../shared/directives.js';
import { PSEUDO_CLASSES } from '../shared/pseudo-classes.js';
import { nextSelection, normalizeSelection as normalizeSelectionState, } from '../shared/selection.js';
/** Button group variant layout configurations. */
export const BUTTON_GROUP_VARIANTS = {
    standard: 'standard',
    connected: 'connected',
};
/** Button group selection configurations. */
export const BUTTON_GROUP_SELECTIONS = {
    none: 'none',
    single: 'single',
    multiple: 'multiple',
};
/** Button group classes. */
export const BUTTON_GROUP_CLASSES = {
    btnGroup: 'btn-group',
    btnGroupStandard: 'btn-group-standard',
    btnGroupConnected: 'btn-group-connected',
    disabled: PSEUDO_CLASSES.disabled,
    ...densityClassNames('btn-group'),
};
/**
 * Returns the button group classes to apply to an element based on the given state.
 *
 * @param state The state of the button group.
 * @return An object of class names and truthy values if they apply.
 */
export function buttonGroupClasses({ variant = 'standard', disabled = false, density = 0, } = {}) {
    return {
        [BUTTON_GROUP_CLASSES.btnGroup]: true,
        [BUTTON_GROUP_CLASSES.btnGroupStandard]: variant === 'standard' || !variant,
        [BUTTON_GROUP_CLASSES.btnGroupConnected]: variant === 'connected',
        [BUTTON_GROUP_CLASSES.disabled]: disabled,
        ...densityClasses(BUTTON_GROUP_CLASSES.btnGroup, density),
    };
}
/**
 * A Lit directive that applies button group classes.
 */
export const buttonGroup = createClassMapDirective({
    getClasses: buttonGroupClasses,
});
/**
 * Checks if a ButtonGroupItem is selectable.
 * Disabled, soft-disabled, or link items are not selectable.
 */
export function isItemSelectable(item) {
    return !item.disabled && !item.softDisabled && !item.href;
}
/**
 * Selection normalization of button group items: the shared
 * `normalizeSelection()` rules (none: nothing selected; single: at most one,
 * the preferred or last selected; required: the first selectable item when
 * none is selected; multiple: unchanged), applied to `item.selected` in
 * place.
 */
export function normalizeSelection(items, options) {
    const { selection = 'none', required = false, preferred } = options;
    const after = normalizeSelectionState(items.map((item) => Boolean(item.selected)), { mode: selection, required }, {
        preferred: preferred ? items.indexOf(preferred) : undefined,
        selectable: items.map(isItemSelectable),
    });
    items.forEach((item, i) => {
        if (Boolean(item.selected) !== after[i])
            item.selected = after[i];
    });
}
/**
 * Whether a toggle interaction on item `i` should be blocked: in required
 * single-select mode, clicking the selected button must not unselect it, so
 * exactly one item stays selected.
 */
export function shouldBlockToggle(items, i, options) {
    const { selection = 'none', required = false } = options;
    if (selection !== 'single')
        return false;
    const selected = items.map((item) => Boolean(item.selected));
    return nextSelection(selected, i, { mode: selection, required })[i] === selected[i];
}
//# sourceMappingURL=button-group.js.map