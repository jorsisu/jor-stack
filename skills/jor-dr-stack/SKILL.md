---
name: jor-dr-stack
description: Audit jor-stack consistency after skill or workflow changes. Use when asked to check the stack's skills, README, Mermaid flow, routing, metadata, and packaging together; not for application code review.
metadata:
  based-on: "original by Jorge (stack consistency audit)"
---

In Codex, use `$jor-...` for these commands, or `$jor-stack:jor-...` when the skill picker shows the plugin namespace.

# Stack doctor

Audit the current jor-stack checkout as a whole, including uncommitted and new files. Report findings by default. When the user requests fixes, apply only consistency corrections supported by the agreed workflow; use [jor-writing-for-agents](../jor-writing-for-agents/SKILL.md) for instruction edits. This is stack maintenance, not another required gate in the task-to-PR flow.

## Pass

1. **Locate the source.** Use the user's jor-stack checkout, or resolve this skill's source path to it. Confirm the root with its plugin manifest and `skills/` directory. An installed plugin cache is not the editable source; ask for the checkout if it cannot be located. Read applicable repository instructions.
2. **Capture intent and state.** Read `git status --short`, staged and unstaged diffs, and in-scope untracked files. Use any supplied base for committed changes; no base is required to audit the current files. Take intended behavior from the user's request and accepted decisions, then the owning skills. Do not treat a newer summary as authority over a skill. If intent conflicts or is missing, report the decision needed instead of inventing a workflow.
3. **Inventory the stack.** Read every `skills/*/SKILL.md`, its `agents/openai.yaml`, and the root docs and manifests, including hidden packaging directories. Follow supporting references and inspect scripts, templates, and exports that define or repeat workflow behavior. Search all repository text for changed skill names, old names, and affected rules; use diffs to focus, not to exclude unchanged consumers. Exclude Git internals, dependencies, caches, and private evidence from the content audit.
4. **Cross-check these surfaces:**

   | Surface | Check |
   | --- | --- |
   | Workflow | Skill handoffs, README prose, `jor-mode`, and Mermaid edges agree on order, branches, optional steps, fix/recheck loops, stop conditions, and authorization. Trace paths with and without optional reviews, plus failed checks and unresolved findings. |
   | Diagrams | The README Mermaid block matches `docs/flow.mmd` and follows the layout rules below. Check any maintained exports and their source relationship. Supporting skills need not appear in the main-flow diagram. |
   | Catalog and discovery | Every skill is represented in the README and router; counts come from actual folders. Folder name, frontmatter, Codex metadata, invocation policy, and documented triggers agree. Check for overlapping jobs or contradictory instructions, not merely wording differences. |
   | References and provenance | Local links and resource paths resolve; renamed skills have no active stale callers. Check `UPSTREAM.md`, `metadata.based-on`, applicable license notices, and Unreleased notes. Preserve accurate release history and intentional examples of removed names. |
   | Packaging | Cursor and Codex manifests, marketplaces, skill roots, MCP configuration, and install instructions describe the same package. Discover actual config rather than assuming each skill needs a manifest entry. Distinguish the working tree from what a committed export includes; check private files stay excluded. |

5. **Verify within scope.** Use existing validators and small read-only checks for metadata, JSON/YAML, links, counts, and diagram parity. Inspect commands before execution. Run script tests only when changed behavior calls for them. Check representative requests against new triggers and completion rules; distinguish a source walkthrough from an actual invocation. Report unavailable checks and validator/schema mismatches explicitly. Do not install, fetch upstream, bump versions, regenerate exports, or run browsers just to complete an audit. Browser checks, server control, commits, and publishing retain their separate authorization boundaries.
6. **Finish or repair.** Report each concrete mismatch with file/line references to both sides, its effect, and the smallest correction. If fixes were requested, preserve unrelated work, update all affected consumers, and rerun the affected checks once. Report unresolved intent rather than changing policy to make files agree.

## Workflow diagram layout

Keep the workflow readable from top to bottom. Use `flowchart TB`, with the requirement or ticket at the top, successive phases below it, and final reviews and delivery at the bottom in their actual process order. Keep one clear main path; place optional branches beside their phase and rejoin near the next step. Keep fix/recheck loops local where possible; use clearly labeled return points when long backward edges would cross several phases. Preserve every decision and return destination when simplifying the layout.

Flag tangled paths, unnecessary crossings, or an end placed above earlier phases. `TB` alone does not prove an orderly layout. Inspect an available rendered preview when authorized; otherwise report visual layout as unverified. Keep the README and Mermaid source synchronized after corrections.

## Result

Return a short status: **consistent**, **findings**, or **incomplete**. Include coverage, findings or applied fixes, executed checks, and remaining limits. Use **consistent** only when every surface above was checked and no mismatch remains; missing required coverage is **incomplete**. Do not claim installation, rendering, live invocation, or CI passed from source inspection alone.
