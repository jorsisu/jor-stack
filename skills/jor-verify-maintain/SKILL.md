---
name: jor-verify-maintain
description: "Upkeep pass that keeps a project's verify-<project> skill and feature map honest: source readers per feature, one live Chrome DevTools MCP pass driving every feature, breakpoint screenshots as evidence. Run on demand or after UI-heavy sprints."
disable-model-invocation: true
metadata:
  based-on: "cursor/plugins pstack/skills/maintain-verification-skill @ 6714489fa233263f00e419f6cfc4759b07c81056 (trimmed to the Chrome DevTools MCP setup)"
---

In Codex, use `$jor-...` for these commands, or `$jor-stack:jor-...` when the skill picker shows the plugin namespace.

# Maintain a verify skill

A feature map rots the moment the app changes. This skill is the upkeep loop for a `verify-<project>` skill the user generated with `/jor-verify`. The unit of rigor is the feature, not every sentence: cover every feature file from source and exercise every feature live, without terminalising every bullet. Run it on demand, or after a UI-heavy sprint.

## Outcomes

Pick one, and say which:

- **clean**: every feature got source and live coverage; nothing worth changing.
- **changed**: proven doc, harness, or map corrections were made in the verify skill's folder. If that folder is tracked in git, offer them as one commit or PR; if it's private, leave the edits in place.
- **blocked**: coverage could not finish or a proven fix could not be made safely. Say exactly what blocked it.

## Edit scope

Only edit the verify skill's own folder (its SKILL.md, `features/`, and any helper scripts it owns). Never edit product code during a run: a behavior the map describes that the app no longer does is either doc drift (fix the map) or a product regression (report it, don't paper over it in docs).

## Pass

0. **Locate the target.** Look in `.agents/skills/verify-*/`. If none are there, fall back to `.cursor/skills/verify-*/`. Several candidates → ask which one; none → stop and tell the user to run `/jor-verify` instead of inventing a target. If Chrome DevTools MCP is unavailable, stop: `blocked`.

1. **Index hygiene.** Read `features/README.md` and list its sibling files. Fix missing, extra, duplicate, or dead entries.

2. **Source wave.** For each feature file, explain "how does this user-facing feature work?" from source, flag likely doc drift with citations (routes, accessible names, data attributes that changed), and write one concise live recipe. Use one read-only subagent per feature in parallel when the harness supports it; readers never drive the app and never edit files.

3. **Reconcile.** Every feature file has a summary. Merge overlapping recipes into as few app states as practical. Spot-check cited drift; don't re-prove clean claims. Sweep recent churn (`git log` since the last pass) for user-facing routes or screens missing from the map; require a concrete source path before calling one missing.

4. **Live pass.** Required even when source looks clean. Drive serially, in one isolated browser context, against the user's running dev server. Don't start or restart it; if it's down, report the start command and stop: `blocked`. Hold three invariants the whole pass:
   1. Never drive an instance you haven't health-checked since it last did something surprising: `doctor` before the first drive and again after any failed drive. Where `doctor` can't see the failure (a wedged UI state on a healthy server), reset to a known state (reload, fresh isolated context) rather than hoping.
   2. Evidence survives every cleanup, checked at its named location, not assumed.
   3. Nothing a drive opened outlives its usefulness: close the pages and contexts you opened, reset emulation, restore mutated data.

   Exercise every feature at least once, and run `breakpoints` (360, 768, 1280, 1440, 1920) on each feature's route: **the breakpoint screenshots are the evidence** for the pass. A `doctor` failure caused by skill drift is drift: fix it under edit scope and retry once before calling the pass `blocked`. A feature that can't be reached is `verified-unreachable` only with the concrete prerequisite (auth, role, feature flag, external state) and the route attempted; if the map omits that prerequisite, that's drift. Any harness fix from triage gets re-driven live before you finish.

5. **Triage.** Wrong or missing user-POV description → doc drift, fix it. Working behavior the recipe can't drive (stale accessible name, new dialog in the path) → harness gap, fix it. App behavior that's actually broken → product gap; record it for the user, keep it out of the verify skill.

6. **Report.** Re-read every changed file. State the outcome (clean / changed / blocked), the features covered, the breakpoint evidence location, unreachable prerequisites, confirmed drift, and product gaps found.

Keep concise run notes in `.scratch/verify/` (listed in `.git/info/exclude`); don't commit them.
