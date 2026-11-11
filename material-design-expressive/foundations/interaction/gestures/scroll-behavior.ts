/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ReactiveController, type ReactiveControllerHost} from 'lit';
import {isReducedMotion} from '../../../styles/motion/motion.js';
import {perfEnd, perfStart} from '../../../components/shared/perf.js';

/**
 * Shared scroll behavior of bars: a bar watches a scroll target and hides,
 * reveals, or compresses with it.
 *
 * - `hide`: scrolling down hides the bar (it slides beyond the screen edge),
 *   scrolling up reveals it, and reaching the top shows it. Used by the app
 *   bar, navigation bar, tabs, and docked and floating toolbars.
 * - `compress`: a medium or large flexible app bar turns into a small one as
 *   soon as the target is scrolled, and stays small until the target is back
 *   at the top (scrolling up does not expand it again).
 *
 * The scroll target is an element id (`scroll-target`) or, by default, the
 * window. Hide and reveal move the host with a transform that uses the
 * spatial spring tokens, so the motion scheme and reduced motion (spatial
 * motion off, the bar jumps) apply without the component knowing about them.
 * The host should be sticky or fixed at the screen edge it hides toward.
 *
 * The bar never hides while it would hurt someone:
 * - focus is inside it (and focus moving into a hidden bar reveals it), so
 *   focus is never lost or obscured (WCAG 2.4.11 Focus Not Obscured);
 * - optionally (`keyboardKeepsVisible`) while the page scrolls because of a
 *   key press. The web cannot tell whether a screen reader is on, but screen
 *   reader and switch users move through the page with the keyboard, so
 *   hiding only on wheel, touch, pointer or programmatic scrolling is the
 *   closest signal.
 *
 * Spec: app-bars ("hide and reappear when scrolling", "medium and large
 * flexible ... transform into small ... remain small until the page is
 * scrolled back to the top"), navigation-bar ("scrolling downward can hide the
 * navigation bar; scrolling upward reveals it", "Don't hide ... when a screen
 * reader is active"), tabs ("scroll offscreen ... reappear when the page is
 * scrolled up", "move as a single unit"), toolbars ("animate offscreen"),
 * motion transitions ("enter and exit ... beyond the screen bounds based on a
 * scroll gesture").
 */

/** The scroll behaviors. */
export type ScrollBehaviorKind = 'hide' | 'compress';

/** Attribute reflecting that the host is hidden by scrolling. */
export const SCROLL_HIDDEN_ATTRIBUTE = 'scroll-hidden';

/** Scroll distance (px) in one direction before the bar hides or reveals. */
export const SCROLL_THRESHOLD = 8;

/** How long (ms) after a scroll key a scroll still counts as keyboard scroll. */
export const KEYBOARD_SCROLL_WINDOW = 500;

const SCROLL_KEYS = new Set([
  'ArrowUp',
  'ArrowDown',
  'PageUp',
  'PageDown',
  'Home',
  'End',
  ' ',
]);

/** Parses a `scroll-behavior` attribute value. */
export function parseScrollBehavior(
  value: string | null | undefined,
): ScrollBehaviorKind | null {
  return value === 'hide' || value === 'compress' ? value : null;
}

/** The state {@link stepScroll} advances. */
export interface ScrollStep {
  /** The scroll position of the last step. */
  y: number;
  /** Whether the bar is hidden. */
  hidden: boolean;
  /** The distance scrolled in the current direction (negative: up). */
  travel: number;
}

/**
 * Advances the hide state for a new scroll position. Pure, so the rules are
 * testable without scrolling: the bar shows at the top and when scrolled up
 * by `threshold`, and hides when scrolled down by `threshold` past the top,
 * unless `canHide` is false (the bar then only reveals).
 */
export function stepScroll(
  prev: ScrollStep,
  y: number,
  canHide = true,
  threshold = SCROLL_THRESHOLD,
): ScrollStep {
  const dy = y - prev.y;
  let travel = prev.travel;
  if (dy !== 0) {
    travel = Math.sign(dy) === Math.sign(travel) ? travel + dy : dy;
  }
  let hidden = prev.hidden;
  if (y <= 0 || travel <= -threshold) {
    hidden = false;
  } else if (travel >= threshold && canHide) {
    hidden = true;
  }
  if (y <= 0) {
    travel = 0;
  }
  return {y, hidden, travel};
}

/** Options of {@link ScrollBehaviorController}. */
export interface ScrollBehaviorOptions {
  /** The behavior (`hide`, `compress`), or null for none. */
  behavior: () => string | null | undefined;
  /** The id of the scrolling element; the window when empty or not found. */
  target: () => string | null | undefined;
  /**
   * The transform that moves the hidden host beyond its screen edge.
   * Default `translateY(-100%)` (top bars).
   */
  hiddenTransform?: string;
  /**
   * Keep the bar visible while the page scrolls because of a key press (a
   * keyboard or screen reader user scrolling). Default false.
   */
  keyboardKeepsVisible?: boolean;
  /** An extra reason to keep the bar visible. */
  keepVisible?: () => boolean;
  /** Called when the target's scrolled state (scroll position above the top) changes. */
  onScrolledChange?: (scrolled: boolean) => void;
}

/** Hides, reveals or compresses the host with a scroll target. */
export class ScrollBehaviorController implements ReactiveController {
  private readonly host: ReactiveControllerHost & HTMLElement;
  private readonly options: ScrollBehaviorOptions;
  private source: Element | Window | null = null;
  private sourceId: string | null | undefined;
  private step: ScrollStep = {y: 0, hidden: false, travel: 0};
  private lastKeyAt = -Infinity;
  private reportedScrolled = false;
  private focusInside = false;

