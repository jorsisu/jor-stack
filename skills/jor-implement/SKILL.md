---
name: jor-implement
description: Implement work from a spec, tickets, or an approved proposal, following project rules and patterns.
disable-model-invocation: true
metadata:
  based-on: "original by Jorge (implement)"
---

In Codex, use `$jor-...` for these commands, or `$jor-stack:jor-...` when the skill picker shows the plugin namespace.

# Implement

Implement the work described by the user in the spec, tickets, or approved proposal.

Follow project rules and patterns.

For test-first work, read [../jor-tdd/SKILL.md](../jor-tdd/SKILL.md) and follow it at pre-agreed seams. Read supporting skills as workflow references; leave `/jor-...` invocation to the user.

Run the smallest relevant repo checks during implementation and after the final edit. Broaden coverage when project requirements, risk, or failures justify it.

If the project's `.agents/skills/verify-*/SKILL.md` (or `.cursor/skills/verify-*/SKILL.md`) documents scripted checks that cover this change, reuse that command and its saved logs. Keep uncovered behavior explicit; a passing check plan does not establish browser or CI results.

When adding or repairing an automated guard, show it fails on the original fault (or a safe temporary reproduction), then passes with the fix. Remove temporary faults before finishing and verify the guard runs through the repo's normal check command, hook, or CI configuration. Distinguish local execution from CI that has only been configured.

Before declaring done, report the behavior checked, exact commands and observed results, evidence paths where applicable, and any blocked or unverified scope. Re-run affected checks after later edits; earlier results do not prove changed code.

Use browser verification only when requested in the current chat. Start, stop, or restart dev servers only on explicit request. When browser review was requested, recommend `/jor-browser-review`; otherwise recommend `/jor-review`. Do not invoke either on the user's behalf.

Before committing work to the current branch, ask for the user's approval.
