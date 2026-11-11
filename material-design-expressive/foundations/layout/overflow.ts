/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  css,
  html,
  nothing,
  type ReactiveController,
  type ReactiveControllerHost,
  type TemplateResult,
} from 'lit';

import {perfEnd, perfStart} from '../../components/shared/perf.js';

/**
 * Shared overflow menu: the trailing items of a row (button group, toolbar)
 * that do not fit move into a menu opened by a trailing overflow button, and
 * come back when space returns.
 *
 * - The host's `container` must not wrap or shrink its items. An item
 *   overflows when the container's content is wider (taller, for
 *   `axis: 'block'`) than the container: the container is bounded by its
 *   parent, a `max-width`, or a fixed width.
 * - The trailing items hide first, one at a time, until the content fits
 *   with the trigger shown. The trigger is shown only while an item is
 *   hidden. A hidden item keeps its place in the DOM, its listeners and its
 *   state: it is `hidden` and carries `data-overflow-hidden`.
 * - The menu lists the hidden items in order. Choosing one clicks the
 *   original item, so its handlers, links and toggle state run unchanged.
 *   Each menu item reads the original's label (`aria-label`, else its
 *   text) and `disabled` state.
 * - The container, the host, the host's parent and the items are observed
 *   with a ResizeObserver, so items return when the window grows. Call
 *   {@link refresh} after a slot change.
 * - The trigger opens the menu on click, Enter and Space (its click), and
 *   Up and Down ("For closed menus: Opens menu"). Items hidden by the app
 *   itself (`hidden` it set) are left alone.
 *
 * Spec: button-groups.md and toolbars.md, Adaptive design / Presentation:
 * "Buttons at the trailing edge of the button group can be customized to
 * collapse into an overflow menu at smaller breakpoints, and become visible
 * again at larger sizes. Place the overflow menu at the trailing end."
 */

/** Marks an item (or the trigger) the controller keeps hidden. */
export const OVERFLOW_HIDDEN_ATTRIBUTE = 'data-overflow-hidden';

/**
 * Styles for hosts: an overflowed item stays out of the layout even when its
 * own styles set `display`.
 */
export const overflowStyles = css`
  [data-overflow-hidden],
  ::slotted([data-overflow-hidden]) {
    display: none !important;
  }
`;

/** The icon of the default overflow button (three dots, vertical). */
export const overflowIcon = html`<svg
  viewBox="0 -960 960 960"
  width="24"
  height="24"
  fill="currentColor"
  aria-hidden="true">
  <path
    d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" />
</svg>`;

/** Options of {@link OverflowController}. */
export interface OverflowOptions {
  /**
   * The items that may overflow, in order; the last one hides first. Called
   * on every measure.
   */
  items: () => HTMLElement[];
  /** The element whose content must fit (not wrap, not shrink its items). */
  container: () => HTMLElement | null;
  /**
   * The overflow trigger (a button). Shown only while an item is hidden.
   * Make it a child of the container.
   */
  trigger: () => HTMLElement | null;
  /** The `md-gb-menu` that lists the hidden items. */
  menu: () => HTMLElement | null;
  /** Whether overflow is on. Default true. Off, every item shows. */
  enabled?: () => boolean;
  /** The axis the items are laid out along. Default `'inline'`. */
  axis?: () => 'inline' | 'block';
}

/** Gets the label of an item for the overflow menu. */
export function overflowLabel(item: HTMLElement): string {
  return (
    item.getAttribute('aria-label') ||
    (item.textContent ?? '').replace(/\s+/g, ' ').trim() ||
    item.getAttribute('title') ||
    ''
  );
}

/**
 * Whether the container's laid out children stay inside its content box,
 * along the inline axis (both edges, so centered content that overflows
 * counts) or the block axis. Measuring the children's boxes rather than
 * `scrollWidth` ignores overflow that is only paint, like the 48px touch
 * target of a 40px button.
 */
function contentFits(
  container: HTMLElement,
  block: boolean,
  exclude?: HTMLElement | null,
): boolean {
  const children: Element[] = [];
  for (const child of Array.from(container.children)) {
    if (child instanceof HTMLSlotElement) {
      children.push(...child.assignedElements({flatten: true}));
    } else {
      children.push(child);
    }
  }
  const box = container.getBoundingClientRect();
  const style = getComputedStyle(container);
  const px = (value: string) => parseFloat(value) || 0;
  const start = block
    ? box.top + px(style.borderTopWidth) + px(style.paddingTop)
    : box.left + px(style.borderLeftWidth) + px(style.paddingLeft);
  const end = block
    ? box.bottom - px(style.borderBottomWidth) - px(style.paddingBottom)
    : box.right - px(style.borderRightWidth) - px(style.paddingRight);
  for (const child of children) {
    if (child === exclude || !child.getClientRects().length) continue;
    const rect = child.getBoundingClientRect();
    if (!rect.width && !rect.height) continue;
    const from = block ? rect.top : rect.left;
    const to = block ? rect.bottom : rect.right;
    if (from < start - 1 || to > end + 1) return false;
  }
  return true;
}

