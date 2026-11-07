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
  **Token gaps** = Compose-vs-gb token audit (`.m3-specs/gaps.txt`).

## Components

### Buttons

- [~] **Buttons** (`button`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Colors: elevated, filled, tonal, outlined, text
  - [x] Sizes: xs, sm, md, lg, xl
  - [x] Shapes: round, square
  - [x] Toggle (selected / unselected)
  - [x] Shape morph on press and selection
  - [ ] Token gaps: 28 (toggle colors, square/pressed shapes, icon sizes)
- [x] **Button groups** (`buttongroup`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Standard, connected
  - [x] Sizes xs–xl
  - [x] Selection: none, single, multiple
  - [ ] Token gap audit not run
- [~] **Extended FAB** (`fab` with a label)
  - [x] Tokens · [x] Component · [ ] Spec test of its own · [~] Catalog (inside FAB)
  - [x] Colors: primary, secondary, tertiary and their containers
  - [~] Sizes: small, medium, large (verify)
  - [ ] Expand and collapse animation on scroll
- [x] **FAB menu** (`fabmenu`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Colors: primary, secondary, tertiary containers
  - [x] Close button
  - [x] Alignment
- [x] **FAB** (`fab`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Sizes: default, medium, large
  - [x] Six color sets
  - [ ] Token gap audit not run
- [x] **Icon buttons** (`iconbutton`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Colors: standard, filled, tonal, outlined
  - [x] Sizes xs–xl
  - [x] Widths: narrow, default, wide
  - [x] Shapes: round, square
  - [x] Toggle
  - [ ] Token gap audit not run
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

- [~] **Date pickers** (`datepicker`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Docked date picker
  - [x] Modal date picker (single date, date range)
  - [x] Modal date input
  - [ ] Scrolling month list and full-screen layout for modal range selection
  - [ ] Swipe between months
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
  - [ ] Token gap audit not run

### Navigation

- [x] **Navigation bar** (`navbar`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Items with labels and badges
  - [~] Horizontal items (medium windows) (verify)
- [x] **Navigation drawer** (`navdrawer`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Standard, modal
  - [x] Headline, section labels, dividers, badges, link items
  - Note: the Expressive spec suggests the expanded navigation rail for most cases.
- [x] **Navigation rail** (`navrail`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Collapsed, expanded
  - [x] Modal
  - [x] Alignment
  - [x] Badges

### Sheets

- [x] **Bottom sheets** (`sheet`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Standard, modal
  - [x] Drag handle, swipe to dismiss, partially expanded and expanded
- [x] **Side sheets** (`sheet`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Standard, modal; docked, detached

### All other components

- [x] **App bars** (`appbar`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Sizes: small, medium flexible, large flexible
  - [x] Subtitle
  - [x] Search app bar
  - [x] Scrolled state
  - [~] Centered title (verify)
- [x] **Badges** (`badge`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Small (dot), large (count)
- [x] **Cards** (`card`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Elevated, filled, outlined
  - [x] Interactive, disabled
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
- [~] **Chips** (`chip`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [~] Assist, filter, input, suggestion: gb has the types action, filter,
    toggle, link plus removable (check that the mapping covers all four spec types)
  - [x] Elevated / flat colors
- [x] **Dialogs** (`dialog`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog (Expressive variant of the Dialog page)
  - [x] Basic (hero icon, scroll dividers)
  - [x] Full-screen
- [x] **Divider** (`divider`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Horizontal, vertical
  - [~] Inset (verify)
- [~] **Lists** (`list`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] One, two and three lines
  - [x] Segmented
  - [x] Selection
  - [ ] Expand (`md.comp.list.expand`)
  - [ ] Reorder (`md.comp.list.reorder`)
  - [ ] Reveal / swipe actions (`md.comp.list.reveal`)
- [~] **Menus** (`menu`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Standard, vibrant colors
  - [x] Checked items
  - [~] Submenus, groups and gaps (verify)
- [x] **Radio buttons** (`radio`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
- [x] **Search** (`search`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Search bar
  - [x] Search view (docked, full-screen; contained and divided) with suggestions
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
- [~] **Switch** (`switch`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Icons, selected, disabled
  - [ ] Token gaps: 18 (disabled colors and opacities, handle sizes)
- [x] **Tabs** (`tabs`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Primary, secondary
  - [x] Icons and labels
- [~] **Text fields** (`textfield`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog (Expressive variant of the Text field page)
  - [x] Filled, outlined
  - [x] Supporting text, counter, error, prefix and suffix, icons, textarea
  - [ ] Select and autocomplete (`filled-select`, `outlined-autocomplete`, ...)
- [x] **Toolbars** (`toolbar`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Docked, floating
  - [x] Standard, vibrant
  - [x] Horizontal, vertical
  - [~] Floating toolbar with FAB (verify)
- [x] **Tooltips** (`tooltip`)
  - [x] Tokens · [x] Component · [x] Spec test · [x] Catalog
  - [x] Plain (with optional caret)
  - [x] Rich (subhead, actions, persistent)

### Not on the list but needed

- [ ] Token gap audit for every component (only button and switch done)
- [ ] Select (standard `md-*-select` only)

## Styles

- [~] **Color**
  - [x] Color roles, including fixed and surface container roles (`roles`, `system`)
  - [x] Static baseline scheme, light and dark (`static`)
  - [ ] Dynamic color: scheme from a source color or image (`dynamic`)
  - [ ] Scheme variants: tonal spot, neutral, vibrant, expressive, fidelity,
    content, monochrome, rainbow, fruit salad (`choosing-a-scheme`)
  - [ ] Contrast levels: standard, medium, high (`advanced`)
  - [ ] Custom colors and harmonization (`advanced`)
- [x] **Elevation**
  - [x] Levels 0–5
  - [x] Shadow and tonal surfaces
- [~] **Icons**
  - [x] Material Symbols font in components
  - [~] Variable axes: fill, weight, grade, optical size (verify)
  - [ ] Filled icon when selected, consistently across components (verify)
- [~] **Motion**
  - [x] Easing and duration tokens (`easing-and-duration`)
  - [x] Spring tokens: fast, default, slow; spatial and effects (`overview`)
  - [ ] Transitions (`transitions`)
    - [ ] Container transform
    - [ ] Forward and backward
    - [ ] Lateral
    - [ ] Top level
    - [ ] Enter and exit
    - [ ] Skeleton loaders
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

- [~] **Accessibility** (`overview`, `designing`, `building-for-all`,
  `usability`, `writing`)
  - [x] Visible focus indicators
  - [~] 48dp touch targets (verify per component)
  - [ ] Contrast levels (see Color)
  - [~] Screen reader roles and labels (audit per component)
  - [ ] Reduced motion respected by springs and transitions (verify)
- [-] **Content design** (`overview`, `alt-text`, `global-writing`,
  `notifications`, `style-guide`): writing guidance, nothing to build
- [~] **Customization** (brand expression)
  - [x] Theme with color, shape and type tokens
  - [ ] Generate a theme from brand colors (needs dynamic color)
- [x] **Design tokens**
  - [x] Generated from the spec (`npm run m3:update`)
- [~] **Interaction**
  - [x] States: hover, focus, pressed, dragged, selected, disabled (`states`)
  - [~] Inputs: keyboard, pointer, touch (`inputs`) (verify per component)
  - [~] Selection patterns (`selection`)
  - [ ] Gestures: swipe, drag to dismiss, pull to refresh (`gestures`)
- [ ] **Layout**
  - [ ] Window size classes and breakpoints: compact, medium, expanded,
    large, extra-large (`breakpoints`)
  - [ ] Grids, margins and spacers (`grids-spacing`)
  - [ ] Panes and scaffold (`scaffold`)
  - [ ] Canonical layouts: list-detail, supporting pane, feed (`canonical-examples`)
  - [~] Bidirectionality / RTL (`bidirectionality-rtl`): only 3 components have RTL styles
- [-] **Glossary**: reference only
- [-] **XR** (`xr/components`, `xr/design`): out of scope
- [-] **Watches**: out of scope
