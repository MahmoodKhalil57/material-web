/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/components/button/md-gb-button.js';
import '@material/web/components/card/md-gb-card.js';
import '@material/web/components/checkbox/md-gb-checkbox.js';
import '@material/web/components/chip/md-gb-chip.js';
import '@material/web/components/fab/md-gb-fab.js';
import '@material/web/components/iconbutton/md-gb-icon-button.js';
import '@material/web/components/slider/md-gb-slider.js';
import '@material/web/components/switch/md-gb-switch.js';
import '@material/web/styles/icon/md-gb-icon.js';

import {type MaterialStoryInit} from './material-collection.js';
import {adoptStyles} from '@material/web/styles/adopt-styles.js';
import {
  applyThemeToElement,
  COLOR_ROLES,
  type ContrastLevel,
  DEFAULT_SPEC_VERSION,
  type DynamicTheme,
  type Platform,
  PLATFORMS,
  SCHEME_VARIANTS,
  type SchemeVariant,
  sourceColorFromImage,
  SPEC_VERSIONS,
  type SpecVersion,
  themeFromSource,
} from '@material/web/styles/color/dynamic-color.js';
import {css, html, LitElement, nothing, type PropertyValues} from 'lit';

import {styles as contrastStyles} from '@material/web/styles/color/md-color-tokens-contrast.cssresult.js';
import {styles as m3Styles} from '@material/web/styles/m3.cssresult.js';

/** Knob types for color stories. */
export interface StoryKnobs {
  source: string;
  variant: string;
  contrast: string;
  specVersion: string;
  platform: string;
  dark: boolean;
}

adoptStyles(document, [m3Styles]);

/** Roles shown as swatches, grouped like the spec's color roles page. */
const SWATCH_GROUPS: Array<{title: string; roles: string[]}> = [
  {
    title: 'Accent',
    roles: [
      'primary',
      'on-primary',
      'primary-container',
      'on-primary-container',
      'secondary',
      'on-secondary',
      'secondary-container',
      'on-secondary-container',
      'tertiary',
      'on-tertiary',
      'tertiary-container',
      'on-tertiary-container',
      'error',
      'on-error',
      'error-container',
      'on-error-container',
    ],
  },
  {
    title: 'Fixed',
    roles: COLOR_ROLES.filter((r) => r.includes('fixed')),
  },
  {
    title: 'Surface',
    roles: [
      'surface-dim',
      'surface',
      'surface-bright',
      'surface-container-lowest',
      'surface-container-low',
      'surface-container',
      'surface-container-high',
      'surface-container-highest',
      'on-surface',
      'on-surface-variant',
      'outline',
      'outline-variant',
      'inverse-surface',
      'inverse-on-surface',
      'inverse-primary',
      'scrim',
      'shadow',
    ],
  },
];

/** The role whose color reads on top of a swatch. */
function textRole(role: string) {
  if (role.startsWith('on-')) return role.slice(3);
  if (role.startsWith('inverse-on-')) return 'inverse-surface';
  if (role === 'inverse-surface') return 'inverse-on-surface';
  if (role === 'inverse-primary') return 'on-primary-fixed';
  if (role === 'scrim' || role === 'shadow') return 'surface';
  if (role === 'outline') return 'surface';
  if (role === 'outline-variant') return 'on-surface';
  if (role.startsWith('surface')) return 'on-surface';
  if (role.endsWith('-fixed') || role.endsWith('-fixed-dim')) {
    return `on-${role.replace(/-dim$/, '')}`;
  }
  return `on-${role}`;
}

const swatchStyles = css`
  .swatch-group h3 {
    color: var(--md-sys-color-on-surface);
    font: var(--md-sys-typescale-title-sm);
    margin: 16px 0 8px;
  }

  .swatches {
    display: grid;
    gap: 4px;
    grid-template-columns: repeat(auto-fill, minmax(128px, 1fr));
  }

  .swatch {
    border-radius: var(--md-sys-shape-corner-sm);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    font: var(--md-sys-typescale-label-md);
    gap: 4px;
    justify-content: space-between;
    min-block-size: 64px;
    outline: 1px solid var(--md-sys-color-outline-variant);
    padding: 8px;
  }

  .swatch code {
    font-family: ui-monospace, monospace;
    opacity: 0.9;
  }
`;

