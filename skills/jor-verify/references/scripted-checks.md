# Scripted checks

Use the bundled `scripts/run-checks.mjs` to run existing nonbrowser checks with short output and full logs. It needs Node.js and Git on macOS or Linux. It does not implement application assertions itself.

## Generate

1. Read the repo's existing check scripts and CI. Select the smallest useful repeatable baseline: lint, typecheck, or focused unit/integration tests. Inspect indirect package scripts, lifecycle hooks, and tool configuration defaults before adopting a command. Checks must leave product source and fixtures unchanged. Reject modes that rewrite those files, including auto-fix, formatting `--write`, code generation, and snapshot updates. Also exclude dependency installation, watch mode, server control, browser automation, and destructive commands. Choose a supported non-writing variant or report that check unavailable. Ordinary Git-ignored caches, build outputs, scratch files, and private logs are allowed. Keep browser actions in Chrome DevTools MCP.
2. Copy the bundled runner to the generated skill's `scripts/run-checks.mjs` and make it executable. Write `scripts/checks.json` beside it. Use only real commands found in this repo; do not copy an example command unless it exists. Do not put credentials in the plan; commands inherit the environment.
3. Define a nonempty JSON array of checks. Each check has a unique `name` of at most 64 characters containing only letters, digits, underscores, or hyphens, and a `command` array containing the executable followed by its literal arguments. Optional `timeoutMs` is a positive integer, at most 2147483647; the default is five minutes per check. The canonical plan file must live inside the target Git repo. Its location determines the root used for every command and its logs, independently of the caller's working directory. Shell syntax is not interpreted. Use the package manager's workspace flags for package-specific checks.

For a repo that actually defines `npm run typecheck`, one check could be:

```json
[
  { "name": "typecheck", "command": ["npm", "run", "typecheck"] }
]
```

If there are no meaningful executable checks, report scripted coverage as unavailable. Do not create an empty plan or a command that always succeeds to make setup pass. Browser evidence can still be collected under its own authorization, with the scripted coverage gap explicit.

## Document and run

Add a `checks` section to the generated skill. Record the plan's coverage and prerequisites, and show the exact command from the project root, using the selected folder and actual project name. For example:

```sh
node .agents/skills/verify-notes/scripts/run-checks.mjs .agents/skills/verify-notes/scripts/checks.json
```

Before running, ensure `.scratch/` is excluded using the generator's local-exclude procedure. The runner checks exclusion and refuses symbolic links for evidence folders; it never edits ignore files. Each run keeps its own logs under `.scratch/verify/checks-*/`, with the command, stdout, stderr, and exit result. Stdout reports one status and log path per check plus a count. Read only the failed check's relevant log lines; redact secrets before sharing them. The runner stops remaining workers in each check's process group after success, failure, timeout, or interruption.

The exit code is `0` only when every configured check exits successfully, `1` for a failed or timed-out check, `2` for blocked configuration, prerequisites, or evidence, and `130` when interrupted. Failed checks do not skip later checks; interruption stops the remaining plan. Missing commands, empty plans, and timeouts cannot pass. Nonzero results keep setup or maintenance incomplete until resolved or reported as blocked. Never drop or weaken a check merely to get green.

## Prove and maintain

During setup, run the generated command and confirm the logs survive cleanup. For any new or repaired assertion, first demonstrate that it catches the original fault or a safe temporary reproduction, then passes with the fix. Existing checks need a real observed run, not invented application mutations. Re-run affected checks after changes and report browser coverage separately: a successful command plan proves only its configured checks.

For CI reuse, the runner and plan must be shared and available in the checkout; private local skills are unavailable there. Use the same command in an existing CI job when that integration is requested. Configure local exclusion before the CI invocation too. Report configured CI separately from observed CI execution. Required status checks and branch rules remain separate repository settings; this generator does not enable them.

To check the bundled runner inside jor-stack, run `node --test skills/jor-verify/scripts/run-checks.test.mjs`.
