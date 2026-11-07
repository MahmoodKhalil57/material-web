---
title: Material Symbols
section: styles
order: 7
icon: emoji_symbols
description: "md-gb-icon axes: optical size, weight, fill and grade."
---
Each variable font axis of `md-gb-icon` is a custom property. See
[Icons](/3.0/styles/icons/) for loading the font and the defaults.

{% demo "An icon imported by path" height=120 %}
```html
<md-gb-icon>star</md-gb-icon>
```
```js
import '@material/web/labs/gb/styles/icon/md-gb-icon.js';
```
{% enddemo %}

## Optical sizes

The optical size follows `--md-icon-size`, which supports 20, 24, 40 and 48px.

{% demo "Icons at 20, 24, 40 and 48 pixels" %}
<md-gb-icon style="--md-icon-size: 20px">star</md-gb-icon>
<md-gb-icon>star</md-gb-icon>
<md-gb-icon style="--md-icon-size: 40px">star</md-gb-icon>
<md-gb-icon style="--md-icon-size: 48px">star</md-gb-icon>
{% enddemo %}

## Weights

`--md-icon-wght` runs from 100 to 700.

{% demo "Icons at weights 200, 400 and 700" %}
<md-gb-icon style="--md-icon-wght: 200">star</md-gb-icon>
<md-gb-icon>star</md-gb-icon>
<md-gb-icon style="--md-icon-wght: 700">star</md-gb-icon>
{% enddemo %}

## Fill

`--md-icon-fill` is 0 (outlined) or 1 (filled), and the change animates.

{% demo "An outlined and a filled icon" %}
<md-gb-icon>favorite</md-gb-icon>
<md-gb-icon style="--md-icon-fill: 1">favorite</md-gb-icon>
{% enddemo %}

## Grades

`--md-icon-grad` adds emphasis when positive. It needs `GRAD` in the font
request.

{% demo "Icons at grades -25, 0 and 200" %}
<md-gb-icon style="--md-icon-grad: -25">star</md-gb-icon>
<md-gb-icon>star</md-gb-icon>
<md-gb-icon style="--md-icon-grad: 200">star</md-gb-icon>
{% enddemo %}
