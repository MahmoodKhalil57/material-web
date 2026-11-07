/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ReactiveController, type ReactiveControllerHost} from 'lit';

/**
 * Shared behavior of surfaces anchored to another element: menus, select
 * and autocomplete dropdowns, tooltips, the menu of a split button.
 *
 * - The surface is a popover, shown in the top layer in front of all other
 *   UI ("Menus appear in front of all other UI elements").
 * - It sits next to its anchor and stays inside the window: it is placed on
 *   the preferred side, flips to the opposite one when there is no room, and
 *   is then clamped to the window edges. CSS anchor positioning
 *   (`position-area`) does this in the component's styles; where the browser
 *   lacks it, or when the component asks for it (`positioning: 'js'`, for
 *   tooltips whose caret follows the anchor, or a context menu opened at a
 *   point), {@link computeOverlayPosition} does the same in JS.
 * - Light dismiss: Escape and a press outside close the surface. Each close
 *   has a reason ({@link OverlayCloseReason}); closing the surface closes it
 *   whoever asked (the browser's own light dismiss of `popover="auto"`
 *   included, which the controller labels).
 * - When focus was inside the surface, closing returns it to the invoker
 *   ("Where focus is placed after closing the menu depends on the app":
 *   back to the element that opened it).
 *
 * The controller is driven by the surface's `beforetoggle` and `toggle`
 * events, so it also follows opens and closes the browser starts (a
 * `popovertarget` click, native light dismiss).
 */

/** Why a surface closed. Components may pass their own strings to `close()`. */
export type OverlayCloseReason =
  | 'escape'
  | 'outside'
  | 'focus'
  | 'method'
  | 'native';

/** What a light dismiss asks for. */
export type OverlayDismissReason = 'escape' | 'outside' | 'focus';

/** Preferred side of the anchor. `start` and `end` follow the writing direction. */
export type OverlayPlacement = 'above' | 'below' | 'start' | 'end';

/** The physical side of the anchor a surface ended up on. */
export type OverlaySide = 'above' | 'below' | 'left' | 'right';

/** A rectangle in viewport coordinates. */
export interface OverlayRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/** Distances kept from the window edges. */
export interface OverlayMargin {
  inline: number;
  blockStart: number;
  blockEnd: number;
}

/** Input to {@link computeOverlayPosition}. */
export interface OverlayPositionInput {
  /** The anchor's bounding client rect. */
  anchor: OverlayRect;
  /** The surface's untransformed size. */
  surface: {width: number; height: number};
  /** The viewport size. */
  viewport: {width: number; height: number};
  placement: OverlayPlacement;
  /**
   * `center` centers the surface on the anchor; `start` aligns it to the
   * anchor's start edge so it extends toward the end (above / below), or to
   * the anchor's top edge (start / end); `end` aligns it to the anchor's end
   * edge so it extends toward the start (above / below; a split button's
   * menu).
   */
  align?: 'center' | 'start' | 'end';
  /** Gap between the anchor and the surface (including any caret). */
  spacing?: number;
  /** Minimum distance kept from the viewport edges. */
  margin?: number | OverlayMargin;
  /** Minimum distance between a caret's center and a surface corner. */
  caretInset?: number;
  rtl?: boolean;
}

