/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Gaps: spec requirements the text field does not meet yet. Red until the
// component is fixed; run with `npm run gb:check -- --gaps`.

// import 'jasmine'; (google3-only)
import './md-gb-text-field.js';

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {type TextFieldElement} from './text-field-element.js';

adoptStyles(document, [m3Styles]);

describe('<md-gb-text-field> gaps', () => {
  const env = new Environment();

  // text-fields.md Error icon: "It's strongly recommended to show an error
  // icon when the text field is in the error state"; its accessibility label
  // is "Error". The field only offers the slot for the app's own icon.
  // spec: text-fields-57887f, text-fields-ddd1ec, text-fields-3ccd4e
  it('shows an error icon labelled "Error" in the error state', async () => {
    const root = env.render(html`<md-gb-text-field label="Email" error error-text="Not valid"></md-gb-text-field>`);
    await env.waitForStability();
    const el = root.querySelector('md-gb-text-field') as TextFieldElement;
    await el.updateComplete;
    const icon = el.shadowRoot!.querySelector('[aria-label="Error"]');
    expect(icon).not.toBeNull();
    expect(icon!.getBoundingClientRect().width).toBeGreaterThan(0);
  });
});
