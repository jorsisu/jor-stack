---
name: jor-prototype
description: Build a throwaway prototype to answer a design question. Use to sanity-check whether a state model or logic feels right, or to explore what a UI should look like with variants screenshotted at the project's breakpoints.
disable-model-invocation: true
metadata:
  based-on: "mattpocock/skills skills/engineering/prototype @ 321658273cb1d20b76026717d027d505790106d4 (SKILL.md, LOGIC.md, UI.md)"
---

In Codex, use `$jor-...` for these commands, or `$jor-stack:jor-...` when the skill picker shows the plugin namespace.

# Prototype

A prototype is **throwaway code that answers a question**. The question decides the shape.

## Pick a branch

Identify which question is being answered, using the user's prompt, the surrounding code, or by asking if the user is around:

- **"Does this logic / state model feel right?"** → [LOGIC.md](LOGIC.md). Build a single shareable HTML file (free-play buttons plus tabbed guided walkthroughs) that pushes the state machine through cases that are hard to reason about on paper, and that a non-developer can drive.
- **"What should this look like?"** → [UI.md](UI.md). Generate several radically different UI variations on a single route, switchable via a URL search param and a floating bottom bar. Drive each variant at the five breakpoints (360, 768, 1280, 1440, 1920) by reading `.agents/skills/verify-<project>/SKILL.md` and following it. If that file is missing, read `.cursor/skills/verify-<project>/SKILL.md` and follow that instead. Screenshot the variants for side-by-side comparison. If neither file exists, tell the user to run `/jor-verify`.

The two branches produce very different artifacts, so getting this wrong wastes the whole prototype. If the question is genuinely ambiguous and the user isn't reachable, default to whichever branch better matches the surrounding code (a backend module → logic; a page or component → UI) and state the assumption at the top of the prototype.

## Rules that apply to both

1. **Throwaway from day one, and clearly marked as such.** Locate the prototype code close to where it will actually be used (next to the module or page it's prototyping for) so context is obvious, but name it so a casual reader can see it's a prototype, not production. For throwaway UI routes, obey whatever routing convention the project already uses; don't invent a new top-level structure.
2. **Trivial to run.** A UI prototype starts from one command in the project's task runner: `pnpm <name>`, `python <path>`, `bun <path>`, etc. A logic demo is a single HTML file the user double-clicks. Either way, no thinking required to start it.
3. **No persistence by default.** State lives in memory. Persistence is the thing the prototype is _checking_, not something it should depend on. If the question explicitly involves a database, hit a scratch DB or a local file with a clear "PROTOTYPE, wipe me" name.
4. **Skip the polish.** No tests, no error handling beyond what makes the prototype _runnable_, no abstractions. The point is to learn something fast.
5. **Surface the state.** After every action (logic) or on every variant switch (UI), print or render the full relevant state so the user can see what changed.
6. **Capture it when done.** Record the verdict and the question it settled, with a path to the prototype, wherever the work is tracked: the conversation, the `.scratch/<feature-slug>/` spec or ticket file, or the PR description. Preserve the prototype as a **primary source**; use a throwaway branch if committing it is already authorized. Choosing a design does not authorize production edits. Stop at the decision and recommend `/jor-implement` unless implementation is already explicitly authorized; then implement within that scope using the agreed checks.
