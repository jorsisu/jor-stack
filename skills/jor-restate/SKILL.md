---
name: jor-restate
description: Restate the user's goal and the problem they want solved before work starts. Use only when the user explicitly invokes /jor-restate or $jor-restate, or asks to use the jor-restate skill.
disable-model-invocation: true
metadata:
  based-on: "original by Jorge (restate)"
---

# Restate

Use the current conversation to restate, in your own words:

- My goal: the outcome I want.
- The problem: what blocks that outcome and why it matters.
- Key assumptions or gaps, only if they affect your understanding.

Keep it brief. Separate stated facts from assumptions. If context is missing, ask one focused question instead of inventing a goal.

End after the restatement. Wait for my next instruction before starting or resuming work; this invocation requests an understanding check only.
