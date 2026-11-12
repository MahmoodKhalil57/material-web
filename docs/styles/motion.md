---
title: Motion
section: styles
order: 8
icon: animation
description: "Motion makes a UI expressive and easy to follow: springs for physics, easing and duration tokens, and transition patterns."
---

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

{% demo "A button in a subtree that uses the standard motion scheme" %}
<div class="md-motion-standard">
  <md-gb-button color="filled">Save</md-gb-button>
</div>
{% enddemo %}

### Spring tokens

Spring tokens follow `--md-sys-motion-spring-<speed>-<spatial|effects>`, with
`fast`, `default` and `slow` speeds. Each has a `-duration` token:

{% demo "A panel that slides with the default spatial spring" height=140 %}
```html
<md-gb-button id="slide" color="filled">Slide</md-gb-button>
<div id="panel" class="panel">Panel</div>
```
```css
.panel {
  margin-block-start: 16px;
  padding: 12px 16px;
  inline-size: fit-content;
  border-radius: var(--md-sys-shape-corner-md);
  background: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  transition: translate var(--md-sys-motion-spring-default-spatial-duration)
    var(--md-sys-motion-spring-default-spatial);
}

.panel.moved {
  translate: 160px 0;
}
```
```js
document.querySelector('#slide').addEventListener('click', () => {
  document.querySelector('#panel').classList.toggle('moved');
});
```
{% enddemo %}

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
`md-motion-reduced` class (spatial motion is off there, fades stay). The spatial springs then become instant (0ms) and
the effects springs keep their timing. People still see fades and color
changes, but not sliding, scaling, parallax or shape morphing.

Do not build your own motion gate. Read the durations from the tokens so the
scheme and reduced motion apply without extra code.

### Gestures

A gesture has to keep its momentum: a fling that lets go at 2000px/s must not
restart from rest, and a settle that is aimed at a new target half way must
not jump. A CSS transition cannot do either, so the library also has the same
springs as physics, in `styles/motion/spring.ts`. `readSpring()`
returns the damping ratio and stiffness of a spring token (Expressive or
Standard, whichever applies to the element), and `Spring` solves it in closed
form and samples it every animation frame:

{% demo "A panel driven by a spring with a release velocity" height=140 %}
```html
<md-gb-button id="fling" color="filled">Fling</md-gb-button>
<div id="panel" class="panel">Panel</div>
```
```css
.panel {
  margin-block-start: 16px;
  padding: 12px 16px;
  inline-size: fit-content;
  border-radius: var(--md-sys-shape-corner-md);
  background: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}
```
```ts
import {
  readSpring,
  Spring,
} from '@material/web/styles/motion/spring.js';

const panel = document.querySelector<HTMLElement>('#panel')!;
const spring = new Spring({
  spec: readSpring(panel, 'default-spatial'),
  onFrame: (x) => (panel.style.translate = `${x}px`),
});
document.querySelector('#fling')!.addEventListener('click', () => {
  spring.start(0, 240, 1500); // from and to in px, release velocity in px/s
  setTimeout(() => spring.retarget(120), 150); // keeps position and velocity
});
```
{% enddemo %}

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
`styles/motion/motion.ts`:

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

{% demo "A sheet that enters with the emphasized decelerate easing" height=140 %}
```html
<md-gb-button id="enter" color="filled">Enter</md-gb-button>
<div id="sheet" class="sheet">Sheet</div>
```
```css
.sheet {
  margin-block-start: 16px;
  padding: 12px 16px;
  inline-size: fit-content;
  border-radius: var(--md-sys-shape-corner-md);
  background: var(--md-sys-color-tertiary-container);
  color: var(--md-sys-color-on-tertiary-container);
  transition: translate var(--md-sys-motion-duration-medium4)
    var(--md-sys-motion-easing-emphasized-decelerate);
}

.sheet.moved {
  translate: 160px 0;
}
```
```js
document.querySelector('#enter').addEventListener('click', () => {
  document.querySelector('#sheet').classList.toggle('moved');
});
```
{% enddemo %}

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
still use the easing and duration tokens above, not springs. The library
implements them in `styles/motion/transitions/` with the View Transitions API,
and falls back to the Web Animations API when the browser lacks it (or when you
pass `viewTransition: false`).

