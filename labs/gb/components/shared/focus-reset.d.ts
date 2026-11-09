/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/** Moves the sequential focus navigation starting point to the document start. */
export declare function resetFocusOrder(): void;
/** Removes focus from the focused element and resets the focus order. */
export declare function leaveFocus(): void;
/**
 * Installs the Escape key behavior once per document. Safe to call from
 * every component module.
 */
export declare function installEscapeFocusReset(): void;
