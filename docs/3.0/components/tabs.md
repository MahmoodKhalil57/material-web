---
title: Tabs
section: components
order: 33
description: Tabs organize groups of related content that are at the same level of hierarchy.
---
{% demo "Primary tabs with Flights selected" %}
<md-gb-tabs aria-label="Travel">
  <md-gb-tab selected><span slot="label">Flights</span></md-gb-tab>
  <md-gb-tab><span slot="label">Trips</span></md-gb-tab>
  <md-gb-tab><span slot="label">Explore</span></md-gb-tab>
</md-gb-tabs>
{% enddemo %}

## Usage guidelines

*   **Same level of hierarchy.** Tabs switch between views of related content that are peers. Don't use them for steps in a flow.
*   **Primary or secondary.** [Primary](#primary-and-secondary) tabs sit at the top of the content under a top app bar and show the main destinations. [Secondary](#primary-and-secondary) tabs split a content area further. Use one type in a bar.
*   **Short labels.** Keep labels to a word or two. Use [icons](#icons) only when they are simple and recognizable.
*   **Avoid dense tabs by default.** Lowering the [density](#density) shrinks the targets below 48px, so let people opt in.

## Anatomy

A tab list holds tabs, and each tab has an optional icon, a label and an optional badge. Tab panels hold the content.

```html
<md-gb-tabs>
  <md-gb-tab>
    <md-gb-icon></md-gb-icon>
    <span slot="label"></span>
    <span slot="badge"></span>
  </md-gb-tab>
  …
</md-gb-tabs>
<md-gb-tab-panels>
  <div role="tabpanel"></div>
  …
</md-gb-tab-panels>
```

## Examples

### Primary and secondary

Tabs are `primary` by default. Set `variant="secondary"` for secondary tabs, which put the icon beside the label.

{% demo "Secondary tabs with icons" %}
<md-gb-tabs variant="secondary" aria-label="Trip type">
  <md-gb-tab selected>
    <md-gb-icon>flight</md-gb-icon>
    <span slot="label">Travel</span>
  </md-gb-tab>
  <md-gb-tab>
    <md-gb-icon>hotel</md-gb-icon>
    <span slot="label">Hotel</span>
  </md-gb-tab>
</md-gb-tabs>
{% enddemo %}

### Icons

Put an icon before the label, or leave out the label for icon-only tabs. Icon-only tabs need an `aria-label`.

{% demo "Tabs with icons and labels, and icon-only tabs" %}
<md-gb-tabs aria-label="Travel">
  <md-gb-tab selected>
    <md-gb-icon>flight</md-gb-icon>
    <span slot="label">Flights</span>
  </md-gb-tab>
  <md-gb-tab>
    <md-gb-icon>luggage</md-gb-icon>
    <span slot="label">Trips</span>
  </md-gb-tab>
</md-gb-tabs>
<md-gb-tabs aria-label="Media">
  <md-gb-tab selected aria-label="Photos"><md-gb-icon>photo</md-gb-icon></md-gb-tab>
  <md-gb-tab aria-label="Videos"><md-gb-icon>videocam</md-gb-icon></md-gb-tab>
</md-gb-tabs>
{% enddemo %}

### Badges

A tab can show a badge in the `badge` slot for counts or status.

{% demo "Tabs with a count badge" %}
<md-gb-tabs aria-label="Mail">
  <md-gb-tab selected>
    <span slot="label">Inbox</span>
    <span class="badge badge-large tab-badge" slot="badge">3</span>
  </md-gb-tab>
  <md-gb-tab><span slot="label">Sent</span></md-gb-tab>
</md-gb-tabs>
{% enddemo %}

### Tab panels

Link each tab to its panel with `tabpanel`, the id of a panel such as `md-aria-tabpanel`. Only the selected panel is shown.

{% demo "Tabs linked to two panels" %}
<md-gb-tabs aria-label="Travel">
  <md-gb-tab selected tabpanel="flights-panel"><span slot="label">Flights</span></md-gb-tab>
  <md-gb-tab tabpanel="trips-panel"><span slot="label">Trips</span></md-gb-tab>
</md-gb-tabs>
<md-aria-tabpanel id="flights-panel">Search one-way and round-trip fares.</md-aria-tabpanel>
<md-aria-tabpanel id="trips-panel">Your upcoming and past bookings.</md-aria-tabpanel>
{% enddemo %}

### Swipeable panels

`md-gb-tab-panels` holds the panels next to the tabs and lets people swipe between them. It pairs with the previous tab list, or with `for`, the id of one. Set `gestures-disabled` to turn swiping off.

{% demo "Tabs and swipeable panels" %}
<md-gb-tabs id="places" aria-label="Places">
  <md-gb-tab selected><span slot="label">Flights</span></md-gb-tab>
  <md-gb-tab><span slot="label">Trips</span></md-gb-tab>
  <md-gb-tab><span slot="label">Explore</span></md-gb-tab>
</md-gb-tabs>
<md-gb-tab-panels for="places">
  <div role="tabpanel">Search one-way and round-trip fares.</div>
  <div role="tabpanel">Your upcoming and past bookings.</div>
  <div role="tabpanel">Ideas for your next destination.</div>
</md-gb-tab-panels>
{% enddemo %}

### Scrollable

Fixed tabs share the width equally. Set `scrollable` to size each tab to its label and scroll the bar when they overflow.

{% demo "Scrollable tabs with many labels" %}
<md-gb-tabs scrollable aria-label="Travel">
  <md-gb-tab selected><span slot="label">Flights</span></md-gb-tab>
  <md-gb-tab><span slot="label">Trips</span></md-gb-tab>
  <md-gb-tab><span slot="label">Hotels</span></md-gb-tab>
  <md-gb-tab><span slot="label">Car rental</span></md-gb-tab>
  <md-gb-tab><span slot="label">Things to do</span></md-gb-tab>
</md-gb-tabs>
{% enddemo %}

### Density

Set `density` from 0 (default) to -3 to remove 4px of height per step.

{% demo "Tabs with a density of -2" %}
<md-gb-tabs density="-2" aria-label="Travel">
  <md-gb-tab selected><span slot="label">Flights</span></md-gb-tab>
  <md-gb-tab><span slot="label">Trips</span></md-gb-tab>
</md-gb-tabs>
{% enddemo %}

### Selection events

The tab list fires `change` when a person picks a tab. Read the new tab from `selectedTabIndex`.

```js
tabs.addEventListener('change', () => {
  console.log(tabs.selectedTabIndex);
});
```

## Accessibility

*   Tabs use the `tablist`, `tab` and `tabpanel` roles. Label the tab list with [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label) or [`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby), and give icon-only tabs an `aria-label`.
*   The list is one tab stop. The arrow keys move between tabs, and Space or Enter selects the focused one.
*   Each tab controls a panel, and each panel is labelled by its tab. Linking them with `tabpanel` or `md-gb-tab-panels` does this for you.

## API reference

{% gbapi "tabs" %}
