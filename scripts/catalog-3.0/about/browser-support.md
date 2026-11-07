---
name: Browser support
title: Browser support
order: 6
expressiveOnly: true
---

## Targets

Version 3.0 only uses web platform features that are Baseline widely available.
The oldest browsers the build checks against are:

| Browser    | Minimum version |
| ---------- | --------------- |
| Chrome     | 124             |
| Edge       | 124             |
| Firefox    | 125             |
| Safari     | 17.4            |
| iOS Safari | 17.4            |

`node scripts/gb-css-validate.mjs` prints these values, and the CSS is compiled
against them. They move as Baseline moves, so rerun the script to see the
current numbers.

## Features behind a fallback

Newer features are either guarded with `@supports` or allowed to be ignored
where a browser lacks them. The exceptions are listed, with the reason for each,
in `scripts/gb-baseline-allow.json`. In short:

- `field-sizing`: a textarea keeps its fixed rows and scrolls.
- `interpolate-size`: size changes to intrinsic keywords jump instead of
  animating.
- `starting-style`: an element appears without its enter transition.
- `transition-behavior`: discrete properties change at once.
- `scrollbar-gutter`: no reserved gutter, so a small layout shift when a
  scrollbar appears.
- `overscroll-behavior`: scroll chaining at the edge is not contained.
- `view-transitions`: the view transition styles never match.
- `container-scroll-state-queries`: the app bar does not switch to its stuck
  look.
- `forced-colors`: ignored where forced colors mode does not exist (Safari).

Guard your own newer CSS the same way, so older browsers keep a usable
fallback:

```css
.notes textarea {
  /* The fixed rows height is the fallback. */
}

@supports (field-sizing: content) {
  .notes textarea {
    field-sizing: content;
  }
}
```

## Check your own app

Test on the oldest version of each browser in the table, not only the current
release. To see which Baseline features the repository uses, run
`npm run gb:baseline`.
