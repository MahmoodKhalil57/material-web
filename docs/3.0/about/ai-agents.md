---
title: AI agents
section: about
order: 9
description: labs/gb/skill/ is a Claude Code skill named md-gb.
---

## What the skill is

`labs/gb/skill/` is a Claude Code skill named `md-gb`. It teaches an agent which
`md-gb-*` element to pick, and each element's attributes, properties, slots,
events, CSS parts, custom properties, and what the app must provide itself. It
is one `SKILL.md` plus a reference file per component.

## Install it

Copy the folder into your skills directory. For all of your projects:

```sh
mkdir -p ~/.claude/skills/md-gb
cp -r labs/gb/skill/. ~/.claude/skills/md-gb/
```

To share it with one repository, copy it to `.claude/skills/md-gb/` in that
repository instead. Claude Code loads it when you write HTML, Lit templates, or
CSS that use `md-gb-*` elements.

## Keep it current

The skill is generated from the component sources and `scripts/m3/CHECKLIST.md`.
Do not edit it by hand. To regenerate it, run:

```sh
node scripts/m3/gen-agent-skill.mjs
```

Run the same command with `--check` to fail when the output is stale. After you
change a component, regenerate the skill and copy it again, because an installed
copy does not update itself.

## Watch out

- The skill covers the `md-gb-*` elements of 3.0 only. For 2.5.0 `md-*`
  elements, use the v2.5.0 documentation.
- Each reference file lists what the app must provide itself. Check those
  lines before you rely on the agent's markup.
