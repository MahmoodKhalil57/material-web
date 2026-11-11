---
title: Select
section: components
category: other
order: 29
summary: Choose one option from a list that opens on demand
description: Select menus let people choose one option from a list that opens on a temporary surface.
---
{% demo "A filled select with a label" %}
<md-gb-select label="Fruit">
  <md-gb-select-option value="apple">Apple</md-gb-select-option>
  <md-gb-select-option value="apricot">Apricot</md-gb-select-option>
  <md-gb-select-option value="banana">Banana</md-gb-select-option>
</md-gb-select>
{% enddemo %}

{% gbshadcn "select" %}

Material 3 has no separate select component. It treats a select as a menu
opened from a text field: the menus page says "dropdown menu and exposed
dropdown menu are now both referred to as menu", and the text fields page
lists "text field dropdown menus". `md-gb-select` combines the
[text field](/3.0/components/text-field/) and the [menu](/3.0/components/menu/)
and follows both pages.

## Usage guidelines

*   **Fixed list of choices.** Use a select to choose one value from a short, fixed list, like the native `<select>`. For a longer list that people can search, use the [autocomplete](#autocomplete).
*   **Pick the variant by emphasis.** Filled selects stand out more; [outlined](#variants) selects are lighter on dense forms.
*   **Say what is wrong.** Pair an [error](#error-and-supporting-text) with text that explains how to fix it.

## Anatomy

A select holds options and a field that shows the chosen one. Options can have icons and extra text.

{% demo "A select whose options have icons, supporting text and trailing text" height=300 %}
<md-gb-select label="Delivery">
  <md-gb-icon slot="leading-icon">local_shipping</md-gb-icon>
  <md-gb-select-option value="standard">
    <md-gb-icon slot="leading">schedule</md-gb-icon>
    <span slot="supporting-text">3 to 5 days</span>
    <span slot="trailing-text">Free</span>
    <md-gb-icon slot="trailing">check</md-gb-icon>
    Standard
  </md-gb-select-option>
  <md-gb-select-option value="express">
    <md-gb-icon slot="leading">bolt</md-gb-icon>
    <span slot="supporting-text">Next day</span>
    <span slot="trailing-text">$8</span>
    Express
  </md-gb-select-option>
</md-gb-select>
{% enddemo %}

## Examples

### Variants

Selects are `filled` by default. Set `variant="outlined"` for an outlined field.

{% demo "An outlined select with a label" %}
<md-gb-select label="Fruit" variant="outlined">
  <md-gb-select-option value="apple">Apple</md-gb-select-option>
  <md-gb-select-option value="apricot">Apricot</md-gb-select-option>
</md-gb-select>
{% enddemo %}

### Selected option

Add `selected` to an option, or set `value` on the select, to choose one at the start.

{% demo "A select with Mobile chosen" %}
<md-gb-select label="Phone type" value="mobile">
  <md-gb-select-option value="home">Home</md-gb-select-option>
  <md-gb-select-option value="mobile">Mobile</md-gb-select-option>
  <md-gb-select-option value="work">Work</md-gb-select-option>
</md-gb-select>
{% enddemo %}

### Option content

Options take a `leading` icon, `supporting-text`, `trailing-text` and a `trailing` icon. Disabled options can't be chosen.

{% demo "Options with supporting and trailing text, one disabled" %}
<md-gb-select label="Plan" variant="outlined">
  <md-gb-select-option value="free">
    Free
    <span slot="supporting-text">1 project</span>
    <span slot="trailing-text">$0</span>
  </md-gb-select-option>
  <md-gb-select-option value="pro">
    Pro
    <span slot="supporting-text">Unlimited projects</span>
    <span slot="trailing-text">$8</span>
  </md-gb-select-option>
  <md-gb-select-option value="team" disabled>
    Team
    <span slot="supporting-text">Coming soon</span>
  </md-gb-select-option>
</md-gb-select>
{% enddemo %}

### Leading icon

An icon in the `leading-icon` slot sits before the chosen text.

{% demo "A select with a leading icon and icons on its options" %}
<md-gb-select label="Phone type" value="mobile">
  <md-gb-icon slot="leading-icon">phone</md-gb-icon>
  <md-gb-select-option value="business">
    <md-gb-icon slot="leading">business_center</md-gb-icon>
    Business
  </md-gb-select-option>
  <md-gb-select-option value="mobile">
    <md-gb-icon slot="leading">smartphone</md-gb-icon>
    Mobile
  </md-gb-select-option>
</md-gb-select>
{% enddemo %}

### Error and supporting text

Use `supporting-text` for a hint. When `error` is set, `error-text` replaces it. Add `required` to mark the field as mandatory.

{% demo "A required select in an error state" %}
<md-gb-select label="Country" required error error-text="Choose a country">
  <md-gb-select-option value="ca">Canada</md-gb-select-option>
  <md-gb-select-option value="mx">Mexico</md-gb-select-option>
</md-gb-select>
{% enddemo %}

### Autocomplete

`md-gb-autocomplete` is a text field with the same options, filtered as people type. Set `filter` to change how options match.

{% demo "An autocomplete for US states" %}
<md-gb-autocomplete label="State">
  <md-gb-select-option>Alabama</md-gb-select-option>
  <md-gb-select-option>Alaska</md-gb-select-option>
  <md-gb-select-option>Arizona</md-gb-select-option>
</md-gb-autocomplete>
{% enddemo %}

### In a form

A select takes part in a form through its `name` and `value`, and `required` is checked on submit.

{% demo "A required select with a submit button" %}
<form>
  <md-gb-select name="size" label="Size" required>
    <md-gb-select-option value="s">Small</md-gb-select-option>
    <md-gb-select-option value="m">Medium</md-gb-select-option>
    <md-gb-select-option value="l">Large</md-gb-select-option>
  </md-gb-select>
  <md-gb-button type="submit">Order</md-gb-button>
</form>
{% enddemo %}

## Accessibility

*   The field is a `combobox` and the menu a `listbox`. The `label` names the field; add an [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label) when the label is elsewhere.
*   Enter, Space, or the arrow keys open the menu, the arrow keys move between options, and Escape closes it. Typing a few letters jumps to a matching option.

{% demo "A select with no visible label, named Sort by" height=300 %}
<md-gb-select aria-label="Sort by" value="new">
  <md-gb-select-option value="new">Newest</md-gb-select-option>
  <md-gb-select-option value="old">Oldest</md-gb-select-option>
</md-gb-select>
{% enddemo %}

## API reference

{% gbapi "select" %}
