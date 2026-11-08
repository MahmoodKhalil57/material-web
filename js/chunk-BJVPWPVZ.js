import {
  ListController,
  NavigableKeys,
  createRequestActivationEvent
} from "./chunk-BCJ5JKJX.js";
import {
  safeHref
} from "./chunk-AAO4BAFU.js";
import {
  i as i3,
  n as n2
} from "./chunk-2L6NDFVR.js";
import {
  mixinDelegatesAria
} from "./chunk-AE4DAVXE.js";
import {
  __decorate,
  e,
  i,
  i2,
  l,
  n,
  o2 as o,
  o3 as o2,
  s
} from "./chunk-KV6CMQ6O.js";
import {
  A,
  x
} from "./chunk-JVQ4V6KC.js";

// ../list/internal/list.js
var NAVIGABLE_KEY_SET = new Set(Object.values(NavigableKeys));
var List = class extends s {
  /** @export */
  get items() {
    return this.listController.items;
  }
  constructor() {
    super();
    this.listController = new ListController({
      isItem: (item) => item.hasAttribute("md-list-item"),
      getPossibleItems: () => this.slotItems,
      isRtl: () => getComputedStyle(this).direction === "rtl",
      deactivateItem: (item) => {
        item.tabIndex = -1;
      },
      activateItem: (item) => {
        item.tabIndex = 0;
      },
      isNavigableKey: (key) => NAVIGABLE_KEY_SET.has(key),
      isActivatable: (item) => !item.disabled && item.type !== "text"
    });
    this.internals = // Cast needed for closure
    this.attachInternals();
    if (!o) {
      this.internals.role = "list";
      this.addEventListener("keydown", this.listController.handleKeydown);
    }
  }
  render() {
    return x`
      <slot
        @deactivate-items=${this.listController.onDeactivateItems}
        @request-activation=${this.listController.onRequestActivation}
        @slotchange=${this.listController.onSlotchange}>
      </slot>
    `;
  }
  /**
   * Activates the next item in the list. If at the end of the list, the first
   * item will be activated.
   *
   * @return The activated list item or `null` if there are no items.
   */
  activateNextItem() {
    return this.listController.activateNextItem();
  }
  /**
   * Activates the previous item in the list. If at the start of the list, the
   * last item will be activated.
   *
   * @return The activated list item or `null` if there are no items.
   */
  activatePreviousItem() {
    return this.listController.activatePreviousItem();
  }
};
__decorate([
  l({ flatten: true })
], List.prototype, "slotItems", void 0);

// ../list/internal/list-styles.cssresult.js
var styles = i2`:host{background:var(--md-list-container-color, var(--md-sys-color-surface, #fef7ff));color:unset;display:flex;flex-direction:column;outline:none;padding:8px 0;position:relative}
`;
var list_styles_cssresult_default = styles.styleSheet;

// ../list/list.js
var MdList = class MdList2 extends List {
};
MdList.styles = [styles];
MdList = __decorate([
  e("md-list")
], MdList);

