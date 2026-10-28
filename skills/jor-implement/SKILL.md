---
name: jor-implement
description: Implement clear features and known bug fixes from an authorized request, spec, tickets, or approved proposal, following project rules and patterns.
disable-model-invocation: true
metadata:
  based-on: "original by Jorge (implement)"
---

In Codex, use `$jor-...` for these commands, or `$jor-stack:jor-...` when the skill picker shows the plugin namespace.

# Implement

Implement the clear, authorized request, spec, tickets, or approved proposal, including bug fixes whose cause and intended change are established. When the request, relevant code, and intended change are already understood, a direct implementation request is enough; do not require a separate proposal, spec, or ticket. For an unknown bug cause, recommend `/jor-bugfix`; for other missing context or scope, recommend `/jor-get-ready` before editing. An investigation-only request does not authorize implementation.

Follow project rules and patterns.

For test-first work, read [../jor-tdd/SKILL.md](../jor-tdd/SKILL.md) and follow its seam-selection and red-green rules. Read supporting skills as workflow references.

Run the smallest relevant repo checks during implementation and after the final edit. Broaden coverage when project requirements, risk, or failures justify it.

If the project's `.agents/skills/verify-*/SKILL.md` (or `.cursor/skills/verify-*/SKILL.md`) documents scripted checks that cover this change, reuse that command and its saved logs. Keep uncovered behavior explicit; a passing check plan does not establish browser or CI results.

When adding or repairing an automated guard, show it fails on the original fault (or a safe temporary reproduction), then passes with the fix. Remove temporary faults before finishing and verify the guard runs through the repo's normal check command, hook, or CI configuration. Distinguish local execution from CI that has only been configured.

After implementation checks pass, automatically read and follow [../jor-peer-review/SKILL.md](../jor-peer-review/SKILL.md) before declaring the task done. This is part of implementation; do not wait for a separate user request.

Before declaring done, report the behavior checked, peer-review outcome, exact commands and observed results, evidence paths where applicable, and any blocked or unverified scope. Re-run affected checks after later edits; earlier results do not prove changed code.

Use browser verification only when requested in the current chat. Start, stop, or restart dev servers only on explicit request. After peer review, leave `/jor-browser-review` and `/jor-review` invocation to the user. Full `/jor-review` is optional for large changes, after any requested browser review and fixes.

Before committing work to the current branch, ask for the user's approval.
