# Changelog

## 0.1.1 (2026-10-27)

- Slash-only skills no longer invoke each other. Mid-task, a skill reads the other skill's `SKILL.md` and follows it. The user's next step is a `/jor-...` command the agent recommends.
- `jor-verify` writes the generated skill to `.agents/skills/verify-<project>/`, and asks first if the project already uses `.cursor/skills/`. `jor-browser-review`, `jor-debug`, and `jor-prototype` read that path. `jor-verify-maintain` looks in `.agents/skills/verify-*/` and falls back to `.cursor/skills/verify-*/`.
- Removed the headless browser script option (Playwright / Puppeteer) from `jor-debug`, and dropped the Playwright and Cypress note from `jor-verify`'s line about reading existing e2e tests. Browser checks stay on Chrome DevTools MCP.
- Added an MIT `LICENSE` and `THIRD_PARTY_NOTICES.md`.
- `plugin.json` and `marketplace.json` are 0.1.1. `plugin.json` records the MIT license and the repository URL.
- README: prerequisites, the GitHub repository URL, the self-contained rule, a collapsed copy of the flow SVG, the verify path, and links to this changelog and the license.
- Wording fixes: ticket comments and confirm-before-implementing in `jor-get-ready`; the worktree sentences in `jor-browser-review`; when-to-use descriptions for `jor-grill-me`, `jor-retro`, and `jor-restate`; a subagent fallback in `jor-review`; `GLOSSARY.md`, if it exists, and the humanlayer/skills show-me URL in `jor-pr`; glossary wording in `jor-design`; uncommitted prototype screenshots in `.scratch/prototype-<name>/`; `argument-hint` removed from `jor-handoff`.

## 0.1.0 (2026-10-26)

Initial release. 19 slash-only skills for Cursor, Chrome DevTools MCP for the browser skills, and private working files under `.scratch/`.
