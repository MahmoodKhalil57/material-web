/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Keeps focused elements clear of sticky and fixed bars (WCAG 2.4.11 Focus
 * Not Obscured). The M3 FAB, FAB menu, snackbar, card, dialog and side sheet
 * pages ask that an actionable element and its focus indicator are not
 * completely hidden by other UI; on the web the usual culprits are sticky app
 * bars and docked or floating toolbars (and fixed FABs) over a scrolling
 * container.
 *
 * `setupScrollPadding()` measures how much of a scroll container the bars
 * cover at its top and bottom and:
 * - sets `scroll-padding-block-start` and `scroll-padding-block-end` on the
 *   container, so focus navigation, `scrollIntoView()` and fragment links
 *   scroll elements out from under the bars;
 * - exposes the same values as the `--md-gb-obscured-block-start` and
 *   `--md-gb-obscured-block-end` custom properties on the container (for
 *   `scroll-margin`, or to offset other fixed UI);
 * - as a fallback, scrolls a keyboard-focused element that is still under a
 *   bar (focus indicator included) into the clear area.
 */

/** Custom property with the block-start inset the bars cover, in px. */
export const OBSCURED_BLOCK_START_PROPERTY = '--md-gb-obscured-block-start';

/** Custom property with the block-end inset the bars cover, in px. */
export const OBSCURED_BLOCK_END_PROPERTY = '--md-gb-obscured-block-end';

/**
 * Space kept between a bar and a scrolled-to element so its focus indicator
 * stays visible: `md.sys.state.focus-indicator.thickness` (3dp) plus
 * `md.sys.state.focus-indicator.outer-offset` (2dp).
 */
export const FOCUS_INDICATOR_EXTENT_PX = 5;

/** Options of `setupScrollPadding()`. */
export interface ScrollPaddingOptions {
  /**
   * Bars at the top of the container: sticky or fixed app bars and top
   * toolbars.
   */
  start?: Iterable<Element>;
  /**
   * Bars at the bottom of the container: docked or floating toolbars, bottom
   * app bars and fixed FABs.
   */
  end?: Iterable<Element>;
  /**
   * Extra space beyond the bars. Defaults to `FOCUS_INDICATOR_EXTENT_PX`.
   */
  gap?: number;
  /** Stops tracking and removes the padding when aborted. */
  signal?: AbortSignal;
}

/** Returned by `setupScrollPadding()`. */
export interface ScrollPaddingController {
  /** The current block-start padding, in px. */
  readonly start: number;
  /** The current block-end padding, in px. */
  readonly end: number;
  /** Measures the bars again, e.g. after a bar changes position. */
  update(): void;
  /** Stops tracking and removes the padding. */
  disconnect(): void;
}

/** Whether `scroller` scrolls the viewport. */
function isViewportScroller(scroller: Element): boolean {
  return (
    scroller === document.documentElement ||
    scroller === document.body ||
    scroller === document.scrollingElement
  );
}

/** The visible block range of a scroll container, in viewport px. */
function scrollportRange(scroller: Element): {top: number; bottom: number} {
  if (isViewportScroller(scroller)) {
    return {top: 0, bottom: window.innerHeight};
  }
  const rect = scroller.getBoundingClientRect();
  const top = rect.top + scroller.clientTop;
  return {top, bottom: top + scroller.clientHeight};
}

