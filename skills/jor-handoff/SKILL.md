---
name: jor-handoff
description: Compact the current conversation into a handoff document for another agent to pick up.
disable-model-invocation: true
metadata:
  based-on: "mattpocock/skills skills/productivity/handoff @ 0f5e033ebc47b142f5ffa56a582ede6d9d9bada3"
---

In Codex, use `$jor-...` for these commands, or `$jor-stack:jor-...` when the skill picker shows the plugin namespace.

Write a handoff document summarising the current conversation so a fresh agent can continue the work. Save a local copy to the current environment's temporary directory (`$TMPDIR`, else `/tmp`; `%TEMP%` on Windows), not the current workspace. Return it as a downloadable attachment or artifact in the conversation; if the host cannot do that, return the full Markdown in chat. A temporary file path alone is not a delivered handoff.

Include a "suggested skills" section in the document, naming which `/jor-...` skills the user should run next session (for example `/jor-get-ready` for the next ticket). The next agent does not run them.

Identify the repository, branch, and commit when applicable. Reference existing artifacts by path or URL only when the destination can access them. For a different or unknown environment, include the essential context from local-only specs, tickets, decisions, and evidence; include required uncommitted diffs or files in the handoff or its attachments. Do not assume Git-ignored files or temporary paths move with a checkout. Keep accessible source material as references rather than copying it.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information.

Before finishing, check the returned handoff and attachments contain the context needed to resume. List any missing files or unverified access. Do not publish or upload to an external service without authorization.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.
