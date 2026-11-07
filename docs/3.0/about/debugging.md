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
  `0`. Remove the key to turn them off:

  ```js
  localStorage.setItem('md-gb-perf', '1');
  localStorage.removeItem('md-gb-perf');
  ```

- Set it before any component runs:

  ```js
  globalThis.MD_GB_DEBUG_PERF = true;
  ```

## Record a trace

Open the Performance panel, start a recording, use the component, and stop it.
Look for the `md-gb` track. Each span is also a `performance.measure()` entry:

```js
performance.getEntriesByType('measure');
```

When the flag is off, each call costs one boolean check and allocates nothing.
