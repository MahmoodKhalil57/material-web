# AI agents

labs/gb/skill/ is a Claude Code skill named md-gb.

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

### Install it from this site

Without a checkout, the skill files are published at `/material-web/3.0/skill/`. The page tools
button (bottom end of every page) opens Download & copy, which has Copy agent
prompt: paste it into your agent and it
creates the skills folder, downloads `SKILL.md` and every `reference/*.md` file
listed in `/material-web/3.0/skill/index.json`, installs `@material/web`, and checks the
result.

The same menu downloads the whole API as one `custom-elements.json` (a
[Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest)
of every element), and `/material-web/3.0/llms.txt` indexes the docs as Markdown.

## Keep it current

The skill is generated from the component sources and `scripts/m3/CHECKLIST.md`.
Do not edit it by hand. To regenerate it, run:

```sh
node scripts/m3/gen-agent-skill.mjs
```

Run the same command with `--check` to fail when the output is stale. After you
change a component, regenerate the skill and copy it again, because an installed
copy does not update itself.

## Browser agents (WebMCP)

On every page of these docs, a browser that supports
[WebMCP](https://webmachinelearning.github.io/webmcp/) lets its agent search and
read the docs through five read-only tools. Nothing is registered in other
browsers. The tools use the same search as the Cmd+K dialog, and every page is
also available as Markdown at its URL plus `.md`.

- `search_docs` finds sections by keywords: `{query, limit?}`.
- `get_page` returns a page or one section as Markdown: `{path, section?}`.
- `list_pages` lists the pages, optionally of one section: `{section?}`.
- `get_component_api` returns the properties, slots, events, methods, CSS parts
  and custom properties of an element: `{tag}`.
- `get_current_page` describes the page the user is on, with its outline.

An agent calls them through the browser. This demo calls the same functions the
page registers (`window.gbDocsTools`) and shows the first three results of a
search.

**Example: Search result of the WebMCP tool**

*HTML*

```html
<output id="result">Searching…</output>
```

*TypeScript*

```ts
// The page registers the tools once its script has loaded.
const tools = await new Promise<any>((resolve) => {
  const check = () => {
    const found = (parent as any).gbDocsTools;
    if (found) resolve(found);
    else setTimeout(check, 50);
  };
  check();
});
const out = document.querySelector('#result')!;
const found = await tools.search_docs({query: 'split button menu', limit: 3});
out.textContent = found.results.map((r: any) => `${r.heading}: ${r.url}`).join('\n');
```

## Watch out

- The skill covers the `md-gb-*` elements of 3.0 only. For 2.5.0 `md-*`
  elements, use the v2.5.0 documentation.
- Each reference file lists what the app must provide itself. Check those
  lines before you rely on the agent's markup.