/** Output of {@link computeOverlayPosition}. */
export interface OverlayPosition {
  /** Viewport x of the surface's left edge. */
  x: number;
  /** Viewport y of the surface's top edge. */
  y: number;
  side: OverlaySide;
  /**
   * The caret's center along the edge facing the anchor, from the surface's
   * left (above / below) or top (left / right) edge.
   */
  caretOffset: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

/**
 * Positions a surface next to its anchor, after Compose's
 * `TooltipPositionProviderImpl`: prefer the requested side, flip to the
 * opposite side when it doesn't fit, then keep the surface inside the
 * viewport.
 */
export function computeOverlayPosition({
  anchor,
  surface,
  viewport,
  placement,
  align = 'center',
  spacing = 4,
  margin = 8,
  caretInset = 12,
  rtl = false,
}: OverlayPositionInput): OverlayPosition {
  const {width, height} = surface;
  const edges =
    typeof margin === 'number'
      ? {inline: margin, blockStart: margin, blockEnd: margin}
      : margin;
  const anchorWidth = anchor.right - anchor.left;
  const anchorHeight = anchor.bottom - anchor.top;
  const minX = edges.inline;
  const maxX = viewport.width - edges.inline - width;
  const minY = edges.blockStart;
  const maxY = viewport.height - edges.blockEnd - height;

  let x: number;
  let y: number;
  let side: OverlaySide;

  if (placement === 'above' || placement === 'below') {
    if (align === 'start' || align === 'end') {
      // Extend from the anchor's start (or end) edge, else the other edge,
      // else center (Compose `rememberRichTooltipPositionProvider`).
      const fromStart = (align === 'start') !== rtl;
      x = fromStart ? anchor.left : anchor.right - width;
      if (x < minX || x > maxX) {
        x = fromStart ? anchor.right - width : anchor.left;
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
    y = clamp(
      align === 'center' ? anchor.top + (anchorHeight - height) / 2 : anchor.top,
      minY,
      maxY,
    );
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

/** `node` is `parent` or inside it, across shadow roots. */
export function composedContains(
  parent: Node | null,
  node: Node | null,
): boolean {
  while (parent && node) {
    if (node === parent) return true;
    node = node.parentNode ?? (node as ShadowRoot).host ?? null;
  }
  return false;
}

/** The focused element, looking inside open shadow roots. */
export function deepActiveElement(): Element | null {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement;
  }
  return active;
}

let anchorPositioningOverride: boolean | null = null;

/**
 * Pretends the browser does (`true`) or does not (`false`) have CSS anchor
 * positioning, so tests can drive the JS fallback in a browser that has it.
 * `null` goes back to detecting it. Takes effect when a surface next opens.
 */
export function forceAnchorPositioningSupport(value: boolean | null) {
  anchorPositioningOverride = value;
}

/** Whether the browser positions elements with CSS anchor positioning. */
export function supportsAnchorPositioning(): boolean {
  if (anchorPositioningOverride !== null) return anchorPositioningOverride;
  return (
    typeof CSS !== 'undefined' &&
    !!CSS.supports?.('position-area: block-end span-inline-end')
  );
}

/** What the controller needs to place a surface; see {@link AnchoredOverlayOptions.placement}. */
export interface OverlayPlacementOptions {
  placement: OverlayPlacement;
  align?: 'center' | 'start' | 'end';
  spacing?: number;
  margin?: number | OverlayMargin;
  caretInset?: number;
}

/** Which interactions dismiss a surface. */
export interface OverlayDismissOptions {
  /** Escape closes it. Default true. */
  escape?: boolean;
  /** A press outside the surface and its anchor closes it. Default true. */
  outside?: boolean;
  /** Focus moving to an element outside closes it. Default false. */
  focusIn?: boolean;
  /**
   * Focus leaving the surface, anchor and `contains` regions (also to
   * nothing, as a click on the page background does) closes it. Default
   * false.
   */
  focusOut?: boolean;
}

/** Options of {@link AnchoredOverlayController}. */
export interface AnchoredOverlayOptions {
  /** The popover element. */
  surface: () => HTMLElement | null;
  /**
   * The element the surface is placed next to. Also the default place focus
   * returns to.
   */
  anchor?: () => HTMLElement | null;
  /**
   * The `popover` mode given to a surface that has none. `auto` surfaces are
   * light dismissed by the browser (the controller labels the reason);
   * `manual` ones by the controller. Default `manual`.
   */
  popover?: 'auto' | 'manual';
  /**
   * `css`: the component's styles place the surface (`position-area`), and
   * the controller takes over only where the browser lacks CSS anchor
   * positioning. `js`: the controller always places it. Default `css`.
   */
  positioning?: 'css' | 'js';
  /** Where the controller places the surface (JS positioning and the fallback). */
  placement?: () => OverlayPlacementOptions;
  dismiss?: OverlayDismissOptions;
  /** More elements that count as inside (for outside press and focus). */
  contains?: (node: Node) => boolean;
  /**
   * Called when a light dismiss asks to close the surface (manual surfaces).
   * Default: `close(reason)`. Components that own an `open` property set it.
   */
  onDismiss?: (reason: OverlayDismissReason) => void;
  /** Return false to keep the surface open. Called by `close()`. */
  beforeClose?: (reason: string) => boolean;
  /**
   * Return focus to the invoker when it was inside the surface (optionally
   * only for some close reasons). Default true.
   */
  restoreFocus?: boolean | ((reason: string) => boolean);
  /**
   * The element focus returns to, decided when the surface opens. Default:
   * the toggle event's source (the invoker), else the element that had focus
   * outside the surface, else the anchor.
   */
  returnTarget?: (source: HTMLElement | null) => HTMLElement | null;
  /** The surface has opened. `source` is its invoker, if known. */
  onOpen?: (source: HTMLElement | null) => void;
  /** The surface has closed, with the reason. */
  onClose?: (reason: string) => void;
  /** JS positioning computed a new position. */
  onPosition?: (position: OverlayPosition) => void;
}

/** A Lit controller for surfaces anchored to another element. */
export class AnchoredOverlayController implements ReactiveController {
  /** The invoker of the open surface, if known. */
  source: HTMLElement | null = null;
  /** Why the surface last closed. */
  closeReason: string | null = null;
  /** The side of the anchor the surface is on (after JS positioning). */
  side: OverlaySide | null = null;

  private surface: HTMLElement | null = null;
  private surfaceAbort: AbortController | null = null;
  private openAbort: AbortController | null = null;
  private active = false;
  private focusWasInside = false;
  private returnTo: HTMLElement | null = null;
  private pending: {reason: string; time: number} | null = null;
  private point: {x: number; y: number} | null = null;
  private appliedInline = false;
  private frame = 0;
  private resizeObserver?: ResizeObserver;

  constructor(
    host: ReactiveControllerHost & HTMLElement,
    private readonly options: AnchoredOverlayOptions,
  ) {
    host.addController(this);
  }

  /** Whether the surface is open. */
  get isOpen(): boolean {
    return !!this.surface?.matches(':popover-open');
  }

  hostConnected() {
    this.bind();
  }

  hostUpdated() {
    this.bind();
  }

  hostDisconnected() {
    this.surfaceAbort?.abort();
    this.surfaceAbort = null;
    this.surface = null;
    this.stopListening();
    this.active = false;
  }

  /**
   * Opens the surface.
   *
   * @param source The invoker, for focus return.
   * @return Whether it is open.
   */
  open(source?: HTMLElement | null): boolean {
    this.bind();
    const surface = this.surface;
    if (!surface) return false;
    if (!surface.matches(':popover-open')) {
      try {
        (surface.showPopover as (o?: {source?: HTMLElement}) => void).call(
          surface,
          source ? {source} : undefined,
        );
      } catch {
        // Not connected, or popover unsupported.
        return false;
      }
    }
    this.handleOpened(source ?? null);
    return this.isOpen;
  }

  /**
   * Opens the surface at a point in the viewport (a context menu): below and
   * after the point, flipping when there is no room.
   */
  openAt(x: number, y: number, source?: HTMLElement | null): boolean {
    const surface = this.options.surface();
    if (!surface) return false;
    this.point = {x, y};
    // Start at the point, so the surface is sized as if it had room.
    this.takeOver(surface);
    surface.style.left = `${x}px`;
    surface.style.top = `${y}px`;
    const opened = this.open(source);
    if (opened) {
      this.reposition();
    } else {
      this.point = null;
    }
    return opened;
  }

  /**
   * Closes the surface.
   *
   * @param reason Why; recorded in {@link closeReason}.
   * @return Whether it closed (`beforeClose` may keep it open).
   */
  close(reason: string = 'method'): boolean {
    const surface = this.surface;
    if (!surface?.matches(':popover-open')) return true;
    if (this.options.beforeClose?.(reason) === false) return false;
    this.pending = {reason, time: Date.now()};
    this.captureFocus();
    try {
      surface.hidePopover();
    } catch {
      // Already hidden.
    }
    this.handleClosed();
    return true;
  }

  /** The anchor's bounding rect. */
  anchorRect(): DOMRect | undefined {
    return this.options.anchor?.()?.getBoundingClientRect();
  }

  /** Recomputes the JS position (scroll, resize, size change, anchor move). */
  reposition() {
    const surface = this.surface;
    if (!surface || !this.isOpen || !this.usesJs) return;
    const anchor = this.point
      ? {
          left: this.point.x,
          top: this.point.y,
          right: this.point.x,
          bottom: this.point.y,
        }
      : this.options.anchor?.()?.getBoundingClientRect();
    if (!anchor) return;
    const config = this.options.placement?.() ?? {placement: 'below' as const};
    const position = computeOverlayPosition({
      anchor,
      // Untransformed size: enter animations scale the surface.
      surface: {width: surface.offsetWidth, height: surface.offsetHeight},
      viewport: {
        width: document.documentElement.clientWidth || window.innerWidth,
        height: document.documentElement.clientHeight || window.innerHeight,
      },
      placement: config.placement,
      align: config.align,
      spacing: config.spacing,
      margin: config.margin,
      caretInset: config.caretInset,
      rtl: getComputedStyle(this.options.anchor?.() ?? surface).direction === 'rtl',
    });
    this.takeOver(surface);
    surface.style.left = `${position.x}px`;
    surface.style.top = `${position.y}px`;
    this.side = position.side;
    this.options.onPosition?.(position);
  }

  /** Takes the surface out of CSS anchor positioning. */
  private takeOver(surface: HTMLElement) {
    if (this.appliedInline) return;
    surface.style.position = 'fixed';
    surface.style.inset = 'auto';
    surface.style.margin = '0';
    surface.style.setProperty('position-area', 'none');
    surface.style.setProperty('position-try-fallbacks', 'none');
    this.appliedInline = true;
  }

  private get usesJs() {
    return (
      this.point !== null ||
      this.options.positioning === 'js' ||
      !supportsAnchorPositioning()
    );
  }

  /** Finds the surface and listens to its toggle events. */
  private bind() {
    const surface = this.options.surface();
    if (surface === this.surface) return;
    this.surfaceAbort?.abort();
    this.surface = surface;
    if (!surface) return;
    if (!surface.hasAttribute('popover')) {
      surface.popover = this.options.popover ?? 'manual';
    }
    const abort = new AbortController();
    this.surfaceAbort = abort;
    const opts = {signal: abort.signal};
    surface.addEventListener(
      'beforetoggle',
      (event) => {
        if ((event as ToggleEvent).newState === 'closed') this.captureFocus();
      },
      opts,
    );
    surface.addEventListener(
      'toggle',
      (event) => {
        // Toggle events of nested popovers do not bubble, but guard anyway.
        if (event.target !== surface) return;
        const toggle = event as ToggleEvent & {source?: Element | null};
        // The surface may have changed state again since the event queued.
        if (surface.matches(':popover-open')) {
          this.handleOpened((toggle.source as HTMLElement | null) ?? null);
        } else {
          this.handleClosed();
        }
      },
      opts,
    );
    if (surface.matches(':popover-open')) this.handleOpened(null);
  }

  private handleOpened(source: HTMLElement | null) {
    if (this.active) {
      if (source && !this.source) this.source = source;
      return;
    }
    this.active = true;
    this.pending = null;
    this.closeReason = null;
    this.source = source;
    const inside = this.surface;
    const outside = deepActiveElement();
    this.returnTo = this.options.returnTarget
      ? this.options.returnTarget(source)
      : (source ??
        (outside instanceof HTMLElement &&
        outside !== document.body &&
        !composedContains(inside, outside)
          ? outside
          : null) ??
        this.options.anchor?.() ??
        null);
    this.listen();
    this.reposition();
    this.options.onOpen?.(source);
  }

  private handleClosed() {
    if (!this.active) return;
    this.active = false;
    const surface = this.surface;
    this.stopListening();
    // A reason recorded just before the browser's own light dismiss closed
    // the surface (stale labels are ignored).
    const pending = this.pending;
    this.pending = null;
    const reason =
      pending && Date.now() - pending.time < 1000 ? pending.reason : 'native';
    this.closeReason = reason;
    if (this.appliedInline && surface && (this.point || !this.usesJs)) {
      for (const prop of ['position', 'inset', 'margin', 'left', 'top']) {
        surface.style.removeProperty(prop);
      }
      surface.style.removeProperty('position-area');
      surface.style.removeProperty('position-try-fallbacks');
      this.appliedInline = false;
    }
    this.point = null;
    this.side = null;
    this.restoreFocusIfNeeded(reason);
    this.source = null;
    this.options.onClose?.(reason);
  }

  private captureFocus() {
    const surface = this.surface;
    this.focusWasInside =
      !!surface && composedContains(surface, deepActiveElement());
  }

  private restoreFocusIfNeeded(reason: string) {
    const target = this.returnTo;
    this.returnTo = null;
    const restore = this.options.restoreFocus ?? true;
    if (typeof restore === 'function' ? !restore(reason) : !restore) return;
    const wasInside = this.focusWasInside;
    this.focusWasInside = false;
    if (!wasInside || !target?.isConnected) return;
    // Return focus only if it is still inside the surface or was lost (not
    // when the user already moved it elsewhere).
    const active = deepActiveElement();
    if (
      !active ||
      active === document.body ||
      composedContains(this.surface, active)
    ) {
      target.focus();
    }
  }

  /** The event came from the surface, its anchor or another inside region. */
  private isInside(node: Node | null): boolean {
    if (!node) return false;
    return (
      composedContains(this.surface, node) ||
      composedContains(this.options.anchor?.() ?? null, node) ||
      !!this.options.contains?.(node)
    );
  }

  private listen() {
    this.stopListening();
    const abort = new AbortController();
    this.openAbort = abort;
    const dismiss = this.options.dismiss ?? {};
    const capture = {signal: abort.signal, capture: true};
    const native = () => this.surface?.getAttribute('popover') !== 'manual';
    const request = (reason: OverlayDismissReason) => {
      if (native()) {
        // The browser closes `auto` surfaces; remember why.
        this.pending = {reason, time: Date.now()};
      } else if (this.options.onDismiss) {
        this.options.onDismiss(reason);
      } else {
        this.close(reason);
      }
    };

    if (dismiss.escape !== false) {
      document.addEventListener(
        'keydown',
        (event) => {
          if (event.key !== 'Escape' || !this.isOpen) return;
          if (
            !native() &&
            (this.isInside(event.composedPath()[0] as Node | null) ||
              this.isInside(deepActiveElement()))
          ) {
            event.preventDefault();
            event.stopPropagation();
          }
          request('escape');
        },
        capture,
      );
    }
    if (dismiss.outside !== false) {
      document.addEventListener(
        'pointerdown',
        (event) => {
          if (!this.isOpen) return;
          if (this.isInside(event.composedPath()[0] as Node | null)) return;
          request('outside');
        },
        capture,
      );
    }
    if (dismiss.focusIn) {
      document.addEventListener(
        'focusin',
        (event) => {
          if (!this.isOpen) return;
          if (this.isInside(event.composedPath()[0] as Node | null)) return;
          request('focus');
        },
        capture,
      );
    }
    if (dismiss.focusOut) {
      document.addEventListener(
        'focusout',
        (event) => {
          if (!this.isOpen) return;
          if (!this.isInside(event.composedPath()[0] as Node | null)) return;
          const next = (event as FocusEvent).relatedTarget as Node | null;
          if (this.isInside(next)) return;
          request('focus');
        },
        capture,
      );
    }

    if (this.usesJs) {
      const schedule = () => {
        cancelAnimationFrame(this.frame);
        this.frame = requestAnimationFrame(() => {
          this.reposition();
        });
      };
      window.addEventListener('scroll', schedule, {
        ...capture,
        passive: true,
      });
      window.addEventListener('resize', schedule, capture);
      if (typeof ResizeObserver !== 'undefined' && this.surface) {
        this.resizeObserver ??= new ResizeObserver(schedule);
        this.resizeObserver.observe(this.surface);
      }
    }
  }

  private stopListening() {
    this.openAbort?.abort();
    this.openAbort = null;
    this.resizeObserver?.disconnect();
    cancelAnimationFrame(this.frame);
  }
}
