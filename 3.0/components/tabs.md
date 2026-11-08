# Tabs

Tabs organize groups of related content that are at the same level of hierarchy.

**Example: Primary tabs with Flights selected**

```html
<md-gb-tabs aria-label="Travel">
  <md-gb-tab selected><span slot="label">Flights</span></md-gb-tab>
  <md-gb-tab><span slot="label">Trips</span></md-gb-tab>
  <md-gb-tab><span slot="label">Explore</span></md-gb-tab>
</md-gb-tabs>
```

## Usage guidelines

*   **Same level of hierarchy.** Tabs switch between views of related content that are peers. Don't use them for steps in a flow.
*   **Primary or secondary.** [Primary](#primary-and-secondary) tabs sit at the top of the content under a top app bar and show the main destinations. [Secondary](#primary-and-secondary) tabs split a content area further. Use one type in a bar.
*   **Short labels.** Keep labels to a word or two. Use [icons](#icons) only when they are simple and recognizable.
*   **Avoid dense tabs by default.** Lowering the [density](#density) shrinks the targets below 48px, so let people opt in.

## Anatomy

A tab list holds tabs, and each tab has an optional icon, a label and an optional badge. Tab panels hold the content.

**Example: Tabs with an icon, label and badge, and their panels**

```html
<md-gb-tabs id="anatomy-tabs" aria-label="Mail">
  <md-gb-tab selected>
    <md-gb-icon>inbox</md-gb-icon>
    <span slot="label">Inbox</span>
    <span class="badge badge-large tab-badge" slot="badge">3</span>
  </md-gb-tab>
  <md-gb-tab>
    <md-gb-icon>send</md-gb-icon>
    <span slot="label">Sent</span>
  </md-gb-tab>
</md-gb-tabs>
<md-gb-tab-panels for="anatomy-tabs">
  <div role="tabpanel">Three new messages.</div>
  <div role="tabpanel">Messages you sent.</div>
</md-gb-tab-panels>
```

## Examples

### Primary and secondary

Tabs are `primary` by default. Set `variant="secondary"` for secondary tabs, which put the icon beside the label.

**Example: Secondary tabs with icons**

```html
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
```

### Icons

Put an icon before the label, or leave out the label for icon-only tabs. Icon-only tabs need an `aria-label`.

**Example: Tabs with icons and labels, and icon-only tabs**

```html
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
```

### Badges

A tab can show a badge in the `badge` slot for counts or status.

**Example: Tabs with a count badge**

```html
<md-gb-tabs aria-label="Mail">
  <md-gb-tab selected>
    <span slot="label">Inbox</span>
    <span class="badge badge-large tab-badge" slot="badge">3</span>
  </md-gb-tab>
  <md-gb-tab><span slot="label">Sent</span></md-gb-tab>
</md-gb-tabs>
```

### Tab panels

Link each tab to its panel with `tabpanel`, the id of a panel such as `md-aria-tabpanel`. Only the selected panel is shown.

**Example: Tabs linked to two panels**

```html
<md-gb-tabs aria-label="Travel">
  <md-gb-tab selected tabpanel="flights-panel"><span slot="label">Flights</span></md-gb-tab>
  <md-gb-tab tabpanel="trips-panel"><span slot="label">Trips</span></md-gb-tab>
</md-gb-tabs>
<md-aria-tabpanel id="flights-panel">Search one-way and round-trip fares.</md-aria-tabpanel>
<md-aria-tabpanel id="trips-panel">Your upcoming and past bookings.</md-aria-tabpanel>
```

### Swipeable panels

`md-gb-tab-panels` holds the panels next to the tabs and lets people swipe between them. It pairs with the previous tab list, or with `for`, the id of one. Set `gestures-disabled` to turn swiping off.

**Example: Tabs and swipeable panels**

```html
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
```

### Scrollable

Fixed tabs share the width equally. Set `scrollable` to size each tab to its label and scroll the bar when they overflow.

**Example: Scrollable tabs with many labels**

```html
<md-gb-tabs scrollable aria-label="Travel">
  <md-gb-tab selected><span slot="label">Flights</span></md-gb-tab>
  <md-gb-tab><span slot="label">Trips</span></md-gb-tab>
  <md-gb-tab><span slot="label">Hotels</span></md-gb-tab>
  <md-gb-tab><span slot="label">Car rental</span></md-gb-tab>
  <md-gb-tab><span slot="label">Things to do</span></md-gb-tab>
</md-gb-tabs>
```

### Density

Set `density` from 0 (default) to -3 to remove 4px of height per step.

**Example: Tabs with a density of -2**

```html
<md-gb-tabs density="-2" aria-label="Travel">
  <md-gb-tab selected><span slot="label">Flights</span></md-gb-tab>
  <md-gb-tab><span slot="label">Trips</span></md-gb-tab>
</md-gb-tabs>
```

### Selection events

The tab list fires `change` when a person picks a tab. Read the new tab from `selectedTabIndex`.

**Example: Tabs that print the index of the selected tab**

*HTML*

```html
<md-gb-tabs aria-label="Travel">
  <md-gb-tab selected><span slot="label">Flights</span></md-gb-tab>
  <md-gb-tab><span slot="label">Trips</span></md-gb-tab>
  <md-gb-tab><span slot="label">Explore</span></md-gb-tab>
</md-gb-tabs>
<output>Selected tab: 0</output>
```

*JavaScript*

```js
const tabs = document.querySelector('md-gb-tabs');
const output = document.querySelector('output');
tabs.addEventListener('change', () => {
  output.textContent = `Selected tab: ${tabs.selectedTabIndex}`;
});
```

## Accessibility

*   Tabs use the `tablist`, `tab` and `tabpanel` roles. Label the tab list with [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label) or [`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby), and give icon-only tabs an `aria-label`.
*   The list is one tab stop. The arrow keys move between tabs, and Space or Enter selects the focused one.
*   Each tab controls a panel, and each panel is labelled by its tab. Linking them with `tabpanel` or `md-gb-tab-panels` does this for you.

## API reference

### &lt;md-gb-tab&gt;

A Material Design tab component.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>selected</code><br><span class="gb-desc">Whether the tab is selected.</span> | <code>selected</code> | <code>boolean</code> |  |
| <code>tabpanel</code><br><span class="gb-desc">ID of the associated <code>md-aria-tabpanel</code> element.</span> | <code>tabpanel</code> | <code>string</code> |  |

#### Slots

| Slot | Description |
| --- | --- |
| default | Used to display an optional leading icon, such as <code>&lt;md-gb-icon&gt;</code>. Icons are unclassed; the tab sets <code>--md-icon-*</code> for them. |
| <code>badge</code> | Used to display an optional badge, such as <code>&lt;span class="badge tab-badge"&gt;</code>. |
| <code>label</code> | Used to display the tab's label. <code>&lt;span class="tab-label"&gt;</code> in the default slot is equivalent. Bare text is not supported. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--badge-space</code> |  |
| <code>--focus-indicator-clearance</code> |  |
| <code>--focus-indicator-inset</code> |  |
| <code>--focus-indicator-shape</code> |  |
| <code>--icon-badge-inset</code> |  |
| <code>--icon-color</code> |  |
| <code>--icon-label-space</code> |  |
| <code>--icon-size</code> |  |
| <code>--label-text</code> |  |
| <code>--label-text-axes</code> |  |
| <code>--label-text-color</code> |  |
| <code>--label-text-tracking</code> |  |
| <code>--leading-space</code> |  |
| <code>--stacked-icon-label-space</code> |  |
| <code>--tab-scroll-margin</code> |  |
| <code>--trailing-space</code> |  |

### &lt;md-gb-tab-panels&gt;

The swipeable content panels of a set of Material Design tabs.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>gesturesDisabled</code><br><span class="gb-desc">Whether to turn off swiping between panels.</span> | <code>gestures-disabled</code> | <code>boolean</code> | <code>false</code> |
| <code>htmlFor</code><br><span class="gb-desc">The id of the <code>&lt;md-gb-tabs&gt;</code> these panels belong to.</span> | <code>for</code> | <code>string</code> | <code>''</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | The tab panels: elements with <code>role="tabpanel"</code>, such as <code>&lt;md-aria-tabpanel&gt;</code> or <code>&lt;div role="tabpanel"&gt;</code>. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--transition-duration</code> | Duration of a slide between panels. |
| <code>--transition-easing</code> | Easing of a slide between panels. |

### &lt;md-gb-tabs&gt;

A Material Design tabs component.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>align</code><br><span class="gb-desc">Where fixed tabs sit when the window is wider than compact: <code>center</code> (default) or <code>start</code>, the leading edge. tabs.md, Responsive layout: "The group of tabs should use a fluid margin and align to the center or leading edge of the body region." At compact windows the tabs fill the full width.</span> | <code>align</code> | <code>"start" | "center"</code> | <code>'center'</code> |
| <code>autoSelect</code><br><span class="gb-desc">Whether or not to automatically select a tab when it is focused.</span> | <code>autoselect</code> | <code>boolean</code> | <code>false</code> |
| <code>density</code><br><span class="gb-desc">The density, from 0 (default) to -3. Each step down removes 4px from the tabs' height (48px, or 64px with icon and label); values are clamped to that range. tabs.md "Avoid applying density by default": dense tabs are below the 48x48 CSS pixel target, so let people opt in (a denser layout or theme) and keep the controls that change it at 48x48.</span> | <code>density</code> | <code>Density</code> |  |
| <code>orientation</code><br><span class="gb-desc">Orientation of the tablist ('horizontal' or 'vertical').</span> | <code>orientation</code> | <code>"horizontal" | "vertical"</code> | <code>'horizontal'</code> |
| <code>scrollable</code><br><span class="gb-desc">Scrollable tabs: each tab's width is defined by its label (tabs.md) rather than every tab taking the width of the widest, and the bar scrolls when they overflow. Fixed tabs (the default) are equal.</span> | <code>scrollable</code> | <code>boolean</code> | <code>false</code> |
| <code>scrollBehavior</code><br><span class="gb-desc">How the tabs react to scrolling: <code>hide</code> scrolls them off the screen when the page scrolls down and returns them when it scrolls up (tabs.md). Tabs attached to an app bar (its <code>tabs</code> slot) leave this unset: the app bar moves them with itself as one unit.</span> | <code>scroll-behavior</code> | <code>"hide"</code> |  |
| <code>scrollTarget</code><br><span class="gb-desc">The id of the element whose scrolling drives <code>scroll-behavior</code>. Defaults to the window.</span> | <code>scroll-target</code> | <code>string</code> | <code>''</code> |
| <code>selectedTabIndex</code><br><span class="gb-desc">The index of the currently selected tab.</span> | <code>selectedtabindex</code> | <code>number</code> |  |
| <code>variant</code><br><span class="gb-desc">The visual variant of the tabs.</span> | <code>variant</code> | <code>TabsVariant</code> | <code>'primary'</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | Used to display <code>&lt;md-gb-tab&gt;</code> children. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--active-indicator-color</code> |  |
| <code>--active-indicator-height</code> |  |
| <code>--active-indicator-inset</code> |  |
| <code>--active-indicator-min-length</code> |  |
| <code>--active-indicator-shape</code> |  |
| <code>--container-color</code> |  |
| <code>--container-height</code> |  |
| <code>--container-shape</code> |  |
| <code>--density-step</code> | Tab height removed per density step. |
| <code>--divider-color</code> |  |
| <code>--divider-thickness</code> |  |
