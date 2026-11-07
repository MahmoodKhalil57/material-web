/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ContextProvider} from '@lit/context';
import {css, CSSResultOrNative, html, LitElement} from 'lit';
import {property, state} from 'lit/decorators.js';
import {
  internals,
  mixinElementInternals,
} from '../../../behaviors/element-internals.js';
import {mixinFocusable} from '../../../behaviors/focusable.js';

import {AnchoredOverlayController} from '../shared/anchored-overlay.js';
import {clampDensity, type Density} from '../shared/density.js';
import {nextFocusIndex} from '../shared/roving-focus.js';
import menuStyles from './menu.css' with {type: 'css'}; // github-only
// import {styles as menuStyles} from './menu.cssresult.js'; // google3-only

import {
  menu,
  MENU_COLORS,
  menuContext,
  type MenuColor,
  type MenuLayout,
} from './menu.js';

// Separate variable needed for closure.
const baseClass = mixinElementInternals(mixinFocusable(LitElement));

/**
 * The longest pause between typeahead keystrokes that still extends the
 * search (the `md-menu` default, `DEFAULT_TYPEAHEAD_BUFFER_TIME`).
 */
const TYPEAHEAD_BUFFER_MS = 200;

/**
 * How long a touch must be held to open a context menu (the Android
 * `ViewConfiguration.getLongPressTimeout()` default Compose uses for long
 * presses), and how far it may move.
 */
export const LONG_PRESS_MS = 400;
const LONG_PRESS_SLOP_PX = 10;

/**
 * Space kept between a context menu and the window edges (Compose
 * `MenuHorizontalMargin` / `MenuVerticalMargin`).
 */
const CONTEXT_MENU_MARGIN = {inline: 8, blockStart: 0, blockEnd: 48};

/** Keys that open a submenu or close it, by text direction. */
function submenuKeys(element: Element) {
  const rtl = element.matches(':dir(rtl)');
  return {
    open: rtl ? 'ArrowLeft' : 'ArrowRight',
    close: rtl ? 'ArrowRight' : 'ArrowLeft',
  };
}

/**
 * Whether `element` opens `menu` as its popover invoker: a `popovertarget`
 * or `commandfor` button.
 */
function isInvokerOf(element: Element | null, menu: HTMLElement) {
  if (!element || element === menu || menu.contains(element)) return false;
  const invoker = element as HTMLButtonElement & {
    commandForElement?: Element | null;
  };
  if (invoker.popoverTargetElement === menu) return true;
  if (invoker.commandForElement === menu) return true;
  const id = menu.id;
  return (
    !!id &&
    (element.getAttribute('popovertarget') === id ||
      element.getAttribute('commandfor') === id)
  );
}

/** The closest `md-gb-menu` that contains `node` (itself included). */
export function closestMenu(node: Element | null): MenuElement | null {
  return (node?.closest('md-gb-menu') as MenuElement | null) ?? null;
}

// spec-labels: menus/guidelines/anatomy, menus/specs/anatomy/vertical-menus,
// spec-labels: menus/specs/variants/vertical-menus, menus/specs/configurations/vertical-menus-layout,
// spec-labels: menus/specs/color, menus/guidelines/flexibility-slots,
// spec-labels: menus/guidelines/usage/opening-menus, menus/guidelines/usage/menu-groups,
// spec-labels: menus/guidelines/anatomy/gaps-dividers-optional
/**
 * A Material Design vertical menu.
 *
 * Menus are popovers: open them with a `popovertarget` invoker,
 * `showPopover()`, `showAt()` or as a context menu (`context-for`).
 *
 * Keyboard (menus.md "Keyboard navigation"): on the closed menu's button
 * (its `popovertarget` or `commandfor` invoker), Up and Down open the menu
 * ("For closed menus: Opens menu") and focus its first item; Space and Enter
 * open it natively. In the open menu, Up and Down move between items
 * (disabled items included: "Disabled menu items can receive focus"), Home
 * and End go to the first and last item, letters move to the next item
 * starting with them, Escape and Tab close the menu. In a submenu, Left
 * (Right in RTL) closes it and returns focus to its item.
 *
 * @slot - The menu's items, groups and dividers.
 * @csspart menu - The menu's root element.
 * @cssprop --container-color
 * @cssprop --container-elevation
 * @cssprop --container-shape
 * @cssprop --container-min-width
 * @cssprop --container-max-width
 * @cssprop --gap - Space between groups in the grouped layout.
 * @cssprop --group-padding
 * @cssprop --group-shape
 * @cssprop --section-label-text-color
 * @cssprop --section-label-text
 * @cssprop --density-step - Item height removed per density step (set on
 *   the items).
 */
