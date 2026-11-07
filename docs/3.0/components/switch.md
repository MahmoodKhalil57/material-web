---
title: Switch
section: components
order: 32
description: Switches toggle the state of an item on or off.
---
{% demo "A switch with a text label" %}
<label>
  Wi-Fi
  <md-gb-switch selected></md-gb-switch>
</label>
{% enddemo %}

## Usage guidelines

*   **Use for settings.** Switches are the best way to let people adjust a setting. Use a switch, not a radio button, when each item in a list is controlled on its own.
*   **Visible at a glance.** Make the on or off state clear, and let the change take effect right away.
*   **Label with text.** Put the label next to the switch in a `<label>`. Its text color stays the same, even when the switch changes.

## Anatomy

A switch has a track, a handle and optional icons shown in the handle.

{% demo "A switch with an icon in the handle for each state" %}
<md-gb-switch aria-label="Airplane mode" selected>
  <md-gb-icon slot="off-icon">close</md-gb-icon>
  <md-gb-icon slot="on-icon">check</md-gb-icon>
</md-gb-switch>
{% enddemo %}

## Examples

### Selected

Add `selected` to start with the switch on.

{% demo "A label wrapping a selected switch, and a label linked by for" %}
<label>
  Wi-Fi
  <md-gb-switch selected></md-gb-switch>
</label>
<label for="bluetooth">Bluetooth</label>
<md-gb-switch id="bluetooth"></md-gb-switch>
{% enddemo %}

### Icons

Icons in the `on-icon` and `off-icon` slots appear in the handle. Fill only `on-icon` to show an icon just when the switch is on.

{% demo "A switch with a check mark when on and a close mark when off" %}
<md-gb-switch aria-label="Notifications">
  <md-gb-icon slot="on-icon">check</md-gb-icon>
  <md-gb-icon slot="off-icon">close</md-gb-icon>
</md-gb-switch>
{% enddemo %}

{% demo "A switch with an icon only when on" %}
<md-gb-switch aria-label="Dark mode" selected>
  <md-gb-icon slot="on-icon">check</md-gb-icon>
</md-gb-switch>
{% enddemo %}

### Disabled

A `disabled` switch can't be changed.

{% demo "A disabled switch that is off and one that is on" %}
<md-gb-switch aria-label="Sync off" disabled></md-gb-switch>
<md-gb-switch aria-label="Sync on" disabled selected></md-gb-switch>
{% enddemo %}

### In a form

A switch submits its `value` (`on` by default) under its `name` when it is selected, and `required` means it must be on.

{% demo "A required switch that accepts the terms" %}
<form>
  <label>
    Accept terms
    <md-gb-switch name="terms" required></md-gb-switch>
  </label>
  <md-gb-button type="submit">Continue</md-gb-button>
</form>
{% enddemo %}

## Accessibility

*   A switch has the `switch` role. It takes its name from an adjacent `<label>`, or from an explicit [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label), which wins over the label.
*   Add an `aria-label` to a switch with no visible label.
*   Space toggles the switch.

{% demo "A switch with no visible label, named Lights" %}
<md-gb-switch aria-label="Lights"></md-gb-switch>
{% enddemo %}

## API reference

{% gbapi "switch" %}
