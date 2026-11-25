# Changelog

## Unreleased

- `jor-get-ready` makes step 4 an explicit gate before step 5: when product, behavior, or scope decisions cannot be settled from code and design, stop to follow `jor-grill-me` and interview the user until settled instead of bundling unresolved decisions into the proposal. Skips the interview (and lists unresolved decisions in step 5) only when the user explicitly asks for a single-turn provisional proposal without questions.

- Added `jor-reframe`, adapted from pstack `reframe`: teaches the expert words for what you're building, borrows terms from neighboring fields, and rewrites your description with them. Asks for 5 to 8 terms, marks sources unverified when the session can't open links, and stops before `/jor-grill-me` or `/jor-to-spec`.

- Added branded jor-stack logo assets, then kept only `assets/jor-stack-logo.svg` (now the Cursor manifest `logo`) and `assets/jor-stack-with-text.png`. Removed the unused drafts and duplicates (about 56 MB that every export shipped) and the tracked `.DS_Store` files; added a `.gitignore` for `.DS_Store`.

- `jor-pr` summaries use concise bullets by default, with an optional visual and no diff sketches.

- Added the T3 Code, Claude Code, and Antigravity install guide. Antigravity setup now links each `jor-*` skill individually instead of symlinking all of `~/.agents/skills`, and notes that an existing directory symlink exposes every skill there.

- Skills that write `.scratch/` or private verify skills resolve Git's local exclude file with `git rev-parse --git-path info/exclude` instead of assuming `.git/info/exclude`, so they work in worktrees.

- Removed references to a private tracker skill; ticket sources are described as pasted or loaded through a tracker integration.

- Every skill carries the Codex invocation note and a Codex `interface` display name and short description. `jor-tdd` reports refactoring candidates in its closeout instead of routing them to the optional full review; `jor-get-ready` leaves browser checks to `/jor-browser-review`.

- `jor-grill-me` states the one-question-per-message rule as its own section: count the `❓` markers before sending, keep the design tree private, and never list, count, or tease the decisions queued behind the current one. Adds the Codex invocation note the other skills carry.

- The stack validator and its tests read files as UTF-8 instead of trusting the ambient locale, so they no longer fail with `invalid byte sequence in US-ASCII` in shells without `LANG` or `LC_ALL`.

- Reviewed the four pstack-sourced skills against upstream `main` (2026-11-21). `jor-domain` adopts upstream's shortened text while keeping the no-structure-fits fallback, the module-ownership prescription, and temporal decomposition as a skip-signal; `jor-teach` keeps its body because upstream only removed a sentence this trim had already dropped; `jor-verify` and `jor-verify-maintain` were already current.

## 0.2.0 (2026-10-29)

- Prepared public plugin metadata, setup instructions, contribution guidance, private security reporting, and a Cursor Marketplace publication checklist.
- Added CI for stack validation and existing runner tests; validation covers license notices, public metadata, and MCP privacy flags.
- Disabled Chrome DevTools MCP usage statistics and CrUX requests in the bundled configuration; documented its browser access and external runtime dependency.

- Specs cover agreed behaviors without a fixed story-list size; bug diagnosis ranks evidence-supported hypotheses without a numeric quota.

- Added a Ruby standard-library stack validator and temporary failure fixtures; `jor-dr-stack` runs it for source consistency checks.

- `jor-bugfix` confirms regression tests are selected by normal checks, hooks, or CI, and separates local results from configured CI.

- Direct browser checks in review, prototypes, and bug diagnosis share isolation, readiness, test-data cleanup, and evidence-retention rules, even without a generated verification skill.

- `jor-design` retains useful unit tests until passing interface tests replace their coverage or the tested behavior no longer applies.

- `jor-prototype` gates the whole UI prototype in development, preserves existing pages by default, and excludes throwaway routes from production.

- `jor-peer-review` falls back to a labeled self-review when subagents are unavailable, retaining the same scope, fixes, and one-recheck limit.
- `jor-handoff` returns an attachment or full Markdown in chat and includes required local-only context for another environment instead of relying on temporary paths.

