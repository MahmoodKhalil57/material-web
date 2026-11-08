import "../../chunk-OLAHIHFT.js";
import "../../chunk-7LHEN4S6.js";
import {
  MenuItemController,
  styles
} from "../../chunk-JOSFOFDG.js";
import {
  CloseReason,
  Corner,
  KeydownCloseKey,
  NavigableKey,
  SelectionKey,
  createActivateTypeaheadEvent,
  createDeactivateTypeaheadEvent
} from "../../chunk-IXMVVUUN.js";
import "../../chunk-CGW6MWYN.js";
import "../../chunk-DVYP2TIY.js";
import {
  createDeactivateItemsEvent,
  createRequestActivationEvent,
  deactivateActiveItem,
  getFirstActivatableItem
} from "../../chunk-BCJ5JKJX.js";
import "../../chunk-23AR7BXN.js";
import {
  safeHref
} from "../../chunk-AAO4BAFU.js";
import "../../chunk-KNPMS4HC.js";
import "../../chunk-AE6MH53A.js";
import {
  i as i3,
  n as n2
} from "../../chunk-2L6NDFVR.js";
import {
  mixinDelegatesAria
} from "../../chunk-AE4DAVXE.js";
import {
  __decorate,
  e,
  i,
  i2,
  l,
  n,
  o,
  o2,
  o3,
  s
} from "../../chunk-KV6CMQ6O.js";
import {
  A,
  x
} from "../../chunk-JVQ4V6KC.js";
import "../../chunk-EUXUH3YW.js";

