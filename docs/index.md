---
permalink: /3.0/
eleventyExcludeFromCollections: true
indexPage: true
title: Home
section: about
description: Material Web 3.0 is a library of web components that follow Material 3 Expressive, Google's design system, for any framework or none.
---
<md-gb-stack direction="row" wrap align-items="center" justify-content="space-between" gap="600">
<md-gb-stack gap="300">
<div><md-gb-button color="tonal" size="xs" href="/3.0/about/intro/">Material 3 Expressive, as web components<md-gb-icon>arrow_forward</md-gb-icon></md-gb-button></div>
<md-gb-typography scale="display-md"><h1>Material Design for the web</h1></md-gb-typography>
<md-gb-typography scale="title-lg" color="on-surface-variant"><p>Accessible components that follow Material 3 Expressive, for any framework or none. Shapes that morph, motion on springs, color from a single seed.</p></md-gb-typography>
<md-gb-stack direction="row" wrap gap="100">
<md-gb-button color="filled" size="md" href="/3.0/about/quick-start/">Get started</md-gb-button>
<md-gb-button color="tonal" size="md" href="/3.0/components/">View components</md-gb-button>
</md-gb-stack>
</md-gb-stack>
<md-gb-stack direction="row" wrap align-items="center" gap="200">
<md-gb-shape shape="cookie12Sided" to="cookie9Sided" loop color="primary-container" size="120"></md-gb-shape>
<md-gb-shape shape="clover4Leaf" to="puffy" loop delay="1" color="tertiary-container" size="72"></md-gb-shape>
<md-gb-shape shape="sunny" to="verySunny" loop delay="2" color="secondary-container" size="96"></md-gb-shape>
<md-gb-shape shape="pill" to="oval" loop delay="3" color="tertiary-container" size="72"></md-gb-shape>
<md-gb-shape shape="softBurst" to="burst" loop delay="1" color="secondary-container" size="96"></md-gb-shape>
</md-gb-stack>
</md-gb-stack>

## Explore the system

<md-gb-grid span="2">
<md-gb-card color="filled" href="/3.0/styles/color/">
<md-gb-stack align-items="center" gap="150" padding-block="300">
<md-gb-shape shape="cookie9Sided" to="flower" morph-on-hover color="primary-container" size="72"><md-gb-icon>palette</md-gb-icon></md-gb-shape>
<md-gb-typography scale="title-md"><h3 id="explore-color">Color</h3></md-gb-typography>
</md-gb-stack>
</md-gb-card>
<md-gb-card color="filled" href="/3.0/styles/shape/">
<md-gb-stack align-items="center" gap="150" padding-block="300">
<md-gb-shape shape="clover8Leaf" to="clover4Leaf" morph-on-hover color="tertiary-container" size="72"><md-gb-icon>category</md-gb-icon></md-gb-shape>
<md-gb-typography scale="title-md"><h3 id="explore-shape">Shape</h3></md-gb-typography>
</md-gb-stack>
</md-gb-card>
<md-gb-card color="filled" href="/3.0/styles/motion/">
<md-gb-stack align-items="center" gap="150" padding-block="300">
<md-gb-shape shape="burst" to="softBurst" morph-on-hover color="secondary-container" size="72"><md-gb-icon>animation</md-gb-icon></md-gb-shape>
<md-gb-typography scale="title-md"><h3 id="explore-motion">Motion</h3></md-gb-typography>
</md-gb-stack>
</md-gb-card>
<md-gb-card color="filled" href="/3.0/styles/typography/">
<md-gb-stack align-items="center" gap="150" padding-block="300">
<md-gb-shape shape="flower" to="cookie9Sided" morph-on-hover color="primary-container" size="72"><md-gb-icon>text_fields</md-gb-icon></md-gb-shape>
<md-gb-typography scale="title-md"><h3 id="explore-typography">Typography</h3></md-gb-typography>
</md-gb-stack>
</md-gb-card>
<md-gb-card color="filled" href="/3.0/components/">
<md-gb-stack align-items="center" gap="150" padding-block="300">
<md-gb-shape shape="puffy" to="puffyDiamond" morph-on-hover color="tertiary-container" size="72"><md-gb-icon>widgets</md-gb-icon></md-gb-shape>
<md-gb-typography scale="title-md"><h3 id="explore-components">Components</h3></md-gb-typography>
</md-gb-stack>
</md-gb-card>
<md-gb-card color="filled" href="/3.0/foundations/accessibility/">
<md-gb-stack align-items="center" gap="150" padding-block="300">
<md-gb-shape shape="gem" to="pentagon" morph-on-hover color="secondary-container" size="72"><md-gb-icon>accessibility_new</md-gb-icon></md-gb-shape>
<md-gb-typography scale="title-md"><h3 id="explore-accessibility">Accessibility</h3></md-gb-typography>
</md-gb-stack>
</md-gb-card>
</md-gb-grid>

