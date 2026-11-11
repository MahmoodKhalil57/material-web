/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// spec-labels: motion-transitions/transition-patterns
/**
 * @fileoverview M3 transition patterns
 * (m3.material.io/styles/motion/transitions): container transform, forward and
 * backward (shared axis), lateral, top level (fade through), and enter and
 * exit. Skeleton loaders are `<md-gb-skeleton>` and the `md-skeleton` class.
 *
 * Each pattern runs as a View Transition when the browser has
 * `document.startViewTransition()`, and otherwise falls back to the Web
 * Animations API. Document View Transitions ignore `view-transition-name`
 * inside shadow roots, so elements in shadow DOM also use the fallback.
 * Timings come from the custom properties in `md-motion-transitions.css` (the M3 easing and duration tokens; adopt that
 * sheet in the document), with the token values as fallbacks.
 *
 * Spec (transitions, "Follows accessibility settings"): with reduced motion,
 * every pattern becomes a quick fade, with no sliding, scaling or shape
 * morphing.
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {
  SCROLL_THRESHOLD,
  type ScrollStep,
  stepScroll,
} from '../../../foundations/interaction/gestures/scroll-behavior.js';

/** Changes the DOM from the old state to the new one. */
export type TransitionUpdate = () => void | Promise<void>;

/** Options shared by every transition. */
export interface TransitionOptions {
  /**
   * Use reduced motion (a quick fade). Defaults to the
   * `prefers-reduced-motion: reduce` media query.
   */
  reducedMotion?: boolean;
  /**
   * Use the View Transitions API when the browser supports it. Set to false to
   * use the Web Animations fallback. Defaults to true.
   */
  viewTransition?: boolean;
  /** Overrides the pattern's duration, in milliseconds. */
  duration?: number;
  /** Overrides the pattern's easing (a CSS easing function). */
  easing?: string;
}

/** Options for transitions that swap the content of one region. */
export interface ScopedTransitionOptions extends TransitionOptions {
  /**
   * The element whose content `update` changes. Only it animates; the rest of
   * the page stays still. Defaults to the whole page.
   */
  scope?: Element;
}

/** Direction of a forward and backward (shared axis) transition. */
export type SharedAxisDirection = 'forward' | 'backward';

/**
 * Axis of a shared axis transition. M3's forward and backward pattern slides
 * horizontally (`x`); `y` and `z` are the other MDC shared axis variants.
 */
export type SharedAxis = 'x' | 'y' | 'z';

/** Options for `sharedAxis()`. */
export interface SharedAxisOptions extends ScopedTransitionOptions {
  /** Defaults to `x`. */
  axis?: SharedAxis;
}

/** Direction of a lateral transition: to the next or previous peer. */
export type LateralDirection = 'next' | 'previous';

/** Options for `containerTransform()`. */
export interface ContainerTransformOptions extends TransitionOptions {
  /** Changes the DOM so that the `to` element exists or is shown. */
  update?: TransitionUpdate;
  /**
   * `enter` expands into more detail, `return` collapses back. Defaults to
   * `enter` when the end bounds are larger than the start bounds.
   */
  direction?: 'enter' | 'return';
}

/** Where an entering component comes from. */
export type TransitionOrigin = 'top' | 'bottom' | 'start' | 'end' | 'center';

/**
 * How a component enters and exits:
 * - `expand`: within screen bounds, expands and collapses along an axis away
 *   from `origin` (spec: the Android style).
 * - `scale`: within screen bounds, scales in and fades out (spec: the iOS
 *   style).
 * - `slide`: beyond screen bounds, slides on and off from the `origin` edge.
 */
export type EnterExitStyle = 'expand' | 'scale' | 'slide';

/** Options for `enter()` and `exit()`. */
export interface EnterExitOptions {
  /** Defaults to `top` (`bottom` for `slide`). */
  origin?: TransitionOrigin;
  /** Defaults to `expand`. */
  style?: EnterExitStyle;
  /**
   * The component exits temporarily and can come back (a drawer), so the exit
   * uses Emphasized easing instead of Emphasized accelerate.
   */
  temporary?: boolean;
  /** Defaults to the `prefers-reduced-motion: reduce` media query. */
  reducedMotion?: boolean;
}

/** Enter and exit CSS classes from `md-motion-transitions.css`. */
export const TRANSITION_CLASSES = {
  enter: 'md-transition-enter',
  exit: 'md-transition-exit',
  fromTop: 'md-transition-from-top',
  fromBottom: 'md-transition-from-bottom',
  fromStart: 'md-transition-from-start',
  fromEnd: 'md-transition-from-end',
  fromCenter: 'md-transition-from-center',
  scale: 'md-transition-scale',
  slide: 'md-transition-slide',
  temporary: 'md-transition-temporary',
  reduced: 'md-transition-reduced',
} as const;

