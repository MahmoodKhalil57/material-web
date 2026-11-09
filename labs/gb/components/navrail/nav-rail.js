/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { FOCUS_RING_CLASSES } from '../focus/focus-ring.js';
import { RIPPLE_CLASSES, setupRipple } from '../ripple/ripple.js';
import { createClassMapDirective } from '../shared/directives.js';
/** Navigation rail vertical alignment configurations. */
export const NAV_RAIL_ALIGNMENTS = {
    top: 'top',
    center: 'center',
    bottom: 'bottom',
};
/** Navigation rail item layout configurations. */
export const NAV_RAIL_ITEM_LAYOUTS = {
    vertical: 'vertical',
    horizontal: 'horizontal',
};
/** Navigation rail classes constants. */
export const NAV_RAIL_CLASSES = {
    navRail: 'nav-rail',
    navRailExpanded: 'nav-rail-expanded',
    navRailModal: 'nav-rail-modal',
    navRailNarrow: 'nav-rail-narrow',
    navRailDragging: 'nav-rail-dragging',
    navRailAlignTop: 'nav-rail-align-top',
    navRailAlignCenter: 'nav-rail-align-center',
    navRailAlignBottom: 'nav-rail-align-bottom',
    navRailVertical: 'nav-rail-vertical',
    navRailHorizontal: 'nav-rail-horizontal',
    navRailHeader: 'nav-rail-header',
    navRailMenuButton: 'nav-rail-menu-button',
    navRailItems: 'nav-rail-items',
};
/**
 * Returns navigation rail classes to apply based on the given state.
 *
 * @param state The state of the navigation rail.
 * @return An object of class names and truthy values if they apply.
 */
export function navRailClasses({ alignment = NAV_RAIL_ALIGNMENTS.top, expanded = false, itemLayout = NAV_RAIL_ITEM_LAYOUTS.vertical, modal = false, narrow = false, dragging = false, } = {}) {
    const effectiveLayout = expanded
        ? NAV_RAIL_ITEM_LAYOUTS.horizontal
        : itemLayout;
    return {
        [NAV_RAIL_CLASSES.navRail]: true,
        [NAV_RAIL_CLASSES.navRailExpanded]: Boolean(expanded),
        [NAV_RAIL_CLASSES.navRailModal]: Boolean(modal),
        [NAV_RAIL_CLASSES.navRailNarrow]: Boolean(narrow),
        [NAV_RAIL_CLASSES.navRailDragging]: Boolean(dragging),
        [NAV_RAIL_CLASSES.navRailAlignTop]: alignment === NAV_RAIL_ALIGNMENTS.top || !alignment,
        [NAV_RAIL_CLASSES.navRailAlignCenter]: alignment === NAV_RAIL_ALIGNMENTS.center,
        [NAV_RAIL_CLASSES.navRailAlignBottom]: alignment === NAV_RAIL_ALIGNMENTS.bottom,
        [NAV_RAIL_CLASSES.navRailVertical]: effectiveLayout === NAV_RAIL_ITEM_LAYOUTS.vertical || !effectiveLayout,
        [NAV_RAIL_CLASSES.navRailHorizontal]: effectiveLayout === NAV_RAIL_ITEM_LAYOUTS.horizontal,
    };
}
/**
 * Lit directive for navigation rail element class styling.
 *
 * @example
 * ```ts
 * html`<nav class="${navRail({alignment: 'top'})}">
 *   <button class="${navRailItem({selected: true})}">Home</button>
 * </nav>`;
 * ```
 */
export const navRail = createClassMapDirective({
    getClasses: navRailClasses,
});
/** Navigation rail item classes constants. */
export const NAV_RAIL_ITEM_CLASSES = {
    navRailItem: 'nav-rail-item',
    navRailItemActive: 'nav-rail-item-active',
    navRailItemVertical: 'nav-rail-item-vertical',
    navRailItemHorizontal: 'nav-rail-item-horizontal',
    navRailItemContent: 'nav-rail-item-content',
    navRailItemIndicator: 'nav-rail-item-indicator',
    navRailItemIcon: 'nav-rail-item-icon',
    navRailItemLabel: 'nav-rail-item-label',
    navRailItemBadge: 'nav-rail-item-badge',
    navRailItemBadgeDot: 'nav-rail-item-badge-dot',
};
/**
 * Returns navigation rail item classes to apply based on the given state.
 *
 * @param state The state of the navigation rail item.
 * @return An object of class names and truthy values if they apply.
 */
export function navRailItemClasses({ active = false, disabled = false, itemLayout = NAV_RAIL_ITEM_LAYOUTS.vertical, selected = false, } = {}) {
    const isSelected = Boolean(selected || active);
    return {
        [RIPPLE_CLASSES.ripple]: true,
        [RIPPLE_CLASSES.disabled]: Boolean(disabled),
        [FOCUS_RING_CLASSES.focusRingInner]: true,
        [NAV_RAIL_ITEM_CLASSES.navRailItem]: true,
        [NAV_RAIL_ITEM_CLASSES.navRailItemActive]: isSelected,
        [NAV_RAIL_ITEM_CLASSES.navRailItemVertical]: itemLayout === NAV_RAIL_ITEM_LAYOUTS.vertical || !itemLayout,
        [NAV_RAIL_ITEM_CLASSES.navRailItemHorizontal]: itemLayout === NAV_RAIL_ITEM_LAYOUTS.horizontal,
    };
}
/**
 * Sets up navigation rail item functionality for the given element.
 *
 * @param item The element on which to set up navigation rail item behavior.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export function setupNavRailItem(item, opts) {
    setupRipple(item, opts);
}
/**
 * Lit directive for navigation rail item element class styling.
 */
export const navRailItem = createClassMapDirective({
    getClasses: navRailItemClasses,
    setupElement: setupNavRailItem,
});
//# sourceMappingURL=nav-rail.js.map