  constructor(
    host: ReactiveControllerHost & HTMLElement,
    options: ScrollBehaviorOptions,
  ) {
    this.host = host;
    this.options = options;
    host.addController(this);
  }

  /** Whether the host is hidden by scrolling. */
  get hidden() {
    return this.step.hidden;
  }

  /** Whether the target is scrolled away from the top. */
  get scrolled() {
    return this.reportedScrolled;
  }

  /** Reveals the host. */
  show() {
    this.setHidden(false);
    this.step = {...this.step, hidden: false, travel: 0};
  }

  hostConnected() {
    document.addEventListener('keydown', this.onKeydown, true);
    for (const type of ['wheel', 'touchstart', 'pointerdown']) {
      document.addEventListener(type, this.onPointer, {
        capture: true,
        passive: true,
      });
    }
    this.host.addEventListener('focusin', this.onFocusIn);
    this.host.addEventListener('focusout', this.onFocusOut);
    this.attach();
  }

  hostUpdated() {
    if (
      !this.source ||
      this.options.target() !== this.sourceId ||
      (this.source instanceof Element && !this.source.isConnected)
    ) {
      this.attach();
    }
    if (this.options.behavior() !== 'hide' && this.step.hidden) {
      this.show();
    }
  }

  hostDisconnected() {
    document.removeEventListener('keydown', this.onKeydown, true);
    for (const type of ['wheel', 'touchstart', 'pointerdown']) {
      document.removeEventListener(type, this.onPointer, true);
    }
    this.host.removeEventListener('focusin', this.onFocusIn);
    this.host.removeEventListener('focusout', this.onFocusOut);
    this.detach();
    this.host.style.removeProperty('transform');
    this.host.removeAttribute(SCROLL_HIDDEN_ATTRIBUTE);
    this.step = {y: 0, hidden: false, travel: 0};
  }

  private attach() {
    this.detach();
    this.sourceId = this.options.target();
    const root = this.host.getRootNode() as Document | ShadowRoot;
    const element = this.sourceId
      ? (root.getElementById?.(this.sourceId) ??
        document.getElementById(this.sourceId))
      : null;
    if (this.sourceId && !element) {
      // The target does not exist (yet): follow the window meanwhile.
      this.source = window;
    } else {
      this.source = element ?? window;
    }
    this.source.addEventListener('scroll', this.onScroll, {passive: true});
    this.step = {y: this.position(), hidden: this.step.hidden, travel: 0};
    this.reportScrolled();
  }

  private detach() {
    this.source?.removeEventListener('scroll', this.onScroll);
    this.source = null;
  }

  private position() {
    const source = this.source;
    if (source instanceof Element) {
      return source.scrollTop;
    }
    return window.scrollY || document.documentElement.scrollTop || 0;
  }

  private get keyboardScrolling() {
    return (
      this.options.keyboardKeepsVisible === true &&
      performance.now() - this.lastKeyAt < KEYBOARD_SCROLL_WINDOW
    );
  }

  private get canHide() {
    return !(
      this.focusInside ||
      this.keyboardScrolling ||
      this.options.keepVisible?.()
    );
  }

  private readonly onKeydown = (event: KeyboardEvent) => {
    if (SCROLL_KEYS.has(event.key)) {
      this.lastKeyAt = performance.now();
    }
  };

  private readonly onPointer = () => {
    this.lastKeyAt = -Infinity;
  };

  private readonly onFocusIn = () => {
    this.focusInside = true;
    if (this.step.hidden) {
      this.show();
    }
  };

  private readonly onFocusOut = (event: FocusEvent) => {
    const next = event.relatedTarget as Node | null;
    this.focusInside = Boolean(next && this.host.contains(next));
  };

  private readonly onScroll = () => {
    const perf = perfStart();
    try {
      this.scrollStep();
    } finally {
      perfEnd('scroll.step', perf, {hidden: this.step.hidden});
    }
  };

  private scrollStep() {
    const y = this.position();
    this.reportScrolled(y);
    if (this.options.behavior() !== 'hide') {
      this.step = {...this.step, y};
      return;
    }
    const next = stepScroll(this.step, y, this.canHide);
    const changed = next.hidden !== this.step.hidden;
    this.step = next;
    if (changed) {
      this.setHidden(next.hidden);
    }
  }

  private reportScrolled(y = this.position()) {
    const scrolled = y > 0;
    if (scrolled !== this.reportedScrolled) {
      this.reportedScrolled = scrolled;
      this.options.onScrolledChange?.(scrolled);
    }
  }

  private setHidden(hidden: boolean) {
    const style = this.host.style;
    if (!style.transitionProperty) {
      // Spatial spring tokens: 0ms under reduced motion.
      style.transitionProperty = 'transform';
      style.transitionDuration =
        'var(--md-sys-motion-spring-default-spatial-duration, 420ms)';
      style.transitionTimingFunction =
        'var(--md-sys-motion-spring-default-spatial, ease)';
    }
    if (hidden) {
      style.transform = this.options.hiddenTransform ?? 'translateY(-100%)';
      this.host.setAttribute(SCROLL_HIDDEN_ATTRIBUTE, '');
    } else {
      style.removeProperty('transform');
      this.host.removeAttribute(SCROLL_HIDDEN_ATTRIBUTE);
    }
    // The duration token is 0ms under reduced motion; cover hosts where the
    // tokens are not loaded too.
    style.transitionDuration = isReducedMotion(this.host)
      ? '0ms'
      : 'var(--md-sys-motion-spring-default-spatial-duration, 420ms)';
    this.host.dispatchEvent(
      new CustomEvent('scrollhiddenchange', {detail: {hidden}}),
    );
  }
}