// ../menu/internal/menuitem/menu-item.js
var menuItemBaseClass = mixinDelegatesAria(s);
var MenuItemEl = class extends menuItemBaseClass {
  constructor() {
    super(...arguments);
    this.disabled = false;
    this.type = "menuitem";
    this.href = "";
    this.target = "";
    this.rel = "";
    this.referrerPolicy = "";
    this.keepOpen = false;
    this.selected = false;
    this.menuItemController = new MenuItemController(this, {
      getHeadlineElements: () => {
        return this.headlineElements;
      },
      getSupportingTextElements: () => {
        return this.supportingTextElements;
      },
      getDefaultElements: () => {
        return this.defaultElements;
      },
      getInteractiveElement: () => this.listItemRoot
    });
  }
  /**
   * The text that is selectable via typeahead. If not set, defaults to the
   * innerText of the item slotted into the `"headline"` slot.
   */
  get typeaheadText() {
    return this.menuItemController.typeaheadText;
  }
  set typeaheadText(text) {
    this.menuItemController.setTypeaheadText(text);
  }
  render() {
    return this.renderListItem(x`
      <md-item>
        <div slot="container">
          ${this.renderRipple()} ${this.renderFocusRing()}
        </div>
        <slot name="start" slot="start"></slot>
        <slot name="end" slot="end"></slot>
        ${this.renderBody()}
      </md-item>
    `);
  }
  /**
   * Renders the root list item.
   *
   * @param content the child content of the list item.
   */
  renderListItem(content) {
    const isAnchor = this.type === "link";
    let tag;
    switch (this.menuItemController.tagName) {
      case "a":
        tag = i3`a`;
        break;
      case "button":
        tag = i3`button`;
        break;
      default:
      case "li":
        tag = i3`li`;
        break;
    }
    const target = isAnchor && !!this.target ? this.target : A;
    return n2`
      <${tag}
        id="item"
        tabindex=${this.disabled && !isAnchor ? -1 : 0}
        role=${this.menuItemController.role}
        aria-label=${this.ariaLabel || A}
        aria-selected=${this.ariaSelected || A}
        aria-checked=${this.ariaChecked || A}
        aria-expanded=${this.ariaExpanded || A}
        aria-haspopup=${this.ariaHasPopup || A}
        class="list-item ${o3(this.getRenderClasses())}"
        href=${safeHref(this.href)}
        target=${target}
        rel=${isAnchor && this.rel || A}
        referrerpolicy=${isAnchor && this.referrerPolicy || A}
        @click=${this.menuItemController.onClick}
        @keydown=${this.menuItemController.onKeydown}
      >${content}</${tag}>
    `;
  }
  /**
   * Handles rendering of the ripple element.
   */
  renderRipple() {
    return x` <md-ripple
      part="ripple"
      for="item"
      ?disabled=${this.disabled}></md-ripple>`;
  }
  /**
   * Handles rendering of the focus ring.
   */
  renderFocusRing() {
    return x` <md-focus-ring
      part="focus-ring"
      for="item"
      inward></md-focus-ring>`;
  }
  /**
   * Classes applied to the list item root.
   */
  getRenderClasses() {
    return {
      "disabled": this.disabled,
      "selected": this.selected
    };
  }
  /**
   * Handles rendering the headline and supporting text.
   */
  renderBody() {
    return x`
      <slot></slot>
      <slot name="overline" slot="overline"></slot>
      <slot name="headline" slot="headline"></slot>
      <slot name="supporting-text" slot="supporting-text"></slot>
      <slot
        name="trailing-supporting-text"
        slot="trailing-supporting-text"></slot>
    `;
  }
  focus() {
    this.listItemRoot?.focus();
  }
};
MenuItemEl.shadowRootOptions = {
  ...s.shadowRootOptions,
  delegatesFocus: true
};
__decorate([
  n({ type: Boolean, reflect: true })
], MenuItemEl.prototype, "disabled", void 0);
__decorate([
  n()
], MenuItemEl.prototype, "type", void 0);
__decorate([
  n()
], MenuItemEl.prototype, "href", void 0);
__decorate([
  n()
], MenuItemEl.prototype, "target", void 0);
__decorate([
  n()
], MenuItemEl.prototype, "rel", void 0);
__decorate([
  n()
], MenuItemEl.prototype, "referrerPolicy", void 0);
__decorate([
  n({ type: Boolean, attribute: "keep-open" })
], MenuItemEl.prototype, "keepOpen", void 0);
__decorate([
  n({ type: Boolean })
], MenuItemEl.prototype, "selected", void 0);
__decorate([
  i(".list-item")
], MenuItemEl.prototype, "listItemRoot", void 0);
__decorate([
  l({ slot: "headline" })
], MenuItemEl.prototype, "headlineElements", void 0);
__decorate([
  l({ slot: "supporting-text" })
], MenuItemEl.prototype, "supportingTextElements", void 0);
__decorate([
  o({ slot: "" })
], MenuItemEl.prototype, "defaultElements", void 0);
__decorate([
  n({ attribute: "typeahead-text" })
], MenuItemEl.prototype, "typeaheadText", null);

// ../menu/menu-item.js
var MdMenuItem = class MdMenuItem2 extends MenuItemEl {
};
MdMenuItem.styles = [styles];
MdMenuItem = __decorate([
  e("md-menu-item")
], MdMenuItem);

