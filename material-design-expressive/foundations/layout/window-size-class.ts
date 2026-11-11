/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ReactiveController, type ReactiveControllerHost} from 'lit';

import {
  WINDOW_HEIGHT_CLASS_VALUES,
  WINDOW_HEIGHT_CLASSES,
  WINDOW_SIZE_CLASS_VALUES,
  WINDOW_SIZE_CLASSES,
  type WindowHeightClass,
  type WindowSizeClass,
  type WindowSizeClassValues,
} from './layout-values.js';

export {
  DOCKED_PANE_EDGE,
  DOCKED_PANE_FLOATS_FROM,
  PANE_SNAP_SPLIT,
  PANE_SNAP_WIDTHS,
  THIRD_PANE_MAX_WIDTH,
  WINDOW_HEIGHT_CLASS_VALUES,
  WINDOW_HEIGHT_CLASSES,
  WINDOW_SIZE_CLASS_VALUES,
  WINDOW_SIZE_CLASSES,
  type WindowHeightClass,
  type WindowHeightClassValues,
  type WindowSizeClass,
  type WindowSizeClassValues,
} from './layout-values.js';

/**
 * Returns the M3 window size class (breakpoint) for a width in CSS px:
 * compact (< 600), medium (600–839), expanded (840–1199), large (1200–1599)
 * or extra-large (1600+).
 */
export function windowSizeClass(width: number): WindowSizeClass {
  for (const cls of WINDOW_SIZE_CLASSES) {
    const {maxWidth} = WINDOW_SIZE_CLASS_VALUES[cls];
    if (maxWidth === null || width < maxWidth) {
      return cls;
    }
  }
  return WINDOW_SIZE_CLASSES[WINDOW_SIZE_CLASSES.length - 1];
}

/**
 * Returns the M3 window height size class for a height in CSS px: compact
 * (< 480), medium (480–899) or expanded (900+). Most layouts scroll
 * vertically, so the spec expects few layouts to adjust to height.
 */
export function windowHeightClass(height: number): WindowHeightClass {
  for (const cls of WINDOW_HEIGHT_CLASSES) {
    const {maxHeight} = WINDOW_HEIGHT_CLASS_VALUES[cls];
    if (maxHeight === null || height < maxHeight) {
      return cls;
    }
  }
  return WINDOW_HEIGHT_CLASSES[WINDOW_HEIGHT_CLASSES.length - 1];
}

/** The width and height size classes of a window. */
export interface WindowSizeClasses {
  width: WindowSizeClass;
  height: WindowHeightClass;
}

/** Returns both the width and the height size class of a window size. */
export function windowSizeClasses(
  width: number,
  height: number,
): WindowSizeClasses {
  return {width: windowSizeClass(width), height: windowHeightClass(height)};
}

/** Returns the layout values (margin, spacer, panes, ...) of a class. */
export function windowSizeClassValues(
  cls: WindowSizeClass,
): WindowSizeClassValues {
  return WINDOW_SIZE_CLASS_VALUES[cls];
}

/**
 * Compares two window size classes: negative if `a` is smaller than `b`,
 * 0 if equal, positive if larger.
 */
export function compareWindowSizeClasses(
  a: WindowSizeClass,
  b: WindowSizeClass,
): number {
  return WINDOW_SIZE_CLASSES.indexOf(a) - WINDOW_SIZE_CLASSES.indexOf(b);
}

/** Whether `cls` is `min` or a larger class. */
export function isWindowSizeClassAtLeast(
  cls: WindowSizeClass,
  min: WindowSizeClass,
): boolean {
  return compareWindowSizeClasses(cls, min) >= 0;
}

/** Whether the height class `cls` is `min` or a larger class. */
export function isWindowHeightClassAtLeast(
  cls: WindowHeightClass,
  min: WindowHeightClass,
): boolean {
  return (
    WINDOW_HEIGHT_CLASSES.indexOf(cls) >= WINDOW_HEIGHT_CLASSES.indexOf(min)
  );
}

/** What `observeWindowSizeClass()` measures. */
export type WindowSizeTarget = Element | Window;

/** Called with the new class and the measured width. */
export type WindowSizeClassCallback = (
  cls: WindowSizeClass,
  width: number,
) => void;

