---
title: Motion
section: styles
order: 8
description: "This page follows the three subpages of the M3 motion guidance: the motion physics system, easing and duration and transitions."
---

This page follows the three subpages of the M3 motion guidance: the
[motion physics system](#overview), [easing and duration](#easing-and-duration)
and [transitions](#transitions). Each section says what the spec asks for and
how to do it with `labs/gb`.

## Overview

Material 3 Expressive uses a physics-based motion system. Springs drive
spatial motion (position, size, rotation, corner shape) and effects springs
drive properties that must not overshoot, like color and opacity. One spring
can serve transitions, button effects and gestures, which keeps the product
feeling consistent. Each spring is exposed as a CSS `linear()` easing with a
matching duration, so a transition can use it directly.

### Motion schemes

- **Expressive** is the default. Use it for most situations, especially hero
  moments and key interactions. Spatial springs overshoot and bounce into
  place.
- **Standard** moves with minimal bounce and suits utilitarian products. Apply
  it to a subtree with the `md-motion-standard` class.

The spec's three levels of customization map to CSS like this:

1. Use a default scheme: do nothing (Expressive), or add `md-motion-standard`.
2. Create a custom scheme: override the spring custom properties in your own
   `:root` rule.
3. Swap the scheme for one element: put `md-motion-standard` on that element.

```html
<section class="md-motion-standard">
  <md-gb-button>Save</md-gb-button>
</section>
```

### Spring tokens

Spring tokens follow `--md-sys-motion-spring-<speed>-<spatial|effects>`, with
`fast`, `default` and `slow` speeds. Each has a `-duration` token:

```css
.panel {
  transition: translate var(--md-sys-motion-spring-default-spatial-duration)
    var(--md-sys-motion-spring-default-spatial);
}
```

| Spring  | Expressive | Standard |
| ------- | ---------- | -------- |
| Spatial fast / default / slow | 350 / 420 / 570ms | 160 / 220 / 340ms |
| Effects fast / default / slow | 140 / 220 / 300ms | 140 / 220 / 300ms |

Springs handle interruption and retargeting well, so prefer them. For
animations without interruptions or gestures you can use the curve fallback:
`--md-sys-motion-curve-<speed>-<spatial|effects>` (a `cubic-bezier()`) with
`--md-sys-motion-curve-<speed>-<spatial|effects>-duration`. They carry the
values from the spec's web conversion table.

### Reduced motion

Reduced motion is on when the platform asks for it
(`prefers-reduced-motion: reduce`) or inside an element with the
`md-motion-reduced` class. The spatial springs then become instant (0ms) and
the effects springs keep their timing. People still see fades and color
changes, but not sliding, scaling, parallax or shape morphing.

```html
<div class="md-motion-reduced">
  <!-- Spatial motion is off here, fades stay. -->
</div>
```

Do not build your own motion gate. Read the durations from the tokens so the
scheme and reduced motion apply without extra code.

### Gestures

A gesture has to keep its momentum: a fling that lets go at 2000px/s must not
restart from rest, and a settle that is aimed at a new target half way must
not jump. A CSS transition cannot do either, so `labs/gb` also has the same
springs as physics, in `labs/gb/components/shared/spring.ts`. `readSpring()`
returns the damping ratio and stiffness of a spring token (Expressive or
Standard, whichever applies to the element), and `Spring` solves it in closed
form and samples it every animation frame:

```ts
import {readSpring, Spring} from './spring.js';

const spring = new Spring({
  spec: readSpring(panel, 'default-spatial'),
  onFrame: (x, velocity) => (panel.style.translate = `${x}px`),
  onRest: () => panel.removeAttribute('data-settling'),
});
spring.start(releaseX, anchorX, releaseVelocity); // px and px/s
spring.retarget(otherAnchorX); // keeps position and velocity
```

Under reduced motion the spring jumps to its target and rests at once.
`DragSettleController` (the drag-and-settle behavior behind swipe to reveal,
drawers, sheets and pane handles) does this for you when you pass `onFrame`: the settle starts at the release
position with the release velocity, and the surface follows the frames with no
CSS transition on the moved property. Without `onFrame` it keeps the CSS
transition of the spring token.

### Shape morphing

Buttons and icon buttons (`md-gb-button`, `md-gb-icon-button`) morph their
shape when pressed and when selected. That is spatial motion, so reduced
motion turns it off and keeps the color change.

### Component authors

Components that script their motion use the helpers in
`labs/gb/components/shared/motion.ts`:

- `springDuration(element, speed, kind)` returns the duration of a spring in
  milliseconds, already 0 for spatial springs when motion is reduced.
- `isReducedMotion(element)` and `onReducedMotionChange(...)` follow the
  setting, including inside `.md-motion-reduced`.
- `waitForMotion(...)` resolves when the animations end or when its timeout
  runs out, so waiting never hangs. `waitForDuration(ms, signal)` is the
  plain timed wait.

### Not covered

- The spec's Compose APIs (`MotionScheme` objects, a `CompositionLocal` per
  element) have no web equivalent. The CSS steps above replace them.
- Springs are pre-sampled into `linear()` easings for transitions. A
  transition cannot take a starting velocity, so gestures use the solver
  described in [Gestures](#gestures) instead.

## Easing and duration

M3 Expressive moves components to springs, but transitions still use the
easing and duration system, and so can products that have not migrated yet.
The spec offers a starting pair for each case:

| Easing token | Duration token | Use it to |
| ------------ | -------------- | --------- |
| `emphasized` | `long2` (500ms) | Begin and end on screen |
| `emphasized-decelerate` | `medium4` (400ms) | Enter the screen |
| `emphasized-accelerate` | `short4` (200ms) | Exit the screen |
| `standard` | `medium2` (300ms) | Begin and end on screen, small utility transitions |
| `standard-decelerate` | `medium1` (250ms) | Enter the screen |
| `standard-accelerate` | `short4` (200ms) | Exit the screen |

```css
.sheet {
  transition: translate var(--md-sys-motion-duration-medium4)
    var(--md-sys-motion-easing-emphasized-decelerate);
}
```

Tokens are `--md-sys-motion-easing-<set>[-accelerate|-decelerate]` and
`--md-sys-motion-duration-<short|medium|long|extra-long><1-4>`. Short is
50 to 200ms, medium 250 to 400ms, long 450 to 600ms and extra long 700 to
1000ms, in steps of 50ms (extra long in steps of 100ms).

How to choose:

- **Easing set.** Emphasized for most transitions, with its decelerate and
  accelerate variants for entering and exiting. Standard for small, quick,
  utility transitions.
- **Easing type.** Plain for elements that begin and end on screen,
  decelerate when entering, accelerate when leaving for good. An element that
  leaves temporarily (a drawer that comes back) uses the plain curve.
- **Duration.** Bigger transitions and larger distances take longer. Exits
  are shorter than enters, because the user's attention has already moved on.

Reduced motion does not change these tokens. Gate sliding and scaling yourself
(the transition helpers below do) or use the spring tokens, which follow the
setting.

Not covered: the spec's emphasized easing is a path curve. On the web
`--md-sys-motion-easing-emphasized` is the single `cubic-bezier(0.2, 0, 0, 1)`
approximation, so it is equal to `standard`.

## Transitions

A transition is a short animation that connects elements or full-screen views
and shows how they relate. The spec defines six patterns and notes that they
still use the easing and duration tokens above, not springs. `labs/gb`
implements them in `styles/motion/transitions/` with the View Transitions API,
and falls back to the Web Animations API when the browser lacks it (or when you
pass `viewTransition: false`).

Adopt the stylesheet in the document, because `::view-transition-*` rules only
work there. Then import the helpers:

```ts
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import transitionStyles from '@material/web/labs/gb/styles/motion/transitions/md-motion-transitions.cssresult.js';
import {
  containerTransform,
  sharedAxis,
  lateral,
  fadeThrough,
  enter,
  exit,
} from '@material/web/labs/gb/styles/motion/transitions/transitions.js';

adoptStyles(document, [transitionStyles]);
```

Every helper takes `update`, a function that changes the DOM to the new state,
and returns a promise that resolves when the motion ends. Common options:
`reducedMotion`, `viewTransition`, `duration` and `easing`. The timings come
from `--md-transition-*` custom properties (for example
`--md-transition-shared-axis-duration`), so you can restyle a pattern in CSS.

### Container transform

For an element that becomes a new surface and shows more detail: a card that
opens a details page, a FAB that opens a sheet, a search box, a list item.
The container's bounds, corner radius and color morph while its content fades
through (Emphasized, 500ms by default). `from` and `to` can be the same element
or different ones. Swap them to collapse back.

```ts
await containerTransform(card, () => detail, {
  update: () => (detail.hidden = false),
});
// Collapse: the opened element is `from`, the card is `to`.
await containerTransform(detail, card, {
  update: () => (detail.hidden = true),
});
```

### Forward and backward

For screens at consecutive levels of hierarchy, like an inbox and a message.
The screens slide along the x axis as they fade (`axis: 'y'` and `'z'` are
available too). Always pair `forward` with `backward` when the user goes back,
so the direction stays consistent.

```ts
await sharedAxis('forward', () => showThread(), {scope: stage});
await sharedAxis('backward', () => showInbox(), {scope: stage});
```

`scope` limits the motion to one region. Without it the whole page animates.

### Lateral

For peers at the same level, like tabs or the photos in an album. Both pages
slide the full width together. The direction is `next` or `previous` and
follows the writing direction (RTL is handled).

```ts
await lateral('next', () => selectTab(2), {scope: panels});
```

### Top level

For switching between top-level destinations (navigation bar, rail or drawer).
The old screen quickly fades out, then the new one fades in, so they never
overlap. These destinations are not related spatially, so there is no
directional slide; the new screen only scales up slightly as it fades in.

```ts
await fadeThrough(() => showDestination('Library'), {scope: main});
```

### Enter and exit

For introducing or removing a component. `enter(element, options)` shows it
(`hidden = false`) and `exit(element, options)` animates it away, then you hide
or remove it. Both resolve when the animation ends.

- **Within screen bounds** (menus, dialogs, snackbars, tooltips, FABs). The
  default `style: 'expand'` is the Android style: the component expands away
  from the nearest screen edge, without scale. `style: 'scale'` is the iOS
  style (scale in, fade out). Pick the edge with `origin`.
- **Beyond screen bounds** (drawers, sheets, banners, navigation). `style:
  'slide'` slides the component on and off from its edge. Set `temporary: true`
  for something that comes back, like a drawer, so it exits with the plain
  Emphasized curve instead of the accelerate one.

```ts
// A menu at the top of the screen expands downwards.
await enter(menu, {origin: 'top'});
await exit(menu, {origin: 'top'});

// A navigation drawer slides in from the start edge.
await enter(drawer, {style: 'slide', origin: 'start', temporary: true});
```

Match the origin to where the component lives: a notification from the top, a
drawer from the start edge, a bottom sheet and the keyboard from the bottom.
In templates, `enterExitClasses(state, options)` returns a `classMap()` object
(`md-transition-enter`, `md-transition-from-top` and so on), and
`clearEnterExit(element)` removes the classes.

#### Hide and reveal while scrolling

A component can also leave and return based on a scroll gesture, to give more
room for browsing: a top app bar or a navigation bar that slides off the screen
edge while the user scrolls down and back on when they scroll up.
`scrollEnterExit(element, options)` does this with the slide enter and exit
motion and returns a handle with `hidden`, `show()`, `hide()` and `destroy()`.

```ts
import {scrollEnterExit} from '@material/web/labs/gb/styles/motion/transitions/transitions.js';

// The element is sticky or fixed at the top edge.
const handle = scrollEnterExit(topBar, {target: 'content', origin: 'top'});
const navHandle = scrollEnterExit(navBar, {origin: 'bottom'});
```

`target` is the scrolling element or its id (the window by default), `origin`
the edge it slides toward. It uses the same scroll rules as the app bar and
navigation bar, so they all behave alike: it reveals at the top and when
scrolled up, hides after a short scroll down, never hides while focus is inside
it, and reveals when focus moves into it. A hidden element is `inert`. With
reduced motion it fades instead of sliding. Call `destroy()` when the element
goes away. Components that already have `scroll-behavior="hide"` do not need
this.

#### Coplanar components

A coplanar component sits at the same elevation as the main content (a
standard side sheet), so the content shrinks to make room as it enters and
grows back as it exits. `coplanar(element, open, options)` animates the
element's size from zero to its natural size with the enter motion (and back
with the exit motion), so a flex or grid neighbor resizes with it. It shows the
element when opening and sets `hidden` when closing ends.

```ts
await coplanar(panel, true); // The main content narrows as the panel opens.
await coplanar(panel, false);
```

`axis: 'block'` grows the element along the block axis instead of the inline
axis. With reduced motion the size changes at once and only a fade plays.
`md-gb-side-sheet` already does this itself: a standard (not modal) sheet takes
its width as `open` is set, so the content beside it shrinks with its spring
motion. Use `coplanar()` for your own panels.

### Skeleton loaders

For the step from a loading state to loaded content. The skeleton hints at
where content will appear and holds its space, so the layout does not shift.
It pulses subtly from the top left to the bottom right, and the content fades in
on top when it is ready.

```html
<md-gb-skeleton loading shape="text" style="inline-size: 12rem"></md-gb-skeleton>

<md-gb-skeleton id="card" loading>
  <p>Content that loads.</p>
</md-gb-skeleton>
```

```ts
import '@material/web/labs/gb/styles/motion/transitions/md-gb-skeleton.js';

card.loading = false; // The content fades in. The pulse stops.
```

`shape` is `rect`, `text` or `circle`. While loading the element sets
`aria-busy="true"` and makes its content inert. For markup without the element,
use the classes `md-skeleton`, `md-skeleton-text` and `md-skeleton-circle`.

### Accessibility and good practice

The spec asks transitions to follow accessibility settings, stay consistent,
keep layouts stable, avoid jump cuts, use one spatial model and direction, fade
cleanly and stay simple.

- Every helper follows `prefers-reduced-motion` and replaces sliding and
  scaling with a quick fade. Pass `reducedMotion: true` to force it, as an app
  setting would.
- Fade through never overlaps the old and new content. The content fade of a
  container transform is timed to the fastest part of the motion.
- Use one pattern per kind of navigation, and keep forward and backward
  mirrored.
- Dialogs and similar components that appear in place use the short fade
  (`--md-transition-enter-fade-duration`).

## Watch out for

- Keep most of a product on one scheme. Switch schemes only for a few key
  moments, and do it on purpose.
- Do not use motion to carry meaning on its own. Reduced motion removes it,
  so pair it with a change people can see without motion.
