/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate } from "tslib";
import { css, html, LitElement, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { CLOSE_REASONS } from './snackbar.js';
import { SnackbarElement } from './snackbar-element.js';
/**
 * Snackbar durations in ms, from Compose `SnackbarDuration.toMillis`:
 * `short` 4s, `long` 10s, `indefinite` stays until dismissed (-1 disables
 * the timeout).
 */
export const SNACKBAR_DURATIONS = {
    short: 4000,
    long: 10000,
    indefinite: -1,
};
/** How a snackbar shown with `showSnackbar()` ended (Compose `SnackbarResult`). */
export const SNACKBAR_RESULTS = {
    /** The action was activated. */
    ACTION_PERFORMED: 'action-performed',
    /** The snackbar timed out, or was dismissed or replaced. */
    DISMISSED: 'dismissed',
};
/** Close reason of a snackbar replaced by `showSnackbar({replace: true})`. */
export const REPLACED_REASON = 'replaced';
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
export class SnackbarHostElement extends LitElement {
    constructor() {
        super(...arguments);
        /** Whether the built-in snackbar is positioned in the viewport (fixed). */
        this.fixed = false;
        /**
         * The id of the element the built-in snackbar appears above, such as a FAB
         * (see `md-gb-snackbar` `anchor`).
         */
        this.anchor = '';
        /** The element the built-in snackbar appears above, such as a FAB. */
        this.anchorElement = null;
        /** Accessible label of the close icon button. */
        this.closeLabel = 'Close';
        /** Whether to skip the snackbar's opening and closing motion. */
        this.quick = false;
        this.slottedSnackbar = null;
        this.queue = [];
        this.current = null;
        this.currentSnackbar = null;
        this.handleSlotChange = () => {
            this.slottedSnackbar = this.findSlottedSnackbar();
        };
    }
    /** The snackbar being shown, or null. */
    get currentSnackbarData() {
        return this.current?.data ?? null;
    }
    /** How many snackbars wait to be shown after the current one. */
    get pendingCount() {
        return this.queue.length;
    }
    /** The snackbar the host shows messages in. */
    get snackbar() {
        return (this.findSlottedSnackbar() ??
            this.renderRoot?.querySelector('md-gb-snackbar') ??
            null);
    }
    connectedCallback() {
        super.connectedCallback();
        this.slottedSnackbar = this.findSlottedSnackbar();
    }
    findSlottedSnackbar() {
        return (Array.from(this.children).find((el) => el instanceof SnackbarElement) ?? null);
    }
    /** The built-in snackbar's anchor: `anchorElement`, or `anchor` by id. */
    resolveAnchor() {
        if (this.anchorElement) {
            return this.anchorElement;
        }
        if (!this.anchor) {
            return null;
        }
        const root = this.getRootNode();
        const el = typeof root.getElementById === 'function'
            ? root.getElementById(this.anchor)
            : null;
        return el instanceof HTMLElement ? el : null;
    }
    /**
     * Queues a snackbar and resolves when it ends: `action-performed` when its
     * action is activated, otherwise `dismissed`.
     *
     * @param options The message, or the snackbar's visuals and options.
     */
    showSnackbar(options) {
        const opts = typeof options === 'string' ? { message: options } : options;
        const actionLabel = opts.actionLabel ?? '';
        const visuals = {
            message: opts.message,
            actionLabel,
            withDismissAction: opts.withDismissAction ?? false,
            duration: opts.duration ?? (actionLabel ? 'indefinite' : 'short'),
        };
        return new Promise((resolve) => {
            const entry = {
                resolve,
                settled: false,
                data: {
                    visuals,
                    performAction: () => {
                        this.closeEntry(entry, CLOSE_REASONS.ACTION);
                    },
                    dismiss: () => {
                        this.closeEntry(entry, CLOSE_REASONS.DISMISS);
                    },
                },
            };
            if (opts.replace) {
                this.queue.unshift(entry);
                if (this.current) {
                    this.currentSnackbar?.close(REPLACED_REASON);
                }
            }
            else {
                this.queue.push(entry);
            }
            this.showNext();
        });
    }
    /** Dismisses the current snackbar and every queued one. */
    dismissAll() {
        for (const entry of this.queue.splice(0)) {
            this.settle(entry, SNACKBAR_RESULTS.DISMISSED);
        }
        this.current?.data.dismiss();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        // A removed host can't show its queue.
        this.dismissAll();
    }
    closeEntry(entry, reason) {
        if (entry === this.current) {
            this.currentSnackbar?.close(reason);
            return;
        }
        const index = this.queue.indexOf(entry);
        if (index >= 0) {
            this.queue.splice(index, 1);
            this.settle(entry, reason === CLOSE_REASONS.ACTION
                ? SNACKBAR_RESULTS.ACTION_PERFORMED
                : SNACKBAR_RESULTS.DISMISSED);
        }
    }
    settle(entry, result) {
        if (entry.settled) {
            return;
        }
        entry.settled = true;
        entry.resolve(result);
    }
    /** Shows the next queued snackbar when none is showing. */
    async showNext() {
        if (this.current) {
            return;
        }
        await this.updateComplete;
        const snackbar = this.snackbar;
        if (this.current || !snackbar || !this.isConnected) {
            return;
        }
        const entry = this.queue.shift();
        if (!entry) {
            return;
        }
        const { visuals } = entry.data;
        this.current = entry;
        this.currentSnackbar = snackbar;
        snackbar.labelText = visuals.message;
        snackbar.actionLabel = visuals.actionLabel;
        snackbar.hasCloseButton = visuals.withDismissAction;
        snackbar.timeoutMs =
            typeof visuals.duration === 'number'
                ? visuals.duration
                : SNACKBAR_DURATIONS[visuals.duration];
        if (!this.findSlottedSnackbar()) {
            snackbar.closeLabel = this.closeLabel;
            snackbar.anchorElement = this.resolveAnchor();
        }
        const handleClosed = (event) => {
            if (event.target !== snackbar) {
                return;
            }
            snackbar.removeEventListener('closed', handleClosed);
            const reason = event.detail?.reason;
            this.finishCurrent(entry, reason === CLOSE_REASONS.ACTION
                ? SNACKBAR_RESULTS.ACTION_PERFORMED
                : SNACKBAR_RESULTS.DISMISSED);
        };
        snackbar.addEventListener('closed', handleClosed);
        await snackbar.updateComplete;
        if (this.current !== entry) {
            snackbar.removeEventListener('closed', handleClosed);
            return;
        }
        // `show()` fires a cancelable `open` synchronously; a canceled open
        // skips this snackbar.
        snackbar.show();
        if (!snackbar.open) {
            snackbar.removeEventListener('closed', handleClosed);
            this.finishCurrent(entry, SNACKBAR_RESULTS.DISMISSED);
        }
    }
    finishCurrent(entry, result) {
        if (this.current === entry) {
            this.current = null;
            this.currentSnackbar = null;
        }
        this.settle(entry, result);
        this.showNext();
    }
    render() {
        return html `
      <slot @slotchange=${this.handleSlotChange}></slot>
      ${this.slottedSnackbar
            ? nothing
            : html `<md-gb-snackbar
            part="snackbar"
            ?fixed=${this.fixed}
            ?quick=${this.quick}
            close-label=${this.closeLabel}></md-gb-snackbar>`}
    `;
    }
}
/** @nocollapse */
SnackbarHostElement.styles = [
    css `
      :host {
        display: contents;
      }
    `,
];
__decorate([
    property({ type: Boolean, reflect: true })
], SnackbarHostElement.prototype, "fixed", void 0);
__decorate([
    property()
], SnackbarHostElement.prototype, "anchor", void 0);
__decorate([
    property({ attribute: false })
], SnackbarHostElement.prototype, "anchorElement", void 0);
__decorate([
    property({ attribute: 'close-label' })
], SnackbarHostElement.prototype, "closeLabel", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], SnackbarHostElement.prototype, "quick", void 0);
__decorate([
    state()
], SnackbarHostElement.prototype, "slottedSnackbar", void 0);
//# sourceMappingURL=snackbar-host-element.js.map