# Component page template

This file is the template for the pages in `docs/components/`. It is not
published (`copyGbDocs` in `scripts/catalog-dev.mjs` leaves out every
README). Each section's `README.md` is its index page's text instead: the
title, rail icon, order and meta description in its front matter, the
intro paragraph as its text, and, for Components, the groups a page's
`category` names. The
references to follow are `components/button.md`, `chip.md` and
`navigation-drawer.md`. The page is laid out like
[Base UI](https://base-ui.com/react/components/navigation-menu): the same
skeleton on every page, short and plain.

## Skeleton

````md
---
title: Things                # H1, rendered by the layout
section: components
order: 20
description: One sentence about what the component is for.   # rendered under the H1
---
{% gbexample "dir/story" %}        <!-- Hero: the most representative demo, no heading -->

## Usage guidelines              <!-- Optional: only with real M3 guidance -->

*   **Lead-in.** One sentence, linking to an [example](#example-name) below.

## Anatomy

One sentence about the parts.

```html
<md-gb-thing>
  <md-gb-icon slot="icon"></md-gb-icon>
  …
</md-gb-thing>
```

## Examples

### Example name

One or two sentences, then one demo card.

{% gbexample "dir/story" %}

## Accessibility

*   Labels, keyboard, roles (M3 first, then WAI-ARIA).

## API reference

{% gbapi "dir" %}
````

## Rules

1.  **Hero.** One demo card right after the front matter, no heading, no
    "Interactive Demo" section. Do not use `{% playgroundexample %}`.
2.  **Usage guidelines.** Optional, at most about five bullets with bold
    lead-ins. Paraphrase the existing M3 guidance; do not invent any. Skip the
    section when there is nothing to say. Do not repeat what an example
    already says.
3.  **Anatomy.** One sentence and an `html` block with the element tree: tags
    and `slot` names only, no other attributes, `…` for repeated children.
4.  **Examples.** Each is an `### H3`, one or two sentences and one demo card.
    Fold types, variants, sizes, states and icons into this list. Don't repeat
    the hero as an example.
5.  **Accessibility.** Short bullets: labels, keyboard, roles, and the
    soft-disabled note where it applies.
6.  **API reference.** Only `{% gbapi "dir" %}`; it is generated (see
    `scripts/m3/gen-api-docs.mjs`): per element a `### <md-gb-x>`, a line
    about it, and `####` tables for properties, slots, events, methods, CSS
    parts and CSS custom properties.
7.  The outline ("On this page") lists the H2 and H3 headings, so use `####`
    only for table titles. Don't add other H2s.

## Demo cards

*   `{% gbexample "dir/story" %}` uses a story from the component's
    `demo/stories.ts` (ids are in `site/_dev-gb/examples.json`: the
    directory and the slugified story name). Prefer it when a story fits.
*   `{% demo "Accessible label" %}html{% enddemo %}` shows HTML written once
    as the preview and the code. Use `md-gb-*` elements and Material Symbols
    ligatures (`<md-gb-icon>send</md-gb-icon>`); no other attributes than the
    ones an author needs.
*   Do not repeat a demo you already used on the page.

## Code samples

The code in a demo card and in code blocks is reference code that people copy,
so keep it simple and best practice.

1.  **One concept per example.** The smallest markup that shows it, roughly 3
    to 15 lines.
2.  **Stories only when short.** Use `{% gbexample %}` only if its captured code
    is short and focused. If the story is a gallery (several components,
    headings, demo art, more than about 20 lines), write a `{% demo %}` with
    minimal hand-written markup.
3.  **No scaffolding.** No layout wrappers, no headings or hint text inside the
    example, no decorative inline styles, no placeholder art, no external
    images.
4.  **Only needed attributes.** Leave out defaults and write booleans bare
    (`disabled`, not `disabled=""`).
5.  **Accessibility is part of the example.** Icon-only controls get
    `aria-label`, and groups get a label. Never use `data-aria-label`.
6.  **Realistic labels** such as "Save", "Back" or "Inbox", never "Label" or
    "Lorem ipsum".
7.  **JS, TS or CSS** goes in the same demo as a fenced block (see "Demo
    syntax"): imports plus the 1 to 5 lines that matter, no framework setup.
    Never add a raw `<script>` after the card.
8.  **Anatomy blocks** are a live minimal instance of the component in a demo:
    valid markup with the parts and slots, real short content (not empty
    tags). Components that need to be opened (dialog, menu) use `frame=true`
    and the `open` attribute, or a short script.

## Demo syntax

Every code block on a page except shell (`sh`, `bash`) is a demo file: it
shows what the code does, not only the code. A standalone snippet gets the
minimal html that makes its effect visible (a CSS block gets the element it
styles, a TS block the element it changes or an `<output>` for a result).

````md
{% demo "Accessible label" height=240 %}
```html
<md-gb-button id="open">Open</md-gb-button>
```
```css
md-gb-button { margin: 8px; }
```
```ts
import '@material/web/styles/color/dynamic-color.js';
document.querySelector('#open')!.addEventListener('click', () => {});
```
{% enddemo %}
````

*   Plain html without fences still works (one file, no tabs). Otherwise one
    fenced block each of `html`, `css`, and `ts` or `js`; the code area gets
    one tab per file (HTML, CSS, TS or JS).
*   **html + css only:** the preview is inline (light DOM, so md-gb elements
    and the page theme work). The css is scoped to the preview with `@scope`:
    `:root`, `html` and `body` select the preview itself, and `@import` of
    `@material/web/...` is rewritten to the library server.
*   **With ts or js** (or `frame=true`): the preview is an iframe
    (`srcdoc`, `loading="lazy"`) so the script can use `document`. It gets
    `m3.css`, the page's theme (kept in sync), the md-gb elements the html
    uses, and an import map, so write real imports:
    `@material/web/...`. TS is only type-stripped. Errors show as
    small text in the preview.
*   **height:** (px) set it for every demo with a script and whenever the
    preview is taller than 12rem: it is reserved before load so nothing
    moves, and the iframe only grows beyond it. Dialogs, menus and other
    overlays need about 360. Always set it on a hero with a script.
*   Arguments come after the label, `name=value`, separated by spaces.
*   Ids in a demo are local to it (each iframe is its own document), so the
    same ids can repeat on a page. Inline demos share the page: keep ids and
    class names distinct.
