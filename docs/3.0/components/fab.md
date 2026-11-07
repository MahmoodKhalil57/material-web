---
title: Floating action button (FAB)
section: components
order: 13
description: FAB represents the most important action on a screen.
---

[FAB](https://m3.material.io/components/floating-action-button)
represents the most important action on a screen. It puts key actions within
reach.

[Extended FABs](https://m3.material.io/components/extended-fab) help people take
primary actions. They're wider than FABs to accommodate a text label and larger
target area.

![A phone showing a payment screen with a green filled button that says 'Make payment'](/components/images/fab/hero.webp)

*   Design articles
    *   [FAB](https://m3.material.io/components/floating-action-button)

    *   [Extended FAB](https://m3.material.io/components/extended-fab)

*   API Documentation (*coming soon*)
*   [Source code](https://github.com/material-components/material-web/tree/main/fab)

## Interactive Demo

{% playgroundexample dirname="gb-fab", id="project-gb" %}

## Types

<figure class="types-image gb-demo-figure" style="justify-content:center;" title="There are three sizes of floating action buttons: FAB, small FAB, and large FAB" aria-label="The 3 sizes of FAB">
    <style>
      .types-image .wrapper,
      .types-image .wrapper > * {
        display: flex;
        padding: 8px;
        flex-wrap: wrap;
        justify-content: center;
      }
      .types-image .wrapper > * {
        flex-direction: column;
        align-items: center;
        padding-inline: 16px;
      }
      .types-image span {
        display: inline-flex;
        background-color: var(--md-sys-color-inverse-surface);
        color: var(--md-sys-color-inverse-on-surface);
        padding: 8px;
        margin-block-start: 8px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        justify-content: center;
        align-items: center;
      }
      .types-image .fab-wrapper {
        height: 96px;
        display: flex;
        align-items: center;
      }
    </style>
    <div class="wrapper">
      <div>
        <div class="fab-wrapper">
          <md-gb-fab aria-label="Accessibility" color="primary-container"><md-gb-icon>accessible_forward</md-gb-icon>
          </md-gb-fab>
        </div>
        <span>1</span>
      </div>
      <div>
        <div class="fab-wrapper">
          <md-gb-fab aria-label="Edit" color="tertiary-container"><md-gb-icon>edit</md-gb-icon>
          </md-gb-fab>
        </div>
        <span>2</span>
      </div>
      <div>
        <div class="fab-wrapper">
          <md-gb-fab aria-label="Color Palette" size="lg"><md-gb-icon>palette</md-gb-icon>
          </md-gb-fab>
        </div>
        <span>3</span>
      </div>
    </div>
  </figure>

1.  [FAB](#fab)
2.  [Small FAB](#sizes)
3.  [Large FAB](#sizes)

### Extended FAB

<figure class="types-image gb-demo-figure" style="justify-content:center;" title="There are two types of extended FABs with and without icon" aria-label="2 examples of extended FABs">
    <div class="wrapper">
      <div>
        <div class="fab-wrapper">
          <md-gb-fab color="primary-container"><md-gb-icon>navigation</md-gb-icon>
          navigate</md-gb-fab>
        </div>
        <span>1</span>
      </div>
      <div>
        <div class="fab-wrapper">
          <md-gb-fab>
          reroute</md-gb-fab>
        </div>
        <span>2</span>
      </div>
    </div>
  </figure>

*   [Extended FAB with both icon and label text](#extended)
*   [API Documentation](#api)
*   [Extended FAB without icon](#without-icon)

## Usage

FABs should have an icon, such as a font `md-icon`, an `svg`, or an `img`.

{% demo "A standard surface fab" %}
<md-gb-fab aria-label="Edit"><md-gb-icon>edit</md-gb-icon>

</md-gb-fab>
{% enddemo %}

### Lowered

FABs can be set to a lower elevation with the `lowered` attribute.

{% demo "A standard fab with an edit icon and lowered in elevation" %}
<md-gb-fab aria-label="Edit"><md-gb-icon>edit</md-gb-icon>

</md-gb-fab>
{% enddemo %}

## Accessibility

Icon-only FABs must include an `aria-label` that describes its action. Otherwise
if `aria-label` is not provided, the FAB will default to announcing its visible
contents.

```html
<md-gb-fab aria-label="Edit"><md-gb-icon>edit</md-gb-icon>

</md-gb-fab>
```

Extended FABs use their `label` for accessibility. Add an `aria-label` for
additional context if needed. By supplying the `label` attribute, the extended
FAB will make sure that the icon is not announced.

```html
<md-gb-fab aria-label="Edit Comment"><md-gb-icon>edit</md-gb-icon>

Edit</md-gb-fab>
```

## FAB

FABs should display a clear and understandable icon.

{% demo "A standard surface fab" %}
<md-gb-fab aria-label="Edit"><md-gb-icon>edit</md-gb-icon>

</md-gb-fab>
{% enddemo %}

### Extended

FABs may be extended with a label for additional emphasis. Extended FABs can
omit their icon.

{% demo "An extended FAB with an edit icon and the visible text edit" %}
<md-gb-fab><md-gb-icon>edit</md-gb-icon>

Edit</md-gb-fab>
{% enddemo %}

#### Without icon

Extended FABs are the only FABs that can be used without an icon.

{% demo "An extended FAB with a visible label saying reroute" %}
<md-gb-fab>Reroute</md-gb-fab>
{% enddemo %}

### Colors

FAB colors may be changed with the `variant` attribute. It can be set to
"surface" (default), "primary", "secondary", or "tertiary".

{% demo "Three fabs with edit icons next to each other but the first is primary colored, second is secondary, and the last is tertiary colored." %}
<md-gb-fab aria-label="Edit" color="primary-container"><md-gb-icon>edit</md-gb-icon>

</md-gb-fab>
<md-gb-fab aria-label="Edit" color="secondary-container"><md-gb-icon>edit</md-gb-icon>

</md-gb-fab>
<md-gb-fab aria-label="Edit" color="tertiary-container"><md-gb-icon>edit</md-gb-icon>

</md-gb-fab>
{% enddemo %}

### Sizes

FABs may be small, medium (default), or large by setting the `size` attribute.
Small FABs can optionally further reduce their touch target.

{% demo "Four surface fabs side by side with edit icons of visual size size small, small, medium, and large" %}
<md-gb-fab touch-target="none" aria-label="Edit"><md-gb-icon>edit</md-gb-icon>

</md-gb-fab>
<md-gb-fab aria-label="Edit"><md-gb-icon>edit</md-gb-icon>

</md-gb-fab>
<md-gb-fab aria-label="Edit"><md-gb-icon>edit</md-gb-icon>

</md-gb-fab>
<md-gb-fab aria-label="Edit" size="lg"><md-gb-icon>edit</md-gb-icon>

</md-gb-fab>
{% enddemo %}

## Branded FAB

Branded FABs use a brightly colored logo for their icon. Unlike [FAB](#fab),
branded FABs do not have color variants.

{% demo "A branded FAB with a google-colored plus icon." %}
<md-gb-fab aria-label="Add"><md-gb-icon><svg viewBox="0 0 36 36">
    <path fill="#34A853" d="M16 16v14h4V20z"></path>
    <path fill="#4285F4" d="M30 16H20l-4 4h14z"></path>
    <path fill="#FBBC05" d="M6 16v4h10l4-4z"></path>
    <path fill="#EA4335" d="M20 16V6h-4v14z"></path>
    <path fill="none" d="M0 0h36v36H0z"></path>
  </svg></md-gb-icon>

</md-gb-fab>
{% enddemo %}

### Extended

Branded FABs may be extended with a label for additional emphasis. Unlike
[FAB](#fab), branded FABs should always display their logo icon.

{% demo "An extended branded fab with a google-colored plus icon and the visible text Add" %}
<md-gb-fab><md-gb-icon><svg viewBox="0 0 36 36">
    <path fill="#34A853" d="M16 16v14h4V20z"></path>
    <path fill="#4285F4" d="M30 16H20l-4 4h14z"></path>
    <path fill="#FBBC05" d="M6 16v4h10l4-4z"></path>
    <path fill="#EA4335" d="M20 16V6h-4v14z"></path>
    <path fill="none" d="M0 0h36v36H0z"></path>
  </svg></md-gb-icon>

Add</md-gb-fab>
{% enddemo %}

### Sizes

Branded FABs may be medium (default) or large by setting the `size` attribute.

{% demo "Two branded FABs next to each other with a google-branded plus icon. A medium sized one and a large one." %}
<md-gb-fab aria-label="Add"><md-gb-icon><svg viewBox="0 0 36 36">
    <path fill="#34A853" d="M16 16v14h4V20z"></path>
    <path fill="#4285F4" d="M30 16H20l-4 4h14z"></path>
    <path fill="#FBBC05" d="M6 16v4h10l4-4z"></path>
    <path fill="#EA4335" d="M20 16V6h-4v14z"></path>
    <path fill="none" d="M0 0h36v36H0z"></path>
  </svg></md-gb-icon>

</md-gb-fab>
<md-gb-fab aria-label="Add" size="lg"><md-gb-icon><svg viewBox="0 0 36 36">
    <path fill="#34A853" d="M16 16v14h4V20z"></path>
    <path fill="#4285F4" d="M30 16H20l-4 4h14z"></path>
    <path fill="#FBBC05" d="M6 16v4h10l4-4z"></path>
    <path fill="#EA4335" d="M20 16V6h-4v14z"></path>
    <path fill="none" d="M0 0h36v36H0z"></path>
  </svg></md-gb-icon>

</md-gb-fab>
{% enddemo %}

## API

{% gbapi "fab" %}
