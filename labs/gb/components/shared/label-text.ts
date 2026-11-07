/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ReactiveController, type ReactiveControllerHost} from 'lit';

/** The text of one node, leaving out `skip` (the labeled control itself). */
function textOf(node: Node, skip: Node): string {
  if (node === skip) return '';
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? '';
  if (node.nodeType !== Node.ELEMENT_NODE) return '';
  if ((node as Element).hasAttribute('hidden')) return '';
  return [...node.childNodes].map((child) => textOf(child, skip)).join('');
}

/**
 * The text of the `<label>` elements that name a form-associated control,
 * without the control itself, whitespace collapsed.
 */
export function labelText(control: HTMLElement & {labels?: NodeList}): string {
  return [...(control.labels ?? [])]
    .map((label) => textOf(label, control))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Gives a control whose focusable element lives in its shadow root the text
 * of its adjacent `<label>` as the accessibility label (a label cannot name
 * an element inside a shadow root). Read it in `render()` as
 * `this.labelFromText.text`.
 *
 * It refreshes when the control connects, first renders or receives focus,
 * the moments a label is parsed or a screen reader reads the name.
 */
export class LabelTextController implements ReactiveController {
  text = '';

  constructor(
    private readonly host: ReactiveControllerHost &
      HTMLElement & {labels?: NodeList},
  ) {
    host.addController(this);
  }

  hostConnected() {
    this.host.addEventListener('focusin', this.refresh);
    this.refresh();
  }

  hostDisconnected() {
    this.host.removeEventListener('focusin', this.refresh);
  }

  hostUpdated() {
    // The first render can precede the label being parsed.
    if (!this.text) this.refresh();
  }

  private readonly refresh = () => {
    const text = labelText(this.host);
    if (text !== this.text) {
      this.text = text;
      this.host.requestUpdate();
    }
  };
}
