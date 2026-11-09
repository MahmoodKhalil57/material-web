/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type CSSResultOrNative, LitElement } from 'lit';
import '../progress/md-gb-progress.js';
/**
 * Focused search: a search input with suggestions or results, opened from a
 * search bar.
 *
 * The view is a modal dialog. Full-screen (the default, for compact windows)
 * it fills the viewport; `docked` (for medium and larger windows) it drops
 * down from its `bar` over a scrim. The contained style is the M3 Expressive
 * default; `divided` uses the baseline style with a divider.
 *
 * Results are slotted elements with `role="option"`, or containers of them.
 * Slotted elements without a `role` get `role="option"`. The arrow keys move
 * focus from the input through the options.
 *
 * Predictive back (search.md): the modal dialog receives the platform's
 * close requests (its close watcher). The Android back gesture or button
 * shrinks a full-screen view (Compose `SearchBar`, to 90%) before it
 * collapses into its bar, and closes with reason `back`; Escape closes with
 * reason `escape`.
 *
 * @fires {Event} open - Fired when the view begins opening. Cancelable.
 * @fires {Event} opened - Fired when the view has opened and animations finished.
 * @fires {CustomEvent<{reason: string}>} close - Fired when the view begins closing. Cancelable. See `SEARCH_CLOSE_REASONS`.
 * @fires {CustomEvent<{reason: string}>} closed - Fired when the view has closed.
 * @fires {InputEvent} input - Fired when the input text changes.
 * @fires {Event} change - Fired when the input text is committed.
 * @fires {CustomEvent<{value: string}>} search - Fired when a search is executed with Enter.
 * @slot - Search suggestions or results.
 * @slot leading - Replaces the back icon button.
 * @slot trailing - Trailing icons or icon buttons, after the clear button.
 * @csspart dialog - The modal `<dialog>`.
 * @csspart container - The view's container.
 * @csspart header - The header with the input.
 * @csspart input - The search input.
 * @csspart divider - The divider of the divided style.
 * @csspart results - The `role="listbox"` results container.
 * @cssprop --container-color - Container color.
 * @cssprop --container-shape - Container shape.
 * @cssprop --contained-background-color - Contained full-screen background color.
 * @cssprop --contained-leading-margin - Contained full-screen bar leading margin.
 * @cssprop --contained-trailing-margin - Contained full-screen bar trailing margin.
 * @cssprop --contained-icon-label-gap - Space between the icon targets and the input.
 * @cssprop --contained-motion-spring - Contained expand and collapse easing.
 * @cssprop --contained-motion-duration - Contained expand and collapse duration.
 * @cssprop --divided-expand-motion-spring - Divided expand easing.
 * @cssprop --divided-expand-motion-duration - Divided expand duration.
 * @cssprop --divided-collapse-motion-spring - Divided collapse easing.
 * @cssprop --divided-collapse-motion-duration - Divided collapse duration.
 * @cssprop --content-fade-in-duration - Results fade in duration.
 * @cssprop --content-fade-in-delay - Results fade in delay.
 * @cssprop --content-fade-in-easing - Results fade in easing.
 * @cssprop --content-fade-out-duration - Results fade out duration.
 * @cssprop --content-fade-out-easing - Results fade out easing.
 * @cssprop --divider-color - Divided style divider color.
 * @cssprop --header-container-height - Header height.
 * @cssprop --header-input-text - Input typography.
 * @cssprop --header-input-text-axes - Input font variation settings.
 * @cssprop --header-input-text-color - Input text color.
 * @cssprop --header-input-text-tracking - Input letter spacing.
 * @cssprop --header-leading-icon-color - Back icon color.
 * @cssprop --header-supporting-text - Placeholder typography.
 * @cssprop --header-supporting-text-axes - Placeholder font variation settings.
 * @cssprop --header-supporting-text-color - Placeholder color.
 * @cssprop --header-supporting-text-tracking - Placeholder letter spacing.
 * @cssprop --header-trailing-icon-color - Trailing icon color.
 * @cssprop --icon-size - Icon size.
 * @cssprop --icon-target-size - Icon tap target size.
 * @cssprop --leading-space - Space before the leading icon.
 * @cssprop --trailing-space - Space after the trailing icon.
 * @cssprop --bar-container-height - Contained full-screen bar height.
 * @cssprop --bar-shape - Contained bar shape.
 * @cssprop --bar-results-gap - Contained docked gap between the bar and results.
 * @cssprop --results-shape - Contained docked results shape.
 * @cssprop --min-width - Docked minimum width.
 * @cssprop --max-width - Docked maximum width.
 * @cssprop --min-height - Docked minimum height.
 * @cssprop --max-height - Docked maximum height.
 * @cssprop --scrim-color - Docked scrim color.
 */
