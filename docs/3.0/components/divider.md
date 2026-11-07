---
title: Divider
section: components
order: 11
description: A divider is a thin line that groups content in lists and containers.
---
{% demo "A divider between two paragraphs" %}
<p>Your order has shipped.</p>
<md-gb-divider></md-gb-divider>
<p>Delivery is expected on Friday.</p>
{% enddemo %}

## Usage guidelines

*   **Group and create hierarchy.** Dividers visually group components and can imply a parent and child relationship.
*   **Full width for sections.** Use [full-width](#insets) dividers to separate larger sections of unrelated content.
*   **Inset for related items.** Use [inset dividers](#insets) to separate related content within a section, such as items in a list.
*   **Don't overuse.** Spacing and type styles often separate content well enough on their own.

## Anatomy

A divider is a single element.

```html
<md-gb-divider></md-gb-divider>
```

## Examples

### Insets

Add `inset` to indent both ends by 16dp. Use `inset-start` or `inset-end` to indent only one end.

{% demo "A full-width divider, a start-inset divider and a middle-inset divider" %}
<md-gb-divider></md-gb-divider>
<md-gb-divider inset-start></md-gb-divider>
<md-gb-divider inset></md-gb-divider>
{% enddemo %}

### Vertical

Add `vertical` for a divider between side-by-side content.

{% demo "A vertical divider between two labels" %}
<div style="display: flex; align-items: center; gap: 8px">
  <span>Day</span>
  <md-gb-divider vertical></md-gb-divider>
  <span>Week</span>
</div>
{% enddemo %}

### Class API

For plain HTML, the `divider()` class function styles a native `<hr>`. Pass `{vertical: true}` for a vertical divider.

```js
import {divider} from '@material/web/labs/gb/components/divider/divider.js';

const classes = divider({vertical: true});
```

## Accessibility

*   A divider is decorative and not announced by assistive technology. It has no contrast minimum.
*   Add `role="separator"` to a divider that should be announced.

```html
<md-gb-divider role="separator"></md-gb-divider>
```

## API reference

{% gbapi "divider" %}
