/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// The labs/gb components rendered at build time (declarative shadow DOM, by
// @lit-labs/eleventy-plugin-lit; built by catalog/esbuild.config.mjs): the
// 3.0 shell that shows on the first frame, so it paints before any script
// runs. Only elements the shell bundle (gb.ts) defines, since that bundle
// loads Lit's hydration support: one defined elsewhere would render its
// shadow root a second time.

import './dom-shim.js';

import '@material/web/labs/gb/components/appbar/md-gb-app-bar.js';
import '@material/web/labs/gb/components/button/md-gb-button.js';
import '@material/web/labs/gb/components/divider/md-gb-divider.js';
import '@material/web/labs/gb/components/fab/md-gb-fab.js';
import '@material/web/labs/gb/components/iconbutton/md-gb-icon-button.js';
import '@material/web/labs/gb/components/navbar/md-gb-nav-bar.js';
import '@material/web/labs/gb/components/navbar/md-gb-nav-bar-item.js';
import '@material/web/labs/gb/components/navrail/md-gb-nav-rail.js';
import '@material/web/labs/gb/components/navrail/md-gb-nav-rail-item.js';
import '@material/web/labs/gb/components/switch/md-gb-switch.js';
import '@material/web/labs/gb/styles/icon/md-gb-icon.js';
