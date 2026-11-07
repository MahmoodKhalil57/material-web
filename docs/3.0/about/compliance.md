---
title: Spec compliance
section: about
order: 2
description: What the spec checks, ARIA and axe results, Baseline use and size budgets say about md-gb-* components.
---

## How compliance is measured

The numbers on this page come from the repository itself and are regenerated
by `node scripts/m3/gen-compliance-page.mjs` (`--check` fails when this page
is stale). The M3 spec is downloaded with `npm run m3:update`, split into
**units** (a sentence, list item, table row or image description, each with an
id), and `node scripts/m3/spec-checks.mjs --offline` records what happens to
each one in `.m3-specs/spec-checks/units.json`. Only unit counts and ids are
used here, never spec text.

## Spec units

A unit is **buildable** when the classifier scores it at 0.3 or more
(it describes something a component can do, not a caption or designer advice).
**Tested** units are cited from a `*_test.ts` file under `labs/gb` or
`scripts/m3` (`spec: <unit id>`). **Excluded** units have a written reason in
`scripts/m3/exclusions/*.md` (`spec-exclude:`). **Tracked** units are known
gaps listed in `scripts/m3/CHECKLIST.md` (`spec-gap:`). **Uncovered** units
are buildable, with no status and no test; the target is 0.

| Spec page | Units | Buildable | Tested | Excluded | Tracked | Uncovered |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `all-buttons` | 76 | 30 | 10 | 1 | 0 | 0 |
| `app-bars` | 404 | 319 | 104 | 22 | 0 | 0 |
| `badges` | 162 | 135 | 63 | 2 | 0 | 0 |
| `bottom-sheets` | 162 | 134 | 66 | 1 | 0 | 0 |
| `button-groups` | 249 | 210 | 133 | 2 | 0 | 0 |
| `buttons` | 435 | 348 | 173 | 8 | 0 | 0 |
| `cards` | 315 | 243 | 79 | 37 | 0 | 0 |
| `carousel` | 347 | 299 | 97 | 16 | 0 | 0 |
| `checkbox` | 115 | 82 | 45 | 4 | 0 | 0 |
| `chips` | 516 | 397 | 114 | 21 | 0 | 0 |
| `date-pickers` | 424 | 379 | 79 | 11 | 0 | 0 |
| `dialogs` | 328 | 244 | 124 | 19 | 0 | 0 |
| `divider` | 84 | 48 | 20 | 4 | 0 | 0 |
| `extended-fab` | 262 | 194 | 79 | 16 | 0 | 0 |
| `fab-menu` | 227 | 196 | 81 | 24 | 0 | 0 |
| `floating-action-button` | 247 | 183 | 55 | 24 | 0 | 0 |
| `foundations/building-for-all` | 36 | 0 | 0 | 0 | 0 | 0 |
| `foundations/customization` | 48 | 35 | 10 | 2 | 0 | 0 |
| `foundations/design-tokens` | 129 | 36 | 0 | 2 | 0 | 0 |
| `foundations/designing` | 198 | 83 | 0 | 39 | 0 | 0 |
| `foundations/interaction/gestures` | 51 | 27 | 12 | 3 | 0 | 0 |
| `foundations/interaction/inputs` | 131 | 92 | 36 | 24 | 0 | 0 |
| `foundations/interaction/selection` | 63 | 46 | 34 | 0 | 0 | 0 |
| `foundations/interaction/states` | 260 | 193 | 107 | 8 | 0 | 0 |
| `foundations/layout/bidirectionality-rtl` | 120 | 87 | 45 | 8 | 0 | 0 |
| `foundations/layout/breakpoints` | 336 | 218 | 61 | 3 | 0 | 0 |
| `foundations/layout/canonical-examples` | 185 | 99 | 29 | 7 | 0 | 0 |
| `foundations/layout/grids-spacing` | 216 | 58 | 21 | 6 | 0 | 0 |
| `foundations/layout/layout-overview` | 179 | 95 | 17 | 22 | 0 | 0 |
| `foundations/layout/scaffold` | 216 | 172 | 77 | 10 | 0 | 0 |
| `foundations/overview` | 36 | 5 | 0 | 0 | 0 | 0 |
| `foundations/usability` | 205 | 17 | 0 | 1 | 0 | 0 |
| `icon-buttons` | 352 | 292 | 168 | 2 | 0 | 0 |
| `lists` | 577 | 486 | 161 | 35 | 0 | 0 |
| `loading-indicator` | 151 | 102 | 41 | 6 | 0 | 0 |
| `menus` | 391 | 325 | 124 | 35 | 0 | 0 |
| `navigation-bar` | 313 | 259 | 80 | 24 | 0 | 0 |
| `navigation-drawer` | 295 | 256 | 142 | 5 | 0 | 0 |
| `navigation-rail` | 359 | 311 | 134 | 11 | 0 | 0 |
| `progress-indicators` | 220 | 164 | 61 | 3 | 0 | 0 |
| `radio-button` | 127 | 84 | 44 | 8 | 0 | 0 |
| `search` | 367 | 297 | 154 | 13 | 0 | 0 |
| `segmented-buttons` | 193 | 149 | 56 | 0 | 0 | 0 |
| `side-sheets` | 191 | 165 | 97 | 5 | 0 | 0 |
| `sliders` | 292 | 261 | 124 | 0 | 0 | 0 |
| `snackbar` | 199 | 169 | 71 | 1 | 0 | 0 |
| `split-button` | 186 | 155 | 98 | 3 | 0 | 0 |
| `styles/color/advanced` | 143 | 64 | 29 | 0 | 0 | 0 |
| `styles/color/choosing-a-scheme` | 32 | 10 | 3 | 0 | 0 | 0 |
| `styles/color/dynamic` | 90 | 14 | 6 | 5 | 0 | 0 |
| `styles/color/resources` | 9 | 2 | 0 | 1 | 0 | 0 |
| `styles/color/roles` | 219 | 162 | 77 | 64 | 0 | 0 |
| `styles/color/static` | 77 | 10 | 4 | 3 | 0 | 0 |
| `styles/color/system` | 259 | 93 | 39 | 8 | 0 | 0 |
| `styles/elevation` | 136 | 80 | 29 | 13 | 0 | 0 |
| `styles/icons` | 286 | 141 | 30 | 64 | 0 | 0 |
| `styles/motion/easing-and-duration` | 136 | 110 | 61 | 44 | 0 | 0 |
| `styles/motion/overview` | 126 | 75 | 30 | 31 | 0 | 0 |
| `styles/motion/transitions` | 246 | 140 | 47 | 72 | 0 | 0 |
| `styles/shape` | 159 | 77 | 45 | 6 | 0 | 0 |
| `styles/spacing` | 128 | 77 | 22 | 9 | 0 | 0 |
| `styles/typography` | 392 | 126 | 43 | 29 | 0 | 0 |
| `switch` | 200 | 150 | 86 | 5 | 0 | 0 |
| `tabs` | 245 | 206 | 87 | 12 | 0 | 0 |
| `text-fields` | 405 | 358 | 69 | 14 | 0 | 0 |
| `time-pickers` | 365 | 342 | 208 | 2 | 0 | 0 |
| `toolbars` | 339 | 253 | 71 | 23 | 0 | 0 |
| `tooltips` | 162 | 130 | 58 | 0 | 0 | 0 |
| **Total** | **15,129** | **10,799** | **4,370** | **903** | **0** | **0** |

