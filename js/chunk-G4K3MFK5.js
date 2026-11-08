import {
  afterDispatch,
  mixinFormSubmitter,
  setupDispatchHooks
} from "./chunk-23AR7BXN.js";
import {
  safeHref
} from "./chunk-AAO4BAFU.js";
import {
  mixinElementInternals,
  mixinFormAssociated
} from "./chunk-AE6MH53A.js";
import {
  i as i2,
  n as n2
} from "./chunk-2L6NDFVR.js";
import {
  mixinDelegatesAria
} from "./chunk-AE4DAVXE.js";
import {
  __decorate,
  i2 as i,
  n,
  o2 as o,
  o3 as o2,
  s,
  t
} from "./chunk-KV6CMQ6O.js";
import {
  A,
  x
} from "./chunk-JVQ4V6KC.js";

// ../internal/controller/is-rtl.js
function isRtl(el, shouldCheck = true) {
  return shouldCheck && getComputedStyle(el).getPropertyValue("direction").trim() === "rtl";
}

// ../iconbutton/internal/icon-button.js
var iconButtonBaseClass = mixinDelegatesAria(mixinFormSubmitter(mixinFormAssociated(mixinElementInternals(s))));
var IconButton = class extends iconButtonBaseClass {
  constructor() {
    super();
    this.softDisabled = false;
    this.flipIconInRtl = false;
    this.href = "";
    this.download = "";
    this.target = "";
    this.rel = "";
    this.referrerPolicy = "";
    this.ariaLabelSelected = "";
    this.toggle = false;
    this.selected = false;
    this.flipIcon = isRtl(this, this.flipIconInRtl);
    if (o)
      return;
    setupDispatchHooks(this, "click");
    this.addEventListener("click", (event) => {
      if (this.softDisabled || this.disabled && this.href) {
        event.stopImmediatePropagation();
        event.preventDefault();
        return;
      }
      const wasSelected = this.selected;
      afterDispatch(event, () => {
        if (!this.toggle || this.disabled || event.defaultPrevented) {
          return;
        }
        this.selected = !wasSelected;
        this.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true }));
        this.dispatchEvent(new Event("change", { bubbles: true }));
      });
    }, { capture: true });
  }
  willUpdate() {
    if (this.href) {
      this.disabled = false;
      this.softDisabled = false;
    }
  }
  render() {
    const tag = this.href ? i2`div` : i2`button`;
    const { ariaLabel, ariaHasPopup, ariaExpanded } = this;
    const hasToggledAriaLabel = ariaLabel && this.ariaLabelSelected;
    const ariaPressedValue = !this.toggle ? A : this.selected;
    let ariaLabelValue = A;
    if (!this.href) {
      ariaLabelValue = hasToggledAriaLabel && this.selected ? this.ariaLabelSelected : ariaLabel;
    }
    return n2`<${tag}
        class="icon-button ${o2(this.getRenderClasses())}"
        id="button"
        aria-label="${ariaLabelValue || A}"
        aria-haspopup="${!this.href && ariaHasPopup || A}"
        aria-expanded="${!this.href && ariaExpanded || A}"
        aria-pressed="${ariaPressedValue}"
        aria-disabled=${!this.href && this.softDisabled || A}
        ?disabled="${!this.href && this.disabled}">
        ${this.renderFocusRing()}
        ${this.renderRipple()}
        ${!this.selected ? this.renderIcon() : A}
        ${this.selected ? this.renderSelectedIcon() : A}
        ${this.href ? this.renderLink() : this.renderTouchTarget()}
  </${tag}>`;
  }
  renderLink() {
    const { ariaLabel } = this;
    return x`
      <a
        class="link"
        id="link"
        href=${safeHref(this.href)}
        download="${this.download || A}"
        target="${this.target || A}"
        rel=${this.rel || A}
        referrerpolicy=${this.referrerPolicy || A}
        aria-label="${ariaLabel || A}">
        ${this.renderTouchTarget()}
      </a>
    `;
  }
  getRenderClasses() {
    return {
      "flip-icon": this.flipIcon,
      "selected": this.toggle && this.selected
    };
  }
  renderIcon() {
    return x`<span class="icon"><slot></slot></span>`;
  }
  renderSelectedIcon() {
    return x`<span class="icon icon--selected"
      ><slot name="selected"><slot></slot></slot
    ></span>`;
  }
  renderTouchTarget() {
    return x`<span class="touch"></span>`;
  }
  renderFocusRing() {
    return x`<md-focus-ring
      part="focus-ring"
      for=${this.href ? "link" : "button"}></md-focus-ring>`;
  }
  renderRipple() {
    const isRippleDisabled = !this.href && (this.disabled || this.softDisabled);
    return x`<md-ripple
      for=${this.href ? "link" : A}
      ?disabled="${isRippleDisabled}"></md-ripple>`;
  }
  connectedCallback() {
    this.flipIcon = isRtl(this, this.flipIconInRtl);
    super.connectedCallback();
  }
};
IconButton.shadowRootOptions = {
  mode: "open",
  delegatesFocus: true
};
__decorate([
  n({ type: Boolean, attribute: "soft-disabled", reflect: true })
], IconButton.prototype, "softDisabled", void 0);
__decorate([
  n({ type: Boolean, attribute: "flip-icon-in-rtl" })
], IconButton.prototype, "flipIconInRtl", void 0);
__decorate([
  n()
], IconButton.prototype, "href", void 0);
__decorate([
  n()
], IconButton.prototype, "download", void 0);
__decorate([
  n()
], IconButton.prototype, "target", void 0);
__decorate([
  n()
], IconButton.prototype, "rel", void 0);
__decorate([
  n()
], IconButton.prototype, "referrerPolicy", void 0);
__decorate([
  n({ attribute: "aria-label-selected" })
], IconButton.prototype, "ariaLabelSelected", void 0);
__decorate([
  n({ type: Boolean })
], IconButton.prototype, "toggle", void 0);
__decorate([
  n({ type: Boolean, reflect: true })
], IconButton.prototype, "selected", void 0);
__decorate([
  t()
], IconButton.prototype, "flipIcon", void 0);

