/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, type CSSResultOrNative, html, LitElement, nothing} from 'lit';
import {property, query, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {live} from 'lit/directives/live.js';
import {iconButton} from '../iconbutton/icon-button.js';
import {
  BACK_REASON,
  closeRequestSource,
  playPredictiveBack,
  type PredictiveBackAnimation,
} from '../sheet/predictive-back.js';
import {
  getResultOptions,
  moveResultFocus,
  SEARCH_CLOSE_REASONS,
  SEARCH_VIEW_CLASSES,
  searchViewClasses,
} from './search.js';

import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '../focus/focus-ring.cssresult.js'; // google3-only
import iconButtonStyles from '../iconbutton/icon-button.css' with {type: 'css'}; // github-only
// import iconButtonStyles from '../iconbutton/icon-button.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css' with {type: 'css'}; // github-only
// import rippleStyles from '../ripple/ripple.cssresult.js'; // google3-only
import searchViewStyles from './search-view.css' with {type: 'css'}; // github-only
// import searchViewStyles from './search-view.cssresult.js'; // google3-only

/** Fallbacks when the `md.sys.motion` tokens are not loaded. */
const FALLBACK_EASING = 'cubic-bezier(0.2, 0, 0, 1)';
const FALLBACK_DURATION_MS = 350;

const BACK_ICON = html`<svg viewBox="0 0 24 24" aria-hidden="true">
  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
</svg>`;

const CLEAR_ICON = html`<svg viewBox="0 0 24 24" aria-hidden="true">
  <path
    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
</svg>`;

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
export class SearchViewElement extends LitElement {
  // Layer order is pinned by the `@layer` statement at the top of
  // search-view.scss.
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    iconButtonStyles,
    searchViewStyles,
    css`
      :host([hidden]) {
        display: none;
      }
    `,
  ];

  private isOpenInternal = false;

  /**
   * Whether the view is open.
   */
  @property({type: Boolean, reflect: true})
  get open(): boolean {
    return this.isOpenInternal;
  }
  set open(value: boolean) {
    if (value === this.isOpenInternal) {
      return;
    }
    if (value) {
      this.show();
    } else {
      this.close(SEARCH_CLOSE_REASONS.DISMISS);
    }
  }

  /**
   * Docked layout: a drop-down below the search bar over a scrim. Otherwise
   * the view is full-screen.
   */
  @property({type: Boolean, reflect: true}) docked = false;

  /**
   * Divided (baseline) style, with a divider between the header and results.
   * Otherwise the view uses the contained M3 Expressive style.
   */
  @property({type: Boolean, reflect: true}) divided = false;

  /** The search text. */
  @property() value = '';

  /** Hinted search text. */
  @property() placeholder = '';

  /**
   * Accessible label of the input and dialog. Defaults to `placeholder`.
   */
  @property() label = '';

  /** Accessible label of the back button. */
  @property({attribute: 'back-label'}) backLabel = 'Back';

  /** Accessible label of the clear button. */
  @property({attribute: 'clear-label'}) clearLabel = 'Clear search';

  /** Accessible label of the results listbox. */
  @property({attribute: 'results-label'}) resultsLabel = 'Search results';

  /** Announced when suggestions or results become available. */
  @property({attribute: 'suggestions-label'})
  suggestionsLabel = 'Suggestions available';

  /** Whether to skip the open and close animations. */
  @property({type: Boolean, reflect: true}) quick = false;

  /**
   * The search bar the view expands from. Docked, the view is positioned
   * over it.
   */
  @property({attribute: false}) bar: HTMLElement | null = null;

  @state() private isOpening = false;
  @state() private isClosing = false;
  @state() private announcement = '';

  @query('dialog') private readonly dialog!: HTMLDialogElement | null;
  @query('.search-view-container')
  private readonly container!: HTMLElement | null;
  @query('.search-view-header') private readonly header!: HTMLElement | null;
  @query('.search-view-input') private readonly input!: HTMLInputElement | null;
  @query('.search-view-results') private readonly results!: HTMLElement | null;

  private transitionCounter = 0;
  private animations: Animation[] = [];
  private optionCount = 0;
  private trackingAbort: AbortController | null = null;
  private backMotion: PredictiveBackAnimation | null = null;

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.stopTracking();
    this.cancelAnimations();
    if (this.isOpenInternal || this.isClosing) {
      this.transitionCounter++;
      this.dialog?.close();
      this.isOpenInternal = false;
      this.isOpening = false;
      this.isClosing = false;
      this.requestUpdate('open', true);
    }
  }

  /** Focuses the search input. */
  override focus(options?: FocusOptions) {
    this.input?.focus(options);
  }

  /** Clears the search text and focuses the input. */
  clear() {
    if (!this.value) return;
    this.value = '';
    if (this.input) this.input.value = '';
    this.dispatchEvent(
      new InputEvent('input', {
        bubbles: true,
        composed: true,
        inputType: 'deleteContent',
      }),
    );
    this.focus();
  }

  /**
   * Opens the view.
   */
  async show(): Promise<void> {
    if (this.isOpenInternal && !this.isClosing) {
      return;
    }

    const preventOpen = !this.dispatchEvent(
      new Event('open', {bubbles: true, cancelable: true}),
    );
    if (preventOpen) {
      return;
    }

    const token = ++this.transitionCounter;
    const prev = this.isOpenInternal;
    this.isOpenInternal = true;
    this.requestUpdate('open', prev);
    this.isClosing = false;
    this.isOpening = true;
    await this.updateComplete;
    const dialog = this.dialog;
    if (token !== this.transitionCounter || !dialog || !this.isConnected) {
      return;
    }

    this.updatePosition();
    if (!dialog.open) {
      dialog.showModal();
    }
    this.focusInputEnd();
    this.startTracking();
    this.updateAnnouncement();

    await this.animateView(true);
    if (token !== this.transitionCounter) {
      return;
    }

    this.isOpening = false;
    this.dispatchEvent(new Event('opened', {bubbles: true}));
  }

  /**
   * Handles a back request (the Android back gesture or button, which the
   * view receives through its dialog): a full-screen view plays the
   * predictive back motion, then the view closes with reason `back`. Call it
   * for an in-app back control that should behave like the system back.
   */
  async handleBack(): Promise<void> {
    if (!this.isOpenInternal || this.isClosing) {
      return;
    }
    // Compose's DockedSearchBar has no predictive back motion.
    const container = this.container;
    const motion =
      this.shouldAnimate() && !this.docked && container
        ? playPredictiveBack(container, {kind: 'search'})
        : null;
    await motion?.finished;
    if (!this.isOpenInternal) {
      motion?.cancel();
      return;
    }
    this.backMotion = motion;
    const closing = this.close(BACK_REASON);
    // Scale back up while the view collapses into its bar; `animateView`
    // measures the boxes at rest.
    const settling = motion?.settle();
    await closing;
    await settling;
    if (this.backMotion === motion) {
      this.backMotion = null;
    }
  }

  /**
   * Closes the view.
   *
   * @param reason The reason for closing, passed in the `close` and `closed`
   *     event details (see `SEARCH_CLOSE_REASONS`).
   */
  async close(reason: string = SEARCH_CLOSE_REASONS.DISMISS): Promise<void> {
    if (!this.isOpenInternal && !this.isOpening) {
      return;
    }

    const preventClose = !this.dispatchEvent(
      new CustomEvent('close', {
        bubbles: true,
        cancelable: true,
        detail: {reason},
      }),
    );
    if (preventClose) {
      return;
    }

    const token = ++this.transitionCounter;
    const prev = this.isOpenInternal;
    this.isOpenInternal = false;
    this.requestUpdate('open', prev);
    this.isOpening = false;
    this.isClosing = true;
    this.announcement = '';
    await this.updateComplete;
    if (token !== this.transitionCounter) {
      return;
    }

    await this.animateView(false);
    if (token !== this.transitionCounter) {
      return;
    }

    this.stopTracking();
    this.dialog?.close();
    this.cancelAnimations();
    this.isClosing = false;
    this.dispatchEvent(
      new CustomEvent('closed', {bubbles: true, detail: {reason}}),
    );
  }

  private focusInputEnd() {
    const input = this.input;
    if (!input) return;
    input.focus();
    const end = input.value.length;
    input.setSelectionRange(end, end);
  }

  /**
   * Positions a docked view over its search bar.
   */
  private updatePosition() {
    const dialog = this.dialog;
    if (!dialog) return;
    const bar = this.bar;
    if (!bar || !this.docked) {
      dialog.style.removeProperty('--_anchor-top');
      dialog.style.removeProperty('--_anchor-start');
      dialog.style.removeProperty('--_anchor-width');
      return;
    }
    const rect = bar.getBoundingClientRect();
    const rtl = getComputedStyle(bar).direction === 'rtl';
    const start = rtl ? window.innerWidth - rect.right : rect.left;
    dialog.style.setProperty('--_anchor-top', `${rect.top}px`);
    dialog.style.setProperty('--_anchor-start', `${start}px`);
    dialog.style.setProperty('--_anchor-width', `${rect.width}px`);
  }

  private startTracking() {
    this.stopTracking();
    if (!this.docked || !this.bar) return;
    this.trackingAbort = new AbortController();
    const opts = {signal: this.trackingAbort.signal, passive: true};
    const update = () => {
      this.updatePosition();
    };
    window.addEventListener('resize', update, opts);
    window.addEventListener('scroll', update, {...opts, capture: true});
  }

  private stopTracking() {
    this.trackingAbort?.abort();
    this.trackingAbort = null;
  }

  private cancelAnimations() {
    for (const animation of this.animations) {
      animation.cancel();
    }
    this.animations = [];
  }

  private shouldAnimate() {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    return !this.quick && !prefersReducedMotion;
  }

  /**
   * Expands the container from the search bar (or from its header when there
   * is no bar) and fades the results in, or the reverse.
   *
   * Contained: the `contained.motion.spring` both ways. Divided: Compose's
   * slow spatial spring to expand and default spatial spring to collapse.
   * Results fade like Compose's contained content fade specs.
   */
  private async animateView(opening: boolean) {
    this.cancelAnimations();
    const {dialog, container, header, results} = this;
    if (!this.shouldAnimate() || !dialog || !container || !header || !results) {
      return;
    }

    const style = getComputedStyle(dialog);
    const read = (prop: string) => style.getPropertyValue(prop).trim();
    const motion = this.divided
      ? opening
        ? 'divided-expand-motion'
        : 'divided-collapse-motion'
      : 'contained-motion';
    const easing = read(`--${motion}-spring`) || FALLBACK_EASING;
    const duration = parseMs(
      read(`--${motion}-duration`),
      FALLBACK_DURATION_MS,
    );

    // Measure at rest: a back request may have scaled the container.
    const measure = () => ({
      box: container.getBoundingClientRect(),
      headerBox: header.getBoundingClientRect(),
      bar: this.docked ? null : this.bar?.getBoundingClientRect(),
    });
    const {box, headerBox, bar} = this.backMotion
      ? this.backMotion.atRest(measure)
      : measure();
    let collapsed: string;
    let headerShift = 0;
    if (bar && bar.width && bar.height) {
      // Full-screen from a search bar: start at the bar's bounds, with the
      // header over the bar.
      const radius = bar.height / 2;
      collapsed = `inset(${bar.top - box.top}px ${box.right - bar.right}px ${
        box.bottom - bar.bottom
      }px ${bar.left - box.left}px round ${radius}px)`;
      headerShift =
        bar.top + bar.height / 2 - (headerBox.top + headerBox.height / 2);
    } else {
      // Docked, or no bar: grow down from the header.
      const radius = headerBox.height / 2;
      collapsed = `inset(0px 0px ${box.bottom - headerBox.bottom}px 0px round ${radius}px)`;
    }
    const expanded = 'inset(0px 0px 0px 0px round 0px)';
    const order = <T>(frames: T[]) => (opening ? frames : frames.reverse());
    const spatial: KeyframeAnimationOptions = {duration, easing, fill: 'both'};

    const animations = [
      container.animate(
        order([{clipPath: collapsed}, {clipPath: expanded}]),
        spatial,
      ),
      results.animate(
        order([{opacity: 0}, {opacity: 1}]),
        opening
          ? {
              duration: parseMs(read('--content-fade-in-duration'), 100),
              delay: parseMs(read('--content-fade-in-delay'), 50),
              easing: read('--content-fade-in-easing') || 'linear',
              fill: 'both',
            }
          : {
              duration: parseMs(read('--content-fade-out-duration'), 100),
              easing: read('--content-fade-out-easing') || 'linear',
              fill: 'both',
            },
      ),
    ];
    if (headerShift) {
      animations.push(
        header.animate(
          order([
            {transform: `translateY(${headerShift}px)`},
            {transform: 'none'},
          ]),
          spatial,
        ),
      );
    }
    if (this.docked) {
      animations.push(
        dialog.animate(
          order([
            {backgroundColor: 'transparent'},
            {backgroundColor: style.backgroundColor},
          ]),
          {duration, easing: 'linear', fill: 'both'},
        ),
      );
    }
    this.animations = animations;
    await Promise.all(
      animations.map((animation) => animation.finished.catch(() => {})),
    );
  }

  private updateAnnouncement() {
    this.announcement =
      this.isOpenInternal && this.optionCount > 0 ? this.suggestionsLabel : '';
  }

  private readonly handleSlotChange = (event: Event) => {
    const slot = event.target as HTMLSlotElement;
    for (const el of slot.assignedElements({flatten: true})) {
      if (
        el instanceof HTMLElement &&
        !el.hasAttribute('role') &&
        !el.querySelector('[role="option"]')
      ) {
        el.setAttribute('role', 'option');
      }
    }
    const results = this.results;
    const count = results ? getResultOptions(results).length : 0;
    const had = this.optionCount > 0;
    this.optionCount = count;
    if (!had || !count) {
      this.updateAnnouncement();
    }
  };

  private readonly handleInput = (event: Event) => {
    this.value = (event.target as HTMLInputElement).value;
  };

  private readonly handleChange = () => {
    this.dispatchEvent(new Event('change', {bubbles: true}));
  };

  private readonly handleKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close(SEARCH_CLOSE_REASONS.ESCAPE);
      return;
    }
    const input = this.input;
    const results = this.results;
    if (!input || !results) return;
    const path = event.composedPath();
    if (event.key === 'Enter' && path[0] === input) {
      if (event.isComposing) return;
      event.preventDefault();
      this.dispatchEvent(
        new CustomEvent('search', {
          bubbles: true,
          detail: {value: this.value},
        }),
      );
      return;
    }
    const options = getResultOptions(results);
    if (moveResultFocus(event, input, options)) return;
    // Enter on a non-native option activates it.
    const target = path[0];
    if (
      event.key === 'Enter' &&
      target instanceof HTMLElement &&
      options.includes(target) &&
      !target.matches('button, a[href], input, select, textarea')
    ) {
      event.preventDefault();
      target.click();
    }
  };

  private readonly handleCancel = (event: Event) => {
    // Escape and the platform back gesture animate closed.
    event.preventDefault();
    if (closeRequestSource(event) === BACK_REASON) {
      this.handleBack();
    } else {
      this.close(SEARCH_CLOSE_REASONS.ESCAPE);
    }
  };

  private readonly handleDialogClose = () => {
    // Closed by the platform (e.g. a `method="dialog"` form) without close().
    if (this.isOpenInternal) {
      this.transitionCounter++;
      this.stopTracking();
      this.cancelAnimations();
      this.isOpenInternal = false;
      this.isOpening = false;
      this.isClosing = false;
      this.requestUpdate('open', true);
      this.dispatchEvent(
        new CustomEvent('closed', {
          bubbles: true,
          detail: {reason: SEARCH_CLOSE_REASONS.DISMISS},
        }),
      );
    }
  };

  private readonly handleDialogClick = (event: MouseEvent) => {
    // A click on the docked scrim, outside the container.
    if (event.target === this.dialog) {
      this.close(SEARCH_CLOSE_REASONS.SCRIM);
    }
  };

  override render() {
    const open = this.isOpenInternal || this.isClosing;
    const classes = searchViewClasses({
      tokens: false,
      open: this.isOpenInternal,
      opening: this.isOpening,
      closing: this.isClosing,
      docked: this.docked,
      divided: this.divided,
      anchored: this.docked && !!this.bar,
    });
    const label = this.label || this.placeholder || nothing;

    return html`
      <dialog
        class="${classMap(classes)}"
        part="dialog"
        aria-label=${label}
        @cancel=${this.handleCancel}
        @close=${this.handleDialogClose}
        @click=${this.handleDialogClick}
        @keydown=${this.handleKeyDown}>
        <div class="${SEARCH_VIEW_CLASSES.container}" part="container">
          <div class="${SEARCH_VIEW_CLASSES.header}" part="header">
            <slot name="leading">
              <button
                type="button"
                class="${iconButton({
                  color: 'standard',
                  size: 'sm',
                  classes: {
                    'search-view-icon-btn': true,
                    'search-view-back': true,
                  },
                })}"
                aria-label=${this.backLabel}
                @click=${() => this.close(SEARCH_CLOSE_REASONS.BACK_BUTTON)}>
                ${BACK_ICON}
              </button>
            </slot>
            <input
              id="input"
              class="${SEARCH_VIEW_CLASSES.input}"
              part="input"
              type="text"
              role="combobox"
              autocomplete="off"
              enterkeyhint="search"
              spellcheck="false"
              aria-autocomplete="list"
              aria-expanded=${open ? 'true' : 'false'}
              aria-controls="results"
              aria-label=${label}
              placeholder=${this.placeholder || nothing}
              .value=${live(this.value)}
              @input=${this.handleInput}
              @change=${this.handleChange} />
            <div class="search-view-trailing">
              ${this.value
                ? html`<button
                    type="button"
                    class="${iconButton({
                      color: 'standard',
                      size: 'sm',
                      classes: {
                        'search-view-icon-btn': true,
                        'search-view-clear': true,
                      },
                    })}"
                    aria-label=${this.clearLabel}
                    @click=${() => {
                      this.clear();
                    }}>
                    ${CLEAR_ICON}
                  </button>`
                : nothing}
              <slot name="trailing"></slot>
            </div>
          </div>
          <div
            class="${SEARCH_VIEW_CLASSES.divider}"
            part="divider"
            aria-hidden="true"></div>
          <div
            id="results"
            class="${SEARCH_VIEW_CLASSES.results}"
            part="results"
            role="listbox"
            aria-label=${this.resultsLabel}>
            <slot @slotchange=${this.handleSlotChange}></slot>
          </div>
        </div>
        <div class="search-view-status" role="status" aria-live="polite">
          ${this.announcement}
        </div>
      </dialog>
    `;
  }
}

function parseMs(value: string, fallback: number): number {
  const match = value.match(/^(-?[\d.]+)(ms|s)?$/);
  if (!match) return fallback;
  const n = Number(match[1]);
  return match[2] === 's' ? n * 1000 : n;
}
