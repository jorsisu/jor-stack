---
name: jor-retro
description: "Review a coding session and propose ways to prevent repeated agent mistakes through code structure, automated checks, and minimal guidance. Use when the user asks for a retro."
disable-model-invocation: true
metadata:
  based-on: "mattpocock/skills skills/engineering/retro @ a7d038f6bf7f01b516408e95e2fb56e0b338fa6f"
---

The user has asked for a **retrospective**. Propose improvements that prevent the mistakes supported by session evidence. This skill proposes changes; it does not authorize edits.

## Steps

1. Read the primary sources for the session the user specifies. This may mean searching through session logs on this machine. If the user doesn't specify a session, default to the current one.

2. Look for candidates for improvement in these categories. For each correction, follow the prevention order below.

- **Code structure**: could a stronger type, invariant, data structure, or clearer boundary remove the failure path? Prefer the smallest change at an existing boundary over a broad redesign. _Use when_ the code makes the wrong choice easy or repeats validation across callers.
- **Navigation**: how easy was it for the agent to find the right files? Are there hidden dependencies between files? Would a **navigation pointer** make it easier? _Use when_ the session took a long time to find a piece of information.
- **Automated checks**: are there automated checks that could catch errors the agent made? Linting, typing, tests, filesystem linters? Read the repo's own check command first (its `package.json`/build-tool `lint`/`check` scripts, its CI workflow), so a check that already exists but sits unwired or silently broken is the finding, not a reinvention. A repo with no **guardrail** (no pre-commit hook and no CI job running its lint/typecheck/test command) is itself a finding: an un-linted repo is a standing missed opportunity, not a neutral default. _Use when_ the agent made a mistake an automated check could have caught, or the repo has no guardrail at all.
- **Coding standards**: should the **reviewer agent** (`jor-peer-review`, or `jor-review` for a full review) be given a new rule to enforce? Should an existing rule be removed or clarified? Mechanical violations (a banned API, import shape, or file-location rule) belong in automated checks. Reserve `CODING_STANDARDS.md` for context-dependent judgement. _Use when_ the reviewer agent failed to catch a mistake.
- **Global AGENTS.md**: are there any steering instructions that should be moved to coding standards (or automated checks) instead? _Use when_ the AGENTS.md file is particularly large - in the repo OR the user's global scope.
- **Tool economy**: did the agent make expensive tool calls that could be streamlined? Is there any custom tooling (CLI's, MCP's) that is particularly token-inefficient? _Use when_ the agent made an expensive tool call.
- **No-ops**: look for instructions in steering files that don't modify the agent's behavior. _Use when_ the steering files are large and unwieldy.
- **Information access**: look for opportunities to increase the agent's access to information. Teeing dev server logs, readonly access to third-party services. _Use when_ a crucial piece of information was not available to the agent.

3. Present candidates in order of severity and recurrence. For each, cite the correction or failure, name the smallest prevention and affected boundary, and give the check that would prove it. If no supported improvement exists, say so.

For accepted code or check changes, recommend the user run `/jor-implement` with the proposal and proof plan. For accepted changes to skills or agent instruction files, recommend `/jor-writing-for-agents`. Keep the next manual invocation with the user.

## Prevention order

Choose the first practical layer that prevents the observed mistake:

1. **Code structure.** Remove the invalid state or failure path through types, data structures, or boundaries.
2. **Automated checks.** Reuse or extend an existing check before adding a new tool. Specify how it will catch the original fault and where it will run in the repo's normal check command, hook, or CI. Follow `jor-implement`'s verification requirements when implemented.
3. **Guidance.** Write a short rule only for decisions that need context and judgement. Replace overlapping rules instead of adding another reminder.
4. **Human review.** Keep product choices, tradeoffs, and remaining risks explicit. Say what the automated checks cannot establish.

Recommend only the layers needed for the correction. A proposed check is unverified until it has run; this retrospective alone does not establish that a guard exists or works.

## Reference

### Implementation vs Review

Remember that all work goes through two stages: implementation and review. The implementation agent has the most **context pressure**. They are responsible for exploration, writing code, and debugging failures.

The review agent reads the diff, relevant source, standards, and spec. It reports findings without editing code or executing the feature. Implementation must still follow project rules; review provides a separate check of that work.

### Files

You have access to several files in the repo:

- `CLAUDE.md`/`AGENTS.md`: these files are pushed to the context window of any agent working in this repo. They should be used incredibly sparingly, usually only for **navigation pointers** to other files.
- `CODING_STANDARDS.md`: this file is read during review, not implementation. Add **navigation pointers** to docs folders if the standards file gets more than 1,000 lines long.
- Docs: use docs as references files, pointed to by other files. Look for existing docs before writing new ones.
- Skills: use skills for docs (since their description goes into the agent's context window), or for user-invoked commands.
