---
permalink: /3.0/
eleventyExcludeFromCollections: true
gbIndex: true
title: Home
section: about
description: Material Web 3.0 is a library of web components that follow Material 3 Expressive, Google's design system, for any framework or none.
---
<header class="gb-home-hero">
<div class="gb-home-intro">
<a class="gb-home-chip" href="/3.0/about/intro/">Material 3 Expressive, as web components<md-gb-icon aria-hidden="true">arrow_forward</md-gb-icon></a>
<h1 class="gb-home-title">Material Design for the web</h1>
<p class="gb-home-lede">Accessible components that follow Material 3 Expressive, for any framework or none. Shapes that morph, motion on springs, color from a single seed.</p>
<div class="gb-home-actions">
<md-gb-button color="filled" size="md" href="/3.0/about/quick-start/">Get started</md-gb-button>
<md-gb-button color="tonal" size="md" href="/3.0/components/">View components</md-gb-button>
</div>
</div>
<div class="gb-home-art" aria-hidden="true" inert>
<span class="gb-home-blob" data-tone="primary" data-pos="main">{% gbshape "cookie12Sided", "", "cookie9Sided", "loop", 0 %}</span>
<span class="gb-home-blob" data-tone="tertiary" data-pos="a">{% gbshape "clover4Leaf", "", "puffy", "loop", 1 %}</span>
<span class="gb-home-blob" data-tone="secondary" data-pos="b">{% gbshape "sunny", "", "verySunny", "loop", 2 %}</span>
<span class="gb-home-blob" data-tone="tertiary" data-pos="c">{% gbshape "pill", "", "oval", "loop", 3 %}</span>
<span class="gb-home-blob" data-tone="secondary" data-pos="d">{% gbshape "softBurst", "", "burst", "loop", 1 %}</span>
<md-gb-loading-indicator class="gb-home-spinner" contained aria-label="Loading"></md-gb-loading-indicator>
</div>
</header>

<section class="gb-home-section" aria-labelledby="gb-home-explore">
<h2 class="gb-home-heading" id="gb-home-explore">Explore the system</h2>
<md-gb-carousel class="gb-home-carousel" aria-label="Explore the system">
<md-gb-carousel-item href="/3.0/styles/color/" label="Color">
<div class="gb-home-tile" data-tone="primary">{% gbshape "cookie9Sided", "gb-home-tile-shape", "flower" %}<md-gb-icon class="gb-home-tile-icon">palette</md-gb-icon></div>
<span slot="label">Color</span>
</md-gb-carousel-item>
<md-gb-carousel-item href="/3.0/styles/shape/" label="Shape">
<div class="gb-home-tile" data-tone="tertiary">{% gbshape "clover8Leaf", "gb-home-tile-shape", "clover4Leaf" %}<md-gb-icon class="gb-home-tile-icon">category</md-gb-icon></div>
<span slot="label">Shape</span>
</md-gb-carousel-item>
<md-gb-carousel-item href="/3.0/styles/motion/" label="Motion">
<div class="gb-home-tile" data-tone="secondary">{% gbshape "burst", "gb-home-tile-shape", "softBurst" %}<md-gb-icon class="gb-home-tile-icon">animation</md-gb-icon></div>
<span slot="label">Motion</span>
</md-gb-carousel-item>
<md-gb-carousel-item href="/3.0/styles/typography/" label="Typography">
<div class="gb-home-tile" data-tone="primary">{% gbshape "flower", "gb-home-tile-shape", "cookie9Sided" %}<md-gb-icon class="gb-home-tile-icon">text_fields</md-gb-icon></div>
<span slot="label">Typography</span>
</md-gb-carousel-item>
<md-gb-carousel-item href="/3.0/components/" label="Components">
<div class="gb-home-tile" data-tone="tertiary">{% gbshape "puffy", "gb-home-tile-shape", "puffyDiamond" %}<md-gb-icon class="gb-home-tile-icon">widgets</md-gb-icon></div>
<span slot="label">Components</span>
</md-gb-carousel-item>
<md-gb-carousel-item href="/3.0/foundations/accessibility/" label="Accessibility">
<div class="gb-home-tile" data-tone="secondary">{% gbshape "gem", "gb-home-tile-shape", "pentagon" %}<md-gb-icon class="gb-home-tile-icon">accessibility_new</md-gb-icon></div>
<span slot="label">Accessibility</span>
</md-gb-carousel-item>
</md-gb-carousel>
</section>

