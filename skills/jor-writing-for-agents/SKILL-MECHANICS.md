# Skill mechanics

Use this reference when creating or changing a skill's package, description, or invocation settings.

## Package

A skill needs a folder and a `SKILL.md` file with YAML frontmatter:

```yaml
---
name: skill-name
description: Describe the task and the requests that should activate it.
---
```

Use lowercase letters, digits, and hyphens for the name; keep it within 64 characters and match the folder name. Keep the description within 1024 characters. Preserve supported metadata when editing an existing skill.

Add only resources the workflow needs:

- `references/`: conditional procedures, schemas, or detailed examples, linked with a use condition.
- `scripts/`: executable helpers for repeatable operations.
- `assets/`: templates or resources used in the output.
- `agents/openai.yaml`: optional Codex interface, invocation policy, and tool dependencies.

A small skill can remain one file. Keep supporting references close to the entrypoint and check local links after moves or renames.

## Description and discovery

State the capability and the distinct situations that need it. Front-load the main task; descriptions can be shortened by the host. Use one trigger per distinct case, and add an exclusion only when it prevents a likely false match. Keep detailed procedures in the body.

Check a representative matching request and a nearby request that should not trigger the skill. For example, a skill about writing agent instructions should handle “Merge these overlapping skills”; it should not handle “Write a customer email.”

## Invocation

`jor-writing-for-agents` allows automatic selection for agent-guidance requests. `jor-peer-review` allows automatic selection after `jor-implement` or `jor-bugfix` checks pass, and can also be requested explicitly. `jor-dr-stack` allows automatic selection for stack consistency audit requests. For these three, omit `disable-model-invocation` from `SKILL.md` for Cursor and set `policy.allow_implicit_invocation: true` in `agents/openai.yaml` for Codex. Other jor-stack skills remain manual-only: `disable-model-invocation: true` for Cursor and `policy.allow_implicit_invocation: false` for Codex. Recommend manual skills for the user to invoke; read supporting skills as references. Implementation and bugfix must follow the linked peer-review instructions before closeout even without a separate invocation.

Preserve the existing invocation policy unless the user asks to change it. For a new Codex skill, automatic selection is enabled by default. Use explicit-only invocation when the user requests it.

For Codex, set this in `agents/openai.yaml` to disable automatic selection while retaining explicit invocation:

```yaml
interface:
  display_name: "Skill Name"
  short_description: "Brief description for the skill list"
policy:
  allow_implicit_invocation: false
```

Keep both `name` and `description` in `SKILL.md`. When updating interface fields, preserve unrelated policy and dependency fields. Treat invocation syntax and metadata as host-specific; verify the target agent's documented settings before adapting a skill for another product.

Reading a linked reference and invoking a skill are different operations. Keep shared guidance in a linked file when that is enough; create another skill only when it needs a distinct entrypoint.

Sources: [OpenAI skill documentation](https://developers.openai.com/codex/skills) and [Cursor skill documentation](https://cursor.com/docs/skills), checked 2026-10-27.
