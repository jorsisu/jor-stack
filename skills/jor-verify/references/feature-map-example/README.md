# Notes verification map

This directory is the maintained source for verifying the user-facing behavior of Notes. Read the index before driving the app, then use the matching feature file as the recipe.

## Baseline preconditions

- The user's dev server serves Notes at `http://localhost:5173`. Don't start or restart it; if `doctor` can't reach it, report `pnpm dev` as the start command and stop.
- Open every run in a fresh isolated context (`new_page` with `isolatedContext: "verify-notes"`) so the user's own tabs and storage are untouched.
- Seed notes titled `Quarterly plan` and `Grocery list` exist (run `pnpm seed:dev` if they don't, with the user's permission).
- Run `doctor` and require the Notes heading, no console errors, and no failed requests on load.

## Driving conventions

- Start every recipe from the baseline state unless its preconditions say otherwise.
- Take a snapshot before each interaction and use its uids; re-snapshot after every navigation.
- Prefer ARIA roles and accessible names over CSS selectors or DOM position.
- Treat every quoted name as literal.
- Restore seeded data after a mutation. Do not remove proof artifacts during cleanup.

## Proof and skip reporting

- Capture the user action and the resulting state, not only the final screen.
- UI proof includes a `take_snapshot` file and a screenshot with the app identity visible.
- Mutation proof includes a second, read-only view of the stored value (reopen it from the list).
- Responsive proof is `breakpoints` on the feature's route: 360, 768, 1280, 1440, 1920.
- Save artifacts under `.scratch/verify/<YYYYMMDD-HHMM>-<feature>/` and record the feature ID and entry point used.
- Report an unreachable path with the attempted route and the unmet precondition.
- Do not report a skipped entry point as verified through a different path.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph describing the user-visible behavior. It then uses exactly four H2 sections in this order.

1. `Sub-features` lists short IDs with one line for each behavior.
2. `How to get to it (user POV)` lists every user entry point and the route it lives on.
3. `Driving it with Chrome DevTools MCP` starts with `Preconditions:` and uses labeled bullets that pair each user action with the exact tool call and observable result.
4. `Gotchas` lists traps that can waste or invalidate a verification run.

Keep implementation details out of the map. Name only user paths, stable handles, required state, tool calls, and observable proof.

## Features

- [Create a note](./create-note.md) covers toolbar and keyboard creation, cancellation, persistence, and responsive layout.