/** Whether an item is disabled (button `disabled`, `aria-disabled`). */
function isDisabled(item: HTMLElement): boolean {
  const el = item as HTMLElement & {disabled?: boolean};
  return !!el.disabled || item.getAttribute('aria-disabled') === 'true';
}

/**
 * Moves the trailing items of a Lit host into an overflow menu while they do
 * not fit. See the file comment.
 */
export class OverflowController implements ReactiveController {
  private readonly hiddenByUs = new Set<HTMLElement>();
  private readonly observer: ResizeObserver;
  private observed = new Set<Element>();
  private measuring = false;
  private frame = 0;
  private menuAbort?: AbortController;
  private menuNode: HTMLElement | null = null;
  private closedAt = -Infinity;
  private overflowedItems: HTMLElement[] = [];

  constructor(
    private readonly host: ReactiveControllerHost & HTMLElement,
    private readonly options: OverflowOptions,
  ) {
    // Measuring inside the observer callback would resize observed
    // elements again in the same delivery; do it in the next frame.
    this.observer = new ResizeObserver(() => {
      cancelAnimationFrame(this.frame);
      this.frame = requestAnimationFrame(() => {
        this.measure();
      });
    });
    host.addController(this);
  }

  /** The items that are hidden in the menu now, in order. */
  get overflowed(): readonly HTMLElement[] {
    return this.overflowedItems;
  }

  hostConnected() {
    this.host.addEventListener('click', this.onClick);
    this.host.addEventListener('keydown', this.onKeydown);
  }

  hostDisconnected() {
    this.host.removeEventListener('click', this.onClick);
    this.host.removeEventListener('keydown', this.onKeydown);
    cancelAnimationFrame(this.frame);
    this.observer.disconnect();
    this.observed.clear();
    this.menuAbort?.abort();
    this.menuNode = null;
  }

  hostUpdated() {
    this.watchMenu();
    this.observe();
    this.measure();
  }

  /** Measures again now (after a slot change or an item change). */
  refresh() {
    this.observe();
    this.measure();
  }

  /** Opens the menu next to the trigger. */
  open() {
    const menu = this.options.menu();
    const trigger = this.options.trigger();
    if (!menu || !trigger || menu.matches(':popover-open')) return;
    (menu.showPopover as (o?: {source?: HTMLElement}) => void).call(menu, {
      source: trigger,
    });
  }

  /** Closes the menu. */
  close() {
    const menu = this.options.menu();
    if (menu?.matches(':popover-open')) menu.hidePopover();
  }

  /** Clicks the original item behind a menu entry. */
  activate(item: HTMLElement) {
    this.close();
    if (isDisabled(item)) return;
    item.click();
  }

  private observe() {
    const targets = new Set<Element>();
    const container = this.options.container();
    if (container) targets.add(container);
    targets.add(this.host);
    const parent =
      this.host.parentElement ??
      (this.host.getRootNode() as ShadowRoot).host ??
      null;
    if (parent) targets.add(parent);
    for (const item of this.options.items()) targets.add(item);
    for (const target of this.observed) {
      if (!targets.has(target)) this.observer.unobserve(target);
    }
    for (const target of targets) {
      if (!this.observed.has(target)) this.observer.observe(target);
    }
    this.observed = targets;
  }

  private setHidden(item: HTMLElement, hidden: boolean) {
    if (hidden) {
      this.hiddenByUs.add(item);
    } else {
      this.hiddenByUs.delete(item);
    }
    item.hidden = hidden;
    item.toggleAttribute(OVERFLOW_HIDDEN_ATTRIBUTE, hidden);
  }

