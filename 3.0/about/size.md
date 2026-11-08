# Bundle Sizes

Every md-gb- component is checked against a Brotli-compressed size budget for its JavaScript and CSS (the measured size plus 10% headroom), defined in scripts/size/gb-budgets.json.

Every `md-gb-*` component is checked against a Brotli-compressed size budget
for its JavaScript and CSS (the measured size plus 10% headroom), defined in
`scripts/size/gb-budgets.json`. For example, `md-gb-button` stays within about
4.8 KB of JavaScript and 1.5 KB of CSS, and `md-gb-badge` within about 1 KB and
0.5 KB. Import only the components you use to keep your bundle small.
