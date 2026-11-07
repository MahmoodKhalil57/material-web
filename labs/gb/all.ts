/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview The one-line setup for prototyping: defines every labs/gb
 * element and adopts the M3 styles (tokens and typography) into the
 * document.
 *
 * ```html
 * <script type="module" src="https://esm.run/@material/web/labs/gb/all.js"></script>
 * ```
 *
 * WARNING: This import is intended for prototyping and development builds only.
 * Import only the individual components used for production, and adopt the
 * styles yourself (`adoptStyles(document, [m3Styles])`).
 */

import {adoptStyles} from './styles/adopt-styles.js';
import {styles as m3Styles} from './styles/m3.cssresult.js';

import './components/all.js';

adoptStyles(document, [m3Styles]);

export * from './components/all.js';
