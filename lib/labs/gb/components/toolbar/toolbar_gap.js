import"../../chunks/chunk-QNNUYBNL.js";import"../../chunks/chunk-FFYGOGRC.js";import"../../chunks/chunk-XN62SFLW.js";import"../../chunks/chunk-UDQB6G66.js";import"../../chunks/chunk-MRO44G4Y.js";import"../../chunks/chunk-EBAMEZUH.js";import"../../chunks/chunk-5CPGBQJU.js";import"../../chunks/chunk-T4YKI2IL.js";import"../../chunks/chunk-SAVI7PSL.js";import"../../chunks/chunk-J4PPHVRR.js";import"../../chunks/chunk-EZKHESQI.js";import"../../chunks/chunk-AEVMN2TV.js";import"../../chunks/chunk-RQOLZF6O.js";import"../../chunks/chunk-AHVWVFIQ.js";import"../../chunks/chunk-TF5TTUOH.js";import"../../chunks/chunk-VROLB7DA.js";import"../../chunks/chunk-H5LCKZCQ.js";import"../../chunks/chunk-OPQD4NNN.js";import"../../chunks/chunk-ZOOJBJM4.js";import"../../chunks/chunk-VEUC3475.js";import"../../chunks/chunk-YZRY4EP7.js";import"../../chunks/chunk-P6LKPJG5.js";import"../../chunks/chunk-PV5BZ7Q3.js";import"../../chunks/chunk-JOFVBJZY.js";import"../../chunks/chunk-BSYQOTQO.js";import"../../chunks/chunk-4GP2DOSS.js";import"../../chunks/chunk-THNPU74B.js";import"../../chunks/chunk-L53ZTFE6.js";import"../../chunks/chunk-LAM7XTM2.js";import"../../chunks/chunk-HSWNOLES.js";import"../../chunks/chunk-PSCELYSS.js";import"../../chunks/chunk-SFW3MHH7.js";import"../../chunks/chunk-AZF4SAF6.js";import"../../chunks/chunk-UUQJVX7P.js";import"../../chunks/chunk-Q4E4VNSB.js";import"../../chunks/chunk-5MKFU3OX.js";import"../../chunks/chunk-OXQ2E7KO.js";import"../../chunks/chunk-DWUR375C.js";import"../../chunks/chunk-WYBTMT3K.js";import{a}from"../../chunks/chunk-XAMMWB2I.js";import{a as l}from"../../chunks/chunk-BYSTHSJK.js";import{a as n}from"../../chunks/chunk-RRSR2DPT.js";import"../../chunks/chunk-BX5ELK2G.js";import"../../chunks/chunk-PUWN7RFK.js";import"../../chunks/chunk-HUXS3TKG.js";import"../../chunks/chunk-TY6MUWQF.js";import"../../chunks/chunk-MZFGRIKD.js";import"../../chunks/chunk-MSNV3O7X.js";import{b as t}from"../../chunks/chunk-YRNKHAFN.js";n(document,[l]);describe("md-gb-toolbar gaps",()=>{let o=new a;it("moves the trailing actions that do not fit into an overflow slot",async()=>{let m=Array.from({length:12},(r,i)=>t`<md-gb-icon-button slot="trailing" aria-label=${"Action "+i}
          >${i}</md-gb-icon-button
        >`),e=o.render(t`<div style="width: 240px"
      ><md-gb-toolbar
        >${m}<md-gb-icon-button slot="overflow" aria-label="More"
          >m</md-gb-icon-button
        ></md-gb-toolbar
      ></div
    >`);await o.waitForStability();let d=Array.from(e.querySelectorAll("[slot=trailing]")).filter(r=>r.hidden);expect(d.length).toBeGreaterThan(0),expect(e.querySelector("[slot=overflow]").getBoundingClientRect().width).toBeGreaterThan(0)})});
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
