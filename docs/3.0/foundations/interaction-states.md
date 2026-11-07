---
title: Interaction States
section: foundations
order: 2
description: "Interactive components show their state with a state layer: a translucent overlay of the component's content color, drawn between the container and the content."
---

Interactive components show their state with a **state layer**: a translucent
overlay of the component's content color, drawn between the container and the
content. Components handle this for you. You only need to know which state
shows which layer.

| State    | Layer opacity | When                                                  |
| -------- | ------------- | ----------------------------------------------------- |
| Hover    | 8%            | A cursor rests over the element (hover-capable input) |
| Focus    | 10%           | Keyboard or voice focus                               |
| Pressed  | 10%           | A tap or click is in progress                         |
| Dragged  | 16%           | The element is being dragged                          |

Hover and focus combine. A focused, hovered element shows the focus layer
too. Disabled components show no state layers: they cannot be focused,
dragged or pressed, and they do not inherit hover.

## Hover only where it is real

Hover applies only on devices that can hover, through `@media (hover: hover)`.
A tap on a touch screen does not leave the hover layer on. Do not hide
essential content or controls behind hover, because touch users never see it.

## Pressed ripple

The pressed state plays a ripple, with this timing:

- The layer fades in over **75ms**.
- The circle grows over **225ms** (fast-out, slow-in), while its center moves
  to the middle.
- Once the press is released and the growth is done, the layer fades out over
  **150ms**.

A quick tap still shows the ripple for at least 225ms, so a press always reads
as a press.

Use the ripple as written. Do not add a second press effect on top of it.

## Usage

Components apply their states on their own. Use them like any other element.

{% demo "A button and an icon button, both with state layers" %}
<md-gb-button color="tonal">Save</md-gb-button>
<md-gb-icon-button aria-label="Add">
  <md-gb-icon>add</md-gb-icon>
</md-gb-icon-button>
{% enddemo %}

## Watch out for

- Do not restyle the state layer colors per screen. The opacities are part of
  the state, so keep them as they are.
- Do not tell people to "hover to see" an action. Show it, or give it a
  visible label.
- Keep focus visible. The focus layer is not a replacement for the focus ring.
