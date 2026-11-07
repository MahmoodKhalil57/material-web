---
title: Elevation
section: styles
order: 5
description: Elevation is the distance between two surfaces on the z-axis.
---

Elevation is the distance between two surfaces on the z-axis. It tells people
which surface sits in front, which one sits behind, and which one is the
current focus. Every surface and component has an elevation, so keep the
number of levels small.

## Levels

There are six levels, 0 to 5. Each one has a token:

- `--md-sys-elevation-shadow-0` (no shadow) to `--md-sys-elevation-shadow-5`

Levels 0 to 3 are for resting components. Levels 4 and 5 are for interaction
states, such as hover and drag. Components raise by one level when hovered or
focused: a FAB goes from level 3 to level 4, and a filled button goes from
level 0 to level 1.

The tokens are defined in `labs/gb/styles/elevation/md-elevation-tokens.scss`.
Shadow colors come from `--md-sys-color-shadow`, so they adapt to the color
scheme.

## Resting levels

Each component has a fixed resting level. Do not change it on your own.

| Level | Components |
| --- | --- |
| 0 | Buttons (filled, tonal, outlined), button group, split button, icon buttons, chips, segmented button, cards (filled, outlined), carousel, list, navigation rail, tabs, slider, app bar (not scrolled), full-screen dialog, docked side sheet |
| 1 | Elevated button, elevated card, elevated chip, modal navigation drawer, modal bottom sheet, modal side sheet |
| 2 | Menu, navigation bar, rich tooltip |
| 3 | FAB (small, standard and extended), FAB menu close button, modal dialog, date picker, time picker, floating toolbar, full-screen dialog above compact windows (where it is a basic dialog) |

The search bar also rests at level 0 without a shadow, but it shows its level
by tone (see below).

## Showing elevation with tone

Elevation can be shown with a tonal surface color instead of a shadow. Two
components do this in gb:

- **Search bar**: no shadow. Its container uses `surface-container-high`, the
  tone for level 3.
- **App bar when scrolled**: no drop shadow. Its container changes from
  `surface` to `surface-container`, the tone for level 2, so it separates from
  the content under it.

Use tone when a surface only needs to be told apart from what is behind it.

## Shadows

Shadows are for two cases only: to protect an element on a busy or patterned
background, and to encourage interaction, such as a card that lifts on hover.
Otherwise rely on the tonal difference between surfaces, which is the default.
A small, sharp shadow means the surface is close to the one behind it. A larger,
softer shadow means more distance.

## Code sample

{% demo "A note card that lifts from level 1 to level 2 on hover" %}
```html
<div class="note-card">Pick up milk</div>
```
```css
.note-card {
  padding: 24px 32px;
  border-radius: var(--md-sys-shape-corner-md);
  color: var(--md-sys-color-on-surface);
  background: var(--md-sys-color-surface-container-low);
  box-shadow: var(--md-sys-elevation-shadow-1);
  transition: box-shadow var(--md-sys-motion-spring-fast-effects-duration)
    var(--md-sys-motion-spring-fast-effects);
}

.note-card:hover {
  box-shadow: var(--md-sys-elevation-shadow-2);
}
```
{% enddemo %}

## What to watch out for

- Do not hard-code shadow values. Use the level tokens so a change to the
  scale reaches every surface.
- Avoid changing the default elevation of a component. When an interaction such
  as hover changes it, make the change the same for every similar component.
- Give floating elements enough contrast with the surface beneath them, either
  through the shadow or through a tone difference.
