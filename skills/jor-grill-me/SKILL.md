---
name: jor-grill-me
description: Relentless interview that sharpens a plan or design one question at a time and writes no files. Use when the user starts from an idea instead of a ticket, or when a decision is still unclear.
disable-model-invocation: true
metadata:
  based-on: "mattpocock/skills skills/productivity/grill-me @ fcf0071560d32913c9d4f820e0d7ca467c881619 + skills/productivity/grilling @ 95249b0b49782349740fd9b8c6ce32b4e59e497a"
---

Interview the user relentlessly until you reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

Work the tree **one question at a time**. The **frontier** is every unresolved decision whose prerequisites are already settled. Choose the question that unblocks the most important next decisions. Ask only that question, give your recommended answer, then wait for the user's response.

Each question must cover one decision. Do not bundle subquestions, preview a list of upcoming questions, or send another question while the current one is unanswered. If using a question tool, send exactly one question per call and wait for the response before asking another.

Format each question like so, increasing its number only when moving to a new decision:

```
❓ **Q1** - **<question title>**: <one focused question, with choices if useful>

➡️ <your recommended answer>
```

Word each question so "yes" accepts your recommended answer.

If the user asks for an explanation, challenges the recommendation, or gives an unclear answer, stay on the current decision. Answer their follow-up and clarify only that decision if needed. Do not treat a follow-up or silence as acceptance. Once the user settles the decision, update the tree and choose the next question from the new frontier.

Finding _facts_ is your job, never the user's. When a frontier question needs a fact from the environment (filesystem, tools, etc.), dispatch a sub-agent to find it when available; otherwise inspect it yourself. Don't ask the user for anything you could look up yourself. A running exploration is an unsettled prerequisite. While it runs, you may ask one independent question only if no question is awaiting the user's answer. The _decisions_ are the user's: put each to them and wait.

This interview writes no files. Keep everything in the conversation.

When every relevant decision is settled and no fact gathering remains pending, summarize the agreed design and ask one final question to confirm shared understanding. Do not act on it until the user confirms.
