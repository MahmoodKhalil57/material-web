/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Dynamic color for labs/gb: generates a full M3 color scheme
 * (every `--md-sys-color-*` role that `md-color-tokens.css` defines) from a
 * source color or an image, using Material Color Utilities (MCU).
 *
 * Spec: https://m3.material.io/styles/color/dynamic,
 * https://m3.material.io/styles/color/choosing-a-scheme,
 * https://m3.material.io/styles/color/advanced and
 * https://m3.material.io/styles/color/system
 * (`.m3-specs/pages/styles/color/*.md`).
 *
 * - A source color is hand-picked, or quantized from an image (QuantizerCelebi
 *   + Score, "how the system works" step 1).
 * - A scheme variant turns the source into five key colors / tonal palettes,
 *   and MaterialDynamicColors assigns tones to every color role.
 * - Contrast levels: standard (0), medium (0.5) and high (1). Medium provides
 *   a minimum 3:1 ratio and high 7:1 (system.md "Color roles support three
 *   levels of contrast").
 * - Static (custom) colors get four roles (color, on-color, container,
 *   on-container) that follow the conventions of the accent colors, and may be
 *   harmonized toward the source with `Blend.harmonize` (advanced.md "Define
 *   static colors", "Harmonize colors").
 *
 * Color spec versions (MCU 0.4 `SpecVersion`):
 * - `2025` (default): the current M3 Expressive color rules (system.md
 *   "What's new", May 2025). MCU implements them for the tonal spot,
 *   neutral, vibrant and expressive variants; the other variants (fidelity,
 *   content, monochrome, rainbow, fruit salad) have no 2025 rules and fall
 *   back to 2021 inside MCU (`DynamicScheme.maybeFallbackSpecVersion`). A
 *   theme's `specVersion` reports the version actually used.
 * - `2021`: the original M3 rules, which the static baseline tokens
 *   (`md-color-tokens.css`, from `material-design-expressive/foundations/design-tokens/versions/latest`) follow.
 *
 * Platform: `phone` (default, also right for the web) or `watch` (changes
 * the 2025 rules only; tuned for always-dark wearables).
 */

import {
  argbFromHex,
  argbFromRgb,
  Blend,
  DynamicColor,
  DynamicScheme,
  Hct,
  hexFromArgb,
  MaterialDynamicColors,
  QuantizerCelebi,
  SchemeContent,
  SchemeExpressive,
  SchemeFidelity,
  SchemeFruitSalad,
  SchemeMonochrome,
  SchemeNeutral,
  SchemeRainbow,
  SchemeTonalSpot,
  SchemeVibrant,
  Score,
  TonalPalette,
  Variant,
} from "@material/material-color-utilities";

/**
 * The color roles that `md-color-tokens.css` defines, in the same order, as
 * `--md-sys-color-<role>` custom property names (without the prefix).
 * Must match `internal/_color-tokens.scss`.
 */
// spec-labels: color-choosing-a-scheme/tab-1, customization/tab-1/custom-color-schemes/color-roles
// spec-labels: color-system/how-the-system-works/how-dynamic-color-generates-color-schemes/3-the-algorithm-generates-key-colors, color-system/how-the-system-works/it-s-like-paint-by-number
export const COLOR_ROLES = [
  "primary",
  "on-primary",
  "primary-container",
  "on-primary-container",
  "primary-fixed",
  "primary-fixed-dim",
  "on-primary-fixed",
  "on-primary-fixed-variant",
  "secondary",
  "on-secondary",
  "secondary-container",
  "on-secondary-container",
  "secondary-fixed",
  "secondary-fixed-dim",
  "on-secondary-fixed",
  "on-secondary-fixed-variant",
  "tertiary",
  "on-tertiary",
  "tertiary-container",
  "on-tertiary-container",
  "tertiary-fixed",
  "tertiary-fixed-dim",
  "on-tertiary-fixed",
  "on-tertiary-fixed-variant",
  "error",
  "on-error",
  "error-container",
  "on-error-container",
  "surface",
  "surface-dim",
  "surface-bright",
  "surface-container-lowest",
  "surface-container-low",
  "surface-container",
  "surface-container-high",
  "surface-container-highest",
  "on-surface",
  "on-surface-variant",
  "outline",
  "outline-variant",
  "inverse-surface",
  "inverse-on-surface",
  "inverse-primary",
  "scrim",
  "shadow",
] as const;

/** A built-in color role name. */
export type ColorRole = (typeof COLOR_ROLES)[number];

/**
 * MCU dynamic colors (0.4 instance API). Each color resolves with the rules of
 * the scheme's spec version.
 */
const m = new MaterialDynamicColors();

/** Color role -> the MCU dynamic color that resolves it. */
const DYNAMIC_COLORS: Record<ColorRole, DynamicColor> = {
  primary: m.primary(),
  "on-primary": m.onPrimary(),
  "primary-container": m.primaryContainer(),
  "on-primary-container": m.onPrimaryContainer(),
  "primary-fixed": m.primaryFixed(),
  "primary-fixed-dim": m.primaryFixedDim(),
  "on-primary-fixed": m.onPrimaryFixed(),
  "on-primary-fixed-variant": m.onPrimaryFixedVariant(),
  secondary: m.secondary(),
  "on-secondary": m.onSecondary(),
  "secondary-container": m.secondaryContainer(),
  "on-secondary-container": m.onSecondaryContainer(),
  "secondary-fixed": m.secondaryFixed(),
  "secondary-fixed-dim": m.secondaryFixedDim(),
  "on-secondary-fixed": m.onSecondaryFixed(),
  "on-secondary-fixed-variant": m.onSecondaryFixedVariant(),
  tertiary: m.tertiary(),
  "on-tertiary": m.onTertiary(),
  "tertiary-container": m.tertiaryContainer(),
  "on-tertiary-container": m.onTertiaryContainer(),
  "tertiary-fixed": m.tertiaryFixed(),
  "tertiary-fixed-dim": m.tertiaryFixedDim(),
  "on-tertiary-fixed": m.onTertiaryFixed(),
  "on-tertiary-fixed-variant": m.onTertiaryFixedVariant(),
  error: m.error(),
  "on-error": m.onError(),
  "error-container": m.errorContainer(),
  "on-error-container": m.onErrorContainer(),
  surface: m.surface(),
  "surface-dim": m.surfaceDim(),
  "surface-bright": m.surfaceBright(),
  "surface-container-lowest": m.surfaceContainerLowest(),
  "surface-container-low": m.surfaceContainerLow(),
  "surface-container": m.surfaceContainer(),
  "surface-container-high": m.surfaceContainerHigh(),
  "surface-container-highest": m.surfaceContainerHighest(),
  "on-surface": m.onSurface(),
  "on-surface-variant": m.onSurfaceVariant(),
  outline: m.outline(),
  "outline-variant": m.outlineVariant(),
  "inverse-surface": m.inverseSurface(),
  "inverse-on-surface": m.inverseOnSurface(),
  "inverse-primary": m.inversePrimary(),
  scrim: m.scrim(),
  shadow: m.shadow(),
};

/**
 * Scheme variants ("styles") from MCU, as listed by the M3 color spec.
 *
 * - `tonal-spot`: the default for user-generated color; low-chroma, calm.
 * - `neutral`: close to grayscale with a hint of the source hue.
 * - `vibrant`: maximum chroma for the primary palette.
 * - `expressive`: rotates hues away from the source for a playful scheme.
 * - `fidelity`: tones match the source color (color fidelity).
 * - `content`: the content-based algorithm; tones match the source image.
 * - `monochrome`: grayscale.
 * - `rainbow`: colorful accents on grayscale neutrals.
 * - `fruit-salad`: hue-rotated, playful accents.
 */
export const SCHEME_VARIANTS = [
  "tonal-spot",
  "neutral",
  "vibrant",
  "expressive",
  "fidelity",
  "content",
  "monochrome",
  "rainbow",
  "fruit-salad",
] as const;

/** A scheme variant name. */
export type SchemeVariant = (typeof SCHEME_VARIANTS)[number];

/**
 * Contrast level: a name, or an MCU contrast value from -1 (reduced) through
 * 0 (standard) to 1 (maximum).
 */
export type ContrastLevel = "standard" | "medium" | "high" | number;

/** MCU contrast values for each named contrast level. */
export const CONTRAST_LEVELS = {
  standard: 0,
  medium: 0.5,
  high: 1,
} as const;

/**
 * Color spec versions, oldest first: `2021` is the original M3 color spec,
 * `2025` the M3 Expressive color spec (the current one).
 */
export const SPEC_VERSIONS = ["2021", "2025"] as const;

/** A color spec version. */
export type SpecVersion = (typeof SPEC_VERSIONS)[number];

/** The default (current) color spec version. */
export const DEFAULT_SPEC_VERSION: SpecVersion = "2025";

/** Target platforms: `phone` (also right for the web) and `watch`. */
export const PLATFORMS = ["phone", "watch"] as const;

/** A target platform. */
export type Platform = (typeof PLATFORMS)[number];

/** The scheme variants that have 2025 spec rules in MCU. */
export const SPEC_2025_VARIANTS: readonly SchemeVariant[] = [
  "tonal-spot",
  "neutral",
  "vibrant",
  "expressive",
];

/** Options for `createScheme()` beyond variant, theme and contrast. */
export interface SchemeOptions {
  /** The color spec version (default `2025`). */
  specVersion?: SpecVersion;
  /** The target platform (default `phone`). */
  platform?: Platform;
}

/** A static ("custom") color added to a scheme. */
export interface CustomColor {
  /**
   * The role name, in kebab-case, e.g. `success`. Produces
   * `--md-sys-color-<name>`, `-on-<name>`, `-<name>-container` and
   * `-on-<name>-container`.
   */
  name: string;
  /** The color, as a hex string or ARGB integer. */
  value: string | number;
  /**
   * Shift the color's hue toward the scheme's source color (default true).
   * Don't harmonize colors that must stay exact, such as brand colors.
   */
  harmonize?: boolean;
}

/** The tonal palettes a custom color role can take its tone from. */
export type PaletteName =
  "primary" | "secondary" | "tertiary" | "neutral" | "neutralVariant" | "error";

/**
 * The tone (0-100) of a custom role in one theme: one number, or one per
 * contrast level. A level you leave out reuses the previous one (`medium`
 * falls back to `standard`, `high` to `medium`); contrast values in between
 * interpolate, and values below standard use `standard`.
 */
export type ContrastTones =
  number | { standard: number; medium?: number; high?: number };

/**
 * A custom color role (advanced.md "Define custom color roles"): a reference
 * palette and a tone for the light and dark themes, optionally per contrast
 * level. It produces one role, `--md-sys-color-<name>`.
 */
export interface CustomRole {
  /** The role name in kebab-case, e.g. `primary-graphic`. */
  name: string;
  /**
   * The palette to take the color from (default `primary`). The scheme's own
   * palette, so the role follows the source color, variant and `palettes`.
   */
  palette?: PaletteName;
  /**
   * Your own palette instead of one of the scheme's: a hex color or a
   * hue and chroma. Wins over `palette`.
   */
  source?: PaletteInput;
  /** The tone, the same in both themes or `{light, dark}`. */
  tone: ContrastTones | { light: ContrastTones; dark: ContrastTones };
}

/**
 * A key color of a scheme: a hex string or ARGB integer, or a hue (0-360) and
 * chroma that define the tonal palette directly.
 */
export type PaletteInput = string | number | { hue: number; chroma: number };

/**
 * Your own key colors for the scheme's tonal palettes (advanced.md "Adjust
 * existing schemes"). Palettes you leave out come from the variant.
 */
export interface SchemePalettes {
  primary?: PaletteInput;
  secondary?: PaletteInput;
  tertiary?: PaletteInput;
  neutral?: PaletteInput;
  neutralVariant?: PaletteInput;
  error?: PaletteInput;
}

/** Options for generating a dynamic theme. */
export interface ThemeOptions {
  /** The source color, as a hex string or ARGB integer. */
  source: string | number;
  /** The scheme variant (default `tonal-spot`). */
  variant?: SchemeVariant;
  /** The contrast level (default `standard`). */
  contrast?: ContrastLevel;
  /**
   * The color spec version (default `2025`). Variants without 2025 rules
   * follow `2021`.
   */
  specVersion?: SpecVersion;
  /** The target platform (default `phone`). */
  platform?: Platform;
  /** Static colors to add to the scheme. */
  customColors?: CustomColor[];
  /**
   * Custom color roles defined by palette and tone. They follow the scheme's
   * palettes, theme and contrast level, beside `customColors`.
   */
  customRoles?: CustomRole[];
  /**
   * Your own primary, secondary, tertiary, neutral, neutral variant and
   * error key colors. The scheme's regular color roles are derived from them;
   * the source color still drives harmonization of custom colors.
   */
  palettes?: SchemePalettes;
  /**
   * Color fidelity per role (color > Adjust existing colors > Use color
   * fidelity): `true` takes the role's color from the `fidelity` variant, whose
   * tones match the source color; `false` takes it from `variant` (or from
   * `tonal-spot` when `variant` is `fidelity`). Roles that are not flagged
   * follow `variant`.
   *
   * @example
   * ```ts
   * themeFromSource({source, fidelity: {'primary-container': true}});
   * ```
   */
  fidelity?: Partial<Record<ColorRole, boolean>>;
}

/** Role name -> hex color. */
export type ColorRoles = Record<ColorRole, string> & Record<string, string>;

/** A generated theme: every color role, in light and dark. */
export interface DynamicTheme {
  /** The source color, as a hex string. */
  source: string;
  /** The scheme variant. */
  variant: SchemeVariant;
  /** The MCU contrast value. */
  contrast: number;
  /**
   * The color spec version the scheme follows: the requested version, or
   * `2021` for a variant that has no 2025 rules.
   */
  specVersion: SpecVersion;
  /** The target platform. */
  platform: Platform;
  /** Light theme colors by role. */
  light: ColorRoles;
  /** Dark theme colors by role. */
  dark: ColorRoles;
  /**
   * The custom role names added, in order (4 per custom color, then one per
   * custom role).
   */
  customRoles: string[];
}

/** Options for serializing a theme to CSS. */
export interface ThemeCssOptions {
  /** The selector to declare the custom properties on (default `:root`). */
  selector?: string;
  /**
   * `true` for dark values only, `false` for light values only, or omitted
   * for `light-dark()` values that follow `color-scheme`.
   */
  dark?: boolean;
  /**
   * The cascade layer to wrap the rules in (default `md.sys.color`, the
   * layer `md-color-tokens.css` uses). Pass an empty string for none.
   */
  layer?: string;
}

/** Converts a hex string or ARGB integer to ARGB. */
function toArgb(color: string | number): number {
  if (typeof color === "number") return color >>> 0;
  if (!/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color.trim())) {
    throw new Error(`Invalid color "${color}": expected a hex color.`);
  }
  return argbFromHex(color.trim());
}

/** Resolves a contrast level to its MCU value, clamped to [-1, 1]. */
export function contrastValue(contrast: ContrastLevel = "standard"): number {
  const value =
    typeof contrast === "number" ? contrast : CONTRAST_LEVELS[contrast];
  if (value === undefined || Number.isNaN(value)) {
    throw new Error(`Invalid contrast level "${contrast}".`);
  }
  return Math.min(1, Math.max(-1, value));
}

type SchemeConstructor = new (
  sourceColorHct: Hct,
  isDark: boolean,
  contrastLevel: number,
  specVersion?: SpecVersion,
  platform?: Platform,
) => DynamicScheme;

/**
 * Scheme variant -> MCU scheme class. The cast is needed because MCU 0.4's
 * scheme typings import `../dynamiccolor/dynamic_scheme` without a file
 * extension, which NodeNext resolution cannot follow, so TypeScript does not
 * see that the scheme classes extend `DynamicScheme`.
 */
const SCHEMES = {
  "tonal-spot": SchemeTonalSpot,
  neutral: SchemeNeutral,
  vibrant: SchemeVibrant,
  expressive: SchemeExpressive,
  fidelity: SchemeFidelity,
  content: SchemeContent,
  monochrome: SchemeMonochrome,
  rainbow: SchemeRainbow,
  "fruit-salad": SchemeFruitSalad,
} as unknown as Record<SchemeVariant, SchemeConstructor>;

/** Validates a spec version. */
function specVersionValue(version: SpecVersion = DEFAULT_SPEC_VERSION) {
  if (!(SPEC_VERSIONS as readonly string[]).includes(version)) {
    throw new Error(`Unknown color spec version "${version}".`);
  }
  return version;
}

/** Validates a platform. */
function platformValue(platform: Platform = "phone") {
  if (!(PLATFORMS as readonly string[]).includes(platform)) {
    throw new Error(`Unknown platform "${platform}".`);
  }
  return platform;
}

/**
 * The spec version a variant follows when a version is requested: variants
 * without 2025 rules follow 2021, as in MCU.
 */
export function effectiveSpecVersion(
  variant: SchemeVariant,
  specVersion: SpecVersion = DEFAULT_SPEC_VERSION,
): SpecVersion {
  return SPEC_2025_VARIANTS.includes(variant) ? specVersion : "2021";
}

/**
 * Creates the MCU dynamic scheme for a source color.
 *
 * @param source The source color, as a hex string or ARGB integer.
 * @param variant The scheme variant.
 * @param isDark Whether to create the dark theme.
 * @param contrast The contrast level.
 * @param options The color spec version (default `2025`) and platform
 *     (default `phone`).
 * @return The dynamic scheme.
 */
export function createScheme(
  source: string | number,
  variant: SchemeVariant = "tonal-spot",
  isDark = false,
  contrast: ContrastLevel = "standard",
  { specVersion, platform }: SchemeOptions = {},
): DynamicScheme {
  const hct = Hct.fromInt(toArgb(source));
  const level = contrastValue(contrast);
  const Scheme = SCHEMES[variant];
  if (!Scheme) throw new Error(`Unknown scheme variant "${variant}".`);
  return new Scheme(
    hct,
    isDark,
    level,
    specVersionValue(specVersion),
    platformValue(platform),
  );
}

/** Resolves every built-in color role of a scheme to hex. */
export function rolesFromScheme(
  scheme: DynamicScheme,
): Record<ColorRole, string> {
  const roles = {} as Record<ColorRole, string>;
  for (const role of COLOR_ROLES) {
    roles[role] = hexFromArgb(DYNAMIC_COLORS[role].getArgb(scheme));
  }
  return roles;
}

/**
 * Harmonizes a color with a source color: shifts its hue toward the source's
 * hue by up to 15 degrees, keeping its chroma and tone (MCU `Blend`).
 *
 * @return The harmonized color as hex.
 */
export function harmonize(color: string | number, source: string | number) {
  return hexFromArgb(Blend.harmonize(toArgb(color), toArgb(source)));
}

function paletteFrom(input: PaletteInput): TonalPalette {
  if (typeof input === "object") {
    return TonalPalette.fromHueAndChroma(input.hue, input.chroma);
  }
  return TonalPalette.fromInt(toArgb(input));
}

/** Replaces a scheme's tonal palettes with your own key colors. */
function withPalettes(
  scheme: DynamicScheme,
  palettes: SchemePalettes,
): DynamicScheme {
  const pick = (input: PaletteInput | undefined, fallback: TonalPalette) =>
    input === undefined ? fallback : paletteFrom(input);
  return new DynamicScheme({
    sourceColorHct: scheme.sourceColorHct,
    variant: scheme.variant,
    contrastLevel: scheme.contrastLevel,
    isDark: scheme.isDark,
    specVersion: scheme.specVersion,
    platform: scheme.platform,
    primaryPalette: pick(palettes.primary, scheme.primaryPalette),
    secondaryPalette: pick(palettes.secondary, scheme.secondaryPalette),
    tertiaryPalette: pick(palettes.tertiary, scheme.tertiaryPalette),
    neutralPalette: pick(palettes.neutral, scheme.neutralPalette),
    neutralVariantPalette: pick(
      palettes.neutralVariant,
      scheme.neutralVariantPalette,
    ),
    errorPalette: pick(palettes.error, scheme.errorPalette),
  });
}

const ROLE_NAME = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

/** The four role names generated for a custom color. */
export function customColorRoles(
  name: string,
): [string, string, string, string] {
  return [name, `on-${name}`, `${name}-container`, `on-${name}-container`];
}

/**
 * Resolves a custom color's four roles in a scheme. The color becomes the
 * primary palette of a scheme with the same variant, contrast and theme, so
 * its roles follow the accent color conventions (including user-controlled
 * contrast and, for fidelity/content, tone fidelity). Monochrome would turn
 * the color black or white, so custom colors use tonal spot tones there.
 */
function customRolesFromScheme(
  scheme: DynamicScheme,
  color: CustomColor,
): Record<string, string> {
  let argb = toArgb(color.value);
  if (color.harmonize !== false) {
    argb = Blend.harmonize(argb, scheme.sourceColorArgb);
  }
  const variant =
    scheme.variant === Variant.MONOCHROME ? Variant.TONAL_SPOT : scheme.variant;
  const custom = new DynamicScheme({
    sourceColorHct: Hct.fromInt(argb),
    variant,
    contrastLevel: scheme.contrastLevel,
    isDark: scheme.isDark,
    specVersion: scheme.specVersion,
    platform: scheme.platform,
    primaryPalette: TonalPalette.fromInt(argb),
    secondaryPalette: scheme.secondaryPalette,
    tertiaryPalette: scheme.tertiaryPalette,
    neutralPalette: scheme.neutralPalette,
    neutralVariantPalette: scheme.neutralVariantPalette,
    errorPalette: scheme.errorPalette,
  });
  const [main, onMain, container, onContainer] = customColorRoles(color.name);
  return {
    [main]: hexFromArgb(m.primary().getArgb(custom)),
    [onMain]: hexFromArgb(m.onPrimary().getArgb(custom)),
    [container]: hexFromArgb(m.primaryContainer().getArgb(custom)),
    [onContainer]: hexFromArgb(m.onPrimaryContainer().getArgb(custom)),
  };
}

const PALETTE_NAMES: readonly PaletteName[] = [
  "primary",
  "secondary",
  "tertiary",
  "neutral",
  "neutralVariant",
  "error",
];

function paletteOf(scheme: DynamicScheme, name: PaletteName): TonalPalette {
  switch (name) {
    case "primary":
      return scheme.primaryPalette;
    case "secondary":
      return scheme.secondaryPalette;
    case "tertiary":
      return scheme.tertiaryPalette;
    case "neutral":
      return scheme.neutralPalette;
    case "neutralVariant":
      return scheme.neutralVariantPalette;
    case "error":
      return scheme.errorPalette;
  }
}

/** Picks a tone for a contrast value (-1 to 1). */
function toneAt(tones: ContrastTones, contrast: number): number {
  if (typeof tones === "number") return tones;
  const { standard } = tones;
  const medium = tones.medium ?? standard;
  const high = tones.high ?? medium;
  if (contrast <= 0) return standard;
  if (contrast <= 0.5) return standard + (medium - standard) * (contrast / 0.5);
  return medium + (high - medium) * ((contrast - 0.5) / 0.5);
}

function checkTones(role: CustomRole) {
  const list = (t: ContrastTones) =>
    typeof t === "number" ? [t] : [t.standard, t.medium ?? 0, t.high ?? 0];
  const t = role.tone as { light?: ContrastTones; dark?: ContrastTones };
  const tones =
    t && typeof t === "object" && "light" in t
      ? [...list(t.light!), ...list(t.dark!)]
      : list(role.tone as ContrastTones);
  for (const tone of tones) {
    if (typeof tone !== "number" || !(tone >= 0 && tone <= 100)) {
      throw new Error(
        `Custom role "${role.name}": tones are numbers from 0 to 100.`,
      );
    }
  }
}

/** Resolves a custom role's color in a scheme. */
function customRoleColor(scheme: DynamicScheme, role: CustomRole): string {
  const palette =
    role.source !== undefined
      ? paletteFrom(role.source)
      : paletteOf(scheme, role.palette ?? "primary");
  const t = role.tone as { light?: ContrastTones; dark?: ContrastTones };
  const tones: ContrastTones =
    t && typeof t === "object" && "light" in t
      ? scheme.isDark
        ? t.dark!
        : t.light!
      : (role.tone as ContrastTones);
  return hexFromArgb(
    palette.tone(Math.round(toneAt(tones, scheme.contrastLevel))),
  );
}

/**
 * Generates a theme (light and dark) from a source color.
 *
 * @example
 * ```ts
 * const theme = themeFromSource({source: '#6750a4', variant: 'vibrant'});
 * theme.light.primary; // '#...'
 * // The 2021 color spec rules instead of the 2025 (Expressive) ones:
 * themeFromSource({source: '#6750a4', specVersion: '2021'});
 * ```
 */
export function themeFromSource(options: ThemeOptions): DynamicTheme {
  const { source, variant = "tonal-spot", customColors = [] } = options;
  const contrast = contrastValue(options.contrast);
  const specVersion = specVersionValue(options.specVersion);
  const platform = platformValue(options.platform);
  const customRoles: string[] = [];
  for (const color of customColors) {
    if (!ROLE_NAME.test(color.name)) {
      throw new Error(
        `Invalid custom color name "${color.name}": use kebab-case.`,
      );
    }
    for (const role of customColorRoles(color.name)) {
      if ((COLOR_ROLES as readonly string[]).includes(role)) {
        throw new Error(`Custom color "${color.name}" overrides "${role}".`);
      }
      if (customRoles.includes(role)) {
        throw new Error(`Duplicate custom color role "${role}".`);
      }
      customRoles.push(role);
    }
  }

  const roleDefs = options.customRoles ?? [];
  for (const def of roleDefs) {
    if (!ROLE_NAME.test(def.name)) {
      throw new Error(
        `Invalid custom role name "${def.name}": use kebab-case.`,
      );
    }
    if (
      (COLOR_ROLES as readonly string[]).includes(def.name) ||
      customRoles.includes(def.name)
    ) {
      throw new Error(`Custom role "${def.name}" is already a role.`);
    }
    if (def.palette && !PALETTE_NAMES.includes(def.palette)) {
      throw new Error(`Unknown palette "${def.palette}" in "${def.name}".`);
    }
    checkTones(def);
    customRoles.push(def.name);
  }

  const build = (isDark: boolean) => {
    const scheme = createScheme(source, variant, isDark, contrast, {
      specVersion,
      platform,
    });
    const base = options.palettes
      ? withPalettes(scheme, options.palettes)
      : scheme;
    const roles: Record<string, string> = rolesFromScheme(base);
    const flags = Object.entries(options.fidelity ?? {});
    if (flags.length) {
      const fidelity = rolesFromScheme(
        createScheme(source, "fidelity", isDark, contrast, {
          specVersion,
          platform,
        }),
      );
      const plain =
        variant === "fidelity"
          ? rolesFromScheme(
              createScheme(source, "tonal-spot", isDark, contrast, {
                specVersion,
                platform,
              }),
            )
          : roles;
      for (const [role, on] of flags) {
        if (!(COLOR_ROLES as readonly string[]).includes(role)) {
          throw new Error(`Unknown color role "${role}" in fidelity.`);
        }
        roles[role] = on
          ? fidelity[role as ColorRole]
          : plain[role as ColorRole];
      }
    }
    for (const color of customColors) {
      Object.assign(roles, customRolesFromScheme(scheme, color));
    }
    for (const def of roleDefs) {
      roles[def.name] = customRoleColor(base, def);
    }
    return roles as ColorRoles;
  };

  return {
    source: hexFromArgb(toArgb(source)),
    variant,
    contrast,
    specVersion: effectiveSpecVersion(variant, specVersion),
    platform,
    light: build(false),
    dark: build(true),
    customRoles,
  };
}

/** Every role of a theme: the built-in roles, then the custom ones. */
function themeRoles(theme: DynamicTheme): string[] {
  return [...COLOR_ROLES, ...theme.customRoles];
}

/**
 * The custom property declarations for a theme, as `[name, value]` pairs, in
 * the format `md-color-tokens.css` uses (`light-dark()` when light and dark
 * differ).
 */
export function themeProperties(
  theme: DynamicTheme,
  dark?: boolean,
): Array<[string, string]> {
  return themeRoles(theme).map((role) => {
    const light = theme.light[role];
    const darkValue = theme.dark[role];
    let value: string;
    if (dark === true) {
      value = darkValue;
    } else if (dark === false) {
      value = light;
    } else {
      value =
        light === darkValue ? light : `light-dark(${light}, ${darkValue})`;
    }
    return [`--md-sys-color-${role}`, value];
  });
}

function colorScheme(dark?: boolean) {
  return dark === undefined ? "light dark" : dark ? "dark" : "light";
}

/** The condition under which a browser understands `light-dark()`. */
const LIGHT_DARK_SUPPORTED = "(color: light-dark(#000, #fff))";

function rule(theme: DynamicTheme, selector: string, dark?: boolean) {
  const block = (props: Array<[string, string]>) =>
    props.map(([name, value]) => `${name}: ${value};`).join(" ");
  if (dark !== undefined) {
    return `${selector} { color-scheme: ${colorScheme(dark)}; ${block(
      themeProperties(theme, dark),
    )} }`;
  }
  // Both schemes: `light-dark()` where supported. Other browsers get the
  // light values, and the dark ones under `prefers-color-scheme: dark`.
  const light = themeProperties(theme, false);
  const darkProps = themeProperties(theme, true);
  const both = themeProperties(theme);
  const differing = light
    .map((_, i) => i)
    .filter((i) => light[i][1] !== darkProps[i][1]);
  const pick = (props: Array<[string, string]>) =>
    differing.map((i) => props[i]);
  let css = `${selector} { color-scheme: light dark; ${block(light)} }`;
  if (differing.length) {
    css += ` @media (prefers-color-scheme: dark) { ${selector} { ${block(
      pick(darkProps),
    )} } }`;
    css += ` @supports ${LIGHT_DARK_SUPPORTED} { ${selector} { ${block(
      pick(both),
    )} } }`;
  }
  return css;
}

function wrapLayer(css: string, layer: string) {
  return layer ? `@layer ${layer} { ${css} }` : css;
}

/**
 * Serializes a theme to CSS custom properties named like `md-color-tokens.css`.
 *
 * @example
 * ```ts
 * themeToCss(themeFromSource({source: '#00696b'}), {selector: '.teal'});
 * ```
 */
export function themeToCss(
  theme: DynamicTheme,
  { selector = ":root", dark, layer = "md.sys.color" }: ThemeCssOptions = {},
): string {
  return wrapLayer(rule(theme, selector, dark), layer);
}

/** Creates a constructable stylesheet for a theme. */
export function themeToStyleSheet(
  theme: DynamicTheme,
  options?: ThemeCssOptions,
): CSSStyleSheet {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(themeToCss(theme, options));
  return sheet;
}

/** Options for `applyTheme()`. */
export interface ApplyThemeOptions extends Omit<ThemeOptions, "contrast"> {
  /**
   * The contrast level, or `auto` to use high contrast when the user prefers
   * more contrast (`prefers-contrast: more`) and standard otherwise. Element
   * targets resolve `auto` when applied.
   */
  contrast?: ContrastLevel | "auto";
  /** Dark only, light only, or omitted to follow `color-scheme`. */
  dark?: boolean;
}

/** A target that `applyTheme()` can theme. */
export type ThemeTarget = Document | ShadowRoot | HTMLElement;

const appliedSheets = new WeakMap<Document | ShadowRoot, CSSStyleSheet>();
const appliedProperties = new WeakMap<HTMLElement, string[]>();

/**
 * Generates a theme and applies it to a target.
 *
 * - A `Document` or `ShadowRoot` adopts a stylesheet that declares the roles
 *   on `:root` or `:host`. Applying again replaces it.
 * - An element gets the roles as inline custom properties, so the theme
 *   applies to its subtree (for example, a content-based scheme around the
 *   image it came from).
 *
 * @example
 * ```ts
 * applyTheme(document, {source: '#b33b15', variant: 'expressive'});
 * applyTheme(card, {source: await sourceColorFromImage(img), dark: true});
 * ```
 *
 * @return The generated theme.
 */
export function applyTheme(
  target: ThemeTarget,
  options: ApplyThemeOptions,
): DynamicTheme {
  const { contrast = "standard", dark, ...rest } = options;
  if (target instanceof HTMLElement) {
    const level =
      contrast === "auto"
        ? matchMedia("(prefers-contrast: more)").matches
          ? "high"
          : "standard"
        : contrast;
    const theme = themeFromSource({ ...rest, contrast: level });
    applyThemeToElement(target, theme, dark);
    return theme;
  }

  const selector = target instanceof ShadowRoot ? ":host" : ":root";
  let css: string;
  let theme: DynamicTheme;
  if (contrast === "auto") {
    theme = themeFromSource({ ...rest, contrast: "standard" });
    const high = themeFromSource({ ...rest, contrast: "high" });
    css = wrapLayer(
      `${rule(theme, selector, dark)} @media (prefers-contrast: more) { ${rule(
        high,
        selector,
        dark,
      )} }`,
      "md.sys.color",
    );
  } else {
    theme = themeFromSource({ ...rest, contrast });
    css = themeToCss(theme, { selector, dark });
  }

  let sheet = appliedSheets.get(target);
  if (!sheet) {
    sheet = new CSSStyleSheet();
    appliedSheets.set(target, sheet);
  }
  sheet.replaceSync(css);
  // Adopt last so the theme wins over the baseline tokens in the same layer.
  target.adoptedStyleSheets = [
    ...target.adoptedStyleSheets.filter((s) => s !== sheet),
    sheet,
  ];
  return theme;
}

/**
 * Sets a theme's roles as inline custom properties on an element, replacing
 * any theme applied before.
 */
export function applyThemeToElement(
  element: HTMLElement,
  theme: DynamicTheme,
  dark?: boolean,
) {
  clearTheme(element);
  // Inline styles cannot be guarded by `@supports`: without `light-dark()`,
  // resolve the scheme now (`prefers-color-scheme`) instead.
  const resolved =
    dark === undefined && !CSS.supports(LIGHT_DARK_SUPPORTED.slice(1, -1))
      ? matchMedia("(prefers-color-scheme: dark)").matches
      : dark;
  const properties = themeProperties(theme, resolved);
  for (const [name, value] of properties) {
    element.style.setProperty(name, value);
  }
  const names = properties.map(([name]) => name);
  if (dark !== undefined) {
    element.style.setProperty("color-scheme", colorScheme(dark));
    names.push("color-scheme");
  }
  appliedProperties.set(element, names);
}

/** Removes a theme applied with `applyTheme()`. */
export function clearTheme(target: ThemeTarget) {
  if (target instanceof HTMLElement) {
    for (const name of appliedProperties.get(target) ?? []) {
      target.style.removeProperty(name);
    }
    appliedProperties.delete(target);
    return;
  }
  const sheet = appliedSheets.get(target);
  if (!sheet) return;
  target.adoptedStyleSheets = target.adoptedStyleSheets.filter(
    (s) => s !== sheet,
  );
  appliedSheets.delete(target);
}

/**
 * Picks the source color from RGBA pixel data: quantizes the opaque pixels to
 * at most 128 colors (Celebi) and returns the top scored color (the most
 * suitable for a UI theme, MCU `Score`).
 *
 * @param rgba RGBA bytes, as in `ImageData.data`.
 * @return The source color as hex.
 */
export function sourceColorFromPixels(rgba: ArrayLike<number>): string {
  const pixels: number[] = [];
  for (let i = 0; i + 3 < rgba.length; i += 4) {
    if (rgba[i + 3] < 255) continue;
    pixels.push(argbFromRgb(rgba[i], rgba[i + 1], rgba[i + 2]));
  }
  const ranked = Score.score(QuantizerCelebi.quantize(pixels, 128));
  return hexFromArgb(ranked[0]);
}

/** An image to extract a source color from. */
export type ImageSource =
  | HTMLImageElement
  | HTMLCanvasElement
  | HTMLVideoElement
  | ImageBitmap
  | ImageData
  | string;

/** Options for image color extraction. */
export interface ImageOptions {
  /**
   * The image is scaled down so its longest side is at most this many pixels
   * before quantizing (default 128); this keeps extraction fast.
   */
  maxSize?: number;
}

async function loadImage(url: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = url;
  await img.decode();
  return img;
}

async function imagePixels(
  source: ImageSource,
  maxSize: number,
): Promise<ArrayLike<number>> {
  if (source instanceof ImageData) return source.data;
  const image = typeof source === "string" ? await loadImage(source) : source;
  let width: number;
  let height: number;
  if (image instanceof HTMLImageElement) {
    if (!image.complete || !image.naturalWidth) await image.decode();
    width = image.naturalWidth;
    height = image.naturalHeight;
  } else if (image instanceof HTMLVideoElement) {
    width = image.videoWidth;
    height = image.videoHeight;
  } else {
    width = image.width;
    height = image.height;
  }
  if (!width || !height) throw new Error("The image has no pixels.");
  const scale = Math.min(1, maxSize / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Could not get a 2D canvas context.");
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return context.getImageData(0, 0, canvas.width, canvas.height).data;
}

/**
 * Extracts the source color from an image (content-based or user-generated
 * color source). Cross-origin images must be CORS-enabled.
 *
 * @return The source color as hex.
 */
export async function sourceColorFromImage(
  image: ImageSource,
  { maxSize = 128 }: ImageOptions = {},
): Promise<string> {
  return sourceColorFromPixels(await imagePixels(image, maxSize));
}

/**
 * Generates a theme from an image. Defaults to the `content` variant, the
 * content-based algorithm whose tones match the source image (system.md
 * "Feed the source color into an algorithm"); pass `tonal-spot` for a
 * user-generated (wallpaper) scheme.
 */
export async function themeFromImage(
  image: ImageSource,
  options: Omit<ThemeOptions, "source"> & ImageOptions = {},
): Promise<DynamicTheme> {
  const { maxSize, variant = "content", ...rest } = options;
  const source = await sourceColorFromImage(image, { maxSize });
  return themeFromSource({ ...rest, variant, source });
}

/** A color in HCT: hue (0-360), chroma (0 up) and tone (0-100). */
export interface HctColor {
  readonly hue: number;
  readonly chroma: number;
  readonly tone: number;
}

/**
 * Converts a hex string or ARGB integer to HCT.
 *
 * @example
 * ```ts
 * const {hue, chroma, tone} = hctFromColor('#6750a4');
 * hctToHex({hue, chroma, tone: 90}); // a lighter tone of the same color
 * ```
 */
export function hctFromColor(color: string | number): HctColor {
  const hct = Hct.fromInt(toArgb(color));
  return { hue: hct.hue, chroma: hct.chroma, tone: hct.tone };
}

/**
 * Converts HCT to ARGB. Colors outside the sRGB gamut are brought in by
 * lowering chroma, keeping hue and tone, so the result's chroma can be lower
 * than requested (read it back with `hctFromColor()`).
 */
export function hctToArgb({ hue, chroma, tone }: HctColor): number {
  return Hct.from(hue, chroma, tone).toInt();
}

/** Converts HCT to a hex string (see `hctToArgb()` for out-of-gamut colors). */
export function hctToHex(hct: HctColor): string {
  return hexFromArgb(hctToArgb(hct));
}

/**
 * Returns the color with another hue, chroma or tone (for example, the tone 90
 * version of a brand color), as hex.
 */
export function hctWith(
  color: string | number,
  changes: Partial<HctColor>,
): string {
  return hctToHex({ ...hctFromColor(color), ...changes });
}

/** The Material Theme Builder export fields that `themeFromThemeBuilder` reads. */
export interface ThemeBuilderExport {
  /** The source (seed) color. */
  seed?: string;
  /** The core colors. Primary is the seed when no `seed` is given. */
  coreColors?: {
    primary?: string;
    secondary?: string;
    tertiary?: string;
    neutral?: string;
    neutralVariant?: string;
    error?: string;
  };
  /** The extended (custom) colors. */
  extendedColors?: Array<{
    name: string;
    color: string;
    /** Harmonize with the seed (default true). */
    harmonized?: boolean;
  }>;
  /** A scheme variant, kebab-case or camelCase (default `tonal-spot`). */
  variant?: string;
  schemeVariant?: string;
  /** A contrast level name or number. */
  contrast?: ContrastLevel;
  /** Palettes and schemes in the export are ignored: they are regenerated. */
  [other: string]: unknown;
}

function kebab(text: string): string {
  const name = text
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return /^[a-z]/.test(name) ? name : `color-${name}`;
}

/**
 * Reads a Material Theme Builder export (its JSON, as a string or object) as
 * theme options: the seed becomes `source`, other core colors become
 * `palettes`, extended colors become `customColors`. Pass the result to
 * `applyTheme()` or `themeFromSource()`.
 */
export function themeOptionsFromThemeBuilder(
  json: string | ThemeBuilderExport,
  overrides: Partial<ThemeOptions> = {},
): ThemeOptions {
  const data: ThemeBuilderExport =
    typeof json === "string" ? JSON.parse(json) : json;
  const core = data.coreColors ?? {};
  const source = data.seed ?? core.primary;
  if (!source) {
    throw new Error("Theme Builder export has no seed or primary color.");
  }
  const palettes: SchemePalettes = {};
  for (const key of PALETTE_NAMES) {
    const color = core[key];
    if (color && !(key === "primary" && color === source)) {
      palettes[key] = color;
    }
  }
  const variant = kebab(data.schemeVariant ?? data.variant ?? "tonal-spot");
  if (!(SCHEME_VARIANTS as readonly string[]).includes(variant)) {
    throw new Error(`Unknown scheme variant "${variant}" in export.`);
  }
  const options: ThemeOptions = {
    source,
    variant: variant as SchemeVariant,
    customColors: (data.extendedColors ?? []).map((c) => ({
      name: kebab(c.name),
      value: c.color,
      harmonize: c.harmonized !== false,
    })),
  };
  if (Object.keys(palettes).length) options.palettes = palettes;
  if (data.contrast !== undefined) options.contrast = data.contrast;
  return { ...options, ...overrides };
}

/**
 * Generates a theme from a Material Theme Builder export, which
 * `themeToCss()` and `themeToStyleSheet()` accept. For `applyTheme()` use
 * `themeOptionsFromThemeBuilder()`.
 */
export function themeFromThemeBuilder(
  json: string | ThemeBuilderExport,
  overrides?: Partial<ThemeOptions>,
): DynamicTheme {
  return themeFromSource(themeOptionsFromThemeBuilder(json, overrides));
}
