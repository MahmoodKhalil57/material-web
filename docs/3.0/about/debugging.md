---
title: Debugging
section: about
order: 10
description: The shared plumbing of the components (motion waits, overflow measure passes, and scroll steps) can record performance marks.
---

## Performance track

The shared plumbing of the components (motion waits, overflow measure passes,
and scroll steps) can record performance marks. They show up in the Chrome
DevTools Performance panel as a custom track named `md-gb`, in the group
`Material`. The marks are off by default.

## Turn them on

The flag is read once, on first use, so set it before you interact with the
components. Use any one of these:

- Add `?md-gb-perf` to the page address and load it.
- Set the flag in the console, then reload. Any value turns the marks on, even
  `0`. Remove the key to turn them off (the first sample below).
- Set `globalThis.MD_GB_DEBUG_PERF = true` before any component runs (the
  second sample below).

{% demo "Turn the flag on and off in local storage" height=160 %}
```html
<md-gb-button id="on" color="tonal">Turn on</md-gb-button>
<md-gb-button id="off" color="tonal">Turn off</md-gb-button>
<output id="state" aria-live="polite"></output>
```
```js
const state = document.querySelector('#state');
const show = () => {
  state.textContent = localStorage.getItem('md-gb-perf') === null ? 'Off' : 'On';
};

document.querySelector('#on').addEventListener('click', () => {
  localStorage.setItem('md-gb-perf', '1');
  show();
});
document.querySelector('#off').addEventListener('click', () => {
  localStorage.removeItem('md-gb-perf');
  show();
});
show();
```
{% enddemo %}

{% demo "Turn the flag on before the components run" height=160 %}
```html
<md-gb-button id="read" color="tonal">Read measures</md-gb-button>
<output id="measures" aria-live="polite"></output>
```
```js
globalThis.MD_GB_DEBUG_PERF = true;

document.querySelector('#read').addEventListener('click', () => {
  document.querySelector('#measures').textContent =
    `${performance.getEntriesByType('measure').length} measures`;
});
```
{% enddemo %}

## Record a trace

Open the Performance panel, start a recording, use the component, and stop it.
Look for the `md-gb` track. Each span is also a `performance.measure()` entry:

{% demo "The measures recorded so far" height=160 %}
```html
<md-gb-button id="list" color="tonal">List measures</md-gb-button>
<output id="names" aria-live="polite"></output>
```
```js
document.querySelector('#list').addEventListener('click', () => {
  const measures = performance.getEntriesByType('measure');
  document.querySelector('#names').textContent = measures.length
    ? measures.map((m) => m.name).join(', ')
    : 'No measures yet';
});
```
{% enddemo %}

When the flag is off, each call costs one boolean check and allocates nothing.