export declare class SearchViewElement extends LitElement {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /**
     * Whether the view is open.
     */
    get open(): boolean;
    set open(value: boolean);
    /**
     * Docked layout: a drop-down below the search bar over a scrim. Otherwise
     * the view is full-screen.
     */
    docked: boolean;
    /**
     * Divided (baseline) style, with a divider between the header and results.
     * Otherwise the view uses the contained M3 Expressive style.
     */
    divided: boolean;
    /** The search text. */
    value: string;
    /** Hinted search text. */
    placeholder: string;
    /**
     * Accessible label of the input and dialog. Defaults to `placeholder`.
     */
    label: string;
    /** Accessible label of the back button. */
    backLabel: string;
    /** Accessible label of the clear button. */
    clearLabel: string;
    /** Accessible label of the results listbox. */
    resultsLabel: string;
    /** Announced when suggestions or results become available. */
    suggestionsLabel: string;
    /**
     * Whether the app is searching: shows a progress indicator under the header
     * and marks the results busy for assistive technology.
     */
    searching: boolean;
    /** Accessible label of the searching progress indicator. */
    searchingLabel: string;
    /** Whether to skip the open and close animations. */
    quick: boolean;
    /**
     * The search bar the view expands from. Docked, the view is positioned
     * over it.
     */
    bar: HTMLElement | null;
    private announcement;
    private readonly dialog;
    private readonly container;
    private readonly header;
    private readonly input;
    private readonly results;
    private animations;
    private optionCount;
    private trackingAbort;
    private backMotion;
    /**
     * The view is a modal `<dialog>`: Escape, back and scrim close requests,
     * a focus trap, initial focus on the input, focus restore and page scroll
     * lock.
     */
    private readonly modalSurface;
    private get isOpening();
    private get isClosing();
    disconnectedCallback(): void;
    /** Focuses the search input. */
    focus(options?: FocusOptions): void;
    /** Clears the search text and focuses the input. */
    clear(): void;
    /**
     * Opens the view.
     */
    show(): Promise<void>;
    /**
     * Handles a back request (the Android back gesture or button, which the
     * view receives through its dialog): a full-screen view plays the
     * predictive back motion, then the view closes with reason `back`. Call it
     * for an in-app back control that should behave like the system back.
     */
    handleBack(): Promise<void>;
    /**
     * Closes the view.
     *
     * @param reason The reason for closing, passed in the `close` and `closed`
     *     event details (see `SEARCH_CLOSE_REASONS`).
     */
    close(reason?: string): Promise<void>;
    /**
     * Positions a docked view over its search bar.
     */
    private updatePosition;
    private startTracking;
    private stopTracking;
    private cancelAnimations;
    private shouldAnimate;
    /**
     * Expands the container from the search bar (or from its header when there
     * is no bar) and fades the results in, or the reverse.
     *
     * Contained: the `contained.motion.spring` both ways. Divided: Compose's
     * slow spatial spring to expand and default spatial spring to collapse.
     * Results fade like Compose's contained content fade specs.
     */
    private animateView;
    private updateAnnouncement;
    private readonly handleSlotChange;
    private readonly handleInput;
    private readonly handleChange;
    private readonly handleKeyDown;
    render(): import("lit-html").TemplateResult<1>;
}