// ../list/internal/listitem/list-item.js
var listItemBaseClass = mixinDelegatesAria(s);
var ListItemEl = class extends listItemBaseClass {
  constructor() {
    super(...arguments);
    this.disabled = false;
    this.type = "text";
    this.isListItem = true;
    this.href = "";
    this.target = "";
    this.rel = "";
    this.referrerPolicy = "";
  }
  get isDisabled() {
    return this.disabled && this.type !== "link";
  }
  willUpdate(changed) {
    if (this.href) {
      this.type = "link";
    }
    super.willUpdate(changed);
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
    switch (this.type) {
      case "link":
        tag = i3`a`;
        break;
      case "button":
        tag = i3`button`;
        break;
      default:
      case "text":
        tag = i3`li`;
        break;
    }
    const isInteractive = this.type !== "text";
    const target = isAnchor && !!this.target ? this.target : A;
    return n2`
      <${tag}
        id="item"
        tabindex="${this.isDisabled || !isInteractive ? -1 : 0}"
        ?disabled=${this.isDisabled}
        role="listitem"
        aria-selected=${this.ariaSelected || A}
        aria-checked=${this.ariaChecked || A}
        aria-expanded=${this.ariaExpanded || A}
        aria-haspopup=${this.ariaHasPopup || A}
        class="list-item ${o2(this.getRenderClasses())}"
        href=${safeHref(this.href)}
        target=${target}
        rel=${isAnchor && this.rel || A}
        referrerpolicy=${isAnchor && this.referrerPolicy || A}
        @focus=${this.onFocus}
      >${content}</${tag}>
    `;
  }
  /**
   * Handles rendering of the ripple element.
   */
  renderRipple() {
    if (this.type === "text") {
      return A;
    }
    return x` <md-ripple
      part="ripple"
      for="item"
      ?disabled=${this.isDisabled}></md-ripple>`;
  }
  /**
   * Handles rendering of the focus ring.
   */
  renderFocusRing() {
    if (this.type === "text") {
      return A;
    }
    return x` <md-focus-ring
      @visibility-changed=${this.onFocusRingVisibilityChanged}
      part="focus-ring"
      for="item"
      inward></md-focus-ring>`;
  }
  onFocusRingVisibilityChanged(e2) {
  }
  /**
   * Classes applied to the list item root.
   */
  getRenderClasses() {
    return { "disabled": this.isDisabled };
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
  onFocus() {
    if (this.tabIndex !== -1) {
      return;
    }
    this.dispatchEvent(createRequestActivationEvent());
  }
  focus() {
    this.listItemRoot?.focus();
  }
  click() {
    if (!this.listItemRoot) {
      super.click();
      return;
    }
    this.listItemRoot.click();
  }
};
ListItemEl.shadowRootOptions = {
  ...s.shadowRootOptions,
  delegatesFocus: true
};
__decorate([
  n({ type: Boolean, reflect: true })
], ListItemEl.prototype, "disabled", void 0);
__decorate([
  n({ reflect: true })
], ListItemEl.prototype, "type", void 0);
__decorate([
  n({ type: Boolean, attribute: "md-list-item", reflect: true })
], ListItemEl.prototype, "isListItem", void 0);
__decorate([
  n()
], ListItemEl.prototype, "href", void 0);
__decorate([
  n()
], ListItemEl.prototype, "target", void 0);
__decorate([
  n()
], ListItemEl.prototype, "rel", void 0);
__decorate([
  n()
], ListItemEl.prototype, "referrerPolicy", void 0);
__decorate([
  i(".list-item")
], ListItemEl.prototype, "listItemRoot", void 0);

// ../list/internal/listitem/list-item-styles.cssresult.js
var styles2 = i2`:host{display:flex;gap:16px;-webkit-tap-highlight-color:rgba(0,0,0,0);--md-ripple-hover-color: var(--md-list-item-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-hover-opacity: var(--md-list-item-hover-state-layer-opacity, 0.08);--md-ripple-pressed-color: var(--md-list-item-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-pressed-opacity: var(--md-list-item-pressed-state-layer-opacity, 0.12)}:host(:is([type=button]:not([disabled]),[type=link])){cursor:pointer}md-focus-ring{z-index:1;--md-focus-ring-shape: 8px}a,button,li{background:none;border:none;cursor:inherit;padding:0;margin:0;text-align:unset;text-decoration:none}.list-item{border-radius:inherit;display:flex;flex:1;gap:inherit;max-width:inherit;min-width:inherit;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0);width:100%}.list-item.interactive{cursor:pointer}.list-item.disabled{opacity:var(--md-list-item-disabled-opacity, 0.3);pointer-events:none}[slot=container]{pointer-events:none}md-ripple{border-radius:inherit}md-item{border-radius:inherit;flex:1;height:100%;color:var(--md-list-item-label-text-color, var(--md-sys-color-on-surface, #1d1b20));font-family:var(--md-list-item-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-list-item-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));line-height:var(--md-list-item-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));font-weight:var(--md-list-item-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));min-height:var(--md-list-item-one-line-container-height, 56px);padding-top:var(--md-list-item-top-space, 12px);padding-bottom:var(--md-list-item-bottom-space, 12px);padding-inline-start:var(--md-list-item-leading-space, 16px);padding-inline-end:var(--md-list-item-trailing-space, 16px);gap:inherit}md-item[multiline]{min-height:var(--md-list-item-two-line-container-height, 72px)}[slot=supporting-text]{color:var(--md-list-item-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-list-item-supporting-text-font, var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-list-item-supporting-text-size, var(--md-sys-typescale-body-medium-size, 0.875rem));line-height:var(--md-list-item-supporting-text-line-height, var(--md-sys-typescale-body-medium-line-height, 1.25rem));font-weight:var(--md-list-item-supporting-text-weight, var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400)))}[slot=trailing-supporting-text]{color:var(--md-list-item-trailing-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-list-item-trailing-supporting-text-font, var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-list-item-trailing-supporting-text-size, var(--md-sys-typescale-label-small-size, 0.6875rem));line-height:var(--md-list-item-trailing-supporting-text-line-height, var(--md-sys-typescale-label-small-line-height, 1rem));font-weight:var(--md-list-item-trailing-supporting-text-weight, var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500)))}:is([slot=start],[slot=end])::slotted(*){fill:currentColor}[slot=start]{color:var(--md-list-item-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f))}[slot=end]{color:var(--md-list-item-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f))}@media(forced-colors: active){.disabled slot{color:GrayText}.list-item.disabled{color:GrayText;opacity:1}}
`;
var list_item_styles_cssresult_default = styles2.styleSheet;

// ../list/list-item.js
var MdListItem = class MdListItem2 extends ListItemEl {
};
MdListItem.styles = [styles2];
MdListItem = __decorate([
  e("md-list-item")
], MdListItem);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
//# sourceMappingURL=chunk-BJVPWPVZ.js.map
