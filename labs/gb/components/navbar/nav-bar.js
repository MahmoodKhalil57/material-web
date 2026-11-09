/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { FOCUS_RING_CLASSES } from '../focus/focus-ring.js';
import { RIPPLE_CLASSES, setupRipple } from '../ripple/ripple.js';
import { createClassMapDirective } from '../shared/directives.js';
/** The smallest medium window width (M3 window size classes). */
export const MEDIUM_WINDOW_QUERY = '(min-width: 600px)';
/** Navigation bar item layout configurations. */
export const NAV_BAR_ITEM_LAYOUTS = {
    vertical: 'vertical',
    horizontal: 'horizontal',
};
/** Navigation bar classes constants. */
export const NAV_BAR_CLASSES = {
    navBar: 'nav-bar',
    navBarVertical: 'nav-bar-vertical',
    navBarHorizontal: 'nav-bar-horizontal',
};
/**
 * Returns navigation bar classes to apply based on the given state.
 *
 * @param state The state of the navigation bar.
 * @return An object of class names and truthy values if they apply.
 */
export function navBarClasses({ itemLayout = NAV_BAR_ITEM_LAYOUTS.vertical, } = {}) {
    return {
        [NAV_BAR_CLASSES.navBar]: true,
        [NAV_BAR_CLASSES.navBarVertical]: itemLayout === NAV_BAR_ITEM_LAYOUTS.vertical || !itemLayout,
        [NAV_BAR_CLASSES.navBarHorizontal]: itemLayout === NAV_BAR_ITEM_LAYOUTS.horizontal,
    };
}
/**
 * Lit directive for navigation bar element class styling.
 *
 * @example
 * ```ts
 * html`<nav class="${navBar({itemLayout: 'vertical'})}">
 *   <button class="${navBarItem({active: true})}">Home</button>
 * </nav>`;
 * ```
 */
export const navBar = createClassMapDirective({
    getClasses: navBarClasses,
});
/** Navigation bar item classes constants. */
export const NAV_BAR_ITEM_CLASSES = {
    navBarItem: 'nav-bar-item',
    navBarItemActive: 'nav-bar-item-active',
    navBarItemVertical: 'nav-bar-item-vertical',
    navBarItemHorizontal: 'nav-bar-item-horizontal',
    navBarItemContent: 'nav-bar-item-content',
    navBarItemIconContainer: 'nav-bar-item-icon-container',
    navBarItemIcon: 'nav-bar-item-icon',
    navBarItemLabel: 'nav-bar-item-label',
    navBarItemBadge: 'nav-bar-item-badge',
    navBarItemBadgeDot: 'nav-bar-item-badge-dot',
};
/**
 * Returns navigation bar item classes to apply based on the given state.
 *
 * @param state The state of the navigation bar item.
 * @return An object of class names and truthy values if they apply.
 */
export function navBarItemClasses({ active = false, selected = false, disabled = false, itemLayout = NAV_BAR_ITEM_LAYOUTS.vertical, } = {}) {
    return {
        [RIPPLE_CLASSES.ripple]: true,
        [RIPPLE_CLASSES.disabled]: Boolean(disabled),
        [FOCUS_RING_CLASSES.focusRingInner]: true,
        [NAV_BAR_ITEM_CLASSES.navBarItem]: true,
        [NAV_BAR_ITEM_CLASSES.navBarItemActive]: Boolean(active || selected),
        [NAV_BAR_ITEM_CLASSES.navBarItemVertical]: itemLayout === NAV_BAR_ITEM_LAYOUTS.vertical || !itemLayout,
        [NAV_BAR_ITEM_CLASSES.navBarItemHorizontal]: itemLayout === NAV_BAR_ITEM_LAYOUTS.horizontal,
    };
}
/**
 * Sets up navigation bar item functionality for the given element.
 *
 * @param item The element on which to set up navigation bar item functionality.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export function setupNavBarItem(item, opts) {
    setupRipple(item, opts);
}
/**
 * Lit directive for navigation bar item element class styling.
 */
export const navBarItem = createClassMapDirective({
    getClasses: navBarItemClasses,
    setupElement: setupNavBarItem,
});
//# sourceMappingURL=nav-bar.js.map