/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../components/button/md-gb-button.js';
import '../../components/iconbutton/md-gb-icon-button.js';
import '../../components/tabs/md-gb-tab.js';
import '../../components/tabs/md-gb-tabs.js';
import '../../styles/icons/md-gb-icon.js';

import {css, html, LitElement, nothing, type CSSResultOrNative} from 'lit';
import {property, state} from 'lit/decorators.js';

import type {DemoCodeElement} from './demo-code-element.js';

/** Code longer than this many lines starts collapsed. */
const SHORT_LINES = 4;

/** The message an iframe preview posts to size its frame. */
export const DEMO_HEIGHT_MESSAGE = 'md-gb-demo-height';

/**
 * An example and its code, as documentation shows them: the live example
 * (the default slot), then its code files (`md-gb-demo-code` in the `code`
 * slot) with a tab per file, a copy button, and Show code / Hide code for
 * code longer than four lines.
 *
 * An iframe in the preview (an example with its own document) is sized to
 * the height it posts: `parent.postMessage({type: 'md-gb-demo-height',
 * height}, '*')` from the frame.
 *
 * @slot - The example: elements, or an iframe.
 * @slot code - The code: one `md-gb-demo-code` per file.
 * @csspart preview - The example's container.
 * @csspart code - The code's container.
 * @fires {CustomEvent<{code: string}>} copy - Fired when the code is copied. --bubbles --composed
 */
export class DemoElement extends LitElement {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    css`
      :host {
        display: block;
        margin-block: var(--md-sys-space-300, 24px);
        border: 1px solid var(--md-sys-color-outline-variant);
        border-radius: var(--md-sys-shape-corner-lg, 16px);
        overflow: clip;
        background: var(--md-sys-color-surface-container-low);
      }
      :host([hidden]) {
        display: none;
      }
      .preview {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: var(--md-sys-space-200, 16px);
        padding: var(--md-sys-space-300, 24px);
        background: var(--md-sys-color-surface-container-lowest);
        color: var(--md-sys-color-on-surface);
      }
      ::slotted(iframe) {
        display: block;
        inline-size: 100%;
        border: 0;
      }
      .code {
        border-block-start: 1px solid var(--md-sys-color-outline-variant);
        background: var(--md-sys-color-surface-container);
      }
      .code[hidden] {
        display: none;
      }
      .bar {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: var(--md-sys-space-50, 4px);
        padding-inline: var(--md-sys-space-100, 8px);
      }
      md-gb-tabs {
        flex: 1;
        background: none;
      }
      .status {
        position: absolute;
        inline-size: 1px;
        block-size: 1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
      }
    `,
  ];

  /** The accessible name of the demo (what it shows). */
  @property() label = '';

  /** The block size the preview reserves (px), so the page doesn't move as it loads. */
  @property({type: Number, attribute: 'preview-height'}) previewHeight = 0;

  /** Whether long code shows in full. */
  @property({type: Boolean, reflect: true}) expanded = false;

  @state() private files: DemoCodeElement[] = [];
  @state() private selected = 0;
  @state() private copied = false;

  private readonly onMessage = (event: MessageEvent) => {
    if (event.data?.type !== DEMO_HEIGHT_MESSAGE) return;
    for (const frame of this.querySelectorAll('iframe')) {
      if (frame.contentWindow === event.source && typeof event.data.height === 'number') {
        frame.style.blockSize = `${Math.ceil(event.data.height)}px`;
      }
    }
  };

  override connectedCallback() {
    super.connectedCallback();
    addEventListener('message', this.onMessage);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    removeEventListener('message', this.onMessage);
  }

  private get current(): DemoCodeElement | undefined {
    return this.files[this.selected];
  }

  private get long(): boolean {
    return this.files.some((f) => f.lines > SHORT_LINES);
  }

  private onCodeSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    this.files = slot
      .assignedElements()
      .filter((el): el is DemoCodeElement => el.localName === 'md-gb-demo-code');
    this.selected = Math.min(this.selected, Math.max(0, this.files.length - 1));
  }

  protected override updated() {
    // Only the selected file shows; long code collapses until expanded.
    this.files.forEach((file, i) => {
      file.hidden = i !== this.selected;
      file.collapsed = this.long && !this.expanded;
    });
  }

  private async copy() {
    const code = this.current?.code ?? '';
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      return;
    }
    this.copied = true;
    this.dispatchEvent(new CustomEvent('copy', {detail: {code}, bubbles: true, composed: true}));
    setTimeout(() => (this.copied = false), 2000);
  }

  protected override render() {
    const label = this.label || 'Example';
    const tabs =
      this.files.length > 1
        ? html`<md-gb-tabs
            variant="secondary"
            aria-label="${label} files"
            @change=${(e: Event) => {
              this.selected = (e.target as HTMLElement & {selectedTabIndex: number}).selectedTabIndex ?? 0;
            }}>
            ${this.files.map(
              (f, i) =>
                html`<md-gb-tab ?selected=${i === this.selected}
                  ><span slot="label">${f.label || f.language.toUpperCase()}</span></md-gb-tab
                >`,
            )}
          </md-gb-tabs>`
        : nothing;
    return html`
      <figure role="figure" aria-label=${label} style="margin: 0">
        <div class="preview" part="preview" style=${this.previewHeight ? `min-block-size: ${this.previewHeight}px` : ''}>
          <slot></slot>
        </div>
        <div class="code" part="code" ?hidden=${!this.files.length}>
          <slot name="code" @slotchange=${this.onCodeSlotChange}></slot>
          <div class="bar">
            ${tabs}
            ${this.long
              ? html`<md-gb-button color="text" @click=${() => (this.expanded = !this.expanded)}
                  >${this.expanded ? 'Hide code' : 'Show code'}</md-gb-button
                >`
              : nothing}
            <md-gb-icon-button tooltip aria-label="Copy code" @click=${this.copy}
              ><md-gb-icon>${this.copied ? 'check' : 'content_copy'}</md-gb-icon></md-gb-icon-button
            >
          </div>
          <div class="status" role="status">${this.copied ? 'Code copied' : ''}</div>
        </div>
      </figure>
    `;
  }
}
