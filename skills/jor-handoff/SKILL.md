---
name: jor-handoff
description: Compact the current conversation into a handoff document for another agent to pick up.
disable-model-invocation: true
metadata:
  based-on: "mattpocock/skills skills/productivity/handoff @ 0f5e033ebc47b142f5ffa56a582ede6d9d9bada3"
---

In Codex, use `$jor-...` for these commands, or `$jor-stack:jor-...` when the skill picker shows the plugin namespace.

Write a handoff document summarising the current conversation so a fresh agent can continue the work. Save to the temporary directory of the user's OS (`$TMPDIR`, else `/tmp`; `%TEMP%` on Windows) - not the current workspace.

Include a "suggested skills" section in the document, naming which `/jor-...` skills the user should run next session (for example `/jor-get-ready` for the next ticket). The next agent does not run them.

Do not duplicate content already captured in other artifacts (specs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.
