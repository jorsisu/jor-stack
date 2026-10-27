---
name: jor-browser-review
description: Review the finished change in the current coding task with Chrome DevTools MCP, preferably through one independent subagent. Use when the user asks for browser review of current work.
disable-model-invocation: true
metadata:
  based-on: "original by Jorge (browser-review)"
---

# Browser review

Use the active task's scope, acceptance criteria, changed files, and supplied URL or route. Follow the current project's instructions. If the target or a runnable URL cannot be determined, ask only for the missing detail.
Do not start or restart a user-controlled server. If you are in a worktree, start the required servers within the worktree.

Delegate one bounded, read-only review when the harness supports subagents. Prefer a strong available model at high reasoning when available; otherwise use an available capable model and supported effort. Give the reviewer the needed task context. If subagents are unavailable, perform the review in the current agent and say that it was not independent.

Use **Chrome DevTools MCP** to check the relevant viewport sizes, variants, and interactions; inspect layout, overflow, console errors, and failed requests where applicable. Viewport sizes: read `.agents/skills/verify-<project>/SKILL.md` and follow it. If that file is missing, read `.cursor/skills/verify-<project>/SKILL.md` and follow that instead. Use its `doctor` first, its `breakpoints` (360, 768, 1280, 1440, 1920 px wide) for screenshots, and its feature map for the routes, entry points, and end states of the features the change touches. If neither file exists, tell the user to run `/jor-verify`, and check the same five widths: 360, 768, 1280, 1440, 1920. If Chrome DevTools MCP is unavailable, report the blocker instead of substituting another browser tool. Do not edit code, commit, or start another implementation task.

Require the subagent to include a **Human verification** section in its own result with the exact navigable URL for each reviewed page or variant, plus the viewport and interaction to check. Include it even when there are no findings. Wait for any delegated result. Pass those URLs through to the user with concise, prioritized findings, reproduction steps, expected and actual behavior, and evidence. State what was checked and what could not be checked. If there are no findings, say so without claiming untested cases passed. Leave fixes to the coordinator's next step.
