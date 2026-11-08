import "../chunk-MSJ6O72X.js";
import {
  getCurrentMode,
  getCurrentSeedColor,
  getCurrentThemeString,
  hctFromHex,
  hexFromHct
} from "../chunk-OAVXCLE4.js";
import {
  dispatchActivationClick,
  isActivationClick
} from "../chunk-7LHEN4S6.js";
import "../chunk-IXMVVUUN.js";
import "../chunk-CGW6MWYN.js";
import "../chunk-BCJ5JKJX.js";
import {
  l as l2
} from "../chunk-MFSXPBED.js";
import "../chunk-RTSU4DGK.js";
import "../chunk-2M5KBCPP.js";
import "../chunk-XZJUA2GG.js";
import "../chunk-G4K3MFK5.js";
import "../chunk-23AR7BXN.js";
import "../chunk-AAO4BAFU.js";
import {
  redispatchEvent
} from "../chunk-UPBBLDMU.js";
import {
  o as o3
} from "../chunk-KNPMS4HC.js";
import {
  getFormValue,
  mixinElementInternals,
  mixinFormAssociated
} from "../chunk-AE6MH53A.js";
import "../chunk-2L6NDFVR.js";
import {
  mixinDelegatesAria
} from "../chunk-AE4DAVXE.js";
import {
  __decorate,
  e,
  e3 as e2,
  e4 as e3,
  i,
  i2,
  l,
  n,
  o2 as o,
  o3 as o2,
  s,
  t
} from "../chunk-KV6CMQ6O.js";
import {
  A,
  x
} from "../chunk-JVQ4V6KC.js";
import {
  __decorateClass
} from "../chunk-EUXUH3YW.js";

