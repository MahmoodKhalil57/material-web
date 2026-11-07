# M3 Expressive checklist

Everything listed on https://m3.material.io/components, /styles and
/foundations (downloaded to `.m3-specs/pages`), checked against `labs/gb`.

- `[x]` done, `[ ]` missing, `[~]` partial or needs verifying.
- New components' token files are generated from the spec
  (`scripts/m3/bindings/*.mjs` with `generate: true`, written by
  `node scripts/m3/spec-tokens.mjs --write`, run by `npm run m3:update`).
- Per component: **Tokens** = spec tokens downloaded (`.m3-specs/tokens`),
  **Component** = `md-gb-*` element, **Spec test** = generated
  `*_spec_test.ts`, **Catalog** = page in `npm run catalog:dev`,
  **Token gaps** = spec tokens Compose uses that gb lacks
  (`node scripts/m3/audit-gb.mjs --gaps`).
- Audit (2026-11-07): 1947 declarations match the spec, 8 drift (deliberate
  `// EDIT:` choices or noted below), 13 gaps (all noted below).

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
  - [x] Supporting text, counter, error, prefix and suffix, icons, textarea
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
- [ ] **Keyboard spec tests generated from the spec's key tables** (`scripts/m3/gen-keyboard-tests.mjs`; open lines have failing `xit` cases)
  - [ ] Button groups
  - [x] Carousel
  - [ ] Lists
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
- [x] **Layout** (`styles/layout`, values generated by `scripts/m3/gen-layout.mjs`)
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
