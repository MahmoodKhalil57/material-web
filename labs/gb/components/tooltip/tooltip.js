/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { computeOverlayPosition, } from '../shared/anchored-overlay.js';
import { createClassMapDirective } from '../shared/directives.js';
/** Tooltip variants. */
export const TOOLTIP_VARIANTS = {
    plain: 'plain',
    rich: 'rich',
};
/**
 * Spec: "Both plain and rich tooltips disappear 1.5 seconds after navigating
 * away from the target region." Matches Compose
 * `BasicTooltipDefaults.TooltipDuration` (1500ms).
 */
export const TOOLTIP_HIDE_DELAY_MS = 1500;
/**
 * Compose shows a tooltip as soon as the mouse enters the anchor (no hover
 * delay); the spec names none either.
 */
export const TOOLTIP_SHOW_DELAY_MS = 0;
/**
 * Touch / stylus long-press duration that shows a tooltip, after Compose's
 * `viewConfiguration.longPressTimeoutMillis`.
 */
export const TOOLTIP_LONG_PRESS_MS = 500;
/** Tooltip CSS classes. */
export const TOOLTIP_CLASSES = {
    tooltip: 'tooltip',
    rich: 'tooltip-rich',
    caret: 'tooltip-has-caret',
    subhead: 'tooltip-has-subhead',
    actions: 'tooltip-has-actions',
    above: 'tooltip-above',
    below: 'tooltip-below',
    left: 'tooltip-left',
    right: 'tooltip-right',
};
/** Returns the class map object for a tooltip based on the given state. */
export function tooltipClasses({ variant = TOOLTIP_VARIANTS.plain, side = 'above', caret = false, hasSubhead = false, hasActions = false, } = {}) {
    const rich = variant === TOOLTIP_VARIANTS.rich;
    return {
        [TOOLTIP_CLASSES.tooltip]: true,
        [TOOLTIP_CLASSES.rich]: rich,
        [TOOLTIP_CLASSES.caret]: caret,
        [TOOLTIP_CLASSES.subhead]: rich && hasSubhead,
        [TOOLTIP_CLASSES.actions]: rich && hasActions,
        [TOOLTIP_CLASSES.above]: side === 'above',
        [TOOLTIP_CLASSES.below]: side === 'below',
        [TOOLTIP_CLASSES.left]: side === 'left',
        [TOOLTIP_CLASSES.right]: side === 'right',
    };
}
/**
 * Sets up a Light DOM tooltip: gives it the `tooltip` role unless it has one,
 * and hides it (when it is an open popover) on Escape.
 *
 * @param tooltip The tooltip root element.
 * @param opts Options, supports AbortSignal for cleanup.
 */
export function setupTooltip(tooltip, opts) {
    if (!tooltip.hasAttribute('role')) {
        tooltip.setAttribute('role', 'tooltip');
    }
    tooltip.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || !tooltip.matches(':popover-open')) {
            return;
        }
        event.preventDefault();
        tooltip.hidePopover();
    }, opts);
}
/** A Lit directive that adds tooltip classes and setup logic to an element. */
export const tooltip = createClassMapDirective({
    getClasses: tooltipClasses,
    setupElement: setupTooltip,
});
/**
 * Positions a tooltip next to its anchor, after Compose's
 * `TooltipPositionProviderImpl` (see `computeOverlayPosition()`, the shared
 * anchored overlay placement): prefer the requested side, flip to the
 * opposite side when it doesn't fit, then keep the tooltip inside the
 * viewport. `align: 'start'` is the rich tooltip's "positioned to the
 * bottom right of the parent element".
 */
export function computeTooltipPosition({ tooltip, ...input }) {
    return computeOverlayPosition({ ...input, surface: tooltip });
}
//# sourceMappingURL=tooltip.js.map