<section class="gb-home-section" aria-labelledby="gb-home-built">
<h2 class="gb-home-heading" id="gb-home-built">Built from the components</h2>
<div class="gb-home-cards">

<div class="gb-home-card" data-corners="a" role="group" aria-label="Controls">
<span class="gb-home-decor" data-tone="primary" data-place="bottom">{% gbshape "cookie6Sided", "", "cookie9Sided" %}</span>
<div class="gb-home-row">
<md-gb-button color="filled">Button<md-gb-icon slot="icon">arrow_forward</md-gb-icon></md-gb-button>
<md-gb-button color="tonal">Tonal</md-gb-button>
<md-gb-button color="outlined">Outlined</md-gb-button>
</div>
<md-gb-text-field label="Name" variant="outlined"><md-gb-icon slot="leading-icon">search</md-gb-icon></md-gb-text-field>
<md-gb-text-field label="Message" variant="outlined" type="textarea" rows="3"></md-gb-text-field>
<div class="gb-home-row gb-home-spread">
<md-gb-chip-set aria-label="Topics">
<md-gb-chip type="filter" selected>Design</md-gb-chip>
<md-gb-chip type="filter">Code</md-gb-chip>
</md-gb-chip-set>
<div class="gb-home-row">
<md-gb-radio name="gb-home-plan" value="a" checked aria-label="Option A"></md-gb-radio>
<md-gb-checkbox checked aria-label="Subscribe"></md-gb-checkbox>
<md-gb-switch selected aria-label="Notifications"></md-gb-switch>
</div>
</div>
<md-gb-button-group aria-label="Text alignment">
<md-gb-button color="tonal">Left</md-gb-button>
<md-gb-button color="tonal">Center</md-gb-button>
<md-gb-button color="tonal">Right</md-gb-button>
</md-gb-button-group>
</div>

<div class="gb-home-card" data-corners="b" role="group" aria-labelledby="gb-home-player">
<span class="gb-home-decor" data-tone="tertiary">{% gbshape "sunny", "", "verySunny" %}</span>
<div class="gb-home-media">
<div class="gb-home-art-small" data-tone="tertiary" aria-hidden="true">{% gbshape "cookie9Sided", "", "flower" %}<md-gb-icon>library_music</md-gb-icon></div>
<div class="gb-home-stack">
<h3 class="gb-home-card-title" id="gb-home-player">Golden hour</h3>
<p class="gb-home-muted">The Tonal Palettes</p>
</div>
</div>
<md-gb-slider aria-label="Position" value="35"></md-gb-slider>
<div class="gb-home-row gb-home-center">
<md-gb-icon-button aria-label="Favorite"><md-gb-icon>favorite</md-gb-icon></md-gb-icon-button>
<md-gb-icon-button color="filled" aria-label="Pause"><md-gb-icon>pause</md-gb-icon></md-gb-icon-button>
<md-gb-icon-button aria-label="Share"><md-gb-icon>share</md-gb-icon></md-gb-icon-button>
</div>
<md-gb-slider aria-label="Volume" value="60"><md-gb-icon slot="icon">volume_up</md-gb-icon></md-gb-slider>
</div>

<div class="gb-home-card" data-corners="c" role="group" aria-labelledby="gb-home-signup">
<span class="gb-home-decor" data-tone="secondary">{% gbshape "clover4Leaf", "", "clover8Leaf" %}</span>
<div class="gb-home-stack">
<h3 class="gb-home-card-title" id="gb-home-signup">Create an account</h3>
<p class="gb-home-muted">Start building with Material Web in minutes.</p>
</div>
<md-gb-text-field label="Email" type="email" variant="outlined"></md-gb-text-field>
<md-gb-text-field label="Password" type="password" variant="outlined" supporting-text="At least 8 characters"></md-gb-text-field>
<label class="gb-home-row gb-home-label"><md-gb-checkbox checked></md-gb-checkbox>Send me product updates</label>
<md-gb-button color="filled" size="md" class="gb-home-wide">Create account</md-gb-button>
</div>

