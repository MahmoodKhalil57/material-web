import {
  internals
} from "./chunk-AE6MH53A.js";
import {
  o2 as o
} from "./chunk-KV6CMQ6O.js";

// ../labs/behaviors/constraint-validation.js
var createValidator = /* @__PURE__ */ Symbol("createValidator");
var getValidityAnchor = /* @__PURE__ */ Symbol("getValidityAnchor");
var privateValidator = /* @__PURE__ */ Symbol("privateValidator");
var privateSyncValidity = /* @__PURE__ */ Symbol("privateSyncValidity");
var privateCustomValidationMessage = /* @__PURE__ */ Symbol("privateCustomValidationMessage");
function mixinConstraintValidation(base) {
  var _a;
  class ConstraintValidationElement extends base {
    constructor() {
      super(...arguments);
      this[_a] = "";
    }
    get validity() {
      this[privateSyncValidity]();
      return this[internals].validity;
    }
    get validationMessage() {
      this[privateSyncValidity]();
      return this[internals].validationMessage;
    }
    get willValidate() {
      this[privateSyncValidity]();
      return this[internals].willValidate;
    }
    checkValidity() {
      this[privateSyncValidity]();
      return this[internals].checkValidity();
    }
    reportValidity() {
      this[privateSyncValidity]();
      return this[internals].reportValidity();
    }
    setCustomValidity(error) {
      this[privateCustomValidationMessage] = error;
      this[privateSyncValidity]();
    }
    requestUpdate(name, oldValue, options) {
      super.requestUpdate(name, oldValue, options);
      this[privateSyncValidity]();
    }
    firstUpdated(changed) {
      super.firstUpdated(changed);
      this[privateSyncValidity]();
    }
    [(_a = privateCustomValidationMessage, privateSyncValidity)]() {
      if (o) {
        return;
      }
      if (!this[privateValidator]) {
        this[privateValidator] = this[createValidator]();
      }
      const { validity, validationMessage: nonCustomValidationMessage } = this[privateValidator].getValidity();
      const customError = !!this[privateCustomValidationMessage];
      const validationMessage = this[privateCustomValidationMessage] || nonCustomValidationMessage;
      this[internals].setValidity({ ...validity, customError }, validationMessage, this[getValidityAnchor]() ?? void 0);
    }
    [createValidator]() {
      throw new Error("Implement [createValidator]");
    }
    [getValidityAnchor]() {
      throw new Error("Implement [getValidityAnchor]");
    }
  }
  return ConstraintValidationElement;
}

// ../labs/behaviors/validators/validator.js
var Validator = class {
  /**
   * Creates a new validator.
   *
   * @param getCurrentState A callback that returns the current state of
   *     constraint validation-related properties.
   */
  constructor(getCurrentState) {
    this.getCurrentState = getCurrentState;
    this.currentValidity = {
      validity: {},
      validationMessage: ""
    };
  }
  /**
   * Returns the current `ValidityStateFlags` and validation message for the
   * validator.
   *
   * If the constraint validation state has not changed, this will return a
   * cached result. This is important since `getValidity()` can be called
   * frequently in response to synchronous property changes.
   *
   * @return The current validity and validation message.
   */
  getValidity() {
    const state = this.getCurrentState();
    const hasStateChanged = !this.prevState || !this.equals(this.prevState, state);
    if (!hasStateChanged) {
      return this.currentValidity;
    }
    const { validity, validationMessage } = this.computeValidity(state);
    this.prevState = this.copy(state);
    this.currentValidity = {
      validationMessage,
      validity: {
        // Change any `ValidityState` instances into `ValidityStateFlags` since
        // `ValidityState` cannot be easily `{...spread}`.
        badInput: validity.badInput,
        customError: validity.customError,
        patternMismatch: validity.patternMismatch,
        rangeOverflow: validity.rangeOverflow,
        rangeUnderflow: validity.rangeUnderflow,
        stepMismatch: validity.stepMismatch,
        tooLong: validity.tooLong,
        tooShort: validity.tooShort,
        typeMismatch: validity.typeMismatch,
        valueMissing: validity.valueMissing
      }
    };
    return this.currentValidity;
  }
};

export {
  createValidator,
  getValidityAnchor,
  mixinConstraintValidation,
  Validator
};
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
//# sourceMappingURL=chunk-6DNNYCPO.js.map
