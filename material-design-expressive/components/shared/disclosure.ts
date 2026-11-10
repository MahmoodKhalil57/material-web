/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ReactiveController, type ReactiveControllerHost} from 'lit';

/**
 * Shared expand/collapse (disclosure) behavior: list item expand, FAB menu
 * open/close, extended FAB `expanded`, floating toolbar collapse, and any
 * trigger that shows or hides a region.
 *
 * - The trigger carries `aria-expanded` (when it controls a region) and
 *   `aria-controls` pointing at the region.
 * - A collapsed region is `inert` (or `hidden`), so it takes no focus and is
 *   skipped by assistive technology; the region stays in the layout so CSS
 *   can animate it.
 * - Enter and Space on the trigger toggle it (native buttons through their
 *   click; custom `role="button"` triggers through the keyboard).
 * - A user toggle first fires a cancelable `toggle` event (a `ToggleEvent`
 *   with `oldState` / `newState`, like the platform's `beforetoggle`);
 *   cancelling it keeps the current state. Programmatic changes (setting the
 *   property) fire nothing.
 * - Motion goes through the motion tokens (`readMotion()`), and collapses to
 *   no motion when the user prefers reduced motion.
 *
 * Spec: lists.md (expand and collapse), floating-action-button.md and
 * extended-fab.md (collapse and expand), fab-menu.md (open and close),
 * toolbars.md (collapse), WAI-ARIA disclosure pattern.
 */

/** How a collapsed region is taken out of the interaction and a11y tree. */
export type DisclosureHide = 'inert' | 'hidden' | 'none';

/** `ToggleEvent` states of a disclosure. */
export type DisclosureToggleState = 'open' | 'closed';

/**
 * Attribute converter for a boolean `expanded` property that defaults to
 * `true` and collapses with `expanded="false"` (extended FAB), as Compose's
 * `expanded` parameter does. Removing the attribute expands again.
 */
export const expandedUnlessFalseConverter = {
  fromAttribute: (value: string | null) => value !== 'false',
};

/**
 * Like {@link expandedUnlessFalseConverter} for a reflected property (floating
 * toolbar): expanded reflects as a bare attribute, and removing the attribute
 * collapses.
 */
export const reflectedExpandedConverter = {
  fromAttribute: (value: string | null) => value !== null && value !== 'false',
  toAttribute: (value: boolean) => (value ? '' : null),
};

/** The resolved timing of a motion token. */
export interface MotionTiming {
  /** The duration in ms (0 under reduced motion). */
  duration: number;
  /** The CSS easing (the spring's `linear()` curve, or `linear` when reduced). */
  easing: string;
  /** Whether the user prefers reduced motion. */
  reduced: boolean;
}

