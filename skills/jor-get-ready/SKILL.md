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
3. For a bug, attempt reproduction with the smallest relevant existing check. For a feature, inspect the current behavior and confirm the gap. Report what was observed, what is inferred, and what could not be reproduced. Use browser verification only when the user asks for it in the current thread, and then recommend they run `/jor-browser-review`. Leave development servers under user control.
4. If decisions or requirements remain unclear, read `../jor-grill-me/SKILL.md` and follow it. Find code facts yourself; ask the user for decisions. Continue independent investigation while answers are pending. Keep unresolved decisions explicit in any provisional proposal.
5. Return a concise proposal with:
   - Findings and evidence, including reproduction limits.
   - The smallest complete fix or feature, affected files, and patterns to reuse.
   - Relevant risks and the checks needed after implementation.
   - Unresolved questions, if any.

Stop after the proposal and ask the user to confirm before implementing. Keep findings in the conversation unless the user requests a saved artifact.