/** Called with the new height class and the measured height. */
export type WindowHeightClassCallback = (
  cls: WindowHeightClass,
  height: number,
) => void;

/** Options for `observeWindowSizeClass()`. */
export interface ObserveWindowSizeClassOptions {
  /** Stops observing when aborted. */
  signal?: AbortSignal;
  /**
   * Whether to call the callback right away with the current class.
   * Defaults to true.
   */
  initial?: boolean;
}

/** Returns the inline size of an element's border box, or the viewport. */
export function measureWidth(target: WindowSizeTarget): number {
  if (isWindow(target)) {
    return target.innerWidth;
  }
  return target.getBoundingClientRect().width;
}

/** Returns the block size of an element's border box, or the viewport. */
export function measureHeight(target: WindowSizeTarget): number {
  if (isWindow(target)) {
    return target.innerHeight;
  }
  return target.getBoundingClientRect().height;
}

function isWindow(target: WindowSizeTarget): target is Window {
  return (target as Window).window === target;
}

/**
 * Calls `onResize(width, height)` when `target` may have crossed one of the
 * `queries` breakpoints (a window) or resized (an element).
 */
function observeSize(
  target: WindowSizeTarget,
  queries: string[],
  onResize: (width: number, height: number) => void,
  signal?: AbortSignal,
): () => void {
  let stop: () => void;
  if (isWindow(target)) {
    const lists = queries.map((query) => target.matchMedia(query));
    const onChange = () => {
      onResize(target.innerWidth, target.innerHeight);
    };
    for (const list of lists) {
      list.addEventListener('change', onChange);
    }
    stop = () => {
      for (const list of lists) {
        list.removeEventListener('change', onChange);
      }
    };
  } else {
    const observer = new ResizeObserver((entries) => {
      const entry = entries[entries.length - 1];
      const box = entry.borderBoxSize?.[0];
      onResize(
        box?.inlineSize ?? entry.contentRect.width,
        box?.blockSize ?? entry.contentRect.height,
      );
    });
    observer.observe(target);
    stop = () => {
      observer.disconnect();
    };
  }
  if (signal) {
    if (signal.aborted) {
      stop();
    } else {
      signal.addEventListener('abort', stop, {once: true});
    }
  }
  return stop;
}

const WIDTH_QUERIES = WINDOW_SIZE_CLASSES.map(
  (cls) => WINDOW_SIZE_CLASS_VALUES[cls].minWidth,
)
  .filter((min) => min > 0)
  .map((min) => `(width >= ${min}px)`);

const HEIGHT_QUERIES = WINDOW_HEIGHT_CLASSES.map(
  (cls) => WINDOW_HEIGHT_CLASS_VALUES[cls].minHeight,
)
  .filter((min) => min > 0)
  .map((min) => `(height >= ${min}px)`);

/**
 * Calls `callback` whenever the window size class of `target` changes.
 *
 * For a `Window`, the class follows the viewport (via `matchMedia()` on the
 * breakpoint widths). For an element, it follows the element's border box
 * width (via `ResizeObserver`), so a resizable container can stand in for
 * the window.
 *
 * @return A function that stops observing.
 */
export function observeWindowSizeClass(
  target: WindowSizeTarget,
  callback: WindowSizeClassCallback,
  {signal, initial = true}: ObserveWindowSizeClassOptions = {},
): () => void {
  let current: WindowSizeClass | null = initial
    ? null
    : windowSizeClass(measureWidth(target));
  const update = (width: number) => {
    const cls = windowSizeClass(width);
    if (cls === current) {
      return;
    }
    current = cls;
    callback(cls, width);
  };
  const stop = observeSize(target, WIDTH_QUERIES, update, signal);
  if (initial && !signal?.aborted) {
    update(measureWidth(target));
  }
  return stop;
}

/**
 * Calls `callback` whenever the window height size class of `target`
 * changes, like `observeWindowSizeClass()` for heights.
 *
 * @return A function that stops observing.
 */
