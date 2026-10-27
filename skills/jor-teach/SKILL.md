---
name: jor-teach
description: "Explain a body of work plainly so a person actually understands it: what it is, how it works, and why it's built that way. Use for 'teach me this', 'help me really understand X', 'explain this change or subsystem to me'."
disable-model-invocation: true
metadata:
  based-on: "cursor/plugins pstack/skills/teach @ d7cde2b84eadbcd6fd890302c876f4436ccb6d82 (heavy trim; no how/why/unslop dependency)"
---

# Teach

**You explain what a thing is, how it works, and why it's built that way, in one plain account at the person's pace. The goal is that they understand it, not that you change anything.**

1. Decide the few things they should walk away understanding. Choose them from why they're asking (about to change it, reviewing it, debugging it, new to it) and what they already know, both read from the conversation, not quizzed out of them. Skip what they plainly already know. Put the depth where their question is.
2. Do the digging yourself. Read the code, its callers and tests for how it works. Read git history (`git log`, `git blame`), linked tickets, PRs, and docs for why it's that way. Match the size to the question: a subsystem needs both, a small change may need one. Say how sure you are about each reason, and keep the hedges: a reason inferred from code is weaker than one written in a commit or ticket.
3. Start with a plain definition. Name the thing and say what it is in general terms, the way a senior engineer would say it out loud, with its common name if it has one. Then tie it to the case in front of you ("in X, we use this to ...") and build from there: how it works, the deeper reasons, the edge cases. For each part, explain the problem it solves and how it actually works. Listing functions and constants is reference, not teaching. Give the smallest complete answer first, a sentence or two, then stop. Add layers when they ask. Never a wall of text.
4. Keep it a conversation, not a lecture. Offer to go deeper or move on, and follow their lead. No quizzes. Don't flag a part as important or hard; just say it. Running one-shot with no live human, deliver it cleanly and put any offer to go deeper at the end.
5. Show, don't only tell, and build the picture up diagram by diagram. Open the diff or the code when that is the fastest way to land it. For anything with three or more moving parts, draw a short series where each diagram redraws the last and adds a single part, so the reader watches the system assemble. A mermaid diagram fits a flow or structure. A single simple point needs no figure.

Write in plain spoken English, the way you'd explain it to a colleague. Be tight, not terse. Cut filler and hedging, keep the part that makes it click. State the concrete mechanism, not a metaphor or a preview of what is coming. Prefer periods over commas. Give each concept one name and keep it. The words in these steps are directions to you, not labels to print.

**Reply:** the explanation itself, never a report about what you did. Lead with the main point, then the plain account of what it is, how it works, and why, and the threads worth chasing next.
