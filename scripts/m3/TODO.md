# labs/gb TODO: agent waves

Everything left to make the red tests (`*_gap.ts`, `gb-check --gaps`) pass,
close the 155 tracked spec units (`spec-checks --offline --strict`), and make
the suite fast. Waves run in order; agents inside a wave run in parallel and
own the files listed for them exclusively (others write a red test and report).
Shared rules: `$TMP/scratchpad/suites-brief.md` + `wave3-brief.md`.

Models: **Haiku 5.5** for contained, mechanical work with a clear check;
**Sonnet 5.5** for new shared behavior or cross-component design; **Opus 5.5**
(lead) for infrastructure, spec conflicts, items the agents could not finish,
and the final gate. All run as Claude Code subagents on the subscription, not
the paid API.

Done = item's tests pass and cite the unit (`// spec: <id>`), or the unit is
excluded with an honest reason, `gb-check --fast <dirs>` green, tsgo clean,
`spec-checks --offline --strict` at 0 unaccounted.

Status (2026-11-07): all waves done. 4,270 units tested, 896 excluded with a
reason, 0 tracked, 0 unaccounted; 18,938 tests pass; every `*_gap.ts` is a
"no known gaps" placeholder.

## Wave 0: test speed infrastructure (Opus, before the others)

Measured 2026-11-07: 75s full run; 451s of page time across 301 files = 243s
in specs (about 200s waiting on fixed sleeps, real transitions and mouse and
keyboard round trips) + 148s module loading; the critical path is
`central/state-layers_test.ts` at 30s.

- [x] Cache esbuild transforms in `web-test-runner.config.js` (keyed by path + mtime).
- [x] `gb-check --watch <dirs>` (needs an interactive terminal; the runner refuses watch mode otherwise): keep the runner and browser alive, rerun the
      test files whose imports changed (target: 1-2s per save).
- [x] `until(cond, {timeout})` in `shared/central/subjects.ts`: poll per frame
      instead of fixed sleeps.

## Wave 1: Haiku 5.5 (7 agents)

### H1. Speed: central suites (owns `shared/central/*_test.ts`)
- [x] Replace every `sleep(n)` with `until(...)` on the state the test then
      checks, or `waitForMotion`. Keep each assertion's meaning.
- [x] (done; five split files still 4.5-6s: the pressed state layer files, focus-indicator, disabled buttons, selection-foundation) Split `state-layers_test.ts` (30s), `focus-indicator_test.ts` (14s),
      `states-foundation_test.ts` (13s) and `disabled_test.ts` (11s) into
      per-component-group files so they run in parallel (no file above ~4s).

### H2. Speed: component and controller tests (owns the non-central files with sleeps)
- [x] Same sleep replacement in `shared/modal-surface_test.ts`,
      `shared/motion_test.ts`, `*_keyboard_spec_test.ts`, `*_states_test.ts`,
      `button_behavior_test.ts`, `buttongroup_behavior_test.ts`,
      `card_behavior_test.ts`, snackbar, slider, radio, pulltorefresh tests.
- [x] `scripts/m3/contracts/modal-surface.mjs`: the generated modal tests take
      about 1.2s each (close/escape/focus-trap); wait on the open/close event
      instead of the motion time, regenerate.

### H3. Lists and dividers (owns `list/`, `divider/`)
Baseline list measurements: implement where the Expressive tokens agree,
otherwise exclude as baseline (same reason as `exclusions/navigation.md`).
- [x] lists-05342e lists-284d05 lists-8eb6f6 lists-27303f (leading icon top padding 8/12dp)
- [x] lists-02c500 lists-b2ec67 lists-90366d lists-fe2484 (trailing element padding 16/24dp)
- [x] lists-fa3cfa lists-fc3a70 (divider inset padding 24dp)
- [x] moved to "Needs a decision": divider-4330cf divider-08e6df divider-5ebf55 divider-87726c

### H4. Tabs (owns `tabs/`)
- [x] tabs-bf79b7 tabs-09e737 tabs-7ce157: scrollable tabs start 52dp from the leading edge (red test exists)
- [x] (see "Resolved from the specs (second pass)") tabs-28dacf: fixed tabs are all as wide as the widest tab

