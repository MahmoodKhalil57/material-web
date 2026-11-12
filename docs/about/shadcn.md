---
title: Use with shadcn/ui
section: about
order: 11
icon: deployed_code
description: Install the md-gb elements as React components with the shadcn CLI, themed by your shadcn variables.
---

## What you get

This site is a [shadcn registry](https://ui.shadcn.com/docs/registry) at
`/3.0/r/`. `npx shadcn@latest add` copies a file into your project, adds the
npm dependencies, and merges the theme:

*   **A React wrapper per component family**, such as `md-button` or `md-menu`
    (a menu with its group and item). The file is
    `components/ui/md-<name>.tsx`. It registers the `md-gb-*` elements and wraps
    each one with [`@lit/react`](https://lit.dev/docs/frameworks/react/):
    typed props from the element class, and the events as `onChange`,
    `onClose` and so on.
*   **`md-theme`**, installed with every item: it loads the M3 styles and maps
    your shadcn variables to the M3 color and shape roles.
*   **`md-theme-m3`**, optional: the reverse, the M3 baseline as shadcn
    variables, so shadcn components match the md-gb elements.

The registry lists every item in
[`registry.json`](https://material-web.dev/3.0/r/registry.json).

## Add a component

The plain URL form needs no setup:

```sh
npx shadcn@latest add https://material-web.dev/3.0/r/md-button.json
```

To use the short form, add the registry to `components.json` once. The keys of
`registries` start with `@`, and `{name}` is the item:

```json
{
  "registries": {
    "@material-web": "https://material-web.dev/3.0/r/{name}.json"
  }
}
```

```sh
npx shadcn@latest add @material-web/md-button @material-web/md-menu
```

The command installs `@material/web` and `@lit/react` with your package
manager. Each component page has this command after its first example.

Use the component like any other. The JSON and TSX blocks on this page are
plain blocks and not live demos: the TSX needs React, which this page does not
load, and the JSON is configuration with no visible effect.

```tsx
import {MdButton} from '@/components/ui/md-button';
import {MdMenu, MdMenuItem} from '@/components/ui/md-menu';

export function Actions() {
  return (
    <>
      <MdButton color="filled" popoverTarget="file-menu">
        File
      </MdButton>
      <MdMenu id="file-menu">
        <MdMenuItem onChange={(event) => console.log(event.type)}>Open</MdMenuItem>
      </MdMenu>
    </>
  );
}
```

## The theme bridge

`md-theme` adds `@import "@material/web/styles/m3.css"` to your global
CSS, then declares the `--md-sys-*` variables in `:root` and in `.dark` from
your shadcn variables. The M3 styles are in a cascade layer and the bridge is
not, so the bridge wins regardless of the order of the imports. Change your
shadcn theme, or toggle `.dark`, and the elements follow. It also sets
`color-scheme` for `:root` and `.dark`.

Containers stay with their `on-` colors: each pair maps to a pair that shadcn
already keeps readable together. The *-fixed roles, `scrim` and `shadow` keep
the M3 baseline.

{% shadcnmap %}

shadcn has no tertiary role, so it follows primary. `outline` is the muted
foreground and not `--border`, because M3 needs 3:1 against the surface for the
outline of a field or an outlined button; `--border` is the `outline-variant`
(dividers).

### Match shadcn to the M3 baseline

`md-theme-m3` goes the other way. It writes the baseline colors of M3 (light
and dark) into the shadcn variables:

```sh
npx shadcn@latest add https://material-web.dev/3.0/r/md-theme-m3.json
```

{% shadcnreverse %}

It is independent of `md-theme`. With both installed, the bridge points the M3
roles at shadcn variables that now hold the M3 colors, so the two agree.

## Bundler setup

The elements import their styles as CSS module scripts
(`import styles from './menu.css' with {type: 'css'}`). Browsers support that,
but Vite, webpack and Node do not without help, and the build fails with
`"default" is not exported by "…/focus-ring.css"`. Every stylesheet ships next
to a Lit `CSSResult` module (`menu.cssresult.js`), so a one-time plugin that
points the imports there is enough. For Vite (a plain block; it is
configuration with no visible effect):

```ts
// vite.config.ts
import {defineConfig, type Plugin} from 'vite';

function mdGbCssModules(): Plugin {
  return {
    name: 'md-gb-css-modules',
    enforce: 'pre',
    transform(code, id) {
      if (!/[\\/]@material[\\/]web[\\/]/.test(id) || !id.endsWith('.js')) return;
      return code.replace(
        /import\s+(\w+)\s+from\s+'(\.[^']*)\.css'\s+with\s*\{\s*type:\s*'css'\s*\};?/g,
        "import {styles as $1} from '$2.cssresult.js';",
      );
    },
  };
}

export default defineConfig({
  plugins: [mdGbCssModules() /* , react(), tailwindcss() */],
  optimizeDeps: {exclude: ['@material/web']},
});
```

## Limits

*   **Tailwind classes style only the host.** The elements use shadow DOM, so
    `className="bg-red-500"` colors the `<md-gb-button>` box, not its inside.
    Customize with the `--md-*` custom properties and `::part()` selectors
    listed in each component's API reference. They work in a plain CSS file or in
    Tailwind's arbitrary properties, such as `[--container-color:red]`.
*   **Client only.** The wrappers start with `'use client'`, and the elements
    cannot be imported in Node (they use CSS module scripts, `customElements`
    and `document`). In Next.js the server renders client components too, so
    import the file with
    `next/dynamic(() => import('...'), {ssr: false})` or render it after mount,
    unless you set up [Lit SSR](https://lit.dev/docs/ssr/overview/).
*   **Package.** The elements come from `@material/web/`. The registry
    keeps `@material/web` as the dependency, and the path needs a version that
    ships Material Web 3.0.
*   **Typography, motion and icons** are not bridged. Load the Material
    Symbols font as in the [quick start](/3.0/about/quick-start/).
*   **Local testing.** When this site runs from the dev server the registry
    files point to `http://localhost:8000`. Set `MWC_REGISTRY_URL` to build
    them for another origin.

The registry files are generated by `scripts/m3/gb-shadcn.mjs` from the element
sources, so the props and events match the API reference. For agents, the same
information is in [`llms.txt`](/3.0/llms.txt) and
[`custom-elements.json`](/3.0/custom-elements.json).
