"use strict";
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnobColorSelector = void 0;
exports.boolInput = boolInput;
exports.colorPicker = colorPicker;
exports.textInput = textInput;
exports.numberInput = numberInput;
exports.button = button;
exports.radioSelector = radioSelector;
exports.selectDropdown = selectDropdown;
exports.cssCustomProperty = cssCustomProperty;
exports.setProp = setProp;
const tslib_1 = require("tslib");
// These imports are resolved by Lit playground's unpkg loader
require("@material/web/button/outlined-button.js");
require("@material/web/checkbox/checkbox.js");
require("@material/web/radio/radio.js");
require("@material/web/ripple/ripple.js");
require("@material/web/select/filled-select.js");
require("@material/web/select/select-option.js");
require("@material/web/textfield/filled-text-field.js");
const lit_1 = require("lit");
const decorators_js_1 = require("lit/decorators.js");
const style_map_js_1 = require("lit/directives/style-map.js");
/**
 * A boolean Knob UI.
 */
function boolInput() {
    return {
        render(knob, onChange) {
            const valueChanged = (e) => {
                onChange(e.target.checked);
            };
            return (0, lit_1.html) `
        <div>
          <label>
            <md-checkbox
              touch-target="none"
              style="margin-inline-end: 16px;"
              .checked=${!!knob.latestValue}
              @change="${valueChanged}"
            >
            </md-checkbox>
            ${knob.name}
          </label>
        </div>
      `;
        },
    };
}
/**
 * Color selector for knob UI
 */
let KnobColorSelector = class KnobColorSelector extends lit_1.LitElement {
    constructor() {
        super(...arguments);
        this.internalValue = '';
        this.hasAlpha = false;
    }
    set value(val) {
        const oldVal = this.internalValue;
        this.internalValue = val;
        this.requestUpdate('value', oldVal);
    }
    get value() {
        return this.internalValue;
    }
    render() {
        return (0, lit_1.html) `<span id="wrapper">
      <span>
        ${this.hasAlpha ? this.renderTextInput() : this.renderColorInput()}
      </span>
      <md-outlined-button
        @click=${() => {
            this.hasAlpha = !this.hasAlpha;
        }}
      >
        ${this.hasAlpha ? 'rgba' : 'rgb'}
      </md-outlined-button>
    </span>`;
    }
    renderTextInput() {
        return (0, lit_1.html) `<md-filled-text-field
      style=${(0, style_map_js_1.styleMap)(sharedTextFieldStyles)}
      .value=${this.value}
      @change=${this.propagateEvt}
      @input=${this.onInput}
    ></md-filled-text-field>`;
    }
    renderColorInput() {
        const rippleStyles = (0, style_map_js_1.styleMap)({
            '--md-sys-color-on-surface': this.value || 'black',
        });
        return (0, lit_1.html) `
      <md-ripple for="color-picker" style=${rippleStyles}></md-ripple>
      <input
        type="color"
        id="color-picker"
        .value=${this.value}
        @change=${this.propagateEvt}
        @input=${this.onInput}
      />
    `;
    }
    onInput(e) {
        const val = e.target.value;
        this.value = val;
        this.propagateEvt(e);
    }
    propagateEvt(e) {
        const newEvt = new Event(e.type, {
            bubbles: e.bubbles,
            composed: e.composed,
        });
        this.dispatchEvent(newEvt);
    }
    click() {
        const input = this.renderRoot.querySelector('input,md-filled-text-field');
        input.click();
        input.focus();
    }
    focus() {
        const input = this.renderRoot.querySelector('input,md-filled-text-field');
        input.focus();
    }
};
exports.KnobColorSelector = KnobColorSelector;
KnobColorSelector.styles = (0, lit_1.css) `
    :host {
      display: inline-block;
      position: relative;
      margin-inline-end: 16px;
      --md-outlined-button-leading-space: 8px;
      --md-outlined-button-trailing-space: 8px;
      --md-outlined-button-container-height: 32px;
      /* md-checkbox sizes */
      --_component-size: 40px;
      --_color-picker-size: 14px;
      --_color-picker-border-width: 2px;
    }

    input {
      box-sizing: content-box;
      width: var(--_color-picker-size);
      height: var(--_color-picker-size);
      margin: calc(
        (
            var(--_component-size) - var(--_color-picker-size) -
              var(--_color-picker-border-width) * 2
          ) / 2
      );
      padding: 0;
      cursor: pointer;
      border-radius: var(--_color-picker-border-width);
      border: var(--_color-picker-border-width) solid
        var(--md-sys-color-outline);
      outline: none;
    }

    input::-webkit-color-swatch-wrapper {
      padding: 0;
    }

    input::-webkit-color-swatch {
      border: 0;
    }

    span {
      position: relative;
      display: inline-block;
    }

    md-ripple {
      inset: unset;
      width: var(--_component-size);
      height: var(--_component-size);
      border-radius: 50%;
    }

    #wrapper {
      display: flex;
      align-items: center;
    }
  `;
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: Boolean })
], KnobColorSelector.prototype, "hasAlpha", void 0);
tslib_1.__decorate([
    (0, decorators_js_1.property)({ type: String, reflect: true })
], KnobColorSelector.prototype, "value", null);
exports.KnobColorSelector = KnobColorSelector = tslib_1.__decorate([
    (0, decorators_js_1.customElement)('knob-color-selector')
], KnobColorSelector);
const defaultColorPickerOpts = {
    hasAlpha: false,
};
/**
 * A color picker Knob UI.
 */
