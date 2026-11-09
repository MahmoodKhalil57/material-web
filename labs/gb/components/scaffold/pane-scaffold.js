/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { DOCKED_PANE_FLOATS_FROM, isWindowSizeClassAtLeast, PANE_SNAP_SPLIT, PANE_SNAP_WIDTHS, windowSizeClassValues, } from '../../styles/layout/window-size-class.js';
import { createClassMapDirective } from '../shared/directives.js';
/**
 * Decides which panes are visible and how, following the pane totals per
 * window size class (spec: compact 1, medium 1 (or 2), expanded and large 2,
 * extra-large 2 (or 3)).
 *
 * On foldables, panes keep off the fold (spec: the spacer is "the space
 * between two panes on a foldable device"): a vertical fold (book posture,
 * dual screens) always shows two panes split at the fold, one per segment;
 * a horizontal fold (tabletop posture) stacks the supporting pane of
 * supporting pane and feed layouts below the fold. A layout with a single
 * pane can't split and ignores the fold.
 */
export function planPanes({ layout, windowClass, mediumTwoPane = false, hasSecondary = false, hasTertiary = false, detailOpen = false, collapsedPane = null, levitate = 'none', levitateOpen = false, levitateModal = false, levitateCoplanar = false, fold = null, }) {
    const { panesRecommended, panesMax } = windowSizeClassValues(windowClass);
    const twoPane = panesMax >= 2 &&
        (panesRecommended >= 2 || (windowClass === 'medium' && mediumTwoPane));
    // A standard side sheet can be a third pane at extra-large only.
    const tertiary = hasTertiary && panesMax >= 3;
    const none = {
        fold: null,
        levitated: null,
    };
    if (!hasSecondary) {
        return {
            mode: 'single',
            visible: ['primary'],
            tertiary,
            paneCount: tertiary ? 2 : 1,
            ...none,
        };
    }
    if (fold === 'vertical') {
        // One pane per segment; collapsing a pane would put the other on the
        // fold, and a third pane would not fit a segment.
        return {
            mode: 'two-pane',
            visible: ['secondary', 'primary'],
            tertiary: false,
            paneCount: 2,
            fold,
            levitated: null,
        };
    }
    if (fold === 'horizontal' && layout !== 'list-detail') {
        return {
            mode: 'stacked',
            visible: ['primary', 'secondary'],
            tertiary: false,
            paneCount: 1,
            fold,
            levitated: null,
        };
    }
    // Spec (scaffold, Levitate): "On large screens: floating panes are the
    // default", so a levitated (temporary) pane keeps floating at large and
    // extra-large instead of turning co-planar, unless the author opts into
    // co-planar. A modal pane (a temporary task) floats at every size class.
    const floatsByDefault = levitate !== 'none' &&
        layout !== 'list-detail' &&
        !levitateCoplanar &&
        isWindowSizeClassAtLeast(windowClass, 'large');
    const temporaryTask = levitate !== 'none' && (levitateModal || floatsByDefault);
    if (twoPane && !temporaryTask) {
        const visible = collapsedPane === 'secondary'
            ? ['primary']
            : collapsedPane === 'primary'
                ? ['secondary']
                : ['secondary', 'primary'];
        return {
            mode: 'two-pane',
            visible,
            tertiary,
            paneCount: visible.length + (tertiary ? 1 : 0),
            ...none,
        };
    }
    if (layout === 'list-detail') {
        // Only one view is visible at a time, either list or detail.
        return {
            mode: 'single',
            visible: [detailOpen ? 'primary' : 'secondary'],
            tertiary: false,
            paneCount: 1,
            ...none,
        };
    }
    if (levitate !== 'none') {
        // A docked pane adapts into a floating pane at medium and expanded.
        const docked = levitate === 'docked' &&
            !isWindowSizeClassAtLeast(windowClass, DOCKED_PANE_FLOATS_FROM);
        return {
            mode: 'levitated',
            visible: levitateOpen ? ['primary', 'secondary'] : ['primary'],
            tertiary: false,
            paneCount: 1,
            fold: null,
            levitated: docked ? 'docked' : 'floating',
        };
    }
    // Supporting pane and feed: the supporting pane appears below.
    return {
        mode: 'stacked',
        visible: ['primary', 'secondary'],
        tertiary: false,
        paneCount: 1,
        ...none,
    };
}
/**
 * Returns the widths the secondary pane snaps to when the drag handle is
 * released, smallest first: 0 (collapsed), the spec's custom widths (360dp,
 * 412dp) and the centered split at expanded and larger, or 50% at medium,
 * and `available` (the other pane collapsed).
 *
 * @param windowClass The current window size class.
 * @param available The width shared by the two panes (without the spacer).
 * @param splitWidth The secondary width that visually centers the spacer.
 */