function swatches(theme?: DynamicTheme, dark?: boolean) {
  const value = (role: string) =>
    theme ? (dark ? theme.dark : theme.light)[role] : '';
  const groups = [...SWATCH_GROUPS];
  if (theme?.customRoles.length) {
    groups.push({title: 'Custom', roles: theme.customRoles});
  }
  return html`${groups.map(
    ({title, roles}) => html`
      <section class="swatch-group">
        <h3>${title}</h3>
        <div class="swatches">
          ${roles.map((role) => {
            const text = theme?.customRoles.includes(role)
              ? role.startsWith('on-')
                ? role.slice(3)
                : `on-${role}`
              : textRole(role);
            return html`<div
              class="swatch"
              style="background: var(--md-sys-color-${role}); color: var(--md-sys-color-${text})">
              <span>${role}</span>
              ${theme ? html`<code>${value(role)}</code>` : nothing}
            </div>`;
          })}
        </div>
      </section>
    `,
  )}`;
}

function sampleComponents() {
  return html`
    <div class="samples">
      <div class="row">
        <md-gb-button color="filled">Filled</md-gb-button>
        <md-gb-button color="tonal">Tonal</md-gb-button>
        <md-gb-button color="outlined">Outlined</md-gb-button>
        <md-gb-button color="elevated">Elevated</md-gb-button>
        <md-gb-button color="text">Text</md-gb-button>
      </div>
      <div class="row">
        <md-gb-fab color="primary-container" aria-label="Edit">
          <md-gb-icon>edit</md-gb-icon>
        </md-gb-fab>
        <md-gb-fab color="secondary-container" aria-label="Add">
          <md-gb-icon>add</md-gb-icon>
        </md-gb-fab>
        <md-gb-fab color="tertiary-container" aria-label="Navigate">
          <md-gb-icon>navigation</md-gb-icon>
        </md-gb-fab>
        <md-gb-icon-button color="filled" aria-label="Favorite">
          <md-gb-icon>favorite</md-gb-icon>
        </md-gb-icon-button>
        <md-gb-icon-button color="tonal" aria-label="Share">
          <md-gb-icon>share</md-gb-icon>
        </md-gb-icon-button>
        <md-gb-icon-button color="outlined" aria-label="Settings">
          <md-gb-icon>settings</md-gb-icon>
        </md-gb-icon-button>
      </div>
      <div class="row">
        <md-gb-switch selected aria-label="Switch"></md-gb-switch>
        <md-gb-checkbox checked aria-label="Checkbox"></md-gb-checkbox>
        <md-gb-chip color="tonal">Tonal chip</md-gb-chip>
        <md-gb-chip color="outlined">Outlined chip</md-gb-chip>
        <md-gb-slider
          min="0"
          max="100"
          value="60"
          aria-label="Slider"></md-gb-slider>
      </div>
      <div class="row">
        <md-gb-card color="filled">
          <div class="card-content">Filled card</div>
        </md-gb-card>
        <md-gb-card color="elevated">
          <div class="card-content">Elevated card</div>
        </md-gb-card>
        <md-gb-card color="outlined">
          <div class="card-content">Outlined card</div>
        </md-gb-card>
      </div>
    </div>
  `;
}

const sampleStyles = css`
  .samples {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .row {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .card-content {
    padding: 16px;
    inline-size: 160px;
  }
`;

const VARIANT_LABELS: Record<SchemeVariant, string> = {
  'tonal-spot': 'Tonal spot',
  'neutral': 'Neutral',
  'vibrant': 'Vibrant',
  'expressive': 'Expressive',
  'fidelity': 'Fidelity',
  'content': 'Content',
  'monochrome': 'Monochrome',
  'rainbow': 'Rainbow',
  'fruit-salad': 'Fruit salad',
};

const SPEC_VERSION_LABELS: Record<SpecVersion, string> = {
  '2021': '2021',
  '2025': '2025 (Expressive)',
};

const PLATFORM_LABELS: Record<Platform, string> = {
  phone: 'Phone',
  watch: 'Watch',
};

