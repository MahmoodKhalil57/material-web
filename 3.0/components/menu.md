# Menus

Menus show a temporary set of actions or choices, opened from a button, a text field or a context.

**Example: A button that opens a menu of file actions**

```html
<md-gb-button popovertarget="file-menu">File</md-gb-button>
<md-gb-menu id="file-menu">
  <md-gb-menu-item>New</md-gb-menu-item>
  <md-gb-menu-item>Open</md-gb-menu-item>
  <md-gb-menu-item disabled>Save</md-gb-menu-item>
</md-gb-menu>
```

## Usage guidelines

*   **Use it for temporary actions.** A menu shows a short set of actions on demand. To show actions on screen at all times, use a [toolbar](/material-web/3.0/components/toolbar/).
*   **Open it from many places.** A menu can open from a button, an icon button, a split button or a text field, or as a [context menu](#context-menu).
*   **Organize long menus.** Use [groups](#groups) with labels and dividers to separate related choices.
*   **Choose a color.** The `standard` color suits most menus; `vibrant` makes the selected items stand out.

## Anatomy

A menu holds items, groups and dividers. An item holds a label and optional slots, including a submenu.

**Example: A menu with a group, an item with all of its slots, a divider and another item**

*HTML*

```html
<md-gb-button id="more">More</md-gb-button>
<md-gb-menu id="more-menu">
  <md-gb-menu-group>
    <md-gb-menu-item>
      <md-gb-icon slot="leading">share</md-gb-icon>
      Share
      <span slot="supporting-text">Send a link</span>
      <span slot="trailing-text">Ctrl+S</span>
      <md-gb-icon slot="trailing">chevron_right</md-gb-icon>
      <md-gb-menu slot="submenu">
        <md-gb-menu-item>Email</md-gb-menu-item>
        <md-gb-menu-item>Messages</md-gb-menu-item>
      </md-gb-menu>
    </md-gb-menu-item>
  </md-gb-menu-group>
  <md-gb-divider></md-gb-divider>
  <md-gb-menu-item>Delete</md-gb-menu-item>
</md-gb-menu>
```

*TypeScript*

```ts
const menu = document.querySelector('#more-menu')!;
menu.showPopover({source: document.querySelector('#more')!});
```

## Examples

### Opening a menu

A menu is a popover. Point an `md-gb-button` (or `md-gb-icon-button`, or a native button) at it with `popovertarget`, or call `showPopover()` from script. The menu positions itself next to the button and closes on Escape, when focus leaves, or when an item is chosen.

**Example: A button that opens a menu of sort options**

```html
<md-gb-button popovertarget="sort-menu">Sort</md-gb-button>
<md-gb-menu id="sort-menu">
  <md-gb-menu-item>Name</md-gb-menu-item>
  <md-gb-menu-item>Date modified</md-gb-menu-item>
  <md-gb-menu-item>Size</md-gb-menu-item>
</md-gb-menu>
```

### Icons and supporting text

Fill the `leading`, `supporting-text`, `trailing-text` and `trailing` slots to add detail to an item.

**Example: Menu items with leading icons and keyboard shortcuts**

```html
<md-gb-button popovertarget="edit-menu">Edit</md-gb-button>
<md-gb-menu id="edit-menu">
  <md-gb-menu-item>
    <md-gb-icon slot="leading">content_cut</md-gb-icon>
    Cut
    <span slot="trailing-text">Ctrl+X</span>
  </md-gb-menu-item>
  <md-gb-menu-item>
    <md-gb-icon slot="leading">content_copy</md-gb-icon>
    Copy
    <span slot="trailing-text">Ctrl+C</span>
  </md-gb-menu-item>
  <md-gb-menu-item>
    <md-gb-icon slot="leading">content_paste</md-gb-icon>
    Paste
    <span slot="trailing-text">Ctrl+V</span>
  </md-gb-menu-item>
</md-gb-menu>
```

### Groups

Wrap related items in an `md-gb-menu-group`. Set `label` for a heading, and `checkable` to `single` or `multiple` to make the items selectable like radio buttons or checkboxes. Use `checked` on the selected items.

**Example: A menu with a single-select group and a multi-select group**

```html
<md-gb-button popovertarget="view-menu">View</md-gb-button>
<md-gb-menu id="view-menu">
  <md-gb-menu-group label="Sort by" checkable="single">
    <md-gb-menu-item checked>Name</md-gb-menu-item>
    <md-gb-menu-item>Date modified</md-gb-menu-item>
  </md-gb-menu-group>
  <md-gb-divider></md-gb-divider>
  <md-gb-menu-group label="Show" checkable="multiple">
    <md-gb-menu-item checked>Hidden files</md-gb-menu-item>
    <md-gb-menu-item>File extensions</md-gb-menu-item>
  </md-gb-menu-group>
</md-gb-menu>
```

### Grouped layout

Set `layout="grouped"` to show each group on its own surface with a gap between them, instead of one surface with dividers.

**Example: A menu with two groups on separate surfaces**

```html
<md-gb-button popovertarget="actions-menu">Actions</md-gb-button>
<md-gb-menu id="actions-menu" layout="grouped">
  <md-gb-menu-group>
    <md-gb-menu-item>Undo</md-gb-menu-item>
    <md-gb-menu-item>Redo</md-gb-menu-item>
  </md-gb-menu-group>
  <md-gb-menu-group>
    <md-gb-menu-item>Cut</md-gb-menu-item>
    <md-gb-menu-item>Copy</md-gb-menu-item>
    <md-gb-menu-item>Paste</md-gb-menu-item>
  </md-gb-menu-group>
</md-gb-menu>
```

### Vibrant color

Set `color="vibrant"` to use the tertiary color roles instead of the surface-based `standard` style.

**Example: A vibrant menu with a checked item**

```html
<md-gb-button popovertarget="theme-menu">Theme</md-gb-button>
<md-gb-menu id="theme-menu" color="vibrant">
  <md-gb-menu-group checkable="single">
    <md-gb-menu-item checked>System</md-gb-menu-item>
    <md-gb-menu-item>Light</md-gb-menu-item>
    <md-gb-menu-item>Dark</md-gb-menu-item>
  </md-gb-menu-group>
</md-gb-menu>
```

### Submenus

Put an `md-gb-menu` in an item's `submenu` slot. It opens beside the item on click, Enter, Space or the Right arrow key (Left in right-to-left layouts).

**Example: A menu item that opens a submenu**

```html
<md-gb-button popovertarget="share-menu">Share</md-gb-button>
<md-gb-menu id="share-menu">
  <md-gb-menu-item>Copy link</md-gb-menu-item>
  <md-gb-menu-item>
    Send to
    <md-gb-menu slot="submenu">
      <md-gb-menu-item>Email</md-gb-menu-item>
      <md-gb-menu-item>Message</md-gb-menu-item>
    </md-gb-menu>
  </md-gb-menu-item>
</md-gb-menu>
```

### Context menu

Set `context-for` to the id of an element to open the menu on a secondary click, the context menu key or a long press.

**Example: A menu that opens on right-click**

```html
<div id="photo" tabindex="0">Right-click or long press this photo</div>
<md-gb-menu context-for="photo">
  <md-gb-menu-item>Open in new window</md-gb-menu-item>
  <md-gb-menu-item>Save as</md-gb-menu-item>
  <md-gb-menu-item>Copy link</md-gb-menu-item>
</md-gb-menu>
```

### Density

Set `density` from `0` (default) down to `-3` to remove 4px of height per item for each step. Submenus inherit it. Keep it off by default and let people opt in.

**Example: A menu at density -2**

```html
<md-gb-button popovertarget="dense-menu">Open</md-gb-button>
<md-gb-menu id="dense-menu" density="-2">
  <md-gb-menu-item>Rename</md-gb-menu-item>
  <md-gb-menu-item>Duplicate</md-gb-menu-item>
  <md-gb-menu-item>Delete</md-gb-menu-item>
</md-gb-menu>
```

## Accessibility

*   The menu has `role="menu"`, and items have `role="menuitem"`, or `menuitemradio` and `menuitemcheckbox` in checkable groups.
*   On the button that opens the menu, Up and Down open it and focus the first item; Enter and Space open it natively.
*   In an open menu, Up and Down move between items (disabled items included), Home and End go to the first and last item, and typing a letter jumps to the next item that starts with it.
*   Escape and Tab close the menu and return focus to the button. Left (Right in right-to-left layouts) closes a submenu.
*   Give a menu that has no clear visible title an `aria-label`.

## API reference

### &lt;md-gb-menu&gt;

A Material Design component.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>color</code><br><span class="gb-desc">The color style: <code>standard</code> (surface-based) or <code>vibrant</code> (tertiary).</span> | <code>color</code> | <code>MenuColor</code> | <code>MENU_COLORS.standard</code> |
| <code>contextFor</code><br><span class="gb-desc">The id of an element (in the same root) that opens this menu as a context menu on a secondary click, the context menu key or a long press (menus.md "Context menus ... usually open with a secondary click"; "Performs a specific action to trigger the menu, like right-click or press-and-hold").</span> | <code>context-for</code> | <code>string</code> | <code>''</code> |
| <code>density</code><br><span class="gb-desc">The density, from 0 (default) to -3 (menus.md "Density": "On web only, density levels control the spacing between elements. Increasing density decreases the top and bottom padding"). Each step removes 4px from the items' height; submenus inherit it. Values are clamped to that range. Dense items are smaller than the 48px recommended target, so don't apply density by default; let people opt in (grids-spacing.md "Avoid applying component scaling by default").</span> | <code>density</code> | <code>Density</code> |  |
| <code>filterFor</code><br><span class="gb-desc">The id of a text field (in the same root) the menu is attached to. As the person types in it, the menu opens (without taking focus) and shows only the items whose label contains the text, case-insensitively (menus.md "Filtering": "As someone types, the list of menu options filters to show relevant results"). The remaining items ease into their new position ("Menu items ease into their new position as the menu is filtered"), unless motion is reduced. Fires <code>filter</code> with the query.</span> | <code>filter-for</code> | <code>string</code> | <code>''</code> |
| <code>layout</code><br><span class="gb-desc">The layout: <code>standard</code> items on one surface, or <code>grouped</code> <code>md-gb-menu-group</code>s on separate surfaces with gaps between them.</span> | <code>layout</code> | <code>MenuLayout</code> | <code>'standard'</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | The menu's items, groups and dividers. |

#### Methods

| Method | Description |
| --- | --- |
| <code>closeAll</code><br><span class="gb-desc">() =&gt; void</span> | Closes this menu and every menu it is a submenu of. |
| <code>filter</code><br><span class="gb-desc">(query: string) =&gt; void</span> | Shows only the items whose label contains <code>query</code>, easing the others into their new position. |
| <code>showAt</code><br><span class="gb-desc">(x: number, y: number) =&gt; void</span> | Opens the menu at a point in the viewport (a context menu), keeping it inside the window: it opens below and after the point, and flips when there is no room. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(menu)</code> | The menu's root element. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--container-color</code> |  |
| <code>--container-elevation</code> |  |
| <code>--container-max-width</code> |  |
| <code>--container-min-width</code> |  |
| <code>--container-shape</code> |  |
| <code>--density-step</code> | Item height removed per density step (set on the items). |
| <code>--gap</code> | Space between groups in the grouped layout. |
| <code>--group-padding</code> |  |
| <code>--group-shape</code> |  |
| <code>--section-label-text</code> |  |
| <code>--section-label-text-color</code> |  |

### &lt;md-gb-menu-group&gt;

A Material Design component.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>checkable</code> | <code>checkable</code> | <code>MenuItemCheckable</code> | <code>null</code> |
| <code>label</code><br><span class="gb-desc">The section label shown above the group's items.</span> | <code>label</code> | <code>string</code> | <code>''</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | Used to display the menu group's items. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(group)</code> | The group's root element. |
| <code>::part(label)</code> | The section label. |

### &lt;md-gb-menu-item&gt;

A Material Design component.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>checked</code> | <code>checked</code> | <code>boolean</code> | <code>false</code> |
| <code>disabled</code> | <code>disabled</code> | <code>boolean</code> | <code>false</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | Used to display the item's primary label. |
| <code>leading</code> | Used to display icons and content before the item's main content. |
| <code>submenu</code> | An <code>md-gb-menu</code> to open as this item's submenu. |
| <code>supporting-text</code> | Used to display supporting text below the main label. |
| <code>trailing</code> | Used to display icons and content after the item's main content. |
| <code>trailing-text</code> | Used to display metadata or text after the item's main content. |

#### Events

| Event | Description |
| --- | --- |
| <code>change</code><br><span class="gb-desc">Event</span> | Fired when a checkbox or menu item is checked or unchecked. |
| <code>input</code><br><span class="gb-desc">InputEvent</span> | Fired when a checkbox or menu item is checked or unchecked. |

#### Methods

| Method | Description |
| --- | --- |
| <code>closeSubmenu</code><br><span class="gb-desc">() =&gt; void</span> | Closes the item's submenu. |
| <code>openSubmenu</code><br><span class="gb-desc">(focus?: boolean) =&gt; void</span> | Opens the item's submenu next to it and focuses its first item. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(menu-item)</code> | The menu item's root element. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--between-space</code> |  |
| <code>--bottom-space</code> |  |
| <code>--container-color</code> |  |
| <code>--height</code> |  |
| <code>--inner-corner-corner-size</code> |  |
| <code>--label-text</code> |  |
| <code>--label-text-axes</code> |  |
| <code>--label-text-color</code> |  |
| <code>--label-text-tracking</code> |  |
| <code>--leading-icon-color</code> |  |
| <code>--leading-icon-size</code> |  |
| <code>--leading-space</code> |  |
| <code>--shape</code> |  |
| <code>--supporting-text</code> |  |
| <code>--supporting-text-axes</code> |  |
| <code>--supporting-text-color</code> |  |
| <code>--supporting-text-tracking</code> |  |
| <code>--top-space</code> |  |
| <code>--trailing-icon-color</code> |  |
| <code>--trailing-icon-size</code> |  |
| <code>--trailing-space</code> |  |
| <code>--trailing-supporting-text</code> |  |
| <code>--trailing-supporting-text-axes</code> |  |
| <code>--trailing-supporting-text-color</code> |  |
| <code>--trailing-supporting-text-tracking</code> |  |