### H5. Typography, icons and targets (owns `labs/gb/styles/typography/`, `icon/`)
- [x] typography-11f209 typography-acc02d typography-48e5e6: links are underlined and primary (or tertiary)
- [x] typography-6a429e typography-29cfca: tabular numbers where values change (time picker, date picker, slider value label, progress)
- [x] icons-f11257: symbols next to text shift down ~11.5% of the text size
- [x] icons-9a51c6 icons-5223a8 icons-cb80d0: 24dp icons get a 48dp target, 20dp a 40dp one (denser with mouse and keyboard)
- [x] layout-grids-spacing-616eac layout-grids-spacing-7e70fa layout-grids-spacing-2d453f: targets stay 48dp under density

### H6. Text field and search (owns `textfield/`, `search/`)
- [x] text-fields-57887f text-fields-ddd1ec text-fields-3ccd4e done; text-fields-aed1bf done (Opus: `supporting-text-visibility="focus"`); was: text-fields-ddd1ec text-fields-3ccd4e text-fields-aed1bf: error icon in the error state, labelled "Error", always or on focus (red test exists)
- [x] search-168029: focused search shows a status indicator (search icon or progress)
- [x] (4 tested, edc895 excluded) spacing-69a83a spacing-4e4961 spacing-17a38e spacing-edc895 spacing-780579: search bar padding 8dp, gaps 8dp, margins 24dp (12dp when focused)

### H7. Elevation table (owns token `// EDIT:` lines for elevation only; reads every component)
- [x] (41 rows in central/elevation_test.ts; Opus wave 3: app bar scrolled tone check for elevation-4aa184, docked date picker) elevation-2dc660 elevation-23a31c elevation-55fb01 elevation-4aa184
      elevation-7f1215 elevation-7d2103: one central test that renders each
      component in the table and checks its resting elevation level; fix
      token bindings that disagree. Resting levels 0-3 only (+4/+5 for
      interaction).

## Wave 2: Sonnet 5.5 (5 agents)

### S1. Scroll behavior controller (owns new `shared/scroll-behavior.ts`, `appbar/`, `navbar/`, `toolbar/` scroll parts, `tabs/` scroll parts)
One controller: watches a scroll target and hides, reveals or compresses its host.
- [x] app-bars-e910da app-bars-35b14b: app bar can hide on scroll and reveal
- [x] app-bars-66c0e7 app-bars-971ae8 app-bars-302c28 app-bars-5d7418: medium/large flexible compress into small, stay small until back at the top (red test exists)
- [x] navigation-bar-cbd409 navigation-bar-f032de: nav bar hides on scroll down, reveals on scroll up
- [x] navigation-bar-791f1a: never hides while a screen reader is in use (opt-out signal, since the web cannot detect one: hide only on pointer/touch scroll, keep it when focus is inside)
- [x] tabs-1caa6d tabs-0fbb30 tabs-449208: tabs scroll off and return, as one unit with the attached app bar
- [x] toolbars-7880d6 toolbars-bf8eac toolbars-0b3427: docked and floating toolbars can animate offscreen
- [x] motion-transitions-31df78: enter and exit beyond the screen bounds on scroll

### S2. Overflow and flexible sizing (owns new `shared/overflow.ts`, `buttongroup/`, `toolbar/` layout parts)
- [x] button-groups-610620 button-groups-1c44fd button-groups-555e59: trailing buttons collapse into a trailing overflow menu when they don't fit, and come back
- [x] button-groups-d66f7d button-groups-39104b button-groups-52d3e1: fixed vs flexible resizing
- [x] toolbars-2ba1d1 toolbars-f576ad toolbars-830ef9 toolbars-b8c059 toolbars-8c6224: toolbar overflow menu in the trailing slot, more actions as the window grows, optional max width (red test exists)
- [x] toolbars-9bc3d1 toolbars-298c6b: standard button color (the page says primary; the tokens and the figure say on-surface-variant, kept), centered with 8dp between items as a configuration

