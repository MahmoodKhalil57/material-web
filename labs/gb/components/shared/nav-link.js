/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { css, html, nothing, } from 'lit';
import { safeHref } from '../../../../internal/directives/safe-href.js';
import { internals } from '../../../behaviors/element-internals.js';
/**
 * Fired (bubbling, not composed) by a navigation bar or rail item when it
 * becomes or stops being a link, so its bar can pick the role that fits its
 * destinations.
 */
export const NAV_LINK_CHANGE = 'nav-link-change';
/**
 * Makes a navigation bar or rail item (a tab) a link destination when `href`
 * is set, like the navigation drawer's item (navigation-bar.md,
 * navigation-rail.md: destinations navigate).
 *
 * The item stays the single focus stop, with the role `link` and
 * `aria-current="page"` while selected (`aria-selected` is not allowed on a
 * link). A transparent anchor over the item carries the navigation, so mouse
 * modifiers, the context menu and "open in a new tab" work natively; Enter on
 * the item activates it. Space doesn't activate a link. Without `href` the
 * item keeps the `tab` role and `aria-selected`.
 */
export class NavLinkController {
    constructor(host) {
        this.host = host;
        /** The item's selected state, which `aria-selected` can't hold on a link. */
        this.selected = false;
        this.isLink = false;
        this.handleClick = (event) => {
            if (this.host.disabled)
                event.preventDefault();
        };
        host.addController(this);
        // The tab turns Space into a click unless the key is already handled.
        host.addEventListener('keydown', (event) => {
            if (host.href && event.key === ' ')
                event.preventDefault();
        });
    }
    hostUpdated() {
        this.sync();
    }
    /** Applies the tab or link semantics for the current `href` and selection. */
    sync() {
        const { host } = this;
        const link = !!host.href;
        const state = host[internals];
        if (link) {
            state.role = 'link';
            state.ariaSelected = null;
            state.ariaCurrent = this.selected ? 'page' : null;
        }
        else if (this.isLink) {
            state.role = 'tab';
            state.ariaCurrent = null;
            state.ariaSelected = String(this.selected);
        }
        if (link !== this.isLink) {
            this.isLink = link;
            host.dispatchEvent(new Event(NAV_LINK_CHANGE, { bubbles: true }));
        }
    }
    /** Clicks the anchor, which navigates; false when the item isn't a link. */
    activate() {
        if (!this.host.href)
            return false;
        if (!this.host.disabled)
            this.anchor?.click();
        return true;
    }
    /** The anchor to render over the item while it is a link. */
    render() {
        const { host } = this;
        if (!host.href)
            return nothing;
        return html `<a
      part="link"
      class="nav-link"
      href=${host.disabled ? nothing : safeHref(host.href)}
      target=${host.target || nothing}
      rel=${host.rel || nothing}
      tabindex="-1"
      aria-hidden="true"
      @click=${this.handleClick}></a>`;
    }
    get anchor() {
        return this.host.renderRoot?.querySelector('a.nav-link');
    }
}
/** Styles for the anchor that covers a link item. */
export const navLinkStyles = css `
  .nav-link {
    border-radius: inherit;
    inset: 0;
    position: absolute;
    z-index: 1;
  }
`;
/** Whether any of the bar's destinations is a link. */
export function hasLinkItems(items) {
    return items.some((item) => !!item.href);
}
//# sourceMappingURL=nav-link.js.map