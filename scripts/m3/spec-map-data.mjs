/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview The spec map's data: each library folder with md-* elements,
 * the M3 spec pages it implements, its docs page and a note. Read by
 * gen-spec-map.mjs (SPEC-MAP.md) and scripts/api/gen-api.mjs (API.md).
 */

/**
 * Library folder -> the spec pages it implements (paths under
 * .m3-specs/pages, without `.md`), its docs page (under docs/) and a note.
 */
export const SPEC_MAP = [
  // Components (m3.material.io/components).
  {dir: 'components/appbar', pages: ['components/app-bars'], docs: 'components/app-bar'},
  {dir: 'components/badge', pages: ['components/badges'], docs: 'components/badge'},
  {dir: 'components/button', pages: ['components/buttons', 'components/all-buttons'], docs: 'components/button',
    note: '`all-buttons` is the overview of every button type.'},
  {dir: 'components/buttongroup', pages: ['components/button-groups'], docs: 'components/button-group'},
  {dir: 'components/card', pages: ['components/cards'], docs: 'components/card'},
  {dir: 'components/carousel', pages: ['components/carousel'], docs: 'components/carousel'},
  {dir: 'components/checkbox', pages: ['components/checkbox'], docs: 'components/checkbox'},
  {dir: 'components/chip', pages: ['components/chips'], docs: 'components/chip'},
  {dir: 'components/datepicker', pages: ['components/date-pickers'], docs: 'components/date-picker'},
  {dir: 'components/dialog', pages: ['components/dialogs'], docs: 'components/dialog'},
  {dir: 'components/divider', pages: ['components/divider'], docs: 'components/divider'},
  {dir: 'components/fab', pages: ['components/floating-action-button', 'components/extended-fab'], docs: 'components/fab',
    note: 'One element for both pages: a `label` makes it an extended FAB.'},
  {dir: 'components/fabmenu', pages: ['components/fab-menu'], docs: 'components/fab-menu'},
  {dir: 'components/iconbutton', pages: ['components/icon-buttons'], docs: 'components/icon-button'},
  {dir: 'components/list', pages: ['components/lists'], docs: 'components/list'},
  {dir: 'components/loadingindicator', pages: ['components/loading-indicator'], docs: 'components/loading-indicator'},
  {dir: 'components/menu', pages: ['components/menus'], docs: 'components/menu'},
  {dir: 'components/navbar', pages: ['components/navigation-bar'], docs: 'components/navigation-bar'},
  {dir: 'components/navdrawer', pages: ['components/navigation-drawer'], docs: 'components/navigation-drawer',
    note: 'Deprecated: no longer recommended in M3 Expressive. Use the expanded navigation rail.'},
  {dir: 'components/navrail', pages: ['components/navigation-rail'], docs: 'components/navigation-rail'},
  {dir: 'components/progress', pages: ['components/progress-indicators'], docs: 'components/progress'},
  {dir: 'components/radio', pages: ['components/radio-button'], docs: 'components/radio'},
  {dir: 'components/search', pages: ['components/search'], docs: 'components/search'},
  {dir: 'components/segmentedbutton', pages: ['components/segmented-buttons'], docs: 'components/segmented-button'},
  {dir: 'components/sheet', pages: ['components/bottom-sheets', 'components/side-sheets'], docs: 'components/sheets'},
  {dir: 'components/slider', pages: ['components/sliders'], docs: 'components/slider'},
  {dir: 'components/snackbar', pages: ['components/snackbar'], docs: 'components/snackbar'},
  {dir: 'components/splitbutton', pages: ['components/split-button'], docs: 'components/split-button'},
  {dir: 'components/switch', pages: ['components/switch'], docs: 'components/switch'},
  {dir: 'components/tabs', pages: ['components/tabs'], docs: 'components/tabs'},
  {dir: 'components/textfield', pages: ['components/text-fields'], docs: 'components/text-field'},
  {dir: 'components/timepicker', pages: ['components/time-pickers'], docs: 'components/time-picker'},
  {dir: 'components/toolbar', pages: ['components/toolbars'], docs: 'components/toolbar'},
  {dir: 'components/tooltip', pages: ['components/tooltips'], docs: 'components/tooltip'},
  // Extras (extras/): the library's own components, with no page of their
  // own in the M3 components index. Each follows the pages listed.
  {dir: 'extras/scaffold', pages: ['foundations/layout/scaffold'], docs: 'foundations/scaffold',
    note: 'A Foundations > Layout page, not a component.'},
  {dir: 'extras/select', pages: ['components/menus', 'components/text-fields'], docs: 'components/select',
    note: 'No page of its own: a menu opened from a text field.'},
  {dir: 'extras/demo', pages: [], docs: null,
    note: 'No M3 page: an example and its code, as documentation shows them.'},
  {dir: 'extras/prose', pages: ['styles/typography'], docs: null,
    note: 'No page of its own: long-form text styled with the type scale (Applying type).'},
  {dir: 'extras/shape', pages: ['styles/shape'], docs: null,
    note: 'No page of its own: the shape library and shape morph of the shape page.'},
  {dir: 'extras/pulltorefresh', pages: ['components/loading-indicator'], docs: 'components/pull-to-refresh',
    note: 'No page of its own: the loading indicator page covers pull to refresh.'},
  // Elements outside the component folders.
  {dir: 'styles/icons', pages: ['styles/icons'], docs: 'styles/icons'},
  {dir: 'styles/motion/transitions', pages: ['styles/motion/transitions'], docs: 'styles/motion-transitions'},
  {dir: 'foundations/accessibility/aria', pages: [], docs: null,
    note: 'Headless WAI-ARIA patterns that the components build on; M3 has no page for them.'},
];

