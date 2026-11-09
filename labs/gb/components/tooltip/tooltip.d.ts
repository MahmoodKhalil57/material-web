/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ClassInfo } from 'lit/directives/class-map.js';
import { type OverlayPosition, type OverlayPositionInput, type OverlayRect } from '../shared/anchored-overlay.js';
/** Tooltip variants. */
export declare const TOOLTIP_VARIANTS: {
    readonly plain: "plain";
    readonly rich: "rich";
};
/** Tooltip variant type. */
export type TooltipVariant = (typeof TOOLTIP_VARIANTS)[keyof typeof TOOLTIP_VARIANTS];
/**
 * Preferred placement relative to the anchor. `start` and `end` follow the
 * anchor's writing direction.
 */
export type TooltipPlacement = 'above' | 'below' | 'start' | 'end';
/** The physical side of the anchor a tooltip ended up on. */
export type TooltipSide = 'above' | 'below' | 'left' | 'right';
/**
 * Spec: "Both plain and rich tooltips disappear 1.5 seconds after navigating
 * away from the target region." Matches Compose
 * `BasicTooltipDefaults.TooltipDuration` (1500ms).
 */
export declare const TOOLTIP_HIDE_DELAY_MS = 1500;
/**
 * Compose shows a tooltip as soon as the mouse enters the anchor (no hover
 * delay); the spec names none either.
 */
export declare const TOOLTIP_SHOW_DELAY_MS = 0;
/**
 * Touch / stylus long-press duration that shows a tooltip, after Compose's
 * `viewConfiguration.longPressTimeoutMillis`.
 */
export declare const TOOLTIP_LONG_PRESS_MS = 500;
/** Tooltip CSS classes. */
export declare const TOOLTIP_CLASSES: {
    readonly tooltip: "tooltip";
    readonly rich: "tooltip-rich";
    readonly caret: "tooltip-has-caret";
    readonly subhead: "tooltip-has-subhead";
    readonly actions: "tooltip-has-actions";
    readonly above: "tooltip-above";
    readonly below: "tooltip-below";
    readonly left: "tooltip-left";
    readonly right: "tooltip-right";
};
/** State provided to `tooltipClasses()`. */
export interface TooltipClassesState {
    variant?: TooltipVariant;
    /** Which side of the anchor the tooltip is on; positions the caret. */
    side?: TooltipSide;
    caret?: boolean;
    hasSubhead?: boolean;
    hasActions?: boolean;
}
/** Returns the class map object for a tooltip based on the given state. */
export declare function tooltipClasses({ variant, side, caret, hasSubhead, hasActions, }?: TooltipClassesState): ClassInfo;
/**
 * Sets up a Light DOM tooltip: gives it the `tooltip` role unless it has one,
 * and hides it (when it is an open popover) on Escape.
 *
 * @param tooltip The tooltip root element.
 * @param opts Options, supports AbortSignal for cleanup.
 */
export declare function setupTooltip(tooltip: HTMLElement, opts?: {
    signal?: AbortSignal;
}): void;
/** A Lit directive that adds tooltip classes and setup logic to an element. */
export declare const tooltip: (state?: TooltipClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
/** A rectangle in viewport coordinates. */
export type TooltipRect = OverlayRect;
/** Input to `computeTooltipPosition()`. */
export interface TooltipPositionInput extends Omit<OverlayPositionInput, 'surface' | 'placement'> {
    /** The tooltip's untransformed size. */
    tooltip: {
        width: number;
        height: number;
    };
    placement: TooltipPlacement;
}
/** Output of `computeTooltipPosition()`. */
export type TooltipPosition = OverlayPosition;
/**
 * Positions a tooltip next to its anchor, after Compose's
 * `TooltipPositionProviderImpl` (see `computeOverlayPosition()`, the shared
 * anchored overlay placement): prefer the requested side, flip to the
 * opposite side when it doesn't fit, then keep the tooltip inside the
 * viewport. `align: 'start'` is the rich tooltip's "positioned to the
 * bottom right of the parent element".
 */
export declare function computeTooltipPosition({ tooltip, ...input }: TooltipPositionInput): TooltipPosition;
