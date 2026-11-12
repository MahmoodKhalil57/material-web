# M3 Expressive checklist

Everything listed on https://m3.material.io/components, /styles and
/foundations (downloaded to `.m3-specs/pages`), checked against the library.

- `[x]` done, `[ ]` missing, `[~]` partial or needs verifying.
- New components' token files are generated from the spec
  (`scripts/m3/bindings/*.mjs` with `generate: true`, written by
  `node scripts/m3/spec-tokens.mjs --write`, run by `npm run m3:update`).
- Per component: **Tokens** = spec tokens downloaded (`.m3-specs/tokens`),
  **Component** = `md-gb-*` element, **Spec test** = generated
  `*_spec_test.ts`, **Catalog** = page in `npm run catalog:dev`,
  **Token gaps** = spec tokens Compose uses that gb lacks
  (`node scripts/m3/audit-tokens.mjs --gaps`).
- Audit (2026-11-07, `node scripts/m3/audit-tokens.mjs --gaps`): 1949 declarations
  match the spec, 10 drift, 10 gaps. The gaps are the baseline app bar and list
  sets and the progress wave lengths (noted below). Each drift is deliberate,
  with its reason next to the value:
  - side sheet divider `outline-variant` (page text and its color figure, against the `outline` token)
  - navigation drawer and modal side sheet corners: logical radii so they flip in RTL (the tokens are physical)
  - outlined select and autocomplete: no container fill (the token set's fill is the filled variant's)
  - date picker selected menu item: `surface-container-highest` for the legacy `surface-variant` role
  - list items: transparent on the list's surface (segmented items use the token)
  - slider: the root track shape is the 16dp track's full rounding (sizes use the per-size tokens); the 2dp inner corner applies only to the trailing corners; the disabled stop indicator folds its 0.38 opacity token into the color

## Components

### Buttons

