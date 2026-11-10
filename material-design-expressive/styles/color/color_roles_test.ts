/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {
  hctFromColor,
  hctToHex,
  hctWith,
  themeFromSource,
  themeFromThemeBuilder,
  themeOptionsFromThemeBuilder,
  themeToCss,
} from "./dynamic-color.js";

const SOURCE = "#6750a4";

describe("custom color roles (palette and tone)", () => {
  // spec: color-advanced-4f2269, color-advanced-d3507f
  it("takes the tone from a scheme palette for light and dark", () => {
    const theme = themeFromSource({
      source: SOURCE,
      customRoles: [
        {
          name: "primary-graphic",
          palette: "primary",
          tone: { light: 50, dark: 70 },
        },
      ],
    });
    expect(theme.customRoles).toEqual(["primary-graphic"]);
    expect(Math.round(hctFromColor(theme.light["primary-graphic"]).tone)).toBe(
      50,
    );
    expect(Math.round(hctFromColor(theme.dark["primary-graphic"]).tone)).toBe(
      70,
    );
    expect(themeToCss(theme)).toContain("--md-sys-color-primary-graphic:");
  });

  it("follows the scheme palette hue and contrast tones", () => {
    const tones = { standard: 50, medium: 40, high: 30 };
    const at = (contrast: "standard" | "medium" | "high") =>
      themeFromSource({
        source: SOURCE,
        contrast,
        customRoles: [{ name: "graphic", tone: tones }],
      }).light["graphic"];
    expect(Math.round(hctFromColor(at("standard")).tone)).toBe(50);
    expect(Math.round(hctFromColor(at("medium")).tone)).toBe(40);
    expect(Math.round(hctFromColor(at("high")).tone)).toBe(30);
    const primary = themeFromSource({ source: SOURCE }).light["primary"];
    expect(
      Math.abs(hctFromColor(at("standard")).hue - hctFromColor(primary).hue),
    ).toBeLessThan(2);
  });

  it("uses palettes you pass and own palette sources", () => {
    const theme = themeFromSource({
      source: SOURCE,
      palettes: { tertiary: "#00a86b" },
      customRoles: [
        { name: "accent", palette: "tertiary", tone: 60 },
        { name: "own", source: { hue: 30, chroma: 60 }, tone: 60 },
      ],
    });
    const hue = (hex: string) => hctFromColor(hex).hue;
    expect(Math.abs(hue(theme.light["accent"]) - hue("#00a86b"))).toBeLessThan(
      15,
    );
    expect(Math.abs(hue(theme.light["own"]) - 30)).toBeLessThan(10);
  });

  it("rejects bad names, collisions and tones", () => {
    const make = (name: string, tone = 50) =>
      themeFromSource({ source: SOURCE, customRoles: [{ name, tone }] });
    expect(() => make("Bad Name")).toThrow();
    expect(() => make("primary")).toThrow();
    expect(() => make("x", 120)).toThrow();
    expect(() =>
      themeFromSource({
        source: SOURCE,
        customColors: [{ name: "ok", value: "#00a86b" }],
        customRoles: [{ name: "on-ok", tone: 50 }],
      }),
    ).toThrow();
  });
});

describe("HCT helpers", () => {
  it("converts hex to HCT and back", () => {
    const hct = hctFromColor(SOURCE);
    expect(hct.hue).toBeGreaterThan(0);
    expect(hct.tone).toBeGreaterThan(0);
    expect(hctToHex(hct)).toBe(SOURCE);
    expect(hctFromColor(0xff6750a4).hue).toBeCloseTo(hct.hue, 5);
  });

  it("changes one channel with hctWith()", () => {
    const lighter = hctWith(SOURCE, { tone: 90 });
    expect(Math.round(hctFromColor(lighter).tone)).toBe(90);
    expect(
      Math.abs(hctFromColor(lighter).hue - hctFromColor(SOURCE).hue),
    ).toBeLessThan(6);
  });
});

describe("themeFromThemeBuilder()", () => {
  const exported = {
    seed: "#6750A4",
    coreColors: { primary: "#6750A4", tertiary: "#00A86B" },
    extendedColors: [
      { name: "Custom Color 1", color: "#FF5722", harmonized: false },
      { name: "success", color: "#2E7D32", harmonized: true },
    ],
    schemes: { light: {}, dark: {} },
    palettes: {},
  };

  it("reads seed, core colors and extended colors", () => {
    const options = themeOptionsFromThemeBuilder(exported);
    expect(options.source).toBe("#6750A4");
    expect(options.palettes).toEqual({ tertiary: "#00A86B" });
    expect(options.customColors).toEqual([
      { name: "custom-color-1", value: "#FF5722", harmonize: false },
      { name: "success", value: "#2E7D32", harmonize: true },
    ]);
    const theme = themeFromThemeBuilder(JSON.stringify(exported));
    expect(theme.customRoles.length).toBe(8);
    expect(theme.light["custom-color-1"]).toBeTruthy();
    expect(themeToCss(theme)).toContain("--md-sys-color-success:");
  });

  it("reads the variant and contrast and accepts overrides", () => {
    const options = themeOptionsFromThemeBuilder({
      seed: "#6750A4",
      schemeVariant: "fruitSalad",
      contrast: "high",
    });
    expect(options.variant).toBe("fruit-salad");
    expect(
      themeFromThemeBuilder({ seed: "#6750A4", contrast: "high" }).contrast,
    ).toBe(1);
    expect(
      themeFromThemeBuilder(exported, { variant: "vibrant" }).variant,
    ).toBe("vibrant");
  });

  it("needs a seed", () => {
    expect(() => themeFromThemeBuilder({})).toThrow();
    expect(() =>
      themeFromThemeBuilder({ seed: "#6750A4", variant: "nope" }),
    ).toThrow();
  });
});