/** Draws a sample "photo" so the image source works without assets. */
function sampleImage(colors: string[]) {
  const canvas = document.createElement('canvas');
  canvas.width = 96;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createLinearGradient(0, 0, 96, 64);
  colors.forEach((c, i) => {
    gradient.addColorStop(i / (colors.length - 1), c);
  });
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 96, 64);
  ctx.fillStyle = colors[0];
  ctx.beginPath();
  ctx.arc(64, 28, 18, 0, Math.PI * 2);
  ctx.fill();
  return canvas.toDataURL();
}

const SAMPLE_IMAGES = [
  {label: 'Sunset', colors: ['#d84315', '#ffb74d', '#4e342e']},
  {label: 'Forest', colors: ['#2e7d32', '#a5d6a7', '#1b3a1d']},
  {label: 'Ocean', colors: ['#0277bd', '#80deea', '#0d1b3e']},
];

/**
 * Interactive dynamic color playground: source color or image, variant,
 * contrast, dark theme and a custom color re-theme sample components and
 * every color role swatch.
 */
class ColorPlayground extends LitElement {
  static override properties = {
    source: {},
    variant: {},
    contrast: {},
    specVersion: {attribute: 'spec-version'},
    platform: {},
    dark: {type: Boolean},
    custom: {},
    harmonize: {type: Boolean},
    status: {state: true},
    theme: {state: true},
  };

  static override styles = [
    swatchStyles,
    sampleStyles,
    css`
      :host {
        display: block;
      }

      .controls {
        align-items: end;
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        margin-block-end: 16px;
      }

      label {
        color: var(--md-sys-color-on-surface-variant);
        display: flex;
        flex-direction: column;
        font: var(--md-sys-typescale-label-lg);
        gap: 4px;
      }

      label.inline {
        align-items: center;
        flex-direction: row;
      }

      select,
      input[type='color'] {
        block-size: 40px;
        min-inline-size: 64px;
      }

      .images {
        display: flex;
        gap: 8px;
      }

      .images button {
        background: none;
        border: 2px solid transparent;
        border-radius: var(--md-sys-shape-corner-sm);
        cursor: pointer;
        padding: 0;
      }

      .images button:focus-visible {
        border-color: var(--md-sys-color-primary);
      }

      .images img {
        border-radius: var(--md-sys-shape-corner-xs);
        block-size: 40px;
        display: block;
        inline-size: 60px;
      }

      .stage {
        background: var(--md-sys-color-surface);
        border-radius: var(--md-sys-shape-corner-lg);
        color: var(--md-sys-color-on-surface);
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 24px;
      }

      .status {
        font: var(--md-sys-typescale-body-sm);
        margin: 0;
      }
    `,
  ];

  declare source: string;
  declare variant: SchemeVariant;
  declare contrast: ContrastLevel;
  declare specVersion: SpecVersion;
  declare platform: Platform;
  declare dark: boolean;
  declare custom: string;
  declare harmonize: boolean;
  declare status: string;
  declare theme: DynamicTheme | undefined;

  constructor() {
    super();
    this.source = '#6750a4';
    this.variant = 'tonal-spot';
    this.contrast = 'standard';
    this.specVersion = DEFAULT_SPEC_VERSION;
    this.platform = 'phone';
    this.dark = false;
    this.custom = '#00a86b';
    this.harmonize = true;
    this.status = '';
  }

  private readonly images = SAMPLE_IMAGES.map((image) => ({
    ...image,
    url: sampleImage(image.colors),
  }));

  protected override willUpdate(changed: PropertyValues<this>) {
    if (changed.size === 1 && changed.has('status')) return;
    this.theme = themeFromSource({
      source: this.source,
      variant: this.variant,
      contrast: this.contrast,
      specVersion: this.specVersion,
      platform: this.platform,
      customColors: [
        {name: 'success', value: this.custom, harmonize: this.harmonize},
      ],
    });
  }

  protected override updated() {
    const stage = this.renderRoot.querySelector<HTMLElement>('.stage');
    if (stage && this.theme) applyThemeToElement(stage, this.theme, this.dark);
  }

  private async useImage(source: string | HTMLImageElement, label: string) {
    this.status = `Extracting the source color from ${label}...`;
    try {
      this.source = await sourceColorFromImage(source);
      this.variant = 'content';
      this.status = `Source ${this.source} from ${label} (content scheme).`;
    } catch (e) {
      this.status = `Could not read ${label}: ${String(e)}`;
    }
  }

