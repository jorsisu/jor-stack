# Browser session safety

Use these rules for requested Chrome DevTools MCP checks, including runs without a generated project verification skill.

- Open a fresh isolated context for this run with `new_page` and a unique `isolatedContext` name. Leave the user's tabs and storage untouched.
- Before interactions, confirm the supplied app's identity, ready state, and required login. Check console errors and failed requests. If readiness fails, report the blocker; server control still requires an explicit request.
- Use disposable test data for mutations. Record original values before changing existing test data, and restore only this run's changes. Browser isolation does not isolate server data.
- Before saving evidence in `.scratch/`, resolve Git's local exclude file with `git rev-parse --git-path info/exclude` and ensure `.scratch/` is excluded. Stop evidence writes if exclusion fails; never edit the shared `.gitignore`.
- On success, failure, or interruption, reset emulation, close only this run's pages and contexts, and restore its data changes. Report any cleanup that could not finish.
- Keep screenshots, snapshots, and logs through cleanup; confirm they remain at the reported paths.