// ../iconbutton/internal/shared-styles.cssresult.js
var styles = i`:host{display:inline-flex;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0);height:var(--_container-height);width:var(--_container-width);justify-content:center}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_container-height))/2) max(0px,(48px - var(--_container-width))/2)}md-focus-ring{--md-focus-ring-shape-start-start: var(--_container-shape-start-start);--md-focus-ring-shape-start-end: var(--_container-shape-start-end);--md-focus-ring-shape-end-end: var(--_container-shape-end-end);--md-focus-ring-shape-end-start: var(--_container-shape-end-start)}:host(:is([disabled],[soft-disabled])){pointer-events:none}.icon-button{place-items:center;background:none;border:none;box-sizing:border-box;cursor:pointer;display:flex;place-content:center;outline:none;padding:0;position:relative;text-decoration:none;user-select:none;z-index:0;flex:1;border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end)}.icon ::slotted(*){font-size:var(--_icon-size);height:var(--_icon-size);width:var(--_icon-size);font-weight:inherit}md-ripple{z-index:-1;border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end)}.flip-icon .icon{transform:scaleX(-1)}.icon{display:inline-flex}.link{display:grid;height:100%;outline:none;place-items:center;position:absolute;width:100%}.touch{position:absolute;height:max(48px,100%);width:max(48px,100%)}:host([touch-target=none]) .touch{display:none}@media(forced-colors: active){:host(:is([disabled],[soft-disabled])){--_disabled-icon-color: GrayText;--_disabled-icon-opacity: 1}}
`;
var shared_styles_cssresult_default = styles.styleSheet;

export {
  IconButton,
  styles
};
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
//# sourceMappingURL=chunk-G4K3MFK5.js.map