  private onFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    this.useImage(url, file.name).finally(() => {
      URL.revokeObjectURL(url);
    });
  }

  override render() {
    return html`
      <div class="controls">
        <label>
          Source color
          <input
            type="color"
            .value=${this.source}
            @input=${(e: Event) => {
              this.source = (e.target as HTMLInputElement).value;
              this.status = '';
            }} />
        </label>
        <label>
          Variant
          <select
            @change=${(e: Event) => {
              this.variant = (e.target as HTMLSelectElement)
                .value as SchemeVariant;
            }}>
            ${SCHEME_VARIANTS.map(
              (v) =>
                html`<option value=${v} ?selected=${v === this.variant}>
                  ${VARIANT_LABELS[v]}
                </option>`,
            )}
          </select>
        </label>
        <label>
          Contrast
          <select
            @change=${(e: Event) => {
              this.contrast = (e.target as HTMLSelectElement)
                .value as ContrastLevel;
            }}>
            ${(['standard', 'medium', 'high'] as const).map(
              (c) =>
                html`<option value=${c} ?selected=${c === this.contrast}>
                  ${c[0].toUpperCase() + c.slice(1)}
                </option>`,
            )}
          </select>
        </label>
        <label>
          Color spec
          <select
            @change=${(e: Event) => {
              this.specVersion = (e.target as HTMLSelectElement)
                .value as SpecVersion;
            }}>
            ${SPEC_VERSIONS.map(
              (v) =>
                html`<option value=${v} ?selected=${v === this.specVersion}>
                  ${SPEC_VERSION_LABELS[v]}
                </option>`,
            )}
          </select>
        </label>
        <label>
          Platform
          <select
            @change=${(e: Event) => {
              this.platform = (e.target as HTMLSelectElement).value as Platform;
            }}>
            ${PLATFORMS.map(
              (p) =>
                html`<option value=${p} ?selected=${p === this.platform}>
                  ${PLATFORM_LABELS[p]}
                </option>`,
            )}
          </select>
        </label>
        <label class="inline">
          <md-gb-switch
            .selected=${this.dark}
            aria-label="Dark theme"
            @change=${(e: Event) => {
              this.dark = (e.target as HTMLInputElement & {selected: boolean})
                .selected;
            }}></md-gb-switch>
          Dark theme
        </label>
        <label>
          Custom color "success"
          <input
            type="color"
            .value=${this.custom}
            @input=${(e: Event) => {
              this.custom = (e.target as HTMLInputElement).value;
            }} />
        </label>
        <label class="inline">
          <md-gb-checkbox
            ?checked=${this.harmonize}
            aria-label="Harmonize custom color"
            @change=${(e: Event) => {
              this.harmonize = (e.target as HTMLInputElement).checked;
            }}></md-gb-checkbox>
          Harmonize
        </label>
        <label>
          Source from an image
          <span class="images">
            ${this.images.map(
              ({label, url}) => html`<button
                aria-label="Use the ${label} image"
                @click=${(e: Event) => {
                  const img = (e.currentTarget as HTMLElement).querySelector(
                    'img',
                  )!;
                  this.useImage(img, label);
                }}>
                <img src=${url} alt="" />
              </button>`,
            )}
            <input
              type="file"
              accept="image/*"
              aria-label="Upload an image"
              @change=${this.onFile} />
          </span>
        </label>
      </div>
      <p class="status" role="status">${this.status}</p>
      <p class="status">
        ${this.theme
          ? `${VARIANT_LABELS[this.theme.variant]} follows the ${
              SPEC_VERSION_LABELS[this.theme.specVersion]
            } color spec${
              this.theme.specVersion === this.specVersion
                ? ''
                : ' (it has no 2025 rules)'
            }.`
          : nothing}
      </p>
      <div class="stage">
        ${sampleComponents()} ${swatches(this.theme, this.dark)}
      </div>
    `;
  }
}

if (!customElements.get('gb-color-playground')) {
  customElements.define('gb-color-playground', ColorPlayground);
}

