---
name: jor-review
description: "Review committed and uncommitted changes since a fixed point (commit, branch, tag, or merge-base) along two axes: Standards (does the code follow this repo's documented coding standards?) and Spec (does the code match the ticket in the conversation or the /jor-to-spec file?). Runs both reviews in parallel sub-agents and reports them side by side."
disable-model-invocation: true
metadata:
  based-on: "mattpocock/skills skills/engineering/code-review @ 3da8c01116264675eeefbd6e9d59c734de9095cc"
---

In Codex, use `$jor-...` for these commands, or `$jor-stack:jor-...` when the skill picker shows the plugin namespace.

Two-axis review of committed changes since a fixed point the user supplies, plus staged, unstaged, and untracked work in scope:

- **Standards**: does the code conform to this repo's documented coding standards?
- **Spec**: does the code faithfully implement the originating issue / spec?

Both axes run as **parallel sub-agents** so they don't pollute each other's context, then this skill aggregates their findings.

## Process

### 1. Pin the fixed point

Whatever the user said is the fixed point (a commit SHA, branch name, tag, `main`, `HEAD~5`, etc.). If they didn't specify one, ask for it.

Resolve the fixed point to a commit with `git rev-parse --verify '<fixed-point>^{commit}'`. Stop if it does not resolve. Use the returned `<fixed-sha>` for the review.

Capture these review inputs, limited to the user's requested scope:

- Committed changes: `git diff <fixed-sha>...HEAD` (against the merge-base), plus `git log <fixed-sha>..HEAD --oneline`.
- Staged changes: `git diff --cached`.
- Unstaged changes: `git diff`.
- Untracked files: `git ls-files --others --exclude-standard`; read each in-scope file as new content.

Stop for an empty review only when all three diffs and the in-scope untracked list are empty. Reconcile overlapping hunks against current file contents; report the current result, not an intermediate version. Keep files and the index unchanged.

### 2. Identify the spec source

Take the spec from what this workflow already produced. Don't ask the user for it:

1. The ticket already loaded in the conversation (for example by `/twg-jira`), including its acceptance criteria and comments.
2. The `/jor-to-spec` file at `.scratch/<feature-slug>/spec.md`, plus the matching ticket file under `.scratch/<feature-slug>/issues/` when the work is one ticket of a larger spec.
3. A path the user passed as an argument.

If none of these exists, the **Spec** sub-agent skips and reports "no spec available".

### 3. Identify the standards sources

Search the repo for every file that documents how code should be written. When `CODING_STANDARDS.md` or `CONTRIBUTING.md` exists, it must be on the list.

On top of whatever the repo documents, the Standards axis always carries the **smell baseline** below: a fixed set of Fowler code smells (_Refactoring_, ch.3) that applies even when a repo documents nothing. Two rules bind it:

- **The repo overrides.** A documented repo standard always wins; where it endorses something the baseline would flag, suppress the smell.
- **Always a judgement call.** Each smell is a labelled heuristic ("possible Feature Envy"), never a hard violation. Like any standard here, skip anything tooling already enforces.

Each smell reads *what it is* → *how to fix*; match it against the diff:

- **Mysterious Name**: a function, variable, or type whose name doesn't reveal what it does or holds. → rename it; if no honest name comes, the design's murky.
- **Duplicated Code**: the same logic shape appears in more than one hunk or file in the change. → extract the shared shape, call it from both.
- **Feature Envy**: a method that reaches into another object's data more than its own. → move the method onto the data it envies.
- **Data Clumps**: the same few fields or params keep travelling together (a type wanting to be born). → bundle them into one type, pass that.
- **Primitive Obsession**: a primitive or string standing in for a domain concept that deserves its own type. → give the concept its own small type.
- **Repeated Switches**: the same `switch`/`if`-cascade on the same type recurs across the change. → replace with polymorphism, or one map both sites share.
- **Shotgun Surgery**: one logical change forces scattered edits across many files in the diff. → gather what changes together into one module.
- **Divergent Change**: one file or module is edited for several unrelated reasons. → split so each module changes for one reason.
- **Speculative Generality**: abstraction, parameters, or hooks added for needs the spec doesn't have. → delete it; inline back until a real need shows.
- **Message Chains**: long `a.b().c().d()` navigation the caller shouldn't depend on. → hide the walk behind one method on the first object.
- **Middle Man**: a class or function that mostly just delegates onward. → cut it, call the real target direct.
- **Refused Bequest**: a subclass or implementer that ignores or overrides most of what it inherits. → drop the inheritance, use composition.

### 4. Spawn both sub-agents in parallel

Issue both sub-agent calls together, in the foreground, and aggregate the reports they return. If subagents are unavailable, run each axis in turn and say so.

**Standards sub-agent prompt** should include:

- All review inputs from step 1: diff commands, commit list, and in-scope untracked paths. Review current file contents where the diffs overlap.
- The list of standards-source files you found in step 3, **plus the smell baseline from step 3** pasted in full (the sub-agent has no other access to it).
- The brief: "Report, per file/hunk where relevant, (a) every place the diff violates a documented standard: cite the standard (file + the rule); and (b) any baseline smell you spot: name it and quote the hunk. Distinguish hard violations from judgement calls: documented-standard breaches can be hard, but baseline smells are always judgement calls, and a documented repo standard overrides the baseline. Skip anything tooling enforces. Under 400 words."

**Spec sub-agent prompt** should include:

- All review inputs from step 1: diff commands, commit list, and in-scope untracked paths. Review current file contents where the diffs overlap.
- The spec contents: paste the ticket text from the conversation, or give the `.scratch/` file paths.
- The brief: "Report: (a) requirements the spec asked for that are missing or partial; (b) behaviour in the diff that wasn't asked for (scope creep); (c) requirements that look implemented but where the implementation looks wrong. Quote the spec line for each finding. Under 400 words."

If the spec is missing, skip the Spec sub-agent and note this in the final report.

### 5. Aggregate

Present the two reports under `## Standards` and `## Spec` headings, verbatim or lightly cleaned. Do **not** merge or rerank findings, because the two axes are deliberately separate (see _Why two axes_).

End with a one-line summary: total findings per axis, and the worst issue _within each axis_ (if any). Don't pick a single winner across axes: that's the reranking the separation exists to prevent.

## Why two axes

A change can pass one axis and fail the other:

- Code that follows every standard but implements the wrong thing → **Standards pass, Spec fail.**
- Code that does exactly what the issue asked but breaks the project's conventions → **Spec pass, Standards fail.**

Reporting them separately stops one axis from masking the other.