// ../labs/segmentedbutton/internal/segmented-button.js
var segmentedButtonBaseClass = mixinDelegatesAria(s);
var SegmentedButton = class extends segmentedButtonBaseClass {
  constructor() {
    super(...arguments);
    this.disabled = false;
    this.selected = false;
    this.label = "";
    this.noCheckmark = false;
    this.hasIcon = false;
    this.animState = "";
  }
  update(props) {
    this.animState = this.nextAnimationState(props);
    super.update(props);
    this.hasIcon = this.iconElement.length > 0;
  }
  nextAnimationState(changedProps) {
    const prevSelected = changedProps.get("selected");
    if (prevSelected === void 0)
      return "";
    const nextSelected = this.selected;
    const nextHasCheckmark = !this.noCheckmark;
    if (!prevSelected && nextSelected && nextHasCheckmark) {
      return "selecting";
    }
    if (prevSelected && !nextSelected && nextHasCheckmark) {
      return "deselecting";
    }
    return "";
  }
  handleClick() {
    const event = new Event("segmented-button-interaction", {
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }
  render() {
    const { ariaLabel } = this;
    return x`
      <button
        tabindex="${this.disabled ? "-1" : "0"}"
        aria-label=${ariaLabel || A}
        aria-pressed=${this.selected}
        ?disabled=${this.disabled}
        @click="${this.handleClick}"
        class="md3-segmented-button ${o2(this.getRenderClasses())}">
        <md-focus-ring
          class="md3-segmented-button__focus-ring"
          part="focus-ring"></md-focus-ring>
        <md-ripple
          ?disabled="${this.disabled}"
          class="md3-segmented-button__ripple"></md-ripple>
        ${this.renderOutline()} ${this.renderLeading()} ${this.renderLabel()}
        ${this.renderTouchTarget()}
      </button>
    `;
  }
  getRenderClasses() {
    return {
      "md3-segmented-button--selected": this.selected,
      "md3-segmented-button--unselected": !this.selected,
      "md3-segmented-button--with-label": this.label !== "",
      "md3-segmented-button--without-label": this.label === "",
      "md3-segmented-button--with-icon": this.hasIcon,
      "md3-segmented-button--with-checkmark": !this.noCheckmark,
      "md3-segmented-button--without-checkmark": this.noCheckmark,
      "md3-segmented-button--selecting": this.animState === "selecting",
      "md3-segmented-button--deselecting": this.animState === "deselecting"
    };
  }
  renderOutline() {
    return A;
  }
  renderLeading() {
    return this.label === "" ? this.renderLeadingWithoutLabel() : this.renderLeadingWithLabel();
  }
  renderLeadingWithoutLabel() {
    return x`
      <span class="md3-segmented-button__leading" aria-hidden="true">
        <span class="md3-segmented-button__graphic">
          <svg class="md3-segmented-button__checkmark" viewBox="0 0 24 24">
            <path
              class="md3-segmented-button__checkmark-path"
              fill="none"
              d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
          </svg>
        </span>
        <span class="md3-segmented-button__icon" aria-hidden="true">
          <slot name="icon"></slot>
        </span>
      </span>
    `;
  }
  renderLeadingWithLabel() {
    return x`
      <span class="md3-segmented-button__leading" aria-hidden="true">
        <span class="md3-segmented-button__graphic">
          <svg class="md3-segmented-button__checkmark" viewBox="0 0 24 24">
            <path
              class="md3-segmented-button__checkmark-path"
              fill="none"
              d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
          </svg>
          <span class="md3-segmented-button__icon" aria-hidden="true">
            <slot name="icon"></slot>
          </span>
        </span>
      </span>
    `;
  }
  renderLabel() {
    return x`
      <span class="md3-segmented-button__label-text">${this.label}</span>
    `;
  }
  renderTouchTarget() {
    return x`<span class="md3-segmented-button__touch"></span>`;
  }
};
__decorate([
  n({ type: Boolean })
], SegmentedButton.prototype, "disabled", void 0);
__decorate([
  n({ type: Boolean })
], SegmentedButton.prototype, "selected", void 0);
__decorate([
  n()
], SegmentedButton.prototype, "label", void 0);
__decorate([
  n({ type: Boolean, attribute: "no-checkmark" })
], SegmentedButton.prototype, "noCheckmark", void 0);
__decorate([
  n({ type: Boolean, attribute: "has-icon" })
], SegmentedButton.prototype, "hasIcon", void 0);
__decorate([
  t()
], SegmentedButton.prototype, "animState", void 0);
__decorate([
  l({ slot: "icon", flatten: true })
], SegmentedButton.prototype, "iconElement", void 0);

// ../labs/segmentedbutton/internal/outlined-segmented-button.js
var OutlinedSegmentedButton = class extends SegmentedButton {
  getRenderClasses() {
    return {
      ...super.getRenderClasses(),
      "md3-segmented-button--outlined": true
    };
  }
  renderOutline() {
    return x`<span class="md3-segmented-button__outline"></span>`;
  }
};

// ../labs/segmentedbutton/internal/outlined-styles.cssresult.js
var styles = i2`:host{--_container-height: var(--md-outlined-segmented-button-container-height, 40px);--_disabled-icon-color: var(--md-outlined-segmented-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-color: var(--md-outlined-segmented-button-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-color: var(--md-outlined-segmented-button-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-state-layer-opacity: var(--md-outlined-segmented-button-hover-state-layer-opacity, 0.08);--_label-text-font: var(--md-outlined-segmented-button-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-outlined-segmented-button-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-outlined-segmented-button-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-outlined-segmented-button-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_outline-color: var(--md-outlined-segmented-button-outline-color, var(--md-sys-color-outline, #79747e));--_pressed-state-layer-opacity: var(--md-outlined-segmented-button-pressed-state-layer-opacity, 0.12);--_selected-container-color: var(--md-outlined-segmented-button-selected-container-color, var(--md-sys-color-secondary-container, #e8def8));--_selected-focus-icon-color: var(--md-outlined-segmented-button-selected-focus-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-focus-label-text-color: var(--md-outlined-segmented-button-selected-focus-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-icon-color: var(--md-outlined-segmented-button-selected-hover-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-label-text-color: var(--md-outlined-segmented-button-selected-hover-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-state-layer-color: var(--md-outlined-segmented-button-selected-hover-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-label-text-color: var(--md-outlined-segmented-button-selected-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-icon-color: var(--md-outlined-segmented-button-selected-pressed-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-label-text-color: var(--md-outlined-segmented-button-selected-pressed-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-state-layer-color: var(--md-outlined-segmented-button-selected-pressed-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_shape: var(--md-outlined-segmented-button-shape, var(--md-sys-shape-corner-full, 9999px));--_unselected-focus-icon-color: var(--md-outlined-segmented-button-unselected-focus-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-focus-label-text-color: var(--md-outlined-segmented-button-unselected-focus-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-hover-icon-color: var(--md-outlined-segmented-button-unselected-hover-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-hover-label-text-color: var(--md-outlined-segmented-button-unselected-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-hover-state-layer-color: var(--md-outlined-segmented-button-unselected-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-label-text-color: var(--md-outlined-segmented-button-unselected-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-pressed-icon-color: var(--md-outlined-segmented-button-unselected-pressed-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-pressed-label-text-color: var(--md-outlined-segmented-button-unselected-pressed-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-pressed-state-layer-color: var(--md-outlined-segmented-button-unselected-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_icon-size: var(--md-outlined-segmented-button-icon-size, 18px);--_selected-icon-color: var(--md-outlined-segmented-button-selected-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_unselected-icon-color: var(--md-outlined-segmented-button-unselected-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_shape-start-start: var(--md-outlined-segmented-button-shape-start-start, var(--md-outlined-segmented-button-shape, var(--md-sys-shape-corner-full, 9999px)));--_shape-start-end: var(--md-outlined-segmented-button-shape-start-end, var(--md-outlined-segmented-button-shape, var(--md-sys-shape-corner-full, 9999px)));--_shape-end-end: var(--md-outlined-segmented-button-shape-end-end, var(--md-outlined-segmented-button-shape, var(--md-sys-shape-corner-full, 9999px)));--_shape-end-start: var(--md-outlined-segmented-button-shape-end-start, var(--md-outlined-segmented-button-shape, var(--md-sys-shape-corner-full, 9999px)));--_spacing-leading: 12px;--_spacing-trailing: 12px}.md3-segmented-button__outline{border-radius:inherit;border-style:solid;border-width:1px;inset:0px -0.5px;pointer-events:none;position:absolute}
`;
var outlined_styles_cssresult_default = styles.styleSheet;

// ../labs/segmentedbutton/internal/shared-styles.cssresult.js
var styles2 = i2`@keyframes md3-segmented-button-checkmark-selection-draw-in{from{stroke-dashoffset:29.7833385}to{stroke-dashoffset:0}}@keyframes md3-segmented-button-simple-fade-out{from{opacity:1}to{opacity:0}}@keyframes md3-segmented-button-simple-fade-in{from{opacity:0}to{opacity:1}}:host{display:inline-flex;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.md3-segmented-button{align-items:center;background:rgba(0,0,0,0);border:none;border-radius:inherit;display:flex;flex:1;justify-content:center;outline:none;position:relative;vertical-align:middle;padding-inline-start:var(--_spacing-leading);padding-inline-end:var(--_spacing-trailing);text-transform:inherit}.md3-segmented-button .md3-segmented-button__outline{border-color:var(--_outline-color)}.md3-segmented-button:disabled .md3-segmented-button__outline{border-color:var(--_disabled-outline-color)}.md3-segmented-button .md3-segmented-button__graphic,.md3-segmented-button .md3-segmented-button__checkmark,.md3-segmented-button .md3-segmented-button__icon,.md3-segmented-button .md3-segmented-button__icon ::slotted([slot=icon]){height:var(--_icon-size);width:var(--_icon-size);font-size:var(--_icon-size)}.md3-segmented-button.md3-segmented-button--with-icon.md3-segmented-button--with-label .md3-segmented-button__graphic,.md3-segmented-button.md3-segmented-button--selected.md3-segmented-button--with-label.md3-segmented-button--with-checkmark .md3-segmented-button__graphic,.md3-segmented-button.md3-segmented-button--selected.md3-segmented-button--without-label.md3-segmented-button--with-checkmark .md3-segmented-button__graphic{width:calc(var(--_icon-size) + 8px)}.md3-segmented-button .md3-segmented-button__label-text{font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight)}.md3-segmented-button.md3-segmented-button--selected:enabled .md3-segmented-button__label-text{color:var(--_selected-label-text-color)}.md3-segmented-button.md3-segmented-button--selected:enabled:hover .md3-segmented-button__label-text{color:var(--_selected-hover-label-text-color)}.md3-segmented-button.md3-segmented-button--selected:enabled:focus .md3-segmented-button__label-text{color:var(--_selected-focus-label-text-color)}.md3-segmented-button.md3-segmented-button--selected:enabled:active .md3-segmented-button__label-text{color:var(--_selected-pressed-label-text-color)}.md3-segmented-button.md3-segmented-button--unselected:enabled .md3-segmented-button__label-text{color:var(--_unselected-label-text-color)}.md3-segmented-button.md3-segmented-button--unselected:enabled:hover .md3-segmented-button__label-text{color:var(--_unselected-hover-label-text-color)}.md3-segmented-button.md3-segmented-button--unselected:enabled:focus .md3-segmented-button__label-text{color:var(--_unselected-focus-label-text-color)}.md3-segmented-button.md3-segmented-button--unselected:enabled:active .md3-segmented-button__label-text{color:var(--_unselected-pressed-label-text-color)}.md3-segmented-button:disabled .md3-segmented-button__label-text{color:var(--_disabled-label-text-color)}.md3-segmented-button--unselected .md3-segmented-button__icon{color:var(--_unselected-icon-color)}.md3-segmented-button--unselected:hover .md3-segmented-button__icon{color:var(--_unselected-hover-icon-color)}.md3-segmented-button--unselected:focus .md3-segmented-button__icon{color:var(--_unselected-focus-icon-color)}.md3-segmented-button--unselected:active .md3-segmented-button__icon{color:var(--_unselected-pressed-icon-color)}.md3-segmented-button--unselected:disabled .md3-segmented-button__icon{color:var(--_disabled-icon-color)}.md3-segmented-button--unselected{--md-ripple-hover-color: var(--_unselected-hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_unselected-pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}.md3-segmented-button--selected{background-color:var(--_selected-container-color)}.md3-segmented-button--selected .md3-segmented-button__icon{color:var(--_selected-icon-color)}.md3-segmented-button--selected .md3-segmented-button__checkmark-path{stroke:var(--_selected-icon-color)}.md3-segmented-button--selected:hover .md3-segmented-button__checkmark-path{stroke:var(--_selected-hover-icon-color)}.md3-segmented-button--selected:focus .md3-segmented-button__checkmark-path{stroke:var(--_selected-focus-icon-color)}.md3-segmented-button--selected:active .md3-segmented-button__checkmark-path{stroke:var(--_selected-pressed-icon-color)}.md3-segmented-button--selected:disabled .md3-segmented-button__checkmark-path{stroke:var(--_disabled-icon-color)}.md3-segmented-button--selected{--md-ripple-hover-color: var(--_selected-hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_selected-pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}.md3-segmented-button:enabled{cursor:pointer}.md3-segmented-button__focus-ring{z-index:1}.md3-segmented-button__ripple{border-radius:inherit;z-index:0}.md3-segmented-button__touch{position:absolute;top:50%;height:48px;left:50%;width:100%;transform:translate(-50%, -50%)}.md3-segmented-button__leading,.md3-segmented-button__graphic{display:inline-flex;justify-content:flex-start;align-items:center}.md3-segmented-button__graphic{position:relative;overflow:hidden}.md3-segmented-button__graphic{transition:width 150ms cubic-bezier(0.4, 0, 0.2, 1)}.md3-segmented-button--unselected.md3-segmented-button--with-label .md3-segmented-button__graphic,.md3-segmented-button--unselected.md3-segmented-button--without-label .md3-segmented-button__graphic,.md3-segmented-button--selected.md3-segmented-button--without-checkmark .md3-segmented-button__graphic{width:0}.md3-segmented-button--unselected .md3-segmented-button__checkmark{opacity:0}.md3-segmented-button--selected.md3-segmented-button--with-label .md3-segmented-button__icon{opacity:0}.md3-segmented-button--with-label .md3-segmented-button__checkmark{display:inline-flex;position:absolute}.md3-segmented-button__checkmark-path{stroke-width:2px;stroke-dasharray:29.7833385}.md3-segmented-button--selecting .md3-segmented-button__checkmark-path{stroke-dashoffset:29.7833385;animation:md3-segmented-button-checkmark-selection-draw-in;animation-duration:150ms;animation-delay:50ms;animation-fill-mode:forwards;animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}.md3-segmented-button--selecting.md3-segmented-button--with-label .md3-segmented-button__icon{animation:md3-segmented-button-simple-fade-out;animation-duration:75ms;animation-timing-function:linear;animation-fill-mode:forwards}.md3-segmented-button--deselecting .md3-segmented-button__checkmark{animation:md3-segmented-button-simple-fade-out;animation-duration:50ms;animation-timing-function:linear;animation-fill-mode:forwards}.md3-segmented-button--deselecting.md3-segmented-button--with-label .md3-segmented-button__icon{opacity:0;animation:md3-segmented-button-simple-fade-in;animation-delay:50ms;animation-duration:150ms;animation-timing-function:linear;animation-fill-mode:forwards}
`;
var shared_styles_cssresult_default = styles2.styleSheet;

// ../labs/segmentedbutton/outlined-segmented-button.js
var MdOutlinedSegmentedButton = class MdOutlinedSegmentedButton2 extends OutlinedSegmentedButton {
};
MdOutlinedSegmentedButton.styles = [styles2, styles];
MdOutlinedSegmentedButton = __decorate([
  e("md-outlined-segmented-button")
], MdOutlinedSegmentedButton);

// ../labs/segmentedbuttonset/internal/segmented-button-set.js
var segmentedButtonSetBaseClass = mixinDelegatesAria(s);
var SegmentedButtonSet = class extends segmentedButtonSetBaseClass {
  constructor() {
    super(...arguments);
    this.multiselect = false;
  }
  getButtonDisabled(index) {
    if (this.indexOutOfBounds(index))
      return false;
    return this.buttons[index].disabled;
  }
  setButtonDisabled(index, disabled) {
    if (this.indexOutOfBounds(index))
      return;
    this.buttons[index].disabled = disabled;
  }
  getButtonSelected(index) {
    if (this.indexOutOfBounds(index))
      return false;
    return this.buttons[index].selected;
  }
  setButtonSelected(index, selected) {
    if (this.indexOutOfBounds(index))
      return;
    if (this.getButtonDisabled(index))
      return;
    if (this.multiselect) {
      this.buttons[index].selected = selected;
      this.emitSelectionEvent(index);
      return;
    }
    if (!selected)
      return;
    this.buttons[index].selected = true;
    this.emitSelectionEvent(index);
    for (let i3 = 0; i3 < this.buttons.length; i3++) {
      if (i3 === index)
        continue;
      this.buttons[i3].selected = false;
    }
  }
  handleSegmentedButtonInteraction(event) {
    const index = this.buttons.indexOf(event.target);
    this.toggleSelection(index);
  }
  toggleSelection(index) {
    if (this.indexOutOfBounds(index))
      return;
    this.setButtonSelected(index, !this.buttons[index].selected);
  }
  indexOutOfBounds(index) {
    return index < 0 || index >= this.buttons.length;
  }
  emitSelectionEvent(index) {
    this.dispatchEvent(new CustomEvent("segmented-button-set-selection", {
      detail: {
        button: this.buttons[index],
        selected: this.buttons[index].selected,
        index
      },
      bubbles: true,
      composed: true
    }));
  }
  render() {
    const { ariaLabel } = this;
    return x`
      <span
        role="group"
        @segmented-button-interaction="${this.handleSegmentedButtonInteraction}"
        aria-label=${ariaLabel || A}
        class="md3-segmented-button-set">
        <slot></slot>
      </span>
    `;
  }
  getRenderClasses() {
    return {};
  }
};
__decorate([
  n({ type: Boolean })
], SegmentedButtonSet.prototype, "multiselect", void 0);
__decorate([
  l({ flatten: true })
], SegmentedButtonSet.prototype, "buttons", void 0);

// ../labs/segmentedbuttonset/internal/outlined-segmented-button-set.js
var OutlinedSegmentedButtonSet = class extends SegmentedButtonSet {
  getRenderClasses() {
    return {
      ...super.getRenderClasses(),
      "md3-segmented-button-set--outlined": true
    };
  }
};

// ../labs/segmentedbuttonset/internal/outlined-styles.cssresult.js
var styles3 = i2`:host{--_container-height: var(--md-outlined-segmented-button-container-height, 40px);--_disabled-icon-color: var(--md-outlined-segmented-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-color: var(--md-outlined-segmented-button-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-color: var(--md-outlined-segmented-button-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-state-layer-opacity: var(--md-outlined-segmented-button-hover-state-layer-opacity, 0.08);--_label-text-font: var(--md-outlined-segmented-button-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-outlined-segmented-button-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-outlined-segmented-button-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-outlined-segmented-button-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_outline-color: var(--md-outlined-segmented-button-outline-color, var(--md-sys-color-outline, #79747e));--_pressed-state-layer-opacity: var(--md-outlined-segmented-button-pressed-state-layer-opacity, 0.12);--_selected-container-color: var(--md-outlined-segmented-button-selected-container-color, var(--md-sys-color-secondary-container, #e8def8));--_selected-focus-icon-color: var(--md-outlined-segmented-button-selected-focus-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-focus-label-text-color: var(--md-outlined-segmented-button-selected-focus-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-icon-color: var(--md-outlined-segmented-button-selected-hover-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-label-text-color: var(--md-outlined-segmented-button-selected-hover-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-state-layer-color: var(--md-outlined-segmented-button-selected-hover-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-label-text-color: var(--md-outlined-segmented-button-selected-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-icon-color: var(--md-outlined-segmented-button-selected-pressed-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-label-text-color: var(--md-outlined-segmented-button-selected-pressed-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-state-layer-color: var(--md-outlined-segmented-button-selected-pressed-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_unselected-focus-icon-color: var(--md-outlined-segmented-button-unselected-focus-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-focus-label-text-color: var(--md-outlined-segmented-button-unselected-focus-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-hover-icon-color: var(--md-outlined-segmented-button-unselected-hover-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-hover-label-text-color: var(--md-outlined-segmented-button-unselected-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-hover-state-layer-color: var(--md-outlined-segmented-button-unselected-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-label-text-color: var(--md-outlined-segmented-button-unselected-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-pressed-icon-color: var(--md-outlined-segmented-button-unselected-pressed-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-pressed-label-text-color: var(--md-outlined-segmented-button-unselected-pressed-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-pressed-state-layer-color: var(--md-outlined-segmented-button-unselected-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_icon-size: var(--md-outlined-segmented-button-icon-size, 18px);--_selected-icon-color: var(--md-outlined-segmented-button-selected-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_unselected-icon-color: var(--md-outlined-segmented-button-unselected-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_shape-start-start: var(--md-outlined-segmented-button-shape-start-start, var(--md-outlined-segmented-button-shape, var(--md-sys-shape-corner-full, 9999px)));--_shape-start-end: var(--md-outlined-segmented-button-shape-start-end, var(--md-outlined-segmented-button-shape, var(--md-sys-shape-corner-full, 9999px)));--_shape-end-end: var(--md-outlined-segmented-button-shape-end-end, var(--md-outlined-segmented-button-shape, var(--md-sys-shape-corner-full, 9999px)));--_shape-end-start: var(--md-outlined-segmented-button-shape-end-start, var(--md-outlined-segmented-button-shape, var(--md-sys-shape-corner-full, 9999px)))}
`;
var outlined_styles_cssresult_default2 = styles3.styleSheet;

// ../labs/segmentedbuttonset/internal/shared-styles.cssresult.js
var styles4 = i2`:host{display:flex;outline:none}.md3-segmented-button-set{display:grid;grid-auto-columns:1fr;grid-auto-flow:column;grid-auto-rows:auto;width:100%;height:var(--_container-height)}.md3-segmented-button-set ::slotted(:first-child){border-start-start-radius:var(--_shape-start-start);border-end-start-radius:var(--_shape-end-start)}.md3-segmented-button-set ::slotted(:last-child){border-start-end-radius:var(--_shape-start-end);border-end-end-radius:var(--_shape-end-end)}
`;
var shared_styles_cssresult_default2 = styles4.styleSheet;

// ../labs/segmentedbuttonset/outlined-segmented-button-set.js
var MdOutlinedSegmentedButtonSet = class MdOutlinedSegmentedButtonSet2 extends OutlinedSegmentedButtonSet {
};
MdOutlinedSegmentedButtonSet.styles = [styles4, styles3];
MdOutlinedSegmentedButtonSet = __decorate([
  e("md-outlined-segmented-button-set")
], MdOutlinedSegmentedButtonSet);

// ../slider/internal/forced-colors-styles.cssresult.js
var styles5 = i2`@media(forced-colors: active){:host{--md-slider-active-track-color: CanvasText;--md-slider-disabled-active-track-color: GrayText;--md-slider-disabled-active-track-opacity: 1;--md-slider-disabled-handle-color: GrayText;--md-slider-disabled-inactive-track-color: GrayText;--md-slider-disabled-inactive-track-opacity: 1;--md-slider-focus-handle-color: CanvasText;--md-slider-handle-color: CanvasText;--md-slider-handle-shadow-color: Canvas;--md-slider-hover-handle-color: CanvasText;--md-slider-hover-state-layer-color: Canvas;--md-slider-hover-state-layer-opacity: 1;--md-slider-inactive-track-color: Canvas;--md-slider-label-container-color: Canvas;--md-slider-label-text-color: CanvasText;--md-slider-pressed-handle-color: CanvasText;--md-slider-pressed-state-layer-color: Canvas;--md-slider-pressed-state-layer-opacity: 1;--md-slider-with-overlap-handle-outline-color: CanvasText}.label,.label::before{border:var(--_with-overlap-handle-outline-color) solid var(--_with-overlap-handle-outline-width)}:host(:not([disabled])) .track::before{border:1px solid var(--_active-track-color)}.tickmarks::before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='CanvasText'%3E%3Ccircle cx='2' cy='2'  r='1'/%3E%3C/svg%3E")}.tickmarks::after{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='Canvas'%3E%3Ccircle cx='2' cy='2' r='1'/%3E%3C/svg%3E")}:host([disabled]) .tickmarks::before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='Canvas'%3E%3Ccircle cx='2' cy='2'  r='1'/%3E%3C/svg%3E")}}
`;
var forced_colors_styles_cssresult_default = styles5.styleSheet;

// ../node_modules/lit-html/directives/when.js
function n2(n3, o4, r) {
  return n3 ? o4() : null == r ? void 0 : r();
}

// ../slider/internal/slider.js
var sliderBaseClass = mixinDelegatesAria(mixinFormAssociated(mixinElementInternals(s)));
var Slider = class extends sliderBaseClass {
  /**
   * The HTML name to use in form submission for a range slider's starting
   * value. Use `name` instead if both the start and end values should use the
   * same name.
   */
  get nameStart() {
    return this.getAttribute("name-start") ?? this.name;
  }
  set nameStart(name) {
    this.setAttribute("name-start", name);
  }
  /**
   * The HTML name to use in form submission for a range slider's ending value.
   * Use `name` instead if both the start and end values should use the same
   * name.
   */
  get nameEnd() {
    return this.getAttribute("name-end") ?? this.nameStart;
  }
  set nameEnd(name) {
    this.setAttribute("name-end", name);
  }
  // Note: start aria-* properties are only applied when range=true, which is
  // why they do not need to handle both cases.
  get renderAriaLabelStart() {
    const { ariaLabel } = this;
    return this.ariaLabelStart || ariaLabel && `${ariaLabel} start` || this.valueLabelStart || String(this.valueStart);
  }
  get renderAriaValueTextStart() {
    return this.ariaValueTextStart || this.valueLabelStart || String(this.valueStart);
  }
  // Note: end aria-* properties are applied for single and range sliders, which
  // is why it needs to handle `this.range` (while start aria-* properties do
  // not).
  get renderAriaLabelEnd() {
    const { ariaLabel } = this;
    if (this.range) {
      return this.ariaLabelEnd || ariaLabel && `${ariaLabel} end` || this.valueLabelEnd || String(this.valueEnd);
    }
    return ariaLabel || this.valueLabel || String(this.value);
  }
  get renderAriaValueTextEnd() {
    if (this.range) {
      return this.ariaValueTextEnd || this.valueLabelEnd || String(this.valueEnd);
    }
    const { ariaValueText } = this;
    return ariaValueText || this.valueLabel || String(this.value);
  }
  constructor() {
    super();
    this.min = 0;
    this.max = 100;
    this.valueLabel = "";
    this.valueLabelStart = "";
    this.valueLabelEnd = "";
    this.ariaLabelStart = "";
    this.ariaValueTextStart = "";
    this.ariaLabelEnd = "";
    this.ariaValueTextEnd = "";
    this.step = 1;
    this.ticks = false;
    this.labeled = false;
    this.range = false;
    this.handleStartHover = false;
    this.handleEndHover = false;
    this.startOnTop = false;
    this.handlesOverlapping = false;
    this.ripplePointerId = 1;
    this.isRedispatchingEvent = false;
    if (!o) {
      this.addEventListener("click", (event) => {
        if (!isActivationClick(event) || !this.inputEnd) {
          return;
        }
        this.focus();
        dispatchActivationClick(this.inputEnd);
      });
    }
  }
  focus() {
    this.inputEnd?.focus();
  }
  willUpdate(changed) {
    this.renderValueStart = changed.has("valueStart") ? this.valueStart : this.inputStart?.valueAsNumber;
    const endValueChanged = changed.has("valueEnd") && this.range || changed.has("value");
    this.renderValueEnd = endValueChanged ? this.range ? this.valueEnd : this.value : this.inputEnd?.valueAsNumber;
    if (changed.get("handleStartHover") !== void 0) {
      this.toggleRippleHover(this.rippleStart, this.handleStartHover);
    } else if (changed.get("handleEndHover") !== void 0) {
      this.toggleRippleHover(this.rippleEnd, this.handleEndHover);
    }
  }
  updated(changed) {
    if (this.range) {
      this.renderValueStart = this.inputStart.valueAsNumber;
    }
    this.renderValueEnd = this.inputEnd.valueAsNumber;
    if (this.range) {
      const segment = (this.max - this.min) / 3;
      if (this.valueStart === void 0) {
        this.inputStart.valueAsNumber = this.min + segment;
        const v = this.inputStart.valueAsNumber;
        this.valueStart = this.renderValueStart = v;
      }
      if (this.valueEnd === void 0) {
        this.inputEnd.valueAsNumber = this.min + 2 * segment;
        const v = this.inputEnd.valueAsNumber;
        this.valueEnd = this.renderValueEnd = v;
      }
    } else {
      this.value ??= this.renderValueEnd;
    }
    if (changed.has("range") || changed.has("renderValueStart") || changed.has("renderValueEnd") || this.isUpdatePending) {
      const startNub = this.handleStart?.querySelector(".handleNub");
      const endNub = this.handleEnd?.querySelector(".handleNub");
      this.handlesOverlapping = isOverlapping(startNub, endNub);
    }
    this.performUpdate();
  }
  render() {
    const step = this.step === 0 ? 1 : this.step;
    const range = Math.max(this.max - this.min, step);
    const startFraction = this.range ? ((this.renderValueStart ?? this.min) - this.min) / range : 0;
    const endFraction = ((this.renderValueEnd ?? this.min) - this.min) / range;
    const containerStyles = {
      // for clipping inputs and active track.
      "--_start-fraction": String(startFraction),
      "--_end-fraction": String(endFraction),
      // for generating tick marks
      "--_tick-count": String(range / step)
    };
    const containerClasses = { ranged: this.range };
    const labelStart = this.valueLabelStart || String(this.renderValueStart);
    const labelEnd = (this.range ? this.valueLabelEnd : this.valueLabel) || String(this.renderValueEnd);
    const inputStartProps = {
      start: true,
      value: this.renderValueStart,
      ariaLabel: this.renderAriaLabelStart,
      ariaValueText: this.renderAriaValueTextStart,
      ariaMin: this.min,
      ariaMax: this.valueEnd ?? this.max
    };
    const inputEndProps = {
      start: false,
      value: this.renderValueEnd,
      ariaLabel: this.renderAriaLabelEnd,
      ariaValueText: this.renderAriaValueTextEnd,
      ariaMin: this.range ? this.valueStart ?? this.min : this.min,
      ariaMax: this.max
    };
    const handleStartProps = {
      start: true,
      hover: this.handleStartHover,
      label: labelStart
    };
    const handleEndProps = {
      start: false,
      hover: this.handleEndHover,
      label: labelEnd
    };
    const handleContainerClasses = {
      hover: this.handleStartHover || this.handleEndHover
    };
    return x` <div
      class="container ${o2(containerClasses)}"
      style=${o3(containerStyles)}>
      ${n2(this.range, () => this.renderInput(inputStartProps))}
      ${this.renderInput(inputEndProps)} ${this.renderTrack()}
      <div class="handleContainerPadded">
        <div class="handleContainerBlock">
          <div class="handleContainer ${o2(handleContainerClasses)}">
            ${n2(this.range, () => this.renderHandle(handleStartProps))}
            ${this.renderHandle(handleEndProps)}
          </div>
        </div>
      </div>
    </div>`;
  }
  renderTrack() {
    return x`
      <div class="track"></div>
      ${this.ticks ? x`<div class="tickmarks"></div>` : A}
    `;
  }
  renderLabel(value) {
    return x`<div class="label" aria-hidden="true">
      <span class="labelContent" part="label">${value}</span>
    </div>`;
  }
  renderHandle({ start, hover, label }) {
    const onTop = !this.disabled && start === this.startOnTop;
    const isOverlapping2 = !this.disabled && this.handlesOverlapping;
    const name = start ? "start" : "end";
    return x`<div
      class="handle ${o2({
      [name]: true,
      hover,
      onTop,
      isOverlapping: isOverlapping2
    })}">
      <md-focus-ring part="focus-ring" for=${name}></md-focus-ring>
      <md-ripple
        for=${name}
        class=${name}
        ?disabled=${this.disabled}></md-ripple>
      <div class="handleNub">
        <md-elevation part="elevation"></md-elevation>
      </div>
      ${n2(this.labeled, () => this.renderLabel(label))}
    </div>`;
  }
  renderInput({ start, value, ariaLabel, ariaValueText, ariaMin, ariaMax }) {
    const name = start ? `start` : `end`;
    return x`<input
      type="range"
      class="${o2({
      start,
      end: !start
    })}"
      @focus=${this.handleFocus}
      @pointerdown=${this.handleDown}
      @pointerup=${this.handleUp}
      @pointerenter=${this.handleEnter}
      @pointermove=${this.handleMove}
      @pointerleave=${this.handleLeave}
      @keydown=${this.handleKeydown}
      @keyup=${this.handleKeyup}
      @input=${this.handleInput}
      @change=${this.handleChange}
      id=${name}
      .disabled=${this.disabled}
      .min=${String(this.min)}
      aria-valuemin=${ariaMin}
      .max=${String(this.max)}
      aria-valuemax=${ariaMax}
      .step=${String(this.step)}
      .value=${String(value)}
      .tabIndex=${start ? 1 : 0}
      aria-label=${ariaLabel || A}
      aria-valuetext=${ariaValueText} />`;
  }
  async toggleRippleHover(ripple, hovering) {
    const rippleEl = await ripple;
    if (!rippleEl) {
      return;
    }
    if (hovering) {
      rippleEl.handlePointerenter(new PointerEvent("pointerenter", {
        isPrimary: true,
        pointerId: this.ripplePointerId
      }));
    } else {
      rippleEl.handlePointerleave(new PointerEvent("pointerleave", {
        isPrimary: true,
        pointerId: this.ripplePointerId
      }));
    }
  }
  handleFocus(event) {
    this.updateOnTop(event.target);
  }
  startAction(event) {
    const target = event.target;
    const fixed = target === this.inputStart ? this.inputEnd : this.inputStart;
    this.action = {
      canFlip: event.type === "pointerdown",
      flipped: false,
      target,
      fixed,
      values: /* @__PURE__ */ new Map([
        [target, target.valueAsNumber],
        [fixed, fixed?.valueAsNumber]
      ])
    };
  }
  finishAction(event) {
    this.action = void 0;
  }
  handleKeydown(event) {
    this.startAction(event);
  }
  handleKeyup(event) {
    this.finishAction(event);
  }
  handleDown(event) {
    this.startAction(event);
    this.ripplePointerId = event.pointerId;
    const isStart = event.target === this.inputStart;
    this.handleStartHover = !this.disabled && isStart && Boolean(this.handleStart);
    this.handleEndHover = !this.disabled && !isStart && Boolean(this.handleEnd);
  }
  async handleUp(event) {
    if (!this.action) {
      return;
    }
    const { target, values, flipped } = this.action;
    await new Promise(requestAnimationFrame);
    if (target !== void 0) {
      target.focus();
      if (flipped && target.valueAsNumber !== values.get(target)) {
        target.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
    this.finishAction(event);
  }
  /**
   * The move handler tracks handle hovering to facilitate proper ripple
   * behavior on the slider handle. This is needed because user interaction with
   * the native input is leveraged to position the handle. Because the separate
   * displayed handle element has pointer events disabled (to allow interaction
   * with the input) and the input's handle is a pseudo-element, neither can be
   * the ripple's interactive element. Therefore the input is the ripple's
   * interactive element and has a `ripple` directive; however the ripple
   * is gated on the handle being hovered. In addition, because the ripple
   * hover state is being specially handled, it must be triggered independent
   * of the directive. This is done based on the hover state when the
   * slider is updated.
   */
  handleMove(event) {
    this.handleStartHover = !this.disabled && inBounds(event, this.handleStart);
    this.handleEndHover = !this.disabled && inBounds(event, this.handleEnd);
  }
  handleEnter(event) {
    this.handleMove(event);
  }
  handleLeave() {
    this.handleStartHover = false;
    this.handleEndHover = false;
  }
  updateOnTop(input) {
    this.startOnTop = input.classList.contains("start");
  }
  needsClamping() {
    if (!this.action) {
      return false;
    }
    const { target, fixed } = this.action;
    const isStart = target === this.inputStart;
    return isStart ? target.valueAsNumber > fixed.valueAsNumber : target.valueAsNumber < fixed.valueAsNumber;
  }
  // if start/end start coincident and the first drag input would e.g. move
  // start > end, avoid clamping and "flip" to use the other input
  // as the action target.
  isActionFlipped() {
    const { action } = this;
    if (!action) {
      return false;
    }
    const { target, fixed, values } = action;
    if (action.canFlip) {
      const coincident = values.get(target) === values.get(fixed);
      if (coincident && this.needsClamping()) {
        action.canFlip = false;
        action.flipped = true;
        action.target = fixed;
        action.fixed = target;
      }
    }
    return action.flipped;
  }
  // when flipped, apply the drag input to the flipped target and reset
  // the actual target.
  flipAction() {
    if (!this.action) {
      return false;
    }
    const { target, fixed, values } = this.action;
    const changed = target.valueAsNumber !== fixed.valueAsNumber;
    target.valueAsNumber = fixed.valueAsNumber;
    fixed.valueAsNumber = values.get(fixed);
    return changed;
  }
  // clamp such that start does not move beyond end and visa versa.
  clampAction() {
    if (!this.needsClamping() || !this.action) {
      return false;
    }
    const { target, fixed } = this.action;
    target.valueAsNumber = fixed.valueAsNumber;
    return true;
  }
  handleInput(event) {
    if (this.isRedispatchingEvent) {
      return;
    }
    let stopPropagation = false;
    let redispatch = false;
    if (this.range) {
      if (this.isActionFlipped()) {
        stopPropagation = true;
        redispatch = this.flipAction();
      }
      if (this.clampAction()) {
        stopPropagation = true;
        redispatch = false;
      }
    }
    const target = event.target;
    this.updateOnTop(target);
    if (this.range) {
      this.valueStart = this.inputStart.valueAsNumber;
      this.valueEnd = this.inputEnd.valueAsNumber;
    } else {
      this.value = this.inputEnd.valueAsNumber;
    }
    if (stopPropagation) {
      event.stopPropagation();
    }
    if (redispatch) {
      this.isRedispatchingEvent = true;
      redispatchEvent(target, event);
      this.isRedispatchingEvent = false;
    }
  }
  handleChange(event) {
    const changeTarget = event.target;
    const { target, values } = this.action ?? {};
    const squelch = target && target.valueAsNumber === values.get(changeTarget);
    if (!squelch) {
      redispatchEvent(this, event);
    }
    this.finishAction(event);
  }
  [getFormValue]() {
    if (this.range) {
      const data = new FormData();
      data.append(this.nameStart, String(this.valueStart));
      data.append(this.nameEnd, String(this.valueEnd));
      return data;
    }
    return String(this.value);
  }
  formResetCallback() {
    if (this.range) {
      const valueStart = this.getAttribute("value-start");
      this.valueStart = valueStart !== null ? Number(valueStart) : void 0;
      const valueEnd = this.getAttribute("value-end");
      this.valueEnd = valueEnd !== null ? Number(valueEnd) : void 0;
      return;
    }
    const value = this.getAttribute("value");
    this.value = value !== null ? Number(value) : void 0;
  }
  formStateRestoreCallback(state) {
    if (Array.isArray(state)) {
      const [[, valueStart], [, valueEnd]] = state;
      this.valueStart = Number(valueStart);
      this.valueEnd = Number(valueEnd);
      this.range = true;
      return;
    }
    this.value = Number(state);
    this.range = false;
  }
};
Slider.shadowRootOptions = {
  ...s.shadowRootOptions,
  delegatesFocus: true
};
__decorate([
  n({ type: Number })
], Slider.prototype, "min", void 0);
__decorate([
  n({ type: Number })
], Slider.prototype, "max", void 0);
__decorate([
  n({ type: Number })
], Slider.prototype, "value", void 0);
__decorate([
  n({ type: Number, attribute: "value-start" })
], Slider.prototype, "valueStart", void 0);
__decorate([
  n({ type: Number, attribute: "value-end" })
], Slider.prototype, "valueEnd", void 0);
__decorate([
  n({ attribute: "value-label" })
], Slider.prototype, "valueLabel", void 0);
__decorate([
  n({ attribute: "value-label-start" })
], Slider.prototype, "valueLabelStart", void 0);
__decorate([
  n({ attribute: "value-label-end" })
], Slider.prototype, "valueLabelEnd", void 0);
__decorate([
  n({ attribute: "aria-label-start" })
], Slider.prototype, "ariaLabelStart", void 0);
__decorate([
  n({ attribute: "aria-valuetext-start" })
], Slider.prototype, "ariaValueTextStart", void 0);
__decorate([
  n({ attribute: "aria-label-end" })
], Slider.prototype, "ariaLabelEnd", void 0);
__decorate([
  n({ attribute: "aria-valuetext-end" })
], Slider.prototype, "ariaValueTextEnd", void 0);
__decorate([
  n({ type: Number })
], Slider.prototype, "step", void 0);
__decorate([
  n({ type: Boolean })
], Slider.prototype, "ticks", void 0);
__decorate([
  n({ type: Boolean })
], Slider.prototype, "labeled", void 0);
__decorate([
  n({ type: Boolean })
], Slider.prototype, "range", void 0);
__decorate([
  i("input.start")
], Slider.prototype, "inputStart", void 0);
__decorate([
  i(".handle.start")
], Slider.prototype, "handleStart", void 0);
__decorate([
  e3("md-ripple.start")
], Slider.prototype, "rippleStart", void 0);
__decorate([
  i("input.end")
], Slider.prototype, "inputEnd", void 0);
__decorate([
  i(".handle.end")
], Slider.prototype, "handleEnd", void 0);
__decorate([
  e3("md-ripple.end")
], Slider.prototype, "rippleEnd", void 0);
__decorate([
  t()
], Slider.prototype, "handleStartHover", void 0);
__decorate([
  t()
], Slider.prototype, "handleEndHover", void 0);
__decorate([
  t()
], Slider.prototype, "startOnTop", void 0);
__decorate([
  t()
], Slider.prototype, "handlesOverlapping", void 0);
__decorate([
  t()
], Slider.prototype, "renderValueStart", void 0);
__decorate([
  t()
], Slider.prototype, "renderValueEnd", void 0);
function inBounds({ x: x2, y }, element) {
  if (!element) {
    return false;
  }
  const { top, left, bottom, right } = element.getBoundingClientRect();
  return x2 >= left && x2 <= right && y >= top && y <= bottom;
}
function isOverlapping(elA, elB) {
  if (!(elA && elB)) {
    return false;
  }
  const a = elA.getBoundingClientRect();
  const b = elB.getBoundingClientRect();
  return !(a.top > b.bottom || a.right < b.left || a.bottom < b.top || a.left > b.right);
}

// ../slider/internal/slider-styles.cssresult.js
var styles6 = i2`:host{--_active-track-color: var(--md-slider-active-track-color, var(--md-sys-color-primary, #6750a4));--_active-track-height: var(--md-slider-active-track-height, 4px);--_active-track-shape: var(--md-slider-active-track-shape, var(--md-sys-shape-corner-full, 9999px));--_disabled-active-track-color: var(--md-slider-disabled-active-track-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-active-track-opacity: var(--md-slider-disabled-active-track-opacity, 0.38);--_disabled-handle-color: var(--md-slider-disabled-handle-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-handle-elevation: var(--md-slider-disabled-handle-elevation, 0);--_disabled-inactive-track-color: var(--md-slider-disabled-inactive-track-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-inactive-track-opacity: var(--md-slider-disabled-inactive-track-opacity, 0.12);--_focus-handle-color: var(--md-slider-focus-handle-color, var(--md-sys-color-primary, #6750a4));--_handle-color: var(--md-slider-handle-color, var(--md-sys-color-primary, #6750a4));--_handle-elevation: var(--md-slider-handle-elevation, 1);--_handle-height: var(--md-slider-handle-height, 20px);--_handle-shadow-color: var(--md-slider-handle-shadow-color, var(--md-sys-color-shadow, #000));--_handle-shape: var(--md-slider-handle-shape, var(--md-sys-shape-corner-full, 9999px));--_handle-width: var(--md-slider-handle-width, 20px);--_hover-handle-color: var(--md-slider-hover-handle-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-color: var(--md-slider-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-opacity: var(--md-slider-hover-state-layer-opacity, 0.08);--_inactive-track-color: var(--md-slider-inactive-track-color, var(--md-sys-color-surface-container-highest, #e6e0e9));--_inactive-track-height: var(--md-slider-inactive-track-height, 4px);--_inactive-track-shape: var(--md-slider-inactive-track-shape, var(--md-sys-shape-corner-full, 9999px));--_label-container-color: var(--md-slider-label-container-color, var(--md-sys-color-primary, #6750a4));--_label-container-height: var(--md-slider-label-container-height, 28px);--_pressed-handle-color: var(--md-slider-pressed-handle-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-color: var(--md-slider-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-opacity: var(--md-slider-pressed-state-layer-opacity, 0.12);--_state-layer-size: var(--md-slider-state-layer-size, 40px);--_with-overlap-handle-outline-color: var(--md-slider-with-overlap-handle-outline-color, var(--md-sys-color-on-primary, #fff));--_with-overlap-handle-outline-width: var(--md-slider-with-overlap-handle-outline-width, 1px);--_with-tick-marks-active-container-color: var(--md-slider-with-tick-marks-active-container-color, var(--md-sys-color-on-primary, #fff));--_with-tick-marks-container-size: var(--md-slider-with-tick-marks-container-size, 2px);--_with-tick-marks-disabled-container-color: var(--md-slider-with-tick-marks-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_with-tick-marks-inactive-container-color: var(--md-slider-with-tick-marks-inactive-container-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-color: var(--md-slider-label-text-color, var(--md-sys-color-on-primary, #fff));--_label-text-font: var(--md-slider-label-text-font, var(--md-sys-typescale-label-medium-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-slider-label-text-line-height, var(--md-sys-typescale-label-medium-line-height, 1rem));--_label-text-size: var(--md-slider-label-text-size, var(--md-sys-typescale-label-medium-size, 0.75rem));--_label-text-weight: var(--md-slider-label-text-weight, var(--md-sys-typescale-label-medium-weight, var(--md-ref-typeface-weight-medium, 500)));--_start-fraction: 0;--_end-fraction: 0;--_tick-count: 0;display:inline-flex;vertical-align:middle;min-inline-size:200px;--md-elevation-level: var(--_handle-elevation);--md-elevation-shadow-color: var(--_handle-shadow-color)}md-focus-ring{height:48px;inset:unset;width:48px}md-elevation{transition-duration:250ms}@media(prefers-reduced-motion){.label{transition-duration:0}}:host([disabled]){opacity:var(--_disabled-active-track-opacity);--md-elevation-level: var(--_disabled-handle-elevation)}.container{flex:1;display:flex;align-items:center;position:relative;block-size:var(--_state-layer-size);pointer-events:none;touch-action:none;user-select:none}.track,.tickmarks{position:absolute;inset:0;display:flex;align-items:center}.track::before,.tickmarks::before,.track::after,.tickmarks::after{position:absolute;content:"";inset-inline-start:calc(var(--_state-layer-size)/2 - var(--_with-tick-marks-container-size));inset-inline-end:calc(var(--_state-layer-size)/2 - var(--_with-tick-marks-container-size));background-size:calc((100% - var(--_with-tick-marks-container-size)*2)/var(--_tick-count)) 100%}.track::before,.tickmarks::before{block-size:var(--_inactive-track-height);border-radius:var(--_inactive-track-shape)}.track::before{background:var(--_inactive-track-color)}.tickmarks::before{background-image:radial-gradient(circle at var(--_with-tick-marks-container-size) center, var(--_with-tick-marks-inactive-container-color) 0, var(--_with-tick-marks-inactive-container-color) calc(var(--_with-tick-marks-container-size) / 2), transparent calc(var(--_with-tick-marks-container-size) / 2))}:host([disabled]) .track::before{opacity:calc(1/var(--_disabled-active-track-opacity)*var(--_disabled-inactive-track-opacity));background:var(--_disabled-inactive-track-color)}.track::after,.tickmarks::after{block-size:var(--_active-track-height);border-radius:var(--_active-track-shape);clip-path:inset(0 calc(var(--_with-tick-marks-container-size) * min((1 - var(--_end-fraction)) * 1000000000, 1) + (100% - var(--_with-tick-marks-container-size) * 2) * (1 - var(--_end-fraction))) 0 calc(var(--_with-tick-marks-container-size) * min(var(--_start-fraction) * 1000000000, 1) + (100% - var(--_with-tick-marks-container-size) * 2) * var(--_start-fraction)))}.track::after{background:var(--_active-track-color)}.tickmarks::after{background-image:radial-gradient(circle at var(--_with-tick-marks-container-size) center, var(--_with-tick-marks-active-container-color) 0, var(--_with-tick-marks-active-container-color) calc(var(--_with-tick-marks-container-size) / 2), transparent calc(var(--_with-tick-marks-container-size) / 2))}.track:dir(rtl)::after{clip-path:inset(0 calc(var(--_with-tick-marks-container-size) * min(var(--_start-fraction) * 1000000000, 1) + (100% - var(--_with-tick-marks-container-size) * 2) * var(--_start-fraction)) 0 calc(var(--_with-tick-marks-container-size) * min((1 - var(--_end-fraction)) * 1000000000, 1) + (100% - var(--_with-tick-marks-container-size) * 2) * (1 - var(--_end-fraction))))}.tickmarks:dir(rtl)::after{clip-path:inset(0 calc(var(--_with-tick-marks-container-size) * min(var(--_start-fraction) * 1000000000, 1) + (100% - var(--_with-tick-marks-container-size) * 2) * var(--_start-fraction)) 0 calc(var(--_with-tick-marks-container-size) * min((1 - var(--_end-fraction)) * 1000000000, 1) + (100% - var(--_with-tick-marks-container-size) * 2) * (1 - var(--_end-fraction))))}:host([disabled]) .track::after{background:var(--_disabled-active-track-color)}:host([disabled]) .tickmarks::before{background-image:radial-gradient(circle at var(--_with-tick-marks-container-size) center, var(--_with-tick-marks-disabled-container-color) 0, var(--_with-tick-marks-disabled-container-color) calc(var(--_with-tick-marks-container-size) / 2), transparent calc(var(--_with-tick-marks-container-size) / 2))}.handleContainerPadded{position:relative;block-size:100%;inline-size:100%;padding-inline:calc(var(--_state-layer-size)/2)}.handleContainerBlock{position:relative;block-size:100%;inline-size:100%}.handleContainer{position:absolute;inset-block-start:0;inset-block-end:0;inset-inline-start:calc(100%*var(--_start-fraction));inline-size:calc(100%*(var(--_end-fraction) - var(--_start-fraction)))}.handle{position:absolute;block-size:var(--_state-layer-size);inline-size:var(--_state-layer-size);border-radius:var(--_handle-shape);display:flex;place-content:center;place-items:center}.handleNub{position:absolute;height:var(--_handle-height);width:var(--_handle-width);border-radius:var(--_handle-shape);background:var(--_handle-color)}:host([disabled]) .handleNub{background:var(--_disabled-handle-color)}input.end:focus~.handleContainerPadded .handle.end>.handleNub,input.start:focus~.handleContainerPadded .handle.start>.handleNub{background:var(--_focus-handle-color)}.container>.handleContainerPadded .handle.hover>.handleNub{background:var(--_hover-handle-color)}:host(:not([disabled])) input.end:active~.handleContainerPadded .handle.end>.handleNub,:host(:not([disabled])) input.start:active~.handleContainerPadded .handle.start>.handleNub{background:var(--_pressed-handle-color)}.onTop.isOverlapping .label,.onTop.isOverlapping .label::before{outline:var(--_with-overlap-handle-outline-color) solid var(--_with-overlap-handle-outline-width)}.onTop.isOverlapping .handleNub{border:var(--_with-overlap-handle-outline-color) solid var(--_with-overlap-handle-outline-width)}.handle.start{inset-inline-start:calc(0px - var(--_state-layer-size)/2)}.handle.end{inset-inline-end:calc(0px - var(--_state-layer-size)/2)}.label{position:absolute;box-sizing:border-box;display:flex;padding:4px;place-content:center;place-items:center;border-radius:var(--md-sys-shape-corner-full, 9999px);color:var(--_label-text-color);font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight);inset-block-end:100%;min-inline-size:var(--_label-container-height);min-block-size:var(--_label-container-height);background:var(--_label-container-color);transition:transform 100ms cubic-bezier(0.2, 0, 0, 1);transform-origin:center bottom;transform:scale(0)}:host(:focus-within) .label,.handleContainer.hover .label,:where(:has(input:active)) .label{transform:scale(1)}.label::before,.label::after{position:absolute;display:block;content:"";background:inherit}.label::before{inline-size:calc(var(--_label-container-height)/2);block-size:calc(var(--_label-container-height)/2);bottom:calc(var(--_label-container-height)/-10);transform:rotate(45deg)}.label::after{inset:0px;border-radius:inherit}.labelContent{z-index:1}input[type=range]{opacity:0;-webkit-tap-highlight-color:rgba(0,0,0,0);position:absolute;box-sizing:border-box;height:100%;width:100%;margin:0;background:rgba(0,0,0,0);cursor:pointer;pointer-events:auto;appearance:none}input[type=range]:focus{outline:none}::-webkit-slider-runnable-track{-webkit-appearance:none}::-moz-range-track{appearance:none}::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;block-size:var(--_handle-height);inline-size:var(--_handle-width);opacity:0;z-index:2}input.end::-webkit-slider-thumb{--_track-and-knob-padding: calc( (var(--_state-layer-size) - var(--_handle-width)) / 2 );--_x-translate: calc( var(--_track-and-knob-padding) - 2 * var(--_end-fraction) * var(--_track-and-knob-padding) );transform:translateX(var(--_x-translate))}input.end:dir(rtl)::-webkit-slider-thumb{transform:translateX(calc(-1 * var(--_x-translate)))}input.start::-webkit-slider-thumb{--_track-and-knob-padding: calc( (var(--_state-layer-size) - var(--_handle-width)) / 2 );--_x-translate: calc( var(--_track-and-knob-padding) - 2 * var(--_start-fraction) * var(--_track-and-knob-padding) );transform:translateX(var(--_x-translate))}input.start:dir(rtl)::-webkit-slider-thumb{transform:translateX(calc(-1 * var(--_x-translate)))}::-moz-range-thumb{appearance:none;block-size:var(--_state-layer-size);inline-size:var(--_state-layer-size);transform:scaleX(0);opacity:0;z-index:2}.ranged input.start{clip-path:inset(0 calc(100% - (var(--_state-layer-size) / 2 + (100% - var(--_state-layer-size)) * (var(--_start-fraction) + (var(--_end-fraction) - var(--_start-fraction)) / 2))) 0 0)}.ranged input.start:dir(rtl){clip-path:inset(0 0 0 calc(100% - (var(--_state-layer-size) / 2 + (100% - var(--_state-layer-size)) * (var(--_start-fraction) + (var(--_end-fraction) - var(--_start-fraction)) / 2))))}.ranged input.end{clip-path:inset(0 0 0 calc(var(--_state-layer-size) / 2 + (100% - var(--_state-layer-size)) * (var(--_start-fraction) + (var(--_end-fraction) - var(--_start-fraction)) / 2)))}.ranged input.end:dir(rtl){clip-path:inset(0 calc(var(--_state-layer-size) / 2 + (100% - var(--_state-layer-size)) * (var(--_start-fraction) + (var(--_end-fraction) - var(--_start-fraction)) / 2)) 0 0)}.onTop{z-index:1}.handle{--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}md-ripple{border-radius:50%;height:var(--_state-layer-size);width:var(--_state-layer-size)}
`;
var slider_styles_cssresult_default = styles6.styleSheet;

// ../slider/slider.js
var MdSlider = class MdSlider2 extends Slider {
};
MdSlider.styles = [styles6, styles5];
MdSlider = __decorate([
  e("md-slider")
], MdSlider);

// src/components/hct-slider.ts
var HUE_RANGE = [0, 360];
var CHROMA_RANGE = [0, 150];
var TONE_RANGE = [0, 100];
var HCTSlider = class extends s {
  constructor() {
    super(...arguments);
    this.label = "";
    this.value = 0;
    this.color = "";
    this.type = "hue";
  }
  render() {
    let range = HUE_RANGE;
    if (this.type === "chroma") {
      range = CHROMA_RANGE;
    } else if (this.type === "tone") {
      range = TONE_RANGE;
    }
    return x`<section>
      <span id="label" class="color-on-surface-text">${this.label}</span>
      <md-slider
        id="source"
        labeled
        aria-label=${this.label}
        .min=${range[0]}
        .max=${range[1]}
        .value=${this.value}
        @input=${this.onInput}></md-slider>
      <div
        id="gradient"
        class=${this.type}
        style=${o3({
      background: this.buildGradient()
    })}></div>
    </section>`;
  }
  onInput(e4) {
    const target = e4.target;
    this.value = target.value;
    this.dispatchEvent(new Event("input"));
  }
  /**
   * Generates the linear-gradient background image CSS string for the gradient
   * preview under the slider.
   *
   * @return A linear gradient CSS string.
   */
  buildGradient() {
    const numStops = 100;
    let linearGradientString = "linear-gradient(to right";
    if (this.type === "hue") {
      for (let i3 = 0; i3 < numStops; i3++) {
        const hue = HUE_RANGE[1] / numStops * i3;
        const hex = hexFromHct(hue, 100, 50);
        linearGradientString += `, ${hex} ${i3}%`;
      }
    } else if (this.type === "chroma") {
      const hct = hctFromHex(this.color || "#000");
      const hue = hct.hue;
      for (let i3 = 0; i3 < numStops; i3++) {
        const chroma = CHROMA_RANGE[1] / numStops * i3;
        const hex = hexFromHct(hue, chroma, 50);
        linearGradientString += `, ${hex} ${i3}%`;
      }
    } else if (this.type === "tone") {
      for (let i3 = 0; i3 < numStops; i3++) {
        const tone = TONE_RANGE[1] / numStops * i3;
        const hex = hexFromHct(0, 0, tone);
        linearGradientString += `, ${hex} ${i3}%`;
      }
    }
    linearGradientString += ")";
    return linearGradientString;
  }
};
HCTSlider.styles = i2`
    section {
      display: flex;
      flex-direction: column;
    }

    #gradient {
      height: 24px;
      border-radius: 12px;
      border: 1px solid currentColor;
      box-sizing: border-box;
    }

    #gradient.chroma {
      will-change: background;
    }

    #label,
    #gradient {
      margin-inline: calc(var(--md-slider-handle-width, 20px) / 2);
    }
  `;
__decorateClass([
  n({ type: String })
], HCTSlider.prototype, "label", 2);
__decorateClass([
  n({ type: Number })
], HCTSlider.prototype, "value", 2);
__decorateClass([
  n({ type: String })
], HCTSlider.prototype, "color", 2);
__decorateClass([
  n({ type: String })
], HCTSlider.prototype, "type", 2);
HCTSlider = __decorateClass([
  e("hct-slider")
], HCTSlider);

// src/types/color-events.ts
var ChangeColorEvent = class extends Event {
  /**
   * @param color The new source color to apply.
   */
  constructor(color) {
    super("change-color", { bubbles: true, composed: true });
    this.color = color;
  }
};
var ChangeDarkModeEvent = class extends Event {
  /**
   * @param mode The new color mode to apply.
   */
  constructor(mode) {
    super("change-mode", { bubbles: true, composed: true });
    this.mode = mode;
  }
};

// src/components/theme-changer.ts
var ThemeChanger = class extends s {
  constructor() {
    super(...arguments);
    this.selectedColorMode = null;
    this.hexColor = "";
    this.hue = 0;
    this.chroma = 0;
    this.tone = 0;
  }
  render() {
    return x`
      <div id="head-wrapper">
        <h2> Theme Controls </h2>
        <copy-code-button
          button-title="Copy current theme to clipboard"
          label="Copy current theme"
          .getCopyText=${getCurrentThemeString}>
        </copy-code-button>
      </div>
      ${this.renderHexPicker()} ${this.renderHctPicker()}
      ${this.renderColorModePicker()}
    `;
  }
  /**
   * Renders a circular native color picker with a focus ring.
   */
  renderHexPicker() {
    return x`<div>
      <label id="hex" for="color-input">
        <span class="label">Hex Source Color</span>
        <span class="input-wrapper">
          <div class="overflow">
            <input
              id="color-input"
              @input=${this.onHexPickerInput}
              type="color"
              .value=${l2(this.hexColor)} />
          </div>
          <md-focus-ring for="color-input"></md-focus-ring>
        </span>
      </label>
    </div>`;
  }
  /**
   * Renders the three hct color pickers.
   */
  renderHctPicker() {
    return x`<div class="sliders">
      <hct-slider
        .value=${l2(this.hue)}
        type="hue"
        label="Hue"
        max="360"
        @input=${this.onSliderInput}></hct-slider>
      <hct-slider
        .value=${l2(this.chroma)}
        .color=${this.hexColor}
        type="chroma"
        label="Chroma"
        max="150"
        @input=${this.onSliderInput}></hct-slider>
      <hct-slider
        .value=${l2(this.tone)}
        type="tone"
        label="Tone"
        max="100"
        @input=${this.onSliderInput}></hct-slider>
    </div>`;
  }
  /**
   * Renders the color mode segmented button set picker.
   */
  renderColorModePicker() {
    return x`<md-outlined-segmented-button-set
      @segmented-button-set-selection=${this.onColorModeSelection}
      aria-label="Color mode">
      ${this.renderModeButton("dark", "dark_mode")}
      ${this.renderModeButton("auto", "brightness_medium")}
      ${this.renderModeButton("light", "light_mode")}
    </md-outlined-segmented-button-set>`;
  }
  /**
   * Renders a color mode segmented button.
   *
   * @param mode Sets the value and the title of the button to the given color
   *     mode.
   * @param icon The icon to display in the button.
   */
  renderModeButton(mode, icon) {
    return x`<md-outlined-segmented-button
      data-value=${mode}
      title=${mode}
      aria-label="${mode} color scheme"
      .selected=${this.selectedColorMode === mode}>
      <md-icon slot="icon">${icon}</md-icon>
    </md-outlined-segmented-button>`;
  }
  onSliderInput() {
    for (const slider of this.sliders) {
      this[slider.type] = slider.value;
    }
    this.hexColor = hexFromHct(this.hue, this.chroma, this.tone);
    this.dispatchEvent(new ChangeColorEvent(this.hexColor));
  }
  /**
   * Updates the HCT sliders by converting a hex color to HCT.
   *
   * @param hexColor The hex color to convert to HCT and update the sliders.
   */
  updateHctFromHex(hexColor) {
    const hct = hctFromHex(hexColor);
    this.hue = hct.hue;
    this.chroma = hct.chroma;
    this.tone = hct.tone;
  }
  onHexPickerInput() {
    this.hexColor = this.inputEl.value;
    this.updateHctFromHex(this.hexColor);
    this.dispatchEvent(new ChangeColorEvent(this.hexColor));
  }
  async firstUpdated() {
    if (!this.selectedColorMode) {
      this.selectedColorMode = getCurrentMode();
    }
    if (!this.hexColor) {
      this.hexColor = getCurrentSeedColor();
    }
    this.updateHctFromHex(this.hexColor);
  }
  onColorModeSelection(e4) {
    const { button } = e4.detail;
    const value = button.dataset.value;
    this.selectedColorMode = value;
    this.dispatchEvent(new ChangeDarkModeEvent(value));
  }
};
ThemeChanger.shadowRootOptions = {
  ...s.shadowRootOptions,
  delegatesFocus: true
};
ThemeChanger.styles = i2`
    :host {
      /* These are the default values, but we don't want the alignment to break
       * in case the token values are updated.
       */
      --_copy-button-button-size: 40px;
      --_copy-button-icon-size: 24px;
      position: relative;
      display: flex;
      flex-direction: column;
      margin: var(--catalog-spacing-m) var(--catalog-spacing-l);
    }

    :host > * {
      margin-block-end: var(--catalog-spacing-l);
    }

    :host > *:last-child {
      margin-block-end: 0;
    }

    #head-wrapper {
      display: flex;
      align-items: space-between;
    }

    input {
      border: none;
      background: none;
    }

    .sliders,
    #hex {
      padding-inline: var(--catalog-spacing-m);
      border-radius: var(--catalog-shape-l);
      background-color: var(--md-sys-color-surface-variant);
      color: var(--md-sys-color-on-surface-variant);

      /* Default track color is inaccessible in a surface-variant */
      --md-slider-inactive-track-color: var(--md-sys-color-on-surface-variant);
    }

    hct-slider {
      display: block;
      margin-block: 24px;
    }

    h2 {
      margin: 0;
      text-align: center;
      position: relative;
      height: var(--_copy-button-icon-size);
    }

    copy-code-button {
      --md-icon-button-icon-size: var(--_copy-button-icon-size);
      --md-icon-button-state-layer-width: var(--_copy-button-button-size);
      --md-icon-button-state-layer-height: var(--_copy-button-button-size);
      /*
       * Center the copy icon with the h2 text
       * -(icon button size - intrinsic icon size) / 2
       */
      --_inline-block-inset: calc(
        -1 * (var(--_copy-button-button-size) - var(--_copy-button-icon-size)) /
          2
      );
      --catalog-copy-code-button-inset: var(--_inline-block-inset) 0 auto auto;
      position: static;
    }

    #hex {
      display: flex;
      padding: 12px;
      align-items: center;
    }

    #hex .label {
      flex-grow: 1;
    }

    #hex .input-wrapper {
      box-sizing: border-box;
      width: 48px;
      height: 48px;
      box-sizing: border-box;
      border: 1px solid var(--md-sys-color-on-secondary-container);
      position: relative;
    }

    #hex .input-wrapper,
    #hex md-focus-ring {
      border-radius: 50%;
    }

    .overflow {
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #hex input {
      min-width: 200%;
      min-height: 200%;
    }

    @media (forced-colors: active) {
      #hex,
      .sliders {
        box-sizing: border-box;
        border: 1px solid CanvasText;
      }
    }
  `;
__decorateClass([
  t()
], ThemeChanger.prototype, "selectedColorMode", 2);
__decorateClass([
  t()
], ThemeChanger.prototype, "hexColor", 2);
__decorateClass([
  t()
], ThemeChanger.prototype, "hue", 2);
__decorateClass([
  t()
], ThemeChanger.prototype, "chroma", 2);
__decorateClass([
  t()
], ThemeChanger.prototype, "tone", 2);
__decorateClass([
  i("input")
], ThemeChanger.prototype, "inputEl", 2);
__decorateClass([
  e2("hct-slider")
], ThemeChanger.prototype, "sliders", 2);
ThemeChanger = __decorateClass([
  e("theme-changer")
], ThemeChanger);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/*! Bundled license information:

lit-html/directives/when.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
//# sourceMappingURL=menu.js.map