- Added `jor-dr-stack` for stack consistency audits across skills, workflow docs, Mermaid, routing, metadata, links, provenance, and packaging. Reports by default; applies consistency fixes when requested. Available explicitly or through automatic selection for audit requests.
- Added automatic `jor-peer-review` after implementation and bugfix checks: one independent reviewer, valid fixes within scope, affected checks, and at most one focused recheck. Browser review stays manual; full `jor-review` is optional for large changes after any requested browser review and fixes.
- `jor-verify` bundles a dependency-free Node.js check runner with project-specific command plans, short results, private full logs, failure/blocked exit codes, plan-bound repository selection, and worker cleanup after every check. Generation and upkeep reject source-writing commands. Implementation reuses the scripts; browser checks and CI enforcement remain separate.
- Aligned the README, router, and skill handoffs: explicit implementation boundaries, optional browser review, PR-body-only delivery, direct-request review coverage, private output locations, manual-only generated verify skills, and safe repeated shared-link setup. Synced the Mermaid source and removed the unused stale SVG export.
- Removed angle-bracket placeholders from four skill descriptions for Codex validator compatibility.

- Renamed the bug diagnosis skill to `jor-bugfix` across commands, metadata, docs, and flow diagrams.
- Added `jor-implement` and `jor-writing-for-agents`, replacing the standalone skills. `jor-retro` recommends the writing skill for accepted guidance changes.
- Added a portable plugin manifest and Codex repo marketplace sharing Cursor's skills and MCP server configuration.
- Added local Codex installation through shared skill links and Codex command syntax guidance. `jor-writing-for-agents`, `jor-peer-review`, and `jor-dr-stack` allow automatic selection in Cursor and Codex; the other 20 skills remain manual-only.
- `jor-review` includes staged, unstaged, and in-scope untracked files alongside committed changes, and reviews the current result where diffs overlap.
- `jor-verify` restores and confirms the target UI state at every breakpoint before capturing screenshots. The Notes example follows the same steps.
- `jor-bugfix` accepts a repeatable Chrome DevTools MCP sequence with an explicit pass/fail check as a feedback loop.
- `jor-prototype`, including `UI.md` and `LOGIC.md`, stops at the design decision unless implementation is already explicitly authorized. Prototype commits also require authorization.
- `jor-browser-review` and generated verify skills start, stop, or restart dev servers only on explicit request, including in worktrees.
- `jor-verify` creates its feature map inside the skill folder selected in step 2: `.agents/skills/verify-<project>/` by default, or the chosen `.cursor/skills/` location.
- Removed the personal GitHub identity rule from tracked plugin files; retained the local rule and local `AGENTS.md` through Git's local exclude list. Local installation now uses a committed export into a fresh folder.

## 0.1.1 (2026-10-27)

- Slash-only skills no longer invoke each other. Mid-task, a skill reads the other skill's `SKILL.md` and follows it. The user's next step is a `/jor-...` command the agent recommends.
- `jor-verify` writes the generated skill to `.agents/skills/verify-<project>/`, and asks first if the project already uses `.cursor/skills/`. `jor-browser-review`, `jor-bugfix`, `jor-prototype`, and `jor-verify-maintain` look there first and fall back to `.cursor/skills/verify-<project>/`.
- `jor-get-ready` recommends `/jor-browser-review` only when the user asks for a browser check. `jor-pr` reuses screenshots from a browser review or from `.scratch/verify/`. `jor-review` states the subagent fallback once, in the spawn step. `jor-retro` names the `jor-review` skill without a slash command.
- Removed the headless browser script option (Playwright / Puppeteer) from `jor-bugfix`, and dropped the Playwright and Cypress note from `jor-verify`'s line about reading existing e2e tests. Browser checks stay on Chrome DevTools MCP.
- Added an MIT `LICENSE` and `THIRD_PARTY_NOTICES.md`.
- `plugin.json` and `marketplace.json` are 0.1.1. `plugin.json` records the MIT license and the repository URL.
- README: prerequisites, the GitHub repository URL, the self-contained rule, a collapsed copy of the flow SVG, the verify path, and links to this changelog and the license.
- Wording fixes: ticket comments and confirm-before-implementing in `jor-get-ready`; the worktree sentences in `jor-browser-review`; when-to-use descriptions for `jor-grill-me`, `jor-retro`, and `jor-restate`; a subagent fallback in `jor-review`; `GLOSSARY.md`, if it exists, and the humanlayer/skills show-me URL in `jor-pr`; glossary wording in `jor-design`; uncommitted prototype screenshots in `.scratch/prototype-<name>/`; `argument-hint` removed from `jor-handoff`.

## 0.1.0 (2026-10-26)

Initial release. 19 slash-only skills for Cursor, Chrome DevTools MCP for the browser skills, and private working files under `.scratch/`.
