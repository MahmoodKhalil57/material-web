/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate } from "tslib";
import { ContextProvider } from '@lit/context';
import { css, html, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { internals, mixinElementInternals, } from '../../../behaviors/element-internals.js';
import { mixinFocusable } from '../../../behaviors/focusable.js';
import { AnchoredOverlayController } from '../shared/anchored-overlay.js';
import { clampDensity } from '../shared/density.js';
import { isReducedMotion, springDuration } from '../shared/motion.js';
import { nextFocusIndex } from '../shared/roving-focus.js';
import menuStyles from './menu.css.js'; // github-only
// import {styles as menuStyles} from './menu.cssresult.js'; // google3-only
import { menu, MENU_COLORS, menuContext, } from './menu.js';
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
const CONTEXT_MENU_MARGIN = { inline: 8, blockStart: 0, blockEnd: 48 };
/** Keys that open a submenu or close it, by text direction. */
function submenuKeys(element) {
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
function isInvokerOf(element, menu) {
    if (!element || element === menu || menu.contains(element))
        return false;
    const invoker = element;
    if (invoker.popoverTargetElement === menu)
        return true;
    if (invoker.commandForElement === menu)
        return true;
    const id = menu.id;
    return (!!id &&
        (element.getAttribute('popovertarget') === id ||
            element.getAttribute('commandfor') === id));
}
/** The closest `md-gb-menu` that contains `node` (itself included). */
export function closestMenu(node) {
    return node?.closest('md-gb-menu') ?? null;
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
    /** The text the menu is filtered by. Empty shows every item. */
    get filterQuery() {
        return this.filterText;
    }
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
    get density() {
        return this.densityValue;
    }
    set density(density) {
        const old = this.densityValue;
        this.densityValue = clampDensity(Number(density));
        this.requestUpdate('density', old);
    }
    /** The menu item whose submenu this menu is, if any. */
    get parentItem() {
        return this.hasAttribute('submenu')
            ? this.parentElement?.closest('md-gb-menu-item')
            : null;
    }
    /** The menu's items (not those of its submenus), in document order. */
    get items() {
        return this.allItems.filter((item) => !item.hidden);
    }
    /** Every item of the menu, filtered out ones included. */
    get allItems() {
        return Array.from(this.itemsSet).sort((a, b) => {
            return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_PRECEDING
                ? 1
                : -1;
        });
    }
    constructor() {
        super();
        /** The color style: `standard` (surface-based) or `vibrant` (tertiary). */
        this.color = MENU_COLORS.standard;
        /**
         * The layout: `standard` items on one surface, or `grouped`
         * `md-gb-menu-group`s on separate surfaces with gaps between them.
         */
        this.layout = 'standard';
        /**
         * The id of an element (in the same root) that opens this menu as a
         * context menu on a secondary click, the context menu key or a long press
         * (menus.md "Context menus ... usually open with a secondary click";
         * "Performs a specific action to trigger the menu, like right-click or
         * press-and-hold").
         */
        this.contextFor = '';
        /**
         * The id of a text field (in the same root) the menu is attached to. As
         * the person types in it, the menu opens (without taking focus) and shows
         * only the items whose label contains the text, case-insensitively
         * (menus.md "Filtering": "As someone types, the list of menu options
         * filters to show relevant results"). The remaining items ease into
         * their new position ("Menu items ease into their new position as the menu
         * is filtered"), unless motion is reduced. Fires `filter` with the query.
         */
        this.filterFor = '';
        this.filterText = '';
        this.densityValue = 0;
        /**
         * Whether a submenu of this menu holds focus or the pointer (menus.md
         * "Focus": "the corners of the focused submenu become more rounded, while
         * the unfocused submenu becomes less rounded").
         */
        this.inactive = false;
        /**
         * Set before opening to keep focus where it is (submenus opened by
         * hovering); reset when the menu opens.
         */
        this.skipInitialFocus = false;
        this.itemsSet = new Set();
        this.typeahead = '';
        this.typeaheadTime = -Infinity;
        this.contextTarget = null;
        this.longPressTimer = 0;
        this.longPressOpened = false;
        /** The invoker that opened the menu from the keyboard, for focus return. */
        this.keyboardInvoker = null;
        /** The invokers marked `aria-expanded` while the menu is open. */
        this.markedInvokers = new Set();
        /**
         * The popover (shown in front of all other UI), its position next to the
         * invoker or parent item (flipping when there is no room; context menus at
         * the pointer), light dismiss with a reason, and focus returning to the
         * invoker.
         */
        this.overlay = new AnchoredOverlayController(this, {
            surface: () => this,
            anchor: () => this.parentItem ?? this.overlay.source,
            popover: 'auto',
            placement: () => this.hasAttribute('context-menu')
                ? {
                    placement: 'below',
                    align: 'start',
                    spacing: 0,
                    margin: CONTEXT_MENU_MARGIN,
                }
                : this.hasAttribute('submenu')
                    ? { placement: 'end', align: 'start', spacing: 0 }
                    : {
                        placement: 'below',
                        // A split button's menu is end-aligned and 4dp from its button
                        // (CSS: `position-area` and `margin`, which JS placement drops).
                        align: this.cssValue('--menu-anchor-align') === 'end' ? 'end' : 'start',
                        spacing: parseFloat(this.cssValue('--menu-anchor-spacing')) || 0,
                    },
            returnTarget: (source) => this.parentItem ??
                source ??
                this.keyboardInvoker ??
                (this.contextTarget ? this.activeElementOutside() : null),
            onOpen: (source) => {
                this.markInvokers(true, source);
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
                this.markInvokers(false);
                this.inactive = false;
                this.removeAttribute('context-menu');
                const parentMenu = closestMenu(this.parentElement);
                if (parentMenu && this.hasAttribute('submenu')) {
                    parentMenu.inactive = false;
                }
            },
        });
        this[internals].role = 'menu';
        this.addController(new ContextProvider(this, {
            context: menuContext,
            initialValue: {
                menu: this,
                getItems: () => this.items,
                itemConnected: (item) => {
                    this.itemsSet.add(item);
                },
                itemDisconnected: (item) => {
                    this.itemsSet.delete(item);
                },
            },
        }));
        this.addEventListener('keydown', (event) => {
            this.handleKeydown(event);
        });
        // The menu that holds focus or the pointer is active; menus whose
        // submenu holds it are inactive. Events from submenus bubble through
        // their parent menus (submenus are children of their items).
        const engage = (event) => {
            const owner = closestMenu(event.target);
            this.inactive = !!owner && owner !== this && this.contains(owner);
        };
        this.addEventListener('focusin', engage);
        this.addEventListener('pointerover', engage);
    }
    connectedCallback() {
        super.connectedCallback();
        this.bindContextTarget();
        this.bindInvokerKeys();
        this.bindFilterTarget();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.filterAbort?.abort();
        this.filterAbort = undefined;
        this.unbindContextTarget();
        this.invokerAbort?.abort();
        this.invokerAbort = undefined;
    }
    cssValue(property) {
        return getComputedStyle(this).getPropertyValue(property).trim();
    }
    updated(changed) {
        if (changed.has('color') || changed.has('layout')) {
            // Items and groups mirror the menu's color and layout as classes
            // (menu.scss, for browsers without style queries).
            for (const child of this.querySelectorAll('md-gb-menu-item, md-gb-menu-group')) {
                child.requestUpdate?.();
            }
        }
        if (changed.has('contextFor')) {
            this.bindContextTarget();
        }
        if (changed.has('filterFor')) {
            this.bindFilterTarget();
        }
    }
    /**
     * Shows only the items whose label contains `query`, easing the others
     * into their new position.
     */
    filter(query) {
        const text = query.trim().toLowerCase();
        this.filterText = text;
        const open = this.matches(':popover-open');
        const items = this.allItems;
        const before = new Map();
        if (open) {
            for (const item of items) {
                if (!item.hidden)
                    before.set(item, item.getBoundingClientRect());
            }
        }
        for (const item of items) {
            item.hidden = !labelOf(item).includes(text);
        }
        // A group with nothing left to show goes away with its items.
        for (const group of this.querySelectorAll(':scope > md-gb-menu-group, :scope > .menu-group')) {
            const inside = items.filter((item) => group.contains(item));
            group.hidden = inside.length > 0 && inside.every((item) => item.hidden);
        }
        if (open && !isReducedMotion(this)) {
            const duration = springDuration(this, 'fast', 'spatial');
            const easing = getComputedStyle(this)
                .getPropertyValue('--md-sys-motion-spring-fast-spatial')
                .trim() || 'ease-out';
            for (const [item, from] of before) {
                if (item.hidden)
                    continue;
                const dy = from.top - item.getBoundingClientRect().top;
                if (!dy || !duration)
                    continue;
                // FLIP: start where the item was, ease to where it is.
                item.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }], { duration, easing });
            }
        }
        this.dispatchEvent(new CustomEvent('filter', {
            detail: { query: text, count: this.items.length },
        }));
    }
    bindFilterTarget() {
        this.filterAbort?.abort();
        this.filterAbort = undefined;
        if (!this.filterFor || !this.isConnected)
            return;
        const root = this.getRootNode();
        const target = root.getElementById?.(this.filterFor);
        if (!target)
            return;
        const abort = new AbortController();
        this.filterAbort = abort;
        target.addEventListener('input', (event) => {
            const origin = event.composedPath()[0];
            const value = target.value ?? origin.value;
            if (!this.matches(':popover-open')) {
                this.skipInitialFocus = true;
                try {
                    this.showPopover({
                        source: target,
                    });
                }
                catch {
                    // Already open.
                }
            }
            this.filter(typeof value === 'string' ? value : '');
        }, { signal: abort.signal });
    }
    /**
     * Opens the menu at a point in the viewport (a context menu), keeping it
     * inside the window: it opens below and after the point, and flips when
     * there is no room.
     *
     * @param x The viewport x coordinate (`clientX`).
     * @param y The viewport y coordinate (`clientY`).
     */
    showAt(x, y) {
        this.setAttribute('context-menu', '');
        this.overlay.openAt(x, y);
    }
    /** Closes this menu and every menu it is a submenu of. */
    closeAll() {
        let root = this;
        for (let parent = closestMenu(this.parentElement); parent && root.hasAttribute('submenu'); parent = closestMenu(parent.parentElement)) {
            root = parent;
        }
        if (root.matches(':popover-open')) {
            root.hidePopover();
        }
    }
    render() {
        return html `<div
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
    handleKeydown(event) {
        // Keys pressed in a submenu bubble through its parent menus.
        if (closestMenu(event.target) !== this)
            return;
        if (event.key === 'Tab') {
            event.preventDefault();
            this.closeAll();
            return;
        }
        const items = this.items;
        if (!items.length)
            return;
        const index = items.findIndex((item) => item.matches(':focus-within'));
        if (this.hasAttribute('submenu') && event.key === submenuKeys(this).close) {
            event.preventDefault();
            // Focus returns to the item that opened the submenu.
            this.hidePopover();
            return;
        }
        const focusAt = (i) => {
            event.preventDefault();
            items[(i + items.length) % items.length].focus();
        };
        // Up / Down (wrapping), Home / End: shared roving focus movement. Disabled
        // items stay focusable (menus spec: they can be active, not selected).
        // spec: menus/accessibility/keyboard-navigation
        if (!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
            const to = nextFocusIndex(items.length, index, event.key, { orientation: 'vertical' });
            if (to >= 0) {
                focusAt(to);
                return;
            }
        }
        // Typeahead: "Focus moves to the next menu item starting with letter".
        if (event.key.length === 1 &&
            event.key !== ' ' &&
            !event.ctrlKey &&
            !event.metaKey &&
            !event.altKey) {
            const now = event.timeStamp;
            const extend = now - this.typeaheadTime <= TYPEAHEAD_BUFFER_MS;
            this.typeaheadTime = now;
            this.typeahead = (extend ? this.typeahead : '') + event.key.toLowerCase();
            const repeated = [...this.typeahead].every((c) => c === this.typeahead[0]);
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
    bindInvokerKeys() {
        this.invokerAbort?.abort();
        const abort = new AbortController();
        this.invokerAbort = abort;
        const root = this.getRootNode();
        root.addEventListener('keydown', (event) => {
            const e = event;
            if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp')
                return;
            if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey)
                return;
            if (this.hasAttribute('submenu') || this.matches(':popover-open')) {
                return;
            }
            const target = e.target;
            if (!isInvokerOf(target, this))
                return;
            e.preventDefault();
            this.keyboardInvoker = target;
            // `source` (where supported) ties the popover to its invoker, as a
            // click on the invoker would.
            this.showPopover({
                source: target,
            });
        }, { signal: abort.signal });
    }
    /**
     * Marks the menu's invokers as expanded while it is open, the hook for
     * the trigger components to draw it pressed (menus.md "Selecting": "the
     * corresponding button or icon button should remain the same visually,
     * with the addition of a pressed state ... even when opening from a
     * keyboard shortcut"). It follows the popover's toggle, so every way of
     * opening the menu is covered.
     */
    markInvokers(open, source) {
        if (this.hasAttribute('submenu') || this.hasAttribute('context-menu')) {
            return;
        }
        if (open) {
            const root = this.getRootNode();
            const invokers = new Set(Array.from(root.querySelectorAll('[popovertarget], [commandfor]')).filter((el) => isInvokerOf(el, this)));
            // A source inside an invoker's shadow root (the button of an
            // `md-gb-button`) is covered by its host, which carries the state.
            const sourceHost = source?.getRootNode()
                ?.host;
            if (source &&
                !this.contains(source) &&
                !(sourceHost && invokers.has(sourceHost))) {
                invokers.add(source);
            }
            if (this.keyboardInvoker)
                invokers.add(this.keyboardInvoker);
            this.markedInvokers = invokers;
        }
        for (const invoker of this.markedInvokers) {
            invoker.setAttribute('aria-expanded', String(open));
        }
        if (!open)
            this.markedInvokers = new Set();
    }
    activeElementOutside() {
        let active = document.activeElement;
        while (active?.shadowRoot?.activeElement) {
            active = active.shadowRoot.activeElement;
        }
        return active instanceof HTMLElement && !this.contains(active)
            ? active
            : null;
    }
    bindContextTarget() {
        this.unbindContextTarget();
        if (!this.contextFor || !this.isConnected)
            return;
        const root = this.getRootNode();
        const target = root.getElementById?.(this.contextFor);
        if (!target)
            return;
        this.contextTarget = target;
        const abort = new AbortController();
        this.contextAbort = abort;
        const { signal } = abort;
        // A secondary click, the context menu key and Shift+F10 (and, in most
        // browsers, a long press) fire `contextmenu`.
        target.addEventListener('contextmenu', (event) => {
            const e = event;
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
            }
            else {
                this.showAt(e.clientX, e.clientY);
            }
        }, { signal });
        // Long press with touch, for browsers that do not fire `contextmenu`.
        let start = null;
        const cancel = () => {
            clearTimeout(this.longPressTimer);
            start = null;
        };
        target.addEventListener('pointerdown', (event) => {
            const e = event;
            if (e.pointerType !== 'touch')
                return;
            this.longPressOpened = false;
            start = { x: e.clientX, y: e.clientY };
            clearTimeout(this.longPressTimer);
            this.longPressTimer = window.setTimeout(() => {
                if (!start)
                    return;
                this.longPressOpened = true;
                this.showAt(start.x, start.y);
                start = null;
            }, LONG_PRESS_MS);
        }, { signal });
        target.addEventListener('pointermove', (event) => {
            const e = event;
            if (start &&
                Math.hypot(e.clientX - start.x, e.clientY - start.y) >
                    LONG_PRESS_SLOP_PX) {
                cancel();
            }
        }, { signal });
        for (const type of ['pointerup', 'pointercancel']) {
            target.addEventListener(type, cancel, { signal });
        }
    }
    unbindContextTarget() {
        this.contextAbort?.abort();
        this.contextAbort = undefined;
        this.contextTarget = null;
        clearTimeout(this.longPressTimer);
    }
}
/** @nocollapse */
MenuElement.styles = [menuStyles, css ``];
__decorate([
    property()
], MenuElement.prototype, "color", void 0);
__decorate([
    property({ reflect: true })
], MenuElement.prototype, "layout", void 0);
__decorate([
    property({ attribute: 'context-for' })
], MenuElement.prototype, "contextFor", void 0);
__decorate([
    property({ attribute: 'filter-for' })
], MenuElement.prototype, "filterFor", void 0);
__decorate([
    property({ type: Number, reflect: true })
], MenuElement.prototype, "density", null);
__decorate([
    state()
], MenuElement.prototype, "inactive", void 0);
/** The lowercase label text of an item, for typeahead. */
function labelOf(item) {
    const label = Array.from(item.childNodes)
        .filter((node) => node.nodeType === Node.TEXT_NODE ||
        (node instanceof Element && !node.hasAttribute('slot')))
        .map((node) => node.textContent ?? '')
        .join('');
    return label.trim().toLowerCase();
}
//# sourceMappingURL=menu-element.js.map