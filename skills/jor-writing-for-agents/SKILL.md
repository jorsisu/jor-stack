---
name: jor-writing-for-agents
description: Create, edit, review, or consolidate agent skills and instruction files such as AGENTS.md and CLAUDE.md. Use when the requested output is reusable guidance for an agent.
metadata:
  based-on: "original by Jorge (writing-for-agents)"
---

In Codex, use `$jor-...` for these commands, or `$jor-stack:jor-...` when the skill picker shows the plugin namespace.

# Writing for agents

Write instructions that make the intended work repeatable. Keep the rules that change decisions; remove repetition and general advice.

## Workflow

1. **Establish scope.** Read the existing files, linked resources, and applicable instructions. Identify the intended task, target agent, location, and success condition from the request. Ask only for missing information that changes the result.
2. **Choose the structure.** For a skill, read [SKILL-MECHANICS.md](SKILL-MECHANICS.md). For an instruction file, keep the existing scope and conventions. Put shared rules in the main file and conditional detail behind links.
3. **Write or revise.** Use the principles below. Preserve the user's choices and authorization boundaries. Make the requested edit directly unless the user requested a proposal or review only.
4. **Verify.** Check that required behavior remains, references resolve, and any changed metadata matches the target agent. Run an available skill validator and any new or changed scripts. For a material workflow change, use representative requests to check intended triggers, likely false triggers, and completion conditions; report whether this was a review or an actual execution test.
5. **Finish.** State what changed, what was checked, and any remaining limit. Stop when the requested result and relevant checks are complete.

## Structure and references

- Put the actions and rules needed on every run in the main file. Separate ordered actions from facts consulted as needed.
- Move substantial detail used only in some cases to a supporting file. Split by purpose, not a fixed line count.
- Give each link a clear use condition, such as “For a skill, read the packaging reference.” A path alone does not explain when to load it.
- Keep each concept's definition, rules, and exceptions together. Give each rule one authoritative home.
- Keep essential constraints visible. If an important reference is missed, clarify its use condition before copying its contents into the main file.
- Add scripts when repeated or fragile operations need deterministic execution. Add assets only when the output needs them.

## Actions and completion

- State the input, intended action, and observable result where order matters. Use flexible guidance when several approaches are valid.
- Make completion criteria cover the required work: “Every changed public API has a migration note” is checkable; “Review migration needs” is not.
- Keep thoroughness within the requested scope. A skill does not authorize unrelated changes or external actions.
- If execution stops early, sharpen the completion criterion first. Split a workflow only when observed failures justify the added coordination. Moving text to another file does not clear instructions already loaded into context.

## Language and pruning

- Use familiar terms consistently. A short term can replace repeated wording when its meaning is clear; retain concrete actions and criteria.
- Prefer the desired action to a list of prohibitions. Keep explicit prohibitions when they protect a real boundary, and give the allowed next step.
- Remove each sentence that does not change a decision, prevent a known error, or convey information the agent cannot readily find.
- Read current config, scripts, and command help instead of copying facts that are cheap to retrieve. Record the reason for a choice, an unwritten convention, or a hidden constraint.
- Replace stale or repeated rules instead of adding more rules around them. Resolve contradictions rather than preserving both versions.
- Keep descriptions and always-loaded instructions especially short: they consume attention before the detailed workflow is needed.

## Consolidation

Compare both the instructions and their supporting files. Keep unique, useful behavior; reconcile conflicting guidance against the target environment. Check references and invocation settings before retiring an old entrypoint. Preserve originals outside active skill discovery, and update only the affected installation records when needed. Report the retained entrypoint.