export class MenuElement extends baseClass {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [menuStyles, css``];

  /** The color style: `standard` (surface-based) or `vibrant` (tertiary). */
  @property() color: MenuColor = MENU_COLORS.standard;

  /**
   * The layout: `standard` items on one surface, or `grouped`
   * `md-gb-menu-group`s on separate surfaces with gaps between them.
   */
  @property({reflect: true}) layout: MenuLayout = 'standard';

  /**
   * The id of an element (in the same root) that opens this menu as a
   * context menu on a secondary click, the context menu key or a long press
   * (menus.md "Context menus ... usually open with a secondary click";
   * "Performs a specific action to trigger the menu, like right-click or
   * press-and-hold").
   */
  @property({attribute: 'context-for'}) contextFor = '';

  /**
   * The density, from 0 (default) to -3 (menus.md "Density": "On web only,
   * density levels control the spacing between elements. Increasing density
   * decreases the top and bottom padding"). Each step removes 4px from the
   * items' height; submenus inherit it. Values are clamped to that range.
   *
   * Dense items are smaller than the 48px recommended target, so don't
   * apply density by default; let people opt in (grids-spacing.md "Avoid
   * applying component scaling by default").
   */
  @property({type: Number, reflect: true})
  get density(): Density {
    return this.densityValue;
  }
  set density(density: number) {
    const old = this.densityValue;
    this.densityValue = clampDensity(Number(density));
    this.requestUpdate('density', old);
  }
  private densityValue: Density = 0;

  /** The menu item whose submenu this menu is, if any. */
  get parentItem(): HTMLElement | null {
    return this.hasAttribute('submenu')
      ? (this.parentElement?.closest('md-gb-menu-item') as HTMLElement | null)
      : null;
  }

  /** The menu's items (not those of its submenus), in document order. */
  get items(): HTMLElement[] {
    return Array.from(this.itemsSet).sort((a, b) => {
      return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_PRECEDING
        ? 1
        : -1;
    });
  }

  /**
   * Whether a submenu of this menu holds focus or the pointer (menus.md
   * "Focus": "the corners of the focused submenu become more rounded, while
   * the unfocused submenu becomes less rounded").
   */
  @state() private inactive = false;

  /**
   * Set before opening to keep focus where it is (submenus opened by
   * hovering); reset when the menu opens.
   */
  skipInitialFocus = false;

  private readonly itemsSet = new Set<HTMLElement>();
  private typeahead = '';
  private typeaheadTime = -Infinity;
  private contextTarget: Element | null = null;
  private contextAbort?: AbortController;
  private longPressTimer = 0;
  private longPressOpened = false;
  private invokerAbort?: AbortController;
  /** The invoker that opened the menu from the keyboard, for focus return. */
  private keyboardInvoker: HTMLElement | null = null;

  /**
   * The popover (shown in front of all other UI), its position next to the
   * invoker or parent item (flipping when there is no room; context menus at
   * the pointer), light dismiss with a reason, and focus returning to the
   * invoker.
   */
  private readonly overlay = new AnchoredOverlayController(this, {
    surface: () => this,
    anchor: (): HTMLElement | null => this.parentItem ?? this.overlay.source,
    popover: 'auto',
    placement: () =>
      this.hasAttribute('context-menu')
        ? {
            placement: 'below',
            align: 'start',
            spacing: 0,
            margin: CONTEXT_MENU_MARGIN,
          }
        : this.hasAttribute('submenu')
          ? {placement: 'end', align: 'start', spacing: 0}
          : {placement: 'below', align: 'start', spacing: 0},
    returnTarget: (source) =>
      this.parentItem ??
      source ??
      this.keyboardInvoker ??
      (this.contextTarget ? this.activeElementOutside() : null),
    onOpen: () => {
      // Focus the first item (menus.md "Initial focus": "focus should be
      // placed on the first menu item").
      const skip = this.skipInitialFocus;
      this.skipInitialFocus = false;
      this.keyboardInvoker = null;
      if (!skip) {
        setTimeout(() => {
          this.items[0]?.focus();
        });
      }
    },
    onClose: () => {
      this.inactive = false;
      this.removeAttribute('context-menu');
      const parentMenu = closestMenu(this.parentElement);
      if (parentMenu && this.hasAttribute('submenu')) {
        parentMenu.inactive = false;
      }
    },
  });

