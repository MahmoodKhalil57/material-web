# Adaptive layout

Pages and components change with the window.

labs/gb uses the M3 window size classes to pick the navigation, the number
of panes and how dialogs open.

## Window size classes

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
keyed by class and apply from that class up. Match the attribute in CSS and
use `atLeast('expanded')` in code. Do not read the window width directly.

In a Lit element, create the controller as a field and read `options` in
`render()`. This sample uses a plain element as the host, so it runs without
Lit:

**Example: The number of actions for the window size class**

*HTML*

```html
<div id="bar"></div>
```

*TypeScript*

```ts
import {AdaptiveController} from '@material/web/labs/gb/components/shared/adaptive.js';

const bar = document.querySelector<HTMLElement>('#bar')!;
const controllers: any[] = [];
const host = Object.assign(bar, {
  addController: (c: any) => controllers.push(c),
  removeController: () => {},
  requestUpdate: () => {
    controllers.forEach((c) => c.hostUpdate?.());
    bar.textContent = `${adaptive.options.actions} actions`;
  },
});

// 2 actions at compact and medium, 4 from expanded up.
const adaptive = new AdaptiveController<{actions: number}>(host as any, {
  options: {compact: {actions: 2}, expanded: {actions: 4}},
});
controllers.forEach((c) => c.hostConnected?.());
```

## App scaffold

`md-gb-app-scaffold` lays out the bars and rails around the app's content:

- A navigation bar at compact, a navigation rail at medium and larger.
- At medium, a navigation bar is used instead when a nested
  `md-gb-pane-scaffold` shows two panes, unless the window height is compact.
- A companion rail sits on the trailing side at large and extra-large.
- A toolbar floats in the bottom rail region at compact.
- The FAB sits 16 px from the trailing and bottom edges of the content, and the
  snackbar sits above it.

**Example: An app scaffold with an app bar, both navigation components and a pane scaffold**

```html
<md-gb-app-scaffold style="inline-size: 100%; block-size: 360px">
  <md-gb-app-bar slot="top-app-bar">Mail</md-gb-app-bar>
  <md-gb-nav-bar slot="navigation-bar" aria-label="Primary">
    <md-gb-nav-bar-item active>
      <md-gb-icon slot="icon">inbox</md-gb-icon>
      Inbox
    </md-gb-nav-bar-item>
    <md-gb-nav-bar-item>
      <md-gb-icon slot="icon">send</md-gb-icon>
      Sent
    </md-gb-nav-bar-item>
  </md-gb-nav-bar>
  <md-gb-nav-rail slot="navigation-rail" aria-label="Primary">
    <md-gb-nav-rail-item selected>
      <md-gb-icon slot="icon">inbox</md-gb-icon>
      Inbox
    </md-gb-nav-rail-item>
    <md-gb-nav-rail-item>
      <md-gb-icon slot="icon">send</md-gb-icon>
      Sent
    </md-gb-nav-rail-item>
  </md-gb-nav-rail>
  <md-gb-pane-scaffold>
    <md-gb-list slot="secondary" aria-label="Conversations">
      <md-gb-list-item>Ali Connors</md-gb-list-item>
      <md-gb-list-item>Sandra Adams</md-gb-list-item>
    </md-gb-list>
    <article>
      <h2>Brunch this weekend?</h2>
      <p>From Ali Connors</p>
    </article>
    <p slot="placeholder">Select a conversation</p>
  </md-gb-pane-scaffold>
</md-gb-app-scaffold>
```

Provide both a `md-gb-nav-bar` and a `md-gb-nav-rail` with the same
destinations, and keep their selection in sync. The scaffold shows only one of
them.

## Panes

`md-gb-pane-scaffold` shows one, two or three panes. The default slot is the
primary (flexible) pane, `secondary` is the list of a list-detail layout, and
`tertiary` is an optional third pane, such as a standard side sheet.
`placeholder` is shown in the primary pane of a two-pane layout with nothing
selected.

## Safe areas

The scaffold keeps its bars away from the device safe areas. It reads
`--md-gb-scaffold-safe-top`, `-right`, `-bottom` and `-left`, which default to
`env(safe-area-inset-*)`. Keep primary content out of those edges. To change
the insets, set the custom properties on the scaffold.

## Full-screen dialogs

A full-screen dialog is for compact windows only. Set `full-screen` on
`md-gb-dialog`: at compact it fills the window, and at medium and larger it
falls back to a basic dialog with the same slots. Set `always-full-screen`
to keep the full-screen variant at every size, if the task needs it.
