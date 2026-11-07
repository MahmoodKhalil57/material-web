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

Use any one of these. The flag is read once, on first use, so set it before you
interact with the components:

- Add `?md-gb-perf` to the page address and load it.
- Set it in the console, then reload:

  ```js
  localStorage.setItem('md-gb-perf', '1');
  ```

- Set it before any component runs:

  ```js
  globalThis.MD_GB_DEBUG_PERF = true;
  ```

Any value of the `localStorage` key turns the marks on, even `0`. To turn them
off again, remove the key with `localStorage.removeItem('md-gb-perf')` and
reload.

## Record a trace

Open the Performance panel, start a recording, use the component, and stop it.
Look for the `md-gb` track. Each span is also a `performance.measure()` entry, so
`performance.getEntriesByType('measure')` lists them.

When the flag is off, each call costs one boolean check and allocates nothing,
so the marks cost nothing in normal use.