  private measure() {
    if (this.measuring) return;
    this.measuring = true;
    const perf = perfStart();
    try {
      const {options} = this;
      const container = options.container();
      const trigger = options.trigger();
      // Not laid out yet (or display: none): nothing to measure.
      if (container && !container.getClientRects().length) return;
      const enabled = (options.enabled?.() ?? true) && !!container;
      // Off and nothing hidden by us: leave the items alone.
      if (!enabled && !this.hiddenByUs.size && !this.overflowedItems.length) {
        return;
      }
      const items = options.items();

      // Items we hid and that left the list stay as they were.
      for (const item of this.hiddenByUs) {
        if (!items.includes(item)) this.setHidden(item, false);
      }
      // Measure with every item shown. Showing never drops focus; an item
      // that stays visible is never hidden on the way (that would blur it).
      const candidates = items.filter(
        (item) => this.hiddenByUs.has(item) || !item.hidden,
      );
      for (const item of candidates) this.setHidden(item, false);
      const setTrigger = (shown: boolean) => {
        if (!trigger || trigger.hidden !== shown) return;
        trigger.toggleAttribute(OVERFLOW_HIDDEN_ATTRIBUTE, !shown);
        trigger.hidden = !shown;
      };
      if (trigger && !trigger.hasAttribute('aria-haspopup')) {
        trigger.setAttribute('aria-haspopup', 'menu');
      }

      const hiddenNow: HTMLElement[] = [];
      if (enabled && container) {
        const block = options.axis?.() === 'block';
        const fits = (exclude?: HTMLElement | null) =>
          contentFits(container, block, exclude);
        // With the trigger shown, then without it.
        setTrigger(true);
        if (!fits()) {
          if (fits(trigger)) {
            setTrigger(false);
          } else {
            for (let i = candidates.length - 1; i >= 0; i--) {
              const item = candidates[i];
              const focused = item.matches(':focus-within');
              this.setHidden(item, true);
              hiddenNow.unshift(item);
              if (focused) trigger?.focus();
              if (fits()) break;
            }
          }
        } else {
          setTrigger(false);
        }
      } else {
        setTrigger(false);
      }

      const changed =
        hiddenNow.length !== this.overflowedItems.length ||
        hiddenNow.some((item, i) => item !== this.overflowedItems[i]);
      this.overflowedItems = hiddenNow;
      if (!hiddenNow.length) this.close();
      if (changed) this.host.requestUpdate();
    } finally {
      this.measuring = false;
      perfEnd('overflow.measure', perf, {hidden: this.overflowedItems.length});
    }
  }

  private watchMenu() {
    const menu = this.options.menu();
    if (menu === this.menuNode) return;
    this.menuAbort?.abort();
    this.menuNode = menu;
    if (!menu) return;
    const abort = new AbortController();
    this.menuAbort = abort;
    menu.addEventListener(
      'toggle',
      (event) => {
        const open = (event as ToggleEvent).newState === 'open';
        if (!open) this.closedAt = performance.now();
        this.options.trigger()?.setAttribute('aria-expanded', String(open));
      },
      {signal: abort.signal},
    );
  }

  private readonly onClick = (event: MouseEvent) => {
    const trigger = this.options.trigger();
    if (!trigger || !event.composedPath().includes(trigger)) return;
    // A pointer press on the open menu's trigger light-dismisses the menu
    // before this click: that click closes it, it doesn't reopen it.
    if (event.detail > 0 && performance.now() - this.closedAt < 250) return;
    this.open();
  };

  private readonly onKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }
    const trigger = this.options.trigger();
    if (!trigger || !event.composedPath().includes(trigger)) return;
    event.preventDefault();
    event.stopPropagation();
    this.open();
  };
}

/** Options of {@link renderOverflowMenu}. */
export interface RenderOverflowMenuOptions {
  /** Called when the menu closes. */
  onClose?: () => void;
}

/**
 * Renders the overflow menu of a host: an `md-gb-menu` (import
 * `menu/md-gb-menu.js` and `menu/md-gb-menu-item.js`) with an entry for each
 * hidden item. Choosing an entry clicks the original.
 */
export function renderOverflowMenu(
  controller: OverflowController,
  options: RenderOverflowMenuOptions = {},
): TemplateResult {
  const items = controller.overflowed;
  // No menu while nothing overflows (a closed menu still has a surface).
  if (!items.length) return html``;
  return html`<md-gb-menu
    class="overflow-menu"
    @toggle=${(event: ToggleEvent) => {
      if (event.newState === 'closed') options.onClose?.();
    }}>
    ${items.length
      ? items.map(
          (item) =>
            html`<md-gb-menu-item
              ?disabled=${isDisabled(item)}
              @click=${() => {
                controller.activate(item);
              }}>
              ${overflowLabel(item)}
            </md-gb-menu-item>`,
        )
      : nothing}
  </md-gb-menu>`;
}
