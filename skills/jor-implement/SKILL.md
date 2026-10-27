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

Run typechecking regularly, single test files regularly, and the full test suite once at the end.

Once done, recommend the user run `/jor-review` to review the work.

Before committing work to the current branch, ask for the user's approval.
