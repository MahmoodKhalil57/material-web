/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ReactiveController, type ReactiveControllerHost } from 'lit';
/**
 * The text of the `<label>` elements that name a form-associated control,
 * without the control itself, whitespace collapsed.
 */
export declare function labelText(control: HTMLElement & {
    labels?: NodeList;
}): string;
/**
 * Gives a control whose focusable element lives in its shadow root the text
 * of its adjacent `<label>` as the accessibility label (a label cannot name
 * an element inside a shadow root). Read it in `render()` as
 * `this.labelFromText.text`.
 *
 * It refreshes when the control connects, first renders or receives focus,
 * the moments a label is parsed or a screen reader reads the name.
 */
export declare class LabelTextController implements ReactiveController {
    private readonly host;
    text: string;
    constructor(host: ReactiveControllerHost & HTMLElement & {
        labels?: NodeList;
    });
    hostConnected(): void;
    hostDisconnected(): void;
    hostUpdated(): void;
    private readonly refresh;
}