  constructor() {
    super();
    this[internals].role = 'menu';
    this.addController(
      new ContextProvider(this, {
        context: menuContext,
        initialValue: {
          menu: this,
          getItems: () => this.items,
          itemConnected: (item: HTMLElement) => {
            this.itemsSet.add(item);
          },
          itemDisconnected: (item: HTMLElement) => {
            this.itemsSet.delete(item);
          },
        },
      }),
    );

    this.addEventListener('keydown', (event) => {
      this.handleKeydown(event);
    });

    // The menu that holds focus or the pointer is active; menus whose
    // submenu holds it are inactive. Events from submenus bubble through
    // their parent menus (submenus are children of their items).
    const engage = (event: Event) => {
      const owner = closestMenu(event.target as Element);
      this.inactive = !!owner && owner !== this && this.contains(owner);
    };
    this.addEventListener('focusin', engage);
    this.addEventListener('pointerover', engage);
  }

  override connectedCallback() {
    super.connectedCallback();
    this.bindContextTarget();
    this.bindInvokerKeys();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.unbindContextTarget();
    this.invokerAbort?.abort();
    this.invokerAbort = undefined;
  }

  protected override updated(changed: Map<string, unknown>) {
    if (changed.has('contextFor')) {
      this.bindContextTarget();
    }
  }

  /**
   * Opens the menu at a point in the viewport (a context menu), keeping it
   * inside the window: it opens below and after the point, and flips when
   * there is no room.
   *
   * @param x The viewport x coordinate (`clientX`).
   * @param y The viewport y coordinate (`clientY`).
   */
  showAt(x: number, y: number) {
    this.setAttribute('context-menu', '');
    this.overlay.openAt(x, y);
  }

  /** Closes this menu and every menu it is a submenu of. */
  closeAll() {
    let root: MenuElement = this;
    for (
      let parent = closestMenu(this.parentElement);
      parent && root.hasAttribute('submenu');
      parent = closestMenu(parent.parentElement)
    ) {
      root = parent;
    }
    if (root.matches(':popover-open')) {
      root.hidePopover();
    }
  }

  protected override render() {
    return html`<div
      part="menu"
      class="${menu({
        color: this.color,
        layout: this.layout,
        submenu: this.inactive ? 'inactive' : undefined,
        density: this.density,
      })} menu-host"
    >
      <slot></slot>
    </div>`;
  }

  private handleKeydown(event: KeyboardEvent) {
    // Keys pressed in a submenu bubble through its parent menus.
    if (closestMenu(event.target as Element) !== this) return;

    if (event.key === 'Tab') {
      event.preventDefault();
      this.closeAll();
      return;
    }

    const items = this.items;
    if (!items.length) return;
    const index = items.findIndex((item) => item.matches(':focus-within'));

    if (this.hasAttribute('submenu') && event.key === submenuKeys(this).close) {
      event.preventDefault();
      // Focus returns to the item that opened the submenu.
      this.hidePopover();
      return;
    }

    const focusAt = (i: number) => {
      event.preventDefault();
      items[(i + items.length) % items.length].focus();
    };

    // Up / Down (wrapping), Home / End: shared roving focus movement. Disabled
    // items stay focusable (menus spec: they can be active, not selected).
    // spec: menus/accessibility/keyboard-navigation
    if (!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
      const to = nextFocusIndex(items.length, index, event.key, {orientation: 'vertical'});
      if (to >= 0) {
        focusAt(to);
        return;
      }
    }

    // Typeahead: "Focus moves to the next menu item starting with letter".
    if (
      event.key.length === 1 &&
      event.key !== ' ' &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      const now = event.timeStamp;
      const extend = now - this.typeaheadTime <= TYPEAHEAD_BUFFER_MS;
      this.typeaheadTime = now;
      this.typeahead = (extend ? this.typeahead : '') + event.key.toLowerCase();
      const repeated = [...this.typeahead].every(
        (c) => c === this.typeahead[0],
      );
      // Repeating one letter cycles through the items starting with it.
      const query = repeated ? this.typeahead[0] : this.typeahead;
      const start = repeated || index === -1 ? index + 1 : index;
      for (let n = 0; n < items.length; n++) {
        const item = items[(start + n) % items.length];
        if (labelOf(item).startsWith(query)) {
          event.preventDefault();
          item.focus();
          return;
        }
      }
    }
  }

