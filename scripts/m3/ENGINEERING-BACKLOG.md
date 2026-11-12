# Library engineering backlog

Platform and tooling improvements for the library, inspired by daisyUI 5.7.50 and
CSS-Tricks (almanac, guides, recent articles). These are not spec
requirements. `CHECKLIST.md` tracks them in its "Engineering backlog"
section; this file keeps the details and the spec rule each must keep.

Every item was checked against `.m3-specs/pages` (2026-11-07). Rules:

- CSS that replaces JS must produce exactly the spec's token values and
  states. Existing spec tests must keep passing unchanged.
- New CSS features that aren't Baseline need `@supports` or feature detection,
  and the current behavior stays as the fallback.
- Cite the spec section the change must keep (`spec:` / `spec-labels:`), like
  any other gb code.

## Do

### 1. Gate hover state layers on `@media (hover: hover)`
- **Now:** 22 component stylesheets use `:hover`. Only `_switch-tokens.scss`
  guards it. Taps on touch screens leave the hover layer stuck on.
- **Spec:** `foundations/interaction/states.md`, Hover: "initiated by the user
  pausing over an interactive element using a cursor."
- **Constraint:** guard only the hover layer. Pressed, focused and dragged
  layers must still show on touch.

### 2. Show text-field errors after interaction with `:user-invalid`
- **Now:** 0 uses. Validity styling is driven from JS.
- **Spec:** `components/text-fields.md`, Error text: error text *replaces*
  supporting text so the layout doesn't move. The spec doesn't say when the
  error appears.
- **Constraint:** keep the swap. Don't add a separate hint line (daisyUI's
  `validator-hint` pattern). The `error` property still overrides.

### 3. Add the multi-line text field variant, using `field-sizing: content`
- **Now:** gb has a single `type="textarea"` with a fixed `rows = 2`, which
  is the spec's **text area**. The spec's **multi-line text field** is missing
  (now an open item under Text fields in `CHECKLIST.md`). This is a spec gap as
  well as a platform improvement.
- **Spec:** `components/text-fields.md`: "Multi-line text fields grow to
  accommodate multiple lines of text… These fields initially appear as
  single-line fields". "Text areas… are a fixed height and scroll
  vertically".
- **Constraint:** grow only the multi-line variant. Text areas stay fixed.
  `field-sizing` is Chromium-only, so add a small JS fallback for other
  browsers.

### 4. Scrolled app-bar color via a scroll-state container query
- **Now:** JS.
- **Spec:** `components/app-bars.md`, Color: "On scroll, the container changes
  color to surface container". No drop shadow.
- **Constraint:** color token only, no elevation. Keep the JS as fallback
  (Chromium-only feature).

### 5. Connected button-group corners with `@scope`
- **Idea:** daisyUI `src/utilities/join.css` sets per-corner variables
  (`--join-ss/se/es/ee`) on first, last and only children inside `@scope`.
- **Spec:** `components/button-groups.md`: inner padding is 2dp at every size.
  The outer shape is fully round (round groups) or uses the per-size corner
  sizes (square groups). The inner corners use the listed per-size sizes.
  Selection morphs only the selected button.
- **Constraint:** only the mechanism changes. Values come from tokens.

### 6. CSS scroll lock for modal surfaces
- **Idea:** daisyUI `src/base/rootscrolllock.css`:
  `:root:has(<open modal>)` sets `overflow` through a variable.
- **Spec:** `components/dialogs.md`, Scrolling: "Dialogs don't scroll with
  elements outside of the dialog". `components/bottom-sheets.md`: standard
  sheets "co-exist with the screen's main UI region".
- **Constraint:** lock for modal dialogs and modal sheets only. Never lock
  for standard bottom or side sheets.

### 7. Tooling
- **Validate compiled CSS with Lightning CSS** against the browser targets
  (daisyUI `functions/validatecss.test.js`).
- **Per-component Brotli size budgets** for CSS and JS that fail CI, by
  extending `scripts/size/bundle-size.ts` (daisyUI `functions/report.js`).
- **Ship an agent skill or plugin** generated from the Custom Elements
  Manifest and the spec checklist (daisyUI ships `skills/daisyui` and
  `.claude-plugin`).
- **`performance.mark`/`measure`** behind a debug flag, surfaced as a
  DevTools custom track.
- **axe-core** checks in the test runner.

## Don't

| Idea | Why not |
|---|---|
| Carousel `::scroll-button` / `::scroll-marker` | Contradicts `components/carousel.md`: "Avoid adding UI elements, like arrows or other icons, within or beside the carousel." gb already follows the spec pattern (Tab/arrows, up/down to leave, a Show all button below; see `carousel_keyboard_spec_test.ts`). |
| `corner-shape` / `superellipse()` corners | Contradicts `styles/shape.md`: corners are defined by the corner radius scale (round arcs). |
| `shape()` for the loading indicator | Not needed: it already morphs the spec's seven shapes with generated SVG paths (`gen-loading-indicator.mjs`). |
| `text-box` trimming on labels | Line height is a type token and adapts by script (`styles/typography.md`). Trimming changes heights that the spec measurements depend on. |
| `sibling-index()` stagger | No component page defines a stagger. Revisit only if a spec motion value calls for one. |
| OKLCH palettes | M3 derives color in HCT, and `dynamic-color_test.ts` already checks contrast ratios at standard, medium and high contrast. |
| Tailwind `@apply` utilities, checkbox and `:target` overlay tricks | Tied to Tailwind, or superseded by popover and `<dialog>`, which gb already uses. |
| `random()`, `@function`, `if()`, `contrast-color()` | Too experimental, and no current spec need. |