/**
 * Library folders without elements -> the spec pages their modules
 * implement. The longest matching folder wins; SPEC_MAP entries win over
 * these. A folder missing here (components/shared, the styles/ root) has no
 * spec page.
 */
export const FOLDER_PAGES = {
  'foundations/accessibility': ['foundations/designing', 'foundations/building-for-all'],
  'foundations/design-tokens': ['foundations/design-tokens'],
  'foundations/interaction/gestures': ['foundations/interaction/gestures'],
  'foundations/interaction/inputs': ['foundations/interaction/inputs'],
  'foundations/interaction/selection': ['foundations/interaction/selection'],
  'foundations/interaction/states': ['foundations/interaction/states'],
  'foundations/layout': [
    'foundations/layout/layout-overview',
    'foundations/layout/breakpoints',
    'foundations/layout/grids-spacing',
    'foundations/layout/bidirectionality-rtl',
  ],
  'styles/color': [
    'styles/color/system',
    'styles/color/roles',
    'styles/color/dynamic',
    'styles/color/static',
    'styles/color/choosing-a-scheme',
    'styles/color/advanced',
  ],
  'styles/elevation': ['styles/elevation'],
  'styles/icons': ['styles/icons'],
  'styles/motion': ['styles/motion/overview', 'styles/motion/easing-and-duration'],
  'styles/motion/transitions': ['styles/motion/transitions'],
  'styles/shape': ['styles/shape'],
  'styles/spacing': ['styles/spacing'],
  'styles/typography': ['styles/typography'],
  // The global stylesheet: every design token as a CSS custom property.
  'styles/m3': ['foundations/design-tokens'],
  'styles/color/md-color-tokens': ['foundations/design-tokens', 'styles/color/roles'],
};

/**
 * Design token groups (CSS custom properties `--md-<group>-*` of the global
 * stylesheet) -> the spec pages that define them.
 */
export const TOKEN_PAGES = {
  'ref-typeface': ['styles/typography'],
  'sys-color': ['styles/color/roles', 'styles/color/system'],
  'sys-elevation': ['styles/elevation'],
  'sys-language': ['styles/typography'],
  'sys-layout': ['foundations/layout/breakpoints', 'foundations/layout/grids-spacing'],
  'sys-motion': ['styles/motion/easing-and-duration'],
  'sys-shape': ['styles/shape'],
  'sys-space': ['styles/spacing'],
  'sys-typescale': ['styles/typography'],
};
