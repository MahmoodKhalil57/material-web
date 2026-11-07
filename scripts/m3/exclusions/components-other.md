# Spec exclusions: loading indicator, date pickers, snackbar, checkbox, icon buttons, progress, sheets, switch, badges, tooltips, sliders, segmented buttons, divider, all buttons

Units no component code can satisfy or test. See `README.md` for the format.

## Usage advice for designers

- When to use an elevated button <!-- spec-exclude: all-buttons-98460b -->

## Figure captions and role legends without a requirement of their own

- Color role legends for the date picker figures: the image maps each role to an element, the text lists only the role names. The per-element colors come from the token database and are checked by the generated spec tests <!-- spec-exclude: date-pickers-3a8ab4, date-pickers-3515a6, date-pickers-cfb7ec -->
- Loading indicator color figure alt texts that contradict the role lists and tokens printed right below them (the contained indicator is `on-primary-container` on `primary-container`, tested in the spec behavior tests) <!-- spec-exclude: loading-indicator-fc60f0, loading-indicator-ea904f -->
- Video caption that repeats the parent-child checkbox behavior tested in `checkbox_group_test.ts` <!-- spec-exclude: checkbox-e7f972 -->
- Note that the icon button token sets for filled, tonal and outlined are deprecated, which is a token database note <!-- spec-exclude: icon-buttons-15c92e -->
- Changelog sentence from Material 2 to 3 (typography, shadow, color mapping) <!-- spec-exclude: date-pickers-3f6010 -->
- Share sheet examples (fully raised or collapsed), which are app content <!-- spec-exclude: bottom-sheets-58ae23, bottom-sheets-d7ac18 -->
- Side sheet anatomy figure caption and the example of form controls for app settings <!-- spec-exclude: side-sheets-037092, side-sheets-e8813a -->
- Circular progress size figure caption, and the note that the thicker variants are samples for makers to adjust <!-- spec-exclude: progress-indicators-7dbe71, progress-indicators-26bf67, progress-indicators-8fa1dc -->

## The label next to the control belongs to the app

The checkbox and switch render only the control. The adjacent text label is the app's markup, so its color is the app's style. The label still names the control and selects it (tested in `checkbox_group_test.ts` and `switch_label_test.ts`).

- Checkbox adjacent label color is on surface and stays the same on interaction and selection <!-- spec-exclude: checkbox-d8aa38, checkbox-b073e9, checkbox-ae1ec3 -->
- Switch adjacent label color is on surface, supporting text on surface variant <!-- spec-exclude: switch-042d72, switch-c046bd, switch-04c692, switch-4896e6, switch-475239 -->

## Density controls are app UI

- The app builds the controls that turn density on and reverts it, and keeps their targets at 48 by 48 CSS pixels <!-- spec-exclude: checkbox-911683, switch-ecfdc8, icon-buttons-7c360c -->

## Platform-only behavior

- Android predictive back description and the OS-rendered preview of the previous screen. The sheet's own back motion is tested in `sheet_back_test.ts` <!-- spec-exclude: bottom-sheets-b801e7, bottom-sheets-113bf7 -->

## App state and app layout

- Hide a badge once its destination or notification is selected: the app decides when an item counts as read, and the badge or the navigation item just renders what the app sets <!-- spec-exclude: badges-c363f9, badges-0959ce -->
- Move from an indeterminate to a determinate progress indicator when the progress becomes known: the app sets `value` <!-- spec-exclude: loading-indicator-379b2e, loading-indicator-eb9f6c -->
- Scale the loading indicator with the window: the app sets `--size`, which the component clamps to 24dp to 240dp <!-- spec-exclude: loading-indicator-8bf649, loading-indicator-0e4f45 -->
- Use a full-screen modal date picker on compact windows: the app sets `fullscreen` <!-- spec-exclude: date-pickers-9c5a32 -->

## Content guidance for the app author

- Side sheet action buttons use elevation, fill and tone to call attention (Save, Edit, Download), and a divider separates user-generated from system-generated content <!-- spec-exclude: side-sheets-3cb0f0, side-sheets-c44c2c, side-sheets-9e3ce8 -->
- Name the date field for its purpose (event date, reservation date) <!-- spec-exclude: date-pickers-f084f2 -->

## Contradicted by a stronger rule the component follows

- A date input opens the calendar when tapped. The accessibility rule that the calendar icon is the only entry point (tested in `datepicker_a11y_test.ts`) takes precedence, because it keeps text entry free of an extra tab stop <!-- spec-exclude: date-pickers-0b2d96, date-pickers-f09862 -->
