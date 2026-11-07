---
title: Density
section: foundations
order: 5
icon: density_medium
description: Density lets people see more information in data-heavy views by making components more compact.
---

Density lets people see more information in data-heavy views by making
components more compact. A component's density is a number from `0` (the
default) to `-3` (the densest). Each step down makes the component smaller.
Values are rounded and clamped to that range.

Use the `density` attribute.

{% demo "Checkboxes at density 0 and -3" %}
<label>
  Default
  <md-gb-checkbox></md-gb-checkbox>
</label>
<label>
  Dense
  <md-gb-checkbox density="-3"></md-gb-checkbox>
</label>
{% enddemo %}

## Which components support it

`density` is available on these components:

- `md-gb-button-group`
- `md-gb-checkbox`
- `md-gb-chip`
- `md-gb-icon-button`
- `md-gb-list`
- `md-gb-menu`
- `md-gb-radio`
- `md-gb-segmented-button`
- `md-gb-switch`
- `md-gb-tabs`
- `md-gb-text-field`
- `md-gb-time-picker`

Each step shrinks the component's visual size, not its touch target. A
checkbox, for example, loses 4px from its layout box (48px at density 0) and
its state layer (40px at density 0) per step. Its touch target stays 48px.

## Touch targets stay 48dp

Every component keeps a touch target of at least 48 by 48 CSS pixels, even at
the densest setting. The visual element can be smaller, but the area that
responds to a tap cannot. Do not override this with your own sizing.

## Rules of thumb

- **Density is a choice, not a default.** Leave components at `0` unless the
  view is data-heavy, and let people opt into a denser layout where you offer
  a control for it.
- **Do not change density automatically.** It should not switch when the
  window resizes or the device rotates, unless the person changed it.
- **Consider the device.** A person may want a dense desktop layout but not a
  dense phone layout.
- **Layout density comes first.** Spacing changes can add information without
  shrinking components. Use component density when you also need the
  controls themselves to be smaller.
- **Keep the controls accessible.** If you offer a density setting, the
  setting itself must be easy to find and use.
