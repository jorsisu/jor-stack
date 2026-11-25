---
name: jor-reframe
description: "Teach the expert words for what the user is building, borrow words from neighboring fields that solved the same problem, then rewrite their description with them. Use when the user explicitly invokes /jor-reframe or $jor-reframe, or asks to use the jor-reframe skill."
disable-model-invocation: true
metadata:
  based-on: "cursor/plugins pstack/skills/reframe @ 9e278fe4d4ecd8bfe98b1b79bf4be662efb338cc"
---

In Codex, use `$jor-...` for these commands, or `$jor-stack:jor-...` when the skill picker shows the plugin namespace.

# Reframe

Teach the user the expert words for what they are building. Start from their own files, code and description, not a summary.

If their description could name more than one problem, first list the two or three problems it could be, each with the one term that names it and the sign that would tell it apart from the others. Then teach the words for the most likely one and say why you picked it.

1. Give the 5 to 8 terms that would most change what gets built, ranked by that. For each, give the word and its meaning in one plain sentence, the part of their description it names, one real project, paper or system that uses it that way, with a link, and what it lets them ask an agent for. Offer the next terms on request.
2. Pick 2 or 3 neighboring fields that solved the same shape of problem under other names. For each, say what carries over, where the analogy breaks, and which terms come back.
3. Name what they didn't mention but should care about.
4. Rewrite their description with the new words.

Open every link and confirm it uses the term that way. Cut any citation you can't confirm. Only if this session has no way to open links at all, keep the term, give the source by name only, and mark it unverified. Never write a link you haven't opened. No padding.

End after the rewrite and change no files. Recommend `/jor-grill-me` to settle the decisions the new words raise, or `/jor-to-spec` when the scope is already clear.
