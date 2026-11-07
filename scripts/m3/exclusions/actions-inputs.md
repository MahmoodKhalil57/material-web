# Exclusions: buttons, cards, chips, carousel, FABs, text fields and inputs

Units of the cards, chips, carousel, FAB menu, split button, FAB, button
groups, text fields, time pickers, buttons, extended FAB, radio button and
search pages that no component code could satisfy. The format is in
README.md.

## Placement in the window is the app's layout

The FAB, extended FAB, FAB menu, search bar and carousel header live where the
app puts them; the components position nothing against the window (the FAB
menu is anchored to its FAB, which follows).

- FAB margins, corner and breakpoint placement <!-- spec-exclude: fab-menu-ad3024, fab-menu-faf950, fab-menu-1b9317, fab-menu-3c2923, fab-menu-9f5bce, fab-menu-eb27da, fab-menu-90602c, fab-menu-f3a719, fab-menu-f9f0ef, fab-menu-499aa8, fab-menu-e00cda, fab-menu-9872c4, fab-menu-afa22b, fab-menu-0f79bc, fab-menu-e99445, extended-fab-cf46c9, extended-fab-78e667, extended-fab-d8db3d, extended-fab-66c965, extended-fab-4cbe06, extended-fab-4d4bb1, extended-fab-af29a0, extended-fab-825994, extended-fab-1796f9, floating-action-button-393e06, floating-action-button-7141df, floating-action-button-89715a, floating-action-button-770c24 -->
- Search bar window margins, scroll behavior of the bar, and the app choosing `docked` per breakpoint <!-- spec-exclude: search-76b9af, search-4f12ed, search-afefe5, search-0263a0, search-491c12, search-4994b8, search-0c4253, search-f8cb7f, search-06b9df -->
- Spacing between cards in a collection <!-- spec-exclude: cards-389bf7, cards-98ded7 -->
- The FAB stays in place on scroll because the app positions it fixed <!-- spec-exclude: floating-action-button-05e7e7, floating-action-button-62aecb -->
- A button group's end-call style button outside the group is the app's layout <!-- spec-exclude: button-groups-02d2c6 -->
- The FAB menu gap to its FAB is a recommendation that may vary (the measurement row is skipped for this reason) <!-- spec-exclude: fab-menu-819eb6 -->
- The app picks the sizes and shapes inside a group (a group follows its buttons) <!-- spec-exclude: button-groups-ee09ab -->

## Do not hide a focus indicator behind a FAB or FAB menu

Where the FAB goes is the app's layout, so avoiding covering a focus
indicator is the app's job.

- Obscuring actionable elements <!-- spec-exclude: fab-menu-cba577, fab-menu-ee32ed, fab-menu-308cfa, fab-menu-eb3d97, floating-action-button-453ff1, floating-action-button-805473, floating-action-button-802239, floating-action-button-908da3 -->

## Motion patterns the app applies (enter and exit, container transform, tabs)

The shared transition patterns live in `labs/gb/styles/motion/transitions`;
the app wraps the FAB, card, chip or menu item in them. The components have no
transition of their own to appear, morph into a screen, or change with tabs.

- FAB, extended FAB, card, chip and FAB menu item transitions <!-- spec-exclude: floating-action-button-d48d2b, floating-action-button-b3366b, floating-action-button-ecd4de, floating-action-button-1486b5, floating-action-button-bb41d7, floating-action-button-217cba, floating-action-button-f3cb02, floating-action-button-bd8050, floating-action-button-1371e0, floating-action-button-f933e8, floating-action-button-9f19e7, floating-action-button-e21310, extended-fab-cba950, extended-fab-f065a8, extended-fab-3bdd26, extended-fab-2fb2ee, fab-menu-fdbc42, fab-menu-d5787e, fab-menu-66da40, cards-c5ccaa, cards-9ba0cf, cards-1d7900, chips-98cc93, chips-ef9005, chips-52d788 -->

## Usage advice for designers and app authors

Content, copy, color choices and which component to use; no library code
could enforce them.

