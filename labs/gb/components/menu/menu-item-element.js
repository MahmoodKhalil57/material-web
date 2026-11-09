/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate } from "tslib";
import { consume } from '@lit/context';
import { css, html, LitElement, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { afterDispatch, setupDispatchHooks, } from '../../../../internal/events/dispatch-hooks.js';
import { internals, mixinElementInternals, } from '../../../behaviors/element-internals.js';
import { isFocusable, mixinFocusable } from '../../../behaviors/focusable.js';
import { hasSlotted } from '../shared/has-slotted.js';
import focusRingStyles from '../focus/focus-ring.css' with { type: 'css' }; // github-only
// import focusRingStyles from '../focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css' with { type: 'css' }; // github-only
// import rippleStyles from '../ripple/ripple.cssresult.js'; // google3-only
import menuStyles from './menu.css' with { type: 'css' }; // github-only
// import {styles as menuStyles} from './menu.cssresult.js'; // google3-only
import { MENU_CLASSES, menuContext, menuItem, menuItemCheckable, } from './menu.js';
// Separate variable needed for closure.
const baseClass = mixinElementInternals(mixinFocusable(LitElement));
/**
 * How long the pointer rests on (or leaves) an item before its submenu opens
 * (or closes); the `md-sub-menu` `hover-open-delay` / `hover-close-delay`
 * defaults.
 */
export const SUBMENU_HOVER_DELAY_MS = 400;
let submenuAnchorId = 0;
/**
 * A Material Design menu item component.
 *
 * An item can open a submenu: an `md-gb-menu` in its `submenu` slot. The
 * submenu opens next to the item on click, Enter, Space, Right (Left in
 * RTL) or after the pointer rests on the item, and closes when the pointer
 * leaves both or on Left (Right in RTL) / Escape (menus.md "Left and Right
 * arrows: Opens or closes a submenu").
 *
 * @slot - Used to display the item's primary label.
 * @slot leading - Used to display icons and content before the item's main content.
 * @slot supporting-text - Used to display supporting text below the main label.
 * @slot trailing-text - Used to display metadata or text after the item's main content.
 * @slot trailing - Used to display icons and content after the item's main content.
 * @slot submenu - An `md-gb-menu` to open as this item's submenu.
 * @fires {Event} change - Fired when a checkbox or menu item is checked or unchecked. --bubbles
 * @fires {InputEvent} input - Fired when a checkbox or menu item is checked or unchecked. --bubbles --composed
 * @csspart menu-item - The menu item's root element.
 * @cssprop --between-space
 * @cssprop --bottom-space
 * @cssprop --container-color
 * @cssprop --height
 * @cssprop --inner-corner-corner-size
 * @cssprop --label-text-color
 * @cssprop --label-text
 * @cssprop --label-text-axes
 * @cssprop --label-text-tracking
 * @cssprop --leading-icon-color
 * @cssprop --leading-icon-size
 * @cssprop --leading-space
 * @cssprop --shape
 * @cssprop --supporting-text-color
 * @cssprop --supporting-text
 * @cssprop --supporting-text-axes
 * @cssprop --supporting-text-tracking
 * @cssprop --top-space
 * @cssprop --trailing-icon-color
 * @cssprop --trailing-icon-size
 * @cssprop --trailing-space
 * @cssprop --trailing-supporting-text
 * @cssprop --trailing-supporting-text-axes
 * @cssprop --trailing-supporting-text-color
 * @cssprop --trailing-supporting-text-tracking
 */
export class MenuItemElement extends baseClass {
    get menu() {
        return this.menuContext?.menu || null;
    }
    /**
     * The menu's color as a class on the item's root, for browsers without
     * style queries (menu.scss).
     */
    syncVibrantClass() {
        const vibrant = this.menu?.color === 'vibrant';
        this.shadowRoot
            ?.querySelector('.menu-item')
            ?.classList.toggle(MENU_CLASSES.menuVibrant, vibrant);
    }
    /** The item's submenu, if it has one. */
    get submenu() {
        return this.querySelector(':scope > [slot="submenu"]');
    }
    constructor() {
        super();
        this.checked = false;
        this.disabled = false;
        this.hasSubmenu = false;
        this.expanded = false;
        this.hoverTimer = 0;
        /**
         * The label of an item with text and an icon is the text: its icons are
         * decorative (menus.md, Labeling elements), so a slotted icon without a
         * label of its own is hidden from assistive technology.
         */
        this.markIconsDecorative = (event) => {
            const slot = event.target;
            for (const icon of slot.assignedElements({ flatten: true })) {
                if (!icon.matches('md-gb-icon, svg, img[alt=""]'))
                    continue;
                if (icon.hasAttribute('aria-label') || icon.hasAttribute('aria-labelledby'))
                    continue;
                icon.setAttribute('aria-hidden', 'true');
            }
        };
        this.onSubmenuToggle = (event) => {
            if (event.target !== this.submenu)
                return;
            this.expanded = event.newState === 'open';
        };
        this.onSubmenuPointerEnter = () => {
            // The pointer moved from this item into its submenu: keep it open.
            clearTimeout(this.hoverTimer);
        };
        this.onSubmenuPointerLeave = (event) => {
            if (event.pointerType === 'touch')
                return;
            this.scheduleHover(false);
        };
        this.boundSubmenus = [];
        this[internals].role = 'menuitem';
        setupDispatchHooks(this, 'click');
        this.addEventListener('click', (e) => {
            // Clicks in the submenu bubble through this item; they are not ours.
            if (this.isFromSubmenu(e))
                return;
            if (this.disabled) {
                e.stopImmediatePropagation();
                return;
            }
            const wasChecked = this.checked;
            afterDispatch(e, () => {
                if (e.defaultPrevented)
                    return;
                if (this.submenu) {
                    this.openSubmenu();
                    return;
                }
                if (this.checkable) {
                    // TODO: radio menu items should not be allowed to uncheck themselves.
                    this.checked = !wasChecked;
                    this.dispatchEvent(new Event('change', { bubbles: true }));
                    this.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
                }
                // Multi-select menus "stay open until the person dismisses the
                // menu"; any other selection closes the menu and its parents.
                if (this.checkable !== 'multiple') {
                    const menu = this.menu;
                    if (menu?.closeAll) {
                        menu.closeAll();
                    }
                    else {
                        menu?.hidePopover();
                    }
                }
            });
        });
        this.addEventListener('keydown', (e) => {
            // Keys pressed in the submenu bubble through this item.
            if (e.target !== this || this.disabled)
                return;
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
                return;
            }
            const rtl = this.matches(':dir(rtl)');
            if (this.submenu && e.key === (rtl ? 'ArrowLeft' : 'ArrowRight')) {
                e.preventDefault();
                e.stopPropagation();
                this.openSubmenu();
            }
        });
        // Submenus open on hover after a short rest and close when the pointer
        // leaves the item and the submenu.
        this.addEventListener('pointerenter', (e) => {
            if (e.pointerType === 'touch')
                return;
            this.scheduleHover(true);
        });
        this.addEventListener('pointerleave', (e) => {
            if (e.pointerType === 'touch')
                return;
            this.scheduleHover(false);
        });
    }
    connectedCallback() {
        super.connectedCallback();
        this.menuContext?.itemConnected(this);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.menuContext?.itemDisconnected(this);
        clearTimeout(this.hoverTimer);
    }
    /**
     * Opens the item's submenu next to it and focuses its first item.
     *
     * @param focus Whether to move focus into the submenu (default true).
     */
    openSubmenu(focus = true) {
        const submenu = this.submenu;
        if (!submenu || this.disabled)
            return;
        clearTimeout(this.hoverTimer);
        if (!submenu.matches(':popover-open')) {
            // Anchors the submenu to this item (CSS anchor positioning).
            const name = `--md-gb-submenu-${++submenuAnchorId}`;
            this.style.setProperty('anchor-name', name);
            submenu.style.setProperty('position-anchor', name);
            // A submenu opened by hovering does not take focus.
            submenu.skipInitialFocus =
                !focus;
            submenu.showPopover();
        }
        else if (focus) {
            submenu.items?.[0]?.focus();
        }
    }
    /** Closes the item's submenu. */
    closeSubmenu() {
        clearTimeout(this.hoverTimer);
        const submenu = this.submenu;
        if (submenu?.matches(':popover-open')) {
            submenu.hidePopover();
        }
    }
    render() {
        return html `<div
        part="menu-item"
        class="${menuItem({
            checked: this.checked,
            disabled: this.disabled,
            classes: { 'menu-item-expanded': this.expanded },
        })} ripple-host focus-ring-host"
      >
        ${this.renderContent()}
      </div>
      <slot name="submenu" @slotchange=${this.onSubmenuSlotChange}></slot>`;
    }
    renderContent() {
        return html `
      <span class="menu-item-leading">
        <slot
          name="leading"
          ${hasSlotted()}
          @slotchange=${this.markIconsDecorative}>
          ${this.checked ? html `<span class="checkmark" aria-hidden="true">check</span>` : nothing}
        </slot>
      </span>
      <span class="menu-item-content">
        <slot></slot>
        <slot name="supporting-text" class="menu-item-supporting-text"></slot>
      </span>
      <span class="menu-item-trailing">
        <slot
          name="trailing-text"
          class="menu-item-trailing-text"
          ${hasSlotted()}
        ></slot>
        <slot
          name="trailing"
          ${hasSlotted()}
          @slotchange=${this.markIconsDecorative}>
          ${this.hasSubmenu
            ? html `<span class="menu-item-submenu-icon" aria-hidden="true"
                  >arrow_right</span
                >`
            : nothing}
        </slot>
      </span>
    `;
    }
    willUpdate(changed) {
        super.willUpdate(changed);
        this.syncRole();
    }
    /** The role and checked state follow the group's `checkable` context. */
    syncRole() {
        if (this.hasSubmenu) {
            this[internals].role = 'menuitem';
        }
        else if (this.checkable === 'single') {
            this[internals].role = 'menuitemradio';
        }
        else if (this.checkable === 'multiple') {
            this[internals].role = 'menuitemcheckbox';
        }
        else {
            this[internals].role = 'menuitem';
        }
        if (this.checkable && !this.hasSubmenu) {
            this[internals].ariaChecked = String(this.checked);
        }
        else {
            this[internals].ariaChecked = null;
        }
    }
    updated() {
        this.syncVibrantClass();
        this.syncRole();
        this[internals].ariaHasPopup = this.hasSubmenu ? 'menu' : null;
        this[internals].ariaExpanded = this.hasSubmenu
            ? String(this.expanded)
            : null;
        this[internals].ariaDisabled = String(this.disabled);
        // Disabled items stay focusable (menus.md "Disabled menu items can
        // receive focus but aren't selectable"): only removed from the tab order.
        this[isFocusable] = !this.disabled;
    }
    onSubmenuSlotChange() {
        for (const submenu of this.boundSubmenus) {
            submenu.removeEventListener('toggle', this.onSubmenuToggle);
            submenu.removeEventListener('pointerenter', this.onSubmenuPointerEnter);
            submenu.removeEventListener('pointerleave', this.onSubmenuPointerLeave);
            submenu.removeAttribute('submenu');
        }
        const submenu = this.submenu;
        this.boundSubmenus = submenu ? [submenu] : [];
        this.hasSubmenu = !!submenu;
        if (!submenu)
            return;
        submenu.setAttribute('submenu', '');
        submenu.addEventListener('toggle', this.onSubmenuToggle);
        submenu.addEventListener('pointerenter', this.onSubmenuPointerEnter);
        submenu.addEventListener('pointerleave', this.onSubmenuPointerLeave);
    }
    scheduleHover(open) {
        const submenu = this.submenu;
        if (!submenu || this.disabled)
            return;
        clearTimeout(this.hoverTimer);
        const isOpen = submenu.matches(':popover-open');
        if (open === isOpen)
            return;
        this.hoverTimer = window.setTimeout(() => {
            if (open) {
                this.openSubmenu(false);
            }
            else if (!submenu.matches(':hover, :focus-within')) {
                this.closeSubmenu();
            }
        }, SUBMENU_HOVER_DELAY_MS);
    }
    isFromSubmenu(event) {
        const submenu = this.submenu;
        return !!submenu && event.composedPath().includes(submenu);
    }
}
/** @nocollapse */
MenuItemElement.styles = [
    focusRingStyles,
    rippleStyles,
    menuStyles,
    css `
      :host {
        display: flex;
        outline: none;
      }
      :host([hidden]) {
        display: none;
      }
      .menu-item {
        flex: 1;
      }
      :is(.menu-item-leading, .menu-item-trailing):not(
        :has(.has-slotted, .checkmark, .menu-item-submenu-icon)
      ) {
        display: none;
      }
      slot:not(.has-slotted) {
        display: contents;
      }
      .checkmark,
      .menu-item-submenu-icon {
        display: flex;
        font: var(--md-icon-size) var(--md-icon-font);
        font-variation-settings: 'FILL' var(--md-icon-fill, 0);
      }
      slot[name='submenu'] {
        display: contents;
      }
      /* The item that revealed an open submenu shows the active state layer
         (md.comp.menus.*.menu-item.active.state-layer.opacity, 8%). */
      .menu-item-expanded {
        --ripple-hover-opacity: 8%;
      }
    `,
];
__decorate([
    property({ type: Boolean, reflect: true })
], MenuItemElement.prototype, "checked", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], MenuItemElement.prototype, "disabled", void 0);
__decorate([
    consume({ context: menuContext, subscribe: true })
], MenuItemElement.prototype, "menuContext", void 0);
__decorate([
    state(),
    consume({ context: menuItemCheckable, subscribe: true })
], MenuItemElement.prototype, "checkable", void 0);
__decorate([
    state()
], MenuItemElement.prototype, "hasSubmenu", void 0);
__decorate([
    state()
], MenuItemElement.prototype, "expanded", void 0);
//# sourceMappingURL=menu-item-element.js.map