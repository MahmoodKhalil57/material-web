---
title: Quick Start
section: about
order: 3
icon: rocket_launch
description: "For fast prototyping, use a CDN such as esm.run to load @material/web without installing it."
---

## CDN

For fast prototyping, use a CDN such as [esm.run](https://esm.run/) to load
`@material/web` without installing it. The M3 Expressive elements are under
`@material/web/labs/gb/`.

### One line

The quickest start is one script. `labs/gb/all.js` defines every `md-gb-*`
element and adopts the M3 styles into the page. It loads every component, so use
it for prototypes only. The import map is optional here; it lets you also import
single files by path later. The script tags have no visible effect, so they are
a plain block (Download & copy in the page tools menu copies them):

```html
<script type="importmap">
  {"imports": {"@material/web/": "https://esm.run/@material/web/"}}
</script>
<script type="module" src="https://esm.run/@material/web/labs/gb/all.js"></script>
```

The same module, imported from a script, with a button that needs no other setup:

{% demo "Every element from one import" height=120 %}
```html
<md-gb-button color="filled">Next</md-gb-button>
```
```js
import '@material/web/labs/gb/all.js';
```
{% enddemo %}

### Only what you use

To load only the elements a page uses, import each one. The import map resolves
the bare specifiers (it is the only part of this setup that has no visible
effect, so it is a plain block):

```html
<script type="importmap">
  {"imports": {"@material/web/": "https://esm.run/@material/web/"}}
</script>
```

{% demo "A button loaded from a module" height=120 %}
```html
<md-gb-button color="filled">Next</md-gb-button>
```
```js
import '@material/web/labs/gb/components/button/md-gb-button.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';

adoptStyles(document, [m3Styles]);
```
{% enddemo %}

For production, follow the [install](#install) and [build](#building) steps
below.

## Install

Install Material web components using [npm and node](https://nodejs.org).

```sh
npm install @material/web
```

## Import

Import each element from
`@material/web/labs/gb/components/<component>/md-gb-<component>.js`, and load
the design tokens once with `adoptStyles()`.

{% demo "A button and a checkbox imported by path" height=140 %}
```html
<label>
  Material 3 Expressive
  <md-gb-checkbox checked></md-gb-checkbox>
</label>
<md-gb-button color="filled">Next</md-gb-button>
```
```js
import '@material/web/labs/gb/components/button/md-gb-button.js';
import '@material/web/labs/gb/components/checkbox/md-gb-checkbox.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';

adoptStyles(document, [m3Styles]);
```
{% enddemo %}

## Usage

Use the `<md-gb-component>` tag in HTML markup. Each component page, such as
[Button](/3.0/components/button/), has more guidance.

{% demo "A checkbox with a label and two buttons" %}
<label>
  Material 3 Expressive
  <md-gb-checkbox checked></md-gb-checkbox>
</label>
<md-gb-button color="outlined">Back</md-gb-button>
<md-gb-button color="filled">Next</md-gb-button>
{% enddemo %}

## Building

Bare module specifiers such as `@material/web/...` need a tool to resolve them
until [import maps](https://github.com/WICG/import-maps) are adopted. For a
more in-depth guide, follow
[lit.dev's modern build for production](https://lit.dev/docs/tools/production/#modern-only-build).

### Rollup quick start

[Rollup](https://rollupjs.org/) with a plugin that resolves bare module
specifiers bundles the entrypoint into one file.

```sh
npm install rollup @rollup/plugin-node-resolve
npx rollup -p @rollup/plugin-node-resolve index.js -o bundle.js
```

```html
<script src="./bundle.js"></script>
```
