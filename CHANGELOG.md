# Changelog

## Unreleased

- `jor-review` includes staged, unstaged, and in-scope untracked files alongside committed changes, and reviews the current result where diffs overlap.
- `jor-verify` restores and confirms the target UI state at every breakpoint before capturing screenshots. The Notes example follows the same steps.
- `jor-debug` accepts a repeatable Chrome DevTools MCP sequence with an explicit pass/fail check as a feedback loop.
- `jor-prototype`, including `UI.md` and `LOGIC.md`, stops at the design decision unless implementation is already explicitly authorized. Prototype commits also require authorization.
- `jor-browser-review` and generated verify skills start, stop, or restart dev servers only on explicit request, including in worktrees.
- `jor-verify` creates its feature map inside the skill folder selected in step 2: `.agents/skills/verify-<project>/` by default, or the chosen `.cursor/skills/` location.
- Removed the personal GitHub identity rule from tracked plugin files; retained the local rule and local `AGENTS.md` through Git's local exclude list. Local installation now uses a committed export into a fresh folder.

## 0.1.1 (2026-10-27)

- Slash-only skills no longer invoke each other. Mid-task, a skill reads the other skill's `SKILL.md` and follows it. The user's next step is a `/jor-...` command the agent recommends.
- `jor-verify` writes the generated skill to `.agents/skills/verify-<project>/`, and asks first if the project already uses `.cursor/skills/`. `jor-browser-review`, `jor-debug`, `jor-prototype`, and `jor-verify-maintain` look there first and fall back to `.cursor/skills/verify-<project>/`.
- `jor-get-ready` recommends `/jor-browser-review` only when the user asks for a browser check. `jor-pr` reuses screenshots from a browser review or from `.scratch/verify/`. `jor-review` states the subagent fallback once, in the spawn step. `jor-retro` names the `jor-review` skill without a slash command.
- Removed the headless browser script option (Playwright / Puppeteer) from `jor-debug`, and dropped the Playwright and Cypress note from `jor-verify`'s line about reading existing e2e tests. Browser checks stay on Chrome DevTools MCP.
- Added an MIT `LICENSE` and `THIRD_PARTY_NOTICES.md`.
- `plugin.json` and `marketplace.json` are 0.1.1. `plugin.json` records the MIT license and the repository URL.
- README: prerequisites, the GitHub repository URL, the self-contained rule, a collapsed copy of the flow SVG, the verify path, and links to this changelog and the license.
- Wording fixes: ticket comments and confirm-before-implementing in `jor-get-ready`; the worktree sentences in `jor-browser-review`; when-to-use descriptions for `jor-grill-me`, `jor-retro`, and `jor-restate`; a subagent fallback in `jor-review`; `GLOSSARY.md`, if it exists, and the humanlayer/skills show-me URL in `jor-pr`; glossary wording in `jor-design`; uncommitted prototype screenshots in `.scratch/prototype-<name>/`; `argument-hint` removed from `jor-handoff`.

## 0.1.0 (2026-10-26)

Initial release. 19 slash-only skills for Cursor, Chrome DevTools MCP for the browser skills, and private working files under `.scratch/`.
