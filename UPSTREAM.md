# Upstream sources

Every jor skill is a copy, not a link. This table records where each one came from and the exact upstream commit it was copied from, so upstream changes can be reviewed by hand against that point. Commits are the latest commit touching that path on `main` as reported by the GitHub API on 2026-10-26; the copied files were checked byte-for-byte against the raw files at those commits.

- Matt = [mattpocock/skills](https://github.com/mattpocock/skills)
- pstack = [cursor/plugins](https://github.com/cursor/plugins), `pstack/skills/`

| Skill | Source repo | File path | Upstream commit | What changed |
| --- | --- | --- | --- | --- |
| `jor-mode` | Matt (layout only) | `skills/engineering/ask-matt/SKILL.md` | `954ee7fd7f1911b79bfa82589b4d35ab6c4b13b8` | New router written for jor-stack; only the layout follows ask-matt. Lists every jor skill and the main flow; points to `/jor-restate` for understanding checks. |
| `jor-get-ready` | Original by Jorge | `get-ready/SKILL.md` | n/a (original) | Slash-only flag; step 4 runs `/jor-grill-me` instead of linking `../grilling/SKILL.md`; step 6 merged into the stop rule; browser verification points to `/jor-browser-review`. `agents/openai.yaml` not shipped in v0.1. |
| `jor-restate` | Original by Jorge | `restate/SKILL.md` | n/a (original) | Name and based-on line only (invocation names in the description updated to `/jor-restate` / `$jor-restate`). |
| `jor-grill-me` | Matt | `skills/productivity/grill-me/SKILL.md` + `skills/productivity/grilling/SKILL.md` | grill-me `fcf0071560d32913c9d4f820e0d7ca467c881619`; grilling `95249b0b49782349740fd9b8c6ce32b4e59e497a` | grill-me's "Call the Skill tool with grilling" replaced by grilling's full text; one line added: writes no files. |
| `jor-browser-review` | Original by Jorge | `browser-review/SKILL.md` | n/a (original) | Slash-only flag; model name replaced with "a strong available model at high reasoning"; viewport sizes made concrete (verify skill `doctor`/`breakpoints` 360, 768, 1280, 1440, 1920 and feature map); typo "withing" → "within". |
| `jor-to-spec` | Matt | `skills/engineering/to-spec/SKILL.md` | `5c89081d4bbeb3d039a42093653f90bb698d780e` | No tracker: writes `.scratch/<feature-slug>/spec.md`; ensures `.scratch/` is in `.git/info/exclude`, never touches `.gitignore`. Removed setup-matt-pocock-skills line and `ready-for-agent` label. |
| `jor-to-tickets` | Matt | `skills/engineering/to-tickets/SKILL.md` | `9e2abf8611a345efbf779aacb171cff015bcdeb6` | Local-files branch only (`.scratch/<feature-slug>/issues/<NN>-<slug>.md`, blockers first, local template); same `.git/info/exclude` rule. Removed tracker branch, issue template, setup line, `Status: ready-for-agent` triage label. |
| `jor-tdd` | Matt | `skills/engineering/tdd/` (`SKILL.md`, `tests.md`, `mocking.md`) | `3f599139104dfceabc7754eeb91319802f85e042` | Trimmed intro and the codebase-design paragraph; links point to `/jor-design` and `/jor-review`; added a "stop at green" rule pointing to the next jor steps. Helpers copied unchanged. |
| `jor-debug` | Matt | `skills/engineering/diagnosing-bugs/` (`SKILL.md`, `scripts/hitl-loop.template.sh`) | `f3fc5632f401156837ee3872f14fe33ccf1024ea` | Close to upstream. Renamed; browser feedback loop can use Chrome DevTools MCP / the verify skill. Script copied unchanged. |
| `jor-design` | Matt | `skills/engineering/codebase-design/` (`SKILL.md`, `DEEPENING.md`, `DESIGN-IT-TWICE.md`) | `d80fa0f4ebe0c5714af0adf8670336065233ecc6` | Close to upstream. Renamed, slash-only; body and helpers unchanged. |
| `jor-review` | Matt | `skills/engineering/code-review/SKILL.md` | `3da8c01116264675eeefbd6e9d59c734de9095cc` | Spec source is the `/twg-jira` ticket in the conversation or the `/jor-to-spec` file (no asking); removed tracker/setup line; slash-only. |
| `jor-pr` | Matt | `skills/engineering/pr/` (`SKILL.md`, `CREDITS.md`) | `e484a8095543718ced436b9b49a8160ed4554000` | Close to upstream. Slash-only (upstream is model-invoked); one line to reuse breakpoint screenshots as evidence; show-me credit kept. |
| `jor-prototype` | Matt | `skills/engineering/prototype/` (`SKILL.md`, `LOGIC.md`, `UI.md`) | `321658273cb1d20b76026717d027d505790106d4` | UI variants driven with the verify skill at 360/768/1280/1440/1920 and screenshotted side by side (new UI.md step 5); capture step is tracker-neutral. LOGIC.md unchanged. |
| `jor-retro` | Matt | `skills/engineering/retro/SKILL.md` | `a7d038f6bf7f01b516408e95e2fb56e0b338fa6f` | Close to upstream. Removed the `writing-for-agents` skill call and reference (outside jor-stack); reviewer agent points to `/jor-review`. |
| `jor-handoff` | Matt | `skills/productivity/handoff/SKILL.md` | `0f5e033ebc47b142f5ffa56a582ede6d9d9bada3` | Close to upstream. "Suggested skills" names `/jor-...` skills instead of "call the Skill tool". |
| `jor-domain` | pstack | `pstack/skills/principle-model-the-domain/SKILL.md` | `00b14f1df36b32a8dd1529324a3a459f6563b127` | Close to upstream. Renamed; description reworded to say what it does; body unchanged. |
| `jor-teach` | pstack | `pstack/skills/teach/SKILL.md` | `d7cde2b84eadbcd6fd890302c876f4436ccb6d82` | Heavy trim. No dependency on `how`, `why` or `unslop`: the skill does its own digging (code, git history, tickets); image-generation step dropped. |
| `jor-verify` | pstack | `pstack/skills/create-verification-skill/` (`SKILL.md`, `references/feature-map-example/`) | `c49b37a2c0e7bede60a71ad7322e3f12c337a3da` | Rebuilt on Chrome DevTools MCP instead of Playwright. Generates `verify-<project>` with `doctor`, `breakpoints` (360/768/1280/1440/1920), `snapshot`, feature map; never starts or restarts user dev servers; evidence in `.scratch/verify/`. Example map rewritten for Chrome DevTools MCP (README + create-note; search example dropped). |
| `jor-verify-maintain` | pstack | `pstack/skills/maintain-verification-skill/SKILL.md` | `6714489fa233263f00e419f6cfc4759b07c81056` | Trimmed to the Chrome DevTools setup; health check is `doctor`; breakpoint screenshots are the evidence; on demand or after UI-heavy sprints; edits only the verify skill's folder; outcomes clean / changed / blocked. |

## Other upstream files used

| File | Source | Commit | Use |
| --- | --- | --- | --- |
| `.cursor-plugin/marketplace.json` format | [cursor/plugin-template](https://github.com/cursor/plugin-template) | `600b993b42870a71238a0811519b06da98d1ec91` | Marketplace manifest shape (single plugin at repo root). |
| `plugins/*/.cursor-plugin/plugin.json` format | cursor/plugin-template | tree `46216072ac5750f782f95bb325b4d12b7c3ae9c9` (main) | Plugin manifest shape. |
| `scripts/validate-template.mjs` | cursor/plugin-template | `bf795ee9a28e6d8b2e013beb9ac47fdd6d573fb7` | Validator run against this folder (not shipped). |
| `mcp.json` config | [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) `README.md` | `46eb546ebb13964f884847af6ffb200623426cbe` | Exact `chrome-devtools` server config from "Getting started". |

## Updating from upstream

Upstream updates are a manual review. Diff the upstream path from the recorded commit to its current `main` (for example `https://github.com/mattpocock/skills/compare/<commit>...main`), merge by hand only what you want, then update the commit in this table. Never overwrite a jor skill with a fresh upstream copy.
