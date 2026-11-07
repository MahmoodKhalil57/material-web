---
title: Loading indicator
section: components
order: 16
description: A loading indicator shows that a short process is running, with a shape that morphs through Material shapes while it turns.
---
{% demo "An indeterminate loading indicator" %}
<md-gb-loading-indicator aria-label="Loading"></md-gb-loading-indicator>
{% enddemo %}

## Usage guidelines

*   **Use it for short waits.** A loading indicator suits processes that finish in under five seconds, and replaces most uses of an indeterminate circular [progress indicator](/3.0/components/progress/).
*   **Reflect real work.** It always represents an ongoing process and is never only decorative.
*   **Don't switch to determinate.** Avoid it for processes that start indeterminate and later report progress; use a progress indicator there.
*   **Use it for refreshing.** A [pull to refresh](/3.0/components/pull-to-refresh/) container shows a contained loading indicator.

This component is new in [M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive).

## Anatomy

A loading indicator is one element: a shape, with an optional container behind it.

{% demo "A loading indicator" %}
<md-gb-loading-indicator aria-label="Loading"></md-gb-loading-indicator>
{% enddemo %}

## Examples

### Contained

Add `contained` to put the shape on a container, which helps it stand out over content.

{% demo "A contained loading indicator" %}
<md-gb-loading-indicator contained aria-label="Loading"></md-gb-loading-indicator>
{% enddemo %}

### Determinate

Set `value` from 0 to 1 to show progress. Without it, the indicator is indeterminate.

{% demo "A loading indicator at 40 percent" %}
<md-gb-loading-indicator value="0.4" aria-label="Downloading"></md-gb-loading-indicator>
{% enddemo %}

## Accessibility

*   The indicator is a `progressbar`, so give it an [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label) that says what is loading.
*   A determinate indicator exposes its value to assistive technology.
*   With reduced motion, the shape stops morphing and only turns slowly.

## API reference

{% gbapi "loadingindicator" %}