function colorPicker(opts) {
    const config = {
        ...defaultColorPickerOpts,
        ...opts,
    };
    return {
        render(knob, onChange) {
            const valueChanged = (e) => {
                onChange(e.target.value);
            };
            return (0, lit_1.html) `
        <div>
          <label>
            <knob-color-selector
              .value="${knob.latestValue ?? ''}"
              .hasAlpha="${config.hasAlpha}"
              @input=${valueChanged}
            ></knob-color-selector>
            ${knob.name}
          </label>
        </div>
      `;
        },
    };
}
const sharedTextFieldStyles = {
    'margin-inline-end': '16px',
    '--md-filled-field-leading-space': '8px',
    '--md-filled-field-trailing-space': '8px',
    '--md-filled-field-top-space': '4px',
    '--md-filled-field-bottom-space': '4px',
    width: '150px',
    'min-width': '150px',
};
function textInput(options) {
    return {
        render(knob, onChange) {
            const valueChanged = (e) => {
                const rawVal = e.target.value;
                if (options) {
                    onChange(options.transform(rawVal));
                }
                else {
                    onChange(rawVal);
                }
            };
            return (0, lit_1.html) `
        <div>
          <label>
            <md-filled-text-field
              style=${(0, style_map_js_1.styleMap)(sharedTextFieldStyles)}
              .value="${(knob.latestValue ?? '')}"
              @input="${valueChanged}"
            ></md-filled-text-field>
            ${knob.name}
          </label>
        </div>
      `;
        },
    };
}
const defaultNumberInputOpts = {
    step: 1,
};
/**
 * A simple, one line text input Knob UI.
 */
function numberInput(opts) {
    const config = {
        ...defaultNumberInputOpts,
        ...opts,
    };
    return {
        render(knob, onChange, onReset) {
            const valueChanged = (e) => {
                const rawVal = e.target.value;
                onChange(Number(rawVal));
            };
            return (0, lit_1.html) `
        <div>
          <label>
            <md-filled-text-field
              style=${(0, style_map_js_1.styleMap)(sharedTextFieldStyles)}
              type="number"
              step="${config.step}"
              .value="${knob.latestValue ? knob.latestValue.toString() : '0'}"
              @input="${valueChanged}"
            ></md-filled-text-field>
            ${knob.name}
          </label>
        </div>
      `;
        },
    };
}
/**
 * A Knob UI that's just a button that triggers a rerender which it's clicked.
 * The value keeps track of the number of times it's been clicked.
 */
function button() {
    return {
        render(knob, onChange) {
            const onClick = () => {
                const count = knob.latestValue ?? 0;
                onChange(count + 1);
            };
            const styles = (0, style_map_js_1.styleMap)({ display: 'inline-block' });
            return (0, lit_1.html) `
        <md-outlined-button outlined @click=${onClick} style=${styles}>
          ${knob.name}
        </md-outlined-button>
      `;
        },
    };
}
/** A radio button Knob UI. */
function radioSelector({ options, name, }) {
    return {
        render(knob, onChange) {
            const valueChanged = (e) => {
                onChange(e.target.value);
            };
            const radioOptions = options.map((option, index) => {
                const value = option.value;
                return (0, lit_1.html) ` <label>
          <md-radio
            name="${name}"
            value="${value}"
            @change="${valueChanged}"
            ?checked="${knob.latestValue === option.value}"
          ></md-radio>
          ${option.label}
        </label>`;
            });
            return (0, lit_1.html) ` <div>${radioOptions}</div> `;
        },
    };
}
/** A select dropdown Knob UI. */
function selectDropdown({ options, }) {
    return {
        render(knob, onChange) {
            const valueChanged = (e) => {
                onChange(e.target.value);
            };
            const listItems = options.map((option, index) => {
                return (0, lit_1.html) `<md-select-option
          ?selected="${knob.latestValue === option.value}"
          .value="${option.value}"
        >
          <div slot="headline">${option.label}</div>
        </md-select-option>`;
            });
            return (0, lit_1.html) `
        <label>
          <md-filled-select
            @change="${valueChanged}"
            menu-positioning="fixed"
            style=${(0, style_map_js_1.styleMap)(sharedTextFieldStyles)}
          >
            ${listItems}
          </md-filled-select>
          ${knob.name}
        </label>
      `;
        },
    };
}
/**
 * Knob wiring that updates the CSS custom property with the knob's name
 * to the updated value.
 */
function cssCustomProperty(knob, val, containerOfRenderedStory) {
    const value = knob.isUnset ? knob.defaultValue : val;
    if (value) {
        containerOfRenderedStory.style.setProperty(knob.name, value);
    }
    else {
        containerOfRenderedStory.style.removeProperty(knob.name);
    }
}
const setPropDefaults = new WeakMap();
/**
 * Knob wiring that updates the CSS properties on a given querySelector's
 * targets.
 */
function setProp(selector) {
    // In the common case, where selector is keyof ElementTagNameMap, can we
    // actually type check this?
    // tslint:disable-next-line:no-any No way to represent this type clearly.
    return (knob, val, container) => {
        let defaults = setPropDefaults.get(knob);
        if (defaults === undefined) {
            defaults = new WeakMap();
            setPropDefaults.set(knob, defaults);
        }
        const elements = Array.from(container.querySelectorAll(selector));
        if (knob.isUnset === true) {
            for (const element of elements) {
                if (defaults.has(element)) {
                    const defaultVal = defaults.get(element);
                    // tslint:disable-next-line:no-any Necessary
                    element[knob.name] = defaultVal;
                    defaults.delete(element);
                }
            }
            return;
        }
        for (const element of elements) {
            if (!defaults.has(element)) {
                // tslint:disable-next-line:no-any Necessary for setting arbitrary props
                defaults.set(element, element[knob.name]);
            }
            // tslint:disable-next-line:no-any Necessary for setting arbitrary props
            element[knob.name] = val;
        }
    };
}
//# sourceMappingURL=knob-ui-components.js.map