- Cards: content blocks, media, text, actions and swipe or move gestures are the app's markup and gesture code <!-- spec-exclude: cards-5d98af, cards-7bddec, cards-f2126f, cards-7a9322, cards-67d394, cards-b4f42a, cards-142293, cards-89c645, cards-d367a3, cards-1a85a7, cards-31c01b, cards-600930, cards-908ff6, cards-b861cc, cards-1767b9, cards-3da4e1, cards-d41619, cards-9304ad, cards-00979c, cards-4fa476, cards-45bd77, cards-0961d9, cards-04869a, cards-13625c, cards-4424ec, cards-413e8b, cards-9feddd, cards-d6850d, cards-80fdc8, cards-807b66, cards-d56c09, cards-3be8a3 -->
- Carousel: text amounts and sizes, the Show all button and the header arrow are the app's content and composition <!-- spec-exclude: carousel-b1a485, carousel-5ccbc2, carousel-6c3bc6, carousel-450be7, carousel-d90831, carousel-2478c0, carousel-54de48, carousel-58e3c1, carousel-c2935d, carousel-0b8d97, carousel-b34131, carousel-74e263, carousel-1e1a38, carousel-42f4d4, carousel-5caf04, carousel-80c0ae -->
- Chips: when to use which chip, progress feedback, menus on filter chips, input chips inside a text field, and the outline color the app picks for interactivity <!-- spec-exclude: chips-65e0c0, chips-ef7240, chips-2b4160, chips-2967a4, chips-5fe2da, chips-265b17, chips-2dfbfd, chips-eb2664, chips-64e39d, chips-69e3be, chips-d82ee4, chips-54a40c, chips-7b841d, chips-1c5b3e, chips-dd749a, chips-312053, chips-61b0c4, chips-f151ae -->
- Buttons: loose descriptions of the color styles, color contrast of the theme, truncated labels and the rapid-click motion curve <!-- spec-exclude: buttons-792a27, buttons-d9facc, buttons-92ecd4, buttons-c6c8bf, buttons-723245, buttons-268ea8, buttons-773e09, buttons-a07234 -->
- Radio buttons: the label text and the radio group container are the app's markup <!-- spec-exclude: radio-button-87af7c, radio-button-963c27, radio-button-256a10, radio-button-b7290e, radio-button-7a92a0, radio-button-91218b -->
- Text fields: label text, adjacent labels, density controls, adaptive margins and the accessibility labels of icons the app slots in <!-- spec-exclude: text-fields-59e8ee, text-fields-7ac002, text-fields-845226, text-fields-223a86, text-fields-189191, text-fields-5eeaa8, text-fields-07b7a5, text-fields-30c6ab, text-fields-2bf384, text-fields-d39c10, text-fields-05f643, text-fields-0e79d9 -->
- Split button: the labels the app gives its buttons and its menu <!-- spec-exclude: split-button-c0d688, split-button-f1f050, split-button-2eaf37 -->
- The extended FAB's place in the focus order follows the app's DOM order <!-- spec-exclude: extended-fab-913ef8 -->
- Time picker: which picker to default to is the app's choice <!-- spec-exclude: time-pickers-c31feb -->

## Deprecated or platform-only styles

- Surface color styles of FABs are deprecated and not offered <!-- spec-exclude: floating-action-button-bf45ec, floating-action-button-b8e071, extended-fab-4d92e3, extended-fab-470e19 -->
- Android Views behavior <!-- spec-exclude: time-pickers-6d577c -->

## The unit is a list label, figure caption or color-role name

- States list labels of search results (the results are app-supplied list items with their own states) <!-- spec-exclude: search-d6b559, search-26072e, search-6b571e, search-845498 -->
- A selected state of the baseline menu item, inherited from the menu component <!-- spec-exclude: fab-menu-707a36 -->
- A color-role list label, covered by the token tests <!-- spec-exclude: time-pickers-5d4879 -->
- Supporting text and error text never show together (the error replaces the supporting text, text-fields-a273a8) <!-- spec-exclude: text-fields-ad2b4b, text-fields-a04117 -->