/** Skeleton loader CSS classes from `md-motion-transitions.css`. */
export const SKELETON_CLASSES = {
  skeleton: 'md-skeleton',
  text: 'md-skeleton-text',
  circle: 'md-skeleton-circle',
} as const;

/** View transition names used by the patterns. */
export const VIEW_TRANSITION_NAMES = {
  containerTransform: 'md-container-transform',
  scope: 'md-transition-scope',
} as const;

/** `data-md-transition` values set on `<html>` while a pattern runs. */
export type TransitionPattern =
  'container-transform' | 'shared-axis' | 'lateral' | 'fade-through';

/**
 * MDC-Android FadeThroughProvider PROGRESS_THRESHOLD: the outgoing content
 * fades out over the first 35% of the transition and the incoming content
 * fades in over the rest, so they never overlap (spec: "Fully fade out content
 * before fading new content in").
 */
export const FADE_THROUGH_THRESHOLD = 0.35;

/** MDC-Android MaterialFadeThrough: the incoming content scales from 92%. */
export const FADE_THROUGH_START_SCALE = 0.92;

/**
 * MDC-Android MaterialSharedAxis Z: the incoming content scales from 80% going
 * forward and from 110% going backward.
 */
export const SHARED_AXIS_Z_SCALES = {small: 0.8, large: 1.1} as const;

/**
 * MDC-Android MaterialContainerTransform default fade thresholds (fraction of
 * the transition): the content fades through early while expanding and late
 * while collapsing, during the fastest part of the motion (spec: "keep it
 * quick and hide it during the fastest part of the transition").
 */
export const CONTAINER_TRANSFORM_FADE = {
  enter: [0, 0.25],
  return: [0.6, 0.9],
} as const;

/**
 * Token values used when `md-motion-transitions.css` is not adopted
 * (`material-design-expressive/tokens/versions/latest/sass/_md-sys-motion.scss`).
 */
const FALLBACK = {
  'container-transform': {
    duration: 500,
    easing: 'cubic-bezier(0.2, 0, 0, 1)',
  },
  'shared-axis': {duration: 450, easing: 'cubic-bezier(0.2, 0, 0, 1)'},
  'fade-through': {duration: 450, easing: 'cubic-bezier(0.2, 0, 0, 1)'},
  lateral: {duration: 500, easing: 'cubic-bezier(0.2, 0, 0, 1)'},
  reduced: {duration: 200, easing: 'cubic-bezier(0.2, 0, 0, 1)'},
  enter: {duration: 400, easing: 'cubic-bezier(0.05, 0.7, 0.1, 1)'},
  exit: {duration: 200, easing: 'cubic-bezier(0.3, 0, 0.8, 0.15)'},
} as const;

type TimingName = keyof typeof FALLBACK;

const SHARED_AXIS_DISTANCE_PX = 30;

