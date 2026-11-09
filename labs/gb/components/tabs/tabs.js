/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { FOCUS_RING_CLASSES } from '../focus/focus-ring.js';
import { RIPPLE_CLASSES } from '../ripple/ripple.js';
import { densityClasses, densityClassNames } from '../shared/density.js';
import { createClassMapDirective } from '../shared/directives.js';
/** Tabs classes. */
export const TABS_CLASSES = {
    tabs: 'tabs',
    tabsSecondary: 'tabs-secondary',
    ...densityClassNames('tabs'),
};
/**
 * Returns the tabs classes to apply to an element based on the given state.
 *
 * @param state The state of the tabs.
 * @return An object of class names and truthy values if they apply.
 */
export function tabsClasses({ variant = 'primary', density = 0, } = {}) {
    return {
        [TABS_CLASSES.tabs]: true,
        [TABS_CLASSES.tabsSecondary]: variant === 'secondary',
        ...densityClasses(TABS_CLASSES.tabs, density),
    };
}
/**
 * Sets up tabs functionality for the given element.
 *
 * @param tabsElement The element on which to set up tabs functionality.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export function setupTabs(tabsElement, opts) {
    tabsElement.addEventListener('focusin', (event) => {
        const target = event.target;
        if (!(target instanceof Element) || target === tabsElement) {
            return;
        }
        target.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }, opts);
}
/**
 * A Lit directive that adds tabs styling to its element.
 *
 * The element is responsible for its own ARIA: add `role="tablist"` and
 * `focusgroup="tablist inline"` when not using `<md-gb-tabs>`.
 *
 * @example
 * ```ts
 * html`
 *   <div class="${tabs()}" role="tablist" focusgroup="tablist inline">
 *     <button class="${tab({selected: true})}" role="tab" aria-selected="true">
 *       <span class="tab-label">Tab 1</span>
 *     </button>
 *     <button class="${tab()}" role="tab" aria-selected="false">
 *       <span class="tab-label">Tab 2</span>
 *     </button>
 *   </div>
 * `;
 * ```
 */
export const tabs = createClassMapDirective({
    getClasses: tabsClasses,
    setupElement: setupTabs,
});
/** Tab classes. */
export const TAB_CLASSES = {
    tab: 'tab',
    tabLabel: 'tab-label',
    tabBadge: 'tab-badge',
    selected: 'selected',
    focusRingInner: FOCUS_RING_CLASSES.focusRingInner,
    ripple: RIPPLE_CLASSES.ripple,
};
/**
 * Returns the tab classes to apply to an element based on the given state.
 *
 * `<md-gb-tab>` does not use this function: it emits `:state(selected)`, which
 * the stylesheet matches alongside `.selected` and `[aria-selected="true"]`.
 *
 * @param state The state of the tab.
 * @return An object of class names and truthy values if they apply.
 */
export function tabClasses({ selected = false, } = {}) {
    return {
        [TAB_CLASSES.tab]: true,
        [TAB_CLASSES.focusRingInner]: true,
        [TAB_CLASSES.ripple]: true,
        [TAB_CLASSES.selected]: selected,
    };
}
/**
 * A Lit directive that adds tab styling to its element.
 *
 * Labels must be marked up with `class="tab-label"` (or `slot="label"` inside
 * `<md-gb-tab>`). Bare text is not a supported authoring form. Icons are
 * unclassed children; the tab sets `--md-icon-*` for them.
 *
 * @example
 * ```ts
 * // Applies class="tab focus-ring-inner ripple [selected]"
 * html`
 *   <button class="${tab({selected})}" role="tab" aria-selected="${selected}">
 *     <md-gb-icon>flight</md-gb-icon>
 *     <span class="tab-label">Flights</span>
 *   </button>
 * `;
 * ```
 */
export const tab = createClassMapDirective({
    getClasses: tabClasses,
});
//# sourceMappingURL=tabs.js.map