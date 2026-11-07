---
name: Motion
title: Motion
order: 5
expressiveOnly: true
---

# Motion

Material 3 Expressive uses a physics-based motion system. Springs drive
spatial motion (movement, size, shape) and effects springs drive fades and
color. Each spring is exposed as a CSS `linear()` easing with a matching
duration, so a transition can use it directly.

The system has two motion schemes:

- **Expressive** is the default, and should be used for most situations,
  especially hero moments and key interactions.
- **Standard** has no overshoot, so it moves without the bounce of the
  expressive scheme. Apply it to a subtree with the `md-motion-standard`
  class.

## Tokens

Spring tokens follow `--md-sys-motion-spring-<speed>-<spatial|effects>`, with
`fast`, `default` and `slow` speeds. Each has a `-duration` token:

```css
.panel {
  transition: translate var(--md-sys-motion-spring-default-spatial-duration)
    var(--md-sys-motion-spring-default-spatial);
}
```

In the Expressive scheme, the spatial durations are 350ms (fast), 420ms
(default) and 570ms (slow). The effects durations are 140ms, 220ms and 300ms.

Use the standard scheme for a whole subtree:

```html
<section class="md-motion-standard">
  <md-gb-button>Save</md-gb-button>
</section>
```

## Reduced motion

Reduced motion is on when the platform asks for it
(`prefers-reduced-motion: reduce`) or inside an element with the
`md-motion-reduced` class. In that case the spatial springs become instant
(0ms), and the effects springs keep their timing. People still see fades and
color changes, but not sliding, scaling, parallax or shape morphing.

```html
<div class="md-motion-reduced">
  <!-- Spatial motion is off here, fades stay. -->
</div>
```

Do not build your own motion gate. Read the durations from the tokens so the
scheme and reduced motion apply without extra code.

## Shape morphing

Buttons and icon buttons (`md-gb-button`, `md-gb-icon-button`) morph their
shape when pressed and when selected. That is spatial motion, so reduced
motion turns it off and keeps the color change.

## Component authors

Components that script their motion use the helpers in
`labs/gb/components/shared/motion.ts`:

- `springDuration(element, speed, kind)` returns the duration of a spring in
  milliseconds, already 0 for spatial springs when motion is reduced.
- `isReducedMotion(element)` and `onReducedMotionChange(...)` follow the
  setting, including inside `.md-motion-reduced`.
- `waitForMotion(...)` resolves when the animations end or when its timeout
  runs out, so waiting never hangs.

## Watch out for

- Keep most of a product on one scheme. Switch schemes only for a few key
  moments, and do it on purpose.
- Do not use motion to carry meaning on its own. Reduced motion removes it,
  so pair it with a change people can see without motion.
