/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type CSSResultOrNative, LitElement } from 'lit';
import { type SearchViewElement } from './search-view-element.js';
/**
 * A Material Design search bar: the entry point to focused search.
 *
 * Activating the bar (click, Enter, ArrowDown, or typing) opens its search
 * view, full-screen by default or `docked` below the bar. Slotted results
 * are shown in the view. The back button, Escape, or the scrim close it.
 *
 * The bar's input is a `role="combobox"` that controls the view, and the
 * view's input a combobox that controls its `role="listbox"` results.
 *
 * Style the view with `::part(view)`, e.g.
 * `md-gb-search-bar::part(view) { --container-color: ... }`.
 *
 * @fires {Event} open - Fired when the view begins opening. Cancelable.
 * @fires {Event} opened - Fired when the view has opened and animations finished.
 * @fires {CustomEvent<{reason: string}>} close - Fired when the view begins closing. Cancelable.
 * @fires {CustomEvent<{reason: string}>} closed - Fired when the view has closed.
 * @fires {InputEvent} input - Fired when the search text changes.
 * @fires {Event} change - Fired when the search text is committed.
 * @fires {CustomEvent<{value: string}>} search - Fired when a search is executed with Enter in the view.
 * @slot - Search suggestions or results, shown in the view. Use elements with `role="option"`; slotted elements without a role get it.
 * @slot leading - A navigation icon button. Defaults to a non-functional search icon.
 * @slot trailing - Up to two trailing icons or icon buttons.
 * @slot avatar - A trailing avatar image.
 * @slot view-trailing - Trailing icon buttons in the view's header.
 * @csspart bar - The search bar container.
 * @csspart input - The search bar input.
 * @csspart view - The `md-gb-search-view`.
 * @cssprop --avatar-shape - Avatar shape.
 * @cssprop --avatar-size - Avatar size.
 * @cssprop --contained-avatar-target-size - Avatar tap target size.
 * @cssprop --contained-icon-label-gap - Space between the icon targets and the input.
 * @cssprop --contained-leading-margin - Recommended margin to the start of the window.
 * @cssprop --contained-trailing-margin - Recommended margin to the end of the window.
 * @cssprop --contained-leading-space - Space before the leading icon target.
 * @cssprop --contained-motion-spring - Expand and collapse easing.
 * @cssprop --contained-motion-duration - Expand and collapse duration.
 * @cssprop --contained-no-actions-leading-space - Leading space without a leading icon.
 * @cssprop --contained-no-actions-trailing-space - Trailing space without trailing icons.
 * @cssprop --contained-trailing-actions-gap - Gap between trailing icon targets.
 * @cssprop --contained-trailing-actions-leading-space - Space before the trailing icon targets.
 * @cssprop --contained-trailing-actions-trailing-space - Space after the trailing icon targets.
 * @cssprop --contained-trailing-space - Trailing space.
 * @cssprop --container-color - Container color.
 * @cssprop --container-height - Container height.
 * @cssprop --container-shape - Container shape.
 * @cssprop --icon-size - Icon size.
 * @cssprop --icon-target-size - Icon tap target size.
 * @cssprop --input-text - Input typography.
 * @cssprop --input-text-axes - Input font variation settings.
 * @cssprop --input-text-color - Input text color.
 * @cssprop --input-text-tracking - Input letter spacing.
 * @cssprop --leading-icon-color - Leading icon color.
 * @cssprop --leading-icon-leading-icon-label-space - Divided style space between the leading icon and input.
 * @cssprop --leading-space - Divided style leading space.
 * @cssprop --max-width - Maximum width.
 * @cssprop --min-width - Minimum width.
 * @cssprop --supporting-text - Placeholder typography.
 * @cssprop --supporting-text-axes - Placeholder font variation settings.
 * @cssprop --supporting-text-color - Placeholder color.
 * @cssprop --supporting-text-tracking - Placeholder letter spacing.
 * @cssprop --trailing-icon-color - Trailing icon color.
 * @cssprop --trailing-icon-label-trailing-icon-space - Divided style space between the input and trailing icon.
 * @cssprop --trailing-space - Divided style trailing space.
 */
export declare class SearchBarElement extends LitElement {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /** The search text. Shared with the view. */
    value: string;
    /** Hinted search text, e.g. "Search messages". */
    placeholder: string;
    /**
     * Accessible label of the inputs. Defaults to `placeholder`, per the spec.
     */
    label: string;
    /** Whether the search bar is disabled. */
    disabled: boolean;
    /**
     * Opens the view docked below the bar, for medium and larger windows.
     * Otherwise it opens full-screen.
     */
    docked: boolean;
    /** Uses the divided (baseline) view style. */
    divided: boolean;
    /** Whether to skip the open and close animations. */
    quick: boolean;
    /** Accessible label of the view's back button. */
    backLabel: string;
    /** Accessible label of the view's clear button. */
    clearLabel: string;
    /** Accessible label of the results listbox. */
    resultsLabel: string;
    /** Whether the app is searching: shows progress in the view. */
    searching: boolean;
    /** Accessible label of the searching progress indicator. */
    searchingLabel: string;
    /** Announced when suggestions or results become available. */
    suggestionsLabel: string;
    private isExpandedInternal;
    /** Whether the search view is open. */
    get expanded(): boolean;
    set expanded(value: boolean);
    /** The search view. */
    readonly view: SearchViewElement | null;
    private readonly input;
    /** Focuses the search bar input. */
    focus(options?: FocusOptions): void;
    /** Opens the search view. */
    show(): Promise<void>;
    /**
     * Closes the search view.
     *
     * @param reason The reason for closing (see `SEARCH_CLOSE_REASONS`).
     */
    close(reason?: string): Promise<void>;
    private readonly handleBarClick;
    private readonly handleInputKeyDown;
    private readonly handleInput;
    private readonly handleViewInput;
    private readonly redispatch;
    render(): import("lit-html").TemplateResult<1>;
}
