# What the app owns

The components render the control and its states. These parts stay in the app's markup, layout or logic; do not look for an attribute that does them.

## Placement in the window is the app's layout

- Search bar window margins, scroll behavior of the bar, and the app choosing `docked` per breakpoint
- The FAB stays in place on scroll because the app positions it fixed
- A button group's end-call style button outside the group is the app's layout
- The app picks the sizes and shapes inside a group (a group follows its buttons)

## Usage advice for designers and app authors

- Cards: content blocks, media, text, actions and swipe or move gestures are the app's markup and gesture code
- Carousel: text amounts and sizes, the Show all button and the header arrow are the app's content and composition
- Chips: when to use which chip, progress feedback, menus on filter chips, input chips inside a text field, and the outline color the app picks for interactivity
- Radio buttons: the label text and the radio group container are the app's markup
- Text fields: label text, adjacent labels, density controls, adaptive margins and the accessibility labels of icons the app slots in
- Split button: the labels the app gives its buttons and its menu
- The extended FAB's place in the focus order follows the app's DOM order
- Time picker: which picker to default to is the app's choice

## Density controls are app UI

- The app builds the controls that turn density on and reverts it, and keeps their targets at 48 by 48 CSS pixels

## App state and app layout

- Hide a badge once its destination or notification is selected: the app decides when an item counts as read, and the badge or the navigation item just renders what the app sets
- Move from an indeterminate to a determinate progress indicator when the progress becomes known: the app sets `value`
- Scale the loading indicator with the window: the app sets `--size`, which the component clamps to 24dp to 240dp
- Use a full-screen modal date picker on compact windows: the app sets `fullscreen`

## General

- App content and decisions outside a component library (zoom, pan and pinch of content, charts, media players, which icons to mirror, stylus tools)
- State wording with no testable requirement (section introduction, optional elevation on press, state set by the app)
- Ripple, hover, focus ring and activation of the slotted icon buttons: drawn and tested by the button components, the app bar and toolbar draw none of it
- Usage advice for designers and content guidance for the app author (what to write, when to choose, what to avoid); the component has no way to enforce or default it
- Optional behavior ("can"): the component offers an equivalent without the option (scrolling tabs instead of a second label line, reduced motion instead of instant menus, labels that wrap instead of truncating, badge text supplied by the app)
- Baseline variant: only the Expressive component exists in labs/gb, so the baseline lists, menus, navigation bar and bottom app bar color roles, states, anatomy and measurements do not apply (the baseline menu uses a 4dp container radius, 12dp side padding and 24dp icons; the Expressive menu tokens use a larger container radius, 16dp padding and 20dp icons, so the tokens win) (the Expressive ones are tested through the token, state and measurement suites)
- Placement in the window and swapping between components are the app's layout (the components have no window-positioning or breakpoint-swapping API), and scrolling the page is app behavior (the active destination fires a click)
- Opening the search view is behavior of the search bar and view (the search page); the app bar only hosts the search bar in its search slot
- Baseline app bars: the baseline medium and large app bar anatomy and color roles (only the Expressive app bars exist in labs/gb; their anatomy and colors are tested through the app bar token, anatomy and scroll tests)
- Typesetting, measurement and customization guidance for designers and app authors; no library behavior
- Accessibility and interaction design guidance for designers and app authors (contrast, touch targets, keyboard order, ARIA roles); components prove their own behavior in their per-component units
- App content and state rules (back button, selection, scroll position, saved state, pane width across app sessions); the scaffold exposes the mode and pane-width hooks but cannot own the content