/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {createClassMapDirective} from '../shared/directives.js';

/** Tooltip variants. */
export const TOOLTIP_VARIANTS = {
  plain: 'plain',
  rich: 'rich',
} as const;

/** Tooltip variant type. */
export type TooltipVariant =
  (typeof TOOLTIP_VARIANTS)[keyof typeof TOOLTIP_VARIANTS];

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
} as const;

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
export function tooltipClasses({
  variant = TOOLTIP_VARIANTS.plain,
  side = 'above',
  caret = false,
  hasSubhead = false,
  hasActions = false,
}: TooltipClassesState = {}): ClassInfo {
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
export function setupTooltip(
  tooltip: HTMLElement,
  opts?: {signal?: AbortSignal},
): void {
  if (!tooltip.hasAttribute('role')) {
    tooltip.setAttribute('role', 'tooltip');
  }
  tooltip.addEventListener(
    'keydown',
    (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !tooltip.matches(':popover-open')) {
        return;
      }
      event.preventDefault();
      tooltip.hidePopover();
    },
    opts,
  );
}

/** A Lit directive that adds tooltip classes and setup logic to an element. */
export const tooltip = createClassMapDirective({
  getClasses: tooltipClasses,
  setupElement: setupTooltip,
});

/** A rectangle in viewport coordinates. */
export interface TooltipRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/** Input to `computeTooltipPosition()`. */
export interface TooltipPositionInput {
  /** The anchor's bounding client rect. */
  anchor: TooltipRect;
  /** The tooltip's untransformed size. */
  tooltip: {width: number; height: number};
  /** The viewport size. */
  viewport: {width: number; height: number};
  placement: TooltipPlacement;
  /**
   * `center` centers the tooltip on the anchor (plain); `start` aligns it to
   * the anchor's start edge so it extends toward the end (rich: "positioned to
   * the bottom right of the parent element").
   */
  align?: 'center' | 'start';
  /** Gap between the anchor and the tooltip (including any caret). */
  spacing?: number;
  /** Minimum distance kept from the viewport edges. */
  margin?: number;
  /** Minimum distance between the caret's center and a tooltip corner. */
  caretInset?: number;
  rtl?: boolean;
}

/** Output of `computeTooltipPosition()`. */
export interface TooltipPosition {
  /** Viewport x of the tooltip's left edge. */
  x: number;
  /** Viewport y of the tooltip's top edge. */
  y: number;
  side: TooltipSide;
  /**
   * The caret's center along the edge facing the anchor, from the tooltip's
   * left (above / below) or top (left / right) edge.
   */
  caretOffset: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

/**
 * Positions a tooltip next to its anchor, after Compose's
 * `TooltipPositionProviderImpl`: prefer the requested side, flip to the
 * opposite side when it doesn't fit, then keep the tooltip inside the
 * viewport.
 */
export function computeTooltipPosition({
  anchor,
  tooltip,
  viewport,
  placement,
  align = 'center',
  spacing = 4,
  margin = 8,
  caretInset = 12,
  rtl = false,
}: TooltipPositionInput): TooltipPosition {
  const {width, height} = tooltip;
  const anchorWidth = anchor.right - anchor.left;
  const anchorHeight = anchor.bottom - anchor.top;
  const minX = margin;
  const maxX = viewport.width - margin - width;
  const minY = margin;
  const maxY = viewport.height - margin - height;

  let x: number;
  let y: number;
  let side: TooltipSide;

  if (placement === 'above' || placement === 'below') {
    if (align === 'start') {
      // Extend from the anchor's start edge toward its end, else end-align,
      // else center (Compose `rememberRichTooltipPositionProvider`).
      x = rtl ? anchor.right - width : anchor.left;
      if (x < minX || x > maxX) {
        x = rtl ? anchor.left : anchor.right - width;
        if (x < minX || x > maxX) {
          x = anchor.left + (anchorWidth - width) / 2;
        }
      }
    } else {
      x = anchor.left + (anchorWidth - width) / 2;
    }
    x = clamp(x, minX, maxX);

    const yAbove = anchor.top - spacing - height;
    const yBelow = anchor.bottom + spacing;
    if (placement === 'above') {
      const fitsAbove = yAbove >= minY;
      side = fitsAbove || yBelow > maxY ? 'above' : 'below';
    } else {
      const fitsBelow = yBelow <= maxY;
      side = fitsBelow || yAbove < minY ? 'below' : 'above';
    }
    y = side === 'above' ? yAbove : yBelow;
    y = clamp(y, minY, maxY);
  } else {
    const preferLeft = (placement === 'start') !== rtl;
    const xLeft = anchor.left - spacing - width;
    const xRight = anchor.right + spacing;
    if (preferLeft) {
      side = xLeft >= minX || xRight > maxX ? 'left' : 'right';
    } else {
      side = xRight <= maxX || xLeft < minX ? 'right' : 'left';
    }
    x = clamp(side === 'left' ? xLeft : xRight, minX, maxX);
    y = clamp(anchor.top + (anchorHeight - height) / 2, minY, maxY);
  }

  const vertical = side === 'above' || side === 'below';
  const length = vertical ? width : height;
  const anchorCenter = vertical
    ? anchor.left + anchorWidth / 2 - x
    : anchor.top + anchorHeight / 2 - y;
  const inset = Math.min(caretInset, length / 2);
  const caretOffset = clamp(anchorCenter, inset, length - inset);

  return {x, y, side, caretOffset};
}