## Built from the components

<md-gb-grid span="4">
<md-gb-card color="outlined" aria-label="Controls">
<md-gb-stack gap="300" padding-block="200">
<md-gb-stack direction="row" wrap gap="100">
<md-gb-button color="filled">Button<md-gb-icon>arrow_forward</md-gb-icon></md-gb-button>
<md-gb-button color="tonal">Tonal</md-gb-button>
<md-gb-button color="outlined">Outlined</md-gb-button>
</md-gb-stack>
<md-gb-text-field label="Name" variant="outlined"><md-gb-icon slot="leading-icon">search</md-gb-icon></md-gb-text-field>
<md-gb-text-field label="Message" variant="outlined" type="textarea" rows="3"></md-gb-text-field>
<md-gb-stack direction="row" wrap align-items="center" justify-content="space-between" gap="100">
<md-gb-chip-set aria-label="Topics">
<md-gb-chip type="filter" selected>Design</md-gb-chip>
<md-gb-chip type="filter">Code</md-gb-chip>
</md-gb-chip-set>
<md-gb-stack direction="row" align-items="center" gap="100">
<md-gb-radio name="home-plan" value="a" checked aria-label="Option A"></md-gb-radio>
<md-gb-checkbox checked aria-label="Subscribe"></md-gb-checkbox>
<md-gb-switch selected aria-label="Notifications"></md-gb-switch>
</md-gb-stack>
</md-gb-stack>
<md-gb-button-group aria-label="Text alignment">
<md-gb-button color="tonal">Left</md-gb-button>
<md-gb-button color="tonal">Center</md-gb-button>
<md-gb-button color="tonal">Right</md-gb-button>
</md-gb-button-group>
</md-gb-stack>
</md-gb-card>
<md-gb-card color="outlined">
<md-gb-stack gap="300" padding-block="200">
<md-gb-stack direction="row" align-items="center" gap="200">
<md-gb-shape shape="cookie9Sided" to="flower" morph-on-hover color="tertiary-container" size="56"><md-gb-icon>library_music</md-gb-icon></md-gb-shape>
<md-gb-stack gap="0">
<md-gb-typography scale="title-md"><h3 id="golden-hour">Golden hour</h3></md-gb-typography>
<md-gb-typography scale="body-md" color="on-surface-variant"><p>The Tonal Palettes</p></md-gb-typography>
</md-gb-stack>
</md-gb-stack>
<md-gb-slider aria-label="Position" value="35"></md-gb-slider>
<md-gb-stack direction="row" align-items="center" justify-content="center" gap="100">
<md-gb-icon-button aria-label="Favorite"><md-gb-icon>favorite</md-gb-icon></md-gb-icon-button>
<md-gb-icon-button color="filled" aria-label="Pause"><md-gb-icon>pause</md-gb-icon></md-gb-icon-button>
<md-gb-icon-button aria-label="Share"><md-gb-icon>share</md-gb-icon></md-gb-icon-button>
</md-gb-stack>
<md-gb-slider aria-label="Volume" value="60"><md-gb-icon slot="icon">volume_up</md-gb-icon></md-gb-slider>
</md-gb-stack>
</md-gb-card>
<md-gb-card color="outlined">
<md-gb-stack gap="300" padding-block="200">
<md-gb-stack gap="0">
<md-gb-typography scale="title-md"><h3 id="create-an-account">Create an account</h3></md-gb-typography>
<md-gb-typography scale="body-md" color="on-surface-variant"><p>Start building with Material Web in minutes.</p></md-gb-typography>
</md-gb-stack>
<md-gb-text-field label="Email" type="email" variant="outlined"></md-gb-text-field>
<md-gb-text-field label="Password" type="password" variant="outlined" supporting-text="At least 8 characters"></md-gb-text-field>
<md-gb-typography scale="body-md"><label><md-gb-checkbox checked></md-gb-checkbox> Send me product updates</label></md-gb-typography>
<md-gb-button color="filled" size="md">Create account</md-gb-button>
</md-gb-stack>
</md-gb-card>
<md-gb-card color="outlined">
<md-gb-stack gap="200" padding-block="200">
<md-gb-typography scale="title-md"><h3 id="settings">Settings</h3></md-gb-typography>
<md-gb-list>
<md-gb-list-item static>
<md-gb-icon slot="leading">notifications</md-gb-icon>
Notifications
<span slot="supporting-text">Alerts and badges</span>
<md-gb-switch slot="trailing" selected aria-label="Notifications"></md-gb-switch>
</md-gb-list-item>
<md-gb-list-item static>
<md-gb-icon slot="leading">dark_mode</md-gb-icon>
Dark theme
<span slot="supporting-text">Follows the system</span>
<md-gb-switch slot="trailing" aria-label="Dark theme"></md-gb-switch>
</md-gb-list-item>
<md-gb-list-item static>
<md-gb-icon slot="leading">language</md-gb-icon>
Language
<span slot="trailing-text">English</span>
</md-gb-list-item>
</md-gb-list>
</md-gb-stack>
</md-gb-card>
<md-gb-card color="outlined">
<md-gb-stack gap="300" padding-block="200">
<md-gb-stack gap="0">
<md-gb-typography scale="title-md"><h3 id="savings-targets">Savings targets</h3></md-gb-typography>
<md-gb-typography scale="body-md" color="on-surface-variant"><p>How close each goal is this year.</p></md-gb-typography>
</md-gb-stack>
<md-gb-stack gap="100">
<md-gb-typography scale="label-md" color="on-surface-variant"><p>Travel</p></md-gb-typography>
<md-gb-typography scale="headline-sm"><p>$4,200</p></md-gb-typography>
<md-gb-progress value="0.65" aria-label="Travel: 65% of the target"></md-gb-progress>
<md-gb-stack direction="row" justify-content="space-between">
<md-gb-typography scale="body-sm" color="on-surface-variant">65% achieved</md-gb-typography>
<md-gb-typography scale="body-sm" color="on-surface-variant">$2,730</md-gb-typography>
</md-gb-stack>
</md-gb-stack>
<md-gb-stack gap="100">
<md-gb-typography scale="label-md" color="on-surface-variant"><p>New laptop</p></md-gb-typography>
<md-gb-typography scale="headline-sm"><p>$1,800</p></md-gb-typography>
<md-gb-progress value="0.32" aria-label="New laptop: 32% of the target"></md-gb-progress>
<md-gb-stack direction="row" justify-content="space-between">
<md-gb-typography scale="body-sm" color="on-surface-variant">32% achieved</md-gb-typography>
<md-gb-typography scale="body-sm" color="on-surface-variant">$576</md-gb-typography>
</md-gb-stack>
</md-gb-stack>
</md-gb-stack>
</md-gb-card>
<md-gb-card color="outlined">
<md-gb-stack gap="300" padding-block="200">
<md-gb-stack gap="0">
<md-gb-typography scale="title-md"><h3 id="book-a-table">Book a table</h3></md-gb-typography>
<md-gb-typography scale="body-md" color="on-surface-variant"><p>Friday, for two</p></md-gb-typography>
</md-gb-stack>
<md-gb-segmented-button-set aria-label="Meal">
<md-gb-segmented-button value="lunch">Lunch</md-gb-segmented-button>
<md-gb-segmented-button value="dinner" selected>Dinner</md-gb-segmented-button>
</md-gb-segmented-button-set>
<md-gb-chip-set aria-label="Times">
<md-gb-chip type="filter">18:00</md-gb-chip>
<md-gb-chip type="filter" selected>19:30</md-gb-chip>
<md-gb-chip type="filter">21:00</md-gb-chip>
</md-gb-chip-set>
<md-gb-stack direction="row" justify-content="end" gap="100">
<md-gb-button color="text">Cancel</md-gb-button>
<md-gb-button color="filled">Reserve</md-gb-button>
</md-gb-stack>
</md-gb-stack>
</md-gb-card>
<md-gb-card color="outlined">
<md-gb-stack gap="300" padding-block="200">
<md-gb-typography scale="title-md"><h3 id="new-message">New message</h3></md-gb-typography>
<md-gb-text-field label="Message" variant="outlined" type="textarea" rows="3" value="The scroll keeps jumping when new messages arrive. Any idea how to keep it at the bottom?"></md-gb-text-field>
<md-gb-stack direction="row" align-items="center" justify-content="space-between">
<md-gb-stack direction="row" gap="0">
<md-gb-icon-button aria-label="Attach a file"><md-gb-icon>attach_file</md-gb-icon></md-gb-icon-button>
<md-gb-icon-button aria-label="Add an image"><md-gb-icon>image</md-gb-icon></md-gb-icon-button>
</md-gb-stack>
<md-gb-fab size="small" aria-label="Send"><md-gb-icon>send</md-gb-icon></md-gb-fab>
</md-gb-stack>
</md-gb-stack>
</md-gb-card>
</md-gb-grid>