/** True when the user asked for reduced motion. */
export function prefersReducedMotion(): boolean {
  return (
    typeof matchMedia === 'function' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** True when the browser has the View Transitions API. */
export function supportsViewTransitions(): boolean {
  return (
    typeof document !== 'undefined' &&
    typeof (document as Partial<Document>).startViewTransition === 'function'
  );
}

/** Parses a CSS time (`450ms`, `0.45s`) to milliseconds. */
export function parseTime(value: string): number | undefined {
  const match = value.trim().match(/^(-?[\d.]+)(ms|s)$/);
  if (!match) return undefined;
  const n = Number(match[1]);
  return match[2] === 's' ? n * 1000 : n;
}

/** Duration (ms) and easing of a pattern, from its custom properties. */
export function transitionTiming(
  name: TimingName,
  element: Element = document.documentElement,
  overrides: Pick<TransitionOptions, 'duration' | 'easing'> = {},
): {duration: number; easing: string} {
  const style = getComputedStyle(element);
  const duration =
    overrides.duration ??
    parseTime(style.getPropertyValue(`--md-transition-${name}-duration`)) ??
    FALLBACK[name].duration;
  const easing =
    overrides.easing ??
    (style.getPropertyValue(`--md-transition-${name}-easing`).trim() ||
      FALLBACK[name].easing);
  return {duration, easing};
}

function sharedAxisDistance(element: Element): number {
  const value = parseFloat(
    getComputedStyle(element).getPropertyValue(
      '--md-transition-shared-axis-distance',
    ),
  );
  return Number.isFinite(value) ? value : SHARED_AXIS_DISTANCE_PX;
}

function isRtl(element: Element): boolean {
  return getComputedStyle(element).direction === 'rtl';
}

function isReduced(options: {reducedMotion?: boolean}): boolean {
  return options.reducedMotion ?? prefersReducedMotion();
}

/**
 * A document View Transition only captures elements named in the document
 * tree: a `view-transition-name` inside a shadow root is ignored, so elements
 * in shadow DOM use the Web Animations fallback.
 */
function useViewTransition(
  options: TransitionOptions,
  elements: Array<unknown>,
): boolean {
  return (
    options.viewTransition !== false &&
    supportsViewTransitions() &&
    elements.every(
      (el) => !(el instanceof Element) || el.getRootNode() === document,
    )
  );
}

/** Resolves when every animation has finished or been cancelled. */
async function allFinished(animations: Animation[]): Promise<void> {
  await Promise.all(animations.map((a) => a.finished.catch(() => {})));
}

/** A pair of keyframe lists: the outgoing and the incoming content. */
export interface Choreography {
  out: Keyframe[];
  in: Keyframe[];
}

/** Fade the outgoing content out, then the incoming in (no overlap). */
function fadeThroughChoreography(
  outExtra: [Keyframe, Keyframe] = [{}, {}],
  inExtra: [Keyframe, Keyframe] = [{}, {}],
): Choreography {
  const t = FADE_THROUGH_THRESHOLD;
  return {
    out: [
      {opacity: 1, ...outExtra[0], offset: 0},
      {opacity: 0, offset: t},
      {opacity: 0, ...outExtra[1], offset: 1},
    ],
    in: [
      {opacity: 0, ...inExtra[0], offset: 0},
      {opacity: 0, offset: t},
      {opacity: 1, ...inExtra[1], offset: 1},
    ],
  };
}

/** Keyframes for a forward and backward (shared axis) transition. */
export function sharedAxisKeyframes(
  direction: SharedAxisDirection,
  {axis = 'x', distance = SHARED_AXIS_DISTANCE_PX, rtl = false} = {},
): Choreography {
  const forward = direction === 'forward';
  if (axis === 'z') {
    // MDC ScaleProvider: forward grows (in 0.8 -> 1, out 1 -> 1.1); backward
    // shrinks (in 1.1 -> 1, out 1 -> 0.8).
    const {small, large} = SHARED_AXIS_Z_SCALES;
    return fadeThroughChoreography(
      [{scale: '1'}, {scale: String(forward ? large : small)}],
      [{scale: String(forward ? small : large)}, {scale: '1'}],
    );
  }
  // MDC SlideDistanceProvider: the incoming content slides in from `distance`
  // ahead (end / bottom going forward) while the outgoing slides the same
  // distance away.
  let d = forward ? distance : -distance;
  if (axis === 'x' && rtl) d = -d;
  const at = (v: number) => (axis === 'x' ? `${v}px 0` : `0 ${v}px`);
  return fadeThroughChoreography(
    [{translate: at(0)}, {translate: at(-d)}],
    [{translate: at(d)}, {translate: at(0)}],
  );
}

/**
 * Keyframes for a lateral transition: both pages slide the full width in
 * unison, with no fade (spec: "it does not use a fade or parallax effect.
 * Instead elements are grouped and slide in unison").
 */
export function lateralKeyframes(
  direction: LateralDirection,
  {rtl = false} = {},
): Choreography {
  let sign = direction === 'next' ? 1 : -1;
  if (rtl) sign = -sign;
  return {
    out: [{translate: '0 0'}, {translate: `${-100 * sign}% 0`}],
    in: [{translate: `${100 * sign}% 0`}, {translate: '0 0'}],
  };
}

/**
 * Keyframes for a top level (fade through) transition. Spec: "The exiting
 * screen quickly fades out and then the entering screen fades in."
 */
export function fadeThroughKeyframes(): Choreography {
  return fadeThroughChoreography(
    [{}, {}],
    [{scale: String(FADE_THROUGH_START_SCALE)}, {scale: '1'}],
  );
}

/** Keyframes for the reduced motion version of every pattern. */
export function reducedKeyframes(): Choreography {
  return fadeThroughChoreography();
}

let transitionId = 0;

/** Marks `<html>` while a pattern runs, for the CSS in this directory. */
function markRoot(pattern: TransitionPattern, reduced: boolean): () => void {
  const root = document.documentElement;
  const id = String(++transitionId);
  root.dataset['mdTransition'] = pattern;
  root.dataset['mdTransitionId'] = id;
  root.toggleAttribute('data-md-transition-reduced', reduced);
  return () => {
    if (root.dataset['mdTransitionId'] !== id) return;
    delete root.dataset['mdTransition'];
    delete root.dataset['mdTransitionId'];
    root.removeAttribute('data-md-transition-reduced');
  };
}

/** Sets an inline `view-transition-name`, returning a function to restore it. */
function nameElement(element: Element, name: string): () => void {
  const style = (element as HTMLElement).style;
  const previous = style.getPropertyValue('view-transition-name');
  style.setProperty('view-transition-name', name);
  return () => {
    if (previous) {
      style.setProperty('view-transition-name', previous);
    } else {
      style.removeProperty('view-transition-name');
    }
  };
}

/**
 * Runs `update` in a View Transition and animates the old and new snapshots
 * of `name` with `choreography`.
 */
async function viewTransition(
  update: TransitionUpdate,
  name: string,
  choreography: Choreography,
  timing: {duration: number; easing: string},
  beforeUpdate?: () => void,
): Promise<void> {
  const transition = document.startViewTransition(async () => {
    beforeUpdate?.();
    await update();
  });
  try {
    await transition.ready;
  } catch {
    // Skipped (hidden document, another transition started): the DOM is
    // updated without animation.
    await transition.updateCallbackDone;
    return;
  }
  const root = document.documentElement;
  const animations = [
    root.animate(choreography.out, {
      ...timing,
      pseudoElement: `::view-transition-old(${name})`,
    }),
    root.animate(choreography.in, {
      ...timing,
      fill: 'backwards',
      pseudoElement: `::view-transition-new(${name})`,
    }),
  ];
  await Promise.all([transition.finished, allFinished(animations)]);
}

/** A copy of `element`, positioned over it, that does not take input. */
function createGhost(element: Element, rect: DOMRect): HTMLElement {
  const ghost = element.cloneNode(true) as HTMLElement;
  ghost.removeAttribute('id');
  ghost.setAttribute('aria-hidden', 'true');
  ghost.inert = true;
  Object.assign(ghost.style, {
    position: 'fixed',
    margin: '0',
    boxSizing: 'border-box',
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    pointerEvents: 'none',
    zIndex: '2147483647',
  });
  ghost.style.removeProperty('view-transition-name');
  return ghost;
}

/** Where to put fixed-position copies so they keep their shadow styles. */
function overlayParent(element: Element): Node {
  const root = element.getRootNode();
  return root instanceof ShadowRoot ? root : document.body;
}

/**
 * Web Animations fallback for the scoped patterns: a copy of the old content
 * plays the outgoing keyframes over the live element, which plays the
 * incoming keyframes.
 */
async function animateScope(
  update: TransitionUpdate,
  scope: Element,
  choreography: Choreography,
  timing: {duration: number; easing: string},
): Promise<void> {
  const page = scope === document.documentElement || scope === document.body;
  const rect = scope.getBoundingClientRect();
  // The page itself can't be copied over itself, so only the new content
  // animates in.
  const ghost = page ? null : createGhost(scope, rect);
  await update();
  const animations: Animation[] = [];
  if (ghost) {
    scope.parentNode?.insertBefore(ghost, scope.nextSibling);
    // The outgoing copy is clipped to the scope's bounds, like the View
    // Transition group.
    ghost.style.overflow = 'clip';
    animations.push(
      ghost.animate(choreography.out, {...timing, fill: 'forwards'}),
    );
  }
  const target = page ? document.body : scope;
  animations.push(
    target.animate(choreography.in, {...timing, fill: 'backwards'}),
  );
  try {
    await allFinished(animations);
  } finally {
    ghost?.remove();
  }
}

async function scopedTransition(
  pattern: Exclude<TransitionPattern, 'container-transform'>,
  timingName: TimingName,
  update: TransitionUpdate,
  options: ScopedTransitionOptions,
  choreograph: (scope: Element) => Choreography,
): Promise<void> {
  const scope = options.scope ?? document.documentElement;
  const reduced = isReduced(options);
  const timing = transitionTiming(
    reduced ? 'reduced' : timingName,
    scope,
    options,
  );
  const choreography = reduced ? reducedKeyframes() : choreograph(scope);

  if (!useViewTransition(options, [scope])) {
    await animateScope(update, scope, choreography, timing);
    return;
  }

  const unmark = markRoot(pattern, reduced);
  const isPage = scope === document.documentElement;
  const name = isPage ? 'root' : VIEW_TRANSITION_NAMES.scope;
  const unname = isPage ? () => {} : nameElement(scope, name);
  try {
    await viewTransition(update, name, choreography, timing);
  } finally {
    unname();
    unmark();
  }
}

/**
 * Forward and backward: navigates between screens at consecutive levels of
 * hierarchy, like an inbox and a message thread. The screens slide
 * horizontally as they fade through (spec: "Android uses a fade as screens
 * slide").
 *
 * @param direction `forward` to go deeper, `backward` to go back.
 * @param update Changes the DOM to the new screen.
 */
export function sharedAxis(
  direction: SharedAxisDirection,
  update: TransitionUpdate,
  options: SharedAxisOptions = {},
): Promise<void> {
  return scopedTransition(
    'shared-axis',
    'shared-axis',
    update,
    options,
    (scope) =>
      sharedAxisKeyframes(direction, {
        axis: options.axis,
        distance: sharedAxisDistance(scope),
        rtl: isRtl(scope),
      }),
  );
}

/**
 * Lateral: navigates between peers at the same level of hierarchy, like tabs
 * or the photos of an album. Both pages slide the full width in unison.
 *
 * @param direction `next` moves to the following peer (content slides toward
 *     the start), `previous` to the one before.
 * @param update Changes the DOM to the new peer.
 */
export function lateral(
  direction: LateralDirection,
  update: TransitionUpdate,
  options: ScopedTransitionOptions = {},
): Promise<void> {
  return scopedTransition('lateral', 'lateral', update, options, (scope) =>
    lateralKeyframes(direction, {rtl: isRtl(scope)}),
  );
}

/**
 * Top level: navigates between top-level destinations, like those of a
 * navigation bar, rail or drawer. The old screen quickly fades out, then the
 * new one fades in.
 *
 * @param update Changes the DOM to the new destination.
 */
export function fadeThrough(
  update: TransitionUpdate,
  options: ScopedTransitionOptions = {},
): Promise<void> {
  return scopedTransition('fade-through', 'fade-through', update, options, () =>
    fadeThroughKeyframes(),
  );
}

interface ContainerStyle {
  rect: DOMRect;
  radius: string;
  color: string;
}

function containerStyle(element: Element): ContainerStyle {
  const style = getComputedStyle(element);
  return {
    rect: element.getBoundingClientRect(),
    radius: [
      style.borderStartStartRadius || style.borderTopLeftRadius,
      style.borderStartEndRadius || style.borderTopRightRadius,
      style.borderEndEndRadius || style.borderBottomRightRadius,
      style.borderEndStartRadius || style.borderBottomLeftRadius,
    ].join(' '),
    color: style.backgroundColor,
  };
}

/** Physical border-radius shorthand from the four logical corners. */
function physicalRadius(radius: string, rtl: boolean): string {
  if (!rtl) return radius;
  const [ss, se, ee, es] = radius.split(' ');
  return [se, ss, es, ee].join(' ');
}

/** Opacity keyframes of a container transform's content fade through. */
export function containerTransformFadeKeyframes(
  direction: 'enter' | 'return',
): Choreography {
  const [start, end] = CONTAINER_TRANSFORM_FADE[direction];
  const mid = start + (end - start) * FADE_THROUGH_THRESHOLD;
  const dedupe = (frames: Array<{opacity: number; offset: number}>) =>
    frames.filter((f, i) => i === 0 || f.offset !== frames[i - 1].offset);
  return {
    out: dedupe([
      {opacity: 1, offset: 0},
      {opacity: 1, offset: start},
      {opacity: 0, offset: mid},
      {opacity: 0, offset: 1},
    ]),
    in: dedupe([
      {opacity: 0, offset: 0},
      {opacity: 0, offset: mid},
      {opacity: 1, offset: end},
      {opacity: 1, offset: 1},
    ]),
  };
}

function resolveElement(to: Element | (() => Element | null | undefined)) {
  return typeof to === 'function' ? to() : to;
}

/**
 * Container transform: an element (a card, list item, FAB, search box)
 * transforms into a new surface. The container's bounds, corner shape and
 * color morph from `from` to `to` while their content fades through.
 *
 * `from` and `to` can be the same element (an element that changes in place)
 * or different ones (a card and the details page it opens). Pass the opened
 * element as `from` and the card as `to` to collapse back.
 *
 * @param from The element at the start.
 * @param to The element at the end, or a function that returns it after
 *     `update` has run (for elements that `update` creates).
 * @param options `update` changes the DOM to the end state.
 */
export async function containerTransform(
  from: Element,
  to: Element | (() => Element | null | undefined),
  options: ContainerTransformOptions = {},
): Promise<void> {
  const update = options.update ?? (() => {});
  const reduced = isReduced(options);
  const timing = transitionTiming(
    reduced ? 'reduced' : 'container-transform',
    from,
    options,
  );
  const start = containerStyle(from);

  if (!useViewTransition(options, [from, to])) {
    await animateContainer(from, to, start, update, timing, reduced, options);
    return;
  }

  const unmark = markRoot('container-transform', reduced);
  const name = VIEW_TRANSITION_NAMES.containerTransform;
  let unname = nameElement(from, name);
  let end: ContainerStyle | undefined;
  let rtl = false;
  const transition = document.startViewTransition(async () => {
    unname();
    await update();
    const target = resolveElement(to);
    if (!target) return;
    unname = nameElement(target, name);
    end = containerStyle(target);
    rtl = isRtl(target);
  });
  try {
    try {
      await transition.ready;
    } catch {
      await transition.updateCallbackDone;
      return;
    }
    if (!end) {
      await transition.finished;
      return;
    }
    const direction = options.direction ?? directionOf(start, end);
    const fade = reduced
      ? reducedKeyframes()
      : containerTransformFadeKeyframes(direction);
    const root = document.documentElement;
    const animations = [
      root.animate(fade.out, {
        ...timing,
        pseudoElement: `::view-transition-old(${name})`,
      }),
      root.animate(fade.in, {
        ...timing,
        fill: 'backwards',
        pseudoElement: `::view-transition-new(${name})`,
      }),
    ];
    if (!reduced) {
      animations.push(
        root.animate(
          [
            {
              borderRadius: physicalRadius(start.radius, rtl),
              backgroundColor: start.color,
            },
            {
              borderRadius: physicalRadius(end.radius, rtl),
              backgroundColor: end.color,
            },
          ],
          {...timing, pseudoElement: `::view-transition-group(${name})`},
        ),
      );
    }
    await Promise.all([transition.finished, allFinished(animations)]);
  } finally {
    unname();
    unmark();
  }
}

function directionOf(start: ContainerStyle, end: ContainerStyle) {
  const area = (r: DOMRect) => r.width * r.height;
  return area(end.rect) >= area(start.rect) ? 'enter' : 'return';
}

/**
 * Web Animations fallback for the container transform: a fixed container
 * morphs between the two bounds over the page, holding copies of the start
 * and end content scaled to its width, which fade through.
 */
async function animateContainer(
  from: Element,
  to: Element | (() => Element | null | undefined),
  start: ContainerStyle,
  update: TransitionUpdate,
  timing: {duration: number; easing: string},
  reduced: boolean,
  options: ContainerTransformOptions,
): Promise<void> {
  const fromCopy = from.cloneNode(true) as HTMLElement;
  await update();
  const target = resolveElement(to);
  if (!target) return;
  const end = containerStyle(target);
  const rtl = isRtl(target);
  const direction = options.direction ?? directionOf(start, end);
  const fade = reduced
    ? reducedKeyframes()
    : containerTransformFadeKeyframes(direction);

  const container = document.createElement('div');
  container.setAttribute('aria-hidden', 'true');
  container.inert = true;
  container.dataset['mdTransition'] = 'container-transform';
  Object.assign(container.style, {
    position: 'fixed',
    margin: '0',
    padding: '0',
    overflow: 'clip',
    pointerEvents: 'none',
    zIndex: '2147483647',
    left: `${end.rect.left}px`,
    top: `${end.rect.top}px`,
    width: `${end.rect.width}px`,
    height: `${end.rect.height}px`,
    borderRadius: physicalRadius(end.radius, rtl),
    backgroundColor: end.color,
  });
  const toCopy = target.cloneNode(true) as HTMLElement;
  const copies: Array<[HTMLElement, DOMRect]> = [
    [fromCopy, start.rect],
    [toCopy, end.rect],
  ];
  for (const [copy, rect] of copies) {
    copy.removeAttribute('id');
    copy.style.removeProperty('view-transition-name');
    Object.assign(copy.style, {
      position: 'absolute',
      left: '0',
      top: '0',
      margin: '0',
      boxSizing: 'border-box',
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      transformOrigin: '0 0',
    });
    container.append(copy);
  }

  const hidden = [from, target].map((el) => {
    const style = (el as HTMLElement).style;
    const previous = style.visibility;
    style.visibility = 'hidden';
    return () => {
      style.visibility = previous;
    };
  });
  overlayParent(target).appendChild(container);

  const s = start.rect;
  const e = end.rect;
  const animations: Animation[] = [];
  if (reduced) {
    // No bounds or shape morph: the content fades in place.
    Object.assign(container.style, {backgroundColor: 'transparent'});
    fromCopy.style.scale = String(e.width / (s.width || 1));
  } else {
    animations.push(
      container.animate(
        [
          {
            left: `${s.left}px`,
            top: `${s.top}px`,
            width: `${s.width}px`,
            height: `${s.height}px`,
            borderRadius: physicalRadius(start.radius, rtl),
            backgroundColor: start.color,
          },
          {
            left: `${e.left}px`,
            top: `${e.top}px`,
            width: `${e.width}px`,
            height: `${e.height}px`,
            borderRadius: physicalRadius(end.radius, rtl),
            backgroundColor: end.color,
          },
        ],
        timing,
      ),
      // The copies scale with the container's width (linear in the same
      // eased progress), like View Transition snapshots.
      fromCopy.animate(
        [{scale: '1'}, {scale: String(e.width / (s.width || 1))}],
        timing,
      ),
      toCopy.animate(
        [{scale: String(s.width / (e.width || 1))}, {scale: '1'}],
        timing,
      ),
    );
  }
  animations.push(
    fromCopy.animate(fade.out, {...timing, fill: 'forwards'}),
    toCopy.animate(fade.in, {...timing, fill: 'backwards'}),
  );
  try {
    await allFinished(animations);
  } finally {
    container.remove();
    for (const restore of hidden) restore();
  }
}

/** Classes for an entering or exiting component, for `classMap()`. */
export function enterExitClasses(
  state: 'enter' | 'exit' | 'none',
  {
    origin,
    style = 'expand',
    temporary = false,
    reducedMotion = false,
  }: EnterExitOptions = {},
): ClassInfo {
  const resolvedOrigin = origin ?? (style === 'slide' ? 'bottom' : 'top');
  const active = state !== 'none';
  const originClass = {
    top: TRANSITION_CLASSES.fromTop,
    bottom: TRANSITION_CLASSES.fromBottom,
    start: TRANSITION_CLASSES.fromStart,
    end: TRANSITION_CLASSES.fromEnd,
    center: TRANSITION_CLASSES.fromCenter,
  }[resolvedOrigin];
  return {
    [TRANSITION_CLASSES.enter]: state === 'enter',
    [TRANSITION_CLASSES.exit]: state === 'exit',
    [originClass]: active,
    [TRANSITION_CLASSES.scale]: active && style === 'scale',
    [TRANSITION_CLASSES.slide]: active && style === 'slide',
    [TRANSITION_CLASSES.temporary]: active && temporary,
    [TRANSITION_CLASSES.reduced]: active && reducedMotion,
  };
}

function applyEnterExit(
  element: Element,
  state: 'enter' | 'exit',
  options: EnterExitOptions,
): Promise<void> {
  // Without the option, the stylesheet's prefers-reduced-motion query applies.
  const classes = enterExitClasses(state, options);
  clearEnterExit(element);
  // Restart the CSS animation when the same state is applied twice.
  void (element as HTMLElement).offsetWidth;
  for (const [name, on] of Object.entries(classes)) {
    if (on) element.classList.add(name);
  }
  const animations = element
    .getAnimations()
    .filter(
      (a) =>
        a instanceof CSSAnimation &&
        a.animationName.startsWith('md-transition-'),
    );
  return allFinished(animations);
}

/**
 * Enter: introduces a component on screen (a menu, dialog, snackbar, or a
 * sheet sliding in). Shows the element (`hidden = false`) and resolves when
 * the enter animation ends.
 */
export function enter(
  element: Element,
  options: EnterExitOptions = {},
): Promise<void> {
  (element as HTMLElement).hidden = false;
  return applyEnterExit(element, 'enter', options);
}

/**
 * Exit: removes a component from the screen. Resolves when the exit animation
 * ends; the element stays invisible (the animation fills forwards) until the
 * caller hides or removes it, or calls `enter()` or `clearEnterExit()`.
 */
export function exit(
  element: Element,
  options: EnterExitOptions = {},
): Promise<void> {
  return applyEnterExit(element, 'exit', options);
}

/** Removes the enter and exit classes. */
export function clearEnterExit(element: Element) {
  element.classList.remove(...Object.values(TRANSITION_CLASSES));
}

/** Options of {@link scrollEnterExit}. */
export interface ScrollEnterExitOptions {
  /**
   * The scrolling element, or its id. Defaults to the window. An id that is
   * not found falls back to the window.
   */
  target?: Element | Window | string | null;
  /**
   * The screen edge the element slides toward when it hides. Defaults to
   * `top` (a top app bar). Use `bottom` for a navigation bar, `start` for a
   * rail.
   */
  origin?: Exclude<TransitionOrigin, 'center'>;
  /** Scroll distance (px) in one direction before it hides or reveals. */
  threshold?: number;
  /** An extra reason to keep the element visible. */
  keepVisible?: () => boolean;
  /** Called when the element starts to hide or reveal. */
  onChange?: (hidden: boolean) => void;
  /** Defaults to the `prefers-reduced-motion: reduce` media query. */
  reducedMotion?: boolean;
}

/** Controls a {@link scrollEnterExit} element. */
export interface ScrollEnterExitHandle {
  /** Whether the element is hidden by scrolling. */
  readonly hidden: boolean;
  /** Reveals the element with the enter motion. */
  show(): Promise<void>;
  /** Hides the element with the exit motion. */
  hide(): Promise<void>;
  /** Stops listening and reveals the element without motion. */
  destroy(): void;
}

/**
 * Enter and exit beyond the screen bounds, driven by a scroll gesture
 * (spec: "Components can enter and exit from beyond the screen bounds based on
 * a scroll gesture"). Scrolling down slides the element off its edge with the
 * exit motion; scrolling up, or reaching the top, slides it back with the
 * enter motion. The element should be sticky or fixed at that edge.
 *
 * The scroll rules are those of the app bar and navigation bar
 * (`stepScroll()`), so every scroll-hiding bar behaves alike. The element
 * never hides while focus is inside it, and reveals when focus moves into it,
 * so focus is not obscured. A hidden element is `inert` (nothing off screen
 * takes focus). With reduced motion, sliding becomes a quick fade.
 */
export function scrollEnterExit(
  element: HTMLElement,
  options: ScrollEnterExitOptions = {},
): ScrollEnterExitHandle {
  const {origin = 'top', threshold = SCROLL_THRESHOLD} = options;
  const motion: EnterExitOptions = {
    style: 'slide',
    origin,
    temporary: true,
    reducedMotion: options.reducedMotion,
  };
  let step: ScrollStep = {y: 0, hidden: false, travel: 0};
  let focusInside = false;
  let destroyed = false;

  const target = options.target;
  const source: Element | Window =
    typeof target === 'string'
      ? ((
          element.getRootNode() as Document | ShadowRoot
        ).getElementById?.(target) ??
        document.getElementById(target) ??
        window)
      : (target ?? window);
  const position = () =>
    source instanceof Element
      ? source.scrollTop
      : window.scrollY || document.documentElement.scrollTop || 0;

  const apply = (hidden: boolean): Promise<void> => {
    step = {...step, hidden, travel: 0};
    options.onChange?.(hidden);
    element.inert = hidden;
    return hidden ? exit(element, motion) : enter(element, motion);
  };

  const onScroll = () => {
    const canHide = !(focusInside || options.keepVisible?.());
    const next = stepScroll(step, position(), canHide, threshold);
    const changed = next.hidden !== step.hidden;
    step = next;
    if (changed) {
      void apply(next.hidden);
    }
  };
  const onFocusIn = () => {
    focusInside = true;
    if (step.hidden) void apply(false);
  };
  const onFocusOut = (event: FocusEvent) => {
    const next = event.relatedTarget as Node | null;
    focusInside = Boolean(next && element.contains(next));
  };

  step = {...step, y: position()};
  source.addEventListener('scroll', onScroll, {passive: true});
  element.addEventListener('focusin', onFocusIn);
  element.addEventListener('focusout', onFocusOut);

  return {
    get hidden() {
      return step.hidden;
    },
    show: () => (step.hidden ? apply(false) : Promise.resolve()),
    hide: () => (step.hidden ? Promise.resolve() : apply(true)),
    destroy() {
      if (destroyed) return;
      destroyed = true;
      source.removeEventListener('scroll', onScroll);
      element.removeEventListener('focusin', onFocusIn);
      element.removeEventListener('focusout', onFocusOut);
      element.inert = false;
      clearEnterExit(element);
      step = {...step, hidden: false};
    },
  };
}

/** Options of {@link coplanar}. */
export interface CoplanarOptions {
  /**
   * The axis the element grows along: `inline` (a side sheet) or `block` (a
   * panel above or below the content). Defaults to `inline`.
   */
  axis?: 'inline' | 'block';
  /** Overrides the enter or exit duration (ms). */
  duration?: number;
  /** Overrides the enter or exit easing. */
  easing?: string;
  /** Defaults to the `prefers-reduced-motion: reduce` media query. */
  reducedMotion?: boolean;
}

const coplanarRuns = new WeakMap<Element, Animation>();
const coplanarOverflow = new WeakMap<Element, string>();

/**
 * Enter and exit of a coplanar component: one that sits at the same elevation
 * as the main content, so the content shrinks while it opens and grows back
 * while it closes (spec: "Coplanar sheets shrink the available area for
 * content"). The element grows from zero to its natural size along `axis`
 * with the enter motion and shrinks back with the exit motion, so a flex or
 * grid sibling resizes with it frame by frame. The element is clipped while
 * it moves.
 *
 * Opening shows the element (`hidden = false`); closing sets `hidden = true`
 * when the motion ends, so it takes no space. With reduced motion the size
 * changes at once and only an opacity fade plays. A call while another is
 * running replaces it; the replaced call resolves at once.
 *
 * `md-gb-side-sheet` does this itself (its host width follows `open`); use
 * this for other panels.
 */
export async function coplanar(
  element: HTMLElement,
  open: boolean,
  options: CoplanarOptions = {},
): Promise<void> {
  if (coplanarRuns.has(element)) {
    coplanarRuns.get(element)!.cancel();
  } else {
    coplanarOverflow.set(element, element.style.overflow);
  }
  const block = options.axis === 'block';
  const reduced = isReduced(options);
  const timing = transitionTiming(
    reduced ? 'reduced' : open ? 'enter' : 'exit',
    element,
    options,
  );
  if (open) {
    element.hidden = false;
  }
  // Measure the natural size (a cancelled run no longer holds it at zero).
  const rect = element.getBoundingClientRect();
  const size = `${block ? rect.height : rect.width}px`;
  const property = block ? 'blockSize' : 'inlineSize';
  const frames: Keyframe[] = reduced
    ? open
      ? [{opacity: 0}, {opacity: 1}]
      : [{opacity: 1}, {opacity: 0}]
    : open
      ? [{[property]: '0px'}, {[property]: size}]
      : [{[property]: size}, {[property]: '0px'}];
  element.style.overflow = 'clip';
  const animation = element.animate(frames, {
    ...timing,
    // Closing holds the end state until `hidden` takes over.
    fill: open ? 'none' : 'forwards',
  });
  coplanarRuns.set(element, animation);
  try {
    await animation.finished;
  } catch {
    return; // Replaced by a newer call.
  }
  coplanarRuns.delete(element);
  element.style.overflow = coplanarOverflow.get(element) ?? '';
  if (!open) {
    element.hidden = true;
    animation.cancel();
  }
}
