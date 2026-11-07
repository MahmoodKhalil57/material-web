---
title: Shape
section: styles
order: 4
description: Shape can direct attention, communicate state, and express brand.
---
## Shape

M3 Expressive uses a
[corner radius scale](https://m3.material.io/styles/shape/corner-radius-scale)
from straight to fully round, with larger steps, "increased" values, and shape
morphing between states.

### Tokens

Tokens follow the naming convention `--md-sys-shape-corner-<step>`.

Shape  | Token
------ | -----------------------------------
Corner | `--md-sys-shape-corner-none`
&nbsp; | `--md-sys-shape-corner-xs`
&nbsp; | `--md-sys-shape-corner-sm`
&nbsp; | `--md-sys-shape-corner-md`
&nbsp; | `--md-sys-shape-corner-lg`, `-lg-increased`
&nbsp; | `--md-sys-shape-corner-xl`, `-xl-increased`
&nbsp; | `--md-sys-shape-corner-xxl`
&nbsp; | `--md-sys-shape-corner-full`

Steps also come in asymmetric variants (`-xs-top`, `-lg-top`, `-lg-start`,
`-lg-end`, `-xl-top`) and as single values
(`--md-sys-shape-corner-value-<step>`). Each step also has one token per corner,
such as `--md-sys-shape-corner-md-start-end`, which defaults to the step's
all-corner token; override one to shape a single corner.

`--md-sys-shape-corner-full` is `50cqmin` (half the shorter side of the nearest
size container), so it rounds fully only inside a container. Components that
animate through "full" set it to half their own height.

{% demo "A box with medium corners and one square corner" %}
```html
<div class="box">Medium corners</div>
```
```css
:root {
  --md-sys-shape-corner-md: 12px;
  --md-sys-shape-corner-md-start-end: 0;
}

.box {
  padding: 24px 32px;
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  border-start-start-radius: var(--md-sys-shape-corner-md-start-start);
  border-start-end-radius: var(--md-sys-shape-corner-md-start-end);
  border-end-end-radius: var(--md-sys-shape-corner-md-end-end);
  border-end-start-radius: var(--md-sys-shape-corner-md-end-start);
}
```
{% enddemo %}

Set `data-shape-family="cut"` on `<html>` to cut corners in browsers that
support `corner-shape`.
