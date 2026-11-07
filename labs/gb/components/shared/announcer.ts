/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ReactiveController, type ReactiveControllerHost} from 'lit';

/**
 * Screen reader announcements for components whose state changes are not
 * visible in the focused element: one polite and one assertive live region
 * per component, instead of a hand-written region in every template.
 *
 * - Polite announcements (`role="status"`) queue behind what the screen
 *   reader is saying; assertive ones (`role="alert"`) interrupt it. Use
 *   polite for snackbars, month changes and progress; assertive for errors.
 * - The same message can be announced again: a repeat clears the region and
 *   sets the text again after a short delay, which screen readers read as a
 *   change.
 * - The regions are plain elements created by the controller (visually
 *   hidden with inline styles, so no stylesheet is needed), inside the
 *   host's shadow root or the element `container` returns (a modal dialog
 *   needs its region inside, because the page behind it is inert). They are
 *   moved back into the container after each render and removed when the
 *   host disconnects, with pending announcements dropped.
 * - Announcing never moves focus.
 *
 * Spec: the Accessibility sections of snackbars ("use a live region with a
 * polite announcement instead of an assertive announcement"), text fields
 * (error messages get an "alert" role), pull to refresh, date and time
 * pickers.
 */

/** How urgent an announcement is. */
export type Politeness = 'polite' | 'assertive';

/** The attribute that marks a live region of the announcer, with its politeness. */
export const ANNOUNCER_ATTRIBUTE = 'data-announcer';

/** How long (ms) a repeated or first announcement waits so it reads as a change. */
export const ANNOUNCE_DELAY_MS = 60;

/** The ARIA role of the live region for each politeness. */
export const ANNOUNCER_ROLES: Readonly<Record<Politeness, string>> = {
  polite: 'status',
  assertive: 'alert',
};

/** The inline style that hides a live region visually but not from assistive technology. */
const VISUALLY_HIDDEN =
  'position:absolute;inline-size:1px;block-size:1px;margin:-1px;padding:0;' +
  'border:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap;';

/** Collapses whitespace so the announced text is stable. */
export function normalizeAnnouncement(message: string | null | undefined) {
  return (message ?? '').replace(/\s+/g, ' ').trim();
}

/** Creates a hidden live region for `politeness`. */
export function createLiveRegion(politeness: Politeness): HTMLElement {
  const region = document.createElement('div');
  region.setAttribute(ANNOUNCER_ATTRIBUTE, politeness);
  region.setAttribute('role', ANNOUNCER_ROLES[politeness]);
  region.setAttribute('aria-live', politeness);
  region.setAttribute('aria-atomic', 'true');
  region.style.cssText = VISUALLY_HIDDEN;
  return region;
}

/** A Lit element (or any custom element with controllers). */
export type AnnouncerHost = ReactiveControllerHost &
  HTMLElement & {readonly renderRoot?: HTMLElement | DocumentFragment};

/** Options of {@link AnnouncerController}. */
export interface AnnouncerOptions {
  /**
   * The element that holds the live regions. Default: the host's render
   * root. Called after every render, so it may return different elements
   * over time (e.g. the surface of a dialog or a popup).
   */
  container?: () => Element | ShadowRoot | null | undefined;
  /**
   * The regions to create right away, so they are in the page before the
   * first announcement. Default `['polite']`; the assertive region is
   * created on its first use.
   */
  regions?: Politeness[];
  /** Delay (ms) before a repeated or first announcement is set. Default 60. */
  delay?: number;
}

/**
 * Adds polite and assertive live regions to a Lit element.
 *
 * ```ts
 * private readonly announcer = new AnnouncerController(this);
 * ...
 * this.announcer.announce('Refreshing');
 * this.announcer.announce('Enter a valid email', 'assertive');
 * ```
 */
export class AnnouncerController implements ReactiveController {
  private readonly regions = new Map<Politeness, HTMLElement>();
  private readonly timers = new Map<
    Politeness,
    {timer: ReturnType<typeof setTimeout>; resolve: () => void}
  >();

  constructor(
    private readonly host: AnnouncerHost,
    private readonly options: AnnouncerOptions = {},
  ) {
    host.addController(this);
  }

  hostConnected() {
    for (const politeness of this.options.regions ?? ['polite']) {
      this.region(politeness);
    }
  }

  hostUpdated() {
    // The template may have replaced the container: bring the regions along.
    for (const region of this.regions.values()) {
      const parent = this.parent();
      if (parent && region.parentNode !== parent) {
        parent.appendChild(region);
      }
    }
  }

  hostDisconnected() {
    this.cancelAll();
    for (const region of this.regions.values()) {
      region.remove();
    }
    this.regions.clear();
  }

  /** The text a live region holds now, or '' (also while an announcement is pending). */
  text(politeness: Politeness = 'polite') {
    return this.regions.get(politeness)?.textContent ?? '';
  }

  /** The live region element, created when needed; null when it cannot be attached. */
  region(politeness: Politeness = 'polite') {
    let region = this.regions.get(politeness);
    if (region?.isConnected && region.parentNode === this.parent()) {
      return region;
    }
    const parent = this.parent();
    if (!parent) {
      return region ?? null;
    }
    if (!region) {
      region = createLiveRegion(politeness);
      this.regions.set(politeness, region);
    }
    parent.appendChild(region);
    return region;
  }

  /**
   * Announces `message`. Returns a promise that resolves once the text is in
   * the live region (at once for a new message in an existing region, after
   * the delay for a repeat or a new region) or the announcement was
   * replaced, cleared or dropped by a disconnect.
   */
  announce(
    message: string | null | undefined,
    politeness: Politeness = 'polite',
  ): Promise<void> {
    const text = normalizeAnnouncement(message);
    if (!text) {
      this.clear(politeness);
      return Promise.resolve();
    }
    this.cancel(politeness);
    const existing = this.regions.get(politeness);
    const region = this.region(politeness);
    if (!region) {
      return Promise.resolve();
    }
    const fresh = !existing?.isConnected || existing !== region;
    if (!fresh && region.textContent !== text) {
      region.textContent = text;
      return Promise.resolve();
    }
    // A repeat, or a region that was just added: set the text in a later task.
    region.textContent = '';
    return new Promise<void>((resolve) => {
      const timer = setTimeout(() => {
        this.timers.delete(politeness);
        region.textContent = text;
        resolve();
      }, this.options.delay ?? ANNOUNCE_DELAY_MS);
      this.timers.set(politeness, {timer, resolve});
    });
  }

  /** Empties a live region (both by default) and drops pending announcements. */
  clear(politeness?: Politeness) {
    for (const p of politeness ? [politeness] : (['polite', 'assertive'] as const)) {
      this.cancel(p);
      const region = this.regions.get(p);
      if (region) {
        region.textContent = '';
      }
    }
  }

  private parent() {
    return (
      this.options.container?.() ??
      this.host.renderRoot ??
      this.host.shadowRoot ??
      this.host
    );
  }

  private cancel(politeness: Politeness) {
    const pending = this.timers.get(politeness);
    if (pending) {
      clearTimeout(pending.timer);
      this.timers.delete(politeness);
      pending.resolve();
    }
  }

  private cancelAll() {
    for (const politeness of [...this.timers.keys()]) {
      this.cancel(politeness);
    }
  }
}