<div class="gb-home-card" data-corners="a" role="group" aria-labelledby="gb-home-settings">
<span class="gb-home-decor" data-tone="primary">{% gbshape "puffyDiamond", "", "puffy" %}</span>
<h3 class="gb-home-card-title" id="gb-home-settings">Settings</h3>
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
</div>

<div class="gb-home-card" data-corners="b" role="group" aria-labelledby="gb-home-savings">
<span class="gb-home-decor" data-tone="secondary">{% gbshape "cookie4Sided", "", "cookie6Sided" %}</span>
<div class="gb-home-stack">
<h3 class="gb-home-card-title" id="gb-home-savings">Savings targets</h3>
<p class="gb-home-muted">How close each goal is this year.</p>
</div>
<div class="gb-home-goal">
<p class="gb-home-overline">Travel</p>
<p class="gb-home-figure">$4,200</p>
<md-gb-progress value="0.65" aria-label="Travel: 65% of the target"></md-gb-progress>
<p class="gb-home-row gb-home-spread gb-home-muted"><span>65% achieved</span><span>$2,730</span></p>
</div>
<div class="gb-home-goal">
<p class="gb-home-overline">New laptop</p>
<p class="gb-home-figure">$1,800</p>
<md-gb-progress value="0.32" aria-label="New laptop: 32% of the target"></md-gb-progress>
<p class="gb-home-row gb-home-spread gb-home-muted"><span>32% achieved</span><span>$576</span></p>
</div>
</div>

<div class="gb-home-card" data-corners="c" role="group" aria-labelledby="gb-home-table">
<span class="gb-home-decor" data-tone="tertiary">{% gbshape "flower", "", "puffy" %}</span>
<div class="gb-home-stack">
<h3 class="gb-home-card-title" id="gb-home-table">Book a table</h3>
<p class="gb-home-muted">Friday, for two</p>
</div>
<md-gb-segmented-button-set aria-label="Meal">
<md-gb-segmented-button value="lunch">Lunch</md-gb-segmented-button>
<md-gb-segmented-button value="dinner" selected>Dinner</md-gb-segmented-button>
</md-gb-segmented-button-set>
<md-gb-chip-set aria-label="Times">
<md-gb-chip type="filter">18:00</md-gb-chip>
<md-gb-chip type="filter" selected>19:30</md-gb-chip>
<md-gb-chip type="filter">21:00</md-gb-chip>
</md-gb-chip-set>
<div class="gb-home-row gb-home-end">
<md-gb-button color="text">Cancel</md-gb-button>
<md-gb-button color="filled">Reserve</md-gb-button>
</div>
</div>

<div class="gb-home-card" data-corners="a" role="group" aria-labelledby="gb-home-compose">
<span class="gb-home-decor" data-tone="primary">{% gbshape "softBoom", "", "boom" %}</span>
<h3 class="gb-home-card-title" id="gb-home-compose">New message</h3>
<md-gb-text-field label="Message" variant="outlined" type="textarea" rows="3" value="The scroll keeps jumping when new messages arrive. Any idea how to keep it at the bottom?"></md-gb-text-field>
<div class="gb-home-row gb-home-spread">
<div class="gb-home-row">
<md-gb-icon-button aria-label="Attach a file"><md-gb-icon>attach_file</md-gb-icon></md-gb-icon-button>
<md-gb-icon-button aria-label="Add an image"><md-gb-icon>image</md-gb-icon></md-gb-icon-button>
</div>
<md-gb-fab size="small" aria-label="Send"><md-gb-icon>send</md-gb-icon></md-gb-fab>
</div>
</div>

</div>
</section>
