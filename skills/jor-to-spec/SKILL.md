---
name: jor-to-spec
description: "Turn the current conversation into a private spec under .scratch/, excluded locally from Git. Synthesize agreed requirements and confirm only unresolved test seams."
disable-model-invocation: true
metadata:
  based-on: "mattpocock/skills skills/engineering/to-spec @ 5c89081d4bbeb3d039a42093653f90bb698d780e"
---

In Codex, use `$jor-...` for these commands, or `$jor-stack:jor-...` when the skill picker shows the plugin namespace.

This skill takes the current conversation context and codebase understanding and produces a spec. Synthesize agreed requirements; do not restart the requirements interview. Confirm only unresolved testing seams in step 2. Record other open decisions under Further Notes instead of inventing answers.

The spec is a private working file: it lives at `.scratch/<feature-slug>/spec.md` in the project and is never committed. No issue tracker is involved.

## Process

1. Explore the repo to understand the current state of the codebase, if you haven't already. Use the project's domain glossary vocabulary throughout the spec, and respect any ADRs in the area you're touching.

2. Sketch out the seams at which you're going to test the feature. Existing seams should be preferred to new ones. Use the highest seam possible. If new seams are needed, propose them at the highest point you can. The fewer seams across the codebase, the better - the ideal number is one.

Check with the user that these seams match their expectations unless the same seams are already agreed in the conversation.

3. Keep `.scratch/` out of git before writing anything. Check `.git/info/exclude` (git's local-only ignore file) for a `.scratch/` line and append one if it is missing. Never touch the shared `.gitignore`. If `.git/info/exclude` can't be found (for example in a worktree, resolve it with `git rev-parse --git-path info/exclude`), stop and tell the user rather than writing an unignored file.

4. Pick a short kebab-case `<feature-slug>` for the feature (reuse an existing `.scratch/<feature-slug>/` if one matches). Write the spec using the template below to `.scratch/<feature-slug>/spec.md`, creating the directory if needed. Tell the user the path. Do not commit it.

<spec-template>

## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## User Stories

A numbered list of distinct user stories for the agreed scope. Each user story should be in the format of:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</user-story-example>

Cover the agreed user-visible behavior, relevant roles, and edge cases. Omit duplicates and speculative scope; the feature determines the list's length.

## Implementation Decisions

A list of implementation decisions that were made. This can include:

- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include specific file paths or code snippets. They may end up being outdated very quickly.

Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it within the relevant decision and note briefly that it came from a prototype. Trim to the decision-rich parts, not a working demo, just the important bits.

## Testing Decisions

A list of testing decisions that were made. Include:

- A description of what makes a good test (only test external behavior, not implementation details)
- Which modules will be tested
- Prior art for the tests (i.e. similar types of tests in the codebase)

## Out of Scope

A description of the things that are out of scope for this spec.

## Further Notes

Any further notes about the feature.

</spec-template>
