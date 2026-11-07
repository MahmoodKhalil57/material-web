---
title: Progress indicators
section: components
order: 21
description: Progress indicators inform users about the status of ongoing processes, such as loading an app or submitting a form.
---
There are two types of progress indicators: linear and circular.

<img
    src="/components/images/progress/hero.webp"
    alt="Circular and linear progress indicators showing indetermine and determinate examples"
    title="Progress indicators can be used to show indeterminate or determinate progress.">

*   [Design article](https://m3.material.io/components/progress-indicators)

*   [API Documentation](#api)
*   [Source code](https://github.com/material-components/material-web/tree/main/progress)

## Types

1.  [Circular progress](#circular-progress)
1.  [Linear progress](#linear-progress)

## Interactive Demo

{% playgroundexample dirname="gb-progress", id="project-gb" %}

## Usage

Progress indicators may be determinate to show progress, or indeterminate for an
unspecified amount of progress.

{% demo "Two circular and linear progress indicator examples, one with three quarters of the track full
and the other
indeterminate." %}
<md-gb-progress value="0.75" circular></md-gb-progress>
<md-gb-progress circular></md-gb-progress>

<md-gb-progress></md-gb-progress>
<md-gb-progress value="0.5"></md-gb-progress>
{% enddemo %}

### Four colors

Indeterminate progress indicators may cycle between four colors (primary,
primary container, tertiary, and tertiary container by default).

{% demo "Indeterminate progress indicators that cycles between four colors." %}
<md-gb-progress circular></md-gb-progress>
<md-gb-progress></md-gb-progress>
{% enddemo %}

## Accessibility

Add an
[`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label)
attribute to progress indicators to give them a descriptive name.

```html
<md-gb-progress value="0.5" aria-label="Page refresh progress" circular></md-gb-progress>

<md-gb-progress value="0.5" aria-label="Download progress"></md-gb-progress>
```

## Circular progress

Circular progress indicators display progress by animating along an invisible
circular track in a clockwise direction.

{% demo "An indeterminate and determinate circular progress indicator." %}
<md-gb-progress circular></md-gb-progress>
<md-gb-progress value="0.6" circular></md-gb-progress>
{% enddemo %}

## Linear progress

Linear progress indicators display progress by animating along the length of a
fixed, visible track.

{% demo "An indeterminate and determinate linear progress indicator." %}
<md-gb-progress></md-gb-progress>
<md-gb-progress value="0.6"></md-gb-progress>
{% enddemo %}

### Buffer

Linear progress indicators may show a buffer to communicate both determinate and
indeterminate progress. The progress bar and track represent known progress
while the buffer dots represent unknown progress.

{% demo "A linear progress indicator with partial progress and an indeterminate buffer." %}
<md-gb-progress value="0.5"></md-gb-progress>
{% enddemo %}

## API

{% gbapi "progress" %}