/** The px value of an inset property, 0 for `auto`. */
function insetPx(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

/**
 * How far a bar reaches into the scrollport from its top (`edge: 'start'`)
 * or bottom (`'end'`). Static and relative bars scroll with the content and
 * cover nothing; sticky bars cover their inset plus their height once stuck;
 * fixed and absolute bars cover where they overlap the scrollport.
 */
export function obscuredExtent(
  bar: Element,
  scroller: Element,
  edge: 'start' | 'end',
): number {
  const style = getComputedStyle(bar);
  if (style.display === 'none' || style.visibility === 'hidden') {
    return 0;
  }
  const rect = bar.getBoundingClientRect();
  if (!rect.height) {
    return 0;
  }
  const {top, bottom} = scrollportRange(scroller);
  switch (style.position) {
    case 'sticky': {
      const inset = insetPx(edge === 'start' ? style.top : style.bottom);
      return Math.max(0, inset + rect.height);
    }
    case 'fixed':
    case 'absolute': {
      if (rect.bottom <= top || rect.top >= bottom) {
        return 0;
      }
      return Math.max(
        0,
        edge === 'start'
          ? Math.min(rect.bottom, bottom) - top
          : bottom - Math.max(rect.top, top),
      );
    }
    default:
      return 0;
  }
}

/**
 * Sets `scroll-padding` on a scroll container for the bars that cover it,
 * and keeps it up to date as they resize. See the module documentation.
 *
 * @param scroller The scroll container, or `document.documentElement` for the
 *     page.
 * @param options The bars at the container's start and end.
 * @return A controller to update or disconnect.
 */
export function setupScrollPadding(
  scroller: HTMLElement,
  options: ScrollPaddingOptions = {},
): ScrollPaddingController {
  const startBars = [...(options.start ?? [])];
  const endBars = [...(options.end ?? [])];
  const gap = options.gap ?? FOCUS_INDICATOR_EXTENT_PX;
  const controller = new AbortController();
  let start = 0;
  let end = 0;

  const measure = (bars: Element[], edge: 'start' | 'end') => {
    const extent = Math.max(
      0,
      ...bars.map((bar) => obscuredExtent(bar, scroller, edge)),
    );
    return extent > 0 ? Math.ceil(extent + gap) : 0;
  };

  const update = () => {
    if (controller.signal.aborted) {
      return;
    }
    start = measure(startBars, 'start');
    end = measure(endBars, 'end');
    scroller.style.setProperty(OBSCURED_BLOCK_START_PROPERTY, `${start}px`);
    scroller.style.setProperty(OBSCURED_BLOCK_END_PROPERTY, `${end}px`);
    scroller.style.scrollPaddingBlockStart = `${start}px`;
    scroller.style.scrollPaddingBlockEnd = `${end}px`;
  };

  const disconnect = () => {
    if (controller.signal.aborted) {
      return;
    }
    controller.abort();
    observer?.disconnect();
    scroller.style.removeProperty(OBSCURED_BLOCK_START_PROPERTY);
    scroller.style.removeProperty(OBSCURED_BLOCK_END_PROPERTY);
    scroller.style.removeProperty('scroll-padding-block-start');
    scroller.style.removeProperty('scroll-padding-block-end');
  };

  const observer =
    typeof ResizeObserver === 'function' ? new ResizeObserver(update) : null;
  for (const el of [scroller, ...startBars, ...endBars]) {
    observer?.observe(el);
  }
  const listen = {signal: controller.signal, passive: true};
  window.addEventListener('resize', update, listen);

  // Fallback for browsers that ignore scroll-padding when moving focus:
  // scroll a keyboard-focused element out from under the bars.
  const focusTarget: EventTarget = isViewportScroller(scroller)
    ? document
    : scroller;
  focusTarget.addEventListener(
    'focusin',
    (event: Event) => {
      const path = event.composedPath();
      const target = path[0];
      if (
        !(target instanceof Element) ||
        !target.matches(':focus-visible') ||
        [...startBars, ...endBars].some((bar) => path.includes(bar))
      ) {
        return;
      }
      revealFocused(target);
    },
    listen,
  );

  const revealFocused = (target: Element) => {
    const rect = target.getBoundingClientRect();
    const {top, bottom} = scrollportRange(scroller);
    const clearTop = top + start;
    const clearBottom = bottom - end;
    // The focus indicator extends past the element.
    const elTop = rect.top - FOCUS_INDICATOR_EXTENT_PX;
    const elBottom = rect.bottom + FOCUS_INDICATOR_EXTENT_PX;
    let delta = 0;
    if (elTop < clearTop) {
      delta = elTop - clearTop;
    } else if (elBottom > clearBottom) {
      delta = Math.min(elBottom - clearBottom, elTop - clearTop);
    }
    if (delta) {
      const scrolling = isViewportScroller(scroller)
        ? (document.scrollingElement ?? document.documentElement)
        : scroller;
      scrolling.scrollTop += delta;
    }
  };

  options.signal?.addEventListener('abort', disconnect, {once: true});
  update();

  return {
    get start() {
      return start;
    },
    get end() {
      return end;
    },
    update,
    disconnect,
  };
}
