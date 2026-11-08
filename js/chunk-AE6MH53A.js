import {
  __decorate,
  n
} from "./chunk-KV6CMQ6O.js";

// ../labs/behaviors/element-internals.js
var internals = /* @__PURE__ */ Symbol("internals");
var privateInternals = /* @__PURE__ */ Symbol("privateInternals");
function mixinElementInternals(base) {
  class WithElementInternalsElement extends base {
    get [internals]() {
      if (!this[privateInternals]) {
        this[privateInternals] = this.attachInternals();
      }
      return this[privateInternals];
    }
  }
  return WithElementInternalsElement;
}

// ../labs/behaviors/form-associated.js
var getFormValue = /* @__PURE__ */ Symbol("getFormValue");
var getFormState = /* @__PURE__ */ Symbol("getFormState");
function mixinFormAssociated(base) {
  class FormAssociatedElement extends base {
    get form() {
      return this[internals].form;
    }
    get labels() {
      return this[internals].labels;
    }
    // Use @property for the `name` and `disabled` properties to add them to the
    // `observedAttributes` array and trigger `attributeChangedCallback()`.
    //
    // We don't use Lit's default getter/setter (`noAccessor: true`) because
    // the attributes need to be updated synchronously to work with synchronous
    // form APIs, and Lit updates attributes async by default.
    get name() {
      return this.getAttribute("name") ?? "";
    }
    set name(name) {
      this.setAttribute("name", name);
    }
    get disabled() {
      return this.hasAttribute("disabled");
    }
    set disabled(disabled) {
      this.toggleAttribute("disabled", Boolean(disabled));
    }
    attributeChangedCallback(name, old, value) {
      if (name === "name" || name === "disabled") {
        const oldValue = name === "disabled" ? old !== null : old;
        this.requestUpdate(name, oldValue);
        return;
      }
      super.attributeChangedCallback(name, old, value);
    }
    requestUpdate(name, oldValue, options) {
      super.requestUpdate(name, oldValue, options);
      this[internals].setFormValue(this[getFormValue](), this[getFormState]());
    }
    [getFormValue]() {
      return this.getAttribute("value");
    }
    [getFormState]() {
      return this[getFormValue]();
    }
    formDisabledCallback(disabled) {
      this.disabled = disabled;
    }
  }
  FormAssociatedElement.formAssociated = true;
  __decorate([
    n({ noAccessor: true })
  ], FormAssociatedElement.prototype, "name", null);
  __decorate([
    n({ type: Boolean, noAccessor: true })
  ], FormAssociatedElement.prototype, "disabled", null);
  return FormAssociatedElement;
}

export {
  internals,
  mixinElementInternals,
  getFormValue,
  getFormState,
  mixinFormAssociated
};
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
//# sourceMappingURL=chunk-AE6MH53A.js.map
