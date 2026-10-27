---
name: jor-verify
description: "Generate a project-local verify-<project> skill that drives the web app the way a user does through Chrome DevTools MCP, with doctor, breakpoints, and snapshot commands plus a feature map. Run once per project, or when a project has no scripted way to prove UI behavior."
disable-model-invocation: true
metadata:
  based-on: "cursor/plugins pstack/skills/create-verification-skill @ c49b37a2c0e7bede60a71ad7322e3f12c337a3da (SKILL.md, references/feature-map-example/); rebuilt on Chrome DevTools MCP"
---

# Create a verify skill

Every serious project needs a scripted way to drive the real app and prove behavior: open it, exercise a feature the way a user would, and capture evidence. This skill generates that as a project-local skill, `verify-<project>`, tailored to the repo and driven through **Chrome DevTools MCP**. You write the generator's output for the next agent, not for a human: it will be read cold, mid-task, by an agent that has never seen the app.

Other jor skills read `.agents/skills/verify-<project>/SKILL.md` first, then `.cursor/skills/verify-<project>/SKILL.md` if the first is missing. `jor-browser-review` follows its `doctor`, `breakpoints`, and feature map. `jor-debug` can drive the bug through it. `jor-prototype` follows it to drive and screenshot UI variants. `jor-verify-maintain` uses the same two folders. If neither file exists, those skills tell the user to run `/jor-verify`.

If Chrome DevTools MCP is not available in this session, stop and report that. Don't substitute another browser tool.

## 1. Interview the repo, not the user

Answer these from the codebase and only ask the user what you cannot observe:

- **Surface:** which web UI does a user actually touch? A repo can have several apps; pick the primary one and note the rest.
- **Run:** how does the app start locally? Find the repo's own documented dev command (package scripts, Makefile, README quickstart). Note the URL and port, env vars, seed data, and auth.
- **Drive:** which stable handles exist? ARIA roles and accessible names, `data-testid` or other data attributes, route paths. Read existing e2e specs for selectors and flows worth reusing, but drive with Chrome DevTools MCP.
- **Observe:** what evidence can be captured? Screenshots, accessibility snapshots, console messages, network requests, visible side effects.
- **Isolate:** is the dev server shared with the user's own session (same browser profile, same data)? If so, say so in the generated skill and use an isolated browser context (`new_page` with `isolatedContext`) for every run, so verification never corrupts the user's session.

**Start, stop, or restart dev servers only when the user explicitly requests it, including in worktrees.** Include this rule in the generated skill. By default, target the server the user already runs; if it isn't up, report the exact start command from the repo and stop.

Ask the user one decision up front: should `verify-<project>` be **shared** (committed with the repo) or **private** (kept out of git by adding its folder to `.git/info/exclude`)? Recommend private unless the team already shares agent skills. Never edit the shared `.gitignore`.

## 2. Generate the skill

Write the generated skill to `.agents/skills/verify-<project>/` (`SKILL.md` in that folder). If the project already uses `.cursor/skills/`, ask which location to use before writing. Either location works: readers look in `.agents/skills/verify-<project>/` first and in `.cursor/skills/verify-<project>/` if it is not there. Give it YAML frontmatter: `name: verify-<project>`, a `description` that names the app, the surface, and when to reach for it, and `disable-model-invocation: true`. Without frontmatter the skill never registers. Then write these sections, each grounded in what the interview actually found (no placeholders left):