export function observeWindowHeightClass(
  target: WindowSizeTarget,
  callback: WindowHeightClassCallback,
  {signal, initial = true}: ObserveWindowSizeClassOptions = {},
): () => void {
  let current: WindowHeightClass | null = initial
    ? null
    : windowHeightClass(measureHeight(target));
  const update = (_width: number, height: number) => {
    const cls = windowHeightClass(height);
    if (cls === current) {
      return;
    }
    current = cls;
    callback(cls, height);
  };
  const stop = observeSize(target, HEIGHT_QUERIES, update, signal);
  if (initial && !signal?.aborted) {
    update(measureWidth(target), measureHeight(target));
  }
  return stop;
}

/**
 * Calls `callback` whenever the width or the height size class of `target`
 * changes, with both classes.
 *
 * @return A function that stops observing.
 */
export function observeWindowSizeClasses(
  target: WindowSizeTarget,
  callback: (classes: WindowSizeClasses, width: number, height: number) => void,
  {signal, initial = true}: ObserveWindowSizeClassOptions = {},
): () => void {
  let current: WindowSizeClasses | null = initial
    ? null
    : windowSizeClasses(measureWidth(target), measureHeight(target));
  const update = (width: number, height: number) => {
    const classes = windowSizeClasses(width, height);
    if (
      current?.width === classes.width &&
      current?.height === classes.height
    ) {
      return;
    }
    current = classes;
    callback(classes, width, height);
  };
  const stop = observeSize(
    target,
    [...WIDTH_QUERIES, ...HEIGHT_QUERIES],
    update,
    signal,
  );
  if (initial && !signal?.aborted) {
    update(measureWidth(target), measureHeight(target));
  }
  return stop;
}

/** Options for `WindowSizeClassController`. */
export interface WindowSizeClassControllerOptions {
  /**
   * What to measure. Defaults to the host element. Called when the host
   * connects, so it can look up an ancestor. Return null to not measure
   * anything and feed the class with `set()` instead.
   */
  target?: () => WindowSizeTarget | null;
  /** Called after the class changes, before the host updates. */
  onChange?: (cls: WindowSizeClass, previous: WindowSizeClass | null) => void;
  /** Called after the height class changes, before the host updates. */
  onHeightChange?: (
    cls: WindowHeightClass,
    previous: WindowHeightClass | null,
  ) => void;
}

/**
 * A Lit controller that tracks the window size class (and window height
 * size class) of its host, or of another target, and requests an update
 * when either changes.
 *
 * @example
 * ```ts
 * class MyElement extends LitElement {
 *   private readonly size = new WindowSizeClassController(this);
 *   render() {
 *     return this.size.value === 'compact' ? html`...` : html`...`;
 *   }
 * }
 * ```
 */
export class WindowSizeClassController implements ReactiveController {
  /** The current window size class. `compact` until measured. */
  value: WindowSizeClass = 'compact';

  /** The current window height size class. `medium` until measured. */
  height: WindowHeightClass = 'medium';

  private stop: (() => void) | null = null;
  private measured = false;
  private heightMeasured = false;

  constructor(
    private readonly host: ReactiveControllerHost & HTMLElement,
    private readonly options: WindowSizeClassControllerOptions = {},
  ) {
    host.addController(this);
  }

  hostConnected() {
    this.observe();
  }

  hostDisconnected() {
    this.stop?.();
    this.stop = null;
  }

  /** Re-reads the target (e.g. after the host moved) and re-measures. */
  observe() {
    this.stop?.();
    const target = this.options.target ? this.options.target() : this.host;
    if (!target) {
      this.stop = null;
      return;
    }
    this.stop = observeWindowSizeClasses(target, ({width, height}) => {
      this.set(width);
      this.setHeight(height);
    });
  }

  /** Sets the class directly, e.g. from an ancestor's class. */
  set(cls: WindowSizeClass) {
    if (this.measured && cls === this.value) {
      return;
    }
    const previous = this.measured ? this.value : null;
    this.measured = true;
    this.value = cls;
    this.options.onChange?.(cls, previous);
    this.host.requestUpdate();
  }

  /** Sets the height class directly, e.g. from an ancestor's class. */
  setHeight(cls: WindowHeightClass) {
    if (this.heightMeasured && cls === this.height) {
      return;
    }
    const previous = this.heightMeasured ? this.height : null;
    this.heightMeasured = true;
    this.height = cls;
    this.options.onHeightChange?.(cls, previous);
    this.host.requestUpdate();
  }
}
