/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ReactiveController, type ReactiveControllerHost } from 'lit';
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
export declare class InvokerController implements ReactiveController {
    private readonly host;
    private readonly button;
    private attributeObserver?;
    private rootObserver?;
    private observedRoot?;
    constructor(host: ReactiveControllerHost & HTMLElement, button: () => Element | null | undefined);
    hostConnected(): void;
    hostDisconnected(): void;
    hostUpdated(): void;
    /** Watches the root for targets that appear, go or change their id. */
    private observeRoot;
    private resolve;
    private sync;
}
