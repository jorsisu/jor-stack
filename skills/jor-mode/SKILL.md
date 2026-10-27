---
name: jor-mode
description: Ask which jor skill or flow fits your situation. A router over the jor-stack skills.
disable-model-invocation: true
metadata:
  based-on: "new; layout modeled on mattpocock/skills skills/engineering/ask-matt/SKILL.md @ 954ee7fd7f1911b79bfa82589b4d35ab6c4b13b8"
---

In Codex, use `$jor-...` for these commands, or `$jor-stack:jor-...` when the skill picker shows the plugin namespace.

# Jor Mode

You don't remember every skill, so ask.

Before stating what a skill does or recommending a step be skipped, read that skill's SKILL.md: the summaries here are for orientation only.

Every jor skill is **slash-only**: nothing runs unless the user types its name. Recommend the next `/jor-...` command; don't run it on the user's behalf.

A **flow** is a path through the skills. Most work travels one **main flow**, from a loaded ticket to a merged PR. Everything else is used outside the main flow, or is a one-time setup per project.

If the user wants to check that you understood them, suggest **`/jor-restate`** rather than restating their goal yourself.

## The main flow: ticket → ship

1. **Load the ticket.** Start with the ticket in the conversation (for example via `/twg-jira`).
2. **`/jor-get-ready`** investigates and proposes. It reads the ticket, comments, project rules and code, reproduces the bug or confirms the gap, and returns a proposal. It changes nothing.
3. **Branch: is this bigger than one change?**
   - **Yes** → **`/jor-to-spec`** turns the thread into a spec at `.scratch/<feature-slug>/spec.md`, then **`/jor-to-tickets`** splits it into tracer-bullet tickets under `.scratch/<feature-slug>/issues/`, each declaring its blockers. Recommend the user run `/jor-get-ready` for each ticket, blockers first.
   - **No** → go to step 4.
4. **Branch: what kind of work?**
   - **Feature** → **`/jor-tdd`**: one red-green slice at a time, at agreed seams.
   - **Bug** → **`/jor-debug`**: build a tight feedback loop first, then reproduce, hypothesise, instrument, fix with a regression test.
   - **Unsure of the design** → **`/jor-prototype`**: throwaway variants that answer one design question. Recommend the user run `/jor-tdd` with the chosen variant.
5. **`/jor-browser-review`** checks the finished change in a real browser through Chrome DevTools MCP, at the project's breakpoints, and hands back URLs for human verification.
6. **`/jor-review`** runs a two-axis review of the diff: Standards (the repo's coding standards plus a smell baseline) and Spec (the ticket or `.scratch` spec already in the conversation).
7. **`/jor-pr`** writes the PR body: the smallest visual that shows the change, before/after evidence, and merge danger.
8. **`/jor-retro`** · **`/jor-handoff`** close the loop. `/jor-retro` suggests changes to the agent's environment, not the code. `/jor-handoff` writes a handoff document when the work moves to a fresh session, a new directory, or a colleague.

## One-time setup per project

- **`/jor-verify`** writes the project's own skill to `.agents/skills/verify-<project>/` on Chrome DevTools MCP, with `doctor`, `breakpoints` (360, 768, 1280, 1440, 1920) and `snapshot` commands plus a feature map. If the project already uses `.cursor/skills/`, it asks which folder to use. `jor-browser-review`, `jor-debug`, and `jor-prototype` read `.agents/skills/verify-<project>/SKILL.md` first, then `.cursor/skills/verify-<project>/SKILL.md`. Recommend the user run `/jor-verify` once per project before relying on either.

## Outside the main flow

- **`/jor-grill-me`**: a relentless interview that sharpens an idea, plan, or design. Use it when you start from an idea rather than a ticket. It writes no files. When decisions are unclear, `jor-get-ready` reads `../jor-grill-me/SKILL.md` and follows it.
- **`/jor-restate`**: an understanding check. Restates the user's goal and problem, then stops.
- **`/jor-design`**: deep-module vocabulary (module, interface, depth, seam, adapter, leverage, locality) for shaping a module's interface while you shape code.
- **`/jor-domain`**: encode the domain in a data structure (state machine, discriminated union, lookup table) instead of scattered conditionals, while you shape code.
- **`/jor-teach`**: explain a body of work plainly so the user actually understands it.
- **`/jor-verify-maintain`**: keep the `verify-<project>` skill and its feature map honest. Recommend the user run it on demand or after UI-heavy sprints. It looks in `.agents/skills/verify-*/`, then `.cursor/skills/verify-*/`.
- **`/jor-mode`**: this router.

## Phase boundaries

A **phase** is a chunk of work inside a session: the investigation, the implementation, the review. At a boundary you can continue in the same context, clear it, delegate a tightly-scoped task to a subagent, or recommend the user run **`/jor-handoff`** when the next session needs a portable file (a new harness, a new directory, a colleague). Keep `/jor-get-ready` through `/jor-to-tickets` in one unbroken context so the proposal, spec, and tickets build on the same thinking; each ticket can then start fresh from its file.

## Private working files

Specs and tickets live in `.scratch/` inside the project. `/jor-to-spec` and `/jor-to-tickets` make sure `.scratch/` is listed in `.git/info/exclude` (git's local-only ignore) and never touch the shared `.gitignore`. These files are never committed.
