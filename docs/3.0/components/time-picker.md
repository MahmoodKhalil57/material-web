---
title: Time picker
section: components
order: 35
description: Time pickers let people choose an hour and minute on a clock dial, or type them into fields.
---
{% demo "An inline time picker set to 7:00" %}
<md-gb-time-picker value="07:00"></md-gb-time-picker>
{% enddemo %}

## Usage guidelines

*   **Dial or input.** The dial is quick for picking an approximate time, and typing is faster for an exact one. People can [switch](#input-mode) between them unless you hide the toggle.
*   **Inline or modal.** Show the picker [inline](#inline-and-modal) in a form, or as a [modal](#inline-and-modal) when it opens from a field or button.
*   **Match the locale.** The picker follows the 12 or 24 hour clock of its `locale`. Set [`hour-cycle`](#hour-cycle) to force one.

## Anatomy

A time picker has a headline, the hour and minute selectors, an AM or PM toggle in 12 hour mode, a dial, and the actions.

```html
<md-gb-time-picker></md-gb-time-picker>
```

## Examples

### Inline and modal

Add `modal` to show the picker in a dialog with a scrim. Open it with `show()`. It fires `change` when a time is confirmed and `cancel` when it is dismissed.

{% demo "A modal time picker opened from a Set alarm button" %}
<md-gb-button id="set-alarm">Set alarm</md-gb-button>
<md-gb-time-picker id="alarm" modal headline="Set alarm"></md-gb-time-picker>
{% enddemo %}

```js
document.querySelector('#set-alarm').addEventListener('click', () => {
  document.querySelector('#alarm').show();
});
document.querySelector('#alarm').addEventListener('change', (event) => {
  console.log(event.target.value);
});
```

<script type="module">
  document.querySelector('#set-alarm').addEventListener('click', () => {
    document.querySelector('#alarm').show();
  });
</script>

### Input mode

Set `mode="input"` to start with hour and minute fields instead of the dial. Add `hide-mode-toggle` to remove the switch between the two.

{% demo "A time picker with hour and minute fields" %}
<md-gb-time-picker mode="input" value="07:00"></md-gb-time-picker>
{% enddemo %}

### Hour cycle

Set `hour-cycle` to `12` or `24`. The `value` is always a 24 hour `HH:MM` string.

{% demo "A 24 hour time picker set to 20:00" %}
<md-gb-time-picker hour-cycle="24" value="20:00"></md-gb-time-picker>
{% enddemo %}

### Orientation

The dial sits below the time selectors (`vertical`), except in short landscape windows, where it moves beside them (`horizontal`). Set `orientation` to choose one.

{% demo "A time picker with a horizontal layout" %}
<md-gb-time-picker orientation="horizontal" value="07:00"></md-gb-time-picker>
{% enddemo %}

### Density

Set `density` from 0 (default) to -3 to make the picker more compact.

{% demo "A time picker with a density of -3" %}
<md-gb-time-picker mode="input" density="-3" value="07:00"></md-gb-time-picker>
{% enddemo %}

## Accessibility

*   Input mode is an alternative to the dial, and every control has a label. Localize the labels with attributes such as `select-hour-label`, `hour-label`, `cancel-label` and `confirm-label`.
*   A modal picker is a `<dialog>`: focus moves into it and returns to the opener on close, and Escape cancels.
*   In the dial, the arrow keys change the selected hour or minute.

## API reference

{% gbapi "timepicker" %}
