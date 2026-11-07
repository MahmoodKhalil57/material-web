---
title: Transitions
section: styles
order: 9
description: "Transition patterns connect elements and views, and skeleton loaders hold space while content loads."
---
The six transition patterns (container transform, forward and backward,
lateral, top level, enter and exit, and skeleton loaders) are helper functions
and classes. See [Motion](/3.0/styles/motion/#transitions) for the helpers.

## Skeleton loaders

A skeleton hints at where content will appear and holds its space while it
loads. Set `loading` and clear it when the content is ready.

{% demo "A text skeleton and a skeleton that holds a paragraph" %}
<md-gb-skeleton loading shape="text"></md-gb-skeleton>
<md-gb-skeleton loading>
  <p>Content that loads.</p>
</md-gb-skeleton>
{% enddemo %}

```js
import '@material/web/labs/gb/styles/motion/transitions/md-gb-skeleton.js';

document.querySelector('md-gb-skeleton').loading = false;
```
