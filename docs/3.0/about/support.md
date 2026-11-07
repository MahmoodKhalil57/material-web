---
title: Support
section: about
order: 6
description: "Version 3.0 targets Baseline widely available: the web platform features it uses have worked in all major browsers for at least 30 months."
---

## Browsers

Version 3.0 targets **Baseline widely available**: the web platform features it
uses have worked in all major browsers for at least 30 months. Newer features
(such as `corner-shape` or `light-dark()`) are only used behind `@supports`
guards or with a fallback, so components stay usable in older engines. The
repository checks this with `npm run gb:baseline`. See
[Browser support](/3.0/about/browser-support/) for the minimum versions.

## FAQ

### How do I change the color of a button?

Components read `--md-sys-color-*` tokens. Override the key color a component
uses on the element or a class. Buttons use `primary`, and the states (hover,
focus, pressed) are derived from it.

```css
md-gb-button.danger {
  --md-sys-color-primary: var(--md-sys-color-error);
  --md-sys-color-on-primary: var(--md-sys-color-on-error);
}
```

### Why doesn't `prefers-color-scheme: dark` switch the theme?

The tokens use `light-dark()`, so they follow the `color-scheme` property. Set
it to follow the system, or force a scheme on any subtree.

```css
:root {
  color-scheme: light dark;
}

.always-dark {
  color-scheme: dark;
}
```

### How do I generate my own `--md-sys-color-*` tokens?

Generate a theme from a source color at runtime, or export a stylesheet.

```js
import {applyTheme} from '@material/web/labs/gb/styles/color/dynamic-color.js';

applyTheme(document, {source: '#006a6a'});
```

You can also design a scheme with the
[Material Theme Builder Figma plugin](https://www.figma.com/community/plugin/1034969338659738588/Material-Theme-Builder).
See [Color](/3.0/styles/color/).

### How do I style an element inside another component?

Use [CSS `::part()`](https://developer.mozilla.org/en-US/docs/Web/CSS/::part).
The parts of each component are listed under its CSS parts in the API
reference.