### S3. Scaffold and layout (owns `scaffold/`, `navrail/`, `dialog/` full-screen parts)
- [x] layout-scaffold-4b82c4 layout-scaffold-d3a7e1 layout-scaffold-66bb92 layout-scaffold-8504d2 layout-overview-de1192 layout-overview-6fce1a: rail regions, companion rail on the trailing side of large windows (red test exists)
- [x] layout-scaffold-5e7da3 layout-scaffold-236688 layout-scaffold-170db1 layout-overview-80b2f7: toolbar floating in the bottom rail region on compact (red test exists)
- [x] layout-scaffold-82f725 layout-scaffold-22cdd6: bars sit next to the safe areas (`env(safe-area-inset-*)`), no primary content there
- [x] (df1132 done; then wave 3: 00877e floating by default changes stacking, 8f2730 drag/resize not built) layout-scaffold-df1132 layout-scaffold-00877e layout-scaffold-8f2730: floating panes by default, optionally draggable or resizable
- [x] layout-breakpoints-e0012f layout-breakpoints-b5ee27 layout-breakpoints-68f992 layout-breakpoints-74b819: split-pane spacer stays centered, navigation shrinks the leading pane (red test exists)
- [x] layout-breakpoints-5f5a06 layout-scaffold-5b1ebf: with a side sheet the rail stays, collapses or hides
- [x] navigation-rail-c63d97 navigation-rail-8afb99 navigation-rail-5580bd navigation-rail-9d8ecf: "hide when collapsed" rail, shown from the menu button
- [x] dialogs-daddf8 dialogs-56b7f9: full-screen dialog only on compact windows, basic dialog above

### S4. Menus, chips and the Escape key (owns `menu/`, `chip/`, `shared/focus*`)
- [x] menus-698263 menus-baa57f menus-761694: the trigger shows as pressed/expanded while the menu is open, also from the keyboard (red test exists)
- [x] menus-e2bb48 menus-7b2947 menus-667232: filtering while typing in an attached text field, items ease into their new position
- [x] menus-b5267f menus-27a063 menus-75b3cd menus-169d55 menus-2a1351 menus-b7dd6e menus-fdae41: baseline menu measurements: implement if the Expressive tokens agree, else exclude as baseline
- [x] chips-d82288 chips-d14ce6 chips-0a0548 chips-a899e6: editable input chips (turns back into text, edit on second interaction)
- [x] chips-5012fa: a chip with only a remove icon is one focusable element
- [x] interaction-inputs-0d5dc6 interaction-inputs-e456f0: Escape hides the focus indicator and resets focus order; in a text field it removes the cursor but keeps the text (red test exists)

### S5. Selection, gestures, carousel; tokens (owns `shared/selection*`, `card/`, `carousel/`, `shared/drag-*`, token generators)
- [x] interaction-selection-ef804a interaction-selection-8d7a74 interaction-selection-f90e15 interaction-selection-92ffad interaction-selection-aa398a interaction-selection-235498: list selection checkboxes (always on as primary activity, on hover, for all once one is selected), avatar tap selects (red test exists)
- [x] interaction-selection-504d1d: selectable cards (red test exists)
- [x] interaction-gestures-54a60e: long press and drag reorders list items (red test exists)
- [x] carousel-0501f7 carousel-57b6ba carousel-0770d6 carousel-b7dc57: centered hero, more large items on wide screens, 9:16-16:9 item widths, press shape change (red tests exist; hero centering is a real bug)
- [x] typography-244c47: per-style size, line height, weight and tracking tokens (red test exists)
- [x] typography-9cbff4 typography-54318e typography-8513fa typography-63df31 typography-1d8cee typography-9f0998 typography-0bd294 typography-d6d5a7: language height (default medium; taller line heights per script, via `:lang()`) (red test exists)
- [x] (83346d: new `--md-sys-shape-corner-value-*` tokens; button group inner corners bind to them) shape-5585a6 shape-dc55a6 shape-83346d: corner family rounded or cut (`corner-shape`), per-corner tokens, inner corners map to per-corner tokens
- [x] shape-eb4d58 shape-7e4b53: shape morph follows the expressive motion scheme, switchable to standard
- [x] spacing-88b700 spacing-d841d0: spacing tokens remap per window class
- [x] color-advanced-01b1f7: per-role fidelity flag in `themeFromSource`

