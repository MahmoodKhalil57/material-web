# Navigation Rail

A navigation rail lets people switch between top-level destinations on larger windows, and expands to show full labels.

**Example: A navigation rail with a menu button and four destinations**

```html
<md-gb-nav-rail aria-label="Primary" collapsible>
  <md-gb-nav-rail-item selected href="#inbox">
    <md-gb-icon slot="icon">mail</md-gb-icon>
    Inbox
  </md-gb-nav-rail-item>
  <md-gb-nav-rail-item href="#chat">
    <md-gb-icon slot="icon">chat_bubble</md-gb-icon>
    Chat
  </md-gb-nav-rail-item>
  <md-gb-nav-rail-item href="#spaces">
    <md-gb-icon slot="icon">groups</md-gb-icon>
    Spaces
  </md-gb-nav-rail-item>
  <md-gb-nav-rail-item href="#meet">
    <md-gb-icon slot="icon">videocam</md-gb-icon>
    Meet
  </md-gb-nav-rail-item>
</md-gb-nav-rail>
```

## Usage guidelines

*   **Use it in medium windows and larger.** On compact windows use a [navigation bar](/material-web/3.0/components/navigation-bar/) instead.
*   **Keep three to seven destinations.** Add an optional FAB or menu button in the header.
*   **Keep it in the same place.** The rail stays at the leading edge on every screen of the app.
*   **Let it expand.** A [collapsed](#collapsible) rail shows icons and short labels, and an expanded rail shows horizontal items and can replace a navigation drawer.

This component is new in [M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive).

## Anatomy

A rail has an optional header, such as a menu button or a FAB, and items. Each item has an icon, a label and an optional badge.

**Example: A rail with a menu button, a FAB and items, one with a badge**

```html
<md-gb-nav-rail aria-label="Mail">
  <md-gb-icon-button slot="header" aria-label="Open menu"><md-gb-icon>menu</md-gb-icon></md-gb-icon-button>
  <md-gb-fab slot="header" aria-label="Compose"><md-gb-icon>edit</md-gb-icon></md-gb-fab>
  <md-gb-nav-rail-item selected href="#anatomy-inbox">
    <md-gb-icon slot="icon">inbox</md-gb-icon>
    <span slot="badge">3</span>
    Inbox
  </md-gb-nav-rail-item>
  <md-gb-nav-rail-item href="#anatomy-sent">
    <md-gb-icon slot="icon">send</md-gb-icon>
    Sent
  </md-gb-nav-rail-item>
</md-gb-nav-rail>
```

## Examples

### Links

Give an item an `href` (and optionally `target` and `rel`) to make the destination a link, as in the first example. The item then has the `link` role and the selected one is marked `aria-current="page"`. Without `href` an item is a tab that just reports the selection.

### Collapsible

Add `collapsible` to show a built-in menu button in the header that expands and collapses the rail. To use your own button, put it in the `header` slot and call `toggle()`, `expand()` or `collapse()`. Set `expanded` to start expanded. The rail fires `toggle` when it expands or collapses.

**Example: A collapsible rail that starts expanded**

```html
<md-gb-nav-rail aria-label="Mail" collapsible expanded>
  <md-gb-nav-rail-item selected>
    <md-gb-icon slot="icon">mail</md-gb-icon>
    Inbox
  </md-gb-nav-rail-item>
  <md-gb-nav-rail-item>
    <md-gb-icon slot="icon">send</md-gb-icon>
    Sent
  </md-gb-nav-rail-item>
  <md-gb-nav-rail-item>
    <md-gb-icon slot="icon">drafts</md-gb-icon>
    Drafts
  </md-gb-nav-rail-item>
</md-gb-nav-rail>
```

### Header

Use the `header` slot for a menu button and a FAB above the items.

**Example: A rail with a menu button and a compose FAB**

```html
<md-gb-nav-rail aria-label="Mail">
  <md-gb-icon-button slot="header" aria-label="Open menu">
    <md-gb-icon>menu</md-gb-icon>
  </md-gb-icon-button>
  <md-gb-fab slot="header" label="Compose">
    <md-gb-icon>edit</md-gb-icon>
  </md-gb-fab>
  <md-gb-nav-rail-item selected>
    <md-gb-icon slot="icon">mail</md-gb-icon>
    Inbox
  </md-gb-nav-rail-item>
  <md-gb-nav-rail-item>
    <md-gb-icon slot="icon">send</md-gb-icon>
    Sent
  </md-gb-nav-rail-item>
</md-gb-nav-rail>
```

### Alignment

Set `alignment` to `top` (the default), `center` or `bottom` to place the items along the rail.

**Example: A rail with its items centered**

```html
<md-gb-nav-rail aria-label="Primary" alignment="center">
  <md-gb-nav-rail-item selected>
    <md-gb-icon slot="icon">home</md-gb-icon>
    Home
  </md-gb-nav-rail-item>
  <md-gb-nav-rail-item>
    <md-gb-icon slot="icon">search</md-gb-icon>
    Search
  </md-gb-nav-rail-item>
  <md-gb-nav-rail-item>
    <md-gb-icon slot="icon">settings</md-gb-icon>
    Settings
  </md-gb-nav-rail-item>
</md-gb-nav-rail>
```

### Badges

Set `badge` on an item to show a count, or `badge="dot"` for a small dot.

**Example: Rail items with a count badge and a dot badge**

```html
<md-gb-nav-rail aria-label="Mail">
  <md-gb-nav-rail-item selected badge="4">
    <md-gb-icon slot="icon">mail</md-gb-icon>
    Inbox
  </md-gb-nav-rail-item>
  <md-gb-nav-rail-item badge="dot">
    <md-gb-icon slot="icon">chat_bubble</md-gb-icon>
    Chat
  </md-gb-nav-rail-item>
</md-gb-nav-rail>
```

### Secondary items

Add `secondary` to an item that should show only while the rail is expanded, such as a less important destination.

**Example: An expanded rail with a secondary destination**

```html
<md-gb-nav-rail aria-label="Mail" collapsible expanded>
  <md-gb-nav-rail-item selected>
    <md-gb-icon slot="icon">mail</md-gb-icon>
    Inbox
  </md-gb-nav-rail-item>
  <md-gb-nav-rail-item secondary>
    <md-gb-icon slot="icon">delete</md-gb-icon>
    Trash
  </md-gb-nav-rail-item>
</md-gb-nav-rail>
```

### Modal

Add `modal` so the expanded rail opens over the content with a scrim. Add `hide-when-collapsed` to take the collapsed rail out of the layout entirely; the app's menu button then calls `toggle()` to show it. On Android, the back gesture collapses a modal rail.

**Example: A collapsible modal rail**

```html
<md-gb-nav-rail aria-label="Mail" modal collapsible>
  <md-gb-nav-rail-item selected>
    <md-gb-icon slot="icon">mail</md-gb-icon>
    Inbox
  </md-gb-nav-rail-item>
  <md-gb-nav-rail-item>
    <md-gb-icon slot="icon">send</md-gb-icon>
    Sent
  </md-gb-nav-rail-item>
</md-gb-nav-rail>
```

### Appearance

Add `divider` to draw a line at the rail's edge, `elevated` to lift it above scrolling content, and `narrow` to use the 80dp collapsed width.

**Example: A narrow rail with a divider**

```html
<md-gb-nav-rail aria-label="Primary" narrow divider>
  <md-gb-nav-rail-item selected>
    <md-gb-icon slot="icon">home</md-gb-icon>
    Home
  </md-gb-nav-rail-item>
  <md-gb-nav-rail-item>
    <md-gb-icon slot="icon">search</md-gb-icon>
    Search
  </md-gb-nav-rail-item>
</md-gb-nav-rail>
```

## Accessibility

*   Give the rail an `aria-label` such as "Primary navigation".
*   Without links the rail is a tab list and its items are tabs, with exactly one selected. Tab moves focus into the rail, the arrow keys move between items, and Enter and Space select one.
*   When the items have an `href` the rail is a navigation landmark of links and the selected one is `aria-current="page"`. Enter follows a link; Space doesn't.
*   Every item needs a visible label, which is also its accessible name.
*   Give a menu button in the header an `aria-label`, such as "Open menu".
*   A modal rail collapses on Escape and when the scrim is pressed. Keep the menu button available as the single-pointer alternative to swiping it closed.
*   Disabled items leave the tab order.

## API reference

### &lt;md-gb-nav-rail&gt;

A Material Design navigation rail custom element.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>alignment</code><br><span class="gb-desc">Vertical alignment of items ('top', 'center', or 'bottom').</span> | <code>alignment</code> | <code>NavRailAlignment</code> | <code>'top'</code> |
| <code>autoSelect</code><br><span class="gb-desc">Whether or not to automatically select a tab when it is focused.</span> | <code>autoselect</code> | <code>boolean</code> | <code>false</code> |
| <code>collapsible</code><br><span class="gb-desc">Whether the navigation rail renders a built-in expand/collapse menu button in the header when no toggle button is slotted into <code>slot="header"</code>.</span> | <code>collapsible</code> | <code>boolean</code> | <code>false</code> |
| <code>divider</code><br><span class="gb-desc">Whether a vertical divider marks the edge of the rail next to the app's content.</span> | <code>divider</code> | <code>boolean</code> | <code>false</code> |
| <code>elevated</code><br><span class="gb-desc">Whether the rail is elevated to level 1, to distinguish it from content that scrolls underneath it.</span> | <code>elevated</code> | <code>boolean</code> | <code>false</code> |
| <code>expanded</code><br><span class="gb-desc">Whether the navigation rail is expanded to show horizontal items.</span> | <code>expanded</code> | <code>boolean</code> | <code>false</code> |
| <code>hideWhenCollapsed</code><br><span class="gb-desc">Hide when collapsed (navigation-rail.md): the collapsed rail is not shown and takes no space, so the body content fills in. The expanded rail (always modal in this mode) appears over the content when the app's menu button calls <code>expand()</code> or <code>toggle()</code>; keep that menu button accessible.</span> | <code>hide-when-collapsed</code> | <code>boolean</code> | <code>false</code> |
| <code>itemLayout</code><br><span class="gb-desc">The layout orientation of items ('vertical' or 'horizontal').</span> | <code>item-layout</code> | <code>NavRailItemLayout</code> | <code>'vertical'</code> |
| <code>modal</code><br><span class="gb-desc">Whether the expanded navigation rail is modal: it opens over the content with a scrim, with modal elevation and shape.</span> | <code>modal</code> | <code>boolean</code> | <code>false</code> |
| <code>narrow</code><br><span class="gb-desc">Whether the collapsed rail uses the narrow width (<code>md.comp.nav-rail.collapsed.narrow.container.width</code>, 80dp).</span> | <code>narrow</code> | <code>boolean</code> | <code>false</code> |
| <code>selectedIndex</code><br><span class="gb-desc">The 0-based index of the currently active navigation rail item. Alias for <code>selectedTabIndex</code>.</span> | <code>selected-index</code> | <code>number</code> |  |
| <code>selectedTabIndex</code><br><span class="gb-desc">The index of the currently selected tab.</span> | <code>selectedtabindex</code> | <code>number</code> |  |

#### Slots

| Slot | Description |
| --- | --- |
| default | Used to display navigation rail items (<code>md-gb-nav-rail-item</code>). |
| <code>header</code> | Used to display optional header controls (menu button, FAB). |

#### Events

| Event | Description |
| --- | --- |
| <code>change</code><br><span class="gb-desc">Event</span> | Fired when the selected item changes. |
| <code>toggle</code><br><span class="gb-desc">CustomEvent&lt;&#123;expanded: boolean, reason?: string&#125;&gt;</span> | Fired when the expanded state is toggled. |

#### Methods

| Method | Description |
| --- | --- |
| <code>collapse</code><br><span class="gb-desc">() =&gt; void</span> | Collapses the navigation rail. |
| <code>expand</code><br><span class="gb-desc">() =&gt; void</span> | Expands the navigation rail. |
| <code>handleBack</code><br><span class="gb-desc">() =&gt; Promise&lt;void&gt;</span> | Handles a back request (the Android back gesture or button) on the modal expanded rail: plays the predictive back motion, then collapses the rail. Call it for an in-app back control that should behave like the system back. Resolves after the back motion. |
| <code>toggle</code><br><span class="gb-desc">(force?: boolean) =&gt; boolean</span> | Toggles the expanded state of the navigation rail. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(header)</code> | The navigation rail's header container. |
| <code>::part(items)</code> | The navigation rail's items container. |
| <code>::part(menu-button)</code> | The built-in expand/collapse menu button when <code>collapsible</code>. |
| <code>::part(nav-rail)</code> | The navigation rail's root container. |
| <code>::part(scrim)</code> | The modal rail's scrim, while expanded. A <code>modal</code> rail expands over the content with a scrim, like Compose <code>ModalWideNavigationRail</code>. Clicking the scrim, pressing Escape or swiping the rail toward its edge collapses it. The scrim (and the menu button of a <code>collapsible</code> rail) are the single-pointer alternatives to the swipe. While a modal rail is expanded, focus moves into it, Tab stays inside it, page scrolling is locked, and focus returns to the previous element when it collapses. The <code>toggle</code> event's <code>detail.reason</code> says why a modal rail collapsed (<code>escape</code>, <code>back</code>, <code>scrim</code> or <code>swipe</code>). Predictive back applies to the modal expanded rail (navigation-rail.md): while it is expanded the rail listens for back requests with a <code>CloseWatcher</code> (the Android back gesture or button, and Escape), falling back to Escape on the document where <code>CloseWatcher</code> is missing. A back request plays the predictive back motion (the rail pops off its edge, Compose <code>ModalWideNavigationRail</code> scales) and collapses the rail. A FAB (<code>md-gb-fab</code> with a <code>label</code>) in the header is an extended FAB while the rail is expanded and an icon FAB while it is collapsed. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--collapsed-item-vertical-space</code> |  |
| <code>--collapsed-narrow-container-width</code> |  |
| <code>--collapsed-top-space</code> |  |
| <code>--container-color</code> |  |
| <code>--container-elevation</code> |  |
| <code>--container-shape</code> |  |
| <code>--container-vertical-padding</code> |  |
| <code>--container-width</code> |  |
| <code>--expanded-container-color</code> |  |
| <code>--expanded-container-width-maximum</code> |  |
| <code>--expanded-container-width-minimum</code> |  |
| <code>--expanded-modal-container-color</code> |  |
| <code>--expanded-top-space</code> |  |
| <code>--header-space-minimum</code> |  |
| <code>--item-active-focused-icon-color</code> |  |
| <code>--item-active-focused-label-text-color</code> |  |
| <code>--item-active-hovered-icon-color</code> |  |
| <code>--item-active-hovered-label-text-color</code> |  |
| <code>--item-active-icon-color</code> |  |
| <code>--item-active-indicator-color</code> |  |
| <code>--item-active-indicator-height</code> |  |
| <code>--item-active-indicator-shape</code> |  |
| <code>--item-active-indicator-width</code> |  |
| <code>--item-active-label-text-color</code> |  |
| <code>--item-active-pressed-icon-color</code> |  |
| <code>--item-active-pressed-label-text-color</code> |  |
| <code>--item-active-state-layer-color</code> |  |
| <code>--item-container-height</code> |  |
| <code>--item-container-vertical-space</code> |  |
| <code>--item-full-width-leading-space</code> |  |
| <code>--item-full-width-trailing-space</code> |  |
| <code>--item-horizontal-active-indicator-height</code> |  |
| <code>--item-horizontal-active-indicator-width</code> | The expanded destinations' pill width: <code>fit-content</code> (default) hugs the icon and label; <code>100%</code> takes the destination's width. |
| <code>--item-horizontal-icon-label-space</code> |  |
| <code>--item-icon-size</code> |  |
| <code>--item-inactive-focused-icon-color</code> |  |
| <code>--item-inactive-focused-label-text-color</code> |  |
| <code>--item-inactive-hovered-icon-color</code> |  |
| <code>--item-inactive-hovered-label-text-color</code> |  |
| <code>--item-inactive-icon-color</code> |  |
| <code>--item-inactive-label-text-color</code> |  |
| <code>--item-inactive-pressed-icon-color</code> |  |
| <code>--item-inactive-pressed-label-text-color</code> |  |
| <code>--item-inactive-state-layer-color</code> |  |
| <code>--item-label-text-font</code> |  |
| <code>--item-label-text-font-axes</code> |  |
| <code>--item-label-text-font-tracking</code> |  |
| <code>--item-outer-space</code> |  |
| <code>--item-vertical-icon-label-space</code> |  |
| <code>--item-vertical-leading-space</code> |  |
| <code>--item-vertical-trailing-space</code> |  |
| <code>--modal-container-elevation</code> |  |
| <code>--modal-container-shape</code> |  |
| <code>--modal-scrim-color</code> |  |
| <code>--motion-duration</code> |  |
| <code>--motion-easing</code> |  |

### &lt;md-gb-nav-rail-item&gt;

A Material Design navigation rail item custom element.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>active</code><br><span class="gb-desc">Whether the navigation rail item is active. Alias for <code>selected</code>. TODO: replace reflected <code>[active]</code> with <code>:state(selected)</code></span> | <code>active</code> | <code>boolean</code> |  |
| <code>badge</code><br><span class="gb-desc">Optional badge text (or 'dot' / 'true' for a small dot badge).</span> | <code>badge</code> | <code>string</code> | <code>''</code> |
| <code>disabled</code><br><span class="gb-desc">Whether the navigation rail item is disabled.</span> | <code>disabled</code> | <code>boolean</code> | <code>false</code> |
| <code>href</code><br><span class="gb-desc">The URL the destination links to. The item is then a link (role <code>link</code>, <code>aria-current="page"</code> while selected) instead of a tab.</span> | <code>href</code> | <code>string</code> | <code>''</code> |
| <code>itemLayout</code><br><span class="gb-desc">The layout orientation of the item ('vertical' or 'horizontal').</span> | <code>item-layout</code> | <code>NavRailItemLayout</code> | <code>'vertical'</code> |
| <code>label</code><br><span class="gb-desc">Optional label text if not provided via default slot.</span> | <code>label</code> | <code>string</code> | <code>''</code> |
| <code>rel</code><br><span class="gb-desc">The link's <code>rel</code> attribute, when <code>href</code> is set.</span> | <code>rel</code> | <code>string</code> | <code>''</code> |
| <code>secondary</code><br><span class="gb-desc">Whether the destination is secondary: it shows only while the rail is expanded.</span> | <code>secondary</code> | <code>boolean</code> | <code>false</code> |
| <code>tabpanel</code><br><span class="gb-desc">ID of the associated <code>md-aria-tabpanel</code> element.</span> | <code>tabpanel</code> | <code>string</code> |  |
| <code>target</code><br><span class="gb-desc">Where to open the linked <code>href</code>, e.g. <code>_blank</code>.</span> | <code>target</code> | <code>"" | "_blank" | "_parent" | "_self" | "_top"</code> | <code>''</code> |
| <code>unfilledIcon</code><br><span class="gb-desc">Whether the icon has no filled style. The active destination then uses the semibold icon weight instead of the filled icon.</span> | <code>unfilled-icon</code> | <code>boolean</code> | <code>false</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | Used to display the item's label text. |
| <code>badge</code> | Used to display a custom badge on the item's icon. |
| <code>icon</code> | Used to display the item's icon (<code>md-gb-icon</code>). |

#### Methods

| Method | Description |
| --- | --- |
| <code>click</code><br><span class="gb-desc">() =&gt; void</span> | Activates the destination: follows its link, else clicks the tab. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(indicator)</code> | The active indicator / icon container element. |
| <code>::part(label)</code> | The label text container element. |
| <code>::part(nav-rail-item)</code> | The navigation rail item's presentational container. |
