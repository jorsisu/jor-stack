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

`jor-writing-for-agents` can be selected automatically for requests to create, edit, review, or consolidate skills and agent instructions. `jor-peer-review` runs automatically after `jor-implement` or `jor-bugfix` checks pass, and can also be requested explicitly. `jor-dr-stack` can be selected for stack consistency audit requests. All other jor skills are **manual-only**. Recommend the next `/jor-...` command for those skills; don't run it on the user's behalf.

A **flow** is a path through the skills. Use investigation and planning when needed, then authorized implementation, checks, automatic peer review, requested browser review, optional full review for large changes, and a PR body. Committing, pushing, publishing, and merging require separate authorization. Other skills support a specific decision, lesson, handoff, or project setup.

If the user wants to check that you understood them, suggest **`/jor-restate`** rather than restating their goal yourself.

## The main flow: task → PR body

1. **Load the task.** Start with the ticket in the conversation (for example via `/twg-jira`) or the user's direct request.
2. **Check context.** If the request and relevant code are already understood, skip `/jor-get-ready` and choose the route below. Otherwise, it reads the task, discussion, project rules and code, reproduces the bug or confirms the gap, and returns a proposal. It changes nothing.
3. **Choose by uncertainty and scope:**
   - **Unknown bug cause** → **`/jor-bugfix`**: build a tight feedback loop, reproduce, diagnose, and fix within the authorized scope. Diagnose before prescribing a spec or ticket breakdown for the fix.
   - **One clear change** → **`/jor-implement`**: implement a feature or a bug fix whose cause and intended change are established. Accept a clear, authorized request, spec, ticket, or approved proposal. For test-first work, read `jor-tdd` and follow its red-green loop at existing public or user-agreed seams.
   - **Several deliverables with understood scope** → **`/jor-to-spec`** confirms unresolved test seams and writes `.scratch/<feature-slug>/spec.md`. **`/jor-to-tickets`** proposes a breakdown, then writes approved tickets under `.scratch/<feature-slug>/issues/`, each declaring its blockers. Recommend `/jor-get-ready` for each ticket whose blockers are complete and choose its next step from the findings. These are local files, not Jira mutations.
   - **Unsure of the design** → **`/jor-prototype`**: throwaway variants that answer one design question. Recommend the user run `/jor-implement` with the chosen variant.
4. **Keep changes within authorization.** A direct implementation request supplies authorization for its stated scope. An investigation-only request stops at the findings or proposal until implementation is authorized. If diagnosis reveals several deliverables or a wider fix, recommend `/jor-to-spec` and `/jor-to-tickets` before expanding the work.
5. **After implementation checks, automatic `jor-peer-review`.** `jor-implement` and `jor-bugfix` follow [../jor-peer-review/SKILL.md](../jor-peer-review/SKILL.md) before closeout. One read-only agent reviews the task's changes and directly affected code. The main agent fixes valid findings within scope, reruns affected checks, and gets one focused recheck when fixes were made. Report remaining findings; do not restart the loop automatically. No base commit or full standards audit is required.
6. **After peer review, `/jor-browser-review` when requested** checks the finished change through Chrome DevTools MCP at the project's breakpoints and returns URLs for human verification. Browser checks need an explicit request in the current chat; server start, stop, or restart also needs an explicit request. If browser findings require code changes, use an authorized implementation pass with its checks and peer review, then repeat the requested browser check.
7. **Optional `/jor-review` for large changes, when requested.** Run it after any requested browser review and fixes. It needs a fixed point (branch, tag, or commit), reviews committed and in-scope uncommitted work along Standards and Spec axes, and changes no files. Accepted fixes return to authorized implementation and affected checks; full review remains user-invoked.
8. **`/jor-pr`** writes the PR body: the smallest useful visual, actual before/after evidence, and merge danger. It does not commit, push, open, or merge a PR.
9. **Use `/jor-retro` or `/jor-handoff` when needed.** `/jor-retro` proposes prevention for evidenced mistakes: code structure, automated checks, guidance, then human review. It makes no edits. Accepted code or check changes go to `/jor-implement`; accepted guidance changes go to `/jor-writing-for-agents`. `/jor-handoff` writes to the OS temporary directory when work moves to a fresh session, a new directory, or a colleague.

## One-time setup per project

- **`/jor-verify`** is setup for browser work. It writes a manual-only project skill to `.agents/skills/verify-<project>/` on Chrome DevTools MCP, with `doctor`, `breakpoints` (360, 768, 1280, 1440, 1920), `snapshot`, a feature map, and scripts for existing nonbrowser checks when available. The user chooses private or shared; if the project already uses `.cursor/skills/`, it asks which folder to use. `jor-browser-review`, `jor-bugfix`, `jor-prototype`, and `jor-verify-maintain` read the selected project's `.agents/skills/verify-<project>/SKILL.md` first, then `.cursor/skills/verify-<project>/SKILL.md`. Recommend `/jor-verify` before relying on that browser harness.

## Outside the main flow

- **`/jor-dr-stack`**: audit consistency across jor-stack skills, README, router, Mermaid, metadata, references, provenance, and packaging after stack changes. Reports by default; applies consistency fixes when requested. Can be selected for audit requests or called explicitly; not a required task-to-PR step.
- **`/jor-writing-for-agents`**: automatically applies when creating, editing, reviewing, or consolidating skills and agent instruction files such as `AGENTS.md` and `CLAUDE.md`. Use it to apply accepted guidance changes from `/jor-retro`.
- **`/jor-tdd`**: test-first development at existing public or user-agreed seams, one failing test then the smallest implementation that passes. `jor-implement` reads it for test-first work.
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
