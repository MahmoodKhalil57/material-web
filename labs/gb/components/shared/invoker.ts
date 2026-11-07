/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ReactiveController, type ReactiveControllerHost} from 'lit';

/** The invoker attributes a host can carry like a native `<button>`. */
const ATTRIBUTES = [
  'popovertarget',
  'popovertargetaction',
  'commandfor',
  'command',
];

/** `command` values that a `popovertarget` button can express. */
const POPOVER_COMMANDS: Record<string, string> = {
  'show-popover': 'show',
  'hide-popover': 'hide',
  'toggle-popover': 'toggle',
};

type InvokerButton = HTMLButtonElement & {
  commandForElement?: Element | null;
  command?: string;
};

/**
 * Lets a custom element host the invoker attributes of a native button:
 * `popovertarget` (+ `popovertargetaction`) and `commandfor` (+ `command`).
 * The ids are resolved in the host's root node and set as element references
 * (`popoverTargetElement`, `commandForElement`) on the inner button, which
 * element reflection allows to point into a shadow-including ancestor tree.
 * The references follow changes of the attributes, and of the target (added,
 * removed, or given the id later).
 *
 * `commandfor` is newer than Baseline widely available. Where the button has
 * no `commandForElement`, the show, hide and toggle popover commands fall
 * back to `popoverTargetElement` with the matching action; other commands do
 * nothing there.
 */
export class InvokerController implements ReactiveController {
  private attributeObserver?: MutationObserver;
  private rootObserver?: MutationObserver;
  private observedRoot?: Node;

  constructor(
    private readonly host: ReactiveControllerHost & HTMLElement,
    private readonly button: () => Element | null | undefined,
  ) {
    host.addController(this);
  }

  hostConnected() {
    if (typeof MutationObserver === 'undefined') return;
    this.attributeObserver ??= new MutationObserver(() => this.sync());
    this.attributeObserver.observe(this.host, {
      attributes: true,
      attributeFilter: ATTRIBUTES,
    });
    this.observeRoot();
  }

  hostDisconnected() {
    this.attributeObserver?.disconnect();
    this.rootObserver?.disconnect();
    this.observedRoot = undefined;
  }

  hostUpdated() {
    this.sync();
  }

  /** Watches the root for targets that appear, go or change their id. */
  private observeRoot() {
    const root = this.host.getRootNode();
    if (root === this.observedRoot) return;
    this.rootObserver?.disconnect();
    this.observedRoot = root;
    this.rootObserver ??= new MutationObserver(() => this.sync());
    this.rootObserver.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['id'],
    });
  }

  private resolve(attribute: string): Element | null {
    const id = this.host.getAttribute(attribute);
    if (!id) return null;
    const root = this.host.getRootNode() as Document | ShadowRoot;
    return root.getElementById?.(id) ?? null;
  }

  private sync() {
    if (!this.host.isConnected) return;
    this.observeRoot();
    const button = this.button() as InvokerButton | null | undefined;
    if (!(button instanceof HTMLButtonElement)) return;

    const popoverTarget = this.resolve('popovertarget');
    const action = this.host.getAttribute('popovertargetaction');
    const commandTarget = this.resolve('commandfor');
    const command = this.host.getAttribute('command') ?? '';

    let target = popoverTarget;
    let targetAction = action;
    let commandFor: Element | null = null;
    if ('commandForElement' in HTMLButtonElement.prototype) {
      commandFor = commandTarget;
    } else if (commandTarget && command in POPOVER_COMMANDS) {
      // `commandfor` wins over `popovertarget`, as it does natively.
      target = commandTarget;
      targetAction = POPOVER_COMMANDS[command];
    }

    if (button.popoverTargetElement !== target) {
      button.popoverTargetElement = target as HTMLElement | null;
    }
    setAttr(button, 'popovertargetaction', target ? targetAction : null);
    if ('commandForElement' in button) {
      if (button.commandForElement !== commandFor) {
        button.commandForElement = commandFor;
      }
      setAttr(button, 'command', commandFor ? command : null);
    }
  }
}

function setAttr(element: Element, name: string, value: string | null) {
  if (value === null || value === '') {
    if (element.hasAttribute(name)) element.removeAttribute(name);
  } else if (element.getAttribute(name) !== value) {
    element.setAttribute(name, value);
  }
}
