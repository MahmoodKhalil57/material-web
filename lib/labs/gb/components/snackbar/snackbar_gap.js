import"../../chunks/chunk-IZLS6X2G.js";import"../../chunks/chunk-7JRC7BHN.js";import"../../chunks/chunk-I6XHJJC7.js";import"../../chunks/chunk-4ALLPR45.js";import"../../chunks/chunk-MNQPNGBC.js";import"../../chunks/chunk-XITO3S2G.js";import"../../chunks/chunk-PV5BZ7Q3.js";import"../../chunks/chunk-N2CBEHBR.js";import"../../chunks/chunk-PSCELYSS.js";import"../../chunks/chunk-SFW3MHH7.js";import"../../chunks/chunk-AZF4SAF6.js";import"../../chunks/chunk-LAHGUAGM.js";import"../../chunks/chunk-UUQJVX7P.js";import"../../chunks/chunk-JUNG2MTN.js";import"../../chunks/chunk-OHIE4ONL.js";import"../../chunks/chunk-OXQ2E7KO.js";import"../../chunks/chunk-DWUR375C.js";import"../../chunks/chunk-2TXI42VJ.js";import"../../chunks/chunk-OZUV56YX.js";import{a as i}from"../../chunks/chunk-XAMMWB2I.js";import{a as n}from"../../chunks/chunk-BYSTHSJK.js";import{a as e}from"../../chunks/chunk-RRSR2DPT.js";import"../../chunks/chunk-PUWN7RFK.js";import"../../chunks/chunk-HUXS3TKG.js";import"../../chunks/chunk-SZVN5I3Q.js";import"../../chunks/chunk-MZFGRIKD.js";import"../../chunks/chunk-MSNV3O7X.js";import{b as a}from"../../chunks/chunk-YRNKHAFN.js";e(document,[n]);describe("<md-gb-snackbar> gaps",()=>{let o=new i;it("is 64dp tall with two lines of text on a compact layout",async()=>{let s=o.render(a`<div style="width: 360px; height: 300px; position: relative">
        <md-gb-snackbar
          open
          quick
          label-text="A message long enough that it needs to wrap onto a second line on a compact layout"></md-gb-snackbar>
      </div>`);await o.waitForStability();let t=s.querySelector("md-gb-snackbar");await t.updateComplete,t.shadowRoot.getAnimations().forEach(c=>c.finish());let r=t.shadowRoot.querySelector(".snackbar-surface");expect(r.getBoundingClientRect().height).toBe(64)})});
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