  /**
   * Up and Down on the closed menu's button open the menu (menus.md
   * "Keyboard navigation": "Up and Down arrows: For closed menus: Opens
   * menu"). A native `popovertarget` button only opens it with Space, Enter
   * or a click. Listens in the menu's root, where its invokers are.
   */
  private bindInvokerKeys() {
    this.invokerAbort?.abort();
    const abort = new AbortController();
    this.invokerAbort = abort;
    const root = this.getRootNode() as Document | ShadowRoot;
    root.addEventListener(
      'keydown',
      (event) => {
        const e = event as KeyboardEvent;
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
        if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
        if (this.hasAttribute('submenu') || this.matches(':popover-open')) {
          return;
        }
        const target = e.target as HTMLElement | null;
        if (!isInvokerOf(target, this)) return;
        e.preventDefault();
        this.keyboardInvoker = target;
        // `source` (where supported) ties the popover to its invoker, as a
        // click on the invoker would.
        (this.showPopover as (options?: {source?: HTMLElement}) => void)({
          source: target,
        });
      },
      {signal: abort.signal},
    );
  }

  private activeElementOutside(): HTMLElement | null {
    let active = document.activeElement;
    while (active?.shadowRoot?.activeElement) {
      active = active.shadowRoot.activeElement;
    }
    return active instanceof HTMLElement && !this.contains(active)
      ? active
      : null;
  }

  private bindContextTarget() {
    this.unbindContextTarget();
    if (!this.contextFor || !this.isConnected) return;
    const root = this.getRootNode() as Document | ShadowRoot;
    const target = root.getElementById?.(this.contextFor);
    if (!target) return;
    this.contextTarget = target;
    const abort = new AbortController();
    this.contextAbort = abort;
    const {signal} = abort;

    // A secondary click, the context menu key and Shift+F10 (and, in most
    // browsers, a long press) fire `contextmenu`.
    target.addEventListener(
      'contextmenu',
      (event) => {
        const e = event as MouseEvent;
        e.preventDefault();
        if (this.longPressOpened) {
          // Already opened by the long press below.
          this.longPressOpened = false;
          return;
        }
        if (e.clientX === 0 && e.clientY === 0) {
          // From the keyboard: open at the target.
          const rect = target.getBoundingClientRect();
          this.showAt(rect.left, rect.bottom);
        } else {
          this.showAt(e.clientX, e.clientY);
        }
      },
      {signal},
    );

    // Long press with touch, for browsers that do not fire `contextmenu`.
    let start: {x: number; y: number} | null = null;
    const cancel = () => {
      clearTimeout(this.longPressTimer);
      start = null;
    };
    target.addEventListener(
      'pointerdown',
      (event) => {
        const e = event as PointerEvent;
        if (e.pointerType !== 'touch') return;
        this.longPressOpened = false;
        start = {x: e.clientX, y: e.clientY};
        clearTimeout(this.longPressTimer);
        this.longPressTimer = window.setTimeout(() => {
          if (!start) return;
          this.longPressOpened = true;
          this.showAt(start.x, start.y);
          start = null;
        }, LONG_PRESS_MS);
      },
      {signal},
    );
    target.addEventListener(
      'pointermove',
      (event) => {
        const e = event as PointerEvent;
        if (
          start &&
          Math.hypot(e.clientX - start.x, e.clientY - start.y) >
            LONG_PRESS_SLOP_PX
        ) {
          cancel();
        }
      },
      {signal},
    );
    for (const type of ['pointerup', 'pointercancel']) {
      target.addEventListener(type, cancel, {signal});
    }
  }

  private unbindContextTarget() {
    this.contextAbort?.abort();
    this.contextAbort = undefined;
    this.contextTarget = null;
    clearTimeout(this.longPressTimer);
  }
}

/** The lowercase label text of an item, for typeahead. */
function labelOf(item: HTMLElement) {
  const label = Array.from(item.childNodes)
    .filter(
      (node) =>
        node.nodeType === Node.TEXT_NODE ||
        (node instanceof Element && !node.hasAttribute('slot')),
    )
    .map((node) => node.textContent ?? '')
    .join('');
  return label.trim().toLowerCase();
}
