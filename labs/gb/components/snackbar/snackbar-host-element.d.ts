/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type CSSResultOrNative, LitElement } from 'lit';
import { SnackbarElement } from './snackbar-element.js';
/**
 * Snackbar durations in ms, from Compose `SnackbarDuration.toMillis`:
 * `short` 4s, `long` 10s, `indefinite` stays until dismissed (-1 disables
 * the timeout).
 */
export declare const SNACKBAR_DURATIONS: {
    readonly short: 4000;
    readonly long: 10000;
    readonly indefinite: -1;
};
/** A named duration (see `SNACKBAR_DURATIONS`) or a timeout in ms. */
export type SnackbarDuration = keyof typeof SNACKBAR_DURATIONS | number;
/** How a snackbar shown with `showSnackbar()` ended (Compose `SnackbarResult`). */
export declare const SNACKBAR_RESULTS: {
    /** The action was activated. */
    readonly ACTION_PERFORMED: "action-performed";
    /** The snackbar timed out, or was dismissed or replaced. */
    readonly DISMISSED: "dismissed";
};
/** See `SNACKBAR_RESULTS`. */
export type SnackbarResult = (typeof SNACKBAR_RESULTS)[keyof typeof SNACKBAR_RESULTS];
/** Close reason of a snackbar replaced by `showSnackbar({replace: true})`. */
export declare const REPLACED_REASON = "replaced";
/** What a queued snackbar shows (Compose `SnackbarVisuals`). */
export interface SnackbarVisuals {
    /** The message. */
    message: string;
    /** The action button's label. No action when empty. */
    actionLabel?: string;
    /** Whether to show the close icon button. */
    withDismissAction?: boolean;
    /**
     * How long the snackbar stays. Defaults to `short` without an action and
     * `indefinite` with one, like Compose: snackbars with actions remain until
     * the user acts or dismisses them (snackbar.md, Behavior).
     */
    duration?: SnackbarDuration;
}
/** Options of `showSnackbar()`. */
export interface ShowSnackbarOptions extends SnackbarVisuals {
    /**
     * Replace the current snackbar now instead of waiting for it, for updated
     * information that makes it outdated (snackbar.md, Consecutive snackbars).
     * The replaced snackbar resolves `dismissed`.
     */
    replace?: boolean;
}
/** The snackbar being shown (Compose `SnackbarData`). */
export interface SnackbarData {
    /** What the snackbar shows. */
    readonly visuals: Readonly<Required<SnackbarVisuals>>;
    /** Closes the snackbar as if its action was activated. */
    performAction(): void;
    /** Closes the snackbar. */
    dismiss(): void;
}
/**
 * Shows queued snackbars one at a time, like Compose `SnackbarHost` with a
 * `SnackbarHostState`: consecutive snackbars appear one after another, each
 * after the previous one is dismissed (snackbar.md, Consecutive snackbars).
 *
 * ```ts
 * const result = await host.showSnackbar({
 *   message: 'Message archived',
 *   actionLabel: 'Undo',
 * });
 * if (result === 'action-performed') undoArchive();
 * ```
 *
 * The host shows its messages in one `md-gb-snackbar`: a slotted one (to set
 * its tokens, `fixed` or `anchor` directly) or, when none is slotted, its
 * own. The host sets the snackbar's `label-text`, `action-label`,
 * `has-close-button` and `timeout-ms` for each message. Because one snackbar
 * is reused, its polite live region stays in the page and announces every
 * message without moving focus.
 *
 * @slot - Optional `md-gb-snackbar` to show the messages in.
 * @csspart snackbar - The built-in snackbar, when none is slotted.
 * @fires {CustomEvent<{reason: string}>} close - Bubbles from the snackbar when it begins closing.
 * @fires {CustomEvent<{reason: string}>} closed - Bubbles from the snackbar when it has closed.
 */
export declare class SnackbarHostElement extends LitElement {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /** Whether the built-in snackbar is positioned in the viewport (fixed). */
    fixed: boolean;
    /**
     * The id of the element the built-in snackbar appears above, such as a FAB
     * (see `md-gb-snackbar` `anchor`).
     */
    anchor: string;
    /** The element the built-in snackbar appears above, such as a FAB. */
    anchorElement: HTMLElement | null;
    /** Accessible label of the close icon button. */
    closeLabel: string;
    /** Whether to skip the snackbar's opening and closing motion. */
    quick: boolean;
    private slottedSnackbar;
    private readonly queue;
    private current;
    private currentSnackbar;
    /** The snackbar being shown, or null. */
    get currentSnackbarData(): SnackbarData | null;
    /** How many snackbars wait to be shown after the current one. */
    get pendingCount(): number;
    /** The snackbar the host shows messages in. */
    get snackbar(): SnackbarElement | null;
    connectedCallback(): void;
    private findSlottedSnackbar;
    /** The built-in snackbar's anchor: `anchorElement`, or `anchor` by id. */
    private resolveAnchor;
    /**
     * Queues a snackbar and resolves when it ends: `action-performed` when its
     * action is activated, otherwise `dismissed`.
     *
     * @param options The message, or the snackbar's visuals and options.
     */
    showSnackbar(options: string | ShowSnackbarOptions): Promise<SnackbarResult>;
    /** Dismisses the current snackbar and every queued one. */
    dismissAll(): void;
    disconnectedCallback(): void;
    private closeEntry;
    private settle;
    /** Shows the next queued snackbar when none is showing. */
    private showNext;
    private finishCurrent;
    private readonly handleSlotChange;
    render(): import("lit-html").TemplateResult<1>;
}