- [x] **Buttons** (`button`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Colors: elevated, filled, tonal, outlined, text
  - [x] Sizes: xs, sm, md, lg, xl
  - [x] Shapes: round, square
  - [x] Toggle (selected / unselected)
  - [x] Shape morph on press and selection
  - [x] Token file generated from the spec: toggle colors, square/pressed shapes, icon sizes
  - [x] 48dp touch target for xs/sm
- [x] **Button groups** (`buttongroup`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Standard, connected
  - [x] Sizes xs–xl
  - [x] Selection: none, single, multiple
  - [x] Token gaps: none
- [x] **Extended FAB** (`fab` with `label`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog (FAB page)
  - [x] Colors: primary, secondary, tertiary and their containers
  - [x] Sizes: small, medium, large (from the extended-fab token sets)
  - [x] `expanded` with Compose's springs; collapse on scroll (`scroll-target`)
- [x] **FAB menu** (`fabmenu`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Colors: primary, secondary, tertiary containers
  - [x] Close button
  - [x] Alignment
- [x] **FAB** (`fab`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Sizes: default, medium, large
  - [x] Six color sets
  - [x] Small FAB (`size="sm"`, no longer recommended by the spec)
  - [x] Token file generated from the spec; no gaps
- [x] **Icon buttons** (`iconbutton`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Colors: standard, filled, tonal, outlined
  - [x] Sizes xs–xl
  - [x] Widths: narrow, default, wide
  - [x] Shapes: round, square
  - [x] Toggle
  - [x] Token file generated from the spec; no gaps
- [x] **Segmented buttons** (`segmentedbutton`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Single-select, multi-select; 2–5 segments; label and/or icon
  - [x] Checkmark animation, density 0 to -3, disabled
  - Note: the Expressive spec points to connected button groups instead.
- [x] **Split button** (`splitbutton`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Colors
  - [x] Sizes xs–xl
  - [x] Menu trigger, selected state

### Date & time pickers

- [x] **Date pickers** (`datepicker`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Docked date picker
  - [x] Modal date picker (single date, date range)
  - [x] Modal date input
  - [x] Scrolling month list and full-screen layout for modal range selection
  - [x] Swipe between months; tooltips on controls; `required` validation
- [x] **Time pickers** (`timepicker`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Dial (vertical and horizontal layouts)
  - [x] Time input
  - [x] 12h / 24h, modal

### Loading & progress

- [x] **Loading indicator** (`loadingindicator`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Default, contained
  - [x] Shape morph sequence
- [x] **Progress indicators** (`progress`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Linear, circular
  - [x] Flat, wavy
  - [x] Determinate, indeterminate
  - [x] Token gaps: only the wave wavelength, which is baked into the generated wave paths

### Navigation

- [x] **Navigation bar** (`navbar`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Items with labels and badges
  - [x] Horizontal items (medium windows), `item-layout="auto"`
- [x] **Navigation drawer** (`navdrawer`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Standard, modal
  - [x] Headline, section labels, dividers, badges, link items
  - [x] Swipe to dismiss the modal drawer
  - Note: the Expressive spec suggests the expanded navigation rail for most cases.
  - [x] Group dividers are full-width (the divider is inset by `--divider-inset`, 16px, like the section labels) <!-- spec-gap: navigation-drawer-b6b096 -->
  - [x] Icons on all destinations or none (consumer content; mixed icon and text-only destinations are not flagged) <!-- spec-gap: navigation-drawer-0c57fa, navigation-drawer-91dcd7 -->
- [x] **Navigation rail** (`navrail`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Collapsed, expanded
  - [x] Modal (scrim, swipe to dismiss)
  - [x] Alignment, narrow
  - [x] Badges
  - [x] Header FAB becomes an extended FAB when expanded
  - [x] Predictive back (dialog `cancel` / `CloseWatcher`; close motion from Compose; no web gesture progress events)

### Sheets

- [x] **Bottom sheets** (`sheet`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Standard, modal
  - [x] Drag handle, swipe to dismiss, partially expanded and expanded
  - [x] Predictive back (dialog `cancel` / `CloseWatcher`; close motion from Compose; no web gesture progress events)
- [x] **Side sheets** (`sheet`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Standard, modal; docked, detached
  - [x] Swipe to dismiss the modal side sheet
  - [x] Predictive back (dialog `cancel` / `CloseWatcher`; close motion from Compose; no web gesture progress events)

### All other components

- [x] **App bars** (`appbar`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Sizes: small, medium flexible, large flexible
  - [x] Subtitle
  - [x] Search app bar
  - [x] Scrolled state
  - [x] Centered title
  - Gaps: the baseline medium/large app bar sets (the spec no longer recommends them; gb uses the flexible ones)
  - [x] Search bar placeholder contains the word "Search" (the `search` slot is consumer content; nothing enforces or defaults it) <!-- spec-gap: app-bars-6ca9a4 -->
  - [x] Search app bar on mobile fits a trailing avatar plus two trailing icons (the compact limit counts every trailing element, avatar included, so the avatar is the first to overflow) <!-- spec-gap: app-bars-57f1db -->
  - [x] Alternate search colors keep search text and container at 3:1 (a consumer choice; the component does not check overrides) <!-- spec-gap: app-bars-321317 -->
- [x] **Badges** (`badge`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Small (dot), large (count, `max` shows "999+"), screen reader label
- [x] **Cards** (`card`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Elevated, filled, outlined
  - [x] Interactive (button or link), disabled, dragged
- [x] **Carousel** (`carousel`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Multi-browse
  - [x] Uncontained, uncontained multi-aspect
  - [x] Hero, center-aligned hero
  - [x] Full-screen
  - [x] Item dynamic widths and parallax (keylines ported from Compose)
- [x] **Checkbox** (`checkbox`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Checked, indeterminate, error
- [x] **Chips** (`chip`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Assist, filter, input, suggestion (old type names kept as aliases)
  - [x] Leading icon or avatar, remove button, checkmark when selected
  - [x] Elevated / flat, selected, disabled, dragged
  - [x] Chip set (`md-gb-chip-set`): one tab stop, arrow keys (RTL aware), Home/End, focus after removal
- [x] **Dialogs** (`dialog`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog (Expressive variant of the Dialog page)
  - [x] Basic (hero icon, scroll dividers)
  - [x] Full-screen
- [x] **Divider** (`divider`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Horizontal, vertical
  - [x] Inset, inset-start, inset-end
- [x] **Lists** (`list`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] One, two and three lines
  - [x] Segmented
  - [x] Selection
  - [x] Expand (`md.comp.list.expand`)
  - [x] Reorder (`md.comp.list.reorder`), pointer and keyboard
  - [x] Reveal / swipe actions (`md.comp.list.reveal`)
  - [x] Long press to select, long press and drag to select a range
  - Gaps: the baseline item shape and icon sizes (gb uses the Expressive ones)
- [x] **Menus** (`menu`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Standard, vibrant colors
  - [x] Checked items
  - [x] Submenus (keyboard, hover), groups with labels, gaps (`layout="grouped"`)
  - [x] Context menus (right-click, long press, Shift+F10)
- [x] **Radio buttons** (`radio`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
- [x] **Search** (`search`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Search bar
  - [x] Search view (docked, full-screen; contained and divided) with suggestions
  - [x] Predictive back (dialog `cancel` / `CloseWatcher`; close motion from Compose; no web gesture progress events)
- [x] **Sliders** (`slider`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Sizes xs–xl
  - [x] Standard, range, centered
  - [x] Ticks / discrete
  - [x] Value label
  - [x] Vertical
  - [x] Inset icons
- [x] **Snackbar** (`snackbar`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Single line, two lines, action, close
  - [x] Consecutive snackbars shown one at a time (`md-gb-snackbar-host`), announced in a polite live region
- [x] **Switch** (`switch`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Icons, selected, disabled
  - [x] Token file generated from the spec: handle sizes, disabled colors and opacities
- [x] **Tabs** (`tabs`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Primary, secondary
  - [x] Icons and labels
- [x] **Text fields** (`textfield`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog (Expressive variant of the Text field page)
  - [x] Filled, outlined
  - [x] Supporting text, counter, error, prefix and suffix, icons
  - [x] Text area (`type="textarea"`, fixed height, `rows`)
  - [x] Multi-line text field: starts as a single-line field and grows to fit its lines (`text-fields.md`: "Multi-line text fields grow to accommodate multiple lines of text… These fields initially appear as single-line fields"); `field-sizing: content` with a JS fallback (see `ENGINEERING-BACKLOG.md` item 3)
  - [x] Select and autocomplete (`select`: `md-gb-select`, `md-gb-autocomplete`)
- [x] **Toolbars** (`toolbar`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Docked, floating
  - [x] Standard, vibrant
  - [x] Horizontal, vertical
  - [x] Floating toolbar with FAB, collapsing
- [x] **Tooltips** (`tooltip`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Plain (with optional caret)
  - [x] Rich (subhead, actions, persistent)

### Cross-cutting (required by several spec pages)

- [x] **Density** (the spec defines density for each of these)
  - [x] Button groups
  - [x] Checkbox
  - [x] Chips
  - [x] Date pickers
  - [x] Icon buttons
  - [x] Lists
  - [x] Menus
  - [x] Radio
  - [x] Segmented buttons
  - [x] Switch
  - [x] Tabs
  - [x] Text fields
  - [x] Time pickers
- [x] **Single-pointer alternative for every drag action** (`bottom-sheets.md`, `cards.md`)
  - [x] Bottom sheet: the drag handle cycles preset heights or closes
  - [x] Side sheet and navigation drawer/rail swipe: close button or scrim
  - [x] List reveal: actions reachable without swiping ("more" button)
  - [x] List reorder: move without dragging (tap handle, Move up/down)
  - [x] Cards (dragged state): move without dragging (menu pattern; the app moves cards)
  - [x] Slider: change the value without dragging (tap on track)
  - [x] Pane scaffold drag handle: resize without dragging (tap toggles, `handle-tap="cycle"`)
- [x] **Don't obscure actionable elements or their focus indicator** (FAB, FAB menu, snackbar, cards, dialogs, side sheets pages)
  - [x] Sticky app bars and toolbars: `setupScrollPadding()` sets `scroll-padding` so focused elements aren't hidden
  - [x] FAB and FAB menu
  - [x] Snackbar (`anchor` above a FAB or toolbar)
  - [x] Side sheets and dialogs (top layer when modal)
- [x] **Keyboard spec tests generated from the spec's key tables** (`scripts/m3/gen-keyboard-tests.mjs`; no `xit` cases left)
  - [x] Button groups (Left/Right roving focus)
  - [x] Carousel
  - [x] Lists (one tab stop, arrow-key focus)
  - [x] Radio
  - [x] Segmented buttons
  - [x] Sliders
  - [x] Menus (Escape, arrows open the menu)

### Not on the list but needed

- [x] Token gap audit for every component (13 gaps left, all noted here)
- [x] Select and autocomplete (`select`)
- [x] Pull to refresh (`pulltorefresh`)
- [x] App and pane scaffolds (`scaffold`)

## Styles

- [x] **Color**
  - [x] Color roles, including fixed and surface container roles (`roles`, `system`)
  - [x] Static baseline scheme, light and dark (`static`)
  - [x] Dynamic color: scheme from a source color or image (`styles/color/dynamic-color.ts`)
  - [x] Scheme variants: tonal spot, neutral, vibrant, expressive, fidelity,
    content, monochrome, rainbow, fruit salad (`choosing-a-scheme`)
  - [x] Contrast levels: standard, medium, high, generated and static (`prefers-contrast: more`)
  - [x] Custom colors and harmonization (`advanced`)
  - [x] 2025 color spec rules (material-color-utilities 0.4.0; `specVersion` 2025 by default, 2021 available; 2025 rules exist for tonal spot, neutral, vibrant, expressive)
- [x] **Elevation**
  - [x] Levels 0–5
  - [x] Shadow and tonal surfaces
- [x] **Icons**
  - [x] Material Symbols font in components
  - [x] Variable axes: fill, weight, grade (dark mode), optical size follows icon size
  - [x] Filled icon when selected (animated fill)
- [x] **Motion**
  - [x] Easing and duration tokens (`easing-and-duration`)
  - [x] Spring tokens: fast, default, slow; spatial and effects (`overview`)
  - [x] Transitions (`styles/motion/transitions`: View Transitions with a Web Animations fallback)
    - [x] Container transform
    - [x] Forward and backward
    - [x] Lateral
    - [x] Top level
    - [x] Enter and exit
    - [x] Skeleton loaders (`md-gb-skeleton`)
  - [x] Reduced motion: spatial springs become instant, transitions become fades
- [x] **Shape**
  - [x] Corner scale: none to full, including the Expressive extra-large-increased sizes
  - [x] Shape library (the 35 Expressive shapes)
  - [x] Shape morphing
- [x] **Spacing**
  - [x] Space tokens
- [x] **Typography**
  - [x] Baseline type scale (display to label)
  - [x] Emphasized type scale
  - [x] Variable font axes (Roboto Flex, ROND)

## Foundations

- [x] **Accessibility** (`overview`, `designing`, `building-for-all`,
  `usability`, `writing`)
  - [x] Visible focus indicators
  - [x] 48dp touch targets (checked per component)
  - [x] Contrast levels (see Color)
  - [x] Screen reader roles and labels (checked per component)
  - [x] Reduced motion respected by springs and transitions
- [-] **Content design** (`overview`, `alt-text`, `global-writing`,
  `notifications`, `style-guide`): writing guidance, nothing to build
- [x] **Customization** (brand expression)
  - [x] Theme with color, shape and type tokens
  - [x] Generate a theme from brand colors (`applyTheme`, custom colors)
- [x] **Design tokens**
  - [x] Generated from the spec (`npm run m3:update`)
- [x] **Interaction**
  - [x] States: hover, focus, pressed, dragged, selected, disabled (`states`)
  - [x] Inputs: keyboard, pointer, touch (`inputs`), context menus
  - [x] Selection patterns (`selection`): list long-press selection
  - [x] Gestures: swipe to dismiss (drawer, rail, side and bottom sheets), swipe to reveal, reorder, pull to refresh
  - [x] Swipe between tab panels (`md-gb-tab-panels`)
  - [x] Predictive back for sheets, navigation rail and search (`gestures.md`)
- [x] **Layout** (`foundations/layout`, values generated by `scripts/m3/gen-layout.mjs`)
  - [x] Window size classes and breakpoints: compact, medium, expanded,
    large, extra-large (`breakpoints`)
  - [x] Grids, margins and spacers (`grids-spacing`)
  - [x] Panes and scaffold (`md-gb-pane-scaffold`, `md-gb-app-scaffold`)
  - [x] Canonical layouts: list-detail, supporting pane, feed (`canonical-examples`)
  - [x] Bidirectionality / RTL: logical properties throughout, checked per component
  - [x] Floating and docked panes (`levitate`), foldable hinges (`viewport-segments.ts`), height-based classes
- [-] **Glossary**: reference only
- [-] **XR** (`xr/components`, `xr/design`): out of scope
- [-] **Watches**: out of scope

## Spec tests: shared architecture

Goal: every spec unit that is in code is also **tested**, by a passing test
that cites it. Instead of one test per sentence (~2,100 for the tracked
gaps alone), behavior moves into shared code that is tested once: about 60%
of the gaps sit behind ~10 controllers and ~7 central CSS/token suites, and
per-component behavior is checked by contract tests generated from one
config (like the token spec tests). Estimates come from keyword grouping of
the 2,187 tracked units (±20%).

- [x] **`tested` status in spec-checks**: a unit counts as tested when a `*_test.ts` file cites it (the suite keeps those green); the report's "Tested" line counts them (109 after RovingFocus, 2,911 after the controllers, suites, generators and citation passes). `*_gap.ts` files hold red tests for unbuilt spec features (`check --gaps`); they don't count
- [x] **Shared controllers** (Lit `ReactiveController`s in `components/shared/`, each with one thorough suite and a contract module in `scripts/m3/contracts/`)
  - [x] RovingFocus: arrows, Home/End, wrap, RTL (computed direction), disabled skip, direction-aware entry, initial tab stop — `roving-focus.ts`
    - [x] Controller: button group (horizontal, every button tabbable, no Home/End), segmented button (one tab stop), chip set (backwards enters a chip at its remove button), nav drawer (Tab enters on the first destination, per the spec's initial-focus rule; it used to start on the selected one)
    - [x] Shared movement (`nextFocusIndex`) inside their own models: list (two tab stops while outside, item controls), menu (typeahead, submenus, disabled items stay focusable), FAB menu (menu button), carousel (no wrap; the other axis leaves the carousel)
    - [-] Not roving focus, so not migrated: select and search results (listbox with `aria-activedescendant`, clamped, page keys), slider and time picker (arrows change a value), scaffold (arrows resize panes), date picker (2-D grid; a grid controller if another grid appears)
    - [x] Toolbar and nav rail moved to RovingFocus (they relied on the native `focusgroup` attribute, which Chromium doesn't ship, so arrow keys did nothing)
  - [x] ModalSurface: `showModal`, close requests with a reason (Escape, back / predictive back, scrim, cancel, confirm), focus in and restore, Tab trap, ref-counted scroll lock (`:root[data-md-gb-scroll-lock]`, modal surfaces only) — `modal-surface.ts`; dialog, bottom and side sheets, nav drawer, modal nav rail, search view, modal date picker, time picker. `predictive-back.ts` moved here from `sheet/`
  - [x] AnchoredOverlay: popover top layer, positioning with flip and clamp, light dismiss with a reason, focus return — `anchored-overlay.ts`; menu (fixed: it was never anchored), select, tooltip, split button, docked date picker
  - [x] Selection: none / single / multi, required, `aria-checked` / `pressed` / `selected` — `selection.ts`; button group, segmented button, chip set, tabs, nav bar
  - [x] Disclosure: `aria-expanded` / `aria-controls`, expand/collapse motion, cancelable `toggle` event fired before the change — `disclosure.ts`; list, FAB, FAB menu, toolbar, scaffold
  - [x] DragSettle: drag / swipe / fling and spring settle on `drag-gesture.ts` — `drag-settle.ts`; list swipe-reveal, scaffold pane resize, bottom sheet resize and dismiss, side sheet dismiss, modal nav drawer, modal nav rail, tab panels. Carousel mouse drag uses `DragGesture` (it snaps by fling projection, not anchors); pull to refresh already did
  - [x] Announcer: one polite / assertive live region — `announcer.ts`; snackbar, date picker, time picker, pull to refresh, text field, carousel
  - [x] Form: `form-field.ts` — ToggleFieldController (checkbox, switch), FormScopedSelectionController (radio), FormDisabledController (fieldset-disabled with recovery), ValueFieldController (dirty value, reset, restore, reported error replacing supporting text: text field, select, autocomplete, date picker), SelectionGroupValidator (required chip set and segmented set; chip set is now form-associated). Slider and time picker use the disabled layer
    - [x] Time picker has no constraint validation (`required`, `setCustomValidity`)
  - [x] Motion: durations, easings, reduced motion, transition end in one helper — `motion.ts`; date and time pickers, pull to refresh, text field, carousel, tab panels, sheets
  - [x] Adaptive: window size class wiring — `adaptive.ts`; app bar collapses trailing actions to an `overflow` slot (2 compact, 4 otherwise)
- [x] **Central CSS / token suites** (in `foundations/` and `styles/`, next to the page each one checks; one parametrized suite each over every component in `testing/subjects.ts`; `KNOWN_GAPS` lists the ones still red, `SPEC_EXCEPTIONS` the ones the spec waives)
  - [x] State layers: hover gated on `@media (hover: hover)` (centrally in `ripple.scss`, plus every component `:hover` rule), 10% focus layer, 16% dragged layer, hover fade
  - [x] Focus indicator (nav drawer item no longer hides the ring)
  - [x] Touch target and density (tabs fixed; text field at density -3 is a spec exception: density is opt-in)
  - [x] Disabled state (38% content, 12% outlined button and icon button outline)
  - [x] RTL mirroring (segmented-button label)
  - [x] Reduced motion (text field label, menu radius, slider clip-path)
  - [x] Color roles, shape, type scale and elevation scales (`scales*_test.ts`: shape in `scales_test.ts`, then `-type`, `-elevation`, `-color`, `-color-dark`)
- [x] **Generators** (all run by `npm run m3:update`; each has `--check`)
  - [x] Contract tests (`scripts/m3/gen-contract-tests.mjs`): roving focus from `CONTRACTS`, every other controller from its module in `scripts/m3/contracts/`; emits only the helpers a file uses
  - [x] Measurement tests from the spec's measurement tables (`gen-measurement-tests.mjs`, rows in `gen-measurement-configs.mjs`); rows measured wrong go to `*_measurement_gap.ts`
  - [x] Anatomy tests: each component exposes the parts its spec anatomy lists (`gen-anatomy-tests.mjs`)
- [x] **Component-specific tests**: citation passes over every component (`*_units_test.ts`, `*_behavior_test.ts`, `*_states_test.ts`), then a pass over every tracked unit (`*_tracked_test.ts` and foundation suites in `styles/` and `shared/central/`): fixed and tested, red-tested in `*_gap.ts`, or excluded. A `spec:` citation in a `*_gap.ts` file tracks the unit, it doesn't cover it. 4,069 units tested; 155 still tracked
  - Built in waves 4-5 (`scripts/m3/TODO.md`): hide / reveal on scroll (app bar, nav bar, tabs, toolbar, `ScrollBehaviorController`); app bar compress to small; menu filtering (`filter-for`); nav rail `hide-when-collapsed`; full-screen dialogs adapt to a basic dialog above compact (`always-full-screen` opts out); button group and toolbar overflow (`OverflowController`) and resizing; editable input chips; centered carousel hero; text field error icon and `supporting-text-visibility`; app scaffold companion rail, toolbar slot, split-pane centering, floating and draggable panes; per-style type tokens and language height; safe-area insets
  - Page vs token conflicts, settled from the page figures, the token database and the Compose sources (`scripts/m3/TODO.md`, "Resolved from the specs"); units the components contradict are excluded with the evidence: snackbar two-line height 68dp; full-screen dialog color surface; 24-hour dial 00-11 outside, 12-23 inside; full-screen dialog fills the window (no 560dp cap); fixed tabs equal width, capped at the widest tab on wide windows; search bar elevation shown by tone; floating toolbar level 3; toolbar standard button on-surface-variant; tab indicator rounds only its top corners
- [x] **Exclusion review**: 865 units that no library code could satisfy (designer advice, captions, app content, platform-only rules) are excluded with their reason in `scripts/m3/exclusions/*.md` (`spec-exclude:`)

## Engineering backlog (not spec requirements)

Platform and tooling work from `ENGINEERING-BACKLOG.md`, which has the details,
the spec rule each item must keep, and the ideas rejected because they
conflict with the spec. Changes must keep the spec's token values and states
and pass the existing spec tests unchanged; features that aren't Baseline get
`@supports` or feature detection with the current behavior as the fallback.

- [x] **Hover state layers only on hover-capable pointers**: wrap `:hover` layers in `@media (hover: hover)` (22 stylesheets; `states.md` Hover). Pressed, focused and dragged layers unchanged. Text field, select and autocomplete now gate their `:hover` too.
- [x] **Text-field errors after interaction**: `:user-invalid`, keeping the spec's swap of error text for supporting text (`text-fields.md` Error text); the `error` property still overrides. Done in the element (an `interacted` flag set on blur after an edit), not with `:user-invalid`: the error must also swap the supporting text and set `aria-invalid`, and custom validity lives on the host.
- [x] **Multi-line text field with `field-sizing: content`**: done (Text fields above).
- [x] **Scrolled app-bar color via a scroll-state container query**: surface container, no shadow (`app-bars.md` Color); JS stays as the fallback. A sticky bar is its own `scroll-state` container (`stuck: top`); the `scrolled` attribute covers non-sticky bars and the hide/compress behaviors.
- [x] **Connected button-group corners with `@scope`**: evaluated, kept as is. The rules already use child combinators, so nothing leaks; `@scope` would flatten the specificity the selected/pressed/size corner rules rely on, and the required `@supports not` fallback would duplicate every rule.
- [x] **CSS scroll lock for modal surfaces**: modal dialogs and modal sheets only, never standard sheets (`dialogs.md` Scrolling, `bottom-sheets.md`). Already CSS (`:root[data-md-gb-scroll-lock]{overflow:hidden}`; `:root:has(dialog:modal)` cannot see dialogs in shadow roots); tests now check the computed overflow.
- [x] **Tooling**
  - [x] Validate compiled CSS with Lightning CSS against the browser targets (`npm run css-validate`; targets Chrome/Edge 120, Firefox 121, Safari 17.2 in the script). First run found an invalid `::part(btn).btn-xs` selector that dropped the connected button-group size corners; fixed.
  - [x] Per-component Brotli size budgets for CSS and JS (`scripts/size/bundle-size.ts`, budgets in `scripts/size/budgets.json`, `npm run size:check`, `npm run check -- --size`)
  - [x] Agent skill or plugin generated from the Custom Elements Manifest and this checklist (`scripts/m3/gen-agent-skill.mjs` writes `skill/`; reads the TypeScript sources because the manifest analyzer crashes on the library)
  - [x] `performance.mark`/`measure` behind a debug flag (DevTools custom track): `shared/perf.ts`, on with `?md-gb-perf`, `MD_GB_DEBUG_PERF` or the `md-gb-perf` localStorage key
  - [x] axe-core checks in the test runner (`foundations/accessibility/axe_test.ts`, 65 rows incl. open overlays; fixed radio `aria-checked` and the list live region inside role=list)
- [-] **Rejected** (conflict with the spec; reasons in `ENGINEERING-BACKLOG.md`): carousel scroll buttons and markers, `corner-shape`, `shape()` for the loading indicator, `text-box` trimming, `sibling-index()` stagger, OKLCH palettes, Tailwind `@apply` and checkbox/`:target` overlays, `random()` / `@function` / `if()` / `contrast-color()`.

## Spec gaps by section (generated)

<!-- spec-gaps:start -->
Generated by `scripts/m3/gen-gap-checklist.mjs` from `spec-checks.mjs`: 0 spec sections with 0 units that are neither in code nor excluded. Each line tracks its section's open units (`spec-gap:`); build the feature, cite it in code with `spec:`, and the line goes away on the next run.

<!-- spec-gaps:end -->
