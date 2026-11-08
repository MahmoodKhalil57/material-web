# Scaffold

A scaffold arranges the bars, rails and panes around an app's content, and adapts them to the window size.

**Example: An app scaffold with an app bar, a navigation bar, a navigation rail and content**

```html
<md-gb-app-scaffold style="inline-size: 100%; block-size: 360px">
  <md-gb-app-bar slot="top-app-bar">Inbox</md-gb-app-bar>
  <md-gb-nav-bar slot="navigation-bar" aria-label="Primary">
    <md-gb-nav-bar-item active>
      <md-gb-icon slot="icon">inbox</md-gb-icon>
      Inbox
    </md-gb-nav-bar-item>
    <md-gb-nav-bar-item>
      <md-gb-icon slot="icon">send</md-gb-icon>
      Sent
    </md-gb-nav-bar-item>
  </md-gb-nav-bar>
  <md-gb-nav-rail slot="navigation-rail" aria-label="Primary">
    <md-gb-nav-rail-item selected>
      <md-gb-icon slot="icon">inbox</md-gb-icon>
      Inbox
    </md-gb-nav-rail-item>
    <md-gb-nav-rail-item>
      <md-gb-icon slot="icon">send</md-gb-icon>
      Sent
    </md-gb-nav-rail-item>
  </md-gb-nav-rail>
  <p>Your messages appear here.</p>
</md-gb-app-scaffold>
```

## Usage guidelines

