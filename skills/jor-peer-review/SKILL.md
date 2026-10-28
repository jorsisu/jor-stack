---
name: jor-peer-review
description: Review current task changes with one independent agent after jor-implement or jor-bugfix checks pass, or when the user requests peer review. Fix valid findings within scope and make one focused recheck.
metadata:
  based-on: "original by Jorge (peer-review)"
---

In Codex, use `$jor-...` for these commands, or `$jor-stack:jor-...` when the skill picker shows the plugin namespace.

# Peer review

Run automatically before `jor-implement` or `jor-bugfix` declares the task done, or on explicit request. Skip investigation-only work and tasks with no changes.

1. Use the current task's agreed requirements, changed paths, relevant diffs, and check results. Include its committed and uncommitted changes; leave unrelated edits alone. Use existing task context without requesting a base commit.
2. Spawn one independent, read-only reviewer with those inputs. Have it inspect the changed files and directly affected callers against relevant project rules. Check new conditions and exclusions against the agreed scope; trace one concrete case they could wrongly exclude. Report concrete bugs, regressions, missed requirements, or scope creep with file/line, impact, and a brief reason. Keep effort proportional to the change; skip whole-repo standards searches, code-smell checklists, and refactoring advice. The reviewer must not edit files, run the feature, or start browser checks.
3. The main agent assesses each finding, fixes valid issues within the original authorization, and briefly explains dismissed findings. Report anything requiring wider scope. Make these fixes directly; do not restart `jor-implement` or `jor-bugfix` and trigger another review loop.
4. After fixes, rerun only affected checks and ask the same reviewer for one focused recheck of the fixes and their direct effects. Stop after that recheck and report anything unresolved. The limit is one initial review plus one recheck, not a fresh review after every edit.
5. Report reviewed scope, fixes, unresolved findings, and check results briefly. Reuse existing evidence; distinguish review from executed checks. Unresolved findings or unavailable subagents remain explicit limits, not a clean review.

If subagents are unavailable, report peer review as blocked. Keep browser, server, and Git actions within their existing authorization boundaries. Browser review and the optional full `jor-review` remain user-invoked.
