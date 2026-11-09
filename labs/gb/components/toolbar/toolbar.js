/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { createClassMapDirective } from '../shared/directives.js';
/** Toolbar color configurations. */
export const TOOLBAR_COLORS = {
    standard: 'standard',
    vibrant: 'vibrant',
};
/** Toolbar orientation configurations. */
export const TOOLBAR_ORIENTATIONS = {
    horizontal: 'horizontal',
    vertical: 'vertical',
};
/** Toolbar classes constants. */
export const TOOLBAR_CLASSES = {
    toolbar: 'toolbar',
    toolbarStandard: 'toolbar-standard',
    toolbarVibrant: 'toolbar-vibrant',
    toolbarHorizontal: 'toolbar-horizontal',
    toolbarVertical: 'toolbar-vertical',
    toolbarDocked: 'toolbar-docked',
};
/**
 * Returns toolbar classes to apply based on the given state.
 *
 * @param state The state of the toolbar.
 * @return An object of class names and truthy values if they apply.
 */
export function toolbarClasses({ color = TOOLBAR_COLORS.standard, orientation = TOOLBAR_ORIENTATIONS.horizontal, docked = false, } = {}) {
    const isDocked = Boolean(docked);
    const effectiveOrientation = isDocked
        ? TOOLBAR_ORIENTATIONS.horizontal
        : orientation;
    return {
        [TOOLBAR_CLASSES.toolbar]: true,
        [TOOLBAR_CLASSES.toolbarStandard]: color === TOOLBAR_COLORS.standard || !color,
        [TOOLBAR_CLASSES.toolbarVibrant]: color === TOOLBAR_COLORS.vibrant,
        [TOOLBAR_CLASSES.toolbarHorizontal]: effectiveOrientation === TOOLBAR_ORIENTATIONS.horizontal ||
            !effectiveOrientation,
        [TOOLBAR_CLASSES.toolbarVertical]: effectiveOrientation === TOOLBAR_ORIENTATIONS.vertical,
        [TOOLBAR_CLASSES.toolbarDocked]: isDocked,
    };
}
/**
 * Lit directive for element class styling.
 *
 * @example
 * ```ts
 * html`<div class="${toolbar({color: 'vibrant'})}">
 *   <button class="icon-btn"><md-gb-icon>undo</md-gb-icon></button>
 * </div>`;
 * ```
 */
export const toolbar = createClassMapDirective({
    getClasses: toolbarClasses,
});
//# sourceMappingURL=toolbar.js.map