- **Target:** the base URL, how to tell the app is ready (a route that renders a known heading, a health endpoint), and the repo's start command for the user to run when it's down. Ready means usable, not just that a port answers: a page that renders a spinner forever is not ready.
- **`doctor`:** one read-only health check that answers "is this instance worth driving?" Run it first, and again whenever anything looks off. Steps: `list_pages` / `new_page` on the base URL in an isolated context; `wait_for` the known ready text; `take_snapshot` and confirm the app identity (title, logo name, or heading); `list_console_messages` for errors on load; `list_network_requests` for failed requests (4xx/5xx, blocked) on load; confirm auth state if a feature needs a signed-in user. Report `healthy` or the exact failing check.
- **`breakpoints`:** screenshots of a given URL and target UI state at **360, 768, 1280, 1440, 1920** px wide. Record the feature-map actions that reach that state and its visible check (for example, an open editor and its Save button). For each width: `resize_page` (or `emulate` with `viewport` `<width>x900x1`, adding `,mobile,touch` for 360 and 768 when the app has touch-specific behavior), `navigate_page` reload, `wait_for` the ready text, then repeat the state setup through real UI actions. Confirm the target state with `take_snapshot` before `take_screenshot` with `fullPage: true` and a `filePath` named `<route-slug>-<state-slug>-<width>.png`. If setup fails, report that width as blocked rather than treating the default page as proof. Note overflow, clipped or wrapped navigation, hidden primary actions, and console errors per width. Reset the viewport (`emulate` with no `viewport`) when done.
- **`snapshot`:** capture the current page or DOM state as proof: `take_snapshot` to a `.txt` file (the accessibility tree with uids), plus a `take_screenshot`, plus `list_console_messages` and `list_network_requests` written out alongside. Use `evaluate_script` only for read-only checks a snapshot can't show (computed state, `localStorage`), never to set state.
- **Drive:** how to exercise features with real handles from this repo, not examples: `take_snapshot` to get uids, then `click`, `fill`, `fill_form`, `press_key`, `hover`, `wait_for` on visible text. Prefer accessible names and data attributes over coordinates and tab order; re-snapshot after every navigation because uids go stale.
- **Evidence:** where proof goes and the proof standards. Default location: `.scratch/verify/<YYYYMMDD-HHMM>-<feature>/` in the project, with `.scratch/` listed in `.git/info/exclude`. Exercise the real user path, not internal setters, test-only endpoints, or `evaluate_script` shortcuts; capture the action and the resulting state, not just the final screen; verify side effects (a saved value seen from a second view, a request in the network list) alongside what's visible; mocks only where a production boundary already isolates the external system.
- **Cleanup:** close only the pages and isolated contexts this run opened (`close_page`), reset emulation, and restore any data a drive mutated. Never close the user's own tabs or stop their servers. Cleanup removes pages and scratch state, never the evidence.
- **Helpers:** if the skill ships a script (a seed or reset script, a contact-sheet builder), make it executable and show its invocation in the skill body. A helper the reader has to reverse-engineer is not a helper.

## 3. Seed the feature map

Under the skill folder selected in step 2, create `features/README.md` plus one file per user-facing feature you can identify (aim for the top 3-5 to start, from routes, navigation, and docs). The default index is `.agents/skills/verify-<project>/features/README.md`; if the user chose `.cursor/skills/`, use `.cursor/skills/verify-<project>/features/README.md`. Follow the shape in [`references/feature-map-example/`](references/feature-map-example/), with a README index and one file per feature. Each file answers, from the user's point of view: what the feature is, how to reach it, how to drive it with Chrome DevTools MCP, and what observable end state proves it works. The four H2s are `Sub-features`, `How to get to it (user POV)`, `Driving it with Chrome DevTools MCP`, and `Gotchas`. Record the routes each feature lives on, so `breakpoints` can be run against them. If the seed data lacks a precondition that a journey needs, the journey reports a failure and the reason goes in that feature's `Gotchas`. Never weaken the journey to make it pass. The map is the repo's maintained verification source; a proof that drives one convenient entry point is incomplete when the map lists others.

## 4. Prove the generated skill before handing it over

Run its own instructions end to end once: `doctor`, drive ONE mapped feature (one is enough; the map exists so later runs can cover the rest), `snapshot` the end state, `breakpoints` on that feature's route, clean up. After cleanup, confirm the evidence still exists at the named location: a cleanup that eats the proof fails this step. Fix what fails, and run the generated cleanup after every failed iteration too, so broken attempts don't strand pages or emulation settings. A generated skill that was never executed is a draft, not a deliverable. If the dev server wasn't running and you couldn't prove it, say so plainly and list what stays unverified.

## 5. Offer the maintenance loop

Recommend the user run `/jor-verify-maintain` for keeping the map honest as the app changes: on demand, or after UI-heavy sprints.
