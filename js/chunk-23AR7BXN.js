import {
  internals
} from "./chunk-AE6MH53A.js";
import {
  __decorate,
  n,
  o2 as o
} from "./chunk-KV6CMQ6O.js";

// ../internal/events/dispatch-hooks.js
var dispatchHooks = /* @__PURE__ */ Symbol("dispatchHooks");
function afterDispatch(event, callback) {
  const hooks = event[dispatchHooks];
  if (!hooks) {
    throw new Error(`'${event.type}' event needs setupDispatchHooks().`);
  }
  hooks.addEventListener("after", callback, { once: true });
}
var ELEMENT_DISPATCH_HOOK_TYPES = /* @__PURE__ */ new WeakMap();
function setupDispatchHooks(element, ...eventTypes) {
  let typesAlreadySetUp = ELEMENT_DISPATCH_HOOK_TYPES.get(element);
  if (!typesAlreadySetUp) {
    typesAlreadySetUp = /* @__PURE__ */ new Set();
    ELEMENT_DISPATCH_HOOK_TYPES.set(element, typesAlreadySetUp);
  }
  for (const eventType of eventTypes) {
    if (typesAlreadySetUp.has(eventType)) {
      continue;
    }
    element.addEventListener(eventType, (event) => {
      const hooks = new EventTarget();
      event[dispatchHooks] = hooks;
      const cleanupLastNodeListener = new AbortController();
      const callAfterDispatch = () => {
        cleanupLastNodeListener.abort();
        hooks.dispatchEvent(new Event("after"));
      };
      const patchStopPropagation = (superMethod) => {
        return function() {
          superMethod.call(this);
          callAfterDispatch();
        };
      };
      event.stopPropagation = patchStopPropagation(event.stopPropagation);
      event.stopImmediatePropagation = patchStopPropagation(event.stopImmediatePropagation);
      const composedPath = event.composedPath();
      let lastNodeForEvent;
      if (event.composed && event.bubbles) {
        lastNodeForEvent = composedPath[composedPath.length - 1];
      } else if (!event.bubbles) {
        lastNodeForEvent = composedPath[0];
      } else {
        lastNodeForEvent = composedPath[0].getRootNode();
      }
      lastNodeForEvent.addEventListener(eventType, () => {
        callAfterDispatch();
      }, { once: true, signal: cleanupLastNodeListener.signal });
    }, {
      // Ensure this listener runs before other listeners.
      // `setupDispatchHooks()` should be called in constructors to also
      // ensure they run before any other externally-added capture listeners.
      capture: true
    });
    typesAlreadySetUp.add(eventType);
  }
}

// ../labs/behaviors/form-submitter.js
function mixinFormSubmitter(base) {
  class FormSubmitterElement extends base {
    // Name attribute must reflect synchronously for form integration.
    get name() {
      return this.getAttribute("name") ?? "";
    }
    set name(name) {
      this.setAttribute("name", name);
    }
    // Mixins must have a constructor with `...args: any[]`
    // tslint:disable-next-line:no-any
    constructor(...args) {
      super(...args);
      this.type = "submit";
      this.value = "";
      if (o)
        return;
      setupDispatchHooks(this, "click");
      this.addEventListener("click", async (event) => {
        const isReset = this.type === "reset";
        const isSubmit = this.type === "submit";
        const elementInternals = this[internals];
        const { form } = elementInternals;
        if (!form || !(isSubmit || isReset)) {
          return;
        }
        afterDispatch(event, () => {
          if (event.defaultPrevented) {
            return;
          }
          if (isReset) {
            form.reset();
            return;
          }
          form.addEventListener("submit", (submitEvent) => {
            Object.defineProperty(submitEvent, "submitter", {
              configurable: true,
              enumerable: true,
              get: () => this
            });
          }, { capture: true, once: true });
          elementInternals.setFormValue(this.value);
          form.requestSubmit();
        });
      });
    }
  }
  __decorate([
    n()
  ], FormSubmitterElement.prototype, "type", void 0);
  __decorate([
    n({ reflect: true })
  ], FormSubmitterElement.prototype, "value", void 0);
  return FormSubmitterElement;
}

export {
  afterDispatch,
  setupDispatchHooks,
  mixinFormSubmitter
};
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
//# sourceMappingURL=chunk-23AR7BXN.js.map
