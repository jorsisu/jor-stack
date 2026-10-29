# Contributing

Bug reports and focused pull requests are welcome. Discuss new skills or workflow changes in an issue first. Include the agent app and version, plugin version, expected result, actual result, and a minimal example. Remove secrets, private code, and customer data.

## Make a change

1. Fork the repository and use a branch in your fork.
2. Keep each change focused. Preserve authorization boundaries, manual invocation settings, and optional browser checks.
3. For skill edits, follow [the writing guide](skills/jor-writing-for-agents/SKILL.md). Update affected README entries and `UPSTREAM.md`; keep the Mermaid source and README diagram in sync.
4. Add an entry under Unreleased in `CHANGELOG.md`. New logic needs a focused test; prose-only changes need the stack check.
5. Describe the change, checks actually run, and any unverified behavior in your pull request.

Use Ruby 2.6+ and Node.js 20+ on macOS or Linux for repository checks. No package installation is needed:

```sh
ruby scripts/validate-stack.rb
ruby scripts/validate-stack.test.rb
node --test skills/jor-verify/scripts/run-checks.test.mjs
```

Run the validator fixtures when changing validation, and runner tests when changing the runner or its test environment. CI runs all three. For packaging or workflow behavior changes, test the affected skills in the target app and report the app version; static checks do not prove installation or agent behavior.

Do not include local credentials, personal agent rules, `.scratch/` evidence, or generated private skills. Keep private files in Git's local exclude list. Review new files before staging.

## Licensing and conduct

Submit only material you have the right to share under the repository's [MIT license](LICENSE). Contributions are provided under that license. For copied or adapted material, record the source path and exact commit in `UPSTREAM.md`, set skill provenance, and preserve the applicable copyright and license text in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Check compatibility before adding material under another license.

Be respectful, discuss the work, and do not harass contributors or disclose their private information. Maintainers may remove abusive content or restrict participation. Send conduct concerns or security reports privately to the contact in [SECURITY.md](SECURITY.md).