The pattern styles are part of `m3Styles` (see
[Quick Start](/3.0/about/quick-start/#import)). Adopt them on the document,
because `::view-transition-*` rules only work there. The helpers come from
`@material/web/styles/motion/transitions/transitions.js`.

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

{% demo "A card that becomes a details surface and collapses back" height=220 %}
```html
<div id="card" class="surface card">
  Inbox
  <md-gb-button id="open">Open</md-gb-button>
</div>
<div id="detail" class="surface detail" hidden>
  Inbox details
  <md-gb-button id="close">Close</md-gb-button>
</div>
```
```css
.surface {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: var(--md-sys-shape-corner-lg);
  background: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface);
}

.detail {
  min-block-size: 140px;
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}
```
```ts
import {containerTransform} from '@material/web/styles/motion/transitions/transitions.js';

const card = document.querySelector<HTMLElement>('#card')!;
const detail = document.querySelector<HTMLElement>('#detail')!;

document.querySelector('#open')!.addEventListener('click', () =>
  containerTransform(card, () => detail, {
    update: () => {
      card.hidden = true;
      detail.hidden = false;
    },
  }),
);
// Collapse: the opened element is `from`, the card is `to`.
document.querySelector('#close')!.addEventListener('click', () =>
  containerTransform(detail, card, {
    update: () => {
      detail.hidden = true;
      card.hidden = false;
    },
  }),
);
```
{% enddemo %}

### Forward and backward

For screens at consecutive levels of hierarchy, like an inbox and a message.
The screens slide along the x axis as they fade (`axis: 'y'` and `'z'` are
available too). Always pair `forward` with `backward` when the user goes back,
so the direction stays consistent.

{% demo "An inbox and a message with forward and backward motion" height=200 %}
```html
<div id="stage" class="stage">
  <section id="inbox">
    <p>Inbox</p>
    <md-gb-button id="forward" color="filled">Open message</md-gb-button>
  </section>
  <section id="thread" hidden>
    <p>Message</p>
    <md-gb-button id="backward">Back</md-gb-button>
  </section>
</div>
```
```css
.stage {
  padding: 16px;
  border-radius: var(--md-sys-shape-corner-lg);
  background: var(--md-sys-color-surface-container-low);
  color: var(--md-sys-color-on-surface);
}
```
```ts
import {sharedAxis} from '@material/web/styles/motion/transitions/transitions.js';

const stage = document.querySelector<HTMLElement>('#stage')!;
const inbox = document.querySelector<HTMLElement>('#inbox')!;
const thread = document.querySelector<HTMLElement>('#thread')!;

document.querySelector('#forward')!.addEventListener('click', () =>
  sharedAxis(
    'forward',
    () => {
      inbox.hidden = true;
      thread.hidden = false;
    },
    {scope: stage},
  ),
);
document.querySelector('#backward')!.addEventListener('click', () =>
  sharedAxis(
    'backward',
    () => {
      thread.hidden = true;
      inbox.hidden = false;
    },
    {scope: stage},
  ),
);
```
{% enddemo %}

`scope` limits the motion to one region. Without it the whole page animates.

### Lateral

For peers at the same level, like tabs or the photos in an album. Both pages
slide the full width together. The direction is `next` or `previous` and
follows the writing direction (RTL is handled).

{% demo "Two peer pages that slide sideways" height=200 %}
```html
<md-gb-button id="next" color="tonal">Next photo</md-gb-button>
<div id="panels" class="panels">
  <p id="photo">Photo 1</p>
</div>
```
```css
.panels {
  margin-block-start: 16px;
  padding: 16px;
  border-radius: var(--md-sys-shape-corner-lg);
  background: var(--md-sys-color-surface-container-low);
  color: var(--md-sys-color-on-surface);
}
```
```ts
import {lateral} from '@material/web/styles/motion/transitions/transitions.js';

const panels = document.querySelector<HTMLElement>('#panels')!;
const photo = document.querySelector<HTMLElement>('#photo')!;
let index = 1;

document.querySelector('#next')!.addEventListener('click', () =>
  lateral('next', () => (photo.textContent = `Photo ${++index}`), {
    scope: panels,
  }),
);
```
{% enddemo %}

### Top level

For switching between top-level destinations (navigation bar, rail or drawer).
The old screen quickly fades out, then the new one fades in, so they never
overlap. These destinations are not related spatially, so there is no
directional slide; the new screen only scales up slightly as it fades in.

{% demo "Switching between top-level destinations" height=200 %}
```html
<md-gb-button id="library" color="tonal">Library</md-gb-button>
<main id="main" class="main">
  <p id="title">Home</p>
</main>
```
```css
.main {
  margin-block-start: 16px;
  padding: 16px;
  border-radius: var(--md-sys-shape-corner-lg);
  background: var(--md-sys-color-surface-container-low);
  color: var(--md-sys-color-on-surface);
}
```
```ts
import {fadeThrough} from '@material/web/styles/motion/transitions/transitions.js';

const main = document.querySelector<HTMLElement>('#main')!;
const title = document.querySelector<HTMLElement>('#title')!;

document.querySelector('#library')!.addEventListener('click', () =>
  fadeThrough(() => (title.textContent = 'Library'), {scope: main}),
);
```
{% enddemo %}

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

{% demo "A menu that expands downwards and a drawer that slides in" height=300 %}
```html
<md-gb-button id="toggle-menu" color="tonal">Menu</md-gb-button>
<md-gb-button id="toggle-drawer" color="tonal">Drawer</md-gb-button>
<ul id="menu" class="panel" hidden>
  <li>Copy</li>
  <li>Paste</li>
</ul>
<nav id="drawer" class="panel drawer" aria-label="Sections" hidden>Inbox</nav>
```
```css
.panel {
  margin: 8px 0 0;
  padding: 12px 24px;
  inline-size: fit-content;
  border-radius: var(--md-sys-shape-corner-md);
  background: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface);
}

.drawer {
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  margin: 0;
  border-radius: 0;
}
```
```ts
import {enter, exit} from '@material/web/styles/motion/transitions/transitions.js';

const menu = document.querySelector<HTMLElement>('#menu')!;
const drawer = document.querySelector<HTMLElement>('#drawer')!;

document.querySelector('#toggle-menu')!.addEventListener('click', async () => {
  // A menu at the top of the screen expands downwards.
  if (menu.hidden) {
    await enter(menu, {origin: 'top'});
  } else {
    await exit(menu, {origin: 'top'});
    menu.hidden = true;
  }
});

document.querySelector('#toggle-drawer')!.addEventListener('click', async () => {
  // A navigation drawer slides in from the start edge.
  if (drawer.hidden) {
    await enter(drawer, {style: 'slide', origin: 'start', temporary: true});
  } else {
    await exit(drawer, {style: 'slide', origin: 'start', temporary: true});
    drawer.hidden = true;
  }
});
```
{% enddemo %}

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

{% demo "A top bar that hides while scrolling down" height=240 %}
```html
<div class="frame">
  <header id="top-bar" class="top-bar">Inbox</header>
  <div id="content" class="content">
    <p>Scroll down to hide the bar and up to bring it back.</p>
    <p>Message from Ana</p>
    <p>Message from Ben</p>
    <p>Message from Chen</p>
    <p>Message from Dana</p>
    <p>Message from Eli</p>
    <p>Message from Fay</p>
    <p>Message from Gus</p>
    <p>Message from Hana</p>
  </div>
</div>
```
```css
.frame {
  position: relative;
  block-size: 200px;
  overflow: hidden;
  border-radius: var(--md-sys-shape-corner-md);
  background: var(--md-sys-color-surface-container-low);
  color: var(--md-sys-color-on-surface);
}

.top-bar {
  position: absolute;
  inset-block-start: 0;
  inset-inline: 0;
  z-index: 1;
  padding: 16px;
  background: var(--md-sys-color-surface-container);
}

.content {
  block-size: 100%;
  overflow: auto;
  padding: 64px 16px 16px;
  box-sizing: border-box;
}
```
```ts
import {scrollEnterExit} from '@material/web/styles/motion/transitions/transitions.js';

const topBar = document.querySelector<HTMLElement>('#top-bar')!;

// The element is sticky or fixed at the top edge.
const handle = scrollEnterExit(topBar, {target: 'content', origin: 'top'});
```
{% enddemo %}


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

{% demo "A side panel that makes room for the main content" height=200 %}
```html
<md-gb-button id="toggle" color="tonal">Toggle panel</md-gb-button>
<div class="layout">
  <main class="main">Main content</main>
  <aside id="panel" class="panel" hidden>Side panel</aside>
</div>
```
```css
.layout {
  display: flex;
  gap: 8px;
  margin-block-start: 16px;
}

.main {
  flex: 1;
  padding: 16px;
  border-radius: var(--md-sys-shape-corner-md);
  background: var(--md-sys-color-surface-container-low);
  color: var(--md-sys-color-on-surface);
}

.panel {
  overflow: hidden;
  padding: 16px;
  border-radius: var(--md-sys-shape-corner-md);
  background: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  white-space: nowrap;
}
```
```ts
import {coplanar} from '@material/web/styles/motion/transitions/transitions.js';

const panel = document.querySelector<HTMLElement>('#panel')!;
let open = false;

document.querySelector('#toggle')!.addEventListener('click', () => {
  open = !open;
  // The main content narrows as the panel opens.
  coplanar(panel, open);
});
```
{% enddemo %}

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

{% demo "A text skeleton and a skeleton that holds a paragraph" height=200 %}
```html
<md-gb-skeleton loading shape="text"></md-gb-skeleton>
<md-gb-skeleton id="card" loading>
  <p>Content that loads.</p>
</md-gb-skeleton>
<md-gb-button id="done" color="tonal">Finish loading</md-gb-button>
```
```ts
import '@material/web/styles/motion/transitions/md-gb-skeleton.js';

const card = document.querySelector('#card')!;
document.querySelector('#done')!.addEventListener('click', () => {
  card.loading = false; // The content fades in. The pulse stops.
});
```
{% enddemo %}

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
