# Component page template

This file is the template for the pages in `docs/3.0/components/`. It is not
published (`copyGbDocs` in `scripts/catalog-dev.mjs` leaves it out). The
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
    `demo/stories.ts` (ids are in `catalog/_dev-gb/examples.json`: the
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
7.  **JS or CSS** goes in a separate small fenced block (`js` or `css`) under
    the card: imports plus the 1 to 5 lines that matter, no framework setup.
    A demo that needs script gets the same script as a raw
    `<script type="module">` after the card so it works live.
8.  **Anatomy blocks** contain tags and slot names only.