*   **Structure the app in bars, rails and panes.** Bars frame the page, rails run along its edges, and panes hold the content.
*   **Provide both navigation components.** Give the scaffold a navigation bar and a navigation rail with the same destinations. It shows the bar in compact windows and the rail from medium windows up, and you keep their selection in sync.
*   **Pick the pane layout by content.** Use [list-detail](#list-detail) for a collection and its details, [supporting pane](#supporting-pane) for a focus area with related content, and [feed](#feed) for a grid of items.
*   **Use one to three panes.** The number of visible panes follows the window size.

This component is new in [M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive).

## Anatomy

`md-gb-app-scaffold` places bars and rails around its content. `md-gb-pane-scaffold` goes in the content and arranges the panes.

**Example: An app scaffold with a top app bar, navigation, a FAB and a pane scaffold**

```html
<md-gb-app-scaffold style="inline-size: 100%; block-size: 360px">
  <md-gb-app-bar slot="top-app-bar">Notes</md-gb-app-bar>
  <md-gb-nav-bar slot="navigation-bar" aria-label="Primary">
    <md-gb-nav-bar-item active>
      <md-gb-icon slot="icon">notes</md-gb-icon>
      Notes
    </md-gb-nav-bar-item>
    <md-gb-nav-bar-item>
      <md-gb-icon slot="icon">archive</md-gb-icon>
      Archive
    </md-gb-nav-bar-item>
  </md-gb-nav-bar>
  <md-gb-nav-rail slot="navigation-rail" aria-label="Primary">
    <md-gb-nav-rail-item selected>
      <md-gb-icon slot="icon">notes</md-gb-icon>
      Notes
    </md-gb-nav-rail-item>
    <md-gb-nav-rail-item>
      <md-gb-icon slot="icon">archive</md-gb-icon>
      Archive
    </md-gb-nav-rail-item>
  </md-gb-nav-rail>
  <md-gb-fab slot="fab" aria-label="New note">
    <md-gb-icon>add</md-gb-icon>
  </md-gb-fab>
  <md-gb-pane-scaffold>
    <md-gb-list slot="secondary" aria-label="Notes">
      <md-gb-list-item>Groceries</md-gb-list-item>
      <md-gb-list-item>Trip ideas</md-gb-list-item>
    </md-gb-list>
    <article>
      <h2>Groceries</h2>
      <p>Milk, eggs and bread.</p>
    </article>
    <p slot="placeholder">Select a note</p>
  </md-gb-pane-scaffold>
</md-gb-app-scaffold>
```

## Examples

### List-detail

The default layout shows a list in the `secondary` slot and its detail in the default slot. In windows with one pane they take turns: call `openDetail()` when someone picks an item and `closeDetail()` from a back button. The `placeholder` slot fills the detail pane until one is open.

**Example: A list-detail layout with a list of conversations and an empty detail pane**

```html
<md-gb-pane-scaffold style="inline-size: 100%; block-size: 240px">
  <md-gb-list slot="secondary" aria-label="Conversations">
    <md-gb-list-item>Ali Connors</md-gb-list-item>
    <md-gb-list-item>Sandra Adams</md-gb-list-item>
    <md-gb-list-item>Trevor Hansen</md-gb-list-item>
  </md-gb-list>
  <article>
    <h2>Brunch this weekend?</h2>
    <p>From Ali Connors</p>
  </article>
  <p slot="placeholder">Select a conversation</p>
</md-gb-pane-scaffold>
```

### Supporting pane

Set `layout="supporting-pane"` for a focus area in the default slot with related content in the `secondary` slot, at the trailing side by default.

**Example: A focus pane with a supporting pane of related notes**

```html
<md-gb-pane-scaffold layout="supporting-pane" style="inline-size: 100%; block-size: 360px">
  <article>
    <h2>Quarterly plan</h2>
    <p>The goals and milestones for the next three months.</p>
  </article>
  <aside slot="secondary">
    <h3>Related notes</h3>
    <p>Budget review</p>
  </aside>
</md-gb-pane-scaffold>
```

### Feed

Set `layout="feed"` to lay the default slot's items out on a grid, with an optional `secondary` pane beside it.

**Example: A feed of four cards**

```html
<md-gb-pane-scaffold layout="feed" style="inline-size: 100%; block-size: 240px">
  <md-gb-card>Lemon pasta</md-gb-card>
  <md-gb-card>Sourdough</md-gb-card>
  <md-gb-card>Pad thai</md-gb-card>
  <md-gb-card>Summer salad</md-gb-card>
</md-gb-pane-scaffold>
```

### Resizable panes

Add `resizable` to a two-pane layout to show a drag handle between the panes. `pane-width` sets the width of the `secondary` pane in pixels, and `collapsed-pane` records a pane collapsed with the handle. The scaffold fires `pane-resize` when the panes change size.

**Example: A two-pane layout with a drag handle between the panes**

```html
<md-gb-pane-scaffold resizable pane-width="240" style="inline-size: 100%; block-size: 240px">
  <md-gb-list slot="secondary" aria-label="Folders">
    <md-gb-list-item>Inbox</md-gb-list-item>
    <md-gb-list-item>Drafts</md-gb-list-item>
  </md-gb-list>
  <article>
    <h2>Inbox</h2>
    <p>Drag the handle to resize the list.</p>
  </article>
</md-gb-pane-scaffold>
```

### Floating and docked panes

When there is no room for a supporting pane beside the content, set `levitate` to `floating` or `docked` to lift the `secondary` pane above it instead of stacking it below. A docked pane sits at the bottom edge on compact windows, like a bottom sheet. Open it with `openLevitated()` and close it with `closeLevitated()`. Add `levitate-modal` for a scrim, and `levitate-label` to name the pane.

**Example: A button that opens a floating supporting pane of comments**

*HTML*

```html
<md-gb-button id="comments-button">Comments</md-gb-button>
<md-gb-pane-scaffold layout="supporting-pane" levitate="floating" levitate-label="Comments">
  <article>
    <h2>Quarterly plan</h2>
    <p>The goals and milestones for the next three months.</p>
  </article>
  <aside slot="secondary">
    <h3>Comments</h3>
    <p>Looks good to me.</p>
  </aside>
</md-gb-pane-scaffold>
```

*CSS*

```css
md-gb-pane-scaffold {
  inline-size: 100%;
  block-size: 280px;
}
```

*TypeScript*

```ts
const scaffold = document.querySelector('md-gb-pane-scaffold')!;
document.querySelector('#comments-button')!.addEventListener('click', () => {
  scaffold.openLevitated();
});
```

## Accessibility

*   Give each navigation component an `aria-label`, such as "Primary navigation", and keep the bar and rail selections in sync.
*   In a single-pane list-detail layout, provide a back button that calls `closeDetail()`.
*   A modal levitated pane takes focus, closes with Escape and when someone uses the content behind it, and is named by `levitate-label`.
*   A floating pane's move and resize handles also work with the arrow keys. Use `drag-handle-label`, `levitate-move-label` and `levitate-resize-label` to translate their names.

## API reference

### &lt;md-gb-app-scaffold&gt;

A Material Design app scaffold (bars, rails, FAB, snackbar).

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>autoExpandRail</code><br><span class="gb-desc">Whether to expand a slotted navigation rail at large and extra-large windows and collapse it below (spec: breakpoints, swapping components). Applied when the window size class changes.</span> | <code>auto-expand-rail</code> | <code>boolean</code> | <code>false</code> |
| <code>navigation</code><br><span class="gb-desc">Which navigation component to show.</span> | <code>navigation</code> | <code>ScaffoldNavigation</code> | <code>'auto'</code> |
| <code>sideSheetNavigation</code><br><span class="gb-desc">What the navigation rail does while a side sheet is present (spec: breakpoints and scaffold): <code>keep</code> it as is, <code>collapse</code> it to the collapsed rail, or <code>hide</code> it completely. A side sheet is present while the nested pane scaffold shows its tertiary pane or <code>side-sheet-open</code> is set.</span> | <code>side-sheet-navigation</code> | <code>SideSheetNavigation</code> | <code>'keep'</code> |
| <code>sideSheetOpen</code><br><span class="gb-desc">Whether an app-managed side sheet is open.</span> | <code>side-sheet-open</code> | <code>boolean</code> | <code>false</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | The content, typically an <code>md-gb-pane-scaffold</code>. Scrolls. |
| <code>companion-rail</code> | A companion rail on the trailing side of large and extra-large windows, holding supporting controls or actions that modify or relate to the content in a pane. |
| <code>fab</code> | A FAB, 16px from the trailing and bottom edges of the content. |
| <code>navigation-bar</code> | A navigation bar (<code>md-gb-nav-bar</code>) at the bottom. |
| <code>navigation-rail</code> | A navigation rail (<code>md-gb-nav-rail</code>) at the leading edge. |
| <code>snackbar</code> | A snackbar host (<code>md-gb-snackbar</code>), above the FAB. |
| <code>toolbar</code> | A toolbar floating in the bottom rail region, centered above the navigation bar (mobile). |
| <code>top-app-bar</code> | A top app bar (<code>md-gb-app-bar</code>), beside the rail. |

#### Events

| Event | Description |
| --- | --- |
| <code>navigation-change</code><br><span class="gb-desc">CustomEvent&lt;NavigationChangeDetail&gt;</span> | Fired when the shown navigation component changes. |
| <code>window-class-change</code><br><span class="gb-desc">CustomEvent&lt;WindowClassChangeDetail&gt;</span> | Fired when the window size class changes. |
| <code>window-height-class-change</code><br><span class="gb-desc">CustomEvent&lt;WindowHeightClassChangeDetail&gt;</span> | Fired when the window height size class changes. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(body)</code> | The content region (content, FAB and snackbar). |
| <code>::part(companion-rail)</code> | The companion rail region. |
| <code>::part(content)</code> | The scrolling content container. |
| <code>::part(navigation-bar)</code> | The navigation bar region. |
| <code>::part(rail)</code> | The navigation rail region. |
| <code>::part(scaffold)</code> | The scaffold grid. |
| <code>::part(toolbar)</code> | The floating toolbar region. |
| <code>::part(top-app-bar)</code> | The top app bar region. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--container-color</code> | Scaffold background. |
| <code>--content-color</code> | Scaffold content color. |
| <code>--scrollbar-gutter</code> | <code>stable</code> reserves the content's scrollbar gutter, so a scrollbar that appears doesn't move the content (default <code>auto</code>: the pane widths are measured to the edges). |

### &lt;md-gb-pane-scaffold&gt;

A Material Design pane scaffold (list-detail, supporting pane, feed).

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>arrangement</code><br><span class="gb-desc">How two panes share the width.</span> | <code>arrangement</code> | <code>PaneArrangement</code> | <code>'fixed-flexible'</code> |
| <code>collapsedPane</code><br><span class="gb-desc">A pane collapsed with the drag handle, or null.</span> | <code>collapsed-pane</code> | <code>"primary" | "secondary"</code> | <code>null</code> |
| <code>detailOpen</code><br><span class="gb-desc">List-detail: whether an item is selected. Single-pane windows show the detail (primary) pane when true and the list (secondary) pane when false; two-pane windows show the <code>placeholder</code> slot instead of the detail while false.</span> | <code>detail-open</code> | <code>boolean</code> | <code>false</code> |
| <code>dragHandleLabel</code><br><span class="gb-desc">Accessible label of the drag handle.</span> | <code>drag-handle-label</code> | <code>string</code> | <code>'Resize panes'</code> |
| <code>handleTap</code><br><span class="gb-desc">What a tap, Enter or Space on the drag handle does, the single-pointer alternative to dragging it: <code>toggle</code> (default) switches between one and two panes; <code>cycle</code> steps through the snap widths and then collapses the secondary pane.</span> | <code>handle-tap</code> | <code>PaneHandleTap</code> | <code>'toggle'</code> |
| <code>layout</code><br><span class="gb-desc">The canonical layout.</span> | <code>layout</code> | <code>PaneScaffoldLayout</code> | <code>'list-detail'</code> |
| <code>levitate</code><br><span class="gb-desc">The levitate strategy for the secondary pane of supporting pane and feed layouts in windows too small for two panes: <code>none</code> reflows it below the primary pane, <code>floating</code> floats it above, <code>docked</code> docks it to the bottom edge at compact (floating from medium).</span> | <code>levitate</code> | <code>PaneLevitate</code> | <code>'none'</code> |
| <code>levitateCoplanar</code><br><span class="gb-desc">Keeps a levitated pane co-planar at large and extra-large windows. By default it floats there (spec: scaffold, "On large screens: floating panes are the default").</span> | <code>levitate-coplanar</code> | <code>boolean</code> | <code>false</code> |
| <code>levitateDraggable</code><br><span class="gb-desc">Lets a floating pane be dragged by its handle, or moved with the arrow keys while the handle is focused (spec: scaffold, floating panes "can be customized to be dragged or resized").</span> | <code>levitate-draggable</code> | <code>boolean</code> | <code>false</code> |
| <code>levitateLabel</code><br><span class="gb-desc">Accessible label of a modal levitated pane (its dialog role).</span> | <code>levitate-label</code> | <code>string</code> | <code>''</code> |
| <code>levitateModal</code><br><span class="gb-desc">Whether the levitated secondary pane is modal (scrim, inert panes).</span> | <code>levitate-modal</code> | <code>boolean</code> | <code>false</code> |
| <code>levitateMoveLabel</code><br><span class="gb-desc">Accessible label of the floating pane's move handle.</span> | <code>levitate-move-label</code> | <code>string</code> | <code>'Move pane'</code> |
| <code>levitateOpen</code><br><span class="gb-desc">Whether the levitated secondary pane is shown.</span> | <code>levitate-open</code> | <code>boolean</code> | <code>false</code> |
| <code>levitateResizable</code><br><span class="gb-desc">Lets a floating pane be resized by its corner handle, or with the arrow keys while the handle is focused.</span> | <code>levitate-resizable</code> | <code>boolean</code> | <code>false</code> |
| <code>levitateResizeLabel</code><br><span class="gb-desc">Accessible label of the floating pane's resize handle.</span> | <code>levitate-resize-label</code> | <code>string</code> | <code>'Resize pane'</code> |
| <code>mediumTwoPane</code><br><span class="gb-desc">Whether medium windows show two panes (50% each) instead of one. The spec limits this to low-density content such as settings.</span> | <code>medium-two-pane</code> | <code>boolean</code> | <code>false</code> |
| <code>paneWidth</code><br><span class="gb-desc">Width in px of the secondary pane set with the drag handle, or null for the default width. Set it to restore a persisted width.</span> | <code>pane-width</code> | <code>number</code> | <code>null</code> |
| <code>resizable</code><br><span class="gb-desc">Whether two-pane layouts render a drag handle to resize the panes.</span> | <code>resizable</code> | <code>boolean</code> | <code>false</code> |
| <code>resizeBehavior</code><br><span class="gb-desc"><code>persistent</code> keeps a resized width or collapsed pane across window size class changes; <code>temporary</code> returns to the default layout. Defaults to persistent for list-detail and temporary for the other layouts.</span> | <code>resize-behavior</code> | <code>PaneResizeBehavior</code> | <code>undefined</code> |
| <code>scrollLabel</code><br><span class="gb-desc">Accessible label of the stacked panes' scroll region. Only used while the stacked panes overflow and hold nothing focusable: the region is then focusable (so the keyboard can scroll it) and a labelled <code>region</code>.</span> | <code>scroll-label</code> | <code>string</code> | <code>'Panes'</code> |
| <code>secondaryPosition</code><br><span class="gb-desc">Where the secondary pane sits in two-pane layouts. Defaults to <code>start</code> for list-detail and <code>end</code> for supporting pane and feed layouts. Mirrors in right-to-left.</span> | <code>secondary-position</code> | <code>PanePosition</code> | <code>undefined</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | The primary (flexible) pane: the detail pane of a list-detail layout, the focus pane of a supporting pane layout, or the feed items (laid out on a grid) of a feed layout. |
| <code>placeholder</code> | Shown in the primary pane of a two-pane list-detail layout while <code>detail-open</code> is false (no item selected). Levitate (spec: scaffold, "Levitate"): with <code>levitate="floating"</code> or <code>levitate="docked"</code>, the secondary pane of a supporting pane or feed layout floats above the primary pane (or docks to the bottom edge at compact, like a bottom sheet) in windows too small for two co-planar panes, while <code>levitate-open</code> is set. <code>levitate-modal</code> makes it modal: a scrim covers the panes, the primary pane is inert, focus moves into the pane and back to the trigger, and the pane closes when something behind it is used or Escape is pressed. Modality is scoped to the scaffold; use <code>md-gb-dialog</code> or <code>md-gb-sheet</code> for app-wide modals. At large and extra-large windows a levitated pane keeps floating (spec: "On large screens, floating panes are the default"); the scrim is optional (<code>levitate-modal</code> adds it). <code>levitate-coplanar</code> opts into a co-planar pane there instead. <code>levitate-draggable</code> and <code>levitate-resizable</code> add a move handle and a resize corner to a floating pane: drag them, or focus them and use the arrow keys (Shift moves in larger steps). <code>levitate-change</code> fires after each move or resize. Foldables: the scaffold reads the fold (hinge) from the Viewport Segments API and keeps panes off it. A vertical fold splits two panes at the fold with the spacer on it (at least the spacer width); a horizontal fold (tabletop) stacks the supporting pane below it. The fold crossing the scaffold is reflected as the <code>fold</code> attribute (<code>vertical</code> or <code>horizontal</code>). Browsers without the API keep the regular layout. |
| <code>secondary</code> | The secondary pane: the list of a list-detail layout or the supporting pane. It is the fixed pane in fixed-and-flexible arrangements. |
| <code>tertiary</code> | An optional third pane (e.g. a standard side sheet), shown at extra-large only. |

#### Events

| Event | Description |
| --- | --- |
| <code>levitate-close</code><br><span class="gb-desc">Event</span> | Fired when the scaffold closes a levitated pane (Escape, or using something behind a modal pane). |
| <code>pane-layout-change</code><br><span class="gb-desc">CustomEvent&lt;PaneLayoutChangeDetail&gt;</span> | Fired when the visible panes change. |
| <code>pane-resize</code><br><span class="gb-desc">CustomEvent&lt;PaneResizeDetail&gt;</span> | Fired when the panes are resized or collapsed with the drag handle. |
| <code>window-class-change</code><br><span class="gb-desc">CustomEvent&lt;WindowClassChangeDetail&gt;</span> | Fired when the window size class changes. |
| <code>window-height-class-change</code><br><span class="gb-desc">CustomEvent&lt;WindowHeightClassChangeDetail&gt;</span> | Fired when the window height size class changes. |

#### Methods

| Method | Description |
| --- | --- |
| <code>closeDetail</code><br><span class="gb-desc">() =&gt; void</span> | List-detail: returns to the list (e.g. from the detail pane's back button in a single-pane window). |
| <code>closeLevitated</code><br><span class="gb-desc">() =&gt; void</span> | Hides the levitated secondary pane. |
| <code>measureFold</code><br><span class="gb-desc">() =&gt; void</span> | Finds where the viewport's fold crosses the scaffold. Call it after moving the scaffold without resizing it. |
| <code>openDetail</code><br><span class="gb-desc">() =&gt; void</span> | List-detail: shows the detail pane (e.g. after selecting an item). |
| <code>openLevitated</code><br><span class="gb-desc">() =&gt; void</span> | Shows the levitated secondary pane. |
| <code>resetPaneWidth</code><br><span class="gb-desc">() =&gt; void</span> | Returns the panes to their default widths. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(drag-handle)</code> | The drag handle. |
| <code>::part(pane)</code> | Each pane. |
| <code>::part(primary)</code> | The primary pane. |
| <code>::part(scaffold)</code> | The flex container of the panes. |
| <code>::part(scrim)</code> | The scrim behind a modal levitated pane. |
| <code>::part(secondary)</code> | The secondary pane. |
| <code>::part(spacer)</code> | The spacer between panes. |
| <code>::part(tertiary)</code> | The tertiary pane. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--feed-columns</code> | Overrides the number of feed grid columns. |
| <code>--md-gb-scaffold-companion-inline-size</code> | Width of a companion rail on the trailing side of the scaffold. Set by <code>md-gb-app-scaffold</code>. |
| <code>--md-gb-scaffold-nav-inline-size</code> | Width of a navigation rail beside the scaffold, so split panes keep the spacer centered in the window. Set by <code>md-gb-app-scaffold</code>. |
| <code>--pane-container-color</code> | Pane background (transparent: panes blend with the background, implicit grouping). |
| <code>--pane-container-shape</code> | Pane corner radius. |
| <code>--scrollbar-gutter</code> | <code>stable</code> reserves the panes' scrollbar gutters, so a scrollbar that appears doesn't move their content (default <code>auto</code>: the spacer is centered on the pane edges). |