## Wave 3: Opus 5.5 (lead)

Left open by the waves:
- [x] tabs-28dacf (resolved, see below).
- [x] search-168029: focused search status indicator (`searching` attribute: progress, aria-busy, announced) (a visible search icon
      or progress while searching; the status region only announces today).
- [x] (4 tested from the figures and tokens; edc895 excluded: the figure measures from the device frame) spacing-69a83a spacing-4e4961 spacing-17a38e spacing-edc895
      spacing-780579: search bar spacing from spacing.md "Parts of spacing".
      Check whether they describe a figure example (exclude) or the search
      bar's own padding (conflicts with the 56dp container and
      `trailing-actions.gap = space-0`); the 24/12dp margins clash with
      `search_units_test.ts` "stays in its pane".
- [x] layout-scaffold-00877e (large windows float levitated panes; `levitate-coplanar` opts out)
      and layout-scaffold-8f2730 (`levitate-draggable` / `levitate-resizable`, pointer and keyboard) (draggable or resizable floating panes, not
      built).
- [x] dialogs-a4d167 (resolved, see below).

Lost coverage while the waves edited code: the LLM review had covered these
with quotes from code that has since changed, so they fell back to tracked.
Re-cover each with a test that cites it, or exclude it:
- [x] app-bars-f59139 app-bars-2cbec6: app bar customization and layouts
      (S1 edited `app-bar-element.ts`).
- [x] button-groups-8290ab button-groups-07602b: no buttons by default;
      label and icon buttons (S2 edited the button group).
- [x] text-fields-1f192d text-fields-34cdb7: supporting text is the field's
      accessible description (my `supporting-text-visibility` edit).
- [x] layout-scaffold-172813 layout-scaffold-089d9d layout-scaffold-f2efe4
      layout-scaffold-6373e2 layout-scaffold-1d8e24 layout-scaffold-a423c5
      layout-scaffold-8c3637 layout-scaffold-6e9c9c layout-scaffold-6cbe67
      layout-scaffold-a101cd: pane types, temporary and dismissible panes,
      navigation shrinking one pane (S3 edited the scaffold).
- [x] carousel-a29de2: items change shape as they scroll (S5 is editing the
      carousel).

Cleanup:
- [x] tsgo and the full suite green: 18,938 tests in 350 files.
- [x] Review the agents' new tests for checks that cannot fail: a Sonnet audit
      found 16; all fixed, 10 of them shown to fail when the feature is broken.
      Units the component deliberately contradicts are now excluded with the
      evidence instead of cited (snackbar-fbf72d, time-pickers-690231,
      dialogs-0f62e4, toolbars-9bc3d1).
- [x] Empty central `*_gap.ts` files report "Unknown error" under `--gaps`
      (reduced-motion, touch-target, state-layers, disabled, rtl): delete
      them or give each a pending test. (Each now has a passing "no known gaps" check while its list is empty.)
- [x] Final gate: full suite green, `--gaps` shows only what is still open,
      spec-checks 0 unaccounted, CHECKLIST and this file updated, commit.

## Resolved from the specs (page vs tokens)

Tiebreakers: the page's own figures, the token database, other spec pages and
the Compose sources in `.m3-specs/compose`.
- [x] snackbar-fbf72d: 68dp two-line height. The token and Compose
      (`SnackbarTokens.TwoLinesContainerHeight`) give 68dp, and the figure only
      shows the 48dp line; only the guideline text says 64dp.
- [x] dialogs-0f62e4: full-screen dialog in surface. The token says so, and
      the page's color figure paints #fef7ff (surface, not
      surface-container-high); the color list was copied from the basic dialog.
- [x] time-pickers-690231: 00-11 on the outer ring, 12-23 on the inner one.
      Compose (`Hours` / `ExtraHours`) does this; the anatomy sentence
      (even and odd hours on separate rings) contradicts it.
- [x] divider-4330cf divider-08e6df divider-5ebf55 divider-87726c: excluded. The
      figure shows only the 1dp line, Compose's divider has no margins, and
      the list tokens put 0dp around list dividers.
