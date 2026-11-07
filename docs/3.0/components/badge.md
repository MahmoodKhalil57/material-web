---
title: Badge
section: components
order: 2
description: A badge shows a small dot or a count to signal new or changed information.
---
{% demo "A dot badge, a badge with a count and a badge with a capped count" %}
<md-gb-badge></md-gb-badge>
<md-gb-badge>3</md-gb-badge>
<md-gb-badge>99+</md-gb-badge>
{% enddemo %}

## Usage guidelines

*   **Use a dot for something new.** A badge without content signals new or changed information.
*   **Use a count for a number.** A large badge shows a number, such as unread messages.
*   **Keep counts short.** Content is limited to four characters, including a `+`, so large numbers show as `999+`.
*   **Attach it to an icon.** [Anchor](#anchored) the badge to the top trailing corner of the icon it describes.

## Anatomy

A badge is a single element. Without content it is a dot; with content it is a larger badge.

{% demo "A badge with a count of 5" %}
<md-gb-badge>5</md-gb-badge>
{% enddemo %}

## Examples

### Count

Set `value` to show a number. Counts above `max` (999 by default) show as `max+`.

{% demo "A badge with a count over the maximum" %}
<md-gb-badge value="1200"></md-gb-badge>
{% enddemo %}

### Anchored

Add `anchored` to place the badge on the top trailing corner of its positioned parent.

{% demo "A bell icon with a count badge" %}
<span style="position: relative; display: inline-flex">
  <md-gb-icon>notifications</md-gb-icon>
  <md-gb-badge anchored>3</md-gb-badge>
</span>
{% enddemo %}

## Accessibility

*   A dot badge is announced with its `label`, which defaults to "New notification". Set it to match your content.
*   Place the badge after the label of the destination it belongs to, so it is read in that order.

## API reference

{% gbapi "badge" %}
