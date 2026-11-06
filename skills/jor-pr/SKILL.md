---
name: jor-pr
description: "Draft a PR title or body from the current change, branch commits, and observed evidence; follow the repository template."
disable-model-invocation: true
metadata:
  based-on: "mattpocock/skills skills/engineering/pr @ e484a8095543718ced436b9b49a8160ed4554000 (SKILL.md, CREDITS.md)"
  credits: "Optional visual guidance inspired by Dex Horthy's show-me skill (Humanlayer), https://github.com/humanlayer/skills/blob/main/plugins/show-me/skills/show-me/SKILL.md; see CREDITS.md"
  merged-from: "Jorge's generate-pr-message skill"
---

In Codex, use `$jor-...` for these commands, or `$jor-stack:jor-...` when the skill picker shows the plugin namespace.

Draft a PR title and body in chat by default. If the user asks for only one, draft only that. Use the current change, branch commits, request, review findings, and observed check results. Follow the repository's PR template when it defines the body structure; use the template below otherwise. Report missing evidence as unverified. Do not create a file unless asked. Committing, pushing, opening, or merging a PR needs separate authorization.

## Draft

1. Use the user's stated base, then an existing PR's base if available, then the repository's default branch. When revising an open PR, read its title and body and preserve still-relevant context. Inspect commits unique to the branch, reading subjects and short bodies as needed. Check the branch diff, staged and unstaged changes, and in-scope untracked files. Use `git` for local history and `gh` for existing PR context when available under repository rules. If no base resolves, use available changes without claiming full branch coverage.
2. For the title, write one concise line covering the relevant changes. In the body, cover relevant changes across commits without listing each commit. Include observed evidence the commits cannot provide. If commit subjects start with issue codes such as `ABC-123`, include each relevant code with its change in the body. Keep multiple codes distinct and use the template's issue field when it has one.
3. Before presenting, check that the requested title or body is copy-paste-ready Markdown, explains the change in plain language, follows the repository template, and labels unverified evidence. Output only the requested PR artifact.

## Body

Without a repository template, use H2 Summary and Verification headings. Add Risks only when a material risk or follow-up affects the merge decision. Use the project's domain terms from GLOSSARY.md when it exists.

- **Summary:** In one or two sentences, state the problem, change, and user-visible result. Lead with plain language.
- **Verification:** Name the relevant checks that ran, their results, and the environment or surface. Keep UAT, Storybook, local, and production evidence distinct. When environments differ, list the original observation and local check separately without Before/After labels. Include measurements only when they define acceptance or demonstrate the fault. State remaining unverified behavior.
- **Risks:** When material, name the affected scope and remaining verification in plain language. Do not use fixed Door or Blast Radius labels.
- **Visuals:** Use a diagram or diff sketch when requested or when it explains complex behavior more clearly than prose. Put the plain summary first. Label an illustrative sketch so readers do not mistake it for the actual code diff.

Reuse existing screenshots when useful. Do not start browser checks or development servers just to fill the body.
