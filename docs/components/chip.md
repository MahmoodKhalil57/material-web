---
title: Chips
section: components
category: other
order: 22
summary: Enter information, filter content or trigger actions
description: Chips help people enter information, make selections, filter content, or trigger actions.
---
{% demo "Filter chips in a labeled chip set" %}
<md-gb-chip-set aria-label="Meal filters">
  <md-gb-chip type="filter" selected>Breakfast</md-gb-chip>
  <md-gb-chip type="filter">Lunch</md-gb-chip>
  <md-gb-chip type="filter">Dinner</md-gb-chip>
</md-gb-chip-set>
{% enddemo %}

{% gbshadcn "chip" %}

## Usage guidelines

*   **Pick the type by purpose.** [Assist](#assist-chips) chips are smart actions, [filter](#filter-chips) chips filter content, [input](#input-chips) chips are information a person entered, and [suggestion](#suggestion-chips) chips offer dynamic replies or queries.
*   **Show chips as a set.** Unlike buttons, chips appear dynamically as a group, so always place them in a [chip set](#chip-set).
*   **Elevate only for protection.** Use [elevated](#assist-chips) chips when they sit on an image or a busy background.
*   **Keep them compact.** Reduce [density](#density) when space is tight.

## Anatomy

A chip set holds chips, and each chip holds its label and optional icons.

{% demo "A chip set with a chip that has a leading and a trailing icon" %}
<md-gb-chip-set aria-label="Places">
  <md-gb-chip>
    <md-gb-icon slot="icon">place</md-gb-icon>
    <md-gb-icon slot="trailing-icon">arrow_drop_down</md-gb-icon>
    Nearby
  </md-gb-chip>
  <md-gb-chip>Open late</md-gb-chip>
</md-gb-chip-set>
{% enddemo %}

## Examples

### Assist chips

Assist chips are smart or automated actions, such as adding an event to a calendar. They are the default `type`, can link with `href`, and can be elevated.

{% demo "An assist chip with an icon and an assist chip that links to a page" %}
<md-gb-chip-set aria-label="Event actions">
  <md-gb-chip>
    <md-gb-icon slot="icon">event</md-gb-icon>
    Add to calendar
  </md-gb-chip>
  <md-gb-chip href="https://m3.material.io/components/chips">
    <md-gb-icon slot="icon">open_in_new</md-gb-icon>
    Guidelines
  </md-gb-chip>
</md-gb-chip-set>
{% enddemo %}

### Filter chips

Filter chips use tags or descriptive words to filter content and can replace toggle buttons or checkboxes. Set `type="filter"` and use `selected` for chosen ones.

{% demo "Filter chips, one selected, one with a trailing icon" %}
<md-gb-chip-set aria-label="Filters">
  <md-gb-chip type="filter" selected>Open now</md-gb-chip>
  <md-gb-chip type="filter">
    Price
    <md-gb-icon slot="trailing-icon">arrow_drop_down</md-gb-icon>
  </md-gb-chip>
</md-gb-chip-set>
{% enddemo %}

### Input chips

Input chips are discrete pieces of information a person entered, such as contacts. Set `type="input"`; add `removable` for a remove button and `editable` to let people edit the text. Icons and avatars go in the `icon` slot.

{% demo "Removable input chips, one with an icon" %}
<md-gb-chip-set aria-label="Attendees">
  <md-gb-chip type="input" removable>Hiking</md-gb-chip>
  <md-gb-chip type="input" removable>
    <md-gb-icon slot="icon">person</md-gb-icon>
    Ada
  </md-gb-chip>
</md-gb-chip-set>
{% enddemo %}

### Suggestion chips

Suggestion chips narrow a person's intent with dynamically generated suggestions, such as possible replies.

{% demo "Suggested replies" %}
<md-gb-chip-set aria-label="Suggested replies">
  <md-gb-chip type="suggestion">Sounds good</md-gb-chip>
  <md-gb-chip type="suggestion" elevated>See you then</md-gb-chip>
</md-gb-chip-set>
{% enddemo %}

### Chip set

The chip set manages selection (`selection="single"` or `"multiple"`) and arrow-key navigation, and wraps chips by default. With `selection="single"`, add `required` so the selected chip can't be unselected, or `single-line` to scroll instead of wrap.

{% demo "A single-select chip set with a heading" %}
<h3 id="size-label">Size</h3>
<md-gb-chip-set aria-labelledby="size-label" selection="single" required>
  <md-gb-chip type="filter" selected>Small</md-gb-chip>
  <md-gb-chip type="filter">Medium</md-gb-chip>
  <md-gb-chip type="filter">Large</md-gb-chip>
</md-gb-chip-set>
{% enddemo %}

### Density

Set `density` on the chip set from 0 (default) to -3 to remove 4px of height per step.

{% demo "A chip set with a density of -2" %}
<md-gb-chip-set aria-label="Compact filters" density="-2">
  <md-gb-chip type="filter">Lunch</md-gb-chip>
  <md-gb-chip type="filter">Dinner</md-gb-chip>
</md-gb-chip-set>
{% enddemo %}

### Disabled and soft-disabled

A `soft-disabled` chip stays focusable so screen reader users can discover actions that are not available yet, such as Copy before text is selected.

{% demo "A disabled chip and a soft-disabled chip" %}
<md-gb-chip-set aria-label="Edit actions">
  <md-gb-chip disabled>Disabled</md-gb-chip>
  <md-gb-chip soft-disabled>Soft-disabled</md-gb-chip>
</md-gb-chip-set>
{% enddemo %}

## Accessibility

*   A chip set is a grid of chips: label it with [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label) or [`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby).
*   Add an `aria-label` to chips whose text needs to be more descriptive.
*   The set is one tab stop; arrow keys, Home and End move between chips, and Backspace or Delete removes a removable chip.
*   Disabled chips leave the focus order; use `soft-disabled` where discoverability matters, per the [ARIA guidance on disabled controls](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_disabled_controls).

{% demo "A chip set labelled by a heading, with chips that have a longer aria-label" %}
<h3 id="dates-label">Dates</h3>
<md-gb-chip-set aria-labelledby="dates-label">
  <md-gb-chip aria-label="Monday" type="filter">Mon</md-gb-chip>
  <md-gb-chip aria-label="Tuesday" type="filter">Tue</md-gb-chip>
</md-gb-chip-set>
{% enddemo %}

## API reference

{% gbapi "chip" %}