// ../menu/internal/submenu/sub-menu.js
var SubMenu = class extends s {
  get item() {
    return this.items[0] ?? null;
  }
  get menu() {
    return this.menus[0] ?? null;
  }
  constructor() {
    super();
    this.anchorCorner = Corner.START_END;
    this.menuCorner = Corner.START_START;
    this.hoverOpenDelay = 400;
    this.hoverCloseDelay = 400;
    this.isSubMenu = true;
    this.previousOpenTimeout = 0;
    this.previousCloseTimeout = 0;
    this.onMouseenter = () => {
      clearTimeout(this.previousOpenTimeout);
      clearTimeout(this.previousCloseTimeout);
      if (this.menu?.open)
        return;
      if (!this.hoverOpenDelay) {
        this.show();
      } else {
        this.previousOpenTimeout = setTimeout(() => {
          this.show();
        }, this.hoverOpenDelay);
      }
    };
    this.onMouseleave = () => {
      clearTimeout(this.previousCloseTimeout);
      clearTimeout(this.previousOpenTimeout);
      if (!this.hoverCloseDelay) {
        this.close();
      } else {
        this.previousCloseTimeout = setTimeout(() => {
          this.close();
        }, this.hoverCloseDelay);
      }
    };
    if (!o2) {
      this.addEventListener("mouseenter", this.onMouseenter);
      this.addEventListener("mouseleave", this.onMouseleave);
    }
  }
  render() {
    return x`
      <slot
        name="item"
        @click=${this.onClick}
        @keydown=${this.onKeydown}
        @slotchange=${this.onSlotchange}>
      </slot>
      <slot
        name="menu"
        @keydown=${this.onSubMenuKeydown}
        @close-menu=${this.onCloseSubmenu}
        @slotchange=${this.onSlotchange}>
      </slot>
    `;
  }
  firstUpdated() {
    this.onSlotchange();
  }
  /**
   * Shows the submenu.
   */
  async show() {
    const menu = this.menu;
    if (!menu || menu.open)
      return;
    menu.addEventListener("closed", () => {
      this.item.ariaExpanded = "false";
      this.dispatchEvent(createActivateTypeaheadEvent());
      this.dispatchEvent(createDeactivateItemsEvent());
      menu.ariaHidden = "true";
    }, { once: true });
    if (menu.positioning === "document") {
      menu.positioning = "absolute";
    }
    menu.quick = true;
    menu.hasOverflow = true;
    menu.anchorCorner = this.anchorCorner;
    menu.menuCorner = this.menuCorner;
    menu.anchorElement = this.item;
    menu.defaultFocus = "first-item";
    menu.removeAttribute("aria-hidden");
    menu.skipRestoreFocus = false;
    const menuAlreadyOpen = menu.open;
    menu.show();
    this.item.ariaExpanded = "true";
    this.item.ariaHasPopup = "menu";
    if (menu.id) {
      this.item.setAttribute("aria-controls", menu.id);
    }
    this.dispatchEvent(createDeactivateItemsEvent());
    this.dispatchEvent(createDeactivateTypeaheadEvent());
    this.item.selected = true;
    if (!menuAlreadyOpen) {
      let open = (value) => {
      };
      const opened = new Promise((resolve) => {
        open = resolve;
      });
      menu.addEventListener("opened", open, { once: true });
      await opened;
    }
  }
  /**
   * Closes the submenu.
   */
  async close() {
    const menu = this.menu;
    if (!menu || !menu.open)
      return;
    this.dispatchEvent(createActivateTypeaheadEvent());
    menu.quick = true;
    menu.close();
    this.dispatchEvent(createDeactivateItemsEvent());
    let close = (value) => {
    };
    const closed = new Promise((resolve) => {
      close = resolve;
    });
    menu.addEventListener("closed", close, { once: true });
    await closed;
  }
  onSlotchange() {
    if (!this.item) {
      return;
    }
    this.item.ariaExpanded = "false";
    this.item.ariaHasPopup = "menu";
    if (this.menu?.id) {
      this.item.setAttribute("aria-controls", this.menu.id);
    }
    this.item.keepOpen = true;
    const menu = this.menu;
    if (!menu)
      return;
    menu.isSubmenu = true;
    menu.ariaHidden = "true";
  }
  onClick() {
    this.show();
  }
  /**
   * On item keydown handles opening the submenu.
   */
  async onKeydown(event) {
    const shouldOpenSubmenu = this.isSubmenuOpenKey(event.code);
    if (event.defaultPrevented)
      return;
    const openedWithLR = shouldOpenSubmenu && (NavigableKey.LEFT === event.code || NavigableKey.RIGHT === event.code);
    if (event.code === SelectionKey.SPACE || openedWithLR) {
      event.preventDefault();
      if (openedWithLR) {
        event.stopPropagation();
      }
    }
    if (!shouldOpenSubmenu) {
      return;
    }
    const submenu = this.menu;
    if (!submenu)
      return;
    const submenuItems = submenu.items;
    const firstActivatableItem = getFirstActivatableItem(submenuItems);
    if (firstActivatableItem) {
      await this.show();
      firstActivatableItem.tabIndex = 0;
      firstActivatableItem.focus();
      return;
    }
  }
  onCloseSubmenu(event) {
    const { itemPath, reason } = event.detail;
    itemPath.push(this.item);
    this.dispatchEvent(createActivateTypeaheadEvent());
    if (reason.kind === CloseReason.KEYDOWN && reason.key === KeydownCloseKey.ESCAPE) {
      event.stopPropagation();
      this.item.dispatchEvent(createRequestActivationEvent());
      return;
    }
    this.dispatchEvent(createDeactivateItemsEvent());
  }
  async onSubMenuKeydown(event) {
    if (event.defaultPrevented)
      return;
    const { close: shouldClose, keyCode } = this.isSubmenuCloseKey(event.code);
    if (!shouldClose)
      return;
    event.preventDefault();
    if (keyCode === NavigableKey.LEFT || keyCode === NavigableKey.RIGHT) {
      event.stopPropagation();
    }
    await this.close();
    deactivateActiveItem(this.menu.items);
    this.item?.focus();
    this.item.tabIndex = 0;
    this.item.focus();
  }
  /**
   * Determines whether the given KeyboardEvent code is one that should open
   * the submenu. This is RTL-aware. By default, left, right, space, or enter.
   *
   * @param code The native KeyboardEvent code.
   * @return Whether or not the key code should open the submenu.
   */
  isSubmenuOpenKey(code) {
    const isRtl = getComputedStyle(this).direction === "rtl";
    const arrowEnterKey = isRtl ? NavigableKey.LEFT : NavigableKey.RIGHT;
    switch (code) {
      case arrowEnterKey:
      case SelectionKey.SPACE:
      case SelectionKey.ENTER:
        return true;
      default:
        return false;
    }
  }
  /**
   * Determines whether the given KeyboardEvent code is one that should close
   * the submenu. This is RTL-aware. By default right, left, or escape.
   *
   * @param code The native KeyboardEvent code.
   * @return Whether or not the key code should close the submenu.
   */
  isSubmenuCloseKey(code) {
    const isRtl = getComputedStyle(this).direction === "rtl";
    const arrowEnterKey = isRtl ? NavigableKey.RIGHT : NavigableKey.LEFT;
    switch (code) {
      case arrowEnterKey:
      case KeydownCloseKey.ESCAPE:
        return { close: true, keyCode: code };
      default:
        return { close: false };
    }
  }
};
__decorate([
  n({ attribute: "anchor-corner" })
], SubMenu.prototype, "anchorCorner", void 0);
__decorate([
  n({ attribute: "menu-corner" })
], SubMenu.prototype, "menuCorner", void 0);
__decorate([
  n({ type: Number, attribute: "hover-open-delay" })
], SubMenu.prototype, "hoverOpenDelay", void 0);
__decorate([
  n({ type: Number, attribute: "hover-close-delay" })
], SubMenu.prototype, "hoverCloseDelay", void 0);
__decorate([
  n({ type: Boolean, reflect: true, attribute: "md-sub-menu" })
], SubMenu.prototype, "isSubMenu", void 0);
__decorate([
  l({ slot: "item", flatten: true })
], SubMenu.prototype, "items", void 0);
__decorate([
  l({ slot: "menu", flatten: true })
], SubMenu.prototype, "menus", void 0);

// ../menu/internal/submenu/sub-menu-styles.cssresult.js
var styles2 = i2`:host{position:relative;display:flex;flex-direction:column}
`;
var sub_menu_styles_cssresult_default = styles2.styleSheet;

// ../menu/sub-menu.js
var MdSubMenu = class MdSubMenu2 extends SubMenu {
};
MdSubMenu.styles = [styles2];
MdSubMenu = __decorate([
  e("md-sub-menu")
], MdSubMenu);
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
//# sourceMappingURL=menu.js.map