- [x] Search bar elevation: no shadow (the search page and Compose
      `SearchBarDefaults` say level 0); the table's level 3 is the
      surface-container-high tone, which is tested.
- [x] Floating toolbar elevation: level 3. The token says 3 and the table
      says 2; Compose has level 0 with a "TODO read from token".
- [x] elevation-4aa184: the scrolled app bar shows level 2 by tone
      (surface-container), with no shadow.
- [x] Toolbar standard button color: on-surface-variant, from the token and
      the figure (the page text says primary).
- [x] Baseline app bar anatomy and colors: excluded as baseline, like the
      other baseline variants.

## Resolved from the specs (second pass)

- [x] dialogs-a4d167 and the full-screen default: the page limits full-screen
      dialogs to compact windows and uses a basic dialog above
      (dialogs-daddf8, dialogs-56b7f9), so `full-screen` adapts by default
      (`always-full-screen` opts out). The width fills the window: two
      sentences (dialogs-1bb3d9, dialogs-6777bc) and the measurement figure
      outweigh the table's 560dp cap, which is excluded. The fallback basic
      dialog now also takes the basic tokens (elevation, color).
- [x] tabs-28dacf: fixed tabs are equal width; at compact they fill the
      window (the Container rule), wider windows cap each tab at the widest
      tab and center the group (the responsive-layout rule and its figure of
      four equal, centered tabs), `align="start"` for the leading edge.
- [x] Escape clears focus page-wide: kept, because interaction-inputs-0d5dc6
      asks Escape to remove visible focus indicators and reset the focus
      order; Escape a component handles is left alone.

# Next: every spec unit proven by a test (waves 6-8)

Goal: the tests are the checklist. A unit counts as done only when a
passing `*_test.ts` cites it, or when it is excluded with a reason a reviewer
can check. Today (2026-11-07) 4,270 of 15,129 units are tested. The rest:

| Bucket | Units | Proof today | Target |
|---|---:|---|---|
| auto-review | 1,102 | LLM found a quote in the code | a test that cites it |
| cited via a duplicate | 791 | the same sentence is tested on another page | a test for this page's component, or a note that the shared test covers it |
| review-not-applicable | 1,029 | LLM verdict, no written reason | `spec-exclude:` with a reason, or a test |
| below the classifier threshold | 4,276 | classifier score < 0.3 | screened: buildable ones get tests, the rest stay |
| not-a-requirement | 2,748 | named rules | spot-check a sample per rule |
| excluded | 896 | written reasons | done |

## Wave 6: Haiku 5.5 (parallel, one page group each)
- [ ] auto-review -> tests. Each unit already names the file:line and quote
      that covers it (`scripts/m3/spec-autocite.json`): write a test that
      checks the behavior and cites the unit; if it fails, report it as a
      gap instead of weakening the test. ~10 agents by page group.
- [ ] review-not-applicable -> written exclusions or tests (Haiku sorts;
      anything it thinks is buildable goes to wave 7).
- [ ] Duplicate-cited units: confirm the shared test covers this page's
      component; otherwise add the component to that test.
- [ ] Screen the 3,097 units scored below 0.2: flag any that state a
      buildable rule (expected few).

## Wave 7: Sonnet 5.5
- [ ] Screen the 1,179 units scored 0.2-0.3 (closest to the threshold).
- [ ] Implement what waves 6 and the screens turn up (red tests first).
- [ ] Audit wave 6's new tests for checks that cannot fail (as before).

## Wave 8: Opus 5.5 (lead)
- [ ] Spot-check the not-a-requirement rules and the exclusions.
- [ ] Final gate and commit.

## CHECKLIST items left (not spec units)
- [ ] Hover gating for the text field and select (`$hover` applies on touch;
      states.md Hover). Spec behavior, small: wave 7.
- [ ] Modernization (`:user-invalid`, scroll-state container query, `@scope`
      corners, CSS scroll lock): optional, same behavior, new mechanism.
- [ ] Tooling (Lightning CSS, size budgets, agent skill, performance marks,
      axe-core): optional; axe-core would add a check every page gets.
