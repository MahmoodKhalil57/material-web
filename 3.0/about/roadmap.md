# Roadmap

This roadmap describes current, future, and past goals for Material Web Components.

## Current

**Version 3.0 (`labs/gb`) is the M3 Expressive implementation of MWC.** It adds
Expressive components (such as the button group, split button, FAB menu,
carousel, loading indicator, and toolbar), dynamic color, the Expressive shape,
type, and motion systems, WAI-ARIA 1.3 conformance, and Web Platform Baseline
fallbacks. Version 2.5.0 remains in
[maintenance mode](https://github.com/material-components/material-web/discussions/5642).

## Future

**Note: No future work is planned while MWC is in
[maintenance mode](https://github.com/material-components/material-web/discussions/5642).**
These roadmap items represent what used to be planned.

### New components

Version 3.0 builds every component in the list 2.5.0 planned except these:

*   Autocomplete
*   Banner
*   Data table

The badge, bottom sheet, card, date and time pickers, navigation bar, drawer
and rail, search, segmented button, snackbar, tooltip and top app bar are in
`labs/gb`. The toolbar replaces the bottom app bar in M3 Expressive.

### Expand Material Design tokens

Version 3.0 has the shape and motion system tokens.

We also want to make it easier to use Material Design tokens, such as applying
Material typescale, shape, and color to your own components.

### Density and spacing tokens

Density allows components to take up less vertical space for larger displays.
While we have some spacing tokens already, we need a comprehensive spacing
system to fully support density across components.

### Create TSX components

[TSX](https://www.typescriptlang.org/docs/handbook/jsx.html) is a popular
language extension for frameworks like [React](https://reactjs.org/). We want to
make it easier and more seamless to use Material Web Components in TSX.

### Explore Material Design layouts

Components are only part of the story to build fully expressive Material Design
applications. We want to explore ways to support building applications that
follow
[Material's layout patterns](https://m3.material.io/foundations/layout/understanding-layout/overview).

## Past

### Follow accessibility best practices

*Completed in Q1 2024*

Everyone should be able to access and enjoy the web. We want our components to
help others build accessible experiences. The following screen readers are fully
supported:

*   VoiceOver
*   Talkback
*   ChromeVox
*   JAWS
*   NVDA

### Cards and more

*Completed in Q4 2023*

*   Components
    *   ✅
        [Card preview](https://github.com/material-components/material-web/tree/c9360e2310dee2896592649f8a8f9b03e2737bf2/labs/card)
*   Features
    *   🟡 Prevent event default behavior
        *   *We fixed lots of bugs, but there's still ways we can improve.*
    *   ✅
        [Size tracking](https://github.com/material-components/material-web/blob/c9360e2310dee2896592649f8a8f9b03e2737bf2/docs/size.md)
    *   ✅ [Docs and examples](https://material-web.dev/)

### Material 1.0

*Completed in Q3 2023*

*   Features
    *   ✅ Color theming
    *   ✅ Typography theming
*   Components
    *   ✅ Button
    *   ✅ FAB
    *   ✅ Icon button
    *   ✅ Checkbox
    *   ✅ Chips
    *   ✅ Dialog
    *   ✅ Divider
    *   ✅ Elevation
    *   ✅ Focus ring
    *   ✅ List
    *   ✅ Menu
    *   ✅ Progress indicators
    *   ✅ Radio
    *   ✅ Ripple
    *   ✅ Select
    *   ✅ Slider
    *   ✅ Switch
    *   ✅ Tabs
    *   ✅ Text field
