---
title: Date picker
section: components
order: 9
description: A date picker lets people select a date or a range of dates.
---
{% demo "A docked date picker with a text field" %}
<md-gb-date-picker label="Event date"></md-gb-date-picker>
{% enddemo %}

## Usage guidelines

*   **Match the context.** Use the docked picker, a calendar under a text field, on medium and expanded windows. Use a [modal](#modal) picker on compact ones.
*   **Pick or type.** A modal picker has a calendar mode and an input mode for typing a date.
*   **Select a range.** Add [`range`](#range) to choose a start and an end date.
*   **Offer a way to clear.** Add `clearable` so people can remove a selection.

This component is new in [M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive).

## Anatomy

A date picker is one element. A docked picker renders a text field and a calendar popup; a modal picker renders a dialog.

{% demo "A date picker with a label" %}
<md-gb-date-picker label="Due date"></md-gb-date-picker>
{% enddemo %}

## Examples

### Modal

Set `variant="modal"` and call `show()` to open the picker in a dialog. Use `mode="input"` to start with the date input.

{% demo "A button that opens a modal date picker" height=480 %}
```html
<md-gb-button id="open-picker">Pick a date</md-gb-button>
<md-gb-date-picker id="picker" variant="modal"></md-gb-date-picker>
```
```ts
document.querySelector('#open-picker')!.addEventListener('click', () => {
  document.querySelector('md-gb-date-picker')!.show();
});
```
{% enddemo %}

### Range

Add `range` to select a start and an end date. The value is an ISO interval such as `2026-08-17/2026-08-23`.

{% demo "A docked date range picker" %}
<md-gb-date-picker range label="Trip dates"></md-gb-date-picker>
{% enddemo %}

### Value, min and max

Set `value` to an ISO date (`YYYY-MM-DD`). Limit the choices with `min` and `max`.

{% demo "A date picker with a value and limits" %}
<md-gb-date-picker label="Check-in" value="2026-08-17" min="2026-08-01" max="2026-12-31"></md-gb-date-picker>
{% enddemo %}

### Full screen

Add `fullscreen` to a modal picker for compact windows. It has a close button and a Save button.

{% demo "A full-screen modal range picker" height=480 frame=true %}
<md-gb-date-picker variant="modal" fullscreen range open></md-gb-date-picker>
{% enddemo %}

## Accessibility

*   Name the field with `label`, such as "Event date", and use `supporting-text` to show the expected format.
*   Calendar targets stay 48px, so `density` only affects the text fields.
*   Page Up and Page Down move by month, and Shift with them moves by year.
*   The modal picker closes with Escape, and the docked picker confirms with Enter.

## API reference

{% gbapi "datepicker" %}