const demoStyles = css`
  .demo-container {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 24px;
  }

  h2 {
    color: var(--md-sys-color-on-surface);
    font: var(--md-sys-typescale-headline-sm);
    margin: 0;
  }

  .variant-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }

  .panel {
    background: var(--md-sys-color-surface-container);
    border-radius: var(--md-sys-shape-corner-md);
    color: var(--md-sys-color-on-surface);
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
  }

  .panel h3 {
    font: var(--md-sys-typescale-title-md);
    margin: 0;
  }

  .chips {
    display: grid;
    gap: 4px;
    grid-template-columns: repeat(4, 1fr);
  }

  .chips span {
    block-size: 32px;
    border-radius: var(--md-sys-shape-corner-xs);
  }

  .contrast-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
`;

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Dynamic color playground',
  styles: [demoStyles],
  render(knobs) {
    return html`
      <div class="demo-container">
        <gb-color-playground
          source=${knobs.source}
          variant=${knobs.variant}
          contrast=${knobs.contrast}
          spec-version=${knobs.specVersion}
          platform=${knobs.platform}
          ?dark=${knobs.dark}></gb-color-playground>
      </div>
    `;
  },
};

const KEY_ROLES = [
  'primary',
  'primary-container',
  'secondary',
  'secondary-container',
  'tertiary',
  'tertiary-container',
  'surface-container-highest',
  'on-surface',
];

const variants: MaterialStoryInit<StoryKnobs> = {
  name: 'Scheme variants',
  styles: [demoStyles, sampleStyles],
  render(knobs) {
    return html`
      <div class="demo-container">
        <h2>
          Scheme variants from ${knobs.source}
          (${SPEC_VERSION_LABELS[knobs.specVersion as SpecVersion]} spec)
        </h2>
        <div class="variant-grid">
          ${SCHEME_VARIANTS.map((variant) => {
            const theme = themeFromSource({
              source: knobs.source,
              variant,
              contrast: knobs.contrast as ContrastLevel,
              specVersion: knobs.specVersion as SpecVersion,
              platform: knobs.platform as Platform,
            });
            const roles = knobs.dark ? theme.dark : theme.light;
            const props = Object.entries(roles)
              .map(([role, value]) => `--md-sys-color-${role}: ${value}`)
              .join(';');
            return html`
              <div
                class="panel"
                style="${props}; color-scheme: ${knobs.dark ? 'dark' : 'light'}">
                <h3>
                  ${VARIANT_LABELS[variant]}
                  ${theme.specVersion === knobs.specVersion
                    ? nothing
                    : html`<small>(${theme.specVersion} rules)</small>`}
                </h3>
                <div class="chips">
                  ${KEY_ROLES.map(
                    (role) =>
                      html`<span
                        title="${role} ${roles[role]}"
                        style="background: ${roles[role]}"></span>`,
                  )}
                </div>
                <div class="row">
                  <md-gb-button color="filled">Filled</md-gb-button>
                  <md-gb-button color="tonal">Tonal</md-gb-button>
                  <md-gb-switch selected aria-label="Switch"></md-gb-switch>
                </div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  },
};

const staticContrast: MaterialStoryInit<StoryKnobs> = {
  name: 'Static baseline contrast levels',
  styles: [demoStyles, swatchStyles, sampleStyles, contrastStyles],
  render() {
    const levels = ['standard', 'medium', 'high'];
    return html`
      <div class="demo-container">
        <h2>Baseline scheme at standard, medium and high contrast</h2>
        ${(['light', 'dark'] as const).map(
          (scheme) => html`
            <div class="contrast-grid">
              ${levels.map(
                (level) => html`
                  <div
                    class="panel md-contrast-${level}"
                    style="color-scheme: ${scheme}; background: var(--md-sys-color-surface)">
                    <h3>${level[0].toUpperCase() + level.slice(1)} (${scheme})</h3>
                    <div class="row">
                      <md-gb-button color="filled">Filled</md-gb-button>
                      <md-gb-button color="tonal">Tonal</md-gb-button>
                      <md-gb-button color="outlined">Outlined</md-gb-button>
                    </div>
                    ${swatches()}
                  </div>
                `,
              )}
            </div>
          `,
        )}
      </div>
    `;
  },
};

/** Color demo stories. */
export const stories = [playground, variants, staticContrast];