/** Whether the user prefers reduced motion. */
export function prefersReducedMotion(): boolean {
  return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

/** Parses a CSS time (`420ms`, `0.4s`); NaN when it isn't one. */
export function parseTime(value: string): number {
  const match = /^\s*(-?[\d.]+)(ms|s)\s*$/.exec(value);
  if (!match) return NaN;
  return parseFloat(match[1]) * (match[2] === 's' ? 1000 : 1);
}

/**
 * Reads a spring from the motion tokens
 * (`--md-sys-motion-spring-<name>` and `-duration`) in the context of an
 * element. Reduced motion resolves to no duration, whatever the tokens say.
 *
 * @param element The element whose tokens apply.
 * @param spring The spring token name. Default `default-spatial`.
 */
export function readMotion(element: Element, spring = 'default-spatial'): MotionTiming {
  const reduced = prefersReducedMotion();
  const style = getComputedStyle(element);
  const duration = parseTime(style.getPropertyValue(`--md-sys-motion-spring-${spring}-duration`));
  const easing = style.getPropertyValue(`--md-sys-motion-spring-${spring}`).trim();
  return {
    duration: reduced ? 0 : Number.isNaN(duration) ? 420 : duration,
    easing: reduced ? 'linear' : easing || 'ease',
    reduced,
  };
}

/** Elements a disclosure applies its attributes to. */
export interface DisclosureParts {
  /** The element that toggles the region, if any. */
  trigger?: HTMLElement | null;
  /** The region the trigger shows and hides, if any. */
  region?: HTMLElement | null;
  /** How the collapsed region is hidden. Default `inert`. */
  hide?: DisclosureHide;
  /** Whether the trigger gets `aria-expanded` and `aria-controls`. Default true. */
  aria?: boolean;
}

let idCounter = 0;

/**
 * Applies a disclosure state to its elements: `aria-expanded` and
 * `aria-controls` on the trigger, `inert` / `hidden` on the region.
 */
export function applyDisclosure(
  expanded: boolean,
  {trigger, region, hide = 'inert', aria = true}: DisclosureParts,
): void {
  if (region) {
    region.toggleAttribute('inert', hide === 'inert' && !expanded);
    region.toggleAttribute('hidden', hide === 'hidden' && !expanded);
    if (aria && trigger && !region.id) region.id = `disclosure-region-${++idCounter}`;
  }
  if (trigger && aria) {
    trigger.setAttribute('aria-expanded', String(expanded));
    if (region?.id) {
      trigger.setAttribute('aria-controls', region.id);
    } else {
      trigger.removeAttribute('aria-controls');
    }
  }
}

/**
 * Asks for a user toggle: fires a cancelable `toggle` event on `target`.
 *
 * @return Whether the toggle may proceed (the event wasn't cancelled).
 */
export function requestToggle(target: EventTarget, expanded: boolean): boolean {
  const event = new ToggleEvent('toggle', {
    cancelable: true,
    oldState: expanded ? 'open' : 'closed',
    newState: expanded ? 'closed' : 'open',
  });
  target.dispatchEvent(event);
  return !event.defaultPrevented;
}

/** Options of {@link DisclosureController}. */
export interface DisclosureOptions {
  /** The element that toggles the region, if any. */
  trigger?: () => HTMLElement | null;
  /** The region that is shown and hidden, if any. */
  region?: () => HTMLElement | null;
  /** The host's current state. */
  expanded: () => boolean;
  /** Sets the host's state (a property); called after the toggle event. */
  setExpanded: (expanded: boolean) => void;
  /** Whether the disclosure ignores user toggles. */
  disabled?: () => boolean;
  /**
   * Whether the disclosure applies at all (a toolbar only collapses with a
   * FAB). While false, nothing is hidden and no ARIA is set. Default true.
   */
  enabled?: () => boolean;
  /** How a collapsed region is hidden. Default `inert`. */
  hide?: DisclosureHide;
  /** Whether the trigger gets `aria-expanded` / `aria-controls`. Default true. */
  aria?: boolean;
  /**
   * Whether Enter and Space on the trigger toggle it. Needed for triggers
   * that aren't native buttons or links (a native button already clicks).
   */
  keys?: boolean;
  /** Where the `toggle` event is fired. Default the host. */
  eventTarget?: () => EventTarget;
}

/**
 * A Lit controller for an expand/collapse trigger and region. The host owns
 * the `expanded` state as a property; the controller applies it to the
 * elements after every update and turns user input into toggles.
 */
export class DisclosureController implements ReactiveController {
  private bound: HTMLElement | null = null;
  private spaceDown = false;

  constructor(
    private readonly host: ReactiveControllerHost & HTMLElement,
    private readonly options: DisclosureOptions,
  ) {
    host.addController(this);
  }

  /** Whether the disclosure is expanded. */
  get expanded(): boolean {
    return this.options.expanded();
  }

  hostConnected() {
    this.bind();
  }

  hostDisconnected() {
    this.unbind();
  }

  hostUpdated() {
    this.sync();
  }

  /** Applies the state to the trigger and region, and (re)binds the trigger. */
  sync() {
    this.bind();
    const o = this.options;
    const trigger = o.trigger?.() ?? null;
    const region = o.region?.() ?? null;
    if (o.enabled && !o.enabled()) {
      applyDisclosure(true, {trigger, region, hide: o.hide, aria: false});
      return;
    }
    applyDisclosure(this.expanded, {trigger, region, hide: o.hide, aria: o.aria});
  }

  /** The motion of the expand/collapse (see {@link readMotion}). */
  motion(spring = 'default-spatial'): MotionTiming {
    return readMotion(this.options.region?.() ?? this.host, spring);
  }

  /**
   * Toggles on behalf of the user: fires the cancelable `toggle` event, then
   * sets the state unless it was cancelled.
   *
   * @return Whether the state changed.
   */
  toggle(): boolean {
    return this.set(!this.expanded);
  }

  /** Expands on behalf of the user. @return Whether the state changed. */
  expand(): boolean {
    return this.set(true);
  }

  /** Collapses on behalf of the user. @return Whether the state changed. */
  collapse(): boolean {
    return this.set(false);
  }

  private set(next: boolean): boolean {
    const o = this.options;
    if (next === this.expanded || o.disabled?.() || (o.enabled && !o.enabled())) {
      return false;
    }
    if (!requestToggle(o.eventTarget?.() ?? this.host, this.expanded)) return false;
    o.setExpanded(next);
    this.sync();
    return true;
  }

  private bind() {
    const trigger = this.options.trigger?.() ?? null;
    if (trigger === this.bound) return;
    this.unbind();
    this.bound = trigger;
    trigger?.addEventListener('click', this.onClick);
    if (this.options.keys) {
      trigger?.addEventListener('keydown', this.onKeydown);
      trigger?.addEventListener('keyup', this.onKeyup);
    }
  }

  private unbind() {
    this.bound?.removeEventListener('click', this.onClick);
    this.bound?.removeEventListener('keydown', this.onKeydown);
    this.bound?.removeEventListener('keyup', this.onKeyup);
    this.bound = null;
  }

  private readonly onClick = (event: Event) => {
    if (event.defaultPrevented) return;
    this.toggle();
  };

  // A native button or link activates itself with a click on Enter/Space.
  private get nativeTrigger() {
    return Boolean(this.bound?.matches('button, a[href], summary'));
  }

  private readonly onKeydown = (event: KeyboardEvent) => {
    if (event.defaultPrevented || this.nativeTrigger || event.target !== this.bound) return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      this.toggle();
    } else if (event.key === ' ') {
      // Space activates on release, like a button, and must not scroll.
      event.preventDefault();
      this.spaceDown = true;
    }
  };

  private readonly onKeyup = (event: KeyboardEvent) => {
    if (event.key !== ' ' || !this.spaceDown) return;
    this.spaceDown = false;
    if (this.nativeTrigger || event.defaultPrevented) return;
    event.preventDefault();
    this.toggle();
  };
}