export function paneSnapTargets(windowClass, available, splitWidth = available / 2) {
    const targets = new Set([0, Math.round(available)]);
    if (isWindowSizeClassAtLeast(windowClass, 'expanded')) {
        for (const width of PANE_SNAP_WIDTHS) {
            if (width < available)
                targets.add(width);
        }
        if (PANE_SNAP_SPLIT)
            targets.add(Math.round(splitWidth));
    }
    else {
        targets.add(Math.round(splitWidth));
    }
    return [...targets]
        .filter((width) => width >= 0 && width <= available)
        .sort((a, b) => a - b);
}
/**
 * Returns the secondary width a `cycle` tap on the drag handle moves to: the
 * next snap width wider than `current`, then 0 (secondary collapsed), then the
 * narrowest snap width again.
 *
 * @param current The current secondary width (0 when collapsed, `available`
 *     when the primary pane is collapsed).
 * @param targets The snap targets (`paneSnapTargets`).
 * @param available The width of both panes.
 * @return The next secondary width.
 */
export function nextPaneSnapTarget(current, targets, available) {
    const widths = targets.filter((t) => t > 0 && t < available);
    if (!widths.length)
        return current > 0 ? 0 : available;
    if (current <= 0 || current >= available)
        return widths[0];
    return widths.find((t) => t > current + 1) ?? 0;
}
/** Returns the target closest to `width`. */
export function nearestSnapTarget(width, targets) {
    let best = targets[0] ?? 0;
    for (const target of targets) {
        if (Math.abs(target - width) < Math.abs(best - width))
            best = target;
    }
    return best;
}
/** Pane scaffold CSS classes. */
export const PANE_SCAFFOLD_CLASSES = {
    paneScaffold: 'pane-scaffold',
    single: 'pane-scaffold-single',
    twoPane: 'pane-scaffold-two-pane',
    stacked: 'pane-scaffold-stacked',
    split: 'pane-scaffold-split',
    secondaryEnd: 'pane-scaffold-secondary-end',
    tertiary: 'pane-scaffold-tertiary',
    feed: 'pane-scaffold-feed',
    dragging: 'pane-scaffold-dragging',
    levitated: 'pane-scaffold-levitated',
    floating: 'pane-scaffold-floating',
    docked: 'pane-scaffold-docked',
    foldVertical: 'pane-scaffold-fold-vertical',
    foldHorizontal: 'pane-scaffold-fold-horizontal',
};
/** Returns the class map object for the pane scaffold. */
export function paneScaffoldClasses({ mode = 'single', layout = 'list-detail', split = false, secondaryPosition = 'start', tertiary = false, dragging = false, levitated = null, fold = null, } = {}) {
    return {
        [PANE_SCAFFOLD_CLASSES.paneScaffold]: true,
        [PANE_SCAFFOLD_CLASSES.single]: mode === 'single',
        [PANE_SCAFFOLD_CLASSES.twoPane]: mode === 'two-pane',
        [PANE_SCAFFOLD_CLASSES.stacked]: mode === 'stacked',
        [PANE_SCAFFOLD_CLASSES.split]: split && mode === 'two-pane',
        [PANE_SCAFFOLD_CLASSES.secondaryEnd]: secondaryPosition === 'end',
        [PANE_SCAFFOLD_CLASSES.tertiary]: tertiary,
        [PANE_SCAFFOLD_CLASSES.feed]: layout === 'feed',
        [PANE_SCAFFOLD_CLASSES.dragging]: dragging,
        [PANE_SCAFFOLD_CLASSES.levitated]: mode === 'levitated',
        [PANE_SCAFFOLD_CLASSES.floating]: mode === 'levitated' && levitated === 'floating',
        [PANE_SCAFFOLD_CLASSES.docked]: mode === 'levitated' && levitated === 'docked',
        [PANE_SCAFFOLD_CLASSES.foldVertical]: fold === 'vertical',
        [PANE_SCAFFOLD_CLASSES.foldHorizontal]: fold === 'horizontal',
    };
}
/**
 * A Lit directive that adds pane scaffold classes to an element.
 */
export const paneScaffold = createClassMapDirective({
    getClasses: paneScaffoldClasses,
});
//# sourceMappingURL=pane-scaffold.js.map