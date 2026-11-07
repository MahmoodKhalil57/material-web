---
name: Adaptive layout
title: Adaptive layout
order: 4
expressiveOnly: true
---

## Adaptive layout

Pages and components change with the window. labs/gb uses the M3 window size
classes to pick the navigation, the number of panes and how dialogs open.

### Window size classes

| Class | Width (CSS px) |
| --- | --- |
| compact | below 600 |
| medium | 600 to 839 |
| expanded | 840 to 1199 |
| large | 1200 to 1599 |
| extra-large | 1600 and up |

Height classes are compact (below 480), medium (480 to 899) and expanded (900
and up). Most layouts scroll, so only use the height class when a component
needs it.

A component gets its class from `AdaptiveController` in
`labs/gb/components/shared/adaptive.ts`. The controller sets the
`window-size-class` attribute on the host, so CSS can match it. Options are
keyed by class and apply from that class up:

```js
// max 2 at compact and medium, 4 from expanded up
{compact: {max: 2}, expanded: {max: 4}}
```

Use `atLeast('expanded')` in code and the attribute in CSS. Do not read the
window width directly.

### App scaffold

`md-gb-app-scaffold` lays out the bars and rails around the app's content:

- A navigation bar at compact, a navigation rail at medium and larger.
- At medium, a navigation bar is used instead when a nested
  `md-gb-pane-scaffold` shows two panes, unless the window height is compact.
- A companion rail sits on the trailing side at large and extra-large.
- A toolbar floats in the bottom rail region at compact.
- The FAB sits 16 px from the trailing and bottom edges of the content, and the
  snackbar sits above it.

```html
<md-gb-app-scaffold>
  <md-gb-app-bar slot="top-app-bar">Mail</md-gb-app-bar>
  <md-gb-nav-bar slot="navigation-bar">…</md-gb-nav-bar>
  <md-gb-nav-rail slot="navigation-rail">…</md-gb-nav-rail>
  <md-gb-pane-scaffold>…</md-gb-pane-scaffold>
</md-gb-app-scaffold>
```

Provide both a `md-gb-nav-bar` and a `md-gb-nav-rail` with the same
destinations, and keep their selection in sync. The scaffold shows only one of
them.

### Panes

`md-gb-pane-scaffold` shows one, two or three panes. The default slot is the
primary (flexible) pane, `secondary` is the list of a list-detail layout, and
`tertiary` is an optional third pane, such as a standard side sheet.
`placeholder` is shown in the primary pane of a two-pane layout with nothing
selected.

### Safe areas

The scaffold keeps its bars away from the device safe areas. It reads
`--md-gb-scaffold-safe-top`, `-right`, `-bottom` and `-left`, which default to
`env(safe-area-inset-*)`. Keep primary content out of those edges. To change
the insets, set the custom properties on the scaffold.

### Full-screen dialogs

A full-screen dialog is for compact windows only. Set `full-screen` on
`md-gb-dialog`: at compact it fills the window, and at medium and larger it
falls back to a basic dialog with the same slots. Set `always-full-screen`
to keep the full-screen variant at every size, if the task needs it.
