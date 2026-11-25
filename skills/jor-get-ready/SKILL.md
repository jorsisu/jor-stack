---
name: jor-get-ready
description: Investigate the current ticket or request and propose a fix or feature before implementation. Invoke manually after loading the ticket into the conversation.
disable-model-invocation: true
metadata:
  based-on: "original by Jorge (get-ready)"
---

In Codex, use `$jor-...` for these commands, or `$jor-stack:jor-...` when the skill picker shows the plugin namespace.

# Get Ready

Review the context, reproduce the problem, and return a proposal. This invocation authorizes investigation only. Do not change project files or implement the proposal. Wait for an explicit implementation request.

1. Use the ticket and discussion already in the thread. Identify the expected result, reported behavior, acceptance criteria, and the ticket's comments. Retrieve missing context only when needed.
2. Read applicable project rules and inspect the relevant code, callers, tests, and existing patterns. Verify that the proposed approach fits the project.
3. For a bug, attempt reproduction with the smallest relevant existing check. For a feature, inspect the current behavior and confirm the gap. Report what was observed, what is inferred, and what could not be reproduced. Leave browser checks to `/jor-browser-review`; recommend it if the user asks for one. Leave development servers under user control.
4. Check for unresolved product, behavior, or scope decisions that code and design cannot settle (do not fill them in with assumptions). If any exist, **stop before step 5**, read `../jor-grill-me/SKILL.md`, and interview the user until those decisions are settled; continue independent fact-finding while answers are pending. Skip the interview only if the user explicitly asks for a single-turn provisional proposal without questions.
5. Once key decisions are settled (or when returning a requested provisional proposal), return a concise proposal with:
   - Findings and evidence, including reproduction limits.
   - The smallest complete fix or feature, affected files, and patterns to reuse.
   - Relevant risks and the checks needed after implementation.
   - Unresolved decisions, if any (only in a requested provisional proposal).

Stop after the proposal and ask the user to confirm before implementing. Keep findings in the conversation unless the user requests a saved artifact.