15,129 units on 68 pages (components: 10,282, foundations: 2,409, styles: 2,438).
Buildable units that are neither tested nor excluded are covered another way:
a citation outside a test, a token value checked by the generated spec tests,
a unit judged covered by the LLM review, or a unit that is not a requirement
(image descriptions, overview notes). Those statuses are in `units.json` and
`.m3-specs/spec-checks/report.md`.

### Excluded units by reason

An exclusion is only valid when no code could satisfy the unit (designer
advice, app content, platform-only rules). If the library could enforce or
default it, it is tracked as a gap instead.

| Reason (from scripts/m3/exclusions) | Units |
| --- | ---: |
| Figure captions, labels and swatch descriptions with no requirement of their own | 124 |
| Figure and video captions | 62 |
| Figure, video and interaction-style captions and spec-table cells with no requirement of their own | 51 |
| Baseline variants the spec no longer recommends for new designs | 43 |
| Accessibility and interaction design guidance for designers and app authors (contrast, touch targ... | 39 |
| Usage advice and rationale for designers (when to pick a pattern, easing, duration or speed | 39 |
| Figure captions and list labels that name an example in a figure (which component or pattern the ... | 33 |
| Usage advice for designers and content guidance for the app author (what to write, when to choose... | 33 |
| Cards | 32 |
| Layout and spacing design guidance (rulers, grid concepts, component adaptation principles, input... | 29 |
| 73 further reasons | 418 |

## Token audit

`node scripts/m3/audit-gb.mjs --gaps` compares every token declaration in the
`labs/gb` token files with the M3 token database. **Match** means the value
equals the spec; **derived** means it is computed from a matching token;
**drift** differs from the spec; **no spec token** has no counterpart in the
database; **gaps** are tokens the Compose reference uses that no gb
declaration implements.

Overall: 2415 declarations, 1949 match, 23 derived, 10 drift (0 high-confidence), 433 with no spec token, 10 spec tokens not implemented.

| Component | Declarations | Match | Derived | Drift | No spec token | Gaps | Unwired |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `appbar` | 51 | 47 | 0 | 0 | 4 | 4 | 0 |
| `badge` | 11 | 10 | 0 | 0 | 1 | 0 | 0 |
| `button` | 168 | 157 | 1 | 0 | 10 | 0 | 0 |
| `buttongroup` | 36 | 10 | 0 | 0 | 26 | 0 | 0 |
| `card` | 35 | 33 | 0 | 0 | 2 | 0 | 0 |
| `carousel` | 29 | 14 | 0 | 0 | 15 | 0 | 0 |
| `checkbox` | 54 | 43 | 0 | 0 | 11 | 0 | 0 |
| `chip` | 133 | 121 | 0 | 0 | 12 | 0 | 0 |
| `datepicker` | 146 | 112 | 0 | 1 | 33 | 0 | 0 |
| `dialog` | 45 | 41 | 0 | 0 | 4 | 0 | 0 |
| `divider` | 4 | 2 | 0 | 0 | 2 | 0 | 0 |
| `fab` | 65 | 65 | 0 | 0 | 0 | 0 | 0 |
| `fabmenu` | 38 | 36 | 0 | 0 | 2 | 0 | 0 |
| `iconbutton` | 122 | 113 | 1 | 0 | 8 | 0 | 0 |
| `list` | 117 | 101 | 4 | 1 | 11 | 3 | 0 |
| `loadingindicator` | 9 | 7 | 0 | 0 | 2 | 0 | 0 |
| `menu` | 113 | 97 | 0 | 0 | 16 | 0 | 0 |
| `navbar` | 40 | 35 | 0 | 0 | 5 | 0 | 0 |
| `navdrawer` | 57 | 38 | 0 | 1 | 18 | 0 | 0 |
| `navrail` | 92 | 38 | 8 | 0 | 46 | 0 | 0 |
| `progress` | 18 | 17 | 0 | 0 | 1 | 3 | 0 |
| `radio` | 24 | 18 | 0 | 0 | 6 | 0 | 0 |
| `search` | 79 | 60 | 0 | 0 | 19 | 0 | 0 |
| `segmentedbutton` | 23 | 16 | 0 | 0 | 7 | 0 | 0 |
| `select` | 256 | 248 | 0 | 2 | 6 | 0 | 0 |
| `sheet` | 40 | 20 | 0 | 2 | 18 | 0 | 0 |
| `slider` | 52 | 19 | 0 | 3 | 30 | 0 | 0 |
| `snackbar` | 42 | 15 | 1 | 0 | 26 | 0 | 0 |
| `splitbutton` | 53 | 36 | 0 | 0 | 17 | 0 | 0 |
| `switch` | 58 | 53 | 0 | 0 | 5 | 0 | 0 |
| `tabs` | 56 | 40 | 1 | 0 | 15 | 0 | 0 |
| `textfield` | 150 | 130 | 0 | 0 | 20 | 0 | 0 |
| `timepicker` | 95 | 88 | 0 | 0 | 7 | 0 | 0 |
| `toolbar` | 63 | 45 | 7 | 0 | 11 | 0 | 0 |
| `tooltip` | 41 | 24 | 0 | 0 | 17 | 0 | 0 |

### Drift

Each drift is listed with the token file section, the custom property and why
it differs. `E~` is a deliberate `// EDIT:` override of a generated value;
`?~` is an inferred binding that may be wrong (the audit cannot always tell
which spec token a declaration belongs to).

| Component | Section | Property | Reason |
| --- | --- | --- | --- |
| `datepicker` | `root` | `--menu-list-item-selected-container-color` | deliberate `// EDIT:` override |
| `list` | `list-tokens.item` | `--container-color` | inferred binding that may be wrong |
| `navdrawer` | `root` | `--container-shape` | deliberate `// EDIT:` override |
| `select` | `outlined` | `--container-color` | deliberate `// EDIT:` override |
| `select` | `outlined-autocomplete` | `--container-color` | deliberate `// EDIT:` override |
| `sheet` | `side` | `--divider-color` | deliberate `// EDIT:` override |
| `sheet` | `side-modal` | `--container-shape` | deliberate `// EDIT:` override |
| `slider` | `root` | `--active-track-inner-corner-size` | inferred binding that may be wrong |
| `slider` | `root` | `--track-shape` | inferred binding that may be wrong |
| `slider` | `disabled` | `--stop-indicator-color` | inferred binding that may be wrong |

## Accessibility

Two central suites render rows in `labs/gb/components/shared/central` and run in a real browser:

- **axe** (`axe_test.ts`): axe-core with no rule disabled, on every subject of
  the central table (`subjects.ts`) plus 29 overlay rows in their
  open state (`axe-helpers.ts`).
- **ARIA 1.3** (`aria_test.ts`): the axe rows plus 34 rows that put
  components in the states ARIA depends on (selected, checked, expanded,
  grouped, with panels, with an error), checked against the WAI-ARIA 1.3 role
  and attribute rules. 27 rows are open overlays, so the checks that
  flip state skip them.

Known gaps are rows with a real violation. They move to `axe_gap.ts` and
`aria_gap.ts` (red on purpose) and are recorded in `AXE_GAPS` and
`ARIA_GAPS`. Today: axe none; ARIA none.
Suite files: `aria_gap.ts`, `aria_test.ts`, `axe_gap.ts`, `axe_test.ts`.

## Baseline

`npm run gb:baseline` maps every CSS feature in the compiled `labs/gb` CSS
to its web-features Baseline status. A feature that is not widely available
must sit inside a matching `@supports` guard or be listed with a reason in
`scripts/gb-baseline-allow.json`; anything else fails the run.

- CSS: 19,123 feature uses in 62 files; 50 features are not widely available, used 690 times (478 guarded, 212 allowed with a reason, **0 unguarded**). Result: passes.
- JavaScript (report only): 31 tracked Web API members in 204 source files; 6 are not widely available, 3 of them with at least one use that is not feature-detected.

## Size budgets

Each component has a Brotli size budget for JavaScript and CSS in
`scripts/size/gb-budgets.json`: the measured size plus 10% headroom, enforced by
the size check. Totals across 37 components: 344,643 bytes of JavaScript and 76,295 bytes of CSS.

| Component | JS budget (bytes) | CSS budget (bytes) |
| --- | ---: | ---: |
| `appbar` | 4,639 | 1,586 |
| `badge` | 959 | 474 |
| `button` | 4,952 | 1,508 |
| `buttongroup` | 19,496 | 1,397 |
| `card` | 3,425 | 956 |
| `carousel` | 12,223 | 1,747 |
| `checkbox` | 4,963 | 987 |
| `chip` | 9,624 | 2,417 |
| `datepicker` | 29,548 | 3,889 |
| `dialog` | 9,249 | 2,020 |
| `divider` | 706 | 348 |
| `fab` | 9,723 | 1,097 |
| `fabmenu` | 5,284 | 2,161 |
| `iconbutton` | 10,336 | 1,335 |
| `list` | 13,579 | 3,507 |
| `loadingindicator` | 3,116 | 7,681 |
| `menu` | 10,170 | 2,391 |
| `navbar` | 7,662 | 1,795 |
| `navdrawer` | 9,919 | 2,299 |
| `navrail` | 13,559 | 2,501 |
| `progress` | 3,237 | 3,364 |
| `pulltorefresh` | 6,695 | 1,086 |
| `radio` | 5,224 | 763 |
| `scaffold` | 12,783 | 2,401 |
| `search` | 12,816 | 2,435 |
| `segmentedbutton` | 7,856 | 1,557 |
| `select` | 12,916 | 1,818 |
| `sheet` | 12,922 | 2,147 |
| `slider` | 8,179 | 3,101 |
| `snackbar` | 7,853 | 1,817 |
| `splitbutton` | 3,015 | 986 |
| `switch` | 5,767 | 1,383 |
| `tabs` | 14,838 | 2,281 |
| `textfield` | 7,593 | 2,727 |
| `timepicker` | 13,539 | 3,098 |
| `toolbar` | 20,051 | 1,779 |
| `tooltip` | 6,227 | 1,456 |
