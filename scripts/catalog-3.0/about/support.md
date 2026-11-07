## Browsers

Version 3.0 targets **Baseline widely available**: the web platform features it
uses have worked in all major browsers for at least 30 months. Newer features
(such as `corner-shape` or `light-dark()`) are only used behind `@supports`
guards or with a fallback, so components stay usable in older engines. The
repository checks this with `npm run gb:baseline`.

In practice that means the current releases of Chrome, Edge, Firefox, and
Safari, plus the previous releases that predate the widely available cutoff.
