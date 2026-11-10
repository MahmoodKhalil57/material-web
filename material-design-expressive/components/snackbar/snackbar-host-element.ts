/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, type CSSResultOrNative, html, LitElement, nothing} from 'lit';
import {property, state} from 'lit/decorators.js';
import {CLOSE_REASONS} from './snackbar.js';
import {SnackbarElement} from './snackbar-element.js';

/**
 * Snackbar durations in ms, from Compose `SnackbarDuration.toMillis`:
 * `short` 4s, `long` 10s, `indefinite` stays until dismissed (-1 disables
 * the timeout).
 */
export const SNACKBAR_DURATIONS = {
  short: 4000,
  long: 10000,
  indefinite: -1,
} as const;

/** A named duration (see `SNACKBAR_DURATIONS`) or a timeout in ms. */
export type SnackbarDuration = keyof typeof SNACKBAR_DURATIONS | number;

/** How a snackbar shown with `showSnackbar()` ended (Compose `SnackbarResult`). */
export const SNACKBAR_RESULTS = {
  /** The action was activated. */
  ACTION_PERFORMED: 'action-performed',
  /** The snackbar timed out, or was dismissed or replaced. */
  DISMISSED: 'dismissed',
} as const;

/** See `SNACKBAR_RESULTS`. */
export type SnackbarResult =
  (typeof SNACKBAR_RESULTS)[keyof typeof SNACKBAR_RESULTS];

/** Close reason of a snackbar replaced by `showSnackbar({replace: true})`. */
export const REPLACED_REASON = 'replaced';

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

interface QueueEntry {
  data: SnackbarData;
  resolve: (result: SnackbarResult) => void;
  /** Set when the entry is dismissed before it is shown. */
  settled: boolean;
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
export class SnackbarHostElement extends LitElement {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    css`
      :host {
        display: contents;
      }
    `,
  ];

  /** Whether the built-in snackbar is positioned in the viewport (fixed). */
  @property({type: Boolean, reflect: true}) fixed = false;

  /**
   * The id of the element the built-in snackbar appears above, such as a FAB
   * (see `md-gb-snackbar` `anchor`).
   */
  @property() anchor = '';

  /** The element the built-in snackbar appears above, such as a FAB. */
  @property({attribute: false}) anchorElement: HTMLElement | null = null;

  /** Accessible label of the close icon button. */
  @property({attribute: 'close-label'}) closeLabel = 'Close';

  /** Whether to skip the snackbar's opening and closing motion. */
  @property({type: Boolean, reflect: true}) quick = false;

  @state() private slottedSnackbar: SnackbarElement | null = null;

  private readonly queue: QueueEntry[] = [];
  private current: QueueEntry | null = null;
  private currentSnackbar: SnackbarElement | null = null;

  /** The snackbar being shown, or null. */
  get currentSnackbarData(): SnackbarData | null {
    return this.current?.data ?? null;
  }

  /** How many snackbars wait to be shown after the current one. */
  get pendingCount(): number {
    return this.queue.length;
  }

  /** The snackbar the host shows messages in. */
  get snackbar(): SnackbarElement | null {
    return (
      this.findSlottedSnackbar() ??
      this.renderRoot?.querySelector<SnackbarElement>('md-gb-snackbar') ??
      null
    );
  }

  override connectedCallback() {
    super.connectedCallback();
    this.slottedSnackbar = this.findSlottedSnackbar();
  }

  private findSlottedSnackbar(): SnackbarElement | null {
    return (
      Array.from(this.children).find(
        (el): el is SnackbarElement => el instanceof SnackbarElement,
      ) ?? null
    );
  }

  /** The built-in snackbar's anchor: `anchorElement`, or `anchor` by id. */
  private resolveAnchor(): HTMLElement | null {
    if (this.anchorElement) {
      return this.anchorElement;
    }
    if (!this.anchor) {
      return null;
    }
    const root = this.getRootNode() as Document | ShadowRoot;
    const el =
      typeof root.getElementById === 'function'
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
  showSnackbar(options: string | ShowSnackbarOptions): Promise<SnackbarResult> {
    const opts = typeof options === 'string' ? {message: options} : options;
    const actionLabel = opts.actionLabel ?? '';
    const visuals: Required<SnackbarVisuals> = {
      message: opts.message,
      actionLabel,
      withDismissAction: opts.withDismissAction ?? false,
      duration: opts.duration ?? (actionLabel ? 'indefinite' : 'short'),
    };
    return new Promise<SnackbarResult>((resolve) => {
      const entry: QueueEntry = {
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
      } else {
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

  override disconnectedCallback() {
    super.disconnectedCallback();
    // A removed host can't show its queue.
    this.dismissAll();
  }

  private closeEntry(entry: QueueEntry, reason: string) {
    if (entry === this.current) {
      this.currentSnackbar?.close(reason);
      return;
    }
    const index = this.queue.indexOf(entry);
    if (index >= 0) {
      this.queue.splice(index, 1);
      this.settle(
        entry,
        reason === CLOSE_REASONS.ACTION
          ? SNACKBAR_RESULTS.ACTION_PERFORMED
          : SNACKBAR_RESULTS.DISMISSED,
      );
    }
  }

  private settle(entry: QueueEntry, result: SnackbarResult) {
    if (entry.settled) {
      return;
    }
    entry.settled = true;
    entry.resolve(result);
  }

  /** Shows the next queued snackbar when none is showing. */
  private async showNext() {
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
    const {visuals} = entry.data;
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

    const handleClosed = (event: Event) => {
      if (event.target !== snackbar) {
        return;
      }
      snackbar.removeEventListener('closed', handleClosed);
      const reason = (event as CustomEvent<{reason?: string}>).detail?.reason;
      this.finishCurrent(
        entry,
        reason === CLOSE_REASONS.ACTION
          ? SNACKBAR_RESULTS.ACTION_PERFORMED
          : SNACKBAR_RESULTS.DISMISSED,
      );
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

  private finishCurrent(entry: QueueEntry, result: SnackbarResult) {
    if (this.current === entry) {
      this.current = null;
      this.currentSnackbar = null;
    }
    this.settle(entry, result);
    this.showNext();
  }

  private readonly handleSlotChange = () => {
    this.slottedSnackbar = this.findSlottedSnackbar();
  };

  override render() {
    return html`
      <slot @slotchange=${this.handleSlotChange}></slot>
      ${this.slottedSnackbar
        ? nothing
        : html`<md-gb-snackbar
            part="snackbar"
            ?fixed=${this.fixed}
            ?quick=${this.quick}
            close-label=${this.closeLabel}></md-gb-snackbar>`}
    `;
  }
}
